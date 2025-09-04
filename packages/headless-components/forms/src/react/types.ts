import { forms } from '@wix/forms';

export interface BaseField {
  id: string;
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
 *   id: 'birthdate',
 *   label: 'Date of Birth',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showPlaceholder: true
 * };
 * ```
 */
export interface ContactsBirthdateField extends BaseField {
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
 * @property {string} id - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the subscribe checkbox
 *
 * @example
 * ```tsx
 * const subscribeField: ContactsSubscribeField = {
 *   id: 'subscribe',
 *   required: false,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'Subscribe to newsletter' }] },
 *   defaultValue: false
 * };
 * ```
 */
export interface ContactsSubscribeField extends BaseField {
  label: forms.RichContent;
  defaultValue: boolean;
}

/**
 * Represents a text area form field configuration.
 *
 * @interface TextAreaField
 *
 * @property {string} id - The unique identifier for the form field
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
 *   id: 'message',
 *   required: true,
 *   readOnly: false,
 *   label: 'Your Message',
 *   showLabel: true,
 *   placeholder: 'Enter your message here...',
 *   description: { nodes: [{ type: 'text', text: 'Please provide detailed information' }] }
 * };
 * ```
 */
export interface TextAreaField extends BaseTextField {}

/**
 * Represents a text input form field configuration.
 *
 * @interface TextInputField
 *
 * @property {string} id - The unique identifier for the form field
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
 *   id: 'firstName',
 *   required: true,
 *   readOnly: false,
 *   label: 'First Name',
 *   showLabel: true,
 *   placeholder: 'Enter your first name',
 *   description: { nodes: [{ type: 'text', text: 'Your given name' }] }
 * };
 * ```
 */
export interface TextInputField extends BaseTextField {}

/**
 * Represents a number input form field configuration.
 *
 * @interface NumberInputField
 *
 * @property {string} id - The unique identifier for the form field
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
 *   id: 'age',
 *   required: true,
 *   readOnly: false,
 *   label: 'Age',
 *   showLabel: true,
 *   placeholder: 'Enter your age',
 *   description: { nodes: [{ type: 'text', text: 'Must be 18 or older' }] }
 * };
 * ```
 */
export interface NumberInputField extends BaseTextField {}

/**
 * Represents a checkbox form field configuration.
 *
 * @interface CheckboxField
 *
 * @property {string} id - The unique identifier for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the checkbox
 *
 * @example
 * ```tsx
 * const checkboxField: CheckboxField = {
 *   id: 'agree',
 *   required: true,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'I agree to the terms and conditions' }] },
 *   defaultValue: false
 * };
 * ```
 */
export interface CheckboxField extends BaseField {
  label: forms.RichContent;
  defaultValue: boolean;
}
