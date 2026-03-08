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

3. Price IDs from env variables:
   VITE_STRIPE_PRICE_PRO=price_XXXX
   VITE_STRIPE_PRICE_ENTERPRISE=price_XXXX
   Add code comment: // TODO: replace test price IDs with live IDs before launch

4. Success redirect URL: /platform?subscribed=true
   Show success banner: "Subscription activated — welcome to BioQuill"

5. Add subtle "Powered by Stripe" badge beneath pricing cards.

6. No authentication/login wall at this stage — Stripe checkout only.

Environment variables to add in Lovable project settings before running this prompt:
VITE_STRIPE_PUBLISHABLE_KEY = pk_test_[your key]
VITE_STRIPE_PRICE_PRO = price_[your price ID]
VITE_STRIPE_PRICE_ENTERPRISE = price_[your price ID]
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
