// 20 Rheumatology Molecules
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const rheumatologyMolecules: MoleculeProfile[] = [
  {
    id: "rheum-1",
    name: "Upadacitinib",
    trialName: "SELECT-COMPARE/CHOICE",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "AbbVie",
    companyTrackRecord: 'fast',
    nctId: "NCT02629159",
    clinicalTrialsSearchTerm: "upadacitinib rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Upadacitinib", "Approved", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective JAK1 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Superior efficacy vs adalimumab, rapid onset",
      discovery: "AbbVie",
      development: "AbbVie"
    },
    patents: [
      { patentNumber: "US9382231", title: "JAK1 selective inhibitors", expirationDate: "2032", type: 'composition', status: 'active' },
      { patentNumber: "US10702543", title: "Extended release formulation", expirationDate: "2035", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "6%",
      keyPlayers: [
        { name: "Humira", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Market leader biosimilar erosion", efficacy: "Established", threat: 'medium' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Same company", efficacy: "Superior to adalimumab", threat: 'low' }
      ],
      competitiveAdvantages: ["Superior to adalimumab", "Oral convenience", "Multiple indications"],
      competitiveRisks: ["JAK class safety warnings", "Regulatory restrictions"],
      marketPositioning: "Best-in-class JAK inhibitor for RA and beyond"
    },
    retrospectivePhases: [
      { phase: "Phase III SELECT-COMPARE", date: "Q3 2018", outcome: 'success', keyData: ["ACR50 superiority vs adalimumab", "Rapid onset at Week 2"], scoreAtTime: 85, rationale: "Head-to-head superiority", dataAvailableAtTime: ["Primary endpoint met"] },
      { phase: "FDA Approval", date: "Q3 2019", outcome: 'success', keyData: ["RA approval", "Oral once-daily dosing"], scoreAtTime: 92, rationale: "Strong launch position", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-2",
    name: "Risankizumab",
    trialName: "KEEPsAKE 1/2",
    phase: "Approved",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "AbbVie/Boehringer Ingelheim",
    companyTrackRecord: 'fast',
    nctId: "NCT03675308",
    clinicalTrialsSearchTerm: "risankizumab psoriatic arthritis",
    scores: calculateProbabilityScores("Approved", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Risankizumab", "Approved", "Psoriatic Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-23p19 monoclonal antibody",
      administration: "Subcutaneous injection every 12 weeks",
      keyAdvantage: "Quarterly dosing, excellent skin clearance",
      discovery: "Boehringer Ingelheim",
      development: "AbbVie"
    },
    patents: [
      { patentNumber: "US9173953", title: "IL-23p19 antibodies", expirationDate: "2031", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$12.5B",
      projectedGrowth: "8%",
      keyPlayers: [
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Strong joint data", efficacy: "Established", threat: 'high' },
        { name: "Tremfya", company: "J&J", phase: "Approved", mechanism: "Anti-IL-23", keyDifferentiator: "Similar mechanism", efficacy: "Comparable", threat: 'high' }
      ],
      competitiveAdvantages: ["Quarterly dosing convenience", "Strong skin clearance"],
      competitiveRisks: ["Competitive IL-17/IL-23 market"],
      marketPositioning: "Leading IL-23 inhibitor for PsA and psoriasis"
    },
    retrospectivePhases: [
      { phase: "Phase III KEEPsAKE 1", date: "Q4 2020", outcome: 'success', keyData: ["ACR20 52.3% vs 26.5%", "Significant joint improvement"], scoreAtTime: 82, rationale: "Strong PsA efficacy", dataAvailableAtTime: ["Primary endpoint met"] },
      { phase: "FDA PsA Approval", date: "Q1 2022", outcome: 'success', keyData: ["PsA indication added", "Quarterly dosing maintained"], scoreAtTime: 90, rationale: "Label expansion", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-3",
    name: "Ixekizumab",
    trialName: "SPIRIT-H2H/P1/P2",
    phase: "Approved",
    indication: "Axial Spondyloarthritis",
    therapeuticArea: "Rheumatology",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT03129100",
    clinicalTrialsSearchTerm: "ixekizumab axial spondyloarthritis",
    scores: calculateProbabilityScores("Approved", "Axial Spondyloarthritis", "Rheumatology"),
    marketData: generateMarketProjections("Ixekizumab", "Approved", "Axial Spondyloarthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-17A monoclonal antibody",
      administration: "Subcutaneous injection every 4 weeks",
      keyAdvantage: "Rapid onset, strong ASAS40 responses",
      discovery: "Eli Lilly",
      development: "Eli Lilly"
    },
    patents: [
      { patentNumber: "US7838638", title: "IL-17A antibodies", expirationDate: "2028", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8.2B",
      projectedGrowth: "7%",
      keyPlayers: [
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "First IL-17 in axSpA", efficacy: "Similar", threat: 'high' },
        { name: "Humira", company: "AbbVie", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Established standard", efficacy: "Established", threat: 'medium' }
      ],
      competitiveAdvantages: ["Head-to-head data vs adalimumab", "Rapid onset"],
      competitiveRisks: ["Cosentyx competition", "Patent expiration"],
      marketPositioning: "Leading IL-17 option for axSpA"
    },
    retrospectivePhases: [
      { phase: "Phase III SPIRIT-H2H", date: "Q2 2019", outcome: 'success', keyData: ["Superiority vs adalimumab", "Joint + skin responses"], scoreAtTime: 85, rationale: "Head-to-head superiority", dataAvailableAtTime: ["Primary endpoint met"] },
      { phase: "axSpA Approval", date: "Q3 2020", outcome: 'success', keyData: ["nr-axSpA and AS indications", "Broad axSpA coverage"], scoreAtTime: 90, rationale: "Full axSpA label", dataAvailableAtTime: ["Label expansion"] }
    ]
  },
  {
    id: "rheum-4",
    name: "Secukinumab",
    trialName: "MEASURE/PREVENT",
    phase: "Approved",
    indication: "Ankylosing Spondylitis",
    therapeuticArea: "Rheumatology",
    company: "Novartis",
    companyTrackRecord: 'fast',
    nctId: "NCT01863732",
    clinicalTrialsSearchTerm: "secukinumab ankylosing spondylitis",
    scores: calculateProbabilityScores("Approved", "Ankylosing Spondylitis", "Rheumatology"),
    marketData: generateMarketProjections("Secukinumab", "Approved", "Ankylosing Spondylitis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-17A monoclonal antibody",
      administration: "Subcutaneous injection monthly",
      keyAdvantage: "First IL-17 approved for AS, structural data",
      discovery: "Novartis",
      development: "Novartis"
    },
    patents: [
      { patentNumber: "US7807155", title: "IL-17 binding antibodies", expirationDate: "2027", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$6.8B",
      projectedGrowth: "6%",
      keyPlayers: [
        { name: "Taltz", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Similar efficacy", efficacy: "Comparable", threat: 'high' },
        { name: "Humira biosimilars", company: "Multiple", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Lower cost", efficacy: "Established", threat: 'medium' }
      ],
      competitiveAdvantages: ["First mover in IL-17", "Structural progression data"],
      competitiveRisks: ["Taltz competition", "Biosimilar erosion"],
      marketPositioning: "Market leader in IL-17 for AS"
    },
    retrospectivePhases: [
      { phase: "Phase III MEASURE 1/2", date: "Q4 2015", outcome: 'success', keyData: ["ASAS20 61% vs 28%", "Sustained responses"], scoreAtTime: 82, rationale: "First IL-17 AS approval", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "Structural Data", date: "Q2 2019", outcome: 'success', keyData: ["X-ray progression inhibition", "4-year data"], scoreAtTime: 88, rationale: "Disease-modifying evidence", dataAvailableAtTime: ["Long-term data"] }
    ]
  },
  {
    id: "rheum-5",
    name: "Guselkumab",
    trialName: "DISCOVER 1/2",
    phase: "Approved",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Johnson & Johnson",
    companyTrackRecord: 'fast',
    nctId: "NCT03162796",
    clinicalTrialsSearchTerm: "guselkumab psoriatic arthritis",
    scores: calculateProbabilityScores("Approved", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Guselkumab", "Approved", "Psoriatic Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-23p19 monoclonal antibody",
      administration: "Subcutaneous injection every 8 weeks",
      keyAdvantage: "IL-23 selectivity, excellent safety profile",
      discovery: "Johnson & Johnson",
      development: "Janssen"
    },
    patents: [
      { patentNumber: "US8263748", title: "Anti-IL-23 antibodies", expirationDate: "2030", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$10.5B",
      projectedGrowth: "9%",
      keyPlayers: [
        { name: "Skyrizi", company: "AbbVie", phase: "Approved", mechanism: "Anti-IL-23", keyDifferentiator: "Quarterly dosing", efficacy: "Comparable", threat: 'high' },
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Different mechanism", efficacy: "Strong joints", threat: 'high' }
      ],
      competitiveAdvantages: ["Strong safety profile", "Every 8-week maintenance"],
      competitiveRisks: ["Skyrizi quarterly dosing advantage"],
      marketPositioning: "Well-established IL-23 inhibitor"
    },
    retrospectivePhases: [
      { phase: "Phase III DISCOVER 1/2", date: "Q4 2019", outcome: 'success', keyData: ["ACR20 64% vs 33%", "Enthesitis resolution"], scoreAtTime: 80, rationale: "Robust PsA data", dataAvailableAtTime: ["Primary endpoints met"] },
      { phase: "FDA PsA Approval", date: "Q3 2020", outcome: 'success', keyData: ["PsA indication", "Bio-naive and experienced"], scoreAtTime: 88, rationale: "Successful label expansion", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-6",
    name: "Bimekizumab",
    trialName: "BE OPTIMAL/COMPLETE",
    phase: "Approved",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "UCB",
    companyTrackRecord: 'average',
    nctId: "NCT03895203",
    clinicalTrialsSearchTerm: "bimekizumab psoriatic arthritis",
    scores: calculateProbabilityScores("Approved", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Bimekizumab", "Approved", "Psoriatic Arthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Dual IL-17A/IL-17F inhibitor",
      administration: "Subcutaneous injection every 4 weeks",
      keyAdvantage: "Dual cytokine blockade, rapid responses",
      discovery: "UCB",
      development: "UCB"
    },
    patents: [
      { patentNumber: "US9957317", title: "IL-17A/F antibodies", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$12.0B",
      projectedGrowth: "10%",
      keyPlayers: [
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A only", keyDifferentiator: "Established", efficacy: "Comparable joints", threat: 'high' },
        { name: "Taltz", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-IL-17A only", keyDifferentiator: "Similar dosing", efficacy: "Comparable", threat: 'high' }
      ],
      competitiveAdvantages: ["Dual IL-17A/F mechanism", "Superior skin clearance"],
      competitiveRisks: ["Candida risk", "Late market entry"],
      marketPositioning: "Differentiated IL-17 inhibitor with dual blockade"
    },
    retrospectivePhases: [
      { phase: "Phase III BE OPTIMAL", date: "Q2 2022", outcome: 'success', keyData: ["ACR50 44% vs 10%", "PASI90 in 61%"], scoreAtTime: 82, rationale: "Strong joint and skin data", dataAvailableAtTime: ["Primary endpoint met"] },
      { phase: "FDA PsA Approval", date: "Q4 2023", outcome: 'success', keyData: ["PsA indication approved", "Complete response data"], scoreAtTime: 88, rationale: "Successful PsA launch", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-7",
    name: "Deucravacitinib",
    trialName: "POETYK PSA-1/2",
    phase: "Phase III",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Bristol-Myers Squibb",
    companyTrackRecord: 'fast',
    nctId: "NCT04908189",
    clinicalTrialsSearchTerm: "deucravacitinib psoriatic arthritis",
    scores: calculateProbabilityScores("Phase III", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Deucravacitinib", "Phase III", "Psoriatic Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective TYK2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Novel target, oral convenience, differentiated safety",
      discovery: "Bristol-Myers Squibb",
      development: "BMS"
    },
    patents: [
      { patentNumber: "US10752606", title: "TYK2 inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$10.5B",
      projectedGrowth: "8%",
      keyPlayers: [
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Broader efficacy", efficacy: "Strong", threat: 'high' },
        { name: "Xeljanz", company: "Pfizer", phase: "Approved", mechanism: "Pan-JAK inhibitor", keyDifferentiator: "First JAK approved", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["TYK2 selectivity may avoid JAK warnings", "Oral dosing"],
      competitiveRisks: ["JAK class perception", "Pending data"],
      marketPositioning: "First-in-class TYK2 inhibitor for PsA"
    },
    retrospectivePhases: [
      { phase: "Phase III POETYK PSA-1", date: "Q2 2023", outcome: 'pending', keyData: ["Primary endpoint results pending", "Psoriasis success supports PsA"], scoreAtTime: 65, rationale: "TYK2 mechanism proven in psoriasis", dataAvailableAtTime: ["Psoriasis approval achieved"] },
      { phase: "Ongoing Development", date: "Q4 2024", outcome: 'pending', keyData: ["PsA pivotal readout expected", "Filing anticipated 2025"], scoreAtTime: 68, rationale: "Regulatory pathway clear", dataAvailableAtTime: ["Development on track"] }
    ]
  },
  {
    id: "rheum-8",
    name: "Filgotinib",
    trialName: "FINCH 1/2/3",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Gilead/Galapagos",
    companyTrackRecord: 'average',
    nctId: "NCT02889796",
    clinicalTrialsSearchTerm: "filgotinib rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Filgotinib", "Approved", "Rheumatoid Arthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective JAK1 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "High JAK1 selectivity, favorable safety signal",
      discovery: "Galapagos",
      development: "Gilead/Galapagos partnership"
    },
    patents: [
      { patentNumber: "US9181253", title: "JAK1 selective inhibitors", expirationDate: "2031", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "5%",
      keyPlayers: [
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Superior efficacy data", efficacy: "Higher", threat: 'high' },
        { name: "Xeljanz", company: "Pfizer", phase: "Approved", mechanism: "Pan-JAK", keyDifferentiator: "Established", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["JAK1 selectivity", "Favorable safety in trials"],
      competitiveRisks: ["US not approved", "Competitive market"],
      marketPositioning: "Selective JAK1 inhibitor available ex-US"
    },
    retrospectivePhases: [
      { phase: "Phase III FINCH", date: "Q3 2019", outcome: 'success', keyData: ["ACR20 met", "Remission achieved"], scoreAtTime: 75, rationale: "Positive pivotal data", dataAvailableAtTime: ["Phase 3 results"] },
      { phase: "EU Approval", date: "Q3 2020", outcome: 'success', keyData: ["Approved in EU/Japan", "US not pursued"], scoreAtTime: 70, rationale: "Regional approvals", dataAvailableAtTime: ["Regulatory package"] }
    ]
  },
  {
    id: "rheum-9",
    name: "Sarilumab",
    trialName: "MONARCH/EXTEND",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Regeneron/Sanofi",
    companyTrackRecord: 'fast',
    nctId: "NCT02332590",
    clinicalTrialsSearchTerm: "sarilumab rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Sarilumab", "Approved", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-6 receptor monoclonal antibody",
      administration: "Subcutaneous injection every 2 weeks",
      keyAdvantage: "IL-6 blockade, monotherapy option",
      discovery: "Regeneron",
      development: "Regeneron/Sanofi partnership"
    },
    patents: [
      { patentNumber: "US8080248", title: "IL-6R antibodies", expirationDate: "2027", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$5.2B",
      projectedGrowth: "4%",
      keyPlayers: [
        { name: "Actemra", company: "Roche", phase: "Approved", mechanism: "Anti-IL-6R", keyDifferentiator: "Market leader", efficacy: "Similar", threat: 'high' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Oral dosing", efficacy: "Superior", threat: 'high' }
      ],
      competitiveAdvantages: ["Monotherapy efficacy", "SC administration"],
      competitiveRisks: ["Actemra dominance", "JAK competition"],
      marketPositioning: "Alternative IL-6 blocker for RA"
    },
    retrospectivePhases: [
      { phase: "Phase III MONARCH", date: "Q4 2016", outcome: 'success', keyData: ["Superior to adalimumab monotherapy", "ACR20 71.7%"], scoreAtTime: 78, rationale: "Monotherapy superiority", dataAvailableAtTime: ["Head-to-head data"] },
      { phase: "FDA Approval", date: "Q2 2017", outcome: 'success', keyData: ["RA approval", "Monotherapy and combo"], scoreAtTime: 85, rationale: "Successful launch", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-10",
    name: "Baricitinib",
    trialName: "RA-BEAM/BUILD",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Eli Lilly/Incyte",
    companyTrackRecord: 'fast',
    nctId: "NCT01721057",
    clinicalTrialsSearchTerm: "baricitinib rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Baricitinib", "Approved", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "JAK1/JAK2 inhibitor",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Proven efficacy, alopecia indication",
      discovery: "Incyte",
      development: "Eli Lilly/Incyte partnership"
    },
    patents: [
      { patentNumber: "US8158616", title: "JAK inhibitor compounds", expirationDate: "2029", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "5%",
      keyPlayers: [
        { name: "Xeljanz", company: "Pfizer", phase: "Approved", mechanism: "Pan-JAK", keyDifferentiator: "First JAK", efficacy: "Comparable", threat: 'medium' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 selective", keyDifferentiator: "JAK1 selectivity", efficacy: "Superior data", threat: 'high' }
      ],
      competitiveAdvantages: ["Alopecia indication", "COVID authorization"],
      competitiveRisks: ["JAK class warnings", "Competition"],
      marketPositioning: "Established JAK inhibitor with multiple uses"
    },
    retrospectivePhases: [
      { phase: "Phase III RA-BEAM", date: "Q4 2016", outcome: 'success', keyData: ["ACR20 vs placebo and adalimumab", "Rapid onset"], scoreAtTime: 80, rationale: "Strong pivotal data", dataAvailableAtTime: ["Primary endpoints met"] },
      { phase: "Alopecia Approval", date: "Q2 2022", outcome: 'success', keyData: ["Alopecia areata indication", "Expanded market"], scoreAtTime: 88, rationale: "Lifecycle management success", dataAvailableAtTime: ["Label expansion"] }
    ]
  },
  {
    id: "rheum-11",
    name: "Tofacitinib",
    trialName: "ORAL Standard/Strategy",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT00853385",
    clinicalTrialsSearchTerm: "tofacitinib rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Tofacitinib", "Approved", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Pan-JAK inhibitor (JAK1/JAK3 preferential)",
      administration: "Twice-daily or once-daily XR oral tablet",
      keyAdvantage: "First JAK approved, extensive data",
      discovery: "Pfizer",
      development: "Pfizer"
    },
    patents: [
      { patentNumber: "US6965027", title: "Pyrrolopyrimidine compounds", expirationDate: "2023", type: 'composition', status: 'expired' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "4%",
      keyPlayers: [
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 selective", keyDifferentiator: "Better efficacy", efficacy: "Superior", threat: 'high' },
        { name: "Generic tofacitinib", company: "Multiple", phase: "Approved", mechanism: "Pan-JAK", keyDifferentiator: "Lower cost", efficacy: "Same", threat: 'high' }
      ],
      competitiveAdvantages: ["First mover advantage", "Extensive safety data"],
      competitiveRisks: ["ORAL Surveillance CV safety", "Generic erosion"],
      marketPositioning: "Pioneer JAK inhibitor facing generic competition"
    },
    retrospectivePhases: [
      { phase: "FDA Approval", date: "Q4 2012", outcome: 'success', keyData: ["First JAK approved for RA", "Historic milestone"], scoreAtTime: 90, rationale: "Landmark approval", dataAvailableAtTime: ["Full regulatory package"] },
      { phase: "ORAL Surveillance", date: "Q1 2022", outcome: 'setback', keyData: ["CV/VTE safety signal", "Label updates"], scoreAtTime: 65, rationale: "Safety concerns impact class", dataAvailableAtTime: ["Post-marketing data"] }
    ]
  },
  {
    id: "rheum-12",
    name: "Ozoralizumab",
    trialName: "OHZORA",
    phase: "Approved",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Taisho Pharmaceutical",
    companyTrackRecord: 'average',
    nctId: "NCT04077567",
    clinicalTrialsSearchTerm: "ozoralizumab rheumatoid arthritis",
    scores: calculateProbabilityScores("Approved", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Ozoralizumab", "Approved", "Rheumatoid Arthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Trivalent bispecific anti-TNF Nanobody",
      administration: "Subcutaneous injection every 4 weeks",
      keyAdvantage: "Novel Nanobody technology, monthly dosing",
      discovery: "Ablynx (now Sanofi)",
      development: "Taisho Pharmaceutical"
    },
    patents: [
      { patentNumber: "US9109030", title: "Anti-TNF Nanobody compounds", expirationDate: "2031", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "5%",
      keyPlayers: [
        { name: "Humira biosimilars", company: "Multiple", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Lower cost", efficacy: "Established", threat: 'high' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Oral", efficacy: "Strong", threat: 'high' }
      ],
      competitiveAdvantages: ["Novel Nanobody technology", "Monthly SC dosing"],
      competitiveRisks: ["Limited geographic availability", "TNF class maturity"],
      marketPositioning: "Innovative anti-TNF in Japan market"
    },
    retrospectivePhases: [
      { phase: "Phase III OHZORA", date: "Q3 2021", outcome: 'success', keyData: ["ACR20 met", "Comparable to adalimumab"], scoreAtTime: 75, rationale: "Positive pivotal in Japan", dataAvailableAtTime: ["Primary endpoint met"] },
      { phase: "Japan Approval", date: "Q3 2022", outcome: 'success', keyData: ["First Nanobody approved for RA", "Japan launch"], scoreAtTime: 80, rationale: "Regulatory success in Japan", dataAvailableAtTime: ["Regional approval"] }
    ]
  },
  {
    id: "rheum-13",
    name: "Peresolimab",
    trialName: "Phase II/III RA",
    phase: "Phase II/III",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Eli Lilly",
    companyTrackRecord: 'fast',
    nctId: "NCT05099471",
    clinicalTrialsSearchTerm: "peresolimab rheumatoid arthritis",
    scores: calculateProbabilityScores("Phase II", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Peresolimab", "Phase II", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "PD-1 agonist antibody",
      administration: "Intravenous infusion every 4 weeks",
      keyAdvantage: "Novel mechanism activating immune checkpoints for tolerance",
      discovery: "Eli Lilly",
      development: "Eli Lilly"
    },
    patents: [
      { patentNumber: "US10723793", title: "PD-1 agonist antibodies", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "6%",
      keyPlayers: [
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Established", efficacy: "Strong", threat: 'high' },
        { name: "Humira biosimilars", company: "Multiple", phase: "Approved", mechanism: "Anti-TNF", keyDifferentiator: "Low cost", efficacy: "Established", threat: 'medium' }
      ],
      competitiveAdvantages: ["First-in-class mechanism", "Immune tolerance approach"],
      competitiveRisks: ["Novel mechanism uncertainty", "IV administration"],
      marketPositioning: "Potential paradigm shift in RA treatment"
    },
    retrospectivePhases: [
      { phase: "Phase II POC", date: "Q2 2022", outcome: 'success', keyData: ["ACR20 71% vs 42%", "DAS28 remission achieved"], scoreAtTime: 62, rationale: "Compelling proof of concept", dataAvailableAtTime: ["Phase 2 efficacy data"] },
      { phase: "Phase III Initiation", date: "Q4 2023", outcome: 'pending', keyData: ["Pivotal program initiated", "Multiple doses tested"], scoreAtTime: 58, rationale: "Advancing to pivotal", dataAvailableAtTime: ["Phase 3 design"] }
    ]
  },
  {
    id: "rheum-14",
    name: "Nipocalimab",
    trialName: "VIVACITY-RA",
    phase: "Phase III",
    indication: "Rheumatoid Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Johnson & Johnson",
    companyTrackRecord: 'fast',
    nctId: "NCT05130151",
    clinicalTrialsSearchTerm: "nipocalimab rheumatoid arthritis",
    scores: calculateProbabilityScores("Phase III", "Rheumatoid Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Nipocalimab", "Phase III", "Rheumatoid Arthritis", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-FcRn monoclonal antibody",
      administration: "Intravenous infusion every 2-4 weeks",
      keyAdvantage: "IgG reduction, targeting autoantibodies",
      discovery: "Momenta (acquired by J&J)",
      development: "Janssen"
    },
    patents: [
      { patentNumber: "US10556952", title: "Anti-FcRn antibodies", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28.5B",
      projectedGrowth: "6%",
      keyPlayers: [
        { name: "Efgartigimod", company: "argenx", phase: "Approved", mechanism: "Anti-FcRn", keyDifferentiator: "MG approval", efficacy: "Proven in MG", threat: 'medium' },
        { name: "Rinvoq", company: "AbbVie", phase: "Approved", mechanism: "JAK1 inhibitor", keyDifferentiator: "Oral", efficacy: "Strong", threat: 'high' }
      ],
      competitiveAdvantages: ["Novel FcRn mechanism for RA", "Autoantibody targeting"],
      competitiveRisks: ["IV administration", "Infection risk with IgG reduction"],
      marketPositioning: "First-in-class FcRn inhibitor for RA"
    },
    retrospectivePhases: [
      { phase: "Phase II Dose-Ranging", date: "Q4 2021", outcome: 'success', keyData: ["Dose-dependent ACR20", "IgG reduction correlated with response"], scoreAtTime: 55, rationale: "Proof of mechanism", dataAvailableAtTime: ["Phase 2 dose data"] },
      { phase: "Phase III VIVACITY-RA", date: "Q2 2024", outcome: 'pending', keyData: ["Pivotal trial ongoing", "Seropositive RA focus"], scoreAtTime: 52, rationale: "Advancing in RA", dataAvailableAtTime: ["Trial design"] }
    ]
  },
  {
    id: "rheum-15",
    name: "Spesolimab",
    trialName: "Effisayil 1/2",
    phase: "Approved",
    indication: "Generalized Pustular Psoriasis",
    therapeuticArea: "Rheumatology",
    company: "Boehringer Ingelheim",
    companyTrackRecord: 'average',
    nctId: "NCT03782792",
    clinicalTrialsSearchTerm: "spesolimab pustular psoriasis",
    scores: calculateProbabilityScores("Approved", "Pustular Psoriasis", "Rheumatology"),
    marketData: generateMarketProjections("Spesolimab", "Approved", "Pustular Psoriasis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-36 receptor monoclonal antibody",
      administration: "Intravenous infusion for flares, SC for maintenance",
      keyAdvantage: "First approved for GPP flares, novel IL-36 target",
      discovery: "Boehringer Ingelheim",
      development: "Boehringer Ingelheim"
    },
    patents: [
      { patentNumber: "US10407493", title: "IL-36R antibodies", expirationDate: "2036", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$500M",
      projectedGrowth: "25%",
      keyPlayers: [
        { name: "Imsidolimab", company: "Anaptysbio", phase: "Phase III", mechanism: "Anti-IL-36R", keyDifferentiator: "SC only", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["First-to-market in GPP", "Novel IL-36 mechanism"],
      competitiveRisks: ["Small market size", "Competition emerging"],
      marketPositioning: "First and only approved treatment for GPP flares"
    },
    retrospectivePhases: [
      { phase: "Phase II Effisayil 1", date: "Q3 2021", outcome: 'success', keyData: ["54% pustule clearance vs 6%", "Rapid response"], scoreAtTime: 80, rationale: "Unprecedented GPP efficacy", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "FDA Approval", date: "Q4 2022", outcome: 'success', keyData: ["First GPP flare treatment", "Priority review"], scoreAtTime: 92, rationale: "Historic approval", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-16",
    name: "Izokibep",
    trialName: "Phase III PsA/axSpA",
    phase: "Phase III",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "Acelyrin (acquired by Alumis)",
    companyTrackRecord: 'average',
    nctId: "NCT05478785",
    clinicalTrialsSearchTerm: "izokibep psoriatic arthritis",
    scores: calculateProbabilityScores("Phase III", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Izokibep", "Phase III", "Psoriatic Arthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "IL-17A inhibitor (Affibody)",
      administration: "Subcutaneous injection weekly or bi-weekly",
      keyAdvantage: "Small size enables tissue penetration, no uveitis signal",
      discovery: "Affibody",
      development: "Alumis (formerly Acelyrin)"
    },
    patents: [
      { patentNumber: "US10844106", title: "IL-17A binding Affibody", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$12.0B",
      projectedGrowth: "8%",
      keyPlayers: [
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A antibody", keyDifferentiator: "Established", efficacy: "Proven", threat: 'high' },
        { name: "Taltz", company: "Eli Lilly", phase: "Approved", mechanism: "Anti-IL-17A antibody", keyDifferentiator: "Established", efficacy: "Proven", threat: 'high' }
      ],
      competitiveAdvantages: ["Small molecule size", "Potential for uveitis use"],
      competitiveRisks: ["Late entrant", "Established competition"],
      marketPositioning: "Next-generation IL-17A inhibitor"
    },
    retrospectivePhases: [
      { phase: "Phase II PsA", date: "Q4 2022", outcome: 'success', keyData: ["ACR50 38% vs 11%", "PASI90 54%"], scoreAtTime: 65, rationale: "Strong Phase 2 data", dataAvailableAtTime: ["Phase 2 results"] },
      { phase: "Phase III Initiation", date: "Q2 2023", outcome: 'pending', keyData: ["Pivotal PsA studies ongoing", "axSpA expansion planned"], scoreAtTime: 60, rationale: "Advancing to registrational", dataAvailableAtTime: ["Trial design"] }
    ]
  },
  {
    id: "rheum-17",
    name: "Sonelokimab",
    trialName: "IMMerge/IMMpulse",
    phase: "Phase III",
    indication: "Psoriatic Arthritis",
    therapeuticArea: "Rheumatology",
    company: "MoonLake Immunotherapeutics",
    companyTrackRecord: 'average',
    nctId: "NCT05575011",
    clinicalTrialsSearchTerm: "sonelokimab psoriatic arthritis",
    scores: calculateProbabilityScores("Phase III", "Psoriatic Arthritis", "Rheumatology"),
    marketData: generateMarketProjections("Sonelokimab", "Phase III", "Psoriatic Arthritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-IL-17A/IL-17F Nanobody",
      administration: "Subcutaneous injection every 4-8 weeks",
      keyAdvantage: "Dual IL-17 blockade with small Nanobody format",
      discovery: "Ablynx/MoonLake",
      development: "MoonLake Immunotherapeutics"
    },
    patents: [
      { patentNumber: "US10759855", title: "IL-17A/F Nanobody", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$12.0B",
      projectedGrowth: "8%",
      keyPlayers: [
        { name: "Bimzelx", company: "UCB", phase: "Approved", mechanism: "Dual IL-17A/F", keyDifferentiator: "First dual approved", efficacy: "Strong", threat: 'high' },
        { name: "Cosentyx", company: "Novartis", phase: "Approved", mechanism: "Anti-IL-17A", keyDifferentiator: "Established", efficacy: "Proven", threat: 'high' }
      ],
      competitiveAdvantages: ["Nanobody format", "Extended dosing potential"],
      competitiveRisks: ["Bimzelx first mover", "Development risk"],
      marketPositioning: "Next-generation dual IL-17 inhibitor"
    },
    retrospectivePhases: [
      { phase: "Phase II Psoriasis", date: "Q2 2022", outcome: 'success', keyData: ["PASI90 76%", "Extended durability"], scoreAtTime: 68, rationale: "Strong skin data", dataAvailableAtTime: ["Psoriasis Phase 2"] },
      { phase: "Phase III PsA Start", date: "Q1 2024", outcome: 'pending', keyData: ["IMMpulse PsA initiated", "Joint and skin co-primary"], scoreAtTime: 55, rationale: "PsA development ongoing", dataAvailableAtTime: ["Trial initiation"] }
    ]
  },
  {
    id: "rheum-18",
    name: "Etrasimod",
    trialName: "Phase II/III Rheumatic",
    phase: "Phase II",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Rheumatology",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT05720598",
    clinicalTrialsSearchTerm: "etrasimod lupus",
    scores: calculateProbabilityScores("Phase II", "Systemic Lupus Erythematosus", "Rheumatology"),
    marketData: generateMarketProjections("Etrasimod", "Phase II", "Systemic Lupus Erythematosus", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Selective S1P1,4,5 receptor modulator",
      administration: "Once-daily oral tablet",
      keyAdvantage: "Selective S1P modulation, oral dosing, UC approval leveraged",
      discovery: "Arena Pharmaceuticals",
      development: "Pfizer (acquired Arena)"
    },
    patents: [
      { patentNumber: "US10301269", title: "S1P receptor modulators", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.5B",
      projectedGrowth: "12%",
      keyPlayers: [
        { name: "Benlysta", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "Market leader", efficacy: "Established", threat: 'high' },
        { name: "Saphnelo", company: "AstraZeneca", phase: "Approved", mechanism: "Anti-IFNAR", keyDifferentiator: "Novel mechanism", efficacy: "Strong", threat: 'medium' }
      ],
      competitiveAdvantages: ["Oral convenience", "S1P experience from UC"],
      competitiveRisks: ["SLE trial complexity", "AE monitoring needed"],
      marketPositioning: "Oral option for SLE with proven S1P mechanism"
    },
    retrospectivePhases: [
      { phase: "UC Approval Velsipity", date: "Q4 2023", outcome: 'success', keyData: ["Approved for UC", "Validated mechanism"], scoreAtTime: 70, rationale: "S1P mechanism proven", dataAvailableAtTime: ["UC approval data"] },
      { phase: "SLE Phase II", date: "Q2 2024", outcome: 'pending', keyData: ["SLE trial initiated", "Dose ranging ongoing"], scoreAtTime: 45, rationale: "Exploring new indication", dataAvailableAtTime: ["Trial design"] }
    ]
  },
  {
    id: "rheum-19",
    name: "Anifrolumab",
    trialName: "TULIP-1/2",
    phase: "Approved",
    indication: "Systemic Lupus Erythematosus",
    therapeuticArea: "Rheumatology",
    company: "AstraZeneca",
    companyTrackRecord: 'fast',
    nctId: "NCT02446899",
    clinicalTrialsSearchTerm: "anifrolumab lupus",
    scores: calculateProbabilityScores("Approved", "Systemic Lupus Erythematosus", "Rheumatology"),
    marketData: generateMarketProjections("Anifrolumab", "Approved", "Systemic Lupus Erythematosus", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Anti-type I interferon receptor antibody",
      administration: "Intravenous infusion every 4 weeks",
      keyAdvantage: "First IFN-targeting therapy for SLE, strong skin benefit",
      discovery: "MedImmune/AstraZeneca",
      development: "AstraZeneca"
    },
    patents: [
      { patentNumber: "US7662381", title: "Anti-IFNAR1 antibodies", expirationDate: "2028", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.5B",
      projectedGrowth: "15%",
      keyPlayers: [
        { name: "Benlysta", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "First biologic for SLE", efficacy: "Moderate", threat: 'high' },
        { name: "Lupkynis", company: "Aurinia", phase: "Approved", mechanism: "Calcineurin inhibitor", keyDifferentiator: "Lupus nephritis", efficacy: "Strong in LN", threat: 'low' }
      ],
      competitiveAdvantages: ["Novel IFN mechanism", "Strong skin responses"],
      competitiveRisks: ["IV administration", "Herpes zoster risk"],
      marketPositioning: "First-in-class IFN receptor blocker for SLE"
    },
    retrospectivePhases: [
      { phase: "Phase III TULIP-2", date: "Q4 2019", outcome: 'success', keyData: ["BICLA 47.8% vs 31.5%", "Skin improvement"], scoreAtTime: 78, rationale: "Met primary endpoint", dataAvailableAtTime: ["Pivotal efficacy data"] },
      { phase: "FDA Approval", date: "Q3 2021", outcome: 'success', keyData: ["SLE approval", "Add-on to standard therapy"], scoreAtTime: 88, rationale: "Successful launch", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  },
  {
    id: "rheum-20",
    name: "Voclosporin",
    trialName: "AURORA 1/2",
    phase: "Approved",
    indication: "Lupus Nephritis",
    therapeuticArea: "Rheumatology",
    company: "Aurinia Pharmaceuticals",
    companyTrackRecord: 'average',
    nctId: "NCT03021499",
    clinicalTrialsSearchTerm: "voclosporin lupus nephritis",
    scores: calculateProbabilityScores("Approved", "Lupus Nephritis", "Rheumatology"),
    marketData: generateMarketProjections("Voclosporin", "Approved", "Lupus Nephritis", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Calcineurin inhibitor (cyclosporine analog)",
      administration: "Twice-daily oral capsule",
      keyAdvantage: "More consistent PK than cyclosporine, no monitoring needed",
      discovery: "Aurinia Pharmaceuticals",
      development: "Aurinia Pharmaceuticals"
    },
    patents: [
      { patentNumber: "US6809077", title: "Cyclosporin analogs", expirationDate: "2024", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.8B",
      projectedGrowth: "18%",
      keyPlayers: [
        { name: "Benlysta IV/SC", company: "GSK", phase: "Approved", mechanism: "Anti-BLyS", keyDifferentiator: "Approved for LN", efficacy: "Proven", threat: 'high' },
        { name: "MMF/azathioprine", company: "Generic", phase: "Approved", mechanism: "Immunosuppression", keyDifferentiator: "Low cost", efficacy: "Standard", threat: 'medium' }
      ],
      competitiveAdvantages: ["First oral specifically for LN", "No drug monitoring"],
      competitiveRisks: ["Generic cyclosporine perception", "Renal safety monitoring"],
      marketPositioning: "First oral therapy specifically approved for lupus nephritis"
    },
    retrospectivePhases: [
      { phase: "Phase III AURORA 1", date: "Q4 2020", outcome: 'success', keyData: ["Complete renal response 41% vs 23%", "Rapid onset"], scoreAtTime: 80, rationale: "Strong LN efficacy", dataAvailableAtTime: ["Pivotal data"] },
      { phase: "FDA Approval", date: "Q1 2021", outcome: 'success', keyData: ["First oral for LN", "Historic approval"], scoreAtTime: 90, rationale: "Successful launch", dataAvailableAtTime: ["Full regulatory package"] }
    ]
  }
];
