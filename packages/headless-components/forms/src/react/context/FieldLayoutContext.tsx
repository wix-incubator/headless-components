import React from 'react';
import { type Layout } from '../core/Form.js';

export interface FieldLayoutMap {
  [fieldId: string]: Layout;
}

export const FieldLayoutContext = React.createContext<FieldLayoutMap | null>(
  null,
);

export interface FieldLayoutProviderProps {
  value: FieldLayoutMap;
  children: React.ReactNode;
}

export const FieldLayoutProvider: React.FC<FieldLayoutProviderProps> = ({
  value,
  children,
}) => {
  return (
    <FieldLayoutContext.Provider value={value}>
      {children}
    </FieldLayoutContext.Provider>
  );
};

export function useFieldLayout(fieldId: string): Layout | null {
  const layoutMap = React.useContext(FieldLayoutContext);

  if (!layoutMap) {
    return null;
  }

  return layoutMap[fieldId] || null;
}
