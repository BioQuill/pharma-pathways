# BioQuill — Lovable Prompt Package
**Date:** 08/03/2026 | Three prompts + one utility script

---

## PROMPT A — TA Canonical Names Global Sweep
*Estimated cost: 3-4 credits*

---

```
TASK: Global audit and fix of all Therapeutic Area (TA) names across the entire platform.

We have exactly 20 canonical TA names. Every single place a TA name appears in the UI — 
filter dropdowns, pie chart labels, molecule card display, PA Index-2 base rates table, 
CAPM TA selector, Investment Score filters, Top 100 filters, Batch Comparison, 
TA Market Overview, and any other location — must use ONLY these exact strings, 
with exact capitalisation and punctuation:

CANONICAL LIST (copy verbatim, do not alter):
1.  Oncology & Hematology
2.  Hematology (non-oncology)
3.  Rare Disease & Orphan
4.  Immunology & Inflammation
5.  Endocrinology & Metabolism
6.  Cardiovascular
7.  Neurology
8.  Respiratory & Pulmonary
9.  Infectious Disease
10. Gastroenterology & Hepatology
11. Nephrology & Renal
12. Psychiatry & Mental Health
13. Dermatology
14. Musculoskeletal & Rheumatology
15. Ophthalmology
16. Women's Health
17. Pain & Anaesthesia
18. Pediatrics
19. Vaccines & Preventive
20. Urology

KNOWN INCORRECT STRINGS TO FIND AND REPLACE (search codebase for all of these):
- "Pain Management/Anesthesia"         → "Pain & Anaesthesia"
- "Pain Management / Anesthesia"       → "Pain & Anaesthesia"
- "Pain & Anesthesia"                  → "Pain & Anaesthesia"
- "Transplant & Cell/Gene Therapy"     → "Hematology (non-oncology)"
- "Transplantation & Cell/Gene Therapy"→ "Hematology (non-oncology)"
- "Transplant/Cell-Gene"               → "Hematology (non-oncology)"
- "Vaccines & Virology"                → "Vaccines & Preventive"
- "Infectious Diseases"                → "Infectious Disease"
- "Womens Health & Reproductive"       → "Women's Health"
- "Womens Health"                      → "Women's Health"
- "Musculoskeletal"                    → "Musculoskeletal & Rheumatology"
- "Rheumatology"                       → "Musculoskeletal & Rheumatology"
- "Neurology/CNS"                      → "Neurology"
- "Urology/Nephrology"                 → split correctly: Urology or Nephrology & Renal
- "Psychiatry/Mental Health"           → "Psychiatry & Mental Health"
- "Gastroenterology"                   → "Gastroenterology & Hepatology"
- "Rare Diseases/Orphan Drugs"         → "Rare Disease & Orphan"
- "Oncology/Hematology"               → "Oncology & Hematology"
- "Oncology & Hematology" (this one is already correct — do not change)

Also fix the PA Index-2 base rates table (TA Benchmarking section) which currently uses 
non-canonical names in its row labels. Apply the same mapping there.

Do NOT change any data in molecules_master.min.json — only fix display/mapping logic 
in the frontend. The mapping should be applied at the point where the JSON 
therapeutic_area field is rendered to the UI.

After making changes, verify the pie chart on the Platform overview tab uses all 
20 canonical names with no duplicates or missing TAs.
```

---

## PROMPT B — CAPM Restructure + Molecule Selector Fix
*Estimated cost: 4-5 credits*

---

```
TASK: Restructure the CAPM Alpha model and fix the molecule selector architecture 
across the entire Strategy Hub.

CURRENT PROBLEM:
The CAPM Alpha tab in Strategy Hub has two sub-tabs: "Simulation" and "Methodology". 
The Simulation sub-tab contains a redundant standalone molecule picker dropdown 
("Choose a molecule...") that shows only a short list. This conflicts with:
(a) the session context bar that already carries the selected molecule across the platform
(b) the top-level "Molecule for Simulation" search bar that works correctly

CHANGES REQUIRED:

1. REMOVE the "Simulation" sub-tab from CAPM Alpha entirely.
   The CAPM content (α₁, α₂, Δα outputs, Estimated β inputs, CAPM Signal Summary table) 
   should display directly when the user lands on CAPM Alpha, auto-populated from 
   the session context molecule.

2. MOVE the "Methodology" sub-tab content to the Models tab.
   In the top navigation, under Models → add a "CAPM Alpha" entry that shows the 
   methodology documentation (the Rf, Rm, β formula explanation, α₁/α₂/Δα definitions).
   This follows the same pattern as other models documented under the Models tab.

3. FIX all standalone molecule picker dropdowns inside model simulation tabs.
   Any dropdown inside a model tab that shows a short/incomplete molecule list 
   must be replaced with the same search-as-you-type component used in the 
   top-level "Molecule for Simulation" bar (which correctly searches all 14,000 NCT rows).
   Affected locations to audit: Investment Score, CAPM Alpha, PTRS, TTM, Peak Sales, 
   Blockbuster Probability, PA Index-1, PA Index-2.
   
   The correct behaviour: typing 3+ characters in any molecule search field 
   triggers a search across primary_drug, nct_id, sponsor, and conditions fields 
   in molecules_master.min.json, returning up to 20 matches.

4. SESSION CONTEXT BAR
   Confirm the persistent session context bar (showing selected molecule name, NCT ID, 
   phase, TA, and "Change molecule →" link) is visible and populated on ALL model tabs 
   when a molecule has been selected via "Use in Simulator →" from the Overview cards.
   If any model tab is missing this bar, add it.

Do not change the Strategy Hub sub-tab order:
Investment Score | Top 100 | Top 100 Small Cap | TA Market Overview | 
Monte Carlo Simulation | CAPM Alpha
```

---

## PROMPT C — Device Flagging + Demo Molecule Set
*Estimated cost: 3-4 credits*

---

```
TASK: Two changes — device record handling and demo mode molecule set.

PART 1 — DEVICE RECORD FLAGGING

In molecules_master.min.json, some records have primary_drug values beginning with 
"DEVICE:" (e.g., "DEVICE: LIPIODOL"). These are medical devices, not drug molecules.

Do NOT delete these records from the data — they may represent device+drug combination 
products. Instead:

a) Add a visual indicator on any card where primary_drug starts with "DEVICE:" — 
   show a small grey "DEVICE" badge next to the drug name (similar in style to the 
   existing approval_status tags but grey/neutral).

b) In the filter sidebar, add a "Record Type" filter with options:
   - All (default)
   - Drugs only (hide DEVICE: records)  
   - Devices only
   
c) Default view should be "Drugs only" so devices are hidden unless the user 
   explicitly selects them.

d) The dashboard count of 14,000 active trials remains unchanged (includes devices).
   The 9,754 molecules count = drug records only (deduplicated, excluding DEVICE: records).


PART 2 — DEMO MOLECULE SET (MVP sharing mode)

Create a curated demo set of 40 molecules (2 per therapeutic area, across all phases) 
for sharing the platform with external users without exposing all 14,000 records.

The 40 demo molecules should be (use these exact primary_drug names as they appear 
in molecules_master.min.json):

Oncology & Hematology:
  - Osimertinib (Phase III, Oncology, AstraZeneca)
  - Trastuzumab deruxtecan (Phase III, Oncology, Daiichi Sankyo)

Hematology (non-oncology):
  - Fitusiran (Phase III, Hematology)
  - Iptacopan (Phase III, Hematology)

Rare Disease & Orphan:
  - Ataluren (Phase III, Rare Disease)
  - Gene therapy - SRP-9001 (Phase II, Rare Disease)

Immunology & Inflammation:
  - Bimekizumab (Phase III, Immunology)
  - Spesolimab (Phase III, Immunology)

Endocrinology & Metabolism:
  - Retatrutide (Phase III, Endocrinology)
  - Eloralintide (Phase III, Endocrinology)

Cardiovascular:
  - Zilebesiran (Phase II, Cardiovascular)
  - Milvexian (Phase III, Cardiovascular)

Neurology:
  - Lecanemab (Phase III, Neurology)
  - Donanemab (Phase III, Neurology)

Respiratory & Pulmonary:
  - Tezepelumab (Phase III, Respiratory)
  - Itepekimab (Phase III, Respiratory)

Infectious Disease:
  - Lenacapavir (Phase III, Infectious Disease)
  - Nirsevimab (Phase III, Infectious Disease)

Gastroenterology & Hepatology:
  - Obeticholic acid (Phase III, GI/Hepatology)
  - Resmetirom (Phase III, GI/Hepatology)

Nephrology & Renal:
  - Sparsentan (Phase III, Nephrology)
  - Avacopan (Phase III, Nephrology)

Psychiatry & Mental Health:
  - Zuranolone (Phase III, Psychiatry)
  - Emraclidine (Phase II, Psychiatry)

Dermatology:
  - Lebrikizumab (Phase III, Dermatology)
  - Povorcitinib (Phase III, Dermatology)

Musculoskeletal & Rheumatology:
  - Upadacitinib (Phase III, Rheumatology)
  - Izokibep (Phase II, Rheumatology)

Ophthalmology:
  - Faricimab (Phase III, Ophthalmology)
  - Ixoberogene soroparvovec (Phase III, Ophthalmology)

Women's Health:
  - Elinzanetant (Phase III, Women's Health)
  - Fezolinetant (Phase III, Women's Health)

Pain & Anaesthesia:
  - Suzetrigine (Phase III, Pain)
  - Zavegepant (Phase III, Pain)

Pediatrics:
  - Maribavir (Phase III, Pediatrics)
  - Nusinersen (Phase II/III, Pediatrics)

Vaccines & Preventive:
  - mResvia (mRNA-1345) (Phase III, Vaccines)
  - V116 (Phase III, Vaccines)

Urology:
  - Vibegron (Phase III, Urology)
  - Cimetapib (Phase II, Urology)

IMPLEMENTATION:
- Add a new sub-tab called "TEST ME" as the FIRST sub-tab under the Platform tab,
  positioned BEFORE the existing PIPELINE sub-tab.
  
  Final Platform sub-tab order:
  TEST ME | PIPELINE | APPROVAL | PRICING & ACCESS | LAUNCH & COMMERCIAL

- The TEST ME tab renders exactly the same Molecules Database card layout as PIPELINE,
  but filtered to show ONLY the 40 demo molecules listed above.
  
- The TEST ME tab should have a subtle explanatory label beneath the sub-tab bar:
  "40 curated molecules across all therapeutic areas — representative pipeline sample"

- All existing Platform sub-tabs (PIPELINE, APPROVAL, PRICING & ACCESS, 
  LAUNCH & COMMERCIAL) remain completely unchanged — do NOT modify them.

- "Use in Simulator →" buttons on TEST ME cards work identically to PIPELINE cards —
  they set session context and carry the molecule across all model tabs.

- The 40 demo molecule records are identified by their NCT IDs. Store them as a 
  constant array in a new file: src/data/demoMolecules.ts
  The filter logic: molecules_master.min.json rows where nct_id is in the 
  DEMO_MOLECULE_IDS array.

- This tab is designed to be removed later with a single deletion — 
  build it with zero coupling to the other Platform tabs so removal 
  has no side effects.
```

---

## UTILITY SCRIPT — LPI Scoring Diagnostic & Fix
*Run this against src/lib/scoring.ts — not a Lovable prompt, apply manually or via Lovable*

---

```
TASK: Fix the LPI (Launch Probability Index) model so it computes per-molecule scores 
from molecules_master.min.json instead of returning a flat value.

BACKGROUND:
The LPI is an XGBoost-inspired classifier with 6 feature categories and these weights:
  Clinical:    30%
  Scientific:  20%  
  Regulatory:  18%
  Sponsor:     15%
  Market:      10%
  Safety:       7%

Output: P(launch) as a percentage with confidence interval, e.g. "67% CI: 57%-75%"

CURRENT BUG: scoring.ts appears to return a hardcoded or default value (~67%) 
for all molecules regardless of input. The per-molecule features are not being 
extracted from the JSON row.

REQUIRED FIX — the scoring function must extract and use these fields from each 
molecule's JSON row:

function computeLPI(molecule: MoleculeRow): LPIResult {

  // --- CLINICAL (30 pts max) ---
  // phase: Phase I=5, Phase I/II=8, Phase II=12, Phase II/III=16, Phase III=22, Phase III/IV=24
  // has_results: true=+4, false=0
  // status: RECRUITING=+2, ACTIVE_NOT_RECRUITING=+1, COMPLETED=+3, other=0
  const clinicalScore = scorePhase(molecule.phase)        // 0-24
                      + scoreHasResults(molecule.has_results)  // 0-4
                      + scoreStatus(molecule.status)      // 0-2
                      // max=30, normalise to 0-1

  // --- SCIENTIFIC (20 pts max) ---  
  // approval_status: APPROVED_YYYY=20, COMPLETED_PH3=14, ACTIVE_PIPELINE=8, ""=5
  // has_results combined with phase III = bonus +3
  const scientificScore = scoreApprovalStatus(molecule.approval_status)
                        + scienceBonus(molecule)
                        // normalise to 0-1

  // --- REGULATORY (18 pts max) ---
  // approval_status: APPROVED=18, COMPLETED_PH3=12, ACTIVE_PIPELINE=6
  // study_title keywords: "breakthrough"=+3, "fast track"=+2, "accelerated"=+2
  // has_results=true AND phase III = +3
  const regulatoryScore = scoreRegulatory(molecule)
                        // normalise to 0-1

  // --- SPONSOR (15 pts max) ---
  // Score sponsor tier from known sponsor list:
  // Big Pharma (Pfizer, Roche, Novartis, AstraZeneca, J&J, Merck, Lilly, BMS, 
  //   AbbVie, Sanofi, GSK, Bayer, Boehringer, Takeda, Novo Nordisk) = 15
  // Large Biotech (Amgen, Biogen, Regeneron, Vertex, Moderna, BioNTech, 
  //   Gilead, Alexion, Alnylam, bluebird, Seagen) = 12
  // Mid Biotech / Academic Sponsor = 8
  // Unknown / empty = 5
  const sponsorScore = scoreSponsor(molecule.sponsor)
                     // normalise to 0-1

  // --- MARKET (10 pts max) ---
  // therapeutic_area maps to market size tier:
  // Tier 1 (Oncology & Hematology, Cardiovascular, Neurology) = 10
  // Tier 2 (Endocrinology & Metabolism, Immunology & Inflammation, 
  //          Infectious Disease, Respiratory & Pulmonary) = 8
  // Tier 3 (all others) = 6
  const marketScore = scoreMarket(molecule.therapeutic_area)
                    // normalise to 0-1

  // --- SAFETY (7 pts max) ---
  // study_title or brief_summary containing "black box" or "REMS" = -7 (score=0)
  // "well-tolerated" or "clean safety" = +7
  // no safety signal keywords = +4 (neutral)
  const safetyScore = scoreSafety(molecule)
                    // normalise to 0-1

  // --- COMPOSITE ---
  const rawScore = (clinicalScore * 0.30)
                 + (scientificScore * 0.20)
                 + (regulatoryScore * 0.18)
                 + (sponsorScore * 0.15)
                 + (marketScore * 0.10)
                 + (safetyScore * 0.07)

  // Scale to 0-100, apply sigmoid squish to keep range realistic (30-92%)
  const pLaunch = Math.min(92, Math.max(30, Math.round(rawScore * 100)))
  
  // Confidence interval: ±8% for Phase III with results, ±15% otherwise
  const ciWidth = (molecule.phase?.includes('III') && molecule.has_results) ? 8 : 15
  const ciLow = Math.max(5, pLaunch - ciWidth)
  const ciHigh = Math.min(97, pLaunch + ciWidth)

  return {
    score: pLaunch,
    ci: `${ciLow}%-${ciHigh}%`,
    label: pLaunch >= 75 ? 'High' : pLaunch >= 55 ? 'Moderate' : 'Low'
  }
}

IMPORTANT: After implementing, verify these expected outputs:
- An APPROVED drug (approval_status contains "APPROVED") → LPI should be 80-92%
- A Phase I molecule from unknown sponsor → LPI should be 30-45%  
- Retatrutide (Phase III, Eli Lilly, ACTIVE_PIPELINE) → LPI should be 68-78%
- A COMPLETED Phase III with results (COMPLETED_PH3) → LPI should be 72-85%

The LPI badge on Overview cards should show the computed percentage.
The CI should appear in the Full Analysis expanded view, not on the card badge.
```

---

## NOTES FOR SESSION HANDOFF

After sending these prompts to Lovable, update the known bugs list:
- Bug 2 (flat LPI) → FIXED after LPI script applied
- Bug 3 (Venglustat duplicate) → still open — deduplication prompt still needed
- Bug 4 ("0 Passes") → still open — Investment Score signal tier rename still needed  
- Bug 6 (PA Index TBC) → CLOSED — models fully documented

New items added this session:
- CAPM confirmed live in Strategy Hub ✓
- PA Index-1 (MWPSPI) and PA Index-2 (Comparative Payer Likelihood Matrix) fully documented ✓
- Demo mode (40 molecules) → added as Prompt C Part 2
- Device flagging → added as Prompt C Part 1
- TA label mismatches in PA Index-2 base rates table → added to Prompt A

Model inventory is now 12 models (added CAPM Alpha Signals).

---

## PROMPT D — Methodology Tab: Add Missing 5 Models
*Estimated cost: 3-4 credits*

---

```
TASK: Two things — (1) strip links from all existing cards, (2) add 5 new model cards.

CRITICAL RULE FOR ALL CARDS — existing and new:
- Remove ALL "See full model details →" links from every card on this tab.
- Replace with a single static line of grey italic text: "Full details available by request."
- This line is NOT a link. It is NOT clickable. It goes nowhere.
- No card on the Methodology tab should link to or expose any model internals, 
  formulas, weights, or the Models tab content.
- Apply this to ALL 12 cards (the existing 7 AND the 5 new ones).

Update section header: "7 Proprietary Models" → "12 Proprietary Models"

ADD THESE 5 CARDS after the existing TTM card:

--- CARD 1 ---
Icon: ⚠️ risk/balance icon matching platform style
Name: TA Risk Index
Subtitle: APPROVAL
Description: TA-specific composite risk score combining regulatory precedent, 
competitive density, and clinical complexity. Feeds directly into LPI as the 
Regulatory weight component.
Footer text (not a link): Full details available by request.

--- CARD 2 ---
Icon: ⚖️ scales icon
Name: PA Index-1 — MWPSPI
Subtitle: PRICING & ACCESS · Model 1
Description: Market-Weighted Payer Support Probability Index. Scores 0-100 by 
weighting Clinical, Economic, Access and Political factors according to each 
payer system's documented decision-making priorities across 8 global markets.
Footer text (not a link): Full details available by request.

--- CARD 3 ---
Icon: 📊 bar chart icon
Name: PA Index-2 — Comparative Payer Likelihood Matrix
Subtitle: PRICING & ACCESS · Model 2
Description: Uses historical approval/coverage base rates combined with 
molecule-specific comparator benchmarking across 20 therapeutic areas and 
8 global markets.
Footer text (not a link): Full details available by request.

--- CARD 4 ---
Icon: 📈 trending up icon
Name: Peak Sales Index
Subtitle: LAUNCH & COMMERCIAL
Description: Composite peak sales potential model combining market size, clinical 
differentiation, commercial execution, strategic positioning, competitive dynamics, 
market access, and pricing power.
Footer text (not a link): Full details available by request.

--- CARD 5 ---
Icon: 💎 diamond icon
Name: $1B Blockbuster Probability
Subtitle: LAUNCH & COMMERCIAL
Description: Probability of achieving $1B+ peak annual sales via logistic 
regression on composite Peak Sales Score. Validated r=0.78, 82% accuracy 
on 100 drug launches 2014-2024.
Footer text (not a link): Full details available by request.

NOTE: If Investment Score card is missing from the existing 7, add it in the 
same style — name: Investment Score, subtitle: STRATEGY HUB, description: 
5-factor VC and licensing assessment model scoring molecules on market potential, 
clinical success, commercial advantage, strategic positioning, and competitive dynamics.
Footer text (not a link): Full details available by request.

Final grid order (12 cards):
PTRS | Monte Carlo | TI | LPI | Composite Score | CAPM Alpha Signals | TTM |
TA Risk Index | PA Index-1 | PA Index-2 | Peak Sales Index | $1B Blockbuster | Investment Score
```

---

## PROMPT E — ALPHA Rename + Stripe Integration
*Estimated cost: 4-6 credits — connect Stripe in Lovable project settings before sending*

---

```
TASK: Two changes — rename in Strategy Hub nav, and connect Stripe to Pricing tab.

PART 1 — RENAME CAPM Alpha → ALPHA (nav label only)

In the Strategy Hub sub-tab navigation bar only, rename:
"CAPM Alpha" → "ALPHA"

Do NOT rename anywhere else. Keep full name "CAPM Alpha Signals" in:
- The model tab heading
- Methodology tab card
- Models tab entry
- All formula and description text

Final Strategy Hub sub-tab bar:
Investment Score | Top 100 | Top 100 Small Cap | TA Market Overview | 
Monte Carlo Simulation | ALPHA

PART 2 — STRIPE INTEGRATION

Connect the Pricing tab to Stripe for live subscription checkout.

1. Import Stripe.js: import { loadStripe } from '@stripe/stripe-js'
   Use publishable key from env: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

2. For each paid plan button on the Pricing tab, replace with a Stripe Checkout 
   redirect button. On click: create a Stripe Checkout session and redirect.

3. Price IDs from env variables — one per plan, mapped to each card button:
   VITE_STRIPE_PRICE_1MOLECULE      → "1 Molecule" plan button
   VITE_STRIPE_PRICE_5MOLECULES     → "5 Molecules" plan button
   VITE_STRIPE_PRICE_1TA            → "1 TA" plan button
   VITE_STRIPE_PRICE_2TAS           → "2 TAs" plan button
   VITE_STRIPE_PRICE_3TAS           → "3 TAs" plan button
   VITE_STRIPE_PRICE_FULL           → "Full" plan button

4. Success redirect URL: /platform?subscribed=true
   Show success banner: "Subscription activated — welcome to BioQuill"

5. Add subtle "Powered by Stripe" badge beneath pricing cards.

6. No authentication/login wall at this stage — Stripe checkout only.

Environment variables to add in Lovable project settings before running this prompt:
VITE_STRIPE_PUBLISHABLE_KEY      = pk_live_[your publishable key]
VITE_STRIPE_PRICE_1MOLECULE      = price_[your price ID]
VITE_STRIPE_PRICE_5MOLECULES     = price_[your price ID]
VITE_STRIPE_PRICE_1TA            = price_[your price ID]
VITE_STRIPE_PRICE_2TAS           = price_[your price ID]
VITE_STRIPE_PRICE_3TAS           = price_[your price ID]
VITE_STRIPE_PRICE_FULL           = price_[your price ID]
```

---

## UPDATED NOTES FOR SESSION HANDOFF

Prompt order to send to Lovable:
1. Prompt A — TA canonical names (3-4 credits)
2. LPI Script — paste targeting src/lib/scoring.ts
3. Prompt B — CAPM restructure + molecule selector fix (4-5 credits)
4. Prompt C — Device flagging only, TEST ME tab dropped (2-3 credits)
5. Prompt D — Methodology tab 5 missing models (3-4 credits)
6. Prompt E — ALPHA rename + Stripe (4-6 credits, needs Stripe keys first)

Updated model count: 12 models confirmed.
CAPM Alpha → displayed as "ALPHA" in Strategy Hub nav only.
TEST ME tab: removed from scope entirely.

---

## PROMPT F — Pricing Tab: Remove Fixed Highlight + Add Hover Effect
*Estimated cost: 1-2 credits*

---

```
TASK: Fix the Pricing tab card styling — two specific changes only.

CURRENT PROBLEM:
The "5 Molecules" card (2nd card) is permanently highlighted in blue/dark colour 
with a "Most Popular" forced active state. This makes it look like a pre-selection 
and should be removed.

CHANGE 1 — Remove all permanent card highlighting:
- Remove the blue/dark background from the 5 Molecules card
- Remove any "Most Popular", "Best Value", or similar badge that forces visual 
  prominence on any single card
- All 6 pricing cards must start in an identical neutral white/light grey state
- No card should appear pre-selected, active, or recommended by default
- Remove any border, shadow, or background colour difference between cards at rest

CHANGE 2 — Add hover effect:
- On mouse hover over any pricing card, apply a pale yellow background wash:
  background-color: #FFFBEB (or equivalent — warm, very light yellow, subtle)
  Add a very slight border colour shift: border-color: #F59E0B (amber, subtle)
  Transition: smooth, 150ms ease
- When mouse leaves the card, it returns immediately to neutral state
- Only ONE card can show the hover state at a time (standard CSS hover behaviour)
- The hover effect applies to all 6 cards equally

Do not change any pricing amounts, plan names, feature lists, or button text.
Do not add Stripe integration in this prompt (handled separately).
```

---

## PROMPT B1 — Molecule Selector Fix + NCT ID Display + TEST ME Removal
*Estimated cost: 3-4 credits — send BEFORE B2*

---

```
TASK: Three UI fixes. No model logic changes. No calibration file changes.

=== FIX 1: REMOVE TEST ME SUB-TAB ===
Remove the "TEST ME" sub-tab from the Platform tab navigation entirely.
It should not appear anywhere in the UI.

=== FIX 2: DISPLAY NCT ID IN ALL SIMULATOR TABS ===
Every simulator tab (LPI, TTM, PTRS, TI, Peak Sales, Investment Score,
CAPM Alpha, PA Index-1, PA Index-2, Monte Carlo) must display the
selected molecule's NCT ID prominently alongside the molecule name.

Current: shows "Pembrolizumab • Merck Sharp & Dohme LLC • Phase III"
Required: shows "Pembrolizumab • NCT07216703 • Phase III • Merck Sharp & Dohme LLC"

The NCT ID must be read from the molecule's nct_id field in
molecules_master.min.json — not hardcoded or derived.

=== FIX 3: REMOVE HARDCODED MOLECULE LISTS FROM ALL SIMULATOR TABS ===

CURRENT PROBLEM (confirmed by audit):
- LPI simulator tab shows a hardcoded left-panel list:
  (AZD5335, Pembrolizumab, Calderasib, rilzabrutinib, Volrustomig etc.)
  all showing identical 65-67% scores
- This list is NOT connected to molecules_master.min.json
- Clicking "Use in Simulator →" on a Pipeline card does NOT populate
  this list — the simulator ignores the selected molecule entirely
- The same hardcoded list problem exists in other simulator tabs

REQUIRED FIX:
1. Remove ALL hardcoded molecule selector lists from every simulator tab
2. Simulator tabs must NOT have their own molecule picker
3. The ONLY way to load a molecule into any simulator is via
   "Use in Simulator →" button on a Pipeline/Overview card
4. When a molecule is loaded via "Use in Simulator →", it must:
   a. Set the session context bar (molecule name, NCT ID, phase, TA)
   b. Auto-populate ALL simulator tabs with that molecule's data
   c. Show the molecule's real computed scores — not hardcoded values
5. If no molecule has been selected via "Use in Simulator →", simulator
   tabs should show an empty state:
   "Select a molecule from the Pipeline tab to begin simulation"
   with a link: "→ Go to Pipeline"
6. The session context bar must be visible on ALL simulator tabs
   showing: [molecule name] | [NCT ID] | [Phase] | [TA] | [Change →]

AFFECTED FILES to audit and fix:
- src/components/LPI3Dashboard.tsx — remove hardcoded molecule list
- src/components/LPI2Dashboard.tsx — remove hardcoded molecule list
- src/components/TTMBreakdownChart.tsx — remove hardcoded molecule list
- src/components/PeakSalesIndexDashboard.tsx — check and fix
- src/components/CAPMAlphaSignals.tsx — check and fix
- src/components/PAModel1Dashboard.tsx — check and fix
- src/components/PAModel2Dashboard.tsx — check and fix
- src/components/PTRSMonteCarloIntegration.tsx — check and fix
- src/components/MonteCarloSimulation.tsx — check and fix

Do NOT modify any model calculation logic.
Do NOT modify any calibration files.
Do NOT change scoring.ts, lpi3Model.ts, lpi2Model.ts, or ttmData.ts.
```

---

## PROMPT H1 — Single Source of Truth Architecture Refactor
*Estimated cost: 5-7 credits — send AFTER B1 and B2 are verified*

---

```
TASK: Architecture refactor only. No UI changes. No model logic changes.
No calibration file changes. Wiring only.

CONFIRMED PROBLEMS (from audit):

PROBLEM 1 — Three LPI models producing different numbers:
- computeLPI() in scoring.ts → produces card badge LPI%
  Called by: useMolecules.ts for every molecule in the 14K dataset
  Input: raw JSON fields directly from molecules_master.min.json ✅
- calculateLPI3ForMolecule() in lpi3Model.ts → produces simulator LPI%
  Called by: LPI3Dashboard, LPI3ReportCard, LPIExtendedReportCard,
  MoleculeScoreCard, PortfolioDashboard
  Input: structured profile with fabricated fields (being fixed in B2)
- calculateLPI2ForMolecule() in lpi2Model.ts → produces Investment Score
  Called by: InvestmentScoreReportCard, LPI2Dashboard
  Input: structured profile with Math.random() (being fixed in B2)
Result: same molecule shows different LPI% on card vs simulator vs report

PROBLEM 2 — DD Report and simulators use different molecule objects:
- Simulators: SimulatorMoleculeContext (session state)
- DD Report: activeMolecule from Overview cards
- Different transformation paths → potential field mapping differences

PROBLEM 3 — DD Report shows both LPICalibrationCard (computeLPI) AND
LPI3ReportCard (calculateLPI3ForMolecule) side by side — two different
LPI numbers for the same molecule in the same report

REQUIRED CHANGES — wiring only, no model logic:

1. ESTABLISH computeLPI() in scoring.ts as THE single LPI source
   - computeLPI() already correctly reads all raw fields from
     molecules_master.min.json via useMolecules.ts
   - Its output (lpi_score, lpi_breakdown, lpi_ci) is already stored
     on each molecule's _raw object by useMolecules.ts
   - This pre-computed value must be used everywhere

2. REMOVE LPICalibrationCard OR LPI3ReportCard from the DD Report
   — keep only ONE LPI section. Use the computeLPI() output
   (molecule._raw.lpi_score) as the displayed value.
   The DD Report must never show two different LPI numbers.

3. CREATE unified session context: src/context/SessionMoleculeContext.tsx
   Interface:
   {
     rawRow: MoleculeRow | null,       // original row from molecules_master.min.json
     nctId: string | null,
     setMolecule: (rawRow: MoleculeRow) => void,
     clearMolecule: () => void
   }
   The rawRow contains ALL pre-computed scores already attached by
   useMolecules.ts (lpi_score, ttm_months, composite_score, etc.)

4. TRIGGER: "Use in Simulator →" button calls
   SessionMoleculeContext.setMolecule(rawRow) — passing the complete
   raw molecule object with all pre-computed scores attached.
   This is the ONLY place session molecule is set.

5. WIRE all simulator dashboards to read from SessionMoleculeContext:
   - src/components/LPI3Dashboard.tsx
   - src/components/LPI2Dashboard.tsx
   - src/components/TTMBreakdownChart.tsx
   - src/components/PeakSalesIndexDashboard.tsx
   - src/components/MonteCarloSimulation.tsx
   - src/components/CAPMAlphaSignals.tsx
   - src/components/PAModel1Dashboard.tsx
   - src/components/PAModel2Dashboard.tsx
   - src/components/PTRSMonteCarloIntegration.tsx
   Each component reads molecule._raw fields and pre-computed scores
   from SessionMoleculeContext. No local molecule state.

6. WIRE all DD Report card components to read from SessionMoleculeContext:
   - src/components/LPI3ReportCard.tsx (or LPICalibrationCard — keep one)
   - src/components/InvestmentScoreReportCard.tsx
   - src/components/MoleculeScoreCard.tsx
   - src/components/LPIExtendedReportCard.tsx

7. DEPRECATE SimulatorMoleculeContext — migrate all consumers to
   SessionMoleculeContext, then remove SimulatorMoleculeContext entirely.

8. DEPRECATE activeMolecule pattern in Overview cards for report
   generation — report renders only when SessionMoleculeContext has
   a molecule set.

CRITICAL RULES:
- Do NOT modify scoring.ts model logic
- Do NOT modify lpi3Model.ts
- Do NOT modify lpi2Model.ts
- Do NOT modify ttmData.ts
- Do NOT modify any JSON calibration files
- Do NOT change any calculation weights or formulas
- Wiring and context only

VERIFICATION:
- Click "Use in Simulator →" on any Pipeline card (e.g. Pembrolizumab
  NCT07216703)
- LPI% on card badge = LPI% in simulator tab = LPI% in DD Report
- NCT ID shown in simulator session bar matches the card clicked
- TTM in simulator matches TTM badge on card
- No molecule from the hardcoded demo list appears in simulator
```

---

## PROMPT H1.5 — Calculation Divergence Fixes
*Estimated cost: 4-5 credits — send AFTER H1 verified, BEFORE H2*

---

```
TASK: Fix four confirmed calculation divergences found in the H3 platform
audit. No new features. No UI changes. No model logic changes.
Consistency fixes only.

CONFIRMED ISSUES (from H3 audit — fix all four):

=== FIX 1: COMPOSITE SCORE — WRONG WEIGHTS IN MOLECULESCORECARD ===

CONFIRMED PROBLEM:
MoleculeScoreCard.tsx uses its own inline formula:
  overallScore * 0.6 + ttmEff * 0.4
This is WRONG. The agreed formula in calculateCompositeScore() is:
  Score = 100 × (0.7 × A_norm + 0.3 × (1 − B_norm))
Every molecule card currently displays a Score computed with
wrong weights (0.6/0.4 instead of 0.7/0.3) and without
proper A_norm/B_norm normalisation.

REQUIRED FIX:
In MoleculeScoreCard.tsx, replace the inline composite calculation
entirely with a call to calculateCompositeScore() from scoring.ts:
  import { calculateCompositeScore } from '../lib/scoring'
  const score = calculateCompositeScore(lpiScore, ttmMonths, therapeuticArea)
Do NOT modify calculateCompositeScore() itself — it is correct.
Remove the inline 0.6/0.4 formula entirely.

Also check Index.tsx — if it has its own inline composite calculation,
apply the same fix.

=== FIX 2: MONTE CARLO — REPORT CARD USES DIFFERENT ENGINE ===

CONFIRMED PROBLEM:
MonteCarloReportCard.tsx contains its own simplified seeded Monte Carlo
with different base calculations — completely independent from the real
runPTRSMonteCarlo() engine in ptrsEngine.ts.
The DD Report therefore shows different P5/P50/P95 values than the
Monte Carlo simulator tab for the same molecule.

REQUIRED FIX:
Replace MonteCarloReportCard.tsx's inline MC logic entirely.
Wire it to call runPTRSMonteCarlo() from ptrsEngine.ts with:
  - molecule's TA and phase from SessionMoleculeContext
  - default slider values (all at 50) for report context
  - iterations: 1000 (reduced from simulator's 10,000 for performance)
Output: same P5/P50/P95 structure as simulator, just with default
slider inputs and fewer iterations.
Do NOT modify runPTRSMonteCarlo() or ptrsEngine.ts.

=== FIX 3: PA INDEX — REPORT CARD USES DIFFERENT SCORING ===

CONFIRMED PROBLEM:
PAIndexReportCard.tsx has its own simplified inline scoring logic
with different factor weights and calculation path than
PAModel1Dashboard.tsx and PAModel2Dashboard.tsx.
The DD Report therefore shows different PA scores than the
PA Index simulator tabs for the same molecule.

REQUIRED FIX:
Identify the core scoring functions in PAModel1Dashboard.tsx and
PAModel2Dashboard.tsx. Extract them into:
  src/lib/paModel1Engine.ts — PA Index-1 pure calculation function
  src/lib/paModel2Engine.ts — PA Index-2 pure calculation function
Wire both PAModel1Dashboard.tsx AND PAIndexReportCard.tsx to call
the same engine functions with the same inputs.
Do NOT change any weights, factor definitions, or scoring logic.
Extract only — do not modify.

=== FIX 4: TTM LEGACY CALLERS — MODIFIERS NOT APPLIED ===

CONFIRMED PROBLEM:
MoleculeScoreCard.tsx and Index.tsx call calculateTTMMonths() passing
marketData[] as the 4th argument. The current function signature treats
array as legacy and ignores it, meaning approval_status and status
modifiers (implemented in B2) are never applied on molecule cards.

REQUIRED FIX:
Update all callers of calculateTTMMonths() to pass the correct
new parameters introduced in B2:
  calculateTTMMonths(
    molecule.phase,
    molecule.therapeuticArea,
    molecule.companyTrackRecord,   // sponsorType
    molecule._raw.approval_status, // was: marketData[]
    molecule._raw.status,          // new
    molecule._raw.study_title      // new
  )
Affected files:
  src/components/MoleculeScoreCard.tsx
  src/pages/Index.tsx
  src/lib/excelExport.ts
  Any other file still passing marketData[] as 4th arg

Also remove the marketData[] legacy parameter path from
calculateTTMMonths() entirely — it is no longer needed.

=== BONUS: FIX Peak Sales Math.random() ===

CONFIRMED PROBLEM (from audit):
generateMarketProjections() in scoring.ts lines 583-584 still uses
Math.random() making revenue projections non-deterministic.

REQUIRED FIX:
Replace Math.random() calls in generateMarketProjections() with
seededRandom(hashCode(molecule.id)) — same pattern used in lpi3Model.ts.
Use offset seeds for different projection variables.
Do NOT change any projection formulas or weights.

GOLDEN RULE: Do NOT modify any model logic, weights, calibration
constants, or formulas in any of the above fixes.
Extract, wire, and align only.

VERIFY after all fixes:
1. Pick any molecule — Score badge on card matches Score in simulator
2. Pick any molecule — Monte Carlo P50 in DD Report ≈ P50 in simulator
   (small variance acceptable due to reduced iterations in report)
3. Pick any molecule — PA Index score in DD Report matches PA dashboard
4. TTM badge on cards changes meaningfully by phase and TA
5. Peak Sales projection is identical on two consecutive renders
   of the same molecule
```

---

## PROMPT PDF1 — Full DD Report PDF: Layout, Design & Model Order
*Estimated cost: 5-6 credits — send AFTER H1.5, BEFORE H2*

---

```
TASK: Comprehensive PDF export redesign for the Full DD Report.
No model logic changes. No calculation changes.
Layout, typography, design, and section order only.

=== FIX 1: TYPOGRAPHY — FONT SYSTEM ===

Import from Google Fonts:
  Manrope (weights: 400, 500, 600, 700)
  DM Mono (weights: 400, 500)

Apply ONLY within the PDF export stylesheet (not the live platform UI):

All text elements → Manrope
All numerical data values → DM Mono
  (LPI%, TTM months, scores, revenue figures, probability values,
   any standalone number that is a model output)

Typography scale for PDF:
  Model section header (ALL CAPS): Manrope 700, 15px, #1e3a5f
  Sub-section header (Title Case): Manrope 600, 13px, #1e3a5f
  Body text: Manrope 400, 13px, #1a1a1a
  Data numbers (model outputs): DM Mono 500, 24-28px, contextual colour
  Small data labels: Manrope 400, 11px, #1a1a1a
  Captions / source lines: Manrope 400, 10px, #6b7280
  "What this means" heading: Manrope 700, 13px, #b45309
  "What this means" body: Manrope 400, 13px, italic, #1a1a1a

=== FIX 2: MODEL SECTION HEADERS — ALL CAPS ===

Every model section header must be ALL CAPS in the PDF:
  "LPI (LAUNCH PROBABILITY INDEX) ANALYSIS"
  "THERAPEUTIC INDEX (TI) ANALYSIS"
  "PTRS ANALYSIS"
  "CAPM ALPHA SIGNALS"
  "INVESTMENT SCORE ANALYSIS"
  "PA INDEX SUMMARY"
  "MONTE CARLO STRESS TEST"
  "PEAK SALES COMPOSITE INDEX"
  "GLOBAL REVENUE HEAT MAP"
  "GLOBAL MARKET ANALYSIS"
  "REGULATORY APPROVAL TIMELINE"
  "CLINICAL STUDIES SUMMARY"
  "METRIC DEFINITIONS"

Apply text-transform: uppercase to all model section headers
in the PDF export stylesheet only.

=== FIX 3: CARD DESIGN — UNIVERSAL TEMPLATE ===

Every model section must be wrapped in a card with:
  border: 2.5px solid #1e3a5f (dark navy)
  border-radius: 12px
  padding: 24px
  background: #ffffff
  margin-bottom: 24px
  page-break-inside: avoid
  break-inside: avoid

This is the Monte Carlo card style — apply it universally
to ALL model sections in the PDF.

Sub-sections within a card (e.g. Feature Category Breakdown
inside LPI card):
  border: 1px solid #cbd5e1
  border-radius: 8px
  padding: 16px
  background: #f8fafc

=== FIX 4: "WHAT THIS MEANS" BOX REDESIGN ===

Every "What this means" narrative box must use this style:
  background: #fffbeb (pale yellow)
  border-left: 4px solid #d97706 (amber)
  border-radius: 0 8px 8px 0
  padding: 16px 20px
  margin-top: 16px
  page-break-inside: avoid
  break-inside: avoid

Heading "What this means":
  Manrope 700, 13px, #b45309, display as bold
  NOT greyed out — must be clearly visible

Body text:
  Manrope 400, 13px, italic, #1a1a1a
  NOT light grey — must be clearly readable in print

=== FIX 5: BODY TEXT — NEAR BLACK ===

All body text in PDF export must use #1a1a1a (near black).
Remove all instances of grey body text (#6b7280, #9ca3af,
or any grey variant) from non-caption text in the PDF.
Grey is permitted ONLY for:
  - Source/caption lines (10px, #6b7280)
  - Secondary data labels

=== FIX 6: MODEL SECTION ORDER — JOURNEY TO MARKET ===

Reorder the Full DD Report sections to follow the logical
journey of a molecule to market. This is the correct order:

STAGE 1 — CAN IT SUCCEED?
  1. PTRS Analysis
  2. LPI (Launch Probability Index) Analysis
  3. Therapeutic Index (TI) Analysis

STAGE 2 — HOW LONG WILL IT TAKE?
  4. TTM (Time to Market) — if shown as standalone section
  5. Regulatory Approval Timeline Comparison
  6. Clinical Studies Summary

STAGE 3 — IS IT WORTH THE RACE?
  7. Peak Sales Composite Index
  8. Global Revenue Heat Map (reduced to 80% of current size)
  9. Global Market Analysis

STAGE 4 — HOW TO WIN IT?
  10. CAPM Alpha Signals
  11. Investment Score Analysis
  12. PA Index Summary
  13. Monte Carlo Stress Test

REFERENCE:
  14. Metric Definitions (always last)

The stage labels themselves (STAGE 1 — CAN IT SUCCEED? etc.)
should appear as section dividers in the PDF:
  Full-width band, background #1e3a5f, text white
  Manrope 700, 12px, letter-spacing: 0.1em
  page-break-before: always for each stage divider

=== FIX 7: GLOBAL REVENUE HEAT MAP — REDUCE SIZE ===

The heat map visualisation is currently too large and
dominates an entire page. Reduce to 80% of current size:
  transform: scale(0.8) or width: 80% with proportional height
  Center the scaled map within its card container
  This should bring the heat map onto approximately
  half a page, with the market legend below it

=== FIX 8: PAGE BREAK CONTROL ===

Add to PDF export stylesheet:

Every model section card:
  page-break-inside: avoid
  break-inside: avoid

Every stage divider band:
  page-break-before: always
  break-before: always

Every chart/visualisation:
  page-break-inside: avoid
  break-inside: avoid

Every "What this means" box:
  page-break-inside: avoid
  break-inside: avoid

=== FIX 9: REMOVE INTERACTIVE ELEMENTS FROM PDF ===

The following must NOT render in PDF export:

1. Regulatory Pathway Calculator
   (Filing Strategy toggle, country checkboxes, market grid)
   → Replace with static one-line text:
   "Interactive regulatory pathway modelling available
   at bioquill.com"

2. "View All Trials Table" button
3. "View Trials Map" button
   → Replace with:
   "Full trial data: ClinicalTrials.gov — NCT[ID]"

4. Any toggle, checkbox, dropdown, or button element

=== FIX 10: HEADER ===

Every page header:
  Remove: "Precision intelligence. From pipeline to patients."
  Replace with: "Know the odds. Understand the pipeline.
  Win the race."

Fix the double yellow bar on page 1:
  Ensure header bar renders exactly once per page
  The green APPROVED MOLECULE disclaimer must be
  fully visible and not obscured by the header

=== FIX 11: FOOTER ===

Replace placeholder footer:
  CURRENT: "BioQuill | Client Company | user@company.com |
  Downloaded: [date] | Licensed for internal use only"
  NEW: "BioQuill | bioquill.com | Downloaded: [date] |
  Licensed for internal use only —
  redistribution prohibited"

=== FIX 12: APPROVED MOLECULE LAUNCH DATES ===

For molecules where approval_status contains 'APPROVED':
In the Global Market Analysis table, replace future
calculated Launch Date values with "Launched"
Add footnote: "* Projections shown as post-launch
revenue benchmarks for comparator reference"

=== FIX 13: REMOVE TRAILING BLANK SPACE ===

Remove all blank space after the Metric Definitions section.
Last page must end cleanly after the last content block.

VERIFY after all fixes:
1. Generate PDF for Tirzepatide NCT06962280
2. Fonts are Manrope (text) + DM Mono (numbers) throughout
3. All model section headers are ALL CAPS in dark navy
4. Every model section is in a dark navy 2.5px bordered card
5. "What this means" boxes are pale yellow, bold heading,
   amber left border, black text — clearly readable
6. All body text is near-black #1a1a1a
7. Sections appear in Journey to Market order with
   stage divider bands
8. Heat map is 80% of previous size
9. No interactive elements appear
10. Header shows new tagline, no double yellow bar
11. Footer shows bioquill.com
12. No sections split across pages
13. No blank space at document end
```

---

## PROMPT H2 — Full DD Report: Add Missing Models + Interpretive Narrative
*Estimated cost: 8-10 credits — send ONLY after PDF1 is verified complete*

---

```
TASK: Two additions to the Full DD Report:
(1) Add 4 missing model sections
(2) Add interpretive narrative to every model output

PREREQUISITE: Prompts H1 AND H1.5 must both be complete and verified.
All report sections must be reading from SessionMoleculeContext,
and all four calculation divergences must be resolved before this
prompt is sent.

--- PART 1: ADD MISSING MODEL SECTIONS TO FULL DD REPORT ---

Add these 4 sections to the Full DD Report, in this order after 
the existing Investment Score section:

SECTION 1 — PTRS Analysis
Component: embed PTRSReportCard reading from ReportMoleculeContext
Display:
- PTS (Technical Success) % with progress bar
- PRS (Regulatory Success) % with progress bar  
- PTRS Combined % — large prominent number
- Formula shown: PTRS = PTS × PRS
- Input Parameters Summary table:
  Therapeutic Area | Current Phase | Mechanism Novelty % | 
  Endpoint Clarity % | Prior Trial Data % | 
  Sponsor Experience % | Regulatory Precedent % | Safety Profile %
- TA baseline comparison: this molecule's PTRS vs TA historical average

SECTION 2 — CAPM Alpha Signals
Component: embed CAPMReportCard reading from ReportMoleculeContext
Display:
- Estimated β with risk classification (Low/Medium/High)
- α₁ Historical Alpha % with label (Strongly Positive/Positive/Negative)
- α₂ Pipeline Alpha % with label
- Δα Divergence % with label
- CAPM Signal Summary table:
  Rf | Rm | TA Premium | Estimated β | E(R) | Actual PTRS | 
  α₁ | α₂ | Δα

SECTION 3 — PA Index Summary
Component: embed PAIndexReportCard reading from ReportMoleculeContext
Display:
- PA Model recommendation: Model 1 or Model 2 (with brief reason why)
- PA Index-1 MWPSPI scores for all 8 markets in a compact table:
  Market | Score | Band | Key implication (one line)
- PA Index-2 Final Probability per market where comparators exist
- Overall market access signal: Strong/Moderate/Weak

SECTION 4 — Monte Carlo Stress Test
Component: embed MonteCarloReportCard reading from ReportMoleculeContext
Display:
- P5/P50/P95 outputs for each model in the chain:
  PTRS | LPI | Peak Sales ($M) | Blockbuster Probability
- Presented as a clean table with three columns: Bear / Base / Bull
- Composite uncertainty band: "Under stress conditions, 
  peak sales range from $Xm (P5) to $Xb (P95)"

--- PART 2: ADD INTERPRETIVE NARRATIVE TO ALL MODEL OUTPUTS ---

For every model section in the Full DD Report AND in each standalone 
simulator tab, add an interpretive narrative block immediately below 
the model output numbers.

The narrative block:
- Grey bordered box, light background
- Heading: "What this means"
- 2-4 sentences generated dynamically based on the molecule's scores
- Uses conditional logic to generate molecule-specific text

Narrative logic per model (implement as template strings with 
conditional branches):

LPI Narrative:
- If score ≥75: "This molecule shows high launch probability, 
  placing it in the top [X]% of [TA] pipeline assets. 
  The score is driven primarily by [highest scoring feature category]. 
  [If Phase III]: Phase III status is the strongest positive signal. 
  Primary risk: [lowest scoring feature category]."
- If score 50-74: "This molecule shows moderate launch probability 
  for a [Phase] asset in [TA]. 
  Strengths: [top 2 feature categories]. 
  Key uncertainty: [bottom feature category]."
- If score <50: "This molecule faces significant launch headwinds. 
  [Phase] assets in [TA] historically achieve [TA baseline LPI]% 
  on average. Improvement drivers: [bottom 2 feature categories]."

PTRS Narrative:
- If PTRS ≥50: "Technical and regulatory success probability is 
  above the [TA] Phase [X] historical average of [baseline]%. 
  Regulatory confidence (PRS [X]%) is [stronger/weaker] than 
  technical confidence (PTS [X]%), suggesting [regulatory pathway 
  is well-established / clinical endpoints carry more risk]."
- If PTRS <50: "At [X]%, combined success probability reflects 
  [high technical uncertainty / regulatory complexity] for this 
  indication. The [PTS/PRS] component at [X]% is the primary 
  risk driver."

TI Narrative:
- If Wide (>10): "A wide therapeutic index indicates a substantial 
  safety margin between effective and toxic doses. 
  This profile supports flexible dosing and reduces 
  discontinuation risk in trials."
- If Moderate (2-10): "A moderate therapeutic index is typical 
  for this drug class. Standard monitoring protocols apply. 
  Dose titration will be important in Phase [X] design."
- If Narrow (<2): "A narrow therapeutic index requires careful 
  dose management and close patient monitoring. 
  This increases trial complexity and may require REMS 
  post-approval."

Peak Sales Narrative:
- If >$5B: "Blockbuster-scale peak sales potential. 
  The [Base Market] and [Clinical] factors are the primary 
  value drivers. Competitive factor of [X] reflects 
  [crowded/moderate/clear] market dynamics."
- If $1B-5B: "Significant commercial opportunity with 
  peak sales in the $[X]B range. 
  [Strongest factor] is the key value driver. 
  [Weakest factor] represents the main commercial risk."
- If <$1B: "Moderate commercial scale, potentially appropriate 
  for [rare disease/niche indication/specific population]. 
  Market access and pricing strategy will be critical 
  to maximising revenue in this segment."

Investment Score Narrative:
- If ≥75: "Strong investment signal. This molecule scores above 
  the platform threshold for VC/BD interest. 
  [Top 2 components] are the primary value drivers. 
  Recommended action: full due diligence warranted."
- If 50-74: "Moderate investment signal. Selective interest 
  is appropriate. [Strongest component] supports consideration 
  but [weakest component] requires further validation before 
  commitment."
- If <50: "Weak investment signal at current development stage. 
  Monitor for [phase advancement / data readout / 
  partnership announcement] as potential re-rating catalysts."

CAPM Alpha Narrative:
- If α₁ positive AND α₂ positive: "Both historical and pipeline 
  alpha are positive — this molecule outperforms expectations 
  on both benchmarks. Δα of [X]% indicates the field has 
  [advanced vs history / retreated], which is a 
  [favourable/cautionary] signal for new entrants."
- If α₁ positive AND α₂ negative: "Strong historical alpha 
  but below current pipeline mean — the TA has become more 
  competitive since historical benchmarks were set. 
  Differentiation strategy is critical."
- If both negative: "Below-benchmark performance on both 
  measures. Review mechanism novelty and competitive positioning 
  before investment decision."

Monte Carlo Narrative:
- Always show: "Under [N] simulated scenarios, peak sales 
  range from $[P5] (bear case) to $[P95] (bull case) 
  with a base case of $[P50]. 
  The [widest/narrowest] uncertainty band is in [model name], 
  driven by [PTRS/market/competitive] variability."

PA Index Narrative:
- Highest scoring market: "Strongest access signal in [market] 
  ([score]/100 — [band]). [One sentence on why — 
  e.g. established payer precedent / orphan designation / 
  QALY profile]."
- Lowest scoring market: "Most challenging access in [market] 
  ([score]/100). Primary barrier: [price pressure / 
  HTA evidence requirements / budget impact]."
- Overall: "Global weighted access score suggests 
  [strong/moderate/selective] market entry strategy. 
  Priority markets: [top 3 by score]."

IMPLEMENTATION NOTES:
- Narratives are generated at render time using the same 
  MoleculeProfile data from ReportMoleculeContext
- All threshold values and TA baselines come from existing 
  calibration files (ptrs_calibration.json, taBenchmarks_multiTA.ts)
- Narratives appear in BOTH the Full DD Report AND the individual 
  simulator tabs (each simulator tab gets its own model narrative)
- Font: italic, slightly smaller than body text, grey text colour
- The narrative box should not be printable as a separate element — 
  it flows naturally within each model section

ALSO: Add trial-specific disclaimer to the Full DD Report header:
Grey italic text immediately below the molecule name/NCT badge row:
"This report reflects [NCT ID] — [Phase] | [Conditions] | [Age group] | 
[Sex]. All model outputs are specific to this trial design and 
patient population."
```

---

## SEND ORDER — Current Status

### ✅ COMPLETED
| Prompt | Description | Credits |
|--------|-------------|---------|
| A | TA canonical names sweep | 3-4 |
| B | CAPM restructure + molecule selector | 4-5 |
| B1 | NCT ID fix, hardcoded lists removed | 2-3 |
| B2 | LPI inputs, LPI-2 deterministic, TTM rebuild | 5-7 |
| C | Device flagging | 2-3 |
| D | Methodology tab 5 missing models | 3-4 |
| F | Pricing card hover fix | 1-2 |
| H1 | SessionMoleculeContext single source of truth | 5-7 |
| H3 | Full platform model audit (report only) | — |

### 🔴 SEND IN THIS EXACT ORDER
| # | Prompt | Description | Credits | Gate |
|---|--------|-------------|---------|------|
| 1 | **H1.5** | Fix 4 calculation divergences from audit | 4-5 | Send now |
| 2 | **SIM1** | Simulator UX — result badges, result-first layout, hide methodology from simulator | 4-5 | After H1.5 verified |
| 3 | **PDF1** | Full DD Report PDF redesign — fonts, typography, card design, model order | 5-6 | After SIM1 verified |
| 4 | **PDF2** | Fix card splits + duplicate yellow header | 2-3 | After PDF1 verified |
| 5 | **H2** | Add PTRS, CAPM, PA Index, Monte Carlo to DD Report + narrative | 8-10 | After PDF2 verified |
| 6 | **H3** | Re-run full platform audit — verify everything clean | — | After H2 verified |

### ⏳ SEND ANYTIME AFTER H2
| Prompt | Description | Credits | Condition |
|--------|-------------|---------|-----------|
| **E** | Stripe integration | 4-6 | After Stripe keys added |
| **G** | Pricing page redesign + header update | 4-5 | Can send anytime after H2 |

---

## PROMPT B2 — LPI & TTM Input Wiring Fix
*Estimated cost: 5-7 credits — send AFTER B1, BEFORE H1*

---

```
TASK: Fix the INPUT WIRING to three model functions so they receive real
molecule fields from molecules_master.min.json instead of fabricated or
hardcoded values. Do NOT change any model logic, weights, calibration
constants, or formulas. Wiring and input mapping only.

GOLDEN RULE: Do NOT modify scoring.ts model logic, lpi3Model.ts internal
calculations, lpi2Model.ts formulas, ttmData.ts benchmark values, or any
JSON calibration files. Only fix what fields are passed as inputs.

=== PART 1: FIX INPUT WIRING for calculateLPI3ForMolecule() ===

FILE: src/lib/lpi3Model.ts — wrapper function calculateLPI3ForMolecule()
DO NOT touch calculateLPI3() internal logic — that is the model itself.
ONLY fix the wrapper that prepares inputs before calling calculateLPI3().

CURRENT PROBLEM — wrapper uses fabricated inputs:
- hasBreakthroughDesignation = random seed > 0.6 (NOT from real data)
- hasBiomarker = TA name contains "oncology" only (too narrow)
- hasOrphanDesignation = TA name contains "rare" only (misses many)
- companyTrackRecord = always defaults to 'average' for 14K molecules
- approval_status, has_results, status, study_title, conditions
  are available in molecules_master.min.json but never passed in

REQUIRED — extend wrapper input interface to accept missing fields:
Add these optional fields to the molecule parameter object:
  approval_status?: string
  has_results?: boolean
  status?: string        // RECRUITING | ACTIVE_NOT_RECRUITING | COMPLETED
  study_title?: string
  conditions?: string

REPLACE fabricated derivations with real field-based logic:

hasBiomarker: derive from study_title and conditions fields:
  study_title?.toLowerCase().includes('biomarker') ||
  study_title?.toLowerCase().includes('targeted') ||
  study_title?.toLowerCase().includes('companion diagnostic') ||
  conditions?.toLowerCase().includes('biomarker') ||
  therapeuticArea?.toLowerCase().includes('oncology')

hasBreakthroughDesignation: derive from study_title — NOT random seed:
  study_title?.toLowerCase().includes('breakthrough') ||
  study_title?.toLowerCase().includes('fast track') ||
  study_title?.toLowerCase().includes('accelerated approval') ||
  study_title?.toLowerCase().includes('priority review')

hasOrphanDesignation: derive from conditions AND study_title:
  therapeuticArea?.toLowerCase().includes('rare') ||
  conditions?.toLowerCase().includes('orphan') ||
  conditions?.toLowerCase().includes('rare disease') ||
  study_title?.toLowerCase().includes('orphan')

cmcComplexity: extend beyond gene/cell therapy:
  gene therapy keywords → 4
  cell therapy keywords → 4
  mRNA or biologic or antibody keywords → 3
  default → 2

companyTrackRecord: derive from sponsorType (already computed):
  sponsorType === 'big_pharma' → 'fast'
  sponsorType === 'large_biotech' → 'average'
  all others → 'slow'
  (Remove the default 'average' fallback entirely)

AFTER calculateLPI3(input) runs, apply these post-calculation
adjustments using the real status fields — these are observable
current-state signals, not model parameters:
  approval_status contains 'APPROVED' → boost toward ceiling
  approval_status === 'COMPLETED_PH3' → moderate boost
  has_results === true AND phase includes 'III' → small boost
  status === 'ACTIVE_NOT_RECRUITING' → small positive signal
  status === 'RECRUITING' AND Phase I only → small penalty

THEN update all callers to pass the new fields:
  src/components/LPI3Dashboard.tsx
  src/components/LPI3ReportCard.tsx
  src/components/LPIExtendedReportCard.tsx
  src/components/MoleculeScoreCard.tsx
  src/components/PortfolioDashboard.tsx
Each must pass approval_status, has_results, status, study_title,
conditions from the molecule's raw JSON row.

=== PART 2: FIX Math.random() in calculateLPI2ForMolecule() ===

FILE: src/lib/lpi2Model.ts
CONFIRMED PROBLEM: sub-factor scoring functions use Math.random()
making Investment Score non-deterministic — different score on
every page render for the same molecule. This is a credibility bug.

REQUIRED FIX — replace Math.random() with seeded deterministic random:
Use the same hashCode() + seededRandom() pattern already implemented
in lpi3Model.ts. Seed from molecule.id so same molecule always
produces identical Investment Score.

Do NOT change any weights, formulas, or factor definitions.
Only replace Math.random() calls with seededRandom(hashCode(molecule.id)).
Use different seed offsets for different sub-factors to maintain
score variance across factors:
  sub-factor 1: seededRandom(seed)
  sub-factor 2: seededRandom(seed + 1)
  sub-factor 3: seededRandom(seed + 2)
  etc.

=== PART 3: REBUILD calculateTTMMonths() in src/lib/scoring.ts ===

CURRENT PROBLEM: function reads estimatedLaunchDate from marketData
(hardcoded demo data) and returns months to that date.
This produces flat ~27mo for all 14K molecules.

REQUIRED FIX — replace with phase-based calculation.
The benchmark data already exists correctly in src/lib/ttmData.ts.
Do NOT change ttmData.ts values — read from them.

New function signature:
export function calculateTTMMonths(
  phase: string,
  therapeuticArea: string,
  sponsorType: string,
  approval_status?: string,
  status?: string,
  study_title?: string
): number | null

CALCULATION using existing ttmData.ts benchmark totals:
1. Read TA total TTM baseline from ttmData.ts for the molecule's TA
2. Apply phase remaining fraction:
   Phase I → 0.73 of total
   Phase I/II → 0.65
   Phase II → 0.48
   Phase II/III → 0.35
   Phase III → 0.23
   Phase III/IV → 0.18
   COMPLETED_PH3 → 0.15
   approval_status contains APPROVED → 0.07
3. Apply sponsor speed modifier (read from sponsorType):
   big_pharma → × 0.85
   large_biotech → × 1.0
   mid_biotech | unknown → × 1.20
4. Apply pathway modifier (from study_title keywords):
   breakthrough | accelerated → × 0.80
   fast track | priority review → × 0.85
   orphan → × 0.90
   none → × 1.0
5. Apply status modifier:
   ACTIVE_NOT_RECRUITING → × 0.90
   COMPLETED → × 0.85
   RECRUITING → × 1.0
6. Return round(baseline × phase_fraction × sponsor × pathway × status)
   Return null if phase unrecognised

Update all callers to pass new parameters:
  src/components/MoleculeScoreCard.tsx
  src/components/TTMBreakdownChart.tsx
  src/lib/excelExport.ts
  src/hooks/useMolecules.ts (if it calls calculateTTMMonths)
  Any other file calling calculateTTMMonths()

VERIFY after all three fixes:
LPI range: 30-92% with genuine variation (not 61-67% clustering)
Investment Score: same molecule = same score on every render
TTM range: Phase I Neurology unknown ~131mo,
           Phase III Oncology Big Pharma ~25mo,
           COMPLETED_PH3 ~14-20mo,
           APPROVED Big Pharma ~6-9mo
```

---

## PROMPT PDF2 — PDF Card Splits + Duplicate Header Fix
*Estimated cost: 2-3 credits — send immediately after PDF1, before H2*

---

```
TASK: Two targeted PDF export fixes only.
Do not change any other PDF styling, model logic, or content.

=== FIX 1: NO CARD SPLITS — ZERO TOLERANCE ===

Every navy-bordered card in the PDF must stay whole on one page.
No card may ever be split across a page boundary under any circumstance.

Rule: if a card does not fit on the remaining space of the current page,
it must start on a new page entirely.

Implementation:
  Every card container in the PDF export stylesheet:
    page-break-inside: avoid;
    break-inside: avoid;
    page-break-before: auto;

  For cards taller than one full page — split at logical content boundary:

  Split 1 — "TA-weighted factor / Endocrinology & Metabolism":
    Card A: TA-weighted factor composite bar + FDA Avg + EMA Avg
    Card B: General Industry Impact per Life Cycle Phase
            + Key Failure Points at Phase III list
  Each card gets its own navy border + page-break-inside: avoid.

  Apply same split logic to any other card exceeding one page height.

=== FIX 2: SINGLE YELLOW HEADER BAR — ONE ONLY ===

Currently two overlapping yellow bars appear at top of each page.

Step 1: Remove ALL existing yellow header bar injection
        from PDF export code entirely. Delete all of it.

Step 2: Add back exactly ONE yellow bar per page:
  height: 1cm maximum (~38px)
  background: BioQuill yellow (existing value)
  left: BioQuill™ wordmark
  centre: "Know the odds. Understand the pipeline. Win the race."
  right: "Data refreshed: [date]"
  appears once per page, top only, no duplication

Step 3: Suppress the sticky platform header entirely during
        PDF export — it must not render in the PDF at all.

VERIFY:
1. Generate PDF for Tirzepatide NCT07165028
2. Zero cards split across pages — every card whole on one page
3. Exactly one yellow bar per page, no overlap, no duplication
4. TA-weighted factor split into two separate whole cards
```

---

## FULL PLATFORM AUDIT PROMPT — Run after B1, B2, H1, H2 are all verified
*Send to Lovable once all four prompts are confirmed working*

---

```
TASK: Comprehensive platform audit. No changes. Report only.

For EVERY model in the platform, answer ALL of the following:

MODELS TO AUDIT:
1. LPI (computeLPI in scoring.ts)
2. LPI-3 (calculateLPI3ForMolecule in lpi3Model.ts)
3. LPI-2 / Investment Score (calculateLPI2ForMolecule in lpi2Model.ts)
4. TTM (calculateTTMMonths in scoring.ts)
5. Composite Score (calculateCompositeScore in scoring.ts)
6. PTRS (all functions in PTRSMonteCarloIntegration.tsx and related)
7. TI — Therapeutic Index (getTherapeuticIndexForMolecule)
8. Peak Sales Index (calculatePeakSalesIndex)
9. Blockbuster Probability ($1B)
10. CAPM Alpha Signals (CAPMAlphaSignals.tsx)
11. PA Index-1 MWPSPI (PAModel1Dashboard.tsx)
12. PA Index-2 Comparative Payer Likelihood (PAModel2Dashboard.tsx)
13. Monte Carlo Simulation (MonteCarloSimulation.tsx)
14. TA Risk Index (if implemented)

FOR EACH MODEL, report:

A. MODEL CALIBRATION SOURCE
   - Which files were used to BUILD and CALIBRATE this model?
   - List every JSON, CSV, or constant file that defines weights,
     base rates, calibration points, or benchmark values
   - Are these files static/frozen or dynamic?

B. PREDICTION INPUT SOURCE
   - Which database/file does this model READ FROM to generate
     predictions for live molecules?
   - Does it read from molecules_master.min.json? If yes, which fields?
   - Does it read from any hardcoded demo molecule list? If yes, list it
   - Does it read from any other source?

C. WHERE IT RUNS
   - List every component, hook, or utility that calls this model
   - For each caller: what tab/page does it appear on?
   - Is it called on page load, on molecule selection, or on user action?

D. WHAT IT OUTPUTS
   - What is the output variable name and type?
   - Where is the output stored? (molecule object, component state, context)
   - Where is the output displayed in the UI?

E. CONSISTENCY CHECK
   - Does this model run in MORE THAN ONE place for the same molecule?
   - If yes: do all instances use the same input source and produce
     identical outputs? Or can they diverge?
   - Specifically: does the molecule card badge use the same model
     instance as the simulator tab? As the DD Report?

F. OUT-OF-SCOPE CONNECTIONS
   - Does this model connect to or affect anything OUTSIDE the
     Platform/Strategy Hub tabs?
   - Does it affect exports, PDFs, URLs, or external API calls?
   - Any connections that seem unintended or surprising?

Format the response as a table for sections A-D, then prose for E-F.
Do not make any changes. Audit and report only.
```



---

## PROMPT G — Pricing Page Redesign + Platform Header Update
*Estimated cost: 4-5 credits — send after H2*

---

```
TASK: Two updates — platform header copy and pricing page redesign.

=== PART 1: UPDATE PLATFORM HEADER ===

Replace the yellow top bar content:
CURRENT: "Precision intelligence. From pipeline to patients."
NEW PRIMARY: "Know the odds. Understand the pipeline. Win the race."
NEW SUB-LINE: "High-stakes decisions require assigning probabilities.
BioQuill makes that possible for every molecule in the global pipeline."

=== PART 2: PRICING PAGE REDESIGN ===

HERO SECTION:
Headline: "Know the odds. Understand the pipeline. Win the race."
Sub-headline: "13 proprietary models. 14,000 active molecules.
20 therapeutic areas. Every asset scored on launch probability,
time to market, and competitive position."
Hero stat: "$18,000/year. Every molecule in the global pipeline,
scored across 13 proprietary models."

ADD FREE TRIAL TIER (top of pricing, most prominent):
Name: Try BioQuill
Price: Free — no credit card required
Includes:
- 3 molecules, your choice
- All 13 models
- Full DD Report for each
- 14-day access
CTA button: "Start Free Trial"

PRICING TIERS (updated prices):

1. Analyst — $9,000 bi-annual ($18,000/year)
   - 10 molecules/month
   - All 13 models
   - Full DD Report per molecule
   - For: Individual analysts, boutique advisors

2. 1 TA — $18,000 bi-annual ($36,000/year)
   - All molecules in 1 therapeutic area
   - All 13 models
   - TA-level competitive landscape
   - For: Focused pipeline teams, TA specialists

3. Team — $28,000 bi-annual ($56,000/year)
   - 3 therapeutic areas
   - Shortlist & Compare
   - Team sharing
   - For: BD&L teams, small funds

4. Investor — $45,000/year
   - Portfolio tracking
   - CAPM Alpha Signals
   - Top 100 Rankings
   - For: Biotech investors, VCs, hedge funds

5. Intelligence — $65,000/year
   - All 20 therapeutic areas
   - API access
   - Automated alerts
   - For: Large biotech, pharma strategy teams

6. Full — $100,000/year
   - Everything
   - Dedicated account manager
   - Custom model calibration consultation
   - For: Enterprise pharma, top-tier funds

POSITIONING COPY for pricing page:
"The analytical rigour that exists inside the world's largest pharma
companies — available to any team, from $18,000 per year.
BioQuill is not a data platform. It is a decision framework.
We don't tell you what is happening in the pipeline.
We tell you what to do about it."

ANCHOR LINE at bottom of pricing page:
"In the race to market, the best decision is always
the most probable one."
```

---

## PROMPT UI1 — Platform Page Restructure: Delete Nav Bars + Model Card Grid
*Estimated cost: 4-5 credits — send before SIM1a*

```
TASK: Restructure the Platform page layout. Three changes in one pass.

=== CHANGE 1: DELETE BOTH SUB-NAV BARS ===

Remove the following two elements completely — do not replace with anything:
1. The second navy bar containing: PIPELINE | APPROVAL | PRICING & ACCESS | LAUNCH & COMMERCIAL
2. The grey sub-bar below it containing: Molecules Database | LPI | TI (and any other tabs in that bar)

All content that previously lived inside those 4 tab panels will be 
replaced by the new model card grid (see Change 3 below).

=== CHANGE 2: SLIM THE 6 WHITE SUMMARY STAT CARDS ===

The existing 6 white summary stat cards at the top of the Platform page 
must remain in a single row but be made 50% thinner (reduce height only, 
not width). Keep the number and label. Remove all excess internal padding.
Target height: approximately 48px per card.

=== CHANGE 3: ADD 2-ROW MODEL SELECTOR GRID ===

Immediately below the 6 white cards, add a 2-row grid of 14 small model 
selector cards.

CARD DIMENSIONS: approximately 1cm tall × 2cm wide (use ~48px × 120px 
as CSS target), evenly spaced, 7 per row.

DEFAULT STATE:
- Background: light blue (#EFF6FF or equivalent)
- Border: 1px solid #BFDBFE
- Border radius: 8px
- Text: model name in Manrope 600 12px, #1e3a5f
- Sub-label: 1-2 word descriptor in Manrope 400 10px, #64748b

HOVER STATE:
- Background shifts to light yellow (#FEFCE8)
- Border: 1px solid #FDE68A
- Slight box-shadow lift: 0 2px 8px rgba(0,0,0,0.08)
- Cursor: pointer

ACTIVE/SELECTED STATE (when a model is open):
- Background: #1e3a5f (navy)
- Text: white
- Border: 2px solid #F59E0B (gold)

ROW 1 — Stage 1 & 2 (7 cards, left to right):
1. PTRS | "Phase success"
2. LPI | "Launch probability"
3. TI | "Therapeutic index"
4. TTM | "Time to market"
5. Regulatory Timeline | "Approval pathway"
6. Clinical Studies | "Trial overview"
7. TA Risk Index | "Area risk"

ROW 2 — Stage 3 & 4 (7 cards, left to right):
8.  Peak Sales | "Revenue potential"
9.  Blockbuster Probability | "Blockbuster odds"
10. PA Index-1 | "Payer access"
11. PA Index-2 | "Comparator payer"
12. CAPM Alpha | "Risk-adjusted return"
13. Investment Score | "Investment grade"
14. Monte Carlo | "Scenario simulation"

=== CHANGE 4: MOLECULE SEARCH POSITION ===

The molecule search bar (search by name or NCT ID) must appear 2cm 
(~80px) below the "Molecules by Therapeutic Area" donut/pie chart — 
wherever that chart currently sits on the page. It should be permanently 
visible at that position, not inside any tab or panel.

The molecule card list renders immediately below the search bar.

=== VERIFICATION ===
After changes:
- Page has only ONE navy bar (the main navigation)
- No grey sub-bar
- 6 white cards are visibly thinner than before
- 14 model cards appear in 2 rows of 7 below the white cards
- Hovering any model card turns it light yellow
- Molecule search bar is visible below the TA donut chart
- No content has been deleted — it has moved into the model cards
```

---

## PROMPT UI2 — Wire Model Cards to Simulators
*Estimated cost: 3-4 credits — send after UI1 verified*

```
TASK: Wire the 14 model selector cards (added in UI1) to their 
respective simulator panels. No design changes — wiring only.

BEHAVIOUR:
- When a model card is clicked, its simulator/calculator opens 
  inline below the model grid (do not navigate to a new page)
- The active card switches to navy + gold border (selected state)
- Clicking the same card again collapses the panel (toggle)
- Only one panel can be open at a time — clicking a second card 
  closes the first

MOLECULE CONTEXT:
- The open simulator must always use the molecule selected via 
  "Use in Simulator →" from the molecule card list below
- If no molecule has been selected, show a prompt inside the 
  simulator panel: "Select a molecule below to run this model"
- Do NOT use any hardcoded molecule as default

MODEL CARD → SIMULATOR MAPPING (exact, do not remap):
1.  PTRS              → PTRS simulator tab (existing)
2.  LPI               → LPI simulator tab (existing)
3.  TI                → TI simulator tab (existing)
4.  TTM               → TTM simulator tab (existing)
5.  Regulatory Timeline → Regulatory Timeline panel
6.  Clinical Studies  → Clinical Studies panel
7.  TA Risk Index     → TA Risk Index panel
8.  Peak Sales        → Peak Sales simulator tab (existing)
9.  Blockbuster Probability → Blockbuster simulator tab (existing)
10. PA Index-1        → PA Index-1 simulator tab (existing)
11. PA Index-2        → PA Index-2 simulator tab (existing)
12. CAPM Alpha        → CAPM simulator tab (existing)
13. Investment Score  → Investment Score simulator tab (existing)
14. Monte Carlo       → Monte Carlo simulator tab (existing)

STUB CARDS (PA Index-2, Regulatory Timeline, Clinical Studies):
These three models require manual input. When clicked, the panel 
that opens should show:
- Model name + one-line description
- The text: "Requires manual comparator input — run in simulator/calculator"
- A single CTA button: "Open Full Calculator →" which links to 
  the appropriate full simulator

VERIFICATION:
- Clicking LPI card opens LPI simulator inline, uses selected molecule
- Clicking PTRS card opens PTRS simulator inline, uses selected molecule  
- Clicking a second card closes the first
- "Select a molecule below" prompt appears when no molecule is active
- PA Index-2 shows stub card with correct message
```

---

## PROMPT SIM1a — Fix Hardcoded Molecule Lists: Connect Models to 14K Master
*Estimated cost: 4-5 credits — send after UI2 verified*

```
TASK: Remove all hardcoded molecule lists from simulator tabs and 
connect Peak Sales, PA Index-1, and Monte Carlo to the live 14K 
molecules_master.min.json dataset.

ROOT CAUSE:
Several simulator tabs (Peak Sales, PA Index, Monte Carlo) contain 
hardcoded molecule arrays that ignore the molecule selected via 
SessionMoleculeContext. This means "Use in Simulator →" does not 
work for these models — the simulator always shows its own default 
molecules regardless of user selection.

CHANGE 1 — REMOVE HARDCODED MOLECULE ARRAYS:
Search all simulator tab files for hardcoded molecule objects 
(arrays of molecules with name, phase, TA, company defined inline).
Delete these arrays. Do not replace with other hardcoded data.

CHANGE 2 — WIRE TO SessionMoleculeContext:
Each of the three models must read their active molecule from 
SessionMoleculeContext (the context set when user clicks 
"Use in Simulator →"). The molecule object passed must include 
these fields at minimum:
- id (NCT ID)
- name
- phase
- therapeuticArea
- company
- approval_status
- has_results
- status

CHANGE 3 — TA BASELINE FALLBACK:
For Peak Sales, PA Index-1, and Monte Carlo, when the model 
requires inputs that cannot be derived directly from the molecule 
JSON row (e.g. pricing assumptions, market penetration curves), 
use the TA-level benchmark values from taBenchmarks_multiTA.ts 
as the baseline. Label all TA-derived inputs visibly as:
"TA baseline estimate — adjust in calculator"

CHANGE 4 — NO MOLECULE SELECTED STATE:
If SessionMoleculeContext is null (no molecule selected), 
each simulator shows:
"Select a molecule using 'Use in Simulator →' to run this model"
Do NOT auto-select any molecule. Do NOT fall back to hardcoded data.

VERIFICATION:
1. Select Pembrolizumab via "Use in Simulator →"
2. Open Peak Sales simulator — must show Pembrolizumab, 
   Oncology & Hematology, Merck Sharp & Dohme LLC
3. Open Monte Carlo simulator — must show same molecule
4. Open PA Index-1 — must show same molecule
5. Refresh page without selecting → all three show 
   "Select a molecule" prompt, no data displayed
```

---

## PROMPT SIM1b — Result Badges + Auto-Parameter Baseline Mode
*Estimated cost: 4-5 credits — send after SIM1a verified*

```
TASK: Two changes to all simulator tabs — result badge design 
and auto-parameter baseline mode for DD Report.

=== CHANGE 1: RESULT BADGE DESIGN (all simulator tabs) ===

Every simulator tab must display its primary result as:
- Outer ring: gold/amber (#F59E0B), 4px width, circular
- Inner circle: navy (#1e3a5f) fill
- Number: white, DM Mono 500, 28px, centred
- Label below number: white, Manrope 400, 11px (e.g. "Launch Probability")
- Size: 96px diameter outer ring, 80px inner circle
- Position: top-right of the simulator panel, prominent

This badge is the ONLY place the primary result number appears 
large. Do not duplicate the number elsewhere in the same panel.

Secondary stats (CI range, benchmark comparison etc.) appear 
below the badge in smaller text — Manrope 400 13px, #64748b.

=== CHANGE 2: THREE-LAYER SIMULATOR LAYOUT (all tabs) ===

Each simulator tab must follow this exact structure, top to bottom:

LAYER 1 — RESULT (always visible, never hidden)
- Result badge (navy/gold as above)
- One-sentence plain English principle
  Example for LPI: "Phase III molecules from Big Pharma sponsors 
  in Tier 1 TAs have historically launched 72% of the time."
- Link: "→ Full model documentation in the Methodology tab"

LAYER 2 — CONTEXT CHART
- One chart only — gives perspective on where this molecule sits
- Chart type per model:
  * LPI: horizontal bar, this molecule vs TA benchmark vs all phases
  * PTRS: phase transition funnel
  * TTM: distribution curve, molecule position marked
  * Peak Sales: bar chart vs TA median and top decile
  * Monte Carlo: probability distribution histogram
  * CAPM: scatter plot, alpha marked
  * Investment Score: gauge or percentile bar
  * PA Index-1: horizontal comparison bar vs TA benchmark
  * All others: most appropriate single chart type

LAYER 3 — PARAMETERS (collapsed by default)
- Expandable section "Adjust Parameters ▾"
- When collapsed: shows only "Using TA baseline values"
- When expanded: shows all adjustable inputs
- Changes to parameters update the badge in real time

=== CHANGE 3: AUTO-PARAMETER BASELINE FLAG ===

When a simulator is opened from the DD Report (not manually):
- Parameters are auto-set from molecule fields + TA benchmarks
- A visible flag appears above the badge: 
  "Auto-calculated from molecule data · Adjust below"
- This flag does NOT appear when the user has manually 
  adjusted any parameter

VERIFICATION:
- LPI tab shows navy/gold badge with DM Mono number
- PTRS tab shows same badge style
- Expanding "Adjust Parameters" on any tab shows inputs
- Collapsing hides inputs but badge remains visible
- DD Report auto-open shows the baseline flag
```

