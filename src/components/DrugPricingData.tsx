import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown, DollarSign, Globe, TrendingDown, TrendingUp } from "lucide-react";

interface DrugPricing {
  drug: string;
  genericName: string;
  manufacturer: string;
  therapeuticArea: string;
  indication: string;
  usWAC: number;        // US WAC price per unit/month
  usNetPrice: number;   // US net price (after rebates)
  ukPrice: number;
  germanyPrice: number;
  francePrice: number;
  canadaPrice: number;
  japanPrice: number;
  australiaPrice: number;
  brazilPrice: number;
  chinaPrice: number;
  launchYear: number;
  dosageForm: string;
}

const drugPricingData: DrugPricing[] = [
  { drug: "Keytruda", genericName: "Pembrolizumab", manufacturer: "Merck", therapeuticArea: "Oncology", indication: "Multiple solid tumors", usWAC: 11853, usNetPrice: 8890, ukPrice: 5280, germanyPrice: 6120, francePrice: 5010, canadaPrice: 4980, japanPrice: 5640, australiaPrice: 4870, brazilPrice: 3200, chinaPrice: 2100, launchYear: 2014, dosageForm: "IV infusion" },
  { drug: "Humira", genericName: "Adalimumab", manufacturer: "AbbVie", therapeuticArea: "Immunology", indication: "RA, Psoriasis, IBD", usWAC: 7830, usNetPrice: 4700, ukPrice: 1540, germanyPrice: 1870, francePrice: 1620, canadaPrice: 1710, japanPrice: 1420, australiaPrice: 1380, brazilPrice: 980, chinaPrice: 720, launchYear: 2002, dosageForm: "SC injection" },
  { drug: "Opdivo", genericName: "Nivolumab", manufacturer: "BMS", therapeuticArea: "Oncology", indication: "NSCLC, Melanoma", usWAC: 10270, usNetPrice: 7700, ukPrice: 4950, germanyPrice: 5780, francePrice: 4720, canadaPrice: 4650, japanPrice: 5310, australiaPrice: 4580, brazilPrice: 2980, chinaPrice: 1850, launchYear: 2014, dosageForm: "IV infusion" },
  { drug: "Ozempic", genericName: "Semaglutide", manufacturer: "Novo Nordisk", therapeuticArea: "Diabetes/Obesity", indication: "T2DM, Obesity", usWAC: 1349, usNetPrice: 890, ukPrice: 740, germanyPrice: 810, francePrice: 680, canadaPrice: 720, japanPrice: 610, australiaPrice: 580, brazilPrice: 420, chinaPrice: 380, launchYear: 2017, dosageForm: "SC injection" },
  { drug: "Dupixent", genericName: "Dupilumab", manufacturer: "Sanofi/Regeneron", therapeuticArea: "Immunology", indication: "Atopic Dermatitis, Asthma", usWAC: 3926, usNetPrice: 2945, ukPrice: 1780, germanyPrice: 2100, francePrice: 1650, canadaPrice: 1840, japanPrice: 1920, australiaPrice: 1560, brazilPrice: 1200, chinaPrice: 850, launchYear: 2017, dosageForm: "SC injection" },
  { drug: "Eliquis", genericName: "Apixaban", manufacturer: "BMS/Pfizer", therapeuticArea: "Cardiovascular", indication: "Stroke prevention (AF)", usWAC: 620, usNetPrice: 465, ukPrice: 172, germanyPrice: 198, francePrice: 165, canadaPrice: 182, japanPrice: 155, australiaPrice: 148, brazilPrice: 95, chinaPrice: 68, launchYear: 2012, dosageForm: "Oral tablet" },
  { drug: "Stelara", genericName: "Ustekinumab", manufacturer: "J&J", therapeuticArea: "Immunology", indication: "Psoriasis, Crohn's", usWAC: 16580, usNetPrice: 11200, ukPrice: 5420, germanyPrice: 6380, francePrice: 5100, canadaPrice: 5780, japanPrice: 5890, australiaPrice: 4920, brazilPrice: 3800, chinaPrice: 2400, launchYear: 2009, dosageForm: "SC injection" },
  { drug: "Revlimid", genericName: "Lenalidomide", manufacturer: "BMS (Celgene)", therapeuticArea: "Hematology", indication: "Multiple Myeloma", usWAC: 19830, usNetPrice: 15870, ukPrice: 7200, germanyPrice: 8400, francePrice: 6900, canadaPrice: 7100, japanPrice: 7500, australiaPrice: 6200, brazilPrice: 4500, chinaPrice: 2800, launchYear: 2005, dosageForm: "Oral capsule" },
  { drug: "Entresto", genericName: "Sacubitril/Valsartan", manufacturer: "Novartis", therapeuticArea: "Cardiovascular", indication: "Heart Failure", usWAC: 690, usNetPrice: 518, ukPrice: 365, germanyPrice: 420, francePrice: 340, canadaPrice: 380, japanPrice: 310, australiaPrice: 290, brazilPrice: 210, chinaPrice: 150, launchYear: 2015, dosageForm: "Oral tablet" },
  { drug: "Skyrizi", genericName: "Risankizumab", manufacturer: "AbbVie", therapeuticArea: "Immunology", indication: "Psoriasis, Crohn's", usWAC: 6200, usNetPrice: 4650, ukPrice: 2100, germanyPrice: 2680, francePrice: 2150, canadaPrice: 2320, japanPrice: 2480, australiaPrice: 1980, brazilPrice: 1500, chinaPrice: 980, launchYear: 2019, dosageForm: "SC injection" },
  { drug: "Tagrisso", genericName: "Osimertinib", manufacturer: "AstraZeneca", therapeuticArea: "Oncology", indication: "EGFR+ NSCLC", usWAC: 16980, usNetPrice: 13580, ukPrice: 6800, germanyPrice: 7900, francePrice: 6500, canadaPrice: 6700, japanPrice: 7100, australiaPrice: 5900, brazilPrice: 4200, chinaPrice: 2600, launchYear: 2015, dosageForm: "Oral tablet" },
  { drug: "Imbruvica", genericName: "Ibrutinib", manufacturer: "AbbVie/J&J", therapeuticArea: "Hematology", indication: "CLL, MCL", usWAC: 15720, usNetPrice: 12580, ukPrice: 5600, germanyPrice: 6700, francePrice: 5400, canadaPrice: 5800, japanPrice: 6200, australiaPrice: 5100, brazilPrice: 3700, chinaPrice: 2300, launchYear: 2013, dosageForm: "Oral capsule" },
  { drug: "Xarelto", genericName: "Rivaroxaban", manufacturer: "J&J/Bayer", therapeuticArea: "Cardiovascular", indication: "DVT/PE, AF", usWAC: 580, usNetPrice: 435, ukPrice: 165, germanyPrice: 190, francePrice: 155, canadaPrice: 170, japanPrice: 145, australiaPrice: 138, brazilPrice: 88, chinaPrice: 62, launchYear: 2011, dosageForm: "Oral tablet" },
  { drug: "Jardiance", genericName: "Empagliflozin", manufacturer: "Boehringer/Lilly", therapeuticArea: "Diabetes/Cardiovascular", indication: "T2DM, Heart Failure", usWAC: 630, usNetPrice: 410, ukPrice: 280, germanyPrice: 320, francePrice: 260, canadaPrice: 290, japanPrice: 240, australiaPrice: 225, brazilPrice: 160, chinaPrice: 110, launchYear: 2014, dosageForm: "Oral tablet" },
  { drug: "Darzalex", genericName: "Daratumumab", manufacturer: "J&J", therapeuticArea: "Hematology", indication: "Multiple Myeloma", usWAC: 8960, usNetPrice: 6720, ukPrice: 3800, germanyPrice: 4500, francePrice: 3600, canadaPrice: 3900, japanPrice: 4100, australiaPrice: 3400, brazilPrice: 2500, chinaPrice: 1600, launchYear: 2015, dosageForm: "IV/SC" },
  { drug: "Mounjaro", genericName: "Tirzepatide", manufacturer: "Eli Lilly", therapeuticArea: "Diabetes/Obesity", indication: "T2DM, Obesity", usWAC: 1069, usNetPrice: 750, ukPrice: 620, germanyPrice: 710, francePrice: 580, canadaPrice: 640, japanPrice: 520, australiaPrice: 490, brazilPrice: 350, chinaPrice: 310, launchYear: 2022, dosageForm: "SC injection" },
  { drug: "Tecentriq", genericName: "Atezolizumab", manufacturer: "Roche", therapeuticArea: "Oncology", indication: "NSCLC, Bladder", usWAC: 12150, usNetPrice: 9720, ukPrice: 5100, germanyPrice: 5980, francePrice: 4850, canadaPrice: 4780, japanPrice: 5450, australiaPrice: 4650, brazilPrice: 3100, chinaPrice: 1950, launchYear: 2016, dosageForm: "IV infusion" },
  { drug: "Tremfya", genericName: "Guselkumab", manufacturer: "J&J", therapeuticArea: "Immunology", indication: "Psoriasis, PsA", usWAC: 5580, usNetPrice: 4180, ukPrice: 1920, germanyPrice: 2350, francePrice: 1880, canadaPrice: 2050, japanPrice: 2200, australiaPrice: 1750, brazilPrice: 1350, chinaPrice: 880, launchYear: 2017, dosageForm: "SC injection" },
  { drug: "Kisqali", genericName: "Ribociclib", manufacturer: "Novartis", therapeuticArea: "Oncology", indication: "HR+ Breast Cancer", usWAC: 15420, usNetPrice: 11570, ukPrice: 5800, germanyPrice: 6900, francePrice: 5500, canadaPrice: 5700, japanPrice: 6100, australiaPrice: 5200, brazilPrice: 3600, chinaPrice: 2200, launchYear: 2017, dosageForm: "Oral tablet" },
  { drug: "Rinvoq", genericName: "Upadacitinib", manufacturer: "AbbVie", therapeuticArea: "Immunology", indication: "RA, AD, UC", usWAC: 6140, usNetPrice: 4600, ukPrice: 2050, germanyPrice: 2500, francePrice: 2000, canadaPrice: 2200, japanPrice: 2350, australiaPrice: 1880, brazilPrice: 1420, chinaPrice: 920, launchYear: 2019, dosageForm: "Oral tablet" },
];

type SortField = "drug" | "usWAC" | "usNetPrice" | "ukPrice" | "germanyPrice" | "japanPrice" | "chinaPrice" | "discount";

export const DrugPricingData = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [taFilter, setTaFilter] = useState("all");
  const [sortField, setSortField] = useState<SortField>("usWAC");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const therapeuticAreas = useMemo(() => {
    const areas = new Set(drugPricingData.map(d => d.therapeuticArea));
    return Array.from(areas).sort();
  }, []);

  const filteredData = useMemo(() => {
    let data = drugPricingData.filter(d => {
      const matchesSearch = !searchQuery ||
        d.drug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTA = taFilter === "all" || d.therapeuticArea === taFilter;
      return matchesSearch && matchesTA;
    });

    data.sort((a, b) => {
      let aVal: number, bVal: number;
      if (sortField === "drug") {
        return sortDir === "asc" ? a.drug.localeCompare(b.drug) : b.drug.localeCompare(a.drug);
      } else if (sortField === "discount") {
        aVal = ((a.usWAC - a.usNetPrice) / a.usWAC) * 100;
        bVal = ((b.usWAC - b.usNetPrice) / b.usWAC) * 100;
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [searchQuery, taFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000) return `$${(price / 1000).toFixed(1)}K`;
    return `$${price.toLocaleString()}`;
  };

  const priceIndex = (price: number, usWAC: number) => {
    return Math.round((price / usWAC) * 100);
  };

  const avgDiscount = useMemo(() => {
    const total = drugPricingData.reduce((sum, d) => sum + ((d.usWAC - d.usNetPrice) / d.usWAC * 100), 0);
    return Math.round(total / drugPricingData.length);
  }, []);

  const avgIntlDiscount = useMemo(() => {
    const total = drugPricingData.reduce((sum, d) => {
      const avgIntl = (d.ukPrice + d.germanyPrice + d.francePrice + d.canadaPrice + d.japanPrice) / 5;
      return sum + ((d.usWAC - avgIntl) / d.usWAC * 100);
    }, 0);
    return Math.round(total / drugPricingData.length);
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Avg US WAC</span>
            </div>
            <p className="text-2xl font-bold">
              {formatPrice(Math.round(drugPricingData.reduce((s, d) => s + d.usWAC, 0) / drugPricingData.length))}
            </p>
            <p className="text-xs text-muted-foreground">per month across {drugPricingData.length} drugs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Avg US Net Discount</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{avgDiscount}%</p>
            <p className="text-xs text-muted-foreground">WAC to net (after rebates)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">US vs Int'l Premium</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{avgIntlDiscount}%</p>
            <p className="text-xs text-muted-foreground">US WAC vs avg EU5+JP price</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Drugs Tracked</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{drugPricingData.length}</p>
            <p className="text-xs text-muted-foreground">across {therapeuticAreas.length} TAs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            Drug-Level Pricing Intelligence
          </CardTitle>
          <CardDescription>
            WAC prices, net prices (post-rebate), and international price comparisons across 8 markets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drug, generic name, manufacturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={taFilter} onValueChange={setTaFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All TAs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Therapeutic Areas</SelectItem>
                {therapeuticAreas.map(ta => (
                  <SelectItem key={ta} value={ta}>{ta}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pricing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-semibold min-w-[120px] sticky left-0 bg-muted/50 cursor-pointer" onClick={() => handleSort("drug")}>
                    <div className="flex items-center gap-1">Drug <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-left p-2 font-semibold min-w-[90px]">Manufacturer</th>
                  <th className="text-left p-2 font-semibold min-w-[80px]">TA</th>
                  <th className="text-right p-2 font-semibold min-w-[85px] cursor-pointer bg-green-50 dark:bg-green-950/20" onClick={() => handleSort("usWAC")}>
                    <div className="flex items-center justify-end gap-1">🇺🇸 WAC <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[85px] cursor-pointer bg-green-50 dark:bg-green-950/20" onClick={() => handleSort("usNetPrice")}>
                    <div className="flex items-center justify-end gap-1">🇺🇸 Net <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[70px] cursor-pointer" onClick={() => handleSort("discount")}>
                    <div className="flex items-center justify-end gap-1">Rebate% <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[75px] cursor-pointer" onClick={() => handleSort("ukPrice")}>
                    <div className="flex items-center justify-end gap-1">🇬🇧 UK <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[75px] cursor-pointer" onClick={() => handleSort("germanyPrice")}>
                    <div className="flex items-center justify-end gap-1">🇩🇪 DE <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[75px] cursor-pointer" onClick={() => handleSort("japanPrice")}>
                    <div className="flex items-center justify-end gap-1">🇯🇵 JP <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-right p-2 font-semibold min-w-[75px] cursor-pointer" onClick={() => handleSort("chinaPrice")}>
                    <div className="flex items-center justify-end gap-1">🇨🇳 CN <ArrowUpDown className="h-3 w-3" /></div>
                  </th>
                  <th className="text-center p-2 font-semibold min-w-[80px]">Price Index</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((drug, idx) => {
                  const discount = Math.round(((drug.usWAC - drug.usNetPrice) / drug.usWAC) * 100);
                  const ukIdx = priceIndex(drug.ukPrice, drug.usWAC);
                  const cnIdx = priceIndex(drug.chinaPrice, drug.usWAC);
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/30">
                      <td className="p-2 sticky left-0 bg-card">
                        <div>
                          <span className="font-semibold">{drug.drug}</span>
                          <span className="block text-muted-foreground text-[10px]">{drug.genericName}</span>
                        </div>
                      </td>
                      <td className="p-2 text-muted-foreground">{drug.manufacturer}</td>
                      <td className="p-2">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">{drug.therapeuticArea}</Badge>
                      </td>
                      <td className="p-2 text-right font-semibold text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-950/10">
                        {formatPrice(drug.usWAC)}
                      </td>
                      <td className="p-2 text-right font-medium bg-green-50/50 dark:bg-green-950/10">
                        {formatPrice(drug.usNetPrice)}
                      </td>
                      <td className="p-2 text-right">
                        <Badge variant="outline" className={`text-[10px] ${discount >= 30 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          -{discount}%
                        </Badge>
                      </td>
                      <td className="p-2 text-right">{formatPrice(drug.ukPrice)}</td>
                      <td className="p-2 text-right">{formatPrice(drug.germanyPrice)}</td>
                      <td className="p-2 text-right">{formatPrice(drug.japanPrice)}</td>
                      <td className="p-2 text-right">{formatPrice(drug.chinaPrice)}</td>
                      <td className="p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-[10px] text-blue-600">🇬🇧{ukIdx}</span>
                          <span className="text-[10px] text-muted-foreground">/</span>
                          <span className="text-[10px] text-red-600">🇨🇳{cnIdx}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground">
            Price Index: Market price as % of US WAC (US=100). Prices shown per monthly course/unit in USD equivalent. 
            Net prices reflect estimated post-rebate amounts. Data represents 2024-2025 pricing.
          </p>
        </CardContent>
      </Card>

      {/* International Price Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">International Price Index Summary (US WAC = 100)</CardTitle>
          <CardDescription>Average price index across all tracked drugs by market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
            {[
              { flag: "🇺🇸", market: "USA (WAC)", index: 100, color: "text-green-600" },
              { flag: "🇺🇸", market: "USA (Net)", index: Math.round(drugPricingData.reduce((s, d) => s + (d.usNetPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-green-500" },
              { flag: "🇩🇪", market: "Germany", index: Math.round(drugPricingData.reduce((s, d) => s + (d.germanyPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-blue-600" },
              { flag: "🇬🇧", market: "UK", index: Math.round(drugPricingData.reduce((s, d) => s + (d.ukPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-blue-500" },
              { flag: "🇫🇷", market: "France", index: Math.round(drugPricingData.reduce((s, d) => s + (d.francePrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-yellow-600" },
              { flag: "🇨🇦", market: "Canada", index: Math.round(drugPricingData.reduce((s, d) => s + (d.canadaPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-yellow-500" },
              { flag: "🇯🇵", market: "Japan", index: Math.round(drugPricingData.reduce((s, d) => s + (d.japanPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-orange-600" },
              { flag: "🇦🇺", market: "Australia", index: Math.round(drugPricingData.reduce((s, d) => s + (d.australiaPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-orange-500" },
              { flag: "🇧🇷", market: "Brazil", index: Math.round(drugPricingData.reduce((s, d) => s + (d.brazilPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-red-500" },
              { flag: "🇨🇳", market: "China", index: Math.round(drugPricingData.reduce((s, d) => s + (d.chinaPrice / d.usWAC * 100), 0) / drugPricingData.length), color: "text-red-700" },
            ].map((m, i) => (
              <div key={i} className="border rounded-lg p-3 text-center">
                <span className="text-lg">{m.flag}</span>
                <p className={`text-xl font-bold ${m.color}`}>{m.index}</p>
                <p className="text-xs text-muted-foreground">{m.market}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
