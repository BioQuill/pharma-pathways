import React, { useEffect, useState } from 'react';
import { getOutcomeForMolecule } from '@/lib/outcomesService';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, FileText } from 'lucide-react';

interface Props {
  nctId: string;
  primaryDrug: string;
}

function getWhatItMeans(outcome: string): string {
  const lower = outcome.toLowerCase();
  if (/\boverall survival\b|\b\bos\b/.test(lower) || /\bsurvival\b/.test(lower)) {
    return 'This trial uses overall survival as its primary endpoint — the gold standard for oncology studies. OS endpoints carry the strongest regulatory weight and typically support full approval rather than accelerated pathways.';
  }
  if (/\bprogression\b|\bpfs\b/.test(lower)) {
    return 'Progression-free survival is a common surrogate endpoint that enables faster trial readouts. While accepted by regulators for accelerated approval, full approval typically requires confirmatory OS data.';
  }
  if (/\bhba1c\b|\bglycat|\bglucose\b/.test(lower)) {
    return 'Glycaemic control endpoints are well-established in metabolic disease trials and are accepted by FDA and EMA as primary efficacy measures for diabetes and obesity indications.';
  }
  if (/\bresponse rate\b|\borr\b|\bobjective response\b/.test(lower)) {
    return 'Objective response rate is a common primary endpoint for oncology trials seeking accelerated approval. High ORR with durable responses can support full approval in certain indications.';
  }
  return 'The primary endpoint defines the main measure of success for this trial and is the basis for regulatory submission. Review the endpoint carefully — harder endpoints (survival, cure) carry more regulatory weight than surrogate measures.';
}

export default function PrimaryOutcomeCard({ nctId, primaryDrug }: Props) {
  const [outcome, setOutcome] = useState<string | null | undefined>(undefined); // undefined = loading
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setOutcome(undefined);
    setError(false);
    getOutcomeForMolecule(nctId, primaryDrug)
      .then(res => { if (!cancelled) setOutcome(res); })
      .catch(() => { if (!cancelled) { setOutcome(null); setError(false); } });
    return () => { cancelled = true; };
  }, [nctId, primaryDrug]);

  const isLoading = outcome === undefined;
  const ctgUrl = `https://clinicaltrials.gov/study/${nctId}`;

  return (
    <div
      style={{
        border: '2.5px solid #1e3a5f',
        borderRadius: 12,
        background: 'white',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px 20px 8px' }}>
        <div className="flex items-center gap-2" style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 15, color: '#1e3a5f', letterSpacing: '0.04em' }}>
          <FileText className="h-4 w-4" style={{ color: '#1e3a5f' }} />
          PRIMARY OUTCOME MEASURES
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '4px 20px 16px' }}>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: '#888', marginTop: 8 }}>
              Loading outcome data...
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 13, color: '#1a1a1a', lineHeight: 1.6 }}>
              {outcome || 'Primary outcome data not available for this trial.'}
            </p>

            {/* Source label */}
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#888', marginTop: 12 }}>
              Source: ClinicalTrials.gov · NCT{' '}
              <a
                href={ctgUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1e3a5f', textDecoration: 'underline' }}
              >
                {nctId}
              </a>
              {' '}
              <ExternalLink className="inline h-3 w-3" style={{ color: '#1e3a5f' }} />
            </p>

            {/* What this means */}
            {outcome && (
              <div
                style={{
                  background: '#fffbeb',
                  borderLeft: '4px solid #d97706',
                  borderRadius: 6,
                  padding: '12px 16px',
                  marginTop: 14,
                }}
              >
                <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 13, color: '#b45309', marginBottom: 4 }}>
                  What this means
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 13, color: '#1a1a1a', fontStyle: 'italic', lineHeight: 1.55 }}>
                  {getWhatItMeans(outcome)}
                </p>
              </div>
            )}

            {/* Default case — no outcome — still show the amber box */}
            {!outcome && (
              <div
                style={{
                  background: '#fffbeb',
                  borderLeft: '4px solid #d97706',
                  borderRadius: 6,
                  padding: '12px 16px',
                  marginTop: 14,
                }}
              >
                <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 13, color: '#b45309', marginBottom: 4 }}>
                  What this means
                </p>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 400, fontSize: 13, color: '#1a1a1a', fontStyle: 'italic', lineHeight: 1.55 }}>
                  The primary endpoint defines the main measure of success for this trial and is the basis for regulatory submission. Review the endpoint carefully — harder endpoints (survival, cure) carry more regulatory weight than surrogate measures.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
