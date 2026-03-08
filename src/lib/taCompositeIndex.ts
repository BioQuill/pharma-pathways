// TA-specific Composite Indexes based on weighted risk factors from historical data
// Each factor has Impact (1-5), Base Weight %, Multiplier, and Adjusted Weight %

export interface LaunchFactor {
  name: string;
  impact: number; // 1-5
  baseWeight: number; // percentage
  multiplier: number;
  adjustedWeight: number; // percentage
}

export interface TACompositeIndex {
  ta: string;
  factors: LaunchFactor[];
  compositeScore: number; // 0-100 based on weighted factors
  avgApprovalTimeFDA: number; // months
  avgApprovalTimeEMA: number; // months
}

// Factor weights from Excel - all TAs share the same factor names but with different multipliers
const FACTOR_TEMPLATE: Omit<LaunchFactor, 'multiplier' | 'adjustedWeight'>[] = [
  { name: 'Scientific Target Validation', impact: 5, baseWeight: 7.35 },
  { name: 'CMC Readiness', impact: 5, baseWeight: 7.35 },
  { name: 'Regulatory Review Timeline', impact: 5, baseWeight: 7.35 },
  { name: 'Cost-Effectiveness Strength', impact: 5, baseWeight: 7.35 },
  { name: 'National Reimbursement Rules', impact: 5, baseWeight: 7.35 },
  { name: 'Clinical Endpoint Clarity', impact: 4, baseWeight: 5.88 },
  { name: 'Regulatory Dossier Quality', impact: 4, baseWeight: 5.88 },
  { name: 'Accelerated Pathway Availability', impact: 4, baseWeight: 5.88 },
  { name: 'Differentiation vs SOC', impact: 4, baseWeight: 5.88 },
  { name: 'Pricing Negotiation Environment', impact: 4, baseWeight: 5.88 },
  { name: 'Phase II Effect Size', impact: 3, baseWeight: 4.41 },
  { name: 'Trial Recruitment Speed', impact: 3, baseWeight: 4.41 },
  { name: 'Local Clinical Data Requirements', impact: 3, baseWeight: 4.41 },
  { name: 'HEOR Evidence Quality', impact: 3, baseWeight: 4.41 },
  { name: 'Health Budget Pressure', impact: 3, baseWeight: 4.41 },
  { name: 'Biomarker Availability', impact: 2, baseWeight: 2.94 },
  { name: 'Manufacturing Scalability', impact: 2, baseWeight: 2.94 },
  { name: 'Regulatory Backlog', impact: 2, baseWeight: 2.94 },
  { name: 'Safety Margin', impact: 1, baseWeight: 1.47 },
  { name: 'Response Speed to Regulators', impact: 1, baseWeight: 1.47 },
];

// TA-specific multipliers from the Excel data (key differentiators per TA)
// Most factors have multiplier 1.0, except special cases noted in data
const TA_MULTIPLIERS: Record<string, Record<string, number>> = {
  'ONCOLOGY & HEMATOLOGY': {
    'Biomarker Availability': 1.4,
  },
  'CARDIOVASCULAR': {},
  'NEUROLOGY': {},
  'PSYCHIATRY & MENTAL HEALTH': {},
  'IMMUNOLOGY & INFLAMMATION': {},
  'MUSCULOSKELETAL & RHEUMATOLOGY': {},
  'INFECTIOUS DISEASE': {},
  'RESPIRATORY & PULMONARY': {},
  'GASTROENTEROLOGY & HEPATOLOGY': {},
  'NEPHROLOGY & RENAL': {},
  'DERMATOLOGY': {},
  'OPHTHALMOLOGY': {},
  'RARE DISEASE & ORPHAN': {
    'Accelerated Pathway Availability': 1.3,
    'Regulatory Dossier Quality': 1.2,
  },
  'VACCINES & PREVENTIVE': {
    'Manufacturing Scalability': 1.5,
    'CMC Readiness': 1.3,
  },
  "WOMEN'S HEALTH": {},
  'UROLOGY': {},
  'PAIN & ANAESTHESIA': {},
  'HEMATOLOGY (NON-ONCOLOGY)': {
    'CMC Readiness': 1.6,
    'Manufacturing Scalability': 1.4,
  },
  'PEDIATRICS': {
    'Trial Recruitment Speed': 1.3,
    'Safety Margin': 1.5,
  },
  'ENDOCRINOLOGY & METABOLISM': {},
};

// Average approval times by TA (months) - based on FDA/EMA historical data
// Reference: FDA averages ~18 months, EMA ~12-15 months for standard review
// Accelerated pathways reduce these significantly
const TA_APPROVAL_TIMES: Record<string, { fda: number; ema: number }> = {
  'ONCOLOGY & HEMATOLOGY': { fda: 12, ema: 10 },
  'CARDIOVASCULAR': { fda: 18, ema: 15 },
  'NEUROLOGY': { fda: 22, ema: 18 },
  'PSYCHIATRY & MENTAL HEALTH': { fda: 20, ema: 17 },
  'IMMUNOLOGY & INFLAMMATION': { fda: 16, ema: 14 },
  'MUSCULOSKELETAL & RHEUMATOLOGY': { fda: 16, ema: 14 },
  'INFECTIOUS DISEASE': { fda: 14, ema: 12 },
  'RESPIRATORY & PULMONARY': { fda: 17, ema: 15 },
  'GASTROENTEROLOGY & HEPATOLOGY': { fda: 18, ema: 15 },
  'NEPHROLOGY & RENAL': { fda: 18, ema: 15 },
  'DERMATOLOGY': { fda: 15, ema: 13 },
  'OPHTHALMOLOGY': { fda: 16, ema: 14 },
  'RARE DISEASE & ORPHAN': { fda: 10, ema: 8 },
  'VACCINES & PREVENTIVE': { fda: 12, ema: 10 },
  "WOMEN'S HEALTH": { fda: 17, ema: 14 },
  'UROLOGY': { fda: 17, ema: 14 },
  'PAIN & ANAESTHESIA': { fda: 19, ema: 16 },
  'HEMATOLOGY (NON-ONCOLOGY)': { fda: 14, ema: 12 },
  'PEDIATRICS': { fda: 18, ema: 15 },
  'ENDOCRINOLOGY & METABOLISM': { fda: 16, ema: 14 },
  'GENERAL': { fda: 18, ema: 15 },
};

// TA-specific baseline composite scores based on historical success rates
const TA_BASELINE_SCORES: Record<string, number> = {
  'ONCOLOGY & HEMATOLOGY': 68,
  'CARDIOVASCULAR': 72,
  'NEUROLOGY': 52,
  'PSYCHIATRY & MENTAL HEALTH': 48,
  'IMMUNOLOGY & INFLAMMATION': 65,
  'MUSCULOSKELETAL & RHEUMATOLOGY': 64,
  'INFECTIOUS DISEASE': 70,
  'RESPIRATORY & PULMONARY': 66,
  'GASTROENTEROLOGY & HEPATOLOGY': 62,
  'NEPHROLOGY & RENAL': 58,
  'DERMATOLOGY': 74,
  'OPHTHALMOLOGY': 70,
  'RARE DISEASE & ORPHAN': 55,
  'VACCINES & PREVENTIVE': 68,
  "WOMEN'S HEALTH": 72,
  'UROLOGY': 70,
  'PAIN & ANAESTHESIA': 60,
  'HEMATOLOGY (NON-ONCOLOGY)': 45,
  'PEDIATRICS': 66,
  'ENDOCRINOLOGY & METABOLISM': 76,
  'GENERAL': 65,
};

/**
 * Generate the TA-specific composite index with all weighted factors
 */
export function generateTACompositeIndex(ta: string): TACompositeIndex {
  const normalizedTA = normalizeTA(ta);
  const multipliers = TA_MULTIPLIERS[normalizedTA] || {};
  const approvalTimes = TA_APPROVAL_TIMES[normalizedTA] || TA_APPROVAL_TIMES['GENERAL'];
  const baselineScore = TA_BASELINE_SCORES[normalizedTA] || TA_BASELINE_SCORES['GENERAL'];
  
  const factors: LaunchFactor[] = FACTOR_TEMPLATE.map(factor => {
    const multiplier = multipliers[factor.name] || 1.0;
    return {
      ...factor,
      multiplier,
      adjustedWeight: factor.baseWeight * multiplier,
    };
  });
  
  // Normalize adjusted weights to sum to 100%
  const totalWeight = factors.reduce((sum, f) => sum + f.adjustedWeight, 0);
  factors.forEach(f => {
    f.adjustedWeight = (f.adjustedWeight / totalWeight) * 100;
  });
  
  return {
    ta: normalizedTA,
    factors,
    compositeScore: baselineScore,
    avgApprovalTimeFDA: approvalTimes.fda,
    avgApprovalTimeEMA: approvalTimes.ema,
  };
}

/**
 * Calculate on-time approval probability based on estimated vs average approval times
 */
export function calculateOnTimeApprovalProbability(
  ta: string,
  phase: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  estimatedApprovalMonths?: number
): number {
  const taIndex = generateTACompositeIndex(ta);
  const avgFDA = taIndex.avgApprovalTimeFDA;
  
  // Base probability from TA historical data
  let baseProb = taIndex.compositeScore / 100;
  
  // Phase modifier
  const phaseModifiers: Record<string, number> = {
    'Pre-clinical': 0.4,
    'Phase I': 0.55,
    'Phase II': 0.70,
    'Phase III': 0.90,
    'NDA/BLA': 0.95,
  };
  baseProb *= phaseModifiers[phase] || 0.7;
  
  // Company track record modifier
  const trackModifiers = {
    fast: 1.15,
    average: 1.0,
    slow: 0.85,
  };
  baseProb *= trackModifiers[companyTrackRecord];
  
  // If estimated time is provided, adjust based on comparison to average
  if (estimatedApprovalMonths) {
    const ratio = avgFDA / estimatedApprovalMonths;
    if (ratio >= 1) {
      // Faster than average - increase probability
      baseProb *= Math.min(1.2, 1 + (ratio - 1) * 0.1);
    } else {
      // Slower than average - decrease probability
      baseProb *= Math.max(0.7, ratio);
    }
  }
  
  return Math.min(0.95, Math.max(0.05, baseProb));
}

/**
 * Get all 20 TA composite indexes
 */
export function getAllTACompositeIndexes(): TACompositeIndex[] {
  const tas = Object.keys(TA_BASELINE_SCORES).filter(ta => ta !== 'GENERAL');
  return tas.map(ta => generateTACompositeIndex(ta));
}

// Normalize TA string to match our canonical UPPERCASE keys
import { canonicalizeTAKey } from './taCanonical';

function normalizeTA(ta: string): string {
  return canonicalizeTAKey(ta);
}

export { normalizeTA };
