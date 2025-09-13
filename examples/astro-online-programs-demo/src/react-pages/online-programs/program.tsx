import { useState } from 'react';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';
import { ServicesManagerProvider } from '@wix/services-manager-react';
import { Program, Instructor } from '@wix/headless-online-programs/react';
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
        <Program.DurationInDays asChild>
          {({ durationInDays, isSelfPaced }: { durationInDays: number, isSelfPaced: boolean }) => (
            <div>
              {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
            </div>
          )}
        </Program.DurationInDays>

        <h3>Instructors:</h3>
        <ul>
        <Program.Instructors instructors={instructorsServiceConfig?.instructors} emptyState={<li>No instructors</li>}>
          <Program.InstructorRepeater>
            <li>
              <Instructor.Name />
              <Instructor.Description />
            </li>
          </Program.InstructorRepeater>
        </Program.Instructors>
        </ul>
        <Program.Image />
      </Program.Root>
    </ServicesManagerProvider>
  );
}
