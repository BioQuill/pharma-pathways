import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { Brain } from "lucide-react";

interface LPICalibrationCardProps {
  molecule: any; // MoleculeProfile & { _raw }
}

const CATEGORY_LABELS: Record<string, string> = {
  clinical: "Clinical",
  scientific: "Scientific",
  regulatory: "Regulatory",
  sponsor: "Sponsor",
  market: "Market",
  safety: "Safety",
};

const CATEGORY_WEIGHTS: Record<string, number> = {
  clinical: 30,
  scientific: 20,
  regulatory: 18,
  sponsor: 15,
  market: 10,
  safety: 7,
};

export function LPICalibrationCard({ molecule }: LPICalibrationCardProps) {
  const raw = molecule._raw;
  const breakdown: Record<string, number> | undefined = raw?.lpi_breakdown;
  const lpiScore = molecule.scores?.approval != null
    ? Math.round(molecule.scores.approval * 100)
    : raw?.lpi_score ?? null;
  const ci = raw?.lpi_ci as string | undefined;
  const ciLow = raw?.lpi_ci_low as number | undefined;
  const ciHigh = raw?.lpi_ci_high as number | undefined;
  const label = raw?.lpi_label as string | undefined;

  if (!breakdown || lpiScore == null) return null;

  const radarData = Object.entries(breakdown).map(([key, value]) => ({
    category: CATEGORY_LABELS[key] || key,
    score: Math.round((value as number) * 100),
    weight: CATEGORY_WEIGHTS[key] || 0,
    fullMark: 100,
  }));

  const getScoreBg = (s: number) => {
    if (s >= 75) return "bg-[hsl(142,76%,36%)]";
    if (s >= 55) return "bg-[hsl(45,93%,47%)]";
    return "bg-[hsl(0,72%,51%)]";
  };

  const getLabelVariant = (l: string | undefined) => {
    if (l === "High") return "default" as const;
    if (l === "Moderate") return "secondary" as const;
    return "destructive" as const;
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">LPI — Calibrated Launch Probability</CardTitle>
            <p className="text-xs text-muted-foreground">
              6-Category Weighted Model (Clinical 30% · Scientific 20% · Regulatory 18% · Sponsor 15% · Market 10% · Safety 7%)
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            <div
              className={`w-16 h-16 rounded-full flex flex-col items-center justify-center text-white ${getScoreBg(lpiScore)}`}
            >
              <span className="text-xl font-bold leading-tight">{lpiScore}%</span>
              <span className="text-[10px] opacity-90 leading-tight">LPI</span>
            </div>
            {ci && (
              <span
                className="text-xs text-muted-foreground cursor-help"
                title="95% Confidence Interval based on phase + results availability"
              >
                CI: {ci}
              </span>
            )}
            {label && <Badge variant={getLabelVariant(label)}>{label}</Badge>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Radar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-md border bg-background px-3 py-2 text-xs shadow-lg">
                      <p className="font-semibold">{d.category}</p>
                      <p>Score: {d.score}%</p>
                      <p className="text-muted-foreground">Weight: {d.weight}%</p>
                    </div>
                  );
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Bars */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-3">Category Breakdown</h4>
          <div className="space-y-2">
            {radarData.map((d) => (
              <div key={d.category} className="flex items-center gap-3 text-xs">
                <span className="w-20 text-muted-foreground truncate">{d.category}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono font-medium">{d.score}%</span>
                <span className="w-8 text-right text-muted-foreground">({d.weight}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* CI Visual */}
        {ciLow != null && ciHigh != null && (
          <div className="border-t pt-3">
            <h4 className="text-xs font-semibold mb-2">Confidence Interval</h4>
            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-primary/20 rounded-full"
                style={{ left: `${ciLow}%`, width: `${ciHigh - ciLow}%` }}
              />
              <div
                className="absolute h-full w-0.5 bg-primary"
                style={{ left: `${lpiScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{ciLow}%</span>
              <span className="font-medium text-foreground">{lpiScore}%</span>
              <span>{ciHigh}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
