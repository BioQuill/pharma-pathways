import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Scale, AlertTriangle, Clock, DollarSign, TrendingDown, Calendar, Info, Shield } from "lucide-react";

interface IRADrug {
  drug: string;
  genericName: string;
  manufacturer: string;
  therapeuticArea: string;
  currentWAC: number; // monthly
  medicarePartD: boolean;
  medicarePartB: boolean;
  yearsOnMarket: number;
  eligibleYear: number; // year eligible for negotiation
  negotiationStatus: "Selected" | "Eligible 2026" | "Eligible 2027" | "Eligible 2028+" | "Not Eligible";
  projectedReduction: number; // percentage
  estimatedSavings: number; // millions per year
  loeDate: string;
  notes: string;
}

const iraDrugs: IRADrug[] = [
  { drug: "Eliquis", genericName: "Apixaban", manufacturer: "BMS/Pfizer", therapeuticArea: "Cardiovascular", currentWAC: 620, medicarePartD: true, medicarePartB: false, yearsOnMarket: 12, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 38, estimatedSavings: 3800, loeDate: "2028", notes: "First batch of 10 drugs selected; largest Medicare spend" },
  { drug: "Jardiance", genericName: "Empagliflozin", manufacturer: "Boehringer/Lilly", therapeuticArea: "Diabetes/CV", currentWAC: 630, medicarePartD: true, medicarePartB: false, yearsOnMarket: 10, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 44, estimatedSavings: 2100, loeDate: "2031", notes: "First batch selected; high Medicare utilization" },
  { drug: "Xarelto", genericName: "Rivaroxaban", manufacturer: "J&J/Bayer", therapeuticArea: "Cardiovascular", currentWAC: 580, medicarePartD: true, medicarePartB: false, yearsOnMarket: 13, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 56, estimatedSavings: 1900, loeDate: "2027", notes: "First batch selected; near LOE" },
  { drug: "Entresto", genericName: "Sacubitril/Valsartan", manufacturer: "Novartis", therapeuticArea: "Cardiovascular", currentWAC: 690, medicarePartD: true, medicarePartB: false, yearsOnMarket: 9, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 53, estimatedSavings: 1500, loeDate: "2036", notes: "First batch selected; heart failure standard of care" },
  { drug: "Imbruvica", genericName: "Ibrutinib", manufacturer: "AbbVie/J&J", therapeuticArea: "Hematology", currentWAC: 15720, medicarePartD: true, medicarePartB: false, yearsOnMarket: 11, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 38, estimatedSavings: 1200, loeDate: "2032", notes: "First batch selected; high-cost specialty drug" },
  { drug: "Stelara", genericName: "Ustekinumab", manufacturer: "J&J", therapeuticArea: "Immunology", currentWAC: 16580, medicarePartD: true, medicarePartB: false, yearsOnMarket: 15, eligibleYear: 2026, negotiationStatus: "Selected", projectedReduction: 66, estimatedSavings: 900, loeDate: "2025", notes: "First batch; biosimilar competition imminent" },
  { drug: "Keytruda", genericName: "Pembrolizumab", manufacturer: "Merck", therapeuticArea: "Oncology", currentWAC: 11853, medicarePartD: false, medicarePartB: true, yearsOnMarket: 10, eligibleYear: 2028, negotiationStatus: "Eligible 2028+", projectedReduction: 25, estimatedSavings: 5200, loeDate: "2028", notes: "Part B drug; eligible for later negotiation round; largest oncology spend" },
  { drug: "Opdivo", genericName: "Nivolumab", manufacturer: "BMS", therapeuticArea: "Oncology", currentWAC: 10270, medicarePartD: false, medicarePartB: true, yearsOnMarket: 10, eligibleYear: 2028, negotiationStatus: "Eligible 2028+", projectedReduction: 22, estimatedSavings: 3100, loeDate: "2031", notes: "Part B infusion drug; significant Medicare utilization" },
  { drug: "Ozempic", genericName: "Semaglutide", manufacturer: "Novo Nordisk", therapeuticArea: "Diabetes/Obesity", currentWAC: 1349, medicarePartD: true, medicarePartB: false, yearsOnMarket: 7, eligibleYear: 2027, negotiationStatus: "Eligible 2027", projectedReduction: 35, estimatedSavings: 4500, loeDate: "2032", notes: "Eligible for 2027 round; massive volume growth" },
  { drug: "Dupixent", genericName: "Dupilumab", manufacturer: "Sanofi/Regeneron", therapeuticArea: "Immunology", currentWAC: 3926, medicarePartD: true, medicarePartB: false, yearsOnMarket: 7, eligibleYear: 2027, negotiationStatus: "Eligible 2027", projectedReduction: 30, estimatedSavings: 1800, loeDate: "2031", notes: "Expanding indications; growing Medicare spend" },
  { drug: "Mounjaro", genericName: "Tirzepatide", manufacturer: "Eli Lilly", therapeuticArea: "Diabetes/Obesity", currentWAC: 1069, medicarePartD: true, medicarePartB: false, yearsOnMarket: 2, eligibleYear: 2031, negotiationStatus: "Not Eligible", projectedReduction: 0, estimatedSavings: 0, loeDate: "2036", notes: "Too recently launched; 9-year wait for small molecule/13-year for biologic" },
  { drug: "Skyrizi", genericName: "Risankizumab", manufacturer: "AbbVie", therapeuticArea: "Immunology", currentWAC: 6200, medicarePartD: true, medicarePartB: false, yearsOnMarket: 5, eligibleYear: 2032, negotiationStatus: "Not Eligible", projectedReduction: 0, estimatedSavings: 0, loeDate: "2035", notes: "Biologic; 13-year eligibility window from approval" },
  { drug: "Rinvoq", genericName: "Upadacitinib", manufacturer: "AbbVie", therapeuticArea: "Immunology", currentWAC: 6140, medicarePartD: true, medicarePartB: false, yearsOnMarket: 5, eligibleYear: 2028, negotiationStatus: "Eligible 2028+", projectedReduction: 28, estimatedSavings: 800, loeDate: "2035", notes: "Small molecule JAK inhibitor; 9-year eligibility window" },
  { drug: "Tagrisso", genericName: "Osimertinib", manufacturer: "AstraZeneca", therapeuticArea: "Oncology", currentWAC: 16980, medicarePartD: true, medicarePartB: false, yearsOnMarket: 9, eligibleYear: 2027, negotiationStatus: "Eligible 2027", projectedReduction: 32, estimatedSavings: 2200, loeDate: "2032", notes: "High-cost oncology; significant Medicare spend" },
  { drug: "Darzalex", genericName: "Daratumumab", manufacturer: "J&J", therapeuticArea: "Hematology", currentWAC: 8960, medicarePartD: false, medicarePartB: true, yearsOnMarket: 9, eligibleYear: 2028, negotiationStatus: "Eligible 2028+", projectedReduction: 20, estimatedSavings: 1400, loeDate: "2032", notes: "Part B infusion; eligible for later round" },
];

const statusColors: Record<string, string> = {
  "Selected": "bg-red-100 text-red-800 border-red-200",
  "Eligible 2026": "bg-orange-100 text-orange-800 border-orange-200",
  "Eligible 2027": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Eligible 2028+": "bg-blue-100 text-blue-800 border-blue-200",
  "Not Eligible": "bg-gray-100 text-gray-600 border-gray-200",
};

const barColors: Record<string, string> = {
  "Selected": "#ef4444",
  "Eligible 2026": "#f97316",
  "Eligible 2027": "#eab308",
  "Eligible 2028+": "#3b82f6",
  "Not Eligible": "#9ca3af",
};

export const IRAImpactModeling = () => {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDrugs = useMemo(() => {
    if (statusFilter === "all") return iraDrugs;
    return iraDrugs.filter(d => d.negotiationStatus === statusFilter);
  }, [statusFilter]);

  const totalSavings = useMemo(() => {
    return iraDrugs.filter(d => d.projectedReduction > 0).reduce((sum, d) => sum + d.estimatedSavings, 0);
  }, []);

  const selectedCount = iraDrugs.filter(d => d.negotiationStatus === "Selected").length;
  const eligibleCount = iraDrugs.filter(d => d.negotiationStatus !== "Not Eligible" && d.negotiationStatus !== "Selected").length;

  const reductionChartData = useMemo(() => {
    return filteredDrugs
      .filter(d => d.projectedReduction > 0)
      .sort((a, b) => b.projectedReduction - a.projectedReduction)
      .map(d => ({
        drug: d.drug,
        reduction: d.projectedReduction,
        status: d.negotiationStatus,
        fill: barColors[d.negotiationStatus],
      }));
  }, [filteredDrugs]);

  return (
    <div className="space-y-6">
      {/* IRA Overview */}
      <Card className="border-red-200 dark:border-red-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Scale className="h-6 w-6 text-red-600" />
            Inflation Reduction Act (IRA) Impact Modeling
          </CardTitle>
          <CardDescription className="text-base">
            Medicare drug price negotiation analysis — projected impact on pharmaceutical pricing (2026-2030+)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{selectedCount}</p>
              <p className="text-xs text-muted-foreground">Drugs Selected (2026)</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{eligibleCount}</p>
              <p className="text-xs text-muted-foreground">Eligible (2027-2028+)</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">${(totalSavings / 1000).toFixed(1)}B</p>
              <p className="text-xs text-muted-foreground">Est. Annual Savings</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">$98B</p>
              <p className="text-xs text-muted-foreground">10-Year CBO Projection</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IRA Key Provisions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            IRA Key Provisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            <AccordionItem value="timeline" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Negotiation Timeline</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-200">
                    <Badge className="bg-red-100 text-red-800 border-red-200">2026</Badge>
                    <span>First 10 Part D drugs — negotiated prices take effect January 2026</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950/20 rounded border border-orange-200">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">2027</Badge>
                    <span>15 additional Part D drugs selected for negotiation</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border border-yellow-200">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">2028</Badge>
                    <span>15 additional Part D + Part B drugs eligible for first time</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">2029+</Badge>
                    <span>20 drugs per year selected; expanding scope annually</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="eligibility" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Eligibility Criteria</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Small Molecules:</strong> On market ≥9 years after FDA approval (no generic/biosimilar competition)</p>
                  <p><strong>Biologics:</strong> On market ≥13 years after FDA approval (no biosimilar competition)</p>
                  <p><strong>Part D drugs first (2026-2028):</strong> Part B drugs added starting 2028</p>
                  <p><strong>Exclusions:</strong> Orphan drugs (single indication), plasma-derived products, drugs with generic/biosimilar competition</p>
                  <p><strong>Selection criteria:</strong> Highest Medicare spending without competition</p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="caps" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Maximum Fair Price (MFP) Caps</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-sm">
                  <div className="grid gap-2 md:grid-cols-3">
                    <div className="border rounded p-2 text-center">
                      <p className="font-bold text-lg text-red-600">75%</p>
                      <p className="text-xs text-muted-foreground">Max of Non-FAMP for drugs 9-12 years post-approval</p>
                    </div>
                    <div className="border rounded p-2 text-center">
                      <p className="font-bold text-lg text-orange-600">65%</p>
                      <p className="text-xs text-muted-foreground">Max of Non-FAMP for drugs 12-16 years post-approval</p>
                    </div>
                    <div className="border rounded p-2 text-center">
                      <p className="font-bold text-lg text-blue-600">40%</p>
                      <p className="text-xs text-muted-foreground">Max of Non-FAMP for drugs 16+ years post-approval</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs mt-2">
                    Non-FAMP = Non-Federal Average Manufacturer Price. Excise tax of 65-95% of sales revenue for non-compliance.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="inflation" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <span className="font-semibold">Inflation Rebate Provision</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm space-y-2">
                  <p>Manufacturers must pay rebates to Medicare if drug prices rise faster than inflation (CPI-U).</p>
                  <p><strong>Part B:</strong> Effective October 2022</p>
                  <p><strong>Part D:</strong> Effective January 2023</p>
                  <p><strong>Penalty:</strong> Rebate = units × (current price − inflation-adjusted baseline price)</p>
                  <p className="text-muted-foreground">This provision applies to ALL Medicare drugs, not just those selected for negotiation.</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Projected Reduction Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Projected Price Reductions by Drug
              </CardTitle>
              <CardDescription>Estimated Medicare negotiated price reduction from current WAC</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Selected">Selected (2026)</SelectItem>
                <SelectItem value="Eligible 2027">Eligible 2027</SelectItem>
                <SelectItem value="Eligible 2028+">Eligible 2028+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {reductionChartData.length > 0 ? (
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reductionChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="drug" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 75]} tick={{ fontSize: 11 }} label={{ value: "Projected Reduction (%)", angle: -90, position: "insideLeft", style: { fontSize: 11 } }} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Projected Reduction"]} contentStyle={{ fontSize: 12 }} />
                  <Bar dataKey="reduction" radius={[4, 4, 0, 0]} maxBarSize={45}>
                    {reductionChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No drugs with projected reductions for selected filter
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drug-Level Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Drug-Level IRA Impact Detail</CardTitle>
          <CardDescription>Medicare negotiation eligibility, projected reductions, and estimated savings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-semibold min-w-[120px]">Drug</th>
                  <th className="text-left p-2 font-semibold min-w-[100px]">Manufacturer</th>
                  <th className="text-left p-2 font-semibold min-w-[80px]">TA</th>
                  <th className="text-center p-2 font-semibold">Part</th>
                  <th className="text-center p-2 font-semibold min-w-[110px]">Status</th>
                  <th className="text-right p-2 font-semibold">WAC/mo</th>
                  <th className="text-right p-2 font-semibold">Reduction</th>
                  <th className="text-right p-2 font-semibold min-w-[90px]">Est. Savings</th>
                  <th className="text-center p-2 font-semibold">LOE</th>
                  <th className="text-left p-2 font-semibold min-w-[180px]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrugs.map((drug, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="p-2">
                      <div>
                        <span className="font-semibold">{drug.drug}</span>
                        <span className="block text-muted-foreground text-[10px]">{drug.genericName}</span>
                      </div>
                    </td>
                    <td className="p-2 text-muted-foreground">{drug.manufacturer}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-[10px] px-1 py-0">{drug.therapeuticArea}</Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant="secondary" className="text-[10px]">
                        {drug.medicarePartD ? "Part D" : "Part B"}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <Badge className={`text-[10px] ${statusColors[drug.negotiationStatus]}`}>
                        {drug.negotiationStatus}
                      </Badge>
                    </td>
                    <td className="p-2 text-right font-medium">
                      ${drug.currentWAC.toLocaleString()}
                    </td>
                    <td className="p-2 text-right">
                      {drug.projectedReduction > 0 ? (
                        <span className="font-bold text-red-600">-{drug.projectedReduction}%</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-2 text-right">
                      {drug.estimatedSavings > 0 ? (
                        <span className="font-medium text-green-600">${(drug.estimatedSavings / 1000).toFixed(1)}B</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-2 text-center text-muted-foreground">{drug.loeDate}</td>
                    <td className="p-2 text-muted-foreground text-[10px]">{drug.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Impact Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Strategic Impact for Pharma Manufacturers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-red-700 dark:text-red-400">Revenue Risks</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Negotiated prices could reduce Medicare revenue 20-66% per drug</li>
                <li>• Inflation rebate provision caps annual price increases to CPI-U</li>
                <li>• Part B drugs entering negotiation in 2028 expands impact to physician-administered drugs</li>
                <li>• Excise tax penalties (65-95%) make non-participation effectively impossible</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Strategic Responses</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Accelerate launch pricing to maximize pre-negotiation revenue</li>
                <li>• Portfolio shift toward orphan drugs (single-indication exemption)</li>
                <li>• Earlier LOE planning and lifecycle management adjustments</li>
                <li>• Increased focus on non-US markets to diversify revenue</li>
                <li>• Cell & gene therapy one-time payment models to avoid ongoing negotiation</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
