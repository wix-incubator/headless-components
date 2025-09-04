import React from 'react';
import { forms } from '@wix/forms';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  FormServiceDefinition,
  FormService,
  type FormServiceConfig,
} from '../services/form-service.js';
import {
  CheckboxProps,
  ContactsBirthdateProps,
  ContactsSubscribeProps,
  NumberInputProps,
  TextAreaProps,
  TextInputProps,
} from './types.js';

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

interface FieldsMap {
  TEXT_INPUT: React.ComponentType<TextInputProps>;
  CONTACTS_BIRTHDATE: React.ComponentType<ContactsBirthdateProps>;
  CONTACTS_SUBSCRIBE: React.ComponentType<ContactsSubscribeProps>;
  TEXT_AREA: React.ComponentType<TextAreaProps>;
  NUMBER_INPUT: React.ComponentType<NumberInputProps>;
  CHECKBOX: React.ComponentType<CheckboxProps>;
}

/**
 * Props for the Form Container component.
 */
export interface ContainerProps {
  /** Form id */
  formId: string;
  /** Fields map */
  fieldsMap: FieldsMap;
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
  formService.form.get();
  // TODO: render viewer
  return null;
});
