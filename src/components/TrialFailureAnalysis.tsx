import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, TrendingDown, FileText } from "lucide-react";

interface TrialFailureAnalysisProps {
  moleculeName: string;
  trialName: string;
  phase: string;
}

export function TrialFailureAnalysis({ moleculeName, trialName, phase }: TrialFailureAnalysisProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Trial Failure Analysis: {moleculeName}
            </CardTitle>
            <CardDescription>EVOKE & EVOKE+ Clinical Trial Results (Nov 2025)</CardDescription>
          </div>
          <Badge variant="destructive" className="text-lg font-bold px-4 py-2">
            Failed Endpoints
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Facts */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Key Trial Facts (ClinicalTrials.gov: NCT04777396)
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Official Title:</span>
              <span className="font-medium text-right">EVOKE Trial - Oral Semaglutide in Early Alzheimer's Disease</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">NCT Number:</span>
              <span className="font-medium">NCT04777396</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Phase:</span>
              <span className="font-medium">Phase III</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Enrollment:</span>
              <span className="font-medium">1,840 patients (EVOKE) + ~2,000 (EVOKE+) = 3,800+ total</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Study Period:</span>
              <span className="font-medium">May 2021 - Sep 2025 (Primary completion)</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">173 weeks (~3.3 years per patient)</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Sites:</span>
              <span className="font-medium">350 locations globally</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Patient Population:</span>
              <span className="font-medium">Early Alzheimer's Disease</span>
            </div>
            <div className="flex justify-between p-3 bg-background rounded-lg">
              <span className="text-muted-foreground">Formulation:</span>
              <span className="font-medium">Oral semaglutide (randomized, double-blind, placebo-controlled)</span>
            </div>
          </div>
        </div>

        {/* Failure Analysis */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Primary Endpoint Failure
          </h3>
          <div className="p-4 bg-destructive/10 rounded-lg space-y-3 border border-destructive/20">
            <p className="text-sm">
              <strong>Result:</strong> Semaglutide did NOT slow progression of Alzheimer's disease versus placebo
            </p>
            <p className="text-sm">
              <strong>Biomarkers:</strong> Some disease-related biomarker improvements observed, but these did NOT translate into clinical benefit
            </p>
            <p className="text-sm text-destructive font-medium">
              → Primary endpoints were NOT met in either trial
            </p>
          </div>
        </div>

        {/* Scoring Rationale */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Adjusted Probability Scoring Rationale
          </h3>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">1. Meeting Endpoints: 0%</div>
              <p className="text-muted-foreground">
                Both Phase III trials failed to meet primary endpoints. No clinical benefit demonstrated despite biomarker changes.
              </p>
            </div>
            
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">2. Next Phase Probability: 0%</div>
              <p className="text-muted-foreground">
                Already in Phase III. Failure at this stage means program termination for this indication. No path forward without major protocol redesign.
              </p>
            </div>
            
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">3. Dropout Risk: 1/5 (Low)</div>
              <p className="text-muted-foreground">
                Trials completed with 3,800+ patients enrolled. Low dropout indicates good tolerability and strong trial execution by Novo Nordisk, despite efficacy failure.
              </p>
            </div>
            
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">4. Approval Probability: 0%</div>
              <p className="text-muted-foreground">
                Failed Phase III endpoints = no regulatory approval possible. FDA/EMA require demonstration of clinical benefit for approval.
              </p>
            </div>
            
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">5. Regulatory Pathway: N/A</div>
              <p className="text-muted-foreground">
                No pathway available without successful efficacy demonstration. Breakthrough, accelerated, or orphan designations cannot override failed endpoints.
              </p>
            </div>
            
            <div className="p-3 bg-background rounded-lg">
              <div className="font-medium mb-1">6. Market Revenue: $0M</div>
              <p className="text-muted-foreground">
                No approval = no market access = zero revenue. All market projections eliminated across all geographies.
              </p>
            </div>
          </div>
        </div>

        {/* M&A/PE Implications */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">PE/M&A Due Diligence Implications</h3>
          <div className="p-4 bg-background rounded-lg space-y-2 text-sm">
            <p><strong>Asset Value:</strong> Zero for Alzheimer's indication. No recoverable value from failed Phase III.</p>
            <p><strong>Portfolio Impact:</strong> Negative sentiment for GLP-1 class in neurodegeneration, but core metabolic business unaffected.</p>
            <p><strong>Lesson Learned:</strong> Biomarker improvements insufficient without clinical benefit translation. Retrospective efficacy signals require prospective validation.</p>
            <p><strong>Risk Assessment:</strong> Highlights importance of robust preclinical mechanistic data before large Phase III investment.</p>
          </div>
        </div>

        {/* Sources */}
        <div className="pt-4 border-t space-y-1">
          <p className="text-xs text-muted-foreground">
            <strong>Primary Source:</strong> STAT News, Nov 24, 2025 - "Novo Nordisk's semaglutide fails to slow Alzheimer's progression"
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Trial Registry:</strong> ClinicalTrials.gov - NCT04777396 (EVOKE Trial)
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Sponsor:</strong> Novo Nordisk
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
