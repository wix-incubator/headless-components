import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { Field, Form } from '@wix/auto_sdk_forms_forms';
import { createServicesMap } from '@wix/services-manager';

import {
  FormServiceDefinition,
  FormService,
  type FormServiceConfig,
} from '../services/form-service.js';

export interface RootProps {
  children: React.ReactNode;
  form: Form;
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
 *          {({ fields, error }) => (
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
 * Render props for § component
 */
export interface ContainerRenderProps {
  /** Form fields */
  fields: Field[];
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
  ({children}) => {
    const formService= useService(FormServiceDefinition);

    const fields = formService.form.get()?.formFields || [];

    return children({
      fields,
    });
  },
);
