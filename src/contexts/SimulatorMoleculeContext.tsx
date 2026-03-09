// Re-export everything from SessionMoleculeContext for backward compatibility
export {
  SessionMoleculeProvider as SimulatorMoleculeProvider,
  useSessionMolecule as useSimulatorMolecule,
  useSessionMolecule,
  SessionMoleculeProvider,
} from './SessionMoleculeContext';
