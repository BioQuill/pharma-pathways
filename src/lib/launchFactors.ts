// Launch factors based on ranked master table with TA-specific weights
// Impact 5 = Rank 1 (Primary drivers, displayed individually)
// Impact 4 = Rank 2, Impact 3 = Rank 3, Impact 2 = Rank 4, Impact 1 = Rank 5 (composite index)

export interface Rank1Factor {
  name: string;
  category: string;
  impactArea: string;
  score: number; // 0-100
  baseWeight: number; // percentage
  adjustedWeight: number; // after TA multiplier
  description: string;
}

export interface CompositeFactorItem {
  name: string;
  category: string;
  impactArea: string;
  rank: 2 | 3 | 4 | 5;
  score: number; // 0-100
  baseWeight: number; // percentage
  adjustedWeight: number; // after TA multiplier
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

// Base weights from the model (percentage)
const BASE_WEIGHTS = {
  5: 7.35, // Rank 1 / Impact 5
  4: 5.88, // Rank 2 / Impact 4
  3: 4.41, // Rank 3 / Impact 3
  2: 2.94, // Rank 4 / Impact 2
  1: 1.47, // Rank 5 / Impact 1
};

// TA-specific multipliers for certain factors
type TAMultipliers = Record<string, Record<string, number>>;

const TA_MULTIPLIERS: TAMultipliers = {
  'ONCOLOGY/HEMATOLOGY': {
    'Biomarker Availability': 1.4,
  },
  'TRANSPLANT/CELL-GENE': {
    'CMC Readiness': 1.6,
  },
  // Other TAs use default multiplier of 1.0
};

// Factor definitions with their impact level and categories
interface FactorDefinition {
  name: string;
  category: string;
  impactArea: string;
  impact: 1 | 2 | 3 | 4 | 5;
  description: string;
}

const ALL_FACTORS: FactorDefinition[] = [
  // Impact 5 (Rank 1) - Primary Drivers
  { name: 'Scientific Target Validation', category: 'Scientific', impactArea: 'Success Predictor', impact: 5, description: 'Strength of preclinical/clinical evidence validating drug target' },
  { name: 'CMC Readiness', category: 'Internal Operational', impactArea: 'Approval Driver', impact: 5, description: 'Manufacturing, process controls, and supply chain preparedness' },
  { name: 'Regulatory Review Timeline', category: 'External Regulatory', impactArea: 'Approval Driver', impact: 5, description: 'Expected timeline based on agency workload and designation' },
  { name: 'Cost-Effectiveness Strength', category: 'Internal Market Access', impactArea: 'Market Access', impact: 5, description: 'ICER, QALY gains, and pharmacoeconomic positioning' },
  { name: 'National Reimbursement Rules', category: 'External Market Access', impactArea: 'Market Access', impact: 5, description: 'Favorability of payer landscape in key markets' },
  
  // Impact 4 (Rank 2)
  { name: 'Clinical Endpoint Clarity', category: 'Scientific', impactArea: 'Success Predictor', impact: 4, description: 'Clear and accepted clinical endpoints for trial success' },
  { name: 'Regulatory Dossier Quality', category: 'Internal Operational', impactArea: 'Approval Driver', impact: 4, description: 'Completeness and quality of regulatory submission package' },
  { name: 'Accelerated Pathway Availability', category: 'External Regulatory', impactArea: 'Approval Driver', impact: 4, description: 'Eligibility for fast-track, breakthrough, or priority review' },
  { name: 'Differentiation vs SOC', category: 'Internal Market Access', impactArea: 'Market Access', impact: 4, description: 'Clinical advantage over current standard of care' },
  { name: 'Pricing Negotiation Environment', category: 'External Market Access', impactArea: 'Market Access', impact: 4, description: 'Payer receptiveness to proposed pricing strategy' },
  
  // Impact 3 (Rank 3)
  { name: 'Phase II Effect Size', category: 'Scientific', impactArea: 'Success Predictor', impact: 3, description: 'Magnitude of treatment effect observed in Phase II' },
  { name: 'Trial Recruitment Speed', category: 'Internal Operational', impactArea: 'Development Speed', impact: 3, description: 'Ability to enroll patients on schedule' },
  { name: 'Local Clinical Data Requirements', category: 'External Regulatory', impactArea: 'Approval Driver', impact: 3, description: 'Need for region-specific clinical trial data' },
  { name: 'HEOR Evidence Quality', category: 'Internal Market Access', impactArea: 'Market Access', impact: 3, description: 'Quality of health economics and outcomes research data' },
  { name: 'Health Budget Pressure', category: 'External Market Access', impactArea: 'Market Access', impact: 3, description: 'Healthcare budget constraints affecting reimbursement' },
  
  // Impact 2 (Rank 4)
  { name: 'Biomarker Availability', category: 'Scientific', impactArea: 'Success Predictor', impact: 2, description: 'Availability of biomarkers for patient selection and monitoring' },
  { name: 'Manufacturing Scalability', category: 'Internal Operational', impactArea: 'Launch Driver', impact: 2, description: 'Ability to scale manufacturing for commercial demand' },
  { name: 'Regulatory Backlog', category: 'External Regulatory', impactArea: 'Approval Driver', impact: 2, description: 'Current backlog at regulatory agencies' },
  
  // Impact 1 (Rank 5)
  { name: 'Safety Margin', category: 'Scientific', impactArea: 'Success Predictor', impact: 1, description: 'Therapeutic window and safety buffer' },
  { name: 'Response Speed to Regulators', category: 'Internal Operational', impactArea: 'Approval Driver', impact: 1, description: 'Speed of responding to regulatory queries' },
];

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

// Map therapeutic area strings to TA keys
function normalizeTherapeuticArea(ta: string): string {
  const taLower = ta.toLowerCase();
  
  if (taLower.includes('oncology') || taLower.includes('hematology') || taLower.includes('cancer')) {
    return 'ONCOLOGY/HEMATOLOGY';
  }
  if (taLower.includes('cardio') || taLower.includes('heart')) {
    return 'CARDIOVASCULAR';
  }
  if (taLower.includes('neuro') || taLower.includes('cns') || taLower.includes('alzheimer')) {
    return 'NEUROLOGY/CNS';
  }
  if (taLower.includes('immun') || taLower.includes('inflam')) {
    return 'IMMUNOLOGY & INFLAMMATION';
  }
  if (taLower.includes('infect') || taLower.includes('virus') || taLower.includes('bacter')) {
    return 'INFECTIOUS DISEASES';
  }
  if (taLower.includes('transplant') || taLower.includes('cell') || taLower.includes('gene')) {
    return 'TRANSPLANT/CELL-GENE';
  }
  if (taLower.includes('derma') || taLower.includes('skin')) {
    return 'DERMATOLOGY';
  }
  if (taLower.includes('gastro') || taLower.includes('hepat') || taLower.includes('liver')) {
    return 'GASTROENTEROLOGY & HEPATOLOGY';
  }
  if (taLower.includes('nephro') || taLower.includes('renal') || taLower.includes('kidney')) {
    return 'NEPHROLOGY/RENAL';
  }
  if (taLower.includes('rare') || taLower.includes('orphan')) {
    return 'RARE DISEASES/ORPHAN';
  }
  if (taLower.includes('metabol') || taLower.includes('diabet') || taLower.includes('endocrin')) {
    return 'ENDOCRINOLOGY & METABOLISM';
  }
  if (taLower.includes('respir') || taLower.includes('pulmon') || taLower.includes('lung')) {
    return 'RESPIRATORY/PULMONOLOGY';
  }
  if (taLower.includes('rheum') || taLower.includes('arthritis')) {
    return 'RHEUMATOLOGY';
  }
  if (taLower.includes('ophthal') || taLower.includes('eye')) {
    return 'OPHTHALMOLOGY';
  }
  if (taLower.includes('psych') || taLower.includes('mental')) {
    return 'PSYCHIATRY/MENTAL HEALTH';
  }
  
  return 'GENERAL';
}

// Get TA-specific multiplier for a factor
function getTAMultiplier(therapeuticArea: string, factorName: string): number {
  const normalizedTA = normalizeTherapeuticArea(therapeuticArea);
  const taMultipliers = TA_MULTIPLIERS[normalizedTA];
  
  if (taMultipliers && taMultipliers[factorName]) {
    return taMultipliers[factorName];
  }
  
  return 1.0;
}

// Generate rank 1 factors (Impact 5) based on molecule data
export function generateRank1Factors(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  isFailed: boolean = false
): Rank1Factor[] {
  const rank1FactorDefs = ALL_FACTORS.filter(f => f.impact === 5);
  
  if (isFailed) {
    return rank1FactorDefs.map(f => ({
      name: f.name,
      category: f.category,
      impactArea: f.impactArea,
      score: 0,
      baseWeight: BASE_WEIGHTS[5],
      adjustedWeight: BASE_WEIGHTS[5] * getTAMultiplier(therapeuticArea, f.name),
      description: getFailedDescription(f.name)
    }));
  }

  const trackRecordModifier = {
    fast: 1.15,
    average: 1.0,
    slow: 0.85
  };

  const phaseModifier: Record<string, number> = {
    'Pre-clinical': 0.6,
    'Phase I': 0.7,
    'Phase II': 0.8,
    'Phase III': 0.95,
    'NDA/BLA': 1.0
  };

  const pMod = phaseModifier[phase] || 0.8;
  const tMod = trackRecordModifier[companyTrackRecord];
  const normalizedTA = normalizeTherapeuticArea(therapeuticArea);

  // TA-specific score modifiers
  const taScoreModifiers: Record<string, Record<string, number>> = {
    'ONCOLOGY/HEMATOLOGY': { 'Scientific Target Validation': 0.9 },
    'ENDOCRINOLOGY & METABOLISM': { 'Scientific Target Validation': 1.1, 'Cost-Effectiveness Strength': 1.1 },
  };

  return rank1FactorDefs.map(f => {
    const baseScore = getBaseScoreForFactor(f.name);
    const taScoreMod = taScoreModifiers[normalizedTA]?.[f.name] || 1.0;
    const multiplier = getTAMultiplier(therapeuticArea, f.name);
    
    return {
      name: f.name,
      category: f.category,
      impactArea: f.impactArea,
      score: Math.min(95, Math.round(baseScore * pMod * tMod * taScoreMod)),
      baseWeight: BASE_WEIGHTS[5],
      adjustedWeight: Math.round(BASE_WEIGHTS[5] * multiplier * 100) / 100,
      description: f.description
    };
  });
}

function getFailedDescription(factorName: string): string {
  const descriptions: Record<string, string> = {
    'Scientific Target Validation': 'Target hypothesis not validated in clinical setting',
    'CMC Readiness': 'Development halted',
    'Regulatory Review Timeline': 'No regulatory pathway',
    'Cost-Effectiveness Strength': 'No value proposition',
    'National Reimbursement Rules': 'Not applicable',
  };
  return descriptions[factorName] || 'Development terminated';
}

function getBaseScoreForFactor(factorName: string): number {
  const baseScores: Record<string, number> = {
    'Scientific Target Validation': 70,
    'CMC Readiness': 65,
    'Regulatory Review Timeline': 60,
    'Cost-Effectiveness Strength': 72,
    'National Reimbursement Rules': 55,
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
    'Safety Margin': 72,
    'Response Speed to Regulators': 65,
  };
  return baseScores[factorName] || 60;
}

// Generate composite factors (Impact 1-4, Rank 2-5) for composite index
export function generateCompositeFactors(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  isFailed: boolean = false
): CompositeFactorItem[] {
  const compositeFactorDefs = ALL_FACTORS.filter(f => f.impact < 5);
  
  if (isFailed) {
    return compositeFactorDefs.map(f => ({
      name: f.name,
      category: f.category,
      impactArea: f.impactArea,
      rank: (6 - f.impact) as 2 | 3 | 4 | 5, // Impact 4 = Rank 2, Impact 3 = Rank 3, etc.
      score: 0,
      baseWeight: BASE_WEIGHTS[f.impact],
      adjustedWeight: BASE_WEIGHTS[f.impact] * getTAMultiplier(therapeuticArea, f.name)
    }));
  }

  const trackRecordModifier = { fast: 1.1, average: 1.0, slow: 0.9 };
  const phaseModifier: Record<string, number> = {
    'Pre-clinical': 0.6,
    'Phase I': 0.7,
    'Phase II': 0.8,
    'Phase III': 0.9,
    'NDA/BLA': 0.95
  };

  const pMod = phaseModifier[phase] || 0.8;
  const tMod = trackRecordModifier[companyTrackRecord];

  return compositeFactorDefs.map(f => {
    const multiplier = getTAMultiplier(therapeuticArea, f.name);
    const baseWeight = BASE_WEIGHTS[f.impact];
    
    return {
      name: f.name,
      category: f.category,
      impactArea: f.impactArea,
      rank: (6 - f.impact) as 2 | 3 | 4 | 5,
      score: Math.min(95, Math.round(getBaseScoreForFactor(f.name) * pMod * tMod)),
      baseWeight,
      adjustedWeight: Math.round(baseWeight * multiplier * 100) / 100
    };
  });
}

// Calculate weighted composite index using adjusted weights from the model
export function calculateCompositeIndex(factors: CompositeFactorItem[]): number {
  const totalWeight = factors.reduce((sum, f) => sum + f.adjustedWeight, 0);
  const weightedSum = factors.reduce((sum, f) => sum + f.score * f.adjustedWeight, 0);
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

// Enhanced launch probability calculation incorporating all factors with adjusted weights
export function calculateEnhancedLaunchProbability(
  launchFactors: LaunchFactors,
  revenueScore: number
): number {
  const { rank1Factors, compositeIndex, phaseRiskMetrics } = launchFactors;
  
  // Calculate weighted average of rank 1 factors using adjusted weights
  const rank1TotalWeight = rank1Factors.reduce((sum, f) => sum + f.adjustedWeight, 0);
  const rank1WeightedSum = rank1Factors.reduce((sum, f) => sum + f.score * f.adjustedWeight, 0);
  const rank1WeightedAverage = rank1TotalWeight > 0 ? rank1WeightedSum / rank1TotalWeight : 0;
  
  // Phase success rate (30-40% for Phase III per industry data)
  const phaseAdjustedProbability = phaseRiskMetrics.phaseSuccessRate;
  
  // Weighted calculation:
  // - Phase success rate: 35% (most critical per industry data)
  // - Rank 1 factors (weighted): 30% (primary drivers)
  // - Composite index: 20% (supporting factors)
  // - Revenue potential: 15% (market viability)
  const launchProbability = (
    phaseAdjustedProbability * 0.35 +
    (rank1WeightedAverage / 100) * 0.30 +
    (compositeIndex.score / 100) * 0.20 +
    revenueScore * 0.15
  );

  return Math.round(launchProbability * 100);
}
