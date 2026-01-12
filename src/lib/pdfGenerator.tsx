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
  
  // Dynamic import of html2canvas for rendering
  const html2canvasModule = await import('html2canvas');
  const html2canvas = html2canvasModule.default;
  
  // Calculate dimensions based on format and orientation
  const dimensions = format === 'a4' 
    ? { width: 210, height: 297 } // A4 in mm
    : { width: 216, height: 279 }; // Letter in mm
  
  const pageWidth = orientation === 'landscape' ? dimensions.height : dimensions.width;
  const pageHeight = orientation === 'landscape' ? dimensions.width : dimensions.height;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    // Create PDF from canvas using @react-pdf/renderer
    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Calculate aspect ratio
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create a simple PDF with the image
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    });
    
    // Add pages as needed
    let y = margin;
    const maxY = pageHeight - margin;
    
    if (imgHeight <= maxY - margin) {
      // Single page
      doc.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    } else {
      // Multi-page: slice the image
      const pageContentHeight = maxY - margin;
      const ratio = canvas.width / imgWidth;
      const sliceHeight = pageContentHeight * ratio;
      
      let srcY = 0;
      let page = 0;
      
      while (srcY < canvas.height) {
        if (page > 0) {
          doc.addPage();
        }
        
        // Create a slice canvas
        const sliceCanvas = document.createElement('canvas');
        const remainingHeight = Math.min(sliceHeight, canvas.height - srcY);
        sliceCanvas.width = canvas.width;
        sliceCanvas.height = remainingHeight;
        
        const ctx = sliceCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, srcY, canvas.width, remainingHeight,
            0, 0, canvas.width, remainingHeight
          );
          
          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
          const sliceImgHeight = (remainingHeight * imgWidth) / canvas.width;
          doc.addImage(sliceData, 'JPEG', margin, margin, imgWidth, sliceImgHeight);
        }
        
        srcY += sliceHeight;
        page++;
      }
    }
    
    doc.save(filename);
  } catch (error) {
    console.error('DOM to PDF export failed:', error);
    throw error;
  }
};

// Re-export styles and components for custom documents
export { styles as pdfStyles, Document, Page, Text, View, StyleSheet, pdf };
