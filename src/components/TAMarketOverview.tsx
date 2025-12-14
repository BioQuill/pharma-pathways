import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, TrendingUp, Building2, DollarSign, Activity, Calendar } from "lucide-react";
import { getAllTACompositeIndexes } from "@/lib/taCompositeIndex";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
import { calculateTTMMonths, type MarketData } from "@/lib/scoring";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
  overallScore: number;
  marketData: MarketData[];
  scores: any;
}

interface TAMarketOverviewProps {
  molecules: MoleculeProfile[];
}

// Mapping of full TA names to composite index keys
const TA_NAME_MAP: Record<string, string> = {
  'Oncology/Hematology': 'ONCOLOGY/HEMATOLOGY',
  'Cardiovascular': 'CARDIOVASCULAR',
  'Neurology/CNS': 'NEUROLOGY/CNS',
  'Psychiatry/Mental Health': 'PSYCHIATRY/MENTAL HEALTH',
  'Immunology & Inflammation': 'IMMUNOLOGY & INFLAMMATION',
  'Rheumatology': 'RHEUMATOLOGY',
  'Infectious Diseases': 'INFECTIOUS DISEASES',
  'Respiratory/Pulmonology': 'RESPIRATORY/PULMONOLOGY',
  'Gastroenterology & Hepatology': 'GASTROENTEROLOGY & HEPATOLOGY',
  'Nephrology/Renal': 'NEPHROLOGY/RENAL',
  'Dermatology': 'DERMATOLOGY',
  'Ophthalmology': 'OPHTHALMOLOGY',
  'Rare Diseases/Orphan Drugs': 'RARE DISEASES/ORPHAN',
  'Vaccines & Virology': 'VACCINES & VIROLOGY',
  'Women\'s Health': 'WOMEN\'S HEALTH',
  'Urology': 'UROLOGY',
  'Pain Management/Anesthesia': 'PAIN MANAGEMENT/ANESTHESIA',
  'Transplantation & Cell/Gene Therapy': 'TRANSPLANT/CELL-GENE',
  'Pediatrics': 'PEDIATRICS',
  'Endocrinology & Metabolism': 'ENDOCRINOLOGY & METABOLISM',
  'Metabolic/Endocrinology': 'ENDOCRINOLOGY & METABOLISM',
  'Obesity': 'ENDOCRINOLOGY & METABOLISM',
};

// Market Dynamics content by TA
const MARKET_DYNAMICS: Record<string, {
  approvedDrugs?: { name: string; details: string }[];
  approvedDrugsTitle?: string;
  pipelineRace?: { name: string; details: string }[];
  marketSize?: { category: string; value: string }[];
  keyTrends?: string[];
  winnersLosers?: { category: string; items: { name: string; details: string }[] }[];
  bottomLine?: string;
  investmentThesis?: string;
  lastUpdated: string;
  nextCatalyst?: string;
}> = {
  'ENDOCRINOLOGY & METABOLISM': {
    approvedDrugsTitle: 'Approved GLP-1 RAs for Obesity/Diabetes:',
    approvedDrugs: [
      { name: 'Wegovy (semaglutide 2.4mg)', details: '~15% weight loss, once-weekly injection' },
      { name: 'Zepbound (tirzepatide 15mg)', details: '~22.5% weight loss, once-weekly injection' },
      { name: 'Rybelsus (oral semaglutide)', details: 'Modest weight loss, daily oral' },
    ],
    pipelineRace: [
      { name: 'Orforglipron (Lilly)', details: 'First oral non-peptide GLP-1, 11-24% weight loss, filing 2025-26' },
      { name: 'Retatrutide (Lilly)', details: '28.7% weight loss (highest to date), filing 2026-27' },
      { name: 'CagriSema (Novo)', details: '22.7% weight loss, filing 2026-27' },
      { name: 'Survodutide (Boehringer)', details: '16-20% weight loss + MASH leader, filing 2026-27' },
      { name: 'Petrelintide (AstraZeneca)', details: 'Unknown efficacy, Phase 2b ongoing' },
    ],
    marketSize: [
      { category: 'Global Obesity Market', value: '$25B in 2025, projected $100B+ by 2030' },
      { category: 'Type 2 Diabetes Market', value: '$50B+ globally' },
      { category: 'MASH Market', value: 'Emerging, $10-20B potential' },
      { category: 'Combined Addressable Market', value: '$150B+ by 2030' },
    ],
    keyTrends: [
      'Efficacy Arms Race: Market moving toward 25-30% weight loss as new standard',
      'Oral Formulations: Orforglipron could revolutionize convenience',
      'Multiple Indications: Drugs targeting obesity + T2D + MASH + CVD simultaneously',
      'Tolerability Focus: As efficacy increases, GI side effects become key differentiator',
      'Access & Pricing: Pressure to reduce costs and improve insurance coverage',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Orforglipron', details: 'First oral GLP-1, superior to competitors, convenient, scalable' },
          { name: 'Retatrutide', details: 'Highest efficacy (28.7%), multiple indications, Lilly\'s next pillar' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Survodutide', details: 'Best-in-class MASH, strong liver focus, niche leadership' },
          { name: 'CagriSema', details: 'Solid efficacy, but needs differentiation vs. tirzepatide' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Petrelintide', details: 'Novel mechanism, but unproven efficacy and late to market' },
        ],
      },
    ],
    bottomLine: 'The endocrinology/metabolism space is experiencing a golden age of innovation. Multiple blockbuster drugs with >$1B potential are advancing through Phase 3, each offering unique benefits. The race for market share will be determined by: (1) Efficacy: 25-30% weight loss becoming the bar, (2) Convenience: Oral > injectable, (3) Safety/Tolerability: Manageable GI side effects critical, (4) Multi-indication: Drugs treating obesity + T2D + MASH + CV will dominate, (5) Time to Market: First movers have significant advantage.',
    investmentThesis: 'Eli Lilly is best positioned with both orforglipron (oral convenience, 2026 launch) and retatrutide (highest efficacy, 2027 launch). Novo Nordisk\'s CagriSema faces tough competition but remains viable. Boehringer Ingelheim\'s survodutide could dominate MASH. AstraZeneca\'s petrelintide is high-risk/high-reward depending on Phase 2b results.',
    lastUpdated: 'December 12, 2025',
    nextCatalyst: 'Retatrutide additional Phase 3 results (7 trials in 2026)',
  },
  'DERMATOLOGY': {
    approvedDrugsTitle: 'Approved Biologics for Inflammatory Skin Conditions:',
    approvedDrugs: [
      { name: 'Dupixent (dupilumab)', details: '~65-75% clear/almost clear skin (EASI-75), every-2-weeks injection' },
      { name: 'Skyrizi (risankizumab)', details: '~85-90% PASI-90 response, every-12-weeks injection' },
      { name: 'Tremfya (guselkumab)', details: '~80-85% PASI-90 response, every-8-weeks injection' },
    ],
    pipelineRace: [
      { name: 'Bimekizumab (UCB)', details: 'Dual IL-17A/F inhibitor, 85-90% PASI-100, approved EU/US 2023-24' },
      { name: 'Nemolizumab (Galderma)', details: 'IL-31 inhibitor for prurigo nodularis/atopic dermatitis, filing 2024-25' },
      { name: 'Lebrikizumab (Lilly)', details: 'IL-13 inhibitor, 40-50% clear skin, approved 2024' },
      { name: 'Rocatinlimab (Pfizer)', details: 'OX40 inhibitor, novel MOA, Phase 3 ongoing' },
      { name: 'Oral JAK inhibitors', details: 'Abrocitinib, Upadacitinib - oral convenience, safety monitoring required' },
    ],
    marketSize: [
      { category: 'Global Atopic Dermatitis Market', value: '$12B in 2025, projected $25B+ by 2030' },
      { category: 'Psoriasis Market', value: '$20B+ globally, projected $30B by 2030' },
      { category: 'Hidradenitis Suppurativa Market', value: 'Emerging, $3-5B potential' },
      { category: 'Combined Addressable Market', value: '$60B+ by 2030' },
    ],
    keyTrends: [
      'Complete Clearance Race: Market moving toward PASI-100/IGA 0 as new efficacy standard',
      'Oral Formulations: JAK inhibitors offering oral convenience vs. biologics',
      'Faster Onset: IL-17 and IL-23 inhibitors showing rapid response within weeks',
      'Safety Differentiation: Long-term safety profiles becoming key differentiator',
      'Expansion to New Indications: AD drugs moving into prurigo nodularis, eczema variants',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Bimekizumab', details: 'Highest PASI-100 rates, dual mechanism, rapid onset' },
          { name: 'Skyrizi', details: 'Best-in-class IL-23, convenient quarterly dosing, excellent safety profile' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Nemolizumab', details: 'First IL-31 inhibitor, addresses unmet pruritus need' },
          { name: 'Lebrikizumab', details: 'IL-13 focused, good safety, but crowded AD market' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Oral JAK inhibitors', details: 'Convenience advantage offset by FDA safety warnings, boxed labels' },
        ],
      },
    ],
    bottomLine: 'The dermatology market is maturing with multiple highly effective biologics achieving near-complete skin clearance. Competition is intensifying around: (1) Complete clearance rates (PASI-100/IGA 0), (2) Dosing convenience (quarterly dosing winning), (3) Safety profiles (long-term data critical), (4) Expansion into adjacent conditions, (5) Oral vs. injectable preference trade-offs.',
    investmentThesis: 'UCB\'s bimekizumab leads with dual IL-17A/F mechanism achieving highest complete clearance. AbbVie\'s Skyrizi dominates IL-23 class with best-in-class efficacy and quarterly dosing. Galderma\'s nemolizumab could capture pruritus-focused niche. JAK inhibitors face headwinds from safety concerns but offer oral convenience for injection-averse patients.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Nemolizumab Phase 3 atopic dermatitis results and regulatory submissions (2025-26)',
  },
  'ONCOLOGY/HEMATOLOGY': {
    approvedDrugsTitle: 'Key Approved Oncology Therapies:',
    approvedDrugs: [
      { name: 'Keytruda (pembrolizumab)', details: 'PD-1 inhibitor, $25B+ sales, 30+ indications across solid tumors' },
      { name: 'Opdivo (nivolumab)', details: 'PD-1 inhibitor, $9B+ sales, broad solid tumor coverage' },
      { name: 'Tecentriq (atezolizumab)', details: 'PD-L1 inhibitor, lung/breast/bladder cancers' },
    ],
    pipelineRace: [
      { name: 'ADCs (Antibody-Drug Conjugates)', details: 'Enhertu, Padcev leading; 100+ ADCs in development' },
      { name: 'Bispecific T-cell Engagers', details: 'Tecvayli, Talvey for hematologic malignancies, expanding to solid tumors' },
      { name: 'CAR-T Next-Gen', details: 'Allogeneic and armored CAR-T addressing durability/cost limitations' },
      { name: 'KRAS Inhibitors', details: 'Sotorasib, Adagrasib; next-gen pan-KRAS inhibitors in development' },
      { name: 'Targeted Protein Degraders', details: 'PROTACs and molecular glues targeting "undruggable" proteins' },
    ],
    marketSize: [
      { category: 'Global Oncology Market', value: '$200B+ in 2025, projected $400B by 2030' },
      { category: 'Immuno-oncology Segment', value: '$60B+ globally' },
      { category: 'Hematologic Malignancies', value: '$50B+, CAR-T growing 30%+ annually' },
      { category: 'Precision Oncology', value: '$100B+ addressable with biomarker-driven therapies' },
    ],
    keyTrends: [
      'ADC Explosion: Antibody-drug conjugates becoming dominant modality with improved linker technology',
      'Earlier Lines: IO moving from metastatic to adjuvant/neoadjuvant settings',
      'Combination Strategies: IO + targeted therapy combinations becoming standard of care',
      'Biomarker Mandates: Companion diagnostics required for most new approvals',
      'Cell Therapy Scale: Manufacturing innovations enabling broader CAR-T access',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Merck (Keytruda)', details: 'Dominant IO franchise, expanding indications, $30B+ peak sales potential' },
          { name: 'Daiichi Sankyo/AstraZeneca', details: 'Enhertu best-in-class ADC, multiple tumor types' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Seagen/Pfizer', details: 'ADC expertise with Padcev/Adcetris' },
          { name: 'Janssen', details: 'Bispecific leadership in hematology' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'First-gen CAR-T', details: 'Manufacturing costs and durability challenges vs. bispecifics' },
        ],
      },
    ],
    bottomLine: 'Oncology remains the largest therapeutic market with robust innovation. Key success factors: (1) Platform technologies (ADCs, bispecifics) over single assets, (2) Biomarker strategy for patient selection, (3) Combination trial designs, (4) Earlier treatment settings, (5) Manufacturing scale for cell therapies.',
    investmentThesis: 'Merck maintains IO dominance with Keytruda lifecycle management. ADC developers (Daiichi, Seagen) positioned for sustained growth. Bispecific platforms gaining share from CAR-T in hematology. Watch for next-gen KRAS and protein degrader breakthroughs targeting historically undruggable targets.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'ADC combination trials readouts and KRAS G12D inhibitor Phase 2 data (2026)',
  },
  'CARDIOVASCULAR': {
    approvedDrugsTitle: 'Key Approved Cardiovascular Therapies:',
    approvedDrugs: [
      { name: 'Entresto (sacubitril/valsartan)', details: 'Heart failure standard of care, $6B+ peak sales' },
      { name: 'Repatha/Praluent (PCSK9 inhibitors)', details: '50-60% LDL reduction, CV outcomes proven' },
      { name: 'Jardiance/Farxiga (SGLT2 inhibitors)', details: 'Heart failure + renal protection, $10B+ combined' },
    ],
    pipelineRace: [
      { name: 'Inclisiran (Novartis)', details: 'siRNA PCSK9, twice-yearly dosing, physician-administered' },
      { name: 'Zilebesiran (Alnylam)', details: 'siRNA targeting angiotensinogen for hypertension, Phase 3' },
      { name: 'Olpasiran (Amgen)', details: 'siRNA targeting Lp(a), 90%+ reduction, Phase 3' },
      { name: 'Aficamten (Cytokinetics)', details: 'Cardiac myosin inhibitor for HCM, filing 2025' },
      { name: 'CRISPR therapies', details: 'Gene editing for ATTR cardiomyopathy, early clinical' },
    ],
    marketSize: [
      { category: 'Global Cardiovascular Market', value: '$60B+ in 2025' },
      { category: 'Heart Failure Segment', value: '$15B+, growing with SGLT2 expansion' },
      { category: 'Lipid Management', value: '$25B+, PCSK9/siRNA growing rapidly' },
      { category: 'Hypertension Novel Therapies', value: 'Emerging $10B+ opportunity' },
    ],
    keyTrends: [
      'RNA Therapeutics: siRNA enabling long-acting, high-efficacy approaches to lipids and BP',
      'Lp(a) Targeting: New CV risk factor with massive unmet need (20% of population)',
      'HFpEF Focus: Heart failure with preserved EF emerging as major target',
      'Gene Therapy Potential: One-time treatments for genetic cardiomyopathies',
      'Prevention Shift: Earlier intervention in high-risk asymptomatic patients',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Olpasiran (Amgen)', details: 'First-in-class Lp(a) reduction, massive unmet need' },
          { name: 'Zilebesiran (Alnylam)', details: 'Potential to transform hypertension management with 6-month dosing' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Inclisiran', details: 'Twice-yearly PCSK9 siRNA, convenience advantage' },
          { name: 'Aficamten', details: 'Novel MOA for HCM, addressing mavacamten limitations' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Gene therapies', details: 'Promising but early; manufacturing and durability questions' },
        ],
      },
    ],
    bottomLine: 'Cardiovascular is experiencing an RNA revolution. Key success factors: (1) Long-acting formulations reducing adherence burden, (2) Novel targets (Lp(a), angiotensinogen) addressing residual risk, (3) CV outcomes trials demonstrating mortality benefit, (4) Earlier intervention paradigms, (5) Gene therapy potential for inherited conditions.',
    investmentThesis: 'Amgen\'s olpasiran could be first blockbuster Lp(a) therapy. Alnylam\'s zilebesiran may redefine hypertension treatment. Novartis positioned with inclisiran distribution network. Watch Cytokinetics for HCM leadership. Gene editing represents long-term transformative opportunity.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Olpasiran Phase 3 CV outcomes trial results (OCEAN(a)-Outcomes, 2026)',
  },
  'NEUROLOGY/CNS': {
    approvedDrugsTitle: 'Key Approved Neurology Therapies:',
    approvedDrugs: [
      { name: 'Leqembi (lecanemab)', details: 'Anti-amyloid for Alzheimer\'s, 27% slowing of decline, IV infusion' },
      { name: 'Kisunla (donanemab)', details: 'Anti-amyloid for Alzheimer\'s, 35% slowing, potential to stop treatment' },
      { name: 'Ocrevus (ocrelizumab)', details: 'Anti-CD20 for MS, $8B+ sales, twice-yearly infusion' },
    ],
    pipelineRace: [
      { name: 'Trontinemab (Roche)', details: 'Brain-shuttled anti-amyloid, improved BBB penetration, Phase 3' },
      { name: 'Buntanetap (Annovis)', details: 'Reduces multiple neurotoxic proteins, Parkinson\'s/Alzheimer\'s' },
      { name: 'CGRP receptor antagonists', details: 'Atogepant, rimegepant for migraine prevention' },
      { name: 'ASO/RNAi for genetic forms', details: 'Targeting tau, alpha-synuclein in familial neurodegeneration' },
      { name: 'GLP-1 agonists for neuroprotection', details: 'Semaglutide in Parkinson\'s Phase 3 trials' },
    ],
    marketSize: [
      { category: 'Alzheimer\'s Disease Market', value: '$10B+ by 2025, projected $30B+ by 2030' },
      { category: 'Multiple Sclerosis Market', value: '$30B globally' },
      { category: 'Parkinson\'s Disease Market', value: '$8B+, disease-modifying therapies emerging' },
      { category: 'Migraine Market', value: '$10B+, rapid CGRP growth' },
    ],
    keyTrends: [
      'Alzheimer\'s Breakthrough: Anti-amyloid antibodies proving disease modification possible',
      'Biomarker Revolution: Blood-based diagnostics enabling earlier diagnosis',
      'Beyond Amyloid: Tau-targeting and multi-mechanism approaches advancing',
      'GLP-1 Repurposing: Obesity drugs showing neuroprotective potential',
      'Genetic Precision: ASO/RNAi for inherited forms of neurodegeneration',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Roche (Trontinemab)', details: 'Brain-shuttle technology may enable monthly dosing, better efficacy' },
          { name: 'CGRP class (Pfizer/AbbVie)', details: 'Oral/injectable options dominating migraine prevention' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Semaglutide (Novo)', details: 'Potential disease modification in Parkinson\'s, watching Phase 3' },
          { name: 'Tau-targeting programs', details: 'Next wave if amyloid + tau combination proves synergistic' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'First-gen anti-amyloid', details: 'Leqembi/Kisunla face ARIA safety concerns and access challenges' },
        ],
      },
    ],
    bottomLine: 'Neurology is entering a disease-modification era after decades of symptomatic-only treatments. Key factors: (1) Improved BBB penetration technologies, (2) Earlier intervention with biomarker-guided diagnosis, (3) Combination approaches targeting multiple pathologies, (4) Safety management of ARIA, (5) Access and infrastructure for infusion therapies.',
    investmentThesis: 'Roche\'s brain-shuttle platform could leapfrog first-gen anti-amyloid. CGRP continues strong growth in migraine. GLP-1 repurposing for neurodegeneration is high-upside watch. Genetic therapies for inherited forms represent smaller but highly profitable niches.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Trontinemab Phase 3 data and semaglutide Parkinson\'s Phase 3 results (2026-27)',
  },
  'PSYCHIATRY/MENTAL HEALTH': {
    approvedDrugsTitle: 'Key Approved Psychiatric Therapies:',
    approvedDrugs: [
      { name: 'Spravato (esketamine)', details: 'Treatment-resistant depression, nasal spray, REMS required' },
      { name: 'Caplyta (lumateperone)', details: 'Schizophrenia and bipolar depression, differentiated safety' },
      { name: 'Vraylar (cariprazine)', details: 'Broad bipolar and schizophrenia coverage, $3B+ sales' },
    ],
    pipelineRace: [
      { name: 'Zuranolone (Biogen/Sage)', details: 'Oral neuroactive steroid for MDD/PPD, 2-week course' },
      { name: 'Psilocybin (COMPASS)', details: 'Psychedelic-assisted therapy for TRD, Phase 3' },
      { name: 'MDMA (Lykos)', details: 'For PTSD, FDA CRL received, path forward uncertain' },
      { name: 'Emraclidine (Cerevel/AbbVie)', details: 'M4 muscarinic agonist for schizophrenia, Phase 3' },
      { name: 'Ulotaront (Sumitomo)', details: 'TAAR1 agonist for schizophrenia, mixed Phase 3 results' },
    ],
    marketSize: [
      { category: 'Major Depressive Disorder Market', value: '$15B+ globally' },
      { category: 'Schizophrenia Market', value: '$10B+' },
      { category: 'PTSD/Anxiety Market', value: '$5B+, significant unmet need' },
      { category: 'Treatment-Resistant Conditions', value: '$8B+ opportunity with novel mechanisms' },
    ],
    keyTrends: [
      'Rapid-Acting Antidepressants: Ketamine derivatives and neuroactive steroids offering fast relief',
      'Psychedelic Renaissance: Psilocybin and MDMA approaching potential approval',
      'Novel Mechanisms: Moving beyond dopamine D2 blockade in schizophrenia',
      'Digital Therapeutics: App-based CBT gaining traction as adjunctive therapy',
      'Precision Psychiatry: Biomarker development for treatment selection',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Zuranolone', details: 'First oral rapid-acting antidepressant, short treatment course' },
          { name: 'Emraclidine', details: 'Novel muscarinic approach could transform schizophrenia treatment' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Psilocybin', details: 'Transformative potential but regulatory and scaling challenges' },
          { name: 'Caplyta', details: 'Expanding indications, favorable metabolic profile' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'MDMA (Lykos)', details: 'CRL creates major uncertainty; trial conduct issues' },
        ],
      },
    ],
    bottomLine: 'Psychiatry is experiencing unprecedented innovation after decades of "me-too" drugs. Key factors: (1) Novel mechanisms beyond monoamines, (2) Rapid onset of action, (3) Psychedelic-assisted therapy regulatory pathways, (4) Tolerability vs. existing treatments, (5) Reimbursement for non-traditional delivery models.',
    investmentThesis: 'Biogen/Sage\'s zuranolone offers near-term commercial opportunity. COMPASS psilocybin represents high-risk/high-reward paradigm shift. AbbVie\'s emraclidine acquisition signals big pharma confidence in novel mechanisms. Watch for treatment-resistant depression becoming major competitive battleground.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'COMPASS psilocybin Phase 3 completion and emraclidine Phase 3 readouts (2026)',
  },
  'IMMUNOLOGY & INFLAMMATION': {
    approvedDrugsTitle: 'Key Approved Immunology Therapies:',
    approvedDrugs: [
      { name: 'Humira (adalimumab)', details: 'Anti-TNF, facing biosimilar erosion, $20B peak' },
      { name: 'Stelara (ustekinumab)', details: 'IL-12/23 inhibitor, IBD/psoriasis, $11B peak' },
      { name: 'Rinvoq (upadacitinib)', details: 'JAK inhibitor, multiple indications, $5B+ trajectory' },
    ],
    pipelineRace: [
      { name: 'TL1A inhibitors', details: 'Tulisokibart (Merck), RVT-3101 (Roche) for IBD, Phase 3' },
      { name: 'Obexelimab (Zymeworks)', details: 'CD19xCD32b bispecific for autoimmune, Phase 2/3' },
      { name: 'Deucravacitinib (BMS)', details: 'TYK2 inhibitor for psoriasis, expanding to lupus' },
      { name: 'CAR-T for autoimmune', details: 'CD19 CAR-T showing remarkable lupus remissions' },
      { name: 'IL-23 next-gen', details: 'Mirikizumab, brazikumab expanding IBD coverage' },
    ],
    marketSize: [
      { category: 'Inflammatory Bowel Disease Market', value: '$25B+ globally' },
      { category: 'Rheumatoid Arthritis Market', value: '$30B+, shifting to targeted therapies' },
      { category: 'Lupus/Autoimmune Market', value: '$15B+, significant unmet need' },
      { category: 'Combined Addressable Market', value: '$80B+ by 2030' },
    ],
    keyTrends: [
      'TL1A Wave: Novel target with potential to outperform existing IBD therapies',
      'Biosimilar Disruption: Anti-TNF biosimilars reshaping market economics',
      'JAK Safety Evolution: Targeted JAK inhibitors addressing safety concerns',
      'Cell Therapy Crossover: Oncology CAR-T technology entering autoimmune space',
      'Oral Convenience: TYK2 and JAK inhibitors competing on convenience',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'TL1A inhibitors', details: 'Novel target with strong IBD efficacy signals across multiple programs' },
          { name: 'CAR-T for autoimmune', details: 'Remarkable durable remissions in lupus, potentially curative' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Rinvoq (AbbVie)', details: 'Broad label, oral convenience, managing safety positioning' },
          { name: 'IL-23 inhibitors', details: 'Proven efficacy, expanding to IBD from psoriasis' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Anti-TNF biosimilars', details: 'Commoditization pressure affecting all TNF inhibitors' },
        ],
      },
    ],
    bottomLine: 'Immunology is transitioning from anti-TNF dominance to targeted mechanisms and cell therapy. Key factors: (1) TL1A as the next major target, (2) CAR-T curative potential in autoimmune, (3) Oral vs. injectable preference, (4) Safety profile differentiation, (5) Biosimilar economics reshaping market.',
    investmentThesis: 'Merck/Roche TL1A programs could define next generation of IBD treatment. CD19 CAR-T for autoimmune represents paradigm shift - watch Kyverna, Cabaletta. AbbVie defending immunology franchise with Rinvoq/Skyrizi. TYK2 inhibitors offer differentiated oral option with potentially cleaner safety.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'TL1A inhibitor Phase 3 IBD results and CAR-T autoimmune expansion trials (2026)',
  },
  'RHEUMATOLOGY': {
    approvedDrugsTitle: 'Key Approved Rheumatology Therapies:',
    approvedDrugs: [
      { name: 'Xeljanz (tofacitinib)', details: 'First oral JAK inhibitor for RA, boxed warning' },
      { name: 'Orencia (abatacept)', details: 'T-cell co-stimulation modulator, RA/JIA' },
      { name: 'Kevzara (sarilumab)', details: 'IL-6 receptor inhibitor, RA' },
    ],
    pipelineRace: [
      { name: 'Nipocalimab (J&J)', details: 'FcRn inhibitor for myasthenia gravis, Phase 3' },
      { name: 'Rozibafusp alfa (AbbVie)', details: 'PD-1/TGF-β trap for systemic sclerosis' },
      { name: 'Anifrolumab (AstraZeneca)', details: 'Type I IFN receptor for lupus, expanding indications' },
      { name: 'KPL-404 (Kiniksa)', details: 'CD40L inhibitor for Sjögren\'s syndrome, Phase 2' },
      { name: 'Iberdomide (BMS)', details: 'CELMoD for systemic lupus erythematosus' },
    ],
    marketSize: [
      { category: 'Rheumatoid Arthritis Market', value: '$30B globally, mature but stable' },
      { category: 'Lupus Market', value: '$5B+, rapidly growing with new approvals' },
      { category: 'Rare Rheumatic Diseases', value: '$8B+, high unmet need' },
      { category: 'Combined Addressable Market', value: '$50B+ by 2030' },
    ],
    keyTrends: [
      'Beyond RA: Focus shifting to lupus, Sjögren\'s, systemic sclerosis',
      'FcRn Inhibition: Novel mechanism for antibody-mediated autoimmune diseases',
      'Precision Medicine: Biomarker-guided treatment selection advancing',
      'B-cell Depletion: Next-gen anti-CD20 and CD19 therapies',
      'Oral Small Molecules: Competing with biologics on convenience',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Anifrolumab (Saphnelo)', details: 'First new lupus MOA in decades, expanding evidence base' },
          { name: 'FcRn inhibitors', details: 'Efgartigimod, nipocalimab addressing multiple antibody-mediated diseases' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Rinvoq (AbbVie)', details: 'Expanding across rheumatic conditions' },
          { name: 'BTK inhibitors', details: 'Emerging in lupus and other B-cell driven diseases' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'First-gen JAK inhibitors', details: 'Safety concerns limiting growth potential' },
        ],
      },
    ],
    bottomLine: 'Rheumatology innovation is moving beyond RA to rarer autoimmune conditions. Key success factors: (1) Novel mechanisms for treatment-refractory patients, (2) Lupus as major growth opportunity, (3) Safety differentiation from JAK inhibitors, (4) Precision biomarker strategies, (5) Rare disease orphan drug economics.',
    investmentThesis: 'AstraZeneca\'s anifrolumab positioned as lupus leader. FcRn class (argenx, J&J) expanding across autoimmune. AbbVie defending position with Rinvoq label expansion. Watch CD40L inhibitors for Sjögren\'s - large underserved population.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Nipocalimab approvals and BTK inhibitor lupus Phase 3 data (2026)',
  },
  'INFECTIOUS DISEASES': {
    approvedDrugsTitle: 'Key Approved Infectious Disease Therapies:',
    approvedDrugs: [
      { name: 'Biktarvy (bictegravir)', details: 'Single-tablet HIV regimen, $12B+ sales, market leader' },
      { name: 'Paxlovid (nirmatrelvir)', details: 'Oral COVID-19 antiviral, protease inhibitor' },
      { name: 'Prevymis (letermovir)', details: 'CMV prophylaxis in transplant, $500M+' },
    ],
    pipelineRace: [
      { name: 'Lenacapavir (Gilead)', details: 'Twice-yearly HIV injection, PrEP and treatment, Phase 3' },
      { name: 'Ibalizumab long-acting', details: 'Monthly maintenance for multi-drug resistant HIV' },
      { name: 'Cefepime-taniborbactam (Venatorx)', details: 'Novel β-lactamase inhibitor for resistant gram-negatives' },
      { name: 'Gepotidacin (GSK)', details: 'Novel antibiotic for uncomplicated UTI, Phase 3' },
      { name: 'Broadly neutralizing antibodies', details: 'bnAbs for HIV prevention and functional cure' },
    ],
    marketSize: [
      { category: 'HIV Market', value: '$30B+ globally, stable with PrEP growth' },
      { category: 'Antibiotic/AMR Market', value: '$50B+, major unmet need in resistance' },
      { category: 'Antifungal Market', value: '$15B+, novel agents needed' },
      { category: 'Hepatitis/Viral Market', value: '$10B+, HBV cure efforts ongoing' },
    ],
    keyTrends: [
      'Long-Acting HIV: Shift from daily pills to yearly injections transforming prevention',
      'AMR Crisis: Antimicrobial resistance driving need for novel antibiotics',
      'Pandemic Preparedness: Broad-spectrum antivirals and platform technologies',
      'HIV Cure Research: Functional cure strategies advancing with bnAbs and gene therapy',
      'Fungal Infections Rising: Immunocompromised population growth driving need',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Lenacapavir (Gilead)', details: 'Game-changing 6-month dosing for HIV prevention and treatment' },
          { name: 'Novel β-lactamase inhibitors', details: 'Addressing critical carbapenem-resistant infections' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Gepotidacin', details: 'Novel mechanism for UTI, addressing fluoroquinolone resistance' },
          { name: 'Antifungal pipeline', details: 'Ibrexafungerp, fosmanogepix for resistant fungi' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'COVID-19 antivirals', details: 'Market normalizing, pandemic stockpiling ending' },
        ],
      },
    ],
    bottomLine: 'Infectious disease innovation focused on long-acting HIV and antimicrobial resistance. Key factors: (1) Convenience-driven HIV prevention, (2) Pull incentives for antibiotics, (3) Pandemic preparedness investments, (4) Resistant pathogen targeting, (5) Global health access considerations.',
    investmentThesis: 'Gilead\'s lenacapavir could capture significant PrEP market share with twice-yearly dosing. AMR-focused companies benefit from policy tailwinds (PASTEUR Act). Watch bnAb combinations for potential HIV functional cure. Antifungal developers addressing growing immunocompromised population.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Lenacapavir PrEP regulatory decisions and antibiotic pull incentive legislation (2025-26)',
  },
  'RESPIRATORY/PULMONOLOGY': {
    approvedDrugsTitle: 'Key Approved Respiratory Therapies:',
    approvedDrugs: [
      { name: 'Dupixent (dupilumab)', details: 'IL-4/13 for severe asthma, eosinophilic phenotype, $12B+' },
      { name: 'Tezspire (tezepelumab)', details: 'Anti-TSLP for severe asthma, broader phenotype coverage' },
      { name: 'Trikafta (elexacaftor)', details: 'CFTR modulator, transformative for cystic fibrosis' },
    ],
    pipelineRace: [
      { name: 'Itepekimab (Regeneron)', details: 'Anti-IL-33 for COPD, Phase 3' },
      { name: 'Astegolimab (Roche)', details: 'Anti-IL-33 for severe asthma and COPD' },
      { name: 'Ensifentrine (Verona)', details: 'Dual PDE3/4 inhibitor for COPD, nebulized, Phase 3' },
      { name: 'Depemokimab (GSK)', details: 'Ultra-long-acting anti-IL-5 for eosinophilic asthma' },
      { name: 'Vanzacaftor triple (Vertex)', details: 'Next-gen CFTR modulator for remaining CF patients' },
    ],
    marketSize: [
      { category: 'Asthma Market', value: '$30B globally, biologics driving growth' },
      { category: 'COPD Market', value: '$20B+, biologics emerging' },
      { category: 'Cystic Fibrosis Market', value: '$8B+, Vertex dominant' },
      { category: 'Idiopathic Pulmonary Fibrosis', value: '$5B+, unmet need remains' },
    ],
    keyTrends: [
      'COPD Biologics: IL-33 targeting enabling biologics in Type 2-low COPD',
      'Biomarker Precision: Blood eosinophils guiding treatment selection',
      'CF Expansion: Next-gen modulators reaching more genotypes',
      'Inhaler Innovation: Smart inhalers and digital monitoring',
      'IPF Treatment Gaps: Disease-modifying therapies still needed',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Dupixent', details: 'Continued expansion across Type 2 inflammatory conditions' },
          { name: 'Itepekimab/IL-33 class', details: 'First biologic opportunity in Type 2-low COPD' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Tezspire', details: 'Broad asthma phenotype coverage, less biomarker dependent' },
          { name: 'Ensifentrine', details: 'Novel inhaled mechanism for COPD, addressing gaps' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'IPF pipeline', details: 'Multiple failures, mechanism understanding still evolving' },
        ],
      },
    ],
    bottomLine: 'Respiratory biologics expanding from severe asthma to COPD. Key factors: (1) IL-33 as COPD breakthrough target, (2) Biomarker-guided patient selection, (3) Convenience of extended dosing, (4) CF modulator genotype expansion, (5) IPF remains challenging.',
    investmentThesis: 'Regeneron/Sanofi Dupixent franchise continues respiratory expansion. IL-33 inhibitors represent major COPD opportunity - watch Regeneron and Roche. Vertex maintains CF dominance with next-gen modulators. AstraZeneca/Amgen Tezspire competing for broad asthma positioning.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Itepekimab COPD Phase 3 results and ensifentrine FDA decision (2025-26)',
  },
  'GASTROENTEROLOGY & HEPATOLOGY': {
    approvedDrugsTitle: 'Key Approved GI/Hepatology Therapies:',
    approvedDrugs: [
      { name: 'Skyrizi (risankizumab)', details: 'IL-23 inhibitor for Crohn\'s, expanding to UC' },
      { name: 'Entyvio (vedolizumab)', details: 'Gut-selective integrin inhibitor, IBD standard of care' },
      { name: 'Rezdiffra (resmetirom)', details: 'First MASH-approved therapy, thyroid hormone receptor-β agonist' },
    ],
    pipelineRace: [
      { name: 'TL1A inhibitors', details: 'Tulisokibart, RVT-3101 for IBD with fibrosis potential, Phase 3' },
      { name: 'Survodutide (BI)', details: 'GLP-1/glucagon for MASH, strong Phase 2 data' },
      { name: 'Efruxifermin (Akero)', details: 'FGF21 analog for MASH, 40%+ fibrosis improvement' },
      { name: 'Pegozafermin (89bio)', details: 'FGF21 for MASH, weekly dosing' },
      { name: 'Mirikizumab (Lilly)', details: 'IL-23 for UC, differentiated maintenance dosing' },
    ],
    marketSize: [
      { category: 'Inflammatory Bowel Disease Market', value: '$25B+ globally' },
      { category: 'MASH/NAFLD Market', value: '$10B emerging, projected $30B by 2030' },
      { category: 'Functional GI Disorders', value: '$8B+, IBS underserved' },
      { category: 'Combined Addressable Market', value: '$70B+ by 2030' },
    ],
    keyTrends: [
      'MASH Gold Rush: Multiple mechanisms competing post-resmetirom approval',
      'TL1A Promise: Novel IBD target with potential anti-fibrotic effects',
      'IL-23 Dominance: Becoming IBD standard of care over anti-TNF',
      'Gut-Brain Axis: IBS-C and constipation innovations',
      'Liver-Directed GLP-1: Obesity drugs with MASH co-benefits',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'TL1A inhibitors', details: 'Novel target with efficacy + fibrosis potential in IBD' },
          { name: 'GLP-1s for MASH', details: 'Survodutide, semaglutide addressing obesity co-morbidity' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'FGF21 analogs', details: 'Efruxifermin showing strong fibrosis resolution' },
          { name: 'Skyrizi/Mirikizumab', details: 'IL-23 class establishing IBD leadership' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Resmetirom', details: 'First-mover but facing superior GLP-1 competition in MASH' },
        ],
      },
    ],
    bottomLine: 'GI/Hepatology is experiencing MASH explosion alongside IBD innovation. Key factors: (1) MASH treatment paradigm still forming, (2) TL1A as next IBD breakthrough, (3) GLP-1 repositioning for liver disease, (4) Fibrosis resolution as key endpoint, (5) Combination approaches likely needed in MASH.',
    investmentThesis: 'TL1A inhibitors (Merck, Roche) could capture IBD leadership from anti-TNF. MASH landscape favoring GLP-1 agonists with weight loss co-benefits over liver-only approaches. Watch Akero\'s efruxifermin for best FGF21 data. Madrigal\'s resmetirom faces steep competition despite first-mover status.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'TL1A Phase 3 IBD data and MASH combination trial designs (2026)',
  },
  'NEPHROLOGY/RENAL': {
    approvedDrugsTitle: 'Key Approved Nephrology Therapies:',
    approvedDrugs: [
      { name: 'Farxiga (dapagliflozin)', details: 'SGLT2 inhibitor, CKD and heart failure, renal protection proven' },
      { name: 'Kerendia (finerenone)', details: 'Non-steroidal MRA, CKD in T2D, CV and renal benefits' },
      { name: 'Jynarque (tolvaptan)', details: 'V2 receptor antagonist for ADPKD, slows cyst growth' },
    ],
    pipelineRace: [
      { name: 'Atrasentan (Chinook/Novartis)', details: 'Endothelin receptor antagonist for IgA nephropathy, Phase 3' },
      { name: 'Zigakibart (Vera)', details: 'APRIL inhibitor for IgA nephropathy, Phase 3' },
      { name: 'Sparsentan (Travere)', details: 'Dual endothelin/ARB for FSGS and IgA nephropathy' },
      { name: 'Roxadustat (FibroGen)', details: 'HIF-PHI for anemia of CKD, approved in some markets' },
      { name: 'GLP-1 agonists', details: 'Semaglutide showing kidney protection signals' },
    ],
    marketSize: [
      { category: 'Chronic Kidney Disease Market', value: '$15B+ globally' },
      { category: 'IgA Nephropathy/Glomerular', value: '$3B+ emerging, high unmet need' },
      { category: 'Dialysis/ESRD Care', value: '$80B+ total market' },
      { category: 'Anemia of CKD', value: '$8B+, ESA market evolving' },
    ],
    keyTrends: [
      'SGLT2 Foundation: Becoming cornerstone of CKD care across etiologies',
      'IgA Nephropathy Focus: Multiple targeted therapies advancing',
      'Cardiorenal Syndrome: Integrated CV-kidney treatment approaches',
      'Rare Glomerular Diseases: Orphan drug economics attracting investment',
      'Kidney Preservation: Shifting from dialysis delay to organ protection',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'SGLT2 inhibitors', details: 'Farxiga, Jardiance established as CKD foundation therapy' },
          { name: 'Atrasentan (Novartis)', details: 'Strong IgAN data, addressing high unmet need' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Kerendia', details: 'Additive benefit on top of SGLT2 in diabetic CKD' },
          { name: 'APRIL inhibitors', details: 'Novel mechanism for IgA nephropathy' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'HIF-PHI class', details: 'Roxadustat CV safety concerns limiting adoption' },
        ],
      },
    ],
    bottomLine: 'Nephrology innovation accelerating after years of limited options. Key factors: (1) SGLT2 as backbone therapy, (2) IgA nephropathy as major investment focus, (3) Cardiorenal integration, (4) Rare glomerular disease orphan economics, (5) CV safety differentiation.',
    investmentThesis: 'AstraZeneca/BMS SGLT2 franchise dominates CKD foundation. Novartis positioned for IgAN leadership with atrasentan acquisition. Bayer\'s Kerendia adding value in diabetic kidney disease. Watch Vera Therapeutics and Chinook for pure-play glomerular exposure.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Atrasentan Phase 3 IgAN results and APRIL inhibitor data (2026)',
  },
  'OPHTHALMOLOGY': {
    approvedDrugsTitle: 'Key Approved Ophthalmology Therapies:',
    approvedDrugs: [
      { name: 'Eylea (aflibercept)', details: 'Anti-VEGF for wet AMD/DME, $10B+ peak, 8-week dosing' },
      { name: 'Vabysmo (faricimab)', details: 'Bispecific anti-VEGF/Ang-2, up to 16-week dosing' },
      { name: 'Izervay (avacincaptad pegol)', details: 'Complement C5 inhibitor for geographic atrophy' },
    ],
    pipelineRace: [
      { name: 'Eylea HD (aflibercept 8mg)', details: 'Higher dose enabling extended 12-16 week intervals' },
      { name: 'OPT-302 (Opthea)', details: 'Anti-VEGF-C/D combination, additive efficacy' },
      { name: 'Gene therapies', details: 'Luxturna for LCA, pipeline for wet AMD and other conditions' },
      { name: 'Port Delivery System', details: 'Ranibizumab implant for 6-month refills' },
      { name: 'KSI-301 (Kodiak)', details: 'ABC platform anti-VEGF, 6-month durability goal' },
    ],
    marketSize: [
      { category: 'Wet AMD Market', value: '$12B+ globally, mature but stable' },
      { category: 'Geographic Atrophy Market', value: '$5B+ emerging opportunity' },
      { category: 'Diabetic Eye Disease', value: '$8B+, underdiagnosed population' },
      { category: 'Gene Therapy Ophthalmology', value: '$2B+ and growing rapidly' },
    ],
    keyTrends: [
      'Treatment Burden Reduction: Extended dosing intervals key differentiator',
      'Geographic Atrophy: First treatments approved, complement-targeting',
      'Port Delivery Innovation: Implantable devices reducing injection frequency',
      'Gene Therapy Expansion: Beyond rare diseases to common conditions',
      'Combination Approaches: Multi-target strategies improving outcomes',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Vabysmo (Roche)', details: 'Best-in-class durability with bispecific mechanism' },
          { name: 'Eylea HD', details: 'Extending franchise life with high-dose formulation' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'GA complement inhibitors', details: 'Izervay, Syfovre addressing large unmet need' },
          { name: 'Gene therapy platforms', details: 'AGTC, 4D Molecular for inherited retinal diseases' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Port Delivery System', details: 'Surgical complexity and refill logistics challenging' },
        ],
      },
    ],
    bottomLine: 'Ophthalmology focused on treatment burden reduction and new indications. Key factors: (1) Extended dosing intervals, (2) Geographic atrophy as growth driver, (3) Gene therapy for inherited conditions, (4) Device innovation for drug delivery, (5) Anti-VEGF biosimilar pressure in base business.',
    investmentThesis: 'Roche\'s Vabysmo capturing share with best durability. Regeneron defending with Eylea HD. Apellis and Iveric Bio (AbbVie) leading GA. Gene therapy represents long-term growth for inherited retinal diseases. Watch for next-gen delivery systems reducing treatment burden.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'OPT-302 combination Phase 3 and gene therapy AMD trials (2026)',
  },
  'RARE DISEASES/ORPHAN': {
    approvedDrugsTitle: 'Key Approved Rare Disease Therapies:',
    approvedDrugs: [
      { name: 'Spinraza (nusinersen)', details: 'ASO for SMA, first disease-modifying therapy' },
      { name: 'Zolgensma (onasemnogene)', details: 'Gene therapy for SMA, one-time treatment, $2M+' },
      { name: 'Trikafta (elexacaftor)', details: 'CFTR modulator for cystic fibrosis, transformative' },
    ],
    pipelineRace: [
      { name: 'Delandistrogene (Sarepta)', details: 'Gene therapy for DMD, accelerated approval path' },
      { name: 'Sebelipase alfa (Alexion)', details: 'Enzyme replacement for LAL deficiency' },
      { name: 'CRISPR therapies', details: 'Casgevy for sickle cell/beta-thal, editing platform expanding' },
      { name: 'Next-gen ASOs', details: 'Ionis pipeline across multiple rare diseases' },
      { name: 'AAV gene therapies', details: 'BioMarin, Ultragenyx for various genetic conditions' },
    ],
    marketSize: [
      { category: 'Total Rare Disease Market', value: '$200B+ globally across 7,000+ conditions' },
      { category: 'Gene Therapy Segment', value: '$10B+, growing 25%+ annually' },
      { category: 'Enzyme Replacement', value: '$15B+, mature segment' },
      { category: 'RNA Therapeutics', value: '$8B+, platform-driven growth' },
    ],
    keyTrends: [
      'Gene Therapy Maturation: Manufacturing improvements enabling broader access',
      'Platform Approaches: Single platform addressing multiple rare diseases',
      'Newborn Screening: Earlier diagnosis enabling pre-symptomatic treatment',
      'CRISPR Expansion: Gene editing moving into new indications',
      'Global Access Challenges: Pricing and reimbursement complexities',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'CRISPR gene editing', details: 'Casgevy proving transformative efficacy, functional cure' },
          { name: 'Platform RNA companies', details: 'Ionis, Alnylam addressing multiple diseases systematically' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'AAV gene therapy leaders', details: 'BioMarin, Sarepta with approved products and pipelines' },
          { name: 'Next-gen enzyme replacement', details: 'Improved formulations with better CNS penetration' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'High-priced one-time therapies', details: 'Reimbursement models still evolving for $1M+ treatments' },
        ],
      },
    ],
    bottomLine: 'Rare disease remains attractive due to orphan economics and high unmet need. Key factors: (1) Platform technologies scaling across diseases, (2) Gene therapy manufacturing improvements, (3) Newborn screening expansion, (4) Reimbursement innovation for high-cost therapies, (5) Patient advocacy driving development.',
    investmentThesis: 'CRISPR Therapeutics/Vertex leading gene editing commercialization. Ionis and Alnylam platforms addressing multiple diseases efficiently. BioMarin and Sarepta competing in muscular dystrophies. Watch for AAV manufacturing improvements and outcome-based pricing models enabling access.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'DMD gene therapy regulatory decisions and CRISPR indication expansion (2026)',
  },
  'VACCINES & VIROLOGY': {
    approvedDrugsTitle: 'Key Approved Vaccines:',
    approvedDrugs: [
      { name: 'Comirnaty (BNT162b2)', details: 'mRNA COVID-19 vaccine, first approved mRNA platform' },
      { name: 'Shingrix', details: 'Adjuvanted shingles vaccine, 90%+ efficacy, $4B+' },
      { name: 'Prevnar 20', details: 'Pneumococcal conjugate vaccine, expanded serotypes' },
    ],
    pipelineRace: [
      { name: 'mRNA-1345 (Moderna)', details: 'RSV vaccine, competing with protein-based approved vaccines' },
      { name: 'mRNA combination vaccines', details: 'Flu + COVID combinations, pipeline expanding' },
      { name: 'mRNA-4157 (Moderna/Merck)', details: 'Personalized cancer vaccine with Keytruda' },
      { name: 'Universal flu vaccines', details: 'Multiple approaches to broader, longer-lasting protection' },
      { name: 'HSV vaccines', details: 'BioNTech, Moderna pursuing genital herpes prevention' },
    ],
    marketSize: [
      { category: 'Global Vaccine Market', value: '$60B+ in 2025' },
      { category: 'mRNA Platform Opportunity', value: '$20B+ across infectious and oncology' },
      { category: 'RSV Vaccine Market', value: '$10B+ potential' },
      { category: 'Therapeutic Vaccines (Cancer)', value: '$5B+ emerging' },
    ],
    keyTrends: [
      'mRNA Platform Expansion: COVID success enabling new vaccine development',
      'Combination Vaccines: Reducing immunization burden with multi-valent products',
      'Older Adult Focus: RSV, shingles, pneumococcal targeting aging population',
      'Therapeutic Cancer Vaccines: Personalized neoantigen approaches advancing',
      'Self-Amplifying RNA: Next-gen mRNA with lower dose requirements',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'mRNA platforms', details: 'Moderna, BioNTech/Pfizer with proven technology and manufacturing' },
          { name: 'Shingrix (GSK)', details: 'Dominant shingles franchise with high efficacy' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'RSV vaccines', details: 'Arexvy, Abrysvo capturing new market' },
          { name: 'Cancer vaccine combinations', details: 'mRNA-4157 + Keytruda showing survival benefit' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'COVID-19 boosters', details: 'Market normalizing, annual demand unclear' },
        ],
      },
    ],
    bottomLine: 'Vaccines experiencing mRNA-driven renaissance with expansion beyond infectious disease. Key factors: (1) mRNA platform versatility, (2) Combination vaccine convenience, (3) Older adult market growth, (4) Therapeutic cancer vaccine emergence, (5) Pandemic preparedness investments.',
    investmentThesis: 'Moderna and BioNTech/Pfizer mRNA platforms positioned for multi-product franchises. GSK maintains vaccine leadership with Shingrix and RSV. Watch cancer vaccine combinations for potential oncology disruption. Universal flu vaccine remains high-risk/high-reward target.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'mRNA-4157 Phase 3 melanoma data and combination vaccine approvals (2026)',
  },
  'WOMEN\'S HEALTH': {
    approvedDrugsTitle: 'Key Approved Women\'s Health Therapies:',
    approvedDrugs: [
      { name: 'Veozah (fezolinetant)', details: 'NK3 receptor antagonist for vasomotor symptoms, non-hormonal' },
      { name: 'Myfembree (relugolix combo)', details: 'GnRH antagonist for uterine fibroids, oral' },
      { name: 'Oriahnn (elagolix combo)', details: 'GnRH antagonist for endometriosis-associated pain' },
    ],
    pipelineRace: [
      { name: 'Elinzanetant (Bayer)', details: 'Dual NK1/3 antagonist for menopause, Phase 3 positive' },
      { name: 'KP-879 (Kevelt)', details: 'TRPM3 antagonist for primary dysmenorrhea' },
      { name: 'Linzagolix (ObsEva)', details: 'GnRH antagonist for endometriosis and fibroids' },
      { name: 'Ovarian stimulation advances', details: 'Oral GnRH antagonists simplifying IVF protocols' },
      { name: 'Contraceptive innovations', details: 'Long-acting and on-demand options in development' },
    ],
    marketSize: [
      { category: 'Menopause Market', value: '$15B+ globally, highly underpenetrated' },
      { category: 'Uterine Fibroids Market', value: '$5B+' },
      { category: 'Endometriosis Market', value: '$4B+, high unmet need' },
      { category: 'Contraceptive Market', value: '$20B+ globally' },
    ],
    keyTrends: [
      'Non-Hormonal Options: Growing demand for menopause therapies without HRT risks',
      'GnRH Antagonist Expansion: Oral options replacing invasive treatments',
      'Menopause Awareness: Increased recognition driving market growth',
      'Fertility Technology: IVF protocol improvements and access expansion',
      'Contraceptive Innovation: Long-acting reversible contraceptives growing',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Veozah (Astellas)', details: 'First-in-class non-hormonal for hot flashes, addressing HRT concerns' },
          { name: 'Elinzanetant (Bayer)', details: 'Dual mechanism may offer broader symptom control' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'GnRH antagonists', details: 'Myfembree, Oriahnn reducing need for surgery in fibroids/endo' },
          { name: 'Fertility advances', details: 'Simplified protocols expanding IVF access' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'ObsEva programs', details: 'Company challenges despite promising pipeline' },
        ],
      },
    ],
    bottomLine: 'Women\'s health experiencing long-overdue innovation surge. Key factors: (1) Non-hormonal menopause therapies addressing large underserved market, (2) Medical management replacing surgery for fibroids/endo, (3) Increased investment and awareness, (4) Fertility technology advances, (5) Regulatory support for women\'s health development.',
    investmentThesis: 'Astellas leading menopause innovation with Veozah. Bayer\'s elinzanetant could capture significant share. Myovant/Pfizer established in uterine conditions. Large underserved menopause population represents significant commercial opportunity for effective non-hormonal options.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Elinzanetant regulatory decisions and menopause market expansion (2025-26)',
  },
  'UROLOGY': {
    approvedDrugsTitle: 'Key Approved Urology Therapies:',
    approvedDrugs: [
      { name: 'Xtandi (enzalutamide)', details: 'Androgen receptor inhibitor for prostate cancer, $5B+' },
      { name: 'Nubeqa (darolutamide)', details: 'AR inhibitor with CNS-sparing profile, nmCRPC' },
      { name: 'Padcev (enfortumab vedotin)', details: 'ADC for bladder cancer, becoming standard of care' },
    ],
    pipelineRace: [
      { name: 'PSMA-targeted therapies', details: 'Pluvicto, next-gen radioligands for prostate cancer' },
      { name: 'PARP inhibitors expansion', details: 'Olaparib combinations in earlier prostate cancer' },
      { name: 'Intravesical therapies', details: 'Novel BCG alternatives for non-muscle invasive bladder cancer' },
      { name: 'ADC combinations', details: 'Padcev + pembrolizumab as new 1L bladder standard' },
      { name: 'BPH innovations', details: 'Water vapor therapy, aquablation, novel pharmacology' },
    ],
    marketSize: [
      { category: 'Prostate Cancer Market', value: '$15B+ globally, growing with earlier treatment' },
      { category: 'Bladder Cancer Market', value: '$5B+, ADCs driving growth' },
      { category: 'BPH/Overactive Bladder', value: '$8B+ combined' },
      { category: 'Sexual Health', value: '$5B+, generics dominating' },
    ],
    keyTrends: [
      'Earlier Prostate Intervention: AR inhibitors moving to hormone-sensitive disease',
      'PSMA Theranostics: Imaging + therapy paradigm in prostate cancer',
      'Bladder Cancer Revolution: ADC + IO combinations transforming outcomes',
      'BCG Shortage Solutions: Novel intravesical therapies addressing unmet need',
      'BPH Minimally Invasive: Device-based treatments reducing medication burden',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Padcev + Keytruda', details: 'Becoming standard of care in bladder cancer' },
          { name: 'PSMA radioligands', details: 'Novartis Pluvicto leading with pipeline expansion' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'AR inhibitor combinations', details: 'Earlier prostate cancer treatment expanding market' },
          { name: 'ADC pipeline', details: 'Next-gen conjugates in development' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'BCG alternatives', details: 'Development challenges despite clear need' },
        ],
      },
    ],
    bottomLine: 'Urology innovation driven by prostate and bladder cancer advances. Key factors: (1) Earlier intervention paradigms, (2) PSMA theranostics platform, (3) ADC + IO combinations, (4) BCG alternative development, (5) Minimally invasive BPH procedures.',
    investmentThesis: 'Seagen/Pfizer Padcev dominates bladder. Novartis leads PSMA radioligands with Pluvicto. Pfizer/Astellas defending Xtandi in competitive prostate market. Watch for BCG shortage solutions and BPH device innovations.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Padcev earlier-line bladder data and next-gen PSMA radioligands (2026)',
  },
  'PAIN MANAGEMENT/ANESTHESIA': {
    approvedDrugsTitle: 'Key Approved Pain/Anesthesia Therapies:',
    approvedDrugs: [
      { name: 'Nucynta (tapentadol)', details: 'Dual MOR/NRI mechanism, moderate abuse deterrent' },
      { name: 'Exparel (bupivacaine liposome)', details: 'Long-acting local anesthetic, post-surgical' },
      { name: 'Zilretta (triamcinolone ER)', details: 'Extended-release steroid for knee OA' },
    ],
    pipelineRace: [
      { name: 'VX-548 (Vertex)', details: 'Nav1.8 inhibitor, non-opioid for acute pain, Phase 3' },
      { name: 'Suzetrigine (Vertex)', details: 'Approved 2024 for acute pain, first selective Nav1.8' },
      { name: 'CGRP antagonists', details: 'Migraine prevention extending to chronic pain' },
      { name: 'Neffy (Amphastar)', details: 'Intranasal naloxone for opioid reversal' },
      { name: 'Novel local anesthetics', details: 'Extended-duration formulations reducing opioid need' },
    ],
    marketSize: [
      { category: 'Chronic Pain Market', value: '$80B+ globally including OTC' },
      { category: 'Acute/Post-Surgical Pain', value: '$15B+ prescription market' },
      { category: 'Migraine Market', value: '$10B+, CGRP-driven growth' },
      { category: 'Opioid Alternatives', value: '$5B+ emerging non-opioid segment' },
    ],
    keyTrends: [
      'Non-Opioid Push: Regulatory and societal pressure driving innovation',
      'Nav1.8 Breakthrough: Selective sodium channel blockers enabling opioid-free pain control',
      'Local Anesthetic Duration: Extended formulations reducing systemic opioid use',
      'Multimodal Analgesia: Combination approaches becoming standard',
      'Abuse-Deterrent Focus: Technologies preventing opioid misuse',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'VX-548/Suzetrigine (Vertex)', details: 'First selective Nav1.8, potential to replace opioids in acute pain' },
          { name: 'CGRP class', details: 'Established migraine efficacy, expanding indications' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Extended local anesthetics', details: 'Exparel and next-gen reducing post-op opioids' },
          { name: 'Multimodal protocols', details: 'ERAS programs reducing opioid requirements' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Abuse-deterrent opioids', details: 'Regulatory complexity and limited efficacy of deterrent tech' },
        ],
      },
    ],
    bottomLine: 'Pain management transformation around non-opioid alternatives. Key factors: (1) Nav1.8 as first truly novel mechanism in decades, (2) Local anesthetic innovation, (3) Regulatory support for opioid-sparing approaches, (4) Multimodal analgesia adoption, (5) Migraine as innovation model for other pain types.',
    investmentThesis: 'Vertex leading non-opioid revolution with Nav1.8 inhibitors. CGRP companies (Pfizer, AbbVie, Lilly) dominating migraine. Extended local anesthetics reducing perioperative opioids. Watch for Nav1.8 chronic pain expansion and novel targets emerging from neuroscience.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'VX-548 chronic pain Phase 3 data and suzetrigine label expansion (2026)',
  },
  'TRANSPLANT/CELL-GENE': {
    approvedDrugsTitle: 'Key Approved Transplant/CGT Therapies:',
    approvedDrugs: [
      { name: 'Yescarta (axicabtagene ciloleucel)', details: 'CAR-T for large B-cell lymphoma, $1B+' },
      { name: 'Breyanzi (lisocabtagene)', details: 'CAR-T for LBCL with differentiated safety profile' },
      { name: 'Zolgensma (onasemnogene)', details: 'AAV gene therapy for SMA, one-time treatment' },
    ],
    pipelineRace: [
      { name: 'Allogeneic CAR-T', details: 'Off-the-shelf CAR-T from healthy donors, Phase 1/2' },
      { name: 'In vivo CAR-T', details: 'Direct engineering without leukapheresis, early clinical' },
      { name: 'CRISPR gene editing', details: 'Casgevy for sickle cell, pipeline for other genetic diseases' },
      { name: 'Base editing therapies', details: 'Verve, Beam with more precise editing approaches' },
      { name: 'Xenotransplantation', details: 'Pig organ transplants advancing in clinical studies' },
    ],
    marketSize: [
      { category: 'CAR-T Therapy Market', value: '$8B+, growing 20%+ annually' },
      { category: 'Gene Therapy Market', value: '$10B+, expanding indications' },
      { category: 'Solid Organ Transplant', value: '$15B+ including immunosuppression' },
      { category: 'Gene Editing Therapies', value: '$2B+ emerging, high growth potential' },
    ],
    keyTrends: [
      'Manufacturing Innovation: Reducing CAR-T vein-to-vein time and cost',
      'Allogeneic Approaches: Off-the-shelf products addressing autologous limitations',
      'In Vivo Delivery: Eliminating ex vivo cell manipulation',
      'Gene Editing Precision: Base editing and prime editing improving safety',
      'Xenotransplantation Revival: Gene-edited pig organs addressing organ shortage',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'CRISPR gene editing', details: 'Casgevy approval validates platform for expansion' },
          { name: 'Established CAR-T', details: 'Kite/Gilead, BMS with approved products and manufacturing scale' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Base editing platforms', details: 'Verve, Beam offering potentially safer editing' },
          { name: 'Next-gen AAV', details: 'Improved vectors for broader tissue targeting' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Allogeneic CAR-T', details: 'Persistence and efficacy challenges vs. autologous' },
        ],
      },
    ],
    bottomLine: 'Cell and gene therapy maturing with manufacturing and delivery innovations. Key factors: (1) Cost reduction through manufacturing efficiency, (2) Off-the-shelf product development, (3) In vivo approaches simplifying delivery, (4) Gene editing precision improvements, (5) Reimbursement models for curative therapies.',
    investmentThesis: 'CRISPR Therapeutics/Vertex leading gene editing commercialization. Established CAR-T players (Gilead, BMS) scaling manufacturing. Watch base editing companies for next-gen precision. Xenotransplantation represents long-term solution to organ shortage.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Allogeneic CAR-T durability data and in vivo CAR-T early results (2026)',
  },
  'PEDIATRICS': {
    approvedDrugsTitle: 'Key Approved Pediatric Therapies:',
    approvedDrugs: [
      { name: 'Epidiolex (cannabidiol)', details: 'First FDA-approved cannabis-derived drug for seizures' },
      { name: 'Zolgensma (onasemnogene)', details: 'Gene therapy for pediatric SMA, one-time treatment' },
      { name: 'Dupixent (dupilumab)', details: 'Expanded to children 6mo+ for atopic dermatitis' },
    ],
    pipelineRace: [
      { name: 'Pediatric formulations', details: 'Age-appropriate dosing forms of adult medications' },
      { name: 'Gene therapies for rare diseases', details: 'Multiple programs for pediatric genetic conditions' },
      { name: 'Fenfluramine (Fintepla)', details: 'Approved for Dravet/LGS seizures, expanding use' },
      { name: 'RSV prevention', details: 'Beyfortus (nirsevimab) for infant RSV prophylaxis' },
      { name: 'ADHD innovations', details: 'Non-stimulant options and digital therapeutics' },
    ],
    marketSize: [
      { category: 'Pediatric Rare Diseases', value: '$15B+ globally' },
      { category: 'Pediatric Vaccines', value: '$20B+ including routine immunization' },
      { category: 'Pediatric CNS/Epilepsy', value: '$5B+' },
      { category: 'Pediatric Asthma/Allergy', value: '$8B+' },
    ],
    keyTrends: [
      'Rare Disease Focus: Orphan incentives driving pediatric genetic disease development',
      'Age-Appropriate Formulations: Regulatory push for child-friendly dosing forms',
      'Label Expansion: Adult biologics expanding down to younger age groups',
      'Digital Therapeutics: ADHD and behavioral conditions using app-based interventions',
      'Vaccine Innovation: RSV protection and combination vaccines simplifying schedules',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Gene therapy platforms', details: 'Addressing pediatric genetic diseases with curative intent' },
          { name: 'Beyfortus (Sanofi/AZ)', details: 'First long-acting RSV protection for all infants' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Biologic expansions', details: 'Dupixent, Skyrizi reaching younger populations' },
          { name: 'Rare pediatric seizure drugs', details: 'Epidiolex, Fintepla addressing severe epilepsies' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Digital therapeutics', details: 'Reimbursement and adoption challenges despite clinical evidence' },
        ],
      },
    ],
    bottomLine: 'Pediatrics advancing through rare disease genetics and biologic label expansion. Key factors: (1) Orphan drug economics for rare genetic diseases, (2) Age-appropriate formulation development, (3) Earlier intervention with proven adult therapies, (4) RSV and respiratory protection, (5) Digital therapeutic emergence.',
    investmentThesis: 'Gene therapy companies with pediatric focus well-positioned (Novartis, Sarepta). Sanofi/AZ Beyfortus could transform infant RSV prevention. Watch biologic label expansions to younger ages as growth driver. Rare pediatric diseases remain attractive due to orphan incentives and high unmet need.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Pediatric gene therapy approvals and biologic age-expansion trials (2026)',
  },
};

const getScoreColor = (score: number) => {
  if (score >= 67) return 'text-[hsl(142,76%,36%)]';
  if (score >= 34) return 'text-[hsl(45,93%,47%)]';
  return 'text-[hsl(0,72%,51%)]';
};

const getScoreBgColor = (score: number) => {
  if (score >= 67) return 'bg-[hsl(142,76%,36%)]';
  if (score >= 34) return 'bg-[hsl(45,93%,47%)]';
  return 'bg-[hsl(0,72%,51%)]';
};

function MarketDynamicsSection({ taKey }: { taKey: string }) {
  const dynamics = MARKET_DYNAMICS[taKey];
  
  if (!dynamics) {
    return (
      <Card className="border-l-4 border-l-muted col-span-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Current Market Dynamics
            <Badge variant="outline" className="text-xs ml-2">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Market dynamics analysis will be available soon for this therapeutic area.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-[hsl(45,93%,47%)] col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Current Market Dynamics
          <Badge variant="outline" className="text-xs ml-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated Dec, 2025
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approved Drugs */}
        {dynamics.approvedDrugs && (
          <div>
            <h4 className="font-semibold text-sm mb-2">{dynamics.approvedDrugsTitle || 'Approved Drugs:'}</h4>
            <div className="space-y-1">
              {dynamics.approvedDrugs.map((drug, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span><strong>{drug.name}:</strong> {drug.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Race */}
        {dynamics.pipelineRace && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Phase 3 Pipeline Race:</h4>
            <div className="space-y-1">
              {dynamics.pipelineRace.map((drug, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span><strong>{drug.name}:</strong> {drug.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Size */}
        {dynamics.marketSize && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Market Size & Growth:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dynamics.marketSize.map((item, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-muted-foreground">• {item.category}:</span>{' '}
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Trends */}
        {dynamics.keyTrends && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Key Trends:</h4>
            <div className="space-y-1">
              {dynamics.keyTrends.map((trend, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span>{trend}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winners & Losers */}
        {dynamics.winnersLosers && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Winners & Losers (Projected):</h4>
            <div className="space-y-2">
              {dynamics.winnersLosers.map((group, idx) => (
                <div key={idx}>
                  <span className="text-sm font-medium text-primary">{group.category}:</span>
                  <div className="ml-4 space-y-1">
                    {group.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <strong>{item.name}:</strong> {item.details}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Line */}
        {dynamics.bottomLine && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-1">Bottom Line:</h4>
            <p className="text-sm">{dynamics.bottomLine}</p>
          </div>
        )}

        {/* Investment Thesis */}
        {dynamics.investmentThesis && (
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-sm mb-1 text-primary">Investment Thesis:</h4>
            <p className="text-sm">{dynamics.investmentThesis}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
          <span>Last Updated: {dynamics.lastUpdated}</span>
          {dynamics.nextCatalyst && (
            <span>Next Major Catalyst: {dynamics.nextCatalyst}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TAMarketOverview({ molecules }: TAMarketOverviewProps) {
  const taIndexes = getAllTACompositeIndexes();
  
  // Group molecules by TA and calculate aggregated data
  const taGroups = taIndexes.map((taIndex) => {
    const normalizedTA = taIndex.ta.toUpperCase();
    
    // Find molecules that belong to this TA
    const taMolecules = molecules.filter((mol) => {
      const mappedTA = TA_NAME_MAP[mol.therapeuticArea]?.toUpperCase();
      return mappedTA === normalizedTA;
    });

    // Get top 5 molecules by LPI-3 score
    const moleculesWithScores = taMolecules.map((mol) => {
      const lpi3 = calculateLPI3ForMolecule(mol);
      const ttm = calculateTTMMonths(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.marketData);
      return {
        ...mol,
        lpi3Score: Math.round(lpi3.calibratedProbability * 100),
        ttm: ttm ?? 0,
      };
    });

    const top5Molecules = moleculesWithScores
      .sort((a, b) => b.lpi3Score - a.lpi3Score)
      .slice(0, 5);

    // Calculate market summary
    const totalRevenue = taMolecules.reduce((sum, mol) => {
      return sum + mol.marketData.reduce((mSum, m) => mSum + m.revenueProjection.year1 + m.revenueProjection.year2, 0);
    }, 0);

    const avgLPI = moleculesWithScores.length > 0
      ? Math.round(moleculesWithScores.reduce((sum, mol) => sum + mol.lpi3Score, 0) / moleculesWithScores.length)
      : 0;

    return {
      taIndex,
      moleculeCount: taMolecules.length,
      top5Molecules,
      totalRevenue,
      avgLPI,
    };
  });

  // Sort by composite score descending
  const sortedTAGroups = taGroups.sort((a, b) => b.taIndex.compositeScore - a.taIndex.compositeScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Therapeutic Area Market Overview</h2>
          <p className="text-sm text-muted-foreground">20 therapeutic areas with market summaries and top molecules</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          {taIndexes.length} Therapeutic Areas
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedTAGroups.map((group) => (
          <Card key={group.taIndex.ta} className="hover:shadow-lg transition-shadow">
            <Accordion type="single" collapsible>
              <AccordionItem value={group.taIndex.ta} className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-start justify-between w-full pr-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{group.taIndex.ta}</h3>
                        <Badge variant="secondary">{group.moleculeCount} molecules</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>FDA: {group.taIndex.avgApprovalTimeFDA}mo</span>
                        <span>•</span>
                        <span>EMA: {group.taIndex.avgApprovalTimeEMA}mo</span>
                        <span>•</span>
                        <span>Avg LPI-3: {group.avgLPI}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* TA Composite Score */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Composite</div>
                        <div className={`text-2xl font-bold ${getScoreColor(group.taIndex.compositeScore)}`}>
                          {Math.round(group.taIndex.compositeScore)}%
                        </div>
                      </div>
                      {/* Total Revenue */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">2Y Revenue</div>
                        <div className="text-xl font-semibold text-primary">
                          ${(group.totalRevenue / 1000).toFixed(1)}B
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Markets Summary */}
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Markets Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Molecules:</span>
                            <span className="font-semibold">{group.moleculeCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Projected 2Y Revenue:</span>
                            <span className="font-semibold text-primary">${(group.totalRevenue / 1000).toFixed(2)}B</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Average LPI-3:</span>
                            <span className={`font-semibold ${getScoreColor(group.avgLPI)}`}>{group.avgLPI}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">TA Composite Score:</span>
                            <span className={`font-semibold ${getScoreColor(group.taIndex.compositeScore)}`}>
                              {Math.round(group.taIndex.compositeScore)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg FDA Approval:</span>
                            <span className="font-semibold">{group.taIndex.avgApprovalTimeFDA} months</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg EMA Approval:</span>
                            <span className="font-semibold">{group.taIndex.avgApprovalTimeEMA} months</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top 5 Molecules */}
                    <Card className="border-l-4 border-l-accent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Top 5 Molecules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {group.top5Molecules.length > 0 ? (
                          <div className="space-y-2">
                            {group.top5Molecules.map((mol, idx) => (
                              <div key={mol.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreBgColor(mol.lpi3Score)}`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{mol.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      {mol.company}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">LPI-3</div>
                                    <div className={`font-bold ${getScoreColor(mol.lpi3Score)}`}>{mol.lpi3Score}%</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">TTM</div>
                                    <div className="font-semibold">{mol.ttm}m</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No molecules in database for this TA
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Market Dynamics Section */}
                  <div className="mt-6">
                    <MarketDynamicsSection taKey={group.taIndex.ta} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
}