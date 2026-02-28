// Shared utility to provide the complete molecule list for calculator components
// Now backed by real data from useMolecules hook
import { type MoleculeProfile } from './moleculesData';
import { getCachedMolecules } from '@/hooks/useMolecules';

export const getAllMolecules = (): MoleculeProfile[] => {
  return getCachedMolecules();
};

// Map therapeutic area names from molecule data to calculator TA IDs
export const mapTAToModel1Id = (ta: string): string | null => {
  const mapping: Record<string, string> = {
    "Oncology/Hematology": "oncology",
    "Oncology & Hematology": "oncology",
    "Cardiovascular/Cardiology": "cardiology",
    "Cardiovascular": "cardiology",
    "Neurology/Neuroscience": "neurology",
    "Neurology": "neurology",
    "Dermatology": "dermatology",
    "Endocrinology & Metabolism": "endocrinology",
    "Immunology & Inflammation": "immunology",
    "Infectious Diseases": "infectious",
    "Infectious Disease": "infectious",
    "Respiratory/Pulmonology": "respiratory",
    "Respiratory & Pulmonary": "respiratory",
    "Gastroenterology & Hepatology": "gastro",
    "Hematology": "hematology",
    "Rheumatology": "rheumatology",
    "Ophthalmology": "ophthalmology",
    "Nephrology/Renal": "uro_nephro",
    "Nephrology & Renal": "uro_nephro",
    "Psychiatry/Mental Health": "psychiatry",
    "Psychiatry & Mental Health": "psychiatry",
    "Transplant & Cell/Gene Therapy": "transplant",
    "Rare Diseases/Orphan": "rareDisease",
    "Rare Disease & Orphan": "rareDisease",
    "Women's Health": "womensHealth",
    "Pain Management/Anesthesia": "pain",
    "Obesity": "endocrinology",
    "Type 2 Diabetes": "endocrinology",
    "Other": "oncology",
  };
  return mapping[ta] || null;
};

export const mapTAToModel2Id = (ta: string): string | null => {
  const mapping: Record<string, string> = {
    "Oncology/Hematology": "oncology",
    "Oncology & Hematology": "oncology",
    "Cardiovascular/Cardiology": "cardiovascular",
    "Cardiovascular": "cardiovascular",
    "Neurology/Neuroscience": "neurology",
    "Neurology": "neurology",
    "Psychiatry/Mental Health": "psychiatry",
    "Psychiatry & Mental Health": "psychiatry",
    "Endocrinology & Metabolism": "endocrinology",
    "Immunology & Inflammation": "immunology",
    "Rheumatology": "rheumatology",
    "Infectious Diseases": "infectious",
    "Infectious Disease": "infectious",
    "Respiratory/Pulmonology": "respiratory",
    "Respiratory & Pulmonary": "respiratory",
    "Gastroenterology & Hepatology": "gastro",
    "Nephrology/Renal": "nephrology",
    "Nephrology & Renal": "nephrology",
    "Dermatology": "dermatology",
    "Ophthalmology": "ophthalmology",
    "Rare Diseases/Orphan": "rareDisease",
    "Rare Disease & Orphan": "rareDisease",
    "Women's Health": "womensHealth",
    "Pain Management/Anesthesia": "pain",
    "Transplant & Cell/Gene Therapy": "transplant",
    "Hematology": "oncology",
    "Obesity": "endocrinology",
    "Type 2 Diabetes": "endocrinology",
    "Other": "oncology",
  };
  return mapping[ta] || null;
};

// Derive Model 1 scores from molecule probability data
export const deriveModel1Scores = (mol: MoleculeProfile) => {
  const s = mol.scores;
  const clinical = Math.round(((s.meetingEndpoints + s.approval) / 2) * 100);
  const avgRevenue = mol.marketData.reduce((sum, m) => sum + m.revenueProjection.year1, 0) / Math.max(1, mol.marketData.length);
  const economic = Math.round(Math.min(100, (avgRevenue / 500) * 100));
  const avgHTA = mol.marketData.reduce((sum, m) => sum + m.marketAccessStrategy.hta, 0) / Math.max(1, mol.marketData.length);
  const access = Math.round(avgHTA * 100);
  const political = Math.round(((s.regulatoryPathway.breakthrough + s.regulatoryPathway.orphan) / 2) * 100);
  return { clinical, economic, access, political };
};

// Derive Model 2 ratios from molecule probability data
export const deriveModel2Ratios = (mol: MoleculeProfile) => {
  const s = mol.scores;
  return {
    clinicalBenefit: parseFloat((0.7 + s.meetingEndpoints * 0.8).toFixed(2)),
    safetyProfile: parseFloat((0.8 + (1 - s.dropoutRanking / 5) * 0.8).toFixed(2)),
    icer: parseFloat((0.7 + s.approval * 0.6).toFixed(2)),
    targetPopulation: 1.0,
    priceVsSoc: parseFloat((0.8 + s.nextPhase * 0.4).toFixed(2)),
    evidenceQuality: parseFloat((0.8 + s.meetingEndpoints * 0.5).toFixed(2)),
  };
};
