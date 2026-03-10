// LPI-2 Dashboard: 5-Factor Investment LPI Model (VC / Investment Model)
import { useState, useMemo } from "react";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Target,
  Building2,
  FlaskConical,
  FileCheck,
  Shield,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { calculateLPI2ForMolecule, LPI2_DATA_SOURCES, type LPI2Prediction, type LPI2Factor } from "@/lib/lpi2Model";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SimulatorLayout } from "./SimulatorLayout";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
}

interface LPI2DashboardProps {
  molecules: MoleculeProfile[];
}

// Factor icons mapping
const factorIcons: Record<string, React.ReactNode> = {
  'Biological Plausibility': <FlaskConical className="h-4 w-4" />,
  'Translational Evidence': <Target className="h-4 w-4" />,
  'Clinical Readiness': <FileCheck className="h-4 w-4" />,
  'Regulatory Attractiveness': <Shield className="h-4 w-4" />,
  'Team & Sponsor': <Users className="h-4 w-4" />,
};

// Score color helpers
function getScoreColor(score: number): string {
  if (score >= 75) return 'hsl(142, 76%, 36%)';
  if (score >= 60) return 'hsl(45, 93%, 47%)';
  if (score >= 45) return 'hsl(25, 95%, 53%)';
  return 'hsl(0, 72%, 51%)';
}

function getRecommendationBadge(recommendation: string) {
  const variants: Record<string, { bg: string; text: string }> = {
    'Strong Buy': { bg: 'bg-[hsl(142,76%,36%)]', text: 'text-white' },
    'Buy': { bg: 'bg-[hsl(142,50%,50%)]', text: 'text-white' },
    'Hold': { bg: 'bg-[hsl(45,93%,47%)]', text: 'text-black' },
    'Pass': { bg: 'bg-[hsl(0,72%,51%)]', text: 'text-white' },
  };
  const style = variants[recommendation] || variants['Hold'];
  return <Badge className={`${style.bg} ${style.text}`}>{recommendation}</Badge>;
}

function getRiskBadge(risk: string) {
  const variants: Record<string, { bg: string; text: string }> = {
    'Low': { bg: 'bg-[hsl(142,76%,36%)]', text: 'text-white' },
    'Medium': { bg: 'bg-[hsl(45,93%,47%)]', text: 'text-black' },
    'High': { bg: 'bg-[hsl(25,95%,53%)]', text: 'text-white' },
    'Very High': { bg: 'bg-[hsl(0,72%,51%)]', text: 'text-white' },
  };
  const style = variants[risk] || variants['Medium'];
  return <Badge className={`${style.bg} ${style.text}`}>{risk} Risk</Badge>;
}

// Factor Card Component
function FactorCard({ factor, isExpanded, onToggle }: { factor: LPI2Factor; isExpanded: boolean; onToggle: () => void }) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="border">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="py-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {factorIcons[factor.name]}
                </div>
                <div className="text-left">
                  <CardTitle className="text-sm font-semibold">{factor.name}</CardTitle>
                  <CardDescription className="text-xs">{factor.kpiExample}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{factor.weight}%</Badge>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getScoreColor(factor.score) }}
                >
                  {Math.round(factor.score)}
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <p className="text-xs text-muted-foreground mb-3">{factor.description}</p>
            <div className="space-y-2">
              {factor.subFactors.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{sub.name}</span>
                    <p className="text-xs text-muted-foreground">{sub.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={sub.score} className="w-20 h-2" />
                    <span className="text-xs font-medium w-8">{Math.round(sub.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Main Dashboard Component
export function LPI2Dashboard({ molecules }: LPI2DashboardProps) {
  const { sessionMolecule: simulatorMolecule } = useSessionMolecule();
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());

  if (!simulatorMolecule) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center space-y-3">
          <p className="text-lg font-semibold text-muted-foreground">No molecule loaded</p>
          <p className="text-sm text-muted-foreground">Use the molecule picker above or select a molecule from the database below.</p>
        </CardContent>
      </Card>
    );
  }

  const prediction = calculateLPI2ForMolecule(simulatorMolecule);

  const toggleFactor = (name: string) => {
    setExpandedFactors(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const radarData = prediction.factors.map(f => ({
    factor: f.name.split(' ')[0],
    score: f.score,
    fullMark: 100,
  }));

  // Context chart: gauge/percentile bar
  const contextChart = (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Investment Score Percentile</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium truncate">{simulatorMolecule.name}</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all flex items-center justify-end pr-2" 
              style={{ width: `${prediction.totalScore}%`, backgroundColor: getScoreColor(prediction.totalScore) }}>
              <span className="text-[10px] font-bold text-white">{prediction.totalScore}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground px-32">
          <span>0 — Pass</span>
          <span>45 — Hold</span>
          <span>60 — Buy</span>
          <span>75+ — Strong Buy</span>
        </div>
      </div>
    </div>
  );

  // Parameters: factor details + radar + charts
  const parametersContent = (
    <div className="space-y-6">
      {/* Radar + Bar charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">5-Factor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Factor Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={prediction.factors} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="score" name="Score">
                  {prediction.factors.map((entry, index) => (
                    <Cell key={index} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Factor Cards */}
      <div className="space-y-2">
        <h4 className="font-semibold text-lg">Factor Details</h4>
        {prediction.factors.map((factor) => (
          <FactorCard
            key={factor.name}
            factor={factor}
            isExpanded={expandedFactors.has(factor.name)}
            onToggle={() => toggleFactor(factor.name)}
          />
        ))}
      </div>

      {/* Data Sources */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-lg">Data Sources</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LPI2_DATA_SOURCES.map((source, idx) => (
              <a key={idx} href={source.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-center">
                <div className="text-sm font-medium">{source.name}</div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const investNarrative = (() => {
    const s = prediction.totalScore;
    const top = prediction.components?.slice(0, 2).map((c: any) => c.name).join(" and ") || "clinical factors";
    const weak = prediction.components?.[prediction.components.length - 1]?.name || "market positioning";
    if (s >= 75) return `Strong investment signal at ${s}/100. This molecule scores above the platform threshold for VC/BD interest. ${top} are the primary value drivers. Recommended action: full due diligence warranted.`;
    if (s >= 50) return `Moderate investment signal at ${s}/100. Selective interest is appropriate. ${top} supports consideration but ${weak} requires further validation before commitment.`;
    return `Weak investment signal at ${s}/100 at current development stage. Monitor for phase advancement, data readout, or partnership announcement as potential re-rating catalysts.`;
  })();

  return (
    <SimulatorLayout
      badgeValue={prediction.totalScore}
      badgeLabel="Investment Score"
      badgeSuffix="/100"
      principle={`${simulatorMolecule.name} scores ${prediction.totalScore}/100 on the 5-factor investment model — recommendation: ${prediction.recommendation}.`}
      autoBaseline={true}
      chart={contextChart}
      parameters={parametersContent}
      narrative={investNarrative}
      secondaryStats={[
        { label: "Recommendation", value: prediction.recommendation },
        { label: "Risk", value: prediction.riskLevel },
      ]}
    >
      {/* Interpretation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Investment Interpretation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Score Thresholds</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(142,76%,36%)]" /><span><strong>75-100:</strong> Strong Buy</span></li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(142,50%,50%)]" /><span><strong>60-74:</strong> Buy</span></li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]" /><span><strong>45-59:</strong> Hold</span></li>
                <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]" /><span><strong>0-44:</strong> Pass</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Model Limitations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Simplified model optimized for early-stage assessment</li>
                <li>• Does not incorporate time-to-event survival analysis</li>
                <li>• Team assessment based on company profile, not individual evaluation</li>
                <li>• Best suited for Phase I-II financing decisions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </SimulatorLayout>
  );
}
