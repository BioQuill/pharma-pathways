// CAPM Alpha Report Card for Full DD Report
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import {
  RF, calculateCAPM, estimateBeta, getAlphaColor, getAlphaLabel,
  type BetaInputs,
} from "@/lib/capmModel";
import { calculatePTRS, type PTRSSliders } from "@/lib/ptrsEngine";
import { canonicalizeTA } from "@/lib/taCanonical";
import { ModelNarrative, generateCAPMNarrative } from "./ModelNarrative";

interface CAPMReportCardProps {
  molecule: {
    id: string;
    name: string;
    phase: string;
    therapeuticArea: string;
    company: string;
    companyTrackRecord?: 'fast' | 'average' | 'slow';
  };
}

function getPhaseForCAPM(phase: string): string {
  const p = phase.toLowerCase();
  if (p.includes("phase 3") || p.includes("phase iii")) return "Phase 3";
  if (p.includes("phase 2/3")) return "Phase 2/3";
  if (p.includes("phase 2") || p.includes("phase ii")) return "Phase 2";
  if (p.includes("phase 1/2")) return "Phase 1/2";
  if (p.includes("phase 1") || p.includes("phase i")) return "Phase 1";
  return "Phase 2";
}

export function CAPMReportCard({ molecule }: CAPMReportCardProps) {
  const result = useMemo(() => {
    const ta = canonicalizeTA(molecule.therapeuticArea);
    const capmPhase = getPhaseForCAPM(molecule.phase);
    const sponsorTier = molecule.companyTrackRecord === 'fast' ? 'top_20_pharma' as const
      : molecule.companyTrackRecord === 'slow' ? 'small_biotech' as const
      : 'mid_size_biotech' as const;

    const betaInputs: BetaInputs = {
      mechanism: 'best_in_class',
      designation: 'none',
      sponsorTier,
      phase: capmPhase,
      priorData: 'no_prior',
    };

    // Estimate PTRS for actual return
    const sliders: PTRSSliders = {
      mechanismNovelty: 50, endpointClarity: 50, priorTrialData: 50,
      sponsorExperience: molecule.companyTrackRecord === 'fast' ? 70 : 50,
      regulatoryPrecedent: 50, safetyProfile: 50,
    };
    const ptrs = calculatePTRS(ta, capmPhase, sliders);
    return calculateCAPM(ta, ptrs.ptrs, betaInputs);
  }, [molecule]);

  const riskClass = result.beta < 0.8 ? "Low" : result.beta < 1.3 ? "Medium" : "High";

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          CAPM Alpha Signals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <div className="text-2xl font-bold">{result.beta.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Estimated β</div>
            <Badge variant="outline" className="text-xs mt-1">{riskClass} Risk</Badge>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: getAlphaColor(result.alpha1) }}>
              {(result.alpha1 * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">α₁ Historical</div>
            <Badge variant="outline" className="text-xs mt-1">{getAlphaLabel(result.alpha1)}</Badge>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <div className="text-2xl font-bold" style={{ color: getAlphaColor(result.alpha2) }}>
              {(result.alpha2 * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">α₂ Pipeline</div>
            <Badge variant="outline" className="text-xs mt-1">{getAlphaLabel(result.alpha2)}</Badge>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-center border border-primary/20">
            <div className="text-2xl font-bold" style={{ color: getAlphaColor(result.deltaAlpha) }}>
              {(result.deltaAlpha * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Δα Divergence</div>
            <Badge variant="outline" className="text-xs mt-1">{getAlphaLabel(result.deltaAlpha)}</Badge>
          </div>
        </div>

        {/* Signal summary table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b"><th className="text-left py-1.5 text-muted-foreground">Signal</th><th className="text-right py-1.5 text-muted-foreground">Value</th></tr></thead>
            <tbody className="divide-y divide-border/30">
              <tr><td className="py-1.5">Rf (Risk-free)</td><td className="text-right font-mono">{(RF * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">Rm (TA Market)</td><td className="text-right font-mono">{(result.Rm * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">Estimated β</td><td className="text-right font-mono">{result.beta.toFixed(2)}</td></tr>
              <tr><td className="py-1.5">E(R) Expected</td><td className="text-right font-mono">{(result.expectedReturn * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">Actual PTRS</td><td className="text-right font-mono">{((result.expectedReturn + result.alpha1) * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">α₁ Historical</td><td className="text-right font-mono">{(result.alpha1 * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">α₂ Pipeline</td><td className="text-right font-mono">{(result.alpha2 * 100).toFixed(1)}%</td></tr>
              <tr><td className="py-1.5">Δα</td><td className="text-right font-mono">{(result.deltaAlpha * 100).toFixed(1)}%</td></tr>
            </tbody>
          </table>
        </div>

        <ModelNarrative>
          <p>{generateCAPMNarrative(result.alpha1, result.alpha2, result.deltaAlpha)}</p>
        </ModelNarrative>
      </CardContent>
    </Card>
  );
}
