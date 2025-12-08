// LPI-2 Model: 5-Factor Investment LPI (VC / Investment Model)
// Used by venture capital funds, licensing teams, and biotech accelerators

import { normalizeTA } from './taCompositeIndex';

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface LPI2Factor {
  name: string;
  weight: number; // percentage (0-100)
  score: number; // 0-100
  description: string;
  kpiExample: string;
  subFactors: SubFactor[];
}

export interface SubFactor {
  name: string;
  score: number; // 0-100
  description: string;
}

export interface LPI2Prediction {
  moleculeId: string;
  totalScore: number; // 0-100
  investmentReadiness: string; // e.g., "Financing-ready Phase I asset"
  factors: LPI2Factor[];
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Pass';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very High';
}

// ========================================
// FACTOR WEIGHTS (as per model specification)
// ========================================

const FACTOR_WEIGHTS = {
  biologicalPlausibility: 30,
  translationalEvidence: 25,
  clinicalReadiness: 20,
  regulatoryAttractiveness: 15,
  teamAndSponsor: 10,
};

// ========================================
// HELPER FUNCTIONS
// ========================================

function getInvestmentReadiness(score: number, phase: string): string {
  if (score >= 80) {
    if (phase === 'Approved') return 'Commercial-ready asset';
    if (phase === 'Phase III') return 'Late-stage premium asset';
    if (phase === 'Phase II') return 'High-conviction Phase II asset';
    return 'Exceptional early-stage opportunity';
  }
  if (score >= 70) {
    if (phase === 'Approved') return 'Established commercial asset';
    if (phase === 'Phase III') return 'Investment-grade Phase III asset';
    if (phase === 'Phase II') return 'Financing-ready Phase II asset';
    return 'Financing-ready Phase I asset';
  }
  if (score >= 60) {
    if (phase === 'Approved') return 'Stable commercial asset';
    if (phase === 'Phase III') return 'Moderate-risk Phase III asset';
    return 'Development-stage opportunity';
  }
  if (score >= 50) {
    return 'Early-stage speculative asset';
  }
  return 'High-risk early-stage asset';
}

function getRecommendation(score: number): 'Strong Buy' | 'Buy' | 'Hold' | 'Pass' {
  if (score >= 75) return 'Strong Buy';
  if (score >= 60) return 'Buy';
  if (score >= 45) return 'Hold';
  return 'Pass';
}

function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' | 'Very High' {
  if (score >= 75) return 'Low';
  if (score >= 60) return 'Medium';
  if (score >= 45) return 'High';
  return 'Very High';
}

// ========================================
// SCORING FUNCTIONS BY FACTOR
// ========================================

function scoreBiologicalPlausibility(
  therapeuticArea: string,
  phase: string,
  indication: string
): LPI2Factor {
  const ta = normalizeTA(therapeuticArea);
  
  // Sub-factors for biological plausibility
  const geneticEvidence = getGeneticEvidenceScore(ta, indication);
  const pathwayValidation = getPathwayValidationScore(ta, phase);
  const mechanismClarity = getMechanismClarityScore(phase);
  
  const subFactors: SubFactor[] = [
    {
      name: 'Human Genetic Evidence',
      score: geneticEvidence,
      description: 'GWAS, Mendelian genetics, or human target validation',
    },
    {
      name: 'Pathway Role',
      score: pathwayValidation,
      description: 'Understanding of target role in disease pathway',
    },
    {
      name: 'Mechanism Clarity',
      score: mechanismClarity,
      description: 'Clarity of mechanism of action',
    },
  ];
  
  const avgScore = Math.round(
    (geneticEvidence + pathwayValidation + mechanismClarity) / 3
  );
  
  return {
    name: 'Biological Plausibility',
    weight: FACTOR_WEIGHTS.biologicalPlausibility,
    score: avgScore,
    description: 'Scientific foundation and target validation',
    kpiExample: 'Human genetic evidence, pathway role',
    subFactors,
  };
}

function scoreTranslationalEvidence(
  therapeuticArea: string,
  phase: string,
  companyTrackRecord: string
): LPI2Factor {
  const ta = normalizeTA(therapeuticArea);
  
  const preclinicalReproducibility = getPreclinicalReproducibilityScore(ta, phase);
  const biomarkerAvailability = getBiomarkerAvailabilityScore(ta);
  const animalModelRelevance = getAnimalModelRelevanceScore(ta);
  
  const subFactors: SubFactor[] = [
    {
      name: 'Preclinical Reproducibility',
      score: preclinicalReproducibility,
      description: 'Reproducibility of preclinical findings',
    },
    {
      name: 'Biomarker Availability',
      score: biomarkerAvailability,
      description: 'Validated biomarkers for efficacy/safety',
    },
    {
      name: 'Animal Model Relevance',
      score: animalModelRelevance,
      description: 'Translatability of animal models to humans',
    },
  ];
  
  const avgScore = Math.round(
    (preclinicalReproducibility + biomarkerAvailability + animalModelRelevance) / 3
  );
  
  return {
    name: 'Translational Evidence',
    weight: FACTOR_WEIGHTS.translationalEvidence,
    score: avgScore,
    description: 'Preclinical-to-clinical translation strength',
    kpiExample: 'Preclinical model reproducibility, biomarkers',
    subFactors,
  };
}

function scoreClinicalReadiness(
  phase: string,
  companyTrackRecord: string
): LPI2Factor {
  const indEnabling = getINDEnablingScore(phase);
  const manufacturingReadiness = getManufacturingReadinessScore(phase, companyTrackRecord);
  const protocolDesign = getProtocolDesignScore(phase);
  
  const subFactors: SubFactor[] = [
    {
      name: 'IND-Enabling Completeness',
      score: indEnabling,
      description: 'Toxicology, CMC, and regulatory package',
    },
    {
      name: 'Manufacturing Readiness',
      score: manufacturingReadiness,
      description: 'GMP capability and supply chain',
    },
    {
      name: 'Protocol Design',
      score: protocolDesign,
      description: 'Clinical trial design quality',
    },
  ];
  
  const avgScore = Math.round(
    (indEnabling + manufacturingReadiness + protocolDesign) / 3
  );
  
  return {
    name: 'Clinical Readiness',
    weight: FACTOR_WEIGHTS.clinicalReadiness,
    score: avgScore,
    description: 'Preparedness for clinical development',
    kpiExample: 'IND-enabling completeness',
    subFactors,
  };
}

function scoreRegulatoryAttractiveness(
  therapeuticArea: string,
  indication: string,
  phase: string
): LPI2Factor {
  const ta = normalizeTA(therapeuticArea);
  
  const orphanStatus = getOrphanStatusScore(ta, indication);
  const unmetNeed = getUnmetNeedScore(ta, indication);
  const expeditedPathway = getExpeditedPathwayScore(ta, phase);
  
  const subFactors: SubFactor[] = [
    {
      name: 'Orphan/Exemptions',
      score: orphanStatus,
      description: 'Orphan drug designation potential',
    },
    {
      name: 'Unmet Medical Need',
      score: unmetNeed,
      description: 'Severity of unmet need in indication',
    },
    {
      name: 'Expedited Pathway Eligibility',
      score: expeditedPathway,
      description: 'Fast Track, Breakthrough, or Priority Review potential',
    },
  ];
  
  const avgScore = Math.round(
    (orphanStatus + unmetNeed + expeditedPathway) / 3
  );
  
  return {
    name: 'Regulatory Attractiveness',
    weight: FACTOR_WEIGHTS.regulatoryAttractiveness,
    score: avgScore,
    description: 'Regulatory pathway advantages',
    kpiExample: 'Orphan/exemptions, unmet need',
    subFactors,
  };
}

function scoreTeamAndSponsor(
  company: string,
  companyTrackRecord: 'fast' | 'average' | 'slow',
  phase: string
): LPI2Factor {
  const trackRecordScore = getTrackRecordScore(companyTrackRecord);
  const executionCapability = getExecutionCapabilityScore(company, companyTrackRecord);
  const financialStrength = getFinancialStrengthScore(company);
  
  const subFactors: SubFactor[] = [
    {
      name: 'Track Record',
      score: trackRecordScore,
      description: 'Historical success in clinical advancement',
    },
    {
      name: 'Execution Capability',
      score: executionCapability,
      description: 'Operational expertise and infrastructure',
    },
    {
      name: 'Financial Strength',
      score: financialStrength,
      description: 'Funding runway and capital access',
    },
  ];
  
  const avgScore = Math.round(
    (trackRecordScore + executionCapability + financialStrength) / 3
  );
  
  return {
    name: 'Team & Sponsor',
    weight: FACTOR_WEIGHTS.teamAndSponsor,
    score: avgScore,
    description: 'Sponsor capability and track record',
    kpiExample: 'Track record of clinical advancement',
    subFactors,
  };
}

// ========================================
// SUB-FACTOR SCORING HELPERS
// ========================================

function getGeneticEvidenceScore(ta: string, indication: string): number {
  // TAs with strong genetic evidence base
  const highGeneticTA = ['oncology/hematology', 'rare diseases/orphan drugs', 'immunology & inflammation'];
  const mediumGeneticTA = ['cardiovascular', 'neurology/cns', 'endocrinology & metabolism'];
  
  if (highGeneticTA.includes(ta)) return 75 + Math.random() * 20;
  if (mediumGeneticTA.includes(ta)) return 55 + Math.random() * 25;
  return 40 + Math.random() * 30;
}

function getPathwayValidationScore(ta: string, phase: string): number {
  const phaseBonus = { 'Approved': 25, 'Phase III': 20, 'Phase II': 10, 'Phase I': 0 };
  const bonus = phaseBonus[phase as keyof typeof phaseBonus] || 0;
  return Math.min(100, 50 + bonus + Math.random() * 25);
}

function getMechanismClarityScore(phase: string): number {
  const phaseScores = { 'Approved': 90, 'Phase III': 80, 'Phase II': 70, 'Phase I': 55 };
  const base = phaseScores[phase as keyof typeof phaseScores] || 50;
  return Math.min(100, base + Math.random() * 10);
}

function getPreclinicalReproducibilityScore(ta: string, phase: string): number {
  const phaseBonus = { 'Approved': 30, 'Phase III': 25, 'Phase II': 15, 'Phase I': 5 };
  const bonus = phaseBonus[phase as keyof typeof phaseBonus] || 0;
  return Math.min(100, 45 + bonus + Math.random() * 20);
}

function getBiomarkerAvailabilityScore(ta: string): number {
  const highBiomarkerTA = ['oncology/hematology', 'immunology & inflammation', 'cardiovascular'];
  if (highBiomarkerTA.includes(ta)) return 70 + Math.random() * 25;
  return 45 + Math.random() * 35;
}

function getAnimalModelRelevanceScore(ta: string): number {
  // Some TAs have less translatable animal models
  const lowTranslatability = ['psychiatry/mental health', 'neurology/cns', 'pain management/anesthesia'];
  if (lowTranslatability.includes(ta)) return 35 + Math.random() * 30;
  return 55 + Math.random() * 35;
}

function getINDEnablingScore(phase: string): number {
  const phaseScores = { 'Approved': 100, 'Phase III': 95, 'Phase II': 85, 'Phase I': 70 };
  return phaseScores[phase as keyof typeof phaseScores] || 50;
}

function getManufacturingReadinessScore(phase: string, trackRecord: string): number {
  const phaseBase = { 'Approved': 90, 'Phase III': 75, 'Phase II': 60, 'Phase I': 45 };
  const trackBonus = { 'fast': 10, 'average': 5, 'slow': 0 };
  const base = phaseBase[phase as keyof typeof phaseBase] || 40;
  const bonus = trackBonus[trackRecord as keyof typeof trackBonus] || 0;
  return Math.min(100, base + bonus);
}

function getProtocolDesignScore(phase: string): number {
  const phaseScores = { 'Approved': 95, 'Phase III': 85, 'Phase II': 75, 'Phase I': 60 };
  return phaseScores[phase as keyof typeof phaseScores] || 50;
}

function getOrphanStatusScore(ta: string, indication: string): number {
  const orphanLikely = ['rare diseases/orphan drugs', 'oncology/hematology', 'neurology/cns'];
  if (orphanLikely.includes(ta)) return 70 + Math.random() * 25;
  return 30 + Math.random() * 40;
}

function getUnmetNeedScore(ta: string, indication: string): number {
  const highUnmetNeed = ['oncology/hematology', 'rare diseases/orphan drugs', 'neurology/cns', 'psychiatry/mental health'];
  if (highUnmetNeed.includes(ta)) return 75 + Math.random() * 20;
  return 50 + Math.random() * 35;
}

function getExpeditedPathwayScore(ta: string, phase: string): number {
  const expeditedLikely = ['oncology/hematology', 'rare diseases/orphan drugs', 'infectious diseases'];
  const base = expeditedLikely.includes(ta) ? 65 : 40;
  const phaseBonus = { 'Approved': 20, 'Phase III': 15, 'Phase II': 10, 'Phase I': 5 };
  const bonus = phaseBonus[phase as keyof typeof phaseBonus] || 0;
  return Math.min(100, base + bonus + Math.random() * 15);
}

function getTrackRecordScore(trackRecord: 'fast' | 'average' | 'slow'): number {
  const scores = { 'fast': 85, 'average': 65, 'slow': 45 };
  return scores[trackRecord] + Math.random() * 10;
}

function getExecutionCapabilityScore(company: string, trackRecord: string): number {
  // Large pharma companies have better execution capability
  const largePharma = ['Novo Nordisk', 'Eli Lilly', 'Roche', 'Merck', 'Pfizer', 'Johnson & Johnson', 'AstraZeneca', 'Bristol-Myers Squibb'];
  const isLargePharma = largePharma.some(p => company.toLowerCase().includes(p.toLowerCase()));
  
  if (isLargePharma) return 80 + Math.random() * 15;
  if (trackRecord === 'fast') return 70 + Math.random() * 15;
  if (trackRecord === 'average') return 55 + Math.random() * 20;
  return 40 + Math.random() * 25;
}

function getFinancialStrengthScore(company: string): number {
  const largePharma = ['Novo Nordisk', 'Eli Lilly', 'Roche', 'Merck', 'Pfizer', 'Johnson & Johnson', 'AstraZeneca', 'Bristol-Myers Squibb'];
  const isLargePharma = largePharma.some(p => company.toLowerCase().includes(p.toLowerCase()));
  
  if (isLargePharma) return 90 + Math.random() * 10;
  return 50 + Math.random() * 35;
}

// ========================================
// MAIN CALCULATION FUNCTION
// ========================================

export function calculateLPI2ForMolecule(molecule: {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
}): LPI2Prediction {
  // Calculate each factor
  const biologicalPlausibility = scoreBiologicalPlausibility(
    molecule.therapeuticArea,
    molecule.phase,
    molecule.indication
  );
  
  const translationalEvidence = scoreTranslationalEvidence(
    molecule.therapeuticArea,
    molecule.phase,
    molecule.companyTrackRecord
  );
  
  const clinicalReadiness = scoreClinicalReadiness(
    molecule.phase,
    molecule.companyTrackRecord
  );
  
  const regulatoryAttractiveness = scoreRegulatoryAttractiveness(
    molecule.therapeuticArea,
    molecule.indication,
    molecule.phase
  );
  
  const teamAndSponsor = scoreTeamAndSponsor(
    molecule.company,
    molecule.companyTrackRecord,
    molecule.phase
  );
  
  const factors = [
    biologicalPlausibility,
    translationalEvidence,
    clinicalReadiness,
    regulatoryAttractiveness,
    teamAndSponsor,
  ];
  
  // Calculate weighted total score
  const totalScore = Math.round(
    factors.reduce((sum, factor) => sum + (factor.score * factor.weight / 100), 0)
  );
  
  return {
    moleculeId: molecule.id,
    totalScore,
    investmentReadiness: getInvestmentReadiness(totalScore, molecule.phase),
    factors,
    recommendation: getRecommendation(totalScore),
    riskLevel: getRiskLevel(totalScore),
  };
}

// ========================================
// EXPORT DATA SOURCES
// ========================================

export const LPI2_DATA_SOURCES = [
  { name: 'GWAS Catalog', url: 'https://www.ebi.ac.uk/gwas/' },
  { name: 'ClinVar', url: 'https://www.ncbi.nlm.nih.gov/clinvar/' },
  { name: 'FDA Orphan Drug Database', url: 'https://www.accessdata.fda.gov/scripts/opdlisting/oopd/' },
  { name: 'SEC EDGAR', url: 'https://www.sec.gov/edgar/' },
];
