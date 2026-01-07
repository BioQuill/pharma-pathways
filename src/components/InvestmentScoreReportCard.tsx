// Investment Score Report Card - Compact version for Full DD Report
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, ShieldCheck, FlaskConical, FileCheck2, Building2 } from "lucide-react";
import { calculateLPI2ForMolecule, type LPI2Prediction, type LPI2Factor } from "@/lib/lpi2Model";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  indication: string;
  company: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
}

interface InvestmentScoreReportCardProps {
  molecule: MoleculeProfile;
}

const getFactorIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Biological Plausibility': <FlaskConical className="h-4 w-4" />,
    'Translational Evidence': <ShieldCheck className="h-4 w-4" />,
    'Clinical Readiness': <TrendingUp className="h-4 w-4" />,
    'Regulatory Attractiveness': <FileCheck2 className="h-4 w-4" />,
    'Team & Sponsor': <Building2 className="h-4 w-4" />,
  };
  return iconMap[name] || <TrendingUp className="h-4 w-4" />;
};

const getScoreColor = (score: number): string => {
  if (score >= 75) return 'text-[hsl(142,76%,36%)]';
  if (score >= 60) return 'text-[hsl(45,93%,47%)]';
  if (score >= 45) return 'text-[hsl(48,96%,53%)]';
  return 'text-[hsl(0,72%,51%)]';
};

const getScoreBgColor = (score: number): string => {
  if (score >= 75) return 'bg-[hsl(142,76%,36%)]';
  if (score >= 60) return 'bg-[hsl(45,93%,47%)]';
  if (score >= 45) return 'bg-[hsl(48,96%,53%)]';
  return 'bg-[hsl(0,72%,51%)]';
};

const getRecommendationBadge = (recommendation: string) => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Strong Buy': 'default',
    'Buy': 'secondary',
    'Hold': 'outline',
    'Pass': 'destructive',
  };
  return <Badge variant={variants[recommendation] || 'outline'}>{recommendation}</Badge>;
};

const getRiskBadge = (riskLevel: string) => {
  const colors: Record<string, string> = {
    'Low': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'High': 'bg-orange-100 text-orange-800',
    'Very High': 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[riskLevel] || colors['Medium']}`}>
      {riskLevel} Risk
    </span>
  );
};

export function InvestmentScoreReportCard({ molecule }: InvestmentScoreReportCardProps) {
  const prediction = useMemo(() => {
    return calculateLPI2ForMolecule({
      id: molecule.id,
      name: molecule.name,
      phase: molecule.phase,
      indication: molecule.indication || molecule.therapeuticArea,
      therapeuticArea: molecule.therapeuticArea,
      company: molecule.company,
      companyTrackRecord: molecule.companyTrackRecord || 'average',
    });
  }, [molecule]);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">Investment Score Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">5-Factor Investment Model (VC / Investment Model)</p>
          </div>
          <div className="text-right">
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${getScoreBgColor(prediction.totalScore)}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="text-xl font-bold" style={{ lineHeight: '1.2' }}>
                  {prediction.totalScore}
                </div>
                <div className="text-[10px] opacity-90" style={{ lineHeight: '1.2' }}>Score</div>
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

        {/* Factor Breakdown */}
        <div className="space-y-3">
          {prediction.factors.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{getFactorIcon(factor.name)}</span>
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-xs text-muted-foreground">({factor.weight}%)</span>
                </div>
                <span className={`font-semibold ${getScoreColor(factor.score)}`}>
                  {Math.round(factor.score)}
                </span>
              </div>
              <Progress 
                value={factor.score} 
                className="h-1.5"
              />
            </div>
          ))}
        </div>

        {/* Sub-factors for top 2 factors */}
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold mb-2">Key Sub-Factor Details</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {prediction.factors.slice(0, 2).flatMap(factor => 
              factor.subFactors.map((sub, subIdx) => (
                <div key={`${factor.name}-${subIdx}`} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{sub.name}</span>
                  <span className={`font-mono ${getScoreColor(sub.score)}`}>
                    {Math.round(sub.score)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
