import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Globe, 
  TrendingUp, 
  Database,
  FileText,
  Search,
  BarChart3,
  Download,
  Pill
} from "lucide-react";
import bioquillLogo from "@/assets/bioquill-logo-new.jpg";
import html2pdf from "html2pdf.js";
import { MoleculeScoreCard } from "@/components/MoleculeScoreCard";
import { MarketAnalysisTable } from "@/components/MarketAnalysisTable";
import { MarketHeatMap } from "@/components/MarketHeatMap";
import { RegulatoryTimelineChart } from "@/components/RegulatoryTimelineChart";
import { TrialFailureAnalysis } from "@/components/TrialFailureAnalysis";
import { RetrospectiveTimeline } from "@/components/RetrospectiveTimeline";
import { PatentTimeline, type PatentInfo } from "@/components/PatentTimeline";
import { CompetitiveAnalysis, type CompetitiveLandscape } from "@/components/CompetitiveAnalysis";
import { LaunchFactorsCard } from "@/components/LaunchFactorsCard";
import { 
  calculateProbabilityScores, 
  generateMarketProjections, 
  calculateOverallScore,
  type ProbabilityScores,
  type MarketData
} from "@/lib/scoring";
import { generateLaunchFactors, type LaunchFactors } from "@/lib/launchFactors";

interface TimelinePhase {
  phase: string;
  date: string;
  trialName?: string;
  nctIds?: string[];
  outcome: 'success' | 'partial' | 'pending' | 'setback';
  keyData: string[];
  scoreAtTime: number;
  rationale: string;
  dataAvailableAtTime: string[];
}

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  scores: ProbabilityScores;
  marketData: MarketData[];
  overallScore: number;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
  trialName?: string;
  nctId?: string;
  hasRetrospective?: boolean;
  retrospectivePhases?: TimelinePhase[];
  patents?: PatentInfo[];
  regulatoryExclusivity?: { type: string; endDate: string; }[];
  competitiveLandscape?: CompetitiveLandscape;
  launchFactors?: LaunchFactors;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!reportRef.current || !activeMolecule) return;
    
    const opt = {
      margin: 10,
      filename: `${activeMolecule.name.replace(/\s+/g, '_')}_Due_Diligence_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(reportRef.current).save();
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
    {
      id: "ORFO-01",
      name: "Orfoglipron (LY3502970)",
      trialName: "ATTAIN",
      phase: "Phase III",
      indication: "Type 2 Diabetes / Obesity",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Eli Lilly",
      companyTrackRecord: 'fast',
      nctId: "NCT05631327",
      scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
      marketData: generateMarketProjections("Orfoglipron", "Phase III", "Type 2 Diabetes", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      patents: [
        { patentNumber: "US10,981,939", title: "Small molecule GLP-1 receptor agonist", expirationDate: "2038", type: 'composition', status: 'active' },
        { patentNumber: "US11,414,432", title: "Methods of treatment using oral GLP-1 agonist", expirationDate: "2039", type: 'method', status: 'active' },
        { patentNumber: "US11,667,634", title: "Oral formulations of GLP-1 agonists", expirationDate: "2040", type: 'formulation', status: 'active' },
      ],
      regulatoryExclusivity: [
        { type: "NCE Exclusivity (projected)", endDate: "2031" },
        { type: "Pediatric Extension", endDate: "2031.5" },
      ],
      competitiveLandscape: {
        totalMarketSize: "$100B+",
        projectedGrowth: "20% CAGR",
        keyPlayers: [
          { name: "Rybelsus (oral semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1 peptide", keyDifferentiator: "First-to-market oral GLP-1", efficacy: "~4-5% weight loss", threat: 'high' },
          { name: "Tirzepatide (Mounjaro)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 injectable", keyDifferentiator: "Superior efficacy, same company", efficacy: "22.5% weight loss", threat: 'low' },
          { name: "Semaglutide (Ozempic)", company: "Novo Nordisk", phase: "Approved", mechanism: "Injectable GLP-1", keyDifferentiator: "Market leader injectable", efficacy: "15% weight loss", threat: 'medium' },
          { name: "Danuglipron", company: "Pfizer", phase: "Discontinued", mechanism: "Oral GLP-1", keyDifferentiator: "Was competitor, now discontinued", threat: 'low' },
        ],
        competitiveAdvantages: [
          "Small molecule - easier manufacturing than peptides",
          "Once-daily dosing without food restrictions (vs Rybelsus)",
          "~15% weight loss - competitive with injectable GLP-1s",
          "Oral convenience addresses injection hesitancy",
          "Eli Lilly manufacturing and commercial excellence"
        ],
        competitiveRisks: [
          "Rybelsus has first-mover advantage in oral GLP-1",
          "Lower efficacy than injectable tirzepatide/semaglutide",
          "May cannibalize Mounjaro sales",
          "GI tolerability still a concern",
          "Pricing pressure in competitive market"
        ],
        marketPositioning: "Orfoglipron targets patients who prefer oral therapy over injections. Positioned as 'injectable-level efficacy in a pill' - addressing the ~50% of patients who refuse or discontinue injectable GLP-1s due to needle aversion."
      },
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q2 2020",
          trialName: "First-in-Human Studies",
          nctIds: ["NCT03954834"],
          outcome: 'success',
          keyData: [
            "Novel oral small molecule GLP-1 receptor agonist",
            "Favorable PK profile with once-daily dosing",
            "Dose-dependent glucose lowering observed",
            "Well-tolerated in healthy volunteers"
          ],
          scoreAtTime: 32,
          rationale: "Early stage oral GLP-1 with novel mechanism. Small molecule approach differentiates from peptide-based competitors. Eli Lilly strong metabolic portfolio. Key risk: oral GLP-1 has historically faced bioavailability challenges.",
          dataAvailableAtTime: ["PK/PD data", "Safety profile", "Mechanism validation"]
        },
        {
          phase: "Phase 2",
          date: "Jun 2023",
          trialName: "ACHIEVE Program",
          nctIds: ["NCT05051579", "NCT05048719"],
          outcome: 'success',
          keyData: [
            "Up to 14.7% weight loss at 36 weeks (highest dose)",
            "HbA1c reduction up to 2.1% in T2D patients",
            "Comparable efficacy to injectable semaglutide",
            "Once-daily oral dosing confirmed",
            "GI side effects manageable, dose-dependent"
          ],
          scoreAtTime: 58,
          rationale: "Exceptional Phase 2 results - weight loss competitive with injectable GLP-1s. Oral convenience is major differentiator vs Wegovy/Ozempic. Large obesity market opportunity ($100B+ projected). Clear path to Phase 3.",
          dataAvailableAtTime: ["36-week efficacy", "Weight loss data", "HbA1c reduction", "Safety/tolerability", "Dose-response"]
        },
        {
          phase: "Phase 3 Initiation",
          date: "Q4 2023",
          trialName: "ATTAIN Program Launch",
          nctIds: ["NCT05631327", "NCT05631314", "NCT05631301"],
          outcome: 'pending',
          keyData: [
            "ATTAIN-1, ATTAIN-2, ATTAIN-3 trials initiated",
            "Targeting T2D and obesity indications",
            "~3,000+ patients planned across program",
            "Comparator arms include tirzepatide",
            "Results expected 2025-2026"
          ],
          scoreAtTime: 65,
          rationale: "Strong Phase 3 program design. Lilly's tirzepatide success (Mounjaro/Zepbound) validates metabolic expertise. Oral formulation addresses injection hesitancy. Key question: can it compete with tirzepatide's superior efficacy?",
          dataAvailableAtTime: ["Phase 2 full data", "Trial designs", "Competitive landscape", "Market projections"]
        },
        {
          phase: "Current Status",
          date: "Q4 2024",
          trialName: "Phase 3 Ongoing",
          outcome: 'pending',
          keyData: [
            "Phase 3 trials enrolling/ongoing",
            "No safety signals reported",
            "Competitive pressure from oral semaglutide (Rybelsus)",
            "Tirzepatide setting high efficacy bar",
            "Potential first-line oral option for obesity"
          ],
          scoreAtTime: 68,
          rationale: "Phase 3 progressing well. Market opportunity remains massive despite competition. Oral GLP-1 convenience could capture significant market share. Lilly well-positioned with manufacturing/commercial capabilities. Filing expected 2026.",
          dataAvailableAtTime: ["Interim safety data", "Enrollment progress", "Competitive developments", "Market dynamics"]
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
      id: "CASG-01",
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
      id: "VILT-01",
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
      scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology", true),
      marketData: generateMarketProjections("Semaglutide", "Phase III", "Alzheimer's Disease", 'fast', true),
      overallScore: 0,
    },
    {
      id: "ICODEC-01",
      name: "Insulin Icodec (Kyinsu/Awiqli)",
      phase: "Approved (EU/CN)",
      indication: "Type 2 Diabetes",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Novo Nordisk",
      companyTrackRecord: 'fast',
      nctId: "NCT03496519",
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

  // Calculate overall scores and generate launch factors based on probabilities and market projections
  mockMolecules.forEach(mol => {
    mol.launchFactors = generateLaunchFactors(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.isFailed);
    mol.overallScore = calculateOverallScore(mol.scores, mol.marketData, mol.phase);
  });

  const activeMolecule = mockMolecules.find(m => m.id === selectedMolecule);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Yellow Bar */}
      <header className="sticky top-0 z-10 bg-[#F5D547] w-full">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={bioquillLogo} alt="BiOQUILL" className="h-16 w-auto object-contain" />
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-800 hover:bg-yellow-400/50">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700">
                <Search className="h-4 w-4 mr-2" />
                Search Trials
              </Button>
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
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
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

        {/* Data Sources */}
        <Card className="mb-8 border-l-4 border-l-primary bg-[#FFFFC5]">
          <CardContent className="py-4">
            <div className="space-y-3">
              {/* Trial Databases Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Trial Databases:</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <a 
                      href="https://clinicaltrials.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇺🇸</span>
                      <span>ClinicalTrials.gov</span>
                      <Badge variant="secondary" className="text-xs">Primary</Badge>
                    </a>
                    <a 
                      href="https://trialsearch.who.int" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🌐</span>
                      <span>WHO ICTRP</span>
                      <Badge variant="outline" className="text-xs">12 Registries</Badge>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Regulatory Databases Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Regulatory Sources:</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <a 
                      href="https://www.fda.gov/drugs/nda-and-bla-approvals/nda-and-bla-calendar-year-approvals" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇺🇸</span>
                      <span>FDA Approvals</span>
                      <Badge variant="outline" className="text-xs">NDA/BLA</Badge>
                    </a>
                    <a 
                      href="https://www.ema.europa.eu/en/medicines/national-registers-authorised-medicines#human-medicines-13110" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇪🇺</span>
                      <span>EMA Registers</span>
                      <Badge variant="outline" className="text-xs">National</Badge>
                    </a>
                    <a 
                      href="https://ec.europa.eu/health/documents/community-register/html/reg_hum_act.htm?sort=a" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇪🇺</span>
                      <span>EU Community Register</span>
                      <Badge variant="outline" className="text-xs">Human Medicines</Badge>
                    </a>
                    <a 
                      href="https://www.nmpa.gov.cn/yaopin/index.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇨🇳</span>
                      <span>NMPA China</span>
                      <Badge variant="outline" className="text-xs">Drug Registry</Badge>
                    </a>
                    <a 
                      href="https://www.pmda.go.jp/english/review-services/reviews/approved-information/drugs/0002.html" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇯🇵</span>
                      <span>PMDA Japan</span>
                      <Badge variant="outline" className="text-xs">Approvals</Badge>
                    </a>
                    <a 
                      href="https://products.mhra.gov.uk/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇬🇧</span>
                      <span>MHRA UK</span>
                      <Badge variant="outline" className="text-xs">Products</Badge>
                    </a>
                    <a 
                      href="https://health-products.canada.ca/dpd-bdpp/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇨🇦</span>
                      <span>Health Canada</span>
                      <Badge variant="outline" className="text-xs">DPD</Badge>
                    </a>
                    <a 
                      href="https://consultas.anvisa.gov.br/#/medicamentos/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <span className="text-base">🇧🇷</span>
                      <span>ANVISA Brazil</span>
                      <Badge variant="outline" className="text-xs">Registry</Badge>
                    </a>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Last sync: Dec 7, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="molecules" className="gap-2">
              <Pill className="h-4 w-4" />
              Molecules
            </TabsTrigger>
            <TabsTrigger value="timelines" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timelines
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="gap-2">
              <Globe className="h-4 w-4" />
              Regulatory
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {!selectedMolecule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">High Priority Molecules</h2>
                    <p className="text-sm text-muted-foreground">Comprehensive due diligence profiles for PE/M&A analysis</p>
                  </div>
                </div>
                {mockMolecules
                  .sort((a, b) => b.overallScore - a.overallScore)
                  .map((molecule) => (
                    <Card key={molecule.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMolecule(molecule.id)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold">{molecule.name}</h3>
                              <Badge variant="outline">{molecule.id}</Badge>
                              <Badge variant="secondary">{molecule.company}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{molecule.phase}</span>
                              <span>•</span>
                              <span>{molecule.indication}</span>
                              <span>•</span>
                              <span>{molecule.therapeuticArea}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Approval Probability</p>
                                <p className="font-semibold">{(molecule.scores.approval * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Next Phase Prob.</p>
                                <p className="font-semibold">{(molecule.scores.nextPhase * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Dropout Risk</p>
                                <p className="font-semibold">{molecule.scores.dropoutRanking}/5</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Revenue (2Y)</p>
                                <p className="font-semibold">
                                  ${molecule.marketData.reduce((sum, m) => sum + m.revenueProjection.year1 + m.revenueProjection.year2, 0).toFixed(0)}M
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Launch Probability</div>
                              <div className="text-3xl font-bold text-primary">{molecule.overallScore}%</div>
                            </div>
                            <Button onClick={(e) => { e.stopPropagation(); setSelectedMolecule(molecule.id); }}>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">Comprehensive Due Diligence Report</h2>
                    <Button variant="secondary" size="sm" onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMolecule(null)}>
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
                />
                
                {activeMolecule.launchFactors && (
                  <LaunchFactorsCard
                    factors={activeMolecule.launchFactors}
                    moleculeName={activeMolecule.name}
                  />
                )}
                
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
                
                {activeMolecule.hasRetrospective && activeMolecule.retrospectivePhases && (
                  <RetrospectiveTimeline
                    moleculeName={activeMolecule.name}
                    indication={activeMolecule.indication}
                    sponsor={activeMolecule.company}
                    phases={activeMolecule.retrospectivePhases}
                  />
                )}
              </div>
            ) : null}
          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Molecule Database</CardTitle>
                <CardDescription>Browse and analyze clinical trial molecules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Molecule profiling interface will be displayed here</p>
                  <p className="text-sm mt-2">Integration with trials.gov and clinical databases</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timelines Tab */}
          <TabsContent value="timelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline Analysis</CardTitle>
                <CardDescription>Multi-scenario approval predictions by country and authority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Timeline calculation and visualization tools</p>
                  <p className="text-sm mt-2">Country-specific regulatory pathways and projections</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Intelligence</CardTitle>
                <CardDescription>Country-specific legal landscapes and pharma company benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Regulatory landscape mapping and analysis</p>
                  <p className="text-sm mt-2">Market entry strategies and average launch timelines</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
