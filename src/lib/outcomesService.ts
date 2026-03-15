const OUTCOMES_URL =
  'https://raw.githubusercontent.com/BioQuill/pharma-pathways/refs/heads/main/molecules_outcomes.min.json';

interface OutcomeRow {
  nct_id: string;
  primary_drug: string;
  primary_outcome: string;
}

let cachedOutcomes: Map<string, OutcomeRow> | null = null;
let fetchPromise: Promise<Map<string, OutcomeRow>> | null = null;

async function loadOutcomes(): Promise<Map<string, OutcomeRow>> {
  const res = await fetch(OUTCOMES_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rows: OutcomeRow[] = json.outcomes ?? json.data?.outcomes ?? (Array.isArray(json) ? json : []);
  const map = new Map<string, OutcomeRow>();
  for (const row of rows) {
    if (row.nct_id) map.set(row.nct_id.trim(), row);
  }
  return map;
}

/**
 * Lazy-load outcomes and return the primary_outcome for a given molecule.
 * Fetches the full outcomes JSON on first call, caches for subsequent calls.
 */
export async function getOutcomeForMolecule(
  nct_id: string,
  primary_drug: string,
): Promise<string | null> {
  if (!cachedOutcomes) {
    if (!fetchPromise) fetchPromise = loadOutcomes();
    try {
      cachedOutcomes = await fetchPromise;
    } catch (err) {
      fetchPromise = null;
      throw err;
    }
  }

  const row = cachedOutcomes.get(nct_id.trim());
  if (!row) return null;

  // Cross-check primary_drug
  if (row.primary_drug?.trim().toLowerCase() !== primary_drug?.trim().toLowerCase()) {
    console.warn(
      `[outcomesService] primary_drug mismatch for ${nct_id}: expected "${primary_drug}", got "${row.primary_drug}"`,
    );
  }

  return row.primary_outcome || null;
}
