import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft, Zap, Building2, Crown, FileText, TrendingUp, Package, Eye, X, BarChart3, Target, Shield, AlertTriangle, Percent, Mail, Send, Calculator, DollarSign, PieChart, Clock, Database, RefreshCw, CheckCircle, Pill, Layers, Globe, ShoppingCart, Plus, Minus, FlaskConical, Activity, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";
import topBarLogo from "@/assets/top-bar-logo.png";

// TA Matrix for configurator pricing
const TA_MATRIX: Record<string, { p1: number; p2: number; p3: number; total: number }> = {
  "Oncology & Hematology":        { p1: 5595, p2: 3154, p3: 1276, total: 10025 },
  "Endocrinology & Metabolism":   { p1: 951,  p2: 410,  p3: 449,  total: 1810  },
  "Respiratory & Pulmonary":      { p1: 608,  p2: 485,  p3: 306,  total: 1399  },
  "Cardiovascular":               { p1: 456,  p2: 337,  p3: 294,  total: 1087  },
  "Neurology":                    { p1: 459,  p2: 318,  p3: 222,  total: 999   },
  "Immunology & Inflammation":    { p1: 393,  p2: 318,  p3: 248,  total: 959   },
  "Dermatology":                  { p1: 351,  p2: 331,  p3: 255,  total: 937   },
  "Infectious Disease":           { p1: 467,  p2: 242,  p3: 149,  total: 858   },
  "Psychiatry & Mental Health":   { p1: 185,  p2: 166,  p3: 128,  total: 479   },
  "Rare Disease & Orphan":        { p1: 227,  p2: 135,  p3: 112,  total: 474   },
  "Gastroenterology & Hepatology":{ p1: 284,  p2: 92,   p3: 75,   total: 451   },
  "Hematology (non-oncology)":    { p1: 168,  p2: 114,  p3: 168,  total: 450   },
  "Ophthalmology":                { p1: 171,  p2: 139,  p3: 129,  total: 439   },
  "Nephrology & Renal":           { p1: 215,  p2: 136,  p3: 73,   total: 424   },
  "Musculoskeletal & Rheumatology":{ p1: 167, p2: 118,  p3: 115,  total: 400   },
  "Pain & Anaesthesia":           { p1: 68,   p2: 60,   p3: 50,   total: 178   },
  "Women's Health":               { p1: 57,   p2: 49,   p3: 56,   total: 162   },
  "Urology":                      { p1: 49,   p2: 30,   p3: 31,   total: 110   },
  "Vaccines & Preventive":        { p1: 17,   p2: 16,   p3: 32,   total: 65    },
  "Pediatrics":                   { p1: 10,   p2: 12,   p3: 11,   total: 33    },
};

const TA_ORDER = Object.keys(TA_MATRIX);

function calculatePrice(ta: string, phases: string[]): { price: number; trials: number } | null {
  const counts = TA_MATRIX[ta];
  if (!counts) return null;
  let trials = 0;
  if (phases.includes("all")) {
    trials = counts.p1 + counts.p2 + counts.p3;
  } else {
    if (phases.includes("1")) trials += counts.p1;
    if (phases.includes("2")) trials += counts.p2;
    if (phases.includes("3")) trials += counts.p3;
  }
  const raw = trials * 14;
  const rounded = Math.round(raw / 500) * 500;
  return { price: Math.max(5000, rounded), trials };
}

// ROI Calculator Component
const ROICalculator = () => {
  const [portfolioSize, setPortfolioSize] = useState([20]);
  const [avgDealValue, setAvgDealValue] = useState([50000]);
  const [failedDealRate, setFailedDealRate] = useState([20]);
  const [improvementRate, setImprovementRate] = useState([15]);
  const [selectedPlan, setSelectedPlan] = useState("300000");

  const annualDeals = portfolioSize[0];
  const avgDealValueK = avgDealValue[0] / 1000;
  const currentFailRate = failedDealRate[0] / 100;
  const improvementPct = improvementRate[0] / 100;

  const currentFailedDeals = Math.round(annualDeals * currentFailRate);
  const currentLossesK = currentFailedDeals * avgDealValueK;
  const improvedFailRate = currentFailRate * (1 - improvementPct);
  const improvedFailedDeals = Math.round(annualDeals * improvedFailRate);
  const improvedLossesK = improvedFailedDeals * avgDealValueK;
  const annualSavingsK = currentLossesK - improvedLossesK;
  const bioquillCostK = Number(selectedPlan) / 1000;
  const netROIK = annualSavingsK - bioquillCostK;
  const formatK = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1)}M` : `$${v}K`;
  const formatDealValue = (v: number) => v >= 1000000 ? `$${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`;
  const roiMultiple = bioquillCostK > 0 && netROIK > 0 ? Math.round((netROIK / bioquillCostK) * 10) / 10 : 0;

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
                <Label>Annual BD Evaluations</Label>
                <span className="font-bold text-primary">{portfolioSize[0]} deals</span>
              </div>
              <Slider value={portfolioSize} onValueChange={setPortfolioSize} min={1} max={100} step={1} className="w-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <Label>Average Deal Value</Label>
                <span className="font-bold text-primary">{formatDealValue(avgDealValue[0])}</span>
              </div>
              <Slider value={avgDealValue} onValueChange={setAvgDealValue} min={1000} max={500000} step={1000} className="w-full" />
              <p className="text-xs text-muted-foreground">Range: $1M – $500M (in thousands)</p>
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
              <Slider value={improvementRate} onValueChange={setImprovementRate} min={5} max={40} step={1} className="w-full" />
              <p className="text-xs text-muted-foreground">Based on LPI-3 AUC-ROC 0.82</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Select your BioQuill plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">1 Molecule — $5,000</SelectItem>
                  <SelectItem value="25000">1 TA (avg) — $25,000</SelectItem>
                  <SelectItem value="300000">Full Access — $300,000</SelectItem>
                </SelectContent>
              </Select>
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
                    <p className="text-xs font-medium opacity-90">Net ROI (after ${formatK(bioquillCostK)} investment)</p>
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
        <div className="bg-[#FFD700] rounded-lg p-4 flex items-center gap-4">
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

// TA Configurator Card
const TAConfiguratorCard = () => {
  const [selectedTA, setSelectedTA] = useState<string>("");
  const [phases, setPhases] = useState<string[]>(["all"]);

  const handlePhaseToggle = (phase: string) => {
    if (phase === "all") {
      setPhases(["all"]);
    } else {
      const newPhases = phases.filter(p => p !== "all");
      if (newPhases.includes(phase)) {
        const filtered = newPhases.filter(p => p !== phase);
        if (filtered.length === 0) {
          setPhases(["all"]);
        } else {
          setPhases(filtered);
        }
      } else {
        setPhases([...newPhases, phase]);
      }
    }
  };

  const result = selectedTA ? calculatePrice(selectedTA, phases) : null;

  const taFeatures = [
    "Full DD reports for every trial profile in selected scope",
    "TA Composite Index analytics",
    "Head-to-head molecule comparison tools",
    "Pipeline trend & white-space gap analysis",
    "M&A and in-licensing target identification",
    "Competitive intelligence sweep across selected scope",
    "Phase progression tracking",
    "1-year live monitoring & automated alerts",
  ];

  return (
    <Card className="relative flex flex-col border-2 border-primary shadow-lg shadow-primary/10">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-base">1 Therapeutic Area</CardTitle>
            <p className="text-xs font-medium text-muted-foreground">Your TA. Your Phases. Your Price.</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-2 space-y-4">
        {/* TA Dropdown */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Select Therapeutic Area</Label>
          <Select value={selectedTA} onValueChange={setSelectedTA}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select a therapeutic area" />
            </SelectTrigger>
            <SelectContent>
              {TA_ORDER.map(ta => (
                <SelectItem key={ta} value={ta} className="text-xs">
                  {ta} — {TA_MATRIX[ta].total.toLocaleString()} trials
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Phase Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Select Phases</Label>
          <div className="flex gap-1">
            {[
              { key: "all", label: "All" },
              { key: "1", label: "Phase 1" },
              { key: "2", label: "Phase 2" },
              { key: "3", label: "Phase 3" },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => handlePhaseToggle(opt.key)}
                className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md border transition-colors ${
                  phases.includes(opt.key)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-input hover:bg-accent"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Price */}
        {result ? (
          <div className="text-center py-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-2xl font-bold">${result.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ year</span></div>
            <p className="text-xs text-muted-foreground mt-1">{result.trials.toLocaleString()} trial profiles included</p>
          </div>
        ) : (
          <div className="text-center py-3 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground">Select a TA to see pricing</p>
          </div>
        )}

        {/* Features */}
        <ul className="space-y-1.5">
          {taFeatures.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1.5 text-xs">
              <Check className="h-3 w-3 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          className="w-full"
          disabled={!selectedTA}
          size="sm"
        >
          {selectedTA ? "Configure & Add to Cart" : "Select a TA to continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Comparison table data — 3 tiers only
const comparisonFeatures = [
  { feature: "Scope", t1: "1 molecule, all phases", ta: "Your TA + your phases", full: "All 20 TAs, all phases" },
  { feature: "Trial profiles", t1: "1", ta: "33 – 10,025", full: "21,739" },
  { feature: "Full DD report", t1: "✓", ta: "✓", full: "✓" },
  { feature: "LPI-3 + Extended", t1: "✓", ta: "✓", full: "✓" },
  { feature: "Monte Carlo", t1: "✓", ta: "✓", full: "✓" },
  { feature: "Pricing & Access", t1: "✓", ta: "✓", full: "✓" },
  { feature: "Molecule comparison", t1: "—", ta: "✓", full: "✓" },
  { feature: "Portfolio analytics", t1: "—", ta: "TA-level", full: "✓" },
  { feature: "Cross-TA analytics", t1: "—", ta: "—", full: "✓" },
  { feature: "API access", t1: "—", ta: "—", full: "✓" },
  { feature: "Monitoring & alerts", t1: "✓", ta: "✓", full: "✓" },
  { feature: "Automated briefings", t1: "—", ta: "Quarterly", full: "Quarterly calibration" },
  { feature: "Support", t1: "Email", ta: "Email", full: "Account Mgr + SLA" },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full">
        <Link to="/" className="block w-full">
          <div className="w-full bg-[#FFD700] flex items-center justify-center" style={{ height: '28px' }}>
            <div className="flex items-center gap-3">
              <span className="text-[#0E1D35] font-bold text-sm tracking-wide">BiOQUILL</span>
              <span className="text-[#0E1D35] text-[10px] opacity-80">Know the odds. Understand the pipeline. Win the race.</span>
            </div>
          </div>
        </Link>
        <div className="bg-[#0E1D35] w-full">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-0">
              <Link to="/methodology" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-white/90 hover:bg-white/10 transition-colors border-r border-white/20">
                  Methodology
                </button>
              </Link>
              <Link to="/" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-white/90 hover:bg-white/10 transition-colors border-r border-white/20">
                  Strategy Hub
                </button>
              </Link>
              <button className="flex-1 max-w-[200px] py-2 text-center font-bold text-white bg-white/15 border-r border-white/20">
                Pricing
              </button>
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

        {/* 3 Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {/* Tier 1: 1 Molecule */}
          <Card className="relative flex flex-col border transition-colors duration-150 ease-in-out hover:bg-[#FFFBEB] hover:border-[#F59E0B]">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-muted">
                  <Pill className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base">1 Molecule</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">Single Molecule — All Phases</p>
                </div>
              </div>
              <CardDescription className="text-xs">1 molecule of your choice — all development phases included</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <div className="mb-3">
                <span className="text-2xl font-bold">$5,000</span>
                <span className="text-muted-foreground text-xs ml-1">/ year</span>
              </div>
              <ul className="space-y-1.5">
                {[
                  "Full compounded due diligence report (print & export)",
                  "Molecule Score Card & Composite Score",
                  "LPI-3 launch probability analysis + extended",
                  "Investment Score Assessment",
                  "Pricing & Access Index (Model 1 + Model 2 + Triangulation)",
                  "Monte Carlo peak sales simulation",
                  "Market & Regulatory analysis (10 markets)",
                  "PTRS Technical & Regulatory Success",
                  "CAPM Alpha Signals",
                  "TTM Time-to-Market estimate",
                  "1-year trial status monitoring & alerts",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs">
                    <Check className="h-3 w-3 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Purchase Report
              </Button>
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
            </CardFooter>
          </Card>

          {/* Tier 2: 1 TA Configurator */}
          <TAConfiguratorCard />

          {/* Tier 3: Full Access */}
          <Card className="relative flex flex-col border transition-colors duration-150 ease-in-out hover:bg-[#FFFBEB] hover:border-[#F59E0B]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-[hsl(142,76%,36%)] text-white">Best Value</Badge>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-muted">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-base">Full Access</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground">All 20 TAs — All Phases — Enterprise</p>
                </div>
              </div>
              <CardDescription className="text-xs">21,739 trial profiles — all 20 TAs — all phases</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              <div className="mb-1">
                <span className="text-2xl font-bold">$300,000</span>
                <span className="text-muted-foreground text-xs ml-1">/ year (starting)</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-3">Starting price — final contract based on user count, API volume, and custom configuration</p>
              <ul className="space-y-1.5">
                {[
                  "All 20 therapeutic areas — 21,739 trial profiles",
                  "Unlimited DD reports & comparisons",
                  "Full molecule comparison across all TAs",
                  "Enterprise portfolio dashboard",
                  "Custom scoring & model configurations",
                  "White-label reporting",
                  "SSO & team management",
                  "Dedicated account manager",
                  "Quarterly model calibration consultations",
                  "Priority support & SLA",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-xs">
                    <Check className="h-3 w-3 text-[hsl(142,76%,36%)] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-2">
              <Button className="w-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white" size="sm">
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
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

        {/* Feature Comparison Table — 3 tiers */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature Comparison</h2>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium">Feature</th>
                    <th className="text-center p-3 font-medium">1 Molecule</th>
                    <th className="text-center p-3 font-medium bg-primary/5">1 TA (configured)</th>
                    <th className="text-center p-3 font-medium">Full Access</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                      <td className="p-3 text-sm font-medium">{row.feature}</td>
                      <td className="p-3 text-sm text-center">{row.t1}</td>
                      <td className="p-3 text-sm text-center bg-primary/5 font-medium">{row.ta}</td>
                      <td className="p-3 text-sm text-center">{row.full}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-3 italic">
            All tiers provide analytical outputs and scores only. Proprietary model formulas, index architectures, calculation weights, and methodology details are confidential and not included in reports or platform access. Trial profile counts reflect industry-sponsored trials from ClinicalTrials.gov (2015 onwards). PK & Pharmacology trials are available on the platform but excluded from billable profile counts.
          </p>
        </div>

        {/* Hero Stats */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 mb-16">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$300K</div>
                <p className="text-sm font-medium">Full pipeline access</p>
                <p className="text-xs text-muted-foreground">21,739 trial profiles</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">82%</div>
                <p className="text-sm font-medium">LPI-3 model accuracy (AUC-ROC)</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">21,739+</div>
                <p className="text-sm font-medium">Trial profiles across 20 TAs</p>
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
                  <p className="text-4xl font-bold text-[hsl(142,76%,36%)]">Instant</p>
                  <p className="text-sm font-medium text-[hsl(142,70%,35%)]">Time to Insight</p>
                  <p className="text-xs text-muted-foreground mt-1">vs 45 days traditional</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-6 text-center">
                  <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-blue-600">99%</p>
                  <p className="text-sm font-medium text-blue-700">Cost Reduction</p>
                  <p className="text-xs text-muted-foreground mt-1">vs traditional analyst cost</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-lg p-6 text-center">
                  <Database className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <p className="text-4xl font-bold text-purple-600">1,449x</p>
                  <p className="text-sm font-medium text-purple-700">More Coverage</p>
                  <p className="text-xs text-muted-foreground mt-1">21,739 vs 15 molecules</p>
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
                      { icon: <Clock className="h-4 w-4" />, metric: "Time to Complete", bq: "Instant", trad: "45 days", adv: "45 days faster" },
                      { icon: <DollarSign className="h-4 w-4" />, metric: "Cost per Analysis", bq: "From $5,000", trad: "$15,000+", adv: "Up to 97% savings" },
                      { icon: <Database className="h-4 w-4" />, metric: "Pipeline Coverage", bq: "21,739 trial profiles", trad: "15 molecules", adv: "1,449x more" },
                      { icon: <RefreshCw className="h-4 w-4" />, metric: "Update Frequency", bq: "Weekly", trad: "Quarterly", adv: "13x faster" },
                      { icon: <CheckCircle className="h-4 w-4" />, metric: "Model Validation", bq: "AUC-ROC 0.82", trad: "Judgment-based", adv: "Quantified vs subjective" },
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
              { q: "What's included in a molecule report?", a: "Every molecule report is a compounded Full Due Diligence Report that includes: Molecule Score Card, LPI-3 analysis with confidence intervals, LPI Extended breakdown, Investment Score Assessment, Pricing & Access models (Model 1 MWPSPI + Model 2 Benchmarking + Triangulation), Monte Carlo peak sales simulation, Market & Regulatory analysis across 10 markets, Patent & Competitive landscape, and Clinical Studies summary — all in a single compounded report (print & export)." },
              { q: "What molecule comparison features are available?", a: "TA packages include molecule comparison tools: head-to-head score comparison, LPI-3 side-by-side, competitive positioning analysis, TTM benchmarking, and risk-adjusted metrics comparison. These tools are visible and accessible directly in the platform dashboard." },
              { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade from 1 Molecule to a TA package, or from any TA plan to Full Access at any time. Credit from previous purchases will be applied to your upgrade." },
              { q: "How does the 1 TA configurator pricing work?", a: "Select your therapeutic area and the development phases you want to cover — Phase 1, Phase 2, Phase 3, or any combination. The price updates instantly based on the number of trial profiles in your selection. Every profile includes a full compounded due diligence report and 1-year monitoring. Minimum price is $5,000/year regardless of scope." },
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
            Start with a single molecule report, configure your therapeutic area package, or contact us for full enterprise access.
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
          <p>© 2026 BioQuill. Pharmaceutical Intelligence Platform.</p>
          <p className="text-xs mt-1 italic">Know the odds. Understand the pipeline. Win the race.</p>
        </div>
      </footer>
    </div>
  );
}
