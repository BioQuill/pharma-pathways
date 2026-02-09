// TA-Specific Clinical, Economic, and Access Scoring Data per Market
// Based on the comprehensive Pricing & Access Index document

export interface TAMarketScoring {
  market: string;
  clinicalScoring: { title: string; maxPoints: string; items: { label: string; points: string; detail?: string }[] }[];
  economicScoring: { title: string; maxPoints: string; items: { label: string; points: string; detail?: string }[] }[];
  accessScoring: { title: string; maxPoints: string; items: { label: string; points: string; detail?: string }[] }[];
  probabilityBands?: { range: string; label: string; description: string }[];
}

export interface TASpecificScoring {
  taName: string;
  marketScorings: TAMarketScoring[];
}

export const taSpecificScoringData: TASpecificScoring[] = [
  {
    taName: "1. Oncology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30/35", items: [
            { label: "Overall survival benefit", points: "0-15", detail: "≥12mo OS improvement: 15 | 6-12mo: 12 | 3-6mo: 8 | <3mo or PFS-only: 4" },
            { label: "Response rate/depth", points: "0-8", detail: "CR rate >40%: 8; ORR >60%: 6" },
            { label: "Biomarker-selected population", points: "0-7", detail: "Companion diagnostic: 7; predictive biomarker: 5" },
            { label: "Safety/tolerability vs. chemo", points: "0-5", detail: "Better AE profile: 5; similar: 3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30/35", items: [
            { label: "ICER threshold", points: "0-15", detail: "<$150K/QALY: 15 | $150-250K (cancer flexibility): 12 | $250-450K (rare/end-of-life): 8 | >$450K: 3" },
            { label: "Budget impact", points: "0-12", detail: "<$100M/payer/year: 12 | $100-500M: 8 | >$500M: 3 (major barrier even for cancer)" },
            { label: "Cost offsets", points: "0-8", detail: "Hospitalizations, supportive care reduction documented" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Breakthrough/accelerated approval", points: "0-10", detail: "BTD: 10; accelerated: 8" },
            { label: "NCCN Guidelines inclusion", points: "0-8", detail: "Category 1: 8; 2A: 6" },
            { label: "OCM alignment", points: "0-4", detail: "Oncology Care Model eligible: 4" },
            { label: "Prior authorization burden", points: "0-3", detail: "Biomarker-only: 3; extensive: -2" },
          ]},
        ],
        probabilityBands: [
          { range: "80-100", label: "Very High", description: "OS >12mo + ICER <$250K" },
          { range: "60-79", label: "High", description: "OS 6-12mo + ICER <$350K" },
          { range: "40-59", label: "Moderate", description: "PFS benefit + ICER <$450K" },
          { range: "20-39", label: "Low", description: "Minimal benefit or >$500K" },
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "QALY gain", points: "0-20", detail: ">3 QALYs: 20; 2-3: 15; 1-2: 10; <1: 5" },
            { label: "End-of-life criteria met", points: "0-10", detail: "Life expectancy <24mo + extension >3mo: 10" },
            { label: "Overall survival", points: "0-10", detail: ">12mo: 10; 6-12mo: 7; 3-6mo: 4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. threshold", points: "0-25", detail: "<£30K/QALY: 25 | £30-50K (standard cancer): 20 | £50-100K (end-of-life met): 15 | >£100K: 5 (CDF or rejection)" },
            { label: "Budget impact NHS", points: "0-10", detail: "<£50M/year: 10; >£500M: 2" },
            { label: "CDF pathway eligibility", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-10", items: [
            { label: "CDF managed access pathway", points: "0-6", detail: "Eligible: 6" },
            { label: "Clinical infrastructure", points: "0-4", detail: "Existing biomarker testing: 4" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-45", items: [
            { label: "Additional benefit rating", points: "0-25", detail: "Considerable (3) - major OS benefit: 25 | Minor (4) - PFS or QoL: 18 | Non-quantifiable (5): 10 | No benefit (6): 3" },
            { label: "Patient-relevant endpoints", points: "0-12", detail: "OS primary: 12; PFS: 8; ORR: 4" },
            { label: "Evidence quality", points: "0-8", detail: "Phase III head-to-head: 8; single-arm with historical: 4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15", detail: "Parity +15; premium justified if benefit 3-4: +10" },
            { label: "Budget impact sickness funds", points: "0-10", detail: "<€100M: 10; >€500M: 3" },
            { label: "Cost-effectiveness implied", points: "0-5", detail: "IQWiG favorable: 5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "Orphan designation", points: "0-10", detail: "Orphan: 10; no AMNOG" },
            { label: "Early benefit", points: "0-5" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Efficacy vs. Chinese SOC", points: "0-12", detail: "Major improvement: 12; incremental: 6" },
            { label: "Chinese trial data", points: "0-10", detail: "Phase III China: 10; bridging: 5; none: -5 penalty" },
            { label: "Rare cancer/unmet need", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "VBP price reduction", points: "0-25", detail: "70%+ cut accepted: 25 | 60-70%: 20 | 50-60%: 15 | <50%: 5" },
            { label: "Budget impact", points: "0-10", detail: "Manageable at reduced price: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "VBP volume commitment", points: "0-15", detail: "50-80% market share: 15; <30%: 5" },
            { label: "Hospital network", points: "0-10", detail: "Broad hospital adoption: 10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "2. Cardiology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25/30", items: [
            { label: "MACE reduction", points: "0-12", detail: "30% RRR: 12; 20-30%: 9; 10-20%: 6; <10%: 3" },
            { label: "Mortality benefit", points: "0-8", detail: "All-cause mortality: 8; CV mortality: 6" },
            { label: "Event-free survival", points: "0-5", detail: "Hospitalization reduction, stroke prevention" },
            { label: "ACC/AHA Guideline Class I", points: "+8", detail: "Bonus points for Class I recommendation" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "ICER threshold", points: "0-15", detail: "<$100K/QALY: 15 | $100-150K: 10 | $150-200K: 6 | >$200K: 2 (major barrier)" },
            { label: "Budget impact", points: "0-12", detail: "<$200M/payer: 12; $200-500M: 7; >$500M: 2 (prevalent population)" },
            { label: "Cost offsets documented", points: "0-8", detail: "Hospitalization reduction: 5; MI/stroke prevention: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "ACC/AHA Guidelines", points: "0-10", detail: "Class I, Level A: 10; Class I, Level B: 8; Class IIa: 5" },
            { label: "Medicare Part D preferred formulary", points: "0-8" },
            { label: "Outcomes-based contract feasible", points: "0-4", detail: "CV outcomes trackable: 4" },
            { label: "Prior authorization", points: "0-3", detail: "Minimal: 3; step therapy: -2" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain over lifetime", points: "0-18", detail: ">2 QALYs: 18; 1-2: 12; <1: 6" },
            { label: "MACE reduction", points: "0-10", detail: ">25%: 10; 15-25%: 7; <15%: 4" },
            { label: "Quality of life improvement", points: "0-7", detail: "Symptoms, functional capacity" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-45", items: [
            { label: "ICER vs. £20-30K threshold", points: "0-30", detail: "<£20K/QALY: 30 | £20-30K: 22 | £30-40K: 12 | >£40K: 3 (likely rejection)" },
            { label: "Budget impact", points: "0-10", detail: "<£100M: 10; >£500M: 2" },
            { label: "NHS Long Term Plan alignment", points: "0-5", detail: "CVD priority: 5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-10", items: [
            { label: "Primary care prescribing infrastructure", points: "0-6", detail: "GP-led management: 6" },
            { label: "Secondary prevention pathway", points: "0-4" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - mortality benefit: 22 | Minor (4) - MACE reduction: 16 | Non-quantifiable (5) - surrogate endpoints: 8" },
            { label: "Long-term data (>2 years)", points: "0-10", detail: "5+ years: 10; 2-5 years: 7; <2 years: 3" },
            { label: "Patient-relevant", points: "0-8", detail: "Hard endpoints: 8; biomarkers only: 2" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15", detail: "Parity: 15; justified premium: 10" },
            { label: "Budget impact sickness funds", points: "0-10" },
            { label: "Cost-effectiveness implied", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Immediate access pre-negotiation", points: "0-10" },
            { label: "Long-term RCT head-to-head", points: "0-10", detail: "Required for benefit rating" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-20", items: [
            { label: "MACE reduction in Chinese population", points: "0-10" },
            { label: "Chinese Phase III cardiovascular outcomes trial", points: "0-8", detail: "5+ year trial: 8; <3 year: 4" },
            { label: "Unmet need vs. generics", points: "0-2", detail: "Limited" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "VBP price cut", points: "0-25", detail: "70-80% cut (statins/ARBs precedent): 25 | 60-70%: 18 | 50-60%: 10 | <50%: 3" },
            { label: "Volume commitment", points: "0-10", detail: "80%+ market share: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "VBP volume guarantee", points: "0-20", detail: "50-80% market: 20; <30%: 5" },
            { label: "Hospital network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "3. Neurology/CNS",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Neurodegenerative (Alzheimer's, Parkinson's)", maxPoints: "0-30/35", items: [
            { label: "Cognition/motor function preservation", points: "0-15", detail: "Slowed decline >40%: 15; 25-40%: 11; 10-25%: 7; <10%: 3" },
            { label: "Activities of daily living (ADL)", points: "0-10", detail: "Meaningful difference: 10" },
            { label: "Caregiver burden reduction", points: "0-5" },
          ]},
          { title: "Psychiatric (Depression, Schizophrenia)", maxPoints: "0-30", items: [
            { label: "Remission/response rate", points: "0-12", detail: ">50% remission: 12; 30-50%: 8" },
            { label: "Functioning/QoL", points: "0-8" },
            { label: "Suicide risk reduction", points: "0-10", detail: "Documented benefit: 10" },
          ]},
          { title: "Epilepsy", maxPoints: "0-15", items: [
            { label: "Seizure freedom", points: "0-15", detail: ">50% seizure-free: 15; 30-50% reduction: 10" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30/35", items: [
            { label: "ICER threshold", points: "0-15", detail: "<$100K/QALY: 15 | $100-175K (neurodegen flexibility): 12 | $175-300K (Alzheimer's/rare): 8 | >$300K: 3" },
            { label: "Budget impact", points: "0-12", detail: "Alzheimer's >$1B/payer: 2 points only | Rare epilepsy <$50M: 12 points" },
            { label: "Cost offsets", points: "0-8", detail: "Institutionalization delay: 5; Caregiver productivity: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Mental Health Parity compliance", points: "0-8", detail: "Step therapy restrictions limited: 8" },
            { label: "Specialist prescriber network", points: "0-7", detail: "Neurologist/psychiatrist access" },
            { label: "Patient assistance programs", points: "0-5", detail: "Adherence support recognized" },
            { label: "Prior authorization", points: "0-5", detail: "Alzheimer's: prior MRI/biomarker: 2; Minimal: 5" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "QALY gain", points: "0-20", detail: "Neurodegen: caregiver QALYs included (>3 total: 20) | Psychiatric: functioning (>2 QALYs: 18)" },
            { label: "Disease modification vs. symptomatic", points: "0-12", detail: "Disease-modifying: 12; symptomatic: 6" },
            { label: "Safety/tolerability", points: "0-8", detail: "Fewer CNS side effects: 8" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "ICER vs. threshold", points: "0-25", detail: "<£20K/QALY: 25 | £20-30K: 20 | £30-50K (severe mental illness flexibility): 12 | >£50K: 4" },
            { label: "Caregiver QALY inclusion", points: "0-5", detail: "Family burden recognized" },
            { label: "NHS Long Term Plan (mental health priority)", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "Memory clinic/specialist infrastructure", points: "0-8", detail: "Existing pathway: 8" },
            { label: "NICE mental health guideline alignment", points: "0-7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-45", items: [
            { label: "Additional benefit", points: "0-25", detail: "Considerable (3) - disease modification: 25 | Minor (4) - symptomatic improvement: 18 | Non-quantifiable (5): 10" },
            { label: "Patient-relevant endpoints", points: "0-12", detail: "Cognition (ADAS-Cog): 8; ADLs: 6; QoL scales: 4" },
            { label: "Long-term data (>1 year)", points: "0-8", detail: "Required for neurodegeneration" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Immediate access", points: "0-10" },
            { label: "Head-to-head trial vs. standard", points: "0-10" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Efficacy vs. SOC", points: "0-12" },
            { label: "Chinese trial data", points: "0-10" },
            { label: "Unmet need", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-20", detail: "60%+ (precedent for chronic neuro): 20 | 40-60%: 14 | <40%: 6" },
            { label: "Affordability for chronic use", points: "0-10", detail: "<¥10K/year: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Volume commitment", points: "0-20" },
            { label: "Hospital/clinic network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "4. Dermatology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Disease severity impact", points: "0-10", detail: "Severe psoriasis (BSA >10%, PASI >12): 10 | Moderate (BSA 3-10%): 6 | Mild: 2" },
            { label: "Response rate", points: "0-10", detail: "PASI 90 >50% patients: 10; PASI 75 >70%: 8; PASI 50: 4" },
            { label: "Quality of life", points: "0-5", detail: "DLQI improvement >10 points: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "<$100K/QALY: 12 | $100-150K: 9 | $150-200K: 5 | >$200K: 2" },
            { label: "Budget impact", points: "0-10", detail: "Severe psoriasis (~1M US): <$300M: 10; Atopic dermatitis >$1B: 3" },
            { label: "Cost vs. existing biologics", points: "0-8", detail: "Price parity or lower: 8; premium: 4" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Step therapy requirements", points: "0-10", detail: "Minimal (systemic failure only): 10; 2+ failures: 5; 3+ failures: 2" },
            { label: "Dermatologist availability", points: "0-8", detail: "Urban access 8; rural limited 4" },
            { label: "Medical necessity documentation", points: "0-7", detail: "BSA/PASI thresholds: 7" },
            { label: "Prior authorization complexity", points: "0-5" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30", items: [
            { label: "QALY gain", points: "0-18", detail: "Severe psoriasis/atopic: >1.5 QALYs: 18 | Moderate: 1-1.5: 12 | Mild: 6" },
            { label: "Response durability", points: "0-8", detail: ">1 year sustained: 8" },
            { label: "Safety vs. systemic immunosuppression", points: "0-4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-45", items: [
            { label: "ICER vs. £20-30K", points: "0-35", detail: "<£20K: 35 | £20-30K: 28 | £30-40K: 15 | >£40K: 4" },
            { label: "Budget impact", points: "0-10", detail: "<£50M: 10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE Technology Appraisal", points: "0-8" },
            { label: "Dermatology infrastructure", points: "0-7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "Additional benefit", points: "0-20", detail: "Minor benefit (4) typical for biologics: 18 | Non-quantifiable (5): 10" },
            { label: "DLQI improvement", points: "0-10", detail: ">10-point reduction: 10; 5-10: 6" },
            { label: "Safety profile", points: "0-5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Immediate access", points: "0-10" },
            { label: "Head-to-head trial", points: "0-10" },
            { label: "Orphan exemption", points: "0-5" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "5. Endocrinology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Diabetes", maxPoints: "0-25/30", items: [
            { label: "HbA1c reduction", points: "0-10", detail: "≥1.5% reduction: 10 | 1.0-1.5%: 7 | 0.5-1.0%: 4" },
            { label: "CV outcomes benefit (MACE reduction)", points: "0-12", detail: ">20% RRR: 12; 10-20%: 8" },
            { label: "Weight loss", points: "0-5", detail: ">5% body weight: 5; 2-5%: 3" },
            { label: "Hypoglycemia reduction", points: "0-3" },
          ]},
          { title: "Obesity", maxPoints: "0-18", items: [
            { label: "Total body weight loss", points: "0-12", detail: "≥15%: 12 | 10-15%: 9 | 5-10%: 5" },
            { label: "Cardiometabolic benefits", points: "0-6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "ICER threshold", points: "0-15", detail: "Diabetes with CVOT: <$100K/QALY: 15; $100-150K: 10 | Obesity: <$150K: 12 | Rare endocrine: <$175K: 13" },
            { label: "Budget impact", points: "0-12", detail: "Diabetes/obesity population huge >$2B/payer: 2 | Rare endocrine <$50M: 12" },
            { label: "Cost offsets", points: "0-8", detail: "CV events prevented: 5; Dialysis delay (nephropathy): 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "ADA Guidelines", points: "0-10", detail: "First/second-line recommendation: 10; Later-line: 5" },
            { label: "Step therapy", points: "0-8", detail: "After metformin only: 8; Multiple failures required: 3" },
            { label: "Medicare Part D vs. Part B", points: "0-4", detail: "Part B medical benefit if injectable: 4" },
            { label: "Prior authorization", points: "0-3" },
          ]},
          { title: "Obesity Coverage (US)", maxPoints: "0-15", items: [
            { label: "Commercial coverage", points: "0-10", detail: "Highly variable by employer" },
            { label: "Medicare", points: "0", detail: "Obesity drugs excluded by statute" },
            { label: "Medicaid", points: "0-5", detail: "State-dependent; most exclude" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30", items: [
            { label: "QALY gain", points: "0-15", detail: "Diabetes with CV benefit: >2 QALYs: 15 | Obesity with comorbidity: 1-2: 10 | Metabolic only: <1: 5" },
            { label: "CV outcomes", points: "0-10", detail: "MACE reduction documented: 10" },
            { label: "Long-term complications prevention", points: "0-5", detail: "Retinopathy, nephropathy" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-50", items: [
            { label: "ICER vs. threshold", points: "0-35", detail: "<£20K/QALY: 35 | £20-30K: 28 | £30-40K: 15 (rarely accepted for diabetes) | >£40K: 4" },
            { label: "Budget impact", points: "0-10", detail: "Diabetes prevalent >£1B: 2 | Rare <£20M: 10" },
            { label: "NHS Diabetes Prevention Programme alignment", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-10", items: [
            { label: "NICE guideline inclusion", points: "0-6" },
            { label: "Primary care infrastructure", points: "0-4" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "Additional benefit", points: "0-20", detail: "Considerable (3) - CV outcomes: 20 | Minor (4) - glycemic control: 15 | Non-quantifiable (5): 8" },
            { label: "Long-term trial data (>2 years)", points: "0-10", detail: "CVOT required: 10" },
            { label: "Patient-relevant", points: "0-5", detail: "Hard endpoints: 5; HbA1c only: 2" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Immediate access", points: "0-10" },
            { label: "CVOT head-to-head", points: "0-10" },
            { label: "Specialist endorsement", points: "0-5" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-20", items: [
            { label: "HbA1c reduction in Chinese population", points: "0-8" },
            { label: "Chinese CVOT or outcomes trial", points: "0-10", detail: "5+ year trial: 10" },
            { label: "Insulin-sparing effect", points: "0-2" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-45", items: [
            { label: "VBP price cut", points: "0-30", detail: "70-80% (insulin precedent): 30 | 60-70%: 22 | 50-60%: 14 | <50%: 5" },
            { label: "Volume commitment", points: "0-10", detail: "Diabetes 80%+ market: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Essential medicines list", points: "0-10" },
            { label: "Hospital network", points: "0-10" },
            { label: "Generic competition", points: "0-5" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "6. Immunology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Rheumatoid Arthritis (RA)", maxPoints: "0-30/35", items: [
            { label: "ACR response", points: "0-12", detail: "ACR 70 >40%: 12; ACR 50 >50%: 9; ACR 20 >70%: 6" },
            { label: "Radiographic progression halt", points: "0-8", detail: "Sharp score no worsening: 8" },
            { label: "Remission rate (DAS28 <2.6)", points: "0-6" },
          ]},
          { title: "Inflammatory Bowel Disease (IBD)", maxPoints: "0-27", items: [
            { label: "Clinical remission", points: "0-12", detail: ">40%: 12; 30-40%: 9; 20-30%: 6" },
            { label: "Mucosal healing", points: "0-10", detail: "Endoscopic remission >30%: 10" },
            { label: "Steroid-free remission", points: "0-5" },
          ]},
          { title: "Psoriatic Arthritis, Ankylosing Spondylitis", maxPoints: "0-20", items: [
            { label: "Joint response (ACR/ASAS)", points: "0-10" },
            { label: "Skin response (PASI)", points: "0-6" },
            { label: "MRI inflammation reduction", points: "0-4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "<$100K/QALY: 12 | $100-150K: 9 | $150-200K: 6 | >$200K: 2" },
            { label: "Budget impact", points: "0-10", detail: "RA (~2M US): <$500M/payer: 10; >$1B: 3 | IBD (~3M US): <$400M: 10" },
            { label: "Cost vs. existing biologics", points: "0-8", detail: "Parity or lower: 8; Premium <20%: 6; Premium >30%: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Step therapy requirements", points: "0-8", detail: "After 1 conventional DMARD: 8; After 2+ DMARDs + 1 biologic: 4; Multiple biologic failures: 2" },
            { label: "ACR/EULAR guideline alignment", points: "0-8", detail: "Recommended positioning: 8" },
            { label: "Specialty pharmacy restrictions", points: "0-5", detail: "Limited distribution: 2; open: 5" },
            { label: "Prior authorization complexity", points: "0-4", detail: "Streamlined: 4; burdensome: 1" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain", points: "0-20", detail: "RA/IBD: >2 QALYs: 20 | SpA: 1.5-2: 15 | Allergic: <1.5: 10" },
            { label: "Disease activity control", points: "0-10", detail: "Sustained remission: 10" },
            { label: "Steroid-sparing effect", points: "0-5", detail: "Recognized cost-offset" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. £20-30K", points: "0-30", detail: "<£20K: 30 | £20-30K: 24 | £30-40K: 12 | >£40K: 3" },
            { label: "Budget impact", points: "0-10", detail: "<£100M: 10; >£500M: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE Technology Appraisal pathway", points: "0-8", detail: "Positive TA: 8" },
            { label: "Rheumatology/gastroenterology infrastructure", points: "0-7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - radiographic halt + high response: 22 | Minor (4) - response rates superior: 16 | Non-quantifiable (5): 9" },
            { label: "Patient-relevant", points: "0-12", detail: "Function, pain, QoL: 12" },
            { label: "Long-term data (>1 year)", points: "0-6", detail: "Extensions required: 6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Head-to-head vs. TNF inhibitor", points: "0-12", detail: "Required for benefit assessment: 12" },
            { label: "Immediate access", points: "0-8" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Response rates vs. Chinese SOC", points: "0-12" },
            { label: "Chinese trial data", points: "0-10", detail: "Phase III China: 10" },
            { label: "Severe disease (hospitalization prevention)", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "50-60% (biologics precedent): 25 | 40-50%: 18 | 30-40%: 10 | <30%: 4" },
            { label: "Local biosimilar manufacturing", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Volume commitment", points: "0-20" },
            { label: "Hospital network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "7. Infectious Diseases",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Antimicrobial Resistance (AMR)", maxPoints: "0-35", items: [
            { label: "Novel mechanism vs. MDR/XDR pathogens", points: "0-15", detail: "CRE: 15; MRSA, VRE, resistant Pseudomonas: 12; ESBL: 8; Standard: 3" },
            { label: "Clinical cure/microbiologic eradication", points: "0-10", detail: "≥85% cure: 10; 70-85%: 7; 60-70%: 4" },
            { label: "Safety vs. existing therapy", points: "0-6", detail: "Lower nephro/hepatotoxicity: 6" },
            { label: "Oral bioavailability", points: "0-4", detail: "Oral vs. IV-only: 4" },
          ]},
          { title: "Antivirals (HIV, HCV, Influenza)", maxPoints: "0-35", items: [
            { label: "Cure rate (HCV)", points: "0-15", detail: ">95% SVR12: 15" },
            { label: "Viral suppression (HIV)", points: "0-12", detail: ">95% undetectable: 12" },
            { label: "Resistance barrier", points: "0-5", detail: "High genetic barrier: 5" },
            { label: "Duration of therapy", points: "0-3", detail: "8 weeks vs. 12-24 weeks HCV: 3" },
          ]},
        ],
        economicScoring: [
          { title: "Hospital/Institutional", maxPoints: "0-25", items: [
            { label: "Length of stay reduction", points: "0-10", detail: ">2 days shorter: 10; 1-2 days: 6" },
            { label: "DRG bundled cost impact", points: "0-8", detail: "Reduces overall episode cost: 8" },
            { label: "Readmission reduction", points: "0-4", detail: "30-day readmit lower: 4" },
          ]},
          { title: "Outpatient", maxPoints: "0-15", items: [
            { label: "ICER threshold", points: "0-8", detail: "HCV cure <$50K/cure: 8; HIV <$100K/QALY: 8" },
            { label: "Budget impact", points: "0-7", detail: "<$200M/payer: 7" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "P&T committee acceptance", points: "0-10", detail: "Rapid adoption: 10" },
            { label: "Antimicrobial stewardship integration", points: "0-8", detail: "Reserve status designated: 8" },
            { label: "IDSA guideline inclusion", points: "0-5", detail: "First-line positioning: 5" },
            { label: "Medicare Part A/B reimbursement", points: "0-7", detail: "Bundled payment adequate: 7" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Resistance coverage (AMR priority)", points: "0-20", detail: "Last-line reserve: 20; Novel class: 15; Improved spectrum: 10" },
            { label: "Clinical efficacy", points: "0-12", detail: "Non-inferiority or superiority: 12" },
            { label: "NHS stewardship alignment", points: "0-8", detail: "Reserve status appropriate use: 8" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Cost-effectiveness", points: "0-20", detail: "Antibiotics: cost per life-year saved <£20K: 20 | Antivirals: QALY-based <£30K: 20" },
            { label: "Budget impact", points: "0-10", detail: "Reserve antibiotic (low volume) <£10M: 10; High-volume outpatient >£100M: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "NHS England procurement pathway", points: "0-10", detail: "Centralized purchasing: 10" },
            { label: "NICE antimicrobial prescribing guideline", points: "0-7", detail: "Recommended positioning: 7" },
            { label: "Rapid access for life-threatening infections", points: "0-3" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - novel mechanism, AMR: 22 | Minor (4) - improved spectrum: 16 | Non-quantifiable (5): 9" },
            { label: "Evidence quality", points: "0-12", detail: "Phase III adequate & well-controlled: 12" },
            { label: "Patient safety", points: "0-6", detail: "Reduced adverse events: 6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Hospital reimbursement (DRG add-on)", points: "0-12", detail: "NUB status: 12" },
            { label: "Reserve antibiotic classification", points: "0-8", detail: "Appropriate stewardship use: 8" },
            { label: "Early benefit assessment exemption", points: "0-5", detail: "Breakthrough therapy: 5" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30", items: [
            { label: "Resistance coverage (Chinese epidemiology)", points: "0-15", detail: "Addresses prevalent MDR strains in China: 15; Standard: 5" },
            { label: "Chinese clinical trial", points: "0-10", detail: "Phase III China: 10; bridging: 5" },
            { label: "Essential medicine alignment", points: "0-5", detail: "WHO/China essential list: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-20", detail: "Essential antibiotic 40-50%: 20 | Specialty antiviral 30-40%: 15 | Reserve antibiotic 20-30%: 10" },
            { label: "Hospital procurement volume", points: "0-10", detail: "50%+ hospital share: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Essential medicines list", points: "0-10" },
            { label: "Hospital formulary", points: "0-10" },
            { label: "Distribution network", points: "0-5" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "8. Respiratory",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Asthma", maxPoints: "0-35", items: [
            { label: "Exacerbation reduction", points: "0-15", detail: "≥60% reduction severe: 15; 40-60%: 11; 25-40%: 7; <25%: 3" },
            { label: "Lung function (FEV1)", points: "0-6", detail: ">200mL improvement: 6; 100-200mL: 4" },
            { label: "Oral corticosteroid-sparing", points: "0-8", detail: ">50% OCS reduction: 8" },
            { label: "Biomarker-targeted", points: "0-6", detail: "Precision medicine (eosinophilic, IgE, Type 2): 6" },
          ]},
          { title: "COPD", maxPoints: "0-35", items: [
            { label: "Exacerbation reduction", points: "0-12", detail: ">30% reduction moderate/severe: 12; 20-30%: 8" },
            { label: "Lung function", points: "0-8", detail: "Trough FEV1 >100mL: 8" },
            { label: "Mortality benefit", points: "0-10", detail: "All-cause mortality reduction: 10; not shown: 0" },
            { label: "Dyspnea/QoL", points: "0-5", detail: "SGRQ improvement >4 points: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "Severe asthma biologics <$150K/QALY: 12 | COPD <$100K: 12 | Maintenance inhalers <$50K: 12" },
            { label: "Budget impact", points: "0-10", detail: "Severe asthma (~260K US) <$300M/payer: 10 | COPD (16M US) >$1B/payer: 3" },
            { label: "Cost offsets", points: "0-8", detail: "Hospitalization reduction: 5; ER visits, OCS courses: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Step therapy requirements", points: "0-8", detail: "Severe asthma biologics (after ICS/LABA + OCS): 8; COPD triple (after dual): 6" },
            { label: "GINA/GOLD guideline alignment", points: "0-8", detail: "Recommended step: 8" },
            { label: "Biomarker testing infrastructure", points: "0-5", detail: "IgE, eosinophils (routine): 5; FeNO (emerging): 3" },
            { label: "Prior authorization complexity", points: "0-4", detail: "Streamlined: 4; burdensome: 1" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain", points: "0-20", detail: "Severe asthma biologics: >1.5 QALYs: 20 | COPD: 1-1.5: 14 | Mild-moderate: <1: 8" },
            { label: "Exacerbation reduction", points: "0-10", detail: "Hospitalization prevention valued: 10" },
            { label: "Steroid-sparing (asthma)", points: "0-5", detail: "Recognized safety benefit: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. £20-30K", points: "0-30", detail: "<£20K: 30 | £20-30K: 24 | £30-40K (severe asthma flexibility): 15 | >£40K: 4" },
            { label: "Budget impact", points: "0-10", detail: "<£100M: 10; >£500M: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE asthma/COPD guideline inclusion", points: "0-8", detail: "Recommended: 8" },
            { label: "Specialist infrastructure (severe asthma centers)", points: "0-7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - exacerbation + mortality (COPD): 22 | Minor (4) - exacerbation reduction: 16 | Non-quantifiable (5): 9" },
            { label: "Patient-relevant endpoints", points: "0-12", detail: "Exacerbations: 8; QoL (SGRQ, ACQ): 6; Symptoms: 4" },
            { label: "Long-term data (>1 year)", points: "0-6", detail: "Required for chronic disease: 6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Immediate access", points: "0-10" },
            { label: "Head-to-head trial", points: "0-10" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Exacerbation reduction (Chinese population)", points: "0-12" },
            { label: "Chinese trial data", points: "0-10", detail: "Phase III China: 10" },
            { label: "Mortality benefit (COPD)", points: "0-3", detail: "Rare in trials" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "Inhalers 50-60%: 25; Biologics 40-50%: 20; COPD maintenance 60-70%: 25" },
            { label: "Volume commitment", points: "0-10", detail: "80%+ hospitals: 10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Hospital formulary", points: "0-15" },
            { label: "Distribution network", points: "0-10" },
            { label: "Essential medicines list", points: "0-5" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "9. Gastroenterology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "IBD (Crohn's, Ulcerative Colitis)", maxPoints: "0-35", items: [
            { label: "Clinical remission", points: "0-12", detail: "≥45% clinical remission: 12; 35-45%: 9; 25-35%: 6" },
            { label: "Endoscopic/mucosal healing", points: "0-10", detail: "≥40% mucosal healing: 10; 30-40%: 7; 20-30%: 4" },
            { label: "Steroid-free remission", points: "0-6", detail: "Sustained >26 weeks: 6" },
            { label: "Both Crohn's and UC indication", points: "0-4", detail: "Dual indication valued: 4" },
            { label: "Fistula closure (Crohn's)", points: "0-3", detail: "Perianal fistula healing: 3" },
          ]},
          { title: "NASH/Liver Disease", maxPoints: "0-30", items: [
            { label: "Fibrosis improvement", points: "0-15", detail: "≥1 stage fibrosis regression: 15" },
            { label: "NASH resolution", points: "0-8", detail: "Without worsening fibrosis: 8" },
            { label: "Liver-related outcomes", points: "0-7", detail: "Decompensation, HCC prevention: 7" },
          ]},
          { title: "GERD/Functional GI", maxPoints: "0-17", items: [
            { label: "Symptom resolution", points: "0-8", detail: ">70% symptom-free: 8" },
            { label: "Erosive esophagitis healing", points: "0-5" },
            { label: "QoL improvement", points: "0-4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "IBD <$150K/QALY: 12 | NASH <$175K: 11 | GERD <$100K: 12" },
            { label: "Budget impact", points: "0-10", detail: "IBD (~3M US) <$500M/payer: 10 | NASH (~12M at-risk) >$2B: 2 | GERD >$1.5B: 3" },
            { label: "Cost offsets", points: "0-8", detail: "Surgery avoidance (colectomy): 5; Hospitalization reduction: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Step therapy (IBD)", points: "0-8" },
            { label: "ACG/AGA guideline alignment", points: "0-8", detail: "Recommended positioning: 8" },
            { label: "Endoscopy requirement for monitoring", points: "0-5", detail: "Standard practice: 5; barrier: 2" },
            { label: "Prior authorization", points: "0-4" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain", points: "0-20", detail: "IBD >1.5 QALYs: 20 | NASH/cirrhosis 1-2: 15 | Functional GI <1: 8" },
            { label: "Disease control/remission", points: "0-10", detail: "Sustained remission: 10" },
            { label: "Surgery/hospitalization avoidance", points: "0-5", detail: "Recognized benefit: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. £20-30K", points: "0-30", detail: "<£20K: 30 | £20-30K: 24 | £30-40K (IBD flexibility): 15 | >£40K: 4" },
            { label: "Budget impact", points: "0-10", detail: "<£100M: 10; >£500M: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE IBD guideline inclusion", points: "0-8" },
            { label: "Gastroenterology infrastructure", points: "0-7", detail: "Endoscopy capacity: 7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - mucosal healing + clinical remission: 22 | Minor (4) - clinical response: 16 | Non-quantifiable (5): 9" },
            { label: "Patient-relevant endpoints", points: "0-12" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Head-to-head trial", points: "0-12" },
            { label: "Immediate access", points: "0-8" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Response rates vs. Chinese SOC", points: "0-12" },
            { label: "Chinese trial data", points: "0-10" },
            { label: "Severe disease prevention", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "IBD biologics 40-50%: 25; GERD/PPI 60-70%: 25; NASH (novel) 30-40%: 20" },
            { label: "Volume commitment", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Volume commitment", points: "0-20" },
            { label: "Hospital network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "10. Hematology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Hematologic Malignancies (AML, CML, MDS, Myeloma, Lymphomas)", maxPoints: "0-40", items: [
            { label: "Overall survival benefit", points: "0-18", detail: "≥12mo OS improvement: 18; 6-12mo: 14; 3-6mo: 9; <3mo or PFS-only: 4" },
            { label: "Complete response (CR) rate", points: "0-10", detail: "CR >40%: 10; 30-40%: 7; 20-30%: 4" },
            { label: "Depth of response (MRD-negative)", points: "0-7", detail: "MRD negativity >60%: 7" },
            { label: "Targeted therapy (mutation-specific)", points: "0-5", detail: "FLT3, IDH, BCR-ABL: 5" },
          ]},
          { title: "Non-Malignant Blood Disorders", maxPoints: "0-40", items: [
            { label: "Disease control/symptom resolution", points: "0-15", detail: "Hemophilia: bleed prevention >90%: 15; Sickle cell: VOC reduction >50%: 15; PNH: transfusion independence >60%: 15" },
            { label: "Quality of life", points: "0-10", detail: "Major functional improvement: 10" },
            { label: "Curative potential", points: "0-10", detail: "Gene therapy cure: 10" },
            { label: "Prophylaxis vs. on-demand (hemophilia)", points: "0-5", detail: "Prophylaxis valued: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "ICER threshold", points: "0-12", detail: "Hematologic malignancies <$200K/QALY: 12 | Hemophilia/rare <$250K: 12 | Sickle cell <$150K: 11 | Gene therapy <$1-2M one-time: 10" },
            { label: "Budget impact", points: "0-8", detail: "Rare hematologic malignancy <$100M/payer: 8; Hemophilia (~20K US) <$500M: 7; Sickle cell (~100K US) <$400M: 6" },
            { label: "Cost offsets", points: "0-5", detail: "Hospitalization, transfusions, factor VIII replacement: 5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "NCCN Hematologic Malignancy Guidelines", points: "0-10", detail: "Category 1: 10; 2A: 8" },
            { label: "Breakthrough/accelerated approval", points: "0-8", detail: "BTD: 8; accelerated: 6" },
            { label: "Biomarker/companion diagnostic", points: "0-5", detail: "Precision medicine: 5" },
            { label: "Prior authorization", points: "0-2", detail: "Minimal for malignancies: 2" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "QALY gain", points: "0-22", detail: "Hematologic malignancies >3 QALYs: 22 (end-of-life criteria) | Hemophilia/rare bleeding >2: 18 | Sickle cell/chronic anemia 1-2: 12" },
            { label: "Overall survival/disease-free survival", points: "0-12", detail: "OS benefit valued: 12" },
            { label: "Quality of life (non-malignant)", points: "0-6", detail: "Major burden reduction: 6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "ICER vs. threshold", points: "0-25", detail: "Hematologic malignancies £50-100K/QALY (end-of-life): 25 | Rare bleeding £30-50K: 20 | Gene therapy £100-300K (ultra-rare): 18 | >£300K: 5" },
            { label: "Budget impact", points: "0-10", detail: "Ultra-rare (<5K UK patients) <£50M: 10; Common hematologic malignancy >£200M: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "Cancer Drugs Fund eligibility", points: "0-8", detail: "Managed access for malignancies: 8" },
            { label: "Highly Specialized Technology (HST) pathway", points: "0-7", detail: "Ultra-rare: 7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-45", items: [
            { label: "Additional benefit", points: "0-25", detail: "Considerable (3) - OS benefit, curative intent: 25 | Minor (4) - response rates, PFS: 18" },
            { label: "Patient-relevant endpoints", points: "0-12" },
            { label: "Evidence quality", points: "0-8" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Orphan designation", points: "0-12", detail: "Automatic benefit, no assessment: 12" },
            { label: "Early benefit assessment (non-orphan)", points: "0-8" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30", items: [
            { label: "Response rates", points: "0-15" },
            { label: "Chinese trial data", points: "0-10" },
            { label: "Unmet need", points: "0-5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-20", detail: "Hematologic malignancies 50-60%: 20 | Rare diseases 30-40%: 18 | Gene therapy 40-50%: 15" },
            { label: "Affordability", points: "0-10", detail: "Manageable at volume pricing: 10" },
            { label: "Local manufacturing", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Essential medicines list", points: "0-10" },
            { label: "Hospital formulary", points: "0-10" },
            { label: "Distribution", points: "0-5" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "11. Rheumatology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Rheumatoid Arthritis (RA)", maxPoints: "0-35", items: [
            { label: "ACR response rates", points: "0-12", detail: "ACR 70 >40%: 12; ACR 50 >50%: 9; ACR 20 >70%: 6" },
            { label: "Radiographic progression (modified Sharp)", points: "0-10", detail: "No progression (score change ≤0.5): 10; Minimal: 7; Slowed: 4" },
            { label: "Remission rate (DAS28 <2.6, CDAI ≤2.8)", points: "0-8", detail: ">40% remission: 8; 25-40%: 5" },
            { label: "Physical function (HAQ-DI)", points: "0-5", detail: "Improvement >0.5: 5" },
          ]},
          { title: "Psoriatic Arthritis, Ankylosing Spondylitis", maxPoints: "0-25", items: [
            { label: "ACR/ASAS response", points: "0-10", detail: "ASAS 40 >40%: 10" },
            { label: "MRI inflammation reduction", points: "0-6", detail: "SPARCC score improvement: 6" },
            { label: "Skin response (PASI)", points: "0-5" },
            { label: "Enthesitis/dactylitis resolution", points: "0-4" },
          ]},
          { title: "Systemic Lupus Erythematosus (SLE)", maxPoints: "0-25", items: [
            { label: "Disease activity control (SRI-4)", points: "0-12", detail: "SRI-4 response >50%: 12" },
            { label: "Flare reduction", points: "0-8", detail: "Severe flares reduced >50%: 8" },
            { label: "Steroid-sparing", points: "0-5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "RA biologics <$100K/QALY: 12; $100-150K: 8 | Novel mechanism (JAK) <$125K: 10 | Biosimilars <$75K: 12" },
            { label: "Budget impact", points: "0-10", detail: "RA (~2M US) <$500M/payer: 10 | PsA (~1M) <$300M: 10 | SLE (~200K) <$150M: 10" },
            { label: "Cost vs. existing biologics", points: "0-8", detail: "Biosimilar discount (30-40%): 8; Originator parity: 5; Premium >20%: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Step therapy", points: "0-8", detail: "After 1 conventional DMARD (methotrexate): 8; After 2 DMARDs + 1 TNF: 5; Multiple biologic failures: 3" },
            { label: "ACR/EULAR guideline alignment", points: "0-8", detail: "Recommended positioning: 8" },
            { label: "Prior authorization complexity", points: "0-5" },
            { label: "Biosimilar interchangeability (Purple Book)", points: "0-4", detail: "Interchangeable designation: 4" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain", points: "0-20", detail: "RA/SpA >1.5 QALYs: 20 | SLE 1-2: 15 | OA <1: 8" },
            { label: "Radiographic progression prevention", points: "0-10", detail: "Joint damage prevention valued: 10" },
            { label: "Function/QoL improvement", points: "0-5", detail: "HAQ-DI, SF-36: 5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. £20-30K", points: "0-30", detail: "<£20K: 30 | £20-30K: 24 | £30-40K: 12" },
            { label: "Budget impact", points: "0-10", detail: "<£100M: 10; >£500M: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE Technology Appraisal", points: "0-8", detail: "Positive TA: 8" },
            { label: "Biosimilar encouraged", points: "0-7", detail: "NHS preference: 7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - radiographic halt + high ACR response: 22 | Minor (4) - ACR response superiority: 16 | Non-quantifiable (5): 9" },
            { label: "Patient-relevant endpoints", points: "0-12", detail: "Radiographic progression: 8; Physical function (HAQ): 6; Pain/QoL: 4" },
            { label: "Long-term data (>1 year)", points: "0-6", detail: "Required: 6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Head-to-head vs. TNF", points: "0-12" },
            { label: "Immediate access", points: "0-8" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "ACR/ASAS response (Chinese population)", points: "0-12" },
            { label: "Chinese trial data", points: "0-10", detail: "Phase III China: 10" },
            { label: "Biosimilar vs. originator", points: "0-3", detail: "Biosimilar preference: 3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "Biosimilars 60-70%: 25 | Originators 50-60%: 20 | Novel mechanisms 40-50%: 15" },
            { label: "Volume commitment", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Volume commitment", points: "0-20" },
            { label: "Hospital network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "12. Ophthalmology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Retinal Diseases (AMD, DME, RVO)", maxPoints: "0-40", items: [
            { label: "Visual acuity gain (ETDRS letters)", points: "0-15", detail: "≥15 letters gained >30% patients: 15 | ≥10 letters >40%: 12 | Maintain/prevent loss: 8 | Inferior: 3" },
            { label: "Anatomic outcomes (CST reduction)", points: "0-8", detail: "Central subfield thickness <250μm: 8" },
            { label: "Durability of effect", points: "0-10", detail: "Quarterly (q12-16 weeks): 10; q8-12: 7; q4-8: 4" },
            { label: "Vision-threatening complications prevention", points: "0-7", detail: "Legal blindness prevention: 7" },
          ]},
          { title: "Glaucoma", maxPoints: "0-25", items: [
            { label: "IOP reduction", points: "0-12", detail: ">25% from baseline: 12; 20-25%: 9; 15-20%: 6" },
            { label: "Visual field preservation", points: "0-8", detail: "Prevent progression: 8" },
            { label: "Medication adherence (fixed combo)", points: "0-5" },
          ]},
          { title: "Dry Eye, Keratitis", maxPoints: "0-20", items: [
            { label: "Symptom improvement (OSDI, SPEED)", points: "0-10", detail: ">50% improvement: 10" },
            { label: "Corneal staining reduction", points: "0-6" },
            { label: "Tear production (Schirmer test)", points: "0-4" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "Medicare ASP+6% reimbursement adequacy", points: "0-10", detail: "Profitable for retina practices: 10; Marginal: 6; Loss-leader: 2" },
            { label: "ICER threshold", points: "0-8", detail: "<$100K/QALY: 8; $100-150K: 6; >$150K: 2" },
            { label: "Cost per injection vs. anti-VEGF SOC", points: "0-5", detail: "Price parity or lower: 5; Premium <30%: 3; Premium >50%: 1" },
            { label: "Injection frequency (cost-offset)", points: "0-2", detail: "Fewer injections = lower total cost: 2" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Medicare Part B buy-and-bill model", points: "0-10", detail: "ASP+6% adequate margin: 10; Practice adoption incentive critical" },
            { label: "AAO Preferred Practice Pattern alignment", points: "0-8", detail: "First/second-line: 8" },
            { label: "Retina specialist availability", points: "0-5", detail: "Urban concentration, rural access barrier: 3" },
            { label: "Prior authorization", points: "0-2", detail: "Minimal for Part B medical benefit: 2" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "QALY gain (vision-related)", points: "0-22", detail: "AMD/DME vision preservation >2 QALYs: 22 | Glaucoma 1.5-2: 18 | Dry eye <1: 10" },
            { label: "Visual acuity outcomes", points: "0-12", detail: "Maintained/improved vision: 12" },
            { label: "Quality of life (NEI-VFQ)", points: "0-6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "ICER vs. £20-30K", points: "0-25", detail: "<£20K: 25 | £20-30K: 20 | £30-40K: 10 | >£40K: 3" },
            { label: "Budget impact NHS", points: "0-10", detail: "AMD (~600K UK) <£100M: 10; >£500M: 2 | Glaucoma (~700K) <£80M: 10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE Technology Appraisal", points: "0-8", detail: "Positive TA: 8" },
            { label: "Ophthalmology clinic infrastructure", points: "0-7", detail: "Intravitreal injection capacity: 7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-45", items: [
            { label: "Additional benefit", points: "0-25", detail: "Considerable (3) - vision improvement + durability: 25 | Minor (4) - non-inferiority with fewer injections: 18 | Non-quantifiable (5): 10" },
            { label: "Patient-relevant", points: "0-12", detail: "Visual acuity (ETDRS): 10; Reading speed, mobility: 6; Injection frequency reduction: 4" },
            { label: "Evidence quality", points: "0-8", detail: "Head-to-head RCT: 8" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-25", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Immediate access", points: "0-10" },
            { label: "Head-to-head vs. aflibercept/ranibizumab", points: "0-10" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-30", items: [
            { label: "Visual outcomes (Chinese population)", points: "0-15" },
            { label: "Chinese trial data", points: "0-12", detail: "Phase III China: 12" },
            { label: "Diabetic eye disease relevance", points: "0-3", detail: "Diabetes epidemic" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "Anti-VEGF 50-60%: 25; Glaucoma drops 60-70%: 25; Novel mechanisms 40-50%: 20" },
            { label: "Affordability", points: "0-10", detail: "Accessible to rural population: 10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "Hospital/clinic network", points: "0-15" },
            { label: "Distribution", points: "0-10" },
          ]},
        ],
      },
    ],
  },
  {
    taName: "13. Urology/Nephrology",
    marketScorings: [
      {
        market: "US Markets",
        clinicalScoring: [
          { title: "Chronic Kidney Disease (CKD)", maxPoints: "0-20", items: [
            { label: "ESRD/dialysis delay", points: "0-10", detail: "Time to ESRD >20% longer: 10; 10-20%: 7" },
            { label: "Albuminuria reduction (UACR)", points: "0-6", detail: ">30% reduction: 6" },
            { label: "CV outcomes (MACE)", points: "0-4", detail: "Kidney disease CV risk reduction: 4" },
          ]},
          { title: "Prostate Cancer", maxPoints: "0-25", items: [
            { label: "Overall survival", points: "0-12", detail: ">12mo OS benefit: 12; 6-12mo: 9; <6mo: 5" },
            { label: "PSA response, rPFS", points: "0-8" },
            { label: "Bone metastases control", points: "0-5" },
          ]},
          { title: "BPH/Overactive Bladder", maxPoints: "0-15", items: [
            { label: "Symptom improvement (IPSS)", points: "0-8", detail: "≥7-point improvement: 8" },
            { label: "Flow rate improvement", points: "0-4" },
            { label: "QoL", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "ICER threshold", points: "0-12", detail: "CKD <$100K/QALY: 12 | Prostate cancer <$200K: 10 | BPH <$50K: 12" },
            { label: "Budget impact", points: "0-10", detail: "CKD (~37M US): >$2B/payer: 3 | Prostate cancer: <$500M: 8 | BPH: moderate" },
            { label: "Cost offsets", points: "0-8", detail: "Dialysis prevention: 5; Hospitalization reduction: 3" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-25", items: [
            { label: "AUA/KDIGO guideline alignment", points: "0-10", detail: "First/second-line: 10" },
            { label: "Medicare Part D formulary", points: "0-8" },
            { label: "Prior authorization", points: "0-4" },
            { label: "Specialty pharmacy", points: "0-3" },
          ]},
        ],
      },
      {
        market: "UK NICE",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-35", items: [
            { label: "QALY gain", points: "0-20", detail: "CKD dialysis prevention >2 QALYs: 20 | Prostate cancer: 15 | BPH <1: 8" },
            { label: "Renal outcomes", points: "0-10", detail: "ESRD delay valued: 10" },
            { label: "QoL improvement", points: "0-5" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-40", items: [
            { label: "ICER vs. £20-30K", points: "0-30", detail: "<£20K: 30 | £20-30K: 24 | £30-40K: 12" },
            { label: "Budget impact", points: "0-10", detail: "CKD priority (NHS Long Term Plan)" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-15", items: [
            { label: "NICE guideline inclusion", points: "0-8" },
            { label: "Nephrology/urology infrastructure", points: "0-7" },
          ]},
        ],
      },
      {
        market: "Germany G-BA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-40", items: [
            { label: "Additional benefit", points: "0-22", detail: "Considerable (3) - renal outcomes: 22 | Minor (4) - albuminuria: 16 | Non-quantifiable (5): 9" },
            { label: "Patient-relevant endpoints", points: "0-12", detail: "ESRD prevention: 10; eGFR slope: 6" },
            { label: "Long-term data", points: "0-6" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-30", items: [
            { label: "Price vs. comparator", points: "0-15" },
            { label: "Budget impact", points: "0-10" },
            { label: "Cost-effectiveness", points: "0-5" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-20", items: [
            { label: "Head-to-head renal outcomes trial", points: "0-12" },
            { label: "Immediate access", points: "0-8" },
          ]},
        ],
      },
      {
        market: "China NHSA",
        clinicalScoring: [
          { title: "Clinical Value", maxPoints: "0-25", items: [
            { label: "Renal outcomes (Chinese population)", points: "0-12" },
            { label: "Chinese trial data", points: "0-10" },
            { label: "Diabetes nephropathy relevance", points: "0-3" },
          ]},
        ],
        economicScoring: [
          { title: "Economic Value", maxPoints: "0-35", items: [
            { label: "VBP price cut", points: "0-25", detail: "CKD drugs 50-60%: 25 | Generic competition 60-70%: 25" },
            { label: "Volume commitment", points: "0-10" },
          ]},
        ],
        accessScoring: [
          { title: "Access Factors", maxPoints: "0-30", items: [
            { label: "Volume commitment", points: "0-20" },
            { label: "Hospital network", points: "0-10" },
          ]},
        ],
      },
    ],
  },
];
