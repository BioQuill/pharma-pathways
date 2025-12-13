import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, TrendingUp, Building2, DollarSign } from "lucide-react";
import { getAllTACompositeIndexes } from "@/lib/taCompositeIndex";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
import { calculateTTMMonths, type MarketData } from "@/lib/scoring";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  indication: string;
  therapeuticArea: string;
  company: string;
  companyTrackRecord: 'fast' | 'average' | 'slow';
  overallScore: number;
  marketData: MarketData[];
  scores: any;
}

interface TAMarketOverviewProps {
  molecules: MoleculeProfile[];
}

// Mapping of full TA names to composite index keys
const TA_NAME_MAP: Record<string, string> = {
  'Oncology/Hematology': 'ONCOLOGY/HEMATOLOGY',
  'Cardiovascular': 'CARDIOVASCULAR',
  'Neurology/CNS': 'NEUROLOGY/CNS',
  'Psychiatry/Mental Health': 'PSYCHIATRY/MENTAL HEALTH',
  'Immunology & Inflammation': 'IMMUNOLOGY & INFLAMMATION',
  'Rheumatology': 'RHEUMATOLOGY',
  'Infectious Diseases': 'INFECTIOUS DISEASES',
  'Respiratory/Pulmonology': 'RESPIRATORY/PULMONOLOGY',
  'Gastroenterology & Hepatology': 'GASTROENTEROLOGY & HEPATOLOGY',
  'Nephrology/Renal': 'NEPHROLOGY/RENAL',
  'Dermatology': 'DERMATOLOGY',
  'Ophthalmology': 'OPHTHALMOLOGY',
  'Rare Diseases/Orphan Drugs': 'RARE DISEASES/ORPHAN',
  'Vaccines & Virology': 'VACCINES & VIROLOGY',
  'Women\'s Health': 'WOMEN\'S HEALTH',
  'Urology': 'UROLOGY',
  'Pain Management/Anesthesia': 'PAIN MANAGEMENT/ANESTHESIA',
  'Transplantation & Cell/Gene Therapy': 'TRANSPLANT/CELL-GENE',
  'Pediatrics': 'PEDIATRICS',
  'Endocrinology & Metabolism': 'ENDOCRINOLOGY & METABOLISM',
  'Metabolic/Endocrinology': 'ENDOCRINOLOGY & METABOLISM',
  'Obesity': 'ENDOCRINOLOGY & METABOLISM',
};

const getScoreColor = (score: number) => {
  if (score >= 67) return 'text-[hsl(142,76%,36%)]';
  if (score >= 34) return 'text-[hsl(45,93%,47%)]';
  return 'text-[hsl(0,72%,51%)]';
};

const getScoreBgColor = (score: number) => {
  if (score >= 67) return 'bg-[hsl(142,76%,36%)]';
  if (score >= 34) return 'bg-[hsl(45,93%,47%)]';
  return 'bg-[hsl(0,72%,51%)]';
};

export function TAMarketOverview({ molecules }: TAMarketOverviewProps) {
  const taIndexes = getAllTACompositeIndexes();
  
  // Group molecules by TA and calculate aggregated data
  const taGroups = taIndexes.map((taIndex) => {
    const normalizedTA = taIndex.ta.toUpperCase();
    
    // Find molecules that belong to this TA
    const taMolecules = molecules.filter((mol) => {
      const mappedTA = TA_NAME_MAP[mol.therapeuticArea]?.toUpperCase();
      return mappedTA === normalizedTA;
    });

    // Get top 5 molecules by LPI-3 score
    const moleculesWithScores = taMolecules.map((mol) => {
      const lpi3 = calculateLPI3ForMolecule(mol);
      const ttm = calculateTTMMonths(mol.phase, mol.therapeuticArea, mol.companyTrackRecord, mol.marketData);
      return {
        ...mol,
        lpi3Score: Math.round(lpi3.calibratedProbability * 100),
        ttm: ttm ?? 0,
      };
    });

    const top5Molecules = moleculesWithScores
      .sort((a, b) => b.lpi3Score - a.lpi3Score)
      .slice(0, 5);

    // Calculate market summary
    const totalRevenue = taMolecules.reduce((sum, mol) => {
      return sum + mol.marketData.reduce((mSum, m) => mSum + m.revenueProjection.year1 + m.revenueProjection.year2, 0);
    }, 0);

    const avgLPI = moleculesWithScores.length > 0
      ? Math.round(moleculesWithScores.reduce((sum, mol) => sum + mol.lpi3Score, 0) / moleculesWithScores.length)
      : 0;

    return {
      taIndex,
      moleculeCount: taMolecules.length,
      top5Molecules,
      totalRevenue,
      avgLPI,
    };
  });

  // Sort by composite score descending
  const sortedTAGroups = taGroups.sort((a, b) => b.taIndex.compositeScore - a.taIndex.compositeScore);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Therapeutic Area Market Overview</h2>
          <p className="text-sm text-muted-foreground">20 therapeutic areas with market summaries and top molecules</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Globe className="h-4 w-4" />
          {taIndexes.length} Therapeutic Areas
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedTAGroups.map((group) => (
          <Card key={group.taIndex.ta} className="hover:shadow-lg transition-shadow">
            <Accordion type="single" collapsible>
              <AccordionItem value={group.taIndex.ta} className="border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-start justify-between w-full pr-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{group.taIndex.ta}</h3>
                        <Badge variant="secondary">{group.moleculeCount} molecules</Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>FDA: {group.taIndex.avgApprovalTimeFDA}mo</span>
                        <span>•</span>
                        <span>EMA: {group.taIndex.avgApprovalTimeEMA}mo</span>
                        <span>•</span>
                        <span>Avg LPI-3: {group.avgLPI}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* TA Composite Score */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Composite</div>
                        <div className={`text-2xl font-bold ${getScoreColor(group.taIndex.compositeScore)}`}>
                          {Math.round(group.taIndex.compositeScore)}%
                        </div>
                      </div>
                      {/* Total Revenue */}
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">2Y Revenue</div>
                        <div className="text-xl font-semibold text-primary">
                          ${(group.totalRevenue / 1000).toFixed(1)}B
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Markets Summary */}
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Markets Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Total Molecules:</span>
                            <span className="font-semibold">{group.moleculeCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Projected 2Y Revenue:</span>
                            <span className="font-semibold text-primary">${(group.totalRevenue / 1000).toFixed(2)}B</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Average LPI-3:</span>
                            <span className={`font-semibold ${getScoreColor(group.avgLPI)}`}>{group.avgLPI}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">TA Composite Score:</span>
                            <span className={`font-semibold ${getScoreColor(group.taIndex.compositeScore)}`}>
                              {Math.round(group.taIndex.compositeScore)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg FDA Approval:</span>
                            <span className="font-semibold">{group.taIndex.avgApprovalTimeFDA} months</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Avg EMA Approval:</span>
                            <span className="font-semibold">{group.taIndex.avgApprovalTimeEMA} months</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top 5 Molecules */}
                    <Card className="border-l-4 border-l-accent">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Top 5 Molecules
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {group.top5Molecules.length > 0 ? (
                          <div className="space-y-2">
                            {group.top5Molecules.map((mol, idx) => (
                              <div key={mol.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getScoreBgColor(mol.lpi3Score)}`}>
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="font-medium text-sm">{mol.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Building2 className="h-3 w-3" />
                                      {mol.company}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">LPI-3</div>
                                    <div className={`font-bold ${getScoreColor(mol.lpi3Score)}`}>{mol.lpi3Score}%</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xs text-muted-foreground">TTM</div>
                                    <div className="font-semibold">{mol.ttm}m</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No molecules in database for this TA
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        ))}
      </div>
    </div>
  );
}
