import React, { createContext, useContext, useState, useCallback } from 'react';
import { type MoleculeProfile } from '@/lib/moleculesData';

interface SimulatorMoleculeContextType {
  simulatorMolecule: MoleculeProfile | null;
  setSimulatorMolecule: (mol: MoleculeProfile | null) => void;
  /** Navigate to simulator with a pre-loaded molecule */
  loadIntoSimulator: (mol: MoleculeProfile) => void;
  onNavigateToSimulator?: () => void;
  setOnNavigateToSimulator: (fn: () => void) => void;
}

const SimulatorMoleculeContext = createContext<SimulatorMoleculeContextType>({
  simulatorMolecule: null,
  setSimulatorMolecule: () => {},
  loadIntoSimulator: () => {},
  setOnNavigateToSimulator: () => {},
});

export function SimulatorMoleculeProvider({ children }: { children: React.ReactNode }) {
  const [simulatorMolecule, setSimulatorMolecule] = useState<MoleculeProfile | null>(null);
  const [navCallback, setNavCallback] = useState<(() => void) | undefined>();

  const loadIntoSimulator = useCallback((mol: MoleculeProfile) => {
    setSimulatorMolecule(mol);
    navCallback?.();
  }, [navCallback]);

  const setOnNavigateToSimulator = useCallback((fn: () => void) => {
    setNavCallback(() => fn);
  }, []);

  return (
    <SimulatorMoleculeContext.Provider value={{
      simulatorMolecule,
      setSimulatorMolecule,
      loadIntoSimulator,
      onNavigateToSimulator: navCallback,
      setOnNavigateToSimulator,
    }}>
      {children}
    </SimulatorMoleculeContext.Provider>
  );
}

export const useSimulatorMolecule = () => useContext(SimulatorMoleculeContext);
