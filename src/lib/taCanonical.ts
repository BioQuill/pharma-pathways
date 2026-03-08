/**
 * Single source of truth for all 20 canonical Therapeutic Area names.
 * Every UI label, filter, dictionary key, and normaliser must use these exact strings.
 */

export const CANONICAL_TAS = [
  'Oncology & Hematology',
  'Hematology (non-oncology)',
  'Rare Disease & Orphan',
  'Immunology & Inflammation',
  'Endocrinology & Metabolism',
  'Cardiovascular',
  'Neurology',
  'Respiratory & Pulmonary',
  'Infectious Disease',
  'Gastroenterology & Hepatology',
  'Nephrology & Renal',
  'Psychiatry & Mental Health',
  'Dermatology',
  'Musculoskeletal & Rheumatology',
  'Ophthalmology',
  "Women's Health",
  'Pain & Anaesthesia',
  'Pediatrics',
  'Vaccines & Preventive',
  'Urology',
] as const;

export type CanonicalTA = (typeof CANONICAL_TAS)[number];

/** UPPERCASE versions of the canonical names, used as internal dictionary keys */
export const CANONICAL_TA_KEYS = CANONICAL_TAS.map(t => t.toUpperCase());

/**
 * Maps any known TA string variant (display or internal) to its canonical display name.
 * Returns 'Other' for unrecognised inputs.
 */
export function canonicalizeTA(raw: string): string {
  if (!raw) return 'Other';
  const s = raw.trim();

  // Exact match first (fast path)
  if ((CANONICAL_TAS as readonly string[]).includes(s)) return s;

  const lower = s.toLowerCase();

  // --- Oncology must be checked before standalone "hematology" ---
  if (lower.includes('oncology') || (lower.includes('hematology') && !lower.includes('non-oncology') && !lower.includes('(non'))) {
    return 'Oncology & Hematology';
  }
  if (lower.includes('hematology')) return 'Hematology (non-oncology)';

  // Transplant → Hematology (non-oncology) per canonical mapping
  if (lower.includes('transplant') || (lower.includes('cell') && lower.includes('gene'))) {
    return 'Hematology (non-oncology)';
  }

  if (lower.includes('rare') || lower.includes('orphan')) return 'Rare Disease & Orphan';
  if (lower.includes('immun') || lower.includes('inflam')) return 'Immunology & Inflammation';
  if (lower.includes('metabol') || lower.includes('diabet') || lower.includes('endocrin') || lower.includes('obesity')) {
    return 'Endocrinology & Metabolism';
  }
  if (lower.includes('cardio') || lower.includes('heart')) return 'Cardiovascular';

  // Neurology must come before psychiatry (both could match 'mental')
  if (lower.includes('neuro') || lower.includes('cns') || lower.includes('alzheimer')) return 'Neurology';
  if (lower.includes('psych') || lower.includes('mental')) return 'Psychiatry & Mental Health';

  if (lower.includes('respir') || lower.includes('pulmon') || lower.includes('lung')) return 'Respiratory & Pulmonary';
  if (lower.includes('infect') || lower.includes('virus') || lower.includes('bacter')) return 'Infectious Disease';
  if (lower.includes('gastro') || lower.includes('hepat') || lower.includes('liver')) return 'Gastroenterology & Hepatology';
  if (lower.includes('nephro') || lower.includes('renal') || lower.includes('kidney')) return 'Nephrology & Renal';
  if (lower.includes('derma') || lower.includes('skin')) return 'Dermatology';
  if (lower.includes('musculo') || lower.includes('rheum') || lower.includes('arthritis') || lower.includes('orthop')) {
    return 'Musculoskeletal & Rheumatology';
  }
  if (lower.includes('ophthal') || lower.includes('eye')) return 'Ophthalmology';
  if (lower.includes('women') || lower.includes('gynec') || lower.includes('obstet') || lower.includes('reprod')) {
    return "Women's Health";
  }
  if (lower.includes('pain') || lower.includes('anesth')) return 'Pain & Anaesthesia';
  if (lower.includes('pediatr') || lower.includes('child')) return 'Pediatrics';
  if (lower.includes('vaccin') || lower.includes('virol') || lower.includes('prevent')) return 'Vaccines & Preventive';
  if (lower.includes('urol') || lower.includes('prostat')) return 'Urology';
  if (lower.includes('dental') || lower.includes('oral health')) return 'Other';

  return 'Other';
}

/**
 * Returns the UPPERCASE canonical key for use in scoring dictionaries.
 * Falls back to 'GENERAL' for unrecognised inputs.
 */
export function canonicalizeTAKey(raw: string): string {
  const canonical = canonicalizeTA(raw);
  if (canonical === 'Other') return 'GENERAL';
  return canonical.toUpperCase();
}
