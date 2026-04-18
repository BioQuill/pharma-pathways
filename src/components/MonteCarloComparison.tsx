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
  Area,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from "recharts";
import { 
  Play, 
  Settings, 
  BarChart3, 
  X,
  Plus,
  RefreshCw,
  Shield,
  TrendingDown,
  TrendingUp,
  Target,
  Briefcase,
  Layers,
  Download,
  FileSpreadsheet,
  Grid3X3,
  Sparkles
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
        riskMetrics: mol.result!.statistics.riskAdjustedReturn,
      }));
  }, [selectedMolecules]);

  // Portfolio-level aggregation
  const portfolioAggregation = useMemo(() => {
    const moleculesWithResults = selectedMolecules.filter(m => m.result);
    if (moleculesWithResults.length === 0) return null;

    // Aggregate peak sales distributions (sum across molecules)
    const iterations = moleculesWithResults[0].result!.peakSalesDistribution.length;
    const portfolioDistribution: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const totalPeakSales = moleculesWithResults.reduce((sum, mol) => {
        return sum + mol.result!.peakSalesDistribution[i];
      }, 0);
      portfolioDistribution.push(totalPeakSales);
    }
    
    const sorted = [...portfolioDistribution].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = portfolioDistribution.reduce((sum, v) => sum + v, 0) / n;
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const variance = portfolioDistribution.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    // Portfolio risk metrics
    const cv = stdDev / mean;
    const var5Index = Math.floor(0.05 * n);
    const valueAtRisk = sorted[var5Index];
    const worstOutcomes = sorted.slice(0, var5Index);
    const expectedShortfall = worstOutcomes.length > 0
      ? worstOutcomes.reduce((sum, v) => sum + v, 0) / worstOutcomes.length
      : sorted[0];
    
    // Downside deviation
    const downsideValues = portfolioDistribution.filter(v => v < mean);
    const downsideDeviation = downsideValues.length > 0
      ? Math.sqrt(downsideValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / downsideValues.length)
      : 0;
    
    // Upside potential
    const upsideValues = portfolioDistribution.filter(v => v > median);
    const upsidePotential = upsideValues.length > 0
      ? upsideValues.reduce((sum, v) => sum + v, 0) / upsideValues.length
      : mean;
    
    // Portfolio success probability (total > sum of $1B thresholds)
    const thresholdSum = moleculesWithResults.length; // Each molecule should hit $1B
    const portfolioSuccessProb = (portfolioDistribution.filter(v => v >= thresholdSum).length / n) * 100;
    
    // Risk-free rate for ratios
    const riskFreeRate = 0.05 * moleculesWithResults.length;
    const sharpeRatio = stdDev > 0 ? (mean - riskFreeRate) / stdDev : 0;
    const sortinoRatio = downsideDeviation > 0 ? (mean - riskFreeRate) / downsideDeviation : 0;
    
    // Diversification benefit (reduced correlation)
    const sumOfIndividualVariances = moleculesWithResults.reduce((sum, mol) => {
      return sum + Math.pow(mol.result!.statistics.stdDev, 2);
    }, 0);
    const diversificationBenefit = sumOfIndividualVariances > 0 
      ? (1 - variance / sumOfIndividualVariances) * 100 
      : 0;
    
    // Risk-weighted value
    const successWeight = Math.sqrt(portfolioSuccessProb / 100);
    const riskWeightedValue = mean * (1 - Math.min(cv, 1) / 2) * successWeight + 
      (1 - successWeight) * Math.max(expectedShortfall, 0);
    
    // Certainty equivalent
    const riskAversion = 2;
    const certaintyEquivalent = Math.max(0, mean - 0.5 * riskAversion * variance);

    return {
      totalMean: Math.round(mean * 100) / 100,
      totalMedian: Math.round(median * 100) / 100,
      totalStdDev: Math.round(stdDev * 100) / 100,
      totalMin: Math.round(sorted[0] * 100) / 100,
      totalMax: Math.round(sorted[n - 1] * 100) / 100,
      p5: Math.round(sorted[Math.floor(0.05 * n)] * 100) / 100,
      p10: Math.round(sorted[Math.floor(0.10 * n)] * 100) / 100,
      p25: Math.round(sorted[Math.floor(0.25 * n)] * 100) / 100,
      p50: Math.round(sorted[Math.floor(0.50 * n)] * 100) / 100,
      p75: Math.round(sorted[Math.floor(0.75 * n)] * 100) / 100,
      p90: Math.round(sorted[Math.floor(0.90 * n)] * 100) / 100,
      p95: Math.round(sorted[Math.floor(0.95 * n)] * 100) / 100,
      valueAtRisk: Math.round(valueAtRisk * 100) / 100,
      expectedShortfall: Math.round(expectedShortfall * 100) / 100,
      sharpeRatio: Math.round(sharpeRatio * 100) / 100,
      sortinoRatio: Math.round(sortinoRatio * 100) / 100,
      diversificationBenefit: Math.round(diversificationBenefit * 10) / 10,
      portfolioSuccessProb: Math.round(portfolioSuccessProb * 10) / 10,
      riskWeightedValue: Math.round(riskWeightedValue * 100) / 100,
      certaintyEquivalent: Math.round(certaintyEquivalent * 100) / 100,
      downsideDeviation: Math.round(downsideDeviation * 100) / 100,
      upsidePotential: Math.round(upsidePotential * 100) / 100,
      moleculeCount: moleculesWithResults.length,
    };
  }, [selectedMolecules]);

  // Correlation matrix calculation
  const correlationMatrix = useMemo(() => {
    const moleculesWithResults = selectedMolecules.filter(m => m.result);
    if (moleculesWithResults.length < 2) return null;

    const calculateCorrelation = (arr1: number[], arr2: number[]): number => {
      const n = Math.min(arr1.length, arr2.length);
      if (n === 0) return 0;
      
      const mean1 = arr1.reduce((a, b) => a + b, 0) / n;
      const mean2 = arr2.reduce((a, b) => a + b, 0) / n;
      
      let numerator = 0;
      let denom1 = 0;
      let denom2 = 0;
      
      for (let i = 0; i < n; i++) {
        const diff1 = arr1[i] - mean1;
        const diff2 = arr2[i] - mean2;
        numerator += diff1 * diff2;
        denom1 += diff1 * diff1;
        denom2 += diff2 * diff2;
      }
      
      const denom = Math.sqrt(denom1 * denom2);
      return denom === 0 ? 0 : Math.round((numerator / denom) * 100) / 100;
    };

    const matrix: { mol1: string; mol2: string; correlation: number; color1: string; color2: string }[] = [];
    
    for (let i = 0; i < moleculesWithResults.length; i++) {
      for (let j = 0; j < moleculesWithResults.length; j++) {
        const corr = calculateCorrelation(
          moleculesWithResults[i].result!.peakSalesDistribution,
          moleculesWithResults[j].result!.peakSalesDistribution
        );
        matrix.push({
          mol1: moleculesWithResults[i].name,
          mol2: moleculesWithResults[j].name,
          correlation: corr,
          color1: moleculesWithResults[i].color,
          color2: moleculesWithResults[j].color,
        });
      }
    }

    return {
      molecules: moleculesWithResults.map(m => ({ name: m.name, color: m.color })),
      data: matrix,
    };
  }, [selectedMolecules]);

  // Efficient frontier data with confidence intervals
  const efficientFrontierData = useMemo(() => {
    const moleculesWithResults = selectedMolecules.filter(m => m.result);
    if (moleculesWithResults.length === 0) return { points: [], frontier: [], allCombinations: [], confidenceBands: { ci80: [], ci95: [] } };

    // Individual molecule points
    const points = moleculesWithResults.map(mol => ({
      name: mol.name,
      color: mol.color,
      return: mol.result!.statistics.mean,
      risk: mol.result!.statistics.stdDev,
      sharpe: mol.result!.statistics.riskAdjustedReturn.sharpeRatio,
    }));

    // Generate portfolio combinations for frontier with confidence intervals
    const frontier: { return: number; risk: number; weights: string; returnP10?: number; returnP90?: number; returnP2_5?: number; returnP97_5?: number }[] = [];

    if (moleculesWithResults.length >= 2) {
      // For 2 molecules
      if (moleculesWithResults.length === 2) {
        for (let w1 = 0; w1 <= 10; w1++) {
          const weight1 = w1 / 10;
          const weight2 = 1 - weight1;
          
          const dist1 = moleculesWithResults[0].result!.peakSalesDistribution;
          const dist2 = moleculesWithResults[1].result!.peakSalesDistribution;
          const n = Math.min(dist1.length, dist2.length);
          
          const portfolioDist = [];
          for (let i = 0; i < n; i++) {
            portfolioDist.push(dist1[i] * weight1 + dist2[i] * weight2);
          }
          
          const mean = portfolioDist.reduce((a, b) => a + b, 0) / n;
          const variance = portfolioDist.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / n;
          const stdDev = Math.sqrt(variance);
          
          // Calculate percentiles for confidence intervals
          const sorted = [...portfolioDist].sort((a, b) => a - b);
          const p2_5 = sorted[Math.floor(0.025 * n)];
          const p10 = sorted[Math.floor(0.10 * n)];
          const p90 = sorted[Math.floor(0.90 * n)];
          const p97_5 = sorted[Math.floor(0.975 * n)];
          
          frontier.push({
            return: Math.round(mean * 100) / 100,
            risk: Math.round(stdDev * 100) / 100,
            weights: `${(weight1 * 100).toFixed(0)}%/${(weight2 * 100).toFixed(0)}%`,
            returnP10: Math.round(p10 * 100) / 100,
            returnP90: Math.round(p90 * 100) / 100,
            returnP2_5: Math.round(p2_5 * 100) / 100,
            returnP97_5: Math.round(p97_5 * 100) / 100,
          });
        }
      } else if (moleculesWithResults.length >= 3) {
        // For 3+ molecules, sample combinations
        const distributions = moleculesWithResults.map(m => m.result!.peakSalesDistribution);
        const n = Math.min(...distributions.map(d => d.length));
        
        // Generate random portfolio weights
        for (let sample = 0; sample < 50; sample++) {
          const weights = moleculesWithResults.map(() => Math.random());
          const weightSum = weights.reduce((a, b) => a + b, 0);
          const normalizedWeights = weights.map(w => w / weightSum);
          
          const portfolioDist = [];
          for (let i = 0; i < n; i++) {
            let value = 0;
            for (let j = 0; j < distributions.length; j++) {
              value += distributions[j][i] * normalizedWeights[j];
            }
            portfolioDist.push(value);
          }
          
          const mean = portfolioDist.reduce((a, b) => a + b, 0) / n;
          const variance = portfolioDist.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / n;
          const stdDev = Math.sqrt(variance);
          
          // Calculate percentiles for confidence intervals
          const sorted = [...portfolioDist].sort((a, b) => a - b);
          const p2_5 = sorted[Math.floor(0.025 * n)];
          const p10 = sorted[Math.floor(0.10 * n)];
          const p90 = sorted[Math.floor(0.90 * n)];
          const p97_5 = sorted[Math.floor(0.975 * n)];
          
          frontier.push({
            return: Math.round(mean * 100) / 100,
            risk: Math.round(stdDev * 100) / 100,
            weights: normalizedWeights.map(w => `${(w * 100).toFixed(0)}%`).join('/'),
            returnP10: Math.round(p10 * 100) / 100,
            returnP90: Math.round(p90 * 100) / 100,
            returnP2_5: Math.round(p2_5 * 100) / 100,
            returnP97_5: Math.round(p97_5 * 100) / 100,
          });
        }
      }
    }

    // Sort frontier by risk to get the efficient frontier line
    const sortedFrontier = [...frontier].sort((a, b) => a.risk - b.risk);
    
    // Filter to only keep efficient points (highest return for each risk level)
    const efficientPoints: typeof frontier = [];
    let maxReturn = -Infinity;
    for (const point of sortedFrontier) {
      if (point.return >= maxReturn) {
        efficientPoints.push(point);
        maxReturn = point.return;
      }
    }

    // Generate confidence band data for area charts
    const ci80 = efficientPoints.map(p => ({
      risk: p.risk,
      lower: p.returnP10 || p.return * 0.9,
      upper: p.returnP90 || p.return * 1.1,
      mean: p.return,
    }));
    
    const ci95 = efficientPoints.map(p => ({
      risk: p.risk,
      lower: p.returnP2_5 || p.return * 0.85,
      upper: p.returnP97_5 || p.return * 1.15,
      mean: p.return,
    }));

    return { points, frontier: efficientPoints, allCombinations: frontier, confidenceBands: { ci80, ci95 } };
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
    summarySheet['!cols'] = Array(17).fill({ wch: 14 });
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary Statistics");

    // Risk Analysis Sheet (NEW)
    const riskData = statisticsComparison.map(stat => ({
      "Molecule": stat.name,
      "Risk-Weighted Value ($B)": stat.riskMetrics.riskWeightedValue,
      "Certainty Equivalent ($B)": stat.riskMetrics.certaintyEquivalent,
      "Sharpe Ratio": stat.riskMetrics.sharpeRatio,
      "Sortino Ratio": stat.riskMetrics.sortinoRatio,
      "Value at Risk 5% ($B)": stat.riskMetrics.valueAtRisk,
      "Expected Shortfall ($B)": stat.riskMetrics.expectedShortfall,
      "Downside Deviation ($B)": stat.riskMetrics.downsideDeviation,
      "Upside Potential ($B)": stat.riskMetrics.upsidePotential,
      "P(≥$1B) %": stat.riskMetrics.probabilityOfSuccess,
      "Risk-Reward Ratio": stat.riskMetrics.riskRewardRatio,
    }));
    const riskSheet = XLSX.utils.json_to_sheet(riskData);
    riskSheet['!cols'] = Array(11).fill({ wch: 22 });
    XLSX.utils.book_append_sheet(workbook, riskSheet, "Risk Analysis");

    // Portfolio Aggregation Sheet (NEW)
    if (portfolioAggregation) {
      const portfolioData = [{
        "Metric": "Total Expected Value",
        "Value": `$${portfolioAggregation.totalMean}B`,
      }, {
        "Metric": "Total Median",
        "Value": `$${portfolioAggregation.totalMedian}B`,
      }, {
        "Metric": "Total Std Dev",
        "Value": `$${portfolioAggregation.totalStdDev}B`,
      }, {
        "Metric": "Risk-Weighted Value",
        "Value": `$${portfolioAggregation.riskWeightedValue}B`,
      }, {
        "Metric": "Certainty Equivalent",
        "Value": `$${portfolioAggregation.certaintyEquivalent}B`,
      }, {
        "Metric": "Portfolio Sharpe Ratio",
        "Value": portfolioAggregation.sharpeRatio,
      }, {
        "Metric": "Portfolio Sortino Ratio",
        "Value": portfolioAggregation.sortinoRatio,
      }, {
        "Metric": "Value at Risk (5%)",
        "Value": `$${portfolioAggregation.valueAtRisk}B`,
      }, {
        "Metric": "Expected Shortfall (CVaR)",
        "Value": `$${portfolioAggregation.expectedShortfall}B`,
      }, {
        "Metric": "Portfolio Success Prob",
        "Value": `${portfolioAggregation.portfolioSuccessProb}%`,
      }, {
        "Metric": "Diversification Benefit",
        "Value": `${portfolioAggregation.diversificationBenefit}%`,
      }, {
        "Metric": "P5 Percentile",
        "Value": `$${portfolioAggregation.p5}B`,
      }, {
        "Metric": "P10 Percentile",
        "Value": `$${portfolioAggregation.p10}B`,
      }, {
        "Metric": "P25 Percentile",
        "Value": `$${portfolioAggregation.p25}B`,
      }, {
        "Metric": "P75 Percentile",
        "Value": `$${portfolioAggregation.p75}B`,
      }, {
        "Metric": "P90 Percentile",
        "Value": `$${portfolioAggregation.p90}B`,
      }, {
        "Metric": "P95 Percentile",
        "Value": `$${portfolioAggregation.p95}B`,
      }, {
        "Metric": "Molecules in Portfolio",
        "Value": portfolioAggregation.moleculeCount,
      }];
      const portfolioSheet = XLSX.utils.json_to_sheet(portfolioData);
      portfolioSheet['!cols'] = [{ wch: 25 }, { wch: 18 }];
      XLSX.utils.book_append_sheet(workbook, portfolioSheet, "Portfolio Aggregation");
    }

    // Correlation Matrix Sheet (NEW)
    if (correlationMatrix && correlationMatrix.molecules.length >= 2) {
      const correlationData: Record<string, string | number>[] = [];
      correlationMatrix.molecules.forEach((rowMol) => {
        const row: Record<string, string | number> = { "Molecule": rowMol.name };
        correlationMatrix.molecules.forEach((colMol) => {
          const corr = correlationMatrix.data.find(d => d.mol1 === rowMol.name && d.mol2 === colMol.name)?.correlation || 0;
          row[colMol.name] = corr;
        });
        correlationData.push(row);
      });
      const correlationSheet = XLSX.utils.json_to_sheet(correlationData);
      correlationSheet['!cols'] = Array(correlationMatrix.molecules.length + 1).fill({ wch: 18 });
      XLSX.utils.book_append_sheet(workbook, correlationSheet, "Correlation Matrix");
    }

    // Efficient Frontier Sheet (NEW)
    if (efficientFrontierData.frontier.length > 0) {
      const frontierData = efficientFrontierData.frontier.map(point => ({
        "Risk (σ) $B": point.risk,
        "Expected Return $B": point.return,
        "Weights": point.weights,
        "P10 (80% CI Lower) $B": point.returnP10 || '',
        "P90 (80% CI Upper) $B": point.returnP90 || '',
        "P2.5 (95% CI Lower) $B": point.returnP2_5 || '',
        "P97.5 (95% CI Upper) $B": point.returnP97_5 || '',
      }));
      const frontierSheet = XLSX.utils.json_to_sheet(frontierData);
      frontierSheet['!cols'] = Array(7).fill({ wch: 22 });
      XLSX.utils.book_append_sheet(workbook, frontierSheet, "Efficient Frontier");

      // Individual molecule points
      const pointsData = efficientFrontierData.points.map(point => ({
        "Molecule": point.name,
        "Risk (σ) $B": point.risk,
        "Expected Return $B": point.return,
        "Sharpe Ratio": point.sharpe,
      }));
      const pointsSheet = XLSX.utils.json_to_sheet(pointsData);
      pointsSheet['!cols'] = Array(4).fill({ wch: 18 });
      XLSX.utils.book_append_sheet(workbook, pointsSheet, "Molecule Risk-Return");
    }

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
  }, [hasResults, statisticsComparison, selectedMolecules, iterations, uncertaintyRange, portfolioAggregation, correlationMatrix, efficientFrontierData]);

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
                <Button variant="export" onClick={exportToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hasResults && (
        <>
          {/* Portfolio Aggregation Card */}
          {portfolioAggregation && selectedMolecules.length >= 2 && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Portfolio Risk Aggregation
                </CardTitle>
                <CardDescription>
                  Combined risk-adjusted metrics across {portfolioAggregation.moleculeCount} molecules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Primary Value Metrics */}
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Target className="h-3 w-3" />
                      Total Expected Value
                    </div>
                    <p className="text-2xl font-bold text-primary">${portfolioAggregation.totalMean}B</p>
                    <p className="text-xs text-muted-foreground">P50: ${portfolioAggregation.totalMedian}B</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Shield className="h-3 w-3" />
                      Risk-Weighted Value
                    </div>
                    <p className="text-2xl font-bold text-green-600">${portfolioAggregation.riskWeightedValue}B</p>
                    <p className="text-xs text-muted-foreground">CE: ${portfolioAggregation.certaintyEquivalent}B</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingUp className="h-3 w-3" />
                      Portfolio Sharpe
                    </div>
                    <p className={`text-2xl font-bold ${portfolioAggregation.sharpeRatio >= 1 ? 'text-green-600' : portfolioAggregation.sharpeRatio >= 0.5 ? 'text-amber-600' : 'text-red-600'}`}>
                      {portfolioAggregation.sharpeRatio}
                    </p>
                    <p className="text-xs text-muted-foreground">Sortino: {portfolioAggregation.sortinoRatio}</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <TrendingDown className="h-3 w-3" />
                      Value at Risk (5%)
                    </div>
                    <p className="text-2xl font-bold text-amber-600">${portfolioAggregation.valueAtRisk}B</p>
                    <p className="text-xs text-muted-foreground">CVaR: ${portfolioAggregation.expectedShortfall}B</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Briefcase className="h-3 w-3" />
                      Diversification Benefit
                    </div>
                    <p className={`text-2xl font-bold ${portfolioAggregation.diversificationBenefit > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {portfolioAggregation.diversificationBenefit > 0 ? '+' : ''}{portfolioAggregation.diversificationBenefit}%
                    </p>
                    <p className="text-xs text-muted-foreground">Variance reduction</p>
                  </div>
                  
                  <div className="bg-background p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Target className="h-3 w-3" />
                      Portfolio Success
                    </div>
                    <p className={`text-2xl font-bold ${portfolioAggregation.portfolioSuccessProb >= 50 ? 'text-green-600' : 'text-amber-600'}`}>
                      {portfolioAggregation.portfolioSuccessProb}%
                    </p>
                    <p className="text-xs text-muted-foreground">All molecules ≥$1B</p>
                  </div>
                </div>
                
                {/* Range Metrics */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Portfolio Range:</span>
                    <Badge variant="outline">Min: ${portfolioAggregation.totalMin}B</Badge>
                    <Badge variant="outline">P10: ${portfolioAggregation.p10}B</Badge>
                    <Badge variant="outline">P25: ${portfolioAggregation.p25}B</Badge>
                    <Badge variant="secondary">P50: ${portfolioAggregation.p50}B</Badge>
                    <Badge variant="outline">P75: ${portfolioAggregation.p75}B</Badge>
                    <Badge variant="outline">P90: ${portfolioAggregation.p90}B</Badge>
                    <Badge variant="outline">Max: ${portfolioAggregation.totalMax}B</Badge>
                    <span className="text-muted-foreground ml-2">σ: ±${portfolioAggregation.totalStdDev}B</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <th className="text-right py-2 px-3">RWV</th>
                      <th className="text-right py-2 px-3">Sharpe</th>
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
                        <td className="text-right py-2 px-3 text-green-600 font-medium">${stat.riskMetrics.riskWeightedValue}B</td>
                        <td className="text-right py-2 px-3">
                          <span className={stat.riskMetrics.sharpeRatio >= 1 ? 'text-green-600' : stat.riskMetrics.sharpeRatio >= 0.5 ? 'text-amber-600' : 'text-red-600'}>
                            {stat.riskMetrics.sharpeRatio}
                          </span>
                        </td>
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

          {/* Correlation Matrix & Efficient Frontier */}
          {selectedMolecules.length >= 2 && correlationMatrix && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Correlation Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5" />
                    Correlation Matrix
                  </CardTitle>
                  <CardDescription>
                    How molecule outcomes correlate with each other
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left py-2 px-2"></th>
                          {correlationMatrix.molecules.map((mol) => (
                            <th key={mol.name} className="text-center py-2 px-2 min-w-[70px]">
                              <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: mol.color }} />
                              <span className="text-xs">{mol.name.split(' ')[0]}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {correlationMatrix.molecules.map((rowMol, rowIdx) => (
                          <tr key={rowMol.name} className="border-t">
                            <td className="py-2 px-2 text-xs font-medium">{rowMol.name.split(' ')[0]}</td>
                            {correlationMatrix.molecules.map((colMol, colIdx) => {
                              const corr = correlationMatrix.data.find(d => d.mol1 === rowMol.name && d.mol2 === colMol.name)?.correlation || 0;
                              const isDiagonal = rowIdx === colIdx;
                              const bgColor = isDiagonal ? 'bg-primary/20' : corr >= 0.7 ? 'bg-red-100' : corr >= 0.3 ? 'bg-amber-100' : 'bg-green-100';
                              return (
                                <td key={colMol.name} className={`text-center py-2 px-2 ${bgColor}`}>
                                  <span className="text-sm font-medium">{corr.toFixed(2)}</span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Efficient Frontier with Confidence Bands */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Efficient Frontier
                  </CardTitle>
                  <CardDescription>
                    Risk-return tradeoff with 80% (dark) and 95% (light) confidence bands
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                        <defs>
                          <linearGradient id="ci95Gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="ci80Gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="risk" 
                          name="Risk" 
                          tickFormatter={(v) => `${v}B`} 
                          tick={{ fontSize: 10 }} 
                          label={{ value: 'Risk (σ)', position: 'bottom', fontSize: 10 }} 
                        />
                        <YAxis 
                          type="number" 
                          dataKey="return" 
                          name="Return" 
                          tickFormatter={(v) => `$${v}B`} 
                          tick={{ fontSize: 10 }} 
                        />
                        <ChartTooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg text-xs">
                                {data.name && <p className="font-semibold mb-1">{data.name}</p>}
                                <p className="font-medium">Return: ${data.return}B | Risk: ${data.risk}B</p>
                                {data.weights && <p className="text-muted-foreground mt-1">Weights: {data.weights}</p>}
                                {data.returnP10 && (
                                  <div className="mt-2 pt-2 border-t border-border/50">
                                    <p className="text-muted-foreground">80% CI: ${data.returnP10}B - ${data.returnP90}B</p>
                                    <p className="text-muted-foreground">95% CI: ${data.returnP2_5}B - ${data.returnP97_5}B</p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }} />
                        {/* Efficient frontier line with area */}
                        <Scatter 
                          name="Frontier" 
                          data={efficientFrontierData.frontier} 
                          fill="hsl(var(--primary))" 
                          line={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }} 
                        />
                        {/* Individual molecules */}
                        <Scatter name="Molecules" data={efficientFrontierData.points}>
                          {efficientFrontierData.points.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} r={8} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Confidence Band Legend & Info */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 rounded" style={{ backgroundColor: 'hsl(var(--primary))', opacity: 0.3 }} />
                      <span>80% Confidence Interval (P10-P90)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-3 rounded" style={{ backgroundColor: 'hsl(var(--primary))', opacity: 0.15 }} />
                      <span>95% Confidence Interval (P2.5-P97.5)</span>
                    </div>
                    {efficientFrontierData.frontier.length > 0 && (
                      <div className="ml-auto flex gap-4">
                        <Badge variant="outline" className="text-xs">
                          Best Sharpe: {Math.max(...efficientFrontierData.points.map(p => p.sharpe)).toFixed(2)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {efficientFrontierData.frontier.length} frontier points
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Confidence Interval Summary Table */}
                  {efficientFrontierData.frontier.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-medium mb-2">Efficient Frontier with Confidence Intervals</p>
                      <div className="overflow-x-auto max-h-[150px]">
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-background">
                            <tr className="border-b">
                              <th className="text-left py-1 px-2">Weights</th>
                              <th className="text-right py-1 px-2">Risk (σ)</th>
                              <th className="text-right py-1 px-2">Expected</th>
                              <th className="text-right py-1 px-2">80% CI</th>
                              <th className="text-right py-1 px-2">95% CI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {efficientFrontierData.frontier.slice(0, 10).map((point, idx) => (
                              <tr key={idx} className="border-b border-border/30 hover:bg-muted/50">
                                <td className="py-1 px-2 text-muted-foreground">{point.weights}</td>
                                <td className="text-right py-1 px-2">${point.risk}B</td>
                                <td className="text-right py-1 px-2 font-medium">${point.return}B</td>
                                <td className="text-right py-1 px-2 text-amber-600">
                                  ${point.returnP10 || '-'} - ${point.returnP90 || '-'}
                                </td>
                                <td className="text-right py-1 px-2 text-muted-foreground">
                                  ${point.returnP2_5 || '-'} - ${point.returnP97_5 || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

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
