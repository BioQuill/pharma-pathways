// Probability and scoring calculations for pharmaceutical molecules
import { getTTMMonthsForTA } from './ttmData';

// ─── LPI (Launch Probability Index) — XGBoost-inspired 6-category scorer ───
// Accepts raw fields from molecules_master.min.json and returns a calibrated
// per-molecule launch probability with confidence interval.

export interface LPIResult {
  score: number;       // 0-100
  ci: string;          // e.g. "57%-75%"
  ciLow: number;
  ciHigh: number;
  label: 'High' | 'Moderate' | 'Low';
  breakdown: {
    clinical: number;
    scientific: number;
    regulatory: number;
    sponsor: number;
    market: number;
    safety: number;
  };
}

export interface LPIMoleculeRow {
  phase?: string;
  has_results?: boolean;
  status?: string;
  approval_status?: string;
  sponsor?: string;
  therapeutic_area?: string;
  study_title?: string;
  brief_summary?: string;
  conditions?: string;
}

// ── Sub-scorers ──

function scorePhase(phase: string | undefined): number {
  if (!phase) return 5;
  const p = phase.toLowerCase();
  if (/phase\s*3\s*\/\s*4|phase\s*iv|phase\s*4/i.test(p)) return 24;
  if (/phase\s*3|phase\s*iii/i.test(p)) return 22;
  if (/phase\s*2\s*\/\s*3|phase\s*ii\s*\/\s*iii/i.test(p)) return 16;
  if (/phase\s*2|phase\s*ii/i.test(p)) return 12;
  if (/phase\s*1\s*\/\s*2|phase\s*i\s*\/\s*ii/i.test(p)) return 8;
  if (/phase\s*1|phase\s*i/i.test(p) && !/phase\s*1\//i.test(p)) return 5;
  if (/nda|bla|pre-registration/i.test(p)) return 24;
  if (/approved/i.test(p)) return 24;
  return 5;
}

function scoreHasResults(hasResults: boolean | undefined): number {
  return hasResults ? 4 : 0;
}

function scoreStatus(status: string | undefined): number {
  if (!status) return 0;
  const s = status.toUpperCase();
  if (s === 'COMPLETED') return 3;
  if (s === 'RECRUITING' || s === 'ENROLLING_BY_INVITATION') return 2;
  if (s === 'ACTIVE_NOT_RECRUITING' || s === 'ACTIVE, NOT RECRUITING') return 1;
  return 0;
}

function scoreApprovalStatus(approvalStatus: string | undefined): number {
  if (!approvalStatus) return 5;
  const a = approvalStatus.toUpperCase();
  if (a.startsWith('APPROVED')) return 20;
  if (a === 'LIKELY_IN_REVIEW') return 17;
  if (a.includes('COMPLETED_PH3')) return 14;
  if (a.includes('COMPLETED_PH2')) return 10;
  if (a === 'ACTIVE_PIPELINE') return 8;
  return 5;
}

function scienceBonus(mol: LPIMoleculeRow): number {
  const phase = (mol.phase || '').toLowerCase();
  if (mol.has_results && (phase.includes('phase 3') || phase.includes('phase iii') || phase.includes('phase3'))) return 3;
  return 0;
}

function scoreRegulatory(mol: LPIMoleculeRow): number {
  let pts = 0;
  const approvalStatus = (mol.approval_status || '').toUpperCase();
  if (approvalStatus.startsWith('APPROVED')) pts += 18;
  else if (approvalStatus.includes('COMPLETED_PH3')) pts += 12;
  else if (approvalStatus === 'LIKELY_IN_REVIEW') pts += 15;
  else pts += 6;

  const text = ((mol.study_title || '') + ' ' + (mol.brief_summary || '')).toLowerCase();
  if (text.includes('breakthrough')) pts += 3;
  if (text.includes('fast track')) pts += 2;
  if (text.includes('accelerated')) pts += 2;

  const phase = (mol.phase || '').toLowerCase();
  if (mol.has_results && (phase.includes('phase 3') || phase.includes('phase iii') || phase.includes('phase3'))) pts += 3;

  return Math.min(18, pts);
}

const BIG_PHARMA = [
  'pfizer', 'roche', 'novartis', 'astrazeneca', 'johnson & johnson', 'j&j',
  'merck', 'eli lilly', 'lilly', 'bristol-myers squibb', 'bms',
  'abbvie', 'sanofi', 'gsk', 'glaxosmithkline', 'bayer',
  'boehringer ingelheim', 'boehringer', 'takeda', 'novo nordisk',
];

const LARGE_BIOTECH = [
  'amgen', 'biogen', 'regeneron', 'vertex', 'moderna', 'biontech',
  'gilead', 'alexion', 'alnylam', 'bluebird', 'seagen',
];

function scoreSponsor(sponsor: string | undefined): number {
  if (!sponsor) return 5;
  const s = sponsor.toLowerCase();
  if (BIG_PHARMA.some(p => s.includes(p))) return 15;
  if (LARGE_BIOTECH.some(p => s.includes(p))) return 12;
  if (/university|hospital|institute|national|academia/i.test(s)) return 5;
  return 8; // mid-size biotech
}

const MARKET_TIER1 = ['oncology', 'hematology', 'cardiovascular', 'neurology'];
const MARKET_TIER2 = ['endocrinology', 'metabol', 'immunology', 'inflammation', 'infectious', 'respiratory', 'pulmonary'];

function scoreMarket(ta: string | undefined): number {
  if (!ta) return 6;
  const t = ta.toLowerCase();
  if (MARKET_TIER1.some(k => t.includes(k))) return 10;
  if (MARKET_TIER2.some(k => t.includes(k))) return 8;
  return 6;
}

function scoreSafety(mol: LPIMoleculeRow): number {
  const text = ((mol.study_title || '') + ' ' + (mol.brief_summary || '') + ' ' + (mol.conditions || '')).toLowerCase();
  if (text.includes('black box') || text.includes('rems') || text.includes('boxed warning')) return 0;
  if (text.includes('well-tolerated') || text.includes('clean safety') || text.includes('well tolerated') || text.includes('favorable safety')) return 7;
  return 4; // neutral
}

/**
 * Compute LPI (Launch Probability Index) from raw molecule JSON fields.
 * 6-category XGBoost-inspired weighted model returning 30-92% calibrated score.
 */
export function computeLPI(molecule: LPIMoleculeRow): LPIResult {
  // CLINICAL (30 pts max)
  const clinicalRaw = scorePhase(molecule.phase) + scoreHasResults(molecule.has_results) + scoreStatus(molecule.status);
  const clinical = Math.min(1, clinicalRaw / 30);

  // SCIENTIFIC (20 pts max)
  const scientificRaw = scoreApprovalStatus(molecule.approval_status) + scienceBonus(molecule);
  const scientific = Math.min(1, scientificRaw / 23); // max possible = 20+3

  // REGULATORY (18 pts max)
  const regulatory = Math.min(1, scoreRegulatory(molecule) / 18);

  // SPONSOR (15 pts max)
  const sponsor = Math.min(1, scoreSponsor(molecule.sponsor) / 15);

  // MARKET (10 pts max)
  const market = Math.min(1, scoreMarket(molecule.therapeutic_area) / 10);

  // SAFETY (7 pts max)
  const safety = Math.min(1, scoreSafety(molecule) / 7);

  // Composite weighted score
  const rawScore = (clinical * 0.30) + (scientific * 0.20) + (regulatory * 0.18) + (sponsor * 0.15) + (market * 0.10) + (safety * 0.07);

  // Scale to 0-100, clamp to 25-97%
  let pLaunch = Math.min(97, Math.max(25, Math.round(rawScore * 100)));

  // Post-clamp approval bonus
  const approvalUpper = (molecule.approval_status || '').toUpperCase();
  if (approvalUpper.startsWith('APPROVED') || approvalUpper.includes('APPROVED')) {
    pLaunch = Math.min(97, pLaunch + 8);
  } else if (approvalUpper.includes('COMPLETED_PH3')) {
    pLaunch = Math.min(97, pLaunch + 4);
  }

  // Confidence interval — tighter for approved molecules
  const phase = (molecule.phase || '').toLowerCase();
  let ciWidth: number;
  if (approvalUpper.startsWith('APPROVED') || approvalUpper.includes('APPROVED')) {
    ciWidth = 4;
  } else if ((phase.includes('phase 3') || phase.includes('phase iii') || phase.includes('phase3')) && molecule.has_results) {
    ciWidth = 8;
  } else {
    ciWidth = 15;
  }
  const ciLow = Math.max(5, pLaunch - ciWidth);
  const ciHigh = Math.min(97, pLaunch + ciWidth);

  return {
    score: pLaunch,
    ci: `${ciLow}%-${ciHigh}%`,
    ciLow,
    ciHigh,
    label: pLaunch >= 75 ? 'High' : pLaunch >= 55 ? 'Moderate' : 'Low',
    breakdown: { clinical, scientific, regulatory, sponsor, market, safety },
  };
}
import { canonicalizeTAKey } from './taCanonical';

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
  'ONCOLOGY & HEMATOLOGY': { endpoints: 0.82, nextPhase: 0.78, approval: 0.75, dropoutBase: 4 },
  'NEUROLOGY': { endpoints: 0.72, nextPhase: 0.65, approval: 0.60, dropoutBase: 4 },
  'PSYCHIATRY & MENTAL HEALTH': { endpoints: 0.70, nextPhase: 0.62, approval: 0.58, dropoutBase: 4 },
  'CARDIOVASCULAR': { endpoints: 0.88, nextPhase: 0.85, approval: 0.82, dropoutBase: 2 },
  'ENDOCRINOLOGY & METABOLISM': { endpoints: 0.92, nextPhase: 0.88, approval: 0.85, dropoutBase: 2 },
  'IMMUNOLOGY & INFLAMMATION': { endpoints: 0.85, nextPhase: 0.80, approval: 0.78, dropoutBase: 3 },
  'MUSCULOSKELETAL & RHEUMATOLOGY': { endpoints: 0.84, nextPhase: 0.79, approval: 0.76, dropoutBase: 3 },
  'INFECTIOUS DISEASE': { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'RESPIRATORY & PULMONARY': { endpoints: 0.85, nextPhase: 0.81, approval: 0.78, dropoutBase: 3 },
  'GASTROENTEROLOGY & HEPATOLOGY': { endpoints: 0.83, nextPhase: 0.78, approval: 0.75, dropoutBase: 3 },
  'NEPHROLOGY & RENAL': { endpoints: 0.80, nextPhase: 0.75, approval: 0.72, dropoutBase: 3 },
  'DERMATOLOGY': { endpoints: 0.88, nextPhase: 0.85, approval: 0.82, dropoutBase: 2 },
  'OPHTHALMOLOGY': { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'RARE DISEASE & ORPHAN': { endpoints: 0.78, nextPhase: 0.72, approval: 0.68, dropoutBase: 3 },
  'VACCINES & PREVENTIVE': { endpoints: 0.80, nextPhase: 0.75, approval: 0.72, dropoutBase: 3 },
  "WOMEN'S HEALTH": { endpoints: 0.86, nextPhase: 0.82, approval: 0.80, dropoutBase: 2 },
  'UROLOGY': { endpoints: 0.85, nextPhase: 0.81, approval: 0.78, dropoutBase: 2 },
  'PAIN & ANAESTHESIA': { endpoints: 0.82, nextPhase: 0.77, approval: 0.74, dropoutBase: 3 },
  'HEMATOLOGY (NON-ONCOLOGY)': { endpoints: 0.68, nextPhase: 0.60, approval: 0.55, dropoutBase: 4 },
  'PEDIATRICS': { endpoints: 0.84, nextPhase: 0.80, approval: 0.78, dropoutBase: 2 },
  'GENERAL': { endpoints: 0.85, nextPhase: 0.80, approval: 0.78, dropoutBase: 3 },
};

// Maximum TTM (B_max) in MONTHS by therapeutic area for composite score calculation
// These are the upper bounds used in the normalized composite score formula
export const TA_MAX_TTM: Record<string, number> = {
  'ONCOLOGY & HEMATOLOGY': 132,        // 11 years
  'CARDIOVASCULAR': 162,             // 13.5 years
  'NEUROLOGY': 180,              // 15 years
  'PSYCHIATRY & MENTAL HEALTH': 126,   // 10.5 years
  'ENDOCRINOLOGY & METABOLISM': 156, // 13 years
  'IMMUNOLOGY & INFLAMMATION': 138,  // 11.5 years
  'MUSCULOSKELETAL & RHEUMATOLOGY': 126, // 10.5 years
  'INFECTIOUS DISEASE': 108,        // 9 years
  'RESPIRATORY & PULMONARY': 132,    // 11 years
  'GASTROENTEROLOGY & HEPATOLOGY': 150, // 12.5 years
  'NEPHROLOGY & RENAL': 150,           // 12.5 years
  'DERMATOLOGY': 108,                // 9 years
  'OPHTHALMOLOGY': 138,              // 11.5 years
  'RARE DISEASE & ORPHAN': 96,        // 8 years
  'VACCINES & PREVENTIVE': 90,         // 7.5 years
  "WOMEN'S HEALTH": 126,            // 10.5 years
  'UROLOGY': 120,                    // 10 years
  'PAIN & ANAESTHESIA': 108, // 9 years
  'HEMATOLOGY (NON-ONCOLOGY)': 120,       // 10 years
  'PEDIATRICS': 156,                 // 13 years
  'GENERAL': 132,                    // 11 years (average)
};

// Alias for backward compatibility
export const TA_AVERAGE_TTM = TA_MAX_TTM;

export function normalizeTherapeuticArea(ta: string): string {
  return canonicalizeTAKey(ta);
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
    'ONCOLOGY & HEMATOLOGY': { standard: 0.35, accelerated: 0.35, breakthrough: 0.20, orphan: 0.10 },
    'RARE DISEASE & ORPHAN': { standard: 0.20, accelerated: 0.25, breakthrough: 0.15, orphan: 0.40 },
    'INFECTIOUS DISEASE': { standard: 0.50, accelerated: 0.30, breakthrough: 0.15, orphan: 0.05 },
    'NEUROLOGY': { standard: 0.55, accelerated: 0.25, breakthrough: 0.15, orphan: 0.05 },
    'HEMATOLOGY (NON-ONCOLOGY)': { standard: 0.30, accelerated: 0.30, breakthrough: 0.25, orphan: 0.15 },
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

// Calculate TTM in months — phase-based calculation using ttmData.ts benchmarks
// New signature: phase, TA, sponsorType are required; approval_status, status, study_title optional
export function calculateTTMMonths(
  phase: string,
  therapeuticArea: string,
  companyTrackRecordOrSponsorType: 'fast' | 'average' | 'slow' | string,
  marketDataOrApprovalStatus?: MarketData[] | string,
  status?: string,
  study_title?: string
): number | null {
  // Get TA total TTM baseline from ttmData.ts
  const baseline = getTTMMonthsForTA(therapeuticArea);

  // Phase remaining fraction
  const phaseLower = (phase || '').toLowerCase();
  let phaseFraction: number | null = null;

  // Check approval_status first (passed as 4th arg string or from old MarketData[] compat)
  let approvalStatus = '';
  if (typeof marketDataOrApprovalStatus === 'string') {
    approvalStatus = marketDataOrApprovalStatus;
  } else if (Array.isArray(marketDataOrApprovalStatus)) {
    // Legacy callers pass MarketData[] — extract nothing, use phase only
    approvalStatus = '';
  }

  if (approvalStatus.toUpperCase().includes('APPROVED')) {
    phaseFraction = 0.07;
  } else if (approvalStatus.toUpperCase().includes('COMPLETED_PH3')) {
    phaseFraction = 0.15;
  }

  if (phaseFraction === null) {
    if (/phase\s*(3\s*\/\s*4|iv|4)/i.test(phaseLower)) phaseFraction = 0.18;
    else if (/phase\s*(iii|3)/i.test(phaseLower) && !/\//i.test(phaseLower.replace(/phase\s*(iii|3)/i, ''))) phaseFraction = 0.23;
    else if (/phase\s*(ii\s*\/\s*iii|2\s*\/\s*3)/i.test(phaseLower)) phaseFraction = 0.35;
    else if (/phase\s*(ii|2)/i.test(phaseLower) && !/\//i.test(phaseLower.replace(/phase\s*(ii|2)/i, ''))) phaseFraction = 0.48;
    else if (/phase\s*(i\s*\/\s*ii|1\s*\/\s*2)/i.test(phaseLower)) phaseFraction = 0.65;
    else if (/phase\s*(i|1)/i.test(phaseLower)) phaseFraction = 0.73;
    else if (/nda|bla|pre-registration/i.test(phaseLower)) phaseFraction = 0.15;
    else if (/approved/i.test(phaseLower)) phaseFraction = 0.07;
    else return null; // unrecognised phase
  }

  // Sponsor speed modifier
  let sponsorMod = 1.0;
  const sType = companyTrackRecordOrSponsorType;
  if (sType === 'fast') sponsorMod = 0.85;
  else if (sType === 'slow') sponsorMod = 1.20;
  else if (sType === 'average') sponsorMod = 1.0;
  // Also support sponsorType strings from B2 spec
  else if (sType === 'big_pharma' || sType === 'top_10_pharma' || sType === 'top_20_pharma') sponsorMod = 0.85;
  else if (sType === 'large_biotech' || sType === 'mid_pharma') sponsorMod = 1.0;
  else sponsorMod = 1.20; // mid_biotech, unknown, academic

  // Pathway modifier from study_title keywords
  let pathwayMod = 1.0;
  const titleLower = (study_title || '').toLowerCase();
  if (titleLower.includes('breakthrough') || titleLower.includes('accelerated')) {
    pathwayMod = 0.80;
  } else if (titleLower.includes('fast track') || titleLower.includes('priority review')) {
    pathwayMod = 0.85;
  } else if (titleLower.includes('orphan')) {
    pathwayMod = 0.90;
  }

  // Status modifier
  let statusMod = 1.0;
  const statusUpper = (status || '').toUpperCase();
  if (statusUpper === 'ACTIVE_NOT_RECRUITING' || statusUpper === 'ACTIVE, NOT RECRUITING') {
    statusMod = 0.90;
  } else if (statusUpper === 'COMPLETED') {
    statusMod = 0.85;
  }

  const ttm = Math.round(baseline * phaseFraction * sponsorMod * pathwayMod * statusMod);
  return Math.max(1, ttm);
}

// normalizeTherapeuticArea is exported above

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

// Deterministic seeded random helpers (replaces Math.random() — H1.5 Bonus Fix)
function hashCodeForSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function seededRandomValue(seed: number): number {
  const s = ((seed * 1664525 + 1013904223) & 0x7fffffff);
  return s / 0x7fffffff;
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

    // Deterministic seeded random based on molecule name + market code
    const seed = hashCodeForSeed(molecule + market.code);
    const r1 = seededRandomValue(seed);
    const r2 = seededRandomValue(seed + 7919);

    return {
      country: market.name,
      countryCode: market.code,
      estimatedLaunchDate: launchDate.toISOString().split('T')[0],
      marketAccessStrategy: generateMarketAccessStrategy(market.code),
      revenueProjection: {
        year1: Math.round(baseRevenue * multiplier * (0.3 + r1 * 0.2)),
        year2: Math.round(baseRevenue * multiplier * (0.6 + r2 * 0.3)),
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
