import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAllTACompositeIndexes } from '@/lib/taCompositeIndex';

const COLORS = [
  'hsl(221, 83%, 53%)', // blue
  'hsl(142, 71%, 45%)', // green
  'hsl(0, 84%, 60%)',   // red
  'hsl(45, 93%, 47%)',  // yellow
  'hsl(280, 65%, 60%)', // purple
  'hsl(190, 90%, 50%)', // cyan
  'hsl(25, 95%, 53%)',  // orange
  'hsl(330, 80%, 60%)', // pink
];

const TARadarComparison: React.FC = () => {
  const allIndexes = getAllTACompositeIndexes();
  const [selectedTAs, setSelectedTAs] = useState<string[]>(['Oncology/Hematology', 'Cardiovascular', 'Neurology/CNS']);

  const toggleTA = (ta: string) => {
    setSelectedTAs(prev => 
      prev.includes(ta) 
        ? prev.filter(t => t !== ta)
        : prev.length < 8 ? [...prev, ta] : prev
    );
  };

  // Get unique factor names across all TAs
  const factorNames = [...new Set(allIndexes.flatMap(idx => idx.factors.map(f => f.name)))];

  // Build radar data
  const radarData = factorNames.map(factorName => {
    const dataPoint: Record<string, string | number> = { factor: factorName.replace(' Risk', '').replace(' Complexity', '') };
    selectedTAs.forEach(ta => {
      const taIndex = allIndexes.find(idx => idx.ta === ta);
      const factor = taIndex?.factors.find(f => f.name === factorName);
      dataPoint[ta] = factor?.adjustedWeight ?? 0;
    });
    return dataPoint;
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">TA Radar Comparison</CardTitle>
        <p className="text-xs text-muted-foreground">Select up to 8 TAs to compare risk factor weights</p>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <ScrollArea className="h-[300px] w-48 border rounded-md p-2">
            <div className="space-y-2">
              {allIndexes.map((idx, i) => (
                <div key={idx.ta} className="flex items-center gap-2">
                  <Checkbox
                    id={`ta-${i}`}
                    checked={selectedTAs.includes(idx.ta)}
                    onCheckedChange={() => toggleTA(idx.ta)}
                    disabled={!selectedTAs.includes(idx.ta) && selectedTAs.length >= 8}
                  />
                  <Label htmlFor={`ta-${i}`} className="text-xs cursor-pointer truncate">
                    {idx.ta}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex-1 h-[300px]">
            {selectedTAs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="factor" 
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 20]} 
                    tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  {selectedTAs.map((ta, i) => (
                    <Radar
                      key={ta}
                      name={ta}
                      dataKey={ta}
                      stroke={COLORS[i % COLORS.length]}
                      fill={COLORS[i % COLORS.length]}
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend 
                    wrapperStyle={{ fontSize: '10px' }}
                    formatter={(value) => <span className="text-xs">{value}</span>}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      fontSize: '11px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Select at least one TA to compare
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TARadarComparison;
