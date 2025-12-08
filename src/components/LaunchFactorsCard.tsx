import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  Clock, 
  FileCheck,
  FileText
} from "lucide-react";
import { type LaunchFactors } from "@/lib/launchFactors";
import { generateTACompositeIndex, type TACompositeIndex } from "@/lib/taCompositeIndex";

interface LaunchFactorsCardProps {
  factors: LaunchFactors;
  moleculeName: string;
  therapeuticArea: string;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function getProgressBgClass(score: number): string {
  if (score >= 75) return "[&>div]:bg-emerald-500";
  if (score >= 50) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-red-500";
}

function getScoreBadgeClass(score: number): string {
  if (score >= 70) return "bg-emerald-500 text-white";
  if (score >= 55) return "bg-amber-500 text-white";
  return "bg-red-500 text-white";
}

export function LaunchFactorsCard({ factors, moleculeName, therapeuticArea }: LaunchFactorsCardProps) {
  const { phaseRiskMetrics } = factors;
  
  // Get the TA-specific composite index for this molecule
  const taIndex: TACompositeIndex = generateTACompositeIndex(therapeuticArea);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Launch Probability Factors
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Key drivers based on TA-weighted factor analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* TA Composite Index Display */}
        <div className="p-4 rounded-lg bg-background border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base">{taIndex.ta}</span>
            </div>
            <Badge className={`text-lg font-bold px-3 py-1 ${getScoreBadgeClass(taIndex.compositeScore)}`}>
              {taIndex.compositeScore}%
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Composite Score</span>
              <span>{taIndex.compositeScore}%</span>
            </div>
            <div className="relative h-2 w-full rounded-full overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400" />
              {/* Progress indicator */}
              <div 
                className="absolute inset-y-0 right-0 bg-muted"
                style={{ width: `${100 - taIndex.compositeScore}%` }}
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">FDA Avg:</span>
              <span className="font-medium">{taIndex.avgApprovalTimeFDA} months</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">EMA Avg:</span>
              <span className="font-medium">{taIndex.avgApprovalTimeEMA} months</span>
            </div>
          </div>
        </div>

        {/* General Industry Impact per Life Cycle Phase */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">General Industry Impact per Life Cycle Phase</span>
            <Badge variant="outline" className={getScoreColor(phaseRiskMetrics.phaseSuccessRate * 100)}>
              {Math.round(phaseRiskMetrics.phaseSuccessRate * 100)}%
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
            <div className="text-center p-2 bg-background/50 rounded">
              <div className="font-medium text-foreground">{phaseRiskMetrics.expectedDelays.internal}%</div>
              <div>Internal Delays</div>
            </div>
            <div className="text-center p-2 bg-background/50 rounded">
              <div className="font-medium text-foreground">{phaseRiskMetrics.expectedDelays.regulatory}%</div>
              <div>Regulatory</div>
            </div>
            <div className="text-center p-2 bg-background/50 rounded">
              <div className="font-medium text-foreground">{phaseRiskMetrics.expectedDelays.supplyChain}%</div>
              <div>Supply Chain</div>
            </div>
          </div>
          {phaseRiskMetrics.costConcentration > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <AlertTriangle className="h-3 w-3" />
              <span>{phaseRiskMetrics.costConcentration}% of total development cost at this phase</span>
            </div>
          )}
        </div>

        {/* Key Failure Points */}
        {phaseRiskMetrics.failurePoints.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Key Failure Points at {phaseRiskMetrics.currentPhase}
            </h4>
            <ul className="space-y-1">
              {phaseRiskMetrics.failurePoints.map((point, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="h-1 w-1 bg-amber-400 rounded-full" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
