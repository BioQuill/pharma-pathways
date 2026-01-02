import { MoleculeProfile } from './moleculesData';
import { calculateProbabilityScores, generateMarketProjections } from './scoring';

const psychiatryIndications = [
  'Treatment-Resistant Depression', 'Major Depressive Disorder', 'Bipolar Depression', 'Generalized Anxiety Disorder',
  'Social Anxiety Disorder', 'Post-Traumatic Stress Disorder', 'Obsessive-Compulsive Disorder', 'Schizophrenia',
  'Schizoaffective Disorder', 'Attention Deficit Hyperactivity Disorder', 'Autism Spectrum Disorder',
  'Borderline Personality Disorder', 'Binge Eating Disorder', 'Anorexia Nervosa', 'Substance Use Disorder',
  'Alcohol Use Disorder', 'Opioid Use Disorder', 'Insomnia Disorder', 'Narcolepsy', 'Cognitive Impairment in Schizophrenia'
];

const psychiatryCompanies = [
  'Johnson & Johnson', 'Otsuka Pharmaceutical', 'Lundbeck', 'Intra-Cellular Therapies', 'Karuna Therapeutics',
  'Cerevel Therapeutics', 'Sage Therapeutics', 'Axsome Therapeutics', 'Alkermes', 'Acadia Pharmaceuticals',
  'Neurocrine Biosciences', 'Compass Pathways', 'Atai Life Sciences', 'Mindset Pharma', 'Perception Neuroscience',
  'Bionomics', 'Tonix Pharmaceuticals', 'Aptinyx', 'Alto Neuroscience', 'Praxis Precision Medicines'
];

const phases = ['Phase I', 'Phase II', 'Phase III', 'NDA/BLA'];
const mechanisms = ['NMDA Modulator', 'Serotonin Receptor Agonist', 'Dopamine Modulator', 'GABA-A PAM', 'Muscarinic Agonist', 'Kappa Opioid Antagonist', 'Orexin Antagonist', 'Histamine H3 Antagonist', 'Glutamate Modulator', 'Neurosteroid'];

export const extendedPsychiatryMolecules: MoleculeProfile[] = Array.from({ length: 100 }, (_, i) => {
  const id = `ext-psy-${i + 1}`;
  const phase = phases[Math.floor(Math.random() * phases.length)];
  const indication = psychiatryIndications[i % psychiatryIndications.length];
  const company = psychiatryCompanies[i % psychiatryCompanies.length];
  const mechanism = mechanisms[i % mechanisms.length];
  const isFailed = Math.random() < 0.15;
  const actualPhase = isFailed ? 'Failed' : phase;
  const companyTrackRecord: 'fast' | 'average' | 'slow' = i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'average' : 'slow';
  const probabilities = calculateProbabilityScores(actualPhase, indication, 'Psychiatry', isFailed);
  const marketData = generateMarketProjections(id, actualPhase, indication, companyTrackRecord, isFailed);

  return {
    id,
    name: `PSY-${3000 + i}`,
    phase: actualPhase,
    indication,
    therapeuticArea: 'Psychiatry',
    company,
    companyTrackRecord,
    scores: probabilities,
    overallScore: 0,
    drugInfo: {
      class: mechanism,
      administration: i % 4 === 0 ? 'Intranasal' : i % 4 === 1 ? 'Intravenous' : 'Oral',
      keyAdvantage: `Rapid-acting ${mechanism} with novel therapeutic profile`
    },
    probabilities,
    marketData,
    patents: [{ patentNumber: `US10,${300 + i},000`, title: `${mechanism} compound and methods`, expirationDate: '2040', type: 'composition', status: 'active' }],
    competitiveLandscape: {
      totalMarketSize: '$20B+',
      projectedGrowth: '6% CAGR',
      keyPlayers: [{ name: 'SSRI/SNRI', company: 'Generic', phase: 'Approved', mechanism: 'Serotonin modulation', keyDifferentiator: 'Established safety', efficacy: 'Moderate', threat: 'low' as const }],
      competitiveAdvantages: ['Rapid onset', 'Novel mechanism', 'Addresses unmet need'],
      competitiveRisks: ['Generic competition', 'Treatment adherence'],
      marketPositioning: 'Novel mechanism for treatment-resistant patients'
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2018-03-01', outcome: 'success', keyData: ['Behavioral models validated'], scoreAtTime: 25, rationale: 'Strong preclinical efficacy', dataAvailableAtTime: ['Animal models'] },
      { phase: 'Phase I', date: '2019-10-01', outcome: 'success', keyData: ['CNS penetration confirmed'], scoreAtTime: 40, rationale: 'Good brain exposure', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
