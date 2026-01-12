import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles,
  FileDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import html2pdf from 'html2pdf.js';

interface MoleculeProfile {
  name: string;
  company: string;
  therapeuticArea: string;
  phase: string;
  ptrs?: number;
  [key: string]: any;
}

interface PTRSForecastingToolProps {
  molecules: MoleculeProfile[];
}

interface Milestone {
  id: string;
  name: string;
  expectedDate: string;
  impact: number;
  probability: number;
  type: 'clinical' | 'regulatory' | 'commercial';
  completed: boolean;
}

interface ForecastPoint {
  month: string;
  ptrs: number;
  lowerBound: number;
  upperBound: number;
  milestone?: string;
  milestoneImpact?: number;
}

interface MoleculeForecast {
  name: string;
  currentPtrs: number;
  forecastedPtrs: number;
  confidence: number;
  milestones: Milestone[];
  forecast: ForecastPoint[];
  riskFactors: string[];
  upside: number;
  downside: number;
}

const PTRSForecastingTool: React.FC<PTRSForecastingToolProps> = ({ molecules }) => {
  const [selectedMolecule, setSelectedMolecule] = useState<string>(molecules[0]?.name || '');
  const [forecastHorizon, setForecastHorizon] = useState(12);
  const [includeUpcoming, setIncludeUpcoming] = useState(true);
  const [confidenceInterval, setConfidenceInterval] = useState(80);

  // Generate milestone templates based on phase
  const generateMilestones = (phase: string): Milestone[] => {
    const now = new Date();
    const milestones: Milestone[] = [];
    
    const phaseNum = phase.includes('III') ? 3 : phase.includes('II') ? 2 : phase.includes('I') ? 1 : 0;
    
    if (phaseNum <= 1) {
      milestones.push({
        id: 'p1-topline',
        name: 'Phase I Topline Results',
        expectedDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 8,
        probability: 75,
        type: 'clinical',
        completed: false
      });
    }
    
    if (phaseNum <= 2) {
      milestones.push({
        id: 'p2-initiation',
        name: 'Phase II Initiation',
        expectedDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 5,
        probability: 85,
        type: 'clinical',
        completed: false
      },
      {
        id: 'p2-interim',
        name: 'Phase II Interim Analysis',
        expectedDate: new Date(now.getTime() + 240 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 12,
        probability: 60,
        type: 'clinical',
        completed: false
      });
    }
    
    if (phaseNum <= 3) {
      milestones.push({
        id: 'p3-initiation',
        name: 'Phase III Initiation',
        expectedDate: new Date(now.getTime() + 300 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 6,
        probability: 70,
        type: 'clinical',
        completed: false
      },
      {
        id: 'p3-topline',
        name: 'Phase III Topline Results',
        expectedDate: new Date(now.getTime() + 450 * 24 * 60 * 60 * 1000).toISOString(),
        impact: 18,
        probability: 50,
        type: 'clinical',
        completed: false
      });
    }
    
    milestones.push({
      id: 'regulatory-meeting',
      name: 'Regulatory Pre-Submission Meeting',
      expectedDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 4,
      probability: 90,
      type: 'regulatory',
      completed: false
    },
    {
      id: 'partnership',
      name: 'Partnership/Licensing Deal',
      expectedDate: new Date(now.getTime() + 200 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 7,
      probability: 40,
      type: 'commercial',
      completed: false
    });

    return milestones.sort((a, b) => new Date(a.expectedDate).getTime() - new Date(b.expectedDate).getTime());
  };

  // Generate forecast for selected molecule
  const moleculeForecast = useMemo((): MoleculeForecast | null => {
    const mol = molecules.find(m => m.name === selectedMolecule);
    if (!mol) return null;

    const basePtrs = mol.ptrs || 18 + Math.random() * 15;
    const milestones = generateMilestones(mol.phase);
    
    // Generate forecast points
    const forecast: ForecastPoint[] = [];
    const now = new Date();
    let currentPtrs = basePtrs;
    
    for (let i = 0; i <= forecastHorizon; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthStr = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Check for milestones in this month
      const monthMilestones = milestones.filter(m => {
        const mDate = new Date(m.expectedDate);
        return mDate.getMonth() === monthDate.getMonth() && mDate.getFullYear() === monthDate.getFullYear();
      });
      
      // Apply milestone impacts (probability-weighted)
      if (includeUpcoming) {
        monthMilestones.forEach(m => {
          currentPtrs += (m.impact * m.probability / 100);
        });
      }
      
      // Add some natural volatility
      const volatility = (Math.random() - 0.5) * 2;
      const ptrsValue = Math.min(100, Math.max(5, currentPtrs + volatility));
      
      // Calculate confidence bounds
      const confidenceMultiplier = (100 - confidenceInterval) / 100;
      const spread = (5 + i * 0.8) * (1 - confidenceMultiplier);
      
      forecast.push({
        month: monthStr,
        ptrs: ptrsValue,
        lowerBound: Math.max(0, ptrsValue - spread),
        upperBound: Math.min(100, ptrsValue + spread),
        milestone: monthMilestones[0]?.name,
        milestoneImpact: monthMilestones.reduce((sum, m) => sum + m.impact, 0)
      });
    }

    // Calculate overall metrics
    const finalPtrs = forecast[forecast.length - 1]?.ptrs || basePtrs;
    const upside = forecast[forecast.length - 1]?.upperBound - finalPtrs;
    const downside = finalPtrs - forecast[forecast.length - 1]?.lowerBound;

    return {
      name: mol.name,
      currentPtrs: basePtrs,
      forecastedPtrs: finalPtrs,
      confidence: confidenceInterval,
      milestones,
      forecast,
      riskFactors: [
        'Clinical trial execution risk',
        'Competitive landscape changes',
        'Regulatory pathway uncertainty',
        'Manufacturing scalability'
      ],
      upside,
      downside
    };
  }, [selectedMolecule, molecules, forecastHorizon, includeUpcoming, confidenceInterval]);

  // Multi-molecule comparison data
  const comparisonData = useMemo(() => {
    return molecules.slice(0, 6).map(mol => {
      const basePtrs = mol.ptrs || 15 + Math.random() * 20;
      const growth = (Math.random() - 0.3) * 15;
      return {
        name: mol.name.length > 15 ? mol.name.substring(0, 15) + '...' : mol.name,
        currentPtrs: basePtrs,
        forecastPtrs: Math.min(100, Math.max(5, basePtrs + growth)),
        change: growth,
        phase: mol.phase
      };
    });
  }, [molecules]);

  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'clinical': return <Zap className="h-4 w-4" />;
      case 'regulatory': return <CheckCircle className="h-4 w-4" />;
      case 'commercial': return <Target className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getMilestoneColor = (type: string) => {
    switch (type) {
      case 'clinical': return 'text-blue-600 bg-blue-500/10';
      case 'regulatory': return 'text-green-600 bg-green-500/10';
      case 'commercial': return 'text-purple-600 bg-purple-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const exportToPDF = () => {
    const element = document.getElementById('forecasting-content');
    if (element) {
      html2pdf().set({
        margin: 10,
        filename: `ptrs-forecast-${selectedMolecule}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      }).from(element).save();
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">PTRS Forecasting Tool</CardTitle>
              <CardDescription>
                Predict future score trajectories based on clinical milestones and historical patterns
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <FileDown className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent id="forecasting-content" className="space-y-6">
        {/* Controls */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Select Molecule</label>
                <Select value={selectedMolecule} onValueChange={setSelectedMolecule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select molecule" />
                  </SelectTrigger>
                  <SelectContent>
                    {molecules.map(mol => (
                      <SelectItem key={mol.name} value={mol.name}>
                        {mol.name} ({mol.phase})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-[180px]">
                <label className="text-sm font-medium mb-2 block">
                  Forecast Horizon: {forecastHorizon} months
                </label>
                <Slider
                  value={[forecastHorizon]}
                  onValueChange={(v) => setForecastHorizon(v[0])}
                  min={3}
                  max={24}
                  step={3}
                  className="w-full"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="text-sm font-medium mb-2 block">
                  Confidence: {confidenceInterval}%
                </label>
                <Slider
                  value={[confidenceInterval]}
                  onValueChange={(v) => setConfidenceInterval(v[0])}
                  min={50}
                  max={95}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={includeUpcoming} onCheckedChange={setIncludeUpcoming} />
                <label className="text-sm">Include milestone impacts</label>
              </div>
            </div>
          </CardContent>
        </Card>

        {moleculeForecast && (
          <>
            {/* Forecast Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Current PTRS</p>
                  <p className="text-2xl font-bold text-primary">{moleculeForecast.currentPtrs.toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-500/10 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Forecasted PTRS</p>
                  <p className="text-2xl font-bold text-purple-600">{moleculeForecast.forecastedPtrs.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Upside Potential</p>
                  <p className="text-2xl font-bold text-green-600">+{moleculeForecast.upside.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Downside Risk</p>
                  <p className="text-2xl font-bold text-destructive">-{moleculeForecast.downside.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Milestones</p>
                  <p className="text-2xl font-bold">{moleculeForecast.milestones.length}</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="forecast">
              <TabsList>
                <TabsTrigger value="forecast">Forecast Chart</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
                <TabsTrigger value="comparison">Portfolio Comparison</TabsTrigger>
                <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="forecast">
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={moleculeForecast.forecast}>
                        <defs>
                          <linearGradient id="ptrsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{label}</p>
                                  <p className="text-primary">PTRS: {data.ptrs.toFixed(1)}%</p>
                                  <p className="text-xs text-muted-foreground">
                                    Range: {data.lowerBound.toFixed(1)}% - {data.upperBound.toFixed(1)}%
                                  </p>
                                  {data.milestone && (
                                    <p className="text-xs text-purple-600 mt-1">
                                      📌 {data.milestone} (+{data.milestoneImpact}%)
                                    </p>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="upperBound"
                          stroke="none"
                          fill="url(#confidenceGradient)"
                          name={`${confidenceInterval}% CI Upper`}
                        />
                        <Area
                          type="monotone"
                          dataKey="lowerBound"
                          stroke="none"
                          fill="transparent"
                          name={`${confidenceInterval}% CI Lower`}
                        />
                        <Line
                          type="monotone"
                          dataKey="ptrs"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={false}
                          name="PTRS Forecast"
                        />
                        <ReferenceLine 
                          y={moleculeForecast.currentPtrs} 
                          stroke="hsl(var(--muted-foreground))" 
                          strokeDasharray="5 5"
                          label={{ value: 'Current', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones">
                <div className="space-y-3">
                  {moleculeForecast.milestones.map((milestone, idx) => (
                    <Card key={milestone.id} className={`${getMilestoneColor(milestone.type)} border`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getMilestoneColor(milestone.type)}`}>
                              {getMilestoneIcon(milestone.type)}
                            </div>
                            <div>
                              <p className="font-medium">{milestone.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {new Date(milestone.expectedDate).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="mb-1">
                              {milestone.type}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600">
                                +{milestone.impact}% impact
                              </span>
                              <span className="text-muted-foreground">
                                {milestone.probability}% probability
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardContent className="p-4">
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={comparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip 
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))' 
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="currentPtrs"
                          fill="hsl(var(--muted))"
                          stroke="hsl(var(--muted-foreground))"
                          name="Current PTRS"
                        />
                        <Area
                          type="monotone"
                          dataKey="forecastPtrs"
                          fill="hsl(270, 70%, 60%)"
                          fillOpacity={0.3}
                          stroke="hsl(270, 70%, 60%)"
                          name="Forecasted PTRS"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risks">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Key Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {moleculeForecast.riskFactors.map((risk, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        Forecast Assumptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Probability-weighted milestone impacts
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Historical phase transition rates applied
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {confidenceInterval}% confidence interval
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {forecastHorizon}-month projection horizon
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PTRSForecastingTool;
