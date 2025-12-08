import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Clock, Zap, FileCheck } from "lucide-react";

interface RegulatoryAgency {
  code: string;
  name: string;
  flagCode: string;
  standardReview: number; // months
  priorityReview: number; // months
  acceleratedReview: number; // months
  description: string;
}

// Country flag URLs using flagcdn
const getFlagUrl = (code: string) => {
  return `https://flagcdn.com/24x18/${code}.png`;
};

const REGULATORY_AGENCIES: RegulatoryAgency[] = [
  {
    code: 'FDA',
    name: 'US FDA',
    flagCode: 'us',
    standardReview: 12,
    priorityReview: 6,
    acceleratedReview: 4,
    description: 'Standard NDA/BLA review'
  },
  {
    code: 'EMA',
    name: 'EU EMA',
    flagCode: 'eu',
    standardReview: 15,
    priorityReview: 9,
    acceleratedReview: 6,
    description: 'Centralized procedure'
  },
  {
    code: 'NMPA',
    name: 'China NMPA',
    flagCode: 'cn',
    standardReview: 18,
    priorityReview: 10,
    acceleratedReview: 6,
    description: 'Import drug registration'
  },
  {
    code: 'PMDA',
    name: 'Japan PMDA',
    flagCode: 'jp',
    standardReview: 12,
    priorityReview: 9,
    acceleratedReview: 6,
    description: 'Standard NDA review'
  },
  {
    code: 'MHRA',
    name: 'UK MHRA',
    flagCode: 'gb',
    standardReview: 10,
    priorityReview: 6,
    acceleratedReview: 4,
    description: 'National authorization'
  },
  {
    code: 'HC',
    name: 'Health Canada',
    flagCode: 'ca',
    standardReview: 12,
    priorityReview: 6,
    acceleratedReview: 4,
    description: 'NOC review process'
  },
  {
    code: 'ANVISA',
    name: 'Brazil ANVISA',
    flagCode: 'br',
    standardReview: 24,
    priorityReview: 12,
    acceleratedReview: 8,
    description: 'New drug registration'
  },
  {
    code: 'TGA',
    name: 'Australia TGA',
    flagCode: 'au',
    standardReview: 11,
    priorityReview: 6,
    acceleratedReview: 4,
    description: 'ARTG registration'
  },
];

const chartData = REGULATORY_AGENCIES.map(agency => ({
  name: agency.code,
  fullName: agency.name,
  flagCode: agency.flagCode,
  standard: agency.standardReview,
  priority: agency.priorityReview,
  accelerated: agency.acceleratedReview,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const agency = REGULATORY_AGENCIES.find(a => a.code === label);
    return (
      <div className="bg-popover border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-bold flex items-center gap-2">
          <img 
            src={getFlagUrl(agency?.flagCode || 'us')} 
            alt={agency?.code}
            className="w-5 h-4 object-cover rounded-sm"
          />
          {agency?.name}
        </p>
        <p className="text-xs text-muted-foreground mb-2">{agency?.description}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-medium">{entry.value} months</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function RegulatoryTimelineChart() {
  const avgStandard = Math.round(REGULATORY_AGENCIES.reduce((sum, a) => sum + a.standardReview, 0) / REGULATORY_AGENCIES.length);
  const avgPriority = Math.round(REGULATORY_AGENCIES.reduce((sum, a) => sum + a.priorityReview, 0) / REGULATORY_AGENCIES.length);
  const avgAccelerated = Math.round(REGULATORY_AGENCIES.reduce((sum, a) => sum + a.acceleratedReview, 0) / REGULATORY_AGENCIES.length);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Regulatory Approval Timeline Comparison
            </CardTitle>
            <CardDescription>Typical review durations by agency and pathway (in months)</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg Standard</p>
              <Badge variant="secondary">{avgStandard}mo</Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg Priority</p>
              <Badge variant="outline" className="border-warning text-warning">{avgPriority}mo</Badge>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Avg Accelerated</p>
              <Badge variant="outline" className="border-success text-success">{avgAccelerated}mo</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{ value: 'Months', angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => (
                  <span className="text-sm capitalize">{value} Review</span>
                )}
              />
              <Bar 
                dataKey="standard" 
                name="Standard" 
                fill="hsl(var(--muted-foreground))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="priority" 
                name="Priority" 
                fill="hsl(var(--warning))"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="accelerated" 
                name="Accelerated" 
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agency breakdown table */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REGULATORY_AGENCIES.map((agency) => (
              <div 
                key={agency.code}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <img 
                  src={getFlagUrl(agency.flagCode)} 
                  alt={agency.code}
                  className="w-8 h-6 object-cover rounded-sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{agency.code}</p>
                  <p className="text-xs text-muted-foreground truncate">{agency.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs">{agency.standardReview}mo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-success" />
                      <span className="text-xs text-success">{agency.acceleratedReview}mo</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pathway descriptions */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground mt-1" />
              <div>
                <p className="font-medium">Standard Review</p>
                <p className="text-xs text-muted-foreground">Default pathway for new drug applications</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-warning mt-1" />
              <div>
                <p className="font-medium">Priority Review</p>
                <p className="text-xs text-muted-foreground">For drugs addressing unmet medical needs</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-3 h-3 rounded-full bg-success mt-1" />
              <div>
                <p className="font-medium">Accelerated/Breakthrough</p>
                <p className="text-xs text-muted-foreground">For serious conditions with substantial improvement</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
