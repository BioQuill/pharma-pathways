// BioQuill CAPM Alpha Signals Model
// Adapted from bioquill_capm_model.json

export const RF = 0.104; // 10.4% all-TA 20-year realised LOA baseline

export const RM_BY_TA: Record<string, { Rm: number; n_historical: number }> = {
  "Rare Disease & Orphan": { Rm: 0.21, n_historical: 131 },
  "Vaccines & Preventive": { Rm: 0.184, n_historical: 11 },
  "Infectious Disease": { Rm: 0.174, n_historical: 672 },
  "Dermatology": { Rm: 0.144, n_historical: 147 },
  "Pediatrics": { Rm: 0.126, n_historical: 23 },
  "Hematology (non-oncology)": { Rm: 0.121, n_historical: 32 },
  "Cardiovascular": { Rm: 0.116, n_historical: 368 },
  "Immunology & Inflammation": { Rm: 0.115, n_historical: 404 },
  "Endocrinology & Metabolism": { Rm: 0.102, n_historical: 321 },
  "Respiratory & Pulmonary": { Rm: 0.089, n_historical: 209 },
  "Women's Health": { Rm: 0.089, n_historical: 35 },
  "Oncology & Hematology": { Rm: 0.086, n_historical: 4515 },
  "Ophthalmology": { Rm: 0.086, n_historical: 238 },
  "Musculoskeletal & Rheumatology": { Rm: 0.079, n_historical: 82 },
  "Gastroenterology & Hepatology": { Rm: 0.079, n_historical: 75 },
  "Nephrology & Renal": { Rm: 0.074, n_historical: 127 },
  "Urology": { Rm: 0.074, n_historical: 11 },
  "Neurology": { Rm: 0.066, n_historical: 504 },
  "Pain & Anaesthesia": { Rm: 0.06, n_historical: 28 },
  "Psychiatry & Mental Health": { Rm: 0.048, n_historical: 160 },
};

export const PIPELINE_BENCHMARKS: Record<string, { mean_ptrs: number; median_ptrs: number; std: number; n: number }> = {
  "Oncology & Hematology": { mean_ptrs: 0.1878, median_ptrs: 0.157, std: 0.117, n: 7321 },
  "Rare Disease & Orphan": { mean_ptrs: 0.4983, median_ptrs: 0.361, std: 0.166, n: 162 },
  "Infectious Disease": { mean_ptrs: 0.4298, median_ptrs: 0.312, std: 0.202, n: 766 },
  "Immunology & Inflammation": { mean_ptrs: 0.3132, median_ptrs: 0.22, std: 0.169, n: 627 },
  "Neurology": { mean_ptrs: 0.219, median_ptrs: 0.125, std: 0.129, n: 631 },
  "Cardiovascular": { mean_ptrs: 0.3558, median_ptrs: 0.228, std: 0.169, n: 441 },
  "Endocrinology & Metabolism": { mean_ptrs: 0.2845, median_ptrs: 0.196, std: 0.159, n: 460 },
  "Respiratory & Pulmonary": { mean_ptrs: 0.2632, median_ptrs: 0.168, std: 0.144, n: 287 },
  "Dermatology": { mean_ptrs: 0.4369, median_ptrs: 0.598, std: 0.174, n: 211 },
  "Psychiatry & Mental Health": { mean_ptrs: 0.1759, median_ptrs: 0.093, std: 0.102, n: 225 },
  "Ophthalmology": { mean_ptrs: 0.2376, median_ptrs: 0.162, std: 0.123, n: 276 },
  "Nephrology & Renal": { mean_ptrs: 0.2162, median_ptrs: 0.143, std: 0.128, n: 166 },
  "Musculoskeletal": { mean_ptrs: 0.2653, median_ptrs: 0.152, std: 0.139, n: 127 },
  "Gastroenterology & Hepatology": { mean_ptrs: 0.2517, median_ptrs: 0.152, std: 0.136, n: 88 },
  "Hematology (non-oncology)": { mean_ptrs: 0.42, median_ptrs: 0.534, std: 0.15, n: 32 },
  "Pain & Anesthesia": { mean_ptrs: 0.2193, median_ptrs: 0.116, std: 0.114, n: 39 },
  "Womens Health & Reproductive": { mean_ptrs: 0.3193, median_ptrs: 0.445, std: 0.151, n: 45 },
  "Vaccines & Preventive": { mean_ptrs: 0.2103, median_ptrs: 0.184, std: 0.11, n: 222 },
  "Pediatrics": { mean_ptrs: 0.4493, median_ptrs: 0.562, std: 0.158, n: 23 },
  "Urology": { mean_ptrs: 0.1748, median_ptrs: 0.143, std: 0.108, n: 11 },
};

// Beta estimation rules
export type MechanismType = 'first_in_class' | 'best_in_class' | 'follow_on';
export type DesignationType = 'breakthrough' | 'orphan' | 'fast_track' | 'accelerated' | 'none';
export type SponsorTier = 'top_20_pharma' | 'mid_size_biotech' | 'small_biotech' | 'academic';
export type PriorData = 'strong_poc' | 'mixed_results' | 'no_prior' | 'failed_retrying';
export type PhaseKey = 'Phase 1' | 'Phase 1/2' | 'Phase 2' | 'Phase 2/3' | 'Phase 3';

const MECHANISM_ADJ: Record<MechanismType, number> = {
  first_in_class: 0.3, best_in_class: 0.1, follow_on: -0.2,
};
const DESIGNATION_ADJ: Record<DesignationType, number> = {
  breakthrough: -0.25, orphan: -0.2, fast_track: -0.1, accelerated: -0.15, none: 0,
};
const SPONSOR_ADJ: Record<SponsorTier, number> = {
  top_20_pharma: -0.2, mid_size_biotech: -0.05, small_biotech: 0.15, academic: 0.25,
};
const PHASE_ADJ: Record<string, number> = {
  'Phase 1': 0.2, 'Phase 1/2': 0.1, 'Phase 2': 0, 'Phase 2/3': -0.1, 'Phase 3': -0.2,
};
const PRIOR_ADJ: Record<PriorData, number> = {
  strong_poc: -0.2, mixed_results: 0.15, no_prior: 0.2, failed_retrying: 0.35,
};

export interface BetaInputs {
  mechanism: MechanismType;
  designation: DesignationType;
  sponsorTier: SponsorTier;
  phase: string;
  priorData: PriorData;
}

export interface CAPMResult {
  beta: number;
  expectedReturn: number;
  alpha1: number;
  alpha2: number;
  deltaAlpha: number;
  Rf: number;
  Rm: number;
  pipelineMeanPTRS: number;
}

export function estimateBeta(inputs: BetaInputs): number {
  const phaseAdj = PHASE_ADJ[inputs.phase] ?? 0;
  const raw = 1.0 + MECHANISM_ADJ[inputs.mechanism] + DESIGNATION_ADJ[inputs.designation] +
    SPONSOR_ADJ[inputs.sponsorTier] + phaseAdj + PRIOR_ADJ[inputs.priorData];
  return Math.max(0.2, Math.min(2.5, Math.round(raw * 100) / 100));
}

export function mapTAToRmKey(ta: string): string {
  const taLower = ta.toLowerCase();
  if (taLower.includes("oncology") || (taLower.includes("hematology") && taLower.includes("oncology"))) return "Oncology & Hematology";
  if (taLower.includes("hematology")) return "Hematology (non-oncology)";
  if (taLower.includes("rare") || taLower.includes("orphan")) return "Rare Disease & Orphan";
  if (taLower.includes("vaccin")) return "Vaccines & Preventive";
  if (taLower.includes("infectious")) return "Infectious Disease";
  if (taLower.includes("derma")) return "Dermatology";
  if (taLower.includes("pediatr")) return "Pediatrics";
  if (taLower.includes("cardio")) return "Cardiovascular";
  if (taLower.includes("immun")) return "Immunology & Inflammation";
  if (taLower.includes("endocr") || taLower.includes("metabol") || taLower.includes("diabet") || taLower.includes("obes")) return "Endocrinology & Metabolism";
  if (taLower.includes("respir") || taLower.includes("pulmon")) return "Respiratory & Pulmonary";
  if (taLower.includes("women") || taLower.includes("reprod")) return "Womens Health & Reproductive";
  if (taLower.includes("ophthalm")) return "Ophthalmology";
  if (taLower.includes("musculo") || taLower.includes("orthop")) return "Musculoskeletal";
  if (taLower.includes("gastro") || taLower.includes("hepat")) return "Gastroenterology & Hepatology";
  if (taLower.includes("nephro") || taLower.includes("renal")) return "Nephrology & Renal";
  if (taLower.includes("urolog")) return "Urology";
  if (taLower.includes("neuro") || taLower.includes("cns")) return "Neurology";
  if (taLower.includes("pain") || taLower.includes("anesth")) return "Pain & Anesthesia";
  if (taLower.includes("psych") || taLower.includes("mental")) return "Psychiatry & Mental Health";
  return "Oncology & Hematology"; // default
}

export function calculateCAPM(ta: string, actualPTRS: number, betaInputs: BetaInputs): CAPMResult {
  const taKey = mapTAToRmKey(ta);
  const rmData = RM_BY_TA[taKey] || { Rm: 0.104 };
  const pipelineData = PIPELINE_BENCHMARKS[taKey] || { mean_ptrs: 0.20 };
  
  const beta = estimateBeta(betaInputs);
  const Rm = rmData.Rm;
  const expectedReturn = RF + beta * (Rm - RF);
  
  const alpha1 = actualPTRS - expectedReturn;
  const alpha2 = actualPTRS - pipelineData.mean_ptrs;
  const deltaAlpha = alpha1 - alpha2;
  
  return {
    beta,
    expectedReturn,
    alpha1,
    alpha2,
    deltaAlpha,
    Rf: RF,
    Rm,
    pipelineMeanPTRS: pipelineData.mean_ptrs,
  };
}

export function getAlphaColor(alpha: number): string {
  if (alpha > 0.05) return "#22c55e";
  if (alpha > 0) return "#86efac";
  if (alpha > -0.05) return "#f59e0b";
  return "#dc2626";
}

export function getAlphaLabel(alpha: number): string {
  if (alpha > 0.05) return "Strongly Positive";
  if (alpha > 0) return "Positive";
  if (alpha > -0.05) return "Neutral";
  if (alpha > -0.10) return "Negative";
  return "Strongly Negative";
}
