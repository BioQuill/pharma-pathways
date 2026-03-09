import React, { createContext, useContext, useState, useCallback } from 'react';
import { type MoleculeProfile } from '@/lib/moleculesData';

/**
 * SessionMoleculeContext — Single Source of Truth for the active molecule
 * across all simulator dashboards, DD Report, and export features.
 *
 * The molecule stored here is the complete MoleculeProfile with _raw fields
 * and all pre-computed scores (lpi_score, lpi_ci, etc.) attached by useMolecules.ts.
 */

interface SessionMoleculeContextType {
  /** The currently selected molecule (complete profile with _raw) */
  sessionMolecule: MoleculeProfile | null;
  /** Set the active molecule — called by "Use in Simulator →" and MoleculePicker */
  setSessionMolecule: (mol: MoleculeProfile | null) => void;
  /** Shortcut: set molecule AND trigger navigation to simulator */
  loadIntoSimulator: (mol: MoleculeProfile) => void;
  /** Navigation callback registered by the host page */
  onNavigateToSimulator?: () => void;
  setOnNavigateToSimulator: (fn: () => void) => void;

  // ── Backward-compatible aliases ──
  /** @deprecated Use sessionMolecule */
  simulatorMolecule: MoleculeProfile | null;
  /** @deprecated Use setSessionMolecule */
  setSimulatorMolecule: (mol: MoleculeProfile | null) => void;
}

const SessionMoleculeContext = createContext<SessionMoleculeContextType>({
  sessionMolecule: null,
  setSessionMolecule: () => {},
  loadIntoSimulator: () => {},
  setOnNavigateToSimulator: () => {},
  // aliases
  simulatorMolecule: null,
  setSimulatorMolecule: () => {},
});

export function SessionMoleculeProvider({ children }: { children: React.ReactNode }) {
  const [sessionMolecule, setSessionMolecule] = useState<MoleculeProfile | null>(null);
  const [navCallback, setNavCallback] = useState<(() => void) | undefined>();

  const loadIntoSimulator = useCallback((mol: MoleculeProfile) => {
    setSessionMolecule(mol);
    navCallback?.();
  }, [navCallback]);

  const setOnNavigateToSimulator = useCallback((fn: () => void) => {
    setNavCallback(() => fn);
  }, []);

  return (
    <SessionMoleculeContext.Provider value={{
      sessionMolecule,
      setSessionMolecule,
      loadIntoSimulator,
      onNavigateToSimulator: navCallback,
      setOnNavigateToSimulator,
      // Backward-compatible aliases
      simulatorMolecule: sessionMolecule,
      setSimulatorMolecule: setSessionMolecule,
    }}>
      {children}
    </SessionMoleculeContext.Provider>
  );
}

/** Primary hook — use this in new code */
export const useSessionMolecule = () => useContext(SessionMoleculeContext);

/** @deprecated Alias for backward compatibility — delegates to useSessionMolecule */
export const useSimulatorMolecule = () => useContext(SessionMoleculeContext);

// Re-export provider under old name for drop-in replacement
export const SimulatorMoleculeProvider = SessionMoleculeProvider;
