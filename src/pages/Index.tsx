import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Calendar, 
  Globe, 
  TrendingUp, 
  Database,
  FileText,
  Search,
  BarChart3
} from "lucide-react";
import { MoleculeScoreCard } from "@/components/MoleculeScoreCard";
import { MarketAnalysisTable } from "@/components/MarketAnalysisTable";
import { 
  calculateProbabilityScores, 
  generateMarketProjections, 
  calculateOverallScore,
  type ProbabilityScores,
  type MarketData
} from "@/lib/scoring";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  scores: ProbabilityScores;
  marketData: MarketData[];
  overallScore: number;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);

  // Generate comprehensive molecule profiles with real probability calculations
  const mockMolecules: MoleculeProfile[] = [
    {
      id: "BQ-001",
      name: "Zincotrexate",
      phase: "Phase III",
      indication: "Non-Small Cell Lung Cancer",
      therapeuticArea: "Oncology",
      company: "BioTech Innovations",
      companyTrackRecord: 'fast',
      scores: calculateProbabilityScores("Phase III", "Non-Small Cell Lung Cancer", "Oncology"),
      marketData: generateMarketProjections("Zincotrexate", "Phase III", "Non-Small Cell Lung Cancer", 'fast'),
      overallScore: 0,
    },
    {
      id: "BQ-002",
      name: "Cardiomax-R",
      phase: "Phase II",
      indication: "Heart Failure",
      therapeuticArea: "Cardiology",
      company: "Global Pharma Corp",
      companyTrackRecord: 'average',
      scores: calculateProbabilityScores("Phase II", "Heart Failure", "Cardiology"),
      marketData: generateMarketProjections("Cardiomax-R", "Phase II", "Heart Failure", 'average'),
      overallScore: 0,
    },
    {
      id: "BQ-003",
      name: "Neuroplastin",
      phase: "Phase II",
      indication: "Alzheimer's Disease",
      therapeuticArea: "Neurology",
      company: "NeuroScience Labs",
      companyTrackRecord: 'slow',
      scores: calculateProbabilityScores("Phase II", "Alzheimer's Disease", "Neurology"),
      marketData: generateMarketProjections("Neuroplastin", "Phase II", "Alzheimer's Disease", 'slow'),
      overallScore: 0,
    },
    {
      id: "EVOKE-01",
      name: "Semaglutide",
      phase: "Phase III",
      indication: "Alzheimer's Disease",
      therapeuticArea: "Neurology",
      company: "Novo Nordisk",
      companyTrackRecord: 'fast',
      scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology"),
      marketData: generateMarketProjections("Semaglutide", "Phase III", "Alzheimer's Disease", 'fast'),
      overallScore: 0,
    },
  ];

  // Calculate overall scores based on probabilities and market projections
  mockMolecules.forEach(mol => {
    mol.overallScore = calculateOverallScore(mol.scores, mol.marketData);
  });

  const activeMolecule = mockMolecules.find(m => m.id === selectedMolecule);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">BioQuill</h1>
                <p className="text-sm text-muted-foreground">Pharmaceutical Intelligence Platform</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
              <Button variant="ghost" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button variant="default" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Trials
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Molecules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,247</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Trials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">892</div>
              <p className="text-xs text-muted-foreground mt-1">Across 45 countries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Approval Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">8.3y</div>
              <p className="text-xs text-muted-foreground mt-1">FDA average timeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-4">12.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Phase I to approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="molecules" className="gap-2">
              <FlaskConical className="h-4 w-4" />
              Molecules
            </TabsTrigger>
            <TabsTrigger value="timelines" className="gap-2">
              <Calendar className="h-4 w-4" />
              Timelines
            </TabsTrigger>
            <TabsTrigger value="regulatory" className="gap-2">
              <Globe className="h-4 w-4" />
              Regulatory
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {!selectedMolecule ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold">High Priority Molecules</h2>
                    <p className="text-sm text-muted-foreground">Comprehensive due diligence profiles for PE/M&A analysis</p>
                  </div>
                </div>
                {mockMolecules
                  .sort((a, b) => b.overallScore - a.overallScore)
                  .map((molecule) => (
                    <Card key={molecule.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedMolecule(molecule.id)}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-semibold">{molecule.name}</h3>
                              <Badge variant="outline">{molecule.id}</Badge>
                              <Badge variant="secondary">{molecule.company}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{molecule.phase}</span>
                              <span>•</span>
                              <span>{molecule.indication}</span>
                              <span>•</span>
                              <span>{molecule.therapeuticArea}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Approval Probability</p>
                                <p className="font-semibold">{(molecule.scores.approval * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Next Phase Prob.</p>
                                <p className="font-semibold">{(molecule.scores.nextPhase * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Dropout Risk</p>
                                <p className="font-semibold">{molecule.scores.dropoutRanking}/5</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total Revenue (2Y)</p>
                                <p className="font-semibold">
                                  ${molecule.marketData.reduce((sum, m) => sum + m.revenueProjection.year1 + m.revenueProjection.year2, 0).toFixed(0)}M
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Overall Score</div>
                              <div className="text-3xl font-bold text-primary">{molecule.overallScore}</div>
                            </div>
                            <Button onClick={(e) => { e.stopPropagation(); setSelectedMolecule(molecule.id); }}>
                              Full Analysis
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : activeMolecule ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Comprehensive Due Diligence Report</h2>
                  <Button variant="outline" onClick={() => setSelectedMolecule(null)}>
                    ← Back to Overview
                  </Button>
                </div>
                <MoleculeScoreCard
                  moleculeName={activeMolecule.name}
                  scores={activeMolecule.scores}
                  phase={activeMolecule.phase}
                  indication={activeMolecule.indication}
                  overallScore={activeMolecule.overallScore}
                />
                <MarketAnalysisTable marketData={activeMolecule.marketData} />
              </div>
            ) : null}
          </TabsContent>

          {/* Molecules Tab */}
          <TabsContent value="molecules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Molecule Database</CardTitle>
                <CardDescription>Browse and analyze clinical trial molecules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FlaskConical className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Molecule profiling interface will be displayed here</p>
                  <p className="text-sm mt-2">Integration with trials.gov and clinical databases</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timelines Tab */}
          <TabsContent value="timelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Approval Timeline Analysis</CardTitle>
                <CardDescription>Multi-scenario approval predictions by country and authority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Timeline calculation and visualization tools</p>
                  <p className="text-sm mt-2">Country-specific regulatory pathways and projections</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Intelligence</CardTitle>
                <CardDescription>Country-specific legal landscapes and pharma company benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Regulatory landscape mapping and analysis</p>
                  <p className="text-sm mt-2">Market entry strategies and average launch timelines</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
