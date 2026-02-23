import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, TrendingDown, Download, Play, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { MoleculeProfile } from '@/lib/moleculesData';
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";

interface PTRSPortfolioStressTestProps {
  molecules: MoleculeProfile[];
}

interface StressScenario {
  id: string;
  name: string;
  description: string;
  impact: number;
  category: 'regulatory' | 'clinical' | 'market' | 'operational';
}

interface MoleculeStressResult {
  molecule: MoleculeProfile;
  baselinePTRS: number;
  scenarioResults: {
    scenarioId: string;
    stressedPTRS: number;
    impact: number;
    vulnerabilityScore: number;
  }[];
  overallVulnerability: number;
  mostVulnerableTo: string;
  resilience: number;
}

const STRESS_SCENARIOS: StressScenario[] = [
  { id: 'regulatory_rejection', name: 'Regulatory Rejection', description: 'Complete Response Letter or major regulatory setback', impact: -0.35, category: 'regulatory' },
  { id: 'safety_signal', name: 'Safety Signal', description: 'Unexpected adverse events emerge in trials', impact: -0.30, category: 'clinical' },
  { id: 'efficacy_miss', name: 'Efficacy Miss', description: 'Primary endpoint not met in pivotal trial', impact: -0.40, category: 'clinical' },
  { id: 'competitor_approval', name: 'Competitor Approval', description: 'First-in-class competitor gains approval', impact: -0.20, category: 'market' },
  { id: 'manufacturing_issue', name: 'Manufacturing Issue', description: 'CMC problems causing delays', impact: -0.15, category: 'operational' },
  { id: 'trial_delay', name: 'Trial Delay', description: 'Significant enrollment or operational delays', impact: -0.12, category: 'operational' },
  { id: 'pricing_pressure', name: 'Pricing Pressure', description: 'Unfavorable reimbursement environment', impact: -0.18, category: 'market' },
  { id: 'patent_challenge', name: 'Patent Challenge', description: 'IP litigation or patent invalidation', impact: -0.22, category: 'market' },
];

const PTRSPortfolioStressTest: React.FC<PTRSPortfolioStressTestProps> = ({ molecules }) => {
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<MoleculeStressResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMolecules = useMemo(() => {
    return molecules.filter(m => !m.isFailed).slice(0, 50);
  }, [molecules]);

  const toggleMolecule = (id: string) => {
    setSelectedMolecules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id].slice(0, 20)
    );
  };

  const selectAll = () => {
    setSelectedMolecules(filteredMolecules.slice(0, 20).map(m => m.id));
  };

  const runStressTest = () => {
    setIsRunning(true);
    
    setTimeout(() => {
      const stressResults: MoleculeStressResult[] = selectedMolecules.map(id => {
        const molecule = molecules.find(m => m.id === id)!;
        const baselinePTRS = molecule.scores.approval * 100;
        
        const scenarioResults = STRESS_SCENARIOS.map(scenario => {
          const phaseMultiplier = molecule.phase === 'Phase 3' ? 1.2 : molecule.phase === 'Phase 2' ? 1.0 : 0.8;
          const taMultiplier = molecule.therapeuticArea === 'Oncology' ? 1.1 : 1.0;
          const adjustedImpact = scenario.impact * phaseMultiplier * taMultiplier * (0.8 + Math.random() * 0.4);
          const stressedPTRS = Math.max(0, Math.min(100, baselinePTRS + (adjustedImpact * 100)));
          const vulnerabilityScore = Math.abs(adjustedImpact) * 100;
          
          return {
            scenarioId: scenario.id,
            stressedPTRS,
            impact: adjustedImpact * 100,
            vulnerabilityScore
          };
        });
        
        const overallVulnerability = scenarioResults.reduce((sum, r) => sum + r.vulnerabilityScore, 0) / scenarioResults.length;
        const mostVulnerableScenario = scenarioResults.reduce((max, r) => r.vulnerabilityScore > max.vulnerabilityScore ? r : max);
        const mostVulnerableTo = STRESS_SCENARIOS.find(s => s.id === mostVulnerableScenario.scenarioId)?.name || '';
        const resilience = 100 - overallVulnerability;
        
        return {
          molecule,
          baselinePTRS,
          scenarioResults,
          overallVulnerability,
          mostVulnerableTo,
          resilience
        };
      });
      
      setResults(stressResults.sort((a, b) => b.overallVulnerability - a.overallVulnerability));
      setIsRunning(false);
    }, 1500);
  };

  const filteredScenarios = selectedCategory === 'all' 
    ? STRESS_SCENARIOS 
    : STRESS_SCENARIOS.filter(s => s.category === selectedCategory);

  const vulnerabilityChartData = results.map(r => ({
    name: r.molecule.name.length > 15 ? r.molecule.name.substring(0, 15) + '...' : r.molecule.name,
    vulnerability: r.overallVulnerability,
    resilience: r.resilience,
    baseline: r.baselinePTRS
  }));

  const radarData = filteredScenarios.map(scenario => {
    const dataPoint: any = { scenario: scenario.name.split(' ')[0] };
    results.slice(0, 5).forEach(r => {
      const scenarioResult = r.scenarioResults.find(sr => sr.scenarioId === scenario.id);
      dataPoint[r.molecule.name.substring(0, 10)] = scenarioResult?.vulnerabilityScore || 0;
    });
    return dataPoint;
  });

  const scatterData = results.map(r => ({
    x: r.baselinePTRS,
    y: r.overallVulnerability,
    z: r.resilience,
    name: r.molecule.name,
    phase: r.molecule.phase
  }));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulatory': return 'hsl(var(--destructive))';
      case 'clinical': return 'hsl(var(--warning))';
      case 'market': return 'hsl(var(--primary))';
      case 'operational': return 'hsl(var(--muted-foreground))';
      default: return 'hsl(var(--muted-foreground))';
    }
  };

  const getVulnerabilityColor = (score: number) => {
    if (score >= 25) return 'hsl(var(--destructive))';
    if (score >= 18) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  const exportToPDF = async () => {
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF('portfolio-stress-test-content', 'PTRS_Portfolio_Stress_Test.pdf', { orientation: 'landscape', format: 'letter' });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Portfolio Stress Test</CardTitle>
          </div>
          {results.length > 0 && (
            <Button variant="export" size="sm" onClick={exportToPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Run all stress scenarios across your watchlist to identify the most vulnerable molecules
        </p>
      </CardHeader>
      <CardContent>
        <div id="portfolio-stress-test-content">
          {/* Molecule Selection */}
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Select Molecules (max 20)</h4>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>Select All</Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMolecules([])}>Clear</Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filteredMolecules.map(molecule => (
                <Badge
                  key={molecule.id}
                  variant={selectedMolecules.includes(molecule.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMolecule(molecule.id)}
                >
                  {molecule.name}
                </Badge>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <Button 
                onClick={runStressTest} 
                disabled={selectedMolecules.length < 2 || isRunning}
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : `Run Stress Test (${selectedMolecules.length} molecules)`}
              </Button>
              {isRunning && <Progress value={66} className="w-48" />}
            </div>
          </div>

          {results.length > 0 && (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4 bg-sky-100 dark:bg-sky-950/30">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vulnerability">Vulnerability Map</TabsTrigger>
                <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
                <TabsTrigger value="details">Detailed Results</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="bg-destructive/10 border-destructive/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="text-sm font-medium">Most Vulnerable</span>
                      </div>
                      <p className="text-lg font-bold mt-2">{results[0]?.molecule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Vulnerability: {results[0]?.overallVulnerability.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-success/10 border-success/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-success" />
                        <span className="text-sm font-medium">Most Resilient</span>
                      </div>
                      <p className="text-lg font-bold mt-2">{results[results.length - 1]?.molecule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Resilience: {results[results.length - 1]?.resilience.toFixed(1)}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Portfolio Average</span>
                      </div>
                      <p className="text-lg font-bold mt-2">
                        {(results.reduce((sum, r) => sum + r.overallVulnerability, 0) / results.length).toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">Average Vulnerability</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vulnerabilityChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 50]} />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }} 
                      />
                      <Bar dataKey="vulnerability" name="Vulnerability Score">
                        {vulnerabilityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getVulnerabilityColor(entry.vulnerability)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="vulnerability">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="Baseline PTRS" 
                        domain={[0, 100]}
                        label={{ value: 'Baseline PTRS', position: 'bottom' }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Vulnerability" 
                        domain={[0, 40]}
                        label={{ value: 'Vulnerability Score', angle: -90, position: 'left' }}
                      />
                      <ZAxis type="number" dataKey="z" range={[100, 500]} />
                      <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))' 
                        }}
                        formatter={(value: any, name: string) => [
                          `${typeof value === 'number' ? value.toFixed(1) : value}%`,
                          name === 'x' ? 'Baseline PTRS' : name === 'y' ? 'Vulnerability' : 'Resilience'
                        ]}
                        labelFormatter={(label) => {
                          const point = scatterData.find(d => d.x === label);
                          return point?.name || '';
                        }}
                      />
                      <Scatter 
                        name="Molecules" 
                        data={scatterData} 
                        fill="hsl(var(--primary))"
                      >
                        {scatterData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getVulnerabilityColor(entry.y)}
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Bubble size indicates resilience score. Higher Y = more vulnerable.
                </p>
              </TabsContent>

              <TabsContent value="scenarios">
                <div className="mb-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="clinical">Clinical</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {results.length >= 2 && (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="scenario" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis domain={[0, 40]} />
                        {results.slice(0, 5).map((r, i) => (
                          <Radar
                            key={r.molecule.id}
                            name={r.molecule.name.substring(0, 10)}
                            dataKey={r.molecule.name.substring(0, 10)}
                            stroke={`hsl(${i * 60}, 70%, 50%)`}
                            fill={`hsl(${i * 60}, 70%, 50%)`}
                            fillOpacity={0.1}
                          />
                        ))}
                        <Legend />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))' 
                          }} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {STRESS_SCENARIOS.map(scenario => {
                    const avgImpact = results.reduce((sum, r) => {
                      const sr = r.scenarioResults.find(s => s.scenarioId === scenario.id);
                      return sum + (sr?.vulnerabilityScore || 0);
                    }, 0) / results.length;
                    
                    return (
                      <Card key={scenario.id} className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getCategoryColor(scenario.category) }}
                          />
                          <span className="text-xs font-medium">{scenario.name}</span>
                        </div>
                        <p className="text-lg font-bold">{avgImpact.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">Avg Impact</p>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Molecule</th>
                        <th className="text-center p-2">Phase</th>
                        <th className="text-center p-2">Baseline</th>
                        <th className="text-center p-2">Vulnerability</th>
                        <th className="text-center p-2">Resilience</th>
                        <th className="text-left p-2">Most Vulnerable To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result, index) => (
                        <tr key={result.molecule.id} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">
                            <div className="flex items-center gap-2">
                              {index === 0 && <AlertTriangle className="h-4 w-4 text-destructive" />}
                              {index === results.length - 1 && <Shield className="h-4 w-4 text-success" />}
                              {result.molecule.name}
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <Badge variant="outline">{result.molecule.phase}</Badge>
                          </td>
                          <td className="text-center p-2">{result.baselinePTRS.toFixed(1)}%</td>
                          <td className="text-center p-2">
                            <span style={{ color: getVulnerabilityColor(result.overallVulnerability) }}>
                              {result.overallVulnerability.toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center p-2">{result.resilience.toFixed(1)}%</td>
                          <td className="p-2 text-muted-foreground">{result.mostVulnerableTo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PTRSPortfolioStressTest;
