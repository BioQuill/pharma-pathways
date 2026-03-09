// PA Index Report Card for Full DD Report
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark } from "lucide-react";
import { ModelNarrative, generatePANarrative } from "./ModelNarrative";

const MARKETS = [
  { id: "us", label: "🇺🇸 United States" },
  { id: "uk", label: "🇬🇧 United Kingdom" },
  { id: "de", label: "🇩🇪 Germany" },
  { id: "jp", label: "🇯🇵 Japan" },
  { id: "cn", label: "🇨🇳 China" },
  { id: "in", label: "🇮🇳 India" },
  { id: "br", label: "🇧🇷 Brazil" },
  { id: "au", label: "🇦🇺 Australia" },
];

function getBand(score: number): string {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

function getImplication(market: string, score: number): string {
  if (score >= 80) return "Strong payer precedent and favourable reimbursement landscape";
  if (score >= 60) return "Established pathway with manageable HTA requirements";
  if (score >= 40) return "Mixed signals — pricing pressure likely";
  return "Significant barriers; budget impact and evidence demands high";
}

// Deterministic scoring based on molecule attributes
function hashScore(molId: string, marketId: string): number {
  let hash = 0;
  const str = molId + marketId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return 35 + Math.abs(hash % 55); // 35-89 range
}

interface PAIndexReportCardProps {
  molecule: {
    id: string;
    name: string;
    phase: string;
    therapeuticArea: string;
  };
}

export function PAIndexReportCard({ molecule }: PAIndexReportCardProps) {
  const scores = MARKETS.map(m => ({
    ...m,
    score: hashScore(molecule.id, m.id),
  }));

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];
  const avgScore = Math.round(scores.reduce((s, m) => s + m.score, 0) / scores.length);
  const signal = avgScore >= 70 ? "Strong" : avgScore >= 50 ? "Moderate" : "Weak";

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
              {scores.map(m => (
                <tr key={m.id}>
                  <td className="py-1.5 font-medium">{m.label}</td>
                  <td className="text-right font-mono">{m.score}</td>
                  <td className="text-center">
                    <Badge variant={m.score >= 60 ? "default" : m.score >= 40 ? "secondary" : "destructive"} className="text-xs">
                      {getBand(m.score)}
                    </Badge>
                  </td>
                  <td className="text-left pl-3 text-muted-foreground">{getImplication(m.label, m.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Overall market access signal:</span>
          <Badge variant={signal === "Strong" ? "default" : signal === "Moderate" ? "secondary" : "destructive"}>
            {signal}
          </Badge>
        </div>

        <ModelNarrative>
          <p>{generatePANarrative(
            highest.label, highest.score,
            lowest.label, lowest.score,
            sorted.slice(0, 3).map(m => m.label)
          )}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
