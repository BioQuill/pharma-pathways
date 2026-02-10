import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  BarChart3,
  Calculator,
  Info,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Users,
  Globe,
  Pill,
  ShieldCheck,
  Zap,
  ArrowUp,
  ArrowDown,
  Activity,
  TrendingDown,
  Award,
  Shuffle,
  FileText,
  Layers
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type MoleculeProfile } from "@/lib/moleculesData";
import { 
  calculatePeakSalesIndex,
  calculateBlockbusterProbability,
  getPeakSalesScoreColor,
  getPeakSalesScoreBgColor,
  getConfidenceColor,
  COMPONENT_WEIGHTS,
  PATIENT_POPULATION_SCORES,
  GEOGRAPHIC_REACH_SCORES,
  MARKET_GROWTH_SCORES,
  CLINICAL_BONUSES,
  CLINICAL_PENALTIES,
  CONVENIENCE_SCORES,
  BRAND_STRENGTH_SCORES,
  HCP_ACCEPTANCE_SCORES,
  TREATMENT_LINE_SCORES,
  COMBINATION_SCORES,
  LABEL_BREADTH_SCORES,
  LIFECYCLE_SCORES,
  COMPETITOR_QUALITY_MULTIPLIERS,
  MARKET_SATURATION_SCORES,
  COMPETITIVE_DIFFERENTIATION_BONUSES,
  VALUE_PROPOSITION_SCORES,
  TA_BENCHMARKS,
  SENSITIVITY_FACTORS,
  PROBABILITY_TABLE,
  type ComponentScore,
  type PeakSalesResult
} from "@/lib/peakSalesIndex";
import MonteCarloSimulation from "./MonteCarloSimulation";
import MonteCarloComparison from "./MonteCarloComparison";
import PeakSalesPDFReport from "./PeakSalesPDFReport";

// List of 20 Therapeutic Areas
const THERAPEUTIC_AREAS = [
  "ONCOLOGY/HEMATOLOGY",
  "CARDIOVASCULAR",
  "NEUROLOGY/CNS",
  "PSYCHIATRY/MENTAL HEALTH",
  "IMMUNOLOGY & INFLAMMATION",
  "RHEUMATOLOGY",
  "INFECTIOUS DISEASES",
  "RESPIRATORY/PULMONOLOGY",
  "GASTROENTEROLOGY & HEPATOLOGY",
  "NEPHROLOGY/RENAL",
  "DERMATOLOGY",
  "OPHTHALMOLOGY",
  "RARE DISEASES/ORPHAN",
  "VACCINES & VIROLOGY",
  "WOMEN'S HEALTH",
  "UROLOGY",
  "PAIN MANAGEMENT/ANESTHESIA",
  "TRANSPLANT/CELL-GENE",
  "PEDIATRICS",
  "ENDOCRINOLOGY & METABOLISM",
];

// Helper functions
const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-600";
};

const getScoreBgColor = (score: number): string => {
  if (score >= 80) return "bg-green-100 border-green-500";
  if (score >= 60) return "bg-yellow-100 border-yellow-500";
  if (score >= 40) return "bg-orange-100 border-orange-500";
  return "bg-red-100 border-red-500";
};

interface PeakSalesCalculatorProps {
  molecules: MoleculeProfile[];
}

// Peak Sales Calculator Component
const PeakSalesCalculator = ({ molecules }: PeakSalesCalculatorProps) => {
  const [selectedTA, setSelectedTA] = useState<string>("all");
  const [selectedMolecule, setSelectedMolecule] = useState<string>("custom");

  // Filter molecules by selected TA
  const filteredMolecules = selectedTA && selectedTA !== "all"
    ? molecules.filter(m => m.therapeuticArea.toUpperCase().includes(selectedTA.split("/")[0]) || 
                            m.therapeuticArea.toUpperCase().includes(selectedTA.split("&")[0].trim()))
    : molecules;

  // Component 1: Base Market Size (Weight: 25%)
  const [patientPopulation, setPatientPopulation] = useState("large");
  const [geographicReach, setGeographicReach] = useState("global");
  const [marketGrowth, setMarketGrowth] = useState("growing");

  // Component 2: Clinical Success Factor (Weight: 20%)
  const [efficacyVsSoC, setEfficacyVsSoC] = useState([70]);
  const [safetyProfile, setSafetyProfile] = useState([70]);
  const [clinicalDifferentiation, setClinicalDifferentiation] = useState([70]);
  const [evidenceQuality, setEvidenceQuality] = useState([80]);
  const [isFirstInClass, setIsFirstInClass] = useState(false);
  const [hasBreakthroughDesignation, setHasBreakthroughDesignation] = useState(false);
  const [hasOrphanDesignation, setHasOrphanDesignation] = useState(false);
  const [hasAcceleratedApproval, setHasAcceleratedApproval] = useState(false);

  // Component 3: Commercial Advantage (Weight: 18%)
  const [convenience, setConvenience] = useState([70]);
  const [brandStrength, setBrandStrength] = useState([60]);
  const [hcpAcceptance, setHcpAcceptance] = useState([70]);
  const [patientPreference, setPatientPreference] = useState([70]);

  // Component 4: Strategic Positioning (Weight: 15%)
  const [treatmentLine, setTreatmentLine] = useState("firstLineAlternative");
  const [combinationPotential, setCombinationPotential] = useState("synergistic");
  const [labelBreadth, setLabelBreadth] = useState("multiple");
  const [lifeCycleManagement, setLifeCycleManagement] = useState("pipeline");

  // Component 5: Competitive Intensity (Weight: 12%)
  const [approvedCompetitors, setApprovedCompetitors] = useState([3]);
  const [phaseIIICompetitors, setPhaseIIICompetitors] = useState([2]);
  const [phaseIICompetitors, setPhaseIICompetitors] = useState([1]);
  const [competitorQuality, setCompetitorQuality] = useState("mixed");
  const [hasUniqueMOA, setHasUniqueMOA] = useState(true);
  const [hasSuperiorEfficacy, setHasSuperiorEfficacy] = useState(false);
  const [hasBetterSafety, setHasBetterSafety] = useState(false);
  const [hasConvenienceAdvantage, setHasConvenienceAdvantage] = useState(false);

  // Component 6: Market Access (Weight: 10%)
  const [payerCoverage, setPayerCoverage] = useState([85]);
  const [reimbursementSpeed, setReimbursementSpeed] = useState([80]);
  const [formularyPosition, setFormularyPosition] = useState([85]);
  const [priorAuthBurden, setPriorAuthBurden] = useState([90]);
  const [hasHealthEconomicAdvantage, setHasHealthEconomicAdvantage] = useState(false);
  const [hasPatientAssistance, setHasPatientAssistance] = useState(false);

  // Component 7: Pricing Power (Weight: 10%)
  const [therapeuticValue, setTherapeuticValue] = useState("major");
  const [isOrphanDrug, setIsOrphanDrug] = useState(false);
  const [avoidsHospitalizations, setAvoidsHospitalizations] = useState(true);
  const [hasGenericCompetition, setHasGenericCompetition] = useState(false);
  const [hasBiosimilarCompetition, setHasBiosimilarCompetition] = useState(false);

  // Pre-populate parameters when a molecule is selected
  useEffect(() => {
    if (selectedMolecule && selectedMolecule !== "custom") {
      const molecule = molecules.find(m => m.id === selectedMolecule);
      if (molecule) {
        const matchingTA = THERAPEUTIC_AREAS.find(ta => 
          molecule.therapeuticArea.toUpperCase().includes(ta.split("/")[0]) ||
          molecule.therapeuticArea.toUpperCase().includes(ta.split("&")[0].trim())
        );
        if (matchingTA && selectedTA === "all") {
          setSelectedTA(matchingTA);
        }

        if (molecule.phase === "Approved") {
          setEvidenceQuality([95]);
          setHcpAcceptance([85]);
        } else if (molecule.phase.includes("Phase III")) {
          setEvidenceQuality([75]);
          setHcpAcceptance([65]);
        } else if (molecule.phase.includes("Phase II")) {
          setEvidenceQuality([55]);
          setHcpAcceptance([50]);
        }

        if (molecule.therapeuticArea.toLowerCase().includes("rare") || 
            molecule.therapeuticArea.toLowerCase().includes("orphan")) {
          setIsOrphanDrug(true);
          setHasOrphanDesignation(true);
          setPatientPopulation("rare");
        }

        if (molecule.overallScore >= 80) {
          setEfficacyVsSoC([85]);
          setSafetyProfile([80]);
          setClinicalDifferentiation([85]);
        } else if (molecule.overallScore >= 60) {
          setEfficacyVsSoC([70]);
          setSafetyProfile([70]);
          setClinicalDifferentiation([70]);
        }
      }
    }
  }, [selectedMolecule, molecules, selectedTA]);

  // Calculate scores based on document formulas
  const calculateBaseMarketScore = (): number => {
    const populationScore = PATIENT_POPULATION_SCORES[patientPopulation]?.score || 80;
    const geographicScore = GEOGRAPHIC_REACH_SCORES[geographicReach]?.score || 75;
    const growthScore = MARKET_GROWTH_SCORES[marketGrowth]?.score || 80;
    return (populationScore * 0.5) + (geographicScore * 0.3) + (growthScore * 0.2);
  };

  const calculateClinicalScore = (): number => {
    let score = (efficacyVsSoC[0] * 0.4) +
                (safetyProfile[0] * 0.3) +
                (clinicalDifferentiation[0] * 0.2) +
                (evidenceQuality[0] * 0.1);
    
    // Apply bonuses from document
    if (isFirstInClass) score += CLINICAL_BONUSES.firstInClass;
    if (hasBreakthroughDesignation) score += CLINICAL_BONUSES.breakthroughDesignation;
    if (hasOrphanDesignation) score += CLINICAL_BONUSES.orphanDesignation;
    if (hasAcceleratedApproval) score += CLINICAL_BONUSES.acceleratedApproval;
    
    return Math.min(100, score);
  };

  const calculateCommercialScore = (): number => {
    return (convenience[0] * 0.35) +
           (brandStrength[0] * 0.25) +
           (hcpAcceptance[0] * 0.25) +
           (patientPreference[0] * 0.15);
  };

  const calculateStrategicScore = (): number => {
    const lineScore = TREATMENT_LINE_SCORES[treatmentLine] || 85;
    const comboScore = COMBINATION_SCORES[combinationPotential] || 90;
    const labelScore = LABEL_BREADTH_SCORES[labelBreadth] || 85;
    const lcmScore = LIFECYCLE_SCORES[lifeCycleManagement] || 90;
    return (lineScore * 0.4) + (comboScore * 0.3) + (labelScore * 0.2) + (lcmScore * 0.1);
  };

  const calculateCompetitiveScore = (): number => {
    // Weighted Competitor Count = (Approved × 1.0) + (Phase III × 0.7) + (Phase II × 0.3)
    const weightedCompetitors = (approvedCompetitors[0] * 1.0) + (phaseIIICompetitors[0] * 0.7) + (phaseIICompetitors[0] * 0.3);
    const qualityMultiplier = COMPETITOR_QUALITY_MULTIPLIERS[competitorQuality] || 0.7;
    
    // Base saturation from document
    let baseSaturation = 100;
    if (weightedCompetitors > 0 && weightedCompetitors <= 2) baseSaturation = 90;
    else if (weightedCompetitors <= 4) baseSaturation = 75;
    else if (weightedCompetitors <= 7) baseSaturation = 60;
    else if (weightedCompetitors <= 10) baseSaturation = 45;
    else if (weightedCompetitors > 10) baseSaturation = 30;

    // Differentiation bonuses from document
    let differentiationBonus = 0;
    if (hasUniqueMOA) differentiationBonus += COMPETITIVE_DIFFERENTIATION_BONUSES.uniqueMOA;
    if (hasSuperiorEfficacy) differentiationBonus += COMPETITIVE_DIFFERENTIATION_BONUSES.superiorEfficacy;
    if (hasBetterSafety) differentiationBonus += COMPETITIVE_DIFFERENTIATION_BONUSES.betterSafety;
    if (hasConvenienceAdvantage) differentiationBonus += COMPETITIVE_DIFFERENTIATION_BONUSES.convenienceAdvantage;

    // Quality penalty
    const penalty = weightedCompetitors * qualityMultiplier * 3;
    
    return Math.max(0, Math.min(100, baseSaturation + differentiationBonus - penalty));
  };

  const calculateMarketAccessScore = (): number => {
    let score = (payerCoverage[0] * 0.4) +
           (reimbursementSpeed[0] * 0.3) +
           (formularyPosition[0] * 0.2) +
           (priorAuthBurden[0] * 0.1);
    
    // Positive modifiers
    if (hasBreakthroughDesignation) score += 10;
    if (hasHealthEconomicAdvantage) score += 8;
    if (hasOrphanDesignation) score += 7;
    if (hasPatientAssistance) score += 5;
    
    return Math.min(100, score);
  };

  const calculatePricingScore = (): number => {
    const baseScore = VALUE_PROPOSITION_SCORES[therapeuticValue]?.score || 70;
    
    let score = baseScore;
    // Premium modifiers from document
    if (isOrphanDrug) score += 15;
    if (avoidsHospitalizations) score += 10;
    
    // Constraints from document
    if (hasGenericCompetition) score -= 20;
    if (hasBiosimilarCompetition) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  };

  const calculateResults = (): PeakSalesResult => {
    const baseMarket = calculateBaseMarketScore();
    const clinical = calculateClinicalScore();
    const commercial = calculateCommercialScore();
    const strategic = calculateStrategicScore();
    const competitive = calculateCompetitiveScore();
    const marketAccess = calculateMarketAccessScore();
    const pricing = calculatePricingScore();

    const componentScores: ComponentScore[] = [
      { name: "Base Market Size", score: baseMarket, weight: COMPONENT_WEIGHTS.BASE_MARKET, weightedScore: baseMarket * COMPONENT_WEIGHTS.BASE_MARKET },
      { name: "Clinical Success", score: clinical, weight: COMPONENT_WEIGHTS.CLINICAL, weightedScore: clinical * COMPONENT_WEIGHTS.CLINICAL },
      { name: "Commercial Advantage", score: commercial, weight: COMPONENT_WEIGHTS.COMMERCIAL, weightedScore: commercial * COMPONENT_WEIGHTS.COMMERCIAL },
      { name: "Strategic Positioning", score: strategic, weight: COMPONENT_WEIGHTS.STRATEGIC, weightedScore: strategic * COMPONENT_WEIGHTS.STRATEGIC },
      { name: "Competitive Intensity", score: competitive, weight: COMPONENT_WEIGHTS.COMPETITIVE, weightedScore: competitive * COMPONENT_WEIGHTS.COMPETITIVE },
      { name: "Market Access", score: marketAccess, weight: COMPONENT_WEIGHTS.MARKET_ACCESS, weightedScore: marketAccess * COMPONENT_WEIGHTS.MARKET_ACCESS },
      { name: "Pricing Power", score: pricing, weight: COMPONENT_WEIGHTS.PRICING, weightedScore: pricing * COMPONENT_WEIGHTS.PRICING },
    ];

    const compositeScore = componentScores.reduce((sum, c) => sum + c.weightedScore, 0);
    const blockbusterProbability = calculateBlockbusterProbability(compositeScore);
    
    // Peak sales estimate from document formula
    const basePeakSales = 2.5;
    const peakSalesEstimate = basePeakSales * Math.pow(compositeScore / 100, 2) * 10;

    // Risk factors
    const riskFactors: string[] = [];
    if (competitive < 60) riskFactors.push('High competitive intensity');
    if (clinical < 60) riskFactors.push('Clinical differentiation concerns');
    if (marketAccess < 60) riskFactors.push('Market access challenges');

    return {
      compositeScore: Math.round(compositeScore * 10) / 10,
      blockbusterProbability,
      peakSalesEstimate: Math.round(peakSalesEstimate * 100) / 100,
      peakSalesRange: {
        low: Math.round(peakSalesEstimate * 0.7 * 100) / 100,
        high: Math.round(peakSalesEstimate * 1.3 * 100) / 100,
      },
      componentScores,
      riskFactors,
      confidenceLevel: 'Medium',
    };
  };

  const results = calculateResults();

  const radarData = results.componentScores.map(c => ({
    subject: c.name.replace(" ", "\n"),
    score: c.score,
    fullMark: 100
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results Summary */}
        <Card className="lg:col-span-1 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Composite Score */}
            <div className={`p-4 rounded-lg border-2 ${getScoreBgColor(results.compositeScore)}`}>
              <p className="text-sm font-medium text-muted-foreground">Composite Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(results.compositeScore)}`}>
                {results.compositeScore}
              </p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </div>

            {/* Blockbuster Probability */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Blockbuster Probability (≥$1B)
              </p>
              <p className="text-3xl font-bold text-amber-700">
                {results.blockbusterProbability}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                P($1B+) = 1 / (1 + e^[-(Score - 65)/10])
              </p>
              <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-amber-600 h-2 rounded-full transition-all"
                  style={{ width: `${results.blockbusterProbability}%` }}
                />
              </div>
            </div>

            {/* Peak Sales Estimate */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Estimated Peak Sales
              </p>
              <p className="text-3xl font-bold text-green-700">
                ${results.peakSalesEstimate}B
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Range: ${results.peakSalesRange.low}B - ${results.peakSalesRange.high}B
              </p>
            </div>

            {/* Risk Factors */}
            {results.riskFactors.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm font-semibold text-red-700 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors
                </p>
                <ul className="mt-2 space-y-1">
                  {results.riskFactors.map((risk, i) => (
                    <li key={i} className="text-xs text-red-600">• {risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Component Breakdown */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Component Scores</p>
              {results.componentScores.map((comp) => (
                <div key={comp.name} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{comp.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${getScoreColor(comp.score)}`}>
                      {Math.round(comp.score)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (×{Math.round(comp.weight * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input Parameters */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Input Parameters
            </CardTitle>
            <CardDescription>
              Adjust parameters across 7 value drivers based on document methodology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="market" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4 bg-sky-100 dark:bg-sky-950/30">
                <TabsTrigger value="market">Market (25%)</TabsTrigger>
                <TabsTrigger value="clinical">Clinical (20%)</TabsTrigger>
                <TabsTrigger value="commercial">Commercial (18%)</TabsTrigger>
                <TabsTrigger value="competitive">Competitive (12%)</TabsTrigger>
              </TabsList>

              <TabsContent value="market" className="space-y-4">
                {/* TA and Molecule Selection */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border mb-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">Therapeutic Area</Label>
                    <Select value={selectedTA} onValueChange={(value) => {
                      setSelectedTA(value);
                      setSelectedMolecule("custom");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Therapeutic Area..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Therapeutic Areas</SelectItem>
                        {THERAPEUTIC_AREAS.map((ta) => (
                          <SelectItem key={ta} value={ta}>{ta}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Molecule</Label>
                    <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Molecule..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="custom">Custom Parameters</SelectItem>
                        {filteredMolecules.slice(0, 100).map((mol) => (
                          <SelectItem key={mol.id} value={mol.id}>
                            {mol.name} ({mol.phase})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient Population</Label>
                    <Select value={patientPopulation} onValueChange={setPatientPopulation}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ultraRare">Ultra-rare (&lt;5K) - Score: 20</SelectItem>
                        <SelectItem value="rare">Rare (5K-50K) - Score: 40</SelectItem>
                        <SelectItem value="small">Small (50K-200K) - Score: 60</SelectItem>
                        <SelectItem value="medium">Medium (200K-1M) - Score: 80</SelectItem>
                        <SelectItem value="large">Large (1M-5M) - Score: 90</SelectItem>
                        <SelectItem value="veryLarge">Very Large (&gt;5M) - Score: 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Geographic Reach</Label>
                    <Select value={geographicReach} onValueChange={setGeographicReach}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Country - Score: 30</SelectItem>
                        <SelectItem value="regional">Regional (2-5 countries) - Score: 50</SelectItem>
                        <SelectItem value="majorMarkets">Major Markets (US+EU) - Score: 75</SelectItem>
                        <SelectItem value="global">Global (US+EU+Asia) - Score: 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Market Growth Rate</Label>
                    <Select value={marketGrowth} onValueChange={setMarketGrowth}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="declining">Declining (&lt;0%) - Score: 40</SelectItem>
                        <SelectItem value="stable">Stable (0-3%) - Score: 60</SelectItem>
                        <SelectItem value="growing">Growing (3-7%) - Score: 80</SelectItem>
                        <SelectItem value="rapid">Rapid Growth (&gt;7%) - Score: 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Treatment Line</Label>
                    <Select value={treatmentLine} onValueChange={setTreatmentLine}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fourthLine">4th Line or Later - Score: 30</SelectItem>
                        <SelectItem value="thirdLine">3rd Line - Score: 50</SelectItem>
                        <SelectItem value="secondLine">2nd Line - Score: 70</SelectItem>
                        <SelectItem value="firstLineAlternative">1st Line Alternative - Score: 85</SelectItem>
                        <SelectItem value="firstLinePreferred">1st Line Preferred - Score: 100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mt-4">
                  <p className="text-xs text-blue-800">
                    <strong>Formula:</strong> Base Market Score = (Population × 0.5) + (Geographic × 0.3) + (Growth × 0.2)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Efficacy vs Standard of Care (Weight: 40%)</Label>
                      <span className="text-sm font-medium">{efficacyVsSoC[0]}</span>
                    </div>
                    <Slider value={efficacyVsSoC} onValueChange={setEfficacyVsSoC} max={100} step={5} />
                    <p className="text-xs text-muted-foreground">20=Inferior | 50=Non-inferior | 70=10-20% better | 90=30-50% better | 100=Best-in-class</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Safety Profile (Weight: 30%)</Label>
                      <span className="text-sm font-medium">{safetyProfile[0]}</span>
                    </div>
                    <Slider value={safetyProfile} onValueChange={setSafetyProfile} max={100} step={5} />
                    <p className="text-xs text-muted-foreground">20=Black box | 50=Significant AEs | 70=Manageable | 90=Minimal | 100=Superior to SoC</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Clinical Differentiation (Weight: 20%)</Label>
                      <span className="text-sm font-medium">{clinicalDifferentiation[0]}</span>
                    </div>
                    <Slider value={clinicalDifferentiation} onValueChange={setClinicalDifferentiation} max={100} step={5} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Evidence Quality (Weight: 10%)</Label>
                      <span className="text-sm font-medium">{evidenceQuality[0]}</span>
                    </div>
                    <Slider value={evidenceQuality} onValueChange={setEvidenceQuality} max={100} step={5} />
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-semibold text-green-800 mb-2">Bonus Points</p>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isFirstInClass} onChange={(e) => setIsFirstInClass(e.target.checked)} className="rounded" />
                        <span className="text-sm">First-in-Class (+10)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={hasBreakthroughDesignation} onChange={(e) => setHasBreakthroughDesignation(e.target.checked)} className="rounded" />
                        <span className="text-sm">Breakthrough (+8)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={hasOrphanDesignation} onChange={(e) => setHasOrphanDesignation(e.target.checked)} className="rounded" />
                        <span className="text-sm">Orphan Designation (+7)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={hasAcceleratedApproval} onChange={(e) => setHasAcceleratedApproval(e.target.checked)} className="rounded" />
                        <span className="text-sm">Accelerated Approval (+5)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="commercial" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Convenience (Weight: 35%)</Label>
                      <span className="text-sm font-medium">{convenience[0]}</span>
                    </div>
                    <Slider value={convenience} onValueChange={setConvenience} max={100} step={5} />
                    <p className="text-xs text-muted-foreground">30=Daily injection | 50=Weekly injection | 70=Monthly | 80=Daily oral | 90=Weekly oral | 100=One-time</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Brand Strength (Weight: 25%)</Label>
                      <span className="text-sm font-medium">{brandStrength[0]}</span>
                    </div>
                    <Slider value={brandStrength} onValueChange={setBrandStrength} max={100} step={5} />
                    <p className="text-xs text-muted-foreground">40=Unknown | 60=Established company | 80=Line extension | 100=Blockbuster extension</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>HCP Acceptance (Weight: 25%)</Label>
                      <span className="text-sm font-medium">{hcpAcceptance[0]}</span>
                    </div>
                    <Slider value={hcpAcceptance} onValueChange={setHcpAcceptance} max={100} step={5} />
                    <p className="text-xs text-muted-foreground">30=Controversial | 60=Mixed guideline | 85=Guideline-recommended | 100=First-line guideline</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Patient Preference (Weight: 15%)</Label>
                      <span className="text-sm font-medium">{patientPreference[0]}</span>
                    </div>
                    <Slider value={patientPreference} onValueChange={setPatientPreference} max={100} step={5} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="competitive" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Approved Competitors (×1.0)</Label>
                      <span className="text-sm font-medium">{approvedCompetitors[0]}</span>
                    </div>
                    <Slider value={approvedCompetitors} onValueChange={setApprovedCompetitors} max={15} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Phase III (×0.7)</Label>
                      <span className="text-sm font-medium">{phaseIIICompetitors[0]}</span>
                    </div>
                    <Slider value={phaseIIICompetitors} onValueChange={setPhaseIIICompetitors} max={10} step={1} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Phase II (×0.3)</Label>
                      <span className="text-sm font-medium">{phaseIICompetitors[0]}</span>
                    </div>
                    <Slider value={phaseIICompetitors} onValueChange={setPhaseIICompetitors} max={10} step={1} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Competitor Quality</Label>
                  <Select value={competitorQuality} onValueChange={setCompetitorQuality}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="allMeToo">All Me-Too Products (×0.5)</SelectItem>
                      <SelectItem value="mixed">Mixed (×0.7)</SelectItem>
                      <SelectItem value="differentiated">Mostly Differentiated (×0.9)</SelectItem>
                      <SelectItem value="bestInClass">Multiple Best-in-Class (×1.2)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-semibold text-green-800 mb-2">Differentiation Bonuses</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasUniqueMOA} onChange={(e) => setHasUniqueMOA(e.target.checked)} className="rounded" />
                      <span className="text-sm">Unique MOA (+15)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasSuperiorEfficacy} onChange={(e) => setHasSuperiorEfficacy(e.target.checked)} className="rounded" />
                      <span className="text-sm">Superior Efficacy (+10)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasBetterSafety} onChange={(e) => setHasBetterSafety(e.target.checked)} className="rounded" />
                      <span className="text-sm">Better Safety (+10)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={hasConvenienceAdvantage} onChange={(e) => setHasConvenienceAdvantage(e.target.checked)} className="rounded" />
                      <span className="text-sm">Convenience Advantage (+8)</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Formula:</strong> Competitive Score = Base Saturation + Differentiation Bonuses - (Weighted Competitors × Quality × 3)
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Weighted Count = (Approved × 1.0) + (Phase III × 0.7) + (Phase II × 0.3)
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Radar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Component Score Radar</CardTitle>
          <CardDescription>Visual representation of all 7 weighted components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Historical Validation Data Component
const HistoricalValidation = () => {
  const validationByTA = Object.entries(TA_BENCHMARKS).map(([key, data]) => ({
    ta: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    avgScore: data.avgScore,
    blockbusterRate: data.blockbusterRate,
    avgPeakSales: data.avgPeakSales,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Correlation with Actual Sales</p>
              <p className="text-3xl font-bold text-blue-600">r = 0.78</p>
              <p className="text-xs text-muted-foreground mt-1">Based on 100 launches (2014-2024)</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Blockbuster Prediction Accuracy</p>
              <p className="text-3xl font-bold text-green-600">82%</p>
              <p className="text-xs text-muted-foreground mt-1">True positive rate</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Mean Absolute Error</p>
              <p className="text-3xl font-bold text-amber-600">±$1.2B</p>
              <p className="text-xs text-muted-foreground mt-1">For drugs with predicted peak &gt;$3B</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validation by TA */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Performance by Therapeutic Area</CardTitle>
            <CardDescription>Model calibration data from 2014-2024 launches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={validationByTA} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="ta" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" />
                  <Bar dataKey="blockbusterRate" fill="hsl(var(--chart-2))" name="Blockbuster %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Therapeutic Area</th>
                    <th className="text-center py-2">Avg Score</th>
                    <th className="text-center py-2">Blockbuster Rate</th>
                    <th className="text-center py-2">Avg Peak Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {validationByTA.map((row) => (
                    <tr key={row.ta} className="border-b hover:bg-muted/50">
                      <td className="py-2">{row.ta}</td>
                      <td className="text-center">{row.avgScore}</td>
                      <td className="text-center">{row.blockbusterRate}%</td>
                      <td className="text-center">${row.avgPeakSales}B</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Probability Lookup Table */}
        <Card>
          <CardHeader>
            <CardTitle>Blockbuster Probability Reference</CardTitle>
            <CardDescription>P($1B+) = 1 / (1 + e^[-(Score - 65)/10])</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Composite Score Range</th>
                    <th className="text-left py-2">Probability of $1B+ Peak Sales</th>
                  </tr>
                </thead>
                <tbody>
                  {PROBABILITY_TABLE.map((row) => (
                    <tr key={row.range} className="border-b hover:bg-muted/50">
                      <td className="py-2 font-medium">{row.range}</td>
                      <td className="py-2">
                        <Badge variant={
                          row.probability.includes(">98") ? "default" :
                          row.probability.includes("88") ? "default" :
                          row.probability.includes("62") ? "secondary" :
                          row.probability.includes("50") ? "secondary" :
                          "outline"
                        }>
                          {row.probability}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Sensitivity Analysis</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Factor</th>
                      <th className="text-left py-2">Change</th>
                      <th className="text-left py-2">Peak Sales Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SENSITIVITY_FACTORS.map((row) => (
                      <tr key={row.factor} className="border-b hover:bg-muted/50">
                        <td className="py-2">{row.factor}</td>
                        <td className="py-2 text-muted-foreground">{row.change}</td>
                        <td className="py-2">
                          <span className={row.impact.startsWith("-") ? "text-red-600" : "text-green-600"}>
                            {row.impact}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Portfolio Analysis Component
const PortfolioAnalysis = ({ molecules }: { molecules: MoleculeProfile[] }) => {
  const analysisData = useMemo(() => {
    return molecules.slice(0, 50).map(mol => {
      const result = calculatePeakSalesIndex(mol);
      return {
        name: mol.name.length > 15 ? mol.name.substring(0, 15) + '...' : mol.name,
        fullName: mol.name,
        compositeScore: result.compositeScore,
        blockbusterProbability: result.blockbusterProbability,
        peakSales: result.peakSalesEstimate,
        phase: mol.phase,
        ta: mol.therapeuticArea,
      };
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }, [molecules]);

  const topPerformers = analysisData.filter(d => d.compositeScore >= 70);
  const avgScore = analysisData.reduce((sum, d) => sum + d.compositeScore, 0) / analysisData.length;
  const totalPeakSales = analysisData.reduce((sum, d) => sum + d.peakSales, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Molecules Analyzed</p>
            <p className="text-3xl font-bold">{analysisData.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Average Composite Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Potential Blockbusters (≥70)</p>
            <p className="text-3xl font-bold text-amber-600">{topPerformers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Peak Sales Potential</p>
            <p className="text-3xl font-bold text-green-600">${totalPeakSales.toFixed(1)}B</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Composite Scores</CardTitle>
          <CardDescription>Top 50 molecules ranked by Peak Sales Composite Index</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analysisData.slice(0, 20)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.fullName}</p>
                          <p className="text-sm">Score: {data.compositeScore}</p>
                          <p className="text-sm">Blockbuster Prob: {data.blockbusterProbability}%</p>
                          <p className="text-sm">Peak Sales: ${data.peakSales}B</p>
                          <p className="text-xs text-muted-foreground">{data.phase} | {data.ta}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="compositeScore" fill="hsl(var(--primary))" name="Composite Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score vs Blockbuster Probability</CardTitle>
          <CardDescription>Logistic relationship: P($1B+) = 1 / (1 + e^[-(Score - 65)/10])</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="compositeScore" name="Composite Score" domain={[30, 100]} />
                <YAxis type="number" dataKey="blockbusterProbability" name="Blockbuster %" domain={[0, 100]} />
                <ZAxis type="number" dataKey="peakSales" range={[50, 400]} name="Peak Sales" />
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-semibold">{data.fullName}</p>
                          <p className="text-sm">Score: {data.compositeScore}</p>
                          <p className="text-sm">Probability: {data.blockbusterProbability}%</p>
                          <p className="text-sm">Peak Sales: ${data.peakSales}B</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Molecules" data={analysisData} fill="hsl(var(--primary))" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Monte Carlo Simulation Wrapper
const MonteCarloSimulationWrapper = ({ molecules }: { molecules: MoleculeProfile[] }) => {
  const [selectedMolecule, setSelectedMolecule] = useState<string>("custom");
  
  // Default component scores for custom analysis
  const defaultScores: ComponentScore[] = [
    { name: "Base Market Size", score: 80, weight: 0.25, weightedScore: 20 },
    { name: "Clinical Success", score: 75, weight: 0.20, weightedScore: 15 },
    { name: "Commercial Advantage", score: 70, weight: 0.18, weightedScore: 12.6 },
    { name: "Strategic Positioning", score: 75, weight: 0.15, weightedScore: 11.25 },
    { name: "Competitive Intensity", score: 65, weight: 0.12, weightedScore: 7.8 },
    { name: "Market Access", score: 80, weight: 0.10, weightedScore: 8 },
    { name: "Pricing Power", score: 70, weight: 0.10, weightedScore: 7 },
  ];
  
  const [componentScores, setComponentScores] = useState<ComponentScore[]>(defaultScores);
  const [moleculeName, setMoleculeName] = useState<string>("Custom Analysis");
  
  // Update scores when molecule is selected
  useEffect(() => {
    if (selectedMolecule && selectedMolecule !== "custom") {
      const molecule = molecules.find(m => m.id === selectedMolecule);
      if (molecule) {
        const result = calculatePeakSalesIndex(molecule);
        setComponentScores(result.componentScores);
        setMoleculeName(molecule.name);
      }
    } else {
      setComponentScores(defaultScores);
      setMoleculeName("Custom Analysis");
    }
  }, [selectedMolecule, molecules]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Monte Carlo Simulation
          </CardTitle>
          <CardDescription>
            Run probabilistic simulations to generate peak sales distributions with configurable uncertainty ranges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label className="text-sm font-medium">Select Molecule for Analysis</Label>
            <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a molecule..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="custom">Custom Parameters</SelectItem>
                {molecules.slice(0, 100).map((mol) => (
                  <SelectItem key={mol.id} value={mol.id}>
                    {mol.name} ({mol.phase})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <MonteCarloSimulation 
        componentScores={componentScores} 
        moleculeName={moleculeName}
      />
    </div>
  );
};

// PDF Export Wrapper
const PDFExportWrapper = ({ molecules }: { molecules: MoleculeProfile[] }) => {
  const [selectedMolecule, setSelectedMolecule] = useState<string>("");
  const [result, setResult] = useState<PeakSalesResult | null>(null);
  const [moleculeInfo, setMoleculeInfo] = useState({ 
    name: "Custom Analysis", 
    ta: "N/A", 
    phase: "N/A", 
    company: "N/A" 
  });
  
  useEffect(() => {
    if (selectedMolecule) {
      const molecule = molecules.find(m => m.id === selectedMolecule);
      if (molecule) {
        const peakSalesResult = calculatePeakSalesIndex(molecule);
        setResult(peakSalesResult);
        setMoleculeInfo({
          name: molecule.name,
          ta: molecule.therapeuticArea,
          phase: molecule.phase,
          company: molecule.company
        });
      }
    }
  }, [selectedMolecule, molecules]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Peak Sales Report
          </CardTitle>
          <CardDescription>
            Generate a comprehensive PDF report for individual molecule analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Select Molecule for Report</Label>
              <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a molecule to generate report..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {molecules.slice(0, 100).map((mol) => (
                    <SelectItem key={mol.id} value={mol.id}>
                      {mol.name} ({mol.phase}) - {mol.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {result ? (
        <PeakSalesPDFReport 
          result={result}
          moleculeName={moleculeInfo.name}
          therapeuticArea={moleculeInfo.ta}
          phase={moleculeInfo.phase}
          company={moleculeInfo.company}
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Select a Molecule</p>
            <p className="text-sm text-muted-foreground mt-2">
              Choose a molecule from the dropdown above to generate a comprehensive PDF report
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Main Dashboard Component
interface PeakSalesIndexDashboardProps {
  molecules: MoleculeProfile[];
}

export const PeakSalesIndexDashboard = ({ molecules }: PeakSalesIndexDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Peak Sales Composite Index & $1B Blockbuster Probability Model
          </CardTitle>
          <CardDescription className="text-base">
            Quantitative framework for estimating peak sales potential and probability of achieving blockbuster status (≥$1B annual sales). 
            <strong> Model Version 1.0</strong> — Validated against 100 drug launches (2014-2024) with r=0.78 correlation and 82% prediction accuracy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Architecture */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Model Architecture
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg text-sm font-mono space-y-2">
                <p className="font-semibold">Peak Sales Formula:</p>
                <p className="text-xs">Peak Sales = Base Market × Clinical × Commercial ×</p>
                <p className="text-xs pl-12">Strategic × Competitive × Access × Pricing</p>
                <div className="border-t my-2 pt-2">
                  <p className="font-semibold">Blockbuster Probability:</p>
                  <p className="text-xs">P($1B+) = 1 / (1 + e^[-(Score - 65)/10])</p>
                  <p className="text-xs text-muted-foreground mt-1">μ = 65 (inflection), σ = 10 (slope)</p>
                </div>
              </div>
            </div>

            {/* Component Weights */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Component Weights (Total: 100%)
              </h3>
              <div className="space-y-2">
                {[
                  { name: "Base Market Size", weight: 25, icon: Users },
                  { name: "Clinical Success", weight: 20, icon: ShieldCheck },
                  { name: "Commercial Advantage", weight: 18, icon: Building2 },
                  { name: "Strategic Positioning", weight: 15, icon: Target },
                  { name: "Competitive Intensity", weight: 12, icon: Zap },
                  { name: "Market Access", weight: 10, icon: Globe },
                  { name: "Pricing Power", weight: 10, icon: DollarSign },
                ].map((comp) => (
                  <div key={comp.name} className="flex items-center gap-2">
                    <comp.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{comp.name}</span>
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${comp.weight * 4}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{comp.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            Interactive Calculator
          </TabsTrigger>
          <TabsTrigger value="montecarlo" className="gap-2">
            <Shuffle className="h-4 w-4" />
            Monte Carlo Simulation
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-2">
            <Layers className="h-4 w-4" />
            Multi-Molecule Comparison
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Portfolio Analysis
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2">
            <FileText className="h-4 w-4" />
            PDF Export
          </TabsTrigger>
          <TabsTrigger value="validation" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Historical Validation
          </TabsTrigger>
          <TabsTrigger value="methodology" className="gap-2">
            <Info className="h-4 w-4" />
            Methodology
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <PeakSalesCalculator molecules={molecules} />
        </TabsContent>

        <TabsContent value="montecarlo">
          <MonteCarloSimulationWrapper molecules={molecules} />
        </TabsContent>

        <TabsContent value="comparison">
          <MonteCarloComparison molecules={molecules} />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioAnalysis molecules={molecules} />
        </TabsContent>

        <TabsContent value="export">
          <PDFExportWrapper molecules={molecules} />
        </TabsContent>

        <TabsContent value="validation">
          <HistoricalValidation />
        </TabsContent>

        <TabsContent value="methodology">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Methodology</CardTitle>
              <CardDescription>Complete scoring rubrics and calculation formulas from the validated model</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="market">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Component 1: Base Market Size (25%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Market Size Score = (Population × 0.5) + (Geographic × 0.3) + (Growth × 0.2)</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Patient Population</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Ultra-rare (&lt;5K): 20</li>
                          <li>Rare (5K-50K): 40</li>
                          <li>Small (50K-200K): 60</li>
                          <li>Medium (200K-1M): 80</li>
                          <li>Large (1M-5M): 90</li>
                          <li>Very Large (&gt;5M): 100</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Geographic Reach</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Single country: 30</li>
                          <li>Regional (2-5): 50</li>
                          <li>Major markets (US+EU): 75</li>
                          <li>Global (US+EU+Asia): 100</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Annual Growth Rate</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Declining (&lt;0%): 40</li>
                          <li>Stable (0-3%): 60</li>
                          <li>Growing (3-7%): 80</li>
                          <li>Rapid (&gt;7%): 100</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="clinical">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      Component 2: Clinical Success Factor (20%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Clinical Score = (Efficacy × 0.4) + (Safety × 0.3) + (Differentiation × 0.2) + (Evidence × 0.1) + Bonuses - Penalties</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2 text-green-700">Bonus Points</p>
                        <ul className="space-y-1 text-green-600">
                          <li>First-in-class: +10</li>
                          <li>Breakthrough designation: +8</li>
                          <li>Orphan designation: +7</li>
                          <li>Accelerated approval: +5</li>
                          <li>Companion diagnostic: +5</li>
                          <li>QoL improvement: +5</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-red-700">Penalty Points</p>
                        <ul className="space-y-1 text-red-600">
                          <li>Black box warning: -15</li>
                          <li>REMS requirement: -10</li>
                          <li>Contraindications &gt;20%: -8</li>
                          <li>Complex administration: -5</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="commercial">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Component 3: Commercial Advantage (18%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Commercial Score = (Convenience × 0.35) + (Brand × 0.25) + (HCP × 0.25) + (Patient × 0.15)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Convenience Scoring</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Daily injection: 30</li>
                          <li>Weekly injection: 50</li>
                          <li>Monthly injection: 70</li>
                          <li>Daily oral: 80</li>
                          <li>Weekly oral: 90</li>
                          <li>One-time treatment: 100</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Brand Strength</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Unknown company: 40</li>
                          <li>Established, new molecule: 60</li>
                          <li>Line extension: 80</li>
                          <li>Blockbuster extension: 100</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="strategic">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Component 4: Strategic Positioning (15%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Strategic Score = (Treatment Line × 0.4) + (Combination × 0.3) + (Label × 0.2) + (LCM × 0.1)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Treatment Line</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>4th line or later: 30</li>
                          <li>3rd line: 50</li>
                          <li>2nd line: 70</li>
                          <li>1st line alternative: 85</li>
                          <li>1st line preferred: 100</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2">Combination Potential</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Monotherapy only: 50</li>
                          <li>Compatible: 75</li>
                          <li>Synergistic: 90</li>
                          <li>Platform: 100</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="competitive">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Component 5: Competitive Intensity (12%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Competitive Score = Base Saturation + Differentiation Bonuses - (Quality Penalty)</p>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold mb-2">Weighted Competitor Count</p>
                        <p className="text-muted-foreground">= (Approved × 1.0) + (Phase III × 0.7) + (Phase II × 0.3)</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold mb-2">Market Saturation</p>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>Blue ocean (0): 100</li>
                            <li>1-2 competitors: 90</li>
                            <li>3-4 competitors: 75</li>
                            <li>5-7 competitors: 60</li>
                            <li>8-10 competitors: 45</li>
                            <li>&gt;10 competitors: 30</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2 text-green-700">Differentiation Bonuses</p>
                          <ul className="space-y-1 text-green-600">
                            <li>Unique MOA: +15</li>
                            <li>Superior efficacy: +10</li>
                            <li>Better safety: +10</li>
                            <li>Convenience advantage: +8</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="access">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Component 6: Market Access (10%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Market Access Score = (Payer Coverage × 0.4) + (Reimbursement Speed × 0.3) + (Formulary × 0.2) + (PA Burden × 0.1) + Modifiers</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2 text-green-700">Positive Modifiers</p>
                        <ul className="space-y-1 text-green-600">
                          <li>Breakthrough designation: +10</li>
                          <li>Health economic advantage: +8</li>
                          <li>Orphan status: +7</li>
                          <li>Patient assistance program: +5</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-red-700">Negative Modifiers</p>
                        <ul className="space-y-1 text-red-600">
                          <li>High cost, no clear value: -15</li>
                          <li>Step therapy required: -10</li>
                          <li>Geographic restrictions: -8</li>
                          <li>REMS distribution: -10</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pricing">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Component 7: Pricing Power (10%)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <p><strong>Formula:</strong> Pricing Score = Base Therapeutic Value + Premium Modifiers - Constraints</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Value Proposition</p>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>Life-saving, no alternatives ($500K+): 100</li>
                          <li>Major QoL ($150K-500K): 85</li>
                          <li>Significant ($75K-150K): 70</li>
                          <li>Moderate ($30K-75K): 55</li>
                          <li>Incremental ($10K-30K): 40</li>
                          <li>Minimal (&lt;$10K): 25</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold mb-2 text-green-700">Premium Justifiers</p>
                        <ul className="space-y-1 text-green-600">
                          <li>Curative therapy: +20</li>
                          <li>Orphan/rare disease: +15</li>
                          <li>Dramatic efficacy (&gt;50%): +15</li>
                          <li>Avoids hospitalizations: +10</li>
                          <li>One-time treatment: +10</li>
                        </ul>
                        <p className="font-semibold mb-2 mt-4 text-red-700">Constraints</p>
                        <ul className="space-y-1 text-red-600">
                          <li>Generic within 5 years: -20</li>
                          <li>Biosimilar expected: -15</li>
                          <li>Reference pricing: -10</li>
                          <li>Multiple branded competitors: -10</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="limitations">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Limitations & Best Practices
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold mb-2">Model Limitations</p>
                        <ul className="space-y-2 text-muted-foreground">
                          <li><strong>Historical bias:</strong> Based on past launches; may not capture future innovations</li>
                          <li><strong>Black swan events:</strong> Cannot predict unexpected regulatory/safety issues</li>
                          <li><strong>Market dynamics:</strong> Assumes relatively stable competitive landscape</li>
                          <li><strong>Geographic variation:</strong> Primarily US/EU-centric</li>
                          <li><strong>TA differences:</strong> Some areas inherently harder to predict</li>
                        </ul>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <p className="font-semibold text-amber-800">Best Practices</p>
                        <ul className="text-amber-700 mt-2 space-y-1">
                          <li>• Use as directional guide, not absolute predictor</li>
                          <li>• Combine with DCF and scenario analysis</li>
                          <li>• Update assumptions quarterly</li>
                          <li>• Validate with external consultants</li>
                          <li>• Run Monte Carlo simulations for uncertainty</li>
                          <li>• Create probability ranges, not point estimates</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
