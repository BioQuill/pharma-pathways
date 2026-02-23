import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Calendar, 
  Globe, 
  TrendingUp, 
  Search,
  BarChart3,
  Download,
  Pill,
  ArrowUpDown,
  X,
  Brain,
  Target,
  ExternalLink,
  Info,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Star,
  LayoutDashboard,
  Building2,
  DollarSign,
  Landmark
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";
import { MoleculeScoreCard } from "@/components/MoleculeScoreCard";
import { MarketAnalysisTable } from "@/components/MarketAnalysisTable";
import { MarketHeatMap } from "@/components/MarketHeatMap";
import { RegulatoryTimelineChart } from "@/components/RegulatoryTimelineChart";
import { RegulatoryPathwayCalculator } from "@/components/RegulatoryPathwayCalculator";
import { TrialFailureAnalysis } from "@/components/TrialFailureAnalysis";
import { RetrospectiveTimeline } from "@/components/RetrospectiveTimeline";
import { PatentTimeline, type PatentInfo } from "@/components/PatentTimeline";
import { CompetitiveAnalysis, type CompetitiveLandscape } from "@/components/CompetitiveAnalysis";
import { LaunchFactorsCard } from "@/components/LaunchFactorsCard";
import { TACompositeIndexDashboard } from "@/components/TACompositeIndexDashboard";
import { TTMBreakdownChart } from "@/components/TTMBreakdownChart";
import { LPI3Dashboard } from "@/components/LPI3Dashboard";
import { LPI2Dashboard } from "@/components/LPI2Dashboard";
import { LPI3ReportCard } from "@/components/LPI3ReportCard";
import { LPIExtendedReportCard } from "@/components/LPIExtendedReportCard";
import { InvestmentScoreReportCard } from "@/components/InvestmentScoreReportCard";
import { MoleculeComparison } from "@/components/MoleculeComparison";
import { PeakSalesIndexDashboard } from "@/components/PeakSalesIndexDashboard";
import { PTRSMoleculeComparison } from "@/components/PTRSMoleculeComparison";
import { PTRSHistoricalTracking } from "@/components/PTRSHistoricalTracking";
import { PTRSAlertSystem } from "@/components/PTRSAlertSystem";
import { PTRSMonteCarloIntegration } from "@/components/PTRSMonteCarloIntegration";
import { PTRSMonteCarloComparison } from "@/components/PTRSMonteCarloComparison";
import { PTRSStressTesting } from "@/components/PTRSStressTesting";
import PTRSPortfolioStressTest from "@/components/PTRSPortfolioStressTest";
import MonteCarloConvergenceAnalysis from "@/components/MonteCarloConvergenceAnalysis";
import PTRSPortfolioOptimization from "@/components/PTRSPortfolioOptimization";
import PTRSCustomScenarioBuilder from "@/components/PTRSCustomScenarioBuilder";
import { PTRSPortfolioRebalancing } from "@/components/PTRSPortfolioRebalancing";
import PTRSRebalancingHistory from "@/components/PTRSRebalancingHistory";
import { TAMarketOverview } from "@/components/TAMarketOverview";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
import { MoleculeExportPanel } from "@/components/MoleculeExportPanel";
import { getTherapeuticIndexForMolecule, getTherapeuticIndexColor, getTherapeuticIndexBgColor } from "@/lib/therapeuticIndex";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistPanel } from "@/components/WatchlistPanel";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { Top100BlockbusterDrugs } from "@/components/Top100BlockbusterDrugs";
import { Top50SmallCapFirms } from "@/components/Top50SmallCapFirms";
import { PricingAccessDashboard } from "@/components/PricingAccessDashboard";
import { PayersLandscape } from "@/components/PayersLandscape";
import { 
  calculateProbabilityScores,
  generateMarketProjections, 
  calculateOverallScore,
  calculateTTMMonths,
  type ProbabilityScores,
  type MarketData
} from "@/lib/scoring";
import { generateLaunchFactors, type LaunchFactors } from "@/lib/launchFactors";
import { getManufacturingCapability } from "@/lib/manufacturingCapability";
import { additionalMolecules, type MoleculeProfile, type TherapeuticIndex } from "@/lib/moleculesData";
import { coreMolecules } from "@/lib/coreMolecules";
import { endocrinologyMolecules } from "@/lib/endocrinologyMolecules";
import { obesityMolecules } from "@/lib/obesityMolecules";
import { diabetesMolecules } from "@/lib/diabetesMolecules";
import { dermatologyMolecules } from "@/lib/dermatologyMolecules";
import { oncologyMolecules } from "@/lib/oncologyMolecules";
import { cardiovascularMolecules } from "@/lib/cardiovascularMolecules";
import { neurologyMolecules } from "@/lib/neurologyMolecules";
import { immunologyMolecules } from "@/lib/immunologyMolecules";
import { infectiousMolecules } from "@/lib/infectiousMolecules";
import { rareDiseaseMolecules } from "@/lib/rareDiseaseMolecules";
import { rheumatologyMolecules } from "@/lib/rheumatologyMolecules";
import { psychiatryMolecules } from "@/lib/psychiatryMolecules";
import { hematologyMolecules } from "@/lib/hematologyMolecules";
import { gastroenterologyMolecules } from "@/lib/gastroenterologyMolecules";
import { nephrologyMolecules } from "@/lib/nephologyMolecules";
import { painMolecules } from "@/lib/painMolecules";
import { womensHealthMolecules } from "@/lib/womensHealthMolecules";
import { extendedOncologyMolecules } from "@/lib/extendedOncologyMolecules";
import { extendedNeurologyMolecules } from "@/lib/extendedNeurologyMolecules";
import { extendedCardiometabolicMolecules } from "@/lib/extendedCardiometabolicMolecules";
import { extendedImmunologyMolecules } from "@/lib/extendedImmunologyMolecules";
import { extendedInfectiousMolecules } from "@/lib/extendedInfectiousMolecules";
import { extendedPsychiatryMolecules } from "@/lib/extendedPsychiatryMolecules";
import { extendedRheumatologyMolecules } from "@/lib/extendedRheumatologyMolecules";
import { MoleculeDistributionChart } from "@/components/MoleculeDistributionChart";

// TimelinePhase interface imported from moleculesData

// BioQuill vs Traditional Due Diligence Comparison Chart
const DueDiligenceComparisonChart = () => {
  const comparisonData = [
    { metric: "Time to Complete Analysis", bioquill: 2, traditional: 45, unit: "days", savings: "96%" },
    { metric: "Cost per Molecule Report", bioquill: 500, traditional: 15000, unit: "$", savings: "97%" },
    { metric: "Data Sources Analyzed", bioquill: 85, traditional: 12, unit: "sources", improvement: "7x" },
    { metric: "Portfolio Coverage", bioquill: 500, traditional: 15, unit: "molecules", improvement: "33x" },
    { metric: "Update Frequency", bioquill: 1, traditional: 90, unit: "days", savings: "99%" },
    { metric: "Accuracy Rate", bioquill: 94, traditional: 78, unit: "%", improvement: "+16%" },
  ];

  const chartData = [
    { category: "Time (days)", BioQuill: 2, Traditional: 45 },
    { category: "Cost ($K)", BioQuill: 0.5, Traditional: 15 },
    { category: "Data Sources", BioQuill: 85, Traditional: 12 },
    { category: "Molecules", BioQuill: 500, Traditional: 15 },
  ];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          BioQuill vs Traditional Due Diligence
        </CardTitle>
        <CardDescription>Time, cost, and coverage advantages of AI-powered analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">96%</p>
            <p className="text-sm text-green-700 dark:text-green-400">Time Savings</p>
            <p className="text-xs text-muted-foreground mt-1">2 days vs 45 days</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">97%</p>
            <p className="text-sm text-blue-700 dark:text-blue-400">Cost Reduction</p>
            <p className="text-xs text-muted-foreground mt-1">$500 vs $15,000</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">33x</p>
            <p className="text-sm text-purple-700 dark:text-purple-400">More Coverage</p>
            <p className="text-xs text-muted-foreground mt-1">500 vs 15 molecules</p>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={75} />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                        <p className="font-medium">{payload[0]?.payload?.category}</p>
                        {payload.map((entry: any, index: number) => (
                          <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="BioQuill" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} name="BioQuill" />
              <Bar dataKey="Traditional" fill="hsl(0, 0%, 70%)" radius={[0, 4, 4, 0]} name="Traditional" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Metric</th>
                <th className="text-center p-3 font-medium text-green-600">BioQuill</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Traditional</th>
                <th className="text-center p-3 font-medium text-primary">Advantage</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30">
                  <td className="p-3">{row.metric}</td>
                  <td className="text-center p-3 font-semibold text-green-600">
                    {row.unit === "$" ? `$${row.bioquill.toLocaleString()}` : row.bioquill}{row.unit !== "$" && row.unit !== "%" ? ` ${row.unit}` : row.unit === "%" ? "%" : ""}
                  </td>
                  <td className="text-center p-3 text-muted-foreground">
                    {row.unit === "$" ? `$${row.traditional.toLocaleString()}` : row.traditional}{row.unit !== "$" && row.unit !== "%" ? ` ${row.unit}` : row.unit === "%" ? "%" : ""}
                  </td>
                  <td className="text-center p-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {row.savings || row.improvement}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

// PTRS Calculator Component
const PTRSCalculator = ({ molecules }: { molecules: MoleculeProfile[] }) => {
  const [calculationMode, setCalculationMode] = useState<"ta" | "molecule">("ta");
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>("");
  const [therapeuticArea, setTherapeuticArea] = useState("oncology");
  const [currentPhase, setCurrentPhase] = useState("phase2");
  const [mechanismNovelty, setMechanismNovelty] = useState([50]);
  const [endpointClarity, setEndpointClarity] = useState([70]);
  const [priorTrialData, setPriorTrialData] = useState([60]);
  const [sponsorExperience, setSponsorExperience] = useState([65]);
  const [regulatoryPrecedent, setRegulatoryPrecedent] = useState([75]);
  const [safetyProfile, setSafetyProfile] = useState([70]);
  const ptrsReportRef = useRef<HTMLDivElement>(null);

  // Base rates by therapeutic area
  const taBaseRates: Record<string, { pts: number; prs: number }> = {
    oncology: { pts: 12, prs: 82 },
    cns: { pts: 8, prs: 78 },
    cardiovascular: { pts: 15, prs: 85 },
    infectious: { pts: 22, prs: 88 },
    immunology: { pts: 18, prs: 84 },
    metabolic: { pts: 16, prs: 86 },
    rareDisease: { pts: 25, prs: 90 },
    dermatology: { pts: 20, prs: 87 },
  };

  // Phase multipliers
  const phaseMultipliers: Record<string, number> = {
    preclinical: 0.3,
    phase1: 0.5,
    phase2: 0.75,
    phase3: 1.2,
    nda: 1.5,
    approved: 2.0,
  };

  // Get TA key from molecule's therapeutic area
  const getTAKey = (ta: string): string => {
    const taLower = ta.toLowerCase();
    if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
    if (taLower.includes("cns") || taLower.includes("neurology")) return "cns";
    if (taLower.includes("cardio")) return "cardiovascular";
    if (taLower.includes("infectious")) return "infectious";
    if (taLower.includes("immun")) return "immunology";
    if (taLower.includes("metabol") || taLower.includes("endocr") || taLower.includes("diabetes") || taLower.includes("obesity")) return "metabolic";
    if (taLower.includes("rare")) return "rareDisease";
    if (taLower.includes("derma")) return "dermatology";
    return "oncology";
  };

  // Get phase key from molecule's phase
  const getPhaseKey = (phase: string): string => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("preclinical")) return "preclinical";
    if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return "phase1";
    if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return "phase2";
    if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return "phase3";
    if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return "nda";
    if (phaseLower.includes("approved")) return "approved";
    return "phase2";
  };

  // When a molecule is selected, update parameters based on molecule data
  const handleMoleculeSelect = (moleculeId: string) => {
    setSelectedMoleculeId(moleculeId);
    const molecule = molecules.find(m => m.id === moleculeId);
    if (molecule) {
      const taKey = getTAKey(molecule.therapeuticArea);
      const phaseKey = getPhaseKey(molecule.phase);
      setTherapeuticArea(taKey);
      setCurrentPhase(phaseKey);
      
      // Adjust sliders based on molecule scores
      if (molecule.scores) {
        setMechanismNovelty([Math.round(molecule.scores.meetingEndpoints * 100)]);
        setEndpointClarity([Math.round(molecule.scores.approval * 100)]);
        setPriorTrialData([Math.round(molecule.scores.nextPhase * 100)]);
        setSponsorExperience([molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45]);
        setRegulatoryPrecedent([Math.round(molecule.scores.regulatoryPathway.accelerated * 100)]);
        setSafetyProfile([Math.round((1 - molecule.scores.dropoutRanking / 5) * 100)]);
      }
    }
  };

  // Calculate PTS based on inputs
  const calculatePTS = () => {
    const baseRate = taBaseRates[therapeuticArea]?.pts || 15;
    const phaseMultiplier = phaseMultipliers[currentPhase] || 1;
    
    const adjustmentFactor = 
      (mechanismNovelty[0] * 0.15 + 
       endpointClarity[0] * 0.25 + 
       priorTrialData[0] * 0.35 + 
       sponsorExperience[0] * 0.25) / 100;
    
    const pts = Math.min(95, Math.max(5, baseRate * phaseMultiplier * (0.5 + adjustmentFactor)));
    return Math.round(pts * 10) / 10;
  };

  // Calculate PRS based on inputs
  const calculatePRS = () => {
    const baseRate = taBaseRates[therapeuticArea]?.prs || 85;
    
    const adjustmentFactor = 
      (regulatoryPrecedent[0] * 0.4 + 
       safetyProfile[0] * 0.4 + 
       sponsorExperience[0] * 0.2) / 100;
    
    const prs = Math.min(98, Math.max(50, baseRate * (0.7 + adjustmentFactor * 0.6)));
    return Math.round(prs * 10) / 10;
  };

  const pts = calculatePTS();
  const prs = calculatePRS();
  const ptrs = Math.round((pts / 100) * prs * 10) / 10;

  const selectedMolecule = molecules.find(m => m.id === selectedMoleculeId);

  // TA display names
  const taDisplayNames: Record<string, string> = {
    oncology: "Oncology",
    cns: "CNS/Neurology",
    cardiovascular: "Cardiovascular",
    infectious: "Infectious Disease",
    immunology: "Immunology",
    metabolic: "Metabolic/Endocrine",
    rareDisease: "Rare Disease",
    dermatology: "Dermatology",
  };

  // Phase display names
  const phaseDisplayNames: Record<string, string> = {
    preclinical: "Preclinical",
    phase1: "Phase I",
    phase2: "Phase II",
    phase3: "Phase III",
    nda: "NDA/BLA Filed",
    approved: "Approved",
  };

  // Handle PDF download
  const handleDownloadPTRSPDF = async () => {
    if (!ptrsReportRef.current) return;
    
    // Show PDF header temporarily
    const pdfHeader = ptrsReportRef.current.querySelector('.ptrs-pdf-header');
    if (pdfHeader) {
      (pdfHeader as HTMLElement).style.display = 'block';
    }
    
    // Hide download button temporarily
    const hideButtons = ptrsReportRef.current.querySelectorAll('.ptrs-pdf-hide');
    hideButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });
    
    const filename = selectedMolecule 
      ? `PTRS_Analysis_${selectedMolecule.name.replace(/\s+/g, '_')}.pdf`
      : `PTRS_Analysis_${taDisplayNames[therapeuticArea]}_${phaseDisplayNames[currentPhase]}.pdf`;
    
    try {
      const { exportDomToPDF } = await import('@/lib/pdfGenerator');
      // Set an ID on the element for exportDomToPDF
      ptrsReportRef.current.id = 'ptrs-report-content';
      await exportDomToPDF('ptrs-report-content', filename, { orientation: 'portrait' });
    } finally {
      // Restore hidden elements
      if (pdfHeader) {
        (pdfHeader as HTMLElement).style.display = 'none';
      }
      hideButtons.forEach(btn => {
        (btn as HTMLElement).style.display = '';
      });
    }
  };

  return (
    <div className="space-y-6" ref={ptrsReportRef}>
      {/* PDF Header (hidden on screen, shown in PDF) */}
      <div className="ptrs-pdf-header hidden">
        <div className="text-center mb-6 pb-4 border-b">
          <h1 className="text-2xl font-bold text-primary">BioQuill PTRS Analysis Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {selectedMolecule && (
            <div className="mt-3 p-3 bg-primary/5 rounded-lg inline-block">
              <p className="font-semibold">{selectedMolecule.name}</p>
              <p className="text-sm text-muted-foreground">{selectedMolecule.company} | {selectedMolecule.indication}</p>
            </div>
          )}
        </div>
      </div>

      {/* Calculation Mode Toggle */}
      <div className="flex items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-4">
          <Label className="font-medium">Calculate for:</Label>
          <div className="flex gap-2">
            <Button
              variant={calculationMode === "ta" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalculationMode("ta")}
            >
              Therapeutic Area
            </Button>
            <Button
              variant={calculationMode === "molecule" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalculationMode("molecule")}
            >
              Specific Molecule
            </Button>
          </div>
        </div>
        <Button 
          variant="export" 
          size="sm" 
          onClick={handleDownloadPTRSPDF}
          className="ptrs-pdf-hide gap-2"
        >
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Molecule Selector (when in molecule mode) */}
      {calculationMode === "molecule" && (
        <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <Label className="font-medium">Select a Molecule</Label>
          <Select value={selectedMoleculeId} onValueChange={handleMoleculeSelect}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Choose a molecule to analyze..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {molecules.slice(0, 50).map((mol) => (
                <SelectItem key={mol.id} value={mol.id}>
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{mol.name}</span>
                    <span className="text-muted-foreground text-xs">({mol.company} - {mol.phase})</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMolecule && (
            <div className="mt-3 p-3 bg-background rounded border">
              <p className="text-sm"><strong>Molecule:</strong> {selectedMolecule.name}</p>
              <p className="text-sm text-muted-foreground"><strong>Indication:</strong> {selectedMolecule.indication}</p>
              <p className="text-sm text-muted-foreground"><strong>TA:</strong> {selectedMolecule.therapeuticArea} | <strong>Phase:</strong> {selectedMolecule.phase}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Parameters */}
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Therapeutic Area</Label>
              <Select value={therapeuticArea} onValueChange={setTherapeuticArea} disabled={calculationMode === "molecule" && !!selectedMoleculeId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="cns">CNS/Neurology</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="infectious">Infectious Disease</SelectItem>
                  <SelectItem value="immunology">Immunology</SelectItem>
                  <SelectItem value="metabolic">Metabolic/Endocrine</SelectItem>
                  <SelectItem value="rareDisease">Rare Disease</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Phase</Label>
              <Select value={currentPhase} onValueChange={setCurrentPhase} disabled={calculationMode === "molecule" && !!selectedMoleculeId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preclinical">Preclinical</SelectItem>
                  <SelectItem value="phase1">Phase I</SelectItem>
                  <SelectItem value="phase2">Phase II</SelectItem>
                  <SelectItem value="phase3">Phase III</SelectItem>
                  <SelectItem value="nda">NDA/BLA Filed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-medium text-sm text-muted-foreground">Technical Success Factors (PTS)</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Mechanism Novelty</span>
                <span className="font-medium">{mechanismNovelty[0]}%</span>
              </div>
              <Slider value={mechanismNovelty} onValueChange={setMechanismNovelty} max={100} step={5} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Endpoint Clarity</span>
                <span className="font-medium">{endpointClarity[0]}%</span>
              </div>
              <Slider value={endpointClarity} onValueChange={setEndpointClarity} max={100} step={5} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prior Trial Data Quality</span>
                <span className="font-medium">{priorTrialData[0]}%</span>
              </div>
              <Slider value={priorTrialData} onValueChange={setPriorTrialData} max={100} step={5} />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-medium text-sm text-muted-foreground">Regulatory Success Factors (PRS)</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Sponsor Experience</span>
                <span className="font-medium">{sponsorExperience[0]}%</span>
              </div>
              <Slider value={sponsorExperience} onValueChange={setSponsorExperience} max={100} step={5} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Regulatory Precedent</span>
                <span className="font-medium">{regulatoryPrecedent[0]}%</span>
              </div>
              <Slider value={regulatoryPrecedent} onValueChange={setRegulatoryPrecedent} max={100} step={5} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Safety Profile</span>
                <span className="font-medium">{safetyProfile[0]}%</span>
              </div>
              <Slider value={safetyProfile} onValueChange={setSafetyProfile} max={100} step={5} />
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-4">
          {calculationMode === "molecule" && selectedMolecule && (
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4">
              <p className="text-sm font-medium flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Calculating PTRS for: <span className="text-primary">{selectedMolecule.name}</span>
              </p>
            </div>
          )}
          
          <div className="grid gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">PTS (Technical Success)</p>
                    <p className="text-xs text-muted-foreground mt-1">Probability of meeting clinical endpoints</p>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{pts}%</div>
                </div>
                <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pts}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">PRS (Regulatory Success)</p>
                    <p className="text-xs text-muted-foreground mt-1">Probability of regulatory approval</p>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{prs}%</div>
                </div>
                <div className="mt-3 h-2 bg-green-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${prs}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">PTRS (Combined)</p>
                    <p className="text-xs text-muted-foreground mt-1">Overall probability of success</p>
                  </div>
                  <div className="text-4xl font-bold text-purple-600">{ptrs}%</div>
                </div>
                <div className="mt-3 h-3 bg-purple-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${Math.min(ptrs * 3, 100)}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-xs text-muted-foreground">
              <strong>Formula:</strong> PTRS = PTS × PRS = {pts}% × {prs}% = <strong>{ptrs}%</strong>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {calculationMode === "molecule" && selectedMolecule 
                ? `This calculation uses the profile data from ${selectedMolecule.name} to pre-populate adjustment factors.`
                : "This calculator provides estimated probabilities based on historical industry data and the parameters you've selected."}
            </p>
          </div>

          {/* Parameters Summary (for PDF) */}
          <div className="bg-muted/30 rounded-lg p-4 border mt-4">
            <h4 className="text-sm font-semibold mb-3">Input Parameters Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Therapeutic Area:</span>
                <span className="font-medium">{taDisplayNames[therapeuticArea]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Phase:</span>
                <span className="font-medium">{phaseDisplayNames[currentPhase]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mechanism Novelty:</span>
                <span className="font-medium">{mechanismNovelty[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Endpoint Clarity:</span>
                <span className="font-medium">{endpointClarity[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prior Trial Data:</span>
                <span className="font-medium">{priorTrialData[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sponsor Experience:</span>
                <span className="font-medium">{sponsorExperience[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regulatory Precedent:</span>
                <span className="font-medium">{regulatoryPrecedent[0]}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Safety Profile:</span>
                <span className="font-medium">{safetyProfile[0]}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'lpi' | 'ttm' | 'composite' | 'company' | 'ta' | 'ti'>('lpi');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const reportRef = useRef<HTMLDivElement>(null);
  
  // Watchlist hook for persistent molecule tracking
  const { 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    isInWatchlist, 
    updateNotes, 
    clearWatchlist 
  } = useWatchlist();

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !activeMolecule) return;
    
    // Show PDF header temporarily
    const pdfHeader = reportRef.current.querySelector('.pdf-header');
    if (pdfHeader) {
      (pdfHeader as HTMLElement).style.display = 'block';
    }
    
    // Hide action buttons temporarily
    const hideButtons = reportRef.current.querySelectorAll('.pdf-hide');
    hideButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });
    
    try {
      const { exportDomToPDF } = await import('@/lib/pdfGenerator');
      // Set an ID on the element for exportDomToPDF
      reportRef.current.id = 'due-diligence-report-content';
      await exportDomToPDF('due-diligence-report-content', `${activeMolecule.name.replace(/\s+/g, '_')}_Due_Diligence_Report.pdf`, { orientation: 'portrait' });
    } finally {
      // Restore hidden elements
      if (pdfHeader) {
        (pdfHeader as HTMLElement).style.display = 'none';
      }
      hideButtons.forEach(btn => {
        (btn as HTMLElement).style.display = '';
      });
    }
  };

  // Core molecules imported from shared module
  const mockMolecules = coreMolecules;

  // Merge all molecules from all therapeutic areas
  const allMolecules = [...mockMolecules, ...additionalMolecules, ...endocrinologyMolecules, ...obesityMolecules, ...diabetesMolecules, ...dermatologyMolecules, ...oncologyMolecules, ...cardiovascularMolecules, ...neurologyMolecules, ...immunologyMolecules, ...infectiousMolecules, ...rareDiseaseMolecules, ...rheumatologyMolecules, ...psychiatryMolecules, ...hematologyMolecules, ...gastroenterologyMolecules, ...nephrologyMolecules, ...painMolecules, ...womensHealthMolecules, ...extendedOncologyMolecules, ...extendedNeurologyMolecules, ...extendedCardiometabolicMolecules, ...extendedImmunologyMolecules, ...extendedInfectiousMolecules, ...extendedPsychiatryMolecules, ...extendedRheumatologyMolecules];

  // Calculate overall scores and generate launch factors based on probabilities and market projections
  allMolecules.forEach(mol => {
    mol.launchFactors = generateLaunchFactors(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.isFailed);
    const manufacturingCapability = getManufacturingCapability(mol.company);
    mol.overallScore = calculateOverallScore(
      mol.scores, 
      mol.marketData, 
      mol.phase, 
      mol.therapeuticArea, 
      manufacturingCapability.scaleUpIndex
    );
  });

  const activeMolecule = allMolecules.find(m => m.id === selectedMolecule);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Yellow Bar + Orange Navigation Bar */}
      <header className="sticky top-0 z-10 w-full">
        {/* Yellow Brand Bar */}
        <div className="bg-[#F5D547] w-full">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={bioquillLogo} alt="BiOQUILL" className="h-14 w-auto object-contain" />
                <span className="text-lg font-semibold text-gray-800 hidden md:block">
                  Pharmaceutical Intelligence for Smart Investors
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Orange Navigation Bar */}
        <div className="bg-[hsl(25,95%,55%)] w-full">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-center gap-0">
              {/* Compare Molecules */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex-1 max-w-[200px] py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors border-r border-orange-400/30">
                    Compare Molecules
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[800px] p-0" align="center">
                  <MoleculeComparison molecules={allMolecules} />
                </PopoverContent>
              </Popover>
              
              {/* Pricing */}
              <Link to="/pricing" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors border-r border-orange-400/30">
                  Pricing
                </button>
              </Link>
              
              {/* Methodology */}
              <Link to="/methodology" className="flex-1 max-w-[200px]">
                <button className="w-full py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors border-r border-orange-400/30">
                  Methodology
                </button>
              </Link>
              
              {/* Search */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex-1 max-w-[200px] py-2 text-center font-bold text-black hover:bg-orange-400/50 transition-colors flex items-center justify-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                    {(searchQuery || phaseFilter !== 'all') && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-xs bg-black/20 text-black">
                        {[searchQuery ? '1' : '', phaseFilter !== 'all' ? '1' : ''].filter(Boolean).length}
                      </Badge>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Search molecules</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Name, company, or therapeutic area..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phase filter</label>
                      <div className="flex flex-wrap gap-1">
                        {['all', 'Phase I', 'Phase II', 'Phase III', 'Approved'].map((phase) => (
                          <Button
                            key={phase}
                            variant={phaseFilter === phase ? 'default' : 'outline'}
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setPhaseFilter(phase)}
                          >
                            {phase === 'all' ? 'All' : phase.replace('Phase ', 'P')}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {(searchQuery || phaseFilter !== 'all') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-muted-foreground"
                        onClick={() => { setSearchQuery(''); setPhaseFilter('all'); }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Molecules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">From trial databases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">892</div>
              <p className="text-xs text-muted-foreground mt-1">Across 45 countries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Approval Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">8.3y</div>
              <p className="text-xs text-muted-foreground mt-1">FDA average timeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">12.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Phase I to approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="-mx-4 px-0">
            {/* Primary Navigation Bar - Blue */}
            <TabsList className="w-full justify-start bg-[#000080] border-0 rounded-none h-12 px-4">
              <TabsTrigger value="overview" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4" />
                Molecules Overview
              </TabsTrigger>
              <TabsTrigger value="ta-market" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Globe className="h-4 w-4" />
                TA Market Overview
              </TabsTrigger>
              <TabsTrigger value="molecules" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Pill className="h-4 w-4" />
                Molecules
              </TabsTrigger>
              <TabsTrigger value="top-100" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Target className="h-4 w-4" />
                Top 100
              </TabsTrigger>
              <TabsTrigger value="top-50-smallcap" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Building2 className="h-4 w-4" />
                Top 100 Small Cap Firms
              </TabsTrigger>
              <TabsTrigger value="watchlist" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Star className="h-4 w-4" />
                Watchlist ({watchlist.length})
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <LayoutDashboard className="h-4 w-4" />
                Portfolio
              </TabsTrigger>
            </TabsList>
            
            {/* Secondary Navigation Bar - Dark Purple */}
            <TabsList className="w-full justify-start bg-[#4B0082] border-0 rounded-none h-12 px-4">
              <TabsTrigger value="ttm" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                TTM
              </TabsTrigger>
              <TabsTrigger value="regulatory" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Globe className="h-4 w-4" />
                TA Risk Index
              </TabsTrigger>
              <TabsTrigger value="ptrs" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                PTRS
              </TabsTrigger>
              <TabsTrigger value="lpi-2" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                Investment Score
              </TabsTrigger>
              <TabsTrigger value="lpi-3" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                LPI
              </TabsTrigger>
              <TabsTrigger value="peak-sales" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4" />
                Peak Sales Index
              </TabsTrigger>
              <TabsTrigger value="pricing-access" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <DollarSign className="h-4 w-4" />
                Pricing & Access
              </TabsTrigger>
              <TabsTrigger value="payers" className="gap-2 text-white font-bold data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Landmark className="h-4 w-4" />
                Payers
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {!selectedMolecule ? (
              <div className="space-y-4">
                {/* Header with Sort Icons */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">High Priority Molecules</h2>
                    <p className="text-sm text-muted-foreground">Comprehensive due diligence profiles for PE/M&A analysis</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    {[
                      { key: 'lpi', label: 'LPI%' },
                      { key: 'ttm', label: 'TTM' },
                      { key: 'composite', label: 'Score' },
                      { key: 'ti', label: 'TI' },
                      { key: 'company', label: 'Company' },
                      { key: 'ta', label: 'TA' },
                    ].map(({ key, label }) => (
                      <Button
                        key={key}
                        variant={sortBy === key ? 'default' : 'outline'}
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          if (sortBy === key) {
                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                          } else {
                            setSortBy(key as typeof sortBy);
                            setSortOrder(key === 'company' || key === 'ta' ? 'asc' : 'desc');
                          }
                        }}
                      >
                        {label}
                        {sortBy === key && (
                          <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Molecule List */}

                {allMolecules
                  .filter((mol) => {
                    // Search filter
                    const query = searchQuery.toLowerCase();
                    const matchesSearch = !query || 
                      mol.name.toLowerCase().includes(query) ||
                      mol.company.toLowerCase().includes(query) ||
                      mol.therapeuticArea.toLowerCase().includes(query) ||
                      mol.indication.toLowerCase().includes(query);
                    
                    // Phase filter
                    const matchesPhase = phaseFilter === 'all' || mol.phase.includes(phaseFilter);
                    
                    return matchesSearch && matchesPhase;
                  })
                  .slice()
                  .sort((a, b) => {
                    const getTTM = (mol: typeof a) => calculateTTMMonths(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.marketData) ?? 999;
                    const getComposite = (mol: typeof a) => {
                      const ttm = getTTM(mol);
                      const ttmEfficiency = Math.max(0, Math.min(100, 100 - ((ttm - 1) * (100 / 99))));
                      return Math.round(mol.overallScore * 0.6 + ttmEfficiency * 0.4);
                    };
                    
                    const getTI = (mol: typeof a) => getTherapeuticIndexForMolecule(mol).value;
                    
                    let comparison = 0;
                    switch (sortBy) {
                      case 'lpi':
                        comparison = b.overallScore - a.overallScore;
                        break;
                      case 'ttm':
                        comparison = getTTM(a) - getTTM(b);
                        break;
                      case 'composite':
                        comparison = getComposite(b) - getComposite(a);
                        break;
                      case 'ti':
                        comparison = getTI(b) - getTI(a); // Higher TI = safer, so descending
                        break;
                      case 'company':
                        comparison = a.company.localeCompare(b.company);
                        break;
                      case 'ta':
                        comparison = a.therapeuticArea.localeCompare(b.therapeuticArea);
                        break;
                    }
                    return sortOrder === 'asc' ? -comparison : comparison;
                  })
                  .map((molecule) => (
                    <Card key={molecule.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMolecule(molecule.id)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">{molecule.name}</h3>
                            <Badge variant="outline">{molecule.id}</Badge>
                            <Badge variant="secondary" className="flex items-center gap-1.5">
                              <span>{molecule.company}</span>
                              {(() => {
                                const mfg = getManufacturingCapability(molecule.company);
                                return mfg?.ticker ? (
                                  <a
                                    href={`https://finance.yahoo.com/quote/${mfg.ticker}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-[hsl(0,70%,35%)] hover:text-[hsl(0,70%,25%)] transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                    title="View on Yahoo Finance"
                                  >
                                    {mfg.ticker}
                                  </a>
                                ) : null;
                              })()}
                            </Badge>
                          </div>
                          {/* Trial Name with Clinical Trials Link */}
                          {molecule.trialName && (
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://clinicaltrials.gov/search?term=${encodeURIComponent(molecule.clinicalTrialsSearchTerm || molecule.name.split(' ')[0])}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {molecule.trialName} {molecule.phase}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{molecule.phase}</span>
                            <span>•</span>
                            <span>{molecule.indication}</span>
                            <span>•</span>
                            <span>{molecule.therapeuticArea}</span>
                          </div>
                            <div className="flex items-center gap-6 mt-3">
                              <div className="text-xs">
                                <span className="text-muted-foreground">Approval: </span>
                                <span className="font-semibold">{(molecule.scores.approval * 100).toFixed(0)}%</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-muted-foreground">Next Phase: </span>
                                <span className="font-semibold">{(molecule.scores.nextPhase * 100).toFixed(0)}%</span>
                              </div>
                              <div className="text-xs">
                                <span className="text-muted-foreground">Dropout: </span>
                                <span className="font-semibold">{molecule.scores.dropoutRanking}/5</span>
                              </div>
                              {/* Therapeutic Index */}
                              {(() => {
                                const ti = molecule.therapeuticIndex || getTherapeuticIndexForMolecule(molecule);
                                const tiColor = ti.classification === 'wide' 
                                  ? 'text-[hsl(142,76%,36%)]' 
                                  : ti.classification === 'moderate' 
                                    ? 'text-[hsl(45,93%,47%)]' 
                                    : 'text-[hsl(0,72%,51%)]';
                                return (
                                  <div className="text-xs" title={`Therapeutic Index: ${ti.notes || 'Safety margin between efficacy and toxicity'}`}>
                                    <span className="text-muted-foreground">TI: </span>
                                    <span className={`font-semibold ${tiColor}`}>
                                      {ti.value.toFixed(1)} ({ti.classification})
                                    </span>
                                    {ti.monitoringRequired && (
                                      <span className="ml-1 text-[hsl(0,72%,51%)]" title="Monitoring required">⚠</span>
                                    )}
                                  </div>
                                );
                              })()}
                              <div className="text-xs">
                                <span className="text-muted-foreground">Revenue (2Y): </span>
                                <span className="font-semibold">${molecule.marketData.reduce((sum, m) => sum + m.revenueProjection.year1 + m.revenueProjection.year2, 0).toFixed(0)}M</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-4">
                              {/* LPI-3 Score */}
                              {(() => {
                                const lpi3 = calculateLPI3ForMolecule(molecule);
                                const lpi3Score = Math.round(lpi3.calibratedProbability * 100);
                                const ciLower = Math.round(lpi3.confidenceInterval.lower * 100);
                                const ciUpper = Math.round(lpi3.confidenceInterval.upper * 100);
                                return (
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">LPI</div>
                                    <div className={`text-2xl font-bold ${
                                      lpi3Score >= 67 
                                        ? 'text-[hsl(142,76%,36%)]' 
                                        : lpi3Score >= 34 
                                          ? 'text-[hsl(45,93%,47%)]' 
                                          : 'text-[hsl(0,72%,51%)]'
                                    }`}>{lpi3Score}%</div>
                                    <div className="text-[10px] text-muted-foreground cursor-help" title="95% Confidence Interval: The true launch probability is expected to fall within this range 95% of the time, based on model uncertainty and historical validation data.">CI: {ciLower}–{ciUpper}%</div>
                                  </div>
                                );
                              })()}
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">TTM</div>
                                {(() => {
                                  const ttm = calculateTTMMonths(molecule.phase, molecule.therapeuticArea, molecule.companyTrackRecord, molecule.marketData);
                                  const ttmEfficiency = ttm !== null ? Math.max(0, Math.min(100, 100 - ((ttm - 1) * (100 / 99)))) : null;
                                  const ttmColor = ttmEfficiency !== null 
                                    ? ttmEfficiency >= 67 
                                      ? 'text-[hsl(142,76%,36%)]' 
                                      : ttmEfficiency >= 34 
                                        ? 'text-[hsl(45,93%,47%)]' 
                                        : 'text-[hsl(0,72%,51%)]'
                                    : 'text-primary';
                                  return (
                                    <div className={`text-2xl font-bold ${ttmColor}`}>
                                      {ttm !== null ? `${ttm}m` : 'N/A'}
                                    </div>
                                  );
                                })()}
                              </div>
                              {/* Composite Score Badge */}
                              {(() => {
                                const ttm = calculateTTMMonths(molecule.phase, molecule.therapeuticArea, molecule.companyTrackRecord, molecule.marketData);
                                const ttmEfficiency = ttm !== null ? Math.max(0, Math.min(100, 100 - ((ttm - 1) * (100 / 99)))) : 50;
                                const compositeScore = Math.round(molecule.overallScore * 0.6 + ttmEfficiency * 0.4);
                                const bgColor = compositeScore >= 67 
                                  ? 'bg-[hsl(142,76%,36%)]' 
                                  : compositeScore >= 34 
                                    ? 'bg-[hsl(45,93%,47%)]' 
                                    : 'bg-[hsl(0,72%,51%)]';
                                return (
                                  <div 
                                    className={`flex items-center justify-center w-12 h-12 rounded-full ${bgColor} text-white`}
                                    title="Composite Score: 60% LPI + 40% TTM efficiency"
                                  >
                                    <span className="text-sm font-bold">{compositeScore}</span>
                                  </div>
                                );
                              })()}
                            </div>
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedMolecule(molecule.id); }}>
                              Full Analysis
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : activeMolecule ? (
              <div className="space-y-6" ref={reportRef}>
                {/* PDF-only header - hidden on screen, shown in PDF */}
                <div className="hidden print:block pdf-header bg-[#F5D547] py-2 px-4 -mx-4 mb-4">
                  <div className="flex items-center">
                    <img src={bioquillLogo} alt="BiOQUILL" className="h-8 w-auto object-contain" />
                  </div>
                </div>
                
                {/* Action buttons - visible on screen, hidden in PDF */}
                <div className="flex items-center justify-between pdf-hide-buttons">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">Full Due Diligence Report</h2>
                    <Button variant="secondary" size="sm" onClick={handleDownloadPDF} className="pdf-hide">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMolecule(null)} className="pdf-hide">
                    ← Back to Overview
                  </Button>
                </div>
                
                {activeMolecule.isFailed && activeMolecule.trialName && (
                  <TrialFailureAnalysis
                    moleculeName={activeMolecule.name}
                    trialName={activeMolecule.trialName}
                    phase={activeMolecule.phase}
                  />
                )}
                
                <MoleculeScoreCard
                  moleculeName={activeMolecule.name}
                  trialName={activeMolecule.trialName}
                  scores={activeMolecule.scores}
                  phase={activeMolecule.phase}
                  indication={activeMolecule.indication}
                  therapeuticArea={activeMolecule.therapeuticArea}
                  overallScore={activeMolecule.overallScore}
                  nctId={activeMolecule.nctId}
                  marketData={activeMolecule.marketData}
                  companyTrackRecord={activeMolecule.companyTrackRecord}
                  company={activeMolecule.company}
                  molecule={activeMolecule}
                />


                {/* Therapeutic Index Analysis Section */}
                {(() => {
                  const ti = getTherapeuticIndexForMolecule(activeMolecule);
                  const tiColor = getTherapeuticIndexColor(ti.classification);
                  const tiBgColor = getTherapeuticIndexBgColor(ti.classification);
                  
                  return (
                    <Card className="border-l-4 border-l-chart-4">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5" />
                          Therapeutic Index (TI) Analysis
                        </CardTitle>
                        <CardDescription>
                          Safety margin assessment based on TD50/ED50 ratio
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* TI Score Display */}
                          <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-muted/50">
                            <div className={`text-5xl font-bold ${tiColor}`}>
                              {ti.value.toFixed(1)}
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">Therapeutic Index</div>
                            <Badge className={`mt-2 ${tiBgColor} text-white`}>
                              {ti.classification === 'narrow' ? 'Narrow TI' : ti.classification === 'moderate' ? 'Moderate TI' : 'Wide TI'}
                            </Badge>
                          </div>
                          
                          {/* TD50/ED50 Values */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Dose-Response Parameters
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                                <div>
                                  <span className="text-sm font-medium">ED50</span>
                                  <p className="text-xs text-muted-foreground">Effective Dose 50%</p>
                                </div>
                                <span className="text-lg font-semibold text-[hsl(142,76%,36%)]">{ti.ed50} units</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                                <div>
                                  <span className="text-sm font-medium">TD50</span>
                                  <p className="text-xs text-muted-foreground">Toxic Dose 50%</p>
                                </div>
                                <span className="text-lg font-semibold text-[hsl(0,72%,51%)]">{ti.td50} units</span>
                              </div>
                              <div className="flex justify-between items-center p-3 rounded-md bg-primary/10 border border-primary/20">
                                <div>
                                  <span className="text-sm font-medium">Safety Margin</span>
                                  <p className="text-xs text-muted-foreground">TD50 ÷ ED50</p>
                                </div>
                                <span className={`text-lg font-bold ${tiColor}`}>{ti.value.toFixed(1)}x</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Monitoring & Safety Notes */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              {ti.monitoringRequired ? <AlertTriangle className="h-4 w-4 text-[hsl(45,93%,47%)]" /> : <ShieldCheck className="h-4 w-4 text-[hsl(142,76%,36%)]" />}
                              Safety Assessment
                            </h4>
                            
                            <div className={`p-4 rounded-md ${ti.monitoringRequired ? 'bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30' : 'bg-[hsl(142,76%,36%)]/10 border border-[hsl(142,76%,36%)]/30'}`}>
                              <div className="flex items-start gap-2">
                                {ti.monitoringRequired ? (
                                  <AlertTriangle className="h-5 w-5 text-[hsl(45,93%,47%)] mt-0.5 shrink-0" />
                                ) : (
                                  <ShieldCheck className="h-5 w-5 text-[hsl(142,76%,36%)] mt-0.5 shrink-0" />
                                )}
                                <div>
                                  <p className="font-medium text-sm">
                                    {ti.monitoringRequired ? 'Monitoring Required' : 'Standard Monitoring Sufficient'}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {ti.monitoringRequired 
                                      ? 'Drug level monitoring, dose adjustments, and regular safety assessments recommended'
                                      : 'Routine clinical monitoring as per standard protocols'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="p-4 rounded-md bg-muted/30">
                              <p className="text-sm font-medium mb-1">Clinical Notes</p>
                              <p className="text-sm text-muted-foreground">{ti.notes}</p>
                            </div>
                            
                            {/* TI Classification Legend */}
                            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                              <p className="font-medium">TI Classification:</p>
                              <div className="flex gap-4">
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[hsl(0,72%,51%)]"></span>
                                  Narrow (&lt;2)
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[hsl(45,93%,47%)]"></span>
                                  Moderate (2-10)
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-[hsl(142,76%,36%)]"></span>
                                  Wide (&gt;10)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()}

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Clinical Studies Summary
                    </CardTitle>
                    <CardDescription>
                      View all registered clinical trials for {activeMolecule.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://clinicaltrials.gov/search?term=${encodeURIComponent(activeMolecule.clinicalTrialsSearchTerm || activeMolecule.name.split(' ')[0])}&viewType=Table&limit=25&sort=StudyFirstPostDate`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View All Trials Table
                        </a>
                        <a
                          href={`https://clinicaltrials.gov/search?term=${encodeURIComponent(activeMolecule.clinicalTrialsSearchTerm || activeMolecule.name.split(' ')[0])}&viewType=Map`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          View Trials Map
                        </a>
                      </div>
                      {activeMolecule.trialName && (
                        <p className="text-sm text-muted-foreground">
                          Primary trial program: <span className="font-semibold">{activeMolecule.trialName}</span>
                          {activeMolecule.nctId && (
                            <> • NCT ID: <a 
                              href={`https://clinicaltrials.gov/study/${activeMolecule.nctId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {activeMolecule.nctId}
                            </a></>
                          )}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* LPI (Launch Probability Index) Analysis Card */}
                <LPI3ReportCard molecule={activeMolecule} />
                
                {/* LPI Extended Data - Feature Category Breakdown, Category Weight vs Performance, TA Launch Probability Comparison */}
                <LPIExtendedReportCard molecule={activeMolecule} />
                
                {activeMolecule.launchFactors && (
                  <LaunchFactorsCard
                    factors={activeMolecule.launchFactors}
                    moleculeName={activeMolecule.name}
                    therapeuticArea={activeMolecule.therapeuticArea}
                    company={activeMolecule.company}
                  />
                )}
                
                {/* Investment Score Analysis Card */}
                <InvestmentScoreReportCard molecule={{
                  id: activeMolecule.id,
                  name: activeMolecule.name,
                  phase: activeMolecule.phase,
                  therapeuticArea: activeMolecule.therapeuticArea,
                  indication: activeMolecule.indication,
                  company: activeMolecule.company,
                  companyTrackRecord: activeMolecule.companyTrackRecord,
                }} />
                
                {activeMolecule.patents && activeMolecule.patents.length > 0 && (
                  <PatentTimeline
                    moleculeName={activeMolecule.name}
                    patents={activeMolecule.patents}
                    regulatoryExclusivity={activeMolecule.regulatoryExclusivity}
                  />
                )}
                
                {activeMolecule.competitiveLandscape && (
                  <CompetitiveAnalysis
                    moleculeName={activeMolecule.name}
                    landscape={activeMolecule.competitiveLandscape}
                  />
                )}
                
                <MarketHeatMap marketData={activeMolecule.marketData} />
                
                <MarketAnalysisTable marketData={activeMolecule.marketData} />
                
                <RegulatoryTimelineChart />
                
                <RegulatoryPathwayCalculator />
                
                {activeMolecule.hasRetrospective && activeMolecule.retrospectivePhases && (
                  <RetrospectiveTimeline
                    moleculeName={activeMolecule.name}
                    indication={activeMolecule.indication}
                    sponsor={activeMolecule.company}
                    phases={activeMolecule.retrospectivePhases}
                  />
                )}

                {/* Metric Definitions */}
                <Card className="mt-8 border-t-4 border-t-muted">
                  <CardHeader>
                    <CardTitle className="text-lg">Metric Definitions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-primary">LPI% (Launch Probability Index)</h4>
                        <p className="text-sm text-muted-foreground">
                          The probability (0-100%) of a molecule successfully reaching market launch. Calculated using weighted factors: 
                          TA Composite Score (20%), Phase-specific success rates (25%), Approval probability (15%), Meeting endpoints (10%), 
                          Revenue potential (10%), Manufacturing/Scale-Up Capability (15%), and Dropout/Execution risk (5%).
                        </p>
                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(142,76%,36%)]"></span> 67-100: Strong</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]"></span> 34-66: Moderate</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]"></span> 0-33: High Risk</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-primary">TTM (Time To Market)</h4>
                        <p className="text-sm text-muted-foreground">
                          The expected number of months from the current development stage to first regulatory approval. 
                          Calculated using therapeutic area-specific factors and company track record data. Lower TTM values indicate 
                          faster commercialization timelines and are considered more favorable for investment decisions.
                        </p>
                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(142,76%,36%)]"></span> Fast (low months)</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]"></span> Average</span>
                          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]"></span> Slow (high months)</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-primary mb-2">Composite Score</h4>
                      <p className="text-sm text-muted-foreground">
                        A weighted aggregate of LPI% (60%) and TTM efficiency (40%), where TTM efficiency normalizes 1 month as 100 (best) and 100 months as 0 (worst). 
                        This metric provides a single holistic assessment balancing probability of success and timeline efficiency for PE/M&A decision-making.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Molecule Database</span>
                  <div className="flex items-center gap-2">
                    <MoleculeExportPanel molecules={allMolecules} />
                    <Badge variant="secondary" className="text-lg px-3 py-1">{allMolecules.length.toLocaleString()} Molecules</Badge>
                  </div>
                </CardTitle>
                <CardDescription>Browse and analyze clinical trial molecules</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Molecule Distribution Pie Chart */}
                <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                  <h3 className="text-sm font-semibold mb-3">Molecules by Therapeutic Area</h3>
                  <MoleculeDistributionChart molecules={allMolecules} />
                </div>
                <div className="grid gap-4">
                  {allMolecules.map((mol) => (
                    <div 
                      key={mol.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSelectedMolecule(mol.id);
                        setActiveTab("overview");
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-semibold">{mol.name}</div>
                          <div className="text-sm text-muted-foreground">{mol.company} • {mol.therapeuticArea}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{mol.phase}</Badge>
                        {(() => {
                          const lpi3 = calculateLPI3ForMolecule(mol);
                          const lpi3Score = Math.round(lpi3.calibratedProbability * 100);
                          const ciLower = Math.round(lpi3.confidenceInterval.lower * 100);
                          const ciUpper = Math.round(lpi3.confidenceInterval.upper * 100);
                          return (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-blue-500 text-white">LPI {lpi3Score}%</Badge>
                              <span className="text-[10px] text-muted-foreground">CI: {ciLower}–{ciUpper}%</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TA Market Overview Tab */}
          <TabsContent value="ta-market" className="space-y-6">
            <TAMarketOverview molecules={allMolecules} />
          </TabsContent>

          {/* TTM Tab */}
          <TabsContent value="ttm" className="space-y-6">
            <TTMBreakdownChart />
          </TabsContent>

          {/* Regulatory Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <TACompositeIndexDashboard />
          </TabsContent>

          {/* PTRS Tab */}
          <TabsContent value="ptrs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  PTRS Framework
                </CardTitle>
                <CardDescription>Probability of Technical & Regulatory Success</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <p className="text-foreground leading-relaxed">
                    Probability of technical and regulatory success (PTRS) is a broad term that encompasses not only the likelihood of a drug successfully navigating clinical trials (the technical aspect) but also the probability of receiving regulatory approval from agencies like the FDA (the regulatory aspect).
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Components</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-blue-600 mb-1">PTS</p>
                        <p className="text-xs text-blue-700 dark:text-blue-400">Probability of Technical Success</p>
                        <p className="text-sm text-muted-foreground mt-2">Likelihood of meeting clinical endpoints</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-green-600 mb-1">PRS</p>
                        <p className="text-xs text-green-700 dark:text-green-400">Probability of Regulatory Success</p>
                        <p className="text-sm text-muted-foreground mt-2">Likelihood of regulatory approval</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-bold text-purple-600 mb-1">PTRS Formula</p>
                        <p className="text-lg font-mono text-purple-700 dark:text-purple-400 mt-1">PTRS = PTS × PRS</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive PTRS Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Interactive PTRS Calculator
                </CardTitle>
                <CardDescription>Input clinical trial parameters to calculate PTS, PRS, and overall PTRS</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSCalculator molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* PTRS Molecule Comparison */}
            <PTRSMoleculeComparison molecules={allMolecules} />

            {/* PTRS Historical Tracking */}
            <PTRSHistoricalTracking molecules={allMolecules} />

            {/* PTRS Alert System */}
            <PTRSAlertSystem molecules={allMolecules} />

            {/* Monte Carlo PTRS Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Monte Carlo PTRS Simulation
                </CardTitle>
                <CardDescription>Probability distributions for success outcomes with configurable uncertainty</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSMonteCarloIntegration />
              </CardContent>
            </Card>

            {/* Monte Carlo Comparison */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Monte Carlo Distribution Comparison
                </CardTitle>
                <CardDescription>Compare PTRS probability distributions across multiple molecules</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSMonteCarloComparison molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Stress Testing */}
            <Card className="border-l-4 border-l-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Monte Carlo Stress Testing
                </CardTitle>
                <CardDescription>Simulate extreme scenarios and assess PTRS resilience</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSStressTesting molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Portfolio Stress Test */}
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Portfolio Stress Test
                </CardTitle>
                <CardDescription>Run all stress scenarios across your watchlist to identify vulnerable molecules</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSPortfolioStressTest molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Monte Carlo Convergence Analysis */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Monte Carlo Convergence Analysis
                </CardTitle>
                <CardDescription>Analyze simulation accuracy and find optimal iteration settings</CardDescription>
              </CardHeader>
              <CardContent>
                <MonteCarloConvergenceAnalysis molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Portfolio Optimization */}
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Portfolio Optimization
                </CardTitle>
                <CardDescription>Optimize molecule mix to minimize vulnerability while maximizing expected returns</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSPortfolioOptimization molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Portfolio Rebalancing Tool */}
            <Card className="border-l-4 border-l-teal-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-500" />
                  Portfolio Rebalancing
                </CardTitle>
                <CardDescription>Suggest weight adjustments when market conditions or PTRS scores change over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSPortfolioRebalancing molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Rebalancing History */}
            <PTRSRebalancingHistory molecules={allMolecules} />

            {/* Custom Scenario Builder */}
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-500" />
                  Custom Scenario Builder
                </CardTitle>
                <CardDescription>Define custom stress scenarios with adjustable impact parameters for each PTRS factor</CardDescription>
              </CardHeader>
              <CardContent>
                <PTRSCustomScenarioBuilder molecules={allMolecules} />
              </CardContent>
            </Card>

            {/* Historical PTRS Trend Lines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">PTRS Trends Over Time (2014-2024)</CardTitle>
                <CardDescription>Historical success rate trends by therapeutic area</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    oncology: { label: "Oncology", color: "hsl(0, 84%, 60%)" },
                    cns: { label: "CNS/Neurology", color: "hsl(217, 91%, 60%)" },
                    cardiovascular: { label: "Cardiovascular", color: "hsl(142, 71%, 45%)" },
                    infectious: { label: "Infectious", color: "hsl(45, 93%, 47%)" },
                    immunology: { label: "Immunology", color: "hsl(271, 81%, 56%)" },
                    rareDisease: { label: "Rare Disease", color: "hsl(340, 82%, 52%)" },
                  }}
                  className="h-[400px]"
                >
                  <LineChart
                    data={[
                      { year: "2014", oncology: 5.1, cns: 6.8, cardiovascular: 9.2, infectious: 16.8, immunology: 10.5, rareDisease: 15.2 },
                      { year: "2015", oncology: 5.4, cns: 6.5, cardiovascular: 9.0, infectious: 17.2, immunology: 10.8, rareDisease: 16.1 },
                      { year: "2016", oncology: 5.8, cns: 6.2, cardiovascular: 8.8, infectious: 17.5, immunology: 11.2, rareDisease: 17.3 },
                      { year: "2017", oncology: 6.2, cns: 5.9, cardiovascular: 8.5, infectious: 16.9, immunology: 11.5, rareDisease: 18.5 },
                      { year: "2018", oncology: 7.1, cns: 5.5, cardiovascular: 8.2, infectious: 16.5, immunology: 12.0, rareDisease: 19.2 },
                      { year: "2019", oncology: 7.8, cns: 5.8, cardiovascular: 8.0, infectious: 15.8, immunology: 12.4, rareDisease: 20.1 },
                      { year: "2020", oncology: 8.2, cns: 6.0, cardiovascular: 7.8, infectious: 18.5, immunology: 12.8, rareDisease: 20.8 },
                      { year: "2021", oncology: 8.5, cns: 6.3, cardiovascular: 7.6, infectious: 19.2, immunology: 13.1, rareDisease: 21.5 },
                      { year: "2022", oncology: 8.8, cns: 6.5, cardiovascular: 7.5, infectious: 18.8, immunology: 13.5, rareDisease: 22.0 },
                      { year: "2023", oncology: 9.2, cns: 6.8, cardiovascular: 7.4, infectious: 18.2, immunology: 14.0, rareDisease: 22.5 },
                      { year: "2024", oncology: 9.5, cns: 7.0, cardiovascular: 7.3, infectious: 17.8, immunology: 14.5, rareDisease: 23.0 },
                    ]}
                    margin={{ left: 20, right: 30, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 25]} tickFormatter={(v) => `${v}%`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="oncology" stroke="var(--color-oncology)" strokeWidth={2} dot={{ r: 3 }} name="Oncology" />
                    <Line type="monotone" dataKey="cns" stroke="var(--color-cns)" strokeWidth={2} dot={{ r: 3 }} name="CNS/Neurology" />
                    <Line type="monotone" dataKey="cardiovascular" stroke="var(--color-cardiovascular)" strokeWidth={2} dot={{ r: 3 }} name="Cardiovascular" />
                    <Line type="monotone" dataKey="infectious" stroke="var(--color-infectious)" strokeWidth={2} dot={{ r: 3 }} name="Infectious" />
                    <Line type="monotone" dataKey="immunology" stroke="var(--color-immunology)" strokeWidth={2} dot={{ r: 3 }} name="Immunology" />
                    <Line type="monotone" dataKey="rareDisease" stroke="var(--color-rareDisease)" strokeWidth={2} dot={{ r: 3 }} name="Rare Disease" />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Historical PTRS Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Success Rates by Therapeutic Area */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historical PTRS by Therapeutic Area</CardTitle>
                  <CardDescription>Average success rates across therapeutic areas (2014-2024)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      pts: { label: "PTS", color: "hsl(217, 91%, 60%)" },
                      prs: { label: "PRS", color: "hsl(142, 71%, 45%)" },
                      ptrs: { label: "PTRS", color: "hsl(271, 81%, 56%)" },
                    }}
                    className="h-[350px]"
                  >
                    <BarChart
                      data={[
                        { ta: "Oncology", pts: 5.3, prs: 85, ptrs: 4.5 },
                        { ta: "CNS", pts: 6.2, prs: 82, ptrs: 5.1 },
                        { ta: "Cardiovascular", pts: 8.4, prs: 88, ptrs: 7.4 },
                        { ta: "Infectious", pts: 15.6, prs: 90, ptrs: 14.0 },
                        { ta: "Immunology", pts: 11.2, prs: 86, ptrs: 9.6 },
                        { ta: "Metabolic", pts: 9.8, prs: 87, ptrs: 8.5 },
                        { ta: "Rare Disease", pts: 17.4, prs: 92, ptrs: 16.0 },
                        { ta: "Dermatology", pts: 12.3, prs: 89, ptrs: 10.9 },
                      ]}
                      layout="vertical"
                      margin={{ left: 80, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="ta" type="category" width={75} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="ptrs" fill="var(--color-ptrs)" radius={4} name="PTRS %" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Success Rates by Development Phase */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Phase Transition Success Rates</CardTitle>
                  <CardDescription>Historical probability of advancing to next phase</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      overall: { label: "Overall", color: "hsl(217, 91%, 60%)" },
                      oncology: { label: "Oncology", color: "hsl(0, 84%, 60%)" },
                      nonOncology: { label: "Non-Oncology", color: "hsl(142, 71%, 45%)" },
                    }}
                    className="h-[350px]"
                  >
                    <BarChart
                      data={[
                        { phase: "Phase I → II", overall: 52, oncology: 45, nonOncology: 58 },
                        { phase: "Phase II → III", overall: 29, oncology: 24, nonOncology: 34 },
                        { phase: "Phase III → NDA", overall: 58, oncology: 51, nonOncology: 64 },
                        { phase: "NDA → Approval", overall: 85, oncology: 82, nonOncology: 88 },
                      ]}
                      margin={{ left: 20, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="phase" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="overall" fill="var(--color-overall)" radius={4} name="Overall %" />
                      <Bar dataKey="oncology" fill="var(--color-oncology)" radius={4} name="Oncology %" />
                      <Bar dataKey="nonOncology" fill="var(--color-nonOncology)" radius={4} name="Non-Oncology %" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Cumulative PTRS Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cumulative PTRS from Phase I to Approval</CardTitle>
                <CardDescription>Overall likelihood of success from initial clinical trials to market approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Therapeutic Area</th>
                        <th className="text-center py-3 px-4 font-semibold">Phase I</th>
                        <th className="text-center py-3 px-4 font-semibold">Phase II</th>
                        <th className="text-center py-3 px-4 font-semibold">Phase III</th>
                        <th className="text-center py-3 px-4 font-semibold">NDA/BLA</th>
                        <th className="text-center py-3 px-4 font-semibold">Cumulative PTRS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ta: "Oncology", p1: 63, p2: 32, p3: 51, nda: 82, ptrs: 8.6 },
                        { ta: "Hematology", p1: 68, p2: 38, p3: 55, nda: 85, ptrs: 12.1 },
                        { ta: "Infectious Disease", p1: 72, p2: 42, p3: 64, nda: 90, ptrs: 17.4 },
                        { ta: "Cardiovascular", p1: 65, p2: 35, p3: 58, nda: 88, ptrs: 11.6 },
                        { ta: "CNS/Neurology", p1: 59, p2: 28, p3: 48, nda: 82, ptrs: 6.6 },
                        { ta: "Immunology", p1: 66, p2: 36, p3: 56, nda: 86, ptrs: 11.5 },
                        { ta: "Metabolic/Endocrine", p1: 64, p2: 34, p3: 54, nda: 87, ptrs: 10.2 },
                        { ta: "Rare Disease", p1: 74, p2: 45, p3: 68, nda: 92, ptrs: 21.0 },
                      ].map((row) => (
                        <tr key={row.ta} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{row.ta}</td>
                          <td className="text-center py-3 px-4">{row.p1}%</td>
                          <td className="text-center py-3 px-4">{row.p2}%</td>
                          <td className="text-center py-3 px-4">{row.p3}%</td>
                          <td className="text-center py-3 px-4">{row.nda}%</td>
                          <td className="text-center py-3 px-4">
                            <Badge variant={row.ptrs >= 15 ? "default" : row.ptrs >= 10 ? "secondary" : "outline"}>
                              {row.ptrs}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LPI-2 Tab - 5-Factor Investment Model */}
          <TabsContent value="lpi-2" className="space-y-6">
            <LPI2Dashboard molecules={allMolecules} />
          </TabsContent>

          {/* LPI-3 Tab - ML Model */}
          <TabsContent value="lpi-3" className="space-y-6">
            <LPI3Dashboard molecules={allMolecules} />
          </TabsContent>

          {/* Peak Sales Index Tab */}
          <TabsContent value="peak-sales" className="space-y-6">
            <PeakSalesIndexDashboard molecules={allMolecules} />
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            <WatchlistPanel
              watchlist={watchlist}
              molecules={allMolecules}
              onRemove={removeFromWatchlist}
              onUpdateNotes={updateNotes}
              onViewMolecule={(id) => {
                setSelectedMolecule(id);
                setActiveTab("overview");
              }}
              onClear={clearWatchlist}
            />
          </TabsContent>

          {/* Portfolio Dashboard Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioDashboard 
              molecules={allMolecules} 
              watchlistIds={watchlist.map(w => w.moleculeId)}
            />
          </TabsContent>

          {/* Top 100 Blockbuster Drugs Tab */}
          <TabsContent value="top-100" className="space-y-6">
            <Top100BlockbusterDrugs 
              molecules={allMolecules}
              onViewMolecule={(id) => {
                setSelectedMolecule(id);
                setActiveTab("overview");
              }}
            />
          </TabsContent>

          {/* Top 50 Small Cap Firms Tab */}
          <TabsContent value="top-50-smallcap" className="space-y-6">
            <Top50SmallCapFirms />
          </TabsContent>

          {/* Pricing & Access Tab */}
          <TabsContent value="pricing-access" className="space-y-6">
            <PricingAccessDashboard molecules={allMolecules} />
          </TabsContent>

          {/* Payers Tab */}
          <TabsContent value="payers" className="space-y-6">
            <PayersLandscape />
          </TabsContent>
        </Tabs>

        {/* Data Sources - Bottom of page */}
        <div className="mt-8">
          <Tabs defaultValue="trial-databases" className="w-full">
            <TabsList className="w-full justify-start h-10 bg-[#E8C84A] rounded-none p-0">
              <TabsTrigger 
                value="trial-databases" 
                className="h-10 px-6 rounded-none data-[state=active]:bg-[#C6A809] data-[state=active]:text-foreground text-foreground/80 font-semibold"
              >
                Trial Databases
              </TabsTrigger>
              <TabsTrigger 
                value="regulatory-sources" 
                className="h-10 px-6 rounded-none data-[state=active]:bg-[#C6A809] data-[state=active]:text-foreground text-foreground/80 font-semibold"
              >
                Regulatory Sources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trial-databases" className="mt-0 bg-[#FFF8DC] p-4 border border-t-0 border-[#E8C84A]">
              <div className="flex flex-col gap-2">
                <a 
                  href="https://clinicaltrials.gov" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="font-medium">ClinicalTrials.gov</span>
                  <Badge variant="secondary" className="text-xs">Primary</Badge>
                  <span className="text-muted-foreground text-xs">— U.S. National Library of Medicine</span>
                </a>
                <a 
                  href="https://trialsearch.who.int" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🌐</span>
                  <span className="font-medium">WHO ICTRP</span>
                  <Badge variant="outline" className="text-xs">12 Registries</Badge>
                  <span className="text-muted-foreground text-xs">— International Clinical Trials Registry Platform</span>
                </a>
              </div>
            </TabsContent>
            
            <TabsContent value="regulatory-sources" className="mt-0 bg-[#FFF8DC] p-4 border border-t-0 border-[#E8C84A]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <a 
                  href="https://www.fda.gov/drugs/nda-and-bla-approvals/nda-and-bla-calendar-year-approvals" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="font-medium">FDA Approvals</span>
                  <Badge variant="outline" className="text-xs">NDA/BLA</Badge>
                </a>
                <a 
                  href="https://www.ema.europa.eu/en/medicines/national-registers-authorised-medicines#human-medicines-13110" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇪🇺</span>
                  <span className="font-medium">EMA Registers</span>
                  <Badge variant="outline" className="text-xs">National</Badge>
                </a>
                <a 
                  href="https://ec.europa.eu/health/documents/community-register/html/reg_hum_act.htm?sort=a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇪🇺</span>
                  <span className="font-medium">EU Community Register</span>
                  <Badge variant="outline" className="text-xs">Human Medicines</Badge>
                </a>
                <a 
                  href="https://www.nmpa.gov.cn/yaopin/index.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇨🇳</span>
                  <span className="font-medium">NMPA China</span>
                  <Badge variant="outline" className="text-xs">Drug Registry</Badge>
                </a>
                <a 
                  href="https://www.pmda.go.jp/english/review-services/reviews/approved-information/drugs/0002.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇯🇵</span>
                  <span className="font-medium">PMDA Japan</span>
                  <Badge variant="outline" className="text-xs">Approvals</Badge>
                </a>
                <a 
                  href="https://products.mhra.gov.uk/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇬🇧</span>
                  <span className="font-medium">MHRA UK</span>
                  <Badge variant="outline" className="text-xs">Products</Badge>
                </a>
                <a 
                  href="https://health-products.canada.ca/dpd-bdpp/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇨🇦</span>
                  <span className="font-medium">Health Canada</span>
                  <Badge variant="outline" className="text-xs">DPD</Badge>
                </a>
                <a 
                  href="https://consultas.anvisa.gov.br/#/medicamentos/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                >
                  <span className="text-base">🇧🇷</span>
                  <span className="font-medium">ANVISA Brazil</span>
                  <Badge variant="outline" className="text-xs">Registry</Badge>
                </a>
              </div>
              <div className="text-xs text-muted-foreground mt-3 text-right">Last sync: Dec 7, 2025</div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
