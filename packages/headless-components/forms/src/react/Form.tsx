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
  ContactsAddressProps,
  ContactsBirthdateProps,
  ContactsEmailProps,
  ContactsFirstNameProps,
  ContactsLastNameProps,
  ContactsPhoneProps,
  ContactsTaxIdProps,
  ContactsSubscribeProps,
  MultilineAddressProps,
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
 *
 * @param {forms.Form} form - The form configuration object
 * @param {React.ReactNode} children - Child components that will have access to form context
 *
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   CONTACTS_BIRTHDATE: ContactsBirthdate,
 *   // ... other field components
 * };
 *
 * function FormPage({ form }) {
 *   return (
 *     <Form.Root form={form}>
 *       <Form.Container
 *         formId="491ce063-931e-47c9-aad9-4845d9271c30"
 *         fieldMap={FIELD_MAP}
 *       />
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
 * Mapping of form field types to their corresponding React components.
 *
 * This interface defines the structure for the fieldMap prop, allowing you to specify
 * which React component should be used to render each type of form field. Each field
 * type maps to a React component that accepts the appropriate props for that field type.
 *
 * @interface FieldMap
 *
 * @property {React.ComponentType<TextInputProps>} TEXT_INPUT - Component for text input fields
 * @property {React.ComponentType<ContactsBirthdateProps>} CONTACTS_BIRTHDATE - Component for birthdate fields
 * @property {React.ComponentType<ContactsSubscribeProps>} CONTACTS_SUBSCRIBE - Component for subscription checkbox fields
 * @property {React.ComponentType<TextAreaProps>} TEXT_AREA - Component for textarea fields
 * @property {React.ComponentType<NumberInputProps>} NUMBER_INPUT - Component for number input fields
 * @property {React.ComponentType<CheckboxProps>} CHECKBOX - Component for checkbox fields
 *
 * @example
 * ```tsx
 * const FIELD_MAP: fieldMap = {
 *   TEXT_INPUT: MyCustomTextInput,
 *   CONTACTS_BIRTHDATE: MyCustomBirthdatePicker,
 *   CONTACTS_SUBSCRIBE: MyCustomSubscribeCheckbox,
 *   TEXT_AREA: MyCustomTextArea,
 *   NUMBER_INPUT: MyCustomNumberInput,
 *   CHECKBOX: MyCustomCheckbox,
 * };
 * ```
 */
interface FieldMap {
  CONTACTS_FIRST_NAME: React.ComponentType<ContactsFirstNameProps>;
  CONTACTS_LAST_NAME: React.ComponentType<ContactsLastNameProps>;
  CONTACTS_EMAIL: React.ComponentType<ContactsEmailProps>;
  CONTACTS_PHONE: React.ComponentType<ContactsPhoneProps>;
  CONTACTS_ADDRESS: React.ComponentType<ContactsAddressProps>;
  MULTILINE_ADDRESS: React.ComponentType<MultilineAddressProps>;
  CONTACTS_BIRTHDATE: React.ComponentType<ContactsBirthdateProps>;
  TEXT_INPUT: React.ComponentType<TextInputProps>;
  CONTACTS_SUBSCRIBE: React.ComponentType<ContactsSubscribeProps>;
  CONTACTS_TAX_ID: React.ComponentType<ContactsTaxIdProps>;
  TEXT_AREA: React.ComponentType<TextAreaProps>;
  NUMBER_INPUT: React.ComponentType<NumberInputProps>;
  CHECKBOX: React.ComponentType<CheckboxProps>;
}

/**
 * Props for the Form Container component.
 *
 * @interface ContainerProps
 *
 * @property {string} formId - The unique identifier of the form to render
 * @property {FieldMap} fieldMap - A mapping of field types to their corresponding React components
 *
 * @example
 * ```tsx
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   CONTACTS_BIRTHDATE: ContactsBirthdate,
 *   CONTACTS_SUBSCRIBE: ContactsSubscribe,
 *   TEXT_AREA: TextArea,
 *   NUMBER_INPUT: NumberInput,
 *   CHECKBOX: Checkbox,
 * };
 *
 * <Form.Container
 *   formId="491ce063-931e-47c9-aad9-4845d9271c30"
 *   fieldMap={FIELD_MAP}
 * />
 * ```
 */
export interface ContainerProps {
  formId: string;
  fieldMap: FieldMap;
}

/**
 * Headless component for displaying a form with custom field renderers.
 *
 * @component
 * @param {string} formId - The unique identifier of the form to render
 * @param {FieldMap} fieldMap - A mapping of field types to their corresponding React components
 *
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { TextInput, ContactsBirthdate, Checkbox } from './field-components';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   CONTACTS_BIRTHDATE: ContactsBirthdate,
 *   CONTACTS_SUBSCRIBE: ContactsSubscribe,
 *   TEXT_AREA: TextArea,
 *   NUMBER_INPUT: NumberInput,
 *   CHECKBOX: Checkbox,
 * };
 *
 * function ContactForm({ form }) {
 *   return (
 *     <Form.Root form={form}>
 *       <Form.Container
 *         formId="491ce063-931e-47c9-aad9-4845d9271c30"
 *         fieldMap={FIELD_MAP}
 *       />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(() => {
  // ({ formId, fieldMap }) => {
  const formService = useService(FormServiceDefinition);
  formService.form.get();
  // TODO: render viewer
  return null;
});
