// ModelNarrative — Dynamic interpretive narrative block for all model outputs
import { Info } from "lucide-react";

interface ModelNarrativeProps {
  children: React.ReactNode;
}

export function ModelNarrative({ children }: ModelNarrativeProps) {
  return (
    <div className="border border-border/60 bg-muted/20 rounded-lg p-4 mt-3">
      <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
        <Info className="h-3.5 w-3.5" />
        What this means
      </h4>
      <div className="text-sm italic text-muted-foreground leading-relaxed space-y-1">
        {children}
      </div>
    </div>
  );
}

// ── Narrative generators ──

export function generateLPINarrative(score: number, phase: string, ta: string, topCategory: string, bottomCategory: string): string {
  const pct = Math.round(score * 100);
  if (pct >= 75) {
    const phaseNote = phase.toLowerCase().includes("phase 3") || phase.toLowerCase().includes("phase iii")
      ? " Phase III status is the strongest positive signal."
      : "";
    return `This molecule shows high launch probability at ${pct}%, placing it among top-performing ${ta} pipeline assets. The score is driven primarily by ${topCategory}.${phaseNote} Primary risk: ${bottomCategory}.`;
  }
  if (pct >= 50) {
    return `This molecule shows moderate launch probability (${pct}%) for a ${phase} asset in ${ta}. Strengths: ${topCategory}. Key uncertainty: ${bottomCategory}.`;
  }
  return `This molecule faces significant launch headwinds at ${pct}%. ${phase} assets in ${ta} historically face attrition at this stage. Improvement drivers: ${bottomCategory}.`;
}

export function generatePTRSNarrative(ptrs: number, pts: number, prs: number, ta: string, phase: string): string {
  const ptrsPct = Math.round(ptrs * 100);
  const ptsPct = Math.round(pts * 100);
  const prsPct = Math.round(prs * 100);
  const stronger = prsPct > ptsPct ? "stronger" : "weaker";
  if (ptrs >= 0.50) {
    return `Technical and regulatory success probability (${ptrsPct}%) is above average for ${ta} ${phase} assets. Regulatory confidence (PRS ${prsPct}%) is ${stronger} than technical confidence (PTS ${ptsPct}%), suggesting ${prsPct > ptsPct ? "the regulatory pathway is well-established" : "clinical endpoints carry more risk"}.`;
  }
  const driver = ptsPct < prsPct ? "PTS" : "PRS";
  const driverPct = ptsPct < prsPct ? ptsPct : prsPct;
  return `At ${ptrsPct}%, combined success probability reflects ${ptsPct < 50 ? "high technical uncertainty" : "regulatory complexity"} for this indication. The ${driver} component at ${driverPct}% is the primary risk driver.`;
}

export function generateTINarrative(tiValue: number, phase: string): string {
  if (tiValue > 10) {
    return "A wide therapeutic index indicates a substantial safety margin between effective and toxic doses. This profile supports flexible dosing and reduces discontinuation risk in trials.";
  }
  if (tiValue >= 2) {
    return `A moderate therapeutic index is typical for this drug class. Standard monitoring protocols apply. Dose titration will be important in ${phase} design.`;
  }
  return "A narrow therapeutic index requires careful dose management and close patient monitoring. This increases trial complexity and may require REMS post-approval.";
}

export function generatePeakSalesNarrative(peakSales: number, strongestFactor: string, weakestFactor: string): string {
  const salesB = peakSales / 1000;
  if (peakSales > 5000) {
    return `Blockbuster-scale peak sales potential at $${salesB.toFixed(1)}B. ${strongestFactor} is the primary value driver. ${weakestFactor} represents the main commercial risk to monitor.`;
  }
  if (peakSales >= 1000) {
    return `Significant commercial opportunity with peak sales in the $${salesB.toFixed(1)}B range. ${strongestFactor} is the key value driver. ${weakestFactor} represents the main commercial risk.`;
  }
  return `Moderate commercial scale at $${peakSales.toFixed(0)}M, potentially appropriate for a niche indication or specific population. Market access and pricing strategy will be critical to maximising revenue.`;
}

export function generateInvestmentNarrative(score: number, topComponents: string, weakComponent: string): string {
  if (score >= 75) {
    return `Strong investment signal at ${score}/100. This molecule scores above the platform threshold for VC/BD interest. ${topComponents} are the primary value drivers. Recommended action: full due diligence warranted.`;
  }
  if (score >= 50) {
    return `Moderate investment signal at ${score}/100. Selective interest is appropriate. ${topComponents} supports consideration but ${weakComponent} requires further validation before commitment.`;
  }
  return `Weak investment signal at ${score}/100 at current development stage. Monitor for phase advancement, data readout, or partnership announcement as potential re-rating catalysts.`;
}

export function generateCAPMNarrative(alpha1: number, alpha2: number, deltaAlpha: number): string {
  const daPct = (Math.abs(deltaAlpha) * 100).toFixed(1);
  if (alpha1 > 0 && alpha2 > 0) {
    const signal = deltaAlpha > 0 ? "advanced vs history" : "retreated";
    const fav = deltaAlpha > 0 ? "favourable" : "cautionary";
    return `Both historical and pipeline alpha are positive — this molecule outperforms expectations on both benchmarks. Δα of ${daPct}% indicates the field has ${signal}, which is a ${fav} signal for new entrants.`;
  }
  if (alpha1 > 0 && alpha2 <= 0) {
    return "Strong historical alpha but below current pipeline mean — the TA has become more competitive since historical benchmarks were set. Differentiation strategy is critical.";
  }
  return "Below-benchmark performance on both measures. Review mechanism novelty and competitive positioning before investment decision.";
}

export function generateMonteCarloNarrative(p5: number, p50: number, p95: number, iterations: number): string {
  return `Under ${iterations.toLocaleString()} simulated scenarios, peak sales range from $${(p5 / 1000).toFixed(1)}B (bear case) to $${(p95 / 1000).toFixed(1)}B (bull case) with a base case of $${(p50 / 1000).toFixed(1)}B. The widest uncertainty band is driven by PTRS and competitive variability.`;
}

export function generatePANarrative(highMarket: string, highScore: number, lowMarket: string, lowScore: number, topMarkets: string[]): string {
  const signal = highScore >= 70 ? "strong" : highScore >= 50 ? "moderate" : "selective";
  return `Strongest access signal in ${highMarket} (${highScore}/100). Most challenging access in ${lowMarket} (${lowScore}/100). Global weighted access score suggests ${signal} market entry strategy. Priority markets: ${topMarkets.join(", ")}.`;
}
