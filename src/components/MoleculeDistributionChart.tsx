import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MoleculeDistributionChartProps {
  molecules: Array<{ therapeuticArea: string }>;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF6B6B", "#4ECDC4", "#45B7D1",
  "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#F8B500", "#FF69B4", "#20B2AA"
];

export function MoleculeDistributionChart({ molecules }: MoleculeDistributionChartProps) {
  const distributionData = useMemo(() => {
    const taCount: Record<string, number> = {};
    molecules.forEach((mol) => {
      const ta = mol.therapeuticArea || "Unknown";
      taCount[ta] = (taCount[ta] || 0) + 1;
    });
    
    return Object.entries(taCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [molecules]);

  // Split TAs into left column (first 10) and right column (rest)
  const leftTAs = distributionData.slice(0, 10);
  const rightTAs = distributionData.slice(10, 20);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / molecules.length) * 100).toFixed(1);
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-semibold text-sm">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} molecules ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const TAColumn = ({ items, startIndex }: { items: typeof distributionData; startIndex: number }) => (
    <div className="flex flex-col gap-1 text-[11px] justify-center">
      {items.map((item, idx) => (
        <div key={item.name} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: COLORS[(startIndex + idx) % COLORS.length] }}
          />
          <span className="truncate text-muted-foreground leading-tight">
            {item.name}: <span className="font-medium text-foreground">{item.value}</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      {/* 3-column layout: left TAs | pie chart | right TAs */}
      <div className="flex items-center gap-2">
        {/* Left column — first 10 TAs */}
        <div className="flex-1 min-w-0">
          <TAColumn items={leftTAs} startIndex={0} />
        </div>

        {/* Center — pie chart */}
        <div className="w-[200px] h-[200px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right column — next 10 TAs */}
        <div className="flex-1 min-w-0">
          <TAColumn items={rightTAs} startIndex={10} />
        </div>
      </div>
    </div>
  );
}
