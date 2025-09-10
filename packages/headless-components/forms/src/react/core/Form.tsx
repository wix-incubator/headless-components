import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  FormServiceDefinition,
  FormServiceConfig,
  FormService,
} from '../../services/form-service.js';
import { createServicesMap } from '@wix/services-manager';

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
 *
 * function FormPage() {
 *   return (
 *     <Form.Root formServiceConfig={{ form: myForm }}>
 *       <Form.Loading>
 *         {({ isLoading }) => isLoading ? <div>Loading form...</div> : null}
 *       </Form.Loading>
 *       <Form.Error>
 *         {({ error, hasError }) => hasError ? <div>{error}</div> : null}
 *       </Form.Error>
 *       <Form.Container fieldMap={FIELD_MAP} />
 *     </Form.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        FormServiceDefinition,
        FormService,
        props.formServiceConfig,
      )}
    >
      {props.children}
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
  const service = useService(FormServiceDefinition) as ServiceAPI<
    typeof FormServiceDefinition
  >;

  const isLoading = service.isLoading?.get() || false;

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
export function Error(props: FormErrorProps) {
  const service = useService(FormServiceDefinition) as ServiceAPI<
    typeof FormServiceDefinition
  >;

  const error = service.error?.get() || null;
  const hasError = !!error;

  return props.children({
    error,
    hasError,
  });
}
