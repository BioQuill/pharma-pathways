// Probability and scoring calculations for pharmaceutical molecules
import { getTTMMonthsForTA } from './ttmData';

export interface ProbabilityScores {
  meetingEndpoints: number; // 0-1
  nextPhase: number; // 0-1
  dropoutRanking: 1 | 2 | 3 | 4 | 5; // 1=lowest, 5=highest dropout rate
  approval: number; // 0-1
  regulatoryPathway: {
    standard: number;
    accelerated: number;
    breakthrough: number;
    orphan: number;
  };
}

export interface MarketData {
  country: string;
  countryCode: string;
  estimatedLaunchDate: string;
  marketAccessStrategy: {
    hta: number; // probability 0-1
    valueBased: number;
    volumeBased: number;
    other: number;
  };
  revenueProjection: {
    year1: number; // in millions USD
    year2: number;
  };
  regulatoryComplexity: number; // 0-1
}

export const MARKETS = [
  { code: 'US', name: 'United States', region: 'North America' },
  { code: 'CN', name: 'China', region: 'Asia-Pacific' },
  { code: 'DE', name: 'Germany/EU', region: 'Europe' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'UK', name: 'United Kingdom', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'CA', name: 'Canada', region: 'North America' },
  { code: 'BR', name: 'Brazil', region: 'Latin America' },
];

// Special handling for failed trials
export function calculateFailedTrialScores(): ProbabilityScores {
  return {
    meetingEndpoints: 0,
    nextPhase: 0,
    dropoutRanking: 1, // Low dropout despite failure shows good trial execution
    approval: 0,
    regulatoryPathway: {
      standard: 0,
      accelerated: 0,
      breakthrough: 0,
      orphan: 0,
    },
  };
}

// TA-specific success rate modifiers based on historical industry data
const TA_SUCCESS_MODIFIERS: Record<string, { endpoints: number; nextPhase: number; approval: number; dropoutBase: number }> = {
  'ONCOLOGY/HEMATOLOGY': { endpoints: 0.82, nextPhase: 0.78, approval: 0.75, dropoutBase: 4 },
  'NEUROLOGY/CNS': { endpoints: 0.72, nextPhase: 0.65, approval: 0.60, dropoutBase: 4 },
  'PSYCHIATRY/MENTAL HEALTH': { endpoints: 0.70, nextPhase: 0.62, approval: 0.58, dropoutBase: 4 },
  'CARDIOVASCULAR': { endpoints: 0.88, nextPhase: 0.85, approval: 0.82, dropoutBase: 2 },
  'ENDOCRINOLOGY & METABOLISM': { endpoints: 0.92, nextPhase: 0.88, approval: 0.85, dropoutBase: 2 },
  'IMMUNOLOGY & INFLAMMATION': { endpoints: 0.85, nextPhase: 0.80, approval: 0.78, dropoutBase: 3 },
  'RHEUMATOLOGY': { endpoints: 0.84, nextPhase: 0.79, approval: 0.76, dropoutBase: 3 },
  'INFECTIOUS DISEASES': { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'RESPIRATORY/PULMONOLOGY': { endpoints: 0.85, nextPhase: 0.81, approval: 0.78, dropoutBase: 3 },
  'GASTROENTEROLOGY & HEPATOLOGY': { endpoints: 0.83, nextPhase: 0.78, approval: 0.75, dropoutBase: 3 },
  'NEPHROLOGY/RENAL': { endpoints: 0.80, nextPhase: 0.75, approval: 0.72, dropoutBase: 3 },
  'DERMATOLOGY': { endpoints: 0.88, nextPhase: 0.85, approval: 0.82, dropoutBase: 2 },
  'OPHTHALMOLOGY': { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'RARE DISEASES/ORPHAN': { endpoints: 0.78, nextPhase: 0.72, approval: 0.68, dropoutBase: 3 },
  'VACCINES & VIROLOGY': { endpoints: 0.80, nextPhase: 0.75, approval: 0.72, dropoutBase: 3 },
  'WOMEN\'S HEALTH': { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'UROLOGY': { endpoints: 0.85, nextPhase: 0.81, approval: 0.78, dropoutBase: 2 },
  'PAIN MANAGEMENT/ANESTHESIA': { endpoints: 0.82, nextPhase: 0.77, approval: 0.74, dropoutBase: 3 },
  'TRANSPLANT/CELL-GENE': { endpoints: 0.68, nextPhase: 0.60, approval: 0.55, dropoutBase: 4 },
  'PEDIATRICS': { endpoints: 0.84, nextPhase: 0.80, approval: 0.78, dropoutBase: 2 },
  'GENERAL': { endpoints: 0.85, nextPhase: 0.80, approval: 0.78, dropoutBase: 3 },
};

// Maximum TTM (B_max) in MONTHS by therapeutic area for composite score calculation
// These are the upper bounds used in the normalized composite score formula
export const TA_MAX_TTM: Record<string, number> = {
  'ONCOLOGY/HEMATOLOGY': 132,        // 11 years
  'CARDIOVASCULAR': 162,             // 13.5 years
  'NEUROLOGY/CNS': 180,              // 15 years
  'PSYCHIATRY/MENTAL HEALTH': 126,   // 10.5 years
  'ENDOCRINOLOGY & METABOLISM': 156, // 13 years
  'IMMUNOLOGY & INFLAMMATION': 138,  // 11.5 years
  'RHEUMATOLOGY': 126,               // 10.5 years
  'INFECTIOUS DISEASES': 108,        // 9 years
  'RESPIRATORY/PULMONOLOGY': 132,    // 11 years
  'GASTROENTEROLOGY & HEPATOLOGY': 150, // 12.5 years
  'NEPHROLOGY/RENAL': 150,           // 12.5 years
  'DERMATOLOGY': 108,                // 9 years
  'OPHTHALMOLOGY': 138,              // 11.5 years
  'RARE DISEASES/ORPHAN': 96,        // 8 years
  'VACCINES & VIROLOGY': 90,         // 7.5 years
  'WOMEN\'S HEALTH': 126,            // 10.5 years
  'UROLOGY': 120,                    // 10 years
  'PAIN MANAGEMENT/ANESTHESIA': 108, // 9 years
  'TRANSPLANT/CELL-GENE': 120,       // 10 years
  'PEDIATRICS': 156,                 // 13 years
  'GENERAL': 132,                    // 11 years (average)
};

// Alias for backward compatibility
export const TA_AVERAGE_TTM = TA_MAX_TTM;

// Normalize therapeutic area string to key
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
  if (taLower.includes('psych') || taLower.includes('mental')) {
    return 'PSYCHIATRY/MENTAL HEALTH';
  }
  if (taLower.includes('immun') || taLower.includes('inflam')) {
    return 'IMMUNOLOGY & INFLAMMATION';
  }
  if (taLower.includes('rheum') || taLower.includes('arthritis')) {
    return 'RHEUMATOLOGY';
  }
  if (taLower.includes('infect') || taLower.includes('virus') || taLower.includes('bacter')) {
    return 'INFECTIOUS DISEASES';
  }
  if (taLower.includes('respir') || taLower.includes('pulmon') || taLower.includes('lung')) {
    return 'RESPIRATORY/PULMONOLOGY';
  }
  if (taLower.includes('gastro') || taLower.includes('hepat') || taLower.includes('liver')) {
    return 'GASTROENTEROLOGY & HEPATOLOGY';
  }
  if (taLower.includes('nephro') || taLower.includes('renal') || taLower.includes('kidney')) {
    return 'NEPHROLOGY/RENAL';
  }
  if (taLower.includes('derma') || taLower.includes('skin')) {
    return 'DERMATOLOGY';
  }
  if (taLower.includes('ophthal') || taLower.includes('eye')) {
    return 'OPHTHALMOLOGY';
  }
  if (taLower.includes('rare') || taLower.includes('orphan')) {
    return 'RARE DISEASES/ORPHAN';
  }
  if (taLower.includes('vaccin') || taLower.includes('virol')) {
    return 'VACCINES & VIROLOGY';
  }
  if (taLower.includes('women') || taLower.includes('gynec') || taLower.includes('obstet')) {
    return 'WOMEN\'S HEALTH';
  }
  if (taLower.includes('urol') || taLower.includes('prostat')) {
    return 'UROLOGY';
  }
  if (taLower.includes('pain') || taLower.includes('anesth')) {
    return 'PAIN MANAGEMENT/ANESTHESIA';
  }
  if (taLower.includes('transplant') || taLower.includes('cell') || taLower.includes('gene')) {
    return 'TRANSPLANT/CELL-GENE';
  }
  if (taLower.includes('pediatr') || taLower.includes('child')) {
    return 'PEDIATRICS';
  }
  if (taLower.includes('metabol') || taLower.includes('diabet') || taLower.includes('endocrin') || taLower.includes('obesity')) {
    return 'ENDOCRINOLOGY & METABOLISM';
  }
  
  return 'GENERAL';
}

// Calculate probability scores based on historical data patterns
export function calculateProbabilityScores(
  phase: string,
  indication: string,
  therapeuticArea: string,
  isFailed: boolean = false
): ProbabilityScores {
  // Handle failed trials immediately
  if (isFailed) {
    return calculateFailedTrialScores();
  }
  
  // Base probabilities vary by phase (historical industry averages)
  const phaseFactors = {
    'Phase I': { endpoints: 0.65, nextPhase: 0.52, approval: 0.095 },
    'Phase II': { endpoints: 0.48, nextPhase: 0.36, approval: 0.18 },
    'Phase III': { endpoints: 0.58, nextPhase: 0.82, approval: 0.58 },
    'Pre-clinical': { endpoints: 0.45, nextPhase: 0.40, approval: 0.05 },
  };

  const base = phaseFactors[phase as keyof typeof phaseFactors] || phaseFactors['Phase II'];
  
  // Get TA-specific modifiers
  const normalizedTA = normalizeTherapeuticArea(therapeuticArea);
  const taModifiers = TA_SUCCESS_MODIFIERS[normalizedTA] || TA_SUCCESS_MODIFIERS['GENERAL'];
  
  // Dropout ranking based on phase and therapeutic area complexity
  const dropoutRanking = calculateDropoutRanking(phase, therapeuticArea, taModifiers.dropoutBase);

  // Calculate regulatory pathway probabilities based on TA
  const regulatoryPathway = calculateRegulatoryPathwayProbabilities(normalizedTA, phase);

  return {
    meetingEndpoints: Math.min(0.95, base.endpoints * taModifiers.endpoints),
    nextPhase: Math.min(0.95, base.nextPhase * taModifiers.nextPhase),
    dropoutRanking,
    approval: Math.min(0.95, base.approval * taModifiers.approval),
    regulatoryPathway,
  };
}

function calculateDropoutRanking(phase: string, therapeuticArea: string, taDropoutBase: number): 1 | 2 | 3 | 4 | 5 {
  // Phase modifier
  const phaseModifier: Record<string, number> = {
    'Pre-clinical': 1,
    'Phase I': 0,
    'Phase II': -1,
    'Phase III': -2,
    'NDA/BLA': -3,
  };
  
  const pMod = phaseModifier[phase] ?? 0;
  const raw = taDropoutBase + pMod;
  
  // Clamp to 1-5 range
  return Math.max(1, Math.min(5, raw)) as 1 | 2 | 3 | 4 | 5;
}

function calculateRegulatoryPathwayProbabilities(normalizedTA: string, phase: string): ProbabilityScores['regulatoryPathway'] {
  // TA-specific regulatory pathway probabilities
  const taPathways: Record<string, { standard: number; accelerated: number; breakthrough: number; orphan: number }> = {
    'ONCOLOGY/HEMATOLOGY': { standard: 0.35, accelerated: 0.35, breakthrough: 0.20, orphan: 0.10 },
    'RARE DISEASES/ORPHAN': { standard: 0.20, accelerated: 0.25, breakthrough: 0.15, orphan: 0.40 },
    'INFECTIOUS DISEASES': { standard: 0.50, accelerated: 0.30, breakthrough: 0.15, orphan: 0.05 },
    'NEUROLOGY/CNS': { standard: 0.55, accelerated: 0.25, breakthrough: 0.15, orphan: 0.05 },
    'TRANSPLANT/CELL-GENE': { standard: 0.30, accelerated: 0.30, breakthrough: 0.25, orphan: 0.15 },
    'GENERAL': { standard: 0.60, accelerated: 0.25, breakthrough: 0.10, orphan: 0.05 },
  };
  
  return taPathways[normalizedTA] || taPathways['GENERAL'];
}

// Calculate TTM% - time remaining as percentage of total TTM for the therapeutic area
// Uses TTM Breakdown data (TTM_BREAKDOWN_DATA.totalMonths) for TA-specific total development time
export function calculateTTMPercent(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  marketData: MarketData[]
): number | null {
  if (marketData.length === 0 || marketData[0].estimatedLaunchDate === 'N/A - Trial Failed') {
    return null;
  }
  
  // Get total TTM months for TA from TTM Breakdown chart data
  const totalTTMMonths = getTTMMonthsForTA(therapeuticArea);
  
  // Get US launch date as primary reference
  const usMarket = marketData.find(m => m.countryCode === 'US');
  if (!usMarket) return null;
  
  const launchDate = new Date(usMarket.estimatedLaunchDate);
  const now = new Date();
  const monthsRemaining = (launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  // TTM% = (remaining time / total TTM for TA) * 100
  const ttmPercent = (monthsRemaining / totalTTMMonths) * 100;
  
  return Math.max(0, Math.min(100, Math.round(ttmPercent)));
}

// Calculate TTM in months - expected months from current stage to first regulatory approval
export function calculateTTMMonths(
  phase: string,
  therapeuticArea: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  marketData: MarketData[]
): number | null {
  if (marketData.length === 0 || marketData[0].estimatedLaunchDate === 'N/A - Trial Failed') {
    return null;
  }
  
  // Get US launch date as primary reference (first approval)
  const usMarket = marketData.find(m => m.countryCode === 'US');
  if (!usMarket) return null;
  
  const launchDate = new Date(usMarket.estimatedLaunchDate);
  const now = new Date();
  const monthsRemaining = Math.round((launchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  return Math.max(0, monthsRemaining);
}

export { normalizeTherapeuticArea };

// Generate empty market projections for failed trials
export function generateFailedTrialMarketProjections(): MarketData[] {
  return MARKETS.map(market => ({
    country: market.name,
    countryCode: market.code,
    estimatedLaunchDate: 'N/A - Trial Failed',
    marketAccessStrategy: {
      hta: 0,
      valueBased: 0,
      volumeBased: 0,
      other: 0,
    },
    revenueProjection: {
      year1: 0,
      year2: 0,
    },
    regulatoryComplexity: 0,
  }));
}

// Generate market-specific projections based on company track record and regulatory landscape
export function generateMarketProjections(
  molecule: string,
  phase: string,
  indication: string,
  companyTrackRecord: 'fast' | 'average' | 'slow' = 'average',
  isFailed: boolean = false
): MarketData[] {
  // Handle failed trials immediately
  if (isFailed) {
    return generateFailedTrialMarketProjections();
  }
  const baseDate = new Date();
  const phaseDelays = {
    'Pre-clinical': 48,
    'Phase I': 36,
    'Phase II': 30,
    'Phase III': 18,
  };
  
  const baseMonths = phaseDelays[phase as keyof typeof phaseDelays] || 24;
  
  // Company track record modifier
  const trackRecordModifier = {
    fast: 0.85,
    average: 1.0,
    slow: 1.15,
  };

  return MARKETS.map((market, index) => {
    // Market-specific launch delays
    const marketDelays = {
      US: 0,
      CN: 18,
      DE: 6,
      JP: 12,
      FR: 8,
      IT: 10,
      UK: 4,
      ES: 9,
      CA: 3,
      BR: 24,
    };

    const totalMonths = Math.round(
      baseMonths * trackRecordModifier[companyTrackRecord] + 
      (marketDelays[market.code as keyof typeof marketDelays] || 12)
    );

    const launchDate = new Date(baseDate);
    launchDate.setMonth(launchDate.getMonth() + totalMonths);

    // Revenue projections based on market size
    const marketSizeMultiplier = {
      US: 1.0,
      CN: 0.45,
      DE: 0.25,
      JP: 0.30,
      FR: 0.18,
      IT: 0.14,
      UK: 0.15,
      ES: 0.12,
      CA: 0.08,
      BR: 0.12,
    };

    const baseRevenue = 250; // Base $250M for major market
    const multiplier = marketSizeMultiplier[market.code as keyof typeof marketSizeMultiplier] || 0.1;

    return {
      country: market.name,
      countryCode: market.code,
      estimatedLaunchDate: launchDate.toISOString().split('T')[0],
      marketAccessStrategy: generateMarketAccessStrategy(market.code),
      revenueProjection: {
        year1: Math.round(baseRevenue * multiplier * (0.3 + Math.random() * 0.2)),
        year2: Math.round(baseRevenue * multiplier * (0.6 + Math.random() * 0.3)),
      },
      regulatoryComplexity: calculateRegulatoryComplexity(market.code),
    };
  });
}

function generateMarketAccessStrategy(countryCode: string): MarketData['marketAccessStrategy'] {
  // Market access strategies vary by healthcare system
  const strategies = {
    US: { hta: 0.15, valueBased: 0.50, volumeBased: 0.20, other: 0.15 },
    CN: { hta: 0.40, valueBased: 0.15, volumeBased: 0.35, other: 0.10 },
    DE: { hta: 0.80, valueBased: 0.10, volumeBased: 0.05, other: 0.05 },
    JP: { hta: 0.60, valueBased: 0.20, volumeBased: 0.15, other: 0.05 },
    FR: { hta: 0.85, valueBased: 0.08, volumeBased: 0.04, other: 0.03 },
    IT: { hta: 0.80, valueBased: 0.10, volumeBased: 0.06, other: 0.04 },
    UK: { hta: 0.85, valueBased: 0.08, volumeBased: 0.04, other: 0.03 },
    ES: { hta: 0.75, valueBased: 0.12, volumeBased: 0.08, other: 0.05 },
    CA: { hta: 0.75, valueBased: 0.15, volumeBased: 0.05, other: 0.05 },
    BR: { hta: 0.45, valueBased: 0.20, volumeBased: 0.25, other: 0.10 },
  };

  return strategies[countryCode as keyof typeof strategies] || strategies.US;
}

function calculateRegulatoryComplexity(countryCode: string): number {
  // 0 = simple, 1 = highly complex
  const complexity = {
    US: 0.70,
    CN: 0.90,
    DE: 0.75,
    JP: 0.85,
    FR: 0.72,
    IT: 0.70,
    UK: 0.60,
    ES: 0.68,
    CA: 0.65,
    BR: 0.80,
  };

  return complexity[countryCode as keyof typeof complexity] || 0.70;
}

// Calculate time to blockbuster ($1B cumulative sales) in years
export function calculateTimeToBlockbuster(marketData: MarketData[]): number | null {
  if (marketData.length === 0 || marketData[0].estimatedLaunchDate === 'N/A - Trial Failed') {
    return null;
  }
  
  const year1Total = marketData.reduce((sum, m) => sum + m.revenueProjection.year1, 0);
  const year2Total = marketData.reduce((sum, m) => sum + m.revenueProjection.year2, 0);
  
  // Estimate annual growth rate from year1 to year2
  const growthRate = year1Total > 0 ? (year2Total / year1Total) : 1.5;
  
  let cumulativeRevenue = 0;
  let years = 0;
  let annualRevenue = year1Total;
  
  // Project forward until we hit $1B (1000M)
  while (cumulativeRevenue < 1000 && years < 20) {
    years++;
    if (years === 1) {
      cumulativeRevenue += year1Total;
    } else if (years === 2) {
      cumulativeRevenue += year2Total;
      annualRevenue = year2Total;
    } else {
      annualRevenue = annualRevenue * growthRate;
      cumulativeRevenue += annualRevenue;
    }
  }
  
  return years < 20 ? years : null; // null if never reaches blockbuster
}

// Revenue score based on time to blockbuster (0-1)
export function calculateRevenueScore(marketData: MarketData[]): number {
  const timeToBlockbuster = calculateTimeToBlockbuster(marketData);
  
  if (timeToBlockbuster === null) return 0;
  
  // Score based on years to blockbuster:
  // 1-2 years: 1.0 (excellent)
  // 3-4 years: 0.8 (very good)
  // 5-6 years: 0.6 (good)
  // 7-10 years: 0.4 (moderate)
  // 11-15 years: 0.2 (slow)
  // 16+ years: 0.1 (very slow)
  if (timeToBlockbuster <= 2) return 1.0;
  if (timeToBlockbuster <= 4) return 0.8;
  if (timeToBlockbuster <= 6) return 0.6;
  if (timeToBlockbuster <= 10) return 0.4;
  if (timeToBlockbuster <= 15) return 0.2;
  return 0.1;
}

/**
 * Calculate Composite Score using TA-specific normalization formula
 * 
 * Formula:
 * - A_norm = (A - 1) / 99  where A = LPI-3 score (1-100)
 * - B_norm = (B - 1) / (B_max - 1)  where B = TTM in months, B_max = TA-specific maximum TTM
 * - Score = 100 * (w_A * A_norm + w_B * (1 - B_norm))
 * 
 * Weights: w_A = 0.7 (LPI), w_B = 0.3 (TTM efficiency)
 * 
 * Higher LPI = better, Lower TTM = better
 * Score ranges from ~49 (worst: A=50, B=50, low Bmax) to ~78 (best: A=100, B=100, high Bmax)
 */
export function calculateCompositeScore(
  lpiScore: number,        // A: LPI-3 score (0-100)
  ttmMonths: number | null, // B: TTM in months
  therapeuticArea: string   // Used to get B_max
): number {
  // If no TTM data, return LPI with slight penalty
  if (ttmMonths === null || ttmMonths <= 0) {
    return Math.round(lpiScore * 0.7); // 70% of LPI when TTM unavailable
  }
  
  const normalizedTA = normalizeTherapeuticArea(therapeuticArea);
  const bMax = TA_MAX_TTM[normalizedTA] || TA_MAX_TTM['GENERAL'];
  
  // Clamp LPI to 1-100 range (avoid division issues)
  const A = Math.max(1, Math.min(100, lpiScore));
  // Clamp TTM to 1-Bmax range
  const B = Math.max(1, Math.min(bMax, ttmMonths));
  
  // Normalize A: (A - 1) / 99
  const aNorm = (A - 1) / 99;
  
  // Normalize B: (B - 1) / (B_max - 1)
  const bNorm = (B - 1) / (bMax - 1);
  
  // Weights
  const wA = 0.7; // LPI weight
  const wB = 0.3; // TTM efficiency weight
  
  // Score = 100 * (w_A * A_norm + w_B * (1 - B_norm))
  const score = 100 * (wA * aNorm + wB * (1 - bNorm));
  
  return Math.round(Math.max(0, Math.min(100, score)));
}

// Phase-specific success rates from industry analysis
// Phase III: 30-40% success rate, 75% of development costs
// Regulatory: 40% of delays
// Manufacturing/Supply: 15% of delays
// 100% of launches experience delays (45% internal, 40% regulatory, 15% supply chain)
export const PHASE_SUCCESS_RATES: Record<string, number> = {
  'Pre-clinical': 0.10,
  'Phase I': 0.52,
  'Phase II': 0.36,
  'Phase III': 0.35, // 30-40% average
  'NDA/BLA': 0.85
};

// Calculate Launch Probability Score (0-100%)
// Enhanced calculation incorporating TA Composite Index, Manufacturing Capability,
// ranked factor analysis and industry risk data
export function calculateOverallScore(
  scores: ProbabilityScores, 
  marketData: MarketData[],
  phase: string = 'Phase II',
  therapeuticArea: string = 'GENERAL',
  scaleUpIndex: 1 | 2 | 3 | 4 | 5 = 3
): number {
  const revenueScore = calculateRevenueScore(marketData);
  const phaseSuccessRate = PHASE_SUCCESS_RATES[phase] || 0.36;
  
  // Get TA Composite Score (0-100) and normalize to 0-1
  const normalizedTA = normalizeTherapeuticArea(therapeuticArea);
  const taBaselineScores: Record<string, number> = {
    'ONCOLOGY/HEMATOLOGY': 68,
    'CARDIOVASCULAR': 72,
    'NEUROLOGY/CNS': 52,
    'PSYCHIATRY/MENTAL HEALTH': 48,
    'IMMUNOLOGY & INFLAMMATION': 65,
    'RHEUMATOLOGY': 64,
    'INFECTIOUS DISEASES': 70,
    'RESPIRATORY/PULMONOLOGY': 66,
    'GASTROENTEROLOGY & HEPATOLOGY': 62,
    'NEPHROLOGY/RENAL': 58,
    'DERMATOLOGY': 74,
    'OPHTHALMOLOGY': 70,
    'RARE DISEASES/ORPHAN': 55,
    'VACCINES & VIROLOGY': 68,
    'WOMEN\'S HEALTH': 72,
    'UROLOGY': 70,
    'PAIN MANAGEMENT/ANESTHESIA': 60,
    'TRANSPLANT/CELL-GENE': 45,
    'PEDIATRICS': 66,
    'ENDOCRINOLOGY & METABOLISM': 76,
    'GENERAL': 65,
  };
  const taCompositeScore = (taBaselineScores[normalizedTA] || 65) / 100;
  
  // Normalize Scale-Up Index (1-5) to 0-1
  const scaleUpScore = (scaleUpIndex - 1) / 4;
  
  // Enhanced weighted calculation incorporating all key factors:
  // - Phase-specific success rate: 25% (most critical - Phase III has 30-40% success)
  // - TA Composite Index: 20% (TA-specific risk profile)
  // - Approval probability: 15% (regulatory pathway)
  // - Manufacturing/Scale-Up Capability: 15% (production readiness)
  // - Meeting Endpoints: 10% (efficacy validation)
  // - Revenue Potential: 10% (market viability)
  // - Dropout/Execution Risk: 5%
  const launchProbability = (
    phaseSuccessRate * 0.25 +
    taCompositeScore * 0.20 +
    scores.approval * 0.15 +
    scaleUpScore * 0.15 +
    scores.meetingEndpoints * 0.10 +
    revenueScore * 0.10 +
    (6 - scores.dropoutRanking) / 5 * 0.05
  );

  return Math.round(launchProbability * 100);
}
