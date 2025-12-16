// 20 Oncology/Hematology Molecules
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const oncologyMolecules: MoleculeProfile[] = [
  {
    id: "onco-1",
    name: "Pembrolizumab",
    trialName: "KEYNOTE-024/189/407",
    phase: "Approved",
    indication: "Non-Small Cell Lung Cancer (NSCLC)",
    therapeuticArea: "Oncology/Hematology",
    company: "Merck & Co.",
    companyTrackRecord: 'fast',
    nctId: "NCT02142738",
    clinicalTrialsSearchTerm: "pembrolizumab NSCLC",
    scores: calculateProbabilityScores("Approved", "NSCLC", "Oncology"),
    marketData: generateMarketProjections("Pembrolizumab", "Approved", "NSCLC", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-PD-1 monoclonal antibody",
      administration: "IV infusion every 3 or 6 weeks",
      keyAdvantage: "Broad tumor coverage, first-line approval, durable responses",
      discovery: "Organon",
      development: "Merck & Co."
    },
    patents: [
      { patentNumber: "US8168757", title: "Anti-PD-1 antibodies", expirationDate: "2028", type: 'composition', status: 'active' },
      { patentNumber: "US9402899", title: "Treatment methods using anti-PD-1", expirationDate: "2030", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$25.0B",
      projectedGrowth: "8%",
      keyPlayers: [
        { name: "Nivolumab", company: "BMS", phase: "Approved", mechanism: "Anti-PD-1", keyDifferentiator: "Different dosing", efficacy: "Similar", threat: 'high' },
        { name: "Atezolizumab", company: "Roche", phase: "Approved", mechanism: "Anti-PD-L1", keyDifferentiator: "PD-L1 target", efficacy: "Comparable", threat: 'medium' }
      ],
      competitiveAdvantages: ["Market leader", "Broad indications", "Strong data"],
      competitiveRisks: ["Patent expiration", "Biosimilar competition"],
      marketPositioning: "Standard of care across multiple tumor types"
    },
    retrospectivePhases: [
      { phase: "Phase III KEYNOTE-024", date: "Q2 2016", outcome: 'success', keyData: ["PFS 10.3 vs 6.0 months", "OS benefit confirmed"], scoreAtTime: 88, rationale: "Superior efficacy vs chemotherapy", dataAvailableAtTime: ["Primary endpoints met"] },
      { phase: "FDA Approval", date: "Q4 2016", outcome: 'success', keyData: ["First-line NSCLC approval"], scoreAtTime: 95, rationale: "Landmark approval", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-2",
    name: "Trastuzumab Deruxtecan",
    trialName: "DESTINY-Breast03/04",
    phase: "Approved",
    indication: "HER2+ Breast Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "Daiichi Sankyo/AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT03529110",
    clinicalTrialsSearchTerm: "trastuzumab deruxtecan breast",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Oncology"),
    marketData: generateMarketProjections("Trastuzumab Deruxtecan", "Approved", "Breast Cancer", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Antibody-drug conjugate (ADC)",
      administration: "IV infusion every 3 weeks",
      keyAdvantage: "High drug-antibody ratio, bystander effect, HER2-low activity",
      discovery: "Daiichi Sankyo",
      development: "Daiichi Sankyo/AstraZeneca partnership"
    },
    patents: [
      { patentNumber: "US9808529", title: "Antibody-drug conjugate", expirationDate: "2033", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8.5B",
      projectedGrowth: "25%",
      keyPlayers: [
        { name: "T-DM1", company: "Roche", phase: "Approved", mechanism: "HER2 ADC", keyDifferentiator: "Established safety", efficacy: "Lower", threat: 'low' },
        { name: "Sacituzumab govitecan", company: "Gilead", phase: "Approved", mechanism: "Trop-2 ADC", keyDifferentiator: "TNBC focus", efficacy: "Different indication", threat: 'medium' }
      ],
      competitiveAdvantages: ["Best-in-class efficacy", "HER2-low expansion"],
      competitiveRisks: ["ILD safety signal management"],
      marketPositioning: "New standard of care in HER2+ breast cancer"
    },
    retrospectivePhases: [
      { phase: "Phase III DESTINY-Breast03", date: "Q4 2021", outcome: 'success', keyData: ["PFS HR 0.28", "Superior to T-DM1"], scoreAtTime: 90, rationale: "Practice-changing data", dataAvailableAtTime: ["Primary endpoints"] },
      { phase: "FDA Approval", date: "Q2 2022", outcome: 'success', keyData: ["2L HER2+ approval", "HER2-low expansion"], scoreAtTime: 92, rationale: "New standard of care", dataAvailableAtTime: ["Label expansion"] }
    ]
  },
  {
    id: "onco-3",
    name: "Osimertinib",
    trialName: "FLAURA/ADAURA",
    phase: "Approved",
    indication: "EGFR-mutant NSCLC",
    therapeuticArea: "Oncology/Hematology",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT02296125",
    clinicalTrialsSearchTerm: "osimertinib EGFR NSCLC",
    scores: calculateProbabilityScores("Approved", "NSCLC", "Oncology"),
    marketData: generateMarketProjections("Osimertinib", "Approved", "NSCLC", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Third-generation EGFR TKI",
      administration: "Once-daily oral tablet",
      keyAdvantage: "CNS penetration, T790M coverage, adjuvant indication",
      discovery: "AstraZeneca",
      development: "AstraZeneca"
    },
    patents: [
      { patentNumber: "US9290497", title: "Pyrimidine compounds", expirationDate: "2032", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$6.2B",
      projectedGrowth: "12%",
      keyPlayers: [
        { name: "Amivantamab", company: "J&J", phase: "Approved", mechanism: "Bispecific antibody", keyDifferentiator: "Different mechanism", efficacy: "Combination use", threat: 'medium' }
      ],
      competitiveAdvantages: ["Best-in-class EGFR TKI", "Adjuvant indication"],
      competitiveRisks: ["Resistance development", "Generic competition"],
      marketPositioning: "Standard of care for EGFR+ NSCLC"
    },
    retrospectivePhases: [
      { phase: "Phase III FLAURA", date: "Q4 2017", outcome: 'success', keyData: ["PFS 18.9 vs 10.2 months"], scoreAtTime: 85, rationale: "Superior first-line efficacy", dataAvailableAtTime: ["PFS/OS data"] },
      { phase: "Phase III ADAURA", date: "Q2 2020", outcome: 'success', keyData: ["DFS HR 0.20", "Adjuvant breakthrough"], scoreAtTime: 92, rationale: "First targeted therapy in adjuvant NSCLC", dataAvailableAtTime: ["DFS data"] }
    ]
  },
  {
    id: "onco-4",
    name: "Sotorasib",
    trialName: "CodeBreaK 100/200",
    phase: "Approved",
    indication: "KRAS G12C-mutant NSCLC",
    therapeuticArea: "Oncology/Hematology",
    company: "Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT03600883",
    clinicalTrialsSearchTerm: "sotorasib KRAS NSCLC",
    scores: calculateProbabilityScores("Approved", "NSCLC", "Oncology"),
    marketData: generateMarketProjections("Sotorasib", "Approved", "NSCLC", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "KRAS G12C inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "First KRAS inhibitor approved, oral dosing",
      discovery: "Amgen",
      development: "Amgen"
    },
    patents: [
      { patentNumber: "US10519146", title: "KRAS G12C inhibitors", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.2B",
      projectedGrowth: "35%",
      keyPlayers: [
        { name: "Adagrasib", company: "Mirati/BMS", phase: "Approved", mechanism: "KRAS G12C", keyDifferentiator: "Longer half-life", efficacy: "Similar", threat: 'high' }
      ],
      competitiveAdvantages: ["First-to-market", "Established safety"],
      competitiveRisks: ["Modest Phase III data", "Adagrasib competition"],
      marketPositioning: "First-in-class KRAS inhibitor"
    },
    retrospectivePhases: [
      { phase: "FDA Accelerated Approval", date: "Q2 2021", outcome: 'success', keyData: ["2L+ NSCLC approval"], scoreAtTime: 75, rationale: "Historic KRAS approval", dataAvailableAtTime: ["Accelerated approval"] },
      { phase: "Phase III CodeBreaK 200", date: "Q4 2022", outcome: 'partial', keyData: ["PFS 5.6 vs 4.5 months", "OS not significant"], scoreAtTime: 78, rationale: "Modest benefit confirmed", dataAvailableAtTime: ["Confirmatory data"] }
    ]
  },
  {
    id: "onco-5",
    name: "Sacituzumab Govitecan",
    trialName: "ASCENT/TROPiCS-02",
    phase: "Approved",
    indication: "Triple-Negative Breast Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "Gilead Sciences",
    companyTrackRecord: 'fast',
    nctId: "NCT02574455",
    clinicalTrialsSearchTerm: "sacituzumab govitecan TNBC",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Oncology"),
    marketData: generateMarketProjections("Sacituzumab Govitecan", "Approved", "Breast Cancer", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Trop-2-directed antibody-drug conjugate",
      administration: "IV infusion Days 1 and 8 of 21-day cycle",
      keyAdvantage: "Trop-2 target, SN-38 payload, TNBC efficacy",
      discovery: "Immunomedics (acquired by Gilead)",
      development: "Gilead Sciences"
    },
    patents: [
      { patentNumber: "US9028833", title: "SN-38 conjugates", expirationDate: "2031", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.8B",
      projectedGrowth: "20%",
      keyPlayers: [
        { name: "Datopotamab deruxtecan", company: "AZ/DS", phase: "Phase III", mechanism: "Trop-2 ADC", keyDifferentiator: "Different payload", efficacy: "TBD", threat: 'high' }
      ],
      competitiveAdvantages: ["First Trop-2 ADC approved", "HR+ expansion"],
      competitiveRisks: ["Newer ADC competition"],
      marketPositioning: "Standard of care for metastatic TNBC"
    },
    retrospectivePhases: [
      { phase: "Phase III ASCENT", date: "Q2 2020", outcome: 'success', keyData: ["PFS 5.6 vs 1.7 months", "OS 12.1 vs 6.7 months"], scoreAtTime: 82, rationale: "Substantial survival benefit", dataAvailableAtTime: ["PFS/OS data"] },
      { phase: "HR+ Expansion", date: "Q1 2023", outcome: 'success', keyData: ["TROPiCS-02 positive"], scoreAtTime: 88, rationale: "Expanded indication", dataAvailableAtTime: ["Label expansion"] }
    ]
  },
  {
    id: "onco-6",
    name: "Zanubrutinib",
    trialName: "ALPINE/SEQUOIA",
    phase: "Approved",
    indication: "Chronic Lymphocytic Leukemia",
    therapeuticArea: "Oncology/Hematology",
    company: "BeiGene",
    companyTrackRecord: 'average',
    nctId: "NCT03734016",
    clinicalTrialsSearchTerm: "zanubrutinib CLL",
    scores: calculateProbabilityScores("Approved", "CLL", "Oncology"),
    marketData: generateMarketProjections("Zanubrutinib", "Approved", "CLL", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Next-generation BTK inhibitor",
      administration: "Twice-daily oral capsules",
      keyAdvantage: "Improved selectivity, better tolerability, head-to-head superiority",
      discovery: "BeiGene",
      development: "BeiGene"
    },
    patents: [
      { patentNumber: "US9556182", title: "BTK inhibitor compounds", expirationDate: "2034", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.5B",
      projectedGrowth: "28%",
      keyPlayers: [
        { name: "Ibrutinib", company: "AbbVie/J&J", phase: "Approved", mechanism: "BTK inhibitor", keyDifferentiator: "First-in-class", efficacy: "Inferior to zanubrutinib", threat: 'medium' },
        { name: "Acalabrutinib", company: "AstraZeneca", phase: "Approved", mechanism: "BTK inhibitor", keyDifferentiator: "Similar selectivity", efficacy: "Comparable", threat: 'high' }
      ],
      competitiveAdvantages: ["Head-to-head superiority vs ibrutinib", "Better cardiac safety"],
      competitiveRisks: ["Crowded BTK market"],
      marketPositioning: "Best-in-class BTK inhibitor"
    },
    retrospectivePhases: [
      { phase: "Phase III ALPINE", date: "Q3 2021", outcome: 'success', keyData: ["ORR 78.3% vs 62.5%", "Superior to ibrutinib"], scoreAtTime: 82, rationale: "First BTKi superiority", dataAvailableAtTime: ["Head-to-head data"] },
      { phase: "FDA Approval CLL", date: "Q1 2023", outcome: 'success', keyData: ["CLL indication"], scoreAtTime: 89, rationale: "Broad CLL approval", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-7",
    name: "Elranatamab",
    trialName: "MagnetisMM-3/5",
    phase: "Approved",
    indication: "Relapsed/Refractory Multiple Myeloma",
    therapeuticArea: "Oncology/Hematology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT04649359",
    clinicalTrialsSearchTerm: "elranatamab multiple myeloma",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Oncology"),
    marketData: generateMarketProjections("Elranatamab", "Approved", "Multiple Myeloma", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "BCMA-CD3 bispecific antibody",
      administration: "Weekly then biweekly SC injection",
      keyAdvantage: "Subcutaneous dosing, off-the-shelf, step-up dosing",
      discovery: "Pfizer",
      development: "Pfizer"
    },
    patents: [
      { patentNumber: "US10766957", title: "BCMA bispecific antibodies", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.2B",
      projectedGrowth: "45%",
      keyPlayers: [
        { name: "Teclistamab", company: "J&J", phase: "Approved", mechanism: "BCMA bispecific", keyDifferentiator: "First BCMA bispecific", efficacy: "Similar", threat: 'high' },
        { name: "Talquetamab", company: "J&J", phase: "Approved", mechanism: "GPRC5D bispecific", keyDifferentiator: "Different target", efficacy: "Complementary", threat: 'medium' }
      ],
      competitiveAdvantages: ["SC convenience", "Pfizer commercial strength"],
      competitiveRisks: ["Crowded bispecific space"],
      marketPositioning: "Off-the-shelf option for relapsed MM"
    },
    retrospectivePhases: [
      { phase: "Phase II MagnetisMM-3", date: "Q4 2022", outcome: 'success', keyData: ["ORR 61%", "CR rate 35%"], scoreAtTime: 75, rationale: "Deep responses", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Accelerated Approval", date: "Q3 2023", outcome: 'success', keyData: ["4L+ approval"], scoreAtTime: 82, rationale: "New MM option", dataAvailableAtTime: ["Regulatory package"] }
    ]
  },
  {
    id: "onco-8",
    name: "Tarlatamab",
    trialName: "DeLLphi-300/301",
    phase: "Approved",
    indication: "Small Cell Lung Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT05060016",
    clinicalTrialsSearchTerm: "tarlatamab SCLC",
    scores: calculateProbabilityScores("Approved", "SCLC", "Oncology"),
    marketData: generateMarketProjections("Tarlatamab", "Approved", "SCLC", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "DLL3-CD3 bispecific T-cell engager",
      administration: "IV infusion every 2 weeks",
      keyAdvantage: "First DLL3-targeted therapy, SCLC activity",
      discovery: "Amgen",
      development: "Amgen"
    },
    patents: [
      { patentNumber: "US10556949", title: "DLL3 binding proteins", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.8B",
      projectedGrowth: "40%",
      keyPlayers: [
        { name: "Lurbinectedin", company: "Jazz", phase: "Approved", mechanism: "Chemotherapy", keyDifferentiator: "Different mechanism", efficacy: "Modest", threat: 'low' }
      ],
      competitiveAdvantages: ["First targeted therapy for SCLC", "Novel DLL3 target"],
      competitiveRisks: ["Limited SCLC market size"],
      marketPositioning: "New treatment paradigm for SCLC"
    },
    retrospectivePhases: [
      { phase: "Phase II DeLLphi-301", date: "Q2 2023", outcome: 'success', keyData: ["ORR 40%", "DoR 9.7 months"], scoreAtTime: 78, rationale: "Meaningful SCLC responses", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Accelerated Approval", date: "Q2 2024", outcome: 'success', keyData: ["2L+ SCLC approval"], scoreAtTime: 85, rationale: "First DLL3 therapy", dataAvailableAtTime: ["Regulatory package"] }
    ]
  },
  {
    id: "onco-9",
    name: "Capivasertib",
    trialName: "CAPItello-291",
    phase: "Approved",
    indication: "HR+/HER2- Breast Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04305496",
    clinicalTrialsSearchTerm: "capivasertib breast cancer",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Oncology"),
    marketData: generateMarketProjections("Capivasertib", "Approved", "Breast Cancer", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AKT inhibitor",
      administration: "Twice-daily oral tablet (4 days on, 3 days off)",
      keyAdvantage: "AKT pathway targeting, biomarker-selected patients",
      discovery: "AstraZeneca/Astex",
      development: "AstraZeneca"
    },
    patents: [
      { patentNumber: "US8664195", title: "AKT inhibitor compounds", expirationDate: "2030", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.5B",
      projectedGrowth: "35%",
      keyPlayers: [
        { name: "Alpelisib", company: "Novartis", phase: "Approved", mechanism: "PI3K inhibitor", keyDifferentiator: "Different pathway target", efficacy: "Comparable", threat: 'medium' }
      ],
      competitiveAdvantages: ["First AKT inhibitor", "Post-CDK4/6 positioning"],
      competitiveRisks: ["PI3K inhibitor competition"],
      marketPositioning: "New option post CDK4/6 inhibitor progression"
    },
    retrospectivePhases: [
      { phase: "Phase III CAPItello-291", date: "Q1 2023", outcome: 'success', keyData: ["PFS 7.2 vs 3.6 months"], scoreAtTime: 84, rationale: "Significant PFS improvement", dataAvailableAtTime: ["PFS data"] },
      { phase: "FDA Approval", date: "Q4 2023", outcome: 'success', keyData: ["HR+/HER2- approval"], scoreAtTime: 86, rationale: "New AKT inhibitor option", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-10",
    name: "Glofitamab",
    trialName: "NP30179/STARGLO",
    phase: "Approved",
    indication: "Relapsed/Refractory DLBCL",
    therapeuticArea: "Oncology/Hematology",
    company: "Roche",
    companyTrackRecord: 'fast',
    nctId: "NCT03075696",
    clinicalTrialsSearchTerm: "glofitamab DLBCL",
    scores: calculateProbabilityScores("Approved", "DLBCL", "Oncology"),
    marketData: generateMarketProjections("Glofitamab", "Approved", "DLBCL", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "CD20-CD3 bispecific antibody",
      administration: "IV infusion with step-up dosing",
      keyAdvantage: "Fixed-duration therapy, high CR rates, 2:1 CD20 binding",
      discovery: "Roche",
      development: "Roche"
    },
    patents: [
      { patentNumber: "US10323091", title: "Bispecific antibody formats", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.8B",
      projectedGrowth: "30%",
      keyPlayers: [
        { name: "Epcoritamab", company: "AbbVie/Genmab", phase: "Approved", mechanism: "CD20-CD3 bispecific", keyDifferentiator: "SC administration", efficacy: "Similar", threat: 'high' }
      ],
      competitiveAdvantages: ["Fixed 12-cycle duration", "High CR rates"],
      competitiveRisks: ["SC competitor convenience"],
      marketPositioning: "First fixed-duration bispecific in DLBCL"
    },
    retrospectivePhases: [
      { phase: "Phase I/II Pivotal", date: "Q2 2022", outcome: 'success', keyData: ["CR rate 39%"], scoreAtTime: 76, rationale: "Deep responses", dataAvailableAtTime: ["Duration data"] },
      { phase: "FDA Accelerated Approval", date: "Q2 2023", outcome: 'success', keyData: ["3L+ DLBCL approval"], scoreAtTime: 84, rationale: "Fixed-duration bispecific", dataAvailableAtTime: ["Regulatory package"] }
    ]
  },
  {
    id: "onco-11",
    name: "Dato-DXd (Datopotamab Deruxtecan)",
    trialName: "TROPION-Breast01/02",
    phase: "Phase III",
    indication: "HR+/HER2- Breast Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "AstraZeneca/Daiichi Sankyo",
    companyTrackRecord: 'fast',
    nctId: "NCT05104866",
    clinicalTrialsSearchTerm: "datopotamab deruxtecan breast",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Oncology"),
    marketData: generateMarketProjections("Datopotamab Deruxtecan", "Phase III", "Breast Cancer", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Trop-2-directed antibody-drug conjugate",
      administration: "IV infusion every 3 weeks",
      keyAdvantage: "DXd payload, Trop-2 targeting, lower drug-antibody ratio",
      discovery: "Daiichi Sankyo",
      development: "AstraZeneca/Daiichi Sankyo partnership"
    },
    patents: [
      { patentNumber: "US10766964", title: "Trop-2 ADC with DXd payload", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.5B",
      projectedGrowth: "25%",
      keyPlayers: [
        { name: "Sacituzumab govitecan", company: "Gilead", phase: "Approved", mechanism: "Trop-2 ADC", keyDifferentiator: "First-to-market", efficacy: "Established", threat: 'high' }
      ],
      competitiveAdvantages: ["DXd payload technology", "AZ/DS commercial strength"],
      competitiveRisks: ["Late entrant to Trop-2 space"],
      marketPositioning: "Next-generation Trop-2 ADC"
    },
    retrospectivePhases: [
      { phase: "Phase III TROPION-Breast01", date: "Q4 2023", outcome: 'partial', keyData: ["PFS met", "OS trend favorable"], scoreAtTime: 72, rationale: "PFS improvement shown", dataAvailableAtTime: ["PFS data"] },
      { phase: "FDA Filing", date: "Q2 2024", outcome: 'pending', keyData: ["BLA submitted"], scoreAtTime: 76, rationale: "Under regulatory review", dataAvailableAtTime: ["Filing package"] }
    ]
  },
  {
    id: "onco-12",
    name: "Ivonescimab",
    trialName: "HARMONi-2/3",
    phase: "Phase III",
    indication: "PD-L1+ NSCLC",
    therapeuticArea: "Oncology/Hematology",
    company: "Akeso/Summit",
    companyTrackRecord: 'average',
    nctId: "NCT05499390",
    clinicalTrialsSearchTerm: "ivonescimab NSCLC",
    scores: calculateProbabilityScores("Phase III", "NSCLC", "Oncology"),
    marketData: generateMarketProjections("Ivonescimab", "Phase III", "NSCLC", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "PD-1/VEGF bispecific antibody",
      administration: "IV infusion every 3 weeks",
      keyAdvantage: "Dual targeting, first bispecific IO/anti-angiogenic",
      discovery: "Akeso",
      development: "Akeso/Summit partnership"
    },
    patents: [
      { patentNumber: "CN110305210", title: "PD-1/VEGF bispecific antibody", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28B",
      projectedGrowth: "10%",
      keyPlayers: [
        { name: "Pembrolizumab", company: "Merck", phase: "Approved", mechanism: "Anti-PD-1", keyDifferentiator: "Standard of care", efficacy: "Benchmark", threat: 'high' }
      ],
      competitiveAdvantages: ["Beat pembrolizumab in head-to-head", "Dual mechanism"],
      competitiveRisks: ["Regulatory path in West uncertain"],
      marketPositioning: "Potential new 1L NSCLC standard"
    },
    retrospectivePhases: [
      { phase: "Phase III HARMONi-2", date: "Q3 2024", outcome: 'success', keyData: ["PFS superiority vs pembro"], scoreAtTime: 72, rationale: "First to beat pembro head-to-head", dataAvailableAtTime: ["PFS data"] }
    ]
  },
  {
    id: "onco-13",
    name: "Zolbetuximab",
    trialName: "SPOTLIGHT/GLOW",
    phase: "Approved",
    indication: "CLDN18.2+ Gastric Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "Astellas",
    companyTrackRecord: 'average',
    nctId: "NCT03504397",
    clinicalTrialsSearchTerm: "zolbetuximab gastric cancer",
    scores: calculateProbabilityScores("Approved", "Gastric Cancer", "Oncology"),
    marketData: generateMarketProjections("Zolbetuximab", "Approved", "Gastric Cancer", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Claudin 18.2-targeted monoclonal antibody",
      administration: "IV infusion every 3 weeks",
      keyAdvantage: "First Claudin-targeted therapy, biomarker-selected",
      discovery: "Ganymed (acquired by Astellas)",
      development: "Astellas"
    },
    patents: [
      { patentNumber: "US9212226", title: "CLDN18.2 antibodies", expirationDate: "2031", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.2B",
      projectedGrowth: "45%",
      keyPlayers: [
        { name: "TST001", company: "Transtarget", phase: "Phase II", mechanism: "CLDN18.2 antibody", keyDifferentiator: "Different construct", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First CLDN18.2 therapy", "OS improvement"],
      competitiveRisks: ["Biomarker testing requirements"],
      marketPositioning: "New standard for CLDN18.2+ gastric cancer"
    },
    retrospectivePhases: [
      { phase: "Phase III SPOTLIGHT", date: "Q1 2023", outcome: 'success', keyData: ["OS 18.2 vs 15.5 months"], scoreAtTime: 78, rationale: "First targeted therapy improving OS in gastric cancer", dataAvailableAtTime: ["OS/PFS data"] },
      { phase: "FDA Approval", date: "Q4 2024", outcome: 'success', keyData: ["1L HER2- gastric approval"], scoreAtTime: 81, rationale: "New standard of care", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-14",
    name: "Tebentafusp",
    trialName: "IMCgp100-202",
    phase: "Approved",
    indication: "Uveal Melanoma",
    therapeuticArea: "Oncology/Hematology",
    company: "Immunocore",
    companyTrackRecord: 'average',
    nctId: "NCT03070392",
    clinicalTrialsSearchTerm: "tebentafusp uveal melanoma",
    scores: calculateProbabilityScores("Approved", "Melanoma", "Oncology"),
    marketData: generateMarketProjections("Tebentafusp", "Approved", "Melanoma", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "gp100-CD3 bispecific T-cell engager (ImmTAC)",
      administration: "Weekly IV infusion",
      keyAdvantage: "First-in-class ImmTAC, OS benefit in solid tumor",
      discovery: "Immunocore",
      development: "Immunocore"
    },
    patents: [
      { patentNumber: "US9540434", title: "gp100 TCR constructs", expirationDate: "2033", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$0.8B",
      projectedGrowth: "15%",
      keyPlayers: [
        { name: "Lifileucel", company: "Iovance", phase: "Approved", mechanism: "TIL therapy", keyDifferentiator: "Cutaneous melanoma", efficacy: "Different setting", threat: 'low' }
      ],
      competitiveAdvantages: ["Only approved therapy for uveal melanoma", "OS benefit"],
      competitiveRisks: ["HLA restriction limits eligible population"],
      marketPositioning: "Only effective therapy for uveal melanoma"
    },
    retrospectivePhases: [
      { phase: "Phase III IMCgp100-202", date: "Q3 2021", outcome: 'success', keyData: ["OS 21.7 vs 16.0 months", "HR 0.51"], scoreAtTime: 80, rationale: "First OS improvement in uveal melanoma", dataAvailableAtTime: ["OS data"] },
      { phase: "FDA Approval", date: "Q1 2022", outcome: 'success', keyData: ["mUM approval", "First TCR therapy"], scoreAtTime: 83, rationale: "Historic approval", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-15",
    name: "Adagrasib",
    trialName: "KRYSTAL-1/7/12",
    phase: "Approved",
    indication: "KRAS G12C-mutant NSCLC",
    therapeuticArea: "Oncology/Hematology",
    company: "Mirati/BMS",
    companyTrackRecord: 'fast',
    nctId: "NCT03785249",
    clinicalTrialsSearchTerm: "adagrasib KRAS NSCLC",
    scores: calculateProbabilityScores("Approved", "NSCLC", "Oncology"),
    marketData: generateMarketProjections("Adagrasib", "Approved", "NSCLC", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "KRAS G12C inhibitor",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Longer half-life, CNS penetration, combination potential",
      discovery: "Mirati Therapeutics",
      development: "Mirati/BMS (acquired)"
    },
    patents: [
      { patentNumber: "US10647698", title: "KRAS G12C inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.5B",
      projectedGrowth: "30%",
      keyPlayers: [
        { name: "Sotorasib", company: "Amgen", phase: "Approved", mechanism: "KRAS G12C", keyDifferentiator: "First-to-market", efficacy: "Similar", threat: 'high' }
      ],
      competitiveAdvantages: ["CNS penetration", "Longer half-life"],
      competitiveRisks: ["Second-to-market"],
      marketPositioning: "Differentiated KRAS G12C inhibitor"
    },
    retrospectivePhases: [
      { phase: "FDA Accelerated Approval", date: "Q4 2022", outcome: 'success', keyData: ["2L+ NSCLC approval"], scoreAtTime: 75, rationale: "Second KRAS inhibitor approved", dataAvailableAtTime: ["Regulatory package"] },
      { phase: "Phase III KRYSTAL-12", date: "Q1 2024", outcome: 'partial', keyData: ["PFS improved", "OS pending"], scoreAtTime: 79, rationale: "PFS benefit confirmed", dataAvailableAtTime: ["PFS data"] }
    ]
  },
  {
    id: "onco-16",
    name: "Fruquintinib",
    trialName: "FRESCO-2",
    phase: "Approved",
    indication: "Refractory Colorectal Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "Takeda/HUTCHMED",
    companyTrackRecord: 'average',
    nctId: "NCT04322539",
    clinicalTrialsSearchTerm: "fruquintinib colorectal cancer",
    scores: calculateProbabilityScores("Approved", "Colorectal Cancer", "Oncology"),
    marketData: generateMarketProjections("Fruquintinib", "Approved", "Colorectal Cancer", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "VEGFR 1/2/3 inhibitor",
      administration: "Once-daily oral capsule (3 weeks on, 1 week off)",
      keyAdvantage: "Highly selective VEGFR, oral dosing, last-line efficacy",
      discovery: "HUTCHMED",
      development: "HUTCHMED/Takeda partnership"
    },
    patents: [
      { patentNumber: "US8629162", title: "Quinazoline derivatives", expirationDate: "2029", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.8B",
      projectedGrowth: "22%",
      keyPlayers: [
        { name: "Regorafenib", company: "Bayer", phase: "Approved", mechanism: "Multi-kinase", keyDifferentiator: "Established", efficacy: "Similar", threat: 'medium' }
      ],
      competitiveAdvantages: ["Selective VEGFR inhibition", "Better tolerability"],
      competitiveRisks: ["Late-line positioning limits market"],
      marketPositioning: "New option for heavily pretreated CRC"
    },
    retrospectivePhases: [
      { phase: "Phase III FRESCO-2 (Global)", date: "Q4 2022", outcome: 'success', keyData: ["OS 7.4 vs 4.8 months"], scoreAtTime: 78, rationale: "Global validation", dataAvailableAtTime: ["OS data"] },
      { phase: "FDA Approval", date: "Q4 2023", outcome: 'success', keyData: ["mCRC approval"], scoreAtTime: 80, rationale: "New CRC option", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "onco-17",
    name: "Mirvetuximab Soravtansine",
    trialName: "SORAYA/MIRASOL",
    phase: "Approved",
    indication: "FRα-positive Ovarian Cancer",
    therapeuticArea: "Oncology/Hematology",
    company: "ImmunoGen/AbbVie",
    companyTrackRecord: 'fast',
    nctId: "NCT04209855",
    clinicalTrialsSearchTerm: "mirvetuximab soravtansine ovarian",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Oncology"),
    marketData: generateMarketProjections("Mirvetuximab Soravtansine", "Approved", "Ovarian Cancer", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Folate receptor alpha-directed ADC",
      administration: "IV infusion every 3 weeks",
      keyAdvantage: "First FRα-targeted therapy, biomarker-selected",
      discovery: "ImmunoGen",
      development: "ImmunoGen/AbbVie (acquired)"
    },
    patents: [
      { patentNumber: "US8557966", title: "FRα ADC conjugates", expirationDate: "2030", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.5B",
      projectedGrowth: "35%",
      keyPlayers: [
        { name: "Niraparib", company: "GSK", phase: "Approved", mechanism: "PARP inhibitor", keyDifferentiator: "Different class", efficacy: "Maintenance setting", threat: 'low' }
      ],
      competitiveAdvantages: ["First biomarker-directed therapy in ovarian cancer"],
      competitiveRisks: ["Patient selection requirements"],
      marketPositioning: "Precision medicine option for FRα-high ovarian cancer"
    },
    retrospectivePhases: [
      { phase: "Phase III SORAYA", date: "Q3 2022", outcome: 'success', keyData: ["ORR 32.4%"], scoreAtTime: 75, rationale: "Single-agent responses", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Accelerated Approval", date: "Q4 2022", outcome: 'success', keyData: ["FRα-high ovarian approval"], scoreAtTime: 82, rationale: "First FRα therapy", dataAvailableAtTime: ["Companion diagnostic"] }
    ]
  },
  {
    id: "onco-18",
    name: "Lifileucel",
    trialName: "C-144-01",
    phase: "Approved",
    indication: "Unresectable/Metastatic Melanoma",
    therapeuticArea: "Oncology/Hematology",
    company: "Iovance Biotherapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT02360579",
    clinicalTrialsSearchTerm: "lifileucel melanoma TIL",
    scores: calculateProbabilityScores("Approved", "Melanoma", "Oncology"),
    marketData: generateMarketProjections("Lifileucel", "Approved", "Melanoma", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Autologous tumor-infiltrating lymphocyte (TIL) therapy",
      administration: "Single IV infusion after lymphodepletion",
      keyAdvantage: "Autologous TIL, one-time treatment, post-checkpoint activity",
      discovery: "Iovance Biotherapeutics",
      development: "Iovance Biotherapeutics"
    },
    patents: [
      { patentNumber: "US10206952", title: "TIL manufacturing process", expirationDate: "2036", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.5B",
      projectedGrowth: "50%",
      keyPlayers: [
        { name: "Tebentafusp", company: "Immunocore", phase: "Approved", mechanism: "TCR therapy", keyDifferentiator: "Uveal melanoma", efficacy: "Different setting", threat: 'low' }
      ],
      competitiveAdvantages: ["First TIL therapy approved", "Post-checkpoint efficacy"],
      competitiveRisks: ["Complex manufacturing", "Access limitations"],
      marketPositioning: "Cell therapy option for checkpoint-refractory melanoma"
    },
    retrospectivePhases: [
      { phase: "Phase I/II C-144-01", date: "Q1 2021", outcome: 'success', keyData: ["ORR 36%", "Durable responses"], scoreAtTime: 68, rationale: "TIL proof of concept", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Approval", date: "Q1 2024", outcome: 'success', keyData: ["Post-PD-1 melanoma approval"], scoreAtTime: 77, rationale: "First TIL therapy", dataAvailableAtTime: ["REMS, manufacturing"] }
    ]
  },
  {
    id: "onco-19",
    name: "Talquetamab",
    trialName: "MonumenTAL-1",
    phase: "Approved",
    indication: "Relapsed/Refractory Multiple Myeloma",
    therapeuticArea: "Oncology/Hematology",
    company: "Johnson & Johnson",
    companyTrackRecord: 'fast',
    nctId: "NCT03399799",
    clinicalTrialsSearchTerm: "talquetamab multiple myeloma",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Oncology"),
    marketData: generateMarketProjections("Talquetamab", "Approved", "Multiple Myeloma", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GPRC5D-CD3 bispecific antibody",
      administration: "Weekly then biweekly SC injection",
      keyAdvantage: "Novel GPRC5D target, non-BCMA option, SC dosing",
      discovery: "Janssen",
      development: "Johnson & Johnson"
    },
    patents: [
      { patentNumber: "US10717782", title: "GPRC5D bispecific antibodies", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.5B",
      projectedGrowth: "40%",
      keyPlayers: [
        { name: "Teclistamab", company: "J&J", phase: "Approved", mechanism: "BCMA bispecific", keyDifferentiator: "Same company, different target", efficacy: "Complementary", threat: 'low' },
        { name: "Elranatamab", company: "Pfizer", phase: "Approved", mechanism: "BCMA bispecific", keyDifferentiator: "Competitor BCMA", efficacy: "Similar", threat: 'medium' }
      ],
      competitiveAdvantages: ["First GPRC5D therapy", "Non-BCMA mechanism"],
      competitiveRisks: ["Unique skin/nail toxicity profile"],
      marketPositioning: "New target class for BCMA-exposed patients"
    },
    retrospectivePhases: [
      { phase: "Phase I/II MonumenTAL-1", date: "Q4 2022", outcome: 'success', keyData: ["ORR 70%", "BCMA-refractory activity"], scoreAtTime: 78, rationale: "High responses in difficult population", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Accelerated Approval", date: "Q3 2023", outcome: 'success', keyData: ["4L+ approval", "First GPRC5D therapy"], scoreAtTime: 84, rationale: "New target class", dataAvailableAtTime: ["Regulatory package"] }
    ]
  },
  {
    id: "onco-20",
    name: "Epcoritamab",
    trialName: "EPCORE NHL-1/3",
    phase: "Approved",
    indication: "Relapsed/Refractory DLBCL",
    therapeuticArea: "Oncology/Hematology",
    company: "AbbVie/Genmab",
    companyTrackRecord: 'fast',
    nctId: "NCT03625037",
    clinicalTrialsSearchTerm: "epcoritamab DLBCL",
    scores: calculateProbabilityScores("Approved", "DLBCL", "Oncology"),
    marketData: generateMarketProjections("Epcoritamab", "Approved", "DLBCL", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "CD20-CD3 bispecific antibody",
      administration: "Weekly then monthly SC injection",
      keyAdvantage: "Subcutaneous administration, high CR rates",
      discovery: "Genmab",
      development: "AbbVie/Genmab partnership"
    },
    patents: [
      { patentNumber: "US10759863", title: "CD20xCD3 bispecific antibodies", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.0B",
      projectedGrowth: "32%",
      keyPlayers: [
        { name: "Glofitamab", company: "Roche", phase: "Approved", mechanism: "CD20-CD3 bispecific", keyDifferentiator: "IV, fixed duration", efficacy: "Similar", threat: 'high' }
      ],
      competitiveAdvantages: ["SC convenience", "Outpatient administration"],
      competitiveRisks: ["Glofitamab fixed-duration appeal"],
      marketPositioning: "Convenient SC bispecific for DLBCL"
    },
    retrospectivePhases: [
      { phase: "Phase I/II EPCORE NHL-1", date: "Q3 2022", outcome: 'success', keyData: ["CR 39%", "ORR 63%"], scoreAtTime: 78, rationale: "High complete responses", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "FDA Accelerated Approval", date: "Q2 2023", outcome: 'success', keyData: ["3L+ DLBCL approval", "First SC bispecific"], scoreAtTime: 85, rationale: "SC convenience differentiation", dataAvailableAtTime: ["Regulatory package"] }
    ]
  }
];
