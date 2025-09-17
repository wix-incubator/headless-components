import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';

import {
  ProgramListService,
  ProgramListServiceConfig,
  ProgramListServiceDefinition,
} from '../../services/program-list-service.js';

/**
 * Props for Root headless component
 */
export interface RootProps {
  children: React.ReactNode;
  programListConfig: ProgramListServiceConfig;
}

/**
 * Root component that provides ProgramList service to its children.
 * This component sets up the necessary service for managing program list.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProgramList } from '@wix/stores/components';
 *
 * function ProgramListPage(props) {
 *  const { programs } = props;
 *
 *  return (
 *    <ProgramList.Root programListConfig={{ programs }}>
 *      <ProgramList.Programs>
 *        <ProgramList.ProgramRepeater>
 *          <Program.Title />
 *          <Program.Description />
 *        </ProgramList.ProgramRepeater>
 *      </ProgramList.Programs>
 *    </ProgramList.Root>
 *  );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProgramListServiceDefinition,
        ProgramListService,
        props.programListConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}
