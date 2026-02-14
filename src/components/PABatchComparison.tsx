import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Users, Download, FileSpreadsheet, TrendingUp, ArrowUpDown, X, Search } from "lucide-react";
import { getAllMolecules, deriveModel1Scores, mapTAToModel2Id, deriveModel2Ratios } from "@/lib/allMoleculesList";
import { Document, Page, Text, View, generateAndDownloadPDF, formatReportDate, getScoreColor, pdfStyles } from "@/lib/pdfGenerator";
import * as XLSX from 'xlsx';

const model1USWeights = { clinical: 25, economic: 35, access: 25, political: 15 };

const model2TAs: Record<string, number> = {
  oncology: 75, cardiovascular: 60, neurology: 65, endocrinology: 58, immunology: 68,
  infectious: 70, dermatology: 55, rheumatology: 66, hematology: 72,
  psychiatry: 62, respiratory: 62, gastro: 64, nephrology: 63,
  ophthalmology: 72, rareDisease: 85, vaccines: 68, womensHealth: 52,
  urology: 58, pain: 45, transplant: 82,
};

interface MolResult {
  id: string;
  name: string;
  indication: string;
  company: string;
  phase: string;
  ta: string;
  m1Score: number;
  m2Score: number;
  triangulated: number;
  divergence: number;
  band: string;
  bandColor: string;
  confidence: string;
}

function computeResults(mol: any): MolResult {
  const m1Scores = deriveModel1Scores(mol);
  const m1Score = Math.min(100, Math.max(0, Math.round(
    (m1Scores.clinical / 100) * model1USWeights.clinical +
    (m1Scores.economic / 100) * model1USWeights.economic +
    (m1Scores.access / 100) * model1USWeights.access +
    (m1Scores.political / 100) * model1USWeights.political
  )));

  const m2Ratios = deriveModel2Ratios(mol);
  const vals = Object.values(m2Ratios);
  const composite = vals.reduce((a, b) => a + b, 0) / vals.length;
  const taId = mapTAToModel2Id(mol.therapeuticArea) || "oncology";
  const baseRate = model2TAs[taId] || 60;
  const m2Score = Math.min(95, Math.max(5, Math.round(baseRate * composite)));

  const w1 = 0.4, w2 = 0.6;
  const weighted = parseFloat((m1Score * w1 + m2Score * w2).toFixed(1));
  const divergence = Math.abs(m1Score - m2Score);

  let confidence: string;
  if (divergence <= 10 && weighted >= 70) confidence = "High";
  else if (divergence <= 10 && weighted >= 45) confidence = "Moderate";
  else if (divergence > 20) confidence = "Low (Divergent)";
  else confidence = "Low";

  let band: string, bandColor: string;
  if (weighted >= 75) { band = "Accelerate"; bandColor = "bg-green-100 text-green-800 border-green-300"; }
  else if (weighted >= 60) { band = "Proceed"; bandColor = "bg-blue-100 text-blue-800 border-blue-300"; }
  else if (weighted >= 45) { band = "Deep-Dive"; bandColor = "bg-yellow-100 text-yellow-800 border-yellow-300"; }
  else { band = "Pause/Pivot"; bandColor = "bg-red-100 text-red-800 border-red-300"; }

  return {
    id: mol.id, name: mol.name, indication: mol.indication || "",
    company: mol.company, phase: mol.phase, ta: mol.therapeuticArea,
    m1Score, m2Score, triangulated: weighted, divergence, band, bandColor, confidence,
  };
}

type SortKey = "triangulated" | "m1Score" | "m2Score" | "divergence" | "name";

export const PABatchComparison = () => {
  const allMolecules = useMemo(() => getAllMolecules(), []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("triangulated");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filteredMolecules = useMemo(() => {
    if (!search) return allMolecules;
    const q = search.toLowerCase();
    return allMolecules.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.indication || "").toLowerCase().includes(q) ||
      m.company.toLowerCase().includes(q) ||
      m.therapeuticArea.toLowerCase().includes(q)
    );
  }, [allMolecules, search]);

  const toggleMol = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const results = useMemo(() => {
    if (selectedIds.size === 0) return [];
    return allMolecules
      .filter(m => selectedIds.has(m.id))
      .map(computeResults)
      .sort((a, b) => {
        const mult = sortDir === "desc" ? -1 : 1;
        if (sortBy === "name") return mult * a.name.localeCompare(b.name);
        return mult * (a[sortBy] - b[sortBy]);
      });
  }, [selectedIds, allMolecules, sortBy, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const exportExcel = () => {
    if (results.length === 0) return;
    const data = results.map((r, i) => ({
      'Rank': i + 1,
      'Molecule': r.name,
      'Indication': r.indication,
      'Company': r.company,
      'Phase': r.phase,
      'Therapeutic Area': r.ta,
      'Model 1 MWPSPI (%)': r.m1Score,
      'Model 2 Benchmark (%)': r.m2Score,
      'Triangulated (%)': r.triangulated,
      'Divergence (pp)': r.divergence,
      'Confidence': r.confidence,
      'Decision Band': r.band,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Batch Comparison');
    const colWidths = Object.keys(data[0]).map(k => ({ wch: Math.min(25, Math.max(k.length, 10)) }));
    ws['!cols'] = colWidths;
    XLSX.writeFile(wb, `Batch-Comparison-${results.length}-molecules-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportPDF = async () => {
    if (results.length === 0) return;
    const doc = (
      <Document>
        <Page size="A4" orientation="landscape" style={pdfStyles.page}>
          <View style={pdfStyles.header}>
            <Text style={pdfStyles.headerTitle}>Batch Model Comparison — {results.length} Molecules</Text>
            <Text style={pdfStyles.headerSubtitle}>Generated {formatReportDate()} • BiOQUILL Analytics Platform</Text>
          </View>
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Ranked Comparison Table</Text>
            {/* Header row */}
            <View style={{ flexDirection: 'row', borderBottom: '2 solid #d1d5db', paddingBottom: 4, marginBottom: 4 }}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 20 }}>#</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', flex: 2 }}>Molecule</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', flex: 1 }}>Company</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 40, textAlign: 'center' }}>Phase</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 50, textAlign: 'center' }}>M1 (%)</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 50, textAlign: 'center' }}>M2 (%)</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 55, textAlign: 'center' }}>Triang. (%)</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 35, textAlign: 'center' }}>Div.</Text>
              <Text style={{ fontSize: 7, fontWeight: 'bold', width: 60, textAlign: 'center' }}>Band</Text>
            </View>
            {results.map((r, i) => (
              <View key={r.id} style={{ flexDirection: 'row', borderBottom: '1 solid #e5e7eb', paddingVertical: 3, alignItems: 'center' }}>
                <Text style={{ fontSize: 8, width: 20 }}>{i + 1}</Text>
                <View style={{ flex: 2 }}>
                  <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{r.name}</Text>
                  <Text style={{ fontSize: 6, color: '#6b7280' }}>{r.indication}</Text>
                </View>
                <Text style={{ fontSize: 7, flex: 1 }}>{r.company}</Text>
                <Text style={{ fontSize: 8, width: 40, textAlign: 'center' }}>{r.phase}</Text>
                <Text style={{ fontSize: 9, width: 50, textAlign: 'center', fontWeight: 'bold', color: getScoreColor(r.m1Score) }}>{r.m1Score}</Text>
                <Text style={{ fontSize: 9, width: 50, textAlign: 'center', fontWeight: 'bold', color: getScoreColor(r.m2Score) }}>{r.m2Score}</Text>
                <Text style={{ fontSize: 10, width: 55, textAlign: 'center', fontWeight: 'bold', color: getScoreColor(r.triangulated) }}>{r.triangulated}</Text>
                <Text style={{ fontSize: 8, width: 35, textAlign: 'center' }}>{r.divergence}pp</Text>
                <Text style={{ fontSize: 7, width: 60, textAlign: 'center' }}>{r.band}</Text>
              </View>
            ))}
          </View>
          <View style={pdfStyles.footer}>
            <Text>BiOQUILL Analytics • Batch Model Comparison</Text>
            <Text>Confidential — For Internal Use Only</Text>
          </View>
        </Page>
      </Document>
    );
    await generateAndDownloadPDF(doc, `Batch-Comparison-${results.length}-molecules-${formatReportDate().replace(/\s+/g, '-')}.pdf`);
  };

  const SortHeader = ({ label, sortKey, className = "" }: { label: string; sortKey: SortKey; className?: string }) => (
    <th
      className={`p-2 font-semibold cursor-pointer hover:bg-muted/50 select-none ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1 justify-center">
        {label}
        {sortBy === sortKey && <ArrowUpDown className="h-3 w-3" />}
      </div>
    </th>
  );

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-6 w-6 text-primary" />
          Batch Molecule Comparison
        </CardTitle>
        <CardDescription className="text-base">
          Select multiple molecules and generate a ranked comparison table across all three pricing & access models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Selection Panel */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search molecules by name, indication, company, or TA..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="max-h-[250px] overflow-y-auto space-y-0.5 border rounded-md p-1">
                {filteredMolecules.slice(0, 100).map(m => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer hover:bg-muted/50 ${selectedIds.has(m.id) ? 'bg-primary/5' : ''}`}
                  >
                    <Checkbox
                      checked={selectedIds.has(m.id)}
                      onCheckedChange={() => toggleMol(m.id)}
                      className="h-3.5 w-3.5"
                    />
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground">({m.indication})</span>
                    <span className="ml-auto text-muted-foreground">{m.phase}</span>
                  </label>
                ))}
                {filteredMolecules.length > 100 && (
                  <p className="text-xs text-muted-foreground text-center p-2">
                    Showing 100 of {filteredMolecules.length} — refine your search
                  </p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedIds.size} molecule{selectedIds.size !== 1 ? 's' : ''} selected
              </p>
            </CardContent>
          </Card>

          {/* Selected chips + actions */}
          <Card className="border">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Selected Molecules</p>
                {selectedIds.size > 0 && (
                  <Button size="sm" variant="ghost" className="text-xs h-6" onClick={() => setSelectedIds(new Set())}>
                    Clear All
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[180px] overflow-y-auto">
                {Array.from(selectedIds).map(id => {
                  const m = allMolecules.find(mol => mol.id === id);
                  return m ? (
                    <Badge key={id} variant="secondary" className="gap-1 text-xs cursor-pointer" onClick={() => toggleMol(id)}>
                      {m.name}
                      <X className="h-3 w-3" />
                    </Badge>
                  ) : null;
                })}
                {selectedIds.size === 0 && (
                  <p className="text-xs text-muted-foreground py-4 text-center w-full">
                    Select molecules from the list to compare them across all three models
                  </p>
                )}
              </div>
              {selectedIds.size >= 2 && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={exportPDF}>
                    <Download className="h-3.5 w-3.5" /> Export PDF
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={exportExcel}>
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Table */}
        {results.length >= 2 && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-semibold w-8">#</th>
                      <SortHeader label="Molecule" sortKey="name" className="text-left" />
                      <th className="text-left p-2 font-semibold">Company</th>
                      <th className="text-center p-2 font-semibold">Phase</th>
                      <SortHeader label="Model 1" sortKey="m1Score" />
                      <SortHeader label="Model 2" sortKey="m2Score" />
                      <SortHeader label="Triangulated" sortKey="triangulated" />
                      <SortHeader label="Div." sortKey="divergence" />
                      <th className="text-center p-2 font-semibold">Confidence</th>
                      <th className="text-center p-2 font-semibold">Decision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={r.id} className="border-b hover:bg-muted/30">
                        <td className="p-2 text-muted-foreground">{i + 1}</td>
                        <td className="p-2">
                          <div className="font-medium">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.indication}</div>
                        </td>
                        <td className="p-2 text-xs">{r.company}</td>
                        <td className="p-2 text-center">
                          <Badge variant="outline" className="text-xs">{r.phase}</Badge>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`font-bold ${r.m1Score >= 60 ? 'text-green-600' : r.m1Score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {r.m1Score}%
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`font-bold ${r.m2Score >= 60 ? 'text-green-600' : r.m2Score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {r.m2Score}%
                          </span>
                        </td>
                        <td className="p-2 text-center">
                          <span className={`text-lg font-bold ${r.triangulated >= 60 ? 'text-green-600' : r.triangulated >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {r.triangulated}%
                          </span>
                        </td>
                        <td className="p-2 text-center text-xs">{r.divergence}pp</td>
                        <td className="p-2 text-center text-xs">{r.confidence}</td>
                        <td className="p-2 text-center">
                          <Badge className={`text-xs ${r.bandColor}`}>{r.band}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {results.length >= 2 && (
          <div className="bg-muted/30 rounded-lg p-4 border space-y-3">
            <p className="text-xs font-semibold">Visual Ranking — Triangulated Probability</p>
            {results.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="text-xs w-6 text-muted-foreground font-bold">{i + 1}</span>
                <span className="text-xs w-28 truncate font-medium">{r.name}</span>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all flex items-center justify-end pr-2 ${
                      r.triangulated >= 75 ? 'bg-green-500' : r.triangulated >= 60 ? 'bg-blue-500' : r.triangulated >= 45 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${r.triangulated}%` }}
                  >
                    <span className="text-[10px] text-white font-bold">{r.triangulated}%</span>
                  </div>
                </div>
                <Badge className={`text-[10px] ${r.bandColor}`}>{r.band}</Badge>
              </div>
            ))}
          </div>
        )}

        {selectedIds.size > 0 && selectedIds.size < 2 && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">Select at least 2 molecules to see the comparison table.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
