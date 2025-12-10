import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, TrendingUp, Clock, Target } from 'lucide-react';
import { MoleculeProfile } from '@/lib/moleculesData';
import { calculateLPI3ForMolecule } from '@/lib/lpi3Model';
import { calculateCompositeScore, calculateTTMMonths } from '@/lib/scoring';

interface MoleculeComparisonProps {
  molecules: MoleculeProfile[];
}

const getScoreColor = (score: number) => {
  if (score >= 67) return 'bg-green-500 text-white';
  if (score >= 34) return 'bg-yellow-500 text-black';
  return 'bg-red-500 text-white';
};

const getScoreBgColor = (score: number) => {
  if (score >= 67) return 'bg-green-500/10 border-green-500/30';
  if (score >= 34) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
};

export function MoleculeComparison({ molecules }: MoleculeComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const maxSlots = 3;

  const addMolecule = (id: string) => {
    if (selectedIds.length < maxSlots && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeMolecule = (id: string) => {
    setSelectedIds(selectedIds.filter(sid => sid !== id));
  };

  const selectedMolecules = selectedIds
    .map(id => molecules.find(m => m.id === id))
    .filter(Boolean) as MoleculeProfile[];

  const availableMolecules = molecules.filter(m => !selectedIds.includes(m.id));

  const getMoleculeMetrics = (molecule: MoleculeProfile) => {
    const lpi3 = calculateLPI3ForMolecule(molecule);
    const lpi3Percent = lpi3.calibratedProbability * 100;
    const ttm = calculateTTMMonths(molecule.phase, molecule.therapeuticArea, molecule.companyTrackRecord, molecule.marketData);
    const composite = calculateCompositeScore(lpi3Percent, ttm ?? 0, molecule.therapeuticArea);
    return { lpi3: lpi3Percent, ttm: ttm ?? 0, composite };
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Molecule Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Molecule Selector */}
        <div className="flex items-center gap-2 mb-6">
          <Select onValueChange={addMolecule} disabled={selectedIds.length >= maxSlots}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Add molecule to compare..." />
            </SelectTrigger>
            <SelectContent>
              {availableMolecules.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} - {m.therapeuticArea}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">
            {selectedIds.length}/{maxSlots} selected
          </span>
        </div>

        {/* Comparison Grid */}
        {selectedMolecules.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Plus className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Select up to 3 molecules to compare</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${selectedMolecules.length}, 1fr)` }}>
            {selectedMolecules.map(molecule => {
              const metrics = getMoleculeMetrics(molecule);
              return (
                <div key={molecule.id} className={`border rounded-lg p-4 ${getScoreBgColor(metrics.composite)}`}>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-base">{molecule.name}</h3>
                      <p className="text-xs text-muted-foreground">{molecule.company}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeMolecule(molecule.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Phase & TA */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {molecule.phase}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {molecule.therapeuticArea}
                    </Badge>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-3">
                    {/* LPI-3 */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> LPI-3
                      </span>
                      <Badge className={`${getScoreColor(metrics.lpi3)} font-mono`}>
                        {metrics.lpi3.toFixed(1)}%
                      </Badge>
                    </div>

                    {/* TTM */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" /> TTM
                      </span>
                      <Badge variant="outline" className="font-mono">
                        {metrics.ttm} mo
                      </Badge>
                    </div>

                    {/* Composite */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Composite</span>
                      <Badge className={`${getScoreColor(metrics.composite)} font-mono text-base px-3`}>
                        {metrics.composite.toFixed(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Indication */}
                  <p className="text-xs text-muted-foreground mt-4 line-clamp-2">
                    {molecule.indication}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
