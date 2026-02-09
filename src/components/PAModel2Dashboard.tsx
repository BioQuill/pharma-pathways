import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart3, Calculator, Globe, TrendingUp, Target, Lightbulb, FileText } from "lucide-react";

// ============ DATA ============
const historicalApprovalRates = [
  { market: "US Commercial", oncology: 75, rareDisease: 85, chronicDisease: 60, preventive: 45 },
  { market: "US Medicare", oncology: 80, rareDisease: 90, chronicDisease: 65, preventive: 50 },
  { market: "US Medicaid MCO", oncology: 50, rareDisease: 60, chronicDisease: 40, preventive: 25 },
  { market: "UK NICE", oncology: 70, rareDisease: 85, chronicDisease: 45, preventive: 30 },
  { market: "Germany G-BA", oncology: 55, rareDisease: 75, chronicDisease: 45, preventive: 35 },
  { market: "France HAS", oncology: 40, rareDisease: 60, chronicDisease: 35, preventive: 25 },
  { market: "Japan MHLW", oncology: 35, rareDisease: 50, chronicDisease: 25, preventive: 20 },
  { market: "China NHSA", oncology: 30, rareDisease: 40, chronicDisease: 25, preventive: 15 },
  { market: "India PM-JAY", oncology: 25, rareDisease: 35, chronicDisease: 20, preventive: 10 },
  { market: "Brazil CONITEC", oncology: 35, rareDisease: 45, chronicDisease: 25, preventive: 15 },
];

const comparativeMetrics = [
  { dimension: "Clinical benefit (HR, effect size)", yourMolecule: "[value]", comparatorAvg: "[value]", ratio: "X/Y" },
  { dimension: "Safety (Grade 3+ AE rate)", yourMolecule: "[value]", comparatorAvg: "[value]", ratio: "Y/X (inverse)" },
  { dimension: "ICER ($/QALY or local)", yourMolecule: "[value]", comparatorAvg: "[value]", ratio: "Y/X (inverse)" },
  { dimension: "Target population", yourMolecule: "[value]", comparatorAvg: "[value]", ratio: "X/Y" },
  { dimension: "Price vs. SOC", yourMolecule: "[value]", comparatorAvg: "[value]", ratio: "Y/X (inverse)" },
  { dimension: "Evidence quality (RCT design)", yourMolecule: "[1-5 scale]", comparatorAvg: "[avg]", ratio: "X/Y" },
];

const compositeScoreInterpretation = [
  { range: ">1.2", label: "Significantly better than comparators", color: "bg-green-100 text-green-800 border-green-200" },
  { range: "1.0-1.2", label: "Similar to comparators", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { range: "0.8-1.0", label: "Slightly worse than comparators", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { range: "<0.8", label: "Significantly worse than comparators", color: "bg-red-100 text-red-800 border-red-200" },
];

const marketAdjustments = [
  {
    market: "United States 🇺🇸", adjustments: [
      { item: "Breakthrough designation", value: "+15%" },
      { item: "PBM formulary priority (3+ mega-PBMs)", value: "+10%" },
      { item: "Medicare coverage pathway clear", value: "+12%" },
      { item: "High budget impact (>$500M/year single payer)", value: "-15%" },
      { item: "Medicaid MCO target", value: "-20% (budget constraints severe)" },
    ],
  },
  {
    market: "United Kingdom 🇬🇧", adjustments: [
      { item: "End-of-life criteria met", value: "+15%" },
      { item: "Rare disease (HST pathway)", value: "+20%" },
      { item: "Budget impact >£200M/year", value: "-20%" },
      { item: "CDF pathway available", value: "+10%" },
    ],
  },
  {
    market: "Germany 🇩🇪", adjustments: [
      { item: "Orphan designation", value: "+25% (no AMNOG assessment)" },
      { item: "Additional benefit rating 3-4", value: "+15%" },
      { item: "Head-to-head RCT vs. SOC", value: "+12%" },
      { item: "No additional benefit (6)", value: "-30%" },
    ],
  },
  {
    market: "Japan 🇯🇵", adjustments: [
      { item: "Novel mechanism (innovation premium)", value: "+20%" },
      { item: "Japanese Phase III data", value: "+15%" },
      { item: "Sakigake designation", value: "+18%" },
      { item: "Repricing trigger risk (sales >150% forecast)", value: "-10%" },
    ],
  },
  {
    market: "China 🇨🇳", adjustments: [
      { item: "60%+ VBP price cut accepted", value: "+25%" },
      { item: "Local manufacturing", value: "+15%" },
      { item: "Chinese clinical trial", value: "+10%" },
      { item: "Technology transfer", value: "+8%" },
      { item: "Import-only, no local trial", value: "-25%" },
    ],
  },
  {
    market: "India 🇮🇳", adjustments: [
      { item: "PM-JAY disease priority", value: "+15%" },
      { item: "< ₹5 lakh/patient/year", value: "+20%" },
      { item: "CGHS rate card aligned", value: "+10%" },
      { item: "1000+ empaneled hospitals", value: "+8%" },
      { item: ">₹20 lakh/patient", value: "-30%" },
    ],
  },
  {
    market: "Brazil 🇧🇷", adjustments: [
      { item: "CONITEC priority disease", value: "+15%" },
      { item: "< BRL 100M budget impact", value: "+18%" },
      { item: "Local Brazilian trial", value: "+12%" },
      { item: "Generic already available", value: "-20%" },
    ],
  },
];

const practicalExample = {
  title: "Hypothetical Molecule: Novel PCSK9 inhibitor for LDL reduction (cardiovascular prevention)",
  model1: {
    market: "US Market (UnitedHealth)",
    sections: [
      { title: "Clinical Value (25 points max)", items: [
        { label: "Efficacy", detail: "Non-inferior to evolocumab, 55% LDL reduction → 5 points" },
        { label: "Safety", detail: "Clean profile, no black box → 8 points" },
        { label: "Unmet need", detail: "Crowded PCSK9 market, but statin-intolerant niche → 3 points" },
      ], subtotal: "16/25" },
      { title: "Economic Value (35 points max)", items: [
        { label: "ICER", detail: "$120K/QALY (borderline) → 8 points" },
        { label: "Budget impact", detail: "$200M/year UnitedHealth → 5 points" },
        { label: "Cost offsets", detail: "Prevents MIs, documented → 7 points" },
      ], subtotal: "20/35" },
      { title: "Access/Market (25 points max)", items: [
        { label: "Payer strategy", detail: "Targeting UnitedHealth + Anthem first → 8 points" },
        { label: "PBM", detail: "CVS Caremark Tier 3 specialty → 7 points" },
        { label: "Prior auth", detail: "Extensive (statin failure required) → 3 points" },
      ], subtotal: "18/25" },
      { title: "Political/Procedural (15 points max)", items: [
        { label: "FDA", detail: "Standard approval (no breakthrough) → 2 points" },
        { label: "Risk-sharing", detail: "Outcomes-based rebate on CV events → 4 points" },
        { label: "Guidelines", detail: "ACC/AHA mentions PCSK9 class → 3 points" },
      ], subtotal: "9/15" },
    ],
    totalScore: "63/100",
    interpretation: "High probability (65-70%)—approval likely with 15-20% rebate negotiations and prior authorization requirements. Payment terms: 30-45 days.",
  },
  model2: {
    market: "UK Market (NICE)",
    baseRate: "Chronic disease cardiovascular = 45%",
    comparatorAnalysis: [
      "Clinical benefit: Similar to evolocumab (ratio 1.0)",
      "Safety: Similar (ratio 1.0)",
      "ICER: £45K/QALY vs. evolocumab £47K (ratio 1.04)",
    ],
    compositeScore: "1.01 (on par with comparators)",
    adjustments: [
      "Budget impact >£200M: -20%",
      "CDF pathway available: +10%",
    ],
    calculation: "(45% × 1.01) - 20% + 10% = 35%",
    interpretation: "Moderate-Low probability (35%)—NICE likely to request significant price reduction (30-40%) for optimized recommendation or CDF managed access.",
  },
};

const criticalSuccessFactors = [
  { market: "US", factors: "PBM formulary access + Medicare pathway + risk-sharing flexibility" },
  { market: "UK", factors: "NICE cost-effectiveness + CDF pathway + budget impact mitigation" },
  { market: "Germany", factors: "G-BA additional benefit rating + head-to-head RCT + orphan status (if applicable)" },
  { market: "Japan", factors: "Innovation premium eligibility + Japanese clinical data + repricing risk management" },
  { market: "China", factors: "VBP price cut acceptance + local manufacturing + volume commitments" },
  { market: "India", factors: "PM-JAY affordability + multi-scheme strategy + hospital network penetration" },
  { market: "Brazil", factors: "CONITEC budget impact + local trial data + private insurance parallel strategy" },
];

// ============ MAIN COMPONENT ============
export const PAModel2Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            PA Index-2 & Model 2: Comparative Payer Likelihood Matrix (Benchmarking)
          </CardTitle>
          <CardDescription className="text-base">
            Uses historical approval rates combined with molecule-specific factors for rapid benchmarking across multiple markets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 border font-mono text-sm text-center">
            Probability = (Base Rate × Composite Score) + Market Adjustments
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Base Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            Step 1: Historical Approval Rates by Market & Therapeutic Area
          </CardTitle>
          <CardDescription>Base rates from documented payer data implications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Market</th>
                  <th className="text-center p-3 font-semibold text-red-600">Oncology</th>
                  <th className="text-center p-3 font-semibold text-purple-600">Rare Disease</th>
                  <th className="text-center p-3 font-semibold text-blue-600">Chronic Disease</th>
                  <th className="text-center p-3 font-semibold text-green-600">Preventive</th>
                </tr>
              </thead>
              <tbody>
                {historicalApprovalRates.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{row.market}</td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`${row.oncology >= 70 ? 'text-green-600 border-green-300' : row.oncology >= 40 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
                        {row.oncology}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`${row.rareDisease >= 70 ? 'text-green-600 border-green-300' : row.rareDisease >= 40 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
                        {row.rareDisease}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`${row.chronicDisease >= 50 ? 'text-green-600 border-green-300' : row.chronicDisease >= 30 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
                        {row.chronicDisease}%
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className={`${row.preventive >= 40 ? 'text-green-600 border-green-300' : row.preventive >= 20 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'}`}>
                        {row.preventive}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Note: Germany shows "additional benefit 3-5" for oncology; UK NICE shows "HST pathway" for rare disease; France HAS shows "ASMR I-III" for oncology; Japan shows "premium pricing" for oncology; China shows "VBP inclusion" for oncology
          </p>
        </CardContent>
      </Card>

      {/* Step 2: Comparator Scoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Step 2: Score Your Molecule vs. Recent Comparators
          </CardTitle>
          <CardDescription>Find 3-5 analogous molecules approved 2022-2025 in therapeutic area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-semibold">Dimension</th>
                  <th className="text-center p-3 font-semibold">Your Molecule (X)</th>
                  <th className="text-center p-3 font-semibold">Comparator Avg (Y)</th>
                  <th className="text-center p-3 font-semibold">Ratio</th>
                </tr>
              </thead>
              <tbody>
                {comparativeMetrics.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">{row.dimension}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.yourMolecule}</td>
                    <td className="p-3 text-center text-muted-foreground">{row.comparatorAvg}</td>
                    <td className="p-3 text-center"><Badge variant="outline" className="text-xs">{row.ratio}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Composite Comparator Score = Average all ratios</h4>
            <div className="flex flex-wrap gap-2">
              {compositeScoreInterpretation.map((item, i) => (
                <Badge key={i} className={`text-xs ${item.color}`}>{item.range}: {item.label}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Market Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Step 3: Market-Specific Probability Adjustments
          </CardTitle>
          <CardDescription>Add/subtract based on market-specific factors</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {marketAdjustments.map((market, idx) => (
              <AccordionItem key={idx} value={`adj-${idx}`} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-semibold">{market.market}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1.5">
                    {market.adjustments.map((adj, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm rounded p-2 ${adj.value.startsWith('+') ? 'bg-green-50 dark:bg-green-950/20 border border-green-200' : 'bg-red-50 dark:bg-red-950/20 border border-red-200'}`}>
                        <Badge variant="outline" className={`text-xs min-w-[60px] justify-center ${adj.value.startsWith('+') ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300'}`}>
                          {adj.value.split(' ')[0]}
                        </Badge>
                        <span>{adj.item}</span>
                        {adj.value.includes('(') && <span className="text-xs text-muted-foreground ml-auto">({adj.value.split('(')[1]}</span>}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Step 4: Example Calculation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Step 4: Final Probability Calculation — Example
          </CardTitle>
          <CardDescription>Oncology drug, US Medicare market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 border space-y-2 text-sm">
            <p><strong>Base rate:</strong> 80%</p>
            <p><strong>Composite score:</strong> 1.15 (15% better than comparators)</p>
            <p><strong>Breakthrough designation:</strong> +15%</p>
            <p><strong>Budget impact moderate:</strong> 0%</p>
            <div className="border-t pt-2 mt-2 font-mono">
              <p>Calculation: (80% × 1.15) + 15% = 92% + 15% = 107% → <strong>cap at 95%</strong> (very high confidence)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practical Application */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lightbulb className="h-5 w-5 text-primary" />
            Practical Application: {practicalExample.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Model 1 Application */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Model 1 Application — {practicalExample.model1.market}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {practicalExample.model1.sections.map((section, idx) => (
                <div key={idx} className="border rounded p-3">
                  <h5 className="font-semibold text-sm mb-2">{section.title}</h5>
                  {section.items.map((item, i) => (
                    <div key={i} className="text-xs mb-1">
                      <span className="font-medium">{item.label}:</span> <span className="text-muted-foreground">{item.detail}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-1 text-sm font-semibold">Subtotal: {section.subtotal}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-3">
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">Total Score: {practicalExample.model1.totalScore}</p>
              <p className="text-sm text-muted-foreground mt-1">{practicalExample.model1.interpretation}</p>
            </div>
          </div>

          {/* Model 2 Application */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Model 2 Application — {practicalExample.model2.market}</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Base Rate:</strong> {practicalExample.model2.baseRate}</p>
              <div>
                <strong>Comparator Analysis:</strong>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {practicalExample.model2.comparatorAnalysis.map((item, i) => (
                    <li key={i} className="text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Composite Score:</strong> {practicalExample.model2.compositeScore}</p>
              <div>
                <strong>Market Adjustments:</strong>
                <ul className="ml-4 mt-1 space-y-0.5">
                  {practicalExample.model2.adjustments.map((adj, i) => (
                    <li key={i} className="text-muted-foreground">• {adj}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted/50 rounded p-2 font-mono">{practicalExample.model2.calculation}</div>
            </div>
            <div className="mt-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">{practicalExample.model2.interpretation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Summary Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Use Model 1</h4>
              <p className="text-sm text-muted-foreground">For detailed market-entry planning with specific payer targets (especially US fragmented market)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Use Model 2</h4>
              <p className="text-sm text-muted-foreground">When you have recent comparator data and want rapid benchmarking across multiple markets</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Critical Success Factors by Market</h4>
            <div className="space-y-1.5">
              {criticalSuccessFactors.map((csf, i) => (
                <div key={i} className="flex items-start gap-2 text-sm bg-muted/30 rounded p-2 border">
                  <Badge variant="secondary" className="text-xs shrink-0 min-w-[60px] justify-center">{csf.market}</Badge>
                  <span>{csf.factors}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
