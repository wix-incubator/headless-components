import { useState } from 'react';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import * as Program from '@wix/headless-online-programs/react';
import {
  ProgramServiceDefinition,
  ProgramService,
} from '@wix/headless-online-programs/services';
import type { ProgramServiceConfig } from '@wix/headless-online-programs/services';

interface OnlineProgramsPageProps {
  programServiceConfig: ProgramServiceConfig;
}

export default function OnlineProgramsPage({
  programServiceConfig,
}: OnlineProgramsPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap().addService(
        ProgramServiceDefinition,
        ProgramService,
        programServiceConfig,
      ),
    ),
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Program.Root program={programServiceConfig.program!}>
        <Program.Title />
      </Program.Root>
    </ServicesManagerProvider>
  );
}
