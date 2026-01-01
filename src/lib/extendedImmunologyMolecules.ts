import { MoleculeProfile } from './moleculesData';
import { calculateProbabilityScores, generateMarketProjections } from './scoring';

const immunologyIndications = [
  'Systemic Lupus Erythematosus', 'Sjögren Syndrome', 'Myasthenia Gravis', 'Multiple Sclerosis',
  'Inflammatory Bowel Disease', 'Graft-versus-Host Disease', 'Transplant Rejection', 'Vasculitis',
  'Scleroderma', 'Dermatomyositis', 'Polymyositis', 'IgA Nephropathy', 'Lupus Nephritis',
  'Anti-Neutrophil Cytoplasmic Antibody Vasculitis', 'Giant Cell Arteritis', 'Takayasu Arteritis',
  'Primary Biliary Cholangitis', 'Autoimmune Hepatitis', 'Celiac Disease', 'Type 1 Diabetes'
];

const immunologyCompanies = [
  'Bristol-Myers Squibb', 'AbbVie', 'Johnson & Johnson', 'Roche', 'Novartis', 'Sanofi',
  'AstraZeneca', 'Pfizer', 'Gilead Sciences', 'Biogen', 'UCB', 'Galapagos', 'Incyte',
  'Kiniksa Pharmaceuticals', 'Arena Pharmaceuticals', 'Viela Bio', 'Chinook Therapeutics',
  'Equillium', 'Horizon Therapeutics', 'Prometheus Biosciences'
];

const phases = ['Phase I', 'Phase II', 'Phase III', 'NDA/BLA'];
const mechanisms = ['IL-17 Inhibitor', 'IL-23 Inhibitor', 'JAK Inhibitor', 'BTK Inhibitor', 'CD20 Antibody', 'CD40L Blocker', 'BAFF Inhibitor', 'TYK2 Inhibitor', 'S1P Modulator', 'Complement Inhibitor'];

export const extendedImmunologyMolecules: MoleculeProfile[] = Array.from({ length: 100 }, (_, i) => {
  const id = `ext-imm-${i + 1}`;
  const phase = phases[Math.floor(Math.random() * phases.length)];
  const indication = immunologyIndications[i % immunologyIndications.length];
  const company = immunologyCompanies[i % immunologyCompanies.length];
  const mechanism = mechanisms[i % mechanisms.length];
  const isFailed = Math.random() < 0.08;
  const actualPhase = isFailed ? 'Failed' : phase;
  const companyTrackRecord: 'fast' | 'average' | 'slow' = i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'average' : 'slow';
  const probabilities = calculateProbabilityScores(actualPhase, indication, 'Immunology', isFailed);
  const marketData = generateMarketProjections(id, actualPhase, indication, companyTrackRecord, isFailed);

  return {
    id,
    name: `IMM-${1000 + i}`,
    phase: actualPhase,
    indication,
    therapeuticArea: 'Immunology',
    company,
    companyTrackRecord,
    scores: probabilities,
    overallScore: 0,
    drugInfo: {
      moleculeType: i % 3 === 0 ? 'Monoclonal Antibody' : i % 3 === 1 ? 'Small Molecule' : 'Fusion Protein',
      mechanismOfAction: mechanism,
      routeOfAdministration: i % 2 === 0 ? 'Subcutaneous' : 'Oral',
      targetPatientPopulation: `Adults with ${indication}`,
      clinicalTrialDesign: 'Randomized, double-blind, placebo-controlled',
      primaryEndpoint: 'Disease activity score improvement',
      secondaryEndpoints: ['Quality of life improvement', 'Biomarker changes', 'Time to flare'],
      competitorAnalysis: 'Competing with established biologics',
      regulatoryDesignation: i % 4 === 0 ? ['Fast Track'] : i % 4 === 1 ? ['Breakthrough Therapy'] : [],
      safetyProfile: {
        commonAEs: ['Infections', 'Injection site reactions', 'Headache'],
        seriousAEs: ['Serious infections', 'Malignancy risk'],
        blackBoxWarnings: i % 5 === 0 ? ['Increased infection risk'] : []
      },
      differentiationFactors: `Novel ${mechanism} with improved selectivity`
    },
    probabilities,
    marketData,
    patents: [{ id: `PAT-IMM-${i}`, filingDate: '2020-01-15', expirationDate: '2040-01-15', jurisdiction: 'US', status: 'Active', patentType: 'Composition of Matter' }],
    competitiveLandscape: {
      directCompetitors: [{ name: 'Competitor A', phase: 'Phase III', company: 'Major Pharma', differentiatingFactors: ['Different mechanism'] }],
      indirectCompetitors: [{ name: 'Existing therapy', phase: 'Approved', company: 'Generic', differentiatingFactors: ['Established safety'] }],
      marketPositioning: 'Novel mechanism with potential for improved efficacy',
      competitiveAdvantages: ['Novel target', 'Convenient dosing'],
      competitiveDisadvantages: ['Limited long-term data'],
      estimatedMarketShare: 15 + (i % 20)
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2018-01-01', outcome: 'success', keyData: ['IND-enabling studies completed'], scoreAtTime: 25, rationale: 'Strong preclinical data', dataAvailableAtTime: ['Toxicology', 'PK studies'] },
      { phase: 'Phase I', date: '2019-07-01', outcome: 'success', keyData: ['Safety established'], scoreAtTime: 40, rationale: 'Good tolerability profile', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
