import React from 'react';
import { type Layout } from '../core/Form.js';

export interface FieldContextValue {
  id: string;
  layout: Layout;
  gridStyles: {
    label: React.CSSProperties;
    input: React.CSSProperties;
  };
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue {
  const context = React.useContext(FieldContext);

  if (!context) {
    throw new Error(
      'Field components must be used within a Form.Field component',
    );
  }

  return context;
}
