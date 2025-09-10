import { WixServices } from '@wix/services-manager-react';
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
 * @example
 * ```tsx
 * import { Form } from '@wix/headless-forms/react';
 *
 * function FormPage() {
 *   return (
 *     <Form.Root formServiceConfig={{ form: myForm }}>
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




