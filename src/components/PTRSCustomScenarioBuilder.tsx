import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save,
  Download,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Settings,
  Copy,
  FileText
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";
import type { MoleculeProfile } from '@/lib/moleculesData';
import { runMonteCarloSimulation } from '@/lib/monteCarloSimulation';

interface FactorImpact {
  name: string;
  impact: number; // -100 to +100
}

interface CustomScenario {
  id: string;
  name: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe' | 'extreme';
  factors: FactorImpact[];
  createdAt: Date;
}

interface ScenarioResult {
  scenario: CustomScenario;
  baselinePTRS: number;
  stressedPTRS: number;
  impact: number;
  confidenceInterval: [number, number];
}

interface PTRSCustomScenarioBuilderProps {
  molecules: MoleculeProfile[];
}

const DEFAULT_FACTORS = [
  { name: 'Mechanism Novelty', impact: 0 },
  { name: 'Endpoint Clarity', impact: 0 },
  { name: 'Prior Trial Data', impact: 0 },
  { name: 'Sponsor Experience', impact: 0 },
  { name: 'Regulatory Precedent', impact: 0 },
  { name: 'Safety Profile', impact: 0 },
];

const PRESET_SCENARIOS: Omit<CustomScenario, 'id' | 'createdAt'>[] = [
  {
    name: 'Competitor Breakthrough',
    description: 'A competitor achieves breakthrough therapy designation for similar indication',
    severity: 'moderate',
    factors: [
      { name: 'Mechanism Novelty', impact: -30 },
      { name: 'Regulatory Precedent', impact: 15 },
      { name: 'Endpoint Clarity', impact: 10 },
    ],
  },
  {
    name: 'Biomarker Strategy Shift',
    description: 'FDA requests new biomarker endpoints mid-development',
    severity: 'severe',
    factors: [
      { name: 'Endpoint Clarity', impact: -45 },
      { name: 'Prior Trial Data', impact: -25 },
      { name: 'Regulatory Precedent', impact: -20 },
    ],
  },
  {
    name: 'Positive Interim Analysis',
    description: 'Unexpectedly strong interim efficacy data',
    severity: 'mild',
    factors: [
      { name: 'Prior Trial Data', impact: 35 },
      { name: 'Endpoint Clarity', impact: 20 },
      { name: 'Regulatory Precedent', impact: 15 },
    ],
  },
  {
    name: 'Key Opinion Leader Concerns',
    description: 'Leading experts raise mechanism-related safety concerns',
    severity: 'moderate',
    factors: [
      { name: 'Safety Profile', impact: -35 },
      { name: 'Mechanism Novelty', impact: -20 },
      { name: 'Sponsor Experience', impact: -10 },
    ],
  },
  {
    name: 'Supply Chain Crisis',
    description: 'Critical API shortage affecting manufacturing timeline',
    severity: 'severe',
    factors: [
      { name: 'Sponsor Experience', impact: -40 },
      { name: 'Prior Trial Data', impact: -15 },
      { name: 'Regulatory Precedent', impact: -25 },
    ],
  },
];

const SEVERITY_COLORS = {
  mild: 'bg-green-100 text-green-700 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  severe: 'bg-orange-100 text-orange-700 border-orange-200',
  extreme: 'bg-red-100 text-red-700 border-red-200',
};

export const PTRSCustomScenarioBuilder = ({ molecules }: PTRSCustomScenarioBuilderProps) => {
  const [customScenarios, setCustomScenarios] = useState<CustomScenario[]>([]);
  const [selectedMoleculeId, setSelectedMoleculeId] = useState<string>('');
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<ScenarioResult[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  
  // New scenario form state
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDesc, setNewScenarioDesc] = useState('');
  const [newScenarioSeverity, setNewScenarioSeverity] = useState<'mild' | 'moderate' | 'severe' | 'extreme'>('moderate');
  const [newScenarioFactors, setNewScenarioFactors] = useState<FactorImpact[]>(
    DEFAULT_FACTORS.map(f => ({ ...f }))
  );
  
  const reportRef = useRef<HTMLDivElement>(null);

  const filteredMolecules = useMemo(() => {
    return molecules.filter(m => 
      !m.isFailed && 
      (m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
       m.company.toLowerCase().includes(searchFilter.toLowerCase()))
    );
  }, [molecules, searchFilter]);

  const selectedMolecule = molecules.find(m => m.id === selectedMoleculeId);

  const allScenarios = useMemo(() => {
    const presets = PRESET_SCENARIOS.map((s, i) => ({
      ...s,
      id: `preset-${i}`,
      createdAt: new Date(),
    }));
    return [...presets, ...customScenarios];
  }, [customScenarios]);

  const updateFactorImpact = (factorName: string, impact: number) => {
    setNewScenarioFactors(prev => 
      prev.map(f => f.name === factorName ? { ...f, impact } : f)
    );
  };

  const addCustomScenario = () => {
    if (!newScenarioName.trim()) return;

    const scenario: CustomScenario = {
      id: `custom-${Date.now()}`,
      name: newScenarioName,
      description: newScenarioDesc,
      severity: newScenarioSeverity,
      factors: newScenarioFactors.filter(f => f.impact !== 0),
      createdAt: new Date(),
    };

    setCustomScenarios(prev => [...prev, scenario]);
    
    // Reset form
    setNewScenarioName('');
    setNewScenarioDesc('');
    setNewScenarioSeverity('moderate');
    setNewScenarioFactors(DEFAULT_FACTORS.map(f => ({ ...f })));
  };

  const deleteScenario = (id: string) => {
    setCustomScenarios(prev => prev.filter(s => s.id !== id));
    setSelectedScenarioIds(prev => prev.filter(sId => sId !== id));
  };

  const duplicateScenario = (scenario: CustomScenario) => {
    const newScenario: CustomScenario = {
      ...scenario,
      id: `custom-${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      createdAt: new Date(),
    };
    setCustomScenarios(prev => [...prev, newScenario]);
  };

  const toggleScenario = (id: string) => {
    setSelectedScenarioIds(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id].slice(0, 8)
    );
  };

  const getMoleculeComponentScores = (molecule: MoleculeProfile, adjustments?: Record<string, number>) => {
    const scores = molecule.scores;
    const baseScores = [
      { name: 'Mechanism Novelty', baseScore: Math.round((scores?.meetingEndpoints || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Endpoint Clarity', baseScore: Math.round((scores?.approval || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Prior Trial Data', baseScore: Math.round((scores?.nextPhase || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.20 },
      { name: 'Sponsor Experience', baseScore: molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45, minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Regulatory Precedent', baseScore: Math.round((scores?.regulatoryPathway?.accelerated || 0.5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
      { name: 'Safety Profile', baseScore: Math.round((1 - (scores?.dropoutRanking || 2.5) / 5) * 100), minScore: 0, maxScore: 100, weight: 0.15 },
    ];

    if (adjustments) {
      return baseScores.map(score => ({
        ...score,
        baseScore: Math.max(0, Math.min(100, score.baseScore + (adjustments[score.name] || 0))),
      }));
    }

    return baseScores;
  };

  const runScenarios = () => {
    if (!selectedMolecule || selectedScenarioIds.length === 0) return;
    setIsRunning(true);

    setTimeout(() => {
      const baselinePTRS = (selectedMolecule.scores?.approval || 0.15) * 100;
      
      const scenarioResults: ScenarioResult[] = selectedScenarioIds.map(scenarioId => {
        const scenario = allScenarios.find(s => s.id === scenarioId)!;
        
        // Convert factor impacts to adjustments
        const adjustments: Record<string, number> = {};
        scenario.factors.forEach(f => {
          adjustments[f.name] = f.impact;
        });

        // Calculate stressed scores
        const stressedScores = getMoleculeComponentScores(selectedMolecule, adjustments);
        
        // Run Monte Carlo with stressed parameters
        const simulation = runMonteCarloSimulation(stressedScores, { iterations: 1000, uncertaintyRange: 20, confidenceInterval: 90 });
        
        // Calculate stressed PTRS from composite score distribution
        const avgStressedScore = simulation.compositeScoreDistribution.reduce((sum, v) => sum + v, 0) 
          / simulation.compositeScoreDistribution.length;
        
        const stressedPTRS = Math.max(0, Math.min(100, avgStressedScore));
        
        return {
          scenario,
          baselinePTRS,
          stressedPTRS,
          impact: stressedPTRS - baselinePTRS,
          confidenceInterval: [simulation.percentiles.p5, simulation.percentiles.p95] as [number, number],
        };
      });

      setResults(scenarioResults.sort((a, b) => a.impact - b.impact));
      setIsRunning(false);
    }, 1200);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const id = 'custom-scenario-report';
    reportRef.current.id = id;
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF(id, `custom-scenario-analysis-${new Date().toISOString().split('T')[0]}.pdf`, { format: 'letter' });
  };

  // Chart data
  const impactChartData = results.map(r => ({
    name: r.scenario.name.length > 20 ? r.scenario.name.slice(0, 20) + '...' : r.scenario.name,
    baseline: r.baselinePTRS,
    stressed: r.stressedPTRS,
    impact: r.impact,
  }));

  const radarData = results.length > 0 ? DEFAULT_FACTORS.map(f => ({
    factor: f.name.split(' ')[0],
    ...Object.fromEntries(results.slice(0, 4).map(r => [
      r.scenario.name,
      r.scenario.factors.find(sf => sf.name === f.name)?.impact || 0
    ]))
  })) : [];

  return (
    <div className="space-y-6" ref={reportRef}>
      <Tabs defaultValue="builder" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-sky-100 dark:bg-sky-950/30">
          <TabsTrigger value="builder">Scenario Builder</TabsTrigger>
          <TabsTrigger value="library">Scenario Library</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Custom Stress Scenario
              </CardTitle>
              <CardDescription>
                Define impact adjustments for each PTRS factor to model specific risk events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Scenario Name</Label>
                  <Input
                    placeholder="e.g., FDA Advisory Committee Concerns"
                    value={newScenarioName}
                    onChange={(e) => setNewScenarioName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Severity Level</Label>
                  <Select value={newScenarioSeverity} onValueChange={(v: any) => setNewScenarioSeverity(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="extreme">Extreme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the scenario and its potential causes..."
                  value={newScenarioDesc}
                  onChange={(e) => setNewScenarioDesc(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Factor Impact Adjustments
                </Label>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {newScenarioFactors.map((factor) => (
                    <div key={factor.name} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">{factor.name}</Label>
                        <Badge 
                          variant={factor.impact > 0 ? 'default' : factor.impact < 0 ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {factor.impact > 0 ? '+' : ''}{factor.impact}%
                        </Badge>
                      </div>
                      <Slider
                        value={[factor.impact]}
                        onValueChange={([v]) => updateFactorImpact(factor.name, v)}
                        min={-60}
                        max={60}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>-60%</span>
                        <span>0</span>
                        <span>+60%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={addCustomScenario} 
                disabled={!newScenarioName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Scenario
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4 mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Molecule Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Molecule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Search molecules..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                <ScrollArea className="h-[200px] border rounded-md">
                  <div className="p-2 space-y-1">
                    {filteredMolecules.slice(0, 50).map(mol => (
                      <div
                        key={mol.id}
                        className={`p-2 rounded cursor-pointer hover:bg-muted/50 flex justify-between items-center ${
                          selectedMoleculeId === mol.id ? 'bg-primary/10 border border-primary/30' : ''
                        }`}
                        onClick={() => setSelectedMoleculeId(mol.id)}
                      >
                        <div>
                          <p className="text-sm font-medium">{mol.name}</p>
                          <p className="text-xs text-muted-foreground">{mol.therapeuticArea}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">{mol.phase}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedMolecule && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">{selectedMolecule.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMolecule.company}</p>
                    <p className="text-sm mt-1">
                      Baseline PTRS: <span className="font-bold text-primary">
                        {((selectedMolecule.scores?.approval || 0) * 100).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scenario Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Select Scenarios (up to 8)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px]">
                  <div className="space-y-2 pr-2">
                    {allScenarios.map(scenario => (
                      <div
                        key={scenario.id}
                        className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors ${
                          selectedScenarioIds.includes(scenario.id) ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => toggleScenario(scenario.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{scenario.name}</p>
                              <Badge className={`text-xs ${SEVERITY_COLORS[scenario.severity]}`}>
                                {scenario.severity}
                              </Badge>
                              {scenario.id.startsWith('custom-') && (
                                <Badge variant="outline" className="text-xs">Custom</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {scenario.factors.slice(0, 3).map(f => (
                                <Badge 
                                  key={f.name} 
                                  variant="secondary" 
                                  className={`text-xs ${f.impact > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                >
                                  {f.name.split(' ')[0]}: {f.impact > 0 ? '+' : ''}{f.impact}%
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {scenario.id.startsWith('custom-') && (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateScenario(scenario);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteScenario(scenario.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={runScenarios}
            disabled={!selectedMolecule || selectedScenarioIds.length === 0 || isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Simulations...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run {selectedScenarioIds.length} Scenario{selectedScenarioIds.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 mt-4">
          {results.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results yet. Select a molecule and scenarios, then run the analysis.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant="export" size="sm" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Activity className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                    <p className="text-2xl font-bold text-blue-600">
                      {results[0]?.baselinePTRS.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Baseline PTRS</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
                  <CardContent className="p-4 text-center">
                    <TrendingDown className="h-5 w-5 mx-auto text-red-600 mb-1" />
                    <p className="text-2xl font-bold text-red-600">
                      {Math.min(...results.map(r => r.impact)).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Worst Case Impact</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                    <p className="text-2xl font-bold text-green-600">
                      {Math.max(...results.map(r => r.impact)).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Best Case Impact</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Shield className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                    <p className="text-2xl font-bold text-purple-600">
                      {(results.reduce((sum, r) => sum + r.impact, 0) / results.length).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. Impact</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Scenario Impact Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={impactChartData} layout="vertical" margin={{ left: 100 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal />
                          <XAxis type="number" domain={['auto', 'auto']} tickFormatter={v => `${v}%`} />
                          <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 11 }} />
                          <Tooltip 
                            formatter={(value: number, name: string) => [
                              `${value.toFixed(1)}%`,
                              name === 'impact' ? 'Impact' : name
                            ]}
                          />
                          <Legend />
                          <Bar dataKey="baseline" name="Baseline" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="stressed" name="Stressed" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Factor Impact Radar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="factor" tick={{ fontSize: 10 }} />
                          <PolarRadiusAxis domain={[-60, 60]} tick={{ fontSize: 10 }} />
                          {results.slice(0, 4).map((r, i) => (
                            <Radar
                              key={r.scenario.id}
                              name={r.scenario.name}
                              dataKey={r.scenario.name}
                              stroke={`hsl(${i * 90}, 70%, 50%)`}
                              fill={`hsl(${i * 90}, 70%, 50%)`}
                              fillOpacity={0.2}
                            />
                          ))}
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Detailed Scenario Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2">Scenario</th>
                        <th className="text-center p-2">Severity</th>
                        <th className="text-center p-2">Baseline</th>
                        <th className="text-center p-2">Stressed</th>
                        <th className="text-center p-2">Impact</th>
                        <th className="text-center p-2">90% CI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map(r => (
                        <tr key={r.scenario.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{r.scenario.name}</p>
                              <p className="text-xs text-muted-foreground">{r.scenario.description}</p>
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <Badge className={SEVERITY_COLORS[r.scenario.severity]}>
                              {r.scenario.severity}
                            </Badge>
                          </td>
                          <td className="text-center p-2">{r.baselinePTRS.toFixed(1)}%</td>
                          <td className="text-center p-2 font-medium">{r.stressedPTRS.toFixed(1)}%</td>
                          <td className="text-center p-2">
                            <span className={r.impact >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {r.impact >= 0 ? '+' : ''}{r.impact.toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center p-2 text-muted-foreground text-xs">
                            [{r.confidenceInterval[0].toFixed(1)}, {r.confidenceInterval[1].toFixed(1)}]
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PTRSCustomScenarioBuilder;
