import { forms } from '@wix/forms';
import { InputFieldType, INPUT_FIELD_TYPES } from './input-field-types';

interface BaseFormField {
  type: InputFieldType;
  name: string;
  required: boolean;
  readOnly: boolean;
}

/**
 * Represents a contacts birthdate form field configuration.
 *
 * @interface ContactsBirthdateField
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
  label: string;
  showLabel: boolean;
  showPlaceholder: boolean;
  description?: forms.RichContent;
}

/**
 * Represents a contacts subscribe form field configuration.
 *
 * @interface ContactsSubscribeField
 *
 * @property {typeof INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE} type - Always 'CONTACTS_SUBSCRIBE'
 * @property {string} name - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the subscribe checkbox
 *
 * @example
 * ```tsx
 * const subscribeField: ContactsSubscribeField = {
 *   type: INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE,
 *   name: 'subscribe',
 *   required: false,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'Subscribe to newsletter' }] },
 *   defaultValue: false
 * };
 * ```
 */
export interface ContactsSubscribeField extends BaseFormField {
  type: typeof INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE;
  label: forms.RichContent;
  defaultValue: boolean;
}

// TODO: DefaultField should be deleted once all fields have specific types defined
export interface DefaultField extends BaseFormField {
  type: Exclude<InputFieldType, typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE>;
  label: string;
  placeholder?: string;
  description?: forms.RichContent;
  showLabel: boolean;
}

export type FormField =
  | ContactsBirthdateField
  | ContactsSubscribeField
  | DefaultField;
