// 60 Hematology/Blood Disorders Molecules
import { calculateProbabilityScores, generateMarketProjections } from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const hematologyMolecules: MoleculeProfile[] = [
  {
    id: "hem-1", name: "Imetelstat", phase: "Approved", indication: "Lower-Risk Myelodysplastic Syndromes", therapeuticArea: "Oncology/Hematology",
    company: "Geron Corporation", companyTrackRecord: 'average', nctId: "NCT02598661",
    scores: calculateProbabilityScores("Approved", "MDS", "Oncology"), marketData: generateMarketProjections("Imetelstat", "Approved", "MDS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Telomerase inhibitor", administration: "IV infusion every 4 weeks", keyAdvantage: "Novel MOA, transfusion independence" }
  },
  {
    id: "hem-2", name: "Luspatercept", phase: "Approved", indication: "Anemia in MDS/Beta-Thalassemia", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT02631070",
    scores: calculateProbabilityScores("Approved", "Anemia", "Oncology"), marketData: generateMarketProjections("Luspatercept", "Approved", "Anemia", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Erythroid maturation agent", administration: "SC injection every 3 weeks", keyAdvantage: "Reduces transfusion burden" }
  },
  {
    id: "hem-3", name: "Fitusiran", phase: "Phase III", indication: "Hemophilia A/B with Inhibitors", therapeuticArea: "Oncology/Hematology",
    company: "Sanofi", companyTrackRecord: 'fast', nctId: "NCT03417102",
    scores: calculateProbabilityScores("Phase III", "Hemophilia", "Hematology"), marketData: generateMarketProjections("Fitusiran", "Phase III", "Hemophilia", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Antithrombin siRNA", administration: "SC injection monthly", keyAdvantage: "Works regardless of inhibitor status" }
  },
  {
    id: "hem-4", name: "Concizumab", phase: "Phase III", indication: "Hemophilia A/B with/without Inhibitors", therapeuticArea: "Oncology/Hematology",
    company: "Novo Nordisk", companyTrackRecord: 'fast', nctId: "NCT03196284",
    scores: calculateProbabilityScores("Phase III", "Hemophilia", "Hematology"), marketData: generateMarketProjections("Concizumab", "Phase III", "Hemophilia", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-TFPI monoclonal antibody", administration: "SC injection daily", keyAdvantage: "Novel pathway targeting" }
  },
  {
    id: "hem-5", name: "Mim8", phase: "Phase III", indication: "Hemophilia A", therapeuticArea: "Oncology/Hematology",
    company: "Novo Nordisk", companyTrackRecord: 'fast', nctId: "NCT05053139",
    scores: calculateProbabilityScores("Phase III", "Hemophilia", "Hematology"), marketData: generateMarketProjections("Mim8", "Phase III", "Hemophilia", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Next-gen FVIII mimetic bispecific", administration: "SC injection monthly", keyAdvantage: "Monthly dosing, better ABR" }
  },
  {
    id: "hem-6", name: "Sutimlimab", phase: "Approved", indication: "Cold Agglutinin Disease", therapeuticArea: "Oncology/Hematology",
    company: "Sanofi", companyTrackRecord: 'fast', nctId: "NCT03347396",
    scores: calculateProbabilityScores("Approved", "CAD", "Hematology"), marketData: generateMarketProjections("Sutimlimab", "Approved", "CAD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "C1s complement inhibitor", administration: "IV infusion biweekly", keyAdvantage: "First approved therapy for CAD" }
  },
  {
    id: "hem-7", name: "Pegcetacoplan", phase: "Approved", indication: "Paroxysmal Nocturnal Hemoglobinuria", therapeuticArea: "Oncology/Hematology",
    company: "Apellis Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT03500549",
    scores: calculateProbabilityScores("Approved", "PNH", "Hematology"), marketData: generateMarketProjections("Pegcetacoplan", "Approved", "PNH", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "C3 complement inhibitor", administration: "SC injection twice weekly", keyAdvantage: "Targets proximal complement" }
  },
  {
    id: "hem-8", name: "Iptacopan", phase: "Approved", indication: "Paroxysmal Nocturnal Hemoglobinuria", therapeuticArea: "Oncology/Hematology",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT04558918",
    scores: calculateProbabilityScores("Approved", "PNH", "Hematology"), marketData: generateMarketProjections("Iptacopan", "Approved", "PNH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Factor B inhibitor", administration: "Oral twice daily", keyAdvantage: "First oral complement inhibitor for PNH" }
  },
  {
    id: "hem-9", name: "Voxelotor", phase: "Approved", indication: "Sickle Cell Disease", therapeuticArea: "Oncology/Hematology",
    company: "Pfizer (via Global Blood)", companyTrackRecord: 'fast', nctId: "NCT03036813",
    scores: calculateProbabilityScores("Approved", "Sickle Cell", "Hematology"), marketData: generateMarketProjections("Voxelotor", "Approved", "Sickle Cell", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "HbS polymerization inhibitor", administration: "Oral once daily", keyAdvantage: "Increases hemoglobin levels" }
  },
  {
    id: "hem-10", name: "Crizanlizumab", phase: "Approved", indication: "Sickle Cell Disease (VOC prevention)", therapeuticArea: "Oncology/Hematology",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT02187003",
    scores: calculateProbabilityScores("Approved", "Sickle Cell", "Hematology"), marketData: generateMarketProjections("Crizanlizumab", "Approved", "Sickle Cell", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-P-selectin antibody", administration: "IV infusion monthly", keyAdvantage: "Reduces vaso-occlusive crises" }
  },
  {
    id: "hem-11", name: "Inclacumab", phase: "Phase III", indication: "Sickle Cell Disease", therapeuticArea: "Oncology/Hematology",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT03814746",
    scores: calculateProbabilityScores("Phase III", "Sickle Cell", "Hematology"), marketData: generateMarketProjections("Inclacumab", "Phase III", "Sickle Cell", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-P-selectin antibody", administration: "SC injection", keyAdvantage: "SC convenience vs IV" }
  },
  {
    id: "hem-12", name: "Mitapivat", phase: "Approved", indication: "Pyruvate Kinase Deficiency", therapeuticArea: "Oncology/Hematology",
    company: "Agios/Sobi", companyTrackRecord: 'average', nctId: "NCT03559699",
    scores: calculateProbabilityScores("Approved", "PKD", "Hematology"), marketData: generateMarketProjections("Mitapivat", "Approved", "PKD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Pyruvate kinase activator", administration: "Oral twice daily", keyAdvantage: "First disease-modifying therapy for PKD" }
  },
  {
    id: "hem-13", name: "Etranacogene Dezaparvovec", phase: "Approved", indication: "Hemophilia B", therapeuticArea: "Oncology/Hematology",
    company: "CSL Behring/uniQure", companyTrackRecord: 'fast', nctId: "NCT03569891",
    scores: calculateProbabilityScores("Approved", "Hemophilia B", "Hematology"), marketData: generateMarketProjections("Etranacogene", "Approved", "Hemophilia B", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "AAV5-FIX gene therapy", administration: "One-time IV infusion", keyAdvantage: "One-time potentially curative treatment" }
  },
  {
    id: "hem-14", name: "Valoctocogene Roxaparvovec", phase: "Approved", indication: "Hemophilia A", therapeuticArea: "Oncology/Hematology",
    company: "BioMarin", companyTrackRecord: 'average', nctId: "NCT03370913",
    scores: calculateProbabilityScores("Approved", "Hemophilia A", "Hematology"), marketData: generateMarketProjections("Valoctocogene", "Approved", "Hemophilia A", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "AAV5-FVIII gene therapy", administration: "One-time IV infusion", keyAdvantage: "Potential cure for hemophilia A" }
  },
  {
    id: "hem-15", name: "Lovotibeglogene Autotemcel", phase: "Approved", indication: "Sickle Cell Disease", therapeuticArea: "Oncology/Hematology",
    company: "Bluebird Bio", companyTrackRecord: 'slow', nctId: "NCT02140554",
    scores: calculateProbabilityScores("Approved", "Sickle Cell", "Hematology"), marketData: generateMarketProjections("Lovo-cel", "Approved", "Sickle Cell", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Lentiviral gene therapy", administration: "One-time autologous infusion", keyAdvantage: "Potential cure for SCD" }
  },
  {
    id: "hem-16", name: "Exagamglogene Autotemcel", phase: "Approved", indication: "Sickle Cell Disease/TDT", therapeuticArea: "Oncology/Hematology",
    company: "Vertex/CRISPR Therapeutics", companyTrackRecord: 'fast', nctId: "NCT03745287",
    scores: calculateProbabilityScores("Approved", "Sickle Cell", "Hematology"), marketData: generateMarketProjections("Exa-cel", "Approved", "Sickle Cell", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CRISPR/Cas9 gene editing", administration: "One-time autologous infusion", keyAdvantage: "First approved CRISPR therapy" }
  },
  {
    id: "hem-17", name: "Betibeglogene Autotemcel", phase: "Approved", indication: "Transfusion-Dependent Thalassemia", therapeuticArea: "Oncology/Hematology",
    company: "Bluebird Bio", companyTrackRecord: 'slow', nctId: "NCT02906202",
    scores: calculateProbabilityScores("Approved", "TDT", "Hematology"), marketData: generateMarketProjections("Beti-cel", "Approved", "TDT", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Lentiviral gene therapy", administration: "One-time autologous infusion", keyAdvantage: "Transfusion independence" }
  },
  {
    id: "hem-18", name: "Rusfertide", phase: "Phase III", indication: "Polycythemia Vera", therapeuticArea: "Oncology/Hematology",
    company: "Protagonist Therapeutics", companyTrackRecord: 'average', nctId: "NCT04057040",
    scores: calculateProbabilityScores("Phase III", "PV", "Hematology"), marketData: generateMarketProjections("Rusfertide", "Phase III", "PV", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Hepcidin mimetic", administration: "SC injection weekly", keyAdvantage: "Controls hematocrit without phlebotomy" }
  },
  {
    id: "hem-19", name: "Momelotinib", phase: "Approved", indication: "Myelofibrosis with Anemia", therapeuticArea: "Oncology/Hematology",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT02101268",
    scores: calculateProbabilityScores("Approved", "Myelofibrosis", "Hematology"), marketData: generateMarketProjections("Momelotinib", "Approved", "Myelofibrosis", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "JAK1/2 + ACVR1 inhibitor", administration: "Oral once daily", keyAdvantage: "Addresses anemia in MF" }
  },
  {
    id: "hem-20", name: "Pacritinib", phase: "Approved", indication: "Myelofibrosis with Severe Thrombocytopenia", therapeuticArea: "Oncology/Hematology",
    company: "CTI BioPharma", companyTrackRecord: 'slow', nctId: "NCT02055781",
    scores: calculateProbabilityScores("Approved", "Myelofibrosis", "Hematology"), marketData: generateMarketProjections("Pacritinib", "Approved", "Myelofibrosis", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "JAK2/IRAK1 inhibitor", administration: "Oral twice daily", keyAdvantage: "Safe with low platelets" }
  },
  {
    id: "hem-21", name: "Navitoclax", phase: "Phase III", indication: "Myelofibrosis", therapeuticArea: "Oncology/Hematology",
    company: "AbbVie", companyTrackRecord: 'fast', nctId: "NCT04472598",
    scores: calculateProbabilityScores("Phase III", "Myelofibrosis", "Hematology"), marketData: generateMarketProjections("Navitoclax", "Phase III", "Myelofibrosis", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCL-2/BCL-XL inhibitor", administration: "Oral once daily", keyAdvantage: "Combination with ruxolitinib" }
  },
  {
    id: "hem-22", name: "Selinexor", phase: "Approved", indication: "Multiple Myeloma/DLBCL", therapeuticArea: "Oncology/Hematology",
    company: "Karyopharm", companyTrackRecord: 'average', nctId: "NCT02336815",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Selinexor", "Approved", "MM", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "XPO1 inhibitor", administration: "Oral once weekly", keyAdvantage: "Novel nuclear export inhibition" }
  },
  {
    id: "hem-23", name: "Belantamab Mafodotin", phase: "Approved", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "GSK", companyTrackRecord: 'fast', nctId: "NCT03525678",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Blenrep", "Approved", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA-directed ADC", administration: "IV infusion every 3 weeks", keyAdvantage: "BCMA targeting" }
  },
  {
    id: "hem-24", name: "Ciltacabtagene Autoleucel", phase: "Approved", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT03548207",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Cilta-cel", "Approved", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "Deep durable responses" }
  },
  {
    id: "hem-25", name: "Idecabtagene Vicleucel", phase: "Approved", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT03361748",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Ide-cel", "Approved", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "First BCMA CAR-T approved" }
  },
  {
    id: "hem-26", name: "Teclistamab", phase: "Approved", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT04557098",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Teclistamab", "Approved", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA x CD3 bispecific", administration: "SC weekly then biweekly", keyAdvantage: "Off-the-shelf bispecific" }
  },
  {
    id: "hem-27", name: "Talquetamab", phase: "Approved", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT03399799",
    scores: calculateProbabilityScores("Approved", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Talquetamab", "Approved", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GPRC5D x CD3 bispecific", administration: "SC weekly then biweekly", keyAdvantage: "Novel GPRC5D target" }
  },
  {
    id: "hem-28", name: "Iberdomide", phase: "Phase III", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT04975997",
    scores: calculateProbabilityScores("Phase III", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Iberdomide", "Phase III", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CELMoD (cereblon E3 ligase modulator)", administration: "Oral once daily", keyAdvantage: "More potent than lenalidomide" }
  },
  {
    id: "hem-29", name: "Mezigdomide", phase: "Phase III", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT05519085",
    scores: calculateProbabilityScores("Phase III", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Mezigdomide", "Phase III", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CELMoD", administration: "Oral once daily", keyAdvantage: "Works in IMiD-refractory patients" }
  },
  {
    id: "hem-30", name: "Linvoseltamab", phase: "Phase III", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Regeneron", companyTrackRecord: 'fast', nctId: "NCT05730036",
    scores: calculateProbabilityScores("Phase III", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Linvoseltamab", "Phase III", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA x CD3 bispecific", administration: "IV infusion", keyAdvantage: "High response rates" }
  },
  {
    id: "hem-31", name: "Alnuctamab", phase: "Phase II", indication: "Relapsed Multiple Myeloma", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT03486067",
    scores: calculateProbabilityScores("Phase II", "Multiple Myeloma", "Hematology"), marketData: generateMarketProjections("Alnuctamab", "Phase II", "MM", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCMA x CD3 bispecific", administration: "SC injection", keyAdvantage: "Differentiated dosing" }
  },
  {
    id: "hem-32", name: "Bomedemstat", phase: "Phase III", indication: "Essential Thrombocythemia", therapeuticArea: "Oncology/Hematology",
    company: "Imago BioSciences/Merck", companyTrackRecord: 'fast', nctId: "NCT04254978",
    scores: calculateProbabilityScores("Phase III", "ET", "Hematology"), marketData: generateMarketProjections("Bomedemstat", "Phase III", "ET", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "LSD1 inhibitor", administration: "Oral once daily", keyAdvantage: "Novel epigenetic approach" }
  },
  {
    id: "hem-33", name: "Pelabresib", phase: "Phase III", indication: "Myelofibrosis", therapeuticArea: "Oncology/Hematology",
    company: "Morphic Therapeutic", companyTrackRecord: 'average', nctId: "NCT04603495",
    scores: calculateProbabilityScores("Phase III", "Myelofibrosis", "Hematology"), marketData: generateMarketProjections("Pelabresib", "Phase III", "MF", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BET inhibitor", administration: "Oral once daily", keyAdvantage: "Epigenetic + JAKi combination" }
  },
  {
    id: "hem-34", name: "Danicopan", phase: "Phase III", indication: "Paroxysmal Nocturnal Hemoglobinuria", therapeuticArea: "Oncology/Hematology",
    company: "Alexion/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT04469465",
    scores: calculateProbabilityScores("Phase III", "PNH", "Hematology"), marketData: generateMarketProjections("Danicopan", "Phase III", "PNH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Factor D inhibitor", administration: "Oral twice daily", keyAdvantage: "Add-on to C5 inhibitors" }
  },
  {
    id: "hem-35", name: "Crovalimab", phase: "Phase III", indication: "Paroxysmal Nocturnal Hemoglobinuria", therapeuticArea: "Oncology/Hematology",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT04654468",
    scores: calculateProbabilityScores("Phase III", "PNH", "Hematology"), marketData: generateMarketProjections("Crovalimab", "Phase III", "PNH", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-C5 recycling antibody", administration: "SC monthly", keyAdvantage: "Monthly SC dosing" }
  },
  {
    id: "hem-36", name: "BIVV001", phase: "Phase III", indication: "Hemophilia A", therapeuticArea: "Oncology/Hematology",
    company: "Sanofi", companyTrackRecord: 'fast', nctId: "NCT04161495",
    scores: calculateProbabilityScores("Phase III", "Hemophilia A", "Hematology"), marketData: generateMarketProjections("BIVV001", "Phase III", "Hemophilia A", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Extended half-life FVIII", administration: "IV weekly", keyAdvantage: "Once-weekly factor replacement" }
  },
  {
    id: "hem-37", name: "Giroctocogene Fitelparvovec", phase: "Phase III", indication: "Hemophilia A", therapeuticArea: "Oncology/Hematology",
    company: "Pfizer/Spark", companyTrackRecord: 'fast', nctId: "NCT03587116",
    scores: calculateProbabilityScores("Phase III", "Hemophilia A", "Hematology"), marketData: generateMarketProjections("Giroctocogene", "Phase III", "Hemophilia A", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "AAV6 FVIII gene therapy", administration: "One-time IV infusion", keyAdvantage: "Durable factor levels" }
  },
  {
    id: "hem-38", name: "Verbrinacimab", phase: "Phase II", indication: "Warm Autoimmune Hemolytic Anemia", therapeuticArea: "Oncology/Hematology",
    company: "Alexion/AstraZeneca", companyTrackRecord: 'fast', nctId: "NCT05383677",
    scores: calculateProbabilityScores("Phase II", "wAIHA", "Hematology"), marketData: generateMarketProjections("Verbrinacimab", "Phase II", "wAIHA", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-C1s antibody", administration: "IV infusion", keyAdvantage: "Complement inhibition for AIHA" }
  },
  {
    id: "hem-39", name: "Parsaclisib", phase: "Phase II", indication: "Myelofibrosis", therapeuticArea: "Oncology/Hematology",
    company: "Incyte", companyTrackRecord: 'average', nctId: "NCT02718300",
    scores: calculateProbabilityScores("Phase II", "Myelofibrosis", "Hematology"), marketData: generateMarketProjections("Parsaclisib", "Phase II", "MF", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "PI3K delta inhibitor", administration: "Oral once daily", keyAdvantage: "Combination with JAKi" }
  },
  {
    id: "hem-40", name: "KER-050", phase: "Phase II", indication: "Anemia in MDS", therapeuticArea: "Oncology/Hematology",
    company: "Keros Therapeutics", companyTrackRecord: 'average', nctId: "NCT04419649",
    scores: calculateProbabilityScores("Phase II", "MDS Anemia", "Hematology"), marketData: generateMarketProjections("KER-050", "Phase II", "MDS", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Modified ActRIIA ligand trap", administration: "SC injection every 3 weeks", keyAdvantage: "Bone-sparing erythroid agent" }
  },
  {
    id: "hem-41", name: "Tolebrutinib", phase: "Phase II", indication: "Chronic Graft-vs-Host Disease", therapeuticArea: "Oncology/Hematology",
    company: "Sanofi", companyTrackRecord: 'fast', nctId: "NCT03836677",
    scores: calculateProbabilityScores("Phase II", "cGVHD", "Hematology"), marketData: generateMarketProjections("Tolebrutinib", "Phase II", "cGVHD", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Brain-penetrant BTKi", administration: "Oral once daily", keyAdvantage: "CNS activity potential" }
  },
  {
    id: "hem-42", name: "Axatilimab", phase: "Phase II/III", indication: "Chronic Graft-vs-Host Disease", therapeuticArea: "Oncology/Hematology",
    company: "Syndax", companyTrackRecord: 'average', nctId: "NCT04710576",
    scores: calculateProbabilityScores("Phase II", "cGVHD", "Hematology"), marketData: generateMarketProjections("Axatilimab", "Phase II", "cGVHD", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CSF-1R antibody", administration: "IV infusion every 2 weeks", keyAdvantage: "Novel macrophage targeting" }
  },
  {
    id: "hem-43", name: "Magrolimab", phase: "Phase III", indication: "Myelodysplastic Syndromes", therapeuticArea: "Oncology/Hematology",
    company: "Gilead", companyTrackRecord: 'fast', nctId: "NCT04313881",
    scores: calculateProbabilityScores("Phase III", "MDS", "Hematology"), marketData: generateMarketProjections("Magrolimab", "Phase III", "MDS", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CD47 antibody", administration: "IV infusion weekly", keyAdvantage: "Novel 'don't eat me' signal block" }
  },
  {
    id: "hem-44", name: "Evorpacept", phase: "Phase II", indication: "Solid Tumors/Hematologic", therapeuticArea: "Oncology/Hematology",
    company: "ALX Oncology", companyTrackRecord: 'average', nctId: "NCT03013218",
    scores: calculateProbabilityScores("Phase II", "Hematologic Malignancies", "Hematology"), marketData: generateMarketProjections("Evorpacept", "Phase II", "Hematology", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CD47 blocker (SIRPα-Fc fusion)", administration: "IV infusion weekly", keyAdvantage: "Enhanced phagocytosis" }
  },
  {
    id: "hem-45", name: "Revumenib", phase: "Phase II", indication: "KMT2A-rearranged Leukemia", therapeuticArea: "Oncology/Hematology",
    company: "Syndax", companyTrackRecord: 'average', nctId: "NCT04065399",
    scores: calculateProbabilityScores("Phase II", "AML", "Hematology"), marketData: generateMarketProjections("Revumenib", "Phase II", "AML", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Menin inhibitor", administration: "Oral twice daily", keyAdvantage: "First menin inhibitor for KMT2A AML" }
  },
  {
    id: "hem-46", name: "Ziftomenib", phase: "Phase II", indication: "NPM1-mutant AML", therapeuticArea: "Oncology/Hematology",
    company: "Kura Oncology", companyTrackRecord: 'average', nctId: "NCT04067336",
    scores: calculateProbabilityScores("Phase II", "AML", "Hematology"), marketData: generateMarketProjections("Ziftomenib", "Phase II", "AML", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Menin inhibitor", administration: "Oral once daily", keyAdvantage: "High response in NPM1-mutant" }
  },
  {
    id: "hem-47", name: "Uproleselan", phase: "Phase III", indication: "Relapsed AML", therapeuticArea: "Oncology/Hematology",
    company: "GlycoMimetics", companyTrackRecord: 'slow', nctId: "NCT03616470",
    scores: calculateProbabilityScores("Phase III", "AML", "Hematology"), marketData: generateMarketProjections("Uproleselan", "Phase III", "AML", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "E-selectin antagonist", administration: "IV infusion", keyAdvantage: "Overcomes chemo-resistance" }
  },
  {
    id: "hem-48", name: "Ivosidenib", phase: "Approved", indication: "IDH1-mutant AML", therapeuticArea: "Oncology/Hematology",
    company: "Servier/Agios", companyTrackRecord: 'fast', nctId: "NCT02074839",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Ivosidenib", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IDH1 inhibitor", administration: "Oral once daily", keyAdvantage: "Targeted therapy for IDH1 mutation" }
  },
  {
    id: "hem-49", name: "Olutasidenib", phase: "Approved", indication: "IDH1-mutant AML", therapeuticArea: "Oncology/Hematology",
    company: "Rigel", companyTrackRecord: 'average', nctId: "NCT02719574",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Olutasidenib", "Approved", "AML", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IDH1 inhibitor", administration: "Oral twice daily", keyAdvantage: "IDH1-targeted alternative" }
  },
  {
    id: "hem-50", name: "Enasidenib", phase: "Approved", indication: "IDH2-mutant AML", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT01915498",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Enasidenib", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IDH2 inhibitor", administration: "Oral once daily", keyAdvantage: "First IDH2 inhibitor approved" }
  },
  {
    id: "hem-51", name: "Quizartinib", phase: "Approved", indication: "FLT3-ITD+ AML", therapeuticArea: "Oncology/Hematology",
    company: "Daiichi Sankyo", companyTrackRecord: 'fast', nctId: "NCT02668653",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Quizartinib", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Type II FLT3 inhibitor", administration: "Oral once daily", keyAdvantage: "High potency FLT3 inhibition" }
  },
  {
    id: "hem-52", name: "Gilteritinib", phase: "Approved", indication: "FLT3-mutant AML", therapeuticArea: "Oncology/Hematology",
    company: "Astellas", companyTrackRecord: 'fast', nctId: "NCT02421939",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Gilteritinib", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FLT3/AXL inhibitor", administration: "Oral once daily", keyAdvantage: "Covers ITD and TKD mutations" }
  },
  {
    id: "hem-53", name: "Venetoclax", phase: "Approved", indication: "AML/CLL", therapeuticArea: "Oncology/Hematology",
    company: "AbbVie/Roche", companyTrackRecord: 'fast', nctId: "NCT02993523",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Venetoclax", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "BCL-2 inhibitor", administration: "Oral once daily", keyAdvantage: "Game-changer in elderly AML" }
  },
  {
    id: "hem-54", name: "Glasdegib", phase: "Approved", indication: "AML", therapeuticArea: "Oncology/Hematology",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT01546038",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Glasdegib", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Hedgehog pathway inhibitor", administration: "Oral once daily", keyAdvantage: "Novel pathway targeting" }
  },
  {
    id: "hem-55", name: "Midostaurin", phase: "Approved", indication: "FLT3+ AML", therapeuticArea: "Oncology/Hematology",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT00651261",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Midostaurin", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Multi-kinase inhibitor", administration: "Oral twice daily", keyAdvantage: "First FLT3 inhibitor approved" }
  },
  {
    id: "hem-56", name: "Oral Azacitidine", phase: "Approved", indication: "AML Maintenance", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT01757535",
    scores: calculateProbabilityScores("Approved", "AML", "Hematology"), marketData: generateMarketProjections("Oral Aza", "Approved", "AML", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Hypomethylating agent", administration: "Oral once daily x 14/28 days", keyAdvantage: "First AML maintenance therapy" }
  },
  {
    id: "hem-57", name: "Brexucabtagene Autoleucel", phase: "Approved", indication: "ALL/MCL", therapeuticArea: "Oncology/Hematology",
    company: "Gilead/Kite", companyTrackRecord: 'fast', nctId: "NCT02614066",
    scores: calculateProbabilityScores("Approved", "ALL", "Hematology"), marketData: generateMarketProjections("Brexu-cel", "Approved", "ALL", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CD19-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "First CAR-T for MCL" }
  },
  {
    id: "hem-58", name: "Tisagenlecleucel", phase: "Approved", indication: "ALL/DLBCL", therapeuticArea: "Oncology/Hematology",
    company: "Novartis", companyTrackRecord: 'fast', nctId: "NCT02435849",
    scores: calculateProbabilityScores("Approved", "ALL", "Hematology"), marketData: generateMarketProjections("Kymriah", "Approved", "ALL", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CD19-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "First CAR-T approved" }
  },
  {
    id: "hem-59", name: "Axicabtagene Ciloleucel", phase: "Approved", indication: "DLBCL/FL", therapeuticArea: "Oncology/Hematology",
    company: "Gilead/Kite", companyTrackRecord: 'fast', nctId: "NCT02348216",
    scores: calculateProbabilityScores("Approved", "DLBCL", "Hematology"), marketData: generateMarketProjections("Axi-cel", "Approved", "DLBCL", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CD19-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "Rapid manufacturing" }
  },
  {
    id: "hem-60", name: "Lisocabtagene Maraleucel", phase: "Approved", indication: "DLBCL", therapeuticArea: "Oncology/Hematology",
    company: "Bristol-Myers Squibb", companyTrackRecord: 'fast', nctId: "NCT02631044",
    scores: calculateProbabilityScores("Approved", "DLBCL", "Hematology"), marketData: generateMarketProjections("Liso-cel", "Approved", "DLBCL", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CD19-directed CAR-T", administration: "One-time IV infusion", keyAdvantage: "Defined CD4:CD8 ratio" }
  }
];
