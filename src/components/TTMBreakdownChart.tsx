import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TTM_BREAKDOWN_DATA, TTM_PHASE_WEIGHTS, type TTMBreakdown } from "@/lib/ttmData";
import { Info, Clock } from "lucide-react";

const PHASE_COLORS = {
  discovery: '#8B5CF6', // Purple
  clinical: '#3B82F6', // Blue
  regulatory: '#10B981', // Green
  marketAccess: '#F59E0B', // Amber
  launch: '#EF4444', // Red
};

export function TTMBreakdownChart() {
  // Prepare data for stacked bar chart
  const chartData = TTM_BREAKDOWN_DATA.map(item => ({
    name: item.therapeuticArea.length > 20 
      ? item.therapeuticArea.substring(0, 18) + '...' 
      : item.therapeuticArea,
    fullName: item.therapeuticArea,
    Discovery: item.discovery,
    Clinical: item.clinical,
    Regulatory: item.regulatory,
    'Market Access': item.marketAccess,
    Launch: item.launch,
    total: item.totalYears,
    totalMonths: item.totalMonths,
  }));

  // Sort by total TTM descending
  const sortedChartData = [...chartData].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Methodology Notes */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            TTM Calculation Methodology
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each therapeutic area (TA) has a typical overall timeline from <strong>initial discovery → preclinical → clinical trials → regulatory review → market access → launch execution</strong>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            That total duration is expressed in years (e.g., Oncology/Hematology ≈ 11 years, Neurology ≈ 15 years).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The weighted contributions are applied to that total to show how many years each phase contributes:
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS.discovery }} />
              Discovery: <strong>{(TTM_PHASE_WEIGHTS.discovery * 100).toFixed(0)}%</strong>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS.clinical }} />
              Clinical: <strong>{(TTM_PHASE_WEIGHTS.clinical * 100).toFixed(0)}%</strong>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS.regulatory }} />
              Regulatory: <strong>{(TTM_PHASE_WEIGHTS.regulatory * 100).toFixed(0)}%</strong>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS.marketAccess }} />
              Market Access: <strong>{(TTM_PHASE_WEIGHTS.marketAccess * 100).toFixed(0)}%</strong>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PHASE_COLORS.launch }} />
              Launch: <strong>{(TTM_PHASE_WEIGHTS.launch * 100).toFixed(0)}%</strong>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stacked Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time-to-Market by Therapeutic Area (Years)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedChartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis type="number" domain={[0, 16]} tickFormatter={(v) => `${v} yrs`} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  width={140}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="font-semibold mb-2">{data.fullName}</p>
                        {payload.map((entry: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: entry.fill }}
                            />
                            <span>{entry.name}:</span>
                            <span className="font-medium">{entry.value.toFixed(2)} yrs</span>
                          </div>
                        ))}
                        <div className="border-t mt-2 pt-2 text-sm font-semibold">
                          Total: {data.total} years ({data.totalMonths} months)
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="Discovery" stackId="a" fill={PHASE_COLORS.discovery} />
                <Bar dataKey="Clinical" stackId="a" fill={PHASE_COLORS.clinical} />
                <Bar dataKey="Regulatory" stackId="a" fill={PHASE_COLORS.regulatory} />
                <Bar dataKey="Market Access" stackId="a" fill={PHASE_COLORS.marketAccess} />
                <Bar dataKey="Launch" stackId="a" fill={PHASE_COLORS.launch} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>TTM Breakdown by Phase (Years)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Therapeutic Area</TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center">
                      <span>Discovery</span>
                      <span className="text-xs text-muted-foreground">(27%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center">
                      <span>Clinical</span>
                      <span className="text-xs text-muted-foreground">(50%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center">
                      <span>Regulatory</span>
                      <span className="text-xs text-muted-foreground">(8%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center">
                      <span>Market Access</span>
                      <span className="text-xs text-muted-foreground">(8%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center">
                    <div className="flex flex-col items-center">
                      <span>Launch</span>
                      <span className="text-xs text-muted-foreground">(7%)</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Total (yrs)</TableHead>
                  <TableHead className="text-center font-bold">Total (months)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TTM_BREAKDOWN_DATA.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">{item.therapeuticArea}</TableCell>
                    <TableCell className="text-center">{item.discovery.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.clinical.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.regulatory.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.marketAccess.toFixed(2)}</TableCell>
                    <TableCell className="text-center">{item.launch.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-bold">{item.totalYears}</TableCell>
                    <TableCell className="text-center font-bold">{item.totalMonths}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
