import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Brain, 
  Database, 
  Shield, 
  Target, 
  TrendingUp, 
  FileCheck, 
  Building2,
  Zap,
  Globe,
  Clock,
  BarChart3,
  CheckCircle2,
  Layers,
  LineChart
} from "lucide-react";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";

const featureCategories = [
  {
    name: "Scientific / Preclinical",
    weight: "20%",
    icon: <Database className="h-5 w-5" />,
    features: [
      "Target validation strength",
      "Modality risk profile (small molecule, biologic, cell/gene)",
      "Biomarker availability for patient selection",
      "Mechanism of action novelty vs. validation"
    ]
  },
  {
    name: "Clinical Signals",
    weight: "30%",
    icon: <Target className="h-5 w-5" />,
    features: [
      "Phase-specific historical success rates",
      "Phase II effect size (if available)",
      "Trial size and operational complexity",
      "Enrollment feasibility and recruitment speed"
    ]
  },
  {
    name: "Regulatory & Program",
    weight: "18%",
    icon: <FileCheck className="h-5 w-5" />,
    features: [
      "Expedited pathway status (Breakthrough, Fast Track, Priority)",
      "Orphan drug designation",
      "CMC complexity score (1-5 scale)",
      "First-in-class regulatory pathway clarity"
    ]
  },
  {
    name: "Sponsor / Organization",
    weight: "15%",
    icon: <Building2 className="h-5 w-5" />,
    features: [
      "Sponsor type and size classification",
      "Historical track record in therapeutic area",
      "Partnership and licensing status",
      "Funding runway and resource availability"
    ]
  },
  {
    name: "Market & Commercial",
    weight: "10%",
    icon: <TrendingUp className="h-5 w-5" />,
    features: [
      "Total addressable market size",
      "Competitive density in indication",
      "Reimbursement complexity by geography"
    ]
  },
  {
    name: "Safety & History",
    weight: "7%",
    icon: <Shield className="h-5 w-5" />,
    features: [
      "Early safety signals from clinical data",
      "Drug class safety history",
      "DILI/QT prolongation risk profile"
    ]
  }
];

const dataSources = [
  {
    category: "Clinical Trial Registries",
    sources: [
      { name: "ClinicalTrials.gov", region: "US", type: "Primary", url: "https://clinicaltrials.gov" },
      { name: "WHO ICTRP", region: "Global", type: "12 Registries", url: "https://trialsearch.who.int" }
    ]
  },
  {
    category: "Regulatory Approval Databases",
    sources: [
      { name: "FDA NDA/BLA Approvals", region: "US", type: "Official", url: "https://www.fda.gov/drugs/nda-and-bla-approvals" },
      { name: "EMA National Registers", region: "EU", type: "Official", url: "https://www.ema.europa.eu" },
      { name: "EU Community Register", region: "EU", type: "Official", url: "https://ec.europa.eu/health/documents/community-register" },
      { name: "NMPA Drug Registry", region: "China", type: "Official", url: "https://www.nmpa.gov.cn" },
      { name: "PMDA Approvals", region: "Japan", type: "Official", url: "https://www.pmda.go.jp" },
      { name: "MHRA Products", region: "UK", type: "Official", url: "https://products.mhra.gov.uk" },
      { name: "Health Canada DPD", region: "Canada", type: "Official", url: "https://health-products.canada.ca/dpd-bdpp" },
      { name: "ANVISA Registry", region: "Brazil", type: "Official", url: "https://consultas.anvisa.gov.br" }
    ]
  },
  {
    category: "Financial & Company Data",
    sources: [
      { name: "Yahoo Finance", region: "Global", type: "CAPEX/Financials", url: "https://finance.yahoo.com" },
      { name: "SEC EDGAR", region: "US", type: "Filings", url: "https://www.sec.gov/edgar" }
    ]
  }
];

const validationMetrics = [
  { metric: "AUC-ROC", value: "0.82", description: "Area under ROC curve measuring discrimination ability" },
  { metric: "Brier Score", value: "0.15", description: "Probabilistic accuracy (lower is better)" },
  { metric: "Calibration Slope", value: "0.98", description: "How well predicted probabilities match observed outcomes" },
  { metric: "Calibration Intercept", value: "0.02", description: "Systematic over/under-estimation bias" }
];

const uniqueStrengths = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "ML-Powered Probability Scoring",
    description: "XGBoost gradient boosting with isotonic calibration delivers quantified launch probabilities, not qualitative ratings. Every prediction includes 95% confidence intervals.",
    highlight: "Calibrated probabilities, not opinions"
  },
  {
    icon: <Layers className="h-8 w-8" />,
    title: "SHAP-Based Transparency",
    description: "Full feature attribution via SHAP values shows exactly which factors drive each prediction. No black boxes—every score is explainable to investment committees.",
    highlight: "Complete model interpretability"
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "TA-Specific TTM Decomposition",
    description: "Time-to-market projections broken down by 5 lifecycle phases with therapeutic area-specific benchmarks. Understand where delays occur, not just when.",
    highlight: "Phase-level timeline visibility"
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: "10-Market Global Coverage",
    description: "Simultaneous analysis across US, EU, China, Japan, UK, Canada, Brazil, and more. Country-specific regulatory pathways and market access projections.",
    highlight: "True global commercial lens"
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "20 TA Composite Indexes",
    description: "Each therapeutic area has its own risk-weighted composite index. Compare molecules across TAs using consistent, benchmarked metrics.",
    highlight: "Apples-to-apples TA comparison"
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Retrospective Time-Travel Scoring",
    description: "Evaluate molecules at any historical phase milestone to simulate real-time investment decision-making. Backtest your thesis with data available at the time.",
    highlight: "Historical decision simulation"
  }
];

export default function Methodology() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Yellow Bar + Navy Navigation Bar */}
      <header className="sticky top-0 z-10 w-full">
        {/* Yellow Brand Bar */}
        <div className="bg-[#FFC512] w-full">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4">
                <img src={bioquillLogo} alt="BiOQUILL" className="h-14 w-auto object-contain" />
                <span className="text-lg font-semibold text-gray-800 hidden md:block">
                  Precision intelligence. From pipeline to patient.
                </span>
              </Link>
              <Badge variant="outline" className="bg-white/80 text-xs font-medium text-gray-600 border-gray-300 hidden sm:flex">
                Data refreshed: Monday 24 Feb 2026
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Navy Navigation Bar */}
        <div className="bg-[#0E1D35] w-full">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-0">
              <button className="flex-1 max-w-[200px] py-2 text-center font-bold text-white bg-white/15 border-r border-white/20">
                Methodology
              </button>
              <Link to="/" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-white/90 hover:bg-white/10 transition-colors border-r border-white/20">
                  Strategy Hub
                </button>
              </Link>
              <Link to="/pricing" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-white/90 hover:bg-white/10 transition-colors border-r border-white/20">
                  Pricing
                </button>
              </Link>
              <Link to="/" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-white/90 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  🔍 Search
                </button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero - Why BioQuill */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">The Quant Approach to Pharma DD</Badge>
          <h1 className="text-4xl font-bold mb-4">
            Why <span className="text-primary">BioQuill</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Data science-native pharmaceutical intelligence. Quantified risk, transparent methodology, 
            and outputs purpose-built for investment decision-making.
          </p>
        </div>

        {/* Unique Strengths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {uniqueStrengths.map((strength, idx) => (
            <Card key={idx} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <CardHeader>
                <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit mb-3">
                  {strength.icon}
                </div>
                <CardTitle className="text-lg">{strength.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{strength.description}</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {strength.highlight}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Methodology Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge className="mb-4">Methodology</Badge>
            <h2 className="text-3xl font-bold mb-4">LPI Model Architecture</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our Launch Probability Index uses gradient boosting machine learning with rigorous 
              calibration and validation to deliver trustworthy probability estimates.
            </p>
          </div>

          <Tabs defaultValue="algorithm" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-sky-100 dark:bg-sky-950/30">
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="features">Feature Engineering</TabsTrigger>
              <TabsTrigger value="calibration">Calibration</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="algorithm">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Primary Model: XGBoost Classifier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Gradient boosted decision trees for probability estimation
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Binary classification: launch within 8-10 year horizon
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Handles missing data and non-linear feature interactions
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Feature importance via SHAP TreeExplainer
                      </li>
                    </ul>
                    <div className="p-4 bg-muted/50 rounded-lg font-mono text-xs">
                      <pre className="whitespace-pre-wrap text-muted-foreground">
{`# Model Pipeline
1. Feature Engineering → Canonicalize + Encode
2. XGBoost Training → binary:logistic, AUC opt
3. Calibration → Isotonic regression
4. SHAP → Feature contributions
5. Output → P(launch | features), CI`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Survival Analysis Extension
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Cox proportional hazards for time-to-launch estimation
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Random Survival Forests for non-parametric estimation
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Right-censoring handled for ongoing programs
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                        Hazard ratios for phase transition timing
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      The survival component provides time-to-event predictions, complementing 
                      the binary classification with when a molecule is likely to launch, not just if.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featureCategories.map((category, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {category.icon}
                          </div>
                          <CardTitle className="text-base">{category.name}</CardTitle>
                        </div>
                        <Badge variant="outline">{category.weight}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1.5 text-xs text-muted-foreground">
                        {category.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="calibration">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Isotonic Calibration</CardTitle>
                    <CardDescription>
                      Raw model probabilities are calibrated to match observed frequencies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      XGBoost raw outputs are transformed using isotonic regression fitted on a 
                      held-out validation set. This ensures that when the model predicts 60% probability, 
                      approximately 60% of such molecules historically reached launch.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Why Calibration Matters</h4>
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        <li>• Enables meaningful probability comparisons across molecules</li>
                        <li>• Supports rational portfolio allocation decisions</li>
                        <li>• Provides honest uncertainty quantification</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Confidence Intervals</CardTitle>
                    <CardDescription>
                      95% Wilson score intervals for every prediction
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Every LPI score includes a confidence interval reflecting uncertainty from 
                      limited training data and model variance. Narrower intervals indicate higher 
                      prediction confidence.
                    </p>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Interpreting CI Width</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[hsl(142,76%,36%)]" />
                          <span>Narrow (±5-8%): High confidence, well-characterized profile</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]" />
                          <span>Medium (±8-12%): Moderate uncertainty, some data gaps</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]" />
                          <span>Wide (±12%+): High uncertainty, novel profile or limited data</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="validation">
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Performance Metrics</CardTitle>
                    <CardDescription>
                      Validated on held-out temporal test set (train on older cohorts, test on recent)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {validationMetrics.map((metric, idx) => (
                        <div key={idx} className="text-center p-4 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{metric.value}</div>
                          <div className="font-medium text-sm">{metric.metric}</div>
                          <div className="text-xs text-muted-foreground mt-1">{metric.description}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Training Methodology</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Temporal split:</strong> Train on 2000-2020, validate on 2021-2024</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                          <span><strong>No information leakage:</strong> Future data never used in training</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Stratified by TA:</strong> Ensures representation across therapeutic areas</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Annual recalibration:</strong> Model updated with latest outcomes</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Limitations & Caveats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-[hsl(45,93%,47%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Data quality:</strong> Accuracy depends on input completeness</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-[hsl(45,93%,47%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Temporal drift:</strong> Historical patterns may not predict novel modalities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-[hsl(45,93%,47%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Censoring:</strong> Ongoing programs have incomplete outcome data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-[hsl(45,93%,47%)] mt-0.5 flex-shrink-0" />
                          <span><strong>Decision aid:</strong> Supplements, does not replace, expert judgment</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Data Sources */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <Badge className="mb-4">Data Sources</Badge>
            <h2 className="text-3xl font-bold mb-4">Comprehensive Data Foundation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BioQuill integrates authoritative regulatory and clinical trial databases 
              across all major pharmaceutical markets.
            </p>
          </div>

          <div className="space-y-6">
            {dataSources.map((category, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {category.sources.map((source, sidx) => (
                      <a
                        key={sidx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="font-medium text-sm">{source.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{source.region}</Badge>
                          <span className="text-xs text-muted-foreground">{source.type}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to see BioQuill in action?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Explore our platform with live molecule data or contact us for a personalized demo.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/">
                <Button size="lg">
                  Explore Platform
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2026 BioQuill. Pharmaceutical Intelligence Platform.</p>
          <p className="text-xs mt-1 italic">Precision intelligence. From pipeline to patient.</p>
        </div>
      </footer>
    </div>
  );
}
