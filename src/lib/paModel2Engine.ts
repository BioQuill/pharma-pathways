/**
 * PA Index-2 (Comparative Payer Likelihood Matrix) Engine
 * Extracted from PAModel2Dashboard.tsx — pure calculation function.
 * DO NOT modify weights or scoring logic — extract only (H1.5 Fix 3).
 */

export interface PAModel2MarketResult {
  market: string;
  flag: string;
  baseRate: number;
  adjustedRate: number;
  band: string;
}

export interface PAModel2Result {
  markets: PAModel2MarketResult[];
  avgRate: number;
  signal: string;
}

// Historical base rates by TA from PAModel2Dashboard
const HISTORICAL_BASE_RATES: Record<string, Record<string, number>> = {
  'Oncology & Hematology':         { us: 75, uk: 70, de: 55, jp: 35, cn: 30, in: 25, br: 35, au: 68 },
  'Cardiovascular':                { us: 60, uk: 45, de: 45, jp: 25, cn: 25, in: 20, br: 25, au: 50 },
  'Neurology':                     { us: 65, uk: 50, de: 50, jp: 30, cn: 28, in: 18, br: 28, au: 52 },
  'Psychiatry & Mental Health':    { us: 62, uk: 48, de: 46, jp: 28, cn: 26, in: 15, br: 24, au: 48 },
  'Endocrinology & Metabolism':    { us: 58, uk: 42, de: 40, jp: 28, cn: 22, in: 15, br: 22, au: 45 },
  'Immunology & Inflammation':     { us: 68, uk: 48, de: 50, jp: 32, cn: 28, in: 18, br: 25, au: 52 },
  'Musculoskeletal & Rheumatology':{ us: 66, uk: 46, de: 48, jp: 30, cn: 26, in: 18, br: 24, au: 50 },
  'Infectious Disease':            { us: 70, uk: 65, de: 55, jp: 35, cn: 32, in: 28, br: 32, au: 60 },
  'Respiratory & Pulmonary':       { us: 62, uk: 46, de: 48, jp: 28, cn: 24, in: 20, br: 24, au: 48 },
  'Gastroenterology & Hepatology': { us: 64, uk: 47, de: 48, jp: 30, cn: 26, in: 19, br: 26, au: 50 },
  'Nephrology & Renal':            { us: 63, uk: 48, de: 46, jp: 28, cn: 26, in: 21, br: 26, au: 48 },
  'Dermatology':                   { us: 55, uk: 40, de: 45, jp: 25, cn: 20, in: 15, br: 20, au: 42 },
  'Ophthalmology':                 { us: 72, uk: 52, de: 50, jp: 33, cn: 28, in: 22, br: 28, au: 55 },
  'Rare Disease & Orphan':         { us: 85, uk: 85, de: 75, jp: 50, cn: 40, in: 35, br: 45, au: 78 },
  'Vaccines & Preventive':         { us: 68, uk: 72, de: 60, jp: 45, cn: 50, in: 45, br: 48, au: 65 },
  "Women's Health":                { us: 52, uk: 44, de: 42, jp: 30, cn: 28, in: 22, br: 26, au: 45 },
  'Urology':                       { us: 58, uk: 44, de: 44, jp: 26, cn: 24, in: 20, br: 24, au: 46 },
  'Pain & Anaesthesia':            { us: 45, uk: 38, de: 40, jp: 22, cn: 20, in: 16, br: 20, au: 38 },
  'Hematology (non-oncology)':     { us: 82, uk: 78, de: 70, jp: 52, cn: 38, in: 28, br: 32, au: 72 },
  'Pediatrics':                    { us: 62, uk: 58, de: 55, jp: 40, cn: 35, in: 30, br: 32, au: 55 },
};

const DEFAULT_RATES: Record<string, number> = { us: 60, uk: 50, de: 48, jp: 30, cn: 25, in: 20, br: 25, au: 50 };

const MARKET_LABELS: Record<string, { label: string; flag: string }> = {
  us: { label: "United States", flag: "🇺🇸" },
  uk: { label: "United Kingdom", flag: "🇬🇧" },
  de: { label: "Germany", flag: "🇩🇪" },
  jp: { label: "Japan", flag: "🇯🇵" },
  cn: { label: "China", flag: "🇨🇳" },
  in: { label: "India", flag: "🇮🇳" },
  br: { label: "Brazil", flag: "🇧🇷" },
  au: { label: "Australia", flag: "🇦🇺" },
};

function getBand(rate: number): string {
  if (rate >= 80) return "Very High";
  if (rate >= 60) return "High";
  if (rate >= 40) return "Moderate";
  if (rate >= 20) return "Low";
  return "Very Low";
}

/**
 * Calculate PA Index-2 scores using TA-specific historical base rates.
 * Applies phase-based adjustments.
 */
export function calculatePAModel2(molecule: { id: string; therapeuticArea: string; phase: string }): PAModel2Result {
  const taRates = HISTORICAL_BASE_RATES[molecule.therapeuticArea] || DEFAULT_RATES;
  
  // Phase adjustment
  let phaseAdj = 0;
  const p = molecule.phase.toLowerCase();
  if (p.includes('approved')) phaseAdj = 15;
  else if (p.includes('phase 3') || p.includes('phase iii')) phaseAdj = 5;
  else if (p.includes('phase 2') || p.includes('phase ii')) phaseAdj = 0;
  else if (p.includes('phase 1') || p.includes('phase i')) phaseAdj = -5;

  const marketKeys = ['us', 'uk', 'de', 'jp', 'cn', 'in', 'br', 'au'];
  const markets = marketKeys.map(key => {
    const baseRate = taRates[key] ?? DEFAULT_RATES[key];
    const adjustedRate = Math.max(5, Math.min(95, baseRate + phaseAdj));
    const info = MARKET_LABELS[key];
    return {
      market: info.label,
      flag: info.flag,
      baseRate,
      adjustedRate,
      band: getBand(adjustedRate),
    };
  });

  const avgRate = Math.round(markets.reduce((s, m) => s + m.adjustedRate, 0) / markets.length);
  const signal = avgRate >= 70 ? "Strong" : avgRate >= 50 ? "Moderate" : "Weak";

  return { markets, avgRate, signal };
}
