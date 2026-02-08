import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Globe, Shield, FileText } from "lucide-react";
import { DrugPricingData } from "@/components/DrugPricingData";
import { PriceIndexChart } from "@/components/PriceIndexChart";
import { IRAImpactModeling } from "@/components/IRAImpactModeling";

export const PricingAccessDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Drug-Level Pricing Intelligence */}
      <DrugPricingData />

      {/* International Price Index Bar Chart */}
      <PriceIndexChart />

      {/* IRA Impact Modeling */}
      <IRAImpactModeling />

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-6 w-6 text-primary" />
            Pricing & Access Intelligence
          </CardTitle>
          <CardDescription className="text-base">
            Global pharmaceutical pricing strategies, market access pathways, and reimbursement landscapes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
              <CardContent className="p-4 text-center">
                <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-700 dark:text-blue-300">Global Price Referencing</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Cross-market pricing benchmarks and external reference pricing (ERP) analysis across 30+ markets
                </p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-700 dark:text-green-300">HTA & Reimbursement</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Health Technology Assessment outcomes, formulary status, and reimbursement decisions by market
                </p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-700 dark:text-purple-300">Contract & Tender</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Managed Entry Agreements (MEAs), risk-sharing contracts, and volume-based procurement tracking
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Key Pricing Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">US WAC Premium</span>
            </div>
            <p className="text-2xl font-bold">2-3x</p>
            <p className="text-xs text-muted-foreground">vs. European average prices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Specialty Drug Growth</span>
            </div>
            <p className="text-2xl font-bold">12.4%</p>
            <p className="text-xs text-muted-foreground">CAGR (2020-2025)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Markets Using ERP</span>
            </div>
            <p className="text-2xl font-bold">35+</p>
            <p className="text-xs text-muted-foreground">External reference pricing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">IRA Impact (US)</span>
            </div>
            <p className="text-2xl font-bold">$98B</p>
            <p className="text-xs text-muted-foreground">Projected 10-year savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Strategy Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Market Access Strategy Framework</CardTitle>
          <CardDescription>Key considerations for pharmaceutical pricing and market access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">Launch Pricing</Badge>
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Value-based pricing anchored to clinical outcomes</li>
                <li>• International reference pricing cascade planning</li>
                <li>• Launch sequence optimization (anchor markets first)</li>
                <li>• Payer evidence package development (HEOR dossiers)</li>
                <li>• Competitor price benchmarking and differentiation</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Market Access</Badge>
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• HTA submission strategy (NICE, G-BA, CADTH, PBAC)</li>
                <li>• Formulary positioning and tiering negotiations</li>
                <li>• Prior authorization requirements mapping</li>
                <li>• Step therapy protocol navigation</li>
                <li>• Risk-sharing and outcomes-based agreements</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">Lifecycle Management</Badge>
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• LOE (Loss of Exclusivity) preparation strategies</li>
                <li>• Indication expansion pricing implications</li>
                <li>• Biosimilar/generic competition response</li>
                <li>• Rebate and contract renegotiation triggers</li>
                <li>• Patient assistance and co-pay program design</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Emerging Trends</Badge>
              </h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• IRA Medicare drug negotiation implications</li>
                <li>• Cell & gene therapy novel payment models</li>
                <li>• Digital therapeutics reimbursement pathways</li>
                <li>• Inflation Reduction Act impact modeling</li>
                <li>• Real-world evidence for access & coverage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Pricing Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Global Pricing Tiers by Market</CardTitle>
          <CardDescription>Relative pricing levels across major pharmaceutical markets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Tier</th>
                  <th className="text-left p-3 font-medium">Markets</th>
                  <th className="text-center p-3 font-medium">Price Index (US=100)</th>
                  <th className="text-left p-3 font-medium">Key Mechanism</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tier: "Premium", markets: "🇺🇸 USA", index: "100", mechanism: "Free pricing + payer negotiation", color: "text-green-600" },
                  { tier: "High", markets: "🇩🇪 Germany, 🇨🇭 Switzerland", index: "60-80", mechanism: "Reference pricing + AMNOG rebates", color: "text-blue-600" },
                  { tier: "Mid-High", markets: "🇬🇧 UK, 🇫🇷 France, 🇯🇵 Japan", index: "40-60", mechanism: "HTA-driven + value assessment", color: "text-yellow-600" },
                  { tier: "Mid", markets: "🇨🇦 Canada, 🇦🇺 Australia, 🇰🇷 S. Korea", index: "30-50", mechanism: "CADTH/PBAC/HIRA frameworks", color: "text-orange-600" },
                  { tier: "Low-Mid", markets: "🇪🇸 Spain, 🇮🇹 Italy, 🇧🇷 Brazil", index: "20-40", mechanism: "Government price controls + generics", color: "text-red-500" },
                  { tier: "Low", markets: "🇮🇳 India, 🇨🇳 China", index: "5-20", mechanism: "VBP/government caps + volume targets", color: "text-red-700" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className={`p-3 font-semibold ${row.color}`}>{row.tier}</td>
                    <td className="p-3">{row.markets}</td>
                    <td className="text-center p-3">
                      <Badge variant="outline">{row.index}</Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{row.mechanism}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
