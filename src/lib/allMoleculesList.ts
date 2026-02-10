// Shared utility to provide the complete molecule list for calculator components
import { additionalMolecules, type MoleculeProfile } from './moleculesData';
import { endocrinologyMolecules } from './endocrinologyMolecules';
import { obesityMolecules } from './obesityMolecules';
import { diabetesMolecules } from './diabetesMolecules';
import { dermatologyMolecules } from './dermatologyMolecules';
import { oncologyMolecules } from './oncologyMolecules';
import { cardiovascularMolecules } from './cardiovascularMolecules';
import { neurologyMolecules } from './neurologyMolecules';
import { immunologyMolecules } from './immunologyMolecules';
import { infectiousMolecules } from './infectiousMolecules';
import { rareDiseaseMolecules } from './rareDiseaseMolecules';
import { rheumatologyMolecules } from './rheumatologyMolecules';
import { psychiatryMolecules } from './psychiatryMolecules';
import { hematologyMolecules } from './hematologyMolecules';
import { gastroenterologyMolecules } from './gastroenterologyMolecules';
import { nephrologyMolecules } from './nephologyMolecules';
import { painMolecules } from './painMolecules';
import { womensHealthMolecules } from './womensHealthMolecules';
import { extendedOncologyMolecules } from './extendedOncologyMolecules';
import { extendedNeurologyMolecules } from './extendedNeurologyMolecules';
import { extendedCardiometabolicMolecules } from './extendedCardiometabolicMolecules';
import { extendedImmunologyMolecules } from './extendedImmunologyMolecules';
import { extendedInfectiousMolecules } from './extendedInfectiousMolecules';
import { extendedPsychiatryMolecules } from './extendedPsychiatryMolecules';
import { extendedRheumatologyMolecules } from './extendedRheumatologyMolecules';

export const getAllMolecules = (): MoleculeProfile[] => {
  return [
    ...additionalMolecules,
    ...endocrinologyMolecules,
    ...obesityMolecules,
    ...diabetesMolecules,
    ...dermatologyMolecules,
    ...oncologyMolecules,
    ...cardiovascularMolecules,
    ...neurologyMolecules,
    ...immunologyMolecules,
    ...infectiousMolecules,
    ...rareDiseaseMolecules,
    ...rheumatologyMolecules,
    ...psychiatryMolecules,
    ...hematologyMolecules,
    ...gastroenterologyMolecules,
    ...nephrologyMolecules,
    ...painMolecules,
    ...womensHealthMolecules,
    ...extendedOncologyMolecules,
    ...extendedNeurologyMolecules,
    ...extendedCardiometabolicMolecules,
    ...extendedImmunologyMolecules,
    ...extendedInfectiousMolecules,
    ...extendedPsychiatryMolecules,
    ...extendedRheumatologyMolecules,
  ];
};

// Map therapeutic area names from molecule data to calculator TA IDs
export const mapTAToModel1Id = (ta: string): string | null => {
  const mapping: Record<string, string> = {
    "Oncology/Hematology": "oncology",
    "Cardiovascular/Cardiology": "cardiology",
    "Neurology/Neuroscience": "neurology",
    "Dermatology": "dermatology",
    "Endocrinology & Metabolism": "endocrinology",
    "Immunology & Inflammation": "immunology",
    "Infectious Diseases": "infectious",
    "Respiratory/Pulmonology": "respiratory",
    "Gastroenterology & Hepatology": "gastro",
    "Hematology": "hematology",
    "Rheumatology": "rheumatology",
    "Ophthalmology": "ophthalmology",
    "Nephrology/Renal": "uro_nephro",
    "Psychiatry/Mental Health": "psychiatry",
    "Transplant & Cell/Gene Therapy": "transplant",
    "Rare Diseases/Orphan": "oncology", // fallback
    "Women's Health": "oncology", // fallback
    "Pain Management/Anesthesia": "oncology", // fallback
    "Obesity": "endocrinology",
    "Type 2 Diabetes": "endocrinology",
  };
  return mapping[ta] || null;
};

export const mapTAToModel2Id = (ta: string): string | null => {
  const mapping: Record<string, string> = {
    "Oncology/Hematology": "oncology",
    "Cardiovascular/Cardiology": "cardiovascular",
    "Neurology/Neuroscience": "neurology",
    "Psychiatry/Mental Health": "psychiatry",
    "Endocrinology & Metabolism": "endocrinology",
    "Immunology & Inflammation": "immunology",
    "Rheumatology": "rheumatology",
    "Infectious Diseases": "infectious",
    "Respiratory/Pulmonology": "respiratory",
    "Gastroenterology & Hepatology": "gastro",
    "Nephrology/Renal": "nephrology",
    "Dermatology": "dermatology",
    "Ophthalmology": "ophthalmology",
    "Rare Diseases/Orphan": "rareDisease",
    "Women's Health": "womensHealth",
    "Pain Management/Anesthesia": "pain",
    "Transplant & Cell/Gene Therapy": "transplant",
    "Hematology": "oncology",
    "Obesity": "endocrinology",
    "Type 2 Diabetes": "endocrinology",
  };
  return mapping[ta] || null;
};

// Derive Model 1 scores from molecule probability data
export const deriveModel1Scores = (mol: MoleculeProfile) => {
  const s = mol.scores;
  // Clinical: based on meeting endpoints + approval probability
  const clinical = Math.round(((s.meetingEndpoints + s.approval) / 2) * 100);
  // Economic: based on revenue potential (normalize year1 revenue)
  const avgRevenue = mol.marketData.reduce((sum, m) => sum + m.revenueProjection.year1, 0) / mol.marketData.length;
  const economic = Math.round(Math.min(100, (avgRevenue / 500) * 100));
  // Access: based on HTA strategy strength
  const avgHTA = mol.marketData.reduce((sum, m) => sum + m.marketAccessStrategy.hta, 0) / mol.marketData.length;
  const access = Math.round(avgHTA * 100);
  // Political: based on regulatory pathway (breakthrough/orphan boost)
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
