import { useState, useRef } from "react";
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
  BarChart3,
  Download
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { MoleculeScoreCard } from "@/components/MoleculeScoreCard";
import { MarketAnalysisTable } from "@/components/MarketAnalysisTable";
import { TrialFailureAnalysis } from "@/components/TrialFailureAnalysis";
import { RetrospectiveTimeline } from "@/components/RetrospectiveTimeline";
import { 
  calculateProbabilityScores, 
  generateMarketProjections, 
  calculateOverallScore,
  type ProbabilityScores,
  type MarketData
} from "@/lib/scoring";

interface TimelinePhase {
  phase: string;
  date: string;
  trialName?: string;
  nctIds?: string[];
  outcome: 'success' | 'partial' | 'pending' | 'setback';
  keyData: string[];
  scoreAtTime: number;
  rationale: string;
  dataAvailableAtTime: string[];
}

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
  isFailed?: boolean;
  trialName?: string;
  nctId?: string;
  hasRetrospective?: boolean;
  retrospectivePhases?: TimelinePhase[];
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMolecule, setSelectedMolecule] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!reportRef.current || !activeMolecule) return;
    
    const opt = {
      margin: 10,
      filename: `${activeMolecule.name.replace(/\s+/g, '_')}_Due_Diligence_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(reportRef.current).save();
  };

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
      isFailed: true,
      trialName: "EVOKE & EVOKE+",
      nctId: "NCT04777396",
      scores: calculateProbabilityScores("Phase III", "Alzheimer's Disease", "Neurology", true),
      marketData: generateMarketProjections("Semaglutide", "Phase III", "Alzheimer's Disease", 'fast', true),
      overallScore: 0,
    },
    {
      id: "ICODEC-01",
      name: "Insulin Icodec (Kyinsu/Awiqli)",
      phase: "Approved (EU/CN)",
      indication: "Type 2 Diabetes",
      therapeuticArea: "Metabolic/Endocrinology",
      company: "Novo Nordisk",
      companyTrackRecord: 'fast',
      nctId: "NCT03496519",
      scores: calculateProbabilityScores("Phase III", "Type 2 Diabetes", "Metabolic"),
      marketData: generateMarketProjections("Insulin Icodec", "Phase III", "Type 2 Diabetes", 'fast'),
      overallScore: 0,
      hasRetrospective: true,
      retrospectivePhases: [
        {
          phase: "Phase 1",
          date: "Q4 2017",
          trialName: "First-in-Human PK/PD Studies",
          nctIds: ["NCT02964104"],
          outcome: 'success',
          keyData: [
            "Half-life of ~196 hours confirmed (vs ~12h for glargine)",
            "Once-weekly dosing feasibility established",
            "Strong albumin binding mechanism validated",
            "Favorable safety profile in healthy volunteers"
          ],
          scoreAtTime: 35,
          rationale: "Early stage with novel mechanism. Base Phase I success rate ~63% for metabolic. Novo Nordisk strong track record in insulin development. Key innovation: strong albumin binding extends half-life. Risk: first-in-class weekly insulin, unproven therapeutic index.",
          dataAvailableAtTime: ["PK/PD data", "Safety profile", "Mechanism validation", "Preclinical data"]
        },
        {
          phase: "Phase 2",
          date: "Q2 2020",
          trialName: "Multiple Dose-Finding & Titration Studies",
          nctIds: ["NCT03496519", "NCT03751657"],
          outcome: 'success',
          keyData: [
            "HbA1c reduction comparable to daily insulin glargine U100",
            "Non-inferior glycemic control demonstrated",
            "Hypoglycemia rates acceptable vs comparator",
            "Optimal dosing algorithm established",
            "Patient adherence signal positive with weekly dosing"
          ],
          scoreAtTime: 52,
          rationale: "Strong Phase 2 data with non-inferiority demonstrated. Historic Phase II→III success rate in metabolic ~68%. Clear differentiation: weekly vs daily dosing addresses adherence. Hypoglycemia profile acceptable. Commercial potential validated - large T2D market.",
          dataAvailableAtTime: ["HbA1c efficacy", "Hypoglycemia rates", "Dose-response", "16-26 week data", "Titration algorithms"]
        },
        {
          phase: "Phase 3a (ONWARDS 1 & 3)",
          date: "Jul 2022",
          trialName: "ONWARDS 1 & ONWARDS 3",
          nctIds: ["NCT04460885", "NCT04795531"],
          outcome: 'success',
          keyData: [
            "ONWARDS 1: Superior HbA1c reduction vs glargine U100 (-1.55% vs -1.35%, p<0.001)",
            "ONWARDS 3: Superior vs degludec in insulin-naïve patients (-1.57% vs -1.36%)",
            "Time in range improvements demonstrated",
            "Hypoglycemia rates comparable to daily insulin",
            "1,085 patients (ONWARDS 1), 588 patients (ONWARDS 3)"
          ],
          scoreAtTime: 71,
          rationale: "Two pivotal Phase 3 trials showing SUPERIORITY (not just non-inferiority). Historic Phase III→Approval rate ~58% for metabolic, but superiority data significantly de-risks. Clear efficacy advantage with convenience benefit. Regulatory pathway looks favorable - unmet need for adherence solutions.",
          dataAvailableAtTime: ["Pivotal efficacy", "52-week safety", "Superiority vs SOC", "Large patient cohorts", "Time-in-range data"]
        },
        {
          phase: "Phase 3a (ONWARDS 5)",
          date: "Oct 2022",
          trialName: "ONWARDS 5 (with Dosing App)",
          nctIds: ["NCT04848480"],
          outcome: 'success',
          keyData: [
            "Superior HbA1c reduction with dosing guide app vs daily insulin",
            "Digital health integration demonstrated",
            "Real-world applicability enhanced",
            "Patient-reported outcomes positive"
          ],
          scoreAtTime: 75,
          rationale: "Third positive Phase 3 result. Digital companion app adds differentiation. Full ONWARDS program (6 trials) progressing well. Approval probability now high given consistent superiority across populations. EU filing expected.",
          dataAvailableAtTime: ["ONWARDS 1-5 results", "Digital health data", "PRO data", "Safety database"]
        },
        {
          phase: "Phase 3b (ONWARDS 6 - Type 1)",
          date: "Q3 2023",
          trialName: "ONWARDS 6 (Type 1 Diabetes)",
          nctIds: ["NCT04848493"],
          outcome: 'partial',
          keyData: [
            "Non-inferior HbA1c reduction in T1D",
            "Higher hypoglycemia rates than daily insulin noted",
            "T1D indication more complex than T2D",
            "Weekly dosing less flexible for T1D insulin adjustments"
          ],
          scoreAtTime: 72,
          rationale: "T1D results mixed - non-inferiority met but hypoglycemia signal. Score slight decrease as T1D indication less clean. T2D indication remains strong. Regulatory strategy likely to prioritize T2D first. Overall program still very positive.",
          dataAvailableAtTime: ["Full ONWARDS 1-6", "T1D vs T2D comparison", "Complete safety database", "Regulatory submissions initiated"]
        },
        {
          phase: "EU Approval",
          date: "Apr 2024",
          trialName: "EMA Approval (Awiqli)",
          outcome: 'success',
          keyData: [
            "First once-weekly insulin approved globally",
            "Approved for Type 2 Diabetes in EU",
            "Commercial launch initiated in Europe",
            "Positive CHMP opinion received"
          ],
          scoreAtTime: 88,
          rationale: "EU approval achieved - major regulatory milestone. First-to-market globally for weekly insulin. Score reflects near-certain T2D approval pathway. US/FDA filing reviewed. China approval also expected. Commercial potential fully validated.",
          dataAvailableAtTime: ["EU approval", "Commercial launch data", "Post-marketing commitments", "Pricing negotiations"]
        },
        {
          phase: "FDA CRL",
          date: "Jul 2024",
          trialName: "FDA Complete Response Letter",
          outcome: 'setback',
          keyData: [
            "CRL issued citing manufacturing process questions",
            "T1D indication questions raised",
            "No new clinical trials required",
            "Resubmission pathway clear",
            "NOT a safety or efficacy concern"
          ],
          scoreAtTime: 78,
          rationale: "FDA CRL is setback but manageable. Manufacturing CMC issues, NOT efficacy/safety. T1D indication complexity noted. EU approval provides validation. Score reduced but US approval still likely with resubmission. Timeline delay ~12-18 months.",
          dataAvailableAtTime: ["FDA CRL details", "Manufacturing concerns", "EU approval validation", "China approval (Kyinsu)", "Resubmission strategy"]
        },
        {
          phase: "FDA Resubmission",
          date: "Sep 2025",
          trialName: "BLA Resubmission to FDA",
          outcome: 'pending',
          keyData: [
            "Manufacturing process concerns addressed",
            "T2D-only indication in resubmission",
            "PDUFA date expected H1 2026",
            "Real-world EU/China data available"
          ],
          scoreAtTime: 82,
          rationale: "Resubmission filed with addressed CMC issues. T2D-focused approach simplifies review. Real-world data from EU/China supportive. High probability of US approval in 2026. Score reflects reduced regulatory risk with clear pathway forward.",
          dataAvailableAtTime: ["Resubmission package", "CMC resolution", "Real-world evidence", "Competitor landscape", "2+ years commercial data (EU)"]
        }
      ]
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
                              <div className="text-sm text-muted-foreground">Launch Probability</div>
                              <div className="text-3xl font-bold text-primary">{molecule.overallScore}%</div>
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
              <div className="space-y-6" ref={reportRef}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">Comprehensive Due Diligence Report</h2>
                    <Button variant="secondary" size="sm" onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedMolecule(null)}>
                    ← Back to Overview
                  </Button>
                </div>
                
                {activeMolecule.isFailed && activeMolecule.trialName && (
                  <TrialFailureAnalysis
                    moleculeName={activeMolecule.name}
                    trialName={activeMolecule.trialName}
                    phase={activeMolecule.phase}
                  />
                )}
                
                <MoleculeScoreCard
                  moleculeName={activeMolecule.name}
                  scores={activeMolecule.scores}
                  phase={activeMolecule.phase}
                  indication={activeMolecule.indication}
                  overallScore={activeMolecule.overallScore}
                  nctId={activeMolecule.nctId}
                />
                <MarketAnalysisTable marketData={activeMolecule.marketData} />
                
                {activeMolecule.hasRetrospective && activeMolecule.retrospectivePhases && (
                  <RetrospectiveTimeline
                    moleculeName={activeMolecule.name}
                    indication={activeMolecule.indication}
                    sponsor={activeMolecule.company}
                    phases={activeMolecule.retrospectivePhases}
                  />
                )}
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
