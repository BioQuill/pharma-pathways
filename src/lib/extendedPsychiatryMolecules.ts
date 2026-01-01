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
      moleculeType: i % 5 === 0 ? 'Peptide' : 'Small Molecule',
      mechanismOfAction: mechanism,
      routeOfAdministration: i % 4 === 0 ? 'Intranasal' : i % 4 === 1 ? 'Intravenous' : 'Oral',
      targetPatientPopulation: `Adults with ${indication}`,
      clinicalTrialDesign: 'Randomized, double-blind, placebo-controlled',
      primaryEndpoint: 'Change in symptom severity scale',
      secondaryEndpoints: ['Clinical response rate', 'Remission rate', 'Functional improvement'],
      competitorAnalysis: 'Addressing high unmet need in psychiatric disorders',
      regulatoryDesignation: i % 4 === 0 ? ['Breakthrough Therapy'] : i % 6 === 0 ? ['Fast Track'] : [],
      safetyProfile: {
        commonAEs: ['Sedation', 'Dizziness', 'Nausea', 'Headache'],
        seriousAEs: ['Suicidal ideation', 'Dissociation'],
        blackBoxWarnings: i % 3 === 0 ? ['Suicidal thoughts and behaviors'] : []
      },
      differentiationFactors: `Rapid-acting ${mechanism} with novel therapeutic profile`
    },
    probabilities,
    marketData,
    patents: [{ id: `PAT-PSY-${i}`, filingDate: '2020-05-10', expirationDate: '2040-05-10', jurisdiction: 'US', status: 'Active', patentType: 'Composition of Matter' }],
    competitiveLandscape: {
      directCompetitors: [{ name: 'SSRI/SNRI', phase: 'Approved', company: 'Generic', differentiatingFactors: ['Established safety', 'Low cost'] }],
      indirectCompetitors: [{ name: 'Psychotherapy', phase: 'N/A', company: 'N/A', differentiatingFactors: ['Non-pharmacological'] }],
      marketPositioning: 'Novel mechanism for treatment-resistant patients',
      competitiveAdvantages: ['Rapid onset', 'Novel mechanism', 'Addresses unmet need'],
      competitiveDisadvantages: ['Safety monitoring required', 'Limited long-term data'],
      estimatedMarketShare: 12 + (i % 18)
    },
    retrospectivePhases: [
      { phase: 'Preclinical', date: '2018-03-01', outcome: 'success', keyData: ['Behavioral models validated'], scoreAtTime: 25, rationale: 'Strong preclinical efficacy', dataAvailableAtTime: ['Animal models'] },
      { phase: 'Phase I', date: '2019-10-01', outcome: 'success', keyData: ['CNS penetration confirmed'], scoreAtTime: 40, rationale: 'Good brain exposure', dataAvailableAtTime: ['Phase I results'] }
    ]
  };
});
