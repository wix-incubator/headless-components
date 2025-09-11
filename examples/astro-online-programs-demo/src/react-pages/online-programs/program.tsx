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

interface OnlineProgramPageProps {
  programServiceConfig: ProgramServiceConfig;
}

export default function OnlineProgramPage({
  programServiceConfig,
}: OnlineProgramPageProps) {
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
        <Program.Duration asChild>
          {({ durationInDays, isSelfPaced }) => (
            <div>
              {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
            </div>
          )}
        </Program.Duration>
        <Program.Image />
      </Program.Root>
    </ServicesManagerProvider>
  );
}
