import { forms } from '@wix/forms';
import { InputFieldType, INPUT_FIELD_TYPES } from './input-field-types';

/**
 * Base properties shared by all form field types.
 */
interface BaseFormField {
  type: InputFieldType;
  name: string;
  label: string;
  required: boolean;
  readOnly: boolean;
  description?: forms.RichContent;
  showLabel: boolean;
}

/**
 * Represents a contacts birthdate form field configuration.
 * This field type has specific properties for date input handling.
 *
 * @interface ContactsBirthdateField
 * @description A specialized form field for birthdate input with date-specific options.
 *
 * @property {typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE} type - Always 'CONTACTS_BIRTHDATE'
 * @property {string} name - The unique identifier for the form field
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} showPlaceholder - Whether to show placeholder text for the date input
 *
 * @example
 * ```tsx
 * const birthdateField: ContactsBirthdateField = {
 *   type: INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE,
 *   name: 'birthdate',
 *   label: 'Date of Birth',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showPlaceholder: true
 * };
 * ```
 */
export interface ContactsBirthdateField extends BaseFormField {
  type: typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE;
  showPlaceholder: boolean;
}

/**
 * Represents a default form field configuration.
 * This is the standard field type for most form inputs.
 *
 * @interface DefaultField
 * @description A standard form field with common text input properties.
 *
 * @property {Exclude<InputFieldType, typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE>} type - Any field type except CONTACTS_BIRTHDATE
 * @property {string} name - The unique identifier for the form field
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 *
 * @example
 * ```tsx
 * const textField: DefaultField = {
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
export interface DefaultField extends BaseFormField {
  type: Exclude<InputFieldType, typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE>;
  placeholder?: string;
}

export type FormField = ContactsBirthdateField | DefaultField;
