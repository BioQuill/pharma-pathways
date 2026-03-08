import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, TrendingUp, BarChart3, Target, Activity, Clock, Zap } from "lucide-react";
import { DATA_SOURCES } from "@/lib/lpi3Model";

const ModelSection = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
    {children}
  </div>
);

const FormulaBlock = ({ children }: { children: string }) => (
  <div className="p-4 bg-muted/50 rounded-lg border font-mono text-sm whitespace-pre-wrap text-foreground">
    {children}
  </div>
);

const InputsTable = ({ rows }: { rows: { variable: string; definition: string; source: string }[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border">
      <thead>
        <tr className="bg-muted/50">
          <th className="text-left p-3 font-semibold border-b">Variable</th>
          <th className="text-left p-3 font-semibold border-b">Definition</th>
          <th className="text-left p-3 font-semibold border-b">Source</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b hover:bg-muted/30">
            <td className="p-3 font-mono text-xs">{row.variable}</td>
            <td className="p-3 text-muted-foreground">{row.definition}</td>
            <td className="p-3 text-muted-foreground text-xs">{row.source}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CitationFooter = ({ text }: { text: string }) => (
  <div className="mt-6 pt-4 border-t text-xs text-muted-foreground italic">
    <strong>Sources:</strong> {text}
  </div>
);

export const ModelsContent = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <Badge className="mb-3 bg-primary/10 text-primary">BioQuill Proprietary Models</Badge>
        <h1 className="text-3xl font-bold">Model Documentation</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Full methodology, formulas, inputs, outputs, and worked examples for every BioQuill model and metric.
        </p>
      </div>

      <Tabs defaultValue="ptrs" className="w-full">
        <TabsList className="w-full justify-start bg-[#2B3D5B] border-0 rounded-md h-11 px-2 flex-wrap mb-6">
          {[
            { value: "ptrs", label: "PTRS", icon: TrendingUp },
            { value: "monte-carlo", label: "Monte Carlo", icon: Activity },
            { value: "ti", label: "TI", icon: ShieldCheck },
            { value: "lpi", label: "LPI", icon: BarChart3 },
            { value: "composite", label: "Composite Score", icon: Target },
            { value: "capm", label: "CAPM Alpha", icon: Zap },
            { value: "ttm", label: "TTM", icon: Clock },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="gap-2 text-white/70 font-semibold data-[state=active]:bg-white/15 data-[state=active]:text-white hover:text-white/90 text-xs">
                <Icon className="h-3 w-3" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Sub-tab 1: PTRS */}
        <TabsContent value="ptrs">
          <ModelSection title="PTRS — Probability of Technical and Regulatory Success" description="PTRS = PTS × PRS. The probability that a molecule currently in clinical development will successfully complete its remaining clinical phases AND receive regulatory approval.">
            <Card>
              <CardHeader><CardTitle>Formulas</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormulaBlock>{`PTS = base_phase_transition_rate(TA, phase) × slider_modifier
PRS = base_nda_approval_rate(TA) × slider_modifier_asymmetric
PTRS = PTS × PRS`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
              <CardContent>
                <InputsTable rows={[
                  { variable: "base_phase_transition_rate", definition: "Historical phase transition probability for the given TA and phase", source: "BIO/Norstella 2011–2020 (ptrs_calibration.json)" },
                  { variable: "base_nda_approval_rate", definition: "Historical NDA/BLA approval rate by TA", source: "BIO/Norstella 2011–2020 (ptrs_calibration.json)" },
                  { variable: "slider_modifier", definition: "User-adjusted modifier based on molecule-specific factors", source: "Platform input (6 sliders)" },
                  { variable: "slider_modifier_asymmetric", definition: "PRS modifier with capped upside when base PRS ≥ 0.80 (max 1.08×)", source: "Platform calibration" },
                ]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Slider Modifier Logic</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 text-center text-sm">
                  {[
                    { range: "0–20%", mult: "0.50×" },
                    { range: "21–40%", mult: "0.75×" },
                    { range: "41–60%", mult: "1.00×" },
                    { range: "61–80%", mult: "1.20×" },
                    { range: "81–100%", mult: "1.40×" },
                  ].map(s => (
                    <div key={s.range} className="p-3 bg-muted/50 rounded-lg border">
                      <div className="text-xs text-muted-foreground">{s.range}</div>
                      <div className="font-bold mt-1">{s.mult}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  <strong>PRS asymmetric modifier:</strong> When base PRS ≥ 0.80, maximum upside is capped at 1.08× (high-base TAs have limited room to improve).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Worked Example</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2 text-sm">
                  <p><strong>Scenario:</strong> Phase 2 Oncology molecule, all sliders at average (50%)</p>
                  <p>Base PTS (Phase 2 → Phase 3, Oncology): 34.1%</p>
                  <p>Slider modifier (50% → 1.00×): PTS = 34.1% × 1.00 = <strong>34.1%</strong></p>
                  <p>Base PRS (Oncology): 93.5%</p>
                  <p>PRS modifier (50%, base ≥ 0.80 → capped): PRS = <strong>93.5%</strong></p>
                  <p className="text-lg font-bold mt-2">PTRS = 34.1% × 93.5% = <span className="text-primary">31.9%</span></p>
                </div>
              </CardContent>
            </Card>

            <CitationFooter text="Hay et al. Nature Biotechnology 2014; BIO Industry Analysis 2016; Norstella/BIO 2023" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 2: Monte Carlo */}
        <TabsContent value="monte-carlo">
          <ModelSection title="Monte Carlo Simulation" description="Propagates uncertainty through each PTRS input independently across 10,000 iterations to produce a probability distribution of outcomes rather than a single point estimate.">
            <Card>
              <CardHeader><CardTitle>Why Input-Level Uncertainty Matters</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Uncertainty is applied to <strong>each input slider independently</strong>, not to the final output. 
                  This is the correct approach — applying noise to outputs produces meaningless ±0.2% ranges that 
                  dramatically understate true uncertainty.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Algorithm</CardTitle></CardHeader>
              <CardContent>
                <FormulaBlock>{`for each iteration (i = 1 to 10,000):
  sampledBasePTS = basePTS + randn() × (basePTS × 0.12)
  sampledBasePRS = basePRS + randn() × (basePRS × 0.08)
  each slider sampled with ±15% uncertainty (normal distribution)
  PTRS_i = sampledPTS × sampledPRS

Output: mean, median, std dev, P5, P95 across 10,000 iterations`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
              <CardContent>
                <InputsTable rows={[
                  { variable: "basePTS", definition: "Base phase transition probability (sampled with ±12% CV)", source: "BIO/Norstella via PTRS model" },
                  { variable: "basePRS", definition: "Base regulatory approval rate (sampled with ±8% CV)", source: "BIO/Norstella via PTRS model" },
                  { variable: "slider values", definition: "Each of the 6 user sliders (sampled with ±15% uncertainty)", source: "Platform user input" },
                  { variable: "iterations", definition: "Number of simulation runs", source: "Fixed at 10,000" },
                ]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Worked Example</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-2 text-sm">
                  <p><strong>Scenario:</strong> Phase 2 Oncology, average inputs</p>
                  <p>Mean PTRS: ~32%</p>
                  <p>Standard Deviation: ±6%</p>
                  <p>P5–P95 Range: 22% – 43%</p>
                  <p className="text-muted-foreground mt-2">
                    This tells the analyst: "Given uncertainty in our inputs, we're 90% confident the true PTRS 
                    lies between 22% and 43%."
                  </p>
                </div>
              </CardContent>
            </Card>

            <CitationFooter text="Monte Carlo methodology — standard actuarial practice; uncertainty ranges calibrated to BIO/Norstella observed variance" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 3: TI */}
        <TabsContent value="ti">
          <ModelSection title="TI — Therapeutic Index" description="TI = TD50 / ED50 (Toxic Dose 50 / Effective Dose 50). Measures the safety margin between a drug's therapeutic and toxic doses. Higher TI = safer drug with wider margin.">
            <Card>
              <CardHeader><CardTitle>Formula</CardTitle></CardHeader>
              <CardContent>
                <FormulaBlock>{`TI = TD50 / ED50

Where:
  TD50 = dose at which 50% of subjects exhibit toxic effects
  ED50 = dose at which 50% of subjects exhibit therapeutic effects`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Classification Thresholds</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[hsl(0,72%,51%)]/10 border border-[hsl(0,72%,51%)]/30 text-center">
                    <div className="text-2xl font-bold text-[hsl(0,72%,51%)]">{"< 2"}</div>
                    <div className="font-semibold mt-1">Narrow TI</div>
                    <p className="text-xs text-muted-foreground mt-2">Requires careful monitoring. Examples: warfarin, digoxin, lithium, theophylline</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30 text-center">
                    <div className="text-2xl font-bold text-[hsl(45,93%,47%)]">2 – 10</div>
                    <div className="font-semibold mt-1">Moderate TI</div>
                    <p className="text-xs text-muted-foreground mt-2">Standard monitoring protocols sufficient</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[hsl(142,76%,36%)]/10 border border-[hsl(142,76%,36%)]/30 text-center">
                    <div className="text-2xl font-bold text-[hsl(142,76%,36%)]">{"> 10"}</div>
                    <div className="font-semibold mt-1">Wide TI</div>
                    <p className="text-xs text-muted-foreground mt-2">Generally safe. Examples: penicillin, ibuprofen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Clinical Relevance</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Narrow TI drugs require <strong>therapeutic drug monitoring (TDM)</strong>, have higher adverse event rates, and face more stringent regulatory scrutiny.</p>
                <p>TI classification directly impacts: dosing flexibility, label warnings, REMS requirements, and post-market surveillance obligations.</p>
              </CardContent>
            </Card>

            <CitationFooter text="Empirical values from pharmacology literature by drug class, stored in src/lib/therapeuticIndex.ts" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 4: LPI */}
        <TabsContent value="lpi">
          <ModelSection title="LPI — Launch Potential Index" description="Composite score estimating a molecule's commercial launch potential based on market size, competitive landscape, pricing environment, and regulatory pathway.">
            <Card>
              <CardHeader><CardTitle>Model Components</CardTitle></CardHeader>
              <CardContent>
                <InputsTable rows={[
                  { variable: "Scientific / Preclinical", definition: "Target validation strength, modality risk, biomarker availability, MoA novelty", source: "20% weight" },
                  { variable: "Clinical Signals", definition: "Phase-specific historical success rates, effect size, trial complexity, enrollment feasibility", source: "30% weight" },
                  { variable: "Regulatory & Program", definition: "Expedited pathway status, orphan designation, CMC complexity, first-in-class clarity", source: "18% weight" },
                  { variable: "Sponsor / Organization", definition: "Sponsor type/size, TA track record, partnerships, funding runway", source: "15% weight" },
                  { variable: "Market & Commercial", definition: "TAM, competitive density, reimbursement complexity", source: "10% weight" },
                  { variable: "Safety & History", definition: "Early safety signals, drug class history, DILI/QT risk", source: "7% weight" },
                ]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Output</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm">
                  <p><strong>Scale:</strong> 0–100. Displayed as percentage badge on molecule cards.</p>
                  <p className="mt-2"><strong>Interpretation:</strong> Higher LPI indicates greater probability of successful commercial launch, accounting for both scientific merit and market positioning.</p>
                  <p className="mt-2 text-muted-foreground">The LPI model uses XGBoost gradient boosting with isotonic calibration. Full feature attribution via SHAP values provides interpretability.</p>
                </div>
              </CardContent>
            </Card>

            <CitationFooter text="BioQuill proprietary model; calibrated against historical launch outcomes from FDA Drugs@FDA and EMA EPAR databases (2000–2025)" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 5: Composite Score */}
        <TabsContent value="composite">
          <ModelSection title="Composite Score — Overall Molecule Attractiveness" description="Single 0–100 index combining PTRS, LPI, TTM efficiency, TI safety profile, and revenue potential.">
            <Card>
              <CardHeader><CardTitle>Formula</CardTitle></CardHeader>
              <CardContent>
                <FormulaBlock>{`Composite Score = LPI × 0.60 + TTM_Efficiency × 0.40

Where:
  LPI = Launch Potential Index (0–100)
  TTM_Efficiency = max(0, min(100, 100 - ((TTM_months - 1) × (100 / 99))))

TTM_Efficiency converts raw months-to-market into a 0–100 efficiency 
score where lower TTM = higher efficiency score.`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Race to Market Rank</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[hsl(45,90%,50%)]/10 border border-[hsl(45,90%,40%)]/30 text-center">
                    <div className="text-4xl">🥇</div>
                    <div className="text-2xl font-bold" style={{color:'hsl(45,90%,40%)'}}>67–100</div>
                    <div className="font-semibold mt-1">Rank 1</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[hsl(0,0%,75%)]/10 border border-[hsl(0,0%,65%)]/30 text-center">
                    <div className="text-4xl">🥈</div>
                    <div className="text-2xl font-bold" style={{color:'hsl(0,0%,55%)'}}>34–66</div>
                    <div className="font-semibold mt-1">Rank 2</div>
                  </div>
                  <div className="p-4 rounded-lg bg-[hsl(30,60%,45%)]/10 border border-[hsl(30,60%,35%)]/30 text-center">
                    <div className="text-4xl">🥉</div>
                    <div className="text-2xl font-bold" style={{color:'hsl(30,60%,35%)'}}>0–33</div>
                    <div className="font-semibold mt-1">Rank 3</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Output</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>The "Score" badge on molecule cards. Provides a single comparable metric across all molecules regardless of therapeutic area or development phase.</p>
              </CardContent>
            </Card>

            <CitationFooter text="BioQuill proprietary composite; component weights calibrated against historical drug development outcomes" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 6: CAPM Alpha */}
        <TabsContent value="capm">
          <ModelSection title="CAPM Alpha Signals — α₁, α₂, Δα" description="A CAPM-inspired framework for risk-adjusted molecule valuation, comparing molecules against both historical benchmarks and current pipeline competition.">
            
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>α₁ — Historical Benchmark Alpha</CardTitle>
                <CardDescription>How this molecule compares to 25 years of realised drug development outcomes. Answers: does this molecule have the profile of a winner?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormulaBlock>{`α₁ = Actual_PTRS − E(R)

Where:
  E(R) = Rf + β × (Rm_TA − Rf)
  Rf  = 10.4% (BIO/Norstella 20-year all-TA realised LOA)
  Rm  = TA-specific historical LOA from same source
  
Updates: only when new BIO/Norstella cohort published (~every 3–5 years)`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[hsl(142,76%,36%)]">
              <CardHeader>
                <CardTitle>α₂ — Competitive Pipeline Alpha</CardTitle>
                <CardDescription>How this molecule compares to everything currently in development in its TA. Answers: does this molecule stand out from today's competition?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormulaBlock>{`α₂ = Actual_PTRS − Pipeline_Mean_PTRS(TA)

Pipeline_Mean_PTRS computed from live BioQuill 14,000-trial database 
for the molecule's therapeutic area.

Updates: dynamically with every platform data refresh`}</FormulaBlock>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[hsl(45,93%,47%)]">
              <CardHeader>
                <CardTitle>Δα — Alpha Divergence</CardTitle>
                <CardDescription>The gap between historical and competitive positioning</CardDescription>
              </CardHeader>
              <CardContent>
                <FormulaBlock>{`Δα = α₁ − α₂`}</FormulaBlock>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <strong>Δα {">"} 0:</strong> Molecule beats history but lags current pipeline → the field has advanced around it
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <strong>Δα ≈ 0:</strong> Consistently positioned vs both benchmarks → most stable signal
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <strong>Δα {"<"} 0:</strong> Lags history but leads current pipeline → best-in-class today but TA has historically done better
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Beta (β) Estimation</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>β estimated from molecule characteristics: mechanism novelty, regulatory designation, sponsor tier, and development phase.</p>
                <p className="mt-2">Higher β indicates greater sensitivity to TA-level success rates. First-in-class molecules, earlier phases, and smaller sponsors have higher β (more risk-sensitive).</p>
              </CardContent>
            </Card>

            <CitationFooter text="Hay et al. 2014; BIO 2016; Norstella 2023; FDA Drugs@FDA 2000–2025; EMA EPAR 2000–2025" />
          </ModelSection>
        </TabsContent>

        {/* Sub-tab 7: TTM */}
        <TabsContent value="ttm">
          <ModelSection title="TTM — Time to Market" description="Full time from First Patient In (FPI) to First Commercial Launch. Includes all phases: Discovery, Clinical, Regulatory, Market Access, and Launch.">
            <Card>
              <CardHeader><CardTitle>Lifecycle Components</CardTitle></CardHeader>
              <CardContent>
                <InputsTable rows={[
                  { variable: "Discovery", definition: "Target identification through IND filing", source: "27% of total TTM" },
                  { variable: "Clinical", definition: "Phase 1 + Phase 2 + Phase 3 trials", source: "50% of total TTM" },
                  { variable: "Regulatory", definition: "NDA/MAA submission through approval decision", source: "8% of total TTM" },
                  { variable: "Market Access", definition: "Pricing negotiations, HTA submissions, formulary listing", source: "8% of total TTM" },
                  { variable: "Launch", definition: "Supply chain, commercial readiness, first prescriptions", source: "4% of total TTM (remaining 3% rounding)" },
                ]} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>TA-Specific Benchmarks</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Each therapeutic area has a defined total duration. Examples:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {[
                    { ta: "Oncology/Hematology", years: "~11 years" },
                    { ta: "Neurology", years: "~15 years" },
                    { ta: "Rare Disease", years: "~9 years" },
                    { ta: "Infectious Disease", years: "~10 years" },
                  ].map(t => (
                    <div key={t.ta} className="p-3 bg-muted/50 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground">{t.ta}</div>
                      <div className="font-bold mt-1">{t.years}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Important Distinction</CardTitle></CardHeader>
              <CardContent>
                <div className="p-4 bg-[hsl(45,93%,47%)]/10 border border-[hsl(45,93%,47%)]/30 rounded-lg text-sm">
                  <p><strong>TTM ≠ Approval Time.</strong></p>
                  <p className="mt-2 text-muted-foreground">
                    The "Approval Times" tab shows <strong>regulatory review time only</strong> (Phase 3 end → approval decision: typically 10–24 months). 
                    TTM is the <strong>full FPI → commercial launch pathway</strong> — a much larger number (8–16 years).
                  </p>
                </div>
              </CardContent>
            </Card>

            <CitationFooter text="Empirical clinical TTM from EMA EPAR × ClinicalTrials.gov matching (396 matched drugs). FDA regulatory TTM from Tufts CSDD published averages." />
          </ModelSection>
        </TabsContent>
      </Tabs>
    </div>
  );
};
