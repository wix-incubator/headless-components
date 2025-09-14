import React, { createContext, useContext } from 'react';
import type { Modifier } from "../../../../components/restaurants-menus/types";

export interface ModifierProps {
  children: React.ReactNode;
  modifier: Modifier & {
    additionalChargeInfo?: {
      additionalCharge?: string;
      formattedAdditionalCharge?: string;
    };
  };
}

interface ModifierContextValue {
  modifier: Modifier & {
    additionalChargeInfo?: {
      additionalCharge?: string;
      formattedAdditionalCharge?: string;
    };
  };
}

const ModifierContext = createContext<ModifierContextValue | null>(null);

export function Modifier(props: ModifierProps) {
  const contextValue: ModifierContextValue = {
    modifier: props.modifier,
  };

  return (
    <ModifierContext.Provider value={contextValue}>
      {props.children}
    </ModifierContext.Provider>
  );
}

export function useModifierContext() {
  const context = useContext(ModifierContext);
  if (!context) {
    throw new Error('useModifierContext must be used within Modifier');
  }
  return context;
}

export interface ModifierNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface ModifierPriceProps {
  children: (props: { 
    additionalCharge?: string;
    formattedAdditionalCharge?: string;
    hasAdditionalCharge: boolean;
  }) => React.ReactNode;
}

export function Name(props: ModifierNameProps) {
  const { modifier } = useModifierContext();
  
  return props.children({ name: modifier.name || "" });
}

export function Price(props: ModifierPriceProps) {
  const { modifier } = useModifierContext();
  
  const additionalCharge = modifier.additionalChargeInfo?.additionalCharge;
  const formattedAdditionalCharge = modifier.additionalChargeInfo?.formattedAdditionalCharge;
  const hasAdditionalCharge = !!(additionalCharge || formattedAdditionalCharge);
  
  return props.children({ 
    additionalCharge,
    formattedAdditionalCharge,
    hasAdditionalCharge
  });
}
