import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Zap, Building2, Crown, FileText, TrendingUp } from "lucide-react";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceSubtext: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
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
    name: "Annual Molecule",
    description: "Continuous monitoring and updates for one molecule",
    price: "$12,000",
    priceSubtext: "per molecule / year",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "Everything in Single Report",
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
    buttonVariant: "outline",
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
    buttonVariant: "outline",
  },
];

const comparisonFeatures = [
  { feature: "Molecules included", monteCarlo: "1", single: "1", annual: "1", ta: "20-40", enterprise: "Unlimited" },
  { feature: "Monte Carlo simulation", monteCarlo: "✓", single: "Add-on", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "LPI-3 ML analysis", monteCarlo: "—", single: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "TTM projections", monteCarlo: "—", single: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Risk-adjusted metrics", monteCarlo: "✓", single: "—", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Sensitivity analysis", monteCarlo: "✓", single: "—", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Patent timeline", monteCarlo: "—", single: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Competitive analysis", monteCarlo: "—", single: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "PDF export", monteCarlo: "✓", single: "✓", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Live dashboard", monteCarlo: "14 days", single: "30 days", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "Real-time alerts", monteCarlo: "—", single: "—", annual: "✓", ta: "✓", enterprise: "✓" },
  { feature: "API access", monteCarlo: "—", single: "—", annual: "—", ta: "Limited", enterprise: "Full" },
  { feature: "Dedicated support", monteCarlo: "Email", single: "Email", annual: "Priority", ta: "Account Mgr", enterprise: "24/7" },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5D547] w-full">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={bioquillLogo} alt="BiOQUILL" className="h-16 w-auto object-contain" />
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/methodology">
                <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                  Methodology
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${
                tier.highlighted
                  ? "border-2 border-primary shadow-lg shadow-primary/10"
                  : "border"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${tier.highlighted ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    {tier.icon}
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">{tier.priceSubtext}</span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.buttonVariant}
                  size="lg"
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-4 font-medium">Feature</th>
                    <th className="text-center p-4 font-medium">Monte Carlo</th>
                    <th className="text-center p-4 font-medium">Single Report</th>
                    <th className="text-center p-4 font-medium bg-primary/5">Annual Molecule</th>
                    <th className="text-center p-4 font-medium">TA Package</th>
                    <th className="text-center p-4 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="p-4 text-sm font-medium">{row.feature}</td>
                      <td className="p-4 text-sm text-center">{row.monteCarlo}</td>
                      <td className="p-4 text-sm text-center">{row.single}</td>
                      <td className="p-4 text-sm text-center bg-primary/5 font-medium">{row.annual}</td>
                      <td className="p-4 text-sm text-center">{row.ta}</td>
                      <td className="p-4 text-sm text-center">{row.enterprise}</td>
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
            <Button variant="outline" size="lg">
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
