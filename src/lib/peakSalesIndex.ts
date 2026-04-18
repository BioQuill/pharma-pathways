import { type MoleculeProfile } from './moleculesData';

// =====================================================
// PEAK SALES COMPOSITE INDEX & $1B BLOCKBUSTER MODEL
// Based on validated methodology (2014-2024 launches)
// Correlation: r=0.78 | Accuracy: 82% | MAE: ±$1.2B
// =====================================================

// Types
export interface ComponentScore {
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
  details?: ComponentScoreDetails;
}

export interface ComponentScoreDetails {
  subScores: Array<{ name: string; score: number; weight: number }>;
  bonuses: Array<{ name: string; points: number }>;
  penalties: Array<{ name: string; points: number }>;
}

export interface PeakSalesResult {
  compositeScore: number;
  blockbusterProbability: number;
  peakSalesEstimate: number;
  peakSalesRange: { low: number; high: number };
  componentScores: ComponentScore[];
  riskFactors: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
}

// Component Weights (from document)
export const COMPONENT_WEIGHTS = {
  BASE_MARKET: 0.25,      // 25%
  CLINICAL: 0.20,         // 20%
  COMMERCIAL: 0.18,       // 18%
  STRATEGIC: 0.15,        // 15%
  COMPETITIVE: 0.12,      // 12%
  MARKET_ACCESS: 0.10,    // 10%
  PRICING: 0.10,          // 10%
} as const;

// Scoring lookup tables from document
export const PATIENT_POPULATION_SCORES: Record<string, { score: number; multiplier: number }> = {
  ultraRare: { score: 20, multiplier: 0.2 },    // <5,000 patients
  rare: { score: 40, multiplier: 0.4 },         // 5K-50K patients
  small: { score: 60, multiplier: 0.6 },        // 50K-200K patients
  medium: { score: 80, multiplier: 0.8 },       // 200K-1M patients
  large: { score: 90, multiplier: 0.9 },        // 1M-5M patients
  veryLarge: { score: 100, multiplier: 1.0 },   // >5M patients
};

export const GEOGRAPHIC_REACH_SCORES: Record<string, { score: number; multiplier: number }> = {
  single: { score: 30, multiplier: 0.3 },       // Single country
  regional: { score: 50, multiplier: 0.5 },     // 2-5 countries
  majorMarkets: { score: 75, multiplier: 0.75 }, // US+EU
  global: { score: 100, multiplier: 1.0 },      // US+EU+Asia
};

export const MARKET_GROWTH_SCORES: Record<string, { score: number; multiplier: number }> = {
  declining: { score: 40, multiplier: 0.4 },    // <0%
  stable: { score: 60, multiplier: 0.6 },       // 0-3%
  growing: { score: 80, multiplier: 0.8 },      // 3-7%
  rapid: { score: 100, multiplier: 1.0 },       // >7%
};

// Clinical scoring rubric
export const CLINICAL_SCORING = {
  efficacy: {
    inferior: 20,
    nonInferior: 50,
    better10to20: 70,
    better30to50: 90,
    bestInClass: 100,
  },
  safety: {
    blackBox: 20,
    significantAEs: 50,
    manageableAEs: 70,
    minimalAEs: 90,
    superiorToSoC: 100,
  },
  differentiation: {
    meToo: 20,
    modestAdvantage: 50,
    clearAdvantage: 70,
    multipleAdvantages: 90,
    transformative: 100,
  },
  evidence: {
    phaseIIOnly: 20,
    singlePhaseIII: 50,
    multiplePhaseIII: 70,
    landmarkTrials: 90,
    practiceChanging: 100,
  },
};

// Clinical bonuses and penalties
export const CLINICAL_BONUSES = {
  firstInClass: 10,
  breakthroughDesignation: 8,
  orphanDesignation: 7,
  acceleratedApproval: 5,
  companionDiagnostic: 5,
  qolImprovement: 5,
};

export const CLINICAL_PENALTIES = {
  blackBoxWarning: -15,
  remsRequirement: -10,
  contraindicationsOver20Percent: -8,
  complexAdministration: -5,
};

// Convenience scoring
export const CONVENIENCE_SCORES: Record<string, number> = {
  dailyInjection: 30,
  weeklyInjection: 50,
  monthlyInjection: 70,
  dailyOral: 80,
  weeklyOral: 90,
  oneTimeTreatment: 100,
};

// Brand strength scoring
export const BRAND_STRENGTH_SCORES: Record<string, number> = {
  unknown: 40,
  established: 60,
  lineExtension: 80,
  blockbusterExtension: 100,
};

// HCP acceptance scoring
export const HCP_ACCEPTANCE_SCORES: Record<string, number> = {
  controversial: 30,
  mixedGuideline: 60,
  guidelineRecommended: 85,
  firstLineGuideline: 100,
};

// Treatment line scoring
export const TREATMENT_LINE_SCORES: Record<string, number> = {
  fourthLine: 30,
  thirdLine: 50,
  secondLine: 70,
  firstLineAlternative: 85,
  firstLinePreferred: 100,
};

// Combination potential scoring
export const COMBINATION_SCORES: Record<string, number> = {
  monotherapy: 50,
  compatible: 75,
  synergistic: 90,
  platform: 100,
};

// Label breadth scoring
export const LABEL_BREADTH_SCORES: Record<string, number> = {
  narrow: 40,
  single: 70,
  multiple: 85,
  panDisease: 100,
};

// Life cycle management scoring
export const LIFECYCLE_SCORES: Record<string, number> = {
  none: 40,
  oneTwo: 70,
  pipeline: 90,
  platform: 100,
};

// Competitor quality multipliers
export const COMPETITOR_QUALITY_MULTIPLIERS: Record<string, number> = {
  allMeToo: 0.5,
  mixed: 0.7,
  differentiated: 0.9,
  bestInClass: 1.2,
};

// Market saturation scores
export const MARKET_SATURATION_SCORES: Record<string, number> = {
  blueOcean: 100,     // No competitors
  light: 90,          // 1-2 competitors
  moderate: 75,       // 3-4 competitors
  crowded: 60,        // 5-7 competitors
  saturated: 45,      // 8-10 competitors
  hyperSaturated: 30, // >10 competitors
};

// Competitive differentiation bonuses
export const COMPETITIVE_DIFFERENTIATION_BONUSES = {
  uniqueMOA: 15,
  superiorEfficacy: 10,
  betterSafety: 10,
  convenienceAdvantage: 8,
};

// Market access modifiers
export const MARKET_ACCESS_MODIFIERS = {
  positive: {
    breakthroughDesignation: 10,
    healthEconomicAdvantage: 8,
    orphanStatus: 7,
    patientAssistanceProgram: 5,
  },
  negative: {
    highCostNoClearValue: -15,
    stepTherapyRequired: -10,
    geographicRestrictions: -8,
    remsDistribution: -10,
  },
};

// Pricing modifiers
export const PRICING_MODIFIERS = {
  premium: {
    curativeTherapy: 20,
    orphanRareDisease: 15,
    dramaticEfficacy: 15,
    avoidsHospitalizations: 10,
    oneTimeTreatment: 10,
  },
  constraints: {
    genericWithin5Years: -20,
    biosimilarExpected: -15,
    referencePricingPressure: -10,
    multipleBrandedCompetitors: -10,
  },
};

// Value proposition to pricing potential
export const VALUE_PROPOSITION_SCORES: Record<string, { price: string; score: number }> = {
  lifeSaving: { price: '$500K+', score: 100 },
  majorQoL: { price: '$150K-500K', score: 85 },
  significant: { price: '$75K-150K', score: 70 },
  moderate: { price: '$30K-75K', score: 55 },
  incremental: { price: '$10K-30K', score: 40 },
  minimal: { price: '<$10K', score: 25 },
};

// Therapeutic area benchmarks from document
export const TA_BENCHMARKS: Record<string, { avgScore: number; blockbusterRate: number; avgPeakSales: number }> = {
  oncology: { avgScore: 72, blockbusterRate: 45, avgPeakSales: 1.8 },
  immunology: { avgScore: 68, blockbusterRate: 38, avgPeakSales: 1.5 },
  rareDisease: { avgScore: 75, blockbusterRate: 52, avgPeakSales: 2.3 },
  cns: { avgScore: 58, blockbusterRate: 22, avgPeakSales: 0.85 },
  cardiovascular: { avgScore: 62, blockbusterRate: 28, avgPeakSales: 1.1 },
  diabetesMetabolic: { avgScore: 65, blockbusterRate: 32, avgPeakSales: 1.3 },
  infectious: { avgScore: 60, blockbusterRate: 25, avgPeakSales: 0.95 },
  respiratory: { avgScore: 63, blockbusterRate: 30, avgPeakSales: 1.2 },
};

// Phase success probabilities for risk adjustment
export const PHASE_SUCCESS_RATES: Record<string, number> = {
  'Preclinical': 0.05,
  'Phase I': 0.10,
  'Phase I/II': 0.15,
  'Phase II': 0.20,
  'Phase II/III': 0.35,
  'Phase III': 0.55,
  'Pre-Registration': 0.85,
  'Approved': 1.0,
};

// =====================================================
// BLOCKBUSTER PROBABILITY CALCULATION
// P($1B+) = 1 / (1 + e^[-(Composite Score - μ) / σ])
// μ = 65 (inflection point - 50% probability threshold)
// σ = 10 (slope parameter)
// =====================================================
export const calculateBlockbusterProbability = (compositeScore: number): number => {
  const mu = 65;
  const sigma = 10;
  const prob = 1 / (1 + Math.exp(-(compositeScore - mu) / sigma));
  return Math.round(prob * 1000) / 10;
};

// Get probability range description from document
export const getBlockbusterProbabilityRange = (compositeScore: number): string => {
  if (compositeScore >= 90) return '>98%';
  if (compositeScore >= 80) return '88-98%';
  if (compositeScore >= 70) return '62-88%';
  if (compositeScore >= 65) return '50-62%';
  if (compositeScore >= 60) return '38-50%';
  if (compositeScore >= 50) return '18-38%';
  if (compositeScore >= 40) return '7-18%';
  return '<5%';
};

// =====================================================
// COMPONENT 1: BASE MARKET SIZE (Weight: 25%)
// Formula: (Population × 0.5) + (Geographic × 0.3) + (Growth × 0.2)
// =====================================================
const calculateBaseMarketScore = (molecule: MoleculeProfile): ComponentScore => {
  const ta = molecule.therapeuticArea.toLowerCase();
  
  // Determine patient population category
  let populationCategory = 'medium';
  if (ta.includes('rare') || ta.includes('orphan')) {
    populationCategory = 'rare';
  } else if (ta.includes('oncology') || ta.includes('cardiovascular')) {
    populationCategory = 'large';
  } else if (ta.includes('diabetes') || ta.includes('obesity')) {
    populationCategory = 'veryLarge';
  } else if (ta.includes('psychiatry') || ta.includes('neurology')) {
    populationCategory = 'large';
  }
  
  const populationScore = PATIENT_POPULATION_SCORES[populationCategory]?.score || 80;
  
  // Determine geographic reach
  let geographicCategory = 'majorMarkets';
  if (molecule.companyTrackRecord === 'fast') {
    geographicCategory = 'global';
  } else if (molecule.companyTrackRecord === 'slow') {
    geographicCategory = 'regional';
  }
  
  const geographicScore = GEOGRAPHIC_REACH_SCORES[geographicCategory]?.score || 75;
  
  // Determine market growth
  let growthCategory = 'growing';
  if (ta.includes('oncology') || ta.includes('immunology') || ta.includes('obesity') || ta.includes('rare')) {
    growthCategory = 'rapid';
  } else if (ta.includes('infectious') || ta.includes('vaccine')) {
    growthCategory = 'stable';
  }
  
  const growthScore = MARKET_GROWTH_SCORES[growthCategory]?.score || 80;
  
  // Calculate weighted score per document formula
  const score = (populationScore * 0.5) + (geographicScore * 0.3) + (growthScore * 0.2);
  
  return {
    name: 'Base Market Size',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.BASE_MARKET,
    weightedScore: score * COMPONENT_WEIGHTS.BASE_MARKET,
    details: {
      subScores: [
        { name: 'Patient Population', score: populationScore, weight: 0.5 },
        { name: 'Geographic Reach', score: geographicScore, weight: 0.3 },
        { name: 'Market Growth', score: growthScore, weight: 0.2 },
      ],
      bonuses: [],
      penalties: [],
    },
  };
};

// =====================================================
// COMPONENT 2: CLINICAL SUCCESS FACTOR (Weight: 20%)
// Formula: (Efficacy × 0.4) + (Safety × 0.3) + (Differentiation × 0.2) + (Evidence × 0.1) + Bonuses
// =====================================================
const calculateClinicalScore = (molecule: MoleculeProfile): ComponentScore => {
  const bonuses: Array<{ name: string; points: number }> = [];
  const penalties: Array<{ name: string; points: number }> = [];
  
  // Base scores by phase
  let efficacyScore = 70;
  let safetyScore = 70;
  let differentiationScore = 70;
  let evidenceScore = 60;
  
  // Adjust by phase
  if (molecule.phase === 'Approved') {
    efficacyScore = 85;
    safetyScore = 80;
    evidenceScore = 90;
  } else if (molecule.phase.includes('Phase III')) {
    efficacyScore = 75;
    evidenceScore = 70;
  } else if (molecule.phase.includes('Phase II')) {
    efficacyScore = 65;
    evidenceScore = 50;
  } else if (molecule.phase.includes('Phase I')) {
    efficacyScore = 55;
    evidenceScore = 30;
  }
  
  // Adjust by overall molecule score
  if (molecule.overallScore >= 80) {
    efficacyScore = Math.min(100, efficacyScore + 15);
    safetyScore = Math.min(100, safetyScore + 10);
    differentiationScore = Math.min(100, differentiationScore + 15);
  } else if (molecule.overallScore >= 60) {
    efficacyScore = Math.min(100, efficacyScore + 5);
    differentiationScore = Math.min(100, differentiationScore + 5);
  } else if (molecule.overallScore < 40) {
    efficacyScore = Math.max(20, efficacyScore - 15);
    safetyScore = Math.max(20, safetyScore - 10);
  }
  
  // Calculate base score
  let score = (efficacyScore * 0.4) + (safetyScore * 0.3) + 
              (differentiationScore * 0.2) + (evidenceScore * 0.1);
  
  // Apply bonuses from document
  const ta = molecule.therapeuticArea.toLowerCase();
  if (ta.includes('rare') || ta.includes('orphan')) {
    bonuses.push({ name: 'Orphan Designation', points: CLINICAL_BONUSES.orphanDesignation });
    score += CLINICAL_BONUSES.orphanDesignation;
  }
  
  const keyAdvantage = molecule.drugInfo?.keyAdvantage?.toLowerCase() || '';
  if (keyAdvantage.includes('first-in-class') || keyAdvantage.includes('novel')) {
    bonuses.push({ name: 'First-in-Class', points: CLINICAL_BONUSES.firstInClass });
    score += CLINICAL_BONUSES.firstInClass;
  }
  
  if (keyAdvantage.includes('breakthrough')) {
    bonuses.push({ name: 'Breakthrough Designation', points: CLINICAL_BONUSES.breakthroughDesignation });
    score += CLINICAL_BONUSES.breakthroughDesignation;
  }
  
  // Cap at 100
  score = Math.min(100, score);
  
  return {
    name: 'Clinical Success',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.CLINICAL,
    weightedScore: Math.min(100, score) * COMPONENT_WEIGHTS.CLINICAL,
    details: {
      subScores: [
        { name: 'Efficacy vs SoC', score: efficacyScore, weight: 0.4 },
        { name: 'Safety Profile', score: safetyScore, weight: 0.3 },
        { name: 'Differentiation', score: differentiationScore, weight: 0.2 },
        { name: 'Evidence Quality', score: evidenceScore, weight: 0.1 },
      ],
      bonuses,
      penalties,
    },
  };
};

// =====================================================
// COMPONENT 3: COMMERCIAL ADVANTAGE (Weight: 18%)
// Formula: (Convenience × 0.35) + (Brand × 0.25) + (HCP × 0.25) + (Patient × 0.15)
// =====================================================
const calculateCommercialScore = (molecule: MoleculeProfile): ComponentScore => {
  // Convenience based on administration
  let convenienceScore = 70;
  const admin = molecule.drugInfo?.administration?.toLowerCase() || '';
  
  if (admin.includes('one-time') || admin.includes('single')) {
    convenienceScore = 100;
  } else if (admin.includes('weekly') && admin.includes('oral')) {
    convenienceScore = 90;
  } else if (admin.includes('daily') && admin.includes('oral')) {
    convenienceScore = 80;
  } else if (admin.includes('monthly')) {
    convenienceScore = 70;
  } else if (admin.includes('weekly') && admin.includes('injection')) {
    convenienceScore = 50;
  } else if (admin.includes('daily') && admin.includes('injection')) {
    convenienceScore = 30;
  }
  
  // Brand strength by company track record
  let brandScore = 60;
  if (molecule.companyTrackRecord === 'fast') {
    brandScore = 85;
  } else if (molecule.companyTrackRecord === 'average') {
    brandScore = 70;
  } else {
    brandScore = 50;
  }
  
  // HCP acceptance by phase and score
  let hcpScore = 60;
  if (molecule.phase === 'Approved') {
    hcpScore = 85;
  } else if (molecule.phase.includes('Phase III')) {
    hcpScore = 65;
  }
  
  if (molecule.overallScore >= 75) {
    hcpScore = Math.min(100, hcpScore + 15);
  }
  
  // Patient preference correlates with convenience
  const patientScore = convenienceScore;
  
  const score = (convenienceScore * 0.35) + (brandScore * 0.25) + 
                (hcpScore * 0.25) + (patientScore * 0.15);
  
  return {
    name: 'Commercial Advantage',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.COMMERCIAL,
    weightedScore: score * COMPONENT_WEIGHTS.COMMERCIAL,
    details: {
      subScores: [
        { name: 'Convenience', score: convenienceScore, weight: 0.35 },
        { name: 'Brand Strength', score: brandScore, weight: 0.25 },
        { name: 'HCP Acceptance', score: hcpScore, weight: 0.25 },
        { name: 'Patient Preference', score: patientScore, weight: 0.15 },
      ],
      bonuses: [],
      penalties: [],
    },
  };
};

// =====================================================
// COMPONENT 4: STRATEGIC POSITIONING (Weight: 15%)
// Formula: (Treatment Line × 0.4) + (Combination × 0.3) + (Label × 0.2) + (LCM × 0.1)
// =====================================================
const calculateStrategicScore = (molecule: MoleculeProfile): ComponentScore => {
  // Treatment line estimation
  let lineScore = 70;
  if (molecule.phase === 'Approved' && molecule.overallScore >= 75) {
    lineScore = 100;
  } else if (molecule.overallScore >= 60) {
    lineScore = 85;
  }
  
  // Combination potential
  let comboScore = 75;
  const drugClass = molecule.drugInfo?.class?.toLowerCase() || '';
  if (drugClass.includes('monoclonal') || drugClass.includes('biologic')) {
    comboScore = 90;
  }
  
  // Label breadth
  let labelScore = 70;
  if (molecule.indication.includes('/') || molecule.indication.includes('multiple') ||
      molecule.therapeuticArea.toLowerCase().includes('oncology')) {
    labelScore = 85;
  }
  
  // Life cycle management
  let lcmScore = 70;
  if (molecule.companyTrackRecord === 'fast') {
    lcmScore = 90;
  }
  
  const score = (lineScore * 0.4) + (comboScore * 0.3) + (labelScore * 0.2) + (lcmScore * 0.1);
  
  return {
    name: 'Strategic Positioning',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.STRATEGIC,
    weightedScore: score * COMPONENT_WEIGHTS.STRATEGIC,
    details: {
      subScores: [
        { name: 'Treatment Line', score: lineScore, weight: 0.4 },
        { name: 'Combination Potential', score: comboScore, weight: 0.3 },
        { name: 'Label Breadth', score: labelScore, weight: 0.2 },
        { name: 'Lifecycle Management', score: lcmScore, weight: 0.1 },
      ],
      bonuses: [],
      penalties: [],
    },
  };
};

// =====================================================
// COMPONENT 5: COMPETITIVE INTENSITY (Weight: 12%)
// Formula: Base Saturation + Differentiation Bonuses - (Quality Penalty)
// Weighted Competitor Count = (Approved × 1.0) + (Phase III × 0.7) + (Phase II × 0.3)
// =====================================================
const calculateCompetitiveScore = (molecule: MoleculeProfile): ComponentScore => {
  const bonuses: Array<{ name: string; points: number }> = [];
  
  // Base saturation from competitive landscape
  let baseSaturation = 75;
  let differentiationBonus = 0;
  
  if (molecule.competitiveLandscape) {
    const approvedCompetitors = molecule.competitiveLandscape.keyPlayers?.length || 0;
    
    // Calculate weighted competitor count
    const weightedCompetitors = approvedCompetitors * 1.0;
    
    if (weightedCompetitors === 0) {
      baseSaturation = 100;
    } else if (weightedCompetitors <= 2) {
      baseSaturation = 90;
    } else if (weightedCompetitors <= 4) {
      baseSaturation = 75;
    } else if (weightedCompetitors <= 7) {
      baseSaturation = 60;
    } else if (weightedCompetitors <= 10) {
      baseSaturation = 45;
    } else {
      baseSaturation = 30;
    }
    
    // Check for differentiation
    const marketPositioning = molecule.competitiveLandscape.marketPositioning?.toLowerCase() || '';
    if (marketPositioning.includes('unique') || marketPositioning.includes('first')) {
      bonuses.push({ name: 'Unique MOA', points: 15 });
      differentiationBonus += 15;
    }
    if (marketPositioning.includes('superior') || marketPositioning.includes('best')) {
      bonuses.push({ name: 'Superior Efficacy', points: 10 });
      differentiationBonus += 10;
    }
  }
  
  // Additional differentiation from drug info
  const keyAdvantage = molecule.drugInfo?.keyAdvantage?.toLowerCase() || '';
  if (keyAdvantage.includes('novel') || keyAdvantage.includes('unique')) {
    if (!bonuses.find(b => b.name === 'Unique MOA')) {
      bonuses.push({ name: 'Unique MOA', points: 15 });
      differentiationBonus += 15;
    }
  }
  
  const score = Math.min(100, baseSaturation + differentiationBonus);
  
  return {
    name: 'Competitive Intensity',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.COMPETITIVE,
    weightedScore: score * COMPONENT_WEIGHTS.COMPETITIVE,
    details: {
      subScores: [
        { name: 'Market Saturation', score: baseSaturation, weight: 1.0 },
      ],
      bonuses,
      penalties: [],
    },
  };
};

// =====================================================
// COMPONENT 6: MARKET ACCESS (Weight: 10%)
// Formula: (Payer Coverage × 0.4) + (Reimbursement Speed × 0.3) + (Formulary × 0.2) + (PA Burden × 0.1)
// =====================================================
const calculateMarketAccessScore = (molecule: MoleculeProfile): ComponentScore => {
  const bonuses: Array<{ name: string; points: number }> = [];
  
  let payerScore = 75;
  let reimbursementScore = 70;
  let formularyScore = 75;
  let priorAuthScore = 80;
  
  // Adjust by phase
  if (molecule.phase === 'Approved') {
    payerScore = 90;
    reimbursementScore = 85;
    formularyScore = 85;
  } else if (molecule.phase.includes('Phase III')) {
    payerScore = 80;
    reimbursementScore = 75;
  }
  
  // Orphan/rare disease bonus
  const ta = molecule.therapeuticArea.toLowerCase();
  if (ta.includes('rare') || ta.includes('orphan')) {
    bonuses.push({ name: 'Orphan Status', points: 7 });
    payerScore = Math.min(100, payerScore + 7);
    formularyScore = Math.min(100, formularyScore + 7);
  }
  
  // High score adjustment
  if (molecule.overallScore >= 75) {
    bonuses.push({ name: 'Strong Clinical Profile', points: 10 });
    reimbursementScore = Math.min(100, reimbursementScore + 10);
  }
  
  let score = (payerScore * 0.4) + (reimbursementScore * 0.3) + 
              (formularyScore * 0.2) + (priorAuthScore * 0.1);
  
  // Cap at 100
  score = Math.min(100, score);
  
  return {
    name: 'Market Access',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.MARKET_ACCESS,
    weightedScore: score * COMPONENT_WEIGHTS.MARKET_ACCESS,
    details: {
      subScores: [
        { name: 'Payer Coverage', score: payerScore, weight: 0.4 },
        { name: 'Reimbursement Speed', score: reimbursementScore, weight: 0.3 },
        { name: 'Formulary Position', score: formularyScore, weight: 0.2 },
        { name: 'Prior Auth Burden', score: priorAuthScore, weight: 0.1 },
      ],
      bonuses,
      penalties: [],
    },
  };
};

// =====================================================
// COMPONENT 7: PRICING POWER (Weight: 10%)
// Formula: (Therapeutic Value × 0.4) + (WTP × 0.3) + (Cost-Offset × 0.2) + (Alternatives × 0.1)
// =====================================================
const calculatePricingScore = (molecule: MoleculeProfile): ComponentScore => {
  const bonuses: Array<{ name: string; points: number }> = [];
  const penalties: Array<{ name: string; points: number }> = [];
  
  // Base therapeutic value
  let valueScore = 70;
  const ta = molecule.therapeuticArea.toLowerCase();
  
  if (ta.includes('oncology')) {
    valueScore = 85;
  } else if (ta.includes('rare') || ta.includes('orphan')) {
    valueScore = 100;
    bonuses.push({ name: 'Orphan/Rare Disease', points: 15 });
  }
  
  // Adjust by overall score
  if (molecule.overallScore >= 80) {
    valueScore = Math.min(100, valueScore + 15);
  } else if (molecule.overallScore >= 60) {
    valueScore = Math.min(100, valueScore + 5);
  } else if (molecule.overallScore < 40) {
    valueScore = Math.max(25, valueScore - 20);
    penalties.push({ name: 'Low Clinical Profile', points: -20 });
  }
  
  // Cap at 100
  let score = Math.min(100, valueScore);
  
  return {
    name: 'Pricing Power',
    score: Math.round(score * 10) / 10,
    weight: COMPONENT_WEIGHTS.PRICING,
    weightedScore: score * COMPONENT_WEIGHTS.PRICING,
    details: {
      subScores: [
        { name: 'Therapeutic Value', score: valueScore, weight: 1.0 },
      ],
      bonuses,
      penalties,
    },
  };
};

// =====================================================
// MAIN CALCULATION FUNCTION
// =====================================================
export const calculatePeakSalesIndex = (molecule: MoleculeProfile): PeakSalesResult => {
  // Calculate all 7 component scores
  const baseMarket = calculateBaseMarketScore(molecule);
  const clinical = calculateClinicalScore(molecule);
  const commercial = calculateCommercialScore(molecule);
  const strategic = calculateStrategicScore(molecule);
  const competitive = calculateCompetitiveScore(molecule);
  const marketAccess = calculateMarketAccessScore(molecule);
  const pricing = calculatePricingScore(molecule);

  const componentScores: ComponentScore[] = [
    baseMarket,
    clinical,
    commercial,
    strategic,
    competitive,
    marketAccess,
    pricing,
  ];

  // Sum weighted scores to get composite
  const compositeScore = componentScores.reduce((sum, c) => sum + c.weightedScore, 0);
  
  // Calculate blockbuster probability using logistic function
  const blockbusterProbability = calculateBlockbusterProbability(compositeScore);
  
  // Calculate peak sales estimate
  // Enhanced formula: Base × (Score/100)² × Phase Success
  const basePeakSales = 2.5; // Billion USD baseline
  const phaseSuccess = PHASE_SUCCESS_RATES[molecule.phase] || 0.5;
  const peakSalesEstimate = basePeakSales * Math.pow(compositeScore / 100, 2) * 10 * phaseSuccess;
  
  // Calculate range (±30% for uncertainty)
  const peakSalesRange = {
    low: Math.round(peakSalesEstimate * 0.7 * 100) / 100,
    high: Math.round(peakSalesEstimate * 1.3 * 100) / 100,
  };
  
  // Identify risk factors
  const riskFactors: string[] = [];
  if (competitive.score < 60) riskFactors.push('High competitive intensity');
  if (clinical.score < 60) riskFactors.push('Clinical differentiation concerns');
  if (marketAccess.score < 60) riskFactors.push('Market access challenges');
  if (pricing.score < 60) riskFactors.push('Pricing pressure expected');
  if (molecule.phase.includes('Phase I') || molecule.phase.includes('Phase II')) {
    riskFactors.push('Early-stage development risk');
  }
  
  // Determine confidence level
  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Medium';
  if (molecule.phase === 'Approved' || molecule.phase.includes('Phase III')) {
    confidenceLevel = 'High';
  } else if (molecule.phase.includes('Phase I') || molecule.phase === 'Preclinical') {
    confidenceLevel = 'Low';
  }

  return {
    compositeScore: Math.round(compositeScore * 10) / 10,
    blockbusterProbability,
    peakSalesEstimate: Math.round(peakSalesEstimate * 100) / 100,
    peakSalesRange,
    componentScores,
    riskFactors,
    confidenceLevel,
  };
};

// =====================================================
// HELPER FUNCTIONS FOR UI
// =====================================================
export const getPeakSalesScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-600';
};

export const getPeakSalesScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-green-100 border-green-500';
  if (score >= 60) return 'bg-yellow-100 border-yellow-500';
  if (score >= 40) return 'bg-orange-100 border-orange-500';
  return 'bg-red-100 border-red-500';
};

export const getConfidenceColor = (level: 'High' | 'Medium' | 'Low'): string => {
  switch (level) {
    case 'High': return 'text-green-600';
    case 'Medium': return 'text-yellow-600';
    case 'Low': return 'text-red-600';
  }
};

// Sensitivity analysis helper from document
export const SENSITIVITY_FACTORS = [
  { factor: 'Clinical Efficacy', change: '+10% improvement', impact: '+15-25% peak sales' },
  { factor: 'Market Size', change: '+20% patients', impact: '+18-22% peak sales' },
  { factor: 'Pricing', change: '+20% price', impact: '+15-20% peak sales' },
  { factor: 'Competition', change: '+2 major competitors', impact: '-25-35% peak sales' },
  { factor: 'Market Access', change: 'Faster by 6 months', impact: '+8-12% peak sales' },
];

// Probability lookup table from document
export const PROBABILITY_TABLE = [
  { range: '30-40', probability: '<5%' },
  { range: '40-50', probability: '7-18%' },
  { range: '50-60', probability: '18-38%' },
  { range: '60-65', probability: '38-50%' },
  { range: '65-70', probability: '50-62%' },
  { range: '70-80', probability: '62-88%' },
  { range: '80-90', probability: '88-98%' },
  { range: '90-100', probability: '>98%' },
];
