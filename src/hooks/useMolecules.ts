import { useState, useEffect, useRef } from 'react';
import { type MoleculeProfile } from '@/lib/moleculesData';
import {
  calculateProbabilityScores,
  generateMarketProjections,
  calculateOverallScore,
  normalizeTherapeuticArea,
  TA_MAX_TTM,
} from '@/lib/scoring';
import { generateLaunchFactors } from '@/lib/launchFactors';
import { getManufacturingCapability } from '@/lib/manufacturingCapability';

const DATA_URL =
  'https://raw.githubusercontent.com/BioQuill/pharma-pathways/refs/heads/main/molecules_master.min.json';

// Session-level cache so we never re-fetch
let cachedMolecules: MoleculeProfile[] | null = null;
let fetchPromise: Promise<MoleculeProfile[]> | null = null;

/** Map the real JSON phase strings to the keys used by scoring models */
function normalizePhase(raw: string): string {
  if (!raw) return 'Phase II';
  const p = raw.trim();
  if (/phase\s*1\/2/i.test(p)) return 'Phase I/II';
  if (/phase\s*2\/3/i.test(p)) return 'Phase II/III';
  if (/phase\s*1/i.test(p) && !/phase\s*1\//i.test(p)) return 'Phase I';
  if (/phase\s*2/i.test(p) && !/phase\s*2\//i.test(p)) return 'Phase II';
  if (/phase\s*3/i.test(p)) return 'Phase III';
  if (/phase\s*4/i.test(p)) return 'Phase III'; // treat Phase 4 as post-approval
  if (/nda|bla|pre-registration/i.test(p)) return 'NDA/BLA';
  if (/approved/i.test(p)) return 'Approved';
  if (/early\s*phase/i.test(p)) return 'Phase I';
  return 'Phase II';
}

/** Guess company speed from name heuristics */
function guessTrackRecord(sponsor: string): 'fast' | 'average' | 'slow' {
  const fast = [
    'Pfizer', 'Johnson & Johnson', 'Roche', 'Novartis', 'Merck', 'AbbVie',
    'Bristol-Myers Squibb', 'AstraZeneca', 'Sanofi', 'GSK', 'Eli Lilly',
    'Novo Nordisk', 'Gilead', 'Amgen', 'Regeneron',
  ];
  const s = sponsor.toLowerCase();
  if (fast.some(c => s.includes(c.toLowerCase()))) return 'fast';
  if (s.includes('university') || s.includes('hospital') || s.includes('institute')) return 'slow';
  return 'average';
}

/** Map real JSON TA values to normalised scoring TA keys */
function mapTherapeuticArea(ta: string): string {
  if (!ta) return 'Other';
  // normalizeTherapeuticArea in scoring.ts already handles mapping;
  // but we also want a display-friendly value
  return ta;
}

/** Convert a single raw molecule record from the JSON to a MoleculeProfile */
function transformMolecule(raw: any, index: number): MoleculeProfile {
  const phase = normalizePhase(raw.phase || '');
  const ta = mapTherapeuticArea(raw.therapeutic_area || 'Other');
  const company = raw.sponsor || 'Unknown';
  const trackRecord = guessTrackRecord(company);
  const indication = raw.conditions || raw.primary_drug || '';
  const isFailed = raw.status === 'TERMINATED' || raw.status === 'WITHDRAWN';

  const scores = calculateProbabilityScores(phase, indication, ta, isFailed);
  const marketData = generateMarketProjections(
    raw.primary_drug || `mol-${index}`,
    phase,
    indication,
    trackRecord,
    isFailed,
  );

  const launchFactors = generateLaunchFactors(phase, ta, trackRecord, isFailed);
  const mfg = getManufacturingCapability(company);
  const overallScore = calculateOverallScore(scores, marketData, phase, ta, mfg.scaleUpIndex);

  // Compute elapsed months from start_date for LPI signal
  let elapsedMonths = 0;
  if (raw.start_date) {
    const start = new Date(raw.start_date);
    if (!isNaN(start.getTime())) {
      elapsedMonths = Math.max(0, Math.round((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    }
  }

  const normalizedTA = normalizeTherapeuticArea(ta);
  const taBenchmark = TA_MAX_TTM[normalizedTA] || TA_MAX_TTM['GENERAL'];
  const lpiFromElapsed = Math.min(100, Math.round((elapsedMonths / taBenchmark) * 100));

  return {
    id: raw.nct_id || `real-${index}`,
    name: raw.primary_drug || `Molecule ${index + 1}`,
    phase,
    indication,
    therapeuticArea: ta,
    company,
    companyTrackRecord: trackRecord,
    isFailed,
    nctId: raw.nct_id || undefined,
    clinicalTrialsSearchTerm: raw.primary_drug || undefined,
    scores,
    marketData,
    overallScore,
    launchFactors,
    trialName: raw.study_title || undefined,
    drugInfo: {
      class: raw.interventions || 'Unknown',
      administration: 'Unknown',
      keyAdvantage: raw.primary_outcome || '',
    },
    patents: [],
    competitiveLandscape: undefined,
    retrospectivePhases: [],
    // Attach raw fields for display
    _raw: {
      status: raw.status,
      has_results: raw.has_results,
      primary_purpose: raw.primary_purpose,
      sex: raw.sex,
      age_group: raw.age_group,
      start_date: raw.start_date,
      completion_date: raw.completion_date,
      last_updated: raw.last_updated,
      study_url: raw.study_url,
      brief_summary: raw.brief_summary,
      nct_id: raw.nct_id,
      lpi_from_elapsed: lpiFromElapsed,
      elapsed_months: elapsedMonths,
      ta_benchmark: taBenchmark,
    },
  } as MoleculeProfile & { _raw: any };
}

async function doFetch(): Promise<MoleculeProfile[]> {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rawList: any[] = json.molecules ?? json.data?.molecules ?? (Array.isArray(json) ? json : []);
  return rawList.map((m, i) => transformMolecule(m, i));
}

export function useMolecules() {
  const [molecules, setMolecules] = useState<MoleculeProfile[]>(cachedMolecules || []);
  const [loading, setLoading] = useState(!cachedMolecules);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cachedMolecules) {
      setMolecules(cachedMolecules);
      setLoading(false);
      return;
    }
    if (!fetchPromise) {
      fetchPromise = doFetch();
    }
    fetchPromise
      .then(data => {
        cachedMolecules = data;
        if (mounted.current) {
          setMolecules(data);
          setLoading(false);
        }
      })
      .catch(err => {
        fetchPromise = null; // allow retry
        if (mounted.current) {
          setError(err.message || 'Failed to load molecules');
          setLoading(false);
        }
      });
    return () => { mounted.current = false; };
  }, []);

  return { molecules, loading, error };
}

/**
 * Synchronous accessor for components that used getAllMolecules().
 * Returns cached molecules or empty array if not yet loaded.
 */
export function getCachedMolecules(): MoleculeProfile[] {
  return cachedMolecules || [];
}
