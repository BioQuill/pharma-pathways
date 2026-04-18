// =====================================================
// PTRS ENGINE — Corrected formula implementation
// Based on BIO/Norstella 2011–2023 + BioQuill 14,000-trial dataset
// =====================================================

// === PTS Base Rates: Phase Transition Probability by TA and Phase ===
// Source: BIO/Norstella 2011–2023
export const PTS_BASE_RATES: Record<string, Record<string, number>> = {
  'Oncology & Hematology':        { 'Phase 1': 0.63, 'Phase 1/2': 0.63, 'Phase 2': 0.32, 'Phase 2/3': 0.35, 'Phase 3': 0.51 },
  'Hematology (non-oncology)':    { 'Phase 1': 0.68, 'Phase 1/2': 0.68, 'Phase 2': 0.38, 'Phase 2/3': 0.42, 'Phase 3': 0.55 },
  'Infectious Disease':           { 'Phase 1': 0.72, 'Phase 1/2': 0.72, 'Phase 2': 0.42, 'Phase 2/3': 0.46, 'Phase 3': 0.64 },
  'Cardiovascular':               { 'Phase 1': 0.65, 'Phase 1/2': 0.65, 'Phase 2': 0.35, 'Phase 2/3': 0.39, 'Phase 3': 0.58 },
  'Neurology':                    { 'Phase 1': 0.59, 'Phase 1/2': 0.59, 'Phase 2': 0.28, 'Phase 2/3': 0.31, 'Phase 3': 0.48 },
  'Immunology & Inflammation':    { 'Phase 1': 0.66, 'Phase 1/2': 0.66, 'Phase 2': 0.36, 'Phase 2/3': 0.40, 'Phase 3': 0.56 },
  'Endocrinology & Metabolism':   { 'Phase 1': 0.64, 'Phase 1/2': 0.64, 'Phase 2': 0.34, 'Phase 2/3': 0.38, 'Phase 3': 0.54 },
  'Rare Disease & Orphan':        { 'Phase 1': 0.74, 'Phase 1/2': 0.74, 'Phase 2': 0.45, 'Phase 2/3': 0.49, 'Phase 3': 0.68 },
  'Dermatology':                  { 'Phase 1': 0.68, 'Phase 1/2': 0.68, 'Phase 2': 0.40, 'Phase 2/3': 0.44, 'Phase 3': 0.60 },
  'Respiratory & Pulmonary':      { 'Phase 1': 0.62, 'Phase 1/2': 0.62, 'Phase 2': 0.33, 'Phase 2/3': 0.37, 'Phase 3': 0.52 },
  'Psychiatry & Mental Health':   { 'Phase 1': 0.55, 'Phase 1/2': 0.55, 'Phase 2': 0.25, 'Phase 2/3': 0.28, 'Phase 3': 0.44 },
  'Ophthalmology':                { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.33, 'Phase 2/3': 0.36, 'Phase 3': 0.52 },
  'Gastroenterology & Hepatology':{ 'Phase 1': 0.61, 'Phase 1/2': 0.61, 'Phase 2': 0.31, 'Phase 2/3': 0.34, 'Phase 3': 0.50 },
  'Nephrology & Renal':           { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.30, 'Phase 2/3': 0.33, 'Phase 3': 0.50 },
  'Musculoskeletal & Rheumatology':{ 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.32, 'Phase 2/3': 0.35, 'Phase 3': 0.50 },
  'Vaccines & Preventive':        { 'Phase 1': 0.70, 'Phase 1/2': 0.70, 'Phase 2': 0.45, 'Phase 2/3': 0.49, 'Phase 3': 0.65 },
  "Women's Health":               { 'Phase 1': 0.62, 'Phase 1/2': 0.62, 'Phase 2': 0.33, 'Phase 2/3': 0.36, 'Phase 3': 0.52 },
  'Pain & Anaesthesia':           { 'Phase 1': 0.58, 'Phase 1/2': 0.58, 'Phase 2': 0.28, 'Phase 2/3': 0.31, 'Phase 3': 0.46 },
  'Pediatrics':                   { 'Phase 1': 0.65, 'Phase 1/2': 0.65, 'Phase 2': 0.38, 'Phase 2/3': 0.42, 'Phase 3': 0.58 },
  'Dental & Oral Health':         { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.32, 'Phase 2/3': 0.35, 'Phase 3': 0.50 },
  'Urology':                      { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.30, 'Phase 2/3': 0.33, 'Phase 3': 0.48 },
  'Other':                        { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.30, 'Phase 2/3': 0.33, 'Phase 3': 0.50 },
};

export const PTS_BASE_DEFAULT: Record<string, number> = { 'Phase 1': 0.60, 'Phase 1/2': 0.60, 'Phase 2': 0.30, 'Phase 2/3': 0.33, 'Phase 3': 0.50 };

// === PRS Base Rates: NDA/BLA → Approval Rate by TA ===
// Source: BioQuill empirical data — 1,327 terminal molecules from 14,000-trial dataset
export const PRS_BASE_RATES: Record<string, { rate: number; asymmetric: boolean }> = {
  'Oncology & Hematology':        { rate: 0.89, asymmetric: true },
  'Dermatology':                  { rate: 0.79, asymmetric: false },
  'Endocrinology & Metabolism':   { rate: 0.78, asymmetric: false },
  'Immunology & Inflammation':    { rate: 0.75, asymmetric: false },
  'Vaccines & Preventive':        { rate: 0.75, asymmetric: false },
  'Respiratory & Pulmonary':      { rate: 0.65, asymmetric: false },
  'Neurology':                    { rate: 0.63, asymmetric: false },
  'Cardiovascular':               { rate: 0.58, asymmetric: false },
  "Women's Health":              { rate: 0.50, asymmetric: false },
  'Pain & Anaesthesia':            { rate: 0.50, asymmetric: false },
  'Psychiatry & Mental Health':   { rate: 0.47, asymmetric: false },
  'Nephrology & Renal':           { rate: 0.44, asymmetric: false },
  'Rare Disease & Orphan':        { rate: 0.44, asymmetric: false },
  'Gastroenterology & Hepatology':{ rate: 0.40, asymmetric: false },
  'Pediatrics':                   { rate: 0.50, asymmetric: false },
  'Infectious Disease':           { rate: 0.35, asymmetric: false },
  'Ophthalmology':                { rate: 0.16, asymmetric: false },
  'Musculoskeletal & Rheumatology':{ rate: 0.10, asymmetric: false },
  'Hematology (non-oncology)':    { rate: 0.10, asymmetric: false },
  'Dental & Oral Health':         { rate: 0.50, asymmetric: false },
  'Urology':                      { rate: 0.50, asymmetric: false },
  'Other':                        { rate: 0.38, asymmetric: false },
};

export const PRS_BASE_DEFAULT = { rate: 0.50, asymmetric: false };

// === Slider Modifier Functions ===

/** Convert slider 0-100 to multiplier. 50% = 1.00x (industry average). */
export const sliderToMultiplier = (sliderValue: number): number => {
  if (sliderValue <= 20) return 0.50;
  if (sliderValue <= 40) return 0.75;
  if (sliderValue <= 60) return 1.00;
  if (sliderValue <= 80) return 1.20;
  return 1.40;
};

/** Asymmetric PRS multiplier for high-base TAs (≥0.80). Limited upside room. */
export const sliderToMultiplierPRS = (sliderValue: number, baseRate: number): number => {
  if (baseRate >= 0.80) {
    if (sliderValue <= 20) return 0.60;
    if (sliderValue <= 40) return 0.80;
    if (sliderValue <= 60) return 1.00;
    if (sliderValue <= 80) return 1.05;
    return 1.08;
  }
  return sliderToMultiplier(sliderValue);
};

// === TA key mapping (short keys used in UI → full display names) ===
export const TA_KEY_TO_DISPLAY: Record<string, string> = {
  oncology: 'Oncology & Hematology',
  cns: 'Neurology',
  cardiovascular: 'Cardiovascular',
  infectious: 'Infectious Disease',
  immunology: 'Immunology & Inflammation',
  metabolic: 'Endocrinology & Metabolism',
  rareDisease: 'Rare Disease & Orphan',
  dermatology: 'Dermatology',
  respiratory: 'Respiratory & Pulmonary',
  psychiatry: 'Psychiatry & Mental Health',
  ophthalmology: 'Ophthalmology',
  gastroenterology: 'Gastroenterology & Hepatology',
  nephrology: 'Nephrology & Renal',
  musculoskeletal: 'Musculoskeletal & Rheumatology',
  vaccines: 'Vaccines & Preventive',
  womensHealth: "Women's Health",
  pain: 'Pain & Anaesthesia',
  pediatrics: 'Pediatrics',
  urology: 'Urology',
  other: 'Other',
};

// Phase key mapping (UI short keys → calibration keys)
export const PHASE_KEY_TO_CALIBRATION: Record<string, string> = {
  preclinical: 'Phase 1',
  phase1: 'Phase 1',
  'phase1/2': 'Phase 1/2',
  phase2: 'Phase 2',
  'phase2/3': 'Phase 2/3',
  phase3: 'Phase 3',
  nda: 'Phase 3',
  approved: 'Phase 3',
};

// === Core Calculation Functions ===

export interface PTRSSliders {
  mechanismNovelty: number;
  endpointClarity: number;
  priorTrialData: number;
  sponsorExperience: number;
  regulatoryPrecedent: number;
  safetyProfile: number;
}

export interface PTRSResult {
  pts: number;       // decimal 0-1
  prs: number;       // decimal 0-1
  ptrs: number;      // decimal 0-1
  pts_pct: number;   // percentage
  prs_pct: number;   // percentage
  ptrs_pct: number;  // percentage
  basePTS: number;   // base rate used
  basePRS: number;   // base rate used
  ptsModifier: number;
  prsModifier: number;
}

/**
 * Calculate PTS — Probability of Technical Success
 * = base_phase_transition_rate(TA, phase) × avg(slider multipliers)
 */
export const calculatePTS = (taDisplayName: string, phaseCalibrationKey: string, sliders: PTRSSliders): { pts: number; baseRate: number; modifier: number } => {
  const taRates = PTS_BASE_RATES[taDisplayName] || PTS_BASE_DEFAULT;
  const baseRate = taRates[phaseCalibrationKey] ?? 0.35;

  const modifier = (
    sliderToMultiplier(sliders.mechanismNovelty) +
    sliderToMultiplier(sliders.endpointClarity) +
    sliderToMultiplier(sliders.priorTrialData)
  ) / 3;

  const pts = Math.max(0.05, Math.min(0.95, baseRate * modifier));
  return { pts, baseRate, modifier };
};

/**
 * Calculate PRS — Probability of Regulatory Success
 * = base_nda_approval_rate(TA) × avg(slider multipliers, asymmetric if base ≥ 0.80)
 */
export const calculatePRS = (taDisplayName: string, sliders: PTRSSliders): { prs: number; baseRate: number; modifier: number } => {
  const prsData = PRS_BASE_RATES[taDisplayName] || PRS_BASE_DEFAULT;
  const baseRate = prsData.rate;

  const modifier = (
    sliderToMultiplierPRS(sliders.sponsorExperience, baseRate) +
    sliderToMultiplierPRS(sliders.regulatoryPrecedent, baseRate) +
    sliderToMultiplierPRS(sliders.safetyProfile, baseRate)
  ) / 3;

  const prs = Math.max(0.20, Math.min(0.98, baseRate * modifier));
  return { prs, baseRate, modifier };
};

/**
 * Calculate full PTRS = PTS × PRS
 * @param taKey - short key (e.g., 'oncology') or full display name
 * @param phaseKey - short key (e.g., 'phase2') or calibration key (e.g., 'Phase 2')
 */
export const calculatePTRS = (taKey: string, phaseKey: string, sliders: PTRSSliders): PTRSResult => {
  const taDisplay = TA_KEY_TO_DISPLAY[taKey] || taKey;
  const phaseCal = PHASE_KEY_TO_CALIBRATION[phaseKey] || phaseKey;

  const ptsResult = calculatePTS(taDisplay, phaseCal, sliders);
  const prsResult = calculatePRS(taDisplay, sliders);
  const ptrs = ptsResult.pts * prsResult.prs;

  return {
    pts: ptsResult.pts,
    prs: prsResult.prs,
    ptrs,
    pts_pct: +(ptsResult.pts * 100).toFixed(1),
    prs_pct: +(prsResult.prs * 100).toFixed(1),
    ptrs_pct: +(ptrs * 100).toFixed(1),
    basePTS: ptsResult.baseRate,
    basePRS: prsResult.baseRate,
    ptsModifier: +ptsResult.modifier.toFixed(3),
    prsModifier: +prsResult.modifier.toFixed(3),
  };
};

// === Monte Carlo Simulation (uncertainty propagated through INPUTS) ===

// Box-Muller standard normal
const randn = (): number => {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export interface PTRSMonteCarloConfig {
  iterations: number;
  uncertaintyPct: number; // e.g., 0.15 for ±15%
}

export interface PTRSMonteCarloResult {
  mean: number;
  median: number;
  stdDev: number;
  p5: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  p95: number;
  min: number;
  max: number;
  pGte10: number;
  pGte20: number;
  pGte40: number;
  distribution: number[]; // sorted full array for histogram
}

/**
 * Run Monte Carlo PTRS simulation by propagating uncertainty through each input independently.
 */
export const runPTRSMonteCarlo = (
  taKey: string,
  phaseKey: string,
  sliders: PTRSSliders,
  config: PTRSMonteCarloConfig = { iterations: 10000, uncertaintyPct: 0.15 }
): PTRSMonteCarloResult => {
  const taDisplay = TA_KEY_TO_DISPLAY[taKey] || taKey;
  const phaseCal = PHASE_KEY_TO_CALIBRATION[phaseKey] || phaseKey;
  const taRates = PTS_BASE_RATES[taDisplay] || PTS_BASE_DEFAULT;
  const basePTS = taRates[phaseCal] ?? 0.35;
  const prsData = PRS_BASE_RATES[taDisplay] || PRS_BASE_DEFAULT;
  const basePRS = prsData.rate;

  // Base rate uncertainty SDs (from literature)
  const pts_base_sd = basePTS * 0.12;
  const prs_base_sd = basePRS * 0.08;

  const { iterations, uncertaintyPct } = config;
  const results = new Float32Array(iterations);

  for (let i = 0; i < iterations; i++) {
    // Sample base transition rates (uncertain themselves)
    const sampledBasePTS = clamp(basePTS + randn() * pts_base_sd, 0.05, 0.95);
    const sampledBasePRS = clamp(basePRS + randn() * prs_base_sd, 0.10, 0.99);

    // Sample each slider with uncertainty
    const mn = clamp(sliders.mechanismNovelty / 100 + randn() * uncertaintyPct, 0, 1) * 100;
    const ec = clamp(sliders.endpointClarity / 100 + randn() * uncertaintyPct, 0, 1) * 100;
    const pd = clamp(sliders.priorTrialData / 100 + randn() * uncertaintyPct, 0, 1) * 100;
    const se = clamp(sliders.sponsorExperience / 100 + randn() * uncertaintyPct, 0, 1) * 100;
    const rp = clamp(sliders.regulatoryPrecedent / 100 + randn() * uncertaintyPct, 0, 1) * 100;
    const sp = clamp(sliders.safetyProfile / 100 + randn() * uncertaintyPct, 0, 1) * 100;

    // PTS for this sample
    const pts_mod = (sliderToMultiplier(mn) + sliderToMultiplier(ec) + sliderToMultiplier(pd)) / 3;
    const pts_s = clamp(sampledBasePTS * pts_mod, 0.03, 0.95);

    // PRS for this sample
    const prs_mod = (sliderToMultiplierPRS(se, sampledBasePRS) + sliderToMultiplierPRS(rp, sampledBasePRS) + sliderToMultiplierPRS(sp, sampledBasePRS)) / 3;
    const prs_s = clamp(sampledBasePRS * prs_mod, 0.10, 0.98);

    results[i] = pts_s * prs_s * 100;
  }

  const sorted = Array.from(results).sort((a, b) => a - b);
  const n = iterations;
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const median = sorted[Math.floor(n * 0.50)];
  const stdDev = Math.sqrt(sorted.reduce((acc, v) => acc + (v - mean) ** 2, 0) / n);

  return {
    mean: +mean.toFixed(2),
    median: +median.toFixed(2),
    stdDev: +stdDev.toFixed(2),
    p5: +sorted[Math.floor(n * 0.05)].toFixed(1),
    p10: +sorted[Math.floor(n * 0.10)].toFixed(1),
    p25: +sorted[Math.floor(n * 0.25)].toFixed(1),
    p75: +sorted[Math.floor(n * 0.75)].toFixed(1),
    p90: +sorted[Math.floor(n * 0.90)].toFixed(1),
    p95: +sorted[Math.floor(n * 0.95)].toFixed(1),
    min: +sorted[0].toFixed(2),
    max: +sorted[n - 1].toFixed(2),
    pGte10: +((sorted.filter(v => v >= 10).length / n) * 100).toFixed(1),
    pGte20: +((sorted.filter(v => v >= 20).length / n) * 100).toFixed(1),
    pGte40: +((sorted.filter(v => v >= 40).length / n) * 100).toFixed(1),
    distribution: sorted,
  };
};

// === Histogram helper ===
export interface PTRSHistogramBin {
  range: string;
  midpoint: number;
  count: number;
  percentage: number;
  minValue: number;
  maxValue: number;
}

export const createPTRSHistogram = (distribution: number[], binCount = 20): PTRSHistogramBin[] => {
  const min = distribution[0];
  const max = distribution[distribution.length - 1];
  const binWidth = (max - min) / binCount;
  const n = distribution.length;

  const bins: PTRSHistogramBin[] = [];
  for (let i = 0; i < binCount; i++) {
    const minVal = min + i * binWidth;
    const maxVal = min + (i + 1) * binWidth;
    const count = distribution.filter(v => v >= minVal && (i === binCount - 1 ? v <= maxVal : v < maxVal)).length;
    bins.push({
      range: `${minVal.toFixed(1)}% – ${maxVal.toFixed(1)}%`,
      midpoint: (minVal + maxVal) / 2,
      count,
      percentage: +(count / n * 100).toFixed(1),
      minValue: minVal,
      maxValue: maxVal,
    });
  }
  return bins;
};
