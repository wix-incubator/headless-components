import React from 'react';
import { forms } from '@wix/forms';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  FormServiceDefinition,
  FormService,
  type FormServiceConfig,
} from '../services/form-service.js';
import { formatField } from './utils.js';
import { FormField } from './types/formatted-fields.js';

export interface RootProps {
  children: React.ReactNode;
  form: forms.Form;
}

/**
 * Root container that provides form context to all child components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormPage({ form }) {
 *   return (
 *     <Form.Root form={form} >
 *       <Form.Container>
 *          {({ fields }) => (
 *             <form>
 *               {fields.map(field => (
 *                 <input key={field.name} name={field.name} onChange={(e) => onChange(e.target.value)} />
 *               ))}
 *             </form>
 *           )}
 *       </Form.Container>
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, form } = props;

  const formServiceConfig: FormServiceConfig = {
    form,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FormServiceDefinition,
        FormService,
        formServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

/**
 * Render props for Container component
 */
export interface ContainerRenderProps {
  /** Form name */
  name: string;
  /** Form fields */
  fields: FormField[];
}

/**
 * Props for the Form Container component.
 */
export interface ContainerProps {
  /** Render prop function that receives form data */
  children: (props: ContainerRenderProps) => React.ReactNode;
}

/**
 * Headless component for displaying the form.
 *
 * @component
 * @example
 * ```tsx
 *  <Form.Container>
 *    {({ fields, error }) => (
 *      <form>
 *        {fields.map(field => (
 *          <input key={field.name} name={field.name} onChange={(e) => onChange(e.target.value)} />
 *          ))}
 *      </form>
 *     )}
 *  </Form.Container>
 * ```
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ children }) => {
    const formService = useService(FormServiceDefinition);
    console.log('****** Container ******');
    const form = formService.form.get();
    // TODO: return in same order as in form
    const fields: FormField[] = (form?.formFields || []).map(formatField);
    console.log('formatted fields', fields[5]);

    return children({
      name: form?.name ?? '',
      fields,
    });
  },
);
