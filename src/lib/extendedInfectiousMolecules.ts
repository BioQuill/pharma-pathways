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
      class: mechanism,
      administration: i % 3 === 0 ? 'Intravenous' : i % 3 === 1 ? 'Oral' : 'Subcutaneous',
      keyAdvantage: `Activity against resistant pathogens via ${mechanism}`
    },
    probabilities,
    marketData,
    patents: [{ patentNumber: `US10,${200 + i},000`, title: `${mechanism} compound and methods`, expirationDate: '2039', type: 'composition', status: 'active' }],
    competitiveLandscape: {
      totalMarketSize: '$50B+',
      projectedGrowth: '5% CAGR',
      keyPlayers: [{ name: 'Generic antibiotic', company: 'Multiple', phase: 'Approved', mechanism: 'Various', keyDifferentiator: 'Low cost', efficacy: 'Variable', threat: 'medium' as const }],
      competitiveAdvantages: ['Novel mechanism', 'Activity against MDR strains'],
      competitiveRisks: ['Antibiotic stewardship', 'Resistance development'],
      marketPositioning: 'Targeting resistant pathogens with limited treatment options'
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2017-06-01', outcome: 'success', keyData: ['In vitro activity confirmed'], scoreAtTime: 25, rationale: 'Strong MIC data', dataAvailableAtTime: ['Microbiology'] },
      { phase: 'Phase I', date: '2019-01-01', outcome: 'success', keyData: ['PK/PD established'], scoreAtTime: 40, rationale: 'Favorable PK profile', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
