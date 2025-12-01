import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus, Target, Users, DollarSign } from "lucide-react";

export interface Competitor {
  name: string;
  company: string;
  phase: string;
  mechanism: string;
  keyDifferentiator: string;
  efficacy?: string;
  marketShare?: number;
  launchDate?: string;
  threat: 'high' | 'medium' | 'low';
}

export interface CompetitiveLandscape {
  totalMarketSize: string;
  projectedGrowth: string;
  keyPlayers: Competitor[];
  competitiveAdvantages: string[];
  competitiveRisks: string[];
  marketPositioning: string;
}

interface CompetitiveAnalysisProps {
  moleculeName: string;
  landscape: CompetitiveLandscape;
}

export function CompetitiveAnalysis({ moleculeName, landscape }: CompetitiveAnalysisProps) {
  const getThreatColor = (threat: Competitor['threat']) => {
    switch (threat) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getThreatIcon = (threat: Competitor['threat']) => {
    switch (threat) {
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'medium': return <Minus className="h-4 w-4" />;
      case 'low': return <TrendingDown className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Competitive Analysis - {moleculeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Market Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{landscape.totalMarketSize}</p>
            <p className="text-xs text-muted-foreground">Total Market Size</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto text-green-400 mb-2" />
            <p className="text-2xl font-bold text-green-400">{landscape.projectedGrowth}</p>
            <p className="text-xs text-muted-foreground">Projected CAGR</p>
          </div>
          <div className="bg-secondary/10 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 mx-auto text-secondary-foreground mb-2" />
            <p className="text-2xl font-bold">{landscape.keyPlayers.length}</p>
            <p className="text-xs text-muted-foreground">Key Competitors</p>
          </div>
          <div className="bg-chart-4/10 rounded-lg p-4 text-center">
            <Target className="h-6 w-6 mx-auto text-chart-4 mb-2" />
            <p className="text-2xl font-bold">{landscape.keyPlayers.filter(c => c.threat === 'high').length}</p>
            <p className="text-xs text-muted-foreground">High Threat</p>
          </div>
        </div>

        {/* Market Positioning */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Market Positioning</h4>
          <p className="text-sm text-muted-foreground">{landscape.marketPositioning}</p>
        </div>

        {/* Competitor Table */}
        <div>
          <h4 className="text-sm font-semibold mb-3">Competitive Landscape</h4>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Drug / Company</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Mechanism</TableHead>
                  <TableHead>Key Differentiator</TableHead>
                  <TableHead>Efficacy</TableHead>
                  <TableHead>Threat Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {landscape.keyPlayers.map((competitor, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{competitor.name}</p>
                        <p className="text-xs text-muted-foreground">{competitor.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{competitor.phase}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{competitor.mechanism}</TableCell>
                    <TableCell className="text-sm max-w-[200px]">{competitor.keyDifferentiator}</TableCell>
                    <TableCell className="text-sm">{competitor.efficacy || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getThreatColor(competitor.threat)}>
                        {getThreatIcon(competitor.threat)}
                        <span className="ml-1">{competitor.threat}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* SWOT-style Analysis */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Competitive Advantages
            </h4>
            <ul className="space-y-2">
              {landscape.competitiveAdvantages.map((advantage, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Competitive Risks
            </h4>
            <ul className="space-y-2">
              {landscape.competitiveRisks.map((risk, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
