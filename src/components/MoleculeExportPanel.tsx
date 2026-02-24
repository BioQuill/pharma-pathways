import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Download, 
  Search, 
  Filter, 
  GitCompare, 
  X,
  Check,
  FileSpreadsheet
} from "lucide-react";
import { exportMoleculesToExcel, exportLPIDetailedToExcel, exportTherapeuticAreaSummary, exportComparisonToExcel } from "@/lib/excelExport";
import { calculateLPI3ForMolecule } from "@/lib/lpi3Model";

interface MoleculeProfile {
  id: string;
  name: string;
  phase: string;
  therapeuticArea: string;
  company: string;
  ticker?: string;
  indication?: string;
  companyTrackRecord?: 'fast' | 'average' | 'slow';
  isFailed?: boolean;
}

interface MoleculeExportPanelProps {
  molecules: MoleculeProfile[];
}

export function MoleculeExportPanel({ molecules }: MoleculeExportPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("export");
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTA, setSelectedTA] = useState<string>("all");
  const [selectedPhase, setSelectedPhase] = useState<string>("all");
  const [minLPI, setMinLPI] = useState<string>("");
  const [maxLPI, setMaxLPI] = useState<string>("");
  
  // Comparison state
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

  // Get unique therapeutic areas and phases
  const therapeuticAreas = useMemo(() => {
    const tas = new Set(molecules.map(m => m.therapeuticArea));
    return Array.from(tas).sort();
  }, [molecules]);

  const phases = useMemo(() => {
    const ps = new Set(molecules.map(m => m.phase));
    return Array.from(ps).sort();
  }, [molecules]);

  // Filter molecules
  const filteredMolecules = useMemo(() => {
    return molecules.filter(mol => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          mol.name.toLowerCase().includes(query) ||
          mol.company.toLowerCase().includes(query) ||
          mol.therapeuticArea.toLowerCase().includes(query) ||
          (mol.indication?.toLowerCase().includes(query) ?? false);
        if (!matchesSearch) return false;
      }

      // TA filter
      if (selectedTA !== "all" && mol.therapeuticArea !== selectedTA) return false;

      // Phase filter
      if (selectedPhase !== "all" && mol.phase !== selectedPhase) return false;

      // LPI range filter
      if (minLPI || maxLPI) {
        const lpi = calculateLPI3ForMolecule(mol);
        const lpiScore = Math.round(lpi.calibratedProbability * 100);
        if (minLPI && lpiScore < parseInt(minLPI)) return false;
        if (maxLPI && lpiScore > parseInt(maxLPI)) return false;
      }

      return true;
    });
  }, [molecules, searchQuery, selectedTA, selectedPhase, minLPI, maxLPI]);

  // Handle comparison selection
  const toggleComparison = (id: string) => {
    const newSet = new Set(selectedForComparison);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 10) { // Max 10 for comparison
        newSet.add(id);
      }
    }
    setSelectedForComparison(newSet);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTA("all");
    setSelectedPhase("all");
    setMinLPI("");
    setMaxLPI("");
  };

  const comparisonMolecules = molecules.filter(m => selectedForComparison.has(m.id));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="export" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export & Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Export & Compare Molecules
          </DialogTitle>
          <DialogDescription>
            Filter molecules for targeted exports or select multiple for side-by-side comparison
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2 bg-sky-100 dark:bg-sky-950/30">
            <TabsTrigger value="export" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtered Export
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <GitCompare className="h-4 w-4" />
              Comparison ({selectedForComparison.size})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 mt-4">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Filter Molecules
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Molecule, company, or indication..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Therapeutic Area</Label>
                    <Select value={selectedTA} onValueChange={setSelectedTA}>
                      <SelectTrigger>
                        <SelectValue placeholder="All TAs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All TAs</SelectItem>
                        {therapeuticAreas.map(ta => (
                          <SelectItem key={ta} value={ta}>{ta}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phase</Label>
                    <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Phases" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Phases</SelectItem>
                        {phases.map(phase => (
                          <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min LPI (%)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      max="100"
                      value={minLPI}
                      onChange={(e) => setMinLPI(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Max LPI (%)</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      min="0"
                      max="100"
                      value={maxLPI}
                      onChange={(e) => setMaxLPI(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results summary & export buttons */}
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                {filteredMolecules.length} of {molecules.length} molecules match filters
              </Badge>
            </div>

            {/* Preview list */}
            <ScrollArea className="h-[250px] border rounded-lg p-2">
              <div className="space-y-1">
                {filteredMolecules.slice(0, 50).map(mol => {
                  const lpi = calculateLPI3ForMolecule(mol);
                  const lpiScore = Math.round(lpi.calibratedProbability * 100);
                  return (
                    <div 
                      key={mol.id} 
                      className="flex items-center justify-between p-2 text-sm hover:bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedForComparison.has(mol.id)}
                          onCheckedChange={() => toggleComparison(mol.id)}
                        />
                        <div>
                          <span className="font-medium">{mol.name}</span>
                          <span className="text-muted-foreground ml-2">{mol.company}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{mol.phase}</Badge>
                        <Badge className="bg-blue-500 text-white text-xs">LPI {lpiScore}%</Badge>
                      </div>
                    </div>
                  );
                })}
                {filteredMolecules.length > 50 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    ... and {filteredMolecules.length - 50} more molecules
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="compare" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GitCompare className="h-4 w-4" />
                  Selected for Comparison ({selectedForComparison.size}/10)
                </CardTitle>
                <CardDescription>
                  Select molecules from the Export tab to add them here for side-by-side comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedForComparison.size === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No molecules selected for comparison</p>
                    <p className="text-sm">Go to the Export tab and check molecules to compare</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {comparisonMolecules.map(mol => (
                        <Badge 
                          key={mol.id} 
                          variant="secondary" 
                          className="gap-1 pl-2 pr-1 py-1"
                        >
                          {mol.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                            onClick={() => toggleComparison(mol.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>

                    {/* Comparison preview table */}
                    <div className="border rounded-lg overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-2 font-medium">Molecule</th>
                            <th className="text-left p-2 font-medium">Company</th>
                            <th className="text-left p-2 font-medium">Phase</th>
                            <th className="text-left p-2 font-medium">TA</th>
                            <th className="text-center p-2 font-medium">LPI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparisonMolecules.map(mol => {
                            const lpi = calculateLPI3ForMolecule(mol);
                            const lpiScore = Math.round(lpi.calibratedProbability * 100);
                            return (
                              <tr key={mol.id} className="border-t">
                                <td className="p-2 font-medium">{mol.name}</td>
                                <td className="p-2 text-muted-foreground">{mol.company}</td>
                                <td className="p-2">
                                  <Badge variant="outline" className="text-xs">{mol.phase}</Badge>
                                </td>
                                <td className="p-2 text-muted-foreground text-xs">{mol.therapeuticArea}</td>
                                <td className="p-2 text-center">
                                  <Badge 
                                    className={`text-white ${
                                      lpiScore >= 60 ? 'bg-green-500' : 
                                      lpiScore >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  >
                                    {lpiScore}%
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedForComparison(new Set())}
                      >
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
