import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Target, TrendingUp, FlaskConical, DollarSign, Building2 } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface MAProbabilityScore {
  ticker: string;
  name: string;
  category: string;
  stage: string;
  marketCap: string;
  clinicalDataScore: number;
  marketOpportunityScore: number;
  strategicFitScore: number;
  financialPositionScore: number;
  totalScore: number;
  rank: number;
}

interface CompanyInfo {
  ticker: string;
  name: string;
  focus: string;
  pipeline: string;
  stage: string;
  whyTarget: string;
  marketCap: string;
  category: string;
  note?: string;
}

interface CompanyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: MAProbabilityScore | null;
  companyInfo: CompanyInfo | null;
}

const SCORE_COLORS = {
  clinical: "hsl(217, 91%, 60%)",
  market: "hsl(142, 71%, 45%)",
  strategic: "hsl(262, 83%, 58%)",
  financial: "hsl(45, 93%, 47%)",
};

export function CompanyDetailModal({ open, onOpenChange, score, companyInfo }: CompanyDetailModalProps) {
  if (!score || !companyInfo) return null;

  const radarData = [
    { metric: "Clinical Data", value: score.clinicalDataScore, fullMark: 25 },
    { metric: "Market Opportunity", value: score.marketOpportunityScore, fullMark: 25 },
    { metric: "Strategic Fit", value: score.strategicFitScore, fullMark: 25 },
    { metric: "Financial Position", value: score.financialPositionScore, fullMark: 25 },
  ];

  const getScoreColor = (value: number, max: number) => {
    const pct = value / max;
    if (pct >= 0.8) return "text-green-500";
    if (pct >= 0.6) return "text-amber-500";
    return "text-muted-foreground";
  };

  const getTotalColor = (total: number) => {
    if (total >= 80) return "text-green-500";
    if (total >= 60) return "text-amber-500";
    return "text-muted-foreground";
  };

  const getStageColor = (stage: string) => {
    if (stage.includes("Approved") || stage.includes("Commercial")) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (stage.includes("Phase 3")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (stage.includes("Phase 2")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (stage.includes("Phase 1")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Badge variant={score.rank <= 3 ? "default" : "secondary"} className={score.rank <= 3 ? "bg-amber-500" : ""}>
              #{score.rank}
            </Badge>
            <div>
              <DialogTitle className="flex items-center gap-2">
                <a
                  href={`https://finance.yahoo.com/quote/${score.ticker}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1"
                >
                  {score.ticker}
                  <ExternalLink className="h-4 w-4" />
                </a>
                <span className="text-muted-foreground font-normal">|</span>
                <span>{score.name}</span>
              </DialogTitle>
              <DialogDescription className="mt-1">{companyInfo.focus}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Total Score */}
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="text-center">
            <p className={`text-5xl font-bold ${getTotalColor(score.totalScore)}`}>{score.totalScore}</p>
            <p className="text-sm text-muted-foreground">/100 M&A Score</p>
          </div>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Category:</span>
            <Badge variant="outline">{companyInfo.category}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Stage:</span>
            <Badge variant="outline" className={getStageColor(companyInfo.stage)}>{companyInfo.stage}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Market Cap:</span>
            <span className="font-medium text-green-500">{companyInfo.marketCap}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">M&A Rationale:</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{companyInfo.whyTarget}</p>

        {companyInfo.note && (
          <p className="text-sm text-amber-500 bg-amber-500/10 p-2 rounded">⚠ {companyInfo.note}</p>
        )}

        {/* Pipeline */}
        <div className="text-sm">
          <span className="font-medium">Pipeline: </span>
          <span className="text-muted-foreground">{companyInfo.pipeline}</span>
        </div>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <PolarRadiusAxis angle={90} domain={[0, 25]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg text-sm">
                            <p className="font-semibold">{data.metric}</p>
                            <p className="text-primary">{data.value}/25</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Score Bars */}
            <div className="space-y-3 mt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCORE_COLORS.clinical }} />
                    Clinical Data
                  </span>
                  <span className={`font-bold ${getScoreColor(score.clinicalDataScore, 25)}`}>
                    {score.clinicalDataScore}/25
                  </span>
                </div>
                <Progress value={(score.clinicalDataScore / 25) * 100} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCORE_COLORS.market }} />
                    Market Opportunity
                  </span>
                  <span className={`font-bold ${getScoreColor(score.marketOpportunityScore, 25)}`}>
                    {score.marketOpportunityScore}/25
                  </span>
                </div>
                <Progress value={(score.marketOpportunityScore / 25) * 100} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCORE_COLORS.strategic }} />
                    Strategic Fit
                  </span>
                  <span className={`font-bold ${getScoreColor(score.strategicFitScore, 25)}`}>
                    {score.strategicFitScore}/25
                  </span>
                </div>
                <Progress value={(score.strategicFitScore / 25) * 100} className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: SCORE_COLORS.financial }} />
                    Financial Position
                  </span>
                  <span className={`font-bold ${getScoreColor(score.financialPositionScore, 25)}`}>
                    {score.financialPositionScore}/25
                  </span>
                </div>
                <Progress value={(score.financialPositionScore / 25) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
