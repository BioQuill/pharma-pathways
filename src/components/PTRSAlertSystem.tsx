import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, TrendingUp, TrendingDown, Bell, BellRing, ArrowUp, ArrowDown, Minus, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { type MoleculeProfile } from "@/lib/moleculesData";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface PTRSAlertSystemProps {
  molecules: MoleculeProfile[];
}

interface Alert {
  id: string;
  molecule: MoleculeProfile;
  type: 'significant_increase' | 'significant_decrease' | 'phase_transition' | 'high_performer' | 'risk_warning';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  fromPhase: string;
  toPhase: string;
  ptrsChange: number;
  currentPTRS: number;
  previousPTRS: number;
}

// PTRS calculation by phase
const calculatePTRSByPhase = (molecule: MoleculeProfile, phaseKey: string) => {
  const taBaseRates: Record<string, { pts: number; prs: number }> = {
    oncology: { pts: 12, prs: 82 },
    cns: { pts: 8, prs: 78 },
    cardiovascular: { pts: 15, prs: 85 },
    infectious: { pts: 22, prs: 88 },
    immunology: { pts: 18, prs: 84 },
    metabolic: { pts: 16, prs: 86 },
    rareDisease: { pts: 25, prs: 90 },
    dermatology: { pts: 20, prs: 87 },
  };

  const phaseMultipliers: Record<string, number> = {
    preclinical: 0.3,
    phase1: 0.5,
    phase2: 0.75,
    phase3: 1.2,
    nda: 1.5,
    approved: 2.0,
  };

  const getTAKey = (ta: string): string => {
    const taLower = ta.toLowerCase();
    if (taLower.includes("oncology") || taLower.includes("hematology")) return "oncology";
    if (taLower.includes("cns") || taLower.includes("neurology")) return "cns";
    if (taLower.includes("cardio")) return "cardiovascular";
    if (taLower.includes("infectious")) return "infectious";
    if (taLower.includes("immun")) return "immunology";
    if (taLower.includes("metabol") || taLower.includes("endocr") || taLower.includes("diabetes") || taLower.includes("obesity")) return "metabolic";
    if (taLower.includes("rare")) return "rareDisease";
    if (taLower.includes("derma")) return "dermatology";
    return "oncology";
  };

  const taKey = getTAKey(molecule.therapeuticArea);
  const baseRate = taBaseRates[taKey] || { pts: 15, prs: 85 };
  const phaseMultiplier = phaseMultipliers[phaseKey] || 1;

  const phaseUncertainty: Record<string, number> = {
    preclinical: 0.6,
    phase1: 0.75,
    phase2: 0.85,
    phase3: 0.95,
    nda: 1.0,
    approved: 1.0,
  };

  const uncertainty = phaseUncertainty[phaseKey] || 0.85;
  const mechanismNovelty = molecule.scores ? Math.round(molecule.scores.meetingEndpoints * 100 * uncertainty) : 50;
  const endpointClarity = molecule.scores ? Math.round(molecule.scores.approval * 100 * uncertainty) : 70;
  const priorTrialData = molecule.scores ? Math.round(molecule.scores.nextPhase * 100 * uncertainty) : 60;
  const sponsorExperience = molecule.companyTrackRecord === 'fast' ? 80 : molecule.companyTrackRecord === 'average' ? 60 : 45;
  const regulatoryPrecedent = molecule.scores ? Math.round(molecule.scores.regulatoryPathway.accelerated * 100 * uncertainty) : 75;
  const safetyProfile = molecule.scores ? Math.round((1 - molecule.scores.dropoutRanking / 5) * 100 * uncertainty) : 70;

  const ptsAdjustment = (mechanismNovelty * 0.15 + endpointClarity * 0.25 + priorTrialData * 0.35 + sponsorExperience * 0.25) / 100;
  const pts = Math.min(95, Math.max(5, baseRate.pts * phaseMultiplier * (0.5 + ptsAdjustment)));

  const prsAdjustment = (regulatoryPrecedent * 0.4 + safetyProfile * 0.4 + sponsorExperience * 0.2) / 100;
  const prs = Math.min(98, Math.max(50, baseRate.prs * (0.7 + prsAdjustment * 0.6)));

  const ptrs = (pts / 100) * prs;

  return Math.round(ptrs * 10) / 10;
};

const phaseOrder = ["Preclinical", "Phase 1", "Phase 2", "Phase 3", "NDA/BLA", "Approved"];
const phaseKeys = ["preclinical", "phase1", "phase2", "phase3", "nda", "approved"];

const getCurrentPhaseIndex = (phase: string): number => {
  const phaseLower = phase.toLowerCase();
  if (phaseLower.includes("preclinical")) return 0;
  if (phaseLower.includes("phase i") && !phaseLower.includes("ii") && !phaseLower.includes("iii")) return 1;
  if (phaseLower.includes("phase ii") && !phaseLower.includes("iii")) return 2;
  if (phaseLower.includes("phase iii") || phaseLower.includes("phase 3")) return 3;
  if (phaseLower.includes("nda") || phaseLower.includes("bla") || phaseLower.includes("filed")) return 4;
  if (phaseLower.includes("approved")) return 5;
  return 2;
};

export const PTRSAlertSystem = ({ molecules }: PTRSAlertSystemProps) => {
  const [alertThreshold, setAlertThreshold] = useState<number>(25);
  const [showIncreases, setShowIncreases] = useState(true);
  const [showDecreases, setShowDecreases] = useState(true);
  const [showHighPerformers, setShowHighPerformers] = useState(true);
  const [showRiskWarnings, setShowRiskWarnings] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Generate alerts based on phase transitions
  const alerts = useMemo(() => {
    const generatedAlerts: Alert[] = [];

    molecules.slice(0, 100).forEach((molecule) => {
      const currentPhaseIdx = getCurrentPhaseIndex(molecule.phase);
      
      // Only generate alerts for molecules past preclinical
      if (currentPhaseIdx > 0) {
        const previousPhaseKey = phaseKeys[currentPhaseIdx - 1];
        const currentPhaseKey = phaseKeys[currentPhaseIdx];
        
        const previousPTRS = calculatePTRSByPhase(molecule, previousPhaseKey);
        const currentPTRS = calculatePTRSByPhase(molecule, currentPhaseKey);
        
        const ptrsChange = currentPTRS - previousPTRS;
        const ptrsChangePercent = ((currentPTRS - previousPTRS) / previousPTRS) * 100;

        // Significant increase alert
        if (ptrsChangePercent >= alertThreshold) {
          generatedAlerts.push({
            id: `${molecule.id}-increase`,
            molecule,
            type: 'significant_increase',
            severity: 'success',
            title: 'Significant PTRS Increase',
            message: `PTRS increased by ${ptrsChangePercent.toFixed(1)}% after advancing to ${phaseOrder[currentPhaseIdx]}`,
            fromPhase: phaseOrder[currentPhaseIdx - 1],
            toPhase: phaseOrder[currentPhaseIdx],
            ptrsChange: ptrsChangePercent,
            currentPTRS,
            previousPTRS,
          });
        }

        // Smaller than expected increase (potential warning)
        if (ptrsChangePercent > 0 && ptrsChangePercent < alertThreshold * 0.5) {
          generatedAlerts.push({
            id: `${molecule.id}-weak-increase`,
            molecule,
            type: 'risk_warning',
            severity: 'warning',
            title: 'Below-Average PTRS Growth',
            message: `PTRS grew only ${ptrsChangePercent.toFixed(1)}% - below typical phase progression`,
            fromPhase: phaseOrder[currentPhaseIdx - 1],
            toPhase: phaseOrder[currentPhaseIdx],
            ptrsChange: ptrsChangePercent,
            currentPTRS,
            previousPTRS,
          });
        }

        // High performer detection
        if (currentPTRS >= 25) {
          generatedAlerts.push({
            id: `${molecule.id}-high`,
            molecule,
            type: 'high_performer',
            severity: 'info',
            title: 'High PTRS Performer',
            message: `Currently at ${currentPTRS}% PTRS - in top tier for ${molecule.therapeuticArea}`,
            fromPhase: phaseOrder[currentPhaseIdx - 1],
            toPhase: phaseOrder[currentPhaseIdx],
            ptrsChange: ptrsChangePercent,
            currentPTRS,
            previousPTRS,
          });
        }

        // Low PTRS risk warning
        if (currentPTRS < 10 && currentPhaseIdx >= 2) {
          generatedAlerts.push({
            id: `${molecule.id}-low-risk`,
            molecule,
            type: 'risk_warning',
            severity: 'critical',
            title: 'Low PTRS Risk Alert',
            message: `PTRS of ${currentPTRS}% at ${phaseOrder[currentPhaseIdx]} indicates elevated development risk`,
            fromPhase: phaseOrder[currentPhaseIdx - 1],
            toPhase: phaseOrder[currentPhaseIdx],
            ptrsChange: ptrsChangePercent,
            currentPTRS,
            previousPTRS,
          });
        }
      }
    });

    return generatedAlerts;
  }, [molecules, alertThreshold]);

  // Filter alerts based on settings
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (alert.type === 'significant_increase' && !showIncreases) return false;
      if (alert.type === 'significant_decrease' && !showDecreases) return false;
      if (alert.type === 'high_performer' && !showHighPerformers) return false;
      if (alert.type === 'risk_warning' && !showRiskWarnings) return false;
      return true;
    });
  }, [alerts, showIncreases, showDecreases, showHighPerformers, showRiskWarnings]);

  // Group alerts by severity
  const alertsBySeverity = useMemo(() => ({
    critical: filteredAlerts.filter(a => a.severity === 'critical'),
    warning: filteredAlerts.filter(a => a.severity === 'warning'),
    success: filteredAlerts.filter(a => a.severity === 'success'),
    info: filteredAlerts.filter(a => a.severity === 'info'),
  }), [filteredAlerts]);

  const getSeverityStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-50 dark:bg-red-950/30';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30';
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-950/30';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/30';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              PTRS Alert System
            </CardTitle>
            <CardDescription>
              Molecules with significant PTRS changes between development phases
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {alertsBySeverity.critical.length} Critical
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              {alertsBySeverity.warning.length} Warning
            </Badge>
            <Badge variant="outline" className="gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {alertsBySeverity.success.length} Positive
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Configuration */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 w-full justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Alert Filters & Settings
              </span>
              {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid gap-6 md:grid-cols-2 p-4 bg-muted/30 rounded-lg">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Alert Threshold: {alertThreshold}%</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Minimum PTRS change to trigger significant increase alert
                  </p>
                  <Slider
                    value={[alertThreshold]}
                    onValueChange={(v) => setAlertThreshold(v[0])}
                    min={10}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-increases" className="text-sm">Show Significant Increases</Label>
                  <Switch id="show-increases" checked={showIncreases} onCheckedChange={setShowIncreases} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-decreases" className="text-sm">Show Decreases</Label>
                  <Switch id="show-decreases" checked={showDecreases} onCheckedChange={setShowDecreases} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-high" className="text-sm">Show High Performers</Label>
                  <Switch id="show-high" checked={showHighPerformers} onCheckedChange={setShowHighPerformers} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-risk" className="text-sm">Show Risk Warnings</Label>
                  <Switch id="show-risk" checked={showRiskWarnings} onCheckedChange={setShowRiskWarnings} />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Summary Stats */}
        <div className="grid gap-3 md:grid-cols-4">
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{alertsBySeverity.critical.length}</p>
            <p className="text-xs text-red-600/80">Critical Alerts</p>
          </div>
          <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 text-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-yellow-600">{alertsBySeverity.warning.length}</p>
            <p className="text-xs text-yellow-600/80">Warnings</p>
          </div>
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 text-center">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{alertsBySeverity.success.length}</p>
            <p className="text-xs text-green-600/80">Positive Signals</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 text-center">
            <Bell className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{alertsBySeverity.info.length}</p>
            <p className="text-xs text-blue-600/80">Informational</p>
          </div>
        </div>

        {/* Alert List */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No alerts match current filter settings</p>
              <p className="text-sm mt-1">Adjust the threshold or enable more alert types</p>
            </div>
          ) : (
            filteredAlerts.slice(0, 20).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 rounded-lg border-l-4 ${getSeverityStyles(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge 
                        variant={alert.ptrsChange > 0 ? "default" : "destructive"}
                        className="gap-1"
                      >
                        {alert.ptrsChange > 0 ? <ArrowUp className="h-3 w-3" /> : alert.ptrsChange < 0 ? <ArrowDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        {alert.ptrsChange > 0 ? '+' : ''}{alert.ptrsChange.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{alert.molecule.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{alert.molecule.company}</span>
                      <span>•</span>
                      <span>{alert.molecule.therapeuticArea}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-muted-foreground">{alert.previousPTRS}%</span>
                        <span>→</span>
                        <span className="font-semibold text-foreground">{alert.currentPTRS}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredAlerts.length > 20 && (
          <p className="text-sm text-center text-muted-foreground">
            Showing 20 of {filteredAlerts.length} alerts
          </p>
        )}
      </CardContent>
    </Card>
  );
};
