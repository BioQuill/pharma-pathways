import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Globe, TrendingUp, Building2, DollarSign, Activity, Calendar } from "lucide-react";
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

// Market Dynamics content by TA
const MARKET_DYNAMICS: Record<string, {
  approvedDrugs?: { name: string; details: string }[];
  approvedDrugsTitle?: string;
  pipelineRace?: { name: string; details: string }[];
  marketSize?: { category: string; value: string }[];
  keyTrends?: string[];
  winnersLosers?: { category: string; items: { name: string; details: string }[] }[];
  bottomLine?: string;
  investmentThesis?: string;
  lastUpdated: string;
  nextCatalyst?: string;
}> = {
  'ENDOCRINOLOGY & METABOLISM': {
    approvedDrugsTitle: 'Approved GLP-1 RAs for Obesity/Diabetes:',
    approvedDrugs: [
      { name: 'Wegovy (semaglutide 2.4mg)', details: '~15% weight loss, once-weekly injection' },
      { name: 'Zepbound (tirzepatide 15mg)', details: '~22.5% weight loss, once-weekly injection' },
      { name: 'Rybelsus (oral semaglutide)', details: 'Modest weight loss, daily oral' },
    ],
    pipelineRace: [
      { name: 'Orforglipron (Lilly)', details: 'First oral non-peptide GLP-1, 11-24% weight loss, filing 2025-26' },
      { name: 'Retatrutide (Lilly)', details: '28.7% weight loss (highest to date), filing 2026-27' },
      { name: 'CagriSema (Novo)', details: '22.7% weight loss, filing 2026-27' },
      { name: 'Survodutide (Boehringer)', details: '16-20% weight loss + MASH leader, filing 2026-27' },
      { name: 'Petrelintide (AstraZeneca)', details: 'Unknown efficacy, Phase 2b ongoing' },
    ],
    marketSize: [
      { category: 'Global Obesity Market', value: '$25B in 2025, projected $100B+ by 2030' },
      { category: 'Type 2 Diabetes Market', value: '$50B+ globally' },
      { category: 'MASH Market', value: 'Emerging, $10-20B potential' },
      { category: 'Combined Addressable Market', value: '$150B+ by 2030' },
    ],
    keyTrends: [
      'Efficacy Arms Race: Market moving toward 25-30% weight loss as new standard',
      'Oral Formulations: Orforglipron could revolutionize convenience',
      'Multiple Indications: Drugs targeting obesity + T2D + MASH + CVD simultaneously',
      'Tolerability Focus: As efficacy increases, GI side effects become key differentiator',
      'Access & Pricing: Pressure to reduce costs and improve insurance coverage',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Orforglipron', details: 'First oral GLP-1, superior to competitors, convenient, scalable' },
          { name: 'Retatrutide', details: 'Highest efficacy (28.7%), multiple indications, Lilly\'s next pillar' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Survodutide', details: 'Best-in-class MASH, strong liver focus, niche leadership' },
          { name: 'CagriSema', details: 'Solid efficacy, but needs differentiation vs. tirzepatide' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Petrelintide', details: 'Novel mechanism, but unproven efficacy and late to market' },
        ],
      },
    ],
    bottomLine: 'The endocrinology/metabolism space is experiencing a golden age of innovation. Multiple blockbuster drugs with >$1B potential are advancing through Phase 3, each offering unique benefits. The race for market share will be determined by: (1) Efficacy: 25-30% weight loss becoming the bar, (2) Convenience: Oral > injectable, (3) Safety/Tolerability: Manageable GI side effects critical, (4) Multi-indication: Drugs treating obesity + T2D + MASH + CV will dominate, (5) Time to Market: First movers have significant advantage.',
    investmentThesis: 'Eli Lilly is best positioned with both orforglipron (oral convenience, 2026 launch) and retatrutide (highest efficacy, 2027 launch). Novo Nordisk\'s CagriSema faces tough competition but remains viable. Boehringer Ingelheim\'s survodutide could dominate MASH. AstraZeneca\'s petrelintide is high-risk/high-reward depending on Phase 2b results.',
    lastUpdated: 'December 12, 2025',
    nextCatalyst: 'Retatrutide additional Phase 3 results (7 trials in 2026)',
  },
  'DERMATOLOGY': {
    approvedDrugsTitle: 'Approved Biologics for Inflammatory Skin Conditions:',
    approvedDrugs: [
      { name: 'Dupixent (dupilumab)', details: '~65-75% clear/almost clear skin (EASI-75), every-2-weeks injection' },
      { name: 'Skyrizi (risankizumab)', details: '~85-90% PASI-90 response, every-12-weeks injection' },
      { name: 'Tremfya (guselkumab)', details: '~80-85% PASI-90 response, every-8-weeks injection' },
    ],
    pipelineRace: [
      { name: 'Bimekizumab (UCB)', details: 'Dual IL-17A/F inhibitor, 85-90% PASI-100, approved EU/US 2023-24' },
      { name: 'Nemolizumab (Galderma)', details: 'IL-31 inhibitor for prurigo nodularis/atopic dermatitis, filing 2024-25' },
      { name: 'Lebrikizumab (Lilly)', details: 'IL-13 inhibitor, 40-50% clear skin, approved 2024' },
      { name: 'Rocatinlimab (Pfizer)', details: 'OX40 inhibitor, novel MOA, Phase 3 ongoing' },
      { name: 'Oral JAK inhibitors', details: 'Abrocitinib, Upadacitinib - oral convenience, safety monitoring required' },
    ],
    marketSize: [
      { category: 'Global Atopic Dermatitis Market', value: '$12B in 2025, projected $25B+ by 2030' },
      { category: 'Psoriasis Market', value: '$20B+ globally, projected $30B by 2030' },
      { category: 'Hidradenitis Suppurativa Market', value: 'Emerging, $3-5B potential' },
      { category: 'Combined Addressable Market', value: '$60B+ by 2030' },
    ],
    keyTrends: [
      'Complete Clearance Race: Market moving toward PASI-100/IGA 0 as new efficacy standard',
      'Oral Formulations: JAK inhibitors offering oral convenience vs. biologics',
      'Faster Onset: IL-17 and IL-23 inhibitors showing rapid response within weeks',
      'Safety Differentiation: Long-term safety profiles becoming key differentiator',
      'Expansion to New Indications: AD drugs moving into prurigo nodularis, eczema variants',
    ],
    winnersLosers: [
      {
        category: 'Clear Winners',
        items: [
          { name: 'Bimekizumab', details: 'Highest PASI-100 rates, dual mechanism, rapid onset' },
          { name: 'Skyrizi', details: 'Best-in-class IL-23, convenient quarterly dosing, excellent safety profile' },
        ],
      },
      {
        category: 'Strong Contenders',
        items: [
          { name: 'Nemolizumab', details: 'First IL-31 inhibitor, addresses unmet pruritus need' },
          { name: 'Lebrikizumab', details: 'IL-13 focused, good safety, but crowded AD market' },
        ],
      },
      {
        category: 'Uncertain',
        items: [
          { name: 'Oral JAK inhibitors', details: 'Convenience advantage offset by FDA safety warnings, boxed labels' },
        ],
      },
    ],
    bottomLine: 'The dermatology market is maturing with multiple highly effective biologics achieving near-complete skin clearance. Competition is intensifying around: (1) Complete clearance rates (PASI-100/IGA 0), (2) Dosing convenience (quarterly dosing winning), (3) Safety profiles (long-term data critical), (4) Expansion into adjacent conditions, (5) Oral vs. injectable preference trade-offs.',
    investmentThesis: 'UCB\'s bimekizumab leads with dual IL-17A/F mechanism achieving highest complete clearance. AbbVie\'s Skyrizi dominates IL-23 class with best-in-class efficacy and quarterly dosing. Galderma\'s nemolizumab could capture pruritus-focused niche. JAK inhibitors face headwinds from safety concerns but offer oral convenience for injection-averse patients.',
    lastUpdated: 'December 14, 2025',
    nextCatalyst: 'Nemolizumab Phase 3 atopic dermatitis results and regulatory submissions (2025-26)',
  },
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

function MarketDynamicsSection({ taKey }: { taKey: string }) {
  const dynamics = MARKET_DYNAMICS[taKey];
  
  if (!dynamics) {
    return (
      <Card className="border-l-4 border-l-muted col-span-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Current Market Dynamics
            <Badge variant="outline" className="text-xs ml-2">Coming Soon</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Market dynamics analysis will be available soon for this therapeutic area.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-[hsl(45,93%,47%)] col-span-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Current Market Dynamics
          <Badge variant="outline" className="text-xs ml-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated Dec, 2025
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approved Drugs */}
        {dynamics.approvedDrugs && (
          <div>
            <h4 className="font-semibold text-sm mb-2">{dynamics.approvedDrugsTitle || 'Approved Drugs:'}</h4>
            <div className="space-y-1">
              {dynamics.approvedDrugs.map((drug, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span><strong>{drug.name}:</strong> {drug.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Race */}
        {dynamics.pipelineRace && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Phase 3 Pipeline Race:</h4>
            <div className="space-y-1">
              {dynamics.pipelineRace.map((drug, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span><strong>{drug.name}:</strong> {drug.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Size */}
        {dynamics.marketSize && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Market Size & Growth:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {dynamics.marketSize.map((item, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-muted-foreground">• {item.category}:</span>{' '}
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Trends */}
        {dynamics.keyTrends && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Key Trends:</h4>
            <div className="space-y-1">
              {dynamics.keyTrends.map((trend, idx) => (
                <div key={idx} className="text-sm flex gap-2">
                  <span className="font-medium text-muted-foreground">{idx + 1}.</span>
                  <span>{trend}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Winners & Losers */}
        {dynamics.winnersLosers && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Winners & Losers (Projected):</h4>
            <div className="space-y-2">
              {dynamics.winnersLosers.map((group, idx) => (
                <div key={idx}>
                  <span className="text-sm font-medium text-primary">{group.category}:</span>
                  <div className="ml-4 space-y-1">
                    {group.items.map((item, i) => (
                      <div key={i} className="text-sm">
                        <strong>{item.name}:</strong> {item.details}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Line */}
        {dynamics.bottomLine && (
          <div className="bg-muted/50 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-1">Bottom Line:</h4>
            <p className="text-sm">{dynamics.bottomLine}</p>
          </div>
        )}

        {/* Investment Thesis */}
        {dynamics.investmentThesis && (
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-sm mb-1 text-primary">Investment Thesis:</h4>
            <p className="text-sm">{dynamics.investmentThesis}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
          <span>Last Updated: {dynamics.lastUpdated}</span>
          {dynamics.nextCatalyst && (
            <span>Next Major Catalyst: {dynamics.nextCatalyst}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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

                  {/* Current Market Dynamics Section */}
                  <div className="mt-6">
                    <MarketDynamicsSection taKey={group.taIndex.ta} />
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