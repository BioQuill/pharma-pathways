import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type MoleculeProfile } from "@/lib/moleculesData";
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";

interface PTRSComparisonPDFReportProps {
  molecules: MoleculeProfile[];
  selectedMoleculeIds: string[];
}

// PTRS calculation helper
const calculatePTRSForMolecule = (molecule: MoleculeProfile) => {
  const taBaseRates: Record<string, { pts: number; prs: number }> = {
    oncology: { pts: 12, prs: 82 },
    cns: { pts: 8, prs: 78 },
    cardiovascular: { pts: 15, prs: 85 },
    infectious: { pts: 22, prs: 88 },
    immunology: { pts: 18, prs: 84 },
    metabolic: { pts: 16, prs: 86 },
    rareDisease: { pts: 25, prs: 90 },
    dermatology: { pts: 20, prs: 87 },
  };

  const phaseMultipliers: Record<string, number> = {
    preclinical: 0.3,
    phase1: 0.5,
    phase2: 0.75,
    phase3: 1.2,
    nda: 1.5,
    approved: 2.0,
  };

  const getTAKey = (ta: string): string => {
    const taLower = ta.toLowerCase();
    if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
    if (taLower.includes("cns") || taLower.includes("neurology")) return "cns";
    if (taLower.includes("cardio")) return "cardiovascular";
    if (taLower.includes("infectious")) return "infectious";
    if (taLower.includes("immun")) return "immunology";
    if (taLower.includes("metabol") || taLower.includes("endocr") || taLower.includes("diabetes") || taLower.includes("obesity")) return "metabolic";
    if (taLower.includes("rare")) return "rareDisease";
    if (taLower.includes("derma")) return "dermatology";
    return "oncology";
  };

  const getPhaseKey = (phase: string): string => {
    const phaseLower = phase.toLowerCase();
    if (phaseLower.includes("preclinical")) return "preclinical";
    if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return "phase1";
    if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return "phase2";
    if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return "phase3";
    if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return "nda";
    if (phaseLower.includes("approved")) return "approved";
    return "phase2";
  };

  const taKey = getTAKey(molecule.therapeuticArea);
  const phaseKey = getPhaseKey(molecule.phase);
  const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
  const phaseMultiplier = phaseMultipliers[phaseKey] || 1;

  const mechanismNovelty = molecule.scores ? Math.round(molecule.scores.meetingEndpoints * 100) : 50;
  const endpointClarity = molecule.scores ? Math.round(molecule.scores.approval * 100) : 70;
  const priorTrialData = molecule.scores ? Math.round(molecule.scores.nextPhase * 100) : 60;
  const sponsorExperience = molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45;
  const regulatoryPrecedent = molecule.scores ? Math.round(molecule.scores.regulatoryPathway.accelerated * 100) : 75;
  const safetyProfile = molecule.scores ? Math.round((1 - molecule.scores.dropoutRanking / 5) * 100) : 70;

  const ptsAdjustment = (mechanismNovelty * 0.15 + endpointClarity * 0.25 + priorTrialData * 0.35 + sponsorExperience * 0.25) / 100;
  const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + ptsAdjustment)));

  const prsAdjustment = (regulatoryPrecedent * 0.4 + safetyProfile * 0.4 + sponsorExperience * 0.2) / 100;
  const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + prsAdjustment * 0.6)));

  const ptrs = (pts / 100) * prs;

  return {
    pts: Math.round(pts * 10) / 10,
    prs: Math.round(prs * 10) / 10,
    ptrs: Math.round(ptrs * 10) / 10,
    factors: {
      mechanismNovelty,
      endpointClarity,
      priorTrialData,
      sponsorExperience,
      regulatoryPrecedent,
      safetyProfile,
    }
  };
};

// Historical PTRS calculation
const calculatePTRSByPhase = (molecule: MoleculeProfile, phaseKey: string) => {
  const taBaseRates: Record<string, { pts: number; prs: number }> = {
    oncology: { pts: 12, prs: 82 },
    cns: { pts: 8, prs: 78 },
    cardiovascular: { pts: 15, prs: 85 },
    infectious: { pts: 22, prs: 88 },
    immunology: { pts: 18, prs: 84 },
    metabolic: { pts: 16, prs: 86 },
    rareDisease: { pts: 25, prs: 90 },
    dermatology: { pts: 20, prs: 87 },
  };

  const phaseMultipliers: Record<string, number> = {
    preclinical: 0.3,
    phase1: 0.5,
    phase2: 0.75,
    phase3: 1.2,
    nda: 1.5,
    approved: 2.0,
  };

  const getTAKey = (ta: string): string => {
    const taLower = ta.toLowerCase();
    if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
    if (taLower.includes("cns") || taLower.includes("neurology")) return "cns";
    if (taLower.includes("cardio")) return "cardiovascular";
    if (taLower.includes("infectious")) return "infectious";
    if (taLower.includes("immun")) return "immunology";
    if (taLower.includes("metabol") || taLower.includes("endocr") || taLower.includes("diabetes") || taLower.includes("obesity")) return "metabolic";
    if (taLower.includes("rare")) return "rareDisease";
    if (taLower.includes("derma")) return "dermatology";
    return "oncology";
  };

  const taKey = getTAKey(molecule.therapeuticArea);
  const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
  const phaseMultiplier = phaseMultipliers[phaseKey] || 1;

  const phaseUncertainty: Record<string, number> = {
    preclinical: 0.6,
    phase1: 0.75,
    phase2: 0.85,
    phase3: 0.95,
    nda: 1.0,
    approved: 1.0,
  };

  const uncertainty = phaseUncertainty[phaseKey] || 0.85;
  const mechanismNovelty = molecule.scores ? Math.round(molecule.scores.meetingEndpoints * 100 * uncertainty) : 50;
  const endpointClarity = molecule.scores ? Math.round(molecule.scores.approval * 100 * uncertainty) : 70;
  const priorTrialData = molecule.scores ? Math.round(molecule.scores.nextPhase * 100 * uncertainty) : 60;
  const sponsorExperience = molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45;
  const regulatoryPrecedent = molecule.scores ? Math.round(molecule.scores.regulatoryPathway.accelerated * 100 * uncertainty) : 75;
  const safetyProfile = molecule.scores ? Math.round((1 - molecule.scores.dropoutRanking / 5) * 100 * uncertainty) : 70;

  const ptsAdjustment = (mechanismNovelty * 0.15 + endpointClarity * 0.25 + priorTrialData * 0.35 + sponsorExperience * 0.25) / 100;
  const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + ptsAdjustment)));

  const prsAdjustment = (regulatoryPrecedent * 0.4 + safetyProfile * 0.4 + sponsorExperience * 0.2) / 100;
  const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + prsAdjustment * 0.6)));

  const ptrs = (pts / 100) * prs;

  return {
    pts: Math.round(pts * 10) / 10,
    prs: Math.round(prs * 10) / 10,
    ptrs: Math.round(ptrs * 10) / 10,
  };
};

const phaseOrder = ["Preclinical", "Phase 1", "Phase 2", "Phase 3", "NDA/BLA", "Approved"];
const phaseKeys = ["preclinical", "phase1", "phase2", "phase3", "nda", "approved"];

const getCurrentPhaseIndex = (phase: string): number => {
  const phaseLower = phase.toLowerCase();
  if (phaseLower.includes("preclinical")) return 0;
  if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return 1;
  if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return 2;
  if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return 3;
  if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return 4;
  if (phaseLower.includes("approved")) return 5;
  return 2;
};

export const PTRSComparisonPDFReport = ({ molecules, selectedMoleculeIds }: PTRSComparisonPDFReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const selectedMolecules = selectedMoleculeIds
    .map(id => molecules.find(m => m.id === id))
    .filter(Boolean) as MoleculeProfile[];

  const generateHistoricalData = (molecule: MoleculeProfile) => {
    const currentPhaseIdx = getCurrentPhaseIndex(molecule.phase);
    const data = [];

    for (let i = 0; i <= currentPhaseIdx; i++) {
      const ptrsData = calculatePTRSByPhase(molecule, phaseKeys[i]);
      data.push({
        phase: phaseOrder[i],
        ...ptrsData,
        isCurrent: i === currentPhaseIdx,
      });
    }

    return data;
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current || selectedMolecules.length === 0) return;
    const id = 'ptrs-comparison-report';
    reportRef.current.id = id;
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF(id, `PTRS-Comparison-Report-${new Date().toISOString().split('T')[0]}.pdf`, { format: 'letter' });
  };

  if (selectedMolecules.length === 0) {
    return null;
  }

  const comparisonData = selectedMolecules.map(mol => ({
    molecule: mol,
    ptrsData: calculatePTRSForMolecule(mol),
    historicalData: generateHistoricalData(mol),
  }));

  // Find best performers
  const bestPTRS = comparisonData.reduce((best, curr) => 
    curr.ptrsData.ptrs > best.ptrsData.ptrs ? curr : best
  );
  const bestPTS = comparisonData.reduce((best, curr) => 
    curr.ptrsData.pts > best.ptrsData.pts ? curr : best
  );
  const bestPRS = comparisonData.reduce((best, curr) => 
    curr.ptrsData.prs > best.ptrsData.prs ? curr : best
  );

  return (
    <Card className="border-primary/20 mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              PTRS Comparison Report
            </CardTitle>
            <CardDescription>
              Generate comprehensive PDF report for {selectedMolecules.length} molecule(s)
            </CardDescription>
          </div>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="h-4 w-4" />
            Export Comparison PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Report Preview */}
        <div 
          ref={reportRef} 
          className="bg-white text-black p-6 rounded-lg border max-h-[500px] overflow-y-auto"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Report Header */}
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold">BioQuill PTRS Comparison Report</h1>
            <p className="text-sm text-gray-600 mt-1">
              Probability of Technical & Regulatory Success Analysis
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-bold mb-3 border-b pb-2">Executive Summary</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-xs text-gray-600">Highest PTRS</p>
                <p className="font-bold text-purple-700">{bestPTRS.molecule.name.substring(0, 20)}</p>
                <p className="text-lg font-bold text-purple-600">{bestPTRS.ptrsData.ptrs}%</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs text-gray-600">Highest PTS</p>
                <p className="font-bold text-blue-700">{bestPTS.molecule.name.substring(0, 20)}</p>
                <p className="text-lg font-bold text-blue-600">{bestPTS.ptrsData.pts}%</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs text-gray-600">Highest PRS</p>
                <p className="font-bold text-green-700">{bestPRS.molecule.name.substring(0, 20)}</p>
                <p className="text-lg font-bold text-green-600">{bestPRS.ptrsData.prs}%</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              This report compares {selectedMolecules.length} molecules across key probability metrics. 
              <strong> {bestPTRS.molecule.name}</strong> demonstrates the highest overall probability of 
              technical and regulatory success at <strong>{bestPTRS.ptrsData.ptrs}%</strong>.
            </p>
          </div>

          {/* Detailed Comparison Table */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b pb-2">Detailed Comparison</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Molecule</th>
                  <th className="border p-2 text-center">Phase</th>
                  <th className="border p-2 text-center">TA</th>
                  <th className="border p-2 text-center text-blue-600">PTS</th>
                  <th className="border p-2 text-center text-green-600">PRS</th>
                  <th className="border p-2 text-center text-purple-600">PTRS</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((data, idx) => (
                  <tr key={data.molecule.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="border p-2">
                      <p className="font-medium">{data.molecule.name}</p>
                      <p className="text-xs text-gray-500">{data.molecule.company}</p>
                    </td>
                    <td className="border p-2 text-center text-xs">{data.molecule.phase}</td>
                    <td className="border p-2 text-center text-xs">{data.molecule.therapeuticArea}</td>
                    <td className="border p-2 text-center font-semibold text-blue-600">{data.ptrsData.pts}%</td>
                    <td className="border p-2 text-center font-semibold text-green-600">{data.ptrsData.prs}%</td>
                    <td className="border p-2 text-center font-bold text-purple-600">{data.ptrsData.ptrs}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Individual Molecule Analysis */}
          {comparisonData.map((data, idx) => (
            <div key={data.molecule.id} className="mb-6 p-4 border rounded-lg" style={{ pageBreakInside: 'avoid' }}>
              <h3 className="text-md font-bold mb-3 flex items-center justify-between">
                <span>{idx + 1}. {data.molecule.name}</span>
                <span className="text-purple-600 text-lg">{data.ptrsData.ptrs}% PTRS</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="font-medium">{data.molecule.company}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Indication</p>
                  <p className="font-medium">{data.molecule.indication}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Phase</p>
                  <p className="font-medium">{data.molecule.phase}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Therapeutic Area</p>
                  <p className="font-medium">{data.molecule.therapeuticArea}</p>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="mb-4">
                <p className="text-sm font-semibold mb-2">Score Factors:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Mechanism Novelty</p>
                    <p className="font-bold">{data.ptrsData.factors.mechanismNovelty}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Endpoint Clarity</p>
                    <p className="font-bold">{data.ptrsData.factors.endpointClarity}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Prior Trial Data</p>
                    <p className="font-bold">{data.ptrsData.factors.priorTrialData}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Sponsor Experience</p>
                    <p className="font-bold">{data.ptrsData.factors.sponsorExperience}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Regulatory Precedent</p>
                    <p className="font-bold">{data.ptrsData.factors.regulatoryPrecedent}%</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Safety Profile</p>
                    <p className="font-bold">{data.ptrsData.factors.safetyProfile}%</p>
                  </div>
                </div>
              </div>

              {/* Historical Phase Progression */}
              <div>
                <p className="text-sm font-semibold mb-2">Phase Progression:</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.historicalData.map((phase, pIdx) => (
                    <div key={phase.phase} className="flex items-center">
                      <div className={`px-2 py-1 rounded text-xs ${
                        phase.isCurrent ? 'bg-purple-600 text-white font-bold' : 'bg-gray-200'
                      }`}>
                        {phase.phase}: {phase.ptrs}%
                      </div>
                      {pIdx < data.historicalData.length - 1 && (
                        <span className="mx-1 text-gray-400">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Methodology Note */}
          <div className="text-xs text-gray-500 border-t pt-4 mt-6">
            <p className="font-semibold mb-1">Methodology Note:</p>
            <p>
              PTRS (Probability of Technical and Regulatory Success) = PTS × PRS. PTS is calculated 
              based on therapeutic area success rates, development phase, mechanism novelty, endpoint 
              clarity, prior trial data, and sponsor experience. PRS considers regulatory precedent, 
              safety profile, and sponsor track record with regulatory agencies.
            </p>
            <p className="mt-2 text-gray-400">
              © {new Date().getFullYear()} BioQuill. This report is for informational purposes only.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
