import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import pptxgen from "pptxgenjs";
import { MutableRefObject } from "react";

/**
 * Represents a section to be included in the PowerPoint presentation
 */
type PresentationSection = {
  ref: MutableRefObject<HTMLDivElement | null>;
  title: string;
};

/**
 * Generate a PDF report from the dashboard content
 * @param dashboardRef - Reference to the dashboard container element
 * @param options - Optional configuration for the PDF
 * @returns Promise that resolves when the PDF is generated and saved
 */
export const generatePDF = async (
  dashboardRef: MutableRefObject<HTMLDivElement | null>,
  options: {
    title?: string;
    reportPeriod?: string;
    company?: string;
    quality?: number;
  } = {}
): Promise<void> => {
  if (!dashboardRef.current) return;

  try {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4', true);
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // margin in mm
    const contentWidth = pageWidth - (margin * 2);
    
    // Get current date for report
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Get options with defaults
    const title = options.title || 'Marketing Activity Effectiveness Report';
    const reportPeriod = options.reportPeriod || 'Q1 2023';
    const company = options.company || 'Change Influence';
    const quality = options.quality || 2; // Scale factor for better quality
    
    // Add header to first page
    pdf.setFillColor(240, 240, 240);
    pdf.rect(0, 0, pageWidth, 30, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(40, 40, 40);
    pdf.text(title, margin, 15);
    
    // Add date and page info
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${formattedDate} at ${formattedTime}`, margin, 25);
    pdf.text(`Period: ${reportPeriod}`, pageWidth - 50, 25);
    
    // Add company logo/info
    pdf.setFontSize(10);
    pdf.text(`Company: ${company}`, pageWidth - 60, 15);
    
    // Capture the entire dashboard with html2canvas-pro (supports modern CSS color functions)
    const canvas = await html2canvas(dashboardRef.current, {
      scale: quality, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#FFFFFF'
    });
    
    // First page (with existing header)
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    // Calculate height based on the original aspect ratio of the captured content
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // First page (with existing header)
    const heightToDraw = Math.min(pageHeight - 40, imgHeight);
    pdf.addImage(imgData, 'PNG', margin, 35, imgWidth, imgHeight);
    
    // Calculate if more pages are needed
    let remainingHeight = imgHeight - heightToDraw;
    let currentPosition = heightToDraw;
    let currentPage = 1;
    
    // If content exceeds first page, add more pages
    while (remainingHeight > 0) {
      pdf.addPage();
      currentPage++;
      
      // Add header to additional page
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, 0, pageWidth, 20, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(40, 40, 40);
      pdf.text(title, margin, 15);
      
      // Add next portion of image
      const nextHeightToDraw = Math.min(pageHeight - 30, remainingHeight);
      // Use clipping to show only the portion we want
      pdf.setPage(currentPage);
      pdf.addImage(imgData, 'PNG', margin, 25 - currentPosition, imgWidth, imgHeight);
      
      // Add page number
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${currentPage}`, pageWidth - 30, pageHeight - 10);
      
      // Add footer
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Confidential - For internal use only', margin, pageHeight - 10);
      
      remainingHeight -= nextHeightToDraw;
      currentPosition += nextHeightToDraw;
    }
    
    // Add page number to first page
    pdf.setPage(1);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Page 1`, pageWidth - 30, pageHeight - 10);
    
    // Add footer to first page
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Confidential - For internal use only', margin, pageHeight - 10);
    
    // Generate filename with date
    const filename = `${title.replace(/\s+/g, '_')}_${date.toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate a PowerPoint presentation from dashboard sections
 * @param sections - Array of sections to include in the presentation
 * @param options - Optional configuration for the presentation
 * @returns Promise that resolves when the PPT is generated and saved
 */
export const generatePPT = async (
  sections: PresentationSection[],
  options: {
    title?: string;
    subject?: string;
    company?: string;
    summaryPoints?: string[];
    quality?: number;
  } = {}
): Promise<void> => {
  try {
    // Create a new PowerPoint presentation
    const pptx = new pptxgen();
    
    // Set presentation properties
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = options.title || 'Marketing Activity Effectiveness';
    pptx.subject = options.subject || 'Performance Analysis';
    pptx.company = options.company || 'Change Influence';
    
    // Set quality option with default
    const quality = options.quality || 2; // Scale factor for better quality
    
    // Add title slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: '#F8F9FA' };
    titleSlide.addText(options.title || 'Marketing Activity Effectiveness', {
      x: '10%', y: '40%', w: '80%', h: '20%',
      fontSize: 36, bold: true, color: '#333333',
      align: 'center',
    });
    titleSlide.addText('Q1 2023 Performance Analysis', {
      x: '10%', y: '60%', w: '80%', h: '10%',
      fontSize: 24, color: '#666666',
      align: 'center',
    });
    titleSlide.addText(`Generated on: ${new Date().toLocaleDateString()}`, {
      x: '10%', y: '80%', w: '80%', h: '5%',
      fontSize: 14, color: '#999999',
      align: 'center',
    });
    
    // Capture each section and add to slides with html2canvas-pro
    for (const section of sections) {
      if (!section.ref.current) continue;
      
      // Create canvas from the section using html2canvas-pro
      const canvas = await html2canvas(section.ref.current, {
        scale: quality,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });
      
      // Convert canvas to image
      const imageData = canvas.toDataURL('image/png');
      
      // Create a new slide
      const slide = pptx.addSlide();
      
      // Add slide title
      slide.addText(section.title, {
        x: '5%', y: '5%', w: '90%', h: '10%',
        fontSize: 18, bold: true, color: '#333333'
      });
      
      // Calculate dimensions while preserving aspect ratio
      const contentAreaHeight = 0.7; // 70% of slide height for content
      const contentAreaWidth = 0.9; // 90% of slide width for content
      const slideAspectRatio = 16/9; // Standard slide aspect ratio (16:9)
      const slideWidth = 1; // Normalized slide width (100%)
      const slideHeight = slideWidth / slideAspectRatio; // Normalized slide height
      
      // Get the aspect ratio of the captured image
      const imageAspectRatio = canvas.width / canvas.height;
      
      // Calculate dimensions that fit within the content area while preserving aspect ratio
      let imageWidth, imageHeight, imageX, imageY;
      
      if (imageAspectRatio > slideAspectRatio) {
        // Image is wider than the slide proportionally - constrain by width
        imageWidth = contentAreaWidth;
        imageHeight = imageWidth / imageAspectRatio;
        imageX = (slideWidth - imageWidth) / 2; // Center horizontally
        imageY = 0.2 + ((contentAreaHeight - imageHeight) / 2); // Center in available content area
      } else {
        // Image is taller than the slide proportionally - constrain by height
        imageHeight = contentAreaHeight;
        imageWidth = imageHeight * imageAspectRatio;
        imageX = (slideWidth - imageWidth) / 2; // Center horizontally
        imageY = 0.2; // Position below title (20% from top)
      }
      
      // Add the image with calculated dimensions
      slide.addImage({
        data: imageData,
        x: `${imageX * 100}%`, 
        y: `${imageY * 100}%`, 
        w: `${imageWidth * 100}%`, 
        h: `${imageHeight * 100}%`,
      });
    }
    
    // Add summary slide if there are summary points
    const summaryPoints = options.summaryPoints || [
      'Overall marketing effectiveness score is 50.3/100',
      'Content quality scored highest at 89% with a 5% improvement',
      'Audience engagement increased by 12% vs. last period',
      'Japan is the highest performing market with 91% quality score',
      'Social media is the most effective channel with 90% engagement'
    ];
    
    const summarySlide = pptx.addSlide();
    summarySlide.addText('Key Takeaways', {
      x: '5%', y: '5%', w: '90%', h: '10%',
      fontSize: 24, bold: true, color: '#333333'
    });
    
    summarySlide.addText(
      summaryPoints.map(point => `• ${point}`).join('\n'),
      {
        x: '10%', y: '25%', w: '80%', h: '60%',
        fontSize: 18, color: '#333333',
        breakLine: true,
        lineSpacing: 28
      }
    );
    
    // Generate and save the presentation
    const filename = `Marketing_Activity_Effectiveness_${new Date().toISOString().split('T')[0]}.pptx`;
    pptx.writeFile({ fileName: filename });
    
  } catch (error) {
    console.error('Error generating PowerPoint:', error);
    alert('Failed to generate PowerPoint. Please try again.');
  }
}; 