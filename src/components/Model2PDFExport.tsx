import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export const Model2PDFExport = () => {
  const handleExport = async () => {
    try {
      toast.info("Generating PDF...");
      const { exportDomToPDF } = await import("@/lib/pdfGenerator");
      // Export the entire Model 2 dashboard content
      const el = document.getElementById("model2-dashboard-content");
      if (!el) {
        toast.error("Dashboard content not found");
        return;
      }
      await exportDomToPDF("model2-dashboard-content", "PA-Index-2-Model-2-Report", {
        orientation: "landscape",
        format: "a4",
        margin: 8,
      });
      toast.success("PDF downloaded successfully");
    } catch (err) {
      toast.error("PDF export failed");
      console.error(err);
    }
  };

  return (
    <Button onClick={handleExport} variant="export" size="sm" className="gap-1.5">
      <FileText className="h-3.5 w-3.5" />
      Export PDF
    </Button>
  );
};
