import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Building2, Crown, FileText, TrendingUp, Package, Eye, X, BarChart3, Target, Shield, AlertTriangle, Percent, Mail, Send, Calculator, DollarSign, PieChart, Clock, Database, RefreshCw, CheckCircle, Pill, Layers, Globe, ShoppingCart, Plus, Minus, FlaskConical, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";

// ROI Calculator Component
const ROICalculator = () => {
  const [portfolioSize, setPortfolioSize] = useState([10]);
  const [avgDealValue, setAvgDealValue] = useState([50]);
  const [failedDealRate, setFailedDealRate] = useState([25]);
  const [improvementRate, setImprovementRate] = useState([30]);

  const annualDeals = portfolioSize[0];
  const avgDealValueK = avgDealValue[0];
  const currentFailRate = failedDealRate[0] / 100;
  const improvementPct = improvementRate[0] / 100;

  const currentFailedDeals = Math.round(annualDeals * currentFailRate);
  const currentLossesK = currentFailedDeals * avgDealValueK;
  const improvedFailRate = currentFailRate * (1 - improvementPct);
  const improvedFailedDeals = Math.round(annualDeals * improvedFailRate);
  const improvedLossesK = improvedFailedDeals * avgDealValueK;
  const annualSavingsK = currentLossesK - improvedLossesK;
  const bioquillCostK = 200;
  const netROIK = annualSavingsK - bioquillCostK;
  const formatK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;
  const roiMultiple = netROIK > 0 ? Math.round((netROIK / bioquillCostK) * 10) / 10 : 0;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          ROI Calculator
        </CardTitle>
        <CardDescription>
          Estimate your potential savings with BioQuill intelligence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>Annual Deal Evaluations</Label>
                <span className="font-bold text-primary">{portfolioSize[0]} deals</span>
              </div>
              <Slider value={portfolioSize} onValueChange={setPortfolioSize} min={1} max={50} step={1} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>Average Deal Value</Label>
                <span className="font-bold text-primary">{formatK(avgDealValue[0])}</span>
              </div>
              <Slider value={avgDealValue} onValueChange={setAvgDealValue} min={2.5} max={500} step={2.5} className="w-full" />
              <p className="text-xs text-muted-foreground">Range: $2.5K – $500K</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>Current Failed Deal Rate</Label>
                <span className="font-bold text-primary">{failedDealRate[0]}%</span>
              </div>
              <Slider value={failedDealRate} onValueChange={setFailedDealRate} min={5} max={50} step={5} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>BioQuill Improvement Rate</Label>
                <span className="font-bold text-primary">{improvementRate[0]}%</span>
              </div>
              <Slider value={improvementRate} onValueChange={setImprovementRate} min={10} max={60} step={5} className="w-full" />
              <p className="text-xs text-muted-foreground">Based on historical LPI-3 model accuracy (82% AUC-ROC)</p>
            </div>
          </div>
          <div className="space-y-4">
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-red-600 font-medium">Current Annual Losses</p>
                    <p className="text-xs text-muted-foreground">{currentFailedDeals} failed × {formatK(avgDealValueK)}</p>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{formatK(currentLossesK)}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[hsl(142,76%,36%)] font-medium">Improved Annual Losses</p>
                    <p className="text-xs text-muted-foreground">{improvedFailedDeals} failed × {formatK(avgDealValueK)}</p>
                  </div>
                  <div className="text-2xl font-bold text-[hsl(142,76%,36%)]">{formatK(improvedLossesK)}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-primary font-medium">Annual Savings</p>
                    <p className="text-xs text-muted-foreground">Reduced failed acquisitions</p>
                  </div>
                  <div className="text-2xl font-bold text-primary">{formatK(annualSavingsK)}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-90">Net ROI (after $200K investment)</p>
                    <p className="text-xs opacity-75">Return multiple on BioQuill cost</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{roiMultiple}x</div>
                    <div className="text-sm opacity-90">{formatK(netROIK)} net</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample Compounded Report Preview for Orforglipron
const SampleCompoundedReport = () => {
  return (
    <div className="max-h-[75vh] overflow-y-auto">
      <div className="space-y-5 p-2">
        <div className="bg-[#FFD700] rounded-lg p-4 flex items-center gap-4">
          <img src={bioquillLogo} alt="BiOQUILL" className="h-10 w-auto" />
          <div>
            <h3 className="font-bold text-gray-800">Full Due Diligence Report</h3>
            <p className="text-sm text-gray-700">Orforglipron — Eli Lilly</p>
          </div>
          <Badge className="ml-auto bg-gray-800 text-white">Sample</Badge>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              1. Molecule Score Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Phase</p>
                <p className="font-bold">Phase III</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Indication</p>
                <p className="font-bold text-sm">Obesity / T2D</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="font-bold text-sm text-[hsl(142,70%,30%)]">Eli Lilly</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200">
                <p className="text-xs text-muted-foreground">Composite Score</p>
                <p className="text-2xl font-bold text-[hsl(142,76%,36%)]">74.2</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200">
                <p className="text-xs text-muted-foreground">LPI-3 Score</p>
                <p className="text-2xl font-bold text-blue-600">71.8%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">TTM</p>
                <p className="text-2xl font-bold">18 mo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            This is a sample preview of the compounded Full Due Diligence Report.
            Actual reports include deeper methodology, interactive charts, and actionable insights.
          </p>
          <Badge variant="outline" className="text-xs">
            <Percent className="h-3 w-3 mr-1" />
            10 Sections · 10,000+ Monte Carlo Simulations
          </Badge>
        </div>
      </div>
    </div>
  );
};

interface PricingTier {
  name: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice?: string;
  priceSubtext: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  saveBadge?: string;
  isContactSales?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  showSampleReport?: boolean;
  moleculeCount?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "1 Molecule",
    subtitle: "Report & Monitoring",
    description: "Full due diligence for a single molecule with 1-year monitoring access",
    price: "$5,000",
    priceSubtext: "per molecule / year",
    icon: <Pill className="h-6 w-6" />,
    moleculeCount: "1",
    features: [
      "Full compounded due diligence report (PDF)",
      "Molecule Score Card & Composite Score",
      "LPI-3 probability analysis + extended",
      "Investment Score Assessment",
      "Pricing & Access (Model 1 + Model 2 + Triangulation)",
      "Monte Carlo peak sales simulation",
      "Market & Regulatory analysis (10 markets)",
      "Patent & competitive landscape",
      "Clinical studies summary with links",
      "1-year live dashboard monitoring",
      "Real-time trial & regulatory alerts",
    ],
    buttonText: "Purchase Report",
    buttonVariant: "outline",
    showSampleReport: true,
  },
  {
    name: "5 Molecules",
    subtitle: "Custom Basket",
    description: "Choose up to 5 molecules from any therapeutic areas — build your own portfolio basket",
    price: "$18,000",
    originalPrice: "$25,000",
    priceSubtext: "per year",
    icon: <ShoppingCart className="h-6 w-6" />,
    moleculeCount: "Up to 5",
    saveBadge: "Save 28%",
    features: [
      "Everything in 1 Molecule × 5",
      "Mix molecules from any TAs",
      "Side-by-side molecule comparison",
      "Portfolio-level analytics",
      "Cross-molecule risk correlation",
      "1-year monitoring for all 5",
      "Quarterly portfolio briefings",
      "Priority email support",
    ],
    highlighted: true,
    buttonText: "Build Your Basket",
    buttonVariant: "default",
  },
  {
    name: "1 TA",
    subtitle: "Report & Monitoring",
    description: "Full therapeutic area coverage: all molecules, comparisons, and monitoring for 1 year",
    price: "$45,000",
    priceSubtext: "per TA / year",
    icon: <Layers className="h-6 w-6" />,
    moleculeCount: "All molecules in TA (~20-60)",
    features: [
      "Full reports for every molecule in the TA",
      "TA Composite Index analytics",
      "Molecule comparison tools (head-to-head)",
      "Pipeline trend & gap analysis",
      "M&A target identification",
      "Competitive intelligence across TA",
      "1-year live monitoring & alerts",
      "Dedicated account manager",
    ],
    buttonText: "Select TA",
    buttonVariant: "outline",
  },
  {
    name: "3 TAs",
    subtitle: "Multi-Area Coverage",
    description: "Cover 3 therapeutic areas with full analysis, comparison, and monitoring",
    price: "$110,000",
    originalPrice: "$135,000",
    priceSubtext: "per year",
    icon: <Layers className="h-6 w-6" />,
    moleculeCount: "All molecules across 3 TAs",
    saveBadge: "Save 19%",
    features: [
      "Everything in 1 TA × 3",
      "Cross-TA portfolio analytics",
      "Cross-TA molecule comparison",
      "TA vs TA benchmarking",
      "Strategic portfolio optimization",
      "Quarterly strategy sessions",
      "API access (limited)",
      "Dedicated account manager",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isContactSales: true,
  },
  {
    name: "5 TAs",
    subtitle: "Extended Coverage",
    description: "Cover 5 therapeutic areas with comprehensive analytics and strategic support",
    price: "$160,000",
    originalPrice: "$225,000",
    priceSubtext: "per year",
    icon: <Building2 className="h-6 w-6" />,
    moleculeCount: "All molecules across 5 TAs",
    saveBadge: "Save 29%",
    features: [
      "Everything in 3 TAs + 2 more",
      "Advanced portfolio optimization",
      "Full cross-TA comparison suite",
      "Custom scoring configurations",
      "White-label reporting option",
      "Monthly strategy sessions",
      "Full API access",
      "Priority 24/7 support",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isContactSales: true,
  },
  {
    name: "FULL",
    subtitle: "All 20 TAs — Enterprise",
    description: "Unlimited platform access across all 20 therapeutic areas for your organization",
    price: "$300,000",
    priceSubtext: "starting / year",
    icon: <Crown className="h-6 w-6" />,
    moleculeCount: "All 1,247+ molecules",
    features: [
      "All 20 therapeutic areas",
      "Unlimited molecule access & reports",
      "Full molecule comparison across all TAs",
      "Enterprise portfolio dashboard",
      "Custom scoring & model configurations",
      "White-label reporting",
      "SSO & team management",
      "On-premise deployment option",
      "Quarterly executive strategy sessions",
      "24/7 priority support + SLA",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isContactSales: true,
  },
];

const comparisonFeatures = [
  { feature: "Molecules included", t1: "1", t5: "Up to 5", ta1: "All in TA", ta3: "All in 3 TAs", ta5: "All in 5 TAs", full: "1,247+" },
  { feature: "Full DD report (PDF)", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "LPI-3 + Extended analysis", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Monte Carlo simulation", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Pricing & Access (both models)", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Molecule comparison", t1: "—", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Cross-TA analytics", t1: "—", t5: "—", ta1: "—", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "1-year monitoring", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Real-time alerts", t1: "✓", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "Portfolio analytics", t1: "—", t5: "✓", ta1: "✓", ta3: "✓", ta5: "✓", full: "✓" },
  { feature: "API access", t1: "—", t5: "—", ta1: "—", ta3: "Limited", ta5: "Full", full: "Full" },
  { feature: "Strategy sessions", t1: "—", t5: "Quarterly", ta1: "Quarterly", ta3: "Quarterly", ta5: "Monthly", full: "Quarterly Exec" },
  { feature: "Support", t1: "Email", t5: "Priority", ta1: "Account Mgr", ta3: "Account Mgr", ta5: "24/7", full: "24/7 + SLA" },
];

export const PricingContent = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Pricing</Badge>
        <h1 className="text-4xl font-bold mb-4">
          Pharmaceutical Intelligence for{" "}
          <span className="text-primary">Smarter Investments</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          From single molecule reports to full enterprise access across all 20 therapeutic areas.
          Every plan includes 1-year monitoring and compounded due diligence reports.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {pricingTiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col ${
              tier.highlighted
                ? "border-2 border-primary shadow-lg shadow-primary/10"
                : tier.saveBadge && !tier.highlighted
                ? "border-2 border-[hsl(142,76%,36%)] shadow-lg shadow-[hsl(142,76%,36%)]/10"
                : "border"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            {tier.saveBadge && !tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[hsl(142,76%,36%)] text-white">{tier.saveBadge}</Badge>
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className={`p-2 rounded-lg ${
                  tier.highlighted 
                    ? "bg-primary text-primary-foreground" 
                    : tier.saveBadge
                    ? "bg-[hsl(142,76%,36%)] text-white"
                    : "bg-muted"
                }`}>
                  {tier.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">{tier.subtitle}</p>
                </div>
              </div>
              <CardDescription className="text-xs">{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <div className="mb-3">
                {tier.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through mr-2">{tier.originalPrice}</span>
                )}
                <span className="text-2xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground text-xs ml-1">{tier.priceSubtext}</span>
              </div>
              {tier.moleculeCount && (
                <div className="mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Pill className="h-3 w-3 mr-1" />
                    {tier.moleculeCount}
                  </Badge>
                </div>
              )}
              <ul className="space-y-1.5">
                {tier.features.slice(0, 7).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs">
                    <Check className="h-3 w-3 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.features.length > 7 && (
                  <li className="text-xs text-muted-foreground pl-4">+{tier.features.length - 7} more</li>
                )}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button
                className={`w-full ${tier.isContactSales ? "bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white" : ""}`}
                variant={tier.isContactSales ? "default" : tier.buttonVariant}
                size="sm"
              >
                {tier.buttonText}
              </Button>
              {tier.showSampleReport && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview Sample Report (Orforglipron)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Sample Compounded Report — Orforglipron (Eli Lilly)
                      </DialogTitle>
                    </DialogHeader>
                    <SampleCompoundedReport />
                  </DialogContent>
                </Dialog>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* What's in the Report */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-2">What's in Every Molecule Report?</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Every tier includes a compounded Full Due Diligence Report combining all analytical modules into one deliverable.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { icon: <Target className="h-5 w-5" />, title: "Score Card", desc: "Composite score, LPI-3, TTM" },
            { icon: <TrendingUp className="h-5 w-5" />, title: "LPI Analysis", desc: "Probability with confidence intervals" },
            { icon: <DollarSign className="h-5 w-5" />, title: "Pricing & Access", desc: "Model 1 + Model 2 + Triangulation" },
            { icon: <PieChart className="h-5 w-5" />, title: "Monte Carlo", desc: "10,000+ peak sales simulations" },
            { icon: <Shield className="h-5 w-5" />, title: "Patent & Competitive", desc: "Landscape + regulatory across 10 markets" },
          ].map((item) => (
            <Card key={item.title} className="text-center">
              <CardContent className="pt-6 pb-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* TA Access Note */}
      <Card className="mb-16 border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary flex-shrink-0">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold mb-2">TA-Level Access: Molecule Comparison Included</h3>
              <p className="text-sm text-muted-foreground mb-3">
                All TA packages (1 TA, 3 TAs, 5 TAs, and FULL) include <strong>molecule comparison tools</strong> — 
                visible and accessible to compare molecules head-to-head within and across therapeutic areas. 
                The 5-Molecule basket also enables side-by-side comparisons across your selected molecules.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Head-to-Head Comparison</Badge>
                <Badge variant="outline">Cross-TA Benchmarking</Badge>
                <Badge variant="outline">Pipeline Gap Analysis</Badge>
                <Badge variant="outline">M&A Target Ranking</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Feature</th>
                  <th className="text-center p-3 font-medium">1 Molecule</th>
                  <th className="text-center p-3 font-medium bg-primary/5">5 Molecules</th>
                  <th className="text-center p-3 font-medium">1 TA</th>
                  <th className="text-center p-3 font-medium bg-[hsl(142,76%,36%)]/10">3 TAs</th>
                  <th className="text-center p-3 font-medium bg-[hsl(142,76%,36%)]/10">5 TAs</th>
                  <th className="text-center p-3 font-medium">FULL</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="p-3 text-sm font-medium">{row.feature}</td>
                    <td className="p-3 text-sm text-center">{row.t1}</td>
                    <td className="p-3 text-sm text-center bg-primary/5 font-medium">{row.t5}</td>
                    <td className="p-3 text-sm text-center">{row.ta1}</td>
                    <td className="p-3 text-sm text-center bg-[hsl(142,76%,36%)]/5">{row.ta3}</td>
                    <td className="p-3 text-sm text-center bg-[hsl(142,76%,36%)]/5">{row.ta5}</td>
                    <td className="p-3 text-sm text-center">{row.full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground text-center mt-3 italic">
          All tiers provide analytical outputs and scores only. Proprietary model formulas, index architectures, calculation weights, and methodology details are confidential and not included in reports or platform access.
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16">
        <CardContent className="p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
              <p className="text-muted-foreground">Average failed acquisition cost avoided</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">82%</div>
              <p className="text-muted-foreground">LPI-3 model prediction accuracy (AUC-ROC)</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1,247+</div>
              <p className="text-muted-foreground">Molecules across 20 therapeutic areas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Calculator */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Calculate Your ROI</h2>
        <ROICalculator />
      </div>

      {/* BioQuill vs Traditional */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">BioQuill vs Traditional Due Diligence</h2>
        <Card className="border-primary/20">
          <CardContent className="p-8">
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg p-6 text-center">
                <Clock className="h-8 w-8 text-[hsl(142,76%,36%)] mx-auto mb-3" />
                <p className="text-4xl font-bold text-[hsl(142,76%,36%)]">96%</p>
                <p className="text-sm font-medium text-[hsl(142,70%,35%)]">Time Savings</p>
                <p className="text-xs text-muted-foreground mt-1">2 days vs 45 days</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-6 text-center">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <p className="text-4xl font-bold text-blue-600">97%</p>
                <p className="text-sm font-medium text-blue-700">Cost Reduction</p>
                <p className="text-xs text-muted-foreground mt-1">$500 vs $15,000</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-lg p-6 text-center">
                <Database className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <p className="text-4xl font-bold text-purple-600">33x</p>
                <p className="text-sm font-medium text-purple-700">More Coverage</p>
                <p className="text-xs text-muted-foreground mt-1">500 vs 15 molecules</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-semibold">Metric</th>
                    <th className="text-center p-4 font-semibold text-[hsl(142,76%,36%)]">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        BioQuill
                      </div>
                    </th>
                    <th className="text-center p-4 font-semibold text-muted-foreground">Traditional</th>
                    <th className="text-center p-4 font-semibold text-primary">Advantage</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { icon: <Clock className="h-4 w-4" />, metric: "Time to Complete Analysis", bq: "2 days", trad: "45 days", adv: "96% faster" },
                    { icon: <DollarSign className="h-4 w-4" />, metric: "Cost per Molecule Report", bq: "$500", trad: "$15,000", adv: "97% savings" },
                    { icon: <Database className="h-4 w-4" />, metric: "Data Sources Analyzed", bq: "85 sources", trad: "12 sources", adv: "7x more" },
                    { icon: <Target className="h-4 w-4" />, metric: "Portfolio Coverage", bq: "1,247+ molecules", trad: "15 molecules", adv: "83x coverage" },
                    { icon: <RefreshCw className="h-4 w-4" />, metric: "Update Frequency", bq: "Daily", trad: "Quarterly", adv: "90x faster" },
                    { icon: <CheckCircle className="h-4 w-4" />, metric: "Accuracy Rate", bq: "94%", trad: "78%", adv: "+16%" },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/30">
                      <td className="p-4 flex items-center gap-2">
                        <span className="text-muted-foreground">{row.icon}</span>
                        {row.metric}
                      </td>
                      <td className="text-center p-4 font-bold text-[hsl(142,76%,36%)]">{row.bq}</td>
                      <td className="text-center p-4 text-muted-foreground">{row.trad}</td>
                      <td className="text-center p-4">
                        <Badge variant="outline" className="bg-green-50 text-[hsl(142,76%,36%)] border-green-200">{row.adv}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "What's included in a molecule report?", a: "Every molecule report is a compounded Full Due Diligence Report that includes: Molecule Score Card, LPI-3 analysis with confidence intervals, LPI Extended breakdown, Investment Score Assessment, Pricing & Access models (Model 1 MWPSPI + Model 2 Benchmarking + Triangulation), Monte Carlo peak sales simulation, Market & Regulatory analysis across 10 markets, Patent & Competitive landscape, and Clinical Studies summary — all in a single downloadable PDF." },
            { q: "Can I pick molecules from different TAs in the 5-Molecule plan?", a: "Yes! The 5-Molecule Custom Basket lets you choose any combination of molecules from any therapeutic areas. You can mix Oncology, Neurology, Cardiology, or any other TA — it's your portfolio, your choice. All 5 molecules include side-by-side comparison tools." },
            { q: "What molecule comparison features are available?", a: "TA packages and the 5-Molecule basket include molecule comparison tools: head-to-head score comparison, LPI-3 side-by-side, competitive positioning analysis, TTM benchmarking, and risk-adjusted metrics comparison." },
            { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade from 1 Molecule to 5 Molecules, or from any TA plan to a higher tier at any time. Credit from previous purchases will be applied to your upgrade." },
            { q: "How accurate is the LPI-3 prediction model?", a: "Our XGBoost-based LPI-3 model achieves an AUC-ROC of 0.82 on held-out validation data. All predictions include 95% confidence intervals and SHAP-based feature importance." },
          ].map((faq, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Ready to make smarter investment decisions?</h2>
        <p className="text-muted-foreground mb-6">
          Start with a single molecule report or contact us for multi-TA enterprise pricing.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Explore Platform</Button>
          <Button size="lg" className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </div>
  );
};
