import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  ProgramServiceDefinition,
  ProgramServiceConfig,
  ProgramService,
} from '../../services/program-service.js';

export interface RootProps {
  children: React.ReactNode;
  programServiceConfig: ProgramServiceConfig;
}

/**
 * Root component that provides the Program service context to its children.
 * This component sets up the necessary services for rendering and managing a single program's data.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramPage() {
 *   return (
 *     <Program.Root programServiceConfig={{ program: myProgram }}>
 *       <div>
 *         <Program.Title>
 *           {({ title }) => (
 *             <h1
 *               className="text-4xl font-bold text-content-primary mb-4"
 *               data-testid="program-title"
 *             >
 *               {title}
 *             </h1>
 *           )}
 *         </Program.Title>
 *       </div>
 *     </Program.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProgramServiceDefinition,
        ProgramService,
        props.programServiceConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for ProgramTitle headless component
 */
export interface ProgramTitleProps {
  /** Render prop function that receives program title data */
  children: (props: ProgramTitleRenderProps) => React.ReactNode;
}

/**
 * Render props for ProgramTitle component
 */
export interface ProgramTitleRenderProps {
  /** Program title */
  title: string;
}

/**
 * Headless component for program title display
 *
 * @component
 * @example
 * ```tsx
 * import { Program } from '@wix/online-programs/components';
 *
 * function ProgramHeader() {
 *   return (
 *     <Program.Title>
 *       {({ title }) => (
 *         <h1>{title}</h1>
 *       )}
 *     </Program.Title>
 *   );
 * }
 * ```
 */
export function Title(props: ProgramTitleProps) {
  const service = useService(ProgramServiceDefinition) as ServiceAPI<
    typeof ProgramServiceDefinition
  >;

  const program = service.program.get();
  const title = program.description?.title || '';

  return props.children({
    title,
  });
}
