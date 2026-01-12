import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { runMonteCarloSimulation, ComponentUncertainty } from '@/lib/monteCarloSimulation';

interface InvestmentFactor {
  name: string;
  score: number;
  weight: number;
  subFactors: { name: string; score: number }[];
}

interface InvestmentPrediction {
  totalScore: number;
  recommendation: string;
  riskLevel: string;
  investmentReadiness: string;
  factors: InvestmentFactor[];
}

interface InvestmentScoreMonteCarloCardProps {
  prediction: InvestmentPrediction;
  moleculeName?: string;
}

const InvestmentScoreMonteCarloCard: React.FC<InvestmentScoreMonteCarloCardProps> = ({ 
  prediction,
  moleculeName = 'Selected Molecule'
}) => {
  // Convert investment factors to Monte Carlo component scores
  const componentScores: ComponentUncertainty[] = useMemo(() => {
    return prediction.factors.map(factor => {
      const uncertaintyPct = 8 + Math.random() * 7; // 8-15% uncertainty
      return {
        name: factor.name,
        baseScore: factor.score,
        minScore: Math.max(0, factor.score - uncertaintyPct),
        maxScore: Math.min(100, factor.score + uncertaintyPct),
        weight: factor.weight / 100
      };
    });
  }, [prediction.factors]);

  // Run Monte Carlo simulation
  const simulation = useMemo(() => {
    return runMonteCarloSimulation(componentScores, {
      iterations: 5000,
      uncertaintyRange: 15,
      confidenceInterval: 90
    });
  }, [componentScores]);

  // Generate distribution data for chart
  const distributionData = useMemo(() => {
    const bins: { score: number; frequency: number }[] = [];
    const minScore = Math.floor(simulation.statistics.min);
    const maxScore = Math.ceil(simulation.statistics.max);
    const binSize = (maxScore - minScore) / 25;

    for (let i = minScore; i <= maxScore; i += binSize) {
      const count = simulation.compositeScoreDistribution.filter(
        s => s >= i && s < i + binSize
      ).length;
      bins.push({
        score: Math.round(i),
        frequency: (count / simulation.compositeScoreDistribution.length) * 100
      });
    }
    return bins;
  }, [simulation]);

  // Calculate probability thresholds
  const probabilities = useMemo(() => {
    const scores = simulation.compositeScoreDistribution;
    const total = scores.length;
    
    return {
      prob80Plus: ((scores.filter(s => s >= 80).length / total) * 100).toFixed(1),
      prob70Plus: ((scores.filter(s => s >= 70).length / total) * 100).toFixed(1),
      prob60Plus: ((scores.filter(s => s >= 60).length / total) * 100).toFixed(1),
      probStrongBuy: ((scores.filter(s => s >= 85).length / total) * 100).toFixed(1)
    };
  }, [simulation]);

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-[hsl(142,76%,36%)]';
    if (score >= 70) return 'bg-[hsl(142,50%,50%)]';
    if (score >= 55) return 'bg-[hsl(45,93%,47%)]';
    return 'bg-[hsl(0,72%,51%)]';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[hsl(142,76%,36%)]';
    if (score >= 70) return 'text-[hsl(142,50%,50%)]';
    if (score >= 55) return 'text-[hsl(45,93%,47%)]';
    return 'text-[hsl(0,72%,51%)]';
  };

  const getRecommendationBadge = (rec: string) => {
    const colors: Record<string, string> = {
      'Strong Buy': 'bg-[hsl(142,76%,36%)] text-white',
      'Buy': 'bg-[hsl(142,50%,50%)] text-white',
      'Hold': 'bg-[hsl(45,93%,47%)] text-black',
      'Pass': 'bg-[hsl(0,72%,51%)] text-white'
    };
    return (
      <Badge className={colors[rec] || 'bg-muted'}>
        {rec}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const colors: Record<string, string> = {
      'Low': 'text-[hsl(142,76%,36%)] border-[hsl(142,76%,36%)]',
      'Medium': 'text-[hsl(45,93%,47%)] border-[hsl(45,93%,47%)]',
      'High': 'text-[hsl(0,72%,51%)] border-[hsl(0,72%,51%)]'
    };
    return (
      <Badge variant="outline" className={colors[risk] || ''}>
        {risk} Risk
      </Badge>
    );
  };

  const getFactorIcon = (name: string) => {
    if (name.includes('Biological')) return '🧬';
    if (name.includes('Translational')) return '🔬';
    if (name.includes('Clinical')) return '🏥';
    if (name.includes('Regulatory')) return '📋';
    if (name.includes('Team')) return '👥';
    return '📊';
  };

  return (
    <Card className="border-2 border-purple-500/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Investment Score + Monte Carlo Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">5-Factor Investment Model with Probabilistic Simulation</p>
          </div>
          <div className="text-right">
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${getScoreBgColor(prediction.totalScore)}`}
            >
              <div className="text-center">
                <div className="text-xl font-bold">{prediction.totalScore}</div>
                <div className="text-[10px] opacity-90">Score</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recommendation and Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getRecommendationBadge(prediction.recommendation)}
            {getRiskBadge(prediction.riskLevel)}
          </div>
          <p className="text-xs text-muted-foreground">{prediction.investmentReadiness}</p>
        </div>

        {/* Monte Carlo Distribution Chart */}
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Score Distribution (5,000 simulations)</span>
            </div>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={distributionData}>
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="score" 
                  tick={{ fontSize: 10 }} 
                  tickFormatter={(v) => `${v}`}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
                  labelFormatter={(label) => `Score: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine 
                  x={prediction.totalScore} 
                  stroke="hsl(270, 70%, 50%)" 
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <Area
                  type="monotone"
                  dataKey="frequency"
                  stroke="hsl(270, 70%, 60%)"
                  fill="url(#purpleGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monte Carlo Statistics */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Mean</p>
            <p className="text-lg font-bold text-purple-600">{simulation.statistics.mean.toFixed(1)}</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Std Dev</p>
            <p className="text-lg font-bold text-purple-600">±{simulation.statistics.stdDev.toFixed(1)}</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">5th %ile</p>
            <p className="text-lg font-bold text-purple-600">{simulation.percentiles.p5.toFixed(1)}</p>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">95th %ile</p>
            <p className="text-lg font-bold text-purple-600">{simulation.percentiles.p95.toFixed(1)}</p>
          </div>
        </div>

        {/* Probability Thresholds */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-[hsl(142,76%,36%)]/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">P(Strong Buy ≥85)</p>
            <p className="text-lg font-bold text-[hsl(142,76%,36%)]">{probabilities.probStrongBuy}%</p>
          </div>
          <div className="bg-[hsl(142,50%,50%)]/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">P(Buy ≥70)</p>
            <p className="text-lg font-bold text-[hsl(142,50%,50%)]">{probabilities.prob70Plus}%</p>
          </div>
          <div className="bg-[hsl(45,93%,47%)]/10 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">P(Hold ≥60)</p>
            <p className="text-lg font-bold text-[hsl(45,93%,47%)]">{probabilities.prob60Plus}%</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 text-center">
            <p className="text-xs text-muted-foreground">Confidence</p>
            <p className="text-lg font-bold">90%</p>
          </div>
        </div>

        {/* Factor Breakdown with Uncertainty */}
        <div className="space-y-3">
          {prediction.factors.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">{getFactorIcon(factor.name)}</span>
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-xs text-muted-foreground">({factor.weight}%)</span>
                </div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${getScoreColor(factor.score)}`}>
                  {Math.round(factor.score)}
                </span>
                <span className="text-xs text-purple-500">
                  ±{((componentScores[idx]?.maxScore || factor.score + 10) - factor.score).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="relative">
              <Progress 
                value={factor.score} 
                className="h-1.5"
              />
              {/* Uncertainty overlay */}
              <div 
                className="absolute top-0 h-1.5 bg-purple-500/20 rounded-full"
                style={{ 
                  left: `${componentScores[idx]?.minScore || factor.score - 10}%`,
                  width: `${(componentScores[idx]?.maxScore || factor.score + 10) - (componentScores[idx]?.minScore || factor.score - 10)}%`
                }}
              />
            </div>
            </div>
          ))}
        </div>

        {/* Risk-Adjusted Insights */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-2 flex items-center gap-2">
            <Target className="h-3 w-3 text-purple-600" />
            Monte Carlo Risk Insights
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {simulation.statistics.riskAdjustedReturn.sharpeRatio > 1.5 ? (
                <CheckCircle className="h-3 w-3 text-green-600" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
              )}
              <span>Sharpe Ratio: {simulation.statistics.riskAdjustedReturn.sharpeRatio.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span>VaR (5%): {simulation.statistics.riskAdjustedReturn.valueAtRisk.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3 text-purple-600" />
              <span>Expected Shortfall: {simulation.statistics.riskAdjustedReturn.expectedShortfall.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={simulation.statistics.skewness > 0 ? 'text-green-600' : 'text-destructive'}>
                Skewness: {simulation.statistics.skewness.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentScoreMonteCarloCard;
