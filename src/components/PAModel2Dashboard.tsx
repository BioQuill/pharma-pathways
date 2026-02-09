import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart3, Calculator, Globe, TrendingUp, Target, Lightbulb, FileText, FlaskConical, Info, Sliders } from "lucide-react";
import { Model2Calculator } from "@/components/Model2Calculator";
import { Model2PDFExport } from "@/components/Model2PDFExport";

// ============ STEP 1: HISTORICAL BASE RATES (20 TAs) ============
const historicalBaseRates = [
  { ta: "1. Oncology/Hematology", usComm: 75, usMed: 80, uk: 70, germany: 55, japan: 35, china: 30, india: 25, brazil: 35 },
  { ta: "2. Cardiovascular/Cardiology", usComm: 60, usMed: 65, uk: 45, germany: 45, japan: 25, china: 25, india: 20, brazil: 25 },
  { ta: "3. Neurology/Neuroscience", usComm: 65, usMed: 70, uk: 50, germany: 50, japan: 30, china: 28, india: 18, brazil: 28 },
  { ta: "4. Psychiatry/Mental Health", usComm: 62, usMed: 58, uk: 48, germany: 46, japan: 28, china: 26, india: 15, brazil: 24 },
  { ta: "5. Endocrinology & Metabolism", usComm: 58, usMed: 62, uk: 42, germany: 40, japan: 28, china: 22, india: 15, brazil: 22 },
  { ta: "6. Immunology & Inflammation", usComm: 68, usMed: 70, uk: 48, germany: 50, japan: 32, china: 28, india: 18, brazil: 25 },
  { ta: "7. Rheumatology", usComm: 66, usMed: 68, uk: 46, germany: 48, japan: 30, china: 26, india: 18, brazil: 24 },
  { ta: "8. Infectious Diseases", usComm: 70, usMed: 72, uk: 65, germany: 55, japan: 35, china: 32, india: 28, brazil: 32 },
  { ta: "9. Respiratory/Pulmonology", usComm: 62, usMed: 65, uk: 46, germany: 48, japan: 28, china: 24, india: 20, brazil: 24 },
  { ta: "10. Gastroenterology & Hepatology", usComm: 64, usMed: 68, uk: 47, germany: 48, japan: 30, china: 26, india: 19, brazil: 26 },
  { ta: "11. Nephrology/Renal", usComm: 63, usMed: 68, uk: 48, germany: 46, japan: 28, china: 26, india: 21, brazil: 26 },
  { ta: "12. Dermatology", usComm: 55, usMed: 50, uk: 40, germany: 45, japan: 25, china: 20, india: 15, brazil: 20 },
  { ta: "13. Ophthalmology", usComm: 72, usMed: 78, uk: 52, germany: 50, japan: 33, china: 28, india: 22, brazil: 28 },
  { ta: "14. Rare Diseases/Orphan", usComm: 85, usMed: 90, uk: 85, germany: 75, japan: 50, china: 40, india: 35, brazil: 45 },
  { ta: "15. Vaccines & Virology", usComm: 68, usMed: 70, uk: 72, germany: 60, japan: 45, china: 50, india: 45, brazil: 48 },
  { ta: "16. Women's Health", usComm: 52, usMed: 35, uk: 44, germany: 42, japan: 30, china: 28, india: 22, brazil: 26 },
  { ta: "17. Urology", usComm: 58, usMed: 62, uk: 44, germany: 44, japan: 26, china: 24, india: 20, brazil: 24 },
  { ta: "18. Pain Management/Anesthesia", usComm: 45, usMed: 48, uk: 38, germany: 40, japan: 22, china: 20, india: 16, brazil: 20 },
  { ta: "19. Transplant & Cell/Gene Therapy", usComm: 82, usMed: 88, uk: 78, germany: 70, japan: 52, china: 38, india: 28, brazil: 32 },
  { ta: "20. Pediatrics (cross-cutting)", usComm: "+10%", usMed: "+12%", uk: "+15%", germany: "+12%", japan: "+10%", china: "+8%", india: "+12%", brazil: "+10%" },
];

// ============ STEP 2: COMPARATOR SCORING ============
const comparativeMetrics = [
  { dimension: "Clinical Benefit", measurement: "Effect size (HR, OR, mean difference)", calculation: "Your molecule / Comparator avg" },
  { dimension: "Safety Profile", measurement: "Grade 3+ AE rate, discontinuation rate", calculation: "Comparator avg / Your molecule (inverse)" },
  { dimension: "ICER", measurement: "Cost per QALY or equivalent", calculation: "Comparator avg / Your molecule (inverse)" },
  { dimension: "Target Population", measurement: "Addressable patient count", calculation: "Your molecule / Comparator avg" },
  { dimension: "Price vs. SOC", measurement: "Annual cost per patient", calculation: "Comparator avg / Your molecule (inverse)" },
  { dimension: "Evidence Quality", measurement: "RCT design score (1-5 scale)", calculation: "Your molecule / Comparator avg" },
];

const compositeScoreInterpretation = [
  { range: ">1.2", label: "Significantly better than comparators", color: "bg-green-100 text-green-800 border-green-200" },
  { range: "1.0-1.2", label: "Similar to comparators", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { range: "0.8-1.0", label: "Slightly worse than comparators", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { range: "<0.8", label: "Significantly worse than comparators", color: "bg-red-100 text-red-800 border-red-200" },
];

// ============ STEP 3: TA BENCHMARKING TABLES ============
const taBenchmarkingData = [
  {
    ta: "1. Oncology/Hematology",
    benchmarks: [
      { molecule: "Enhertu (T-DXd)", indication: "HER2+ breast cancer", usApproval: "Yes", niceRec: "Yes", gba: "Considerable (3)", icer: "~$180K", keyEndpoint: "+6.8 months OS", successFactor: "Benefit in heavily pre-treated" },
      { molecule: "Tecartus (CAR-T)", indication: "MCL", usApproval: "Yes", niceRec: "Yes (CDF)", gba: "Not assessed", icer: "~$450K", keyEndpoint: "Durable remission", successFactor: "Curative potential, ultra-rare" },
      { molecule: "Calquence (acalabrutinib)", indication: "CLL", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~$165K", keyEndpoint: "Non-inferior, better tolerated", successFactor: "Safety vs. ibrutinib" },
      { molecule: "Trodelvy (sacituzumab)", indication: "TNBC", usApproval: "Yes", niceRec: "Yes (optimized)", gba: "Minor (4)", icer: "~$210K", keyEndpoint: "+5.1 months", successFactor: "Triple-negative unmet need" },
      { molecule: "Opdualag (nivo+relatlimab)", indication: "Melanoma", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$195K", keyEndpoint: "PFS benefit", successFactor: "Dual checkpoint novel combo" },
    ],
    example: {
      title: "Novel checkpoint + ADC combination for advanced NSCLC",
      yourMolecule: { clinicalBenefit: "HR 0.65 for OS", safety: "Grade 3+ AE 35%", icer: "$175K/QALY", population: "45K US patients/year", price: "$180K/year" },
      comparatorAvg: { clinicalBenefit: "HR 0.72", safety: "Grade 3+ AE 42%", icer: "$195K/QALY", population: "38K patients", price: "$165K/year" },
      ratios: ["Clinical: 0.65/0.72 = 1.11 (better HR)", "Safety: 42%/35% = 1.20 (better)", "ICER: $195K/$175K = 1.11", "Population: 45K/38K = 1.18", "Price: $165K/$180K = 0.92 (premium pricing)", "Evidence: 5/4.5 = 1.11"],
      compositeScore: "1.11",
      probability: { baseRate: "US Commercial Oncology: 75%", composite: "75% × 1.11 = 83.25%", adjustments: ["Breakthrough designation: +15%", "Budget impact >$500M/payer: -10%"], final: "83% + 15% - 10% = 88%" },
    },
  },
  {
    ta: "2. Cardiovascular/Cardiology",
    benchmarks: [
      { molecule: "Camzyos (mavacamten)", indication: "HCM", usApproval: "Yes", niceRec: "Yes", gba: "Considerable (3)", icer: "~$95K", keyEndpoint: "Symptom improvement", successFactor: "Disease-modifying HCM" },
      { molecule: "Jardiance (empagliflozin)", indication: "HFrEF", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~$45K", keyEndpoint: "25% hospitalizations ↓", successFactor: "CV outcomes proven" },
      { molecule: "Sotagliflozin", indication: "HFpEF + diabetes", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$78K", keyEndpoint: "33% death/HF hosp ↓", successFactor: "HFpEF unmet need" },
      { molecule: "Leqvio (inclisiran)", indication: "High cholesterol", usApproval: "Yes", niceRec: "Restricted (cost)", gba: "Minor (4)", icer: "~£135K", keyEndpoint: "LDL-C reduction", successFactor: "Twice-yearly dosing" },
    ],
    example: {
      title: "Novel PCSK9 inhibitor for LDL reduction",
      yourMolecule: { clinicalBenefit: "MACE 18% RRR, LDL-C 55%", safety: "4% ISRs", icer: "$130K/QALY", population: "Monthly SC", price: "$6,500/year" },
      comparatorAvg: { clinicalBenefit: "MACE 15% RRR, LDL-C 52%", safety: "5% ISRs", icer: "$145K/QALY", population: "Biweekly/twice-yearly", price: "$6,200/year" },
      ratios: ["Clinical MACE: 18%/15% = 1.20", "LDL-C: 55%/52% = 1.06", "Safety: 5%/4% = 1.25 (better)", "ICER: $145K/$130K = 1.12", "Dosing convenience: avg 0.8", "Price: $6,200/$6,500 = 0.95"],
      compositeScore: "1.06",
      probability: { baseRate: "US Commercial Cardiology: 60%", composite: "60% × 1.06 = 63.6%", adjustments: [], final: "63.6%" },
    },
  },
  {
    ta: "3. Neurology/Neuroscience",
    benchmarks: [
      { molecule: "Leqembi (lecanemab)", indication: "Early Alzheimer's", usApproval: "Yes", niceRec: "Restricted (cost)", gba: "Minor", icer: "~£450K", keyEndpoint: "27% CDR-SB slowing", successFactor: "Amyloid clearance, modest benefit" },
      { molecule: "Skyclarys (omaveloxolone)", indication: "Friedreich's ataxia", usApproval: "Yes", niceRec: "Not reviewed", gba: "Orphan exempt", icer: "~$370K", keyEndpoint: "mFARS improvement", successFactor: "Rare disease, first approval" },
      { molecule: "Qalsody (tofersen)", indication: "SOD1-ALS", usApproval: "Yes", niceRec: "Not reviewed", gba: "Orphan exempt", icer: "N/A", keyEndpoint: "Neurofilament reduction", successFactor: "Genetic subtype, biomarker" },
      { molecule: "Zurzuvae (zuranolone)", indication: "Postpartum depression", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$88K", keyEndpoint: "HAMD-17 remission", successFactor: "Rapid-acting, oral, 14-day" },
      { molecule: "Epidiolex (cannabidiol)", indication: "Dravet, LGS", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£28K", keyEndpoint: "Seizure reduction", successFactor: "Pediatric rare epilepsy" },
    ],
    example: {
      title: "Novel anti-tau therapy for Alzheimer's disease",
      yourMolecule: { clinicalBenefit: "CDR-SB 35% slowing", safety: "ARIA-E 8%", icer: "$280K/QALY", population: "Early AD, tau PET+", price: "N/A" },
      comparatorAvg: { clinicalBenefit: "CDR-SB 24% slowing", safety: "ARIA-E 14%", icer: "$450K/QALY", population: "Early AD, amyloid PET+", price: "N/A" },
      ratios: ["CDR-SB: 35%/24% = 1.46", "ADAS-Cog: 1.8/1.4 = 1.29", "Safety: 14%/8% = 1.75 (better)", "ICER: $450K/$280K = 1.61", "Biomarker: Both need PET = 1.0", "Evidence: Phase III vs. controversial = 1.2"],
      compositeScore: "1.39",
      probability: { baseRate: "US Commercial Neurology: 65%", composite: "65% × 1.39 = 90.35%", adjustments: ["Breakthrough designation: +12%", "Budget impact (Alzheimer's): -15%", "Novel mechanism (tau vs. amyloid): +10%"], final: "90% + 12% - 15% + 10% = 97% → cap at 95%" },
    },
  },
  {
    ta: "4. Psychiatry/Mental Health",
    benchmarks: [
      { molecule: "Spravato (esketamine)", indication: "TRD", usApproval: "Yes", niceRec: "Restricted", gba: "Non-quantifiable (5)", icer: "~£52K", keyEndpoint: "MADRS improvement", successFactor: "Rapid-acting, intranasal, REMS" },
      { molecule: "Auvelity (dex/bupropion)", indication: "MDD", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "~$65K", keyEndpoint: "Remission at week 2", successFactor: "Rapid onset, oral" },
      { molecule: "Lybalvi (olanzapine/samidorphan)", indication: "Schizophrenia, bipolar", usApproval: "Yes", niceRec: "Not reviewed", gba: "Minor (4)", icer: "~$48K", keyEndpoint: "Weight gain mitigation", successFactor: "Lower olanzapine weight" },
      { molecule: "Caplyta (lumateperone)", indication: "Bipolar depression", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "~$72K", keyEndpoint: "MADRS improvement", successFactor: "vs. SGAs, black box warnings" },
      { molecule: "Rexulti (brexpiprazole)", indication: "Agitation in Alzheimer's", usApproval: "Yes", niceRec: "No benefit", gba: "No", icer: "N/A", keyEndpoint: "CMAI improvement", successFactor: "Modest benefit" },
    ],
    example: {
      title: "Novel NMDA modulator for treatment-resistant depression",
      yourMolecule: { clinicalBenefit: "Remission (wk 4): 45%, Response: 62%", safety: "Dissociation 12%, no abuse", icer: "$58K/QALY", population: "TRD", price: "Oral, once-daily" },
      comparatorAvg: { clinicalBenefit: "Remission (wk 4): 32%, Response: 55%", safety: "Dissociation 25% (esketamine)", icer: "$62K/QALY", population: "TRD", price: "Intranasal in-clinic / oral" },
      ratios: ["Remission: 45%/32% = 1.41", "Response: 62%/55% = 1.13", "Onset: Similar = 1.0", "Safety: 25%/12% = 2.08 (better)", "ICER: $62K/$58K = 1.07", "Convenience: Oral at home vs. clinic = 1.3"],
      compositeScore: "1.33",
      probability: { baseRate: "US Commercial Psychiatry: 62%", composite: "62% × 1.33 = 82.5%", adjustments: ["Mental Health Parity Act: +8%", "No REMS (vs. esketamine): +10%", "Suicide risk reduction documented: +12%"], final: "83% + 8% + 10% + 12% = 113% → cap at 95%" },
    },
  },
  {
    ta: "5. Endocrinology & Metabolism",
    benchmarks: [
      { molecule: "Mounjaro (tirzepatide)", indication: "T2DM", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£18K", keyEndpoint: "HbA1c -2.4%, weight ↓", successFactor: "Dual GIP/GLP-1, superior" },
      { molecule: "Wegovy (semaglutide)", indication: "Obesity", usApproval: "Yes", niceRec: "Variable", gba: "Not assessed", icer: "~£32K", keyEndpoint: "Weight loss 15%", successFactor: "GLP-1 obesity (Medicare excluded)" },
      { molecule: "Rybelsus (oral semaglutide)", indication: "T2DM", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£22K", keyEndpoint: "HbA1c -1.5%", successFactor: "First oral GLP-1" },
      { molecule: "Kerendia (finerenone)", indication: "CKD in diabetes", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£24K", keyEndpoint: "CKD progression ↓", successFactor: "Non-steroidal MRA, renal outcomes" },
      { molecule: "Inpefa (sotagliflozin)", indication: "T1DM + CKD", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$82K", keyEndpoint: "HbA1c + eGFR benefit", successFactor: "Dual SGLT1/2" },
    ],
    example: {
      title: "Novel dual incretin agonist for T2DM + obesity",
      yourMolecule: { clinicalBenefit: "HbA1c -2.2%, Weight -13%", safety: "GI AEs 28%, pancreatitis 0.2%", icer: "$95K/QALY", population: "T2DM + obesity", price: "Once-weekly SC" },
      comparatorAvg: { clinicalBenefit: "HbA1c -1.8%, Weight -10%", safety: "GI AEs 32%, pancreatitis 0.3%", icer: "$88K/QALY", population: "T2DM", price: "Once-weekly" },
      ratios: ["HbA1c: 2.2%/1.8% = 1.22", "Weight: 13%/10% = 1.30", "CV outcomes: 14%/12% = 1.17", "Safety GI: 32%/28% = 1.14 (better)", "ICER: $88K/$95K = 0.93 (worse)", "Dosing: Same = 1.0"],
      compositeScore: "1.13",
      probability: { baseRate: "US Commercial Endocrinology: 58%", composite: "58% × 1.13 = 65.5%", adjustments: [], final: "65.5%" },
    },
  },
  {
    ta: "6. Immunology & Inflammation",
    benchmarks: [
      { molecule: "Rinvoq (upadacitinib)", indication: "RA, PsA, AS, UC, AD", usApproval: "Yes", niceRec: "Yes (RA/PsA)", gba: "Minor (4)", icer: "~£28K", keyEndpoint: "ACR 50: 45%", successFactor: "JAK1 selective, broad indications" },
      { molecule: "Skyrizi (risankizumab)", indication: "Plaque psoriasis, CD", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£26K", keyEndpoint: "PASI 90: 75%", successFactor: "IL-23p19, superior efficacy" },
      { molecule: "Omvoh (mirikizumab)", indication: "Ulcerative colitis", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~£35K", keyEndpoint: "Clinical remission", successFactor: "IL-23p19, competitive UC market" },
      { molecule: "Saphnelo (anifrolumab)", indication: "SLE", usApproval: "Yes", niceRec: "No (cost)", gba: "Non-quantifiable (5)", icer: "~£88K", keyEndpoint: "SRI-4: 48%", successFactor: "First new biologic in decade" },
      { molecule: "Cibinqo (abrocitinib)", indication: "Atopic dermatitis", usApproval: "Yes", niceRec: "No (cost)", gba: "Minor (4)", icer: "~£65K", keyEndpoint: "IGA 0/1: 44%", successFactor: "JAK1, but thrombosis warning" },
    ],
    example: {
      title: "Novel IL-23p19 inhibitor for Crohn's disease",
      yourMolecule: { clinicalBenefit: "Remission (wk 52): 58%, Endoscopic: 48%", safety: "Infections 12%, serious AEs 8%", icer: "$98K/QALY", population: "Crohn's disease", price: "IV induction → q8w SC" },
      comparatorAvg: { clinicalBenefit: "Remission: 48%, Endoscopic: 38%", safety: "Infections 15%, serious AEs 10%", icer: "$105K/QALY", population: "CD/Psoriasis approved", price: "Similar (IV → SC)" },
      ratios: ["Remission: 58%/48% = 1.21", "Endoscopic: 48%/38% = 1.26", "Steroid-free: 52%/44% = 1.18", "Safety infections: 15%/12% = 1.25 (better)", "ICER: $105K/$98K = 1.07", "Dosing: Same = 1.0"],
      compositeScore: "1.16",
      probability: { baseRate: "US Commercial Immunology: 68%", composite: "68% × 1.16 = 78.9%", adjustments: [], final: "78.9%" },
    },
  },
  {
    ta: "7. Rheumatology",
    benchmarks: [
      { molecule: "Rinvoq (upadacitinib)", indication: "RA", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£28K", keyEndpoint: "ACR 50: 45%, DAS28 remission 30%", successFactor: "JAK1 selective" },
      { molecule: "Olumiant (baricitinib)", indication: "RA, AD", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£24K", keyEndpoint: "ACR 20: 70%", successFactor: "COVID EUA boosted profile" },
      { molecule: "Enbrel biosimilar (SB4)", indication: "RA, PsA", usApproval: "Yes", niceRec: "Yes", gba: "Reference", icer: "~£12K", keyEndpoint: "Non-inferior to originator", successFactor: "Cost savings" },
      { molecule: "Saphnelo (anifrolumab)", indication: "SLE", usApproval: "Yes", niceRec: "No (cost)", gba: "Non-quantifiable (5)", icer: "~£88K", keyEndpoint: "SRI-4: 48%", successFactor: "First new SLE drug in decade" },
      { molecule: "Orencia SC (abatacept)", indication: "RA", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£22K", keyEndpoint: "Non-inferior to IV", successFactor: "Self-administered, no infusion" },
    ],
    example: {
      title: "Novel BAFF/APRIL dual inhibitor for SLE",
      yourMolecule: { clinicalBenefit: "SRI-4: 56%, Severe flare ↓: 65%", safety: "Infections 18%, serious 3%", icer: "$125K/QALY", population: "SLE", price: "SC monthly" },
      comparatorAvg: { clinicalBenefit: "SRI-4: 48%, Severe flare ↓: 58%", safety: "Infections 22%, serious 4%", icer: "$145K/QALY", population: "SLE", price: "IV monthly" },
      ratios: ["SRI-4: 56%/48% = 1.17", "Flare reduction: 65%/58% = 1.12", "Steroid taper: 48%/42% = 1.14", "Safety infections: 22%/18% = 1.22 (better)", "ICER: $145K/$125K = 1.16", "Convenience: SC vs. IV = 1.4"],
      compositeScore: "1.20",
      probability: { baseRate: "US Commercial Rheumatology: 66%", composite: "66% × 1.20 = 79.2%", adjustments: [], final: "79.2%" },
    },
  },
  {
    ta: "8. Infectious Diseases",
    benchmarks: [
      { molecule: "Xacduro (zoliflodacin)", indication: "Gonorrhea", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "N/A", keyEndpoint: "Cure rate", successFactor: "Novel mechanism, AMR priority" },
      { molecule: "Sunlenca (lenacapavir)", indication: "HIV (MDR)", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£42K", keyEndpoint: "Viral suppression", successFactor: "Twice-yearly dosing" },
      { molecule: "Cabenuva (cabo/rilpivirine)", indication: "HIV", usApproval: "Yes", niceRec: "Yes", gba: "Non-assessed", icer: "~£18K", keyEndpoint: "Non-inferior to daily oral", successFactor: "Monthly IM injection" },
      { molecule: "Paxlovid (nirmatrelvir/rito)", indication: "COVID-19", usApproval: "Yes (EUA)", niceRec: "Yes", gba: "Minor (4)", icer: "~£35K", keyEndpoint: "Hospitalization -89%", successFactor: "Oral antiviral, pandemic" },
      { molecule: "Recarbrio (imipenem/relebactam)", indication: "CRE, resistant GN", usApproval: "Yes", niceRec: "Yes", gba: "Considerable (3)", icer: "~£28K", keyEndpoint: "Clinical cure 71%", successFactor: "Novel β-lactamase inhibitor, AMR" },
    ],
    example: {
      title: "Novel β-lactam/β-lactamase inhibitor for carbapenem-resistant infections",
      yourMolecule: { clinicalBenefit: "Clinical cure: 76%, Eradication: 68%", safety: "Nephrotoxicity 8%", icer: "$45K/cure", population: "CRE, CRAB, resistant Pseudomonas", price: "IV" },
      comparatorAvg: { clinicalBenefit: "Clinical cure: 68%, Eradication: 62%", safety: "Nephrotoxicity 12%", icer: "$52K/cure", population: "CRE, resistant gram-negative", price: "IV" },
      ratios: ["Clinical cure: 76%/68% = 1.12", "Microbiologic eradication: 68%/62% = 1.10", "Mortality: 22%/18% = 1.22 (better)", "Safety nephrotoxicity: 12%/8% = 1.50 (better)", "ICER: $52K/$45K = 1.16", "Spectrum: Includes CRAB (novel) = 1.3"],
      compositeScore: "1.23",
      probability: { baseRate: "US Commercial Infectious Diseases: 70%", composite: "70% × 1.23 = 86.1%", adjustments: ["QIDP designation (US): +10%", "Novel mechanism (new β-lactamase): +8%", "IDSA guideline inclusion: +10%"], final: "86% + 10% + 8% + 10% = 114% → cap at 95%" },
    },
  },
  {
    ta: "9. Respiratory/Pulmonology",
    benchmarks: [
      { molecule: "Tezspire (tezepelumab)", indication: "Severe asthma", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£32K", keyEndpoint: "Exacerbation -56%", successFactor: "Broad population (no biomarker)" },
      { molecule: "Dupixent (dupilumab)", indication: "Asthma, COPD, AD", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£28K", keyEndpoint: "Exac -50%, FEV1 +350mL", successFactor: "Type 2 inflammation" },
      { molecule: "Breztri (bud/glyco/formoterol)", indication: "COPD", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£18K", keyEndpoint: "Exacerbation -24%", successFactor: "Fixed-dose combo vs. dual" },
      { molecule: "Trikafta (elex/tez/iva)", indication: "Cystic fibrosis", usApproval: "Yes", niceRec: "Yes", gba: "Considerable (3)", icer: "~£85K", keyEndpoint: "ppFEV1 +14%, sweat Cl⁻ ↓", successFactor: "CFTR modulator, 90% population" },
      { molecule: "Ensifentrine (RPL554)", indication: "COPD", usApproval: "Under review", niceRec: "Not reviewed", gba: "Pending", icer: "TBD", keyEndpoint: "FEV1 improvement", successFactor: "PDE3/4 inhibitor" },
    ],
    example: {
      title: "Novel IL-33 inhibitor for severe eosinophilic asthma",
      yourMolecule: { clinicalBenefit: "Exacerbation -62%, FEV1 +280mL", safety: "ISR 6%", icer: "$118K/QALY", population: "Blood eos ≥300", price: "SC" },
      comparatorAvg: { clinicalBenefit: "Exacerbation -52%, FEV1 +240mL", safety: "ISR 8%", icer: "$135K/QALY", population: "Eos ≥150-300", price: "SC" },
      ratios: ["Exacerbation: 62%/52% = 1.19", "FEV1: 280/240 = 1.17", "OCS reduction: 65%/58% = 1.12", "Safety: 8%/6% = 1.33 (better)", "ICER: $135K/$118K = 1.14", "Biomarker: Similar = 1.0"],
      compositeScore: "1.16",
      probability: { baseRate: "US Commercial Respiratory: 62%", composite: "62% × 1.16 = 71.9%", adjustments: ["GINA Step 5 positioning: +8%", "Novel mechanism (IL-33, first): +10%", "Severe asthma unmet need: +8%"], final: "72% + 8% + 10% + 8% = 98% → cap at 95%" },
    },
  },
  {
    ta: "10. Gastroenterology & Hepatology",
    benchmarks: [
      { molecule: "Rinvoq (upadacitinib)", indication: "Ulcerative colitis", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£32K", keyEndpoint: "Clinical remission", successFactor: "JAK1, oral, mucosal healing" },
      { molecule: "Skyrizi (risankizumab)", indication: "Crohn's disease", usApproval: "Yes", niceRec: "Under review", gba: "Minor (4)", icer: "~£38K", keyEndpoint: "Remission 45%, endoscopic 38%", successFactor: "IL-23p19" },
      { molecule: "Resmetirom", indication: "NASH with fibrosis", usApproval: "Yes (2024)", niceRec: "Not reviewed", gba: "Pending", icer: "~$185K", keyEndpoint: "Fibrosis improvement", successFactor: "First NASH approval" },
      { molecule: "Velsipity (etrasimod)", indication: "Ulcerative colitis", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$42K", keyEndpoint: "Remission 27%", successFactor: "S1P, oral" },
    ],
    example: {
      title: "Novel FXR agonist for NASH with fibrosis",
      yourMolecule: { clinicalBenefit: "Fibrosis ≥1 stage: 32%, NASH resolution: 38%", safety: "Diarrhea 22%, LDL increase", icer: "$165K/QALY", population: "NASH F2-F3", price: "Oral, once-daily" },
      comparatorAvg: { clinicalBenefit: "Fibrosis: 26%, NASH resolution: 30%", safety: "Diarrhea 28%, LDL increase", icer: "$185K/QALY", population: "NASH F2-F3", price: "Oral, once-daily" },
      ratios: ["Fibrosis: 32%/26% = 1.23", "NASH resolution: 38%/30% = 1.27", "Safety diarrhea: 28%/22% = 1.27 (better)", "ICER: $185K/$165K = 1.12", "Dosing: Same = 1.0", "Evidence: Phase III vs. Phase III = 1.0"],
      compositeScore: "1.15",
      probability: { baseRate: "US Commercial GI: 64%", composite: "64% × 1.15 = 73.6%", adjustments: ["First-in-class (NASH): +15%", "Liver transplant prevention: +12%", "Budget impact (12M NASH): -10%"], final: "74% + 15% + 12% - 10% = 91%" },
    },
  },
  {
    ta: "11. Nephrology/Renal",
    benchmarks: [
      { molecule: "Kerendia (finerenone)", indication: "CKD in diabetes", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£24K", keyEndpoint: "CKD progression -18%, CV -14%", successFactor: "Non-steroidal MRA, dual benefit" },
      { molecule: "Filspari (sparsentan)", indication: "IgA nephropathy", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "N/A", keyEndpoint: "Proteinuria ↓", successFactor: "Dual endothelin/angiotensin" },
      { molecule: "Tarpeyo (budesonide)", indication: "IgA nephropathy", usApproval: "Yes", niceRec: "Minor (4)", gba: "~£52K", icer: "eGFR -27%", keyEndpoint: "eGFR preserved", successFactor: "Targeted-release steroid" },
      { molecule: "Jardiance (empagliflozin)", indication: "CKD (non-DM)", usApproval: "Yes", niceRec: "Minor (4)", gba: "~£18K", icer: "CKD progression -39%", keyEndpoint: "Broad CKD population", successFactor: "SGLT2, broad" },
      { molecule: "Oxlumo (lumasiran)", indication: "Primary hyperoxaluria", usApproval: "Yes", niceRec: "Considerable (3)", gba: "~£325K", icer: "Oxalate -65%", keyEndpoint: "Ultra-rare pediatric", successFactor: "siRNA, ultra-rare" },
    ],
    example: {
      title: "Novel SGLT1/2 dual inhibitor for diabetic kidney disease",
      yourMolecule: { clinicalBenefit: "eGFR slope 3.8 mL/min/yr, ESRD -28%", safety: "Euglycemic DKA 0.8%, genital infections 6%", icer: "$82K/QALY", population: "DKD", price: "Oral" },
      comparatorAvg: { clinicalBenefit: "eGFR slope 2.9 mL/min/yr, ESRD -22%", safety: "DKA 1.2%, genital infections 8%", icer: "$88K/QALY", population: "CKD/DKD", price: "Oral" },
      ratios: ["eGFR slope: 3.8/2.9 = 1.31", "ESRD delay: 28%/22% = 1.27", "Albuminuria: 42%/38% = 1.11", "CV outcomes: 18%/14% = 1.29", "Safety DKA: 1.2%/0.8% = 1.50 (better)", "ICER: $88K/$82K = 1.07"],
      compositeScore: "1.26",
      probability: { baseRate: "US Commercial Nephrology: 63%", composite: "63% × 1.26 = 79.4%", adjustments: ["KDIGO guideline Class I: +10%", "Dual kidney + CV benefit: +12%", "Dialysis cost-offset (~$90K/year): +10%"], final: "79% + 10% + 12% + 10% = 111% → cap at 95%" },
    },
  },
  {
    ta: "12. Dermatology",
    benchmarks: [
      { molecule: "Sotyktu (deucravacitinib)", indication: "Plaque psoriasis", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£28K", keyEndpoint: "PASI 75: 58%", successFactor: "Oral TYK2, no black box" },
      { molecule: "Vtama (tapinarof)", indication: "Plaque psoriasis", usApproval: "Yes", niceRec: "Pending", gba: "N/A", icer: "~$42K", keyEndpoint: "IGA 0/1: topical", successFactor: "AhR agonist, steroid-free" },
      { molecule: "Rinvoq (upadacitinib)", indication: "Atopic dermatitis", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£32K", keyEndpoint: "EASI 75: 48%", successFactor: "Rapid onset" },
      { molecule: "Cibinqo (abrocitinib)", indication: "Atopic dermatitis", usApproval: "Yes", niceRec: "No", gba: "Minor (4)", icer: "~£65K", keyEndpoint: "IGA 0/1: 44%", successFactor: "Thrombosis warning" },
    ],
    example: {
      title: "Novel IL-36R inhibitor for generalized pustular psoriasis (GPP)",
      yourMolecule: { clinicalBenefit: "Pustule clearance (d14): 78%, GPPGA 0/1: 62%", safety: "Serious infections 2%", icer: "$295K/QALY", population: "Ultra-rare GPP (~3K US)", price: "IV/SC" },
      comparatorAvg: { clinicalBenefit: "Pustule clearance: 68%, GPPGA 0/1: 54%", safety: "Serious infections 3%", icer: "$310K/QALY", population: "GPP", price: "IV" },
      ratios: ["Pustule clearance: 78%/68% = 1.15", "Flare prevention: 85%/78% = 1.09", "GPPGA: 62%/54% = 1.15", "Safety: 3%/2% = 1.50 (better)", "ICER: $310K/$295K = 1.05", "Evidence: Phase III vs. Phase II/III = 1.1"],
      compositeScore: "1.17",
      probability: { baseRate: "US Commercial Dermatology: 55%", composite: "55% × 1.17 = 64.4%", adjustments: [], final: "64.4%" },
    },
  },
  {
    ta: "13. Ophthalmology",
    benchmarks: [
      { molecule: "Vabysmo (faricimab)", indication: "Wet AMD, DME", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£28K", keyEndpoint: "VA gain, extended q16w", successFactor: "Ang-2/VEGF-A bispecific" },
      { molecule: "Syfovre (pegcetacoplan)", indication: "Geographic atrophy", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$145K", keyEndpoint: "GA growth reduction", successFactor: "Complement C3, first GA approval" },
      { molecule: "Izervay (avacincaptad)", indication: "Geographic atrophy", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "~$155K", keyEndpoint: "GA growth reduction", successFactor: "Complement C5, monthly" },
      { molecule: "Eylea HD (aflibercept HD)", indication: "Wet AMD, DME", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£26K", keyEndpoint: "Higher VA gain", successFactor: "Extended interval q12-16w" },
      { molecule: "Beovu (brolucizumab)", indication: "Wet AMD", usApproval: "Yes", niceRec: "Restricted", gba: "Non-quantifiable (5)", icer: "~£32K", keyEndpoint: "VA gain", successFactor: "Retinal vasculitis risk (black box)" },
    ],
    example: {
      title: "Novel integrin inhibitor for DME",
      yourMolecule: { clinicalBenefit: "VA +7.2 letters (wk 52), CST -195μm", safety: "Endophthalmitis 0.04%, no IOI", icer: "$112K/QALY", population: "DME", price: "α5β1 integrin antagonist" },
      comparatorAvg: { clinicalBenefit: "VA +5.8 letters, CST -168μm", safety: "Endophthalmitis 0.05%, IOI rare", icer: "$125K/QALY", population: "DME (VEGF inhibitors)", price: "q8-12w" },
      ratios: ["VA gain: 7.2/5.8 = 1.24", "CST reduction: 195/168 = 1.16", "Durability: q12w vs. q8-12w = 1.1", "Safety: 0.05%/0.04% = 1.25 (better)", "ICER: $125K/$112K = 1.12", "Novel mechanism (non-VEGF): 1.3"],
      compositeScore: "1.20",
      probability: { baseRate: "US Commercial Ophthalmology: 72%", composite: "72% × 1.20 = 86.4%", adjustments: ["AAO Preferred Practice Pattern: +8%", "Medicare Part B buy-and-bill: +10%", "Novel mechanism (first integrin): +10%"], final: "86% + 8% + 10% + 10% = 114% → cap at 95%" },
    },
  },
  {
    ta: "14. Rare Diseases/Orphan Drugs",
    benchmarks: [
      { molecule: "Zolgensma (onasemnogene)", indication: "SMA type 1", usApproval: "Yes", niceRec: "Yes (installments)", gba: "Orphan exempt", icer: "~£1.8M", keyEndpoint: "Survival, motor milestones", successFactor: "Gene therapy, curative" },
      { molecule: "Evrysdi (risdiplam)", indication: "SMA", usApproval: "Yes", niceRec: "Yes", gba: "Orphan exempt", icer: "~£85K/yr", keyEndpoint: "Motor milestone achievement", successFactor: "Oral SMN2 splicing modifier" },
      { molecule: "Skyclarys (omaveloxolone)", indication: "Friedreich's ataxia", usApproval: "Yes", niceRec: "Not reviewed", gba: "Orphan exempt", icer: "~$370K/yr", keyEndpoint: "mFARS improvement", successFactor: "First FA approval, Nrf2" },
      { molecule: "Vyondys 53 (golodirsen)", indication: "DMD exon 53", usApproval: "Yes (accelerated)", niceRec: "No", gba: "No", icer: "~$325K/yr", keyEndpoint: "Dystrophin production", successFactor: "ASO, conditional" },
      { molecule: "Danyelza (naxitamab)", indication: "Neuroblastoma", usApproval: "Yes", niceRec: "Not reviewed", gba: "Orphan exempt", icer: "N/A", keyEndpoint: "ORR 45%", successFactor: "Pediatric oncology antibody" },
    ],
    example: {
      title: "Novel enzyme replacement therapy for ultra-rare lysosomal storage disease",
      yourMolecule: { clinicalBenefit: "Endpoint improvement: 38%, GL-3 reduction: 75%", safety: "Infusion reactions 18%, no anaphylaxis", icer: "$425K/QALY", population: "~500 US patients", price: "IV q2w" },
      comparatorAvg: { clinicalBenefit: "Endpoint: 32%, GL-3 reduction: 68%", safety: "Infusion reactions 22%, anaphylaxis rare", icer: "$480K/QALY", population: "~500-1000 patients", price: "IV q2w" },
      ratios: ["Clinical endpoint: 38%/32% = 1.19", "Biomarker: 75%/68% = 1.10", "QoL: 12/9 = 1.33", "Safety: 22%/18% = 1.22 (better)", "ICER: $480K/$425K = 1.13", "Dosing: Same = 1.0"],
      compositeScore: "1.16",
      probability: { baseRate: "US Commercial Rare Diseases: 85%", composite: "85% × 1.16 = 98.6%", adjustments: ["Orphan Drug Act 7-year exclusivity: +0% (in base)", "Pediatric Rare Disease PRV: +5%", "Patient advocacy (strong): +3%"], final: "99% + 5% + 3% = 107% → cap at 95%" },
    },
  },
  {
    ta: "15. Vaccines & Virology",
    benchmarks: [
      { molecule: "Arexvy (RSV)", indication: "RSV prevention (elderly)", usApproval: "Yes", niceRec: "Yes", gba: "STIKO rec", icer: "~£8K/QALY", keyEndpoint: "VE 82%, severe 94%", successFactor: "First RSV vaccine (elderly)" },
      { molecule: "Abrysvo (RSV)", indication: "RSV (elderly + maternal)", usApproval: "Yes", niceRec: "Yes", gba: "STIKO rec", icer: "~£9K/QALY", keyEndpoint: "VE 67-86%", successFactor: "Dual indication" },
      { molecule: "Beyfortus (nirsevimab)", indication: "RSV (infants)", usApproval: "Yes", niceRec: "Yes", gba: "STIKO rec", icer: "~£12K/QALY", keyEndpoint: "Hospitalization -80%", successFactor: "Single-dose seasonal" },
      { molecule: "Comirnaty (XBB)", indication: "COVID-19 variant", usApproval: "Yes (EUA)", niceRec: "Yes", gba: "Not assessed", icer: "~£6K/QALY", keyEndpoint: "VE ~60-70%", successFactor: "mRNA platform, rapid update" },
    ],
    example: {
      title: "Novel mRNA vaccine for CMV in transplant recipients",
      yourMolecule: { clinicalBenefit: "VE 75% vs. CMV disease, Seroconversion 92%", safety: "ISR 32%, no SAEs", icer: "$28K/QALY", population: "Transplant recipients (pre-transplant)", price: "2-dose series" },
      comparatorAvg: { clinicalBenefit: "Prophylaxis VE 40% (valacyclovir)", safety: "GI upset, resistance", icer: "$35K/QALY (estimated)", population: "Same", price: "Daily oral ongoing" },
      ratios: ["Efficacy: 75%/40% = 1.88", "Adherence/durability: 2 years vs. daily = 2.0", "Safety: Better (no resistance) = 1.5", "ICER: $35K/$28K = 1.25", "Convenience: 2-dose vs. daily = 1.8", "Evidence: Phase III RCT vs. prophylaxis lit = 1.3"],
      compositeScore: "1.62",
      probability: { baseRate: "US Commercial Vaccines: 68%", composite: "68% × 1.62 = 110.2%", adjustments: [], final: "110.2% → cap at 95%" },
    },
  },
  {
    ta: "16. Women's Health",
    benchmarks: [
      { molecule: "Myfembree (relugolix combo)", indication: "Endometriosis", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£24K", keyEndpoint: "Dysmenorrhea NRS -3.2", successFactor: "GnRH antagonist, oral, add-back" },
      { molecule: "Orilissa (elagolix)", indication: "Endometriosis", usApproval: "Yes", niceRec: "No (cost)", gba: "Non-quantifiable (5)", icer: "~£48K", keyEndpoint: "Dysmenorrhea response 46%", successFactor: "Bone density concerns" },
      { molecule: "Veozah (fezolinetant)", indication: "Menopause hot flashes", usApproval: "Yes", niceRec: "Under review", gba: "Pending", icer: "~$62K", keyEndpoint: "Hot flash frequency -60%", successFactor: "NK3R antagonist, non-hormonal" },
      { molecule: "Opill (norgestrel)", indication: "Contraception (OTC)", usApproval: "Yes", niceRec: "N/A", gba: "Not assessed", icer: "N/A", keyEndpoint: "Pearl Index <1", successFactor: "OTC progestin-only pill" },
      { molecule: "Makena (17-OHPC)", indication: "Preterm birth prevention", usApproval: "Withdrawn", niceRec: "No", gba: "No benefit (6)", icer: "N/A", keyEndpoint: "Failed confirmatory trial", successFactor: "Accelerated approval withdrawn" },
    ],
    example: {
      title: "Novel SERM for vasomotor symptoms + osteoporosis prevention",
      yourMolecule: { clinicalBenefit: "Hot flash freq -68%, severity -72%, BMD +2.8%", safety: "VTE 0.4%, no breast/uterine stimulation", icer: "$52K/QALY", population: "Postmenopausal", price: "Tissue-selective estrogen complex" },
      comparatorAvg: { clinicalBenefit: "Hot flash freq -58%, severity -65%, BMD +2.1%", safety: "VTE 0.8%, breast/uterine safe", icer: "$68K/QALY", population: "Postmenopausal", price: "SERM/estrogen or NK3 antagonist" },
      ratios: ["Hot flash freq: 68%/58% = 1.17", "Hot flash severity: 72%/65% = 1.11", "BMD benefit: 2.8%/2.1% = 1.33", "Safety VTE: 0.8%/0.4% = 2.0 (better)", "ICER: $68K/$52K = 1.31", "Dual benefit (VMS + bone): 1.4"],
      compositeScore: "1.39",
      probability: { baseRate: "US Commercial Women's Health: 52%", composite: "52% × 1.39 = 72.3%", adjustments: [], final: "72.3%" },
    },
  },
  {
    ta: "17. Urology",
    benchmarks: [
      { molecule: "Xtandi (enzalutamide)", indication: "nmCRPC", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£38K", keyEndpoint: "MFS +22 months", successFactor: "AR inhibitor, OS benefit later" },
      { molecule: "Erleada (apalutamide)", indication: "nmCRPC, mCRPC", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~£42K", keyEndpoint: "MFS +24 months", successFactor: "AR inhibitor, falls/fracture risk" },
      { molecule: "Padcev (enfortumab vedotin)", indication: "Urothelial cancer", usApproval: "Yes", niceRec: "Yes", gba: "Minor (4)", icer: "~$145K", keyEndpoint: "OS +3.9 months", successFactor: "Nectin-4 ADC, post-platinum" },
      { molecule: "Balversa (erdafitinib)", indication: "Bladder cancer", usApproval: "Yes", niceRec: "No", gba: "Non-quantifiable", icer: "~$185K", keyEndpoint: "ORR 40%, DOR 5.6mo", successFactor: "Biomarker-selected (FGFR)" },
      { molecule: "Gemtesa (vibegron)", indication: "OAB", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£18K", keyEndpoint: "Incontinence -1.8/day", successFactor: "β3 agonist, limited benefit" },
    ],
    example: {
      title: "Novel PARP inhibitor for mCRPC (HRR mutations)",
      yourMolecule: { clinicalBenefit: "rPFS 9.8mo, OS HR 0.78, PSA >50%: 52%", safety: "Anemia 22%, fatigue 32%", icer: "$165K/QALY", population: "HRR+ mCRPC (~30%)", price: "Oral" },
      comparatorAvg: { clinicalBenefit: "rPFS 7.4mo, OS HR 0.83, PSA: 44%", safety: "Anemia 28%, fatigue 38%", icer: "$185K/QALY", population: "HRR+ mCRPC", price: "Oral" },
      ratios: ["rPFS: 9.8/7.4 = 1.32", "OS: 0.78/0.83 = 1.06 (better HR)", "PSA response: 52%/44% = 1.18", "Safety anemia: 28%/22% = 1.27 (better)", "ICER: $185K/$165K = 1.12", "Biomarker: Same = 1.0"],
      compositeScore: "1.16",
      probability: { baseRate: "US Commercial Urology: 58%", composite: "58% × 1.16 = 67.3%", adjustments: [], final: "67.3%" },
    },
  },
  {
    ta: "18. Pain Management/Anesthesia",
    benchmarks: [
      { molecule: "Zynrelef (bupivacaine/meloxicam)", indication: "Post-surgical pain", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "~$42K", keyEndpoint: "NRS improvement", successFactor: "Prolonged-release, opioid-sparing" },
      { molecule: "Tanezumab (anti-NGF)", indication: "OA pain", usApproval: "Rejected (2021)", niceRec: "No", gba: "N/A", icer: "N/A", keyEndpoint: "NRS improvement", successFactor: "Rapid joint destruction, black box" },
      { molecule: "Xtampza ER (oxycodone ADF)", indication: "Chronic pain", usApproval: "Yes", niceRec: "Not reviewed", gba: "Pending", icer: "~$68K", keyEndpoint: "Abuse-deterrent", successFactor: "Schedule II opioid" },
      { molecule: "Qutenza (capsaicin 8%)", indication: "Neuropathic pain", usApproval: "Yes", niceRec: "Yes", gba: "Minor", icer: "~£22K", keyEndpoint: "NRS improvement", successFactor: "Localized, painful application" },
    ],
    example: {
      title: "Novel Nav1.7 sodium channel inhibitor for neuropathic pain (DPNP)",
      yourMolecule: { clinicalBenefit: "NRS -2.8, Response ≥50%: 48%", safety: "Dizziness 8%, no abuse potential", icer: "$72K/QALY", population: "DPNP", price: "Oral, selective Nav1.7" },
      comparatorAvg: { clinicalBenefit: "NRS -2.1, Response: 38%", safety: "Dizziness 22%, sedation", icer: "$85K/QALY", population: "Neuropathic pain", price: "Varied (GABA, SNRI)" },
      ratios: ["Pain reduction: 2.8/2.1 = 1.33", "Response rate: 48%/38% = 1.26", "Function: 2.2/1.7 = 1.29", "Safety dizziness: 22%/8% = 2.75 (better)", "ICER: $85K/$72K = 1.18", "Novel mechanism (Nav1.7 first oral): 1.4"],
      compositeScore: "1.54",
      probability: { baseRate: "US Commercial Pain Management: 45%", composite: "45% × 1.54 = 69.3%", adjustments: ["Non-opioid, non-scheduled: +15%", "Novel mechanism (first Nav1.7): +12%", "APS/CDC non-opioid priority: +10%"], final: "69% + 15% + 12% + 10% = 106% → cap at 95%" },
    },
  },
  {
    ta: "19. Transplant & Cell/Gene Therapy",
    benchmarks: [
      { molecule: "Zolgensma (onasemnogene)", indication: "SMA type 1", usApproval: "Yes", niceRec: "Yes (installments)", gba: "Orphan exempt", icer: "~£1.8M", keyEndpoint: "Survival, motor milestones", successFactor: "One-time cure, pediatric" },
      { molecule: "Casgevy (exa-cel, CRISPR)", indication: "β-thalassemia, SCD", usApproval: "Yes", niceRec: "Yes", gba: "Considerable (3)", icer: "~£1.65M", keyEndpoint: "Transfusion independence", successFactor: "First CRISPR therapy" },
      { molecule: "Lyfgenia (lovotibegloge)", indication: "SCD", usApproval: "Yes", niceRec: "Under review", gba: "Orphan exempt", icer: "~$3.1M", keyEndpoint: "HbAT87Q, VOC reduction", successFactor: "Curative, high cost concern" },
      { molecule: "Yescarta (axi-cel, CAR-T)", indication: "LBCL", usApproval: "Yes", niceRec: "Yes (CDF)", gba: "Considerable (3)", icer: "N/A", keyEndpoint: "CR 54%, DOR 31 months", successFactor: "Durable remissions" },
      { molecule: "Kymriah (tisa-cel, CAR-T)", indication: "ALL, LBCL", usApproval: "Yes", niceRec: "Yes (CDF)", gba: "Considerable (3)", icer: "N/A", keyEndpoint: "CR rates", successFactor: "First CAR-T" },
    ],
    example: {
      title: "Novel in vivo AAV gene therapy for hemophilia A",
      yourMolecule: { clinicalBenefit: "FVIII >40% normal, ABR -96%", safety: "Transaminitis 18% (transient), no inhibitors", icer: "$1.4M one-time", population: "Hemophilia A", price: "AAV5 liver-directed" },
      comparatorAvg: { clinicalBenefit: "FVIII 12-40%, ABR -85-90%", safety: "Transaminitis 25-35%, inhibitor rare", icer: "$1.8-2.5M", population: "Hemophilia A/B", price: "AAV liver-directed" },
      ratios: ["Factor expression: 40%/25% = 1.60", "Bleed prevention: 96%/88% = 1.09", "Durability: 5+ vs. 3 years = 1.67", "Safety transaminitis: 30%/18% = 1.67 (better)", "ICER: $2M/$1.4M = 1.43", "Evidence: 5-year vs. 2-3 year = 1.5"],
      compositeScore: "1.49",
      probability: { baseRate: "US Commercial Transplant/Cell-Gene: 82%", composite: "82% × 1.49 = 122.2%", adjustments: ["RMAT designation: +10%", "Curative intent, single-dose: +8%", "Outcomes-based contract feasible: +5%"], final: "122% + 10% + 8% + 5% = 145% → cap at 95%" },
    },
  },
  {
    ta: "20. Pediatrics (Cross-Cutting)",
    benchmarks: [],
    example: null,
    isPediatric: true,
    pediatricModifiers: [
      { market: "US Commercial", bonus: "+10%" },
      { market: "US Medicare", bonus: "+12%" },
      { market: "UK NICE", bonus: "+15% (NHS children's health priority)" },
      { market: "Germany G-BA", bonus: "+12% (pediatric studies valued)" },
      { market: "Japan MHLW", bonus: "+10%" },
      { market: "China NHSA", bonus: "+8% (one-child policy legacy)" },
      { market: "India PM-JAY", bonus: "+12% (maternal-child health focus)" },
      { market: "Brazil CONITEC", bonus: "+10%" },
    ],
    pediatricExamples: [
      { name: "Pediatric Oncology (ALL)", baseTA: "Oncology", baseRate: "75%", bonus: "+10%", adjusted: "85%" },
      { name: "Pediatric Rare Disease (DMD)", baseTA: "Rare Diseases", baseRate: "85%", bonus: "+10%", adjusted: "95%" },
      { name: "Pediatric Asthma (6-11 years)", baseTA: "Respiratory", baseRate: "62%", bonus: "+10%", adjusted: "72%" },
    ],
  },
];

// ============ STEP 4: MARKET ADJUSTMENTS ============
const marketAdjustmentsStep4 = [
  {
    market: "United States 🇺🇸",
    adjustments: [
      { item: "Breakthrough Therapy Designation", value: "+10% to +15%", trigger: "FDA BTD granted" },
      { item: "QIDP Designation (Infectious Diseases)", value: "+10%", trigger: "GAIN Act designation" },
      { item: "Orphan Drug Designation", value: "+10%", trigger: "ODA granted" },
      { item: "Pediatric Rare Disease PRV", value: "+8%", trigger: "Eligible disease" },
      { item: "RMAT Designation (Regenerative Medicine)", value: "+12%", trigger: "FDA RMAT granted" },
      { item: "Medicare NCD Positive", value: "+12%", trigger: "National Coverage Determination favorable" },
      { item: "NCCN/ACC/AHA/ACOG Guideline Inclusion", value: "+8% to +12%", trigger: "Class I recommendation" },
      { item: "Outcomes-Based Contract Feasible", value: "+5% to +10%", trigger: "Manufacturer willing, payer interest" },
      { item: "PBM Formulary Tier 2 (Preferred Brand)", value: "+10%", trigger: "3+ mega-PBMs commit" },
      { item: "Budget Impact >$1B/Payer", value: "-10% to -15%", trigger: "Large prevalent population" },
      { item: "Black Box Warning", value: "-8% to -12%", trigger: "Safety concern" },
      { item: "DEA Schedule II (Opioids)", value: "-15%", trigger: "REMS, prescribing restrictions" },
      { item: "Biosimilar/Generic Competition Imminent", value: "-12% to -15%", trigger: "LOE approaching (<2 years)" },
    ],
  },
  {
    market: "United Kingdom 🇬🇧 (NICE)",
    adjustments: [
      { item: "End-of-Life Criteria Met", value: "+15%", trigger: "Life expectancy <24mo, extension >3mo" },
      { item: "Cancer Drugs Fund Eligibility", value: "+10%", trigger: "Managed access pathway" },
      { item: "HST Pathway (Ultra-Rare)", value: "+20%", trigger: "<20K UK patients" },
      { item: "NHS Long Term Plan Priority", value: "+8%", trigger: "CVD, mental health, cancer, etc." },
      { item: "Installment Payment Model", value: "+8%", trigger: "Gene therapy precedent" },
      { item: "Budget Impact >£500M", value: "-15% to -20%", trigger: "Major NHS budget concern" },
    ],
  },
  {
    market: "Germany 🇩🇪 (G-BA)",
    adjustments: [
      { item: "Orphan Designation (<€50M revenue)", value: "+20% to +25%", trigger: "Automatic benefit, no AMNOG" },
      { item: "Head-to-Head RCT vs. SOC", value: "+12%", trigger: "Required for benefit assessment" },
      { item: "NUB (Hospital Innovation Fund)", value: "+15%", trigger: "Cell/gene therapy, advanced devices" },
      { item: "Additional Benefit Rating 3 (Considerable)", value: "+15%", trigger: "Major clinical benefit" },
      { item: "No Additional Benefit (Rating 6)", value: "-25% to -30%", trigger: "Reference pricing enforced" },
    ],
  },
  {
    market: "Japan 🇯🇵 (MHLW)",
    adjustments: [
      { item: "SAKIGAKE Designation", value: "+18%", trigger: "Fast-track regenerative medicine" },
      { item: "Innovation Premium Eligible", value: "+15% to +20%", trigger: "Novel mechanism, unmet need" },
      { item: "Japanese Clinical Trial Conducted", value: "+12% to +15%", trigger: "Phase III in Japan" },
      { item: "Repricing Risk (Sales >150% Forecast)", value: "-10%", trigger: "Blockbuster penalty" },
    ],
  },
  {
    market: "China 🇨🇳 (NHSA)",
    adjustments: [
      { item: "VBP 60-70% Price Cut Accepted", value: "+25%", trigger: "Volume-based procurement inclusion" },
      { item: "Chinese Clinical Trial (Phase III)", value: "+15%", trigger: "Demonstrates local efficacy" },
      { item: "Local Manufacturing Capacity", value: "+12%", trigger: "Reduces import dependence" },
      { item: "Healthy China 2030 Strategic Priority", value: "+10%", trigger: "Cancer, CVD, diabetes, rare disease" },
      { item: "Not on National Rare Disease List", value: "-20%", trigger: "Rare disease exclusion" },
    ],
  },
  {
    market: "India 🇮🇳 (PM-JAY)",
    adjustments: [
      { item: "PM-JAY Empanelment", value: "+15%", trigger: "Government scheme inclusion" },
      { item: "CGHS Coverage", value: "+10%", trigger: "Central Government Health Scheme" },
      { item: "Affordability < ₹5 Lakh/Patient/Year", value: "+20%", trigger: "Within catastrophic coverage limit" },
      { item: "> ₹20 Lakh/Patient/Year", value: "-25% to -30%", trigger: "Unaffordable, excluded" },
    ],
  },
  {
    market: "Brazil 🇧🇷 (CONITEC)",
    adjustments: [
      { item: "CONITEC Priority Disease", value: "+15%", trigger: "Oncology, HIV, maternal health" },
      { item: "Federal SUS Mandate", value: "+12%", trigger: "Nationwide vs. state-by-state" },
      { item: "Budget Impact <BRL 100M", value: "+18%", trigger: "Manageable cost" },
      { item: "Judicial Pathway History", value: "+8%", trigger: "Court-ordered access precedent" },
    ],
  },
];

// Summary usage guidance
const whenToUseModel2 = [
  { scenario: "3-5 recent comparator approvals exist", example: "GLP-1 for diabetes vs. semaglutide, tirzepatide, dulaglutide" },
  { scenario: "Rapid benchmarking across multiple markets", example: "Portfolio prioritization" },
  { scenario: "Historical approval rates well-established", example: "Oncology, cardiology, immunology" },
  { scenario: "\"Me-better\" vs. first-in-class molecule", example: "Better efficacy, dosing, safety than existing drugs" },
  { scenario: "Payer precedents exist for molecule class", example: "SGLT2 inhibitors, IL-23 inhibitors, CAR-T therapies" },
];

const whenNotModel2 = [
  { scenario: "First-in-class, no comparators", alternative: "Model 1 (clinical/economic weight scoring)" },
  { scenario: "Few recent approvals in TA", alternative: "Model 1" },
  { scenario: "Novel mechanism, unclear payer reception", alternative: "Model 1 + qualitative payer research" },
  { scenario: "Cross-cutting therapy (e.g., pain across multiple conditions)", alternative: "Separate Model 2 analysis by indication" },
];

// ============ MAIN COMPONENT ============
export const PAModel2Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6" id="model2-dashboard-content">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BarChart3 className="h-6 w-6 text-primary" />
                PA Index-2 & Model 2: Comparative Payer Likelihood Matrix
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Uses historical approval rates combined with molecule-specific comparator benchmarking across 20 therapeutic areas and 8 global markets
              </CardDescription>
            </div>
            <Model2PDFExport />
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 border font-mono text-sm text-center">
            <strong>Final Probability</strong> = (Base Rate × Composite Comparator Score) + Market Adjustments
            <span className="block text-xs text-muted-foreground mt-1">Capped at 95% maximum | Floored at 5% minimum</span>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start h-auto gap-1 bg-muted/50 p-1 flex-wrap">
          <TabsTrigger value="overview" className="gap-1.5 text-xs font-semibold">
            <Globe className="h-3.5 w-3.5" /> Base Rates & Methodology
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="gap-1.5 text-xs font-semibold">
            <FlaskConical className="h-3.5 w-3.5" /> TA Benchmarking (20 TAs)
          </TabsTrigger>
          <TabsTrigger value="adjustments" className="gap-1.5 text-xs font-semibold">
            <Calculator className="h-3.5 w-3.5" /> Market Adjustments
          </TabsTrigger>
          <TabsTrigger value="calculator" className="gap-1.5 text-xs font-semibold">
            <Sliders className="h-3.5 w-3.5" /> Interactive Calculator
          </TabsTrigger>
          <TabsTrigger value="guidance" className="gap-1.5 text-xs font-semibold">
            <Info className="h-3.5 w-3.5" /> Usage Guidance
          </TabsTrigger>
        </TabsList>

        {/* ===== TAB 1: BASE RATES ===== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Step 1: Historical Base Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Step 1: Historical Approval/Coverage Rates (2020-2025 Data)
              </CardTitle>
              <CardDescription>Empirical base rates by market and therapeutic area across 20 TAs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-2 font-semibold min-w-[180px]">Therapeutic Area</th>
                      <th className="text-center p-2 font-semibold">US Comm</th>
                      <th className="text-center p-2 font-semibold">US Med</th>
                      <th className="text-center p-2 font-semibold">UK</th>
                      <th className="text-center p-2 font-semibold">Germany</th>
                      <th className="text-center p-2 font-semibold">Japan</th>
                      <th className="text-center p-2 font-semibold">China</th>
                      <th className="text-center p-2 font-semibold">India</th>
                      <th className="text-center p-2 font-semibold">Brazil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalBaseRates.map((row, idx) => {
                      const isPediatric = row.ta.includes("Pediatrics");
                      return (
                        <tr key={idx} className={`border-b hover:bg-muted/30 ${isPediatric ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                          <td className="p-2 font-medium text-xs">{row.ta}</td>
                          {[row.usComm, row.usMed, row.uk, row.germany, row.japan, row.china, row.india, row.brazil].map((val, i) => (
                            <td key={i} className="p-2 text-center">
                              {typeof val === "string" ? (
                                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">{val}</Badge>
                              ) : (
                                <Badge variant="outline" className={`text-xs ${val >= 70 ? 'text-green-600 border-green-300' : val >= 40 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
                                  {val}%
                                </Badge>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                <strong>Note on Pediatrics:</strong> Pediatric indication adds a bonus percentage to the base rate of the underlying therapeutic area (e.g., Pediatric Oncology = 75% + 10% = 85% US Commercial).
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Comparator Scoring Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Step 2: Comparator Scoring Methodology
              </CardTitle>
              <CardDescription>Find 3-5 recently approved analogues (2020-2025) and score your molecule using these dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold">Dimension</th>
                      <th className="text-left p-3 font-semibold">Measurement</th>
                      <th className="text-left p-3 font-semibold">Calculation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativeMetrics.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{row.dimension}</td>
                        <td className="p-3 text-muted-foreground">{row.measurement}</td>
                        <td className="p-3"><Badge variant="outline" className="text-xs">{row.calculation}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">Composite Comparator Score = Average of all ratios</h4>
                <div className="flex flex-wrap gap-2">
                  {compositeScoreInterpretation.map((item, i) => (
                    <Badge key={i} className={`text-xs ${item.color}`}>{item.range}: {item.label}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 2: TA BENCHMARKING ===== */}
        <TabsContent value="benchmarks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical className="h-5 w-5 text-primary" />
                Step 3: Therapeutic Area-Specific Benchmarking Tables
              </CardTitle>
              <CardDescription>Detailed comparator benchmarking with recent approval data and example probability calculations for all 20 TAs</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {taBenchmarkingData.map((ta, idx) => (
                  <AccordionItem key={idx} value={`ta-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-sm">{ta.ta}</span>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {/* Pediatrics special case */}
                      {ta.isPediatric ? (
                        <div className="space-y-4">
                          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-2">Pediatric Modifier — Cross-Cutting Bonus</h4>
                            <p className="text-xs text-muted-foreground mb-3">
                              Pediatrics is not a separate TA but adds a bonus modifier reflecting regulatory advantages (PREA, BPCA, PRV), payer prioritization, smaller populations, and ethical imperatives.
                            </p>
                            <div className="grid gap-2 md:grid-cols-2">
                              {ta.pediatricModifiers!.map((mod, i) => (
                                <div key={i} className="flex items-center justify-between bg-background rounded p-2 border text-xs">
                                  <span className="font-medium">{mod.market}</span>
                                  <Badge variant="outline" className="text-green-600 border-green-300">{mod.bonus}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Example Applications</h4>
                            <div className="space-y-2">
                              {ta.pediatricExamples!.map((ex, i) => (
                                <div key={i} className="bg-muted/50 rounded p-3 border text-xs">
                                  <p className="font-medium">{ex.name}</p>
                                  <p className="text-muted-foreground">Base TA ({ex.baseTA}): {ex.baseRate} + Pediatric bonus: {ex.bonus} = <strong>{ex.adjusted}</strong></p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Benchmark Table */}
                          {ta.benchmarks.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Recent Approval Benchmarks (2020-2025)</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b bg-muted/50">
                                      <th className="text-left p-2 font-semibold">Molecule</th>
                                      <th className="text-left p-2 font-semibold">Indication</th>
                                      <th className="text-center p-2 font-semibold">US</th>
                                      <th className="text-center p-2 font-semibold">NICE</th>
                                      <th className="text-center p-2 font-semibold">G-BA</th>
                                      <th className="text-center p-2 font-semibold">ICER</th>
                                      <th className="text-left p-2 font-semibold">Key Endpoint</th>
                                      <th className="text-left p-2 font-semibold">Success Factor</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ta.benchmarks.map((b, i) => (
                                      <tr key={i} className="border-b hover:bg-muted/30">
                                        <td className="p-2 font-medium">{b.molecule}</td>
                                        <td className="p-2 text-muted-foreground">{b.indication}</td>
                                        <td className="p-2 text-center"><Badge variant="outline" className={`text-xs ${b.usApproval === "Yes" ? "text-green-600 border-green-300" : b.usApproval.includes("Reject") || b.usApproval === "Withdrawn" ? "text-red-600 border-red-300" : "text-yellow-600 border-yellow-300"}`}>{b.usApproval}</Badge></td>
                                        <td className="p-2 text-center text-xs text-muted-foreground">{b.niceRec}</td>
                                        <td className="p-2 text-center text-xs text-muted-foreground">{b.gba}</td>
                                        <td className="p-2 text-center text-xs">{b.icer}</td>
                                        <td className="p-2 text-xs text-muted-foreground">{b.keyEndpoint}</td>
                                        <td className="p-2 text-xs text-muted-foreground">{b.successFactor}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Example Calculation */}
                          {ta.example && (
                            <div className="border rounded-lg p-4 mt-3">
                              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                                Example: {ta.example.title}
                              </h4>
                              <div className="grid gap-3 md:grid-cols-2">
                                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded p-3">
                                  <h5 className="font-semibold text-xs text-blue-700 dark:text-blue-300 mb-1">Your Molecule</h5>
                                  {Object.entries(ta.example.yourMolecule).map(([k, v]) => (
                                    <p key={k} className="text-xs text-muted-foreground"><span className="font-medium capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {String(v)}</p>
                                  ))}
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-950/20 border border-gray-200 rounded p-3">
                                  <h5 className="font-semibold text-xs text-gray-700 dark:text-gray-300 mb-1">Comparator Average</h5>
                                  {Object.entries(ta.example.comparatorAvg).map(([k, v]) => (
                                    <p key={k} className="text-xs text-muted-foreground"><span className="font-medium capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</span> {String(v)}</p>
                                  ))}
                                </div>
                              </div>
                              <div className="mt-3">
                                <h5 className="font-semibold text-xs mb-1">Ratio Calculation</h5>
                                <div className="grid gap-1 md:grid-cols-2">
                                  {ta.example.ratios.map((r, i) => (
                                    <p key={i} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">• {r}</p>
                                  ))}
                                </div>
                                <p className="text-sm font-semibold mt-2">Composite Score: <Badge variant="outline" className="text-green-600 border-green-300">{ta.example.compositeScore}</Badge></p>
                              </div>
                              <div className="mt-3 bg-muted/50 rounded-lg p-3 border">
                                <h5 className="font-semibold text-xs mb-1">Probability Calculation</h5>
                                <p className="text-xs"><strong>Base rate:</strong> {ta.example.probability.baseRate}</p>
                                <p className="text-xs"><strong>Composite:</strong> {ta.example.probability.composite}</p>
                                {ta.example.probability.adjustments.length > 0 && (
                                  <div className="text-xs mt-1">
                                    <strong>Adjustments:</strong>
                                    {ta.example.probability.adjustments.map((a, i) => (
                                      <span key={i} className="block ml-2">• {a}</span>
                                    ))}
                                  </div>
                                )}
                                <p className="text-sm font-bold mt-2 text-primary">Final: {ta.example.probability.final}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 3: MARKET ADJUSTMENTS ===== */}
        <TabsContent value="adjustments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5 text-primary" />
                Step 4: Market-Specific Probability Adjustments
              </CardTitle>
              <CardDescription>Applied after composite score calculation — add/subtract based on market-specific regulatory, policy, and access factors</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-2">
                {marketAdjustmentsStep4.map((market, idx) => (
                  <AccordionItem key={idx} value={`adj-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold">{market.market}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left p-2 font-semibold">Adjustment</th>
                              <th className="text-center p-2 font-semibold min-w-[100px]">Value</th>
                              <th className="text-left p-2 font-semibold">Trigger</th>
                            </tr>
                          </thead>
                          <tbody>
                            {market.adjustments.map((adj, i) => (
                              <tr key={i} className={`border-b ${adj.value.includes('-') ? 'bg-red-50/50 dark:bg-red-950/10' : 'bg-green-50/50 dark:bg-green-950/10'}`}>
                                <td className="p-2 font-medium">{adj.item}</td>
                                <td className="p-2 text-center">
                                  <Badge variant="outline" className={`text-xs ${adj.value.includes('-') ? 'text-red-600 border-red-300' : 'text-green-600 border-green-300'}`}>
                                    {adj.value}
                                  </Badge>
                                </td>
                                <td className="p-2 text-muted-foreground">{adj.trigger}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Final Formula */}
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <div className="bg-muted/50 rounded-lg p-4 border text-center space-y-2">
                <h4 className="font-bold text-lg">Final Probability Calculation Formula</h4>
                <p className="font-mono text-sm">Final Probability = (Base Rate × Composite Comparator Score) + Market Adjustments</p>
                <div className="flex justify-center gap-4 mt-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">Cap: 95% maximum</Badge>
                  <Badge className="bg-red-100 text-red-800 border-red-200">Floor: 5% minimum</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== TAB 4: INTERACTIVE CALCULATOR ===== */}
        <TabsContent value="calculator" className="space-y-4">
          <Model2Calculator />
        </TabsContent>

        {/* ===== TAB 5: USAGE GUIDANCE ===== */}
        <TabsContent value="guidance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-green-700 dark:text-green-300">
                  <TrendingUp className="h-5 w-5" />
                  Use Model 2 When
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {whenToUseModel2.map((item, i) => (
                    <div key={i} className="bg-green-50 dark:bg-green-950/20 border border-green-200 rounded p-3">
                      <p className="text-sm font-medium">{item.scenario}</p>
                      <p className="text-xs text-muted-foreground">e.g., {item.example}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-300">
                  <FileText className="h-5 w-5" />
                  Do NOT Use Model 2 When
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {whenNotModel2.map((item, i) => (
                    <div key={i} className="bg-red-50 dark:bg-red-950/20 border border-red-200 rounded p-3">
                      <p className="text-sm font-medium">{item.scenario}</p>
                      <p className="text-xs text-muted-foreground">Instead use: {item.alternative}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary recommendation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-primary" />
                Model 1 vs. Model 2 — Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Use Model 1</h4>
                  <p className="text-sm text-muted-foreground">For detailed market-entry planning with specific payer targets, first-in-class molecules, novel mechanisms with unclear payer reception, or therapeutic areas with few recent approvals.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Use Model 2</h4>
                  <p className="text-sm text-muted-foreground">When you have recent comparator data for rapid benchmarking across multiple markets, especially for "me-better" molecules with well-established payer precedents in the therapeutic area.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
