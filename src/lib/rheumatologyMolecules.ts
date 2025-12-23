import { MoleculeProfile } from './moleculesData';

export const rheumatologyMolecules: MoleculeProfile[] = [
  // 1. Nipocalimab (Johnson & Johnson) - FcRn antagonist for myasthenia gravis and other autoimmune
  {
    id: "NIPO-01",
    name: "Nipocalimab",
    phase: "Phase III",
    indication: "Generalized Myasthenia Gravis",
    therapeuticArea: "Rheumatology",
    sponsor: "Johnson & Johnson",
    mechanismOfAction: "FcRn Antagonist",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "VIVACITY-MG3",
      nctId: "NCT04951622",
      phase: "Phase III",
      enrollment: 197,
      primaryEndpoint: "MG-ADL score change",
      secondaryEndpoints: ["QMG score", "MGC score", "Safety"],
      status: "Completed",
      readoutDate: "2024-03",
      toplineResults: "Met primary endpoint with significant MG-ADL improvement",
      detailedResults: {
        efficacy: "3.2-point improvement vs placebo in MG-ADL",
        safety: "Generally well tolerated; infections reported",
        biomarkers: "Significant IgG reduction observed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Breakthrough Therapy", "Fast Track", "Orphan Drug"],
      emaStatus: "Under Review",
      pdufa: "2025-06",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Peak sales $3-4B",
      patentExpiry: "2037",
      estimatedLaunchDate: "2025-Q3",
      competitorLandscape: "Competes with Vyvgart, Ultomiris"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2018-09",
        outcome: "success",
        keyData: ["Novel FcRn mechanism", "Strong preclinical data"],
        lpScore: 25,
        rationale: "First-in-class approach with validated target",
        dataAvailable: ["Preclinical efficacy", "Safety pharmacology"]
      },
      {
        phase: "Phase I",
        date: "2019-06",
        outcome: "success",
        keyData: ["Favorable PK profile", ">90% IgG reduction", "No serious AEs"],
        lpScore: 38,
        rationale: "Robust target engagement supports advancement",
        dataAvailable: ["Phase I results", "PK/PD modeling"]
      },
      {
        phase: "Phase II",
        date: "2021-03",
        outcome: "success",
        keyData: ["Significant efficacy signals", "Rapid onset of action", "Durable response"],
        lpScore: 52,
        rationale: "Clear dose-response supports Phase III design",
        dataAvailable: ["Phase II topline", "Biomarker correlation"]
      },
      {
        phase: "Phase III",
        date: "2024-03",
        outcome: "success",
        keyData: ["Met primary endpoint", "Consistent efficacy across subgroups", "Manageable safety"],
        lpScore: 78,
        rationale: "Strong Phase III results support regulatory filing",
        dataAvailable: ["Full Phase III data", "Regulatory submission package"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,781,258",
        title: "Anti-FcRn antibodies and methods of use",
        expirationDate: "2037-03-15",
        type: "composition",
        status: "active"
      },
      {
        patentNumber: "US11,254,745",
        title: "Methods for treating autoimmune diseases with FcRn antagonists",
        expirationDate: "2038-06-20",
        type: "method",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Vyvgart (Argenx)",
        phase: "Marketed",
        differentiator: "Nipocalimab offers monthly dosing vs weekly",
        threatLevel: "high"
      },
      {
        competitor: "Ultomiris (Alexion)",
        phase: "Marketed",
        differentiator: "Different mechanism; nipocalimab broader applicability",
        threatLevel: "medium"
      },
      {
        competitor: "Rozanolixizumab (UCB)",
        phase: "Phase III",
        differentiator: "Similar FcRn mechanism; competitive race",
        threatLevel: "high"
      }
    ]
  },

  // 2. Izokibep (Acelyrin) - IL-17A inhibitor
  {
    id: "IZOK-01",
    name: "Izokibep",
    phase: "Phase III",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Acelyrin",
    mechanismOfAction: "IL-17A Inhibitor",
    moleculeType: "Protein Therapeutic",
    clinicalTrialData: {
      trialName: "AFFINITY-1",
      nctId: "NCT05261867",
      phase: "Phase III",
      enrollment: 450,
      primaryEndpoint: "ACR50 at Week 16",
      secondaryEndpoints: ["PASI 90", "Resolution of enthesitis", "HAQ-DI"],
      status: "Active",
      readoutDate: "2025-Q1",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Phase II showed 65% ACR50 response",
        safety: "Favorable safety profile observed",
        biomarkers: "Rapid IL-17 neutralization"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Fast Track"],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Peak sales $1.5-2.5B",
      patentExpiry: "2039",
      estimatedLaunchDate: "2026-Q2",
      competitorLandscape: "Competes with Cosentyx, Taltz, Bimzelx"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-11",
        outcome: "success",
        keyData: ["Novel albumin-binding domain technology", "Enhanced half-life"],
        lpScore: 22,
        rationale: "Differentiated delivery technology",
        dataAvailable: ["Preclinical package"]
      },
      {
        phase: "Phase I",
        date: "2020-08",
        outcome: "success",
        keyData: ["Extended half-life confirmed", "Convenient SC dosing", "Good tolerability"],
        lpScore: 35,
        rationale: "PK supports monthly dosing advantage",
        dataAvailable: ["Phase I PK data"]
      },
      {
        phase: "Phase II",
        date: "2023-06",
        outcome: "success",
        keyData: ["65% ACR50", "80% PASI 75", "Superior to placebo"],
        lpScore: 55,
        rationale: "Strong efficacy positions for registrational studies",
        dataAvailable: ["Phase II full results"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,544,209",
        title: "IL-17A binding proteins with extended half-life",
        expirationDate: "2039-04-12",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Cosentyx (Novartis)",
        phase: "Marketed",
        differentiator: "Izokibep monthly vs Cosentyx monthly; similar efficacy expected",
        threatLevel: "high"
      },
      {
        competitor: "Bimzelx (UCB)",
        phase: "Marketed",
        differentiator: "Bimzelx dual IL-17 inhibition; different profile",
        threatLevel: "high"
      },
      {
        competitor: "Taltz (Eli Lilly)",
        phase: "Marketed",
        differentiator: "Established competitor; izokibep differentiation limited",
        threatLevel: "medium"
      }
    ]
  },

  // 3. Duvakitug (AbbVie/Teneobio) - TL1A inhibitor
  {
    id: "DUVA-01",
    name: "Duvakitug",
    phase: "Phase II",
    indication: "Inflammatory Bowel Disease / Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "AbbVie",
    mechanismOfAction: "TL1A Inhibitor",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "TL1A-RA-001",
      nctId: "NCT05543369",
      phase: "Phase II",
      enrollment: 320,
      primaryEndpoint: "ACR20 at Week 12",
      secondaryEndpoints: ["ACR50", "DAS28-CRP", "Safety"],
      status: "Active",
      readoutDate: "2025-Q2",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Early signals promising",
        safety: "No concerning signals to date",
        biomarkers: "TL1A pathway engagement confirmed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Peak sales potential $5B+ across indications",
      patentExpiry: "2041",
      estimatedLaunchDate: "2028",
      competitorLandscape: "First-in-class opportunity in TL1A"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2021-03",
        outcome: "success",
        keyData: ["Novel TL1A target", "Strong genetic validation"],
        lpScore: 20,
        rationale: "Emerging target with genetic evidence",
        dataAvailable: ["Preclinical data", "Target validation studies"]
      },
      {
        phase: "Phase I",
        date: "2022-06",
        outcome: "success",
        keyData: ["Clean safety profile", "Dose-dependent target engagement"],
        lpScore: 32,
        rationale: "First-in-human data supports advancement",
        dataAvailable: ["Phase I safety/PK"]
      },
      {
        phase: "Phase II Initiated",
        date: "2023-09",
        outcome: "pending",
        keyData: ["Multiple indications being explored", "Competitive race with Roche/Merck"],
        lpScore: 38,
        rationale: "Hot competitive space; execution critical",
        dataAvailable: ["Ongoing enrollment updates"]
      }
    ],
    patents: [
      {
        patentNumber: "US11,312,776",
        title: "Anti-TL1A antibodies and methods of use",
        expirationDate: "2041-09-22",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "RG6880 (Roche)",
        phase: "Phase III",
        differentiator: "Roche ahead in development; AbbVie has pipeline depth",
        threatLevel: "high"
      },
      {
        competitor: "MK-7240 (Merck)",
        phase: "Phase II",
        differentiator: "Similar stage; competitive differentiation pending",
        threatLevel: "high"
      },
      {
        competitor: "PRA023 (Prometheus)",
        phase: "Phase II",
        differentiator: "Focused on IBD; overlapping indications",
        threatLevel: "medium"
      }
    ]
  },

  // 4. Upadacitinib (AbbVie) - JAK1 inhibitor for AxSpA
  {
    id: "UPAD-AXSPA",
    name: "Upadacitinib (Rinvoq)",
    phase: "Marketed",
    indication: "Axial Spondyloarthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "AbbVie",
    mechanismOfAction: "JAK1 Selective Inhibitor",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "SELECT-AXIS 2",
      nctId: "NCT04169373",
      phase: "Phase III",
      enrollment: 420,
      primaryEndpoint: "ASAS40 at Week 14",
      secondaryEndpoints: ["ASDAS-ID", "SPARCC MRI score", "BASFI"],
      status: "Completed",
      readoutDate: "2022-06",
      toplineResults: "Met primary and all key secondary endpoints",
      detailedResults: {
        efficacy: "45% ASAS40 vs 23% placebo",
        safety: "Consistent with known JAK profile",
        biomarkers: "Rapid CRP reduction"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved",
      globalApprovalDates: {
        "FDA": "2022-04",
        "EMA": "2022-08"
      }
    },
    marketData: {
      analystConsensus: "Part of $10B+ Rinvoq franchise",
      patentExpiry: "2032",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Competes with Tofacitinib, biologics"
    },
    retrospectiveTimeline: [
      {
        phase: "Indication Expansion Filing",
        date: "2020-12",
        outcome: "success",
        keyData: ["Leveraged existing safety database", "Targeted nr-axSpA and r-axSpA"],
        lpScore: 60,
        rationale: "Established molecule with known profile",
        dataAvailable: ["Existing Phase III data", "Post-marketing safety"]
      },
      {
        phase: "Phase III",
        date: "2022-06",
        outcome: "success",
        keyData: ["45% ASAS40 response", "Significant MRI improvements", "Consistent safety"],
        lpScore: 82,
        rationale: "Strong data package supports approval",
        dataAvailable: ["Full SELECT-AXIS 2 results"]
      },
      {
        phase: "FDA Approval",
        date: "2022-04",
        outcome: "success",
        keyData: ["Approved for AS and nr-axSpA", "Once-daily oral dosing"],
        lpScore: 95,
        rationale: "Successful label expansion",
        dataAvailable: ["Prescribing information", "Real-world data emerging"]
      }
    ],
    patents: [
      {
        patentNumber: "US9,815,815",
        title: "JAK1 selective inhibitor compounds",
        expirationDate: "2032-01-18",
        type: "composition",
        status: "active"
      },
      {
        patentNumber: "US10,561,685",
        title: "Methods of treating axial spondyloarthritis",
        expirationDate: "2035-08-22",
        type: "method",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Tofacitinib (Pfizer)",
        phase: "Marketed",
        differentiator: "Upadacitinib more JAK1 selective; potentially better safety",
        threatLevel: "medium"
      },
      {
        competitor: "Humira/biosimilars",
        phase: "Marketed",
        differentiator: "Oral vs injectable; Rinvoq convenience advantage",
        threatLevel: "medium"
      },
      {
        competitor: "Cosentyx (Novartis)",
        phase: "Marketed",
        differentiator: "Different mechanism; both effective options",
        threatLevel: "medium"
      }
    ]
  },

  // 5. Ixekizumab (Eli Lilly) - IL-17A for Axial SpA
  {
    id: "IXEK-AXSPA",
    name: "Ixekizumab (Taltz)",
    phase: "Marketed",
    indication: "Non-Radiographic Axial Spondyloarthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Eli Lilly",
    mechanismOfAction: "IL-17A Inhibitor",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "COAST-X",
      nctId: "NCT02757352",
      phase: "Phase III",
      enrollment: 303,
      primaryEndpoint: "ASAS40 at Week 16 and 52",
      secondaryEndpoints: ["ASDAS", "BASDAI", "SF-36 PCS"],
      status: "Completed",
      readoutDate: "2019-11",
      toplineResults: "Met primary endpoint at both timepoints",
      detailedResults: {
        efficacy: "40% ASAS40 at Week 16 vs 19% placebo",
        safety: "Consistent with known IL-17 profile",
        biomarkers: "Sustained response through Week 52"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved",
      globalApprovalDates: {
        "FDA": "2020-06",
        "EMA": "2020-04"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $2.5B across all indications",
      patentExpiry: "2028",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Competes with Cosentyx, JAK inhibitors"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase III nr-axSpA",
        date: "2019-11",
        outcome: "success",
        keyData: ["40% ASAS40 response", "Durable through 52 weeks", "Consistent safety"],
        lpScore: 78,
        rationale: "Strong efficacy in difficult-to-treat population",
        dataAvailable: ["COAST-X full results"]
      },
      {
        phase: "FDA Approval",
        date: "2020-06",
        outcome: "success",
        keyData: ["Approved for nr-axSpA", "First IL-17 for this indication"],
        lpScore: 95,
        rationale: "New treatment option for patients",
        dataAvailable: ["Label", "Real-world evidence"]
      }
    ],
    patents: [
      {
        patentNumber: "US8,110,191",
        title: "Anti-IL-17A antibodies",
        expirationDate: "2028-11-15",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Cosentyx (Novartis)",
        phase: "Marketed",
        differentiator: "Both IL-17 inhibitors; similar efficacy profiles",
        threatLevel: "high"
      },
      {
        competitor: "Rinvoq (AbbVie)",
        phase: "Marketed",
        differentiator: "Oral JAK inhibitor alternative",
        threatLevel: "medium"
      }
    ]
  },

  // 6. Spesolimab (Boehringer Ingelheim) - IL-36R
  {
    id: "SPES-01",
    name: "Spesolimab (Spevigo)",
    phase: "Marketed",
    indication: "Generalized Pustular Psoriasis (GPP)",
    therapeuticArea: "Rheumatology",
    sponsor: "Boehringer Ingelheim",
    mechanismOfAction: "IL-36 Receptor Antagonist",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "Effisayil 1",
      nctId: "NCT03782792",
      phase: "Phase II",
      enrollment: 53,
      primaryEndpoint: "GPP Physician Global Assessment (GPPGA) pustulation subscore of 0",
      secondaryEndpoints: ["GPPGA total score", "Speed of response", "Safety"],
      status: "Completed",
      readoutDate: "2021-02",
      toplineResults: "54% achieved pustule clearance vs 6% placebo",
      detailedResults: {
        efficacy: "Rapid pustule clearance within 1 week",
        safety: "Well tolerated; infections noted",
        biomarkers: "IL-36 pathway suppression confirmed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Breakthrough Therapy", "Orphan Drug"],
      emaStatus: "Approved",
      pdufa: "Approved 2022-09",
      globalApprovalDates: {
        "FDA": "2022-09",
        "EMA": "2022-12",
        "Japan": "2022-10"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $800M-1.2B",
      patentExpiry: "2035",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "First-in-class for GPP; limited competition"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-06",
        outcome: "success",
        keyData: ["Novel IL-36 target", "Genetic validation in GPP"],
        lpScore: 28,
        rationale: "Strong genetic rationale for IL-36 in GPP",
        dataAvailable: ["Preclinical data"]
      },
      {
        phase: "Phase I",
        date: "2018-08",
        outcome: "success",
        keyData: ["Favorable safety", "Good PK profile"],
        lpScore: 40,
        rationale: "Clean FIH supports advancement",
        dataAvailable: ["Phase I results"]
      },
      {
        phase: "Phase II",
        date: "2021-02",
        outcome: "success",
        keyData: ["54% pustule clearance", "Rapid onset", "Well tolerated"],
        lpScore: 72,
        rationale: "Impressive efficacy in orphan indication",
        dataAvailable: ["Effisayil 1 data"]
      },
      {
        phase: "FDA Approval",
        date: "2022-09",
        outcome: "success",
        keyData: ["First approved treatment for GPP flares", "Breakthrough designation"],
        lpScore: 95,
        rationale: "First-in-class approval in unmet need",
        dataAvailable: ["Full prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,308,718",
        title: "Anti-IL-36R antibodies for treatment of pustular psoriasis",
        expirationDate: "2035-07-18",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Imsidolimab (Anaptysbio)",
        phase: "Phase III",
        differentiator: "Spesolimab first-to-market; imsidolimab for maintenance",
        threatLevel: "medium"
      },
      {
        competitor: "Generic steroids",
        phase: "Marketed",
        differentiator: "Spesolimab targeted therapy vs broad immunosuppression",
        threatLevel: "low"
      }
    ]
  },

  // 7. Anifrolumab (AstraZeneca) - Type I IFN receptor
  {
    id: "ANIF-01",
    name: "Anifrolumab (Saphnelo)",
    phase: "Marketed",
    indication: "Systemic Lupus Erythematosus (SLE)",
    therapeuticArea: "Rheumatology",
    sponsor: "AstraZeneca",
    mechanismOfAction: "Type I Interferon Receptor Antagonist",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "TULIP-2",
      nctId: "NCT02446899",
      phase: "Phase III",
      enrollment: 362,
      primaryEndpoint: "BICLA response at Week 52",
      secondaryEndpoints: ["SRI(4)", "OCS reduction", "Flare rate"],
      status: "Completed",
      readoutDate: "2020-01",
      toplineResults: "Met primary endpoint with 47.8% vs 31.5% BICLA response",
      detailedResults: {
        efficacy: "16.3% absolute difference in BICLA",
        safety: "Herpes zoster risk noted; manageable",
        biomarkers: "IFN gene signature suppression"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved 2021-07",
      globalApprovalDates: {
        "FDA": "2021-07",
        "EMA": "2022-02",
        "Japan": "2021-09"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $2-3B",
      patentExpiry: "2029",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Competes with Benlysta; differentiated by IFN targeting"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2013-04",
        outcome: "success",
        keyData: ["Type I IFN signature validated in SLE", "Novel target approach"],
        lpScore: 22,
        rationale: "Strong biological rationale",
        dataAvailable: ["Preclinical package"]
      },
      {
        phase: "Phase II",
        date: "2015-08",
        outcome: "success",
        keyData: ["Dose-dependent efficacy", "IFN signature suppression"],
        lpScore: 42,
        rationale: "Promising signal supports Phase III",
        dataAvailable: ["Phase II data"]
      },
      {
        phase: "TULIP-1 (Phase III)",
        date: "2019-08",
        outcome: "partial",
        keyData: ["Missed primary SRI endpoint", "Secondary endpoints positive"],
        lpScore: 35,
        rationale: "Mixed results create uncertainty",
        dataAvailable: ["TULIP-1 results"]
      },
      {
        phase: "TULIP-2 (Phase III)",
        date: "2020-01",
        outcome: "success",
        keyData: ["Met BICLA primary endpoint", "Consistent secondary endpoints"],
        lpScore: 68,
        rationale: "Second trial success supports filing",
        dataAvailable: ["TULIP-2 full data"]
      },
      {
        phase: "FDA Approval",
        date: "2021-07",
        outcome: "success",
        keyData: ["First new SLE mechanism in decades", "IFN-high patients benefit most"],
        lpScore: 95,
        rationale: "Important new option for SLE",
        dataAvailable: ["Prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US8,580,264",
        title: "Antibodies against interferon alpha receptor",
        expirationDate: "2029-03-22",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Benlysta (GSK)",
        phase: "Marketed",
        differentiator: "Different mechanisms; anifrolumab targets IFN vs BLyS",
        threatLevel: "medium"
      },
      {
        competitor: "Lupkynis (Aurinia)",
        phase: "Marketed",
        differentiator: "Lupkynis for lupus nephritis specifically",
        threatLevel: "low"
      }
    ]
  },

  // 8. Deucravacitinib (Bristol-Myers Squibb) - TYK2 inhibitor
  {
    id: "DEUC-01",
    name: "Deucravacitinib (Sotyktu)",
    phase: "Marketed",
    indication: "Plaque Psoriasis",
    therapeuticArea: "Rheumatology",
    sponsor: "Bristol-Myers Squibb",
    mechanismOfAction: "TYK2 Allosteric Inhibitor",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "POETYK PSO-1",
      nctId: "NCT03624127",
      phase: "Phase III",
      enrollment: 666,
      primaryEndpoint: "PASI 75 and sPGA 0/1 at Week 16",
      secondaryEndpoints: ["PASI 90", "DLQI 0/1", "Scalp/nail response"],
      status: "Completed",
      readoutDate: "2021-04",
      toplineResults: "Met all primary and key secondary endpoints",
      detailedResults: {
        efficacy: "58.4% PASI 75 vs 12.7% placebo, 35.1% apremilast",
        safety: "Favorable safety; no JAK-related signals",
        biomarkers: "Selective TYK2 inhibition confirmed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved 2022-09",
      globalApprovalDates: {
        "FDA": "2022-09",
        "EMA": "2023-04",
        "Japan": "2023-07"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $4-5B across indications",
      patentExpiry: "2036",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "First oral TYK2; competes with JAKs and biologics"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2016-08",
        outcome: "success",
        keyData: ["First allosteric TYK2 inhibitor", "Differentiated from JAK1/2/3"],
        lpScore: 25,
        rationale: "Novel mechanism may avoid JAK safety concerns",
        dataAvailable: ["Preclinical selectivity data"]
      },
      {
        phase: "Phase II",
        date: "2018-11",
        outcome: "success",
        keyData: ["Dose-dependent PASI response", "Clean safety profile"],
        lpScore: 48,
        rationale: "Strong efficacy without JAK-related AEs",
        dataAvailable: ["Phase II topline"]
      },
      {
        phase: "Phase III",
        date: "2021-04",
        outcome: "success",
        keyData: ["58% PASI 75", "Superior to apremilast", "Favorable safety"],
        lpScore: 78,
        rationale: "Differentiated profile supports broad use",
        dataAvailable: ["POETYK PSO-1 and PSO-2 data"]
      },
      {
        phase: "FDA Approval",
        date: "2022-09",
        outcome: "success",
        keyData: ["First TYK2 inhibitor approved", "No black box warning"],
        lpScore: 95,
        rationale: "Important new oral option",
        dataAvailable: ["Full prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,023,574",
        title: "TYK2 inhibitor compounds and methods of use",
        expirationDate: "2036-02-14",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Otezla (Amgen)",
        phase: "Marketed",
        differentiator: "Deucravacitinib superior efficacy in head-to-head",
        threatLevel: "low"
      },
      {
        competitor: "Rinvoq (AbbVie)",
        phase: "Marketed",
        differentiator: "Rinvoq stronger efficacy but more safety signals",
        threatLevel: "medium"
      },
      {
        competitor: "TAK-279 (Takeda)",
        phase: "Phase III",
        differentiator: "Next-gen TYK2; competitive threat emerging",
        threatLevel: "medium"
      }
    ]
  },

  // 9. Bimekizumab (UCB) - IL-17A/F
  {
    id: "BIME-01",
    name: "Bimekizumab (Bimzelx)",
    phase: "Marketed",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "UCB",
    mechanismOfAction: "IL-17A/F Dual Inhibitor",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "BE OPTIMAL",
      nctId: "NCT03895203",
      phase: "Phase III",
      enrollment: 852,
      primaryEndpoint: "ACR50 at Week 16",
      secondaryEndpoints: ["PASI 90", "Minimal disease activity", "HAQ-DI"],
      status: "Completed",
      readoutDate: "2021-06",
      toplineResults: "43.9% ACR50 vs 10.0% placebo",
      detailedResults: {
        efficacy: "Superior joint and skin responses",
        safety: "Candidiasis higher than IL-17A alone",
        biomarkers: "Complete IL-17A/F neutralization"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved 2023-10",
      globalApprovalDates: {
        "FDA": "2023-10",
        "EMA": "2023-06"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $3-4B",
      patentExpiry: "2034",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Premium IL-17 option; competes with Cosentyx, Taltz"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2015-09",
        outcome: "success",
        keyData: ["First dual IL-17A/F inhibitor", "Potential for superior efficacy"],
        lpScore: 25,
        rationale: "Novel dual inhibition approach",
        dataAvailable: ["Preclinical data"]
      },
      {
        phase: "Phase II",
        date: "2018-03",
        outcome: "success",
        keyData: ["High PASI response rates", "Faster onset than comparators"],
        lpScore: 52,
        rationale: "Differentiated efficacy profile",
        dataAvailable: ["Phase II psoriasis data"]
      },
      {
        phase: "Phase III PsA",
        date: "2021-06",
        outcome: "success",
        keyData: ["44% ACR50", "Strong skin clearance", "Manageable safety"],
        lpScore: 75,
        rationale: "Comprehensive efficacy across domains",
        dataAvailable: ["BE OPTIMAL full results"]
      },
      {
        phase: "FDA Approval PsA",
        date: "2023-10",
        outcome: "success",
        keyData: ["Approved for PsA", "Complete portfolio for IL-17 diseases"],
        lpScore: 95,
        rationale: "Premium positioning in market",
        dataAvailable: ["Updated prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,017,572",
        title: "Dual IL-17A/F antibodies",
        expirationDate: "2034-05-20",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Cosentyx (Novartis)",
        phase: "Marketed",
        differentiator: "Bimekizumab dual inhibition may be more efficacious",
        threatLevel: "medium"
      },
      {
        competitor: "Taltz (Eli Lilly)",
        phase: "Marketed",
        differentiator: "Similar positioning; price competition",
        threatLevel: "medium"
      }
    ]
  },

  // 10. Risankizumab (AbbVie) - IL-23 for PsA
  {
    id: "RISA-PSA",
    name: "Risankizumab (Skyrizi)",
    phase: "Marketed",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "AbbVie",
    mechanismOfAction: "IL-23p19 Inhibitor",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "KEEPsAKE 1",
      nctId: "NCT03675308",
      phase: "Phase III",
      enrollment: 964,
      primaryEndpoint: "ACR20 at Week 24",
      secondaryEndpoints: ["ACR50", "HAQ-DI", "Minimal disease activity"],
      status: "Completed",
      readoutDate: "2021-02",
      toplineResults: "Met primary endpoint",
      detailedResults: {
        efficacy: "ACR20 response significantly higher than placebo",
        safety: "Consistent with known IL-23 profile",
        biomarkers: "Durable response through Week 52"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved 2022-01",
      globalApprovalDates: {
        "FDA": "2022-01",
        "EMA": "2022-03"
      }
    },
    marketData: {
      analystConsensus: "Part of $15B Skyrizi franchise",
      patentExpiry: "2033",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Competes with Tremfya, IL-17s in PsA"
    },
    retrospectiveTimeline: [
      {
        phase: "Indication Expansion",
        date: "2020-06",
        outcome: "success",
        keyData: ["Leveraged psoriasis success", "PsA program initiated"],
        lpScore: 55,
        rationale: "IL-23 pathway validated in psoriasis",
        dataAvailable: ["Psoriasis Phase III data"]
      },
      {
        phase: "Phase III PsA",
        date: "2021-02",
        outcome: "success",
        keyData: ["Robust ACR responses", "Convenient dosing", "Clean safety"],
        lpScore: 78,
        rationale: "Strong efficacy supports approval",
        dataAvailable: ["KEEPsAKE 1 and 2 data"]
      },
      {
        phase: "FDA Approval",
        date: "2022-01",
        outcome: "success",
        keyData: ["Approved for active PsA", "Q12 week maintenance dosing"],
        lpScore: 95,
        rationale: "Successful portfolio expansion",
        dataAvailable: ["Updated label"]
      }
    ],
    patents: [
      {
        patentNumber: "US9,988,459",
        title: "Anti-IL-23p19 antibodies",
        expirationDate: "2033-08-12",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Tremfya (J&J)",
        phase: "Marketed",
        differentiator: "Both IL-23; Skyrizi longer dosing interval",
        threatLevel: "high"
      },
      {
        competitor: "Cosentyx (Novartis)",
        phase: "Marketed",
        differentiator: "Different mechanism; IL-23 vs IL-17",
        threatLevel: "medium"
      }
    ]
  },

  // 11. Voclosporin (Aurinia) - Calcineurin inhibitor for Lupus Nephritis
  {
    id: "VOCL-01",
    name: "Voclosporin (Lupkynis)",
    phase: "Marketed",
    indication: "Lupus Nephritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Aurinia",
    mechanismOfAction: "Calcineurin Inhibitor",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "AURORA 1",
      nctId: "NCT03021499",
      phase: "Phase III",
      enrollment: 357,
      primaryEndpoint: "Complete Renal Response at Week 52",
      secondaryEndpoints: ["Partial renal response", "Time to CRR", "eGFR stability"],
      status: "Completed",
      readoutDate: "2020-12",
      toplineResults: "40.8% CRR vs 22.5% placebo",
      detailedResults: {
        efficacy: "81% relative improvement in CRR",
        safety: "Manageable; renal monitoring required",
        biomarkers: "Rapid proteinuria reduction"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Fast Track"],
      emaStatus: "Approved",
      pdufa: "Approved 2021-01",
      globalApprovalDates: {
        "FDA": "2021-01",
        "EMA": "2022-09"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $1-1.5B",
      patentExpiry: "2027",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "First oral approved for active LN"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase II AURA-LV",
        date: "2018-06",
        outcome: "success",
        keyData: ["Dose-finding completed", "Efficacy signals observed"],
        lpScore: 45,
        rationale: "Novel CNI for lupus nephritis",
        dataAvailable: ["AURA-LV results"]
      },
      {
        phase: "Phase III AURORA",
        date: "2020-12",
        outcome: "success",
        keyData: ["41% CRR", "Rapid onset", "Added to standard of care"],
        lpScore: 78,
        rationale: "Clear benefit in lupus nephritis",
        dataAvailable: ["AURORA 1 full data"]
      },
      {
        phase: "FDA Approval",
        date: "2021-01",
        outcome: "success",
        keyData: ["First oral therapy for active LN", "Combination therapy"],
        lpScore: 95,
        rationale: "Important new treatment option",
        dataAvailable: ["Prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US7,332,472",
        title: "Novel cyclosporine analogues",
        expirationDate: "2027-06-18",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Benlysta (GSK)",
        phase: "Marketed",
        differentiator: "Different mechanism; can be used together",
        threatLevel: "low"
      },
      {
        competitor: "MMF/AZA (generic)",
        phase: "Marketed",
        differentiator: "Voclosporin added to standard; not replacement",
        threatLevel: "low"
      }
    ]
  },

  // 12. Filgotinib (Galapagos/Gilead) - JAK1 for RA
  {
    id: "FILG-01",
    name: "Filgotinib (Jyseleca)",
    phase: "Marketed (ex-US)",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Galapagos/Gilead",
    mechanismOfAction: "JAK1 Selective Inhibitor",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "FINCH 1",
      nctId: "NCT02889796",
      phase: "Phase III",
      enrollment: 1755,
      primaryEndpoint: "ACR20 at Week 12",
      secondaryEndpoints: ["ACR50/70", "DAS28-CRP remission", "HAQ-DI"],
      status: "Completed",
      readoutDate: "2019-08",
      toplineResults: "Met primary and all key secondary endpoints",
      detailedResults: {
        efficacy: "76.6% ACR20 vs 49.9% placebo",
        safety: "Favorable profile; sperm parameter concerns noted",
        biomarkers: "Rapid onset of action"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "US development discontinued",
      globalApprovalDates: {
        "EMA": "2020-09",
        "Japan": "2020-09"
      }
    },
    marketData: {
      analystConsensus: "Limited by US withdrawal",
      patentExpiry: "2030",
      estimatedLaunchDate: "Launched (ex-US)",
      competitorLandscape: "Competes with tofacitinib, upadacitinib in Europe"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase II",
        date: "2016-09",
        outcome: "success",
        keyData: ["Strong efficacy signals", "Promising safety"],
        lpScore: 50,
        rationale: "Competitive JAK profile",
        dataAvailable: ["DARWIN studies"]
      },
      {
        phase: "Phase III",
        date: "2019-08",
        outcome: "success",
        keyData: ["77% ACR20", "Met all endpoints", "Sperm data emerging"],
        lpScore: 70,
        rationale: "Efficacy strong but safety questions",
        dataAvailable: ["FINCH program data"]
      },
      {
        phase: "EMA Approval",
        date: "2020-09",
        outcome: "success",
        keyData: ["Approved for RA", "Monitoring recommendations"],
        lpScore: 85,
        rationale: "European launch successful",
        dataAvailable: ["EU SmPC"]
      },
      {
        phase: "US CRL",
        date: "2020-08",
        outcome: "setback",
        keyData: ["FDA requested additional data", "Development discontinued"],
        lpScore: 45,
        rationale: "US opportunity lost",
        dataAvailable: ["FDA correspondence"]
      }
    ],
    patents: [
      {
        patentNumber: "US8,796,310",
        title: "JAK1 inhibitor compounds",
        expirationDate: "2030-04-22",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Rinvoq (AbbVie)",
        phase: "Marketed",
        differentiator: "Rinvoq has full global approval; broader use",
        threatLevel: "high"
      },
      {
        competitor: "Xeljanz (Pfizer)",
        phase: "Marketed",
        differentiator: "Xeljanz established but safety concerns",
        threatLevel: "medium"
      }
    ]
  },

  // 13. Sarilumab (Regeneron/Sanofi) - IL-6R
  {
    id: "SARI-01",
    name: "Sarilumab (Kevzara)",
    phase: "Marketed",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Regeneron/Sanofi",
    mechanismOfAction: "IL-6 Receptor Antagonist",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "MONARCH",
      nctId: "NCT02332590",
      phase: "Phase III",
      enrollment: 369,
      primaryEndpoint: "DAS28-ESR change at Week 24",
      secondaryEndpoints: ["ACR20/50/70", "HAQ-DI", "Clinical remission"],
      status: "Completed",
      readoutDate: "2016-11",
      toplineResults: "Superior to adalimumab monotherapy",
      detailedResults: {
        efficacy: "Greater DAS28-ESR improvement vs Humira",
        safety: "IL-6 class effects; lipid changes, neutropenia",
        biomarkers: "CRP normalization"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Approved",
      pdufa: "Approved 2017-05",
      globalApprovalDates: {
        "FDA": "2017-05",
        "EMA": "2017-06"
      }
    },
    marketData: {
      analystConsensus: "Peak sales $1.5B",
      patentExpiry: "2030",
      estimatedLaunchDate: "Launched",
      competitorLandscape: "Competes with Actemra in IL-6 space"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase II",
        date: "2013-06",
        outcome: "success",
        keyData: ["Dose-response established", "Efficacy comparable to tocilizumab"],
        lpScore: 48,
        rationale: "Clear path to Phase III",
        dataAvailable: ["Phase II data"]
      },
      {
        phase: "Phase III",
        date: "2016-11",
        outcome: "success",
        keyData: ["Superior to Humira", "Every 2 week dosing", "Known IL-6 safety"],
        lpScore: 75,
        rationale: "Head-to-head superiority",
        dataAvailable: ["MONARCH data"]
      },
      {
        phase: "FDA Approval",
        date: "2017-05",
        outcome: "success",
        keyData: ["Approved for moderate-severe RA", "SC administration"],
        lpScore: 95,
        rationale: "Alternative IL-6 option",
        dataAvailable: ["Full prescribing information"]
      }
    ],
    patents: [
      {
        patentNumber: "US8,043,617",
        title: "Anti-IL-6R antibodies",
        expirationDate: "2030-09-15",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Actemra (Roche)",
        phase: "Marketed",
        differentiator: "First-mover in IL-6; sarilumab Q2W vs weekly option",
        threatLevel: "high"
      },
      {
        competitor: "JAK inhibitors",
        phase: "Marketed",
        differentiator: "Different mechanism; orals offer convenience",
        threatLevel: "medium"
      }
    ]
  },

  // 14. Olokizumab (R-Pharm) - IL-6
  {
    id: "OLOK-01",
    name: "Olokizumab",
    phase: "Marketed (Russia)",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "R-Pharm",
    mechanismOfAction: "IL-6 Inhibitor (Direct)",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "CREDO-1",
      nctId: "NCT02760407",
      phase: "Phase III",
      enrollment: 428,
      primaryEndpoint: "ACR20 at Week 12",
      secondaryEndpoints: ["DAS28-CRP", "ACR50/70", "Clinical remission"],
      status: "Completed",
      readoutDate: "2021-04",
      toplineResults: "Met primary endpoint with non-inferiority to adalimumab",
      detailedResults: {
        efficacy: "Non-inferior to adalimumab",
        safety: "IL-6 class safety profile",
        biomarkers: "CRP reduction"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "Not Filed",
      globalApprovalDates: {
        "Russia": "2020-12"
      }
    },
    marketData: {
      analystConsensus: "Regional product; limited global potential",
      patentExpiry: "2028",
      estimatedLaunchDate: "Launched (Russia)",
      competitorLandscape: "Regional competitor to tocilizumab/sarilumab"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase III",
        date: "2021-04",
        outcome: "success",
        keyData: ["Non-inferior to Humira", "Monthly dosing", "Regional focus"],
        lpScore: 68,
        rationale: "Viable regional option",
        dataAvailable: ["CREDO studies"]
      },
      {
        phase: "Russia Approval",
        date: "2020-12",
        outcome: "success",
        keyData: ["First approval", "Local manufacturing"],
        lpScore: 80,
        rationale: "Regional market access",
        dataAvailable: ["Russian registration"]
      }
    ],
    patents: [
      {
        patentNumber: "RU2652341",
        title: "IL-6 binding antibodies",
        expirationDate: "2028-11-20",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Actemra (Roche)",
        phase: "Marketed",
        differentiator: "Global standard; olokizumab regional",
        threatLevel: "high"
      },
      {
        competitor: "Kevzara (Regeneron)",
        phase: "Marketed",
        differentiator: "Similar positioning; limited differentiation",
        threatLevel: "medium"
      }
    ]
  },

  // 15. Peresolimab (Eli Lilly) - PD-1 agonist
  {
    id: "PERE-01",
    name: "Peresolimab (LY3462817)",
    phase: "Phase III",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Eli Lilly",
    mechanismOfAction: "PD-1 Agonist",
    moleculeType: "Monoclonal Antibody",
    clinicalTrialData: {
      trialName: "RESOLUTE-RA",
      nctId: "NCT05341557",
      phase: "Phase III",
      enrollment: 1100,
      primaryEndpoint: "ACR50 at Week 24",
      secondaryEndpoints: ["DAS28-CRP remission", "HAQ-DI", "Radiographic progression"],
      status: "Active",
      readoutDate: "2025-Q4",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Phase II showed promising ACR responses",
        safety: "No PD-1 agonist-specific concerns to date",
        biomarkers: "Immune regulation biomarkers"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Potential $2-3B if successful",
      patentExpiry: "2040",
      estimatedLaunchDate: "2027",
      competitorLandscape: "First-in-class PD-1 agonist for autoimmune"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-09",
        outcome: "success",
        keyData: ["Novel PD-1 agonist concept", "Opposite of checkpoint inhibitors"],
        lpScore: 20,
        rationale: "Innovative immunomodulation approach",
        dataAvailable: ["Preclinical package"]
      },
      {
        phase: "Phase I",
        date: "2020-12",
        outcome: "success",
        keyData: ["Favorable safety", "Target engagement confirmed"],
        lpScore: 32,
        rationale: "No unexpected safety signals",
        dataAvailable: ["Phase I data"]
      },
      {
        phase: "Phase II",
        date: "2023-06",
        outcome: "success",
        keyData: ["Significant ACR responses", "Dose selection confirmed", "Novel mechanism works"],
        lpScore: 55,
        rationale: "Proof-of-concept achieved; Phase III initiated",
        dataAvailable: ["Phase II results"]
      }
    ],
    patents: [
      {
        patentNumber: "US11,208,475",
        title: "PD-1 agonist antibodies for treating autoimmune disease",
        expirationDate: "2040-03-28",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "No direct competitors",
        phase: "N/A",
        differentiator: "First-in-class mechanism",
        threatLevel: "low"
      },
      {
        competitor: "JAK inhibitors",
        phase: "Marketed",
        differentiator: "Different approach; potential for different safety profile",
        threatLevel: "medium"
      }
    ]
  },

  // 16. Ozoralizumab (Taisho) - Trivalent anti-TNF
  {
    id: "OZOR-01",
    name: "Ozoralizumab (Nanozora)",
    phase: "Marketed (Japan)",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Taisho Pharmaceutical",
    mechanismOfAction: "Anti-TNF (Trivalent Nanobody)",
    moleculeType: "Nanobody",
    clinicalTrialData: {
      trialName: "NATSUZORA",
      nctId: "NCT04077567",
      phase: "Phase III",
      enrollment: 380,
      primaryEndpoint: "ACR20 at Week 16",
      secondaryEndpoints: ["ACR50/70", "DAS28 remission", "Safety"],
      status: "Completed",
      readoutDate: "2021-03",
      toplineResults: "Met primary endpoint",
      detailedResults: {
        efficacy: "Significant ACR responses",
        safety: "Consistent with anti-TNF class",
        biomarkers: "TNF neutralization"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "Not Filed",
      globalApprovalDates: {
        "Japan": "2022-09"
      }
    },
    marketData: {
      analystConsensus: "Japan-focused; limited global plans",
      patentExpiry: "2032",
      estimatedLaunchDate: "Launched (Japan)",
      competitorLandscape: "Unique nanobody format in TNF space"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase II",
        date: "2018-06",
        outcome: "success",
        keyData: ["Novel nanobody format", "Monthly SC dosing feasible"],
        lpScore: 45,
        rationale: "Format differentiation confirmed",
        dataAvailable: ["Phase II results"]
      },
      {
        phase: "Phase III Japan",
        date: "2021-03",
        outcome: "success",
        keyData: ["ACR responses achieved", "Convenient dosing", "Good tolerability"],
        lpScore: 72,
        rationale: "Japan registration path clear",
        dataAvailable: ["NATSUZORA data"]
      },
      {
        phase: "Japan Approval",
        date: "2022-09",
        outcome: "success",
        keyData: ["First nanobody for RA", "Monthly dosing advantage"],
        lpScore: 90,
        rationale: "Novel modality approved",
        dataAvailable: ["Japan label"]
      }
    ],
    patents: [
      {
        patentNumber: "JP6712423",
        title: "Trivalent anti-TNF nanobody constructs",
        expirationDate: "2032-08-14",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Humira biosimilars",
        phase: "Marketed",
        differentiator: "Novel format vs established biosimilars",
        threatLevel: "high"
      },
      {
        competitor: "Enbrel (Pfizer)",
        phase: "Marketed",
        differentiator: "Different binding epitope; nanobody format",
        threatLevel: "medium"
      }
    ]
  },

  // 17. TAK-279 (Takeda) - TYK2 inhibitor
  {
    id: "TAK279-01",
    name: "TAK-279",
    phase: "Phase III",
    indication: "Psoriasis / Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    sponsor: "Takeda",
    mechanismOfAction: "TYK2 Inhibitor (Allosteric)",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "LATITUDE-1",
      nctId: "NCT05153109",
      phase: "Phase III",
      enrollment: 1000,
      primaryEndpoint: "PASI 75 at Week 16",
      secondaryEndpoints: ["PASI 90/100", "IGA 0/1", "ACR responses"],
      status: "Active",
      readoutDate: "2025-Q2",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Phase II showed high PASI responses",
        safety: "Clean profile similar to deucravacitinib",
        biomarkers: "TYK2 pathway modulation"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Potential $2-3B if differentiated from Sotyktu",
      patentExpiry: "2041",
      estimatedLaunchDate: "2026-Q4",
      competitorLandscape: "Second TYK2 entrant; must differentiate"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2020-06",
        outcome: "success",
        keyData: ["Second-generation TYK2 inhibitor", "Improved potency profile"],
        lpScore: 25,
        rationale: "Fast follower approach",
        dataAvailable: ["Preclinical data"]
      },
      {
        phase: "Phase II",
        date: "2023-03",
        outcome: "success",
        keyData: ["High PASI responses", "Once-daily dosing", "Clean safety"],
        lpScore: 52,
        rationale: "Competitive with deucravacitinib",
        dataAvailable: ["Phase II results"]
      },
      {
        phase: "Phase III Initiated",
        date: "2023-09",
        outcome: "pending",
        keyData: ["Multiple indications", "Global development"],
        lpScore: 55,
        rationale: "Execution-dependent success",
        dataAvailable: ["Trial designs public"]
      }
    ],
    patents: [
      {
        patentNumber: "WO2020/123845",
        title: "TYK2 inhibitor compounds",
        expirationDate: "2041-01-15",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Sotyktu (BMS)",
        phase: "Marketed",
        differentiator: "TAK-279 may show higher efficacy",
        threatLevel: "high"
      },
      {
        competitor: "Rinvoq (AbbVie)",
        phase: "Marketed",
        differentiator: "Rinvoq stronger but more AEs; TYK2 safer",
        threatLevel: "medium"
      }
    ]
  },

  // 18. Iberdomide (Bristol-Myers Squibb) - CELMoD for SLE
  {
    id: "IBER-01",
    name: "Iberdomide (CC-220)",
    phase: "Phase III",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Rheumatology",
    sponsor: "Bristol-Myers Squibb",
    mechanismOfAction: "Cereblon E3 Ligase Modulator (CELMoD)",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "MERIDIAN",
      nctId: "NCT05268055",
      phase: "Phase III",
      enrollment: 500,
      primaryEndpoint: "SRI(4) at Week 52",
      secondaryEndpoints: ["BICLA", "Time to first flare", "OCS reduction"],
      status: "Active",
      readoutDate: "2026-Q1",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Phase II showed promising SRI responses",
        safety: "Neutropenia manageable; teratogenicity risk",
        biomarkers: "Ikaros/Aiolos degradation confirmed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Fast Track"],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Potential $1.5-2.5B for SLE",
      patentExpiry: "2036",
      estimatedLaunchDate: "2027",
      competitorLandscape: "Novel oral mechanism for SLE"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2017-03",
        outcome: "success",
        keyData: ["Next-gen CELMoD", "Higher potency than lenalidomide"],
        lpScore: 22,
        rationale: "Innovative approach for autoimmune",
        dataAvailable: ["Preclinical data"]
      },
      {
        phase: "Phase I",
        date: "2018-09",
        outcome: "success",
        keyData: ["Dose-dependent Ikaros degradation", "Manageable safety"],
        lpScore: 35,
        rationale: "Target engagement confirmed",
        dataAvailable: ["Phase I results"]
      },
      {
        phase: "Phase II",
        date: "2022-12",
        outcome: "success",
        keyData: ["SRI(4) responses observed", "Dose selection confirmed", "REMS likely required"],
        lpScore: 52,
        rationale: "Efficacy supports Phase III; safety needs management",
        dataAvailable: ["Phase II data"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,407,393",
        title: "Cereblon binding compounds for treating autoimmune diseases",
        expirationDate: "2036-05-22",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Saphnelo (AstraZeneca)",
        phase: "Marketed",
        differentiator: "Different mechanism; iberdomide oral",
        threatLevel: "medium"
      },
      {
        competitor: "Benlysta (GSK)",
        phase: "Marketed",
        differentiator: "Established standard; iberdomide novel approach",
        threatLevel: "medium"
      }
    ]
  },

  // 19. Lanraplenib (Gilead) - SYK/JAK inhibitor
  {
    id: "LANR-01",
    name: "Lanraplenib (GS-9876)",
    phase: "Phase II",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Rheumatology",
    sponsor: "Gilead",
    mechanismOfAction: "SYK Inhibitor",
    moleculeType: "Small Molecule",
    clinicalTrialData: {
      trialName: "SEESAW",
      nctId: "NCT03865927",
      phase: "Phase II",
      enrollment: 300,
      primaryEndpoint: "SRI(4) at Week 24",
      secondaryEndpoints: ["BICLA", "Biomarker changes", "Safety"],
      status: "Completed",
      readoutDate: "2023-06",
      toplineResults: "Did not meet primary endpoint",
      detailedResults: {
        efficacy: "SRI(4) not significantly different from placebo",
        safety: "Generally well tolerated",
        biomarkers: "Target engagement confirmed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: [],
      emaStatus: "Not Filed",
      pdufa: "N/A",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "Development uncertain after Phase II miss",
      patentExpiry: "2035",
      estimatedLaunchDate: "TBD",
      competitorLandscape: "SYK inhibition approach may continue"
    },
    retrospectiveTimeline: [
      {
        phase: "Phase I",
        date: "2017-09",
        outcome: "success",
        keyData: ["SYK inhibition confirmed", "Good PK profile"],
        lpScore: 30,
        rationale: "Novel target for SLE",
        dataAvailable: ["Phase I data"]
      },
      {
        phase: "Phase II",
        date: "2023-06",
        outcome: "setback",
        keyData: ["Primary endpoint missed", "Some biomarker effects", "Efficacy insufficient"],
        lpScore: 18,
        rationale: "SYK inhibition alone may not be sufficient",
        dataAvailable: ["Phase II results"]
      }
    ],
    patents: [
      {
        patentNumber: "US9,884,866",
        title: "SYK inhibitor compounds",
        expirationDate: "2035-07-14",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "Fostamatinib (Rigel)",
        phase: "Marketed (ITP)",
        differentiator: "Different SYK inhibitor; different indication",
        threatLevel: "low"
      },
      {
        competitor: "Saphnelo (AstraZeneca)",
        phase: "Marketed",
        differentiator: "Saphnelo approved; lanraplenib development unclear",
        threatLevel: "high"
      }
    ]
  },

  // 20. Dazodalibep (Horizon/Amgen) - CD40L inhibitor
  {
    id: "DAZO-01",
    name: "Dazodalibep (HZN-4920)",
    phase: "Phase III",
    indication: "Sjögren's Syndrome",
    therapeuticArea: "Rheumatology",
    sponsor: "Amgen (via Horizon)",
    mechanismOfAction: "CD40L Inhibitor",
    moleculeType: "Fusion Protein",
    clinicalTrialData: {
      trialName: "AMARANTH",
      nctId: "NCT05035043",
      phase: "Phase III",
      enrollment: 500,
      primaryEndpoint: "ESSDAI improvement at Week 24",
      secondaryEndpoints: ["ESSPRI", "Patient-reported outcomes", "Salivary flow"],
      status: "Active",
      readoutDate: "2025-Q3",
      toplineResults: "Pending",
      detailedResults: {
        efficacy: "Phase II showed significant ESSDAI improvement",
        safety: "No thromboembolic signals (historical CD40L concern)",
        biomarkers: "B cell modulation observed"
      }
    },
    regulatoryStatus: {
      fdaDesignation: ["Breakthrough Therapy"],
      emaStatus: "Not Filed",
      pdufa: "TBD",
      globalApprovalDates: {}
    },
    marketData: {
      analystConsensus: "First-in-class opportunity; $1-2B potential",
      patentExpiry: "2038",
      estimatedLaunchDate: "2026",
      competitorLandscape: "No approved therapies for Sjögren's"
    },
    retrospectiveTimeline: [
      {
        phase: "IND Filing",
        date: "2019-06",
        outcome: "success",
        keyData: ["Novel CD40L approach", "Designed to avoid thrombotic risk"],
        lpScore: 25,
        rationale: "Addressing historical safety concern",
        dataAvailable: ["Preclinical safety package"]
      },
      {
        phase: "Phase I",
        date: "2020-12",
        outcome: "success",
        keyData: ["No thrombotic signals", "Good PK", "Target engagement"],
        lpScore: 38,
        rationale: "Critical safety milestone passed",
        dataAvailable: ["Phase I data"]
      },
      {
        phase: "Phase II Sjögren's",
        date: "2023-03",
        outcome: "success",
        keyData: ["Significant ESSDAI improvement", "Symptom benefits", "Clean safety"],
        lpScore: 62,
        rationale: "First effective therapy in Sjögren's",
        dataAvailable: ["Phase II results"]
      },
      {
        phase: "Breakthrough Designation",
        date: "2023-06",
        outcome: "success",
        keyData: ["FDA recognition of unmet need", "Accelerated development path"],
        lpScore: 68,
        rationale: "Regulatory support for advancement",
        dataAvailable: ["FDA correspondence"]
      }
    ],
    patents: [
      {
        patentNumber: "US10,927,166",
        title: "CD40L fusion proteins with enhanced safety profile",
        expirationDate: "2038-11-05",
        type: "composition",
        status: "active"
      }
    ],
    competitiveLandscape: [
      {
        competitor: "No approved competitors",
        phase: "N/A",
        differentiator: "First-mover advantage in Sjögren's",
        threatLevel: "low"
      },
      {
        competitor: "Ianalumab (Novartis)",
        phase: "Phase III",
        differentiator: "Different mechanism (BAFF-R); both targeting Sjögren's",
        threatLevel: "medium"
      }
    ]
  }
];
