// Immunology & Inflammation Therapeutic Area Molecules

export const immunologyMolecules = [
  {
    id: "imm-001",
    name: "Spesolimab",
    phase: "Phase 3",
    sponsor: "Boehringer Ingelheim",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Generalized Pustular Psoriasis",
    mechanism: "Anti-IL-36R monoclonal antibody",
    status: "Active",
    patentExpiry: "2037",
    marketCap: "First-in-class IL-36R inhibitor for GPP",
    primaryEndpoint: "GPPGA pustulation subscore of 0",
    npv: 2800,
    confidence: 92,
    trialData: {
      phase1: { enrolled: 38, completed: 38, successRate: 100 },
      phase2: { enrolled: 53, completed: 53, successRate: 100 },
      phase3: { enrolled: 218, completed: 218, successRate: 95 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2016-03",
        outcome: "success" as const,
        keyData: ["Novel IL-36R mechanism", "Strong preclinical efficacy"],
        score: 45,
        rationale: "First IL-36R inhibitor in clinical development for GPP",
        availableData: "Preclinical data package"
      },
      {
        phase: "Phase 1",
        date: "2017-01",
        outcome: "success" as const,
        keyData: ["Favorable PK profile", "Dose-dependent IL-36 blockade"],
        score: 55,
        rationale: "Clean safety profile supports GPP development",
        availableData: "Phase 1 SAD/MAD data"
      },
      {
        phase: "Phase 2 (Effisayil 1)",
        date: "2019-06",
        outcome: "success" as const,
        keyData: ["54% achieved GPPGA 0 at week 1", "Rapid onset of action"],
        score: 78,
        rationale: "Breakthrough efficacy in acute GPP flares",
        availableData: "Pivotal Phase 2 results"
      },
      {
        phase: "Phase 3 (Effisayil 2)",
        date: "2022-08",
        outcome: "success" as const,
        keyData: ["84% flare-free at week 48", "Sustained efficacy"],
        score: 92,
        rationale: "Confirmed long-term prevention of GPP flares",
        availableData: "Full Phase 3 dataset"
      }
    ],
    patents: [
      {
        patentNumber: "US10,479,836",
        title: "Anti-IL-36R antibodies for treating pustular diseases",
        expirationDate: "2037-03-15",
        type: "Composition of Matter" as const,
        status: "Active" as const
      },
      {
        patentNumber: "US11,203,647",
        title: "Methods of treating GPP with IL-36R inhibitors",
        expirationDate: "2038-09-22",
        type: "Method of Use" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Imsidolimab",
        sponsor: "AnaptysBio",
        phase: "Phase 3",
        mechanism: "Anti-IL-36R",
        differentiator: "Subcutaneous administration"
      },
      {
        name: "Adalimumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-TNF",
        differentiator: "Broad anti-inflammatory, not GPP-specific"
      }
    ]
  },
  {
    id: "imm-002",
    name: "Bimekizumab",
    phase: "Phase 3",
    sponsor: "UCB",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Axial Spondyloarthritis",
    mechanism: "Dual IL-17A/F inhibitor",
    status: "Active",
    patentExpiry: "2035",
    marketCap: "First dual IL-17 inhibitor with superior efficacy",
    primaryEndpoint: "ASAS40 response at week 16",
    npv: 4500,
    confidence: 89,
    trialData: {
      phase1: { enrolled: 42, completed: 42, successRate: 100 },
      phase2: { enrolled: 214, completed: 208, successRate: 100 },
      phase3: { enrolled: 586, completed: 570, successRate: 92 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2014-07",
        outcome: "success" as const,
        keyData: ["Dual IL-17A/F blockade rationale", "Superior preclinical efficacy"],
        score: 48,
        rationale: "Novel dual mechanism may exceed single IL-17 inhibitors",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2015-03",
        outcome: "success" as const,
        keyData: ["Linear PK", "Rapid IL-17 suppression"],
        score: 56,
        rationale: "Clean safety enables dose optimization",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2b (BE AGILE)",
        date: "2018-11",
        outcome: "success" as const,
        keyData: ["47% ASAS40 at week 12", "Dose-response established"],
        score: 74,
        rationale: "Strong efficacy signal in axSpA",
        availableData: "Phase 2b results"
      },
      {
        phase: "Phase 3 (BE MOBILE 1/2)",
        date: "2022-05",
        outcome: "success" as const,
        keyData: ["45-47% ASAS40 vs 22% placebo", "Sustained to week 52"],
        score: 89,
        rationale: "Robust efficacy supports regulatory filing",
        availableData: "Full Phase 3 data"
      }
    ],
    patents: [
      {
        patentNumber: "US9,957,325",
        title: "Bispecific IL-17A/F antibodies",
        expirationDate: "2035-06-18",
        type: "Composition of Matter" as const,
        status: "Active" as const
      },
      {
        patentNumber: "US10,654,940",
        title: "Treatment of spondyloarthritis with dual IL-17 inhibition",
        expirationDate: "2036-11-03",
        type: "Method of Use" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Secukinumab",
        sponsor: "Novartis",
        phase: "Approved",
        mechanism: "Anti-IL-17A",
        differentiator: "Established market leader"
      },
      {
        name: "Ixekizumab",
        sponsor: "Eli Lilly",
        phase: "Approved",
        mechanism: "Anti-IL-17A",
        differentiator: "Strong radiographic data"
      },
      {
        name: "Upadacitinib",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "JAK1 inhibitor",
        differentiator: "Oral administration"
      }
    ]
  },
  {
    id: "imm-003",
    name: "Mirikizumab",
    phase: "Phase 3",
    sponsor: "Eli Lilly",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Ulcerative Colitis",
    mechanism: "Anti-IL-23p19 monoclonal antibody",
    status: "Active",
    patentExpiry: "2036",
    marketCap: "Next-gen IL-23 inhibitor for IBD",
    primaryEndpoint: "Clinical remission at week 12",
    npv: 5200,
    confidence: 91,
    trialData: {
      phase1: { enrolled: 48, completed: 48, successRate: 100 },
      phase2: { enrolled: 249, completed: 241, successRate: 100 },
      phase3: { enrolled: 1281, completed: 1220, successRate: 94 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2015-02",
        outcome: "success" as const,
        keyData: ["Selective p19 targeting", "Tissue-specific IL-23 blockade"],
        score: 46,
        rationale: "IL-23 validated in IBD; selective p19 approach novel",
        availableData: "IND package"
      },
      {
        phase: "Phase 1",
        date: "2016-01",
        outcome: "success" as const,
        keyData: ["Dose-proportional PK", "No immunogenicity signals"],
        score: 54,
        rationale: "Favorable profile enables UC development",
        availableData: "Phase 1 results"
      },
      {
        phase: "Phase 2 (AMAC)",
        date: "2019-03",
        outcome: "success" as const,
        keyData: ["24.8% clinical remission vs 4.8% placebo", "Endoscopic improvement"],
        score: 76,
        rationale: "Strong differentiation from anti-TNFs in UC",
        availableData: "Phase 2 efficacy data"
      },
      {
        phase: "Phase 3 (LUCENT-1/2)",
        date: "2022-11",
        outcome: "success" as const,
        keyData: ["24.2% clinical remission at week 12", "49.9% at week 52 maintenance"],
        score: 91,
        rationale: "Consistent efficacy across endpoints",
        availableData: "Full Phase 3 dataset"
      }
    ],
    patents: [
      {
        patentNumber: "US10,100,116",
        title: "Anti-IL-23p19 antibodies for inflammatory bowel disease",
        expirationDate: "2036-02-28",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Ustekinumab",
        sponsor: "Johnson & Johnson",
        phase: "Approved",
        mechanism: "Anti-IL-12/23",
        differentiator: "Established, dual IL-12/23 blockade"
      },
      {
        name: "Risankizumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-IL-23p19",
        differentiator: "Approved for Crohn's, UC pending"
      },
      {
        name: "Guselkumab",
        sponsor: "Johnson & Johnson",
        phase: "Phase 3",
        mechanism: "Anti-IL-23p19",
        differentiator: "Strong psoriasis data"
      }
    ]
  },
  {
    id: "imm-004",
    name: "Deucravacitinib",
    phase: "Phase 3",
    sponsor: "Bristol-Myers Squibb",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Systemic Lupus Erythematosus",
    mechanism: "Allosteric TYK2 inhibitor",
    status: "Active",
    patentExpiry: "2038",
    marketCap: "First-in-class selective TYK2 inhibitor for SLE",
    primaryEndpoint: "SRI-4 response at week 48",
    npv: 3800,
    confidence: 72,
    trialData: {
      phase1: { enrolled: 36, completed: 36, successRate: 100 },
      phase2: { enrolled: 363, completed: 348, successRate: 88 },
      phase3: { enrolled: 650, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-06",
        outcome: "success" as const,
        keyData: ["Novel allosteric TYK2 mechanism", "Selectivity over JAK1/2/3"],
        score: 52,
        rationale: "Selective TYK2 may avoid JAK-class safety issues",
        availableData: "Preclinical selectivity data"
      },
      {
        phase: "Phase 1",
        date: "2018-02",
        outcome: "success" as const,
        keyData: ["Clean safety profile", "No hematologic effects"],
        score: 58,
        rationale: "Differentiated safety from pan-JAK inhibitors",
        availableData: "Phase 1 safety data"
      },
      {
        phase: "Phase 2 (PAISLEY)",
        date: "2021-03",
        outcome: "success" as const,
        keyData: ["58% SRI-4 at 48 weeks vs 34% placebo", "Dose-response seen"],
        score: 72,
        rationale: "Strong efficacy signal in SLE supports Phase 3",
        availableData: "Phase 2 topline results"
      },
      {
        phase: "Phase 3 (POETYK SLE-1/2)",
        date: "2024-06",
        outcome: "pending" as const,
        keyData: ["Enrollment complete", "Primary readout expected 2025"],
        score: 72,
        rationale: "Awaiting pivotal Phase 3 results",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,301,305",
        title: "Allosteric TYK2 inhibitor compounds",
        expirationDate: "2038-06-12",
        type: "Composition of Matter" as const,
        status: "Active" as const
      },
      {
        patentNumber: "US10,934,297",
        title: "Treatment of autoimmune disorders with TYK2 inhibition",
        expirationDate: "2039-01-08",
        type: "Method of Use" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Anifrolumab",
        sponsor: "AstraZeneca",
        phase: "Approved",
        mechanism: "Anti-IFNAR1",
        differentiator: "First type I IFN inhibitor for SLE"
      },
      {
        name: "Belimumab",
        sponsor: "GSK",
        phase: "Approved",
        mechanism: "Anti-BLyS",
        differentiator: "First SLE biologic approval"
      },
      {
        name: "Voclosporin",
        sponsor: "Aurinia",
        phase: "Approved",
        mechanism: "Calcineurin inhibitor",
        differentiator: "Approved for lupus nephritis"
      }
    ]
  },
  {
    id: "imm-005",
    name: "Brazikumab",
    phase: "Phase 3",
    sponsor: "AstraZeneca",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Crohn's Disease",
    mechanism: "Anti-IL-23p19 monoclonal antibody",
    status: "Active",
    patentExpiry: "2035",
    marketCap: "IL-23 inhibitor for moderate-to-severe CD",
    primaryEndpoint: "Clinical remission at week 12",
    npv: 3200,
    confidence: 78,
    trialData: {
      phase1: { enrolled: 32, completed: 32, successRate: 100 },
      phase2: { enrolled: 246, completed: 238, successRate: 92 },
      phase3: { enrolled: 900, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2014-09",
        outcome: "success" as const,
        keyData: ["High-affinity IL-23p19 binding", "Extended half-life"],
        score: 44,
        rationale: "IL-23 pathway validated; differentiation through PK",
        availableData: "IND submission"
      },
      {
        phase: "Phase 1",
        date: "2015-06",
        outcome: "success" as const,
        keyData: ["Q8W dosing feasible", "No safety signals"],
        score: 52,
        rationale: "PK supports convenient dosing regimen",
        availableData: "Phase 1 PK/safety data"
      },
      {
        phase: "Phase 2a",
        date: "2018-10",
        outcome: "success" as const,
        keyData: ["49.2% clinical response vs 26.7% placebo", "Endoscopic improvement"],
        score: 71,
        rationale: "Efficacy comparable to approved IL-23 inhibitors",
        availableData: "Phase 2a efficacy results"
      },
      {
        phase: "Phase 3 (INTREPID)",
        date: "2024-03",
        outcome: "pending" as const,
        keyData: ["Global Phase 3 initiated", "Induction and maintenance studies"],
        score: 78,
        rationale: "Large Phase 3 program underway",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US9,683,045",
        title: "Anti-IL-23 antibodies with enhanced stability",
        expirationDate: "2035-09-14",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Risankizumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-IL-23p19",
        differentiator: "Market leader in CD"
      },
      {
        name: "Ustekinumab",
        sponsor: "Johnson & Johnson",
        phase: "Approved",
        mechanism: "Anti-IL-12/23",
        differentiator: "Established efficacy"
      },
      {
        name: "Mirikizumab",
        sponsor: "Eli Lilly",
        phase: "Phase 3",
        mechanism: "Anti-IL-23p19",
        differentiator: "Approved for UC"
      }
    ]
  },
  {
    id: "imm-006",
    name: "Obexelimab",
    phase: "Phase 2",
    sponsor: "Zymeworks",
    therapeuticArea: "Immunology & Inflammation",
    indication: "IgG4-Related Disease",
    mechanism: "Bispecific CD19 x CD32B antibody",
    status: "Active",
    patentExpiry: "2039",
    marketCap: "First targeted therapy for IgG4-RD",
    primaryEndpoint: "IgG4-RD Responder Index at week 24",
    npv: 1800,
    confidence: 62,
    trialData: {
      phase1: { enrolled: 24, completed: 24, successRate: 100 },
      phase2: { enrolled: 86, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-04",
        outcome: "success" as const,
        keyData: ["Novel bispecific format", "B-cell modulation without depletion"],
        score: 38,
        rationale: "Unique mechanism may offer differentiated safety",
        availableData: "Preclinical package"
      },
      {
        phase: "Phase 1",
        date: "2020-01",
        outcome: "success" as const,
        keyData: ["B-cell silencing confirmed", "Acceptable tolerability"],
        score: 48,
        rationale: "POC for B-cell modulation in autoimmunity",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2 (GUARD)",
        date: "2023-06",
        outcome: "pending" as const,
        keyData: ["Enrollment ongoing in IgG4-RD", "Novel patient population"],
        score: 62,
        rationale: "Unmet need in rare fibroinflammatory disease",
        availableData: "Study in progress"
      }
    ],
    patents: [
      {
        patentNumber: "US10,800,851",
        title: "Bispecific antibodies targeting CD19 and CD32B",
        expirationDate: "2039-04-22",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Rituximab",
        sponsor: "Roche",
        phase: "Off-label",
        mechanism: "Anti-CD20",
        differentiator: "B-cell depletion, used off-label"
      },
      {
        name: "Inebilizumab",
        sponsor: "Horizon",
        phase: "Phase 2",
        mechanism: "Anti-CD19",
        differentiator: "NMOSD-approved, exploring IgG4-RD"
      }
    ]
  },
  {
    id: "imm-007",
    name: "Remibrutinib",
    phase: "Phase 3",
    sponsor: "Novartis",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Chronic Spontaneous Urticaria",
    mechanism: "Covalent BTK inhibitor",
    status: "Active",
    patentExpiry: "2037",
    marketCap: "Oral BTK inhibitor for antihistamine-refractory CSU",
    primaryEndpoint: "UAS7 change from baseline at week 12",
    npv: 2600,
    confidence: 85,
    trialData: {
      phase1: { enrolled: 56, completed: 56, successRate: 100 },
      phase2: { enrolled: 311, completed: 298, successRate: 96 },
      phase3: { enrolled: 800, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-08",
        outcome: "success" as const,
        keyData: ["Selective BTK inhibition", "Low systemic exposure design"],
        score: 46,
        rationale: "BTK validated in mast cell biology",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2018-04",
        outcome: "success" as const,
        keyData: [">95% BTK occupancy", "Favorable safety profile"],
        score: 55,
        rationale: "Strong target engagement supports CSU development",
        availableData: "Phase 1 PK/PD data"
      },
      {
        phase: "Phase 2b",
        date: "2021-09",
        outcome: "success" as const,
        keyData: ["UAS7 reduction: -17.3 vs -7.6 placebo", "Rapid onset at week 2"],
        score: 79,
        rationale: "Compelling efficacy in H1-antihistamine refractory CSU",
        availableData: "Phase 2b results"
      },
      {
        phase: "Phase 3 (REMIX-1/2)",
        date: "2024-01",
        outcome: "pending" as const,
        keyData: ["Two pivotal studies ongoing", "Primary endpoint Q1 2025"],
        score: 85,
        rationale: "Strong Phase 2 data supports positive Phase 3",
        availableData: "Studies ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,160,761",
        title: "BTK inhibitor compounds for treating allergic diseases",
        expirationDate: "2037-08-15",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Omalizumab",
        sponsor: "Novartis/Genentech",
        phase: "Approved",
        mechanism: "Anti-IgE",
        differentiator: "Market leader, injectable"
      },
      {
        name: "Ligelizumab",
        sponsor: "Novartis",
        phase: "Phase 3",
        mechanism: "Anti-IgE",
        differentiator: "Next-gen anti-IgE"
      },
      {
        name: "Fenebrutinib",
        sponsor: "Roche",
        phase: "Phase 2",
        mechanism: "BTK inhibitor",
        differentiator: "Also in MS development"
      }
    ]
  },
  {
    id: "imm-008",
    name: "Sonelokimab",
    phase: "Phase 3",
    sponsor: "MoonLake Immunotherapeutics",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Hidradenitis Suppurativa",
    mechanism: "Nanobody targeting IL-17A/F",
    status: "Active",
    patentExpiry: "2038",
    marketCap: "First nanobody for HS with dual IL-17 inhibition",
    primaryEndpoint: "HiSCR75 at week 16",
    npv: 2200,
    confidence: 83,
    trialData: {
      phase1: { enrolled: 28, completed: 28, successRate: 100 },
      phase2: { enrolled: 234, completed: 226, successRate: 96 },
      phase3: { enrolled: 900, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2018-05",
        outcome: "success" as const,
        keyData: ["Nanobody format enables high tissue penetration", "Dual IL-17A/F blockade"],
        score: 44,
        rationale: "Novel format may improve efficacy in deep tissue HS",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2019-03",
        outcome: "success" as const,
        keyData: ["Subcutaneous administration validated", "Dose-proportional PK"],
        score: 53,
        rationale: "Convenient SC dosing for chronic HS",
        availableData: "Phase 1 results"
      },
      {
        phase: "Phase 2 (MIRA)",
        date: "2022-06",
        outcome: "success" as const,
        keyData: ["64% HiSCR75 vs 24% placebo", "Rapid response at week 4"],
        score: 79,
        rationale: "Best-in-class efficacy signal in HS",
        availableData: "Phase 2 data"
      },
      {
        phase: "Phase 3 (VELA-1/2/3)",
        date: "2024-04",
        outcome: "pending" as const,
        keyData: ["Three Phase 3 studies initiated", "Extensive HS program"],
        score: 83,
        rationale: "Robust Phase 2 efficacy supports pivotal trials",
        availableData: "Studies ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,669,338",
        title: "IL-17A/F targeting nanobodies",
        expirationDate: "2038-05-10",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Adalimumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-TNF",
        differentiator: "First approved for HS"
      },
      {
        name: "Secukinumab",
        sponsor: "Novartis",
        phase: "Approved",
        mechanism: "Anti-IL-17A",
        differentiator: "Second approved for HS"
      },
      {
        name: "Bimekizumab",
        sponsor: "UCB",
        phase: "Approved",
        mechanism: "Dual IL-17A/F",
        differentiator: "Approved 2024 for HS"
      }
    ]
  },
  {
    id: "imm-009",
    name: "Izokibep",
    phase: "Phase 3",
    sponsor: "Acelyrin",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Psoriatic Arthritis",
    mechanism: "IL-17A inhibitor (engineered protein)",
    status: "Active",
    patentExpiry: "2039",
    marketCap: "Novel IL-17A inhibitor with enhanced tissue penetration",
    primaryEndpoint: "ACR50 at week 16",
    npv: 2900,
    confidence: 76,
    trialData: {
      phase1: { enrolled: 45, completed: 45, successRate: 100 },
      phase2: { enrolled: 188, completed: 180, successRate: 95 },
      phase3: { enrolled: 500, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-08",
        outcome: "success" as const,
        keyData: ["Affibody-albumin fusion format", "Extended half-life"],
        score: 42,
        rationale: "Novel format may enable less frequent dosing",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2020-04",
        outcome: "success" as const,
        keyData: ["Monthly dosing PK validated", "Low immunogenicity"],
        score: 52,
        rationale: "Favorable PK supports differentiation from mAbs",
        availableData: "Phase 1 results"
      },
      {
        phase: "Phase 2",
        date: "2022-11",
        outcome: "success" as const,
        keyData: ["ACR50 52% vs 13% placebo", "Strong enthesitis resolution"],
        score: 73,
        rationale: "Robust efficacy across PsA domains",
        availableData: "Phase 2 data"
      },
      {
        phase: "Phase 3 (AFFIN-1/2)",
        date: "2024-05",
        outcome: "pending" as const,
        keyData: ["Pivotal Phase 3 initiated", "PsA and AS programs"],
        score: 76,
        rationale: "Phase 2 data supports pivotal development",
        availableData: "Studies ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,787,498",
        title: "IL-17A binding affibody-albumin fusion proteins",
        expirationDate: "2039-08-05",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Secukinumab",
        sponsor: "Novartis",
        phase: "Approved",
        mechanism: "Anti-IL-17A mAb",
        differentiator: "Market leader in PsA"
      },
      {
        name: "Ixekizumab",
        sponsor: "Eli Lilly",
        phase: "Approved",
        mechanism: "Anti-IL-17A mAb",
        differentiator: "Strong skin clearance"
      },
      {
        name: "Bimekizumab",
        sponsor: "UCB",
        phase: "Approved",
        mechanism: "Dual IL-17A/F",
        differentiator: "Dual mechanism"
      }
    ]
  },
  {
    id: "imm-010",
    name: "Nipocalimab",
    phase: "Phase 3",
    sponsor: "Johnson & Johnson",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Generalized Myasthenia Gravis",
    mechanism: "Anti-FcRn monoclonal antibody",
    status: "Active",
    patentExpiry: "2037",
    marketCap: "IgG-lowering therapy for autoantibody-mediated MG",
    primaryEndpoint: "MG-ADL change from baseline",
    npv: 3400,
    confidence: 84,
    trialData: {
      phase1: { enrolled: 42, completed: 42, successRate: 100 },
      phase2: { enrolled: 68, completed: 65, successRate: 95 },
      phase3: { enrolled: 350, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-02",
        outcome: "success" as const,
        keyData: ["High-affinity FcRn binding", "Rapid IgG reduction"],
        score: 48,
        rationale: "FcRn inhibition validated for IgG-mediated diseases",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2018-01",
        outcome: "success" as const,
        keyData: [">80% IgG reduction", "Predictable PK"],
        score: 56,
        rationale: "Rapid, deep IgG lowering achieved",
        availableData: "Phase 1 PK/PD data"
      },
      {
        phase: "Phase 2 (Vivacity-MG)",
        date: "2021-08",
        outcome: "success" as const,
        keyData: ["4.3-point MG-ADL improvement vs placebo", "Rapid onset"],
        score: 78,
        rationale: "Clinically meaningful improvement in MG",
        availableData: "Phase 2 efficacy results"
      },
      {
        phase: "Phase 3 (VIVACITY-MG3)",
        date: "2024-02",
        outcome: "pending" as const,
        keyData: ["Pivotal Phase 3 ongoing", "Both AChR+ and MuSK+ patients"],
        score: 84,
        rationale: "Broad MG population in Phase 3",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,233,240",
        title: "Anti-FcRn antibodies for treating autoimmune diseases",
        expirationDate: "2037-02-18",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Efgartigimod",
        sponsor: "argenx",
        phase: "Approved",
        mechanism: "FcRn blocker",
        differentiator: "First-to-market FcRn inhibitor"
      },
      {
        name: "Rozanolixizumab",
        sponsor: "UCB",
        phase: "Approved",
        mechanism: "Anti-FcRn",
        differentiator: "SC administration"
      },
      {
        name: "Batoclimab",
        sponsor: "Harbour/Immunovant",
        phase: "Phase 3",
        mechanism: "Anti-FcRn",
        differentiator: "SC, once weekly dosing"
      }
    ]
  },
  {
    id: "imm-011",
    name: "Dazodalibep",
    phase: "Phase 3",
    sponsor: "Horizon Therapeutics",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Sjögren's Syndrome",
    mechanism: "CD40L pathway blocker (HSA-CD40L)",
    status: "Active",
    patentExpiry: "2038",
    marketCap: "First-in-class for primary Sjögren's syndrome",
    primaryEndpoint: "ESSDAI improvement at week 24",
    npv: 2100,
    confidence: 71,
    trialData: {
      phase1: { enrolled: 36, completed: 36, successRate: 100 },
      phase2: { enrolled: 173, completed: 165, successRate: 92 },
      phase3: { enrolled: 450, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2018-03",
        outcome: "success" as const,
        keyData: ["Novel HSA-fusion format", "CD40L pathway modulation"],
        score: 40,
        rationale: "CD40L validated in autoimmunity; novel format avoids thromboembolic risk",
        availableData: "Preclinical safety data"
      },
      {
        phase: "Phase 1",
        date: "2019-01",
        outcome: "success" as const,
        keyData: ["No thromboembolic signals", "Extended half-life"],
        score: 50,
        rationale: "Overcomes historical CD40L safety concerns",
        availableData: "Phase 1 safety data"
      },
      {
        phase: "Phase 2",
        date: "2022-03",
        outcome: "success" as const,
        keyData: ["ESSDAI improvement: -5.0 vs -0.7 placebo", "Salivary flow improvement"],
        score: 68,
        rationale: "First disease-modifying signal in Sjögren's",
        availableData: "Phase 2 efficacy data"
      },
      {
        phase: "Phase 3 (PHOENYCS-GO)",
        date: "2024-01",
        outcome: "pending" as const,
        keyData: ["Global Phase 3 initiated", "Amgen acquired program"],
        score: 71,
        rationale: "Positive Phase 2 supports continued development",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,544,221",
        title: "CD40L antagonist HSA fusion proteins",
        expirationDate: "2038-03-22",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Ianalumab",
        sponsor: "Novartis",
        phase: "Phase 3",
        mechanism: "Anti-BAFF-R",
        differentiator: "B-cell targeting approach"
      },
      {
        name: "Telitacicept",
        sponsor: "RemeGen",
        phase: "Phase 3",
        mechanism: "TACI-Fc (BLyS/APRIL)",
        differentiator: "Dual cytokine targeting"
      },
      {
        name: "Iscalimab",
        sponsor: "Novartis",
        phase: "Phase 2",
        mechanism: "Anti-CD40",
        differentiator: "CD40-targeted approach"
      }
    ]
  },
  {
    id: "imm-012",
    name: "Tulisokibart",
    phase: "Phase 3",
    sponsor: "Prometheus Biosciences",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Ulcerative Colitis",
    mechanism: "Anti-TL1A monoclonal antibody",
    status: "Active",
    patentExpiry: "2039",
    marketCap: "Novel TL1A-targeted therapy for IBD",
    primaryEndpoint: "Clinical remission at week 12",
    npv: 4100,
    confidence: 87,
    trialData: {
      phase1: { enrolled: 48, completed: 48, successRate: 100 },
      phase2: { enrolled: 135, completed: 130, successRate: 96 },
      phase3: { enrolled: 700, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-06",
        outcome: "success" as const,
        keyData: ["TL1A genetic validation in IBD", "High-affinity antibody"],
        score: 48,
        rationale: "Strong genetic rationale for TL1A in UC/CD",
        availableData: "Genetic association data"
      },
      {
        phase: "Phase 1",
        date: "2020-03",
        outcome: "success" as const,
        keyData: ["Dose-proportional PK", "No immunogenicity"],
        score: 56,
        rationale: "Favorable profile enables IBD development",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2 (ARTEMIS-UC)",
        date: "2022-10",
        outcome: "success" as const,
        keyData: ["26.5% clinical remission vs 1.5% placebo", "Biomarker-selected population"],
        score: 82,
        rationale: "Unprecedented efficacy in biomarker-positive UC",
        availableData: "Phase 2 results"
      },
      {
        phase: "Phase 3 (ARTEMIS-1/2)",
        date: "2024-03",
        outcome: "pending" as const,
        keyData: ["Merck acquired Prometheus", "Large Phase 3 program"],
        score: 87,
        rationale: "Strong Phase 2 data supports accelerated development",
        availableData: "Studies ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,899,843",
        title: "Anti-TL1A antibodies for inflammatory bowel disease",
        expirationDate: "2039-06-15",
        type: "Composition of Matter" as const,
        status: "Active" as const
      },
      {
        patentNumber: "US11,149,086",
        title: "Biomarker-guided TL1A therapy in IBD",
        expirationDate: "2040-01-20",
        type: "Method of Use" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "RVT-3101",
        sponsor: "Roivant",
        phase: "Phase 3",
        mechanism: "Anti-TL1A",
        differentiator: "Competing TL1A inhibitor"
      },
      {
        name: "Vedolizumab",
        sponsor: "Takeda",
        phase: "Approved",
        mechanism: "Anti-integrin",
        differentiator: "Gut-selective, established safety"
      },
      {
        name: "Upadacitinib",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "JAK1 inhibitor",
        differentiator: "Oral, rapid onset"
      }
    ]
  },
  {
    id: "imm-013",
    name: "Povetacicept",
    phase: "Phase 3",
    sponsor: "Alpine Immune Sciences",
    therapeuticArea: "Immunology & Inflammation",
    indication: "IgA Nephropathy",
    mechanism: "BAFF/APRIL dual inhibitor (TACI-Fc)",
    status: "Active",
    patentExpiry: "2038",
    marketCap: "Dual cytokine blocker for IgAN",
    primaryEndpoint: "Proteinuria reduction at week 36",
    npv: 2800,
    confidence: 79,
    trialData: {
      phase1: { enrolled: 56, completed: 56, successRate: 100 },
      phase2: { enrolled: 82, completed: 78, successRate: 95 },
      phase3: { enrolled: 450, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-02",
        outcome: "success" as const,
        keyData: ["TACI-Fc dual targeting of BAFF/APRIL", "IgA reduction mechanism"],
        score: 45,
        rationale: "BAFF/APRIL validated in IgA production",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2020-01",
        outcome: "success" as const,
        keyData: ["Robust Ig reduction", "Dose-dependent response"],
        score: 54,
        rationale: "Clear PD effect on pathogenic IgA",
        availableData: "Phase 1 PK/PD data"
      },
      {
        phase: "Phase 2 (IGAN Study)",
        date: "2023-03",
        outcome: "success" as const,
        keyData: ["62% proteinuria reduction at week 36", "eGFR stabilization"],
        score: 76,
        rationale: "Best-in-class proteinuria reduction in IgAN",
        availableData: "Phase 2 results"
      },
      {
        phase: "Phase 3 (ENDEAVOR)",
        date: "2024-04",
        outcome: "pending" as const,
        keyData: ["Pivotal Phase 3 initiated", "Global enrollment"],
        score: 79,
        rationale: "Strong Phase 2 supports pivotal development",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,428,141",
        title: "TACI-Fc fusion proteins with enhanced APRIL binding",
        expirationDate: "2038-02-10",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Sparsentan",
        sponsor: "Travere",
        phase: "Approved",
        mechanism: "ETAR/AT1R dual antagonist",
        differentiator: "First approved for IgAN"
      },
      {
        name: "Telitacicept",
        sponsor: "RemeGen",
        phase: "Phase 3",
        mechanism: "TACI-Fc",
        differentiator: "Similar mechanism, China focus"
      },
      {
        name: "Atacicept",
        sponsor: "Vera",
        phase: "Phase 3",
        mechanism: "TACI-Ig",
        differentiator: "Different Fc fusion"
      }
    ]
  },
  {
    id: "imm-014",
    name: "Tofidence",
    phase: "Phase 3",
    sponsor: "Biogen",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Rheumatoid Arthritis",
    mechanism: "Tocilizumab biosimilar (anti-IL-6R)",
    status: "Active",
    patentExpiry: "N/A (Biosimilar)",
    marketCap: "High-quality tocilizumab biosimilar",
    primaryEndpoint: "ACR20 at week 24",
    npv: 1200,
    confidence: 94,
    trialData: {
      phase1: { enrolled: 180, completed: 180, successRate: 100 },
      phase3: { enrolled: 528, completed: 520, successRate: 98 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-04",
        outcome: "success" as const,
        keyData: ["Analytical similarity established", "Functional assay equivalence"],
        score: 65,
        rationale: "Strong analytical biosimilarity package",
        availableData: "CMC data"
      },
      {
        phase: "Phase 1 (PK Study)",
        date: "2020-02",
        outcome: "success" as const,
        keyData: ["PK equivalence demonstrated", "90% CI within 80-125%"],
        score: 78,
        rationale: "PK biosimilarity confirmed",
        availableData: "Phase 1 PK data"
      },
      {
        phase: "Phase 3 (Confirmatory)",
        date: "2022-08",
        outcome: "success" as const,
        keyData: ["ACR20 equivalent to reference", "Safety profile similar"],
        score: 94,
        rationale: "Clinical biosimilarity established",
        availableData: "Full Phase 3 data"
      }
    ],
    patents: [],
    competitiveLandscape: [
      {
        name: "Actemra",
        sponsor: "Roche",
        phase: "Approved",
        mechanism: "Anti-IL-6R",
        differentiator: "Reference product"
      },
      {
        name: "Tyenne",
        sponsor: "Fresenius Kabi",
        phase: "Approved",
        mechanism: "Anti-IL-6R biosimilar",
        differentiator: "First tocilizumab biosimilar"
      }
    ]
  },
  {
    id: "imm-015",
    name: "Duvakitug",
    phase: "Phase 2",
    sponsor: "Roche",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Inflammatory Bowel Disease",
    mechanism: "Bispecific anti-PD-1 x TIM-3",
    status: "Active",
    patentExpiry: "2040",
    marketCap: "Novel bispecific for refractory IBD",
    primaryEndpoint: "Clinical remission at week 12",
    npv: 1600,
    confidence: 55,
    trialData: {
      phase1: { enrolled: 42, completed: 42, successRate: 100 },
      phase2: { enrolled: 180, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2020-08",
        outcome: "success" as const,
        keyData: ["Bispecific format validated", "Novel T-cell modulation"],
        score: 35,
        rationale: "Exploratory mechanism in IBD, high-risk/high-reward",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2021-06",
        outcome: "success" as const,
        keyData: ["Acceptable safety in healthy volunteers", "Target engagement confirmed"],
        score: 45,
        rationale: "Safety enables IBD patient testing",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2",
        date: "2023-10",
        outcome: "pending" as const,
        keyData: ["Dose-ranging study in UC/CD", "Novel mechanism exploration"],
        score: 55,
        rationale: "Early signal generation in treatment-refractory IBD",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US11,292,853",
        title: "Bispecific antibodies targeting PD-1 and TIM-3",
        expirationDate: "2040-08-12",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Ustekinumab",
        sponsor: "J&J",
        phase: "Approved",
        mechanism: "Anti-IL-12/23",
        differentiator: "Established IBD therapy"
      },
      {
        name: "Risankizumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-IL-23p19",
        differentiator: "Strong CD efficacy"
      }
    ]
  },
  {
    id: "imm-016",
    name: "Ianalumab",
    phase: "Phase 3",
    sponsor: "Novartis",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Systemic Lupus Erythematosus",
    mechanism: "Anti-BAFF-R monoclonal antibody",
    status: "Active",
    patentExpiry: "2036",
    marketCap: "BAFF-R targeted B-cell depletion for SLE",
    primaryEndpoint: "SRI-4 at week 52",
    npv: 3100,
    confidence: 74,
    trialData: {
      phase1: { enrolled: 40, completed: 40, successRate: 100 },
      phase2: { enrolled: 144, completed: 138, successRate: 96 },
      phase3: { enrolled: 500, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2015-06",
        outcome: "success" as const,
        keyData: ["BAFF-R specific targeting", "B-cell depletion mechanism"],
        score: 42,
        rationale: "BAFF pathway validated in SLE; receptor targeting novel",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2016-04",
        outcome: "success" as const,
        keyData: ["Durable B-cell depletion", "Favorable safety"],
        score: 52,
        rationale: "Strong target engagement supports SLE development",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2",
        date: "2020-11",
        outcome: "success" as const,
        keyData: ["64% SRI-4 vs 47% placebo", "Steroid-sparing effect"],
        score: 70,
        rationale: "Positive signal in moderate-severe SLE",
        availableData: "Phase 2 efficacy data"
      },
      {
        phase: "Phase 3",
        date: "2024-02",
        outcome: "pending" as const,
        keyData: ["Global Phase 3 ongoing", "Multiple autoimmune indications"],
        score: 74,
        rationale: "Broad autoimmune program",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US9,650,439",
        title: "Anti-BAFF-R antibodies for treating autoimmune diseases",
        expirationDate: "2036-06-28",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Belimumab",
        sponsor: "GSK",
        phase: "Approved",
        mechanism: "Anti-BLyS/BAFF",
        differentiator: "First approved B-cell targeting for SLE"
      },
      {
        name: "Anifrolumab",
        sponsor: "AstraZeneca",
        phase: "Approved",
        mechanism: "Anti-IFNAR1",
        differentiator: "Type I IFN pathway"
      },
      {
        name: "Obinutuzumab",
        sponsor: "Roche",
        phase: "Phase 3",
        mechanism: "Anti-CD20",
        differentiator: "Enhanced B-cell depletion"
      }
    ]
  },
  {
    id: "imm-017",
    name: "Litifilimab",
    phase: "Phase 3",
    sponsor: "Biogen",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Cutaneous Lupus Erythematosus",
    mechanism: "Anti-BDCA2 monoclonal antibody",
    status: "Active",
    patentExpiry: "2037",
    marketCap: "First targeted therapy for cutaneous lupus",
    primaryEndpoint: "CLASI-A 50% reduction at week 16",
    npv: 1900,
    confidence: 68,
    trialData: {
      phase1: { enrolled: 30, completed: 30, successRate: 100 },
      phase2: { enrolled: 132, completed: 126, successRate: 95 },
      phase3: { enrolled: 400, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2016-09",
        outcome: "success" as const,
        keyData: ["BDCA2 targets pDCs", "Type I IFN suppression"],
        score: 40,
        rationale: "Novel pDC-targeting approach for cutaneous lupus",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2017-06",
        outcome: "success" as const,
        keyData: ["pDC depletion confirmed", "IFN signature reduction"],
        score: 50,
        rationale: "Target engagement validates mechanism",
        availableData: "Phase 1 PD data"
      },
      {
        phase: "Phase 2 (LILAC)",
        date: "2021-04",
        outcome: "success" as const,
        keyData: ["CLASI-A 50: 48% vs 25% placebo", "Skin improvement"],
        score: 66,
        rationale: "Meaningful efficacy in CLE",
        availableData: "Phase 2 results"
      },
      {
        phase: "Phase 3 (TOPAZ)",
        date: "2024-01",
        outcome: "pending" as const,
        keyData: ["Pivotal Phase 3 ongoing", "CLE and DLE populations"],
        score: 68,
        rationale: "First targeted therapy in late-stage CLE development",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,179,817",
        title: "Anti-BDCA2 antibodies for lupus",
        expirationDate: "2037-09-05",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Anifrolumab",
        sponsor: "AstraZeneca",
        phase: "Phase 3",
        mechanism: "Anti-IFNAR1",
        differentiator: "Approved for SLE, studying CLE"
      },
      {
        name: "BIIB059",
        sponsor: "Biogen",
        phase: "Phase 3",
        mechanism: "Anti-BDCA2",
        differentiator: "Same molecule, different branding"
      }
    ]
  },
  {
    id: "imm-018",
    name: "Iberdomide",
    phase: "Phase 3",
    sponsor: "Bristol-Myers Squibb",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Systemic Lupus Erythematosus",
    mechanism: "CELMoD (Cereblon E3 ligase modulator)",
    status: "Active",
    patentExpiry: "2038",
    marketCap: "Oral immunomodulator for SLE",
    primaryEndpoint: "SRI-4 at week 24",
    npv: 2400,
    confidence: 67,
    trialData: {
      phase1: { enrolled: 48, completed: 48, successRate: 100 },
      phase2: { enrolled: 288, completed: 274, successRate: 95 },
      phase3: { enrolled: 500, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-03",
        outcome: "success" as const,
        keyData: ["Novel CELMoD mechanism", "Dual Aiolos/Ikaros degradation"],
        score: 44,
        rationale: "Oral drug with novel mechanism for autoimmunity",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2018-01",
        outcome: "success" as const,
        keyData: ["B-cell reduction", "Manageable safety profile"],
        score: 52,
        rationale: "POC for transcription factor degradation",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2",
        date: "2022-06",
        outcome: "partial" as const,
        keyData: ["Trend toward efficacy", "Dose-response seen"],
        score: 62,
        rationale: "Mixed results require dose optimization in Phase 3",
        availableData: "Phase 2 data"
      },
      {
        phase: "Phase 3",
        date: "2024-03",
        outcome: "pending" as const,
        keyData: ["Optimized dose in Phase 3", "SLE population refined"],
        score: 67,
        rationale: "Revised development strategy in Phase 3",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,351,575",
        title: "CELMoD compounds for autoimmune diseases",
        expirationDate: "2038-03-18",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Belimumab",
        sponsor: "GSK",
        phase: "Approved",
        mechanism: "Anti-BLyS",
        differentiator: "Injectable, established"
      },
      {
        name: "Deucravacitinib",
        sponsor: "BMS",
        phase: "Phase 3",
        mechanism: "TYK2 inhibitor",
        differentiator: "Same sponsor, oral alternative"
      }
    ]
  },
  {
    id: "imm-019",
    name: "Felzartamab",
    phase: "Phase 3",
    sponsor: "MorphoSys/Human Immunology Biosciences",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Antibody-Mediated Rejection (Kidney Transplant)",
    mechanism: "Anti-CD38 monoclonal antibody",
    status: "Active",
    patentExpiry: "2036",
    marketCap: "First CD38-targeting therapy for AMR",
    primaryEndpoint: "Histological resolution at month 6",
    npv: 1800,
    confidence: 72,
    trialData: {
      phase1: { enrolled: 24, completed: 24, successRate: 100 },
      phase2: { enrolled: 22, completed: 22, successRate: 100 },
      phase3: { enrolled: 200, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2018-11",
        outcome: "success" as const,
        keyData: ["CD38 targets plasma cells/antibody production", "Novel indication"],
        score: 42,
        rationale: "CD38 validated in oncology, novel in transplant",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2019-08",
        outcome: "success" as const,
        keyData: ["Plasma cell reduction", "DSA reduction"],
        score: 52,
        rationale: "POC for reducing donor-specific antibodies",
        availableData: "Phase 1 data"
      },
      {
        phase: "Phase 2",
        date: "2023-05",
        outcome: "success" as const,
        keyData: ["68% histological resolution vs 0% placebo", "DSA clearance"],
        score: 72,
        rationale: "Striking efficacy in AMR, first positive trial",
        availableData: "Phase 2 results"
      },
      {
        phase: "Phase 3",
        date: "2024-06",
        outcome: "pending" as const,
        keyData: ["Pivotal Phase 3 initiated", "AMR + PLA indications"],
        score: 72,
        rationale: "Breakthrough efficacy supports rapid Phase 3",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US10,047,160",
        title: "Anti-CD38 antibodies for transplant rejection",
        expirationDate: "2036-11-22",
        type: "Method of Use" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Daratumumab",
        sponsor: "J&J",
        phase: "Off-label",
        mechanism: "Anti-CD38",
        differentiator: "MM-approved, exploring AMR"
      },
      {
        name: "Imlifidase",
        sponsor: "Hansa",
        phase: "Approved (EU)",
        mechanism: "IgG-degrading enzyme",
        differentiator: "Desensitization focus"
      }
    ]
  },
  {
    id: "imm-020",
    name: "Zimlovisertib",
    phase: "Phase 2",
    sponsor: "Kymera Therapeutics",
    therapeuticArea: "Immunology & Inflammation",
    indication: "Hidradenitis Suppurativa",
    mechanism: "IRAK4 degrader (oral protein degradation)",
    status: "Active",
    patentExpiry: "2041",
    marketCap: "First-in-class IRAK4 degrader for autoimmunity",
    primaryEndpoint: "HiSCR at week 16",
    npv: 2100,
    confidence: 58,
    trialData: {
      phase1: { enrolled: 80, completed: 80, successRate: 100 },
      phase2: { enrolled: 160, completed: 0, successRate: 0 }
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2020-10",
        outcome: "success" as const,
        keyData: ["Oral IRAK4 degrader", "Potent protein knockdown"],
        score: 38,
        rationale: "Novel modality in inflammation; high-risk/high-reward",
        availableData: "Preclinical data"
      },
      {
        phase: "Phase 1",
        date: "2021-09",
        outcome: "success" as const,
        keyData: [">90% IRAK4 degradation", "Cytokine suppression"],
        score: 50,
        rationale: "Strong PD effect validates degrader mechanism",
        availableData: "Phase 1 PD data"
      },
      {
        phase: "Phase 2 (HS Study)",
        date: "2024-01",
        outcome: "pending" as const,
        keyData: ["Dose-ranging in HS", "First efficacy signal expected"],
        score: 58,
        rationale: "Testing novel degrader in inflammatory disease",
        availableData: "Study ongoing"
      }
    ],
    patents: [
      {
        patentNumber: "US11,034,710",
        title: "IRAK4 degrader compounds",
        expirationDate: "2041-10-15",
        type: "Composition of Matter" as const,
        status: "Active" as const
      }
    ],
    competitiveLandscape: [
      {
        name: "Adalimumab",
        sponsor: "AbbVie",
        phase: "Approved",
        mechanism: "Anti-TNF",
        differentiator: "First approved HS therapy"
      },
      {
        name: "Secukinumab",
        sponsor: "Novartis",
        phase: "Approved",
        mechanism: "Anti-IL-17A",
        differentiator: "Approved for HS"
      },
      {
        name: "PF-06650833",
        sponsor: "Pfizer",
        phase: "Phase 2",
        mechanism: "IRAK4 inhibitor",
        differentiator: "Inhibitor vs degrader"
      }
    ]
  }
];
