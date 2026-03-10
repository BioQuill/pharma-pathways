import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Base styles for PDF documents
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
  grid3: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
  card: {
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  valueXL: {
    fontSize: 20,
    fontWeight: 'bold',
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
  watermark: {
    position: 'absolute' as const,
    bottom: 8,
    left: 30,
    right: 30,
    fontSize: 6,
    color: '#c0c0c0',
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
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
});

// Helper to get score color
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#16a34a';
  if (score >= 60) return '#ca8a04';
  if (score >= 40) return '#ea580c';
  return '#dc2626';
};

// Helper to get score background color
export const getScoreBg = (score: number): string => {
  if (score >= 80) return '#dcfce7';
  if (score >= 60) return '#fef9c3';
  if (score >= 40) return '#ffedd5';
  return '#fee2e2';
};

// Format date for reports
export const formatReportDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format date for watermark (mm/dd/yyyy hh:mm)
export const formatWatermarkDate = (): string => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${mm}/${dd}/${yyyy} ${hh}:${min}`;
};

// Get watermark text for PDF reports
export const getReportWatermark = (companyName?: string, userEmail?: string): string => {
  const date = formatWatermarkDate();
  return `BioQuill | bioquill.com | Downloaded: ${date} | Licensed for internal use only — redistribution prohibited`;
};

// Generate PDF from React-PDF document and trigger download
export const generateAndDownloadPDF = async (document: React.ReactElement, filename: string): Promise<void> => {
  try {
    const blob = await pdf(document).toBlob();
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = filename;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw error;
  }
};

// For components that need to export DOM elements to PDF (complex dashboards with charts)
// This uses a canvas-based approach that doesn't have the jsPDF vulnerability
export const exportDomToPDF = async (
  elementId: string,
  filename: string,
  options?: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    margin?: number;
  }
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id "${elementId}" not found`);
    return;
  }

  const { orientation = 'portrait', format = 'a4', margin = 10 } = options || {};
  
  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default;
  
  const dimensions = format === 'a4' 
    ? { width: 210, height: 297 }
    : { width: 216, height: 279 };
  
  const pageWidth = orientation === 'landscape' ? dimensions.height : dimensions.width;
  const pageHeight = orientation === 'landscape' ? dimensions.width : dimensions.height;
  
  // Reserve space for header bar (12mm) and footer watermark (8mm)
  const headerHeight = 12; // mm
  const footerHeight = 8; // mm
  const contentMarginTop = margin + headerHeight;
  const contentAreaHeight = pageHeight - contentMarginTop - footerHeight;
  
  try {
    // Hide sticky platform header and nav during capture
    const stickyElements = document.querySelectorAll('header[class*="fixed"], nav[class*="fixed"]');
    const hiddenEls: HTMLElement[] = [];
    stickyElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style.display !== 'none') {
        hiddenEls.push(htmlEl);
        htmlEl.style.display = 'none';
      }
    });
    
    element.classList.add('pdf-export-mode');
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    element.classList.remove('pdf-export-mode');
    
    // Restore sticky elements
    hiddenEls.forEach(el => { el.style.display = ''; });
    
    const imgWidth = pageWidth - (margin * 2);
    const ratio = canvas.width / imgWidth; // pixels per mm
    
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation, unit: 'mm', format });
    
    // --- Card-aware slicing ---
    // Get Y positions of .dd-model-card and .dd-stage-divider elements
    // relative to the captured element, scaled to canvas pixels
    const elementRect = element.getBoundingClientRect();
    const scaleX = canvas.width / elementRect.width;
    
    const cardEls = element.querySelectorAll('.dd-model-card, .dd-stage-divider');
    const cardBoundaries: number[] = []; // Y positions in canvas pixels where cards start
    cardEls.forEach(cardEl => {
      const cardRect = (cardEl as HTMLElement).getBoundingClientRect();
      const relativeY = (cardRect.top - elementRect.top) * scaleX;
      cardBoundaries.push(Math.round(relativeY));
    });
    cardBoundaries.sort((a, b) => a - b);
    
    // Slice height in canvas pixels for the content area
    const sliceHeightPx = contentAreaHeight * ratio;
    
    let srcY = 0;
    let page = 0;
    
    while (srcY < canvas.height) {
      if (page > 0) {
        doc.addPage();
      }
      
      // Determine slice end: default is srcY + sliceHeightPx
      let idealEnd = srcY + sliceHeightPx;
      
      if (idealEnd < canvas.height) {
        // Find the last card boundary that starts before idealEnd
        // and adjust to avoid splitting cards
        let bestBreak = idealEnd;
        
        // Look for card boundaries near the ideal break point
        // Find the latest boundary that is before idealEnd (with some tolerance)
        for (let i = cardBoundaries.length - 1; i >= 0; i--) {
          const boundary = cardBoundaries[i];
          if (boundary <= idealEnd && boundary > srcY + sliceHeightPx * 0.4) {
            bestBreak = boundary;
            break;
          }
        }
        
        idealEnd = bestBreak;
      }
      
      const actualSlice = Math.min(idealEnd - srcY, canvas.height - srcY);
      
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = actualSlice;
      
      const ctx = sliceCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvas,
          0, srcY, canvas.width, actualSlice,
          0, 0, canvas.width, actualSlice
        );
        
        const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
        const sliceImgHeight = (actualSlice * imgWidth) / canvas.width;
        doc.addImage(sliceData, 'JPEG', margin, contentMarginTop, imgWidth, sliceImgHeight);
      }
      
      srcY += actualSlice;
      page++;
    }
    
    // Add header bar + watermark to every page
    const watermarkText = getReportWatermark();
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Single yellow header bar — 1cm height
      doc.setFillColor(245, 197, 24); // #F5C518
      doc.rect(0, 0, pageWidth, headerHeight, 'F');
      doc.setFontSize(6);
      doc.setTextColor(14, 29, 53);
      doc.setFont('Helvetica', 'bold');
      doc.text('BiOQUILL\u2122', 15, headerHeight / 2 + 1);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(4);
      doc.text('Know the odds. Understand the pipeline. Win the race.', pageWidth / 2, headerHeight / 2 + 1, { align: 'center' });
      doc.setFontSize(3.5);
      doc.text('Data refreshed: 05/03/2026', pageWidth - 15, headerHeight / 2 + 1, { align: 'right' });
      
      // Watermark at bottom
      doc.setFontSize(6);
      doc.setTextColor(180, 180, 180);
      doc.text(watermarkText, pageWidth / 2, pageHeight - 4, { align: 'center' });
    }
    
    doc.save(filename);
  } catch (error) {
    element.classList.remove('pdf-export-mode');
    // Restore sticky elements on error too
    const stickyElements = document.querySelectorAll('header[class*="fixed"], nav[class*="fixed"]');
    stickyElements.forEach(el => { (el as HTMLElement).style.display = ''; });
    console.error('DOM to PDF export failed:', error);
    throw error;
  }
};

// Reusable PDF watermark component for @react-pdf/renderer documents
export const PDFWatermark = ({ companyName, userEmail }: { companyName?: string; userEmail?: string }) => (
  <Text style={styles.watermark}>
    {getReportWatermark(companyName, userEmail)}
  </Text>
);

// Re-export styles and components for custom documents
export { styles as pdfStyles, Document, Page, Text, View, StyleSheet, pdf };
