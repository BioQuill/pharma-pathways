import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProbabilityScores } from "@/lib/scoring";
import { TrendingUp, TrendingDown, Activity, Target, Award, GitBranch } from "lucide-react";

import { getClinicalTrialsUrl } from "@/lib/clinicalTrialsIntegration";

interface MoleculeScoreCardProps {
  moleculeName: string;
  scores: ProbabilityScores;
  phase: string;
  indication: string;
  overallScore: number;
  nctId?: string;
}

export function MoleculeScoreCard({ moleculeName, scores, phase, indication, overallScore, nctId }: MoleculeScoreCardProps) {
  const getDropoutColor = (ranking: number) => {
    if (ranking <= 2) return "text-success";
    if (ranking === 3) return "text-warning";
    return "text-destructive";
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{moleculeName}</CardTitle>
            <CardDescription>{indication} • {phase}</CardDescription>
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
          <Badge variant="default" className="text-lg font-bold px-4 py-2">
            Launch Probability: {overallScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
              <span>Approval Probability</span>
            </div>
            <p className="text-2xl font-semibold">{formatPercent(scores.approval)}</p>
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
