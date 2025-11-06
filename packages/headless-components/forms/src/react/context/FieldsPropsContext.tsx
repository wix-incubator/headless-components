import React from 'react';

export interface FieldsPropsContextValue {
  fieldsProps: Record<string, any>;
}

export const FieldsPropsContext = React.createContext<
  FieldsPropsContextValue | undefined
>(undefined);

export function useFieldsProps(): FieldsPropsContextValue {
  const context = React.useContext(FieldsPropsContext);
  if (!context) {
    throw new Error(
      'useFieldsProps must be used within a Form.Fields component',
    );
  }
  return context;
}

export const FieldsPropsProvider: React.FC<{
  children: React.ReactNode;
  value: FieldsPropsContextValue;
}> = ({ children, value }) => {
  return (
    <FieldsPropsContext.Provider value={value}>
      {children}
    </FieldsPropsContext.Provider>
  );
};
