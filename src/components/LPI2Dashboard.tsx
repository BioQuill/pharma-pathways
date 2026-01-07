// LPI-2 Dashboard: 5-Factor Investment LPI Model (VC / Investment Model)
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Target,
  Building2,
  FlaskConical,
  FileCheck,
  Shield,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { calculateLPI2ForMolecule, LPI2_DATA_SOURCES, type LPI2Prediction, type LPI2Factor } from "@/lib/lpi2Model";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
}

interface LPI2DashboardProps {
  molecules: MoleculeProfile[];
}

// Factor icons mapping
const factorIcons: Record<string, React.ReactNode> = {
  'Biological Plausibility': <FlaskConical className="h-4 w-4" />,
  'Translational Evidence': <Target className="h-4 w-4" />,
  'Clinical Readiness': <FileCheck className="h-4 w-4" />,
  'Regulatory Attractiveness': <Shield className="h-4 w-4" />,
  'Team & Sponsor': <Users className="h-4 w-4" />,
};

// Score color helpers
function getScoreColor(score: number): string {
  if (score >= 75) return 'hsl(142, 76%, 36%)';
  if (score >= 60) return 'hsl(45, 93%, 47%)';
  if (score >= 45) return 'hsl(25, 95%, 53%)';
  return 'hsl(0, 72%, 51%)';
}

function getRecommendationBadge(recommendation: string) {
  const variants: Record<string, { bg: string; text: string }> = {
    'Strong Buy': { bg: 'bg-[hsl(142,76%,36%)]', text: 'text-white' },
    'Buy': { bg: 'bg-[hsl(142,50%,50%)]', text: 'text-white' },
    'Hold': { bg: 'bg-[hsl(45,93%,47%)]', text: 'text-black' },
    'Pass': { bg: 'bg-[hsl(0,72%,51%)]', text: 'text-white' },
  };
  const style = variants[recommendation] || variants['Hold'];
  return <Badge className={`${style.bg} ${style.text}`}>{recommendation}</Badge>;
}

function getRiskBadge(risk: string) {
  const variants: Record<string, { bg: string; text: string }> = {
    'Low': { bg: 'bg-[hsl(142,76%,36%)]', text: 'text-white' },
    'Medium': { bg: 'bg-[hsl(45,93%,47%)]', text: 'text-black' },
    'High': { bg: 'bg-[hsl(25,95%,53%)]', text: 'text-white' },
    'Very High': { bg: 'bg-[hsl(0,72%,51%)]', text: 'text-white' },
  };
  const style = variants[risk] || variants['Medium'];
  return <Badge className={`${style.bg} ${style.text}`}>{risk} Risk</Badge>;
}

// Factor Card Component
function FactorCard({ factor, isExpanded, onToggle }: { factor: LPI2Factor; isExpanded: boolean; onToggle: () => void }) {
  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="border">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="py-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {factorIcons[factor.name]}
                </div>
                <div className="text-left">
                  <CardTitle className="text-sm font-semibold">{factor.name}</CardTitle>
                  <CardDescription className="text-xs">{factor.kpiExample}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">{factor.weight}%</Badge>
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: getScoreColor(factor.score) }}
                >
                  {Math.round(factor.score)}
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <p className="text-xs text-muted-foreground mb-3">{factor.description}</p>
            <div className="space-y-2">
              {factor.subFactors.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{sub.name}</span>
                    <p className="text-xs text-muted-foreground">{sub.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={sub.score} className="w-20 h-2" />
                    <span className="text-xs font-medium w-8">{Math.round(sub.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Molecule Analysis Card
function MoleculeAnalysisCard({ molecule, prediction }: { molecule: MoleculeProfile; prediction: LPI2Prediction }) {
  const [expandedFactors, setExpandedFactors] = useState<Set<string>>(new Set());
  
  const radarData = prediction.factors.map(f => ({
    factor: f.name.split(' ')[0],
    score: f.score,
    fullMark: 100,
  }));
  
  const toggleFactor = (name: string) => {
    setExpandedFactors(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">{molecule.name}</h3>
              <p className="text-sm text-muted-foreground">{molecule.company} • {molecule.phase} • {molecule.therapeuticArea}</p>
              <p className="text-sm mt-1">{molecule.indication}</p>
            </div>
            <div className="text-right">
              <div 
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold mx-auto"
                style={{ backgroundColor: getScoreColor(prediction.totalScore) }}
              >
                <div className="text-2xl">{prediction.totalScore}</div>
                <div className="text-[10px] opacity-90">Investment</div>
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                {getRecommendationBadge(prediction.recommendation)}
                {getRiskBadge(prediction.riskLevel)}
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Investment Readiness Assessment:</p>
            <p className="text-lg font-semibold text-primary">"{prediction.investmentReadiness}"</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Radar Chart + Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">5-Factor Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Factor Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={prediction.factors} 
                layout="vertical"
                margin={{ left: 20, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="score" name="Score">
                  {prediction.factors.map((entry, index) => (
                    <Cell key={index} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Factor Cards */}
      <div className="space-y-2">
        <h4 className="font-semibold text-lg">Factor Details</h4>
        {prediction.factors.map((factor) => (
          <FactorCard
            key={factor.name}
            factor={factor}
            isExpanded={expandedFactors.has(factor.name)}
            onToggle={() => toggleFactor(factor.name)}
          />
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export function LPI2Dashboard({ molecules }: LPI2DashboardProps) {
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  
  const predictions = useMemo(() => {
    return molecules.map(mol => ({
      molecule: mol,
      prediction: calculateLPI2ForMolecule(mol),
    }));
  }, [molecules]);
  
  const selectedData = predictions.find(p => p.molecule.id === selectedMolecule);
  
  // Aggregate statistics
  const avgScore = Math.round(predictions.reduce((sum, p) => sum + p.prediction.totalScore, 0) / predictions.length);
  const strongBuys = predictions.filter(p => p.prediction.recommendation === 'Strong Buy').length;
  const buys = predictions.filter(p => p.prediction.recommendation === 'Buy').length;
  const holds = predictions.filter(p => p.prediction.recommendation === 'Hold').length;
  const passes = predictions.filter(p => p.prediction.recommendation === 'Pass').length;
  
  // Portfolio comparison chart data
  const portfolioChartData = predictions
    .sort((a, b) => b.prediction.totalScore - a.prediction.totalScore)
    .map(p => ({
      name: p.molecule.name.length > 12 ? p.molecule.name.substring(0, 12) + '...' : p.molecule.name,
      score: p.prediction.totalScore,
      recommendation: p.prediction.recommendation,
    }));
  
  return (
    <div className="space-y-6">
      {/* Model Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Investment Score: 5-Factor Investment Model</CardTitle>
              <CardDescription>
                VC / Investment Model • Used by venture capital, licensing teams, and biotech accelerators
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Model Overview</TabsTrigger>
              <TabsTrigger value="factors">5 Factors</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">{avgScore}</div>
                  <div className="text-sm text-muted-foreground">Avg Investment Score</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-[hsl(142,76%,36%)]">{strongBuys}</div>
                  <div className="text-sm text-muted-foreground">Strong Buys</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-[hsl(142,50%,50%)]">{buys}</div>
                  <div className="text-sm text-muted-foreground">Buys</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-[hsl(45,93%,47%)]">{holds}</div>
                  <div className="text-sm text-muted-foreground">Holds</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-[hsl(0,72%,51%)]">{passes}</div>
                  <div className="text-sm text-muted-foreground">Passes</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="factors">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-semibold">Factor</th>
                      <th className="text-center py-2 px-3 font-semibold">Weight</th>
                      <th className="text-left py-2 px-3 font-semibold">Example KPI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">1. Biological Plausibility</td>
                      <td className="text-center py-2 px-3">30%</td>
                      <td className="py-2 px-3 text-muted-foreground">Human genetic evidence, pathway role</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">2. Translational Evidence</td>
                      <td className="text-center py-2 px-3">25%</td>
                      <td className="py-2 px-3 text-muted-foreground">Preclinical model reproducibility, biomarkers</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">3. Clinical Readiness</td>
                      <td className="text-center py-2 px-3">20%</td>
                      <td className="py-2 px-3 text-muted-foreground">IND-enabling completeness</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-3 font-medium">4. Regulatory Attractiveness</td>
                      <td className="text-center py-2 px-3">15%</td>
                      <td className="py-2 px-3 text-muted-foreground">Orphan/exemptions, unmet need</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">5. Team & Sponsor</td>
                      <td className="text-center py-2 px-3">10%</td>
                      <td className="py-2 px-3 text-muted-foreground">Track record of clinical advancement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="sources">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LPI2_DATA_SOURCES.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors text-center"
                  >
                    <div className="text-sm font-medium">{source.name}</div>
                  </a>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Portfolio Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Investment Score Comparison</CardTitle>
          <CardDescription>Investment readiness scores across all molecules</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolioChartData} margin={{ bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0}
                tick={{ fontSize: 10 }}
                height={60}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p>Score: {data.score}</p>
                        <p>Recommendation: {data.recommendation}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" name="Investment Score">
                {portfolioChartData.map((entry, index) => (
                  <Cell key={index} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Molecule Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Molecule for Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {predictions.map(({ molecule, prediction }) => (
              <div
                key={molecule.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                  selectedMolecule === molecule.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedMolecule(molecule.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{molecule.name}</div>
                    <div className="text-xs text-muted-foreground">{molecule.company}</div>
                    <div className="text-xs text-muted-foreground">{molecule.phase} • {molecule.therapeuticArea}</div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: getScoreColor(prediction.totalScore) }}
                    >
                      {prediction.totalScore}
                    </div>
                    <div className="text-[10px] mt-1">{prediction.recommendation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Selected Molecule Analysis */}
      {selectedData && (
        <MoleculeAnalysisCard
          molecule={selectedData.molecule}
          prediction={selectedData.prediction}
        />
      )}
      
      {/* Interpretation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Investment Interpretation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Score Thresholds</h4>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(142,76%,36%)]" />
                  <span><strong>75-100:</strong> Strong Buy — High-conviction opportunity</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(142,50%,50%)]" />
                  <span><strong>60-74:</strong> Buy — Solid investment candidate</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)]" />
                  <span><strong>45-59:</strong> Hold — Requires additional due diligence</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]" />
                  <span><strong>0-44:</strong> Pass — High risk, limited upside</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Model Limitations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Simplified model optimized for early-stage assessment</li>
                <li>• Does not incorporate time-to-event survival analysis</li>
                <li>• Team assessment based on company profile, not individual evaluation</li>
                <li>• Best suited for Phase I-II financing decisions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
