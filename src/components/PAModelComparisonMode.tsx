import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, Download, FileSpreadsheet, Pill, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { getAllMolecules, mapTAToModel1Id, mapTAToModel2Id, deriveModel1Scores, deriveModel2Ratios } from "@/lib/allMoleculesList";
import { Document, Page, Text, View, generateAndDownloadPDF, formatReportDate, getScoreColor, pdfStyles } from "@/lib/pdfGenerator";
import * as XLSX from 'xlsx';

const model1Markets = [
  { id: "us", label: "🇺🇸 United States", clinical: 25, economic: 35, access: 25, political: 15 },
  { id: "uk", label: "🇬🇧 United Kingdom", clinical: 35, economic: 45, access: 10, political: 10 },
  { id: "de", label: "🇩🇪 Germany", clinical: 40, economic: 30, access: 20, political: 10 },
  { id: "jp", label: "🇯🇵 Japan", clinical: 30, economic: 25, access: 30, political: 15 },
];

const model2TAs: Record<string, Record<string, number>> = {
  oncology: { usComm: 75, usMed: 80, uk: 70, germany: 55, japan: 35 },
  cardiovascular: { usComm: 60, usMed: 65, uk: 45, germany: 45, japan: 25 },
  neurology: { usComm: 65, usMed: 70, uk: 50, germany: 50, japan: 30 },
  endocrinology: { usComm: 58, usMed: 62, uk: 42, germany: 40, japan: 28 },
  immunology: { usComm: 68, usMed: 70, uk: 48, germany: 50, japan: 32 },
  infectious: { usComm: 70, usMed: 72, uk: 65, germany: 55, japan: 35 },
  dermatology: { usComm: 55, usMed: 50, uk: 40, germany: 45, japan: 25 },
  rheumatology: { usComm: 66, usMed: 68, uk: 46, germany: 48, japan: 30 },
  hematology: { usComm: 72, usMed: 78, uk: 52, germany: 50, japan: 33 },
};

export const PAModelComparisonMode = () => {
  const allMolecules = useMemo(() => getAllMolecules(), []);
  const [selectedMolecule, setSelectedMolecule] = useState("");

  const mol = useMemo(() => allMolecules.find(m => m.id === selectedMolecule), [selectedMolecule, allMolecules]);

  const results = useMemo(() => {
    if (!mol) return null;

    // Model 1 (MWPSPI) - US market
    const m1Scores = deriveModel1Scores(mol);
    const usMarket = model1Markets[0];
    const m1Score = Math.min(100, Math.max(0, Math.round(
      (m1Scores.clinical / 100) * usMarket.clinical +
      (m1Scores.economic / 100) * usMarket.economic +
      (m1Scores.access / 100) * usMarket.access +
      (m1Scores.political / 100) * usMarket.political
    )));

    // Model 2 - composite from ratios
    const m2Ratios = deriveModel2Ratios(mol);
    const ratioVals = Object.values(m2Ratios);
    const compositeScore = ratioVals.reduce((a, b) => a + b, 0) / ratioVals.length;
    const taId = mapTAToModel2Id(mol.therapeuticArea) || "oncology";
    const taRates = model2TAs[taId] || model2TAs.oncology;
    const m2USComm = Math.min(95, Math.max(5, Math.round(taRates.usComm * compositeScore)));

    // Triangulation
    const isFirstInClass = false;
    const w1 = isFirstInClass ? 0.6 : 0.4;
    const w2 = 1 - w1;
    const weighted = m1Score * w1 + m2USComm * w2;
    const divergence = Math.abs(m1Score - m2USComm);

    let confidence: string;
    let band: string;
    let bandColor: string;

    if (divergence <= 10 && weighted >= 70) {
      confidence = "High Confidence";
    } else if (divergence <= 10 && weighted >= 45) {
      confidence = "Moderate Confidence";
    } else if (divergence > 20) {
      confidence = "High Divergence";
    } else {
      confidence = "Low Confidence";
    }

    if (weighted >= 75) { band = "Accelerate"; bandColor = "bg-green-100 text-green-800 border-green-300"; }
    else if (weighted >= 60) { band = "Proceed"; bandColor = "bg-blue-100 text-blue-800 border-blue-300"; }
    else if (weighted >= 45) { band = "Deep-Dive"; bandColor = "bg-yellow-100 text-yellow-800 border-yellow-300"; }
    else { band = "Pause/Pivot"; bandColor = "bg-red-100 text-red-800 border-red-300"; }

    // Multi-market model 1 results
    const multiMarketM1 = model1Markets.map(mk => ({
      market: mk.label,
      score: Math.min(100, Math.max(0, Math.round(
        (m1Scores.clinical / 100) * mk.clinical +
        (m1Scores.economic / 100) * mk.economic +
        (m1Scores.access / 100) * mk.access +
        (m1Scores.political / 100) * mk.political
      ))),
    }));

    return {
      m1Score, m1Scores,
      m2USComm, m2Ratios, compositeScore,
      weighted: parseFloat(weighted.toFixed(1)), divergence, confidence, band, bandColor,
      multiMarketM1,
    };
  }, [mol]);

  const exportExcel = () => {
    if (!mol || !results) return;
    const summary = [{
      'Molecule': mol.name,
      'Indication': mol.indication,
      'Therapeutic Area': mol.therapeuticArea,
      'Phase': mol.phase,
      'Company': mol.company,
      'Model 1 MWPSPI (US)': results.m1Score,
      'Model 2 Benchmark (US Comm)': results.m2USComm,
      'Triangulated Probability (%)': results.weighted,
      'Divergence (pp)': results.divergence,
      'Confidence': results.confidence,
      'Decision Band': results.band,
    }];
    const m1Detail = [{
      'Clinical Score': results.m1Scores.clinical,
      'Economic Score': results.m1Scores.economic,
      'Access Score': results.m1Scores.access,
      'Political Score': results.m1Scores.political,
    }];
    const m2Detail = [{
      'Clinical Benefit': results.m2Ratios.clinicalBenefit.toFixed(2),
      'Safety Profile': results.m2Ratios.safetyProfile.toFixed(2),
      'ICER': results.m2Ratios.icer.toFixed(2),
      'Target Population': results.m2Ratios.targetPopulation.toFixed(2),
      'Price vs SOC': results.m2Ratios.priceVsSoc.toFixed(2),
      'Evidence Quality': results.m2Ratios.evidenceQuality.toFixed(2),
      'Composite': results.compositeScore.toFixed(2),
    }];
    const marketData = results.multiMarketM1.map(m => ({
      'Market': m.market,
      'Model 1 Score': m.score,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), 'Summary');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(m1Detail), 'Model 1 Detail');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(m2Detail), 'Model 2 Ratios');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(marketData), 'Multi-Market');
    XLSX.writeFile(wb, `PA-Comparison-${mol.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = async () => {
    if (!mol || !results) return;
    const doc = (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.header}>
            <Text style={pdfStyles.headerTitle}>Pricing & Access — Combined Model Comparison</Text>
            <Text style={pdfStyles.headerSubtitle}>Generated {formatReportDate()} • BiOQUILL Analytics Platform</Text>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Molecule</Text>
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.value}>{mol.name} ({mol.indication})</Text>
              <Text style={pdfStyles.label}>{mol.company} • {mol.phase} • {mol.therapeuticArea}</Text>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Model Results</Text>
            <View style={pdfStyles.grid3}>
              <View style={[pdfStyles.col, pdfStyles.card]}>
                <Text style={pdfStyles.label}>Model 1 (MWPSPI)</Text>
                <Text style={[pdfStyles.valueXL, { color: getScoreColor(results.m1Score) }]}>{results.m1Score}%</Text>
              </View>
              <View style={[pdfStyles.col, pdfStyles.card]}>
                <Text style={pdfStyles.label}>Model 2 (Benchmark)</Text>
                <Text style={[pdfStyles.valueXL, { color: getScoreColor(results.m2USComm) }]}>{results.m2USComm}%</Text>
              </View>
              <View style={[pdfStyles.col, { padding: 12, borderRadius: 6, backgroundColor: results.weighted >= 75 ? '#dcfce7' : results.weighted >= 60 ? '#dbeafe' : results.weighted >= 45 ? '#fef9c3' : '#fee2e2' }]}>
                <Text style={pdfStyles.label}>Triangulated</Text>
                <Text style={[pdfStyles.valueXL, { color: getScoreColor(results.weighted) }]}>{results.weighted}%</Text>
              </View>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Analysis</Text>
            <View style={pdfStyles.grid2}>
              <View style={[pdfStyles.col, pdfStyles.card]}>
                <Text style={pdfStyles.label}>Divergence</Text>
                <Text style={pdfStyles.value}>{results.divergence}pp</Text>
              </View>
              <View style={[pdfStyles.col, pdfStyles.card]}>
                <Text style={pdfStyles.label}>Confidence</Text>
                <Text style={pdfStyles.value}>{results.confidence}</Text>
              </View>
            </View>
            <View style={pdfStyles.card}>
              <Text style={pdfStyles.label}>Decision Band</Text>
              <Text style={pdfStyles.value}>{results.band}</Text>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Model 1 Scores</Text>
            <View style={pdfStyles.grid2}>
              <View style={[pdfStyles.col, pdfStyles.card]}><Text style={pdfStyles.label}>Clinical</Text><Text style={pdfStyles.value}>{results.m1Scores.clinical}%</Text></View>
              <View style={[pdfStyles.col, pdfStyles.card]}><Text style={pdfStyles.label}>Economic</Text><Text style={pdfStyles.value}>{results.m1Scores.economic}%</Text></View>
            </View>
            <View style={pdfStyles.grid2}>
              <View style={[pdfStyles.col, pdfStyles.card]}><Text style={pdfStyles.label}>Access</Text><Text style={pdfStyles.value}>{results.m1Scores.access}%</Text></View>
              <View style={[pdfStyles.col, pdfStyles.card]}><Text style={pdfStyles.label}>Political</Text><Text style={pdfStyles.value}>{results.m1Scores.political}%</Text></View>
            </View>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Model 2 Comparator Ratios</Text>
            <View style={pdfStyles.grid3}>
              {Object.entries(results.m2Ratios).map(([key, val], i) => (
                <View key={i} style={[pdfStyles.col, pdfStyles.card]}>
                  <Text style={pdfStyles.label}>{key.replace(/([A-Z])/g, ' $1').trim()}</Text>
                  <Text style={pdfStyles.value}>{val.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={pdfStyles.footer}>
            <Text>BiOQUILL Analytics • Combined Model Comparison</Text>
            <Text>Confidential — For Internal Use Only</Text>
          </View>
        </Page>
      </Document>
    );
    await generateAndDownloadPDF(doc, `PA-Comparison-${mol.name.replace(/\s+/g, '-')}-${formatReportDate().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Layers className="h-6 w-6 text-primary" />
          Combined Model Comparison
        </CardTitle>
        <CardDescription className="text-base">
          Run all three calculators side-by-side for a single molecule — MWPSPI, Benchmark, and Triangulation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Pill className="h-3.5 w-3.5" /> Select Molecule
            </label>
            <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a molecule..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {allMolecules.map(m => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name} ({m.indication})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {mol && results && (
            <div className="flex gap-2">
              <Button size="sm" variant="export" className="gap-1.5" onClick={exportPDF}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button size="sm" variant="export" className="gap-1.5" onClick={exportExcel}>
                <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
              </Button>
            </div>
          )}
        </div>

        {!mol && (
          <div className="text-center py-12 text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a molecule above to see the side-by-side comparison across all three models.</p>
          </div>
        )}

        {mol && results && (
          <>
            {/* Molecule Info */}
            <div className="bg-muted/30 rounded-lg p-3 border">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="text-sm">{mol.phase}</Badge>
                <span className="text-sm font-semibold">{mol.name}</span>
                <span className="text-xs text-muted-foreground">{mol.indication} • {mol.company} • {mol.therapeuticArea}</span>
              </div>
            </div>

            {/* Three Model Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200">
                <CardContent className="p-4 text-center space-y-2">
                  <p className="text-xs font-semibold text-blue-600">Model 1 — MWPSPI</p>
                  <p className="text-4xl font-bold text-blue-700">{results.m1Score}%</p>
                  <p className="text-xs text-muted-foreground">Weighted scoring (US Market)</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t">
                    <span>Clinical: {results.m1Scores.clinical}%</span>
                    <span>Economic: {results.m1Scores.economic}%</span>
                    <span>Access: {results.m1Scores.access}%</span>
                    <span>Political: {results.m1Scores.political}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-200">
                <CardContent className="p-4 text-center space-y-2">
                  <p className="text-xs font-semibold text-green-600">Model 2 — Benchmark</p>
                  <p className="text-4xl font-bold text-green-700">{results.m2USComm}%</p>
                  <p className="text-xs text-muted-foreground">Comparator-based (US Commercial)</p>
                  <div className="grid grid-cols-2 gap-1 text-[10px] pt-2 border-t">
                    <span>Clinical: {results.m2Ratios.clinicalBenefit.toFixed(2)}</span>
                    <span>Safety: {results.m2Ratios.safetyProfile.toFixed(2)}</span>
                    <span>ICER: {results.m2Ratios.icer.toFixed(2)}</span>
                    <span>Composite: {results.compositeScore.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`border ${results.bandColor}`}>
                <CardContent className="p-4 text-center space-y-2">
                  <p className="text-xs font-semibold">Triangulated Result</p>
                  <p className="text-4xl font-bold">{results.weighted}%</p>
                  <Badge className={results.bandColor}>{results.band}</Badge>
                  <div className="text-[10px] pt-2 border-t space-y-0.5">
                    <p>Divergence: {results.divergence}pp</p>
                    <p>{results.confidence}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Multi-Market */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Model 1 — Multi-Market View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 md:grid-cols-4">
                  {results.multiMarketM1.map((m, i) => (
                    <div key={i} className="bg-muted/30 rounded-lg p-3 text-center border">
                      <p className="text-xs text-muted-foreground">{m.market}</p>
                      <p className={`text-2xl font-bold ${m.score >= 60 ? 'text-green-600' : m.score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {m.score}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visual Comparison Bar */}
            <div className="bg-muted/30 rounded-lg p-4 border space-y-3">
              <p className="text-xs font-semibold">Model Comparison Visualization</p>
              {[
                { label: "Model 1 (MWPSPI)", value: results.m1Score, color: "bg-blue-500" },
                { label: "Model 2 (Benchmark)", value: results.m2USComm, color: "bg-green-500" },
                { label: "Triangulated", value: results.weighted, color: "bg-primary" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs w-32 text-right">{item.label}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all flex items-center justify-end pr-2`} style={{ width: `${item.value}%` }}>
                      <span className="text-[10px] text-white font-bold">{item.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
