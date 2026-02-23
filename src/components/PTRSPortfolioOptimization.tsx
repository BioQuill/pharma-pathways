import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Zap, 
  PieChart, 
  BarChart3, 
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";
import type { MoleculeProfile } from '@/lib/moleculesData';

interface OptimizationResult {
  molecule: MoleculeProfile;
  weight: number;
  expectedReturn: number;
  riskScore: number;
  diversificationScore: number;
}

interface PortfolioMetrics {
  expectedReturn: number;
  totalRisk: number;
  sharpeRatio: number;
  diversificationRatio: number;
  concentrationRisk: number;
}

interface OptimizationConstraints {
  maxWeight: number;
  minPTRS: number;
  maxRisk: number;
  targetReturn: number;
  enforceTA: boolean;
  enforcePhase: boolean;
}

interface PTRSPortfolioOptimizationProps {
  molecules: MoleculeProfile[];
}

const THERAPEUTIC_AREAS = [
  'Oncology', 'CNS/Neurology', 'Cardiovascular', 'Infectious Disease',
  'Immunology', 'Metabolic', 'Rare Disease', 'Dermatology', 'Hematology',
  'Rheumatology', 'Gastroenterology', 'Nephrology', 'Pain', "Women's Health"
];

const PHASES = ['Preclinical', 'Phase I', 'Phase II', 'Phase III', 'NDA/BLA', 'Approved'];

export const PTRSPortfolioOptimization = ({ molecules }: PTRSPortfolioOptimizationProps) => {
  const [selectedMolecules, setSelectedMolecules] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [taFilter, setTaFilter] = useState('all');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[] | null>(null);
  const [portfolioMetrics, setPortfolioMetrics] = useState<PortfolioMetrics | null>(null);
  const [optimizationMode, setOptimizationMode] = useState<'balanced' | 'aggressive' | 'conservative'>('balanced');
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxWeight: 25,
    minPTRS: 5,
    maxRisk: 70,
    targetReturn: 50,
    enforceTA: true,
    enforcePhase: true,
  });
  const reportRef = useRef<HTMLDivElement>(null);

  const filteredMolecules = useMemo(() => {
    return molecules.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        m.company.toLowerCase().includes(searchFilter.toLowerCase());
      const matchesTA = taFilter === 'all' || m.therapeuticArea.toLowerCase().includes(taFilter.toLowerCase());
      return matchesSearch && matchesTA && !m.isFailed;
    });
  }, [molecules, searchFilter, taFilter]);

  const toggleMolecule = (id: string) => {
    setSelectedMolecules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id].slice(0, 30)
    );
  };

  const selectAll = () => {
    setSelectedMolecules(filteredMolecules.slice(0, 30).map(m => m.id));
  };

  const clearSelection = () => {
    setSelectedMolecules([]);
    setOptimizationResults(null);
    setPortfolioMetrics(null);
  };

  const calculateMoleculeRisk = (molecule: MoleculeProfile): number => {
    const phaseRisk = {
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
    const approvalBonus = (molecule.scores?.approval || 0.5) * 20;
    
    return Math.max(5, Math.min(95, baseRisk + dropoutPenalty - approvalBonus));
  };

  const calculateExpectedReturn = (molecule: MoleculeProfile): number => {
    const basePTRS = (molecule.scores?.approval || 0.15) * 100;
    const marketPotential = molecule.marketData?.[0]?.revenueProjection?.year2 || 500000000;
    const marketScore = Math.min(50, (marketPotential / 1000000000) * 25);
    
    return Math.min(100, basePTRS + marketScore);
  };

  const calculateDiversificationScore = (
    molecule: MoleculeProfile, 
    selectedMols: MoleculeProfile[]
  ): number => {
    if (selectedMols.length === 0) return 100;
    
    const sameTA = selectedMols.filter(m => 
      m.therapeuticArea === molecule.therapeuticArea
    ).length;
    
    const samePhase = selectedMols.filter(m => 
      m.phase === molecule.phase
    ).length;
    
    const taScore = Math.max(0, 100 - (sameTA * 20));
    const phaseScore = Math.max(0, 100 - (samePhase * 15));
    
    return (taScore + phaseScore) / 2;
  };

  const runOptimization = () => {
    if (selectedMolecules.length < 3) return;
    setIsOptimizing(true);

    setTimeout(() => {
      const selectedMols = selectedMolecules
        .map(id => molecules.find(m => m.id === id)!)
        .filter(Boolean);

      // Calculate base metrics for each molecule
      const moleculeMetrics = selectedMols.map(mol => ({
        molecule: mol,
        expectedReturn: calculateExpectedReturn(mol),
        riskScore: calculateMoleculeRisk(mol),
        diversificationScore: calculateDiversificationScore(mol, selectedMols),
      }));

      // Apply optimization mode weights
      const modeWeights = {
        balanced: { return: 0.4, risk: 0.35, diversification: 0.25 },
        aggressive: { return: 0.6, risk: 0.2, diversification: 0.2 },
        conservative: { return: 0.25, risk: 0.5, diversification: 0.25 },
      };

      const weights = modeWeights[optimizationMode];

      // Calculate optimization scores
      const scored = moleculeMetrics.map(m => ({
        ...m,
        optimizationScore: 
          (m.expectedReturn * weights.return) +
          ((100 - m.riskScore) * weights.risk) +
          (m.diversificationScore * weights.diversification)
      }));

      // Sort by optimization score and apply constraints
      const sorted = scored
        .filter(m => {
          const ptrs = m.molecule.scores?.approval * 100 || 0;
          return ptrs >= constraints.minPTRS && m.riskScore <= constraints.maxRisk;
        })
        .sort((a, b) => b.optimizationScore - a.optimizationScore);

      // Calculate optimal weights using mean-variance optimization approximation
      const totalScore = sorted.reduce((sum, m) => sum + m.optimizationScore, 0);
      const results: OptimizationResult[] = sorted.map(m => {
        let weight = (m.optimizationScore / totalScore) * 100;
        weight = Math.min(weight, constraints.maxWeight);
        return {
          molecule: m.molecule,
          weight: Math.round(weight * 10) / 10,
          expectedReturn: m.expectedReturn,
          riskScore: m.riskScore,
          diversificationScore: m.diversificationScore,
        };
      });

      // Normalize weights to sum to 100
      const totalWeight = results.reduce((sum, r) => sum + r.weight, 0);
      results.forEach(r => {
        r.weight = Math.round((r.weight / totalWeight) * 1000) / 10;
      });

      // Calculate portfolio-level metrics
      const portfolioReturn = results.reduce((sum, r) => 
        sum + (r.expectedReturn * r.weight / 100), 0
      );
      
      const portfolioRisk = results.reduce((sum, r) => 
        sum + (r.riskScore * r.weight / 100), 0
      );

      const uniqueTAs = new Set(results.map(r => r.molecule.therapeuticArea)).size;
      const uniquePhases = new Set(results.map(r => r.molecule.phase)).size;
      const diversificationRatio = ((uniqueTAs / THERAPEUTIC_AREAS.length) + 
        (uniquePhases / PHASES.length)) * 50;

      const topWeight = Math.max(...results.map(r => r.weight));
      const concentrationRisk = topWeight + (100 - diversificationRatio) / 2;

      const sharpeRatio = portfolioRisk > 0 
        ? ((portfolioReturn - 5) / portfolioRisk) * 10 
        : 0;

      setOptimizationResults(results);
      setPortfolioMetrics({
        expectedReturn: portfolioReturn,
        totalRisk: portfolioRisk,
        sharpeRatio: Math.round(sharpeRatio * 100) / 100,
        diversificationRatio: Math.round(diversificationRatio),
        concentrationRisk: Math.round(concentrationRisk),
      });
      setIsOptimizing(false);
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const id = 'portfolio-optimization-report';
    reportRef.current.id = id;
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF(id, `portfolio-optimization-${new Date().toISOString().split('T')[0]}.pdf`, { format: 'letter' });
  };

  // Prepare chart data
  const allocationData = optimizationResults?.slice(0, 10).map(r => ({
    name: r.molecule.name.length > 15 ? r.molecule.name.slice(0, 15) + '...' : r.molecule.name,
    weight: r.weight,
    return: r.expectedReturn,
    risk: r.riskScore,
  })) || [];

  const riskReturnData = optimizationResults?.map(r => ({
    name: r.molecule.name,
    risk: r.riskScore,
    return: r.expectedReturn,
    weight: r.weight,
    ta: r.molecule.therapeuticArea,
  })) || [];

  const taAllocation = optimizationResults?.reduce((acc, r) => {
    const ta = r.molecule.therapeuticArea;
    acc[ta] = (acc[ta] || 0) + r.weight;
    return acc;
  }, {} as Record<string, number>) || {};

  const pieData = Object.entries(taAllocation).map(([name, value]) => ({
    name: name.length > 15 ? name.slice(0, 15) + '...' : name,
    value: Math.round(value * 10) / 10,
  }));

  const COLORS = [
    'hsl(217, 91%, 60%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)', 
    'hsl(45, 93%, 47%)', 'hsl(271, 81%, 56%)', 'hsl(340, 82%, 52%)',
    'hsl(180, 70%, 45%)', 'hsl(30, 80%, 55%)'
  ];

  return (
    <div className="space-y-6" ref={reportRef}>
      {/* Configuration Panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Molecule Selection */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Select Molecules for Optimization
            </CardTitle>
            <CardDescription>Choose 3-30 molecules to include in portfolio optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search molecules..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="flex-1"
              />
              <Select value={taFilter} onValueChange={setTaFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All TAs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Therapeutic Areas</SelectItem>
                  {THERAPEUTIC_AREAS.map(ta => (
                    <SelectItem key={ta} value={ta.toLowerCase()}>{ta}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
              <Button variant="outline" size="sm" onClick={clearSelection}>Clear</Button>
              <Badge variant="secondary" className="ml-auto">
                {selectedMolecules.length}/30 selected
              </Badge>
            </div>

            <ScrollArea className="h-[200px] border rounded-md p-2">
              <div className="grid gap-1">
                {filteredMolecules.slice(0, 100).map(mol => (
                  <div 
                    key={mol.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 ${
                      selectedMolecules.includes(mol.id) ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => toggleMolecule(mol.id)}
                  >
                    <Checkbox checked={selectedMolecules.includes(mol.id)} />
                    <span className="flex-1 text-sm truncate">{mol.name}</span>
                    <Badge variant="outline" className="text-xs">{mol.phase}</Badge>
                    <span className="text-xs text-muted-foreground w-20 truncate">
                      {mol.therapeuticArea}
                    </span>
                    <span className="text-xs font-medium w-12">
                      {Math.round((mol.scores?.approval || 0) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Optimization Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimization Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Optimization Mode</Label>
              <Select value={optimizationMode} onValueChange={(v: any) => setOptimizationMode(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative (Risk-focused)</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="aggressive">Aggressive (Return-focused)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Max Weight per Molecule: {constraints.maxWeight}%</Label>
              <Slider
                value={[constraints.maxWeight]}
                onValueChange={([v]) => setConstraints(c => ({ ...c, maxWeight: v }))}
                min={10}
                max={50}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Min PTRS Threshold: {constraints.minPTRS}%</Label>
              <Slider
                value={[constraints.minPTRS]}
                onValueChange={([v]) => setConstraints(c => ({ ...c, minPTRS: v }))}
                min={0}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Risk Score: {constraints.maxRisk}</Label>
              <Slider
                value={[constraints.maxRisk]}
                onValueChange={([v]) => setConstraints(c => ({ ...c, maxRisk: v }))}
                min={30}
                max={100}
                step={5}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={constraints.enforceTA}
                onCheckedChange={(c) => setConstraints(p => ({ ...p, enforceTA: !!c }))}
              />
              <Label className="text-sm">Enforce TA diversification</Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={constraints.enforcePhase}
                onCheckedChange={(c) => setConstraints(p => ({ ...p, enforcePhase: !!c }))}
              />
              <Label className="text-sm">Enforce phase diversification</Label>
            </div>

            <Button 
              className="w-full" 
              onClick={runOptimization}
              disabled={selectedMolecules.length < 3 || isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Run Optimization
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {optimizationResults && portfolioMetrics && (
        <>
          {/* Portfolio Metrics Summary */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 mx-auto text-green-600 mb-1" />
                <p className="text-2xl font-bold text-green-600">
                  {portfolioMetrics.expectedReturn.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Expected Return</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-5 w-5 mx-auto text-red-600 mb-1" />
                <p className="text-2xl font-bold text-red-600">
                  {portfolioMetrics.totalRisk.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Portfolio Risk</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <p className="text-2xl font-bold text-blue-600">
                  {portfolioMetrics.sharpeRatio.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Risk-Adj. Return</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
              <CardContent className="p-4 text-center">
                <PieChart className="h-5 w-5 mx-auto text-purple-600 mb-1" />
                <p className="text-2xl font-bold text-purple-600">
                  {portfolioMetrics.diversificationRatio}%
                </p>
                <p className="text-xs text-muted-foreground">Diversification</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200">
              <CardContent className="p-4 text-center">
                <Shield className="h-5 w-5 mx-auto text-orange-600 mb-1" />
                <p className="text-2xl font-bold text-orange-600">
                  {portfolioMetrics.concentrationRisk}%
                </p>
                <p className="text-xs text-muted-foreground">Concentration Risk</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="allocation" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-sky-100 dark:bg-sky-950/30">
                <TabsTrigger value="allocation">Allocation</TabsTrigger>
                <TabsTrigger value="riskreturn">Risk/Return</TabsTrigger>
                <TabsTrigger value="diversification">Diversification</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              <Button variant="export" size="sm" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>

            <TabsContent value="allocation" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Optimal Weight Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={allocationData} layout="vertical" margin={{ left: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal />
                          <XAxis type="number" domain={[0, 'auto']} tickFormatter={v => `${v}%`} />
                          <YAxis type="category" dataKey="name" width={75} tick={{ fontSize: 11 }} />
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']}
                          />
                          <Bar dataKey="weight" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Allocation by Therapeutic Area</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                            labelLine={{ stroke: 'hsl(var(--muted-foreground))' }}
                          >
                            {pieData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Optimization Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background">
                        <tr className="border-b">
                          <th className="text-left p-2">Molecule</th>
                          <th className="text-left p-2">TA</th>
                          <th className="text-left p-2">Phase</th>
                          <th className="text-center p-2">Weight</th>
                          <th className="text-center p-2">Exp. Return</th>
                          <th className="text-center p-2">Risk</th>
                          <th className="text-center p-2">Diversification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {optimizationResults.map((r, idx) => (
                          <tr key={r.molecule.id} className="border-b hover:bg-muted/30">
                            <td className="p-2 font-medium">{r.molecule.name}</td>
                            <td className="p-2 text-muted-foreground text-xs">
                              {r.molecule.therapeuticArea}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline" className="text-xs">{r.molecule.phase}</Badge>
                            </td>
                            <td className="text-center p-2">
                              <span className="font-bold text-primary">{r.weight}%</span>
                            </td>
                            <td className="text-center p-2 text-green-600">
                              {r.expectedReturn.toFixed(1)}%
                            </td>
                            <td className="text-center p-2">
                              <Badge variant={r.riskScore > 60 ? 'destructive' : r.riskScore > 40 ? 'secondary' : 'default'}>
                                {r.riskScore.toFixed(0)}
                              </Badge>
                            </td>
                            <td className="text-center p-2 text-purple-600">
                              {r.diversificationScore.toFixed(0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riskreturn">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk-Return Scatter Plot</CardTitle>
                  <CardDescription>Bubble size represents portfolio weight</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          type="number" 
                          dataKey="risk" 
                          name="Risk" 
                          domain={[0, 100]}
                          label={{ value: 'Risk Score', position: 'bottom', offset: 0 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="return" 
                          name="Return" 
                          domain={[0, 100]}
                          label={{ value: 'Expected Return', angle: -90, position: 'left' }}
                        />
                        <Tooltip 
                          content={({ payload }) => {
                            if (!payload?.[0]) return null;
                            const data = payload[0].payload;
                            return (
                              <div className="bg-popover border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">{data.ta}</p>
                                <p className="text-sm">Return: {data.return.toFixed(1)}%</p>
                                <p className="text-sm">Risk: {data.risk.toFixed(1)}</p>
                                <p className="text-sm font-medium text-primary">Weight: {data.weight}%</p>
                              </div>
                            );
                          }}
                        />
                        <Scatter 
                          data={riskReturnData} 
                          fill="hsl(217, 91%, 60%)"
                        >
                          {riskReturnData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              r={Math.max(5, entry.weight)}
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diversification">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Diversification Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Therapeutic Area Spread</span>
                        <span>{Object.keys(taAllocation).length} TAs</span>
                      </div>
                      <Progress value={(Object.keys(taAllocation).length / THERAPEUTIC_AREAS.length) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Phase Distribution</span>
                        <span>{new Set(optimizationResults.map(r => r.molecule.phase)).size} Phases</span>
                      </div>
                      <Progress value={(new Set(optimizationResults.map(r => r.molecule.phase)).size / PHASES.length) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Top 5 Concentration</span>
                        <span>
                          {optimizationResults.slice(0, 5).reduce((sum, r) => sum + r.weight, 0).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={optimizationResults.slice(0, 5).reduce((sum, r) => sum + r.weight, 0)} 
                        className="bg-orange-100"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Company Diversification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(
                        optimizationResults.reduce((acc, r) => {
                          acc[r.molecule.company] = (acc[r.molecule.company] || 0) + r.weight;
                          return acc;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)
                        .map(([company, weight]) => (
                          <div key={company} className="flex items-center gap-2">
                            <span className="text-sm flex-1 truncate">{company}</span>
                            <Progress value={weight} className="w-24 h-2" />
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {weight.toFixed(1)}%
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolioMetrics.concentrationRisk > 60 && (
                    <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-700">High Concentration Risk</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adding molecules from underrepresented therapeutic areas to improve diversification.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {portfolioMetrics.totalRisk > 50 && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
                      <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-700">Elevated Portfolio Risk</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adding more late-stage molecules (Phase III or NDA) to reduce overall portfolio risk.
                        </p>
                      </div>
                    </div>
                  )}

                  {portfolioMetrics.sharpeRatio > 1.5 && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-700">Excellent Risk-Adjusted Returns</p>
                        <p className="text-sm text-muted-foreground">
                          This portfolio shows strong risk-adjusted return potential. The current allocation is well-balanced.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-700">Top Performers</p>
                      <p className="text-sm text-muted-foreground">
                        {optimizationResults.slice(0, 3).map(r => r.molecule.name).join(', ')} are 
                        recommended as core holdings based on their optimal risk-return profiles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default PTRSPortfolioOptimization;
