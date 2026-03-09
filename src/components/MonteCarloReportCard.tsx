// Monte Carlo Stress Test Report Card for Full DD Report
// Wired to runPTRSMonteCarlo() from ptrsEngine.ts — same engine as simulator (H1.5 Fix 2)
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { ModelNarrative, generateMonteCarloNarrative } from "./ModelNarrative";
import { runPTRSMonteCarlo, TA_KEY_TO_DISPLAY, type PTRSSliders } from "@/lib/ptrsEngine";
import { canonicalizeTA } from "@/lib/taCanonical";

interface MonteCarloReportCardProps {
  molecule: {
    id: string;
    name: string;
    phase: string;
    therapeuticArea: string;
    company: string;
    companyTrackRecord?: 'fast' | 'average' | 'slow';
  };
}

function getTAKey(ta: string): string {
  const taLower = ta.toLowerCase();
  for (const [key, display] of Object.entries(TA_KEY_TO_DISPLAY)) {
    if (display.toLowerCase() === taLower || taLower.includes(display.toLowerCase().split(' ')[0])) {
      return key;
    }
  }
  if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
  if (taLower.includes("neuro") || taLower.includes("cns")) return "cns";
  if (taLower.includes("cardio")) return "cardiovascular";
  if (taLower.includes("infect")) return "infectious";
  if (taLower.includes("immun") || taLower.includes("inflam")) return "immunology";
  if (taLower.includes("metabol") || taLower.includes("endocr")) return "metabolic";
  if (taLower.includes("rare") || taLower.includes("orphan")) return "rareDisease";
  if (taLower.includes("derma")) return "dermatology";
  if (taLower.includes("respir") || taLower.includes("pulmon")) return "respiratory";
  if (taLower.includes("psych") || taLower.includes("mental")) return "psychiatry";
  if (taLower.includes("ophthal")) return "ophthalmology";
  if (taLower.includes("gastro") || taLower.includes("hepat")) return "gastroenterology";
  if (taLower.includes("nephro") || taLower.includes("renal")) return "nephrology";
  if (taLower.includes("musculo") || taLower.includes("rheum")) return "musculoskeletal";
  if (taLower.includes("vaccin")) return "vaccines";
  if (taLower.includes("women")) return "womensHealth";
  if (taLower.includes("pain") || taLower.includes("anesth")) return "pain";
  if (taLower.includes("pediatr")) return "pediatrics";
  if (taLower.includes("urol")) return "urology";
  return "other";
}

function getPhaseKey(phase: string): string {
  const p = phase.toLowerCase();
  if (p.includes("approved")) return "phase3";
  if (p.includes("phase 3") || p.includes("phase iii")) return "phase3";
  if (p.includes("phase 2/3") || p.includes("phase ii/iii")) return "phase2/3";
  if (p.includes("phase 2") || p.includes("phase ii")) return "phase2";
  if (p.includes("phase 1/2") || p.includes("phase i/ii")) return "phase1/2";
  if (p.includes("phase 1") || p.includes("phase i")) return "phase1";
  return "phase2";
}

export function MonteCarloReportCard({ molecule }: MonteCarloReportCardProps) {
  const results = useMemo(() => {
    const taKey = getTAKey(molecule.therapeuticArea);
    const phaseKey = getPhaseKey(molecule.phase);
    
    // Default sliders at 50 (industry average) — same as report context
    const sliders: PTRSSliders = {
      mechanismNovelty: 50,
      endpointClarity: 50,
      priorTrialData: 50,
      sponsorExperience: molecule.companyTrackRecord === 'fast' ? 70 : molecule.companyTrackRecord === 'slow' ? 30 : 50,
      regulatoryPrecedent: 50,
      safetyProfile: 50,
    };

    // Use real PTRS MC engine with 1000 iterations for report (vs 10000 in simulator)
    const mc = runPTRSMonteCarlo(taKey, phaseKey, sliders, { iterations: 1000, uncertaintyPct: 0.15 });

    return {
      p5: mc.p5,
      p50: mc.median,
      p95: mc.p95,
      mean: mc.mean,
      stdDev: mc.stdDev,
      iterations: 1000,
    };
  }, [molecule]);

  const fmtPct = (v: number) => `${v.toFixed(1)}%`;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Monte Carlo Stress Test
          <Badge variant="outline" className="text-xs ml-2">{results.iterations.toLocaleString()} iterations</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-muted-foreground">Metric</th>
                <th className="text-center py-2 text-muted-foreground">🐻 Bear (P5)</th>
                <th className="text-center py-2 text-muted-foreground font-semibold">📊 Base (P50)</th>
                <th className="text-center py-2 text-muted-foreground">🐂 Bull (P95)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <tr>
                <td className="py-2 font-medium">PTRS</td>
                <td className="text-center font-mono text-[hsl(0,72%,51%)]">{fmtPct(results.p5)}</td>
                <td className="text-center font-mono font-semibold">{fmtPct(results.p50)}</td>
                <td className="text-center font-mono text-[hsl(142,76%,36%)]">{fmtPct(results.p95)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center text-xs">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold">{fmtPct(results.mean)}</div>
            <div className="text-muted-foreground">Mean PTRS</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold">{results.stdDev.toFixed(2)}%</div>
            <div className="text-muted-foreground">Std Deviation</div>
          </div>
        </div>

        <div className="p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
          Under stress conditions, PTRS ranges from {fmtPct(results.p5)} (P5) to {fmtPct(results.p95)} (P95) with a median of {fmtPct(results.p50)}.
        </div>

        <ModelNarrative>
          <p>{generateMonteCarloNarrative(results.p5, results.p50, results.p95, results.iterations)}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
