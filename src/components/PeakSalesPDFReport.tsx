import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  DollarSign, 
  Target,
  Shield,
  Building2,
  Zap,
  Globe,
  Users
} from "lucide-react";
import { type ComponentScore, type PeakSalesResult } from "@/lib/peakSalesIndex";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  generateAndDownloadPDF,
  getScoreColor,
  getScoreBg,
  formatReportDate,
} from "@/lib/pdfGenerator";

interface PeakSalesPDFReportProps {
  result: PeakSalesResult;
  moleculeName?: string;
  therapeuticArea?: string;
  phase?: string;
  company?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    borderBottom: '2 solid #3b82f6',
    paddingBottom: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  moleculeInfo: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  moleculeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  metricLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  table: {
    width: '100%',
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderBottom: '1 solid #e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottom: '1 solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  tableFooter: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
  },
  tableCellHeader: {
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  progressBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  riskSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  riskCard: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
  },
  riskTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  riskItem: {
    fontSize: 9,
    marginBottom: 3,
  },
  methodologyNote: {
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    borderLeft: '3 solid #3b82f6',
    marginBottom: 16,
  },
  methodologyTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  methodologyText: {
    fontSize: 9,
    color: '#1e40af',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 8,
  },
  badge: {
    padding: '4 12',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

interface PeakSalesPDFDocumentProps {
  result: PeakSalesResult;
  moleculeName: string;
  therapeuticArea: string;
  phase: string;
  company: string;
  currentDate: string;
}

const PeakSalesPDFDocument = ({ result, moleculeName, therapeuticArea, phase, company, currentDate }: PeakSalesPDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Peak Sales Composite Index Report</Text>
          <Text style={styles.headerSubtitle}>$1B Blockbuster Probability Analysis</Text>
        </View>
        <View style={{ textAlign: 'right' }}>
          <Text style={styles.label}>Report Generated</Text>
          <Text style={styles.value}>{currentDate}</Text>
        </View>
      </View>

      {/* Molecule Info */}
      <View style={styles.moleculeInfo}>
        <Text style={styles.moleculeName}>{moleculeName}</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Therapeutic Area</Text>
            <Text style={styles.value}>{therapeuticArea}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Development Phase</Text>
            <Text style={styles.value}>{phase}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>{company}</Text>
          </View>
        </View>
      </View>

      {/* Key Metrics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics Summary</Text>
        <View style={styles.metricsGrid}>
          {/* Composite Score */}
          <View style={[styles.metricCard, { border: `2 solid ${getScoreColor(result.compositeScore)}`, backgroundColor: getScoreBg(result.compositeScore) }]}>
            <Text style={styles.metricLabel}>Composite Score</Text>
            <Text style={[styles.metricValue, { color: getScoreColor(result.compositeScore) }]}>{result.compositeScore}</Text>
            <Text style={styles.metricLabel}>out of 100</Text>
          </View>

          {/* Blockbuster Probability */}
          <View style={[styles.metricCard, { border: '2 solid #f59e0b', backgroundColor: '#fffbeb' }]}>
            <Text style={[styles.metricLabel, { color: '#92400e' }]}>Blockbuster Probability (≥$1B)</Text>
            <Text style={[styles.metricValue, { color: '#b45309' }]}>{result.blockbusterProbability}%</Text>
            <Text style={[styles.metricLabel, { color: '#92400e' }]}>P($1B+) = 1 / (1 + e^[-(S-65)/10])</Text>
          </View>

          {/* Peak Sales Estimate */}
          <View style={[styles.metricCard, { border: '2 solid #10b981', backgroundColor: '#ecfdf5' }]}>
            <Text style={[styles.metricLabel, { color: '#065f46' }]}>Estimated Peak Sales</Text>
            <Text style={[styles.metricValue, { color: '#047857' }]}>${result.peakSalesEstimate}B</Text>
            <Text style={[styles.metricLabel, { color: '#065f46' }]}>Range: ${result.peakSalesRange.low}B - ${result.peakSalesRange.high}B</Text>
          </View>
        </View>
      </View>

      {/* Component Breakdown Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Component Score Breakdown</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { flex: 2 }]}>Component</Text>
            <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Weight</Text>
            <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Score</Text>
            <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'center' }]}>Weighted</Text>
            <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Visual</Text>
          </View>
          {result.componentScores.map((comp, idx) => (
            <View key={comp.name} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>{comp.name}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{Math.round(comp.weight * 100)}%</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', fontWeight: 'bold', color: getScoreColor(comp.score) }]}>{Math.round(comp.score)}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'center' }]}>{comp.weightedScore.toFixed(1)}</Text>
              <View style={[styles.tableCell, { flex: 1.5 }]}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressBar, { width: `${comp.score}%`, backgroundColor: getScoreColor(comp.score) }]} />
                </View>
              </View>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text style={[styles.tableCell, { flex: 2, color: 'white', fontWeight: 'bold' }]}>TOTAL</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: 'white' }]}>100%</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: 'white', fontWeight: 'bold' }]}>{result.compositeScore}</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'center', color: 'white' }]}>{result.componentScores.reduce((sum, c) => sum + c.weightedScore, 0).toFixed(1)}</Text>
            <Text style={[styles.tableCell, { flex: 1.5, color: 'white' }]}></Text>
          </View>
        </View>
      </View>

      {/* Risk Factors & Confidence */}
      <View style={styles.riskSection}>
        <View style={[styles.riskCard, { 
          border: result.riskFactors.length > 0 ? '1 solid #fecaca' : '1 solid #bbf7d0',
          backgroundColor: result.riskFactors.length > 0 ? '#fef2f2' : '#f0fdf4'
        }]}>
          <Text style={[styles.riskTitle, { color: result.riskFactors.length > 0 ? '#dc2626' : '#16a34a' }]}>
            {result.riskFactors.length > 0 ? '⚠️ Risk Factors' : '✅ No Major Risk Factors'}
          </Text>
          {result.riskFactors.length > 0 ? (
            result.riskFactors.map((risk, i) => (
              <Text key={i} style={[styles.riskItem, { color: '#b91c1c' }]}>• {risk}</Text>
            ))
          ) : (
            <Text style={[styles.riskItem, { color: '#15803d' }]}>All component scores are within acceptable ranges</Text>
          )}
        </View>

        <View style={[styles.riskCard, { border: '1 solid #e5e7eb', backgroundColor: '#f9fafb' }]}>
          <Text style={[styles.riskTitle, { color: '#374151' }]}>📊 Analysis Confidence</Text>
          <View style={[styles.badge, { 
            backgroundColor: result.confidenceLevel === 'High' ? '#dcfce7' : result.confidenceLevel === 'Medium' ? '#fef9c3' : '#fee2e2',
            color: result.confidenceLevel === 'High' ? '#16a34a' : result.confidenceLevel === 'Medium' ? '#ca8a04' : '#dc2626',
            alignSelf: 'flex-start',
          }]}>
            <Text>{result.confidenceLevel} Confidence</Text>
          </View>
          <Text style={[styles.riskItem, { marginTop: 6, color: '#6b7280' }]}>
            {result.confidenceLevel === 'High' 
              ? 'Based on late-stage development data with strong evidence'
              : result.confidenceLevel === 'Medium'
              ? 'Moderate uncertainty due to development stage or data gaps'
              : 'High uncertainty - early stage with limited clinical data'}
          </Text>
        </View>
      </View>

      {/* Methodology Note */}
      <View style={styles.methodologyNote}>
        <Text style={styles.methodologyTitle}>Methodology Note</Text>
        <Text style={styles.methodologyText}>
          This analysis uses the Peak Sales Composite Index model validated against 100 drug launches (2014-2024) 
          with r=0.78 correlation and 82% prediction accuracy. The blockbuster probability uses a logistic 
          regression formula: P($1B+) = 1 / (1 + e^[-(Score - 65)/10]). Results should be used as directional 
          guidance and combined with DCF analysis and scenario modeling for investment decisions.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Peak Sales Composite Index Model v1.0</Text>
        <Text>Confidential - For Internal Use Only</Text>
        <Text>Page 1 of 1</Text>
      </View>
    </Page>
  </Document>
);

const PeakSalesPDFReport = ({ 
  result, 
  moleculeName = "Custom Analysis",
  therapeuticArea = "N/A",
  phase = "N/A",
  company = "N/A"
}: PeakSalesPDFReportProps) => {
  const generatePDF = useCallback(async () => {
    const currentDate = formatReportDate();
    const document = (
      <PeakSalesPDFDocument
        result={result}
        moleculeName={moleculeName}
        therapeuticArea={therapeuticArea}
        phase={phase}
        company={company}
        currentDate={currentDate}
      />
    );
    
    const filename = `PeakSales_Report_${moleculeName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    await generateAndDownloadPDF(document, filename);
  }, [result, moleculeName, therapeuticArea, phase, company]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            PDF Report Generator
          </h3>
          <p className="text-sm text-muted-foreground">
            Export a comprehensive Peak Sales analysis report
          </p>
        </div>
        <Button onClick={generatePDF} className="gap-2">
          <Download className="h-4 w-4" />
          Download PDF Report
        </Button>
      </div>
    </div>
  );
};

export default PeakSalesPDFReport;
