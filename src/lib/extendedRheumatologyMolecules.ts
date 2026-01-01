import { MoleculeProfile } from './moleculesData';
import { calculateProbabilityScores, generateMarketProjections } from './scoring';

const rheumatologyIndications = [
  'Rheumatoid Arthritis', 'Psoriatic Arthritis', 'Ankylosing Spondylitis', 'Axial Spondyloarthritis',
  'Juvenile Idiopathic Arthritis', 'Systemic Lupus Erythematosus', 'Lupus Nephritis', 'Sjögren Syndrome',
  'Systemic Sclerosis', 'Polymyalgia Rheumatica', 'Giant Cell Arteritis', 'ANCA-Associated Vasculitis',
  'Gout', 'Pseudogout', 'Osteoarthritis', 'Fibromyalgia', 'Behçet Disease', 'Relapsing Polychondritis',
  'Mixed Connective Tissue Disease', 'Dermatomyositis'
];

const rheumatologyCompanies = [
  'AbbVie', 'Amgen', 'Pfizer', 'Johnson & Johnson', 'Bristol-Myers Squibb', 'UCB', 'Eli Lilly',
  'Novartis', 'Gilead Sciences', 'Galapagos', 'Horizon Therapeutics', 'Kiniksa Pharmaceuticals',
  'Aurinia Pharmaceuticals', 'Exscientia', 'Alumis', 'Acelyrin', 'Ventyx Biosciences',
  'Chinook Therapeutics', 'Annexon Biosciences', 'RemeGen'
];

const phases = ['Phase I', 'Phase II', 'Phase III', 'NDA/BLA'];
const mechanisms = ['TNF Inhibitor', 'IL-6 Inhibitor', 'IL-17 Inhibitor', 'IL-23 Inhibitor', 'JAK Inhibitor', 'TYK2 Inhibitor', 'BTK Inhibitor', 'CD20 Antibody', 'BAFF Inhibitor', 'Complement C5 Inhibitor'];

export const extendedRheumatologyMolecules: MoleculeProfile[] = Array.from({ length: 100 }, (_, i) => {
  const id = `ext-rheum-${i + 1}`;
  const phase = phases[Math.floor(Math.random() * phases.length)];
  const indication = rheumatologyIndications[i % rheumatologyIndications.length];
  const company = rheumatologyCompanies[i % rheumatologyCompanies.length];
  const mechanism = mechanisms[i % mechanisms.length];
  const isFailed = Math.random() < 0.10;
  const actualPhase = isFailed ? 'Failed' : phase;
  const companyTrackRecord: 'fast' | 'average' | 'slow' = i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'average' : 'slow';
  const probabilities = calculateProbabilityScores(actualPhase, indication, 'Rheumatology', isFailed);
  const marketData = generateMarketProjections(id, actualPhase, indication, companyTrackRecord, isFailed);

  return {
    id,
    name: `RHM-${4000 + i}`,
    phase: actualPhase,
    indication,
    therapeuticArea: 'Rheumatology',
    company,
    companyTrackRecord,
    scores: probabilities,
    overallScore: 0,
    drugInfo: {
      moleculeType: i % 3 === 0 ? 'Monoclonal Antibody' : i % 3 === 1 ? 'Small Molecule' : 'Fusion Protein',
      mechanismOfAction: mechanism,
      routeOfAdministration: i % 3 === 0 ? 'Subcutaneous' : i % 3 === 1 ? 'Oral' : 'Intravenous',
      targetPatientPopulation: `Adults with moderate-to-severe ${indication}`,
      clinicalTrialDesign: 'Randomized, double-blind, placebo-controlled',
      primaryEndpoint: 'ACR20/50/70 response rate',
      secondaryEndpoints: ['DAS28-CRP change', 'HAQ-DI improvement', 'Radiographic progression'],
      competitorAnalysis: 'Competitive with established biologics and JAK inhibitors',
      regulatoryDesignation: i % 5 === 0 ? ['Fast Track'] : i % 7 === 0 ? ['Breakthrough Therapy'] : [],
      safetyProfile: {
        commonAEs: ['Upper respiratory infection', 'Injection site reaction', 'Headache'],
        seriousAEs: ['Serious infections', 'Malignancy', 'Cardiovascular events'],
        blackBoxWarnings: i % 4 === 0 ? ['Serious infections', 'Malignancy risk'] : []
      },
      differentiationFactors: `Next-generation ${mechanism} with improved safety profile`
    },
    probabilities,
    marketData,
    patents: [{ id: `PAT-RHM-${i}`, filingDate: '2019-08-15', expirationDate: '2039-08-15', jurisdiction: 'US', status: 'Active', patentType: 'Composition of Matter' }],
    competitiveLandscape: {
      directCompetitors: [{ name: 'Humira biosimilars', phase: 'Approved', company: 'Multiple', differentiatingFactors: ['Low cost', 'Established'] }],
      indirectCompetitors: [{ name: 'JAK inhibitors', phase: 'Approved', company: 'Multiple', differentiatingFactors: ['Oral convenience'] }],
      marketPositioning: 'Differentiated efficacy and safety in competitive landscape',
      competitiveAdvantages: ['Novel target', 'Improved safety', 'Convenient dosing'],
      competitiveDisadvantages: ['Crowded market', 'Biosimilar competition'],
      estimatedMarketShare: 8 + (i % 22)
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2017-09-01', outcome: 'success', keyData: ['Efficacy in CIA model'], scoreAtTime: 25, rationale: 'Strong animal model data', dataAvailableAtTime: ['Preclinical studies'] },
      { phase: 'Phase I', date: '2019-04-01', outcome: 'success', keyData: ['Target engagement confirmed'], scoreAtTime: 40, rationale: 'Good PK/PD', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
