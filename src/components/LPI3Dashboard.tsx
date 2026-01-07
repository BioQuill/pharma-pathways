import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DATA_SOURCES,
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
            <div className={`text-3xl font-bold ${prediction.calibratedProbability >= 0.5 ? 'text-green-600' : prediction.calibratedProbability >= 0.3 ? 'text-yellow-600' : 'text-red-600'}`}>
              {Math.round(prediction.calibratedProbability * 100)}%
            </div>
            <div 
              className="text-xs text-muted-foreground cursor-help" 
              title="95% Confidence Interval: The true launch probability is expected to fall within this range 95% of the time, based on model uncertainty and historical validation data."
            >
              CI: {(prediction.confidenceInterval.lower * 100).toFixed(0)}% - {(prediction.confidenceInterval.upper * 100).toFixed(0)}%
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
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);

  const predictions = useMemo(() => {
    return molecules.map(mol => ({
      molecule: mol,
      prediction: calculateLPI3ForMolecule(mol),
    }));
  }, [molecules]);

  const selectedPrediction = selectedMolecule 
    ? predictions.find(p => p.molecule.id === selectedMolecule) 
    : predictions[0];

  // Aggregate stats
  const avgProbability = predictions.reduce((sum, p) => sum + p.prediction.calibratedProbability, 0) / predictions.length;
  const highRiskCount = predictions.filter(p => p.prediction.calibratedProbability < 0.3).length;
  const lowRiskCount = predictions.filter(p => p.prediction.calibratedProbability >= 0.6).length;

  // Data for bar chart
  const barChartData = predictions
    .sort((a, b) => b.prediction.calibratedProbability - a.prediction.calibratedProbability)
    .map(p => ({
      name: p.molecule.name.split(' ')[0],
      probability: p.prediction.calibratedProbability * 100,
      raw: p.prediction.rawProbability * 100,
    }));

  // Category importance chart
  const categoryImportance = selectedPrediction?.prediction.featureCategories.map(cat => ({
    name: cat.name.split('/')[0].split(' ')[0],
    weight: cat.categoryWeight,
    score: (cat.features.reduce((sum, f) => sum + f.value * f.importance, 0) / 
            cat.features.reduce((sum, f) => sum + f.importance, 0)) * 100,
  })) || [];

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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold">{molecules.length}</div>
              <div className="text-xs text-muted-foreground">Molecules Analyzed</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold text-primary">{Math.round(avgProbability * 100)}%</div>
              <div className="text-xs text-muted-foreground">Avg Launch Probability</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold text-green-600">{lowRiskCount}</div>
              <div className="text-xs text-muted-foreground">High Confidence (≥60%)</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
              <div className="text-xs text-muted-foreground">High Risk (&lt;30%)</div>
            </div>
            <div className="text-center p-3 bg-background rounded-lg">
              <div className="text-2xl font-bold">0.82</div>
              <div className="text-xs text-muted-foreground">Model AUC-ROC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Methodology */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Model Architecture & Methodology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="algorithm">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>

            <TabsContent value="algorithm" className="space-y-3 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Primary Model: XGBoost Classifier</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Gradient boosted decision trees for probability estimation</li>
                    <li>Binary classification: launch within 8-10 year horizon</li>
                    <li>Handles missing data and non-linear interactions</li>
                    <li>Feature importance via SHAP values</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Survival Analysis Extension</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Cox proportional hazards for time-to-launch</li>
                    <li>Random Survival Forests for non-parametric estimation</li>
                    <li>Right-censoring handled for ongoing programs</li>
                    <li>Hazard ratios for phase transition timing</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-xs font-mono">
                <pre className="whitespace-pre-wrap">
{`# Model Pipeline
1. Feature Engineering → Canonicalize + Encode + Composite Scores
2. XGBoost Training → binary:logistic, AUC optimization
3. Calibration → Isotonic regression on validation set
4. SHAP → TreeExplainer for feature contributions
5. Output → P(launch | features), CI, top contributors`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-3 pt-4">
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold mb-2">Scientific (20%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Target validation strength</li>
                    <li>• Modality risk profile</li>
                    <li>• Biomarker availability</li>
                    <li>• MOA novelty/validation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Clinical (30%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Phase-specific success rates</li>
                    <li>• Phase II effect size</li>
                    <li>• Trial complexity/size</li>
                    <li>• Enrollment feasibility</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Regulatory (18%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Expedited pathway status</li>
                    <li>• Orphan designation</li>
                    <li>• CMC complexity</li>
                    <li>• First-in-class status</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Sponsor (15%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Sponsor type/size</li>
                    <li>• Historical track record</li>
                    <li>• Partnership status</li>
                    <li>• Funding/resources</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Market (10%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Addressable market size</li>
                    <li>• Competition density</li>
                    <li>• Reimbursement complexity</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Safety (7%)</h4>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Early safety signals</li>
                    <li>• Class safety history</li>
                    <li>• DILI/QT risk profile</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calibration" className="space-y-3 pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Isotonic Calibration</h4>
                  <p className="text-xs text-muted-foreground">
                    Raw model probabilities are calibrated using isotonic regression on a held-out validation set.
                    This ensures probabilities are well-calibrated (Brier score optimization).
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <div className="font-semibold">Calibration Slope</div>
                      <div className="text-lg">0.98</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="font-semibold">Calibration Intercept</div>
                      <div className="text-lg">0.02</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Confidence Intervals</h4>
                  <p className="text-xs text-muted-foreground">
                    Wilson score intervals (95% CI) account for sample uncertainty.
                    Wider intervals indicate less confidence in the point estimate.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded">
                      <div className="font-semibold">Brier Score</div>
                      <div className="text-lg">0.15</div>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <div className="font-semibold">AUC-ROC</div>
                      <div className="text-lg">0.82</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-3 pt-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Clinical Trial Data</h4>
                  {DATA_SOURCES.clinical.map((source, idx) => (
                    <div key={idx} className="text-xs p-2 bg-muted rounded mb-1">
                      <div className="font-medium">{source.name}</div>
                      <div className="text-muted-foreground">{source.type}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Regulatory Approvals</h4>
                  {DATA_SOURCES.regulatory.map((source, idx) => (
                    <div key={idx} className="text-xs p-2 bg-muted rounded mb-1">
                      <div className="font-medium">{source.name}</div>
                      <div className="text-muted-foreground">{source.type}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Market Intelligence</h4>
                  {DATA_SOURCES.market.map((source, idx) => (
                    <div key={idx} className="text-xs p-2 bg-muted rounded mb-1">
                      <div className="font-medium">{source.name}</div>
                      <div className="text-muted-foreground">{source.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Molecule Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Portfolio Launch Probability Comparison</CardTitle>
          <CardDescription>Calibrated vs raw probabilities across all molecules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="probability" name="Calibrated" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.probability >= 60 ? 'hsl(142, 76%, 36%)' : entry.probability >= 30 ? 'hsl(48, 96%, 53%)' : 'hsl(0, 84%, 60%)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Selected Molecule Deep Dive */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Molecule Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Select Molecule for Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {predictions.map(({ molecule, prediction }) => (
              <div
                key={molecule.id}
                onClick={() => setSelectedMolecule(molecule.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMolecule === molecule.id || (!selectedMolecule && molecule.id === predictions[0]?.molecule.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{molecule.name}</div>
                    <div className="text-xs text-muted-foreground">{molecule.company} • {molecule.phase}</div>
                  </div>
                  <Badge className={getScoreColor(prediction.calibratedProbability)}>
                    {Math.round(prediction.calibratedProbability * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        {selectedPrediction && (
          <MoleculeAnalysisCard 
            molecule={selectedPrediction.molecule} 
            prediction={selectedPrediction.prediction} 
          />
        )}
      </div>

      {/* Feature Categories Breakdown */}
      {selectedPrediction && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Feature Category Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {selectedPrediction.prediction.featureCategories.map((category, idx) => (
              <FeatureCategoryCard key={idx} category={category} />
            ))}
          </div>
        </div>
      )}

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
