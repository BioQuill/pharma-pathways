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
    
    // --- Card-aware slicing: never split a card across pages ---
    const elementRect = element.getBoundingClientRect();
    const scaleX = canvas.width / elementRect.width;
    
    // Gather ALL block elements that must not be split
    const blockSelectors = '.dd-model-card, .dd-stage-divider, .dd-narrative-box, [class*="border"], table, .recharts-wrapper';
    const blockEls = element.querySelectorAll(blockSelectors);
    
    // Build list of atomic blocks: [startY, endY] in canvas pixels
    interface Block { startY: number; endY: number; }
    const blocks: Block[] = [];
    blockEls.forEach(el => {
      const r = (el as HTMLElement).getBoundingClientRect();
      const startY = Math.round((r.top - elementRect.top) * scaleX);
      const endY = Math.round((r.bottom - elementRect.top) * scaleX);
      if (endY > startY && endY <= canvas.height + 2) {
        blocks.push({ startY, endY });
      }
    });
    blocks.sort((a, b) => a.startY - b.startY);
    
    // De-duplicate / merge overlapping blocks
    const merged: Block[] = [];
    for (const b of blocks) {
      const last = merged[merged.length - 1];
      if (last && b.startY <= last.endY) {
        last.endY = Math.max(last.endY, b.endY);
      } else {
        merged.push({ ...b });
      }
    }
    
    // Slice height in canvas pixels for the content area
    const sliceHeightPx = contentAreaHeight * ratio;
    // 30% threshold: if remaining space >= 30% of page, try to use it
    const minUsableSpace = sliceHeightPx * 0.30;
    
    let srcY = 0;
    let page = 0;
    
    while (srcY < canvas.height) {
      if (page > 0) {
        doc.addPage();
      }
      
      let idealEnd = srcY + sliceHeightPx;
      
      if (idealEnd >= canvas.height) {
        // Last page — take everything remaining
        idealEnd = canvas.height;
      } else {
        // Find the best break point that doesn't split any block
        // Strategy: find the latest safe Y that is <= idealEnd
        // A "safe Y" is a point that doesn't fall inside any block
        
        let bestBreak = idealEnd;
        
        // Check if idealEnd falls inside any block
        const conflictBlock = merged.find(b => b.startY < idealEnd && b.endY > idealEnd);
        
        if (conflictBlock) {
          // Option A: break BEFORE this block (at its startY)
          const breakBefore = conflictBlock.startY;
          // Option B: break AFTER this block (at its endY) — only if it fits
          const breakAfter = conflictBlock.endY;
          
          if (breakAfter <= srcY + sliceHeightPx * 1.15) {
            // Block only slightly overflows — include it (allow 15% overflow)
            bestBreak = breakAfter;
          } else if (breakBefore > srcY + minUsableSpace) {
            // Breaking before still uses >= 30% of page — good
            bestBreak = breakBefore;
          } else {
            // Block is huge (taller than a page). We must split it.
            // Find a sub-boundary: look for nested elements inside the block
            // Use table rows, paragraphs, or headings as split points
            bestBreak = idealEnd; // fallback: split at page boundary
          }
        } else {
          // idealEnd doesn't conflict with any block — 
          // but check if we're cutting just before a block starts (within 20px)
          // to avoid orphaned whitespace
          const nearBlock = merged.find(b => b.startY > idealEnd && b.startY - idealEnd < 30 * scaleX);
          if (nearBlock) {
            // Pull break back to just before the near block
            bestBreak = nearBlock.startY;
          }
        }
        
        idealEnd = bestBreak;
      }
      
      const actualSlice = Math.max(1, Math.min(idealEnd - srcY, canvas.height - srcY));
      
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
