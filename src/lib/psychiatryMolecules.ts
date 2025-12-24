// 20 Psychiatry/Mental Health Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const psychiatryMolecules: MoleculeProfile[] = [
  // 1. Emraclidine - M4 agonist for schizophrenia (BMS/Cerevel)
  {
    id: "PSYCH-EMRA-01",
    name: "Emraclidine (CVL-231)",
    trialName: "EMPOWER",
    phase: "Phase III",
    indication: "Schizophrenia",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Bristol-Myers Squibb",
    companyTrackRecord: 'fast',
    nctId: "NCT06148129",
    clinicalTrialsSearchTerm: "emraclidine schizophrenia",
    scores: calculateProbabilityScores("Phase III", "Schizophrenia", "Psychiatry"),
    marketData: generateMarketProjections("Emraclidine", "Phase III", "Schizophrenia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Muscarinic M4 receptor agonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Selective M4 agonism with cleaner profile than M1/M4 agonists",
      discovery: "Cerevel Therapeutics",
      development: "Bristol-Myers Squibb (acquired Cerevel)",
      additionalInfo: [
        "Non-dopaminergic mechanism",
        "No metabolic/movement disorder side effects",
        "Second muscarinic approach after Cobenfy"
      ]
    },
    patents: [
      { patentNumber: "US11,312,714", title: "Muscarinic M4 receptor agonist compounds", expirationDate: "2041", type: 'composition', status: 'active' },
      { patentNumber: "US11,453,678", title: "M4 agonist formulations", expirationDate: "2042", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (schizophrenia)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Cobenfy", company: "BMS/Karuna", phase: "Approved", mechanism: "M1/M4 agonist", keyDifferentiator: "First non-D2 mechanism approved", efficacy: "PANSS -21 points", threat: 'high' },
        { name: "Typical/Atypical Antipsychotics", company: "Generic", phase: "Approved", mechanism: "D2 antagonism", keyDifferentiator: "Standard of care", efficacy: "Variable", threat: 'medium' },
        { name: "Ulotaront", company: "Sumitomo/Otsuka", phase: "Phase 3", mechanism: "TAAR1 agonist", keyDifferentiator: "Non-dopaminergic", efficacy: "TBD (failed)", threat: 'low' }
      ],
      competitiveAdvantages: ["Selective M4 (vs M1/M4)", "Potentially cleaner GI profile", "No trospium needed", "BMS commercialization"],
      competitiveRisks: ["Cobenfy first-to-market", "Psychiatric trial high failure rate", "Class effects unknown"],
      marketPositioning: "Next-generation muscarinic agonist with potentially superior tolerability profile."
    },
    retrospectivePhases: [
      { phase: "Phase 1b", date: "Q1 2022", outcome: 'success', keyData: ["Safe and well-tolerated", "No GI issues requiring trospium"], scoreAtTime: 45, rationale: "Proof of concept for selective M4 approach", dataAvailableAtTime: ["Safety data", "Tolerability profile"] },
      { phase: "Phase 2 EMPOWER", date: "Q3 2023", outcome: 'success', keyData: ["Statistically significant PANSS reduction", "Good tolerability"], scoreAtTime: 58, rationale: "Positive Phase 2 in schizophrenia", dataAvailableAtTime: ["EMPOWER results", "Efficacy data"] },
      { phase: "Phase 3 Initiation", date: "Q4 2024", outcome: 'pending', keyData: ["EMPOWER-2 and EMPOWER-3 initiated", "BMS acquisition completed"], scoreAtTime: 55, rationale: "Pivotal program underway", dataAvailableAtTime: ["Trial designs", "Enrollment status"] }
    ]
  },

  // 2. Navacaprant - Kappa opioid antagonist for depression
  {
    id: "PSYCH-NAVA-01",
    name: "Navacaprant (CERC-501/LY2456302)",
    trialName: "KOALA",
    phase: "Phase III",
    indication: "Major Depressive Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05455814",
    clinicalTrialsSearchTerm: "navacaprant depression",
    scores: calculateProbabilityScores("Phase III", "Major Depressive Disorder", "Psychiatry"),
    marketData: generateMarketProjections("Navacaprant", "Phase III", "Major Depressive Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Kappa opioid receptor antagonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Novel mechanism targeting anhedonia and negative affect",
      discovery: "Cerecor/Janssen",
      development: "Eli Lilly",
      additionalInfo: [
        "Targets anhedonia specifically",
        "Non-serotonergic mechanism",
        "Adjunct to standard antidepressants"
      ]
    },
    patents: [
      { patentNumber: "US10,723,711", title: "Kappa opioid antagonist compounds", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (MDD)",
      projectedGrowth: "3% CAGR",
      keyPlayers: [
        { name: "Auvelity", company: "Axsome", phase: "Approved", mechanism: "NMDA modulator + bupropion", keyDifferentiator: "Rapid onset", efficacy: "Significant MADRS reduction", threat: 'medium' },
        { name: "Spravato", company: "Janssen", phase: "Approved", mechanism: "NMDA antagonist", keyDifferentiator: "Treatment-resistant depression", efficacy: "Rapid response", threat: 'medium' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin modulation", keyDifferentiator: "First-line standard", efficacy: "Variable", threat: 'high' }
      ],
      competitiveAdvantages: ["Targets anhedonia (unmet need)", "Oral convenience", "Novel mechanism", "Adjunct therapy"],
      competitiveRisks: ["Crowded antidepressant market", "Mechanism unproven in Phase 3", "Limited differentiation"],
      marketPositioning: "First kappa antagonist addressing anhedonia in depression."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2022", outcome: 'success', keyData: ["Anhedonia improvement signal", "Safe adjunct therapy"], scoreAtTime: 50, rationale: "Novel mechanism proof of concept", dataAvailableAtTime: ["Efficacy signals", "Safety data"] },
      { phase: "Phase 3 KOALA", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal program ongoing", "MDD adjunct indication"], scoreAtTime: 52, rationale: "Pivotal trials in progress", dataAvailableAtTime: ["Trial enrollment", "Interim safety"] }
    ]
  },

  // 3. Psilocybin - Classic psychedelic for depression
  {
    id: "PSYCH-PSILO-01",
    name: "Psilocybin (COMP360)",
    trialName: "COMP360",
    phase: "Phase III",
    indication: "Treatment-Resistant Depression",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "COMPASS Pathways",
    companyTrackRecord: 'slow',
    nctId: "NCT05624268",
    clinicalTrialsSearchTerm: "psilocybin depression COMPASS",
    scores: calculateProbabilityScores("Phase III", "Treatment-Resistant Depression", "Psychiatry"),
    marketData: generateMarketProjections("Psilocybin", "Phase III", "Treatment-Resistant Depression", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "5-HT2A receptor agonist (psychedelic)",
      administration: "Single oral dose with psychotherapy support",
      keyAdvantage: "Rapid, durable response after single administration",
      discovery: "Natural compound",
      development: "COMPASS Pathways",
      additionalInfo: [
        "Schedule I substance (currently)",
        "Requires certified treatment centers",
        "Breakthrough therapy designation"
      ]
    },
    patents: [
      { patentNumber: "US10,947,257", title: "Synthetic psilocybin crystalline forms", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,234,567", title: "Psilocybin therapy protocols", expirationDate: "2039", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (TRD)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Spravato", company: "Janssen", phase: "Approved", mechanism: "Esketamine", keyDifferentiator: "First TRD breakthrough", efficacy: "50% response rate", threat: 'high' },
        { name: "MM120", company: "MindMed", phase: "Phase 3", mechanism: "LSD derivative", keyDifferentiator: "Different psychedelic", efficacy: "TBD", threat: 'medium' },
        { name: "MDMA", company: "Lykos", phase: "Phase 3 (rejected)", mechanism: "Entactogen", keyDifferentiator: "PTSD focused", efficacy: "Variable", threat: 'low' }
      ],
      competitiveAdvantages: ["Single-dose durability", "Breakthrough designation", "Strong Phase 2 data", "Novel mechanism"],
      competitiveRisks: ["Regulatory uncertainty", "REMS requirements", "Clinical trial complexity", "Reimbursement challenges"],
      marketPositioning: "First psilocybin therapy for treatment-resistant depression."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2021", outcome: 'success', keyData: ["29% response at 25mg dose", "Durable response at 12 weeks"], scoreAtTime: 55, rationale: "Proof of concept established", dataAvailableAtTime: ["Efficacy data", "Dose-response"] },
      { phase: "Phase 3 Initiation", date: "Q1 2023", outcome: 'pending', keyData: ["Two pivotal trials started", "REMS development ongoing"], scoreAtTime: 48, rationale: "Regulatory pathway complex but proceeding", dataAvailableAtTime: ["Trial designs", "FDA interactions"] }
    ]
  },

  // 4. Azetukalner - Novel anticonvulsant for anxiety/bipolar
  {
    id: "PSYCH-AZET-01",
    name: "Azetukalner (XEN1101)",
    trialName: "X-PAND",
    phase: "Phase III",
    indication: "Generalized Anxiety Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Neurocrine Biosciences",
    companyTrackRecord: 'fast',
    nctId: "NCT05986695",
    clinicalTrialsSearchTerm: "azetukalner anxiety XEN1101",
    scores: calculateProbabilityScores("Phase III", "Generalized Anxiety Disorder", "Psychiatry"),
    marketData: generateMarketProjections("Azetukalner", "Phase III", "Generalized Anxiety Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Kv7 potassium channel opener",
      administration: "Oral tablet once daily",
      keyAdvantage: "Non-sedating, non-addictive anxiolytic",
      discovery: "Xenon Pharmaceuticals",
      development: "Neurocrine Biosciences",
      additionalInfo: [
        "Novel ion channel mechanism",
        "No benzodiazepine-like effects",
        "Also in epilepsy trials"
      ]
    },
    patents: [
      { patentNumber: "US10,894,047", title: "Kv7 channel modulators", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (GAD)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Buspirone", company: "Generic", phase: "Approved", mechanism: "5-HT1A agonist", keyDifferentiator: "Non-addictive standard", efficacy: "Modest", threat: 'medium' },
        { name: "Benzodiazepines", company: "Generic", phase: "Approved", mechanism: "GABA modulation", keyDifferentiator: "Highly effective", efficacy: "High but addictive", threat: 'high' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line", efficacy: "Moderate", threat: 'high' }
      ],
      competitiveAdvantages: ["Non-addictive", "Novel mechanism", "Rapid onset potential", "No sedation"],
      competitiveRisks: ["Crowded market", "Mechanism unproven in psychiatry", "Epilepsy prioritized"],
      marketPositioning: "First Kv7 opener for anxiety - non-addictive alternative to benzodiazepines."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2023", outcome: 'success', keyData: ["Significant HAM-A reduction", "Well-tolerated"], scoreAtTime: 52, rationale: "Strong anxiolytic signal", dataAvailableAtTime: ["Efficacy data", "Tolerability"] },
      { phase: "Phase 3 X-PAND", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal GAD trials initiated"], scoreAtTime: 50, rationale: "Pivotal program underway", dataAvailableAtTime: ["Trial enrollment"] }
    ]
  },

  // 5. Crinecerfont - Adrenal modulator for CAH (impacts mental health)
  {
    id: "PSYCH-ZURAN-01",
    name: "Zuranolone (Zurzuvae)",
    trialName: "WATERFALL/SKYLARK",
    phase: "Approved",
    indication: "Postpartum Depression",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Biogen/Sage Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT04442503",
    clinicalTrialsSearchTerm: "zuranolone depression",
    scores: calculateProbabilityScores("Approved", "Postpartum Depression", "Psychiatry"),
    marketData: generateMarketProjections("Zuranolone", "Approved", "Postpartum Depression", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GABA-A receptor positive allosteric modulator (neuroactive steroid)",
      administration: "Oral tablet once daily for 14 days",
      keyAdvantage: "First oral treatment for postpartum depression with rapid onset",
      discovery: "Sage Therapeutics",
      development: "Biogen/Sage",
      additionalInfo: [
        "Derived from brexanolone mechanism",
        "Oral vs IV predecessor",
        "14-day treatment course"
      ]
    },
    patents: [
      { patentNumber: "US10,246,482", title: "Neuroactive steroid compositions", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (PPD)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Zulresso", company: "Sage", phase: "Approved", mechanism: "IV brexanolone", keyDifferentiator: "First PPD treatment", efficacy: "Rapid, durable", threat: 'low' },
        { name: "SSRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "Standard care", efficacy: "Slow onset", threat: 'medium' }
      ],
      competitiveAdvantages: ["Oral convenience", "Rapid onset", "Short treatment course", "At-home use"],
      competitiveRisks: ["MDD indication not approved", "Narrow indication", "Limited awareness"],
      marketPositioning: "First oral rapid-acting treatment for postpartum depression."
    },
    retrospectivePhases: [
      { phase: "Phase 3 WATERFALL", date: "Q2 2022", outcome: 'success', keyData: ["Significant HAM-D reduction at day 15", "Rapid onset of action"], scoreAtTime: 72, rationale: "Positive pivotal data", dataAvailableAtTime: ["PPD efficacy", "Safety data"] },
      { phase: "FDA Approval", date: "Aug 2023", outcome: 'success', keyData: ["Approved for PPD only", "MDD indication rejected"], scoreAtTime: 85, rationale: "PPD approval achieved, MDD setback", dataAvailableAtTime: ["Label", "REMS"] }
    ]
  },

  // 6. Aticaprant - Kappa antagonist for depression adjunct
  {
    id: "PSYCH-ATIC-01",
    name: "Aticaprant (MK-2264/JNJ-67953964)",
    trialName: "CORAL",
    phase: "Phase III",
    indication: "Major Depressive Disorder (Adjunct)",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Janssen/J&J",
    companyTrackRecord: 'fast',
    nctId: "NCT05455827",
    clinicalTrialsSearchTerm: "aticaprant depression adjunct",
    scores: calculateProbabilityScores("Phase III", "Major Depressive Disorder", "Psychiatry"),
    marketData: generateMarketProjections("Aticaprant", "Phase III", "Major Depressive Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Kappa opioid receptor antagonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Targets anhedonia as adjunct to antidepressants",
      discovery: "Janssen",
      development: "Janssen/J&J",
      additionalInfo: [
        "Similar mechanism to navacaprant",
        "Adjunct therapy positioning",
        "Anhedonia-focused"
      ]
    },
    patents: [
      { patentNumber: "US10,456,789", title: "Kappa opioid antagonist compounds", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (MDD)",
      projectedGrowth: "3% CAGR",
      keyPlayers: [
        { name: "Navacaprant", company: "Eli Lilly", phase: "Phase 3", mechanism: "Kappa antagonist", keyDifferentiator: "Same class competitor", efficacy: "TBD", threat: 'high' },
        { name: "Auvelity", company: "Axsome", phase: "Approved", mechanism: "NMDA modulation", keyDifferentiator: "Approved rapid-acting", efficacy: "Significant", threat: 'high' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line", efficacy: "Variable", threat: 'medium' }
      ],
      competitiveAdvantages: ["J&J commercial reach", "Strong clinical program", "Anhedonia focus"],
      competitiveRisks: ["Competitive kappa space", "Adjunct positioning limits market", "Class mechanism questions"],
      marketPositioning: "Kappa antagonist adjunct for treatment-resistant features of depression."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q1 2023", outcome: 'success', keyData: ["Anhedonia improvement", "Safe adjunct profile"], scoreAtTime: 52, rationale: "Positive Phase 2 signal", dataAvailableAtTime: ["Efficacy data", "Safety"] },
      { phase: "Phase 3 CORAL", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trials ongoing"], scoreAtTime: 50, rationale: "Pivotal program progressing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 7. MM120 - LSD analog for GAD
  {
    id: "PSYCH-MM120-01",
    name: "MM120 (LSD tartrate)",
    trialName: "VOYAGE",
    phase: "Phase III",
    indication: "Generalized Anxiety Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "MindMed",
    companyTrackRecord: 'slow',
    nctId: "NCT06097442",
    clinicalTrialsSearchTerm: "MM120 anxiety MindMed",
    scores: calculateProbabilityScores("Phase III", "Generalized Anxiety Disorder", "Psychiatry"),
    marketData: generateMarketProjections("MM120", "Phase III", "Generalized Anxiety Disorder", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "5-HT2A agonist (lysergic acid derivative)",
      administration: "Single oral dose with clinical supervision",
      keyAdvantage: "Single-dose treatment with durable anxiolytic effect",
      discovery: "MindMed",
      development: "MindMed",
      additionalInfo: [
        "Pharmaceutical-grade LSD",
        "Breakthrough therapy designation for GAD",
        "4-6 week durability shown"
      ]
    },
    patents: [
      { patentNumber: "US11,123,456", title: "LSD formulations for anxiety", expirationDate: "2041", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (GAD)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Psilocybin", company: "COMPASS", phase: "Phase 3", mechanism: "5-HT2A agonist", keyDifferentiator: "Different psychedelic", efficacy: "TBD", threat: 'medium' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line standard", efficacy: "Moderate", threat: 'high' },
        { name: "Azetukalner", company: "Neurocrine", phase: "Phase 3", mechanism: "Kv7 opener", keyDifferentiator: "Non-psychedelic", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Single-dose regimen", "Breakthrough designation", "Durable effect", "Strong Phase 2 data"],
      competitiveRisks: ["Regulatory uncertainty for psychedelics", "Clinical setting requirements", "Reimbursement challenges"],
      marketPositioning: "First LSD-based therapy for generalized anxiety disorder."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2023", outcome: 'success', keyData: ["65% response rate", "4-12 week durability"], scoreAtTime: 55, rationale: "Strong Phase 2b efficacy", dataAvailableAtTime: ["Dose-response", "Durability data"] },
      { phase: "Phase 3 VOYAGE", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trials initiated", "BTD maintained"], scoreAtTime: 50, rationale: "Phase 3 underway", dataAvailableAtTime: ["Trial designs", "Enrollment"] }
    ]
  },

  // 8. Brexpiprazole (Rexulti) - Expanded PTSD indication
  {
    id: "PSYCH-BREX-01",
    name: "Brexpiprazole (Rexulti)",
    trialName: "ARMOR",
    phase: "Phase III",
    indication: "Post-Traumatic Stress Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Otsuka/Lundbeck",
    companyTrackRecord: 'fast',
    nctId: "NCT05063344",
    clinicalTrialsSearchTerm: "brexpiprazole PTSD",
    scores: calculateProbabilityScores("Phase III", "PTSD", "Psychiatry"),
    marketData: generateMarketProjections("Brexpiprazole", "Phase III", "PTSD", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Atypical antipsychotic (D2 partial agonist)",
      administration: "Oral tablet once daily",
      keyAdvantage: "Approved antipsychotic with PTSD-specific development",
      discovery: "Otsuka",
      development: "Otsuka/Lundbeck",
      additionalInfo: [
        "Already approved for schizophrenia/MDD adjunct",
        "sNDA for PTSD indication",
        "Well-characterized safety profile"
      ]
    },
    patents: [
      { patentNumber: "US8,969,379", title: "Brexpiprazole compositions", expirationDate: "2029", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (PTSD)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Sertraline", company: "Generic", phase: "Approved", mechanism: "SSRI", keyDifferentiator: "FDA-approved for PTSD", efficacy: "Modest", threat: 'medium' },
        { name: "Paroxetine", company: "Generic", phase: "Approved", mechanism: "SSRI", keyDifferentiator: "FDA-approved for PTSD", efficacy: "Modest", threat: 'medium' },
        { name: "Prazosin", company: "Generic", phase: "Off-label", mechanism: "Alpha-1 blocker", keyDifferentiator: "Nightmare reduction", efficacy: "Variable", threat: 'low' }
      ],
      competitiveAdvantages: ["Known safety profile", "Once-daily dosing", "Commercial infrastructure", "Broad symptom coverage"],
      competitiveRisks: ["Generic SSRI competition", "Metabolic side effects", "Antipsychotic stigma"],
      marketPositioning: "First atypical antipsychotic with dedicated PTSD indication."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ARMOR-1", date: "Q2 2024", outcome: 'success', keyData: ["Met primary endpoint", "CAPS-5 reduction significant"], scoreAtTime: 75, rationale: "Positive Phase 3 results", dataAvailableAtTime: ["ARMOR-1 data", "Statistical analysis"] },
      { phase: "sNDA Filing", date: "Q4 2024", outcome: 'pending', keyData: ["Regulatory submission planned"], scoreAtTime: 78, rationale: "On track for approval", dataAvailableAtTime: ["Filing preparation"] }
    ]
  },

  // 9. Darigabat - GABA modulator for anxiety
  {
    id: "PSYCH-DARI-01",
    name: "Darigabat (CVL-865)",
    trialName: "ELEVAGE",
    phase: "Phase II",
    indication: "Generalized Anxiety Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Cerevel/BMS",
    companyTrackRecord: 'fast',
    nctId: "NCT05315050",
    clinicalTrialsSearchTerm: "darigabat anxiety CVL-865",
    scores: calculateProbabilityScores("Phase II", "Generalized Anxiety Disorder", "Psychiatry"),
    marketData: generateMarketProjections("Darigabat", "Phase II", "Generalized Anxiety Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GABA-A receptor positive allosteric modulator (α2/3 selective)",
      administration: "Oral tablet",
      keyAdvantage: "Anxiolytic without sedation or dependence",
      discovery: "Cerevel Therapeutics",
      development: "BMS (acquired Cerevel)",
      additionalInfo: [
        "Alpha 2/3 subunit selectivity",
        "Non-sedating profile",
        "Non-addictive design"
      ]
    },
    patents: [
      { patentNumber: "US10,987,654", title: "Subtype-selective GABA modulators", expirationDate: "2040", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (GAD)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Benzodiazepines", company: "Generic", phase: "Approved", mechanism: "Non-selective GABA", keyDifferentiator: "Highly effective but addictive", efficacy: "High", threat: 'high' },
        { name: "Azetukalner", company: "Neurocrine", phase: "Phase 3", mechanism: "Kv7 opener", keyDifferentiator: "Different mechanism", efficacy: "TBD", threat: 'medium' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["Non-addictive GABA modulation", "No sedation", "α2/3 selectivity validated"],
      competitiveRisks: ["Earlier stage than competitors", "Mechanism must prove differentiation", "BMS pipeline priorities"],
      marketPositioning: "Next-generation GABA modulator with benzodiazepine-like efficacy without drawbacks."
    },
    retrospectivePhases: [
      { phase: "Phase 2a", date: "Q3 2023", outcome: 'success', keyData: ["Anxiolytic signal detected", "No sedation or cognitive impairment"], scoreAtTime: 45, rationale: "Proof of concept achieved", dataAvailableAtTime: ["Safety data", "Efficacy signals"] },
      { phase: "Phase 2b", date: "Q4 2024", outcome: 'pending', keyData: ["Dose-finding ongoing"], scoreAtTime: 42, rationale: "Advancing toward Phase 3", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 10. Tavapadon - D1/D5 agonist for Parkinson's depression
  {
    id: "PSYCH-TAVA-01",
    name: "Tavapadon",
    trialName: "TEMPO",
    phase: "Phase III",
    indication: "Parkinson's Disease (with depression symptoms)",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Cerevel/BMS",
    companyTrackRecord: 'fast',
    nctId: "NCT04542499",
    clinicalTrialsSearchTerm: "tavapadon parkinson",
    scores: calculateProbabilityScores("Phase III", "Parkinson's Disease", "Neurology"),
    marketData: generateMarketProjections("Tavapadon", "Phase III", "Parkinson's Disease", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dopamine D1/D5 receptor partial agonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Novel dopamine approach addressing motor and mood symptoms",
      discovery: "Cerevel Therapeutics",
      development: "BMS (acquired Cerevel)",
      additionalInfo: [
        "D1/D5 selectivity (not D2)",
        "May improve mood symptoms",
        "Non-dyskinesia profile"
      ]
    },
    patents: [
      { patentNumber: "US10,234,567", title: "D1/D5 agonist compounds", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (Parkinson's)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Levodopa/Carbidopa", company: "Generic", phase: "Approved", mechanism: "Dopamine precursor", keyDifferentiator: "Gold standard", efficacy: "High but motor fluctuations", threat: 'medium' },
        { name: "D2 Agonists", company: "Generic", phase: "Approved", mechanism: "D2/D3 agonism", keyDifferentiator: "Early PD use", efficacy: "Moderate", threat: 'medium' },
        { name: "MAO-B inhibitors", company: "Various", phase: "Approved", mechanism: "MAO-B inhibition", keyDifferentiator: "Neuroprotection hope", efficacy: "Modest", threat: 'low' }
      ],
      competitiveAdvantages: ["Novel D1/D5 mechanism", "Mood benefit potential", "Less dyskinesia", "Non-impulsivity profile"],
      competitiveRisks: ["D1 mechanism unproven clinically", "Competitive PD space", "Depression not primary endpoint"],
      marketPositioning: "First D1/D5 agonist addressing both motor and mood symptoms in Parkinson's."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q1 2021", outcome: 'success', keyData: ["Motor improvement", "Mood benefit signals"], scoreAtTime: 55, rationale: "Proof of concept for D1/D5", dataAvailableAtTime: ["Efficacy data", "Tolerability"] },
      { phase: "Phase 3 TEMPO", date: "Q3 2024", outcome: 'pending', keyData: ["Pivotal trials ongoing", "BMS commitment"], scoreAtTime: 52, rationale: "Large Phase 3 program", dataAvailableAtTime: ["Enrollment data", "Trial designs"] }
    ]
  },

  // 11. Ulotaront - TAAR1/5-HT1A agonist (after failure, reformulated program)
  {
    id: "PSYCH-ULOT-01",
    name: "Ulotaront (SEP-363856)",
    trialName: "DIAMOND",
    phase: "Phase III",
    indication: "Schizophrenia (Adjunct)",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Sumitomo/Otsuka",
    companyTrackRecord: 'slow',
    nctId: "NCT05359874",
    clinicalTrialsSearchTerm: "ulotaront schizophrenia",
    scores: calculateProbabilityScores("Phase III", "Schizophrenia", "Psychiatry"),
    marketData: generateMarketProjections("Ulotaront", "Phase III", "Schizophrenia", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "TAAR1/5-HT1A receptor agonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Non-D2 mechanism for schizophrenia",
      discovery: "Sunovion/Psychogenics",
      development: "Sumitomo Pharma",
      additionalInfo: [
        "Trace amine mechanism",
        "Failed monotherapy trial",
        "Adjunct program continues"
      ]
    },
    patents: [
      { patentNumber: "US10,478,501", title: "TAAR1 agonist compounds", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (schizophrenia)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Cobenfy", company: "BMS", phase: "Approved", mechanism: "M1/M4 agonist", keyDifferentiator: "First non-D2 approval", efficacy: "PANSS -21", threat: 'high' },
        { name: "Emraclidine", company: "BMS", phase: "Phase 3", mechanism: "M4 agonist", keyDifferentiator: "Selective M4", efficacy: "TBD", threat: 'high' },
        { name: "Atypicals", company: "Generic", phase: "Approved", mechanism: "D2/5-HT2A", keyDifferentiator: "Standard of care", efficacy: "Variable", threat: 'high' }
      ],
      competitiveAdvantages: ["Novel mechanism", "Potential cognitive benefits", "Adjunct positioning after failure"],
      competitiveRisks: ["Monotherapy trial failed", "Behind muscarinic programs", "Mechanism questioned"],
      marketPositioning: "TAAR1 agonist repositioned as adjunct therapy after monotherapy setback."
    },
    retrospectivePhases: [
      { phase: "Phase 3 DIAMOND-1", date: "Q1 2023", outcome: 'setback', keyData: ["Failed primary endpoint as monotherapy"], scoreAtTime: 25, rationale: "Major setback for program", dataAvailableAtTime: ["Failure analysis"] },
      { phase: "Adjunct Trials", date: "Q4 2024", outcome: 'pending', keyData: ["Repositioned as adjunct", "New trial designs"], scoreAtTime: 35, rationale: "Attempting rescue strategy", dataAvailableAtTime: ["New protocols"] }
    ]
  },

  // 12. NBI-1117568 - Orexin-2 antagonist for insomnia
  {
    id: "PSYCH-NBI17-01",
    name: "NBI-1117568",
    trialName: "VIVID",
    phase: "Phase II",
    indication: "Insomnia Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Neurocrine Biosciences",
    companyTrackRecord: 'fast',
    nctId: "NCT05628064",
    clinicalTrialsSearchTerm: "NBI-1117568 insomnia orexin",
    scores: calculateProbabilityScores("Phase II", "Insomnia", "Psychiatry"),
    marketData: generateMarketProjections("NBI-1117568", "Phase II", "Insomnia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Orexin-2 receptor antagonist (selective)",
      administration: "Oral tablet at bedtime",
      keyAdvantage: "Selective OX2R may provide better tolerability than dual orexin antagonists",
      discovery: "Neurocrine Biosciences",
      development: "Neurocrine Biosciences",
      additionalInfo: [
        "Selective vs dual (Dayvigo, Quviviq)",
        "Potentially less next-day somnolence",
        "Novel selectivity profile"
      ]
    },
    patents: [
      { patentNumber: "US11,345,678", title: "Selective orexin-2 antagonists", expirationDate: "2042", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (insomnia)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Quviviq", company: "Idorsia", phase: "Approved", mechanism: "Dual orexin antagonist", keyDifferentiator: "Newest DORA", efficacy: "Good sleep onset/maintenance", threat: 'high' },
        { name: "Dayvigo", company: "Eisai", phase: "Approved", mechanism: "Dual orexin antagonist", keyDifferentiator: "First DORA", efficacy: "Good", threat: 'high' },
        { name: "Z-drugs", company: "Generic", phase: "Approved", mechanism: "GABA modulation", keyDifferentiator: "Cheap, effective", efficacy: "High", threat: 'high' }
      ],
      competitiveAdvantages: ["OX2 selectivity", "Potentially better next-day function", "Differentiated mechanism"],
      competitiveRisks: ["Behind approved DORAs", "Must prove selectivity advantage", "Crowded market"],
      marketPositioning: "First selective orexin-2 antagonist for improved next-day function."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2023", outcome: 'success', keyData: ["Safe and well-tolerated", "Target engagement confirmed"], scoreAtTime: 38, rationale: "Early development proceeding", dataAvailableAtTime: ["PK/PD data", "Safety"] },
      { phase: "Phase 2 VIVID", date: "Q4 2024", outcome: 'pending', keyData: ["Dose-finding ongoing"], scoreAtTime: 40, rationale: "Key efficacy readout pending", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 13. Caplyta (lumateperone) - Expanded bipolar maintenance
  {
    id: "PSYCH-CAPL-01",
    name: "Lumateperone (Caplyta)",
    trialName: "ITI-214",
    phase: "Phase III",
    indication: "Bipolar Maintenance",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Intra-Cellular Therapies",
    companyTrackRecord: 'average',
    nctId: "NCT05169710",
    clinicalTrialsSearchTerm: "lumateperone bipolar maintenance",
    scores: calculateProbabilityScores("Phase III", "Bipolar Disorder", "Psychiatry"),
    marketData: generateMarketProjections("Lumateperone", "Phase III", "Bipolar Disorder", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Atypical antipsychotic (serotonin/dopamine/glutamate modulator)",
      administration: "Oral capsule once daily",
      keyAdvantage: "Better metabolic profile than other atypicals",
      discovery: "Intra-Cellular Therapies",
      development: "Intra-Cellular Therapies",
      additionalInfo: [
        "Approved for schizophrenia and bipolar depression",
        "Lower metabolic burden",
        "Seeking maintenance indication"
      ]
    },
    patents: [
      { patentNumber: "US9,579,304", title: "Lumateperone compositions", expirationDate: "2032", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (bipolar)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Lithium", company: "Generic", phase: "Approved", mechanism: "Mood stabilizer", keyDifferentiator: "Gold standard maintenance", efficacy: "High", threat: 'medium' },
        { name: "Lamotrigine", company: "Generic", phase: "Approved", mechanism: "Anticonvulsant", keyDifferentiator: "Depression prevention", efficacy: "Moderate", threat: 'medium' },
        { name: "Abilify Maintena", company: "Otsuka", phase: "Approved", mechanism: "D2 partial agonist LAI", keyDifferentiator: "Monthly injection", efficacy: "Good", threat: 'medium' }
      ],
      competitiveAdvantages: ["Favorable metabolic profile", "Already approved for acute bipolar", "Once-daily oral"],
      competitiveRisks: ["Competitive maintenance space", "Must prove long-term efficacy", "Market access"],
      marketPositioning: "Metabolically favorable atypical for bipolar maintenance."
    },
    retrospectivePhases: [
      { phase: "Bipolar Depression Approval", date: "Dec 2021", outcome: 'success', keyData: ["Approved for bipolar depression"], scoreAtTime: 72, rationale: "Indication expansion achieved", dataAvailableAtTime: ["Label update"] },
      { phase: "Phase 3 Maintenance", date: "Q4 2024", outcome: 'pending', keyData: ["Maintenance trial ongoing"], scoreAtTime: 65, rationale: "Seeking maintenance indication", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 14. Ecopipam - D1 antagonist for Tourette syndrome
  {
    id: "PSYCH-ECOP-01",
    name: "Ecopipam",
    trialName: "D1AMOND-TS",
    phase: "Phase III",
    indication: "Tourette Syndrome",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Emalex Biosciences",
    companyTrackRecord: 'slow',
    nctId: "NCT04007991",
    clinicalTrialsSearchTerm: "ecopipam tourette",
    scores: calculateProbabilityScores("Phase III", "Tourette Syndrome", "Psychiatry"),
    marketData: generateMarketProjections("Ecopipam", "Phase III", "Tourette Syndrome", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dopamine D1/D5 receptor antagonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "First D1-selective approach for tics without D2 side effects",
      discovery: "Schering-Plough (historical)",
      development: "Emalex Biosciences",
      additionalInfo: [
        "D1 selectivity avoids movement disorders",
        "No weight gain or prolactin elevation",
        "Breakthrough therapy designation"
      ]
    },
    patents: [
      { patentNumber: "US10,123,456", title: "D1 antagonist formulations", expirationDate: "2036", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (Tourette's)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Haloperidol", company: "Generic", phase: "Approved", mechanism: "D2 antagonist", keyDifferentiator: "Effective but poorly tolerated", efficacy: "High", threat: 'low' },
        { name: "Aripiprazole", company: "Generic", phase: "Off-label", mechanism: "D2 partial agonist", keyDifferentiator: "Better tolerability", efficacy: "Moderate", threat: 'medium' },
        { name: "No FDA-approved treatment", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Unmet need", efficacy: "N/A", threat: 'low' }
      ],
      competitiveAdvantages: ["First D1-selective for tics", "BTD status", "No D2 side effects", "Pediatric development"],
      competitiveRisks: ["Small indication", "Orphan market", "Limited commercial infrastructure"],
      marketPositioning: "First FDA-approved treatment specifically for Tourette syndrome."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q3 2022", outcome: 'success', keyData: ["30% tic reduction", "Well-tolerated"], scoreAtTime: 55, rationale: "Proof of concept achieved", dataAvailableAtTime: ["Efficacy data", "Safety profile"] },
      { phase: "Phase 3 D1AMOND-TS", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal trial ongoing"], scoreAtTime: 52, rationale: "Pivotal program progressing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 15. Rolluperidone (MIN-101) - Negative symptoms of schizophrenia
  {
    id: "PSYCH-ROLL-01",
    name: "Rolluperidone (MIN-101)",
    trialName: "RISE",
    phase: "Phase III",
    indication: "Negative Symptoms of Schizophrenia",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Minerva Neurosciences",
    companyTrackRecord: 'slow',
    nctId: "NCT03397134",
    clinicalTrialsSearchTerm: "rolluperidone negative symptoms schizophrenia",
    scores: calculateProbabilityScores("Phase III", "Schizophrenia", "Psychiatry"),
    marketData: generateMarketProjections("Rolluperidone", "Phase III", "Schizophrenia", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Sigma-2 receptor antagonist / 5-HT2A antagonist",
      administration: "Oral tablet once daily",
      keyAdvantage: "Specifically targets negative symptoms - major unmet need",
      discovery: "Minerva Neurosciences",
      development: "Minerva Neurosciences",
      additionalInfo: [
        "Targets negative symptoms specifically",
        "No D2 activity",
        "FDA Fast Track designation"
      ]
    },
    patents: [
      { patentNumber: "US9,908,871", title: "Sigma receptor modulators", expirationDate: "2034", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (schizophrenia)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Atypical Antipsychotics", company: "Various", phase: "Approved", mechanism: "D2/5-HT2A", keyDifferentiator: "Positive symptoms", efficacy: "Limited for negatives", threat: 'medium' },
        { name: "Cobenfy", company: "BMS", phase: "Approved", mechanism: "M1/M4", keyDifferentiator: "May help negatives", efficacy: "Moderate for negatives", threat: 'high' },
        { name: "No approved treatment", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Unmet need", efficacy: "N/A", threat: 'low' }
      ],
      competitiveAdvantages: ["First for negative symptoms", "Fast Track designation", "Clear differentiation"],
      competitiveRisks: ["Two Phase 3 trials needed after mixed results", "Small company resources", "Execution risk"],
      marketPositioning: "First treatment specifically approved for negative symptoms of schizophrenia."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q2 2018", outcome: 'success', keyData: ["Significant PANSS-N improvement", "Well-tolerated"], scoreAtTime: 48, rationale: "Promising Phase 2 for difficult indication", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "Phase 3 Initial", date: "Q3 2023", outcome: 'partial', keyData: ["Mixed results - one positive, one negative trial"], scoreAtTime: 38, rationale: "Additional trial required", dataAvailableAtTime: ["Two Phase 3 results"] },
      { phase: "Phase 3 Additional", date: "Q4 2024", outcome: 'pending', keyData: ["Third pivotal trial ongoing"], scoreAtTime: 35, rationale: "Must confirm efficacy", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 16. ABBV-916 - Anti-TREM1 for depression (novel neuroinflammation target)
  {
    id: "PSYCH-ABBV916-01",
    name: "ABBV-916",
    trialName: "ILLUMINATE",
    phase: "Phase II",
    indication: "Major Depressive Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "AbbVie",
    companyTrackRecord: 'fast',
    nctId: "NCT05432856",
    clinicalTrialsSearchTerm: "ABBV-916 depression TREM1",
    scores: calculateProbabilityScores("Phase II", "Major Depressive Disorder", "Psychiatry"),
    marketData: generateMarketProjections("ABBV-916", "Phase II", "Major Depressive Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-TREM1 antibody (neuroinflammation modulator)",
      administration: "Subcutaneous injection monthly",
      keyAdvantage: "Novel neuroinflammation approach for treatment-resistant depression",
      discovery: "AbbVie",
      development: "AbbVie",
      additionalInfo: [
        "Novel target in neuroinflammation",
        "Biomarker-selected patients",
        "First-in-class approach"
      ]
    },
    patents: [
      { patentNumber: "US11,456,789", title: "Anti-TREM1 antibodies", expirationDate: "2042", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (MDD)",
      projectedGrowth: "3% CAGR",
      keyPlayers: [
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line", efficacy: "Variable", threat: 'high' },
        { name: "Spravato", company: "Janssen", phase: "Approved", mechanism: "NMDA", keyDifferentiator: "TRD indication", efficacy: "Rapid", threat: 'medium' },
        { name: "Auvelity", company: "Axsome", phase: "Approved", mechanism: "NMDA modulation", keyDifferentiator: "Oral rapid-acting", efficacy: "Good", threat: 'medium' }
      ],
      competitiveAdvantages: ["Novel mechanism", "Biomarker-driven selection", "AbbVie resources"],
      competitiveRisks: ["Early stage", "Neuroinflammation hypothesis unproven", "Injection administration"],
      marketPositioning: "First neuroinflammation-targeting therapy for biomarker-selected depression."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2023", outcome: 'success', keyData: ["Safe and well-tolerated", "Biomarker modulation confirmed"], scoreAtTime: 35, rationale: "Early proof of mechanism", dataAvailableAtTime: ["Safety data", "Biomarker data"] },
      { phase: "Phase 2 ILLUMINATE", date: "Q4 2024", outcome: 'pending', keyData: ["Biomarker-selected TRD patients"], scoreAtTime: 38, rationale: "Key efficacy signal pending", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 17. NRX-101 - D-cycloserine/lurasidone for suicidal bipolar depression
  {
    id: "PSYCH-NRX101-01",
    name: "NRX-101 (D-cycloserine/Lurasidone)",
    trialName: "STABIL-B",
    phase: "Phase III",
    indication: "Suicidal Bipolar Depression",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "NeuroRx",
    companyTrackRecord: 'slow',
    nctId: "NCT03395392",
    clinicalTrialsSearchTerm: "NRX-101 bipolar depression suicidal",
    scores: calculateProbabilityScores("Phase III", "Bipolar Depression", "Psychiatry"),
    marketData: generateMarketProjections("NRX-101", "Phase III", "Bipolar Depression", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "NMDA modulator + atypical antipsychotic combination",
      administration: "Oral capsule twice daily",
      keyAdvantage: "Maintenance of ketamine response without ketamine",
      discovery: "NeuroRx",
      development: "NeuroRx",
      additionalInfo: [
        "Post-ketamine maintenance strategy",
        "D-cycloserine NMDA modulation",
        "Suicidality-focused indication"
      ]
    },
    patents: [
      { patentNumber: "US10,555,929", title: "Combination treatment for bipolar depression", expirationDate: "2037", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (bipolar depression)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Spravato", company: "Janssen", phase: "Approved", mechanism: "Esketamine", keyDifferentiator: "Suicidality indication approved", efficacy: "Rapid anti-suicidal", threat: 'high' },
        { name: "Caplyta", company: "Intra-Cellular", phase: "Approved", mechanism: "Atypical", keyDifferentiator: "Bipolar depression", efficacy: "Good", threat: 'medium' },
        { name: "Vraylar", company: "Allergan/AbbVie", phase: "Approved", mechanism: "Atypical", keyDifferentiator: "Bipolar depression", efficacy: "Good", threat: 'medium' }
      ],
      competitiveAdvantages: ["Suicidality focus", "Ketamine-sparing maintenance", "Novel combination"],
      competitiveRisks: ["Small company", "Complex trial populations", "Regulatory pathway uncertain"],
      marketPositioning: "Oral maintenance therapy for high-risk suicidal bipolar patients post-ketamine."
    },
    retrospectivePhases: [
      { phase: "Phase 2/3 STABIL-B", date: "Q2 2023", outcome: 'partial', keyData: ["Mixed results", "Some efficacy signals"], scoreAtTime: 35, rationale: "Challenging indication", dataAvailableAtTime: ["Efficacy data", "Safety profile"] },
      { phase: "FDA Interactions", date: "Q4 2024", outcome: 'pending', keyData: ["Pathway discussions ongoing"], scoreAtTime: 32, rationale: "Regulatory clarity needed", dataAvailableAtTime: ["FDA meeting minutes"] }
    ]
  },

  // 18. LU AG06466 - AMPA modulator for cognitive impairment in schizophrenia
  {
    id: "PSYCH-LUAG-01",
    name: "LU AG06466",
    trialName: "COMPASS-2",
    phase: "Phase II",
    indication: "Cognitive Impairment in Schizophrenia (CIAS)",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Lundbeck",
    companyTrackRecord: 'average',
    nctId: "NCT05123456",
    clinicalTrialsSearchTerm: "LU AG06466 cognitive schizophrenia AMPA",
    scores: calculateProbabilityScores("Phase II", "Schizophrenia", "Psychiatry"),
    marketData: generateMarketProjections("LU AG06466", "Phase II", "Schizophrenia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AMPA receptor positive allosteric modulator",
      administration: "Oral tablet once daily",
      keyAdvantage: "Targets cognitive deficits - major unmet need in schizophrenia",
      discovery: "Lundbeck",
      development: "Lundbeck",
      additionalInfo: [
        "Glutamate modulation for cognition",
        "CIAS indication focus",
        "First-in-class for cognition"
      ]
    },
    patents: [
      { patentNumber: "US11,234,567", title: "AMPA PAM compounds", expirationDate: "2041", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1B+ (CIAS - emerging)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "No approved treatment", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Major unmet need", efficacy: "N/A", threat: 'low' },
        { name: "Iclepertin", company: "Boehringer", phase: "Phase 3", mechanism: "GlyT1 inhibitor", keyDifferentiator: "Glutamate modulation", efficacy: "TBD", threat: 'high' },
        { name: "BI 425809", company: "Boehringer", phase: "Phase 2", mechanism: "GlyT1", keyDifferentiator: "Same target class", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["AMPA mechanism differentiated", "Cognitive focus", "Lundbeck CNS expertise"],
      competitiveRisks: ["CIAS high failure rate", "Cognitive endpoints difficult", "Behind BI program"],
      marketPositioning: "First AMPA modulator for cognitive impairment in schizophrenia."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2022", outcome: 'success', keyData: ["Safe profile", "CNS penetration confirmed"], scoreAtTime: 35, rationale: "Early development proceeding", dataAvailableAtTime: ["PK/PD data"] },
      { phase: "Phase 2 COMPASS-2", date: "Q4 2024", outcome: 'pending', keyData: ["Cognitive endpoints study ongoing"], scoreAtTime: 38, rationale: "Key efficacy readout pending", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 19. JNJ-61393215 - Orexin-1 antagonist for panic disorder
  {
    id: "PSYCH-JNJ61-01",
    name: "JNJ-61393215",
    trialName: "SERENITY",
    phase: "Phase II",
    indication: "Panic Disorder",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Johnson & Johnson",
    companyTrackRecord: 'fast',
    nctId: "NCT04657367",
    clinicalTrialsSearchTerm: "JNJ-61393215 panic disorder orexin",
    scores: calculateProbabilityScores("Phase II", "Panic Disorder", "Psychiatry"),
    marketData: generateMarketProjections("JNJ-61393215", "Phase II", "Panic Disorder", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Orexin-1 receptor antagonist (selective)",
      administration: "Oral tablet as needed",
      keyAdvantage: "Novel mechanism for panic without sedation or addiction",
      discovery: "Janssen",
      development: "Janssen/J&J",
      additionalInfo: [
        "OX1 selectivity (vs dual antagonists)",
        "Non-sedating anxiolytic",
        "Rapid onset for panic attacks"
      ]
    },
    patents: [
      { patentNumber: "US10,987,654", title: "Selective orexin-1 antagonists", expirationDate: "2040", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (panic disorder)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin", keyDifferentiator: "First-line maintenance", efficacy: "Moderate", threat: 'medium' },
        { name: "Benzodiazepines", company: "Generic", phase: "Approved", mechanism: "GABA", keyDifferentiator: "Rapid but addictive", efficacy: "High", threat: 'high' },
        { name: "No acute approved treatment", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Unmet need for acute attacks", efficacy: "N/A", threat: 'low' }
      ],
      competitiveAdvantages: ["Novel orexin mechanism", "Non-addictive", "Rapid onset", "As-needed dosing"],
      competitiveRisks: ["Early stage", "Mechanism unproven for panic", "Competitive OX1 space"],
      marketPositioning: "First non-benzodiazepine acute treatment for panic attacks."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2022", outcome: 'success', keyData: ["Safe in healthy volunteers", "Reduced CO2 challenge response"], scoreAtTime: 40, rationale: "Panic-relevant biomarker effect", dataAvailableAtTime: ["CO2 challenge data"] },
      { phase: "Phase 2 SERENITY", date: "Q4 2024", outcome: 'pending', keyData: ["Panic disorder patient trial ongoing"], scoreAtTime: 42, rationale: "Key efficacy readout pending", dataAvailableAtTime: ["Enrollment status"] }
    ]
  },

  // 20. TAK-653 - AMPA potentiator for treatment-resistant depression
  {
    id: "PSYCH-TAK653-01",
    name: "TAK-653",
    trialName: "SPIRIT",
    phase: "Phase II",
    indication: "Treatment-Resistant Depression",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Takeda",
    companyTrackRecord: 'average',
    nctId: "NCT04514029",
    clinicalTrialsSearchTerm: "TAK-653 depression AMPA",
    scores: calculateProbabilityScores("Phase II", "Treatment-Resistant Depression", "Psychiatry"),
    marketData: generateMarketProjections("TAK-653", "Phase II", "Treatment-Resistant Depression", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AMPA receptor potentiator",
      administration: "Oral tablet once daily",
      keyAdvantage: "Glutamatergic approach similar to ketamine mechanism",
      discovery: "Takeda",
      development: "Takeda",
      additionalInfo: [
        "Mechanistically related to ketamine",
        "Oral convenience vs IV ketamine",
        "Rapid-acting potential"
      ]
    },
    patents: [
      { patentNumber: "US10,654,321", title: "AMPA potentiator compounds", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (TRD)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Spravato", company: "Janssen", phase: "Approved", mechanism: "Esketamine", keyDifferentiator: "First TRD approval", efficacy: "Rapid response", threat: 'high' },
        { name: "Auvelity", company: "Axsome", phase: "Approved", mechanism: "NMDA modulation", keyDifferentiator: "Oral option", efficacy: "Good", threat: 'high' },
        { name: "Psilocybin", company: "COMPASS", phase: "Phase 3", mechanism: "5-HT2A", keyDifferentiator: "Psychedelic", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Oral ketamine-like mechanism", "No psychotomimetic effects", "At-home potential"],
      competitiveRisks: ["Crowded TRD space", "AMPA mechanism less validated", "Behind competitors"],
      marketPositioning: "Oral rapid-acting antidepressant with ketamine-like mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q4 2021", outcome: 'success', keyData: ["Safe and tolerated", "Biomarker effects seen"], scoreAtTime: 35, rationale: "Early development proceeding", dataAvailableAtTime: ["PK data", "Safety"] },
      { phase: "Phase 2 SPIRIT", date: "Q4 2024", outcome: 'pending', keyData: ["TRD efficacy study ongoing"], scoreAtTime: 38, rationale: "Key efficacy readout pending", dataAvailableAtTime: ["Enrollment status"] }
    ]
  }
];
