import React, { createContext, useContext } from 'react';
import type { Label } from '../../services/types';

export interface LabelProps {
  children: React.ReactNode;
  label: Label;
}

interface LabelContextValue {
  label: Label;
}

const LabelContext = createContext<LabelContextValue | null>(null);

export function Label(props: LabelProps) {
  const contextValue: LabelContextValue = {
    label: props.label,
  };

  return (
    <LabelContext.Provider value={contextValue}>
      {props.children}
    </LabelContext.Provider>
  );
}

export function useLabelContext() {
  const context = useContext(LabelContext);
  if (!context) {
    throw new Error('useLabelContext must be used within Label');
  }
  return context;
}

export interface LabelNameProps {
  children: (props: { name: string }) => React.ReactNode;
}

export interface LabelIconProps {
  children: (props: {
    icon: string | null;
    hasIcon: boolean;
    altText: string;
  }) => React.ReactNode;
}

export function Name(props: LabelNameProps) {
  const { label } = useLabelContext();

  return props.children({ name: label.name ?? '' });
}

export function Icon(props: LabelIconProps) {
  const { label } = useLabelContext();

  // Use the icon property from the label
  const icon = label.icon ?? null;
  const hasIcon = !!icon;

  return props.children({
    icon,
    hasIcon,
    altText: label.name ?? '',
  });
}
