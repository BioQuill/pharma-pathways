import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Pill } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type MoleculeProfile } from '@/lib/moleculesData';
import { useSessionMolecule } from '@/contexts/SessionMoleculeContext';

interface MoleculePickerProps {
  molecules: MoleculeProfile[];
  /** Optional: override the context-based selection */
  value?: MoleculeProfile | null;
  onChange?: (mol: MoleculeProfile | null) => void;
  /** Label shown above the picker */
  label?: string;
  /** Compact mode for inline use */
  compact?: boolean;
}

export function MoleculePicker({ molecules, value, onChange, label = 'Select Molecule', compact = false }: MoleculePickerProps) {
  const { simulatorMolecule, setSimulatorMolecule } = useSimulatorMolecule();
  const selected = value !== undefined ? value : simulatorMolecule;
  const setSelected = onChange || setSimulatorMolecule;
  
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return molecules.slice(0, 50);
    const q = query.toLowerCase();
    return molecules
      .filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.nctId?.toLowerCase().includes(q) ||
        m.company?.toLowerCase().includes(q) ||
        m.indication?.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [molecules, query]);

  const handleSelect = (mol: MoleculeProfile) => {
    setSelected(mol);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery('');
  };

  return (
    <div ref={containerRef} className={`relative ${compact ? '' : 'w-full'}`}>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{label}</label>
      
      {/* Selected molecule display */}
      {selected ? (
        <div className="flex items-center gap-2 p-2.5 rounded-md border bg-primary/5 border-primary/20">
          <Pill className="h-4 w-4 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold uppercase truncate">{selected.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {selected.nctId} | {selected.phase} | {selected.therapeuticArea}
            </p>
          </div>
          <button onClick={handleClear} className="shrink-0 p-1 hover:bg-muted rounded-sm">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by drug, NCT ID, sponsor, or condition..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !selected && (
        <div className="absolute z-50 w-full mt-1 max-h-[300px] overflow-y-auto bg-popover border rounded-md shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No molecules found</div>
          ) : (
            filtered.map((mol) => (
              <button
                key={mol.id}
                onClick={() => handleSelect(mol)}
                className="w-full text-left px-3 py-2 hover:bg-muted/50 border-b border-border/30 last:border-0 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm uppercase">{mol.name}</span>
                  <span className="text-xs text-muted-foreground">—</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {mol.nctId} | {mol.phase} | {mol.therapeuticArea}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {mol.company} · {mol.indication}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
