import { type MoleculeProfile } from './moleculesData';

// Types
export interface ComponentScore {
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
}

export interface PeakSalesResult {
  compositeScore: number;
  blockbusterProbability: number;
  peakSalesEstimate: number;
  componentScores: ComponentScore[];
}

// Calculate blockbuster probability using logistic function
// P($1B+) = 1 / (1 + e^[-(Composite Score - 65)/10])
export const calculateBlockbusterProbability = (compositeScore: number): number => {
  const mu = 65;
  const sigma = 10;
  const prob = 1 / (1 + Math.exp(-(compositeScore - mu) / sigma));
  return Math.round(prob * 1000) / 10;
};

// Derive base market score from molecule data
const calculateBaseMarketScore = (molecule: MoleculeProfile): number => {
  const therapeuticArea = molecule.therapeuticArea.toLowerCase();
  
  // Patient population estimation based on TA
  let populationScore = 80; // Default: medium
  if (therapeuticArea.includes('rare') || therapeuticArea.includes('orphan')) {
    populationScore = 40;
  } else if (therapeuticArea.includes('oncology') || therapeuticArea.includes('cardiovascular')) {
    populationScore = 90;
  } else if (therapeuticArea.includes('diabetes') || therapeuticArea.includes('obesity')) {
    populationScore = 100;
  } else if (therapeuticArea.includes('psychiatry') || therapeuticArea.includes('neurology')) {
    populationScore = 85;
  }
  
  // Geographic reach based on company track record
  const geographicScore = molecule.companyTrackRecord === 'fast' ? 100 : 
                          molecule.companyTrackRecord === 'average' ? 75 : 50;
  
  // Market growth based on TA
  let growthScore = 80; // Default: growing
  if (therapeuticArea.includes('oncology') || therapeuticArea.includes('immunology') || 
      therapeuticArea.includes('obesity') || therapeuticArea.includes('rare')) {
    growthScore = 100;
  } else if (therapeuticArea.includes('infectious') || therapeuticArea.includes('vaccine')) {
    growthScore = 60;
  }
  
  return (populationScore * 0.5) + (geographicScore * 0.3) + (growthScore * 0.2);
};

// Derive clinical score from molecule data
const calculateClinicalScore = (molecule: MoleculeProfile): number => {
  // Base scores from phase
  let efficacyScore = 70;
  let safetyScore = 70;
  let differentiationScore = 70;
  let evidenceScore = 60;
  
  // Adjust based on phase
  if (molecule.phase === 'Approved') {
    efficacyScore = 85;
    safetyScore = 80;
    evidenceScore = 95;
  } else if (molecule.phase.includes('Phase III')) {
    efficacyScore = 75;
    evidenceScore = 75;
  } else if (molecule.phase.includes('Phase II')) {
    efficacyScore = 65;
    evidenceScore = 55;
  } else if (molecule.phase.includes('Phase I')) {
    efficacyScore = 55;
    evidenceScore = 40;
  }
  
  // Adjust based on overall score
  if (molecule.overallScore >= 80) {
    efficacyScore = Math.min(100, efficacyScore + 15);
    safetyScore = Math.min(100, safetyScore + 10);
    differentiationScore = Math.min(100, differentiationScore + 15);
  } else if (molecule.overallScore >= 60) {
    efficacyScore = Math.min(100, efficacyScore + 5);
    differentiationScore = Math.min(100, differentiationScore + 5);
  } else if (molecule.overallScore < 40) {
    efficacyScore = Math.max(20, efficacyScore - 15);
    safetyScore = Math.max(20, safetyScore - 10);
  }
  
  let score = (efficacyScore * 0.4) + (safetyScore * 0.3) + 
              (differentiationScore * 0.2) + (evidenceScore * 0.1);
  
  // Bonuses for rare/orphan designations
  if (molecule.therapeuticArea.toLowerCase().includes('rare') || 
      molecule.therapeuticArea.toLowerCase().includes('orphan')) {
    score += 7; // Orphan designation bonus
  }
  
  // Check for breakthrough indicators in drug info
  if (molecule.drugInfo?.keyAdvantage?.toLowerCase().includes('first-in-class') ||
      molecule.drugInfo?.keyAdvantage?.toLowerCase().includes('novel')) {
    score += 10;
  }
  
  return Math.min(100, score);
};

// Derive commercial score from molecule data
const calculateCommercialScore = (molecule: MoleculeProfile): number => {
  // Convenience based on administration route
  let convenienceScore = 70;
  const admin = molecule.drugInfo?.administration?.toLowerCase() || '';
  if (admin.includes('oral') && (admin.includes('daily') || admin.includes('once'))) {
    convenienceScore = 80;
  } else if (admin.includes('oral') && admin.includes('weekly')) {
    convenienceScore = 90;
  } else if (admin.includes('monthly') || admin.includes('once a month')) {
    convenienceScore = 85;
  } else if (admin.includes('weekly') && admin.includes('injection')) {
    convenienceScore = 60;
  } else if (admin.includes('daily') && admin.includes('injection')) {
    convenienceScore = 40;
  } else if (admin.includes('one-time') || admin.includes('single')) {
    convenienceScore = 100;
  }
  
  // Brand strength based on company
  let brandScore = 60;
  if (molecule.companyTrackRecord === 'fast') {
    brandScore = 85;
  } else if (molecule.companyTrackRecord === 'average') {
    brandScore = 70;
  }
  
  // HCP acceptance based on phase and score
  let hcpScore = 60;
  if (molecule.phase === 'Approved') {
    hcpScore = 85;
  } else if (molecule.phase.includes('Phase III')) {
    hcpScore = 65;
  }
  
  if (molecule.overallScore >= 75) {
    hcpScore = Math.min(100, hcpScore + 15);
  }
  
  // Patient preference
  const patientScore = convenienceScore; // Correlates with convenience
  
  return (convenienceScore * 0.35) + (brandScore * 0.25) + 
         (hcpScore * 0.25) + (patientScore * 0.15);
};

// Derive strategic score from molecule data
const calculateStrategicScore = (molecule: MoleculeProfile): number => {
  // Treatment line estimation
  let lineScore = 70; // Default: 2nd line
  if (molecule.phase === 'Approved' && molecule.overallScore >= 75) {
    lineScore = 100; // First line preferred
  } else if (molecule.overallScore >= 60) {
    lineScore = 85; // First line alternative
  }
  
  // Combination potential based on drug class
  let comboScore = 75; // Default: compatible
  const drugClass = molecule.drugInfo?.class?.toLowerCase() || '';
  if (drugClass.includes('monoclonal') || drugClass.includes('biologic')) {
    comboScore = 90; // Synergistic
  }
  
  // Label breadth based on indication
  let labelScore = 70; // Default: single indication
  if (molecule.indication.includes('/') || molecule.indication.includes('multiple') ||
      molecule.therapeuticArea.toLowerCase().includes('oncology')) {
    labelScore = 85;
  }
  
  // Life cycle management
  let lcmScore = 70; // Default: 1-2 additional indications
  if (molecule.companyTrackRecord === 'fast') {
    lcmScore = 90;
  }
  
  return (lineScore * 0.4) + (comboScore * 0.3) + (labelScore * 0.2) + (lcmScore * 0.1);
};

// Derive competitive score from molecule data
const calculateCompetitiveScore = (molecule: MoleculeProfile): number => {
  // Base saturation from competitive landscape
  let baseSaturation = 75;
  let differentiationBonus = 0;
  
  if (molecule.competitiveLandscape) {
    const competitors = molecule.competitiveLandscape.keyPlayers?.length || 0;
    if (competitors === 0) {
      baseSaturation = 100;
    } else if (competitors <= 2) {
      baseSaturation = 90;
    } else if (competitors <= 4) {
      baseSaturation = 75;
    } else if (competitors <= 7) {
      baseSaturation = 60;
    } else {
      baseSaturation = 45;
    }
    
    // Check for differentiation in market positioning
    const marketPositioning = molecule.competitiveLandscape.marketPositioning?.toLowerCase() || '';
    if (marketPositioning.includes('unique') || marketPositioning.includes('first')) {
      differentiationBonus += 15;
    }
    if (marketPositioning.includes('superior') || marketPositioning.includes('best')) {
      differentiationBonus += 10;
    }
  }
  
  // Drug class differentiation
  if (molecule.drugInfo?.keyAdvantage?.toLowerCase().includes('novel') ||
      molecule.drugInfo?.keyAdvantage?.toLowerCase().includes('unique')) {
    differentiationBonus += 10;
  }
  
  return Math.min(100, baseSaturation + differentiationBonus);
};

// Derive market access score from molecule data
const calculateMarketAccessScore = (molecule: MoleculeProfile): number => {
  // Base scores
  let payerScore = 75;
  let reimbursementScore = 70;
  let formularyScore = 75;
  let priorAuthScore = 80;
  
  // Adjust based on phase and approval likelihood
  if (molecule.phase === 'Approved') {
    payerScore = 90;
    reimbursementScore = 85;
    formularyScore = 85;
  } else if (molecule.phase.includes('Phase III')) {
    payerScore = 80;
    reimbursementScore = 75;
  }
  
  // Orphan/rare disease bonus
  if (molecule.therapeuticArea.toLowerCase().includes('rare') ||
      molecule.therapeuticArea.toLowerCase().includes('orphan')) {
    payerScore = Math.min(100, payerScore + 10);
    formularyScore = Math.min(100, formularyScore + 10);
  }
  
  // Adjust based on overall score
  if (molecule.overallScore >= 75) {
    reimbursementScore = Math.min(100, reimbursementScore + 10);
  }
  
  return (payerScore * 0.4) + (reimbursementScore * 0.3) + 
         (formularyScore * 0.2) + (priorAuthScore * 0.1);
};

// Derive pricing score from molecule data
const calculatePricingScore = (molecule: MoleculeProfile): number => {
  // Base therapeutic value
  let valueScore = 70; // Default: significant improvement
  
  // Adjust based on TA and indication
  if (molecule.therapeuticArea.toLowerCase().includes('oncology')) {
    valueScore = 85;
  } else if (molecule.therapeuticArea.toLowerCase().includes('rare') ||
             molecule.therapeuticArea.toLowerCase().includes('orphan')) {
    valueScore = 100;
  }
  
  // Adjust based on overall score
  if (molecule.overallScore >= 80) {
    valueScore = Math.min(100, valueScore + 15);
  } else if (molecule.overallScore >= 60) {
    valueScore = Math.min(100, valueScore + 5);
  } else if (molecule.overallScore < 40) {
    valueScore = Math.max(25, valueScore - 20);
  }
  
  // Orphan drug bonus
  if (molecule.therapeuticArea.toLowerCase().includes('rare') ||
      molecule.therapeuticArea.toLowerCase().includes('orphan')) {
    valueScore = Math.min(100, valueScore + 15);
  }
  
  return Math.min(100, valueScore);
};

// Main function to calculate Peak Sales Index for a molecule
export const calculatePeakSalesIndex = (molecule: MoleculeProfile): PeakSalesResult => {
  const baseMarket = calculateBaseMarketScore(molecule);
  const clinical = calculateClinicalScore(molecule);
  const commercial = calculateCommercialScore(molecule);
  const strategic = calculateStrategicScore(molecule);
  const competitive = calculateCompetitiveScore(molecule);
  const marketAccess = calculateMarketAccessScore(molecule);
  const pricing = calculatePricingScore(molecule);

  const componentScores: ComponentScore[] = [
    { name: "Base Market Size", score: baseMarket, weight: 0.25, weightedScore: baseMarket * 0.25 },
    { name: "Clinical Success", score: clinical, weight: 0.20, weightedScore: clinical * 0.20 },
    { name: "Commercial Advantage", score: commercial, weight: 0.18, weightedScore: commercial * 0.18 },
    { name: "Strategic Positioning", score: strategic, weight: 0.15, weightedScore: strategic * 0.15 },
    { name: "Competitive Intensity", score: competitive, weight: 0.12, weightedScore: competitive * 0.12 },
    { name: "Market Access", score: marketAccess, weight: 0.10, weightedScore: marketAccess * 0.10 },
    { name: "Pricing Power", score: pricing, weight: 0.10, weightedScore: pricing * 0.10 },
  ];

  const compositeScore = componentScores.reduce((sum, c) => sum + c.weightedScore, 0);
  const blockbusterProbability = calculateBlockbusterProbability(compositeScore);
  
  // Peak sales estimate based on composite score
  const basePeakSales = 2.5; // Billion USD baseline
  const peakSalesEstimate = basePeakSales * Math.pow(compositeScore / 100, 2) * 10;

  return {
    compositeScore: Math.round(compositeScore * 10) / 10,
    blockbusterProbability,
    peakSalesEstimate: Math.round(peakSalesEstimate * 100) / 100,
    componentScores
  };
};

// Helper function to get score color class
export const getPeakSalesScoreColor = (score: number): string => {
  if (score >= 80) return "text-[hsl(142,76%,36%)]";
  if (score >= 60) return "text-[hsl(45,93%,47%)]";
  if (score >= 40) return "text-[hsl(25,95%,53%)]";
  return "text-[hsl(0,72%,51%)]";
};

// Helper function to get score background color class
export const getPeakSalesScoreBgColor = (score: number): string => {
  if (score >= 80) return "bg-[hsl(142,76%,90%)] border-[hsl(142,76%,36%)]";
  if (score >= 60) return "bg-[hsl(45,93%,90%)] border-[hsl(45,93%,47%)]";
  if (score >= 40) return "bg-[hsl(25,95%,90%)] border-[hsl(25,95%,53%)]";
  return "bg-[hsl(0,72%,95%)] border-[hsl(0,72%,51%)]";
};
