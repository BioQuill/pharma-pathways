import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Zap, Building2, Crown, FileText, TrendingUp, Package, Eye, X, BarChart3, Target, Shield, AlertTriangle, Percent, Mail, Send, Calculator, DollarSign, PieChart, Clock, Database, RefreshCw, CheckCircle, Pill, Layers, Globe, ShoppingCart, Plus, Minus, FlaskConical, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        {/* Report Header */}
        <div className="bg-[#F5D547] rounded-lg p-4 flex items-center gap-4">
          <img src={bioquillLogo} alt="BiOQUILL" className="h-10 w-auto" />
          <div>
            <h3 className="font-bold text-gray-800">Full Due Diligence Report</h3>
            <p className="text-sm text-gray-700">Orforglipron — Eli Lilly</p>
          </div>
          <Badge className="ml-auto bg-gray-800 text-white">Sample</Badge>
        </div>

        {/* Section 1: Molecule Score Card */}
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

        {/* Section 2: LPI Analysis */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              2. LPI-3 Probability Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {[
                { label: "Meeting Endpoints", value: 78, color: "bg-green-500" },
                { label: "Regulatory Pathway", value: 82, color: "bg-blue-500" },
                { label: "Safety Profile", value: 72, color: "bg-yellow-500" },
                { label: "Competitive Position", value: 68, color: "bg-orange-500" },
                { label: "Manufacturing", value: 85, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-xs w-32 truncate">{item.label}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="text-xs font-mono w-10 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between text-xs">
              <span className="text-muted-foreground">Calibrated Probability</span>
              <Badge className="bg-green-500 text-white">71.8% (High)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: LPI Extended - Category Weights */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              3. LPI Extended — Category Weight vs Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { cat: "Clinical Efficacy", weight: 30, perf: 78 },
                { cat: "Safety & Tolerability", weight: 20, perf: 72 },
                { cat: "Regulatory", weight: 15, perf: 82 },
                { cat: "Market & Commercial", weight: 20, perf: 75 },
                { cat: "Manufacturing", weight: 15, perf: 85 },
              ].map((r) => (
                <div key={r.cat} className="grid grid-cols-[120px_1fr_60px] items-center gap-2 text-xs">
                  <span className="truncate">{r.cat}</span>
                  <div className="relative h-4 bg-muted rounded">
                    <div className="absolute inset-y-0 left-0 bg-primary/30 rounded" style={{ width: `${r.weight}%` }} />
                    <div className="absolute inset-y-0 left-0 bg-primary rounded" style={{ width: `${r.perf}%`, maxWidth: `${r.weight}%` }} />
                  </div>
                  <span className="font-mono text-right">{r.perf}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Investment Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              4. Investment Score Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border text-center">
                <p className="text-xs text-muted-foreground">Risk-Adjusted Score</p>
                <p className="text-xl font-bold text-primary">8.2 / 10</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-xs text-muted-foreground">Decision Band</p>
                <Badge className="bg-green-500 text-white mt-1">Accelerate</Badge>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-xs text-muted-foreground">Peak Sales (Median)</p>
                <p className="text-xl font-bold">$8.5B</p>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <p className="text-xs text-muted-foreground">Blockbuster Prob.</p>
                <p className="text-xl font-bold text-[hsl(142,76%,36%)]">89%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Pricing & Access - Model 1 (MWPSPI) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              5. Pricing & Access — MWPSPI (Model 1)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-2">Market</th>
                    <th className="text-center p-2">Clinical</th>
                    <th className="text-center p-2">Economic</th>
                    <th className="text-center p-2">Access</th>
                    <th className="text-center p-2">MWPSPI</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { m: "US Commercial", c: 82, e: 78, a: 75, s: 78 },
                    { m: "UK (NICE)", c: 72, e: 68, a: 82, s: 74 },
                    { m: "Germany (G-BA)", c: 75, e: 72, a: 78, s: 75 },
                    { m: "Japan (PMDA)", c: 78, e: 70, a: 72, s: 73 },
                  ].map((r) => (
                    <tr key={r.m} className="border-b">
                      <td className="p-2 font-medium">{r.m}</td>
                      <td className="text-center p-2">{r.c}</td>
                      <td className="text-center p-2">{r.e}</td>
                      <td className="text-center p-2">{r.a}</td>
                      <td className="text-center p-2 font-bold">{r.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Pricing & Access - Model 2 (Benchmarking) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              6. Pricing & Access — Benchmarking (Model 2) & Triangulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground">Model 1</p>
                <p className="text-lg font-bold">75.5%</p>
              </div>
              <div className="text-center p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground">Model 2</p>
                <p className="text-lg font-bold">72.1%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10 border-primary/30">
                <p className="text-xs text-muted-foreground">Triangulated</p>
                <p className="text-lg font-bold text-primary">73.8%</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Band: <Badge className="bg-green-500 text-white text-xs">Accelerate</Badge> — Strong payer support expected across major markets
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Monte Carlo */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              7. Monte Carlo Peak Sales Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Median Peak Sales</p>
                <p className="text-xl font-bold">$8.5B</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Sharpe Ratio</p>
                <p className="text-xl font-bold">1.92</p>
              </div>
            </div>
            <div className="h-16 bg-gradient-to-r from-muted via-primary/30 to-muted rounded-lg flex items-end justify-center gap-0.5 p-2">
              {[10, 18, 30, 48, 65, 82, 95, 100, 92, 78, 60, 42, 28, 15, 8].map((h, i) => (
                <div key={i} className="bg-primary/70 rounded-t w-3" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>$2B</span>
              <span>$8.5B (median)</span>
              <span>$18B+</span>
            </div>
            <table className="w-full text-xs mt-3">
              <tbody>
                {[
                  { p: "5th (Bear)", v: "$3.2B" },
                  { p: "25th", v: "$5.8B" },
                  { p: "50th (Median)", v: "$8.5B" },
                  { p: "75th", v: "$11.2B" },
                  { p: "95th (Bull)", v: "$16.8B" },
                ].map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                    <td className="p-1.5">{r.p}</td>
                    <td className="p-1.5 text-right font-bold">{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Section 8: Market & Regulatory */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              8. Market & Regulatory Analysis (10 Markets)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { m: "United States", s: "Priority Review", t: "12 mo" },
                { m: "EU / Germany", s: "Standard", t: "18 mo" },
                { m: "Japan", s: "Standard", t: "20 mo" },
                { m: "China", s: "Priority Import", t: "24 mo" },
              ].map((r) => (
                <div key={r.m} className="p-2 rounded border flex justify-between items-center">
                  <div>
                    <p className="font-medium">{r.m}</p>
                    <p className="text-muted-foreground">{r.s}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{r.t}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 9: Patent & Competitive */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              9. Patent & Competitive Landscape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs space-y-1">
              <div className="flex justify-between"><span>Key Patent Expiry</span><span className="font-bold">2041</span></div>
              <div className="flex justify-between"><span>Exclusivity Type</span><span className="font-bold">Composition + NCE</span></div>
              <div className="flex justify-between"><span>Key Differentiator</span><span className="font-bold text-[hsl(142,76%,36%)]">First oral non-peptide GLP-1</span></div>
            </div>
            <div className="border-t pt-2">
              <p className="text-xs font-medium mb-1">Top Competitors</p>
              <div className="space-y-1 text-xs">
                {[
                  { name: "Rybelsus (Novo)", threat: "Medium" },
                  { name: "Amycretin (Novo)", threat: "High" },
                  { name: "Danuglipron (Pfizer)", threat: "Low — Discontinued" },
                ].map((c) => (
                  <div key={c.name} className="flex justify-between">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.threat}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 10: Clinical Studies */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-primary" />
              10. Clinical Studies Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              {[
                { trial: "ACHIEVE-1 (T2D)", nct: "NCT05869903", status: "Active", phase: "Phase III" },
                { trial: "ACHIEVE-4 (T2D)", nct: "NCT06272890", status: "Enrolling", phase: "Phase III" },
                { trial: "ATTAIN-1 (Obesity)", nct: "NCT05869916", status: "Active", phase: "Phase III" },
              ].map((t) => (
                <div key={t.nct} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="font-medium">{t.trial}</p>
                    <p className="text-muted-foreground">{t.nct}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">{t.phase}</Badge>
                    <p className="text-muted-foreground mt-0.5">{t.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
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

// Pricing Tier Definitions - New structure
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

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full">
        <div className="bg-[#F5D547] w-full">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-4">
                <img src={bioquillLogo} alt="BiOQUILL" className="h-14 w-auto object-contain" />
                <span className="text-lg font-semibold text-gray-800 hidden md:block">
                  Pharmaceutical Intelligence for Smart Investors
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-[hsl(25,95%,55%)] w-full">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-0">
              <Link to="/" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors border-r border-orange-400/30">
                  Platform
                </button>
              </Link>
              <button className="flex-1 max-w-[200px] py-2 text-center font-bold text-black bg-orange-400/30 border-r border-orange-400/30">
                Pricing
              </button>
              <Link to="/methodology" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors">
                  Methodology
                </button>
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

        {/* What's in the Report Section */}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included in a molecule report?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every molecule report is a compounded Full Due Diligence Report that includes: Molecule Score Card, 
                  LPI-3 analysis with confidence intervals, LPI Extended breakdown, Investment Score Assessment, 
                  Pricing & Access models (Model 1 MWPSPI + Model 2 Benchmarking + Triangulation), Monte Carlo 
                  peak sales simulation, Market & Regulatory analysis across 10 markets, Patent & Competitive 
                  landscape, and Clinical Studies summary — all in a single downloadable PDF.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I pick molecules from different TAs in the 5-Molecule plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! The 5-Molecule Custom Basket lets you choose any combination of molecules from any 
                  therapeutic areas. You can mix Oncology, Neurology, Cardiology, or any other TA — it's your 
                  portfolio, your choice. All 5 molecules include side-by-side comparison tools.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What molecule comparison features are available?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  TA packages and the 5-Molecule basket include molecule comparison tools: head-to-head score 
                  comparison, LPI-3 side-by-side, competitive positioning analysis, TTM benchmarking, and 
                  risk-adjusted metrics comparison. These tools are visible and accessible directly in the 
                  platform dashboard.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade my plan later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade from 1 Molecule to 5 Molecules, or from any TA plan to a higher tier 
                  at any time. Credit from previous purchases will be applied to your upgrade.
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
                  All predictions include 95% confidence intervals and SHAP-based feature importance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to make smarter investment decisions?</h2>
          <p className="text-muted-foreground mb-6">
            Start with a single molecule report or contact us for multi-TA enterprise pricing.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/">
              <Button size="lg">Explore Platform</Button>
            </Link>
            <Button size="lg" className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 BioQuill. Pharmaceutical Intelligence Platform.</p>
        </div>
      </footer>
    </div>
  );
}
