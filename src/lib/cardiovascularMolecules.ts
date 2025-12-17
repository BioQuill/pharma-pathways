// 20 Cardiovascular Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const cardiovascularMolecules: MoleculeProfile[] = [
  // 1. Zilebesiran - siRNA for hypertension
  {
    id: "ZILE-01",
    name: "Zilebesiran (ALN-AGT01)",
    trialName: "KARDIA",
    phase: "Phase III",
    indication: "Hypertension",
    therapeuticArea: "Cardiovascular",
    company: "Alnylam Pharmaceuticals",
    companyTrackRecord: 'fast',
    nctId: "NCT05103332",
    clinicalTrialsSearchTerm: "zilebesiran",
    scores: calculateProbabilityScores("Phase III", "Hypertension", "Cardiovascular"),
    marketData: generateMarketProjections("Zilebesiran", "Phase III", "Hypertension", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA targeting angiotensinogen (AGT)",
      administration: "Subcutaneous injection every 6 months",
      keyAdvantage: "Long-acting blood pressure control with twice-yearly dosing",
      discovery: "Alnylam Pharmaceuticals",
      development: "Developed in collaboration with Roche",
      additionalInfo: [
        "First RNAi therapy for hypertension",
        "20-24 mmHg SBP reduction in Phase 2",
        "Addresses adherence challenges in hypertension"
      ]
    },
    patents: [
      { patentNumber: "US11,149,278", title: "siRNA compositions targeting AGT", expirationDate: "2040", type: 'composition', status: 'active' },
      { patentNumber: "US11,459,562", title: "Methods of treating hypertension with siRNA", expirationDate: "2041", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (hypertension market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "ACE inhibitors/ARBs", company: "Multiple", phase: "Approved", mechanism: "RAS inhibition", keyDifferentiator: "Standard of care", efficacy: "10-15 mmHg SBP", threat: 'medium' },
        { name: "Baxdrostat", company: "CinCor Pharma", phase: "Phase III", mechanism: "Aldosterone synthase inhibitor", keyDifferentiator: "Novel target", efficacy: "~20 mmHg SBP", threat: 'medium' },
      ],
      competitiveAdvantages: ["Twice-yearly dosing", "Durable 24-hour BP control", "Novel RNAi mechanism"],
      competitiveRisks: ["Injectable vs oral", "Long-term safety unknown", "Pricing for chronic condition"],
      marketPositioning: "First-in-class siRNA therapy offering sustained blood pressure control with twice-yearly dosing."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2021", outcome: 'success', keyData: ["Proof of concept", "Dose-dependent AGT knockdown"], scoreAtTime: 45, rationale: "Novel mechanism validated", dataAvailableAtTime: ["Phase 1 results"] },
      { phase: "Phase 2 KARDIA-1", date: "Q4 2023", outcome: 'success', keyData: ["20 mmHg SBP reduction", "6-month durability"], scoreAtTime: 68, rationale: "Strong efficacy signal", dataAvailableAtTime: ["KARDIA-1 results"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["KARDIA-2/3 ongoing", "~3,500 patients enrolled"], scoreAtTime: 65, rationale: "Pivotal trials progressing", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 2. Aprocitentan - Dual ERA for resistant hypertension
  {
    id: "APRO-01",
    name: "Aprocitentan (ACT-132577)",
    trialName: "PRECISION",
    phase: "Approved",
    indication: "Resistant Hypertension",
    therapeuticArea: "Cardiovascular",
    company: "Idorsia/Janssen",
    companyTrackRecord: 'average',
    nctId: "NCT03541174",
    clinicalTrialsSearchTerm: "aprocitentan",
    scores: calculateProbabilityScores("Approved", "Hypertension", "Cardiovascular"),
    marketData: generateMarketProjections("Aprocitentan", "Approved", "Hypertension", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual endothelin receptor antagonist (ERA)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "First approved therapy specifically for resistant hypertension",
      discovery: "Idorsia Pharmaceuticals",
      license: "Janssen (global rights)",
      development: "Joint development Idorsia/Janssen",
    },
    patents: [
      { patentNumber: "US9,556,167", title: "Dual endothelin receptor antagonists", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (resistant hypertension)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Spironolactone", company: "Generic", phase: "Approved", mechanism: "MRA", keyDifferentiator: "Standard add-on therapy", efficacy: "~8 mmHg SBP", threat: 'low' },
        { name: "Zilebesiran", company: "Alnylam", phase: "Phase III", mechanism: "siRNA AGT", keyDifferentiator: "Long-acting RNAi", efficacy: "~20 mmHg SBP", threat: 'high' },
      ],
      competitiveAdvantages: ["First FDA-approved for resistant HTN", "Oral once-daily", "Novel mechanism"],
      competitiveRisks: ["Fluid retention AE", "Zilebesiran competition", "Limited patient population"],
      marketPositioning: "First therapy specifically approved for treatment-resistant hypertension."
    },
    retrospectivePhases: [
      { phase: "Phase 3 PRECISION", date: "Q4 2022", outcome: 'success', keyData: ["3.8 mmHg SBP vs placebo", "Sustained at 48 weeks"], scoreAtTime: 72, rationale: "Met primary endpoint", dataAvailableAtTime: ["PRECISION results"] },
      { phase: "FDA Approval", date: "Mar 2024", outcome: 'success', keyData: ["Approved for resistant HTN", "First-in-indication"], scoreAtTime: 95, rationale: "Historic approval", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 3. Sotatercept - ActRIIA-Fc for PAH
  {
    id: "SOTA-01",
    name: "Sotatercept (Winrevair)",
    trialName: "STELLAR",
    phase: "Approved",
    indication: "Pulmonary Arterial Hypertension",
    therapeuticArea: "Cardiovascular",
    company: "Merck (via Acceleron)",
    companyTrackRecord: 'fast',
    nctId: "NCT04576988",
    clinicalTrialsSearchTerm: "sotatercept",
    scores: calculateProbabilityScores("Approved", "PAH", "Cardiovascular"),
    marketData: generateMarketProjections("Sotatercept", "Approved", "PAH", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Activin receptor type IIA-Fc fusion protein",
      administration: "Subcutaneous injection every 3 weeks",
      keyAdvantage: "First therapy to address underlying disease pathobiology in PAH",
      discovery: "Acceleron Pharma",
      license: "Merck acquisition ($11.5B, 2021)",
      development: "Merck",
    },
    patents: [
      { patentNumber: "US8,058,229", title: "ActRIIA-Fc fusion proteins", expirationDate: "2029", type: 'composition', status: 'active' },
      { patentNumber: "US10,766,946", title: "Methods for treating PAH", expirationDate: "2037", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (PAH market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Uptravi (selexipag)", company: "Janssen", phase: "Approved", mechanism: "IP receptor agonist", keyDifferentiator: "Oral prostacyclin pathway", efficacy: "Delays progression", threat: 'medium' },
        { name: "Opsumit (macitentan)", company: "Janssen", phase: "Approved", mechanism: "ERA", keyDifferentiator: "Tissue-targeting ERA", efficacy: "Reduces morbidity/mortality", threat: 'medium' },
      ],
      competitiveAdvantages: ["Novel mechanism (reverse remodeling)", "59m improvement in 6MWD", "First disease-modifying therapy"],
      competitiveRisks: ["High price point", "Injectable administration", "Limited long-term data"],
      marketPositioning: "First-in-class therapy that reverses pulmonary vascular remodeling in PAH."
    },
    retrospectivePhases: [
      { phase: "Phase 2 PULSAR", date: "Q1 2021", outcome: 'success', keyData: ["34m improvement in 6MWD", "PVR reduction"], scoreAtTime: 72, rationale: "Breakthrough efficacy", dataAvailableAtTime: ["PULSAR results"] },
      { phase: "Phase 3 STELLAR", date: "Q1 2023", outcome: 'success', keyData: ["59m improvement in 6MWD", "Mortality benefit signal"], scoreAtTime: 88, rationale: "Exceptional results", dataAvailableAtTime: ["STELLAR results"] },
      { phase: "FDA Approval", date: "Mar 2024", outcome: 'success', keyData: ["Approved for PAH", "Blockbuster potential"], scoreAtTime: 98, rationale: "Transformative therapy approved", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 4. Baxdrostat - Aldosterone synthase inhibitor
  {
    id: "BAXD-01",
    name: "Baxdrostat (BrigHtn)",
    trialName: "BrigHTN",
    phase: "Phase III",
    indication: "Treatment-Resistant Hypertension",
    therapeuticArea: "Cardiovascular",
    company: "CinCor Pharma/AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT05432167",
    clinicalTrialsSearchTerm: "baxdrostat",
    scores: calculateProbabilityScores("Phase III", "Hypertension", "Cardiovascular"),
    marketData: generateMarketProjections("Baxdrostat", "Phase III", "Hypertension", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Highly selective aldosterone synthase inhibitor (ASI)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Selective aldosterone reduction without cortisol effects",
      discovery: "CinCor Pharma",
      license: "AstraZeneca acquisition ($1.8B, 2023)",
      development: "AstraZeneca",
    },
    patents: [
      { patentNumber: "US10,961,250", title: "Aldosterone synthase inhibitors", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (resistant hypertension)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Aprocitentan", company: "Idorsia/Janssen", phase: "Approved", mechanism: "Dual ERA", keyDifferentiator: "First approved for resistant HTN", efficacy: "3.8 mmHg SBP", threat: 'high' },
        { name: "Zilebesiran", company: "Alnylam", phase: "Phase III", mechanism: "siRNA AGT", keyDifferentiator: "Long-acting RNAi", efficacy: "~20 mmHg SBP", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral daily dosing", "~20 mmHg SBP reduction", "Selective mechanism"],
      competitiveRisks: ["Aprocitentan first-mover", "Multiple competitors in Phase 3"],
      marketPositioning: "First selective aldosterone synthase inhibitor for treatment-resistant hypertension."
    },
    retrospectivePhases: [
      { phase: "Phase 2 BrigHTN-301", date: "Q4 2022", outcome: 'success', keyData: ["20 mmHg SBP reduction", "Dose-dependent response"], scoreAtTime: 68, rationale: "Strong Phase 2 results", dataAvailableAtTime: ["Phase 2 topline"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trials ongoing", "AZ acquisition accelerates development"], scoreAtTime: 65, rationale: "Well-funded Phase 3", dataAvailableAtTime: ["Trial updates"] }
    ]
  },

  // 5. Olpasiran - Lp(a) siRNA
  {
    id: "OLPA-01",
    name: "Olpasiran (AMG 890)",
    trialName: "OCEAN(a)",
    phase: "Phase III",
    indication: "Elevated Lipoprotein(a) / ASCVD",
    therapeuticArea: "Cardiovascular",
    company: "Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT05581303",
    clinicalTrialsSearchTerm: "olpasiran",
    scores: calculateProbabilityScores("Phase III", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Olpasiran", "Phase III", "Hyperlipidemia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA targeting apolipoprotein(a)",
      administration: "Subcutaneous injection every 3-6 months",
      keyAdvantage: "First therapy to substantially lower Lp(a), an independent CV risk factor",
      discovery: "Arrowhead Pharmaceuticals",
      license: "Amgen license (2016)",
      development: "Amgen",
    },
    patents: [
      { patentNumber: "US10,975,374", title: "siRNA compounds targeting Lp(a)", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (Lp(a) lowering potential)",
      projectedGrowth: "New market creation",
      keyPlayers: [
        { name: "Pelacarsen", company: "Novartis/Ionis", phase: "Phase III", mechanism: "ASO", keyDifferentiator: "First-in-class ASO", efficacy: "~80% Lp(a) reduction", threat: 'high' },
        { name: "SLN360", company: "Silence Therapeutics", phase: "Phase II", mechanism: "siRNA", keyDifferentiator: "Alternative siRNA", efficacy: ">95% Lp(a) reduction", threat: 'medium' },
      ],
      competitiveAdvantages: [">95% Lp(a) reduction", "Quarterly dosing option", "Large outcomes trial"],
      competitiveRisks: ["Pelacarsen may report first", "CV outcomes not yet proven"],
      marketPositioning: "Leading siRNA for Lp(a) reduction with potential to create new therapeutic category."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2020", outcome: 'success', keyData: [">90% Lp(a) reduction", "Durable effect"], scoreAtTime: 55, rationale: "Exceptional Lp(a) lowering", dataAvailableAtTime: ["Phase 1 results"] },
      { phase: "Phase 2 OCEAN(a)-DOSE", date: "Q4 2022", outcome: 'success', keyData: [">95% Lp(a) reduction at high dose", "Extended durability"], scoreAtTime: 72, rationale: "Best-in-class Lp(a) lowering", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 OCEAN(a)-Outcomes", date: "Q4 2024", outcome: 'pending', keyData: ["~7,500 patients enrolled", "CV outcomes primary endpoint"], scoreAtTime: 68, rationale: "Pivotal outcomes trial underway", dataAvailableAtTime: ["Enrollment complete"] }
    ]
  },

  // 6. Pelacarsen - Lp(a) ASO
  {
    id: "PELA-01",
    name: "Pelacarsen (TQJ230)",
    trialName: "Lp(a)HORIZON",
    phase: "Phase III",
    indication: "Elevated Lipoprotein(a) / ASCVD",
    therapeuticArea: "Cardiovascular",
    company: "Novartis/Ionis",
    companyTrackRecord: 'fast',
    nctId: "NCT04023552",
    clinicalTrialsSearchTerm: "pelacarsen",
    scores: calculateProbabilityScores("Phase III", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Pelacarsen", "Phase III", "Hyperlipidemia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Antisense oligonucleotide (ASO) targeting apolipoprotein(a)",
      administration: "Monthly subcutaneous injection",
      keyAdvantage: "First Lp(a)-lowering therapy in Phase 3 outcomes trial",
      discovery: "Ionis Pharmaceuticals",
      license: "Novartis collaboration (2019)",
      development: "Novartis",
    },
    patents: [
      { patentNumber: "US10,280,423", title: "Antisense compounds targeting Lp(a)", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (Lp(a) lowering potential)",
      projectedGrowth: "New market creation",
      keyPlayers: [
        { name: "Olpasiran", company: "Amgen", phase: "Phase III", mechanism: "siRNA", keyDifferentiator: "Greater Lp(a) reduction", efficacy: ">95% Lp(a) reduction", threat: 'high' },
        { name: "Lepodisiran", company: "Eli Lilly", phase: "Phase II", mechanism: "siRNA", keyDifferentiator: "Annual dosing potential", efficacy: ">95% Lp(a) reduction", threat: 'medium' },
      ],
      competitiveAdvantages: ["First-mover in outcomes trial", "~80% Lp(a) reduction", "Novartis backing"],
      competitiveRisks: ["Monthly dosing vs quarterly siRNAs", "Slightly lower Lp(a) reduction"],
      marketPositioning: "First Lp(a)-lowering therapy to potentially demonstrate CV outcomes benefit."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2020", outcome: 'success', keyData: ["~80% Lp(a) reduction", "Good tolerability"], scoreAtTime: 62, rationale: "Significant Lp(a) lowering", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 Lp(a)HORIZON", date: "Q4 2024", outcome: 'pending', keyData: ["~8,300 patients enrolled", "MACE primary endpoint"], scoreAtTime: 65, rationale: "Largest Lp(a) outcomes trial", dataAvailableAtTime: ["Trial updates"] }
    ]
  },

  // 7. Obicetrapib - CETP inhibitor
  {
    id: "OBIC-01",
    name: "Obicetrapib",
    trialName: "PREVAIL",
    phase: "Phase III",
    indication: "Hypercholesterolemia / HeFH",
    therapeuticArea: "Cardiovascular",
    company: "NewAmsterdam Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT05425745",
    clinicalTrialsSearchTerm: "obicetrapib",
    scores: calculateProbabilityScores("Phase III", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Obicetrapib", "Phase III", "Hyperlipidemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective CETP inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Oral therapy with ~50% LDL-C reduction on top of statins",
      discovery: "Amgen (original development)",
      license: "NewAmsterdam Pharma acquisition",
      development: "NewAmsterdam Pharma",
    },
    patents: [
      { patentNumber: "US8,846,665", title: "CETP inhibitor compounds", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (LDL-C lowering)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Repatha/Praluent", company: "Amgen/Sanofi", phase: "Approved", mechanism: "PCSK9 mAb", keyDifferentiator: "Injectable gold standard", efficacy: "~60% LDL-C reduction", threat: 'high' },
        { name: "Leqvio", company: "Novartis", phase: "Approved", mechanism: "siRNA PCSK9", keyDifferentiator: "Twice-yearly injection", efficacy: "~50% LDL-C reduction", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral administration", "~50% additional LDL reduction", "HDL raising"],
      competitiveRisks: ["Prior CETP failures (torcetrapib, evacetrapib)", "Long outcomes trial needed"],
      marketPositioning: "First oral CETP inhibitor offering substantial LDL-C reduction."
    },
    retrospectivePhases: [
      { phase: "Phase 2b ROSE", date: "Q2 2022", outcome: 'success', keyData: ["51% LDL-C reduction add-on", "Good tolerability"], scoreAtTime: 58, rationale: "Revived CETP class", dataAvailableAtTime: ["ROSE results"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["PREVAIL/BROADWAY ongoing", "HeFH focus"], scoreAtTime: 55, rationale: "Registrational trials progressing", dataAvailableAtTime: ["Trial updates"] }
    ]
  },

  // 8. Aficamten - Cardiac myosin inhibitor for HCM
  {
    id: "AFIC-01",
    name: "Aficamten (CK-274)",
    trialName: "SEQUOIA-HCM",
    phase: "Phase III",
    indication: "Hypertrophic Cardiomyopathy (HCM)",
    therapeuticArea: "Cardiovascular",
    company: "Cytokinetics/Bristol-Myers Squibb",
    companyTrackRecord: 'average',
    nctId: "NCT05186818",
    clinicalTrialsSearchTerm: "aficamten",
    scores: calculateProbabilityScores("Phase III", "Cardiomyopathy", "Cardiovascular"),
    marketData: generateMarketProjections("Aficamten", "Phase III", "Cardiomyopathy", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Next-generation cardiac myosin inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "More selective myosin inhibitor with wider therapeutic window than mavacamten",
      discovery: "Cytokinetics",
      license: "BMS acquisition ($4.1B, 2024)",
      development: "Bristol-Myers Squibb",
    },
    patents: [
      { patentNumber: "US11,007,179", title: "Cardiac myosin inhibitor compounds", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (HCM market)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Camzyos (mavacamten)", company: "BMS", phase: "Approved", mechanism: "Cardiac myosin inhibitor", keyDifferentiator: "First-in-class", efficacy: "Significant symptom improvement", threat: 'medium' },
      ],
      competitiveAdvantages: ["Wider therapeutic window", "Less drug monitoring required", "Better safety profile"],
      competitiveRisks: ["Camzyos first-mover", "Same mechanism class", "BMS owns both"],
      marketPositioning: "Best-in-class cardiac myosin inhibitor with improved safety and convenience."
    },
    retrospectivePhases: [
      { phase: "Phase 2 REDWOOD-HCM", date: "Q2 2023", outcome: 'success', keyData: ["Significant LVOT gradient reduction", "No dose titration needed"], scoreAtTime: 65, rationale: "Favorable Phase 2 profile", dataAvailableAtTime: ["REDWOOD results"] },
      { phase: "Phase 3 SEQUOIA-HCM", date: "Q2 2024", outcome: 'success', keyData: ["Met primary endpoint", "Superior LVOT gradient reduction"], scoreAtTime: 78, rationale: "Positive pivotal results", dataAvailableAtTime: ["SEQUOIA results"] },
      { phase: "FDA Filing", date: "Q4 2024", outcome: 'pending', keyData: ["NDA submitted", "Priority review expected"], scoreAtTime: 82, rationale: "Approval expected 2025", dataAvailableAtTime: ["Regulatory submission"] }
    ]
  },

  // 9. Inclisiran - PCSK9 siRNA
  {
    id: "INCL-01",
    name: "Inclisiran (Leqvio)",
    trialName: "ORION",
    phase: "Approved/Expansion",
    indication: "Hypercholesterolemia / ASCVD",
    therapeuticArea: "Cardiovascular",
    company: "Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT03705234",
    clinicalTrialsSearchTerm: "inclisiran",
    scores: calculateProbabilityScores("Approved", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Inclisiran", "Approved", "Hyperlipidemia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA targeting PCSK9",
      administration: "Subcutaneous injection twice yearly",
      keyAdvantage: "Only twice-yearly dosing for potent LDL-C lowering",
      discovery: "Alnylam Pharmaceuticals",
      license: "Novartis acquisition of Medicines Company ($9.7B, 2020)",
      development: "Novartis",
    },
    patents: [
      { patentNumber: "US10,301,628", title: "siRNA targeting PCSK9", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (PCSK9 inhibitors)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Repatha (evolocumab)", company: "Amgen", phase: "Approved", mechanism: "PCSK9 mAb", keyDifferentiator: "CV outcomes data", efficacy: "~60% LDL-C reduction", threat: 'medium' },
        { name: "Praluent (alirocumab)", company: "Sanofi", phase: "Approved", mechanism: "PCSK9 mAb", keyDifferentiator: "CV outcomes data", efficacy: "~60% LDL-C reduction", threat: 'medium' },
      ],
      competitiveAdvantages: ["Twice-yearly dosing", "~50% LDL-C reduction", "UK NHS adoption model"],
      competitiveRisks: ["Outcomes trial ongoing", "MAb efficacy slightly higher"],
      marketPositioning: "Most convenient PCSK9 inhibitor with twice-yearly dosing."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ORION-10/11", date: "Q4 2019", outcome: 'success', keyData: ["~50% LDL-C reduction", "Maintained to 18 months"], scoreAtTime: 82, rationale: "Efficacy confirmed", dataAvailableAtTime: ["ORION results"] },
      { phase: "FDA Approval", date: "Dec 2021", outcome: 'success', keyData: ["Approved for ASCVD", "Twice-yearly dosing approved"], scoreAtTime: 95, rationale: "Commercial launch", dataAvailableAtTime: ["Approval data"] },
      { phase: "ORION-4 Outcomes", date: "Q4 2024", outcome: 'pending', keyData: ["~15,000 patient outcomes trial", "Results expected 2026"], scoreAtTime: 92, rationale: "Outcomes trial maturing", dataAvailableAtTime: ["Trial status"] }
    ]
  },

  // 10. Muvalaplin - Oral Lp(a) inhibitor
  {
    id: "MUVA-01",
    name: "Muvalaplin (LY3473329)",
    trialName: "KRAKEN",
    phase: "Phase III",
    indication: "Elevated Lipoprotein(a)",
    therapeuticArea: "Cardiovascular",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05563246",
    clinicalTrialsSearchTerm: "muvalaplin",
    scores: calculateProbabilityScores("Phase III", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Muvalaplin", "Phase III", "Hyperlipidemia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Small molecule Lp(a) assembly inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "First oral therapy for Lp(a) reduction",
      discovery: "Eli Lilly",
      development: "Eli Lilly",
    },
    patents: [
      { patentNumber: "US11,358,952", title: "Lp(a) assembly inhibitors", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (Lp(a) lowering potential)",
      projectedGrowth: "New market creation",
      keyPlayers: [
        { name: "Olpasiran", company: "Amgen", phase: "Phase III", mechanism: "siRNA", keyDifferentiator: "Greater Lp(a) reduction", efficacy: ">95% Lp(a) reduction", threat: 'high' },
        { name: "Pelacarsen", company: "Novartis", phase: "Phase III", mechanism: "ASO", keyDifferentiator: "First-mover", efficacy: "~80% Lp(a) reduction", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral daily administration", "~70% Lp(a) reduction", "No injection required"],
      competitiveRisks: ["Lower efficacy than siRNAs", "Daily dosing vs quarterly injection"],
      marketPositioning: "First oral Lp(a)-lowering therapy offering convenience advantage."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2023", outcome: 'success', keyData: ["~70% Lp(a) reduction", "Good oral bioavailability"], scoreAtTime: 62, rationale: "Oral Lp(a) therapy validated", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 KRAKEN", date: "Q4 2024", outcome: 'pending', keyData: ["KRAKEN-1 initiated", "Biomarker endpoint"], scoreAtTime: 58, rationale: "Pivotal program underway", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 11. Vutrisiran - TTR siRNA for ATTR-CM
  {
    id: "VUTR-01",
    name: "Vutrisiran (Amvuttra)",
    trialName: "HELIOS",
    phase: "Approved/Expansion",
    indication: "ATTR Cardiomyopathy",
    therapeuticArea: "Cardiovascular",
    company: "Alnylam Pharmaceuticals",
    companyTrackRecord: 'fast',
    nctId: "NCT04153149",
    clinicalTrialsSearchTerm: "vutrisiran",
    scores: calculateProbabilityScores("Approved", "Cardiomyopathy", "Cardiovascular"),
    marketData: generateMarketProjections("Vutrisiran", "Approved", "Cardiomyopathy", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA targeting transthyretin (TTR)",
      administration: "Quarterly subcutaneous injection",
      keyAdvantage: "More convenient dosing than patisiran with improved efficacy",
      discovery: "Alnylam Pharmaceuticals",
      development: "Alnylam Pharmaceuticals",
    },
    patents: [
      { patentNumber: "US10,633,653", title: "TTR siRNA conjugates", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (ATTR market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tafamidis (Vyndaqel)", company: "Pfizer", phase: "Approved", mechanism: "TTR stabilizer", keyDifferentiator: "First ATTR-CM therapy", efficacy: "Slows progression", threat: 'high' },
        { name: "Patisiran (Onpattro)", company: "Alnylam", phase: "Approved", mechanism: "siRNA TTR", keyDifferentiator: "IV administration", efficacy: ">80% TTR knockdown", threat: 'low' },
      ],
      competitiveAdvantages: ["Quarterly SC dosing", ">85% TTR reduction", "CV outcomes benefit"],
      competitiveRisks: ["Tafamidis market leader", "Price competition"],
      marketPositioning: "Best-in-class TTR knockdown therapy with convenient quarterly dosing."
    },
    retrospectivePhases: [
      { phase: "FDA Approval (hATTR-PN)", date: "Jun 2022", outcome: 'success', keyData: ["Approved for polyneuropathy", "Quarterly dosing"], scoreAtTime: 88, rationale: "Initial approval", dataAvailableAtTime: ["Approval data"] },
      { phase: "Phase 3 HELIOS-B", date: "Q2 2024", outcome: 'success', keyData: ["Met primary CV endpoint", "Mortality benefit signal"], scoreAtTime: 95, rationale: "Breakthrough ATTR-CM data", dataAvailableAtTime: ["HELIOS-B results"] },
      { phase: "ATTR-CM Filing", date: "Q4 2024", outcome: 'pending', keyData: ["sNDA submitted", "ATTR-CM indication"], scoreAtTime: 92, rationale: "Label expansion expected", dataAvailableAtTime: ["Regulatory submission"] }
    ]
  },

  // 12. Acoramidis - TTR stabilizer
  {
    id: "ACOR-01",
    name: "Acoramidis (Attruby)",
    trialName: "ATTRibute-CM",
    phase: "Approved",
    indication: "ATTR Cardiomyopathy",
    therapeuticArea: "Cardiovascular",
    company: "BridgeBio",
    companyTrackRecord: 'average',
    nctId: "NCT03860935",
    clinicalTrialsSearchTerm: "acoramidis",
    scores: calculateProbabilityScores("Approved", "Cardiomyopathy", "Cardiovascular"),
    marketData: generateMarketProjections("Acoramidis", "Approved", "Cardiomyopathy", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Next-generation TTR stabilizer",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "More potent TTR stabilization than tafamidis",
      discovery: "Eidos Therapeutics",
      license: "BridgeBio acquisition (2020)",
      development: "BridgeBio",
    },
    patents: [
      { patentNumber: "US10,786,510", title: "TTR stabilizer compounds", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (ATTR-CM)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tafamidis (Vyndaqel)", company: "Pfizer", phase: "Approved", mechanism: "TTR stabilizer", keyDifferentiator: "First approved", efficacy: "30% mortality reduction", threat: 'high' },
        { name: "Vutrisiran", company: "Alnylam", phase: "Approved", mechanism: "siRNA", keyDifferentiator: "TTR knockdown", efficacy: ">85% TTR reduction", threat: 'high' },
      ],
      competitiveAdvantages: ["Superior TTR stabilization", "Better clinical outcomes", "Oral dosing"],
      competitiveRisks: ["Tafamidis entrenched", "Vutrisiran efficacy", "Twice-daily dosing"],
      marketPositioning: "Best-in-class oral TTR stabilizer with superior efficacy."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ATTRibute-CM", date: "Q4 2023", outcome: 'success', keyData: ["Superior to tafamidis", "Mortality benefit vs placebo"], scoreAtTime: 82, rationale: "Exceptional results", dataAvailableAtTime: ["ATTRibute results"] },
      { phase: "FDA Approval", date: "Nov 2024", outcome: 'success', keyData: ["Approved for ATTR-CM", "Premium positioning"], scoreAtTime: 95, rationale: "Commercial launch", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 13. Eplontersen - TTR ASO
  {
    id: "EPLO-01",
    name: "Eplontersen (Wainua)",
    trialName: "CARDIO-TTRansform",
    phase: "Approved/Expansion",
    indication: "ATTR-PN / ATTR-CM",
    therapeuticArea: "Cardiovascular",
    company: "Ionis/AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04136171",
    clinicalTrialsSearchTerm: "eplontersen",
    scores: calculateProbabilityScores("Approved", "Cardiomyopathy", "Cardiovascular"),
    marketData: generateMarketProjections("Eplontersen", "Approved", "Cardiomyopathy", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Ligand-conjugated antisense oligonucleotide (LICA) targeting TTR",
      administration: "Monthly subcutaneous self-injection",
      keyAdvantage: "Monthly self-administration with >85% TTR knockdown",
      discovery: "Ionis Pharmaceuticals",
      license: "AstraZeneca partnership (2020)",
      development: "Ionis/AstraZeneca",
    },
    patents: [
      { patentNumber: "US10,988,764", title: "TTR antisense oligonucleotides", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (ATTR market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Vutrisiran", company: "Alnylam", phase: "Approved", mechanism: "siRNA", keyDifferentiator: "Quarterly dosing", efficacy: ">85% TTR reduction", threat: 'high' },
        { name: "Tafamidis", company: "Pfizer", phase: "Approved", mechanism: "Stabilizer", keyDifferentiator: "Oral", efficacy: "Slows progression", threat: 'medium' },
      ],
      competitiveAdvantages: ["Monthly self-injection", "~85% TTR reduction", "Good tolerability"],
      competitiveRisks: ["Vutrisiran quarterly dosing", "Multiple competitors"],
      marketPositioning: "Monthly self-injectable option for ATTR with comprehensive knockdown."
    },
    retrospectivePhases: [
      { phase: "Phase 3 NEURO-TTRansform", date: "Q4 2022", outcome: 'success', keyData: ["Met primary endpoint", "Superior to placebo"], scoreAtTime: 78, rationale: "Positive PN data", dataAvailableAtTime: ["NEURO results"] },
      { phase: "FDA Approval (ATTR-PN)", date: "Dec 2023", outcome: 'success', keyData: ["Approved for polyneuropathy", "Monthly dosing"], scoreAtTime: 92, rationale: "Initial approval", dataAvailableAtTime: ["Approval data"] },
      { phase: "Phase 3 CARDIO-TTRansform", date: "Q4 2024", outcome: 'pending', keyData: ["CV outcomes trial ongoing", "ATTR-CM expansion"], scoreAtTime: 88, rationale: "Label expansion progressing", dataAvailableAtTime: ["Trial updates"] }
    ]
  },

  // 14. Finerenone - Nonsteroidal MRA
  {
    id: "FINE-01",
    name: "Finerenone (Kerendia)",
    trialName: "FIDELIO/FIGARO",
    phase: "Approved/Expansion",
    indication: "CKD in Type 2 Diabetes / Heart Failure",
    therapeuticArea: "Cardiovascular",
    company: "Bayer",
    companyTrackRecord: 'average',
    nctId: "NCT02540993",
    clinicalTrialsSearchTerm: "finerenone",
    scores: calculateProbabilityScores("Approved", "Heart Failure", "Cardiovascular"),
    marketData: generateMarketProjections("Finerenone", "Approved", "Heart Failure", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Nonsteroidal mineralocorticoid receptor antagonist (MRA)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "First nonsteroidal MRA with CV and renal benefits in diabetic CKD",
      discovery: "Bayer",
      development: "Bayer",
    },
    patents: [
      { patentNumber: "US8,889,698", title: "Nonsteroidal MRA compounds", expirationDate: "2032", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (cardiorenal market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Spironolactone/Eplerenone", company: "Generic", phase: "Approved", mechanism: "Steroidal MRA", keyDifferentiator: "Low cost", efficacy: "HF benefit proven", threat: 'medium' },
        { name: "SGLT2 inhibitors", company: "Multiple", phase: "Approved", mechanism: "SGLT2 inhibition", keyDifferentiator: "Broad cardiorenal benefits", efficacy: "CV + renal benefits", threat: 'high' },
      ],
      competitiveAdvantages: ["Nonsteroidal (less hyperkalemia)", "Complementary to SGLT2i", "CV + renal benefits"],
      competitiveRisks: ["SGLT2i competition", "Spironolactone cost advantage"],
      marketPositioning: "First nonsteroidal MRA with proven cardiorenal benefits."
    },
    retrospectivePhases: [
      { phase: "Phase 3 FIDELIO-DKD", date: "Q4 2020", outcome: 'success', keyData: ["18% reduction in kidney composite", "CV benefit signal"], scoreAtTime: 78, rationale: "Renal benefit proven", dataAvailableAtTime: ["FIDELIO results"] },
      { phase: "Phase 3 FIGARO-DKD", date: "Q3 2021", outcome: 'success', keyData: ["13% reduction in CV composite", "HF hospitalization reduced"], scoreAtTime: 85, rationale: "CV benefit confirmed", dataAvailableAtTime: ["FIGARO results"] },
      { phase: "FDA Approval", date: "Jul 2021", outcome: 'success', keyData: ["Approved for CKD in T2D", "Fast uptake"], scoreAtTime: 92, rationale: "Commercial success", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 15. Dapagliflozin - SGLT2i for HF
  {
    id: "DAPA-01",
    name: "Dapagliflozin (Farxiga)",
    trialName: "DAPA-HF/DELIVER",
    phase: "Approved/Expansion",
    indication: "Heart Failure (HFrEF & HFpEF)",
    therapeuticArea: "Cardiovascular",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT03036124",
    clinicalTrialsSearchTerm: "dapagliflozin heart failure",
    scores: calculateProbabilityScores("Approved", "Heart Failure", "Cardiovascular"),
    marketData: generateMarketProjections("Dapagliflozin", "Approved", "Heart Failure", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "SGLT2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Broad heart failure indication across ejection fraction spectrum",
      discovery: "Bristol-Myers Squibb",
      license: "AstraZeneca partnership",
      development: "AstraZeneca",
    },
    patents: [
      { patentNumber: "US6,515,117", title: "SGLT2 inhibitor compounds", expirationDate: "2020 (expired)", type: 'composition', status: 'expired' },
      { patentNumber: "US8,361,972", title: "Heart failure treatment methods", expirationDate: "2029", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (HF market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Empagliflozin (Jardiance)", company: "Boehringer/Lilly", phase: "Approved", mechanism: "SGLT2i", keyDifferentiator: "First HF indication", efficacy: "Similar to dapagliflozin", threat: 'high' },
        { name: "Sotagliflozin", company: "Lexicon", phase: "Approved", mechanism: "Dual SGLT1/2i", keyDifferentiator: "Dual inhibition", efficacy: "Broad benefits", threat: 'medium' },
      ],
      competitiveAdvantages: ["Full HF spectrum indication", "Renal benefits", "Strong outcomes data"],
      competitiveRisks: ["Empagliflozin competition", "Patent expiration approaching"],
      marketPositioning: "Leading SGLT2i with comprehensive cardiorenal indications."
    },
    retrospectivePhases: [
      { phase: "Phase 3 DAPA-HF", date: "Q3 2019", outcome: 'success', keyData: ["26% reduction in CV death/HF hospitalization", "Benefit regardless of diabetes"], scoreAtTime: 88, rationale: "Transformative HFrEF data", dataAvailableAtTime: ["DAPA-HF results"] },
      { phase: "HFrEF Approval", date: "May 2020", outcome: 'success', keyData: ["First HFrEF approval", "Paradigm shift"], scoreAtTime: 95, rationale: "Landmark approval", dataAvailableAtTime: ["Approval data"] },
      { phase: "Phase 3 DELIVER", date: "Q3 2022", outcome: 'success', keyData: ["18% reduction in HFpEF composite", "Full HF spectrum"], scoreAtTime: 98, rationale: "HFpEF breakthrough", dataAvailableAtTime: ["DELIVER results"] }
    ]
  },

  // 16. Lorundrostat - Aldosterone synthase inhibitor
  {
    id: "LORU-01",
    name: "Lorundrostat (MK-0541)",
    trialName: "TARGET-HTN",
    phase: "Phase II",
    indication: "Uncontrolled Hypertension",
    therapeuticArea: "Cardiovascular",
    company: "Merck (via Mineralys)",
    companyTrackRecord: 'fast',
    nctId: "NCT05182840",
    clinicalTrialsSearchTerm: "lorundrostat",
    scores: calculateProbabilityScores("Phase II", "Hypertension", "Cardiovascular"),
    marketData: generateMarketProjections("Lorundrostat", "Phase II", "Hypertension", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Highly selective aldosterone synthase inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Selective aldosterone reduction in patients with elevated PA",
      discovery: "Mineralys Therapeutics",
      license: "Merck acquisition ($2.6B, 2024)",
      development: "Merck",
    },
    patents: [
      { patentNumber: "US11,142,534", title: "Aldosterone synthase inhibitors", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (hypertension market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Baxdrostat", company: "AstraZeneca", phase: "Phase III", mechanism: "ASI", keyDifferentiator: "Further ahead", efficacy: "~20 mmHg SBP", threat: 'high' },
        { name: "Aprocitentan", company: "Janssen", phase: "Approved", mechanism: "ERA", keyDifferentiator: "First approved for resistant HTN", efficacy: "3.8 mmHg SBP", threat: 'medium' },
      ],
      competitiveAdvantages: ["Biomarker-guided approach", "Merck backing", "Selective for PA-elevated patients"],
      competitiveRisks: ["Behind baxdrostat", "Phase 2 stage"],
      marketPositioning: "Precision medicine approach to aldosterone-mediated hypertension."
    },
    retrospectivePhases: [
      { phase: "Phase 2 TARGET-HTN", date: "Q4 2023", outcome: 'success', keyData: ["~14 mmHg SBP reduction", "Dose-dependent response"], scoreAtTime: 52, rationale: "Proof of concept", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Merck Acquisition", date: "Q3 2024", outcome: 'success', keyData: ["$2.6B acquisition", "Accelerated development"], scoreAtTime: 58, rationale: "Major pharma backing", dataAvailableAtTime: ["Deal announcement"] }
    ]
  },

  // 17. Solbinsiran - siRNA for PCSK9
  {
    id: "SOLB-01",
    name: "Solbinsiran (ARO-PCSK9)",
    trialName: "GATEWAY",
    phase: "Phase II",
    indication: "Hypercholesterolemia",
    therapeuticArea: "Cardiovascular",
    company: "Arrowhead Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT05089084",
    clinicalTrialsSearchTerm: "solbinsiran",
    scores: calculateProbabilityScores("Phase II", "Hyperlipidemia", "Cardiovascular"),
    marketData: generateMarketProjections("Solbinsiran", "Phase II", "Hyperlipidemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA targeting PCSK9",
      administration: "Quarterly subcutaneous injection",
      keyAdvantage: "Quarterly dosing with ~70% LDL-C reduction",
      discovery: "Arrowhead Pharmaceuticals",
      development: "Arrowhead Pharmaceuticals",
    },
    patents: [
      { patentNumber: "US11,299,736", title: "siRNA targeting PCSK9", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (PCSK9 market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Inclisiran", company: "Novartis", phase: "Approved", mechanism: "siRNA", keyDifferentiator: "Approved twice-yearly", efficacy: "~50% LDL-C reduction", threat: 'high' },
        { name: "Repatha/Praluent", company: "Amgen/Sanofi", phase: "Approved", mechanism: "mAb", keyDifferentiator: "Outcomes data", efficacy: "~60% LDL-C reduction", threat: 'medium' },
      ],
      competitiveAdvantages: ["Quarterly vs twice-yearly", "Higher LDL reduction than inclisiran", "TRiM platform"],
      competitiveRisks: ["Inclisiran well-established", "No outcomes data"],
      marketPositioning: "Next-generation PCSK9 siRNA with potential best-in-class LDL lowering."
    },
    retrospectivePhases: [
      { phase: "Phase 2 GATEWAY", date: "Q2 2024", outcome: 'pending', keyData: ["~70% LDL-C reduction", "Quarterly dosing validated"], scoreAtTime: 48, rationale: "Early-stage development", dataAvailableAtTime: ["Phase 2 interim"] }
    ]
  },

  // 18. Milvexian - Factor XIa inhibitor
  {
    id: "MILV-01",
    name: "Milvexian (BMS-986177)",
    trialName: "LIBREXIA",
    phase: "Phase III",
    indication: "Stroke Prevention / Atrial Fibrillation",
    therapeuticArea: "Cardiovascular",
    company: "Bristol-Myers Squibb/Janssen",
    companyTrackRecord: 'fast',
    nctId: "NCT05702034",
    clinicalTrialsSearchTerm: "milvexian",
    scores: calculateProbabilityScores("Phase III", "Stroke Prevention", "Cardiovascular"),
    marketData: generateMarketProjections("Milvexian", "Phase III", "Stroke Prevention", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Factor XIa inhibitor",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Antithrombotic efficacy with potentially lower bleeding risk",
      discovery: "Bristol-Myers Squibb",
      license: "BMS/Janssen collaboration",
      development: "BMS/Janssen",
    },
    patents: [
      { patentNumber: "US10,676,486", title: "Factor XIa inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (anticoagulant market)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Eliquis (apixaban)", company: "BMS/Pfizer", phase: "Approved", mechanism: "Factor Xa inhibitor", keyDifferentiator: "Market leader", efficacy: "Superior to warfarin", threat: 'medium' },
        { name: "Asundexian", company: "Bayer", phase: "Discontinued", mechanism: "Factor XIa inhibitor", keyDifferentiator: "Discontinued 2024", efficacy: "N/A", threat: 'low' },
      ],
      competitiveAdvantages: ["Potentially safer bleeding profile", "Novel FXIa target", "Large Phase 3 program"],
      competitiveRisks: ["Asundexian failure raises class concerns", "DOACs well-established"],
      marketPositioning: "First-in-class Factor XIa inhibitor with improved safety profile."
    },
    retrospectivePhases: [
      { phase: "Phase 2 AXIOMATIC-TKR", date: "Q2 2021", outcome: 'success', keyData: ["Dose-dependent VTE prevention", "Lower bleeding vs enoxaparin"], scoreAtTime: 55, rationale: "Proof of concept", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 LIBREXIA-AF", date: "Q4 2024", outcome: 'pending', keyData: ["~17,000 patient AF trial", "Stroke prevention endpoint"], scoreAtTime: 52, rationale: "Pivotal trial underway", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 19. Volratomig - Bispecific for ACS
  {
    id: "VOLR-01",
    name: "Volratomig",
    trialName: "PATROL",
    phase: "Phase II",
    indication: "Acute Coronary Syndrome",
    therapeuticArea: "Cardiovascular",
    company: "Chinook/Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT05169450",
    clinicalTrialsSearchTerm: "volratomig",
    scores: calculateProbabilityScores("Phase II", "Acute Coronary Syndrome", "Cardiovascular"),
    marketData: generateMarketProjections("Volratomig", "Phase II", "Acute Coronary Syndrome", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Bispecific antibody targeting PCSK9 and TfR1",
      administration: "Monthly subcutaneous injection",
      keyAdvantage: "Brain-penetrant PCSK9 inhibition for potential cognitive protection",
      discovery: "Novartis",
      development: "Novartis",
    },
    patents: [
      { patentNumber: "US11,459,389", title: "Bispecific PCSK9/TfR1 antibodies", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (CV secondary prevention)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Repatha", company: "Amgen", phase: "Approved", mechanism: "PCSK9 mAb", keyDifferentiator: "CV outcomes", efficacy: "15% CV risk reduction", threat: 'high' },
        { name: "Inclisiran", company: "Novartis", phase: "Approved", mechanism: "siRNA", keyDifferentiator: "Twice-yearly", efficacy: "~50% LDL-C reduction", threat: 'medium' },
      ],
      competitiveAdvantages: ["Brain penetrant", "Potential cognitive benefit", "Novel bispecific"],
      competitiveRisks: ["Early stage", "Unproven cognitive hypothesis"],
      marketPositioning: "First brain-penetrant PCSK9 inhibitor with potential neuroprotection."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2024", outcome: 'pending', keyData: ["CNS penetration demonstrated", "LDL-C lowering confirmed"], scoreAtTime: 42, rationale: "Early development", dataAvailableAtTime: ["Phase 2 interim"] }
    ]
  },

  // 20. Elobixibat - Bile acid transport inhibitor for HF
  {
    id: "ELOB-01",
    name: "Elobixibat",
    trialName: "ELBA-HF",
    phase: "Phase II",
    indication: "Heart Failure with Congestion",
    therapeuticArea: "Cardiovascular",
    company: "EA Pharma/Alfresa",
    companyTrackRecord: 'slow',
    nctId: "NCT04855383",
    clinicalTrialsSearchTerm: "elobixibat heart failure",
    scores: calculateProbabilityScores("Phase II", "Heart Failure", "Cardiovascular"),
    marketData: generateMarketProjections("Elobixibat", "Phase II", "Heart Failure", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Ileal bile acid transporter (IBAT) inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Novel approach to decongestion in heart failure",
      discovery: "Alfresa Pharma",
      license: "EA Pharma (Japan rights)",
      development: "EA Pharma",
    },
    patents: [
      { patentNumber: "US8,575,166", title: "IBAT inhibitor compounds", expirationDate: "2029", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (HF market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Loop diuretics", company: "Generic", phase: "Approved", mechanism: "Diuretic", keyDifferentiator: "Standard of care", efficacy: "Effective decongestion", threat: 'medium' },
        { name: "SGLT2 inhibitors", company: "Multiple", phase: "Approved", mechanism: "SGLT2i", keyDifferentiator: "CV outcomes benefit", efficacy: "Mortality reduction", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel mechanism", "Intestinal fluid secretion", "Diuretic-sparing potential"],
      competitiveRisks: ["Early stage", "Unproven in HF", "Japan-focused"],
      marketPositioning: "Novel approach to decongestion via bile acid transport inhibition."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ELBA-HF", date: "Q4 2024", outcome: 'pending', keyData: ["Pilot study ongoing", "Decongestion endpoints"], scoreAtTime: 32, rationale: "Early exploratory stage", dataAvailableAtTime: ["Phase 2 design"] }
    ]
  }
];
