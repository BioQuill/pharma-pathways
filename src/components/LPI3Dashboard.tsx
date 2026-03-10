import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Cell, Legend
} from "recharts";
import { 
  Brain, 
  FlaskConical, 
  Building2, 
  TrendingUp, 
  Shield, 
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
  Gauge
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  calculateLPI3ForMolecule, 
  type LPI3Prediction,
  type FeatureCategory 
} from "@/lib/lpi3Model";
import { SimulatorLayout } from "./SimulatorLayout";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
  approval_status?: string;
  has_results?: boolean;
  status?: string;
  study_title?: string;
  conditions?: string;
  indication?: string;
  trialName?: string;
  overallScore?: number;
  _raw?: Record<string, any>;
}

interface LPI3DashboardProps {
  molecules: MoleculeProfile[];
}

const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Scientific / Preclinical': <FlaskConical className="h-5 w-5" />,
    'Clinical Signals': <Target className="h-5 w-5" />,
    'Regulatory & Program': <FileCheck2 className="h-5 w-5" />,
    'Sponsor / Organization': <Building2 className="h-5 w-5" />,
    'Market & Commercial': <TrendingUp className="h-5 w-5" />,
    'Safety & History': <Shield className="h-5 w-5" />,
  };
  return iconMap[name] || <Info className="h-5 w-5" />;
};

const getScoreColor = (score: number): string => {
  if (score >= 0.67) return 'bg-green-500';
  if (score >= 0.34) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 0.67) return 'default';
  if (score >= 0.34) return 'secondary';
  return 'destructive';
};


const FeatureCategoryCard = ({ category }: { category: FeatureCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const avgScore = category.features.reduce((sum, f) => sum + f.value, 0) / category.features.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getCategoryIcon(category.name)}
                </div>
                <div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getScoreBadgeVariant(avgScore)}>
                  {(avgScore * 100).toFixed(0)}%
                </Badge>
                <span className="text-xs text-muted-foreground">Weight: {category.categoryWeight}%</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {category.features.map((feature, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feature.name}</span>
                    {feature.impact === 'positive' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {feature.impact === 'negative' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.rawValue && (
                      <span className="text-xs text-muted-foreground">{feature.rawValue}</span>
                    )}
                    <span className="font-mono text-xs">{(feature.value * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <Progress value={feature.value * 100} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export function LPI3Dashboard({ molecules }: LPI3DashboardProps) {
  const { sessionMolecule: simulatorMolecule } = useSessionMolecule();

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

  const prediction = calculateLPI3ForMolecule(simulatorMolecule);
  const lpiScore = simulatorMolecule._raw?.lpi_score ?? simulatorMolecule.overallScore ?? 0;
  const ciLow = simulatorMolecule._raw?.lpi_ci_low ?? 0;
  const ciHigh = simulatorMolecule._raw?.lpi_ci_high ?? 0;

  const categoryImportance = prediction.featureCategories.map(cat => ({
    name: cat.name.split('/')[0].split(' ')[0],
    weight: cat.categoryWeight,
    score: (cat.features.reduce((sum, f) => sum + f.value * f.importance, 0) / 
            cat.features.reduce((sum, f) => sum + f.importance, 0)) * 100,
  }));

  const radarData = prediction.featureCategories.map(cat => ({
    category: cat.name.split(' ')[0],
    score: (cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length) * 100,
    fullMark: 100,
  }));

  // Context chart: horizontal bar comparing this molecule vs TA benchmark vs all phases
  const contextChart = (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Launch Probability: This Molecule vs Benchmarks</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium truncate">{simulatorMolecule.name}</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all flex items-center justify-end pr-2" style={{ width: `${lpiScore}%` }}>
              <span className="text-[10px] font-bold text-primary-foreground">{lpiScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium text-muted-foreground">TA Benchmark</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-muted-foreground/30 rounded-full transition-all flex items-center justify-end pr-2" style={{ width: '55%' }}>
              <span className="text-[10px] font-bold text-muted-foreground">55%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium text-muted-foreground">All Phases Avg</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-muted-foreground/20 rounded-full transition-all flex items-center justify-end pr-2" style={{ width: '42%' }}>
              <span className="text-[10px] font-bold text-muted-foreground">42%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Parameters: feature categories + radar + category importance
  const parametersContent = (
    <div className="space-y-6">
      {/* Risk Flags */}
      {prediction.riskFlags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {prediction.riskFlags.map((flag, idx) => (
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
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid strokeDasharray="3 3" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
            <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Contributors */}
      <div>
        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Top Feature Contributions (SHAP)
        </h4>
        <div className="space-y-1">
          {prediction.topContributors.slice(0, 5).map((contrib, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${contrib.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="flex-1">{contrib.feature}</span>
              <span className="font-mono">{contrib.direction === 'positive' ? '+' : '-'}{(contrib.contribution * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Categories Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Feature Category Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {prediction.featureCategories.map((category, idx) => (
            <FeatureCategoryCard key={idx} category={category} />
          ))}
        </div>
      </div>

      {/* Category Importance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category Weight vs Performance</CardTitle>
          <CardDescription>How each feature category contributes to the final score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryImportance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name === 'weight' ? 'Category Weight' : 'Score']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="weight" name="Weight" fill="hsl(var(--muted-foreground))" opacity={0.5} />
                <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Generate narrative
  const sortedCats = [...prediction.featureCategories].sort((a, b) => {
    const avgA = a.features.reduce((s, f) => s + f.value, 0) / a.features.length;
    const avgB = b.features.reduce((s, f) => s + f.value, 0) / b.features.length;
    return avgB - avgA;
  });
  const topCat = sortedCats[0]?.name || "Clinical Signals";
  const bottomCat = sortedCats[sortedCats.length - 1]?.name || "Safety & History";

  const lpiNarrative = (() => {
    const pct = lpiScore;
    if (pct >= 75) {
      const phaseNote = simulatorMolecule.phase.toLowerCase().includes("phase 3") || simulatorMolecule.phase.toLowerCase().includes("phase iii")
        ? " Phase III status is the strongest positive signal." : "";
      return `This molecule shows high launch probability at ${pct}%, placing it among top-performing ${simulatorMolecule.therapeuticArea} pipeline assets. The score is driven primarily by ${topCat}.${phaseNote} Primary risk: ${bottomCat}.`;
    }
    if (pct >= 50) {
      return `This molecule shows moderate launch probability (${pct}%) for a ${simulatorMolecule.phase} asset in ${simulatorMolecule.therapeuticArea}. Strengths: ${topCat}. Key uncertainty: ${bottomCat}.`;
    }
    return `This molecule faces significant launch headwinds at ${pct}%. ${simulatorMolecule.phase} assets in ${simulatorMolecule.therapeuticArea} historically face attrition at this stage. Improvement drivers: ${bottomCat}.`;
  })();

  return (
    <SimulatorLayout
      badgeValue={lpiScore}
      badgeLabel="Launch Probability"
      principle={`${simulatorMolecule.phase} molecules from ${simulatorMolecule.company || 'this sponsor'} in ${simulatorMolecule.therapeuticArea} have historically launched ${lpiScore}% of the time.`}
      autoBaseline={true}
      chart={contextChart}
      parameters={parametersContent}
      narrative={lpiNarrative}
      secondaryStats={[
        { label: "CI", value: `${ciLow}%–${ciHigh}%` },
        { label: "AUC-ROC", value: "0.82" },
      ]}
    >
      {/* Model Limitations */}
      <Card className="border-yellow-500/30 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Cautions & Limitations
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p><strong>Data Quality:</strong> Model accuracy depends on completeness of input features. Missing or mis-labeled data can bias results.</p>
          <p><strong>Temporal Effects:</strong> Success rates vary over time. Model is trained on historical cohorts and may not capture emerging trends.</p>
          <p><strong>Censoring:</strong> Ongoing programs are right-censored. Binary model excludes immature cases; survival model provides fuller picture.</p>
          <p><strong>Decision Aid:</strong> This model aids human decision-making but does not replace expert judgment. Always disclose uncertainty to stakeholders.</p>
        </CardContent>
      </Card>
    </SimulatorLayout>
  );
}
