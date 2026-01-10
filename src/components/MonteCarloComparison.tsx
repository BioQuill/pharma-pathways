import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartTooltip } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { 
  Play, 
  Settings, 
  BarChart3, 
  X,
  Plus,
  RefreshCw,
  Layers,
  Download,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from "xlsx";
import { 
  runMonteCarloSimulation, 
  type ComponentUncertainty,
  type SimulationResult
} from "@/lib/monteCarloSimulation";
import { calculatePeakSalesIndex, type ComponentScore } from "@/lib/peakSalesIndex";
import { type MoleculeProfile } from "@/lib/moleculesData";

interface MoleculeSimulation {
  id: string;
  name: string;
  color: string;
  componentScores: ComponentScore[];
  result: SimulationResult | null;
}

const COMPARISON_COLORS = [
  "hsl(221, 83%, 53%)", // Blue
  "hsl(142, 76%, 36%)", // Green
  "hsl(45, 93%, 47%)",  // Amber
  "hsl(280, 67%, 51%)", // Purple
  "hsl(0, 84%, 60%)",   // Red
  "hsl(186, 77%, 43%)", // Cyan
];

interface MonteCarloComparisonProps {
  molecules: MoleculeProfile[];
}

const MonteCarloComparison = ({ molecules }: MonteCarloComparisonProps) => {
  const [iterations, setIterations] = useState(10000);
  const [uncertaintyRange, setUncertaintyRange] = useState([15]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMolecules, setSelectedMolecules] = useState<MoleculeSimulation[]>([]);
  const [currentSelection, setCurrentSelection] = useState<string>("");

  const addMolecule = useCallback(() => {
    if (!currentSelection || selectedMolecules.length >= 6) return;
    
    const molecule = molecules.find(m => m.id === currentSelection);
    if (!molecule || selectedMolecules.some(m => m.id === currentSelection)) return;

    const result = calculatePeakSalesIndex(molecule);
    const newMolecule: MoleculeSimulation = {
      id: molecule.id,
      name: molecule.name,
      color: COMPARISON_COLORS[selectedMolecules.length % COMPARISON_COLORS.length],
      componentScores: result.componentScores,
      result: null,
    };

    setSelectedMolecules([...selectedMolecules, newMolecule]);
    setCurrentSelection("");
  }, [currentSelection, molecules, selectedMolecules]);

  const removeMolecule = useCallback((id: string) => {
    setSelectedMolecules(prev => prev.filter(m => m.id !== id));
  }, []);

  const runComparisonSimulation = useCallback(() => {
    if (selectedMolecules.length === 0) return;
    
    setIsRunning(true);
    
    setTimeout(() => {
      const updatedMolecules = selectedMolecules.map(mol => {
        const componentUncertainties: ComponentUncertainty[] = mol.componentScores.map(c => ({
          name: c.name,
          baseScore: c.score,
          minScore: Math.max(0, c.score * (1 - uncertaintyRange[0] / 100)),
          maxScore: Math.min(100, c.score * (1 + uncertaintyRange[0] / 100)),
          weight: c.weight,
        }));

        const result = runMonteCarloSimulation(componentUncertainties, {
          iterations,
          uncertaintyRange: uncertaintyRange[0],
          confidenceInterval: 95,
        });

        return { ...mol, result };
      });

      setSelectedMolecules(updatedMolecules);
      setIsRunning(false);
    }, 100);
  }, [selectedMolecules, iterations, uncertaintyRange]);

  // Combined distribution data for overlaid chart
  const overlaidHistogramData = useMemo(() => {
    if (!selectedMolecules.some(m => m.result)) return [];

    // Find common range across all simulations
    const allValues = selectedMolecules
      .filter(m => m.result)
      .flatMap(m => m.result!.peakSalesDistribution);
    
    if (allValues.length === 0) return [];

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const binCount = 20;
    const binWidth = (maxVal - minVal) / binCount;

    const bins: { range: string; minValue: number; [key: string]: string | number }[] = [];
    
    for (let i = 0; i < binCount; i++) {
      const binStart = minVal + (i * binWidth);
      const binEnd = binStart + binWidth;
      const bin: { range: string; minValue: number; [key: string]: string | number } = {
        range: `$${binStart.toFixed(1)}B`,
        minValue: binStart,
      };

      selectedMolecules.forEach(mol => {
        if (mol.result) {
          const count = mol.result.peakSalesDistribution.filter(
            v => v >= binStart && v < binEnd
          ).length;
          bin[mol.id] = (count / mol.result.peakSalesDistribution.length) * 100;
        }
      });

      bins.push(bin);
    }

    return bins;
  }, [selectedMolecules]);

  // Percentile comparison data
  const percentileComparisonData = useMemo(() => {
    const labels = ["P5", "P10", "P25", "P50", "P75", "P90", "P95"];
    const percentileKeys = ["p5", "p10", "p25", "p50", "p75", "p90", "p95"] as const;

    return labels.map((label, idx) => {
      const dataPoint: { percentile: string; [key: string]: string | number } = { percentile: label };
      
      selectedMolecules.forEach(mol => {
        if (mol.result) {
          dataPoint[mol.id] = mol.result.percentiles[percentileKeys[idx]];
        }
      });

      return dataPoint;
    });
  }, [selectedMolecules]);

  // Summary statistics comparison
  const statisticsComparison = useMemo(() => {
    return selectedMolecules
      .filter(m => m.result)
      .map(mol => ({
        name: mol.name,
        color: mol.color,
        mean: mol.result!.statistics.mean,
        median: mol.result!.statistics.median,
        stdDev: mol.result!.statistics.stdDev,
        min: mol.result!.statistics.min,
        max: mol.result!.statistics.max,
        p10: mol.result!.percentiles.p10,
        p90: mol.result!.percentiles.p90,
        blockbusterProb: ((mol.result!.peakSalesDistribution.filter(v => v >= 1).length / 
          mol.result!.peakSalesDistribution.length) * 100).toFixed(1),
      }));
  }, [selectedMolecules]);

  const hasResults = selectedMolecules.some(m => m.result);

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (!hasResults) return;

    const headers = ["Molecule", "Mean ($B)", "Median ($B)", "Std Dev ($B)", "Min ($B)", "Max ($B)", "P5 ($B)", "P10 ($B)", "P25 ($B)", "P50 ($B)", "P75 ($B)", "P90 ($B)", "P95 ($B)", "P(≥$1B) %"];
    const rows = statisticsComparison.map(stat => {
      const mol = selectedMolecules.find(m => m.name === stat.name);
      const result = mol?.result;
      return [
        stat.name,
        stat.mean,
        stat.median,
        stat.stdDev,
        stat.min,
        stat.max,
        result?.percentiles.p5 || 0,
        result?.percentiles.p10 || 0,
        result?.percentiles.p25 || 0,
        result?.percentiles.p50 || 0,
        result?.percentiles.p75 || 0,
        result?.percentiles.p90 || 0,
        result?.percentiles.p95 || 0,
        stat.blockbusterProb
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `monte_carlo_comparison_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [hasResults, statisticsComparison, selectedMolecules]);

  // Export to Excel
  const exportToExcel = useCallback(() => {
    if (!hasResults) return;

    const workbook = XLSX.utils.book_new();

    // Summary Statistics Sheet
    const summaryData = statisticsComparison.map(stat => {
      const mol = selectedMolecules.find(m => m.name === stat.name);
      const result = mol?.result;
      return {
        "Molecule": stat.name,
        "Mean ($B)": stat.mean,
        "Median ($B)": stat.median,
        "Std Dev ($B)": stat.stdDev,
        "Min ($B)": stat.min,
        "Max ($B)": stat.max,
        "P5 ($B)": result?.percentiles.p5 || 0,
        "P10 ($B)": result?.percentiles.p10 || 0,
        "P25 ($B)": result?.percentiles.p25 || 0,
        "P50 ($B)": result?.percentiles.p50 || 0,
        "P75 ($B)": result?.percentiles.p75 || 0,
        "P90 ($B)": result?.percentiles.p90 || 0,
        "P95 ($B)": result?.percentiles.p95 || 0,
        "P(≥$1B) %": parseFloat(stat.blockbusterProb),
        "P(≥$2B) %": mol?.result ? ((mol.result.peakSalesDistribution.filter(v => v >= 2).length / mol.result.peakSalesDistribution.length) * 100).toFixed(1) : 0,
      };
    });
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = Array(15).fill({ wch: 14 });
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary Statistics");

    // Percentile Comparison Sheet
    const percentileData = ["P5", "P10", "P25", "P50", "P75", "P90", "P95"].map((label, idx) => {
      const percentileKeys = ["p5", "p10", "p25", "p50", "p75", "p90", "p95"] as const;
      const row: Record<string, string | number> = { "Percentile": label };
      selectedMolecules.forEach(mol => {
        if (mol.result) {
          row[mol.name] = mol.result.percentiles[percentileKeys[idx]];
        }
      });
      return row;
    });
    const percentileSheet = XLSX.utils.json_to_sheet(percentileData);
    percentileSheet['!cols'] = Array(selectedMolecules.length + 1).fill({ wch: 18 });
    XLSX.utils.book_append_sheet(workbook, percentileSheet, "Percentile Comparison");

    // Distribution Data Sheet (sampled)
    const distributionData: Record<string, number>[] = [];
    const sampleSize = 100; // Sample to avoid huge files
    selectedMolecules.forEach(mol => {
      if (mol.result) {
        const step = Math.max(1, Math.floor(mol.result.peakSalesDistribution.length / sampleSize));
        mol.result.peakSalesDistribution.filter((_, i) => i % step === 0).forEach((val, i) => {
          if (!distributionData[i]) distributionData[i] = {};
          distributionData[i][mol.name] = val;
        });
      }
    });
    const distSheet = XLSX.utils.json_to_sheet(distributionData);
    XLSX.utils.book_append_sheet(workbook, distSheet, "Distribution Sample");

    // Configuration Sheet
    const configData = [{
      "Iterations": iterations,
      "Uncertainty Range": `±${uncertaintyRange[0]}%`,
      "Confidence Interval": "95%",
      "Date Generated": new Date().toLocaleString(),
      "Molecules Compared": selectedMolecules.length,
    }];
    const configSheet = XLSX.utils.json_to_sheet(configData);
    XLSX.utils.book_append_sheet(workbook, configSheet, "Configuration");

    XLSX.writeFile(workbook, `monte_carlo_comparison_${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [hasResults, statisticsComparison, selectedMolecules, iterations, uncertaintyRange]);

  return (
    <div className="space-y-6">
      {/* Molecule Selection Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Multi-Molecule Comparison
          </CardTitle>
          <CardDescription>
            Compare Monte Carlo simulation distributions for up to 6 molecules side by side
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected molecules */}
            <div className="flex flex-wrap gap-2">
              {selectedMolecules.map((mol) => (
                <Badge 
                  key={mol.id} 
                  variant="outline" 
                  className="flex items-center gap-2 py-1.5 px-3"
                  style={{ borderColor: mol.color, backgroundColor: `${mol.color}15` }}
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: mol.color }}
                  />
                  {mol.name}
                  <button 
                    onClick={() => removeMolecule(mol.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedMolecules.length === 0 && (
                <p className="text-sm text-muted-foreground">No molecules selected. Add up to 6 molecules to compare.</p>
              )}
            </div>

            {/* Add molecule selector */}
            <div className="flex gap-2">
              <Select value={currentSelection} onValueChange={setCurrentSelection}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a molecule to add..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {molecules
                    .filter(m => !selectedMolecules.some(sm => sm.id === m.id))
                    .slice(0, 100)
                    .map((mol) => (
                      <SelectItem key={mol.id} value={mol.id}>
                        {mol.name} ({mol.phase})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={addMolecule} 
                disabled={!currentSelection || selectedMolecules.length >= 6}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {selectedMolecules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Simulation Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Iterations</Label>
                <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1,000 (Fast)</SelectItem>
                    <SelectItem value="5000">5,000 (Balanced)</SelectItem>
                    <SelectItem value="10000">10,000 (Recommended)</SelectItem>
                    <SelectItem value="50000">50,000 (Precise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label className="text-sm font-medium">Uncertainty Range</Label>
                  <span className="text-sm font-medium">±{uncertaintyRange[0]}%</span>
                </div>
                <Slider 
                  value={uncertaintyRange} 
                  onValueChange={setUncertaintyRange} 
                  min={5} 
                  max={40} 
                  step={5}
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={runComparisonSimulation} 
                  disabled={isRunning || selectedMolecules.length === 0}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Run Comparison
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Export Buttons */}
            {hasResults && (
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={exportToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={exportToExcel} className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hasResults && (
        <>
          {/* Summary Statistics Table */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics Comparison</CardTitle>
              <CardDescription>
                Key metrics across all simulated molecules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Molecule</th>
                      <th className="text-right py-2 px-3">Mean</th>
                      <th className="text-right py-2 px-3">Median</th>
                      <th className="text-right py-2 px-3">Std Dev</th>
                      <th className="text-right py-2 px-3">P10-P90</th>
                      <th className="text-right py-2 px-3">P(≥$1B)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticsComparison.map((stat, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: stat.color }}
                            />
                            <span className="font-medium">{stat.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-2 px-3 font-semibold text-primary">${stat.mean}B</td>
                        <td className="text-right py-2 px-3">${stat.median}B</td>
                        <td className="text-right py-2 px-3 text-muted-foreground">±${stat.stdDev}B</td>
                        <td className="text-right py-2 px-3">${stat.p10}B - ${stat.p90}B</td>
                        <td className="text-right py-2 px-3">
                          <Badge variant={parseFloat(stat.blockbusterProb) >= 50 ? "default" : "secondary"}>
                            {stat.blockbusterProb}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Overlaid Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribution Overlay
                </CardTitle>
                <CardDescription>
                  Probability distributions compared
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={overlaidHistogramData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tickFormatter={(v) => `${v.toFixed(0)}%`}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold mb-2">{label}</p>
                                {payload.map((entry: { color?: string; name?: string; value?: number }, idx: number) => (
                                  <p key={idx} className="text-sm" style={{ color: entry.color }}>
                                    {selectedMolecules.find(m => m.id === entry.name)?.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        formatter={(value) => selectedMolecules.find(m => m.id === value)?.name || value}
                      />
                      {selectedMolecules.map((mol, idx) => (
                        <Area 
                          key={mol.id}
                          type="monotone"
                          dataKey={mol.id}
                          stroke={mol.color}
                          fill={mol.color}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Percentile Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Percentile Comparison</CardTitle>
                <CardDescription>
                  Cumulative distribution percentiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={percentileComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="percentile" tick={{ fontSize: 11 }} />
                      <YAxis 
                        tickFormatter={(v) => `$${v}B`}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold mb-2">{label} Percentile</p>
                                {payload.map((entry: { color?: string; name?: string; value?: number }, idx: number) => (
                                  <p key={idx} className="text-sm" style={{ color: entry.color }}>
                                    {selectedMolecules.find(m => m.id === entry.name)?.name}: ${entry.value}B
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend 
                        formatter={(value) => selectedMolecules.find(m => m.id === value)?.name || value}
                      />
                      {selectedMolecules.map((mol) => (
                        <Line 
                          key={mol.id}
                          type="monotone"
                          dataKey={mol.id}
                          stroke={mol.color}
                          strokeWidth={2}
                          dot={{ fill: mol.color, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Individual Distribution Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statisticsComparison.map((stat, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="font-semibold truncate" title={stat.name}>{stat.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Mean</p>
                      <p className="font-semibold text-primary">${stat.mean}B</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Median</p>
                      <p className="font-semibold">${stat.median}B</p>
                    </div>
                    <div className="bg-muted/50 p-2 rounded">
                      <p className="text-xs text-muted-foreground">Range (Min-Max)</p>
                      <p className="font-semibold">${stat.min}B - ${stat.max}B</p>
                    </div>
                    <div className="bg-primary/10 p-2 rounded border border-primary/20">
                      <p className="text-xs text-primary">P(≥$1B)</p>
                      <p className="font-bold text-primary">{stat.blockbusterProb}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {selectedMolecules.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Add Molecules to Compare</p>
            <p className="text-sm text-muted-foreground mt-2">
              Select up to 6 molecules from the dropdown above to compare their peak sales distributions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonteCarloComparison;
