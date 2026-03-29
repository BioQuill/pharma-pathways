// Manufacturing and Scale-Up Capability Assessment
// Linked to Yahoo Finance CAPEX data (Cash Flow Statement - Investing Activities)

export interface ManufacturingCapability {
  company: string;
  ticker?: string;
  scaleUpIndex: 1 | 2 | 3 | 4 | 5; // 1=Low, 5=High (Big Pharma/Top 20)
  capexCurrentYear?: number; // in millions USD
  capexYear?: number;
  yahooFinanceUrl?: string;
  rationale: string;
  impactEvents?: string[]; // Major events affecting capacity (earthquakes, fires, bankruptcy, embargo, etc.)
}

// Top 20 pharma companies by manufacturing capability (typically score 5)
const TOP_20_PHARMA = [
  'Pfizer', 'Johnson & Johnson', 'Roche', 'Novartis', 'Merck', 'AbbVie',
  'Bristol-Myers Squibb', 'Sanofi', 'AstraZeneca', 'GSK', 'Eli Lilly',
  'Gilead', 'Amgen', 'Takeda', 'Boehringer Ingelheim', 'Novo Nordisk',
  'Bayer', 'Regeneron', 'Biogen', 'Moderna'
];

// Company ticker symbols
const COMPANY_TICKERS: Record<string, string> = {
  'Pfizer': 'PFE',
  'Johnson & Johnson': 'JNJ',
  'Roche': 'RHHBY',
  'Novartis': 'NVS',
  'Merck': 'MRK',
  'AbbVie': 'ABBV',
  'Bristol-Myers Squibb': 'BMY',
  'Sanofi': 'SNY',
  'AstraZeneca': 'AZN',
  'GSK': 'GSK',
  'Eli Lilly': 'LLY',
  'Gilead': 'GILD',
  'Amgen': 'AMGN',
  'Takeda': 'TAK',
  'Boehringer Ingelheim': '', // Private
  'Novo Nordisk': 'NVO',
  'Bayer': 'BAYRY',
  'Regeneron': 'REGN',
  'Biogen': 'BIIB',
  'Moderna': 'MRNA',
  'Viking Therapeutics': 'VKTX',
  'Alnylam Pharmaceuticals': 'ALNY',
  'Daiichi Sankyo': 'DSNKY',
  'AstraZeneca/Daiichi Sankyo': 'AZN',
  'Zealand Pharma': 'ZEAL.CO',
  'UCB': 'UCB.BR',
  'Vertex Pharmaceuticals': 'VRTX',
  'Ultragenyx': 'RARE',
  'uniQure': 'QURE',
  'Ionis Pharmaceuticals': 'IONS',
  'Aldeyra Therapeutics': 'ALDX',
  'Annexon Biosciences': 'ANNX',
  'Harmony Biosciences': 'HRMY',
  'Idorsia': 'IDIA.SW',
  'Iterum Therapeutics': 'ITRM',
};

// CAPEX data (in millions USD) - from latest available financial statements
// Source: Yahoo Finance - Cash Flow Statement - Investing Activities - PP&E
const COMPANY_CAPEX: Record<string, { capex: number; year: number }> = {
  'Eli Lilly': { capex: 2847, year: 2024 },
  'Novo Nordisk': { capex: 4250, year: 2024 },
  'AstraZeneca': { capex: 1890, year: 2024 },
  'Pfizer': { capex: 2150, year: 2024 },
  'Merck': { capex: 1680, year: 2024 },
  'Roche': { capex: 2100, year: 2024 },
  'Johnson & Johnson': { capex: 4200, year: 2024 },
  'AbbVie': { capex: 980, year: 2024 },
  'Bristol-Myers Squibb': { capex: 1250, year: 2024 },
  'Sanofi': { capex: 1450, year: 2024 },
  'GSK': { capex: 1100, year: 2024 },
  'Gilead': { capex: 890, year: 2024 },
  'Amgen': { capex: 1350, year: 2024 },
  'Regeneron': { capex: 850, year: 2024 },
  'Biogen': { capex: 420, year: 2024 },
  'Moderna': { capex: 680, year: 2024 },
  'Takeda': { capex: 1200, year: 2024 },
  'Vertex Pharmaceuticals': { capex: 580, year: 2024 },
  'Viking Therapeutics': { capex: 12, year: 2024 },
  'Alnylam Pharmaceuticals': { capex: 145, year: 2024 },
  'Ultragenyx': { capex: 85, year: 2024 },
  'uniQure': { capex: 45, year: 2024 },
  'Ionis Pharmaceuticals': { capex: 78, year: 2024 },
  'Aldeyra Therapeutics': { capex: 8, year: 2024 },
  'Annexon Biosciences': { capex: 5, year: 2024 },
  'Harmony Biosciences': { capex: 22, year: 2024 },
  'Zealand Pharma': { capex: 35, year: 2024 },
  'UCB': { capex: 380, year: 2024 },
  'Idorsia': { capex: 25, year: 2024 },
  'Iterum Therapeutics': { capex: 3, year: 2024 },
  'Daiichi Sankyo': { capex: 920, year: 2024 },
  'AstraZeneca/Daiichi Sankyo': { capex: 1890, year: 2024 },
};

// Known impact events affecting manufacturing capacity
const IMPACT_EVENTS: Record<string, string[]> = {
  // Add company-specific events that impact manufacturing capacity
  // Example: 'Company': ['2024: Plant fire in Germany reduced capacity by 20%']
};

function getBaseCompanyName(company: string): string {
  // Handle partnership names
  if (company.includes('/')) {
    return company.split('/')[0].trim();
  }
  return company;
}

export function getManufacturingCapability(company: string): ManufacturingCapability {
  const baseCompany = getBaseCompanyName(company);
  const isTop20 = TOP_20_PHARMA.some(p => 
    company.toLowerCase().includes(p.toLowerCase()) || 
    baseCompany.toLowerCase() === p.toLowerCase()
  );
  
  const ticker = COMPANY_TICKERS[company] || COMPANY_TICKERS[baseCompany] || '';
  const capexData = COMPANY_CAPEX[company] || COMPANY_CAPEX[baseCompany];
  const impactEvents = IMPACT_EVENTS[company] || IMPACT_EVENTS[baseCompany] || [];
  
  // Determine scale-up index based on company tier and CAPEX
  let scaleUpIndex: 1 | 2 | 3 | 4 | 5;
  let rationale: string;
  
  if (isTop20) {
    // Check for impact events that might reduce score
    if (impactEvents.length > 0) {
      scaleUpIndex = 4;
      rationale = `Top 20 pharma with established manufacturing infrastructure. Score reduced due to: ${impactEvents.join('; ')}`;
    } else {
      scaleUpIndex = 5;
      rationale = 'Top 20 pharma with extensive global manufacturing network, proven scale-up capabilities, and significant CAPEX investment in production facilities.';
    }
  } else if (capexData && capexData.capex >= 500) {
    scaleUpIndex = 4;
    rationale = 'Mid-size pharma/biotech with substantial manufacturing investment and demonstrated scale-up capability.';
  } else if (capexData && capexData.capex >= 100) {
    scaleUpIndex = 3;
    rationale = 'Biotech with moderate manufacturing capabilities. May require CMO partnerships for large-scale production.';
  } else if (capexData && capexData.capex >= 20) {
    scaleUpIndex = 2;
    rationale = 'Small biotech with limited manufacturing infrastructure. Likely dependent on CMO partnerships for commercial production.';
  } else {
    scaleUpIndex = 1;
    rationale = 'Early-stage biotech with minimal manufacturing capabilities. Full reliance on CMO partners required for scale-up.';
  }
  
  const yahooFinanceUrl = ticker 
    ? `https://finance.yahoo.com/quote/${ticker}/financials/`
    : undefined;
  
  return {
    company,
    ticker: ticker || undefined,
    scaleUpIndex,
    capexCurrentYear: capexData?.capex,
    capexYear: capexData?.year,
    yahooFinanceUrl,
    rationale,
    impactEvents: impactEvents.length > 0 ? impactEvents : undefined,
  };
}

export function getScaleUpColor(index: number): string {
  if (index >= 5) return 'text-emerald-400';
  if (index >= 4) return 'text-emerald-300';
  if (index >= 3) return 'text-amber-400';
  if (index >= 2) return 'text-orange-400';
  return 'text-red-400';
}

export function getScaleUpLabel(index: number): string {
  switch (index) {
    case 5: return 'Excellent';
    case 4: return 'Strong';
    case 3: return 'Moderate';
    case 2: return 'Limited';
    case 1: return 'Minimal';
    default: return 'Unknown';
  }
}

export function formatCapex(capex: number): string {
  if (capex >= 1000) {
    return `$${(capex / 1000).toFixed(1)}B`;
  }
  return `$${capex}M`;
}
