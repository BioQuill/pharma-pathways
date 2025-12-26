// 40 Women's Health Molecules
import { calculateProbabilityScores, generateMarketProjections } from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const womensHealthMolecules: MoleculeProfile[] = [
  {
    id: "wh-1", name: "Elagolix", phase: "Approved", indication: "Endometriosis/Uterine Fibroids", therapeuticArea: "Women's Health",
    company: "AbbVie", companyTrackRecord: 'fast', nctId: "NCT01760954",
    scores: calculateProbabilityScores("Approved", "Endometriosis", "Womens Health"), marketData: generateMarketProjections("Elagolix", "Approved", "Endometriosis", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GnRH antagonist", administration: "Oral once or twice daily", keyAdvantage: "First oral GnRH antagonist" }
  },
  {
    id: "wh-2", name: "Relugolix Combination", phase: "Approved", indication: "Endometriosis/Uterine Fibroids", therapeuticArea: "Women's Health",
    company: "Myovant/Pfizer", companyTrackRecord: 'fast', nctId: "NCT03049735",
    scores: calculateProbabilityScores("Approved", "Endometriosis", "Womens Health"), marketData: generateMarketProjections("Relugolix Combo", "Approved", "Endometriosis", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GnRH antagonist + E2/NETA", administration: "Oral once daily", keyAdvantage: "Add-back therapy included" }
  },
  {
    id: "wh-3", name: "Linzagolix", phase: "Approved", indication: "Uterine Fibroids", therapeuticArea: "Women's Health",
    company: "Theramex/Kissei", companyTrackRecord: 'average', nctId: "NCT03070899",
    scores: calculateProbabilityScores("Approved", "Fibroids", "Womens Health"), marketData: generateMarketProjections("Linzagolix", "Approved", "Fibroids", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GnRH antagonist", administration: "Oral once daily", keyAdvantage: "Flexible dosing options" }
  },
  {
    id: "wh-4", name: "Fezolinetant", phase: "Approved", indication: "Vasomotor Symptoms (Menopause)", therapeuticArea: "Women's Health",
    company: "Astellas", companyTrackRecord: 'fast', nctId: "NCT04003155",
    scores: calculateProbabilityScores("Approved", "Menopause VMS", "Womens Health"), marketData: generateMarketProjections("Fezolinetant", "Approved", "VMS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NK3 receptor antagonist", administration: "Oral once daily", keyAdvantage: "First non-hormonal VMS therapy" }
  },
  {
    id: "wh-5", name: "Elinzanetant", phase: "Phase III", indication: "Vasomotor Symptoms/Sleep", therapeuticArea: "Women's Health",
    company: "Bayer", companyTrackRecord: 'fast', nctId: "NCT05042362",
    scores: calculateProbabilityScores("Phase III", "Menopause VMS", "Womens Health"), marketData: generateMarketProjections("Elinzanetant", "Phase III", "VMS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NK1/3 dual receptor antagonist", administration: "Oral once daily", keyAdvantage: "Dual NK blockade, sleep benefits" }
  },
  {
    id: "wh-6", name: "Orforglipron", phase: "Phase III", indication: "PCOS", therapeuticArea: "Women's Health",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT05869903",
    scores: calculateProbabilityScores("Phase III", "PCOS", "Womens Health"), marketData: generateMarketProjections("Orforglipron-PCOS", "Phase III", "PCOS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral GLP-1 agonist", administration: "Oral once daily", keyAdvantage: "Oral convenience for PCOS" }
  },
  {
    id: "wh-7", name: "Bremelanotide", phase: "Approved", indication: "Hypoactive Sexual Desire Disorder", therapeuticArea: "Women's Health",
    company: "Palatin/AMAG", companyTrackRecord: 'average', nctId: "NCT02338960",
    scores: calculateProbabilityScores("Approved", "HSDD", "Womens Health"), marketData: generateMarketProjections("Bremelanotide", "Approved", "HSDD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "MC4R agonist", administration: "SC injection PRN", keyAdvantage: "Novel mechanism for female HSDD" }
  },
  {
    id: "wh-8", name: "Flibanserin", phase: "Approved", indication: "Hypoactive Sexual Desire Disorder", therapeuticArea: "Women's Health",
    company: "Sprout/Valeant", companyTrackRecord: 'slow', nctId: "NCT01298102",
    scores: calculateProbabilityScores("Approved", "HSDD", "Womens Health"), marketData: generateMarketProjections("Flibanserin", "Approved", "HSDD", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "5-HT1A agonist/5-HT2A antagonist", administration: "Oral once daily at bedtime", keyAdvantage: "First approved drug for female HSDD" }
  },
  {
    id: "wh-9", name: "Atosiban", phase: "Approved", indication: "Preterm Labor", therapeuticArea: "Women's Health",
    company: "Ferring", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Preterm Labor", "Womens Health"), marketData: generateMarketProjections("Atosiban", "Approved", "Preterm", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oxytocin receptor antagonist", administration: "IV infusion", keyAdvantage: "Targeted tocolytic mechanism" }
  },
  {
    id: "wh-10", name: "Retosiban", phase: "Phase III", indication: "Preterm Labor", therapeuticArea: "Women's Health",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT02377466",
    scores: calculateProbabilityScores("Phase III", "Preterm Labor", "Womens Health"), marketData: generateMarketProjections("Retosiban", "Phase III", "Preterm", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral oxytocin antagonist", administration: "Oral", keyAdvantage: "Oral administration" }
  },
  {
    id: "wh-11", name: "Dichloroacetate (Ovarian Cancer)", phase: "Phase II", indication: "Ovarian Cancer", therapeuticArea: "Women's Health",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT01029925",
    scores: calculateProbabilityScores("Phase II", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("DCA-Ovarian", "Phase II", "Ovarian Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PDK inhibitor", administration: "Oral twice daily", keyAdvantage: "Metabolic targeting" }
  },
  {
    id: "wh-12", name: "Rucaparib", phase: "Approved", indication: "BRCA+ Ovarian Cancer", therapeuticArea: "Women's Health",
    company: "Clovis Oncology", companyTrackRecord: 'slow', nctId: "NCT01891344",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("Rucaparib", "Approved", "Ovarian Cancer", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PARP inhibitor", administration: "Oral twice daily", keyAdvantage: "BRCA-targeted maintenance" }
  },
  {
    id: "wh-13", name: "Olaparib", phase: "Approved", indication: "BRCA+ Ovarian/Breast Cancer", therapeuticArea: "Women's Health",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT01874353",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("Olaparib", "Approved", "Ovarian Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PARP inhibitor", administration: "Oral twice daily", keyAdvantage: "First PARP inhibitor approved" }
  },
  {
    id: "wh-14", name: "Niraparib", phase: "Approved", indication: "Ovarian Cancer Maintenance", therapeuticArea: "Women's Health",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT01847274",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("Niraparib", "Approved", "Ovarian Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PARP inhibitor", administration: "Oral once daily", keyAdvantage: "Once-daily dosing, all-comer benefit" }
  },
  {
    id: "wh-15", name: "Mirvetuximab Soravtansine", phase: "Approved", indication: "FRα+ Ovarian Cancer", therapeuticArea: "Women's Health",
    company: "ImmunoGen", companyTrackRecord: 'average', nctId: "NCT04209855",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("Mirvetuximab", "Approved", "Ovarian Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FRα-directed ADC", administration: "IV infusion every 3 weeks", keyAdvantage: "First FRα-targeted therapy" }
  },
  {
    id: "wh-16", name: "Bevacizumab", phase: "Approved", indication: "Ovarian Cancer", therapeuticArea: "Women's Health",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT00262847",
    scores: calculateProbabilityScores("Approved", "Ovarian Cancer", "Womens Health"), marketData: generateMarketProjections("Bevacizumab-OC", "Approved", "Ovarian Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-VEGF antibody", administration: "IV infusion every 3 weeks", keyAdvantage: "Established antiangiogenic" }
  },
  {
    id: "wh-17", name: "Tisotumab Vedotin", phase: "Approved", indication: "Cervical Cancer", therapeuticArea: "Women's Health",
    company: "Seagen/Genmab", companyTrackRecord: 'fast', nctId: "NCT03438396",
    scores: calculateProbabilityScores("Approved", "Cervical Cancer", "Womens Health"), marketData: generateMarketProjections("Tisotumab Vedotin", "Approved", "Cervical Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TF-directed ADC", administration: "IV infusion every 3 weeks", keyAdvantage: "First ADC for cervical cancer" }
  },
  {
    id: "wh-18", name: "Pembrolizumab + Chemotherapy", phase: "Approved", indication: "Cervical Cancer", therapeuticArea: "Women's Health",
    company: "Merck", companyTrackRecord: 'fast', nctId: "NCT03635567",
    scores: calculateProbabilityScores("Approved", "Cervical Cancer", "Womens Health"), marketData: generateMarketProjections("Pembro-Cervical", "Approved", "Cervical Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-PD-1 + chemo", administration: "IV infusion", keyAdvantage: "IO backbone for cervical" }
  },
  {
    id: "wh-19", name: "Dostarlimab", phase: "Approved", indication: "dMMR Endometrial Cancer", therapeuticArea: "Women's Health",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT03981796",
    scores: calculateProbabilityScores("Approved", "Endometrial Cancer", "Womens Health"), marketData: generateMarketProjections("Dostarlimab", "Approved", "Endometrial Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-PD-1 antibody", administration: "IV infusion every 3-6 weeks", keyAdvantage: "dMMR biomarker selection" }
  },
  {
    id: "wh-20", name: "Lenvatinib + Pembrolizumab", phase: "Approved", indication: "Endometrial Cancer", therapeuticArea: "Women's Health",
    company: "Eisai/Merck", companyTrackRecord: 'fast', nctId: "NCT03517449",
    scores: calculateProbabilityScores("Approved", "Endometrial Cancer", "Womens Health"), marketData: generateMarketProjections("Lenva+Pembro-EC", "Approved", "Endometrial Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Multi-TKI + Anti-PD-1", administration: "Oral + IV", keyAdvantage: "Non-dMMR endometrial option" }
  },
  {
    id: "wh-21", name: "Selinexor", phase: "Phase II/III", indication: "Endometrial Cancer", therapeuticArea: "Women's Health",
    company: "Karyopharm", companyTrackRecord: 'average', nctId: "NCT03555422",
    scores: calculateProbabilityScores("Phase II", "Endometrial Cancer", "Womens Health"), marketData: generateMarketProjections("Selinexor-EC", "Phase II", "Endometrial Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "XPO1 inhibitor", administration: "Oral weekly", keyAdvantage: "Novel nuclear export target" }
  },
  {
    id: "wh-22", name: "Sacituzumab Govitecan", phase: "Phase III", indication: "Endometrial Cancer", therapeuticArea: "Women's Health",
    company: "Gilead", companyTrackRecord: 'fast', nctId: "NCT05597956",
    scores: calculateProbabilityScores("Phase III", "Endometrial Cancer", "Womens Health"), marketData: generateMarketProjections("SG-Endometrial", "Phase III", "Endometrial Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Trop-2 ADC", administration: "IV infusion", keyAdvantage: "ADC expanding into GYN cancers" }
  },
  {
    id: "wh-23", name: "Abemaciclib + Endocrine", phase: "Approved", indication: "HR+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT02107703",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Abemaciclib", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CDK4/6 inhibitor", administration: "Oral twice daily", keyAdvantage: "Continuous dosing, single-agent activity" }
  },
  {
    id: "wh-24", name: "Palbociclib", phase: "Approved", indication: "HR+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT01740427",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Palbociclib", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CDK4/6 inhibitor", administration: "Oral once daily 3 weeks on/1 off", keyAdvantage: "First CDK4/6i approved" }
  },
  {
    id: "wh-25", name: "Ribociclib", phase: "Approved", indication: "HR+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT01958021",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Ribociclib", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CDK4/6 inhibitor", administration: "Oral once daily 3 weeks on/1 off", keyAdvantage: "OS benefit demonstrated" }
  },
  {
    id: "wh-26", name: "Elacestrant", phase: "Approved", indication: "ESR1-mutant Breast Cancer", therapeuticArea: "Women's Health",
    company: "Menarini/Radius", companyTrackRecord: 'average', nctId: "NCT03778931",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Elacestrant", "Approved", "Breast Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral SERD", administration: "Oral once daily", keyAdvantage: "First oral SERD approved" }
  },
  {
    id: "wh-27", name: "Camizestrant", phase: "Phase III", indication: "ER+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT04964934",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Camizestrant", "Phase III", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Next-gen oral SERD", administration: "Oral once daily", keyAdvantage: "Improved efficacy vs fulvestrant" }
  },
  {
    id: "wh-28", name: "Imlunestrant", phase: "Phase III", indication: "ER+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT04975308",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Imlunestrant", "Phase III", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral SERD", administration: "Oral once daily", keyAdvantage: "CNS penetration" }
  },
  {
    id: "wh-29", name: "Capivasertib", phase: "Approved", indication: "HR+/HER2- Breast Cancer", therapeuticArea: "Women's Health",
    company: "AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT04305496",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Capivasertib-BC", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "AKT inhibitor", administration: "Oral 4 days on/3 off", keyAdvantage: "AKT pathway targeting" }
  },
  {
    id: "wh-30", name: "Inavolisib", phase: "Phase III", indication: "PIK3CA+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT04191499",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Inavolisib", "Phase III", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PI3Kα inhibitor", administration: "Oral once daily", keyAdvantage: "Selective PI3Kα, improved tolerability" }
  },
  {
    id: "wh-31", name: "Alpelisib", phase: "Approved", indication: "PIK3CA+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT02437318",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Alpelisib", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PI3Kα inhibitor", administration: "Oral once daily", keyAdvantage: "PIK3CA biomarker-selected" }
  },
  {
    id: "wh-32", name: "Trastuzumab Deruxtecan", phase: "Approved", indication: "HER2-low Breast Cancer", therapeuticArea: "Women's Health",
    company: "Daiichi Sankyo/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT03734029",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("T-DXd", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HER2-directed ADC", administration: "IV infusion every 3 weeks", keyAdvantage: "HER2-low expansion" }
  },
  {
    id: "wh-33", name: "Datopotamab Deruxtecan", phase: "Phase III", indication: "HR+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Daiichi Sankyo/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT05104866",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Dato-DXd", "Phase III", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Trop-2 ADC", administration: "IV infusion every 3 weeks", keyAdvantage: "Next-gen ADC platform" }
  },
  {
    id: "wh-34", name: "Patritumab Deruxtecan", phase: "Phase II/III", indication: "HER3+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Daiichi Sankyo", companyTrackRecord: 'fast', nctId: "NCT04699630",
    scores: calculateProbabilityScores("Phase II", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("HER3-DXd", "Phase II", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HER3-directed ADC", administration: "IV infusion", keyAdvantage: "Novel HER3 targeting" }
  },
  {
    id: "wh-35", name: "Neratinib", phase: "Approved", indication: "HER2+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Puma Biotechnology", companyTrackRecord: 'average', nctId: "NCT01808573",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Neratinib", "Approved", "Breast Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Pan-HER TKI", administration: "Oral once daily", keyAdvantage: "Extended adjuvant option" }
  },
  {
    id: "wh-36", name: "Tucatinib", phase: "Approved", indication: "HER2+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Seagen/Seattle Genetics", companyTrackRecord: 'fast', nctId: "NCT02614794",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Tucatinib", "Approved", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HER2-selective TKI", administration: "Oral twice daily", keyAdvantage: "CNS activity in brain mets" }
  },
  {
    id: "wh-37", name: "Margetuximab", phase: "Approved", indication: "HER2+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "MacroGenics", companyTrackRecord: 'average', nctId: "NCT02492711",
    scores: calculateProbabilityScores("Approved", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Margetuximab", "Approved", "Breast Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Fc-engineered anti-HER2", administration: "IV infusion every 3 weeks", keyAdvantage: "Enhanced ADCC" }
  },
  {
    id: "wh-38", name: "Utidelone", phase: "Phase III", indication: "Breast Cancer", therapeuticArea: "Women's Health",
    company: "Beijing Biostar", companyTrackRecord: 'average', nctId: "NCT03481998",
    scores: calculateProbabilityScores("Phase III", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Utidelone", "Phase III", "Breast Cancer", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Epothilone analog", administration: "IV infusion", keyAdvantage: "Taxane-resistant activity" }
  },
  {
    id: "wh-39", name: "Enfortumab Vedotin", phase: "Phase II", indication: "Breast Cancer", therapeuticArea: "Women's Health",
    company: "Seagen/Astellas", companyTrackRecord: 'fast', nctId: "NCT04225117",
    scores: calculateProbabilityScores("Phase II", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("EV-Breast", "Phase II", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Nectin-4 ADC", administration: "IV infusion", keyAdvantage: "ADC expanding to breast" }
  },
  {
    id: "wh-40", name: "Selpercatinib", phase: "Phase II", indication: "RET+ Breast Cancer", therapeuticArea: "Women's Health",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT04194944",
    scores: calculateProbabilityScores("Phase II", "Breast Cancer", "Womens Health"), marketData: generateMarketProjections("Selpercatinib-BC", "Phase II", "Breast Cancer", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "RET inhibitor", administration: "Oral twice daily", keyAdvantage: "RET fusion-targeted" }
  }
];
