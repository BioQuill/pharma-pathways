import { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, TrendingUp, Target, Pill, Download, FileSpreadsheet, ChevronDown, X } from "lucide-react";
import { SimulatorLayout } from "./SimulatorLayout";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { mapTAToModel1Id, deriveModel1Scores } from "@/lib/allMoleculesList";
import { Document, Page, Text, View, StyleSheet, generateAndDownloadPDF, formatReportDate, getScoreColor, pdfStyles, PDFWatermark } from "@/lib/pdfGenerator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useSessionMolecule } from "@/contexts/SessionMoleculeContext";

const markets = [
  { id: "us", label: "🇺🇸 United States", clinical: 25, economic: 35, access: 25, political: 15 },
  { id: "uk", label: "🇬🇧 United Kingdom", clinical: 35, economic: 45, access: 10, political: 10 },
  { id: "de", label: "🇩🇪 Germany", clinical: 40, economic: 30, access: 20, political: 10 },
  { id: "jp", label: "🇯🇵 Japan", clinical: 30, economic: 25, access: 30, political: 15 },
  { id: "cn", label: "🇨🇳 China", clinical: 25, economic: 35, access: 30, political: 10 },
  { id: "in", label: "🇮🇳 India", clinical: 20, economic: 40, access: 30, political: 10 },
  { id: "br", label: "🇧🇷 Brazil", clinical: 30, economic: 35, access: 25, political: 10 },
];

const therapeuticAreas = [
  { id: "oncology", label: "Oncology & Hematology", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "cardiology", label: "Cardiovascular", adjustments: { us: { clinical: 25, economic: 35, access: 25, political: 15 } } },
  { id: "neurology", label: "Neurology", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "dermatology", label: "Dermatology", adjustments: { us: { clinical: 25, economic: 30, access: 30, political: 15 } } },
  { id: "endocrinology", label: "Endocrinology & Metabolism", adjustments: { us: { clinical: 25, economic: 35, access: 25, political: 15 } } },
  { id: "immunology", label: "Immunology & Inflammation", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "infectious", label: "Infectious Disease", adjustments: { us: { clinical: 35, economic: 25, access: 25, political: 15 } } },
  { id: "respiratory", label: "Respiratory & Pulmonary", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "gastro", label: "Gastroenterology & Hepatology", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "hematology", label: "Hematology (non-oncology)", adjustments: { us: { clinical: 35, economic: 25, access: 25, political: 15 } } },
  { id: "rheumatology", label: "Musculoskeletal & Rheumatology", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "ophthalmology", label: "Ophthalmology", adjustments: { us: { clinical: 35, economic: 25, access: 25, political: 15 } } },
  { id: "uro_nephro", label: "Nephrology & Renal", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "psychiatry", label: "Psychiatry & Mental Health", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "pain", label: "Pain & Anaesthesia", adjustments: { us: { clinical: 30, economic: 25, access: 25, political: 20 } } },
  { id: "rareDisease", label: "Rare Disease & Orphan", adjustments: { us: { clinical: 40, economic: 20, access: 25, political: 15 } } },
  { id: "vaccines", label: "Vaccines & Preventive", adjustments: { us: { clinical: 35, economic: 25, access: 25, political: 15 } } },
  { id: "womensHealth", label: "Women's Health", adjustments: { us: { clinical: 25, economic: 30, access: 25, political: 20 } } },
  { id: "urology", label: "Urology", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
  { id: "pediatrics", label: "Pediatrics", adjustments: { us: { clinical: 30, economic: 30, access: 25, political: 15 } } },
];

function getProbabilityBand(score: number) {
  if (score >= 80) return { label: "Very High", color: "bg-green-100 text-green-800 border-green-200", description: ">85% approval likelihood" };
  if (score >= 60) return { label: "High", color: "bg-blue-100 text-blue-800 border-blue-200", description: ">70% approval likelihood" };
  if (score >= 40) return { label: "Moderate", color: "bg-yellow-100 text-yellow-800 border-yellow-200", description: "50-60% approval" };
  if (score >= 20) return { label: "Low", color: "bg-orange-100 text-orange-800 border-orange-200", description: "<40% approval" };
  return { label: "Very Low", color: "bg-red-100 text-red-800 border-red-200", description: "Likely denial" };
}

interface MWPSPICalculatorProps {
  molecules?: any[];
}

export const MWPSPICalculator = ({ molecules }: MWPSPICalculatorProps) => {
  const { sessionMolecule } = useSessionMolecule();
  const resultRef = useRef<HTMLDivElement>(null);

  const [selectedMarket, setSelectedMarket] = useState("us");
  const [selectedTAs, setSelectedTAs] = useState<string[]>(["oncology"]);

  const toggleTA = (taId: string) => {
    setSelectedTAs(prev => {
      if (prev.includes(taId)) {
        if (prev.length === 1) return prev; // min 1
        return prev.filter(id => id !== taId);
      }
      if (prev.length >= 5) return prev; // max 5
      return [...prev, taId];
    });
  };
  const [clinicalScore, setClinicalScore] = useState([50]);
  const [economicScore, setEconomicScore] = useState([50]);
  const [accessScore, setAccessScore] = useState([50]);
  const [politicalScore, setPoliticalScore] = useState([50]);
  const [adjustmentPoints, setAdjustmentPoints] = useState([0]);
  const [userAdjusted, setUserAdjusted] = useState(false);

  // Auto-populate when session molecule changes
  useEffect(() => {
    if (sessionMolecule) {
      const taId = mapTAToModel1Id(sessionMolecule.therapeuticArea);
      if (taId) setSelectedTAs([taId]);
      const scores = deriveModel1Scores(sessionMolecule);
      setClinicalScore([scores.clinical]);
      setEconomicScore([scores.economic]);
      setAccessScore([scores.access]);
      setPoliticalScore([scores.political]);
    }
  }, [sessionMolecule]);

  const market = markets.find(m => m.id === selectedMarket)!;

  const mwpspi = useMemo(() => {
    const clinicalWeighted = (clinicalScore[0] / 100) * market.clinical;
    const economicWeighted = (economicScore[0] / 100) * market.economic;
    const accessWeighted = (accessScore[0] / 100) * market.access;
    const politicalWeighted = (politicalScore[0] / 100) * market.political;
    const raw = clinicalWeighted + economicWeighted + accessWeighted + politicalWeighted + adjustmentPoints[0];
    return Math.min(100, Math.max(0, Math.round(raw)));
  }, [clinicalScore, economicScore, accessScore, politicalScore, adjustmentPoints, market]);

  const band = getProbabilityBand(mwpspi);

  const clinicalContribution = ((clinicalScore[0] / 100) * market.clinical).toFixed(1);
  const economicContribution = ((economicScore[0] / 100) * market.economic).toFixed(1);
  const accessContribution = ((accessScore[0] / 100) * market.access).toFixed(1);
  const politicalContribution = ((politicalScore[0] / 100) * market.political).toFixed(1);

  if (!sessionMolecule) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-semibold">No Molecule Selected</p>
          <p className="text-sm text-muted-foreground mt-2">
            Select a molecule using "Use in Simulator →" to run this model
          </p>
        </CardContent>
      </Card>
    );
  }

  // Wrap slider setters to track user adjustments
  const handleSlider = (setter: (v: number[]) => void) => (v: number[]) => {
    setUserAdjusted(true);
    setter(v);
  };

  // Context chart: horizontal comparison bar vs TA benchmark
  const contextChart = (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">MWPSPI Score vs Benchmarks — {market.label}</h4>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium truncate">{sessionMolecule.name}</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all flex items-center justify-end pr-2" style={{ width: `${mwpspi}%` }}>
              <span className="text-[10px] font-bold text-primary-foreground">{mwpspi}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 text-xs text-right font-medium text-muted-foreground">TA Benchmark</div>
          <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-muted-foreground/30 rounded-full transition-all flex items-center justify-end pr-2" style={{ width: '62%' }}>
              <span className="text-[10px] font-bold text-muted-foreground">62</span>
            </div>
          </div>
        </div>
      </div>
      {/* Visual stacked bar */}
      <div className="space-y-1">
        <div className="flex h-6 rounded-lg overflow-hidden border">
          <div className="bg-blue-500/80 transition-all" style={{ width: `${(parseFloat(clinicalContribution) / 100) * 100}%` }} title={`Clinical: ${clinicalContribution}`} />
          <div className="bg-green-500/80 transition-all" style={{ width: `${(parseFloat(economicContribution) / 100) * 100}%` }} title={`Economic: ${economicContribution}`} />
          <div className="bg-orange-500/80 transition-all" style={{ width: `${(parseFloat(accessContribution) / 100) * 100}%` }} title={`Access: ${accessContribution}`} />
          <div className="bg-purple-500/80 transition-all" style={{ width: `${(parseFloat(politicalContribution) / 100) * 100}%` }} title={`Political: ${politicalContribution}`} />
        </div>
        <div className="flex flex-wrap gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Clinical: {clinicalContribution}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Economic: {economicContribution}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> Access: {accessContribution}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Political: {politicalContribution}</span>
        </div>
      </div>
    </div>
  );

  // Parameters content
  const parametersContent = (
    <div className="space-y-6">
      {/* Market & TA Selection */}
      <div className="grid gap-4 md:grid-cols-3 items-end">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Select Market</label>
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {markets.map(m => (<SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Select Therapeutic Area(s) <span className="text-xs text-muted-foreground font-normal">(1–5)</span></label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" className="w-full justify-between h-10 font-normal">
                <span className="truncate text-sm">
                  {selectedTAs.length === 1 ? therapeuticAreas.find(t => t.id === selectedTAs[0])?.label : `${selectedTAs.length} TAs selected`}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2 max-h-[300px] overflow-y-auto" align="start">
              <div className="space-y-1">
                {therapeuticAreas.map(ta => (
                  <label key={ta.id} className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-muted/50 ${selectedTAs.includes(ta.id) ? 'bg-primary/5' : ''}`}>
                    <Checkbox checked={selectedTAs.includes(ta.id)} onCheckedChange={() => toggleTA(ta.id)} disabled={!selectedTAs.includes(ta.id) && selectedTAs.length >= 5} />
                    {ta.label}
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {selectedTAs.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {selectedTAs.map(taId => {
                const ta = therapeuticAreas.find(t => t.id === taId);
                return (<Badge key={taId} variant="secondary" className="text-xs gap-1">{ta?.label}<X className="h-3 w-3 cursor-pointer" onClick={() => toggleTA(taId)} /></Badge>);
              })}
            </div>
          )}
        </div>
      </div>

      {/* Weight Display */}
      <div className="bg-muted/50 rounded-lg p-3 border">
        <h4 className="text-sm font-semibold mb-2">Weight Distribution for {market.label}</h4>
        <div className="flex h-6 rounded-full overflow-hidden text-[10px] font-bold">
          <div className="bg-blue-500 flex items-center justify-center text-white" style={{ width: `${market.clinical}%` }}>Clinical {market.clinical}%</div>
          <div className="bg-green-500 flex items-center justify-center text-white" style={{ width: `${market.economic}%` }}>Economic {market.economic}%</div>
          <div className="bg-orange-500 flex items-center justify-center text-white" style={{ width: `${market.access}%` }}>Access {market.access}%</div>
          <div className="bg-purple-500 flex items-center justify-center text-white" style={{ width: `${market.political}%` }}>Political {market.political}%</div>
        </div>
      </div>

      {/* Score Sliders */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-blue-600">Clinical Score</label>
            <div className="flex items-center gap-2"><Badge variant="outline" className="text-blue-600 border-blue-300">{clinicalScore[0]}%</Badge><span className="text-xs text-muted-foreground">→ {clinicalContribution} pts</span></div>
          </div>
          <Slider value={clinicalScore} onValueChange={handleSlider(setClinicalScore)} max={100} step={1} className="w-full" />
          <p className="text-[10px] text-muted-foreground">Efficacy vs. SOC, safety profile, unmet need, evidence quality</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-green-600">Economic Score</label>
            <div className="flex items-center gap-2"><Badge variant="outline" className="text-green-600 border-green-300">{economicScore[0]}%</Badge><span className="text-xs text-muted-foreground">→ {economicContribution} pts</span></div>
          </div>
          <Slider value={economicScore} onValueChange={handleSlider(setEconomicScore)} max={100} step={1} className="w-full" />
          <p className="text-[10px] text-muted-foreground">ICER vs. threshold, budget impact, cost offsets documented</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-orange-600">Access Score</label>
            <div className="flex items-center gap-2"><Badge variant="outline" className="text-orange-600 border-orange-300">{accessScore[0]}%</Badge><span className="text-xs text-muted-foreground">→ {accessContribution} pts</span></div>
          </div>
          <Slider value={accessScore} onValueChange={handleSlider(setAccessScore)} max={100} step={1} className="w-full" />
          <p className="text-[10px] text-muted-foreground">Formulary positioning, prior auth burden, guideline inclusion</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-purple-600">Political Score</label>
            <div className="flex items-center gap-2"><Badge variant="outline" className="text-purple-600 border-purple-300">{politicalScore[0]}%</Badge><span className="text-xs text-muted-foreground">→ {politicalContribution} pts</span></div>
          </div>
          <Slider value={politicalScore} onValueChange={handleSlider(setPoliticalScore)} max={100} step={1} className="w-full" />
          <p className="text-[10px] text-muted-foreground">Regulatory designation, risk-sharing willingness, society endorsement</p>
        </div>
      </div>

      {/* Adjustment Points */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Payer-Specific Adjustments</label>
          <Badge variant="outline" className={adjustmentPoints[0] >= 0 ? "text-green-600 border-green-300" : "text-red-600 border-red-300"}>
            {adjustmentPoints[0] > 0 ? "+" : ""}{adjustmentPoints[0]} pts
          </Badge>
        </div>
        <Slider value={adjustmentPoints} onValueChange={handleSlider(setAdjustmentPoints)} min={-30} max={30} step={1} className="w-full" />
        <p className="text-[10px] text-muted-foreground">Add/subtract for payer-specific factors</p>
      </div>

      {/* Detailed calculation */}
      <div className="font-mono text-xs text-muted-foreground border-t pt-2">
        <p>Calculation: ({clinicalScore[0]}% × {market.clinical}W) + ({economicScore[0]}% × {market.economic}W) + ({accessScore[0]}% × {market.access}W) + ({politicalScore[0]}% × {market.political}W) + ({adjustmentPoints[0]})</p>
        <p>= {clinicalContribution} + {economicContribution} + {accessContribution} + {politicalContribution} + ({adjustmentPoints[0]}) = <strong>{mwpspi}</strong></p>
      </div>

      {/* PDF Export */}
      <Button
        size="sm"
        variant="export"
        className="gap-1.5"
        onClick={async () => {
          const molName = sessionMolecule?.name || "Manual Input";
          const molIndication = sessionMolecule?.indication || "";
          const marketObj = markets.find(m => m.id === selectedMarket)!;
          const taLabels = selectedTAs.map(id => therapeuticAreas.find(t => t.id === id)?.label).filter(Boolean).join(', ');
          const doc = (
            <Document>
              <Page size="A4" style={pdfStyles.page}>
                <View style={pdfStyles.header}>
                  <Text style={pdfStyles.headerTitle}>MWPSPI Calculator Report</Text>
                  <Text style={pdfStyles.headerSubtitle}>Generated {formatReportDate()} • BiOQUILL Analytics Platform</Text>
                </View>
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>Analysis Configuration</Text>
                  <View style={pdfStyles.card}>
                    <Text style={pdfStyles.label}>Molecule</Text>
                    <Text style={pdfStyles.value}>{molName}{molIndication ? ` (${molIndication})` : ""}</Text>
                  </View>
                  <View style={pdfStyles.grid2}>
                    <View style={[pdfStyles.col, pdfStyles.card]}>
                      <Text style={pdfStyles.label}>Market</Text>
                      <Text style={pdfStyles.value}>{marketObj.label}</Text>
                    </View>
                    <View style={[pdfStyles.col, pdfStyles.card]}>
                     <Text style={pdfStyles.label}>Therapeutic Area(s)</Text>
                     <Text style={pdfStyles.value}>{taLabels}</Text>
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.section}>
                  <Text style={pdfStyles.sectionTitle}>MWPSPI Score</Text>
                  <View style={{ padding: 16, borderRadius: 8, backgroundColor: mwpspi >= 80 ? '#dcfce7' : mwpspi >= 60 ? '#dbeafe' : mwpspi >= 40 ? '#fef9c3' : '#fee2e2', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color: getScoreColor(mwpspi) }}>{mwpspi}</Text>
                    <Text style={{ fontSize: 10, color: '#6b7280' }}>/100 — {band.label}</Text>
                  </View>
                </View>
                <View style={pdfStyles.methodologyNote}>
                  <Text style={pdfStyles.methodologyTitle}>Note</Text>
                  <Text style={pdfStyles.methodologyText}>Proprietary scoring methodology. Detailed formulas are confidential.</Text>
                </View>
                <View style={pdfStyles.footer}><Text>BiOQUILL Analytics • MWPSPI Calculator</Text></View>
                <PDFWatermark />
              </Page>
            </Document>
          );
          await generateAndDownloadPDF(doc, `MWPSPI-Report-${molName.replace(/\s+/g, '-')}-${formatReportDate().replace(/\s+/g, '-')}.pdf`);
        }}
      >
        <Download className="h-3.5 w-3.5" />
        Export PDF
      </Button>
    </div>
  );

  return (
    <SimulatorLayout
      badgeValue={mwpspi}
      badgeLabel="MWPSPI Score"
      badgeSuffix="/100"
      principle={`${sessionMolecule.name} scores ${mwpspi}/100 on the Market-Weighted Payer Support Probability Index for ${market.label} — ${band.label}.`}
      autoBaseline={!!sessionMolecule && !userAdjusted}
      chart={contextChart}
      parameters={parametersContent}
      secondaryStats={[
        { label: "Band", value: band.label },
        { label: "Market", value: market.label },
      ]}
    />
  );
};
