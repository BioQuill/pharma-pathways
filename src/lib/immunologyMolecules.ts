// Immunology & Inflammation Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const immunologyMolecules: MoleculeProfile[] = [
  // 1. Spesolimab - Anti-IL-36R for GPP
  {
    id: "SPES-01",
    name: "Spesolimab (Spevigo)",
    trialName: "Effisayil",
    phase: "Approved",
    indication: "Generalized Pustular Psoriasis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Boehringer Ingelheim",
    companyTrackRecord: 'fast',
    nctId: "NCT03782792",
    clinicalTrialsSearchTerm: "spesolimab",
    scores: calculateProbabilityScores("Approved", "Psoriasis", "Immunology"),
    marketData: generateMarketProjections("Spesolimab", "Approved", "Psoriasis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-36 receptor monoclonal antibody",
      administration: "Intravenous infusion",
      keyAdvantage: "First and only approved treatment specifically for GPP flares",
      discovery: "Boehringer Ingelheim",
      development: "Boehringer Ingelheim",
      additionalInfo: [
        "First-in-class IL-36R inhibitor",
        "Rapid onset of action in GPP flares",
        "Addresses life-threatening condition with unmet need"
      ]
    },
    patents: [
      { patentNumber: "US10,479,836", title: "Anti-IL-36R antibodies for pustular diseases", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,203,647", title: "Methods of treating GPP with IL-36R inhibitors", expirationDate: "2038", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (pustular psoriasis)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Imsidolimab", company: "AnaptysBio", phase: "Phase III", mechanism: "Anti-IL-36R", keyDifferentiator: "Subcutaneous administration", efficacy: "Pending", threat: 'high' },
        { name: "Adalimumab", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Broad anti-inflammatory", efficacy: "Limited GPP data", threat: 'low' },
      ],
      competitiveAdvantages: ["First-in-class approval", "Rapid onset of action", "Addresses unmet need"],
      competitiveRisks: ["IV administration", "Rare disease market", "Competition emerging"],
      marketPositioning: "First approved therapy specifically for GPP flares."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q1 2017", outcome: 'success', keyData: ["Favorable PK profile", "Dose-dependent IL-36 blockade"], scoreAtTime: 55, rationale: "Clean safety profile supports development", dataAvailableAtTime: ["Phase 1 SAD/MAD data"] },
      { phase: "Phase 2 Effisayil 1", date: "Q2 2019", outcome: 'success', keyData: ["54% achieved GPPGA 0 at week 1", "Rapid onset"], scoreAtTime: 78, rationale: "Breakthrough efficacy in acute flares", dataAvailableAtTime: ["Pivotal Phase 2 results"] },
      { phase: "FDA Approval", date: "Sep 2022", outcome: 'success', keyData: ["First GPP treatment approved", "Breakthrough therapy designation"], scoreAtTime: 95, rationale: "Historic first-in-class approval", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 2. Bimekizumab - Dual IL-17A/F inhibitor
  {
    id: "BIME-01",
    name: "Bimekizumab (Bimzelx)",
    trialName: "BE MOBILE",
    phase: "Approved",
    indication: "Axial Spondyloarthritis",
    therapeuticArea: "Immunology & Inflammation",
    company: "UCB",
    companyTrackRecord: 'average',
    nctId: "NCT03928704",
    clinicalTrialsSearchTerm: "bimekizumab",
    scores: calculateProbabilityScores("Approved", "Spondyloarthritis", "Immunology"),
    marketData: generateMarketProjections("Bimekizumab", "Approved", "Spondyloarthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual IL-17A and IL-17F inhibitor",
      administration: "Subcutaneous injection",
      keyAdvantage: "Superior efficacy through dual IL-17 blockade",
      discovery: "UCB Pharma",
      development: "UCB Pharma",
      additionalInfo: [
        "First dual IL-17A/F inhibitor",
        "Superior skin clearance vs IL-17A alone",
        "Rapid onset with durable responses"
      ]
    },
    patents: [
      { patentNumber: "US9,957,325", title: "Bispecific IL-17A/F antibodies", expirationDate: "2035", type: 'composition', status: 'active' },
      { patentNumber: "US10,654,940", title: "Treatment of spondyloarthritis with dual IL-17", expirationDate: "2036", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$12B+ (axSpA and psoriasis)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Secukinumab (Cosentyx)", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Market leader", efficacy: "ASAS40 ~40%", threat: 'high' },
        { name: "Ixekizumab (Taltz)", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Strong radiographic data", efficacy: "ASAS40 ~48%", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual IL-17 blockade", "Superior PASI responses", "Consistent efficacy"],
      competitiveRisks: ["Candidiasis rates", "Competitive market", "Biosimilar pressure on class"],
      marketPositioning: "Best-in-class IL-17 inhibitor with dual mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 2b BE AGILE", date: "Q4 2018", outcome: 'success', keyData: ["47% ASAS40 at week 12", "Dose-response established"], scoreAtTime: 74, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Phase 2b results"] },
      { phase: "Phase 3 BE MOBILE", date: "Q2 2022", outcome: 'success', keyData: ["45-47% ASAS40 vs 22% placebo", "Sustained to week 52"], scoreAtTime: 89, rationale: "Robust efficacy supports approval", dataAvailableAtTime: ["Full Phase 3 data"] },
      { phase: "FDA Approval", date: "Oct 2023", outcome: 'success', keyData: ["Approved for axSpA", "Third indication"], scoreAtTime: 95, rationale: "Broad label achieved", dataAvailableAtTime: ["Commercial expansion"] }
    ]
  },

  // 3. Mirikizumab - Anti-IL-23p19 for UC
  {
    id: "MIRI-01",
    name: "Mirikizumab (Omvoh)",
    trialName: "LUCENT",
    phase: "Approved",
    indication: "Ulcerative Colitis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT03518086",
    clinicalTrialsSearchTerm: "mirikizumab",
    scores: calculateProbabilityScores("Approved", "Ulcerative Colitis", "Immunology"),
    marketData: generateMarketProjections("Mirikizumab", "Approved", "Ulcerative Colitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-23p19 monoclonal antibody",
      administration: "IV induction, SC maintenance",
      keyAdvantage: "High clinical remission and histologic-endoscopic mucosal improvement",
      discovery: "Eli Lilly",
      development: "Eli Lilly",
      additionalInfo: [
        "Selective IL-23p19 targeting",
        "Novel endpoint of HEMI achieved",
        "Favorable safety profile"
      ]
    },
    patents: [
      { patentNumber: "US10,100,116", title: "Anti-IL-23p19 antibodies for IBD", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$18B+ (IBD market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Ustekinumab (Stelara)", company: "J&J", phase: "Approved", mechanism: "Anti-IL-12/23", keyDifferentiator: "Established, dual blockade", efficacy: "~15% remission", threat: 'high' },
        { name: "Risankizumab (Skyrizi)", company: "AbbVie", phase: "Approved", mechanism: "Anti-IL-23p19", keyDifferentiator: "Strong CD data", efficacy: "~20% remission", threat: 'high' },
      ],
      competitiveAdvantages: ["High remission rates", "HEMI endpoint", "Clean safety"],
      competitiveRisks: ["Competitive IL-23 market", "IV induction required", "Biosimilar ustekinumab"],
      marketPositioning: "Next-generation IL-23 inhibitor for IBD."
    },
    retrospectivePhases: [
      { phase: "Phase 2 AMAC", date: "Q1 2019", outcome: 'success', keyData: ["24.8% clinical remission vs 4.8% placebo"], scoreAtTime: 76, rationale: "Strong differentiation from anti-TNFs", dataAvailableAtTime: ["Phase 2 efficacy data"] },
      { phase: "Phase 3 LUCENT", date: "Q4 2022", outcome: 'success', keyData: ["24.2% remission at week 12", "49.9% at week 52"], scoreAtTime: 91, rationale: "Consistent efficacy across endpoints", dataAvailableAtTime: ["Full Phase 3 dataset"] },
      { phase: "FDA Approval", date: "Oct 2023", outcome: 'success', keyData: ["Approved for UC", "Crohn's studies ongoing"], scoreAtTime: 95, rationale: "Successful launch in UC", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 4. Deucravacitinib - TYK2 inhibitor for SLE
  {
    id: "DEUC-01",
    name: "Deucravacitinib (Sotyktu)",
    trialName: "POETYK SLE",
    phase: "Phase III",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Immunology & Inflammation",
    company: "Bristol-Myers Squibb",
    companyTrackRecord: 'average',
    nctId: "NCT04728490",
    clinicalTrialsSearchTerm: "deucravacitinib lupus",
    scores: calculateProbabilityScores("Phase III", "Lupus", "Immunology"),
    marketData: generateMarketProjections("Deucravacitinib", "Phase III", "Lupus", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Allosteric TYK2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Selective TYK2 inhibition without JAK-associated safety concerns",
      discovery: "Bristol-Myers Squibb",
      development: "Bristol-Myers Squibb",
      additionalInfo: [
        "First allosteric TYK2 inhibitor",
        "Approved for psoriasis (Sotyktu)",
        "Clean safety vs pan-JAK inhibitors"
      ]
    },
    patents: [
      { patentNumber: "US10,301,305", title: "Allosteric TYK2 inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' },
      { patentNumber: "US10,934,297", title: "Treatment of autoimmune disorders with TYK2", expirationDate: "2039", type: 'method', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SLE market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Anifrolumab (Saphnelo)", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IFNAR1", keyDifferentiator: "First type I IFN inhibitor", efficacy: "~48% BICLA", threat: 'high' },
        { name: "Belimumab (Benlysta)", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "First SLE biologic", efficacy: "~43% SRI-4", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral administration", "Selective mechanism", "Differentiated safety"],
      competitiveRisks: ["Phase 3 pending", "Competitive SLE market", "Efficacy bar high"],
      marketPositioning: "First oral TYK2 inhibitor for systemic lupus erythematosus."
    },
    retrospectivePhases: [
      { phase: "Phase 2 PAISLEY", date: "Q1 2021", outcome: 'success', keyData: ["58% SRI-4 at 48 weeks vs 34% placebo"], scoreAtTime: 72, rationale: "Strong efficacy signal supports Phase 3", dataAvailableAtTime: ["Phase 2 topline results"] },
      { phase: "Phase 3 POETYK SLE", date: "Q2 2024", outcome: 'pending', keyData: ["Enrollment complete", "Readout expected 2025"], scoreAtTime: 72, rationale: "Awaiting pivotal results", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 5. Brazikumab - Anti-IL-23p19 for Crohn's
  {
    id: "BRAZ-01",
    name: "Brazikumab",
    trialName: "INTREPID",
    phase: "Phase III",
    indication: "Crohn's Disease",
    therapeuticArea: "Immunology & Inflammation",
    company: "AstraZeneca",
    companyTrackRecord: 'average',
    nctId: "NCT04656444",
    clinicalTrialsSearchTerm: "brazikumab",
    scores: calculateProbabilityScores("Phase III", "Crohn's Disease", "Immunology"),
    marketData: generateMarketProjections("Brazikumab", "Phase III", "Crohn's Disease", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-23p19 monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "Extended half-life allowing Q8W dosing",
      discovery: "MedImmune/AstraZeneca",
      development: "AstraZeneca",
      additionalInfo: [
        "High-affinity IL-23p19 binding",
        "Convenient Q8W maintenance dosing",
        "Strong Phase 2 efficacy signal"
      ]
    },
    patents: [
      { patentNumber: "US9,683,045", title: "Anti-IL-23 antibodies with enhanced stability", expirationDate: "2035", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$18B+ (IBD market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Risankizumab (Skyrizi)", company: "AbbVie", phase: "Approved", mechanism: "Anti-IL-23p19", keyDifferentiator: "Market leader in CD", efficacy: "~45% clinical remission", threat: 'high' },
        { name: "Ustekinumab (Stelara)", company: "J&J", phase: "Approved", mechanism: "Anti-IL-12/23", keyDifferentiator: "Established efficacy", efficacy: "~35% clinical remission", threat: 'high' },
      ],
      competitiveAdvantages: ["Extended dosing interval", "Strong Phase 2 data", "AstraZeneca backing"],
      competitiveRisks: ["Late to market", "Competitive IL-23 space", "Biosimilar ustekinumab"],
      marketPositioning: "Convenient dosing IL-23 inhibitor for Crohn's disease."
    },
    retrospectivePhases: [
      { phase: "Phase 2a", date: "Q4 2018", outcome: 'success', keyData: ["49.2% clinical response vs 26.7% placebo"], scoreAtTime: 71, rationale: "Efficacy comparable to approved IL-23s", dataAvailableAtTime: ["Phase 2a efficacy results"] },
      { phase: "Phase 3 INTREPID", date: "Q1 2024", outcome: 'pending', keyData: ["Global Phase 3 initiated", "Induction and maintenance"], scoreAtTime: 78, rationale: "Large Phase 3 program underway", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 6. Obexelimab - Bispecific for IgG4-RD
  {
    id: "OBEX-01",
    name: "Obexelimab",
    trialName: "IgG4-RD Study",
    phase: "Phase II",
    indication: "IgG4-Related Disease",
    therapeuticArea: "Immunology & Inflammation",
    company: "Zymeworks/Paragon",
    companyTrackRecord: 'slow',
    nctId: "NCT04276545",
    clinicalTrialsSearchTerm: "obexelimab",
    scores: calculateProbabilityScores("Phase II", "Rare Disease", "Immunology"),
    marketData: generateMarketProjections("Obexelimab", "Phase II", "Rare Disease", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Bispecific CD19 x CD32B antibody",
      administration: "Intravenous infusion",
      keyAdvantage: "B-cell silencing without depletion",
      discovery: "Zymeworks",
      development: "Paragon Therapeutics",
      additionalInfo: [
        "Novel bispecific format",
        "Modulates B-cells rather than depleting",
        "First targeted therapy for IgG4-RD"
      ]
    },
    patents: [
      { patentNumber: "US10,793,632", title: "Bispecific CD19/CD32B antibodies", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$1B+ (IgG4-RD)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Rituximab", company: "Roche", phase: "Off-label", mechanism: "Anti-CD20", keyDifferentiator: "B-cell depletion", efficacy: "Variable response", threat: 'medium' },
        { name: "Inebilizumab", company: "Amgen/Viela", phase: "Phase III", mechanism: "Anti-CD19", keyDifferentiator: "B-cell depletion", efficacy: "Pending", threat: 'high' },
      ],
      competitiveAdvantages: ["Non-depleting mechanism", "First-in-class bispecific", "Rare disease orphan potential"],
      competitiveRisks: ["Early stage", "Small market", "Complex manufacturing"],
      marketPositioning: "First targeted therapy specifically for IgG4-related disease."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q1 2020", outcome: 'success', keyData: ["B-cell silencing confirmed", "Acceptable tolerability"], scoreAtTime: 48, rationale: "Proof of mechanism achieved", dataAvailableAtTime: ["Phase 1 PD data"] },
      { phase: "Phase 2", date: "Q4 2023", outcome: 'pending', keyData: ["IgG4-RD study ongoing", "Early signals encouraging"], scoreAtTime: 55, rationale: "Awaiting Phase 2 readout", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 7. Nipocalimab - FcRn blocker for autoimmune
  {
    id: "NIPO-01",
    name: "Nipocalimab",
    trialName: "VIVACITY-MG3",
    phase: "Phase III",
    indication: "Myasthenia Gravis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Johnson & Johnson",
    companyTrackRecord: 'fast',
    nctId: "NCT04951622",
    clinicalTrialsSearchTerm: "nipocalimab",
    scores: calculateProbabilityScores("Phase III", "Myasthenia Gravis", "Immunology"),
    marketData: generateMarketProjections("Nipocalimab", "Phase III", "Myasthenia Gravis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-FcRn monoclonal antibody",
      administration: "Intravenous infusion",
      keyAdvantage: "Rapid and sustained IgG reduction",
      discovery: "Momenta (J&J acquisition)",
      development: "Johnson & Johnson",
      additionalInfo: [
        "Complete IgG reduction achievable",
        "Multiple autoimmune indications",
        "HFND prevention program ongoing"
      ]
    },
    patents: [
      { patentNumber: "US10,689,451", title: "Anti-FcRn antibodies", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (MG and FcRn market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Efgartigimod (Vyvgart)", company: "argenx", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "First FcRn approval in MG", efficacy: "68% MG-ADL responders", threat: 'high' },
        { name: "Rozanolixizumab", company: "UCB", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "SC administration", efficacy: "72% MG-ADL responders", threat: 'high' },
      ],
      competitiveAdvantages: ["J&J commercial strength", "Multiple indications", "HFND differentiation"],
      competitiveRisks: ["Third to market in MG", "Competitive FcRn space", "IV administration"],
      marketPositioning: "Broad FcRn inhibitor platform across autoimmune diseases."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MG", date: "Q2 2021", outcome: 'success', keyData: ["Significant MG-ADL improvement", "Rapid onset"], scoreAtTime: 72, rationale: "Strong efficacy in competitive class", dataAvailableAtTime: ["Phase 2 MG data"] },
      { phase: "Phase 3 VIVACITY", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal MG study ongoing", "Multiple indications in development"], scoreAtTime: 75, rationale: "Broad platform potential", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 8. Sonelokimab - Nanobody IL-17A/F
  {
    id: "SONE-01",
    name: "Sonelokimab",
    trialName: "MOCCASIN",
    phase: "Phase III",
    indication: "Hidradenitis Suppurativa",
    therapeuticArea: "Immunology & Inflammation",
    company: "MoonLake Immunotherapeutics",
    companyTrackRecord: 'slow',
    nctId: "NCT05322473",
    clinicalTrialsSearchTerm: "sonelokimab",
    scores: calculateProbabilityScores("Phase III", "Hidradenitis Suppurativa", "Immunology"),
    marketData: generateMarketProjections("Sonelokimab", "Phase III", "Hidradenitis Suppurativa", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Trivalent nanobody targeting IL-17A and IL-17F",
      administration: "Subcutaneous injection",
      keyAdvantage: "Superior tissue penetration with nanobody format",
      discovery: "Ablynx (Sanofi)",
      license: "MoonLake (spin-out)",
      development: "MoonLake Immunotherapeutics",
    },
    patents: [
      { patentNumber: "US10,829,555", title: "Nanobodies targeting IL-17A/F", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (HS market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Adalimumab (Humira)", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "First HS approval", efficacy: "~42% HiSCR", threat: 'medium' },
        { name: "Secukinumab (Cosentyx)", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "IL-17 validation in HS", efficacy: "~45% HiSCR", threat: 'high' },
      ],
      competitiveAdvantages: ["Nanobody tissue penetration", "Dual IL-17A/F", "Strong Phase 2 data"],
      competitiveRisks: ["Phase 3 execution", "Competitive market", "Small company resources"],
      marketPositioning: "Best-in-class IL-17 nanobody for hidradenitis suppurativa."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2022", outcome: 'success', keyData: ["78% HiSCR at week 16", "Dose-dependent response"], scoreAtTime: 75, rationale: "Exceptional efficacy vs approved therapies", dataAvailableAtTime: ["Phase 2b topline"] },
      { phase: "Phase 3 MOCCASIN", date: "Q1 2024", outcome: 'pending', keyData: ["Pivotal program initiated", "Multiple studies ongoing"], scoreAtTime: 78, rationale: "Strong Phase 2 supports advancement", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 9. Etrasimod - S1P modulator for UC
  {
    id: "ETRA-01",
    name: "Etrasimod (Velsipity)",
    trialName: "ELEVATE",
    phase: "Approved",
    indication: "Ulcerative Colitis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Pfizer (via Arena)",
    companyTrackRecord: 'fast',
    nctId: "NCT03945188",
    clinicalTrialsSearchTerm: "etrasimod",
    scores: calculateProbabilityScores("Approved", "Ulcerative Colitis", "Immunology"),
    marketData: generateMarketProjections("Etrasimod", "Approved", "Ulcerative Colitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "S1P receptor modulator (S1P1,4,5)",
      administration: "Once-daily oral tablet",
      keyAdvantage: "No first-dose monitoring required",
      discovery: "Arena Pharmaceuticals",
      license: "Pfizer acquisition ($6.7B, 2022)",
      development: "Pfizer",
    },
    patents: [
      { patentNumber: "US10,231,968", title: "S1P receptor modulators", expirationDate: "2034", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$18B+ (IBD market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Ozanimod (Zeposia)", company: "BMS", phase: "Approved", mechanism: "S1P modulator", keyDifferentiator: "First S1P in UC", efficacy: "~18% clinical remission", threat: 'high' },
        { name: "Tofacitinib (Xeljanz)", company: "Pfizer", phase: "Approved", mechanism: "JAK inhibitor", keyDifferentiator: "Oral JAK", efficacy: "~18% clinical remission", threat: 'medium' },
      ],
      competitiveAdvantages: ["No first-dose monitoring", "Once-daily oral", "Clean safety profile"],
      competitiveRisks: ["S1P class competition", "Biologic competition", "Label restrictions"],
      marketPositioning: "Convenient once-daily oral S1P modulator for UC."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2019", outcome: 'success', keyData: ["Clinical remission signal", "Dose-response established"], scoreAtTime: 68, rationale: "Proof of concept in UC", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Phase 3 ELEVATE", date: "Q1 2023", outcome: 'success', keyData: ["25% clinical remission vs 15% placebo", "Sustained efficacy"], scoreAtTime: 88, rationale: "Met all primary endpoints", dataAvailableAtTime: ["ELEVATE UC 52/12 results"] },
      { phase: "FDA Approval", date: "Oct 2023", outcome: 'success', keyData: ["Approved for UC", "No titration required"], scoreAtTime: 95, rationale: "Differentiated convenience", dataAvailableAtTime: ["Commercial launch"] }
    ]
  },

  // 10. Dapirolizumab pegol - Anti-CD40L for SLE
  {
    id: "DAPI-01",
    name: "Dapirolizumab pegol",
    trialName: "PHOENYCS",
    phase: "Phase III",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Immunology & Inflammation",
    company: "UCB/Biogen",
    companyTrackRecord: 'average',
    nctId: "NCT04294667",
    clinicalTrialsSearchTerm: "dapirolizumab",
    scores: calculateProbabilityScores("Phase III", "Lupus", "Immunology"),
    marketData: generateMarketProjections("Dapirolizumab", "Phase III", "Lupus", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "PEGylated anti-CD40L Fab fragment",
      administration: "Subcutaneous injection",
      keyAdvantage: "CD40L pathway without thromboembolic risk",
      discovery: "UCB/Biogen",
      development: "UCB/Biogen collaboration",
      additionalInfo: [
        "Modified to avoid platelet binding",
        "Addresses historic CD40L safety issues",
        "Novel pathway in SLE"
      ]
    },
    patents: [
      { patentNumber: "US9,550,828", title: "Anti-CD40L Fab fragments", expirationDate: "2034", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SLE market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Anifrolumab (Saphnelo)", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IFNAR1", keyDifferentiator: "Type I IFN pathway", efficacy: "~48% BICLA", threat: 'high' },
        { name: "Belimumab (Benlysta)", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "First SLE biologic", efficacy: "~43% SRI-4", threat: 'medium' },
      ],
      competitiveAdvantages: ["Novel CD40L pathway", "Modified safety profile", "Strong Phase 2 data"],
      competitiveRisks: ["Historic CD40L safety concerns", "Competitive SLE market", "Complex mechanism"],
      marketPositioning: "First CD40L pathway therapy with optimized safety for SLE."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2020", outcome: 'success', keyData: ["45% BICLA vs 26% placebo at week 24", "Well tolerated"], scoreAtTime: 72, rationale: "Strong efficacy with clean safety", dataAvailableAtTime: ["Phase 2b results"] },
      { phase: "Phase 3 PHOENYCS", date: "Q2 2024", outcome: 'pending', keyData: ["Pivotal studies ongoing", "Multiple endpoints"], scoreAtTime: 74, rationale: "Phase 3 in progress", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 11. Batoclimab - FcRn for autoimmune
  {
    id: "BATO-01",
    name: "Batoclimab",
    trialName: "MG Study",
    phase: "Phase III",
    indication: "Myasthenia Gravis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Immunovant/Harbour BioMed",
    companyTrackRecord: 'slow',
    nctId: "NCT05039190",
    clinicalTrialsSearchTerm: "batoclimab",
    scores: calculateProbabilityScores("Phase III", "Myasthenia Gravis", "Immunology"),
    marketData: generateMarketProjections("Batoclimab", "Phase III", "Myasthenia Gravis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-FcRn monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "SC administration in FcRn class",
      discovery: "Harbour BioMed",
      license: "Immunovant (ex-Greater China)",
      development: "Immunovant",
    },
    patents: [
      { patentNumber: "US10,590,189", title: "Anti-FcRn antibodies for autoimmune disease", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (MG and FcRn market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Efgartigimod (Vyvgart)", company: "argenx", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "First FcRn approval", efficacy: "68% responders", threat: 'high' },
        { name: "Rozanolixizumab", company: "UCB", phase: "Approved", mechanism: "FcRn blocker", keyDifferentiator: "SC approved", efficacy: "72% responders", threat: 'high' },
      ],
      competitiveAdvantages: ["Weekly SC dosing", "Multiple indications", "Strong China partnership"],
      competitiveRisks: ["Late to FcRn market", "Cholesterol signal", "Resource constraints"],
      marketPositioning: "Convenient weekly SC FcRn inhibitor."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ASCEND-MG", date: "Q2 2022", outcome: 'success', keyData: ["MG-ADL improvement", "SC administration validated"], scoreAtTime: 68, rationale: "Efficacy in competitive FcRn class", dataAvailableAtTime: ["Phase 2 MG results"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal MG study ongoing", "Thyroid eye disease also in Phase 3"], scoreAtTime: 70, rationale: "Multiple pivotal studies active", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 12. Rilzabrutinib - BTK inhibitor for autoimmune
  {
    id: "RILZ-01",
    name: "Rilzabrutinib",
    trialName: "LUNA",
    phase: "Phase III",
    indication: "Immune Thrombocytopenia",
    therapeuticArea: "Immunology & Inflammation",
    company: "Sanofi",
    companyTrackRecord: 'average',
    nctId: "NCT04562766",
    clinicalTrialsSearchTerm: "rilzabrutinib",
    scores: calculateProbabilityScores("Phase III", "ITP", "Immunology"),
    marketData: generateMarketProjections("Rilzabrutinib", "Phase III", "ITP", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Reversible covalent BTK inhibitor",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Reversible binding may offer improved safety",
      discovery: "Principia Biopharma (Sanofi)",
      development: "Sanofi",
      additionalInfo: [
        "Reversible covalent mechanism",
        "Multiple autoimmune indications",
        "Differentiated from irreversible BTK inhibitors"
      ]
    },
    patents: [
      { patentNumber: "US10,561,658", title: "BTK inhibitor compounds", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (ITP and autoimmune)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Romiplostim (Nplate)", company: "Amgen", phase: "Approved", mechanism: "TPO agonist", keyDifferentiator: "Standard of care", efficacy: "~80% platelet response", threat: 'high' },
        { name: "Eltrombopag (Promacta)", company: "Novartis", phase: "Approved", mechanism: "TPO agonist", keyDifferentiator: "Oral TPO agonist", efficacy: "~70% response", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel mechanism", "Reversible binding", "Multiple indications"],
      competitiveRisks: ["TPO agonist competition", "Twice-daily dosing", "Efficacy vs standard of care"],
      marketPositioning: "First BTK inhibitor for immune thrombocytopenia."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2020", outcome: 'success', keyData: ["Platelet response in ITP", "Acceptable safety"], scoreAtTime: 65, rationale: "Proof of concept achieved", dataAvailableAtTime: ["Phase 2 ITP data"] },
      { phase: "Phase 3 LUNA", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal ITP study ongoing", "Pemphigus also in Phase 3"], scoreAtTime: 68, rationale: "Multiple pivotal studies active", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 13. Telitacicept - TACI-Fc fusion for SLE
  {
    id: "TELI-01",
    name: "Telitacicept",
    trialName: "SLE Studies",
    phase: "Phase III",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Immunology & Inflammation",
    company: "RemeGen",
    companyTrackRecord: 'slow',
    nctId: "NCT04082416",
    clinicalTrialsSearchTerm: "telitacicept",
    scores: calculateProbabilityScores("Phase III", "Lupus", "Immunology"),
    marketData: generateMarketProjections("Telitacicept", "Phase III", "Lupus", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "TACI-Fc fusion protein",
      administration: "Subcutaneous injection",
      keyAdvantage: "Dual BLyS and APRIL blockade",
      discovery: "RemeGen",
      development: "RemeGen",
      additionalInfo: [
        "Approved in China for SLE",
        "Dual cytokine targeting",
        "US Phase 3 ongoing"
      ]
    },
    patents: [
      { patentNumber: "US9,822,178", title: "TACI-Fc fusion proteins", expirationDate: "2034", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SLE market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Belimumab (Benlysta)", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "First SLE biologic", efficacy: "~43% SRI-4", threat: 'high' },
        { name: "Anifrolumab (Saphnelo)", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IFNAR1", keyDifferentiator: "Type I IFN pathway", efficacy: "~48% BICLA", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual BLyS/APRIL blockade", "China approval", "Strong efficacy signal"],
      competitiveRisks: ["Regulatory pathway in US", "China-based company", "Competitive market"],
      marketPositioning: "Dual BLyS and APRIL inhibitor for lupus."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2019", outcome: 'success', keyData: ["79.2% SRI-4 vs 32% placebo", "Exceptional response rate"], scoreAtTime: 78, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Phase 2 China data"] },
      { phase: "China Approval", date: "Mar 2021", outcome: 'success', keyData: ["First SLE approval in China", "Commercial launch"], scoreAtTime: 85, rationale: "Regulatory success in China", dataAvailableAtTime: ["China launch"] },
      { phase: "US Phase 3", date: "Q2 2024", outcome: 'pending', keyData: ["US pivotal studies ongoing", "Global expansion"], scoreAtTime: 78, rationale: "US regulatory path in progress", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 14. Izokibep - IL-17A nanobody for psoriasis
  {
    id: "IZOK-01",
    name: "Izokibep",
    trialName: "INTEGRATE",
    phase: "Phase III",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Immunology & Inflammation",
    company: "Acelyrin",
    companyTrackRecord: 'slow',
    nctId: "NCT05411081",
    clinicalTrialsSearchTerm: "izokibep",
    scores: calculateProbabilityScores("Phase III", "Psoriatic Arthritis", "Immunology"),
    marketData: generateMarketProjections("Izokibep", "Phase III", "Psoriatic Arthritis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Small protein IL-17A inhibitor",
      administration: "Subcutaneous injection",
      keyAdvantage: "Small size enables superior tissue penetration",
      discovery: "Affibody (licensed)",
      development: "Acelyrin",
      additionalInfo: [
        "~6 kDa vs ~150 kDa monoclonal antibodies",
        "Enhanced tissue penetration",
        "High IL-17A binding affinity"
      ]
    },
    patents: [
      { patentNumber: "US10,844,104", title: "IL-17A binding polypeptides", expirationDate: "2039", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$12B+ (psoriasis and PsA)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Secukinumab (Cosentyx)", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Market leader", efficacy: "~50% ACR50", threat: 'high' },
        { name: "Ixekizumab (Taltz)", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Strong skin data", efficacy: "~54% ACR50", threat: 'high' },
      ],
      competitiveAdvantages: ["Small molecule-like PK", "Tissue penetration", "Convenient dosing"],
      competitiveRisks: ["Competitive IL-17 market", "Late to market", "Small company"],
      marketPositioning: "Next-generation IL-17A inhibitor with unique small protein format."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q4 2022", outcome: 'success', keyData: ["70% PASI90 in psoriasis", "Dose-response established"], scoreAtTime: 74, rationale: "Strong skin clearance", dataAvailableAtTime: ["Phase 2b psoriasis data"] },
      { phase: "Phase 3 INTEGRATE", date: "Q1 2024", outcome: 'pending', keyData: ["PsA pivotal program initiated", "Psoriasis Phase 3 also ongoing"], scoreAtTime: 75, rationale: "Multiple pivotal studies active", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 15. Elsubrutinib - BTK/JAK1 dual inhibitor
  {
    id: "ELSU-01",
    name: "Elsubrutinib + Upadacitinib",
    trialName: "ABBEY",
    phase: "Phase III",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Immunology & Inflammation",
    company: "AbbVie",
    companyTrackRecord: 'fast',
    nctId: "NCT04963985",
    clinicalTrialsSearchTerm: "elsubrutinib lupus",
    scores: calculateProbabilityScores("Phase III", "Lupus", "Immunology"),
    marketData: generateMarketProjections("Elsubrutinib", "Phase III", "Lupus", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "BTK inhibitor combination with JAK1 inhibitor",
      administration: "Oral combination therapy",
      keyAdvantage: "Dual pathway inhibition for enhanced efficacy",
      discovery: "AbbVie",
      development: "AbbVie",
      additionalInfo: [
        "Novel combination approach",
        "Addresses multiple immune pathways",
        "Oral convenience"
      ]
    },
    patents: [
      { patentNumber: "US10,689,401", title: "BTK inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SLE market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Anifrolumab (Saphnelo)", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IFNAR1", keyDifferentiator: "Type I IFN pathway", efficacy: "~48% BICLA", threat: 'high' },
        { name: "Deucravacitinib", company: "BMS", phase: "Phase III", mechanism: "TYK2 inhibitor", keyDifferentiator: "Oral TYK2", efficacy: "~58% SRI-4 (Ph2)", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual mechanism", "Oral administration", "AbbVie pipeline strength"],
      competitiveRisks: ["Combination complexity", "Safety profile", "Competitive market"],
      marketPositioning: "First dual BTK/JAK1 inhibitor combination for lupus."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ABBEY", date: "Q2 2023", outcome: 'success', keyData: ["Combination showed enhanced efficacy", "Acceptable safety profile"], scoreAtTime: 70, rationale: "Proof of concept for dual inhibition", dataAvailableAtTime: ["Phase 2 combination data"] },
      { phase: "Phase 3", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal combination study ongoing"], scoreAtTime: 72, rationale: "Phase 3 initiation", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 16. Litifilimab - Anti-BDCA2 for cutaneous lupus
  {
    id: "LITI-01",
    name: "Litifilimab",
    trialName: "LILAC",
    phase: "Phase III",
    indication: "Cutaneous Lupus Erythematosus",
    therapeuticArea: "Immunology & Inflammation",
    company: "Biogen",
    companyTrackRecord: 'average',
    nctId: "NCT04865887",
    clinicalTrialsSearchTerm: "litifilimab",
    scores: calculateProbabilityScores("Phase III", "Cutaneous Lupus", "Immunology"),
    marketData: generateMarketProjections("Litifilimab", "Phase III", "Cutaneous Lupus", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-BDCA2 (CD303) monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "Targets plasmacytoid dendritic cells upstream of IFN",
      discovery: "Biogen",
      development: "Biogen",
      additionalInfo: [
        "Novel pDC targeting approach",
        "Upstream of type I interferon",
        "Addresses skin manifestations"
      ]
    },
    patents: [
      { patentNumber: "US10,501,541", title: "Anti-BDCA2 antibodies", expirationDate: "2037", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (cutaneous lupus)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Hydroxychloroquine", company: "Generic", phase: "Approved", mechanism: "TLR inhibition", keyDifferentiator: "Standard of care", efficacy: "Variable", threat: 'low' },
        { name: "Anifrolumab", company: "AstraZeneca", phase: "Post-hoc CLE", mechanism: "Anti-IFNAR1", keyDifferentiator: "Type I IFN", efficacy: "Skin benefit shown", threat: 'medium' },
      ],
      competitiveAdvantages: ["Novel pDC target", "Upstream mechanism", "Skin-focused indication"],
      competitiveRisks: ["Phase 3 execution", "CLE heterogeneity", "Market size"],
      marketPositioning: "First targeted therapy for cutaneous lupus erythematosus."
    },
    retrospectivePhases: [
      { phase: "Phase 2 LILAC", date: "Q4 2021", outcome: 'success', keyData: ["CLASI-A improvement", "pDC depletion confirmed"], scoreAtTime: 68, rationale: "Proof of concept in CLE", dataAvailableAtTime: ["Phase 2 LILAC data"] },
      { phase: "Phase 3 TOPAZ", date: "Q1 2024", outcome: 'pending', keyData: ["Pivotal CLE study ongoing", "DLE and SCLE included"], scoreAtTime: 70, rationale: "Phase 3 advancement", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 17. Remibrutinib - BTK inhibitor for CSU
  {
    id: "REMI-01",
    name: "Remibrutinib",
    trialName: "REMIX",
    phase: "Phase III",
    indication: "Chronic Spontaneous Urticaria",
    therapeuticArea: "Immunology & Inflammation",
    company: "Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT05048342",
    clinicalTrialsSearchTerm: "remibrutinib urticaria",
    scores: calculateProbabilityScores("Phase III", "Urticaria", "Immunology"),
    marketData: generateMarketProjections("Remibrutinib", "Phase III", "Urticaria", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Covalent BTK inhibitor",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Oral option for anti-IgE refractory patients",
      discovery: "Novartis",
      development: "Novartis",
      additionalInfo: [
        "Targets mast cell activation",
        "Alternative to omalizumab",
        "Oral convenience"
      ]
    },
    patents: [
      { patentNumber: "US10,738,061", title: "BTK inhibitors for mast cell diseases", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (CSU market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Omalizumab (Xolair)", company: "Novartis/Roche", phase: "Approved", mechanism: "Anti-IgE", keyDifferentiator: "Standard of care", efficacy: "~80% response", threat: 'high' },
        { name: "Ligelizumab", company: "Novartis", phase: "Phase III", mechanism: "Anti-IgE", keyDifferentiator: "Next-gen anti-IgE", efficacy: "Mixed results", threat: 'medium' },
      ],
      competitiveAdvantages: ["Oral administration", "Novel mechanism", "Refractory patient potential"],
      competitiveRisks: ["BTK safety class", "Twice-daily dosing", "Omalizumab established"],
      marketPositioning: "First oral BTK inhibitor for chronic spontaneous urticaria."
    },
    retrospectivePhases: [
      { phase: "Phase 2b", date: "Q2 2022", outcome: 'success', keyData: ["UAS7 reduction", "Dose-response demonstrated"], scoreAtTime: 72, rationale: "Strong efficacy in CSU", dataAvailableAtTime: ["Phase 2b CSU data"] },
      { phase: "Phase 3 REMIX", date: "Q4 2024", outcome: 'pending', keyData: ["Pivotal CSU program ongoing", "Sjogren's also in development"], scoreAtTime: 75, rationale: "Multiple indications advancing", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 18. Imsidolimab - Anti-IL-36R for GPP
  {
    id: "IMSI-01",
    name: "Imsidolimab",
    trialName: "GEMINI",
    phase: "Phase III",
    indication: "Generalized Pustular Psoriasis",
    therapeuticArea: "Immunology & Inflammation",
    company: "AnaptysBio",
    companyTrackRecord: 'slow',
    nctId: "NCT05352893",
    clinicalTrialsSearchTerm: "imsidolimab",
    scores: calculateProbabilityScores("Phase III", "Psoriasis", "Immunology"),
    marketData: generateMarketProjections("Imsidolimab", "Phase III", "Psoriasis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-36 receptor monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "SC administration vs IV spesolimab",
      discovery: "AnaptysBio",
      development: "AnaptysBio",
      additionalInfo: [
        "Second IL-36R inhibitor in development",
        "SC administration convenience",
        "GPP prevention focus"
      ]
    },
    patents: [
      { patentNumber: "US10,759,860", title: "Anti-IL-36R antibodies", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (pustular psoriasis)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Spesolimab (Spevigo)", company: "Boehringer", phase: "Approved", mechanism: "Anti-IL-36R", keyDifferentiator: "First-in-class approval", efficacy: "High response rate", threat: 'high' },
      ],
      competitiveAdvantages: ["SC administration", "Prevention indication", "Chronic dosing"],
      competitiveRisks: ["Second to market", "Spesolimab established", "Small market"],
      marketPositioning: "Convenient SC IL-36R inhibitor for GPP prevention."
    },
    retrospectivePhases: [
      { phase: "Phase 2 GALLOP", date: "Q3 2022", outcome: 'partial', keyData: ["Did not meet primary endpoint in PPP", "GPP subset encouraging"], scoreAtTime: 55, rationale: "PPP failure but GPP signal", dataAvailableAtTime: ["GALLOP results"] },
      { phase: "Phase 3 GEMINI", date: "Q1 2024", outcome: 'pending', keyData: ["Focused on GPP prevention", "Learning from GALLOP"], scoreAtTime: 60, rationale: "Refined development strategy", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 19. Bermekimab - Anti-IL-1α for HS
  {
    id: "BERM-01",
    name: "Bermekimab",
    trialName: "PHOENIX",
    phase: "Phase III",
    indication: "Hidradenitis Suppurativa",
    therapeuticArea: "Immunology & Inflammation",
    company: "Janssen (from XBiotech)",
    companyTrackRecord: 'fast',
    nctId: "NCT04988048",
    clinicalTrialsSearchTerm: "bermekimab",
    scores: calculateProbabilityScores("Phase III", "Hidradenitis Suppurativa", "Immunology"),
    marketData: generateMarketProjections("Bermekimab", "Phase III", "Hidradenitis Suppurativa", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-1α monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "Novel IL-1α target in HS",
      discovery: "XBiotech",
      license: "Janssen ($750M acquisition, 2020)",
      development: "Janssen",
    },
    patents: [
      { patentNumber: "US9,512,216", title: "Anti-IL-1α antibodies", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (HS market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Adalimumab (Humira)", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "First HS approval", efficacy: "~42% HiSCR", threat: 'medium' },
        { name: "Secukinumab (Cosentyx)", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Second HS approval", efficacy: "~45% HiSCR", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel IL-1α target", "Janssen backing", "Differentiated mechanism"],
      competitiveRisks: ["Phase 2 mixed data", "Competitive HS market", "Late-stage competition"],
      marketPositioning: "First IL-1α inhibitor for hidradenitis suppurativa."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2019", outcome: 'success', keyData: ["63% HiSCR at week 12", "Rapid pain reduction"], scoreAtTime: 70, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Phase 2 HS data"] },
      { phase: "Phase 3 PHOENIX", date: "Q1 2024", outcome: 'pending', keyData: ["Pivotal HS program ongoing", "Atopic dermatitis also studied"], scoreAtTime: 72, rationale: "Phase 3 advancement", dataAvailableAtTime: ["Study ongoing"] }
    ]
  },

  // 20. Tozorakimab - Anti-IL-33 for COPD
  {
    id: "TOZO-01",
    name: "Tozorakimab",
    trialName: "TITANIA",
    phase: "Phase III",
    indication: "COPD",
    therapeuticArea: "Immunology & Inflammation",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT05166889",
    clinicalTrialsSearchTerm: "tozorakimab",
    scores: calculateProbabilityScores("Phase III", "COPD", "Immunology"),
    marketData: generateMarketProjections("Tozorakimab", "Phase III", "COPD", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-33 monoclonal antibody",
      administration: "Subcutaneous injection",
      keyAdvantage: "Targets upstream alarmin in COPD inflammation",
      discovery: "AstraZeneca",
      development: "AstraZeneca",
      additionalInfo: [
        "First anti-IL-33 in Phase 3 for COPD",
        "Addresses exacerbation reduction",
        "Broad respiratory portfolio fit"
      ]
    },
    patents: [
      { patentNumber: "US10,836,832", title: "Anti-IL-33 antibodies", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (COPD market)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Dupixent", company: "Sanofi/Regeneron", phase: "Approved", mechanism: "Anti-IL-4Rα", keyDifferentiator: "Approved for COPD+eos", efficacy: "30% exacerbation reduction", threat: 'high' },
        { name: "Itepekimab", company: "Sanofi/Regeneron", phase: "Phase III", mechanism: "Anti-IL-33", keyDifferentiator: "Combination potential", efficacy: "Phase 2 promising", threat: 'high' },
      ],
      competitiveAdvantages: ["Upstream alarmin target", "AstraZeneca respiratory expertise", "Broad COPD population"],
      competitiveRisks: ["IL-33 target validation", "Dupixent competition", "COPD heterogeneity"],
      marketPositioning: "First-in-class anti-IL-33 therapy for COPD exacerbation reduction."
    },
    retrospectivePhases: [
      { phase: "Phase 2 FRONTIER", date: "Q4 2022", outcome: 'success', keyData: ["Exacerbation reduction signal", "Biomarker-defined population benefit"], scoreAtTime: 68, rationale: "Proof of concept in COPD", dataAvailableAtTime: ["FRONTIER data"] },
      { phase: "Phase 3 TITANIA", date: "Q2 2024", outcome: 'pending', keyData: ["Pivotal COPD program ongoing", "Large global trial"], scoreAtTime: 72, rationale: "Phase 3 advancement", dataAvailableAtTime: ["Study ongoing"] }
    ]
  }
];
