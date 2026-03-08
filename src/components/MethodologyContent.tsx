import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Shield, 
  TrendingUp, 
  CheckCircle2,
  Globe,
  Clock,
  BarChart3,
  Zap,
  ArrowRight,
  ShieldCheck,
  Target,
  Activity,
  AlertTriangle,
  Scale,
  LineChart,
  Gem,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

const modelSuite = [
  {
    name: "PTRS",
    icon: <TrendingUp className="h-5 w-5" />,
    subtitle: "APPROVAL",
    description: "Probability of Technical and Regulatory Success — grounded in BIO/Norstella published phase transition rates across 20 therapeutic areas.",
  },
  {
    name: "Monte Carlo",
    icon: <Activity className="h-5 w-5" />,
    subtitle: "APPROVAL",
    description: "10,000-iteration uncertainty propagation through each PTRS input independently, producing P5–P95 confidence ranges.",
  },
  {
    name: "TI (Therapeutic Index)",
    icon: <ShieldCheck className="h-5 w-5" />,
    subtitle: "PIPELINE",
    description: "TD50/ED50 safety margin from pharmacology literature. Classifies drugs as narrow, moderate, or wide therapeutic index.",
  },
  {
    name: "LPI (Launch Potential Index)",
    icon: <BarChart3 className="h-5 w-5" />,
    subtitle: "PIPELINE",
    description: "Composite launch probability score combining scientific, clinical, regulatory, sponsor, market, and safety factors.",
  },
  {
    name: "Composite Score",
    icon: <Target className="h-5 w-5" />,
    subtitle: "PIPELINE",
    description: "Overall molecule attractiveness index combining LPI and TTM efficiency into a single 0–100 score.",
  },
  {
    name: "CAPM Alpha Signals",
    icon: <Zap className="h-5 w-5" />,
    subtitle: "STRATEGY HUB",
    description: "Risk-adjusted performance vs historical benchmarks (α₁) and current pipeline competition (α₂), with divergence tracking (Δα).",
  },
  {
    name: "TTM (Time to Market)",
    icon: <Clock className="h-5 w-5" />,
    subtitle: "APPROVAL",
    description: "Empirical time from first patient in to commercial launch, with 5-phase lifecycle decomposition by therapeutic area.",
  },
  {
    name: "TA Risk Index",
    icon: <AlertTriangle className="h-5 w-5" />,
    subtitle: "APPROVAL",
    description: "TA-specific composite risk score combining regulatory precedent, competitive density, and clinical complexity. Feeds directly into LPI as the Regulatory weight component.",
  },
  {
    name: "PA Index-1 — MWPSPI",
    icon: <Scale className="h-5 w-5" />,
    subtitle: "PRICING & ACCESS · Model 1",
    description: "Market-Weighted Payer Support Probability Index. Scores 0-100 by weighting Clinical, Economic, Access and Political factors according to each payer system's documented decision-making priorities across 8 global markets.",
  },
  {
    name: "PA Index-2 — Comparative Payer Likelihood Matrix",
    icon: <BarChart3 className="h-5 w-5" />,
    subtitle: "PRICING & ACCESS · Model 2",
    description: "Uses historical approval/coverage base rates combined with molecule-specific comparator benchmarking across 20 therapeutic areas and 8 global markets.",
  },
  {
    name: "Peak Sales Index",
    icon: <LineChart className="h-5 w-5" />,
    subtitle: "LAUNCH & COMMERCIAL",
    description: "Composite peak sales potential model combining market size, clinical differentiation, commercial execution, strategic positioning, competitive dynamics, market access, and pricing power.",
  },
  {
    name: "$1B Blockbuster Probability",
    icon: <Gem className="h-5 w-5" />,
    subtitle: "LAUNCH & COMMERCIAL",
    description: "Probability of achieving $1B+ peak annual sales via logistic regression on composite Peak Sales Score. Validated r=0.78, 82% accuracy on 100 drug launches 2014-2024.",
  },
  {
    name: "Investment Score",
    icon: <Briefcase className="h-5 w-5" />,
    subtitle: "STRATEGY HUB",
    description: "5-factor VC and licensing assessment model scoring molecules on market potential, clinical success, commercial advantage, strategic positioning, and competitive dynamics.",
  },
];

const dataSources = [
  { name: "ClinicalTrials.gov", region: "US", type: "Primary", url: "https://clinicaltrials.gov" },
  { name: "WHO ICTRP", region: "Global", type: "12 Registries", url: "https://trialsearch.who.int" },
  { name: "FDA NDA/BLA Approvals", region: "US", type: "Official", url: "https://www.fda.gov/drugs/nda-and-bla-approvals" },
  { name: "EMA National Registers", region: "EU", type: "Official", url: "https://www.ema.europa.eu" },
  { name: "Yahoo Finance", region: "Global", type: "Financials", url: "https://finance.yahoo.com" },
  { name: "SEC EDGAR", region: "US", type: "Filings", url: "https://www.sec.gov/edgar" },
];

interface MethodologyContentProps {
  onNavigateToModels?: (tab: string) => void;
}

export const MethodologyContent = ({ onNavigateToModels }: MethodologyContentProps = {}) => {
  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">The Quant Approach to Pharma DD</Badge>
        <h1 className="text-4xl font-bold mb-4">
          Why <span className="text-primary">BioQuill</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Data science-native pharmaceutical intelligence. Quantified risk, transparent methodology, 
          and outputs purpose-built for investment decision-making.
        </p>
      </div>

      {/* Section 1: Data Foundation */}
      <div>
        <div className="text-center mb-8">
          <Badge className="mb-3"><Database className="h-3 w-3 mr-1 inline" /> Data Foundation</Badge>
          <h2 className="text-3xl font-bold">Comprehensive Data Coverage</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">14,000+</p>
              <p className="text-sm text-muted-foreground mt-1">Clinical Trials</p>
              <p className="text-xs text-muted-foreground">ClinicalTrials.gov</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">9,754</p>
              <p className="text-sm text-muted-foreground mt-1">Unique Molecules</p>
              <p className="text-xs text-muted-foreground">Deduplicated, most advanced phase</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">209</p>
              <p className="text-sm text-muted-foreground mt-1">FDA-Approved NMEs</p>
              <p className="text-xs text-muted-foreground">2000–2025</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">145</p>
              <p className="text-sm text-muted-foreground mt-1">EMA-Approved NMEs</p>
              <p className="text-xs text-muted-foreground">2000–2025</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-5">
              <p className="text-3xl font-bold text-primary">396</p>
              <p className="text-sm text-muted-foreground mt-1">Matched Drugs</p>
              <p className="text-xs text-muted-foreground">EMA EPAR × CT.gov (TTM)</p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4 italic">
          Data refreshed weekly — reflecting the latest trial registrations, regulatory decisions, and market access updates.
        </p>
      </div>

      {/* Section 2: Model Suite */}
      <div>
        <div className="text-center mb-8">
          <Badge className="mb-3"><BarChart3 className="h-3 w-3 mr-1 inline" /> Model Suite</Badge>
          <h2 className="text-3xl font-bold">12 Proprietary Models</h2>
          <p className="text-muted-foreground mt-2">Spanning every stage of the drug development lifecycle — from pipeline discovery to commercial launch.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelSuite.map((model) => (
            <Card key={model.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    {model.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{model.name}</h3>
                    <Badge variant="outline" className="text-[10px] mt-0.5 mb-1">{model.subtitle}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                    <p className="text-xs text-muted-foreground/60 italic mt-2">Full details available by request.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Data Quality & Limitations */}
      <div>
        <div className="text-center mb-8">
          <Badge className="mb-3"><Shield className="h-3 w-3 mr-1 inline" /> Data Quality & Limitations</Badge>
          <h2 className="text-3xl font-bold">Transparency & Caveats</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[hsl(142,76%,36%)]" />
                Validation & Calibration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• AUC-ROC: 0.82 — strong discrimination ability</p>
              <p>• Brier Score: 0.15 — well-calibrated probabilities</p>
              <p>• Temporal split validation: train on 2000–2020, test on 2021–2024</p>
              <p>• Annual recalibration with latest outcomes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-[hsl(45,93%,47%)]" />
                Known Limitations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• <strong>Data quality:</strong> Accuracy depends on input completeness from public registries</p>
              <p>• <strong>Temporal drift:</strong> Historical patterns may not predict novel modalities</p>
              <p>• <strong>Censoring:</strong> Ongoing programs have incomplete outcome data</p>
              <p>• <strong>Decision aid:</strong> Supplements, does not replace, expert judgment</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardContent className="p-5 space-y-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Important Calibration Notes:</p>
              <p>
                PTRS and approval rate calibration is based on <strong>historical closed-cohort data</strong>. Current pipeline molecules 
                are unresolved — their outcomes are unknown and should not be used as calibration benchmarks.
              </p>
              <p>
                Alpha signals (α₁, α₂, Δα) distinguish between historical realised performance and current pipeline positioning. 
                <strong> α₂ updates dynamically</strong> with each platform refresh; <strong>α₁ is anchored to published cohort studies</strong> 
                (BIO/Norstella) and updates only when new cohort data is published (~every 3–5 years).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <div className="text-center mb-8">
          <Badge className="mb-3"><Globe className="h-3 w-3 mr-1 inline" /> Data Sources</Badge>
          <h2 className="text-3xl font-bold">Authoritative Sources</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {dataSources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
            >
              <div className="font-medium text-xs">{source.name}</div>
              <Badge variant="outline" className="text-[10px] mt-1">{source.region}</Badge>
            </a>
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
            <Button size="lg">Explore Platform</Button>
            <Button variant="outline" size="lg">View Pricing</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
