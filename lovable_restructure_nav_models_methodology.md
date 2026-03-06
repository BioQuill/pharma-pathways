# Lovable Prompt — Navigation Restructure + Models Tab + TI Restore

## What this prompt does
1. Restores the missing TI (Therapeutic Index) badge on molecule cards
2. Restructures the top navigation bar
3. Creates a new **Models** tab with one sub-tab per model/metric
4. Converts the existing **Methodology** tab to high-level platform overview only

---

## PROMPT — paste this into Lovable

Please make the following structural changes to the platform. Read carefully before making any edits.

---

### PART 1 — Restore TI Badge on Molecule Cards

The TI (Therapeutic Index) badge has disappeared from molecule cards after the recent navbar update. The full calculation logic is intact in `src/lib/therapeuticIndex.ts`. 

Restore the TI badge to all molecule cards where it previously appeared — alongside LPI, TTM, Score, and Drop badges. Use the existing functions already in `therapeuticIndex.ts`:
- Display the numeric TI value (e.g. "5.7")
- Colour coding: red background for narrow TI (<2), yellow for moderate (2–10), green for wide (>10)
- Use `getTherapeuticIndexBgColor()` for background and `getTherapeuticIndexColor()` for text colour
- Label: "TI"

---

### PART 2 — Top Navigation Bar Restructure

The current top nav has: Platform | Methodology | Strategy Hub | Pricing | Search

**Change it to:** Platform | **Models** | Methodology | Strategy Hub | Pricing | Search

Add **Models** as a new tab between Platform and Methodology.

---

### PART 3 — Models Tab (New — Full Detail)

Create a new **Models** tab. This tab contains one sub-tab for each BioQuill proprietary model or invented metric. Each sub-tab shows the full model detail: definition, formula, inputs, outputs, interpretation, and worked example.

Use a consistent layout for each sub-tab:
- Model name + one-line description at top
- Formula block (monospace/code style)
- Inputs table (variable | definition | source)
- Outputs + interpretation
- Worked example with real numbers
- Data source / citation footer

Sub-tabs to create (in this order):

#### Sub-tab 1 — PTRS (Probability of Technical and Regulatory Success)
- **Definition:** PTRS = PTS × PRS. The probability that a molecule currently in clinical development will successfully complete its remaining clinical phases AND receive regulatory approval.
- **PTS formula:** `PTS = base_phase_transition_rate(TA, phase) × slider_modifier`
- **PRS formula:** `PRS = base_nda_approval_rate(TA) × slider_modifier_asymmetric`
- **Base rates source:** BIO/Norstella 2011–2020 published phase transition probabilities. Fetch from `ptrs_calibration.json` on GitHub: `ptrs_base_rates.by_ta[TA][phase]` for PTS, `prs_base_rates.by_ta[TA].rate` for PRS.
- **Slider modifier logic:** 0–20% → 0.50×, 21–40% → 0.75×, 41–60% → 1.00×, 61–80% → 1.20×, 81–100% → 1.40×
- **PRS asymmetric modifier:** When base PRS ≥ 0.80, max upside is 1.08× (high-base TAs have limited room to improve)
- **Worked example:** Phase 2 Oncology, average sliders → PTS = 34.1%, PRS = 93.5%, PTRS = 31.9%
- **Citation:** Hay et al. Nature Biotechnology 2014; BIO Industry Analysis 2016; Norstella/BIO 2023

#### Sub-tab 2 — Monte Carlo Simulation
- **Definition:** Propagates uncertainty through each PTRS input independently across 10,000 iterations to produce a probability distribution of outcomes rather than a single point estimate.
- **What it fixes:** Uncertainty is applied to EACH INPUT slider independently, not to the final output. This is the correct approach — applying noise to outputs produces meaningless ±0.2% ranges.
- **Key formula:**
```
for each iteration:
  sampledBasePTS = basePTS + randn() × (basePTS × 0.12)
  sampledBasePRS = basePRS + randn() × (basePRS × 0.08)
  each slider sampled with ±15% uncertainty
  PTRS_i = sampledPTS × sampledPRS
Output: mean, median, std dev, P5, P95 across 10,000 iterations
```
- **Expected output for Phase 2 Oncology average inputs:** Mean ~32%, Std dev ±6%, P5–P95 range: 22–43%
- **Citation:** Monte Carlo methodology — standard actuarial practice; uncertainty ranges calibrated to BIO/Norstella observed variance

#### Sub-tab 3 — TI (Therapeutic Index)
- **Definition:** `TI = TD50 / ED50` (Toxic Dose 50 / Effective Dose 50). Measures the safety margin between a drug's therapeutic and toxic doses. Higher TI = safer drug with wider margin.
- **Classification:**
  - Narrow: TI < 2 — requires careful monitoring (warfarin, digoxin, lithium, theophylline)
  - Moderate: TI 2–10 — standard monitoring
  - Wide: TI > 10 — generally safe (penicillin, ibuprofen)
- **Source:** Empirical values from pharmacology literature by drug class, stored in `src/lib/therapeuticIndex.ts`
- **Clinical relevance:** Narrow TI drugs require therapeutic drug monitoring (TDM), have higher adverse event rates, and face more stringent regulatory scrutiny

#### Sub-tab 4 — LPI (Launch Potential Index)
- **Definition:** Composite score estimating a molecule's commercial launch potential based on market size, competitive landscape, pricing environment, and regulatory pathway.
- **Display:** Show the current LPI formula/components as implemented in the platform. Fetch definition from `src/lib/` — likely `scoring.ts` or similar.
- **Scale:** 0–100. Displayed as percentage badge on molecule cards.

#### Sub-tab 5 — Composite Score
- **Definition:** Overall molecule attractiveness score combining PTRS, LPI, TTM efficiency, TI safety profile, and revenue potential into a single 0–100 index.
- **Display:** Show the weighting of each component as implemented in `scoring.ts` or `taSpecificScoringData.ts`
- **Scale:** 0–100. The "Score" badge on molecule cards.

#### Sub-tab 6 — CAPM Alpha Signals (α₁, α₂, Δα)
- **Definition:** A CAPM-inspired framework for risk-adjusted molecule valuation. Fetch full model definition from `bioquill_capm_model.json` on GitHub.
- **Display all three signals:**

**α₁ — Historical Benchmark Alpha**
> How this molecule compares to 25 years of realised drug development outcomes.
> Answers: does this molecule have the profile of a winner?
- Formula: `α₁ = Actual_PTRS − E(R)` where `E(R) = Rf + β(Rm_TA − Rf)`
- Rf = 10.4% (BIO/Norstella 20-year all-TA realised LOA — historical closed cohorts only)
- Rm = TA-specific historical LOA from same source
- Updates: only when new BIO/Norstella cohort published (~every 3–5 years)

**α₂ — Competitive Pipeline Alpha**
> How this molecule compares to everything currently in development in its TA.
> Answers: does this molecule stand out from today's competition?
- Formula: `α₂ = Actual_PTRS − Pipeline_Mean_PTRS(TA)`
- Pipeline_Mean_PTRS computed from live BioQuill 14,000-trial database for molecule's TA
- Updates: **dynamically with every platform data refresh**

**Δα — Alpha Divergence**
> `Δα = α₁ − α₂`
- Δα > 0: molecule beats history but lags current pipeline → the field has advanced around it
- Δα ≈ 0: consistently positioned vs both benchmarks → most stable signal
- Δα < 0: lags history but leads current pipeline → best-in-class today but TA has historically done better

**Beta estimation:** β estimated from molecule characteristics (mechanism novelty, regulatory designation, sponsor tier, phase). Fetch full rules from `bioquill_capm_model.json` → `beta.estimation_rules`.

**Citation:** Hay et al. 2014; BIO 2016; Norstella 2023; FDA Drugs@FDA 2000–2025; EMA EPAR 2000–2025

#### Sub-tab 7 — TTM (Time to Market)
- **Definition:** Full time from First Patient In (FPI) to First Commercial Launch. Includes: Phase 1 + Phase 2 + Phase 3 + Regulatory Review (FDA/EMA) + Market Access/Launch.
- **Components displayed:** Discovery | Clinical | Regulatory | Market Access | Launch (stacked bar, as currently shown in TTM tab)
- **Data source:** Fetch from `taBenchmarks_multiTA.ts` on GitHub. Empirical clinical TTM from EMA EPAR × ClinicalTrials.gov matching (396 matched drugs). FDA regulatory TTM from Tufts CSDD published averages.
- **Important distinction:** The "Approval Times" tab shows regulatory review time only (Phase 3 end → approval decision). TTM is the full FPI → commercial launch pathway — a much larger number (8–16 years vs 10–24 months).

---

### PART 4 — Methodology Tab (Existing — Simplify to High Level)

The existing **Methodology** tab should become a **high-level platform overview** — not detailed model formulas. Those now live in the Models tab.

Methodology tab should contain:

**Section 1 — Data Foundation**
- 14,000+ clinical trials from ClinicalTrials.gov (refreshed regularly)
- 9,754 unique molecules (deduplicated by primary drug name, showing most advanced phase)
- 209 FDA-approved NMEs (2000–2025) and 145 EMA-approved NMEs (2000–2025)
- EMA EPAR database matched against ClinicalTrials.gov (396 matched drugs for TTM)
- Data refreshed: show dynamic date from platform config

**Section 2 — Model Suite (brief, one paragraph each)**
- PTRS — probability of technical and regulatory success, grounded in BIO/Norstella published phase transition rates
- Monte Carlo — 10,000-iteration uncertainty propagation through inputs
- TI — therapeutic index from pharmacology literature
- LPI — launch potential composite index
- Composite Score — overall molecule attractiveness
- CAPM Alpha Signals — risk-adjusted performance vs historical and pipeline benchmarks
- TTM — empirical time to market from first patient in to commercial launch

Each with a one-line description and a "→ See full model details" link pointing to the relevant Models sub-tab.

**Section 3 — Data Quality & Limitations**
- Keep existing content from current Methodology tab
- Add: "PTRS and approval rate calibration is based on historical closed-cohort data. Current pipeline molecules are unresolved — their outcomes are unknown and should not be used as calibration benchmarks."
- Add: "Alpha signals (α₁, α₂, Δα) distinguish between historical realised performance and current pipeline positioning. α₂ updates dynamically; α₁ is anchored to published cohort studies."

---

### PART 5 — Platform Tab (Client-Facing — No Formulas)

The Platform tab and all its sub-tabs (Pipeline, Approval Rates, TTM, etc.) should show **model outputs only** — no formulas, no methodology details. 

Each sub-tab may show a one-line model description at the top (e.g. "PTRS measures probability of approval from current phase — grounded in 25 years of clinical development data") but nothing more. All detail is in the Models tab.

---

### Implementation Notes

- Fetch `bioquill_capm_model.json` from GitHub raw URL for all CAPM/alpha content
- Fetch `ptrs_calibration.json` from GitHub raw URL for all PTRS base rates
- Both files are already in the GitHub repo
- The Models tab is the **only place** formulas and methodology details appear in the platform
- All other tabs (Platform, Strategy Hub) show outputs and applied results only
- TI badge restore (Part 1) is independent — implement it regardless of tab restructure status

---

### Summary of Changes

| What | Change |
|---|---|
| TI badge | Restore to all molecule cards |
| Nav bar | Add Models tab between Platform and Methodology |
| Models tab | New — 7 sub-tabs, full model detail each |
| Methodology tab | Simplify — high level overview, links to Models |
| Platform tab | No change to layout — remove any formula/methodology text |
| Strategy Hub | No change |
| Pricing | No change |
| Search | No change |
