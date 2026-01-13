import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, ComposedChart } from 'recharts';
import { History, TrendingUp, TrendingDown, Download, Calendar, Target, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { type MoleculeProfile } from '@/lib/moleculesData';

interface PTRSRebalancingHistoryProps {
  molecules: MoleculeProfile[];
}

interface RebalancingEvent {
  id: string;
  date: string;
  trigger: 'scheduled' | 'threshold' | 'market' | 'manual';
  triggerDetails: string;
  moleculesAffected: number;
  totalTrades: number;
  portfolioValueBefore: number;
  portfolioValueAfter: number;
  ptrsChangeBefore: number;
  ptrsChangeAfter: number;
  trades: TradeRecord[];
  outcome: 'positive' | 'negative' | 'neutral';
  returnSinceRebalance: number;
}

interface TradeRecord {
  molecule: string;
  action: 'buy' | 'sell' | 'hold';
  weightBefore: number;
  weightAfter: number;
  reason: string;
  ptrsAtTrade: number;
  currentPtrs: number;
}

interface PerformanceMetrics {
  totalRebalances: number;
  successRate: number;
  avgReturnPerRebalance: number;
  bestRebalance: { date: string; return: number };
  worstRebalance: { date: string; return: number };
  avgTimeBetweenRebalances: number;
  totalValueAdded: number;
}

const PTRSRebalancingHistory: React.FC<PTRSRebalancingHistoryProps> = ({ molecules }) => {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('1y');
  const [selectedEvent, setSelectedEvent] = useState<RebalancingEvent | null>(null);

  // Generate mock historical rebalancing data
  const historicalEvents = useMemo<RebalancingEvent[]>(() => {
    const events: RebalancingEvent[] = [];
    const triggers: Array<'scheduled' | 'threshold' | 'market' | 'manual'> = ['scheduled', 'threshold', 'market', 'manual'];
    const triggerDetails: Record<string, string[]> = {
      scheduled: ['Quarterly rebalance', 'Monthly review', 'Annual portfolio reset'],
      threshold: ['Weight drift >5%', 'PTRS change >10%', 'Risk threshold breach'],
      market: ['FDA approval announcement', 'Trial results release', 'Competitor setback'],
      manual: ['Strategic adjustment', 'New molecule addition', 'Risk reduction']
    };

    const sampleMolecules = molecules.slice(0, 15);

    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const trigger = triggers[Math.floor(Math.random() * triggers.length)];
      const details = triggerDetails[trigger][Math.floor(Math.random() * triggerDetails[trigger].length)];
      
      const trades: TradeRecord[] = [];
      const numTrades = Math.floor(Math.random() * 5) + 2;
      
      for (let j = 0; j < numTrades; j++) {
        const mol = sampleMolecules[Math.floor(Math.random() * sampleMolecules.length)];
        const actions: Array<'buy' | 'sell' | 'hold'> = ['buy', 'sell', 'hold'];
        const action = actions[Math.floor(Math.random() * 3)];
        const weightBefore = Math.random() * 15 + 2;
        const weightChange = action === 'buy' ? Math.random() * 5 : action === 'sell' ? -Math.random() * 5 : 0;
        
        trades.push({
          molecule: mol.name,
          action,
          weightBefore,
          weightAfter: Math.max(0, weightBefore + weightChange),
          reason: action === 'buy' ? 'PTRS improvement' : action === 'sell' ? 'Risk reduction' : 'Stable position',
          ptrsAtTrade: Math.random() * 30 + 50,
          currentPtrs: Math.random() * 30 + 50
        });
      }

      const returnValue = (Math.random() - 0.4) * 20;
      
      events.push({
        id: `event-${i}`,
        date: date.toISOString().split('T')[0],
        trigger,
        triggerDetails: details,
        moleculesAffected: numTrades,
        totalTrades: numTrades,
        portfolioValueBefore: 100000000 + Math.random() * 50000000,
        portfolioValueAfter: 100000000 + Math.random() * 50000000,
        ptrsChangeBefore: Math.random() * 20 + 60,
        ptrsChangeAfter: Math.random() * 20 + 60,
        trades,
        outcome: returnValue > 2 ? 'positive' : returnValue < -2 ? 'negative' : 'neutral',
        returnSinceRebalance: returnValue
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case '3m':
        cutoff.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        cutoff.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        cutoff.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return historicalEvents;
    }

    return historicalEvents.filter(e => new Date(e.date) >= cutoff);
  }, [historicalEvents, timeRange]);

  const performanceMetrics = useMemo<PerformanceMetrics>(() => {
    if (filteredEvents.length === 0) {
      return {
        totalRebalances: 0,
        successRate: 0,
        avgReturnPerRebalance: 0,
        bestRebalance: { date: '', return: 0 },
        worstRebalance: { date: '', return: 0 },
        avgTimeBetweenRebalances: 0,
        totalValueAdded: 0
      };
    }

    const successCount = filteredEvents.filter(e => e.outcome === 'positive').length;
    const totalReturn = filteredEvents.reduce((sum, e) => sum + e.returnSinceRebalance, 0);
    const best = filteredEvents.reduce((max, e) => e.returnSinceRebalance > max.returnSinceRebalance ? e : max);
    const worst = filteredEvents.reduce((min, e) => e.returnSinceRebalance < min.returnSinceRebalance ? e : min);

    const dates = filteredEvents.map(e => new Date(e.date).getTime()).sort((a, b) => a - b);
    let totalDays = 0;
    for (let i = 1; i < dates.length; i++) {
      totalDays += (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
    }

    return {
      totalRebalances: filteredEvents.length,
      successRate: (successCount / filteredEvents.length) * 100,
      avgReturnPerRebalance: totalReturn / filteredEvents.length,
      bestRebalance: { date: best.date, return: best.returnSinceRebalance },
      worstRebalance: { date: worst.date, return: worst.returnSinceRebalance },
      avgTimeBetweenRebalances: dates.length > 1 ? totalDays / (dates.length - 1) : 0,
      totalValueAdded: totalReturn * 1000000
    };
  }, [filteredEvents]);

  const cumulativePerformance = useMemo(() => {
    let cumulative = 0;
    return [...filteredEvents].reverse().map(event => {
      cumulative += event.returnSinceRebalance;
      return {
        date: event.date,
        return: event.returnSinceRebalance,
        cumulative,
        ptrs: event.ptrsChangeAfter
      };
    });
  }, [filteredEvents]);

  const triggerDistribution = useMemo(() => {
    const distribution: Record<string, { count: number; avgReturn: number }> = {};
    
    filteredEvents.forEach(event => {
      if (!distribution[event.trigger]) {
        distribution[event.trigger] = { count: 0, avgReturn: 0 };
      }
      distribution[event.trigger].count++;
      distribution[event.trigger].avgReturn += event.returnSinceRebalance;
    });

    return Object.entries(distribution).map(([trigger, data]) => ({
      trigger: trigger.charAt(0).toUpperCase() + trigger.slice(1),
      count: data.count,
      avgReturn: data.avgReturn / data.count
    }));
  }, [filteredEvents]);

  const getTriggerBadge = (trigger: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-500/20 text-blue-400',
      threshold: 'bg-yellow-500/20 text-yellow-400',
      market: 'bg-purple-500/20 text-purple-400',
      manual: 'bg-gray-500/20 text-gray-400'
    };
    return colors[trigger] || 'bg-gray-500/20 text-gray-400';
  };

  const getOutcomeBadge = (outcome: string) => {
    const colors: Record<string, string> = {
      positive: 'bg-green-500/20 text-green-400',
      negative: 'bg-red-500/20 text-red-400',
      neutral: 'bg-gray-500/20 text-gray-400'
    };
    return colors[outcome] || 'bg-gray-500/20 text-gray-400';
  };

  const handleDownloadPDF = async () => {
    const { exportDomToPDF } = await import('@/lib/pdfGenerator');
    await exportDomToPDF(
      'rebalancing-history-content',
      `rebalancing-history-${new Date().toISOString().split('T')[0]}.pdf`,
      { orientation: 'landscape' }
    );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Rebalancing History & Performance</CardTitle>
              <CardDescription>Track past rebalancing decisions and measure portfolio outcomes</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(v: '3m' | '6m' | '1y' | 'all') => setTimeRange(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent id="rebalancing-history-content">
        {/* Performance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{performanceMetrics.totalRebalances}</div>
              <div className="text-xs text-muted-foreground">Total Rebalances</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{performanceMetrics.successRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${performanceMetrics.avgReturnPerRebalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {performanceMetrics.avgReturnPerRebalance >= 0 ? '+' : ''}{performanceMetrics.avgReturnPerRebalance.toFixed(2)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Return</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">+{performanceMetrics.bestRebalance.return.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Best Rebalance</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{performanceMetrics.worstRebalance.return.toFixed(2)}%</div>
              <div className="text-xs text-muted-foreground">Worst Rebalance</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{performanceMetrics.avgTimeBetweenRebalances.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Avg Days Between</div>
            </CardContent>
          </Card>
          <Card className="bg-background/50">
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${performanceMetrics.totalValueAdded >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${(Math.abs(performanceMetrics.totalValueAdded) / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Value Added</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Performance Timeline</TabsTrigger>
            <TabsTrigger value="events">Event History</TabsTrigger>
            <TabsTrigger value="analysis">Trigger Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Cumulative Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cumulativePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.3}
                          name="Cumulative Return %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Individual Rebalance Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={cumulativePerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis yAxisId="left" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: '#888', fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="return" 
                          fill="#22c55e"
                          name="Return %"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="ptrs" 
                          stroke="#a855f7" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          name="Portfolio PTRS"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-4">
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Date</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-center">Trades</TableHead>
                      <TableHead className="text-center">PTRS Change</TableHead>
                      <TableHead className="text-center">Return</TableHead>
                      <TableHead className="text-center">Outcome</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map(event => (
                      <TableRow key={event.id} className="hover:bg-muted/20">
                        <TableCell className="font-mono text-sm">{event.date}</TableCell>
                        <TableCell>
                          <Badge className={getTriggerBadge(event.trigger)}>
                            {event.trigger}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{event.triggerDetails}</TableCell>
                        <TableCell className="text-center">{event.totalTrades}</TableCell>
                        <TableCell className="text-center">
                          <span className={event.ptrsChangeAfter >= event.ptrsChangeBefore ? 'text-green-400' : 'text-red-400'}>
                            {event.ptrsChangeBefore.toFixed(1)} → {event.ptrsChangeAfter.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={event.returnSinceRebalance >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {event.returnSinceRebalance >= 0 ? '+' : ''}{event.returnSinceRebalance.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getOutcomeBadge(event.outcome)}>
                            {event.outcome === 'positive' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : 
                             event.outcome === 'negative' ? <AlertTriangle className="h-3 w-3 mr-1" /> : null}
                            {event.outcome}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedEvent && (
                <Card className="bg-background/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Trade Details - {selectedEvent.date}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>Close</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Molecule</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Weight Change</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>PTRS at Trade</TableHead>
                          <TableHead>Current PTRS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.trades.map((trade, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{trade.molecule}</TableCell>
                            <TableCell>
                              <Badge className={
                                trade.action === 'buy' ? 'bg-green-500/20 text-green-400' :
                                trade.action === 'sell' ? 'bg-red-500/20 text-red-400' :
                                'bg-gray-500/20 text-gray-400'
                              }>
                                {trade.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {trade.weightBefore.toFixed(1)}% → {trade.weightAfter.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-muted-foreground">{trade.reason}</TableCell>
                            <TableCell>{trade.ptrsAtTrade.toFixed(1)}%</TableCell>
                            <TableCell className={trade.currentPtrs >= trade.ptrsAtTrade ? 'text-green-400' : 'text-red-400'}>
                              {trade.currentPtrs.toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Rebalance Count by Trigger Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={triggerDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis dataKey="trigger" type="category" tick={{ fill: '#888', fontSize: 10 }} width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                          labelStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="count" fill="#3b82f6" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Return by Trigger Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={triggerDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} />
                        <YAxis dataKey="trigger" type="category" tick={{ fill: '#888', fontSize: 10 }} width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #333' }}
                          labelStyle={{ color: '#fff' }}
                          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Avg Return']}
                        />
                        <Bar 
                          dataKey="avgReturn" 
                          fill="#22c55e" 
                          name="Avg Return %"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-background/50 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-green-400" />
                        <span className="font-medium text-green-400">Best Performing Trigger</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {triggerDistribution.length > 0 
                          ? `${triggerDistribution.reduce((best, t) => t.avgReturn > best.avgReturn ? t : best).trigger} with ${triggerDistribution.reduce((best, t) => t.avgReturn > best.avgReturn ? t : best).avgReturn.toFixed(2)}% avg return`
                          : 'No data available'}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-blue-400" />
                        <span className="font-medium text-blue-400">Optimal Frequency</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Rebalancing every {performanceMetrics.avgTimeBetweenRebalances.toFixed(0)} days on average
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <span className="font-medium text-purple-400">Success Pattern</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {performanceMetrics.successRate >= 60 
                          ? 'Strategy is performing well with high success rate'
                          : 'Consider adjusting rebalancing criteria for better outcomes'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PTRSRebalancingHistory;
