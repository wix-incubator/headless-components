import React, { useCallback, useState } from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import {
  Form as FormViewer,
  type FormValues,
  type FormError,
} from '@wix/form-public';
import {
  FormServiceDefinition,
  type FormServiceConfig,
} from '../services/form-service';
import * as CoreForm from './core/Form';

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
  className?: string;
}

/**
 * Root component that provides all necessary service contexts for a complete form experience.
 * This component sets up the Form service and provides context to child components.
 * Must be used as the top-level component for all form functionality.
 *
 * @order 1
 * @component
 * @param {RootProps} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to form context
 * @param {forms.Form} props.form - Form object
 * @param {string} [props.className] - CSS classes to apply to the root element
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
 * function FormPage({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading>
 *         {() => (
 *           <div className="flex justify-center p-4">
 *             <div>Loading form...</div>
 *           </div>
 *         )}
 *       </Form.Loading>
 *       <Form.LoadingError>
 *         {({ error }) => (
 *           <div className="bg-background border-foreground text-foreground px-4 py-3 rounded mb-4">
 *             {error}
 *           </div>
 *         )}
 *       </Form.LoadingError>
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, formServiceConfig, className } = props;

    return (
      <CoreForm.Root formServiceConfig={formServiceConfig}>
        <RootContent
          children={children as any}
          className={className}
          ref={ref}
        />
      </CoreForm.Root>
    );
  },
);

/**
 * Internal component to handle the Root content with service access
 */
const RootContent = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>((props, ref) => {
  const { children, className } = props;

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
});

/**
 * Props for Form Loading component
 */
export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Loading component
 */
export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the form is currently loading.
 *
 * @component
 * @param {LoadingProps} props - Component props
 * @param {LoadingProps['children']} props.children - Content to display during loading (can be a render function or ReactNode)
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormLoading() {
 *   return (
 *     <Form.Loading>
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading form...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </Form.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps) {
  return (
    <CoreForm.Loading>
      {({ isLoading }) => {
        if (isLoading) {
          return typeof props.children === 'function'
            ? props.children({})
            : props.children;
        }

        return null;
      }}
    </CoreForm.Loading>
  );
}

/**
 * Props for Form LoadingError component
 */
export interface LoadingErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display during error state (can be a render function or ReactNode) */
  children?: AsChildChildren<LoadingErrorRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Render props for LoadingError component
 */
export interface LoadingErrorRenderProps {
  /** Error message */
  error: string | null;
  /** Whether there's an error */
  hasError: boolean;
}

/**
 * Component that renders content when there's an error loading the form.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @param {LoadingErrorProps} props - Component props
 * @param {LoadingErrorProps['children']} props.children - Content to display during error state (can be a render function or ReactNode)
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormLoadingError() {
 *   return (
 *     <Form.LoadingError>
 *       {({ error, hasError }) => (
 *         <div className="error-state">
 *           <h3>Error loading form</h3>
 *           <p>{error}</p>
 *         </div>
 *       )}
 *     </Form.LoadingError>
 *   );
 * }
 *
 * // With asChild
 * function CustomLoadingError() {
 *   return (
 *     <Form.LoadingError asChild>
 *       {React.forwardRef(({ error, hasError }, ref) => (
 *         <div ref={ref} className="custom-error">
 *           <h3>Custom Error Display</h3>
 *           <p>{error}</p>
 *         </div>
 *       ))}
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
  /** Content to display during submit error state (can be a render function or ReactNode) */
  children?: AsChildChildren<ErrorRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Render props for Error component
 */
export interface ErrorRenderProps {
  /** Error message */
  error: string | null;
  /** Whether there's an error */
  hasError: boolean;
}

/**
 * Component that renders content when there's an error during form submission.
 * Only displays its children when a submission error has occurred.
 * Provides error data to custom render functions.
 *
 * @component
 * @param {ErrorProps} props - Component props
 * @param {ErrorProps['asChild']} props.asChild - Whether to render as a child component
 * @param {ErrorProps['children']} props.children - Content to display during submit error state (can be a render function or ReactNode)
 * @param {ErrorProps['className']} props.className - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage
 * <Form.Error className="error-message" />
 *
 * // Custom rendering with forwardRef
 * <Form.Error asChild>
 *   {React.forwardRef(({ error, hasError }, ref) => (
 *     <div
 *       ref={ref}
 *       className="custom-error-container"
 *     >
 *       <h3>Submission Failed</h3>
 *       <p>{error}</p>
 *     </div>
 *   ))}
 * </Form.Error>
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
            <div className="text-status-error text-sm sm:text-base">
              {error}
            </div>
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
  /** Content to display after successful submission (can be a render function or ReactNode) */
  children?: AsChildChildren<SubmittedRenderProps>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Render props for Submitted component
 */
export interface SubmittedRenderProps {
  /** Whether the form has been submitted */
  isSubmitted: boolean;
}

/**
 * Component that renders content after successful form submission.
 * Only displays its children when the form has been successfully submitted.
 * Provides submission data to custom render functions.
 *
 * @component
 * @param {SubmittedProps} props - Component props
 * @param {SubmittedProps['asChild']} props.asChild - Whether to render as a child component
 * @param {SubmittedProps['children']} props.children - Content to display after successful submission (can be a render function or ReactNode)
 * @param {SubmittedProps['className']} props.className - CSS classes to apply to the default element
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * // Default usage
 * <Form.Submitted className="success-message" />
 *
 * // Custom rendering with forwardRef
 * <Form.Submitted asChild>
 *   {React.forwardRef(({ isSubmitted }, ref) => (
 *     <div
 *       ref={ref}
 *       className="custom-success-container"
 *     >
 *       <h2>Thank You!</h2>
 *       <p>Your form has been submitted successfully.</p>
 *     </div>
 *   ))}
 * </Form.Submitted>
 * ```
 */
export const Submitted = React.forwardRef<HTMLElement, SubmittedProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreForm.Submitted>
        {({ isSubmitted }) => {
          if (!isSubmitted) return null;

          const submittedData = { isSubmitted };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.formSubmitted}
              customElement={children}
              customElementProps={submittedData}
              content="Form submitted successfully"
              {...otherProps}
            >
              <div className="text-green-500 text-sm sm:text-base">
                Form submitted successfully
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
 *
 * @property {FieldMap} fieldMap - A mapping of field types to their corresponding React components
 *
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
 *       <Form.Loading>
 *         {() => (
 *           <div className="flex justify-center p-4">
 *             <div>Loading form...</div>
 *           </div>
 *         )}
 *       </Form.Loading>
 *       <Form.LoadingError>
 *         {({ error }) => (
 *           <div className="bg-background border-foreground text-foreground px-4 py-3 rounded mb-4">
 *             {error}
 *           </div>
 *         )}
 *       </Form.LoadingError>
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */

export const Fields = React.forwardRef<HTMLElement, FieldsProps>(
  ({ fieldMap }) => {
    const formService = useService(FormServiceDefinition);
    const form = formService.form.get();
    const _form = {
      ...form,
      id: form._id,
      // @ts-ignore
      fields: form.fields.map((field) => ({ ...field, id: field._id })),
    };

    const [formValues, setFormValues] = useState<FormValues>({});
    const [formErrors, setFormErrors] = useState<FormError[]>([]);

    const handleFormChange = useCallback((values: FormValues) => {
      setFormValues(values);
    }, []);

    const handleFormValidate = useCallback((errors: FormError[]) => {
      setFormErrors(errors);
    }, []);

    return (
      <FormViewer
        // @ts-ignore
        form={_form}
        values={formValues}
        onChange={handleFormChange}
        errors={formErrors}
        onValidate={handleFormValidate}
        fields={fieldMap}
      />
    );
  },
);

/**
 * Main Form namespace containing all form components
 * following the compound component pattern: Form.Root, Form.Loading, Form.LoadingError, Form.Error, Form.Submitted, Form.Fields
 *
 * @namespace Form
 * @property {typeof Root} Root - Form root component that provides service context
 * @property {typeof Loading} Loading - Form loading state component
 * @property {typeof LoadingError} LoadingError - Form loading error state component
 * @property {typeof Error} Error - Form submit error state component
 * @property {typeof Submitted} Submitted - Form submitted state component
 * @property {typeof Fields} Fields - Form fields component for rendering form fields
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 *
 * function MyForm({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading>
 *         {() => <div>Loading form...</div>}
 *       </Form.Loading>
 *       <Form.LoadingError>
 *         {({ error }) => <div>Error: {error}</div>}
 *       </Form.LoadingError>
 *       <Form.Error className="submit-error" />
 *       <Form.Submitted className="success-message" />
 *       <Form.Fields fieldMap={FIELD_MAP} />
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

// export const Container = React.forwardRef<HTMLElement, ContainerProps>(
//   (props) => {
//     const { formId, fieldMap } = props;

//     // console.log('formId', formId);
//     // console.log('fieldMap', fieldMap);

//     const formService = useService(FormServiceDefinition);
//     const form = formService.form.get();

//     // console.log('form', form);
//     // console.log('LAYOUT', form.steps?.[0]?.layout?.large?.items);
//     // console.log('VIEW', form.fields?.[1]?.view);
//     // console.log('VALIDATION', form.fields?.[1]?.validation);

//     // console.log('fields', form.formFields);

//     const _form = {
//       ...form,
//       id: form._id,
//       // @ts-ignore
//       fields: form.fields.map((field) => ({ ...field, id: field._id })),
//     };

//     const [formValues, setFormValues] = useState<FormValues>({});
//     const [formErrors, setFormErrors] = useState<FormError[]>([]);

//     const handleFormChange = useCallback((values: FormValues) => {
//       setFormValues(values);
//     }, []);

//     const handleFormValidate = useCallback((errors: FormError[]) => {
//       setFormErrors(errors);
//     }, []);

//     // TODO: render viewer
//     return (
//       <>
//         <div>Hello Hello Hello</div>
//         <Form
//           // @ts-ignore
//           form={_form}
//           formId={formId || ''}
//           values={formValues}
//           onChange={handleFormChange}
//           errors={formErrors}
//           onValidate={handleFormValidate}
//           //@ts-ignore
//           fields={fieldMap}
//           siteConfig={{ locale: { languageCode: 'en-US' } }}
//         />
//       </>
//     );
//   },
// );
