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

## PROMPT H1 — Single Source of Truth Architecture Refactor
*Estimated cost: 5-7 credits — send BEFORE Prompt H2*
*Do not send until Prompts A-F are complete and verified*

---

```
TASK: Architecture refactor only — no UI changes, no new features.
Fix the dual molecule object problem so that the Full DD Report and all 
simulator dashboards use one single source of truth.

CURRENT PROBLEM (confirmed by audit):
- Simulators use: SimulatorMoleculeContext (session state from MoleculePicker)
- Full DD Report uses: activeMolecule from Overview cards (different object instance)
- Both call the same pure functions BUT with potentially different field mappings
  when molecules are loaded from the 14K master dataset
- Result: numerical discrepancies are possible between simulator outputs 
  and Full DD Report outputs for the same molecule

REQUIRED CHANGES:

1. CREATE a new unified context: src/context/ReportMoleculeContext.tsx
   This is the single source of truth for the selected molecule across 
   the entire platform.
   
   Interface:
   {
     molecule: MoleculeProfile | null,
     rawRow: MoleculeRow | null,        // original row from molecules_master.min.json
     nctId: string | null,
     setMolecule: (molecule: MoleculeProfile, rawRow: MoleculeRow) => void,
     clearMolecule: () => void
   }

2. TRIGGER: "Use in Simulator →" button on any Overview card calls 
   ReportMoleculeContext.setMolecule() with BOTH the MoleculeProfile 
   AND the original raw JSON row. This is the ONLY place molecule 
   selection is set.

3. WIRE all simulator dashboards to read from ReportMoleculeContext:
   - src/components/LPI3Dashboard.tsx
   - src/components/LPI2Dashboard.tsx
   - src/components/PeakSalesIndexDashboard.tsx
   - src/components/MonteCarloSimulation.tsx
   - src/components/CAPMAlphaSignals.tsx
   - src/components/PAModel1Dashboard.tsx
   - src/components/PAModel2Dashboard.tsx
   - src/components/PTRSMonteCarloIntegration.tsx
   Replace any local molecule state or SimulatorMoleculeContext 
   reads with ReportMoleculeContext reads.

4. WIRE all report card components to read from ReportMoleculeContext:
   - src/components/LPI3ReportCard.tsx
   - src/components/InvestmentScoreReportCard.tsx
   - src/components/MoleculeScoreCard.tsx
   - src/components/LPIExtendedReportCard.tsx
   Replace activeMolecule reads with ReportMoleculeContext reads.

5. ENSURE the _raw → MoleculeProfile transformation is done ONCE 
   at context set time (in the "Use in Simulator →" handler), 
   not independently in each component. Both simulators and report 
   components receive the SAME pre-transformed MoleculeProfile object.

6. DEPRECATE SimulatorMoleculeContext — migrate all its consumers 
   to ReportMoleculeContext, then remove it.

7. DEPRECATE the activeMolecule pattern in Overview cards for report 
   generation — the report must only render when ReportMoleculeContext 
   has a molecule set.

VERIFICATION after implementation:
- Pick any molecule from the 14K dataset via "Use in Simulator →"
- Check LPI% shown on the Overview card badge
- Check LPI% shown in LPI3Dashboard simulator
- Check LPI% shown in Full DD Report
- All three must show identical numbers
- Repeat for TI, Peak Sales Score, Investment Score, TTM
- If any discrepancy exists, the refactor is incomplete

Do NOT add any new UI elements, new models, or new features in this prompt.
Architecture refactor only.
```

---

## PROMPT H2 — Full DD Report: Add Missing Models + Interpretive Narrative
*Estimated cost: 8-10 credits — send ONLY after H1 is verified complete*

---

```
TASK: Two additions to the Full DD Report:
(1) Add 4 missing model sections
(2) Add interpretive narrative to every model output

PREREQUISITE: Prompt H1 must be complete. All report sections must be 
reading from ReportMoleculeContext before this prompt is sent.

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

## UPDATED SEND ORDER (complete package)

| Prompt | Description | Credits | Status |
|--------|-------------|---------|--------|
| A | TA canonical names sweep | 3-4 | Send now |
| LPI | Scoring fix — src/lib/scoring.ts | — | Send now |
| B | CAPM restructure + selector fix | 4-5 | Send now |
| C | Device flagging | 2-3 | Send now |
| D | Methodology tab 5 missing models | 3-4 | Send now |
| E | ALPHA rename + Stripe | 4-6 | After Stripe keys added |
| F | Pricing card hover fix | 1-2 | Send now |
| G | Pricing page redesign | 4-5 | TBD — pricing structure being finalised |
| H1 | Single source of truth refactor | 5-7 | After A-F verified |
| H2 | Missing models + narrative layer | 8-10 | After H1 verified |
