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

// TODO: Add example
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
