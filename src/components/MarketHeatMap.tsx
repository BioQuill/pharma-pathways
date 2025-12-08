import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketData } from "@/lib/scoring";
import { Globe, TrendingUp } from "lucide-react";

interface MarketHeatMapProps {
  marketData: MarketData[];
}

// Country paths for simplified world map SVG
const COUNTRY_PATHS: Record<string, { path: string; cx: number; cy: number }> = {
  US: { 
    path: "M55,85 L125,85 L130,95 L135,105 L120,115 L100,120 L80,115 L60,110 L50,100 L55,85 Z",
    cx: 95, cy: 100
  },
  CA: { 
    path: "M55,45 L130,45 L140,55 L145,70 L130,80 L55,80 L45,65 L50,50 Z",
    cx: 95, cy: 62
  },
  BR: { 
    path: "M150,170 L185,155 L200,170 L195,200 L175,215 L155,210 L145,190 Z",
    cx: 172, cy: 185
  },
  DE: { 
    path: "M290,75 L305,72 L310,82 L305,92 L290,95 L285,85 Z",
    cx: 297, cy: 83
  },
  FR: { 
    path: "M270,85 L290,82 L295,95 L285,108 L268,105 L265,92 Z",
    cx: 278, cy: 95
  },
  UK: { 
    path: "M268,62 L278,58 L282,68 L278,78 L268,80 L264,70 Z",
    cx: 273, cy: 70
  },
  IT: { 
    path: "M298,95 L308,92 L315,105 L310,120 L300,118 L295,105 Z",
    cx: 305, cy: 105
  },
  ES: { 
    path: "M255,100 L278,98 L280,115 L268,125 L252,118 L250,108 Z",
    cx: 265, cy: 110
  },
  CN: { 
    path: "M420,70 L490,65 L505,85 L495,115 L460,130 L420,120 L410,95 Z",
    cx: 455, cy: 95
  },
  JP: { 
    path: "M510,85 L525,80 L530,95 L525,110 L515,115 L508,100 Z",
    cx: 518, cy: 97
  },
};

// Country flag URLs using flagcdn
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
  return `https://flagcdn.com/24x18/${countryMap[code] || 'xx'}.png`;
};

export function MarketHeatMap({ marketData }: MarketHeatMapProps) {
  const maxRevenue = Math.max(...marketData.map(m => m.revenueProjection.year1 + m.revenueProjection.year2));
  const totalRevenue = marketData.reduce((sum, m) => sum + m.revenueProjection.year1 + m.revenueProjection.year2, 0);

  const getHeatColor = (revenue: number) => {
    const intensity = revenue / maxRevenue;
    if (intensity > 0.8) return { fill: 'hsl(var(--destructive))', opacity: 0.9 };
    if (intensity > 0.5) return { fill: 'hsl(var(--warning))', opacity: 0.85 };
    if (intensity > 0.3) return { fill: 'hsl(var(--chart-4))', opacity: 0.8 };
    if (intensity > 0.15) return { fill: 'hsl(var(--chart-3))', opacity: 0.75 };
    return { fill: 'hsl(var(--chart-2))', opacity: 0.7 };
  };

  const formatCurrency = (value: number) => `$${value.toFixed(0)}M`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Revenue Heat Map
            </CardTitle>
            <CardDescription>Revenue projections visualized by market size intensity</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Projected</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* SVG World Map */}
          <svg 
            viewBox="0 0 580 250" 
            className="w-full h-auto"
            style={{ minHeight: '300px' }}
          >
            {/* Ocean background */}
            <rect x="0" y="0" width="580" height="250" fill="hsl(var(--muted))" opacity="0.3" rx="8" />
            
            {/* Continent outlines (simplified) */}
            <g opacity="0.15" fill="hsl(var(--foreground))">
              {/* North America */}
              <path d="M30,30 L150,25 L160,50 L155,90 L140,130 L100,135 L60,125 L35,100 L25,60 Z" />
              {/* South America */}
              <path d="M130,145 L190,135 L210,160 L205,220 L175,240 L140,230 L125,190 Z" />
              {/* Europe */}
              <path d="M250,45 L330,40 L340,60 L335,95 L320,130 L280,135 L250,115 L245,75 Z" />
              {/* Africa */}
              <path d="M280,130 L340,125 L360,160 L350,220 L310,235 L270,215 L265,170 Z" />
              {/* Asia */}
              <path d="M350,30 L520,25 L545,60 L540,110 L510,140 L450,150 L390,135 L360,100 L355,55 Z" />
              {/* Australia */}
              <path d="M470,180 L530,175 L545,195 L535,225 L495,230 L470,210 Z" />
            </g>

            {/* Market heat spots */}
            {marketData.map((market) => {
              const countryData = COUNTRY_PATHS[market.countryCode];
              if (!countryData) return null;
              
              const totalRev = market.revenueProjection.year1 + market.revenueProjection.year2;
              const { fill, opacity } = getHeatColor(totalRev);
              const radius = 8 + (totalRev / maxRevenue) * 20;

              return (
                <g key={market.countryCode}>
                  {/* Heat glow */}
                  <circle
                    cx={countryData.cx}
                    cy={countryData.cy}
                    r={radius + 10}
                    fill={fill}
                    opacity={opacity * 0.3}
                    className="animate-pulse"
                  />
                  {/* Main circle */}
                  <circle
                    cx={countryData.cx}
                    cy={countryData.cy}
                    r={radius}
                    fill={fill}
                    opacity={opacity}
                    stroke="hsl(var(--background))"
                    strokeWidth="2"
                  />
                  {/* Country code label */}
                  <text
                    x={countryData.cx}
                    y={countryData.cy + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="hsl(var(--background))"
                  >
                    {market.countryCode}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-destructive opacity-90" />
              <span className="text-xs text-muted-foreground">High ($200M+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-warning opacity-85" />
              <span className="text-xs text-muted-foreground">Medium ($100-200M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-4 opacity-80" />
              <span className="text-xs text-muted-foreground">Moderate ($50-100M)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-chart-2 opacity-75" />
              <span className="text-xs text-muted-foreground">Low (&lt;$50M)</span>
            </div>
          </div>
        </div>

        {/* Market breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-4 border-t">
          {marketData.map((market) => {
            const totalRev = market.revenueProjection.year1 + market.revenueProjection.year2;
            const { fill } = getHeatColor(totalRev);
            
            return (
              <div 
                key={market.countryCode}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
              >
                <img 
                  src={getFlagUrl(market.countryCode)} 
                  alt={market.countryCode}
                  className="w-6 h-4 object-cover rounded-sm"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{market.countryCode}</p>
                  <p className="text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-success" />
                    {formatCurrency(totalRev)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
