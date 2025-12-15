// 20 Dermatology Molecules
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const dermatologyMolecules: MoleculeProfile[] = [
  // 1. Lebrikizumab
  {
    id: "LEBR-01",
    name: "Lebrikizumab (Ebglyss)",
    trialName: "ADvocate",
    phase: "Approved",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT04146363",
    clinicalTrialsSearchTerm: "lebrikizumab",
    scores: calculateProbabilityScores("Approved", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Lebrikizumab", "Approved", "Atopic Dermatitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "IL-13 monoclonal antibody",
      administration: "Every 2 weeks (then monthly) subcutaneous injection",
      keyAdvantage: "Monthly maintenance dosing after loading period",
      discovery: "Roche/Genentech (acquired by Dermira, then Lilly)",
      development: "Global rights held by Eli Lilly",
      additionalInfo: [
        "FDA approved September 2024",
        "EMA approved December 2023",
        "Selective IL-13 targeting (not IL-4)"
      ]
    },
    patents: [
      { patentNumber: "US9,783,604", title: "Anti-IL-13 antibody compositions", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Atopic Dermatitis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13", keyDifferentiator: "Market leader", efficacy: "High response", threat: 'high' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Oral option", efficacy: "Fast onset", threat: 'medium' },
      ],
      competitiveAdvantages: ["Monthly maintenance dosing", "Selective IL-13", "Strong skin clearance"],
      competitiveRisks: ["Dupixent dominant", "Late to market", "Crowded biologics space"],
      marketPositioning: "Differentiated IL-13 blocker with convenient monthly dosing."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ADvocate", date: "Q2 2023", outcome: 'success', keyData: ["43% EASI-75 at week 16", "Monthly dosing validated"], scoreAtTime: 78, rationale: "Positive pivotal results", dataAvailableAtTime: ["ADvocate 1&2 results"] },
      { phase: "FDA Approval", date: "Sep 2024", outcome: 'success', keyData: ["Ebglyss approved", "Commercial launch"], scoreAtTime: 90, rationale: "US market access", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 2. Rocatinlimab (anti-OX40)
  {
    id: "ROCA-01",
    name: "Rocatinlimab (KHK4083)",
    trialName: "ROCKET",
    phase: "Phase III",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Kyowa Kirin/Amgen",
    companyTrackRecord: 'average',
    nctId: "NCT05398445",
    clinicalTrialsSearchTerm: "rocatinlimab",
    scores: calculateProbabilityScores("Phase III", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Rocatinlimab", "Phase III", "Atopic Dermatitis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-OX40 monoclonal antibody",
      administration: "Every 2 weeks subcutaneous injection",
      keyAdvantage: "Novel mechanism targeting T-cell costimulation, potential disease modification",
      discovery: "Kyowa Kirin",
      license: "Amgen (global ex-Japan)",
      development: "Amgen (ex-Japan), Kyowa Kirin (Japan)",
      additionalInfo: [
        "First-in-class OX40 antagonist for AD",
        "May provide sustained remission off-drug",
        "Depletes pathogenic T cells rather than blocking cytokines"
      ]
    },
    patents: [
      { patentNumber: "US10,730,943", title: "Anti-OX40 antibody compositions", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Atopic Dermatitis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13", keyDifferentiator: "Standard of care", efficacy: "Established", threat: 'high' },
        { name: "Amlitelimab", company: "Sanofi", phase: "Phase III", mechanism: "Anti-OX40L", keyDifferentiator: "Same pathway", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["Disease modification potential", "Novel mechanism", "Sustained off-drug effect"],
      competitiveRisks: ["Unproven Phase 3 efficacy", "Amlitelimab competition", "Novel mechanism risks"],
      marketPositioning: "First-in-class OX40 antagonist targeting disease remission."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2022", outcome: 'success', keyData: ["EASI improvement", "Sustained effect post-treatment"], scoreAtTime: 58, rationale: "Novel mechanism validated", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 ROCKET", date: "Q4 2024", outcome: 'pending', keyData: ["ROCKET-1 and ROCKET-2 ongoing", "Results expected 2025"], scoreAtTime: 55, rationale: "Pivotal trials advancing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 3. Amlitelimab (anti-OX40L)
  {
    id: "AMLI-01",
    name: "Amlitelimab (SAR445229)",
    trialName: "STREAM-AD",
    phase: "Phase III",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Sanofi",
    companyTrackRecord: 'fast',
    nctId: "NCT06012461",
    clinicalTrialsSearchTerm: "amlitelimab",
    scores: calculateProbabilityScores("Phase III", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Amlitelimab", "Phase III", "Atopic Dermatitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-OX40 ligand (OX40L) monoclonal antibody",
      administration: "Subcutaneous injection (dosing TBD)",
      keyAdvantage: "Blocks OX40L, potentially disrupting T-cell pathogenic memory",
      discovery: "Sanofi internal development",
      development: "Global rights held by Sanofi",
      additionalInfo: [
        "Targets OX40 ligand rather than receptor",
        "May provide disease-modifying effect",
        "Sanofi's next-gen AD therapy beyond Dupixent"
      ]
    },
    patents: [
      { patentNumber: "WO2020/021061", title: "Anti-OX40L antibody compounds", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Atopic Dermatitis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13", keyDifferentiator: "Sanofi's current leader", efficacy: "Standard", threat: 'low' },
        { name: "Rocatinlimab", company: "Amgen/Kyowa", phase: "Phase III", mechanism: "Anti-OX40", keyDifferentiator: "Same pathway", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["Sanofi resources", "Dupixent franchise synergy", "Disease modification potential"],
      competitiveRisks: ["Novel mechanism uncertainty", "Rocatinlimab competition", "Cannibalization of Dupixent"],
      marketPositioning: "Sanofi's next-generation AD therapy with disease-modifying potential."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2023", outcome: 'success', keyData: ["Strong EASI reduction", "Sustained effect signals"], scoreAtTime: 62, rationale: "Compelling Phase 2 data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 STREAM-AD", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 3 initiated", "Multiple studies planned"], scoreAtTime: 60, rationale: "Large pivotal program", dataAvailableAtTime: ["Study designs"] }
    ]
  },

  // 4. Spesolimab (pustular psoriasis)
  {
    id: "SPES-01",
    name: "Spesolimab (Spevigo)",
    trialName: "EFFISAYIL",
    phase: "Approved",
    indication: "Generalized Pustular Psoriasis",
    therapeuticArea: "Dermatology",
    company: "Boehringer Ingelheim",
    companyTrackRecord: 'average',
    nctId: "NCT03782792",
    clinicalTrialsSearchTerm: "spesolimab",
    scores: calculateProbabilityScores("Approved", "Pustular Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Spesolimab", "Approved", "Pustular Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-36 receptor monoclonal antibody",
      administration: "IV infusion (flares) / SC injection (maintenance)",
      keyAdvantage: "First approved therapy specifically for GPP flares",
      discovery: "Boehringer Ingelheim internal development",
      development: "Global rights held by Boehringer Ingelheim",
      additionalInfo: [
        "FDA approved September 2022 for GPP flares",
        "Also approved for flare prevention (2024)",
        "Targets IL-36 pathway central to pustular psoriasis"
      ]
    },
    patents: [
      { patentNumber: "US10,611,838", title: "Anti-IL-36R antibody compositions", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B (GPP market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Imsidolimab", company: "Anaptysbio", phase: "Phase III", mechanism: "Anti-IL-36R", keyDifferentiator: "Competitor", efficacy: "TBD", threat: 'high' },
        { name: "IL-17/IL-23 inhibitors", company: "Various", phase: "Approved", mechanism: "Off-label use", keyDifferentiator: "Established in psoriasis", efficacy: "Variable in GPP", threat: 'medium' },
      ],
      competitiveAdvantages: ["First-mover in GPP", "Approved for flares and prevention", "Clear mechanism"],
      competitiveRisks: ["Rare disease market", "Imsidolimab competition", "IV administration for flares"],
      marketPositioning: "Standard of care for generalized pustular psoriasis."
    },
    retrospectivePhases: [
      { phase: "Phase 2 EFFISAYIL", date: "Q4 2021", outcome: 'success', keyData: ["54% clear/almost clear at week 1", "Rapid flare control"], scoreAtTime: 78, rationale: "Breakthrough efficacy in GPP", dataAvailableAtTime: ["EFFISAYIL 1 results"] },
      { phase: "FDA Approval", date: "Sep 2022", outcome: 'success', keyData: ["Spevigo approved for GPP flares", "First in class"], scoreAtTime: 92, rationale: "Historic approval for GPP", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 5. Imsidolimab
  {
    id: "IMSI-01",
    name: "Imsidolimab (ANB019)",
    trialName: "GEMSTONE",
    phase: "Phase III",
    indication: "Generalized Pustular Psoriasis",
    therapeuticArea: "Dermatology",
    company: "AnaptysBio",
    companyTrackRecord: 'slow',
    nctId: "NCT05352750",
    clinicalTrialsSearchTerm: "imsidolimab",
    scores: calculateProbabilityScores("Phase III", "Pustular Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Imsidolimab", "Phase III", "Pustular Psoriasis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-36 receptor monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "SC dosing only (vs spesolimab IV + SC)",
      discovery: "AnaptysBio internal development",
      development: "Global rights held by AnaptysBio",
      additionalInfo: [
        "Competing with spesolimab (Spevigo)",
        "All subcutaneous administration",
        "Also in development for hidradenitis suppurativa"
      ]
    },
    patents: [
      { patentNumber: "US10,653,779", title: "Anti-IL-36R antibody therapeutics", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B (GPP market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Spesolimab (Spevigo)", company: "Boehringer", phase: "Approved", mechanism: "Anti-IL-36R", keyDifferentiator: "First approved", efficacy: "Established", threat: 'high' },
      ],
      competitiveAdvantages: ["All SC dosing", "Potential convenience advantage", "HS indication parallel"],
      competitiveRisks: ["Second-to-market", "Small biotech resources", "Spesolimab established"],
      marketPositioning: "Convenient all-SC alternative to spesolimab in IL-36 pathway."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2022", outcome: 'success', keyData: ["GPP control signals", "SC-only protocol"], scoreAtTime: 52, rationale: "Proof-of-concept achieved", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 3 GEMSTONE", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal GPP trials ongoing", "Results expected 2025"], scoreAtTime: 48, rationale: "Racing spesolimab", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 6. Deucravacitinib (TYK2 inhibitor)
  {
    id: "DEUC-01",
    name: "Deucravacitinib (Sotyktu)",
    trialName: "POETYK",
    phase: "Approved",
    indication: "Plaque Psoriasis",
    therapeuticArea: "Dermatology",
    company: "Bristol-Myers Squibb",
    companyTrackRecord: 'fast',
    nctId: "NCT03611751",
    clinicalTrialsSearchTerm: "deucravacitinib",
    scores: calculateProbabilityScores("Approved", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Deucravacitinib", "Approved", "Psoriasis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective TYK2 inhibitor (allosteric)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Oral efficacy approaching biologics without JAK class safety concerns",
      discovery: "Bristol-Myers Squibb internal development",
      development: "Global rights held by BMS",
      additionalInfo: [
        "FDA approved September 2022",
        "First-in-class selective TYK2 inhibitor",
        "Avoids JAK1/2/3 inhibition (safety advantage)"
      ]
    },
    patents: [
      { patentNumber: "US10,548,895", title: "TYK2 inhibitor compounds", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (Psoriasis)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Skyrizi (risankizumab)", company: "AbbVie", phase: "Approved", mechanism: "IL-23", keyDifferentiator: "Best efficacy", efficacy: ">90% PASI 90", threat: 'high' },
        { name: "Tremfya (guselkumab)", company: "J&J", phase: "Approved", mechanism: "IL-23", keyDifferentiator: "Strong efficacy", efficacy: ">85% PASI 90", threat: 'high' },
        { name: "Otezla", company: "Amgen", phase: "Approved", mechanism: "PDE4 inhibitor", keyDifferentiator: "Oral incumbent", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral convenience", "TYK2 selectivity (safety)", "Superior to Otezla"],
      competitiveRisks: ["Biologics superior efficacy", "New entrant positioning", "IL-23 dominance"],
      marketPositioning: "Best-in-class oral therapy for moderate-to-severe psoriasis."
    },
    retrospectivePhases: [
      { phase: "Phase 3 POETYK", date: "Q1 2022", outcome: 'success', keyData: ["53% PASI 75 at week 16", "Superior to Otezla"], scoreAtTime: 75, rationale: "Clear oral advantage established", dataAvailableAtTime: ["POETYK PSO-1/2 results"] },
      { phase: "FDA Approval", date: "Sep 2022", outcome: 'success', keyData: ["Sotyktu approved", "First TYK2 inhibitor"], scoreAtTime: 88, rationale: "Successful launch", dataAvailableAtTime: ["Commercial data"] }
    ]
  },

  // 7. Bimekizumab
  {
    id: "BIME-01",
    name: "Bimekizumab (Bimzelx)",
    trialName: "BE VIVID/BE READY",
    phase: "Approved",
    indication: "Plaque Psoriasis",
    therapeuticArea: "Dermatology",
    company: "UCB",
    companyTrackRecord: 'average',
    nctId: "NCT03410992",
    clinicalTrialsSearchTerm: "bimekizumab",
    scores: calculateProbabilityScores("Approved", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Bimekizumab", "Approved", "Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual IL-17A and IL-17F inhibitor",
      administration: "Every 4-8 weeks subcutaneous injection",
      keyAdvantage: "Dual IL-17 blockade for faster, deeper responses",
      discovery: "UCB internal development",
      development: "Global rights held by UCB",
      additionalInfo: [
        "FDA approved October 2023 for psoriasis",
        "Also approved for psoriatic arthritis and axSpA",
        "First dual IL-17A/F inhibitor"
      ]
    },
    patents: [
      { patentNumber: "US10,344,086", title: "Dual IL-17A/F antibody compositions", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (Psoriasis)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Cosentyx (secukinumab)", company: "Novartis", phase: "Approved", mechanism: "IL-17A", keyDifferentiator: "First IL-17A", efficacy: "Standard IL-17", threat: 'medium' },
        { name: "Taltz (ixekizumab)", company: "Eli Lilly", phase: "Approved", mechanism: "IL-17A", keyDifferentiator: "Strong data", efficacy: "Standard IL-17", threat: 'medium' },
        { name: "Skyrizi", company: "AbbVie", phase: "Approved", mechanism: "IL-23", keyDifferentiator: "Market leader", efficacy: ">90% PASI 90", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual IL-17 inhibition", "Fastest skin clearance", "Multiple indications"],
      competitiveRisks: ["Candidiasis rates higher", "Crowded IL-17 space", "IL-23 competition"],
      marketPositioning: "Fastest-acting biologic for psoriasis with dual IL-17 blockade."
    },
    retrospectivePhases: [
      { phase: "Phase 3 BE READY", date: "Q2 2020", outcome: 'success', keyData: ["91% PASI 90 at week 16", "Best-in-class speed"], scoreAtTime: 82, rationale: "Superior efficacy demonstrated", dataAvailableAtTime: ["BE READY/VIVID results"] },
      { phase: "FDA Approval", date: "Oct 2023", outcome: 'success', keyData: ["Bimzelx approved for psoriasis", "Launch underway"], scoreAtTime: 90, rationale: "US market entry", dataAvailableAtTime: ["Approval data"] }
    ]
  },

  // 8. Povorcitinib (JAK1 for Vitiligo)
  {
    id: "POVO-01",
    name: "Povorcitinib (TAK-279)",
    trialName: "VOYAGE-1",
    phase: "Phase III",
    indication: "Vitiligo / Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Takeda",
    companyTrackRecord: 'average',
    nctId: "NCT05684952",
    clinicalTrialsSearchTerm: "povorcitinib",
    scores: calculateProbabilityScores("Phase III", "Vitiligo", "Dermatology"),
    marketData: generateMarketProjections("Povorcitinib", "Phase III", "Vitiligo", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral selective JAK1 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Oral JAK1 for multiple inflammatory dermatoses",
      discovery: "Nimbus Therapeutics (acquired by Takeda 2023, $4B)",
      development: "Global rights held by Takeda",
      additionalInfo: [
        "Highly selective for JAK1",
        "Acquired as part of $4B Nimbus deal",
        "Development in vitiligo, AD, and alopecia areata"
      ]
    },
    patents: [
      { patentNumber: "WO2021/168079", title: "JAK1 selective inhibitor compounds", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (Vitiligo + AA)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Opzelura (ruxolitinib)", company: "Incyte", phase: "Approved", mechanism: "Topical JAK1/2", keyDifferentiator: "First vitiligo therapy", efficacy: "Moderate", threat: 'medium' },
        { name: "Litfulo (ritlecitinib)", company: "Pfizer", phase: "Approved", mechanism: "JAK3/TEC", keyDifferentiator: "Oral for AA", efficacy: "AA approved", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral convenience", "JAK1 selectivity", "Takeda resources"],
      competitiveRisks: ["JAK class safety monitoring", "Crowded JAK landscape", "Topical alternatives"],
      marketPositioning: "Oral JAK1 inhibitor for inflammatory dermatology spectrum."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2023", outcome: 'success', keyData: ["Vitiligo repigmentation signals", "Favorable safety profile"], scoreAtTime: 55, rationale: "Proof-of-concept in vitiligo", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 3 VOYAGE", date: "Q4 2024", outcome: 'pending', keyData: ["VOYAGE-1 vitiligo trial ongoing", "AD trials also planned"], scoreAtTime: 52, rationale: "Pivotal development advancing", dataAvailableAtTime: ["Study designs"] }
    ]
  },

  // 9. Ritlecitinib (alopecia areata)
  {
    id: "RITL-01",
    name: "Ritlecitinib (Litfulo)",
    trialName: "ALLEGRO",
    phase: "Approved",
    indication: "Alopecia Areata",
    therapeuticArea: "Dermatology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT03732807",
    clinicalTrialsSearchTerm: "ritlecitinib",
    scores: calculateProbabilityScores("Approved", "Alopecia Areata", "Dermatology"),
    marketData: generateMarketProjections("Ritlecitinib", "Approved", "Alopecia Areata", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "JAK3/TEC kinase inhibitor",
      administration: "Once-daily oral capsule",
      keyAdvantage: "JAK3/TEC selectivity may reduce certain JAK1/2 side effects",
      discovery: "Pfizer internal development",
      development: "Global rights held by Pfizer",
      additionalInfo: [
        "FDA approved June 2023",
        "First therapy for adolescents (12+) with AA",
        "Unique JAK3/TEC mechanism"
      ]
    },
    patents: [
      { patentNumber: "US10,442,809", title: "JAK3 inhibitor compounds", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Alopecia Areata)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Olumiant (baricitinib)", company: "Eli Lilly", phase: "Approved", mechanism: "JAK1/2", keyDifferentiator: "First AA approval", efficacy: "35% SALT50", threat: 'high' },
        { name: "Deuruxolitinib", company: "Sun Pharma", phase: "Phase III", mechanism: "JAK1/2", keyDifferentiator: "Higher selectivity", efficacy: "TBD", threat: 'medium' },
      ],
      competitiveAdvantages: ["JAK3 selectivity", "Pediatric indication (12+)", "Pfizer resources"],
      competitiveRisks: ["Baricitinib established", "Efficacy differences", "Long-term safety monitoring"],
      marketPositioning: "Differentiated JAK inhibitor for alopecia areata including adolescents."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ALLEGRO", date: "Q1 2023", outcome: 'success', keyData: ["31% SALT50 at week 24", "Adolescent data strong"], scoreAtTime: 75, rationale: "Met primary endpoints", dataAvailableAtTime: ["ALLEGRO results"] },
      { phase: "FDA Approval", date: "Jun 2023", outcome: 'success', keyData: ["Litfulo approved", "First pediatric AA drug"], scoreAtTime: 88, rationale: "Market access achieved", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 10. Deuruxolitinib
  {
    id: "DEUX-01",
    name: "Deuruxolitinib (CTP-543)",
    trialName: "THRIVE-AA",
    phase: "Phase III",
    indication: "Alopecia Areata",
    therapeuticArea: "Dermatology",
    company: "Sun Pharma/Concert Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT04518995",
    clinicalTrialsSearchTerm: "deuruxolitinib",
    scores: calculateProbabilityScores("Phase III", "Alopecia Areata", "Dermatology"),
    marketData: generateMarketProjections("Deuruxolitinib", "Phase III", "Alopecia Areata", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective JAK1/2 inhibitor (deuterated)",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Deuterium modification may improve PK and reduce dosing",
      discovery: "Concert Pharmaceuticals (acquired by Sun Pharma)",
      development: "Global rights held by Sun Pharma",
      additionalInfo: [
        "Deuterated analog of ruxolitinib",
        "Potential for improved therapeutic index",
        "Vitiligo development also ongoing"
      ]
    },
    patents: [
      { patentNumber: "US10,508,115", title: "Deuterated JAK inhibitor compounds", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Alopecia Areata)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Olumiant (baricitinib)", company: "Eli Lilly", phase: "Approved", mechanism: "JAK1/2", keyDifferentiator: "First approved", efficacy: "35% SALT50", threat: 'high' },
        { name: "Litfulo (ritlecitinib)", company: "Pfizer", phase: "Approved", mechanism: "JAK3/TEC", keyDifferentiator: "Second approved", efficacy: "31% SALT50", threat: 'high' },
      ],
      competitiveAdvantages: ["Higher response rates in Ph2", "Deuterated stability", "Vitiligo potential"],
      competitiveRisks: ["Third-to-market", "JAK class safety concerns", "FDA complete response letter"],
      marketPositioning: "Potentially best-in-class JAK for AA with deuterium advantage."
    },
    retrospectivePhases: [
      { phase: "Phase 3 THRIVE-AA", date: "Q2 2023", outcome: 'success', keyData: ["42% SALT50 at 24 weeks", "Higher than competitors"], scoreAtTime: 62, rationale: "Strong efficacy data", dataAvailableAtTime: ["THRIVE results"] },
      { phase: "FDA CRL", date: "Dec 2023", outcome: 'setback', keyData: ["Complete Response Letter received", "Manufacturing/CMC issues cited"], scoreAtTime: 45, rationale: "Regulatory delay, not efficacy", dataAvailableAtTime: ["CRL details"] }
    ]
  },

  // 11. Tapinarof (aryl hydrocarbon modulator)
  {
    id: "TAPI-01",
    name: "Tapinarof (Vtama)",
    trialName: "PSOARING",
    phase: "Approved",
    indication: "Plaque Psoriasis",
    therapeuticArea: "Dermatology",
    company: "Dermavant Sciences",
    companyTrackRecord: 'average',
    nctId: "NCT03956355",
    clinicalTrialsSearchTerm: "tapinarof",
    scores: calculateProbabilityScores("Approved", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Tapinarof", "Approved", "Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Aryl hydrocarbon receptor (AhR) agonist",
      administration: "Once-daily topical cream",
      keyAdvantage: "First-in-class topical with novel mechanism, no steroids",
      discovery: "GSK (licensed to Dermavant)",
      development: "Global rights held by Dermavant",
      additionalInfo: [
        "FDA approved May 2022 for psoriasis",
        "Non-steroidal topical with sustained remission",
        "Also in Phase 3 for atopic dermatitis"
      ]
    },
    patents: [
      { patentNumber: "US9,539,239", title: "AhR modulating compounds", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B (Topical psoriasis)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Topical steroids", company: "Generic", phase: "Approved", mechanism: "Various", keyDifferentiator: "Standard of care", efficacy: "Variable", threat: 'high' },
        { name: "Calcipotriene/betamethasone", company: "Various", phase: "Approved", mechanism: "Vitamin D + steroid", keyDifferentiator: "Established combo", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: ["First-in-class mechanism", "Non-steroidal", "Sustained remission off-drug"],
      competitiveRisks: ["Folliculitis side effect", "Steroid pricing competition", "Topical market fragmented"],
      marketPositioning: "Premium non-steroidal topical with disease-modifying potential."
    },
    retrospectivePhases: [
      { phase: "Phase 3 PSOARING", date: "Q4 2021", outcome: 'success', keyData: ["36-40% clear/almost clear at week 12", "Sustained responses off-drug"], scoreAtTime: 72, rationale: "Novel mechanism validated", dataAvailableAtTime: ["PSOARING 1/2/3 results"] },
      { phase: "FDA Approval", date: "May 2022", outcome: 'success', keyData: ["Vtama approved", "First AhR agonist"], scoreAtTime: 85, rationale: "Commercial launch", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 12. Roflumilast cream
  {
    id: "ROFL-01",
    name: "Roflumilast cream (Zoryve)",
    trialName: "DERMIS",
    phase: "Approved",
    indication: "Plaque Psoriasis / Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Arcutis Biotherapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT04211363",
    clinicalTrialsSearchTerm: "roflumilast topical",
    scores: calculateProbabilityScores("Approved", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Roflumilast cream", "Approved", "Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Topical PDE4 inhibitor",
      administration: "Once-daily topical cream",
      keyAdvantage: "First topical PDE4 inhibitor, steroid-free",
      discovery: "Arcutis Biotherapeutics",
      development: "US rights held by Arcutis",
      additionalInfo: [
        "FDA approved July 2022 for psoriasis",
        "FDA approved July 2024 for AD (ages 6+)",
        "Well-tolerated, suitable for sensitive areas"
      ]
    },
    patents: [
      { patentNumber: "US10,898,471", title: "Topical PDE4 inhibitor formulations", expirationDate: "2038", type: 'formulation', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B (Topical psoriasis/AD)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Vtama (tapinarof)", company: "Dermavant", phase: "Approved", mechanism: "AhR agonist", keyDifferentiator: "Novel mechanism", efficacy: "Similar", threat: 'medium' },
        { name: "Eucrisa", company: "Pfizer", phase: "Approved", mechanism: "PDE4 topical", keyDifferentiator: "First PDE4 topical", efficacy: "AD only", threat: 'medium' },
      ],
      competitiveAdvantages: ["Psoriasis + AD indications", "Once-daily dosing", "Good tolerability"],
      competitiveRisks: ["Topical market competitive", "Limited differentiation", "Pricing pressure"],
      marketPositioning: "Versatile non-steroidal topical for psoriasis and AD."
    },
    retrospectivePhases: [
      { phase: "Phase 3 DERMIS", date: "Q1 2022", outcome: 'success', keyData: ["42% IGA success at week 8", "Well-tolerated in sensitive areas"], scoreAtTime: 70, rationale: "Strong psoriasis data", dataAvailableAtTime: ["DERMIS 1/2 results"] },
      { phase: "FDA Approvals", date: "Jul 2022/2024", outcome: 'success', keyData: ["Zoryve approved for psoriasis then AD", "Multi-indication success"], scoreAtTime: 82, rationale: "Dual indication achieved", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 13. Etrasimod (S1P modulator)
  {
    id: "ETRA-01",
    name: "Etrasimod (Velsipity)",
    trialName: "ADVISE",
    phase: "Phase II/III",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT04162769",
    clinicalTrialsSearchTerm: "etrasimod atopic",
    scores: calculateProbabilityScores("Phase III", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Etrasimod", "Phase III", "Atopic Dermatitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral S1P receptor modulator (S1P1,4,5)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Oral option with novel S1P mechanism for AD",
      discovery: "Arena Pharmaceuticals (acquired by Pfizer)",
      development: "Global rights held by Pfizer",
      additionalInfo: [
        "Approved for UC (2023) and planned for AD",
        "S1P mechanism modulates T-cell trafficking",
        "Different mechanism from JAK and IL-13"
      ]
    },
    patents: [
      { patentNumber: "US10,329,279", title: "S1P receptor modulator compounds", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Atopic Dermatitis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13", keyDifferentiator: "Standard biologic", efficacy: "High", threat: 'high' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1", keyDifferentiator: "Oral leader", efficacy: "High", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel S1P mechanism", "Oral convenience", "Pfizer resources"],
      competitiveRisks: ["S1P class cardiac monitoring", "Crowded AD space", "Late to oral market"],
      marketPositioning: "Differentiated oral S1P option for AD if approved."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ADVISE", date: "Q2 2023", outcome: 'success', keyData: ["EASI improvement signals", "Tolerable safety profile"], scoreAtTime: 52, rationale: "AD proof-of-concept", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 3 Planning", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 3 AD trials initiated", "Alopecia areata also explored"], scoreAtTime: 50, rationale: "Advancing to pivotal", dataAvailableAtTime: ["Study designs"] }
    ]
  },

  // 14. Tralokinumab (IL-13)
  {
    id: "TRAL-01",
    name: "Tralokinumab (Adbry)",
    trialName: "ECZTRA",
    phase: "Approved",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "LEO Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT03131648",
    clinicalTrialsSearchTerm: "tralokinumab",
    scores: calculateProbabilityScores("Approved", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Tralokinumab", "Approved", "Atopic Dermatitis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-13 monoclonal antibody",
      administration: "Every 2 weeks subcutaneous injection",
      keyAdvantage: "Selective IL-13 neutralization (does not block IL-4)",
      discovery: "AstraZeneca (licensed to LEO Pharma)",
      development: "Global rights held by LEO Pharma",
      additionalInfo: [
        "FDA approved December 2021",
        "First selective IL-13 inhibitor for AD",
        "Every 2 weeks maintenance dosing"
      ]
    },
    patents: [
      { patentNumber: "US9,234,033", title: "Anti-IL-13 antibody compositions", expirationDate: "2031", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (Atopic Dermatitis)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "IL-4/IL-13", keyDifferentiator: "Market leader", efficacy: "High response", threat: 'high' },
        { name: "Lebrikizumab", company: "Eli Lilly", phase: "Approved", mechanism: "IL-13", keyDifferentiator: "Monthly dosing", efficacy: "Similar", threat: 'high' },
      ],
      competitiveAdvantages: ["Selective IL-13", "LEO dermatology focus", "Established efficacy"],
      competitiveRisks: ["Dupixent dominant", "Lebrikizumab monthly dosing", "Third-line positioning"],
      marketPositioning: "Alternative IL-13 biologic for Dupixent non-responders."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ECZTRA", date: "Q3 2020", outcome: 'success', keyData: ["33% IGA clear/almost clear at week 16", "Good safety profile"], scoreAtTime: 72, rationale: "Approval-enabling data", dataAvailableAtTime: ["ECZTRA 1-3 results"] },
      { phase: "FDA Approval", date: "Dec 2021", outcome: 'success', keyData: ["Adbry approved", "First selective IL-13"], scoreAtTime: 82, rationale: "Commercial launch", dataAvailableAtTime: ["Launch data"] }
    ]
  },

  // 15. Vunakizumab (IL-17A/F nanobody)
  {
    id: "VUNA-01",
    name: "Vunakizumab (M1095)",
    trialName: "VIVID",
    phase: "Phase III",
    indication: "Plaque Psoriasis",
    therapeuticArea: "Dermatology",
    company: "Merck KGaA",
    companyTrackRecord: 'average',
    nctId: "NCT04998266",
    clinicalTrialsSearchTerm: "vunakizumab",
    scores: calculateProbabilityScores("Phase III", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Vunakizumab", "Phase III", "Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual IL-17A/F nanobody (small biologic)",
      administration: "Monthly subcutaneous injection",
      keyAdvantage: "Nanobody format allows for novel dosing and formulation",
      discovery: "Ablynx/Sanofi (licensed to Merck KGaA for derm)",
      development: "Dermatology rights held by Merck KGaA",
      additionalInfo: [
        "Small format (~26 kDa) biologic",
        "Dual IL-17A and IL-17F neutralization",
        "Potentially simpler manufacturing"
      ]
    },
    patents: [
      { patentNumber: "WO2018/134344", title: "IL-17A/F nanobody constructs", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (Psoriasis)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Bimekizumab", company: "UCB", phase: "Approved", mechanism: "IL-17A/F mAb", keyDifferentiator: "First dual IL-17", efficacy: "91% PASI 90", threat: 'high' },
        { name: "Cosentyx/Taltz", company: "Novartis/Lilly", phase: "Approved", mechanism: "IL-17A", keyDifferentiator: "Established", efficacy: "Standard", threat: 'high' },
      ],
      competitiveAdvantages: ["Nanobody format novelty", "Dual IL-17 coverage", "Manufacturing advantages"],
      competitiveRisks: ["Crowded IL-17 space", "Bimekizumab approved", "Late to market"],
      marketPositioning: "Novel nanobody format dual IL-17 inhibitor for psoriasis."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2022", outcome: 'success', keyData: ["85%+ PASI 75 at week 12", "Monthly dosing validated"], scoreAtTime: 55, rationale: "Competitive efficacy signals", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 3 VIVID", date: "Q4 2024", outcome: 'pending', keyData: ["VIVID trials ongoing", "Head-to-head vs adalimumab"], scoreAtTime: 52, rationale: "Pivotal program advancing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 16. Delgocitinib (topical JAK)
  {
    id: "DELG-01",
    name: "Delgocitinib (Corectim)",
    trialName: "ADHERE",
    phase: "Approved (Japan) / Phase III (US)",
    indication: "Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "LEO Pharma/Japan Tobacco",
    companyTrackRecord: 'average',
    nctId: "NCT03826901",
    clinicalTrialsSearchTerm: "delgocitinib",
    scores: calculateProbabilityScores("Phase III", "Atopic Dermatitis", "Dermatology"),
    marketData: generateMarketProjections("Delgocitinib", "Phase III", "Atopic Dermatitis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Topical pan-JAK inhibitor",
      administration: "Twice-daily topical ointment",
      keyAdvantage: "First topical JAK inhibitor approved for AD (Japan)",
      discovery: "Japan Tobacco",
      license: "LEO Pharma (ex-Japan rights)",
      development: "LEO Pharma advancing in US/EU",
      additionalInfo: [
        "Approved in Japan since 2020 (Corectim)",
        "Pan-JAK inhibition (JAK1/2/3, TYK2)",
        "US Phase 3 ongoing for adult and pediatric AD"
      ]
    },
    patents: [
      { patentNumber: "US9,549,938", title: "Topical JAK inhibitor formulations", expirationDate: "2034", type: 'formulation', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B (Topical AD)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Opzelura (ruxolitinib)", company: "Incyte", phase: "Approved", mechanism: "Topical JAK1/2", keyDifferentiator: "US approved", efficacy: "Established", threat: 'high' },
        { name: "Eucrisa (crisaborole)", company: "Pfizer", phase: "Approved", mechanism: "PDE4 topical", keyDifferentiator: "First non-steroid topical", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: ["Japan track record", "Pan-JAK coverage", "LEO derm focus"],
      competitiveRisks: ["Opzelura already approved", "Systemic JAK concerns apply to topical?", "Late to US market"],
      marketPositioning: "Established topical JAK seeking Western market approval."
    },
    retrospectivePhases: [
      { phase: "Japan Approval", date: "Jan 2020", outcome: 'success', keyData: ["Corectim approved in Japan", "First topical JAK for AD"], scoreAtTime: 75, rationale: "First-in-class topical JAK", dataAvailableAtTime: ["Japan data"] },
      { phase: "Phase 3 US (ADHERE)", date: "Q4 2024", outcome: 'pending', keyData: ["ADHERE trials ongoing", "US filing targeted 2025"], scoreAtTime: 58, rationale: "Advancing to US approval", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 17. Izokibep (anti-IL-17A nanobody)
  {
    id: "IZOK-01",
    name: "Izokibep (ABY-035)",
    trialName: "OASIS",
    phase: "Phase III",
    indication: "Psoriatic Arthritis / Plaque Psoriasis",
    therapeuticArea: "Dermatology",
    company: "Affibody/ACELYRIN",
    companyTrackRecord: 'slow',
    nctId: "NCT05352711",
    clinicalTrialsSearchTerm: "izokibep",
    scores: calculateProbabilityScores("Phase III", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("Izokibep", "Phase III", "Psoriasis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-17A affibody (small protein therapeutic)",
      administration: "Weekly/bi-weekly subcutaneous injection",
      keyAdvantage: "Small size may allow higher tissue penetration",
      discovery: "Affibody AB",
      development: "ACELYRIN advancing development",
      additionalInfo: [
        "~17 kDa affibody format (smallest IL-17A blocker)",
        "High potency IL-17A neutralization",
        "May penetrate joints better than antibodies"
      ]
    },
    patents: [
      { patentNumber: "WO2019/145427", title: "IL-17A binding affibodies", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$20B+ (Psoriasis/PsA)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "IL-17A mAb", keyDifferentiator: "First IL-17A", efficacy: "Established", threat: 'high' },
        { name: "Taltz", company: "Eli Lilly", phase: "Approved", mechanism: "IL-17A mAb", keyDifferentiator: "Strong data", efficacy: "Established", threat: 'high' },
      ],
      competitiveAdvantages: ["Small format penetration", "Novel affibody technology", "PsA joint focus"],
      competitiveRisks: ["Crowded IL-17A market", "Small biotech resources", "Unproven format"],
      marketPositioning: "Novel small-format IL-17A blocker potentially superior in joint disease."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2022", outcome: 'success', keyData: ["Rapid ACR responses in PsA", "High PASI responses"], scoreAtTime: 50, rationale: "Small format advantage signals", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 OASIS", date: "Q4 2024", outcome: 'pending', keyData: ["PsA and psoriasis trials ongoing", "Results expected 2025-2026"], scoreAtTime: 48, rationale: "Pivotal development advancing", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 18. Apremilast (Hidradenitis Suppurativa expansion)
  {
    id: "APRE-HS",
    name: "Apremilast (Otezla) for HS",
    trialName: "ADVANCE",
    phase: "Phase III",
    indication: "Hidradenitis Suppurativa",
    therapeuticArea: "Dermatology",
    company: "Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT04109093",
    clinicalTrialsSearchTerm: "apremilast hidradenitis",
    scores: calculateProbabilityScores("Phase III", "Hidradenitis Suppurativa", "Dermatology"),
    marketData: generateMarketProjections("Apremilast HS", "Phase III", "Hidradenitis Suppurativa", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "PDE4 inhibitor",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Oral option for HS with established safety profile",
      discovery: "Celgene (acquired by BMS, then sold to Amgen)",
      development: "Global rights held by Amgen",
      additionalInfo: [
        "Approved for psoriasis and psoriatic arthritis",
        "HS indication would expand label significantly",
        "Oral alternative to anti-TNF biologics"
      ]
    },
    patents: [
      { patentNumber: "US6,962,940", title: "PDE4 inhibitor compounds", expirationDate: "2028", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Hidradenitis Suppurativa)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Humira (adalimumab)", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "First HS drug", efficacy: "Moderate", threat: 'medium' },
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "IL-17A", keyDifferentiator: "Second biologic", efficacy: "Similar to Humira", threat: 'medium' },
        { name: "Bimekizumab", company: "UCB", phase: "Phase III", mechanism: "IL-17A/F", keyDifferentiator: "Dual IL-17", efficacy: "TBD", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral convenience", "Established safety", "Cost advantage vs biologics"],
      competitiveRisks: ["Biologic efficacy superior?", "PDE4 mechanism in HS unproven", "Patent expiry approaching"],
      marketPositioning: "Convenient oral option for moderate HS before biologic escalation."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ADVANCE", date: "Q2 2023", outcome: 'partial', keyData: ["Met primary endpoint marginally", "HiSCR responses modest"], scoreAtTime: 45, rationale: "Mixed results, may not differentiate", dataAvailableAtTime: ["ADVANCE-1 results"] },
      { phase: "FDA Filing Decision", date: "Q4 2024", outcome: 'pending', keyData: ["Regulatory strategy under review", "Label expansion uncertain"], scoreAtTime: 42, rationale: "Regulatory path unclear", dataAvailableAtTime: ["Strategy updates"] }
    ]
  },

  // 19. PF-07038124 (topical RORγt inverse agonist)
  {
    id: "PF70-01",
    name: "PF-07038124",
    trialName: "FOREMOST",
    phase: "Phase II",
    indication: "Plaque Psoriasis / Atopic Dermatitis",
    therapeuticArea: "Dermatology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT04528277",
    clinicalTrialsSearchTerm: "PF-07038124",
    scores: calculateProbabilityScores("Phase II", "Psoriasis", "Dermatology"),
    marketData: generateMarketProjections("PF-07038124", "Phase II", "Psoriasis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Topical RORγt inverse agonist",
      administration: "Topical ointment",
      keyAdvantage: "First-in-class mechanism targeting Th17 pathway locally",
      discovery: "Pfizer internal development",
      development: "Global rights held by Pfizer",
      additionalInfo: [
        "RORγt is master regulator of Th17 differentiation",
        "Reduces IL-17 locally without systemic exposure",
        "Novel mechanism for topical therapy"
      ]
    },
    patents: [
      { patentNumber: "WO2020/132341", title: "RORγt inverse agonist compounds", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B (Topical psoriasis/AD)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Vtama (tapinarof)", company: "Dermavant", phase: "Approved", mechanism: "AhR agonist", keyDifferentiator: "First novel topical", efficacy: "Moderate", threat: 'medium' },
        { name: "Zoryve (roflumilast)", company: "Arcutis", phase: "Approved", mechanism: "PDE4 topical", keyDifferentiator: "Established", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: ["First-in-class mechanism", "Th17 pathway targeting", "Pfizer resources"],
      competitiveRisks: ["Unproven mechanism topically", "Early stage", "Topical IL-17 reduction sufficient?"],
      marketPositioning: "Novel topical targeting the Th17 master switch for psoriasis."
    },
    retrospectivePhases: [
      { phase: "Phase 2 FOREMOST", date: "Q3 2023", outcome: 'success', keyData: ["PASI improvement signals", "Good tolerability"], scoreAtTime: 45, rationale: "Proof-of-concept achieved", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Development Planning", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 2b/3 planning", "Psoriasis and AD both targeted"], scoreAtTime: 42, rationale: "Advancing to larger trials", dataAvailableAtTime: ["Strategy updates"] }
    ]
  },

  // 20. Sonelokimab (IL-17A/F nanobody)
  {
    id: "SONE-01",
    name: "Sonelokimab (M1095)",
    trialName: "VIVID-1",
    phase: "Phase III",
    indication: "Hidradenitis Suppurativa",
    therapeuticArea: "Dermatology",
    company: "Moonlake Immunotherapeutics",
    companyTrackRecord: 'slow',
    nctId: "NCT05322473",
    clinicalTrialsSearchTerm: "sonelokimab",
    scores: calculateProbabilityScores("Phase III", "Hidradenitis Suppurativa", "Dermatology"),
    marketData: generateMarketProjections("Sonelokimab", "Phase III", "Hidradenitis Suppurativa", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Tri-specific nanobody targeting IL-17A, IL-17F, and albumin",
      administration: "Monthly subcutaneous injection",
      keyAdvantage: "Potent dual IL-17 blockade in small nanobody format",
      discovery: "Ablynx/Merck KGaA (licensed to Moonlake)",
      development: "Global rights held by Moonlake",
      additionalInfo: [
        "Nanobody format (~40 kDa)",
        "Albumin binding for half-life extension",
        "Strong Phase 2 HS data"
      ]
    },
    patents: [
      { patentNumber: "WO2018/134344", title: "IL-17A/F nanobody therapeutics", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Hidradenitis Suppurativa)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Bimekizumab", company: "UCB", phase: "Phase III", mechanism: "IL-17A/F mAb", keyDifferentiator: "Large pharma backing", efficacy: "Strong dual IL-17", threat: 'high' },
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "IL-17A", keyDifferentiator: "Approved for HS", efficacy: "Moderate", threat: 'medium' },
      ],
      competitiveAdvantages: ["Exceptional Phase 2 data", "Monthly dosing", "Nanobody penetration"],
      competitiveRisks: ["Small biotech resources", "Bimekizumab competition", "Manufacturing scale"],
      marketPositioning: "Potentially best-in-class IL-17 for hidradenitis suppurativa."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MIRA", date: "Q1 2023", outcome: 'success', keyData: ["79% HiSCR75 at week 24", "Best HS data to date"], scoreAtTime: 68, rationale: "Exceptional HS efficacy", dataAvailableAtTime: ["MIRA results"] },
      { phase: "Phase 3 VIVID", date: "Q4 2024", outcome: 'pending', keyData: ["VIVID-1 and VIVID-2 ongoing", "Results expected 2025"], scoreAtTime: 65, rationale: "Pivotal program on track", dataAvailableAtTime: ["Enrollment data"] }
    ]
  }
];
