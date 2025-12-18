// 20 Neurology/CNS Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const neurologyMolecules: MoleculeProfile[] = [
  // 1. Donanemab - Anti-amyloid for Alzheimer's
  {
    id: "DONA-01",
    name: "Donanemab (Kisunla)",
    trialName: "TRAILBLAZER-ALZ 2",
    phase: "Approved",
    indication: "Alzheimer's Disease",
    therapeuticArea: "Neurology/CNS",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT04437511",
    clinicalTrialsSearchTerm: "donanemab",
    scores: calculateProbabilityScores("Approved", "Alzheimer's Disease", "Neurology/CNS"),
    marketData: generateMarketProjections("Donanemab", "Approved", "Alzheimer's Disease", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Monoclonal antibody targeting N3pG amyloid-beta",
      administration: "IV infusion every 4 weeks",
      keyAdvantage: "Amyloid plaque clearance allows treatment discontinuation",
      discovery: "Eli Lilly",
      development: "Eli Lilly",
      additionalInfo: [
        "First anti-amyloid with treatment discontinuation endpoint",
        "35% slowing of cognitive decline",
        "Complete plaque clearance in majority of patients"
      ]
    },
    patents: [
      { patentNumber: "US10,174,112", title: "Anti-N3pG amyloid beta antibodies", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US11,142,566", title: "Methods of treating Alzheimer's disease", expirationDate: "2038", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Alzheimer's market)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Lecanemab (Leqembi)", company: "Eisai/Biogen", phase: "Approved", mechanism: "Anti-amyloid (protofibrils)", keyDifferentiator: "First-to-market advantage", efficacy: "27% slowing", threat: 'high' },
        { name: "Aducanumab (Aduhelm)", company: "Biogen", phase: "Withdrawn", mechanism: "Anti-amyloid", keyDifferentiator: "Controversial approval", efficacy: "22% slowing", threat: 'low' },
      ],
      competitiveAdvantages: ["Higher plaque clearance", "Potential for treatment discontinuation", "35% clinical benefit"],
      competitiveRisks: ["ARIA side effects", "High cost", "Infusion requirements"],
      marketPositioning: "Best-in-class anti-amyloid with potential for finite treatment duration."
    },
    retrospectivePhases: [
      { phase: "Phase 2 TRAILBLAZER", date: "Q1 2021", outcome: 'success', keyData: ["32% slowing", "Plaque clearance"], scoreAtTime: 65, rationale: "Promising early data", dataAvailableAtTime: ["TRAILBLAZER results"] },
      { phase: "Phase 3 TRAILBLAZER-ALZ 2", date: "Q2 2023", outcome: 'success', keyData: ["35% slowing", "Complete clearance in 68%"], scoreAtTime: 82, rationale: "Strong pivotal results", dataAvailableAtTime: ["TRAILBLAZER-ALZ 2 results"] },
      { phase: "FDA Approval", date: "Jul 2024", outcome: 'success', keyData: ["Full FDA approval", "Kisunla brand"], scoreAtTime: 95, rationale: "Regulatory success", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 2. Lecanemab - Anti-amyloid for Alzheimer's
  {
    id: "LECA-01",
    name: "Lecanemab (Leqembi)",
    trialName: "CLARITY AD",
    phase: "Approved",
    indication: "Alzheimer's Disease",
    therapeuticArea: "Neurology/CNS",
    company: "Eisai/Biogen",
    companyTrackRecord: 'average',
    nctId: "NCT03887455",
    clinicalTrialsSearchTerm: "lecanemab",
    scores: calculateProbabilityScores("Approved", "Alzheimer's Disease", "Neurology/CNS"),
    marketData: generateMarketProjections("Lecanemab", "Approved", "Alzheimer's Disease", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Humanized monoclonal antibody targeting amyloid-beta protofibrils",
      administration: "IV infusion every 2 weeks",
      keyAdvantage: "First disease-modifying Alzheimer's therapy with clear clinical benefit",
      discovery: "BioArctic",
      license: "Eisai (global rights)",
      development: "Eisai/Biogen partnership",
    },
    patents: [
      { patentNumber: "US8,906,367", title: "Humanized anti-amyloid antibodies", expirationDate: "2032", type: 'composition', status: 'active' },
      { patentNumber: "US10,519,223", title: "Methods of using anti-protofibril antibodies", expirationDate: "2035", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Alzheimer's market)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Donanemab (Kisunla)", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-N3pG amyloid", keyDifferentiator: "Higher efficacy, treatment discontinuation", efficacy: "35% slowing", threat: 'high' },
        { name: "Remternetug", company: "Eli Lilly", phase: "Phase III", mechanism: "Anti-amyloid", keyDifferentiator: "Subcutaneous formulation", efficacy: "TBD", threat: 'medium' },
      ],
      competitiveAdvantages: ["First-to-market", "Full FDA approval", "Growing physician experience"],
      competitiveRisks: ["ARIA monitoring requirements", "Biweekly infusions", "Competition from donanemab"],
      marketPositioning: "First approved disease-modifying Alzheimer's therapy with proven clinical benefit."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2019", outcome: 'success', keyData: ["Dose-dependent plaque reduction", "Clinical signals"], scoreAtTime: 58, rationale: "Early promise", dataAvailableAtTime: ["Phase 2b results"] },
      { phase: "Phase 3 CLARITY AD", date: "Q4 2022", outcome: 'success', keyData: ["27% slowing of decline", "Amyloid clearance"], scoreAtTime: 78, rationale: "Met primary endpoint", dataAvailableAtTime: ["CLARITY AD results"] },
      { phase: "FDA Full Approval", date: "Jul 2023", outcome: 'success', keyData: ["Traditional approval", "Medicare coverage"], scoreAtTime: 92, rationale: "Landmark approval", dataAvailableAtTime: ["Commercial expansion"] }
    ]
  },

  // 3. Brexpiprazole - Adjunct for Alzheimer's agitation
  {
    id: "BREX-01",
    name: "Brexpiprazole (Rexulti)",
    trialName: "SERENE",
    phase: "Approved",
    indication: "Alzheimer's-related Agitation",
    therapeuticArea: "Neurology/CNS",
    company: "Otsuka/Lundbeck",
    companyTrackRecord: 'average',
    nctId: "NCT03548584",
    clinicalTrialsSearchTerm: "brexpiprazole agitation",
    scores: calculateProbabilityScores("Approved", "Alzheimer's Agitation", "Neurology/CNS"),
    marketData: generateMarketProjections("Brexpiprazole", "Approved", "Alzheimer's Agitation", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Atypical antipsychotic (D2/serotonin modulator)",
      administration: "Oral tablet once daily",
      keyAdvantage: "First FDA-approved treatment for Alzheimer's agitation",
      discovery: "Otsuka",
      development: "Otsuka/Lundbeck",
    },
    patents: [
      { patentNumber: "US8,329,699", title: "Quinolinone derivatives", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Alzheimer's behavioral symptoms)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Off-label antipsychotics", company: "Multiple", phase: "Approved (off-label)", mechanism: "Various", keyDifferentiator: "Existing use patterns", efficacy: "Variable", threat: 'medium' },
        { name: "AXS-05", company: "Axsome", phase: "Phase III", mechanism: "NMDA/sigma-1", keyDifferentiator: "Non-antipsychotic approach", efficacy: "TBD", threat: 'medium' },
      ],
      competitiveAdvantages: ["Only FDA-approved option", "Familiar drug class", "Oral administration"],
      competitiveRisks: ["Black box warning for elderly", "Metabolic side effects", "Competition from generics"],
      marketPositioning: "First and only approved treatment for agitation in Alzheimer's disease."
    },
    retrospectivePhases: [
      { phase: "Phase 3 Study 1", date: "Q2 2020", outcome: 'partial', keyData: ["Numerical improvement", "Missed primary"], scoreAtTime: 42, rationale: "Mixed early results", dataAvailableAtTime: ["Study 1 results"] },
      { phase: "Phase 3 SERENE", date: "Q3 2022", outcome: 'success', keyData: ["Significant CMAI reduction", "Consistent effect"], scoreAtTime: 72, rationale: "Strong pivotal results", dataAvailableAtTime: ["SERENE results"] },
      { phase: "FDA Approval", date: "May 2023", outcome: 'success', keyData: ["First-in-indication approval", "Label expansion"], scoreAtTime: 88, rationale: "New market created", dataAvailableAtTime: ["Label update"] }
    ]
  },

  // 4. Zuranolone - GABA modulator for depression
  {
    id: "ZURA-01",
    name: "Zuranolone (Zurzuvae)",
    trialName: "WATERFALL",
    phase: "Approved",
    indication: "Postpartum Depression",
    therapeuticArea: "Neurology/CNS",
    company: "Sage Therapeutics/Biogen",
    companyTrackRecord: 'average',
    nctId: "NCT04442503",
    clinicalTrialsSearchTerm: "zuranolone",
    scores: calculateProbabilityScores("Approved", "Postpartum Depression", "Neurology/CNS"),
    marketData: generateMarketProjections("Zuranolone", "Approved", "Postpartum Depression", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Neuroactive steroid GABA-A receptor positive allosteric modulator",
      administration: "Oral capsule once daily for 14 days",
      keyAdvantage: "Rapid-acting oral antidepressant with 14-day treatment course",
      discovery: "Sage Therapeutics",
      license: "Biogen collaboration",
      development: "Sage/Biogen",
    },
    patents: [
      { patentNumber: "US10,246,482", title: "Neuroactive steroid compositions", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,234,998", title: "Methods of treating depression", expirationDate: "2039", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.5B (postpartum depression)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Brexanolone (Zulresso)", company: "Sage", phase: "Approved", mechanism: "GABA modulator IV", keyDifferentiator: "IV only, REMS restricted", efficacy: "Rapid onset", threat: 'low' },
        { name: "SSRIs/SNRIs", company: "Multiple", phase: "Approved", mechanism: "Monoamine modulators", keyDifferentiator: "Standard of care", efficacy: "4-6 weeks onset", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral formulation", "14-day treatment course", "Rapid onset (3 days)"],
      competitiveRisks: ["PPD-only approval initially", "Cost concerns", "Sedation warnings"],
      marketPositioning: "First oral rapid-acting antidepressant for postpartum depression."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ROBIN", date: "Q2 2021", outcome: 'success', keyData: ["Met PPD endpoint", "Day 15 improvement"], scoreAtTime: 65, rationale: "PPD efficacy confirmed", dataAvailableAtTime: ["ROBIN results"] },
      { phase: "MDD CRL", date: "Aug 2023", outcome: 'setback', keyData: ["MDD rejection", "PPD approval"], scoreAtTime: 55, rationale: "Partial regulatory success", dataAvailableAtTime: ["FDA decision"] },
      { phase: "FDA PPD Approval", date: "Aug 2023", outcome: 'success', keyData: ["Zurzuvae approved", "PPD indication"], scoreAtTime: 78, rationale: "First oral rapid antidepressant", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 5. Troriluzole - Glutamate modulator for OCD
  {
    id: "TROR-01",
    name: "Troriluzole (BHV-4157)",
    trialName: "T-OCD",
    phase: "Phase III",
    indication: "Obsessive-Compulsive Disorder",
    therapeuticArea: "Neurology/CNS",
    company: "Biohaven Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT03299166",
    clinicalTrialsSearchTerm: "troriluzole",
    scores: calculateProbabilityScores("Phase III", "OCD", "Neurology/CNS"),
    marketData: generateMarketProjections("Troriluzole", "Phase III", "OCD", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Glutamate modulating prodrug of riluzole",
      administration: "Oral tablet once daily",
      keyAdvantage: "Novel glutamate mechanism for treatment-resistant OCD",
      discovery: "Biohaven Pharmaceuticals",
      development: "Biohaven (now part of Pfizer)",
    },
    patents: [
      { patentNumber: "US9,636,351", title: "Prodrugs of riluzole", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B (OCD treatment)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "SSRIs (high-dose)", company: "Multiple", phase: "Approved", mechanism: "Serotonin reuptake", keyDifferentiator: "Standard first-line", efficacy: "~50% response", threat: 'medium' },
        { name: "Pimavanserin", company: "Acadia", phase: "Phase II", mechanism: "5-HT2A inverse agonist", keyDifferentiator: "Novel mechanism", efficacy: "TBD", threat: 'low' },
      ],
      competitiveAdvantages: ["First glutamate modulator for OCD", "Novel mechanism", "Adjunct to SSRIs"],
      competitiveRisks: ["Unmet Phase 3 expectations", "Crowded adjunct space", "Generic riluzole availability"],
      marketPositioning: "First glutamate-modulating therapy for obsessive-compulsive disorder."
    },
    retrospectivePhases: [
      { phase: "Phase 2/3", date: "Q2 2020", outcome: 'partial', keyData: ["Numerical improvement", "Mixed results"], scoreAtTime: 45, rationale: "Inconsistent efficacy", dataAvailableAtTime: ["Phase 2/3 results"] },
      { phase: "Phase 3 T-OCD", date: "Q4 2024", outcome: 'pending', keyData: ["Ongoing enrollment", "Refined population"], scoreAtTime: 52, rationale: "Pivotal trial in progress", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 6. Pimavanserin - 5-HT2A inverse agonist for DLB psychosis
  {
    id: "PIMA-01",
    name: "Pimavanserin (Nuplazid)",
    trialName: "HARMONY",
    phase: "Phase III",
    indication: "Dementia-Related Psychosis",
    therapeuticArea: "Neurology/CNS",
    company: "Acadia Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT03325556",
    clinicalTrialsSearchTerm: "pimavanserin dementia",
    scores: calculateProbabilityScores("Phase III", "Dementia Psychosis", "Neurology/CNS"),
    marketData: generateMarketProjections("Pimavanserin", "Phase III", "Dementia Psychosis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective serotonin 5-HT2A receptor inverse agonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Only FDA-approved treatment for Parkinson's psychosis, expanding to broader dementia",
      discovery: "Acadia Pharmaceuticals",
      development: "Acadia Pharmaceuticals",
    },
    patents: [
      { patentNumber: "US7,601,740", title: "5-HT2A receptor antagonists", expirationDate: "2027", type: 'composition', status: 'active' },
      { patentNumber: "US10,117,877", title: "Methods for treating psychosis", expirationDate: "2032", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B (dementia-related psychosis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Off-label antipsychotics", company: "Multiple", phase: "Approved (off-label)", mechanism: "D2 antagonism", keyDifferentiator: "Existing use but safety concerns", efficacy: "Variable", threat: 'medium' },
        { name: "Brexpiprazole", company: "Otsuka", phase: "Approved (agitation)", mechanism: "D2/5-HT modulator", keyDifferentiator: "Approved for agitation", efficacy: "Agitation focus", threat: 'medium' },
      ],
      competitiveAdvantages: ["No D2 antagonism", "Approved for PD psychosis", "Favorable safety profile"],
      competitiveRisks: ["CRL for broad DRP indication", "Patent expiry approaching", "Market access challenges"],
      marketPositioning: "Only therapy specifically designed for psychosis in neurological disease."
    },
    retrospectivePhases: [
      { phase: "PDP Approval", date: "Apr 2016", outcome: 'success', keyData: ["First PD psychosis drug", "Breakthrough approval"], scoreAtTime: 88, rationale: "Novel indication success", dataAvailableAtTime: ["PDP label"] },
      { phase: "Phase 3 HARMONY (DRP)", date: "Q1 2021", outcome: 'success', keyData: ["Met primary endpoint", "Broad dementia population"], scoreAtTime: 72, rationale: "Expansion potential", dataAvailableAtTime: ["HARMONY results"] },
      { phase: "FDA CRL (DRP)", date: "Apr 2022", outcome: 'setback', keyData: ["Additional data needed", "Narrow approval path"], scoreAtTime: 55, rationale: "Regulatory hurdle", dataAvailableAtTime: ["CRL details"] }
    ]
  },

  // 7. Anavex 2-73 - Sigma-1 agonist for Alzheimer's
  {
    id: "ANAV-01",
    name: "Anavex 2-73 (Blarcamesine)",
    trialName: "ATTENTION-AD",
    phase: "Phase III",
    indication: "Alzheimer's Disease",
    therapeuticArea: "Neurology/CNS",
    company: "Anavex Life Sciences",
    companyTrackRecord: 'slow',
    nctId: "NCT04314934",
    clinicalTrialsSearchTerm: "blarcamesine",
    scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology/CNS"),
    marketData: generateMarketProjections("Anavex 2-73", "Phase III", "Alzheimer's Disease", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Sigma-1 receptor agonist",
      administration: "Oral capsule once daily",
      keyAdvantage: "Oral, disease-modifying mechanism distinct from anti-amyloid",
      discovery: "Anavex Life Sciences",
      development: "Anavex Life Sciences",
    },
    patents: [
      { patentNumber: "US8,598,135", title: "Sigma receptor ligands", expirationDate: "2032", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Alzheimer's market)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Donanemab", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-amyloid", keyDifferentiator: "Best efficacy", efficacy: "35% slowing", threat: 'high' },
        { name: "Lecanemab", company: "Eisai/Biogen", phase: "Approved", mechanism: "Anti-amyloid", keyDifferentiator: "First-to-market", efficacy: "27% slowing", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral administration", "No ARIA risk", "Novel non-amyloid mechanism"],
      competitiveRisks: ["Unproven mechanism", "Small company resources", "Anti-amyloid dominance"],
      marketPositioning: "Oral alternative to anti-amyloid infusions with distinct mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 2a", date: "Q4 2019", outcome: 'success', keyData: ["Cognitive stabilization", "Biomarker signals"], scoreAtTime: 42, rationale: "Early promise", dataAvailableAtTime: ["Phase 2a results"] },
      { phase: "Phase 2b/3", date: "Q2 2023", outcome: 'partial', keyData: ["Mixed efficacy signals", "Subgroup benefits"], scoreAtTime: 38, rationale: "Uncertain trajectory", dataAvailableAtTime: ["Interim results"] },
      { phase: "Phase 3 ATTENTION-AD", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trial ongoing", "Refined endpoints"], scoreAtTime: 35, rationale: "Critical readout pending", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 8. SAGE-718 - NMDA modulator for cognition
  {
    id: "SAGE-01",
    name: "SAGE-718 (Dalzanemdor)",
    trialName: "LUMINARY",
    phase: "Phase II",
    indication: "Huntington's Disease Cognitive",
    therapeuticArea: "Neurology/CNS",
    company: "Sage Therapeutics/Biogen",
    companyTrackRecord: 'average',
    nctId: "NCT05107128",
    clinicalTrialsSearchTerm: "SAGE-718",
    scores: calculateProbabilityScores("Phase II", "Huntington's Disease", "Neurology/CNS"),
    marketData: generateMarketProjections("SAGE-718", "Phase II", "Huntington's Disease", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "NMDA receptor positive allosteric modulator",
      administration: "Oral capsule once daily",
      keyAdvantage: "First-in-class NMDA PAM targeting cognitive impairment",
      discovery: "Sage Therapeutics",
      license: "Biogen collaboration",
      development: "Sage/Biogen",
    },
    patents: [
      { patentNumber: "US11,213,546", title: "NMDA receptor modulators", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M (HD cognition)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Tetrabenazine", company: "Lundbeck", phase: "Approved", mechanism: "VMAT2 inhibitor", keyDifferentiator: "Movement focus", efficacy: "Chorea control", threat: 'low' },
        { name: "Pridopidine", company: "Prilenia", phase: "Phase III", mechanism: "Sigma-1 agonist", keyDifferentiator: "Functional outcomes", efficacy: "TBD", threat: 'medium' },
      ],
      competitiveAdvantages: ["Novel NMDA mechanism", "Cognitive focus", "Platform potential"],
      competitiveRisks: ["Early stage", "Difficult endpoint measures", "Small market"],
      marketPositioning: "First therapy specifically targeting cognitive decline in Huntington's disease."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2021", outcome: 'success', keyData: ["Well tolerated", "CNS penetration"], scoreAtTime: 35, rationale: "Safety established", dataAvailableAtTime: ["Phase 1 results"] },
      { phase: "Phase 2 LUMINARY", date: "Q4 2024", outcome: 'pending', keyData: ["HD cognitive trial ongoing", "Novel endpoints"], scoreAtTime: 38, rationale: "Proof-of-concept pending", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 9. Delandistrogene Moxeparvovec - Gene therapy for DMD
  {
    id: "DELA-01",
    name: "Delandistrogene Moxeparvovec (Elevidys)",
    trialName: "EMBARK",
    phase: "Approved",
    indication: "Duchenne Muscular Dystrophy",
    therapeuticArea: "Neurology/CNS",
    company: "Sarepta Therapeutics/Roche",
    companyTrackRecord: 'average',
    nctId: "NCT05096221",
    clinicalTrialsSearchTerm: "SRP-9001",
    scores: calculateProbabilityScores("Approved", "DMD", "Neurology/CNS"),
    marketData: generateMarketProjections("Elevidys", "Approved", "DMD", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAVrh74 gene therapy delivering micro-dystrophin",
      administration: "Single IV infusion",
      keyAdvantage: "One-time gene therapy producing functional dystrophin",
      discovery: "Nationwide Children's Hospital",
      license: "Sarepta Therapeutics",
      development: "Sarepta/Roche partnership",
    },
    patents: [
      { patentNumber: "US10,166,272", title: "Micro-dystrophin gene therapy", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US11,149,286", title: "AAV-mediated gene delivery methods", expirationDate: "2038", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B (DMD treatment)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Exon-skipping therapies", company: "Sarepta/NS Pharma", phase: "Approved", mechanism: "RNA modulation", keyDifferentiator: "Mutation-specific", efficacy: "Modest dystrophin", threat: 'medium' },
        { name: "Fordadistrogene", company: "Pfizer", phase: "Phase III", mechanism: "Gene therapy", keyDifferentiator: "AAV9 vector", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["First approved gene therapy for DMD", "One-time administration", "Robust dystrophin expression"],
      competitiveRisks: ["$3.2M price point", "Confirmatory trial needed", "Vector immunity limits retreatment"],
      marketPositioning: "First and only gene therapy approved for Duchenne muscular dystrophy."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q4 2020", outcome: 'success', keyData: ["Dystrophin expression", "Functional improvements"], scoreAtTime: 62, rationale: "Proof of concept", dataAvailableAtTime: ["Phase 1/2 results"] },
      { phase: "Accelerated Approval", date: "Jun 2023", outcome: 'success', keyData: ["FDA approval (4-5 year olds)", "Confirmatory required"], scoreAtTime: 75, rationale: "Historic gene therapy approval", dataAvailableAtTime: ["Initial launch"] },
      { phase: "Label Expansion", date: "Jun 2024", outcome: 'success', keyData: ["Ages 4+ ambulatory", "EMBARK confirmatory ongoing"], scoreAtTime: 82, rationale: "Broader patient access", dataAvailableAtTime: ["Expanded label"] }
    ]
  },

  // 10. Omaveloxolone - Nrf2 activator for Friedreich's Ataxia
  {
    id: "OMAV-01",
    name: "Omaveloxolone (Skyclarys)",
    trialName: "MOXIe",
    phase: "Approved",
    indication: "Friedreich's Ataxia",
    therapeuticArea: "Neurology/CNS",
    company: "Reata Pharmaceuticals (Biogen)",
    companyTrackRecord: 'average',
    nctId: "NCT02255435",
    clinicalTrialsSearchTerm: "omaveloxolone",
    scores: calculateProbabilityScores("Approved", "Friedreich's Ataxia", "Neurology/CNS"),
    marketData: generateMarketProjections("Omaveloxolone", "Approved", "Friedreich's Ataxia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Nrf2 activator",
      administration: "Oral capsule once daily",
      keyAdvantage: "First FDA-approved treatment for Friedreich's ataxia",
      discovery: "Reata Pharmaceuticals",
      license: "Biogen acquisition (2023)",
      development: "Reata/Biogen",
    },
    patents: [
      { patentNumber: "US8,921,340", title: "Synthetic triterpenoids", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M (FA treatment)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "No approved therapies prior", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Unmet need", efficacy: "N/A", threat: 'low' },
        { name: "FA gene therapy", company: "Multiple", phase: "Preclinical", mechanism: "Gene replacement", keyDifferentiator: "Curative potential", efficacy: "TBD", threat: 'low' },
      ],
      competitiveAdvantages: ["Only approved therapy", "Orphan drug exclusivity", "Established efficacy"],
      competitiveRisks: ["Small patient population", "Long-term data needed", "Generic risk post-exclusivity"],
      marketPositioning: "First and only approved disease-modifying treatment for Friedreich's ataxia."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MOXIe Part 1", date: "Q2 2018", outcome: 'success', keyData: ["mFARS improvement", "Dose-response"], scoreAtTime: 55, rationale: "Promising early signal", dataAvailableAtTime: ["Part 1 results"] },
      { phase: "Phase 2 MOXIe Part 2", date: "Q4 2020", outcome: 'success', keyData: ["2.4 point mFARS improvement", "Durable benefit"], scoreAtTime: 72, rationale: "Pivotal-quality data", dataAvailableAtTime: ["Part 2 results"] },
      { phase: "FDA Approval", date: "Feb 2023", outcome: 'success', keyData: ["Historic first approval", "Skyclarys brand"], scoreAtTime: 95, rationale: "Transformative for FA community", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 11. Tofersen - ASO for SOD1 ALS
  {
    id: "TOFE-01",
    name: "Tofersen (Qalsody)",
    trialName: "VALOR",
    phase: "Approved",
    indication: "SOD1 ALS",
    therapeuticArea: "Neurology/CNS",
    company: "Biogen",
    companyTrackRecord: 'fast',
    nctId: "NCT02623699",
    clinicalTrialsSearchTerm: "tofersen",
    scores: calculateProbabilityScores("Approved", "ALS", "Neurology/CNS"),
    marketData: generateMarketProjections("Tofersen", "Approved", "ALS", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Antisense oligonucleotide (ASO) targeting SOD1",
      administration: "Intrathecal injection monthly",
      keyAdvantage: "First genetic treatment for any form of ALS",
      discovery: "Ionis Pharmaceuticals",
      license: "Biogen collaboration",
      development: "Biogen",
    },
    patents: [
      { patentNumber: "US9,725,715", title: "SOD1 antisense oligonucleotides", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B (ALS treatment)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Riluzole", company: "Generic", phase: "Approved", mechanism: "Glutamate modulation", keyDifferentiator: "Standard of care", efficacy: "Modest survival benefit", threat: 'low' },
        { name: "Edaravone", company: "Mitsubishi Tanabe", phase: "Approved", mechanism: "Antioxidant", keyDifferentiator: "Function preservation", efficacy: "Slows decline", threat: 'low' },
      ],
      competitiveAdvantages: ["First genetic ALS therapy", "SOD1 protein knockdown", "Biomarker-guided"],
      competitiveRisks: ["Small SOD1 population (~2%)", "Intrathecal administration", "Missed VALOR endpoint"],
      marketPositioning: "First precision medicine treatment for genetically-defined ALS."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2020", outcome: 'success', keyData: ["SOD1 reduction", "Neurofilament decrease"], scoreAtTime: 58, rationale: "Biomarker proof of concept", dataAvailableAtTime: ["Phase 1/2 results"] },
      { phase: "Phase 3 VALOR", date: "Q4 2021", outcome: 'partial', keyData: ["Missed primary (ALSFRS-R)", "Strong biomarker effect"], scoreAtTime: 45, rationale: "Mixed but promising signals", dataAvailableAtTime: ["VALOR results"] },
      { phase: "FDA Accelerated Approval", date: "Apr 2023", outcome: 'success', keyData: ["Approved on biomarker", "Confirmatory trial required"], scoreAtTime: 78, rationale: "Landmark precision medicine approval", dataAvailableAtTime: ["Qalsody launch"] }
    ]
  },

  // 12. Atidarsagene Autotemcel - Gene therapy for MLD
  {
    id: "ATID-01",
    name: "Atidarsagene Autotemcel (Lenmeldy)",
    trialName: "MLD Gene Therapy",
    phase: "Approved",
    indication: "Metachromatic Leukodystrophy",
    therapeuticArea: "Neurology/CNS",
    company: "Orchard Therapeutics (Kyowa Kirin)",
    companyTrackRecord: 'slow',
    nctId: "NCT01560182",
    clinicalTrialsSearchTerm: "atidarsagene",
    scores: calculateProbabilityScores("Approved", "MLD", "Neurology/CNS"),
    marketData: generateMarketProjections("Lenmeldy", "Approved", "MLD", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Ex vivo lentiviral gene therapy (ARSA gene)",
      administration: "One-time IV infusion of modified cells",
      keyAdvantage: "Curative potential for devastating pediatric disease",
      discovery: "San Raffaele-Telethon Institute",
      license: "Orchard Therapeutics",
      development: "Orchard/Kyowa Kirin",
    },
    patents: [
      { patentNumber: "US9,526,785", title: "Lentiviral vector compositions", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$200M (MLD treatment)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "HSCT", company: "Standard of care", phase: "Approved", mechanism: "Stem cell transplant", keyDifferentiator: "Limited efficacy in MLD", efficacy: "Variable", threat: 'low' },
      ],
      competitiveAdvantages: ["Only approved MLD therapy", "Curative intent", "Orphan exclusivity"],
      competitiveRisks: ["Ultra-rare population", "Manufacturing complexity", "High price point"],
      marketPositioning: "First gene therapy approved for metachromatic leukodystrophy."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q4 2020", outcome: 'success', keyData: ["Motor function preservation", "Survival benefit"], scoreAtTime: 68, rationale: "Transformative efficacy", dataAvailableAtTime: ["Long-term follow-up"] },
      { phase: "EU Approval (Libmeldy)", date: "Dec 2020", outcome: 'success', keyData: ["First EU approval", "Conditional authorization"], scoreAtTime: 82, rationale: "European validation", dataAvailableAtTime: ["EU launch"] },
      { phase: "FDA Approval (Lenmeldy)", date: "Mar 2024", outcome: 'success', keyData: ["US approval", "$4.25M price"], scoreAtTime: 92, rationale: "US market access", dataAvailableAtTime: ["US commercial launch"] }
    ]
  },

  // 13. Ulixacaltamide - TRPV1 antagonist for pain
  {
    id: "ULIX-01",
    name: "Ulixacaltamide (CNTX-4975)",
    trialName: "VICTORY",
    phase: "Phase III",
    indication: "Neuropathic Pain",
    therapeuticArea: "Neurology/CNS",
    company: "Centrexion Therapeutics",
    companyTrackRecord: 'slow',
    nctId: "NCT03660943",
    clinicalTrialsSearchTerm: "CNTX-4975",
    scores: calculateProbabilityScores("Phase III", "Neuropathic Pain", "Neurology/CNS"),
    marketData: generateMarketProjections("Ulixacaltamide", "Phase III", "Neuropathic Pain", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "TRPV1 agonist (high-concentration capsaicin)",
      administration: "Single intra-articular injection",
      keyAdvantage: "Non-opioid, long-lasting pain relief from single injection",
      discovery: "Centrexion Therapeutics",
      development: "Centrexion Therapeutics",
    },
    patents: [
      { patentNumber: "US9,901,559", title: "Injectable capsaicinoid compositions", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B (chronic pain)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Opioids", company: "Multiple", phase: "Approved", mechanism: "Mu-opioid agonism", keyDifferentiator: "Efficacy concerns, addiction risk", efficacy: "Variable", threat: 'medium' },
        { name: "NSAIDs", company: "Multiple", phase: "Approved", mechanism: "COX inhibition", keyDifferentiator: "First-line but limited", efficacy: "Modest", threat: 'medium' },
      ],
      competitiveAdvantages: ["Single injection", "Non-opioid", "Long duration (up to 6 months)"],
      competitiveRisks: ["Procedural administration", "Limited to joint pain", "Prior capsaicin failures"],
      marketPositioning: "Non-opioid long-acting pain relief via single injection."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q3 2019", outcome: 'success', keyData: ["Significant pain reduction", "6-month durability"], scoreAtTime: 52, rationale: "Promising efficacy", dataAvailableAtTime: ["Phase 2b results"] },
      { phase: "Phase 3 VICTORY", date: "Q4 2024", outcome: 'pending', keyData: ["OA knee pain study", "12-week primary endpoint"], scoreAtTime: 48, rationale: "Pivotal data awaited", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  },

  // 14. Eptinezumab - CGRP antibody for migraine
  {
    id: "EPTI-01",
    name: "Eptinezumab (Vyepti)",
    trialName: "DELIVER",
    phase: "Approved",
    indication: "Chronic Migraine",
    therapeuticArea: "Neurology/CNS",
    company: "Lundbeck",
    companyTrackRecord: 'average',
    nctId: "NCT04418765",
    clinicalTrialsSearchTerm: "eptinezumab",
    scores: calculateProbabilityScores("Approved", "Migraine", "Neurology/CNS"),
    marketData: generateMarketProjections("Eptinezumab", "Approved", "Migraine", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Humanized anti-CGRP monoclonal antibody",
      administration: "IV infusion every 3 months",
      keyAdvantage: "Rapid onset and quarterly dosing convenience",
      discovery: "Alder BioPharmaceuticals",
      license: "Lundbeck acquisition",
      development: "Lundbeck",
    },
    patents: [
      { patentNumber: "US9,708,393", title: "Anti-CGRP antibodies", expirationDate: "2034", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B (migraine prevention)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Aimovig (erenumab)", company: "Amgen/Novartis", phase: "Approved", mechanism: "CGRP receptor antibody", keyDifferentiator: "First-to-market", efficacy: "~50% responders", threat: 'high' },
        { name: "Ajovy (fremanezumab)", company: "Teva", phase: "Approved", mechanism: "Anti-CGRP", keyDifferentiator: "Monthly/quarterly SC", efficacy: "~50% responders", threat: 'high' },
      ],
      competitiveAdvantages: ["Only IV option", "Fastest onset (1 day)", "Quarterly dosing"],
      competitiveRisks: ["Requires infusion center", "Crowded CGRP market", "Access challenges"],
      marketPositioning: "Only IV CGRP therapy offering rapid onset and quarterly prevention."
    },
    retrospectivePhases: [
      { phase: "Phase 3 PROMISE-1/2", date: "Q4 2019", outcome: 'success', keyData: ["Significant MMD reduction", "Rapid onset"], scoreAtTime: 72, rationale: "Strong efficacy data", dataAvailableAtTime: ["PROMISE results"] },
      { phase: "FDA Approval", date: "Feb 2020", outcome: 'success', keyData: ["First IV CGRP", "Vyepti brand"], scoreAtTime: 88, rationale: "Unique positioning", dataAvailableAtTime: ["Commercial launch"] },
      { phase: "DELIVER (treatment-resistant)", date: "Q2 2023", outcome: 'success', keyData: ["Efficacy after other CGRP failures", "Label expansion"], scoreAtTime: 85, rationale: "Expanded use case", dataAvailableAtTime: ["DELIVER results"] }
    ]
  },

  // 15. Zavegepant - CGRP antagonist nasal spray
  {
    id: "ZAVE-01",
    name: "Zavegepant (Zavzpret)",
    trialName: "BHV-3000",
    phase: "Approved",
    indication: "Acute Migraine",
    therapeuticArea: "Neurology/CNS",
    company: "Pfizer (via Biohaven)",
    companyTrackRecord: 'fast',
    nctId: "NCT04571060",
    clinicalTrialsSearchTerm: "zavegepant",
    scores: calculateProbabilityScores("Approved", "Acute Migraine", "Neurology/CNS"),
    marketData: generateMarketProjections("Zavegepant", "Approved", "Acute Migraine", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "CGRP receptor antagonist (gepant)",
      administration: "Nasal spray single dose",
      keyAdvantage: "First and only nasal CGRP antagonist for migraine",
      discovery: "Biohaven Pharmaceuticals",
      license: "Pfizer acquisition ($11.6B)",
      development: "Pfizer",
    },
    patents: [
      { patentNumber: "US10,703,748", title: "CGRP receptor antagonist formulations", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$6B (acute migraine)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Ubrelvy (ubrogepant)", company: "AbbVie", phase: "Approved", mechanism: "Oral CGRP antagonist", keyDifferentiator: "First oral gepant", efficacy: "~20% pain-free at 2h", threat: 'high' },
        { name: "Nurtec (rimegepant)", company: "Pfizer", phase: "Approved", mechanism: "Oral CGRP antagonist", keyDifferentiator: "Acute + preventive", efficacy: "~21% pain-free at 2h", threat: 'medium' },
      ],
      competitiveAdvantages: ["Non-oral formulation", "Faster absorption", "Nausea-friendly"],
      competitiveRisks: ["Nasal administration preference", "Pfizer internal competition", "Pricing pressure"],
      marketPositioning: "Only non-oral CGRP antagonist for patients preferring nasal delivery."
    },
    retrospectivePhases: [
      { phase: "Phase 2/3", date: "Q4 2021", outcome: 'success', keyData: ["Pain freedom at 2h", "MBS improvement"], scoreAtTime: 68, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Phase 2/3 results"] },
      { phase: "FDA Approval", date: "Mar 2023", outcome: 'success', keyData: ["Zavzpret approved", "First nasal gepant"], scoreAtTime: 92, rationale: "Novel delivery success", dataAvailableAtTime: ["Commercial launch"] },
      { phase: "Prevention Studies", date: "Q4 2024", outcome: 'pending', keyData: ["Preventive indication ongoing", "Expanding utility"], scoreAtTime: 88, rationale: "Label expansion potential", dataAvailableAtTime: ["Ongoing trials"] }
    ]
  },

  // 16. Lasmiditan - Ditan for acute migraine
  {
    id: "LASM-01",
    name: "Lasmiditan (Reyvow)",
    trialName: "SAMURAI/SPARTAN",
    phase: "Approved",
    indication: "Acute Migraine",
    therapeuticArea: "Neurology/CNS",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT02439320",
    clinicalTrialsSearchTerm: "lasmiditan",
    scores: calculateProbabilityScores("Approved", "Acute Migraine", "Neurology/CNS"),
    marketData: generateMarketProjections("Lasmiditan", "Approved", "Acute Migraine", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "5-HT1F receptor agonist (ditan)",
      administration: "Oral tablet as needed",
      keyAdvantage: "Non-vasoconstrictive migraine acute therapy",
      discovery: "CoLucid Pharmaceuticals",
      license: "Eli Lilly acquisition",
      development: "Eli Lilly",
    },
    patents: [
      { patentNumber: "US8,697,876", title: "5-HT1F agonist compounds", expirationDate: "2031", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$6B (acute migraine)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Triptans", company: "Multiple", phase: "Approved (generic)", mechanism: "5-HT1B/D agonists", keyDifferentiator: "Standard of care, low cost", efficacy: "~30% pain-free", threat: 'high' },
        { name: "Gepants", company: "Multiple", phase: "Approved", mechanism: "CGRP antagonists", keyDifferentiator: "No vasoconstriction", efficacy: "~20% pain-free", threat: 'high' },
      ],
      competitiveAdvantages: ["No cardiovascular restrictions", "Proven triptan-like efficacy", "Oral convenience"],
      competitiveRisks: ["Schedule V controlled", "CNS side effects", "8-hour driving restriction"],
      marketPositioning: "First-in-class non-vasoconstricting oral migraine treatment."
    },
    retrospectivePhases: [
      { phase: "Phase 3 SAMURAI", date: "Q4 2017", outcome: 'success', keyData: ["Met pain-free endpoint", "MBS improvement"], scoreAtTime: 72, rationale: "Pivotal success", dataAvailableAtTime: ["SAMURAI results"] },
      { phase: "Phase 3 SPARTAN", date: "Q2 2018", outcome: 'success', keyData: ["Confirmed SAMURAI", "Consistent efficacy"], scoreAtTime: 78, rationale: "Replicated results", dataAvailableAtTime: ["SPARTAN results"] },
      { phase: "FDA Approval", date: "Oct 2019", outcome: 'success', keyData: ["Reyvow approved", "Schedule V classification"], scoreAtTime: 85, rationale: "New migraine class launched", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 17. Fenfluramine - Serotonergic for seizures
  {
    id: "FENF-01",
    name: "Fenfluramine (Fintepla)",
    trialName: "Study 1/Study 2",
    phase: "Approved",
    indication: "Dravet Syndrome",
    therapeuticArea: "Neurology/CNS",
    company: "UCB (via Zogenix)",
    companyTrackRecord: 'average',
    nctId: "NCT02682927",
    clinicalTrialsSearchTerm: "fenfluramine Dravet",
    scores: calculateProbabilityScores("Approved", "Dravet Syndrome", "Neurology/CNS"),
    marketData: generateMarketProjections("Fenfluramine", "Approved", "Dravet Syndrome", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Serotonin releasing agent / 5-HT receptor agonist",
      administration: "Oral solution twice daily",
      keyAdvantage: "Dramatic seizure reduction in treatment-resistant Dravet syndrome",
      discovery: "Zogenix",
      license: "UCB acquisition",
      development: "UCB",
    },
    patents: [
      { patentNumber: "US10,722,488", title: "Low-dose fenfluramine for epilepsy", expirationDate: "2036", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$1B (Dravet syndrome)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Epidiolex (CBD)", company: "Jazz", phase: "Approved", mechanism: "Cannabidiol", keyDifferentiator: "First CBD approval", efficacy: "~40% seizure reduction", threat: 'medium' },
        { name: "Stiripentol", company: "Biocodex", phase: "Approved", mechanism: "GABA modulator", keyDifferentiator: "Adjunctive use", efficacy: "Variable", threat: 'low' },
      ],
      competitiveAdvantages: ["Superior efficacy (~60% reduction)", "Long-term durability", "Expanding indications"],
      competitiveRisks: ["Cardiac monitoring (REMS)", "Scheduling concerns", "Limited patient population"],
      marketPositioning: "Most efficacious therapy for Dravet syndrome seizures."
    },
    retrospectivePhases: [
      { phase: "Phase 3 Studies", date: "Q4 2019", outcome: 'success', keyData: ["63% seizure reduction", "Durable response"], scoreAtTime: 78, rationale: "Exceptional efficacy", dataAvailableAtTime: ["Phase 3 results"] },
      { phase: "FDA Approval (Dravet)", date: "Jun 2020", outcome: 'success', keyData: ["Fintepla approved", "REMS program"], scoreAtTime: 88, rationale: "First fenfluramine approval", dataAvailableAtTime: ["Commercial launch"] },
      { phase: "LGS Expansion", date: "Mar 2022", outcome: 'success', keyData: ["Lennox-Gastaut approval", "Broader epilepsy use"], scoreAtTime: 92, rationale: "Label expansion success", dataAvailableAtTime: ["Expanded label"] }
    ]
  },

  // 18. Ganaxolone - Neurosteroid for seizures
  {
    id: "GANA-01",
    name: "Ganaxolone (Ztalmy)",
    trialName: "MARIGOLD",
    phase: "Approved",
    indication: "CDKL5 Deficiency Disorder",
    therapeuticArea: "Neurology/CNS",
    company: "Marinus Pharmaceuticals",
    companyTrackRecord: 'slow',
    nctId: "NCT03572933",
    clinicalTrialsSearchTerm: "ganaxolone CDKL5",
    scores: calculateProbabilityScores("Approved", "CDKL5 Deficiency", "Neurology/CNS"),
    marketData: generateMarketProjections("Ganaxolone", "Approved", "CDKL5 Deficiency", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Neuroactive steroid GABA-A receptor positive allosteric modulator",
      administration: "Oral suspension three times daily",
      keyAdvantage: "First FDA-approved treatment for CDKL5 deficiency disorder",
      discovery: "Marinus Pharmaceuticals",
      development: "Marinus Pharmaceuticals",
    },
    patents: [
      { patentNumber: "US9,931,340", title: "Neuroactive steroid formulations", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$300M (CDD treatment)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Off-label AEDs", company: "Multiple", phase: "Approved (off-label)", mechanism: "Various", keyDifferentiator: "Prior standard approach", efficacy: "Limited", threat: 'low' },
      ],
      competitiveAdvantages: ["Only approved CDD therapy", "Orphan exclusivity", "Novel mechanism"],
      competitiveRisks: ["Very small patient population", "TID dosing", "Commercial challenges"],
      marketPositioning: "First and only approved treatment for CDKL5 deficiency disorder seizures."
    },
    retrospectivePhases: [
      { phase: "Phase 3 MARIGOLD", date: "Q2 2021", outcome: 'success', keyData: ["30% seizure reduction", "Significant vs placebo"], scoreAtTime: 72, rationale: "Pivotal success", dataAvailableAtTime: ["MARIGOLD results"] },
      { phase: "FDA Approval", date: "Mar 2022", outcome: 'success', keyData: ["Ztalmy approved", "First CDD therapy"], scoreAtTime: 92, rationale: "Historic approval for CDD", dataAvailableAtTime: ["Commercial launch"] },
      { phase: "TSC Expansion", date: "Q4 2024", outcome: 'pending', keyData: ["TSC-related seizures trial", "Larger market opportunity"], scoreAtTime: 85, rationale: "Label expansion efforts", dataAvailableAtTime: ["Ongoing trials"] }
    ]
  },

  // 19. Eladocagene Exuparvovec - Gene therapy for AADC deficiency
  {
    id: "ELAD-01",
    name: "Eladocagene Exuparvovec (Upstaza)",
    trialName: "AADC Gene Therapy",
    phase: "Approved",
    indication: "AADC Deficiency",
    therapeuticArea: "Neurology/CNS",
    company: "PTC Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT02926066",
    clinicalTrialsSearchTerm: "eladocagene",
    scores: calculateProbabilityScores("Approved", "AADC Deficiency", "Neurology/CNS"),
    marketData: generateMarketProjections("Upstaza", "Approved", "AADC Deficiency", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAV2 gene therapy delivering DDC gene",
      administration: "One-time intracerebral infusion",
      keyAdvantage: "Curative potential for devastating rare disease",
      discovery: "Agilis Biotherapeutics",
      license: "PTC Therapeutics",
      development: "PTC Therapeutics",
    },
    patents: [
      { patentNumber: "US10,383,922", title: "Gene therapy for AADC deficiency", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$100M (AADC deficiency)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Supportive care", company: "N/A", phase: "N/A", mechanism: "Symptomatic", keyDifferentiator: "No disease-modifying options", efficacy: "N/A", threat: 'low' },
      ],
      competitiveAdvantages: ["Only approved therapy", "Curative intent", "Dramatic clinical improvement"],
      competitiveRisks: ["Ultra-rare (~135 patients globally)", "Surgical delivery", "High price"],
      marketPositioning: "Only gene therapy approved for AADC deficiency."
    },
    retrospectivePhases: [
      { phase: "Clinical Studies", date: "Q4 2020", outcome: 'success', keyData: ["Motor milestone achievement", "Sustained improvement"], scoreAtTime: 75, rationale: "Transformative efficacy", dataAvailableAtTime: ["Long-term data"] },
      { phase: "EU Approval (Upstaza)", date: "Jul 2022", outcome: 'success', keyData: ["First EU AADC therapy", "€3.5M price"], scoreAtTime: 88, rationale: "European market access", dataAvailableAtTime: ["EU launch"] },
      { phase: "US Regulatory Path", date: "Q4 2024", outcome: 'pending', keyData: ["FDA filing planned", "BLA preparation"], scoreAtTime: 82, rationale: "US approval pathway active", dataAvailableAtTime: ["Regulatory updates"] }
    ]
  },

  // 20. Valiltramiprosate - Amyloid modulator for Alzheimer's
  {
    id: "VALI-01",
    name: "Valiltramiprosate (ALZ-801)",
    trialName: "APOLLOE4",
    phase: "Phase III",
    indication: "Alzheimer's Disease (APOE4)",
    therapeuticArea: "Neurology/CNS",
    company: "Alzheon",
    companyTrackRecord: 'slow',
    nctId: "NCT04770220",
    clinicalTrialsSearchTerm: "ALZ-801",
    scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology/CNS"),
    marketData: generateMarketProjections("Valiltramiprosate", "Phase III", "Alzheimer's Disease", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral anti-amyloid oligomer agent (tramiprosate prodrug)",
      administration: "Oral tablet twice daily",
      keyAdvantage: "Oral, chronic Alzheimer's therapy without ARIA risk",
      discovery: "Neurochem (tramiprosate)",
      development: "Alzheon (optimized prodrug)",
    },
    patents: [
      { patentNumber: "US9,173,871", title: "Prodrugs of tramiprosate", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Alzheimer's market)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Donanemab", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-amyloid antibody", keyDifferentiator: "Best-in-class IV", efficacy: "35% slowing", threat: 'high' },
        { name: "Lecanemab", company: "Eisai/Biogen", phase: "Approved", mechanism: "Anti-amyloid antibody", keyDifferentiator: "First approved", efficacy: "27% slowing", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral administration", "No ARIA risk", "APOE4 targeted"],
      competitiveRisks: ["Prior tramiprosate failure", "Late-stage competition", "Small company resources"],
      marketPositioning: "Oral, safe alternative to anti-amyloid antibodies for APOE4 carriers."
    },
    retrospectivePhases: [
      { phase: "Tramiprosate Failure", date: "2007", outcome: 'setback', keyData: ["Phase 3 missed primary", "APOE4 subgroup signal"], scoreAtTime: 25, rationale: "Historical context", dataAvailableAtTime: ["Original trial data"] },
      { phase: "ALZ-801 Development", date: "Q2 2019", outcome: 'success', keyData: ["Prodrug bioavailability", "APOE4 focus validated"], scoreAtTime: 42, rationale: "Strategic repositioning", dataAvailableAtTime: ["Phase 1 results"] },
      { phase: "Phase 3 APOLLOE4", date: "Q4 2024", outcome: 'pending', keyData: ["APOE4/4 homozygotes", "2-year primary endpoint"], scoreAtTime: 45, rationale: "Pivotal trial advancing", dataAvailableAtTime: ["Enrollment updates"] }
    ]
  }
];
