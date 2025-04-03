import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast"; // Incorrect path for Sonner
import { toast } from "sonner"; // Correct import for Sonner toast function
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PdfReportButton() {
  // const { toast } = useToast(); // Not needed for Sonner, toast is imported directly
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Placeholder for element refs ---
  // In a real scenario, you might pass refs or query selectors
  // to target specific elements on the page you want to capture.
  // For now, we'll simulate capturing the whole page body, or specific divs if IDs are known.
  // const reportContentRef = useRef<HTMLDivElement>(null);
  // --- End Placeholder ---

  const generatePdf = async () => {
    setIsGenerating(true);
    // Use Sonner's toast function directly
    const toastId = toast.loading("Generating PDF Report...", {
      description: "Please wait while the report is being created.",
    });

    try {
      // --- Step 1: Target the element(s) to capture --- 
      // Example: Capturing the entire body, adjust selector for specific content area
      const elementToCapture = document.body; // Or document.getElementById('dashboard-content') etc.
      if (!elementToCapture) {
        throw new Error("Could not find the content element to capture.");
      }

      // --- Step 2: Use html2canvas to capture the element --- 
      const canvas = await html2canvas(elementToCapture, {
        scale: 2, // Increase scale for better resolution
        useCORS: true, // Important if images are from external sources
        logging: false, // Disable console logging from html2canvas
        // You might need to adjust options based on the content (e.g., ignore certain elements)
      });
      const imgData = canvas.toDataURL('image/png');

      // --- Step 3: Use jsPDF to create the PDF --- 
      const pdf = new jsPDF({
        orientation: 'p', // portrait
        unit: 'mm', // millimeters
        format: 'a4' // A4 page size
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Add some margin top

      // Add title
      pdf.setFontSize(18);
      pdf.text('Marketing Dashboard Report', pdfWidth / 2, imgY, { align: 'center' });

      // Add the captured image
      // Adjust height calculation to fit image and leave space if needed
      pdf.addImage(imgData, 'PNG', imgX, imgY + 10, imgWidth * ratio, imgHeight * ratio);

      // --- Step 4: Save the PDF --- 
      pdf.save(`marketing-report-${new Date().toISOString().split('T')[0]}.pdf`);

      // Update the toast on success
      toast.success("Success!", {
        id: toastId,
        description: "PDF report generated successfully.",
      });

    } catch (error) {
      console.error("PDF Generation Error:", error);
      // Update the toast on error
      toast.error("Error Generating PDF", {
        id: toastId,
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={generatePdf} disabled={isGenerating}>
      {isGenerating ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isGenerating ? 'Generating...' : 'Download PDF Report'}
    </Button>
  );
} 