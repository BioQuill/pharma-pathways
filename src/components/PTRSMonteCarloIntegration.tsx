import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartTooltip } from "@/components/ui/chart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, ReferenceLine,
  ComposedChart, Line, Legend
} from "recharts";
import { 
  Activity, TrendingUp, BarChart3, Target, AlertTriangle, 
  Download, Info, Zap
} from "lucide-react";
import {
  calculatePTRS,
  runPTRSMonteCarlo,
  createPTRSHistogram,
  TA_KEY_TO_DISPLAY,
  type PTRSSliders,
  type PTRSMonteCarloResult,
} from "@/lib/ptrsEngine";
import {
  runSensitivityAnalysis,
  runScenarioAnalysis,
  type ComponentUncertainty,
  type SensitivityResult,
  type ScenarioResult,
} from "@/lib/monteCarloSimulation";

interface PTRSMonteCarloIntegrationProps {
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
  const [mechanismNovelty, setMechanismNovelty] = useState(initialMechanismNovelty);
  const [endpointClarity, setEndpointClarity] = useState(initialEndpointClarity);
  const [priorTrialData, setPriorTrialData] = useState(initialPriorTrialData);
  const [sponsorExperience, setSponsorExperience] = useState(initialSponsorExperience);
  const [regulatoryPrecedent, setRegulatoryPrecedent] = useState(initialRegulatoryPrecedent);
  const [safetyProfile, setSafetyProfile] = useState(initialSafetyProfile);
  
  const [iterations, setIterations] = useState(10000);
  const [uncertaintyRange, setUncertaintyRange] = useState(15);
  const [activeView, setActiveView] = useState<"distribution" | "sensitivity" | "scenarios">("distribution");

  const sliders: PTRSSliders = {
    mechanismNovelty, endpointClarity, priorTrialData,
    sponsorExperience, regulatoryPrecedent, safetyProfile,
  };

  // Base PTRS from corrected engine
  const basePTRS = useMemo(() => 
    calculatePTRS(therapeuticArea, currentPhase, sliders),
    [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile, therapeuticArea, currentPhase]
  );

  // Monte Carlo with input-propagated uncertainty
  const mcResult = useMemo<PTRSMonteCarloResult>(() => 
    runPTRSMonteCarlo(therapeuticArea, currentPhase, sliders, {
      iterations,
      uncertaintyPct: uncertaintyRange / 100,
    }),
    [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile, iterations, uncertaintyRange, therapeuticArea, currentPhase]
  );

  // Histogram bins
  const histogram = useMemo(() => 
    createPTRSHistogram(mcResult.distribution, 20),
    [mcResult]
  );

  // Sensitivity analysis (reuse existing engine with component scores)
  const getComponentScores = (): ComponentUncertainty[] => [
    { name: 'Mechanism Novelty', baseScore: mechanismNovelty, minScore: 0, maxScore: 100, weight: 0.15 },
    { name: 'Endpoint Clarity', baseScore: endpointClarity, minScore: 0, maxScore: 100, weight: 0.20 },
    { name: 'Prior Trial Data', baseScore: priorTrialData, minScore: 0, maxScore: 100, weight: 0.20 },
    { name: 'Sponsor Experience', baseScore: sponsorExperience, minScore: 0, maxScore: 100, weight: 0.15 },
    { name: 'Regulatory Precedent', baseScore: regulatoryPrecedent, minScore: 0, maxScore: 100, weight: 0.15 },
    { name: 'Safety Profile', baseScore: safetyProfile, minScore: 0, maxScore: 100, weight: 0.15 },
  ];

  const sensitivityResults = useMemo<SensitivityResult[]>(() => 
    runSensitivityAnalysis(getComponentScores(), 10),
    [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile]
  );

  const ptrsScenarios = [
    { name: 'Optimistic Trial', adjustments: { 'Mechanism Novelty': 0.15, 'Endpoint Clarity': 0.20, 'Prior Trial Data': 0.25, 'Safety Profile': 0.10 } },
    { name: 'Pessimistic Trial', adjustments: { 'Mechanism Novelty': -0.10, 'Endpoint Clarity': -0.15, 'Prior Trial Data': -0.20, 'Safety Profile': -0.15 } },
    { name: 'Regulatory Challenge', adjustments: { 'Regulatory Precedent': -0.25, 'Safety Profile': -0.10, 'Sponsor Experience': -0.05 } },
    { name: 'Strong Safety Data', adjustments: { 'Safety Profile': 0.30, 'Regulatory Precedent': 0.15, 'Endpoint Clarity': 0.10 } },
  ];

  const scenarioResults = useMemo<ScenarioResult[]>(() => 
    runScenarioAnalysis(getComponentScores(), ptrsScenarios),
    [mechanismNovelty, endpointClarity, priorTrialData, sponsorExperience, regulatoryPrecedent, safetyProfile]
  );

  const handleExportPDF = async () => {
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF('ptrs-monte-carlo-content', 'PTRS_MonteCarlo_Analysis.pdf');
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
            Input-propagated uncertainty across {iterations.toLocaleString()} simulations · TA: {TA_KEY_TO_DISPLAY[therapeuticArea] || therapeuticArea}
          </p>
        </div>
        <Button variant="export" size="sm" onClick={handleExportPDF}>
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
                <SelectTrigger><SelectValue /></SelectTrigger>
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
              <Slider value={[uncertaintyRange]} onValueChange={(v) => setUncertaintyRange(v[0])} min={5} max={30} step={1} />
            </div>
            <div className="flex items-end">
              <Badge variant="outline" className="h-9 px-4 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Base PTRS: {basePTRS.ptrs_pct}%
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="bg-primary/5">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-primary">{mcResult.mean}%</p>
            <p className="text-xs text-muted-foreground">Mean PTRS</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{mcResult.median}%</p>
            <p className="text-xs text-muted-foreground">Median</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/50">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">±{mcResult.stdDev}%</p>
            <p className="text-xs text-muted-foreground">Std Dev</p>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{mcResult.pGte10}%</p>
            <p className="text-xs text-muted-foreground">P(PTRS ≥10%)</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{mcResult.pGte20}%</p>
            <p className="text-xs text-muted-foreground">P(PTRS ≥20%)</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/10 border-purple-500/20">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{mcResult.pGte40}%</p>
            <p className="text-xs text-muted-foreground">P(PTRS ≥40%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100 dark:bg-sky-950/30">
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />Distribution
          </TabsTrigger>
          <TabsTrigger value="sensitivity" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />Sensitivity
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Target className="h-4 w-4" />Scenarios
          </TabsTrigger>
        </TabsList>

        {/* Distribution View */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">PTRS Probability Distribution</CardTitle>
              <CardDescription>
                Monte Carlo simulation with ±{uncertaintyRange}% input uncertainty propagated through base rates and sliders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={histogram}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="midpoint" tickFormatter={(v) => `${v.toFixed(0)}%`} fontSize={11} />
                    <YAxis yAxisId="count" orientation="left" tickFormatter={(v) => v.toLocaleString()} fontSize={11} />
                    <YAxis yAxisId="pct" orientation="right" tickFormatter={(v) => `${v}%`} fontSize={11} />
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
                    <Bar yAxisId="count" dataKey="count" fill="hsl(var(--primary))" opacity={0.7} radius={[2, 2, 0, 0]} />
                    <Line yAxisId="pct" type="monotone" dataKey="percentage" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    <ReferenceLine yAxisId="count" x={mcResult.mean} stroke="hsl(var(--primary))" strokeDasharray="5 5" strokeWidth={2} />
                    <ReferenceLine yAxisId="count" x={mcResult.p5} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <ReferenceLine yAxisId="count" x={mcResult.p95} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Percentile Summary */}
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Percentile Summary</h4>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <Badge variant="outline">P5: {mcResult.p5}%</Badge>
                  <Badge variant="outline">P10: {mcResult.p10}%</Badge>
                  <Badge variant="outline">P25: {mcResult.p25}%</Badge>
                  <Badge variant="secondary">P50: {mcResult.median}%</Badge>
                  <Badge variant="outline">P75: {mcResult.p75}%</Badge>
                  <Badge variant="outline">P90: {mcResult.p90}%</Badge>
                  <Badge variant="outline">P95: {mcResult.p95}%</Badge>
                  <span className="ml-2 text-muted-foreground">
                    Range: {mcResult.min}% – {mcResult.max}%
                  </span>
                </div>
              </div>
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
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Key Drivers (by sensitivity)</h4>
                <div className="space-y-2">
                  {sensitivityResults.slice(0, 3).map((result, idx) => (
                    <div key={result.componentName} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">{idx + 1}</Badge>
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
                    <Bar dataKey="blockbusterProbability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
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
                <strong>95% Confidence Interval:</strong> PTRS between {mcResult.p5}% and {mcResult.p95}%
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>
                <strong>Volatility:</strong> Standard deviation of ±{mcResult.stdDev}% indicates 
                {mcResult.stdDev > 5 ? ' high' : mcResult.stdDev > 2.5 ? ' moderate' : ' low'} outcome uncertainty
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <span>
                <strong>Key Driver:</strong> {sensitivityResults[0]?.componentName} has the highest impact on outcomes
              </span>
            </li>
            {mcResult.pGte20 < 20 && (
              <li className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <span>
                  <strong>Warning:</strong> Only {mcResult.pGte20}% probability of achieving ≥20% PTRS
                </span>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
