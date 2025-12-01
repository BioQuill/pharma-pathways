// Launch factors based on ranked master table
// Rank 1 factors are displayed individually
// Rank 2-4 factors are combined into a composite index

export interface Rank1Factor {
  name: string;
  category: string;
  impactArea: string;
  score: number; // 0-100
  description: string;
}

export interface CompositeFactorItem {
  name: string;
  category: string;
  impactArea: string;
  rank: 2 | 3 | 4;
  score: number; // 0-100
  weight: number; // derived from rank
}

export interface LaunchFactors {
  rank1Factors: Rank1Factor[];
  compositeIndex: {
    score: number;
    factors: CompositeFactorItem[];
  };
  phaseRiskMetrics: PhaseRiskMetrics;
}

export interface PhaseRiskMetrics {
  currentPhase: string;
  phaseSuccessRate: number; // 0-1
  costConcentration: number; // percentage of total cost
  expectedDelays: {
    internal: number; // percentage
    regulatory: number;
    supplyChain: number;
  };
  failurePoints: string[];
}

// Phase-specific risk data from industry analysis
const PHASE_RISK_DATA = {
  'Pre-clinical': {
    successRate: 0.10,
    costConcentration: 5,
    failurePoints: ['Target validation', 'Safety signals', 'ADME issues']
  },
  'Phase I': {
    successRate: 0.52,
    costConcentration: 10,
    failurePoints: ['Unexpected toxicity', 'Poor PK profile', 'Dose-limiting events']
  },
  'Phase II': {
    successRate: 0.36,
    costConcentration: 10,
    failurePoints: ['Lack of proof-of-concept efficacy', 'Safety concerns', 'Biomarker issues']
  },
  'Phase III': {
    successRate: 0.58,
    costConcentration: 75,
    failurePoints: ['Enrollment challenges', 'Primary endpoint failure', 'Manufacturing scale-up', 'Regulatory submission quality']
  },
  'NDA/BLA': {
    successRate: 0.85,
    costConcentration: 0,
    failurePoints: ['Complete response letter', 'Additional data requests', 'Label restrictions']
  }
};

// Delay distribution (100% of drug launches experience delays)
const DELAY_DISTRIBUTION = {
  internal: 45, // 45% of delays
  regulatory: 40, // 40% of delays
  supplyChain: 15 // 15% of delays
};

// Generate rank 1 factors based on molecule data
export function generateRank1Factors(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  isFailed: boolean = false
): Rank1Factor[] {
  if (isFailed) {
    return [
      { name: 'Scientific Target Validation', category: 'Scientific', impactArea: 'Success Predictor', score: 0, description: 'Target hypothesis not validated in clinical setting' },
      { name: 'CMC Readiness', category: 'Internal Operational', impactArea: 'Approval Driver', score: 0, description: 'Development halted' },
      { name: 'Regulatory Review Timeline', category: 'External Regulatory', impactArea: 'Approval Driver', score: 0, description: 'No regulatory pathway' },
      { name: 'Cost-Effectiveness Strength', category: 'Internal Market Access', impactArea: 'Market Access', score: 0, description: 'No value proposition' },
      { name: 'National Reimbursement Rules', category: 'External Market Access', impactArea: 'Market Access', score: 0, description: 'Not applicable' },
    ];
  }

  const trackRecordModifier = {
    fast: 1.15,
    average: 1.0,
    slow: 0.85
  };

  const phaseModifier = {
    'Pre-clinical': 0.6,
    'Phase I': 0.7,
    'Phase II': 0.8,
    'Phase III': 0.95,
    'NDA/BLA': 1.0
  };

  const pMod = phaseModifier[phase as keyof typeof phaseModifier] || 0.8;
  const tMod = trackRecordModifier[companyTrackRecord];

  // Therapeutic area affects scientific validation
  const taModifier = therapeuticArea.toLowerCase().includes('oncology') ? 0.9 : 
                     therapeuticArea.toLowerCase().includes('metabolic') ? 1.1 : 1.0;

  return [
    {
      name: 'Scientific Target Validation',
      category: 'Scientific',
      impactArea: 'Success Predictor',
      score: Math.min(95, Math.round(70 * pMod * taModifier)),
      description: 'Strength of preclinical/clinical evidence validating drug target'
    },
    {
      name: 'CMC Readiness',
      category: 'Internal Operational',
      impactArea: 'Approval Driver',
      score: Math.min(95, Math.round(65 * pMod * tMod)),
      description: 'Manufacturing, process controls, and supply chain preparedness'
    },
    {
      name: 'Regulatory Review Timeline',
      category: 'External Regulatory',
      impactArea: 'Approval Driver',
      score: Math.min(95, Math.round(60 * pMod)),
      description: 'Expected timeline based on agency workload and designation'
    },
    {
      name: 'Cost-Effectiveness Strength',
      category: 'Internal Market Access',
      impactArea: 'Market Access',
      score: Math.min(95, Math.round(72 * pMod * taModifier)),
      description: 'ICER, QALY gains, and pharmacoeconomic positioning'
    },
    {
      name: 'National Reimbursement Rules',
      category: 'External Market Access',
      impactArea: 'Market Access',
      score: Math.min(95, Math.round(55 * pMod)),
      description: 'Favorability of payer landscape in key markets'
    },
  ];
}

// Generate rank 2-4 factors for composite index
export function generateCompositeFactors(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  isFailed: boolean = false
): CompositeFactorItem[] {
  if (isFailed) {
    return RANK_2_4_FACTORS.map(f => ({
      ...f,
      score: 0,
      weight: getWeightFromRank(f.rank)
    }));
  }

  const trackRecordModifier = { fast: 1.1, average: 1.0, slow: 0.9 };
  const phaseModifier = {
    'Pre-clinical': 0.6,
    'Phase I': 0.7,
    'Phase II': 0.8,
    'Phase III': 0.9,
    'NDA/BLA': 0.95
  };

  const pMod = phaseModifier[phase as keyof typeof phaseModifier] || 0.8;
  const tMod = trackRecordModifier[companyTrackRecord];

  return RANK_2_4_FACTORS.map(factor => ({
    ...factor,
    score: Math.min(95, Math.round(getBaseScore(factor.name) * pMod * tMod)),
    weight: getWeightFromRank(factor.rank)
  }));
}

const RANK_2_4_FACTORS: Omit<CompositeFactorItem, 'score' | 'weight'>[] = [
  // Rank 2 factors
  { name: 'Clinical Endpoint Clarity', category: 'Scientific', impactArea: 'Success Predictor', rank: 2 },
  { name: 'Regulatory Dossier Quality', category: 'Internal Operational', impactArea: 'Approval Driver', rank: 2 },
  { name: 'Accelerated Pathway Availability', category: 'External Regulatory', impactArea: 'Approval Driver', rank: 2 },
  { name: 'Differentiation vs SOC', category: 'Internal Market Access', impactArea: 'Market Access', rank: 2 },
  { name: 'Pricing Negotiation Environment', category: 'External Market Access', impactArea: 'Market Access', rank: 2 },
  // Rank 3 factors
  { name: 'Phase II Effect Size', category: 'Scientific', impactArea: 'Success Predictor', rank: 3 },
  { name: 'Trial Recruitment Speed', category: 'Internal Operational', impactArea: 'Development Speed', rank: 3 },
  { name: 'Local Clinical Data Requirements', category: 'External Regulatory', impactArea: 'Approval Driver', rank: 3 },
  { name: 'HEOR Evidence Quality', category: 'Internal Market Access', impactArea: 'Market Access', rank: 3 },
  { name: 'Health Budget Pressure', category: 'External Market Access', impactArea: 'Market Access', rank: 3 },
  // Rank 4 factors
  { name: 'Biomarker Availability', category: 'Scientific', impactArea: 'Success Predictor', rank: 4 },
  { name: 'Manufacturing Scalability', category: 'Internal Operational', impactArea: 'Launch Driver', rank: 4 },
  { name: 'Regulatory Backlog', category: 'External Regulatory', impactArea: 'Approval Driver', rank: 4 },
];

function getWeightFromRank(rank: 2 | 3 | 4): number {
  // Higher rank = lower weight
  // Rank 2: weight 0.5, Rank 3: weight 0.3, Rank 4: weight 0.2
  const weights = { 2: 0.5, 3: 0.3, 4: 0.2 };
  return weights[rank];
}

function getBaseScore(factorName: string): number {
  const baseScores: Record<string, number> = {
    'Clinical Endpoint Clarity': 70,
    'Regulatory Dossier Quality': 65,
    'Accelerated Pathway Availability': 50,
    'Differentiation vs SOC': 68,
    'Pricing Negotiation Environment': 55,
    'Phase II Effect Size': 62,
    'Trial Recruitment Speed': 60,
    'Local Clinical Data Requirements': 58,
    'HEOR Evidence Quality': 65,
    'Health Budget Pressure': 45,
    'Biomarker Availability': 55,
    'Manufacturing Scalability': 70,
    'Regulatory Backlog': 48,
  };
  return baseScores[factorName] || 60;
}

// Calculate weighted composite index from rank 2-4 factors
export function calculateCompositeIndex(factors: CompositeFactorItem[]): number {
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const weightedSum = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  return Math.round(weightedSum / totalWeight);
}

// Generate phase risk metrics
export function generatePhaseRiskMetrics(phase: string, isFailed: boolean = false): PhaseRiskMetrics {
  if (isFailed) {
    return {
      currentPhase: phase,
      phaseSuccessRate: 0,
      costConcentration: 0,
      expectedDelays: DELAY_DISTRIBUTION,
      failurePoints: ['Primary endpoints not met', 'Development terminated']
    };
  }

  const riskData = PHASE_RISK_DATA[phase as keyof typeof PHASE_RISK_DATA] || PHASE_RISK_DATA['Phase II'];
  
  return {
    currentPhase: phase,
    phaseSuccessRate: riskData.successRate,
    costConcentration: riskData.costConcentration,
    expectedDelays: DELAY_DISTRIBUTION,
    failurePoints: riskData.failurePoints
  };
}

// Generate all launch factors for a molecule
export function generateLaunchFactors(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  isFailed: boolean = false
): LaunchFactors {
  const rank1Factors = generateRank1Factors(phase, therapeuticArea, companyTrackRecord, isFailed);
  const compositeFactorItems = generateCompositeFactors(phase, therapeuticArea, companyTrackRecord, isFailed);
  
  return {
    rank1Factors,
    compositeIndex: {
      score: calculateCompositeIndex(compositeFactorItems),
      factors: compositeFactorItems
    },
    phaseRiskMetrics: generatePhaseRiskMetrics(phase, isFailed)
  };
}

// Enhanced launch probability calculation incorporating all factors
export function calculateEnhancedLaunchProbability(
  launchFactors: LaunchFactors,
  revenueScore: number
): number {
  const { rank1Factors, compositeIndex, phaseRiskMetrics } = launchFactors;
  
  // Average of rank 1 factors (0-100 scale)
  const rank1Average = rank1Factors.reduce((sum, f) => sum + f.score, 0) / rank1Factors.length;
  
  // Phase success rate (30-40% for Phase III per industry data)
  const phaseAdjustedProbability = phaseRiskMetrics.phaseSuccessRate;
  
  // Weighted calculation:
  // - Phase success rate: 35% (most critical per industry data)
  // - Rank 1 factors: 30% (primary drivers)
  // - Composite index: 20% (supporting factors)
  // - Revenue potential: 15% (market viability)
  const launchProbability = (
    phaseAdjustedProbability * 0.35 +
    (rank1Average / 100) * 0.30 +
    (compositeIndex.score / 100) * 0.20 +
    revenueScore * 0.15
  );

  return Math.round(launchProbability * 100);
}
