import * as XLSX from 'xlsx';
import { calculateLPI3ForMolecule } from './lpi3Model';
import { getTTMMonthsForTA } from './ttmData';
import { calculateProbabilityScores } from './scoring';

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  company: string;
  ticker?: string;
  indication?: string;
  trialName?: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
  revenueProjection?: { year1: number; year2: number };
}

export function exportMoleculesToExcel(molecules: MoleculeProfile[], filename = 'molecules-data') {
  // Prepare data with all calculated scores
  const data = molecules.map((mol) => {
    const lpi3 = calculateLPI3ForMolecule(mol);
    const lpiScore = Math.round(lpi3.calibratedProbability * 100);
    const ciLower = Math.round(lpi3.confidenceInterval.lower * 100);
    const ciUpper = Math.round(lpi3.confidenceInterval.upper * 100);
    const ttmMonths = getTTMMonthsForTA(mol.therapeuticArea);
    const probScores = calculateProbabilityScores(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.isFailed);
    
    // Calculate composite score
    const lpiNormalized = lpi3.calibratedProbability;
    const ttmNormalized = Math.max(0, Math.min(1, 1 - (ttmMonths - 12) / (120 - 12)));
    const compositeScore = Math.round((lpiNormalized * 0.6 + ttmNormalized * 0.4) * 100);

    return {
      'Molecule Name': mol.name,
      'Company': mol.company,
      'Ticker': mol.ticker || '',
      'Phase': mol.phase,
      'Therapeutic Area': mol.therapeuticArea,
      'Indication': mol.indication || '',
      'Trial Name': mol.trialName || '',
      'LPI Score (%)': lpiScore,
      'LPI CI Lower (%)': ciLower,
      'LPI CI Upper (%)': ciUpper,
      'Approval Probability (%)': Math.round(probScores.approval * 100),
      'Next Phase Probability (%)': Math.round(probScores.nextPhase * 100),
      'TTM (Months)': ttmMonths,
      'Composite Score (%)': compositeScore,
      'Year 1 Revenue ($M)': mol.revenueProjection?.year1 || 0,
      'Year 2 Revenue ($M)': mol.revenueProjection?.year2 || 0,
      'Company Track Record': mol.companyTrackRecord || 'average',
      'Status': mol.isFailed ? 'Failed' : 'Active',
    };
  });

  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Molecules');

  // Auto-size columns
  const maxWidth = 40;
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.min(maxWidth, Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length))),
  }));
  ws['!cols'] = colWidths;

  // Generate and download file
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportLPIDetailedToExcel(molecules: MoleculeProfile[], filename = 'lpi-detailed') {
  // Prepare detailed LPI data
  const data = molecules.map((mol) => {
    const lpi3 = calculateLPI3ForMolecule(mol);
    const lpiScore = Math.round(lpi3.calibratedProbability * 100);
    
    // Aggregate category scores
    const categoryScores: Record<string, number> = {};
    lpi3.featureCategories.forEach((cat) => {
      const avgScore = cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length;
      categoryScores[cat.name] = Math.round(avgScore * 100);
    });

    // Determine risk level from flags
    const riskLevel = lpi3.riskFlags.length === 0 ? 'Low' : 
                      lpi3.riskFlags.some(f => f.severity === 'critical' || f.severity === 'high') ? 'High' : 'Medium';

    return {
      'Molecule Name': mol.name,
      'Company': mol.company,
      'Phase': mol.phase,
      'Therapeutic Area': mol.therapeuticArea,
      'LPI Score (%)': lpiScore,
      'CI Lower (%)': Math.round(lpi3.confidenceInterval.lower * 100),
      'CI Upper (%)': Math.round(lpi3.confidenceInterval.upper * 100),
      'Risk Level': riskLevel,
      'Scientific/Preclinical (%)': categoryScores['Scientific / Preclinical'] || 0,
      'Clinical Signals (%)': categoryScores['Clinical Signals'] || 0,
      'Regulatory & Program (%)': categoryScores['Regulatory & Program'] || 0,
      'Sponsor/Organization (%)': categoryScores['Sponsor / Organization'] || 0,
      'Market & Commercial (%)': categoryScores['Market & Commercial'] || 0,
      'Safety & History (%)': categoryScores['Safety & History'] || 0,
    };
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'LPI Detailed');

  // Auto-size columns
  const maxWidth = 30;
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.min(maxWidth, Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length))),
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportTherapeuticAreaSummary(molecules: MoleculeProfile[], filename = 'ta-summary') {
  // Group by therapeutic area
  const taGroups: Record<string, MoleculeProfile[]> = {};
  molecules.forEach((mol) => {
    const ta = mol.therapeuticArea || 'Unknown';
    if (!taGroups[ta]) taGroups[ta] = [];
    taGroups[ta].push(mol);
  });

  const data = Object.entries(taGroups).map(([ta, mols]) => {
    const lpiScores = mols.map((mol) => {
      const lpi3 = calculateLPI3ForMolecule(mol);
      return lpi3.calibratedProbability * 100;
    });
    const avgLPI = lpiScores.reduce((a, b) => a + b, 0) / lpiScores.length;
    const minLPI = Math.min(...lpiScores);
    const maxLPI = Math.max(...lpiScores);

    const phaseCount: Record<string, number> = {};
    mols.forEach((mol) => {
      phaseCount[mol.phase] = (phaseCount[mol.phase] || 0) + 1;
    });

    return {
      'Therapeutic Area': ta,
      'Total Molecules': mols.length,
      'Avg LPI (%)': Math.round(avgLPI),
      'Min LPI (%)': Math.round(minLPI),
      'Max LPI (%)': Math.round(maxLPI),
      'Phase 1 Count': phaseCount['Phase 1'] || 0,
      'Phase 2 Count': phaseCount['Phase 2'] || 0,
      'Phase 3 Count': phaseCount['Phase 3'] || 0,
      'NDA/BLA Count': phaseCount['NDA/BLA'] || 0,
    };
  });

  // Sort by molecule count descending
  data.sort((a, b) => b['Total Molecules'] - a['Total Molecules']);

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'TA Summary');

  const maxWidth = 25;
  const colWidths = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.min(maxWidth, Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length))),
  }));
  ws['!cols'] = colWidths;

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportComparisonToExcel(molecules: MoleculeProfile[], filename = 'molecule-comparison') {
  if (molecules.length < 2) return;

  // Create comparison data with all molecules side by side
  const comparisonData: Record<string, string | number>[] = [];
  
  // Define metrics to compare
  const metrics = [
    'Molecule Name',
    'Company',
    'Ticker',
    'Phase',
    'Therapeutic Area',
    'Indication',
    'LPI Score (%)',
    'CI Lower (%)',
    'CI Upper (%)',
    'Risk Level',
    'Approval Probability (%)',
    'Next Phase Probability (%)',
    'TTM (Months)',
    'Composite Score (%)',
    'Scientific/Preclinical (%)',
    'Clinical Signals (%)',
    'Regulatory & Program (%)',
    'Sponsor/Organization (%)',
    'Market & Commercial (%)',
    'Safety & History (%)',
    'Company Track Record',
    'Status',
  ];

  // Build row-based comparison (metrics as rows, molecules as columns)
  metrics.forEach(metric => {
    const row: Record<string, string | number> = { 'Metric': metric };
    
    molecules.forEach((mol, idx) => {
      const lpi3 = calculateLPI3ForMolecule(mol);
      const lpiScore = Math.round(lpi3.calibratedProbability * 100);
      const ttmMonths = getTTMMonthsForTA(mol.therapeuticArea);
      const probScores = calculateProbabilityScores(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.isFailed);
      
      const lpiNormalized = lpi3.calibratedProbability;
      const ttmNormalized = Math.max(0, Math.min(1, 1 - (ttmMonths - 12) / (120 - 12)));
      const compositeScore = Math.round((lpiNormalized * 0.6 + ttmNormalized * 0.4) * 100);

      const categoryScores: Record<string, number> = {};
      lpi3.featureCategories.forEach((cat) => {
        const avgScore = cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length;
        categoryScores[cat.name] = Math.round(avgScore * 100);
      });

      const riskLevel = lpi3.riskFlags.length === 0 ? 'Low' : 
                        lpi3.riskFlags.some(f => f.severity === 'critical' || f.severity === 'high') ? 'High' : 'Medium';

      const values: Record<string, string | number> = {
        'Molecule Name': mol.name,
        'Company': mol.company,
        'Ticker': mol.ticker || 'N/A',
        'Phase': mol.phase,
        'Therapeutic Area': mol.therapeuticArea,
        'Indication': mol.indication || 'N/A',
        'LPI Score (%)': lpiScore,
        'CI Lower (%)': Math.round(lpi3.confidenceInterval.lower * 100),
        'CI Upper (%)': Math.round(lpi3.confidenceInterval.upper * 100),
        'Risk Level': riskLevel,
        'Approval Probability (%)': Math.round(probScores.approval * 100),
        'Next Phase Probability (%)': Math.round(probScores.nextPhase * 100),
        'TTM (Months)': ttmMonths,
        'Composite Score (%)': compositeScore,
        'Scientific/Preclinical (%)': categoryScores['Scientific / Preclinical'] || 0,
        'Clinical Signals (%)': categoryScores['Clinical Signals'] || 0,
        'Regulatory & Program (%)': categoryScores['Regulatory & Program'] || 0,
        'Sponsor/Organization (%)': categoryScores['Sponsor / Organization'] || 0,
        'Market & Commercial (%)': categoryScores['Market & Commercial'] || 0,
        'Safety & History (%)': categoryScores['Safety & History'] || 0,
        'Company Track Record': mol.companyTrackRecord || 'average',
        'Status': mol.isFailed ? 'Failed' : 'Active',
      };

      row[`Molecule ${idx + 1}`] = values[metric];
    });

    comparisonData.push(row);
  });

  const ws = XLSX.utils.json_to_sheet(comparisonData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Side-by-Side Comparison');

  // Also add individual molecule sheets
  molecules.forEach((mol, idx) => {
    const lpi3 = calculateLPI3ForMolecule(mol);
    const lpiScore = Math.round(lpi3.calibratedProbability * 100);
    const ttmMonths = getTTMMonthsForTA(mol.therapeuticArea);
    const probScores = calculateProbabilityScores(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.isFailed);

    const categoryScores: Record<string, number> = {};
    lpi3.featureCategories.forEach((cat) => {
      const avgScore = cat.features.reduce((sum, f) => sum + f.value, 0) / cat.features.length;
      categoryScores[cat.name] = Math.round(avgScore * 100);
    });

    const molData = [{
      'Molecule Name': mol.name,
      'Company': mol.company,
      'Phase': mol.phase,
      'Therapeutic Area': mol.therapeuticArea,
      'LPI Score (%)': lpiScore,
      'Approval Probability (%)': Math.round(probScores.approval * 100),
      'TTM (Months)': ttmMonths,
      'Scientific/Preclinical (%)': categoryScores['Scientific / Preclinical'] || 0,
      'Clinical Signals (%)': categoryScores['Clinical Signals'] || 0,
      'Regulatory & Program (%)': categoryScores['Regulatory & Program'] || 0,
      'Sponsor/Organization (%)': categoryScores['Sponsor / Organization'] || 0,
      'Market & Commercial (%)': categoryScores['Market & Commercial'] || 0,
      'Safety & History (%)': categoryScores['Safety & History'] || 0,
    }];

    const molWs = XLSX.utils.json_to_sheet(molData);
    const sheetName = mol.name.slice(0, 28).replace(/[\\/*?[\]:]/g, ''); // Excel sheet name limits
    XLSX.utils.book_append_sheet(wb, molWs, sheetName);
  });

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}
