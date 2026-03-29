import * as XLSX from 'xlsx';

interface PayerDetail {
  aspect: string;
  detail: string;
}

interface ComparisonRow {
  characteristic: string;
  usa: string;
  uk: string;
  germany: string;
  france: string;
  canada: string;
  japan: string;
  india: string;
  china: string;
  brazil: string;
}

interface StrategicItem {
  region: string;
  detail: string;
}

interface PaymentReliability {
  rank: string;
  regions: string;
}

export function exportPayersToExcel(
  comparativeMatrix: ComparisonRow[],
  strategicImplications: {
    highPaying: StrategicItem[];
    governmentDominant: StrategicItem[];
    fragmented: StrategicItem[];
    fastestGrowing: StrategicItem[];
    paymentReliability: PaymentReliability[];
  },
  filename = 'global-payers-landscape'
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Comparative Matrix
  const matrixData = comparativeMatrix.map(row => ({
    'Characteristic': row.characteristic,
    '🇺🇸 USA': row.usa,
    '🇬🇧 UK': row.uk,
    '🇩🇪 Germany': row.germany,
    '🇫🇷 France': row.france,
    '🇨🇦 Canada': row.canada,
    '🇯🇵 Japan': row.japan,
    '🇮🇳 India': row.india,
    '🇨🇳 China': row.china,
    '🇧🇷 Brazil': row.brazil,
  }));
  const matrixWs = XLSX.utils.json_to_sheet(matrixData);
  const maxWidth = 35;
  if (matrixData.length > 0) {
    matrixWs['!cols'] = Object.keys(matrixData[0]).map((key) => ({
      wch: Math.min(maxWidth, Math.max(key.length, ...matrixData.map((row) => String(row[key as keyof typeof row]).length))),
    }));
  }
  XLSX.utils.book_append_sheet(wb, matrixWs, 'Comparative Matrix');

  // Sheet 2: Strategic Implications
  const stratData = [
    ...strategicImplications.highPaying.map(s => ({ Category: 'High-Paying Regions', Region: s.region, Detail: s.detail })),
    ...strategicImplications.governmentDominant.map(s => ({ Category: 'Government-Dominant', Region: s.region, Detail: s.detail })),
    ...strategicImplications.fragmented.map(s => ({ Category: 'Fragmented Regions', Region: s.region, Detail: s.detail })),
    ...strategicImplications.fastestGrowing.map(s => ({ Category: 'Fastest-Growing', Region: s.region, Detail: s.detail })),
  ];
  const stratWs = XLSX.utils.json_to_sheet(stratData);
  XLSX.utils.book_append_sheet(wb, stratWs, 'Strategic Implications');

  // Sheet 3: Payment Reliability
  const reliabilityData = strategicImplications.paymentReliability.map(r => ({
    'Rating': r.rank,
    'Regions': r.regions,
  }));
  const reliabilityWs = XLSX.utils.json_to_sheet(reliabilityData);
  XLSX.utils.book_append_sheet(wb, reliabilityWs, 'Payment Reliability');

  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportPayersPDF(elementId: string, filename: string) {
  // Re-use the exportDomToPDF from pdfGenerator
  return import('@/lib/pdfGenerator').then(({ exportDomToPDF }) => {
    return exportDomToPDF(elementId, filename, {
      orientation: 'landscape',
      format: 'a4',
      margin: 8,
    });
  });
}
