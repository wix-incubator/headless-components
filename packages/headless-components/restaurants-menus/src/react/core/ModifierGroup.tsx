import React, { createContext, useContext } from 'react';
import type {
  ModifierGroup,
  EnhancedModifierGroup,
} from '../../services/types';

export interface ModifierGroupProps {
  children: React.ReactNode;
  modifierGroup: EnhancedModifierGroup;
}

interface ModifierGroupContextValue {
  modifierGroup: EnhancedModifierGroup;
}

const ModifierGroupContext = createContext<ModifierGroupContextValue | null>(
  null,
);

export function ModifierGroup(props: ModifierGroupProps) {
  const contextValue: ModifierGroupContextValue = {
    modifierGroup: props.modifierGroup,
  };

  return (
    <ModifierGroupContext.Provider value={contextValue}>
      {props.children}
    </ModifierGroupContext.Provider>
  );
}

export function useModifierGroupContext() {
  const context = useContext(ModifierGroupContext);
  if (!context) {
    throw new Error(
      'useModifierGroupContext must be used within ModifierGroup',
    );
  }
  return context;
}

export interface ModifierGroupNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export function Name(props: ModifierGroupNameProps) {
  const { modifierGroup } = useModifierGroupContext();

  return props.children({ name: modifierGroup.name ?? '' });
}
