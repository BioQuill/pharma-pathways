// Probability and scoring calculations for pharmaceutical molecules

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
  { code: 'CA', name: 'Canada', region: 'North America' },
  { code: 'DE', name: 'Germany/EU', region: 'Europe' },
  { code: 'UK', name: 'United Kingdom', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'CN', name: 'China', region: 'Asia-Pacific' },
  { code: 'BR', name: 'Brazil', region: 'Latin America' },
  { code: 'RU', name: 'Russia', region: 'Eastern Europe' },
  { code: 'GULF', name: 'Gulf States', region: 'Middle East' },
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
  
  // Therapeutic area modifiers (oncology has different success rates than cardiology)
  const therapeuticModifier = therapeuticArea.toLowerCase().includes('oncology') ? 0.85 : 1.1;
  
  // Dropout ranking based on phase and therapeutic area complexity
  const dropoutRanking = calculateDropoutRanking(phase, therapeuticArea);

  return {
    meetingEndpoints: Math.min(0.95, base.endpoints * therapeuticModifier),
    nextPhase: Math.min(0.95, base.nextPhase * therapeuticModifier),
    dropoutRanking,
    approval: Math.min(0.95, base.approval * therapeuticModifier),
    regulatoryPathway: {
      standard: 0.60,
      accelerated: 0.25,
      breakthrough: 0.10,
      orphan: 0.05,
    },
  };
}

function calculateDropoutRanking(phase: string, therapeuticArea: string): 1 | 2 | 3 | 4 | 5 {
  // Higher dropout rates for earlier phases and complex therapeutic areas
  if (phase === 'Pre-clinical') return 4;
  if (phase === 'Phase I') return 3;
  if (phase === 'Phase II') {
    return therapeuticArea.toLowerCase().includes('oncology') ? 4 : 3;
  }
  if (phase === 'Phase III') return 2;
  return 1;
}

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
      CA: 3,
      DE: 6,
      UK: 4,
      CH: 5,
      JP: 12,
      CN: 18,
      BR: 24,
      RU: 30,
      GULF: 36,
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
      CA: 0.08,
      DE: 0.25,
      UK: 0.15,
      CH: 0.05,
      JP: 0.30,
      CN: 0.45,
      BR: 0.12,
      RU: 0.08,
      GULF: 0.10,
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
    CA: { hta: 0.75, valueBased: 0.15, volumeBased: 0.05, other: 0.05 },
    DE: { hta: 0.80, valueBased: 0.10, volumeBased: 0.05, other: 0.05 },
    UK: { hta: 0.85, valueBased: 0.08, volumeBased: 0.04, other: 0.03 },
    CH: { hta: 0.70, valueBased: 0.20, volumeBased: 0.05, other: 0.05 },
    JP: { hta: 0.60, valueBased: 0.20, volumeBased: 0.15, other: 0.05 },
    CN: { hta: 0.40, valueBased: 0.15, volumeBased: 0.35, other: 0.10 },
    BR: { hta: 0.45, valueBased: 0.20, volumeBased: 0.25, other: 0.10 },
    RU: { hta: 0.30, valueBased: 0.20, volumeBased: 0.40, other: 0.10 },
    GULF: { hta: 0.50, valueBased: 0.30, volumeBased: 0.15, other: 0.05 },
  };

  return strategies[countryCode as keyof typeof strategies] || strategies.US;
}

function calculateRegulatoryComplexity(countryCode: string): number {
  // 0 = simple, 1 = highly complex
  const complexity = {
    US: 0.70,
    CA: 0.65,
    DE: 0.75,
    UK: 0.60,
    CH: 0.55,
    JP: 0.85,
    CN: 0.90,
    BR: 0.80,
    RU: 0.95,
    GULF: 0.70,
  };

  return complexity[countryCode as keyof typeof complexity] || 0.70;
}

// Calculate Launch Probability Score (0-100%)
// This represents the estimated probability of successful market launch
// based on clinical trial success rates and regulatory approval likelihood
export function calculateOverallScore(scores: ProbabilityScores, marketData: MarketData[]): number {
  // Launch Probability is calculated as a weighted average of key success factors:
  // - Meeting Endpoints (25%): Probability of achieving primary endpoints
  // - Next Phase (20%): Probability of advancing to next development phase
  // - Approval (40%): Overall probability of regulatory approval
  // - Dropout Risk (15%): Inverse of dropout ranking (lower dropout = higher score)
  const launchProbability = (
    scores.meetingEndpoints * 0.25 +
    scores.nextPhase * 0.20 +
    scores.approval * 0.40 +
    (6 - scores.dropoutRanking) / 5 * 0.15 // Invert dropout ranking
  );

  return Math.round(launchProbability * 100);
}
