import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, Info, BarChart3, Target, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ReferenceLine, Tooltip } from "recharts";
import {
  RF, RM_BY_TA, PIPELINE_BENCHMARKS,
  calculateCAPM, estimateBeta, getAlphaColor, getAlphaLabel, mapTAToRmKey,
  type BetaInputs, type MechanismType, type DesignationType, type SponsorTier, type PriorData, type CAPMResult
} from "@/lib/capmModel";
import type { MoleculeProfile } from "@/lib/moleculesData";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";
import { MoleculePicker } from "@/components/MoleculePicker";

// Maps molecule phase string to CAPM phase key
function getPhaseForCAPM(phase: string): string {
  const p = phase.toLowerCase();
  if (p.includes("phase 3") || p.includes("phase iii") || p.includes("pivotal")) return "Phase 3";
  if (p.includes("phase 2/3") || p.includes("phase ii/iii")) return "Phase 2/3";
  if (p.includes("phase 2") || p.includes("phase ii")) return "Phase 2";
  if (p.includes("phase 1/2") || p.includes("phase i/ii")) return "Phase 1/2";
  if (p.includes("phase 1") || p.includes("phase i")) return "Phase 1";
  return "Phase 2";
}

// Estimate PTRS for molecule based on phase
function estimatePTRS(mol: MoleculeProfile): number {
  const p = mol.phase.toLowerCase();
  if (p.includes("approved")) return 0.95;
  if (p.includes("nda") || p.includes("bla") || p.includes("filed")) return 0.80;
  if (p.includes("phase 3") || p.includes("phase iii")) return 0.55;
  if (p.includes("phase 2") || p.includes("phase ii")) return 0.30;
  if (p.includes("phase 1") || p.includes("phase i")) return 0.15;
  return 0.10;
}

export function CAPMAlphaSignals({ molecules }: { molecules: MoleculeProfile[] }) {
  const { sessionMolecule: simulatorMolecule } = useSessionMolecule();
  
  // Local molecule override (when user picks from inline MoleculePicker)
  const [localMol, setLocalMol] = useState<MoleculeProfile | null>(null);
  const selectedMol = localMol || simulatorMolecule || null;

  // Beta input sliders
  const [mechanism, setMechanism] = useState<MechanismType>("best_in_class");
  const [designation, setDesignation] = useState<DesignationType>("none");
  const [sponsorTier, setSponsorTier] = useState<SponsorTier>("mid_size_biotech");
  const [priorData, setPriorData] = useState<PriorData>("strong_poc");

  const capmResult = useMemo<CAPMResult | null>(() => {
    if (!selectedMol) return null;
    const ptrs = estimatePTRS(selectedMol);
    const betaInputs: BetaInputs = {
      mechanism, designation, sponsorTier,
      phase: getPhaseForCAPM(selectedMol.phase),
      priorData,
    };
    return calculateCAPM(selectedMol.therapeuticArea, ptrs, betaInputs);
  }, [selectedMol, mechanism, designation, sponsorTier, priorData]);

  const beta = capmResult ? capmResult.beta : estimateBeta({ mechanism, designation, sponsorTier, phase: "Phase 2", priorData });

  // TA comparison chart data
  const taChartData = useMemo(() => {
    return Object.entries(RM_BY_TA).map(([ta, data]) => ({
      ta: ta.length > 20 ? ta.slice(0, 18) + "…" : ta,
      fullTa: ta,
      Rm: +(data.Rm * 100).toFixed(1),
      premium: +((data.Rm - RF) * 100).toFixed(1),
    })).sort((a, b) => b.Rm - a.Rm);
  }, []);

  const fmtPct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const fmtSignedPct = (v: number) => `${v >= 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* Molecule Selector — uses full search-as-you-type MoleculePicker */}
      {!simulatorMolecule && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4 text-primary" />Select Molecule</CardTitle>
            <CardDescription>Search by drug name, NCT ID, sponsor, or condition</CardDescription>
          </CardHeader>
          <CardContent>
            <MoleculePicker
              molecules={molecules}
              value={localMol}
              onChange={setLocalMol}
              label="Molecule for CAPM Analysis"
            />
          </CardContent>
        </Card>
      )}

      {/* Beta Inputs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-primary" />
            Estimated β — Risk Factor Inputs
            <Popover><PopoverTrigger><Info className="h-3.5 w-3.5 text-muted-foreground" /></PopoverTrigger>
              <PopoverContent className="text-xs w-72">Beta estimates how much a molecule's outcome variance deviates from its TA average. β &lt; 1 = less risky, β &gt; 1 = more risky.</PopoverContent>
            </Popover>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Mechanism Novelty</Label>
              <Select value={mechanism} onValueChange={v => setMechanism(v as MechanismType)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="first_in_class">First-in-class (+0.30)</SelectItem>
                  <SelectItem value="best_in_class">Best-in-class (+0.10)</SelectItem>
                  <SelectItem value="follow_on">Follow-on (−0.20)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Regulatory Designation</Label>
              <Select value={designation} onValueChange={v => setDesignation(v as DesignationType)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakthrough">Breakthrough (−0.25)</SelectItem>
                  <SelectItem value="orphan">Orphan Drug (−0.20)</SelectItem>
                  <SelectItem value="accelerated">Accelerated (−0.15)</SelectItem>
                  <SelectItem value="fast_track">Fast Track (−0.10)</SelectItem>
                  <SelectItem value="none">None (0.00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sponsor Tier</Label>
              <Select value={sponsorTier} onValueChange={v => setSponsorTier(v as SponsorTier)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="top_20_pharma">Top 20 Pharma (−0.20)</SelectItem>
                  <SelectItem value="mid_size_biotech">Mid-size Biotech (−0.05)</SelectItem>
                  <SelectItem value="small_biotech">Small Biotech (+0.15)</SelectItem>
                  <SelectItem value="academic">Academic (+0.25)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Prior Trial Data</Label>
              <Select value={priorData} onValueChange={v => setPriorData(v as PriorData)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="strong_poc">Strong PoC (−0.20)</SelectItem>
                  <SelectItem value="mixed_results">Mixed results (+0.15)</SelectItem>
                  <SelectItem value="no_prior">No prior data (+0.20)</SelectItem>
                  <SelectItem value="failed_retrying">Failed, retrying (+0.35)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 p-3 bg-primary/5 rounded-lg flex items-center gap-3">
            <span className="text-sm font-medium">Estimated β =</span>
            <span className="text-2xl font-bold text-primary">{beta.toFixed(2)}</span>
            <Badge variant={beta < 1 ? "default" : beta > 1.3 ? "destructive" : "secondary"} className="ml-2">
              {beta < 0.8 ? "Low Risk" : beta < 1.2 ? "Moderate" : "High Risk"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Alpha Results */}
      {capmResult && selectedMol && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* α₁ */}
          <Card className="border-l-4" style={{ borderLeftColor: getAlphaColor(capmResult.alpha1) }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">α₁ — Historical Alpha</CardDescription>
              <CardTitle className="text-2xl" style={{ color: getAlphaColor(capmResult.alpha1) }}>
                {fmtSignedPct(capmResult.alpha1)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>E(R) = {fmtPct(capmResult.Rf)} + {capmResult.beta.toFixed(2)} × ({fmtPct(capmResult.Rm)} − {fmtPct(capmResult.Rf)}) = {fmtPct(capmResult.expectedReturn)}</p>
              <p>Actual PTRS: {fmtPct(estimatePTRS(selectedMol))} − E(R): {fmtPct(capmResult.expectedReturn)}</p>
              <Badge variant="outline" className="mt-1">{getAlphaLabel(capmResult.alpha1)}</Badge>
            </CardContent>
          </Card>

          {/* α₂ */}
          <Card className="border-l-4" style={{ borderLeftColor: getAlphaColor(capmResult.alpha2) }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">α₂ — Pipeline Alpha</CardDescription>
              <CardTitle className="text-2xl" style={{ color: getAlphaColor(capmResult.alpha2) }}>
                {fmtSignedPct(capmResult.alpha2)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>Actual PTRS: {fmtPct(estimatePTRS(selectedMol))} − Pipeline Mean: {fmtPct(capmResult.pipelineMeanPTRS)}</p>
              <p>TA pipeline: {PIPELINE_BENCHMARKS[mapTAToRmKey(selectedMol.therapeuticArea)]?.n || '—'} active molecules</p>
              <Badge variant="outline" className="mt-1">{getAlphaLabel(capmResult.alpha2)}</Badge>
            </CardContent>
          </Card>

          {/* Δα */}
          <Card className="border-l-4" style={{ borderLeftColor: getAlphaColor(capmResult.deltaAlpha) }}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">Δα — Alpha Divergence</CardDescription>
              <CardTitle className="text-2xl" style={{ color: getAlphaColor(capmResult.deltaAlpha) }}>
                {fmtSignedPct(capmResult.deltaAlpha)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>α₁ ({fmtSignedPct(capmResult.alpha1)}) − α₂ ({fmtSignedPct(capmResult.alpha2)})</p>
              <p>{capmResult.deltaAlpha > 0.01 ? "TA pipeline has improved vs history" : capmResult.deltaAlpha < -0.01 ? "Leading a weak current pipeline" : "Consistent vs both benchmarks"}</p>
              <Badge variant="outline" className="mt-1">
                {capmResult.deltaAlpha > 0.01 ? "Field Advanced" : capmResult.deltaAlpha < -0.01 ? "Weak Field" : "Stable"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CAPM Summary Table */}
      {capmResult && selectedMol && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />CAPM Signal Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2 font-medium">Parameter</th>
                    <th className="text-right p-2 font-medium">Value</th>
                    <th className="text-left p-2 font-medium">Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">Rf (All-TA baseline)</td><td className="p-2 text-right font-mono">{fmtPct(RF)}</td><td className="p-2 text-muted-foreground text-xs">20-year realised LOA</td></tr>
                  <tr className="border-b"><td className="p-2">Rm ({mapTAToRmKey(selectedMol.therapeuticArea)})</td><td className="p-2 text-right font-mono">{fmtPct(capmResult.Rm)}</td><td className="p-2 text-muted-foreground text-xs">TA historical LOA</td></tr>
                  <tr className="border-b"><td className="p-2">TA Premium (Rm − Rf)</td><td className="p-2 text-right font-mono">{fmtSignedPct(capmResult.Rm - RF)}</td><td className="p-2 text-muted-foreground text-xs">{capmResult.Rm > RF ? "Above baseline" : "Below baseline"}</td></tr>
                  <tr className="border-b"><td className="p-2">Estimated β</td><td className="p-2 text-right font-mono font-bold">{beta.toFixed(2)}</td><td className="p-2 text-muted-foreground text-xs">{beta < 1 ? "Below-average risk" : "Above-average risk"}</td></tr>
                  <tr className="border-b"><td className="p-2">E(R) — Expected PTRS</td><td className="p-2 text-right font-mono font-bold">{fmtPct(capmResult.expectedReturn)}</td><td className="p-2 text-muted-foreground text-xs">CAPM-predicted outcome</td></tr>
                  <tr className="border-b"><td className="p-2">Actual PTRS</td><td className="p-2 text-right font-mono">{fmtPct(estimatePTRS(selectedMol))}</td><td className="p-2 text-muted-foreground text-xs">Platform-computed</td></tr>
                  <tr className="border-b"><td className="p-2 font-semibold">α₁ (Historical)</td><td className="p-2 text-right font-mono font-bold" style={{ color: getAlphaColor(capmResult.alpha1) }}>{fmtSignedPct(capmResult.alpha1)}</td><td className="p-2 text-muted-foreground text-xs">vs 25-yr historical benchmark</td></tr>
                  <tr className="border-b"><td className="p-2 font-semibold">α₂ (Pipeline)</td><td className="p-2 text-right font-mono font-bold" style={{ color: getAlphaColor(capmResult.alpha2) }}>{fmtSignedPct(capmResult.alpha2)}</td><td className="p-2 text-muted-foreground text-xs">vs current TA pipeline mean</td></tr>
                  <tr><td className="p-2 font-semibold">Δα (Divergence)</td><td className="p-2 text-right font-mono font-bold" style={{ color: getAlphaColor(capmResult.deltaAlpha) }}>{fmtSignedPct(capmResult.deltaAlpha)}</td><td className="p-2 text-muted-foreground text-xs">Historical vs pipeline gap</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No molecule selected prompt */}
      {!selectedMol && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground font-medium">Select a molecule to view CAPM Alpha signals</p>
            <p className="text-xs text-muted-foreground mt-1">Use "Use in Simulator →" from Overview cards, the top search bar, or the picker above</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
