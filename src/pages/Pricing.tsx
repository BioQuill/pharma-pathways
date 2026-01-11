import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Zap, Building2, Crown, FileText, TrendingUp, Package, Eye, X, BarChart3, Target, Shield, AlertTriangle, Percent, Mail, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  priceSubtext: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  isBundle?: boolean;
  isContactSales?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
  previewButton?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Monte Carlo Analysis",
    description: "Peak sales simulation with probabilistic risk analysis",
    price: "$2,500",
    priceSubtext: "per molecule",
    icon: <TrendingUp className="h-6 w-6" />,
    features: [
      "10,000+ Monte Carlo simulations",
      "Peak sales probability distribution",
      "Blockbuster probability assessment",
      "Risk-adjusted metrics (VaR, CVaR)",
      "Sensitivity analysis by component",
      "Scenario comparisons (Bull/Bear)",
      "Downloadable PDF report",
      "14-day data access",
    ],
    buttonText: "Purchase Analysis",
    buttonVariant: "outline",
    previewButton: true,
  },
  {
    name: "Single Report",
    description: "One-time due diligence report for a specific molecule",
    price: "$3,500",
    priceSubtext: "per molecule",
    icon: <FileText className="h-6 w-6" />,
    features: [
      "Full LPI-3 analysis with confidence intervals",
      "TTM projections across 10 markets",
      "Patent & exclusivity timeline",
      "Competitive landscape analysis",
      "Regulatory pathway comparison",
      "Downloadable PDF report",
      "30-day data access",
    ],
    buttonText: "Purchase Report",
    buttonVariant: "outline",
  },
  {
    name: "Complete Bundle",
    description: "Monte Carlo + Single Report combined at 17% discount",
    price: "$5,000",
    originalPrice: "$6,000",
    priceSubtext: "per molecule",
    icon: <Package className="h-6 w-6" />,
    features: [
      "Full Monte Carlo simulation suite",
      "Complete LPI-3 due diligence report",
      "Risk-adjusted peak sales projections",
      "TTM projections across 10 markets",
      "Patent & competitive analysis",
      "Sensitivity & scenario analysis",
      "Combined PDF report package",
      "45-day data access",
    ],
    isBundle: true,
    buttonText: "Get Bundle",
    buttonVariant: "default",
    previewButton: true,
  },
  {
    name: "Annual Molecule",
    description: "Continuous monitoring and updates for one molecule",
    price: "$12,000",
    priceSubtext: "per molecule / year",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Everything in Complete Bundle",
      "Live dashboard access",
      "Real-time trial updates",
      "Regulatory milestone alerts",
      "Competitive intelligence updates",
      "Manufacturing risk monitoring",
      "Quarterly analyst briefings",
      "Priority support",
    ],
    highlighted: true,
    buttonText: "Start Monitoring",
    buttonVariant: "default",
  },
  {
    name: "TA Package",
    description: "Full therapeutic area coverage with all molecules",
    price: "$75,000",
    priceSubtext: "per TA / year",
    icon: <Building2 className="h-6 w-6" />,
    features: [
      "All molecules in therapeutic area (~20-40)",
      "TA Composite Index analytics",
      "Cross-molecule comparison tools",
      "Pipeline trend analysis",
      "M&A target identification",
      "Custom report generation",
      "Dedicated account manager",
      "API access (limited)",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isContactSales: true,
  },
  {
    name: "Enterprise",
    description: "Unlimited platform access for your organization",
    price: "$200,000",
    priceSubtext: "starting / year",
    icon: <Crown className="h-6 w-6" />,
    features: [
      "Unlimited molecule access",
      "All 20 therapeutic areas",
      "Full API integration",
      "Custom LPI model training",
      "White-label reporting",
      "SSO & team management",
      "On-premise deployment option",
      "24/7 priority support",
      "Quarterly strategy sessions",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "secondary",
    isContactSales: true,
  },
];

const comparisonFeatures = [
  { feature: "Molecules included", monteCarlo: "1", single: "1", bundle: "1", annual: "1", ta: "20-40", enterprise: "Unlimited" },
  { feature: "Monte Carlo simulation", monteCarlo: "✓", single: "—", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "LPI-3 ML analysis", monteCarlo: "—", single: "✓", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "TTM projections", monteCarlo: "—", single: "✓", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Risk-adjusted metrics", monteCarlo: "✓", single: "—", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Sensitivity analysis", monteCarlo: "✓", single: "—", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Patent timeline", monteCarlo: "—", single: "✓", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Competitive analysis", monteCarlo: "—", single: "✓", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "PDF export", monteCarlo: "✓", single: "✓", bundle: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Live dashboard", monteCarlo: "14 days", single: "30 days", bundle: "45 days", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Real-time alerts", monteCarlo: "—", single: "—", bundle: "—", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "API access", monteCarlo: "—", single: "—", bundle: "—", annual: "—", ta: "Limited", enterprise: "Full" },
  { feature: "Dedicated support", monteCarlo: "Email", single: "Email", bundle: "Email", annual: "Priority", ta: "Account Mgr", enterprise: "24/7" },
];

// Sample data for different therapeutic areas
const sampleMoleculeData: Record<string, {
  molecule: string;
  indication: string;
  peakSales: string;
  blockbusterProb: string;
  sharpeRatio: string;
  var95: string;
  percentiles: { p: string; v: string }[];
  sensitivity: { name: string; impact: number }[];
}> = {
  neurology: {
    molecule: "Lecanemab",
    indication: "Alzheimer's Disease",
    peakSales: "$4.2B",
    blockbusterProb: "68%",
    sharpeRatio: "1.42",
    var95: "$1.8B",
    percentiles: [
      { p: "5th (Bear)", v: "$1.2B" },
      { p: "25th", v: "$2.8B" },
      { p: "50th (Median)", v: "$4.2B" },
      { p: "75th", v: "$5.8B" },
      { p: "95th (Bull)", v: "$8.5B" },
    ],
    sensitivity: [
      { name: "Market Size", impact: 85 },
      { name: "Clinical Efficacy", impact: 72 },
      { name: "Competition", impact: 58 },
      { name: "Regulatory", impact: 45 },
    ],
  },
  oncology: {
    molecule: "Dato-DXd",
    indication: "NSCLC / Breast Cancer",
    peakSales: "$6.8B",
    blockbusterProb: "82%",
    sharpeRatio: "1.68",
    var95: "$2.4B",
    percentiles: [
      { p: "5th (Bear)", v: "$2.1B" },
      { p: "25th", v: "$4.5B" },
      { p: "50th (Median)", v: "$6.8B" },
      { p: "75th", v: "$9.2B" },
      { p: "95th (Bull)", v: "$14.5B" },
    ],
    sensitivity: [
      { name: "Clinical Efficacy", impact: 92 },
      { name: "Competition", impact: 78 },
      { name: "Market Size", impact: 65 },
      { name: "Pricing", impact: 52 },
    ],
  },
  immunology: {
    molecule: "Dupixent",
    indication: "Atopic Dermatitis",
    peakSales: "$12.5B",
    blockbusterProb: "95%",
    sharpeRatio: "2.15",
    var95: "$4.2B",
    percentiles: [
      { p: "5th (Bear)", v: "$5.8B" },
      { p: "25th", v: "$9.2B" },
      { p: "50th (Median)", v: "$12.5B" },
      { p: "75th", v: "$15.8B" },
      { p: "95th (Bull)", v: "$22.0B" },
    ],
    sensitivity: [
      { name: "Label Expansion", impact: 88 },
      { name: "Competition", impact: 72 },
      { name: "Pricing", impact: 58 },
      { name: "Market Access", impact: 48 },
    ],
  },
  cardiovascular: {
    molecule: "Inclisiran",
    indication: "Hypercholesterolemia",
    peakSales: "$3.5B",
    blockbusterProb: "58%",
    sharpeRatio: "1.18",
    var95: "$1.2B",
    percentiles: [
      { p: "5th (Bear)", v: "$0.8B" },
      { p: "25th", v: "$2.2B" },
      { p: "50th (Median)", v: "$3.5B" },
      { p: "75th", v: "$4.8B" },
      { p: "95th (Bull)", v: "$7.2B" },
    ],
    sensitivity: [
      { name: "Market Access", impact: 82 },
      { name: "Competition", impact: 68 },
      { name: "Clinical Efficacy", impact: 55 },
      { name: "Pricing", impact: 42 },
    ],
  },
};

// Sample Monte Carlo Report Preview Component
const MonteCarloReportPreview = () => {
  const [selectedTA, setSelectedTA] = useState("neurology");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const data = sampleMoleculeData[selectedTA];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="space-y-6 p-4">
        {/* TA Selector */}
        <div className="flex items-center gap-4 border-b pb-4">
          <Select value={selectedTA} onValueChange={setSelectedTA}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Therapeutic Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
              <SelectItem value="immunology">Immunology</SelectItem>
              <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
            </SelectContent>
          </Select>
          <Badge>Sample Report</Badge>
        </div>

        {/* Header */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-bold text-primary">Monte Carlo Peak Sales Analysis</h3>
          <p className="text-sm text-muted-foreground">Molecule: {data.molecule} ({data.indication})</p>
          <p className="text-xs text-muted-foreground">Generated: January 11, 2026</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{data.peakSales}</p>
              <p className="text-xs text-muted-foreground">Expected Peak Sales</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{data.blockbusterProb}</p>
              <p className="text-xs text-muted-foreground">Blockbuster Probability</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{data.sharpeRatio}</p>
              <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{data.var95}</p>
              <p className="text-xs text-muted-foreground">Value at Risk (95%)</p>
            </CardContent>
          </Card>
        </div>

        {/* Distribution Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Peak Sales Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 bg-gradient-to-r from-muted via-primary/30 to-muted rounded-lg flex items-end justify-center gap-1 p-2">
              {[15, 25, 40, 60, 80, 95, 100, 90, 75, 55, 35, 20, 10].map((h, i) => (
                <div 
                  key={i} 
                  className="bg-primary/70 rounded-t w-4"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>$0B</span>
              <span>{data.peakSales} (median)</span>
              <span>$10B+</span>
            </div>
          </CardContent>
        </Card>

        {/* Percentile Table Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Percentile Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Percentile</th>
                  <th className="p-2 text-right">Peak Sales</th>
                </tr>
              </thead>
              <tbody>
                {data.percentiles.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="p-2">{row.p}</td>
                    <td className="p-2 text-right font-medium">{row.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Sensitivity Preview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Sensitivity Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.sensitivity.map((factor, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs w-24 truncate">{factor.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${factor.impact}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-8">{factor.impact}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Email Capture Form */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Request Custom Demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm" className="gap-1">
                  <Send className="h-3 w-3" />
                  Request
                </Button>
              </form>
            ) : (
              <div className="text-center py-2">
                <Check className="h-6 w-6 text-[hsl(142,76%,36%)] mx-auto mb-1" />
                <p className="text-sm font-medium">Thank you!</p>
                <p className="text-xs text-muted-foreground">Our team will contact you within 24 hours.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            This is a sample preview. Full reports include detailed methodology, 
            scenario analysis, and actionable investment insights.
          </p>
          <Badge variant="outline" className="text-xs">
            <Percent className="h-3 w-3 mr-1" />
            10,000+ Simulations per Analysis
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[hsl(25,95%,55%)] w-full">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={bioquillLogo} alt="BiOQUILL" className="h-16 w-auto object-contain" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/methodology">
                <Button variant="ghost" size="sm" className="text-white hover:bg-orange-400/50">
                  Methodology
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-orange-400/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Platform
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Pricing</Badge>
          <h1 className="text-4xl font-bold mb-4">
            Pharmaceutical Intelligence for{" "}
            <span className="text-primary">Smarter Investments</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From single molecule reports to enterprise-wide access. Choose the plan that fits your due diligence needs.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-16">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${
                tier.highlighted
                  ? "border-2 border-primary shadow-lg shadow-primary/10"
                  : tier.isBundle
                  ? "border-2 border-[hsl(142,76%,36%)] shadow-lg shadow-[hsl(142,76%,36%)]/10"
                  : "border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              {tier.isBundle && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[hsl(142,76%,36%)] text-white">Save 17%</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${
                    tier.highlighted 
                      ? "bg-primary text-primary-foreground" 
                      : tier.isBundle 
                      ? "bg-[hsl(142,76%,36%)] text-white"
                      : "bg-muted"
                  }`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-base">{tier.name}</CardTitle>
                </div>
                <CardDescription className="text-xs">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-4">
                  {tier.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">{tier.originalPrice}</span>
                  )}
                  <span className="text-2xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-xs ml-1">{tier.priceSubtext}</span>
                </div>
                <ul className="space-y-2">
                  {tier.features.slice(0, 6).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs">
                      <Check className="h-3 w-3 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.features.length > 6 && (
                    <li className="text-xs text-muted-foreground">+{tier.features.length - 6} more</li>
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
                {tier.previewButton && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview Sample Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          Monte Carlo Report Preview
                        </DialogTitle>
                      </DialogHeader>
                      <MonteCarloReportPreview />
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Feature</th>
                    <th className="text-center p-3 font-medium">Monte Carlo</th>
                    <th className="text-center p-3 font-medium">Single Report</th>
                    <th className="text-center p-3 font-medium bg-[hsl(142,76%,36%)]/10">Bundle</th>
                    <th className="text-center p-3 font-medium bg-primary/5">Annual</th>
                    <th className="text-center p-3 font-medium">TA Package</th>
                    <th className="text-center p-3 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="p-3 text-sm font-medium">{row.feature}</td>
                      <td className="p-3 text-sm text-center">{row.monteCarlo}</td>
                      <td className="p-3 text-sm text-center">{row.single}</td>
                      <td className="p-3 text-sm text-center bg-[hsl(142,76%,36%)]/5 font-medium">{row.bundle}</td>
                      <td className="p-3 text-sm text-center bg-primary/5 font-medium">{row.annual}</td>
                      <td className="p-3 text-sm text-center">{row.ta}</td>
                      <td className="p-3 text-sm text-center">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
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
                <div className="text-4xl font-bold text-primary mb-2">10</div>
                <p className="text-muted-foreground">Global markets analyzed per molecule</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What data sources does BioQuill use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  BioQuill integrates data from ClinicalTrials.gov, WHO ICTRP, FDA, EMA, PMDA, NMPA, 
                  Health Canada, MHRA, ANVISA, and TGA regulatory databases. Our ML models are trained 
                  on historical approval data from 2000-2024.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How accurate is the LPI-3 prediction model?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our XGBoost-based LPI-3 model achieves an AUC-ROC of 0.82 on held-out validation data. 
                  All predictions include 95% confidence intervals and SHAP-based feature importance 
                  for full transparency.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade from Single Report to Annual Molecule, or from Annual to TA Package 
                  at any time. Credit from previous purchases will be applied to your upgrade.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer custom enterprise solutions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely. Enterprise clients can access custom LPI model training on their proprietary data, 
                  white-label reporting, and on-premise deployment options. Contact our sales team to discuss 
                  your specific requirements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to make smarter investment decisions?</h2>
          <p className="text-muted-foreground mb-6">
            Start with a single molecule report or contact us for enterprise pricing.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button size="lg">
                Explore Platform
              </Button>
            </Link>
            <Button size="lg" className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BioQuill. Pharmaceutical Intelligence Platform.</p>
        </div>
      </footer>
    </div>
  );
}
