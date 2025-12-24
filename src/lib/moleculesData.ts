// Comprehensive Molecule Database - 20 molecules across all Therapeutic Areas
// Each molecule includes full analysis with retrospective timeline, patents, competitive landscape

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
  type ProbabilityScores,
  type MarketData
} from './scoring';
import { type PatentInfo } from '@/components/PatentTimeline';
import { type CompetitiveLandscape } from '@/components/CompetitiveAnalysis';
import { type LaunchFactors } from './launchFactors';

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

export interface TherapeuticIndex {
  value: number; // TI ratio (higher = safer)
  classification: 'narrow' | 'moderate' | 'wide';
  td50?: number; // Median toxic dose
  ed50?: number; // Median effective dose
  monitoringRequired: boolean;
  notes?: string;
}

export interface MoleculeProfile {
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
  clinicalTrialsSearchTerm?: string;
  hasRetrospective?: boolean;
  retrospectivePhases?: TimelinePhase[];
  patents?: PatentInfo[];
  regulatoryExclusivity?: { type: string; endDate: string; }[];
  competitiveLandscape?: CompetitiveLandscape;
  launchFactors?: LaunchFactors;
  therapeuticIndex?: TherapeuticIndex;
  drugInfo?: {
    class: string;
    administration: string;
    keyAdvantage?: string;
    discovery?: string;
    license?: string;
    development?: string;
    additionalInfo?: string[];
  };
}

// 20 NEW MOLECULES - One per Therapeutic Area with Full Analysis
export const additionalMolecules: MoleculeProfile[] = [
  // 1. ONCOLOGY/HEMATOLOGY - Novel Bispecific
  {
    id: "GLOF-01",
    name: "Glofitamab (Columvi)",
    trialName: "NP30179",
    phase: "Approved",
    indication: "Relapsed/Refractory Diffuse Large B-Cell Lymphoma",
    therapeuticArea: "Oncology/Hematology",
    company: "Roche/Genentech",
    companyTrackRecord: 'fast',
    nctId: "NCT03075696",
    scores: calculateProbabilityScores("Approved", "Diffuse Large B-Cell Lymphoma", "Oncology"),
    marketData: generateMarketProjections("Glofitamab", "Approved", "Diffuse Large B-Cell Lymphoma", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,562,973", title: "Bispecific T-cell engaging antibodies", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,254,744", title: "Methods of treating B-cell malignancies", expirationDate: "2039", type: 'method', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "Orphan Drug Exclusivity", endDate: "2030" },
      { type: "NCE Exclusivity", endDate: "2028" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (DLBCL/NHL)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Yescarta (CAR-T)", company: "Gilead/Kite", phase: "Approved", mechanism: "CAR-T cell therapy", keyDifferentiator: "One-time curative potential", efficacy: "~40% CR rate", threat: 'high' },
        { name: "Tecartus (CAR-T)", company: "Gilead/Kite", phase: "Approved", mechanism: "CAR-T cell therapy", keyDifferentiator: "MCL focused", efficacy: "~65% CR in MCL", threat: 'medium' },
        { name: "Mosunetuzumab", company: "Roche", phase: "Approved", mechanism: "CD20xCD3 bispecific", keyDifferentiator: "Same company, different dosing", efficacy: "~40% CR", threat: 'low' },
        { name: "Epcoritamab", company: "AbbVie/Genmab", phase: "Approved", mechanism: "CD20xCD3 bispecific", keyDifferentiator: "SC administration", efficacy: "~40% CR", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Fixed-duration treatment (8 cycles) vs continuous",
        "Off-the-shelf vs CAR-T manufacturing delays",
        "39% complete response rate in heavily pretreated",
        "No need for apheresis/manufacturing time",
        "Roche oncology commercial excellence"
      ],
      competitiveRisks: [
        "CRS risk requires step-up dosing",
        "Competition from other bispecifics (epcoritamab)",
        "CAR-T curative potential in select patients",
        "Hospitalization for first doses"
      ],
      marketPositioning: "Off-the-shelf bispecific antibody offering CAR-T-like efficacy without manufacturing delays."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2019", trialName: "NP30179", outcome: 'success', keyData: ["Strong ORR in R/R DLBCL", "Manageable CRS with step-up dosing"], scoreAtTime: 48, rationale: "Novel bispecific with early efficacy signals", dataAvailableAtTime: ["Phase 1 dose-escalation"] },
      { phase: "Phase 2 Pivotal", date: "Q4 2022", outcome: 'success', keyData: ["39% CR rate", "Durable responses at 12 months"], scoreAtTime: 78, rationale: "Strong pivotal data supports filing", dataAvailableAtTime: ["Pivotal cohort data"] },
      { phase: "FDA Approval", date: "Jun 2023", outcome: 'success', keyData: ["Accelerated approval granted", "First CD20xCD3 for DLBCL in US"], scoreAtTime: 95, rationale: "Approved - commercial launch underway", dataAvailableAtTime: ["Commercial data emerging"] }
    ],
    drugInfo: {
      class: "CD20xCD3 bispecific T-cell engaging antibody",
      administration: "Intravenous infusion with step-up dosing",
      keyAdvantage: "Off-the-shelf therapy with CAR-T-like efficacy without manufacturing delays",
      discovery: "Roche/Genentech",
      development: "Global rights held by Roche"
    }
  },

  // 2. CARDIOVASCULAR - Novel Heart Failure Therapy
  {
    id: "OMEC-01",
    name: "Omecamtiv Mecarbil",
    trialName: "GALACTIC-HF",
    phase: "Phase III/NDA Pending",
    indication: "Heart Failure with Reduced Ejection Fraction",
    therapeuticArea: "Cardiovascular",
    company: "Cytokinetics/Amgen",
    companyTrackRecord: 'average',
    nctId: "NCT02929329",
    scores: calculateProbabilityScores("Phase III", "Heart Failure", "Cardiology"),
    marketData: generateMarketProjections("Omecamtiv Mecarbil", "Phase III", "Heart Failure", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US8,410,291", title: "Cardiac myosin activators", expirationDate: "2031", type: 'composition', status: 'active' },
      { patentNumber: "US9,670,199", title: "Methods of treating heart failure", expirationDate: "2034", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (HFrEF)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Entresto", company: "Novartis", phase: "Approved", mechanism: "ARNI", keyDifferentiator: "Standard of care", efficacy: "20% RRR in CV death/HF hosp", threat: 'high' },
        { name: "Jardiance/Farxiga", company: "Lilly/AZ", phase: "Approved", mechanism: "SGLT2i", keyDifferentiator: "Broad benefits", efficacy: "25% RRR in HF hosp", threat: 'high' },
        { name: "Vericiguat", company: "Merck/Bayer", phase: "Approved", mechanism: "sGC stimulator", keyDifferentiator: "For worsening HF", efficacy: "10% RRR", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Novel mechanism: direct cardiac myosin activator",
        "8% relative risk reduction in GALACTIC-HF",
        "Additive to current therapies",
        "Greatest benefit in sickest patients (low EF)"
      ],
      competitiveRisks: [
        "Modest overall effect size",
        "Failed to meet endpoints in some subgroups",
        "Crowded HFrEF market",
        "Regulatory uncertainty after FDA CRL"
      ],
      marketPositioning: "First-in-class cardiac myosin activator for patients with low ejection fraction."
    },
    retrospectivePhases: [
      { phase: "Phase 2 COSMIC-HF", date: "Q2 2016", outcome: 'success', keyData: ["Improved stroke volume", "Dose-dependent effect"], scoreAtTime: 52, rationale: "Proof of mechanism established", dataAvailableAtTime: ["Hemodynamic data"] },
      { phase: "Phase 3 GALACTIC-HF", date: "Oct 2020", outcome: 'success', keyData: ["8% RRR in primary endpoint", "Benefit in low EF subset"], scoreAtTime: 62, rationale: "Met primary endpoint but modest effect", dataAvailableAtTime: ["Pivotal results"] },
      { phase: "FDA Filing/CRL", date: "Q4 2023", outcome: 'setback', keyData: ["Complete Response Letter received", "Additional data requested"], scoreAtTime: 45, rationale: "Regulatory setback, resubmission planned", dataAvailableAtTime: ["FDA feedback"] }
    ],
    drugInfo: {
      class: "First-in-class cardiac myosin activator",
      administration: "Oral tablet twice daily",
      keyAdvantage: "Novel mechanism that directly increases cardiac contractility without increasing intracellular calcium",
      discovery: "Cytokinetics",
      license: "Amgen collaboration (2006)",
      development: "Co-developed by Cytokinetics and Amgen"
    }
  },

  // 3. NEUROLOGY/CNS - Parkinson's Disease Modifier
  {
    id: "PRAZ-01",
    name: "Prasinezumab",
    trialName: "PASADENA/PADOVA",
    phase: "Phase II/III",
    indication: "Early Parkinson's Disease",
    therapeuticArea: "Neurology/CNS",
    company: "Roche/Prothena",
    companyTrackRecord: 'fast',
    nctId: "NCT03100149",
    scores: calculateProbabilityScores("Phase II", "Parkinson's Disease", "Neurology"),
    marketData: generateMarketProjections("Prasinezumab", "Phase II", "Parkinson's Disease", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,259,868", title: "Anti-alpha-synuclein antibodies", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$6B+ (Parkinson's)",
      projectedGrowth: "7% CAGR",
      keyPlayers: [
        { name: "Levodopa/Carbidopa", company: "Generic", phase: "Approved", mechanism: "Dopamine precursor", keyDifferentiator: "Gold standard symptomatic", efficacy: "High initially, wanes", threat: 'low' },
        { name: "Produodopa", company: "AbbVie", phase: "Approved", mechanism: "Continuous L-dopa infusion", keyDifferentiator: "Continuous delivery", efficacy: "Reduced OFF time", threat: 'low' },
        { name: "Cinpanemab", company: "Biogen", phase: "Discontinued", mechanism: "Anti-α-syn antibody", keyDifferentiator: "Was competitor", efficacy: "Failed Phase 2", threat: 'low' },
      ],
      competitiveAdvantages: [
        "Potential first disease-modifying therapy for PD",
        "PASADENA showed slowing in motor progression",
        "Strong α-synuclein target engagement",
        "Roche CNS expertise"
      ],
      competitiveRisks: [
        "Missed primary endpoint in PASADENA",
        "CNS trials historically high failure rate",
        "Long development timeline",
        "Biomarker selection challenges"
      ],
      marketPositioning: "Potential first disease-modifying therapy targeting alpha-synuclein in Parkinson's."
    },
    retrospectivePhases: [
      { phase: "Phase 2 PASADENA", date: "Apr 2022", outcome: 'partial', keyData: ["Missed primary MDS-UPDRS endpoint", "Trend in motor progression slowing", "Subgroup benefit in rapid progressors"], scoreAtTime: 35, rationale: "Mixed results but signal in subgroups", dataAvailableAtTime: ["52-week primary data"] },
      { phase: "OLE Extension", date: "Q3 2023", outcome: 'success', keyData: ["Continued benefit in OLE", "Greater separation at 4 years", "PADOVA Phase 2b initiated"], scoreAtTime: 42, rationale: "Long-term data encouraging", dataAvailableAtTime: ["4-year OLE data"] }
    ],
    drugInfo: {
      class: "Anti-alpha-synuclein humanized monoclonal antibody",
      administration: "Intravenous infusion every 4 weeks",
      keyAdvantage: "Potential first disease-modifying therapy targeting aggregated alpha-synuclein in Parkinson's",
      discovery: "Prothena Biosciences",
      license: "Roche collaboration (2013)",
      development: "Joint development by Roche and Prothena"
    }
  },

  // 4. PSYCHIATRY/MENTAL HEALTH - Treatment-Resistant Depression
  {
    id: "AUVE-01",
    name: "Auvecq (Auvelity Alternative)",
    trialName: "GEMINI/EVOLVE",
    phase: "Phase III",
    indication: "Treatment-Resistant Depression",
    therapeuticArea: "Psychiatry/Mental Health",
    company: "Axsome Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT04019704",
    scores: calculateProbabilityScores("Phase III", "Major Depressive Disorder", "Psychiatry"),
    marketData: generateMarketProjections("AXS-05 TRD", "Phase III", "Major Depressive Disorder", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,806,709", title: "DXM/Bupropion combination", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (TRD)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Spravato", company: "J&J", phase: "Approved", mechanism: "Esketamine nasal", keyDifferentiator: "First TRD approval", efficacy: "~50% response", threat: 'high' },
        { name: "Auvelity", company: "Axsome", phase: "Approved", mechanism: "DXM/Bupropion", keyDifferentiator: "Oral, rapid onset", efficacy: "~40% remission", threat: 'low' },
        { name: "SSRIs/SNRIs", company: "Generic", phase: "Approved", mechanism: "Serotonin modulation", keyDifferentiator: "First-line standard", efficacy: "30-40% response", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Oral administration (vs intranasal Spravato)",
        "No REMS monitoring requirement",
        "Rapid onset within 1 week",
        "Novel NMDA mechanism"
      ],
      competitiveRisks: [
        "Spravato has first-mover advantage in TRD",
        "Psilocybin/psychedelics emerging",
        "Generic bupropion/DXM perception"
      ],
      marketPositioning: "Oral rapid-acting antidepressant for treatment-resistant depression."
    },
    retrospectivePhases: [
      { phase: "Phase 3 GEMINI", date: "Q2 2020", outcome: 'success', keyData: ["Met primary endpoint", "MADRS reduction significant", "Rapid onset at Week 1"], scoreAtTime: 65, rationale: "Positive pivotal in TRD", dataAvailableAtTime: ["GEMINI results"] },
      { phase: "FDA Filing", date: "Q4 2024", outcome: 'pending', keyData: ["sNDA submitted for TRD", "Review underway"], scoreAtTime: 68, rationale: "Regulatory review ongoing", dataAvailableAtTime: ["Filing accepted"] }
    ],
    drugInfo: {
      class: "NMDA receptor antagonist + norepinephrine-dopamine reuptake inhibitor combination",
      administration: "Oral tablet once daily",
      keyAdvantage: "Rapid onset within 1 week, oral administration without REMS monitoring requirements",
      discovery: "Axsome Therapeutics",
      development: "Worldwide rights held by Axsome Therapeutics"
    }
  },

  // 5. ENDOCRINOLOGY & METABOLISM - Growth Hormone
  {
    id: "SOMA-01",
    name: "Somapacitan (Sogroya)",
    trialName: "REAL",
    phase: "Approved",
    indication: "Growth Hormone Deficiency",
    therapeuticArea: "Endocrinology & Metabolism",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT02382939",
    scores: calculateProbabilityScores("Approved", "Growth Hormone Deficiency", "Metabolic"),
    marketData: generateMarketProjections("Somapacitan", "Approved", "Growth Hormone Deficiency", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,884,901", title: "Long-acting growth hormone derivatives", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (GH market)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Genotropin", company: "Pfizer", phase: "Approved", mechanism: "Daily rGH", keyDifferentiator: "Market leader", efficacy: "Standard", threat: 'medium' },
        { name: "Norditropin", company: "Novo Nordisk", phase: "Approved", mechanism: "Daily rGH", keyDifferentiator: "Same company", efficacy: "Standard", threat: 'low' },
        { name: "Skytrofa", company: "Ascendis", phase: "Approved", mechanism: "Weekly lonapegsomatropin", keyDifferentiator: "First weekly GH", efficacy: "Non-inferior", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Once-weekly dosing convenience",
        "Non-inferior to daily GH",
        "Novo Nordisk distribution excellence",
        "Growing pediatric data"
      ],
      competitiveRisks: [
        "Skytrofa competition",
        "Premium pricing challenges",
        "Biosimilar daily GH pressure"
      ],
      marketPositioning: "Convenient weekly growth hormone for improved patient compliance."
    },
    retrospectivePhases: [
      { phase: "Phase 3 REAL 1", date: "Q3 2019", outcome: 'success', keyData: ["Non-inferior to daily GH", "Weekly dosing validated"], scoreAtTime: 75, rationale: "Positive pivotal in adults", dataAvailableAtTime: ["Adult GHD data"] },
      { phase: "FDA Approval (Adult)", date: "Aug 2020", outcome: 'success', keyData: ["First Novo weekly GH approved", "Adult GHD indication"], scoreAtTime: 90, rationale: "Approval achieved", dataAvailableAtTime: ["Adult launch"] },
      { phase: "Pediatric Approval", date: "Dec 2023", outcome: 'success', keyData: ["Expanded to pediatric GHD", "Full franchise established"], scoreAtTime: 95, rationale: "Full lifecycle achieved", dataAvailableAtTime: ["Pediatric data"] }
    ],
    drugInfo: {
      class: "Long-acting growth hormone analog",
      administration: "Subcutaneous injection once weekly",
      keyAdvantage: "Weekly dosing convenience vs daily injections, non-inferior efficacy",
      discovery: "Novo Nordisk",
      development: "Worldwide rights held by Novo Nordisk"
    }
  },

  // 6. IMMUNOLOGY & INFLAMMATION - Atopic Dermatitis JAK
  {
    id: "ABRO-01",
    name: "Abrocitinib (Cibinqo)",
    trialName: "JADE",
    phase: "Approved",
    indication: "Moderate-to-Severe Atopic Dermatitis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT03349060",
    scores: calculateProbabilityScores("Approved", "Atopic Dermatitis", "Immunology"),
    marketData: generateMarketProjections("Abrocitinib", "Approved", "Atopic Dermatitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,725,461", title: "JAK1 selective inhibitors", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (AD market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13 blocker", keyDifferentiator: "Market leader biologic", efficacy: "High response rates", threat: 'high' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK inhibitor", keyDifferentiator: "Oral JAK competitor", efficacy: "Similar to Cibinqo", threat: 'high' },
        { name: "Olumiant", company: "Lilly", phase: "Approved", mechanism: "JAK1/2 inhibitor", keyDifferentiator: "Less selective JAK", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Oral convenience vs injectable Dupixent",
        "Rapid onset of action",
        "JAK1 selectivity (cleaner profile)",
        "Pfizer commercial reach"
      ],
      competitiveRisks: [
        "Dupixent dominant market position",
        "JAK safety warnings (class effect)",
        "Rinvoq direct competitor",
        "VTE/MACE monitoring requirements"
      ],
      marketPositioning: "Oral JAK1 inhibitor for patients preferring pills over injections."
    },
    retrospectivePhases: [
      { phase: "Phase 3 JADE MONO-1", date: "Q3 2019", outcome: 'success', keyData: ["IGA 0/1 achieved in 44%", "EASI-75 in 62%"], scoreAtTime: 72, rationale: "Strong monotherapy data", dataAvailableAtTime: ["JADE MONO-1 results"] },
      { phase: "Phase 3 JADE COMPARE", date: "Q2 2021", outcome: 'success', keyData: ["Superior to Dupixent at Week 2", "Faster onset than biologic"], scoreAtTime: 78, rationale: "Head-to-head win on speed", dataAvailableAtTime: ["Comparative data"] },
      { phase: "FDA Approval", date: "Jan 2022", outcome: 'success', keyData: ["Approved for moderate-severe AD", "Adults first, adolescents later"], scoreAtTime: 92, rationale: "Commercial launch successful", dataAvailableAtTime: ["Market data"] }
    ],
    drugInfo: {
      class: "Selective JAK1 inhibitor",
      administration: "Oral tablet once daily (100mg or 200mg)",
      keyAdvantage: "Oral convenience with rapid onset of action vs injectable biologics",
      discovery: "Pfizer",
      development: "Worldwide rights held by Pfizer"
    }
  },

  // 7. RHEUMATOLOGY - Lupus Therapy
  {
    id: "ANIF-01",
    name: "Anifrolumab (Saphnelo)",
    trialName: "TULIP",
    phase: "Approved",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Rheumatology",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT02446912",
    scores: calculateProbabilityScores("Approved", "Systemic Lupus Erythematosus", "Rheumatology"),
    marketData: generateMarketProjections("Anifrolumab", "Approved", "Systemic Lupus Erythematosus", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US8,580,265", title: "Anti-IFNAR1 antibodies", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (SLE market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Benlysta", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "First lupus biologic", efficacy: "10-15% response advantage", threat: 'high' },
        { name: "Lupkynis", company: "Aurinia", phase: "Approved", mechanism: "Calcineurin inhibitor", keyDifferentiator: "Lupus nephritis", efficacy: "Renal-focused", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Type I interferon pathway targeting",
        "Significant BICLA response improvement",
        "Steroid-sparing effect",
        "High interferon patients benefit most"
      ],
      competitiveRisks: [
        "Benlysta entrenched position",
        "Subgroup selection needed",
        "Herpes zoster risk",
        "Complex SLE patient population"
      ],
      marketPositioning: "First anti-interferon therapy for moderate-severe lupus patients."
    },
    retrospectivePhases: [
      { phase: "Phase 3 TULIP-1", date: "Q3 2019", outcome: 'setback', keyData: ["Missed primary endpoint (SRI-4)", "BICLA showed benefit"], scoreAtTime: 40, rationale: "First pivotal missed but signal present", dataAvailableAtTime: ["TULIP-1 data"] },
      { phase: "Phase 3 TULIP-2", date: "Q1 2020", outcome: 'success', keyData: ["Met BICLA primary endpoint", "48% vs 31% response"], scoreAtTime: 70, rationale: "Second pivotal positive", dataAvailableAtTime: ["TULIP-2 data"] },
      { phase: "FDA Approval", date: "Aug 2021", outcome: 'success', keyData: ["First anti-IFNAR therapy approved", "New mechanism for SLE"], scoreAtTime: 88, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch"] }
    ],
    drugInfo: {
      class: "Anti-type I interferon receptor (IFNAR1) monoclonal antibody",
      administration: "Intravenous infusion every 4 weeks",
      keyAdvantage: "First therapy targeting type I interferon pathway in lupus, particularly effective in interferon-high patients",
      discovery: "AstraZeneca/MedImmune",
      development: "Worldwide rights held by AstraZeneca"
    }
  },

  // 8. INFECTIOUS DISEASES - RSV Prevention
  {
    id: "NIRS-01",
    name: "Nirsevimab (Beyfortus)",
    trialName: "MELODY/MEDLEY",
    phase: "Approved",
    indication: "RSV Prevention in Infants",
    therapeuticArea: "Infectious Diseases",
    company: "Sanofi/AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT03959488",
    scores: calculateProbabilityScores("Approved", "RSV Prevention", "Infectious Disease"),
    marketData: generateMarketProjections("Nirsevimab", "Approved", "RSV Prevention", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,654,928", title: "Extended half-life RSV antibodies", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (RSV prevention)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Synagis", company: "AstraZeneca", phase: "Approved", mechanism: "Monthly mAb", keyDifferentiator: "Established but monthly", efficacy: "50% reduction", threat: 'low' },
        { name: "Arexvy (vaccine)", company: "GSK", phase: "Approved", mechanism: "Maternal vaccine", keyDifferentiator: "Vaccine approach", efficacy: "60-70% efficacy", threat: 'medium' },
        { name: "Abrysvo (vaccine)", company: "Pfizer", phase: "Approved", mechanism: "Maternal vaccine", keyDifferentiator: "RSVpreF vaccine", efficacy: "Similar to GSK", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Single dose protection for full RSV season",
        "74.5% efficacy against RSV LRTI",
        "All infants eligible (not just high-risk)",
        "No maternal vaccination needed"
      ],
      competitiveRisks: [
        "Supply constraints initially",
        "Maternal vaccine competition",
        "Pricing pressure",
        "Healthcare system integration"
      ],
      marketPositioning: "Universal RSV prevention for all infants with single-dose convenience."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q3 2020", outcome: 'success', keyData: ["70% efficacy in healthy infants", "Single dose durability"], scoreAtTime: 72, rationale: "Strong proof of concept", dataAvailableAtTime: ["Phase 2b results"] },
      { phase: "Phase 3 MELODY", date: "Mar 2022", outcome: 'success', keyData: ["74.5% efficacy vs placebo", "Met primary endpoint"], scoreAtTime: 85, rationale: "Pivotal success", dataAvailableAtTime: ["MELODY results"] },
      { phase: "FDA/EMA Approval", date: "Jul 2023", outcome: 'success', keyData: ["Approved for all infants", "First RSV mAb for universal use"], scoreAtTime: 95, rationale: "Broad approval achieved", dataAvailableAtTime: ["First season data"] }
    ],
    drugInfo: {
      class: "Extended half-life anti-RSV F protein monoclonal antibody",
      administration: "Single intramuscular injection per RSV season",
      keyAdvantage: "Single dose provides full RSV season protection for all infants (not just high-risk)",
      discovery: "AstraZeneca/MedImmune",
      license: "Sanofi collaboration (2017)",
      development: "Co-developed by Sanofi and AstraZeneca"
    }
  },

  // 9. RESPIRATORY/PULMONOLOGY - Severe Asthma
  {
    id: "TEPE-01",
    name: "Tezepelumab (Tezspire)",
    trialName: "NAVIGATOR",
    phase: "Approved",
    indication: "Severe Uncontrolled Asthma",
    therapeuticArea: "Respiratory/Pulmonology",
    company: "AstraZeneca/Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT03347279",
    scores: calculateProbabilityScores("Approved", "Severe Asthma", "Respiratory"),
    marketData: generateMarketProjections("Tezepelumab", "Approved", "Severe Asthma", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US8,637,016", title: "Anti-TSLP antibodies", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (severe asthma)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13 blocker", keyDifferentiator: "Multi-indication", efficacy: "~50% exacerbation reduction", threat: 'high' },
        { name: "Nucala", company: "GSK", phase: "Approved", mechanism: "Anti-IL-5", keyDifferentiator: "Eosinophilic focus", efficacy: "~50% exacerbation reduction", threat: 'medium' },
        { name: "Fasenra", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IL-5Rα", keyDifferentiator: "Same company", efficacy: "Eosinophil depletion", threat: 'low' },
      ],
      competitiveAdvantages: [
        "Broad asthma population (not just eosinophilic)",
        "TSLP upstream mechanism",
        "71% exacerbation reduction in low eos",
        "Potential OCS-sparing"
      ],
      competitiveRisks: [
        "Dupixent strong competitor",
        "Biomarker selection complexity",
        "Crowded severe asthma market",
        "Payer restrictions"
      ],
      marketPositioning: "First and only biologic for severe asthma regardless of phenotype."
    },
    retrospectivePhases: [
      { phase: "Phase 2b PATHWAY", date: "Q3 2017", outcome: 'success', keyData: ["62% exacerbation reduction", "Benefit across phenotypes"], scoreAtTime: 68, rationale: "Proof of broad efficacy", dataAvailableAtTime: ["PATHWAY results"] },
      { phase: "Phase 3 NAVIGATOR", date: "Q2 2021", outcome: 'success', keyData: ["56% exacerbation reduction", "Consistent across subgroups"], scoreAtTime: 82, rationale: "Pivotal success", dataAvailableAtTime: ["NAVIGATOR results"] },
      { phase: "FDA Approval", date: "Dec 2021", outcome: 'success', keyData: ["Broadest severe asthma indication", "No biomarker requirement"], scoreAtTime: 94, rationale: "First upstream biologic approved", dataAvailableAtTime: ["Launch data"] }
    ],
    drugInfo: {
      class: "Anti-thymic stromal lymphopoietin (TSLP) monoclonal antibody",
      administration: "Subcutaneous injection every 4 weeks",
      keyAdvantage: "First and only biologic for severe asthma regardless of phenotype (no biomarker requirement)",
      discovery: "Amgen",
      license: "AstraZeneca collaboration (2012)",
      development: "Co-developed by AstraZeneca and Amgen"
    }
  },

  // 10. GASTROENTEROLOGY & HEPATOLOGY - Crohn's Disease
  {
    id: "MIRA-01",
    name: "Mirikizumab (Omvoh)",
    trialName: "VIVID",
    phase: "Approved",
    indication: "Ulcerative Colitis / Crohn's Disease",
    therapeuticArea: "Gastroenterology & Hepatology",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT03518086",
    scores: calculateProbabilityScores("Approved", "Ulcerative Colitis", "Gastroenterology"),
    marketData: generateMarketProjections("Mirikizumab", "Approved", "Ulcerative Colitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,493,552", title: "Anti-IL-23p19 antibodies", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (IBD market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Skyrizi", company: "AbbVie", phase: "Approved", mechanism: "IL-23 inhibitor", keyDifferentiator: "Best-in-class IL-23", efficacy: "~40-50% remission", threat: 'high' },
        { name: "Stelara", company: "J&J", phase: "Approved", mechanism: "IL-12/23 inhibitor", keyDifferentiator: "First IL-23 blocker", efficacy: "~35-40% remission", threat: 'medium' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK inhibitor", keyDifferentiator: "Oral option", efficacy: "~40% remission", threat: 'high' },
      ],
      competitiveAdvantages: [
        "IV induction for rapid response",
        "Q4W SC maintenance dosing",
        "Strong clinical/endoscopic remission",
        "Eli Lilly commercial excellence"
      ],
      competitiveRisks: [
        "Skyrizi best-in-class competition",
        "Late entry to IL-23 market",
        "IV induction complexity"
      ],
      marketPositioning: "IL-23 inhibitor with IV loading for rapid IBD response."
    },
    retrospectivePhases: [
      { phase: "Phase 3 LUCENT", date: "Q2 2022", outcome: 'success', keyData: ["Clinical remission 24.2% vs 13.3%", "Endoscopic improvement 59% vs 26%"], scoreAtTime: 78, rationale: "Strong UC pivotal data", dataAvailableAtTime: ["LUCENT 1&2 results"] },
      { phase: "FDA Approval (UC)", date: "Oct 2023", outcome: 'success', keyData: ["Approved for UC", "Fourth IL-23 option"], scoreAtTime: 90, rationale: "UC approval achieved", dataAvailableAtTime: ["Commercial launch"] },
      { phase: "Phase 3 VIVID (CD)", date: "Q4 2024", outcome: 'pending', keyData: ["Crohn's disease trials ongoing", "Label expansion expected 2025"], scoreAtTime: 85, rationale: "CD approval pending", dataAvailableAtTime: ["Interim CD data positive"] }
    ],
    drugInfo: {
      class: "Anti-IL-23p19 humanized monoclonal antibody",
      administration: "IV induction (3 doses), then subcutaneous every 4 weeks",
      keyAdvantage: "IV loading enables rapid response, followed by convenient SC maintenance",
      discovery: "Eli Lilly",
      development: "Worldwide rights held by Eli Lilly"
    }
  },

  // 11. NEPHROLOGY/RENAL - Chronic Kidney Disease
  {
    id: "ROXD-01",
    name: "Roxadustat (Evrenzo)",
    trialName: "ROCKIES/SIERRAS",
    phase: "Approved (EU/JP) / Rejected (US)",
    indication: "Anemia of Chronic Kidney Disease",
    therapeuticArea: "Nephrology/Renal",
    company: "FibroGen/AstraZeneca",
    companyTrackRecord: 'average',
    nctId: "NCT02174731",
    scores: calculateProbabilityScores("Phase III", "CKD Anemia", "Nephrology"),
    marketData: generateMarketProjections("Roxadustat", "Phase III", "CKD Anemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US8,629,131", title: "HIF-PHI compounds", expirationDate: "2029", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (CKD anemia)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Epogen/Aranesp", company: "Amgen", phase: "Approved", mechanism: "ESA", keyDifferentiator: "Standard of care", efficacy: "Effective Hb control", threat: 'high' },
        { name: "Mircera", company: "Roche", phase: "Approved", mechanism: "Long-acting ESA", keyDifferentiator: "Monthly dosing", efficacy: "Similar to ESAs", threat: 'medium' },
        { name: "Daprodustat (Jesduvroq)", company: "GSK", phase: "Approved (US)", mechanism: "HIF-PHI", keyDifferentiator: "First US HIF-PHI", efficacy: "Oral alternative", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Oral administration vs injectable ESAs",
        "HIF pathway mechanism",
        "Lower iron requirements",
        "Approved in EU, Japan, China"
      ],
      competitiveRisks: [
        "FDA CRL - CV safety concerns",
        "Daprodustat approved in US first",
        "ESA biosimilars pricing pressure",
        "MACE signal in studies"
      ],
      marketPositioning: "Oral HIF stabilizer approved outside US for CKD anemia convenience."
    },
    retrospectivePhases: [
      { phase: "Phase 3 OLYMPUS", date: "Q2 2020", outcome: 'success', keyData: ["Non-inferior to ESAs", "Oral convenience proven"], scoreAtTime: 62, rationale: "Positive efficacy in NDD-CKD", dataAvailableAtTime: ["OLYMPUS results"] },
      { phase: "FDA CRL", date: "Aug 2021", outcome: 'setback', keyData: ["Complete Response Letter", "CV safety concerns cited", "MACE signal in DD-CKD"], scoreAtTime: 35, rationale: "US approval blocked", dataAvailableAtTime: ["FDA feedback"] },
      { phase: "EU/JP Launch", date: "Q4 2021", outcome: 'success', keyData: ["Approved in EU, Japan, China", "Commercial launch ex-US"], scoreAtTime: 55, rationale: "Regional approvals achieved", dataAvailableAtTime: ["Ex-US market data"] }
    ],
    drugInfo: {
      class: "HIF-PHI (Hypoxia-inducible factor prolyl hydroxylase inhibitor)",
      administration: "Oral tablet three times weekly",
      keyAdvantage: "Oral alternative to injectable ESAs with lower iron requirements",
      discovery: "FibroGen",
      license: "AstraZeneca collaboration (2013)",
      development: "Co-developed by FibroGen and AstraZeneca"
    }
  },

  // 12. DERMATOLOGY - Vitiligo Treatment
  {
    id: "RUXI-01",
    name: "Ruxolitinib Cream (Opzelura)",
    trialName: "TRuE-V",
    phase: "Approved",
    indication: "Vitiligo / Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Incyte",
    companyTrackRecord: 'average',
    nctId: "NCT04052425",
    scores: calculateProbabilityScores("Approved", "Vitiligo", "Dermatology"),
    marketData: generateMarketProjections("Ruxolitinib Cream", "Approved", "Vitiligo", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US8,415,362", title: "Topical JAK inhibitor formulations", expirationDate: "2030", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (vitiligo/topical dermatology)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Phototherapy", company: "Various", phase: "Approved", mechanism: "UV light", keyDifferentiator: "Established treatment", efficacy: "Variable", threat: 'medium' },
        { name: "Topical steroids", company: "Generic", phase: "Approved", mechanism: "Anti-inflammatory", keyDifferentiator: "Cheap, limited efficacy", efficacy: "Low in vitiligo", threat: 'low' },
      ],
      competitiveAdvantages: [
        "First FDA-approved vitiligo treatment",
        "Topical JAK inhibitor convenience",
        "Significant repigmentation achieved",
        "Also approved for AD"
      ],
      competitiveRisks: [
        "Systemic absorption concerns",
        "JAK inhibitor class warnings (boxed warning)",
        "Limited to non-segmental vitiligo",
        "Long treatment duration needed"
      ],
      marketPositioning: "First and only FDA-approved treatment for vitiligo repigmentation."
    },
    retrospectivePhases: [
      { phase: "Phase 3 TRuE-V1&2", date: "Q1 2022", outcome: 'success', keyData: ["30% achieved F-VASI75 at Week 24", "Continued improvement at Week 52"], scoreAtTime: 75, rationale: "First drug to show vitiligo efficacy", dataAvailableAtTime: ["TRuE-V results"] },
      { phase: "FDA Approval (Vitiligo)", date: "Jul 2022", outcome: 'success', keyData: ["First vitiligo treatment approved", "Historic approval"], scoreAtTime: 92, rationale: "First-in-class for vitiligo", dataAvailableAtTime: ["Launch data"] }
    ],
    drugInfo: {
      class: "Topical JAK1/JAK2 inhibitor",
      administration: "Topical cream applied twice daily",
      keyAdvantage: "First and only FDA-approved treatment for vitiligo repigmentation",
      discovery: "Incyte Corporation",
      development: "Worldwide rights held by Incyte"
    }
  },

  // 13. OPHTHALMOLOGY - Diabetic Macular Edema
  {
    id: "FARI-01",
    name: "Faricimab (Vabysmo)",
    trialName: "YOSEMITE/RHINE",
    phase: "Approved",
    indication: "Wet AMD / Diabetic Macular Edema",
    therapeuticArea: "Ophthalmology",
    company: "Roche/Genentech",
    companyTrackRecord: 'fast',
    nctId: "NCT03622580",
    scores: calculateProbabilityScores("Approved", "Diabetic Macular Edema", "Ophthalmology"),
    marketData: generateMarketProjections("Faricimab", "Approved", "Diabetic Macular Edema", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,584,170", title: "Bispecific VEGF/Ang-2 antibodies", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (retinal diseases)",
      projectedGrowth: "7% CAGR",
      keyPlayers: [
        { name: "Eylea", company: "Regeneron", phase: "Approved", mechanism: "VEGF trap", keyDifferentiator: "Market leader", efficacy: "Gold standard", threat: 'high' },
        { name: "Eylea HD", company: "Regeneron", phase: "Approved", mechanism: "High-dose VEGF trap", keyDifferentiator: "Extended dosing", efficacy: "Q12-16W possible", threat: 'high' },
        { name: "Lucentis", company: "Roche/Novartis", phase: "Approved", mechanism: "Anti-VEGF mAb", keyDifferentiator: "First mover", efficacy: "Established", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Bispecific VEGF-A + Ang-2 targeting",
        "Up to Q16W dosing interval",
        "Non-inferior visual gains",
        "Reduced treatment burden"
      ],
      competitiveRisks: [
        "Eylea HD extended dosing competition",
        "Premium pricing challenges",
        "Injection burden still present"
      ],
      marketPositioning: "First bispecific retinal therapy enabling extended treatment intervals."
    },
    retrospectivePhases: [
      { phase: "Phase 3 YOSEMITE/RHINE", date: "Q2 2021", outcome: 'success', keyData: ["Non-inferior to aflibercept q8w", "60%+ achieved Q16W dosing"], scoreAtTime: 82, rationale: "Extended dosing validated", dataAvailableAtTime: ["Pivotal DME data"] },
      { phase: "FDA Approval", date: "Jan 2022", outcome: 'success', keyData: ["Approved for wet AMD and DME", "First bispecific in ophthalmology"], scoreAtTime: 94, rationale: "Dual indication approval", dataAvailableAtTime: ["Commercial launch"] }
    ],
    drugInfo: {
      class: "Bispecific VEGF-A and Angiopoietin-2 (Ang-2) antibody",
      administration: "Intravitreal injection every 8-16 weeks after loading",
      keyAdvantage: "First bispecific in retinal disease enabling up to 4-month dosing intervals",
      discovery: "Roche/Genentech",
      development: "Worldwide rights held by Roche"
    }
  },

  // 14. RARE DISEASES/ORPHAN - Hereditary Angioedema
  {
    id: "DENI-01",
    name: "Denisonab (Deni-HAE)",
    trialName: "CHAPTER",
    phase: "Phase III",
    indication: "Hereditary Angioedema",
    therapeuticArea: "Rare Diseases/Orphan Drugs",
    company: "Pharvaris",
    companyTrackRecord: 'average',
    nctId: "NCT05047068",
    scores: calculateProbabilityScores("Phase III", "Hereditary Angioedema", "Rare Disease"),
    marketData: generateMarketProjections("PHVS416", "Phase III", "Hereditary Angioedema", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,851,087", title: "Bradykinin B2 receptor antagonists", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (HAE market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Takhzyro", company: "Takeda", phase: "Approved", mechanism: "Anti-kallikrein mAb", keyDifferentiator: "SC q2w/q4w", efficacy: "87% attack reduction", threat: 'high' },
        { name: "Orladeyo", company: "BioCryst", phase: "Approved", mechanism: "Oral plasma kallikrein inhibitor", keyDifferentiator: "Oral option", efficacy: "44% attack reduction", threat: 'high' },
        { name: "Haegarda", company: "CSL Behring", phase: "Approved", mechanism: "SC C1-INH", keyDifferentiator: "Established mechanism", efficacy: "Moderate reduction", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Once-daily oral convenience",
        "B2 receptor antagonist (different MOA)",
        "Potential best-in-class oral efficacy",
        "On-demand + prophylaxis potential"
      ],
      competitiveRisks: [
        "Orladeyo has oral first-mover advantage",
        "Takhzyro highly effective SC",
        "Small HAE patient population",
        "Limited Phase 3 data yet"
      ],
      marketPositioning: "Next-generation oral therapy for HAE prophylaxis and on-demand treatment."
    },
    retrospectivePhases: [
      { phase: "Phase 2 RAPIDe-1", date: "Q2 2022", outcome: 'success', keyData: ["Rapid attack resolution", "Oral on-demand proof of concept"], scoreAtTime: 58, rationale: "On-demand efficacy shown", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 CHAPTER-1", date: "Q4 2024", outcome: 'pending', keyData: ["Prophylaxis study ongoing", "Topline expected 2025"], scoreAtTime: 55, rationale: "Pivotal prophylaxis trial", dataAvailableAtTime: ["Enrollment complete"] }
    ],
    drugInfo: {
      class: "Oral bradykinin B2 receptor antagonist",
      administration: "Oral tablet once daily (prophylaxis) or on-demand",
      keyAdvantage: "Potential best-in-class oral efficacy with dual prophylaxis and on-demand treatment",
      discovery: "Pharvaris",
      development: "Worldwide rights held by Pharvaris"
    }
  },

  // 15. VACCINES & VIROLOGY - CMV Vaccine
  {
    id: "CMVV-01",
    name: "CMV mRNA Vaccine (mRNA-1647)",
    trialName: "CMVictory",
    phase: "Phase III",
    indication: "Cytomegalovirus Prevention",
    therapeuticArea: "Vaccines & Virology",
    company: "Moderna",
    companyTrackRecord: 'fast',
    nctId: "NCT05085366",
    scores: calculateProbabilityScores("Phase III", "CMV Vaccine", "Vaccines"),
    marketData: generateMarketProjections("mRNA-1647", "Phase III", "CMV Vaccine", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US11,066,355", title: "CMV mRNA vaccine compositions", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (CMV prevention potential)",
      projectedGrowth: "New market creation",
      keyPlayers: [
        { name: "No approved CMV vaccine", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Unmet need", efficacy: "N/A", threat: 'low' },
        { name: "GSK CMV vaccine", company: "GSK", phase: "Discontinued", mechanism: "Glycoprotein B", keyDifferentiator: "Was competitor", efficacy: "50% efficacy in Ph2", threat: 'low' },
      ],
      competitiveAdvantages: [
        "Potential first CMV vaccine ever",
        "mRNA platform proven with COVID",
        "6 mRNA encoding multiple antigens",
        "Large at-risk population (transplant, pregnancy)"
      ],
      competitiveRisks: [
        "CMV vaccine historically very difficult",
        "Complex immunology",
        "Long development timeline",
        "Efficacy in seronegatives vs seropositives"
      ],
      marketPositioning: "First-in-class mRNA vaccine preventing congenital CMV infection."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2019", outcome: 'success', keyData: ["Strong neutralizing antibody response", "Exceeds natural infection levels"], scoreAtTime: 45, rationale: "Immunogenicity established", dataAvailableAtTime: ["Phase 1 immune data"] },
      { phase: "Phase 2", date: "Q4 2021", outcome: 'success', keyData: ["Durable immune response", "Booster strategy validated"], scoreAtTime: 55, rationale: "Phase 2 supports advancement", dataAvailableAtTime: ["Extended immunogenicity"] },
      { phase: "Phase 3 CMVictory", date: "Q4 2024", outcome: 'pending', keyData: ["Women 16-40 years enrolled", "Primary: prevention of primary CMV infection"], scoreAtTime: 52, rationale: "Pivotal efficacy trial ongoing", dataAvailableAtTime: ["Enrollment progress"] }
    ],
    drugInfo: {
      class: "mRNA vaccine encoding 6 CMV antigens (pentamer + glycoprotein B)",
      administration: "Intramuscular injection (3-dose series)",
      keyAdvantage: "Potential first-ever CMV vaccine using proven mRNA platform technology",
      discovery: "Moderna",
      development: "Worldwide rights held by Moderna"
    }
  },

  // 16. WOMEN'S HEALTH - Endometriosis
  {
    id: "RELO-01",
    name: "Relugolix Combo (Myfembree)",
    trialName: "LIBERTY",
    phase: "Approved",
    indication: "Endometriosis / Uterine Fibroids",
    therapeuticArea: "Women's Health",
    company: "Myovant/Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT03204318",
    scores: calculateProbabilityScores("Approved", "Endometriosis", "Women's Health"),
    marketData: generateMarketProjections("Relugolix Combo", "Approved", "Endometriosis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,251,888", title: "GnRH antagonist combinations", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$6B+ (endometriosis/fibroids)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Orilissa", company: "AbbVie", phase: "Approved", mechanism: "GnRH antagonist", keyDifferentiator: "First oral GnRH", efficacy: "Significant pain reduction", threat: 'high' },
        { name: "Lupron", company: "AbbVie", phase: "Approved", mechanism: "GnRH agonist injection", keyDifferentiator: "Established standard", efficacy: "Effective but SE issues", threat: 'medium' },
      ],
      competitiveAdvantages: [
        "Add-back therapy included (bone protection)",
        "Once-daily oral combination",
        "Long-term use supported",
        "Dual indication (fibroids + endo)"
      ],
      competitiveRisks: [
        "Orilissa established in market",
        "GnRH mechanism class effects",
        "Hormonal therapy hesitancy"
      ],
      marketPositioning: "Complete oral therapy for endometriosis with integrated bone protection."
    },
    retrospectivePhases: [
      { phase: "Phase 3 LIBERTY (Fibroids)", date: "Q2 2020", outcome: 'success', keyData: ["73% menstrual blood loss reduction", "Met primary endpoint"], scoreAtTime: 78, rationale: "Strong fibroid data", dataAvailableAtTime: ["LIBERTY 1&2 results"] },
      { phase: "FDA Approval (Fibroids)", date: "May 2021", outcome: 'success', keyData: ["Approved for uterine fibroids", "First complete oral therapy"], scoreAtTime: 88, rationale: "Fibroid approval achieved", dataAvailableAtTime: ["Launch data"] },
      { phase: "Endometriosis Approval", date: "Aug 2022", outcome: 'success', keyData: ["Label expanded to endometriosis", "Dual indication achieved"], scoreAtTime: 92, rationale: "Full franchise established", dataAvailableAtTime: ["Commercial data"] }
    ],
    drugInfo: {
      class: "GnRH receptor antagonist combination (relugolix + estradiol + norethindrone)",
      administration: "Oral tablet once daily",
      keyAdvantage: "Complete oral therapy with add-back hormones for bone protection and long-term use",
      discovery: "Takeda (relugolix)",
      license: "Myovant Sciences (2016)",
      development: "Co-developed by Myovant and Pfizer"
    }
  },

  // 17. UROLOGY - Overactive Bladder
  {
    id: "VIBG-01",
    name: "Vibegron (Gems)",
    trialName: "EMPOWUR",
    phase: "Approved",
    indication: "Overactive Bladder",
    therapeuticArea: "Urology",
    company: "Urovant/Sumitomo",
    companyTrackRecord: 'average',
    nctId: "NCT03492281",
    scores: calculateProbabilityScores("Approved", "Overactive Bladder", "Urology"),
    marketData: generateMarketProjections("Vibegron", "Approved", "Overactive Bladder", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US9,296,725", title: "Beta-3 adrenergic receptor agonists", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (OAB market)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Myrbetriq", company: "Astellas", phase: "Approved", mechanism: "Beta-3 agonist", keyDifferentiator: "First beta-3", efficacy: "Standard efficacy", threat: 'high' },
        { name: "Antimuscarinics", company: "Generic", phase: "Approved", mechanism: "M3 antagonism", keyDifferentiator: "Cheap, proven", efficacy: "Effective but dry mouth", threat: 'medium' },
        { name: "Botox", company: "AbbVie", phase: "Approved", mechanism: "Neurotoxin injection", keyDifferentiator: "Refractory OAB", efficacy: "Last-line option", threat: 'low' },
      ],
      competitiveAdvantages: [
        "No food effect (vs Myrbetriq)",
        "75mg once daily convenient",
        "Favorable BP profile",
        "Can combine with antimuscarinics"
      ],
      competitiveRisks: [
        "Myrbetriq has first-mover advantage",
        "Generic antimuscarinics cheap",
        "Limited differentiation",
        "Slow market uptake"
      ],
      marketPositioning: "Next-generation beta-3 agonist with improved convenience profile."
    },
    retrospectivePhases: [
      { phase: "Phase 3 EMPOWUR", date: "Q3 2019", outcome: 'success', keyData: ["Significant reduction in daily micturitions", "Improved urgency episodes"], scoreAtTime: 72, rationale: "Positive pivotal results", dataAvailableAtTime: ["EMPOWUR data"] },
      { phase: "FDA Approval", date: "Dec 2020", outcome: 'success', keyData: ["Approved for OAB", "Second beta-3 agonist"], scoreAtTime: 88, rationale: "Approval achieved", dataAvailableAtTime: ["Commercial launch"] }
    ],
    drugInfo: {
      class: "Selective beta-3 adrenergic receptor agonist",
      administration: "Oral tablet once daily (75mg)",
      keyAdvantage: "No food effect and favorable blood pressure profile vs competitor Myrbetriq",
      discovery: "Kissei Pharmaceutical (Japan)",
      license: "Urovant Sciences (2017)",
      development: "Sumitomo Pharma (acquired Urovant 2020)"
    }
  },

  // 18. PAIN MANAGEMENT - Migraine Prevention
  {
    id: "ATOG-01",
    name: "Atogepant (Qulipta)",
    trialName: "ADVANCE/PROGRESS",
    phase: "Approved",
    indication: "Episodic and Chronic Migraine Prevention",
    therapeuticArea: "Pain Management/Anesthesia",
    company: "AbbVie/Allergan",
    companyTrackRecord: 'fast',
    nctId: "NCT03777059",
    scores: calculateProbabilityScores("Approved", "Migraine Prevention", "Pain Management"),
    marketData: generateMarketProjections("Atogepant", "Approved", "Migraine Prevention", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,174,021", title: "CGRP receptor antagonists", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (migraine market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Aimovig", company: "Amgen/Novartis", phase: "Approved", mechanism: "Anti-CGRP receptor mAb", keyDifferentiator: "First CGRP mAb", efficacy: "~50% responder rate", threat: 'high' },
        { name: "Ajovy", company: "Teva", phase: "Approved", mechanism: "Anti-CGRP ligand mAb", keyDifferentiator: "Monthly/quarterly", efficacy: "~50% responder rate", threat: 'medium' },
        { name: "Nurtec ODT", company: "Pfizer/Biohaven", phase: "Approved", mechanism: "Oral CGRP antagonist", keyDifferentiator: "Acute + preventive", efficacy: "Good acute efficacy", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Once-daily oral convenience",
        "No injection needed",
        "Approved for episodic AND chronic migraine",
        "Strong efficacy: 55%+ responder rate"
      ],
      competitiveRisks: [
        "CGRP mAb injectable competitors",
        "Nurtec dual indication competition",
        "Premium pricing in generic-heavy market"
      ],
      marketPositioning: "Only oral CGRP antagonist specifically for migraine prevention."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ADVANCE (Episodic)", date: "Q3 2020", outcome: 'success', keyData: ["Significant reduction in monthly migraine days", "All doses met endpoints"], scoreAtTime: 75, rationale: "Episodic migraine success", dataAvailableAtTime: ["ADVANCE results"] },
      { phase: "FDA Approval (Episodic)", date: "Sep 2021", outcome: 'success', keyData: ["First oral CGRP for prevention", "Episodic migraine approval"], scoreAtTime: 88, rationale: "Initial approval achieved", dataAvailableAtTime: ["Launch data"] },
      { phase: "PROGRESS (Chronic) Approval", date: "Mar 2023", outcome: 'success', keyData: ["Expanded to chronic migraine", "Broadest oral CGRP indication"], scoreAtTime: 92, rationale: "Full migraine prevention franchise", dataAvailableAtTime: ["Chronic data"] }
    ],
    drugInfo: {
      class: "Oral CGRP receptor antagonist (gepant)",
      administration: "Oral tablet once daily (10mg, 30mg, or 60mg)",
      keyAdvantage: "Only oral CGRP antagonist specifically approved for migraine prevention (episodic and chronic)",
      discovery: "Allergan (now AbbVie)",
      development: "Worldwide rights held by AbbVie"
    }
  },

  // 19. TRANSPLANTATION & CELL/GENE - Hemophilia A Gene Therapy
  {
    id: "ROCA-01",
    name: "Roctavian (Valoctocogene Roxaparvovec)",
    trialName: "GENEr8-1",
    phase: "Approved (EU) / Withdrawn (US Process)",
    indication: "Severe Hemophilia A",
    therapeuticArea: "Transplantation & Cell/Gene Therapy",
    company: "BioMarin",
    companyTrackRecord: 'average',
    nctId: "NCT03370913",
    scores: calculateProbabilityScores("Phase III", "Hemophilia A", "Gene Therapy"),
    marketData: generateMarketProjections("Roctavian", "Phase III", "Hemophilia A", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,383,922", title: "AAV-FVIII gene therapy vectors", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (hemophilia)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Hemlibra", company: "Roche", phase: "Approved", mechanism: "Bispecific antibody", keyDifferentiator: "Non-factor therapy", efficacy: "Dramatic bleed reduction", threat: 'high' },
        { name: "Factor VIII products", company: "Various", phase: "Approved", mechanism: "Factor replacement", keyDifferentiator: "Established standard", efficacy: "Effective but frequent dosing", threat: 'medium' },
        { name: "Hemgenix (Hem B)", company: "CSL/uniQure", phase: "Approved", mechanism: "AAV5 gene therapy", keyDifferentiator: "First gene therapy for hem", efficacy: "Durable FIX expression", threat: 'low' },
      ],
      competitiveAdvantages: [
        "One-time treatment potential",
        "Durable FVIII expression",
        "Freedom from prophylaxis",
        "First hemophilia A gene therapy approved (EU)"
      ],
      competitiveRisks: [
        "$2.9M price point",
        "Waning factor levels over time",
        "Hemlibra strong competitor",
        "Pre-existing AAV antibodies limit eligibility",
        "US market challenges"
      ],
      marketPositioning: "One-time gene therapy for severe hemophilia A patients seeking treatment freedom."
    },
    retrospectivePhases: [
      { phase: "Phase 3 GENEr8-1", date: "Q3 2021", outcome: 'success', keyData: ["95% reduction in bleeds", "FVIII levels durable at 2 years"], scoreAtTime: 65, rationale: "Pivotal success but durability questions", dataAvailableAtTime: ["GENEr8-1 results"] },
      { phase: "EMA Approval", date: "Aug 2022", outcome: 'success', keyData: ["First hemophilia A gene therapy approved", "Conditional approval in EU"], scoreAtTime: 75, rationale: "EU approval achieved", dataAvailableAtTime: ["European launch"] },
      { phase: "FDA CRL/Withdrawal", date: "Q4 2023", outcome: 'setback', keyData: ["FDA requested additional data", "US marketing application withdrawn"], scoreAtTime: 50, rationale: "US path uncertain", dataAvailableAtTime: ["Regulatory strategy revision"] }
    ],
    drugInfo: {
      class: "AAV5-based gene therapy delivering Factor VIII gene",
      administration: "Single intravenous infusion (one-time treatment)",
      keyAdvantage: "One-time treatment potential for lifelong freedom from Factor VIII prophylaxis",
      discovery: "BioMarin Pharmaceutical",
      development: "Worldwide rights held by BioMarin"
    }
  },

  // 20. PEDIATRICS - Spinal Muscular Atrophy
  {
    id: "RISA-01",
    name: "Risdiplam (Evrysdi)",
    trialName: "FIREFISH/SUNFISH",
    phase: "Approved",
    indication: "Spinal Muscular Atrophy (All Types)",
    therapeuticArea: "Pediatrics",
    company: "Roche/PTC/SMA Foundation",
    companyTrackRecord: 'fast',
    nctId: "NCT02913482",
    scores: calculateProbabilityScores("Approved", "Spinal Muscular Atrophy", "Rare Disease"),
    marketData: generateMarketProjections("Risdiplam", "Approved", "Spinal Muscular Atrophy", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    patents: [
      { patentNumber: "US10,208,040", title: "SMN2 splicing modifiers", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    regulatoryExclusivity: [
      { type: "Orphan Drug Exclusivity", endDate: "2027" },
      { type: "Pediatric Exclusivity", endDate: "2027.5" },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SMA market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Zolgensma", company: "Novartis", phase: "Approved", mechanism: "AAV9 gene therapy", keyDifferentiator: "One-time curative", efficacy: "Dramatic in infants", threat: 'high' },
        { name: "Spinraza", company: "Biogen", phase: "Approved", mechanism: "Intrathecal ASO", keyDifferentiator: "First SMA therapy", efficacy: "Proven efficacy", threat: 'high' },
      ],
      competitiveAdvantages: [
        "Oral daily liquid - no injections/infusions",
        "Home-based administration",
        "All SMA types and ages",
        "CNS + peripheral distribution",
        "Lower cost than gene therapy"
      ],
      competitiveRisks: [
        "Zolgensma curative appeal for infants",
        "Spinraza long-term data advantage",
        "Requires continuous daily dosing",
        "Photosensitivity concerns"
      ],
      marketPositioning: "First oral SMA treatment enabling convenient home-based therapy for all ages."
    },
    retrospectivePhases: [
      { phase: "Phase 2/3 FIREFISH (Type 1)", date: "Q4 2019", outcome: 'success', keyData: ["41% sitting without support (historically 0%)", "Survival benefit vs natural history"], scoreAtTime: 85, rationale: "Breakthrough in Type 1 SMA", dataAvailableAtTime: ["FIREFISH Part 2"] },
      { phase: "Phase 2/3 SUNFISH (Types 2/3)", date: "Q3 2020", outcome: 'success', keyData: ["Significant MFM-32 improvement", "Benefit across ages"], scoreAtTime: 82, rationale: "Broad SMA efficacy", dataAvailableAtTime: ["SUNFISH Part 2"] },
      { phase: "FDA Approval", date: "Aug 2020", outcome: 'success', keyData: ["First oral SMA therapy approved", "All SMA types, all ages"], scoreAtTime: 95, rationale: "Broad approval achieved", dataAvailableAtTime: ["Commercial launch"] }
    ],
    drugInfo: {
      class: "SMN2 pre-mRNA splicing modifier (small molecule)",
      administration: "Oral liquid once daily",
      keyAdvantage: "First oral SMA treatment enabling convenient home-based therapy for all ages and SMA types",
      discovery: "PTC Therapeutics/SMA Foundation/Roche",
      development: "Worldwide commercial rights held by Roche"
    }
  }
];

// Helper function to calculate overall scores for all molecules
export function calculateMoleculeOverallScores(molecules: MoleculeProfile[]): MoleculeProfile[] {
  return molecules.map(mol => ({
    ...mol,
    overallScore: mol.scores.meetingEndpoints * 0.25 +
                  mol.scores.nextPhase * 0.25 +
                  mol.scores.approval * 0.30 +
                  (1 - mol.scores.dropoutRanking / 5) * 0.20
  }));
}
