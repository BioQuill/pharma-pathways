import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GitBranch, Target, Layers, AlertTriangle, CheckCircle, ArrowRight, Lightbulb, BarChart3, Scale, Zap, Shield, TrendingUp } from "lucide-react";
import { DecisionFrameworkPDFExport } from "@/components/DecisionFrameworkPDFExport";
import { TriangulationCalculator } from "@/components/TriangulationCalculator";

const triangulationScenarios = [
  { scenario: "High Confidence", model1: "75% (High)", model2: "78% (High)", interpretation: "Models converge; strong consensus", action: "Proceed with confidence; prioritize market entry", color: "bg-green-50 dark:bg-green-950/20 border-green-200" },
  { scenario: "Moderate Confidence", model1: "68% (High)", model2: "58% (Moderate)", interpretation: "Model 1 optimistic, Model 2 cautions", action: "Validate comparator assumptions; consider differentiation strategy. May indicate novel value proposition not captured by comparators, OR Model 1 over-optimistic", color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200" },
  { scenario: "Low Confidence", model1: "82% (Very High)", model2: "52% (Moderate)", interpretation: "Divergent results — red flag", action: "High risk; consider indication repositioning, pricing strategy, or deprioritize. Investigate extreme divergence", color: "bg-red-50 dark:bg-red-950/20 border-red-200" },
  { scenario: "Bearish Signal", model1: "45% (Moderate)", model2: "42% (Moderate)", interpretation: "Models converge low", action: "Possible causes: (1) First-in-class undervalued by Model 2, (2) Model 1 missing market realities. Deep investigation required", color: "bg-red-50 dark:bg-red-950/20 border-red-200" },
];

const portfolioPrioritizationExample = [
  { molecule: "A", ta: "Oncology", model2US: "85%", model1US: "88%", weighted: "87%", rank: 1, decision: "Accelerate (Phase III investment)" },
  { molecule: "B", ta: "Rare Disease", model2US: "90%", model1US: "92%", weighted: "91%", rank: 2, decision: "Accelerate (orphan priority)" },
  { molecule: "C", ta: "Immunology", model2US: "72%", model1US: "78%", weighted: "76%", rank: 3, decision: "Proceed (standard timeline)" },
  { molecule: "D", ta: "Cardiology", model2US: "58%", model1US: "65%", weighted: "62%", rank: 4, decision: "Monitor (risk-sharing strategy)" },
  { molecule: "E", ta: "Dermatology", model2US: "48%", model1US: "52%", weighted: "50%", rank: 5, decision: "Deprioritize (competitive market)" },
  { molecule: "F", ta: "Pain Management", model2US: "38%", model1US: "42%", weighted: "40%", rank: 6, decision: "Pause (opioid crisis headwinds)" },
];

const marketEntryExample = [
  { market: "US", model1: "79%", model2: "74%", confidence: "77%", marketSize: "$12B", price: "High ($8K/year)", speed: "12 mo", score: 92 },
  { market: "Germany", model1: "71%", model2: "68%", confidence: "70%", marketSize: "€1.8B", price: "Medium (€4K)", speed: "9 mo", score: 78 },
  { market: "Japan", model1: "65%", model2: "62%", confidence: "64%", marketSize: "¥450B", price: "Medium (¥600K)", speed: "18 mo", score: 68 },
  { market: "UK", model1: "58%", model2: "54%", confidence: "56%", marketSize: "£800M", price: "Low (£2.5K)", speed: "15 mo", score: 58 },
  { market: "China", model1: "48%", model2: "45%", confidence: "47%", marketSize: "¥15B", price: "Very Low (¥8K)", speed: "24 mo", score: 52 },
  { market: "Brazil", model1: "42%", model2: "38%", confidence: "40%", marketSize: "R$2B", price: "Low (R$12K)", speed: "30 mo", score: 38 },
];

const rescueDiagnostic = [
  { dimension: "Clinical", score: "18/30", max: "30", issue: "Non-inferior to apixaban (no superiority)" },
  { dimension: "Economic", score: "16/30", max: "30", issue: "ICER $95K/QALY (borderline), budget impact high" },
  { dimension: "Access", score: "12/25", max: "25", issue: "Major barrier: No guideline inclusion yet" },
  { dimension: "Political", score: "10/15", max: "15", issue: "No breakthrough designation" },
];

const rescueInterventions = [
  { intervention: "Conduct superiority trial vs. apixaban", impact: "+15-20%", cost: "$80M", timeline: "3 years", risk: "High (may fail)" },
  { intervention: "Secure ACC/AHA guideline inclusion", impact: "+10-12%", cost: "$2M (advocacy, KOL engagement)", timeline: "1-2 years", risk: "Medium" },
  { intervention: "Offer outcomes-based rebate (stroke reduction)", impact: "+8-10%", cost: "Revenue-neutral", timeline: "6 months", risk: "Low" },
  { intervention: "Pursue FDA Breakthrough (post-hoc subgroup)", impact: "+10-12%", cost: "$5M", timeline: "12 months", risk: "Medium" },
  { intervention: "Price reduction (15% below apixaban)", impact: "+6-8%", cost: "-$400M NPV", timeline: "Immediate", risk: "Low" },
];

const limitations = [
  { title: "Competitive Dynamics (Pipeline Risk)", desc: "Models are backward-looking (recent approvals). Don't account for competitive molecules in Phase III that may launch before yours.", mitigation: "Conduct competitive intelligence; adjust probabilities down if 2+ competitors expected in 12-18 months." },
  { title: "Political/Regulatory Black Swans", desc: "FDA safety signals post-approval, sudden policy shifts (IRA), pandemic disruptions.", mitigation: "Scenario planning (base case, bull case, bear case)." },
  { title: "Payer Consolidation/Market Structure", desc: "Models use current payer landscape (2024-2025). Mega-mergers change negotiation dynamics.", mitigation: "Monitor M&A activity; update base rates annually." },
  { title: "Real-World Evidence (RWE) Impact", desc: "Models assume clinical trial efficacy translates to real-world. RWE may reveal lower/higher effectiveness.", mitigation: "Post-launch, integrate RWE into Model 2 comparator benchmarks." },
  { title: "Manufacturer Strategic Choices", desc: "Pricing strategy, contract structure, launch sequencing affect outcomes.", mitigation: "Models provide probability ranges; pricing/contracting adjust final outcomes." },
];

const caseStudyModel2 = {
  comparators: [
    { metric: "PASI 75 (week 16)", compAvg: "58%", yours: "62%", ratio: "1.07" },
    { metric: "PASI 90 (week 16)", compAvg: "35%", yours: "38%", ratio: "1.09" },
    { metric: "Safety (serious AEs)", compAvg: "2.5%", yours: "1.8%", ratio: "1.39 (better)" },
    { metric: "ICER ($/QALY)", compAvg: "$82K", yours: "$78K", ratio: "1.05 (better)" },
    { metric: "Target Population (US)", compAvg: "1.2M", yours: "1.2M", ratio: "1.0" },
    { metric: "Price ($/year)", compAvg: "$72K", yours: "$75K", ratio: "0.96 (slight premium)" },
    { metric: "Evidence Quality", compAvg: "4.2/5", yours: "4.5/5", ratio: "1.07" },
  ],
  model1Scores: [
    { dimension: "Clinical", score: "23/25", weight: "25%", weighted: "5.75" },
    { dimension: "Economic", score: "23/30", weight: "30%", weighted: "6.9" },
    { dimension: "Access", score: "24/30", weight: "30%", weighted: "7.2" },
    { dimension: "Political", score: "9/15", weight: "15%", weighted: "1.35" },
  ],
};

const keyTakeaways = [
  { title: "Use Model 2 for speed; Model 1 for depth", desc: "Portfolio screening → Model 2. Due diligence/investment → Model 1. Triangulate for high-stakes decisions." },
  { title: "Models are complementary, not competitive", desc: "Model 2 captures competitive reality (comparator benchmarking). Model 1 captures absolute value (clinical, economic, access merit). Divergence = important signal." },
  { title: "Pediatric overlay is powerful", desc: "+8-15% bonus across markets reflects regulatory advantages (PREA, BPCA, PRV), payer prioritization, and ethical imperatives." },
  { title: "Therapeutic area matters enormously", desc: "Oncology/Rare Diseases: 75-90% base rates (high unmet need). Dermatology/Pain: 45-55% (competitive, scrutiny). Mental Health: 58-62% (parity laws help, but barriers)." },
  { title: "Market selection is strategic", desc: "US: Highest probability + highest price = prioritize. Germany: Fast access (6-9 months). UK NICE: Precedent-setting. China: Massive volume if successful." },
  { title: "Probability ≠ Certainty", desc: "95% probability still means 1 in 20 chance of failure. Use scenario planning. Monitor competitive pipeline, regulatory changes, payer policy shifts." },
];

const decisionBands = [
  { range: ">75%", label: "High confidence", action: "Accelerate development", color: "bg-green-100 text-green-800 border-green-200" },
  { range: "60-75%", label: "Moderate-high", action: "Proceed with risk mitigation (outcomes-based contracts, guideline advocacy)", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { range: "45-60%", label: "Moderate", action: "Deep-dive required; consider rescue strategies", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { range: "<45%", label: "Low confidence", action: "Pause or pivot (indication repositioning, pricing strategy)", color: "bg-red-100 text-red-800 border-red-200" },
];

export const ModelsDecisionFramework = () => {
  return (
    <div id="decision-framework-content" className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <GitBranch className="h-6 w-6 text-primary" />
                Unified Models 1 & 2 Decision Framework
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Integrated workflow for model selection, triangulation, and practical application across portfolio prioritization, market entry, and rescue strategies
              </CardDescription>
            </div>
            <DecisionFrameworkPDFExport />
          </div>
        </CardHeader>
      </Card>

      {/* Interactive Triangulation Calculator */}
      <TriangulationCalculator />

      <Accordion type="multiple" defaultValue={["step1"]} className="space-y-3">
        {/* STEP 1: Decision Tree */}
        <AccordionItem value="step1" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Step 1: When to Use Which Model — Decision Tree
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-sm mb-3">START: New Molecule Assessment</h4>
                <div className="space-y-3 text-sm">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold">Are there 3+ comparable approved drugs in therapeutic area (2020-2025)?</p>
                    <div className="ml-4 mt-2 space-y-2">
                      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded p-3">
                        <p className="font-semibold text-green-700 dark:text-green-300">YES → Use MODEL 2 (Comparative Benchmarking)</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>• Your molecule is "me-better" → Model 2 provides rapid, data-driven probability</li>
                          <li>• Your molecule is similar or worse → Model 2 flags challenges; consider Model 1 for deeper analysis</li>
                        </ul>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded p-3">
                        <p className="font-semibold text-blue-700 dark:text-blue-300">NO → Use MODEL 1 (Weighted Scoring)</p>
                        <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                          <li>• First-in-class, novel mechanism? → Model 1 required (no comparators exist)</li>
                          <li>• TA with few recent approvals? → Model 1 required (insufficient comparator data)</li>
                          <li>• Cross-cutting indication (e.g., pain across conditions)? → Model 1 with indication-specific scoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="font-semibold">Is your molecule BOTH novel AND has some comparators?</p>
                    <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 rounded p-3 mt-2">
                      <p className="font-semibold text-purple-700 dark:text-purple-300">Use BOTH MODELS (Triangulate Results)</p>
                      <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                        <li>• Model 1: Assess absolute merit (clinical, economic, access)</li>
                        <li>• Model 2: Benchmark against existing therapies</li>
                        <li>• Compare: If both &gt;70%, high confidence; if divergent, deeper diligence needed</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4">
                    <p className="font-semibold">Portfolio Prioritization across 20 TAs?</p>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded p-3 mt-2">
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>1. Run Model 2 for all TAs with comparators (rapid screening)</li>
                        <li>2. Then deep-dive Model 1 for top 3-5 candidates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* STEP 2: Integrated Workflow */}
        <AccordionItem value="step2" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Step 2: Integrated Workflow (Using Both Models)
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Zap className="h-4 w-4" /> Phase 1: Rapid Assessment (Model 2)
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">2-4 hours per molecule</Badge>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>
                    <p className="font-semibold mb-1">Inputs:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• 3-5 recent comparator approvals (2020-2025)</li>
                      <li>• Clinical endpoints, safety, ICER, pricing data</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Process:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>1. Calculate Composite Comparator Score (6 dimensions)</li>
                      <li>2. Apply to historical base rate for TA + Market</li>
                      <li>3. Add market-specific adjustments</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground"><strong>Output:</strong> Probability range by market (8 markets)</p>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Scale className="h-4 w-4" /> Phase 2: Deep-Dive (Model 1)
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">1-2 days per molecule</Badge>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div>
                    <p className="font-semibold mb-1">Inputs:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• Detailed clinical trial data (Phase II/III)</li>
                      <li>• Health economic modeling (ICER, budget impact)</li>
                      <li>• Regulatory pathway assessment</li>
                      <li>• Payer landscape intelligence</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Process:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>1. Score across 4 dimensions (Clinical, Economic, Access, Political)</li>
                      <li>2. Apply market-specific weights</li>
                      <li>3. Add TA-specific adjustments</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground"><strong>Output:</strong> Total score 0-100; probability band by market</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <BarChart3 className="h-4 w-4" /> Phase 3: Triangulation
                  </CardTitle>
                  <Badge variant="outline" className="text-xs w-fit">~1 hour</Badge>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <div className="bg-muted/50 border rounded p-2 font-mono text-center">
                    <p className="font-bold">Confidence-Weighted Probability</p>
                    <p>= (Model 1 × W₁) + (Model 2 × W₂)</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Weights:</p>
                    <ul className="text-muted-foreground space-y-0.5">
                      <li>• W₁ = 0.6 if first-in-class (favor Model 1)</li>
                      <li>• W₁ = 0.4 if me-better with comparators (favor Model 2)</li>
                      <li>• W₂ = 1 - W₁</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Triangulation Scenarios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Triangulation Scenarios & Interpretation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {triangulationScenarios.map((s, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${s.color}`}>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="font-bold">{s.scenario}</Badge>
                        <span className="text-xs">Model 1: <strong>{s.model1}</strong></span>
                        <span className="text-xs">Model 2: <strong>{s.model2}</strong></span>
                      </div>
                      <p className="text-xs mt-1"><strong>Interpretation:</strong> {s.interpretation}</p>
                      <p className="text-xs text-muted-foreground"><strong>Action:</strong> {s.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Triangulation Example */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Worked Example: Novel IL-33 inhibitor for severe eosinophilic asthma
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded p-3">
                    <p className="font-bold text-blue-700 dark:text-blue-300">Model 1 Result: 82% (Very High)</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Clinical: 28/30 (superior exacerbation reduction)</li>
                      <li>• Economic: 24/30 (ICER $118K, favorable)</li>
                      <li>• Access: 22/25 (GINA guideline anticipated)</li>
                      <li>• Political: 13/15 (novel mechanism, unmet need)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded p-3">
                    <p className="font-bold text-green-700 dark:text-green-300">Model 2 Result: 72% (High)</p>
                    <ul className="text-muted-foreground mt-1 space-y-0.5">
                      <li>• Composite Score: 1.16 (16% better than comparators)</li>
                      <li>• Base rate (Respiratory): 62%</li>
                      <li>• Adjusted: 62% × 1.16 = 72%</li>
                      <li>• Adjustments: +8% +10% +8% = 98% → cap 95%</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 border rounded p-3 text-center">
                  <p className="font-semibold">Me-better with comparators → W₁ = 0.4, W₂ = 0.6</p>
                  <p className="font-mono">(82% × 0.4) + (72% × 0.6) = 32.8% + 43.2% = <strong className="text-primary">76%</strong></p>
                  <p className="text-muted-foreground mt-1">Interpretation: High probability (76%), proceed with launch planning; anticipate 15-20% payer rebates.</p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* STEP 3: Practical Application */}
        <AccordionItem value="step3" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              Step 3: Practical Application Guide
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {/* Use Case 1: Portfolio Prioritization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Use Case 1: Portfolio Prioritization (10 Molecules Across TAs)</CardTitle>
                <CardDescription>Rank pipeline molecules by payer support probability to allocate resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs space-y-1">
                  <p><strong>Workflow:</strong></p>
                  <ol className="list-decimal ml-4 text-muted-foreground space-y-1">
                    <li>Screen all 10 with Model 2 (rapid, 1 day total) → Identify top 5 with &gt;65% in 3+ major markets</li>
                    <li>Deep-dive top 5 with Model 1 (5 days, 1 day each) → Validate and identify strengths/weaknesses</li>
                    <li>Triangulate & Rank → Confidence-weighted probability → Prioritize top 3 for accelerated development</li>
                  </ol>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-semibold">Molecule</th>
                        <th className="text-left p-2 font-semibold">TA</th>
                        <th className="text-center p-2 font-semibold">Model 2 (US)</th>
                        <th className="text-center p-2 font-semibold">Model 1 (US)</th>
                        <th className="text-center p-2 font-semibold">Conf-Weighted</th>
                        <th className="text-center p-2 font-semibold">Rank</th>
                        <th className="text-left p-2 font-semibold">Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioPrioritizationExample.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{r.molecule}</td>
                          <td className="p-2">{r.ta}</td>
                          <td className="p-2 text-center">{r.model2US}</td>
                          <td className="p-2 text-center">{r.model1US}</td>
                          <td className="p-2 text-center"><Badge variant="outline" className={`text-xs ${parseInt(r.weighted) >= 70 ? 'text-green-600 border-green-300' : parseInt(r.weighted) >= 50 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>{r.weighted}</Badge></td>
                          <td className="p-2 text-center font-bold">{r.rank}</td>
                          <td className="p-2 text-muted-foreground">{r.decision}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 2: Market Entry Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Use Case 2: Market Entry Strategy (Single Molecule, 8 Markets)</CardTitle>
                <CardDescription>Example: Novel SGLT2 Inhibitor for CKD — Determine optimal launch sequence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-semibold">Market</th>
                        <th className="text-center p-2 font-semibold">Model 1</th>
                        <th className="text-center p-2 font-semibold">Model 2</th>
                        <th className="text-center p-2 font-semibold">Confidence</th>
                        <th className="text-center p-2 font-semibold">Market Size</th>
                        <th className="text-center p-2 font-semibold">Price</th>
                        <th className="text-center p-2 font-semibold">Speed</th>
                        <th className="text-center p-2 font-semibold">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketEntryExample.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{r.market}</td>
                          <td className="p-2 text-center">{r.model1}</td>
                          <td className="p-2 text-center">{r.model2}</td>
                          <td className="p-2 text-center">{r.confidence}</td>
                          <td className="p-2 text-center">{r.marketSize}</td>
                          <td className="p-2 text-center text-muted-foreground">{r.price}</td>
                          <td className="p-2 text-center">{r.speed}</td>
                          <td className="p-2 text-center"><Badge variant="outline" className={`text-xs font-bold ${r.score >= 70 ? 'text-green-600 border-green-300' : r.score >= 50 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>{r.score}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-muted/50 border rounded p-3 text-xs">
                  <p className="font-semibold mb-1">Launch Sequence Decision:</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• <strong>Year 1:</strong> US (priority), Germany (parallel EU)</li>
                    <li>• <strong>Year 2:</strong> Japan, UK</li>
                    <li>• <strong>Year 3:</strong> China (post-VBP negotiation), Brazil (post-CONITEC)</li>
                    <li>• <strong>India:</strong> Opportunistic (post-China pricing, tiered strategy)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Use Case 3: Rescue Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Use Case 3: Rescue Strategy (Low Probability Molecule)</CardTitle>
                <CardDescription>Scenario: Both models indicate 45% probability — Example: Novel Oral Anticoagulant for A-Fib</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-2">1. Decompose Scores to Identify Weakness:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-2 font-semibold">Dimension</th>
                          <th className="text-center p-2 font-semibold">Score</th>
                          <th className="text-center p-2 font-semibold">Max</th>
                          <th className="text-left p-2 font-semibold">Issue Identified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rescueDiagnostic.map((r, i) => (
                          <tr key={i} className="border-b hover:bg-muted/30">
                            <td className="p-2 font-medium">{r.dimension}</td>
                            <td className="p-2 text-center"><Badge variant="outline" className="text-xs">{r.score}</Badge></td>
                            <td className="p-2 text-center">{r.max}</td>
                            <td className="p-2 text-muted-foreground">{r.issue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold mb-2">2. Intervention Options:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-2 font-semibold">Intervention</th>
                          <th className="text-center p-2 font-semibold">Impact</th>
                          <th className="text-center p-2 font-semibold">Cost</th>
                          <th className="text-center p-2 font-semibold">Timeline</th>
                          <th className="text-center p-2 font-semibold">Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rescueInterventions.map((r, i) => (
                          <tr key={i} className="border-b hover:bg-muted/30">
                            <td className="p-2 font-medium">{r.intervention}</td>
                            <td className="p-2 text-center"><Badge variant="outline" className="text-xs text-green-600 border-green-300">{r.impact}</Badge></td>
                            <td className="p-2 text-center text-muted-foreground">{r.cost}</td>
                            <td className="p-2 text-center">{r.timeline}</td>
                            <td className="p-2 text-center text-muted-foreground">{r.risk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded p-3 text-xs">
                  <p className="font-semibold">Recommended Multi-Intervention Strategy:</p>
                  <ul className="text-muted-foreground mt-1 space-y-0.5">
                    <li>• <strong>Short-term (6-12 months):</strong> Outcomes-based rebate + guideline advocacy = +18-22% → Probability: 63-67% (High)</li>
                    <li>• <strong>Long-term (2-3 years):</strong> Superiority trial investment if short-term strategy insufficient</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* STEP 4: Limitations */}
        <AccordionItem value="step4" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Step 4: Model Limitations & Complementary Analysis
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">What Models 1 & 2 DON'T Capture (Requires Qualitative Judgment)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {limitations.map((l, i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <p className="text-sm font-semibold">{i + 1}. {l.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{l.desc}</p>
                      <p className="text-xs mt-1"><strong>Mitigation:</strong> {l.mitigation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* STEP 5: Final Decision Framework */}
        <AccordionItem value="step5" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Step 5: Final Integrated Decision Framework
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            {/* Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Unified Model Application Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="bg-muted/50 border rounded p-3">
                  <p className="font-bold mb-1">Pre-Assessment (30 minutes):</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>☐ Identify therapeutic area (1 of 20 TAs)</li>
                    <li>☐ Check if pediatric population (apply pediatric overlay)</li>
                    <li>☐ Determine if first-in-class or me-better</li>
                    <li>☐ Gather clinical trial topline data (efficacy, safety)</li>
                    <li>☐ Identify 3-5 comparators (if available)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded p-3">
                  <p className="font-bold mb-1">Model 2: Comparative Benchmarking (2-4 hours):</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>☐ Calculate composite comparator score (6 dimensions)</li>
                    <li>☐ Apply to TA base rate by market</li>
                    <li>☐ Add market-specific adjustments</li>
                    <li>☐ Output: Probability by market (8 markets)</li>
                    <li>☐ Flag if probability &lt;50% in 3+ major markets → consider Model 1 deep-dive or strategic pivot</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded p-3">
                  <p className="font-bold mb-1">Model 1: Weighted Scoring (1-2 days):</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>☐ Score Clinical dimension (TA-specific criteria)</li>
                    <li>☐ Score Economic dimension (ICER, budget impact, cost-offsets)</li>
                    <li>☐ Score Access dimension (guidelines, prior auth, infrastructure)</li>
                    <li>☐ Score Political dimension (designations, advocacy, policy)</li>
                    <li>☐ Apply TA-specific & pediatric adjustments</li>
                    <li>☐ Output: Total score 0-100; probability band by market</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 rounded p-3">
                  <p className="font-bold mb-1">Triangulation (~1 hour):</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>☐ Compare Model 1 and Model 2 results</li>
                    <li>☐ Calculate confidence-weighted probability</li>
                    <li>☐ Identify divergences; investigate root causes</li>
                    <li>☐ Scenario analysis (bull case, base case, bear case)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Decision Bands */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Final Decision Bands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-2">
                  {decisionBands.map((b, i) => (
                    <div key={i} className={`border rounded-lg p-3 ${b.color}`}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-bold">{b.range}</Badge>
                        <span className="text-sm font-semibold">{b.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{b.action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Worked Case Study */}
        <AccordionItem value="casestudy" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Worked Example: Novel TYK2 Inhibitor for Plaque Psoriasis
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4 text-xs space-y-2">
                <p className="font-bold text-sm">Molecule Profile</p>
                <ul className="text-muted-foreground space-y-0.5">
                  <li>• <strong>Mechanism:</strong> Oral TYK2 selective inhibitor</li>
                  <li>• <strong>Indication:</strong> Adults with moderate-to-severe plaque psoriasis (BSA ≥10%, PASI ≥12)</li>
                  <li>• <strong>PASI 75 (wk 16):</strong> 62% | PASI 90: 38% | PASI 100: 18% | IGA 0/1: 48%</li>
                  <li>• <strong>Safety:</strong> Acne 12%, URI 8%, no serious infections</li>
                  <li>• <strong>Dosing:</strong> Oral once-daily | <strong>Pricing:</strong> $75,000/year (WAC)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Model 2 Comparators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Step 1: Model 2 (Comparator Benchmarking)
                </CardTitle>
                <CardDescription>Comparators: Sotyktu, Rinvoq, Skyrizi, Tremfya, Taltz</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-semibold">Metric</th>
                        <th className="text-center p-2 font-semibold">Comparator Avg</th>
                        <th className="text-center p-2 font-semibold">Your Molecule</th>
                        <th className="text-center p-2 font-semibold">Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseStudyModel2.comparators.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{r.metric}</td>
                          <td className="p-2 text-center">{r.compAvg}</td>
                          <td className="p-2 text-center">{r.yours}</td>
                          <td className="p-2 text-center"><Badge variant="outline" className="text-xs">{r.ratio}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-muted/50 border rounded p-3 mt-3 text-xs text-center">
                  <p><strong>Composite Score:</strong> (1.07+1.09+1.39+1.05+1.0+0.96+1.07)/7 = <Badge variant="outline" className="text-green-600 border-green-300">1.09</Badge></p>
                  <p className="mt-1">US Commercial Dermatology Base Rate: 55% × 1.09 = 60%</p>
                  <p>Adjustments: +8% (oral TYK2) +6% (AAO guideline) +8% (no black box) -5% (competitive) = <strong className="text-primary">77%</strong></p>
                </div>
              </CardContent>
            </Card>

            {/* Model 1 Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" /> Step 2: Model 1 (Weighted Scoring)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 font-semibold">Dimension</th>
                        <th className="text-center p-2 font-semibold">Score</th>
                        <th className="text-center p-2 font-semibold">Weight</th>
                        <th className="text-center p-2 font-semibold">Weighted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {caseStudyModel2.model1Scores.map((r, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{r.dimension}</td>
                          <td className="p-2 text-center">{r.score}</td>
                          <td className="p-2 text-center">{r.weight}</td>
                          <td className="p-2 text-center font-bold">{r.weighted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-muted/50 border rounded p-3 mt-3 text-xs text-center">
                  <p>Total: 5.75 + 6.9 + 7.2 + 1.35 = 21.2/25 = <strong>84.8/100</strong> (Very High)</p>
                  <p className="mt-1">Adjustments: +8 (oral) +6 (TYK2) +8 (no black box) +6 (once-daily) -8 (biosimilar competition) = 104.8 → cap 95%</p>
                  <p className="font-bold text-primary mt-1">Model 1 Final: 95% (capped)</p>
                </div>
              </CardContent>
            </Card>

            {/* Triangulation */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" /> Step 3: Triangulation & Final Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="border rounded p-3 text-center">
                    <p className="font-semibold">Model 2 (Comparator)</p>
                    <p className="text-2xl font-bold text-blue-600">77%</p>
                    <Badge variant="outline" className="text-blue-600 border-blue-300">High</Badge>
                  </div>
                  <div className="border rounded p-3 text-center">
                    <p className="font-semibold">Model 1 (Weighted Scoring)</p>
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <Badge variant="outline" className="text-green-600 border-green-300">Very High</Badge>
                  </div>
                </div>
                <div className="bg-muted/50 border rounded p-3">
                  <p className="font-semibold">Divergence Analysis:</p>
                  <p className="text-muted-foreground">Model 1 more optimistic — heavily weights oral convenience, no black box, and full TA-specific advantages. Model 2 more conservative — focuses on comparator efficacy (PASI 90 38% competitive but not best-in-class).</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded p-3 text-center">
                  <p className="font-semibold">Me-better with comparators → W₁ = 0.4, W₂ = 0.6</p>
                  <p className="font-mono">(95% × 0.4) + (77% × 0.6) = 38% + 46.2% = <strong className="text-primary text-lg">84.2%</strong></p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">Confidence-Weighted: 84% — Very High</Badge>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Strategy:</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• Price at parity or slight discount to Sotyktu ($72K vs. $75K) to gain formulary access</li>
                    <li>• Negotiate 15-20% rebates for Tier 2 preferred brand positioning</li>
                    <li>• Emphasize oral convenience vs. injectables in marketing</li>
                    <li>• Target dermatologists with "no thrombosis warning" message (vs. JAK inhibitors)</li>
                  </ul>
                  <p className="font-semibold mt-2">Expected Outcomes:</p>
                  <ul className="text-muted-foreground space-y-0.5">
                    <li>• 70-80% formulary coverage within 12 months</li>
                    <li>• Tier 2 (preferred brand) or Tier 3 (specialty) positioning</li>
                    <li>• Prior authorization required (standard for systemic psoriasis)</li>
                    <li>• Market share: 8-12% of moderate-to-severe psoriasis market</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Key Takeaways */}
        <AccordionItem value="takeaways" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-bold text-base flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Key Takeaways & Framework Summary
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-3 md:grid-cols-2">
              {keyTakeaways.map((t, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold">{i + 1}. {t.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
