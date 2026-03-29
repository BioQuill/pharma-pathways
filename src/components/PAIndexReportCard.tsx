// PA Index Report Card for Full DD Report
// Wired to paModel1Engine.ts — same engine as PA Model 1 dashboard (H1.5 Fix 3)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark } from "lucide-react";
import { ModelNarrative, generatePANarrative } from "./ModelNarrative";
import { calculatePAModel1 } from "@/lib/paModel1Engine";

interface PAIndexReportCardProps {
  molecule: {
    id: string;
    name: string;
    phase: string;
    therapeuticArea: string;
  };
}

export function PAIndexReportCard({ molecule }: PAIndexReportCardProps) {
  const result = calculatePAModel1(molecule);

  const sorted = [...result.markets].sort((a, b) => b.score - a.score);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Landmark className="h-5 w-5 text-primary" />
          PA Index Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Recommended model:</span>
          <Badge variant="outline">Model 1 (MWPSPI)</Badge>
          <span className="text-xs text-muted-foreground">— multi-market weighted scoring</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1.5 text-muted-foreground">Market</th>
                <th className="text-right py-1.5 text-muted-foreground">Score</th>
                <th className="text-center py-1.5 text-muted-foreground">Band</th>
                <th className="text-left py-1.5 text-muted-foreground pl-3">Implication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {result.markets.map(m => (
                <tr key={m.marketId}>
                  <td className="py-1.5 font-medium">{m.marketLabel}</td>
                  <td className="text-right font-mono">{m.score}</td>
                  <td className="text-center">
                    <Badge variant={m.score >= 60 ? "default" : m.score >= 40 ? "secondary" : "destructive"} className="text-xs">
                      {m.band}
                    </Badge>
                  </td>
                  <td className="text-left pl-3 text-muted-foreground">{m.implication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Overall market access signal:</span>
          <Badge variant={result.signal === "Strong" ? "default" : result.signal === "Moderate" ? "secondary" : "destructive"}>
            {result.signal}
          </Badge>
        </div>

        <ModelNarrative>
          <p>{generatePANarrative(
            result.highest.marketLabel, result.highest.score,
            result.lowest.marketLabel, result.lowest.score,
            sorted.slice(0, 3).map(m => m.marketLabel)
          )}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
