import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Clock,
  TrendingUp,
  AlertCircle,
  Eye
} from "lucide-react";
import { WatchlistItem } from "@/hooks/useWatchlist";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";
import { type MoleculeProfile } from "@/lib/moleculesData";

interface WatchlistPanelProps {
  watchlist: WatchlistItem[];
  molecules: MoleculeProfile[];
  onRemove: (moleculeId: string) => void;
  onUpdateNotes: (moleculeId: string, notes: string) => void;
  onViewMolecule: (moleculeId: string) => void;
  onClear: () => void;
}

export function WatchlistPanel({
  watchlist,
  molecules,
  onRemove,
  onUpdateNotes,
  onViewMolecule,
  onClear
}: WatchlistPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const getWatchlistMolecules = () => {
    return watchlist
      .map(item => {
        const molecule = molecules.find(m => m.id === item.moleculeId);
        return molecule ? { ...molecule, watchlistItem: item } : null;
      })
      .filter(Boolean) as (MoleculeProfile & { watchlistItem: WatchlistItem })[];
  };

  const watchlistMolecules = getWatchlistMolecules();

  const handleStartEdit = (moleculeId: string, currentNotes: string = "") => {
    setEditingId(moleculeId);
    setEditNotes(currentNotes);
  };

  const handleSaveNotes = (moleculeId: string) => {
    onUpdateNotes(moleculeId, editNotes);
    setEditingId(null);
    setEditNotes("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNotes("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getPhaseColor = (phase: string) => {
    if (phase.includes("III")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (phase.includes("II")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    if (phase.includes("I")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  };

  if (watchlistMolecules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Molecule Watchlist
          </CardTitle>
          <CardDescription>Track molecules you're interested in across sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">Your watchlist is empty</p>
            <p className="text-sm text-muted-foreground/80">
              Click the star icon on any molecule to add it to your watchlist
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              Molecule Watchlist ({watchlistMolecules.length})
            </CardTitle>
            <CardDescription>Track molecules you're interested in across sessions</CardDescription>
          </div>
          {watchlistMolecules.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlistMolecules.map((molecule) => {
              const lpiResult = calculateLPI3ForMolecule(molecule);
              const lpiScore = lpiResult.calibratedProbability * 100;
              const addedDate = new Date(molecule.watchlistItem.addedAt);
              
              return (
                <div 
                  key={molecule.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold truncate">{molecule.name}</h4>
                      <Badge className={getPhaseColor(molecule.phase)} variant="secondary">
                        {molecule.phase}
                      </Badge>
                      {molecule.isFailed && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {molecule.company} • {molecule.therapeuticArea}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {molecule.indication}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className={`font-semibold ${getScoreColor(lpiScore)}`}>
                          LPI: {lpiScore.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        Added {addedDate.toLocaleDateString()}
                      </div>
                    </div>

                    {/* Notes Section */}
                    {editingId === molecule.id ? (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes about this molecule..."
                          className="text-sm"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveNotes(molecule.id)}>
                            <Check className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : molecule.watchlistItem.notes ? (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                        <p className="text-muted-foreground">{molecule.watchlistItem.notes}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewMolecule(molecule.id)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleStartEdit(molecule.id, molecule.watchlistItem.notes)}
                      title="Edit Notes"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onRemove(molecule.id)}
                      title="Remove from Watchlist"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
