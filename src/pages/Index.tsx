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

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - will be replaced with real data
  const mockMolecules = [
    { id: "MOL-001", name: "Compound Alpha", phase: "Phase III", indication: "Oncology", score: 8.5, country: "US" },
    { id: "MOL-002", name: "Compound Beta", phase: "Phase II", indication: "Cardiology", score: 7.2, country: "EU" },
    { id: "MOL-003", name: "Compound Gamma", phase: "Phase III", indication: "Neurology", score: 8.8, country: "JP" },
  ];

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
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>High-priority molecules and approval predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMolecules.map((molecule) => (
                    <div key={molecule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{molecule.name}</h3>
                          <Badge variant="outline">{molecule.phase}</Badge>
                          <Badge variant="secondary">{molecule.indication}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{molecule.id}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{molecule.score}</div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-foreground">{molecule.country}</div>
                          <div className="text-xs text-muted-foreground">Market</div>
                        </div>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analyze
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
