// 20 Endocrinology & Metabolism Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const endocrinologyMolecules: MoleculeProfile[] = [
  // 1. Tirzepatide (Mounjaro/Zepbound) - GIP/GLP-1 dual agonist
  {
    id: "TIRZ-01",
    name: "Tirzepatide (Mounjaro/Zepbound)",
    trialName: "SURPASS/SURMOUNT",
    phase: "Approved",
    indication: "Type 2 Diabetes / Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT03954536",
    clinicalTrialsSearchTerm: "tirzepatide",
    scores: calculateProbabilityScores("Approved", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Tirzepatide", "Approved", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,336,802", title: "GIP/GLP-1 dual receptor agonists", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US11,167,014", title: "Methods of treating metabolic disorders", expirationDate: "2038", type: 'method', status: 'active' },
      { patentNumber: "US11,389,512", title: "Tirzepatide formulations", expirationDate: "2039", type: 'formulation', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "NCE Exclusivity", endDate: "2027" },
      { type: "12-Year BLA Exclusivity", endDate: "2034" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$150B+ (GLP-1 class)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Semaglutide (Ozempic/Wegovy)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1 agonist", keyDifferentiator: "First-mover, massive brand", efficacy: "15-17% weight loss", threat: 'high' },
        { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "GIP/GLP-1/Glucagon triple", keyDifferentiator: "Triple agonist, ~24% weight loss", efficacy: "24% weight loss", threat: 'low' },
        { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "GLP-1 + Amylin", keyDifferentiator: "Combination approach", efficacy: "~25% weight loss", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Best-in-class approved efficacy (22.5% weight loss)",
        "Dual GIP/GLP-1 mechanism with metabolic benefits",
        "Strong safety profile established",
        "Massive commercial momentum"
      ],
      competitiveRisks: [
        "Supply constraints limiting growth",
        "Semaglutide brand dominance",
        "Price competition emerging"
      ],
      marketPositioning: "Market-leading dual agonist with best-in-class efficacy among approved obesity treatments."
    },
    retrospectivePhases: [
      { phase: "Phase 3 SURPASS", date: "Q2 2021", outcome: 'success', keyData: ["Superior HbA1c reduction vs all comparators", "2.4% HbA1c reduction"], scoreAtTime: 85, rationale: "Exceptional T2D efficacy data", dataAvailableAtTime: ["SURPASS 1-5 results"] },
      { phase: "FDA Approval T2D (Mounjaro)", date: "May 2022", outcome: 'success', keyData: ["Approved for T2D", "Blockbuster launch"], scoreAtTime: 95, rationale: "Fast approval, commercial success", dataAvailableAtTime: ["Approval + launch data"] },
      { phase: "Phase 3 SURMOUNT Obesity", date: "Jun 2022", outcome: 'success', keyData: ["22.5% weight loss", "Best-in-class for obesity"], scoreAtTime: 92, rationale: "Transformative obesity data", dataAvailableAtTime: ["SURMOUNT-1 results"] },
      { phase: "FDA Approval Obesity (Zepbound)", date: "Nov 2023", outcome: 'success', keyData: ["Approved for obesity", "Rapid market uptake"], scoreAtTime: 98, rationale: "Dual indication achieved", dataAvailableAtTime: ["Full commercial data"] }
    ]
  },

  // 2. Orforglipron - Oral GLP-1 agonist (ATTAIN - Obesity)
  {
    id: "ORFO-01",
    name: "Orforglipron (LY3502970)",
    trialName: "ATTAIN",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05869903",
    clinicalTrialsSearchTerm: "orforglipron",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Orforglipron", "Phase III", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "First oral small molecule (non-peptide) GLP-1 receptor agonist",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Can be taken any time of day without food or water restrictions",
      discovery: "Chugai Pharmaceutical Co., Ltd.",
      license: "Eli Lilly (2018)",
      development: "Worldwide rights held by Eli Lilly",
      additionalInfo: [
        "No refrigeration required unlike peptide-based GLP-1 therapies",
        "Small molecule structure allows for easier manufacturing",
        "~15% weight loss demonstrated in Phase 2 trials"
      ]
    },
    patents: [
      { patentNumber: "US11,267,831", title: "Small molecule GLP-1 receptor agonists", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral GLP-1)",
      projectedGrowth: "35% CAGR",
      keyPlayers: [
        { name: "Rybelsus (oral semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1", keyDifferentiator: "First oral GLP-1", efficacy: "~10-12% weight loss", threat: 'high' },
        { name: "Danuglipron", company: "Pfizer", phase: "Discontinued", mechanism: "Oral GLP-1", keyDifferentiator: "Was competitor", efficacy: "Discontinued", threat: 'low' },
      ],
      competitiveAdvantages: [
        "Once-daily oral with ~15% weight loss",
        "No food/water restrictions unlike Rybelsus",
        "Lilly's GLP-1 development expertise"
      ],
      competitiveRisks: [
        "Rybelsus already approved",
        "Injectable convenience improving"
      ],
      marketPositioning: "Next-generation oral GLP-1 with superior efficacy and convenient dosing for obesity."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Jun 2023", outcome: 'success', keyData: ["14.7% weight loss at 36 weeks", "Oral convenience validated"], scoreAtTime: 68, rationale: "Strong oral GLP-1 efficacy", dataAvailableAtTime: ["Phase 2 full results"] },
      { phase: "Phase 3 ATTAIN", date: "Q4 2024", outcome: 'pending', keyData: ["ATTAIN-1, ATTAIN-2 enrolling", "Obesity-focused programs"], scoreAtTime: 72, rationale: "Pivotal trials underway", dataAvailableAtTime: ["Trial designs"] }
    ]
  },

  // 2b. Orforglipron - Oral GLP-1 agonist (ACHIEVE - Diabetes)
  {
    id: "ORFO-02",
    name: "Orforglipron (LY3502970)",
    trialName: "ACHIEVE",
    phase: "Phase III",
    indication: "Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT06108310",
    clinicalTrialsSearchTerm: "orforglipron",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Orforglipron", "Phase III", "Type 2 Diabetes", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "First oral small molecule (non-peptide) GLP-1 receptor agonist",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Can be taken any time of day without food or water restrictions",
      discovery: "Chugai Pharmaceutical Co., Ltd.",
      license: "Eli Lilly (2018)",
      development: "Worldwide rights held by Eli Lilly",
      additionalInfo: [
        "No refrigeration required unlike peptide-based GLP-1 therapies",
        "2.1% HbA1c reduction demonstrated in Phase 2 trials",
        "Superior glycemic control vs oral semaglutide expected"
      ]
    },
    patents: [
      { patentNumber: "US11,267,831", title: "Small molecule GLP-1 receptor agonists", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$80B+ (T2D market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Mounjaro (tirzepatide)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual agonist", keyDifferentiator: "Best-in-class efficacy", efficacy: "2.4% HbA1c reduction", threat: 'medium' },
        { name: "Ozempic (semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1 agonist", keyDifferentiator: "Market leader", efficacy: "1.5-2% HbA1c reduction", threat: 'high' },
        { name: "Rybelsus (oral semaglutide)", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1", keyDifferentiator: "First oral GLP-1", efficacy: "1.4% HbA1c reduction", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Once-daily oral with potent HbA1c reduction",
        "No food/water restrictions unlike Rybelsus",
        "Lilly's diabetes franchise expertise",
        "Superior to Rybelsus efficacy expected"
      ],
      competitiveRisks: [
        "Rybelsus already approved oral GLP-1",
        "Mounjaro injectable is more efficacious",
        "Competitive T2D landscape"
      ],
      marketPositioning: "Next-generation oral GLP-1 for T2D with convenient dosing and strong glycemic control."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Jun 2023", outcome: 'success', keyData: ["2.1% HbA1c reduction", "Strong glycemic efficacy"], scoreAtTime: 70, rationale: "Strong oral GLP-1 T2D efficacy", dataAvailableAtTime: ["Phase 2 full results"] },
      { phase: "Phase 3 ACHIEVE", date: "Q4 2024", outcome: 'pending', keyData: ["ACHIEVE-1, ACHIEVE-2, ACHIEVE-3 enrolling", "T2D-focused programs"], scoreAtTime: 74, rationale: "Pivotal trials underway", dataAvailableAtTime: ["Trial designs"] }
    ]
  },

  // 3. Survodutide - GLP-1/Glucagon dual agonist
  {
    id: "SURV-01",
    name: "Survodutide (BI 456906)",
    trialName: "SYNCHRONIZE",
    phase: "Phase III",
    indication: "Obesity / MASH",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Boehringer Ingelheim/Zealand",
    companyTrackRecord: 'average',
    nctId: "NCT06066970",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Survodutide", "Phase III", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US11,028,124", title: "GLP-1/Glucagon dual agonist peptides", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (Obesity + MASH)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual", keyDifferentiator: "Approved leader", efficacy: "22.5% weight loss", threat: 'high' },
        { name: "Resmetirom (Rezdiffra)", company: "Madrigal", phase: "Approved", mechanism: "THR-β agonist", keyDifferentiator: "First MASH approval", efficacy: "Liver-focused", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "~19% weight loss in Phase 2",
        "Strong MASH resolution data",
        "Glucagon component for liver benefits"
      ],
      competitiveRisks: [
        "Behind tirzepatide/retatrutide",
        "MASH market nascent"
      ],
      marketPositioning: "Dual agonist targeting both obesity and MASH with metabolic benefits."
    },
    retrospectivePhases: [
      { phase: "Phase 2 Obesity", date: "Jun 2023", outcome: 'success', keyData: ["18.7% weight loss at 46 weeks", "Dose-dependent response"], scoreAtTime: 65, rationale: "Competitive weight loss", dataAvailableAtTime: ["Phase 2 obesity data"] },
      { phase: "Phase 2 MASH", date: "Q3 2023", outcome: 'success', keyData: ["83% MASH resolution", "Fibrosis improvement in subset"], scoreAtTime: 68, rationale: "Strong liver data", dataAvailableAtTime: ["Phase 2 MASH results"] },
      { phase: "Phase 3 SYNCHRONIZE", date: "Q4 2024", outcome: 'pending', keyData: ["Obesity Phase 3 initiated", "MASH Phase 3 planned"], scoreAtTime: 70, rationale: "Dual indication development", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 4. Pemvidutide - GLP-1/Glucagon dual agonist
  {
    id: "PEMV-01",
    name: "Pemvidutide (ALT-801)",
    trialName: "MOMENTUM",
    phase: "Phase II",
    indication: "Obesity / MASH",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Altimmune",
    companyTrackRecord: 'slow',
    nctId: "NCT05295875",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Pemvidutide", "Phase II", "Obesity", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,975,138", title: "GLP-1/Glucagon dual agonist compounds", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (Obesity + MASH)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon dual", keyDifferentiator: "Ahead in development", efficacy: "~19% weight loss", threat: 'high' },
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual", keyDifferentiator: "Approved standard", efficacy: "22.5% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: [
        "15.6% weight loss at 48 weeks",
        "MASH activity demonstrated",
        "Weekly dosing"
      ],
      competitiveRisks: [
        "Small biotech limitations",
        "Behind larger competitors"
      ],
      marketPositioning: "Smaller biotech dual agonist with potential for M&A."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MOMENTUM", date: "Mar 2024", outcome: 'success', keyData: ["15.6% weight loss", "MASH improvement signals"], scoreAtTime: 52, rationale: "Competitive Phase 2 data", dataAvailableAtTime: ["48-week results"] }
    ]
  },

  // 5. Mazdutide - GLP-1/Glucagon dual agonist (Chinese market)
  {
    id: "MAZD-01",
    name: "Mazdutide (IBI362)",
    trialName: "GLORY",
    phase: "Phase III",
    indication: "Obesity / Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Innovent Biologics",
    companyTrackRecord: 'average',
    nctId: "NCT05607680",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Mazdutide", "Phase III", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "CN113527442", title: "GLP-1/Glucagon dual agonist peptides", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (China obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Semaglutide (imported)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Global brand", efficacy: "15-17% weight loss", threat: 'high' },
        { name: "Domestic GLP-1s", company: "Various", phase: "Various", mechanism: "GLP-1", keyDifferentiator: "Local pricing", efficacy: "Variable", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Strong China presence",
        "11.71% weight loss at 24 weeks",
        "Local regulatory pathway"
      ],
      competitiveRisks: [
        "Limited to China market initially",
        "Global competition"
      ],
      marketPositioning: "Leading domestic dual agonist for Chinese obesity market."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2023", outcome: 'success', keyData: ["11.71% weight loss (24 weeks)", "Favorable safety"], scoreAtTime: 58, rationale: "Solid China-focused data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 GLORY", date: "Q4 2024", outcome: 'pending', keyData: ["Multiple Phase 3 studies", "China NDA planned 2025"], scoreAtTime: 62, rationale: "Pivotal program advanced", dataAvailableAtTime: ["Enrollment progress"] }
    ]
  },

  // 6. Cotadutide - GLP-1/Glucagon dual agonist for MASH
  {
    id: "COTA-01",
    name: "Cotadutide (MEDI0382)",
    trialName: "PRODIGY-NASH",
    phase: "Phase II/III",
    indication: "MASH with Fibrosis",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04019561",
    scores: calculateProbabilityScores("Phase II", "MASH", "Metabolic"),
    marketData: generateMarketProjections("Cotadutide", "Phase II", "MASH", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,377,812", title: "Oxyntomodulin analogs", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$25B+ (MASH)",
      projectedGrowth: "50% CAGR",
      keyPlayers: [
        { name: "Resmetirom (Rezdiffra)", company: "Madrigal", phase: "Approved", mechanism: "THR-β agonist", keyDifferentiator: "First MASH approval", efficacy: "25-30% resolution", threat: 'high' },
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Same mechanism", efficacy: "83% resolution", threat: 'high' },
      ],
      competitiveAdvantages: [
        "AstraZeneca development resources",
        "Dual metabolic/liver mechanism",
        "Combination strategy potential"
      ],
      competitiveRisks: [
        "Behind survodutide",
        "MASH field competitive"
      ],
      marketPositioning: "Large pharma dual agonist focused on MASH fibrosis."
    },
    retrospectivePhases: [
      { phase: "Phase 2a MASH", date: "Q1 2023", outcome: 'success', keyData: ["MASH resolution signals", "Weight loss ~7-8%"], scoreAtTime: 48, rationale: "Proof-of-concept in MASH", dataAvailableAtTime: ["Phase 2 liver data"] }
    ]
  },

  // 7. Efruxifermin - FGF21 analog for MASH
  {
    id: "EFRX-01",
    name: "Efruxifermin (EFX)",
    trialName: "HARMONY",
    phase: "Phase III",
    indication: "MASH with Fibrosis",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Akero Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT06161584",
    scores: calculateProbabilityScores("Phase III", "MASH", "Metabolic"),
    marketData: generateMarketProjections("Efruxifermin", "Phase III", "MASH", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,588,940", title: "FGF21 fusion proteins", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$25B+ (MASH)",
      projectedGrowth: "50% CAGR",
      keyPlayers: [
        { name: "Resmetirom", company: "Madrigal", phase: "Approved", mechanism: "THR-β", keyDifferentiator: "First approved", efficacy: "25-30% resolution", threat: 'high' },
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Dual agonist", efficacy: "83% MASH resolution", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Differentiated FGF21 mechanism",
        "~80% MASH resolution in Ph2",
        "Fibrosis improvement demonstrated"
      ],
      competitiveRisks: [
        "Small biotech scale",
        "Weekly injection required"
      ],
      marketPositioning: "FGF21-based therapy with exceptional MASH resolution rates."
    },
    retrospectivePhases: [
      { phase: "Phase 2b HARMONY", date: "Dec 2023", outcome: 'success', keyData: ["77% MASH resolution (no fibrosis worsening)", "41% fibrosis improvement"], scoreAtTime: 72, rationale: "Outstanding efficacy data", dataAvailableAtTime: ["Phase 2b full results"] },
      { phase: "Phase 3 SYNCHRONY", date: "Q3 2024", outcome: 'pending', keyData: ["Phase 3 initiated", "FDA Breakthrough designation"], scoreAtTime: 75, rationale: "Pivotal trials advancing", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 8. Pegozafermin - FGF21 analog
  {
    id: "PEGO-01",
    name: "Pegozafermin (BIO89-100)",
    trialName: "ENLIVEN",
    phase: "Phase III",
    indication: "MASH with Fibrosis",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "89bio",
    companyTrackRecord: 'slow',
    nctId: "NCT06161571",
    scores: calculateProbabilityScores("Phase III", "MASH", "Metabolic"),
    marketData: generateMarketProjections("Pegozafermin", "Phase III", "MASH", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US11,142,556", title: "Glyco-pegylated FGF21", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$25B+ (MASH)",
      projectedGrowth: "50% CAGR",
      keyPlayers: [
        { name: "Efruxifermin", company: "Akero", phase: "Phase III", mechanism: "FGF21", keyDifferentiator: "Same class competitor", efficacy: "77% resolution", threat: 'high' },
        { name: "Resmetirom", company: "Madrigal", phase: "Approved", mechanism: "THR-β", keyDifferentiator: "First approved", efficacy: "25-30%", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Weekly dosing convenience",
        "27% achieved ≥2-stage fibrosis improvement",
        "Strong NAS improvement"
      ],
      competitiveRisks: [
        "Behind efruxifermin in class",
        "Small company resources"
      ],
      marketPositioning: "Weekly FGF21 analog with differentiated glyco-PEG technology."
    },
    retrospectivePhases: [
      { phase: "Phase 2b ENLIVEN", date: "Sep 2023", outcome: 'success', keyData: ["27% ≥2-stage fibrosis improvement", "74% ≥2-point NAS improvement"], scoreAtTime: 62, rationale: "Solid fibrosis data", dataAvailableAtTime: ["Phase 2b ENLIVEN results"] }
    ]
  },

  // 9. Efinopegdutide - GLP-1/Glucagon dual agonist
  {
    id: "EFIN-01",
    name: "Efinopegdutide (MK-6024)",
    trialName: "REDEFINE",
    phase: "Phase II",
    indication: "MASH / Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Merck/Hanmi",
    companyTrackRecord: 'fast',
    nctId: "NCT05013879",
    scores: calculateProbabilityScores("Phase II", "MASH", "Metabolic"),
    marketData: generateMarketProjections("Efinopegdutide", "Phase II", "MASH", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,660,942", title: "Long-acting GLP-1/Glucagon dual agonists", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (Obesity + MASH)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Ahead in development", efficacy: "~19% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Merck development resources",
        "Once-monthly potential",
        "Hanmi platform technology"
      ],
      competitiveRisks: [
        "Behind in development",
        "Competitive landscape crowded"
      ],
      marketPositioning: "Long-acting dual agonist leveraging Hanmi's LAPSCOVERY platform."
    },
    retrospectivePhases: [
      { phase: "Phase 2 REDEFINE-1", date: "Q3 2024", outcome: 'success', keyData: ["10% weight loss at 12 weeks", "Weekly dosing confirmed"], scoreAtTime: 55, rationale: "Early efficacy signal", dataAvailableAtTime: ["Interim Phase 2 data"] }
    ]
  },

  // 10. LY3841136 - Amylin analog
  {
    id: "LY38-01",
    name: "LY3841136",
    trialName: "ADVANCE",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05632588",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("LY3841136", "Phase II", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US11,524,050", title: "Long-acting amylin receptor agonists", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "Sema + Cagrilintide", keyDifferentiator: "Combination approach", efficacy: "~25% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Novel amylin mechanism",
        "Potential combination with GLP-1s",
        "Lilly development expertise"
      ],
      competitiveRisks: [
        "Early stage",
        "CagriSema ahead"
      ],
      marketPositioning: "Next-generation amylin agonist for combination obesity therapy."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2024", outcome: 'pending', keyData: ["Dose-finding ongoing", "Early efficacy signals"], scoreAtTime: 42, rationale: "Early development with Lilly backing", dataAvailableAtTime: ["Phase 1 safety/PK data"] }
    ]
  },

  // 11. Cagrilintide - Long-acting amylin analog
  {
    id: "CAGR-01",
    name: "Cagrilintide (CagriSema component)",
    trialName: "REDEFINE",
    phase: "Phase III (as CagriSema)",
    indication: "Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT05394519",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Cagrilintide", "Phase III", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,881,716", title: "Long-acting amylin analogs", expirationDate: "2039", type: 'composition', status: 'active' },
      { patentNumber: "US11,266,717", title: "Combination of amylin and GLP-1 analogs", expirationDate: "2040", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1", keyDifferentiator: "Approved leader", efficacy: "22.5% weight loss", threat: 'high' },
        { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "Triple agonist", keyDifferentiator: "Highest efficacy", efficacy: "~24% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: [
        "~25% weight loss as CagriSema",
        "Novel dual mechanism (GLP-1 + Amylin)",
        "Novo's commercial excellence"
      ],
      competitiveRisks: [
        "Two separate injections",
        "Tirzepatide competition"
      ],
      marketPositioning: "Best-in-class potential with dual mechanism combination."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Jun 2022", outcome: 'success', keyData: ["15.7% weight loss (cagrilintide alone)", "Synergy with semaglutide"], scoreAtTime: 68, rationale: "Strong monotherapy efficacy", dataAvailableAtTime: ["Monotherapy Phase 2 data"] },
      { phase: "Phase 3 REDEFINE (CagriSema)", date: "Q4 2024", outcome: 'pending', keyData: ["Multiple Phase 3 trials ongoing", "Results expected 2025"], scoreAtTime: 78, rationale: "Pivotal program well-advanced", dataAvailableAtTime: ["REDEFINE enrollment progress"] }
    ]
  },

  // 12. Petrelintide - Amylin analog
  {
    id: "PETR-01",
    name: "Petrelintide (ZP8396)",
    trialName: "DAYBREAK",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Zealand Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT05553366",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Petrelintide", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "WO2021/229035", title: "Novel amylin analogs", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Cagrilintide", company: "Novo Nordisk", phase: "Phase III", mechanism: "Long-acting amylin", keyDifferentiator: "Ahead in development", efficacy: "~16% monotherapy", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Differentiated amylin profile",
        "Zealand peptide expertise",
        "Potential for combination"
      ],
      competitiveRisks: [
        "Behind cagrilintide",
        "Small company scale"
      ],
      marketPositioning: "Novel amylin analog with potential combination applications."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2022", outcome: 'success', keyData: ["Favorable PK profile", "Weight loss signals observed"], scoreAtTime: 38, rationale: "Early stage but promising", dataAvailableAtTime: ["Phase 1 PK/PD data"] },
      { phase: "Phase 2 DAYBREAK", date: "Q3 2024", outcome: 'pending', keyData: ["Dose-finding ongoing", "32-week study"], scoreAtTime: 48, rationale: "Phase 2 advancement", dataAvailableAtTime: ["Phase 2 interim data"] }
    ]
  },

  // 13. Dasiglucagon - Glucagon analog for hypoglycemia
  {
    id: "DASI-01",
    name: "Dasiglucagon (Zegalogue)",
    trialName: "Phase 3 Pediatric",
    phase: "Approved",
    indication: "Severe Hypoglycemia",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Zealand Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT03378635",
    scores: calculateProbabilityScores("Approved", "Hypoglycemia", "Metabolic"),
    marketData: generateMarketProjections("Dasiglucagon", "Approved", "Hypoglycemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,023,623", title: "Glucagon analogs", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.5B (Rescue glucagon)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Baqsimi", company: "Eli Lilly", phase: "Approved", mechanism: "Nasal glucagon", keyDifferentiator: "Nasal route", efficacy: "Standard efficacy", threat: 'high' },
        { name: "Gvoke", company: "Xeris", phase: "Approved", mechanism: "Ready-to-use glucagon", keyDifferentiator: "Pre-mixed liquid", efficacy: "Standard efficacy", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Room-temperature stable",
        "Ready-to-use autoinjector",
        "Pediatric indication"
      ],
      competitiveRisks: [
        "Competitive rescue market",
        "Small market size"
      ],
      marketPositioning: "Ready-to-use glucagon rescue with excellent stability."
    },
    retrospectivePhases: [
      { phase: "FDA Approval", date: "Mar 2021", outcome: 'success', keyData: ["Approved for severe hypoglycemia", "≥6 years indication"], scoreAtTime: 88, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch data"] },
      { phase: "Pediatric Expansion", date: "Q2 2023", outcome: 'success', keyData: ["≥6 months age indication", "Full pediatric coverage"], scoreAtTime: 92, rationale: "Lifecycle expansion", dataAvailableAtTime: ["Pediatric data"] }
    ]
  },

  // 14. Enebo (Semaglutide analogs China)
  {
    id: "ENEB-01",
    name: "Enebo (SMS0312)",
    trialName: "Local Phase 3",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Sciwind Biosciences",
    companyTrackRecord: 'slow',
    nctId: "NCT05603546",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Enebo", "Phase III", "Obesity", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "CN113527440", title: "GLP-1 receptor agonist compositions", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (China obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Mazdutide", company: "Innovent", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Dual mechanism", efficacy: "~12% weight loss", threat: 'high' },
        { name: "Imported semaglutide", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Global brand", efficacy: "15-17%", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Local China development",
        "Potential pricing advantage",
        "Domestic market access"
      ],
      competitiveRisks: [
        "Competition from imports",
        "Limited global potential"
      ],
      marketPositioning: "Domestic Chinese GLP-1 analog for obesity."
    },
    retrospectivePhases: [
      { phase: "Phase 3", date: "Q3 2024", outcome: 'pending', keyData: ["China Phase 3 ongoing", "Local regulatory pathway"], scoreAtTime: 52, rationale: "China-focused development", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 15. GSBR-1290 - Oral GLP-1
  {
    id: "GSBR-01",
    name: "GSBR-1290",
    trialName: "EMPOWER",
    phase: "Phase II",
    indication: "Obesity / Type 2 Diabetes",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Structure Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT05814276",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("GSBR-1290", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "WO2022/012616", title: "Small molecule GLP-1R agonists", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral GLP-1)",
      projectedGrowth: "35% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Ahead in development", efficacy: "~15% weight loss", threat: 'high' },
        { name: "Rybelsus", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1 peptide", keyDifferentiator: "First approved oral", efficacy: "~10-12%", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Small molecule oral GLP-1",
        "No food restrictions",
        "6.7% weight loss at 12 weeks"
      ],
      competitiveRisks: [
        "Behind orforglipron",
        "Early stage"
      ],
      marketPositioning: "Oral small molecule GLP-1 with differentiated profile."
    },
    retrospectivePhases: [
      { phase: "Phase 2 EMPOWER-1", date: "Nov 2023", outcome: 'success', keyData: ["6.7% weight loss at 12 weeks", "Once-daily dosing"], scoreAtTime: 52, rationale: "Early but competitive data", dataAvailableAtTime: ["Phase 2 obesity data"] }
    ]
  },

  // 16. Ecnoglutide - GLP-1 agonist
  {
    id: "ECNO-01",
    name: "Ecnoglutide (XW003)",
    trialName: "DREAM",
    phase: "Phase III",
    indication: "Type 2 Diabetes / Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Sciwind Biosciences",
    companyTrackRecord: 'slow',
    nctId: "NCT05013502",
    scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
    marketData: generateMarketProjections("Ecnoglutide", "Phase III", "Type 2 Diabetes", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "CN113527441", title: "Long-acting GLP-1 compositions", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100B+ (GLP-1 market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Semaglutide", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Global leader", efficacy: "15-17% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Long-acting weekly dosing",
        "China focus",
        "Local development expertise"
      ],
      competitiveRisks: [
        "Limited to China",
        "Strong global competition"
      ],
      marketPositioning: "Weekly GLP-1 for Chinese T2D/obesity market."
    },
    retrospectivePhases: [
      { phase: "Phase 3 DREAM", date: "Q2 2024", outcome: 'pending', keyData: ["Multiple Phase 3 studies", "T2D + obesity indications"], scoreAtTime: 55, rationale: "Advancing in China", dataAvailableAtTime: ["Phase 2 efficacy data"] }
    ]
  },

  // 17. Tesomet - Tesofensine/Metoprolol for Prader-Willi
  {
    id: "TESO-01",
    name: "Tesomet",
    trialName: "TEMPO",
    phase: "Phase III",
    indication: "Prader-Willi Syndrome Hyperphagia",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Saniona",
    companyTrackRecord: 'slow',
    nctId: "NCT05651542",
    scores: calculateProbabilityScores("Phase III", "Prader-Willi Syndrome", "Metabolic"),
    marketData: generateMarketProjections("Tesomet", "Phase III", "Prader-Willi Syndrome", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,736,871", title: "Triple reuptake inhibitor combinations", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "Orphan Drug Designation", endDate: "2034" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (PWS)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Setmelanotide", company: "Rhythm", phase: "Approved", mechanism: "MC4R agonist", keyDifferentiator: "Approved for genetic obesity", efficacy: "Variable by genotype", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Targets hyperphagia in PWS",
        "Orphan drug designation",
        "No approved competition in PWS"
      ],
      competitiveRisks: [
        "Small patient population",
        "Complex patient population"
      ],
      marketPositioning: "First potential therapy specifically for PWS hyperphagia."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q2 2023", outcome: 'success', keyData: ["Hyperphagia reduction", "Weight stabilization"], scoreAtTime: 55, rationale: "Positive PWS data", dataAvailableAtTime: ["Phase 2b PWS results"] },
      { phase: "Phase 3 TEMPO", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trial initiated", "FDA Fast Track"], scoreAtTime: 60, rationale: "Phase 3 underway", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 18. Bimagrumab - Anti-myostatin for metabolic disorders
  {
    id: "BIMA-01",
    name: "Bimagrumab (BYM338)",
    trialName: "BELIEVE",
    phase: "Phase II/III",
    indication: "Obesity / Sarcopenic Obesity",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Versanis Bio (formerly Scholar Rock-licensed)",
    companyTrackRecord: 'slow',
    nctId: "NCT05616013",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Bimagrumab", "Phase II", "Obesity", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,718,880", title: "Anti-ActRII antibodies", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "GLP-1 agonists", company: "Various", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Standard of care", efficacy: "Weight loss dominant", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Fat loss with muscle preservation",
        "Differentiated body composition",
        "Add-on to GLP-1s potential"
      ],
      competitiveRisks: [
        "GLP-1 dominance",
        "IV dosing"
      ],
      marketPositioning: "Unique muscle-sparing weight loss as GLP-1 combination."
    },
    retrospectivePhases: [
      { phase: "Phase 2 Obesity", date: "Q3 2021", outcome: 'success', keyData: ["20% fat mass loss", "4% lean mass gain"], scoreAtTime: 48, rationale: "Unique body composition benefit", dataAvailableAtTime: ["Phase 2 obesity data"] },
      { phase: "Phase 2b BELIEVE", date: "Q4 2024", outcome: 'pending', keyData: ["GLP-1 combination study", "Results expected 2025"], scoreAtTime: 52, rationale: "Combination approach testing", dataAvailableAtTime: ["Trial ongoing"] }
    ]
  },

  // 19. Setrusumab - Anti-sclerostin for rare bone disorders
  {
    id: "SETR-01",
    name: "Setrusumab (BPS804)",
    trialName: "ORBIT",
    phase: "Phase III",
    indication: "Osteogenesis Imperfecta",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Ultragenyx",
    companyTrackRecord: 'average',
    nctId: "NCT05125809",
    scores: calculateProbabilityScores("Phase III", "Osteogenesis Imperfecta", "Metabolic"),
    marketData: generateMarketProjections("Setrusumab", "Phase III", "Osteogenesis Imperfecta", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,447,184", title: "Anti-sclerostin antibodies", expirationDate: "2032", type: 'composition', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "Orphan Drug Designation", endDate: "2034" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (OI)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Bisphosphonates", company: "Generic", phase: "Off-label use", mechanism: "Bone resorption inhibitor", keyDifferentiator: "Only current option", efficacy: "Limited data", threat: 'low' },
      ],
      competitiveAdvantages: [
        "First potential disease-specific therapy for OI",
        "Anabolic bone formation mechanism",
        "Orphan designation"
      ],
      competitiveRisks: [
        "Small patient population",
        "Heterogeneous disease"
      ],
      marketPositioning: "First-in-class bone-forming therapy for osteogenesis imperfecta."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ASTEROID", date: "Q2 2023", outcome: 'success', keyData: ["BMD improvements at lumbar spine", "Fracture reduction signals"], scoreAtTime: 62, rationale: "Positive bone density data", dataAvailableAtTime: ["Phase 2 ASTEROID results"] },
      { phase: "Phase 3 ORBIT", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trial enrolling", "Fracture prevention endpoint"], scoreAtTime: 65, rationale: "Pivotal advancement", dataAvailableAtTime: ["Enrollment progress"] }
    ]
  },

  // 20. TransCon CNP - Natriuretic peptide for achondroplasia
  {
    id: "TCNP-01",
    name: "TransCon CNP (navepegritide)",
    trialName: "ACcomplisH",
    phase: "Phase III",
    indication: "Achondroplasia",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Ascendis Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT05246033",
    scores: calculateProbabilityScores("Phase III", "Achondroplasia", "Metabolic"),
    marketData: generateMarketProjections("TransCon CNP", "Phase III", "Achondroplasia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,548,951", title: "CNP prodrugs and sustained release", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "Orphan Drug Designation", endDate: "2035" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$1B+ (Achondroplasia)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Voxzogo (vosoritide)", company: "BioMarin", phase: "Approved", mechanism: "CNP analog", keyDifferentiator: "First approved therapy", efficacy: "1.57 cm/year gain", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Weekly vs daily Voxzogo dosing",
        "TransCon sustained release technology",
        "Potentially superior growth velocity"
      ],
      competitiveRisks: [
        "Voxzogo first-mover advantage",
        "Same mechanism class"
      ],
      marketPositioning: "Weekly long-acting CNP therapy with improved convenience vs daily Voxzogo."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ACcomplisH", date: "Oct 2023", outcome: 'success', keyData: ["2.6 cm/year growth velocity increase", "Weekly dosing validated"], scoreAtTime: 68, rationale: "Superior to Voxzogo efficacy", dataAvailableAtTime: ["Phase 2 growth data"] },
      { phase: "Phase 3 Initiation", date: "Q2 2024", outcome: 'pending', keyData: ["Pivotal trial started", "Head-to-head with placebo"], scoreAtTime: 72, rationale: "Strong Phase 3 foundation", dataAvailableAtTime: ["Trial design, Phase 2 full data"] }
    ]
  }
];
