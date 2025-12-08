import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityScores, MarketData, calculateTimeToBlockbuster, calculateRevenueScore, calculateTTMPercent, calculateTTMMonths } from "@/lib/scoring";
import { TrendingUp, Activity, Target, Award, GitBranch, DollarSign, Clock, ExternalLink } from "lucide-react";
import { getClinicalTrialsUrl } from "@/lib/clinicalTrialsIntegration";
import { getManufacturingCapability } from "@/lib/manufacturingCapability";

interface MoleculeScoreCardProps {
  moleculeName: string;
  trialName?: string;
  scores: ProbabilityScores;
  phase: string;
  indication: string;
  therapeuticArea: string;
  overallScore: number;
  nctId?: string;
  marketData?: MarketData[];
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  company?: string;
}

export function MoleculeScoreCard({ moleculeName, trialName, scores, phase, indication, therapeuticArea, overallScore, nctId, marketData = [], companyTrackRecord = 'average', company }: MoleculeScoreCardProps) {
  const mfgCapability = company ? getManufacturingCapability(company) : null;
  
  const getDropoutColor = (ranking: number) => {
    if (ranking <= 2) return "text-success";
    if (ranking === 3) return "text-warning";
    return "text-destructive";
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
  
  const timeToBlockbuster = calculateTimeToBlockbuster(marketData);
  const revenueScore = calculateRevenueScore(marketData);
  const ttmPercent = calculateTTMPercent(phase, therapeuticArea, companyTrackRecord, marketData);
  const ttmMonths = calculateTTMMonths(phase, therapeuticArea, companyTrackRecord, marketData);
  
  const getBlockbusterColor = (years: number | null) => {
    if (years === null) return "text-muted-foreground";
    if (years <= 4) return "text-success";
    if (years <= 8) return "text-warning";
    return "text-destructive";
  };

  const getTTMColor = (percent: number | null) => {
    if (percent === null) return "text-muted-foreground";
    if (percent <= 25) return "text-success";
    if (percent <= 50) return "text-chart-4";
    if (percent <= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">{moleculeName}</CardTitle>
            </div>
            {trialName && (
              <p className="text-sm font-medium text-primary mt-0.5">{trialName}</p>
            )}
            {company && (
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-[hsl(50,100%,85%)] text-foreground">
                  <span>{company}</span>
                  {mfgCapability?.ticker && (
                    <a
                      href={`https://finance.yahoo.com/quote/${mfgCapability.ticker}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[hsl(0,70%,35%)] hover:text-[hsl(0,70%,25%)] transition-colors"
                      title="View on Yahoo Finance"
                    >
                      {mfgCapability.ticker}
                    </a>
                  )}
                </span>
              </div>
            )}
            <CardDescription>{indication} • {therapeuticArea} • {phase}</CardDescription>
            {nctId && (
              <a 
                href={getClinicalTrialsUrl(nctId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline mt-1 inline-block"
              >
                ClinicalTrials.gov: {nctId} →
              </a>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="default" className="text-lg font-bold px-4 py-2">
              LPI%: {overallScore}%
            </Badge>
            <Badge variant="default" className="text-lg font-bold px-4 py-2">
              TTM: {ttmMonths !== null ? `${ttmMonths} months` : 'N/A'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="w-4 h-4" />
              <span>Meeting Endpoints</span>
            </div>
            <p className="text-2xl font-semibold">{formatPercent(scores.meetingEndpoints)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Next Phase Probability</span>
            </div>
            <p className="text-2xl font-semibold">{formatPercent(scores.nextPhase)}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>On Time Approval Prob.</span>
            </div>
            <p className="text-2xl font-semibold">{formatPercent(scores.approval)}</p>
            <span className="text-xs text-muted-foreground">(vs TA avg)</span>
          </div>

          <div className="space-y-1">
            <div className={`flex items-center gap-2 text-sm ${getTTMColor(ttmPercent)}`}>
              <Clock className="w-4 h-4" />
              <span>TTM%</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-semibold ${getTTMColor(ttmPercent)}`}>
                {ttmPercent !== null ? `${ttmPercent}%` : 'N/A'}
              </p>
              <span className="text-xs text-muted-foreground">(vs avg)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`flex items-center gap-2 text-sm ${getDropoutColor(scores.dropoutRanking)}`}>
              <Activity className="w-4 h-4" />
              <span>Dropout Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-semibold ${getDropoutColor(scores.dropoutRanking)}`}>
                {scores.dropoutRanking}/5
              </p>
              <span className="text-xs text-muted-foreground">(5=highest)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className={`flex items-center gap-2 text-sm ${getBlockbusterColor(timeToBlockbuster)}`}>
              <DollarSign className="w-4 h-4" />
              <span>Time to Blockbuster</span>
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-semibold ${getBlockbusterColor(timeToBlockbuster)}`}>
                {timeToBlockbuster !== null ? `${timeToBlockbuster}y` : 'N/A'}
              </p>
              <span className="text-xs text-muted-foreground">($1B sales)</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Revenue Score</span>
            </div>
            <p className="text-2xl font-semibold">{formatPercent(revenueScore)}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GitBranch className="w-4 h-4" />
            <span>Regulatory Pathway Probabilities</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between text-sm">
              <span>Standard:</span>
              <span className="font-medium">{formatPercent(scores.regulatoryPathway.standard)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Accelerated:</span>
              <span className="font-medium">{formatPercent(scores.regulatoryPathway.accelerated)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Breakthrough:</span>
              <span className="font-medium">{formatPercent(scores.regulatoryPathway.breakthrough)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Orphan:</span>
              <span className="font-medium">{formatPercent(scores.regulatoryPathway.orphan)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
