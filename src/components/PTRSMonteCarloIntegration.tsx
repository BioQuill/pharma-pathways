import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  AreaChart, Area, ResponsiveContainer, ReferenceLine,
  ComposedChart, Line, Scatter, Legend
} from "recharts";
import { 
  Activity, TrendingUp, BarChart3, Target, AlertTriangle, 
  RefreshCw, Download, Info, Zap
} from "lucide-react";
import { 
  runMonteCarloSimulation, 
  runSensitivityAnalysis,
  runScenarioAnalysis,
  DEFAULT_SCENARIOS,
  type ComponentUncertainty,
  type SimulationResult,
  type SensitivityResult,
  type ScenarioResult
} from "@/lib/monteCarloSimulation";
import html2pdf from "html2pdf.js";

interface PTRSMonteCarloIntegrationProps {
  // Optional initial values from PTRS calculator
  initialMechanismNovelty?: number;
  initialEndpointClarity?: number;
  initialPriorTrialData?: number;
  initialSponsorExperience?: number;
  initialRegulatoryPrecedent?: number;
  initialSafetyProfile?: number;
  therapeuticArea?: string;
  currentPhase?: string;
}

export const PTRSMonteCarloIntegration: React.FC<PTRSMonteCarloIntegrationProps> = ({
  initialMechanismNovelty = 50,
  initialEndpointClarity = 70,
  initialPriorTrialData = 60,
  initialSponsorExperience = 65,
  initialRegulatoryPrecedent = 75,
  initialSafetyProfile = 70,
  therapeuticArea = "oncology",
  currentPhase = "phase2"
}) => {
  // PTRS Factor states
  const [mechanismNovelty, setMechanismNovelty] = useState(initialMechanismNovelty);
  const [endpointClarity, setEndpointClarity] = useState(initialEndpointClarity);
  const [priorTrialData, setPriorTrialData] = useState(initialPriorTrialData);
  const [sponsorExperience, setSponsorExperience] = useState(initialSponsorExperience);
  const [regulatoryPrecedent, setRegulatoryPrecedent] = useState(initialRegulatoryPrecedent);
  const [safetyProfile, setSafetyProfile] = useState(initialSafetyProfile);
  
  // Simulation config
  const [iterations, setIterations] = useState(10000);
  const [uncertaintyRange, setUncertaintyRange] = useState(15);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeView, setActiveView] = useState<"distribution" | "sensitivity" | "scenarios">("distribution");

  // TA Base rates for PTRS calculation
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

  // Convert PTRS factors to Monte Carlo component format
  const getComponentScores = (): ComponentUncertainty[] => {
    return [
      { name: 'Mechanism Novelty', baseScore: mechanismNovelty, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Endpoint Clarity', baseScore: endpointClarity, minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Prior Trial Data', baseScore: priorTrialData, minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Sponsor Experience', baseScore: sponsorExperience, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Regulatory Precedent', baseScore: regulatoryPrecedent, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Safety Profile', baseScore: safetyProfile, minScore: 0, maxScore: 100, weight: 0.15 },
    ];
  };

  // Calculate base PTRS
  const calculateBasePTRS = () => {
    const baseRate = taBaseRates[therapeuticArea] || { pts: 15, prs: 85 };
    const phaseMultiplier = phaseMultipliers[currentPhase] || 1;
    
    const ptsAdjustment = (mechanismNovelty * 0.15 + endpointClarity * 0.25 + priorTrialData * 0.35 + sponsorExperience * 0.25) / 100;
    const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + ptsAdjustment)));
    
    const prsAdjustment = (regulatoryPrecedent * 0.4 + safetyProfile * 0.4 + sponsorExperience * 0.2) / 100;
    const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + prsAdjustment * 0.6)));
    
    return {
      pts: Math.round(pts * 10) / 10,
      prs: Math.round(prs * 10) / 10,
      ptrs: Math.round((pts / 100) * prs * 10) / 10
    };
  };

  // Run Monte Carlo simulation
  const simulationResult = useMemo<SimulationResult | null>(() => {
    setIsSimulating(true);
    const componentScores = getComponentScores();
    const result = runMonteCarloSimulation(componentScores, {
      iterations,
      uncertaintyRange,
      confidenceInterval: 95
    });
    setIsSimulating(false);
    return result;
  }, [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile, iterations, uncertaintyRange]);

  // Run sensitivity analysis
  const sensitivityResults = useMemo<SensitivityResult[]>(() => {
    const componentScores = getComponentScores();
    return runSensitivityAnalysis(componentScores, 10);
  }, [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile]);

  // Run scenario analysis with PTRS-specific scenarios
  const ptrsScenarios = [
    {
      name: 'Optimistic Trial Outcome',
      adjustments: {
        'Mechanism Novelty': 0.15,
        'Endpoint Clarity': 0.20,
        'Prior Trial Data': 0.25,
        'Safety Profile': 0.10,
      },
    },
    {
      name: 'Pessimistic Trial Outcome',
      adjustments: {
        'Mechanism Novelty': -0.10,
        'Endpoint Clarity': -0.15,
        'Prior Trial Data': -0.20,
        'Safety Profile': -0.15,
      },
    },
    {
      name: 'Regulatory Challenge',
      adjustments: {
        'Regulatory Precedent': -0.25,
        'Safety Profile': -0.10,
        'Sponsor Experience': -0.05,
      },
    },
    {
      name: 'Strong Safety Data',
      adjustments: {
        'Safety Profile': 0.30,
        'Regulatory Precedent': 0.15,
        'Endpoint Clarity': 0.10,
      },
    },
  ];

  const scenarioResults = useMemo<ScenarioResult[]>(() => {
    const componentScores = getComponentScores();
    return runScenarioAnalysis(componentScores, ptrsScenarios);
  }, [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile]);

  const basePTRS = calculateBasePTRS();

  // Generate PTRS probability distribution from simulation
  const ptrsDistribution = useMemo(() => {
    if (!simulationResult) return [];
    
    // Convert composite scores to PTRS values
    const baseRate = taBaseRates[therapeuticArea] || { pts: 15, prs: 85 };
    const phaseMultiplier = phaseMultipliers[currentPhase] || 1;
    
    const ptrsValues = simulationResult.compositeScoreDistribution.map(composite => {
      const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + composite / 100)));
      const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + composite / 100 * 0.6)));
      return (pts / 100) * prs;
    });
    
    // Create histogram
    const sorted = [...ptrsValues].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const binCount = 20;
    const binWidth = (max - min) / binCount;
    
    const bins = [];
    for (let i = 0; i < binCount; i++) {
      const minValue = min + i * binWidth;
      const maxValue = min + (i + 1) * binWidth;
      const count = ptrsValues.filter(v => v >= minValue && v < maxValue).length;
      
      bins.push({
        range: `${minValue.toFixed(1)}% - ${maxValue.toFixed(1)}%`,
        midpoint: (minValue + maxValue) / 2,
        count,
        percentage: Math.round(count / ptrsValues.length * 1000) / 10,
        minValue,
        maxValue,
      });
    }
    
    return bins;
  }, [simulationResult, therapeuticArea, currentPhase]);

  // Calculate PTRS statistics
  const ptrsStats = useMemo(() => {
    if (!simulationResult) return null;
    
    const baseRate = taBaseRates[therapeuticArea] || { pts: 15, prs: 85 };
    const phaseMultiplier = phaseMultipliers[currentPhase] || 1;
    
    const ptrsValues = simulationResult.compositeScoreDistribution.map(composite => {
      const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + composite / 100)));
      const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + composite / 100 * 0.6)));
      return (pts / 100) * prs;
    });
    
    const sorted = [...ptrsValues].sort((a, b) => a - b);
    const n = sorted.length;
    const mean = ptrsValues.reduce((s, v) => s + v, 0) / n;
    const median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
    const variance = ptrsValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    
    const p5 = sorted[Math.floor(0.05 * n)];
    const p25 = sorted[Math.floor(0.25 * n)];
    const p75 = sorted[Math.floor(0.75 * n)];
    const p95 = sorted[Math.floor(0.95 * n)];
    
    // Calculate probability of achieving different PTRS thresholds
    const prob10Plus = (ptrsValues.filter(v => v >= 10).length / n) * 100;
    const prob15Plus = (ptrsValues.filter(v => v >= 15).length / n) * 100;
    const prob20Plus = (ptrsValues.filter(v => v >= 20).length / n) * 100;
    
    return {
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      stdDev: Math.round(stdDev * 100) / 100,
      min: Math.round(sorted[0] * 100) / 100,
      max: Math.round(sorted[n - 1] * 100) / 100,
      p5: Math.round(p5 * 100) / 100,
      p25: Math.round(p25 * 100) / 100,
      p75: Math.round(p75 * 100) / 100,
      p95: Math.round(p95 * 100) / 100,
      prob10Plus: Math.round(prob10Plus * 10) / 10,
      prob15Plus: Math.round(prob15Plus * 10) / 10,
      prob20Plus: Math.round(prob20Plus * 10) / 10,
    };
  }, [simulationResult, therapeuticArea, currentPhase]);

  const handleExportPDF = async () => {
    const element = document.getElementById('ptrs-monte-carlo-content');
    if (!element) return;
    
    const opt = {
      margin: 10,
      filename: 'PTRS_MonteCarlo_Analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    await html2pdf().set(opt).from(element).save();
  };

  const getSensitivityColor = (sensitivity: number): string => {
    if (sensitivity > 15) return 'hsl(var(--destructive))';
    if (sensitivity > 10) return 'hsl(var(--primary))';
    if (sensitivity > 5) return 'hsl(var(--warning))';
    return 'hsl(var(--muted-foreground))';
  };

  return (
    <div className="space-y-6" id="ptrs-monte-carlo-content">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Monte Carlo PTRS Simulation
          </h3>
          <p className="text-sm text-muted-foreground">
            Probability distributions for success outcomes with {iterations.toLocaleString()} simulations
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPDF}>
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Configuration Panel */}
      <Card className="border-primary/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Simulation Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Iterations</Label>
              <Select value={iterations.toString()} onValueChange={(v) => setIterations(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1,000</SelectItem>
                  <SelectItem value="5000">5,000</SelectItem>
                  <SelectItem value="10000">10,000</SelectItem>
                  <SelectItem value="25000">25,000</SelectItem>
                  <SelectItem value="50000">50,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Uncertainty Range: ±{uncertaintyRange}%</Label>
              <Slider
                value={[uncertaintyRange]}
                onValueChange={(v) => setUncertaintyRange(v[0])}
                min={5}
                max={30}
                step={1}
              />
            </div>
            <div className="flex items-end">
              <Badge variant="outline" className="h-9 px-4 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Base PTRS: {basePTRS.ptrs}%
              </Badge>
            </div>
          </div>
          
          {/* PTRS Factor Sliders */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-xs">Mechanism Novelty: {mechanismNovelty}</Label>
              <Slider value={[mechanismNovelty]} onValueChange={(v) => setMechanismNovelty(v[0])} max={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Endpoint Clarity: {endpointClarity}</Label>
              <Slider value={[endpointClarity]} onValueChange={(v) => setEndpointClarity(v[0])} max={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Prior Trial Data: {priorTrialData}</Label>
              <Slider value={[priorTrialData]} onValueChange={(v) => setPriorTrialData(v[0])} max={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Sponsor Experience: {sponsorExperience}</Label>
              <Slider value={[sponsorExperience]} onValueChange={(v) => setSponsorExperience(v[0])} max={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Regulatory Precedent: {regulatoryPrecedent}</Label>
              <Slider value={[regulatoryPrecedent]} onValueChange={(v) => setRegulatoryPrecedent(v[0])} max={100} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Safety Profile: {safetyProfile}</Label>
              <Slider value={[safetyProfile]} onValueChange={(v) => setSafetyProfile(v[0])} max={100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      {ptrsStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Card className="bg-primary/5">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-primary">{ptrsStats.mean}%</p>
              <p className="text-xs text-muted-foreground">Mean PTRS</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">{ptrsStats.median}%</p>
              <p className="text-xs text-muted-foreground">Median</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/50">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold">±{ptrsStats.stdDev}%</p>
              <p className="text-xs text-muted-foreground">Std Dev</p>
            </CardContent>
          </Card>
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{ptrsStats.prob10Plus}%</p>
              <p className="text-xs text-muted-foreground">P(PTRS ≥10%)</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{ptrsStats.prob15Plus}%</p>
              <p className="text-xs text-muted-foreground">P(PTRS ≥15%)</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{ptrsStats.prob20Plus}%</p>
              <p className="text-xs text-muted-foreground">P(PTRS ≥20%)</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs for different views */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Sensitivity
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Scenarios
          </TabsTrigger>
        </TabsList>

        {/* Distribution View */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PTRS Probability Distribution</CardTitle>
              <CardDescription>Monte Carlo simulation of PTRS outcomes with {uncertaintyRange}% uncertainty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={ptrsDistribution}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="midpoint" 
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                      fontSize={11}
                    />
                    <YAxis 
                      yAxisId="count"
                      orientation="left"
                      tickFormatter={(v) => v.toLocaleString()}
                      fontSize={11}
                    />
                    <YAxis 
                      yAxisId="pct"
                      orientation="right"
                      tickFormatter={(v) => `${v}%`}
                      fontSize={11}
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                              <p className="font-medium">{data.range}</p>
                              <p className="text-muted-foreground">Count: {data.count.toLocaleString()}</p>
                              <p className="text-primary">Probability: {data.percentage}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      yAxisId="count"
                      dataKey="count" 
                      fill="hsl(var(--primary))" 
                      opacity={0.7}
                      radius={[2, 2, 0, 0]}
                    />
                    <Line 
                      yAxisId="pct"
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      dot={false}
                    />
                    {ptrsStats && (
                      <>
                        <ReferenceLine 
                          yAxisId="count"
                          x={ptrsStats.mean} 
                          stroke="hsl(var(--primary))" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                        />
                        <ReferenceLine 
                          yAxisId="count"
                          x={ptrsStats.p5} 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeDasharray="3 3"
                        />
                        <ReferenceLine 
                          yAxisId="count"
                          x={ptrsStats.p95} 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeDasharray="3 3"
                        />
                      </>
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Percentile Summary */}
              {ptrsStats && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Percentile Summary</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">P5: {ptrsStats.p5}%</Badge>
                    <Badge variant="outline">P25: {ptrsStats.p25}%</Badge>
                    <Badge variant="secondary">P50: {ptrsStats.median}%</Badge>
                    <Badge variant="outline">P75: {ptrsStats.p75}%</Badge>
                    <Badge variant="outline">P95: {ptrsStats.p95}%</Badge>
                    <span className="ml-2 text-muted-foreground">
                      Range: {ptrsStats.min}% - {ptrsStats.max}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity View */}
        <TabsContent value="sensitivity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Factor Sensitivity Analysis</CardTitle>
              <CardDescription>Impact of ±10% change in each factor on PTRS outcome</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityResults} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} fontSize={11} />
                    <YAxis type="category" dataKey="componentName" width={130} fontSize={11} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                              <p className="font-medium">{data.componentName}</p>
                              <p className="text-green-600">+10%: +{data.upImpact}%</p>
                              <p className="text-red-600">-10%: {data.downImpact}%</p>
                              <p className="text-primary">Sensitivity: {data.sensitivity}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="upImpact" fill="hsl(142, 71%, 45%)" name="Upside" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="downImpact" fill="hsl(0, 84%, 60%)" name="Downside" radius={[0, 4, 4, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Sensitivity Rankings */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Key Drivers (by sensitivity)</h4>
                <div className="space-y-2">
                  {sensitivityResults.slice(0, 3).map((result, idx) => (
                    <div key={result.componentName} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                          {idx + 1}
                        </Badge>
                        <span className="text-sm">{result.componentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">+{result.upImpact}%</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-sm text-red-600">{result.downImpact}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios View */}
        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scenario Analysis</CardTitle>
              <CardDescription>PTRS outcomes under different clinical and regulatory scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioResults}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" fontSize={11} angle={-15} textAnchor="end" height={60} />
                    <YAxis tickFormatter={(v) => `${v}%`} fontSize={11} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
                              <p className="font-medium">{data.name}</p>
                              <p>Composite Score: {data.compositeScore}</p>
                              <p className="text-primary">Success Probability: {data.blockbusterProbability}%</p>
                              <p className={data.deltaFromBase >= 0 ? 'text-green-600' : 'text-red-600'}>
                                vs Base: {data.deltaFromBase >= 0 ? '+' : ''}{data.deltaFromBase}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="blockbusterProbability" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Scenario Details */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Scenario Comparison</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2">Scenario</th>
                        <th className="text-center p-2">Score</th>
                        <th className="text-center p-2">Success Prob.</th>
                        <th className="text-center p-2">Δ vs Base</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioResults.map((scenario) => (
                        <tr key={scenario.name} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{scenario.name}</td>
                          <td className="text-center p-2">{scenario.compositeScore}</td>
                          <td className="text-center p-2">
                            <Badge variant={scenario.blockbusterProbability > 50 ? 'default' : 'outline'}>
                              {scenario.blockbusterProbability}%
                            </Badge>
                          </td>
                          <td className="text-center p-2">
                            <span className={scenario.deltaFromBase >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {scenario.deltaFromBase >= 0 ? '+' : ''}{scenario.deltaFromBase}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Risk Insights */}
      {ptrsStats && simulationResult && (
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Risk Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>
                  <strong>95% Confidence Interval:</strong> PTRS between {ptrsStats.p5}% and {ptrsStats.p95}%
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>
                  <strong>Volatility:</strong> Standard deviation of ±{ptrsStats.stdDev}% indicates 
                  {ptrsStats.stdDev > 3 ? ' high' : ptrsStats.stdDev > 1.5 ? ' moderate' : ' low'} outcome uncertainty
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>
                  <strong>Key Driver:</strong> {sensitivityResults[0]?.componentName} has the highest impact on outcomes
                </span>
              </li>
              {ptrsStats.prob20Plus < 20 && (
                <li className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4 mt-0.5" />
                  <span>
                    <strong>Warning:</strong> Only {ptrsStats.prob20Plus}% probability of achieving ≥20% PTRS
                  </span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
