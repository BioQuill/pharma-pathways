import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Target,
  Factory,
  FileCheck,
  DollarSign,
  Building2
} from "lucide-react";
import { useState } from "react";
import { type LaunchFactors } from "@/lib/launchFactors";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LaunchFactorsCardProps {
  factors: LaunchFactors;
  moleculeName: string;
}

const factorIcons: Record<string, React.ReactNode> = {
  'Scientific Target Validation': <Target className="h-4 w-4" />,
  'CMC Readiness': <Factory className="h-4 w-4" />,
  'Regulatory Review Timeline': <Clock className="h-4 w-4" />,
  'Cost-Effectiveness Strength': <DollarSign className="h-4 w-4" />,
  'National Reimbursement Rules': <Building2 className="h-4 w-4" />,
};

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

export function LaunchFactorsCard({ factors, moleculeName }: LaunchFactorsCardProps) {
  const [isCompositeOpen, setIsCompositeOpen] = useState(false);
  const { rank1Factors, compositeIndex, phaseRiskMetrics } = factors;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Launch Probability Factors
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Key drivers based on ranked factor analysis
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phase Risk Metrics */}
        <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Phase Success Rate</span>
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

        {/* Rank 1 Factors - Primary Drivers */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Primary Launch Drivers (Rank 1)
          </h4>
          <div className="space-y-3">
            {rank1Factors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    {factorIcons[factor.name] || <Target className="h-4 w-4" />}
                    <span>{factor.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(factor.score)}`}>
                    {factor.score}%
                  </span>
                </div>
                <Progress 
                  value={factor.score} 
                  className={`h-1.5 ${getProgressBgClass(factor.score)}`}
                />
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Composite Index - Rank 2-4 Factors */}
        <Collapsible open={isCompositeOpen} onOpenChange={setIsCompositeOpen}>
          <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">Other Factors Composite Index</h4>
                  <Badge variant="secondary" className="text-xs">
                    {compositeIndex.factors.length} factors
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(compositeIndex.score)}`}>
                    {compositeIndex.score}%
                  </span>
                  {isCompositeOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="mt-4 space-y-4">
                {/* Rank 2 */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium">Rank 2 (Weight: 50%)</div>
                  <div className="grid gap-2">
                    {compositeIndex.factors.filter(f => f.rank === 2).map((factor) => (
                      <div key={factor.name} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{factor.name}</span>
                        <span className={getScoreColor(factor.score)}>{factor.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rank 3 */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium">Rank 3 (Weight: 30%)</div>
                  <div className="grid gap-2">
                    {compositeIndex.factors.filter(f => f.rank === 3).map((factor) => (
                      <div key={factor.name} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{factor.name}</span>
                        <span className={getScoreColor(factor.score)}>{factor.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Rank 4 */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 font-medium">Rank 4 (Weight: 20%)</div>
                  <div className="grid gap-2">
                    {compositeIndex.factors.filter(f => f.rank === 4).map((factor) => (
                      <div key={factor.name} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{factor.name}</span>
                        <span className={getScoreColor(factor.score)}>{factor.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

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
