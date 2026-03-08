/**
 * Curated set of 40 demo molecules (2 per therapeutic area, all phases).
 * Matched by primary_drug name (case-insensitive substring match).
 * Designed for zero-coupling removal — delete this file + the TEST ME tab reference.
 */
export const DEMO_MOLECULE_NAMES: string[] = [
  // Oncology & Hematology
  'osimertinib',
  'trastuzumab deruxtecan',
  // Hematology (non-oncology)
  'fitusiran',
  'iptacopan',
  // Rare Disease & Orphan
  'ataluren',
  'srp-9001',
  // Immunology & Inflammation
  'bimekizumab',
  'spesolimab',
  // Endocrinology & Metabolism
  'retatrutide',
  'eloralintide',
  // Cardiovascular
  'zilebesiran',
  'milvexian',
  // Neurology
  'lecanemab',
  'donanemab',
  // Respiratory & Pulmonary
  'tezepelumab',
  'itepekimab',
  // Infectious Disease
  'lenacapavir',
  'nirsevimab',
  // Gastroenterology & Hepatology
  'obeticholic acid',
  'resmetirom',
  // Nephrology & Renal
  'sparsentan',
  'avacopan',
  // Psychiatry & Mental Health
  'zuranolone',
  'emraclidine',
  // Dermatology
  'lebrikizumab',
  'povorcitinib',
  // Musculoskeletal & Rheumatology
  'upadacitinib',
  'izokibep',
  // Ophthalmology
  'faricimab',
  'ixoberogene soroparvovec',
  // Women's Health
  'elinzanetant',
  'fezolinetant',
  // Pain & Anaesthesia
  'suzetrigine',
  'zavegepant',
  // Pediatrics
  'maribavir',
  'nusinersen',
  // Vaccines & Preventive
  'mrna-1345',
  'mresvia',
  'v116',
  // Urology
  'vibegron',
  'cimetapib',
];

/**
 * Check if a molecule matches the demo set.
 * Uses case-insensitive substring matching on the drug name.
 */
export function isDemoMolecule(drugName: string): boolean {
  const lower = drugName.toLowerCase();
  return DEMO_MOLECULE_NAMES.some(demo => lower.includes(demo) || demo.includes(lower));
}
