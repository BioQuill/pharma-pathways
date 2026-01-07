// LPI-3 Report Card - Compact radar chart + percentage for Full DD Report
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from "recharts";
import { Brain, AlertTriangle } from "lucide-react";
import { calculateLPI3ForMolecule, type LPI3Prediction } from "@/lib/lpi3Model";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
}

interface LPI3ReportCardProps {
  molecule: MoleculeProfile;
}

export function LPI3ReportCard({ molecule }: LPI3ReportCardProps) {
  const prediction = useMemo(() => {
    return calculateLPI3ForMolecule(molecule);
  }, [molecule]);

  const radarData = prediction.featureCategories.map(cat => ({
    category: cat.name.split(' ')[0],
    score: (cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length) * 100,
    fullMark: 100,
  }));

  const getScoreColor = (score: number): string => {
    if (score >= 0.67) return 'text-[hsl(142,76%,36%)]';
    if (score >= 0.34) return 'text-[hsl(45,93%,47%)]';
    return 'text-[hsl(0,72%,51%)]';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 0.67) return 'bg-[hsl(142,76%,36%)]';
    if (score >= 0.34) return 'bg-[hsl(45,93%,47%)]';
    return 'bg-[hsl(0,72%,51%)]';
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">LPI (Launch Probability Index) Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">ML-Based Launch Probability (XGBoost + Calibration)</p>
          </div>
          <div className="text-right">
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${getScoreBgColor(prediction.calibratedProbability)}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-xl font-bold" style={{ lineHeight: '1.2' }}>
                  {(prediction.calibratedProbability * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] opacity-90" style={{ lineHeight: '1.2' }}>LPI</div>
              </div>
            </div>
            <div 
              className="text-xs text-muted-foreground mt-1 cursor-help" 
              title="95% Confidence Interval: The true launch probability is expected to fall within this range 95% of the time, based on model uncertainty and historical validation data."
            >
              CI: {(prediction.confidenceInterval.lower * 100).toFixed(0)}%-{(prediction.confidenceInterval.upper * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Flags */}
        {prediction.riskFlags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {prediction.riskFlags.slice(0, 3).map((flag, idx) => (
              <Badge 
                key={idx} 
                variant={flag.severity === 'critical' || flag.severity === 'high' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                {flag.message}
              </Badge>
            ))}
          </div>
        )}

        {/* Radar Chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Contributors */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-2">Top Feature Contributions</h4>
          <div className="grid grid-cols-2 gap-2">
            {prediction.topContributors.slice(0, 6).map((contrib, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className={`w-2 h-2 rounded-full ${contrib.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="flex-1 truncate">{contrib.feature}</span>
                <span className="font-mono text-muted-foreground">
                  {contrib.direction === 'positive' ? '+' : '-'}{(contrib.contribution * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
