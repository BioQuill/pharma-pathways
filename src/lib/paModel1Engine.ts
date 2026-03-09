/**
 * PA Index-1 (MWPSPI) Engine — extracted from PAModel1Dashboard.tsx
 * Pure calculation function for use in both dashboard and report card.
 * DO NOT modify weights or scoring logic — extract only (H1.5 Fix 3).
 */

export interface PAModel1MarketWeights {
  clinical: number;
  economic: number;
  access: number;
  political: number;
}

export interface PAModel1MarketResult {
  marketId: string;
  marketLabel: string;
  score: number;
  band: string;
  implication: string;
}

export interface PAModel1Result {
  markets: PAModel1MarketResult[];
  avgScore: number;
  signal: string;
  highest: PAModel1MarketResult;
  lowest: PAModel1MarketResult;
}

// Market weights from PAModel1Dashboard core framework
const MARKET_WEIGHTS: Record<string, PAModel1MarketWeights> = {
  us: { clinical: 25, economic: 35, access: 25, political: 15 },
  uk: { clinical: 35, economic: 45, access: 10, political: 10 },
  de: { clinical: 40, economic: 30, access: 20, political: 10 },
  jp: { clinical: 30, economic: 25, access: 30, political: 15 },
  cn: { clinical: 25, economic: 35, access: 30, political: 10 },
  in: { clinical: 20, economic: 40, access: 30, political: 10 },
  br: { clinical: 25, economic: 35, access: 25, political: 15 },
  au: { clinical: 30, economic: 40, access: 20, political: 10 },
};

const MARKETS = [
  { id: "us", label: "🇺🇸 United States" },
  { id: "uk", label: "🇬🇧 United Kingdom" },
  { id: "de", label: "🇩🇪 Germany" },
  { id: "jp", label: "🇯🇵 Japan" },
  { id: "cn", label: "🇨🇳 China" },
  { id: "in", label: "🇮🇳 India" },
  { id: "br", label: "🇧🇷 Brazil" },
  { id: "au", label: "🇦🇺 Australia" },
];

function getBand(score: number): string {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Moderate";
  return "Low";
}

function getImplication(score: number): string {
  if (score >= 80) return "Strong payer precedent and favourable reimbursement landscape";
  if (score >= 60) return "Established pathway with manageable HTA requirements";
  if (score >= 40) return "Mixed signals — pricing pressure likely";
  return "Significant barriers; budget impact and evidence demands high";
}

/**
 * Deterministic scoring using molecule ID + market ID hash.
 * This mirrors the scoring approach in both the dashboard and report card.
 * In a production system this would be replaced with real payer data.
 */
function hashScore(molId: string, marketId: string): number {
  let hash = 0;
  const str = molId + marketId;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return 35 + Math.abs(hash % 55); // 35-89 range
}

/**
 * Calculate PA Index-1 scores for a molecule across all 8 markets.
 * Uses deterministic hash-based scoring (same as both dashboard and report card).
 */
export function calculatePAModel1(molecule: { id: string; name: string; phase: string; therapeuticArea: string }): PAModel1Result {
  const markets = MARKETS.map(m => {
    const score = hashScore(molecule.id, m.id);
    return {
      marketId: m.id,
      marketLabel: m.label,
      score,
      band: getBand(score),
      implication: getImplication(score),
    };
  });

  const sorted = [...markets].sort((a, b) => b.score - a.score);
  const avgScore = Math.round(markets.reduce((s, m) => s + m.score, 0) / markets.length);
  const signal = avgScore >= 70 ? "Strong" : avgScore >= 50 ? "Moderate" : "Weak";

  return {
    markets,
    avgScore,
    signal,
    highest: sorted[0],
    lowest: sorted[sorted.length - 1],
  };
}
