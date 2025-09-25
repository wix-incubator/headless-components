import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { forms } from '@wix/forms';

import {
  FormServiceDefinition,
  FormServiceConfig,
  FormService,
} from '../../services/form-service.js';

const DEFAULT_SUCCESS_MESSAGE = 'Your form has been submitted successfully.';

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
 * @param {React.ReactNode} children - Child components that will have access to form context
 * @param {FormServiceConfig} formServiceConfig - Configuration object containing form data
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

export type FormRenderProps =
  | { isLoading: true; error: null; form: null }
  | { isLoading: false; error: null; form: forms.Form }
  | { isLoading: false; error: string; form: null };

interface FormProps {
  children: (props: FormRenderProps) => React.ReactNode;
}

export function Form({ children }: FormProps) {
  const { formSignal, isLoadingSignal, errorSignal } = useService(
    FormServiceDefinition,
  );

  const isLoading = isLoadingSignal.get();
  const error = errorSignal.get();
  console.log('Form core:', isLoading, error, formSignal.get());
  if (isLoading) {
    return children({ isLoading: true, error: null, form: null });
  } else if (error) {
    return children({ isLoading: false, error, form: null });
  } else {
    const form = formSignal.get()!;
    return children({ isLoading: false, error: null, form });
  }
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
  // TODO: Implement submit response handling when submitResponseSignal is added to service
  const error = null;
  const hasError = false;

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
  // TODO: Implement submit response handling when submitResponseSignal is added to service
  const isSubmitted = false;
  const message = DEFAULT_SUCCESS_MESSAGE;

  return props.children({
    isSubmitted,
    message,
  });
}

interface FieldsRenderProps {
  form: forms.Form | null;
}

interface FieldsProps {
  children: (props: FieldsRenderProps) => React.ReactNode;
}

export function Fields(props: FieldsProps) {
  const { formSignal } = useService(FormServiceDefinition);
  const form = formSignal.get();

  return props.children({
    form,
  });
}
