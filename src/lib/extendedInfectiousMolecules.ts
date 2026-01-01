import { MoleculeProfile } from './moleculesData';
import { calculateProbabilityScores, generateMarketProjections } from './scoring';

const infectiousIndications = [
  'Multi-Drug Resistant Tuberculosis', 'Clostridioides difficile Infection', 'Carbapenem-Resistant Enterobacteriaceae',
  'Methicillin-Resistant Staphylococcus aureus', 'Vancomycin-Resistant Enterococcus', 'Pseudomonas aeruginosa Infection',
  'Acinetobacter baumannii Infection', 'Klebsiella pneumoniae Infection', 'Invasive Aspergillosis', 'Invasive Candidiasis',
  'Cryptococcal Meningitis', 'Hepatitis B', 'Hepatitis D', 'HIV-1 Infection', 'Respiratory Syncytial Virus',
  'Cytomegalovirus Infection', 'Herpes Simplex Virus', 'Influenza', 'COVID-19', 'Dengue Fever'
];

const infectiousCompanies = [
  'Gilead Sciences', 'ViiV Healthcare', 'Merck & Co.', 'Pfizer', 'Johnson & Johnson', 'AbbVie',
  'Shionogi', 'Melinta Therapeutics', 'Achaogen', 'Paratek Pharmaceuticals', 'Nabriva Therapeutics',
  'Iterum Therapeutics', 'Cidara Therapeutics', 'Amplyx Pharmaceuticals', 'Astellas Pharma',
  'F2G Limited', 'Appili Therapeutics', 'Entasis Therapeutics', 'Qpex Biopharma', 'Venatorx Pharmaceuticals'
];

const phases = ['Phase I', 'Phase II', 'Phase III', 'NDA/BLA'];
const mechanisms = ['Beta-Lactamase Inhibitor', 'DNA Gyrase Inhibitor', 'Polymerase Inhibitor', 'Integrase Inhibitor', 'Protease Inhibitor', 'Entry Inhibitor', 'Cell Wall Synthesis Inhibitor', 'Protein Synthesis Inhibitor', 'Antifungal Echinocandin', 'Neuraminidase Inhibitor'];

export const extendedInfectiousMolecules: MoleculeProfile[] = Array.from({ length: 100 }, (_, i) => {
  const id = `ext-inf-${i + 1}`;
  const phase = phases[Math.floor(Math.random() * phases.length)];
  const indication = infectiousIndications[i % infectiousIndications.length];
  const company = infectiousCompanies[i % infectiousCompanies.length];
  const mechanism = mechanisms[i % mechanisms.length];
  const isFailed = Math.random() < 0.12;
  const actualPhase = isFailed ? 'Failed' : phase;
  const companyTrackRecord: 'fast' | 'average' | 'slow' = i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'average' : 'slow';
  const probabilities = calculateProbabilityScores(actualPhase, indication, 'Infectious Disease', isFailed);
  const marketData = generateMarketProjections(id, actualPhase, indication, companyTrackRecord, isFailed);

  return {
    id,
    name: `INF-${2000 + i}`,
    phase: actualPhase,
    indication,
    therapeuticArea: 'Infectious Disease',
    company,
    companyTrackRecord,
    scores: probabilities,
    overallScore: 0,
    drugInfo: {
      moleculeType: i % 4 === 0 ? 'Monoclonal Antibody' : i % 4 === 1 ? 'Small Molecule' : i % 4 === 2 ? 'Peptide' : 'Nucleoside Analog',
      mechanismOfAction: mechanism,
      routeOfAdministration: i % 3 === 0 ? 'Intravenous' : i % 3 === 1 ? 'Oral' : 'Subcutaneous',
      targetPatientPopulation: `Patients with ${indication}`,
      clinicalTrialDesign: 'Randomized, active-controlled, non-inferiority',
      primaryEndpoint: 'Clinical cure rate',
      secondaryEndpoints: ['Microbiological eradication', 'Time to symptom resolution', 'All-cause mortality'],
      competitorAnalysis: 'Addressing unmet need in resistant infections',
      regulatoryDesignation: i % 3 === 0 ? ['QIDP', 'Fast Track'] : i % 5 === 0 ? ['Breakthrough Therapy'] : [],
      safetyProfile: {
        commonAEs: ['Nausea', 'Diarrhea', 'Headache'],
        seriousAEs: ['Hepatotoxicity', 'QT prolongation'],
        blackBoxWarnings: []
      },
      differentiationFactors: `Activity against resistant pathogens via ${mechanism}`
    },
    probabilities,
    marketData,
    patents: [{ id: `PAT-INF-${i}`, filingDate: '2019-03-20', expirationDate: '2039-03-20', jurisdiction: 'US', status: 'Active', patentType: 'Composition of Matter' }],
    competitiveLandscape: {
      directCompetitors: [{ name: 'Generic antibiotic', phase: 'Approved', company: 'Multiple', differentiatingFactors: ['Low cost'] }],
      indirectCompetitors: [{ name: 'Combination therapy', phase: 'Approved', company: 'Various', differentiatingFactors: ['Broad spectrum'] }],
      marketPositioning: 'Targeting resistant pathogens with limited treatment options',
      competitiveAdvantages: ['Novel mechanism', 'Activity against MDR strains'],
      competitiveDisadvantages: ['Limited market size', 'Antibiotic stewardship'],
      estimatedMarketShare: 10 + (i % 25)
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2017-06-01', outcome: 'success', keyData: ['In vitro activity confirmed'], scoreAtTime: 25, rationale: 'Strong MIC data', dataAvailableAtTime: ['Microbiology'] },
      { phase: 'Phase I', date: '2019-01-01', outcome: 'success', keyData: ['PK/PD established'], scoreAtTime: 40, rationale: 'Favorable PK profile', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
