import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  OnlineProgramsGetProgramServiceDefinition,
  OnlineProgramsGetProgramService,
  OnlineProgramsGetProgramServiceConfig,
} from '../../services/online-programs-get-program-service.js';

export interface RootProps {
  children: React.ReactNode;
  programServiceConfig: OnlineProgramsGetProgramServiceConfig;
}

export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        OnlineProgramsGetProgramServiceDefinition,
        OnlineProgramsGetProgramService,
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
 *     <Product.Name>
 *       {({ name }) => (
 *         <h1>{name}</h1>
 *       )}
 *     </Product.Name>
 *   );
 * }
 * ```
 */
export function Title(props: ProgramTitleProps) {
  const service = useService(OnlineProgramsGetProgramServiceDefinition) as ServiceAPI<
    typeof OnlineProgramsGetProgramServiceDefinition
  >;

  const program = service.program.get() as any; // TODO: replace with Program type
  const title = program.config.program.description.title;

  return props.children({
    title,
  });
}
