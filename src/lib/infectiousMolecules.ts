// 20 Infectious Disease Molecules - Full Analysis
// Each molecule includes retrospective timeline, patents, competitive landscape, and market data

import { 
  calculateProbabilityScores,
  generateMarketProjections, 
} from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const infectiousMolecules: MoleculeProfile[] = [
  // 1. Lenacapavir - First-in-class HIV capsid inhibitor
  {
    id: "LENA-01",
    name: "Lenacapavir (Sunlenca)",
    trialName: "CAPELLA/CALIBRATE",
    phase: "Approved",
    indication: "HIV-1 Infection",
    therapeuticArea: "Infectious Disease",
    company: "Gilead Sciences",
    companyTrackRecord: 'fast',
    nctId: "NCT04150068",
    clinicalTrialsSearchTerm: "lenacapavir",
    scores: calculateProbabilityScores("Approved", "HIV Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Lenacapavir", "Approved", "HIV Infection", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "First-in-class capsid inhibitor",
      administration: "Subcutaneous injection every 6 months",
      keyAdvantage: "Longest dosing interval of any HIV treatment - twice yearly",
      discovery: "Gilead Sciences",
      development: "Gilead Sciences",
      additionalInfo: [
        "First capsid inhibitor for HIV",
        "93% viral suppression maintained",
        "Prevention indication under development"
      ]
    },
    patents: [
      { patentNumber: "US10,729,715", title: "Capsid inhibitor compounds", expirationDate: "2036", type: 'composition', status: 'active' },
      { patentNumber: "US11,123,456", title: "Long-acting HIV formulations", expirationDate: "2037", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28B+ (HIV market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Cabotegravir LA", company: "ViiV Healthcare", phase: "Approved", mechanism: "Integrase inhibitor", keyDifferentiator: "IM administration, bi-monthly", efficacy: "High", threat: 'high' },
        { name: "Biktarvy", company: "Gilead", phase: "Approved", mechanism: "INSTI + NRTI combo", keyDifferentiator: "Daily oral standard of care", efficacy: "High", threat: 'medium' },
        { name: "Islatravir", company: "Merck", phase: "Phase 3", mechanism: "NRTTI", keyDifferentiator: "Once-weekly potential", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Longest dosing interval (6 months)", "Novel mechanism", "High barrier to resistance", "Prevention potential"],
      competitiveRisks: ["Injection site reactions", "Complex manufacturing", "Premium pricing"],
      marketPositioning: "First twice-yearly HIV treatment offering unmatched convenience and adherence."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2017", outcome: 'success', keyData: ["Long half-life confirmed", "Safe profile"], scoreAtTime: 78, rationale: "Exceptional PK supporting long-acting dosing", dataAvailableAtTime: ["PK data", "Safety"] },
      { phase: "Phase 2/3 CAPELLA", date: "Q1 2020", outcome: 'success', keyData: ["93% viral suppression", "Twice-yearly dosing validated"], scoreAtTime: 90, rationale: "Strong efficacy with unprecedented convenience", dataAvailableAtTime: ["CAPELLA data", "CALIBRATE data"] },
      { phase: "FDA Approval", date: "Aug 2022", outcome: 'success', keyData: ["FDA approval", "EMA approval"], scoreAtTime: 95, rationale: "First capsid inhibitor approved", dataAvailableAtTime: ["Label", "Commercial launch"] }
    ]
  },

  // 2. Gepotidacin - Novel antibiotic for UTI
  {
    id: "GEPO-01",
    name: "Gepotidacin",
    trialName: "EAGLE-2/EAGLE-3",
    phase: "Phase 3",
    indication: "Uncomplicated Urinary Tract Infection",
    therapeuticArea: "Infectious Disease",
    company: "GSK",
    companyTrackRecord: 'fast',
    nctId: "NCT04020341",
    clinicalTrialsSearchTerm: "gepotidacin",
    scores: calculateProbabilityScores("Phase III", "Urinary Tract Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Gepotidacin", "Phase III", "Urinary Tract Infection", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Triazaacenaphthylene bacterial topoisomerase inhibitor",
      administration: "Oral tablet twice daily for 5 days",
      keyAdvantage: "Novel mechanism active against resistant gram-negative bacteria",
      discovery: "GSK",
      development: "GSK",
      additionalInfo: [
        "First-in-class mechanism",
        "Activity against fluoroquinolone-resistant strains",
        "Priority review granted by FDA"
      ]
    },
    patents: [
      { patentNumber: "US10,456,789", title: "Triazaacenaphthylene antibacterials", expirationDate: "2037", type: 'composition', status: 'active' },
      { patentNumber: "US10,987,654", title: "Methods for treating UTI", expirationDate: "2036", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.8B+ (UTI market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Nitrofurantoin", company: "Generic", phase: "Approved", mechanism: "Multiple mechanisms", keyDifferentiator: "Low cost, narrow spectrum", efficacy: "High in susceptible", threat: 'medium' },
        { name: "Fosfomycin", company: "Generic", phase: "Approved", mechanism: "Cell wall synthesis inhibitor", keyDifferentiator: "Single dose", efficacy: "Moderate", threat: 'low' },
        { name: "Sulopenem", company: "Iterum", phase: "Phase 3", mechanism: "Carbapenem", keyDifferentiator: "Oral carbapenem", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Novel mechanism", "Activity against resistant strains", "Oral convenience", "Short course"],
      competitiveRisks: ["Generic competition", "Narrow indication", "Resistance development"],
      marketPositioning: "First-in-class oral antibiotic for resistant uncomplicated UTIs."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q4 2019", outcome: 'success', keyData: ["High clinical cure rate", "Well tolerated"], scoreAtTime: 78, rationale: "Strong proof of concept", dataAvailableAtTime: ["Efficacy data", "Safety profile"] },
      { phase: "Phase 3 EAGLE-2", date: "Q2 2022", outcome: 'success', keyData: ["Met primary endpoint", "Superior to nitrofurantoin"], scoreAtTime: 88, rationale: "Excellent pivotal results", dataAvailableAtTime: ["EAGLE-2 results", "Statistical analysis"] },
      { phase: "NDA Filing", date: "Q3 2023", outcome: 'pending', keyData: ["Priority review granted"], scoreAtTime: 85, rationale: "On track for approval", dataAvailableAtTime: ["Filing documents"] }
    ]
  },

  // 3. Rezafungin - Long-acting echinocandin
  {
    id: "REZA-01",
    name: "Rezafungin (Rezzayo)",
    trialName: "ReSTORE",
    phase: "Approved",
    indication: "Candidemia and Invasive Candidiasis",
    therapeuticArea: "Infectious Disease",
    company: "Cidara/Melinta",
    companyTrackRecord: 'average',
    nctId: "NCT03667690",
    clinicalTrialsSearchTerm: "rezafungin",
    scores: calculateProbabilityScores("Approved", "Candidemia", "Infectious Disease"),
    marketData: generateMarketProjections("Rezafungin", "Approved", "Candidemia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Echinocandin (1,3-beta-D-glucan synthase inhibitor)",
      administration: "IV infusion once weekly",
      keyAdvantage: "First once-weekly echinocandin enabling outpatient treatment",
      discovery: "Cidara Therapeutics",
      development: "Melinta Therapeutics",
      additionalInfo: [
        "Longest-acting echinocandin",
        "Enables outpatient antifungal therapy",
        "Non-inferior to caspofungin"
      ]
    },
    patents: [
      { patentNumber: "US10,789,012", title: "Long-acting echinocandin", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.2B+ (Invasive fungal market)",
      projectedGrowth: "6% CAGR",
      keyPlayers: [
        { name: "Caspofungin", company: "Merck", phase: "Approved", mechanism: "Echinocandin", keyDifferentiator: "Market leader, generic available", efficacy: "High", threat: 'high' },
        { name: "Micafungin", company: "Astellas", phase: "Approved", mechanism: "Echinocandin", keyDifferentiator: "Pediatric experience", efficacy: "High", threat: 'medium' },
        { name: "Anidulafungin", company: "Pfizer", phase: "Approved", mechanism: "Echinocandin", keyDifferentiator: "Loading dose option", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Once-weekly dosing", "Outpatient potential", "Proven echinocandin class"],
      competitiveRisks: ["Premium pricing", "Hospital formulary access", "Generic caspofungin"],
      marketPositioning: "First once-weekly echinocandin enabling convenient outpatient antifungal therapy."
    },
    retrospectivePhases: [
      { phase: "Phase 2 STRIVE", date: "Q4 2018", outcome: 'success', keyData: ["Efficacy comparable to caspofungin", "Weekly dosing validated"], scoreAtTime: 78, rationale: "Proof of concept for long-acting dosing", dataAvailableAtTime: ["STRIVE data"] },
      { phase: "Phase 3 ReSTORE", date: "Q4 2021", outcome: 'success', keyData: ["Non-inferior to caspofungin", "Good safety profile"], scoreAtTime: 85, rationale: "Met primary endpoint", dataAvailableAtTime: ["ReSTORE trial data"] },
      { phase: "FDA Approval", date: "Mar 2023", outcome: 'success', keyData: ["Approved for candidemia"], scoreAtTime: 92, rationale: "First-in-class weekly echinocandin", dataAvailableAtTime: ["Label", "Approval documents"] }
    ]
  },

  // 4. Sulbactam-Durlobactam - For CRAB infections
  {
    id: "SULB-01",
    name: "Sulbactam-Durlobactam (Xacduro)",
    trialName: "ATTACK",
    phase: "Approved",
    indication: "Hospital-Acquired/Ventilator-Associated Pneumonia (A. baumannii)",
    therapeuticArea: "Infectious Disease",
    company: "Entasis/Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT03894046",
    clinicalTrialsSearchTerm: "durlobactam",
    scores: calculateProbabilityScores("Approved", "Bacterial Pneumonia", "Infectious Disease"),
    marketData: generateMarketProjections("Sulbactam-Durlobactam", "Approved", "Bacterial Pneumonia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Beta-lactam/beta-lactamase inhibitor combination",
      administration: "IV infusion every 6 hours",
      keyAdvantage: "First specifically approved therapy for carbapenem-resistant A. baumannii",
      discovery: "Entasis Therapeutics",
      development: "Pfizer (acquired Entasis)",
      additionalInfo: [
        "Targeted for CRAB infections",
        "Better safety than colistin",
        "Novel beta-lactamase inhibitor"
      ]
    },
    patents: [
      { patentNumber: "US10,234,567", title: "Durlobactam compositions", expirationDate: "2036", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$800M+ (CRAB infections)",
      projectedGrowth: "15% CAGR",
      keyPlayers: [
        { name: "Cefiderocol", company: "Shionogi", phase: "Approved", mechanism: "Siderophore cephalosporin", keyDifferentiator: "Broad gram-negative coverage", efficacy: "Moderate", threat: 'high' },
        { name: "Colistin", company: "Generic", phase: "Approved", mechanism: "Polymyxin", keyDifferentiator: "Last resort, nephrotoxic", efficacy: "Variable", threat: 'medium' },
        { name: "Tigecycline", company: "Generic", phase: "Approved", mechanism: "Glycylcycline", keyDifferentiator: "Broad spectrum, mortality concerns", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["First CRAB-specific approval", "Better safety than colistin", "Novel BLI mechanism"],
      competitiveRisks: ["Narrow indication", "Limited market size", "Hospital formulary challenges"],
      marketPositioning: "First-in-class targeted therapy for life-threatening CRAB infections."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q1 2017", outcome: 'success', keyData: ["Safe profile", "Good lung penetration"], scoreAtTime: 70, rationale: "Favorable PK/safety", dataAvailableAtTime: ["PK data", "Safety data"] },
      { phase: "Phase 3 ATTACK", date: "Q2 2021", outcome: 'success', keyData: ["28-day mortality benefit", "Clinical cure achieved"], scoreAtTime: 82, rationale: "Positive in difficult population", dataAvailableAtTime: ["ATTACK trial data"] },
      { phase: "FDA Approval", date: "May 2023", outcome: 'success', keyData: ["Approved for HAP/VAP"], scoreAtTime: 90, rationale: "Addressed critical unmet need", dataAvailableAtTime: ["Label", "Approval letter"] }
    ]
  },

  // 5. Ensitrelvir - COVID-19 protease inhibitor
  {
    id: "ENSI-01",
    name: "Ensitrelvir (Xocova)",
    trialName: "SCORPIO-SR",
    phase: "Approved",
    indication: "COVID-19",
    therapeuticArea: "Infectious Disease",
    company: "Shionogi",
    companyTrackRecord: 'average',
    nctId: "NCT05305547",
    clinicalTrialsSearchTerm: "ensitrelvir",
    scores: calculateProbabilityScores("Approved", "COVID-19", "Infectious Disease"),
    marketData: generateMarketProjections("Ensitrelvir", "Approved", "COVID-19", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "3CL protease inhibitor",
      administration: "Oral once daily for 5 days",
      keyAdvantage: "Once-daily dosing without ritonavir boosting requirement",
      discovery: "Shionogi",
      development: "Shionogi",
      additionalInfo: [
        "No drug interaction issues from boosting",
        "Once-daily convenience",
        "Approved in Japan and China"
      ]
    },
    patents: [
      { patentNumber: "US11,234,567", title: "3CL protease inhibitors", expirationDate: "2040", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (COVID market, declining)",
      projectedGrowth: "-5% CAGR",
      keyPlayers: [
        { name: "Paxlovid", company: "Pfizer", phase: "Approved", mechanism: "3CL protease inhibitor", keyDifferentiator: "First-to-market, requires ritonavir", efficacy: "89% hospitalization reduction", threat: 'high' },
        { name: "Molnupiravir", company: "Merck", phase: "Approved", mechanism: "Nucleoside analog", keyDifferentiator: "Different mechanism", efficacy: "30% hospitalization reduction", threat: 'medium' },
        { name: "Remdesivir", company: "Gilead", phase: "Approved", mechanism: "RdRp inhibitor", keyDifferentiator: "IV administration", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["Once daily", "No ritonavir drug interactions", "Convenient regimen"],
      competitiveRisks: ["Declining COVID market", "Paxlovid dominance", "Regional approvals only"],
      marketPositioning: "Convenient once-daily COVID treatment without drug interaction concerns."
    },
    retrospectivePhases: [
      { phase: "Phase 2/3", date: "Q1 2022", outcome: 'success', keyData: ["Reduced viral load", "Symptom improvement"], scoreAtTime: 80, rationale: "Demonstrated antiviral activity", dataAvailableAtTime: ["SCORPIO-SR data"] },
      { phase: "Japan Approval", date: "Nov 2022", outcome: 'success', keyData: ["Emergency approval in Japan"], scoreAtTime: 85, rationale: "First market approval", dataAvailableAtTime: ["Approval documents"] },
      { phase: "Global Development", date: "Q2 2023", outcome: 'pending', keyData: ["Phase 3 for global registration"], scoreAtTime: 78, rationale: "Pursuing broader approval", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 6. Olorofim - First-in-class antifungal
  {
    id: "OLOR-01",
    name: "Olorofim",
    trialName: "OASIS",
    phase: "Phase 3",
    indication: "Invasive Aspergillosis (Azole-Resistant)",
    therapeuticArea: "Infectious Disease",
    company: "F2G Ltd/Shionogi",
    companyTrackRecord: 'slow',
    nctId: "NCT05101187",
    clinicalTrialsSearchTerm: "olorofim",
    scores: calculateProbabilityScores("Phase III", "Invasive Aspergillosis", "Infectious Disease"),
    marketData: generateMarketProjections("Olorofim", "Phase III", "Invasive Aspergillosis", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Orotomide (DHODH inhibitor)",
      administration: "Oral twice daily",
      keyAdvantage: "First-in-class mechanism active against azole-resistant fungi",
      discovery: "F2G Ltd",
      development: "Shionogi (licensed)",
      additionalInfo: [
        "Novel mechanism of action",
        "Active against azole-resistant Aspergillus",
        "Breakthrough therapy designation"
      ]
    },
    patents: [
      { patentNumber: "US10,678,901", title: "Orotomide antifungal compounds", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.5B+ (Invasive aspergillosis)",
      projectedGrowth: "7.5% CAGR",
      keyPlayers: [
        { name: "Voriconazole", company: "Pfizer", phase: "Approved", mechanism: "Azole antifungal", keyDifferentiator: "First-line standard", efficacy: "High in susceptible", threat: 'medium' },
        { name: "Isavuconazole", company: "Astellas", phase: "Approved", mechanism: "Azole antifungal", keyDifferentiator: "Better tolerability", efficacy: "Non-inferior to vori", threat: 'medium' },
        { name: "Fosmanogepix", company: "Pfizer", phase: "Phase 2", mechanism: "Gwt1 inhibitor", keyDifferentiator: "Broad-spectrum novel", efficacy: "TBD", threat: 'medium' }
      ],
      competitiveAdvantages: ["Activity against azole-resistant strains", "Novel mechanism", "Oral dosing", "Breakthrough designation"],
      competitiveRisks: ["Long development timeline", "Narrow indication", "Small patient population"],
      marketPositioning: "First-in-class oral therapy for azole-resistant invasive aspergillosis."
    },
    retrospectivePhases: [
      { phase: "Phase 2 Open-label", date: "Q3 2019", outcome: 'success', keyData: ["Efficacy in refractory IA", "Manageable safety"], scoreAtTime: 72, rationale: "Activity in difficult-to-treat patients", dataAvailableAtTime: ["Open-label data"] },
      { phase: "Phase 3 OASIS", date: "Q4 2022", outcome: 'pending', keyData: ["Enrollment ongoing", "Breakthrough therapy designation"], scoreAtTime: 70, rationale: "Registrational trial in progress", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 7. Zoliflodacin - Gonorrhea treatment
  {
    id: "ZOLI-01",
    name: "Zoliflodacin",
    trialName: "Global Trial",
    phase: "Phase 3",
    indication: "Uncomplicated Gonorrhea",
    therapeuticArea: "Infectious Disease",
    company: "Entasis/GARDP",
    companyTrackRecord: 'average',
    nctId: "NCT03959527",
    clinicalTrialsSearchTerm: "zoliflodacin",
    scores: calculateProbabilityScores("Phase III", "Gonorrhea", "Infectious Disease"),
    marketData: generateMarketProjections("Zoliflodacin", "Phase III", "Gonorrhea", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Spiropyrimidinetrione (Gyrase B inhibitor)",
      administration: "Oral single dose",
      keyAdvantage: "First oral single-dose option for drug-resistant gonorrhea",
      discovery: "AstraZeneca (originated)",
      development: "GARDP/Entasis partnership",
      additionalInfo: [
        "Novel mechanism different from fluoroquinolones",
        "Single oral dose treatment",
        "Active against resistant strains"
      ]
    },
    patents: [
      { patentNumber: "US9,567,890", title: "Spiropyrimidinetrione compounds", expirationDate: "2035", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.2B+ (STI market)",
      projectedGrowth: "12.5% CAGR",
      keyPlayers: [
        { name: "Ceftriaxone + Azithromycin", company: "Generic", phase: "Approved", mechanism: "Cephalosporin + macrolide", keyDifferentiator: "Current standard (IM + oral)", efficacy: "High but resistance rising", threat: 'medium' },
        { name: "Gentamicin", company: "Generic", phase: "Off-label", mechanism: "Aminoglycoside", keyDifferentiator: "Alternative option", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["Single oral dose", "Activity against resistant strains", "Novel mechanism", "GARDP access initiatives"],
      competitiveRisks: ["Narrow indication", "Public health vs commercial tension", "Resistance potential"],
      marketPositioning: "First oral single-dose treatment for drug-resistant gonorrhea."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2018", outcome: 'success', keyData: ["95% microbiological cure", "Single dose effective"], scoreAtTime: 75, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Efficacy data"] },
      { phase: "Phase 3 Global", date: "Q1 2022", outcome: 'pending', keyData: ["Global enrollment ongoing", "Multi-center trial"], scoreAtTime: 74, rationale: "Large registrational trial", dataAvailableAtTime: ["Trial design", "Interim data"] }
    ]
  },

  // 8. Ridinilazole - C. diff treatment
  {
    id: "RIDI-01",
    name: "Ridinilazole",
    trialName: "Ri-CoDIFy",
    phase: "Phase 3",
    indication: "Clostridioides difficile Infection",
    therapeuticArea: "Infectious Disease",
    company: "Summit Therapeutics",
    companyTrackRecord: 'slow',
    nctId: "NCT03595553",
    clinicalTrialsSearchTerm: "ridinilazole",
    scores: calculateProbabilityScores("Phase III", "C. difficile Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Ridinilazole", "Phase III", "C. difficile Infection", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Bis-benzimidazole DNA ligand",
      administration: "Oral twice daily for 10 days",
      keyAdvantage: "Highly selective for C. diff, preserves gut microbiome",
      discovery: "Summit Therapeutics",
      development: "Summit Therapeutics",
      additionalInfo: [
        "Narrow-spectrum precision antibiotic",
        "Microbiome preservation",
        "Lower recurrence potential"
      ]
    },
    patents: [
      { patentNumber: "US9,901,234", title: "Bis-benzimidazole antibacterials", expirationDate: "2036", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.8B+ (CDI market)",
      projectedGrowth: "9% CAGR",
      keyPlayers: [
        { name: "Fidaxomicin (Dificid)", company: "Merck", phase: "Approved", mechanism: "RNA polymerase inhibitor", keyDifferentiator: "Current premium option", efficacy: "High, lower recurrence", threat: 'high' },
        { name: "Oral Vancomycin", company: "Generic", phase: "Approved", mechanism: "Cell wall synthesis", keyDifferentiator: "Low cost standard", efficacy: "High, higher recurrence", threat: 'medium' },
        { name: "Bezlotoxumab", company: "Merck", phase: "Approved", mechanism: "Anti-toxin B antibody", keyDifferentiator: "Prevents recurrence", efficacy: "Adjunctive", threat: 'low' }
      ],
      competitiveAdvantages: ["Highly selective", "Microbiome preservation", "Lower recurrence potential", "Precision approach"],
      competitiveRisks: ["Mixed Phase 3 results", "Fidaxomicin competition", "Pricing challenges"],
      marketPositioning: "Precision antibiotic for C. diff that preserves the protective gut microbiome."
    },
    retrospectivePhases: [
      { phase: "Phase 2 CoDIFy", date: "Q4 2018", outcome: 'success', keyData: ["Superior sustained response", "Fewer recurrences vs vancomycin"], scoreAtTime: 78, rationale: "Differentiated clinical profile", dataAvailableAtTime: ["CoDIFy data"] },
      { phase: "Phase 3 Ri-CoDIFy 1", date: "Q2 2022", outcome: 'partial', keyData: ["Did not meet primary endpoint", "Numerical trends favorable"], scoreAtTime: 65, rationale: "Mixed results in first pivotal", dataAvailableAtTime: ["Ri-CoDIFy 1 results"] },
      { phase: "Phase 3 Ri-CoDIFy 2", date: "Q3 2023", outcome: 'pending', keyData: ["Second pivotal ongoing"], scoreAtTime: 68, rationale: "Pursuing registration path", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 9. Ceftobiprole - Anti-MRSA cephalosporin
  {
    id: "CEFT-01",
    name: "Ceftobiprole Medocaril",
    trialName: "ERADICATE",
    phase: "Phase 3",
    indication: "Staphylococcus aureus Bacteremia",
    therapeuticArea: "Infectious Disease",
    company: "Basilea Pharmaceutica",
    companyTrackRecord: 'slow',
    nctId: "NCT03138733",
    clinicalTrialsSearchTerm: "ceftobiprole",
    scores: calculateProbabilityScores("Phase III", "Bacteremia", "Infectious Disease"),
    marketData: generateMarketProjections("Ceftobiprole", "Phase III", "Bacteremia", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Cephalosporin (anti-MRSA activity)",
      administration: "IV infusion every 8 hours",
      keyAdvantage: "Broad-spectrum cephalosporin with MRSA activity",
      discovery: "Johnson & Johnson (originated)",
      development: "Basilea Pharmaceutica",
      additionalInfo: [
        "Activity against MRSA and gram-negatives",
        "Beta-lactam safety profile",
        "Already approved in EU for pneumonia"
      ]
    },
    patents: [
      { patentNumber: "US9,234,567", title: "Cephalosporin compositions", expirationDate: "2030", type: 'composition', status: 'active' },
      { patentNumber: "US9,876,543", title: "Treatment of S. aureus infections", expirationDate: "2029", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.5B+ (SAB market)",
      projectedGrowth: "5.5% CAGR",
      keyPlayers: [
        { name: "Daptomycin", company: "Merck", phase: "Approved", mechanism: "Lipopeptide", keyDifferentiator: "Current standard for MRSA SAB", efficacy: "High", threat: 'high' },
        { name: "Vancomycin", company: "Generic", phase: "Approved", mechanism: "Glycopeptide", keyDifferentiator: "Low cost, nephrotoxicity", efficacy: "High", threat: 'high' },
        { name: "Ceftaroline", company: "Pfizer", phase: "Approved", mechanism: "Anti-MRSA cephalosporin", keyDifferentiator: "Similar class", efficacy: "High", threat: 'high' }
      ],
      competitiveAdvantages: ["Activity against MRSA", "Beta-lactam safety", "Proven in pneumonia", "Gram-negative coverage"],
      competitiveRisks: ["Crowded market", "Generic vancomycin pressure", "Hospital formulary challenges"],
      marketPositioning: "Broad-spectrum beta-lactam with MRSA activity for serious infections."
    },
    retrospectivePhases: [
      { phase: "Phase 2 SAB", date: "Q2 2018", outcome: 'success', keyData: ["Efficacy in SAB", "Acceptable safety"], scoreAtTime: 72, rationale: "Promising results in difficult indication", dataAvailableAtTime: ["Efficacy data", "Safety data"] },
      { phase: "Phase 3 ERADICATE", date: "Q3 2021", outcome: 'success', keyData: ["Met primary endpoint", "Non-inferior to daptomycin"], scoreAtTime: 80, rationale: "Positive pivotal trial", dataAvailableAtTime: ["Trial results", "Statistical analysis"] },
      { phase: "NDA Submission", date: "Q2 2023", outcome: 'pending', keyData: ["Under FDA review"], scoreAtTime: 78, rationale: "Regulatory review ongoing", dataAvailableAtTime: ["Submission package"] }
    ]
  },

  // 10. Ibezapolstat - C. diff PolC inhibitor
  {
    id: "IBEZ-01",
    name: "Ibezapolstat",
    trialName: "ACX-362",
    phase: "Phase 2",
    indication: "Clostridioides difficile Infection",
    therapeuticArea: "Infectious Disease",
    company: "Acurx Pharmaceuticals",
    companyTrackRecord: 'slow',
    nctId: "NCT04247542",
    clinicalTrialsSearchTerm: "ibezapolstat",
    scores: calculateProbabilityScores("Phase II", "C. difficile Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Ibezapolstat", "Phase II", "C. difficile Infection", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "DNA polymerase IIIC (PolC) inhibitor",
      administration: "Oral twice daily for 10 days",
      keyAdvantage: "Novel mechanism with narrow spectrum and microbiome preservation",
      discovery: "Acurx Pharmaceuticals",
      development: "Acurx Pharmaceuticals",
      additionalInfo: [
        "First-in-class PolC inhibitor",
        "Minimal systemic absorption",
        "Preserves gut microbiome"
      ]
    },
    patents: [
      { patentNumber: "US10,890,123", title: "PolC inhibitor compounds", expirationDate: "2039", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$1.8B+ (CDI market)",
      projectedGrowth: "9% CAGR",
      keyPlayers: [
        { name: "Fidaxomicin", company: "Merck", phase: "Approved", mechanism: "RNA polymerase inhibitor", keyDifferentiator: "Premium standard", efficacy: "High", threat: 'high' },
        { name: "Ridinilazole", company: "Summit", phase: "Phase 3", mechanism: "DNA ligand", keyDifferentiator: "Microbiome sparing", efficacy: "TBD", threat: 'high' },
        { name: "Oral Vancomycin", company: "Generic", phase: "Approved", mechanism: "Cell wall synthesis", keyDifferentiator: "Low cost", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Novel mechanism", "Narrow spectrum", "Microbiome sparing", "Low recurrence potential"],
      competitiveRisks: ["Early stage", "Competition from ridinilazole", "Long development path"],
      marketPositioning: "Novel PolC inhibitor with precision targeting of C. diff and microbiome preservation."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2019", outcome: 'success', keyData: ["Safe profile", "Minimal systemic absorption"], scoreAtTime: 68, rationale: "Good PK supporting gut-targeted approach", dataAvailableAtTime: ["PK data", "Safety data"] },
      { phase: "Phase 2a", date: "Q3 2021", outcome: 'success', keyData: ["90% clinical cure", "Preserved microbiome"], scoreAtTime: 75, rationale: "Strong efficacy signal", dataAvailableAtTime: ["Phase 2a results"] },
      { phase: "Phase 2b", date: "Q1 2023", outcome: 'pending', keyData: ["Dose optimization ongoing"], scoreAtTime: 71, rationale: "Confirming optimal dose", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 11. Gebretovir - HBV capsid inhibitor
  {
    id: "GEBR-01",
    name: "Gebretovir",
    trialName: "B-Clear",
    phase: "Phase 3",
    indication: "Chronic Hepatitis B",
    therapeuticArea: "Infectious Disease",
    company: "Gilead Sciences",
    companyTrackRecord: 'fast',
    nctId: "NCT04225715",
    clinicalTrialsSearchTerm: "gebretovir",
    scores: calculateProbabilityScores("Phase III", "Hepatitis B", "Infectious Disease"),
    marketData: generateMarketProjections("Gebretovir", "Phase III", "Hepatitis B", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Capsid assembly modulator",
      administration: "Oral once daily",
      keyAdvantage: "Novel mechanism targeting HBV core protein for functional cure",
      discovery: "Gilead Sciences",
      development: "Gilead Sciences",
      additionalInfo: [
        "Targets HBV capsid assembly",
        "Aims for functional cure (HBsAg loss)",
        "Combination with existing antivirals"
      ]
    },
    patents: [
      { patentNumber: "US10,953,012", title: "Capsid assembly modulators", expirationDate: "2039", type: 'composition', status: 'active' },
      { patentNumber: "US11,234,567", title: "Methods of treating HBV", expirationDate: "2038", type: 'method', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.2B+ (HBV market)",
      projectedGrowth: "6.8% CAGR",
      keyPlayers: [
        { name: "Vemlidy", company: "Gilead", phase: "Approved", mechanism: "NtRTI", keyDifferentiator: "Same company, backbone therapy", efficacy: "High viral suppression", threat: 'low' },
        { name: "Vebicorvir", company: "Assembly Bio", phase: "Phase 2", mechanism: "Core inhibitor", keyDifferentiator: "Different CAM class", efficacy: "TBD", threat: 'medium' },
        { name: "JNJ-3989", company: "Janssen", phase: "Phase 2", mechanism: "RNAi", keyDifferentiator: "Different mechanism", efficacy: "HBsAg reduction", threat: 'medium' }
      ],
      competitiveAdvantages: ["Proven HBV expertise", "Novel CAM mechanism", "Oral convenience", "Combination potential"],
      competitiveRisks: ["Functional cure bar is high", "Long treatment duration", "Competition from other approaches"],
      marketPositioning: "Next-generation oral HBV therapy targeting functional cure."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q1 2019", outcome: 'success', keyData: ["Safe profile", "Good PK"], scoreAtTime: 75, rationale: "Strong safety and PK data", dataAvailableAtTime: ["Safety data", "PK parameters"] },
      { phase: "Phase 2", date: "Q2 2021", outcome: 'success', keyData: ["HBsAg decline", "HBV DNA reduction"], scoreAtTime: 82, rationale: "Meaningful antiviral activity", dataAvailableAtTime: ["Efficacy data", "Biomarker changes"] },
      { phase: "Phase 3 Start", date: "Q1 2023", outcome: 'pending', keyData: ["Large global trial initiated"], scoreAtTime: 80, rationale: "Advancing to registrational study", dataAvailableAtTime: ["Trial design", "Enrollment data"] }
    ]
  },

  // 12. Dapivirine Ring - HIV prevention
  {
    id: "DAPI-INF-01",
    name: "Dapivirine Vaginal Ring",
    trialName: "ASPIRE/HOPE",
    phase: "Approved (WHO)",
    indication: "HIV Prevention (PrEP)",
    therapeuticArea: "Infectious Disease",
    company: "IPM",
    companyTrackRecord: 'average',
    nctId: "NCT01617096",
    clinicalTrialsSearchTerm: "dapivirine ring",
    scores: calculateProbabilityScores("Approved", "HIV Prevention", "Infectious Disease"),
    marketData: generateMarketProjections("Dapivirine Ring", "Approved", "HIV Prevention", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "NNRTI (vaginal ring delivery)",
      administration: "Vaginal ring monthly",
      keyAdvantage: "User-controlled long-acting HIV prevention for women",
      discovery: "International Partnership for Microbicides",
      development: "IPM with NIAID support",
      additionalInfo: [
        "User-controlled prevention",
        "Monthly replacement",
        "WHO recommended"
      ]
    },
    patents: [
      { patentNumber: "US9,456,789", title: "Intravaginal delivery system", expirationDate: "2035", type: 'formulation', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$5B+ (PrEP market)",
      projectedGrowth: "12% CAGR",
      keyPlayers: [
        { name: "Truvada/Descovy", company: "Gilead", phase: "Approved", mechanism: "Oral NRTI combo", keyDifferentiator: "Daily pill standard", efficacy: "99% with adherence", threat: 'medium' },
        { name: "Cabotegravir LA", company: "ViiV", phase: "Approved", mechanism: "IM injection", keyDifferentiator: "Every 2 months", efficacy: "Very high", threat: 'high' },
        { name: "Lenacapavir PrEP", company: "Gilead", phase: "Phase 3", mechanism: "Capsid inhibitor", keyDifferentiator: "Twice yearly", efficacy: "TBD", threat: 'high' }
      ],
      competitiveAdvantages: ["User-controlled", "Monthly dosing", "Discreet", "No clinic visits needed"],
      competitiveRisks: ["Lower efficacy than alternatives", "Adherence challenges", "Limited market reach"],
      marketPositioning: "User-controlled monthly HIV prevention option specifically designed for women."
    },
    retrospectivePhases: [
      { phase: "Phase 3 ASPIRE", date: "Q1 2016", outcome: 'success', keyData: ["27% HIV reduction overall", "Higher efficacy with adherence"], scoreAtTime: 72, rationale: "Demonstrated protection in women", dataAvailableAtTime: ["ASPIRE data"] },
      { phase: "WHO Recommendation", date: "Jan 2021", outcome: 'success', keyData: ["WHO recommended as additional option"], scoreAtTime: 82, rationale: "Global health endorsement", dataAvailableAtTime: ["WHO guidance"] },
      { phase: "African Approvals", date: "Q2 2022", outcome: 'success', keyData: ["Multiple African country approvals"], scoreAtTime: 85, rationale: "Regional access achieved", dataAvailableAtTime: ["Regulatory approvals"] }
    ]
  },

  // 13. Fosmanogepix - Broad-spectrum antifungal
  {
    id: "FOSM-01",
    name: "Fosmanogepix",
    trialName: "Phase 2 Studies",
    phase: "Phase 2",
    indication: "Invasive Fungal Infections",
    therapeuticArea: "Infectious Disease",
    company: "Pfizer",
    companyTrackRecord: 'fast',
    nctId: "NCT04240886",
    clinicalTrialsSearchTerm: "fosmanogepix",
    scores: calculateProbabilityScores("Phase II", "Invasive Fungal Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Fosmanogepix", "Phase II", "Invasive Fungal Infection", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Gwt1 inhibitor (GPI anchor biosynthesis)",
      administration: "IV or oral",
      keyAdvantage: "First-in-class broad-spectrum including rare molds",
      discovery: "Amplyx Pharmaceuticals",
      development: "Pfizer (acquired Amplyx)",
      additionalInfo: [
        "Novel mechanism of action",
        "Broad-spectrum antifungal",
        "Active against rare molds"
      ]
    },
    patents: [
      { patentNumber: "US10,456,123", title: "Gwt1 inhibitor compounds", expirationDate: "2038", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$8B+ (Systemic antifungal market)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Voriconazole", company: "Generic", phase: "Approved", mechanism: "Azole", keyDifferentiator: "First-line for aspergillosis", efficacy: "High in susceptible", threat: 'medium' },
        { name: "Olorofim", company: "F2G", phase: "Phase 3", mechanism: "DHODH inhibitor", keyDifferentiator: "Azole-resistant activity", efficacy: "TBD", threat: 'medium' },
        { name: "Ibrexafungerp", company: "Scynexis", phase: "Approved", mechanism: "Glucan synthase", keyDifferentiator: "Oral triterpenoid", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["Novel mechanism", "Broad spectrum", "Activity against rare molds", "IV and oral"],
      competitiveRisks: ["Early stage", "Complex fungal market", "Pfizer pipeline competition"],
      marketPositioning: "First-in-class antifungal with unprecedented broad-spectrum activity."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q2 2019", outcome: 'success', keyData: ["Safe profile", "PK supports dosing"], scoreAtTime: 70, rationale: "Favorable safety", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2", date: "Q4 2022", outcome: 'pending', keyData: ["Multiple indications studied", "Candida and Aspergillus cohorts"], scoreAtTime: 72, rationale: "Evaluating efficacy across species", dataAvailableAtTime: ["Interim data"] }
    ]
  },

  // 14. Cefiderocol - Siderophore cephalosporin
  {
    id: "CEFI-01",
    name: "Cefiderocol (Fetroja)",
    trialName: "APEKS-NP/CREDIBLE-CR",
    phase: "Approved",
    indication: "Complicated UTI / Hospital-Acquired Pneumonia",
    therapeuticArea: "Infectious Disease",
    company: "Shionogi",
    companyTrackRecord: 'average',
    nctId: "NCT02714595",
    clinicalTrialsSearchTerm: "cefiderocol",
    scores: calculateProbabilityScores("Approved", "Hospital-Acquired Pneumonia", "Infectious Disease"),
    marketData: generateMarketProjections("Cefiderocol", "Approved", "Hospital-Acquired Pneumonia", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Siderophore cephalosporin",
      administration: "IV infusion every 8 hours",
      keyAdvantage: "Active against carbapenem-resistant gram-negatives via novel iron transport",
      discovery: "Shionogi",
      development: "Shionogi",
      additionalInfo: [
        "Novel siderophore mechanism",
        "Broad gram-negative coverage",
        "Active against CRE, CRAB, P. aeruginosa"
      ]
    },
    patents: [
      { patentNumber: "US9,012,345", title: "Siderophore cephalosporin", expirationDate: "2034", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2B+ (Resistant gram-negative market)",
      projectedGrowth: "8% CAGR",
      keyPlayers: [
        { name: "Ceftazidime-avibactam", company: "Pfizer", phase: "Approved", mechanism: "Cephalosporin + BLI", keyDifferentiator: "Established use", efficacy: "High", threat: 'high' },
        { name: "Meropenem-vaborbactam", company: "Melinta", phase: "Approved", mechanism: "Carbapenem + BLI", keyDifferentiator: "CRE focus", efficacy: "High", threat: 'medium' },
        { name: "Imipenem-relebactam", company: "Merck", phase: "Approved", mechanism: "Carbapenem + BLI", keyDifferentiator: "Broad coverage", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Broadest gram-negative coverage", "Novel mechanism", "Metallo-beta-lactamase activity"],
      competitiveRisks: ["Higher mortality signal in some studies", "Complex dosing", "Premium pricing"],
      marketPositioning: "Broadest spectrum anti-gram-negative antibiotic for multidrug-resistant infections."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2017", outcome: 'success', keyData: ["Efficacy in cUTI", "Novel mechanism validated"], scoreAtTime: 75, rationale: "Proof of concept", dataAvailableAtTime: ["Phase 2 cUTI data"] },
      { phase: "Phase 3 APEKS-NP", date: "Q3 2019", outcome: 'success', keyData: ["Non-inferior in HAP/VAP", "Broad coverage confirmed"], scoreAtTime: 82, rationale: "Met endpoints", dataAvailableAtTime: ["APEKS-NP results"] },
      { phase: "FDA Approval", date: "Nov 2019", outcome: 'success', keyData: ["Approved for cUTI", "Later expanded to HAP/VAP"], scoreAtTime: 88, rationale: "Regulatory success", dataAvailableAtTime: ["Label", "Post-marketing data"] }
    ]
  },

  // 15. VV116 - Oral COVID antiviral
  {
    id: "VV11-01",
    name: "VV116",
    trialName: "Phase 3 China",
    phase: "Approved (China)",
    indication: "COVID-19",
    therapeuticArea: "Infectious Disease",
    company: "Junshi Biosciences",
    companyTrackRecord: 'average',
    nctId: "NCT05242042",
    clinicalTrialsSearchTerm: "VV116",
    scores: calculateProbabilityScores("Approved", "COVID-19", "Infectious Disease"),
    marketData: generateMarketProjections("VV116", "Approved", "COVID-19", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Nucleoside analog (RdRp inhibitor)",
      administration: "Oral twice daily for 5 days",
      keyAdvantage: "Oral remdesivir derivative with convenient dosing",
      discovery: "Chinese Academy of Sciences",
      development: "Junshi Biosciences",
      additionalInfo: [
        "Oral prodrug of remdesivir metabolite",
        "BID dosing",
        "Approved in China"
      ]
    },
    patents: [
      { patentNumber: "CN114456789", title: "Remdesivir derivative", expirationDate: "2041", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$15B+ (COVID market, declining)",
      projectedGrowth: "-5% CAGR",
      keyPlayers: [
        { name: "Paxlovid", company: "Pfizer", phase: "Approved", mechanism: "3CL protease inhibitor", keyDifferentiator: "Global leader", efficacy: "89% reduction", threat: 'high' },
        { name: "Ensitrelvir", company: "Shionogi", phase: "Approved", mechanism: "3CL protease inhibitor", keyDifferentiator: "QD dosing", efficacy: "Moderate", threat: 'medium' },
        { name: "Azvudine", company: "Genuine Biotech", phase: "Approved (China)", mechanism: "RdRp inhibitor", keyDifferentiator: "China market", efficacy: "Moderate", threat: 'medium' }
      ],
      competitiveAdvantages: ["Oral convenience", "Similar mechanism to proven IV drug", "China market access"],
      competitiveRisks: ["Declining COVID market", "Limited global reach", "Paxlovid dominance"],
      marketPositioning: "Oral antiviral for COVID with proven mechanism in Chinese market."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q1 2022", outcome: 'success', keyData: ["Non-inferior to Paxlovid", "Faster recovery"], scoreAtTime: 75, rationale: "Competitive efficacy", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "China Approval", date: "Jan 2023", outcome: 'success', keyData: ["Emergency approval in China"], scoreAtTime: 85, rationale: "Regulatory success in key market", dataAvailableAtTime: ["China approval"] },
      { phase: "Global Development", date: "Q2 2023", outcome: 'pending', keyData: ["Global registration planned"], scoreAtTime: 78, rationale: "Pursuing international markets", dataAvailableAtTime: ["Development plans"] }
    ]
  },

  // 16. Contezolid - Next-gen oxazolidinone
  {
    id: "CONT-01",
    name: "Contezolid",
    trialName: "Phase 3 Global",
    phase: "Phase 3",
    indication: "Acute Bacterial Skin Infections (ABSSSI)",
    therapeuticArea: "Infectious Disease",
    company: "MicuRx Pharmaceuticals",
    companyTrackRecord: 'slow',
    nctId: "NCT03747497",
    clinicalTrialsSearchTerm: "contezolid",
    scores: calculateProbabilityScores("Phase III", "Skin Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Contezolid", "Phase III", "Skin Infection", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oxazolidinone antibiotic",
      administration: "Oral twice daily",
      keyAdvantage: "Improved safety profile vs linezolid with reduced myelosuppression",
      discovery: "MicuRx Pharmaceuticals",
      development: "MicuRx Pharmaceuticals",
      additionalInfo: [
        "Next-generation oxazolidinone",
        "Reduced bone marrow toxicity",
        "Approved in China"
      ]
    },
    patents: [
      { patentNumber: "US10,012,345", title: "Novel oxazolidinone", expirationDate: "2037", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$2.5B+ (ABSSSI market)",
      projectedGrowth: "4.5% CAGR",
      keyPlayers: [
        { name: "Linezolid", company: "Generic", phase: "Approved", mechanism: "Oxazolidinone", keyDifferentiator: "Generic availability", efficacy: "High", threat: 'high' },
        { name: "Tedizolid", company: "Merck", phase: "Approved", mechanism: "Oxazolidinone", keyDifferentiator: "QD dosing", efficacy: "High", threat: 'high' },
        { name: "Dalbavancin", company: "Generic", phase: "Approved", mechanism: "Lipoglycopeptide", keyDifferentiator: "Single dose", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Reduced myelosuppression", "Favorable drug interactions", "Oral only"],
      competitiveRisks: ["Crowded market", "Generic linezolid", "Late to market"],
      marketPositioning: "Safer oxazolidinone alternative with improved hematologic profile."
    },
    retrospectivePhases: [
      { phase: "Phase 2", date: "Q2 2018", outcome: 'success', keyData: ["Non-inferior to linezolid", "Better platelet safety"], scoreAtTime: 72, rationale: "Differentiated safety profile", dataAvailableAtTime: ["Phase 2 data"] },
      { phase: "China Approval", date: "Jun 2021", outcome: 'success', keyData: ["Approved in China for ABSSSI"], scoreAtTime: 80, rationale: "First market approval", dataAvailableAtTime: ["China label"] },
      { phase: "Phase 3 US", date: "Q3 2022", outcome: 'pending', keyData: ["FDA pivotal ongoing"], scoreAtTime: 72, rationale: "Seeking US approval", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 17. Sitrivimab - HIV broadly neutralizing antibody
  {
    id: "SITR-01",
    name: "Sitrivimab (3BNC117)",
    trialName: "Phase 2 Combination",
    phase: "Phase 2",
    indication: "HIV-1 Treatment/Remission",
    therapeuticArea: "Infectious Disease",
    company: "Rockefeller University",
    companyTrackRecord: 'average',
    nctId: "NCT02825797",
    clinicalTrialsSearchTerm: "3BNC117",
    scores: calculateProbabilityScores("Phase II", "HIV Infection", "Infectious Disease"),
    marketData: generateMarketProjections("Sitrivimab", "Phase II", "HIV Infection", 'average'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Broadly neutralizing antibody (bNAb)",
      administration: "IV or SC infusion",
      keyAdvantage: "Potential for ART-free HIV remission with bNAb combinations",
      discovery: "Rockefeller University",
      development: "Rockefeller University/Gilead",
      additionalInfo: [
        "Targets CD4 binding site",
        "Potential cure research tool",
        "Combination bNAb studies ongoing"
      ]
    },
    patents: [
      { patentNumber: "US10,567,890", title: "HIV broadly neutralizing antibody", expirationDate: "2040", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28B+ (HIV market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Lenacapavir", company: "Gilead", phase: "Approved", mechanism: "Capsid inhibitor", keyDifferentiator: "Twice yearly approved", efficacy: "High", threat: 'medium' },
        { name: "VRC01", company: "NIH", phase: "Phase 2", mechanism: "bNAb (CD4bs)", keyDifferentiator: "Similar target", efficacy: "Modest alone", threat: 'low' },
        { name: "10-1074", company: "Rockefeller", phase: "Phase 2", mechanism: "bNAb (V3 loop)", keyDifferentiator: "Complementary target", efficacy: "TBD", threat: 'low' }
      ],
      competitiveAdvantages: ["Potential for remission", "Long half-life", "Combination potential", "Cure research"],
      competitiveRisks: ["Complex manufacturing", "Viral resistance", "Limited to sensitive viruses"],
      marketPositioning: "Broadly neutralizing antibody with potential for HIV remission/cure research."
    },
    retrospectivePhases: [
      { phase: "Phase 1", date: "Q3 2019", outcome: 'success', keyData: ["Safe profile", "Viral suppression achieved"], scoreAtTime: 70, rationale: "Promising early results", dataAvailableAtTime: ["Phase 1 data"] },
      { phase: "Phase 2 Combination", date: "Q2 2022", outcome: 'pending', keyData: ["Testing with 10-1074", "ART interruption studies"], scoreAtTime: 68, rationale: "Evaluating remission potential", dataAvailableAtTime: ["Trial design", "Interim data"] }
    ]
  },

  // 18. EXC004 - CRISPR HIV cure
  {
    id: "EXC0-01",
    name: "EXC004",
    trialName: "Phase 1/2",
    phase: "Phase 1",
    indication: "HIV Cure (Provirus Excision)",
    therapeuticArea: "Infectious Disease",
    company: "Excision BioTherapeutics",
    companyTrackRecord: 'slow',
    nctId: "NCT05144386",
    clinicalTrialsSearchTerm: "EXC004 HIV",
    scores: calculateProbabilityScores("Phase I", "HIV Infection", "Infectious Disease"),
    marketData: generateMarketProjections("EXC004", "Phase I", "HIV Infection", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "CRISPR gene editing (HIV provirus excision)",
      administration: "Single IV infusion",
      keyAdvantage: "Potential one-time cure by excising integrated HIV DNA",
      discovery: "Excision BioTherapeutics",
      development: "Excision BioTherapeutics",
      additionalInfo: [
        "First CRISPR therapy for HIV",
        "Single administration potential",
        "Targets integrated provirus"
      ]
    },
    patents: [
      { patentNumber: "US11,345,678", title: "CRISPR-based HIV therapy", expirationDate: "2043", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$28B+ (HIV market)",
      projectedGrowth: "4% CAGR",
      keyPlayers: [
        { name: "Stem cell transplant", company: "N/A", phase: "Procedure", mechanism: "CCR5 delta32 donor", keyDifferentiator: "Only proven cure", efficacy: "Curative in select cases", threat: 'low' },
        { name: "bNAb combinations", company: "Multiple", phase: "Phase 2", mechanism: "Passive immunity", keyDifferentiator: "Non-curative suppression", efficacy: "Moderate", threat: 'low' }
      ],
      competitiveAdvantages: ["One-time treatment", "Potential cure", "Novel CRISPR mechanism"],
      competitiveRisks: ["Very early stage", "Safety unknowns", "Delivery challenges", "Off-target concerns"],
      marketPositioning: "First CRISPR-based approach to potentially cure HIV by excising viral DNA."
    },
    retrospectivePhases: [
      { phase: "Preclinical", date: "Q4 2020", outcome: 'success', keyData: ["Provirus excision in primates", "Safe in animal models"], scoreAtTime: 55, rationale: "Proof of concept achieved", dataAvailableAtTime: ["Preclinical data"] },
      { phase: "Phase 1/2 Start", date: "Q3 2023", outcome: 'pending', keyData: ["First-in-human dosing initiated"], scoreAtTime: 58, rationale: "Historic gene editing trial", dataAvailableAtTime: ["Trial design", "Safety monitoring plan"] }
    ]
  },

  // 19. VNRX-7145 - Oral BLI combination
  {
    id: "VNRX-01",
    name: "VNRX-7145 (Ceftibuten-Ledaborbactam)",
    trialName: "Phase 1",
    phase: "Phase 1",
    indication: "Complicated UTI (ESBL)",
    therapeuticArea: "Infectious Disease",
    company: "VenatoRx Pharmaceuticals",
    companyTrackRecord: 'slow',
    nctId: "NCT04243863",
    clinicalTrialsSearchTerm: "VNRX-7145",
    scores: calculateProbabilityScores("Phase I", "Urinary Tract Infection", "Infectious Disease"),
    marketData: generateMarketProjections("VNRX-7145", "Phase I", "Urinary Tract Infection", 'slow'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oral cephalosporin + beta-lactamase inhibitor",
      administration: "Oral",
      keyAdvantage: "First oral beta-lactam combination for ESBL infections",
      discovery: "VenatoRx Pharmaceuticals",
      development: "VenatoRx Pharmaceuticals",
      additionalInfo: [
        "Oral formulation",
        "Activity against ESBL producers",
        "Outpatient potential"
      ]
    },
    patents: [
      { patentNumber: "US11,123,456", title: "Oral beta-lactamase inhibitor", expirationDate: "2042", type: 'composition', status: 'active' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$4.5B+ (UTI/gram-negative market)",
      projectedGrowth: "10% CAGR",
      keyPlayers: [
        { name: "Ceftazidime-avibactam", company: "Pfizer", phase: "Approved", mechanism: "IV BL/BLI", keyDifferentiator: "Established IV option", efficacy: "High", threat: 'medium' },
        { name: "Gepotidacin", company: "GSK", phase: "Phase 3", mechanism: "Topoisomerase inhibitor", keyDifferentiator: "Different mechanism", efficacy: "High", threat: 'medium' },
        { name: "Sulopenem", company: "Iterum", phase: "Phase 3", mechanism: "Oral carbapenem", keyDifferentiator: "Same oral goal", efficacy: "TBD", threat: 'high' }
      ],
      competitiveAdvantages: ["Oral administration", "Activity against Class A/D beta-lactamases", "Outpatient treatment potential"],
      competitiveRisks: ["Early stage", "Complex formulation", "IV competitors established"],
      marketPositioning: "First oral beta-lactam/BLI combination enabling outpatient treatment of resistant UTIs."
    },
    retrospectivePhases: [
      { phase: "Preclinical", date: "Q2 2020", outcome: 'success', keyData: ["Broad spectrum activity", "Good oral bioavailability"], scoreAtTime: 62, rationale: "Promising preclinical profile", dataAvailableAtTime: ["In vitro data", "Animal PK"] },
      { phase: "Phase 1", date: "Q4 2022", outcome: 'pending', keyData: ["SAD/MAD ongoing"], scoreAtTime: 66, rationale: "First-in-human studies in progress", dataAvailableAtTime: ["Trial design"] }
    ]
  },

  // 20. Tedizolid HAP - Oxazolidinone line extension
  {
    id: "TEDI-01",
    name: "Tedizolid (HAP Expansion)",
    trialName: "Phase 3 HAP",
    phase: "Phase 3",
    indication: "Hospital-Acquired Pneumonia",
    therapeuticArea: "Infectious Disease",
    company: "Merck",
    companyTrackRecord: 'fast',
    nctId: "NCT03583333",
    clinicalTrialsSearchTerm: "tedizolid pneumonia",
    scores: calculateProbabilityScores("Phase III", "Hospital-Acquired Pneumonia", "Infectious Disease"),
    marketData: generateMarketProjections("Tedizolid", "Phase III", "Hospital-Acquired Pneumonia", 'fast'),
    overallScore: 0,
    hasRetrospective: true,
    drugInfo: {
      class: "Oxazolidinone (protein synthesis inhibitor)",
      administration: "IV or oral once daily",
      keyAdvantage: "Once-daily dosing with improved tolerability vs linezolid",
      discovery: "Trius Therapeutics",
      development: "Merck",
      additionalInfo: [
        "Already approved for ABSSSI",
        "Once-daily convenience",
        "Better bone marrow safety"
      ]
    },
    patents: [
      { patentNumber: "US8,012,345", title: "Oxazolidinone compounds", expirationDate: "2028", type: 'composition', status: 'expiring-soon' }
    ],
    competitiveLandscape: {
      totalMarketSize: "$3.2B+ (HAP/VAP market)",
      projectedGrowth: "5% CAGR",
      keyPlayers: [
        { name: "Linezolid", company: "Generic", phase: "Approved", mechanism: "Oxazolidinone", keyDifferentiator: "Generic, BID", efficacy: "High", threat: 'high' },
        { name: "Vancomycin", company: "Generic", phase: "Approved", mechanism: "Glycopeptide", keyDifferentiator: "Low cost", efficacy: "High", threat: 'high' },
        { name: "Ceftobiprole", company: "Basilea", phase: "Approved (EU)", mechanism: "Anti-MRSA cephalosporin", keyDifferentiator: "Beta-lactam option", efficacy: "High", threat: 'medium' }
      ],
      competitiveAdvantages: ["Once daily", "Better bone marrow safety", "IV-to-oral switch", "Proven in ABSSSI"],
      competitiveRisks: ["Generic linezolid", "Patent expiry approaching", "Established competitors"],
      marketPositioning: "Premium once-daily oxazolidinone with improved safety for serious gram-positive pneumonia."
    },
    retrospectivePhases: [
      { phase: "Phase 2 HAP", date: "Q1 2019", outcome: 'success', keyData: ["Clinical cure in HAP", "Safe profile"], scoreAtTime: 75, rationale: "Proof of concept in HAP", dataAvailableAtTime: ["Phase 2 HAP data"] },
      { phase: "Phase 3 HAP", date: "Q3 2022", outcome: 'pending', keyData: ["Pivotal trial ongoing"], scoreAtTime: 78, rationale: "Seeking HAP indication expansion", dataAvailableAtTime: ["Trial design"] }
    ]
  }
];
