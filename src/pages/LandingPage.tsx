import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search, X, Play, Menu, ChevronRight, Mail } from "lucide-react";
import bioquillEmblem from "@/assets/bioquill-emblem.png";
import bioquillFullLogo from "@/assets/bioquill-full-logo.png";
import { useMolecules } from "@/hooks/useMolecules";
import { MoleculeDistributionChart } from "@/components/MoleculeDistributionChart";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://formspree.io/f/office@bioquill.net", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, context, _subject: `BioQuill Access Request: ${formData.name}` }),
      });
    } catch {
      // fallback — mailto
      window.location.href = `mailto:office@bioquill.net?subject=Access Request&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nOrg: ${formData.org}\nRole: ${formData.role}\nInterest: ${formData.interest}\nContext: ${context}`)}`;
    }
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
        <div className="flex gap-2">
          <Button size="sm" className="text-xs text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }} onClick={() => onWaitlist(`You requested access to: Full Analysis — ${showcase.molecule}`)}>
            Full Analysis: {showcase.molecule} →
          </Button>
          <Button size="sm" variant="outline" className="text-xs border-[#1e3a5f] text-[#1e3a5f]" onClick={() => onWaitlist(`You requested access to: ${card.label} Model — Run on your molecule`)}>
            Run on your molecule →
          </Button>
        </div>
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

  const openWaitlist = useCallback((ctx: string) => {
    setWaitlistContext(ctx);
    setWaitlistOpen(true);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // ─── Live stats ───
  const activeTrials = allMolecules.length;
  const uniqueMolecules = new Set(allMolecules.map(m => m.name?.toLowerCase().trim())).size;
  const recruiting = allMolecules.filter(m => (m as any)._raw?.status === "RECRUITING").length;
  const notRecruiting = allMolecules.filter(m => (m as any)._raw?.status === "ACTIVE_NOT_RECRUITING").length;
  const shimmer = !fullyLoaded ? "animate-pulse" : "";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Manrope, Inter, sans-serif" }}>
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} context={waitlistContext} />

      {/* ═══ SECTION A: STICKY HEADER ═══ */}
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
              <button key={s} onClick={() => scrollTo(s)} className="text-sm font-semibold text-[#1A1A1A]/80 hover:text-[#1A1A1A] capitalize">{s === "models" ? "Models" : s === "about" ? "About" : s === "pricing" ? "Pricing" : "Contact"}</button>
            ))}
            <span className="text-xs text-[#1A1A1A]/60 whitespace-nowrap" style={{ background: "rgba(255,255,255,0.35)", borderRadius: 20, padding: "3px 10px" }}>Data refreshed: 05/03/2026</span>
            <Button variant="outline" size="sm" className="border-[#1e3a5f] text-[#1e3a5f] font-bold text-xs" onClick={() => navigate("/platform")}>Enter Platform</Button>
            <Button size="sm" className="font-bold text-xs text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("")}>Request Access</Button>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="h-5 w-5 text-[#1A1A1A]" /></button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5C518] border-t border-[#1A1A1A]/10 px-4 py-3 space-y-2">
            {["about", "models", "pricing", "contact"].map(s => (
              <button key={s} onClick={() => scrollTo(s)} className="block text-sm font-semibold text-[#1A1A1A] capitalize w-full text-left">{s}</button>
            ))}
            <Button variant="outline" size="sm" className="w-full border-[#1e3a5f] text-[#1e3a5f] font-bold" onClick={() => navigate("/platform")}>Enter Platform</Button>
            <Button size="sm" className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("")}>Request Access</Button>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: 48 }} />

      {/* ═══ SECTION B: LIVE PLATFORM PREVIEW ═══ */}
      <section id="models">
        {/* Sub-headline */}
        <div className="bg-white py-8 px-4">
          <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-6">
            <p className="text-[#1e3a5f] text-center md:text-left text-lg md:text-xl leading-relaxed flex-1" style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400 }}>
              13 proprietary models. 21,739 industry-sponsored trial profiles. 20 therapeutic areas. Every asset scored on launch probability, time to market, regulatory pathway, competitive position, and market access.
            </p>
            <div className="flex gap-2 shrink-0">
              <Button className="font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("")}>Request Access</Button>
              <Button variant="outline" className="border-[#1e3a5f] text-[#1e3a5f] font-bold" onClick={() => navigate("/platform")}>Enter Platform</Button>
            </div>
          </div>
        </div>

        {/* 6 Stat Cards */}
        <div className="container mx-auto px-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Active Trials", value: activeTrials.toLocaleString(), color: "#0E1D35" },
              { label: "Molecules", value: uniqueMolecules.toLocaleString(), color: "#0E1D35" },
              { label: "Recruiting", value: recruiting.toLocaleString(), color: "hsl(142,76%,36%)" },
              { label: "Not Recruiting", value: notRecruiting.toLocaleString(), color: "hsl(45,93%,47%)" },
              { label: "Avg Approval", value: "8.3y", color: "hsl(142,76%,36%)" },
              { label: "Success Rate", value: "11.4%", color: "hsl(45,93%,47%)" },
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
              <ModelCard
                key={card.id}
                card={card}
                expanded={expandedCard === card.id}
                onExpand={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                onCollapse={() => setExpandedCard(null)}
                onWaitlist={openWaitlist}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
            {MODEL_CARDS_ROW2.map(card => (
              <ModelCard
                key={card.id}
                card={card}
                expanded={expandedCard === card.id}
                onExpand={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
                onCollapse={() => setExpandedCard(null)}
                onWaitlist={openWaitlist}
              />
            ))}
          </div>
        </div>

        {/* TA Distribution Card */}
        {!loading && allMolecules.length > 0 && (
          <div className="container mx-auto px-4 mb-4">
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

        {/* Search Bar */}
        <div className="container mx-auto px-4 mb-8">
          <InteractiveOverlay onClick={() => openWaitlist("Request access to search the full pipeline")}>
            <div className="relative w-full max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Search 21,739 trial profiles..."
                readOnly
                className="w-full pl-9 pr-4 py-2 text-[13px] rounded-lg bg-[#f0fdf4] placeholder:text-[#64748b] cursor-pointer"
                style={{ fontFamily: "Manrope, sans-serif", fontWeight: 400, border: "2.5px solid #0E1D35" }}
              />
            </div>
          </InteractiveOverlay>
        </div>
      </section>

      {/* ═══ SECTION C: PHILOSOPHY ═══ */}
      <section id="about" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">WHY BIOQUILL</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] leading-tight font-bold mb-12" style={{ fontFamily: "Manrope, sans-serif" }}>
            In the race to market, the best decision<br className="hidden md:block" /> is always the most probable one.
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
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
          <p className="text-center text-[#1e3a5f] italic text-lg" style={{ fontFamily: "Manrope, sans-serif" }}>
            "In the race to market, the best decision is always the most probable one."
          </p>
        </div>
      </section>

      {/* ═══ SECTION D: WHO IT'S FOR ═══ */}
      <section className="py-20 px-4" style={{ backgroundColor: "#F8F9FA" }}>
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

      {/* ═══ SECTION E: PRICING SUMMARY ═══ */}
      <section id="pricing" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">PRICING</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] font-bold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>From Single Molecule to Full Pipeline</h2>
          <p className="text-muted-foreground text-lg mb-12">Configure your scope. Pay for what you need.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 1 Molecule */}
            <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>1 Molecule</h3>
              <p className="text-3xl font-bold text-[#1e3a5f] mb-1">$5,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <p className="text-sm text-muted-foreground mb-6">1 molecule — all development phases</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                <li>• Full compounded DD report (print & export)</li>
                <li>• All 13 models</li>
                <li>• 1-year monitoring & alerts</li>
              </ul>
              <Button className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("You requested access to: 1 Molecule Plan")}>Request Access</Button>
            </div>
            {/* 1 TA */}
            <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8 relative">
              <Badge className="absolute -top-3 left-6 text-[#1e3a5f] font-bold" style={{ backgroundColor: "#F59E0B" }}>Most Flexible</Badge>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>1 Therapeutic Area</h3>
              <p className="text-3xl font-bold text-[#1e3a5f] mb-1">From $5,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <p className="text-sm text-muted-foreground mb-6">Your TA + your phases — price scales with scope</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                <li>• All trial profiles in selected TA + phases</li>
                <li>• Full DD reports for every profile</li>
                <li>• 1-year monitoring & automated alerts</li>
              </ul>
              <Button className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("You requested access to: 1 Therapeutic Area Plan")}>Request Access</Button>
            </div>
            {/* Full Access */}
            <div className="border-[2.5px] border-[#1e3a5f] rounded-xl p-8 relative">
              <Badge className="absolute -top-3 left-6 bg-[#1e3a5f] text-white font-bold">Enterprise</Badge>
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>Full Access</h3>
              <p className="text-3xl font-bold text-[#1e3a5f] mb-1">$300,000 <span className="text-sm font-normal text-muted-foreground">/ year</span></p>
              <p className="text-sm text-muted-foreground mb-6">21,739 trial profiles — all 20 TAs — all phases</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                <li>• Complete global pipeline coverage</li>
                <li>• Dedicated account manager</li>
                <li>• Custom scoring configurations</li>
              </ul>
              <Button className="w-full font-bold text-[#1e3a5f]" style={{ backgroundColor: "#F59E0B" }} onClick={() => openWaitlist("You requested access to: Full Access — Enterprise")}>Contact Sales</Button>
            </div>
          </div>
          <p className="text-center">
            <button onClick={() => navigate("/platform")} className="text-[#F59E0B] font-semibold text-sm hover:underline inline-flex items-center gap-1">
              See full pricing details → <ChevronRight className="h-3 w-3" />
            </button>
          </p>
        </div>
      </section>

      {/* ═══ SECTION F: VIDEO PLACEHOLDER ═══ */}
      <section id="demo" className="py-20 px-4" style={{ backgroundColor: "#1e3a5f" }}>
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
      <section id="contact" className="py-20 px-4" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#F59E0B] text-xs font-bold uppercase tracking-[0.2em] mb-4">EARLY ACCESS</p>
          <h2 className="text-[#1e3a5f] text-3xl md:text-[40px] font-bold mb-3" style={{ fontFamily: "Manrope, sans-serif" }}>Join the Pipeline Intelligence Revolution</h2>
          <p className="text-muted-foreground mb-10">BioQuill is currently in early access. Request access to be among the first teams to score the global pipeline.</p>
          <ContactForm />
        </div>
      </section>

      {/* ═══ SECTION H: FOOTER ═══ */}
      <footer className="px-4 pt-16 pb-10" style={{ backgroundColor: "#0f2744" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 mb-10">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img src={bioquillEmblem} alt="BioQuill" className="w-6 h-6 object-cover rounded-full" />
              </div>
              <span className="text-white font-bold text-sm">BiOQUILL</span>
            </div>
            <p className="text-[#F59E0B] italic text-sm mb-2">"Know the odds. Understand the pipeline. Win the race."</p>
            <a href="mailto:office@bioquill.net" className="text-white/70 text-sm hover:text-white inline-flex items-center gap-1"><Mail className="h-3 w-3" /> office@bioquill.net</a>
          </div>
          {/* Center */}
          <div className="text-sm space-y-4">
            <div>
              <p className="text-white/50 uppercase text-xs tracking-wider mb-2">Platform</p>
              <div className="space-y-1">
                <button onClick={() => navigate("/platform")} className="block text-white/70 hover:text-white">Enter Platform</button>
                <button onClick={() => scrollTo("models")} className="block text-white/70 hover:text-white">Models</button>
                <button onClick={() => scrollTo("pricing")} className="block text-white/70 hover:text-white">Pricing</button>
                <button onClick={() => openWaitlist("")} className="block text-white/70 hover:text-white">Request Access</button>
              </div>
            </div>
            <div>
              <p className="text-white/50 uppercase text-xs tracking-wider mb-2">Data</p>
              <p className="text-white/70">Source: ClinicalTrials.gov</p>
              <p className="text-white/70">Updated: Weekly (every Monday)</p>
            </div>
          </div>
          {/* Right */}
          <div>
            <p className="text-white/50 uppercase text-xs tracking-wider mb-2">About BioQuill</p>
            <p className="text-white/70 text-sm leading-relaxed">BioQuill is a pharmaceutical pipeline intelligence platform — 13 proprietary models, 21,739 trial profiles, 20 therapeutic areas. Built for the teams running the race.</p>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="max-w-6xl mx-auto border-t border-[#1e3a5f] pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
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

// ─── Standalone Contact Form ───
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", org: "", role: "", interest: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("https://formspree.io/f/office@bioquill.net", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _subject: `BioQuill Access Request: ${formData.name}` }),
      });
    } catch {
      window.location.href = `mailto:office@bioquill.net?subject=Access Request&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nOrg: ${formData.org}`)}`;
    }
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
