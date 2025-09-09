import { forms } from '@wix/forms';
import { CallingCountryCode } from './constants/calling-country-codes';

interface MinMaxLengthProps {
  minLength: number | undefined;
  maxLength: number | undefined;
}

interface ChoiceOption {
  id: string;
  value: string;
  label: string;
  default: boolean;
}

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
 * The field MUST render 3 separate number inputs on the UI for day, month and year.
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
 * Props for contacts phone field.
 * Used with fieldMap key: CONTACTS_PHONE
 *
 * @interface ContactsPhoneProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {CallingCountryCode[]} [allowedCountryCodes] - Optional array of allowed country codes for phone number validation
 * @property {CallingCountryCode} [defaultCountryCode] - Optional default country code to pre-select
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const phoneField: ContactsPhoneProps = {
 *   id: 'phone',
 *   value: '+1-555-123-4567',
 *   required: true,
 *   readOnly: false,
 *   label: 'Phone Number',
 *   showLabel: true,
 *   placeholder: 'Enter your phone number',
 *   description: { nodes: [{ type: 'text', text: 'Include country code' }] },
 *   allowedCountryCodes: ['US', 'CA', 'GB'],
 *   defaultCountryCode: 'US',
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsPhoneProps extends BaseTextFieldProps {
  allowedCountryCodes: CallingCountryCode[];
  defaultCountryCode?: CallingCountryCode;
}

/**
 * Props for contacts company field.
 * Used with fieldMap key: CONTACTS_COMPANY
 *
 * @interface ContactsCompanyProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const companyField: ContactsCompanyProps = {
 *   id: 'company',
 *   value: 'Acme Corporation',
 *   required: false,
 *   readOnly: false,
 *   label: 'Company Name',
 *   showLabel: true,
 *   placeholder: 'Enter your company name',
 *   description: { nodes: [{ type: 'text', text: 'Optional company or organization name' }] },
 *   minLength: 2,
 *   maxLength: 100,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsCompanyProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

/**
 * Props for contacts position field.
 * Used with fieldMap key: CONTACTS_POSITION
 *
 * @interface ContactsPositionProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const positionField: ContactsPositionProps = {
 *   id: 'position',
 *   value: 'Software Engineer',
 *   required: false,
 *   readOnly: false,
 *   label: 'Job Position',
 *   showLabel: true,
 *   placeholder: 'Enter your job position',
 *   description: { nodes: [{ type: 'text', text: 'Your current job title or position' }] },
 *   minLength: 2,
 *   maxLength: 100,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsPositionProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

/**
 * Props for contacts address field.
 * Used with fieldMap key: CONTACTS_ADDRESS
 *
 * @interface ContactsAddressProps
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
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 *
 * @example
 * ```tsx
 * const addressField: ContactsAddressProps = {
 *   id: 'address',
 *   value: '123 Main St\nApt 4B\nNew York, NY 10001',
 *   required: true,
 *   readOnly: false,
 *   label: 'Address',
 *   showLabel: true,
 *   placeholder: 'Enter your full address',
 *   description: { nodes: [{ type: 'text', text: 'Include street, city, state, and zip code' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 *   minLength: 10,
 *   maxLength: 1000,
 * };
 * ```
 */
export interface ContactsAddressProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

type MultilineAddressValue = {
  country?: CallingCountryCode;
  subdivision?: string;
  city?: string;
  addressLine?: string;
  addressLine2?: string;
  postalCode?: string;
  streetName?: string;
  streetNumber?: string;
  apartment?: string;
};

/**
 * Props for multiline address field.
 * Used with fieldMap key: MULTILINE_ADDRESS
 * The field MUST render separate inputs on the UI for these values:
 * 1. Country/Region
 * 2. Address
 * 3. Address - line 2 (if showAddressLine2 is true)
 * 4. City
 * 5. Zip / Postal Code
 *
 * @interface MultilineAddressProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {MultilineAddressValue | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 * @property {boolean} showAddressLine2 - Whether to show the address line 2 field
 * @property {boolean} addressLine2Required - Whether the address line 2 field is required
 *
 * @example
 * ```tsx
 * const multilineAddressField: MultilineAddressProps = {
 *   id: 'multilineAddress',
 *   value: '123 Main Street\nApt 4B\nNew York, NY 10001\nUnited States',
 *   required: true,
 *   readOnly: false,
 *   label: 'Full Address',
 *   showAddressLine2: true,
 *   addressLine2Required: false,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface MultilineAddressProps extends BaseFieldProps {
  label?: string;
  value: MultilineAddressValue;
  showAddressLine2: boolean;
  addressLine2Required?: boolean;
}

/**
 * Props for contacts first name field.
 * Used with fieldMap key: CONTACTS_FIRST_NAME
 *
 * @interface ContactsFirstNameProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const firstNameField: ContactsFirstNameProps = {
 *   id: 'firstName',
 *   value: 'John',
 *   required: true,
 *   readOnly: false,
 *   label: 'First Name',
 *   showLabel: true,
 *   placeholder: 'Enter your first name',
 *   description: { nodes: [{ type: 'text', text: 'Your given name' }] },
 *   minLength: 1,
 *   maxLength: 50,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsFirstNameProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

/**
 * Props for contacts last name field.
 * Used with fieldMap key: CONTACTS_LAST_NAME
 *
 * @interface ContactsLastNameProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const lastNameField: ContactsLastNameProps = {
 *   id: 'lastName',
 *   value: 'Doe',
 *   required: true,
 *   readOnly: false,
 *   label: 'Last Name',
 *   showLabel: true,
 *   placeholder: 'Enter your last name',
 *   description: { nodes: [{ type: 'text', text: 'Your family name' }] },
 *   minLength: 1,
 *   maxLength: 50,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsLastNameProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

/**
 * Props for contacts tax ID field.
 * Used with fieldMap key: CONTACTS_TAX_ID
 *
 * @interface ContactsTaxIdProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Optional placeholder text to display when the field is empty
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const taxIdField: ContactsTaxIdProps = {
 *   id: 'taxId',
 *   value: '123-45-6789',
 *   required: false,
 *   readOnly: false,
 *   label: 'Tax ID',
 *   showLabel: true,
 *   placeholder: 'Enter your tax ID',
 *   description: { nodes: [{ type: 'text', text: 'Your tax identification number' }] },
 *   minLength: 9,
 *   maxLength: 11,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface ContactsTaxIdProps
  extends BaseTextFieldProps,
    MinMaxLengthProps {}

/**
 * Props for text area field.
 * Field allows to give a multi-line answer.
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
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
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
 *   minLength: 10,
 *   maxLength: 1000,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface TextAreaProps extends BaseTextFieldProps, MinMaxLengthProps {}

/**
 * Props for text input field.
 * Field allows to give a single line for a brief answer.
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
 * @property {number} [minLength] - Optional minimum number of characters required
 * @property {number} [maxLength] - Optional maximum number of characters allowed
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
 *   minLength: 1,
 *   maxLength: 50,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface TextInputProps extends BaseTextFieldProps, MinMaxLengthProps {}

/**
 * Props for number input field.
 * Field allows to give a numerical answer.
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
 * Field allows to collect a boolean answer.
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

/**
 * Props for URL input field.
 * Used with fieldMap key: URL_INPUT
 *
 * @interface UrlInputProps
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
 * const urlField: UrlInputProps = {
 *   id: 'website',
 *   value: 'https://example.com',
 *   required: false,
 *   readOnly: false,
 *   label: 'Website URL',
 *   showLabel: true,
 *   placeholder: 'https://example.com',
 *   description: { nodes: [{ type: 'text', text: 'Enter your website URL' }] },
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface UrlInputProps extends BaseTextFieldProps {}

/**
 * Data structure for uploaded file information.
 *
 * @interface FileData
 *
 * @property {string} fileId - Unique identifier for the uploaded file
 * @property {string} displayName - Human-readable name for the file
 * @property {string} url - URL where the file can be accessed
 * @property {string} fileType - MIME type or file extension of the uploaded file
 *
 * @example
 * ```tsx
 * const fileData: FileData = {
 *   fileId: 'file_123456789',
 *   displayName: 'document.pdf',
 *   url: 'https://example.com/uploads/document.pdf',
 *   fileType: 'application/pdf'
 * };
 * ```
 */
interface FileData {
  fileId: string;
  displayName: string;
  url: string;
  fileType: string;
}

type FileFormat = 'Video' | 'Image' | 'Audio' | 'Document' | 'Archive';

/**
 * Props for file upload field.
 * Used with fieldMap key: FILE_UPLOAD
 *
 * @interface FileUploadProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {FileData[] | null | undefined} value - The current value of the form field (array of uploaded file data)
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {string} [buttonText] - Optional custom text for the upload button
 * @property {number} [maxFiles] - Optional maximum number of files allowed
 * @property {FileFormat[]} [allowedFileFormats] - Optional array of allowed file format extensions (e.g., [".pdf", ".doc", ".docx"])
 * @property {string} [explanationText] - Optional explanatory text to display below the upload area
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const fileUploadField: FileUploadProps = {
 *   id: 'documents',
 *   value: null,
 *   required: true,
 *   readOnly: false,
 *   label: 'Upload Documents',
 *   showLabel: true,
 *   description: { nodes: [{ type: 'text', text: 'Upload your documents (PDF, DOC, DOCX)' }] },
 *   buttonText: 'Choose Files',
 *   allowedFileFormats: ['.pdf', '.doc', '.docx'],
 *   explanationText: 'Maximum file size: 10MB',
 *   maxFiles: 5,
 *   onChange: (files) => console.log('Files changed:', files),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface FileUploadProps extends BaseFieldProps {
  value: FileData[] | null | undefined;
  label: string;
  showLabel: boolean;
  description?: forms.RichContent;
  buttonText?: string;
  maxFiles?: number;
  allowedFileFormats?: FileFormat[];
  explanationText?: string;
}

/**
 * Props for signature field.
 * Used with fieldMap key: SIGNATURE
 * The field MUST render a signature pad/canvas for capturing user signatures.
 *
 * @interface SignatureProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {FileData | null | undefined} value - The current value of the signature field (FileData object containing signature image data)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {boolean} imageUploadEnabled - Whether image upload functionality is enabled for the signature field
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the signature value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface SignatureProps extends BaseFieldProps {
  value: FileData | null | undefined;
  label: string;
  showLabel: boolean;
  imageUploadEnabled: boolean;
  description?: forms.RichContent;
}

/**
 * Props for rating input field from 1 to 5.
 * Field allows to collect feedback on products, services and etc by choosing a rating from 1 to 5.
 * Used with fieldMap key: RATING_INPUT
 *
 * @interface RatingInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {number | null | undefined} value - The current value of the rating field (number between 1 and 5)
 * @property {number} [defaultValue] - The default value for the rating field (number between 1 and 5)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the rating value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface RatingInputProps extends BaseFieldProps {
  value: number | null | undefined;
  defaultValue: number | undefined;
  label: string;
  showLabel: boolean;
  description?: forms.RichContent;
}

/**
 * Props for radio group field.
 * Ask people to choose one option from a list.
 * Used with fieldMap key: RADIO_GROUP
 *
 * @interface RadioGroupProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the radio group (selected option value)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {ChoiceOption[]} options - Array of radio button options with id, value, label, and default properties
 * @property {1 | 2 | 3} numberOfColumns - Number of columns for layout (1, 2, or 3)
 * @property {Object} customOption - Configuration for custom "Other" option with text input
 * @property {string} customOption.label - Label for the custom option radio button
 * @property {string} customOption.placeholder - Placeholder text for the custom option input
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the radio group value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface RadioGroupProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  options: ChoiceOption[];
  description?: forms.RichContent;
  numberOfColumns: 1 | 2 | 3;
  customOption: {
    label: string;
    placeholder: string;
  };
}

/**
 * Props for checkbox group field.
 * Field allows to choose multiple options from a list.
 * Used with fieldMap key: CHECKBOX_GROUP
 *
 * @interface CheckboxGroupProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string[] | null | undefined} value - The current values of the checkbox group (array of selected option values)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {ChoiceOption[]} options - Array of checkbox options with id, value, label, and default properties
 * @property {1 | 2 | 3} numberOfColumns - Number of columns for layout (1, 2, or 3)
 * @property {Object} customOption - Configuration for custom "Other" option with text input
 * @property {string} customOption.label - Label for the custom option checkbox
 * @property {string} customOption.placeholder - Placeholder text for the custom option input
 * @property {number} [minItems] - Minimum number of items that must be selected
 * @property {number} [maxItems] - Maximum number of items that can be selected
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the checkbox group values change
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface CheckboxGroupProps extends BaseFieldProps {
  value: string[] | null | undefined;
  label: string;
  showLabel: boolean;
  options: ChoiceOption[];
  description?: forms.RichContent;
  numberOfColumns: 1 | 2 | 3;
  customOption: {
    label: string;
    placeholder: string;
  };
  maxItems?: number;
  minItems?: number;
}

/**
 * Props for dropdown field.
 * Field allows to choose one option from a dropdown list.
 * Used with fieldMap key: DROPDOWN
 *
 * @interface DropdownProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the dropdown (selected option value)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {ChoiceOption[]} options - Array of dropdown options with id, value, label, and default properties
 * @property {string} [placeholder] - Placeholder text for the dropdown when no option is selected
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the dropdown value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface DropdownProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  options: ChoiceOption[];
  placeholder?: string;
  description?: forms.RichContent;
}

/**
 * Props for tags field.
 * Field allows to choose options by selecting tags.
 * Used with fieldMap key: TAGS
 *
 * @interface TagsProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string[] | null | undefined} value - The current values of the tags field (array of selected option values)
 * @property {string} label - The display label for the form field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {ChoiceOption[]} options - Array of tag options with id, value, label, and default properties
 * @property {0 | 1 | 2 | 3} numberOfColumns - Number of columns for layout (0 for auto, 1, 2, or 3)
 * @property {Object} customOption - Configuration for custom "Other" option with text input
 * @property {string} customOption.label - Label for the custom option
 * @property {string} customOption.placeholder - Placeholder text for the custom option input
 * @property {number} [minItems] - Minimum number of tags that must be selected
 * @property {number} [maxItems] - Maximum number of tags that can be selected
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {function} onChange - Callback function called when the tags values change
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 */
export interface TagsProps extends BaseFieldProps {
  value: string[] | null | undefined;
  options: ChoiceOption[];
  label: string;
  showLabel: boolean;
  description?: forms.RichContent;
  customOption?: {
    label: string;
    placeholder: string;
  };
  numberOfColumns: 0 | 1 | 2 | 3;
  minItems?: number;
  maxItems?: number;
}

/**
 * Props for date input field.
 * Used with fieldMap key: DATE_INPUT
 * The field MUST render 3 separate number inputs on the UI for day, month and year.
 *
 * @interface DateInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field (ISO date string format: YYYY-MM-DD)
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} showPlaceholder - Whether to show placeholder text for the date inputs
 * @property {'SUNDAY' | 'MONDAY'} [firstDayOfWeek] - The first day of the week for date calculations (defaults to 'SUNDAY')
 * @property {'all' | 'past' | 'future'} [acceptedDates] - Which dates are accepted for selection (defaults to 'all')
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const dateField: DateInputProps = {
 *   id: 'event-date',
 *   value: '2024-12-25',
 *   label: 'Event Date',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showPlaceholder: true,
 *   firstDayOfWeek: 'MONDAY',
 *   acceptedDates: 'future',
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface DateInputProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  showPlaceholder: boolean;
  firstDayOfWeek: 'SUNDAY' | 'MONDAY';
  acceptedDates: 'all' | 'past' | 'future';
  description?: forms.RichContent;
}

/**
 * Props for date picker field.
 * Field allows to select a date from a calendar.
 * Used with fieldMap key: DATE_PICKER
 *
 * @interface DatePickerProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field (ISO date string format: YYYY-MM-DD)
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {string} [placeholder] - Placeholder text for the date picker input
 * @property {'SUNDAY' | 'MONDAY'} [firstDayOfWeek] - The first day of the week for the calendar (defaults to 'SUNDAY')
 * @property {'all' | 'past' | 'future'} [acceptedDates] - Which dates are accepted for selection (defaults to 'all')
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const dateField: DatePickerProps = {
 *   id: 'appointment-date',
 *   value: '2024-12-25',
 *   label: 'Appointment Date',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   placeholder: 'Select a date',
 *   firstDayOfWeek: 'MONDAY',
 *   acceptedDates: 'future',
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface DatePickerProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  placeholder?: string;
  firstDayOfWeek?: 'SUNDAY' | 'MONDAY';
  acceptedDates: 'all' | 'past' | 'future';
  description?: forms.RichContent;
}

/**
 * Props for date time input field.
 * Field allows to enter a date and time.
 * Used with fieldMap key: DATE_TIME_INPUT
 *
 * @interface DateTimeInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field (ISO datetime string format: YYYY-MM-DDTHH:mm)
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} showDateLabels - Whether to display individual labels for date and time inputs
 * @property {boolean} showPlaceholder - Whether to show placeholder text in the inputs
 * @property {boolean} use24HourFormat - Whether to use 24-hour format for time input (defaults to true)
 * @property {'all' | 'past' | 'future'} [acceptedDates] - Which dates are accepted for selection (defaults to 'all')
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function called when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const dateTimeField: DateTimeInputProps = {
 *   id: 'appointment-datetime',
 *   value: '2024-12-25T14:30',
 *   label: 'Appointment Date & Time',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showDateLabels: true,
 *   showPlaceholder: true,
 *   use24HourFormat: true,
 *   acceptedDates: 'future',
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface DateTimeInputProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  showDateLabels: boolean;
  showPlaceholder: boolean;
  use24HourFormat: boolean;
  acceptedDates: 'all' | 'past' | 'future';
  description?: forms.RichContent;
}

/**
 * Props for time input field.
 * Field allows to enetr a time.
 * Used with fieldMap key: TIME_INPUT
 *
 * @interface TimeInputProps
 *
 * @property {string} id - The unique identifier for the form field
 * @property {string | null | undefined} value - The current value of the form field (time string format: HH:mm or HH:mm:ss)
 * @property {string} label - The display label for the form field
 * @property {boolean} required - Whether the field is required for form submission
 * @property {boolean} readOnly - Whether the field is read-only and cannot be edited by the user
 * @property {forms.RichContent} [description] - Optional rich content description for the field
 * @property {boolean} showLabel - Whether to display the field label
 * @property {boolean} showPlaceholder - Whether to show placeholder text in the input
 * @property {boolean} use24HourFormat - Whether to use 24-hour format for time input (defaults to true)
 * @property {function} onChange - Callback function called when the field value changes
 * @property {function} onBlur - Callback function callezqd when the field loses focus
 * @property {function} onFocus - Callback function called when the field gains focus
 *
 * @example
 * ```tsx
 * const timeField: TimeInputProps = {
 *   id: 'appointment-time',
 *   value: '14:30',
 *   label: 'Appointment Time',
 *   required: true,
 *   readOnly: false,
 *   showLabel: true,
 *   showPlaceholder: true,
 *   use24HourFormat: true,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onBlur: () => console.log('Field blurred'),
 *   onFocus: () => console.log('Field focused')
 * };
 * ```
 */
export interface TimeInputProps extends BaseFieldProps {
  value: string | null | undefined;
  label: string;
  showLabel: boolean;
  showPlaceholder: boolean;
  use24HourFormat: boolean;
  description?: forms.RichContent;
}

/**
 * Props for header field.
 * The field is used to identify different sections of the form.
 * Used with fieldMap key: HEADER
 *
 * @interface HeaderProps
 *
 * @property {forms.RichContent} content - The rich content to display as the header
 * @property {number} maxShownParagraphs - Maximum number of paragraphs to display before truncating
 *
 * @example
 * ```tsx
 * const headerField: HeaderProps = {
 *   content: {
 *     nodes: [
 *       {
 *         type: 'text',
 *         text: 'Personal Information',
 *         marks: [{ type: 'bold' }]
 *       }
 *     ]
 *   },
 *   maxShownParagraphs: 3
 * };
 * ```
 */
export interface HeaderProps {
  content: forms.RichContent;
  maxShownParagraphs: number;
}

/**
 * Props for rich text field.
 * The field is used to display text in the form.
 * Used with fieldMap key: RICH_TEXT
 *
 * @interface RichTextProps
 *
 * @property {forms.RichContent} content - The textrich content to display
 * @property {number} maxShownParagraphs - Maximum number of paragraphs to display before truncating
 *
 * @example
 * ```tsx
 * const richTextField: RichTextProps = {
 *   content: {
 *     nodes: [
 *       {
 *         type: 'text',
 *         text: 'Please fill out all required fields marked with an asterisk (*).',
 *         marks: [{ type: 'bold' }]
 *       }
 *     ]
 *   },
 *   maxShownParagraphs: 2
 * };
 * ```
 */
export interface RichTextProps {
  content: forms.RichContent;
  maxShownParagraphs: number;
}
