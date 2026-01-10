import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  LineChart,
  Line,
  Legend,
  Cell
} from "recharts";
import { 
  Play, 
  Settings, 
  TrendingUp, 
  BarChart3, 
  Activity,
  Target,
  RefreshCw,
  Download
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
import { type ComponentScore } from "@/lib/peakSalesIndex";

interface MonteCarloSimulationProps {
  componentScores: ComponentScore[];
  moleculeName?: string;
}

const MonteCarloSimulation = ({ componentScores, moleculeName }: MonteCarloSimulationProps) => {
  const [iterations, setIterations] = useState(10000);
  const [uncertaintyRange, setUncertaintyRange] = useState([15]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [sensitivityResult, setSensitivityResult] = useState<SensitivityResult[] | null>(null);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult[] | null>(null);

  // Convert component scores to uncertainty format
  const componentUncertainties: ComponentUncertainty[] = useMemo(() => {
    return componentScores.map(c => ({
      name: c.name,
      baseScore: c.score,
      minScore: Math.max(0, c.score * (1 - uncertaintyRange[0] / 100)),
      maxScore: Math.min(100, c.score * (1 + uncertaintyRange[0] / 100)),
      weight: c.weight,
    }));
  }, [componentScores, uncertaintyRange]);

  const runSimulation = useCallback(() => {
    setIsRunning(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const result = runMonteCarloSimulation(componentUncertainties, {
        iterations,
        uncertaintyRange: uncertaintyRange[0],
        confidenceInterval: 95,
      });
      
      const sensitivity = runSensitivityAnalysis(componentUncertainties);
      const scenarios = runScenarioAnalysis(componentUncertainties, DEFAULT_SCENARIOS);
      
      setSimulationResult(result);
      setSensitivityResult(sensitivity);
      setScenarioResult(scenarios);
      setIsRunning(false);
    }, 100);
  }, [componentUncertainties, iterations, uncertaintyRange]);

  // Prepare chart data
  const histogramData = useMemo(() => {
    if (!simulationResult) return [];
    return simulationResult.histogram.map((bin, i) => ({
      ...bin,
      fill: i < simulationResult.histogram.length * 0.1 || i >= simulationResult.histogram.length * 0.9 
        ? "hsl(var(--muted-foreground))" 
        : "hsl(var(--primary))",
    }));
  }, [simulationResult]);

  const percentileData = useMemo(() => {
    if (!simulationResult) return [];
    const { percentiles } = simulationResult;
    return [
      { percentile: "P5", value: percentiles.p5, label: "5th" },
      { percentile: "P10", value: percentiles.p10, label: "10th" },
      { percentile: "P25", value: percentiles.p25, label: "25th" },
      { percentile: "P50", value: percentiles.p50, label: "Median" },
      { percentile: "P75", value: percentiles.p75, label: "75th" },
      { percentile: "P90", value: percentiles.p90, label: "90th" },
      { percentile: "P95", value: percentiles.p95, label: "95th" },
    ];
  }, [simulationResult]);

  const tornadoData = useMemo(() => {
    if (!sensitivityResult) return [];
    return sensitivityResult.slice(0, 7).map(s => ({
      name: s.componentName.split(' ').slice(0, 2).join(' '),
      fullName: s.componentName,
      upside: s.upImpact,
      downside: s.downImpact,
    }));
  }, [sensitivityResult]);

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Simulation Configuration
            {moleculeName && (
              <Badge variant="secondary" className="ml-2">{moleculeName}</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Configure Monte Carlo parameters to generate probability distributions for peak sales estimates
          </CardDescription>
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
              <p className="text-xs text-muted-foreground">More iterations = higher accuracy</p>
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
              <p className="text-xs text-muted-foreground">
                {uncertaintyRange[0] <= 10 ? "Low uncertainty" : 
                 uncertaintyRange[0] <= 20 ? "Moderate uncertainty" : 
                 "High uncertainty"}
              </p>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={runSimulation} 
                disabled={isRunning}
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
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Component Uncertainty Preview */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-3">Component Score Ranges</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {componentUncertainties.map((comp) => (
                <div key={comp.name} className="text-center p-2 bg-background rounded border">
                  <p className="text-xs text-muted-foreground truncate" title={comp.name}>
                    {comp.name.split(' ')[0]}
                  </p>
                  <p className="text-sm font-semibold">{comp.baseScore.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">
                    {comp.minScore.toFixed(0)} - {comp.maxScore.toFixed(0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {simulationResult && (
        <>
          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Mean</p>
                <p className="text-xl font-bold text-primary">${simulationResult.statistics.mean}B</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Median (P50)</p>
                <p className="text-xl font-bold">${simulationResult.statistics.median}B</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Std Dev</p>
                <p className="text-xl font-bold text-orange-600">±${simulationResult.statistics.stdDev}B</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Min</p>
                <p className="text-xl font-bold text-red-600">${simulationResult.statistics.min}B</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">Max</p>
                <p className="text-xl font-bold text-green-600">${simulationResult.statistics.max}B</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">P10 - P90</p>
                <p className="text-lg font-bold">
                  ${simulationResult.percentiles.p10}B - ${simulationResult.percentiles.p90}B
                </p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-4 text-center">
                <p className="text-xs text-amber-700">Confidence (90%)</p>
                <p className="text-lg font-bold text-amber-800">
                  ${simulationResult.percentiles.p5}B - ${simulationResult.percentiles.p95}B
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution Histogram */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Peak Sales Distribution
                </CardTitle>
                <CardDescription>
                  {iterations.toLocaleString()} simulated outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={histogramData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="range" 
                        tick={{ fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold">{data.range}</p>
                                <p className="text-sm">Probability: {data.percentage}%</p>
                                <p className="text-sm text-muted-foreground">{data.count.toLocaleString()} iterations</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="percentage" name="Probability %">
                        {histogramData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Percentile Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Percentile Analysis
                </CardTitle>
                <CardDescription>
                  Cumulative distribution percentiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={percentileData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis 
                        tickFormatter={(v) => `$${v}B`}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold">{data.label} Percentile</p>
                                <p className="text-sm text-primary">${data.value}B Peak Sales</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary) / 0.2)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tornado Chart - Sensitivity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Sensitivity Analysis (Tornado)
                </CardTitle>
                <CardDescription>
                  Impact of ±10% change in each component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={tornadoData} 
                      layout="vertical"
                      stackOffset="sign"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                        domain={[-15, 15]}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={80}
                        tick={{ fontSize: 10 }}
                      />
                      <ChartTooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold">{data.fullName}</p>
                                <p className="text-sm text-green-600">+10% → {data.upside > 0 ? '+' : ''}{data.upside}% peak sales</p>
                                <p className="text-sm text-red-600">-10% → {data.downside}% peak sales</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="upside" fill="hsl(142, 76%, 36%)" name="Upside (+10%)" stackId="a" />
                      <Bar dataKey="downside" fill="hsl(0, 84%, 60%)" name="Downside (-10%)" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Scenario Analysis
                </CardTitle>
                <CardDescription>
                  Predefined scenario outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {scenarioResult && (
                  <div className="space-y-3">
                    {scenarioResult.map((scenario, idx) => (
                      <div 
                        key={scenario.name}
                        className={`p-3 rounded-lg border ${
                          idx === 0 ? 'bg-muted/50 border-muted-foreground/30' :
                          scenario.deltaFromBase > 0 ? 'bg-green-50 border-green-200' :
                          scenario.deltaFromBase < 0 ? 'bg-red-50 border-red-200' :
                          'bg-muted/50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{scenario.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Score: {scenario.compositeScore} | BB Prob: {scenario.blockbusterProbability}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">${scenario.peakSales}B</p>
                            {scenario.deltaFromBase !== 0 && (
                              <Badge variant={scenario.deltaFromBase > 0 ? "default" : "destructive"}>
                                {scenario.deltaFromBase > 0 ? '+' : ''}{scenario.deltaFromBase}%
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Distribution Details */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Statistics</CardTitle>
              <CardDescription>
                Advanced statistical measures from the simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Skewness</p>
                  <p className="text-lg font-semibold">{simulationResult.statistics.skewness}</p>
                  <p className="text-xs text-muted-foreground">
                    {simulationResult.statistics.skewness > 0 ? 'Right-skewed' : 
                     simulationResult.statistics.skewness < 0 ? 'Left-skewed' : 'Symmetric'}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Excess Kurtosis</p>
                  <p className="text-lg font-semibold">{simulationResult.statistics.kurtosis}</p>
                  <p className="text-xs text-muted-foreground">
                    {simulationResult.statistics.kurtosis > 0 ? 'Heavy tails' : 
                     simulationResult.statistics.kurtosis < 0 ? 'Light tails' : 'Normal'}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Coefficient of Variation</p>
                  <p className="text-lg font-semibold">
                    {((simulationResult.statistics.stdDev / simulationResult.statistics.mean) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Relative volatility</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Interquartile Range</p>
                  <p className="text-lg font-semibold">
                    ${(simulationResult.percentiles.p75 - simulationResult.percentiles.p25).toFixed(2)}B
                  </p>
                  <p className="text-xs text-muted-foreground">P75 - P25</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                  <p className="text-xs text-green-700">P(≥$1B)</p>
                  <p className="text-lg font-semibold text-green-700">
                    {((simulationResult.peakSalesDistribution.filter(v => v >= 1).length / 
                       simulationResult.peakSalesDistribution.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-green-600">Blockbuster likelihood</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg text-center border border-amber-200">
                  <p className="text-xs text-amber-700">P(≥$2B)</p>
                  <p className="text-lg font-semibold text-amber-700">
                    {((simulationResult.peakSalesDistribution.filter(v => v >= 2).length / 
                       simulationResult.peakSalesDistribution.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-amber-600">Mega-blockbuster</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!simulationResult && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Configure and Run Simulation</p>
            <p className="text-sm text-muted-foreground mt-2">
              Adjust the parameters above and click "Run Simulation" to generate probability distributions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonteCarloSimulation;
