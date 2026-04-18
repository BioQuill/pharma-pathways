import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllTACompositeIndexes } from "@/lib/taCompositeIndex";
import { useMemo } from "react";

const getHeatColor = (weight: number, maxWeight: number): string => {
  const intensity = weight / maxWeight;
  if (intensity >= 0.9) return "bg-red-600";
  if (intensity >= 0.8) return "bg-red-500";
  if (intensity >= 0.7) return "bg-orange-500";
  if (intensity >= 0.6) return "bg-orange-400";
  if (intensity >= 0.5) return "bg-yellow-500";
  if (intensity >= 0.4) return "bg-yellow-400";
  if (intensity >= 0.3) return "bg-green-400";
  if (intensity >= 0.2) return "bg-green-500";
  return "bg-green-600";
};

const getTextColor = (weight: number, maxWeight: number): string => {
  const intensity = weight / maxWeight;
  return intensity >= 0.5 ? "text-white" : "text-foreground";
};

export function TARiskFactorHeatmap() {
  const allTAIndexes = getAllTACompositeIndexes();
  
  const { heatmapData, factorNames, maxWeight } = useMemo(() => {
    // Get all unique factor names
    const factors = allTAIndexes[0]?.factors.map(f => f.name) || [];
    
    // Calculate max weight for color scaling
    let max = 0;
    allTAIndexes.forEach(ta => {
      ta.factors.forEach(f => {
        if (f.adjustedWeight > max) max = f.adjustedWeight;
      });
    });
    
    // Build heatmap data
    const data = allTAIndexes.map(ta => {
      const factorWeights: Record<string, number> = {};
      ta.factors.forEach(f => {
        factorWeights[f.name] = f.adjustedWeight;
      });
      return {
        ta: ta.ta,
        shortTa: ta.ta.length > 12 ? ta.ta.substring(0, 10) + '...' : ta.ta,
        weights: factorWeights,
      };
    });
    
    return { heatmapData: data, factorNames: factors, maxWeight: max };
  }, [allTAIndexes]);

  // Group factors by impact for better organization
  const groupedFactors = useMemo(() => {
    const template = allTAIndexes[0]?.factors || [];
    return {
      critical: template.filter(f => f.impact === 5).map(f => f.name),
      high: template.filter(f => f.impact === 4).map(f => f.name),
      other: template.filter(f => f.impact <= 3).map(f => f.name),
    };
  }, [allTAIndexes]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Risk Factor Weight Heatmap</CardTitle>
        <p className="text-xs text-muted-foreground">
          Adjusted weights by factor and therapeutic area (darker = higher weight)
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Header Row with Factor Names */}
          <div className="flex border-b border-border">
            <div className="w-32 shrink-0 p-2 font-semibold text-xs bg-muted/50">TA / Factor</div>
            {factorNames.map((factor, idx) => (
              <div 
                key={factor} 
                className={`w-14 shrink-0 p-1 text-center font-medium text-[7px] leading-tight border-l border-border ${
                  groupedFactors.critical.includes(factor) ? 'bg-red-100 dark:bg-red-950/30' :
                  groupedFactors.high.includes(factor) ? 'bg-orange-100 dark:bg-orange-950/30' :
                  'bg-muted/30'
                }`}
                title={factor}
              >
                {factor.split(' ').slice(0, 2).join(' ')}
              </div>
            ))}
          </div>
          
          {/* Data Rows */}
          {heatmapData.map((row, rowIdx) => (
            <div key={row.ta} className="flex border-b border-border/50 hover:bg-muted/20">
              <div className="w-32 shrink-0 p-2 font-medium text-[9px] truncate" title={row.ta}>
                {row.shortTa}
              </div>
              {factorNames.map((factor) => {
                const weight = row.weights[factor] || 0;
                return (
                  <div 
                    key={factor}
                    className={`w-14 shrink-0 p-1 text-center text-[8px] font-medium border-l border-border/30 ${getHeatColor(weight, maxWeight)} ${getTextColor(weight, maxWeight)}`}
                    title={`${row.ta}: ${factor} = ${weight.toFixed(1)}%`}
                  >
                    {weight.toFixed(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium">Weight Scale:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 rounded" />
              <span>High</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-medium">Impact Level:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-100 dark:bg-red-950/50 border rounded" />
              <span>Critical (5)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-100 dark:bg-orange-950/50 border rounded" />
              <span>High (4)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-muted border rounded" />
              <span>Other (1-3)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TAFactorSummaryTable() {
  const allTAIndexes = getAllTACompositeIndexes();
  
  const factorSummary = useMemo(() => {
    const summary: Record<string, { avgWeight: number; maxWeight: number; maxTA: string; modifiedCount: number }> = {};
    
    const factors = allTAIndexes[0]?.factors || [];
    factors.forEach(f => {
      summary[f.name] = { avgWeight: 0, maxWeight: 0, maxTA: '', modifiedCount: 0 };
    });
    
    allTAIndexes.forEach(ta => {
      ta.factors.forEach(f => {
        summary[f.name].avgWeight += f.adjustedWeight;
        if (f.adjustedWeight > summary[f.name].maxWeight) {
          summary[f.name].maxWeight = f.adjustedWeight;
          summary[f.name].maxTA = ta.ta;
        }
        if (f.multiplier !== 1.0) {
          summary[f.name].modifiedCount++;
        }
      });
    });
    
    Object.keys(summary).forEach(key => {
      summary[key].avgWeight /= allTAIndexes.length;
    });
    
    return Object.entries(summary)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.avgWeight - a.avgWeight);
  }, [allTAIndexes]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Factor Weight Summary</CardTitle>
        <p className="text-xs text-muted-foreground">
          Average and maximum weights across all therapeutic areas
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {factorSummary.map((factor, idx) => (
            <div key={factor.name} className="flex items-center gap-3 p-2 rounded bg-muted/30 hover:bg-muted/50">
              <div className="w-6 text-center text-xs font-bold text-muted-foreground">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{factor.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Highest in: {factor.maxTA}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{factor.avgWeight.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">avg weight</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">{factor.maxWeight.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">max weight</p>
              </div>
              {factor.modifiedCount > 0 && (
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {factor.modifiedCount} TA mods
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}