import React from 'react';
import { type FormError } from '@wix/form-public';

export const FormErrorsContext = React.createContext<FormError[]>([]);

export interface FormErrorsProviderProps {
  errors: FormError[];
  children: React.ReactNode;
}

export const FormErrorsProvider: React.FC<FormErrorsProviderProps> = ({
  errors,
  children,
}) => {
  return (
    <FormErrorsContext.Provider value={errors}>
      {children}
    </FormErrorsContext.Provider>
  );
};
