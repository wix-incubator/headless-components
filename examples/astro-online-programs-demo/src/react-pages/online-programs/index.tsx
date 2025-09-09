import { useState } from 'react';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import * as Program from '@wix/headless-online-programs/react';
import {
  OnlineProgramsGetProgramServiceDefinition,
  OnlineProgramsGetProgramService,
} from '@wix/headless-online-programs/services';
import type { OnlineProgramsGetProgramServiceConfig } from '@wix/headless-online-programs/services';

interface OnlineProgramsPageProps {
  onlineProgramsGetProgramServiceConfig: OnlineProgramsGetProgramServiceConfig;
}

export default function OnlineProgramsPage({ onlineProgramsGetProgramServiceConfig }: OnlineProgramsPageProps) {
  const [servicesManager] = useState(() =>
    createServicesManager(
      createServicesMap()
        .addService(
          OnlineProgramsGetProgramServiceDefinition,
          OnlineProgramsGetProgramService,
          onlineProgramsGetProgramServiceConfig,
        )
    ),
  );

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Program.Root program={onlineProgramsGetProgramServiceConfig}>
        <Program.Title />
      </Program.Root>
      {/* <Program.Root program={onlineProgramsGetProgramServiceConfig}>
        <Program.Title />
      </Program.Root> */}
    </ServicesManagerProvider>
  );
}

