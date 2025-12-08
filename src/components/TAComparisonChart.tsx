import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTACompositeIndexes } from "@/lib/taCompositeIndex";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

const getBarColor = (score: number): string => {
  if (score >= 70) return "hsl(142, 76%, 36%)"; // green
  if (score >= 55) return "hsl(45, 93%, 47%)"; // yellow
  return "hsl(0, 84%, 60%)"; // red
};

export function TAComparisonChart() {
  const allTAIndexes = getAllTACompositeIndexes();
  
  const chartData = [...allTAIndexes]
    .sort((a, b) => b.compositeScore - a.compositeScore)
    .map(ta => ({
      name: ta.ta.length > 20 ? ta.ta.substring(0, 18) + '...' : ta.ta,
      fullName: ta.ta,
      successRate: ta.compositeScore,
      fdaApproval: ta.avgApprovalTimeFDA,
      emaApproval: ta.avgApprovalTimeEMA,
    }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">TA Success Rate Comparison</CardTitle>
        <p className="text-xs text-muted-foreground">
          Composite success scores across all 20 therapeutic areas
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickFormatter={(value) => `${value}%`}
                fontSize={10}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                fontSize={9}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-sm">{data.fullName}</p>
                        <p className="text-sm">Success Rate: <span className="font-bold">{data.successRate}%</span></p>
                        <p className="text-xs text-muted-foreground">FDA: {data.fdaApproval}mo | EMA: {data.emaApproval}mo</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="successRate" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(142, 76%, 36%)" }} />
            <span>High (≥70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(45, 93%, 47%)" }} />
            <span>Medium (55-69%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(0, 84%, 60%)" }} />
            <span>Challenging (&lt;55%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TAApprovalTimeChart() {
  const allTAIndexes = getAllTACompositeIndexes();
  
  const chartData = [...allTAIndexes]
    .sort((a, b) => a.avgApprovalTimeFDA - b.avgApprovalTimeFDA)
    .map(ta => ({
      name: ta.ta.length > 18 ? ta.ta.substring(0, 16) + '...' : ta.ta,
      fullName: ta.ta,
      FDA: ta.avgApprovalTimeFDA,
      EMA: ta.avgApprovalTimeEMA,
    }));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Approval Timeline by TA</CardTitle>
        <p className="text-xs text-muted-foreground">
          Average FDA and EMA approval times in months
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                type="number" 
                domain={[0, 25]} 
                tickFormatter={(value) => `${value}mo`}
                fontSize={10}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                fontSize={9}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-sm">{data.fullName}</p>
                        <p className="text-sm">FDA: <span className="font-bold">{data.FDA} months</span></p>
                        <p className="text-sm">EMA: <span className="font-bold">{data.EMA} months</span></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="FDA" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
              <Bar dataKey="EMA" fill="hsl(262, 83%, 58%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}