import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  TrendingUp, 
  Building2, 
  Target,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface Drug {
  name: string;
  company: string;
  mechanism: string;
  indication: string;
  peakSales: string;
  status: string;
  nct: string;
}

interface TherapeuticAreaData {
  name: string;
  drugs: Drug[];
}

const top100Data: TherapeuticAreaData[] = [
  {
    name: "Oncology/Hematology",
    drugs: [
      { name: "Iberdomide", company: "Bristol Myers Squibb", mechanism: "Oral CELMoD", indication: "Multiple myeloma", peakSales: "$2-3B", status: "Phase 3", nct: "TBD" },
      { name: "Mezigdomide", company: "Bristol Myers Squibb", mechanism: "Oral CELMoD", indication: "Multiple myeloma", peakSales: "$1-2B", status: "Phase 3", nct: "TBD" },
      { name: "Ivonescimab", company: "Summit/Akeso", mechanism: "PD-1/VEGF bispecific", indication: "EGFR+ lung cancer", peakSales: "$2-3B", status: "Phase 3", nct: "TBD" },
      { name: "Daraxonrasib", company: "Revolution Medicines", mechanism: "Pan-RAS inhibitor", indication: "Pancreatic cancer", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Cretostimogene", company: "CG Oncology", mechanism: "Oncolytic virus", indication: "Bladder cancer", peakSales: "Blockbuster", status: "Phase 3, Filing 2025", nct: "TBD" },
    ]
  },
  {
    name: "Cardiovascular/Cardiology",
    drugs: [
      { name: "Aficamten (CK-274)", company: "Cytokinetics", mechanism: "Cardiac myosin inhibitor", indication: "Hypertrophic cardiomyopathy", peakSales: "$2.8B by 2030", status: "Approved 2025", nct: "NCT04219826" },
      { name: "Olpasiran", company: "Amgen", mechanism: "siRNA APOC3 inhibitor", indication: "Hypertriglyceridemia", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Zilebesiran", company: "Novartis", mechanism: "siRNA angiotensinogen", indication: "Hypertension", peakSales: "$1-2B", status: "Phase 3", nct: "TBD" },
      { name: "Obicetrapib", company: "NewAmsterdam Pharma", mechanism: "CETP inhibitor", indication: "Cardiovascular disease", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Pelacarsen", company: "Novartis/Ionis", mechanism: "ASO Lp(a)", indication: "Cardiovascular disease", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Neurology/CNS",
    drugs: [
      { name: "Tolebrutinib", company: "Sanofi", mechanism: "BTK inhibitor", indication: "Secondary progressive MS", peakSales: "$1.2B by 2030", status: "Phase 3 positive", nct: "TBD" },
      { name: "Donanemab", company: "Eli Lilly", mechanism: "Anti-amyloid mAb", indication: "Alzheimer's disease", peakSales: "$5B+", status: "Approved 2024", nct: "NCT04437511" },
      { name: "Remternetug", company: "Eli Lilly", mechanism: "Anti-amyloid mAb", indication: "Alzheimer's disease", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Oveporexton", company: "Takeda", mechanism: "Orexin-2 agonist", indication: "Narcolepsy", peakSales: "$2-3B", status: "Filing late 2025", nct: "TBD" },
      { name: "Trontinemab", company: "Roche", mechanism: "Anti-tau antibody", indication: "Alzheimer's disease", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Psychiatry/Mental Health",
    drugs: [
      { name: "Pimavanserin", company: "Acadia", mechanism: "5-HT2A inverse agonist", indication: "Major depressive disorder", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Zuranolone", company: "Biogen/Sage", mechanism: "GABA-A modulator", indication: "Postpartum depression", peakSales: "$1.5B+", status: "Approved 2023", nct: "NCT02978326" },
      { name: "KarXT", company: "Bristol Myers Squibb/Karuna", mechanism: "M1/M4 agonist", indication: "Schizophrenia", peakSales: "$4B+", status: "Approved 2024", nct: "NCT03697252" },
      { name: "Emraclidine", company: "Cerevel", mechanism: "M4 agonist", indication: "Schizophrenia", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "SEP-363856", company: "Sumitomo", mechanism: "TAAR1 agonist", indication: "Schizophrenia", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Endocrinology & Metabolism",
    drugs: [
      { name: "Orforglipron", company: "Eli Lilly", mechanism: "Oral GLP-1 agonist", indication: "Type 2 diabetes & obesity", peakSales: "$8-10B+", status: "Phase 3, Filing 2025-26", nct: "Multiple ACHIEVE/ATTAIN" },
      { name: "Retatrutide", company: "Eli Lilly", mechanism: "GIP/GLP-1/glucagon agonist", indication: "Obesity", peakSales: "$2-5B", status: "Phase 3", nct: "TBD" },
      { name: "CagriSema", company: "Novo Nordisk", mechanism: "Cagrilintide/semaglutide", indication: "Obesity", peakSales: "$3B+", status: "Phase 3", nct: "TBD" },
      { name: "Survodutide", company: "Boehringer Ingelheim", mechanism: "GLP-1/glucagon dual agonist", indication: "MASH/Obesity", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Petrelintide", company: "AstraZeneca", mechanism: "GLP-1/NPY2R", indication: "Obesity", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Immunology & Inflammation",
    drugs: [
      { name: "Depemokimab", company: "GSK", mechanism: "IL-5 mAb (6-month dosing)", indication: "Severe asthma", peakSales: "$1B+", status: "Phase 3 positive", nct: "TBD" },
      { name: "Brensocatib", company: "Insmed", mechanism: "DPP1 inhibitor", indication: "Bronchiectasis", peakSales: "$2.8B by 2030", status: "Phase 3 positive", nct: "TBD" },
      { name: "Etrasimod", company: "Pfizer", mechanism: "S1P modulator", indication: "Inflammatory bowel disease", peakSales: "$1.5B+", status: "Approved 2023", nct: "NCT03945188" },
      { name: "Nipocalimab", company: "J&J", mechanism: "FcRn blocker", indication: "Myasthenia gravis", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Rademikibart", company: "Boehringer Ingelheim", mechanism: "IL-4Rα inhibitor", indication: "Atopic dermatitis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Rheumatology",
    drugs: [
      { name: "Deucravacitinib (Sotyktu)", company: "Bristol Myers Squibb", mechanism: "TYK2 inhibitor", indication: "Psoriatic arthritis", peakSales: "$2B+", status: "Phase 3, Approved for psoriasis", nct: "TBD" },
      { name: "Bimekizumab", company: "UCB", mechanism: "IL-17A/F inhibitor", indication: "Psoriatic arthritis", peakSales: "$3B+", status: "Approved 2024", nct: "NCT03895203" },
      { name: "Upadacitinib", company: "AbbVie", mechanism: "JAK1 inhibitor", indication: "Giant cell arteritis", peakSales: "$5B+ (across indications)", status: "Multiple Phase 3", nct: "TBD" },
      { name: "Imsidolimab", company: "Acelyrin", mechanism: "IL-36R mAb", indication: "Hidradenitis suppurativa", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Spesolimab", company: "Boehringer Ingelheim", mechanism: "IL-36R inhibitor", indication: "Generalized pustular psoriasis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Infectious Diseases",
    drugs: [
      { name: "Zoliflodacin", company: "Innoviva", mechanism: "Topoisomerase II inhibitor", indication: "Gonorrhea", peakSales: "$500M-1B", status: "Phase 3, Filing Q1 2025", nct: "TBD" },
      { name: "Clesrovimab (MK-1654)", company: "Merck", mechanism: "mAb", indication: "RSV prevention (infants)", peakSales: "$2B+", status: "Under FDA review", nct: "TBD" },
      { name: "Lenacapavir", company: "Gilead", mechanism: "Capsid inhibitor", indication: "HIV prevention (PrEP)", peakSales: "$3B+", status: "Phase 3", nct: "TBD" },
      { name: "Efinopegdutide", company: "HanAll/Sanofi", mechanism: "GLP-1/glucagon", indication: "MASH", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Rezafungin", company: "Cidara", mechanism: "Echinocandin", indication: "Invasive candidiasis", peakSales: "$500M+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Respiratory/Pulmonology",
    drugs: [
      { name: "Brensocatib", company: "Insmed", mechanism: "DPP1 inhibitor", indication: "Bronchiectasis", peakSales: "$2.8B by 2030", status: "Phase 3 positive", nct: "TBD" },
      { name: "Depemokimab", company: "GSK", mechanism: "IL-5 mAb", indication: "Severe asthma", peakSales: "$1B+", status: "Phase 3 positive", nct: "TBD" },
      { name: "Tozorakimab", company: "AstraZeneca", mechanism: "Anti-IL-33 mAb", indication: "COPD", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Ensifentrine", company: "Verona Pharma", mechanism: "PDE3/4 inhibitor", indication: "COPD", peakSales: "$1B+", status: "Approved 2024", nct: "NCT03536455" },
      { name: "Itepekimab", company: "Sanofi/Regeneron", mechanism: "Anti-IL-33 mAb", indication: "COPD", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Gastroenterology & Hepatology",
    drugs: [
      { name: "Tremfya (guselkumab)", company: "J&J", mechanism: "IL-23 inhibitor", indication: "Crohn's disease", peakSales: "$8B+ (across indications)", status: "Phase 3 positive", nct: "TBD" },
      { name: "Survodutide", company: "Boehringer Ingelheim", mechanism: "GLP-1/glucagon dual agonist", indication: "MASH", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Resmetirom", company: "Madrigal", mechanism: "THR-β agonist", indication: "MASH", peakSales: "$2B+", status: "Approved 2024", nct: "NCT03900429" },
      { name: "Pemvidutide", company: "Altimmune", mechanism: "GLP-1/glucagon dual agonist", indication: "MASH", peakSales: "$1B+", status: "Phase 2", nct: "TBD" },
      { name: "Efruxifermin", company: "Akero", mechanism: "FGF21 analog", indication: "MASH", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Nephrology/Renal",
    drugs: [
      { name: "Atrasentan", company: "Chinook/Novartis", mechanism: "Endothelin receptor A", indication: "IgA nephropathy", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Sparsentan", company: "Travere", mechanism: "Dual endothelin/angiotensin blocker", indication: "IgA nephropathy", peakSales: "$1B+", status: "Approved 2023", nct: "NCT03493685" },
      { name: "Iptacopan", company: "Novartis", mechanism: "Factor B inhibitor", indication: "IgA nephropathy", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Bardoxolone methyl", company: "Reata", mechanism: "Nrf2 activator", indication: "Alport syndrome", peakSales: "$500M+", status: "Phase 3", nct: "TBD" },
      { name: "Zilucoplan", company: "UCB", mechanism: "C5 inhibitor", indication: "IgA nephropathy", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Dermatology",
    drugs: [
      { name: "Lebrikizumab", company: "Eli Lilly", mechanism: "IL-13 inhibitor", indication: "Atopic dermatitis", peakSales: "$2B+", status: "Approved 2024", nct: "NCT04146363" },
      { name: "Rademikibart", company: "Boehringer Ingelheim", mechanism: "IL-4Rα inhibitor", indication: "Atopic dermatitis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Nemolizumab", company: "Galderma", mechanism: "IL-31RA mAb", indication: "Prurigo nodularis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Spesolimab", company: "Boehringer Ingelheim", mechanism: "IL-36R inhibitor", indication: "Generalized pustular psoriasis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Rocatinlimab", company: "Amgen", mechanism: "OX40 mAb", indication: "Atopic dermatitis", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Ophthalmology",
    drugs: [
      { name: "Avacincaptad pegol", company: "Astellas/Iveric", mechanism: "C5 inhibitor", indication: "Geographic atrophy", peakSales: "$2B+", status: "Approved 2023", nct: "NCT04435366" },
      { name: "Pegcetacoplan", company: "Apellis", mechanism: "C3 inhibitor", indication: "Geographic atrophy", peakSales: "$1.5B+", status: "Approved 2023", nct: "NCT03525613" },
      { name: "GT005", company: "Gyroscope", mechanism: "Gene therapy", indication: "Dry AMD", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Zimura (avacincaptad pegol)", company: "Iveric Bio", mechanism: "C5 inhibitor", indication: "Stargardt disease", peakSales: "$500M+", status: "Phase 3", nct: "TBD" },
      { name: "RGX-314", company: "Regenxbio", mechanism: "Gene therapy", indication: "Wet AMD", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Rare Diseases/Orphan",
    drugs: [
      { name: "Apitegromab", company: "Scholar Rock", mechanism: "Myostatin inhibitor", indication: "Spinal muscular atrophy", peakSales: "$2B+", status: "Phase 3, Under FDA review", nct: "TBD" },
      { name: "Acoramidis", company: "BridgeBio", mechanism: "TTR stabilizer", indication: "ATTR cardiomyopathy", peakSales: "$2B+", status: "Approved 2024", nct: "NCT04685408" },
      { name: "Vutrisiran", company: "Alnylam", mechanism: "siRNA TTR", indication: "ATTR polyneuropathy", peakSales: "$2B+", status: "Approved 2022", nct: "NCT03759379" },
      { name: "Olipudase alfa", company: "Sanofi", mechanism: "ASM replacement", indication: "Acid sphingomyelinase deficiency", peakSales: "$500M+", status: "Approved 2022", nct: "NCT02004704" },
      { name: "Pabinafusp alfa", company: "JCR Pharma", mechanism: "ERT", indication: "MPS II (Hunter syndrome)", peakSales: "$500M+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Vaccines & Virology",
    drugs: [
      { name: "mRES (mRNA-1345)", company: "Moderna", mechanism: "mRNA RSV vaccine", indication: "RSV prevention (adults 60+)", peakSales: "$2-3B", status: "Approved 2024", nct: "NCT05127434" },
      { name: "mRNA-1010", company: "Moderna", mechanism: "mRNA influenza vaccine", indication: "Seasonal influenza", peakSales: "$3-5B", status: "Phase 3", nct: "TBD" },
      { name: "mRNA-1647", company: "Moderna", mechanism: "mRNA CMV vaccine", indication: "Cytomegalovirus prevention", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "NVX-CoV2601", company: "Novavax", mechanism: "Protein-based COVID vaccine", indication: "COVID-19 prevention", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Clesrovimab (MK-1654)", company: "Merck", mechanism: "mAb RSV", indication: "RSV prevention (infants)", peakSales: "$2B+", status: "Under FDA review", nct: "TBD" },
    ]
  },
  {
    name: "Women's Health",
    drugs: [
      { name: "Elagolix combination", company: "AbbVie", mechanism: "GnRH antagonist + HRT", indication: "Endometriosis", peakSales: "$2B+", status: "Approved 2018/2020", nct: "NCT02143713" },
      { name: "Linzagolix", company: "Obeva", mechanism: "GnRH antagonist", indication: "Uterine fibroids", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Fezolinetant", company: "Astellas", mechanism: "NK3 receptor antagonist", indication: "Menopausal vasomotor symptoms", peakSales: "$1.5B+", status: "Approved 2023", nct: "NCT04003155" },
      { name: "Zuranolone", company: "Biogen/Sage", mechanism: "GABA-A modulator", indication: "Postpartum depression", peakSales: "$1.5B+", status: "Approved 2023", nct: "NCT02978326" },
      { name: "Elinzanetant", company: "Bayer", mechanism: "NK1/3 dual antagonist", indication: "Menopausal vasomotor symptoms", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Urology",
    drugs: [
      { name: "Cretostimogene", company: "CG Oncology", mechanism: "Oncolytic virus", indication: "Non-muscle invasive bladder cancer", peakSales: "Blockbuster", status: "Phase 3, Filing 2025", nct: "TBD" },
      { name: "Vibegron", company: "Urovant/Sumitomo", mechanism: "β3-adrenergic agonist", indication: "Overactive bladder", peakSales: "$1B+", status: "Approved 2020", nct: "NCT03492281" },
      { name: "TAR-200", company: "Johnson & Johnson", mechanism: "Intravesical gemcitabine", indication: "Bladder cancer", peakSales: "$1B+", status: "Phase 3", nct: "TBD" },
      { name: "Nadofaragene firadenovec", company: "Ferring", mechanism: "Gene therapy", indication: "BCG-unresponsive bladder cancer", peakSales: "$500M+", status: "Approved 2022", nct: "NCT02773849" },
      { name: "Niraparib", company: "GSK", mechanism: "PARP inhibitor", indication: "Prostate cancer", peakSales: "$1.5B+ (across indications)", status: "Phase 3", nct: "TBD" },
    ]
  },
  {
    name: "Pain Management/Anesthesia",
    drugs: [
      { name: "Tanezumab", company: "Pfizer/Lilly", mechanism: "Anti-NGF mAb", indication: "Osteoarthritis pain", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Fasinumab", company: "Regeneron/Teva", mechanism: "Anti-NGF mAb", indication: "Osteoarthritis pain", peakSales: "$1.5B+", status: "Phase 3", nct: "TBD" },
      { name: "Resiniferatoxin", company: "Sorrento/NIH", mechanism: "TRPV1 agonist", indication: "Cancer pain", peakSales: "$500M+", status: "Phase 3", nct: "TBD" },
      { name: "VX-548", company: "Vertex", mechanism: "Nav1.8 inhibitor", indication: "Acute pain", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Oliceridine", company: "Trevena", mechanism: "Biased μ-opioid agonist", indication: "Acute pain", peakSales: "$500M+", status: "Approved 2020", nct: "NCT02815709" },
    ]
  },
  {
    name: "Transplantation & Cell/Gene Therapy",
    drugs: [
      { name: "Exa-cel (CTX001)", company: "Vertex/CRISPR Therapeutics", mechanism: "CRISPR gene editing", indication: "Sickle cell disease", peakSales: "$2B+", status: "Approved 2023", nct: "NCT03655678" },
      { name: "Lovo-cel (bb1111)", company: "bluebird bio", mechanism: "Gene therapy", indication: "Sickle cell disease", peakSales: "$1B+", status: "Approved 2023", nct: "NCT02906202" },
      { name: "Axicabtagene ciloleucel", company: "Gilead/Kite", mechanism: "CAR-T", indication: "Second-line lymphoma", peakSales: "$2B+ (total CAR-T)", status: "Phase 3", nct: "NCT03391466" },
      { name: "Lisocabtagene", company: "BMS/Juno", mechanism: "CAR-T", indication: "Second-line lymphoma", peakSales: "$1.5B+", status: "Phase 3", nct: "NCT03483103" },
      { name: "Valoctocogene roxaparvovec", company: "BioMarin", mechanism: "AAV gene therapy", indication: "Hemophilia A", peakSales: "$1B+", status: "Approved 2023", nct: "NCT03370913" },
    ]
  },
  {
    name: "Pediatrics",
    drugs: [
      { name: "Alyftrek (Vanzacaftor triple)", company: "Vertex", mechanism: "CFTR modulator", indication: "Cystic fibrosis", peakSales: "$8.3B by 2030", status: "Approved 2024", nct: "NCT04537793" },
      { name: "Apitegromab", company: "Scholar Rock", mechanism: "Myostatin inhibitor", indication: "Spinal muscular atrophy", peakSales: "$2B+", status: "Phase 3", nct: "TBD" },
      { name: "Clesrovimab (MK-1654)", company: "Merck", mechanism: "mAb RSV", indication: "RSV prevention (infants)", peakSales: "$2B+", status: "Under FDA review", nct: "TBD" },
      { name: "Exa-cel (CTX001)", company: "Vertex/CRISPR", mechanism: "CRISPR gene editing", indication: "Sickle cell disease (pediatric)", peakSales: "$2B+", status: "Approved 2023", nct: "NCT03655678" },
      { name: "Ryoncil", company: "Mesoblast", mechanism: "Stem cell therapy", indication: "Pediatric GVHD", peakSales: "$500M+", status: "Approved 2025", nct: "NCT02336230" },
    ]
  },
];

const getStatusColor = (status: string) => {
  if (status.toLowerCase().includes('approved')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (status.toLowerCase().includes('filing')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  if (status.toLowerCase().includes('review')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
  if (status.toLowerCase().includes('positive')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
  return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
};

const getPeakSalesValue = (peakSales: string): number => {
  if (peakSales.includes('8-10')) return 9;
  if (peakSales.includes('8.3')) return 8.3;
  if (peakSales.includes('8')) return 8;
  if (peakSales.includes('5')) return 5;
  if (peakSales.includes('4')) return 4;
  if (peakSales.includes('3-5')) return 4;
  if (peakSales.includes('3')) return 3;
  if (peakSales.includes('2.8')) return 2.8;
  if (peakSales.includes('2-5')) return 3.5;
  if (peakSales.includes('2-3')) return 2.5;
  if (peakSales.includes('2')) return 2;
  if (peakSales.includes('1.5')) return 1.5;
  if (peakSales.includes('1-2')) return 1.5;
  if (peakSales.includes('1')) return 1;
  if (peakSales.includes('500')) return 0.5;
  if (peakSales.toLowerCase().includes('blockbuster')) return 1.5;
  return 1;
};

export function Top100BlockbusterDrugs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTA, setSelectedTA] = useState<string>('all');
  const [expandedTAs, setExpandedTAs] = useState<Set<string>>(new Set(top100Data.map(ta => ta.name)));

  const toggleTA = (taName: string) => {
    const newExpanded = new Set(expandedTAs);
    if (newExpanded.has(taName)) {
      newExpanded.delete(taName);
    } else {
      newExpanded.add(taName);
    }
    setExpandedTAs(newExpanded);
  };

  const expandAll = () => setExpandedTAs(new Set(top100Data.map(ta => ta.name)));
  const collapseAll = () => setExpandedTAs(new Set());

  const filteredData = top100Data
    .filter(ta => selectedTA === 'all' || ta.name === selectedTA)
    .map(ta => ({
      ...ta,
      drugs: ta.drugs.filter(drug => {
        const query = searchQuery.toLowerCase();
        return !query ||
          drug.name.toLowerCase().includes(query) ||
          drug.company.toLowerCase().includes(query) ||
          drug.mechanism.toLowerCase().includes(query) ||
          drug.indication.toLowerCase().includes(query);
      })
    }))
    .filter(ta => ta.drugs.length > 0);

  const totalDrugs = filteredData.reduce((sum, ta) => sum + ta.drugs.length, 0);
  const approvedCount = filteredData.reduce((sum, ta) => 
    sum + ta.drugs.filter(d => d.status.toLowerCase().includes('approved')).length, 0
  );
  const phase3Count = filteredData.reduce((sum, ta) => 
    sum + ta.drugs.filter(d => d.status.toLowerCase().includes('phase 3') && !d.status.toLowerCase().includes('approved')).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Top 100 Blockbuster-Potential Drugs
          </h2>
          <p className="text-muted-foreground mt-1">
            Phase 3 novel molecules with &gt;$1B revenue potential across 20 therapeutic areas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDrugs}</p>
                <p className="text-xs text-muted-foreground">Total Molecules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedCount}</p>
                <p className="text-xs text-muted-foreground">Recently Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{phase3Count}</p>
                <p className="text-xs text-muted-foreground">In Phase 3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">20</p>
                <p className="text-xs text-muted-foreground">Therapeutic Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by drug name, company, mechanism, or indication..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedTA} onValueChange={setSelectedTA}>
          <SelectTrigger className="w-full sm:w-[280px]">
            <SelectValue placeholder="Filter by Therapeutic Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Therapeutic Areas</SelectItem>
            {top100Data.map(ta => (
              <SelectItem key={ta.name} value={ta.name}>{ta.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Drug List by TA */}
      <div className="space-y-4">
        {filteredData.map((ta) => (
          <Collapsible
            key={ta.name}
            open={expandedTAs.has(ta.name)}
            onOpenChange={() => toggleTA(ta.name)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedTAs.has(ta.name) ? (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                      <CardTitle className="text-lg">{ta.name}</CardTitle>
                      <Badge variant="secondary">{ta.drugs.length} drugs</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {ta.drugs.filter(d => d.status.toLowerCase().includes('approved')).length > 0 && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {ta.drugs.filter(d => d.status.toLowerCase().includes('approved')).length} Approved
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium">Drug Name</th>
                          <th className="text-left py-3 px-2 font-medium">Company</th>
                          <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Mechanism</th>
                          <th className="text-left py-3 px-2 font-medium">Indication</th>
                          <th className="text-left py-3 px-2 font-medium">Peak Sales</th>
                          <th className="text-left py-3 px-2 font-medium">Status</th>
                          <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">NCT#</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ta.drugs.map((drug, index) => (
                          <tr key={`${drug.name}-${index}`} className="border-b last:border-0 hover:bg-accent/30">
                            <td className="py-3 px-2 font-medium">{drug.name}</td>
                            <td className="py-3 px-2 text-muted-foreground">{drug.company}</td>
                            <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{drug.mechanism}</td>
                            <td className="py-3 px-2">{drug.indication}</td>
                            <td className="py-3 px-2">
                              <span className={`font-semibold ${getPeakSalesValue(drug.peakSales) >= 2 ? 'text-green-600' : 'text-yellow-600'}`}>
                                {drug.peakSales}
                              </span>
                            </td>
                            <td className="py-3 px-2">
                              <Badge className={getStatusColor(drug.status)} variant="secondary">
                                {drug.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 hidden lg:table-cell">
                              {drug.nct !== 'TBD' ? (
                                <a 
                                  href={`https://clinicaltrials.gov/ct2/show/${drug.nct}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline flex items-center gap-1"
                                >
                                  {drug.nct}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">TBD</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Footer Note */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Peak sales estimates are based on analyst consensus and market projections. 
            Status reflects the most advanced development stage. "Blockbuster" indicates &gt;$1B annual revenue potential.
            Data compiled from public sources and clinical trial registries.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
