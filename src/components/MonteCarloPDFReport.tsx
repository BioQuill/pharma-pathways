import { useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { type SimulationResult, type SensitivityResult, type ScenarioResult } from "@/lib/monteCarloSimulation";

interface MonteCarloPDFReportProps {
  simulationResult: SimulationResult;
  sensitivityResult: SensitivityResult[] | null;
  scenarioResult: ScenarioResult[] | null;
  scenarioStats: {
    optimistic: { mean: number; median: number; p10: number; p90: number };
    base: { mean: number; median: number; p10: number; p90: number };
    pessimistic: { mean: number; median: number; p10: number; p90: number };
  } | null;
  moleculeName?: string;
  therapeuticArea?: string;
  phase?: string;
  company?: string;
  iterations: number;
  uncertaintyRange: number;
}

const getScoreColor = (score: number): string => {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#ca8a04";
  if (score >= 40) return "#ea580c";
  return "#dc2626";
};

const getRatioColor = (ratio: number, thresholds: { good: number; fair: number }): string => {
  if (ratio >= thresholds.good) return "#16a34a";
  if (ratio >= thresholds.fair) return "#ca8a04";
  return "#dc2626";
};

const MonteCarloPDFReport = ({ 
  simulationResult,
  sensitivityResult,
  scenarioResult,
  scenarioStats,
  moleculeName = "Custom Analysis",
  therapeuticArea = "N/A",
  phase = "N/A",
  company = "N/A",
  iterations,
  uncertaintyRange
}: MonteCarloPDFReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = useCallback(async () => {
    if (!reportRef.current) return;
    
    const element = reportRef.current;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `MonteCarlo_Report_${moleculeName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  }, [moleculeName]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const { statistics, percentiles } = simulationResult;
  const riskMetrics = statistics.riskAdjustedReturn;
  const blockbusterProb = ((simulationResult.peakSalesDistribution.filter(v => v >= 1).length / 
    simulationResult.peakSalesDistribution.length) * 100).toFixed(1);
  const megaBlockbusterProb = ((simulationResult.peakSalesDistribution.filter(v => v >= 2).length / 
    simulationResult.peakSalesDistribution.length) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Monte Carlo PDF Report
          </h3>
          <p className="text-sm text-muted-foreground">
            Export comprehensive simulation analysis with all metrics
          </p>
        </div>
        <Button onClick={generatePDF} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>

      {/* Report Content for PDF */}
      <Card className="border-2">
        <CardContent className="p-0">
          <div 
            ref={reportRef} 
            className="p-6 bg-white text-black"
            style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px' }}
          >
            {/* Header */}
            <div style={{ borderBottom: '3px solid #6366f1', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#4338ca' }}>
                    Monte Carlo Simulation Report
                  </h1>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    Probabilistic Peak Sales Analysis
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '10px', color: '#6b7280' }}>Report Generated</p>
                  <p style={{ fontSize: '12px', fontWeight: '600' }}>{currentDate}</p>
                </div>
              </div>
            </div>

            {/* Molecule Info & Config */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {moleculeName}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Therapeutic Area</p>
                    <p style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>{therapeuticArea}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Phase</p>
                    <p style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>{phase}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>Company</p>
                    <p style={{ fontSize: '12px', fontWeight: '600', margin: 0 }}>{company}</p>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                <p style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#1e40af' }}>
                  Simulation Parameters
                </p>
                <p style={{ fontSize: '10px', margin: '2px 0' }}>Iterations: <strong>{iterations.toLocaleString()}</strong></p>
                <p style={{ fontSize: '10px', margin: '2px 0' }}>Uncertainty: <strong>±{uncertaintyRange}%</strong></p>
                <p style={{ fontSize: '10px', margin: '2px 0' }}>Confidence: <strong>95%</strong></p>
              </div>
            </div>

            {/* Key Metrics Summary */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                Distribution Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '9px', color: '#15803d', margin: 0 }}>Mean</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0' }}>${statistics.mean}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Median</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '2px 0' }}>${statistics.median}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fff7ed', borderRadius: '6px', border: '1px solid #fed7aa' }}>
                  <p style={{ fontSize: '9px', color: '#c2410c', margin: 0 }}>Std Dev</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#ea580c', margin: '2px 0' }}>±${statistics.stdDev}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  <p style={{ fontSize: '9px', color: '#dc2626', margin: 0 }}>Min</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#dc2626', margin: '2px 0' }}>${statistics.min}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '9px', color: '#15803d', margin: 0 }}>Max</p>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0' }}>${statistics.max}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>P10-P90</p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '2px 0' }}>${percentiles.p10}B-${percentiles.p90}B</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fef9c3', borderRadius: '6px', border: '1px solid #fde047' }}>
                  <p style={{ fontSize: '9px', color: '#a16207', margin: 0 }}>90% CI</p>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#ca8a04', margin: '2px 0' }}>${percentiles.p5}B-${percentiles.p95}B</p>
                </div>
              </div>
            </div>

            {/* Risk-Adjusted Metrics */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                Risk-Adjusted Return Metrics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Primary Values */}
                <div style={{ padding: '12px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '8px', border: '1px solid #93c5fd' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#1e40af', margin: 0 }}>Risk-Weighted Value (RWV)</p>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', margin: '4px 0' }}>
                        ${riskMetrics.riskWeightedValue}B
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '10px', color: '#1e40af', margin: 0 }}>Certainty Equivalent</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e40af', margin: '4px 0' }}>
                        ${riskMetrics.certaintyEquivalent}B
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ratios Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Sharpe Ratio</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: getRatioColor(riskMetrics.sharpeRatio, { good: 1, fair: 0.5 }), margin: '2px 0' }}>
                      {riskMetrics.sharpeRatio}
                    </p>
                    <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0 }}>
                      {riskMetrics.sharpeRatio >= 1 ? 'Excellent' : riskMetrics.sharpeRatio >= 0.5 ? 'Good' : 'Low'}
                    </p>
                  </div>
                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Sortino Ratio</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: getRatioColor(riskMetrics.sortinoRatio, { good: 2, fair: 1 }), margin: '2px 0' }}>
                      {riskMetrics.sortinoRatio}
                    </p>
                    <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0 }}>Downside-adjusted</p>
                  </div>
                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                    <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Risk/Reward</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: getRatioColor(riskMetrics.riskRewardRatio, { good: 1.5, fair: 1 }), margin: '2px 0' }}>
                      {riskMetrics.riskRewardRatio}x
                    </p>
                  </div>
                  <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <p style={{ fontSize: '9px', color: '#15803d', margin: 0 }}>P(≥$1B)</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0' }}>
                      {riskMetrics.probabilityOfSuccess}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Downside Risk */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                Downside Risk & Upside Potential
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  <p style={{ fontSize: '9px', color: '#dc2626', margin: 0 }}>Value at Risk (95%)</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', margin: '2px 0' }}>${riskMetrics.valueAtRisk}B</p>
                  <p style={{ fontSize: '8px', color: '#ef4444', margin: 0 }}>5th percentile</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>
                  <p style={{ fontSize: '9px', color: '#dc2626', margin: 0 }}>Expected Shortfall</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#dc2626', margin: '2px 0' }}>${riskMetrics.expectedShortfall}B</p>
                  <p style={{ fontSize: '8px', color: '#ef4444', margin: 0 }}>CVaR (avg worst 5%)</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Downside Deviation</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0' }}>±${riskMetrics.downsideDeviation}B</p>
                  <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0 }}>Below-mean volatility</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '9px', color: '#15803d', margin: 0 }}>Upside Potential</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0' }}>${riskMetrics.upsidePotential}B</p>
                  <p style={{ fontSize: '8px', color: '#22c55e', margin: 0 }}>Expected above median</p>
                </div>
              </div>
            </div>

            {/* Percentile Table */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                Full Percentile Distribution
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P5</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P10</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P25</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', backgroundColor: '#dbeafe' }}>P50 (Median)</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P75</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P90</th>
                    <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>P95</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#dc2626' }}>${percentiles.p5}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>${percentiles.p10}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>${percentiles.p25}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#eff6ff', color: '#3b82f6' }}>${percentiles.p50}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>${percentiles.p75}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>${percentiles.p90}B</td>
                    <td style={{ padding: '6px', textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>${percentiles.p95}B</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Scenario Analysis */}
            {scenarioStats && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                  Scenario Comparison
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  <div style={{ padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#15803d', margin: '0 0 4px 0' }}>Optimistic (+15%)</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0' }}>${scenarioStats.optimistic.mean}B</p>
                    <p style={{ fontSize: '9px', color: '#22c55e', margin: '2px 0' }}>Median: ${scenarioStats.optimistic.median}B</p>
                    <p style={{ fontSize: '9px', color: '#22c55e', margin: 0 }}>P10-P90: ${scenarioStats.optimistic.p10}B - ${scenarioStats.optimistic.p90}B</p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e40af', margin: '0 0 4px 0' }}>Base Case</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6', margin: '0' }}>${scenarioStats.base.mean}B</p>
                    <p style={{ fontSize: '9px', color: '#60a5fa', margin: '2px 0' }}>Median: ${scenarioStats.base.median}B</p>
                    <p style={{ fontSize: '9px', color: '#60a5fa', margin: 0 }}>P10-P90: ${scenarioStats.base.p10}B - ${scenarioStats.base.p90}B</p>
                  </div>
                  <div style={{ padding: '10px', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fca5a5' }}>
                    <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#b91c1c', margin: '0 0 4px 0' }}>Pessimistic (-15%)</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc2626', margin: '0' }}>${scenarioStats.pessimistic.mean}B</p>
                    <p style={{ fontSize: '9px', color: '#ef4444', margin: '2px 0' }}>Median: ${scenarioStats.pessimistic.median}B</p>
                    <p style={{ fontSize: '9px', color: '#ef4444', margin: 0 }}>P10-P90: ${scenarioStats.pessimistic.p10}B - ${scenarioStats.pessimistic.p90}B</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sensitivity Analysis */}
            {sensitivityResult && sensitivityResult.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                  Sensitivity Analysis (Top Drivers)
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                      <th style={{ padding: '6px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Component</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Upside (+10%)</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Downside (-10%)</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Net Sensitivity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityResult.slice(0, 5).map((item, idx) => (
                      <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                        <td style={{ padding: '6px', borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>
                          {item.componentName}
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#16a34a' }}>
                          +{item.upImpact.toFixed(1)}%
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', color: '#dc2626' }}>
                          {item.downImpact.toFixed(1)}%
                        </td>
                        <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                          {item.sensitivity.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Distribution Statistics */}
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#374151' }}>
                Advanced Distribution Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Skewness</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0' }}>{statistics.skewness}</p>
                  <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0 }}>
                    {statistics.skewness > 0 ? 'Right-skewed' : statistics.skewness < 0 ? 'Left-skewed' : 'Symmetric'}
                  </p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                  <p style={{ fontSize: '9px', color: '#6b7280', margin: 0 }}>Excess Kurtosis</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '2px 0' }}>{statistics.kurtosis}</p>
                  <p style={{ fontSize: '8px', color: '#9ca3af', margin: 0 }}>
                    {statistics.kurtosis > 0 ? 'Heavy tails' : statistics.kurtosis < 0 ? 'Light tails' : 'Normal'}
                  </p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                  <p style={{ fontSize: '9px', color: '#15803d', margin: 0 }}>P(≥$1B)</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0' }}>{blockbusterProb}%</p>
                  <p style={{ fontSize: '8px', color: '#22c55e', margin: 0 }}>Blockbuster</p>
                </div>
                <div style={{ padding: '8px', textAlign: 'center', backgroundColor: '#fef9c3', borderRadius: '6px', border: '1px solid #fde047' }}>
                  <p style={{ fontSize: '9px', color: '#a16207', margin: 0 }}>P(≥$2B)</p>
                  <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#ca8a04', margin: '2px 0' }}>{megaBlockbusterProb}%</p>
                  <p style={{ fontSize: '8px', color: '#d97706', margin: 0 }}>Mega-blockbuster</p>
                </div>
              </div>
            </div>

            {/* Methodology Note */}
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              borderLeft: '3px solid #6366f1',
              marginBottom: '16px'
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#4338ca' }}>
                Methodology Note
              </h4>
              <p style={{ fontSize: '9px', color: '#374151', margin: 0, lineHeight: '1.4' }}>
                This Monte Carlo simulation generates {iterations.toLocaleString()} random samples using triangular distributions 
                bounded by ±{uncertaintyRange}% uncertainty on each component score. Risk-adjusted metrics include the Risk-Weighted 
                Value (RWV) combining mean estimates with volatility penalties and success probability, Sharpe and Sortino ratios 
                for risk-return comparison, and Value at Risk (VaR) / Expected Shortfall (CVaR) for tail risk assessment. 
                Results should be interpreted as probabilistic guidance, not deterministic forecasts.
              </p>
            </div>

            {/* Footer */}
            <div style={{ 
              borderTop: '1px solid #e5e7eb', 
              paddingTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: '#9ca3af'
            }}>
              <span>Monte Carlo Simulation Model v1.0</span>
              <span>Confidential - For Internal Use Only</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonteCarloPDFReport;
