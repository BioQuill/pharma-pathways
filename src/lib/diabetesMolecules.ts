// 20 Diabetes Molecules - Type 2 Diabetes focus
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const diabetesMolecules: MoleculeProfile[] = [
  // 1. Dorzagliatin - Glucokinase activator
  {
    id: "DORZ-01",
    name: "Dorzagliatin (HMS5552)",
    trialName: "DAWN",
    phase: "Approved (China)",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Hua Medicine",
    companyTrackRecord: 'average',
    nctId: "NCT03141073",
    clinicalTrialsSearchTerm: "dorzagliatin",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Dorzagliatin", "Phase III", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "First-in-class glucokinase activator (GKA)",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Novel glucose-sensing mechanism, addresses beta-cell dysfunction",
      discovery: "Roche (original), licensed to Hua Medicine",
      development: "China rights: Hua Medicine; Global: seeking partners",
      additionalInfo: [
        "Approved in China as Huatangning (Sept 2022)",
        "Restores glucose homeostasis via glucokinase activation",
        "1.07% HbA1c reduction in monotherapy trials"
      ]
    },
    patents: [
      { patentNumber: "CN105061469", title: "Glucokinase activator compounds", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$80B+ (T2D market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Mounjaro (tirzepatide)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual", keyDifferentiator: "Best efficacy", efficacy: "2.4% HbA1c reduction", threat: 'high' },
        { name: "Ozempic (semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Market leader", efficacy: "1.5-2% HbA1c", threat: 'high' },
      ],
      competitiveAdvantages: ["First-in-class mechanism", "Oral convenience", "Beta-cell preservation potential"],
      competitiveRisks: ["GLP-1 dominance", "Limited efficacy vs GLP-1s", "Geographic constraints"],
      marketPositioning: "Novel mechanism therapy for patients seeking non-GLP-1 alternatives."
    },
    retrospectivePhases: [
      { phase: "Phase 3 DAWN", date: "Q1 2022", outcome: 'success', keyData: ["1.07% HbA1c reduction", "Beta-cell function improvement"], scoreAtTime: 65, rationale: "First GKA approval achieved in China", dataAvailableAtTime: ["Pivotal China data"] },
      { phase: "NMPA Approval", date: "Sep 2022", outcome: 'success', keyData: ["First GKA approved globally", "China commercial launch"], scoreAtTime: 72, rationale: "Regulatory success", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 2. Cotadutide for T2D
  {
    id: "COTA-T2D",
    name: "Cotadutide (MEDI0382)",
    trialName: "PRODIGY-T2D",
    phase: "Phase II/III",
    indication: "Type 2 Diabetes with Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04515849",
    clinicalTrialsSearchTerm: "cotadutide",
    scores: calculateProbabilityScores("Phase II", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Cotadutide", "Phase II", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GLP-1/Glucagon dual receptor agonist",
      administration: "Once-daily subcutaneous injection",
      keyAdvantage: "Dual mechanism for glucose and weight control",
      discovery: "MedImmune (AstraZeneca subsidiary)",
      development: "Global rights held by AstraZeneca",
      additionalInfo: [
        "Targets both glucose regulation and hepatic metabolism",
        "Glucagon component may enhance fatty acid oxidation",
        "Potential for cardiometabolic benefits"
      ]
    },
    patents: [
      { patentNumber: "US10,377,812", title: "Dual GLP-1/glucagon agonist peptides", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$80B+ (T2D market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1", keyDifferentiator: "Approved leader", efficacy: "2.4% HbA1c", threat: 'high' },
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Same mechanism", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["AstraZeneca resources", "T2D + MASH potential", "Dual metabolic benefits"],
      competitiveRisks: ["Behind tirzepatide", "Glucagon hepatic effects unknown long-term", "Competitive landscape"],
      marketPositioning: "Dual agonist targeting metabolic syndrome spectrum."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2023", outcome: 'success', keyData: ["1.7% HbA1c reduction", "7-8% weight loss"], scoreAtTime: 55, rationale: "Solid efficacy in T2D", dataAvailableAtTime: ["Phase 2 T2D data"] }
    ]
  },

  // 3. Icodec (once-weekly insulin)
  {
    id: "ICOD-01",
    name: "Insulin Icodec",
    trialName: "ONWARDS",
    phase: "Approved",
    indication: "Type 2 Diabetes (Insulin therapy)",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT03751657",
    clinicalTrialsSearchTerm: "insulin icodec",
    scores: calculateProbabilityScores("Approved", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Insulin Icodec", "Approved", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Once-weekly basal insulin analog",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "7x fewer injections vs daily basal insulin",
      discovery: "Novo Nordisk internal development",
      development: "Global rights held by Novo Nordisk",
      additionalInfo: [
        "First and only once-weekly basal insulin",
        "Non-inferior HbA1c control vs daily insulin",
        "Reduces injection burden significantly"
      ]
    },
    patents: [
      { patentNumber: "US10,961,298", title: "Long-acting insulin derivatives", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (insulin market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Lantus/Toujeo", company: "Sanofi", phase: "Approved", mechanism: "Daily basal insulin", keyDifferentiator: "Market leader", efficacy: "Standard", threat: 'medium' },
        { name: "Tresiba", company: "Novo Nordisk", phase: "Approved", mechanism: "Daily basal insulin", keyDifferentiator: "Ultra-long action", efficacy: "Standard", threat: 'low' },
        { name: "Efsitora (BIF)", company: "Eli Lilly", phase: "Phase III", mechanism: "Once-weekly insulin", keyDifferentiator: "Competitor", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["First-to-market weekly insulin", "Convenience advantage", "Novo insulin expertise"],
      competitiveRisks: ["GLP-1s reducing insulin need", "Efsitora competition", "Pricing pressure"],
      marketPositioning: "Revolutionary convenience for patients requiring basal insulin."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ONWARDS", date: "Q4 2023", outcome: 'success', keyData: ["Non-inferior to daily insulin", "Comparable hypoglycemia rates"], scoreAtTime: 82, rationale: "Full pivotal program successful", dataAvailableAtTime: ["ONWARDS 1-6 results"] },
      { phase: "FDA Approval", date: "May 2024", outcome: 'success', keyData: ["Approved as Awiqli", "First weekly insulin"], scoreAtTime: 95, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 4. Efsitora alfa (BIF - Lilly weekly insulin)
  {
    id: "EFSI-01",
    name: "Efsitora alfa (BIF)",
    trialName: "QWINT",
    phase: "Phase III",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT04848480",
    clinicalTrialsSearchTerm: "efsitora",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Efsitora", "Phase III", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Once-weekly basal insulin Fc fusion protein",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Fc fusion technology for extended half-life",
      discovery: "Eli Lilly internal development",
      development: "Global rights held by Eli Lilly",
      additionalInfo: [
        "Insulin fused to human IgG Fc for prolonged action",
        "Competing with Novo Nordisk's icodec",
        "Phase 3 results show non-inferiority to daily insulin"
      ]
    },
    patents: [
      { patentNumber: "US11,129,882", title: "Insulin Fc fusion proteins", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (insulin market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Insulin Icodec (Awiqli)", company: "Novo Nordisk", phase: "Approved", mechanism: "Weekly insulin", keyDifferentiator: "First-to-market", efficacy: "Non-inferior", threat: 'high' },
        { name: "Lantus/Toujeo", company: "Sanofi", phase: "Approved", mechanism: "Daily insulin", keyDifferentiator: "Established", efficacy: "Standard", threat: 'medium' },
      ],
      competitiveAdvantages: ["Lilly commercial strength", "Fc fusion differentiation", "GLP-1 combo potential"],
      competitiveRisks: ["Second-to-market vs icodec", "Weekly insulin differentiation limited", "GLP-1 reducing insulin need"],
      marketPositioning: "Lilly's weekly insulin for comprehensive diabetes portfolio."
    },
    retrospectivePhases: [
      { phase: "Phase 3 QWINT", date: "Q3 2024", outcome: 'success', keyData: ["Non-inferior HbA1c reduction", "Lower hypoglycemia signals"], scoreAtTime: 70, rationale: "Positive pivotal data", dataAvailableAtTime: ["QWINT-2 results"] },
      { phase: "FDA Filing", date: "Q4 2024", outcome: 'pending', keyData: ["BLA submission expected", "Approval anticipated 2025"], scoreAtTime: 72, rationale: "Regulatory pathway clear", dataAvailableAtTime: ["Filing preparation"] }
    ]
  },

  // 5. Imeglimin
  {
    id: "IMEG-01",
    name: "Imeglimin (Twymeeg)",
    trialName: "TIMES",
    phase: "Approved (Japan)",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Poxel/Sumitomo Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT02965131",
    clinicalTrialsSearchTerm: "imeglimin",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Imeglimin", "Phase III", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "First-in-class mitochondrial bioenergetics modulator",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Novel mechanism targeting mitochondrial function",
      discovery: "Poxel SA",
      license: "Sumitomo Pharma (Japan, China, other Asian markets)",
      development: "Poxel seeking US/EU partners",
      additionalInfo: [
        "Approved in Japan as Twymeeg (2021)",
        "Dual action on pancreas and muscle/liver",
        "0.94% HbA1c reduction in pivotal trials"
      ]
    },
    patents: [
      { patentNumber: "US9,572,823", title: "Tetrahydrotriazine compounds for diabetes", expirationDate: "2031", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$80B+ (T2D market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Metformin", company: "Generic", phase: "Approved", mechanism: "First-line", keyDifferentiator: "Standard of care", efficacy: "1-1.5% HbA1c", threat: 'high' },
        { name: "GLP-1 agonists", company: "Various", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Superior efficacy", efficacy: "1.5-2%+ HbA1c", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel mechanism", "Mitochondrial target", "Oral convenience"],
      competitiveRisks: ["Limited efficacy vs GLP-1s", "Geographic constraints", "Partner uncertainty"],
      marketPositioning: "Novel oral option for metformin add-on therapy."
    },
    retrospectivePhases: [
      { phase: "Phase 3 TIMES", date: "Q1 2021", outcome: 'success', keyData: ["0.94% HbA1c reduction", "Well-tolerated"], scoreAtTime: 62, rationale: "Approval achieved in Japan", dataAvailableAtTime: ["TIMES 1-3 results"] },
      { phase: "Japan Approval", date: "Jun 2021", outcome: 'success', keyData: ["First-in-class approval", "Twymeeg brand"], scoreAtTime: 70, rationale: "Commercial launch in Japan", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 6. Henagliflozin
  {
    id: "HENA-01",
    name: "Henagliflozin (SHR-3824)",
    trialName: "HERA",
    phase: "Approved (China)",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Hengrui Medicine",
    companyTrackRecord: 'average',
    nctId: "NCT03749070",
    clinicalTrialsSearchTerm: "henagliflozin",
    scores: calculateProbabilityScores("Approved", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Henagliflozin", "Approved", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "SGLT2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Highly selective SGLT2 inhibitor with cardiac benefits",
      discovery: "Hengrui internal development",
      development: "China and Asia-Pacific rights",
      additionalInfo: [
        "Approved in China (2022)",
        "High SGLT2/SGLT1 selectivity",
        "Cardiovascular outcomes study underway"
      ]
    },
    patents: [
      { patentNumber: "CN104761485", title: "SGLT2 inhibitor compounds", expirationDate: "2034", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (SGLT2 market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Jardiance", company: "Lilly/BI", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CV outcomes leader", efficacy: "0.7-0.8% HbA1c", threat: 'high' },
        { name: "Farxiga", company: "AstraZeneca", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CKD indication", efficacy: "0.7-0.8% HbA1c", threat: 'high' },
      ],
      competitiveAdvantages: ["China market focus", "Selectivity profile", "Local manufacturing"],
      competitiveRisks: ["Crowded SGLT2 class", "Limited differentiation", "Regional focus"],
      marketPositioning: "Leading domestic SGLT2 inhibitor in China."
    },
    retrospectivePhases: [
      { phase: "Phase 3 HERA", date: "Q2 2022", outcome: 'success', keyData: ["0.76% HbA1c reduction", "Favorable safety profile"], scoreAtTime: 68, rationale: "Approval achieved", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "NMPA Approval", date: "Aug 2022", outcome: 'success', keyData: ["Approved for T2D", "China commercial launch"], scoreAtTime: 75, rationale: "Market access achieved", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 7. Licogliflozin
  {
    id: "LICO-01",
    name: "Licogliflozin",
    trialName: "FIDELIO-DKD",
    phase: "Phase III",
    indication: "Diabetic Kidney Disease",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT03889795",
    clinicalTrialsSearchTerm: "licogliflozin",
    scores: calculateProbabilityScores("Phase III", "Diabetic Kidney Disease", "Metabolic"),
    marketData: generateMarketProjections("Licogliflozin", "Phase III", "Diabetic Kidney Disease", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual SGLT1/SGLT2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Dual inhibition may provide enhanced cardiorenal benefits",
      discovery: "Novartis internal development",
      development: "Global rights held by Novartis",
      additionalInfo: [
        "Balanced SGLT1/SGLT2 inhibition",
        "Additional GI-mediated glucose lowering via SGLT1",
        "Potential heart failure benefits from SGLT1 inhibition"
      ]
    },
    patents: [
      { patentNumber: "US10,118,929", title: "Dual SGLT inhibitor compounds", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (Cardiorenal protection)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Kerendia (finerenone)", company: "Bayer", phase: "Approved", mechanism: "MRA", keyDifferentiator: "First nonsteroidal MRA", efficacy: "CKD protection", threat: 'medium' },
        { name: "Farxiga", company: "AstraZeneca", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CKD approved", efficacy: "39% CKD risk reduction", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual mechanism", "Heart failure potential", "Novartis scale"],
      competitiveRisks: ["GI side effects from SGLT1", "SGLT2 established", "Late to CKD market"],
      marketPositioning: "Next-generation SGLT inhibitor for comprehensive cardiorenal protection."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2022", outcome: 'success', keyData: ["UACR reduction demonstrated", "Tolerable GI profile"], scoreAtTime: 52, rationale: "Proof-of-concept in DKD", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["DKD outcomes trial ongoing", "Results expected 2026"], scoreAtTime: 55, rationale: "Large outcomes trial", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 8. GLP-1/GIP/Glucagon triple (Lilly backup)
  {
    id: "LY34-02",
    name: "LY3541105",
    trialName: "TRIPLE-T2D",
    phase: "Phase II",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05263479",
    clinicalTrialsSearchTerm: "LY3541105",
    scores: calculateProbabilityScores("Phase II", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("LY3541105", "Phase II", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Triple GIP/GLP-1/Glucagon receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Backup triple agonist to retatrutide",
      discovery: "Eli Lilly internal development",
      development: "Global rights held by Eli Lilly",
      additionalInfo: [
        "Second-generation triple agonist",
        "Potentially improved safety/efficacy profile",
        "Insurance against retatrutide development issues"
      ]
    },
    patents: [
      { patentNumber: "WO2022/147489", title: "Triple incretin receptor agonist compounds", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (Obesity/T2D)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "Triple agonist", keyDifferentiator: "Lead program", efficacy: "24% weight loss", threat: 'low' },
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "Dual agonist", keyDifferentiator: "Approved", efficacy: "22.5% weight loss", threat: 'low' },
      ],
      competitiveAdvantages: ["Lilly expertise", "Backup strategy", "Next-generation potential"],
      competitiveRisks: ["Retatrutide primary focus", "Crowded pipeline", "Development prioritization"],
      marketPositioning: "Strategic backup triple agonist for Lilly's metabolic franchise."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2023", outcome: 'success', keyData: ["Early safety/PK established", "Triple mechanism confirmed"], scoreAtTime: 35, rationale: "Early stage backup asset", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2", date: "Q4 2024", outcome: 'pending', keyData: ["T2D efficacy study ongoing", "Weight loss data expected"], scoreAtTime: 42, rationale: "Advancing as backup", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 9. Petrelintide (long-acting amylin)
  {
    id: "PETR-01",
    name: "Petrelintide (ZP8396)",
    trialName: "PIONEER-AM",
    phase: "Phase II",
    indication: "Type 2 Diabetes / Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Zealand Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT05295875",
    clinicalTrialsSearchTerm: "petrelintide",
    scores: calculateProbabilityScores("Phase II", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Petrelintide", "Phase II", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting amylin analog",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Week-long amylin action for satiety and glucose control",
      discovery: "Zealand Pharma internal development",
      development: "Global rights held by Zealand Pharma",
      additionalInfo: [
        "Designed to complement GLP-1 therapy",
        "Amylin slows gastric emptying and promotes satiety",
        "Potential combination partner for GLP-1 agonists"
      ]
    },
    patents: [
      { patentNumber: "WO2021/198495", title: "Long-acting amylin peptides", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$80B+ (T2D + Obesity)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "CagriSema (cagrilintide)", company: "Novo Nordisk", phase: "Phase III", mechanism: "Amylin + GLP-1 combo", keyDifferentiator: "Combination leader", efficacy: "~25% weight loss", threat: 'high' },
        { name: "Pramlintide (Symlin)", company: "AstraZeneca", phase: "Approved", mechanism: "Amylin analog", keyDifferentiator: "First amylin", efficacy: "Modest", threat: 'low' },
      ],
      competitiveAdvantages: ["Weekly dosing", "Combination potential", "Zealand peptide expertise"],
      competitiveRisks: ["Novo's cagrilintide ahead", "Amylin as add-on therapy only", "Limited standalone value"],
      marketPositioning: "Next-generation amylin for combination metabolic therapy."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q4 2022", outcome: 'success', keyData: ["Weekly PK profile achieved", "Weight loss signals"], scoreAtTime: 38, rationale: "Early proof-of-concept", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2", date: "Q4 2024", outcome: 'pending', keyData: ["Combination study ongoing", "T2D + obesity endpoints"], scoreAtTime: 45, rationale: "Advancing to efficacy trials", dataAvailableAtTime: ["Early data"] }
    ]
  },

  // 10. Ecnoglutide (XW003)
  {
    id: "ECNO-01",
    name: "Ecnoglutide (XW003)",
    trialName: "DAWN-ENDO",
    phase: "Phase III",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Sciwind Biosciences",
    companyTrackRecord: 'average',
    nctId: "NCT05611060",
    clinicalTrialsSearchTerm: "ecnoglutide",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Ecnoglutide", "Phase III", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting GLP-1 receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Novel GLP-1 with potential differentiated profile",
      discovery: "Sciwind Biosciences",
      development: "China and global development ongoing",
      additionalInfo: [
        "PEGylated GLP-1 for extended half-life",
        "Once-weekly dosing with improved tolerability claims",
        "Phase 3 in China for T2D"
      ]
    },
    patents: [
      { patentNumber: "CN112457383", title: "Long-acting GLP-1 analogs", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$60B+ (GLP-1 market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Ozempic/Wegovy", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Market leader", efficacy: "1.5-2% HbA1c", threat: 'high' },
        { name: "Mounjaro", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1", keyDifferentiator: "Superior efficacy", efficacy: "2.4% HbA1c", threat: 'high' },
      ],
      competitiveAdvantages: ["China market access", "Novel PEGylation technology", "Biosimilar barrier"],
      competitiveRisks: ["Crowded GLP-1 space", "Limited differentiation", "Regional focus"],
      marketPositioning: "Domestic GLP-1 for Chinese diabetes market."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2023", outcome: 'success', keyData: ["1.8% HbA1c reduction", "Competitive efficacy"], scoreAtTime: 55, rationale: "Strong China T2D data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["DAWN-ENDO trials ongoing", "China NDA target 2026"], scoreAtTime: 58, rationale: "Pivotal program advancing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 11. VK2809 (liver-targeted thyroid receptor agonist)
  {
    id: "VK28-01",
    name: "VK2809 (MB07811)",
    trialName: "VOYAGE",
    phase: "Phase II",
    indication: "MASH with Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Viking Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT04173065",
    clinicalTrialsSearchTerm: "VK2809",
    scores: calculateProbabilityScores("Phase II", "MASH", "Metabolic"),
    marketData: generateMarketProjections("VK2809", "Phase II", "MASH", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Liver-targeted thyroid hormone receptor beta (THR-β) agonist",
      administration: "Once-daily oral capsule",
      keyAdvantage: "Liver selectivity minimizes systemic thyroid effects",
      discovery: "Metabasis Therapeutics (acquired by Viking)",
      development: "Global rights held by Viking Therapeutics",
      additionalInfo: [
        "Pro-drug activated specifically in liver",
        "Reduces liver fat and improves lipid profile",
        "Synergistic potential with GLP-1 agonists"
      ]
    },
    patents: [
      { patentNumber: "US10,071,094", title: "Liver-targeted thyroid receptor agonists", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$25B+ (MASH market)",
      projectedGrowth: "50% CAGR",
      keyPlayers: [
        { name: "Resmetirom (Rezdiffra)", company: "Madrigal", phase: "Approved", mechanism: "THR-β agonist", keyDifferentiator: "First MASH approval", efficacy: "25-30% resolution", threat: 'high' },
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Multi-mechanism", efficacy: "~83% resolution", threat: 'high' },
      ],
      competitiveAdvantages: ["Pro-drug liver targeting", "Oral convenience", "Combination potential"],
      competitiveRisks: ["Resmetirom first-to-market", "Behind in development", "Limited efficacy data"],
      marketPositioning: "Next-generation THR-β agonist for MASH with T2D overlap."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2023", outcome: 'success', keyData: ["60-70% liver fat reduction", "Improved lipids"], scoreAtTime: 52, rationale: "Strong Phase 2 biomarker data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 2b VOYAGE", date: "Q4 2024", outcome: 'pending', keyData: ["Histological endpoints study", "MASH resolution target"], scoreAtTime: 48, rationale: "Advancing to histology", dataAvailableAtTime: ["Study design"] }
    ]
  },

  // 12. Dasiglucagon (hypoglycemia rescue)
  {
    id: "DASI-01",
    name: "Dasiglucagon (Zegalogue)",
    trialName: "RESQ",
    phase: "Approved",
    indication: "Severe Hypoglycemia",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Zealand Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT03091180",
    clinicalTrialsSearchTerm: "dasiglucagon",
    scores: calculateProbabilityScores("Approved", "Hypoglycemia", "Metabolic"),
    marketData: generateMarketProjections("Dasiglucagon", "Approved", "Hypoglycemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Glucagon analog",
      administration: "Subcutaneous injection (autoinjector)",
      keyAdvantage: "Stable, ready-to-use formulation for hypoglycemia rescue",
      discovery: "Zealand Pharma internal development",
      license: "Beta Bionics (artificial pancreas application)",
      development: "Global commercial rights held by Zealand",
      additionalInfo: [
        "FDA approved 2021 for severe hypoglycemia",
        "More stable than native glucagon",
        "Key component of dual-hormone artificial pancreas systems"
      ]
    },
    patents: [
      { patentNumber: "US10,526,385", title: "Stable glucagon analogs", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (Hypoglycemia rescue)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Baqsimi", company: "Eli Lilly", phase: "Approved", mechanism: "Nasal glucagon", keyDifferentiator: "Needle-free", efficacy: "Comparable", threat: 'high' },
        { name: "GvOKE", company: "Xeris", phase: "Approved", mechanism: "Glucagon injection", keyDifferentiator: "Ready-to-use", efficacy: "Comparable", threat: 'medium' },
      ],
      competitiveAdvantages: ["Stable formulation", "Artificial pancreas potential", "Autoinjector convenience"],
      competitiveRisks: ["Baqsimi nasal preference", "Small market segment", "Insulin advancements reducing hypoglycemia"],
      marketPositioning: "Premium rescue therapy and artificial pancreas component."
    },
    retrospectivePhases: [
      { phase: "Phase 3 RESQ", date: "Q2 2020", outcome: 'success', keyData: ["Effective glucose recovery", "10 min median time to recovery"], scoreAtTime: 72, rationale: "Pivotal success", dataAvailableAtTime: ["RESQ results"] },
      { phase: "FDA Approval", date: "Mar 2021", outcome: 'success', keyData: ["Zegalogue approved", "Commercial launch"], scoreAtTime: 85, rationale: "Market access achieved", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 13. Teplizumab (T1D prevention)
  {
    id: "TEPL-01",
    name: "Teplizumab (Tzield)",
    trialName: "PROTECT",
    phase: "Approved",
    indication: "Type 1 Diabetes Prevention",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Provention Bio/Sanofi",
    companyTrackRecord: 'average',
    nctId: "NCT03875729",
    clinicalTrialsSearchTerm: "teplizumab",
    scores: calculateProbabilityScores("Approved", "Type 1 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Teplizumab", "Approved", "Type 1 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-CD3 monoclonal antibody",
      administration: "IV infusion (14-day course)",
      keyAdvantage: "First disease-modifying therapy to delay T1D onset",
      discovery: "MacroGenics/Eli Lilly (original)",
      license: "Sanofi acquired Provention Bio (2023)",
      development: "Sanofi expanding indications",
      additionalInfo: [
        "FDA approved Nov 2022 as first T1D delay therapy",
        "Delayed clinical T1D onset by median 2+ years",
        "Targets at-risk Stage 2 T1D individuals"
      ]
    },
    patents: [
      { patentNumber: "US8,491,899", title: "Anti-CD3 antibody compositions", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (T1D prevention/early intervention)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "First-in-class", efficacy: "N/A", threat: 'low' },
        { name: "Rituximab", company: "Roche", phase: "Off-label", mechanism: "Anti-CD20", keyDifferentiator: "Some use in T1D", efficacy: "Limited data", threat: 'low' },
      ],
      competitiveAdvantages: ["First and only T1D delay therapy", "Clear clinical benefit", "Sanofi commercialization"],
      competitiveRisks: ["Narrow indication", "Limited screening infrastructure", "Reimbursement challenges"],
      marketPositioning: "Breakthrough disease-modifying therapy for T1D prevention."
    },
    retrospectivePhases: [
      { phase: "Phase 3 TN-10", date: "Q2 2019", outcome: 'success', keyData: ["Median 2-year delay in T1D onset", "First T1D prevention therapy"], scoreAtTime: 75, rationale: "Landmark prevention data", dataAvailableAtTime: ["TN-10 results"] },
      { phase: "FDA Approval", date: "Nov 2022", outcome: 'success', keyData: ["Tzield approved", "First T1D disease-modifier"], scoreAtTime: 90, rationale: "Historic approval", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 14. Donislecel (beta cell replacement)
  {
    id: "DONI-01",
    name: "Donislecel (Lantidra)",
    trialName: "ISLET",
    phase: "Approved",
    indication: "Type 1 Diabetes (Brittle)",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "CellTrans",
    companyTrackRecord: 'slow',
    nctId: "NCT03791567",
    clinicalTrialsSearchTerm: "donislecel",
    scores: calculateProbabilityScores("Approved", "Type 1 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Donislecel", "Approved", "Type 1 Diabetes", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Allogeneic pancreatic islet cell therapy",
      administration: "Hepatic portal vein infusion",
      keyAdvantage: "Functional cure for select T1D patients with severe hypoglycemia unawareness",
      discovery: "University of Alberta (Edmonton Protocol)",
      development: "CellTrans commercialization",
      additionalInfo: [
        "FDA approved June 2023",
        "First cellular therapy for T1D",
        "21% insulin independent at 5 years"
      ]
    },
    patents: [
      { patentNumber: "US10,478,473", title: "Islet cell isolation and transplantation", expirationDate: "2037", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (T1D cell therapy)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "VX-880", company: "Vertex", phase: "Phase II", mechanism: "Stem cell-derived islets", keyDifferentiator: "Unlimited cell source", efficacy: "Insulin independence signals", threat: 'high' },
        { name: "VX-264", company: "Vertex", phase: "Phase I/II", mechanism: "Encapsulated stem cells", keyDifferentiator: "No immunosuppression", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["First approved", "Proven efficacy in select patients", "Established protocol"],
      competitiveRisks: ["Requires immunosuppression", "Limited donor supply", "Vertex pipeline advancing"],
      marketPositioning: "First approved cell therapy bridge to stem cell-derived alternatives."
    },
    retrospectivePhases: [
      { phase: "Phase 3", date: "Q1 2023", outcome: 'success', keyData: ["21% insulin independent at 5 years", "71% eliminated severe hypoglycemia"], scoreAtTime: 70, rationale: "Meaningful benefit in severe T1D", dataAvailableAtTime: ["Long-term data"] },
      { phase: "FDA Approval", date: "Jun 2023", outcome: 'success', keyData: ["Lantidra approved", "First T1D cell therapy"], scoreAtTime: 80, rationale: "Historic approval", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 15. VX-880 (stem cell islets)
  {
    id: "VX88-01",
    name: "VX-880",
    trialName: "STEM-T1D",
    phase: "Phase II",
    indication: "Type 1 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Vertex Pharmaceuticals",
    companyTrackRecord: 'fast',
    nctId: "NCT04786262",
    clinicalTrialsSearchTerm: "VX-880",
    scores: calculateProbabilityScores("Phase II", "Type 1 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("VX-880", "Phase II", "Type 1 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Stem cell-derived fully differentiated islet cells",
      administration: "Hepatic portal vein infusion",
      keyAdvantage: "Unlimited cell source eliminates donor scarcity",
      discovery: "Semma Therapeutics (acquired by Vertex 2019)",
      development: "Global rights held by Vertex",
      additionalInfo: [
        "Fully differentiated from pluripotent stem cells",
        "Multiple patients achieved insulin independence",
        "Requires immunosuppression (VX-264 addresses this)"
      ]
    },
    patents: [
      { patentNumber: "US10,927,350", title: "Methods of generating pancreatic beta cells", expirationDate: "2039", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (T1D cure market)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Lantidra", company: "CellTrans", phase: "Approved", mechanism: "Donor islets", keyDifferentiator: "First approved", efficacy: "21% insulin-free", threat: 'low' },
        { name: "VX-264", company: "Vertex", phase: "Phase I/II", mechanism: "Encapsulated cells", keyDifferentiator: "No immunosuppression", efficacy: "TBD", threat: 'low' },
      ],
      competitiveAdvantages: ["Scalable cell source", "Vertex execution", "Multiple patients insulin independent"],
      competitiveRisks: ["Immunosuppression required", "Manufacturing scale", "VX-264 may supersede"],
      marketPositioning: "Transformative stem cell cure for T1D, bridging to immunosuppression-free VX-264."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2024", outcome: 'success', keyData: ["Multiple patients insulin independent", "Robust C-peptide production"], scoreAtTime: 65, rationale: "Breakthrough efficacy signals", dataAvailableAtTime: ["Preliminary results"] },
      { phase: "Phase 2 Expansion", date: "Q4 2024", outcome: 'pending', keyData: ["Enrolling additional patients", "Optimizing dosing"], scoreAtTime: 68, rationale: "Advancing toward pivotal", dataAvailableAtTime: ["Updated data"] }
    ]
  },

  // 16. HM15211 (triple agonist - Hanmi)
  {
    id: "HM15-01",
    name: "HM15211",
    trialName: "EXCELLENT",
    phase: "Phase II",
    indication: "Type 2 Diabetes / Obesity / MASH",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Hanmi Pharmaceutical",
    companyTrackRecord: 'average',
    nctId: "NCT04505436",
    clinicalTrialsSearchTerm: "HM15211",
    scores: calculateProbabilityScores("Phase II", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("HM15211", "Phase II", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting triple GLP-1/GIP/Glucagon receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Korean triple agonist with established efficacy",
      discovery: "Hanmi Pharmaceutical LAPSCOVERY platform",
      development: "Global rights held by Hanmi",
      additionalInfo: [
        "Uses Hanmi's Fc-fusion technology",
        "Targeting metabolic syndrome spectrum",
        "MASH indication in focus"
      ]
    },
    patents: [
      { patentNumber: "KR10-2019-0123456", title: "Triple receptor agonist peptides", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (Metabolic)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "Triple agonist", keyDifferentiator: "Lead program", efficacy: "24% weight loss", threat: 'high' },
        { name: "Efinopegdutide", company: "Merck/Hanmi", phase: "Phase II", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Partner program", efficacy: "~10% weight loss", threat: 'medium' },
      ],
      competitiveAdvantages: ["Hanmi platform expertise", "MASH focus", "Partnership potential"],
      competitiveRisks: ["Behind Lilly triple", "Seeking partner", "Limited global reach"],
      marketPositioning: "Korean triple agonist targeting MASH with metabolic benefits."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2022", outcome: 'success', keyData: ["Triple mechanism confirmed", "Weight loss observed"], scoreAtTime: 40, rationale: "Early proof-of-concept", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2 MASH", date: "Q4 2024", outcome: 'pending', keyData: ["MASH-focused study ongoing", "Liver histology endpoints"], scoreAtTime: 45, rationale: "MASH pivotal potential", dataAvailableAtTime: ["Study design"] }
    ]
  },

  // 17. Bexagliflozin
  {
    id: "BEXA-01",
    name: "Bexagliflozin (Brenzavvy)",
    trialName: "BEST",
    phase: "Approved",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Theracos Bio",
    companyTrackRecord: 'slow',
    nctId: "NCT02715258",
    clinicalTrialsSearchTerm: "bexagliflozin",
    scores: calculateProbabilityScores("Approved", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Bexagliflozin", "Approved", "Type 2 Diabetes", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "SGLT2 inhibitor",
      administration: "Once-daily oral tablet (20mg)",
      keyAdvantage: "Fourth SGLT2 inhibitor with differentiated PK profile",
      discovery: "Theracos (acquired from Pfizer)",
      development: "US rights held by Theracos Bio",
      additionalInfo: [
        "FDA approved January 2023",
        "Higher SGLT2 selectivity claimed",
        "Competitive pricing strategy"
      ]
    },
    patents: [
      { patentNumber: "US8,685,931", title: "SGLT2 inhibitor compounds", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (SGLT2 market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Jardiance", company: "Lilly/BI", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CV outcomes leader", efficacy: "0.8% HbA1c", threat: 'high' },
        { name: "Farxiga", company: "AstraZeneca", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CKD/HF indications", efficacy: "0.8% HbA1c", threat: 'high' },
        { name: "Invokana", company: "J&J", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "First SGLT2", efficacy: "0.8% HbA1c", threat: 'medium' },
      ],
      competitiveAdvantages: ["Competitive pricing", "Differentiated PK", "US market focus"],
      competitiveRisks: ["Crowded class", "No CV outcomes data", "Limited resources"],
      marketPositioning: "Value alternative in established SGLT2 class."
    },
    retrospectivePhases: [
      { phase: "Phase 3 BEST", date: "Q3 2022", outcome: 'success', keyData: ["0.74% HbA1c reduction", "Competitive weight loss"], scoreAtTime: 65, rationale: "Approval-enabling data", dataAvailableAtTime: ["BEST trial results"] },
      { phase: "FDA Approval", date: "Jan 2023", outcome: 'success', keyData: ["Brenzavvy approved", "US commercial launch"], scoreAtTime: 72, rationale: "Market access achieved", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 18. Sotagliflozin
  {
    id: "SOTA-01",
    name: "Sotagliflozin (Inpefa)",
    trialName: "SOLOIST/SCORED",
    phase: "Approved",
    indication: "Heart Failure / Type 2 Diabetes with CKD",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Lexicon Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT03521934",
    clinicalTrialsSearchTerm: "sotagliflozin",
    scores: calculateProbabilityScores("Approved", "Heart Failure", "Metabolic"),
    marketData: generateMarketProjections("Sotagliflozin", "Approved", "Heart Failure", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual SGLT1/SGLT2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Dual inhibition with GI and renal glucose lowering",
      discovery: "Lexicon Pharmaceuticals",
      development: "US rights held by Lexicon",
      additionalInfo: [
        "FDA approved May 2023 for heart failure",
        "SGLT1 inhibition provides additional GI glucose lowering",
        "Unique in class for dual mechanism"
      ]
    },
    patents: [
      { patentNumber: "US9,061,060", title: "Dual SGLT inhibitor compounds", expirationDate: "2031", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$25B+ (Heart failure/CKD)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Jardiance", company: "Lilly/BI", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "HF leader", efficacy: "Strong CV data", threat: 'high' },
        { name: "Farxiga", company: "AstraZeneca", phase: "Approved", mechanism: "SGLT2", keyDifferentiator: "CKD leader", efficacy: "Strong renal data", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual SGLT1/2 mechanism", "GI benefits", "HF indication approved"],
      competitiveRisks: ["Smaller company resources", "GI side effects", "Crowded market"],
      marketPositioning: "Differentiated dual SGLT inhibitor for cardiometabolic patients."
    },
    retrospectivePhases: [
      { phase: "SOLOIST-WHF", date: "Q4 2020", outcome: 'success', keyData: ["33% reduction in CV death/HF hospitalization", "Benefit across HF spectrum"], scoreAtTime: 72, rationale: "Strong CV outcomes", dataAvailableAtTime: ["SOLOIST results"] },
      { phase: "FDA Approval", date: "May 2023", outcome: 'success', keyData: ["Inpefa approved for HF", "First dual SGLT approved"], scoreAtTime: 82, rationale: "Differentiated approval", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 19. Lobeglitazone
  {
    id: "LOBE-01",
    name: "Lobeglitazone (Duvie)",
    trialName: "GLOBE",
    phase: "Approved (Korea)",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Chong Kun Dang",
    companyTrackRecord: 'average',
    nctId: "NCT01785992",
    clinicalTrialsSearchTerm: "lobeglitazone",
    scores: calculateProbabilityScores("Approved", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Lobeglitazone", "Approved", "Type 2 Diabetes", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Thiazolidinedione (PPAR-γ agonist)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Novel TZD with potentially improved safety profile",
      discovery: "Chong Kun Dang Pharmaceutical",
      development: "Korea and Asian markets",
      additionalInfo: [
        "Approved in Korea since 2013",
        "Partial PPAR-γ agonism may reduce fluid retention",
        "Lower weight gain than pioglitazone claims"
      ]
    },
    patents: [
      { patentNumber: "KR10-0789575", title: "Thiazolidinedione derivatives", expirationDate: "2027", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B (TZD segment)",
      projectedGrowth: "2% CAGR",
      keyPlayers: [
        { name: "Pioglitazone (Actos)", company: "Generic", phase: "Approved", mechanism: "TZD", keyDifferentiator: "Established standard", efficacy: "1-1.5% HbA1c", threat: 'high' },
        { name: "GLP-1 agonists", company: "Various", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Preferred class", efficacy: "Superior", threat: 'high' },
      ],
      competitiveAdvantages: ["Improved TZD profile", "Korean market position", "Combination potential"],
      competitiveRisks: ["TZD class out of favor", "Limited to Korea", "GLP-1 dominance"],
      marketPositioning: "Modern TZD alternative for patients not tolerating GLP-1s."
    },
    retrospectivePhases: [
      { phase: "Phase 3 GLOBE", date: "Q2 2013", outcome: 'success', keyData: ["0.6% HbA1c reduction", "Lower edema than pioglitazone"], scoreAtTime: 60, rationale: "Differentiated TZD approval", dataAvailableAtTime: ["GLOBE results"] },
      { phase: "MFDS Approval", date: "Jul 2013", outcome: 'success', keyData: ["Duvie approved in Korea", "Ongoing combination development"], scoreAtTime: 68, rationale: "Regional success", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 20. Balcinrenone
  {
    id: "BALC-01",
    name: "Balcinrenone (AZD9977)",
    trialName: "MIRACLE",
    phase: "Phase II",
    indication: "Heart Failure with T2D",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04823208",
    clinicalTrialsSearchTerm: "balcinrenone",
    scores: calculateProbabilityScores("Phase II", "Heart Failure", "Metabolic"),
    marketData: generateMarketProjections("Balcinrenone", "Phase II", "Heart Failure", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Non-steroidal mineralocorticoid receptor modulator (MRM)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Selective MR modulation with reduced hyperkalemia risk",
      discovery: "AstraZeneca internal development",
      development: "Global rights held by AstraZeneca",
      additionalInfo: [
        "Designed to avoid hyperkalemia of steroidal MRAs",
        "Targets HFpEF and cardiometabolic indications",
        "Potential combination with SGLT2 inhibitors"
      ]
    },
    patents: [
      { patentNumber: "WO2018/167486", title: "Non-steroidal MR modulators", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Heart failure)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Kerendia (finerenone)", company: "Bayer", phase: "Approved", mechanism: "Non-steroidal MRA", keyDifferentiator: "First ns-MRA", efficacy: "CKD/HF benefits", threat: 'high' },
        { name: "Spironolactone", company: "Generic", phase: "Approved", mechanism: "Steroidal MRA", keyDifferentiator: "Established", efficacy: "Strong but hyperkalemia", threat: 'medium' },
      ],
      competitiveAdvantages: ["Novel MRM mechanism", "Hyperkalemia advantage", "AstraZeneca resources"],
      competitiveRisks: ["Finerenone established", "MRM differentiation unproven", "Long development path"],
      marketPositioning: "Next-generation MR modulator for cardiometabolic patients."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2023", outcome: 'success', keyData: ["Reduced hyperkalemia vs comparators", "NT-proBNP improvement signals"], scoreAtTime: 45, rationale: "Proof-of-concept achieved", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 2b MIRACLE", date: "Q4 2024", outcome: 'pending', keyData: ["HFpEF study ongoing", "Combination with Farxiga planned"], scoreAtTime: 48, rationale: "Advancing to larger studies", dataAvailableAtTime: ["Study design"] }
    ]
  }
];
