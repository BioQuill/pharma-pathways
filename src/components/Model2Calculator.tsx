import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calculator, TrendingUp, AlertTriangle, CheckCircle, Pill, Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import { getAllMolecules, mapTAToModel2Id, deriveModel2Ratios } from "@/lib/allMoleculesList";
import { Document, Page, Text, View, generateAndDownloadPDF, formatReportDate, getScoreColor, pdfStyles } from "@/lib/pdfGenerator";

const therapeuticAreas = [
  { id: "oncology", label: "1. Oncology/Hematology", rates: { usComm: 75, usMed: 80, uk: 70, germany: 55, japan: 35, china: 30, india: 25, brazil: 35 } },
  { id: "cardiovascular", label: "2. Cardiovascular", rates: { usComm: 60, usMed: 65, uk: 45, germany: 45, japan: 25, china: 25, india: 20, brazil: 25 } },
  { id: "neurology", label: "3. Neurology/Neuroscience", rates: { usComm: 65, usMed: 70, uk: 50, germany: 50, japan: 30, china: 28, india: 18, brazil: 28 } },
  { id: "psychiatry", label: "4. Psychiatry/Mental Health", rates: { usComm: 62, usMed: 58, uk: 48, germany: 46, japan: 28, china: 26, india: 15, brazil: 24 } },
  { id: "endocrinology", label: "5. Endocrinology & Metabolism", rates: { usComm: 58, usMed: 62, uk: 42, germany: 40, japan: 28, china: 22, india: 15, brazil: 22 } },
  { id: "immunology", label: "6. Immunology & Inflammation", rates: { usComm: 68, usMed: 70, uk: 48, germany: 50, japan: 32, china: 28, india: 18, brazil: 25 } },
  { id: "rheumatology", label: "7. Rheumatology", rates: { usComm: 66, usMed: 68, uk: 46, germany: 48, japan: 30, china: 26, india: 18, brazil: 24 } },
  { id: "infectious", label: "8. Infectious Diseases", rates: { usComm: 70, usMed: 72, uk: 65, germany: 55, japan: 35, china: 32, india: 28, brazil: 32 } },
  { id: "respiratory", label: "9. Respiratory/Pulmonology", rates: { usComm: 62, usMed: 65, uk: 46, germany: 48, japan: 28, china: 24, india: 20, brazil: 24 } },
  { id: "gastro", label: "10. Gastroenterology & Hepatology", rates: { usComm: 64, usMed: 68, uk: 47, germany: 48, japan: 30, china: 26, india: 19, brazil: 26 } },
  { id: "nephrology", label: "11. Nephrology/Renal", rates: { usComm: 63, usMed: 68, uk: 48, germany: 46, japan: 28, china: 26, india: 21, brazil: 26 } },
  { id: "dermatology", label: "12. Dermatology", rates: { usComm: 55, usMed: 50, uk: 40, germany: 45, japan: 25, china: 20, india: 15, brazil: 20 } },
  { id: "ophthalmology", label: "13. Ophthalmology", rates: { usComm: 72, usMed: 78, uk: 52, germany: 50, japan: 33, china: 28, india: 22, brazil: 28 } },
  { id: "rareDisease", label: "14. Rare Diseases/Orphan", rates: { usComm: 85, usMed: 90, uk: 85, germany: 75, japan: 50, china: 40, india: 35, brazil: 45 } },
  { id: "vaccines", label: "15. Vaccines & Virology", rates: { usComm: 68, usMed: 70, uk: 72, germany: 60, japan: 45, china: 50, india: 45, brazil: 48 } },
  { id: "womensHealth", label: "16. Women's Health", rates: { usComm: 52, usMed: 35, uk: 44, germany: 42, japan: 30, china: 28, india: 22, brazil: 26 } },
  { id: "urology", label: "17. Urology", rates: { usComm: 58, usMed: 62, uk: 44, germany: 44, japan: 26, china: 24, india: 20, brazil: 24 } },
  { id: "pain", label: "18. Pain Management/Anesthesia", rates: { usComm: 45, usMed: 48, uk: 38, germany: 40, japan: 22, china: 20, india: 16, brazil: 20 } },
  { id: "transplant", label: "19. Transplant & Cell/Gene", rates: { usComm: 82, usMed: 88, uk: 78, germany: 70, japan: 52, china: 38, india: 28, brazil: 32 } },
];

const pediatricBonuses: Record<string, number> = {
  usComm: 10, usMed: 12, uk: 15, germany: 12, japan: 10, china: 8, india: 12, brazil: 10,
};

const marketLabels: Record<string, string> = {
  usComm: "US Commercial", usMed: "US Medicare", uk: "UK NICE", germany: "Germany G-BA",
  japan: "Japan MHLW", china: "China NHSA", india: "India PM-JAY", brazil: "Brazil CONITEC",
};

interface AdjustmentToggle {
  label: string;
  value: number;
  enabled: boolean;
}

const defaultAdjustments: AdjustmentToggle[] = [
  { label: "Breakthrough Therapy Designation", value: 12, enabled: false },
  { label: "Orphan Drug Designation", value: 10, enabled: false },
  { label: "RMAT Designation", value: 12, enabled: false },
  { label: "QIDP Designation (Infectious)", value: 10, enabled: false },
  { label: "Pediatric Rare Disease PRV", value: 8, enabled: false },
  { label: "Medicare NCD Positive", value: 12, enabled: false },
  { label: "Guideline Inclusion (Class I)", value: 10, enabled: false },
  { label: "Outcomes-Based Contract", value: 8, enabled: false },
  { label: "PBM Tier 2 Preferred", value: 10, enabled: false },
  { label: "Budget Impact >$1B/Payer", value: -12, enabled: false },
  { label: "Black Box Warning", value: -10, enabled: false },
  { label: "DEA Schedule II", value: -15, enabled: false },
  { label: "Biosimilar/Generic Imminent", value: -13, enabled: false },
];

export interface CalculatorState {
  selectedTA: string;
  isPediatric: boolean;
  ratios: {
    clinicalBenefit: number;
    safetyProfile: number;
    icer: number;
    targetPopulation: number;
    priceVsSoc: number;
    evidenceQuality: number;
  };
  compositeScore: number;
  totalAdjustment: number;
  marketResults: {
    market: string;
    baseRate: number;
    pedBonus: number;
    adjustedBase: number;
    compositeResult: number;
    final: number;
  }[];
  activeAdjustments: string[];
}

interface Model2CalculatorProps {
  onStateChange?: (state: CalculatorState) => void;
}

export const Model2Calculator = ({ onStateChange }: Model2CalculatorProps) => {
  const allMolecules = useMemo(() => getAllMolecules(), []);
  const [selectedMolecule, setSelectedMolecule] = useState("manual");
  const resultRef = useRef<HTMLDivElement>(null);

  const [selectedTA, setSelectedTA] = useState("oncology");
  const [isPediatric, setIsPediatric] = useState(false);

  // 6 ratio dimensions
  const [ratios, setRatios] = useState({
    clinicalBenefit: 1.1,
    safetyProfile: 1.1,
    icer: 1.0,
    targetPopulation: 1.0,
    priceVsSoc: 1.0,
    evidenceQuality: 1.0,
  });

  // When a molecule is selected, auto-populate ratios and TA
  const handleMoleculeSelect = (molId: string) => {
    setSelectedMolecule(molId);
    if (molId === "manual") return;
    const mol = allMolecules.find(m => m.id === molId);
    if (!mol) return;
    const taId = mapTAToModel2Id(mol.therapeuticArea);
    if (taId) setSelectedTA(taId);
    const derived = deriveModel2Ratios(mol);
    setRatios(derived);
  };

  const [adjustments, setAdjustments] = useState<AdjustmentToggle[]>(defaultAdjustments);

  const ta = therapeuticAreas.find((t) => t.id === selectedTA)!;

  const compositeScore = useMemo(() => {
    const vals = Object.values(ratios);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [ratios]);

  const totalAdjustment = useMemo(() => {
    return adjustments.filter((a) => a.enabled).reduce((sum, a) => sum + a.value, 0);
  }, [adjustments]);

  const marketResults = useMemo(() => {
    return Object.entries(ta.rates).map(([key, baseRate]) => {
      const pedBonus = isPediatric ? pediatricBonuses[key] : 0;
      const adjustedBase = baseRate + pedBonus;
      const compositeResult = adjustedBase * compositeScore;
      const final = Math.min(95, Math.max(5, Math.round(compositeResult + totalAdjustment)));
      return { market: marketLabels[key], baseRate, pedBonus, adjustedBase, compositeResult: Math.round(compositeResult), final };
    });
  }, [ta, compositeScore, totalAdjustment, isPediatric]);

  // Emit state to parent
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        selectedTA: ta.label,
        isPediatric,
        ratios,
        compositeScore,
        totalAdjustment,
        marketResults,
        activeAdjustments: adjustments.filter(a => a.enabled).map(a => a.label),
      });
    }
  }, [selectedTA, isPediatric, ratios, compositeScore, totalAdjustment, marketResults, adjustments, onStateChange, ta.label]);

  const updateRatio = (key: keyof typeof ratios, value: number) => {
    setRatios((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAdjustment = (idx: number) => {
    setAdjustments((prev) => prev.map((a, i) => (i === idx ? { ...a, enabled: !a.enabled } : a)));
  };

  const getScoreColor = (score: number) => {
    if (score > 1.2) return "text-green-600";
    if (score >= 1.0) return "text-blue-600";
    if (score >= 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getProbColor = (prob: number) => {
    if (prob >= 80) return "text-green-600 border-green-300";
    if (prob >= 60) return "text-blue-600 border-blue-300";
    if (prob >= 40) return "text-yellow-600 border-yellow-300";
    return "text-red-600 border-red-300";
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" />
              Molecule Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5" /> Select Molecule (Optional)
              </Label>
              <Select value={selectedMolecule} onValueChange={handleMoleculeSelect}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Manual input" /></SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="manual">— Manual Input —</SelectItem>
                  {allMolecules.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} ({m.indication})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMolecule !== "manual" && (
                <p className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-1.5 rounded border border-blue-200 mt-1.5">
                  TA and ratios auto-populated. Adjust sliders to fine-tune.
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-semibold">Therapeutic Area</Label>
              <Select value={selectedTA} onValueChange={setSelectedTA}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {therapeuticAreas.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Pediatric Indication (Bonus Modifier)</Label>
              <Switch checked={isPediatric} onCheckedChange={setIsPediatric} />
            </div>
            {isPediatric && (
              <p className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200">
                Pediatric bonus applied: US +10%, UK +15%, Germany +12%, Japan +10%, China +8%, India +12%, Brazil +10%
              </p>
            )}
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 gap-2 w-full mt-2" onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
              <Calculator className="h-4 w-4" />
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Composite Score Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Composite Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <div className={`text-5xl font-bold ${getScoreColor(compositeScore)}`}>
              {compositeScore.toFixed(2)}
            </div>
            <Badge variant="outline" className={`text-sm ${compositeScore > 1.2 ? 'text-green-600 border-green-300' : compositeScore >= 1.0 ? 'text-blue-600 border-blue-300' : compositeScore >= 0.8 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
              {compositeScore > 1.2 ? 'Significantly better' : compositeScore >= 1.0 ? 'Similar to comparators' : compositeScore >= 0.8 ? 'Slightly worse' : 'Significantly worse'}
            </Badge>
            <p className="text-xs text-muted-foreground text-center">
              Total Market Adjustment: <strong className={totalAdjustment >= 0 ? "text-green-600" : "text-red-600"}>
                {totalAdjustment >= 0 ? '+' : ''}{totalAdjustment}%
              </strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ratio Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparator Ratio Inputs</CardTitle>
          <CardDescription>Adjust each dimension ratio (your molecule / comparator average). For safety and ICER, inverse ratios are used (comparator / your molecule).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "clinicalBenefit" as const, label: "Clinical Benefit", desc: "Effect size ratio" },
              { key: "safetyProfile" as const, label: "Safety Profile", desc: "Inverse: comparator AE / yours" },
              { key: "icer" as const, label: "ICER", desc: "Inverse: comparator cost / yours" },
              { key: "targetPopulation" as const, label: "Target Population", desc: "Your population / comparator" },
              { key: "priceVsSoc" as const, label: "Price vs. SOC", desc: "Inverse: comparator price / yours" },
              { key: "evidenceQuality" as const, label: "Evidence Quality", desc: "RCT design score ratio" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{label}</Label>
                  <span className={`text-sm font-bold ${getScoreColor(ratios[key])}`}>{ratios[key].toFixed(2)}</span>
                </div>
                <Slider
                  value={[ratios[key]]}
                  onValueChange={([v]) => updateRatio(key, v)}
                  min={0.3}
                  max={2.5}
                  step={0.01}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market-Specific Adjustments</CardTitle>
          <CardDescription>Toggle applicable adjustments — added/subtracted after composite score calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {adjustments.map((adj, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded border text-xs cursor-pointer transition-colors ${adj.enabled ? (adj.value > 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-300' : 'bg-red-50 dark:bg-red-950/20 border-red-300') : 'bg-muted/30'}`}
                onClick={() => toggleAdjustment(idx)}
              >
                <span className="font-medium">{adj.label}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`text-xs ${adj.value > 0 ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'}`}>
                    {adj.value > 0 ? '+' : ''}{adj.value}%
                  </Badge>
                  <Switch checked={adj.enabled} onCheckedChange={() => toggleAdjustment(idx)} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <div ref={resultRef}>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-primary" />
            Final Probability by Market
          </CardTitle>
          <CardDescription>
            Formula: (Base Rate{isPediatric ? ' + Pediatric Bonus' : ''}) × Composite Score ({compositeScore.toFixed(2)}) + Adjustments ({totalAdjustment >= 0 ? '+' : ''}{totalAdjustment}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Market</th>
                  <th className="text-center p-3 font-semibold">Base Rate</th>
                  {isPediatric && <th className="text-center p-3 font-semibold">Ped. Bonus</th>}
                  <th className="text-center p-3 font-semibold">× Composite</th>
                  <th className="text-center p-3 font-semibold">+ Adj.</th>
                  <th className="text-center p-3 font-semibold">Final Prob.</th>
                </tr>
              </thead>
              <tbody>
                {marketResults.map((r, i) => (
                  <tr key={i} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{r.market}</td>
                    <td className="p-3 text-center">{r.baseRate}%</td>
                    {isPediatric && (
                      <td className="p-3 text-center">
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">+{r.pedBonus}%</Badge>
                      </td>
                    )}
                    <td className="p-3 text-center">{r.compositeResult}%</td>
                    <td className="p-3 text-center">
                      <span className={totalAdjustment >= 0 ? "text-green-600" : "text-red-600"}>
                        {totalAdjustment >= 0 ? '+' : ''}{totalAdjustment}%
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`text-sm font-bold ${getProbColor(r.final)}`}>
                        {r.final}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
            <div className="flex gap-4">
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Cap: 95% max</Badge>
              <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">Floor: 5% min</Badge>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={async () => {
                const molName = selectedMolecule !== "manual"
                  ? allMolecules.find(m => m.id === selectedMolecule)?.name || "Manual"
                  : "Manual Input";
                const molIndication = selectedMolecule !== "manual"
                  ? allMolecules.find(m => m.id === selectedMolecule)?.indication || ""
                  : "";
                const doc = (
                  <Document>
                    <Page size="A4" orientation="landscape" style={pdfStyles.page}>
                      <View style={pdfStyles.header}>
                        <Text style={pdfStyles.headerTitle}>Comparative Payer Likelihood Report</Text>
                        <Text style={pdfStyles.headerSubtitle}>Generated {formatReportDate()} • BiOQUILL Analytics Platform</Text>
                      </View>
                      <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Analysis Configuration</Text>
                        <View style={pdfStyles.grid2}>
                          <View style={[pdfStyles.col, pdfStyles.card]}>
                            <Text style={pdfStyles.label}>Molecule</Text>
                            <Text style={pdfStyles.value}>{molName}{molIndication ? ` (${molIndication})` : ""}</Text>
                          </View>
                          <View style={[pdfStyles.col, pdfStyles.card]}>
                            <Text style={pdfStyles.label}>Therapeutic Area</Text>
                            <Text style={pdfStyles.value}>{ta.label}</Text>
                          </View>
                        </View>
                        <View style={pdfStyles.grid2}>
                          <View style={[pdfStyles.col, pdfStyles.card]}>
                            <Text style={pdfStyles.label}>Pediatric Indication</Text>
                            <Text style={pdfStyles.value}>{isPediatric ? "Yes" : "No"}</Text>
                          </View>
                          <View style={[pdfStyles.col, pdfStyles.card]}>
                            <Text style={pdfStyles.label}>Composite Score</Text>
                            <Text style={[pdfStyles.value, { color: getScoreColor(compositeScore * 50) }]}>{compositeScore.toFixed(2)}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Comparator Ratios</Text>
                        <View style={pdfStyles.grid3}>
                          {[
                            { label: "Clinical Benefit", val: ratios.clinicalBenefit },
                            { label: "Safety Profile", val: ratios.safetyProfile },
                            { label: "ICER", val: ratios.icer },
                            { label: "Target Population", val: ratios.targetPopulation },
                            { label: "Price vs. SOC", val: ratios.priceVsSoc },
                            { label: "Evidence Quality", val: ratios.evidenceQuality },
                          ].map((r, i) => (
                            <View key={i} style={[pdfStyles.col, pdfStyles.card]}>
                              <Text style={pdfStyles.label}>{r.label}</Text>
                              <Text style={pdfStyles.value}>{r.val.toFixed(2)}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                      <View style={pdfStyles.section}>
                        <Text style={pdfStyles.sectionTitle}>Market Results</Text>
                        {marketResults.map((r, i) => (
                          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottom: '1 solid #e5e7eb' }}>
                            <Text style={{ fontSize: 9, flex: 2 }}>{r.market}</Text>
                            <Text style={{ fontSize: 9, flex: 1, textAlign: 'center' }}>Base: {r.baseRate}%</Text>
                            <Text style={{ fontSize: 9, flex: 1, textAlign: 'center' }}>× {compositeScore.toFixed(2)} = {r.compositeResult}%</Text>
                            <Text style={{ fontSize: 11, flex: 1, textAlign: 'right', fontWeight: 'bold', color: getScoreColor(r.final) }}>{r.final}%</Text>
                          </View>
                        ))}
                      </View>
                      {adjustments.filter(a => a.enabled).length > 0 && (
                        <View style={pdfStyles.section}>
                          <Text style={pdfStyles.sectionTitle}>Active Adjustments (Total: {totalAdjustment >= 0 ? '+' : ''}{totalAdjustment}%)</Text>
                          {adjustments.filter(a => a.enabled).map((a, i) => (
                            <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>• {a.label}: {a.value > 0 ? '+' : ''}{a.value}%</Text>
                          ))}
                        </View>
                      )}
                      <View style={pdfStyles.footer}>
                        <Text>BiOQUILL Analytics • Model 2 Calculator</Text>
                        <Text>Confidential — For Internal Use Only</Text>
                      </View>
                    </Page>
                  </Document>
                );
                await generateAndDownloadPDF(doc, `Model2-Report-${molName.replace(/\s+/g, '-')}-${formatReportDate().replace(/\s+/g, '-')}.pdf`);
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => {
                const molName = selectedMolecule !== "manual"
                  ? allMolecules.find(m => m.id === selectedMolecule)?.name || "Manual"
                  : "Manual Input";
                const data = marketResults.map(r => ({
                  'Molecule': molName,
                  'Therapeutic Area': ta.label,
                  'Pediatric': isPediatric ? 'Yes' : 'No',
                  'Market': r.market,
                  'Base Rate (%)': r.baseRate,
                  'Pediatric Bonus (%)': r.pedBonus,
                  'Adjusted Base (%)': r.adjustedBase,
                  'Composite Score': compositeScore.toFixed(2),
                  '× Composite (%)': r.compositeResult,
                  'Total Adjustment (%)': totalAdjustment,
                  'Final Probability (%)': r.final,
                }));
                // Add ratios sheet
                const ratioData = [{
                  'Clinical Benefit': ratios.clinicalBenefit.toFixed(2),
                  'Safety Profile': ratios.safetyProfile.toFixed(2),
                  'ICER': ratios.icer.toFixed(2),
                  'Target Population': ratios.targetPopulation.toFixed(2),
                  'Price vs SOC': ratios.priceVsSoc.toFixed(2),
                  'Evidence Quality': ratios.evidenceQuality.toFixed(2),
                  'Composite': compositeScore.toFixed(2),
                }];
                const ws = XLSX.utils.json_to_sheet(data);
                const ws2 = XLSX.utils.json_to_sheet(ratioData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Market Results');
                XLSX.utils.book_append_sheet(wb, ws2, 'Comparator Ratios');
                XLSX.writeFile(wb, `Model2-${molName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`);
              }}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
