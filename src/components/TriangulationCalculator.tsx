import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calculator, ArrowRight, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export const TriangulationCalculator = () => {
  const [model1Prob, setModel1Prob] = useState(72);
  const [model2Prob, setModel2Prob] = useState(68);
  const [isFirstInClass, setIsFirstInClass] = useState(false);

  const results = useMemo(() => {
    const w1 = isFirstInClass ? 0.6 : 0.4;
    const w2 = 1 - w1;
    const weighted = model1Prob * w1 + model2Prob * w2;
    const divergence = Math.abs(model1Prob - model2Prob);

    let confidence: string;
    let confidenceColor: string;
    let interpretation: string;
    let action: string;

    if (divergence <= 10 && weighted >= 70) {
      confidence = "High Confidence";
      confidenceColor = "bg-green-100 text-green-800 border-green-300";
      interpretation = "Models converge at a high level — strong consensus for payer support.";
      action = "Proceed with confidence; prioritize market entry and accelerate launch preparation.";
    } else if (divergence <= 10 && weighted >= 45) {
      confidence = "Moderate Confidence";
      confidenceColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
      interpretation = "Models converge at a moderate level — proceed with caution.";
      action = "Conduct deeper diligence; consider risk-sharing or outcomes-based contracts.";
    } else if (divergence <= 10 && weighted < 45) {
      confidence = "Low Confidence (Bearish)";
      confidenceColor = "bg-red-100 text-red-800 border-red-300";
      interpretation = "Models converge low — both signal significant access challenges.";
      action = "Deep investigation required. Consider indication repositioning or pricing strategy pivot.";
    } else if (divergence > 10 && divergence <= 20) {
      confidence = "Moderate Divergence";
      confidenceColor = "bg-yellow-100 text-yellow-800 border-yellow-300";
      interpretation = "Models partially disagree — one may capture factors the other misses.";
      action = "Validate comparator assumptions; investigate which model better fits your molecule's profile.";
    } else {
      confidence = "High Divergence — Red Flag";
      confidenceColor = "bg-red-100 text-red-800 border-red-300";
      interpretation = "Extreme divergence between models — high uncertainty in payer outlook.";
      action = "High risk; consider indication repositioning, pricing strategy overhaul, or deprioritize.";
    }

    return { w1, w2, weighted, divergence, confidence, confidenceColor, interpretation, action };
  }, [model1Prob, model2Prob, isFirstInClass]);

  const getBandInfo = (prob: number) => {
    if (prob >= 75) return { label: "Accelerate", color: "bg-green-500" };
    if (prob >= 60) return { label: "Proceed", color: "bg-blue-500" };
    if (prob >= 45) return { label: "Deep-Dive", color: "bg-yellow-500" };
    return { label: "Pause/Pivot", color: "bg-red-500" };
  };

  const band = getBandInfo(results.weighted);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Interactive Triangulation Calculator
        </CardTitle>
        <CardDescription>
          Input Model 1 and Model 2 probabilities to compute the confidence-weighted result using the W₁/W₂ formula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Model 1 (MWPSPI) Probability: {model1Prob}%</Label>
            <Slider
              value={[model1Prob]}
              onValueChange={(v) => setModel1Prob(v[0])}
              min={5}
              max={95}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Weighted scoring model — absolute clinical, economic, access & political merit</p>
          </div>
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Model 2 (Benchmark) Probability: {model2Prob}%</Label>
            <Slider
              value={[model2Prob]}
              onValueChange={(v) => setModel2Prob(v[0])}
              min={5}
              max={95}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">Comparative benchmarking — historical base rates × comparator ratios</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <Switch checked={isFirstInClass} onCheckedChange={setIsFirstInClass} />
          <div>
            <Label className="text-sm font-semibold">First-in-Class Molecule</Label>
            <p className="text-xs text-muted-foreground">
              {isFirstInClass
                ? "W₁ = 0.6 (favoring Model 1 — no comparators to benchmark against)"
                : "W₁ = 0.4 (favoring Model 2 — comparator data is more reliable)"}
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Formula</p>
              <p className="text-xs font-mono">
                ({model1Prob}% × {results.w1}) + ({model2Prob}% × {results.w2})
              </p>
              <p className="text-2xl font-bold mt-2">{results.weighted.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Confidence-Weighted Probability</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Model Divergence</p>
              <p className="text-2xl font-bold mt-2">{results.divergence}pp</p>
              <p className="text-xs text-muted-foreground">
                {results.divergence <= 10 ? "Convergent" : results.divergence <= 20 ? "Moderate gap" : "High divergence"}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Decision Band</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className={`h-3 w-3 rounded-full ${band.color}`} />
                <p className="text-lg font-bold">{band.label}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {results.weighted >= 75 ? ">75%" : results.weighted >= 60 ? "60-75%" : results.weighted >= 45 ? "45-60%" : "<45%"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interpretation */}
        <Card className={`border ${results.confidenceColor}`}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              {results.divergence <= 10 && results.weighted >= 60 ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : results.divergence > 20 ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              )}
              <Badge className={results.confidenceColor}>{results.confidence}</Badge>
            </div>
            <p className="text-sm"><strong>Interpretation:</strong> {results.interpretation}</p>
            <p className="text-sm"><strong>Recommended Action:</strong> {results.action}</p>
          </CardContent>
        </Card>

        {/* Weight Visualization */}
        <div className="p-3 bg-muted/20 rounded-lg">
          <p className="text-xs font-semibold mb-2">Weight Distribution</p>
          <div className="flex items-center gap-2">
            <span className="text-xs w-20">Model 1 ({(results.w1 * 100).toFixed(0)}%)</span>
            <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden flex">
              <div className="bg-blue-500 h-full transition-all" style={{ width: `${results.w1 * 100}%` }} />
              <div className="bg-green-500 h-full transition-all" style={{ width: `${results.w2 * 100}%` }} />
            </div>
            <span className="text-xs w-20 text-right">Model 2 ({(results.w2 * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
