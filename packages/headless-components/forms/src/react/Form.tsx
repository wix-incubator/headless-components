import React from 'react';
import { forms } from '@wix/forms';

import * as CoreForm from './core/Form.js';
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


/**
 * Props for the Form root component following the documented API
 */
export interface RootProps {
  children: React.ReactNode;
  form: forms.Form;
}

/**
 * Root component that provides all necessary service contexts for a complete form experience.
 * This component sets up the Form service and provides context to child components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   CHECKBOX: Checkbox,
 *   // ... other field components
 * };
 *
 * function FormPage({ form }) {
 *   return (
 *     <Form.Root form={form}>
 *       <Form.Container fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { children } = props;

  return (
    <CoreForm.Root formServiceConfig={{ form: props.form }}>
      {children}
    </CoreForm.Root>
  );
}

/**
 * Mapping of form field types to their corresponding React components.
 * This interface defines the structure for the fieldMap prop, allowing you to specify
 * which React component should be used to render each type of form field.
 *
 * @interface FieldMap
 *
 * @example
 * ```tsx
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
 * Container component for rendering a form with custom field renderers.
 * This component handles the rendering of form fields based on the provided fieldMap.
 *
 * @component
 * @param {string} formId - The unique identifier of the form to render
 * @param {FieldMap} fieldMap - A mapping of field types to their corresponding React components
 *
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { TextInput, TextArea, Checkbox } from './field-components';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   CHECKBOX: Checkbox,
 *   NUMBER_INPUT: NumberInput,
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
    // TODO: render real viewer
    return <MockViewer formId={formId} fieldMap={fieldMap} />;
  },
);

const MockViewer = ({
  formId,
  fieldMap,
}: {
  formId: string;
  fieldMap: FieldMap;
}) => {
  // This is how fieldMap is expected to be used in the viewer
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

  return (
    <>
      <div>Form {formId}</div>
      <div>{JSON.stringify(schemaFields)}</div>
    </>
  );
};
