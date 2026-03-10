/**
 * SimulatorLayout — 3-layer layout wrapper for all simulator tabs (SIM1b).
 * Layer 1: Result badge + principle + methodology link (always visible)
 * Layer 2: Context chart (always visible)
 * Layer 3: Parameters (collapsed by default)
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SimulatorResultBadge } from "./SimulatorResultBadge";

interface SimulatorLayoutProps {
  /** Badge value (number displayed in center) */
  badgeValue: number | string;
  /** Badge label (e.g. "Launch Probability") */
  badgeLabel: string;
  /** Badge suffix (default "%") */
  badgeSuffix?: string;
  /** Secondary stats shown below badge */
  secondaryStats?: { label: string; value: string }[];
  /** One-sentence principle text */
  principle: string;
  /** Whether parameters are auto-set from molecule data */
  autoBaseline?: boolean;
  /** Context chart component (Layer 2) */
  chart?: React.ReactNode;
  /** Parameter inputs (Layer 3 — collapsible) */
  parameters?: React.ReactNode;
  /** Interpretive narrative text (rendered as "What this means" box) */
  narrative?: string;
  /** Additional content after the 3 layers */
  children?: React.ReactNode;
}

export function SimulatorLayout({
  badgeValue,
  badgeLabel,
  badgeSuffix,
  secondaryStats,
  principle,
  autoBaseline = false,
  chart,
  parameters,
  narrative,
  children,
}: SimulatorLayoutProps) {
  const [paramsOpen, setParamsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* LAYER 1 — RESULT */}
      <div className="flex items-start gap-6 p-5 rounded-lg border bg-card">
        <SimulatorResultBadge
          value={badgeValue}
          label={badgeLabel}
          suffix={badgeSuffix}
          secondaryStats={secondaryStats}
          autoBaseline={autoBaseline}
        />
        <div className="flex-1 min-w-0 pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">{principle}</p>
          <button
            className="text-xs text-primary hover:underline mt-2 inline-block"
            style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 400, fontSize: 13 }}
            onClick={() => {
              // Navigate to methodology tab
              const event = new CustomEvent("navigate-to-methodology");
              window.dispatchEvent(event);
            }}
          >
            → Full model documentation in the Methodology tab
          </button>
        </div>
      </div>

      {/* LAYER 2 — CONTEXT CHART */}
      {chart && (
        <div className="rounded-lg border bg-card p-4">
          {chart}
        </div>
      )}

      {/* LAYER 3 — PARAMETERS (collapsed by default) */}
      {parameters && (
        <Collapsible open={paramsOpen} onOpenChange={setParamsOpen}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors text-sm font-medium">
              <span>{paramsOpen ? "Adjust Parameters ▴" : "Adjust Parameters ▾"}</span>
              <span className="text-xs text-muted-foreground">
                {paramsOpen ? "" : "Using TA baseline values"}
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 rounded-lg border bg-card p-4">
              {parameters}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Interpretive Narrative */}
      {narrative && (
        <div className="border border-border/60 bg-muted/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            What this means
          </h4>
          <p className="text-sm italic text-muted-foreground leading-relaxed">{narrative}</p>
        </div>
      )}

      {/* Additional content */}
      {children}
    </div>
  );
}
