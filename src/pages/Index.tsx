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
  Activity
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";
import html2pdf from "html2pdf.js";
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
import { TAMarketOverview } from "@/components/TAMarketOverview";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
import { exportMoleculesToExcel, exportLPIDetailedToExcel, exportTherapeuticAreaSummary } from "@/lib/excelExport";
import { getTherapeuticIndexForMolecule, getTherapeuticIndexColor, getTherapeuticIndexBgColor } from "@/lib/therapeuticIndex";
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

// PTRS Calculator Component
const PTRSCalculator = () => {
  const [therapeuticArea, setTherapeuticArea] = useState("oncology");
  const [currentPhase, setCurrentPhase] = useState("phase2");
  const [mechanismNovelty, setMechanismNovelty] = useState([50]);
  const [endpointClarity, setEndpointClarity] = useState([70]);
  const [priorTrialData, setPriorTrialData] = useState([60]);
  const [sponsorExperience, setSponsorExperience] = useState([65]);
  const [regulatoryPrecedent, setRegulatoryPrecedent] = useState([75]);
  const [safetyProfile, setSafetyProfile] = useState([70]);

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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Parameters */}
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Therapeutic Area</Label>
              <Select value={therapeuticArea} onValueChange={setTherapeuticArea}>
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
              <Select value={currentPhase} onValueChange={setCurrentPhase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preclinical">Preclinical</SelectItem>
                  <SelectItem value="phase1">Phase I</SelectItem>
                  <SelectItem value="phase2">Phase II</SelectItem>
                  <SelectItem value="phase3">Phase III</SelectItem>
                  <SelectItem value="nda">NDA/BLA Filed</SelectItem>
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
              This calculator provides estimated probabilities based on historical industry data and the parameters you've selected. 
              Actual outcomes may vary based on specific trial characteristics and regulatory environment.
            </p>
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

  const handleDownloadPDF = () => {
    if (!reportRef.current || !activeMolecule) return;
    
    // Clone the element to modify it for PDF
    const element = reportRef.current.cloneNode(true) as HTMLElement;
    
    // Show PDF header
    const pdfHeader = element.querySelector('.pdf-header');
    if (pdfHeader) {
      (pdfHeader as HTMLElement).style.display = 'block';
    }
    
    // Hide action buttons
    const hideButtons = element.querySelectorAll('.pdf-hide');
    hideButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none';
    });
    
    const opt = {
      margin: 10,
      filename: `${activeMolecule.name.replace(/\s+/g, '_')}_Due_Diligence_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // Generate comprehensive molecule profiles with real probability calculations
  const mockMolecules: MoleculeProfile[] = [
    {
      id: "RETA-01",
      name: "Retatrutide (LY3437943)",
      trialName: "TRIUMPH",
      phase: "Phase III",
      indication: "Obesity / Type 2 Diabetes",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Eli Lilly",
      companyTrackRecord: 'fast',
      nctId: "NCT05929066",
      clinicalTrialsSearchTerm: "retatrutide",
      scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
      marketData: generateMarketProjections("Retatrutide", "Phase III", "Obesity", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,491,212", title: "GIP/GLP-1/Glucagon receptor agonist compositions", expirationDate: "2039", type: 'composition', status: 'active' },
        { patentNumber: "US11,723,952", title: "Methods of treating obesity with triple agonist", expirationDate: "2040", type: 'method', status: 'active' },
        { patentNumber: "US11,851,468", title: "Formulations of GIP/GLP-1/Glucagon agonists", expirationDate: "2041", type: 'formulation', status: 'active' },
        { patentNumber: "WO2020/023451", title: "Triple hormone receptor agonist peptides", expirationDate: "2039", type: 'composition', status: 'active', notes: "Key composition of matter patent" },
      ],
      regulatoryExclusivity: [
        { type: "NCE Exclusivity (projected)", endDate: "2031" },
        { type: "Orphan Drug (potential)", endDate: "2034" },
        { type: "Pediatric Extension", endDate: "2031.5" },
      ],
      competitiveLandscape: {
        totalMarketSize: "$130B+",
        projectedGrowth: "25% CAGR",
        keyPlayers: [
          { name: "Tirzepatide (Mounjaro/Zepbound)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual agonist", keyDifferentiator: "Best-in-class efficacy, same company", efficacy: "22.5% weight loss", threat: 'medium' },
          { name: "Semaglutide (Wegovy/Ozempic)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1 agonist", keyDifferentiator: "Market leader, brand recognition", efficacy: "15-17% weight loss", threat: 'medium' },
          { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "GLP-1 + Amylin", keyDifferentiator: "Combination approach, strong efficacy", efficacy: "~25% weight loss (Ph2)", threat: 'high' },
          { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Oral convenience", efficacy: "~15% weight loss", threat: 'low' },
          { name: "Survodutide", company: "Boehringer/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon dual", keyDifferentiator: "MASH indication focus", efficacy: "~19% weight loss", threat: 'medium' },
        ],
        competitiveAdvantages: [
          "Best-in-class weight loss efficacy (~24% in Phase 2)",
          "Triple mechanism (GIP/GLP-1/Glucagon) addresses multiple pathways",
          "Eli Lilly manufacturing excellence and commercial reach",
          "Strong metabolic benefits beyond weight loss",
          "MASH indication potential (massive unmet need)"
        ],
        competitiveRisks: [
          "Internal competition with tirzepatide (cannibalization)",
          "CagriSema showing comparable efficacy",
          "GI tolerability concerns with triple agonism",
          "Pricing pressure in obesity market",
          "Manufacturing complexity of triple agonist"
        ],
        marketPositioning: "Retatrutide is positioned as a potential best-in-class obesity treatment with unprecedented ~24% weight loss. The triple agonist mechanism (GIP/GLP-1/Glucagon) provides differentiation from dual agonists. Key positioning: premium efficacy for patients who need maximum weight loss or have failed other GLP-1 therapies."
      },
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q1 2021",
          trialName: "First-in-Human Studies",
          nctIds: ["NCT04143802"],
          outcome: 'success',
          keyData: [
            "First triple agonist (GIP/GLP-1/Glucagon) in humans",
            "Novel mechanism targeting three metabolic pathways",
            "Acceptable safety profile established",
            "Dose-dependent glucose and weight effects"
          ],
          scoreAtTime: 28,
          rationale: "First-in-class triple agonist with unproven mechanism. High risk/high reward profile. Eli Lilly metabolic expertise reduces execution risk. Key question: can triple agonism deliver superior efficacy without tolerability issues?",
          dataAvailableAtTime: ["PK/PD data", "Safety profile", "Mechanism validation", "Preclinical efficacy"]
        },
        {
          phase: "Phase 2",
          date: "Jun 2023",
          trialName: "Phase 2 Obesity Study",
          nctIds: ["NCT04881760"],
          outcome: 'success',
          keyData: [
            "UNPRECEDENTED 24.2% weight loss at highest dose (48 weeks)",
            "Dose-dependent efficacy: 17.5% (4mg) to 24.2% (12mg)",
            "Superior to all approved obesity drugs",
            "100% of participants on highest dose achieved ≥5% weight loss",
            "63% achieved ≥20% weight loss",
            "HbA1c reduction of 2.2% in T2D patients"
          ],
          scoreAtTime: 72,
          rationale: "BREAKTHROUGH Phase 2 results - best-ever weight loss data. 24% weight loss exceeds tirzepatide (~22%). Validates triple agonist approach. Market opportunity massive. GI side effects manageable. Clear path to accelerated Phase 3.",
          dataAvailableAtTime: ["48-week efficacy", "Weight loss data", "Glycemic control", "Safety/tolerability", "Dose-response", "Body composition"]
        },
        {
          phase: "Phase 3 Initiation",
          date: "Q3 2023",
          trialName: "TRIUMPH Program Launch",
          nctIds: ["NCT05929066", "NCT05929079", "NCT06059001"],
          outcome: 'pending',
          keyData: [
            "TRIUMPH-1, TRIUMPH-2, TRIUMPH-3 initiated",
            "Targeting obesity as primary indication",
            "T2D studies also ongoing",
            "~5,000+ patients planned",
            "Cardiovascular outcomes trial planned"
          ],
          scoreAtTime: 75,
          rationale: "Comprehensive Phase 3 program with obesity focus. Exceptional Phase 2 de-risks efficacy. Key focus on demonstrating tolerability at scale. MASH trials also planned. Lilly's tirzepatide success validates pathway. Approval likely 2026-2027.",
          dataAvailableAtTime: ["Full Phase 2", "Trial designs", "MASH opportunity", "CV outcomes strategy"]
        },
        {
          phase: "Current Status",
          date: "Q4 2024",
          trialName: "Phase 3 Ongoing",
          outcome: 'pending',
          keyData: [
            "Phase 3 trials enrolling well",
            "TRIUMPH program on track",
            "MASH Phase 2 showing promise",
            "No unexpected safety signals",
            "Competitive with CagriSema for best-in-class"
          ],
          scoreAtTime: 74,
          rationale: "Phase 3 progressing on schedule. Best-in-class efficacy profile maintained. MASH opportunity adds significant value (no approved therapies). Competition from CagriSema (Novo) intensifying. Filing expected 2026, approval 2027.",
          dataAvailableAtTime: ["Enrollment progress", "Safety monitoring", "MASH data", "Competitive updates"]
        }
      ]
    },
    // VK2735 VENTURE (Injectable)
    {
      id: "VK27-01",
      name: "VK2735 (Injectable)",
      trialName: "VENTURE",
      phase: "Phase III",
      indication: "Obesity",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Viking Therapeutics",
      companyTrackRecord: 'average',
      nctId: "NCT06068946",
      clinicalTrialsSearchTerm: "VK2735",
      scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
      marketData: generateMarketProjections("VK2735 Injectable", "Phase III", "Obesity", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,692,018", title: "Dual GLP-1/GIP receptor agonist peptides", expirationDate: "2042", type: 'composition', status: 'active' },
        { patentNumber: "US11,845,789", title: "Methods of treating obesity with dual agonists", expirationDate: "2043", type: 'method', status: 'active' },
        { patentNumber: "WO2023/076541", title: "Formulations of GLP-1/GIP dual agonists", expirationDate: "2043", type: 'formulation', status: 'active' },
      ],
      regulatoryExclusivity: [
        { type: "NCE Exclusivity (projected)", endDate: "2032" },
        { type: "Pediatric Extension (potential)", endDate: "2032.5" },
      ],
      competitiveLandscape: {
        totalMarketSize: "$130B+",
        projectedGrowth: "25% CAGR",
        keyPlayers: [
          { name: "Tirzepatide (Zepbound)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual agonist", keyDifferentiator: "Best-in-class approved", efficacy: "22.5% weight loss", threat: 'high' },
          { name: "Semaglutide (Wegovy)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1 agonist", keyDifferentiator: "Market leader", efficacy: "15-17% weight loss", threat: 'high' },
          { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "GIP/GLP-1/Glucagon triple", keyDifferentiator: "Triple agonist, superior efficacy", efficacy: "~24% weight loss", threat: 'high' },
          { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "GLP-1 + Amylin", keyDifferentiator: "Combination approach", efficacy: "~25% weight loss", threat: 'high' },
          { name: "Survodutide", company: "Boehringer/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon dual", keyDifferentiator: "MASH focus", efficacy: "~19% weight loss", threat: 'medium' },
        ],
        competitiveAdvantages: [
          "Strong 14.7% weight loss at 13 weeks (Phase 2)",
          "Competitive GIP/GLP-1 dual agonist mechanism",
          "Smaller biotech - potential acquisition target",
          "Both injectable and oral formulations in development",
          "Clean safety profile in Phase 2"
        ],
        competitiveRisks: [
          "Competition from Eli Lilly (tirzepatide, retatrutide)",
          "Novo Nordisk dominant market presence",
          "Limited manufacturing scale vs. big pharma",
          "No CV outcomes data yet",
          "Smaller company commercial reach"
        ],
        marketPositioning: "VK2735 is positioned as a competitive dual GLP-1/GIP agonist with strong Phase 2 efficacy. Viking's smaller size makes it an attractive M&A target for larger pharma seeking obesity pipeline assets. The parallel oral development adds strategic value."
      },
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q2 2022",
          trialName: "First-in-Human Studies",
          nctIds: ["NCT05291468"],
          outcome: 'success',
          keyData: [
            "Dual GLP-1/GIP mechanism validated",
            "Favorable PK profile established",
            "Dose-dependent effects observed",
            "Well-tolerated in healthy volunteers"
          ],
          scoreAtTime: 28,
          rationale: "Early stage dual agonist from small biotech. Novel mechanism with strong preclinical data. Key risk: Viking lacks commercial infrastructure. Potential M&A target if Phase 2 succeeds.",
          dataAvailableAtTime: ["PK/PD data", "Safety profile", "Mechanism validation"]
        },
        {
          phase: "Phase 2",
          date: "Feb 2024",
          trialName: "VENTURE",
          nctIds: ["NCT06068946"],
          outcome: 'success',
          keyData: [
            "14.7% mean weight loss at highest dose (13 weeks)",
            "All doses showed significant weight reduction",
            "88% achieved ≥5% weight loss at highest dose",
            "56% achieved ≥10% weight loss",
            "GI side effects consistent with class",
            "No serious adverse events related to treatment"
          ],
          scoreAtTime: 62,
          rationale: "STRONG Phase 2 results - weight loss competitive with tirzepatide at similar timepoint. Viking stock surged on data. Clear de-risking of efficacy. M&A speculation intensified. Phase 3 VANQUISH program announced.",
          dataAvailableAtTime: ["13-week efficacy", "Weight loss by dose", "Safety/tolerability", "Responder rates"]
        },
        {
          phase: "Phase 3 Initiation",
          date: "Q4 2024",
          trialName: "VANQUISH Program Launch",
          nctIds: ["NCT06625840", "NCT06625853"],
          outcome: 'pending',
          keyData: [
            "VANQUISH-1 and VANQUISH-2 initiated",
            "Targeting obesity as primary indication",
            "~2,000+ patients planned",
            "Results expected 2026",
            "Parallel oral development ongoing"
          ],
          scoreAtTime: 65,
          rationale: "Pivotal Phase 3 program underway with strong Phase 2 foundation. Viking well-capitalized post-data. Key question: can small biotech execute large Phase 3? M&A remains likely outcome. Competitive with big pharma programs.",
          dataAvailableAtTime: ["Full Phase 2", "Trial designs", "Competitive positioning", "Manufacturing plans"]
        },
        {
          phase: "Current Status",
          date: "Q4 2024",
          trialName: "Phase 3 Ongoing",
          outcome: 'pending',
          keyData: [
            "VANQUISH trials enrolling",
            "No unexpected safety signals",
            "Oral formulation Phase 2 ongoing",
            "M&A speculation continues",
            "Strong investor interest"
          ],
          scoreAtTime: 64,
          rationale: "Phase 3 in early stages. Viking's dual approach (injectable + oral) increases strategic value. Competition fierce but market large enough for multiple players. Filing projected 2027, approval 2028.",
          dataAvailableAtTime: ["Enrollment progress", "Safety monitoring", "Oral trial updates"]
        }
      ]
    },
    // VK2735 VENTURE-Oral
    {
      id: "VK27-02",
      name: "VK2735 (Oral)",
      trialName: "VENTURE-Oral",
      phase: "Phase II",
      indication: "Obesity",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Viking Therapeutics",
      companyTrackRecord: 'average',
      nctId: "NCT06828055",
      scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
      marketData: generateMarketProjections("VK2735 Oral", "Phase II", "Obesity", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,692,018", title: "Dual GLP-1/GIP receptor agonist peptides", expirationDate: "2042", type: 'composition', status: 'active' },
        { patentNumber: "US11,912,445", title: "Oral formulations of GLP-1/GIP agonists", expirationDate: "2044", type: 'formulation', status: 'active' },
      ],
      regulatoryExclusivity: [
        { type: "NCE Exclusivity (projected)", endDate: "2033" },
      ],
      competitiveLandscape: {
        totalMarketSize: "$100B+ (oral GLP-1 segment)",
        projectedGrowth: "30% CAGR",
        keyPlayers: [
          { name: "Rybelsus (oral semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1 peptide", keyDifferentiator: "First oral GLP-1", efficacy: "~5% weight loss", threat: 'medium' },
          { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral small molecule GLP-1", keyDifferentiator: "No food restrictions", efficacy: "~15% weight loss", threat: 'high' },
          { name: "Danuglipron", company: "Pfizer", phase: "Discontinued", mechanism: "Oral GLP-1", keyDifferentiator: "Was competitor", threat: 'low' },
          { name: "Amycretin", company: "Novo Nordisk", phase: "Phase II", mechanism: "Oral GLP-1/Amylin", keyDifferentiator: "Combination oral", efficacy: "~13% at 12 weeks", threat: 'high' },
        ],
        competitiveAdvantages: [
          "12.2% weight loss at 13 weeks - best oral Phase 2 data",
          "Dual GLP-1/GIP mechanism in oral form",
          "Strong responder rates (up to 8.8% achieved ≥15% loss)",
          "Successful down-titration maintenance strategy",
          "Viking's parallel injectable success de-risks program"
        ],
        competitiveRisks: [
          "Orforglipron ahead in development (Phase 3)",
          "Rybelsus has first-mover advantage",
          "Higher discontinuation rate vs placebo",
          "Limited long-term data",
          "Manufacturing/formulation complexity"
        ],
        marketPositioning: "VK2735 oral is positioned as a potentially best-in-class oral GLP-1/GIP dual agonist. The 12.2% weight loss at 13 weeks exceeds Rybelsus and approaches injectable-level efficacy. Addresses massive market of patients preferring oral to injectable therapy."
      },
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q3 2023",
          trialName: "Oral Formulation SAD/MAD",
          nctIds: ["NCT05982639"],
          outcome: 'success',
          keyData: [
            "Oral bioavailability established",
            "Once-daily dosing confirmed feasible",
            "Dose-dependent exposure achieved",
            "Acceptable tolerability profile"
          ],
          scoreAtTime: 25,
          rationale: "Early oral formulation with unproven bioavailability. High-risk given oral GLP-1 challenges (Pfizer's danuglipron failed). Viking's injectable success provides some de-risking. Potential game-changer if oral efficacy matches injectable.",
          dataAvailableAtTime: ["PK data", "Oral bioavailability", "Safety"]
        },
        {
          phase: "Phase 2",
          date: "Aug 2025",
          trialName: "VENTURE-Oral Dosing",
          nctIds: ["NCT06828055"],
          outcome: 'success',
          keyData: [
            "12.2% mean weight loss at highest dose (13 weeks)",
            "Dose-dependent response: 6.8% (30mg) to 12.2% (90mg)",
            "Strong responder rates across all doses",
            "Exploratory cohort showed maintenance with down-titration",
            "Generally well tolerated",
            "Higher discontinuation rate than placebo"
          ],
          scoreAtTime: 55,
          rationale: "EXCELLENT oral results - approaching injectable efficacy. 12.2% at 13 weeks is best oral GLP-1 Phase 2 data. Down-titration maintenance strategy adds value. Competitive with orforglipron. Phase 3 VANQUISH-Oral likely.",
          dataAvailableAtTime: ["13-week efficacy", "Dose-response", "Maintenance data", "Safety/tolerability"]
        },
        {
          phase: "Current Status",
          date: "Q4 2024",
          trialName: "Phase 2 Complete / Phase 3 Planning",
          outcome: 'pending',
          keyData: [
            "Phase 2 successfully completed",
            "Phase 3 VANQUISH-Oral program in planning",
            "Regulatory discussions ongoing",
            "Manufacturing scale-up underway",
            "Strong strategic interest from larger pharma"
          ],
          scoreAtTime: 52,
          rationale: "Oral program de-risked with positive Phase 2. Behind injectable in timeline but adds significant portfolio value. Dual formulation strategy enhances M&A attractiveness. Key execution risk: can Viking run two Phase 3 programs simultaneously?",
          dataAvailableAtTime: ["Full Phase 2 data", "Phase 3 planning", "Competitive dynamics"]
        }
      ]
    },
    // 1. ONCOLOGY/HEMATOLOGY
    {
      id: "DATO-01",
      name: "Datopotamab Deruxtecan (Dato-DXd)",
      trialName: "TROPION",
      phase: "Phase III",
      indication: "Non-Small Cell Lung Cancer / Triple-Negative Breast Cancer",
      therapeuticArea: "Oncology/Hematology",
      company: "AstraZeneca/Daiichi Sankyo",
      companyTrackRecord: 'fast',
      nctId: "NCT04656652",
      scores: calculateProbabilityScores("Phase III", "Non-Small Cell Lung Cancer", "Oncology"),
      marketData: generateMarketProjections("Datopotamab Deruxtecan", "Phase III", "Non-Small Cell Lung Cancer", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US10,973,924", title: "TROP2-targeting antibody-drug conjugate", expirationDate: "2038", type: 'composition', status: 'active' },
        { patentNumber: "US11,364,303", title: "Methods of treating NSCLC with ADC", expirationDate: "2039", type: 'method', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$25B+ (ADC market)",
        projectedGrowth: "18% CAGR",
        keyPlayers: [
          { name: "Enhertu (T-DXd)", company: "AstraZeneca/Daiichi Sankyo", phase: "Approved", mechanism: "HER2 ADC", keyDifferentiator: "Same platform, different target", efficacy: "High response rates", threat: 'low' },
          { name: "Trodelvy", company: "Gilead", phase: "Approved", mechanism: "TROP2 ADC", keyDifferentiator: "First-to-market TROP2", efficacy: "~35% ORR in TNBC", threat: 'high' },
        ],
        competitiveAdvantages: ["Novel TROP2 targeting", "Best-in-class payload technology", "Strong AZ/DSC partnership"],
        competitiveRisks: ["Trodelvy has first-mover advantage", "Safety profile concerns with ADCs"],
        marketPositioning: "Next-generation TROP2-targeting ADC with potentially improved safety profile."
      },
      retrospectivePhases: [
        { phase: "Phase 1", date: "Q2 2020", outcome: 'success', keyData: ["TROP2 targeting validated", "Manageable safety"], scoreAtTime: 35, rationale: "Novel ADC with strong platform", dataAvailableAtTime: ["Early efficacy signals"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["TROPION trials ongoing", "Competing with Trodelvy"], scoreAtTime: 58, rationale: "Phase 3 enrollment progressing", dataAvailableAtTime: ["Interim data positive"] }
      ]
    },
    // 2. CARDIOVASCULAR
    {
      id: "ZILE-01",
      name: "Zilebesiran",
      trialName: "KARDIA",
      phase: "Phase III",
      indication: "Hypertension",
      therapeuticArea: "Cardiovascular",
      company: "Alnylam Pharmaceuticals",
      companyTrackRecord: 'fast',
      nctId: "NCT05103332",
      scores: calculateProbabilityScores("Phase III", "Hypertension", "Cardiology"),
      marketData: generateMarketProjections("Zilebesiran", "Phase III", "Hypertension", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,174,472", title: "RNAi targeting angiotensinogen", expirationDate: "2040", type: 'composition', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$30B+ (HTN market)",
        projectedGrowth: "5% CAGR",
        keyPlayers: [
          { name: "ACE Inhibitors/ARBs", company: "Generic", phase: "Approved", mechanism: "RAAS inhibition", keyDifferentiator: "Cheap, proven", efficacy: "Standard care", threat: 'medium' },
          { name: "Leqvio", company: "Novartis", phase: "Approved", mechanism: "siRNA PCSK9", keyDifferentiator: "First CV siRNA", efficacy: "50% LDL reduction", threat: 'low' },
        ],
        competitiveAdvantages: ["Twice-yearly dosing", "Novel mechanism (AGT silencing)", "Addresses non-adherence"],
        competitiveRisks: ["Chronic daily pills are cheap", "New mechanism risk"],
        marketPositioning: "Revolutionary twice-yearly injection for uncontrolled hypertension."
      },
      retrospectivePhases: [
        { phase: "Phase 2", date: "Q1 2023", outcome: 'success', keyData: ["22 mmHg SBP reduction", "6-month durability"], scoreAtTime: 62, rationale: "Strong Phase 2 data", dataAvailableAtTime: ["KARDIA-1 results"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["KARDIA-3 ongoing", "CV outcomes trial"], scoreAtTime: 65, rationale: "Pivotal trials progressing", dataAvailableAtTime: ["Enrollment on track"] }
      ]
    },
    // 3. PSYCHIATRY/MENTAL HEALTH
    {
      id: "EMRA-01",
      name: "Emraclidine (CVL-231)",
      trialName: "EMPOWER",
      phase: "Phase III",
      indication: "Schizophrenia",
      therapeuticArea: "Psychiatry/Mental Health",
      company: "Bristol-Myers Squibb/Cerevel",
      companyTrackRecord: 'fast',
      nctId: "NCT06148129",
      scores: calculateProbabilityScores("Phase III", "Schizophrenia", "Psychiatry"),
      marketData: generateMarketProjections("Emraclidine", "Phase III", "Schizophrenia", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,312,714", title: "Muscarinic M4 receptor agonists", expirationDate: "2041", type: 'composition', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$10B+ (schizophrenia)",
        projectedGrowth: "4% CAGR",
        keyPlayers: [
          { name: "Cobenfy", company: "BMS/Karuna", phase: "Approved", mechanism: "M1/M4 agonist", keyDifferentiator: "First non-D2 mechanism", efficacy: "PANSS -21 points", threat: 'high' },
          { name: "Typical/Atypical Antipsychotics", company: "Generic", phase: "Approved", mechanism: "D2 antagonism", keyDifferentiator: "Standard care", efficacy: "Variable", threat: 'medium' },
        ],
        competitiveAdvantages: ["Selective M4 agonist (cleaner profile)", "No metabolic side effects", "Novel mechanism"],
        competitiveRisks: ["Cobenfy first-to-market", "Psychiatric trials high failure rate"],
        marketPositioning: "Next-gen muscarinic agonist with potentially superior tolerability."
      },
      retrospectivePhases: [
        { phase: "Phase 2", date: "Q3 2023", outcome: 'success', keyData: ["Significant PANSS reduction", "Good tolerability"], scoreAtTime: 55, rationale: "Positive Phase 2 efficacy", dataAvailableAtTime: ["EMPOWER results"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["EMPOWER-2 initiated", "BMS acquisition closed"], scoreAtTime: 58, rationale: "Pivotal trials underway", dataAvailableAtTime: ["Trial designs finalized"] }
      ]
    },
    // 4. IMMUNOLOGY & INFLAMMATION
    {
      id: "RITLE-01",
      name: "Ritlbexbart (SAR441566/ABBV-157)",
      trialName: "TL1A-IBD",
      phase: "Phase III",
      indication: "Ulcerative Colitis / Crohn's Disease",
      therapeuticArea: "Immunology & Inflammation",
      company: "Sanofi/AbbVie",
      companyTrackRecord: 'fast',
      nctId: "NCT05521503",
      scores: calculateProbabilityScores("Phase III", "Ulcerative Colitis", "Immunology"),
      marketData: generateMarketProjections("Ritlbexbart", "Phase III", "Ulcerative Colitis", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$25B+ (IBD market)",
        projectedGrowth: "8% CAGR",
        keyPlayers: [
          { name: "Skyrizi", company: "AbbVie", phase: "Approved", mechanism: "IL-23 inhibitor", keyDifferentiator: "Best-in-class efficacy", efficacy: "50%+ remission", threat: 'high' },
          { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK inhibitor", keyDifferentiator: "Oral option", efficacy: "40%+ remission", threat: 'high' },
        ],
        competitiveAdvantages: ["Dual TL1A targeting", "Novel mechanism", "Strong partnerships"],
        competitiveRisks: ["Crowded IBD market", "AbbVie internal competition"],
        marketPositioning: "First-in-class TL1A inhibitor for IBD with potential best-in-class efficacy."
      },
      retrospectivePhases: [
        { phase: "Phase 2", date: "Q2 2023", outcome: 'success', keyData: ["Strong endoscopic improvement", "Novel TL1A mechanism"], scoreAtTime: 60, rationale: "Compelling Phase 2 data", dataAvailableAtTime: ["IBD efficacy signals"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["Multiple IBD trials ongoing"], scoreAtTime: 62, rationale: "Broad Phase 3 program", dataAvailableAtTime: ["Enrollment progressing"] }
      ]
    },
    // 5. RHEUMATOLOGY
    {
      id: "NIPO-01",
      name: "Nipocalimab",
      trialName: "VIVACITY",
      phase: "Phase III",
      indication: "Myasthenia Gravis / Rheumatoid Arthritis",
      therapeuticArea: "Rheumatology",
      company: "Johnson & Johnson",
      companyTrackRecord: 'fast',
      nctId: "NCT04951622",
      scores: calculateProbabilityScores("Phase III", "Myasthenia Gravis", "Rheumatology"),
      marketData: generateMarketProjections("Nipocalimab", "Phase III", "Myasthenia Gravis", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$5B+ (MG market projected)",
        projectedGrowth: "15% CAGR",
        keyPlayers: [
          { name: "Vyvgart", company: "argenx", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "First FcRn approved", efficacy: "Significant MG improvement", threat: 'high' },
          { name: "Rozanolixizumab", company: "UCB", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "SC administration", efficacy: "Similar to Vyvgart", threat: 'medium' },
        ],
        competitiveAdvantages: ["J&J commercial reach", "Multiple indications", "Convenient dosing"],
        competitiveRisks: ["Late to FcRn market", "Vyvgart dominant"],
        marketPositioning: "FcRn blocker with broad autoimmune disease potential."
      },
      retrospectivePhases: [
        { phase: "Phase 2", date: "Q4 2022", outcome: 'success', keyData: ["IgG reduction >70%", "MG improvement"], scoreAtTime: 52, rationale: "FcRn mechanism validated", dataAvailableAtTime: ["Autoimmune efficacy"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["VIVACITY trials ongoing", "RA expansion"], scoreAtTime: 55, rationale: "Multiple pivotal trials", dataAvailableAtTime: ["Enrollment complete"] }
      ]
    },
    // 6. INFECTIOUS DISEASES
    {
      id: "LENA-01",
      name: "Lenacapavir (Sunlenca)",
      trialName: "PURPOSE",
      phase: "Phase III",
      indication: "HIV Prevention (PrEP)",
      therapeuticArea: "Infectious Diseases",
      company: "Gilead Sciences",
      companyTrackRecord: 'fast',
      nctId: "NCT04994509",
      scores: calculateProbabilityScores("Phase III", "HIV Prevention", "Infectious Disease"),
      marketData: generateMarketProjections("Lenacapavir", "Phase III", "HIV Prevention", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,028,110", title: "Capsid inhibitor compounds", expirationDate: "2039", type: 'composition', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$8B+ (HIV prevention)",
        projectedGrowth: "12% CAGR",
        keyPlayers: [
          { name: "Truvada/Descovy", company: "Gilead", phase: "Approved", mechanism: "Daily oral PrEP", keyDifferentiator: "Established standard", efficacy: "99% effective", threat: 'low' },
          { name: "Apretude", company: "ViiV", phase: "Approved", mechanism: "Injectable q2m", keyDifferentiator: "Long-acting injectable", efficacy: "Similar to oral", threat: 'medium' },
        ],
        competitiveAdvantages: ["Twice-yearly dosing", "100% efficacy in PURPOSE trials", "Novel capsid mechanism"],
        competitiveRisks: ["Pricing pressures", "Generic oral PrEP"],
        marketPositioning: "Revolutionary twice-yearly HIV prevention with 100% efficacy."
      },
      retrospectivePhases: [
        { phase: "Phase 3 PURPOSE-1", date: "Jun 2024", outcome: 'success', keyData: ["100% efficacy in women", "Zero infections vs background rate"], scoreAtTime: 88, rationale: "Unprecedented efficacy", dataAvailableAtTime: ["PURPOSE-1 topline"] },
        { phase: "Phase 3 PURPOSE-2", date: "Oct 2024", outcome: 'success', keyData: ["96% efficacy in MSM/TGW", "Superior to daily Truvada"], scoreAtTime: 92, rationale: "Confirmed across populations", dataAvailableAtTime: ["PURPOSE-2 results"] }
      ]
    },
    // 7. RESPIRATORY/PULMONOLOGY
    {
      id: "DUPI-01",
      name: "Dupilumab (Dupixent)",
      trialName: "BOREAS",
      phase: "Phase III",
      indication: "COPD with Type 2 Inflammation",
      therapeuticArea: "Respiratory/Pulmonology",
      company: "Sanofi/Regeneron",
      companyTrackRecord: 'fast',
      nctId: "NCT03930732",
      scores: calculateProbabilityScores("Phase III", "COPD", "Respiratory"),
      marketData: generateMarketProjections("Dupilumab", "Phase III", "COPD", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$20B+ (COPD market)",
        projectedGrowth: "6% CAGR",
        keyPlayers: [
          { name: "Trelegy/Breztri", company: "GSK/AZ", phase: "Approved", mechanism: "Triple inhaler", keyDifferentiator: "Standard COPD care", efficacy: "Modest improvement", threat: 'medium' },
          { name: "Fasenra", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IL5", keyDifferentiator: "Eosinophilic COPD", efficacy: "Limited data", threat: 'low' },
        ],
        competitiveAdvantages: ["First biologic for COPD", "30% exacerbation reduction", "Large unmet need"],
        competitiveRisks: ["Biomarker selection needed", "High cost vs inhalers"],
        marketPositioning: "First-in-class biologic for Type 2 high COPD patients."
      },
      retrospectivePhases: [
        { phase: "Phase 3 BOREAS", date: "May 2023", outcome: 'success', keyData: ["30% exacerbation reduction", "FEV1 improvement"], scoreAtTime: 82, rationale: "First biologic to show COPD benefit", dataAvailableAtTime: ["BOREAS results"] },
        { phase: "FDA Approval", date: "Sep 2024", outcome: 'success', keyData: ["Approved for COPD", "Type 2 inflammation indication"], scoreAtTime: 95, rationale: "Major label expansion", dataAvailableAtTime: ["Approval secured"] }
      ]
    },
    // 8. GASTROENTEROLOGY & HEPATOLOGY
    {
      id: "EFRU-01",
      name: "Efruxifermin (EFX)",
      trialName: "SYNCHRONY",
      phase: "Phase III",
      indication: "MASH (Metabolic-Associated Steatohepatitis)",
      therapeuticArea: "Gastroenterology & Hepatology",
      company: "Akero Therapeutics",
      companyTrackRecord: 'average',
      nctId: "NCT06161558",
      scores: calculateProbabilityScores("Phase III", "MASH", "Gastroenterology"),
      marketData: generateMarketProjections("Efruxifermin", "Phase III", "MASH", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$40B+ (MASH projected)",
        projectedGrowth: "40% CAGR",
        keyPlayers: [
          { name: "Rezdiffra (resmetirom)", company: "Madrigal", phase: "Approved", mechanism: "THR-β agonist", keyDifferentiator: "First MASH drug approved", efficacy: "26% MASH resolution", threat: 'high' },
          { name: "Tirzepatide", company: "Eli Lilly", phase: "Phase III", mechanism: "GIP/GLP-1", keyDifferentiator: "Weight loss benefit", efficacy: "Strong MASH signals", threat: 'high' },
        ],
        competitiveAdvantages: ["Best-in-class efficacy (50%+ resolution)", "FGF21 mechanism", "Weekly dosing"],
        competitiveRisks: ["Rezdiffra first-mover", "GLP-1s competition"],
        marketPositioning: "Potentially best-in-class MASH therapy with superior histological response."
      },
      retrospectivePhases: [
        { phase: "Phase 2b HARMONY", date: "Q1 2024", outcome: 'success', keyData: ["41% MASH resolution", "Fibrosis improvement"], scoreAtTime: 68, rationale: "Best Phase 2 MASH data", dataAvailableAtTime: ["HARMONY results"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["SYNCHRONY trials initiated", "F2-F3 fibrosis focus"], scoreAtTime: 65, rationale: "Pivotal program underway", dataAvailableAtTime: ["Trial designs"] }
      ]
    },
    // 9. NEPHROLOGY/RENAL
    {
      id: "ATRA-01",
      name: "Atrasentan",
      trialName: "ALIGN",
      phase: "Phase III",
      indication: "IgA Nephropathy",
      therapeuticArea: "Nephrology/Renal",
      company: "Chinook Therapeutics/Novartis",
      companyTrackRecord: 'fast',
      nctId: "NCT04573478",
      scores: calculateProbabilityScores("Phase III", "IgA Nephropathy", "Nephrology"),
      marketData: generateMarketProjections("Atrasentan", "Phase III", "IgA Nephropathy", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$5B+ (IgAN projected)",
        projectedGrowth: "25% CAGR",
        keyPlayers: [
          { name: "Filspari (sparsentan)", company: "Travere", phase: "Approved", mechanism: "Dual ERA/ARB", keyDifferentiator: "First IgAN drug approved", efficacy: "41% proteinuria reduction", threat: 'high' },
          { name: "Tarpeyo", company: "Calliditas", phase: "Approved", mechanism: "Targeted release budesonide", keyDifferentiator: "Oral steroid", efficacy: "34% proteinuria reduction", threat: 'medium' },
        ],
        competitiveAdvantages: ["Superior proteinuria reduction (38%)", "Selective ERA", "Novartis backing"],
        competitiveRisks: ["Filspari first-mover", "Edema management"],
        marketPositioning: "Highly selective endothelin receptor antagonist for renal protection."
      },
      retrospectivePhases: [
        { phase: "Phase 2 AFFINITY", date: "Q3 2023", outcome: 'success', keyData: ["38% proteinuria reduction", "eGFR stabilization"], scoreAtTime: 65, rationale: "Strong Phase 2 efficacy", dataAvailableAtTime: ["AFFINITY results"] },
        { phase: "Phase 3 ALIGN", date: "Q4 2024", outcome: 'pending', keyData: ["ALIGN trial ongoing", "Primary endpoint: eGFR slope"], scoreAtTime: 62, rationale: "Pivotal trial progressing", dataAvailableAtTime: ["Enrollment updates"] }
      ]
    },
    // 10. DERMATOLOGY
    {
      id: "NEMO-01",
      name: "Nemolizumab",
      trialName: "ARCADIA",
      phase: "Phase III",
      indication: "Atopic Dermatitis / Prurigo Nodularis",
      therapeuticArea: "Dermatology",
      company: "Galderma",
      companyTrackRecord: 'average',
      nctId: "NCT05052983",
      scores: calculateProbabilityScores("Phase III", "Atopic Dermatitis", "Dermatology"),
      marketData: generateMarketProjections("Nemolizumab", "Phase III", "Atopic Dermatitis", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$15B+ (AD market)",
        projectedGrowth: "10% CAGR",
        keyPlayers: [
          { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13 blocker", keyDifferentiator: "Market leader", efficacy: "High response rates", threat: 'high' },
          { name: "Rinvoq/Cibinqo", company: "AbbVie/Pfizer", phase: "Approved", mechanism: "JAK inhibitor", keyDifferentiator: "Oral option", efficacy: "Fast onset", threat: 'medium' },
        ],
        competitiveAdvantages: ["IL-31 mechanism (itch focus)", "Monthly dosing", "Prurigo nodularis first-mover"],
        competitiveRisks: ["Dupixent dominant", "Late to AD market"],
        marketPositioning: "First IL-31 blocker targeting itch at source, unique for prurigo nodularis."
      },
      retrospectivePhases: [
        { phase: "Phase 3 ARCADIA", date: "Q2 2024", outcome: 'success', keyData: ["Met primary endpoints", "Significant itch reduction"], scoreAtTime: 72, rationale: "Positive pivotal results", dataAvailableAtTime: ["ARCADIA 1&2 results"] },
        { phase: "FDA Filing", date: "Q4 2024", outcome: 'pending', keyData: ["BLA submitted", "Priority review requested"], scoreAtTime: 78, rationale: "Approval expected 2025", dataAvailableAtTime: ["Regulatory submission"] }
      ]
    },
    // 11. OPHTHALMOLOGY
    {
      id: "TARC-01",
      name: "Tarcocimab Tedromer (OPT-302)",
      trialName: "ShORe",
      phase: "Phase III",
      indication: "Wet Age-Related Macular Degeneration",
      therapeuticArea: "Ophthalmology",
      company: "Opthea Limited",
      companyTrackRecord: 'average',
      nctId: "NCT04757610",
      scores: calculateProbabilityScores("Phase III", "Wet AMD", "Ophthalmology"),
      marketData: generateMarketProjections("Tarcocimab", "Phase III", "Wet AMD", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$12B+ (wet AMD)",
        projectedGrowth: "5% CAGR",
        keyPlayers: [
          { name: "Eylea", company: "Regeneron", phase: "Approved", mechanism: "VEGF-A/PlGF trap", keyDifferentiator: "Market leader", efficacy: "Gold standard", threat: 'high' },
          { name: "Vabysmo", company: "Roche", phase: "Approved", mechanism: "VEGF-A/Ang-2 bispecific", keyDifferentiator: "Extended dosing", efficacy: "Non-inferior to Eylea", threat: 'high' },
        ],
        competitiveAdvantages: ["VEGF-C/D targeting (novel)", "Combination with anti-VEGF-A", "Addresses resistance"],
        competitiveRisks: ["Add-on therapy model", "Injection burden"],
        marketPositioning: "First VEGF-C/D blocker to combine with standard anti-VEGF for superior outcomes."
      },
      retrospectivePhases: [
        { phase: "Phase 2b", date: "Q2 2021", outcome: 'success', keyData: ["+3.4 letter gain vs monotherapy", "Combination benefit proven"], scoreAtTime: 55, rationale: "Combination approach validated", dataAvailableAtTime: ["Phase 2b results"] },
        { phase: "Phase 3 ShORe", date: "Q4 2024", outcome: 'pending', keyData: ["ShORe/COAST trials ongoing", "Primary: BCVA at 52 weeks"], scoreAtTime: 52, rationale: "Pivotal trials in progress", dataAvailableAtTime: ["Enrollment status"] }
      ]
    },
    // 12. RARE DISEASES/ORPHAN DRUGS
    {
      id: "CASG-02",
      name: "Casgevy (Exagamglogene autotemcel)",
      trialName: "CLIMB",
      phase: "Approved/Phase III Expansion",
      indication: "Sickle Cell Disease / Beta Thalassemia",
      therapeuticArea: "Rare Diseases/Orphan Drugs",
      company: "Vertex/CRISPR Therapeutics",
      companyTrackRecord: 'fast',
      nctId: "NCT03745287",
      scores: calculateProbabilityScores("Phase III", "Sickle Cell Disease", "Rare Disease"),
      marketData: generateMarketProjections("Casgevy", "Phase III", "Sickle Cell Disease", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US10,266,850", title: "CRISPR-Cas9 gene editing compositions", expirationDate: "2037", type: 'composition', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$10B+ (SCD/thalassemia)",
        projectedGrowth: "20% CAGR",
        keyPlayers: [
          { name: "Lyfgenia", company: "bluebird bio", phase: "Approved", mechanism: "Lentiviral gene therapy", keyDifferentiator: "First SCD gene therapy", efficacy: "High VOC-free rates", threat: 'medium' },
          { name: "Oxbryta", company: "Pfizer/GBT", phase: "Approved", mechanism: "HbS polymerization inhibitor", keyDifferentiator: "Oral chronic therapy", efficacy: "Modest benefit", threat: 'low' },
        ],
        competitiveAdvantages: ["First CRISPR therapy approved", "One-time curative potential", "95%+ VOC-free"],
        competitiveRisks: ["$2.2M price point", "Manufacturing complexity", "Bone marrow conditioning required"],
        marketPositioning: "First CRISPR gene-editing therapy offering potential functional cure."
      },
      retrospectivePhases: [
        { phase: "Phase 1/2/3", date: "Q4 2023", outcome: 'success', keyData: ["95% VOC-free (SCD)", "Transfusion-independent (thalassemia)"], scoreAtTime: 85, rationale: "Breakthrough efficacy", dataAvailableAtTime: ["Pivotal data"] },
        { phase: "FDA/EMA Approval", date: "Dec 2023", outcome: 'success', keyData: ["First CRISPR therapy approved globally", "Historic regulatory milestone"], scoreAtTime: 95, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch"] }
      ]
    },
    // 13. VACCINES & VIROLOGY
    {
      id: "MRNA-01",
      name: "mRNA-1083 (Flu/COVID Combo)",
      trialName: "FLUENT",
      phase: "Phase III",
      indication: "Influenza + COVID-19 Prevention",
      therapeuticArea: "Vaccines & Virology",
      company: "Moderna",
      companyTrackRecord: 'fast',
      nctId: "NCT06097273",
      scores: calculateProbabilityScores("Phase III", "Influenza Vaccine", "Vaccines"),
      marketData: generateMarketProjections("mRNA-1083", "Phase III", "Influenza Vaccine", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$15B+ (flu + COVID vaccines)",
        projectedGrowth: "8% CAGR",
        keyPlayers: [
          { name: "Fluzone/Flublok", company: "Sanofi", phase: "Approved", mechanism: "Traditional flu vaccine", keyDifferentiator: "Established market", efficacy: "40-60% typical", threat: 'medium' },
          { name: "Comirnaty", company: "Pfizer/BioNTech", phase: "Approved", mechanism: "mRNA COVID", keyDifferentiator: "COVID leader", efficacy: "High against severe disease", threat: 'medium' },
        ],
        competitiveAdvantages: ["Single shot for two diseases", "mRNA platform flexibility", "Convenience"],
        competitiveRisks: ["Vaccine fatigue", "Pricing pressure", "Annual reformulation needed"],
        marketPositioning: "First combination mRNA vaccine for simplified annual respiratory protection."
      },
      retrospectivePhases: [
        { phase: "Phase 1/2", date: "Q2 2023", outcome: 'success', keyData: ["Strong immunogenicity", "Non-inferior to separate vaccines"], scoreAtTime: 62, rationale: "Combo approach validated", dataAvailableAtTime: ["Immunogenicity data"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["Large efficacy trial ongoing", "2025/26 flu season target"], scoreAtTime: 65, rationale: "Pivotal efficacy study", dataAvailableAtTime: ["Enrollment complete"] }
      ]
    },
    // 14. WOMEN'S HEALTH
    {
      id: "FEZO-01",
      name: "Fezolinetant (Veozah)",
      trialName: "SKYLIGHT",
      phase: "Approved/Phase III Expansion",
      indication: "Vasomotor Symptoms (Menopause)",
      therapeuticArea: "Women's Health",
      company: "Astellas Pharma",
      companyTrackRecord: 'average',
      nctId: "NCT04003142",
      scores: calculateProbabilityScores("Phase III", "Menopause", "Women's Health"),
      marketData: generateMarketProjections("Fezolinetant", "Phase III", "Menopause", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$15B+ (menopause)",
        projectedGrowth: "10% CAGR",
        keyPlayers: [
          { name: "Hormone Therapy", company: "Various", phase: "Approved", mechanism: "Estrogen/Progestin", keyDifferentiator: "Gold standard efficacy", efficacy: "70-80% reduction", threat: 'medium' },
          { name: "Brisdelle", company: "Noven", phase: "Approved", mechanism: "SSRI (paroxetine)", keyDifferentiator: "Non-hormonal option", efficacy: "Modest benefit", threat: 'low' },
        ],
        competitiveAdvantages: ["First NK3 receptor antagonist", "Non-hormonal", "Rapid onset"],
        competitiveRisks: ["HRT more effective", "New mechanism long-term safety"],
        marketPositioning: "First-in-class non-hormonal option for women who can't/won't take HRT."
      },
      retrospectivePhases: [
        { phase: "Phase 3 SKYLIGHT", date: "Q1 2023", outcome: 'success', keyData: ["Significant hot flash reduction", "Rapid onset within 1 week"], scoreAtTime: 78, rationale: "Positive pivotal results", dataAvailableAtTime: ["SKYLIGHT 1-4 data"] },
        { phase: "FDA Approval", date: "May 2023", outcome: 'success', keyData: ["First NK3R antagonist approved", "Non-hormonal breakthrough"], scoreAtTime: 92, rationale: "Approval secured", dataAvailableAtTime: ["Commercial launch"] }
      ]
    },
    // 15. UROLOGY
    {
      id: "TALA-01",
      name: "Talazoparib + Enzalutamide",
      trialName: "TALAPRO-2",
      phase: "Phase III",
      indication: "Metastatic Castration-Resistant Prostate Cancer",
      therapeuticArea: "Urology",
      company: "Pfizer",
      companyTrackRecord: 'fast',
      nctId: "NCT04821622",
      scores: calculateProbabilityScores("Phase III", "Prostate Cancer", "Urology"),
      marketData: generateMarketProjections("Talazoparib Combo", "Phase III", "Prostate Cancer", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$20B+ (prostate cancer)",
        projectedGrowth: "8% CAGR",
        keyPlayers: [
          { name: "Lynparza", company: "AstraZeneca", phase: "Approved", mechanism: "PARP inhibitor", keyDifferentiator: "First PARP in prostate", efficacy: "HRR+ patients", threat: 'high' },
          { name: "Xtandi", company: "Pfizer/Astellas", phase: "Approved", mechanism: "AR inhibitor", keyDifferentiator: "Standard of care", efficacy: "Broad mCRPC use", threat: 'low' },
        ],
        competitiveAdvantages: ["PARP + AR combo", "All-comer population", "Strong Phase 3 data"],
        competitiveRisks: ["Toxicity management", "HRR-negative benefit questioned"],
        marketPositioning: "First-line PARP combination expanding benefit beyond HRR+ patients."
      },
      retrospectivePhases: [
        { phase: "Phase 3 TALAPRO-2", date: "Q2 2023", outcome: 'success', keyData: ["37% reduction in progression", "Benefit in all-comers"], scoreAtTime: 75, rationale: "Positive primary endpoint", dataAvailableAtTime: ["TALAPRO-2 results"] },
        { phase: "FDA Approval", date: "Jun 2023", outcome: 'success', keyData: ["Approved for mCRPC", "All-comer indication"], scoreAtTime: 90, rationale: "Approval achieved", dataAvailableAtTime: ["Label secured"] }
      ]
    },
    // 16. PAIN MANAGEMENT/ANESTHESIA
    {
      id: "SUZE-01",
      name: "Suzetrigine (VX-548)",
      trialName: "REEF",
      phase: "Phase III",
      indication: "Acute Pain (Post-surgical)",
      therapeuticArea: "Pain Management/Anesthesia",
      company: "Vertex Pharmaceuticals",
      companyTrackRecord: 'fast',
      nctId: "NCT05660941",
      scores: calculateProbabilityScores("Phase III", "Acute Pain", "Pain Management"),
      marketData: generateMarketProjections("Suzetrigine", "Phase III", "Acute Pain", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US11,174,244", title: "Nav1.8 inhibitor compounds", expirationDate: "2040", type: 'composition', status: 'active' },
      ],
      competitiveLandscape: {
        totalMarketSize: "$10B+ (acute pain)",
        projectedGrowth: "6% CAGR",
        keyPlayers: [
          { name: "Opioids", company: "Generic", phase: "Approved", mechanism: "Opioid receptor", keyDifferentiator: "Highly effective", efficacy: "Gold standard", threat: 'medium' },
          { name: "NSAIDs", company: "Generic", phase: "Approved", mechanism: "COX inhibition", keyDifferentiator: "Safe, mild-moderate pain", efficacy: "Limited", threat: 'low' },
        ],
        competitiveAdvantages: ["Non-opioid mechanism", "No addiction potential", "Nav1.8 selective"],
        competitiveRisks: ["Mixed Phase 2 results", "May not match opioid efficacy"],
        marketPositioning: "First non-opioid option for moderate-severe acute pain."
      },
      retrospectivePhases: [
        { phase: "Phase 2", date: "Q1 2023", outcome: 'partial', keyData: ["Abdominoplasty: significant benefit", "Bunionectomy: missed endpoint"], scoreAtTime: 45, rationale: "Mixed Phase 2 results", dataAvailableAtTime: ["Two Phase 2 trials"] },
        { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["REEF-1 ongoing", "Acute pain focus"], scoreAtTime: 52, rationale: "Pivotal program continues", dataAvailableAtTime: ["Ongoing enrollment"] }
      ]
    },
    // 17. TRANSPLANTATION & CELL/GENE THERAPY
    {
      id: "LOVO-01",
      name: "Lovotibeglogene autotemcel (Lovo-cel)",
      trialName: "HGB-206",
      phase: "Phase III",
      indication: "Sickle Cell Disease",
      therapeuticArea: "Transplantation & Cell/Gene Therapy",
      company: "bluebird bio",
      companyTrackRecord: 'average',
      nctId: "NCT04293185",
      scores: calculateProbabilityScores("Phase III", "Sickle Cell Disease", "Gene Therapy"),
      marketData: generateMarketProjections("Lovo-cel", "Phase III", "Sickle Cell Disease", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$10B+ (SCD gene therapy)",
        projectedGrowth: "25% CAGR",
        keyPlayers: [
          { name: "Casgevy", company: "Vertex/CRISPR", phase: "Approved", mechanism: "CRISPR gene editing", keyDifferentiator: "First CRISPR therapy", efficacy: "95%+ VOC-free", threat: 'high' },
          { name: "Oxbryta", company: "Pfizer", phase: "Approved", mechanism: "Anti-sickling agent", keyDifferentiator: "Oral option", efficacy: "Modest benefit", threat: 'low' },
        ],
        competitiveAdvantages: ["One-time curative", "Different mechanism than Casgevy", "88% VOC-free"],
        competitiveRisks: ["Casgevy competition", "Manufacturing challenges", "AML concerns (resolved)"],
        marketPositioning: "Lentiviral gene addition therapy as alternative to gene editing approach."
      },
      retrospectivePhases: [
        { phase: "Phase 1/2", date: "Q3 2022", outcome: 'success', keyData: ["88% VOC-free", "Sustained HbAT87Q expression"], scoreAtTime: 72, rationale: "Strong efficacy data", dataAvailableAtTime: ["Long-term follow-up"] },
        { phase: "FDA Approval (Lyfgenia)", date: "Dec 2023", outcome: 'success', keyData: ["Approved as Lyfgenia", "Same day as Casgevy"], scoreAtTime: 88, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch"] }
      ]
    },
    // 18. PEDIATRICS (Cross-cutting)
    {
      id: "VILT-PED-01",
      name: "Viltolarsen (Viltepso)",
      phase: "Phase III",
      indication: "Duchenne Muscular Dystrophy (Exon 53)",
      therapeuticArea: "Pediatrics",
      company: "NS Pharma/Nippon Shinyaku",
      companyTrackRecord: 'average',
      nctId: "NCT04060199",
      scores: calculateProbabilityScores("Phase III", "Duchenne Muscular Dystrophy", "Rare Disease"),
      marketData: generateMarketProjections("Viltolarsen", "Phase III", "Duchenne Muscular Dystrophy", 'average'),
      overallScore: 0,
      hasRetrospective: true,
      competitiveLandscape: {
        totalMarketSize: "$3B+ (DMD)",
        projectedGrowth: "15% CAGR",
        keyPlayers: [
          { name: "Elevidys", company: "Sarepta", phase: "Approved", mechanism: "Gene therapy", keyDifferentiator: "One-time treatment", efficacy: "Micro-dystrophin expression", threat: 'high' },
          { name: "Exondys 51", company: "Sarepta", phase: "Approved", mechanism: "Exon 51 skipping", keyDifferentiator: "First ASO for DMD", efficacy: "Dystrophin increase", threat: 'medium' },
        ],
        competitiveAdvantages: ["Higher exon skipping efficiency", "Weekly IV dosing", "Japanese heritage advantage"],
        competitiveRisks: ["Elevidys gene therapy competition", "Limited long-term data"],
        marketPositioning: "Best-in-class exon 53 skipping antisense therapy for DMD."
      },
      retrospectivePhases: [
        { phase: "Accelerated Approval", date: "Aug 2020", outcome: 'success', keyData: ["Dystrophin production increase", "Accelerated approval granted"], scoreAtTime: 65, rationale: "Early approval pathway", dataAvailableAtTime: ["Phase 2 data"] },
        { phase: "Confirmatory Phase 3 RACER53", date: "Q4 2024", outcome: 'pending', keyData: ["Functional endpoints study", "North Star Ambulatory Assessment"], scoreAtTime: 68, rationale: "Confirmatory trial ongoing", dataAvailableAtTime: ["Enrollment complete"] }
      ]
    },
    {
      id: "EVOKE-01",
      name: "Semaglutide",
      phase: "Phase III",
      indication: "Alzheimer's Disease",
      therapeuticArea: "Neurology",
      company: "Novo Nordisk",
      companyTrackRecord: 'fast',
      isFailed: true,
      trialName: "EVOKE & EVOKE+",
      nctId: "NCT04777396",
      clinicalTrialsSearchTerm: "semaglutide alzheimer",
      scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology", true),
      marketData: generateMarketProjections("Semaglutide", "Phase III", "Alzheimer's Disease", 'fast', true),
      overallScore: 0,
    },
    {
      id: "ICODEC-01",
      name: "Insulin Icodec (Kyinsu/Awiqli)",
      trialName: "ONWARDS",
      phase: "Approved (EU/CN)",
      indication: "Type 2 Diabetes",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Novo Nordisk",
      companyTrackRecord: 'fast',
      nctId: "NCT03496519",
      clinicalTrialsSearchTerm: "insulin icodec",
      scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
      marketData: generateMarketProjections("Insulin Icodec", "Phase III", "Type 2 Diabetes", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q4 2017",
          trialName: "First-in-Human PK/PD Studies",
          nctIds: ["NCT02964104"],
          outcome: 'success',
          keyData: [
            "Half-life of ~196 hours confirmed (vs ~12h for glargine)",
            "Once-weekly dosing feasibility established",
            "Strong albumin binding mechanism validated",
            "Favorable safety profile in healthy volunteers"
          ],
          scoreAtTime: 35,
          rationale: "Early stage with novel mechanism. Base Phase I success rate ~63% for metabolic. Novo Nordisk strong track record in insulin development. Key innovation: strong albumin binding extends half-life. Risk: first-in-class weekly insulin, unproven therapeutic index.",
          dataAvailableAtTime: ["PK/PD data", "Safety profile", "Mechanism validation", "Preclinical data"]
        },
        {
          phase: "Phase 2",
          date: "Q2 2020",
          trialName: "Multiple Dose-Finding & Titration Studies",
          nctIds: ["NCT03496519", "NCT03751657"],
          outcome: 'success',
          keyData: [
            "HbA1c reduction comparable to daily insulin glargine U100",
            "Non-inferior glycemic control demonstrated",
            "Hypoglycemia rates acceptable vs comparator",
            "Optimal dosing algorithm established",
            "Patient adherence signal positive with weekly dosing"
          ],
          scoreAtTime: 52,
          rationale: "Strong Phase 2 data with non-inferiority demonstrated. Historic Phase II→III success rate in metabolic ~68%. Clear differentiation: weekly vs daily dosing addresses adherence. Hypoglycemia profile acceptable. Commercial potential validated - large T2D market.",
          dataAvailableAtTime: ["HbA1c efficacy", "Hypoglycemia rates", "Dose-response", "16-26 week data", "Titration algorithms"]
        },
        {
          phase: "Phase 3a (ONWARDS 1 & 3)",
          date: "Jul 2022",
          trialName: "ONWARDS 1 & ONWARDS 3",
          nctIds: ["NCT04460885", "NCT04795531"],
          outcome: 'success',
          keyData: [
            "ONWARDS 1: Superior HbA1c reduction vs glargine U100 (-1.55% vs -1.35%, p<0.001)",
            "ONWARDS 3: Superior vs degludec in insulin-naïve patients (-1.57% vs -1.36%)",
            "Time in range improvements demonstrated",
            "Hypoglycemia rates comparable to daily insulin",
            "1,085 patients (ONWARDS 1), 588 patients (ONWARDS 3)"
          ],
          scoreAtTime: 71,
          rationale: "Two pivotal Phase 3 trials showing SUPERIORITY (not just non-inferiority). Historic Phase III→Approval rate ~58% for metabolic, but superiority data significantly de-risks. Clear efficacy advantage with convenience benefit. Regulatory pathway looks favorable - unmet need for adherence solutions.",
          dataAvailableAtTime: ["Pivotal efficacy", "52-week safety", "Superiority vs SOC", "Large patient cohorts", "Time-in-range data"]
        },
        {
          phase: "Phase 3a (ONWARDS 5)",
          date: "Oct 2022",
          trialName: "ONWARDS 5 (with Dosing App)",
          nctIds: ["NCT04848480"],
          outcome: 'success',
          keyData: [
            "Superior HbA1c reduction with dosing guide app vs daily insulin",
            "Digital health integration demonstrated",
            "Real-world applicability enhanced",
            "Patient-reported outcomes positive"
          ],
          scoreAtTime: 75,
          rationale: "Third positive Phase 3 result. Digital companion app adds differentiation. Full ONWARDS program (6 trials) progressing well. Approval probability now high given consistent superiority across populations. EU filing expected.",
          dataAvailableAtTime: ["ONWARDS 1-5 results", "Digital health data", "PRO data", "Safety database"]
        },
        {
          phase: "Phase 3b (ONWARDS 6 - Type 1)",
          date: "Q3 2023",
          trialName: "ONWARDS 6 (Type 1 Diabetes)",
          nctIds: ["NCT04848493"],
          outcome: 'partial',
          keyData: [
            "Non-inferior HbA1c reduction in T1D",
            "Higher hypoglycemia rates than daily insulin noted",
            "T1D indication more complex than T2D",
            "Weekly dosing less flexible for T1D insulin adjustments"
          ],
          scoreAtTime: 72,
          rationale: "T1D results mixed - non-inferiority met but hypoglycemia signal. Score slight decrease as T1D indication less clean. T2D indication remains strong. Regulatory strategy likely to prioritize T2D first. Overall program still very positive.",
          dataAvailableAtTime: ["Full ONWARDS 1-6", "T1D vs T2D comparison", "Complete safety database", "Regulatory submissions initiated"]
        },
        {
          phase: "EU Approval",
          date: "Apr 2024",
          trialName: "EMA Approval (Awiqli)",
          outcome: 'success',
          keyData: [
            "First once-weekly insulin approved globally",
            "Approved for Type 2 Diabetes in EU",
            "Commercial launch initiated in Europe",
            "Positive CHMP opinion received"
          ],
          scoreAtTime: 88,
          rationale: "EU approval achieved - major regulatory milestone. First-to-market globally for weekly insulin. Score reflects near-certain T2D approval pathway. US/FDA filing reviewed. China approval also expected. Commercial potential fully validated.",
          dataAvailableAtTime: ["EU approval", "Commercial launch data", "Post-marketing commitments", "Pricing negotiations"]
        },
        {
          phase: "FDA CRL",
          date: "Jul 2024",
          trialName: "FDA Complete Response Letter",
          outcome: 'setback',
          keyData: [
            "CRL issued citing manufacturing process questions",
            "T1D indication questions raised",
            "No new clinical trials required",
            "Resubmission pathway clear",
            "NOT a safety or efficacy concern"
          ],
          scoreAtTime: 78,
          rationale: "FDA CRL is setback but manageable. Manufacturing CMC issues, NOT efficacy/safety. T1D indication complexity noted. EU approval provides validation. Score reduced but US approval still likely with resubmission. Timeline delay ~12-18 months.",
          dataAvailableAtTime: ["FDA CRL details", "Manufacturing concerns", "EU approval validation", "China approval (Kyinsu)", "Resubmission strategy"]
        },
        {
          phase: "FDA Resubmission",
          date: "Sep 2025",
          trialName: "BLA Resubmission to FDA",
          outcome: 'pending',
          keyData: [
            "Manufacturing process concerns addressed",
            "T2D-only indication in resubmission",
            "PDUFA date expected H1 2026",
            "Real-world EU/China data available"
          ],
          scoreAtTime: 82,
          rationale: "Resubmission filed with addressed CMC issues. T2D-focused approach simplifies review. Real-world data from EU/China supportive. High probability of US approval in 2026. Score reflects reduced regulatory risk with clear pathway forward.",
          dataAvailableAtTime: ["Resubmission package", "CMC resolution", "Real-world evidence", "Competitor landscape", "2+ years commercial data (EU)"]
        }
      ]
    },
    {
      id: "TRONT-01",
      name: "Trontinemab (RO7126209)",
      phase: "Phase III",
      indication: "Alzheimer's Disease",
      therapeuticArea: "Neurology/CNS",
      company: "Hoffmann-La Roche",
      companyTrackRecord: 'fast',
      nctId: "NCT04639050",
      scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology"),
      marketData: generateMarketProjections("Trontinemab", "Phase III", "Alzheimer's Disease", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US10,562,973", title: "Brain shuttle anti-amyloid antibody constructs", expirationDate: "2037", type: 'composition', status: 'active', notes: "Core brain shuttle technology" },
        { patentNumber: "US11,267,878", title: "Transferrin receptor binding for CNS delivery", expirationDate: "2038", type: 'method', status: 'active' },
        { patentNumber: "US11,498,960", title: "Anti-amyloid beta antibody formulations for CNS", expirationDate: "2039", type: 'formulation', status: 'active' },
        { patentNumber: "EP3271391", title: "Bispecific antibodies with brain shuttle module", expirationDate: "2036", type: 'composition', status: 'active' },
      ],
      regulatoryExclusivity: [
        { type: "Biologic Exclusivity (projected)", endDate: "2038" },
        { type: "Orphan Drug (potential - early AD)", endDate: "2039" },
        { type: "Breakthrough Therapy (potential)", endDate: "N/A" },
      ],
      competitiveLandscape: {
        totalMarketSize: "$15B+ (projected 2030)",
        projectedGrowth: "35% CAGR",
        keyPlayers: [
          { name: "Lecanemab (Leqembi)", company: "Eisai/Biogen", phase: "Approved", mechanism: "Anti-amyloid antibody", keyDifferentiator: "First-to-market with cognitive benefit", efficacy: "27% slowing of decline", threat: 'high' },
          { name: "Donanemab (Kisunla)", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-amyloid antibody", keyDifferentiator: "Treatment completion possible, faster clearance", efficacy: "35% slowing of decline", threat: 'high' },
          { name: "Gantenerumab", company: "Roche", phase: "Discontinued", mechanism: "Anti-amyloid antibody", keyDifferentiator: "Failed Phase 3 - parent molecule of trontinemab", efficacy: "N/A", threat: 'low' },
          { name: "Remternetug", company: "Eli Lilly", phase: "Phase III", mechanism: "Anti-pyroglutamate amyloid", keyDifferentiator: "Monthly dosing, lower ARIA", efficacy: "TBD", threat: 'medium' },
          { name: "ALZ-801", company: "Alzheon", phase: "Phase III", mechanism: "Oral anti-amyloid", keyDifferentiator: "Oral administration, APOE4 focus", efficacy: "TBD", threat: 'low' },
        ],
        competitiveAdvantages: [
          "Brain Shuttle™ technology - 10x higher brain penetration",
          "91% amyloid PET negativity (vs 68% lecanemab, 84% donanemab)",
          "ARIA-E <5% (vs 12.6% lecanemab, 24% donanemab) - major safety advantage",
          "Potential for lower dose/less frequent dosing due to brain shuttle",
          "Rapid amyloid clearance in 7 months",
          "Roche diagnostics synergy for patient identification"
        ],
        competitiveRisks: [
          "Late to market - lecanemab/donanemab already approved",
          "Parent molecule gantenerumab failed Phase 3",
          "Alzheimer's market has high Phase 3 failure rate",
          "Reimbursement challenges in AD space",
          "Cognitive benefit data still pending (Phase 3)",
          "Complex manufacturing of bispecific antibody"
        ],
        marketPositioning: "Trontinemab is positioned as a next-generation anti-amyloid antibody with superior brain penetration via Brain Shuttle™ technology. Key differentiator: potentially best-in-class safety profile with ARIA-E <5% while achieving faster/more complete amyloid clearance. Target patients: those concerned about ARIA risk, especially APOE4 carriers who face highest ARIA risk with current therapies."
      },
      retrospectivePhases: [
        {
          phase: "Preclinical/Phase 1a",
          date: "Q4 2020",
          trialName: "First-in-Human Brain Shuttle Studies",
          nctIds: ["NCT04639050"],
          outcome: 'success',
          keyData: [
            "Brain Shuttle™ technology validated in humans",
            "10-fold higher brain exposure vs conventional antibodies",
            "Transferrin receptor-mediated transcytosis confirmed",
            "Favorable safety profile established",
            "Dose-dependent amyloid reduction observed"
          ],
          scoreAtTime: 22,
          rationale: "Novel platform technology with first-in-human validation. Parent molecule gantenerumab failed, but brain shuttle approach addresses key limitation (brain penetration). High risk given AD field's 99% failure rate. Roche commitment significant despite gantenerumab failure.",
          dataAvailableAtTime: ["PK/PD data", "Brain penetration confirmation", "Preclinical amyloid clearance", "Safety profile"]
        },
        {
          phase: "Phase 1b/2a",
          date: "Q3 2023",
          trialName: "BrainShuttle AD Study (Multiple Ascending Dose)",
          nctIds: ["NCT04639050"],
          outcome: 'success',
          keyData: [
            "76% amyloid PET negative at interim (12 months)",
            "ARIA-E incidence remarkably low (<5%)",
            "Dose-dependent amyloid clearance",
            "Brain shuttle mechanism validated at scale",
            "Favorable tolerability vs competitors"
          ],
          scoreAtTime: 38,
          rationale: "Exceptional Phase 1b/2a data - 76% amyloid clearance with only 5% ARIA-E is BEST-IN-CLASS safety. Lecanemab has 12.6% ARIA-E, donanemab ~24%. This addresses biggest barrier to AD immunotherapy adoption. Score increased significantly despite AD field challenges.",
          dataAvailableAtTime: ["Amyloid PET data", "ARIA incidence", "Safety/tolerability", "Dose selection"]
        },
        {
          phase: "Phase 1b/2a Update",
          date: "Jul 2024",
          trialName: "BrainShuttle AD - Extended Follow-up",
          nctIds: ["NCT04639050"],
          outcome: 'success',
          keyData: [
            "91% amyloid PET negativity achieved",
            "ARIA-E maintained at <5%",
            "Rapid clearance - most patients negative by 7 months",
            "Biomarker improvements (pTau, NfL) observed",
            "Cognitive outcomes data collection ongoing"
          ],
          scoreAtTime: 48,
          rationale: "91% amyloid clearance with <5% ARIA-E is remarkable. Faster clearance than competitors with dramatically better safety. Key question remains: will biomarker benefits translate to cognitive improvement? Phase 3 design critical. Score reflects best-in-class biomarker profile.",
          dataAvailableAtTime: ["18-month biomarker data", "Complete ARIA profile", "pTau/NfL trends", "Competitive landscape updates"]
        },
        {
          phase: "Phase 3 Initiation",
          date: "Q3 2025",
          trialName: "TRONTIER Program Launch",
          nctIds: ["NCT07170150"],
          outcome: 'pending',
          keyData: [
            "TRONTIER 1 & TRONTIER 2 Phase 3 studies initiated",
            "Targeting early symptomatic Alzheimer's disease",
            "Primary endpoint: clinical (cognitive) outcomes",
            "~2,000+ patients planned across program",
            "Results expected 2027-2028"
          ],
          scoreAtTime: 52,
          rationale: "Phase 3 initiation with best-in-class safety/biomarker profile. Key risk: must demonstrate cognitive benefit (gantenerumab failed this). ARIA advantage significant for APOE4 carriers. Competitive timing - 3rd/4th to market if approved. Differentiated safety profile could capture significant share.",
          dataAvailableAtTime: ["Full Phase 2 biomarkers", "Phase 3 designs", "Competitive approvals", "ARIA comparison data", "Patient selection criteria"]
        },
        {
          phase: "Current Status",
          date: "Q4 2024",
          trialName: "TRONTIER Phase 3 Enrolling",
          outcome: 'pending',
          keyData: [
            "Phase 3 enrollment initiated",
            "Brain Shuttle platform validated",
            "Best-in-class safety profile maintained",
            "Roche committed to AD despite past failures",
            "Diagnostics integration for patient selection"
          ],
          scoreAtTime: 52,
          rationale: "Strong biomarker and safety data support Phase 3. Key uncertainty: cognitive efficacy in Phase 3 (AD field has 99% failure rate). ARIA safety advantage significant - could enable treatment of high-risk APOE4 patients excluded from competitors. Filing projected 2028, approval 2029 if successful.",
          dataAvailableAtTime: ["Enrollment progress", "Safety monitoring", "Competitive developments", "Diagnostic biomarker integration"]
        }
      ]
    },
  ];

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
      {/* Header with Yellow Bar */}
      <header className="sticky top-0 z-10 w-full">
        <div className="bg-[#F5D547] w-full">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={bioquillLogo} alt="BiOQUILL" className="h-16 w-auto object-contain" />
              </div>
              <nav className="flex items-center gap-4">
                {/* Molecule Comparison Popover */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                      <Target className="h-4 w-4 mr-2" />
                      Compare Molecules
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[800px] p-0" align="end">
                    <MoleculeComparison molecules={allMolecules} />
                  </PopoverContent>
                </Popover>
                <Link to="/pricing">
                  <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Pricing
                  </Button>
                </Link>
                <Link to="/methodology">
                  <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                    <Brain className="h-4 w-4 mr-2" />
                    Methodology
                  </Button>
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                      {(searchQuery || phaseFilter !== 'all') && (
                        <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs bg-white/20">
                          {[searchQuery ? '1' : '', phaseFilter !== 'all' ? '1' : ''].filter(Boolean).length}
                        </Badge>
                      )}
                    </Button>
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Export to Excel
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="grid gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="justify-start"
                            onClick={() => exportMoleculesToExcel(allMolecules)}
                          >
                            All Molecule Data
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="justify-start"
                            onClick={() => exportLPIDetailedToExcel(allMolecules)}
                          >
                            LPI Detailed Scores
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="justify-start"
                            onClick={() => exportTherapeuticAreaSummary(allMolecules)}
                          >
                            TA Summary
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                <PTRSCalculator />
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
