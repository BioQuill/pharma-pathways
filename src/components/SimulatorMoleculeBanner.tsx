import { Pill, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSessionMolecule } from '@/contexts/SessionMoleculeContext';
import { MoleculePicker } from '@/components/MoleculePicker';
import { type MoleculeProfile } from '@/lib/moleculesData';

interface SimulatorMoleculeBannerProps {
  molecules: MoleculeProfile[];
  /** Extra context fields to show from the selected molecule */
  showFields?: ('sponsor' | 'status' | 'dates' | 'conditions')[];
}

export function SimulatorMoleculeBanner({ molecules, showFields = ['sponsor', 'status', 'dates'] }: SimulatorMoleculeBannerProps) {
  const { simulatorMolecule } = useSimulatorMolecule();

  return (
    <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
      <MoleculePicker molecules={molecules} label="Molecule for Simulation" />
      
      {simulatorMolecule && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">NCT ID:</span>{' '}
            <span className="font-semibold font-mono">{simulatorMolecule.nctId || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Phase:</span>{' '}
            <span className="font-semibold">{simulatorMolecule.phase}</span>
          </div>
          <div>
            <span className="text-muted-foreground">TA:</span>{' '}
            <span className="font-semibold">{simulatorMolecule.therapeuticArea}</span>
          </div>
          {showFields.includes('sponsor') && (
            <div>
              <span className="text-muted-foreground">Sponsor:</span>{' '}
              <span className="font-semibold">{simulatorMolecule.company}</span>
            </div>
          )}
          {showFields.includes('status') && (simulatorMolecule as any)._raw?.status && (
            <div>
              <span className="text-muted-foreground">Status:</span>{' '}
              <Badge variant="secondary" className="text-[10px] px-1 py-0">{(simulatorMolecule as any)._raw.status}</Badge>
            </div>
          )}
          {showFields.includes('dates') && (
            <>
              {(simulatorMolecule as any)._raw?.start_date && (
                <div>
                  <span className="text-muted-foreground">Start:</span>{' '}
                  <span className="font-semibold">{(simulatorMolecule as any)._raw.start_date}</span>
                </div>
              )}
              {(simulatorMolecule as any)._raw?.completion_date && (
                <div>
                  <span className="text-muted-foreground">End:</span>{' '}
                  <span className="font-semibold">{(simulatorMolecule as any)._raw.completion_date}</span>
                </div>
              )}
            </>
          )}
          {showFields.includes('conditions') && (
            <div className="col-span-2">
              <span className="text-muted-foreground">Conditions:</span>{' '}
              <span className="font-semibold">{simulatorMolecule.indication}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
