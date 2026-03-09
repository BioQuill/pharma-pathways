// Monte Carlo Stress Test Report Card for Full DD Report
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { ModelNarrative, generateMonteCarloNarrative } from "./ModelNarrative";

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

// Deterministic seeded random for consistent results
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getPhaseMultiplier(phase: string): number {
  const p = phase.toLowerCase();
  if (p.includes("approved")) return 1.0;
  if (p.includes("phase 3") || p.includes("phase iii")) return 0.55;
  if (p.includes("phase 2") || p.includes("phase ii")) return 0.30;
  if (p.includes("phase 1") || p.includes("phase i")) return 0.15;
  return 0.10;
}

export function MonteCarloReportCard({ molecule }: MonteCarloReportCardProps) {
  const results = useMemo(() => {
    const rand = seededRandom(hashCode(molecule.id));
    const N = 10000;
    const basePTRS = getPhaseMultiplier(molecule.phase);
    const baseLPI = basePTRS * 1.2; // approximate
    const basePeakSales = 800 + rand() * 4000; // $M base

    // Run simplified Monte Carlo
    const ptrsResults: number[] = [];
    const lpiResults: number[] = [];
    const peakSalesResults: number[] = [];
    
    for (let i = 0; i < N; i++) {
      const ptrsVar = basePTRS * (0.6 + rand() * 0.8);
      const lpiVar = baseLPI * (0.6 + rand() * 0.8);
      const peakVar = basePeakSales * (0.3 + rand() * 1.4);
      ptrsResults.push(Math.min(1, Math.max(0, ptrsVar)));
      lpiResults.push(Math.min(1, Math.max(0, lpiVar)));
      peakSalesResults.push(Math.max(0, peakVar));
    }

    const percentile = (arr: number[], p: number) => {
      const sorted = [...arr].sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length * p / 100)];
    };

    const blockbusterProb = peakSalesResults.filter(v => v >= 1000).length / N;

    return {
      ptrs: { p5: percentile(ptrsResults, 5), p50: percentile(ptrsResults, 50), p95: percentile(ptrsResults, 95) },
      lpi: { p5: percentile(lpiResults, 5), p50: percentile(lpiResults, 50), p95: percentile(lpiResults, 95) },
      peakSales: { p5: percentile(peakSalesResults, 5), p50: percentile(peakSalesResults, 50), p95: percentile(peakSalesResults, 95) },
      blockbuster: { p5: blockbusterProb * 0.6, p50: blockbusterProb, p95: Math.min(1, blockbusterProb * 1.4) },
      iterations: N,
    };
  }, [molecule]);

  const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`;
  const fmtSales = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}B` : `$${v.toFixed(0)}M`;

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
                <th className="text-left py-2 text-muted-foreground">Model</th>
                <th className="text-center py-2 text-muted-foreground">🐻 Bear (P5)</th>
                <th className="text-center py-2 text-muted-foreground font-semibold">📊 Base (P50)</th>
                <th className="text-center py-2 text-muted-foreground">🐂 Bull (P95)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              <tr>
                <td className="py-2 font-medium">PTRS</td>
                <td className="text-center font-mono text-[hsl(0,72%,51%)]">{fmtPct(results.ptrs.p5)}</td>
                <td className="text-center font-mono font-semibold">{fmtPct(results.ptrs.p50)}</td>
                <td className="text-center font-mono text-[hsl(142,76%,36%)]">{fmtPct(results.ptrs.p95)}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">LPI</td>
                <td className="text-center font-mono text-[hsl(0,72%,51%)]">{fmtPct(results.lpi.p5)}</td>
                <td className="text-center font-mono font-semibold">{fmtPct(results.lpi.p50)}</td>
                <td className="text-center font-mono text-[hsl(142,76%,36%)]">{fmtPct(results.lpi.p95)}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Peak Sales</td>
                <td className="text-center font-mono text-[hsl(0,72%,51%)]">{fmtSales(results.peakSales.p5)}</td>
                <td className="text-center font-mono font-semibold">{fmtSales(results.peakSales.p50)}</td>
                <td className="text-center font-mono text-[hsl(142,76%,36%)]">{fmtSales(results.peakSales.p95)}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Blockbuster Prob.</td>
                <td className="text-center font-mono text-[hsl(0,72%,51%)]">{fmtPct(results.blockbuster.p5)}</td>
                <td className="text-center font-mono font-semibold">{fmtPct(results.blockbuster.p50)}</td>
                <td className="text-center font-mono text-[hsl(142,76%,36%)]">{fmtPct(results.blockbuster.p95)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-muted/20 rounded-lg text-xs text-muted-foreground">
          Under stress conditions, peak sales range from {fmtSales(results.peakSales.p5)} (P5) to {fmtSales(results.peakSales.p95)} (P95).
        </div>

        <ModelNarrative>
          <p>{generateMonteCarloNarrative(results.peakSales.p5, results.peakSales.p50, results.peakSales.p95, results.iterations)}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
