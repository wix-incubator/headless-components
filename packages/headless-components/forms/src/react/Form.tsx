import React from 'react';
import { forms } from '@wix/forms';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  FormServiceDefinition,
  FormService,
  type FormServiceConfig,
} from '../services/form-service.js';
import { TextInputField } from './types.js';

export interface RootProps {
  children: React.ReactNode;
  form: forms.Form;
}

// TODO: use single Form component instead of Root and Container
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
 *       <Form.Container formId="491ce063-931e-47c9-aad9-4845d9271c30" fieldsMap={FIELD_MAP} />
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

interface FieldsMaps {
  TEXT_INPUT: React.Component<TextInputField>;
}

/**
 * Props for the Form Container component.
 */
export interface ContainerProps {
  /** Form id */
  formId: string;
  /** Fields map */
  fieldsMap: FieldsMaps;
}

/**
 * Headless component for displaying the form.
 *
 * @component
 * @example
 * ```tsx
 *  <Form.Container formId="491ce063-931e-47c9-aad9-4845d9271c30" fieldsMap={FIELD_MAP} />
 * ```
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(() => {
  // ({ formId, fieldsMap }) => {
  const formService = useService(FormServiceDefinition);
  const form = formService.form.get();
  // TODO: render viewer
  return null;
});
