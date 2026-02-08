import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
  Download,
  BarChart3,
  GitCompare,
  X,
  Plus,
  PieChart,
  Calendar,
  DollarSign,
  Percent,
  History,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scale,
  FileWarning,
  Gavel,
  Wallet,
  Store,
  AlertOctagon,
  Trophy,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileSpreadsheet,
  FileText,
  Eye
} from "lucide-react";
import { exportDomToPDF } from "@/lib/pdfGenerator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, ComposedChart, Area, ScatterChart, Scatter, ZAxis } from "recharts";
import { CompanyDetailModal } from "@/components/CompanyDetailModal";
import { exportMARankingsToExcel, exportRedFlagsToExcel, exportCombinedMAReport } from "@/lib/maExport";

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
  
  // CATEGORY 11: TOP M&A TARGETS 2025-2026
  { rank: 51, ticker: "CLDX", name: "Celldex Therapeutics", focus: "Mast cell/chronic urticaria", pipeline: "Barzolvolimab (CSU, anti-KIT)", stage: "Phase 3", whyTarget: "Breakthrough therapy, validated mechanism, large market", marketCap: "~$2-4B", category: "Top M&A Targets 2025" },
  { rank: 52, ticker: "COGT", name: "Cogent Biosciences", focus: "Precision hematology", pipeline: "Bezuclastinib (KIT inhibitor for SM/GIST)", stage: "Phase 2/3", whyTarget: "Best-in-class potential, multiple indications", marketCap: "~$1-2B", category: "Top M&A Targets 2025" },
  { rank: 53, ticker: "GPCR", name: "Structure Therapeutics", focus: "Oral GLP-1 receptor agonists", pipeline: "GSBR-1290 (obesity/T2D)", stage: "Phase 2", whyTarget: "Oral obesity drug in hot GLP-1 space", marketCap: "~$1.5-3B", category: "Top M&A Targets 2025" },
  { rank: 54, ticker: "RXRX", name: "Recursion Pharmaceuticals", focus: "AI-powered drug discovery", pipeline: "REC-994 (cerebral cavernous malformations), others", stage: "Phase 2", whyTarget: "Leading AI/ML drug discovery platform", marketCap: "~$2-4B", category: "Platform / Technology" },
  { rank: 55, ticker: "OLMA", name: "Olema Oncology", focus: "Estrogen receptor antagonist", pipeline: "Palazestrant (ER+ breast cancer)", stage: "Phase 3", whyTarget: "Oral SERD for breast cancer, large market", marketCap: "~$1-2B", category: "Oncology - Solid Tumors" },
  
  // ADDITIONAL IMMUNOLOGY TARGETS
  { rank: 56, ticker: "IMVT", name: "Immunovant", focus: "FcRn inhibitors for autoimmune", pipeline: "Batoclimab (thyroid eye disease, MG)", stage: "Phase 3", whyTarget: "Oral FcRn inhibitor, multiple indications", marketCap: "~$2-4B", category: "Immunology & Autoimmune" },
  { rank: 57, ticker: "ANAB", name: "AnaptysBio", focus: "Antibody discovery for inflammation", pipeline: "Rosnilimab (anti-PD-1 agonist)", stage: "Phase 2", whyTarget: "Novel mechanism, inflammatory diseases", marketCap: "~$800M-1.5B", category: "Immunology & Autoimmune" },
  { rank: 58, ticker: "VERA", name: "Vera Therapeutics", focus: "IgA nephropathy treatments", pipeline: "Atacicept (IgAN)", stage: "Phase 3", whyTarget: "Validated target in nephrology", marketCap: "~$1-2B", category: "Immunology & Autoimmune" },
  { rank: 59, ticker: "TVTX", name: "Travere Therapeutics", focus: "Rare kidney diseases", pipeline: "Sparsentan (IgAN), FILSPARI approved", stage: "Commercial", whyTarget: "Approved product, rare disease focus", marketCap: "~$1-2B", category: "Rare Diseases / Orphan Drugs" },
  
  // ADDITIONAL ONCOLOGY TARGETS
  { rank: 60, ticker: "MDXH", name: "MDxHealth", focus: "Precision urology diagnostics", pipeline: "SelectMDx, ConfirmMDx (prostate cancer)", stage: "Commercial", whyTarget: "Diagnostic platform, prostate cancer focus", marketCap: "~$200-400M", category: "Platform / Technology" },
  { rank: 61, ticker: "ABCL", name: "Arcus Biosciences", focus: "Immuno-oncology combinations", pipeline: "Domvanalimab (anti-TIGIT), quemliclustat", stage: "Phase 3", whyTarget: "Gilead partnership, multiple I-O assets", marketCap: "~$2-4B", category: "Oncology - Solid Tumors" },
  { rank: 62, ticker: "TYRA", name: "Tyra Biosciences", focus: "Precision oncology for FGFR", pipeline: "TYRA-300 (bladder cancer)", stage: "Phase 1/2", whyTarget: "Next-gen FGFR inhibitor, CNS penetrant", marketCap: "~$800M-1.5B", category: "Oncology - Solid Tumors" },
  { rank: 63, ticker: "MIRM", name: "Mirum Pharmaceuticals", focus: "Rare liver diseases", pipeline: "LIVMARLI (approved), maralixibat", stage: "Commercial", whyTarget: "Commercial rare disease assets", marketCap: "~$1-2B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 64, ticker: "AURA", name: "Aura Biosciences", focus: "Ocular oncology", pipeline: "Belzupacap sarotalocan (eye melanoma)", stage: "Phase 3", whyTarget: "Novel VLP platform, orphan indication", marketCap: "~$400-800M", category: "Oncology - Solid Tumors" },
  
  // ADDITIONAL CNS/NEUROLOGY TARGETS
  { rank: 65, ticker: "AXSM", name: "Axsome Therapeutics", focus: "CNS disorders", pipeline: "Auvelity (approved MDD), Sunosi", stage: "Commercial", whyTarget: "Multiple approved products, CNS leader", marketCap: "~$3-5B", category: "Neurology / CNS" },
  { rank: 66, ticker: "MNMD", name: "Mind Medicine", focus: "Psychedelic-derived medicines", pipeline: "MM120 (GAD), MM402 (autism)", stage: "Phase 2/3", whyTarget: "Novel mechanism, mental health focus", marketCap: "~$500M-1B", category: "Neurology / CNS" },
  { rank: 67, ticker: "CRTX", name: "Cortexyme", focus: "Neurodegenerative diseases", pipeline: "Atuzaginstat (Alzheimer's)", stage: "Phase 2/3", whyTarget: "Novel mechanism targeting P. gingivalis", marketCap: "~$50-150M", category: "Neurology / CNS" },
  { rank: 68, ticker: "SWTX", name: "SpringWorks Therapeutics", focus: "Rare diseases and cancer", pipeline: "Nirogacestat (approved desmoid), mirdametinib", stage: "Commercial", whyTarget: "Approved orphan drug, pipeline potential", marketCap: "~$3-5B", category: "Rare Diseases / Orphan Drugs" },
  
  // ADDITIONAL METABOLIC/OBESITY TARGETS
  { rank: 69, ticker: "PTGX", name: "Protagonist Therapeutics", focus: "Peptide-based medicines", pipeline: "Rusfertide (PV), PN-235 (obesity)", stage: "Phase 3", whyTarget: "Platform + obesity asset, validated peptides", marketCap: "~$1-2B", category: "Metabolic / Cardiometabolic" },
  { rank: 70, ticker: "ERAS", name: "Erasca", focus: "RAS/MAPK oncology", pipeline: "Naporafenib (RAS-driven cancers)", stage: "Phase 1/2", whyTarget: "Broad RAS platform, solid pipeline", marketCap: "~$300-600M", category: "Oncology - Solid Tumors" },
  { rank: 71, ticker: "AMAM", name: "Ambrx Biopharma", focus: "Site-specific ADCs", pipeline: "ARX517 (prostate), ARX788 (HER2)", stage: "Phase 2/3", whyTarget: "Precision ADC platform, multiple assets", marketCap: "~$500M-1B", category: "Oncology - Solid Tumors" },
  { rank: 72, ticker: "TERN", name: "Terns Pharmaceuticals", focus: "NASH and obesity", pipeline: "TERN-501 (THR-β agonist)", stage: "Phase 2", whyTarget: "Differentiated NASH mechanism", marketCap: "~$300-600M", category: "Metabolic / Cardiometabolic" },
  
  // ADDITIONAL GENE THERAPY/CELL THERAPY
  { rank: 73, ticker: "QURE", name: "uniQure", focus: "AAV gene therapy", pipeline: "AMT-130 (Huntington's), hemophilia B", stage: "Phase 1/2", whyTarget: "HD gene therapy leader, validated platform", marketCap: "~$500M-1B", category: "Gene Therapy / Gene Editing" },
  { rank: 74, ticker: "SGMO", name: "Sangamo Therapeutics", focus: "Gene therapy and cell therapy", pipeline: "Fabry disease, hemophilia A programs", stage: "Phase 1/2", whyTarget: "ZFN platform, Pfizer partnerships", marketCap: "~$200-400M", category: "Gene Therapy / Gene Editing" },
  { rank: 75, ticker: "CLVR", name: "Clever Leaves", focus: "Cannabinoid production", pipeline: "GMP cannabinoid manufacturing", stage: "Commercial", whyTarget: "GMP cannabinoid supply chain", marketCap: "~$50-100M", category: "Platform / Technology" },
  { rank: 76, ticker: "ABUS", name: "Arbutus Biopharma", focus: "HBV cure strategies", pipeline: "AB-729 (RNA interference), AB-101", stage: "Phase 2", whyTarget: "HBV functional cure potential", marketCap: "~$200-400M", category: "Infectious Disease / Vaccines" },
  
  // ADDITIONAL HEMATOLOGY TARGETS
  { rank: 77, ticker: "BLUE", name: "bluebird bio", focus: "Gene therapy for rare disease", pipeline: "Lyfgenia (sickle cell), Zynteglo (beta-thal)", stage: "Commercial", whyTarget: "Approved gene therapies, commercial challenges", marketCap: "~$200-500M", category: "Gene Therapy / Gene Editing" },
  { rank: 78, ticker: "IMTX", name: "Immatics", focus: "TCR-based immunotherapies", pipeline: "IMA401, IMA501 (solid tumors)", stage: "Phase 1/2", whyTarget: "TCR platform, BMS/Genmab partnerships", marketCap: "~$1-2B", category: "Oncology - Solid Tumors" },
  { rank: 79, ticker: "APLS", name: "Apellis Pharmaceuticals", focus: "Complement inhibitors", pipeline: "Pegcetacoplan (PNH, GA)", stage: "Commercial", whyTarget: "Commercial complement franchise", marketCap: "~$4-7B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 80, ticker: "PCVX", name: "Vaxcyte", focus: "Next-gen pneumococcal vaccines", pipeline: "VAX-31 (pneumonia), VAX-24", stage: "Phase 3", whyTarget: "Best-in-class vaccine potential, large market", marketCap: "~$8-12B", category: "Infectious Disease / Vaccines" },
  
  // ADDITIONAL INFLAMMATION/FIBROSIS
  { rank: 81, ticker: "FGEN", name: "FibroGen", focus: "HIF-PHI for anemia", pipeline: "Roxadustat (anemia)", stage: "Commercial", whyTarget: "Approved HIF inhibitor, turnaround potential", marketCap: "~$200-500M", category: "Inflammation / Fibrosis" },
  { rank: 82, ticker: "AMTI", name: "Applied Molecular Transport", focus: "Oral biologics delivery", pipeline: "AMT-101 (ulcerative colitis)", stage: "Phase 2", whyTarget: "Oral biologic platform, GI focus", marketCap: "~$100-250M", category: "Platform / Technology" },
  { rank: 83, ticker: "YMAB", name: "Y-mAbs Therapeutics", focus: "Antibodies for pediatric cancer", pipeline: "Danyelza (neuroblastoma), omburtamab", stage: "Commercial", whyTarget: "Approved pediatric oncology drug", marketCap: "~$400-800M", category: "Oncology - Hematologic" },
  { rank: 84, ticker: "ALPN", name: "Alpine Immune Sciences", focus: "Engineered immunotherapies", pipeline: "Povetacicept (IgAN, lupus)", stage: "Phase 2", whyTarget: "Dual BAFF/APRIL targeting, nephrology", marketCap: "~$800M-1.5B", category: "Immunology & Autoimmune" },
  
  // ADDITIONAL RARE DISEASE TARGETS
  { rank: 85, ticker: "RARE", name: "Ultragenyx Pharmaceutical", focus: "Rare diseases", pipeline: "Multiple approved products, gene therapy", stage: "Commercial", whyTarget: "Diversified rare disease portfolio", marketCap: "~$4-7B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 86, ticker: "ARDX", name: "Ardelyx", focus: "GI diseases", pipeline: "IBSRELA (IBS-C), XPHOZAH (hyperphosphatemia)", stage: "Commercial", whyTarget: "Two approved products, profitable path", marketCap: "~$1.5-3B", category: "Metabolic / Cardiometabolic" },
  { rank: 87, ticker: "DCPH", name: "Deciphera Pharmaceuticals", focus: "Kinase inhibitors for cancer", pipeline: "QINLOCK (GIST), vimseltinib", stage: "Commercial", whyTarget: "Approved GIST drug, pipeline expansion", marketCap: "~$1-2B", category: "Oncology - Solid Tumors" },
  { rank: 88, ticker: "TALK", name: "Talkspace", focus: "Digital mental health", pipeline: "Telehealth therapy platform", stage: "Commercial", whyTarget: "Digital health leader, B2B growth", marketCap: "~$100-300M", category: "Platform / Technology" },
  
  // STRATEGIC ACQUISITION CANDIDATES
  { rank: 89, ticker: "ACCD", name: "Accolade", focus: "Healthcare navigation", pipeline: "Personalized healthcare platform", stage: "Commercial", whyTarget: "Healthcare tech consolidation play", marketCap: "~$400-800M", category: "Platform / Technology" },
  { rank: 90, ticker: "AVXL", name: "Anavex Life Sciences", focus: "Sigma-1 receptor agonists", pipeline: "Blarcamesine (Alzheimer's, Rett)", stage: "Phase 2/3", whyTarget: "Novel CNS mechanism, multiple trials", marketCap: "~$400-800M", category: "Neurology / CNS" },
  { rank: 91, ticker: "GTHX", name: "G1 Therapeutics", focus: "Cell cycle inhibitors", pipeline: "Cosela (approved chemoprotection)", stage: "Commercial", whyTarget: "Approved supportive care drug", marketCap: "~$200-400M", category: "Oncology - Solid Tumors" },
  { rank: 92, ticker: "KURA", name: "Kura Oncology", focus: "Precision oncology", pipeline: "Ziftomenib (menin inhibitor AML)", stage: "Phase 2", whyTarget: "Competitive with revumenib, AML focus", marketCap: "~$1-2B", category: "Oncology - Hematologic" },
  
  // EMERGING BIOTECH TARGETS
  { rank: 93, ticker: "VERV", name: "Verve Therapeutics", focus: "Gene editing for cardiovascular", pipeline: "VERVE-101 (PCSK9), VERVE-102 (ANGPTL3)", stage: "Phase 1", whyTarget: "One-time cardiovascular gene editing", marketCap: "~$400-800M", category: "Gene Therapy / Gene Editing" },
  { rank: 94, ticker: "DAWN", name: "Day One Biopharmaceuticals", focus: "Pediatric oncology", pipeline: "Tovorafenib (pediatric LGG)", stage: "Commercial", whyTarget: "Approved pediatric brain tumor drug", marketCap: "~$1-2B", category: "Oncology - Solid Tumors" },
  { rank: 95, ticker: "ADCT", name: "ADC Therapeutics", focus: "Antibody drug conjugates", pipeline: "ZYNLONTA (approved DLBCL)", stage: "Commercial", whyTarget: "Approved ADC, platform value", marketCap: "~$500M-1B", category: "Oncology - Hematologic" },
  { rank: 96, ticker: "XNCR", name: "Xencor", focus: "Engineered antibodies", pipeline: "Vudalimab, plamotamab", stage: "Phase 2/3", whyTarget: "XmAb platform, multiple partnerships", marketCap: "~$1-2B", category: "Platform / Technology" },
  
  // ADDITIONAL HIGH-POTENTIAL TARGETS
  { rank: 97, ticker: "NTLA", name: "Intellia Therapeutics", focus: "In vivo CRISPR gene editing", pipeline: "NTLA-2001 (ATTR), NTLA-2002 (HAE)", stage: "Phase 3", whyTarget: "Leading in vivo CRISPR platform", marketCap: "~$2-4B", category: "Gene Therapy / Gene Editing" },
  { rank: 98, ticker: "BEAM", name: "Beam Therapeutics", focus: "Base editing gene therapy", pipeline: "BEAM-101 (SCD), others", stage: "Phase 1/2", whyTarget: "Next-gen CRISPR (base editing)", marketCap: "~$1-2B", category: "Gene Therapy / Gene Editing" },
  { rank: 99, ticker: "SRPT", name: "Sarepta Therapeutics", focus: "Gene therapy for DMD", pipeline: "Elevidys (approved DMD), multiple DMD drugs", stage: "Commercial", whyTarget: "DMD gene therapy leader, rare disease", marketCap: "~$8-12B", category: "Rare Diseases / Orphan Drugs" },
  { rank: 100, ticker: "REGN", name: "Regeneron Pharmaceuticals", focus: "Large-cap biotech (reference)", pipeline: "Eylea, Dupixent, Libtayo", stage: "Commercial", whyTarget: "Reference company - strategic acquirer not target", marketCap: "~$80-100B", category: "Platform / Technology", note: "Large cap reference - unlikely M&A target" },
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
  { name: "Top M&A Targets 2025", icon: TrendingUp, color: "bg-emerald-500" },
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

// M&A Due Diligence Red Flags
interface DueDiligenceCategory {
  name: string;
  icon: typeof AlertTriangle;
  color: string;
  items: { flag: string; severity: 'critical' | 'major' | 'moderate' }[];
}

const dueDiligenceRedFlags: DueDiligenceCategory[] = [
  {
    name: "Regulatory",
    icon: FileWarning,
    color: "text-red-500",
    items: [
      { flag: "FDA clinical holds", severity: "critical" },
      { flag: "Complete Response Letters (CRLs)", severity: "critical" },
      { flag: "Manufacturing issues", severity: "major" },
      { flag: "Whistleblower complaints", severity: "major" },
    ]
  },
  {
    name: "IP/Legal",
    icon: Gavel,
    color: "text-orange-500",
    items: [
      { flag: "Weak patent estate", severity: "major" },
      { flag: "Third-party IP challenges", severity: "critical" },
      { flag: "Litigation ongoing", severity: "major" },
      { flag: "Freedom-to-operate issues", severity: "critical" },
    ]
  },
  {
    name: "Financial",
    icon: Wallet,
    color: "text-amber-500",
    items: [
      { flag: "Complex capital structure", severity: "major" },
      { flag: "Oppressive debt terms", severity: "major" },
      { flag: "Litigation liabilities", severity: "moderate" },
      { flag: "Related-party transactions", severity: "moderate" },
    ]
  },
  {
    name: "Commercial",
    icon: Store,
    color: "text-yellow-500",
    items: [
      { flag: "Unrealistic peak sales models", severity: "major" },
      { flag: "No market access strategy", severity: "major" },
      { flag: "Reimbursement challenges", severity: "moderate" },
      { flag: "Competitive threats", severity: "moderate" },
    ]
  },
];

// Post-Merger Integration Challenges
const integrationFailureReasons = [
  { reason: "Cultural mismatch", percentage: 30, severity: "critical" as const },
  { reason: "Key employee departure", percentage: 25, severity: "critical" as const },
  { reason: "Clinical program setbacks", percentage: 20, severity: "major" as const },
  { reason: "Regulatory surprises", percentage: 15, severity: "major" as const },
  { reason: "Commercial underperformance", percentage: 10, severity: "moderate" as const },
  { reason: "Integration costs exceed expectations", percentage: 10, severity: "moderate" as const },
];

const integrationSuccessFactors = [
  "Clear strategic rationale",
  "Strong clinical data",
  "Experienced acquired team stays",
  "Realistic synergy expectations",
  "Smooth FDA interactions",
];

// M&A Monitoring Sources
const monitoringDataSources = [
  { source: "SEC Filings", details: "13D, 13G (activist stakes), 8-K (material events)" },
  { source: "Conference Presentations", details: "Management at investor conferences" },
  { source: "Analyst Coverage", details: "Initiations, upgrades citing M&A" },
  { source: "News", details: "Bloomberg, Reuters, BioPharma Dive, FierceBiotech" },
  { source: "Clinical Trial Databases", details: "ClinicalTrials.gov (data readouts)" },
  { source: "Patent Databases", details: "USPTO, EPO (freedom to operate)" },
];

const leadingIndicators = [
  { indicator: "Activist investor 13D filing (>5% stake, pushing agenda)", bullish: true },
  { indicator: "Strategic review announced", bullish: true },
  { indicator: "CFO or CEO departure (often precedes deal)", bullish: true },
  { indicator: "Hiring of M&A advisor (investment bank)", bullish: true },
  { indicator: "Board changes (adding transaction experience)", bullish: true },
  { indicator: "Partnership renegotiations", bullish: true },
  { indicator: "Large insider buying", bullish: true },
];

// M&A Outlook 2025-2026
const bullishFactors = [
  "Big Pharma patent cliffs accelerating (Humira, Keytruda, others)",
  "Record cash on Big Pharma balance sheets",
  "Biotech valuations depressed (buying opportunity)",
  "Successful 2023-2024 deals validate market",
  "Obesity/GLP-1 mania creating competition",
  "Gene therapy proving out (commercial validation)",
  "Cell therapy off-the-shelf solutions maturing",
];

const bearishFactors = [
  "Interest rates (though declining now)",
  "IRA drug pricing concerns (lower ROI projections)",
  "FDA scrutiny increasing",
  "Failed Phase 3 trials damaging sector confidence",
  "Geopolitical tensions (China partnerships)",
];

// M&A Probability Scoring Model
interface MAProbabilityScore {
  ticker: string;
  name: string;
  category: string;
  stage: string;
  marketCap: string;
  clinicalDataScore: number; // 0-25
  marketOpportunityScore: number; // 0-25
  strategicFitScore: number; // 0-25
  financialPositionScore: number; // 0-25
  totalScore: number; // 0-100
  rank: number;
}

// Calculate M&A probability scores for each company
const calculateMAProbabilityScores = (companies: SmallCapCompany[]): MAProbabilityScore[] => {
  const scoredCompanies = companies.map(company => {
    // Clinical Data Score (0-25)
    let clinicalDataScore = 0;
    const stage = company.stage.toLowerCase();
    if (stage.includes("approved") || stage.includes("commercial")) clinicalDataScore = 25;
    else if (stage.includes("phase 3")) clinicalDataScore = 22;
    else if (stage.includes("phase 2b")) clinicalDataScore = 18;
    else if (stage.includes("phase 2")) clinicalDataScore = 15;
    else if (stage.includes("phase 1/2")) clinicalDataScore = 12;
    else if (stage.includes("phase 1")) clinicalDataScore = 8;
    else clinicalDataScore = 4;
    
    // Bonus for breakthrough therapy, orphan status mentioned
    if (company.whyTarget.toLowerCase().includes("breakthrough")) clinicalDataScore = Math.min(25, clinicalDataScore + 3);
    if (company.whyTarget.toLowerCase().includes("orphan")) clinicalDataScore = Math.min(25, clinicalDataScore + 2);
    
    // Market Opportunity Score (0-25)
    let marketOpportunityScore = 0;
    const hotSectorNames = ["obesity", "metabolic", "nash", "glp-1", "immunology", "autoimmune", "oncology", "cns", "rare"];
    const focusLower = company.focus.toLowerCase();
    const categoryLower = company.category.toLowerCase();
    hotSectorNames.forEach(sector => {
      if (focusLower.includes(sector) || categoryLower.includes(sector)) {
        marketOpportunityScore += 4;
      }
    });
    marketOpportunityScore = Math.min(25, marketOpportunityScore);
    
    // Bonus for "large market", "unmet need", "first-in-class", "best-in-class"
    if (company.whyTarget.toLowerCase().includes("large")) marketOpportunityScore = Math.min(25, marketOpportunityScore + 3);
    if (company.whyTarget.toLowerCase().includes("unmet")) marketOpportunityScore = Math.min(25, marketOpportunityScore + 2);
    if (company.whyTarget.toLowerCase().includes("first-in-class")) marketOpportunityScore = Math.min(25, marketOpportunityScore + 3);
    if (company.whyTarget.toLowerCase().includes("best-in-class")) marketOpportunityScore = Math.min(25, marketOpportunityScore + 3);
    
    // Strategic Fit Score (0-25)
    let strategicFitScore = 0;
    if (company.whyTarget.toLowerCase().includes("platform")) strategicFitScore += 5;
    if (company.whyTarget.toLowerCase().includes("partnership") || company.whyTarget.toLowerCase().includes("partner")) strategicFitScore += 4;
    if (company.whyTarget.toLowerCase().includes("validated")) strategicFitScore += 4;
    if (company.whyTarget.toLowerCase().includes("oral")) strategicFitScore += 3;
    if (company.whyTarget.toLowerCase().includes("differentiated")) strategicFitScore += 3;
    if (company.whyTarget.toLowerCase().includes("novel")) strategicFitScore += 2;
    if (company.category === "Top M&A Targets 2025") strategicFitScore += 8;
    strategicFitScore = Math.min(25, strategicFitScore);
    
    // Financial Position Score (0-25)
    let financialPositionScore = 0;
    const marketCapStr = company.marketCap;
    // Sweet spot is $500M-$3B
    if (marketCapStr.includes("500M") || marketCapStr.includes("700M") || marketCapStr.includes("800M")) {
      financialPositionScore = 22;
    } else if (marketCapStr.includes("1-2B") || marketCapStr.includes("1.5-3B") || marketCapStr.includes("2-4B")) {
      financialPositionScore = 25;
    } else if (marketCapStr.includes("3-5B") || marketCapStr.includes("4-7B")) {
      financialPositionScore = 18;
    } else if (marketCapStr.includes("200") || marketCapStr.includes("300") || marketCapStr.includes("400")) {
      financialPositionScore = 20;
    } else if (marketCapStr.includes("100") || marketCapStr.includes("50")) {
      financialPositionScore = 15;
    } else if (marketCapStr.includes("5-8B") || marketCapStr.includes("8-12B")) {
      financialPositionScore = 10;
    } else {
      financialPositionScore = 12;
    }
    
    // Penalty for notes suggesting already acquired or too large
    if (company.note?.toLowerCase().includes("acquired")) financialPositionScore = 5;
    if (company.note?.toLowerCase().includes("unlikely")) financialPositionScore = 8;
    
    const totalScore = clinicalDataScore + marketOpportunityScore + strategicFitScore + financialPositionScore;
    
    return {
      ticker: company.ticker,
      name: company.name,
      category: company.category,
      stage: company.stage,
      marketCap: company.marketCap,
      clinicalDataScore,
      marketOpportunityScore,
      strategicFitScore,
      financialPositionScore,
      totalScore,
      rank: 0, // Will be set after sorting
    };
  });
  
  // Sort by total score and assign ranks
  scoredCompanies.sort((a, b) => b.totalScore - a.totalScore);
  scoredCompanies.forEach((c, idx) => {
    c.rank = idx + 1;
  });
  
  return scoredCompanies;
};

// Historical M&A deal data for visualization
interface HistoricalMADeal {
  year: number;
  quarter: string;
  target: string;
  acquirer: string;
  dealValue: number; // billions USD
  premium: number; // percentage premium over market cap
  sector: string;
  stage: string;
  notes?: string;
}

const historicalMADeals: HistoricalMADeal[] = [
  // 2024 Deals
  { year: 2024, quarter: "Q4", target: "Mirati Therapeutics", acquirer: "Bristol Myers Squibb", dealValue: 4.8, premium: 52, sector: "Oncology", stage: "Approved" },
  { year: 2024, quarter: "Q3", target: "Morphic Holding", acquirer: "Eli Lilly", dealValue: 3.2, premium: 79, sector: "Immunology", stage: "Phase 2" },
  { year: 2024, quarter: "Q2", target: "Alpine Immune Sciences", acquirer: "Vertex", dealValue: 4.9, premium: 67, sector: "Immunology", stage: "Phase 2" },
  { year: 2024, quarter: "Q1", target: "Karuna Therapeutics", acquirer: "Bristol Myers Squibb", dealValue: 14.0, premium: 53, sector: "CNS", stage: "Phase 3" },
  { year: 2024, quarter: "Q1", target: "Cerevel Therapeutics", acquirer: "AbbVie", dealValue: 8.7, premium: 52, sector: "CNS", stage: "Phase 3" },
  { year: 2024, quarter: "Q1", target: "Inhibrx", acquirer: "Sanofi", dealValue: 2.2, premium: 121, sector: "CNS", stage: "Phase 2" },
  { year: 2024, quarter: "Q2", target: "Albireo Pharma", acquirer: "Ipsen", dealValue: 0.95, premium: 43, sector: "Rare Disease", stage: "Approved" },
  { year: 2024, quarter: "Q2", target: "Gracell Biotech", acquirer: "AstraZeneca", dealValue: 1.2, premium: 61, sector: "Oncology", stage: "Phase 1/2" },
  
  // 2023 Deals
  { year: 2023, quarter: "Q4", target: "Chinook Therapeutics", acquirer: "Novartis", dealValue: 3.5, premium: 67, sector: "Nephrology", stage: "Phase 2/3" },
  { year: 2023, quarter: "Q4", target: "Immune Design", acquirer: "Merck", dealValue: 0.3, premium: 89, sector: "Oncology", stage: "Phase 2" },
  { year: 2023, quarter: "Q3", target: "Prometheus Biosciences", acquirer: "Merck", dealValue: 10.8, premium: 75, sector: "Immunology", stage: "Phase 2" },
  { year: 2023, quarter: "Q3", target: "Seagen", acquirer: "Pfizer", dealValue: 43.0, premium: 33, sector: "Oncology", stage: "Approved" },
  { year: 2023, quarter: "Q2", target: "Horizon Therapeutics", acquirer: "Amgen", dealValue: 27.8, premium: 48, sector: "Rare Disease", stage: "Approved" },
  { year: 2023, quarter: "Q1", target: "CinCor Pharma", acquirer: "AstraZeneca", dealValue: 1.8, premium: 142, sector: "Cardiovascular", stage: "Phase 2" },
  
  // 2022 Deals
  { year: 2022, quarter: "Q4", target: "Imago Biosciences", acquirer: "Merck", dealValue: 1.35, premium: 107, sector: "Oncology", stage: "Phase 2" },
  { year: 2022, quarter: "Q3", target: "Turning Point Therapeutics", acquirer: "Bristol Myers Squibb", dealValue: 4.1, premium: 122, sector: "Oncology", stage: "Phase 2" },
  { year: 2022, quarter: "Q2", target: "Biohaven Pharmaceutical", acquirer: "Pfizer", dealValue: 11.6, premium: 79, sector: "CNS", stage: "Approved" },
  { year: 2022, quarter: "Q1", target: "Arena Pharmaceuticals", acquirer: "Pfizer", dealValue: 6.7, premium: 100, sector: "Immunology", stage: "Phase 3" },
  
  // 2021 Deals
  { year: 2021, quarter: "Q4", target: "Acceleron Pharma", acquirer: "Merck", dealValue: 11.5, premium: 65, sector: "Cardiovascular", stage: "Approved" },
  { year: 2021, quarter: "Q3", target: "Trillium Therapeutics", acquirer: "Pfizer", dealValue: 2.26, premium: 203, sector: "Oncology", stage: "Phase 1" },
  { year: 2021, quarter: "Q2", target: "Tril (5 Prime)", acquirer: "Amgen", dealValue: 1.9, premium: 89, sector: "Oncology", stage: "Phase 2" },
  { year: 2021, quarter: "Q1", target: "VelosBio", acquirer: "Merck", dealValue: 2.75, premium: 64, sector: "Oncology", stage: "Phase 1" },
  
  // 2020 Deals
  { year: 2020, quarter: "Q4", target: "Alexion Pharmaceuticals", acquirer: "AstraZeneca", dealValue: 39.0, premium: 45, sector: "Rare Disease", stage: "Approved" },
  { year: 2020, quarter: "Q3", target: "Immunomedics", acquirer: "Gilead", dealValue: 21.0, premium: 108, sector: "Oncology", stage: "Approved" },
  { year: 2020, quarter: "Q2", target: "Forty Seven", acquirer: "Gilead", dealValue: 4.9, premium: 65, sector: "Oncology", stage: "Phase 1" },
  { year: 2020, quarter: "Q1", target: "Portola Pharmaceuticals", acquirer: "Alexion", dealValue: 1.4, premium: 132, sector: "Hematology", stage: "Approved" },
];

// Helper to parse market cap range to midpoint value (in millions)
const parseMarketCap = (marketCap: string): number => {
  const cleaned = marketCap.replace(/[~$]/g, '').trim();
  const match = cleaned.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(B|M)?/i);
  if (match) {
    const low = parseFloat(match[1]);
    const high = parseFloat(match[2]);
    const unit = match[3]?.toUpperCase() || 'M';
    const mid = (low + high) / 2;
    return unit === 'B' ? mid * 1000 : mid;
  }
  const singleMatch = cleaned.match(/(\d+(?:\.\d+)?)\s*(B|M)?/i);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    const unit = singleMatch[2]?.toUpperCase() || 'M';
    return unit === 'B' ? val * 1000 : val;
  }
  return 500; // default
};

// Chart colors
const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(217, 91%, 60%)',
  'hsl(262, 83%, 58%)',
  'hsl(332, 87%, 70%)',
  'hsl(24, 95%, 53%)',
  'hsl(142, 71%, 45%)',
  'hsl(187, 92%, 41%)',
  'hsl(45, 93%, 47%)',
  'hsl(0, 84%, 60%)',
  'hsl(280, 87%, 65%)',
];

export const Top50SmallCapFirms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("list");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  
  // Company detail modal state
  const [selectedCompanyTicker, setSelectedCompanyTicker] = useState<string | null>(null);
  
  // M&A Scores filtering and sorting state
  const [scoreCategoryFilter, setScoreCategoryFilter] = useState<string>("all");
  const [scoreStageFilter, setScoreStageFilter] = useState<string>("all");
  const [scoreSearchQuery, setScoreSearchQuery] = useState("");
  const [scoreMinTotal, setScoreMinTotal] = useState<number>(0);
  const [scoreSortField, setScoreSortField] = useState<string>("totalScore");
  const [scoreSortDirection, setScoreSortDirection] = useState<"asc" | "desc">("desc");

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

  // Chart data calculations
  const marketCapByCategory = useMemo(() => {
    return categories.map(cat => {
      const catCompanies = companies.filter(c => c.category === cat.name);
      const totalMarketCap = catCompanies.reduce((sum, c) => sum + parseMarketCap(c.marketCap), 0);
      const avgMarketCap = catCompanies.length > 0 ? totalMarketCap / catCompanies.length : 0;
      return {
        name: cat.name.split(' ')[0], // Short name for chart
        fullName: cat.name,
        count: catCompanies.length,
        avgMarketCap: Math.round(avgMarketCap),
        totalMarketCap: Math.round(totalMarketCap),
      };
    });
  }, []);

  const stageDistribution = useMemo(() => {
    const stages: Record<string, number> = {
      'Approved/Commercial': 0,
      'Phase 3': 0,
      'Phase 2': 0,
      'Phase 1': 0,
      'Preclinical/Platform': 0,
    };
    companies.forEach(c => {
      if (c.stage.includes('Approved') || c.stage.includes('Commercial')) stages['Approved/Commercial']++;
      else if (c.stage.includes('Phase 3')) stages['Phase 3']++;
      else if (c.stage.includes('Phase 2')) stages['Phase 2']++;
      else if (c.stage.includes('Phase 1')) stages['Phase 1']++;
      else stages['Preclinical/Platform']++;
    });
    return Object.entries(stages).map(([name, value]) => ({ name, value }));
  }, []);

  const marketCapRanges = useMemo(() => {
    const ranges: Record<string, number> = {
      '$50M-$300M': 0,
      '$300M-$700M': 0,
      '$700M-$1.5B': 0,
      '$1.5B-$3B': 0,
      '$3B+': 0,
    };
    companies.forEach(c => {
      const mcap = parseMarketCap(c.marketCap);
      if (mcap < 300) ranges['$50M-$300M']++;
      else if (mcap < 700) ranges['$300M-$700M']++;
      else if (mcap < 1500) ranges['$700M-$1.5B']++;
      else if (mcap < 3000) ranges['$1.5B-$3B']++;
      else ranges['$3B+']++;
    });
    return Object.entries(ranges).map(([name, value]) => ({ name, value }));
  }, []);

  // M&A Probability Scores
  const maProbabilityScores = useMemo(() => {
    return calculateMAProbabilityScores(companies);
  }, []);

  // Filtered and sorted M&A scores
  const filteredMAProbabilityScores = useMemo(() => {
    let filtered = [...maProbabilityScores];
    
    // Apply search
    if (scoreSearchQuery) {
      const q = scoreSearchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.ticker.toLowerCase().includes(q) || 
        s.name.toLowerCase().includes(q)
      );
    }
    
    // Apply category filter
    if (scoreCategoryFilter !== "all") {
      filtered = filtered.filter(s => s.category === scoreCategoryFilter);
    }
    
    // Apply stage filter
    if (scoreStageFilter !== "all") {
      filtered = filtered.filter(s => s.stage.toLowerCase().includes(scoreStageFilter.toLowerCase()));
    }
    
    // Apply min score filter
    if (scoreMinTotal > 0) {
      filtered = filtered.filter(s => s.totalScore >= scoreMinTotal);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[scoreSortField as keyof typeof a] as number;
      const bVal = b[scoreSortField as keyof typeof b] as number;
      return scoreSortDirection === "desc" ? bVal - aVal : aVal - bVal;
    });
    
    return filtered;
  }, [maProbabilityScores, scoreSearchQuery, scoreCategoryFilter, scoreStageFilter, scoreMinTotal, scoreSortField, scoreSortDirection]);

  // Selected company for modal
  const selectedCompanyScore = useMemo(() => {
    if (!selectedCompanyTicker) return null;
    return maProbabilityScores.find(s => s.ticker === selectedCompanyTicker) || null;
  }, [selectedCompanyTicker, maProbabilityScores]);

  const selectedCompanyInfo = useMemo(() => {
    if (!selectedCompanyTicker) return null;
    return companies.find(c => c.ticker === selectedCompanyTicker) || null;
  }, [selectedCompanyTicker]);

  const toggleScoreSort = (field: string) => {
    if (scoreSortField === field) {
      setScoreSortDirection(prev => prev === "desc" ? "asc" : "desc");
    } else {
      setScoreSortField(field);
      setScoreSortDirection("desc");
    }
  };

  const getSortIcon = (field: string) => {
    if (scoreSortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return scoreSortDirection === "desc" ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />;
  };
  const dealsByYear = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024];
    return years.map(year => {
      const yearDeals = historicalMADeals.filter(d => d.year === year);
      const totalValue = yearDeals.reduce((sum, d) => sum + d.dealValue, 0);
      const avgPremium = yearDeals.length > 0 
        ? yearDeals.reduce((sum, d) => sum + d.premium, 0) / yearDeals.length 
        : 0;
      return {
        year,
        dealCount: yearDeals.length,
        totalValue: Math.round(totalValue * 10) / 10,
        avgPremium: Math.round(avgPremium),
      };
    });
  }, []);

  const premiumBySector = useMemo(() => {
    const sectors = [...new Set(historicalMADeals.map(d => d.sector))];
    return sectors.map(sector => {
      const sectorDeals = historicalMADeals.filter(d => d.sector === sector);
      const avgPremium = sectorDeals.reduce((sum, d) => sum + d.premium, 0) / sectorDeals.length;
      const avgValue = sectorDeals.reduce((sum, d) => sum + d.dealValue, 0) / sectorDeals.length;
      return {
        sector,
        avgPremium: Math.round(avgPremium),
        avgValue: Math.round(avgValue * 10) / 10,
        dealCount: sectorDeals.length,
      };
    }).sort((a, b) => b.avgPremium - a.avgPremium);
  }, []);

  const premiumByStage = useMemo(() => {
    const stages = ['Phase 1', 'Phase 2', 'Phase 3', 'Approved'];
    return stages.map(stage => {
      const stageDeals = historicalMADeals.filter(d => 
        d.stage.toLowerCase().includes(stage.toLowerCase().replace('phase ', ''))
      );
      if (stageDeals.length === 0) return null;
      const avgPremium = stageDeals.reduce((sum, d) => sum + d.premium, 0) / stageDeals.length;
      const avgValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0) / stageDeals.length;
      return {
        stage,
        avgPremium: Math.round(avgPremium),
        avgValue: Math.round(avgValue * 10) / 10,
        dealCount: stageDeals.length,
      };
    }).filter(Boolean);
  }, []);

  const dealScatterData = useMemo(() => {
    return historicalMADeals.map(deal => ({
      ...deal,
      x: deal.dealValue,
      y: deal.premium,
      z: deal.dealValue * 100, // Size
    }));
  }, []);

  // Comparison data
  const comparisonCompanies = useMemo(() => {
    return companies.filter(c => selectedForComparison.includes(c.ticker));
  }, [selectedForComparison]);

  const radarData = useMemo(() => {
    if (comparisonCompanies.length === 0) return [];
    
    const metrics = ['Market Cap', 'Stage Progress', 'M&A Potential', 'Pipeline Strength', 'Platform Value'];
    return metrics.map(metric => {
      const dataPoint: Record<string, number | string> = { metric };
      comparisonCompanies.forEach(c => {
        let score = 50;
        switch (metric) {
          case 'Market Cap':
            const mcap = parseMarketCap(c.marketCap);
            score = Math.min(100, (mcap / 5000) * 100);
            break;
          case 'Stage Progress':
            if (c.stage.includes('Approved') || c.stage.includes('Commercial')) score = 100;
            else if (c.stage.includes('Phase 3')) score = 80;
            else if (c.stage.includes('Phase 2')) score = 60;
            else if (c.stage.includes('Phase 1')) score = 40;
            else score = 20;
            break;
          case 'M&A Potential':
            const mcapMa = parseMarketCap(c.marketCap);
            // Sweet spot is $500M-$2B
            if (mcapMa >= 500 && mcapMa <= 2000) score = 90;
            else if (mcapMa < 500) score = 70;
            else score = 50;
            break;
          case 'Pipeline Strength':
            score = Math.min(100, 50 + c.pipeline.split(',').length * 15);
            break;
          case 'Platform Value':
            if (c.category.includes('Platform') || c.whyTarget.toLowerCase().includes('platform')) score = 90;
            else score = 50;
            break;
        }
        dataPoint[c.ticker] = score;
      });
      return dataPoint;
    });
  }, [comparisonCompanies]);

  const toggleCompanySelection = (ticker: string) => {
    setSelectedForComparison(prev => 
      prev.includes(ticker) 
        ? prev.filter(t => t !== ticker)
        : prev.length < 5 ? [...prev, ticker] : prev
    );
  };

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

      {/* View Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 lg:w-[900px]">
          <TabsTrigger value="list" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Companies</span>
          </TabsTrigger>
          <TabsTrigger value="charts" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Charts</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">M&A History</span>
          </TabsTrigger>
          <TabsTrigger value="redflags" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Red Flags</span>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="gap-2">
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">M&A Scores</span>
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2">
            <GitCompare className="h-4 w-4" />
            <span className="hidden sm:inline">Compare ({selectedForComparison.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* LIST TAB */}
        <TabsContent value="list" className="space-y-6">
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
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>Showing {filteredCompanies.length} of {companies.length} companies</span>
                {selectedForComparison.length > 0 && (
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("compare")} className="gap-2">
                    <GitCompare className="h-3 w-3" />
                    Compare {selectedForComparison.length} selected
                  </Button>
                )}
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
                          <TableHead className="w-[50px]">
                            <span className="sr-only">Select</span>
                          </TableHead>
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
                            <TableCell>
                              <Checkbox
                                checked={selectedForComparison.includes(company.ticker)}
                                onCheckedChange={() => toggleCompanySelection(company.ticker)}
                                disabled={!selectedForComparison.includes(company.ticker) && selectedForComparison.length >= 5}
                              />
                            </TableCell>
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
        </TabsContent>

        {/* CHARTS TAB */}
        <TabsContent value="charts" className="space-y-6">
          {/* Market Cap by Category */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Average Market Cap by Category
                </CardTitle>
                <CardDescription>Average market cap (millions USD) per therapeutic area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketCapByCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => `$${v}M`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.fullName}</p>
                                <p className="text-sm text-muted-foreground">Avg: ${data.avgMarketCap}M</p>
                                <p className="text-sm text-muted-foreground">Companies: {data.count}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="avgMarketCap" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Stage Distribution
                </CardTitle>
                <CardDescription>Companies by development stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={stageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}
                      >
                        {stageDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Cap Range Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Market Cap Distribution
              </CardTitle>
              <CardDescription>Number of companies in each market cap range - "M&A Sweet Spot" is $500M-$2B</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketCapRanges}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm">{data.value} companies</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {marketCapRanges.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === '$700M-$1.5B' || entry.name === '$1.5B-$3B' 
                            ? 'hsl(142, 71%, 45%)' 
                            : CHART_COLORS[index % CHART_COLORS.length]} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} />
                  <span className="text-muted-foreground">M&A Sweet Spot ($700M-$3B)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Company count and market metrics by therapeutic area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {marketCapByCategory.map((cat, idx) => (
                  <div key={cat.name} className="p-4 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span className="font-medium text-sm">{cat.fullName}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{cat.count}</p>
                      <p className="text-xs text-muted-foreground">Avg: ${cat.avgMarketCap}M</p>
                      <p className="text-xs text-muted-foreground">Total: ${(cat.totalMarketCap / 1000).toFixed(1)}B</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* M&A HISTORY TAB */}
        <TabsContent value="history" className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-background border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-3xl font-bold text-green-500">${historicalMADeals.reduce((sum, d) => sum + d.dealValue, 0).toFixed(1)}B</p>
                    <p className="text-sm text-muted-foreground">Total Deal Value (2020-2024)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-background border-blue-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-3xl font-bold text-blue-500">{historicalMADeals.length}</p>
                    <p className="text-sm text-muted-foreground">Major Acquisitions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/10 to-background border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Percent className="h-8 w-8 text-amber-500" />
                  <div>
                    <p className="text-3xl font-bold text-amber-500">{Math.round(historicalMADeals.reduce((sum, d) => sum + d.premium, 0) / historicalMADeals.length)}%</p>
                    <p className="text-sm text-muted-foreground">Average Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-background border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-3xl font-bold text-purple-500">${(historicalMADeals.reduce((sum, d) => sum + d.dealValue, 0) / historicalMADeals.length).toFixed(1)}B</p>
                    <p className="text-sm text-muted-foreground">Average Deal Size</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* M&A Activity Over Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                M&A Activity Over Time (2020-2024)
              </CardTitle>
              <CardDescription>Deal count, total value, and average premium by year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dealsByYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}B`} />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold text-lg">{data.year}</p>
                              <p className="text-sm text-muted-foreground">Deals: {data.dealCount}</p>
                              <p className="text-sm text-green-500">Total Value: ${data.totalValue}B</p>
                              <p className="text-sm text-amber-500">Avg Premium: {data.avgPremium}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalValue" name="Total Deal Value ($B)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="avgPremium" name="Avg Premium (%)" stroke="hsl(45, 93%, 47%)" strokeWidth={3} dot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Premium Analysis */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Premium by Sector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-amber-500" />
                  Acquisition Premiums by Sector
                </CardTitle>
                <CardDescription>Average premium paid in each therapeutic area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={premiumBySector} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="sector" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.sector}</p>
                                <p className="text-sm text-amber-500">Avg Premium: {data.avgPremium}%</p>
                                <p className="text-sm text-green-500">Avg Deal Size: ${data.avgValue}B</p>
                                <p className="text-sm text-muted-foreground">{data.dealCount} deals</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="avgPremium" fill="hsl(45, 93%, 47%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Premium by Stage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-blue-500" />
                  Acquisition Premiums by Stage
                </CardTitle>
                <CardDescription>Earlier stage = higher premium (more risk, more upside)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={premiumByStage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="stage" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.stage}</p>
                                <p className="text-sm text-amber-500">Avg Premium: {data.avgPremium}%</p>
                                <p className="text-sm text-green-500">Avg Deal Size: ${data.avgValue}B</p>
                                <p className="text-sm text-muted-foreground">{data.dealCount} deals</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="avgPremium" radius={[4, 4, 0, 0]}>
                        {premiumByStage.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deal Value vs Premium Scatter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                Deal Value vs. Premium Analysis
              </CardTitle>
              <CardDescription>Larger bubbles = higher deal value. Hover for details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Deal Value" 
                      tickFormatter={(v) => `$${v}B`} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      label={{ value: 'Deal Value ($B)', position: 'bottom', offset: 0 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Premium" 
                      tickFormatter={(v) => `${v}%`} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      label={{ value: 'Premium (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 2000]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.target}</p>
                              <p className="text-sm text-muted-foreground">Acquirer: {data.acquirer}</p>
                              <p className="text-sm text-green-500">Deal Value: ${data.dealValue}B</p>
                              <p className="text-sm text-amber-500">Premium: {data.premium}%</p>
                              <p className="text-sm">{data.sector} • {data.stage}</p>
                              <p className="text-xs text-muted-foreground">{data.quarter} {data.year}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter name="M&A Deals" data={dealScatterData} fill="hsl(var(--primary))" fillOpacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deals Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Historical M&A Transactions (2020-2024)
              </CardTitle>
              <CardDescription>Complete list of major biotech acquisitions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year/Qtr</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Acquirer</TableHead>
                      <TableHead className="text-right">Deal Value</TableHead>
                      <TableHead className="text-right">Premium</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Stage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historicalMADeals.map((deal, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-mono text-sm">{deal.quarter} {deal.year}</TableCell>
                        <TableCell className="font-medium">{deal.target}</TableCell>
                        <TableCell>{deal.acquirer}</TableCell>
                        <TableCell className="text-right font-bold text-green-500">${deal.dealValue}B</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={deal.premium >= 100 ? "destructive" : deal.premium >= 60 ? "default" : "secondary"}>
                            {deal.premium}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{deal.sector}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{deal.stage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RED FLAGS TAB */}
        <TabsContent value="redflags" className="space-y-6">
          {/* Due Diligence Red Flags Header */}
          <Card className="border-red-500/30 bg-gradient-to-br from-red-500/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                    M&A Due Diligence Red Flags
                  </CardTitle>
                  <CardDescription className="mt-1">Critical warning signs that could derail an acquisition or lead to failed integration</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => exportRedFlagsToExcel(dueDiligenceRedFlags)}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Export Excel
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Red Flags by Category */}
          <div className="grid gap-6 md:grid-cols-2">
            {dueDiligenceRedFlags.map(category => {
              const Icon = category.icon;
              return (
                <Card key={category.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${category.color}`} />
                      {category.name} Red Flags
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <XCircle className={`h-5 w-5 mt-0.5 ${
                          item.severity === 'critical' ? 'text-red-500' :
                          item.severity === 'major' ? 'text-orange-500' : 'text-amber-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{item.flag}</p>
                          <Badge variant="outline" className={`mt-1 ${
                            item.severity === 'critical' ? 'border-red-500/50 text-red-500' :
                            item.severity === 'major' ? 'border-orange-500/50 text-orange-500' : 
                            'border-amber-500/50 text-amber-500'
                          }`}>
                            {item.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Post-Merger Integration Challenges */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <AlertOctagon className="h-5 w-5" />
                  Why M&A Fails
                </CardTitle>
                <CardDescription>Common reasons for post-merger integration failures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={integrationFailureReasons} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="reason" type="category" width={150} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-semibold">{data.reason}</p>
                                <p className="text-sm text-red-500">Failure Rate: {data.percentage}%</p>
                                <Badge variant="outline" className={`mt-1 ${
                                  data.severity === 'critical' ? 'text-red-500' : 
                                  data.severity === 'major' ? 'text-orange-500' : 'text-amber-500'
                                }`}>
                                  {data.severity}
                                </Badge>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {integrationFailureReasons.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.severity === 'critical' ? 'hsl(0, 84%, 60%)' : 
                                  entry.severity === 'major' ? 'hsl(24, 95%, 53%)' : 'hsl(45, 93%, 47%)'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  Success Factors
                </CardTitle>
                <CardDescription>What makes M&A integration succeed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {integrationSuccessFactors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <p className="font-medium">{factor}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* M&A Monitoring Guide */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  How to Monitor M&A Activity
                </CardTitle>
                <CardDescription>Key data sources for tracking potential deals</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>What to Monitor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monitoringDataSources.map((source, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{source.source}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{source.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Leading Indicators of M&A
                </CardTitle>
                <CardDescription>Early signals that a deal may be coming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {leadingIndicators.map((indicator, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <p className="text-sm">{indicator.indicator}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* M&A Outlook 2025-2026 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Biotech M&A Outlook 2025-2026
              </CardTitle>
              <CardDescription>Net Assessment: 2025-2026 will be active M&A years. Expect 15-25 deals {">"} $1B, 50-75 deals $100M-$1B.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-green-500 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Bullish Factors
                  </h4>
                  <div className="space-y-2">
                    {bullishFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-500 mb-3 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Bearish Factors
                  </h4>
                  <div className="space-y-2">
                    {bearishFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* M&A SCORING TAB */}
        <TabsContent value="scoring" className="space-y-6">
          {/* Scoring Header with Export */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-primary" />
                    M&A Probability Scoring Model
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Companies ranked by likelihood of acquisition based on clinical data, market opportunity, strategic fit, and financial position (0-100 score)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => exportMARankingsToExcel(maProbabilityScores)}>
                    <FileSpreadsheet className="h-4 w-4" />
                    Rankings Excel
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => exportCombinedMAReport(maProbabilityScores, dueDiligenceRedFlags)}>
                    <Download className="h-4 w-4" />
                    Full Report
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Filters for M&A Scores */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[180px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ticker or company..."
                      value={scoreSearchQuery}
                      onChange={(e) => setScoreSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={scoreCategoryFilter} onValueChange={setScoreCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={scoreStageFilter} onValueChange={setScoreStageFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="phase 3">Phase 3</SelectItem>
                    <SelectItem value="phase 2">Phase 2</SelectItem>
                    <SelectItem value="phase 1">Phase 1</SelectItem>
                    <SelectItem value="preclinical">Preclinical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={String(scoreMinTotal)} onValueChange={(v) => setScoreMinTotal(Number(v))}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Min score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Score</SelectItem>
                    <SelectItem value="40">Score ≥ 40</SelectItem>
                    <SelectItem value="50">Score ≥ 50</SelectItem>
                    <SelectItem value="60">Score ≥ 60</SelectItem>
                    <SelectItem value="70">Score ≥ 70</SelectItem>
                    <SelectItem value="80">Score ≥ 80</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Showing {filteredMAProbabilityScores.length} of {maProbabilityScores.length} companies
                {(scoreCategoryFilter !== "all" || scoreStageFilter !== "all" || scoreMinTotal > 0 || scoreSearchQuery) && (
                  <Button variant="ghost" size="sm" className="ml-2 h-6 text-xs" onClick={() => {
                    setScoreCategoryFilter("all");
                    setScoreStageFilter("all");
                    setScoreMinTotal(0);
                    setScoreSearchQuery("");
                  }}>
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 M&A Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Top 10 Most Likely M&A Targets (2025)
              </CardTitle>
              <CardDescription>Based on clinical data, market opportunity, strategic fit, and financial position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {maProbabilityScores.slice(0, 10).map((company, idx) => (
                  <Card key={company.ticker} className={`cursor-pointer hover:border-primary/50 transition-colors ${idx < 3 ? 'border-amber-500/50 bg-amber-500/5' : ''}`} onClick={() => setSelectedCompanyTicker(company.ticker)}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={idx < 3 ? "default" : "secondary"} className={idx < 3 ? 'bg-amber-500' : ''}>
                          #{company.rank}
                        </Badge>
                        <span className="text-2xl font-bold text-primary">{company.totalScore}</span>
                      </div>
                      <a 
                        href={`https://finance.yahoo.com/quote/${company.ticker}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        {company.ticker}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-sm text-muted-foreground line-clamp-1">{company.name}</p>
                      <Badge variant="outline" className="mt-2 text-xs">{company.category.split(' ')[0]}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scoring Breakdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Top 20 Companies - Score Breakdown
              </CardTitle>
              <CardDescription>Breakdown of M&A attractiveness scores by component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={maProbabilityScores.slice(0, 20)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="ticker" type="category" width={60} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-semibold">{data.ticker} - {data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.category}</p>
                              <div className="mt-2 space-y-1 text-sm">
                                <p>Clinical Data: <span className="font-bold text-blue-500">{data.clinicalDataScore}/25</span></p>
                                <p>Market Opportunity: <span className="font-bold text-green-500">{data.marketOpportunityScore}/25</span></p>
                                <p>Strategic Fit: <span className="font-bold text-purple-500">{data.strategicFitScore}/25</span></p>
                                <p>Financial Position: <span className="font-bold text-amber-500">{data.financialPositionScore}/25</span></p>
                                <p className="font-bold text-primary pt-1 border-t">Total: {data.totalScore}/100</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="clinicalDataScore" name="Clinical Data" stackId="a" fill="hsl(217, 91%, 60%)" />
                    <Bar dataKey="marketOpportunityScore" name="Market Opportunity" stackId="a" fill="hsl(142, 71%, 45%)" />
                    <Bar dataKey="strategicFitScore" name="Strategic Fit" stackId="a" fill="hsl(262, 83%, 58%)" />
                    <Bar dataKey="financialPositionScore" name="Financial Position" stackId="a" fill="hsl(45, 93%, 47%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Full Ranking Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                {scoreCategoryFilter !== "all" || scoreStageFilter !== "all" || scoreMinTotal > 0 || scoreSearchQuery
                  ? "Filtered M&A Probability Rankings"
                  : "Complete M&A Probability Rankings"}
              </CardTitle>
              <CardDescription>
                {filteredMAProbabilityScores.length} companies • Click any row to view detailed breakdown • Click headers to sort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="w-[60px]">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1" onClick={() => toggleScoreSort("rank")}>
                          Rank {getSortIcon("rank")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[80px]">Ticker</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1" onClick={() => toggleScoreSort("clinicalDataScore")}>
                          Clinical {getSortIcon("clinicalDataScore")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1" onClick={() => toggleScoreSort("marketOpportunityScore")}>
                          Market {getSortIcon("marketOpportunityScore")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1" onClick={() => toggleScoreSort("strategicFitScore")}>
                          Strategic {getSortIcon("strategicFitScore")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1" onClick={() => toggleScoreSort("financialPositionScore")}>
                          Financial {getSortIcon("financialPositionScore")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                        <Button variant="ghost" size="sm" className="gap-1 h-7 px-1 font-bold" onClick={() => toggleScoreSort("totalScore")}>
                          Total {getSortIcon("totalScore")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMAProbabilityScores.map((company) => (
                      <TableRow 
                        key={company.ticker} 
                        className={`cursor-pointer hover:bg-primary/5 ${company.rank <= 10 ? 'bg-amber-500/5' : ''}`}
                        onClick={() => setSelectedCompanyTicker(company.ticker)}
                      >
                        <TableCell>
                          <Badge variant={company.rank <= 3 ? "default" : company.rank <= 10 ? "secondary" : "outline"} 
                                 className={company.rank <= 3 ? 'bg-amber-500' : ''}>
                            #{company.rank}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a 
                            href={`https://finance.yahoo.com/quote/${company.ticker}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.ticker}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </TableCell>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{company.category.split('/')[0].trim()}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{company.stage}</TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${company.clinicalDataScore >= 20 ? 'text-green-500' : company.clinicalDataScore >= 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {company.clinicalDataScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${company.marketOpportunityScore >= 20 ? 'text-green-500' : company.marketOpportunityScore >= 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {company.marketOpportunityScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${company.strategicFitScore >= 20 ? 'text-green-500' : company.strategicFitScore >= 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {company.strategicFitScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-medium ${company.financialPositionScore >= 20 ? 'text-green-500' : company.financialPositionScore >= 15 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {company.financialPositionScore}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold text-lg ${company.totalScore >= 80 ? 'text-green-500' : company.totalScore >= 60 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                            {company.totalScore}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Methodology */}
          <Card>
            <CardHeader>
              <CardTitle>Scoring Methodology</CardTitle>
              <CardDescription>How each component is scored (0-25 points each, max 100 total)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold text-blue-500 mb-2">Clinical Data (0-25)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Approved/Commercial: 25</li>
                    <li>• Phase 3: 22</li>
                    <li>• Phase 2b: 18</li>
                    <li>• Phase 2: 15</li>
                    <li>• Phase 1/2: 12</li>
                    <li>• +3 for BTD status</li>
                    <li>• +2 for orphan designation</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-green-500 mb-2">Market Opportunity (0-25)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Hot sectors: +4 each</li>
                    <li>• (Obesity, NASH, GLP-1, etc.)</li>
                    <li>• Large market: +3</li>
                    <li>• Unmet need: +2</li>
                    <li>• First-in-class: +3</li>
                    <li>• Best-in-class: +3</li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold text-purple-500 mb-2">Strategic Fit (0-25)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Platform company: +5</li>
                    <li>• Existing partnership: +4</li>
                    <li>• Validated mechanism: +4</li>
                    <li>• Oral formulation: +3</li>
                    <li>• Differentiated: +3</li>
                    <li>• Top M&A Target 2025: +8</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h4 className="font-semibold text-amber-500 mb-2">Financial Position (0-25)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Sweet spot ($1-4B): 25</li>
                    <li>• Good range ($500M-$700M): 22</li>
                    <li>• Smaller ($200-400M): 20</li>
                    <li>• Large ($3-5B): 18</li>
                    <li>• Very small ({"<"}$200M): 15</li>
                    <li>• Too large or acquired: 5-10</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPARE TAB */}
        <TabsContent value="compare" className="space-y-6">
          {/* Selection Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-primary" />
                Company Comparison Tool
              </CardTitle>
              <CardDescription>Select up to 5 companies to compare side-by-side. Go to Company List tab to select companies.</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedForComparison.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GitCompare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No companies selected for comparison</p>
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("list")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Select Companies
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {comparisonCompanies.map(c => (
                    <Badge key={c.ticker} variant="secondary" className="gap-2 py-2 px-3">
                      <span className="font-mono font-bold">{c.ticker}</span>
                      <span className="text-muted-foreground">|</span>
                      <span>{c.name}</span>
                      <button onClick={() => toggleCompanySelection(c.ticker)} className="ml-1 hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedForComparison.length < 5 && (
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("list")} className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add More
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {comparisonCompanies.length > 0 && (
            <>
              {/* Radar Chart Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>M&A Attractiveness Radar</CardTitle>
                  <CardDescription>Comparative analysis of key M&A metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={10} />
                        {comparisonCompanies.map((c, idx) => (
                          <Radar
                            key={c.ticker}
                            name={c.ticker}
                            dataKey={c.ticker}
                            stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                            fill={CHART_COLORS[idx % CHART_COLORS.length]}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Metric</TableHead>
                        {comparisonCompanies.map(c => (
                          <TableHead key={c.ticker} className="min-w-[200px]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-primary">{c.ticker}</span>
                              <a href={`https://finance.yahoo.com/quote/${c.ticker}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </a>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Company</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker}>{c.name}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Category</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker}>
                            <Badge variant="outline">{c.category}</Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Focus</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker} className="text-sm">{c.focus}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pipeline</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker} className="text-sm">{c.pipeline}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Stage</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker}>
                            <Badge variant="outline" className={getStageColor(c.stage)}>
                              {c.stage}
                            </Badge>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Market Cap</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker} className="font-bold text-green-500">{c.marketCap}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Why M&A Target</TableCell>
                        {comparisonCompanies.map(c => (
                          <TableCell key={c.ticker} className="text-sm text-muted-foreground">{c.whyTarget}</TableCell>
                        ))}
                      </TableRow>
                      {comparisonCompanies.some(c => c.note) && (
                        <TableRow>
                          <TableCell className="font-medium">Notes</TableCell>
                          {comparisonCompanies.map(c => (
                            <TableCell key={c.ticker} className="text-sm text-amber-500">{c.note || '-'}</TableCell>
                          ))}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="pt-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-amber-500">Disclaimer:</strong> This list represents small-cap biotechs ($100M-$5B market cap) with innovative science, clinical validation, and strategic value that make them attractive acquisition targets. Market caps and status as of early 2025; always verify current status before investment decisions. This is not investment advice.
          </p>
        </CardContent>
      </Card>

      {/* Company Detail Modal */}
      <CompanyDetailModal
        open={!!selectedCompanyTicker}
        onOpenChange={(open) => { if (!open) setSelectedCompanyTicker(null); }}
        score={selectedCompanyScore}
        companyInfo={selectedCompanyInfo}
      />
    </div>
  );
};

export default Top50SmallCapFirms;
