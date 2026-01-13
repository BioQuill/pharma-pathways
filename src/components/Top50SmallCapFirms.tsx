import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Building2, 
  Search, 
  TrendingUp, 
  Target, 
  FlaskConical,
  Brain,
  Heart,
  Shield,
  Dna,
  Microscope,
  Pill,
  Activity,
  ExternalLink,
  Download
} from "lucide-react";
import { exportDomToPDF } from "@/lib/pdfGenerator";

interface SmallCapCompany {
  rank: number;
  ticker: string;
  name: string;
  focus: string;
  pipeline: string;
  stage: string;
  whyTarget: string;
  marketCap: string;
  category: string;
  note?: string;
}

const companies: SmallCapCompany[] = [
  // CATEGORY 1: IMMUNOLOGY & AUTOIMMUNE
  { rank: 1, ticker: "VTYX", name: "Ventyx Biosciences", focus: "Oral immunology therapeutics", pipeline: "TYK2 inhibitors for psoriasis, IBD, lupus", stage: "Phase 2/3", whyTarget: "Oral formulations, large autoimmune markets", marketCap: "~$500M-1B", category: "Immunology & Autoimmune" },
  { rank: 2, ticker: "RAPT", name: "RAPT Therapeutics", focus: "CCR4 antagonists for oncology and inflammation", pipeline: "RPT193 for asthma, atopic dermatitis", stage: "Phase 2", whyTarget: "Novel mechanism, validated biology", marketCap: "~$300-600M", category: "Immunology & Autoimmune" },
  { rank: 3, ticker: "ALMS", name: "Alumis", focus: "Oral immune cell modulators", pipeline: "A-005 for lupus, A-011 for RA", stage: "Phase 2", whyTarget: "Experienced team (ex-Celgene/BMS), oral drugs", marketCap: "~$800M-1.2B", category: "Immunology & Autoimmune" },
  { rank: 4, ticker: "CNCT", name: "Connect Biopharma", focus: "T-cell modulators", pipeline: "CBP-201 (anti-IL-4Rα) for atopic dermatitis", stage: "Phase 2", whyTarget: "China + global rights, differentiated biology", marketCap: "~$200-400M", category: "Immunology & Autoimmune" },
  { rank: 5, ticker: "DICE", name: "Dice Therapeutics", focus: "Oral S1P receptor modulators", pipeline: "DC-806 for psoriatic arthritis", stage: "Phase 2", whyTarget: "Post-Ozanimod opportunity, oral convenience", marketCap: "~$400-700M", category: "Immunology & Autoimmune" },
  
  // CATEGORY 2: RARE DISEASES / ORPHAN DRUGS
  { rank: 6, ticker: "KRYS", name: "Krystal Biotech", focus: "Gene therapy for dermatology", pipeline: "VYJUVEK (approved EB), other skin disorders", stage: "Approved + pipeline", whyTarget: "Commercial stage, proven platform, rare diseases", marketCap: "~$3-5B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 7, ticker: "RCKT", name: "Rocket Pharmaceuticals", focus: "Gene therapy for rare diseases", pipeline: "RP-A501 (PKD), RP-L201 (FA), others", stage: "Phase 2/3", whyTarget: "Multiple programs, AAV platform", marketCap: "~$1-2B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 8, ticker: "PASG", name: "Passage Bio", focus: "CNS gene therapies", pipeline: "PBGM01 (GM1 gangliosidosis), PBFT02 (FTD)", stage: "Phase 1/2", whyTarget: "UPenn platform, CNS focus", marketCap: "~$100-300M", category: "Rare Diseases / Orphan Drugs" },
  { rank: 9, ticker: "ARTX", name: "Akari Therapeutics", focus: "Complement inhibitors", pipeline: "Nomacopan for rare diseases", stage: "Phase 3", whyTarget: "Late-stage, orphan indications", marketCap: "~$50-150M", category: "Rare Diseases / Orphan Drugs" },
  { rank: 10, ticker: "ABEO", name: "Abeona Therapeutics", focus: "Gene and cell therapies", pipeline: "EB-101 (EB), ABO-102 (MPS IIIA)", stage: "Phase 1/2/3", whyTarget: "Multiple rare disease programs", marketCap: "~$100-200M", category: "Rare Diseases / Orphan Drugs" },
  
  // CATEGORY 3: ONCOLOGY - SOLID TUMORS
  { rank: 11, ticker: "MRTX", name: "Mirati Therapeutics", focus: "KRAS inhibitors", pipeline: "Adagrasib (approved NSCLC), MRTX1133 (KRAS G12D)", stage: "Approved + Phase 1/2", whyTarget: "Validated KRAS targeting, Bristol interest", marketCap: "~$5-7B", category: "Oncology - Solid Tumors", note: "Bristol Myers Squibb announced acquisition Dec 2024" },
  { rank: 12, ticker: "BCYC", name: "Bicycle Therapeutics", focus: "Bicyclic peptides for cancer", pipeline: "BT8009 (Nectin-4 ADC), BT5528 (EphA2)", stage: "Phase 2/3", whyTarget: "Novel platform, partnership with Genentech", marketCap: "~$1-2B", category: "Oncology - Solid Tumors" },
  { rank: 13, ticker: "BDTX", name: "Black Diamond Therapeutics", focus: "Precision oncology, MasterKey platform", pipeline: "BDTX-1535 (HER2 mutations), others", stage: "Phase 1/2", whyTarget: "Mutation-specific kinase inhibitors", marketCap: "~$300-600M", category: "Oncology - Solid Tumors" },
  { rank: 14, ticker: "KNTE", name: "Kinnate Biopharma", focus: "Precision oncology, RAF inhibitors", pipeline: "KIN-2787 (pan-RAF), KIN-3248 (CDK12)", stage: "Phase 1/2", whyTarget: "Genetically defined populations", marketCap: "~$200-400M", category: "Oncology - Solid Tumors" },
  { rank: 15, ticker: "CGEM", name: "Cullinan Oncology", focus: "Oncology pipeline company", pipeline: "CLN-081 (EGFR Exon20), CLN-619 (STING)", stage: "Phase 1/2", whyTarget: "Multiple differentiated assets", marketCap: "~$300-700M", category: "Oncology - Solid Tumors" },
  { rank: 16, ticker: "NUVL", name: "Nuvalent", focus: "Brain-penetrant kinase inhibitors", pipeline: "Zidesamtinib (ALK), NVL-655 (ROS1)", stage: "Phase 2", whyTarget: "Best-in-class potential, CNS penetration", marketCap: "~$2-4B", category: "Oncology - Solid Tumors" },
  { rank: 17, ticker: "RLAY", name: "Relay Therapeutics", focus: "Allosteric kinase inhibitors", pipeline: "RLY-2608 (PI3Kα), others", stage: "Phase 1/2", whyTarget: "Computational platform, differentiated inhibitors", marketCap: "~$500M-1B", category: "Oncology - Solid Tumors" },
  { rank: 18, ticker: "IOVA", name: "Iovance Biotherapeutics", focus: "TIL (tumor-infiltrating lymphocyte) therapy", pipeline: "Lifileucel (approved melanoma), others", stage: "Approved + pipeline", whyTarget: "Commercial stage, cell therapy platform", marketCap: "~$3-5B", category: "Oncology - Solid Tumors" },
  
  // CATEGORY 4: ONCOLOGY - HEMATOLOGIC
  { rank: 19, ticker: "ATRA", name: "Atara Biotherapeutics", focus: "Allogeneic T-cell therapies", pipeline: "Tab-cel (EBV+ PTLD), ATA3271 (solid tumors)", stage: "Phase 3 / approved (EU)", whyTarget: "Off-the-shelf CAR-T platform", marketCap: "~$200-400M", category: "Oncology - Hematologic" },
  { rank: 20, ticker: "CRVS", name: "Corvus Pharmaceuticals", focus: "Immuno-oncology", pipeline: "Mupadolimab (anti-CD73), ciforadenant (A2aR)", stage: "Phase 2/3", whyTarget: "Novel checkpoint targets", marketCap: "~$200-400M", category: "Oncology - Hematologic" },
  { rank: 21, ticker: "SNDX", name: "Syndax Pharmaceuticals", focus: "Epigenetic modulators", pipeline: "Revumenib (menin inhibitor), axatilimab (CSF-1R)", stage: "Phase 2/3", whyTarget: "Revumenib breakthrough therapy designation", marketCap: "~$1-2B", category: "Oncology - Hematologic" },
  { rank: 22, ticker: "TGTX", name: "TG Therapeutics", focus: "B-cell therapies", pipeline: "Briumvi (approved MS), ublituximab", stage: "Approved + pipeline", whyTarget: "Commercial stage, undervalued", marketCap: "~$2-4B", category: "Oncology - Hematologic" },
  
  // CATEGORY 5: NEUROLOGY / CNS
  { rank: 23, ticker: "PRAX", name: "Praxis Precision Medicines", focus: "Precision neurology", pipeline: "Ulixacaltamide (epilepsy), relutrigine (SCN2A, SCN8A)", stage: "Phase 2/3", whyTarget: "Genetically defined epilepsies, breakthrough therapy", marketCap: "~$1-2B", category: "Neurology / CNS" },
  { rank: 24, ticker: "STOK", name: "Stoke Therapeutics", focus: "RNA-based therapies for CNS", pipeline: "STK-001 (Dravet syndrome), STK-002 (Angelman)", stage: "Phase 3", whyTarget: "Novel antisense platform, rare epilepsies", marketCap: "~$300-600M", category: "Neurology / CNS" },
  { rank: 25, ticker: "ENCD", name: "Encoded Therapeutics", focus: "AAV gene therapy for CNS", pipeline: "ET-01 (Dravet), others", stage: "Preclinical/Phase 1", whyTarget: "CNS gene therapy platform", marketCap: "~$200-500M", category: "Neurology / CNS" },
  { rank: 26, ticker: "NMRA", name: "Neumora Therapeutics", focus: "Brain diseases (depression, insomnia, others)", pipeline: "NMRA-140 (MDD), NMRA-511 (insomnia)", stage: "Phase 2", whyTarget: "Well-funded (Amgen backing), precision psychiatry", marketCap: "~$1-2B", category: "Neurology / CNS" },
  { rank: 27, ticker: "ACAD", name: "Acadia Pharma", focus: "Neuropsychiatric disorders", pipeline: "Trofinetide (Rett), pimavanserin", stage: "Approved + pipeline", whyTarget: "Commercial stage, CNS expertise", marketCap: "~$2-4B", category: "Neurology / CNS", note: "Similar to Karuna (acquired by BMS for $14B)" },
  { rank: 28, ticker: "VIGL", name: "Vigil Neuroscience", focus: "Microglia biology for neurodegenerative diseases", pipeline: "VGL101 (TREM2), others", stage: "Phase 1", whyTarget: "Novel target, AD/Parkinson's focus", marketCap: "~$200-400M", category: "Neurology / CNS" },
  
  // CATEGORY 6: METABOLIC / CARDIOMETABOLIC
  { rank: 29, ticker: "ETNB", name: "89bio", focus: "FGF21 analogs for liver disease", pipeline: "Pegozafermin (NASH, SHTG)", stage: "Phase 2b/3", whyTarget: "Positive data, underserved NASH market", marketCap: "~$1-2B", category: "Metabolic / Cardiometabolic" },
  { rank: 30, ticker: "AKRO", name: "Akero Therapeutics", focus: "FGF21 analog for NASH", pipeline: "Efruxifermin (NASH, cirrhosis)", stage: "Phase 2b", whyTarget: "Strong efficacy data, liver fibrosis", marketCap: "~$1-2B", category: "Metabolic / Cardiometabolic" },
  { rank: 31, ticker: "VKTX", name: "Viking Therapeutics", focus: "Metabolic diseases", pipeline: "VK2809 (NASH), VK2735 (obesity - GLP-1/GIP)", stage: "Phase 2", whyTarget: "Obesity asset (hot space), NASH backup", marketCap: "~$3-6B", category: "Metabolic / Cardiometabolic" },
  { rank: 32, ticker: "MDGL", name: "Madrigal Pharmaceuticals", focus: "NASH/liver disease", pipeline: "Rezdiffra (resmetirom) - APPROVED", stage: "Commercial", whyTarget: "First approved NASH therapy", marketCap: "~$5-8B", category: "Metabolic / Cardiometabolic", note: "Likely too large but possible" },
  { rank: 33, ticker: "CRNX", name: "Crinetics Pharmaceuticals", focus: "Peptide therapeutics for endocrine diseases", pipeline: "Paltusotine (acromegaly), others", stage: "Phase 3", whyTarget: "Oral somatostatin receptor agonists", marketCap: "~$2-4B", category: "Metabolic / Cardiometabolic" },
  { rank: 34, ticker: "MLYS", name: "Mineralys Therapeutics", focus: "Hypertension (aldosterone-driven)", pipeline: "Lorundrostat (uncontrolled HTN)", stage: "Phase 2", whyTarget: "Large HTN market, novel mechanism", marketCap: "~$500M-1B", category: "Metabolic / Cardiometabolic" },
  
  // CATEGORY 7: INFECTIOUS DISEASE / VACCINES
  { rank: 35, ticker: "VIR", name: "Vir Biotechnology", focus: "Infectious diseases (HBV, influenza, COVID)", pipeline: "VIR-2218 (HBV), VIR-1388 (flu), others", stage: "Phase 2", whyTarget: "GSK partnership, HBV functional cure potential", marketCap: "~$1-2B", category: "Infectious Disease / Vaccines" },
  { rank: 36, ticker: "APLT", name: "Applied Therapeutics", focus: "Aldose reductase inhibitors", pipeline: "Govorestat (PMM2-CDG, galactosemia)", stage: "Phase 3", whyTarget: "Rare metabolic diseases, orphan status", marketCap: "~$100-300M", category: "Infectious Disease / Vaccines" },
  { rank: 37, ticker: "CMRX", name: "Chimerix", focus: "Antivirals", pipeline: "Brincidofovir (smallpox, adenovirus)", stage: "Approved + pipeline", whyTarget: "Biodefense contracts, commercial product", marketCap: "~$100-200M", category: "Infectious Disease / Vaccines" },
  
  // CATEGORY 8: INFLAMMATION / FIBROSIS
  { rank: 38, ticker: "PLRX", name: "Pliant Therapeutics", focus: "Integrin inhibitors for fibrosis", pipeline: "Bexotegrast (IPF), others", stage: "Phase 2", whyTarget: "Novel fibrosis mechanism, multiple indications", marketCap: "~$500M-1B", category: "Inflammation / Fibrosis" },
  { rank: 39, ticker: "IRON", name: "Disc Medicine", focus: "Hematology (anemia)", pipeline: "Bitopertin (SCD anemia), others", stage: "Phase 2/3", whyTarget: "Differentiated SCD approach", marketCap: "~$800M-1.5B", category: "Inflammation / Fibrosis" },
  { rank: 40, ticker: "ALBO", name: "Albireo Pharma", focus: "Rare pediatric liver diseases", pipeline: "Bylvay (approved PFIC), odevixibat", stage: "Approved + expansion", whyTarget: "Commercial orphan drug, expansion potential", marketCap: "~$1-2B", category: "Inflammation / Fibrosis", note: "Acquired by Ipsen (2024) for $952M" },
  
  // CATEGORY 9: GENE THERAPY / GENE EDITING
  { rank: 41, ticker: "SANA", name: "Sana Biotechnology", focus: "Hypoimmune cell therapies, in vivo gene editing", pipeline: "SC291 (T1D), SC379 (B-cell cancers)", stage: "Phase 1", whyTarget: "Platform company, hypoimmune cells", marketCap: "~$500M-1B", category: "Gene Therapy / Gene Editing" },
  { rank: 42, ticker: "PSTX", name: "Poseida Therapeutics", focus: "CAR-T and gene therapy", pipeline: "P-BCMA-ALLO1 (multiple myeloma), others", stage: "Phase 1/2", whyTarget: "Allogeneic CAR-T platform", marketCap: "~$300-600M", category: "Gene Therapy / Gene Editing" },
  { rank: 43, ticker: "TSHA", name: "Taysha Gene Therapies", focus: "AAV gene therapy for CNS", pipeline: "TSHA-120 (GAN), TSHA-102 (Rett)", stage: "Phase 1/2", whyTarget: "CNS rare disease focus", marketCap: "~$100-300M", category: "Gene Therapy / Gene Editing" },
  { rank: 44, ticker: "LXEO", name: "Lexeo Therapeutics", focus: "AAV gene therapy for cardiac, CNS", pipeline: "LX1001 (PKP2-ACM), LX2020 (CLN2)", stage: "Phase 1/2", whyTarget: "Cardiac gene therapy niche", marketCap: "~$200-400M", category: "Gene Therapy / Gene Editing" },
  
  // CATEGORY 10: PLATFORM/TECHNOLOGY COMPANIES
  { rank: 45, ticker: "ABCL", name: "AbCellera Biologics", focus: "Antibody discovery platform", pipeline: "Platform + partnerships (Eli Lilly, others)", stage: "Discovery platform", whyTarget: "AI-powered antibody discovery, proven (COVID)", marketCap: "~$1-3B", category: "Platform / Technology" },
  { rank: 46, ticker: "ABSI", name: "Absci Corporation", focus: "Generative AI for drug discovery", pipeline: "AI platform + partnerships", stage: "Platform", whyTarget: "AI/ML for biologics, multiple partnerships", marketCap: "~$300-700M", category: "Platform / Technology" },
  { rank: 47, ticker: "GBIO", name: "Generation Bio", focus: "Non-viral gene therapy platform", pipeline: "ctDNA platform, liver/retina programs", stage: "Preclinical/Phase 1", whyTarget: "Differentiated delivery, avoids AAV issues", marketCap: "~$300-600M", category: "Platform / Technology" },
  { rank: 48, ticker: "CADL", name: "Candel Therapeutics", focus: "Viral immunotherapies for cancer", pipeline: "CAN-2409 (prostate cancer), others", stage: "Phase 3", whyTarget: "Oncolytic virus platform", marketCap: "~$100-200M", category: "Platform / Technology" },
  { rank: 49, ticker: "MGX", name: "Metagenomi", focus: "Gene editing tools (beyond CRISPR)", pipeline: "Platform + internal programs", stage: "Preclinical", whyTarget: "Next-gen editing tools, IP estate", marketCap: "~$200-400M", category: "Platform / Technology" },
  { rank: 50, ticker: "PRME", name: "Prime Medicine", focus: "Prime editing (precise gene editing)", pipeline: "PM359 (liver), others", stage: "Preclinical/Phase 1", whyTarget: "David Liu lab spinout, differentiated editing", marketCap: "~$500M-1B", category: "Platform / Technology" },
];

const categories = [
  { name: "Immunology & Autoimmune", icon: Shield, color: "bg-blue-500" },
  { name: "Rare Diseases / Orphan Drugs", icon: Dna, color: "bg-purple-500" },
  { name: "Oncology - Solid Tumors", icon: Target, color: "bg-red-500" },
  { name: "Oncology - Hematologic", icon: Activity, color: "bg-rose-500" },
  { name: "Neurology / CNS", icon: Brain, color: "bg-pink-500" },
  { name: "Metabolic / Cardiometabolic", icon: Heart, color: "bg-orange-500" },
  { name: "Infectious Disease / Vaccines", icon: Shield, color: "bg-green-500" },
  { name: "Inflammation / Fibrosis", icon: FlaskConical, color: "bg-amber-500" },
  { name: "Gene Therapy / Gene Editing", icon: Dna, color: "bg-cyan-500" },
  { name: "Platform / Technology", icon: Microscope, color: "bg-indigo-500" },
];

const maCriteria = [
  { title: "Clinical Validation", items: ["Phase 2+ data showing efficacy", "Breakthrough therapy designation", "Fast Track status", "Orphan drug designation"] },
  { title: "Market Opportunity", items: ["Large unmet need ($1B+ market)", "Orphan disease with high pricing", "First-in-class mechanism", "Best-in-class potential"] },
  { title: "Strategic Fit", items: ["Complements acquirer pipeline", "Geographic expansion (Asia-US)", "Technology platform", "Talent acquisition"] },
  { title: "Financial", items: ["Market cap $100M-$5B (sweet spot $500M-$2B)", "Runway issues (need funding)", "Near pivotal data (de-risk for acquirer)", "Undervalued vs. potential"] },
  { title: "Competitive Dynamics", items: ["Multiple suitors possible (bidding war)", "Partnership already in place", "Patent expiry protection", "Rare disease exclusivity"] },
];

const recentAcquisitions = [
  { target: "Karuna", acquirer: "BMS", value: "$14B", focus: "Schizophrenia", year: "2024" },
  { target: "Mirati", acquirer: "BMS", value: "~$4.8B", focus: "KRAS inhibitors", year: "2024" },
  { target: "Inhibrx", acquirer: "Sanofi", value: "$2.2B", focus: "Alpha-synuclein antibody", year: "2024" },
  { target: "Albireo", acquirer: "Ipsen", value: "$952M", focus: "Rare liver disease", year: "2024" },
  { target: "Gracell", acquirer: "AstraZeneca", value: "$1.2B", focus: "CAR-T platform", year: "2024" },
];

const hotSectors = [
  { name: "Obesity/Metabolic", reason: "Following Novo/Lilly success with GLP-1/GIP assets" },
  { name: "Oncology - Precision", reason: "Targeted therapies, ADCs, cell therapies" },
  { name: "Rare Disease / Gene Therapy", reason: "Proven reimbursement, high prices, orphan exclusivity" },
  { name: "Immunology", reason: "Oral drugs preferred, large markets, biosimilar erosion" },
  { name: "CNS", reason: "High unmet need, rare epilepsies validated" },
];

export const Top50SmallCapFirms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.pipeline.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || company.category === categoryFilter;
    const matchesStage = stageFilter === "all" || company.stage.toLowerCase().includes(stageFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStage;
  });

  const groupedCompanies = categories.map(cat => ({
    ...cat,
    companies: filteredCompanies.filter(c => c.category === cat.name)
  })).filter(cat => cat.companies.length > 0);

  const handleExportPDF = async () => {
    await exportDomToPDF('top-50-small-cap-content', 'Top_50_Small_Cap_Biotech_MA_Targets.pdf', {
      orientation: 'portrait'
    });
  };

  const getStageColor = (stage: string) => {
    if (stage.includes("Approved") || stage.includes("Commercial")) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (stage.includes("Phase 3")) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (stage.includes("Phase 2")) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (stage.includes("Phase 1")) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="space-y-6" id="top-50-small-cap-content">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Top 50 Small-Cap Biotech Companies</CardTitle>
                <CardDescription className="text-base mt-1">
                  Potential M&A Targets (2025) - Breakthrough research, innovative platforms, and promising clinical pipelines
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={handleExportPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, ticker, focus, or pipeline..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="approved">Approved/Commercial</SelectItem>
                <SelectItem value="phase 3">Phase 3</SelectItem>
                <SelectItem value="phase 2">Phase 2</SelectItem>
                <SelectItem value="phase 1">Phase 1</SelectItem>
                <SelectItem value="preclinical">Preclinical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredCompanies.length} of {companies.length} companies
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.slice(0, 5).map(cat => {
          const count = companies.filter(c => c.category === cat.name).length;
          const Icon = cat.icon;
          return (
            <Card key={cat.name} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setCategoryFilter(cat.name)}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cat.color}/20`}>
                    <Icon className={`h-5 w-5 ${cat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{cat.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Companies by Category */}
      <Accordion type="multiple" defaultValue={categories.map(c => c.name)} className="space-y-4">
        {groupedCompanies.map(group => {
          const Icon = group.icon;
          return (
            <AccordionItem key={group.name} value={group.name} className="border rounded-lg overflow-hidden">
              <AccordionTrigger className={`px-4 py-3 hover:no-underline ${group.color}/10`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${group.color}/20`}>
                    <Icon className={`h-5 w-5 ${group.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="font-semibold">{group.name}</span>
                  <Badge variant="secondary">{group.companies.length} companies</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[60px]">#</TableHead>
                      <TableHead className="w-[80px]">Ticker</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Focus</TableHead>
                      <TableHead>Pipeline</TableHead>
                      <TableHead className="w-[120px]">Stage</TableHead>
                      <TableHead>Why M&A Target</TableHead>
                      <TableHead className="w-[120px]">Market Cap</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.companies.map(company => (
                      <TableRow key={company.ticker} className="hover:bg-muted/30">
                        <TableCell className="font-medium text-muted-foreground">{company.rank}</TableCell>
                        <TableCell>
                          <a 
                            href={`https://finance.yahoo.com/quote/${company.ticker}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                          >
                            {company.ticker}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell>
                          <div>
                            <span className="font-medium">{company.name}</span>
                            {company.note && (
                              <p className="text-xs text-amber-500 mt-0.5">{company.note}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{company.focus}</TableCell>
                        <TableCell className="text-sm">{company.pipeline}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStageColor(company.stage)}>
                            {company.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{company.whyTarget}</TableCell>
                        <TableCell className="font-medium text-green-500">{company.marketCap}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* M&A Insights Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Acquisitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Recent M&A Comparables (2023-2024)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Target</TableHead>
                  <TableHead>Acquirer</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Focus</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAcquisitions.map(acq => (
                  <TableRow key={acq.target}>
                    <TableCell className="font-medium">{acq.target}</TableCell>
                    <TableCell>{acq.acquirer}</TableCell>
                    <TableCell className="text-green-500 font-bold">{acq.value}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{acq.focus}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Hot Sectors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Sectors Most Likely for M&A (2025-2026)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {hotSectors.map((sector, idx) => (
              <div key={sector.name} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-500 text-sm font-bold">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-semibold">{sector.name}</p>
                  <p className="text-sm text-muted-foreground">{sector.reason}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* M&A Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Key M&A Criteria That Make These Attractive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {maCriteria.map(criteria => (
              <div key={criteria.title} className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">{criteria.title}</h4>
                <ul className="space-y-1">
                  {criteria.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-500">Disclaimer:</strong> This list represents small-cap biotechs ($100M-$5B market cap) with innovative science, clinical validation, and strategic value that make them attractive acquisition targets. Market caps and status as of early 2025; always verify current status before investment decisions. This is not investment advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Top50SmallCapFirms;
