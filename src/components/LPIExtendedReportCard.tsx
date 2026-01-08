// LPI Extended Report Card - Feature Category Breakdown, Category Weight vs Performance, TA Launch Probability Comparison
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend
} from "recharts";
import { 
  FlaskConical, 
  Building2, 
  TrendingUp, 
  Shield, 
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { calculateLPI3ForMolecule, type FeatureCategory } from "@/lib/lpi3Model";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
}

interface LPIExtendedReportCardProps {
  molecule: MoleculeProfile;
}

const getCategoryIcon = (name: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'Scientific / Preclinical': <FlaskConical className="h-5 w-5" />,
    'Clinical Signals': <Target className="h-5 w-5" />,
    'Regulatory & Program': <FileCheck2 className="h-5 w-5" />,
    'Sponsor / Organization': <Building2 className="h-5 w-5" />,
    'Market & Commercial': <TrendingUp className="h-5 w-5" />,
    'Safety & History': <Shield className="h-5 w-5" />,
  };
  return iconMap[name] || <Info className="h-5 w-5" />;
};

const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
  if (score >= 0.67) return 'default';
  if (score >= 0.34) return 'secondary';
  return 'destructive';
};

const FeatureCategoryCard = ({ category }: { category: FeatureCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const avgScore = category.features.reduce((sum, f) => sum + f.value, 0) / category.features.length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border border-border/50">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getCategoryIcon(category.name)}
                </div>
                <div>
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription className="text-xs">{category.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={getScoreBadgeVariant(avgScore)}>
                  {(avgScore * 100).toFixed(0)}%
                </Badge>
                <span className="text-xs text-muted-foreground">Weight: {category.categoryWeight}%</span>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {category.features.map((feature, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{feature.name}</span>
                    {feature.impact === 'positive' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    {feature.impact === 'negative' && <AlertTriangle className="h-3 w-3 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {feature.rawValue && (
                      <span className="text-xs text-muted-foreground">{feature.rawValue}</span>
                    )}
                    <span className="font-mono text-xs">{(feature.value * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <Progress value={feature.value * 100} className="h-1.5" />
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export function LPIExtendedReportCard({ molecule }: LPIExtendedReportCardProps) {
  const prediction = useMemo(() => {
    return calculateLPI3ForMolecule(molecule);
  }, [molecule]);

  // Data for category weight vs performance bar chart
  const categoryImportance = prediction.featureCategories.map(cat => ({
    name: cat.name.split('/')[0].split(' ')[0],
    weight: cat.categoryWeight,
    score: (cat.features.reduce((sum, f) => sum + f.value * f.importance, 0) / 
            cat.features.reduce((sum, f) => sum + f.importance, 0)) * 100,
  }));

  // TA Launch Probability Comparison data
  const taComparisonData = [
    { name: molecule.name.split(' ')[0], probability: prediction.calibratedProbability * 100, type: 'current' },
    { name: `${molecule.therapeuticArea} Avg`, probability: 45, type: 'ta-avg' },
    { name: 'All TAs Avg', probability: 38, type: 'all-avg' },
  ];

  return (
    <div className="space-y-6">
      {/* Feature Category Breakdown */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Feature Category Breakdown</CardTitle>
          <CardDescription>Detailed analysis of each feature category contributing to the LPI score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {prediction.featureCategories.map((category, idx) => (
              <FeatureCategoryCard key={idx} category={category} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Weight vs Performance */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Category Weight vs Performance</CardTitle>
          <CardDescription>How each feature category contributes to the final score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryImportance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name === 'weight' ? 'Category Weight' : 'Score']}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="weight" name="Weight" fill="hsl(var(--muted-foreground))" opacity={0.5} />
                <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* TA Launch Probability Comparison */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">TA Launch Probability Comparison</CardTitle>
          <CardDescription>Compare this molecule's launch probability against therapeutic area and overall averages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="probability" name="Launch Probability" radius={[0, 4, 4, 0]}>
                  {taComparisonData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'current' 
                        ? entry.probability >= 60 ? 'hsl(142, 76%, 36%)' : entry.probability >= 30 ? 'hsl(48, 96%, 53%)' : 'hsl(0, 84%, 60%)'
                        : 'hsl(var(--muted-foreground))'
                      }
                      opacity={entry.type === 'current' ? 1 : 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
