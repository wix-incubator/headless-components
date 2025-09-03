import { forms } from '@wix/forms';
import { InputFieldType } from './input-field-types';

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
