import { forms } from '@wix/forms';
import { InputFieldType, INPUT_FIELD_TYPES } from './input-field-types.js';

export interface BaseField {
  name: string;
  required: boolean;
  readOnly: boolean;
}

interface BaseTextField extends BaseField {
  label: string;
  showLabel: boolean;
  placeholder?: string;
  description?: forms.RichContent;
}

/**
 * Represents a contacts birthdate form field configuration.
 *
 * @interface ContactsBirthdateField
 *
 * @property {typeof INPUT_FIELD_TYPES.CONTACTS_BIRTHDATE} type - Always 'CONTACTS_BIRTHDATE'
 * @property {string} id - The unique identifier for the form field
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
export interface ContactsBirthdateField extends BaseField {
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
export interface ContactsSubscribeField extends BaseField {
  type: typeof INPUT_FIELD_TYPES.CONTACTS_SUBSCRIBE;
  label: forms.RichContent;
  defaultValue: boolean;
}

/**
 * Represents a text area form field configuration.
 *
 * @interface TextAreaField
 *
 * @property {typeof INPUT_FIELD_TYPES.TEXT_AREA} type - Always 'TEXT_AREA'
 * @property {string} name - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 *
 * @example
 * ```tsx
 * const textAreaField: TextAreaField = {
 *   type: INPUT_FIELD_TYPES.TEXT_AREA,
 *   name: 'message',
 *   required: true,
 *   readOnly: false,
 *   label: 'Your Message',
 *   showLabel: true,
 *   placeholder: 'Enter your message here...',
 *   description: { nodes: [{ type: 'text', text: 'Please provide detailed information' }] }
 * };
 * ```
 */
export interface TextAreaField extends BaseTextField {
  type: typeof INPUT_FIELD_TYPES.TEXT_AREA;
}

/**
 * Represents a text input form field configuration.
 *
 * @interface TextInputField
 *
 * @property {typeof INPUT_FIELD_TYPES.TEXT_INPUT} type - Always 'TEXT_INPUT'
 * @property {string} name - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 *
 * @example
 * ```tsx
 * const textInputField: TextInputField = {
 *   type: INPUT_FIELD_TYPES.TEXT_INPUT,
 *   name: 'firstName',
 *   required: true,
 *   readOnly: false,
 *   label: 'First Name',
 *   showLabel: true,
 *   placeholder: 'Enter your first name',
 *   description: { nodes: [{ type: 'text', text: 'Your given name' }] }
 * };
 * ```
 */
export interface TextInputField extends BaseTextField {
  type: typeof INPUT_FIELD_TYPES.TEXT_INPUT;
}

/**
 * Represents a number input form field configuration.
 *
 * @interface NumberInputField
 *
 * @property {typeof INPUT_FIELD_TYPES.NUMBER_INPUT} type - Always 'NUMBER_INPUT'
 * @property {string} name - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 *
 * @example
 * ```tsx
 * const numberInputField: NumberInputField = {
 *   type: INPUT_FIELD_TYPES.NUMBER_INPUT,
 *   name: 'age',
 *   required: true,
 *   readOnly: false,
 *   label: 'Age',
 *   showLabel: true,
 *   placeholder: 'Enter your age',
 *   description: { nodes: [{ type: 'text', text: 'Must be 18 or older' }] }
 * };
 * ```
 */
export interface NumberInputField extends BaseTextField {
  type: typeof INPUT_FIELD_TYPES.NUMBER_INPUT;
}

/**
 * Represents a checkbox form field configuration.
 *
 * @interface CheckboxField
 *
 * @property {typeof INPUT_FIELD_TYPES.CHECKBOX} type - Always 'CHECKBOX'
 * @property {string} name - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the checkbox
 *
 * @example
 * ```tsx
 * const checkboxField: CheckboxField = {
 *   type: INPUT_FIELD_TYPES.CHECKBOX,
 *   name: 'agree',
 *   required: true,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'I agree to the terms and conditions' }] },
 *   defaultValue: false
 * };
 * ```
 */
export interface CheckboxField extends BaseField {
  type: typeof INPUT_FIELD_TYPES.CHECKBOX;
  label: forms.RichContent;
  defaultValue: boolean;
}

// TODO: DefaultField should be deleted once all fields have specific types defined
export interface DefaultField extends BaseTextField {
  type: InputFieldType;
}
