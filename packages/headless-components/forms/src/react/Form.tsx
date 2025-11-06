import React, { useState, useCallback } from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import {
  type FormValues,
  type FormError,
  useForm,
  FormProvider,
} from '@wix/form-public';
import {
  type CheckboxGroupProps,
  type CheckboxProps,
  type PhoneInputProps,
  type DateInputProps,
  type DatePickerProps,
  type DateTimeInputProps,
  type DropdownProps,
  type FileUploadProps,
  type MultilineAddressProps,
  type NumberInputProps,
  type RadioGroupProps,
  type RatingInputProps,
  type RichTextProps,
  type SignatureProps,
  type SubmitButtonProps,
  type TagsProps,
  type TextAreaProps,
  type TextInputProps,
  type TimeInputProps,
  type ProductListProps,
  type FixedPaymentProps,
  type PaymentInputProps,
  type DonationProps,
  type AppointmentProps,
  type ImageChoiceProps,
} from './types.js';

import { type FormServiceConfig } from '../services/form-service.js';
import {
  Root as CoreRoot,
  Loading as CoreLoading,
  LoadingError as CoreLoadingError,
  Error as CoreError,
  Submitted as CoreSubmitted,
  Fields as CoreFields,
  Field as CoreField,
} from './core/Form.js';
import { forms } from '@wix/forms';
import {
  FieldContext,
  useFieldContext,
  type FieldContextValue,
} from './context/FieldContext.js';
import {
  FieldLayoutProvider,
  useFieldLayout,
} from './context/FieldLayoutContext.js';

enum TestIds {
  formRoot = 'form-root',
  form = 'form',
  formLoading = 'form-loading',
  formLoadingError = 'form-loading-error',
  formError = 'form-error',
  formSubmitted = 'form-submitted',
  fieldRoot = 'field-root',
  fieldLabel = 'field-label',
  fieldInputWrapper = 'field-input-wrapper',
  fieldInput = 'field-input',
  fieldError = 'field-error',
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
 * @param {boolean} [props.asChild] - Whether to render as a child component
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
      <CoreRoot formServiceConfig={formServiceConfig}>
        <RootContent asChild={asChild} ref={ref} {...otherProps}>
          {children}
        </RootContent>
      </CoreRoot>
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
        <div>{children}</div>
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
      <CoreLoading>
        {({ isLoading }) => {
          if (!isLoading) return null;

          return (
            <AsChildSlot
              data-testid={TestIds.formLoading}
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              content="Loading form..."
              {...otherProps}
            >
              <div>Loading form...</div>
            </AsChildSlot>
          );
        }}
      </CoreLoading>
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
      <CoreLoadingError>
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
      </CoreLoadingError>
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
    <CoreError>
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
    </CoreError>
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
      <CoreSubmitted>
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
      </CoreSubmitted>
    );
  },
);

/**
 * Mapping of form field types to their corresponding React components.
 *
 * ALL field components in this map MUST use Form.Field for proper
 * grid layout positioning.
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
export interface FieldMap {
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
 * @property {string} rowGapClassname - CSS class name for gap between rows
 * @property {string} columnGapClassname - CSS class name for gap between columns
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
 * <Form.Fields fieldMap={FIELD_MAP} rowGapClassname="gap-y-4" columnGapClassname="gap-x-2" />
 * ```
 */
interface FieldsProps {
  fieldMap: FieldMap;
  rowGapClassname: string;
  columnGapClassname: string;
}

/**
 * Fields component for rendering a form with custom field renderers.
 * This component handles the rendering of form fields based on the provided fieldMap.
 * Must be used within Form.Root to access form context.
 *
 * @component
 * @param {FieldsProps} props - Component props
 * @param {FieldMap} props.fieldMap - A mapping of field types to their corresponding React components
 * @param {string} props.rowGapClassname - CSS class name for gap between rows
 * @param {string} props.columnGapClassname - CSS class name for gap between columns
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
 *       <Form.Fields
 *         fieldMap={FIELD_MAP}
 *         rowGapClassname="gap-y-4"
 *         columnGapClassname="gap-x-2"
 *       />
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
 * - Grid layout with configurable row and column gaps
 *
 * Must be used within Form.Root to access form context.
 *
 * @component
 * @param {FieldsProps} props - The component props
 * @param {FieldMap} props.fieldMap - A mapping of field types to their corresponding React components. Each key represents a field type (e.g., 'TEXT_INPUT', 'CHECKBOX') and the value is the React component that should render that field type.
 * @param {string} props.rowGapClassname - CSS class name for gap between form rows
 * @param {string} props.columnGapClassname - CSS class name for gap between form columns
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
 *       <Form.Fields
 *         fieldMap={FIELD_MAP}
 *         rowGapClassname="gap-y-4"
 *         columnGapClassname="gap-x-2"
 *       />
 *       <Form.Error className="text-destructive p-4 rounded-lg mb-4" />
 *       <Form.Submitted className="text-green-500 p-4 rounded-lg mb-4" />
 *     </Form.Root>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Creating custom field components - ALL field components MUST use Form.Field
 * // This example shows the REQUIRED structure for a TEXT_INPUT component
 * import { Form, type TextInputProps } from '@wix/headless-forms/react';
 *
 * const TextInput = (props: TextInputProps) => {
 *   const { id, value, onChange, label, error, required, ...inputProps } = props;
 *
 *   // Form.Field provides automatic grid layout positioning
 *   return (
 *     <Form.Field id={id}>
 *       <Form.Field.Label>
 *         <label className="text-foreground font-paragraph">
 *           {label}
 *           {required && <span className="text-destructive ml-1">*</span>}
 *         </label>
 *       </Form.Field.Label>
 *       <Form.Field.Input
 *         description={error && <span className="text-destructive text-sm">{error}</span>}
 *       >
 *         <input
 *           type="text"
 *           value={value || ''}
 *           onChange={(e) => onChange(e.target.value)}
 *           className="bg-background border-foreground text-foreground"
 *           aria-invalid={!!error}
 *           {...inputProps}
 *         />
 *       </Form.Field.Input>
 *     </Form.Field>
 *   );
 * };
 *
 * const FIELD_MAP = {
 *   TEXT_INPUT: TextInput,
 *   // ... all other field components must also use Form.Field
 * };
 * ```
 */
export const Fields = React.forwardRef<HTMLDivElement, FieldsProps>(
  (props, ref) => {
    const [formValues, setFormValues] = useState<FormValues>({});
    const [formErrors, setFormErrors] = useState<FormError[]>([]);

    const handleFormChange = useCallback((values: FormValues) => {
      setFormValues(values);
    }, []);

    const handleFormValidate = useCallback((errors: FormError[]) => {
      setFormErrors(errors);
    }, []);

    return (
      <CoreFields>
        {({ form, submitForm }) => {
          if (!form) return null;

          return (
            <div ref={ref}>
              <FormProvider>
                <FieldsWithForm
                  form={form}
                  values={formValues}
                  onChange={handleFormChange}
                  errors={formErrors}
                  onValidate={handleFormValidate}
                  fields={props.fieldMap}
                  submitForm={() => submitForm(formValues)}
                  rowGapClassname={props.rowGapClassname}
                  columnGapClassname={props.columnGapClassname}
                />
              </FormProvider>
            </div>
          );
        }}
      </CoreFields>
    );
  },
);

const FieldsWithForm = ({
  form,
  submitForm,
  values,
  onChange,
  errors,
  onValidate,
  fields: fieldMap,
  rowGapClassname,
  columnGapClassname,
}: {
  form: forms.Form;
  submitForm: () => void;
  values: FormValues;
  onChange: (values: FormValues) => void;
  errors: FormError[];
  onValidate: (errors: FormError[]) => void;
  fields: FieldMap;
  rowGapClassname: string;
  columnGapClassname: string;
}) => {
  const formData = useForm({
    form,
    values,
    errors,
    onChange,
    onValidate,
    submitForm,
    fieldMap,
  });

  if (!formData) return null;
  const { columnCount, fieldElements, fieldsLayout } = formData;

  return (
    // TODO: use readOnly, isDisabled
    // TODO: step title a11y support
    // TODO: mobile support?
    <FieldLayoutProvider value={fieldsLayout}>
      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset
          style={{ display: 'flex', flexDirection: 'column' }}
          className={rowGapClassname}
        >
          {fieldElements.map((rowElements, index) => {
            return (
              <div
                key={index}
                style={{
                  display: 'grid',
                  width: '100%',
                  gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                  gridAutoRows: 'minmax(min-content, max-content)',
                }}
                className={columnGapClassname}
              >
                {rowElements}
              </div>
            );
          })}
        </fieldset>
      </form>
    </FieldLayoutProvider>
  );
};

/**
 * Props for Field container component
 */
export interface FieldProps {
  /** The unique identifier for this field */
  id: string;
  /** Child components (Field.Label, Field.Input, etc.) */
  children: React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the root element */
  className?: string;
}

/**
 * Field component with sub-components
 */
interface FieldComponent
  extends React.ForwardRefExoticComponent<
    FieldProps & React.RefAttributes<HTMLDivElement>
  > {
  Label: typeof FieldLabel;
  InputWrapper: typeof FieldInputWrapper;
  Input: typeof FieldInput;
  Error: typeof FieldError;
}

/**
 * Props for Field.Label component
 */
export interface FieldLabelProps {
  /** Label content to display */
  children: React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the label element */
  className?: string;
}

/**
 * Props for Field.InputWrapper component
 */
export interface FieldInputWrapperProps {
  /** Child components (typically Field.Input and Field.Error) */
  children: React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the wrapper element */
  className?: string;
}

/**
 * Props for Field.Input component
 */
export interface FieldInputProps {
  /** Input element to render */
  children: React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the input element */
  className?: string;
  /** Description text to display below the input */
  description?: React.ReactNode;
}

/**
 * Render props for Field.Error component
 */
export interface FieldErrorRenderProps {
  /** The error type */
  type: FormError['errorType'];
  /** The error message */
  message: string;
}

/**
 * Props for Field.Error component
 */
export interface FieldErrorProps {
  /** Error message content to display, or a render function that receives error details */
  children:
    | React.ReactNode
    | AsChildChildren<{ type: FormError['errorType']; message: string }>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the error element */
  className?: string;
  /** The path of the error */
  path?: string;
}

/**
 * Container component for a form field with grid layout support.
 * Provides context to Field.Label, Field.InputWrapper, Field.Input, and Field.Error child components.
 * Based on the default-field-layout functionality.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormFields() {
 *   return (
 *     <Form.Field id="username">
 *       <Form.Field.Label>
 *         <label className="text-foreground font-paragraph">Username</label>
 *       </Form.Field.Label>
 *       <Form.Field.InputWrapper>
 *         <Form.Field.Input description={<span className="text-secondary-foreground">Required</span>}>
 *           <input className="bg-background border-foreground text-foreground" />
 *         </Form.Field.Input>
 *         <Form.Field.Error>
 *           <span className="text-destructive text-sm font-paragraph">Username is required</span>
 *         </Form.Field.Error>
 *       </Form.Field.InputWrapper>
 *     </Form.Field>
 *   );
 * }
 * ```
 */
const FieldRoot = React.forwardRef<HTMLDivElement, FieldProps>((props, ref) => {
  const { id, children, asChild, className, ...otherProps } = props;

  const layout = useFieldLayout(id);

  if (!layout) {
    return null;
  }

  return (
    <CoreField id={id} layout={layout}>
      {(fieldData) => {
        const contextValue: FieldContextValue = {
          id,
          layout: fieldData.layout,
          gridStyles: fieldData.gridStyles,
        };

        return (
          <FieldContext.Provider value={contextValue}>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.fieldRoot}
              customElement={children}
              customElementProps={{}}
              {...otherProps}
            >
              {children}
            </AsChildSlot>
          </FieldContext.Provider>
        );
      }}
    </CoreField>
  );
});

FieldRoot.displayName = 'Form.Field';

/**
 * Label component for a form field with automatic grid positioning.
 * Must be used within a Form.Field component.
 * Renders in the label row of the field's grid layout.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * <Form.Field id="email">
 *   <Form.Field.Label>
 *     <label className="text-foreground font-paragraph">Email Address</label>
 *   </Form.Field.Label>
 *   <Form.Field.InputWrapper>
 *     <Form.Field.Input>
 *       <input type="email" className="bg-background border-foreground text-foreground" />
 *     </Form.Field.Input>
 *   </Form.Field.InputWrapper>
 * </Form.Field>
 * ```
 */
export const FieldLabel = React.forwardRef<HTMLDivElement, FieldLabelProps>(
  (props, ref) => {
    const { children, asChild, className, ...otherProps } = props;
    const { gridStyles } = useFieldContext();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        style={gridStyles.label}
        data-testid={TestIds.fieldLabel}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    );
  },
);

FieldLabel.displayName = 'Form.Field.Label';

/**
 * InputWrapper component that wraps input and error elements with grid positioning.
 * Must be used within a Form.Field component.
 * This wrapper applies the grid positioning styles to contain both the input and error.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * <Form.Field id="email">
 *   <Form.Field.Label>
 *     <label className="text-foreground font-paragraph">Email Address</label>
 *   </Form.Field.Label>
 *   <Form.Field.InputWrapper>
 *     <Form.Field.Input>
 *       <input type="email" className="bg-background border-foreground text-foreground" />
 *     </Form.Field.Input>
 *     <Form.Field.Error>
 *       <span className="text-destructive text-sm font-paragraph">Please enter a valid email</span>
 *     </Form.Field.Error>
 *   </Form.Field.InputWrapper>
 * </Form.Field>
 * ```
 */
export const FieldInputWrapper = React.forwardRef<
  HTMLDivElement,
  FieldInputWrapperProps
>((props, ref) => {
  const { children, asChild, className, ...otherProps } = props;
  const { gridStyles } = useFieldContext();

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      style={gridStyles.input}
      data-testid={TestIds.fieldInputWrapper}
      customElement={children}
      customElementProps={{}}
      {...otherProps}
    >
      <div>{children}</div>
    </AsChildSlot>
  );
});

FieldInputWrapper.displayName = 'Form.Field.InputWrapper';

/**
 * Input component for a form field.
 * Must be used within a Form.Field.InputWrapper component.
 * Renders the actual input element without grid positioning.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * <Form.Field id="password">
 *   <Form.Field.Label>
 *     <label className="text-foreground font-paragraph">Password</label>
 *   </Form.Field.Label>
 *   <Form.Field.InputWrapper>
 *     <Form.Field.Input description={<span className="text-secondary-foreground">Min 8 characters</span>}>
 *       <input type="password" className="bg-background border-foreground text-foreground" />
 *     </Form.Field.Input>
 *   </Form.Field.InputWrapper>
 * </Form.Field>
 * ```
 */
export const FieldInput = React.forwardRef<HTMLDivElement, FieldInputProps>(
  (props, ref) => {
    const { children, description, asChild, className, ...otherProps } = props;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.fieldInput}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    );
  },
);

FieldInput.displayName = 'Form.Field.Input';

/**
 * Error component for displaying field-level validation errors.
 * Must be used within a Form.Field.InputWrapper component.
 * Only renders when there is an error for the current field.
 *
 * @component
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * <Form.Field id="email">
 *   <Form.Field.Label>
 *     <label className="text-foreground font-paragraph">Email Address</label>
 *   </Form.Field.Label>
 *   <Form.Field.InputWrapper>
 *     <Form.Field.Input>
 *       <input type="email" className="bg-background border-foreground text-foreground" />
 *     </Form.Field.Input>
 *     <Form.Field.Error path="email">
 *       <span className="text-destructive text-sm font-paragraph">Please enter a valid email address</span>
 *     </Form.Field.Error>
 *   </Form.Field.InputWrapper>
 * </Form.Field>
 * ```
 */
export const FieldError = React.forwardRef<HTMLDivElement, FieldErrorProps>(
  (props, ref) => {
    const { children, asChild, className, ...otherProps } = props;

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.fieldError}
        customElement={children}
        {...otherProps}
      >
        {children}
      </AsChildSlot>
    );
  },
);

FieldError.displayName = 'Form.Field.Error';

export const Field = FieldRoot as FieldComponent;
Field.Label = FieldLabel;
Field.InputWrapper = FieldInputWrapper;
Field.Input = FieldInput;
Field.Error = FieldError;
