// 50 Pain/Analgesia Molecules
import { calculateProbabilityScores, generateMarketProjections } from './scoring';
import { type MoleculeProfile } from './moleculesData';

export const painMolecules: MoleculeProfile[] = [
  {
    id: "pain-1", name: "Tanezumab", phase: "Phase III", indication: "Chronic Pain (OA/CLBP)", therapeuticArea: "Pain/Analgesia",
    company: "Pfizer/Lilly", companyTrackRecord: 'fast', nctId: "NCT02709486",
    scores: calculateProbabilityScores("Phase III", "Chronic Pain", "Pain"), marketData: generateMarketProjections("Tanezumab", "Phase III", "Chronic Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-NGF antibody", administration: "SC injection every 8 weeks", keyAdvantage: "Non-opioid mechanism for chronic pain" }
  },
  {
    id: "pain-2", name: "Fasinumab", phase: "Phase III", indication: "Osteoarthritis Pain", therapeuticArea: "Pain/Analgesia",
    company: "Regeneron/Teva", companyTrackRecord: 'average', nctId: "NCT02447276",
    scores: calculateProbabilityScores("Phase III", "OA Pain", "Pain"), marketData: generateMarketProjections("Fasinumab", "Phase III", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-NGF antibody", administration: "SC injection monthly", keyAdvantage: "NGF pathway targeting" }
  },
  {
    id: "pain-3", name: "Suzetrigine", phase: "Phase III", indication: "Acute Pain", therapeuticArea: "Pain/Analgesia",
    company: "Vertex", companyTrackRecord: 'fast', nctId: "NCT05660083",
    scores: calculateProbabilityScores("Phase III", "Acute Pain", "Pain"), marketData: generateMarketProjections("Suzetrigine", "Phase III", "Acute Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NaV1.8 inhibitor", administration: "Oral", keyAdvantage: "Novel non-opioid for acute pain" }
  },
  {
    id: "pain-4", name: "VX-548", phase: "Phase III", indication: "Neuropathic Pain/Acute Pain", therapeuticArea: "Pain/Analgesia",
    company: "Vertex", companyTrackRecord: 'fast', nctId: "NCT05095597",
    scores: calculateProbabilityScores("Phase III", "Acute Pain", "Pain"), marketData: generateMarketProjections("VX-548", "Phase III", "Acute Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NaV1.8 inhibitor", administration: "Oral twice daily", keyAdvantage: "Peripheral sodium channel targeting" }
  },
  {
    id: "pain-5", name: "Resiniferatoxin", phase: "Phase II", indication: "Cancer Pain", therapeuticArea: "Pain/Analgesia",
    company: "Sorrento Therapeutics", companyTrackRecord: 'slow', nctId: "NCT02522611",
    scores: calculateProbabilityScores("Phase II", "Cancer Pain", "Pain"), marketData: generateMarketProjections("RTX", "Phase II", "Cancer Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TRPV1 agonist", administration: "Intrathecal injection", keyAdvantage: "Permanent pain fiber ablation" }
  },
  {
    id: "pain-6", name: "Oliceridine", phase: "Approved", indication: "Acute Pain (Moderate-Severe)", therapeuticArea: "Pain/Analgesia",
    company: "Trevena", companyTrackRecord: 'slow', nctId: "NCT02815709",
    scores: calculateProbabilityScores("Approved", "Acute Pain", "Pain"), marketData: generateMarketProjections("Oliceridine", "Approved", "Acute Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Biased mu-opioid agonist", administration: "IV bolus PRN", keyAdvantage: "Reduced respiratory depression vs morphine" }
  },
  {
    id: "pain-7", name: "Difelikefalin", phase: "Approved", indication: "CKD-Associated Pruritus", therapeuticArea: "Pain/Analgesia",
    company: "Vifor/CSL", companyTrackRecord: 'average', nctId: "NCT03422653",
    scores: calculateProbabilityScores("Approved", "Pruritus", "Pain"), marketData: generateMarketProjections("Difelikefalin", "Approved", "Pruritus", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Kappa opioid agonist", administration: "IV post-dialysis", keyAdvantage: "Peripheral kappa activation, no CNS effects" }
  },
  {
    id: "pain-8", name: "Fremanezumab", phase: "Approved", indication: "Migraine Prevention", therapeuticArea: "Pain/Analgesia",
    company: "Teva", companyTrackRecord: 'average', nctId: "NCT02629861",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Fremanezumab", "Approved", "Migraine", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CGRP antibody", administration: "SC monthly or quarterly", keyAdvantage: "Quarterly dosing option" }
  },
  {
    id: "pain-9", name: "Galcanezumab", phase: "Approved", indication: "Migraine/Cluster Headache", therapeuticArea: "Pain/Analgesia",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT02614183",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Galcanezumab", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CGRP antibody", administration: "SC monthly", keyAdvantage: "First for episodic cluster headache" }
  },
  {
    id: "pain-10", name: "Erenumab", phase: "Approved", indication: "Migraine Prevention", therapeuticArea: "Pain/Analgesia",
    company: "Amgen/Novartis", companyTrackRecord: 'fast', nctId: "NCT02066415",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Erenumab", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CGRP receptor antagonist", administration: "SC monthly", keyAdvantage: "First FDA-approved anti-CGRP" }
  },
  {
    id: "pain-11", name: "Eptinezumab", phase: "Approved", indication: "Migraine Prevention", therapeuticArea: "Pain/Analgesia",
    company: "Lundbeck", companyTrackRecord: 'average', nctId: "NCT02559895",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Eptinezumab", "Approved", "Migraine", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-CGRP antibody", administration: "IV quarterly", keyAdvantage: "Only IV CGRP mAb, rapid onset" }
  },
  {
    id: "pain-12", name: "Atogepant", phase: "Approved", indication: "Migraine Prevention", therapeuticArea: "Pain/Analgesia",
    company: "AbbVie/Allergan", companyTrackRecord: 'fast', nctId: "NCT03700320",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Atogepant", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral CGRP receptor antagonist", administration: "Oral once daily", keyAdvantage: "Oral preventive option" }
  },
  {
    id: "pain-13", name: "Rimegepant", phase: "Approved", indication: "Migraine Acute/Prevention", therapeuticArea: "Pain/Analgesia",
    company: "Biohaven/Pfizer", companyTrackRecord: 'fast', nctId: "NCT03461757",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Rimegepant", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral CGRP receptor antagonist", administration: "ODT PRN or every other day", keyAdvantage: "Dual acute/preventive approval" }
  },
  {
    id: "pain-14", name: "Ubrogepant", phase: "Approved", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "AbbVie/Allergan", companyTrackRecord: 'fast', nctId: "NCT02828020",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Ubrogepant", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Oral CGRP receptor antagonist", administration: "Oral PRN", keyAdvantage: "First oral gepant for acute migraine" }
  },
  {
    id: "pain-15", name: "Zavegepant", phase: "Approved", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "Biohaven/Pfizer", companyTrackRecord: 'fast', nctId: "NCT04571060",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Zavegepant", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Intranasal CGRP antagonist", administration: "Nasal spray PRN", keyAdvantage: "First intranasal gepant" }
  },
  {
    id: "pain-16", name: "Lasmiditan", phase: "Approved", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT02439320",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Lasmiditan", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "5-HT1F agonist (ditan)", administration: "Oral PRN", keyAdvantage: "No vasoconstriction, CV-safe" }
  },
  {
    id: "pain-17", name: "Celecoxib (Migraine)", phase: "Phase II", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Phase II", "Migraine", "Pain"), marketData: generateMarketProjections("Celecoxib-Migraine", "Phase II", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "COX-2 inhibitor", administration: "Oral", keyAdvantage: "Repurposed NSAID" }
  },
  {
    id: "pain-18", name: "Capsaicin 8% Patch", phase: "Approved", indication: "Neuropathic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Averitas/Grünenthal", companyTrackRecord: 'average', nctId: "NCT00468390",
    scores: calculateProbabilityScores("Approved", "Neuropathic Pain", "Pain"), marketData: generateMarketProjections("Qutenza", "Approved", "Neuropathic Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "TRPV1 agonist patch", administration: "Topical application 60 min", keyAdvantage: "3-month duration from single application" }
  },
  {
    id: "pain-19", name: "Pregabalin CR", phase: "Approved", indication: "Neuropathic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Pfizer", companyTrackRecord: 'fast', nctId: "NCT00159679",
    scores: calculateProbabilityScores("Approved", "Neuropathic Pain", "Pain"), marketData: generateMarketProjections("Pregabalin CR", "Approved", "Neuropathic Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Alpha-2-delta ligand", administration: "Oral once daily", keyAdvantage: "Extended-release convenience" }
  },
  {
    id: "pain-20", name: "Duloxetine", phase: "Approved", indication: "DPNP/Fibromyalgia/CLBP", therapeuticArea: "Pain/Analgesia",
    company: "Eli Lilly", companyTrackRecord: 'fast', nctId: "NCT00037648",
    scores: calculateProbabilityScores("Approved", "Neuropathic Pain", "Pain"), marketData: generateMarketProjections("Duloxetine", "Approved", "Neuropathic Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "SNRI", administration: "Oral once daily", keyAdvantage: "Broad chronic pain indications" }
  },
  {
    id: "pain-21", name: "Tapentadol", phase: "Approved", indication: "Chronic Pain/Neuropathic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Johnson & Johnson", companyTrackRecord: 'fast', nctId: "NCT00421928",
    scores: calculateProbabilityScores("Approved", "Chronic Pain", "Pain"), marketData: generateMarketProjections("Tapentadol", "Approved", "Chronic Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "MOR agonist/NRI", administration: "Oral twice daily (ER)", keyAdvantage: "Dual mechanism, reduced GI effects" }
  },
  {
    id: "pain-22", name: "Buprenorphine TD", phase: "Approved", indication: "Chronic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Purdue", companyTrackRecord: 'slow', nctId: "NCT00337935",
    scores: calculateProbabilityScores("Approved", "Chronic Pain", "Pain"), marketData: generateMarketProjections("Buprenorphine Patch", "Approved", "Chronic Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Partial mu agonist", administration: "Weekly transdermal patch", keyAdvantage: "Ceiling effect on respiratory depression" }
  },
  {
    id: "pain-23", name: "Abuse-Deterrent Oxycodone", phase: "Approved", indication: "Chronic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Purdue", companyTrackRecord: 'slow', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Chronic Pain", "Pain"), marketData: generateMarketProjections("AD Oxycodone", "Approved", "Chronic Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Opioid with AD properties", administration: "Oral", keyAdvantage: "Reduced abuse potential" }
  },
  {
    id: "pain-24", name: "Lidocaine Topical System", phase: "Approved", indication: "PHN/Localized Pain", therapeuticArea: "Pain/Analgesia",
    company: "Endo/Scilex", companyTrackRecord: 'average', nctId: "NCT02092506",
    scores: calculateProbabilityScores("Approved", "Neuropathic Pain", "Pain"), marketData: generateMarketProjections("Lidocaine Patch", "Approved", "PHN", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Sodium channel blocker patch", administration: "Topical 12 hours on/12 off", keyAdvantage: "Non-systemic local anesthetic" }
  },
  {
    id: "pain-25", name: "Diclofenac Topical", phase: "Approved", indication: "OA Pain", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "OA Pain", "Pain"), marketData: generateMarketProjections("Diclofenac Gel", "Approved", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Topical NSAID", administration: "Topical 4x daily", keyAdvantage: "Reduced systemic NSAID exposure" }
  },
  {
    id: "pain-26", name: "Triamcinolone Acetonide ER", phase: "Approved", indication: "OA Knee Pain", therapeuticArea: "Pain/Analgesia",
    company: "Flexion", companyTrackRecord: 'average', nctId: "NCT02357459",
    scores: calculateProbabilityScores("Approved", "OA Pain", "Pain"), marketData: generateMarketProjections("Zilretta", "Approved", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Extended-release IA corticosteroid", administration: "IA injection", keyAdvantage: "3-month duration" }
  },
  {
    id: "pain-27", name: "Hyaluronic Acid IA", phase: "Approved", indication: "OA Knee Pain", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "OA Pain", "Pain"), marketData: generateMarketProjections("Hyaluronic Acid", "Approved", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Viscosupplementation", administration: "IA injection series", keyAdvantage: "Joint lubrication" }
  },
  {
    id: "pain-28", name: "Lorecivivint", phase: "Phase III", indication: "Knee Osteoarthritis", therapeuticArea: "Pain/Analgesia",
    company: "Biosplice", companyTrackRecord: 'average', nctId: "NCT04385303",
    scores: calculateProbabilityScores("Phase III", "OA Pain", "Pain"), marketData: generateMarketProjections("Lorecivivint", "Phase III", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CLK/DYRK1A inhibitor", administration: "IA injection", keyAdvantage: "Disease-modifying potential" }
  },
  {
    id: "pain-29", name: "Sprifermin", phase: "Phase II/III", indication: "Knee Osteoarthritis", therapeuticArea: "Pain/Analgesia",
    company: "Merck KGaA", companyTrackRecord: 'fast', nctId: "NCT01919164",
    scores: calculateProbabilityScores("Phase II", "OA Pain", "Pain"), marketData: generateMarketProjections("Sprifermin", "Phase II", "OA Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "FGF18 analog", administration: "IA injection", keyAdvantage: "Cartilage regeneration" }
  },
  {
    id: "pain-30", name: "TPX-100", phase: "Phase II", indication: "Knee Osteoarthritis", therapeuticArea: "Pain/Analgesia",
    company: "OrthoTrophix", companyTrackRecord: 'average', nctId: "NCT02072265",
    scores: calculateProbabilityScores("Phase II", "OA Pain", "Pain"), marketData: generateMarketProjections("TPX-100", "Phase II", "OA Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "MMP-derived peptide", administration: "IA injection", keyAdvantage: "Cartilage protection" }
  },
  {
    id: "pain-31", name: "Carisbamate", phase: "Phase II", indication: "Fibromyalgia", therapeuticArea: "Pain/Analgesia",
    company: "SK Biopharmaceuticals", companyTrackRecord: 'average', nctId: "NCT01226771",
    scores: calculateProbabilityScores("Phase II", "Fibromyalgia", "Pain"), marketData: generateMarketProjections("Carisbamate", "Phase II", "Fibromyalgia", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Sodium channel blocker", administration: "Oral", keyAdvantage: "Novel mechanism for FM" }
  },
  {
    id: "pain-32", name: "Milnacipran", phase: "Approved", indication: "Fibromyalgia", therapeuticArea: "Pain/Analgesia",
    company: "Forest/Allergan", companyTrackRecord: 'average', nctId: "NCT00098124",
    scores: calculateProbabilityScores("Approved", "Fibromyalgia", "Pain"), marketData: generateMarketProjections("Milnacipran", "Approved", "Fibromyalgia", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "SNRI", administration: "Oral twice daily", keyAdvantage: "Preferential NRI for pain" }
  },
  {
    id: "pain-33", name: "Naltrexone Low-Dose", phase: "Phase II", indication: "Fibromyalgia/Chronic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT00568555",
    scores: calculateProbabilityScores("Phase II", "Fibromyalgia", "Pain"), marketData: generateMarketProjections("LDN", "Phase II", "Fibromyalgia", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Opioid antagonist (low-dose)", administration: "Oral once daily", keyAdvantage: "Anti-inflammatory at low dose" }
  },
  {
    id: "pain-34", name: "Sodium Oxybate", phase: "Approved", indication: "Fibromyalgia", therapeuticArea: "Pain/Analgesia",
    company: "Jazz Pharmaceuticals", companyTrackRecord: 'average', nctId: "NCT00369343",
    scores: calculateProbabilityScores("Approved", "Fibromyalgia", "Pain"), marketData: generateMarketProjections("Xyrem-FM", "Approved", "Fibromyalgia", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "CNS depressant", administration: "Oral twice nightly", keyAdvantage: "Improves restorative sleep" }
  },
  {
    id: "pain-35", name: "Tocilizumab", phase: "Phase II", indication: "Giant Cell Arteritis Headache", therapeuticArea: "Pain/Analgesia",
    company: "Roche", companyTrackRecord: 'fast', nctId: "NCT01791153",
    scores: calculateProbabilityScores("Phase II", "GCA", "Pain"), marketData: generateMarketProjections("Tocilizumab-GCA", "Phase II", "GCA Pain", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Anti-IL-6 receptor antibody", administration: "SC weekly or IV", keyAdvantage: "Steroid-sparing in GCA" }
  },
  {
    id: "pain-36", name: "Corticosteroid-Free Migraine", phase: "Phase II", indication: "Cluster Headache", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Phase II", "Cluster Headache", "Pain"), marketData: generateMarketProjections("Cluster Novel", "Phase II", "Cluster", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Various mechanisms", administration: "Various", keyAdvantage: "Non-steroid cluster treatment" }
  },
  {
    id: "pain-37", name: "Ketorolac Intranasal", phase: "Approved", indication: "Moderate-Severe Pain", therapeuticArea: "Pain/Analgesia",
    company: "Egalet/Luitpold", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Acute Pain", "Pain"), marketData: generateMarketProjections("Ketorolac IN", "Approved", "Acute Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NSAID intranasal", administration: "Nasal spray PRN", keyAdvantage: "Non-opioid acute pain option" }
  },
  {
    id: "pain-38", name: "Meloxicam IV", phase: "Approved", indication: "Moderate-Severe Pain", therapeuticArea: "Pain/Analgesia",
    company: "Baudax Bio", companyTrackRecord: 'slow', nctId: "NCT02678663",
    scores: calculateProbabilityScores("Approved", "Acute Pain", "Pain"), marketData: generateMarketProjections("Meloxicam IV", "Approved", "Acute Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IV NSAID", administration: "IV once daily", keyAdvantage: "COX-2 preferential IV option" }
  },
  {
    id: "pain-39", name: "HTX-011", phase: "Approved", indication: "Postoperative Pain", therapeuticArea: "Pain/Analgesia",
    company: "Heron Therapeutics", companyTrackRecord: 'average', nctId: "NCT03051243",
    scores: calculateProbabilityScores("Approved", "Postoperative Pain", "Pain"), marketData: generateMarketProjections("HTX-011", "Approved", "Postop Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Bupivacaine/meloxicam combination", administration: "Surgical site infiltration", keyAdvantage: "Extended local anesthesia" }
  },
  {
    id: "pain-40", name: "Liposomal Bupivacaine", phase: "Approved", indication: "Postsurgical Analgesia", therapeuticArea: "Pain/Analgesia",
    company: "Pacira", companyTrackRecord: 'average', nctId: "NCT01203644",
    scores: calculateProbabilityScores("Approved", "Postoperative Pain", "Pain"), marketData: generateMarketProjections("Exparel", "Approved", "Postop Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Extended-release local anesthetic", administration: "Infiltration or nerve block", keyAdvantage: "72-hour analgesia" }
  },
  {
    id: "pain-41", name: "Sumatriptan/Naproxen", phase: "Approved", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "GSK/Pozen", companyTrackRecord: 'fast', nctId: "NCT00282698",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Treximet", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Triptan + NSAID combo", administration: "Oral", keyAdvantage: "Dual mechanism synergy" }
  },
  {
    id: "pain-42", name: "Dihydroergotamine Nasal", phase: "Approved", indication: "Migraine Acute", therapeuticArea: "Pain/Analgesia",
    company: "Valeant/Impel", companyTrackRecord: 'average', nctId: "NCT03557333",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("DHE Nasal", "Approved", "Migraine", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Ergot derivative", administration: "Precision olfactory delivery", keyAdvantage: "Upper nasal targeted delivery" }
  },
  {
    id: "pain-43", name: "Celecoxib/Tramadol", phase: "Phase III", indication: "Acute Pain", therapeuticArea: "Pain/Analgesia",
    company: "Iroko", companyTrackRecord: 'slow', nctId: "NCT02694172",
    scores: calculateProbabilityScores("Phase III", "Acute Pain", "Pain"), marketData: generateMarketProjections("Cele-Tram", "Phase III", "Acute Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "NSAID + weak opioid combo", administration: "Oral", keyAdvantage: "Multimodal analgesia" }
  },
  {
    id: "pain-44", name: "Acetaminophen IV", phase: "Approved", indication: "Mild-Moderate Pain/Fever", therapeuticArea: "Pain/Analgesia",
    company: "Mallinckrodt", companyTrackRecord: 'slow', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Acute Pain", "Pain"), marketData: generateMarketProjections("Ofirmev", "Approved", "Acute Pain", 'slow'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Non-opioid analgesic IV", administration: "IV every 4-6 hours", keyAdvantage: "IV option for NPO patients" }
  },
  {
    id: "pain-45", name: "Ibuprofen IV", phase: "Approved", indication: "Mild-Moderate Pain/Fever", therapeuticArea: "Pain/Analgesia",
    company: "Cumberland", companyTrackRecord: 'average', nctId: "NCT00483002",
    scores: calculateProbabilityScores("Approved", "Acute Pain", "Pain"), marketData: generateMarketProjections("Caldolor", "Approved", "Acute Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "IV NSAID", administration: "IV every 4-6 hours", keyAdvantage: "Opioid-sparing in surgery" }
  },
  {
    id: "pain-46", name: "Clonidine ER", phase: "Approved", indication: "Neuropathic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Neuropathic Pain", "Pain"), marketData: generateMarketProjections("Clonidine ER", "Approved", "Neuropathic Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Alpha-2 agonist", administration: "Epidural or oral", keyAdvantage: "Adjuvant for severe pain" }
  },
  {
    id: "pain-47", name: "Ziconotide", phase: "Approved", indication: "Severe Chronic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Jazz", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Chronic Pain", "Pain"), marketData: generateMarketProjections("Prialt", "Approved", "Chronic Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "N-type Ca channel blocker", administration: "Intrathecal pump", keyAdvantage: "Non-opioid for intractable pain" }
  },
  {
    id: "pain-48", name: "Baclofen Intrathecal", phase: "Approved", indication: "Severe Spasticity", therapeuticArea: "Pain/Analgesia",
    company: "Saol/Medtronic", companyTrackRecord: 'average', nctId: "NCT00000000",
    scores: calculateProbabilityScores("Approved", "Spasticity", "Pain"), marketData: generateMarketProjections("ITB Baclofen", "Approved", "Spasticity", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "GABA-B agonist", administration: "Intrathecal pump", keyAdvantage: "Direct spinal action" }
  },
  {
    id: "pain-49", name: "Botulinum Toxin A", phase: "Approved", indication: "Chronic Migraine", therapeuticArea: "Pain/Analgesia",
    company: "Allergan/AbbVie", companyTrackRecord: 'fast', nctId: "NCT00156910",
    scores: calculateProbabilityScores("Approved", "Migraine", "Pain"), marketData: generateMarketProjections("Botox Migraine", "Approved", "Migraine", 'fast'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Neurotoxin", administration: "IM injections every 12 weeks", keyAdvantage: "Quarterly preventive" }
  },
  {
    id: "pain-50", name: "Cannabidiol (CBD)", phase: "Phase II/III", indication: "Chronic Pain", therapeuticArea: "Pain/Analgesia",
    company: "Various", companyTrackRecord: 'average', nctId: "NCT03336086",
    scores: calculateProbabilityScores("Phase II", "Chronic Pain", "Pain"), marketData: generateMarketProjections("CBD-Pain", "Phase II", "Chronic Pain", 'average'), overallScore: 0, hasRetrospective: true,
    drugInfo: { class: "Cannabinoid", administration: "Oral or topical", keyAdvantage: "Non-intoxicating cannabinoid" }
  }
];
