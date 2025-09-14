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
  return (
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
            <Instructor.Image />
          </li>
        </Program.InstructorRepeater>
      </Program.Instructors>
      </ul>

      <h3>Price</h3>
      <Program.Price asChild>
        {({ price, formattedPrice }: { price: number; formattedPrice: string }) => (
          <div>{price ? formattedPrice : 'Free'}</div>
        )}
      </Program.Price>
      <Program.Image />
    </Program.Root>
  );
}
