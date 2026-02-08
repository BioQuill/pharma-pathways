import * as XLSX from 'xlsx';

interface MAProbabilityScore {
  ticker: string;
  name: string;
  category: string;
  stage: string;
  marketCap: string;
  clinicalDataScore: number;
  marketOpportunityScore: number;
  strategicFitScore: number;
  financialPositionScore: number;
  totalScore: number;
  rank: number;
}

interface RedFlagCategory {
  name: string;
  items: { flag: string; severity: string }[];
}

export function exportMARankingsToExcel(scores: MAProbabilityScore[], filename = 'ma-probability-rankings') {
  const data = scores.map(s => ({
    'Rank': s.rank,
    'Ticker': s.ticker,
    'Company': s.name,
    'Category': s.category,
    'Stage': s.stage,
    'Market Cap': s.marketCap,
    'Clinical Data (0-25)': s.clinicalDataScore,
    'Market Opportunity (0-25)': s.marketOpportunityScore,
    'Strategic Fit (0-25)': s.strategicFitScore,
    'Financial Position (0-25)': s.financialPositionScore,
    'Total Score (0-100)': s.totalScore,
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'M&A Rankings');

  // Auto-size columns
  const maxWidth = 30;
  if (data.length > 0) {
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.min(maxWidth, Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length))),
    }));
    ws['!cols'] = colWidths;
  }

  // Add top 10 summary sheet
  const top10 = data.slice(0, 10);
  const top10Ws = XLSX.utils.json_to_sheet(top10);
  XLSX.utils.book_append_sheet(wb, top10Ws, 'Top 10 Targets');

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportRedFlagsToExcel(redFlags: RedFlagCategory[], filename = 'ma-due-diligence-red-flags') {
  const data = redFlags.flatMap(category =>
    category.items.map(item => ({
      'Category': category.name,
      'Red Flag': item.flag,
      'Severity': item.severity,
    }))
  );

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Red Flags Checklist');

  const maxWidth = 40;
  if (data.length > 0) {
    const colWidths = Object.keys(data[0]).map((key) => ({
      wch: Math.min(maxWidth, Math.max(key.length, ...data.map((row) => String(row[key as keyof typeof row]).length))),
    }));
    ws['!cols'] = colWidths;
  }

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportCombinedMAReport(
  scores: MAProbabilityScore[],
  redFlags: RedFlagCategory[],
  filename = 'ma-comprehensive-report'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Rankings
  const rankingsData = scores.map(s => ({
    'Rank': s.rank,
    'Ticker': s.ticker,
    'Company': s.name,
    'Category': s.category,
    'Stage': s.stage,
    'Market Cap': s.marketCap,
    'Clinical Data': s.clinicalDataScore,
    'Market Opportunity': s.marketOpportunityScore,
    'Strategic Fit': s.strategicFitScore,
    'Financial Position': s.financialPositionScore,
    'Total Score': s.totalScore,
  }));
  const rankingsWs = XLSX.utils.json_to_sheet(rankingsData);
  XLSX.utils.book_append_sheet(wb, rankingsWs, 'M&A Rankings');

  // Sheet 2: Top 10
  const top10Ws = XLSX.utils.json_to_sheet(rankingsData.slice(0, 10));
  XLSX.utils.book_append_sheet(wb, top10Ws, 'Top 10 Targets');

  // Sheet 3: Red Flags
  const redFlagsData = redFlags.flatMap(category =>
    category.items.map(item => ({
      'Category': category.name,
      'Red Flag': item.flag,
      'Severity': item.severity,
    }))
  );
  const redFlagsWs = XLSX.utils.json_to_sheet(redFlagsData);
  XLSX.utils.book_append_sheet(wb, redFlagsWs, 'Red Flags Checklist');

  // Sheet 4: Score by Category Summary
  const categoryGroups: Record<string, typeof scores> = {};
  scores.forEach(s => {
    if (!categoryGroups[s.category]) categoryGroups[s.category] = [];
    categoryGroups[s.category].push(s);
  });
  const categorySummary = Object.entries(categoryGroups).map(([cat, group]) => ({
    'Category': cat,
    'Count': group.length,
    'Avg Total Score': Math.round(group.reduce((s, c) => s + c.totalScore, 0) / group.length),
    'Avg Clinical': Math.round(group.reduce((s, c) => s + c.clinicalDataScore, 0) / group.length),
    'Avg Market': Math.round(group.reduce((s, c) => s + c.marketOpportunityScore, 0) / group.length),
    'Avg Strategic': Math.round(group.reduce((s, c) => s + c.strategicFitScore, 0) / group.length),
    'Avg Financial': Math.round(group.reduce((s, c) => s + c.financialPositionScore, 0) / group.length),
    'Top Company': group[0]?.ticker || '',
  }));
  categorySummary.sort((a, b) => b['Avg Total Score'] - a['Avg Total Score']);
  const summaryWs = XLSX.utils.json_to_sheet(categorySummary);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Category Summary');

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}
