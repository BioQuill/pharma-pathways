import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

interface DrugPricing {
  drug: string;
  genericName: string;
  usWAC: number;
  usNetPrice: number;
  ukPrice: number;
  germanyPrice: number;
  francePrice: number;
  canadaPrice: number;
  japanPrice: number;
  australiaPrice: number;
  brazilPrice: number;
  chinaPrice: number;
  therapeuticArea: string;
}

const drugPricingData: DrugPricing[] = [
  { drug: "Keytruda", genericName: "Pembrolizumab", usWAC: 11853, usNetPrice: 8890, ukPrice: 5280, germanyPrice: 6120, francePrice: 5010, canadaPrice: 4980, japanPrice: 5640, australiaPrice: 4870, brazilPrice: 3200, chinaPrice: 2100, therapeuticArea: "Oncology" },
  { drug: "Humira", genericName: "Adalimumab", usWAC: 7830, usNetPrice: 4700, ukPrice: 1540, germanyPrice: 1870, francePrice: 1620, canadaPrice: 1710, japanPrice: 1420, australiaPrice: 1380, brazilPrice: 980, chinaPrice: 720, therapeuticArea: "Immunology" },
  { drug: "Opdivo", genericName: "Nivolumab", usWAC: 10270, usNetPrice: 7700, ukPrice: 4950, germanyPrice: 5780, francePrice: 4720, canadaPrice: 4650, japanPrice: 5310, australiaPrice: 4580, brazilPrice: 2980, chinaPrice: 1850, therapeuticArea: "Oncology" },
  { drug: "Ozempic", genericName: "Semaglutide", usWAC: 1349, usNetPrice: 890, ukPrice: 740, germanyPrice: 810, francePrice: 680, canadaPrice: 720, japanPrice: 610, australiaPrice: 580, brazilPrice: 420, chinaPrice: 380, therapeuticArea: "Diabetes/Obesity" },
  { drug: "Dupixent", genericName: "Dupilumab", usWAC: 3926, usNetPrice: 2945, ukPrice: 1780, germanyPrice: 2100, francePrice: 1650, canadaPrice: 1840, japanPrice: 1920, australiaPrice: 1560, brazilPrice: 1200, chinaPrice: 850, therapeuticArea: "Immunology" },
  { drug: "Eliquis", genericName: "Apixaban", usWAC: 620, usNetPrice: 465, ukPrice: 172, germanyPrice: 198, francePrice: 165, canadaPrice: 182, japanPrice: 155, australiaPrice: 148, brazilPrice: 95, chinaPrice: 68, therapeuticArea: "Cardiovascular" },
  { drug: "Stelara", genericName: "Ustekinumab", usWAC: 16580, usNetPrice: 11200, ukPrice: 5420, germanyPrice: 6380, francePrice: 5100, canadaPrice: 5780, japanPrice: 5890, australiaPrice: 4920, brazilPrice: 3800, chinaPrice: 2400, therapeuticArea: "Immunology" },
  { drug: "Revlimid", genericName: "Lenalidomide", usWAC: 19830, usNetPrice: 15870, ukPrice: 7200, germanyPrice: 8400, francePrice: 6900, canadaPrice: 7100, japanPrice: 7500, australiaPrice: 6200, brazilPrice: 4500, chinaPrice: 2800, therapeuticArea: "Hematology" },
  { drug: "Entresto", genericName: "Sacubitril/Valsartan", usWAC: 690, usNetPrice: 518, ukPrice: 365, germanyPrice: 420, francePrice: 340, canadaPrice: 380, japanPrice: 310, australiaPrice: 290, brazilPrice: 210, chinaPrice: 150, therapeuticArea: "Cardiovascular" },
  { drug: "Skyrizi", genericName: "Risankizumab", usWAC: 6200, usNetPrice: 4650, ukPrice: 2100, germanyPrice: 2680, francePrice: 2150, canadaPrice: 2320, japanPrice: 2480, australiaPrice: 1980, brazilPrice: 1500, chinaPrice: 980, therapeuticArea: "Immunology" },
  { drug: "Tagrisso", genericName: "Osimertinib", usWAC: 16980, usNetPrice: 13580, ukPrice: 6800, germanyPrice: 7900, francePrice: 6500, canadaPrice: 6700, japanPrice: 7100, australiaPrice: 5900, brazilPrice: 4200, chinaPrice: 2600, therapeuticArea: "Oncology" },
  { drug: "Imbruvica", genericName: "Ibrutinib", usWAC: 15720, usNetPrice: 12580, ukPrice: 5600, germanyPrice: 6700, francePrice: 5400, canadaPrice: 5800, japanPrice: 6200, australiaPrice: 5100, brazilPrice: 3700, chinaPrice: 2300, therapeuticArea: "Hematology" },
  { drug: "Xarelto", genericName: "Rivaroxaban", usWAC: 580, usNetPrice: 435, ukPrice: 165, germanyPrice: 190, francePrice: 155, canadaPrice: 170, japanPrice: 145, australiaPrice: 138, brazilPrice: 88, chinaPrice: 62, therapeuticArea: "Cardiovascular" },
  { drug: "Jardiance", genericName: "Empagliflozin", usWAC: 630, usNetPrice: 410, ukPrice: 280, germanyPrice: 320, francePrice: 260, canadaPrice: 290, japanPrice: 240, australiaPrice: 225, brazilPrice: 160, chinaPrice: 110, therapeuticArea: "Diabetes/Cardiovascular" },
  { drug: "Darzalex", genericName: "Daratumumab", usWAC: 8960, usNetPrice: 6720, ukPrice: 3800, germanyPrice: 4500, francePrice: 3600, canadaPrice: 3900, japanPrice: 4100, australiaPrice: 3400, brazilPrice: 2500, chinaPrice: 1600, therapeuticArea: "Hematology" },
  { drug: "Mounjaro", genericName: "Tirzepatide", usWAC: 1069, usNetPrice: 750, ukPrice: 620, germanyPrice: 710, francePrice: 580, canadaPrice: 640, japanPrice: 520, australiaPrice: 490, brazilPrice: 350, chinaPrice: 310, therapeuticArea: "Diabetes/Obesity" },
  { drug: "Tecentriq", genericName: "Atezolizumab", usWAC: 12150, usNetPrice: 9720, ukPrice: 5100, germanyPrice: 5980, francePrice: 4850, canadaPrice: 4780, japanPrice: 5450, australiaPrice: 4650, brazilPrice: 3100, chinaPrice: 1950, therapeuticArea: "Oncology" },
  { drug: "Tremfya", genericName: "Guselkumab", usWAC: 5580, usNetPrice: 4180, ukPrice: 1920, germanyPrice: 2350, francePrice: 1880, canadaPrice: 2050, japanPrice: 2200, australiaPrice: 1750, brazilPrice: 1350, chinaPrice: 880, therapeuticArea: "Immunology" },
  { drug: "Kisqali", genericName: "Ribociclib", usWAC: 15420, usNetPrice: 11570, ukPrice: 5800, germanyPrice: 6900, francePrice: 5500, canadaPrice: 5700, japanPrice: 6100, australiaPrice: 5200, brazilPrice: 3600, chinaPrice: 2200, therapeuticArea: "Oncology" },
  { drug: "Rinvoq", genericName: "Upadacitinib", usWAC: 6140, usNetPrice: 4600, ukPrice: 2050, germanyPrice: 2500, francePrice: 2000, canadaPrice: 2200, japanPrice: 2350, australiaPrice: 1880, brazilPrice: 1420, chinaPrice: 920, therapeuticArea: "Immunology" },
];

const MARKET_COLORS: Record<string, string> = {
  "🇺🇸 US (WAC)": "#22c55e",
  "🇺🇸 US (Net)": "#86efac",
  "🇩🇪 Germany": "#3b82f6",
  "🇬🇧 UK": "#60a5fa",
  "🇫🇷 France": "#f59e0b",
  "🇨🇦 Canada": "#fbbf24",
  "🇯🇵 Japan": "#f97316",
  "🇦🇺 Australia": "#fb923c",
  "🇧🇷 Brazil": "#ef4444",
  "🇨🇳 China": "#dc2626",
};

export const PriceIndexChart = () => {
  const [selectedDrug, setSelectedDrug] = useState("all");
  const [chartView, setChartView] = useState<"average" | "drug">("average");

  const averageIndexData = useMemo(() => {
    const markets = [
      { market: "🇺🇸 US (WAC)", key: "usWAC" as const },
      { market: "🇺🇸 US (Net)", key: "usNetPrice" as const },
      { market: "🇩🇪 Germany", key: "germanyPrice" as const },
      { market: "🇬🇧 UK", key: "ukPrice" as const },
      { market: "🇫🇷 France", key: "francePrice" as const },
      { market: "🇨🇦 Canada", key: "canadaPrice" as const },
      { market: "🇯🇵 Japan", key: "japanPrice" as const },
      { market: "🇦🇺 Australia", key: "australiaPrice" as const },
      { market: "🇧🇷 Brazil", key: "brazilPrice" as const },
      { market: "🇨🇳 China", key: "chinaPrice" as const },
    ];

    return markets.map(m => ({
      market: m.market,
      index: m.key === "usWAC" ? 100 : Math.round(
        drugPricingData.reduce((sum, d) => sum + (d[m.key] / d.usWAC) * 100, 0) / drugPricingData.length
      ),
      fill: MARKET_COLORS[m.market],
    }));
  }, []);

  const drugSpecificData = useMemo(() => {
    if (selectedDrug === "all") return [];
    const drug = drugPricingData.find(d => d.drug === selectedDrug);
    if (!drug) return [];

    return [
      { market: "🇺🇸 US (WAC)", index: 100, fill: MARKET_COLORS["🇺🇸 US (WAC)"] },
      { market: "🇺🇸 US (Net)", index: Math.round((drug.usNetPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇺🇸 US (Net)"] },
      { market: "🇩🇪 Germany", index: Math.round((drug.germanyPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇩🇪 Germany"] },
      { market: "🇬🇧 UK", index: Math.round((drug.ukPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇬🇧 UK"] },
      { market: "🇫🇷 France", index: Math.round((drug.francePrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇫🇷 France"] },
      { market: "🇨🇦 Canada", index: Math.round((drug.canadaPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇨🇦 Canada"] },
      { market: "🇯🇵 Japan", index: Math.round((drug.japanPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇯🇵 Japan"] },
      { market: "🇦🇺 Australia", index: Math.round((drug.australiaPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇦🇺 Australia"] },
      { market: "🇧🇷 Brazil", index: Math.round((drug.brazilPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇧🇷 Brazil"] },
      { market: "🇨🇳 China", index: Math.round((drug.chinaPrice / drug.usWAC) * 100), fill: MARKET_COLORS["🇨🇳 China"] },
    ];
  }, [selectedDrug]);

  const chartData = chartView === "average" ? averageIndexData : drugSpecificData;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
              International Price Index Comparison
            </CardTitle>
            <CardDescription>
              Price as percentage of US WAC (US WAC = 100). {chartView === "average" ? "Average across all 20 tracked drugs." : `Showing: ${selectedDrug}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={chartView} onValueChange={(v) => { setChartView(v as "average" | "drug"); if (v === "drug" && selectedDrug === "all") setSelectedDrug(drugPricingData[0].drug); }}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="average">Average (All Drugs)</SelectItem>
                <SelectItem value="drug">Single Drug</SelectItem>
              </SelectContent>
            </Select>
            {chartView === "drug" && (
              <Select value={selectedDrug} onValueChange={setSelectedDrug}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {drugPricingData.map(d => (
                    <SelectItem key={d.drug} value={d.drug}>{d.drug} ({d.genericName})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="market" 
                angle={-35} 
                textAnchor="end" 
                height={80} 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 110]} 
                tick={{ fontSize: 11 }}
                label={{ value: "Price Index (US WAC=100)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value}`, "Price Index"]}
                contentStyle={{ fontSize: 12 }}
              />
              <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "US WAC Baseline", position: "right", fontSize: 10 }} />
              <Bar dataKey="index" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {chartData.map((item, i) => (
            <Badge 
              key={i} 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: item.fill, color: item.fill }}
            >
              {item.market}: {item.index}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
