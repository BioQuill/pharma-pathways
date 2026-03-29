import React, { createContext, useContext, useState, useCallback } from 'react';
import { type MoleculeProfile } from '@/lib/moleculesData';

/**
 * SessionMoleculeContext — Single Source of Truth for the active molecule
 * across all simulator dashboards, DD Report, and export features.
 *
 * Now includes a Cart (1-3 molecules) for parallel comparison across all 14 cards.
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

  // ── Cart (1-3 molecules for parallel comparison) ──
  cart: MoleculeProfile[];
  addToCart: (mol: MoleculeProfile) => void;
  removeFromCart: (molId: string) => void;
  clearCart: () => void;

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
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  // aliases
  simulatorMolecule: null,
  setSimulatorMolecule: () => {},
});

export function SessionMoleculeProvider({ children }: { children: React.ReactNode }) {
  const [sessionMolecule, setSessionMolecule] = useState<MoleculeProfile | null>(null);
  const [navCallback, setNavCallback] = useState<(() => void) | undefined>();
  const [cart, setCart] = useState<MoleculeProfile[]>([]);

  const loadIntoSimulator = useCallback((mol: MoleculeProfile) => {
    setSessionMolecule(mol);
    // Also add to cart if not already there and under limit
    setCart(prev => {
      if (prev.some(m => m.id === mol.id)) return prev;
      if (prev.length >= 3) return [...prev.slice(1), mol]; // replace oldest
      return [...prev, mol];
    });
    navCallback?.();
  }, [navCallback]);

  const addToCart = useCallback((mol: MoleculeProfile) => {
    setCart(prev => {
      if (prev.some(m => m.id === mol.id)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, mol];
    });
  }, []);

  const removeFromCart = useCallback((molId: string) => {
    setCart(prev => prev.filter(m => m.id !== molId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

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
      cart,
      addToCart,
      removeFromCart,
      clearCart,
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
