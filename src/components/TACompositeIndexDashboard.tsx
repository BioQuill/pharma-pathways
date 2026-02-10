import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllTACompositeIndexes, TACompositeIndex, LaunchFactor } from "@/lib/taCompositeIndex";
import { TrendingUp, Clock, Target, AlertTriangle, CheckCircle, Beaker, BarChart3, Grid3X3, Radar } from "lucide-react";
import { TAComparisonChart, TAApprovalTimeChart } from "./TAComparisonChart";
import { TARiskFactorHeatmap, TAFactorSummaryTable } from "./TARiskFactorHeatmap";
import TARadarComparison from "./TARadarComparison";

const getScoreColor = (score: number): string => {
  if (score >= 70) return "text-green-600";
  if (score >= 55) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
  if (score >= 70) return "default";
  if (score >= 55) return "secondary";
  return "destructive";
};

const getImpactLabel = (impact: number): string => {
  switch (impact) {
    case 5: return "Critical";
    case 4: return "High";
    case 3: return "Moderate";
    case 2: return "Low";
    case 1: return "Minor";
    default: return "Unknown";
  }
};

const getImpactColor = (impact: number): string => {
  switch (impact) {
    case 5: return "bg-red-500";
    case 4: return "bg-orange-500";
    case 3: return "bg-yellow-500";
    case 2: return "bg-blue-500";
    case 1: return "bg-gray-500";
    default: return "bg-gray-300";
  }
};

const TA_ICONS: Record<string, React.ReactNode> = {
  'ONCOLOGY/HEMATOLOGY': <Target className="h-4 w-4" />,
  'CARDIOVASCULAR': <TrendingUp className="h-4 w-4" />,
  'NEUROLOGY/CNS': <Beaker className="h-4 w-4" />,
  'RARE DISEASES/ORPHAN': <AlertTriangle className="h-4 w-4" />,
  'TRANSPLANT/CELL-GENE': <CheckCircle className="h-4 w-4" />,
};

function FactorRow({ factor }: { factor: LaunchFactor }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
      <div className={`w-2 h-2 rounded-full ${getImpactColor(factor.impact)}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{factor.name}</p>
      </div>
      <Badge variant="outline" className="text-xs">
        Impact {factor.impact}
      </Badge>
      <div className="w-16 text-right">
        <span className="text-sm font-medium">{factor.adjustedWeight.toFixed(1)}%</span>
      </div>
      {factor.multiplier !== 1.0 && (
        <Badge className="bg-primary/10 text-primary text-xs">
          ×{factor.multiplier.toFixed(1)}
        </Badge>
      )}
    </div>
  );
}

function TACard({ taIndex }: { taIndex: TACompositeIndex }) {
  const criticalFactors = taIndex.factors.filter(f => f.impact === 5);
  const highFactors = taIndex.factors.filter(f => f.impact === 4);
  const otherFactors = taIndex.factors.filter(f => f.impact <= 3);
  const modifiedFactors = taIndex.factors.filter(f => f.multiplier !== 1.0);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {TA_ICONS[taIndex.ta] || <Beaker className="h-4 w-4" />}
            <CardTitle className="text-sm font-semibold">{taIndex.ta}</CardTitle>
          </div>
          <Badge variant={getScoreBadgeVariant(taIndex.compositeScore)} className="text-lg px-3">
            {taIndex.compositeScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Composite Score Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Composite Score</span>
            <span className={getScoreColor(taIndex.compositeScore)}>{taIndex.compositeScore}%</span>
          </div>
          <Progress value={taIndex.compositeScore} className="h-2" />
        </div>

        {/* Approval Times */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">FDA:</span>
            <span className="font-medium">{taIndex.avgApprovalTimeFDA}mo</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">EMA:</span>
            <span className="font-medium">{taIndex.avgApprovalTimeEMA}mo</span>
          </div>
        </div>

        {/* Modified Factors Highlight */}
        {modifiedFactors.length > 0 && (
          <div className="bg-primary/5 rounded-lg p-2">
            <p className="text-xs font-medium text-primary mb-1">TA-Specific Multipliers</p>
            <div className="space-y-1">
              {modifiedFactors.map(f => (
                <div key={f.name} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">{f.name}</span>
                  <Badge className="bg-primary/20 text-primary text-xs">×{f.multiplier.toFixed(1)}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Factor Details */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="factors" className="border-0">
            <AccordionTrigger className="text-xs py-2 hover:no-underline">
              View All {taIndex.factors.length} Risk Factors
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {/* Critical Factors */}
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">Critical (Impact 5)</p>
                  <div className="bg-red-50 dark:bg-red-950/20 rounded p-2">
                    {criticalFactors.map(f => (
                      <FactorRow key={f.name} factor={f} />
                    ))}
                  </div>
                </div>

                {/* High Impact Factors */}
                <div>
                  <p className="text-xs font-semibold text-orange-600 mb-1">High (Impact 4)</p>
                  <div className="bg-orange-50 dark:bg-orange-950/20 rounded p-2">
                    {highFactors.map(f => (
                      <FactorRow key={f.name} factor={f} />
                    ))}
                  </div>
                </div>

                {/* Other Factors */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Other (Impact 1-3)</p>
                  <div className="bg-muted/50 rounded p-2">
                    {otherFactors.map(f => (
                      <FactorRow key={f.name} factor={f} />
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function TACompositeIndexDashboard() {
  const allTAIndexes = getAllTACompositeIndexes();
  
  // Sort by composite score descending
  const sortedIndexes = [...allTAIndexes].sort((a, b) => b.compositeScore - a.compositeScore);

  // Group by score tiers
  const highPerformers = sortedIndexes.filter(ta => ta.compositeScore >= 70);
  const mediumPerformers = sortedIndexes.filter(ta => ta.compositeScore >= 55 && ta.compositeScore < 70);
  const challengingTAs = sortedIndexes.filter(ta => ta.compositeScore < 55);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">TA-Specific Composite Risk Indexes</h2>
          <p className="text-sm text-muted-foreground">
            20 therapeutic areas with weighted risk factors and historical success data
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            High ({highPerformers.length})
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            Medium ({mediumPerformers.length})
          </Badge>
          <Badge variant="destructive" className="gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Challenging ({challengingTAs.length})
          </Badge>
        </div>
      </div>

      {/* Charts and Heatmap Tabs */}
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-sky-100 dark:bg-sky-950/30">
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Success Rates
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Approval Times
          </TabsTrigger>
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Radar className="h-4 w-4" />
            Radar Compare
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Factor Heatmap
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Factor Summary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="comparison" className="mt-4">
          <TAComparisonChart />
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <TAApprovalTimeChart />
        </TabsContent>
        <TabsContent value="radar" className="mt-4">
          <TARadarComparison />
        </TabsContent>
        <TabsContent value="heatmap" className="mt-4">
          <TARiskFactorHeatmap />
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <TAFactorSummaryTable />
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
          <CardContent className="p-4">
            <p className="text-xs text-green-600 font-medium">Highest Success Rate</p>
            <p className="text-lg font-bold text-green-700">{sortedIndexes[0]?.ta}</p>
            <p className="text-2xl font-bold text-green-600">{sortedIndexes[0]?.compositeScore}%</p>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200">
          <CardContent className="p-4">
            <p className="text-xs text-red-600 font-medium">Most Challenging</p>
            <p className="text-lg font-bold text-red-700">{sortedIndexes[sortedIndexes.length - 1]?.ta}</p>
            <p className="text-2xl font-bold text-red-600">{sortedIndexes[sortedIndexes.length - 1]?.compositeScore}%</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs text-blue-600 font-medium">Fastest FDA Approval</p>
            <p className="text-lg font-bold text-blue-700">Rare Diseases</p>
            <p className="text-2xl font-bold text-blue-600">10 months</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200">
          <CardContent className="p-4">
            <p className="text-xs text-purple-600 font-medium">Avg Across All TAs</p>
            <p className="text-lg font-bold text-purple-700">Success Rate</p>
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(sortedIndexes.reduce((sum, ta) => sum + ta.compositeScore, 0) / sortedIndexes.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* High Performers */}
      {highPerformers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            High Success Rate TAs (≥70%)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPerformers.map(ta => (
              <TACard key={ta.ta} taIndex={ta} />
            ))}
          </div>
        </div>
      )}

      {/* Medium Performers */}
      {mediumPerformers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            Medium Success Rate TAs (55-69%)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediumPerformers.map(ta => (
              <TACard key={ta.ta} taIndex={ta} />
            ))}
          </div>
        </div>
      )}

      {/* Challenging TAs */}
      {challengingTAs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            Challenging TAs (&lt;55%)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {challengingTAs.map(ta => (
              <TACard key={ta.ta} taIndex={ta} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
