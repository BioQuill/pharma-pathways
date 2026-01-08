import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
// TTM calculation done inline with phase-based estimation

import { type MoleculeProfile } from "@/lib/moleculesData";

interface PortfolioDashboardProps {
  molecules: MoleculeProfile[];
  watchlistIds?: string[];
}

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function PortfolioDashboard({ molecules, watchlistIds = [] }: PortfolioDashboardProps) {
  const stats = useMemo(() => {
    const lpiScores = molecules.map(m => {
      const result = calculateLPI3ForMolecule(m);
      const lpi = result.calibratedProbability * 100;
      // Derive recommendation and risk from probability
      const recommendation = lpi >= 70 ? 'Strong Buy' : lpi >= 55 ? 'Buy' : lpi >= 40 ? 'Hold' : 'Sell';
      const riskLevel = lpi >= 60 ? 'Low' : lpi >= 40 ? 'Medium' : 'High';
      return {
        molecule: m,
        lpi,
        recommendation,
        riskLevel
      };
    });

    const avgLPI = lpiScores.reduce((sum, s) => sum + s.lpi, 0) / lpiScores.length;
    const highPotential = lpiScores.filter(s => s.lpi >= 70).length;
    const mediumPotential = lpiScores.filter(s => s.lpi >= 40 && s.lpi < 70).length;
    const lowPotential = lpiScores.filter(s => s.lpi < 40).length;

    // Phase distribution
    const phaseDistribution: Record<string, number> = {};
    molecules.forEach(m => {
      const phase = m.phase.includes("III") ? "Phase III" : 
                    m.phase.includes("II") ? "Phase II" : 
                    m.phase.includes("I") ? "Phase I" : "Other";
      phaseDistribution[phase] = (phaseDistribution[phase] || 0) + 1;
    });

    // TA distribution
    const taDistribution: Record<string, number> = {};
    molecules.forEach(m => {
      taDistribution[m.therapeuticArea] = (taDistribution[m.therapeuticArea] || 0) + 1;
    });

    // Company distribution (top 10)
    const companyDistribution: Record<string, number> = {};
    molecules.forEach(m => {
      companyDistribution[m.company] = (companyDistribution[m.company] || 0) + 1;
    });
    const topCompanies = Object.entries(companyDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Risk distribution
    const riskDistribution = {
      low: lpiScores.filter(s => s.riskLevel === 'Low').length,
      medium: lpiScores.filter(s => s.riskLevel === 'Medium').length,
      high: lpiScores.filter(s => s.riskLevel === 'High').length
    };

    // Recommendation distribution
    const recommendationDistribution = {
      strong_buy: lpiScores.filter(s => s.recommendation === 'Strong Buy').length,
      buy: lpiScores.filter(s => s.recommendation === 'Buy').length,
      hold: lpiScores.filter(s => s.recommendation === 'Hold').length,
      sell: lpiScores.filter(s => s.recommendation === 'Sell').length
    };

    // LPI score ranges for histogram
    const lpiRanges = [
      { range: '0-20', count: lpiScores.filter(s => s.lpi < 20).length },
      { range: '20-40', count: lpiScores.filter(s => s.lpi >= 20 && s.lpi < 40).length },
      { range: '40-60', count: lpiScores.filter(s => s.lpi >= 40 && s.lpi < 60).length },
      { range: '60-80', count: lpiScores.filter(s => s.lpi >= 60 && s.lpi < 80).length },
      { range: '80-100', count: lpiScores.filter(s => s.lpi >= 80).length }
    ];

    // Top molecules by LPI
    const topMolecules = [...lpiScores]
      .sort((a, b) => b.lpi - a.lpi)
      .slice(0, 10);

    // Failed vs Active
    const failedCount = molecules.filter(m => m.isFailed).length;
    const activeCount = molecules.length - failedCount;

    // Average TTM by TA - use phase-based estimation
    const ttmByTA: Record<string, { total: number; count: number }> = {};
    const phaseMonths: Record<string, number> = {
      'Phase I': 96, 'Phase I/II': 72, 'Phase II': 48, 
      'Phase II/III': 30, 'Phase III': 18, 'NDA/BLA': 6, 'Approved': 0
    };
    molecules.forEach(m => {
      const ttm = phaseMonths[m.phase] ?? 60;
      if (!ttmByTA[m.therapeuticArea]) {
        ttmByTA[m.therapeuticArea] = { total: 0, count: 0 };
      }
      ttmByTA[m.therapeuticArea].total += ttm;
      ttmByTA[m.therapeuticArea].count += 1;
    });
    const avgTTMByTA = Object.entries(ttmByTA)
      .map(([ta, data]) => ({
        ta,
        avgTTM: Math.round(data.total / data.count)
      }))
      .sort((a, b) => a.avgTTM - b.avgTTM)
      .slice(0, 8);

    return {
      total: molecules.length,
      avgLPI,
      highPotential,
      mediumPotential,
      lowPotential,
      phaseDistribution,
      taDistribution,
      topCompanies,
      riskDistribution,
      recommendationDistribution,
      lpiRanges,
      topMolecules,
      failedCount,
      activeCount,
      avgTTMByTA,
      watchlistCount: watchlistIds.length
    };
  }, [molecules, watchlistIds]);

  const phaseData = Object.entries(stats.phaseDistribution).map(([name, value]) => ({ name, value }));
  const taData = Object.entries(stats.taDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name: name.length > 12 ? name.substring(0, 12) + '...' : name, fullName: name, value }));
  
  const riskData = [
    { name: 'Low Risk', value: stats.riskDistribution.low, color: '#22c55e' },
    { name: 'Medium Risk', value: stats.riskDistribution.medium, color: '#f59e0b' },
    { name: 'High Risk', value: stats.riskDistribution.high, color: '#ef4444' }
  ];

  const recommendationData = [
    { name: 'Strong Buy', value: stats.recommendationDistribution.strong_buy, color: '#22c55e' },
    { name: 'Buy', value: stats.recommendationDistribution.buy, color: '#3b82f6' },
    { name: 'Hold', value: stats.recommendationDistribution.hold, color: '#f59e0b' },
    { name: 'Sell', value: stats.recommendationDistribution.sell, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Molecules</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600">{stats.activeCount} active</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-red-600">{stats.failedCount} failed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average LPI Score</p>
                <p className="text-3xl font-bold">{stats.avgLPI.toFixed(1)}%</p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                stats.avgLPI >= 60 ? 'bg-green-100 dark:bg-green-900/30' : 
                stats.avgLPI >= 40 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <Target className={`h-6 w-6 ${
                  stats.avgLPI >= 60 ? 'text-green-600' : 
                  stats.avgLPI >= 40 ? 'text-yellow-600' : 
                  'text-red-600'
                }`} />
              </div>
            </div>
            <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  stats.avgLPI >= 60 ? 'bg-green-500' : 
                  stats.avgLPI >= 40 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
                style={{ width: `${stats.avgLPI}%` }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Potential</p>
                <p className="text-3xl font-bold text-green-600">{stats.highPotential}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              LPI ≥ 70% ({((stats.highPotential / stats.total) * 100).toFixed(1)}% of portfolio)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Watchlist</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.watchlistCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Molecules being tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LPI Distribution Histogram */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              LPI Score Distribution
            </CardTitle>
            <CardDescription>Distribution of Launch Probability Index scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.lpiRanges}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="range" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk & Recommendation Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Risk & Recommendation Overview
            </CardTitle>
            <CardDescription>Portfolio risk profile and investment recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 h-[300px]">
              <div>
                <p className="text-sm font-medium text-center mb-2">Risk Level</p>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <p className="text-sm font-medium text-center mb-2">Recommendation</p>
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={recommendationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {recommendationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {riskData.map((item, i) => (
                <div key={i} className="flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Phase Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phase Distribution</CardTitle>
            <CardDescription>Molecules by development phase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={phaseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {phaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Therapeutic Area Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Area Distribution</CardTitle>
            <CardDescription>Top therapeutic areas by molecule count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name, props) => [value, props.payload.fullName]}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Molecules & Companies */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Molecules by LPI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top 10 Molecules by LPI
            </CardTitle>
            <CardDescription>Highest launch probability candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topMolecules.map((item, index) => (
                <div key={item.molecule.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{item.molecule.name}</p>
                      <p className="text-xs text-muted-foreground">{item.molecule.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.molecule.phase}
                    </Badge>
                    <span className={`font-semibold ${
                      item.lpi >= 70 ? 'text-green-600' : 
                      item.lpi >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {item.lpi.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Companies by Pipeline Size</CardTitle>
            <CardDescription>Companies with most molecules in portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats.topCompanies.map(([name, count]) => ({ 
                    name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
                    fullName: name,
                    count 
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis type="category" dataKey="name" width={120} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value, name, props) => [value, props.payload.fullName]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Average TTM by TA */}
      <Card>
        <CardHeader>
          <CardTitle>Average Time-to-Market by Therapeutic Area</CardTitle>
          <CardDescription>Expected months to market launch (lower is better)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.avgTTMByTA}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="ta" 
                  className="text-xs" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis className="text-xs" label={{ value: 'Months', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="avgTTM" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
