// PTRS Report Card for Full DD Report
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck } from "lucide-react";
import { calculatePTRS, PTS_BASE_RATES, PTS_BASE_DEFAULT, type PTRSSliders } from "@/lib/ptrsEngine";
import { canonicalizeTA } from "@/lib/taCanonical";
import { ModelNarrative, generatePTRSNarrative } from "./ModelNarrative";

interface PTRSReportCardProps {
  molecule: {
    id: string;
    name: string;
    phase: string;
    therapeuticArea: string;
    company: string;
    companyTrackRecord?: 'fast' | 'average' | 'slow';
  };
}

function getPhaseKey(phase: string): string {
  const p = phase.toLowerCase();
  if (p.includes("approved")) return "Phase 3";
  if (p.includes("phase 3") || p.includes("phase iii")) return "Phase 3";
  if (p.includes("phase 2/3") || p.includes("phase ii/iii")) return "Phase 2/3";
  if (p.includes("phase 2") || p.includes("phase ii")) return "Phase 2";
  if (p.includes("phase 1/2") || p.includes("phase i/ii")) return "Phase 1/2";
  if (p.includes("phase 1") || p.includes("phase i")) return "Phase 1";
  return "Phase 2";
}

export function PTRSReportCard({ molecule }: PTRSReportCardProps) {
  const result = useMemo(() => {
    const ta = canonicalizeTA(molecule.therapeuticArea);
    const phaseKey = getPhaseKey(molecule.phase);
    // Default sliders at 50 (industry average)
    const sliders: PTRSSliders = {
      mechanismNovelty: 50,
      endpointClarity: 50,
      priorTrialData: 50,
      sponsorExperience: molecule.companyTrackRecord === 'fast' ? 70 : molecule.companyTrackRecord === 'slow' ? 30 : 50,
      regulatoryPrecedent: 50,
      safetyProfile: 50,
    };
    return calculatePTRS(ta, phaseKey, sliders);
  }, [molecule]);

  const taKey = canonicalizeTA(molecule.therapeuticArea);
  const phaseKey = getPhaseKey(molecule.phase);
  const taHistorical = (PTS_BASE_RATES[taKey] || PTS_BASE_DEFAULT)[phaseKey] ?? 0.35;

  const getColor = (v: number) => v >= 0.6 ? "text-[hsl(142,76%,36%)]" : v >= 0.4 ? "text-[hsl(45,93%,47%)]" : "text-[hsl(0,72%,51%)]";

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          PTRS Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main metrics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className={`text-2xl font-bold ${getColor(result.pts)}`}>{result.pts_pct}%</div>
            <div className="text-xs text-muted-foreground">PTS (Technical)</div>
            <Progress value={result.pts_pct} className="h-1.5 mt-2" />
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className={`text-2xl font-bold ${getColor(result.prs)}`}>{result.prs_pct}%</div>
            <div className="text-xs text-muted-foreground">PRS (Regulatory)</div>
            <Progress value={result.prs_pct} className="h-1.5 mt-2" />
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className={`text-3xl font-bold ${getColor(result.ptrs)}`}>{result.ptrs_pct}%</div>
            <div className="text-xs text-muted-foreground">PTRS Combined</div>
          </div>
        </div>

        <div className="text-xs text-center text-muted-foreground font-mono">PTRS = PTS × PRS = {result.pts_pct}% × {result.prs_pct}% = {result.ptrs_pct}%</div>

        {/* Input parameters */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b"><th className="text-left py-1.5 text-muted-foreground">Parameter</th><th className="text-right py-1.5 text-muted-foreground">Value</th></tr></thead>
            <tbody className="divide-y divide-border/30">
              <tr><td className="py-1.5">Therapeutic Area</td><td className="text-right font-medium">{taKey}</td></tr>
              <tr><td className="py-1.5">Current Phase</td><td className="text-right font-medium">{phaseKey}</td></tr>
              <tr><td className="py-1.5">Mechanism Novelty</td><td className="text-right font-medium">50%</td></tr>
              <tr><td className="py-1.5">Endpoint Clarity</td><td className="text-right font-medium">50%</td></tr>
              <tr><td className="py-1.5">Prior Trial Data</td><td className="text-right font-medium">50%</td></tr>
              <tr><td className="py-1.5">Sponsor Experience</td><td className="text-right font-medium">{molecule.companyTrackRecord === 'fast' ? '70%' : molecule.companyTrackRecord === 'slow' ? '30%' : '50%'}</td></tr>
              <tr><td className="py-1.5">Regulatory Precedent</td><td className="text-right font-medium">50%</td></tr>
              <tr><td className="py-1.5">Safety Profile</td><td className="text-right font-medium">50%</td></tr>
            </tbody>
          </table>
        </div>

        {/* TA baseline comparison */}
        <div className="p-3 bg-muted/20 rounded-lg text-xs">
          <span className="text-muted-foreground">TA historical average (PTS): </span>
          <span className="font-semibold">{(taHistorical * 100).toFixed(0)}%</span>
          <span className="text-muted-foreground ml-2">vs this molecule: </span>
          <Badge variant={result.pts > taHistorical ? "default" : "destructive"} className="text-xs ml-1">
            {result.pts > taHistorical ? "Above" : "Below"} average
          </Badge>
        </div>

        <ModelNarrative>
          <p>{generatePTRSNarrative(result.ptrs, result.pts, result.prs, taKey, phaseKey)}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
