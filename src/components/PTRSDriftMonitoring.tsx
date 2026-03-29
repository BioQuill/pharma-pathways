import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Activity,
  FileDown,
  RefreshCw,
  Gauge,
  BarChart3,
  Bell
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { generateAndDownloadPDF, Document, Page, Text, View, StyleSheet } from "@/lib/pdfGenerator";

interface MoleculeProfile {
  name: string;
  company: string;
  therapeuticArea: string;
  phase: string;
  ptrs?: number;
  [key: string]: any;
}

interface PTRSDriftMonitoringProps {
  molecules: MoleculeProfile[];
}

interface MoleculeDrift {
  name: string;
  company: string;
  therapeuticArea: string;
  currentWeight: number;
  targetWeight: number;
  drift: number;
  absoluteDrift: number;
  driftDirection: 'over' | 'under' | 'neutral';
  ptrs: number;
  ptrsChange: number;
  status: 'critical' | 'warning' | 'normal';
  lastUpdated: string;
  trend: number[];
}

interface DriftThreshold {
  warning: number;
  critical: number;
}

const PTRSDriftMonitoring: React.FC<PTRSDriftMonitoringProps> = ({ molecules }) => {
  const [driftThreshold, setDriftThreshold] = useState<DriftThreshold>({ warning: 5, critical: 10 });
  const [refreshInterval, setRefreshInterval] = useState('real-time');
  const [selectedView, setSelectedView] = useState<'all' | 'critical' | 'warning'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Generate simulated portfolio data with drifts
  const portfolioData = useMemo((): MoleculeDrift[] => {
    const totalMolecules = molecules.length;
    const baseWeight = 100 / totalMolecules;

    return molecules.map((mol, index) => {
      const basePtrs = mol.ptrs || 15 + Math.random() * 25;
      const ptrsChange = (Math.random() - 0.5) * 8;
      const targetWeight = baseWeight + (Math.random() - 0.5) * 5;
      const currentWeight = targetWeight + (Math.random() - 0.5) * 15;
      const drift = currentWeight - targetWeight;
      const absoluteDrift = Math.abs(drift);
      
      let status: 'critical' | 'warning' | 'normal' = 'normal';
      if (absoluteDrift >= driftThreshold.critical) status = 'critical';
      else if (absoluteDrift >= driftThreshold.warning) status = 'warning';

      // Generate trend data for last 7 days
      const trend = Array.from({ length: 7 }, (_, i) => {
        const base = targetWeight;
        return base + (Math.random() - 0.5) * (10 + i * 2);
      });

      return {
        name: mol.name,
        company: mol.company,
        therapeuticArea: mol.therapeuticArea,
        currentWeight: Math.max(0, currentWeight),
        targetWeight,
        drift,
        absoluteDrift,
        driftDirection: drift > 0.5 ? 'over' : drift < -0.5 ? 'under' : 'neutral',
        ptrs: basePtrs,
        ptrsChange,
        status,
        lastUpdated: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        trend
      };
    });
  }, [molecules, driftThreshold]);

  // Portfolio metrics
  const metrics = useMemo(() => {
    const criticalCount = portfolioData.filter(m => m.status === 'critical').length;
    const warningCount = portfolioData.filter(m => m.status === 'warning').length;
    const avgDrift = portfolioData.reduce((sum, m) => sum + m.absoluteDrift, 0) / portfolioData.length;
    const maxDrift = Math.max(...portfolioData.map(m => m.absoluteDrift));
    const portfolioHealth = Math.max(0, 100 - (criticalCount * 20 + warningCount * 10 + avgDrift * 2));
    
    return {
      criticalCount,
      warningCount,
      normalCount: portfolioData.length - criticalCount - warningCount,
      avgDrift: avgDrift.toFixed(2),
      maxDrift: maxDrift.toFixed(2),
      portfolioHealth: Math.round(portfolioHealth),
      totalDrift: portfolioData.reduce((sum, m) => sum + Math.abs(m.drift), 0).toFixed(2)
    };
  }, [portfolioData]);

  // Filter molecules based on view
  const filteredData = useMemo(() => {
    switch (selectedView) {
      case 'critical':
        return portfolioData.filter(m => m.status === 'critical');
      case 'warning':
        return portfolioData.filter(m => m.status === 'warning');
      default:
        return portfolioData;
    }
  }, [portfolioData, selectedView]);

  // Chart data
  const driftDistributionData = useMemo(() => {
    return portfolioData
      .sort((a, b) => b.absoluteDrift - a.absoluteDrift)
      .slice(0, 15)
      .map(m => ({
        name: m.name.length > 12 ? m.name.substring(0, 12) + '...' : m.name,
        drift: m.drift,
        target: m.targetWeight,
        current: m.currentWeight,
        status: m.status
      }));
  }, [portfolioData]);

  const trendData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    return days.map((day, i) => {
      const avgDrift = portfolioData.reduce((sum, m) => sum + Math.abs(m.trend[i] - m.targetWeight), 0) / portfolioData.length;
      return {
        day,
        avgDrift: avgDrift.toFixed(2),
        critical: portfolioData.filter(m => Math.abs(m.trend[i] - m.targetWeight) >= driftThreshold.critical).length,
        warning: portfolioData.filter(m => {
          const d = Math.abs(m.trend[i] - m.targetWeight);
          return d >= driftThreshold.warning && d < driftThreshold.critical;
        }).length
      };
    });
  }, [portfolioData, driftThreshold]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive/10 border-destructive/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      default: return 'bg-green-500/10 border-green-500/20';
    }
  };

  const getDriftBarColor = (status: string) => {
    switch (status) {
      case 'critical': return 'hsl(var(--destructive))';
      case 'warning': return 'hsl(45, 93%, 47%)';
      default: return 'hsl(142, 76%, 36%)';
    }
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
  };

  const exportToPDF = async () => {
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF('drift-monitoring-content', 'portfolio-drift-monitoring.pdf', { orientation: 'landscape' });
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Portfolio Drift Monitoring</CardTitle>
              <CardDescription>
                Real-time weight deviations from target allocations
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="real-time">Real-time</SelectItem>
                <SelectItem value="1min">1 minute</SelectItem>
                <SelectItem value="5min">5 minutes</SelectItem>
                <SelectItem value="15min">15 minutes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="export" size="sm" onClick={exportToPDF}>
              <FileDown className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent id="drift-monitoring-content" className="space-y-6">
        {/* Health Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Portfolio Health</span>
              </div>
              <p className="text-2xl font-bold text-primary">{metrics.portfolioHealth}%</p>
            </CardContent>
          </Card>
          
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-muted-foreground">Critical</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{metrics.criticalCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-500/10 border-yellow-500/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Bell className="h-4 w-4 text-yellow-600" />
                <span className="text-xs text-muted-foreground">Warning</span>
              </div>
              <p className="text-2xl font-bold text-yellow-600">{metrics.warningCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-xs text-muted-foreground">On Target</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{metrics.normalCount}</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Avg Drift</span>
              </div>
              <p className="text-2xl font-bold">{metrics.avgDrift}%</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Max Drift</span>
              </div>
              <p className="text-2xl font-bold">{metrics.maxDrift}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Threshold Settings */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Warning Threshold: {driftThreshold.warning}%
                </label>
                <Slider
                  value={[driftThreshold.warning]}
                  onValueChange={(v) => setDriftThreshold(prev => ({ ...prev, warning: v[0] }))}
                  min={1}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Critical Threshold: {driftThreshold.critical}%
                </label>
                <Slider
                  value={[driftThreshold.critical]}
                  onValueChange={(v) => setDriftThreshold(prev => ({ ...prev, critical: v[0] }))}
                  min={5}
                  max={25}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview">
          <TabsList className="bg-sky-100 dark:bg-sky-950/30">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="distribution">Drift Distribution</TabsTrigger>
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="details">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant={selectedView === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('all')}
              >
                All ({portfolioData.length})
              </Button>
              <Button
                variant={selectedView === 'critical' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('critical')}
              >
                Critical ({metrics.criticalCount})
              </Button>
              <Button
                variant={selectedView === 'warning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('warning')}
                className={selectedView === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                Warning ({metrics.warningCount})
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredData.slice(0, 12).map((mol, idx) => (
                <Card key={idx} className={getStatusBgColor(mol.status)}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm">{mol.name}</p>
                        <p className="text-xs text-muted-foreground">{mol.company}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(mol.status)} text-xs`}
                      >
                        {mol.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Target: {mol.targetWeight.toFixed(1)}%</span>
                        <span>Current: {mol.currentWeight.toFixed(1)}%</span>
                      </div>
                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-primary/30 rounded-full"
                          style={{ width: `${Math.min(mol.targetWeight * 3, 100)}%` }}
                        />
                        <div 
                          className={`absolute h-full rounded-full ${
                            mol.status === 'critical' ? 'bg-destructive' :
                            mol.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(mol.currentWeight * 3, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${getStatusColor(mol.status)}`}>
                          {mol.drift > 0 ? '+' : ''}{mol.drift.toFixed(1)}% drift
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {mol.driftDirection === 'over' ? (
                            <TrendingUp className="h-3 w-3 text-destructive" />
                          ) : mol.driftDirection === 'under' ? (
                            <TrendingDown className="h-3 w-3 text-blue-500" />
                          ) : (
                            <Target className="h-3 w-3 text-green-500" />
                          )}
                          {mol.driftDirection}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="distribution">
            <Card>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={driftDistributionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[-15, 15]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drift']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <ReferenceLine x={driftThreshold.warning} stroke="hsl(45, 93%, 47%)" strokeDasharray="3 3" />
                    <ReferenceLine x={-driftThreshold.warning} stroke="hsl(45, 93%, 47%)" strokeDasharray="3 3" />
                    <ReferenceLine x={driftThreshold.critical} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    <ReferenceLine x={-driftThreshold.critical} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    <Bar dataKey="drift" name="Weight Drift">
                      {driftDistributionData.map((entry, index) => (
                        <Cell key={index} fill={getDriftBarColor(entry.status)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="avgDrift" 
                      name="Avg Drift %" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="critical" 
                      name="Critical Count" 
                      stroke="hsl(var(--destructive))" 
                      fill="hsl(var(--destructive))" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="warning" 
                      name="Warning Count" 
                      stroke="hsl(45, 93%, 47%)" 
                      fill="hsl(45, 93%, 47%)" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Molecule</th>
                        <th className="text-left py-2 px-3">TA</th>
                        <th className="text-right py-2 px-3">Target %</th>
                        <th className="text-right py-2 px-3">Current %</th>
                        <th className="text-right py-2 px-3">Drift</th>
                        <th className="text-center py-2 px-3">Direction</th>
                        <th className="text-right py-2 px-3">PTRS</th>
                        <th className="text-center py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioData
                        .sort((a, b) => b.absoluteDrift - a.absoluteDrift)
                        .map((mol, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-3">
                              <div>
                                <p className="font-medium">{mol.name}</p>
                                <p className="text-xs text-muted-foreground">{mol.company}</p>
                              </div>
                            </td>
                            <td className="py-2 px-3 text-muted-foreground">{mol.therapeuticArea}</td>
                            <td className="py-2 px-3 text-right">{mol.targetWeight.toFixed(2)}%</td>
                            <td className="py-2 px-3 text-right">{mol.currentWeight.toFixed(2)}%</td>
                            <td className={`py-2 px-3 text-right font-semibold ${getStatusColor(mol.status)}`}>
                              {mol.drift > 0 ? '+' : ''}{mol.drift.toFixed(2)}%
                            </td>
                            <td className="py-2 px-3 text-center">
                              {mol.driftDirection === 'over' ? (
                                <Badge variant="outline" className="text-destructive">Over</Badge>
                              ) : mol.driftDirection === 'under' ? (
                                <Badge variant="outline" className="text-blue-500">Under</Badge>
                              ) : (
                                <Badge variant="outline" className="text-green-500">Target</Badge>
                              )}
                            </td>
                            <td className="py-2 px-3 text-right">{mol.ptrs.toFixed(1)}%</td>
                            <td className="py-2 px-3 text-center">
                              <Badge 
                                variant="outline"
                                className={getStatusColor(mol.status)}
                              >
                                {mol.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PTRSDriftMonitoring;
