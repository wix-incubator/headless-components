import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { forms } from '@wix/forms';

import {
  FormServiceDefinition,
  FormServiceConfig,
  FormService,
} from '../../services/form-service.js';
import { FormValues } from '../types.js';

const DEFAULT_SUCCESS_MESSAGE = 'Your form has been submitted successfully.';

/**
 * Props for Root headless component
 */
export interface RootProps {
  children: React.ReactNode;
  formServiceConfig: FormServiceConfig;
}

/**
 * Root component that provides the Form service context to its children.
 * This component sets up the necessary services for rendering and managing form data.
 *
 * @order 1
 * @component
 * @param {RootProps} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to form context
 * @param {FormServiceConfig} props.formServiceConfig - Configuration object containing form data
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 * import { loadFormServiceConfig } from '@wix/headless-forms/services';
 *
 * // Pattern 1: Pre-loaded form data (SSR/SSG)
 * function FormPage({ formServiceConfig }) {
 *   return (
 *     <Form.Root formServiceConfig={formServiceConfig}>
 *       <Form.Loading>
 *         {({ isLoading }) => isLoading ? <div>Loading form...</div> : null}
 *       </Form.Loading>
 *       <Form.LoadingError>
 *         {({ error, hasError }) => hasError ? <div>{error}</div> : null}
 *       </Form.LoadingError>
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 *
 * // Pattern 2: Lazy loading with formId (Client-side)
 * function DynamicFormPage({ formId }) {
 *   return (
 *     <Form.Root formServiceConfig={{ formId }}>
 *       <Form.Loading>
 *         {({ isLoading }) => isLoading ? <div>Loading form...</div> : null}
 *       </Form.Loading>
 *       <Form.LoadingError>
 *         {({ error, hasError }) => hasError ? <div>{error}</div> : null}
 *       </Form.LoadingError>
 *       <Form.Fields fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export function Root({
  formServiceConfig,
  children,
}: RootProps): React.ReactNode {
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
 * Props for FormLoading headless component
 */
export interface FormLoadingProps {
  /** Render prop function that receives loading state data */
  children: (props: FormLoadingRenderProps) => React.ReactNode;
}

/**
 * Render props for FormLoading component
 */
export interface FormLoadingRenderProps {
  /** Whether the form is currently loading */
  isLoading: boolean;
}

/**
 * Headless component for form loading state access
 *
 * @component
 * @param {FormLoadingProps} props - Component props
 * @param {FormLoadingProps['children']} props.children - Render prop function that receives loading state
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormLoadingIndicator() {
 *   return (
 *     <Form.Loading>
 *       {({ isLoading }) => (
 *         isLoading ? (
 *           <div>Loading form...</div>
 *         ) : null
 *       )}
 *     </Form.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: FormLoadingProps) {
  const { isLoadingSignal } = useService(FormServiceDefinition);

  const isLoading = isLoadingSignal.get();

  return props.children({
    isLoading,
  });
}

/**
 * Props for FormError headless component
 */
export interface FormErrorProps {
  /** Render prop function that receives error state data */
  children: (props: FormErrorRenderProps) => React.ReactNode;
}

/**
 * Render props for FormError component
 */
export interface FormErrorRenderProps {
  /** Error message if there's an error */
  error: string | null;
  /** Whether there's an error */
  hasError: boolean;
}

/**
 * Headless component for form error state access
 *
 * @component
 * @param {FormErrorProps} props - Component props
 * @param {FormErrorProps['children']} props.children - Render prop function that receives error state
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormErrorDisplay() {
 *   return (
 *     <Form.LoadingError>
 *       {({ error, hasError }) => (
 *         hasError ? (
 *           <div className="error-message">
 *             {error}
 *           </div>
 *         ) : null
 *       )}
 *     </Form.LoadingError>
 *   );
 * }
 * ```
 */
export function LoadingError(props: FormErrorProps) {
  const { errorSignal } = useService(FormServiceDefinition);

  const error = errorSignal.get();
  const hasError = !!error;

  return props.children({
    error,
    hasError,
  });
}

/**
 * Props for Form Error headless component
 */
export interface FormSubmitErrorProps {
  /** Render prop function that receives submit error state data */
  children: (props: FormSubmitErrorRenderProps) => React.ReactNode;
}

/**
 * Render props for Form Error component
 */
export interface FormSubmitErrorRenderProps {
  /** Submit error message */
  error: string | null;
  /** Whether there's a submit error */
  hasError: boolean;
}

/**
 * Headless component for form submit error state access
 *
 * @component
 * @param {FormSubmitErrorProps} props - Component props
 * @param {FormSubmitErrorProps['children']} props.children - Render prop function that receives submit error state
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormSubmitErrorDisplay() {
 *   return (
 *     <Form.Error>
 *       {({ error, hasError }) => (
 *         hasError ? (
 *           <div className="error-message">
 *             {error}
 *           </div>
 *         ) : null
 *       )}
 *     </Form.Error>
 *   );
 * }
 * ```
 */
export function Error(props: FormSubmitErrorProps) {
  const { submitResponseSignal } = useService(FormServiceDefinition);
  const submitResponse = submitResponseSignal.get();

  const error = submitResponse.type === 'error' ? submitResponse.message : null;
  const hasError = submitResponse.type === 'error';

  return props.children({
    error,
    hasError,
  });
}

/**
 * Props for Form Submitted headless component
 */
export interface FormSubmittedProps {
  /** Render prop function that receives submission state data */
  children: (props: FormSubmittedRenderProps) => React.ReactNode;
}

/**
 * Render props for Form Submitted component
 */
export interface FormSubmittedRenderProps {
  /** Whether the form has been submitted */
  isSubmitted: boolean;
  /** Success message */
  message: string;
}

/**
 * Headless component for form submission state access
 *
 * @component
 * @param {FormSubmittedProps} props - Component props
 * @param {FormSubmittedProps['children']} props.children - Render prop function that receives submission state
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormSubmittedDisplay() {
 *   return (
 *     <Form.Submitted>
 *       {({ isSubmitted, message }) => (
 *         isSubmitted ? (
 *           <div className="success-message">
 *             <h2>Thank You!</h2>
 *             <p>{message}</p>
 *           </div>
 *         ) : null
 *       )}
 *     </Form.Submitted>
 *   );
 * }
 * ```
 */
export function Submitted(props: FormSubmittedProps) {
  const { submitResponseSignal } = useService(FormServiceDefinition);
  const submitResponse = submitResponseSignal.get();

  const isSubmitted = submitResponse.type === 'success';
  const message =
    submitResponse.type === 'success'
      ? submitResponse.message || DEFAULT_SUCCESS_MESSAGE
      : DEFAULT_SUCCESS_MESSAGE;

  return props.children({
    isSubmitted,
    message,
  });
}

/**
 * Render props for Fields component
 */
interface FieldsRenderProps {
  form: forms.Form | null;
  submitForm: (formValues: FormValues) => Promise<void>;
}

/**
 * Props for Fields headless component
 */
interface FieldsProps {
  children: (props: FieldsRenderProps) => React.ReactNode;
}

/**
 * Fields component that provides form data and actions to its children.
 * This component accesses the form data and submitForm action from the service
 * and passes them to children via render props.
 *
 * @component
 * @param {FieldsProps} props - Component props
 * @param {FieldsProps['children']} props.children - Render prop function that receives form data and actions
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormFields() {
 *   return (
 *     <Form.Fields>
 *       {({ form, submitForm }) => (
 *         form ? (
 *           <div>
 *             <h2>{form.name}</h2>
 *             <p>{form.description}</p>
 *             <button onClick={() => submitForm({ field1: 'value' })}>
 *               Submit
 *             </button>
 *           </div>
 *         ) : null
 *       )}
 *     </Form.Fields>
 *   );
 * }
 * ```
 */
export function Fields(props: FieldsProps) {
  const { formSignal, submitForm } = useService(FormServiceDefinition);
  const form = formSignal.get();

  return props.children({
    form,
    submitForm,
  });
}

/**
 * Form view interface containing field definitions
 */
export interface FormView {
  fields: FieldDefinition[];
}

/**
 * Field layout configuration
 */
export interface Layout {
  column: number;
  width: number;
}

/**
 * Field definition including layout information
 */
export interface FieldDefinition {
  id: string;
  layout: Layout;
}

/**
 * Render props for Field component
 */
export interface FieldRenderProps {
  /** The form configuration */
  form: FormView;
  /** The field ID */
  id: string;
  /** The field layout configuration */
  layout: Layout;
  /** Grid styles for container */
  gridStyles: {
    container: React.CSSProperties;
    label: React.CSSProperties;
    input: React.CSSProperties;
  };
}

/**
 * Props for Field headless component
 */
export interface FieldProps {
  /** The unique identifier for this field */
  id: string;
  /** Render prop function that receives field layout data */
  children: (props: FieldRenderProps) => React.ReactNode;
}

/**
 * Calculate grid styles for a field based on its layout configuration
 */
function calculateGridStyles(layout: Layout) {
  const rows = [1, 2];
  const gridRow = `1 / span ${rows.length}`;
  const gridColumn = `${layout.column + 1} / span ${layout.width}`;
  const labelRow = `${rows[0]} / span 1`;
  const inputRow = `${rows[1]} / span 1`;

  return {
    container: { gridRow, gridColumn },
    label: {
      gridRow: labelRow,
      gridColumn,
      display: 'flex',
      alignItems: 'flex-end',
    },
    input: { gridRow: inputRow, gridColumn },
  };
}

/**
 * Headless Field component that provides field layout data and grid styles.
 * This component accesses field configuration and calculates grid positioning.
 *
 * @component
 * @param {FieldProps} props - Component props
 * @param {FieldProps['children']} props.children - Render prop function that receives field layout data
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function CustomField({ id }) {
 *   return (
 *     <Form.Field id={id}>
 *       {({ layout, gridStyles }) => (
 *         <div style={gridStyles.container}>
 *           <div style={gridStyles.label}>Label</div>
 *           <div style={gridStyles.input}>Input</div>
 *         </div>
 *       )}
 *     </Form.Field>
 *   );
 * }
 * ```
 */
export function Field(props: FieldProps) {
  const { id, children } = props;
  const { formSignal } = useService(FormServiceDefinition);
  const form = formSignal.get();
  // TODO: do not use FormView type?
  const formView = form as unknown as FormView;

  if (!formView) {
    return null;
  }

  const fieldView = formView.fields.find((field) => field.id === id);

  if (!fieldView) {
    return null;
  }

  const { layout } = fieldView!;
  const gridStyles = calculateGridStyles(layout);

  return children({
    form: formView,
    id,
    layout,
    gridStyles,
  });
}
