import { forms } from '@wix/forms';

interface BaseFieldProps {
  id: string;
  required: boolean;
  readOnly: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  onFocus: () => void;
}

interface BaseTextFieldProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  description?: forms.RichContent;
}

interface BaseCheckboxProps extends BaseFieldProps {
  value: boolean;
  label: forms.RichContent;
  defaultValue: boolean;
}

/**
 * Props for contacts birthdate field.
 * Used with fieldMap key: CONTACTS_BIRTHDATE
 *
 * @interface ContactsBirthdateProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field (ISO date string format: YYYY-MM-DD)
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} showPlaceholder - Whether to show placeholder text for the date inputs
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @ui_requirement The CONTACTS_BIRTHDATE field MUST render 3 separate number inputs on the UI for day, month and year.
 *
 * @example
 * ```tsx
 * const birthdateField: ContactsBirthdateProps = {
 *   id: 'birthdate',
 *   value: '1990-01-01',
 *   label: 'Date of Birth',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showPlaceholder: true,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsBirthdateProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  showPlaceholder: boolean;
  description?: forms.RichContent;
}

/**
 * Props for contacts subscribe field.
 * Used with fieldMap key: CONTACTS_SUBSCRIBE
 *
 * @interface ContactsSubscribeProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {boolean} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the subscribe checkbox
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const subscribeField: ContactsSubscribeProps = {
 *   id: 'subscribe',
 *   value: true,
 *   required: false,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'Subscribe to newsletter' }] },
 *   defaultValue: false,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsSubscribeProps extends BaseCheckboxProps {}

/**
 * Props for contacts email field.
 * Used with fieldMap key: CONTACTS_EMAIL
 *
 * @interface ContactsEmailProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const emailField: ContactsEmailProps = {
 *   id: 'email',
 *   value: 'user@example.com',
 *   required: true,
 *   readOnly: false,
 *   label: 'Email Address',
 *   showLabel: true,
 *   placeholder: 'Enter your email address',
 *   description: { nodes: [{ type: 'text', text: 'We will never share your email' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsEmailProps extends BaseTextFieldProps {}

/**
 * Props for text area field.
 * Used with fieldMap key: TEXT_AREA
 *
 * @interface TextAreaProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const textAreaField: TextAreaProps = {
 *   id: 'message',
 *   value: 'Hello world!',
 *   required: true,
 *   readOnly: false,
 *   label: 'Your Message',
 *   showLabel: true,
 *   placeholder: 'Enter your message here...',
 *   description: { nodes: [{ type: 'text', text: 'Please provide detailed information' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface TextAreaProps extends BaseTextFieldProps {}

/**
 * Props for text input field.
 * Used with fieldMap key: TEXT_INPUT
 *
 * @interface TextInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const textInputField: TextInputProps = {
 *   id: 'firstName',
 *   value: 'John',
 *   required: true,
 *   readOnly: false,
 *   label: 'First Name',
 *   showLabel: true,
 *   placeholder: 'Enter your first name',
 *   description: { nodes: [{ type: 'text', text: 'Your given name' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface TextInputProps extends BaseTextFieldProps {}

/**
 * Props for number input field.
 * Used with fieldMap key: NUMBER_INPUT
 *
 * @interface NumberInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | number | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const numberInputField: NumberInputProps = {
 *   id: 'age',
 *   value: 25,
 *   required: true,
 *   readOnly: false,
 *   label: 'Age',
 *   showLabel: true,
 *   placeholder: 'Enter your age',
 *   description: { nodes: [{ type: 'text', text: 'Must be 18 or older' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface NumberInputProps extends BaseFieldProps {
  value: string | number | null | undefined;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  description?: forms.RichContent;
}

/**
 * Props for checkbox field.
 * Used with fieldMap key: CHECKBOX
 *
 * @interface CheckboxProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {boolean} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} label - The display label for the form field
 * @property {boolean} defaultValue - The default checked state for the checkbox
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const checkboxField: CheckboxProps = {
 *   id: 'agree',
 *   value: true,
 *   required: true,
 *   readOnly: false,
 *   label: { nodes: [{ type: 'text', text: 'I agree to the terms and conditions' }] },
 *   defaultValue: false,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface CheckboxProps extends BaseCheckboxProps {}
