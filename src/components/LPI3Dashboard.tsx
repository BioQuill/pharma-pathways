import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const MoleculeAnalysisCard = ({ molecule, prediction }: { molecule: MoleculeProfile; prediction: LPI3Prediction }) => {
  const radarData = prediction.featureCategories.map(cat => ({
    category: cat.name.split(' ')[0],
    score: (cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length) * 100,
    fullMark: 100,
  }));

  return (
    <Card className="border-2">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{molecule.name}</CardTitle>
            <CardDescription>{molecule.company} • {molecule.therapeuticArea}</CardDescription>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1">{molecule.phase}</Badge>
            <div className={`text-3xl font-bold ${(molecule._raw?.lpi_score ?? molecule.overallScore ?? 0) >= 50 ? 'text-green-600' : (molecule._raw?.lpi_score ?? molecule.overallScore ?? 0) >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
              {molecule._raw?.lpi_score ?? molecule.overallScore ?? 0}%
            </div>
            <div 
              className="text-xs text-muted-foreground cursor-help" 
              title="95% Confidence Interval: The true launch probability is expected to fall within this range 95% of the time, based on model uncertainty and historical validation data."
            >
              CI: {(molecule._raw?.lpi_ci_low ?? 0)}% - {(molecule._raw?.lpi_ci_high ?? 0)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
};

export function LPI3Dashboard({ molecules }: LPI3DashboardProps) {
  const { sessionMolecule: simulatorMolecule } = useSessionMolecule();

  // If no molecule selected via "Use in Simulator →", show empty state
  if (!simulatorMolecule) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center space-y-3">
          <p className="text-lg font-semibold text-muted-foreground">Select a molecule from the Pipeline tab to begin simulation</p>
          <p className="text-sm text-muted-foreground">Click "Use in Simulator →" on any molecule card to load it here.</p>
        </CardContent>
      </Card>
    );
  }

  const prediction = calculateLPI3ForMolecule(simulatorMolecule);

  // Category importance chart
  const categoryImportance = prediction.featureCategories.map(cat => ({
    name: cat.name.split('/')[0].split(' ')[0],
    weight: cat.categoryWeight,
    score: (cat.features.reduce((sum, f) => sum + f.value * f.importance, 0) / 
            cat.features.reduce((sum, f) => sum + f.importance, 0)) * 100,
  }));

  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">LPI: ML-Based Launch Probability Model</CardTitle>
              <CardDescription>
                XGBoost classifier with isotonic calibration • SHAP feature importance • Survival analysis integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold text-primary">{simulatorMolecule._raw?.lpi_score ?? simulatorMolecule.overallScore ?? 0}%</div>
              <div className="text-xs text-muted-foreground">Launch Probability</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold">{simulatorMolecule._raw?.lpi_ci_low ?? 0}%–{simulatorMolecule._raw?.lpi_ci_high ?? 0}%</div>
              <div className="text-xs text-muted-foreground">95% Confidence Interval</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold">0.82</div>
              <div className="text-xs text-muted-foreground">Model AUC-ROC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Single Molecule Deep Dive */}
      <MoleculeAnalysisCard 
        molecule={simulatorMolecule} 
        prediction={prediction} 
      />

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
    </div>
  );
}
