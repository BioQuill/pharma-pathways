// 50 Nephrology/Renal Molecules
import { calculateProbabilityScores, generateMarketProjections } from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const nephrologyMolecules: MoleculeProfile[] = [
  {
    id: "neph-1", name: "Finerenone", phase: "Approved", indication: "CKD with Type 2 Diabetes", therapeuticArea: "Nephrology/Renal",
    company: "Bayer", companyTrackRecord: 'fast', nctId: "NCT02540993",
    scores: calculateProbabilityScores("Approved", "CKD", "Nephrology"), marketData: generateMarketProjections("Finerenone", "Approved", "CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Non-steroidal MRA", administration: "Oral once daily", keyAdvantage: "Cardiorenal protection in CKD+T2D" }
  },
  {
    id: "neph-2", name: "Dapagliflozin", phase: "Approved", indication: "CKD", therapeuticArea: "Nephrology/Renal",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT03036150",
    scores: calculateProbabilityScores("Approved", "CKD", "Nephrology"), marketData: generateMarketProjections("Dapagliflozin-CKD", "Approved", "CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "SGLT2 inhibitor", administration: "Oral once daily", keyAdvantage: "First SGLT2i approved for CKD" }
  },
  {
    id: "neph-3", name: "Empagliflozin", phase: "Approved", indication: "CKD", therapeuticArea: "Nephrology/Renal",
    company: "Boehringer Ingelheim/Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT03594110",
    scores: calculateProbabilityScores("Approved", "CKD", "Nephrology"), marketData: generateMarketProjections("Empagliflozin-CKD", "Approved", "CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "SGLT2 inhibitor", administration: "Oral once daily", keyAdvantage: "EMPA-KIDNEY positive results" }
  },
  {
    id: "neph-4", name: "Canagliflozin", phase: "Approved", indication: "Diabetic Kidney Disease", therapeuticArea: "Nephrology/Renal",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT02065791",
    scores: calculateProbabilityScores("Approved", "DKD", "Nephrology"), marketData: generateMarketProjections("Canagliflozin-DKD", "Approved", "DKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "SGLT2 inhibitor", administration: "Oral once daily", keyAdvantage: "CREDENCE trial landmark data" }
  },
  {
    id: "neph-5", name: "Sparsentan", phase: "Approved", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "Travere Therapeutics", companyTrackRecord: 'average', nctId: "NCT03762850",
    scores: calculateProbabilityScores("Approved", "IgAN", "Nephrology"), marketData: generateMarketProjections("Sparsentan", "Approved", "IgAN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Dual endothelin/ARB", administration: "Oral once daily", keyAdvantage: "Novel dual mechanism for IgAN" }
  },
  {
    id: "neph-6", name: "Budesonide (Targeted-Release)", phase: "Approved", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "Calliditas/STADA", companyTrackRecord: 'average', nctId: "NCT03643965",
    scores: calculateProbabilityScores("Approved", "IgAN", "Nephrology"), marketData: generateMarketProjections("Nefecon", "Approved", "IgAN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Targeted-release corticosteroid", administration: "Oral once daily", keyAdvantage: "Ileal release, mucosal targeting" }
  },
  {
    id: "neph-7", name: "Atrasentan", phase: "Phase III", indication: "IgA Nephropathy/DKD", therapeuticArea: "Nephrology/Renal",
    company: "Chinook/Novartis", companyTrackRecord: 'fast', nctId: "NCT04573478",
    scores: calculateProbabilityScores("Phase III", "IgAN", "Nephrology"), marketData: generateMarketProjections("Atrasentan", "Phase III", "IgAN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Endothelin A receptor antagonist", administration: "Oral once daily", keyAdvantage: "Selective ETA, reduced edema" }
  },
  {
    id: "neph-8", name: "Zigakibart", phase: "Phase III", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "Chinook/Novartis", companyTrackRecord: 'fast', nctId: "NCT05065970",
    scores: calculateProbabilityScores("Phase III", "IgAN", "Nephrology"), marketData: generateMarketProjections("Zigakibart", "Phase III", "IgAN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-APRIL antibody", administration: "SC injection monthly", keyAdvantage: "Targets IgA production pathway" }
  },
  {
    id: "neph-9", name: "Sibeprenlimab", phase: "Phase III", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT05248659",
    scores: calculateProbabilityScores("Phase III", "IgAN", "Nephrology"), marketData: generateMarketProjections("Sibeprenlimab", "Phase III", "IgAN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-APRIL antibody", administration: "SC/IV injection monthly", keyAdvantage: "APRIL pathway targeting" }
  },
  {
    id: "neph-10", name: "Povetacicept", phase: "Phase III", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "Vera Therapeutics", companyTrackRecord: 'average', nctId: "NCT05852938",
    scores: calculateProbabilityScores("Phase III", "IgAN", "Nephrology"), marketData: generateMarketProjections("Povetacicept", "Phase III", "IgAN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TACI-Fc fusion (dual BAFF/APRIL)", administration: "SC injection", keyAdvantage: "Dual pathway blockade" }
  },
  {
    id: "neph-11", name: "Telitacicept", phase: "Phase III", indication: "IgA Nephropathy", therapeuticArea: "Nephrology/Renal",
    company: "RemeGen", companyTrackRecord: 'average', nctId: "NCT04291781",
    scores: calculateProbabilityScores("Phase III", "IgAN", "Nephrology"), marketData: generateMarketProjections("Telitacicept", "Phase III", "IgAN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TACI-Fc fusion", administration: "SC injection weekly", keyAdvantage: "BAFF/APRIL dual inhibition" }
  },
  {
    id: "neph-12", name: "Iptacopan", phase: "Phase III", indication: "C3 Glomerulopathy/IgAN", therapeuticArea: "Nephrology/Renal",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT04817618",
    scores: calculateProbabilityScores("Phase III", "C3G", "Nephrology"), marketData: generateMarketProjections("Iptacopan-C3G", "Phase III", "C3G", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Factor B inhibitor", administration: "Oral twice daily", keyAdvantage: "Oral complement inhibition" }
  },
  {
    id: "neph-13", name: "Danicopan", phase: "Phase II", indication: "C3 Glomerulopathy", therapeuticArea: "Nephrology/Renal",
    company: "Alexion/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT03459443",
    scores: calculateProbabilityScores("Phase II", "C3G", "Nephrology"), marketData: generateMarketProjections("Danicopan-C3G", "Phase II", "C3G", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Factor D inhibitor", administration: "Oral twice daily", keyAdvantage: "Alternative pathway inhibition" }
  },
  {
    id: "neph-14", name: "Pegcetacoplan", phase: "Phase III", indication: "C3 Glomerulopathy", therapeuticArea: "Nephrology/Renal",
    company: "Apellis", companyTrackRecord: 'average', nctId: "NCT03453619",
    scores: calculateProbabilityScores("Phase III", "C3G", "Nephrology"), marketData: generateMarketProjections("Pegcetacoplan-C3G", "Phase III", "C3G", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "C3 inhibitor", administration: "SC injection twice weekly", keyAdvantage: "Proximal complement blockade" }
  },
  {
    id: "neph-15", name: "Voclosporin", phase: "Approved", indication: "Lupus Nephritis", therapeuticArea: "Nephrology/Renal",
    company: "Aurinia Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT03021499",
    scores: calculateProbabilityScores("Approved", "LN", "Nephrology"), marketData: generateMarketProjections("Voclosporin", "Approved", "LN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Calcineurin inhibitor", administration: "Oral twice daily", keyAdvantage: "Modified CNI for lupus nephritis" }
  },
  {
    id: "neph-16", name: "Belimumab", phase: "Approved", indication: "Lupus Nephritis", therapeuticArea: "Nephrology/Renal",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT01639339",
    scores: calculateProbabilityScores("Approved", "LN", "Nephrology"), marketData: generateMarketProjections("Belimumab-LN", "Approved", "LN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-BLyS antibody", administration: "IV or SC", keyAdvantage: "First biologic for LN" }
  },
  {
    id: "neph-17", name: "Obinutuzumab", phase: "Phase III", indication: "Lupus Nephritis", therapeuticArea: "Nephrology/Renal",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT04221477",
    scores: calculateProbabilityScores("Phase III", "LN", "Nephrology"), marketData: generateMarketProjections("Obinutuzumab-LN", "Phase III", "LN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Type II anti-CD20 antibody", administration: "IV infusion", keyAdvantage: "Glycoengineered CD20 antibody" }
  },
  {
    id: "neph-18", name: "Anifrolumab", phase: "Phase III", indication: "Lupus Nephritis", therapeuticArea: "Nephrology/Renal",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT05138133",
    scores: calculateProbabilityScores("Phase III", "LN", "Nephrology"), marketData: generateMarketProjections("Anifrolumab-LN", "Phase III", "LN", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IFNAR1 antibody", administration: "IV infusion", keyAdvantage: "Type I interferon blockade" }
  },
  {
    id: "neph-19", name: "Daratumumab", phase: "Phase II", indication: "FSGS/Lupus Nephritis", therapeuticArea: "Nephrology/Renal",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT04550494",
    scores: calculateProbabilityScores("Phase II", "FSGS", "Nephrology"), marketData: generateMarketProjections("Daratumumab-FSGS", "Phase II", "FSGS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CD38 antibody", administration: "SC injection", keyAdvantage: "Plasma cell depletion" }
  },
  {
    id: "neph-20", name: "Ravulizumab", phase: "Approved", indication: "aHUS", therapeuticArea: "Nephrology/Renal",
    company: "Alexion/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT02949128",
    scores: calculateProbabilityScores("Approved", "aHUS", "Nephrology"), marketData: generateMarketProjections("Ravulizumab", "Approved", "aHUS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-C5 antibody", administration: "IV infusion every 8 weeks", keyAdvantage: "Longer dosing interval" }
  },
  {
    id: "neph-21", name: "Eculizumab", phase: "Approved", indication: "aHUS", therapeuticArea: "Nephrology/Renal",
    company: "Alexion/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT01194973",
    scores: calculateProbabilityScores("Approved", "aHUS", "Nephrology"), marketData: generateMarketProjections("Eculizumab-aHUS", "Approved", "aHUS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-C5 antibody", administration: "IV infusion biweekly", keyAdvantage: "First complement inhibitor for aHUS" }
  },
  {
    id: "neph-22", name: "Omaveloxolone", phase: "Phase II", indication: "CKD/Alport Syndrome", therapeuticArea: "Nephrology/Renal",
    company: "Reata/Biogen", companyTrackRecord: 'average', nctId: "NCT02316821",
    scores: calculateProbabilityScores("Phase II", "CKD", "Nephrology"), marketData: generateMarketProjections("Omaveloxolone-CKD", "Phase II", "CKD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Nrf2 activator", administration: "Oral once daily", keyAdvantage: "Antioxidant/anti-inflammatory" }
  },
  {
    id: "neph-23", name: "Zibotentan", phase: "Phase III", indication: "Diabetic Kidney Disease", therapeuticArea: "Nephrology/Renal",
    company: "AstraZeneca/Chinook", companyTrackRecord: 'fast', nctId: "NCT04724837",
    scores: calculateProbabilityScores("Phase III", "DKD", "Nephrology"), marketData: generateMarketProjections("Zibotentan", "Phase III", "DKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Endothelin A receptor antagonist", administration: "Oral once daily", keyAdvantage: "Combination with dapa in ZENITH" }
  },
  {
    id: "neph-24", name: "Cotadutide", phase: "Phase II", indication: "Diabetic Kidney Disease", therapeuticArea: "Nephrology/Renal",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT04515849",
    scores: calculateProbabilityScores("Phase II", "DKD", "Nephrology"), marketData: generateMarketProjections("Cotadutide", "Phase II", "DKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GLP-1/Glucagon dual agonist", administration: "SC injection", keyAdvantage: "Metabolic + renal effects" }
  },
  {
    id: "neph-25", name: "Bardoxolone", phase: "Phase III", indication: "CKD/Alport Syndrome", therapeuticArea: "Nephrology/Renal",
    company: "Reata/Kyowa Kirin", companyTrackRecord: 'slow', nctId: "NCT03749447",
    scores: calculateProbabilityScores("Phase III", "CKD", "Nephrology"), marketData: generateMarketProjections("Bardoxolone", "Phase III", "CKD", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Nrf2 activator", administration: "Oral once daily", keyAdvantage: "Improves eGFR in Alport" }
  },
  {
    id: "neph-26", name: "Roxadustat", phase: "Approved", indication: "Anemia of CKD", therapeuticArea: "Nephrology/Renal",
    company: "FibroGen/AstraZeneca", companyTrackRecord: 'average', nctId: "NCT02174627",
    scores: calculateProbabilityScores("Approved", "Anemia CKD", "Nephrology"), marketData: generateMarketProjections("Roxadustat", "Approved", "Anemia CKD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HIF-PHI", administration: "Oral three times weekly", keyAdvantage: "Oral alternative to ESAs" }
  },
  {
    id: "neph-27", name: "Vadadustat", phase: "Approved", indication: "Anemia of CKD", therapeuticArea: "Nephrology/Renal",
    company: "Akebia", companyTrackRecord: 'slow', nctId: "NCT02865850",
    scores: calculateProbabilityScores("Approved", "Anemia CKD", "Nephrology"), marketData: generateMarketProjections("Vadadustat", "Approved", "Anemia CKD", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HIF-PHI", administration: "Oral once daily", keyAdvantage: "Once-daily dosing" }
  },
  {
    id: "neph-28", name: "Daprodustat", phase: "Approved", indication: "Anemia of CKD", therapeuticArea: "Nephrology/Renal",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT02879305",
    scores: calculateProbabilityScores("Approved", "Anemia CKD", "Nephrology"), marketData: generateMarketProjections("Daprodustat", "Approved", "Anemia CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HIF-PHI", administration: "Oral once daily", keyAdvantage: "Consistent efficacy in DD/NDD-CKD" }
  },
  {
    id: "neph-29", name: "Enarodustat", phase: "Approved", indication: "Anemia of CKD", therapeuticArea: "Nephrology/Renal",
    company: "Japan Tobacco", companyTrackRecord: 'average', nctId: "NCT02219477",
    scores: calculateProbabilityScores("Approved", "Anemia CKD", "Nephrology"), marketData: generateMarketProjections("Enarodustat", "Approved", "Anemia CKD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HIF-PHI", administration: "Oral once daily", keyAdvantage: "Japan-approved HIF-PHI" }
  },
  {
    id: "neph-30", name: "Molidustat", phase: "Phase III", indication: "Anemia of CKD", therapeuticArea: "Nephrology/Renal",
    company: "Bayer", companyTrackRecord: 'fast', nctId: "NCT03350321",
    scores: calculateProbabilityScores("Phase III", "Anemia CKD", "Nephrology"), marketData: generateMarketProjections("Molidustat", "Phase III", "Anemia CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HIF-PHI", administration: "Oral once daily", keyAdvantage: "Fixed-dose convenience" }
  },
  {
    id: "neph-31", name: "Patiromer", phase: "Approved", indication: "Hyperkalemia", therapeuticArea: "Nephrology/Renal",
    company: "Vifor/CSL", companyTrackRecord: 'average', nctId: "NCT01810939",
    scores: calculateProbabilityScores("Approved", "Hyperkalemia", "Nephrology"), marketData: generateMarketProjections("Patiromer", "Approved", "Hyperkalemia", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Potassium binder", administration: "Oral once daily", keyAdvantage: "Well-tolerated, palatable" }
  },
  {
    id: "neph-32", name: "Sodium Zirconium Cyclosilicate", phase: "Approved", indication: "Hyperkalemia", therapeuticArea: "Nephrology/Renal",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT02088073",
    scores: calculateProbabilityScores("Approved", "Hyperkalemia", "Nephrology"), marketData: generateMarketProjections("ZS-9", "Approved", "Hyperkalemia", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Potassium binder", administration: "Oral once daily", keyAdvantage: "Fast onset of action" }
  },
  {
    id: "neph-33", name: "Efpeglenatide", phase: "Phase III", indication: "CKD", therapeuticArea: "Nephrology/Renal",
    company: "Sanofi/Hanmi", companyTrackRecord: 'fast', nctId: "NCT03461562",
    scores: calculateProbabilityScores("Phase III", "CKD", "Nephrology"), marketData: generateMarketProjections("Efpeglenatide", "Phase III", "CKD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GLP-1 agonist", administration: "SC injection weekly", keyAdvantage: "Renal outcomes focus" }
  },
  {
    id: "neph-34", name: "Migalastat", phase: "Approved", indication: "Fabry Disease (renal)", therapeuticArea: "Nephrology/Renal",
    company: "Amicus Therapeutics", companyTrackRecord: 'average', nctId: "NCT00925301",
    scores: calculateProbabilityScores("Approved", "Fabry", "Nephrology"), marketData: generateMarketProjections("Migalastat", "Approved", "Fabry", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Pharmacological chaperone", administration: "Oral every other day", keyAdvantage: "Oral option for amenable mutations" }
  },
  {
    id: "neph-35", name: "Pegunigalsidase Alfa", phase: "Approved", indication: "Fabry Disease", therapeuticArea: "Nephrology/Renal",
    company: "Chiesi/Protalix", companyTrackRecord: 'average', nctId: "NCT02795676",
    scores: calculateProbabilityScores("Approved", "Fabry", "Nephrology"), marketData: generateMarketProjections("PRX-102", "Approved", "Fabry", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PEGylated ERT", administration: "IV infusion every 2 weeks", keyAdvantage: "Reduced immunogenicity" }
  },
  {
    id: "neph-36", name: "Lumasiran", phase: "Approved", indication: "Primary Hyperoxaluria Type 1", therapeuticArea: "Nephrology/Renal",
    company: "Alnylam", companyTrackRecord: 'fast', nctId: "NCT03681184",
    scores: calculateProbabilityScores("Approved", "PH1", "Nephrology"), marketData: generateMarketProjections("Lumasiran", "Approved", "PH1", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HAO1-targeting RNAi", administration: "SC injection monthly/quarterly", keyAdvantage: "First RNAi for rare kidney disease" }
  },
  {
    id: "neph-37", name: "Nedosiran", phase: "Phase III", indication: "Primary Hyperoxaluria", therapeuticArea: "Nephrology/Renal",
    company: "Dicerna/Novo Nordisk", companyTrackRecord: 'fast', nctId: "NCT04042402",
    scores: calculateProbabilityScores("Phase III", "PH", "Nephrology"), marketData: generateMarketProjections("Nedosiran", "Phase III", "PH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "LDHA-targeting RNAi", administration: "SC injection quarterly", keyAdvantage: "Works in all PH types" }
  },
  {
    id: "neph-38", name: "Stiripentol (Nephropathic Cystinosis)", phase: "Phase II", indication: "Nephropathic Cystinosis", therapeuticArea: "Nephrology/Renal",
    company: "Biocodex", companyTrackRecord: 'average', nctId: "NCT04416074",
    scores: calculateProbabilityScores("Phase II", "Cystinosis", "Nephrology"), marketData: generateMarketProjections("Stiripentol-NC", "Phase II", "Cystinosis", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Antiepileptic (repurposed)", administration: "Oral", keyAdvantage: "Cystine-depleting potential" }
  },
  {
    id: "neph-39", name: "Cysteamine Delayed-Release", phase: "Approved", indication: "Nephropathic Cystinosis", therapeuticArea: "Nephrology/Renal",
    company: "Horizon/Amgen", companyTrackRecord: 'fast', nctId: "NCT01744678",
    scores: calculateProbabilityScores("Approved", "Cystinosis", "Nephrology"), marketData: generateMarketProjections("Cysteamine DR", "Approved", "Cystinosis", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Cystine-depleting agent", administration: "Oral every 12 hours", keyAdvantage: "Twice-daily convenience" }
  },
  {
    id: "neph-40", name: "Casirivimab/Imdevimab", phase: "Approved", indication: "Kidney Transplant COVID-19", therapeuticArea: "Nephrology/Renal",
    company: "Regeneron", companyTrackRecord: 'fast', nctId: "NCT04425629",
    scores: calculateProbabilityScores("Approved", "Transplant COVID", "Nephrology"), marketData: generateMarketProjections("REGEN-COV", "Approved", "Transplant", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-SARS-CoV-2 mAb cocktail", administration: "IV or SC injection", keyAdvantage: "For immunocompromised transplant patients" }
  },
  {
    id: "neph-41", name: "Belatacept", phase: "Approved", indication: "Kidney Transplant Rejection", therapeuticArea: "Nephrology/Renal",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT00256750",
    scores: calculateProbabilityScores("Approved", "Transplant", "Nephrology"), marketData: generateMarketProjections("Belatacept", "Approved", "Transplant", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CTLA4-Ig fusion", administration: "IV infusion monthly", keyAdvantage: "CNI-free regimen" }
  },
  {
    id: "neph-42", name: "Clazakizumab", phase: "Phase III", indication: "Chronic AMR", therapeuticArea: "Nephrology/Renal",
    company: "CSL Behring", companyTrackRecord: 'fast', nctId: "NCT03744910",
    scores: calculateProbabilityScores("Phase III", "Transplant AMR", "Nephrology"), marketData: generateMarketProjections("Clazakizumab", "Phase III", "AMR", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-6 antibody", administration: "SC injection monthly", keyAdvantage: "For chronic antibody-mediated rejection" }
  },
  {
    id: "neph-43", name: "Imlifidase", phase: "Approved", indication: "Desensitization for Transplant", therapeuticArea: "Nephrology/Renal",
    company: "Hansa Biopharma", companyTrackRecord: 'average', nctId: "NCT02426684",
    scores: calculateProbabilityScores("Approved", "Transplant", "Nephrology"), marketData: generateMarketProjections("Imlifidase", "Approved", "Transplant", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IgG-degrading enzyme", administration: "IV infusion", keyAdvantage: "Rapid DSA removal" }
  },
  {
    id: "neph-44", name: "Tegoprubart", phase: "Phase II", indication: "Kidney Transplant", therapeuticArea: "Nephrology/Renal",
    company: "Eledon Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT04711291",
    scores: calculateProbabilityScores("Phase II", "Transplant", "Nephrology"), marketData: generateMarketProjections("Tegoprubart", "Phase II", "Transplant", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CD40L antibody", administration: "IV infusion", keyAdvantage: "Novel costimulation blockade" }
  },
  {
    id: "neph-45", name: "Felzartamab", phase: "Phase II", indication: "Chronic AMR", therapeuticArea: "Nephrology/Renal",
    company: "MorphoSys/HI-Bio", companyTrackRecord: 'average', nctId: "NCT05021484",
    scores: calculateProbabilityScores("Phase II", "Transplant AMR", "Nephrology"), marketData: generateMarketProjections("Felzartamab", "Phase II", "AMR", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CD38 antibody", administration: "IV infusion", keyAdvantage: "Plasma cell depletion" }
  },
  {
    id: "neph-46", name: "Tabelecleucel", phase: "Phase III", indication: "EBV-PTLD (Transplant)", therapeuticArea: "Nephrology/Renal",
    company: "Atara Biotherapeutics", companyTrackRecord: 'slow', nctId: "NCT03394365",
    scores: calculateProbabilityScores("Phase III", "EBV-PTLD", "Nephrology"), marketData: generateMarketProjections("Tabelecleucel", "Phase III", "PTLD", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "EBV-specific T-cells", administration: "IV infusion", keyAdvantage: "Off-the-shelf EBV-directed therapy" }
  },
  {
    id: "neph-47", name: "VX-147", phase: "Phase III", indication: "APOL1-mediated FSGS", therapeuticArea: "Nephrology/Renal",
    company: "Vertex", companyTrackRecord: 'fast', nctId: "NCT05821621",
    scores: calculateProbabilityScores("Phase III", "FSGS", "Nephrology"), marketData: generateMarketProjections("VX-147", "Phase III", "FSGS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "APOL1 inhibitor", administration: "Oral once daily", keyAdvantage: "First targeted therapy for APOL1 kidney disease" }
  },
  {
    id: "neph-48", name: "Inaxaplin", phase: "Phase II/III", indication: "APOL1-mediated FSGS", therapeuticArea: "Nephrology/Renal",
    company: "Vertex", companyTrackRecord: 'fast', nctId: "NCT04340362",
    scores: calculateProbabilityScores("Phase II", "FSGS", "Nephrology"), marketData: generateMarketProjections("Inaxaplin", "Phase II", "FSGS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "APOL1 inhibitor", administration: "Oral", keyAdvantage: "APOL1 variant-specific therapy" }
  },
  {
    id: "neph-49", name: "GS-4224", phase: "Phase II", indication: "FSGS", therapeuticArea: "Nephrology/Renal",
    company: "Gilead", companyTrackRecord: 'fast', nctId: "NCT03448692",
    scores: calculateProbabilityScores("Phase II", "FSGS", "Nephrology"), marketData: generateMarketProjections("GS-4224", "Phase II", "FSGS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TRPC5 inhibitor", administration: "Oral once daily", keyAdvantage: "Novel podocyte protection" }
  },
  {
    id: "neph-50", name: "Resunab", phase: "Phase II", indication: "FSGS", therapeuticArea: "Nephrology/Renal",
    company: "Corbus Pharmaceuticals", companyTrackRecord: 'slow', nctId: "NCT03569345",
    scores: calculateProbabilityScores("Phase II", "FSGS", "Nephrology"), marketData: generateMarketProjections("Resunab", "Phase II", "FSGS", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CB2 agonist", administration: "Oral twice daily", keyAdvantage: "Anti-fibrotic mechanism" }
  }
];
