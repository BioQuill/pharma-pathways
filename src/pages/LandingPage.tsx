import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, X, Play, Menu, ChevronRight, Mail, Plus, Trash2 } from "lucide-react";
import bioquillEmblem from "@/assets/bioquill-emblem.png";
import { useMolecules } from "@/hooks/useMolecules";
import { MoleculeDistributionChart } from "@/components/MoleculeDistributionChart";

// ─── TA Matrix (from BioQuill_Pricing.json) ───
const TA_MATRIX: Record<string, { p1: number; p2: number; p3: number; total: number }> = {
  "Oncology & Hematology":         { p1: 5595, p2: 3154, p3: 1276, total: 10025 },
  "Endocrinology & Metabolism":    { p1: 951,  p2: 410,  p3: 449,  total: 1810 },
  "Respiratory & Pulmonary":       { p1: 608,  p2: 485,  p3: 306,  total: 1399 },
  "Cardiovascular":                { p1: 456,  p2: 337,  p3: 294,  total: 1087 },
  "Neurology":                     { p1: 459,  p2: 318,  p3: 222,  total: 999 },
  "Immunology & Inflammation":     { p1: 393,  p2: 318,  p3: 248,  total: 959 },
  "Dermatology":                   { p1: 351,  p2: 331,  p3: 255,  total: 937 },
  "Infectious Disease":            { p1: 467,  p2: 242,  p3: 149,  total: 858 },
  "Psychiatry & Mental Health":    { p1: 185,  p2: 166,  p3: 128,  total: 479 },
  "Rare Disease & Orphan":         { p1: 227,  p2: 135,  p3: 112,  total: 474 },
  "Gastroenterology & Hepatology": { p1: 284,  p2: 92,   p3: 75,   total: 451 },
  "Hematology (non-oncology)":     { p1: 168,  p2: 114,  p3: 168,  total: 450 },
  "Ophthalmology":                 { p1: 171,  p2: 139,  p3: 129,  total: 439 },
  "Nephrology & Renal":            { p1: 215,  p2: 136,  p3: 73,   total: 424 },
  "Musculoskeletal & Rheumatology":{ p1: 167,  p2: 118,  p3: 115,  total: 400 },
  "Pain & Anaesthesia":            { p1: 68,   p2: 60,   p3: 50,   total: 178 },
  "Women's Health":                { p1: 57,   p2: 49,   p3: 56,   total: 162 },
  "Urology":                       { p1: 49,   p2: 30,   p3: 31,   total: 110 },
  "Vaccines & Preventive":         { p1: 17,   p2: 16,   p3: 32,   total: 65 },
  "Pediatrics":                    { p1: 10,   p2: 12,   p3: 11,   total: 33 },
};

const TA_ORDER = Object.keys(TA_MATRIX);

function calculatePrice(ta: string, phases: string[]): { price: number; trials: number } | null {
  const counts = TA_MATRIX[ta];
  if (!counts) return null;
  let trials = 0;
  if (phases.includes("all")) {
    trials = counts.p1 + counts.p2 + counts.p3;
  } else {
    if (phases.includes("1")) trials += counts.p1;
    if (phases.includes("2")) trials += counts.p2;
    if (phases.includes("3")) trials += counts.p3;
  }
  const raw = trials * 14;
  const rounded = Math.round(raw / 500) * 500;
  return { price: Math.max(5000, rounded), trials };
}

// ─── Showcase Scores (pre-computed) ───
const SHOWCASE_SCORES: Record<string, { molecule: string; context: string; score: number; interpret: string }> = {
  "ti-analysis":      { molecule: "Upadacitinib",       context: "Phase 3 · Immunology & Inflammation · AbbVie",           score: 3.2,  interpret: "Moderate therapeutic index — standard monitoring recommended" },
  "regulatory":       { molecule: "Ocrelizumab",         context: "Approved · Neurology · Roche",                            score: 72,   interpret: "High TA composite index — mature regulatory pathway with strong precedent" },
  "ptrs":             { molecule: "Pembrolizumab",        context: "Phase 3 · Oncology & Hematology · Merck",                 score: 41,   interpret: "Combined PTS × PRS reflects moderate-high technical and regulatory confidence for this indication" },
  "ttm":              { molecule: "KarXT",                context: "Phase 3 · Psychiatry & Mental Health · BMS",              score: 28,   interpret: "Estimated 28 months to first regulatory approval from current phase" },
  "pa-model1":        { molecule: "Finerenone",           context: "Approved · Cardiovascular · Bayer",                       score: 74,   interpret: "Strong pricing & access outlook — favourable HTA environment and reimbursement precedent" },
  "pa-model2-stub":   { molecule: "Tezepelumab",         context: "Approved · Respiratory & Pulmonary · AZ/Amgen",           score: 68,   interpret: "Comparative payer analysis shows favourable positioning vs existing biologics" },
  "lp-pct":           { molecule: "Orforglipron",         context: "Phase 3 · Endocrinology & Metabolism · Eli Lilly",        score: 64,   interpret: "Industry-wide Phase 3 success rate for this TA is above average" },
  "lpi-3":            { molecule: "Tirzepatide",          context: "Phase 3 · Endocrinology & Metabolism · Eli Lilly",        score: 88,   interpret: "Very high launch probability — strong clinical, regulatory, and market signals" },
  "composite-score":  { molecule: "SEP-363856",           context: "Phase 2/3 · Psychiatry & Mental Health · Sumitomo",       score: 52,   interpret: "Moderate composite of launch probability and time-to-market signals" },
  "peak-sales":       { molecule: "Dupilumab",            context: "Approved · Dermatology · Sanofi/Regeneron",               score: 91,   interpret: "Outstanding peak sales potential — blockbuster trajectory across multiple indications" },
  "blockbuster":      { molecule: "Elafibranor",          context: "Phase 3 · Gastroenterology & Hepatology · Ipsen",         score: 34,   interpret: "Moderate blockbuster probability — market size supports potential but competitive landscape is dense" },
  "lpi-2":            { molecule: "Efanesoctocog alfa",   context: "Approved · Hematology (non-oncology) · SOBI",             score: 76,   interpret: "Strong 5-factor investment score — favourable across clinical, market, and sponsor dimensions" },
  "capm-alpha":       { molecule: "ELX/TEZ/IVA",          context: "Approved · Rare Disease & Orphan · Vertex",               score: 8.4,  interpret: "Positive alpha signal — risk-adjusted return exceeds sector benchmark" },
  "monte-carlo-hub":  { molecule: "Bepirovirsen",         context: "Phase 2/3 · Infectious Disease · GSK",                    score: 620,  interpret: "Median Monte Carlo peak sales estimate: $620M across 10,000 simulations" },
};

const MODEL_CARDS_ROW1 = [
  { id: "ti-analysis", label: "TI", sub: "TD50 / ED50" },
  { id: "regulatory", label: "TA Index", sub: "Therapeutic Area Success Rate" },
  { id: "ptrs", label: "PTRS", sub: "Technical & Regulatory Success" },
  { id: "ttm", label: "TTM", sub: "Time to Market" },
  { id: "pa-model1", label: "PA Index-1", sub: "Pricing & Access Odds" },
  { id: "pa-model2-stub", label: "PA Index-2", sub: "Comparative Payer Likelihood" },
  { id: "lp-pct", label: "LP%", sub: "Industry Phase Success Rate" },
];

const MODEL_CARDS_ROW2 = [
  { id: "lpi-3", label: "LPI", sub: "Launch Probability Index" },
  { id: "composite-score", label: "Composite Score", sub: "LPI + TTM" },
  { id: "peak-sales", label: "Peak Sales Index", sub: "Revenue Potential" },
  { id: "blockbuster", label: "BB%", sub: "$1B Blockbuster Probability" },
  { id: "lpi-2", label: "Investment Score", sub: "5-Factor Investment Model" },
  { id: "capm-alpha", label: "Alpha", sub: "Risk-Adjusted Return" },
  { id: "monte-carlo-hub", label: "Monte Carlo", sub: "Scenario Simulation" },
];

// ─── Waitlist Modal ───
function WaitlistModal({ open, onOpenChange, context }: { open: boolean; onOpenChange: (v: boolean) => void; context: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", org: "", role: "", interest: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:office@bioquill.net?subject=${encodeURIComponent(`BioQuill Access Request — ${formData.name} — ${formData.org}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nOrganisation: ${formData.org}\nRole: ${formData.role}\nPrimary Interest: ${formData.interest}\nContext: ${context}`)}`;
    setSubmitted(true);
  };

  useEffect(() => { if (!open) { setSubmitted(false); setFormData({ name: "", email: "", org: "", role: "", interest: "" }); } }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] border-2 border-[#1e3a5f] rounded-2xl p-10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif" }}>Request Access to BioQuill</DialogTitle>
          <DialogDescription>We'll review your request and be in touch within 2 business days.</DialogDescription>
        </DialogHeader>
        {context && <p className="text-[13px] italic text-[#F59E0B]">{context}</p>}
        {submitted ? (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-[hsl(142,76%,36%)]">✓ Thank you — we'll be in touch within 2 business days.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><Label>Full Name *</Label><Input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Email *</Label><Input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
            <div><Label>Organisation *</Label><Input required value={formData.org} onChange={e => setFormData(p => ({ ...p, org: e.target.value }))} /></div>
            <div>
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={v => setFormData(p => ({ ...p, role: v }))}>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="investor">Investor / Fund Manager</SelectItem>
                  <SelectItem value="bdl">BD&L Professional</SelectItem>
                  <SelectItem value="strategy">Pharma Strategy / CI</SelectItem>
                  <SelectItem value="analyst">Analyst / Advisor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Primary Interest</Label>
              <Select value={formData.interest} onValueChange={v => setFormData(p => ({ ...p, interest: v }))}>
                <SelectTrigger><SelectValue placeholder="Select interest" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1mol">1 Molecule Report</SelectItem>
                  <SelectItem value="1ta">1 Therapeutic Area</SelectItem>
                  <SelectItem value="full">Full Access</SelectItem>
                  <SelectItem value="explore">Just Exploring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full rounded-lg text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }}>Request Access</Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Interactive Overlay ───
function InteractiveOverlay({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 z-10 cursor-pointer rounded-lg" onClick={onClick} />
    </div>
  );
}

// ─── Score Badge ───
function ScoreBadge({ score, label }: { score: number; label: string }) {
  const display = label === "TTM" ? `${score}mo` : label === "Alpha" ? score.toFixed(1) : label === "Monte Carlo" ? `$${score}M` : label === "TI" ? score.toFixed(1) : `${Math.round(score)}%`;
  return (
    <div className="w-14 h-14 rounded-full bg-[#1e3a5f] border-2 border-[#F59E0B] flex items-center justify-center">
      <span className="text-white font-bold text-xs" style={{ fontFamily: "Manrope, sans-serif" }}>{display}</span>
    </div>
  );
}

// ─── Model Card (Two-State) ───
function ModelCard({ card, expanded, onExpand, onCollapse, onWaitlist }: {
  card: { id: string; label: string; sub: string };
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onWaitlist: (ctx: string) => void;
}) {
  const showcase = SHOWCASE_SCORES[card.id];
  const [emailSent, setEmailSent] = useState(false);
  if (!showcase) return null;

  if (expanded) {
    return (
      <div className="col-span-1 relative bg-white border-2 border-[#F59E0B] rounded-lg p-4 shadow-lg transition-all duration-300 z-20" style={{ minHeight: 220 }}>
        <button onClick={onCollapse} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        <div className="flex items-start gap-3 mb-3">
          <ScoreBadge score={showcase.score} label={card.label} />
          <div>
            <p className="text-xs font-bold text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif" }}>{card.label}</p>
            <p className="text-sm font-bold text-[#1e3a5f]">{showcase.molecule}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{showcase.interpret}</p>
        <p className="text-[10px] text-muted-foreground/70 mb-3">{showcase.context}</p>
        {emailSent ? (
          <p className="text-[13px] text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif" }}>
            <span className="text-[hsl(142,76%,36%)]">✓</span> Request sent — we'll deliver your sample within 2 business days.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <Button size="sm" className="text-xs text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }} onClick={() => {
              window.location.href = `mailto:office@bioquill.net?subject=${encodeURIComponent(`Free Sample Report Request — ${card.label} — ${showcase.molecule}`)}&body=${encodeURIComponent(`I am interested in seeing the Full Intelligence Profile sample for ${card.label} using ${showcase.molecule} as the showcase molecule.\n\nModel: ${card.label} — ${card.sub}\nShowcase molecule: ${showcase.molecule}\nContext: ${showcase.context}`)}`;
              setEmailSent(true);
            }}>
              Free Sample
            </Button>
            <Button size="sm" variant="outline" className="text-xs border-[#1e3a5f] text-[#1e3a5f]" onClick={() => {
              document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Your Molecule
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onExpand}
      className="rounded-lg px-2 py-2 text-center transition-all duration-150 cursor-pointer border bg-[#EFF6FF] border-[#BFDBFE] hover:bg-[#FEFCE8] hover:border-[#FDE68A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{ minHeight: 48 }}
    >
      <p className="text-xs font-bold leading-tight text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>{card.label}</p>
      <p className="text-[10px] font-bold leading-tight mt-0.5 text-[#1e3a5f]" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}>{card.sub}</p>
      <p className="text-[10px] text-[#F59E0B] mt-1 italic">e.g. {showcase.molecule}</p>
      <p className="text-[10px] text-[#F59E0B] mt-0.5">See live score →</p>
    </button>
  );
}

// ─── TA Configurator ───
function TAConfigurator({ onAddToCart }: { onAddToCart: (ta: string, phases: string[], price: number, trials: number) => void }) {
  const [selectedTA, setSelectedTA] = useState("");
  const [phases, setPhases] = useState<string[]>(["all"]);

  const togglePhase = (p: string) => {
    if (p === "all") {
      setPhases(["all"]);
    } else {
      let next = phases.filter(x => x !== "all");
      if (next.includes(p)) {
        next = next.filter(x => x !== p);
      } else {
        next.push(p);
      }
      if (next.length === 0) next = ["all"];
      setPhases(next);
    }
  };

  const result = selectedTA ? calculatePrice(selectedTA, phases) : null;
  const phaseLabel = phases.includes("all") ? "All Phases" : phases.map(p => `Phase ${p}`).join(" + ");

  return (
    <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8 relative">
      <Badge className="absolute -top-3 left-6 text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }}>Most Flexible</Badge>
      <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>1 Therapeutic Area</h3>
      <p className="text-sm text-muted-foreground mb-4">Your TA + your phases — price scales with scope</p>

      <div className="mb-3">
        <Label className="text-xs">Select Therapeutic Area</Label>
        <Select value={selectedTA} onValueChange={setSelectedTA}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select a therapeutic area" /></SelectTrigger>
          <SelectContent>
            {TA_ORDER.map(ta => (
              <SelectItem key={ta} value={ta}>{ta} — {TA_MATRIX[ta].total.toLocaleString()} trials</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label className="text-xs">Phase Selector</Label>
        <div className="flex gap-1 mt-1">
          {[{ key: "all", label: "All" }, { key: "1", label: "Phase 1" }, { key: "2", label: "Phase 2" }, { key: "3", label: "Phase 3" }].map(p => (
            <button
              key={p.key}
              onClick={() => togglePhase(p.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${phases.includes(p.key) ? "bg-[#1e3a5f] text-white border-[#1e3a5f]" : "bg-white text-[#1e3a5f] border-[#1e3a5f]/30 hover:border-[#1e3a5f]"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {result ? (
        <div className="mb-4">
          <p className="text-3xl font-bold text-[#1e3a5f]">${result.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
          <p className="text-sm text-muted-foreground">{result.trials.toLocaleString()} trial profiles included</p>
        </div>
      ) : (
        <div className="mb-4">
          <p className="text-3xl font-bold text-[#1e3a5f]">From $5,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
          <p className="text-sm text-muted-foreground">Select a TA to see pricing</p>
        </div>
      )}

      <ul className="space-y-2 text-sm text-muted-foreground mb-6">
        <li>• Full Intelligence Profile for every trial profile</li>
        <li>• TA Composite Index analytics</li>
        <li>• Head-to-head molecule comparison</li>
        <li>• Pipeline trend & gap analysis</li>
        <li>• 1-year live monitoring & automated alerts</li>
      </ul>

      {selectedTA && result ? (
        <Button className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => onAddToCart(selectedTA, phases, result.price, result.trials)}>Add to Cart</Button>
      ) : (
        <Button className="w-full font-bold" disabled>Select a TA to continue</Button>
      )}
    </div>
  );
}

// ─── Cart types ───
type CartItem = { type: "molecule"; name: string; price: number } | { type: "ta"; ta: string; phases: string; price: number; trials: number };

// ═══════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════
export default function LandingPage() {
  const navigate = useNavigate();
  const { molecules: allMolecules, loading, fullyLoaded } = useMolecules();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistContext, setWaitlistContext] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const openWaitlist = useCallback((ctx: string) => {
    setWaitlistContext(ctx);
    setWaitlistOpen(true);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addMoleculeToCart = (name: string) => {
    if (!name.trim()) return;
    setCartItems(prev => [...prev, { type: "molecule", name: name.trim(), price: 5000 }]);
  };

  const addTAToCart = (ta: string, phases: string[], price: number, trials: number) => {
    const phaseLabel = phases.includes("all") ? "All Phases" : phases.map(p => `Phase ${p}`).join(" + ");
    setCartItems(prev => [...prev, { type: "ta", ta, phases: phaseLabel, price, trials }]);
  };

  const removeCartItem = (idx: number) => setCartItems(prev => prev.filter((_, i) => i !== idx));
  const cartTotal = cartItems.reduce((s, it) => s + it.price, 0);

  const handlePurchaseRequest = () => {
    const lines = cartItems.map((it, i) => {
      if (it.type === "molecule") return `${i + 1}. 💊 ${it.name} — All phases — $${it.price.toLocaleString()}/yr`;
      return `${i + 1}. 🧬 ${it.ta} — ${it.phases} — $${it.price.toLocaleString()}/yr`;
    }).join("\n");
    const body = `Package Request:\n\n${lines}\n\nTotal: $${cartTotal.toLocaleString()} / year`;
    window.location.href = `mailto:office@bioquill.net?subject=${encodeURIComponent(`BioQuill Package Request — $${cartTotal.toLocaleString()}/yr`)}&body=${encodeURIComponent(body)}`;
    openWaitlist(`Package request: $${cartTotal.toLocaleString()}/yr — ${cartItems.length} items`);
  };

  // ─── Live stats ───
  const activeTrials = allMolecules.length;
  const uniqueMolecules = new Set(allMolecules.map(m => m.name?.toLowerCase().trim())).size;
  const shimmer = !fullyLoaded ? "animate-pulse" : "";

  const phase1Count = allMolecules.filter(m => {
    return /phase\s*1/i.test(m.phase) || /phase\s*i($|\s|\/)/i.test(m.phase);
  }).length;
  const phase2Count = allMolecules.filter(m => {
    return (/phase\s*2/i.test(m.phase) || /phase\s*ii($|\s|\/)/i.test(m.phase)) && !/phase\s*1/i.test(m.phase) && !/phase\s*i\//i.test(m.phase);
  }).length;
  const phase3Count = allMolecules.filter(m => {
    return /phase\s*3/i.test(m.phase) || /phase\s*iii/i.test(m.phase);
  }).length;
  const pkCount = allMolecules.filter(m => m.therapeuticArea === "PK & Pharmacology").length;

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} context={waitlistContext} />

      {/* ═══ STICKY HEADER ═══ */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ height: 48, backgroundColor: "#F5C518", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
              <img src={bioquillEmblem} alt="BioQuill emblem" className="w-8 h-8 object-cover rounded-full" />
            </div>
            <span className="ml-2 text-[16px] font-bold text-[#1A1A1A] tracking-tight">BiOQUILL</span>
            <div className="hidden md:flex items-center gap-3 ml-4">
              <div style={{ width: 1, height: 20, background: "rgba(26,26,26,0.25)" }} />
              <span className="text-[13px] font-bold text-[#1A1A1A] whitespace-nowrap">Know the odds. Understand the pipeline. Win the race.</span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {["about", "models", "pricing", "contact"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="text-sm font-semibold text-[#1A1A1A]/80 hover:text-[#1A1A1A] capitalize">{s}</button>
            ))}
            <span className="text-xs text-[#1A1A1A]/60 whitespace-nowrap" style={{ background: "rgba(255,255,255,0.35)", borderRadius: 20, padding: "3px 10px" }}>Data refreshed: 05/03/2026</span>
            <Button size="sm" className="font-bold text-xs text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => scrollTo("pricing")}>Request Access</Button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="h-5 w-5 text-[#1A1A1A]" /></button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5C518] border-t border-[#1A1A1A]/10 px-4 py-3 space-y-2">
            {["about", "models", "pricing", "contact"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="block text-sm font-semibold text-[#1A1A1A] capitalize w-full text-left">{s}</button>
            ))}
            <Button size="sm" className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => scrollTo("pricing")}>Request Access</Button>
          </div>
        )}
      </header>

      <div style={{ height: 48 }} />

      {/* ═══ SECTION B: LIVE PLATFORM PREVIEW ═══ */}
      <section id="models">
        {/* Probabilistic thinking paragraph — displayed in 3 rows */}
        <div className="py-6 px-4" style={{ backgroundColor: "#F8F9FA" }}>
          <p className="text-[#1e3a5f] text-center text-base leading-relaxed max-w-[700px] mx-auto" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
            Probabilistic thinking is estimating how likely different outcomes are by using logic and mathematical reasoning. In a world shaped by countless interacting variables, it helps us identify the scenarios that are most likely to unfold. When we understand those probabilities, our decisions become sharper, more accurate, and far more effective.
          </p>
        </div>

        {/* 7 Stat Cards (with new "14 PROPRIETARY MODELS" card first) — Fix 12: 2cm (~32px) gap from text */}
        <div className="container mx-auto px-4 mb-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <Card className="bg-white shadow-sm">
              <CardContent className="py-1.5 px-3 text-center">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Proprietary Models</p>
                <p className="text-lg font-bold text-[#1e3a5f]">14</p>
              </CardContent>
            </Card>
            {[
              { label: "Active Trials", value: activeTrials.toLocaleString(), color: "#0E1D35" },
              { label: "Molecules", value: uniqueMolecules.toLocaleString(), color: "#0E1D35" },
              { label: "Phase 1 Trials", value: phase1Count.toLocaleString(), color: "hsl(142,76%,36%)" },
              { label: "Phase 2 Trials", value: phase2Count.toLocaleString(), color: "hsl(45,93%,47%)" },
              { label: "Phase 3 Trials", value: phase3Count.toLocaleString(), color: "hsl(142,76%,36%)" },
              { label: "PK & Pharmacology", value: pkCount.toLocaleString(), color: "hsl(45,93%,47%)" },
            ].map(stat => (
              <Card key={stat.label} className="bg-white shadow-sm">
                <CardContent className="py-1.5 px-3 text-center">
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-lg font-bold ${shimmer}`} style={{ color: stat.color }}>{loading ? "—" : stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 14 Model Cards — 7×2 grid */}
        <div className="container mx-auto px-4 mb-4 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {MODEL_CARDS_ROW1.map(card => (
              <ModelCard key={card.id} card={card} expanded={expandedCard === card.id} onExpand={() => setExpandedCard(expandedCard === card.id ? null : card.id)} onCollapse={() => setExpandedCard(null)} onWaitlist={openWaitlist} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {MODEL_CARDS_ROW2.map(card => (
              <ModelCard key={card.id} card={card} expanded={expandedCard === card.id} onExpand={() => setExpandedCard(expandedCard === card.id ? null : card.id)} onCollapse={() => setExpandedCard(null)} onWaitlist={openWaitlist} />
            ))}
          </div>
        </div>

        {/* TA Distribution Card — pie chart only, no table */}
        {!loading && allMolecules.length > 0 && (
          <div className="container mx-auto px-4 mb-2">
            <InteractiveOverlay onClick={() => openWaitlist("You requested access to: Pipeline Explorer")}>
              <div className="p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center mb-2">
                  <Badge className="bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-semibold">Molecules by Therapeutic Area</Badge>
                </div>
                <MoleculeDistributionChart molecules={allMolecules} />
              </div>
            </InteractiveOverlay>
          </div>
        )}

        {/* Search Bar — ~1cm (10px) distance from pie chart */}
        <div className="container mx-auto px-4 mb-8 mt-2">
          <InteractiveOverlay onClick={() => openWaitlist("Request access to search the full pipeline")}>
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search by NCT ID, Molecule, Sponsor or TA"
                readOnly
                className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg bg-[#f0fdf4] placeholder:text-[#64748b] cursor-pointer"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400, border: "2.5px solid #0E1D35" }}
              />
            </div>
          </InteractiveOverlay>
        </div>
      </section>

      {/* ═══ SECTION C: PHILOSOPHY ═══ */}
      <section id="about" className="bg-white pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">WHY BIOQUILL</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] leading-tight font-bold mb-12" style={{ fontFamily: "Manrope, sans-serif" }}>
            The best decisions<br className="hidden md:block" /> are made by those who think in probabilities.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🎯", title: "Assign Probabilities, Not Opinions", text: "Annie Duke showed that decision quality cannot be judged by outcome alone. Philip Tetlock showed disciplined probabilistic thinkers outperform domain experts. BioQuill applies that discipline to every molecule in the global pipeline." },
              { icon: "⏱", title: "Time Is the Other Half of the Signal", text: "A molecule with 80% launch probability that is twelve years from approval is a fundamentally different asset than one eighteen months away. TTM is built into the core of every BioQuill score." },
              { icon: "🏁", title: "No Molecule Exists in Isolation", text: "Launch probability is shaped by who else is running the same race, at what pace, with what resources. BioQuill scores molecules in competitive context — positions in a living, moving race to market." },
            ].map(card => (
              <div key={card.title} className="border-2 border-[#1e3a5f] rounded-xl p-8 bg-white">
                <p className="text-2xl mb-3">{card.icon}</p>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION D: WHO IT'S FOR ═══ */}
      <section className="pt-8 pb-8 px-4" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">WHO USES BIOQUILL</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] font-bold mb-12" style={{ fontFamily: "Manrope, sans-serif" }}>Built for the Teams Running the Race</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "🏦", title: "Biotech Investors & Funds", text: "VCs, hedge funds, and family offices tracking pipeline assets before they become expensive. Phase 1 signals, Phase 3 conviction, portfolio-level risk." },
              { icon: "🔬", title: "BD&L Teams", text: "Business development and licensing teams identifying acquisition targets, benchmarking assets, and building the competitive case for deal decisions." },
              { icon: "📊", title: "Pharma Strategy & CI Teams", text: "Corporate intelligence and strategy functions at large pharma tracking competitor pipelines across all TAs and phases." },
              { icon: "💼", title: "Boutique Advisors & Analysts", text: "Independent advisors and analysts who need institutional-grade pipeline intelligence without institutional-grade procurement cycles." },
            ].map(card => (
              <div key={card.title} className="bg-white border-2 border-[#1e3a5f] rounded-xl p-7">
                <p className="text-2xl mb-3">{card.icon}</p>
                <h3 className="text-lg font-bold text-[#1e3a5f] mb-2" style={{ fontFamily: "Manrope, sans-serif" }}>{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION E: PRICING ═══ */}
      <section id="pricing" className="bg-white pt-8 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">PRICING</p>
          <p className="text-muted-foreground text-lg mb-8">Configure per your scope. Pay for what you need: single molecules, full therapeutic area or the full pipeline.</p>

          {/* Cart at top of pricing */}
          <div id="cart" className="border-[2.5px] border-[#1e3a5f] rounded-xl p-6 bg-white mb-6">
            <h3 className="text-lg font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>🛒 Your Cart</h3>
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground italic text-sm py-4">Your cart is empty — add molecules or therapeutic areas below.</p>
            ) : (
              <div>
                {cartItems.map((it, i) => (
                  <div key={i} className={`flex items-center justify-between py-2 px-4 border-l-[3px] border-l-[#1e3a5f] ${i % 2 === 0 ? "bg-[#F8F9FA]" : "bg-white"}`}>
                    <span className="text-sm text-[#1e3a5f]">
                      {it.type === "molecule" ? `💊 ${it.name} — All phases — $${it.price.toLocaleString()}/yr` : `🧬 ${it.ta} — ${it.phases} — $${it.price.toLocaleString()}/yr`}
                    </span>
                    <button onClick={() => removeCartItem(i)} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
                <div className="border-t-2 border-[#1e3a5f] pt-3 mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1e3a5f]">Total: ${cartTotal.toLocaleString()} / year</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Billed annually. Access granted within 2 business days of payment confirmation.</p>
                <Button className="w-full mt-3 font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={handlePurchaseRequest}>Purchase & Request Access</Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* 1 Molecule */}
            <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>1 Molecule</h3>
              <p className="text-3xl font-bold text-[#1e3a5f] mb-1">$5,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <p className="text-sm text-muted-foreground mb-6">1 molecule — all development phases</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                <li>• Full Intelligence Profile</li>
                <li>• All 14 models</li>
                <li>• 1-year monitoring & alerts</li>
              </ul>
              <MoleculeAddToCart onAdd={addMoleculeToCart} />
            </div>

            {/* 1 TA — Live Configurator */}
            <TAConfigurator onAddToCart={addTAToCart} />

            {/* Full Access */}
            <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8 relative">
              <Badge className="absolute -top-3 left-6 bg-[#1e3a5f] text-white font-bold">Enterprise</Badge>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Full Access</h3>
              <p className="text-3xl font-bold text-[#1e3a5f] mb-1">$250,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <p className="text-sm text-muted-foreground mb-6">ALL trial profiles — ALL 20 TAs — ALL phases</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                <li>• Complete global pipeline coverage</li>
                <li>• Dedicated account manager</li>
                <li>• Custom scoring configurations</li>
                <li>• Access to Strategy Hub — scenario planning and portfolio optimisation</li>
              </ul>
              <Button className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => {
                setCartItems(prev => [...prev, { type: "molecule", name: "Full Access — Enterprise", price: 250000 }]);
                document.getElementById("cart")?.scrollIntoView({ behavior: "smooth" });
              }}>Add to Cart</Button>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1e3a5f] text-white">
                  <th className="text-left py-2 px-4 font-semibold">Feature</th>
                  <th className="text-center py-2 px-4 font-semibold">1 Molecule</th>
                  <th className="text-center py-2 px-4 font-semibold">1 TA</th>
                  <th className="text-center py-2 px-4 font-semibold">Full Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Full Intelligence Profile", "✓", "✓", "✓"],
                  ["All 14 models", "✓", "✓", "✓"],
                  ["1-year monitoring & alerts", "✓", "✓", "✓"],
                  ["TA Composite Index analytics", "—", "✓", "✓"],
                  ["Head-to-head molecule comparison", "—", "✓", "✓"],
                  ["Pipeline trend & gap analysis", "—", "✓", "✓"],
                  ["Dedicated account manager", "—", "—", "✓"],
                  ["Custom scoring configurations", "—", "—", "✓"],
                  ["Strategy Hub access", "—", "—", "✓"],
                ].map(([feature, m1, ta, full], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"}>
                    <td className="py-2 px-4 text-[#1e3a5f]">{feature}</td>
                    <td className="py-2 px-4 text-center">{m1}</td>
                    <td className="py-2 px-4 text-center">{ta}</td>
                    <td className="py-2 px-4 text-center">{full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center mt-6">
            <button onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} className="text-[#F59E0B] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              See full pricing details → <ChevronRight className="h-3 w-3" />
            </button>
          </p>
        </div>
      </section>

      {/* ═══ SECTION F: VIDEO PLACEHOLDER ═══ */}
      <section id="demo" className="pt-8 pb-8 px-4" style={{ backgroundColor: "#1e3a5f" }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">PLATFORM DEMO</p>
          <h2 className="text-white text-3xl md:text-[40px] font-bold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>See BioQuill in Action</h2>
          <p className="text-white/70 text-lg mb-10">Watch how BioQuill scores a molecule from search to full due diligence report in under 3 minutes.</p>
          <div className="max-w-[800px] mx-auto aspect-video rounded-xl border-2 border-[#1e3a5f] flex flex-col items-center justify-center" style={{ backgroundColor: "#0f2744" }}>
            <div className="w-20 h-20 rounded-full border-2 border-[#F59E0B] flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-[#F59E0B] ml-1" />
            </div>
            <p className="text-white text-base" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>Platform Demo Video — Coming Soon</p>
          </div>
          <Button className="mt-8 font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("You requested early access after viewing demo section")}>Request Early Access</Button>
        </div>
      </section>

      {/* ═══ SECTION G: REQUEST ACCESS FORM ═══ */}
      <section id="contact" className="pt-8 pb-8 px-4" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">EARLY ACCESS</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] font-bold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>Join the Pipeline Intelligence Revolution</h2>
          <p className="text-muted-foreground mb-10">BioQuill is currently in early access. Request access to be among the first teams to score the global pipeline.</p>
          <ContactForm />
        </div>
      </section>

      {/* ═══ SECTION H: FOOTER ═══ */}
      <footer className="px-4 pt-4 pb-3" style={{ backgroundColor: "#0f2744" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={bioquillEmblem} alt="BioQuill" className="w-6 h-6 object-cover rounded-full" />
              </div>
              <span className="text-white font-bold text-sm">BiOQUILL</span>
            </div>
            <p className="text-[#F59E0B] italic text-sm mb-2">"Know the odds. Understand the pipeline. Win the race."</p>
            <a href="mailto:office@bioquill.net" className="text-white/70 text-sm hover:text-white inline-flex items-center gap-1"><Mail className="h-3 w-3" /> office@bioquill.net</a>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-white/50 uppercase text-xs tracking-wider mb-2">Data</p>
              <p className="text-white/70 text-sm">Source: ClinicalTrials.gov</p>
              <p className="text-white/70 text-sm">Updated: Weekly (every Monday)</p>
            </div>
            <div>
              <p className="text-white/50 uppercase text-xs tracking-wider mb-2">About BioQuill</p>
              <p className="text-white/70 text-sm leading-relaxed">BioQuill is a pharmaceutical pipeline intelligence platform — 14 proprietary models, 28,432 trial profiles, 17,497 unique molecules, 20 therapeutic areas. Built for teams that win the race.</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-[#1e3a5f] pt-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
            <p className="text-white/50 text-xs">© 2026 BioQuill. All rights reserved.</p>
            <div className="flex gap-4 text-white/50 text-xs">
              <span className="hover:text-white/70 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white/70 cursor-pointer">Terms of Service</span>
            </div>
          </div>
          <p className="text-white/40 text-xs leading-relaxed">All analytical outputs are for informational purposes only and do not constitute financial, legal, or medical advice. Data sourced from ClinicalTrials.gov under public access terms.</p>
        </div>
      </footer>
    </div>
  );
}

// ─── Molecule Add to Cart (inline in pricing card) ───
function MoleculeAddToCart({ onAdd }: { onAdd: (name: string) => void }) {
  const [molName, setMolName] = useState("");
  return (
    <div>
      <div className="flex gap-2">
        <Input placeholder="Molecule name..." value={molName} onChange={e => setMolName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { onAdd(molName); setMolName(""); } }} className="flex-1 text-sm" />
        <Button size="sm" className="text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }} onClick={() => { onAdd(molName); setMolName(""); }}>Add to Cart</Button>
      </div>
    </div>
  );
}

// ─── Standalone Contact Form ───
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", org: "", role: "", interest: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:office@bioquill.net?subject=${encodeURIComponent(`BioQuill Access Request — ${formData.name} — ${formData.org}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nOrganisation: ${formData.org}\nRole: ${formData.role}\nPrimary Interest: ${formData.interest}`)}`;
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="max-w-[520px] mx-auto bg-white border-2 border-[#1e3a5f] rounded-xl p-10 text-center"><p className="text-lg font-semibold text-[hsl(142,76%,36%)]">✓ Thank you — we'll be in touch within 2 business days.</p></div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-[520px] mx-auto bg-white border-2 border-[#1e3a5f] rounded-xl p-10 space-y-4 text-left">
      <div><Label>Full Name *</Label><Input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
      <div><Label>Email *</Label><Input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
      <div><Label>Organisation *</Label><Input required value={formData.org} onChange={e => setFormData(p => ({ ...p, org: e.target.value }))} /></div>
      <div>
        <Label>Role</Label>
        <Select value={formData.role} onValueChange={v => setFormData(p => ({ ...p, role: v }))}>
          <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="investor">Investor / Fund Manager</SelectItem>
            <SelectItem value="bdl">BD&L Professional</SelectItem>
            <SelectItem value="strategy">Pharma Strategy / CI</SelectItem>
            <SelectItem value="analyst">Analyst / Advisor</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Primary Interest</Label>
        <Select value={formData.interest} onValueChange={v => setFormData(p => ({ ...p, interest: v }))}>
          <SelectTrigger><SelectValue placeholder="Select interest" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1mol">1 Molecule Report</SelectItem>
            <SelectItem value="1ta">1 Therapeutic Area</SelectItem>
            <SelectItem value="full">Full Access</SelectItem>
            <SelectItem value="explore">Just Exploring</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full rounded-lg text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }}>Request Access</Button>
    </form>
  );
}
