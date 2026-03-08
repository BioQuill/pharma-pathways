import { useState, useEffect, useRef } from 'react';
import { type MoleculeProfile } from '@/lib/moleculesData';
import { canonicalizeTA } from '@/lib/taCanonical';
import {
  calculateProbabilityScores,
  generateMarketProjections,
  calculateOverallScore,
  normalizeTherapeuticArea,
  TA_MAX_TTM,
  computeLPI,
} from '@/lib/scoring';
import { generateLaunchFactors } from '@/lib/launchFactors';
import { getManufacturingCapability } from '@/lib/manufacturingCapability';

const DATA_URL =
  'https://raw.githubusercontent.com/BioQuill/pharma-pathways/refs/heads/main/molecules_master.min.json';

// Session-level cache so we never re-fetch
let cachedMolecules: MoleculeProfile[] | null = null;
let fetchPromise: Promise<MoleculeProfile[]> | null = null;

// TA normalisation — delegate to central canonical mapper
const TA_CANONICAL: Record<string, string> = {};
// All mapping is handled by canonicalizeTA()

// Phase normalisation map
const PHASE_CANONICAL: Record<string, string> = {
  'PHASE3': 'Phase 3',
  'PHASE2': 'Phase 2',
  'PHASE1': 'Phase 1',
};

/** Map the real JSON phase strings to the keys used by scoring models */
function normalizePhase(raw: string): string {
  if (!raw) return 'Phase II';
  const p = raw.trim();
  // Apply canonical phase normalisation first
  if (PHASE_CANONICAL[p]) return normalizePhase(PHASE_CANONICAL[p]);
  if (/phase\s*1\/2/i.test(p)) return 'Phase I/II';
  if (/phase\s*2\/3/i.test(p)) return 'Phase II/III';
  if (/phase\s*1/i.test(p) && !/phase\s*1\//i.test(p)) return 'Phase I';
  if (/phase\s*2/i.test(p) && !/phase\s*2\//i.test(p)) return 'Phase II';
  if (/phase\s*3/i.test(p)) return 'Phase III';
  if (/phase\s*4/i.test(p)) return 'Phase III';
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

/** Map real JSON TA values to canonical display names */
function mapTherapeuticArea(ta: string): string {
  if (!ta) return 'Other';
  return canonicalizeTA(ta);
}

/** Determine approval_status from raw molecule data */
function determineApprovalStatus(raw: any): string {
  // If the JSON already has approval_status, use it
  if (raw.approval_status) return raw.approval_status;
  
  const status = (raw.status || '').toUpperCase();
  const phase = (raw.phase || '').toLowerCase();
  const completionDate = raw.completion_date ? new Date(raw.completion_date) : null;
  const now = new Date();
  const monthsAgo = completionDate ? Math.round((now.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)) : null;
  
  if (status === 'APPROVED' || phase.includes('approved')) return 'APPROVED_2024';
  
  if (phase.includes('phase 3') || phase.includes('phase iii')) {
    if (status === 'COMPLETED') {
      if (monthsAgo !== null && monthsAgo <= 12) return 'LIKELY_IN_REVIEW';
      if (monthsAgo !== null && monthsAgo <= 24) return 'RECENTLY_COMPLETED_PH3';
      return 'COMPLETED_PH3';
    }
  }
  
  if ((phase.includes('phase 2') || phase.includes('phase ii')) && status === 'COMPLETED') {
    return 'COMPLETED_PH2';
  }
  
  return 'ACTIVE_PIPELINE';
}

/** Determine model_applicability from approval_status */
function determineModelApplicability(approvalStatus: string): string {
  if (approvalStatus.startsWith('APPROVED_')) return 'POST_APPROVAL';
  if (approvalStatus === 'LIKELY_IN_REVIEW') return 'NDA_FILED';
  if (approvalStatus === 'RECENTLY_COMPLETED_PH3') return 'COMPLETED_PH3_RECENT';
  if (approvalStatus === 'COMPLETED_PH3' || approvalStatus === 'COMPLETED_PH3_HISTORICAL') return 'COMPLETED_PH3_HISTORICAL';
  if (approvalStatus === 'COMPLETED_PH2' || approvalStatus === 'RECENTLY_COMPLETED_PH2') return 'COMPLETED_PH2';
  return 'FULL';
}

// Score recalibration: base scores by phase
const BASE_SCORES_BY_PHASE: Record<string, number> = {
  'Phase I': 35,
  'Phase I/II': 42,
  'Phase II': 52,
  'Phase II/III': 60,
  'Phase III': 68,
  'NDA/BLA': 78,
  'Approved': 90,
};

// Sponsor quality tiers
const TOP20_PHARMA = [
  'pfizer', 'johnson & johnson', 'roche', 'novartis', 'merck', 'abbvie',
  'bristol-myers squibb', 'astrazeneca', 'sanofi', 'gsk', 'eli lilly',
  'novo nordisk', 'gilead', 'amgen', 'regeneron', 'bayer', 'takeda',
  'boehringer ingelheim', 'biogen', 'moderna',
];

/** Calculate recalibrated BQ Pipeline Score */
function calculateRecalibratedScore(phase: string, ta: string, sponsor: string): number {
  let score = BASE_SCORES_BY_PHASE[phase] || 52;
  
  // TA maturity adjustments
  const taLower = ta.toLowerCase();
  if (taLower.includes('oncology') || taLower.includes('hematology')) score += 10;
  else if (taLower.includes('immunology') || taLower.includes('inflammation')) score += 10;
  else if (taLower.includes('endocrinology') || taLower.includes('metabol')) score += 10;
  else if (taLower.includes('infectious')) score += 8;
  else if (taLower.includes('rare') || taLower.includes('orphan')) score += 5;
  
  // Sponsor quality
  const sponsorLower = sponsor.toLowerCase();
  if (TOP20_PHARMA.some(p => sponsorLower.includes(p))) score += 10;
  else if (sponsorLower.includes('university') || sponsorLower.includes('hospital') || sponsorLower.includes('institute')) score -= 5;
  else score += 5; // mid-size biotech
  
  return Math.max(0, Math.min(100, score));
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

  // Compute LPI using the 6-category XGBoost-inspired model
  const lpiResult = isFailed
    ? { score: 0, ci: '0%-0%', ciLow: 0, ciHigh: 0, label: 'Low' as const, breakdown: { clinical: 0, scientific: 0, regulatory: 0, sponsor: 0, market: 0, safety: 0 } }
    : computeLPI({
        phase: raw.phase,
        has_results: raw.has_results,
        status: raw.status,
        approval_status: approvalStatus,
        sponsor: raw.sponsor,
        therapeutic_area: raw.therapeutic_area,
        study_title: raw.study_title,
        brief_summary: raw.brief_summary,
        conditions: raw.conditions,
      });
  const recalibratedScore = lpiResult.score;

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
  
  // Determine approval status and model applicability
  const approvalStatus = determineApprovalStatus(raw);
  const modelApplicability = determineModelApplicability(approvalStatus);

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
    overallScore: recalibratedScore, // Use recalibrated score
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
      approval_status: approvalStatus,
      model_applicability: modelApplicability,
    },
  } as MoleculeProfile & { _raw: any };
}

/** Deduplicate molecules by primary_drug + sponsor, keeping most advanced phase */
function deduplicateMolecules(molecules: MoleculeProfile[]): MoleculeProfile[] {
  const phaseOrder: Record<string, number> = {
    'Phase I': 1, 'Phase I/II': 1.5, 'Phase II': 2, 'Phase II/III': 2.5,
    'Phase III': 3, 'NDA/BLA': 4, 'Approved': 5,
  };
  
  const map: Record<string, MoleculeProfile> = {};
  
  for (const mol of molecules) {
    const key = `${mol.name?.toLowerCase().trim()}_${mol.company?.toLowerCase().trim()}`;
    const existing = map[key];
    if (!existing) {
      map[key] = mol;
    } else {
      const newPhaseVal = phaseOrder[mol.phase] || 0;
      const existPhaseVal = phaseOrder[existing.phase] || 0;
      if (newPhaseVal > existPhaseVal) {
        map[key] = { ...mol, indication: `${mol.indication}, ${existing.indication}` };
      } else {
        map[key] = { ...existing, indication: `${existing.indication}, ${mol.indication}` };
      }
    }
  }
  
  return Object.values(map);
}

async function doFetch(): Promise<MoleculeProfile[]> {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const rawList: any[] = json.molecules ?? json.data?.molecules ?? (Array.isArray(json) ? json : []);
  const allMolecules = rawList.map((m, i) => transformMolecule(m, i));
  return allMolecules; // One card per NCT — no deduplication
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
        fetchPromise = null;
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

/** Canonical TA list for dropdowns — matches the 20 official names exactly */
export { CANONICAL_TAS as CANONICAL_TA_LIST } from '@/lib/taCanonical';
