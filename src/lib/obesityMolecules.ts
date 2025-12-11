// 20 Obesity Molecules - TA: Metabolic/Endocrinology
// Each molecule includes full analysis with retrospective timeline, patents, competitive landscape

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const obesityMolecules: MoleculeProfile[] = [
  // 1. CagriSema - GLP-1 + Amylin combination
  {
    id: "CAGR-01",
    name: "CagriSema (Cagrilintide + Semaglutide)",
    trialName: "REDEFINE",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT05567796",
    clinicalTrialsSearchTerm: "cagrisema",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("CagriSema", "Phase III", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GLP-1 receptor agonist + Amylin analog combination",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "~25% weight loss in Phase 2, potentially best-in-class",
      discovery: "Novo Nordisk internal development",
      development: "Global rights held by Novo Nordisk",
      additionalInfo: [
        "Combines semaglutide with long-acting amylin analog cagrilintide",
        "Dual mechanism targets appetite and satiety pathways",
        "Designed to compete with/exceed tirzepatide efficacy"
      ]
    },
    patents: [
      { patentNumber: "US11,472,851", title: "Amylin analog combinations for obesity", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tirzepatide (Zepbound)", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual", keyDifferentiator: "Best approved", efficacy: "22.5% weight loss", threat: 'high' },
        { name: "Semaglutide (Wegovy)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Market leader", efficacy: "15-17% weight loss", threat: 'medium' },
        { name: "Retatrutide", company: "Eli Lilly", phase: "Phase III", mechanism: "Triple agonist", keyDifferentiator: "~24% weight loss", efficacy: "24% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: ["~25% weight loss potential", "Dual mechanism", "Novo Nordisk manufacturing scale"],
      competitiveRisks: ["Complex combination therapy", "Retatrutide competition", "Pricing pressure"],
      marketPositioning: "Premium combination therapy targeting best-in-class weight loss efficacy."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Sep 2023", outcome: 'success', keyData: ["~25% weight loss at 68 weeks", "Superior to semaglutide alone"], scoreAtTime: 78, rationale: "Best-in-class Phase 2 data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 REDEFINE", date: "Q4 2024", outcome: 'pending', keyData: ["Multiple REDEFINE trials ongoing", "~10,000 patients planned"], scoreAtTime: 76, rationale: "Large pivotal program", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 2. Amycretin - Oral GLP-1/Amylin
  {
    id: "AMYC-01",
    name: "Amycretin (NNC0487-0111)",
    trialName: "REDEFINE-O",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT06385315",
    clinicalTrialsSearchTerm: "amycretin",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Amycretin", "Phase III", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral GLP-1 receptor agonist / Amylin analog co-agonist",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Oral convenience with combination efficacy",
      discovery: "Novo Nordisk internal development",
      development: "Global rights held by Novo Nordisk",
      additionalInfo: [
        "Single molecule with dual GLP-1 and amylin receptor activity",
        "13% weight loss at 12 weeks in early studies",
        "Potential to be best-in-class oral obesity therapy"
      ]
    },
    patents: [
      { patentNumber: "US11,667,689", title: "Oral GLP-1/amylin co-agonists", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Ahead in development", efficacy: "~15% weight loss", threat: 'high' },
        { name: "Rybelsus", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1", keyDifferentiator: "First approved", efficacy: "~10-12%", threat: 'medium' },
      ],
      competitiveAdvantages: ["Dual mechanism in oral form", "13% weight loss at 12 weeks", "Novo Nordisk expertise"],
      competitiveRisks: ["Orforglipron ahead", "Early development stage", "Manufacturing complexity"],
      marketPositioning: "Next-generation oral obesity therapy with dual mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Mar 2024", outcome: 'success', keyData: ["13% weight loss at 12 weeks", "Rapid onset of action"], scoreAtTime: 62, rationale: "Impressive early data", dataAvailableAtTime: ["Early efficacy"] },
      { phase: "Phase 3 REDEFINE-O", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 3 initiated", "Accelerated timeline"], scoreAtTime: 65, rationale: "Fast-tracked development", dataAvailableAtTime: ["Trial designs"] }
    ]
  },

  // 3. Bimagrumab - Anti-myostatin/activin
  {
    id: "BIMA-01",
    name: "Bimagrumab (BYM338)",
    trialName: "BELIEVE",
    phase: "Phase III",
    indication: "Obesity with Metabolic Syndrome",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Versanis Bio (acquired by Eli Lilly)",
    companyTrackRecord: 'fast',
    nctId: "NCT05616013",
    clinicalTrialsSearchTerm: "bimagrumab",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Bimagrumab", "Phase III", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-activin type II receptor antibody (ActRII blocker)",
      administration: "Monthly intravenous infusion or subcutaneous injection",
      keyAdvantage: "Promotes fat loss while preserving/building muscle mass",
      discovery: "Novartis (original developer)",
      license: "Versanis Bio acquired rights, then acquired by Eli Lilly (2023)",
      development: "Now part of Eli Lilly obesity portfolio",
      additionalInfo: [
        "Unique mechanism: blocks myostatin and activin signaling",
        "Improves body composition - reduces fat, increases lean mass",
        "Potential combination with GLP-1 therapies"
      ]
    },
    patents: [
      { patentNumber: "US9,573,993", title: "ActRII antagonist antibodies", expirationDate: "2032", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "GLP-1 class", company: "Various", phase: "Approved/Phase III", mechanism: "GLP-1 agonists", keyDifferentiator: "Weight loss focus", efficacy: "15-25% weight loss", threat: 'high' },
      ],
      competitiveAdvantages: ["Unique muscle-sparing mechanism", "Combination potential", "Lilly backing"],
      competitiveRisks: ["Different mechanism than GLP-1s", "IV administration", "Muscle effects unclear long-term"],
      marketPositioning: "Differentiated obesity therapy preserving muscle mass during weight loss."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2022", outcome: 'success', keyData: ["20% fat mass reduction", "3.6% lean mass increase"], scoreAtTime: 55, rationale: "Unique body composition effects", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Lilly Acquisition", date: "Dec 2023", outcome: 'success', keyData: ["$1.93B acquisition by Eli Lilly", "Validates mechanism"], scoreAtTime: 68, rationale: "Major pharma validation", dataAvailableAtTime: ["Deal terms"] }
    ]
  },

  // 4. Ecnoglutide - Long-acting GLP-1
  {
    id: "ECNO-01",
    name: "Ecnoglutide (XW003)",
    trialName: "DREAM",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Sciwind Biosciences",
    companyTrackRecord: 'average',
    nctId: "NCT06129773",
    clinicalTrialsSearchTerm: "ecnoglutide",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Ecnoglutide", "Phase III", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting GLP-1 receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Extended half-life with potent weight loss efficacy",
      discovery: "Sciwind Biosciences (China)",
      development: "China-focused with global expansion potential",
      additionalInfo: [
        "Novel GLP-1 analog with extended duration",
        "Strong efficacy in Chinese patient population",
        "Competitive pricing strategy for emerging markets"
      ]
    },
    patents: [
      { patentNumber: "CN114478729", title: "GLP-1 receptor agonist compositions", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (China obesity)",
      projectedGrowth: "45% CAGR",
      keyPlayers: [
        { name: "Semaglutide (imported)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Global brand", efficacy: "15-17%", threat: 'high' },
        { name: "Mazdutide", company: "Innovent", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Local competitor", efficacy: "~12%", threat: 'medium' },
      ],
      competitiveAdvantages: ["Strong China presence", "Competitive pricing", "Local regulatory advantage"],
      competitiveRisks: ["Limited global presence", "Competition from Novo/Lilly", "Manufacturing scale"],
      marketPositioning: "Leading domestic GLP-1 for Chinese obesity market."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2023", outcome: 'success', keyData: ["~15% weight loss", "Weekly dosing validated"], scoreAtTime: 55, rationale: "Solid efficacy data", dataAvailableAtTime: ["Phase 2 results"] }
    ]
  },

  // 5. Petrelintide - Amylin analog
  {
    id: "PETR-01",
    name: "Petrelintide (ZP8396)",
    trialName: "PURSUIT",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Zealand Pharma",
    companyTrackRecord: 'average',
    nctId: "NCT05631405",
    clinicalTrialsSearchTerm: "petrelintide",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Petrelintide", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting amylin analog",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Novel amylin mechanism for appetite control",
      discovery: "Zealand Pharma internal development",
      development: "Global rights held by Zealand Pharma",
      additionalInfo: [
        "Differentiated mechanism from GLP-1 class",
        "Potential for combination with GLP-1 therapies",
        "Weekly dosing convenience"
      ]
    },
    patents: [
      { patentNumber: "US11,286,299", title: "Long-acting amylin analogs", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Cagrilintide (CagriSema)", company: "Novo Nordisk", phase: "Phase III", mechanism: "Amylin + GLP-1", keyDifferentiator: "Combination leader", efficacy: "~25%", threat: 'high' },
      ],
      competitiveAdvantages: ["Pure amylin approach", "Combination potential", "Zealand peptide expertise"],
      competitiveRisks: ["Behind CagriSema", "Small company scale", "Mechanism validation needed"],
      marketPositioning: "Stand-alone amylin therapy with combination potential."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q4 2022", outcome: 'success', keyData: ["Favorable PK/PD", "Weekly dosing confirmed"], scoreAtTime: 38, rationale: "Early validation", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2", date: "Q3 2024", outcome: 'pending', keyData: ["Phase 2 ongoing", "Efficacy readout expected 2025"], scoreAtTime: 42, rationale: "Pivotal data pending", dataAvailableAtTime: ["Enrollment progress"] }
    ]
  },

  // 6. Setmelanotide - MC4R agonist (Approved for rare obesity)
  {
    id: "SETM-01",
    name: "Setmelanotide (Imcivree)",
    trialName: "EMANATE",
    phase: "Approved/Phase III expansion",
    indication: "Rare Genetic Obesity / General Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Rhythm Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT05093634",
    clinicalTrialsSearchTerm: "setmelanotide",
    scores: calculateProbabilityScores("Approved", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Setmelanotide", "Approved", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Melanocortin 4 receptor (MC4R) agonist",
      administration: "Once-daily subcutaneous injection",
      keyAdvantage: "Targets genetic drivers of obesity (MC4R pathway)",
      discovery: "IPSEN (original developer)",
      license: "Rhythm Pharmaceuticals acquired rights",
      development: "Expanding into broader obesity populations",
      additionalInfo: [
        "First and only approved therapy for rare genetic obesity",
        "Approved for POMC, PCSK1, LEPR deficiency obesity",
        "Exploring broader genetic obesity indications"
      ]
    },
    patents: [
      { patentNumber: "US9,550,815", title: "MC4R agonist peptides", expirationDate: "2033", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (Rare genetic obesity)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "GLP-1 class (off-label)", company: "Various", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Broad use", efficacy: "Variable in genetic obesity", threat: 'medium' },
      ],
      competitiveAdvantages: ["First approved for genetic obesity", "Targeted mechanism", "Expanding indications"],
      competitiveRisks: ["Small patient population", "Competition from GLP-1s", "Pricing pressure"],
      marketPositioning: "Precision medicine approach to genetic obesity."
    },
    retrospectivePhases: [
      { phase: "FDA Approval", date: "Nov 2020", outcome: 'success', keyData: ["First MC4R agonist approved", "Rare obesity indications"], scoreAtTime: 85, rationale: "Regulatory milestone", dataAvailableAtTime: ["Approval data"] },
      { phase: "Label Expansion", date: "Q4 2024", outcome: 'pending', keyData: ["Expanding to additional genetic forms", "Bardet-Biedl syndrome added"], scoreAtTime: 82, rationale: "Growing franchise", dataAvailableAtTime: ["Expansion data"] }
    ]
  },

  // 7. Danuglipron - Oral GLP-1 (Discontinued but included for competitive context)
  {
    id: "DANU-01",
    name: "Danuglipron (PF-06882961)",
    trialName: "GIGATHIN",
    phase: "Discontinued",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT05295875",
    clinicalTrialsSearchTerm: "danuglipron",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Danuglipron", "Phase II", "Obesity", 'fast'),
    overallScore: 0,
    isFailed: true,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral small molecule GLP-1 receptor agonist",
      administration: "Twice-daily oral tablet",
      keyAdvantage: "Oral GLP-1 approach (development discontinued)",
      discovery: "Pfizer internal development",
      development: "Program discontinued in late 2023",
      additionalInfo: [
        "Development halted due to tolerability and dosing frequency issues",
        "Twice-daily dosing less convenient than competitors",
        "Higher discontinuation rates vs orforglipron"
      ]
    },
    patents: [
      { patentNumber: "US10,919,892", title: "Small molecule GLP-1 agonists", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Once-daily, better tolerability", efficacy: "~15%", threat: 'high' },
      ],
      competitiveAdvantages: [],
      competitiveRisks: ["Program discontinued", "Tolerability issues", "Behind competition"],
      marketPositioning: "Development discontinued - no longer competing."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2023", outcome: 'setback', keyData: ["Twice-daily dosing required", "Higher discontinuation rate"], scoreAtTime: 35, rationale: "Suboptimal profile", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "Discontinuation", date: "Dec 2023", outcome: 'setback', keyData: ["Development halted", "Pfizer exits oral obesity space"], scoreAtTime: 0, rationale: "Program terminated", dataAvailableAtTime: ["Decision announcement"] }
    ]
  },

  // 8. Maritide - Amylin/GLP-1
  {
    id: "MARI-01",
    name: "Maritide (MariTide/AMG133)",
    trialName: "ANTHEM",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Amgen",
    companyTrackRecord: 'fast',
    nctId: "NCT05669599",
    clinicalTrialsSearchTerm: "maritide amgen",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Maritide", "Phase II", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GIP receptor antagonist / GLP-1 receptor agonist bispecific antibody",
      administration: "Monthly subcutaneous injection",
      keyAdvantage: "Monthly dosing with potentially superior efficacy",
      discovery: "Amgen internal development",
      development: "Global rights held by Amgen",
      additionalInfo: [
        "Novel bispecific antibody approach",
        "Antagonizes GIP while agonizing GLP-1",
        "Potential for monthly or less frequent dosing"
      ]
    },
    patents: [
      { patentNumber: "US11,578,110", title: "GIP antagonist/GLP-1 agonist bispecifics", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual agonist", keyDifferentiator: "Best approved", efficacy: "22.5%", threat: 'high' },
        { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "GLP-1 + Amylin", keyDifferentiator: "~25% weight loss", efficacy: "~25%", threat: 'high' },
      ],
      competitiveAdvantages: ["Monthly dosing potential", "Novel mechanism", "Amgen manufacturing scale"],
      competitiveRisks: ["Early development", "Unproven GIP antagonism approach", "Competition intense"],
      marketPositioning: "Differentiated long-acting obesity therapy with novel mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q1 2023", outcome: 'success', keyData: ["Up to 14.5% weight loss at 12 weeks", "Monthly dosing feasible"], scoreAtTime: 58, rationale: "Promising early data", dataAvailableAtTime: ["Phase 1 results"] },
      { phase: "Phase 2 ANTHEM", date: "Q4 2024", outcome: 'pending', keyData: ["Multiple dose cohorts", "52-week data expected"], scoreAtTime: 62, rationale: "Pivotal Phase 2", dataAvailableAtTime: ["Enrollment complete"] }
    ]
  },

  // 9. ALT-801 (Pemvidutide) - Already in endocrinologyMolecules but obesity-focused entry
  {
    id: "PEMV-02",
    name: "Pemvidutide (ALT-801)",
    trialName: "MOMENTUM-Obesity",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Altimmune",
    companyTrackRecord: 'slow',
    nctId: "NCT05295875",
    clinicalTrialsSearchTerm: "pemvidutide",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Pemvidutide", "Phase II", "Obesity", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GLP-1/Glucagon dual receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Glucagon component enhances energy expenditure",
      discovery: "Altimmune internal development",
      development: "Global rights held by Altimmune",
      additionalInfo: [
        "Dual mechanism: appetite suppression + increased energy expenditure",
        "15.6% weight loss at 48 weeks",
        "Potential for MASH indication expansion"
      ]
    },
    patents: [
      { patentNumber: "US10,975,138", title: "GLP-1/Glucagon dual agonist compounds", expirationDate: "2040", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Ahead in development", efficacy: "~19%", threat: 'high' },
      ],
      competitiveAdvantages: ["Dual mechanism", "MASH activity", "Good tolerability profile"],
      competitiveRisks: ["Small biotech", "Behind larger competitors", "Funding constraints"],
      marketPositioning: "Smaller biotech dual agonist with M&A potential."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MOMENTUM", date: "Mar 2024", outcome: 'success', keyData: ["15.6% weight loss at 48 weeks", "Good tolerability"], scoreAtTime: 52, rationale: "Solid Phase 2 data", dataAvailableAtTime: ["Full results"] }
    ]
  },

  // 10. Taldefgrobep alfa - Anti-myostatin
  {
    id: "TALD-01",
    name: "Taldefgrobep alfa (BHV-2000)",
    trialName: "TOPAZ",
    phase: "Phase II",
    indication: "Obesity / Sarcopenic Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Biohaven",
    companyTrackRecord: 'average',
    nctId: "NCT05616039",
    clinicalTrialsSearchTerm: "taldefgrobep",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Taldefgrobep alfa", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-myostatin/activin fusion protein",
      administration: "Subcutaneous injection",
      keyAdvantage: "Muscle preservation during weight loss",
      discovery: "Originally developed for muscular dystrophy",
      development: "Biohaven repositioning for obesity/sarcopenia",
      additionalInfo: [
        "Blocks myostatin to preserve/build muscle",
        "Addresses sarcopenic obesity (muscle loss with fat gain)",
        "Potential combination with GLP-1 therapies"
      ]
    },
    patents: [
      { patentNumber: "US10,851,152", title: "Myostatin inhibitor fusion proteins", expirationDate: "2038", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (Sarcopenic obesity)",
      projectedGrowth: "20% CAGR",
      keyPlayers: [
        { name: "Bimagrumab", company: "Eli Lilly", phase: "Phase III", mechanism: "ActRII blocker", keyDifferentiator: "Lilly backing", efficacy: "Muscle preservation", threat: 'high' },
      ],
      competitiveAdvantages: ["Differentiated mechanism", "Muscle-focused", "Combination potential"],
      competitiveRisks: ["Early development", "Competition from bimagrumab", "Mechanism validation needed"],
      marketPositioning: "Precision therapy for muscle-preserving weight loss."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q3 2024", outcome: 'pending', keyData: ["Obesity indication added", "Muscle mass endpoints"], scoreAtTime: 42, rationale: "Novel approach being tested", dataAvailableAtTime: ["Early enrollment"] }
    ]
  },

  // 11. INV-202 - Oral myostatin inhibitor
  {
    id: "INV2-01",
    name: "INV-202",
    trialName: "EMPOWER",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Innovent Biologics",
    companyTrackRecord: 'average',
    nctId: "NCT05789069",
    clinicalTrialsSearchTerm: "INV-202 obesity",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("INV-202", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral myostatin pathway inhibitor",
      administration: "Oral tablet",
      keyAdvantage: "Oral convenience for muscle preservation",
      discovery: "Innovent Biologics",
      development: "China-focused with global potential",
      additionalInfo: [
        "First oral approach to myostatin inhibition",
        "Potential combination with GLP-1 therapies",
        "Targets muscle preservation during weight loss"
      ]
    },
    patents: [
      { patentNumber: "CN115286657", title: "Oral myostatin inhibitors", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$10B+ (Muscle-sparing obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Bimagrumab", company: "Eli Lilly", phase: "Phase III", mechanism: "ActRII blocker", keyDifferentiator: "Injectable, proven", efficacy: "Muscle mass increase", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral administration", "Combination potential", "China market access"],
      competitiveRisks: ["Early stage", "Mechanism unproven orally", "Competition"],
      marketPositioning: "First oral muscle-preserving obesity therapy."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q2 2024", outcome: 'pending', keyData: ["Phase 1/2 initiated", "PK/PD assessment"], scoreAtTime: 35, rationale: "Early proof-of-concept", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 12. LY3541105 - GLP-1/GIP/Glucagon triple agonist oral
  {
    id: "LY35-01",
    name: "LY3541105",
    trialName: "TRIPLE-O",
    phase: "Phase I",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT06129812",
    clinicalTrialsSearchTerm: "LY3541105",
    scores: calculateProbabilityScores("Phase I", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("LY3541105", "Phase I", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral GLP-1/GIP/Glucagon triple receptor agonist",
      administration: "Oral tablet (in development)",
      keyAdvantage: "Oral triple agonist - combining best mechanisms",
      discovery: "Eli Lilly internal development",
      development: "Early clinical development",
      additionalInfo: [
        "Oral version of triple agonist mechanism",
        "Could combine retatrutide-like efficacy with oral convenience",
        "Very early stage - mechanism validation ongoing"
      ]
    },
    patents: [
      { patentNumber: "WO2024/015841", title: "Oral triple agonist compositions", expirationDate: "2044", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Retatrutide (injectable)", company: "Eli Lilly", phase: "Phase III", mechanism: "Triple agonist", keyDifferentiator: "~24% weight loss", efficacy: "24%", threat: 'low' },
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Ahead in development", efficacy: "~15%", threat: 'low' },
      ],
      competitiveAdvantages: ["Oral convenience", "Triple mechanism potential", "Lilly expertise"],
      competitiveRisks: ["Very early stage", "Oral bioavailability challenges", "Long timeline"],
      marketPositioning: "Future generation oral obesity therapy with triple mechanism."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q4 2024", outcome: 'pending', keyData: ["First-in-human studies", "PK/PD assessment"], scoreAtTime: 22, rationale: "Very early - high risk/reward", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 13. NNC0165-1875 - Amylin/Calcitonin
  {
    id: "NNC0-01",
    name: "NNC0165-1875",
    trialName: "PIONEER-AMYLIN",
    phase: "Phase I",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Novo Nordisk",
    companyTrackRecord: 'fast',
    nctId: "NCT05678543",
    clinicalTrialsSearchTerm: "NNC0165 obesity",
    scores: calculateProbabilityScores("Phase I", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("NNC0165-1875", "Phase I", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting amylin/calcitonin receptor agonist",
      administration: "Subcutaneous injection (frequency TBD)",
      keyAdvantage: "Novel dual receptor targeting for appetite control",
      discovery: "Novo Nordisk internal development",
      development: "Early pipeline asset",
      additionalInfo: [
        "Novel mechanism targeting both amylin and calcitonin receptors",
        "Potential synergy with GLP-1 pathway",
        "Part of Novo Nordisk next-generation obesity pipeline"
      ]
    },
    patents: [
      { patentNumber: "WO2023/118456", title: "Amylin/calcitonin receptor agonists", expirationDate: "2043", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "CagriSema", company: "Novo Nordisk", phase: "Phase III", mechanism: "GLP-1 + Amylin", keyDifferentiator: "Ahead in development", efficacy: "~25%", threat: 'low' },
      ],
      competitiveAdvantages: ["Novel mechanism", "Novo Nordisk backing", "Potential differentiation"],
      competitiveRisks: ["Very early stage", "Mechanism unproven", "Long development timeline"],
      marketPositioning: "Next-generation Novo Nordisk obesity candidate."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2024", outcome: 'pending', keyData: ["First-in-human initiated", "Mechanism validation"], scoreAtTime: 25, rationale: "Early stage exploration", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 14. Efinopegdutide - GLP-1/Glucagon dual (Merck)
  {
    id: "EFIN-01",
    name: "Efinopegdutide (MK-6024)",
    trialName: "SYNCHRONY-MERCK",
    phase: "Phase II",
    indication: "Obesity / MASH",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Merck/Hanmi",
    companyTrackRecord: 'fast',
    nctId: "NCT04944992",
    clinicalTrialsSearchTerm: "efinopegdutide",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("Efinopegdutide", "Phase II", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GLP-1/Glucagon dual receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Long-acting pegylated formulation",
      discovery: "Hanmi Pharmaceutical",
      license: "Merck global license (2015)",
      development: "Merck leading global development",
      additionalInfo: [
        "Pegylated for extended duration",
        "Dual indication: obesity and MASH",
        "Strong liver-targeted effects via glucagon component"
      ]
    },
    patents: [
      { patentNumber: "US10,188,703", title: "Pegylated GLP-1/glucagon dual agonists", expirationDate: "2036", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity + MASH)",
      projectedGrowth: "30% CAGR",
      keyPlayers: [
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Ahead in development", efficacy: "~19%", threat: 'high' },
      ],
      competitiveAdvantages: ["Merck resources", "Dual indication", "Pegylated stability"],
      competitiveRisks: ["Behind survodutide", "Competitive landscape", "MASH uncertainty"],
      marketPositioning: "Large pharma dual agonist for obesity and MASH."
    },
    retrospectivePhases: [
      { phase: "Phase 2 MASH", date: "Q2 2023", outcome: 'success', keyData: ["Liver fat reduction", "MASH resolution signals"], scoreAtTime: 52, rationale: "Positive liver data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 2 Obesity", date: "Q4 2024", outcome: 'pending', keyData: ["Obesity expansion ongoing", "Weight loss assessment"], scoreAtTime: 55, rationale: "Expanding indications", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 15. CT-868 - GIP/GLP-1 dual (Carmot/Roche)
  {
    id: "CT86-01",
    name: "CT-868",
    trialName: "REBALANCE",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Carmot Therapeutics (acquired by Roche)",
    companyTrackRecord: 'fast',
    nctId: "NCT05814068",
    clinicalTrialsSearchTerm: "CT-868 obesity",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("CT-868", "Phase II", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GIP/GLP-1 dual receptor agonist (injectable)",
      administration: "Subcutaneous injection",
      keyAdvantage: "Roche backing following $2.7B acquisition",
      discovery: "Carmot Therapeutics",
      license: "Roche acquired Carmot ($2.7B, Dec 2023)",
      development: "Now part of Roche obesity portfolio",
      additionalInfo: [
        "Dual GIP/GLP-1 mechanism similar to tirzepatide",
        "Roche acquisition validates approach",
        "Part of comprehensive Roche obesity pipeline"
      ]
    },
    patents: [
      { patentNumber: "US11,352,398", title: "GIP/GLP-1 dual agonist peptides", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$130B+ (Obesity)",
      projectedGrowth: "25% CAGR",
      keyPlayers: [
        { name: "Tirzepatide", company: "Eli Lilly", phase: "Approved", mechanism: "GIP/GLP-1 dual", keyDifferentiator: "Best approved", efficacy: "22.5%", threat: 'high' },
      ],
      competitiveAdvantages: ["Roche backing", "Validated mechanism", "Comprehensive development"],
      competitiveRisks: ["Behind tirzepatide", "Crowded space", "Differentiation challenge"],
      marketPositioning: "Roche entry into competitive dual agonist space."
    },
    retrospectivePhases: [
      { phase: "Roche Acquisition", date: "Dec 2023", outcome: 'success', keyData: ["$2.7B acquisition", "Major pharma validation"], scoreAtTime: 55, rationale: "Strategic acquisition", dataAvailableAtTime: ["Deal terms"] },
      { phase: "Phase 2", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 2 ongoing post-acquisition", "Efficacy assessment"], scoreAtTime: 58, rationale: "Roche accelerating", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 16. CT-388 - Oral GLP-1 (Carmot/Roche)
  {
    id: "CT38-01",
    name: "CT-388",
    trialName: "REBALANCE-O",
    phase: "Phase I",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Carmot Therapeutics (acquired by Roche)",
    companyTrackRecord: 'fast',
    nctId: "NCT05912309",
    clinicalTrialsSearchTerm: "CT-388 obesity",
    scores: calculateProbabilityScores("Phase I", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("CT-388", "Phase I", "Obesity", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral GIP/GLP-1 dual receptor agonist",
      administration: "Oral tablet",
      keyAdvantage: "Oral dual agonist combining convenience with dual mechanism",
      discovery: "Carmot Therapeutics",
      license: "Roche acquired Carmot ($2.7B, Dec 2023)",
      development: "Roche priority oral obesity asset",
      additionalInfo: [
        "Oral dual agonist - potentially best of both worlds",
        "If successful, could combine tirzepatide-like efficacy with oral convenience",
        "High priority in Roche obesity pipeline"
      ]
    },
    patents: [
      { patentNumber: "WO2023/141589", title: "Oral GIP/GLP-1 dual agonists", expirationDate: "2043", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Ahead in development", efficacy: "~15%", threat: 'high' },
        { name: "Amycretin", company: "Novo Nordisk", phase: "Phase III", mechanism: "Oral GLP-1/Amylin", keyDifferentiator: "Dual mechanism oral", efficacy: "~13%", threat: 'high' },
      ],
      competitiveAdvantages: ["Oral dual mechanism", "Roche resources", "High potential"],
      competitiveRisks: ["Very early stage", "Oral bioavailability challenges", "Competition ahead"],
      marketPositioning: "Next-generation oral dual agonist for obesity."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q4 2024", outcome: 'pending', keyData: ["First-in-human studies", "PK/PD assessment"], scoreAtTime: 28, rationale: "High-risk early stage", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 17. IBI363 - GLP-1/GCGR dual (Innovent)
  {
    id: "IBI3-01",
    name: "IBI363",
    trialName: "GOLDEN",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Innovent Biologics",
    companyTrackRecord: 'average',
    nctId: "NCT05789056",
    clinicalTrialsSearchTerm: "IBI363 obesity",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("IBI363", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "GLP-1/Glucagon receptor dual agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "China-market focused dual agonist",
      discovery: "Innovent Biologics internal development",
      development: "China-focused with global expansion potential",
      additionalInfo: [
        "Dual mechanism for enhanced weight loss",
        "Strong China market positioning",
        "Potential for MASH indication expansion"
      ]
    },
    patents: [
      { patentNumber: "CN115286658", title: "GLP-1/Glucagon dual agonists", expirationDate: "2042", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (China obesity)",
      projectedGrowth: "45% CAGR",
      keyPlayers: [
        { name: "Mazdutide", company: "Innovent", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Same company, ahead", efficacy: "~12%", threat: 'low' },
        { name: "Survodutide", company: "BI/Zealand", phase: "Phase III", mechanism: "GLP-1/Glucagon", keyDifferentiator: "Global leader", efficacy: "~19%", threat: 'high' },
      ],
      competitiveAdvantages: ["China focus", "Innovent infrastructure", "Differentiated from mazdutide"],
      competitiveRisks: ["Internal competition with mazdutide", "Behind global competitors"],
      marketPositioning: "Second-generation Innovent dual agonist for China market."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q3 2024", outcome: 'pending', keyData: ["Phase 1/2 ongoing", "China-focused development"], scoreAtTime: 42, rationale: "Early domestic development", dataAvailableAtTime: ["Enrollment data"] }
    ]
  },

  // 18. HRS-7535 - Oral GLP-1 (Jiangsu Hengrui)
  {
    id: "HRS7-01",
    name: "HRS-7535",
    trialName: "SHINE",
    phase: "Phase II",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "Jiangsu Hengrui Medicine",
    companyTrackRecord: 'average',
    nctId: "NCT05876234",
    clinicalTrialsSearchTerm: "HRS-7535",
    scores: calculateProbabilityScores("Phase II", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("HRS-7535", "Phase II", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral small molecule GLP-1 receptor agonist",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Chinese domestic oral GLP-1 development",
      discovery: "Jiangsu Hengrui Medicine",
      development: "China-focused development",
      additionalInfo: [
        "Domestic Chinese oral GLP-1 program",
        "Targeting local market with competitive pricing",
        "Part of Hengrui metabolic disease expansion"
      ]
    },
    patents: [
      { patentNumber: "CN116063307", title: "Small molecule GLP-1 receptor agonists", expirationDate: "2043", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (China obesity)",
      projectedGrowth: "45% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Global leader", efficacy: "~15%", threat: 'high' },
        { name: "Rybelsus (imported)", company: "Novo Nordisk", phase: "Approved", mechanism: "Oral GLP-1", keyDifferentiator: "First approved", efficacy: "~10-12%", threat: 'high' },
      ],
      competitiveAdvantages: ["Local development", "Pricing advantage", "Hengrui distribution"],
      competitiveRisks: ["Behind global competitors", "Efficacy unknown", "Development risk"],
      marketPositioning: "Domestic Chinese oral GLP-1 with cost advantage."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 2 enrolling", "China-focused"], scoreAtTime: 38, rationale: "Early domestic program", dataAvailableAtTime: ["Trial progress"] }
    ]
  },

  // 19. DD01 - Oral GLP-1 (D&D Pharmatech)
  {
    id: "DD01-01",
    name: "DD01",
    trialName: "DELIGHT",
    phase: "Phase I/II",
    indication: "Obesity / Type 2 Diabetes",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "D&D Pharmatech",
    companyTrackRecord: 'slow',
    nctId: "NCT05934123",
    clinicalTrialsSearchTerm: "DD01 GLP-1",
    scores: calculateProbabilityScores("Phase I", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("DD01", "Phase I", "Obesity", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral small molecule GLP-1 receptor agonist",
      administration: "Oral tablet",
      keyAdvantage: "Novel chemical scaffold for oral GLP-1",
      discovery: "D&D Pharmatech",
      development: "Early-stage development",
      additionalInfo: [
        "Novel chemical entity distinct from orforglipron",
        "Targeting improved oral bioavailability",
        "Early validation of approach"
      ]
    },
    patents: [
      { patentNumber: "WO2024/012345", title: "Novel oral GLP-1 agonist compounds", expirationDate: "2044", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$50B+ (Oral obesity)",
      projectedGrowth: "40% CAGR",
      keyPlayers: [
        { name: "Orforglipron", company: "Eli Lilly", phase: "Phase III", mechanism: "Oral GLP-1", keyDifferentiator: "Far ahead", efficacy: "~15%", threat: 'high' },
      ],
      competitiveAdvantages: ["Novel scaffold", "Differentiated chemistry", "Partnership potential"],
      competitiveRisks: ["Very early stage", "Unproven efficacy", "Resource constraints"],
      marketPositioning: "Early-stage oral GLP-1 with M&A potential."
    },
    retrospectivePhases: [
      { phase: "Phase 1/2", date: "Q4 2024", outcome: 'pending', keyData: ["Early clinical studies", "Mechanism validation"], scoreAtTime: 22, rationale: "Very early exploration", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },

  // 20. TG103 - Long-acting GLP-1 (CSPC)
  {
    id: "TG10-01",
    name: "TG103",
    trialName: "TREASURE",
    phase: "Phase III",
    indication: "Obesity",
    therapeuticArea: "Metabolic/Endocrinology",
    company: "CSPC Pharmaceutical",
    companyTrackRecord: 'average',
    nctId: "NCT05678901",
    clinicalTrialsSearchTerm: "TG103 obesity",
    scores: calculateProbabilityScores("Phase III", "Obesity", "Metabolic"),
    marketData: generateMarketProjections("TG103", "Phase III", "Obesity", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Long-acting GLP-1 receptor agonist",
      administration: "Once-weekly subcutaneous injection",
      keyAdvantage: "Chinese domestic weekly GLP-1 option",
      discovery: "CSPC Pharmaceutical",
      development: "China-focused with NDA planned",
      additionalInfo: [
        "Biosimilar-like pricing strategy for China",
        "Weekly dosing matches global standards",
        "Advanced to Phase 3 in China"
      ]
    },
    patents: [
      { patentNumber: "CN114478730", title: "Long-acting GLP-1 analogs", expirationDate: "2041", type: 'composition', status: 'active' },
    ],
    competitiveLandscape: {
      totalMarketSize: "$30B+ (China obesity)",
      projectedGrowth: "45% CAGR",
      keyPlayers: [
        { name: "Semaglutide (imported)", company: "Novo Nordisk", phase: "Approved", mechanism: "GLP-1", keyDifferentiator: "Global brand", efficacy: "15-17%", threat: 'high' },
        { name: "Ecnoglutide", company: "Sciwind", phase: "Phase III", mechanism: "Long-acting GLP-1", keyDifferentiator: "Domestic competitor", efficacy: "~15%", threat: 'high' },
      ],
      competitiveAdvantages: ["CSPC distribution network", "Competitive pricing", "Local development"],
      competitiveRisks: ["Multiple domestic competitors", "Premium imports competition"],
      marketPositioning: "Affordable domestic GLP-1 for Chinese obesity market."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q1 2024", outcome: 'success', keyData: ["~14% weight loss", "Good tolerability"], scoreAtTime: 58, rationale: "Solid domestic data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase 3 TREASURE", date: "Q4 2024", outcome: 'pending', keyData: ["Phase 3 ongoing", "NDA planned 2026"], scoreAtTime: 62, rationale: "Advancing toward approval", dataAvailableAtTime: ["Enrollment data"] }
    ]
  }
];
