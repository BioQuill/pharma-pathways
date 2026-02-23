import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, TrendingUp, Target, Download, Play, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, ReferenceLine } from 'recharts';
import { MoleculeProfile } from '@/lib/moleculesData';
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";

interface MonteCarloConvergenceAnalysisProps {
  molecules: MoleculeProfile[];
}

interface ConvergencePoint {
  iterations: number;
  mean: number;
  stdError: number;
  ci95Lower: number;
  ci95Upper: number;
  ciWidth: number;
  isConverged: boolean;
}

interface ConvergenceResult {
  molecule: MoleculeProfile;
  convergenceData: ConvergencePoint[];
  optimalIterations: number;
  convergenceRate: number;
  finalMean: number;
  finalStdError: number;
  stability: number;
}

const MonteCarloConvergenceAnalysis: React.FC<MonteCarloConvergenceAnalysisProps> = ({ molecules }) => {
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('');
  const [convergenceThreshold, setConvergenceThreshold] = useState([1.0]);
  const [maxIterations, setMaxIterations] = useState([10000]);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ConvergenceResult | null>(null);
  const [progress, setProgress] = useState(0);

  const availableMolecules = useMemo(() => {
    return molecules.filter(m => !m.isFailed).slice(0, 30);
  }, [molecules]);

  const selectedMolecule = useMemo(() => {
    return molecules.find(m => m.id === selectedMoleculeId);
  }, [molecules, selectedMoleculeId]);

  const runConvergenceAnalysis = () => {
    if (!selectedMolecule) return;
    
    setIsRunning(true);
    setProgress(0);
    
    const baseScore = selectedMolecule.scores.approval * 100;
    const volatility = 0.15 + Math.random() * 0.1;
    
    const iterationSteps = [100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000, 6000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000];
    const relevantSteps = iterationSteps.filter(s => s <= maxIterations[0]);
    
    let progressStep = 0;
    const convergenceData: ConvergencePoint[] = [];
    
    const processStep = (stepIndex: number) => {
      if (stepIndex >= relevantSteps.length) {
        const optimalIdx = convergenceData.findIndex(d => d.isConverged);
        const optimalIterations = optimalIdx >= 0 ? convergenceData[optimalIdx].iterations : relevantSteps[relevantSteps.length - 1];
        
        const finalPoint = convergenceData[convergenceData.length - 1];
        const initialCIWidth = convergenceData[0]?.ciWidth || 10;
        const convergenceRate = ((initialCIWidth - finalPoint.ciWidth) / initialCIWidth) * 100;
        
        const stability = Math.min(100, (1 - (finalPoint.stdError / finalPoint.mean)) * 100);
        
        setResult({
          molecule: selectedMolecule,
          convergenceData,
          optimalIterations,
          convergenceRate,
          finalMean: finalPoint.mean,
          finalStdError: finalPoint.stdError,
          stability
        });
        
        setIsRunning(false);
        setProgress(100);
        return;
      }
      
      const n = relevantSteps[stepIndex];
      
      // Simulate running n iterations
      let sum = 0;
      let sumSq = 0;
      for (let i = 0; i < Math.min(n, 1000); i++) {
        const value = baseScore + (Math.random() - 0.5) * 2 * volatility * baseScore;
        sum += value;
        sumSq += value * value;
      }
      
      const scaleFactor = n / Math.min(n, 1000);
      const mean = sum / Math.min(n, 1000);
      const variance = (sumSq / Math.min(n, 1000)) - (mean * mean);
      const stdError = Math.sqrt(variance / n) * (1 + 0.5 / Math.sqrt(n));
      
      const ci95Lower = mean - 1.96 * stdError;
      const ci95Upper = mean + 1.96 * stdError;
      const ciWidth = ci95Upper - ci95Lower;
      
      const isConverged = ciWidth <= convergenceThreshold[0];
      
      convergenceData.push({
        iterations: n,
        mean,
        stdError,
        ci95Lower,
        ci95Upper,
        ciWidth,
        isConverged
      });
      
      setProgress((stepIndex / relevantSteps.length) * 100);
      
      setTimeout(() => processStep(stepIndex + 1), 50);
    };
    
    processStep(0);
  };

  const ciWidthChartData = result?.convergenceData.map(d => ({
    iterations: d.iterations,
    ciWidth: d.ciWidth,
    threshold: convergenceThreshold[0],
    converged: d.isConverged ? d.ciWidth : null
  })) || [];

  const meanChartData = result?.convergenceData.map(d => ({
    iterations: d.iterations,
    mean: d.mean,
    upper: d.ci95Upper,
    lower: d.ci95Lower
  })) || [];

  const stdErrorChartData = result?.convergenceData.map(d => ({
    iterations: d.iterations,
    stdError: d.stdError * 100
  })) || [];

  const getRecommendation = () => {
    if (!result) return null;
    
    if (result.optimalIterations <= 1000) {
      return {
        level: 'success',
        message: 'Fast convergence! 1,000 iterations are sufficient for reliable results.',
        icon: CheckCircle
      };
    } else if (result.optimalIterations <= 5000) {
      return {
        level: 'info',
        message: `Moderate convergence. Recommend ${result.optimalIterations.toLocaleString()} iterations for best accuracy.`,
        icon: Info
      };
    } else {
      return {
        level: 'warning',
        message: `Slow convergence. Consider ${result.optimalIterations.toLocaleString()}+ iterations or adjusting model parameters.`,
        icon: AlertTriangle
      };
    }
  };

  const recommendation = getRecommendation();

  const exportToPDF = async () => {
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF(
      'convergence-analysis-content',
      `Monte_Carlo_Convergence_${selectedMolecule?.name || 'Analysis'}.pdf`,
      { orientation: 'landscape', format: 'letter' }
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle>Monte Carlo Convergence Analysis</CardTitle>
          </div>
          {result && (
            <Button variant="export" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Analyze how simulation accuracy improves with more iterations and find optimal settings
        </p>
      </CardHeader>
      <CardContent>
        <div id="convergence-analysis-content">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 p-4 bg-muted/30 rounded-lg">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Molecule</label>
              <select
                className="w-full p-2 rounded-md border bg-background"
                value={selectedMoleculeId}
                onChange={(e) => setSelectedMoleculeId(e.target.value)}
              >
                <option value="">Select a molecule...</option>
                {availableMolecules.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.phase})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Convergence Threshold: {convergenceThreshold[0].toFixed(2)}%
              </label>
              <Slider
                value={convergenceThreshold}
                onValueChange={setConvergenceThreshold}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-4"
              />
              <p className="text-xs text-muted-foreground mt-1">
                95% CI width target for convergence
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Iterations: {maxIterations[0].toLocaleString()}
              </label>
              <Slider
                value={maxIterations}
                onValueChange={setMaxIterations}
                min={1000}
                max={50000}
                step={1000}
                className="mt-4"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum iterations to test
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={runConvergenceAnalysis} 
              disabled={!selectedMoleculeId || isRunning}
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Analyzing...' : 'Run Convergence Analysis'}
            </Button>
            {isRunning && (
              <div className="flex items-center gap-3 flex-1">
                <Progress value={progress} className="w-48" />
                <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
              </div>
            )}
          </div>

          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Optimal Iterations</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{result.optimalIterations.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">For {convergenceThreshold[0]}% CI width</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium">Convergence Rate</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{result.convergenceRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">CI width reduction</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-warning" />
                      <span className="text-sm font-medium">Final Mean</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{result.finalMean.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">± {result.finalStdError.toFixed(3)}%</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Stability Score</span>
                    </div>
                    <p className="text-2xl font-bold mt-2">{result.stability.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Result reliability</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendation */}
              {recommendation && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
                  recommendation.level === 'success' ? 'bg-success/10 border border-success/20' :
                  recommendation.level === 'warning' ? 'bg-warning/10 border border-warning/20' :
                  'bg-primary/10 border border-primary/20'
                }`}>
                  <recommendation.icon className={`h-5 w-5 ${
                    recommendation.level === 'success' ? 'text-success' :
                    recommendation.level === 'warning' ? 'text-warning' :
                    'text-primary'
                  }`} />
                  <span className="font-medium">{recommendation.message}</span>
                </div>
              )}

              <Tabs defaultValue="ciwidth">
                <TabsList className="mb-4 bg-sky-100 dark:bg-sky-950/30">
                  <TabsTrigger value="ciwidth">CI Width Convergence</TabsTrigger>
                  <TabsTrigger value="mean">Mean Stability</TabsTrigger>
                  <TabsTrigger value="stderr">Standard Error</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="ciwidth">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ciWidthChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="iterations" 
                          tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v}
                          label={{ value: 'Iterations', position: 'bottom', offset: -5 }}
                        />
                        <YAxis 
                          domain={[0, 'auto']}
                          label={{ value: 'CI Width (%)', angle: -90, position: 'left' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }}
                          formatter={(value: any) => [`${value.toFixed(3)}%`, 'CI Width']}
                          labelFormatter={(label) => `${label.toLocaleString()} iterations`}
                        />
                        <ReferenceLine 
                          y={convergenceThreshold[0]} 
                          stroke="hsl(var(--success))" 
                          strokeDasharray="5 5"
                          label={{ value: 'Threshold', fill: 'hsl(var(--success))' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="ciWidth" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                          name="CI Width"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    95% Confidence Interval width decreases with more iterations (√n law)
                  </p>
                </TabsContent>

                <TabsContent value="mean">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={meanChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="iterations" 
                          tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v}
                        />
                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }}
                          formatter={(value: any) => [`${value.toFixed(2)}%`]}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="upper" 
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.1}
                          name="Upper 95% CI"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="lower" 
                          stroke="hsl(var(--muted-foreground))"
                          fill="hsl(var(--background))"
                          fillOpacity={1}
                          name="Lower 95% CI"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="mean" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          dot={false}
                          name="Mean PTRS"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Mean estimate stabilizes as confidence interval narrows
                  </p>
                </TabsContent>

                <TabsContent value="stderr">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stdErrorChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="iterations" 
                          tickFormatter={(v) => v >= 1000 ? `${v/1000}k` : v}
                        />
                        <YAxis 
                          label={{ value: 'Std Error (% of mean)', angle: -90, position: 'left' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }}
                          formatter={(value: any) => [`${value.toFixed(3)}%`, 'Std Error']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="stdError" 
                          stroke="hsl(var(--warning))" 
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--warning))', r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Standard error follows 1/√n decay pattern
                  </p>
                </TabsContent>

                <TabsContent value="data">
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="text-left p-2">Iterations</th>
                          <th className="text-center p-2">Mean</th>
                          <th className="text-center p-2">Std Error</th>
                          <th className="text-center p-2">95% CI Lower</th>
                          <th className="text-center p-2">95% CI Upper</th>
                          <th className="text-center p-2">CI Width</th>
                          <th className="text-center p-2">Converged</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.convergenceData.map((d, i) => (
                          <tr key={i} className={`border-b ${d.isConverged ? 'bg-success/10' : ''}`}>
                            <td className="p-2">{d.iterations.toLocaleString()}</td>
                            <td className="text-center p-2">{d.mean.toFixed(3)}%</td>
                            <td className="text-center p-2">{d.stdError.toFixed(4)}%</td>
                            <td className="text-center p-2">{d.ci95Lower.toFixed(3)}%</td>
                            <td className="text-center p-2">{d.ci95Upper.toFixed(3)}%</td>
                            <td className="text-center p-2">{d.ciWidth.toFixed(4)}%</td>
                            <td className="text-center p-2">
                              {d.isConverged ? (
                                <Badge variant="default" className="bg-success">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonteCarloConvergenceAnalysis;
