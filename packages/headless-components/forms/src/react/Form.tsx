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
import { InputFieldType } from './input-field-types.js';

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
 * Represents a form field configuration with its properties and constraints.
 *
 * @interface FormField
 * @description A standardized representation of a form field that includes
 * all necessary information for rendering and validation.
 *
 * @property {InputFieldType} type - The type identifier of the form field (e.g., CONTACTS_FIRST_NAME, CONTACTS_EMAIL)
 * @property {string} name - The unique identifier for the form field
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @default true
 *
 * @example
 * ```tsx
 * const field: FormField = {
 *   type: INPUT_FIELD_TYPES.CONTACTS_FIRST_NAME,
 *   name: 'firstName',
 *   label: 'First Name',
 *   required: true,
 *   readOnly: false,
 *   placeholder: 'Enter your first name',
 *   showLabel: true
 * };
 * ```
 */
export type FormField = {
  type: InputFieldType;
  name: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  placeholder?: string;
  description?: forms.RichContent;
  showLabel: boolean;
  showPlaceholder?: boolean;
};

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
    const fields = (form?.formFields || []).map(formatField);
    console.log('formatted fields', fields[4]);

    return children({
      name: form?.name ?? '',
      fields,
    });
  },
);
