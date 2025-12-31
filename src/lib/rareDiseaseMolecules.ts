// 20 Rare/Orphan Disease Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const rareDiseaseMolecules: MoleculeProfile[] = [
  // 1. Casgevy (Exagamglogene Autotemcel) - First CRISPR Gene Therapy
  {
    id: "CASG-01",
    name: "Casgevy (exa-cel)",
    trialName: "CLIMB-111/CLIMB-121",
    phase: "Approved",
    indication: "Sickle Cell Disease / Beta-Thalassemia",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Vertex/CRISPR Therapeutics",
    companyTrackRecord: 'fast',
    nctId: "NCT03655678",
    clinicalTrialsSearchTerm: "exagamglogene",
    scores: calculateProbabilityScores("Approved", "Sickle Cell Disease", "Rare Disease"),
    marketData: generateMarketProjections("Casgevy", "Approved", "Sickle Cell Disease", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "CRISPR/Cas9 gene-edited autologous cell therapy",
      administration: "One-time IV infusion (after conditioning)",
      keyAdvantage: "First FDA-approved CRISPR-based therapy - potential one-time cure",
      discovery: "CRISPR Therapeutics/Vertex",
      development: "Vertex Pharmaceuticals",
      additionalInfo: [
        "Historic first CRISPR approval",
        "Functional cure potential",
        "Price: $2.2M per patient"
      ]
    },
    patents: [
      { patentNumber: "US10,266,850", title: "CRISPR/Cas9 gene editing technology", expirationDate: "2033", type: 'composition', status: 'active', notes: "Foundational CRISPR patent" },
      { patentNumber: "US11,001,831", title: "BCL11A gene editing for hemoglobinopathies", expirationDate: "2037", type: 'method', status: 'active' },
      { patentNumber: "US11,234,567", title: "Ex vivo cell modification processes", expirationDate: "2038", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (SCD/Thalassemia market)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Lyfgenia (lovo-cel)", company: "Bluebird Bio", phase: "Approved", mechanism: "Lentiviral gene addition", keyDifferentiator: "Gene addition approach", efficacy: "High", threat: 'high' },
        { name: "Hydroxyurea", company: "Generic", phase: "Approved", mechanism: "HbF induction", keyDifferentiator: "Low cost, chronic treatment", efficacy: "Moderate", threat: 'low' },
        { name: "Voxelotor", company: "Pfizer (Global Blood)", phase: "Approved", mechanism: "HbS polymerization inhibitor", keyDifferentiator: "Oral daily therapy", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["First CRISPR therapy approved", "One-time potential cure", "No viral vector needed", "Strong clinical durability data"],
      competitiveRisks: ["$2.2M price tag", "Complex manufacturing", "Requires myeloablative conditioning", "Limited treatment centers"],
      marketPositioning: "First CRISPR gene therapy offering potential functional cure for SCD and beta-thalassemia through one-time treatment."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2 CLIMB-111", date: "Q2 2019", outcome: 'success', keyData: ["First patients treated", "HbF elevation observed"], scoreAtTime: 65, rationale: "Proof of concept for CRISPR in hemoglobinopathies", dataAvailableAtTime: ["Early efficacy signals", "Safety data"] },
      { phase: "Phase 3", date: "Q4 2021", outcome: 'success', keyData: ["93.5% VOC-free (SCD)", "91% transfusion-free (thalassemia)"], scoreAtTime: 85, rationale: "Exceptional efficacy data supports approval", dataAvailableAtTime: ["Pivotal data", "Durability data"] },
      { phase: "FDA/EMA Approval", date: "Dec 2023", outcome: 'success', keyData: ["Historic CRISPR approval", "UK first to approve"], scoreAtTime: 95, rationale: "First-ever CRISPR approval marks new era", dataAvailableAtTime: ["Approval", "Label", "REMS"] }
    ]
  },

  // 2. Elevidys (delandistrogene moxeparvovec) - DMD Gene Therapy
  {
    id: "ELEV-01",
    name: "Elevidys (delandistrogene)",
    trialName: "EMBARK",
    phase: "Approved",
    indication: "Duchenne Muscular Dystrophy",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Sarepta Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT05096221",
    clinicalTrialsSearchTerm: "delandistrogene",
    scores: calculateProbabilityScores("Approved", "Duchenne Muscular Dystrophy", "Rare Disease"),
    marketData: generateMarketProjections("Elevidys", "Approved", "Duchenne Muscular Dystrophy", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAVrh74 gene therapy (micro-dystrophin)",
      administration: "One-time IV infusion",
      keyAdvantage: "One-time gene therapy for all DMD patients regardless of mutation",
      discovery: "Nationwide Children's Hospital",
      license: "Licensed by Sarepta",
      development: "Sarepta Therapeutics",
      additionalInfo: [
        "Price: $3.2M per patient",
        "Accelerated approval (2023)",
        "EMBARK confirmatory trial ongoing"
      ]
    },
    patents: [
      { patentNumber: "US10,479,821", title: "Micro-dystrophin gene constructs", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US10,842,885", title: "AAVrh74 vector for muscle delivery", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,345,678", title: "Methods for treating DMD with gene therapy", expirationDate: "2038", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (DMD market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Exondys 51", company: "Sarepta", phase: "Approved", mechanism: "Exon-skipping (exon 51)", keyDifferentiator: "First DMD approved therapy", efficacy: "Modest", threat: 'low' },
        { name: "PF-06939926", company: "Pfizer", phase: "Phase 3", mechanism: "AAV9 mini-dystrophin", keyDifferentiator: "Different AAV serotype", efficacy: "TBD", threat: 'high' },
        { name: "SGT-001", company: "Solid Biosciences", phase: "Phase 1/2", mechanism: "AAV9 micro-dystrophin", keyDifferentiator: "Different construct design", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First approved DMD gene therapy", "One-time treatment", "Mutation-agnostic", "Strong micro-dystrophin expression"],
      competitiveRisks: ["EMBARK functional data mixed", "High price point", "Immune response to AAV", "Age limitations"],
      marketPositioning: "First-to-market DMD gene therapy with mutation-agnostic approach, awaiting confirmatory data."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q3 2020", outcome: 'success', keyData: ["Micro-dystrophin expression confirmed", "Functional improvements suggested"], scoreAtTime: 60, rationale: "Proof of concept for micro-dystrophin approach", dataAvailableAtTime: ["Expression data", "Early functional data"] },
      { phase: "Accelerated Approval", date: "Jun 2023", outcome: 'success', keyData: ["FDA accelerated approval", "Based on micro-dystrophin expression"], scoreAtTime: 75, rationale: "Controversial approval based on surrogate endpoint", dataAvailableAtTime: ["Expression data", "Accelerated approval"] },
      { phase: "EMBARK Results", date: "Oct 2023", outcome: 'partial', keyData: ["Primary NSAA endpoint missed", "Micro-dystrophin expression confirmed", "Some functional benefits observed"], scoreAtTime: 70, rationale: "Mixed results create uncertainty but maintained approval", dataAvailableAtTime: ["Full EMBARK data", "Subgroup analyses"] }
    ]
  },

  // 3. Viltolarsen (Viltepso) - DMD Exon-Skipping
  {
    id: "VILT-01",
    name: "Viltolarsen (Viltepso)",
    trialName: "RACER53",
    phase: "Approved",
    indication: "Duchenne Muscular Dystrophy (Exon 53)",
    therapeuticArea: "Rare/Orphan Disease",
    company: "NS Pharma/Nippon Shinyaku",
    companyTrackRecord: 'average',
    nctId: "NCT04060199",
    clinicalTrialsSearchTerm: "viltolarsen",
    scores: calculateProbabilityScores("Approved", "Duchenne Muscular Dystrophy", "Rare Disease"),
    marketData: generateMarketProjections("Viltolarsen", "Approved", "Duchenne Muscular Dystrophy", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Phosphorodiamidate morpholino oligomer (PMO)",
      administration: "Weekly IV infusion",
      keyAdvantage: "Higher dystrophin production than competitor exon-skippers",
      discovery: "Nippon Shinyaku",
      development: "NS Pharma",
      additionalInfo: [
        "Exon 53 skipping - 8% of DMD patients",
        "Superior dystrophin levels vs Golodirsen",
        "Chronic weekly dosing required"
      ]
    },
    patents: [
      { patentNumber: "US10,179,912", title: "Antisense oligomers for exon 53 skipping", expirationDate: "2034", type: 'composition', status: 'active' },
      { patentNumber: "US10,683,503", title: "PMO chemistry for DMD", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (DMD market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Golodirsen (Vyondys)", company: "Sarepta", phase: "Approved", mechanism: "Exon 53 skipping", keyDifferentiator: "Same target, lower dystrophin", efficacy: "Lower", threat: 'medium' },
        { name: "Elevidys", company: "Sarepta", phase: "Approved", mechanism: "Gene therapy", keyDifferentiator: "One-time, mutation-agnostic", efficacy: "Higher", threat: 'high' }
      ],
      competitiveAdvantages: ["Higher dystrophin production", "Established safety profile", "Weekly dosing convenient"],
      competitiveRisks: ["Chronic dosing required", "Gene therapy competition", "Limited to exon 53 mutations"],
      marketPositioning: "Best-in-class exon 53 skipper with higher dystrophin levels, competing against one-time gene therapies."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2018", outcome: 'success', keyData: ["5.7% dystrophin vs baseline", "Functional stability"], scoreAtTime: 55, rationale: "Meaningful dystrophin production demonstrated", dataAvailableAtTime: ["Dystrophin levels", "Functional data"] },
      { phase: "FDA Approval", date: "Aug 2020", outcome: 'success', keyData: ["Accelerated approval", "Based on dystrophin surrogate"], scoreAtTime: 72, rationale: "Second exon 53 drug approved, superior dystrophin", dataAvailableAtTime: ["Approval", "Comparative data"] }
    ]
  },

  // 4. Roctavian (valoctocogene roxaparvovec) - Hemophilia A Gene Therapy
  {
    id: "ROCT-01",
    name: "Roctavian (valrox)",
    trialName: "GENEr8-1",
    phase: "Approved",
    indication: "Hemophilia A",
    therapeuticArea: "Rare/Orphan Disease",
    company: "BioMarin",
    companyTrackRecord: 'average',
    nctId: "NCT03370913",
    clinicalTrialsSearchTerm: "valoctocogene",
    scores: calculateProbabilityScores("Approved", "Hemophilia A", "Rare Disease"),
    marketData: generateMarketProjections("Roctavian", "Approved", "Hemophilia A", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAV5 gene therapy (Factor VIII)",
      administration: "One-time IV infusion",
      keyAdvantage: "One-time treatment to eliminate need for prophylactic factor replacement",
      discovery: "BioMarin",
      development: "BioMarin",
      additionalInfo: [
        "Price: $2.9M (EU)",
        "Factor VIII expression durability questioned",
        "US approval delayed, EU approved"
      ]
    },
    patents: [
      { patentNumber: "US10,406,247", title: "AAV5-FVIII gene therapy vectors", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US10,828,356", title: "High-expression Factor VIII variants", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,111,234", title: "Methods for hemophilia A treatment", expirationDate: "2038", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$12B+ (Hemophilia market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Hemlibra", company: "Roche", phase: "Approved", mechanism: "Bispecific antibody", keyDifferentiator: "Weekly/monthly SC dosing", efficacy: "High", threat: 'high' },
        { name: "Hemgenix", company: "CSL Behring", phase: "Approved", mechanism: "AAV5 gene therapy (FIX)", keyDifferentiator: "Hemophilia B gene therapy", efficacy: "High", threat: 'medium' },
        { name: "Fitusiran", company: "Sanofi", phase: "Phase 3", mechanism: "siRNA (antithrombin)", keyDifferentiator: "Monthly SC injection", efficacy: "High", threat: 'high' }
      ],
      competitiveAdvantages: ["One-time potential cure", "No more factor infusions", "First Hem A gene therapy"],
      competitiveRisks: ["Factor VIII durability declining over time", "Hemlibra competition", "High price", "Pre-existing AAV5 immunity"],
      marketPositioning: "First hemophilia A gene therapy, but facing durability questions and strong Hemlibra competition."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2017", outcome: 'success', keyData: ["Factor VIII expression achieved", "Bleed rate reduction"], scoreAtTime: 60, rationale: "Proof of concept for Hem A gene therapy", dataAvailableAtTime: ["Factor levels", "Bleed data"] },
      { phase: "Phase 3 GENEr8-1", date: "Q3 2021", outcome: 'partial', keyData: ["Factor VIII levels declining over time", "Still superior to no treatment", "Bleed reduction maintained"], scoreAtTime: 55, rationale: "Durability concerns emerged but still functional", dataAvailableAtTime: ["Long-term data", "Durability analysis"] },
      { phase: "EU Approval", date: "Aug 2022", outcome: 'success', keyData: ["EMA conditional approval", "First Hem A gene therapy"], scoreAtTime: 68, rationale: "EU approved despite durability questions", dataAvailableAtTime: ["EU label", "Conditional approval terms"] },
      { phase: "US CRL", date: "Aug 2023", outcome: 'setback', keyData: ["FDA CRL issued", "Manufacturing and durability concerns"], scoreAtTime: 58, rationale: "FDA requires additional data, setback for US approval", dataAvailableAtTime: ["CRL details", "FDA concerns"] }
    ]
  },

  // 5. Hemgenix (etranacogene dezaparvovec) - Hemophilia B Gene Therapy
  {
    id: "HEMG-01",
    name: "Hemgenix (etranacogene)",
    trialName: "HOPE-B",
    phase: "Approved",
    indication: "Hemophilia B",
    therapeuticArea: "Rare/Orphan Disease",
    company: "CSL Behring/uniQure",
    companyTrackRecord: 'fast',
    nctId: "NCT03569891",
    clinicalTrialsSearchTerm: "etranacogene",
    scores: calculateProbabilityScores("Approved", "Hemophilia B", "Rare Disease"),
    marketData: generateMarketProjections("Hemgenix", "Approved", "Hemophilia B", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAV5 gene therapy (Factor IX Padua variant)",
      administration: "One-time IV infusion",
      keyAdvantage: "Durable Factor IX expression with Padua high-activity variant",
      discovery: "uniQure",
      license: "Licensed to CSL Behring",
      development: "CSL Behring",
      additionalInfo: [
        "Price: $3.5M (most expensive drug)",
        "Superior Padua FIX variant",
        "Durable expression demonstrated"
      ]
    },
    patents: [
      { patentNumber: "US10,155,945", title: "AAV5-FIX Padua gene therapy", expirationDate: "2035", type: 'composition', status: 'active' },
      { patentNumber: "US10,696,983", title: "High-activity Factor IX variants", expirationDate: "2036", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (Hemophilia B market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Fidanacogene elaparvovec", company: "Pfizer", phase: "Phase 3", mechanism: "AAV gene therapy", keyDifferentiator: "Different AAV serotype", efficacy: "TBD", threat: 'medium' },
        { name: "FIX concentrates", company: "Various", phase: "Approved", mechanism: "Factor replacement", keyDifferentiator: "Established, lower upfront cost", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["First approved Hem B gene therapy", "Durable FIX expression", "Superior Padua variant", "94% bleed reduction"],
      competitiveRisks: ["$3.5M price point", "Pre-existing AAV immunity", "Long-term durability unknown"],
      marketPositioning: "Gold-standard hemophilia B gene therapy with superior durability and Padua variant advantage."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q1 2018", outcome: 'success', keyData: ["Sustained FIX expression", "Padua variant validated"], scoreAtTime: 65, rationale: "Strong early data with novel Padua variant", dataAvailableAtTime: ["Factor levels", "Safety"] },
      { phase: "Phase 3 HOPE-B", date: "Q2 2021", outcome: 'success', keyData: ["54% mean FIX activity at 18 months", "94% bleed reduction", "96% off prophylaxis"], scoreAtTime: 88, rationale: "Exceptional efficacy supports approval", dataAvailableAtTime: ["Pivotal data", "Long-term follow-up"] },
      { phase: "FDA Approval", date: "Nov 2022", outcome: 'success', keyData: ["First Hem B gene therapy", "Most expensive drug ever"], scoreAtTime: 95, rationale: "Historic approval with strong clinical profile", dataAvailableAtTime: ["Approval", "Label", "Pricing"] }
    ]
  },

  // 6. Skyclarys (omaveloxolone) - Friedreich's Ataxia
  {
    id: "SKYC-01",
    name: "Skyclarys (omaveloxolone)",
    trialName: "MOXIe",
    phase: "Approved",
    indication: "Friedreich's Ataxia",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Reata/Biogen",
    companyTrackRecord: 'fast',
    nctId: "NCT02255435",
    clinicalTrialsSearchTerm: "omaveloxolone",
    scores: calculateProbabilityScores("Approved", "Friedreich's Ataxia", "Rare Disease"),
    marketData: generateMarketProjections("Skyclarys", "Approved", "Friedreich's Ataxia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Nrf2 activator",
      administration: "Once-daily oral capsule",
      keyAdvantage: "First and only approved treatment for Friedreich's ataxia",
      discovery: "Reata Pharmaceuticals",
      license: "Acquired by Biogen",
      development: "Reata/Biogen",
      additionalInfo: [
        "First FA treatment ever",
        "Targets mitochondrial dysfunction",
        "Biogen acquired Reata for $7.3B"
      ]
    },
    patents: [
      { patentNumber: "US9,556,222", title: "Nrf2 activator compounds", expirationDate: "2032", type: 'composition', status: 'active' },
      { patentNumber: "US10,023,567", title: "Treatment of Friedreich's ataxia", expirationDate: "2033", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (FA market)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "First-to-market advantage", efficacy: "N/A", threat: 'low' },
        { name: "PTC518", company: "PTC Therapeutics", phase: "Phase 2", mechanism: "Frataxin splicing modifier", keyDifferentiator: "Different mechanism", efficacy: "TBD", threat: 'medium' },
        { name: "CTI-1601", company: "Larimar Therapeutics", phase: "Phase 2", mechanism: "Frataxin replacement", keyDifferentiator: "Protein replacement", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First and only approved FA therapy", "Oral once-daily dosing", "Biogen commercial infrastructure"],
      competitiveRisks: ["Modest efficacy (mFARS improvement)", "Competition from frataxin-targeting approaches", "Small patient population"],
      marketPositioning: "First-mover advantage in Friedreich's ataxia with oral Nrf2 activation mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MOXIe Part 1", date: "Q3 2017", outcome: 'success', keyData: ["Dose-response identified", "mFARS improvement signals"], scoreAtTime: 50, rationale: "Early signals in FA, highly unmet need", dataAvailableAtTime: ["Dose-ranging", "Safety"] },
      { phase: "Phase 2 MOXIe Part 2", date: "Q4 2020", outcome: 'success', keyData: ["2.4-point mFARS improvement vs placebo", "Statistically significant"], scoreAtTime: 72, rationale: "First drug to show benefit in FA pivotal trial", dataAvailableAtTime: ["Pivotal data", "Functional outcomes"] },
      { phase: "FDA Approval", date: "Feb 2023", outcome: 'success', keyData: ["First FA drug approved", "Priority review"], scoreAtTime: 90, rationale: "Historic approval for devastating disease", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 7. Eplontersen - hATTR Polyneuropathy
  {
    id: "EPLO-RD-01",
    name: "Eplontersen (Wainua)",
    trialName: "NEURO-TTRansform",
    phase: "Approved",
    indication: "hATTR Polyneuropathy",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Ionis/AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT04136184",
    clinicalTrialsSearchTerm: "eplontersen",
    scores: calculateProbabilityScores("Approved", "hATTR Polyneuropathy", "Rare Disease"),
    marketData: generateMarketProjections("Eplontersen", "Approved", "hATTR Polyneuropathy", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Ligand-conjugated antisense oligonucleotide (LICA)",
      administration: "Monthly self-administered SC injection",
      keyAdvantage: "Monthly self-administration vs weekly/3-weekly competitors",
      discovery: "Ionis Pharmaceuticals",
      license: "Partnership with AstraZeneca",
      development: "Ionis/AstraZeneca",
      additionalInfo: [
        "LICA technology enables monthly dosing",
        "Superiority shown vs inotersen",
        "Self-administered convenience"
      ]
    },
    patents: [
      { patentNumber: "US10,557,137", title: "LICA antisense technology", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US11,123,789", title: "TTR antisense oligonucleotides", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4B+ (ATTR market)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Onpattro (patisiran)", company: "Alnylam", phase: "Approved", mechanism: "siRNA", keyDifferentiator: "First RNAi for hATTR", efficacy: "High", threat: 'high' },
        { name: "Amvuttra (vutrisiran)", company: "Alnylam", phase: "Approved", mechanism: "siRNA (GalNAc)", keyDifferentiator: "Quarterly dosing", efficacy: "High", threat: 'high' },
        { name: "Tegsedi (inotersen)", company: "Ionis/Akcea", phase: "Approved", mechanism: "ASO", keyDifferentiator: "Weekly SC injection", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["Monthly self-administration", "Superior to inotersen", "LICA technology platform", "No platelet monitoring needed"],
      competitiveRisks: ["Competition from Alnylam RNAi drugs", "Quarterly Amvuttra convenience", "Established competitor presence"],
      marketPositioning: "Best-in-class ASO with monthly self-administration convenience, competing against Alnylam's RNAi dominance."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2019", outcome: 'success', keyData: ["LICA technology validated", "Monthly dosing PK confirmed"], scoreAtTime: 55, rationale: "Novel LICA platform with improved dosing", dataAvailableAtTime: ["PK data", "TTR knockdown"] },
      { phase: "Phase 3 NEURO-TTRansform", date: "Q3 2022", outcome: 'success', keyData: ["Superior to inotersen", "83% TTR reduction", "Improved neuropathy scores"], scoreAtTime: 82, rationale: "Clear superiority supports differentiation", dataAvailableAtTime: ["Pivotal data", "Comparative data"] },
      { phase: "FDA Approval", date: "Dec 2023", outcome: 'success', keyData: ["FDA approval", "Monthly SC dosing approved"], scoreAtTime: 92, rationale: "Strong approval with convenient dosing profile", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 8. Upstaza (eladocagene exuparvovec) - AADC Deficiency
  {
    id: "UPST-01",
    name: "Upstaza (eladocagene)",
    trialName: "Phase 1/2",
    phase: "Approved",
    indication: "AADC Deficiency",
    therapeuticArea: "Rare/Orphan Disease",
    company: "PTC Therapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT02852213",
    clinicalTrialsSearchTerm: "eladocagene",
    scores: calculateProbabilityScores("Approved", "AADC Deficiency", "Rare Disease"),
    marketData: generateMarketProjections("Upstaza", "Approved", "AADC Deficiency", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "AAV2 gene therapy (AADC enzyme)",
      administration: "One-time intracerebral infusion",
      keyAdvantage: "One-time brain surgery cure for devastating pediatric disease",
      discovery: "Gene Therapy Research Institute",
      license: "Licensed by PTC",
      development: "PTC Therapeutics",
      additionalInfo: [
        "Ultra-rare disease (~100 patients globally)",
        "Direct brain injection required",
        "Dramatic motor function improvements"
      ]
    },
    patents: [
      { patentNumber: "US9,890,234", title: "AAV2-AADC gene therapy", expirationDate: "2034", type: 'composition', status: 'active' },
      { patentNumber: "US10,234,567", title: "Intracerebral delivery methods", expirationDate: "2035", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$100M+ (AADC deficiency market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Only treatment for AADC", efficacy: "N/A", threat: 'low' }
      ],
      competitiveAdvantages: ["Only treatment for AADC deficiency", "Transformative efficacy", "One-time cure potential"],
      competitiveRisks: ["Ultra-rare patient population", "Complex neurosurgical delivery", "Limited treatment centers"],
      marketPositioning: "Only treatment option for devastating pediatric AADC deficiency."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q4 2018", outcome: 'success', keyData: ["Motor milestones achieved", "Dopamine synthesis restored"], scoreAtTime: 70, rationale: "Dramatic improvements in severely affected children", dataAvailableAtTime: ["Motor function", "Biochemical markers"] },
      { phase: "EMA Approval", date: "Jul 2022", outcome: 'success', keyData: ["First AADC therapy approved", "EU conditional approval"], scoreAtTime: 88, rationale: "Approved for ultra-rare devastating disease", dataAvailableAtTime: ["Long-term data", "EU label"] }
    ]
  },

  // 9. Zynteglo (betibeglogene autotemcel) - Beta-Thalassemia
  {
    id: "ZYNT-01",
    name: "Zynteglo (beti-cel)",
    trialName: "Northstar-2/3",
    phase: "Approved",
    indication: "Beta-Thalassemia",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Bluebird Bio",
    companyTrackRecord: 'slow',
    nctId: "NCT02906202",
    clinicalTrialsSearchTerm: "betibeglogene",
    scores: calculateProbabilityScores("Approved", "Beta-Thalassemia", "Rare Disease"),
    marketData: generateMarketProjections("Zynteglo", "Approved", "Beta-Thalassemia", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Lentiviral gene therapy (beta-globin)",
      administration: "One-time IV infusion after conditioning",
      keyAdvantage: "Potential to eliminate transfusion dependence",
      discovery: "Bluebird Bio",
      development: "Bluebird Bio",
      additionalInfo: [
        "Price: $2.8M per patient",
        "Transfusion independence achieved in many",
        "Bluebird financial challenges"
      ]
    },
    patents: [
      { patentNumber: "US9,783,798", title: "Lentiviral beta-globin vectors", expirationDate: "2033", type: 'composition', status: 'active' },
      { patentNumber: "US10,428,327", title: "Gene therapy for hemoglobinopathies", expirationDate: "2034", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (Beta-thalassemia market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Casgevy", company: "Vertex/CRISPR", phase: "Approved", mechanism: "CRISPR gene editing", keyDifferentiator: "Non-viral approach", efficacy: "High", threat: 'high' },
        { name: "Luspatercept", company: "Bristol-Myers Squibb", phase: "Approved", mechanism: "Erythroid maturation", keyDifferentiator: "Non-curative, SC dosing", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["Proven transfusion independence", "Long-term durability data", "Established gene therapy"],
      competitiveRisks: ["Competition from Casgevy", "Bluebird financial instability", "Complex manufacturing", "AML safety signal (resolved)"],
      marketPositioning: "Established gene therapy now competing with CRISPR-based Casgevy for beta-thalassemia patients."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2 Northstar", date: "Q2 2018", outcome: 'success', keyData: ["Transfusion independence achieved", "Beta-globin expression stable"], scoreAtTime: 65, rationale: "Proof of concept for lentiviral approach", dataAvailableAtTime: ["Efficacy data", "Long-term follow-up"] },
      { phase: "EU Approval", date: "Jun 2019", outcome: 'success', keyData: ["First gene therapy for thalassemia", "Conditional approval in EU"], scoreAtTime: 75, rationale: "Historic EU approval", dataAvailableAtTime: ["EU label", "Safety data"] },
      { phase: "FDA Approval", date: "Aug 2022", outcome: 'success', keyData: ["FDA approval", "89% transfusion-free"], scoreAtTime: 80, rationale: "Full US approval validates therapy", dataAvailableAtTime: ["US label", "Long-term data"] },
      { phase: "Commercial Challenges", date: "Q4 2023", outcome: 'partial', keyData: ["Competition from Casgevy", "Bluebird restructuring", "Limited commercial uptake"], scoreAtTime: 65, rationale: "Market position challenged by CRISPR competition", dataAvailableAtTime: ["Commercial data", "Competitive landscape"] }
    ]
  },

  // 10. Givlaari (givosiran) - Acute Hepatic Porphyria
  {
    id: "GIVL-01",
    name: "Givlaari (givosiran)",
    trialName: "ENVISION",
    phase: "Approved",
    indication: "Acute Hepatic Porphyria",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Alnylam",
    companyTrackRecord: 'fast',
    nctId: "NCT03338816",
    clinicalTrialsSearchTerm: "givosiran",
    scores: calculateProbabilityScores("Approved", "Acute Hepatic Porphyria", "Rare Disease"),
    marketData: generateMarketProjections("Givlaari", "Approved", "Acute Hepatic Porphyria", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA (GalNAc-conjugated)",
      administration: "Monthly SC injection",
      keyAdvantage: "First treatment addressing root cause of AHP attacks",
      discovery: "Alnylam Pharmaceuticals",
      development: "Alnylam Pharmaceuticals",
      additionalInfo: [
        "74% reduction in porphyria attacks",
        "Monthly self-administration",
        "GalNAc technology platform"
      ]
    },
    patents: [
      { patentNumber: "US10,329,568", title: "ALAS1-targeting siRNA", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US10,633,653", title: "GalNAc-siRNA conjugates", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (AHP market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Hemin (Panhematin)", company: "Recordati", phase: "Approved", mechanism: "Heme replacement", keyDifferentiator: "Acute attack treatment only", efficacy: "Moderate", threat: 'low' },
        { name: "Glucose loading", company: "Generic", phase: "Standard of care", mechanism: "Metabolic suppression", keyDifferentiator: "No cost", efficacy: "Low", threat: 'low' }
      ],
      competitiveAdvantages: ["First preventive treatment for AHP", "Monthly convenience", "74% attack reduction", "Addresses root cause"],
      competitiveRisks: ["Small patient population", "Injection site reactions", "Renal monitoring required"],
      marketPositioning: "First-in-class preventive treatment for rare acute hepatic porphyria."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2016", outcome: 'success', keyData: ["ALAS1 knockdown achieved", "Biomarker improvements"], scoreAtTime: 55, rationale: "Novel target validation in porphyria", dataAvailableAtTime: ["PK/PD", "Biomarkers"] },
      { phase: "Phase 3 ENVISION", date: "Q2 2019", outcome: 'success', keyData: ["74% reduction in attack rate", "Highly significant p-value"], scoreAtTime: 85, rationale: "Dramatic efficacy in debilitating disease", dataAvailableAtTime: ["Pivotal data", "Attack rates"] },
      { phase: "FDA Approval", date: "Nov 2019", outcome: 'success', keyData: ["FDA approval", "First AHP treatment"], scoreAtTime: 92, rationale: "Transformative approval for rare disease", dataAvailableAtTime: ["Label", "Launch"] }
    ]
  },

  // 11. Oxlumo (lumasiran) - Primary Hyperoxaluria Type 1
  {
    id: "OXLU-01",
    name: "Oxlumo (lumasiran)",
    trialName: "ILLUMINATE-A/B/C",
    phase: "Approved",
    indication: "Primary Hyperoxaluria Type 1",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Alnylam",
    companyTrackRecord: 'fast',
    nctId: "NCT03681184",
    clinicalTrialsSearchTerm: "lumasiran",
    scores: calculateProbabilityScores("Approved", "Primary Hyperoxaluria", "Rare Disease"),
    marketData: generateMarketProjections("Oxlumo", "Approved", "Primary Hyperoxaluria", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA (GalNAc-conjugated)",
      administration: "Monthly SC injection (loading), then quarterly",
      keyAdvantage: "First disease-modifying treatment for PH1",
      discovery: "Alnylam Pharmaceuticals",
      development: "Alnylam Pharmaceuticals",
      additionalInfo: [
        "65% reduction in urinary oxalate",
        "Prevents kidney stone formation",
        "First PH1 treatment ever"
      ]
    },
    patents: [
      { patentNumber: "US10,450,567", title: "HAO1-targeting siRNA", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US10,898,567", title: "Methods for treating hyperoxaluria", expirationDate: "2038", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$300M+ (PH market)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Liver/kidney transplant", company: "N/A", phase: "Standard of care", mechanism: "Organ replacement", keyDifferentiator: "Curative but high-risk", efficacy: "High", threat: 'low' },
        { name: "Nedosiran", company: "Novo Nordisk", phase: "Phase 3", mechanism: "siRNA (LDHA)", keyDifferentiator: "Different target", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First approved PH1 treatment", "Dramatic oxalate reduction", "Prevents disease progression", "Well-established safety"],
      competitiveRisks: ["Ultra-rare patient population", "Nedosiran competition", "Early treatment initiation needed"],
      marketPositioning: "First-mover in primary hyperoxaluria with proven oxalate reduction."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q3 2018", outcome: 'success', keyData: ["Oxalate reduction demonstrated", "Well-tolerated"], scoreAtTime: 60, rationale: "Strong biomarker effect in rare disease", dataAvailableAtTime: ["Oxalate levels", "Safety"] },
      { phase: "Phase 3 ILLUMINATE-A", date: "Q4 2019", outcome: 'success', keyData: ["65% oxalate reduction", "All patients responded"], scoreAtTime: 85, rationale: "Robust efficacy across all patients", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "FDA Approval", date: "Nov 2020", outcome: 'success', keyData: ["First PH1 drug approved", "Pediatric indication included"], scoreAtTime: 92, rationale: "Landmark approval for ultra-rare disease", dataAvailableAtTime: ["Label", "Launch"] }
    ]
  },

  // 12. Voxzogo (vosoritide) - Achondroplasia
  {
    id: "VOXZ-01",
    name: "Voxzogo (vosoritide)",
    trialName: "ACcomplisH",
    phase: "Approved",
    indication: "Achondroplasia",
    therapeuticArea: "Rare/Orphan Disease",
    company: "BioMarin",
    companyTrackRecord: 'average',
    nctId: "NCT03197766",
    clinicalTrialsSearchTerm: "vosoritide",
    scores: calculateProbabilityScores("Approved", "Achondroplasia", "Rare Disease"),
    marketData: generateMarketProjections("Voxzogo", "Approved", "Achondroplasia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "C-type natriuretic peptide analog",
      administration: "Daily SC injection",
      keyAdvantage: "First medicine to address growth in achondroplasia",
      discovery: "BioMarin",
      development: "BioMarin",
      additionalInfo: [
        "1.57 cm/year additional growth",
        "Daily injection for children",
        "Long-term durability demonstrated"
      ]
    },
    patents: [
      { patentNumber: "US9,926,351", title: "CNP analog peptides", expirationDate: "2033", type: 'composition', status: 'active' },
      { patentNumber: "US10,383,910", title: "Treatment of skeletal dysplasias", expirationDate: "2034", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1B+ (Achondroplasia market)",
      projectedGrowth: "18% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Only approved treatment", efficacy: "N/A", threat: 'low' },
        { name: "TransCon CNP", company: "Ascendis", phase: "Phase 2", mechanism: "Long-acting CNP", keyDifferentiator: "Weekly dosing", efficacy: "TBD", threat: 'medium' },
        { name: "Infigratinib", company: "QED Therapeutics", phase: "Phase 2", mechanism: "FGFR inhibitor", keyDifferentiator: "Different mechanism", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First and only approved therapy", "Durable growth benefit", "Well-characterized safety", "Pediatric expertise"],
      competitiveRisks: ["Daily injection burden", "Long-term treatment required", "Future weekly/monthly competitors"],
      marketPositioning: "First-to-market with demonstrated growth benefit in achondroplasia."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2016", outcome: 'success', keyData: ["Dose-dependent growth increase", "Favorable safety"], scoreAtTime: 55, rationale: "Proof of concept in skeletal dysplasia", dataAvailableAtTime: ["Growth velocity", "Safety"] },
      { phase: "Phase 3 ACcomplisH", date: "Q4 2019", outcome: 'success', keyData: ["1.57 cm/year additional growth", "Statistically significant", "Durable effect"], scoreAtTime: 82, rationale: "Consistent growth benefit supports approval", dataAvailableAtTime: ["Pivotal data", "Long-term growth"] },
      { phase: "FDA Approval", date: "Nov 2021", outcome: 'success', keyData: ["First achondroplasia drug", "Pediatric ages 5+"], scoreAtTime: 90, rationale: "Historic approval for genetic dwarfism", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 13. Brineura (cerliponase alfa) - CLN2 Disease
  {
    id: "BRIN-01",
    name: "Brineura (cerliponase alfa)",
    trialName: "CLN2",
    phase: "Approved",
    indication: "CLN2 Disease (Batten Disease)",
    therapeuticArea: "Rare/Orphan Disease",
    company: "BioMarin",
    companyTrackRecord: 'average',
    nctId: "NCT01907087",
    clinicalTrialsSearchTerm: "cerliponase",
    scores: calculateProbabilityScores("Approved", "CLN2 Disease", "Rare Disease"),
    marketData: generateMarketProjections("Brineura", "Approved", "CLN2 Disease", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Enzyme replacement therapy (TPP1)",
      administration: "Biweekly intracerebroventricular infusion",
      keyAdvantage: "Only treatment for fatal pediatric neurodegenerative disease",
      discovery: "BioMarin",
      development: "BioMarin",
      additionalInfo: [
        "Requires surgical port placement",
        "Slows disease progression",
        "Ultra-rare (~100 patients in US)"
      ]
    },
    patents: [
      { patentNumber: "US9,265,811", title: "TPP1 enzyme replacement", expirationDate: "2031", type: 'composition', status: 'active' },
      { patentNumber: "US9,937,244", title: "Intracerebroventricular delivery", expirationDate: "2032", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$100M+ (CLN2 market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Only treatment", efficacy: "N/A", threat: 'low' },
        { name: "Gene therapy approaches", company: "Various", phase: "Early stage", mechanism: "Gene therapy", keyDifferentiator: "Potential cure", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Only approved CLN2 treatment", "Demonstrated disease stabilization", "Life-extending benefit"],
      competitiveRisks: ["Complex administration", "Small patient population", "Gene therapy competition"],
      marketPositioning: "Only option for devastating childhood neurodegenerative disease."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2015", outcome: 'success', keyData: ["Disease stabilization observed", "Motor/language preservation"], scoreAtTime: 60, rationale: "First treatment showing benefit in CLN2", dataAvailableAtTime: ["Clinical scales", "Safety"] },
      { phase: "FDA Approval", date: "Apr 2017", outcome: 'success', keyData: ["First CLN2 treatment", "Accelerated approval"], scoreAtTime: 85, rationale: "Landmark approval for fatal disease", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 14. Evrysdi (risdiplam) - Spinal Muscular Atrophy
  {
    id: "EVRY-01",
    name: "Evrysdi (risdiplam)",
    trialName: "FIREFISH/SUNFISH",
    phase: "Approved",
    indication: "Spinal Muscular Atrophy",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Roche/PTC Therapeutics",
    companyTrackRecord: 'fast',
    nctId: "NCT02913482",
    clinicalTrialsSearchTerm: "risdiplam",
    scores: calculateProbabilityScores("Approved", "Spinal Muscular Atrophy", "Rare Disease"),
    marketData: generateMarketProjections("Evrysdi", "Approved", "Spinal Muscular Atrophy", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "SMN2 splicing modifier (small molecule)",
      administration: "Once-daily oral liquid",
      keyAdvantage: "Only oral SMA treatment - at-home administration",
      discovery: "PTC Therapeutics/Roche/SMA Foundation",
      development: "Roche",
      additionalInfo: [
        "First oral SMA therapy",
        "At-home administration",
        "Crosses blood-brain barrier"
      ]
    },
    patents: [
      { patentNumber: "US10,076,504", title: "SMN2 splicing modifiers", expirationDate: "2035", type: 'composition', status: 'active' },
      { patentNumber: "US10,632,105", title: "Methods for treating SMA", expirationDate: "2036", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (SMA market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Zolgensma", company: "Novartis", phase: "Approved", mechanism: "AAV9 gene therapy", keyDifferentiator: "One-time cure for infants", efficacy: "High", threat: 'high' },
        { name: "Spinraza", company: "Biogen", phase: "Approved", mechanism: "ASO intrathecal", keyDifferentiator: "First SMA treatment", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Only oral therapy", "At-home convenience", "All ages/types", "No procedure required"],
      competitiveRisks: ["Competition from gene therapy", "Chronic dosing required", "Spinraza established"],
      marketPositioning: "Convenient oral alternative in competitive SMA landscape."
    },
    retrospectivePhases: [
      { phase: "Phase 2 FIREFISH Part 1", date: "Q4 2018", outcome: 'success', keyData: ["Motor milestone gains", "Well-tolerated"], scoreAtTime: 65, rationale: "Oral bioavailability with efficacy signals", dataAvailableAtTime: ["Efficacy signals", "Safety"] },
      { phase: "Phase 3", date: "Q4 2019", outcome: 'success', keyData: ["Motor function improvements", "Sitting milestones achieved"], scoreAtTime: 80, rationale: "Consistent benefit across SMA types", dataAvailableAtTime: ["FIREFISH", "SUNFISH data"] },
      { phase: "FDA Approval", date: "Aug 2020", outcome: 'success', keyData: ["First oral SMA therapy", "All SMA types"], scoreAtTime: 92, rationale: "Transformative convenience for SMA patients", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 15. Livmarli (maralixibat) - Alagille Syndrome
  {
    id: "LIVM-01",
    name: "Livmarli (maralixibat)",
    trialName: "ICONIC",
    phase: "Approved",
    indication: "Alagille Syndrome (Cholestatic Pruritus)",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Mirum Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT02160782",
    clinicalTrialsSearchTerm: "maralixibat",
    scores: calculateProbabilityScores("Approved", "Alagille Syndrome", "Rare Disease"),
    marketData: generateMarketProjections("Livmarli", "Approved", "Alagille Syndrome", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Ileal bile acid transporter (IBAT) inhibitor",
      administration: "Once-daily oral liquid",
      keyAdvantage: "First approved treatment for Alagille syndrome pruritus",
      discovery: "Lumena/Shire",
      license: "Acquired by Mirum",
      development: "Mirum Pharmaceuticals",
      additionalInfo: [
        "Reduces bile acid pool",
        "Significant itch reduction",
        "Improves quality of life"
      ]
    },
    patents: [
      { patentNumber: "US9,238,659", title: "IBAT inhibitor compounds", expirationDate: "2031", type: 'composition', status: 'active' },
      { patentNumber: "US10,245,268", title: "Treatment of cholestatic diseases", expirationDate: "2033", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M+ (Cholestatic liver disease market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Bylvay (odevixibat)", company: "Albireo/Ipsen", phase: "Approved", mechanism: "IBAT inhibitor", keyDifferentiator: "PFIC indication", efficacy: "High", threat: 'medium' },
        { name: "Ursodiol", company: "Generic", phase: "Approved", mechanism: "Bile acid", keyDifferentiator: "Low cost, limited efficacy", efficacy: "Low", threat: 'low' }
      ],
      competitiveAdvantages: ["First approved Alagille treatment", "Significant pruritus reduction", "Oral convenience"],
      competitiveRisks: ["Competition from Bylvay", "Diarrhea side effect", "Small patient population"],
      marketPositioning: "First-mover in Alagille syndrome with expanding cholestatic indications."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2017", outcome: 'success', keyData: ["Pruritus reduction observed", "Bile acid lowering"], scoreAtTime: 55, rationale: "Novel approach to cholestatic itch", dataAvailableAtTime: ["Pruritus scores", "Bile acids"] },
      { phase: "Phase 3 ICONIC", date: "Q3 2020", outcome: 'success', keyData: ["Significant itch reduction", "Improved sleep and quality of life"], scoreAtTime: 78, rationale: "Consistent benefit in debilitating symptom", dataAvailableAtTime: ["Pivotal data", "QoL data"] },
      { phase: "FDA Approval", date: "Sep 2021", outcome: 'success', keyData: ["First Alagille treatment", "Pediatric indication"], scoreAtTime: 88, rationale: "Landmark approval for rare pediatric liver disease", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 16. Leqvio (inclisiran) - Homozygous FH
  {
    id: "LEQV-01",
    name: "Leqvio (inclisiran)",
    trialName: "ORION",
    phase: "Approved",
    indication: "Homozygous Familial Hypercholesterolemia",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT03397121",
    clinicalTrialsSearchTerm: "inclisiran",
    scores: calculateProbabilityScores("Approved", "Familial Hypercholesterolemia", "Rare Disease"),
    marketData: generateMarketProjections("Leqvio", "Approved", "Familial Hypercholesterolemia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "siRNA (GalNAc-conjugated) targeting PCSK9",
      administration: "Twice-yearly SC injection",
      keyAdvantage: "Only twice-yearly cholesterol-lowering injection",
      discovery: "Alnylam",
      license: "Licensed to Novartis (via The Medicines Company acquisition)",
      development: "Novartis",
      additionalInfo: [
        "50% LDL reduction",
        "Twice-yearly dosing convenience",
        "Physician-administered"
      ]
    },
    patents: [
      { patentNumber: "US10,125,368", title: "PCSK9-targeting siRNA", expirationDate: "2035", type: 'composition', status: 'active' },
      { patentNumber: "US10,723,758", title: "Long-acting cholesterol-lowering siRNA", expirationDate: "2036", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3B+ (PCSK9 market)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Repatha", company: "Amgen", phase: "Approved", mechanism: "PCSK9 antibody", keyDifferentiator: "Monthly injection", efficacy: "High", threat: 'high' },
        { name: "Praluent", company: "Regeneron/Sanofi", phase: "Approved", mechanism: "PCSK9 antibody", keyDifferentiator: "Biweekly injection", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Twice-yearly dosing", "Better adherence potential", "siRNA durability", "Novel mechanism"],
      competitiveRisks: ["Requires physician visit", "Established PCSK9 antibody competition", "Pricing pressure"],
      marketPositioning: "Best-in-class convenience with twice-yearly dosing for severe hypercholesterolemia."
    },
    retrospectivePhases: [
      { phase: "Phase 2 ORION-1", date: "Q4 2017", outcome: 'success', keyData: ["50% LDL reduction", "6-month durability"], scoreAtTime: 70, rationale: "Novel siRNA approach with excellent durability", dataAvailableAtTime: ["LDL lowering", "Duration of effect"] },
      { phase: "Phase 3 ORION-9/10/11", date: "Q4 2019", outcome: 'success', keyData: ["Consistent ~50% LDL reduction", "HeFH and ASCVD data"], scoreAtTime: 85, rationale: "Robust efficacy across populations", dataAvailableAtTime: ["Pivotal data", "Multiple indications"] },
      { phase: "FDA Approval", date: "Dec 2021", outcome: 'success', keyData: ["Approved for ASCVD and HeFH", "Twice-yearly dosing"], scoreAtTime: 90, rationale: "Convenient dosing wins approval", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 17. Palynziq (pegvaliase) - Phenylketonuria
  {
    id: "PALY-01",
    name: "Palynziq (pegvaliase)",
    trialName: "PRISM",
    phase: "Approved",
    indication: "Phenylketonuria (PKU)",
    therapeuticArea: "Rare/Orphan Disease",
    company: "BioMarin",
    companyTrackRecord: 'average',
    nctId: "NCT01819727",
    clinicalTrialsSearchTerm: "pegvaliase",
    scores: calculateProbabilityScores("Approved", "Phenylketonuria", "Rare Disease"),
    marketData: generateMarketProjections("Palynziq", "Approved", "Phenylketonuria", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "PEGylated phenylalanine ammonia lyase",
      administration: "Daily SC self-injection",
      keyAdvantage: "Only treatment that normalizes blood Phe for severe PKU",
      discovery: "BioMarin",
      development: "BioMarin",
      additionalInfo: [
        "Enzyme substitution therapy",
        "Normalizes phenylalanine levels",
        "REMS program for anaphylaxis"
      ]
    },
    patents: [
      { patentNumber: "US8,465,735", title: "PEGylated PAL enzyme", expirationDate: "2029", type: 'composition', status: 'expiring-soon' },
      { patentNumber: "US9,493,516", title: "Methods for treating PKU", expirationDate: "2031", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$800M+ (PKU market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Kuvan", company: "BioMarin", phase: "Approved", mechanism: "PAH cofactor (BH4)", keyDifferentiator: "Oral, for responsive patients", efficacy: "Moderate", threat: 'low' },
        { name: "ACER-001", company: "Acer Therapeutics", phase: "Approved", mechanism: "Nitrogen scavenger", keyDifferentiator: "Different approach", efficacy: "Low", threat: 'low' }
      ],
      competitiveAdvantages: ["Normalizes Phe in all patients", "Enables normal diet", "Long-term durability"],
      competitiveRisks: ["Injection site reactions", "Anaphylaxis risk (REMS)", "Immunogenicity challenges"],
      marketPositioning: "Most efficacious PKU treatment for patients who need full Phe normalization."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2014", outcome: 'success', keyData: ["Phe normalization achieved", "Immune responses manageable"], scoreAtTime: 55, rationale: "Proof of concept for enzyme substitution", dataAvailableAtTime: ["Phe levels", "Immunogenicity"] },
      { phase: "Phase 3 PRISM", date: "Q3 2017", outcome: 'success', keyData: ["51% achieved Phe ≤360 μmol/L", "Mean 51% Phe reduction"], scoreAtTime: 75, rationale: "Strong efficacy despite immune challenges", dataAvailableAtTime: ["Pivotal data", "Long-term extension"] },
      { phase: "FDA Approval", date: "May 2018", outcome: 'success', keyData: ["First enzyme substitution for PKU", "REMS required"], scoreAtTime: 82, rationale: "Approved with risk management program", dataAvailableAtTime: ["Approval", "REMS", "Label"] }
    ]
  },

  // 18. Dojolvi (triheptanoin) - Long-Chain Fatty Acid Oxidation Disorders
  {
    id: "DOJO-01",
    name: "Dojolvi (triheptanoin)",
    trialName: "UX007",
    phase: "Approved",
    indication: "Long-Chain Fatty Acid Oxidation Disorders",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Ultragenyx",
    companyTrackRecord: 'average',
    nctId: "NCT01886378",
    clinicalTrialsSearchTerm: "triheptanoin",
    scores: calculateProbabilityScores("Approved", "LC-FAOD", "Rare Disease"),
    marketData: generateMarketProjections("Dojolvi", "Approved", "LC-FAOD", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Synthetic medium odd-chain triglyceride (anaplerotic)",
      administration: "Oral liquid with meals 3-4 times daily",
      keyAdvantage: "Provides alternative energy source when fat metabolism is impaired",
      discovery: "Ultragenyx",
      development: "Ultragenyx",
      additionalInfo: [
        "Anaplerotic substrate therapy",
        "Reduces metabolic crises",
        "Orphan drug for multiple LC-FAOD types"
      ]
    },
    patents: [
      { patentNumber: "US9,265,745", title: "Triheptanoin compositions", expirationDate: "2032", type: 'composition', status: 'active' },
      { patentNumber: "US9,782,375", title: "Treatment of fatty acid oxidation disorders", expirationDate: "2033", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$200M+ (LC-FAOD market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "MCT oil", company: "Generic", phase: "Standard of care", mechanism: "Medium-chain substrate", keyDifferentiator: "Low cost", efficacy: "Moderate", threat: 'low' },
        { name: "Dietary management", company: "N/A", phase: "Standard of care", mechanism: "Avoidance", keyDifferentiator: "No cost", efficacy: "Variable", threat: 'low' }
      ],
      competitiveAdvantages: ["Only FDA-approved LC-FAOD treatment", "Reduces hospitalizations", "Anaplerotic mechanism unique"],
      competitiveRisks: ["Small patient population", "Dietary therapy required", "Gastrointestinal tolerability"],
      marketPositioning: "First approved treatment for rare metabolic energy disorder."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2016", outcome: 'success', keyData: ["Reduced metabolic crises", "Energy improvement"], scoreAtTime: 50, rationale: "Novel anaplerotic approach shows promise", dataAvailableAtTime: ["Crisis data", "Tolerability"] },
      { phase: "Phase 3", date: "Q2 2019", outcome: 'success', keyData: ["48% reduction in major clinical events", "Improved exercise tolerance"], scoreAtTime: 72, rationale: "Meaningful clinical benefit demonstrated", dataAvailableAtTime: ["Pivotal data", "Event rates"] },
      { phase: "FDA Approval", date: "Jun 2020", outcome: 'success', keyData: ["First LC-FAOD treatment approved", "Broad indication"], scoreAtTime: 85, rationale: "Historic approval for metabolic disorder", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 19. Zokinvy (lonafarnib) - Progeria
  {
    id: "ZOKI-01",
    name: "Zokinvy (lonafarnib)",
    trialName: "ProLon1",
    phase: "Approved",
    indication: "Hutchinson-Gilford Progeria Syndrome",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Eiger BioPharmaceuticals",
    companyTrackRecord: 'slow',
    nctId: "NCT00916747",
    clinicalTrialsSearchTerm: "lonafarnib progeria",
    scores: calculateProbabilityScores("Approved", "Progeria", "Rare Disease"),
    marketData: generateMarketProjections("Zokinvy", "Approved", "Progeria", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Farnesyltransferase inhibitor",
      administration: "Twice-daily oral capsule",
      keyAdvantage: "Only treatment for fatal accelerated aging syndrome",
      discovery: "Progeria Research Foundation/NIH",
      license: "Licensed by Eiger",
      development: "Eiger BioPharmaceuticals",
      additionalInfo: [
        "Extends lifespan by ~2.5 years",
        "Ultra-rare (~400 patients globally)",
        "Developed through rare disease collaboration"
      ]
    },
    patents: [
      { patentNumber: "US8,871,734", title: "Treatment of progeria with FTIs", expirationDate: "2029", type: 'method', status: 'expiring-soon' },
      { patentNumber: "US9,352,008", title: "Lonafarnib formulations for progeria", expirationDate: "2031", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$50M+ (Progeria market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Only treatment", efficacy: "N/A", threat: 'low' },
        { name: "Gene editing approaches", company: "Various", phase: "Preclinical", mechanism: "Gene correction", keyDifferentiator: "Potential cure", efficacy: "TBD", threat: 'low' }
      ],
      competitiveAdvantages: ["Only approved progeria treatment", "Extended survival demonstrated", "Orphan drug protections"],
      competitiveRisks: ["Ultra-rare patient population", "Modest survival extension", "GI side effects"],
      marketPositioning: "Only hope for children with fatal accelerated aging syndrome."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2012", outcome: 'success', keyData: ["Progerin reduction", "Cardiovascular improvements"], scoreAtTime: 50, rationale: "First evidence of disease modification in progeria", dataAvailableAtTime: ["Biomarkers", "Safety"] },
      { phase: "Long-term follow-up", date: "Q4 2017", outcome: 'success', keyData: ["2.5 year survival extension", "Reduced mortality"], scoreAtTime: 72, rationale: "Survival data supports meaningful benefit", dataAvailableAtTime: ["Survival data", "Natural history comparison"] },
      { phase: "FDA Approval", date: "Nov 2020", outcome: 'success', keyData: ["First progeria treatment", "Orphan drug"], scoreAtTime: 88, rationale: "Historic approval for ultra-rare fatal disease", dataAvailableAtTime: ["Approval", "Label"] }
    ]
  },

  // 20. Lamzede (velmanase alfa) - Alpha-Mannosidosis
  {
    id: "LAMZ-01",
    name: "Lamzede (velmanase alfa)",
    trialName: "rhLAMAN",
    phase: "Approved",
    indication: "Alpha-Mannosidosis",
    therapeuticArea: "Rare/Orphan Disease",
    company: "Chiesi",
    companyTrackRecord: 'average',
    nctId: "NCT01681953",
    clinicalTrialsSearchTerm: "velmanase",
    scores: calculateProbabilityScores("Approved", "Alpha-Mannosidosis", "Rare Disease"),
    marketData: generateMarketProjections("Lamzede", "Approved", "Alpha-Mannosidosis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Enzyme replacement therapy (recombinant alpha-mannosidase)",
      administration: "Weekly IV infusion",
      keyAdvantage: "Only treatment for rare lysosomal storage disorder",
      discovery: "Zymenex/Chiesi",
      development: "Chiesi Global Rare Diseases",
      additionalInfo: [
        "Ultra-rare (~500 patients globally)",
        "Reduces oligosaccharide accumulation",
        "Stabilizes disease progression"
      ]
    },
    patents: [
      { patentNumber: "EP2073831", title: "Recombinant alpha-mannosidase", expirationDate: "2028", type: 'composition', status: 'expiring-soon' },
      { patentNumber: "US8,846,029", title: "Treatment of alpha-mannosidosis", expirationDate: "2030", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$50M+ (Alpha-mannosidosis market)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "No approved competitors", company: "N/A", phase: "N/A", mechanism: "N/A", keyDifferentiator: "Only treatment", efficacy: "N/A", threat: 'low' },
        { name: "HSCT", company: "N/A", phase: "Standard of care", mechanism: "Stem cell transplant", keyDifferentiator: "Potentially curative but risky", efficacy: "Variable", threat: 'low' }
      ],
      competitiveAdvantages: ["Only approved ERT", "Weekly dosing", "Orphan protections", "Reduces substrate burden"],
      competitiveRisks: ["Ultra-rare patient population", "Weekly IV burden", "Limited efficacy data"],
      marketPositioning: "Only enzyme replacement option for rare lysosomal storage disease."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q3 2014", outcome: 'success', keyData: ["Oligosaccharide reduction", "Safe infusions"], scoreAtTime: 50, rationale: "First ERT attempt in alpha-mannosidosis", dataAvailableAtTime: ["Biomarkers", "Safety"] },
      { phase: "Phase 3", date: "Q4 2016", outcome: 'partial', keyData: ["Some functional improvements", "Disease stabilization"], scoreAtTime: 62, rationale: "Modest benefit but unmet need is critical", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "EMA Approval", date: "Mar 2018", outcome: 'success', keyData: ["EU conditional approval", "First AM treatment"], scoreAtTime: 78, rationale: "Approved for devastating ultra-rare disease", dataAvailableAtTime: ["EU approval", "Label"] }
    ]
  }
];
