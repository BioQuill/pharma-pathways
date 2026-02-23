import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

const historicalBaseRates = [
  { ta: "Oncology/Hematology", usComm: 75, usMed: 80, uk: 70, germany: 55, japan: 35, china: 30, india: 25, brazil: 35 },
  { ta: "Cardiovascular/Cardiology", usComm: 60, usMed: 65, uk: 45, germany: 45, japan: 25, china: 25, india: 20, brazil: 25 },
  { ta: "Neurology/Neuroscience", usComm: 65, usMed: 70, uk: 50, germany: 50, japan: 30, china: 28, india: 18, brazil: 28 },
  { ta: "Psychiatry/Mental Health", usComm: 62, usMed: 58, uk: 48, germany: 46, japan: 28, china: 26, india: 15, brazil: 24 },
  { ta: "Endocrinology & Metabolism", usComm: 58, usMed: 62, uk: 42, germany: 40, japan: 28, china: 22, india: 15, brazil: 22 },
  { ta: "Immunology & Inflammation", usComm: 68, usMed: 70, uk: 48, germany: 50, japan: 32, china: 28, india: 18, brazil: 25 },
  { ta: "Rheumatology", usComm: 66, usMed: 68, uk: 46, germany: 48, japan: 30, china: 26, india: 18, brazil: 24 },
  { ta: "Infectious Diseases", usComm: 70, usMed: 72, uk: 65, germany: 55, japan: 35, china: 32, india: 28, brazil: 32 },
  { ta: "Respiratory/Pulmonology", usComm: 62, usMed: 65, uk: 46, germany: 48, japan: 28, china: 24, india: 20, brazil: 24 },
  { ta: "Gastroenterology & Hepatology", usComm: 64, usMed: 68, uk: 47, germany: 48, japan: 30, china: 26, india: 19, brazil: 26 },
  { ta: "Nephrology/Renal", usComm: 63, usMed: 68, uk: 48, germany: 46, japan: 28, china: 26, india: 21, brazil: 26 },
  { ta: "Dermatology", usComm: 55, usMed: 50, uk: 40, germany: 45, japan: 25, china: 20, india: 15, brazil: 20 },
  { ta: "Ophthalmology", usComm: 72, usMed: 78, uk: 52, germany: 50, japan: 33, china: 28, india: 22, brazil: 28 },
  { ta: "Rare Diseases/Orphan", usComm: 85, usMed: 90, uk: 85, germany: 75, japan: 50, china: 40, india: 35, brazil: 45 },
  { ta: "Vaccines & Virology", usComm: 68, usMed: 70, uk: 72, germany: 60, japan: 45, china: 50, india: 45, brazil: 48 },
  { ta: "Women's Health", usComm: 52, usMed: 35, uk: 44, germany: 42, japan: 30, china: 28, india: 22, brazil: 26 },
  { ta: "Urology", usComm: 58, usMed: 62, uk: 44, germany: 44, japan: 26, china: 24, india: 20, brazil: 24 },
  { ta: "Pain Management/Anesthesia", usComm: 45, usMed: 48, uk: 38, germany: 40, japan: 22, china: 20, india: 16, brazil: 20 },
  { ta: "Transplant & Cell/Gene Therapy", usComm: 82, usMed: 88, uk: 78, germany: 70, japan: 52, china: 38, india: 28, brazil: 32 },
  { ta: "Pediatrics (cross-cutting bonus)", usComm: 10, usMed: 12, uk: 15, germany: 12, japan: 10, china: 8, india: 12, brazil: 10 },
];

interface CalculatorResults {
  selectedTA: string;
  isPediatric: boolean;
  ratios: {
    clinicalBenefit: number;
    safetyProfile: number;
    icer: number;
    targetPopulation: number;
    priceVsSoc: number;
    evidenceQuality: number;
  };
  compositeScore: number;
  totalAdjustment: number;
  marketResults: {
    market: string;
    baseRate: number;
    pedBonus: number;
    adjustedBase: number;
    compositeResult: number;
    final: number;
  }[];
  activeAdjustments: string[];
}

interface Model2ExcelExportProps {
  calculatorResults?: CalculatorResults | null;
}

export const Model2ExcelExport = ({ calculatorResults }: Model2ExcelExportProps) => {
  const handleExport = () => {
    try {
      toast.info("Generating Excel...");
      const wb = XLSX.utils.book_new();

      // Sheet 1: Historical Base Rates
      const baseRateData = historicalBaseRates.map((r) => ({
        "Therapeutic Area": r.ta,
        "US Commercial (%)": r.usComm,
        "US Medicare (%)": r.usMed,
        "UK NICE (%)": r.uk,
        "Germany G-BA (%)": r.germany,
        "Japan MHLW (%)": r.japan,
        "China NHSA (%)": r.china,
        "India PM-JAY (%)": r.india,
        "Brazil CONITEC (%)": r.brazil,
      }));
      const ws1 = XLSX.utils.json_to_sheet(baseRateData);
      ws1["!cols"] = Object.keys(baseRateData[0]).map((k) => ({ wch: Math.min(35, Math.max(k.length + 2, 15)) }));
      XLSX.utils.book_append_sheet(wb, ws1, "Base Rates");

      // Sheet 2: Calculator Results (if available)
      if (calculatorResults) {
        const calcData = calculatorResults.marketResults.map((r) => ({
          Market: r.market,
          "Base Rate (%)": r.baseRate,
          "Pediatric Bonus (%)": r.pedBonus,
          "Adjusted Base (%)": r.adjustedBase,
          "× Composite Score": calculatorResults.compositeScore.toFixed(2),
          "After Composite (%)": r.compositeResult,
          "Market Adjustment (%)": calculatorResults.totalAdjustment,
          "Final Probability (%)": r.final,
        }));
        const ws2 = XLSX.utils.json_to_sheet(calcData);
        ws2["!cols"] = Object.keys(calcData[0]).map((k) => ({ wch: Math.min(30, Math.max(k.length + 2, 15)) }));
        XLSX.utils.book_append_sheet(wb, ws2, "Calculator Results");

        // Sheet 3: Calculator Configuration
        const configData = [
          { Parameter: "Therapeutic Area", Value: calculatorResults.selectedTA },
          { Parameter: "Pediatric Indication", Value: calculatorResults.isPediatric ? "Yes" : "No" },
          { Parameter: "Clinical Benefit Ratio", Value: calculatorResults.ratios.clinicalBenefit.toFixed(2) },
          { Parameter: "Safety Profile Ratio", Value: calculatorResults.ratios.safetyProfile.toFixed(2) },
          { Parameter: "ICER Ratio", Value: calculatorResults.ratios.icer.toFixed(2) },
          { Parameter: "Target Population Ratio", Value: calculatorResults.ratios.targetPopulation.toFixed(2) },
          { Parameter: "Price vs. SOC Ratio", Value: calculatorResults.ratios.priceVsSoc.toFixed(2) },
          { Parameter: "Evidence Quality Ratio", Value: calculatorResults.ratios.evidenceQuality.toFixed(2) },
          { Parameter: "Composite Score", Value: calculatorResults.compositeScore.toFixed(2) },
          { Parameter: "Total Adjustment (%)", Value: calculatorResults.totalAdjustment },
          { Parameter: "Active Adjustments", Value: calculatorResults.activeAdjustments.join("; ") || "None" },
        ];
        const ws3 = XLSX.utils.json_to_sheet(configData);
        ws3["!cols"] = [{ wch: 30 }, { wch: 50 }];
        XLSX.utils.book_append_sheet(wb, ws3, "Configuration");
      }

      // Sheet 4: Formula Reference
      const formulaData = [
        { Step: "1", Description: "Select Therapeutic Area", Formula: "Look up historical base rate per market" },
        { Step: "2", Description: "Calculate Comparator Ratios", Formula: "Your molecule / Comparator average (or inverse for safety/ICER)" },
        { Step: "3", Description: "Compute Composite Score", Formula: "Average of 6 dimension ratios" },
        { Step: "4", Description: "Apply Pediatric Bonus", Formula: "Add market-specific % bonus if pediatric" },
        { Step: "5", Description: "Calculate Base Probability", Formula: "(Base Rate + Ped Bonus) × Composite Score" },
        { Step: "6", Description: "Apply Market Adjustments", Formula: "Add/subtract designation and access modifiers" },
        { Step: "7", Description: "Cap Result", Formula: "Min(95%, Max(5%, result))" },
      ];
      const ws4 = XLSX.utils.json_to_sheet(formulaData);
      ws4["!cols"] = [{ wch: 6 }, { wch: 35 }, { wch: 55 }];
      XLSX.utils.book_append_sheet(wb, ws4, "Formula Reference");

      XLSX.writeFile(wb, `PA-Model2-Report-${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel downloaded successfully");
    } catch (err) {
      toast.error("Excel export failed");
      console.error(err);
    }
  };

  return (
    <Button onClick={handleExport} variant="export" size="sm" className="gap-1.5">
      <Download className="h-3.5 w-3.5" />
      Export Excel
    </Button>
  );
};
