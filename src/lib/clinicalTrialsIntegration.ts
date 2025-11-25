/**
 * ClinicalTrials.gov Integration Module
 * 
 * This module provides utilities for fetching and parsing clinical trial data
 * from ClinicalTrials.gov (https://clinicaltrials.gov/)
 * 
 * Key features:
 * - Fetch trial details by NCT number
 * - Parse trial status, phases, enrollment
 * - Extract outcome measures and results
 * - Track trial timeline and completion dates
 */

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
}

/**
 * Generate ClinicalTrials.gov URL for a given NCT number
 */
export function getClinicalTrialsUrl(nctId: string): string {
  return `https://clinicaltrials.gov/study/${nctId}`;
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
  }
};

/**
 * Get trial data by NCT ID
 */
export function getTrialData(nctId: string): ClinicalTrialData | null {
  return KNOWN_TRIALS[nctId] || null;
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
