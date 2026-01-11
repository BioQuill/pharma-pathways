import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from "recharts";
import { type MoleculeProfile } from "@/lib/moleculesData";

interface PTRSHistoricalTrackingProps {
  molecules: MoleculeProfile[];
}

// PTRS calculation for different phases
const calculatePTRSByPhase = (molecule: MoleculeProfile, phaseKey: string) => {
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

  const taKey = getTAKey(molecule.therapeuticArea);
  const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
  const phaseMultiplier = phaseMultipliers[phaseKey] || 1;

  // Base factors with some variation by phase (earlier = more uncertainty)
  const phaseUncertainty: Record<string, number> = {
    preclinical: 0.6,
    phase1: 0.75,
    phase2: 0.85,
    phase3: 0.95,
    nda: 1.0,
    approved: 1.0,
  };

  const uncertainty = phaseUncertainty[phaseKey] || 0.85;
  const mechanismNovelty = molecule.scores ? Math.round(molecule.scores.meetingEndpoints * 100 * uncertainty) : 50;
  const endpointClarity = molecule.scores ? Math.round(molecule.scores.approval * 100 * uncertainty) : 70;
  const priorTrialData = molecule.scores ? Math.round(molecule.scores.nextPhase * 100 * uncertainty) : 60;
  const sponsorExperience = molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45;
  const regulatoryPrecedent = molecule.scores ? Math.round(molecule.scores.regulatoryPathway.accelerated * 100 * uncertainty) : 75;
  const safetyProfile = molecule.scores ? Math.round((1 - molecule.scores.dropoutRanking / 5) * 100 * uncertainty) : 70;

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
  };
};

const phaseOrder = ["Preclinical", "Phase 1", "Phase 2", "Phase 3", "NDA/BLA", "Approved"];
const phaseKeys = ["preclinical", "phase1", "phase2", "phase3", "nda", "approved"];

export const PTRSHistoricalTracking = ({ molecules }: PTRSHistoricalTrackingProps) => {
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>("");

  const selectedMolecule = molecules.find(m => m.id === selectedMoleculeId);

  // Get current phase index
  const getCurrentPhaseIndex = (phase: string): number => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("preclinical")) return 0;
    if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return 1;
    if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return 2;
    if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return 3;
    if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return 4;
    if (phaseLower.includes("approved")) return 5;
    return 2;
  };

  // Generate historical data up to current phase
  const generateHistoricalData = () => {
    if (!selectedMolecule) return [];

    const currentPhaseIdx = getCurrentPhaseIndex(selectedMolecule.phase);
    const data = [];

    for (let i = 0; i <= currentPhaseIdx; i++) {
      const ptrsData = calculatePTRSByPhase(selectedMolecule, phaseKeys[i]);
      
      // Add some historical variation for completed phases
      const isCurrentPhase = i === currentPhaseIdx;
      const historicalVariation = isCurrentPhase ? 0 : (Math.random() - 0.5) * 3;
      
      data.push({
        phase: phaseOrder[i],
        phaseKey: phaseKeys[i],
        PTS: Math.max(5, Math.min(95, ptrsData.pts + historicalVariation)),
        PRS: Math.max(50, Math.min(98, ptrsData.prs + historicalVariation * 0.5)),
        PTRS: Math.max(2, Math.min(50, ptrsData.ptrs + historicalVariation * 0.3)),
        isCurrent: isCurrentPhase,
        status: isCurrentPhase ? 'current' : 'completed',
      });
    }

    // Add projected future phases
    for (let i = currentPhaseIdx + 1; i < phaseOrder.length; i++) {
      const ptrsData = calculatePTRSByPhase(selectedMolecule, phaseKeys[i]);
      data.push({
        phase: phaseOrder[i],
        phaseKey: phaseKeys[i],
        PTS: ptrsData.pts,
        PRS: ptrsData.prs,
        PTRS: ptrsData.ptrs,
        isCurrent: false,
        status: 'projected',
      });
    }

    return data;
  };

  const historicalData = generateHistoricalData();
  const currentPhaseData = historicalData.find(d => d.isCurrent);

  // Calculate improvement from first phase to current
  const calculateImprovement = () => {
    if (historicalData.length < 2) return null;
    const first = historicalData[0];
    const current = currentPhaseData || historicalData[historicalData.length - 1];
    return {
      ptsChange: ((current.PTS - first.PTS) / first.PTS * 100).toFixed(1),
      prsChange: ((current.PRS - first.PRS) / first.PRS * 100).toFixed(1),
      ptrsChange: ((current.PTRS - first.PTRS) / first.PTRS * 100).toFixed(1),
    };
  };

  const improvement = calculateImprovement();

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Historical PTRS Tracking
        </CardTitle>
        <CardDescription>Track how PTRS scores evolve across development phases</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Molecule Selector */}
        <Select value={selectedMoleculeId} onValueChange={setSelectedMoleculeId}>
          <SelectTrigger className="w-full max-w-md">
            <SelectValue placeholder="Select a molecule to view historical PTRS..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {molecules.slice(0, 50).map((mol) => (
              <SelectItem key={mol.id} value={mol.id}>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{mol.name}</span>
                  <span className="text-muted-foreground text-xs">({mol.phase})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMolecule && (
          <>
            {/* Molecule Info */}
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedMolecule.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMolecule.company} | {selectedMolecule.indication}</p>
                  <Badge className="mt-2">{selectedMolecule.phase}</Badge>
                </div>
                {improvement && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">PTRS Change</p>
                    <p className={`text-2xl font-bold ${parseFloat(improvement.ptrsChange) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(improvement.ptrsChange) > 0 ? '+' : ''}{improvement.ptrsChange}%
                    </p>
                    <p className="text-xs text-muted-foreground">since preclinical</p>
                  </div>
                )}
              </div>
            </div>

            {/* Phase Timeline */}
            <div className="flex justify-between items-center overflow-x-auto pb-2">
              {historicalData.map((phase, idx) => (
                <div key={phase.phase} className="flex flex-col items-center min-w-[80px]">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-100 text-green-600' :
                      phase.status === 'current' ? 'bg-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground border-2 border-dashed'
                    }`}
                  >
                    {phase.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                     phase.status === 'current' ? <Clock className="h-5 w-5" /> :
                     <AlertCircle className="h-5 w-5" />}
                  </div>
                  <p className={`text-xs mt-1 ${phase.isCurrent ? 'font-bold' : ''}`}>{phase.phase}</p>
                  <p className={`text-sm font-semibold ${
                    phase.status === 'projected' ? 'text-muted-foreground' : 'text-purple-600'
                  }`}>
                    {phase.PTRS.toFixed(1)}%
                  </p>
                  {idx < historicalData.length - 1 && (
                    <div className="absolute mt-5 ml-20 w-8 h-0.5 bg-muted" />
                  )}
                </div>
              ))}
            </div>

            {/* Historical Chart */}
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPTS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(220, 70%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPRS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPTRS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(280, 70%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="phase" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                            <p className="font-medium">{label}</p>
                            <p className={data.status === 'projected' ? 'text-muted-foreground italic' : ''}>
                              {data.status === 'projected' ? '(Projected)' : data.isCurrent ? '(Current)' : '(Completed)'}
                            </p>
                            <div className="mt-2 space-y-1">
                              <p style={{ color: 'hsl(220, 70%, 50%)' }}>PTS: {data.PTS.toFixed(1)}%</p>
                              <p style={{ color: 'hsl(142, 71%, 45%)' }}>PRS: {data.PRS.toFixed(1)}%</p>
                              <p style={{ color: 'hsl(280, 70%, 50%)' }} className="font-bold">PTRS: {data.PTRS.toFixed(1)}%</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="PTS" stroke="hsl(220, 70%, 50%)" fillOpacity={1} fill="url(#colorPTS)" name="PTS (%)" />
                  <Area type="monotone" dataKey="PRS" stroke="hsl(142, 71%, 45%)" fillOpacity={1} fill="url(#colorPRS)" name="PRS (%)" />
                  <Area type="monotone" dataKey="PTRS" stroke="hsl(280, 70%, 50%)" fillOpacity={1} fill="url(#colorPTRS)" name="PTRS (%)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Starting PTRS</p>
                <p className="text-2xl font-bold">{historicalData[0]?.PTRS.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{historicalData[0]?.phase}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center">
                <p className="text-sm text-purple-600">Current PTRS</p>
                <p className="text-2xl font-bold text-purple-600">{currentPhaseData?.PTRS.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{currentPhaseData?.phase}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Projected at NDA</p>
                <p className="text-2xl font-bold">{historicalData.find(d => d.phase === "NDA/BLA")?.PTRS.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">NDA/BLA</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                <p className="text-sm text-green-600">If Approved</p>
                <p className="text-2xl font-bold text-green-600">{historicalData.find(d => d.phase === "Approved")?.PTRS.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-muted/30 rounded-lg p-4 border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Key Insights
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• PTRS increases as molecule advances through phases due to reduced development risk</li>
                <li>• Phase transitions typically show 20-40% PTRS improvement for successful candidates</li>
                <li>• PRS remains more stable than PTS across phases (regulatory criteria are consistent)</li>
                <li>• Projected values assume continued positive trial outcomes</li>
              </ul>
            </div>
          </>
        )}

        {!selectedMolecule && (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Select a molecule to view its PTRS evolution across development phases</p>
            <p className="text-sm mt-1">See historical trends and projected future scores</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
