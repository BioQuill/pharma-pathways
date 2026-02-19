import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, Globe, TrendingUp, Shield, Stethoscope, Activity, Brain, Pill, Heart, Eye, FlaskConical, Calculator } from "lucide-react";
import { taSpecificScoringData } from "@/lib/taSpecificScoringData";
import { MWPSPICalculator } from "@/components/MWPSPICalculator";

// ============ TYPES ============
interface ScoringItem { label: string; points: string; detail?: string; }
interface ScoringSection { title: string; maxPoints: string; items: ScoringItem[]; }
interface ProbabilityBand { range: string; label: string; description: string; color: string; }
interface PayerAdjustment { payer: string; adjustment: string; }
interface MarketModel {
  market: string; flag: string; weights: { clinical: number; economic: number; access: number; political: number; notes: string };
  clinicalScoring: ScoringSection[];
  economicScoring: ScoringSection[];
  accessScoring: ScoringSection[];
  politicalScoring: ScoringSection[];
  payerAdjustments?: PayerAdjustment[];
  probabilityBands: ProbabilityBand[];
}

interface TACustomization {
  name: string;
  icon: string;
  marketWeights: { market: string; clinical: number; economic: number; access: number; political: number; notes: string }[];
  clinicalScoring: { market: string; sections: ScoringSection[] }[];
  economicScoring: { market: string; sections: ScoringSection[] }[];
  accessScoring: { market: string; sections: ScoringSection[] }[];
  probabilityBands?: { market: string; veryHigh: string; high: string; moderate: string; low: string }[];
  adjustments: { add: { item: string; points: string }[]; subtract: { item: string; points: string }[] };
}

// ============ CORE FRAMEWORK DATA ============
const coreFormula = "MWPSPI = (Clinical Score × W₁) + (Economic Score × W₂) + (Access Score × W₃) + (Political Score × W₄)";

const marketModels: MarketModel[] = [
  {
    market: "United States", flag: "🇺🇸",
    weights: { clinical: 25, economic: 35, access: 25, political: 15, notes: "Fragmented multi-payer system" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-25", items: [
        { label: "Efficacy vs. SOC", points: "0-10", detail: "Superiority +10; non-inferiority +5" },
        { label: "Safety profile", points: "0-8", detail: "Clean safety +8; black box -3" },
        { label: "Unmet need", points: "0-7", detail: "Orphan/breakthrough +7; crowded market +2" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-35", items: [
        { label: "ICER vs. $150K/QALY threshold", points: "0-15", detail: "<$50K/QALY: +15 | $50-100K: +12 | $100-150K: +8 | >$150K: +3" },
        { label: "Budget impact per plan", points: "0-10", detail: "<$50M/year +10; >$500M +2" },
        { label: "Cost offsets documented", points: "0-10", detail: "Hospitalizations, ER visits, etc." },
      ]},
    ],
    accessScoring: [
      { title: "Access/Market Factors", maxPoints: "0-25", items: [
        { label: "Payer tier penetration strategy", points: "0-8", detail: "Mega-payers (UnitedHealth, Anthem): +8 if priority formulary access | Medicare coverage: +6 if Part B/D pathway clear | Medicaid MCO adoption: +3" },
        { label: "PBM formulary positioning", points: "0-10", detail: "Tier 2 preferred +10; Tier 3 +5; specialty tier +7" },
        { label: "Prior authorization burden", points: "0-7", detail: "Minimal PA +7; extensive -3" },
      ]},
    ],
    politicalScoring: [
      { title: "Political/Procedural", maxPoints: "0-15", items: [
        { label: "FDA designation", points: "0-8", detail: "Breakthrough +8; Fast Track +5; standard +2" },
        { label: "Risk-sharing willingness", points: "0-4", detail: "Outcomes-based rebates feasible +4" },
        { label: "Professional society endorsement", points: "0-3", detail: "Strong guideline +3" },
      ]},
    ],
    payerAdjustments: [
      { payer: "UnitedHealth/Anthem/CVS", adjustment: "Add +5 if integrated care pathway (Optum/Carelon/MinuteClinic synergy)" },
      { payer: "Medicare", adjustment: "Add +10 if OLDM (Oncology Care Model) or CKD pathway eligible" },
      { payer: "Medicaid MCOs (Centene/Molina)", adjustment: "Subtract -10 if >$100K/year per patient (budget constraints)" },
      { payer: "Kaiser Permanente", adjustment: "Add +8 if population health metrics improved (integrated model rewards prevention)" },
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: ">85% approval likelihood; payment 30-45 days", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: ">70% approval; negotiate rebates 10-15%", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "50-60% approval; 20-30% rebates + prior auth", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "<40% approval; restricted access, high patient cost-sharing", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Likely denial or specialty pharmacy-only", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "United Kingdom", flag: "🇬🇧",
    weights: { clinical: 35, economic: 45, access: 10, political: 10, notes: "NHS Single-Payer; NICE threshold dominant" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-35", items: [
        { label: "QALY gain vs. SOC", points: "0-15", detail: ">2 QALYs +15; 1-2 +10; <1 +5" },
        { label: "Magnitude of benefit", points: "0-12", detail: "Survival +12; QoL only +6" },
        { label: "Unmet need severity", points: "0-8", detail: "End-of-life +8; rare disease +6; chronic +4" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-45", items: [
        { label: "ICER vs. £20-30K/QALY", points: "0-30", detail: "<£20K: +30 | £20-30K: +25 | £30-50K: +15 (if end-of-life criteria met) | £50-100K: +8 (if rare disease flexibility) | >£100K: +2 (HST pathway only)" },
        { label: "Cost offsets (bed days, complications)", points: "0-5" },
        { label: "Budget impact NHS England", points: "0-10", detail: "<£50M +10; >£500M +2" },
      ]},
    ],
    accessScoring: [
      { title: "Access Factors", maxPoints: "0-10", items: [
        { label: "NICE appraisal pathway", points: "0-6", detail: "STA fast-track +6; MTA +4; HST +5" },
        { label: "Clinical commissioning feasibility", points: "0-4", detail: "Existing infrastructure +4" },
      ]},
    ],
    politicalScoring: [
      { title: "Political/Equity", maxPoints: "0-10", items: [
        { label: "Condition prioritization", points: "0-5", detail: "NHS England priority area +5" },
        { label: "Health inequality impact", points: "0-3", detail: "Reduces disparity +3" },
        { label: "Public/patient advocacy", points: "0-2" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "NICE recommendation likely; payment monthly, reliable", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "Recommendation with managed access; CDF possible", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "Optimized recommendation likely; price reduction needed 20-40%", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "Interim funding possible; major rebates required 40-60%", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Likely rejection; only private market", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "Germany", flag: "🇩🇪",
    weights: { clinical: 40, economic: 30, access: 20, political: 10, notes: "G-BA/IQWiG stringent; Bismarck sickness funds" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-40", items: [
        { label: "AMNOG additional benefit rating", points: "0-25", detail: "Considerable (3): +25 | Minor (4): +18 | Non-quantifiable (5): +10 | No additional benefit (6): +3" },
        { label: "Evidence quality (IQWiG ROBINS-I)", points: "0-10", detail: "RCT head-to-head +10; indirect +5" },
        { label: "Patient-relevant endpoints", points: "0-5", detail: "Mortality/morbidity +5; surrogate +2" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-30", items: [
        { label: "Price vs. comparator (reference pricing)", points: "0-15", detail: "Parity +15; premium +10 if benefit 3/4" },
        { label: "Budget impact sickness funds", points: "0-10", detail: "<€100M +10; >€500M +3" },
        { label: "Cost-effectiveness implied", points: "0-5", detail: "IQWiG favorable +5" },
      ]},
    ],
    accessScoring: [
      { title: "Access Factors", maxPoints: "0-20", items: [
        { label: "Market access timing", points: "0-10", detail: "Immediate launch +10; delayed 6mo negotiation +5" },
        { label: "Orphan exemption", points: "0-10", detail: "Orphan status +10; no AMNOG assessment" },
      ]},
    ],
    politicalScoring: [
      { title: "Procedural", maxPoints: "0-10", items: [
        { label: "Manufacturer negotiation flexibility", points: "0-6", detail: "Rebate 15-30% acceptable +6" },
        { label: "Specialist endorsement (Fachgesellschaften)", points: "0-4" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "Additional benefit 3-4; premium pricing 20-40%; payment 30-45 days", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "Minor benefit; 10-20% premium; quarterly settlement", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "Non-quantifiable; reference pricing; 15-25% rebate", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "No additional benefit; reference pricing -20%; restricted access", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Rejection likely; private market only", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "Japan", flag: "🇯🇵",
    weights: { clinical: 30, economic: 25, access: 30, political: 15, notes: "Innovation premium unique to Japan; multi-payer social insurance" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-30", items: [
        { label: "Efficacy vs. existing therapy", points: "0-15", detail: "Superiority +15; non-inferiority +8" },
        { label: "Japanese clinical trial data", points: "0-10", detail: "Phase III Japan +10; bridging study +5; foreign only +2" },
        { label: "Safety in Japanese population", points: "0-5" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-25", items: [
        { label: "Price vs. comparator (similarity rule)", points: "0-15", detail: "Competitive +15; premium justified +10" },
        { label: "Budget impact NHIS", points: "0-10", detail: "<¥50B +10; >¥200B +3" },
      ]},
    ],
    accessScoring: [
      { title: "Innovation Premium", maxPoints: "0-30", items: [
        { label: "Novel mechanism eligibility", points: "0-15", detail: "New MOA +15; new target +10; me-too +3" },
        { label: "Unmet need (MHLW priority)", points: "0-10", detail: "Pediatric rare +10; oncology +7; chronic +4" },
        { label: "Usefulness category", points: "0-5", detail: "Category I premium +5" },
      ]},
    ],
    politicalScoring: [
      { title: "Procedural", maxPoints: "0-15", items: [
        { label: "PMDA approval pathway", points: "0-8", detail: "Sakigake +8; conditional +5; standard +3" },
        { label: "Repricing risk mitigation", points: "0-4", detail: "Sales volume < market expansion +4" },
        { label: "Specialist society support", points: "0-3" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "Innovation premium + MHLW priority; 20-50% premium pricing; payment 45-60 days", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "Premium eligible; 10-20% above comparator", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "Similarity pricing; repricing risk", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "No premium; downward price pressure -10 to -20%", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Rejection or severe restriction", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "China", flag: "🇨🇳",
    weights: { clinical: 25, economic: 35, access: 30, political: 10, notes: "NHSA Government-Directed; VBP price pressure" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-25", items: [
        { label: "Efficacy vs. SOC", points: "0-12", detail: "Significant improvement +12; marginal +6" },
        { label: "Chinese clinical trial data", points: "0-8", detail: "Phase III China +8; none -5 penalty" },
        { label: "Unmet need severity", points: "0-5", detail: "Rare disease +5; chronic +3" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-35", items: [
        { label: "Price reduction willingness (VBP)", points: "0-20", detail: "60-70% cut acceptable: +20 | 50-60%: +15 | 30-50%: +10 | <30%: +3" },
        { label: "Budget impact NHSA", points: "0-10", detail: "Low burden +10; high burden +2" },
        { label: "Cost offsets (hospitalization)", points: "0-5" },
      ]},
    ],
    accessScoring: [
      { title: "Volume Commitment", maxPoints: "0-30", items: [
        { label: "VBP volume guarantee feasibility", points: "0-20", detail: "50-80% market share commitment +20; <30% +5" },
        { label: "Manufacturing capacity China", points: "0-10", detail: "Local production +10; import only +3" },
      ]},
    ],
    politicalScoring: [
      { title: "Political Alignment", maxPoints: "0-10", items: [
        { label: "NHSA strategic priority", points: "0-6", detail: "Healthy China 2030 goals +6" },
        { label: "Technology transfer", points: "0-4", detail: "IP sharing +4; none +0" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "VBP inclusion; 60-70% price cut; volume 50-80% market; payment 30-90 days often delayed", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "NHSA negotiation; 50-60% cut; payment 60-120 days", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "Provincial listing; 30-50% cut; payment often >90 days", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "Limited access; private insurance only; payment delays common", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Exclusion likely", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "India", flag: "🇮🇳",
    weights: { clinical: 20, economic: 40, access: 30, political: 10, notes: "Fragmented multi-scheme; affordability critical" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-20", items: [
        { label: "Efficacy vs. available therapy", points: "0-10", detail: "Major improvement +10; incremental +5" },
        { label: "Safety in Indian population", points: "0-6", detail: "Demonstrated +6; uncertain +2" },
        { label: "Unmet need", points: "0-4", detail: "PM-JAY priority disease +4" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-40", items: [
        { label: "PM-JAY affordability", points: "0-20", detail: "< ₹5 lakh/patient/year: +20 | ₹5-10 lakh: +12 | ₹10-20 lakh: +6 | >₹20 lakh: +2" },
        { label: "CGHS rate card alignment", points: "0-12", detail: "Within 2x standard rates +12; >5x +3" },
        { label: "Private insurance willingness", points: "0-8", detail: "Premium segment +8; mass market +4" },
      ]},
    ],
    accessScoring: [
      { title: "Access Strategy", maxPoints: "0-30", items: [
        { label: "Multi-scheme positioning", points: "0-15", detail: "PM-JAY empanelment: +8 | CGHS coverage: +4 | ESICS inclusion: +3" },
        { label: "Hospital network reach", points: "0-10", detail: "1000+ empaneled hospitals +10; <100 +3" },
        { label: "State scheme variations", points: "0-5", detail: "5+ state schemes +5" },
      ]},
    ],
    politicalScoring: [
      { title: "Volume Potential", maxPoints: "0-10", items: [
        { label: "Patient population size", points: "0-6", detail: ">1M patients +6; <100K +2" },
        { label: "Generic competition timeline", points: "0-4", detail: "5+ years exclusivity +4; immediate +0" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "PM-JAY inclusion; CGHS approved; payment 15-30 days private / 30-90+ days government", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "CGHS + state schemes; payment 30-60 days mixed", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "Selective scheme coverage; payment 60-120 days government delays", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "Private insurance only; OOP burden; payment variable", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Exclusion; minimal access", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
  {
    market: "Brazil", flag: "🇧🇷",
    weights: { clinical: 30, economic: 35, access: 25, political: 10, notes: "SUS + Private; CONITEC budget impact" },
    clinicalScoring: [
      { title: "Clinical Value", maxPoints: "0-30", items: [
        { label: "Efficacy vs. SUS alternatives", points: "0-15", detail: "Major benefit +15; marginal +8" },
        { label: "Brazilian clinical data", points: "0-10", detail: "Local trial +10; LATAM data +5; none +2" },
        { label: "Unmet need priority", points: "0-5", detail: "CONITEC priority +5" },
      ]},
    ],
    economicScoring: [
      { title: "Economic Value", maxPoints: "0-35", items: [
        { label: "CONITEC budget impact", points: "0-20", detail: "<BRL 100M/year +20; >BRL 500M +5" },
        { label: "Cost-effectiveness", points: "0-10", detail: "Favorable +10; borderline +5" },
        { label: "CMED pricing acceptance", points: "0-5", detail: "Within price controls +5" },
      ]},
    ],
    accessScoring: [
      { title: "SUS Access", maxPoints: "0-25", items: [
        { label: "CONITEC recommendation likelihood", points: "0-15", detail: "Strong evidence +15; weak +5" },
        { label: "Implementation feasibility", points: "0-6", detail: "Existing infrastructure +6; new program -2" },
        { label: "State adoption probability", points: "0-4", detail: "Federal mandate +4; state-by-state +2" },
      ]},
    ],
    politicalScoring: [
      { title: "Private Market", maxPoints: "0-10", items: [
        { label: "Private insurer adoption", points: "0-6", detail: "ANS coverage +6" },
        { label: "Middle-class affordability", points: "0-4", detail: "Accessible +4; luxury only +1" },
      ]},
    ],
    probabilityBands: [
      { range: "80-100", label: "Very High", description: "CONITEC positive; SUS inclusion; payment 90+ days delays common", color: "bg-green-100 text-green-800 border-green-200" },
      { range: "60-79", label: "High", description: "CONITEC approval likely; payment 90-180 days", color: "bg-blue-100 text-blue-800 border-blue-200" },
      { range: "40-59", label: "Moderate", description: "State-level only; private insurance; payment 60-90 days private / 120+ SUS", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      { range: "20-39", label: "Low", description: "Private market only; payment 30-45 days private", color: "bg-orange-100 text-orange-800 border-orange-200" },
      { range: "0-19", label: "Very Low", description: "Exclusion likely", color: "bg-red-100 text-red-800 border-red-200" },
    ],
  },
];

// ============ TA-SPECIFIC WEIGHTS DATA ============
const taWeightsData: { name: string; markets: { market: string; clinical: number; economic: number; access: number; political: number; notes: string }[]; adjustments: { add: { item: string; points: string }[]; subtract: { item: string; points: string }[] } }[] = [
  {
    name: "1. Oncology",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "Payers increasingly scrutinize budget impact despite oncology priority" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Part B/D pathway critical; CMS OCM participation bonus" },
      { market: "UK NICE", clinical: 40, economic: 40, access: 10, political: 10, notes: "End-of-life criteria provide flexibility; £50K-100K/QALY possible" },
      { market: "Germany G-BA", clinical: 45, economic: 30, access: 15, political: 10, notes: "Highest clinical scrutiny; early benefit assessment" },
      { market: "Japan MHLW", clinical: 30, economic: 25, access: 30, political: 15, notes: "Innovation premium common; repricing risk for blockbusters" },
      { market: "China NHSA", clinical: 25, economic: 40, access: 25, political: 10, notes: "VBP pressure intense even for oncology; 50-70% cuts" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Budget constraints severe; catastrophic coverage priority" },
      { market: "Brazil CONITEC", clinical: 30, economic: 40, access: 20, political: 10, notes: "Oncology priority but budget impact analysis stringent" },
    ],
    adjustments: {
      add: [
        { item: "First-in-class mechanism", points: "+8 (all markets)" },
        { item: "Curative intent (vs. palliative)", points: "+10 (US/EU)" },
        { item: "Pediatric indication", points: "+12 (UK/Germany/US)" },
        { item: "Liquid biopsy companion diagnostic", points: "+6 (US)" },
        { item: "Immunotherapy combination backbone", points: "+5 (US commercial)" },
      ],
      subtract: [
        { item: "Third/fourth-line only", points: "-8 (all markets)" },
        { item: "Single-arm trial without control", points: "-10 (Germany/UK)" },
        { item: "No PD-L1 or biomarker enrichment", points: "-5 (US payers)" },
      ],
    },
  },
  {
    name: "2. Cardiology",
    markets: [
      { market: "US", clinical: 25, economic: 35, access: 25, political: 15, notes: "High scrutiny due to large prevalent populations" },
      { market: "US Medicare", clinical: 30, economic: 30, access: 25, political: 15, notes: "Part D coverage; outcomes-based contracts growing" },
      { market: "UK NICE", clinical: 35, economic: 45, access: 10, political: 10, notes: "Cost-effectiveness threshold strict for chronic diseases" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Long-term outcomes data required" },
      { market: "Japan MHLW", clinical: 25, economic: 30, access: 30, political: 15, notes: "Aging population priority; budget pressure" },
      { market: "China NHSA", clinical: 20, economic: 40, access: 30, political: 10, notes: "CVD national priority but VBP pressure severe" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Catastrophic CVD events covered; chronic management limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Hypertension/diabetes prioritized; budget constrained" },
    ],
    adjustments: {
      add: [
        { item: "Primary prevention indication", points: "+10 (US/EU)" },
        { item: "Fixed-dose combination", points: "+6 (adherence benefit)" },
        { item: "Once-weekly or once-monthly dosing", points: "+8 (vs. daily)" },
        { item: "Diabetes + CVD dual indication", points: "+7 (comorbidity management)" },
        { item: "Heart failure with preserved EF (HFpEF)", points: "+12 (high unmet need)" },
      ],
      subtract: [
        { item: "Third-line or later", points: "-10 (competitive market)" },
        { item: "Requires IV administration (vs. oral)", points: "-8 (access barrier)" },
        { item: "Generic competitors available", points: "-15 (severe)" },
        { item: "Surrogate endpoint only without outcomes trial", points: "-12 (Germany/UK)" },
      ],
    },
  },
  {
    name: "3. Neurology/CNS",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "Mental health parity laws; high unmet need premium" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Alzheimer's/Parkinson's prioritized" },
      { market: "UK NICE", clinical: 40, economic: 35, access: 15, political: 10, notes: "QoL focus for neurodegenerative; caregiver burden considered" },
      { market: "Germany G-BA", clinical: 45, economic: 25, access: 20, political: 10, notes: "Patient-relevant outcomes critical (ADLs, cognition)" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Aging population/dementia priority; innovation premium" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "Mental health growing priority; affordability barrier" },
      { market: "India PM-JAY", clinical: 15, economic: 50, access: 25, political: 10, notes: "Acute neuro (stroke) covered; chronic management limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Mental health priority but budget constraint" },
    ],
    adjustments: {
      add: [
        { item: "Disease-modifying (vs. symptomatic)", points: "+15 (Alzheimer's, MS)" },
        { item: "Biomarker-confirmed mechanism", points: "+10 (amyloid PET, tau)" },
        { item: "Suicide prevention indication", points: "+12 (US mental health priority)" },
        { item: "Pediatric epilepsy (Dravet, LGS)", points: "+14 (rare, severe)" },
        { item: "Long-acting injectable (LAI) schizophrenia", points: "+8 (adherence)" },
        { item: "First oral therapy in class", points: "+10 (MS, narcolepsy)" },
      ],
      subtract: [
        { item: "No disease modification in neurodegeneration", points: "-12 (symptomatic only)" },
        { item: "Controlled substance (DEA schedule)", points: "-8 (access barriers)" },
        { item: "No head-to-head vs. standard", points: "-10 (Germany requirement)" },
        { item: "Cognitive side effects", points: "-6 (sedation, memory impairment)" },
        { item: "Requires specialized imaging for monitoring", points: "-5 (cost/access)" },
      ],
    },
  },
  {
    name: "4. Dermatology",
    markets: [
      { market: "US", clinical: 25, economic: 30, access: 30, political: 15, notes: "Medical vs. cosmetic distinction critical; prior auth common" },
      { market: "US Medicare", clinical: 25, economic: 30, access: 30, political: 15, notes: "Part D coverage; step therapy typical" },
      { market: "UK NICE", clinical: 30, economic: 45, access: 15, political: 10, notes: "QoL impact recognized but cost-effectiveness strict" },
      { market: "Germany G-BA", clinical: 35, economic: 30, access: 25, political: 10, notes: "Patient-relevant QoL central (DLQI scores)" },
      { market: "Japan MHLW", clinical: 25, economic: 30, access: 30, political: 15, notes: "Aesthetic market strong; innovation premium limited" },
      { market: "China NHSA", clinical: 20, economic: 40, access: 30, political: 10, notes: "Severe disease only; cosmetic excluded" },
      { market: "India PM-JAY", clinical: 15, economic: 50, access: 25, political: 10, notes: "Severe dermatology only; chronic management OOP" },
      { market: "Brazil CONITEC", clinical: 20, economic: 45, access: 25, political: 10, notes: "Limited coverage; psoriasis/severe atopic prioritized" },
    ],
    adjustments: {
      add: [
        { item: "Nail/joint psoriasis coverage", points: "+8 (beyond skin)" },
        { item: "Pediatric atopic dermatitis", points: "+10 (2-17 years, high unmet need)" },
        { item: "Once-monthly or less frequent dosing", points: "+6 (vs. weekly/biweekly)" },
        { item: "Oral vs. injectable", points: "+8 (patient preference)" },
        { item: "Head-to-head superiority vs. IL-17/IL-23", points: "+7 (US payers)" },
      ],
      subtract: [
        { item: "Cosmetic indication overlap", points: "-15 (payer exclusion risk)" },
        { item: "Mild disease only", points: "-12 (not covered typically)" },
        { item: "No systemic failure requirement", points: "-8 (step therapy enforced)" },
        { item: "Requires specialty pharmacy", points: "-5 (access barrier)" },
      ],
    },
  },
  {
    name: "5. Endocrinology",
    markets: [
      { market: "US", clinical: 25, economic: 35, access: 25, political: 15, notes: "Diabetes dominates; obesity coverage growing; budget impact huge" },
      { market: "US Medicare", clinical: 30, economic: 30, access: 25, political: 15, notes: "Part D diabetes coverage extensive; obesity excluded" },
      { market: "UK NICE", clinical: 30, economic: 50, access: 10, political: 10, notes: "Cost-effectiveness threshold very strict for prevalent conditions" },
      { market: "Germany G-BA", clinical: 35, economic: 30, access: 25, political: 10, notes: "CVOT data expected; additional benefit vs. established SOC" },
      { market: "Japan MHLW", clinical: 25, economic: 30, access: 30, political: 15, notes: "Diabetes prevalent; insulin pricing pressure; innovation premium for novel mechanisms" },
      { market: "China NHSA", clinical: 20, economic: 45, access: 25, political: 10, notes: "Diabetes epidemic; insulin VBP 60-80% cuts precedent" },
      { market: "India PM-JAY", clinical: 15, economic: 50, access: 25, political: 10, notes: "Diabetes/chronic disease coverage limited; acute complications covered" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Diabetes prioritized; budget constrained" },
    ],
    adjustments: {
      add: [
        { item: "Cardiovascular outcomes trial (CVOT) positive", points: "+15 (US/EU diabetes)" },
        { item: "Renal outcomes benefit (dialysis delay)", points: "+12 (eGFR protection)" },
        { item: "Once-weekly dosing", points: "+8 (vs. daily)" },
        { item: "Oral GLP-1 or insulin", points: "+10 (vs. injectable)" },
        { item: "Weight loss + diabetes dual benefit", points: "+10 (especially US commercial)" },
        { item: "Pediatric Type 2 diabetes", points: "+8 (growing epidemic)" },
      ],
      subtract: [
        { item: "No CVOT data", points: "-12 (required by FDA; Germany/UK expect)" },
        { item: "Obesity indication without comorbidity", points: "-20 (Medicare excluded; commercial variable)" },
        { item: "Injectable vs. oral", points: "-6 (patient preference)" },
        { item: "Hypoglycemia risk vs. newer classes", points: "-8" },
        { item: "Requires frequent monitoring", points: "-5 (fingersticks, CGM)" },
      ],
    },
  },
  {
    name: "6. Immunology",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "Biologics common; prior auth extensive; specialty pharmacy" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Part B infusibles; Part D subcutaneous; cost-sharing concern" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "QoL improvement recognized; cost-effectiveness threshold firm" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Patient-relevant endpoints critical; head-to-head required" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Autoimmune priority; biologics innovation premium" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "Growing coverage; VBP pressure moderate (specialty drugs)" },
      { market: "India PM-JAY", clinical: 15, economic: 50, access: 25, political: 10, notes: "Severe cases only; biologics mostly OOP" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "RA, IBD prioritized; budget constraints" },
    ],
    adjustments: {
      add: [
        { item: "Dual mechanism or novel target (non-TNF, non-IL)", points: "+12 (JAK, IL-23, BAFF)" },
        { item: "Oral vs. injectable biologics", points: "+10 (JAK inhibitors, S1P modulators)" },
        { item: "Once-monthly or less frequent dosing", points: "+8 (vs. weekly/biweekly)" },
        { item: "No immunogenicity (fully human mAb)", points: "+6" },
        { item: "Pediatric indication (JIA, pediatric IBD)", points: "+10" },
        { item: "IBD: both Crohn's and UC indication", points: "+7" },
        { item: "Biosimilar competition delayed (strong IP)", points: "+8" },
      ],
      subtract: [
        { item: "Third-line or later positioning", points: "-10" },
        { item: "Black box warning (infections, malignancy)", points: "-8" },
        { item: "Requires IV infusion (vs. subcutaneous)", points: "-6" },
        { item: "No radiographic progression data (RA)", points: "-10 (Germany/UK expect)" },
        { item: "No mucosal healing data (IBD)", points: "-8 (key endpoint)" },
        { item: "Biosimilar competition imminent (<2 years)", points: "-12" },
      ],
    },
  },
  {
    name: "7. Infectious Diseases",
    markets: [
      { market: "US", clinical: 35, economic: 25, access: 25, political: 15, notes: "AMR priority; hospital formulary critical; QIDP incentives" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Part A/B hospital; Part D outpatient; stewardship programs" },
      { market: "UK NICE", clinical: 40, economic: 30, access: 20, political: 10, notes: "AMR national priority; NHS England direct procurement" },
      { market: "Germany G-BA", clinical: 40, economic: 25, access: 25, political: 10, notes: "Reserve antibiotics valued; stewardship integrated" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Pandemic preparedness priority; innovation premium" },
      { market: "China NHSA", clinical: 30, economic: 35, access: 25, political: 10, notes: "AMR concern growing; essential medicines list priority" },
      { market: "India PM-JAY", clinical: 25, economic: 45, access: 20, political: 10, notes: "Acute infections covered; resistance crisis severe" },
      { market: "Brazil CONITEC", clinical: 30, economic: 35, access: 25, political: 10, notes: "TB, HIV priority; hospital procurement dominant" },
    ],
    adjustments: {
      add: [
        { item: "QIDP designation", points: "+10 (US; 5-year exclusivity extension)" },
        { item: "GAIN Act designation", points: "+8 (US)" },
        { item: "NTAP (New Technology Add-on Payment) Medicare", points: "+6" },
        { item: "Novel mechanism vs. MDR/XDR pathogens", points: "+12 (all markets)" },
        { item: "Oral bioavailability (vs. IV-only)", points: "+8 (outpatient shift)" },
        { item: "Pan-resistant coverage (CRE, MRSA, VRE)", points: "+15 (reserve status)" },
        { item: "HCV cure (>95% SVR12)", points: "+12 (curative, cost-offset)" },
      ],
      subtract: [
        { item: "No AMR relevance (standard spectrum)", points: "-10 (all markets)" },
        { item: "IV-only administration", points: "-8 (hospital-only access)" },
        { item: "High nephro/hepatotoxicity", points: "-8 (safety concern)" },
        { item: "Generic antibiotic competition", points: "-15 (severe price pressure)" },
        { item: "No clinical trial vs. SOC", points: "-10 (regulatory/payer concern)" },
      ],
    },
  },
  {
    name: "8. Respiratory",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "Severe asthma biologics growing; COPD prevalent; inhaler competition" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "COPD elderly; Part D inhalers; Part B biologics" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "Asthma/COPD NICE guidelines; cost-effectiveness for biologics" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Patient-relevant exacerbation endpoints; long-term data" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Aging COPD population; asthma prevalence lower" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "COPD epidemic (smoking); asthma biologics emerging" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Acute exacerbations covered; chronic management limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Asthma prioritized; biologics budget barrier" },
    ],
    adjustments: {
      add: [
        { item: "First biologic with novel mechanism (TSLP, IL-4/13)", points: "+12" },
        { item: "Oral vs. injectable biologic", points: "+10" },
        { item: "Triple fixed-dose combination (COPD)", points: "+8 (adherence)" },
        { item: "COPD mortality benefit", points: "+15 (rare endpoint, high value)" },
        { item: "Pediatric asthma indication", points: "+10 (6-11 years)" },
        { item: "Biomarker-guided therapy (Type 2 asthma)", points: "+7" },
      ],
      subtract: [
        { item: "No exacerbation reduction (lung function only)", points: "-12" },
        { item: "IV infusion required", points: "-8" },
        { item: "Requires specialized testing (FeNO, periostin)", points: "-5" },
        { item: "Black box warning (LABAs without ICS)", points: "-10" },
        { item: "Generic inhaler competition", points: "-12" },
      ],
    },
  },
  {
    name: "9. Gastroenterology",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "IBD biologics high cost; GERD/IBS competitive; liver disease emerging" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "IBD elderly segment; cirrhosis complications; Part B infusions" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "IBD priority; NICE appraisals for biologics; QoL emphasis" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Endoscopic endpoints (mucosal healing) valued" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "IBD prevalence increasing; GI cancer screening priority" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "IBD emerging; hepatitis B/liver disease priority" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Acute GI covered; IBD chronic limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "IBD prioritized; hepatitis C cured focus" },
    ],
    adjustments: {
      add: [
        { item: "Both Crohn's and UC indication", points: "+10" },
        { item: "Mucosal healing primary endpoint", points: "+8" },
        { item: "Oral vs. injectable/infusion (IBD)", points: "+12 (JAK, S1P)" },
        { item: "Steroid-free maintenance", points: "+8" },
        { item: "NASH: fibrosis regression", points: "+15 (unmet need)" },
        { item: "Fistulizing Crohn's indication", points: "+10" },
        { item: "Pediatric IBD", points: "+10 (6-17 years)" },
      ],
      subtract: [
        { item: "IV infusion required", points: "-8 (vs. subcutaneous)" },
        { item: "Induction-only (no maintenance data)", points: "-12" },
        { item: "No endoscopic healing data", points: "-10 (Germany/UK expect)" },
        { item: "Requires therapeutic drug monitoring", points: "-6" },
        { item: "NASH: no fibrosis data, histology only", points: "-10 (surrogate)" },
        { item: "Biosimilar competition (IBD)", points: "-12" },
      ],
    },
  },
  {
    name: "10. Hematology",
    markets: [
      { market: "US", clinical: 35, economic: 25, access: 25, political: 15, notes: "Oncology-hematology overlap; rare blood disorders orphan premium" },
      { market: "US Medicare", clinical: 40, economic: 20, access: 25, political: 15, notes: "Elderly hematologic malignancies; Part B infusions; Part D oral" },
      { market: "UK NICE", clinical: 40, economic: 35, access: 15, political: 10, notes: "Cancer Drugs Fund for malignancies; rare disease flexibility" },
      { market: "Germany G-BA", clinical: 45, economic: 25, access: 20, political: 10, notes: "Orphan exemptions common; clinical benefit assessment stringent" },
      { market: "Japan MHLW", clinical: 35, economic: 25, access: 25, political: 15, notes: "Aging population; innovation premium for novel mechanisms" },
      { market: "China NHSA", clinical: 30, economic: 35, access: 25, political: 10, notes: "Hematologic malignancies priority; rare diseases limited" },
      { market: "India PM-JAY", clinical: 25, economic: 45, access: 20, political: 10, notes: "Acute leukemia, severe anemia covered; chronic limited" },
      { market: "Brazil CONITEC", clinical: 30, economic: 35, access: 25, political: 10, notes: "Hemophilia prioritized; rare disorders budget barrier" },
    ],
    adjustments: {
      add: [
        { item: "Gene therapy (curative potential)", points: "+18 (all markets)" },
        { item: "MRD-negativity endpoint", points: "+10 (deep response)" },
        { item: "Oral targeted therapy (leukemia/lymphoma)", points: "+10 (vs. IV chemo)" },
        { item: "Subcutaneous vs. IV (myeloma, lymphoma)", points: "+8" },
        { item: "Orphan designation", points: "+10 (all markets)" },
        { item: "Pediatric hematologic malignancy", points: "+12 (ALL, AML)" },
      ],
      subtract: [
        { item: "Single-arm trial without control", points: "-10 (Germany/UK)" },
        { item: "No OS data, PFS-only", points: "-8 (surrogate)" },
        { item: "High toxicity (Grade 3+ AEs >60%)", points: "-10" },
        { item: "Gene therapy: no long-term durability data (>5 years)", points: "-8 (UK/Germany)" },
        { item: "Hemophilia: limited bleed prevention data", points: "-10" },
        { item: "No companion diagnostic for targeted therapy", points: "-7" },
      ],
    },
  },
  {
    name: "11. Rheumatology",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "RA biologics mature market; biosimilars emerging; JAK inhibitors" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Elderly RA/OA; Part B infusions; Part D oral/subcutaneous" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "Cost-effectiveness critical; biosimilars encouraged" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Radiographic progression data required; head-to-head trials" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "RA prevalence; tight disease control emphasis" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "RA priority; VBP for biologics/biosimilars" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Acute rheumatic complications; chronic DMARD access limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "RA biologics prioritized; budget constraints" },
    ],
    adjustments: {
      add: [
        { item: "Radiographic progression halt (RA)", points: "+10 (Germany/UK critical)" },
        { item: "Oral vs. injectable", points: "+12 (JAK inhibitors)" },
        { item: "Novel mechanism (non-TNF, non-IL-6)", points: "+10 (JAK, BAFF, CD20)" },
        { item: "Biosimilar with interchangeability", points: "+8 (US pharmacy substitution)" },
        { item: "Dual indication (RA + PsA + AS)", points: "+7" },
        { item: "SLE: first biologic, high unmet need", points: "+12" },
        { item: "Pediatric indication (JIA)", points: "+10" },
      ],
      subtract: [
        { item: "No radiographic progression data (RA)", points: "-12 (Germany/UK expect)" },
        { item: "Third-line or later", points: "-10 (biosimilar TNF competition)" },
        { item: "IV infusion required", points: "-8 (vs. subcutaneous/oral)" },
        { item: "Black box warning (infections, malignancy, thrombosis-JAK)", points: "-10" },
        { item: "High immunogenicity risk", points: "-7 (chimeric antibodies)" },
      ],
    },
  },
  {
    name: "12. Ophthalmology",
    markets: [
      { market: "US", clinical: 35, economic: 25, access: 25, political: 15, notes: "Retinal diseases (AMD, DME); Medicare Part B buy-and-bill critical" },
      { market: "US Medicare", clinical: 40, economic: 20, access: 25, political: 15, notes: "Elderly AMD prevalent; Part B medical benefit; ASP+6% reimbursement" },
      { market: "UK NICE", clinical: 40, economic: 35, access: 15, political: 10, notes: "Vision preservation high priority; cost-effectiveness strict" },
      { market: "Germany G-BA", clinical: 45, economic: 25, access: 20, political: 10, notes: "Patient-relevant vision endpoints; anti-VEGF mature market" },
      { market: "Japan MHLW", clinical: 35, economic: 25, access: 25, political: 15, notes: "Aging population; retinal disease priority; innovation premium" },
      { market: "China NHSA", clinical: 30, economic: 35, access: 25, political: 10, notes: "Diabetic eye disease, myopia epidemic; affordability critical" },
      { market: "India PM-JAY", clinical: 25, economic: 45, access: 20, political: 10, notes: "Cataract surgery covered; retinal disease access limited" },
      { market: "Brazil CONITEC", clinical: 30, economic: 35, access: 25, political: 10, notes: "AMD, DME prioritized; budget constraints for biologics" },
    ],
    adjustments: {
      add: [
        { item: "Extended durability (≥q12 weeks anti-VEGF)", points: "+15 (fewer injections)" },
        { item: "First gene therapy (retinal disease)", points: "+18 (curative potential)" },
        { item: "Oral or topical vs. intravitreal", points: "+12 (patient preference)" },
        { item: "Port delivery system (sustained release)", points: "+10" },
        { item: "Fixed combination (glaucoma)", points: "+8 (adherence)" },
        { item: "Pediatric retinal disease (ROP)", points: "+10 (high unmet need)" },
        { item: "Novel mechanism (non-VEGF for AMD/DME)", points: "+12 (complement, Tie-2)" },
      ],
      subtract: [
        { item: "Shorter injection interval than SOC", points: "-12 (q4w vs. aflibercept q8)" },
        { item: "No durability data beyond 1 year", points: "-8 (chronic disease)" },
        { item: "Safety concerns (endophthalmitis, RPE atrophy)", points: "-10" },
        { item: "Requires specialized administration", points: "-8 (surgical placement)" },
        { item: "No head-to-head vs. aflibercept/ranibizumab", points: "-10 (Germany requires)" },
        { item: "Medicare ASP unprofitable for practices", points: "-20 (access barrier)" },
      ],
    },
  },
  {
    name: "13. Urology/Nephrology",
    markets: [
      { market: "US", clinical: 30, economic: 30, access: 25, political: 15, notes: "CKD progression, prostate cancer, BPH; dialysis cost-offset valued" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 25, political: 15, notes: "Elderly CKD/ESRD; Part D oral; Part B ESAs/dialysis drugs" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "CKD priority (NHS Long Term Plan); dialysis/transplant prevention" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "Patient-relevant renal outcomes; long-term data required" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "CKD epidemic; aging; dialysis prevalence high" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "CKD, diabetes nephropathy priority; dialysis burden" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Acute kidney injury, dialysis covered; chronic CKD management limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "CKD, dialysis prioritized; budget constraints" },
    ],
    adjustments: {
      add: [
        { item: "Dialysis delay/prevention", points: "+15 (major cost-offset)" },
        { item: "Kidney function preservation (eGFR slope reduction)", points: "+12" },
        { item: "Dual CKD + CV outcomes", points: "+10 (SGLT2 inhibitor precedent)" },
        { item: "Prostate cancer: castration-resistant indication", points: "+8" },
        { item: "Oral vs. injectable (ESA replacement)", points: "+10" },
      ],
      subtract: [
        { item: "No renal outcomes trial", points: "-12 (surrogate only)" },
        { item: "Dialysis-dependent only population", points: "-8 (limited scope)" },
        { item: "No CV outcomes data", points: "-8 (CKD drugs expected)" },
        { item: "Generic competition (ARBs, ACEi)", points: "-15" },
      ],
    },
  },
  {
    name: "14. Psychiatry/Mental Health",
    markets: [
      { market: "US Commercial", clinical: 30, economic: 30, access: 25, political: 15, notes: "Mental Health Parity Act; suicide prevention priority; prior auth restricted" },
      { market: "US Medicare", clinical: 30, economic: 30, access: 25, political: 15, notes: "Elderly depression; dementia-related agitation; Part D coverage" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "NHS mental health crisis; IAPT services; cost-effectiveness strict" },
      { market: "Germany G-BA", clinical: 35, economic: 30, access: 25, political: 10, notes: "Patient QoL central; psychotherapy integration; evidence requirements" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Suicide prevention national priority; cultural stigma challenges" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "Mental health emerging priority; affordability critical; limited coverage" },
      { market: "India PM-JAY", clinical: 15, economic: 50, access: 25, political: 10, notes: "Severe mental illness only; outpatient psychiatric care excluded mostly" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "CAPS (psychosocial centers) integration; budget constraints" },
    ],
    adjustments: {
      add: [
        { item: "Rapid-acting (<1 week onset)", points: "+12 (TRD, acute suicidality)" },
        { item: "Suicide ideation/attempt reduction documented", points: "+15 (US/Japan national priorities)" },
        { item: "Novel mechanism (non-monoaminergic: NMDA, kappa-opioid, psychedelics, orexin)", points: "+12" },
        { item: "No weight gain/metabolic syndrome", points: "+10 (vs. SGAs like olanzapine, quetiapine)" },
        { item: "No sexual dysfunction", points: "+8 (vs. SSRIs)" },
        { item: "Pediatric/adolescent indication (12-17)", points: "+10 (high unmet need)" },
        { item: "Postpartum depression (zuranolone precedent)", points: "+12 (high priority)" },
        { item: "Cognitive enhancement (schizophrenia)", points: "+15 (major unmet need, no approved drugs)" },
        { item: "Negative symptom efficacy (schizophrenia)", points: "+12 (high unmet need)" },
      ],
      subtract: [
        { item: "No functional improvement (symptom scores only)", points: "-10 (FDA, payers expect return to work)" },
        { item: "REMS requirement (clinic-based, monitoring)", points: "-10 (esketamine burden)" },
        { item: "Sedation/cognitive impairment as AE", points: "-8 (functional barrier)" },
        { item: "Weight gain >7% body weight", points: "-10 (metabolic syndrome, adherence)" },
        { item: "Extrapyramidal symptoms (EPS) risk", points: "-10 (antipsychotic side effect)" },
        { item: "QTc prolongation (black box)", points: "-12 (cardiac monitoring, drug interactions)" },
        { item: "Abuse potential/controlled substance", points: "-12 (DEA restrictions, stigma)" },
        { item: "Discontinuation syndrome (withdrawal)", points: "-8 (SNRIs, benzodiazepines)" },
        { item: "Black box warning (suicidality in youth)", points: "-15 (antidepressant class effect)" },
      ],
    },
  },
  {
    name: "15. Transplantation & Cell/Gene Therapy",
    markets: [
      { market: "US Commercial", clinical: 40, economic: 20, access: 25, political: 15, notes: "Breakthrough therapies; curative intent; ultra-high cost tolerance; outcomes-based contracts" },
      { market: "US Medicare", clinical: 45, economic: 15, access: 25, political: 15, notes: "Part B cell/gene therapy; NCD pathway; CED" },
      { market: "UK NICE", clinical: 45, economic: 20, access: 20, political: 15, notes: "Transformative benefit; managed access; installment payments (Zolgensma precedent)" },
      { market: "Germany G-BA", clinical: 50, economic: 15, access: 25, political: 10, notes: "NUB hospital innovation fund; orphan exemptions; long-term outcomes critical" },
      { market: "Japan MHLW", clinical: 40, economic: 20, access: 25, political: 15, notes: "SAKIGAKE fast-track; regenerative medicine priority; conditional approval pathway" },
      { market: "China NHSA", clinical: 35, economic: 25, access: 30, political: 10, notes: "Emerging cell/gene therapy; affordability major barrier; limited coverage" },
      { market: "India PM-JAY", clinical: 25, economic: 35, access: 30, political: 10, notes: "Mostly excluded (ultra-high cost); bone marrow transplant covered; gene therapy OOP" },
      { market: "Brazil CONITEC", clinical: 35, economic: 25, access: 30, political: 10, notes: "Judicial pathway (court orders); SUS cannot afford; private insurance limited" },
    ],
    adjustments: {
      add: [
        { item: "Curative intent (functional cure, disease elimination)", points: "+25 (highest priority, all markets)" },
        { item: "Pediatric genetic/inherited disease (SMA, LCA, beta-thal, sickle cell)", points: "+20 (lifetime benefit, ethical imperative)" },
        { item: "Single-dose, lifelong benefit (no re-treatment)", points: "+18" },
        { item: "First gene therapy for indication", points: "+15 (breakthrough innovation)" },
        { item: "CAR-T with durable CR (>5 years DFS documented)", points: "+15 (hematologic malignancies)" },
        { item: "In vivo gene therapy (vs. ex vivo cell processing)", points: "+10 (scalability, logistics)" },
        { item: "Outcomes-based contract precedent (Zolgensma, Luxturna, Yescarta)", points: "+12 (risk-sharing)" },
        { item: "RMAT designation (US)", points: "+12 (regulatory + reimbursement advantages)" },
        { item: "SAKIGAKE designation (Japan)", points: "+12 (conditional approval, fast-track, premium pricing)" },
        { item: "Long-term registry data (>5 years follow-up)", points: "+10 (durability evidence)" },
        { item: "Orphan designation (rare disease)", points: "+10 (regulatory incentives, pricing flexibility)" },
        { item: "No conditioning chemotherapy required", points: "+8 (vs. CAR-T myeloablation)" },
        { item: "Automated manufacturing (off-the-shelf allogeneic vs. autologous)", points: "+10 (scalability)" },
      ],
      subtract: [
        { item: "Short durability (<5 years, re-dosing needed)", points: "-20 (negates cure narrative, cost multiplies)" },
        { item: "Ultra-high cost (>$3M) without clear lifetime savings", points: "-15 (payer resistance)" },
        { item: "Manufacturing complexity (patient-specific autologous CAR-T)", points: "-8 (scalability limited, 5-10% failures)" },
        { item: "Limited to <10 specialized centers globally", points: "-12 (access barrier, health equity concerns)" },
        { item: "No long-term data (<2 years follow-up, accelerated approval)", points: "-15 (uncertainty premium)" },
        { item: "Safety signal (insertional mutagenesis, CRS, neurotoxicity)", points: "-12 (black box, monitoring)" },
        { item: "Requires intensive conditioning (myeloablative chemo)", points: "-8 (toxicity, limits eligible patients)" },
        { item: "Competing gene therapy or curative alternative in development", points: "-15 (market share uncertainty)" },
        { item: "No outcomes-based contract offered (manufacturer refuses risk-sharing)", points: "-10 (payer impasse)" },
        { item: "Manufacturing failure rate >10% (patient-specific CAR-T)", points: "-10 (efficacy/access barrier)" },
        { item: "Allogeneic cell therapy with GVHD risk", points: "-12 (immunosuppression burden)" },
      ],
    },
  },
  {
    name: "16. Pediatrics (Cross-Cutting)",
    markets: [
      { market: "US Commercial", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +10% base bonus; applies on top of underlying TA weights" },
      { market: "UK NICE", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +15% base bonus; NHS children's health priority" },
      { market: "Germany G-BA", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +12% base bonus; PIP studies mandatory" },
      { market: "Japan MHLW", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +10% base bonus" },
      { market: "China NHSA", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +8% base bonus; one-child policy legacy" },
      { market: "India PM-JAY", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +12% base bonus" },
      { market: "Brazil CONITEC", clinical: 0, economic: 0, access: 0, political: 0, notes: "Overlay modifier: +10% base bonus" },
    ],
    adjustments: {
      add: [
        { item: "Pediatric Rare Disease PRV (US)", points: "+10 (voucher value ~$100M incentivizes development)" },
        { item: "BPCA/PREA 6-month exclusivity extension (US)", points: "+8 (revenue incentive)" },
        { item: "Curative therapy preventing lifetime disability (SMA, LCA, beta-thal, sickle cell)", points: "+20" },
        { item: "Prevents intellectual disability or developmental delay", points: "+15 (PKU, SMA, lysosomal storage)" },
        { item: "First pediatric therapy for condition (no approved treatment)", points: "+15 (high unmet need)" },
        { item: "Pediatric formulation (age-appropriate dosing, liquid, chewable, sprinkle)", points: "+8" },
        { item: "Medicaid EPSDT mandate compliance (US)", points: "+10 (guaranteed coverage)" },
        { item: "Orphan designation (many pediatric diseases are rare)", points: "+10 (7-year exclusivity)" },
        { item: "Prevents early mortality (<18 years fatal disease)", points: "+18 (SMA type 1, Duchenne, Batten)" },
        { item: "Strong patient advocacy organization (family foundations)", points: "+8" },
        { item: "Newborn screening integration (PKU, SMA, SCID)", points: "+12 (early diagnosis)" },
      ],
      subtract: [
        { item: "No pediatric studies (extrapolated from adults only)", points: "-10 (G-BA/NICE penalize)" },
        { item: "Safety signal in pediatric population (black box for children)", points: "-15" },
        { item: "Requires frequent invasive procedures (weekly IV, intrathecal)", points: "-8 (child burden)" },
        { item: "No age-appropriate formulation (adult tablets for 5-year-old)", points: "-10 (dosing errors, adherence)" },
        { item: "Limited to specialized centers (<10 pediatric centers US)", points: "-10 (access barrier)" },
        { item: "School disruption (frequent hospitalizations, clinic visits)", points: "-6 (family burden)" },
        { item: "Adolescent non-adherence risk (13-17 years)", points: "-6 (psychiatric meds, contraception)" },
      ],
    },
  },
  {
    name: "17. Pain Management/Anesthesia",
    markets: [
      { market: "US Commercial", clinical: 30, economic: 25, access: 25, political: 20, notes: "Opioid crisis; DEA scheduling; REMS; non-opioid alternatives prioritized" },
      { market: "US Medicare", clinical: 30, economic: 25, access: 25, political: 20, notes: "Elderly chronic pain; Part D opioid restrictions; non-opioid preference" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "Chronic pain guidelines; opioid stewardship; cost-effectiveness" },
      { market: "Germany G-BA", clinical: 35, economic: 30, access: 25, political: 10, notes: "Pain management protocols; opioid prescribing regulations" },
      { market: "Japan MHLW", clinical: 30, economic: 30, access: 25, political: 15, notes: "Cultural opioid avoidance; non-opioid mechanisms preferred" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "Opioid control strict; cancer pain prioritized; chronic pain limited" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Acute/cancer pain covered; chronic pain management limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Opioid access for cancer pain; chronic pain budget barrier" },
    ],
    adjustments: {
      add: [
        { item: "Novel non-opioid mechanism (first-in-class: NGF mAb, Nav1.7/1.8, CGRP)", points: "+15" },
        { item: "Abuse-deterrent formulation (opioid)", points: "+10 (tamper-resistant, extraction-resistant)" },
        { item: "Non-Schedule II (Schedule III-V or non-controlled)", points: "+12 (prescribing ease)" },
        { item: "Dual pain + function improvement", points: "+8 (not just NRS reduction)" },
        { item: "Cancer pain indication", points: "+10 (opioid alternatives high unmet need)" },
        { item: "Neuropathic pain efficacy (DPNP, PHN)", points: "+8 (high prevalence)" },
        { item: "Rapid onset (acute pain <30 minutes)", points: "+6 (ER, post-surgical)" },
        { item: "Long-acting (chronic pain, once-daily)", points: "+8 (vs. q4-6h)" },
        { item: "Topical/localized (vs. systemic)", points: "+7 (lower systemic exposure)" },
      ],
      subtract: [
        { item: "Schedule II opioid (without ADF)", points: "-15 (opioid crisis, REMS, prescribing limits)" },
        { item: "REMS requirement", points: "-10 (prescriber/patient burden)" },
        { item: "Addiction potential (non-opioid but abuse risk)", points: "-12 (gabapentinoids precedent)" },
        { item: "Black box warning (CV risk NSAIDs, GI bleeding)", points: "-10" },
        { item: "No functional improvement (pain score only)", points: "-8 (FDA, payers expect function)" },
        { item: "Requires frequent dosing (q4h chronic pain)", points: "-6 (adherence, burden)" },
        { item: "Systemic side effects (sedation, constipation, nausea)", points: "-8 (opioid burden)" },
        { item: "Competing non-opioid with better profile", points: "-10 (market access difficult)" },
        { item: "Cancer pain: inferior to morphine equivalents", points: "-12 (standard of care)" },
      ],
    },
  },
  {
    name: "18. Rare Diseases/Orphan Drugs",
    markets: [
      { market: "US Commercial", clinical: 40, economic: 20, access: 25, political: 15, notes: "Orphan Drug Act; 7-year exclusivity; high willingness to pay; ultra-rare pricing flexibility" },
      { market: "US Medicare", clinical: 45, economic: 15, access: 25, political: 15, notes: "Part B/D coverage; CED pathway for gene therapy; PRV incentives" },
      { market: "UK NICE", clinical: 45, economic: 20, access: 20, political: 15, notes: "HST pathway for ultra-rare; managed access agreements; £100-300K ICER flexibility" },
      { market: "Germany G-BA", clinical: 50, economic: 15, access: 25, political: 10, notes: "Orphan exemption from AMNOG (<€50M revenue); automatic benefit assumed" },
      { market: "Japan MHLW", clinical: 40, economic: 20, access: 25, political: 15, notes: "Orphan drug designation; innovation premium; SAKIGAKE pathway" },
      { market: "China NHSA", clinical: 35, economic: 25, access: 30, political: 10, notes: "National rare disease catalogue; affordability major barrier; provincial subsidies" },
      { market: "India PM-JAY", clinical: 25, economic: 35, access: 30, political: 10, notes: "Mostly excluded (ultra-high cost); catastrophic coverage limited" },
      { market: "Brazil CONITEC", clinical: 35, economic: 25, access: 30, political: 10, notes: "Judicial pathway (court orders); SUS budget constraints; patient advocacy strong" },
    ],
    adjustments: {
      add: [
        { item: "First-in-class/only treatment for condition", points: "+20 (no alternative therapy available)" },
        { item: "Pediatric rare disease", points: "+15 (high unmet need, regulatory incentives)" },
        { item: "Gene therapy curative intent", points: "+18 (one-time treatment, lifetime benefit)" },
        { item: "Newborn screening integration", points: "+12 (early diagnosis enables early treatment)" },
        { item: "Patient advocacy strong (NORD, Eurordis)", points: "+8 (regulatory and payer influence)" },
        { item: "Ultra-orphan (<1 in 50,000)", points: "+10 (additional regulatory flexibility)" },
      ],
      subtract: [
        { item: "No natural history data for comparison", points: "-12 (difficult to demonstrate benefit)" },
        { item: "Single-arm trial without historical control", points: "-10 (evidence uncertainty)" },
        { item: "Ultra-high cost (>$2M) without outcomes-based contract", points: "-15 (payer resistance)" },
        { item: "No long-term durability data (<3 years)", points: "-10 (gene therapy uncertainty)" },
        { item: "Manufacturing complexity (patient-specific)", points: "-8 (supply chain risk)" },
        { item: "Limited to <5 specialized centers", points: "-12 (access barrier, health equity)" },
      ],
    },
  },
  {
    name: "19. Vaccines & Virology",
    markets: [
      { market: "US Commercial", clinical: 35, economic: 25, access: 30, political: 10, notes: "ACIP recommendations = guaranteed coverage; VFC program; pharmacy administration" },
      { market: "US Medicare", clinical: 35, economic: 25, access: 30, political: 10, notes: "Part D vaccines (IRA); adult immunization growing; no cost-sharing" },
      { market: "UK NICE", clinical: 40, economic: 35, access: 15, political: 10, notes: "JCVI recommendation = NHS coverage; cost per QALY strict; NIP integration" },
      { market: "Germany G-BA", clinical: 40, economic: 30, access: 20, political: 10, notes: "STIKO recommendation = mandatory sickness fund coverage; efficacy data quality" },
      { market: "Japan MHLW", clinical: 35, economic: 25, access: 25, political: 15, notes: "NIP vaccines; catch-up programs; pandemic preparedness priority" },
      { market: "China NHSA", clinical: 30, economic: 35, access: 25, political: 10, notes: "NIP (free) vs. non-NIP (OOP); domestic manufacturing preferred; CDC distribution" },
      { market: "India PM-JAY", clinical: 25, economic: 40, access: 25, political: 10, notes: "UIP (Universal Immunization); price-sensitive; domestic production" },
      { market: "Brazil CONITEC", clinical: 30, economic: 35, access: 25, political: 10, notes: "PNI (National Immunization Program); Fiocruz/Butantan local production" },
    ],
    adjustments: {
      add: [
        { item: "ACIP/STIKO/JCVI universal recommendation", points: "+15 (guaranteed coverage in respective markets)" },
        { item: "Pandemic preparedness (influenza, coronavirus)", points: "+12 (government stockpile, emergency use)" },
        { item: "mRNA platform (rapid variant adaptation)", points: "+10 (COVID precedent, platform flexibility)" },
        { item: "Combination vaccine (fewer injections)", points: "+8 (adherence, schedule simplification)" },
        { item: "Room temperature stable", points: "+6 (cold chain advantage, global access)" },
        { item: "Single-dose regimen", points: "+8 (vs. multi-dose schedule)" },
      ],
      subtract: [
        { item: "Ultra-cold chain requirement (-70°C)", points: "-12 (distribution/storage barrier)" },
        { item: "Waning immunity requiring frequent boosters", points: "-10 (annual/semi-annual dosing)" },
        { item: "Safety signal (myocarditis, GBS, anaphylaxis)", points: "-15 (public trust, regulatory scrutiny)" },
        { item: "No ACIP/STIKO recommendation", points: "-20 (coverage not guaranteed)" },
        { item: "Narrow serotype coverage vs. existing", points: "-8 (inferior to current vaccines)" },
        { item: "No pediatric indication data", points: "-10 (key population excluded)" },
      ],
    },
  },
  {
    name: "20. Women's Health",
    markets: [
      { market: "US Commercial", clinical: 30, economic: 25, access: 25, political: 20, notes: "ACA mandates contraception; reproductive rights politics; menopause growing" },
      { market: "US Medicare", clinical: 25, economic: 30, access: 25, political: 20, notes: "Elderly women osteoporosis/menopause; fertility/obesity excluded" },
      { market: "UK NICE", clinical: 35, economic: 40, access: 15, political: 10, notes: "Women's health priority; HRT safety data important; cost-effectiveness strict" },
      { market: "Germany G-BA", clinical: 35, economic: 30, access: 25, political: 10, notes: "Patient-relevant QoL; endometriosis unmet need recognized" },
      { market: "Japan MHLW", clinical: 25, economic: 30, access: 30, political: 15, notes: "Menopause, endometriosis priority; fertility treatments growing" },
      { market: "China NHSA", clinical: 25, economic: 35, access: 30, political: 10, notes: "Reproductive health coverage limited; fertility OOP" },
      { market: "India PM-JAY", clinical: 20, economic: 45, access: 25, political: 10, notes: "Maternal health priority; chronic gynecological conditions limited" },
      { market: "Brazil CONITEC", clinical: 25, economic: 40, access: 25, political: 10, notes: "Contraception covered; endometriosis/menopause budget constrained" },
    ],
    adjustments: {
      add: [
        { item: "ACA-mandated contraception coverage (US)", points: "+12 (no cost-sharing required)" },
        { item: "Non-hormonal mechanism (menopause, endometriosis)", points: "+15 (NK3 antagonist, GnRH antagonist; safety advantage vs. HRT)" },
        { item: "Oral vs. injectable/implant", points: "+8 (patient preference, reversibility)" },
        { item: "Rapid onset PPD (<1 week)", points: "+10 (zuranolone precedent, critical unmet need)" },
        { item: "Dual indication (endometriosis + uterine fibroids)", points: "+8 (broader market)" },
        { item: "Fertility preservation indication", points: "+10 (growing market, high willingness to pay)" },
      ],
      subtract: [
        { item: "Medicare exclusion (obesity drugs, fertility)", points: "-20 (major coverage gap)" },
        { item: "Political/religious coverage exemptions", points: "-15 (employer religious objections, Hobby Lobby precedent)" },
        { item: "Cosmetic/elective perception", points: "-12 (payer classification risk)" },
        { item: "Hormonal side effects (thrombosis, cancer risk)", points: "-10 (black box concerns)" },
        { item: "Requires fertility specialist (IVF adjunct)", points: "-8 (limited access, high cost)" },
        { item: "No male comparator/traditional endpoint", points: "-6 (regulatory endpoint challenges)" },
      ],
    },
  },
];

// ============ HELPER COMPONENTS ============
const ScoringTable = ({ sections }: { sections: ScoringSection[] }) => (
  <div className="space-y-3">
    {sections.map((section, idx) => (
      <div key={idx}>
        <h5 className="font-semibold text-sm mb-1">{section.title} ({section.maxPoints} points)</h5>
        <div className="space-y-1">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm pl-2 border-l-2 border-primary/20 py-1">
              <Badge variant="outline" className="text-[10px] shrink-0 mt-0.5">{item.points}</Badge>
              <div>
                <span className="font-medium">{item.label}</span>
                {item.detail && <span className="text-muted-foreground block text-xs">{item.detail}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const WeightsBar = ({ clinical, economic, access, political }: { clinical: number; economic: number; access: number; political: number }) => (
  <div className="flex h-4 rounded-full overflow-hidden text-[9px] font-semibold">
    <div className="bg-blue-400 flex items-center justify-center text-white" style={{ width: `${clinical}%` }}>{clinical}%</div>
    <div className="bg-green-400 flex items-center justify-center text-white" style={{ width: `${economic}%` }}>{economic}%</div>
    <div className="bg-orange-400 flex items-center justify-center text-white" style={{ width: `${access}%` }}>{access}%</div>
    <div className="bg-purple-400 flex items-center justify-center text-white" style={{ width: `${political}%` }}>{political}%</div>
  </div>
);

// ============ MAIN COMPONENT ============
interface PAModel1DashboardProps {
  molecules?: any[];
}

export const PAModel1Dashboard = ({ molecules }: PAModel1DashboardProps) => {
  const [activeTab, setActiveTab] = useState("core");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-6 w-6 text-primary" />
            PA Index-1 & Model 1: Market-Weighted Payer Support Probability Index (MWPSPI)
          </CardTitle>
          <CardDescription className="text-base">
            Market-specific scores (0-100) by weighting factors according to each payer system's documented decision-making priorities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 border font-mono text-sm text-center">
            {coreFormula}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Clinical Value (W₁)</Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">Economic Value (W₂)</Badge>
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">Access/Market (W₃)</Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200">Political/Procedural (W₄)</Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-sky-100 dark:bg-sky-950/30 p-1">
          <TabsTrigger value="core" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> Core Framework (7 Markets)</TabsTrigger>
          <TabsTrigger value="ta" className="gap-1.5"><Stethoscope className="h-3.5 w-3.5" /> TA-Specific Models (20 TAs)</TabsTrigger>
          <TabsTrigger value="calculator" className="gap-1.5"><Calculator className="h-3.5 w-3.5" /> Interactive Calculator</TabsTrigger>
        </TabsList>

        {/* CORE FRAMEWORK */}
        <TabsContent value="core" className="space-y-4">
          <Accordion type="multiple" className="space-y-2">
            {marketModels.map((model, idx) => (
              <AccordionItem key={idx} value={`market-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-xl">{model.flag}</span>
                    <span className="font-semibold">{model.market}</span>
                    <Badge variant="outline" className="text-xs ml-auto mr-4">{model.weights.notes}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {/* Weights */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Weight Distribution</h4>
                    <WeightsBar clinical={model.weights.clinical} economic={model.weights.economic} access={model.weights.access} political={model.weights.political} />
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <span>Clinical: {model.weights.clinical}%</span>
                      <span>Economic: {model.weights.economic}%</span>
                      <span>Access: {model.weights.access}%</span>
                      <span>Political: {model.weights.political}%</span>
                    </div>
                  </div>

                  {/* Scoring */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <ScoringTable sections={model.clinicalScoring} />
                      <div className="mt-3"><ScoringTable sections={model.economicScoring} /></div>
                    </div>
                    <div>
                      <ScoringTable sections={model.accessScoring} />
                      <div className="mt-3"><ScoringTable sections={model.politicalScoring} /></div>
                    </div>
                  </div>

                  {/* Payer Adjustments */}
                  {model.payerAdjustments && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Payer-Specific Adjustments</h4>
                      <div className="space-y-1">
                        {model.payerAdjustments.map((adj, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm bg-muted/30 rounded p-2">
                            <Badge variant="secondary" className="text-[10px] shrink-0">{adj.payer}</Badge>
                            <span>{adj.adjustment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Probability Bands */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Probability Bands</h4>
                    <div className="space-y-1.5">
                      {model.probabilityBands.map((band, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Badge className={`text-xs min-w-[60px] justify-center ${band.color}`}>{band.range}</Badge>
                          <span className="font-medium text-sm min-w-[70px]">{band.label}</span>
                          <span className="text-sm text-muted-foreground">{band.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* TA-SPECIFIC */}
        <TabsContent value="ta" className="space-y-4">
          <Accordion type="multiple" className="space-y-2">
            {taWeightsData.map((ta, idx) => {
              const taScoring = taSpecificScoringData.find(s => s.taName === ta.name);
              return (
                <AccordionItem key={idx} value={`ta-${idx}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-semibold">{ta.name}</span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    {/* Market Weights Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="text-left p-2 font-semibold">Market</th>
                            <th className="text-center p-2 font-semibold text-blue-600">Clinical</th>
                            <th className="text-center p-2 font-semibold text-green-600">Economic</th>
                            <th className="text-center p-2 font-semibold text-orange-600">Access</th>
                            <th className="text-center p-2 font-semibold text-purple-600">Political</th>
                            <th className="text-left p-2 font-semibold">Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ta.markets.map((m, i) => (
                            <tr key={i} className="border-b hover:bg-muted/30">
                              <td className="p-2 font-medium">{m.market}</td>
                              <td className="p-2 text-center text-blue-600 font-semibold">{m.clinical}%</td>
                              <td className="p-2 text-center text-green-600 font-semibold">{m.economic}%</td>
                              <td className="p-2 text-center text-orange-600 font-semibold">{m.access}%</td>
                              <td className="p-2 text-center text-purple-600 font-semibold">{m.political}%</td>
                              <td className="p-2 text-muted-foreground">{m.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* TA-Specific Scoring Breakdowns */}
                    {taScoring && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm border-b pb-1">Detailed Scoring by Market</h4>
                        <Accordion type="multiple" className="space-y-1">
                          {taScoring.marketScorings.map((ms, mi) => (
                            <AccordionItem key={mi} value={`ta-${idx}-market-${mi}`} className="border rounded px-3">
                              <AccordionTrigger className="hover:no-underline py-2 text-sm">
                                <span className="font-medium">{ms.market}</span>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-3 pb-3">
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                  {/* Clinical */}
                                  <div>
                                    <h6 className="text-xs font-bold text-blue-600 mb-1">Clinical Scoring</h6>
                                    {ms.clinicalScoring.map((s, si) => (
                                      <div key={si} className="mb-2">
                                        <p className="text-[10px] font-semibold text-muted-foreground">{s.title} ({s.maxPoints})</p>
                                        {s.items.map((item, ii) => (
                                          <div key={ii} className="flex items-start gap-1 text-[10px] pl-1 border-l border-blue-200 py-0.5 ml-1">
                                            <Badge variant="outline" className="text-[8px] shrink-0 px-1">{item.points}</Badge>
                                            <div>
                                              <span className="font-medium">{item.label}</span>
                                              {item.detail && <span className="text-muted-foreground block">{item.detail}</span>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                  {/* Economic */}
                                  <div>
                                    <h6 className="text-xs font-bold text-green-600 mb-1">Economic Scoring</h6>
                                    {ms.economicScoring.map((s, si) => (
                                      <div key={si} className="mb-2">
                                        <p className="text-[10px] font-semibold text-muted-foreground">{s.title} ({s.maxPoints})</p>
                                        {s.items.map((item, ii) => (
                                          <div key={ii} className="flex items-start gap-1 text-[10px] pl-1 border-l border-green-200 py-0.5 ml-1">
                                            <Badge variant="outline" className="text-[8px] shrink-0 px-1">{item.points}</Badge>
                                            <div>
                                              <span className="font-medium">{item.label}</span>
                                              {item.detail && <span className="text-muted-foreground block">{item.detail}</span>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                  {/* Access */}
                                  <div>
                                    <h6 className="text-xs font-bold text-orange-600 mb-1">Access Scoring</h6>
                                    {ms.accessScoring.map((s, si) => (
                                      <div key={si} className="mb-2">
                                        <p className="text-[10px] font-semibold text-muted-foreground">{s.title} ({s.maxPoints})</p>
                                        {s.items.map((item, ii) => (
                                          <div key={ii} className="flex items-start gap-1 text-[10px] pl-1 border-l border-orange-200 py-0.5 ml-1">
                                            <Badge variant="outline" className="text-[8px] shrink-0 px-1">{item.points}</Badge>
                                            <div>
                                              <span className="font-medium">{item.label}</span>
                                              {item.detail && <span className="text-muted-foreground block">{item.detail}</span>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {/* Probability Bands if available */}
                                {ms.probabilityBands && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {ms.probabilityBands.map((b, bi) => (
                                      <Badge key={bi} variant="outline" className="text-[9px]">{b.range}: {b.label} — {b.description}</Badge>
                                    ))}
                                  </div>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    )}

                    {/* Adjustments */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h5 className="font-semibold text-sm text-green-700 dark:text-green-400 mb-2">Add to Final Score</h5>
                        <div className="space-y-1">
                          {ta.adjustments.add.map((a, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-green-50 dark:bg-green-950/20 rounded p-1.5 border border-green-200">
                              <Badge variant="outline" className="text-[9px] shrink-0 text-green-600 border-green-300">{a.points}</Badge>
                              <span>{a.item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-sm text-red-700 dark:text-red-400 mb-2">Subtract from Final Score</h5>
                        <div className="space-y-1">
                          {ta.adjustments.subtract.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs bg-red-50 dark:bg-red-950/20 rounded p-1.5 border border-red-200">
                              <Badge variant="outline" className="text-[9px] shrink-0 text-red-600 border-red-300">{s.points}</Badge>
                              <span>{s.item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </TabsContent>

        {/* CALCULATOR */}
        <TabsContent value="calculator" className="space-y-4">
          <MWPSPICalculator molecules={molecules} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
