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
  CheckboxGroupProps,
  CheckboxProps,
  ContactsPhoneProps,
  DateInputProps,
  DatePickerProps,
  DateTimeInputProps,
  DropdownProps,
  FileUploadProps,
  MultilineAddressProps,
  NumberInputProps,
  RadioGroupProps,
  RatingInputProps,
  RichTextProps,
  SignatureProps,
  SubmitButtonProps,
  TagsProps,
  TextAreaProps,
  TextInputProps,
  TimeInputProps,
  ProductListProps,
  FixedPaymentProps,
  PaymentInputProps,
  DonationProps,
  AppointmentProps,
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
 *   // ... remaining field components
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
 * @property {React.ComponentType<TextAreaProps>} TEXT_AREA - Component for textarea fields
 * @property {React.ComponentType<ContactsPhoneProps>} PHONE_INPUT - Component for phone number input fields
 * @property {React.ComponentType<MultilineAddressProps>} MULTILINE_ADDRESS - Component for multi-line address input fields
 * @property {React.ComponentType<DateInputProps>} DATE_INPUT - Component for date input fields
 * @property {React.ComponentType<DatePickerProps>} DATE_PICKER - Component for date picker fields
 * @property {React.ComponentType<DateTimeInputProps>} DATE_TIME_INPUT - Component for date and time input fields
 * @property {React.ComponentType<FileUploadProps>} FILE_UPLOAD - Component for file upload fields
 * @property {React.ComponentType<NumberInputProps>} NUMBER_INPUT - Component for number input fields
 * @property {React.ComponentType<CheckboxProps>} CHECKBOX - Component for checkbox fields
 * @property {React.ComponentType<SignatureProps>} SIGNATURE - Component for signature fields
 * @property {React.ComponentType<RatingInputProps>} RATING_INPUT - Component for rating input fields
 * @property {React.ComponentType<RadioGroupProps>} RADIO_GROUP - Component for radio group fields
 * @property {React.ComponentType<CheckboxGroupProps>} CHECKBOX_GROUP - Component for checkbox group fields
 * @property {React.ComponentType<DropdownProps>} DROPDOWN - Component for dropdown fields
 * @property {React.ComponentType<TagsProps>} TAGS - Component for tags fields
 * @property {React.ComponentType<TimeInputProps>} TIME_INPUT - Component for time input fields
 * @property {React.ComponentType<RichTextProps>} TEXT - Component for rich text and header fields
 * @property {React.ComponentType<SubmitButtonProps>} SUBMIT_BUTTON - Component for submit button fields
 * @property {React.ComponentType<ProductListProps>} PRODUCT_LIST - Component for product list fields
 * @property {React.ComponentType<FixedPaymentProps>} FIXED_PAYMENT - Component for fixed payment fields
 * @property {React.ComponentType<PaymentInputProps>} PAYMENT_INPUT - Component for payment input fields
 * @property {React.ComponentType<DonationProps>} DONATION - Component for donation fields
 * @property {React.ComponentType<AppointmentProps>} APPOINTMENT - Component for appointment fields
 * @property {React.ComponentType<unknown>} IMAGE_CHOICE - Component for image choice fields (TODO: define proper props)
 *
 * @example
 * ```tsx
 * // Example fieldMap - replace with your actual component implementations
 * const FIELD_MAP: FieldMap = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   PHONE_INPUT: PhoneInput,
 *   MULTILINE_ADDRESS: MultilineAddress,
 *   DATE_INPUT: DateInput,
 *   DATE_PICKER: DatePicker,
 *   DATE_TIME_INPUT: DateTimeInput,
 *   FILE_UPLOAD: FileUpload,
 *   NUMBER_INPUT: NumberInput,
 *   CHECKBOX: Checkbox,
 *   SIGNATURE: Signature,
 *   RATING_INPUT: RatingInput,
 *   RADIO_GROUP: RadioGroup,
 *   CHECKBOX_GROUP: CheckboxGroup,
 *   DROPDOWN: Dropdown,
 *   TAGS: Tags,
 *   TIME_INPUT: TimeInput,
 *   TEXT: RichText,
 *   SUBMIT_BUTTON: SubmitButton,
 *   PRODUCT_LIST: ProductList,
 *   FIXED_PAYMENT: FixedPayment,
 *   PAYMENT_INPUT: PaymentInput,
 *   DONATION: Donation,
 *   APPOINTMENT: Appointment,
 *   IMAGE_CHOICE: ImageChoice,
 * };
 * ```
 */
interface FieldMap {
  TEXT_INPUT: React.ComponentType<TextInputProps>;
  TEXT_AREA: React.ComponentType<TextAreaProps>;
  PHONE_INPUT: React.ComponentType<ContactsPhoneProps>;
  MULTILINE_ADDRESS: React.ComponentType<MultilineAddressProps>;
  DATE_INPUT: React.ComponentType<DateInputProps>;
  DATE_PICKER: React.ComponentType<DatePickerProps>;
  DATE_TIME_INPUT: React.ComponentType<DateTimeInputProps>;
  FILE_UPLOAD: React.ComponentType<FileUploadProps>;
  NUMBER_INPUT: React.ComponentType<NumberInputProps>;
  CHECKBOX: React.ComponentType<CheckboxProps>;
  SIGNATURE: React.ComponentType<SignatureProps>;
  RATING_INPUT: React.ComponentType<RatingInputProps>;
  RADIO_GROUP: React.ComponentType<RadioGroupProps>;
  CHECKBOX_GROUP: React.ComponentType<CheckboxGroupProps>;
  DROPDOWN: React.ComponentType<DropdownProps>;
  TAGS: React.ComponentType<TagsProps>;
  TIME_INPUT: React.ComponentType<TimeInputProps>;
  TEXT: React.ComponentType<RichTextProps>;
  SUBMIT_BUTTON: React.ComponentType<SubmitButtonProps>;
  PRODUCT_LIST: React.ComponentType<ProductListProps>;
  FIXED_PAYMENT: React.ComponentType<FixedPaymentProps>;
  PAYMENT_INPUT: React.ComponentType<PaymentInputProps>;
  DONATION: React.ComponentType<DonationProps>;
  APPOINTMENT: React.ComponentType<AppointmentProps>;
  IMAGE_CHOICE: React.ComponentType<unknown>;
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
 *   // ... remaining field components
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
 *   // ... remaining field components
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
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ formId, fieldMap }) => {
    const formService = useService(FormServiceDefinition);
    formService.form.get();

    const schemaFields = {
      // CONTACTS_FIELD_TYPES
      CONTACTS_COMPANY: fieldMap.TEXT_INPUT,
      CONTACTS_POSITION: fieldMap.TEXT_INPUT,
      CONTACTS_TAX_ID: fieldMap.TEXT_INPUT,
      CONTACTS_FIRST_NAME: fieldMap.TEXT_INPUT,
      CONTACTS_LAST_NAME: fieldMap.TEXT_INPUT,
      CONTACTS_EMAIL: fieldMap.TEXT_INPUT,
      CONTACTS_BIRTHDATE: fieldMap.DATE_INPUT,
      CONTACTS_PHONE: fieldMap.PHONE_INPUT,
      CONTACTS_ADDRESS: fieldMap.TEXT_INPUT,
      CONTACTS_SUBSCRIBE: fieldMap.CHECKBOX,

      // QUIZ_FIELD_TYPES
      QUIZ_MULTI_CHOICE: fieldMap.CHECKBOX_GROUP,
      QUIZ_SINGLE_CHOICE: fieldMap.RADIO_GROUP,
      QUIZ_SHORT_TEXT: fieldMap.TEXT_INPUT,
      QUIZ_LONG_TEXT: fieldMap.TEXT_AREA,
      QUIZ_NUMBER: fieldMap.NUMBER_INPUT,
      QUIZ_FILE_UPLOAD: fieldMap.FILE_UPLOAD,
      QUIZ_IMAGE_CHOICE: fieldMap.IMAGE_CHOICE, // TODO: add

      // DEXT_FIELD_TYPES
      DEXT_TEXT_INPUT: fieldMap.TEXT_INPUT,
      DEXT_TEXT_AREA: fieldMap.TEXT_AREA,
      DEXT_DROPDOWN: fieldMap.DROPDOWN,
      DEXT_URL_INPUT: fieldMap.TEXT_INPUT,
      DEXT_RADIO_GROUP: fieldMap.RADIO_GROUP,
      DEXT_NUMBER_INPUT: fieldMap.NUMBER_INPUT,
      DEXT_CHECKBOX: fieldMap.CHECKBOX,
      DEXT_CHECKBOX_GROUP: fieldMap.CHECKBOX_GROUP,
      DEXT_EMAIL: fieldMap.TEXT_INPUT,
      DEXT_PHONE: fieldMap.PHONE_INPUT,
      DEXT_RATING_INPUT: fieldMap.RATING_INPUT,
      DEXT_DATE_PICKER: fieldMap.DATE_PICKER,
      DEXT_TAGS: fieldMap.TAGS,

      // SCHEDULING_FIELD_TYPES
      APPOINTMENT: fieldMap.APPOINTMENT,
      SERVICES_DROPDOWN: fieldMap.DROPDOWN,

      // ECOM_FIELD_TYPES
      ECOM_ADDITIONAL_INFO: fieldMap.TEXT_AREA,
      ECOM_ADDRESS: fieldMap.TEXT_INPUT, // TODO: add to fieldMap
      ECOM_FULL_NAME: fieldMap.TEXT_INPUT,
      ECOM_PHONE: fieldMap.PHONE_INPUT,
      ECOM_COMPANY_NAME: fieldMap.TEXT_INPUT,
      ECOM_EMAIL: fieldMap.TEXT_INPUT,
      ECOM_SUBSCRIPTION: fieldMap.CHECKBOX,

      // BOOKINGS_FIELD_TYPES
      BOOKINGS_FIRST_NAME: fieldMap.TEXT_INPUT,
      BOOKINGS_LAST_NAME: fieldMap.TEXT_INPUT,
      BOOKINGS_EMAIL: fieldMap.TEXT_INPUT,
      BOOKINGS_PHONE: fieldMap.PHONE_INPUT,
      BOOKINGS_ADDRESS: fieldMap.TEXT_INPUT,

      // PAYMENTS_FIELD_TYPES
      PRODUCT_LIST: fieldMap.PRODUCT_LIST,
      DONATION: fieldMap.DONATION,
      PAYMENT_INPUT: fieldMap.PAYMENT_INPUT, // could be TEXT_INPUT?
      FIXED_PAYMENT: fieldMap.FIXED_PAYMENT, // could be TAGS?

      // COMMON_FIELD_TYPES
      TEXT_INPUT: fieldMap.TEXT_INPUT,
      NUMBER_INPUT: fieldMap.NUMBER_INPUT,
      URL_INPUT: fieldMap.TEXT_INPUT,
      TEXT_AREA: fieldMap.TEXT_AREA,
      DATE_INPUT: fieldMap.DATE_INPUT,
      DATE_TIME_INPUT: fieldMap.DATE_TIME_INPUT,
      TIME_INPUT: fieldMap.TIME_INPUT,
      RADIO_GROUP: fieldMap.RADIO_GROUP,
      CHECKBOX_GROUP: fieldMap.CHECKBOX_GROUP,
      FILE_UPLOAD: fieldMap.FILE_UPLOAD,
      CHECKBOX: fieldMap.CHECKBOX,
      DROPDOWN: fieldMap.DROPDOWN,
      // NESTED_FORM: 'NESTED_FORM',
      MULTILINE_ADDRESS: fieldMap.MULTILINE_ADDRESS,
      // are these relevant for headless?
      MLA_COUNTRY: fieldMap.DROPDOWN,
      MLA_CITY: fieldMap.TEXT_INPUT,
      MLA_ADDRESS_LINE: fieldMap.TEXT_INPUT, // dropdown if autocomplete disabled?
      MLA_ADDRESS_LINE_2: fieldMap.TEXT_INPUT,
      MLA_POSTAL_CODE: fieldMap.TEXT_INPUT,
      MLA_SUBDIVISION: fieldMap.DROPDOWN,
      MLA_STREET_NAME: fieldMap.TEXT_INPUT,
      MLA_STREET_NUMBER: fieldMap.TEXT_INPUT,
      MLA_APARTMENT: fieldMap.TEXT_INPUT,
      FULL_NAME_FIRST_NAME: fieldMap.TEXT_INPUT,
      FULL_NAME_LAST_NAME: fieldMap.TEXT_INPUT,
      FULL_NAME: fieldMap.TEXT_INPUT,
      VAT_ID: fieldMap.TEXT_INPUT,
      SIGNATURE: fieldMap.SIGNATURE,
      RATING_INPUT: fieldMap.RATING_INPUT,
      TAGS: fieldMap.TAGS,
      DATE_PICKER: fieldMap.DATE_PICKER,

      // READONLY_FIELD_TYPES
      HEADER: fieldMap.TEXT,
      RICH_TEXT: fieldMap.TEXT,
      SUBMIT_BUTTON: fieldMap.SUBMIT_BUTTON,
    };

    // TODO: render viewer
    return null;
  },
);
