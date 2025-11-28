import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";

interface TimelinePhase {
  phase: string;
  date: string;
  trialName?: string;
  nctIds?: string[];
  outcome: 'success' | 'partial' | 'pending' | 'setback';
  keyData: string[];
  scoreAtTime: number;
  rationale: string;
  dataAvailableAtTime: string[];
}

interface RetrospectiveTimelineProps {
  moleculeName: string;
  indication: string;
  sponsor: string;
  phases: TimelinePhase[];
}

const outcomeConfig = {
  success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Met Endpoints' },
  partial: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Partial Success' },
  pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: 'In Progress' },
  setback: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Setback' },
};

export function RetrospectiveTimeline({ moleculeName, indication, sponsor, phases }: RetrospectiveTimelineProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreTrend = (currentIndex: number) => {
    if (currentIndex === 0) return null;
    const current = phases[currentIndex].scoreAtTime;
    const previous = phases[currentIndex - 1].scoreAtTime;
    if (current > previous) return { icon: TrendingUp, color: 'text-success' };
    if (current < previous) return { icon: TrendingDown, color: 'text-destructive' };
    return null;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Retrospective Evaluation Timeline</CardTitle>
            <CardDescription>
              {moleculeName} • {indication} • {sponsor}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Historical Analysis
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Scores calculated based on data available at each milestone, simulating real-time due diligence decisions.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const OutcomeIcon = outcomeConfig[phase.outcome].icon;
              const trend = getScoreTrend(index);
              
              return (
                <div key={index} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 w-5 h-5 rounded-full border-2 border-background ${outcomeConfig[phase.outcome].bg} flex items-center justify-center`}>
                    <OutcomeIcon className={`w-3 h-3 ${outcomeConfig[phase.outcome].color}`} />
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${outcomeConfig[phase.outcome].bg}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{phase.phase}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {phase.date}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${outcomeConfig[phase.outcome].color}`}>
                            {outcomeConfig[phase.outcome].label}
                          </Badge>
                        </div>
                        {phase.trialName && (
                          <p className="text-sm text-muted-foreground mt-1">{phase.trialName}</p>
                        )}
                        {phase.nctIds && phase.nctIds.length > 0 && (
                          <div className="flex gap-2 mt-1">
                            {phase.nctIds.map(nctId => (
                              <a
                                key={nctId}
                                href={`https://clinicaltrials.gov/study/${nctId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                              >
                                {nctId} <ExternalLink className="w-3 h-3" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          {trend && (
                            <trend.icon className={`w-4 h-4 ${trend.color}`} />
                          )}
                          <span className={`text-2xl font-bold ${getScoreColor(phase.scoreAtTime)}`}>
                            {phase.scoreAtTime}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">Score at time</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">KEY DATA POINTS</p>
                        <ul className="text-sm space-y-1">
                          {phase.keyData.map((data, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {data}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">SCORING RATIONALE</p>
                        <p className="text-sm">{phase.rationale}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">DATA AVAILABLE AT THIS TIME</p>
                        <div className="flex flex-wrap gap-1">
                          {phase.dataAvailableAtTime.map((item, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Methodology:</strong> Scores reflect probability-weighted assessments based solely on publicly 
            available data at each milestone. Historical base rates for phase transitions, therapeutic area modifiers, 
            and regulatory precedents inform scoring. This retrospective analysis demonstrates how due diligence 
            conclusions would have evolved through the development program.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
