import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "sonner";

export const DecisionFrameworkPDFExport = () => {
  const handleExport = async () => {
    try {
      toast.info("Generating PDF...");
      const { exportDomToPDF } = await import("@/lib/pdfGenerator");
      const el = document.getElementById("decision-framework-content");
      if (!el) {
        toast.error("Framework content not found");
        return;
      }
      await exportDomToPDF("decision-framework-content", "Models-Decision-Framework-Report", {
        orientation: "portrait",
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
