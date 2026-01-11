import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Legend, Tooltip, BarChart, Bar
} from "recharts";
import { 
  GitCompare, TrendingUp, BarChart3, Target, Plus, X, Download
} from "lucide-react";
import { 
  runMonteCarloSimulation, 
  type ComponentUncertainty,
  type SimulationResult
} from "@/lib/monteCarloSimulation";
import { type MoleculeProfile } from "@/lib/moleculesData";
import html2pdf from "html2pdf.js";

interface PTRSMonteCarloComparisonProps {
  molecules: MoleculeProfile[];
}

interface MoleculeSimulation {
  molecule: MoleculeProfile;
  result: SimulationResult;
  ptrsStats: {
    mean: number;
    median: number;
    stdDev: number;
    p5: number;
    p95: number;
    prob10Plus: number;
    prob15Plus: number;
    prob20Plus: number;
  };
  distribution: Array<{ midpoint: number; percentage: number }>;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(142, 71%, 45%)',
  'hsl(45, 93%, 47%)',
  'hsl(280, 87%, 65%)',
  'hsl(0, 84%, 60%)',
];

export const PTRSMonteCarloComparison: React.FC<PTRSMonteCarloComparisonProps> = ({ molecules }) => {
  const [selectedMoleculeIds, setSelectedMoleculeIds] = useState<string[]>([]);
  const [iterations, setIterations] = useState(10000);
  const [uncertaintyRange, setUncertaintyRange] = useState(15);
  const [activeView, setActiveView] = useState<"overlay" | "sidebyside" | "statistics">("overlay");

  const taBaseRates: Record<string, { pts: number; prs: number }> = {
    oncology: { pts: 12, prs: 82 },
    cns: { pts: 8, prs: 78 },
    cardiovascular: { pts: 15, prs: 85 },
    infectious: { pts: 22, prs: 88 },
    immunology: { pts: 18, prs: 84 },
    metabolic: { pts: 16, prs: 86 },
    rareDisease: { pts: 25, prs: 90 },
    dermatology: { pts: 20, prs: 87 },
  };

  const phaseMultipliers: Record<string, number> = {
    preclinical: 0.3,
    phase1: 0.5,
    phase2: 0.75,
    phase3: 1.2,
    nda: 1.5,
    approved: 2.0,
  };

  const getTAKey = (ta: string): string => {
    const taLower = ta.toLowerCase();
    if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
    if (taLower.includes("cns") || taLower.includes("neurology")) return "cns";
    if (taLower.includes("cardio")) return "cardiovascular";
    if (taLower.includes("infectious")) return "infectious";
    if (taLower.includes("immun")) return "immunology";
    if (taLower.includes("metabol") || taLower.includes("endocr") || taLower.includes("diabetes") || taLower.includes("obesity")) return "metabolic";
    if (taLower.includes("rare")) return "rareDisease";
    if (taLower.includes("derma")) return "dermatology";
    return "oncology";
  };

  const getPhaseKey = (phase: string): string => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("preclinical")) return "preclinical";
    if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return "phase1";
    if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return "phase2";
    if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return "phase3";
    if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return "nda";
    if (phaseLower.includes("approved")) return "approved";
    return "phase2";
  };

  const getMoleculeComponentScores = (molecule: MoleculeProfile): ComponentUncertainty[] => {
    const scores = molecule.scores;
    return [
      { name: 'Mechanism Novelty', baseScore: Math.round((scores?.meetingEndpoints || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Endpoint Clarity', baseScore: Math.round((scores?.approval || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Prior Trial Data', baseScore: Math.round((scores?.nextPhase || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Sponsor Experience', baseScore: molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Regulatory Precedent', baseScore: Math.round((scores?.regulatoryPathway?.accelerated || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Safety Profile', baseScore: Math.round((1 - (scores?.dropoutRanking || 2.5) / 5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
    ];
  };

  const simulateMolecule = (molecule: MoleculeProfile): MoleculeSimulation => {
    const componentScores = getMoleculeComponentScores(molecule);
    const result = runMonteCarloSimulation(componentScores, { iterations, uncertaintyRange, confidenceInterval: 95 });
    
    const taKey = getTAKey(molecule.therapeuticArea);
    const phaseKey = getPhaseKey(molecule.phase);
    const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
    const phaseMultiplier = phaseMultipliers[phaseKey] || 1;
    
    const ptrsValues = result.compositeScoreDistribution.map(composite => {
      const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + composite / 100)));
      const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + composite / 100 * 0.6)));
      return (pts / 100) * prs;
    });
    
    const sorted = [...ptrsValues].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = ptrsValues.reduce((s, v) => s + v, 0) / n;
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const variance = ptrsValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    // Create distribution histogram
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const binCount = 25;
    const binWidth = (max - min) / binCount;
    
    const distribution = [];
    for (let i = 0; i < binCount; i++) {
      const minValue = min + i * binWidth;
      const maxValue = min + (i + 1) * binWidth;
      const count = ptrsValues.filter(v => v >= minValue && v < maxValue).length;
      distribution.push({
        midpoint: (minValue + maxValue) / 2,
        percentage: Math.round(count / n * 1000) / 10,
      });
    }

    return {
      molecule,
      result,
      ptrsStats: {
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
        p5: Math.round(sorted[Math.floor(0.05 * n)] * 100) / 100,
        p95: Math.round(sorted[Math.floor(0.95 * n)] * 100) / 100,
        prob10Plus: Math.round((ptrsValues.filter(v => v >= 10).length / n) * 1000) / 10,
        prob15Plus: Math.round((ptrsValues.filter(v => v >= 15).length / n) * 1000) / 10,
        prob20Plus: Math.round((ptrsValues.filter(v => v >= 20).length / n) * 1000) / 10,
      },
      distribution,
    };
  };

  const simulations = useMemo<MoleculeSimulation[]>(() => {
    return selectedMoleculeIds
      .map(id => molecules.find(m => m.id === id))
      .filter((m): m is MoleculeProfile => m !== undefined)
      .map(simulateMolecule);
  }, [selectedMoleculeIds, molecules, iterations, uncertaintyRange]);

  const overlayData = useMemo(() => {
    if (simulations.length === 0) return [];
    
    const allMidpoints = new Set<number>();
    simulations.forEach(sim => {
      sim.distribution.forEach(d => allMidpoints.add(Math.round(d.midpoint * 10) / 10));
    });
    
    const sortedMidpoints = Array.from(allMidpoints).sort((a, b) => a - b);
    
    return sortedMidpoints.map(midpoint => {
      const dataPoint: Record<string, number | string> = { midpoint: `${midpoint.toFixed(1)}%` };
      simulations.forEach((sim, idx) => {
        const closest = sim.distribution.reduce((prev, curr) => 
          Math.abs(curr.midpoint - midpoint) < Math.abs(prev.midpoint - midpoint) ? curr : prev
        );
        dataPoint[`molecule${idx}`] = Math.abs(closest.midpoint - midpoint) < 1 ? closest.percentage : 0;
      });
      return dataPoint;
    });
  }, [simulations]);

  const handleAddMolecule = (moleculeId: string) => {
    if (selectedMoleculeIds.length < 5 && !selectedMoleculeIds.includes(moleculeId)) {
      setSelectedMoleculeIds([...selectedMoleculeIds, moleculeId]);
    }
  };

  const handleRemoveMolecule = (moleculeId: string) => {
    setSelectedMoleculeIds(selectedMoleculeIds.filter(id => id !== moleculeId));
  };

  const availableMolecules = molecules.filter(m => !selectedMoleculeIds.includes(m.id));

  const handleExportPDF = async () => {
    const element = document.getElementById('ptrs-mc-comparison-content');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: 'PTRS_MonteCarlo_Comparison.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6" id="ptrs-mc-comparison-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Monte Carlo Distribution Comparison
          </h3>
          <p className="text-sm text-muted-foreground">
            Compare probability distributions for up to 5 molecules side-by-side
          </p>
        </div>
        {simulations.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        )}
      </div>

      {/* Molecule Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Select Molecules to Compare</CardTitle>
          <CardDescription>Choose up to 5 molecules for side-by-side simulation comparison</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {simulations.map((sim, idx) => (
              <Badge 
                key={sim.molecule.id} 
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
                style={{ borderLeftColor: COLORS[idx], borderLeftWidth: '3px' }}
              >
                {sim.molecule.name}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveMolecule(sim.molecule.id)}
                />
              </Badge>
            ))}
          </div>
          
          {selectedMoleculeIds.length < 5 && (
            <div className="flex items-center gap-2">
              <Select onValueChange={handleAddMolecule}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Add molecule to compare..." />
                </SelectTrigger>
                <SelectContent>
                  {availableMolecules.slice(0, 50).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.phase})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Plus className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {5 - selectedMoleculeIds.length} slots remaining
              </span>
            </div>
          )}

          {/* Simulation Settings */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-2">
              <Label className="text-sm">Iterations:</Label>
              <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                  <SelectItem value="25000">25,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Uncertainty:</Label>
              <Select value={uncertaintyRange.toString()} onValueChange={(v) => setUncertaintyRange(parseInt(v))}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">±10%</SelectItem>
                  <SelectItem value="15">±15%</SelectItem>
                  <SelectItem value="20">±20%</SelectItem>
                  <SelectItem value="25">±25%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Views */}
      {simulations.length > 0 && (
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overlay">
              <TrendingUp className="h-4 w-4 mr-2" />
              Overlaid Distributions
            </TabsTrigger>
            <TabsTrigger value="sidebyside">
              <BarChart3 className="h-4 w-4 mr-2" />
              Side-by-Side
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <Target className="h-4 w-4 mr-2" />
              Statistics Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overlay" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Overlaid PTRS Probability Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overlayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="midpoint" tick={{ fontSize: 10 }} />
                      <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      {simulations.map((sim, idx) => (
                        <Area
                          key={sim.molecule.id}
                          type="monotone"
                          dataKey={`molecule${idx}`}
                          name={sim.molecule.name}
                          stroke={COLORS[idx]}
                          fill={COLORS[idx]}
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sidebyside" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {simulations.map((sim, idx) => (
                <Card key={sim.molecule.id} style={{ borderTopColor: COLORS[idx], borderTopWidth: '3px' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{sim.molecule.name}</CardTitle>
                    <CardDescription>{sim.molecule.phase} • {sim.molecule.therapeuticArea}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sim.distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="midpoint" tickFormatter={(v) => `${v.toFixed(0)}%`} tick={{ fontSize: 9 }} />
                          <YAxis tick={{ fontSize: 9 }} />
                          <Tooltip formatter={(value) => [`${value}%`, 'Probability']} />
                          <Area
                            type="monotone"
                            dataKey="percentage"
                            stroke={COLORS[idx]}
                            fill={COLORS[idx]}
                            fillOpacity={0.4}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-primary">{sim.ptrsStats.mean}%</p>
                        <p className="text-xs text-muted-foreground">Mean</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">{sim.ptrsStats.p5}% - {sim.ptrsStats.p95}%</p>
                        <p className="text-xs text-muted-foreground">90% CI</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-green-600">{sim.ptrsStats.prob15Plus}%</p>
                        <p className="text-xs text-muted-foreground">P(≥15%)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="statistics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistical Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-3 font-medium">Molecule</th>
                        <th className="text-center p-3 font-medium">Mean PTRS</th>
                        <th className="text-center p-3 font-medium">Median</th>
                        <th className="text-center p-3 font-medium">Std Dev</th>
                        <th className="text-center p-3 font-medium">90% CI</th>
                        <th className="text-center p-3 font-medium">P(≥10%)</th>
                        <th className="text-center p-3 font-medium">P(≥15%)</th>
                        <th className="text-center p-3 font-medium">P(≥20%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulations.map((sim, idx) => (
                        <tr key={sim.molecule.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[idx] }}
                              />
                              <span className="font-medium">{sim.molecule.name}</span>
                            </div>
                          </td>
                          <td className="text-center p-3 font-bold text-primary">{sim.ptrsStats.mean}%</td>
                          <td className="text-center p-3">{sim.ptrsStats.median}%</td>
                          <td className="text-center p-3">±{sim.ptrsStats.stdDev}%</td>
                          <td className="text-center p-3">{sim.ptrsStats.p5}% - {sim.ptrsStats.p95}%</td>
                          <td className="text-center p-3">
                            <Badge variant={sim.ptrsStats.prob10Plus > 70 ? "default" : "secondary"}>
                              {sim.ptrsStats.prob10Plus}%
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <Badge variant={sim.ptrsStats.prob15Plus > 50 ? "default" : "secondary"}>
                              {sim.ptrsStats.prob15Plus}%
                            </Badge>
                          </td>
                          <td className="text-center p-3">
                            <Badge variant={sim.ptrsStats.prob20Plus > 30 ? "default" : "secondary"}>
                              {sim.ptrsStats.prob20Plus}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bar Chart Comparison */}
                <div className="mt-6 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={simulations.map((sim, idx) => ({
                        name: sim.molecule.name.slice(0, 15),
                        mean: sim.ptrsStats.mean,
                        'P(≥15%)': sim.ptrsStats.prob15Plus,
                        fill: COLORS[idx],
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mean" name="Mean PTRS %" fill="hsl(var(--primary))" />
                      <Bar dataKey="P(≥15%)" name="P(PTRS ≥15%)" fill="hsl(142, 71%, 45%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {simulations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <GitCompare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select molecules above to compare their PTRS probability distributions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
