import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketData } from "@/lib/scoring";
import { Globe, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface MarketAnalysisTableProps {
  marketData: MarketData[];
}

// Country flag URLs using flagcdn (round format)
const getFlagUrl = (code: string) => {
  const countryMap: Record<string, string> = {
    US: 'us',
    CN: 'cn',
    DE: 'de',
    JP: 'jp',
    FR: 'fr',
    IT: 'it',
    UK: 'gb',
    ES: 'es',
    CA: 'ca',
    BR: 'br',
  };
  return `https://flagcdn.com/w40/${countryMap[code] || 'xx'}.png`;
};

export function MarketAnalysisTable({ marketData }: MarketAnalysisTableProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(0)}M`;
  const formatPercent = (value: number) => `${(value * 100).toFixed(0)}%`;
  
  const totalYear1 = marketData.reduce((sum, m) => sum + m.revenueProjection.year1, 0);
  const totalYear2 = marketData.reduce((sum, m) => sum + m.revenueProjection.year2, 0);

  const getComplexityColor = (complexity: number) => {
    if (complexity < 0.6) return "bg-success/10 text-success";
    if (complexity < 0.8) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Market Analysis
            </CardTitle>
            <CardDescription>Launch timelines and revenue projections across top 10 markets</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Projected Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(totalYear1 + totalYear2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Market</TableHead>
                <TableHead>Launch Date</TableHead>
                <TableHead>Market Access</TableHead>
                <TableHead className="text-right">Y1 Revenue</TableHead>
                <TableHead className="text-right">Y2 Revenue</TableHead>
                <TableHead>Complexity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {marketData.map((market) => {
                const primaryStrategy = Object.entries(market.marketAccessStrategy)
                  .sort((a, b) => b[1] - a[1])[0];
                
                return (
                  <TableRow key={market.countryCode}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getFlagUrl(market.countryCode)} 
                          alt={market.countryCode}
                          className="w-3 h-3 object-cover rounded-full"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <Badge variant="outline">{market.countryCode}</Badge>
                        {market.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {market.estimatedLaunchDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="text-xs">
                          {primaryStrategy[0].toUpperCase()}: {formatPercent(primaryStrategy[1])}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        {formatCurrency(market.revenueProjection.year1)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        {formatCurrency(market.revenueProjection.year2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getComplexityColor(market.regulatoryComplexity)}>
                        {formatPercent(market.regulatoryComplexity)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Total Y1 Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(totalYear1)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Y2 Revenue</p>
            <p className="text-xl font-bold">{formatCurrency(totalYear2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Markets Covered</p>
            <p className="text-xl font-bold">{marketData.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Growth Rate</p>
            <p className="text-xl font-bold text-success">
              {totalYear1 > 0 ? `+${(((totalYear2 - totalYear1) / totalYear1) * 100).toFixed(0)}%` : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
