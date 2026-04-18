import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Clock, Globe, Zap, ArrowRight, RotateCcw } from "lucide-react";

interface RegulatoryOption {
  code: string;
  name: string;
  flag: string;
  standardReview: number;
  priorityReview: number;
  acceleratedReview: number;
  parallelFiling: boolean; // Can file in parallel with FDA
  referenceRequired: boolean; // Requires prior FDA/EMA approval
}

const REGULATORY_OPTIONS: RegulatoryOption[] = [
  {
    code: 'US',
    name: 'United States (FDA)',
    flag: 'US',
    standardReview: 12,
    priorityReview: 6,
    acceleratedReview: 4,
    parallelFiling: true,
    referenceRequired: false,
  },
  {
    code: 'EU',
    name: 'European Union (EMA)',
    flag: 'EU',
    standardReview: 15,
    priorityReview: 9,
    acceleratedReview: 6,
    parallelFiling: true,
    referenceRequired: false,
  },
  {
    code: 'CN',
    name: 'China (NMPA)',
    flag: 'CN',
    standardReview: 18,
    priorityReview: 10,
    acceleratedReview: 6,
    parallelFiling: false,
    referenceRequired: true,
  },
  {
    code: 'JP',
    name: 'Japan (PMDA)',
    flag: 'JP',
    standardReview: 12,
    priorityReview: 9,
    acceleratedReview: 6,
    parallelFiling: true,
    referenceRequired: false,
  },
  {
    code: 'UK',
    name: 'United Kingdom (MHRA)',
    flag: 'GB',
    standardReview: 10,
    priorityReview: 6,
    acceleratedReview: 4,
    parallelFiling: true,
    referenceRequired: false,
  },
  {
    code: 'CA',
    name: 'Canada (Health Canada)',
    flag: 'CA',
    standardReview: 12,
    priorityReview: 6,
    acceleratedReview: 4,
    parallelFiling: true,
    referenceRequired: false,
  },
  {
    code: 'BR',
    name: 'Brazil (ANVISA)',
    flag: 'BR',
    standardReview: 24,
    priorityReview: 12,
    acceleratedReview: 8,
    parallelFiling: false,
    referenceRequired: true,
  },
  {
    code: 'AU',
    name: 'Australia (TGA)',
    flag: 'AU',
    standardReview: 11,
    priorityReview: 6,
    acceleratedReview: 4,
    parallelFiling: true,
    referenceRequired: false,
  },
];

// Flag images using country code (round format)
const getFlagUrl = (code: string) => {
  const countryCode = code === 'EU' ? 'eu' : code.toLowerCase();
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

type ReviewType = 'standard' | 'priority' | 'accelerated';

interface SelectedCountry {
  code: string;
  reviewType: ReviewType;
}

export function RegulatoryPathwayCalculator() {
  const [selectedCountries, setSelectedCountries] = useState<SelectedCountry[]>([
    { code: 'US', reviewType: 'standard' }
  ]);
  const [filingStrategy, setFilingStrategy] = useState<'sequential' | 'parallel'>('parallel');

  const toggleCountry = (code: string) => {
    if (selectedCountries.find(c => c.code === code)) {
      if (selectedCountries.length > 1) {
        setSelectedCountries(selectedCountries.filter(c => c.code !== code));
      }
    } else {
      setSelectedCountries([...selectedCountries, { code, reviewType: 'standard' }]);
    }
  };

  const updateReviewType = (code: string, reviewType: ReviewType) => {
    setSelectedCountries(selectedCountries.map(c => 
      c.code === code ? { ...c, reviewType } : c
    ));
  };

  const getReviewDuration = (option: RegulatoryOption, reviewType: ReviewType): number => {
    switch (reviewType) {
      case 'accelerated': return option.acceleratedReview;
      case 'priority': return option.priorityReview;
      default: return option.standardReview;
    }
  };

  const calculateTimeline = () => {
    if (selectedCountries.length === 0) return { total: 0, breakdown: [] };

    const breakdown: { code: string; name: string; flag: string; duration: number; startMonth: number; endMonth: number; reviewType: ReviewType }[] = [];
    
    // Sort by filing order: parallel-eligible first, then reference-required
    const parallelCountries = selectedCountries.filter(sc => {
      const opt = REGULATORY_OPTIONS.find(o => o.code === sc.code);
      return opt?.parallelFiling && !opt?.referenceRequired;
    });
    
    const sequentialCountries = selectedCountries.filter(sc => {
      const opt = REGULATORY_OPTIONS.find(o => o.code === sc.code);
      return !opt?.parallelFiling || opt?.referenceRequired;
    });

    let currentMonth = 0;
    let maxParallelEnd = 0;

    // Process parallel-eligible countries
    if (filingStrategy === 'parallel') {
      parallelCountries.forEach(sc => {
        const option = REGULATORY_OPTIONS.find(o => o.code === sc.code);
        if (option) {
          const duration = getReviewDuration(option, sc.reviewType);
          const endMonth = duration;
          maxParallelEnd = Math.max(maxParallelEnd, endMonth);
          breakdown.push({
            code: sc.code,
            name: option.name,
            flag: option.flag,
            duration,
            startMonth: 0,
            endMonth,
            reviewType: sc.reviewType
          });
        }
      });
      currentMonth = maxParallelEnd;
    } else {
      // Sequential filing
      parallelCountries.forEach(sc => {
        const option = REGULATORY_OPTIONS.find(o => o.code === sc.code);
        if (option) {
          const duration = getReviewDuration(option, sc.reviewType);
          breakdown.push({
            code: sc.code,
            name: option.name,
            flag: option.flag,
            duration,
            startMonth: currentMonth,
            endMonth: currentMonth + duration,
            reviewType: sc.reviewType
          });
          currentMonth += duration;
        }
      });
    }

    // Process reference-required countries (must wait for FDA/EMA)
    sequentialCountries.forEach(sc => {
      const option = REGULATORY_OPTIONS.find(o => o.code === sc.code);
      if (option) {
        const duration = getReviewDuration(option, sc.reviewType);
        breakdown.push({
          code: sc.code,
          name: option.name,
          flag: option.flag,
          duration,
          startMonth: currentMonth,
          endMonth: currentMonth + duration,
          reviewType: sc.reviewType
        });
        currentMonth += duration;
      }
    });

    const total = Math.max(...breakdown.map(b => b.endMonth), 0);

    return { total, breakdown };
  };

  const { total, breakdown } = calculateTimeline();

  const resetSelection = () => {
    setSelectedCountries([{ code: 'US', reviewType: 'standard' }]);
    setFilingStrategy('parallel');
  };

  const getReviewTypeColor = (type: ReviewType) => {
    switch (type) {
      case 'accelerated': return 'bg-success text-success-foreground';
      case 'priority': return 'bg-warning text-warning-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Regulatory Pathway Calculator
            </CardTitle>
            <CardDescription>Select countries and review types to estimate global market entry timeline</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={resetSelection}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filing Strategy */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Filing Strategy:</span>
          <div className="flex gap-2">
            <Button 
              variant={filingStrategy === 'parallel' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilingStrategy('parallel')}
            >
              <Zap className="w-4 h-4 mr-1" />
              Parallel
            </Button>
            <Button 
              variant={filingStrategy === 'sequential' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilingStrategy('sequential')}
            >
              <ArrowRight className="w-4 h-4 mr-1" />
              Sequential
            </Button>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {filingStrategy === 'parallel' ? 'File in all eligible markets simultaneously' : 'File one market at a time'}
          </span>
        </div>

        {/* Country Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {REGULATORY_OPTIONS.map((option) => {
            const isSelected = selectedCountries.find(c => c.code === option.code);
            const selectedReviewType = isSelected?.reviewType || 'standard';
            
            return (
              <div 
                key={option.code}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox 
                    checked={!!isSelected}
                    onCheckedChange={() => toggleCountry(option.code)}
                  />
                  <img 
                    src={getFlagUrl(option.flag)} 
                    alt={option.code}
                    className="w-3 h-3 object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="text-sm font-medium flex-1">{option.code}</span>
                  {option.referenceRequired && (
                    <Badge variant="outline" className="text-xs">Ref. Req.</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2 truncate">{option.name}</p>
                
                {isSelected && (
                  <Select 
                    value={selectedReviewType} 
                    onValueChange={(v) => updateReviewType(option.code, v as ReviewType)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="standard">
                        Standard ({option.standardReview}mo)
                      </SelectItem>
                      <SelectItem value="priority">
                        Priority ({option.priorityReview}mo)
                      </SelectItem>
                      <SelectItem value="accelerated">
                        Accelerated ({option.acceleratedReview}mo)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>

        {/* Timeline Visualization */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Estimated Timeline
            </h4>
            <div className="text-right">
              <p className="text-2xl font-bold">{total} months</p>
              <p className="text-xs text-muted-foreground">
                ({(total / 12).toFixed(1)} years) to global market
              </p>
            </div>
          </div>

          {/* Gantt-style timeline */}
          <div className="space-y-2">
            {breakdown.map((item, index) => {
              const maxEnd = Math.max(...breakdown.map(b => b.endMonth));
              const widthPercent = (item.duration / maxEnd) * 100;
              const leftPercent = (item.startMonth / maxEnd) * 100;
              
              return (
                <div key={item.code} className="flex items-center gap-3">
                  <div className="w-20 flex items-center gap-2 shrink-0">
                    <img 
                      src={getFlagUrl(item.flag)} 
                      alt={item.code}
                      className="w-3 h-3 object-cover rounded-full"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-xs font-medium">{item.code}</span>
                  </div>
                  <div className="flex-1 h-8 bg-muted rounded-md relative overflow-hidden">
                    <div 
                      className={`absolute top-0 h-full rounded-md flex items-center justify-center text-xs font-medium ${getReviewTypeColor(item.reviewType)}`}
                      style={{ 
                        left: `${leftPercent}%`, 
                        width: `${Math.max(widthPercent, 15)}%` 
                      }}
                    >
                      {item.duration}mo
                    </div>
                  </div>
                  <div className="w-24 text-right shrink-0">
                    <span className="text-xs text-muted-foreground">
                      Mo {item.startMonth} → {item.endMonth}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline scale */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
            <span>0 months</span>
            <span>{Math.ceil(total / 2)} months</span>
            <span>{total} months</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{selectedCountries.length}</p>
            <p className="text-xs text-muted-foreground">Markets Selected</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Months</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">
              {selectedCountries.filter(c => c.reviewType === 'accelerated').length}
            </p>
            <p className="text-xs text-muted-foreground">Accelerated Reviews</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold">
              {selectedCountries.filter(c => {
                const opt = REGULATORY_OPTIONS.find(o => o.code === c.code);
                return opt?.referenceRequired;
              }).length}
            </p>
            <p className="text-xs text-muted-foreground">Ref. Required</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
