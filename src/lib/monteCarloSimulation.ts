// =====================================================
// MONTE CARLO SIMULATION FOR PEAK SALES ESTIMATION
// Generates probability distributions with configurable uncertainty
// =====================================================

export interface SimulationConfig {
  iterations: number;
  uncertaintyRange: number; // Percentage ±
  confidenceInterval: number; // e.g., 95
}

export interface ComponentUncertainty {
  name: string;
  baseScore: number;
  minScore: number;
  maxScore: number;
  weight: number;
}

export interface SimulationResult {
  peakSalesDistribution: number[];
  probabilityDistribution: number[];
  compositeScoreDistribution: number[];
  statistics: SimulationStatistics;
  percentiles: PercentileData;
  histogram: HistogramBin[];
}

export interface SimulationStatistics {
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
  skewness: number;
  kurtosis: number;
}

export interface PercentileData {
  p5: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
}

export interface HistogramBin {
  range: string;
  count: number;
  percentage: number;
  minValue: number;
  maxValue: number;
}

// Box-Muller transform for generating normal distribution
const randomNormal = (mean: number, stdDev: number): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
};

// Triangular distribution (better for bounded ranges)
const randomTriangular = (min: number, mode: number, max: number): number => {
  const u = Math.random();
  const fc = (mode - min) / (max - min);
  if (u < fc) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  }
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
};

// Calculate blockbuster probability from composite score
const calculateBlockbusterProbability = (compositeScore: number): number => {
  const mu = 65;
  const sigma = 10;
  return 1 / (1 + Math.exp(-(compositeScore - mu) / sigma));
};

// Calculate peak sales from composite score
const calculatePeakSales = (compositeScore: number): number => {
  const basePeakSales = 2.5;
  return basePeakSales * Math.pow(compositeScore / 100, 2) * 10;
};

// Calculate statistics from an array of values
const calculateStatistics = (values: number[]): SimulationStatistics => {
  const n = values.length;
  const sorted = [...values].sort((a, b) => a - b);
  
  const mean = values.reduce((sum, v) => sum + v, 0) / n;
  const median = n % 2 === 0 
    ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
    : sorted[Math.floor(n/2)];
  
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Skewness
  const skewness = values.reduce((sum, v) => sum + Math.pow((v - mean) / stdDev, 3), 0) / n;
  
  // Excess kurtosis
  const kurtosis = values.reduce((sum, v) => sum + Math.pow((v - mean) / stdDev, 4), 0) / n - 3;
  
  return {
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    min: Math.round(sorted[0] * 100) / 100,
    max: Math.round(sorted[n - 1] * 100) / 100,
    skewness: Math.round(skewness * 100) / 100,
    kurtosis: Math.round(kurtosis * 100) / 100,
  };
};

// Calculate percentiles
const calculatePercentiles = (values: number[]): PercentileData => {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  
  const getPercentile = (p: number) => {
    const index = Math.floor(p * n / 100);
    return Math.round(sorted[index] * 100) / 100;
  };
  
  return {
    p5: getPercentile(5),
    p10: getPercentile(10),
    p25: getPercentile(25),
    p50: getPercentile(50),
    p75: getPercentile(75),
    p90: getPercentile(90),
    p95: getPercentile(95),
  };
};

// Create histogram bins
const createHistogram = (values: number[], binCount: number = 20): HistogramBin[] => {
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const binWidth = (max - min) / binCount;
  
  const bins: HistogramBin[] = [];
  for (let i = 0; i < binCount; i++) {
    const minValue = min + i * binWidth;
    const maxValue = min + (i + 1) * binWidth;
    const count = values.filter(v => v >= minValue && v < maxValue).length;
    
    bins.push({
      range: `$${minValue.toFixed(1)}B - $${maxValue.toFixed(1)}B`,
      count,
      percentage: Math.round(count / values.length * 1000) / 10,
      minValue,
      maxValue,
    });
  }
  
  return bins;
};

// Main Monte Carlo simulation function
export const runMonteCarloSimulation = (
  componentScores: ComponentUncertainty[],
  config: SimulationConfig = { iterations: 10000, uncertaintyRange: 15, confidenceInterval: 95 }
): SimulationResult => {
  const { iterations, uncertaintyRange } = config;
  
  const peakSalesDistribution: number[] = [];
  const probabilityDistribution: number[] = [];
  const compositeScoreDistribution: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    let compositeScore = 0;
    
    // Simulate each component with uncertainty
    for (const component of componentScores) {
      // Calculate min/max based on uncertainty range
      const minScore = Math.max(0, component.baseScore * (1 - uncertaintyRange / 100));
      const maxScore = Math.min(100, component.baseScore * (1 + uncertaintyRange / 100));
      
      // Use triangular distribution with base score as mode
      const simulatedScore = randomTriangular(minScore, component.baseScore, maxScore);
      
      compositeScore += simulatedScore * component.weight;
    }
    
    compositeScore = Math.min(100, Math.max(0, compositeScore));
    compositeScoreDistribution.push(compositeScore);
    
    const peakSales = calculatePeakSales(compositeScore);
    peakSalesDistribution.push(peakSales);
    
    const probability = calculateBlockbusterProbability(compositeScore) * 100;
    probabilityDistribution.push(probability);
  }
  
  return {
    peakSalesDistribution,
    probabilityDistribution,
    compositeScoreDistribution,
    statistics: calculateStatistics(peakSalesDistribution),
    percentiles: calculatePercentiles(peakSalesDistribution),
    histogram: createHistogram(peakSalesDistribution),
  };
};

// Sensitivity analysis - which component has the most impact
export interface SensitivityResult {
  componentName: string;
  baseImpact: number;
  upImpact: number;
  downImpact: number;
  sensitivity: number;
}

export const runSensitivityAnalysis = (
  componentScores: ComponentUncertainty[],
  perturbation: number = 10
): SensitivityResult[] => {
  // Calculate base case
  const baseComposite = componentScores.reduce(
    (sum, c) => sum + c.baseScore * c.weight, 
    0
  );
  const basePeakSales = calculatePeakSales(baseComposite);
  
  const results: SensitivityResult[] = [];
  
  for (const component of componentScores) {
    // Calculate impact of +perturbation%
    const upScore = Math.min(100, component.baseScore * (1 + perturbation / 100));
    const upComposite = baseComposite - component.baseScore * component.weight + upScore * component.weight;
    const upPeakSales = calculatePeakSales(upComposite);
    
    // Calculate impact of -perturbation%
    const downScore = Math.max(0, component.baseScore * (1 - perturbation / 100));
    const downComposite = baseComposite - component.baseScore * component.weight + downScore * component.weight;
    const downPeakSales = calculatePeakSales(downComposite);
    
    const upImpact = ((upPeakSales - basePeakSales) / basePeakSales) * 100;
    const downImpact = ((downPeakSales - basePeakSales) / basePeakSales) * 100;
    const sensitivity = Math.abs(upImpact) + Math.abs(downImpact);
    
    results.push({
      componentName: component.name,
      baseImpact: basePeakSales,
      upImpact: Math.round(upImpact * 10) / 10,
      downImpact: Math.round(downImpact * 10) / 10,
      sensitivity: Math.round(sensitivity * 10) / 10,
    });
  }
  
  return results.sort((a, b) => b.sensitivity - a.sensitivity);
};

// Scenario analysis
export interface ScenarioConfig {
  name: string;
  adjustments: Record<string, number>; // component name -> adjustment factor
}

export interface ScenarioResult {
  name: string;
  compositeScore: number;
  peakSales: number;
  blockbusterProbability: number;
  deltaFromBase: number;
}

export const runScenarioAnalysis = (
  componentScores: ComponentUncertainty[],
  scenarios: ScenarioConfig[]
): ScenarioResult[] => {
  const baseComposite = componentScores.reduce(
    (sum, c) => sum + c.baseScore * c.weight, 
    0
  );
  const basePeakSales = calculatePeakSales(baseComposite);
  
  const results: ScenarioResult[] = [
    {
      name: 'Base Case',
      compositeScore: Math.round(baseComposite * 10) / 10,
      peakSales: Math.round(basePeakSales * 100) / 100,
      blockbusterProbability: Math.round(calculateBlockbusterProbability(baseComposite) * 1000) / 10,
      deltaFromBase: 0,
    },
  ];
  
  for (const scenario of scenarios) {
    let scenarioComposite = 0;
    
    for (const component of componentScores) {
      const adjustment = scenario.adjustments[component.name] || 0;
      const adjustedScore = Math.min(100, Math.max(0, component.baseScore * (1 + adjustment)));
      scenarioComposite += adjustedScore * component.weight;
    }
    
    const scenarioPeakSales = calculatePeakSales(scenarioComposite);
    
    results.push({
      name: scenario.name,
      compositeScore: Math.round(scenarioComposite * 10) / 10,
      peakSales: Math.round(scenarioPeakSales * 100) / 100,
      blockbusterProbability: Math.round(calculateBlockbusterProbability(scenarioComposite) * 1000) / 10,
      deltaFromBase: Math.round((scenarioPeakSales - basePeakSales) / basePeakSales * 1000) / 10,
    });
  }
  
  return results;
};

// Predefined scenarios
export const DEFAULT_SCENARIOS: ScenarioConfig[] = [
  {
    name: 'Bull Case',
    adjustments: {
      'Base Market Size': 0.15,
      'Clinical Success': 0.20,
      'Commercial Advantage': 0.10,
      'Competitive Intensity': 0.15,
    },
  },
  {
    name: 'Bear Case',
    adjustments: {
      'Base Market Size': -0.10,
      'Clinical Success': -0.15,
      'Commercial Advantage': -0.10,
      'Competitive Intensity': -0.20,
    },
  },
  {
    name: 'Competitive Pressure',
    adjustments: {
      'Competitive Intensity': -0.30,
      'Pricing Power': -0.15,
    },
  },
  {
    name: 'Clinical Outperformance',
    adjustments: {
      'Clinical Success': 0.25,
      'Commercial Advantage': 0.15,
    },
  },
];
