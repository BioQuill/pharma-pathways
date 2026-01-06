import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityScores, MarketData, calculateTimeToBlockbuster, calculateRevenueScore, calculateTTMPercent, calculateTTMMonths, calculateCompositeScore } from "@/lib/scoring";
import { TrendingUp, Activity, Target, Award, GitBranch, DollarSign, Clock, ExternalLink, BarChart3, Zap } from "lucide-react";
import { getClinicalTrialsUrl } from "@/lib/clinicalTrialsIntegration";
import { getManufacturingCapability } from "@/lib/manufacturingCapability";
import { calculatePeakSalesIndex, getPeakSalesScoreColor, getPeakSalesScoreBgColor, type PeakSalesResult } from "@/lib/peakSalesIndex";
import { type MoleculeProfile } from "@/lib/moleculesData";

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
  molecule?: MoleculeProfile; // Full molecule for Peak Sales Index calculation
}

export function MoleculeScoreCard({ moleculeName, trialName, scores, phase, indication, therapeuticArea, overallScore, nctId, marketData = [], companyTrackRecord = 'average', company, molecule }: MoleculeScoreCardProps) {
  const mfgCapability = company ? getManufacturingCapability(company) : null;
  
  // Calculate Peak Sales Index if molecule is provided
  const peakSalesIndex = molecule ? calculatePeakSalesIndex(molecule) : null;
  
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
  
  // Calculate composite score using new TA-specific formula:
  // A_norm = (LPI-1)/99, B_norm = (TTM-1)/(B_max-1)
  // Score = 100 * (0.7 * A_norm + 0.3 * (1 - B_norm))
  const compositeScore = calculateCompositeScore(overallScore, ttmMonths, therapeuticArea);
  
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
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <Badge variant="default" className="text-lg font-bold px-4 py-2 flex items-center justify-center" style={{ lineHeight: '1.2', display: 'flex', alignItems: 'center' }}>
                LPI-3: {overallScore}%
              </Badge>
              <Badge variant="default" className="text-lg font-bold px-4 py-2 flex items-center justify-center" style={{ lineHeight: '1.2', display: 'flex', alignItems: 'center' }}>
                TTM: {ttmMonths !== null ? `${ttmMonths} months` : 'N/A'}
              </Badge>
            </div>
            <div 
              className={`w-20 h-20 rounded-full text-white ${
                compositeScore >= 67 
                  ? 'bg-[hsl(142,76%,36%)]' // Green - top 33%
                  : compositeScore >= 34 
                    ? 'bg-[hsl(45,93%,47%)]' // Yellow - middle 33%
                    : 'bg-[hsl(0,72%,51%)]' // Red - bottom 33%
              }`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Composite Score: Weighted average of LPI (60%) and TTM efficiency (40%)"
            >
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-2xl font-bold" style={{ lineHeight: '1.2' }}>{compositeScore}</div>
                <div className="text-xs opacity-90" style={{ lineHeight: '1.2' }}>Score</div>
              </div>
            </div>
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
              <span className="text-xs text-muted-foreground">(of total TA)</span>
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

        {/* Peak Sales Index Section */}
        {peakSalesIndex && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BarChart3 className="w-4 h-4" />
              <span>Peak Sales Composite Index</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Composite Score */}
              <div className={`p-4 rounded-lg border-2 ${getPeakSalesScoreBgColor(peakSalesIndex.compositeScore)}`}>
                <p className="text-xs font-medium text-muted-foreground">Composite Score</p>
                <p className={`text-3xl font-bold ${getPeakSalesScoreColor(peakSalesIndex.compositeScore)}`}>
                  {peakSalesIndex.compositeScore}
                </p>
                <p className="text-xs text-muted-foreground">out of 100</p>
              </div>

              {/* Blockbuster Probability */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Blockbuster Probability (≥$1B)
                </p>
                <p className="text-2xl font-bold text-amber-700">
                  {peakSalesIndex.blockbusterProbability}%
                </p>
                <div className="w-full bg-amber-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-amber-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${peakSalesIndex.blockbusterProbability}%` }}
                  />
                </div>
              </div>

              {/* Peak Sales Estimate */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Estimated Peak Sales
                </p>
                <p className="text-2xl font-bold text-green-700">
                  ${peakSalesIndex.peakSalesEstimate}B
                </p>
                <p className="text-xs text-muted-foreground">Annual at peak</p>
              </div>
            </div>

            {/* Component Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {peakSalesIndex.componentScores.map((comp) => (
                <div key={comp.name} className="p-2 bg-muted/50 rounded-md text-center">
                  <p className="text-xs text-muted-foreground truncate" title={comp.name}>
                    {comp.name.split(' ')[0]}
                  </p>
                  <p className={`text-lg font-semibold ${getPeakSalesScoreColor(comp.score)}`}>
                    {Math.round(comp.score)}
                  </p>
                  <p className="text-xs text-muted-foreground">×{(comp.weight * 100).toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
