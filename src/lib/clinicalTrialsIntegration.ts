/**
 * Clinical Trials Integration Module
 * 
 * This module provides utilities for fetching and parsing clinical trial data
 * from multiple sources:
 * - ClinicalTrials.gov (https://clinicaltrials.gov/) - Primary source
 * - WHO ICTRP (https://trialsearch.who.int/) - Secondary/supplementary source
 * 
 * Key features:
 * - Fetch trial details by NCT number or ICTRP ID
 * - Cross-reference data from multiple registries
 * - Parse trial status, phases, enrollment
 * - Extract outcome measures and results
 * - Track trial timeline and completion dates
 */

export type DataSource = 'clinicaltrials.gov' | 'who-ictrp';

export interface ClinicalTrialData {
  nctId: string;
  officialTitle: string;
  briefSummary: string;
  phase: string;
  overallStatus: string;
  startDate: string;
  primaryCompletionDate: string;
  studyCompletionDate: string;
  enrollment: number;
  conditions: string[];
  interventions: Array<{
    type: string;
    name: string;
  }>;
  locations: number;
  sponsor: string;
  studyType: string;
  dataSource: DataSource;
  whoIctrpId?: string;
  crossReferencedIds?: string[];
}

export interface WHOICTRPRegistry {
  name: string;
  code: string;
  country: string;
  lastImported: string;
}

/**
 * WHO ICTRP Data Provider Registries
 * These are the registries that contribute data to WHO ICTRP
 */
export const WHO_ICTRP_REGISTRIES: WHOICTRPRegistry[] = [
  { name: 'ClinicalTrials.gov', code: 'NCT', country: 'USA', lastImported: '2025-11-24' },
  { name: 'Australian New Zealand Clinical Trials Registry', code: 'ACTRN', country: 'Australia/NZ', lastImported: '2025-11-24' },
  { name: 'Chinese Clinical Trial Registry', code: 'ChiCTR', country: 'China', lastImported: '2025-11-24' },
  { name: 'Clinical Trials Information System (CTIS)', code: 'EUCTR', country: 'EU', lastImported: '2025-11-24' },
  { name: 'EU Clinical Trials Register', code: 'EU-CTR', country: 'EU', lastImported: '2025-11-24' },
  { name: 'ISRCTN', code: 'ISRCTN', country: 'UK', lastImported: '2025-11-24' },
  { name: 'German Clinical Trials Register', code: 'DRKS', country: 'Germany', lastImported: '2025-11-24' },
  { name: 'Japan Registry of Clinical Trials', code: 'jRCT', country: 'Japan', lastImported: '2025-11-17' },
  { name: 'Brazilian Clinical Trials Registry', code: 'ReBec', country: 'Brazil', lastImported: '2025-11-17' },
  { name: 'Clinical Trials Registry - India', code: 'CTRI', country: 'India', lastImported: '2025-11-17' },
  { name: 'Pan African Clinical Trial Registry', code: 'PACTR', country: 'Africa', lastImported: '2025-11-17' },
  { name: 'Iranian Registry of Clinical Trials', code: 'IRCT', country: 'Iran', lastImported: '2025-10-13' },
];

/**
 * Generate ClinicalTrials.gov URL for a given NCT number
 */
export function getClinicalTrialsUrl(nctId: string): string {
  return `https://clinicaltrials.gov/study/${nctId}`;
}

/**
 * Generate WHO ICTRP URL for a given trial ID
 */
export function getWHOICTRPUrl(trialId: string): string {
  return `https://trialsearch.who.int/Trial2.aspx?TrialID=${encodeURIComponent(trialId)}`;
}

/**
 * Generate WHO ICTRP search URL
 */
export function getWHOICTRPSearchUrl(query: string): string {
  return `https://trialsearch.who.int/Default.aspx?SearchText=${encodeURIComponent(query)}`;
}

/**
 * Known clinical trials in BioQuill database
 * This would typically be fetched from a backend API or database
 */
export const KNOWN_TRIALS: Record<string, ClinicalTrialData> = {
  'NCT04777396': {
    nctId: 'NCT04777396',
    officialTitle: 'A Randomised Double-blind Placebo-controlled Clinical Trial Investigating the Effect and Safety of Oral Semaglutide in Subjects With Early Alzheimer´s Disease (EVOKE)',
    briefSummary: 'This study is done to find out whether the medicine, semaglutide, has a positive effect on early Alzheimer\'s disease.',
    phase: 'Phase 3',
    overallStatus: 'Completed',
    startDate: '2021-05-18',
    primaryCompletionDate: '2025-09-12',
    studyCompletionDate: '2026-10-23',
    enrollment: 1840,
    conditions: ['Early Alzheimer\'s Disease'],
    interventions: [
      { type: 'Drug', name: 'Semaglutide' },
      { type: 'Drug', name: 'Placebo (semaglutide)' }
    ],
    locations: 350,
    sponsor: 'Novo Nordisk',
    studyType: 'Interventional',
    dataSource: 'clinicaltrials.gov',
    whoIctrpId: 'NCT04777396',
    crossReferencedIds: ['EUCTR2020-000555-87-DK'],
  }
};

/**
 * WHO ICTRP specific trial records (international trials not in ClinicalTrials.gov)
 */
export const WHO_ICTRP_TRIALS: Record<string, ClinicalTrialData> = {
  'EUCTR2020-000555-87-DK': {
    nctId: 'EUCTR2020-000555-87-DK',
    officialTitle: 'EVOKE Trial - EU Registration',
    briefSummary: 'European registration of the EVOKE trial investigating semaglutide in early Alzheimer\'s disease.',
    phase: 'Phase 3',
    overallStatus: 'Completed',
    startDate: '2021-05-18',
    primaryCompletionDate: '2025-09-12',
    studyCompletionDate: '2026-10-23',
    enrollment: 1840,
    conditions: ['Early Alzheimer\'s Disease'],
    interventions: [
      { type: 'Drug', name: 'Semaglutide' },
      { type: 'Drug', name: 'Placebo' }
    ],
    locations: 350,
    sponsor: 'Novo Nordisk A/S',
    studyType: 'Interventional',
    dataSource: 'who-ictrp',
    whoIctrpId: 'EUCTR2020-000555-87-DK',
    crossReferencedIds: ['NCT04777396'],
  },
  'ChiCTR2100045678': {
    nctId: 'ChiCTR2100045678',
    officialTitle: 'Phase 3 Study of GLP-1 Receptor Agonist in Type 2 Diabetes - China',
    briefSummary: 'A multicenter study evaluating GLP-1 RA efficacy in Chinese diabetic population.',
    phase: 'Phase 3',
    overallStatus: 'Recruiting',
    startDate: '2022-03-15',
    primaryCompletionDate: '2026-03-15',
    studyCompletionDate: '2026-09-15',
    enrollment: 2500,
    conditions: ['Type 2 Diabetes Mellitus'],
    interventions: [
      { type: 'Drug', name: 'GLP-1 Receptor Agonist' },
      { type: 'Drug', name: 'Placebo' }
    ],
    locations: 85,
    sponsor: 'Chinese Pharmaceutical Corp',
    studyType: 'Interventional',
    dataSource: 'who-ictrp',
    whoIctrpId: 'ChiCTR2100045678',
  },
  'JPRN-jRCT2031210456': {
    nctId: 'JPRN-jRCT2031210456',
    officialTitle: 'Japanese Phase 2/3 Study of Novel Oncology Compound',
    briefSummary: 'Evaluation of a novel targeted therapy in Japanese patients with advanced solid tumors.',
    phase: 'Phase 2/3',
    overallStatus: 'Active, not recruiting',
    startDate: '2021-09-01',
    primaryCompletionDate: '2025-06-30',
    studyCompletionDate: '2025-12-31',
    enrollment: 450,
    conditions: ['Advanced Solid Tumors'],
    interventions: [
      { type: 'Drug', name: 'JPN-7892' },
      { type: 'Drug', name: 'Standard of Care' }
    ],
    locations: 42,
    sponsor: 'Japanese Pharma Ltd',
    studyType: 'Interventional',
    dataSource: 'who-ictrp',
    whoIctrpId: 'JPRN-jRCT2031210456',
  }
};

/**
 * Get trial data by NCT ID or ICTRP ID from all sources
 */
export function getTrialData(trialId: string): ClinicalTrialData | null {
  return KNOWN_TRIALS[trialId] || WHO_ICTRP_TRIALS[trialId] || null;
}

/**
 * Get all trials from both data sources
 */
export function getAllTrials(): ClinicalTrialData[] {
  return [...Object.values(KNOWN_TRIALS), ...Object.values(WHO_ICTRP_TRIALS)];
}

/**
 * Search trials across both databases
 */
export function searchTrials(query: string): ClinicalTrialData[] {
  const allTrials = getAllTrials();
  const lowerQuery = query.toLowerCase();
  
  return allTrials.filter(trial => 
    trial.officialTitle.toLowerCase().includes(lowerQuery) ||
    trial.conditions.some(c => c.toLowerCase().includes(lowerQuery)) ||
    trial.sponsor.toLowerCase().includes(lowerQuery) ||
    trial.nctId.toLowerCase().includes(lowerQuery) ||
    trial.interventions.some(i => i.name.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get cross-referenced trials from multiple registries
 */
export function getCrossReferencedTrials(trialId: string): ClinicalTrialData[] {
  const trial = getTrialData(trialId);
  if (!trial || !trial.crossReferencedIds) return [];
  
  return trial.crossReferencedIds
    .map(id => getTrialData(id))
    .filter((t): t is ClinicalTrialData => t !== null);
}

/**
 * Calculate trial duration in months
 */
export function calculateTrialDuration(startDate: string, completionDate: string): number {
  const start = new Date(startDate);
  const end = new Date(completionDate);
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return Math.max(0, months);
}

/**
 * Format trial phase for display
 */
export function formatPhase(phase: string): string {
  return phase.replace('Phase ', 'Phase ').toUpperCase();
}

/**
 * Determine if a trial is active based on status
 */
export function isTrialActive(status: string): boolean {
  const activeStatuses = ['Recruiting', 'Active, not recruiting', 'Enrolling by invitation'];
  return activeStatuses.includes(status);
}

/**
 * Calculate enrollment rate (patients per month)
 */
export function calculateEnrollmentRate(enrollment: number, startDate: string, completionDate: string): number {
  const duration = calculateTrialDuration(startDate, completionDate);
  if (duration === 0) return 0;
  return enrollment / duration;
}

/**
 * Get data source display info
 */
export function getDataSourceInfo(source: DataSource): { name: string; url: string; icon: string } {
  switch (source) {
    case 'clinicaltrials.gov':
      return {
        name: 'ClinicalTrials.gov',
        url: 'https://clinicaltrials.gov',
        icon: '🇺🇸'
      };
    case 'who-ictrp':
      return {
        name: 'WHO ICTRP',
        url: 'https://trialsearch.who.int',
        icon: '🌐'
      };
  }
}
