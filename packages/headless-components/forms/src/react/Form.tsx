import React from 'react';
import { AsChildSlot } from '@wix/headless-utils/react';

import { type FormServiceConfig } from '../services/form-service';
import * as CoreForm from './core/Form.js';

import {
  CheckboxGroupProps,
  CheckboxProps,
  PhoneInputProps,
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
  ImageChoiceProps,
} from './types.js';

enum TestIds {
  formRoot = 'form-root',
  formLoadingError = 'form-loading-error',
  formError = 'form-error',
  formSubmitted = 'form-submitted',
}

/**
 * Props for the Form root component following the documented API
 */
export interface RootProps {
  children: React.ReactNode;
  /** Form service configuration */
  formServiceConfig: FormServiceConfig;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the root element */
  className?: string;
}

/**
 * Root component that provides all necessary service contexts for a complete form experience.
 * This component sets up the Form service and provides context to child components.
 * Must be used as the top-level component for all form functionality.
 *
 * @component
 * @param {RootProps} props - The component props
 * @param {React.ReactNode} props.children - Child components that will have access to form context
 * @param {FormServiceConfig} props.formServiceConfig - Form service configuration object
 * @param {string} [props.className] - CSS classes to apply to the root element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   CHECKBOX: Checkbox,
 *   // ... other field components
 * };
 *
 * // Pattern 1: Pre-loaded form data (SSR/SSG)
 * function FormPage({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 *
 * // Pattern 2: Lazy loading with formId (Client-side)
 * function DynamicFormPage({ formId }) {
 *   return (
 *     <Form.Root formServiceConfig={{ formId }}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, formServiceConfig, asChild, ...otherProps } = props;

    return (
      <CoreForm.Root formServiceConfig={formServiceConfig}>
        <RootContent asChild={asChild} ref={ref} {...otherProps}>
          {children}
        </RootContent>
      </CoreForm.Root>
    );
  },
);

/**
 * Props for RootContent internal component
 */
interface RootContentProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components to render */
  children?: React.ReactNode;
  /** CSS classes to apply to the container */
  className?: string;
}

/**
 * Internal component to handle the Root content with service access.
 * This component wraps the children with the necessary div container and applies styling.
 *
 * @internal
 * @param {RootContentProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} [props.className] - CSS classes to apply to the container
 * @param {boolean} [props.asChild] - Whether to render as a child component
 * @returns {JSX.Element} The wrapped content
 */
const RootContent = React.forwardRef<HTMLDivElement, RootContentProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.formRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{React.isValidElement(children) ? children : null}</div>
      </AsChildSlot>
    );
  },
);

/**
 * Props for Form Loading component
 */
export interface LoadingProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during loading state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Component that renders content during loading state.
 * Only displays its children when the form is currently loading.
 *
 * @component
 * @param {LoadingProps} props - The component props
 * @param {boolean} [props.asChild] - Whether to render as a child component
 * @param {React.ReactNode} [props.children] - Content to display during loading state
 * @param {string} [props.className] - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage with className
 * function FormLoading() {
 *   return (
 *     <Form.Loading className="flex justify-center p-4" />
 *   );
 * }
 *
 * // Custom content
 * function CustomFormLoading() {
 *   return (
 *     <Form.Loading>
 *       <div className="flex justify-center items-center p-4">
 *         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 *         <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
 *       </div>
 *     </Form.Loading>
 *   );
 * }
 *
 * // With asChild for custom components
 * function CustomFormLoadingAsChild() {
 *   return (
 *     <Form.Loading asChild>
 *       <div className="custom-loading-container">
 *         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
 *         <span className="ml-2 text-foreground font-paragraph">Loading form...</span>
 *       </div>
 *     </Form.Loading>
 *   );
 * }
 * ```
 */
export const Loading = React.forwardRef<HTMLElement, LoadingProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreForm.Loading>
        {({ isLoading }) => {
          if (!isLoading) return null;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid="form-loading"
              customElement={children}
              content="Loading form..."
              {...otherProps}
            >
              <div>Loading form...</div>
            </AsChildSlot>
          );
        }}
      </CoreForm.Loading>
    );
  },
);

/**
 * Props for Form LoadingError component
 */
export interface LoadingErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during error state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Component that renders content when there's an error loading the form.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @param {LoadingErrorProps} props - The component props
 * @param {boolean} [props.asChild] - Whether to render as a child component
 * @param {React.ReactNode} [props.children] - Content to display during error state
 * @param {string} [props.className] - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage with className
 * function FormLoadingError() {
 *   return (
 *     <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *   );
 * }
 *
 * // Custom content
 * function CustomLoadingError() {
 *   return (
 *     <Form.LoadingError>
 *       <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-4">
 *         <h3 className="font-heading text-lg">Error loading form</h3>
 *         <p className="font-paragraph">Something went wrong. Please try again.</p>
 *       </div>
 *     </Form.LoadingError>
 *   );
 * }
 *
 * // With asChild for custom components
 * function CustomLoadingErrorAsChild() {
 *   return (
 *     <Form.LoadingError asChild>
 *       {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
 *         ({ error }, ref) => (
 *           <div ref={ref} className="custom-error-container">
 *             <h3 className="font-heading">Error Loading Form</h3>
 *             <p className="font-paragraph">{error}</p>
 *           </div>
 *         )
 *       )}
 *     </Form.LoadingError>
 *   );
 * }
 * ```
 */
export const LoadingError = React.forwardRef<HTMLElement, LoadingErrorProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreForm.LoadingError>
        {({ error, hasError }) => {
          if (!hasError) return null;

          const errorData = { error, hasError };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.formLoadingError}
              customElement={children}
              customElementProps={errorData}
              content={error}
              {...otherProps}
            >
              <div>{error}</div>
            </AsChildSlot>
          );
        }}
      </CoreForm.LoadingError>
    );
  },
);

/**
 * Props for Form Error component
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during submit error state (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Component that renders content when there's an error during form submission.
 * Only displays its children when a submission error has occurred.
 *
 * @component
 * @param {ErrorProps} props - The component props
 * @param {boolean} [props.asChild] - Whether to render as a child component
 * @param {React.ReactNode} [props.children] - Content to display during submit error state
 * @param {string} [props.className] - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage with className
 * function FormError() {
 *   return <Form.Error className="text-destructive p-4 rounded-lg mb-4" />;
 * }
 *
 * // Custom content
 * function CustomFormError() {
 *   return (
 *     <Form.Error>
 *       <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-4">
 *         <h3 className="font-heading text-lg">Submission Failed</h3>
 *         <p className="font-paragraph">Please check your input and try again.</p>
 *       </div>
 *     </Form.Error>
 *   );
 * }
 *
 * // With asChild for custom components
 * function CustomFormErrorAsChild() {
 *   return (
 *     <Form.Error asChild>
 *       {React.forwardRef<HTMLDivElement, { error: string | null; hasError: boolean }>(
 *         ({ error }, ref) => (
 *           <div ref={ref} className="custom-error-container">
 *             <h3 className="font-heading">Submission Failed</h3>
 *             <p className="font-paragraph">{error}</p>
 *           </div>
 *         )
 *       )}
 *     </Form.Error>
 *   );
 * }
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreForm.Error>
      {({ error, hasError }) => {
        if (!hasError) return null;

        const errorData = { error, hasError };

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.formError}
            customElement={children}
            customElementProps={errorData}
            content={error}
            {...otherProps}
          >
            <div className="text-destructive text-sm sm:text-base">{error}</div>
          </AsChildSlot>
        );
      }}
    </CoreForm.Error>
  );
});

/**
 * Props for Form Submitted component
 */
export interface SubmittedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display after successful submission (can be a ReactNode) */
  children?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Component that renders content after successful form submission.
 * Only displays its children when the form has been successfully submitted.
 *
 * @component
 * @param {SubmittedProps} props - The component props
 * @param {boolean} [props.asChild] - Whether to render as a child component
 * @param {React.ReactNode} [props.children] - Content to display after successful submission
 * @param {string} [props.className] - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage with className
 * function FormSubmitted() {
 *   return <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />;
 * }
 *
 * // Custom content
 * function CustomFormSubmitted() {
 *   return (
 *     <Form.Submitted>
 *       <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg mb-4">
 *         <h2 className="font-heading text-xl mb-2">Thank You!</h2>
 *         <p className="font-paragraph">Your form has been submitted successfully.</p>
 *       </div>
 *     </Form.Submitted>
 *   );
 * }
 *
 * // With asChild for custom components
 * function CustomFormSubmittedAsChild() {
 *   return (
 *     <Form.Submitted asChild>
 *       {React.forwardRef<HTMLDivElement, { isSubmitted: boolean; message: string }>(
 *         ({ message }, ref) => (
 *           <div ref={ref} className="custom-success-container">
 *             <h2 className="font-heading">Thank You!</h2>
 *             <p className="font-paragraph">{message}</p>
 *           </div>
 *         )
 *       )}
 *     </Form.Submitted>
 *   );
 * }
 * ```
 */
export const Submitted = React.forwardRef<HTMLElement, SubmittedProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreForm.Submitted>
        {({ isSubmitted, message }) => {
          if (!isSubmitted) return null;

          const submittedData = { isSubmitted, message };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.formSubmitted}
              customElement={children}
              customElementProps={submittedData}
              content={message}
              {...otherProps}
            >
              <div className="text-green-500 text-sm sm:text-base">
                {message}
              </div>
            </AsChildSlot>
          );
        }}
      </CoreForm.Submitted>
    );
  },
);

/**
 * Mapping of form field types to their corresponding React components.
 *
 * Each key represents a field type identifier that matches the field types defined
 * in the form configuration, and each value is a React component that will receive
 * the field's props and render the appropriate UI element.
 *
 * The field components must accept the corresponding props interface for their field type.
 * For example, TEXT_INPUT components should accept TextInputProps, CHECKBOX components
 * should accept CheckboxProps, etc.
 *
 * @interface FieldMap
 * @property {React.ComponentType<TextInputProps>} TEXT_INPUT - Component for single-line text input fields
 * @property {React.ComponentType<TextAreaProps>} TEXT_AREA - Component for multi-line text input fields
 * @property {React.ComponentType<PhoneInputProps>} PHONE_INPUT - Component for phone number input fields
 * @property {React.ComponentType<MultilineAddressProps>} MULTILINE_ADDRESS - Component for complex address input fields
 * @property {React.ComponentType<DateInputProps>} DATE_INPUT - Component for date input fields (day/month/year)
 * @property {React.ComponentType<DatePickerProps>} DATE_PICKER - Component for calendar-based date selection
 * @property {React.ComponentType<DateTimeInputProps>} DATE_TIME_INPUT - Component for combined date and time input
 * @property {React.ComponentType<FileUploadProps>} FILE_UPLOAD - Component for file upload fields
 * @property {React.ComponentType<NumberInputProps>} NUMBER_INPUT - Component for numerical input fields
 * @property {React.ComponentType<CheckboxProps>} CHECKBOX - Component for boolean checkbox fields
 * @property {React.ComponentType<SignatureProps>} SIGNATURE - Component for digital signature capture
 * @property {React.ComponentType<RatingInputProps>} RATING_INPUT - Component for 1-5 star rating input
 * @property {React.ComponentType<RadioGroupProps>} RADIO_GROUP - Component for single selection from multiple options
 * @property {React.ComponentType<CheckboxGroupProps>} CHECKBOX_GROUP - Component for multiple selection from multiple options
 * @property {React.ComponentType<DropdownProps>} DROPDOWN - Component for dropdown selection fields
 * @property {React.ComponentType<TagsProps>} TAGS - Component for tag-based selection fields
 * @property {React.ComponentType<TimeInputProps>} TIME_INPUT - Component for time-only input fields
 * @property {React.ComponentType<RichTextProps>} TEXT - Component for rich text display fields
 * @property {React.ComponentType<SubmitButtonProps>} SUBMIT_BUTTON - Component for form submission button
 * @property {React.ComponentType<ProductListProps>} PRODUCT_LIST - Component for product selection fields
 * @property {React.ComponentType<FixedPaymentProps>} FIXED_PAYMENT - Component for fixed payment amount display
 * @property {React.ComponentType<PaymentInputProps>} PAYMENT_INPUT - Component for custom payment amount input
 * @property {React.ComponentType<DonationProps>} DONATION - Component for donation amount selection
 * @property {React.ComponentType<AppointmentProps>} APPOINTMENT - Component for appointment scheduling
 * @property {React.ComponentType<ImageChoiceProps>} IMAGE_CHOICE - Component for image-based selection
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
  PHONE_INPUT: React.ComponentType<PhoneInputProps>;
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
  IMAGE_CHOICE: React.ComponentType<ImageChoiceProps>;
}

/**
 * Props for the Form Fields component.
 *
 * @interface FieldsProps
 * @property {FieldMap} fieldMap - A mapping of field types to their corresponding React components
 * @example
 * ```tsx
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   NUMBER_INPUT: NumberInput,
 *   CHECKBOX: Checkbox,
 *   RADIO_GROUP: RadioGroup,
 *   CHECKBOX_GROUP: CheckboxGroup,
 *   DROPDOWN: Dropdown,
 *   // ... remaining field components
 * };
 *
 * <Form.Fields fieldMap={FIELD_MAP} />
 * ```
 */
export interface FieldsProps {
  fieldMap: FieldMap;
}

/**
 * Fields component for rendering a form with custom field renderers.
 * This component handles the rendering of form fields based on the provided fieldMap.
 * Must be used within Form.Root to access form context.
 *
 * @component
 * @param {FieldsProps} props - Component props
 * @param {FieldMap} props.fieldMap - A mapping of field types to their corresponding React components
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
 * function ContactForm({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */

/**
 * Fields component for rendering a form with custom field renderers.
 * It maps each field type from the form configuration to its corresponding React component
 * and renders them in the order and layout defined by the form structure.
 *
 * The component automatically handles:
 * - Field validation and error display
 * - Form state management
 * - Field value updates
 *
 * Must be used within Form.Root to access form context.
 *
 * @component
 * @param {FieldsProps} props - The component props
 * @param {FieldMap} props.fieldMap - A mapping of field types to their corresponding React components. Each key represents a field type (e.g., 'TEXT_INPUT', 'CHECKBOX') and the value is the React component that should render that field type.
 *
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 * import {
 *   TextInput,
 *   TextArea,
 *   PhoneInput,
 *   MultilineAddress,
 *   DateInput,
 *   DatePicker,
 *   DateTimeInput,
 *   FileUpload,
 *   NumberInput,
 *   Checkbox,
 *   Signature,
 *   RatingInput,
 *   RadioGroup,
 *   CheckboxGroup,
 *   Dropdown,
 *   Tags,
 *   TimeInput,
 *   RichText,
 *   SubmitButton,
 *   ProductList,
 *   FixedPayment,
 *   PaymentInput,
 *   Donation,
 *   Appointment,
 *   ImageChoice
 * } from './components';
 *
 * // Define your field mapping - this tells the Fields component which React component to use for each field type
 * const FIELD_MAP = {
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
 *
 * function ContactForm({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with custom field components
 * const CustomTextField = ({ value, onChange, label, error, ...props }) => (
 *   <div className="form-field">
 *     <label className="text-foreground font-paragraph">{label}</label>
 *     <input
 *       value={value || ''}
 *       onChange={(e) => onChange(e.target.value)}
 *       className="bg-background border-foreground text-foreground"
 *       {...props}
 *     />
 *     {error && <span className="text-destructive">{error}</span>}
 *   </div>
 * );
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: CustomTextField,
 *   // ... other field components
 * };
 * ```
 */
export const Fields = React.forwardRef<HTMLElement, FieldsProps>(
  ({ fieldMap }) => {
    // TODO: render real viewer
    return <MockViewer fieldMap={fieldMap} />;
  },
);

const MockViewer = ({ fieldMap }: { fieldMap: FieldMap }) => {
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
    ECOM_ADDRESS: fieldMap.TEXT_INPUT,
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
      <div>Form Fields</div>
      <div>{JSON.stringify(schemaFields)}</div>
    </>
  );
};

/**
 * Main Form namespace containing all form components following the compound component pattern.
 * Provides a headless, flexible way to render and manage forms with custom field components.
 *
 * @namespace Form
 * @property {typeof Root} Root - Form root component that provides service context to all child components
 * @property {typeof Loading} Loading - Form loading state component that displays content during form loading
 * @property {typeof LoadingError} LoadingError - Form loading error state component for handling form loading errors
 * @property {typeof Error} Error - Form submit error state component for handling form submission errors
 * @property {typeof Submitted} Submitted - Form submitted state component for displaying success messages
 * @property {typeof Fields} Fields - Form fields component for rendering form fields with custom field renderers
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 * import { TextInput, TextArea, Checkbox } from './field-components';
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   TEXT_AREA: TextArea,
 *   CHECKBOX: Checkbox,
 *   // ... other field components
 * };
 *
 * // Pattern 1: Pre-loaded form data (SSR/SSG)
 * function MyForm({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 *
 * // Pattern 2: Lazy loading with formId (Client-side)
 * function DynamicForm({ formId }) {
 *   return (
 *     <Form.Root formServiceConfig={{ formId }}>
 *       <Form.Loading className="flex justify-center p-4" />
 *       <Form.LoadingError className="text-destructive px-4 py-3 rounded mb-4" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export const Form = {
  /** Form root component that provides service context */
  Root,
  /** Form loading state component */
  Loading,
  /** Form loading error state component */
  LoadingError,
  /** Form error state component */
  Error,
  /** Form submitted state component */
  Submitted,
  /** Form fields component for rendering form fields */
  Fields,
} as const;
