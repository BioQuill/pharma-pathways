import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Building2, 
  DollarSign, 
  Shield, 
  Users, 
  TrendingUp, 
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Landmark,
  Stethoscope,
  Pill,
  MapPin,
  Clock,
  CreditCard,
  Scale,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ============ DATA TYPES ============
interface PayerDetail {
  aspect: string;
  detail: string;
}

interface Payer {
  name: string;
  tier: string;
  details: PayerDetail[];
}

interface CountrySystem {
  country: string;
  flag: string;
  region: string;
  systemType: string;
  details: PayerDetail[];
  payers?: Payer[];
  subSections?: { title: string; details: PayerDetail[] }[];
}

// ============ US PAYERS DATA ============
const usPayers: Payer[] = [
  {
    name: "UnitedHealth Group / UnitedHealthcare",
    tier: "Tier 1: Mega-Payer",
    details: [
      { aspect: "Revenue", detail: "$324 billion (2022)" },
      { aspect: "Covered Lives", detail: "50+ million (across all products)" },
      { aspect: "Medicare Advantage Share", detail: "30% (largest nationally)" },
      { aspect: "Segments", detail: "Commercial, Medicare Advantage (MA), Medicare Supplement, Medicaid MCOs" },
      { aspect: "Geographic Coverage", detail: "49 states" },
      { aspect: "Operational Model", detail: "Integrated delivery (Optum subsidiary provides healthcare services)" },
      { aspect: "Funding Source", detail: "Private premiums (100% commercial model)" },
      { aspect: "Average Payment Period", detail: "30-45 days standard; 14 days for claims processing initiation" },
      { aspect: "Reimbursement Approach", detail: "Fee-for-service (FFS) + Risk-based bundled payments" },
      { aspect: "Typical Payer Mix", detail: "Commercial 45%, MA 30%, Medicaid 20%, other 5%" },
      { aspect: "Network Type", detail: "Broad PPO networks nationally; some HMO regional" },
      { aspect: "Key Decision-Making", detail: "National + regional underwriting; medical policy committees" },
      { aspect: "Prior Authorization", detail: "Extensive (majority of specialty drugs)" },
    ],
  },
  {
    name: "Elevance Health (formerly Anthem)",
    tier: "Tier 1: Mega-Payer",
    details: [
      { aspect: "Revenue", detail: "$40.8 billion (2023)" },
      { aspect: "Covered Lives", detail: "6.4+ million" },
      { aspect: "Market Share", detail: "12% nationally (second largest)" },
      { aspect: "Segments", detail: "Commercial, Medicare Advantage, Medicaid MCOs, individual market" },
      { aspect: "Brands", detail: "Anthem Blue Cross/Blue Shield in 14 states; Carelon subsidiary" },
      { aspect: "Operating Model", detail: "Multi-state federation of semi-independent Blue plans" },
      { aspect: "Funding Source", detail: "Private premiums (100%)" },
      { aspect: "Average Payment Period", detail: "30 days (target); 45 days industry standard" },
      { aspect: "Reimbursement Approach", detail: "Predominantly FFS with increasing value-based care contracts" },
      { aspect: "Geographic Variation", detail: "State-specific pricing and network controls" },
      { aspect: "Key Strength", detail: "Established brand, broad geographic coverage, hospital partnerships" },
    ],
  },
  {
    name: "CVS Health / Aetna",
    tier: "Tier 1: Mega-Payer",
    details: [
      { aspect: "Revenue", detail: "$300+ billion (combined CVS + Aetna)" },
      { aspect: "Covered Lives", detail: "30+ million" },
      { aspect: "Market Share", detail: "12% nationally" },
      { aspect: "Segments", detail: "Commercial insurance, Medicare Advantage, Medicaid, Pharmacy Benefit Manager (PBM)" },
      { aspect: "Vertical Integration", detail: "Integrated: owns retail pharmacies (CVS stores), PBM (Caremark), insurance" },
      { aspect: "Operational Advantage", detail: "Direct access to pharmacy claims data, medication adherence insights" },
      { aspect: "Funding Source", detail: "Private premiums + pharmacy margins" },
      { aspect: "Average Payment Period", detail: "30 days standard" },
      { aspect: "Reimbursement Approach", detail: "FFS + bundled oncology programs; specialty pharmacy networks" },
      { aspect: "Key Differentiator", detail: "Integrated PBM can negotiate drug prices directly" },
    ],
  },
  {
    name: "Cigna / Express Scripts",
    tier: "Tier 1: Mega-Payer",
    details: [
      { aspect: "Revenue", detail: "~$180 billion (Cigna + Express Scripts parent)" },
      { aspect: "Covered Lives", detail: "20+ million health insurance" },
      { aspect: "Market Share", detail: "9% national commercial" },
      { aspect: "Segments", detail: "Commercial insurance, Medicare Advantage, international" },
      { aspect: "PBM Integration", detail: "Owns Express Scripts (large PBM)" },
      { aspect: "Funding Source", detail: "Private premiums + PBM revenue" },
      { aspect: "Payment Period", detail: "30-45 days" },
      { aspect: "Geographic Focus", detail: "Strong in mid-Atlantic, increasing national presence" },
    ],
  },
  {
    name: "Health Care Service Corporation (HCSC)",
    tier: "Tier 1: Mega-Payer",
    details: [
      { aspect: "Coverage", detail: "Illinois, Oklahoma, Texas, New Mexico (BCBS plans)" },
      { aspect: "Covered Lives", detail: "5.2+ million" },
      { aspect: "Market Share", detail: "8% nationally" },
      { aspect: "Funding Source", detail: "Private premiums; not-for-profit structure" },
      { aspect: "Payment Period", detail: "30-45 days" },
    ],
  },
  {
    name: "Humana",
    tier: "Tier 2: Specialty/Niche",
    details: [
      { aspect: "Revenue", detail: "$110.55 billion (2024)" },
      { aspect: "Covered Lives", detail: "14.8+ million medical members" },
      { aspect: "Specialty", detail: "Medicare Advantage and senior-focused care" },
      { aspect: "MA Market Share", detail: "19% nationally (second after UnitedHealth)" },
      { aspect: "Business Mix", detail: "~70% Medicare Advantage; 20% individual marketplace; 10% group/commercial" },
      { aspect: "Funding Source", detail: "Private premiums (primarily from seniors on Medicare)" },
      { aspect: "Average Payment Period", detail: "30-45 days" },
      { aspect: "Key Focus", detail: "Preventive services, home health, chronic disease management" },
      { aspect: "Value-Based Model", detail: "Capitated payments to integrated provider networks" },
    ],
  },
  {
    name: "Centene",
    tier: "Tier 2: Specialty/Niche",
    details: [
      { aspect: "Revenue", detail: "$35-40 billion" },
      { aspect: "Covered Lives", detail: "25+ million (majority Medicaid)" },
      { aspect: "Medicaid Focus", detail: "70% of medical membership (largest Medicaid MCO operator nationally)" },
      { aspect: "ACA Exchange", detail: "20% market share (largest among ACA insurers, 2024)" },
      { aspect: "States Operated", detail: "35+ states" },
      { aspect: "Government Dependence", detail: "70% revenue from Medicaid/ACA government programs" },
      { aspect: "Average Payment Period", detail: "45-60 days (per Medicaid state variations)" },
      { aspect: "Reimbursement Model", detail: "Capitated Medicaid payments (per member per month - PMPM)" },
      { aspect: "Prior Authorization", detail: "Standard for Medicaid MCOs" },
    ],
  },
  {
    name: "Molina Healthcare",
    tier: "Tier 2: Specialty/Niche",
    details: [
      { aspect: "Revenue", detail: "$35.84 billion (2024)" },
      { aspect: "Covered Lives", detail: "5.8+ million" },
      { aspect: "Business Focus", detail: "90% Medicaid MCO; small Medicare/commercial" },
      { aspect: "Government Dependence", detail: "~90% government programs" },
      { aspect: "States Operated", detail: "18 states + D.C." },
      { aspect: "Payment Model", detail: "Medicaid capitation (PMPM) + Medicare" },
      { aspect: "Average Payment Period", detail: "45-60 days" },
      { aspect: "Mission", detail: "Healthcare access for low-income/vulnerable populations" },
    ],
  },
  {
    name: "Kaiser Permanente",
    tier: "Tier 2: Integrated Delivery",
    details: [
      { aspect: "Covered Lives", detail: "12.5+ million" },
      { aspect: "Market Share", detail: "6% nationally" },
      { aspect: "Unique Model", detail: "Integrated health insurance + healthcare delivery (captive provider network)" },
      { aspect: "Geographic Footprint", detail: "8 states (CA, CO, GA, HI, MD, OH, OR, WA)" },
      { aspect: "Financial Model", detail: "Members pay premiums; Kaiser owns and operates hospitals/clinics" },
      { aspect: "Control", detail: "Own payment and provider systems = direct alignment of financial incentives" },
      { aspect: "Average Payment to Providers", detail: "Salaried physician model or capitated per-member rates" },
    ],
  },
];

const usGovernmentPrograms = [
  {
    name: "Medicare (CMS)",
    details: [
      { aspect: "Type", detail: "Federal government single-payer program (age 65+, disabled, ESRD)" },
      { aspect: "Beneficiaries", detail: "68 million (as of 2025)" },
      { aspect: "Program Components", detail: "Part A (hospital), Part B (physician), Part D (drugs), Part C (MA private plans)" },
      { aspect: "Funding Source", detail: "Government (payroll taxes 2.9%, general revenue)" },
      { aspect: "Payment Terms", detail: "14-30 days (very reliable; government program)" },
      { aspect: "Hospital Payment", detail: "DRG (Diagnosis-Related Group) bundled payment per admission" },
      { aspect: "Physician Payment", detail: "RBRVS (Resource-Based Relative Value Scale) fee schedule; conversion factor adjusted annually" },
      { aspect: "Payment Pressure", detail: "Reimbursement rates typically LOWER than commercial (70-80% of commercial rates)" },
      { aspect: "Growth Rate", detail: "Part A: 3.2% CAGR; Part B: 2.5% CAGR (2024-2030 projection)" },
    ],
  },
  {
    name: "Medicaid (State-Federal Joint Program)",
    details: [
      { aspect: "Type", detail: "Federal-state partnership (joint funding)" },
      { aspect: "Beneficiaries", detail: "90+ million (post-expansion)" },
      { aspect: "Funding Source", detail: "Federal government (50-77% depending on state) + State government (23-50%)" },
      { aspect: "Payout Model", detail: "Managed Care (72%): state contracts with MCOs (capitation model)" },
      { aspect: "MCO Capitation", detail: "Fixed PMPM (per-member-per-month) payment to Medicaid MCOs" },
      { aspect: "Fee-for-Service", detail: "28% of Medicaid: state directly pays providers" },
      { aspect: "Payment Terms", detail: "Highly variable by state: 30-60 days average" },
      { aspect: "Reimbursement Rates", detail: "State-defined: typically LOWEST of all payers (40-60% of commercial)" },
      { aspect: "Medicaid MCO Spending", detail: "$376+ billion in FY2021 (52% of total Medicaid spend)" },
      { aspect: "Top MCO Operators", detail: "Centene (largest), Molina, Elevance, UnitedHealth, CVS Health" },
    ],
  },
];

const usPBMs = [
  { name: "CVS Caremark", size: "140M+ covered lives", coverage: "Largest (CVS integrated)", role: "Drug claims processing, formulary management" },
  { name: "Express Scripts", size: "100M+ covered lives", coverage: "Cigna-owned", role: "PBM separates from insurer (standalone major)" },
  { name: "Optum Rx", size: "80M+ covered lives", coverage: "UnitedHealth subsidiary", role: "Integrated with UnitedHealth MA/commercial" },
  { name: "Anthem/Elevance", size: "Via Carelon subsidiary", coverage: "Multi-payer", role: "Independent PBM operations" },
];

// ============ EUROPEAN DATA ============
const europeanSystems: CountrySystem[] = [
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    region: "Europe",
    systemType: "Single-payer, government-run Beveridge model",
    details: [
      { aspect: "Coverage", detail: "Universal (>99% population covered)" },
      { aspect: "Funding Source", detail: "Taxation (primarily income tax; dedicated 0.2% National Insurance increase, 2022)" },
      { aspect: "Annual Budget (2024-25)", detail: "£168 billion allocated to NHS" },
      { aspect: "Patient Cost", detail: "Free at point of use (except prescriptions, dental, vision)" },
      { aspect: "Hospital Payment", detail: "National Tariff (fixed DRG-like rates); some block contracts" },
      { aspect: "GP Payment", detail: "Capitation (per registered patient) + quality bonuses (QOF)" },
      { aspect: "NICE Assessment", detail: "Cost-effectiveness threshold £20-30K/QALY" },
      { aspect: "Payment Terms", detail: "Monthly capitation to practices; quarterly/annual to trusts" },
      { aspect: "Private Sector Role", detail: "Supplemental (10.5% population has private voluntary insurance)" },
    ],
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    region: "Europe",
    systemType: "Multi-payer Bismarck model; sickness funds",
    details: [
      { aspect: "Coverage", detail: "~99% (85% public sickness funds; 15% private)" },
      { aspect: "Payer Count", detail: "124 non-profit sickness funds (occupational/regional)" },
      { aspect: "Funding Source", detail: "Employer-employee contributions (15% of salary, split equally) + gov subsidies" },
      { aspect: "Average Contribution", detail: "~15% of monthly salary (€350-400/month avg)" },
      { aspect: "Hospital Payment", detail: "G-DRG system (standardized nationally)" },
      { aspect: "Physician Payment", detail: "Fee-for-service (ambulatory); government-set fee schedule" },
      { aspect: "IQWiG Threshold", detail: "No fixed threshold (~€80K-100K/QALY implied)" },
      { aspect: "AMNOG Process", detail: "Manufacturers negotiate rebates within 6 months of launch" },
      { aspect: "Payment Terms", detail: "Quarterly settlements for capitated funds; FFS 30-45 days" },
      { aspect: "Patient Co-Pays", detail: "€10 per prescription (capped at 2% of gross income)" },
    ],
  },
  {
    country: "France",
    flag: "🇫🇷",
    region: "Europe",
    systemType: "Bismarck social insurance with Mutuelles",
    details: [
      { aspect: "Coverage", detail: "~100% universal (mandatory scheme)" },
      { aspect: "Primary Payer", detail: "CNAMTS (main social health insurance)" },
      { aspect: "Secondary Payers", detail: "Mutuelles (~90% population has one)" },
      { aspect: "CNAMTS Budget (2024)", detail: "€206 billion" },
      { aspect: "Contribution Rate", detail: "8% employee + 8% employer (16% total)" },
      { aspect: "Payment Terms", detail: "5 days reimbursement via Carte Vitale; provider 30-45 days" },
      { aspect: "Hospital Payment", detail: "T2A (activity-based payment similar to DRG)" },
      { aspect: "GP Gatekeeper", detail: "Yes; required referral for specialist access" },
    ],
  },
  {
    country: "Netherlands",
    flag: "🇳🇱",
    region: "Europe",
    systemType: "Bismarck-based privately delivered (regulated)",
    details: [
      { aspect: "Coverage", detail: "~100% mandatory basic private health insurance" },
      { aspect: "Payers", detail: "4-5 major private insurers (regulated): Achmea, VGZ, others" },
      { aspect: "Funding Source", detail: "Individual premiums (€100-300/month) + gov subsidies" },
      { aspect: "Hospital Payment", detail: "DRG-based with competition-driven pricing" },
      { aspect: "Co-Pays", detail: "Low annual deductible (~€385); capped at 2% income" },
      { aspect: "Supplemental Insurance", detail: "~70% population buys private top-up" },
    ],
  },
  {
    country: "Spain",
    flag: "🇪🇸",
    region: "Europe",
    systemType: "Single-payer, publicly-funded (NHS-like)",
    details: [
      { aspect: "Coverage", detail: "~100% universal" },
      { aspect: "Payer", detail: "Regional Health Services in 17 autonomous communities" },
      { aspect: "Patient Cost", detail: "Free at point of use (prescriptions €3-10)" },
      { aspect: "Decentralization", detail: "Regional variation in quality/access" },
      { aspect: "Private Sector", detail: "~18% population has private insurance" },
    ],
  },
  {
    country: "Italy",
    flag: "🇮🇹",
    region: "Europe",
    systemType: "Single-payer (SSN - Servizio Sanitario Nazionale)",
    details: [
      { aspect: "Coverage", detail: "~100% universal" },
      { aspect: "Structure", detail: "20 regional health services" },
      { aspect: "Patient Cost", detail: "Mostly free (co-pays by income: €5-25)" },
      { aspect: "Hospital Payment", detail: "Regional DRG-like system" },
      { aspect: "Private Sector", detail: "~12% has private supplemental" },
      { aspect: "Regional Variation", detail: "North better-funded than South" },
    ],
  },
];

// ============ APAC & EMERGING MARKETS ============
const apacSystems: CountrySystem[] = [
  {
    country: "Canada",
    flag: "🇨🇦",
    region: "Americas",
    systemType: "Single-payer, government-run (10 provinces + 3 territories)",
    details: [
      { aspect: "Coverage", detail: "~100% universal (medically necessary services)" },
      { aspect: "Payer", detail: "Provincial Health Ministries" },
      { aspect: "Funding Source", detail: "Provincial taxation + federal transfer payments" },
      { aspect: "Annual Budget (Ontario 2024-25)", detail: "$70+ billion" },
      { aspect: "Patient Cost", detail: "Free at point of use for physician/hospital; drugs mostly private" },
      { aspect: "Hospital Payment", detail: "Global capitated annual budgets per hospital" },
      { aspect: "CADTH Assessment", detail: "No fixed cost-effectiveness threshold" },
      { aspect: "Private Supplement", detail: "~60% population for dental, vision, drugs" },
      { aspect: "Prescription Drugs", detail: "Out-of-pocket or private insurance primary" },
    ],
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    region: "APAC",
    systemType: "Mixed: government single-payer + private insurance",
    details: [
      { aspect: "Coverage", detail: "~100% universal (Medicare); 47% also have private (2024)" },
      { aspect: "Medicare Budget (2024-25)", detail: "AUD $34.5 billion" },
      { aspect: "Patient Cost", detail: "Small co-pays: GP ~$20-35; prescription $5-10" },
      { aspect: "PBAC Assessment", detail: "Cost-effectiveness threshold AUD $50K/QALY" },
      { aspect: "Payment Terms", detail: "Medicare rebate: 10-14 days; private: 10-21 days" },
    ],
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    region: "APAC",
    systemType: "Bismarck multi-payer (employment-based + government)",
    details: [
      { aspect: "Coverage", detail: "~100% universal" },
      { aspect: "Payers", detail: "1,500+ insurance societies" },
      { aspect: "Funding Source", detail: "Employer-employee contributions (8-10%) + gov subsidies" },
      { aspect: "Patient Co-Pay", detail: "30% (working-age); 10% (elderly 70+, low-income)" },
      { aspect: "Hospital Payment", detail: "DPC system (Japanese version of DRG)" },
      { aspect: "Payment Terms", detail: "Monthly invoicing; settlement 45-60 days" },
      { aspect: "Generic Prescribing", detail: "Encouraged; generic prices typically 70% of brand" },
    ],
  },
  {
    country: "South Korea",
    flag: "🇰🇷",
    region: "APAC",
    systemType: "Unified National Health Insurance (since 2000)",
    details: [
      { aspect: "Coverage", detail: "~100% universal" },
      { aspect: "Primary Payer", detail: "NHIS (unified since merger of 350+ societies)" },
      { aspect: "Funding Source", detail: "Employer-employee contributions (6.12%) + gov subsidies (20%)" },
      { aspect: "Patient Co-Pay", detail: "30% hospital; 30% physician office" },
      { aspect: "Payment Terms", detail: "Monthly billing; settlement 30-60 days" },
      { aspect: "Generic Substitution", detail: "Pharmacist substitution permitted" },
    ],
  },
  {
    country: "India",
    flag: "🇮🇳",
    region: "APAC",
    systemType: "Highly fragmented: government + private + out-of-pocket (60% OOP)",
    details: [
      { aspect: "Coverage", detail: "~40% universal programs; ~50% private/informal" },
      { aspect: "Out-of-Pocket", detail: "60% of total healthcare spend (very high vs OECD 20%)" },
      { aspect: "Catastrophic Impact", detail: "Medical expenses drive 40% of poverty" },
      { aspect: "Key Challenge", detail: "Fragmentation = complex payer negotiations for pharma" },
    ],
    subSections: [
      {
        title: "PM-JAY (Pradhan Mantri Jan Arogya Yojana)",
        details: [
          { aspect: "Coverage", detail: "500M+ people (largest by population)" },
          { aspect: "Beneficiaries", detail: "Rural/urban poor households" },
          { aspect: "Benefit", detail: "Rs. 5 lakh (≈USD 6,000) per household/year" },
          { aspect: "Payment Terms", detail: "15-30 days to hospitals (government)" },
        ],
      },
      {
        title: "CGHS (Central Government Health Scheme)",
        details: [
          { aspect: "Coverage", detail: "4.7 million central government employees + pensioners" },
          { aspect: "Operating Cities", detail: "80 cities" },
          { aspect: "Empaneled Hospitals", detail: "2,486 private hospitals + government facilities" },
        ],
      },
      {
        title: "ESICS (Employees State Insurance)",
        details: [
          { aspect: "Coverage", detail: "35M+ workers in organized sector + dependents" },
          { aspect: "Contribution", detail: "3.25% employee + 4.75% employer" },
        ],
      },
    ],
  },
  {
    country: "China",
    flag: "🇨🇳",
    region: "APAC",
    systemType: "Government-directed multi-payer (public insurance mandated)",
    details: [
      { aspect: "Coverage", detail: "~97% population (three main schemes)" },
      { aspect: "NHSA Coverage", detail: "1.35 billion people" },
      { aspect: "Contribution", detail: "2.6% employee + 7.5% employer" },
      { aspect: "Patient Co-Pay", detail: "10-30% depending on service/province" },
      { aspect: "VBP Mechanism", detail: "Government bulk price negotiations → 50-70% price cuts" },
      { aspect: "Payment Terms", detail: "30-90 days (often delayed)" },
      { aspect: "Key Challenge for Pharma", detail: "VBP volume requirements + price compression = very low Chinese prices vs. Western markets" },
    ],
  },
  {
    country: "Brazil",
    flag: "🇧🇷",
    region: "Americas",
    systemType: "Mixed: government single-payer (SUS) + private (30%)",
    details: [
      { aspect: "Coverage", detail: "100% universal (SUS); 47M+ private supplement" },
      { aspect: "SUS Budget (2024)", detail: "BRL 230+ billion (≈USD 45-50 billion)" },
      { aspect: "Patient Cost", detail: "Free at point of use (SUS)" },
      { aspect: "CONITEC Assessment", detail: "180-day assessment; no fixed threshold" },
      { aspect: "Payment Terms (SUS)", detail: "90+ days (delays common; state-dependent 30-180 days)" },
      { aspect: "Private Insurance", detail: "Bradesco, Unimed, Itaú, SulAmérica (80+ active); 15-30 day payments" },
      { aspect: "Pharmaceutical Pricing", detail: "Government price controls by CMED" },
    ],
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    region: "Americas",
    systemType: "Mixed: government (Seguro Social) + private",
    details: [
      { aspect: "Coverage", detail: "~95% (government 60%; private 20%; uninsured 15%)" },
      { aspect: "IMSS Coverage", detail: "60M+ workers + dependents" },
      { aspect: "ISSSTE", detail: "9M+ government employees + dependents" },
      { aspect: "INSABI", detail: "50M+ uninsured/self-employed" },
      { aspect: "Payment Terms", detail: "30-60 days (government), 10-21 days (private)" },
    ],
  },
  {
    country: "Russia",
    flag: "🇷🇺",
    region: "Europe/Asia",
    systemType: "Bismarck-based government-managed (state-controlled)",
    details: [
      { aspect: "Coverage", detail: "~99% universal (compulsory health insurance)" },
      { aspect: "Funding Source", detail: "Payroll tax (5.1% employer contribution) + government budget" },
      { aspect: "Private Sector", detail: "Growing (~15%); high out-of-pocket for private care" },
      { aspect: "Payment Terms", detail: "30-90 days (variable; often delayed)" },
    ],
  },
];

// ============ MENA ============
const menaSystems: CountrySystem[] = [
  {
    country: "United Arab Emirates",
    flag: "🇦🇪",
    region: "MENA",
    systemType: "Mixed public-private",
    details: [
      { aspect: "Coverage", detail: "95%+ (Emiratis: government; expatriates: private insurance)" },
      { aspect: "Government Coverage", detail: "Emirati citizens ~90% government-funded" },
      { aspect: "Private Players", detail: "Al Fardan, ADIB, Daman, AXA, ENAYA" },
      { aspect: "Typical Copay", detail: "10-20%" },
      { aspect: "Payment Terms", detail: "Government 30-60 days; private 15-30 days" },
      { aspect: "Pharmaceutical Pricing", detail: "AMAAS reference prices; manufacturers negotiate rebates" },
    ],
  },
  {
    country: "Saudi Arabia",
    flag: "🇸🇦",
    region: "MENA",
    systemType: "Government single-payer dominant (90%+)",
    details: [
      { aspect: "Primary Payer", detail: "Ministry of Health & Prevention (MOHP)" },
      { aspect: "Funding Source", detail: "Government budget (oil revenues)" },
      { aspect: "Patient Cost", detail: "Heavily subsidized for Saudis (~10%)" },
      { aspect: "Payment Terms", detail: "30-90 days (government)" },
      { aspect: "Vision 2030", detail: "Opening private sector; still early stage" },
    ],
  },
  {
    country: "Egypt",
    flag: "🇪🇬",
    region: "MENA",
    systemType: "Government single-payer + private (limited)",
    details: [
      { aspect: "Coverage", detail: "60-70% government; 15-20% private; 15-25% uninsured" },
      { aspect: "Out-of-Pocket", detail: "High (30-40% total healthcare spending)" },
      { aspect: "Payment Terms", detail: "60-120 days (government); 30-45 days (private)" },
      { aspect: "Pharmaceutical Pricing", detail: "Government price caps (very stringent); generics dominant" },
    ],
  },
];

// ============ COMPARATIVE MATRIX ============
interface ComparisonRow {
  characteristic: string;
  usa: string;
  uk: string;
  germany: string;
  france: string;
  canada: string;
  japan: string;
  india: string;
  china: string;
  brazil: string;
}

const comparativeMatrix: ComparisonRow[] = [
  { characteristic: "Coverage Type", usa: "Multi-payer fragmented", uk: "Single-payer government", germany: "Multi-payer social insurance", france: "Multi-payer social insurance", canada: "Single-payer government", japan: "Multi-payer social insurance", india: "Fragmented multi-payer", china: "Government-directed", brazil: "Mixed government/private" },
  { characteristic: "Coverage %", usa: "90% (15M uninsured)", uk: "99%+", germany: "99%+", france: "100%", canada: "100%", japan: "100%", india: "~40% universal; ~60% OOP", china: "~97%", brazil: "100% SUS; 30% private" },
  { characteristic: "Primary Funding", usa: "Private 60%; Gov 40%", uk: "Government 100%", germany: "Employer-employee; Gov", france: "Employer-employee; Gov", canada: "Government (provincial)", japan: "Employer-employee", india: "Gov schemes + OOP + private", china: "Government (employer-driven)", brazil: "Government (mostly)" },
  { characteristic: "Hospital Payment", usa: "DRG + FFS + bundled", uk: "Global budget + activity", germany: "G-DRG system", france: "T2A (activity-based)", canada: "Global budget + case-mix", japan: "DPC system (DRG-like)", india: "Highly variable", china: "Capitated + DRG-like", brazil: "APACs (bundled)" },
  { characteristic: "Physician Payment", usa: "RBRVS + FFS + Capitation", uk: "Capitation (GPs) + FFS", germany: "FFS with fee schedule", france: "FFS with gov fee schedule", canada: "Capitation + FFS", japan: "FFS with negotiated schedule", india: "FFS (private); varied (gov)", china: "FFS with fee schedule", brazil: "FFS (SUS, very low)" },
  { characteristic: "Avg Payment Period", usa: "30-45 days", uk: "Monthly (reliable)", germany: "30-45 days", france: "5 days (Carte Vitale)", canada: "Monthly (reliable)", japan: "45-60 days", india: "15-30d (private); 30-90+ (public)", china: "30-90 days (delayed)", brazil: "90+ days (delays)" },
  { characteristic: "Patient Cost at Visit", usa: "Copay $20-100+", uk: "Minimal (£9.90 Rx)", germany: "€10-25 (cap 2%)", france: "Co-pay 20-30%", canada: "Modest (low copay)", japan: "30% (working-age)", india: "Highly variable; high OOP", china: "10-30%", brazil: "Free (SUS)" },
  { characteristic: "Price Control", usa: "Minimal (payers negotiate)", uk: "Strong (NICE)", germany: "Strong (IQWiG rebates)", france: "Gov price negotiation", canada: "CADTH (flexible)", japan: "Gov fee schedule", india: "Gov price caps", china: "Very strong (VBP)", brazil: "Strong (CMED caps)" },
  { characteristic: "Generic Penetration", usa: "50-60%", uk: "80%+", germany: "70%+", france: "60%+", canada: "60%+", japan: "70%+", india: "20-30%", china: "40-50%", brazil: "60%+" },
  { characteristic: "Spending Growth (CAGR)", usa: "4-5%", uk: "2-3%", germany: "3-4%", france: "3-4%", canada: "2-3%", japan: "2-3%", india: "8-10%", china: "5-7%", brazil: "4-6%" },
  { characteristic: "Negotiating Power vs Pharma", usa: "Moderate-High", uk: "Very High", germany: "High", france: "High", canada: "High", japan: "Moderate", india: "Moderate-Low", china: "Very High", brazil: "High" },
  { characteristic: "HTA Body", usa: "ICER (independent)", uk: "NICE", germany: "G-BA/IQWiG", france: "ANSM + CNAMTS", canada: "CADTH", japan: "PMDA + insurers", india: "NITI Aayog (emerging)", china: "NHSA (government)", brazil: "CONITEC" },
  { characteristic: "Drug Approval Timeline", usa: "30-180 days", uk: "90d (NICE); 6-9mo full", germany: "6 months (AMNOG)", france: "5 days post-ANSM", canada: "6-12 months (CADTH)", japan: "12+ months", india: "Variable 30-90d + 6mo schemes", china: "6mo (NMPA); 1yr (NHSA)", brazil: "180 days (CONITEC)" },
  { characteristic: "Orphan Drug Policy", usa: "Premium pricing; accelerated", uk: "£100K+/QALY flexibility", germany: "Exemptions from normal", france: "Gov compassion provisions", canada: "Flexibility for rare", japan: "Insurance listing flexibility", india: "Limited (cost barrier)", china: "Limited (affordability)", brazil: "Limited (cost control)" },
];

// ============ STRATEGIC IMPLICATIONS ============
const strategicImplications = {
  highPaying: [
    { region: "USA (commercial insurance)", detail: "List prices 2-3x Europe; negotiation possible" },
    { region: "Germany (sickness funds)", detail: "Reference pricing but bundling flexibility" },
    { region: "France (CNAMTS + mutuelles)", detail: "Multi-layer supports pricing" },
  ],
  governmentDominant: [
    { region: "UK (NHS)", detail: "NICE threshold capping; limited negotiation room" },
    { region: "China (NHSA)", detail: "VBP volume commitments → 50-70% price cuts" },
    { region: "Brazil (SUS)", detail: "CONITEC budget impact; government payment delays" },
  ],
  fragmented: [
    { region: "India", detail: "6+ different gov schemes + private → need segmentation strategy" },
    { region: "USA", detail: "Negotiate separately with Medicare/Medicaid, commercial, PBMs" },
  ],
  fastestGrowing: [
    { region: "India (PM-JAY expansion, CGHS reforms)", detail: "8-10% CAGR" },
    { region: "China (growing private alongside government)", detail: "5-7% CAGR" },
    { region: "Brazil (private insurance uptake rising)", detail: "4-6% CAGR" },
  ],
  paymentReliability: [
    { rank: "Excellent (14-30 days)", regions: "USA Medicare, Canada, Japan" },
    { rank: "Good (30-45 days)", regions: "Most EU countries, private insurers globally" },
    { rank: "Challenging (60-120+ days)", regions: "Brazil (SUS), India (gov), China, Russia" },
  ],
};

// ============ HELPER COMPONENT ============
const DetailTable = ({ details, compact = false }: { details: PayerDetail[]; compact?: boolean }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b bg-muted/50">
          <th className={`text-left ${compact ? 'p-2' : 'p-3'} font-medium w-1/4`}>Aspect</th>
          <th className={`text-left ${compact ? 'p-2' : 'p-3'} font-medium`}>Detail</th>
        </tr>
      </thead>
      <tbody>
        {details.map((d, i) => (
          <tr key={i} className="border-b hover:bg-muted/30">
            <td className={`${compact ? 'p-2' : 'p-3'} font-medium text-muted-foreground`}>{d.aspect}</td>
            <td className={`${compact ? 'p-2' : 'p-3'}`}>{d.detail}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ============ MAIN COMPONENT ============
export const PayersLandscape = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState("us");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Landmark className="h-6 w-6 text-primary" />
            Comprehensive Global Payers Landscape: Comparative Analysis
          </CardTitle>
          <CardDescription className="text-base">
            Operational Models, Budgets, Funding, Payment Terms (2024-2025)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">$1.57T</p>
              <p className="text-xs text-muted-foreground">US Market Size (2025)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">97%</p>
              <p className="text-xs text-muted-foreground">US Markets Highly Concentrated</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">40%</p>
              <p className="text-xs text-muted-foreground">Top 3 Insurers National Share</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">$2.1T</p>
              <p className="text-xs text-muted-foreground">Projected by 2030</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search payers, countries, systems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Regional Tabs */}
      <Tabs value={activeRegion} onValueChange={setActiveRegion} className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="us" className="gap-1.5"><span>🇺🇸</span> United States</TabsTrigger>
          <TabsTrigger value="europe" className="gap-1.5"><span>🇪🇺</span> Europe</TabsTrigger>
          <TabsTrigger value="apac" className="gap-1.5"><Globe className="h-3.5 w-3.5" /> APAC & Emerging</TabsTrigger>
          <TabsTrigger value="mena" className="gap-1.5"><MapPin className="h-3.5 w-3.5" /> MENA</TabsTrigger>
          <TabsTrigger value="comparison" className="gap-1.5"><Scale className="h-3.5 w-3.5" /> Comparative Matrix</TabsTrigger>
          <TabsTrigger value="strategy" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Strategy</TabsTrigger>
        </TabsList>

        {/* ============ US TAB ============ */}
        <TabsContent value="us" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🇺🇸</span>
                United States — Fragmented Multi-Payer System
              </CardTitle>
              <CardDescription>
                Market Size: $1.57T (2025) • Model: Multi-payer (government + commercial + self-funded) • Private 60%; Government 40%
              </CardDescription>
            </CardHeader>
          </Card>

          {/* US Payers */}
          <Accordion type="multiple" className="space-y-2">
            {usPayers
              .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tier.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((payer, idx) => (
              <AccordionItem key={idx} value={`payer-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge variant={payer.tier.includes("Tier 1") ? "default" : "secondary"} className="text-xs">
                      {payer.tier}
                    </Badge>
                    <span className="font-semibold">{payer.name}</span>
                    {payer.details.find(d => d.aspect === "Revenue") && (
                      <Badge variant="outline" className="text-xs">
                        {payer.details.find(d => d.aspect === "Revenue")?.detail}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <DetailTable details={payer.details} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Government Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Landmark className="h-5 w-5 text-primary" />
                Tier 3: Government Programs (Direct Payers)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-2">
                {usGovernmentPrograms.map((prog, idx) => (
                  <AccordionItem key={idx} value={`gov-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold">{prog.name}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <DetailTable details={prog.details} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* PBMs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="h-5 w-5 text-primary" />
                Tier 4: Pharmacy Benefit Managers (PBMs)
              </CardTitle>
              <CardDescription>Critical for drug coverage decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-medium">PBM</th>
                      <th className="text-left p-3 font-medium">Size</th>
                      <th className="text-left p-3 font-medium">Coverage</th>
                      <th className="text-left p-3 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usPBMs.map((pbm, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-semibold">{pbm.name}</td>
                        <td className="p-3">{pbm.size}</td>
                        <td className="p-3">{pbm.coverage}</td>
                        <td className="p-3 text-muted-foreground">{pbm.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 border">
                <h4 className="font-semibold mb-2">PBM Payment Terms</h4>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div><span className="font-medium">Wholesaler:</span> Net 28-45 days</div>
                  <div><span className="font-medium">Pharmacy:</span> 1-5 days to patient; insurer 30-45 days</div>
                  <div><span className="font-medium">Manufacturer:</span> Net 90 days (chargebacks, rebates quarterly)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ EUROPE TAB ============ */}
        <TabsContent value="europe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🇪🇺</span>
                European Union — Multi-Model Payer Systems
              </CardTitle>
              <CardDescription>Beveridge (NHS) | Bismarck (Sickness Funds) | Regulated Private</CardDescription>
            </CardHeader>
          </Card>

          <Accordion type="multiple" className="space-y-2">
            {europeanSystems
              .filter(s => !searchQuery || s.country.toLowerCase().includes(searchQuery.toLowerCase()) || s.systemType.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((system, idx) => (
              <AccordionItem key={idx} value={`eu-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{system.flag}</span>
                    <span className="font-semibold">{system.country}</span>
                    <Badge variant="outline" className="text-xs">{system.systemType.split(",")[0]}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <DetailTable details={system.details} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* ============ APAC & EMERGING TAB ============ */}
        <TabsContent value="apac" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Asia-Pacific, Americas & Emerging Markets
              </CardTitle>
            </CardHeader>
          </Card>

          <Accordion type="multiple" className="space-y-2">
            {apacSystems
              .filter(s => !searchQuery || s.country.toLowerCase().includes(searchQuery.toLowerCase()) || s.systemType.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((system, idx) => (
              <AccordionItem key={idx} value={`apac-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{system.flag}</span>
                    <span className="font-semibold">{system.country}</span>
                    <Badge variant="outline" className="text-xs">{system.region}</Badge>
                    <Badge variant="secondary" className="text-xs hidden md:inline-flex">{system.systemType.split(":")[0]}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <DetailTable details={system.details} />
                  {system.subSections?.map((sub, si) => (
                    <div key={si} className="ml-4 border-l-2 border-primary/30 pl-4">
                      <h4 className="font-semibold text-sm mb-2">{sub.title}</h4>
                      <DetailTable details={sub.details} compact />
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* ============ MENA TAB ============ */}
        <TabsContent value="mena" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Middle East & North Africa (MENA)
              </CardTitle>
              <CardDescription>Varied models: Government-dominant to mixed public-private</CardDescription>
            </CardHeader>
          </Card>

          <Accordion type="multiple" className="space-y-2">
            {menaSystems
              .filter(s => !searchQuery || s.country.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((system, idx) => (
              <AccordionItem key={idx} value={`mena-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{system.flag}</span>
                    <span className="font-semibold">{system.country}</span>
                    <Badge variant="outline" className="text-xs">{system.systemType.split("(")[0].trim()}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <DetailTable details={system.details} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* ============ COMPARATIVE MATRIX ============ */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Comparative Payer Characteristics Matrix
              </CardTitle>
              <CardDescription>Side-by-side comparison across 9 major markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-semibold min-w-[140px] sticky left-0 bg-muted/50">Characteristic</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇺🇸 USA</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇬🇧 UK</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇩🇪 Germany</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇫🇷 France</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇨🇦 Canada</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇯🇵 Japan</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇮🇳 India</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇨🇳 China</th>
                      <th className="text-center p-2 font-semibold min-w-[100px]">🇧🇷 Brazil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativeMatrix
                      .filter(r => !searchQuery || r.characteristic.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30">
                        <td className="p-2 font-medium sticky left-0 bg-card">{row.characteristic}</td>
                        <td className="p-2 text-center">{row.usa}</td>
                        <td className="p-2 text-center">{row.uk}</td>
                        <td className="p-2 text-center">{row.germany}</td>
                        <td className="p-2 text-center">{row.france}</td>
                        <td className="p-2 text-center">{row.canada}</td>
                        <td className="p-2 text-center">{row.japan}</td>
                        <td className="p-2 text-center">{row.india}</td>
                        <td className="p-2 text-center">{row.china}</td>
                        <td className="p-2 text-center">{row.brazil}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ STRATEGY TAB ============ */}
        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Strategic Implications for Pharma/Manufacturers
              </CardTitle>
              <CardDescription>By Payer Region & Payment Dynamics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* High-Paying Regions */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  HIGH-PAYING REGIONS (Premium Pricing Opportunity)
                </h3>
                <div className="grid gap-2">
                  {strategicImplications.highPaying.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-green-50 dark:bg-green-950/20 border border-green-200 rounded-lg p-3">
                      <span className="text-green-600 font-semibold text-sm min-w-[200px]">{item.region}</span>
                      <span className="text-sm">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Government-Dominant */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-red-600" />
                  GOVERNMENT-DOMINANT REGIONS (Price Control Risk)
                </h3>
                <div className="grid gap-2">
                  {strategicImplications.governmentDominant.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg p-3">
                      <span className="text-red-600 font-semibold text-sm min-w-[200px]">{item.region}</span>
                      <span className="text-sm">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fragmented */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-orange-600" />
                  FRAGMENTED REGIONS (Complex Payer Strategies Required)
                </h3>
                <div className="grid gap-2">
                  {strategicImplications.fragmented.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 rounded-lg p-3">
                      <span className="text-orange-600 font-semibold text-sm min-w-[200px]">{item.region}</span>
                      <span className="text-sm">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fastest-Growing */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  FASTEST-GROWING REGIONS (Market Opportunity)
                </h3>
                <div className="grid gap-2">
                  {strategicImplications.fastestGrowing.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-lg p-3">
                      <span className="text-blue-600 font-semibold text-sm min-w-[200px]">{item.region}</span>
                      <span className="text-sm">{item.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Reliability */}
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-purple-600" />
                  PAYMENT RELIABILITY RANKING
                </h3>
                <div className="grid gap-2">
                  {strategicImplications.paymentReliability.map((item, i) => (
                    <div key={i} className={`flex items-start gap-2 rounded-lg p-3 border ${
                      i === 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-200' : 
                      i === 1 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200' : 
                      'bg-red-50 dark:bg-red-950/20 border-red-200'
                    }`}>
                      <span className={`font-semibold text-sm min-w-[200px] ${
                        i === 0 ? 'text-green-600' : i === 1 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{item.rank}</span>
                      <span className="text-sm">{item.regions}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="bg-muted/50 border rounded-lg p-4">
                <h3 className="font-semibold mb-3">KEY TAKEAWAYS FOR STRATEGY</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Fragmented USA</strong> = Higher prices possible but complex payer management required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Single-Payer UK</strong> = Lower prices but straightforward (NICE threshold known)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Multi-Payer Europe</strong> = Moderate prices; benefits from HTA body harmonization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Government-Dominant APAC</strong> = Ultra-low prices but high volume potential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Payment reliability</strong> varies inversely with cost control (government price control = delayed payment)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>RWE Requirements</strong> increasingly standardized (FDA/EMA/NICE/CADTH converging) but still region-specific</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
