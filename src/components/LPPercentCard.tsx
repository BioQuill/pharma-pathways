/**
 * LPPercentCard — Full LP% (Industry Phase Success Rate) model card.
 * Powered by BioQuill_LP_Model.json empirical + industry data.
 */
import { useState, useMemo } from "react";
import { TrendingUp, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { SimulatorResultBadge } from "./SimulatorResultBadge";
import { SimulatorMoleculeBanner } from "./SimulatorMoleculeBanner";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";
import type { MoleculeProfile } from "@/lib/moleculesData";
import LP_MODEL from "../../BioQuill_LP_Model.json";

// ── Phase normalisation ──
function normPhaseKey(phase: string, approvalStatus?: string): string | null {
  const p = (phase || "").toUpperCase().replace(/\s/g, "");
  const a = (approvalStatus || "").toUpperCase();
  if (a.includes("APPROVED") || a === "APPROVED") return "Approved";
  if (a.includes("COMPLETED_PH3")) return "Completed_Ph3";
  if (p.includes("PHASE3")) return "Phase 3";
  if (p.includes("PHASE2") && p.includes("3")) return "Phase 2/3";
  if (p.includes("PHASE2") && p.includes("1")) return "Phase 1/2";
  if (p.includes("PHASE2")) return "Phase 2";
  if (p.includes("PHASE1")) return "Phase 1";
  // Handle roman numeral phases
  if (p.includes("III")) return "Phase 3";
  if (p.includes("II") && p.includes("III")) return "Phase 2/3";
  if (p.includes("II")) return "Phase 2";
  if (p.includes("I")) return "Phase 1";
  return null;
}

// ── LP% calculation ──
interface LPResult {
  phaseKey: string;
  taPhaseKey: string | null;
  ta: string;
  phaseLp: number | null;
  phaseLpIndustry: number | null;
  taLp: number | null;
  taLpIndustry: number | null;
  taLpReliable: boolean;
  delta: number | null;
  taResultRatePct: number | null;
  taSampleSize: number | null;
}

function calculateLPPercent(molecule: MoleculeProfile): LPResult | null {
  const ta = molecule.therapeuticArea;
  const phaseKey = normPhaseKey(molecule.phase, molecule.approval_status || (molecule as any).approvalStatus);

  if (!phaseKey) return null;
  if (ta === "PK & Pharmacology") return null;

  const taPhaseKey = ["Phase 1", "Phase 2", "Phase 3"].includes(phaseKey)
    ? phaseKey
    : phaseKey === "Phase 1/2" ? "Phase 2"
    : phaseKey === "Phase 2/3" ? "Phase 3"
    : phaseKey === "Completed_Ph3" ? "Phase 3"
    : phaseKey === "Approved" ? "Phase 3"
    : null;

  const overall = LP_MODEL.overall as any;
  const overallEmp = overall.empirical?.[phaseKey];
  const industryPhaseKey = phaseKey.includes("1") && !phaseKey.includes("2")
    ? "Phase 1"
    : phaseKey.includes("3") || phaseKey === "Completed_Ph3" || phaseKey === "Approved"
    ? "Phase 3"
    : "Phase 2";
  const overallInd = overall.industry?.[industryPhaseKey];

  const taData = (LP_MODEL.ta_lp_pct as any)?.[ta];
  const taEmp = taData?.empirical?.[taPhaseKey!];
  const taInd = taData?.industry?.[taPhaseKey!];
  const taDelta = taData?.delta?.[taPhaseKey!];

  return {
    phaseKey,
    taPhaseKey,
    ta: ta || "Unknown",
    phaseLp: overallEmp?.lp_pct ?? null,
    phaseLpIndustry: overallInd?.lp_pct ?? null,
    taLp: taEmp?.lp_pct ?? null,
    taLpIndustry: taInd?.lp_pct ?? null,
    taLpReliable: taEmp?.reliable ?? false,
    delta: taDelta ?? null,
    taResultRatePct: taEmp?.result_rate_pct ?? null,
    taSampleSize: taEmp?.n ?? null,
  };
}

// ── Range label helper ──
function getRangeLabel(phaseKey: string): string {
  if (phaseKey.includes("1") && !phaseKey.includes("2"))
    return "Phase 1 PoS: 22% empirical · 18% industry";
  if (phaseKey.includes("2") && !phaseKey.includes("3"))
    return "Phase 2 PoS: consistent across benchmarks";
  return "Phase 3 PoS: 62% empirical · 55% industry";
}

// ── Phase number for data source note ──
function getPhaseNum(phaseKey: string): string {
  if (phaseKey.includes("1") && !phaseKey.includes("2")) return "1";
  if (phaseKey.includes("2") && !phaseKey.includes("3")) return "2";
  return "3";
}

// ── Single molecule LP% display ──
function LPMoleculeResult({ mol }: { mol: MoleculeProfile }) {
  const [activeTab, setActiveTab] = useState<"empirical" | "industry">("empirical");
  const result = useMemo(() => calculateLPPercent(mol), [mol]);

  if (!result) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm italic text-muted-foreground">LP% not applicable for this trial type</p>
      </div>
    );
  }

  const { phaseKey, taPhaseKey, ta, phaseLp, phaseLpIndustry, taLp, taLpIndustry, taLpReliable, delta, taSampleSize } = result;

  const dividerStyle = "border-t border-[#E5E7EB]";

  return (
    <div className="space-y-5">
      {/* ── CARD BODY — 3 data rows ── */}
      <div className="rounded-lg border bg-card">
        {/* Row 1: Industry Phase LP% */}
        <div className="px-4 py-[14px]">
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
            LP% — Industry Phase Rate
          </p>
          {phaseLp != null ? (
            <>
              <p className="text-[28px] text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>{phaseLp}%</p>
              <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>All TAs · {phaseKey}</p>
            </>
          ) : (
            <p className="text-[28px] text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>N/A</p>
          )}
        </div>

        <div className={dividerStyle} />

        {/* Row 2: TA-Adjusted LP% */}
        <div className="px-4 py-[14px]">
          <p className="text-[11px] uppercase tracking-wide text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
            LP% — TA Success Rate
          </p>
          {taLp != null ? (
            <>
              <p className="text-[28px] text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>{taLp}%</p>
              <p className="text-[11px] text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
                {ta} · {taPhaseKey}
                {!taLpReliable && <span className="ml-1 text-amber-500"> ⚠ low sample</span>}
              </p>
            </>
          ) : (
            <p className="text-[20px] text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>N/A — TA data not available</p>
          )}
        </div>

        <div className={dividerStyle} />

        {/* Row 3: Delta */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="px-4 py-[14px] cursor-help">
                <p className="text-[11px] uppercase tracking-wide text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
                  LP% — TA vs Industry Δ
                </p>
                {delta != null ? (
                  <>
                    <p
                      className="text-[24px]"
                      style={{
                        fontFamily: "Manrope, sans-serif",
                        fontWeight: 700,
                        color: delta > 0 ? "#16A34A" : delta < 0 ? "#DC2626" : "#6B7280",
                      }}
                    >
                      {delta >= 0 ? "+" : ""}{delta}pp
                    </p>
                    <p className="text-[11px]" style={{
                      fontFamily: "Manrope, sans-serif",
                      fontWeight: 400,
                      color: delta > 0 ? "#16A34A" : delta < 0 ? "#DC2626" : "#6B7280",
                    }}>
                      {delta > 0 ? "structural tailwind" : delta < 0 ? "structural headwind" : "at industry average"}
                    </p>
                  </>
                ) : (
                  <p className="text-[24px] text-[#6B7280]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>N/A</p>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[280px] text-xs leading-relaxed">
              Positive = this TA outperforms the industry average for this phase. Negative = structural headwind vs industry benchmark.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* ── SIMULATOR — Dual Tab Section ── */}
      <div className="space-y-3">
        {/* Range label */}
        <p className="text-xs text-[#6B7280] italic">{getRangeLabel(phaseKey)}</p>

        {/* Tab buttons */}
        <div className="flex gap-2">
          {(["empirical", "industry"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderRadius: 6,
                fontFamily: "Manrope, sans-serif",
                ...(activeTab === tab
                  ? { backgroundColor: "#1e3a5f", color: "#fff" }
                  : { backgroundColor: "#fff", color: "#1e3a5f", border: "1px solid #1e3a5f" }),
              }}
            >
              {tab === "empirical" ? "Empirical Benchmark" : "Industry Benchmark"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          {activeTab === "empirical" ? (
            <>
              <TabRow label="All-TA phase rate (empirical)" value={phaseLp} suffix="%" />
              <TabRow label="TA-adjusted rate (empirical)" value={taLp} suffix="%" />
              <TabRow label="TA structural signal" value={delta} suffix="pp" showSign />
              <p className="text-[10px] text-[#6B7280] pt-2">
                BioQuill CTG dataset · {taSampleSize ?? "—"} Phase {getPhaseNum(phaseKey)} completed trials · PK/bioequivalence excluded
              </p>
            </>
          ) : (
            <>
              <TabRow label="All-TA phase rate (BIO/Informa)" value={phaseLpIndustry} suffix="%" />
              <TabRow label="TA-adjusted rate (BIO/Informa)" value={taLpIndustry} suffix="%" />
              <TabRow label="TA structural signal" value={delta} suffix="pp" showSign />
              <p className="text-[10px] text-[#6B7280] pt-2">
                BIO/Informa Industry Analysis 2023 · Curated drug development universe
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TabRow({ label, value, suffix, showSign }: { label: string; value: number | null; suffix: string; showSign?: boolean }) {
  const display = value != null
    ? `${showSign && value >= 0 ? "+" : ""}${value}${suffix}`
    : "N/A";
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className="text-sm font-bold text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif" }}>{display}</span>
    </div>
  );
}

// ── Main exported card ──
interface LPPercentCardProps {
  molecules: MoleculeProfile[];
}

export default function LPPercentCard({ molecules }: LPPercentCardProps) {
  const { sessionMolecule: simulatorMolecule, cart } = useSessionMolecule();
  const molsToShow = cart.length > 0 ? cart : simulatorMolecule ? [simulatorMolecule] : [];

  return (
    <>
      <SimulatorMoleculeBanner molecules={molecules} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            LP% — Industry Phase Success Rate
            {/* ⓘ Methodology tooltip */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-auto cursor-help">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[300px] text-xs leading-relaxed">
                  Phase rates from BioQuill empirical dataset — 33,466 completed industry-sponsored trials (2010–2022). PK and bioequivalence studies excluded. Phase 1 result rate: 35.6% of disease-indication trials posted results. Phase 3 result rate: 71.2%. Industry benchmark from BIO/Informa 2023.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            Empirical launch probability by phase and therapeutic area — BioQuill CTG dataset vs BIO/Informa 2023
          </CardDescription>
        </CardHeader>
        <CardContent>
          {molsToShow.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <p className="text-lg font-medium">Select a molecule to see its phase success rate</p>
              <p className="text-sm mt-2">Use "Use in Simulator →" on any molecule card, or search above.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${molsToShow.length === 1 ? "" : molsToShow.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {molsToShow.map(mol => (
                <div key={mol.id}>
                  <p className="text-sm font-bold text-center mb-3" style={{ fontFamily: "Manrope, sans-serif", color: "#1e3a5f" }}>
                    {mol.name}
                  </p>
                  <LPMoleculeResult mol={mol} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
