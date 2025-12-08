// Time-to-Market data across 20 Therapeutic Areas
// Each TA has weighted contributions: Discovery (27%), Clinical (50%), Regulatory (8%), Market Access (8%), Launch (7%)

export interface TTMBreakdown {
  therapeuticArea: string;
  discovery: number; // years
  clinical: number; // years
  regulatory: number; // years
  marketAccess: number; // years
  launch: number; // years
  totalYears: number;
  totalMonths: number;
}

export const TTM_BREAKDOWN_DATA: TTMBreakdown[] = [
  { therapeuticArea: 'Oncology/Hematology', discovery: 2.97, clinical: 5.5, regulatory: 0.88, marketAccess: 0.88, launch: 0.77, totalYears: 11, totalMonths: 132 },
  { therapeuticArea: 'Cardiovascular/Cardiology', discovery: 3.65, clinical: 6.75, regulatory: 1.08, marketAccess: 1.08, launch: 0.95, totalYears: 13.5, totalMonths: 162 },
  { therapeuticArea: 'Neurology/CNS', discovery: 4.05, clinical: 7.5, regulatory: 1.2, marketAccess: 1.2, launch: 1.05, totalYears: 15, totalMonths: 180 },
  { therapeuticArea: 'Psychiatry/Mental Health', discovery: 2.84, clinical: 5.25, regulatory: 0.84, marketAccess: 0.84, launch: 0.74, totalYears: 10.5, totalMonths: 126 },
  { therapeuticArea: 'Endocrinology & Metabolism', discovery: 3.51, clinical: 6.5, regulatory: 1.04, marketAccess: 1.04, launch: 0.91, totalYears: 13, totalMonths: 156 },
  { therapeuticArea: 'Immunology & Inflammation', discovery: 3.11, clinical: 5.75, regulatory: 0.92, marketAccess: 0.92, launch: 0.81, totalYears: 11.5, totalMonths: 138 },
  { therapeuticArea: 'Rheumatology', discovery: 2.84, clinical: 5.25, regulatory: 0.84, marketAccess: 0.84, launch: 0.74, totalYears: 10.5, totalMonths: 126 },
  { therapeuticArea: 'Infectious Diseases', discovery: 2.43, clinical: 4.5, regulatory: 0.72, marketAccess: 0.72, launch: 0.63, totalYears: 9, totalMonths: 108 },
  { therapeuticArea: 'Respiratory/Pulmonology', discovery: 2.97, clinical: 5.5, regulatory: 0.88, marketAccess: 0.88, launch: 0.77, totalYears: 11, totalMonths: 132 },
  { therapeuticArea: 'Gastroenterology & Hepatology', discovery: 3.38, clinical: 6.25, regulatory: 1, marketAccess: 1, launch: 0.88, totalYears: 12.5, totalMonths: 150 },
  { therapeuticArea: 'Nephrology/Renal', discovery: 3.38, clinical: 6.25, regulatory: 1, marketAccess: 1, launch: 0.88, totalYears: 12.5, totalMonths: 150 },
  { therapeuticArea: 'Dermatology', discovery: 2.43, clinical: 4.5, regulatory: 0.72, marketAccess: 0.72, launch: 0.63, totalYears: 9, totalMonths: 108 },
  { therapeuticArea: 'Ophthalmology', discovery: 3.11, clinical: 5.75, regulatory: 0.92, marketAccess: 0.92, launch: 0.81, totalYears: 11.5, totalMonths: 138 },
  { therapeuticArea: 'Rare Diseases/Orphan', discovery: 2.16, clinical: 4, regulatory: 0.64, marketAccess: 0.64, launch: 0.56, totalYears: 8, totalMonths: 96 },
  { therapeuticArea: 'Vaccines & Virology', discovery: 2.03, clinical: 3.75, regulatory: 0.6, marketAccess: 0.6, launch: 0.53, totalYears: 7.5, totalMonths: 90 },
  { therapeuticArea: 'Women\'s Health', discovery: 2.84, clinical: 5.25, regulatory: 0.84, marketAccess: 0.84, launch: 0.74, totalYears: 10.5, totalMonths: 126 },
  { therapeuticArea: 'Urology', discovery: 2.7, clinical: 5, regulatory: 0.8, marketAccess: 0.8, launch: 0.7, totalYears: 10, totalMonths: 120 },
  { therapeuticArea: 'Pain Management/Anesthesia', discovery: 2.43, clinical: 4.5, regulatory: 0.72, marketAccess: 0.72, launch: 0.63, totalYears: 9, totalMonths: 108 },
  { therapeuticArea: 'Transplantation & Cell/Gene Therapy', discovery: 2.7, clinical: 5, regulatory: 0.8, marketAccess: 0.8, launch: 0.7, totalYears: 10, totalMonths: 120 },
  { therapeuticArea: 'Pediatrics', discovery: 3.51, clinical: 6.5, regulatory: 1.04, marketAccess: 1.04, launch: 0.91, totalYears: 13, totalMonths: 156 },
];

// Weighted contribution percentages
export const TTM_PHASE_WEIGHTS = {
  discovery: 0.27,
  clinical: 0.50,
  regulatory: 0.08,
  marketAccess: 0.08,
  launch: 0.07, // Note: Chart shows 7% but labeled as 4% - using 7% to match total
};

// Get TTM data for a specific therapeutic area
export function getTTMBreakdownForTA(therapeuticArea: string): TTMBreakdown | undefined {
  const taLower = therapeuticArea.toLowerCase();
  
  return TTM_BREAKDOWN_DATA.find(item => {
    const itemLower = item.therapeuticArea.toLowerCase();
    return itemLower.includes(taLower) || 
           taLower.includes(itemLower.split('/')[0]) ||
           taLower.includes(itemLower.split(' ')[0]);
  });
}

// Normalize TA name to match TTM data
export function getTTMMonthsForTA(therapeuticArea: string): number {
  const taLower = therapeuticArea.toLowerCase();
  
  // Map common TA names to our data
  if (taLower.includes('oncology') || taLower.includes('hematology') || taLower.includes('cancer')) {
    return 132;
  }
  if (taLower.includes('cardio') || taLower.includes('heart')) {
    return 162;
  }
  if (taLower.includes('neuro') || taLower.includes('cns') || taLower.includes('alzheimer')) {
    return 180;
  }
  if (taLower.includes('psych') || taLower.includes('mental')) {
    return 126;
  }
  if (taLower.includes('metabol') || taLower.includes('diabet') || taLower.includes('endocrin') || taLower.includes('obesity')) {
    return 156;
  }
  if (taLower.includes('immun') || taLower.includes('inflam')) {
    return 138;
  }
  if (taLower.includes('rheum') || taLower.includes('arthritis')) {
    return 126;
  }
  if (taLower.includes('infect') || taLower.includes('virus') || taLower.includes('bacter')) {
    return 108;
  }
  if (taLower.includes('respir') || taLower.includes('pulmon') || taLower.includes('lung')) {
    return 132;
  }
  if (taLower.includes('gastro') || taLower.includes('hepat') || taLower.includes('liver')) {
    return 150;
  }
  if (taLower.includes('nephro') || taLower.includes('renal') || taLower.includes('kidney')) {
    return 150;
  }
  if (taLower.includes('derma') || taLower.includes('skin')) {
    return 108;
  }
  if (taLower.includes('ophthal') || taLower.includes('eye')) {
    return 138;
  }
  if (taLower.includes('rare') || taLower.includes('orphan')) {
    return 96;
  }
  if (taLower.includes('vaccin') || taLower.includes('virol')) {
    return 90;
  }
  if (taLower.includes('women') || taLower.includes('gynec') || taLower.includes('obstet')) {
    return 126;
  }
  if (taLower.includes('urol') || taLower.includes('prostat')) {
    return 120;
  }
  if (taLower.includes('pain') || taLower.includes('anesth')) {
    return 108;
  }
  if (taLower.includes('transplant') || taLower.includes('cell') || taLower.includes('gene')) {
    return 120;
  }
  if (taLower.includes('pediatr') || taLower.includes('child')) {
    return 156;
  }
  
  // Default to average
  return 132;
}
