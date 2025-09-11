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
  InstructorsServiceDefinition,
  InstructorsService,
} from '@wix/headless-online-programs/services';
import type { ProgramServiceConfig, InstructorsServiceConfig } from '@wix/headless-online-programs/services';

interface OnlineProgramPageProps {
  programServiceConfig: ProgramServiceConfig;
  instructorsServiceConfig?: InstructorsServiceConfig;
}

export default function OnlineProgramPage({
  programServiceConfig,
  instructorsServiceConfig,
}: OnlineProgramPageProps) {
  const [servicesManager] = useState(() => {
    const servicesMap = createServicesMap()
      .addService(
        ProgramServiceDefinition,
        ProgramService,
        programServiceConfig,
      );

    // Add instructors service if config is provided
    if (instructorsServiceConfig) {
      servicesMap.addService(
        InstructorsServiceDefinition,
        InstructorsService,
        instructorsServiceConfig,
      );
    }

    return createServicesManager(servicesMap);
  });

  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <Program.Root program={programServiceConfig.program!}>
        <Program.Title />
        <Program.Description />
        <Program.Duration asChild>
          {({ durationInDays, isSelfPaced }) => (
            <div>
              {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
            </div>
          )}
        </Program.Duration>

        <h3>Instructors:</h3>
        <Program.Instructors instructors={instructorsServiceConfig?.instructors}>
          <Program.Instructors.InstructorRepeater>
            <Program.Instructor>
              <Program.Instructor.Name className="font-semibold" />
            </Program.Instructor>
          </Program.Instructors.InstructorRepeater>
        </Program.Instructors>

        <Program.Image />
      </Program.Root>
    </ServicesManagerProvider>
  );
}
