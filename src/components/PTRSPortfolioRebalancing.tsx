import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';
import { RefreshCw, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight, ArrowUp, ArrowDown, Minus, FileText, Scale, Target, Activity, Clock, Zap, BarChart3, PieChart } from 'lucide-react';
import type { MoleculeProfile } from '@/lib/moleculesData';

interface PTRSPortfolioRebalancingProps {
  molecules: MoleculeProfile[];
}

interface PortfolioHolding {
  molecule: MoleculeProfile;
  currentWeight: number;
  targetWeight: number;
  previousPTRS: number;
  currentPTRS: number;
  ptrsChange: number;
  marketConditionChange: number;
  action: 'increase' | 'decrease' | 'hold' | 'exit' | 'enter';
  urgency: 'high' | 'medium' | 'low';
  reason: string;
}

interface MarketCondition {
  name: string;
  previousValue: number;
  currentValue: number;
  change: number;
  impact: 'positive' | 'negative' | 'neutral';
}

interface RebalanceScenario {
  id: string;
  name: string;
  description: string;
  ptrsShift: number;
  marketShift: number;
  volatilityMultiplier: number;
}

const REBALANCE_SCENARIOS: RebalanceScenario[] = [
  { id: 'stable', name: 'Stable Market', description: 'Normal conditions with minor fluctuations', ptrsShift: 0, marketShift: 0, volatilityMultiplier: 1 },
  { id: 'bull', name: 'Bull Market', description: 'Strong investor sentiment, increased valuations', ptrsShift: 5, marketShift: 15, volatilityMultiplier: 0.8 },
  { id: 'bear', name: 'Bear Market', description: 'Risk-off sentiment, decreased valuations', ptrsShift: -5, marketShift: -20, volatilityMultiplier: 1.5 },
  { id: 'regulatory', name: 'Regulatory Shift', description: 'New FDA guidance impacting approvals', ptrsShift: -10, marketShift: -5, volatilityMultiplier: 1.3 },
  { id: 'breakthrough', name: 'Breakthrough Era', description: 'Multiple positive clinical readouts', ptrsShift: 12, marketShift: 25, volatilityMultiplier: 0.7 },
  { id: 'safety_crisis', name: 'Industry Safety Crisis', description: 'Major safety event affecting sector', ptrsShift: -15, marketShift: -30, volatilityMultiplier: 2.0 },
];

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export const PTRSPortfolioRebalancing: React.FC<PTRSPortfolioRebalancingProps> = ({ molecules }) => {
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>([]);
  const [currentWeights, setCurrentWeights] = useState<Record<string, number>>({});
  const [scenario, setScenario] = useState<string>('stable');
  const [rebalanceThreshold, setRebalanceThreshold] = useState<number>(5);
  const [autoAdjust, setAutoAdjust] = useState<boolean>(true);
  const [riskTolerance, setRiskTolerance] = useState<number>(50);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<PortfolioHolding[] | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredMolecules = useMemo(() => {
    return molecules.filter(m => 
      m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.therapeuticArea.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [molecules, searchFilter]);

  const toggleMolecule = (id: string) => {
    setSelectedMolecules(prev => {
      if (prev.includes(id)) {
        const newWeights = { ...currentWeights };
        delete newWeights[id];
        setCurrentWeights(newWeights);
        return prev.filter(m => m !== id);
      }
      const newMols = [...prev, id].slice(0, 20);
      // Auto-assign equal weight for new molecule
      const equalWeight = 100 / (newMols.length);
      const newWeights: Record<string, number> = {};
      newMols.forEach(molId => {
        newWeights[molId] = equalWeight;
      });
      setCurrentWeights(newWeights);
      return newMols;
    });
  };

  const updateWeight = (id: string, weight: number) => {
    setCurrentWeights(prev => {
      const newWeights = { ...prev, [id]: weight };
      // Normalize if total > 100
      const total = Object.values(newWeights).reduce((sum, w) => sum + w, 0);
      if (total > 100) {
        const ratio = 100 / total;
        Object.keys(newWeights).forEach(key => {
          newWeights[key] = Math.round(newWeights[key] * ratio * 10) / 10;
        });
      }
      return newWeights;
    });
  };

  const calculateBasePTRS = (molecule: MoleculeProfile): number => {
    return (molecule.scores?.approval || 0.15) * 100;
  };

  const calculateMarketScore = (molecule: MoleculeProfile): number => {
    const marketPotential = molecule.marketData?.[0]?.revenueProjection?.year2 || 500000000;
    return Math.min(100, (marketPotential / 2000000000) * 100);
  };

  const calculateRisk = (molecule: MoleculeProfile): number => {
    const phaseRisk: Record<string, number> = {
      'Preclinical': 85,
      'Phase I': 70,
      'Phase II': 55,
      'Phase III': 35,
      'NDA/BLA': 15,
      'Approved': 5,
    };
    const baseRisk = Object.entries(phaseRisk).find(([key]) => 
      molecule.phase.toLowerCase().includes(key.toLowerCase())
    )?.[1] || 50;
    const dropoutPenalty = (molecule.scores?.dropoutRanking || 3) * 5;
    return Math.min(95, baseRisk + dropoutPenalty);
  };

  const runRebalanceAnalysis = () => {
    if (selectedMolecules.length < 2) return;
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const selectedScenario = REBALANCE_SCENARIOS.find(s => s.id === scenario) || REBALANCE_SCENARIOS[0];
      const selectedMols = selectedMolecules.map(id => molecules.find(m => m.id === id)!).filter(Boolean);
      
      const holdings: PortfolioHolding[] = selectedMols.map(mol => {
        const basePTRS = calculateBasePTRS(mol);
        const baseMarket = calculateMarketScore(mol);
        const baseRisk = calculateRisk(mol);
        
        // Apply scenario effects with some randomness
        const randomFactor = 0.8 + Math.random() * 0.4;
        const ptrsChange = selectedScenario.ptrsShift * randomFactor * (selectedScenario.volatilityMultiplier);
        const marketChange = selectedScenario.marketShift * randomFactor;
        
        // Risk adjustment based on phase
        const riskAdjustedPtrsChange = ptrsChange * (1 - baseRisk / 200);
        
        const previousPTRS = basePTRS;
        const currentPTRS = Math.max(5, Math.min(95, basePTRS + riskAdjustedPtrsChange));
        const ptrsChangePercent = ((currentPTRS - previousPTRS) / previousPTRS) * 100;
        
        const currentWeight = currentWeights[mol.id] || (100 / selectedMols.length);
        
        // Calculate optimal weight based on new conditions
        const returnScore = currentPTRS;
        const adjustedRisk = baseRisk * selectedScenario.volatilityMultiplier;
        const riskAdjustedReturn = returnScore * (1 - adjustedRisk / 200);
        
        // Factor in risk tolerance
        const riskWeight = riskTolerance / 100;
        const optimizationScore = (riskAdjustedReturn * riskWeight) + (returnScore * (1 - riskWeight));
        
        return {
          molecule: mol,
          currentWeight,
          targetWeight: 0, // Will be calculated after all scores
          previousPTRS,
          currentPTRS,
          ptrsChange: Math.round(ptrsChangePercent * 10) / 10,
          marketConditionChange: Math.round(marketChange * 10) / 10,
          risk: adjustedRisk,
          optimizationScore,
          action: 'hold' as const,
          urgency: 'low' as const,
          reason: '',
        };
      });
      
      // Calculate target weights based on optimization scores
      const totalScore = holdings.reduce((sum, h) => sum + (h as any).optimizationScore, 0);
      
      holdings.forEach(h => {
        const rawWeight = ((h as any).optimizationScore / totalScore) * 100;
        h.targetWeight = Math.round(Math.min(40, Math.max(2, rawWeight)) * 10) / 10;
      });
      
      // Normalize target weights
      const totalTarget = holdings.reduce((sum, h) => sum + h.targetWeight, 0);
      holdings.forEach(h => {
        h.targetWeight = Math.round((h.targetWeight / totalTarget) * 100 * 10) / 10;
      });
      
      // Determine actions
      holdings.forEach(h => {
        const weightDiff = h.targetWeight - h.currentWeight;
        const absDiff = Math.abs(weightDiff);
        
        if (absDiff < rebalanceThreshold) {
          h.action = 'hold';
          h.urgency = 'low';
          h.reason = 'Weight within tolerance band';
        } else if (h.targetWeight < 3) {
          h.action = 'exit';
          h.urgency = 'high';
          h.reason = `PTRS declined ${Math.abs(h.ptrsChange).toFixed(1)}%, risk-adjusted return below threshold`;
        } else if (weightDiff > 0) {
          h.action = 'increase';
          h.urgency = absDiff > 15 ? 'high' : absDiff > 8 ? 'medium' : 'low';
          h.reason = h.ptrsChange > 0 
            ? `PTRS improved ${h.ptrsChange.toFixed(1)}%, underweight by ${weightDiff.toFixed(1)}%`
            : `Risk-adjusted opportunity, underweight by ${weightDiff.toFixed(1)}%`;
        } else {
          h.action = 'decrease';
          h.urgency = absDiff > 15 ? 'high' : absDiff > 8 ? 'medium' : 'low';
          h.reason = h.ptrsChange < 0 
            ? `PTRS declined ${Math.abs(h.ptrsChange).toFixed(1)}%, overweight by ${Math.abs(weightDiff).toFixed(1)}%`
            : `Portfolio concentration risk, overweight by ${Math.abs(weightDiff).toFixed(1)}%`;
        }
      });
      
      // Sort by urgency
      holdings.sort((a, b) => {
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      });
      
      setAnalysisResults(holdings);
      setIsAnalyzing(false);
    }, 1500);
  };

  const applyRebalance = () => {
    if (!analysisResults) return;
    const newWeights: Record<string, number> = {};
    analysisResults.forEach(h => {
      if (h.action !== 'exit') {
        newWeights[h.molecule.id] = h.targetWeight;
      }
    });
    // Remove exited molecules
    setSelectedMolecules(prev => prev.filter(id => newWeights[id] !== undefined));
    setCurrentWeights(newWeights);
    setAnalysisResults(null);
  };

  const portfolioMetrics = useMemo(() => {
    if (!analysisResults) return null;
    
    const currentPortfolio = analysisResults.reduce((acc, h) => ({
      avgPTRS: acc.avgPTRS + (h.previousPTRS * h.currentWeight / 100),
      avgRisk: acc.avgRisk + ((h as any).risk || 50) * h.currentWeight / 100,
      concentration: Math.max(acc.concentration, h.currentWeight),
    }), { avgPTRS: 0, avgRisk: 0, concentration: 0 });
    
    const targetPortfolio = analysisResults.reduce((acc, h) => ({
      avgPTRS: acc.avgPTRS + (h.currentPTRS * h.targetWeight / 100),
      avgRisk: acc.avgRisk + ((h as any).risk || 50) * h.targetWeight / 100,
      concentration: Math.max(acc.concentration, h.targetWeight),
    }), { avgPTRS: 0, avgRisk: 0, concentration: 0 });
    
    const actionsRequired = analysisResults.filter(h => h.action !== 'hold').length;
    const highUrgency = analysisResults.filter(h => h.urgency === 'high').length;
    
    return {
      current: currentPortfolio,
      target: targetPortfolio,
      ptrsImprovement: targetPortfolio.avgPTRS - currentPortfolio.avgPTRS,
      riskChange: targetPortfolio.avgRisk - currentPortfolio.avgRisk,
      actionsRequired,
      highUrgency,
    };
  }, [analysisResults]);

  const weightChangeData = useMemo(() => {
    if (!analysisResults) return [];
    return analysisResults.map(h => ({
      name: h.molecule.name.length > 15 ? h.molecule.name.substring(0, 15) + '...' : h.molecule.name,
      fullName: h.molecule.name,
      current: h.currentWeight,
      target: h.targetWeight,
      change: h.targetWeight - h.currentWeight,
    }));
  }, [analysisResults]);

  const ptrsTimelineData = useMemo(() => {
    if (!analysisResults) return [];
    return [
      { period: 'Previous', ...Object.fromEntries(analysisResults.slice(0, 5).map(h => [h.molecule.name, h.previousPTRS])) },
      { period: 'Current', ...Object.fromEntries(analysisResults.slice(0, 5).map(h => [h.molecule.name, h.currentPTRS])) },
    ];
  }, [analysisResults]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'increase': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'decrease': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'exit': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'hold': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500 text-white">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return null;
    }
  };

  const exportToPDF = async () => {
    if (!analysisResults || !portfolioMetrics) return;
    
    const content = `
      <html>
        <head>
          <title>Portfolio Rebalancing Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
            h1 { color: #1a1a2e; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
            h2 { color: #3b82f6; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #e5e5e5; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; font-weight: 600; }
            .metric-box { display: inline-block; padding: 15px; margin: 10px; border: 1px solid #e5e5e5; border-radius: 8px; min-width: 150px; }
            .increase { color: #22c55e; }
            .decrease { color: #ef4444; }
            .hold { color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>📊 Portfolio Rebalancing Analysis</h1>
          <p><strong>Scenario:</strong> ${REBALANCE_SCENARIOS.find(s => s.id === scenario)?.name}</p>
          <p><strong>Risk Tolerance:</strong> ${riskTolerance}%</p>
          <p><strong>Rebalance Threshold:</strong> ${rebalanceThreshold}%</p>
          
          <h2>Portfolio Impact Summary</h2>
          <div class="metric-box">
            <strong>PTRS Change</strong><br/>
            <span class="${portfolioMetrics.ptrsImprovement >= 0 ? 'increase' : 'decrease'}">
              ${portfolioMetrics.ptrsImprovement >= 0 ? '+' : ''}${portfolioMetrics.ptrsImprovement.toFixed(1)}%
            </span>
          </div>
          <div class="metric-box">
            <strong>Actions Required</strong><br/>
            ${portfolioMetrics.actionsRequired} trades
          </div>
          <div class="metric-box">
            <strong>High Urgency</strong><br/>
            ${portfolioMetrics.highUrgency} holdings
          </div>
          
          <h2>Rebalancing Recommendations</h2>
          <table>
            <thead>
              <tr>
                <th>Molecule</th>
                <th>TA</th>
                <th>Current Weight</th>
                <th>Target Weight</th>
                <th>PTRS Change</th>
                <th>Action</th>
                <th>Urgency</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${analysisResults.map(h => `
                <tr>
                  <td>${h.molecule.name}</td>
                  <td>${h.molecule.therapeuticArea}</td>
                  <td>${h.currentWeight.toFixed(1)}%</td>
                  <td>${h.targetWeight.toFixed(1)}%</td>
                  <td class="${h.ptrsChange >= 0 ? 'increase' : 'decrease'}">
                    ${h.ptrsChange >= 0 ? '+' : ''}${h.ptrsChange.toFixed(1)}%
                  </td>
                  <td class="${h.action}">${h.action.toUpperCase()}</td>
                  <td>${h.urgency}</td>
                  <td>${h.reason}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
            Generated on ${new Date().toLocaleString()} | BioQuill PTRS Portfolio Rebalancing Tool
          </p>
        </body>
      </html>
    `;
    
    // Create a temporary container for the HTML content
    const tempContainer = document.createElement('div');
    tempContainer.id = 'portfolio-rebalancing-pdf-temp';
    tempContainer.innerHTML = content;
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    try {
      const { exportDomToPDF } = await import('@/lib/pdfGenerator');
      await exportDomToPDF(
        'portfolio-rebalancing-pdf-temp',
        `portfolio-rebalancing-${new Date().toISOString().split('T')[0]}.pdf`,
        { orientation: 'landscape' }
      );
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Portfolio Rebalancing Tool
            </CardTitle>
            <CardDescription>
              Analyze portfolio weight adjustments based on changing PTRS scores and market conditions
            </CardDescription>
          </div>
          {analysisResults && (
            <Button variant="export" size="sm" onClick={exportToPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="configure" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md bg-sky-100 dark:bg-sky-950/30">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!analysisResults}>Analysis</TabsTrigger>
            <TabsTrigger value="recommendations" disabled={!analysisResults}>Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="configure" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Portfolio Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Current Portfolio ({selectedMolecules.length}/20)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="text"
                    placeholder="Search molecules..."
                    className="w-full p-2 mb-3 text-sm border rounded-md bg-background"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {filteredMolecules.slice(0, 50).map(mol => (
                        <div key={mol.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={selectedMolecules.includes(mol.id)}
                              onCheckedChange={() => toggleMolecule(mol.id)}
                            />
                            <div>
                              <p className="text-sm font-medium">{mol.name}</p>
                              <p className="text-xs text-muted-foreground">{mol.therapeuticArea}</p>
                            </div>
                          </div>
                          {selectedMolecules.includes(mol.id) && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {(currentWeights[mol.id] || 0).toFixed(1)}%
                              </span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.5"
                                className="w-16 p-1 text-xs border rounded"
                                value={currentWeights[mol.id]?.toFixed(1) || '0'}
                                onChange={(e) => updateWeight(mol.id, parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Scenario & Parameters */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Market Scenario
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={scenario} onValueChange={setScenario}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scenario" />
                      </SelectTrigger>
                      <SelectContent>
                        {REBALANCE_SCENARIOS.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            <div>
                              <span className="font-medium">{s.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">{s.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {scenario !== 'stable' && (
                      <div className="p-3 rounded-lg bg-muted/50 text-sm">
                        <p className="font-medium">{REBALANCE_SCENARIOS.find(s => s.id === scenario)?.name}</p>
                        <p className="text-muted-foreground mt-1">
                          PTRS Impact: {REBALANCE_SCENARIOS.find(s => s.id === scenario)?.ptrsShift! >= 0 ? '+' : ''}
                          {REBALANCE_SCENARIOS.find(s => s.id === scenario)?.ptrsShift}% | 
                          Market: {REBALANCE_SCENARIOS.find(s => s.id === scenario)?.marketShift! >= 0 ? '+' : ''}
                          {REBALANCE_SCENARIOS.find(s => s.id === scenario)?.marketShift}%
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Rebalancing Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Rebalance Threshold</Label>
                        <span className="text-sm font-medium">{rebalanceThreshold}%</span>
                      </div>
                      <Slider
                        value={[rebalanceThreshold]}
                        onValueChange={(v) => setRebalanceThreshold(v[0])}
                        min={1}
                        max={20}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Only suggest changes when weight differs by more than this threshold
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">Risk Tolerance</Label>
                        <span className="text-sm font-medium">{riskTolerance}%</span>
                      </div>
                      <Slider
                        value={[riskTolerance]}
                        onValueChange={(v) => setRiskTolerance(v[0])}
                        min={10}
                        max={90}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher = more weight on high-PTRS assets; Lower = more defensive
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Label className="text-sm">Auto-normalize weights</Label>
                      <Switch checked={autoAdjust} onCheckedChange={setAutoAdjust} />
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={selectedMolecules.length < 2 || isAnalyzing}
                  onClick={runRebalanceAnalysis}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Portfolio...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run Rebalance Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {portfolioMetrics && (
              <>
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <TrendingUp className="h-4 w-4" />
                        PTRS Change
                      </div>
                      <p className={`text-2xl font-bold mt-1 ${portfolioMetrics.ptrsImprovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {portfolioMetrics.ptrsImprovement >= 0 ? '+' : ''}{portfolioMetrics.ptrsImprovement.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Portfolio-weighted average</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Activity className="h-4 w-4" />
                        Risk Change
                      </div>
                      <p className={`text-2xl font-bold mt-1 ${portfolioMetrics.riskChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {portfolioMetrics.riskChange >= 0 ? '+' : ''}{portfolioMetrics.riskChange.toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">After rebalancing</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <RefreshCw className="h-4 w-4" />
                        Trades Required
                      </div>
                      <p className="text-2xl font-bold mt-1">{portfolioMetrics.actionsRequired}</p>
                      <p className="text-xs text-muted-foreground">Weight adjustments</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <AlertTriangle className="h-4 w-4" />
                        High Priority
                      </div>
                      <p className="text-2xl font-bold mt-1 text-amber-600">{portfolioMetrics.highUrgency}</p>
                      <p className="text-xs text-muted-foreground">Urgent actions</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Weight Change Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Weight Adjustments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weightChangeData} layout="vertical" margin={{ left: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[-30, 30]} tickFormatter={(v) => `${v}%`} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Change']}
                          labelFormatter={(label) => weightChangeData.find(d => d.name === label)?.fullName || label}
                        />
                        <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" />
                        <Bar dataKey="change">
                          {weightChangeData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.change >= 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* PTRS Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">PTRS Score Changes (Top 5)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={ptrsTimelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'PTRS']} />
                        <Legend />
                        {analysisResults?.slice(0, 5).map((h, i) => (
                          <Line 
                            key={h.molecule.id}
                            type="monotone"
                            dataKey={h.molecule.name}
                            stroke={CHART_COLORS[i % CHART_COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            {analysisResults && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {analysisResults.filter(h => h.action !== 'hold').length} rebalancing actions recommended
                  </p>
                  <Button onClick={applyRebalance}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Rebalancing
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Molecule</TableHead>
                        <TableHead>TA / Phase</TableHead>
                        <TableHead className="text-right">Current</TableHead>
                        <TableHead className="text-center">→</TableHead>
                        <TableHead className="text-right">Target</TableHead>
                        <TableHead className="text-right">PTRS Δ</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead className="max-w-[200px]">Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysisResults.map(holding => (
                        <TableRow key={holding.molecule.id} className={holding.urgency === 'high' ? 'bg-red-50 dark:bg-red-950/20' : ''}>
                          <TableCell className="font-medium">{holding.molecule.name}</TableCell>
                          <TableCell>
                            <div className="text-xs">
                              <p>{holding.molecule.therapeuticArea}</p>
                              <p className="text-muted-foreground">{holding.molecule.phase}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">{holding.currentWeight.toFixed(1)}%</TableCell>
                          <TableCell className="text-center">{getActionIcon(holding.action)}</TableCell>
                          <TableCell className="text-right font-mono">{holding.targetWeight.toFixed(1)}%</TableCell>
                          <TableCell className={`text-right font-mono ${holding.ptrsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {holding.ptrsChange >= 0 ? '+' : ''}{holding.ptrsChange.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              holding.action === 'increase' ? 'default' :
                              holding.action === 'decrease' ? 'secondary' :
                              holding.action === 'exit' ? 'destructive' : 'outline'
                            }>
                              {holding.action.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>{getUrgencyBadge(holding.urgency)}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                            {holding.reason}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
