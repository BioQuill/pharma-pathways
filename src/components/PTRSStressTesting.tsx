import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Legend, Tooltip, BarChart, Bar,
  ComposedChart, Line, ReferenceLine
} from "recharts";
import { 
  AlertTriangle, Zap, Shield, TrendingDown, Activity,
  Download, RefreshCw, AlertOctagon, CheckCircle, XCircle
} from "lucide-react";
import { 
  runMonteCarloSimulation, 
  type ComponentUncertainty,
  type SimulationResult
} from "@/lib/monteCarloSimulation";
import { type MoleculeProfile } from "@/lib/moleculesData";
import html2pdf from "html2pdf.js";

interface PTRSStressTestingProps {
  molecules: MoleculeProfile[];
}

interface StressScenario {
  id: string;
  name: string;
  description: string;
  severity: 'moderate' | 'severe' | 'extreme';
  icon: React.ReactNode;
  adjustments: Record<string, number>;
}

interface StressTestResult {
  scenario: StressScenario;
  basePTRS: number;
  stressedPTRS: number;
  ptrsDelta: number;
  deltaPercent: number;
  prob10Plus: number;
  prob15Plus: number;
  riskRating: 'low' | 'medium' | 'high' | 'critical';
  distribution: Array<{ midpoint: number; base: number; stressed: number }>;
}

const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'regulatory_rejection',
    name: 'Regulatory Rejection',
    description: 'Complete Rejection Letter (CRL) with major clinical deficiencies',
    severity: 'extreme',
    icon: <XCircle className="h-4 w-4" />,
    adjustments: {
      'Regulatory Precedent': -0.50,
      'Sponsor Experience': -0.20,
      'Endpoint Clarity': -0.30,
    },
  },
  {
    id: 'safety_signal',
    name: 'Major Safety Signal',
    description: 'Unexpected serious adverse events requiring protocol amendment',
    severity: 'extreme',
    icon: <AlertOctagon className="h-4 w-4" />,
    adjustments: {
      'Safety Profile': -0.60,
      'Prior Trial Data': -0.30,
      'Regulatory Precedent': -0.25,
    },
  },
  {
    id: 'efficacy_miss',
    name: 'Primary Endpoint Miss',
    description: 'Failed to meet primary efficacy endpoint in pivotal trial',
    severity: 'severe',
    icon: <TrendingDown className="h-4 w-4" />,
    adjustments: {
      'Prior Trial Data': -0.45,
      'Endpoint Clarity': -0.35,
      'Mechanism Novelty': -0.20,
    },
  },
  {
    id: 'competitive_entry',
    name: 'Competitive Drug Approval',
    description: 'First-in-class competitor gains approval, altering landscape',
    severity: 'moderate',
    icon: <Shield className="h-4 w-4" />,
    adjustments: {
      'Mechanism Novelty': -0.35,
      'Regulatory Precedent': 0.10, // May help with precedent
      'Sponsor Experience': -0.10,
    },
  },
  {
    id: 'sponsor_issues',
    name: 'Sponsor Financial Distress',
    description: 'Budget cuts leading to trial delays or reduced scope',
    severity: 'moderate',
    icon: <AlertTriangle className="h-4 w-4" />,
    adjustments: {
      'Sponsor Experience': -0.40,
      'Prior Trial Data': -0.15,
    },
  },
  {
    id: 'manufacturing_failure',
    name: 'Manufacturing Failure',
    description: 'CMC issues causing supply disruption or FDA warning letter',
    severity: 'severe',
    icon: <Zap className="h-4 w-4" />,
    adjustments: {
      'Sponsor Experience': -0.35,
      'Regulatory Precedent': -0.30,
      'Safety Profile': -0.15,
    },
  },
  {
    id: 'enrollment_crisis',
    name: 'Enrollment Crisis',
    description: 'Significant delays in patient recruitment affecting timeline',
    severity: 'moderate',
    icon: <Activity className="h-4 w-4" />,
    adjustments: {
      'Sponsor Experience': -0.25,
      'Prior Trial Data': -0.20,
      'Endpoint Clarity': -0.15,
    },
  },
  {
    id: 'pandemic_disruption',
    name: 'Global Health Disruption',
    description: 'Pandemic or similar event causing widespread trial interruption',
    severity: 'severe',
    icon: <AlertTriangle className="h-4 w-4" />,
    adjustments: {
      'Prior Trial Data': -0.35,
      'Sponsor Experience': -0.20,
      'Endpoint Clarity': -0.25,
      'Safety Profile': -0.10,
    },
  },
];

export const PTRSStressTesting: React.FC<PTRSStressTestingProps> = ({ molecules }) => {
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('');
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['regulatory_rejection', 'safety_signal', 'efficacy_miss']);
  const [iterations, setIterations] = useState(10000);
  const [showAllScenarios, setShowAllScenarios] = useState(false);
  const [activeView, setActiveView] = useState<"impact" | "distribution" | "comparison">("impact");

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

  const selectedMolecule = molecules.find(m => m.id === selectedMoleculeId);

  const getMoleculeComponentScores = (molecule: MoleculeProfile, adjustments?: Record<string, number>): ComponentUncertainty[] => {
    const scores = molecule.scores;
    const baseScores = [
      { name: 'Mechanism Novelty', baseScore: Math.round((scores?.meetingEndpoints || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Endpoint Clarity', baseScore: Math.round((scores?.approval || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Prior Trial Data', baseScore: Math.round((scores?.nextPhase || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Sponsor Experience', baseScore: molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Regulatory Precedent', baseScore: Math.round((scores?.regulatoryPathway?.accelerated || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Safety Profile', baseScore: Math.round((1 - (scores?.dropoutRanking || 2.5) / 5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
    ];

    if (adjustments) {
      return baseScores.map(score => ({
        ...score,
        baseScore: Math.max(0, Math.min(100, score.baseScore * (1 + (adjustments[score.name] || 0)))),
      }));
    }

    return baseScores;
  };

  const calculatePTRSFromSimulation = (result: SimulationResult, molecule: MoleculeProfile) => {
    const taKey = getTAKey(molecule.therapeuticArea);
    const phaseKey = getPhaseKey(molecule.phase);
    const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
    const phaseMultiplier = phaseMultipliers[phaseKey] || 1;
    
    const ptrsValues = result.compositeScoreDistribution.map(composite => {
      const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + composite / 100)));
      const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + composite / 100 * 0.6)));
      return (pts / 100) * prs;
    });
    
    const n = ptrsValues.length;
    const mean = ptrsValues.reduce((s, v) => s + v, 0) / n;
    const prob10Plus = (ptrsValues.filter(v => v >= 10).length / n) * 100;
    const prob15Plus = (ptrsValues.filter(v => v >= 15).length / n) * 100;

    // Create distribution
    const sorted = [...ptrsValues].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const binCount = 20;
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
      mean: Math.round(mean * 100) / 100,
      prob10Plus: Math.round(prob10Plus * 10) / 10,
      prob15Plus: Math.round(prob15Plus * 10) / 10,
      distribution,
    };
  };

  const stressTestResults = useMemo<StressTestResult[]>(() => {
    if (!selectedMolecule) return [];

    const baseComponents = getMoleculeComponentScores(selectedMolecule);
    const baseResult = runMonteCarloSimulation(baseComponents, { iterations, uncertaintyRange: 15, confidenceInterval: 95 });
    const basePTRS = calculatePTRSFromSimulation(baseResult, selectedMolecule);

    return selectedScenarios
      .map(scenarioId => STRESS_SCENARIOS.find(s => s.id === scenarioId))
      .filter((s): s is StressScenario => s !== undefined)
      .map(scenario => {
        const stressedComponents = getMoleculeComponentScores(selectedMolecule, scenario.adjustments);
        const stressedResult = runMonteCarloSimulation(stressedComponents, { iterations, uncertaintyRange: 15, confidenceInterval: 95 });
        const stressedPTRS = calculatePTRSFromSimulation(stressedResult, selectedMolecule);

        const ptrsDelta = stressedPTRS.mean - basePTRS.mean;
        const deltaPercent = (ptrsDelta / basePTRS.mean) * 100;

        // Create combined distribution for comparison
        const combinedDistribution = basePTRS.distribution.map((base, idx) => ({
          midpoint: base.midpoint,
          base: base.percentage,
          stressed: stressedPTRS.distribution[idx]?.percentage || 0,
        }));

        let riskRating: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (deltaPercent < -50) riskRating = 'critical';
        else if (deltaPercent < -30) riskRating = 'high';
        else if (deltaPercent < -15) riskRating = 'medium';

        return {
          scenario,
          basePTRS: basePTRS.mean,
          stressedPTRS: stressedPTRS.mean,
          ptrsDelta,
          deltaPercent: Math.round(deltaPercent * 10) / 10,
          prob10Plus: stressedPTRS.prob10Plus,
          prob15Plus: stressedPTRS.prob15Plus,
          riskRating,
          distribution: combinedDistribution,
        };
      });
  }, [selectedMolecule, selectedScenarios, iterations]);

  const toggleScenario = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId));
    } else if (selectedScenarios.length < 5) {
      setSelectedScenarios([...selectedScenarios, scenarioId]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'text-red-600 bg-red-50 border-red-200';
      case 'severe': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('ptrs-stress-test-content');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: `PTRS_StressTest_${selectedMolecule?.name || 'Analysis'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6" id="ptrs-stress-test-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Monte Carlo Stress Testing
          </h3>
          <p className="text-sm text-muted-foreground">
            Simulate extreme scenarios and assess PTRS resilience under stress
          </p>
        </div>
        {stressTestResults.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        )}
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Stress Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="text-sm mb-2 block">Select Molecule</Label>
              <Select value={selectedMoleculeId} onValueChange={setSelectedMoleculeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a molecule to stress test..." />
                </SelectTrigger>
                <SelectContent>
                  {molecules.slice(0, 50).map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.phase})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Iterations</Label>
              <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                  <SelectItem value="25000">25,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm">Select Stress Scenarios (max 5)</Label>
              <div className="flex items-center gap-2">
                <Switch checked={showAllScenarios} onCheckedChange={setShowAllScenarios} />
                <span className="text-xs text-muted-foreground">Show all</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {(showAllScenarios ? STRESS_SCENARIOS : STRESS_SCENARIOS.slice(0, 4)).map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => toggleScenario(scenario.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedScenarios.includes(scenario.id)
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className={getSeverityColor(scenario.severity)}>
                      {scenario.icon}
                      <span className="ml-1 capitalize">{scenario.severity}</span>
                    </Badge>
                  </div>
                  <p className="text-sm font-medium">{scenario.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {selectedMolecule && stressTestResults.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-primary/5">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stressTestResults[0]?.basePTRS}%</p>
                <p className="text-xs text-muted-foreground">Base PTRS</p>
              </CardContent>
            </Card>
            <Card className="bg-destructive/10">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">
                  {Math.min(...stressTestResults.map(r => r.stressedPTRS)).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Worst Case PTRS</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {Math.round(stressTestResults.reduce((s, r) => s + Math.abs(r.deltaPercent), 0) / stressTestResults.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Impact</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {stressTestResults.filter(r => r.riskRating === 'critical' || r.riskRating === 'high').length}
                </p>
                <p className="text-xs text-muted-foreground">High Risk Scenarios</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
              <TabsTrigger value="distribution">Distribution Shift</TabsTrigger>
              <TabsTrigger value="comparison">Scenario Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="impact" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stress Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stressTestResults.map(result => (
                      <div key={result.scenario.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getSeverityColor(result.scenario.severity)}>
                              {result.scenario.icon}
                              {result.scenario.severity}
                            </Badge>
                            <span className="font-medium">{result.scenario.name}</span>
                          </div>
                          <Badge className={`${getRiskColor(result.riskRating)} text-white`}>
                            {result.riskRating.toUpperCase()} RISK
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div>
                            <p className="text-lg font-bold">{result.basePTRS}%</p>
                            <p className="text-xs text-muted-foreground">Base</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-destructive">{result.stressedPTRS}%</p>
                            <p className="text-xs text-muted-foreground">Stressed</p>
                          </div>
                          <div>
                            <p className={`text-lg font-bold ${result.ptrsDelta < 0 ? 'text-destructive' : 'text-green-600'}`}>
                              {result.ptrsDelta > 0 ? '+' : ''}{result.ptrsDelta.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Delta</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold">{result.prob15Plus}%</p>
                            <p className="text-xs text-muted-foreground">P(≥15%)</p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>PTRS Impact</span>
                            <span>{result.deltaPercent}%</span>
                          </div>
                          <Progress 
                            value={Math.min(100, Math.abs(result.deltaPercent))} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stressTestResults.map(result => (
                  <Card key={result.scenario.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Badge variant="outline" className={getSeverityColor(result.scenario.severity)}>
                          {result.scenario.icon}
                        </Badge>
                        {result.scenario.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={result.distribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="midpoint" 
                              tickFormatter={(v) => `${v.toFixed(0)}%`} 
                              tick={{ fontSize: 9 }} 
                            />
                            <YAxis tick={{ fontSize: 9 }} />
                            <Tooltip 
                              formatter={(value, name) => [`${value}%`, name === 'base' ? 'Base' : 'Stressed']}
                              labelFormatter={(v) => `PTRS: ${Number(v).toFixed(1)}%`}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="base"
                              name="Base"
                              stroke="hsl(var(--primary))"
                              fill="hsl(var(--primary))"
                              fillOpacity={0.3}
                            />
                            <Area
                              type="monotone"
                              dataKey="stressed"
                              name="Stressed"
                              stroke="hsl(var(--destructive))"
                              fill="hsl(var(--destructive))"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scenario Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={stressTestResults.map(r => ({
                          name: r.scenario.name.slice(0, 15),
                          base: r.basePTRS,
                          stressed: r.stressedPTRS,
                          delta: Math.abs(r.deltaPercent),
                        }))}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 'auto']} />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="base" name="Base PTRS" fill="hsl(var(--primary))" barSize={15} />
                        <Bar dataKey="stressed" name="Stressed PTRS" fill="hsl(var(--destructive))" barSize={15} />
                        <Line type="monotone" dataKey="delta" name="Impact %" stroke="hsl(45, 93%, 47%)" strokeWidth={2} />
                        <ReferenceLine x={10} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" label="10% Threshold" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Empty State */}
      {!selectedMolecule && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Select a molecule above to run stress tests</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
