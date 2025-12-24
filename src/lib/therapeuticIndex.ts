// Therapeutic Index (TI) calculation and data
// TI = TD50/ED50 (Toxic Dose 50 / Effective Dose 50)
// Higher TI = safer drug with wider margin between efficacy and toxicity

import { type TherapeuticIndex } from './moleculesData';

// Classification thresholds:
// Narrow: TI < 2 (requires careful monitoring, e.g., warfarin, digoxin, lithium)
// Moderate: TI 2-10 (standard monitoring)
// Wide: TI > 10 (generally safe, e.g., penicillin, ibuprofen)

export function classifyTherapeuticIndex(ti: number): 'narrow' | 'moderate' | 'wide' {
  if (ti < 2) return 'narrow';
  if (ti <= 10) return 'moderate';
  return 'wide';
}

export function getTherapeuticIndexColor(classification: 'narrow' | 'moderate' | 'wide'): string {
  switch (classification) {
    case 'narrow':
      return 'text-[hsl(0,72%,51%)]'; // Red - high risk
    case 'moderate':
      return 'text-[hsl(45,93%,47%)]'; // Yellow - moderate risk
    case 'wide':
      return 'text-[hsl(142,76%,36%)]'; // Green - low risk
  }
}

export function getTherapeuticIndexBgColor(classification: 'narrow' | 'moderate' | 'wide'): string {
  switch (classification) {
    case 'narrow':
      return 'bg-[hsl(0,72%,51%)]';
    case 'moderate':
      return 'bg-[hsl(45,93%,47%)]';
    case 'wide':
      return 'bg-[hsl(142,76%,36%)]';
  }
}

// Generate TI based on drug class and therapeutic area
export function generateTherapeuticIndex(
  drugClass: string,
  therapeuticArea: string,
  phase: string
): TherapeuticIndex {
  // Base TI by drug class (empirical values based on pharmacology literature)
  const classBaseTI: Record<string, { base: number; monitoring: boolean; notes: string }> = {
    // Narrow TI drugs
    'warfarin': { base: 1.5, monitoring: true, notes: 'Requires regular INR monitoring' },
    'digoxin': { base: 1.6, monitoring: true, notes: 'Narrow margin between therapeutic and toxic levels' },
    'lithium': { base: 1.3, monitoring: true, notes: 'Requires serum level monitoring' },
    'theophylline': { base: 1.8, monitoring: true, notes: 'Narrow therapeutic window' },
    'phenytoin': { base: 1.5, monitoring: true, notes: 'Nonlinear pharmacokinetics' },
    'aminoglycoside': { base: 1.4, monitoring: true, notes: 'Nephrotoxicity and ototoxicity risk' },
    'cyclosporine': { base: 1.6, monitoring: true, notes: 'Immunosuppressant with renal toxicity' },
    'tacrolimus': { base: 1.5, monitoring: true, notes: 'Calcineurin inhibitor, nephrotoxic' },
    
    // Cytotoxic/Oncology - generally narrow
    'cytotoxic': { base: 1.8, monitoring: true, notes: 'Chemotherapy requires dose monitoring' },
    'adc': { base: 2.5, monitoring: true, notes: 'Targeted delivery improves TI vs cytotoxics' },
    'antibody-drug conjugate': { base: 2.5, monitoring: true, notes: 'Targeted delivery improves TI' },
    'bispecific': { base: 3.5, monitoring: true, notes: 'CRS risk requires step-up dosing' },
    'car-t': { base: 2.0, monitoring: true, notes: 'CRS and neurotoxicity require monitoring' },
    'kinase inhibitor': { base: 4.5, monitoring: true, notes: 'Off-target effects possible' },
    'tyrosine kinase': { base: 4.0, monitoring: true, notes: 'Monitor for cardiac and hepatic effects' },
    
    // Moderate TI
    'monoclonal antibody': { base: 6.0, monitoring: false, notes: 'Target specificity improves safety' },
    'anti-pd-1': { base: 5.5, monitoring: true, notes: 'Immune-related adverse events possible' },
    'anti-pd-l1': { base: 5.5, monitoring: true, notes: 'Immune-related adverse events possible' },
    'checkpoint inhibitor': { base: 5.0, monitoring: true, notes: 'irAEs require monitoring' },
    'jak inhibitor': { base: 4.0, monitoring: true, notes: 'Infection and thrombosis risk' },
    'sglt2 inhibitor': { base: 8.0, monitoring: false, notes: 'DKA risk in specific populations' },
    'glp-1 agonist': { base: 12.0, monitoring: false, notes: 'GI tolerability main concern' },
    'dpp-4 inhibitor': { base: 15.0, monitoring: false, notes: 'Generally well tolerated' },
    'insulin': { base: 3.5, monitoring: true, notes: 'Hypoglycemia risk' },
    'statin': { base: 20.0, monitoring: false, notes: 'Wide therapeutic window' },
    'ace inhibitor': { base: 15.0, monitoring: false, notes: 'Wide safety margin' },
    'arb': { base: 18.0, monitoring: false, notes: 'Well tolerated' },
    'beta blocker': { base: 8.0, monitoring: false, notes: 'Bradycardia at high doses' },
    'calcium channel': { base: 10.0, monitoring: false, notes: 'Moderate safety margin' },
    
    // Wide TI
    'nsaid': { base: 12.0, monitoring: false, notes: 'GI and renal concerns at high doses' },
    'antihistamine': { base: 25.0, monitoring: false, notes: 'Very wide therapeutic window' },
    'penicillin': { base: 100.0, monitoring: false, notes: 'Exceptionally wide TI' },
    'proton pump': { base: 50.0, monitoring: false, notes: 'Very safe profile' },
    'ssri': { base: 30.0, monitoring: false, notes: 'Wide therapeutic index' },
    'snri': { base: 25.0, monitoring: false, notes: 'Wide safety margin' },
  };

  // TA-based adjustments
  const taAdjustments: Record<string, number> = {
    'Oncology/Hematology': 0.7,  // Generally narrower TI
    'Cardiovascular': 1.0,
    'Neurology/CNS': 0.85,
    'Psychiatry/Mental Health': 1.1,
    'Immunology & Inflammation': 0.9,
    'Endocrinology & Metabolism': 1.1,
    'Infectious Disease': 0.9,
    'Respiratory': 1.0,
    'Dermatology': 1.2, // Often topical, wider TI
    'Ophthalmology': 1.3, // Local delivery
    'Gastroenterology': 1.1,
    'Urology': 1.0,
    'Rare Disease': 0.85,
    'Rheumatology': 0.9,
    'Type 2 Diabetes': 1.1,
    'Obesity': 1.0,
  };

  // Find matching drug class
  const lowerClass = drugClass.toLowerCase();
  let baseTI = { base: 6.0, monitoring: false, notes: 'Standard therapeutic index' };
  
  for (const [key, value] of Object.entries(classBaseTI)) {
    if (lowerClass.includes(key)) {
      baseTI = value;
      break;
    }
  }

  // Apply TA adjustment
  const taMultiplier = taAdjustments[therapeuticArea] || 1.0;
  const adjustedTI = baseTI.base * taMultiplier;
  
  // Add some variability based on phase (earlier phase = more uncertainty)
  const phaseMultiplier = phase.toLowerCase().includes('approved') ? 1.0 :
                         phase.toLowerCase().includes('iii') ? 0.95 :
                         phase.toLowerCase().includes('ii') ? 0.9 : 0.85;
  
  const finalTI = adjustedTI * phaseMultiplier;
  const classification = classifyTherapeuticIndex(finalTI);

  return {
    value: Math.round(finalTI * 10) / 10,
    classification,
    ed50: Math.round((100 / finalTI) * 10) / 10, // Relative values
    td50: 100,
    monitoringRequired: baseTI.monitoring || classification === 'narrow',
    notes: baseTI.notes,
  };
}

// Generate TI for a molecule based on its drug info
export function getTherapeuticIndexForMolecule(molecule: {
  drugInfo?: { class: string };
  therapeuticArea: string;
  phase: string;
}): TherapeuticIndex {
  const drugClass = molecule.drugInfo?.class || 'standard therapeutic';
  return generateTherapeuticIndex(drugClass, molecule.therapeuticArea, molecule.phase);
}
