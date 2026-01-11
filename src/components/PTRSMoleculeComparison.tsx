import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, BarChart3, ArrowUpDown, FileText } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { type MoleculeProfile } from "@/lib/moleculesData";
import { PTRSComparisonPDFReport } from "./PTRSComparisonPDFReport";

interface PTRSMoleculeComparisonProps {
  molecules: MoleculeProfile[];
}

// PTRS calculation helper
const calculatePTRSForMolecule = (molecule: MoleculeProfile) => {
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

  const taKey = getTAKey(molecule.therapeuticArea);
  const phaseKey = getPhaseKey(molecule.phase);
  const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
  const phaseMultiplier = phaseMultipliers[phaseKey] || 1;

  // Calculate factors from molecule scores
  const mechanismNovelty = molecule.scores ? Math.round(molecule.scores.meetingEndpoints * 100) : 50;
  const endpointClarity = molecule.scores ? Math.round(molecule.scores.approval * 100) : 70;
  const priorTrialData = molecule.scores ? Math.round(molecule.scores.nextPhase * 100) : 60;
  const sponsorExperience = molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45;
  const regulatoryPrecedent = molecule.scores ? Math.round(molecule.scores.regulatoryPathway.accelerated * 100) : 75;
  const safetyProfile = molecule.scores ? Math.round((1 - molecule.scores.dropoutRanking / 5) * 100) : 70;

  // Calculate PTS
  const ptsAdjustment = (mechanismNovelty * 0.15 + endpointClarity * 0.25 + priorTrialData * 0.35 + sponsorExperience * 0.25) / 100;
  const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + ptsAdjustment)));

  // Calculate PRS
  const prsAdjustment = (regulatoryPrecedent * 0.4 + safetyProfile * 0.4 + sponsorExperience * 0.2) / 100;
  const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + prsAdjustment * 0.6)));

  // Calculate PTRS
  const ptrs = (pts / 100) * prs;

  return {
    pts: Math.round(pts * 10) / 10,
    prs: Math.round(prs * 10) / 10,
    ptrs: Math.round(ptrs * 10) / 10,
    factors: {
      mechanismNovelty,
      endpointClarity,
      priorTrialData,
      sponsorExperience,
      regulatoryPrecedent,
      safetyProfile,
    }
  };
};

export const PTRSMoleculeComparison = ({ molecules }: PTRSMoleculeComparisonProps) => {
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "radar" | "bar">("table");

  const handleAddMolecule = (moleculeId: string) => {
    if (moleculeId && !selectedMolecules.includes(moleculeId) && selectedMolecules.length < 5) {
      setSelectedMolecules([...selectedMolecules, moleculeId]);
    }
  };

  const handleRemoveMolecule = (moleculeId: string) => {
    setSelectedMolecules(selectedMolecules.filter(id => id !== moleculeId));
  };

  const comparisonData = selectedMolecules.map(id => {
    const molecule = molecules.find(m => m.id === id);
    if (!molecule) return null;
    const ptrsData = calculatePTRSForMolecule(molecule);
    return {
      id,
      name: molecule.name,
      company: molecule.company,
      phase: molecule.phase,
      ta: molecule.therapeuticArea,
      ...ptrsData,
    };
  }).filter(Boolean);

  // Radar chart data
  const radarData = [
    { factor: "Mechanism Novelty", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.mechanismNovelty])) },
    { factor: "Endpoint Clarity", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.endpointClarity])) },
    { factor: "Prior Trial Data", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.priorTrialData])) },
    { factor: "Sponsor Experience", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.sponsorExperience])) },
    { factor: "Regulatory Precedent", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.regulatoryPrecedent])) },
    { factor: "Safety Profile", ...Object.fromEntries(comparisonData.map(d => [d!.name.substring(0, 12), d!.factors.safetyProfile])) },
  ];

  // Bar chart data
  const barData = comparisonData.map(d => ({
    name: d!.name.substring(0, 15),
    PTS: d!.pts,
    PRS: d!.prs,
    PTRS: d!.ptrs,
  }));

  const colors = ["hsl(220, 70%, 50%)", "hsl(142, 71%, 45%)", "hsl(280, 70%, 50%)", "hsl(25, 95%, 53%)", "hsl(340, 80%, 55%)"];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-primary" />
          PTRS Molecule Comparison
        </CardTitle>
        <CardDescription>Compare PTRS scores across multiple molecules side-by-side</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Molecule Selector */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select onValueChange={handleAddMolecule} value="">
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Add molecule to compare (max 5)..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {molecules.slice(0, 50).filter(m => !selectedMolecules.includes(m.id)).map((mol) => (
                <SelectItem key={mol.id} value={mol.id}>
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{mol.name}</span>
                    <span className="text-muted-foreground text-xs">({mol.phase})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected molecules badges */}
          {selectedMolecules.map((id, idx) => {
            const mol = molecules.find(m => m.id === id);
            return mol ? (
              <Badge 
                key={id} 
                variant="secondary" 
                className="gap-1 py-1.5 px-3"
                style={{ borderColor: colors[idx], borderWidth: 2 }}
              >
                {mol.name.substring(0, 20)}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => handleRemoveMolecule(id)}
                />
              </Badge>
            ) : null;
          })}
        </div>

        {selectedMolecules.length > 0 && (
          <>
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button variant={viewMode === "table" ? "default" : "outline"} size="sm" onClick={() => setViewMode("table")}>Table</Button>
              <Button variant={viewMode === "radar" ? "default" : "outline"} size="sm" onClick={() => setViewMode("radar")}>Radar</Button>
              <Button variant={viewMode === "bar" ? "default" : "outline"} size="sm" onClick={() => setViewMode("bar")}>Bar Chart</Button>
            </div>

            {/* Table View */}
            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">Molecule</th>
                      <th className="text-center p-3 font-medium">Phase</th>
                      <th className="text-center p-3 font-medium text-blue-600">PTS</th>
                      <th className="text-center p-3 font-medium text-green-600">PRS</th>
                      <th className="text-center p-3 font-medium text-purple-600">PTRS</th>
                      <th className="text-center p-3 font-medium">Mechanism</th>
                      <th className="text-center p-3 font-medium">Safety</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((data, idx) => (
                      <tr key={data!.id} className="border-b hover:bg-muted/30">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx] }} />
                            <div>
                              <p className="font-medium">{data!.name}</p>
                              <p className="text-xs text-muted-foreground">{data!.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline">{data!.phase}</Badge>
                        </td>
                        <td className="text-center p-3 font-semibold text-blue-600">{data!.pts}%</td>
                        <td className="text-center p-3 font-semibold text-green-600">{data!.prs}%</td>
                        <td className="text-center p-3">
                          <span className={`font-bold text-lg ${data!.ptrs > 20 ? 'text-green-600' : data!.ptrs > 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {data!.ptrs}%
                          </span>
                        </td>
                        <td className="text-center p-3">{data!.factors.mechanismNovelty}%</td>
                        <td className="text-center p-3">{data!.factors.safetyProfile}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Radar View */}
            {viewMode === "radar" && (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    {comparisonData.map((d, idx) => (
                      <Radar
                        key={d!.id}
                        name={d!.name.substring(0, 12)}
                        dataKey={d!.name.substring(0, 12)}
                        stroke={colors[idx]}
                        fill={colors[idx]}
                        fillOpacity={0.2}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bar Chart View */}
            {viewMode === "bar" && (
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="PTS" fill="hsl(220, 70%, 50%)" name="PTS (%)" />
                    <Bar dataKey="PRS" fill="hsl(142, 71%, 45%)" name="PRS (%)" />
                    <Bar dataKey="PTRS" fill="hsl(280, 70%, 50%)" name="PTRS (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Summary Stats */}
            {comparisonData.length > 1 && (
              <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-blue-600">Highest PTS</p>
                  <p className="text-xl font-bold">{comparisonData.reduce((max, d) => d!.pts > max.pts ? d! : max, comparisonData[0]!)!.name.substring(0, 15)}</p>
                  <p className="text-lg text-blue-600">{Math.max(...comparisonData.map(d => d!.pts))}%</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-green-600">Highest PRS</p>
                  <p className="text-xl font-bold">{comparisonData.reduce((max, d) => d!.prs > max.prs ? d! : max, comparisonData[0]!)!.name.substring(0, 15)}</p>
                  <p className="text-lg text-green-600">{Math.max(...comparisonData.map(d => d!.prs))}%</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-purple-600">Highest PTRS</p>
                  <p className="text-xl font-bold">{comparisonData.reduce((max, d) => d!.ptrs > max.ptrs ? d! : max, comparisonData[0]!)!.name.substring(0, 15)}</p>
                  <p className="text-lg text-purple-600">{Math.max(...comparisonData.map(d => d!.ptrs))}%</p>
                </div>
              </div>
            )}
          </>
        )}

        {selectedMolecules.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Select molecules above to compare their PTRS scores</p>
            <p className="text-sm mt-1">You can compare up to 5 molecules at once</p>
          </div>
        )}

        {/* PDF Report Export */}
        {selectedMolecules.length > 0 && (
          <PTRSComparisonPDFReport 
            molecules={molecules} 
            selectedMoleculeIds={selectedMolecules} 
          />
        )}
      </CardContent>
    </Card>
  );
};
