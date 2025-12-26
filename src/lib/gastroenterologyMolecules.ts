// 60 Gastroenterology/GI Molecules
import { calculateProbabilityScores, generateMarketProjections } from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const gastroenterologyMolecules: MoleculeProfile[] = [
  {
    id: "gi-1", name: "Resmetirom", phase: "Approved", indication: "MASH/NASH with Fibrosis", therapeuticArea: "Gastroenterology/GI",
    company: "Madrigal Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT03900429",
    scores: calculateProbabilityScores("Approved", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Resmetirom", "Approved", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "THR-β agonist", administration: "Oral once daily", keyAdvantage: "First approved MASH therapy" }
  },
  {
    id: "gi-2", name: "Semaglutide", phase: "Phase III", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "Novo Nordisk", companyTrackRecord: 'fast', nctId: "NCT04822181",
    scores: calculateProbabilityScores("Phase III", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Semaglutide-NASH", "Phase III", "NASH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GLP-1 agonist", administration: "SC injection weekly", keyAdvantage: "Strong weight loss + liver benefit" }
  },
  {
    id: "gi-3", name: "Tirzepatide", phase: "Phase III", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT04166773",
    scores: calculateProbabilityScores("Phase III", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Tirzepatide-NASH", "Phase III", "NASH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GIP/GLP-1 dual agonist", administration: "SC injection weekly", keyAdvantage: "Best-in-class metabolic effects" }
  },
  {
    id: "gi-4", name: "Survodutide", phase: "Phase III", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "Boehringer Ingelheim/Zealand", companyTrackRecord: 'fast', nctId: "NCT04771273",
    scores: calculateProbabilityScores("Phase III", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Survodutide", "Phase III", "NASH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GLP-1/Glucagon dual agonist", administration: "SC injection weekly", keyAdvantage: "Direct liver effects via glucagon" }
  },
  {
    id: "gi-5", name: "Pegozafermin", phase: "Phase III", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "89bio", companyTrackRecord: 'average', nctId: "NCT04929483",
    scores: calculateProbabilityScores("Phase III", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Pegozafermin", "Phase III", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FGF21 analog", administration: "SC injection weekly", keyAdvantage: "Novel FGF21 mechanism" }
  },
  {
    id: "gi-6", name: "Efruxifermin", phase: "Phase III", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "Akero Therapeutics", companyTrackRecord: 'average', nctId: "NCT04767529",
    scores: calculateProbabilityScores("Phase III", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Efruxifermin", "Phase III", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FGF21 Fc fusion", administration: "SC injection weekly", keyAdvantage: "High response rates in Phase 2" }
  },
  {
    id: "gi-7", name: "Icosabutate", phase: "Phase II", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "NorthSea Therapeutics", companyTrackRecord: 'average', nctId: "NCT04052516",
    scores: calculateProbabilityScores("Phase II", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Icosabutate", "Phase II", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Structured lipid", administration: "Oral once daily", keyAdvantage: "Oral, well-tolerated" }
  },
  {
    id: "gi-8", name: "Denifanstat", phase: "Phase II", indication: "MASH/NASH", therapeuticArea: "Gastroenterology/GI",
    company: "Sagimet Biosciences", companyTrackRecord: 'average', nctId: "NCT04906421",
    scores: calculateProbabilityScores("Phase II", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Denifanstat", "Phase II", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FASN inhibitor", administration: "Oral once daily", keyAdvantage: "Novel de novo lipogenesis target" }
  },
  {
    id: "gi-9", name: "Vedolizumab", phase: "Approved", indication: "Ulcerative Colitis/Crohn's", therapeuticArea: "Gastroenterology/GI",
    company: "Takeda", companyTrackRecord: 'fast', nctId: "NCT00783718",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Vedolizumab", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-α4β7 integrin antibody", administration: "IV infusion or SC", keyAdvantage: "Gut-selective, favorable safety" }
  },
  {
    id: "gi-10", name: "Ustekinumab", phase: "Approved", indication: "Crohn's Disease/UC", therapeuticArea: "Gastroenterology/GI",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT01369329",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Ustekinumab", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-12/23 antibody", administration: "IV then SC", keyAdvantage: "Dual cytokine targeting" }
  },
  {
    id: "gi-11", name: "Risankizumab", phase: "Approved", indication: "Crohn's Disease/UC", therapeuticArea: "Gastroenterology/GI",
    company: "AbbVie", companyTrackRecord: 'fast', nctId: "NCT03105128",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Risankizumab", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-23 p19 antibody", administration: "IV then SC", keyAdvantage: "Selective IL-23 blockade" }
  },
  {
    id: "gi-12", name: "Mirikizumab", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT03518086",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Mirikizumab", "Approved", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-23 p19 antibody", administration: "IV then SC", keyAdvantage: "High clinical remission rates" }
  },
  {
    id: "gi-13", name: "Guselkumab", phase: "Phase III", indication: "Crohn's Disease/UC", therapeuticArea: "Gastroenterology/GI",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT03466411",
    scores: calculateProbabilityScores("Phase III", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Guselkumab-IBD", "Phase III", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-23 p19 antibody", administration: "SC injection", keyAdvantage: "Strong psoriasis efficacy transferable" }
  },
  {
    id: "gi-14", name: "Brazikumab", phase: "Phase II/III", indication: "Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT03759288",
    scores: calculateProbabilityScores("Phase II", "CD", "Gastroenterology"), marketData: generateMarketProjections("Brazikumab", "Phase II", "CD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-23 p19 antibody", administration: "SC injection", keyAdvantage: "Novel IL-23 blocker" }
  },
  {
    id: "gi-15", name: "Ozanimod", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT02435992",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Ozanimod", "Approved", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "S1P receptor modulator", administration: "Oral once daily", keyAdvantage: "Oral option for UC" }
  },
  {
    id: "gi-16", name: "Etrasimod", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT03945188",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Etrasimod", "Approved", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "S1P receptor modulator", administration: "Oral once daily", keyAdvantage: "Selective S1P1,4,5" }
  },
  {
    id: "gi-17", name: "Upadacitinib", phase: "Approved", indication: "UC/Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "AbbVie", companyTrackRecord: 'fast', nctId: "NCT02819635",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Upadacitinib-IBD", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "JAK1 selective inhibitor", administration: "Oral once daily", keyAdvantage: "Rapid onset, high efficacy" }
  },
  {
    id: "gi-18", name: "Filgotinib", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Galapagos/Gilead", companyTrackRecord: 'average', nctId: "NCT02914522",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Filgotinib-UC", "Approved", "UC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "JAK1 selective inhibitor", administration: "Oral once daily", keyAdvantage: "JAK selectivity" }
  },
  {
    id: "gi-19", name: "Obefazimod", phase: "Phase III", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Abivax", companyTrackRecord: 'average', nctId: "NCT04023396",
    scores: calculateProbabilityScores("Phase III", "UC", "Gastroenterology"), marketData: generateMarketProjections("Obefazimod", "Phase III", "UC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "miR-124 modulator", administration: "Oral once daily", keyAdvantage: "Novel MOA, steroid-free remission" }
  },
  {
    id: "gi-20", name: "Tulisokibart", phase: "Phase III", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Prometheus Biosciences/Merck", companyTrackRecord: 'fast', nctId: "NCT05013918",
    scores: calculateProbabilityScores("Phase III", "UC", "Gastroenterology"), marketData: generateMarketProjections("Tulisokibart", "Phase III", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TL1A antibody", administration: "SC injection", keyAdvantage: "Novel TL1A target" }
  },
  {
    id: "gi-21", name: "RVT-3101", phase: "Phase III", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Roivant/Pfizer", companyTrackRecord: 'fast', nctId: "NCT04771117",
    scores: calculateProbabilityScores("Phase III", "UC", "Gastroenterology"), marketData: generateMarketProjections("RVT-3101", "Phase III", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TL1A antibody", administration: "SC injection", keyAdvantage: "TL1A targeting in IBD" }
  },
  {
    id: "gi-22", name: "TEV-48574", phase: "Phase II", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Teva/Sanofi", companyTrackRecord: 'fast', nctId: "NCT04090411",
    scores: calculateProbabilityScores("Phase II", "UC", "Gastroenterology"), marketData: generateMarketProjections("TEV-48574", "Phase II", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TL1A antibody", administration: "SC injection", keyAdvantage: "TL1A blocker" }
  },
  {
    id: "gi-23", name: "Ontamalimab", phase: "Phase III", indication: "UC/Crohn's", therapeuticArea: "Gastroenterology/GI",
    company: "Takeda", companyTrackRecord: 'fast', nctId: "NCT03290781",
    scores: calculateProbabilityScores("Phase III", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Ontamalimab", "Phase III", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-MAdCAM-1 antibody", administration: "SC injection", keyAdvantage: "Gut-selective trafficking block" }
  },
  {
    id: "gi-24", name: "Etrolizumab", phase: "Phase III", indication: "UC/Crohn's", therapeuticArea: "Gastroenterology/GI",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT02118584",
    scores: calculateProbabilityScores("Phase III", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Etrolizumab", "Phase III", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-β7 integrin antibody", administration: "SC injection", keyAdvantage: "Dual integrin targeting" }
  },
  {
    id: "gi-25", name: "Vonoprazan", phase: "Approved", indication: "GERD/Erosive Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "Takeda/Phathom", companyTrackRecord: 'fast', nctId: "NCT03712956",
    scores: calculateProbabilityScores("Approved", "GERD", "Gastroenterology"), marketData: generateMarketProjections("Vonoprazan", "Approved", "GERD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Potassium-competitive acid blocker", administration: "Oral once daily", keyAdvantage: "Faster, stronger acid suppression than PPIs" }
  },
  {
    id: "gi-26", name: "Tegoprazan", phase: "Approved", indication: "GERD/Peptic Ulcer", therapeuticArea: "Gastroenterology/GI",
    company: "HK inno.N", companyTrackRecord: 'average', nctId: "NCT03012022",
    scores: calculateProbabilityScores("Approved", "GERD", "Gastroenterology"), marketData: generateMarketProjections("Tegoprazan", "Approved", "GERD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "P-CAB", administration: "Oral once daily", keyAdvantage: "Novel P-CAB in Asia" }
  },
  {
    id: "gi-27", name: "Linaclotide", phase: "Approved", indication: "IBS-C/Chronic Constipation", therapeuticArea: "Gastroenterology/GI",
    company: "AbbVie/Ironwood", companyTrackRecord: 'fast', nctId: "NCT00948818",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Linaclotide", "Approved", "IBS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Guanylate cyclase-C agonist", administration: "Oral once daily", keyAdvantage: "Addresses constipation and pain" }
  },
  {
    id: "gi-28", name: "Plecanatide", phase: "Approved", indication: "IBS-C/Chronic Constipation", therapeuticArea: "Gastroenterology/GI",
    company: "Salix/Bausch", companyTrackRecord: 'average', nctId: "NCT02122471",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Plecanatide", "Approved", "IBS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GC-C agonist", administration: "Oral once daily", keyAdvantage: "pH-activated mechanism" }
  },
  {
    id: "gi-29", name: "Tenapanor", phase: "Approved", indication: "IBS-C", therapeuticArea: "Gastroenterology/GI",
    company: "Ardelyx", companyTrackRecord: 'average', nctId: "NCT02686138",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Tenapanor", "Approved", "IBS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NHE3 inhibitor", administration: "Oral twice daily", keyAdvantage: "Novel sodium absorption block" }
  },
  {
    id: "gi-30", name: "Eluxadoline", phase: "Approved", indication: "IBS-D", therapeuticArea: "Gastroenterology/GI",
    company: "Allergan/AbbVie", companyTrackRecord: 'fast', nctId: "NCT01553591",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Eluxadoline", "Approved", "IBS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Mixed opioid receptor modulator", administration: "Oral twice daily", keyAdvantage: "Addresses diarrhea and pain" }
  },
  {
    id: "gi-31", name: "Rifaximin", phase: "Approved", indication: "IBS-D/Hepatic Encephalopathy", therapeuticArea: "Gastroenterology/GI",
    company: "Salix/Bausch", companyTrackRecord: 'average', nctId: "NCT00731679",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Rifaximin", "Approved", "IBS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Non-absorbed antibiotic", administration: "Oral three times daily", keyAdvantage: "Gut-selective action" }
  },
  {
    id: "gi-32", name: "Alosetron", phase: "Approved", indication: "Severe IBS-D (Women)", therapeuticArea: "Gastroenterology/GI",
    company: "Prometheus", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Alosetron", "Approved", "IBS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "5-HT3 antagonist", administration: "Oral twice daily", keyAdvantage: "Severe IBS-D option" }
  },
  {
    id: "gi-33", name: "Prucalopride", phase: "Approved", indication: "Chronic Constipation", therapeuticArea: "Gastroenterology/GI",
    company: "Takeda", companyTrackRecord: 'fast', nctId: "NCT01116206",
    scores: calculateProbabilityScores("Approved", "Constipation", "Gastroenterology"), marketData: generateMarketProjections("Prucalopride", "Approved", "Constipation", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "5-HT4 agonist", administration: "Oral once daily", keyAdvantage: "Prokinetic effect" }
  },
  {
    id: "gi-34", name: "Tegaserod", phase: "Approved", indication: "IBS-C (Women <65)", therapeuticArea: "Gastroenterology/GI",
    company: "Sloan Pharma", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "IBS", "Gastroenterology"), marketData: generateMarketProjections("Tegaserod", "Approved", "IBS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "5-HT4 partial agonist", administration: "Oral twice daily", keyAdvantage: "Reintroduced for select patients" }
  },
  {
    id: "gi-35", name: "Budesonide MMX", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Ferring/Bausch", companyTrackRecord: 'average', nctId: "NCT00268372",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Budesonide MMX", "Approved", "UC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Locally-acting corticosteroid", administration: "Oral once daily", keyAdvantage: "Colonic-targeted release" }
  },
  {
    id: "gi-36", name: "Tofacitinib", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT01465763",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Tofacitinib-UC", "Approved", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Pan-JAK inhibitor", administration: "Oral twice daily", keyAdvantage: "First JAKi for UC" }
  },
  {
    id: "gi-37", name: "Golimumab", phase: "Approved", indication: "Ulcerative Colitis", therapeuticArea: "Gastroenterology/GI",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT00487539",
    scores: calculateProbabilityScores("Approved", "UC", "Gastroenterology"), marketData: generateMarketProjections("Golimumab-UC", "Approved", "UC", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TNF antibody", administration: "SC injection monthly", keyAdvantage: "Monthly dosing" }
  },
  {
    id: "gi-38", name: "Adalimumab", phase: "Approved", indication: "UC/Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "AbbVie", companyTrackRecord: 'fast', nctId: "NCT00385736",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Adalimumab-IBD", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TNF antibody", administration: "SC injection biweekly", keyAdvantage: "Self-administration" }
  },
  {
    id: "gi-39", name: "Infliximab", phase: "Approved", indication: "UC/Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "Johnson & Johnson/Merck", companyTrackRecord: 'fast', nctId: "NCT00036439",
    scores: calculateProbabilityScores("Approved", "IBD", "Gastroenterology"), marketData: generateMarketProjections("Infliximab-IBD", "Approved", "IBD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TNF antibody", administration: "IV infusion", keyAdvantage: "Long track record" }
  },
  {
    id: "gi-40", name: "Certolizumab Pegol", phase: "Approved", indication: "Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "UCB", companyTrackRecord: 'average', nctId: "NCT00152425",
    scores: calculateProbabilityScores("Approved", "CD", "Gastroenterology"), marketData: generateMarketProjections("Certolizumab", "Approved", "CD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PEGylated anti-TNF Fab", administration: "SC injection monthly", keyAdvantage: "No Fc-mediated effects" }
  },
  {
    id: "gi-41", name: "Natalizumab", phase: "Approved", indication: "Crohn's Disease", therapeuticArea: "Gastroenterology/GI",
    company: "Biogen", companyTrackRecord: 'fast', nctId: "NCT00032786",
    scores: calculateProbabilityScores("Approved", "CD", "Gastroenterology"), marketData: generateMarketProjections("Natalizumab-CD", "Approved", "CD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-α4 integrin antibody", administration: "IV infusion monthly", keyAdvantage: "High efficacy in refractory CD" }
  },
  {
    id: "gi-42", name: "Elafibranor", phase: "Phase III", indication: "Primary Biliary Cholangitis", therapeuticArea: "Gastroenterology/GI",
    company: "Genfit/Ipsen", companyTrackRecord: 'average', nctId: "NCT04526665",
    scores: calculateProbabilityScores("Phase III", "PBC", "Gastroenterology"), marketData: generateMarketProjections("Elafibranor", "Phase III", "PBC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PPAR α/δ agonist", administration: "Oral once daily", keyAdvantage: "Novel dual PPAR mechanism" }
  },
  {
    id: "gi-43", name: "Seladelpar", phase: "Approved", indication: "Primary Biliary Cholangitis", therapeuticArea: "Gastroenterology/GI",
    company: "CymaBay/Gilead", companyTrackRecord: 'average', nctId: "NCT03602560",
    scores: calculateProbabilityScores("Approved", "PBC", "Gastroenterology"), marketData: generateMarketProjections("Seladelpar", "Approved", "PBC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PPARδ agonist", administration: "Oral once daily", keyAdvantage: "Selective PPARδ" }
  },
  {
    id: "gi-44", name: "Obeticholic Acid", phase: "Approved", indication: "Primary Biliary Cholangitis", therapeuticArea: "Gastroenterology/GI",
    company: "Intercept", companyTrackRecord: 'slow', nctId: "NCT01473524",
    scores: calculateProbabilityScores("Approved", "PBC", "Gastroenterology"), marketData: generateMarketProjections("OCA", "Approved", "PBC", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FXR agonist", administration: "Oral once daily", keyAdvantage: "First FXR agonist approved" }
  },
  {
    id: "gi-45", name: "Bezafibrate", phase: "Phase III", indication: "Primary Biliary Cholangitis", therapeuticArea: "Gastroenterology/GI",
    company: "Actavis", companyTrackRecord: 'average', nctId: "NCT01654731",
    scores: calculateProbabilityScores("Phase III", "PBC", "Gastroenterology"), marketData: generateMarketProjections("Bezafibrate-PBC", "Phase III", "PBC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Pan-PPAR agonist", administration: "Oral once daily", keyAdvantage: "Repurposed fibrate" }
  },
  {
    id: "gi-46", name: "Maralixibat", phase: "Approved", indication: "Alagille Syndrome Cholestasis", therapeuticArea: "Gastroenterology/GI",
    company: "Mirum Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT02057692",
    scores: calculateProbabilityScores("Approved", "ALGS", "Gastroenterology"), marketData: generateMarketProjections("Maralixibat", "Approved", "ALGS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IBAT inhibitor", administration: "Oral once daily", keyAdvantage: "Interrupts bile acid recirculation" }
  },
  {
    id: "gi-47", name: "Odevixibat", phase: "Approved", indication: "PFIC", therapeuticArea: "Gastroenterology/GI",
    company: "Albireo/Ipsen", companyTrackRecord: 'average', nctId: "NCT03566238",
    scores: calculateProbabilityScores("Approved", "PFIC", "Gastroenterology"), marketData: generateMarketProjections("Odevixibat", "Approved", "PFIC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IBAT inhibitor", administration: "Oral once daily", keyAdvantage: "First approved therapy for PFIC" }
  },
  {
    id: "gi-48", name: "Volixibat", phase: "Phase II", indication: "Primary Sclerosing Cholangitis", therapeuticArea: "Gastroenterology/GI",
    company: "Mirum Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT04663308",
    scores: calculateProbabilityScores("Phase II", "PSC", "Gastroenterology"), marketData: generateMarketProjections("Volixibat", "Phase II", "PSC", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IBAT inhibitor", administration: "Oral once daily", keyAdvantage: "PSC therapeutic target" }
  },
  {
    id: "gi-49", name: "Setmelanotide", phase: "Approved", indication: "Genetic Obesity (POMC/LEPR)", therapeuticArea: "Gastroenterology/GI",
    company: "Rhythm Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT02896192",
    scores: calculateProbabilityScores("Approved", "Genetic Obesity", "Gastroenterology"), marketData: generateMarketProjections("Setmelanotide", "Approved", "Obesity", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "MC4R agonist", administration: "SC injection daily", keyAdvantage: "Precision medicine for genetic obesity" }
  },
  {
    id: "gi-50", name: "Tralokinumab", phase: "Phase II", indication: "Eosinophilic Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "LEO Pharma", companyTrackRecord: 'average', nctId: "NCT04872777",
    scores: calculateProbabilityScores("Phase II", "EoE", "Gastroenterology"), marketData: generateMarketProjections("Tralokinumab-EoE", "Phase II", "EoE", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-13 antibody", administration: "SC injection", keyAdvantage: "IL-13 blockade for EoE" }
  },
  {
    id: "gi-51", name: "Dupilumab", phase: "Approved", indication: "Eosinophilic Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "Regeneron/Sanofi", companyTrackRecord: 'fast', nctId: "NCT03633617",
    scores: calculateProbabilityScores("Approved", "EoE", "Gastroenterology"), marketData: generateMarketProjections("Dupilumab-EoE", "Approved", "EoE", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-4/13 antibody", administration: "SC injection weekly", keyAdvantage: "First approved therapy for EoE" }
  },
  {
    id: "gi-52", name: "Budesonide ODT", phase: "Approved", indication: "Eosinophilic Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "Takeda", companyTrackRecord: 'fast', nctId: "NCT02605837",
    scores: calculateProbabilityScores("Approved", "EoE", "Gastroenterology"), marketData: generateMarketProjections("Budesonide ODT", "Approved", "EoE", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Topical corticosteroid", administration: "Oral dissolving tablet", keyAdvantage: "First approved EoE therapy" }
  },
  {
    id: "gi-53", name: "Fluticasone Orally Disintegrating", phase: "Approved", indication: "Eosinophilic Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "Ellodi Pharma", companyTrackRecord: 'average', nctId: "NCT04281108",
    scores: calculateProbabilityScores("Approved", "EoE", "Gastroenterology"), marketData: generateMarketProjections("Fluticasone ODT", "Approved", "EoE", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Topical corticosteroid", administration: "Oral dissolving tablet", keyAdvantage: "Esophageal-targeted steroid" }
  },
  {
    id: "gi-54", name: "Lirentelimab", phase: "Phase II/III", indication: "Eosinophilic GI Diseases", therapeuticArea: "Gastroenterology/GI",
    company: "Allakos", companyTrackRecord: 'slow', nctId: "NCT04322604",
    scores: calculateProbabilityScores("Phase II", "EGID", "Gastroenterology"), marketData: generateMarketProjections("Lirentelimab", "Phase II", "EGID", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-Siglec-8 antibody", administration: "IV infusion", keyAdvantage: "Eosinophil/mast cell depletion" }
  },
  {
    id: "gi-55", name: "Cendakimab", phase: "Phase III", indication: "Eosinophilic Esophagitis", therapeuticArea: "Gastroenterology/GI",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT04753697",
    scores: calculateProbabilityScores("Phase III", "EoE", "Gastroenterology"), marketData: generateMarketProjections("Cendakimab", "Phase III", "EoE", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-13 antibody", administration: "SC injection", keyAdvantage: "Selective IL-13 blockade" }
  },
  {
    id: "gi-56", name: "Terlipressin", phase: "Approved", indication: "Hepatorenal Syndrome", therapeuticArea: "Gastroenterology/GI",
    company: "Mallinckrodt", companyTrackRecord: 'slow', nctId: "NCT02770716",
    scores: calculateProbabilityScores("Approved", "HRS", "Gastroenterology"), marketData: generateMarketProjections("Terlipressin", "Approved", "HRS", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Vasopressin analog", administration: "IV infusion", keyAdvantage: "Reverses hepatorenal syndrome" }
  },
  {
    id: "gi-57", name: "Belapectin", phase: "Phase II/III", indication: "MASH Cirrhosis", therapeuticArea: "Gastroenterology/GI",
    company: "Galectin Therapeutics", companyTrackRecord: 'slow', nctId: "NCT04365868",
    scores: calculateProbabilityScores("Phase II", "NASH Cirrhosis", "Gastroenterology"), marketData: generateMarketProjections("Belapectin", "Phase II", "NASH", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Galectin-3 inhibitor", administration: "IV infusion biweekly", keyAdvantage: "Portal hypertension target" }
  },
  {
    id: "gi-58", name: "Ziritaxestat", phase: "Phase II", indication: "MASH/IPF", therapeuticArea: "Gastroenterology/GI",
    company: "Galapagos", companyTrackRecord: 'average', nctId: "NCT03912532",
    scores: calculateProbabilityScores("Phase II", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Ziritaxestat", "Phase II", "NASH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Autotaxin inhibitor", administration: "Oral once daily", keyAdvantage: "Novel anti-fibrotic target" }
  },
  {
    id: "gi-59", name: "Simtuzumab", phase: "Phase II", indication: "MASH Fibrosis", therapeuticArea: "Gastroenterology/GI",
    company: "Gilead", companyTrackRecord: 'fast', nctId: "NCT01672866",
    scores: calculateProbabilityScores("Phase II", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Simtuzumab", "Phase II", "NASH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-LOXL2 antibody", administration: "IV infusion", keyAdvantage: "Fibrosis targeting" }
  },
  {
    id: "gi-60", name: "Tropifexor", phase: "Phase II", indication: "MASH/PBC", therapeuticArea: "Gastroenterology/GI",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT02855164",
    scores: calculateProbabilityScores("Phase II", "NASH", "Gastroenterology"), marketData: generateMarketProjections("Tropifexor", "Phase II", "NASH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Non-bile acid FXR agonist", administration: "Oral once daily", keyAdvantage: "FXR without bile acid structure" }
  }
];
