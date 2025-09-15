import { Program, Instructor } from '@wix/headless-online-programs/react';
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

      <h3>Steps</h3>
      <Program.StepCount asChild>
        {({ stepCount }: { stepCount: number }) => (
          <div>{stepCount} Steps</div>
        )}
      </Program.StepCount>

      <h3>Steps (Default)</h3>
      <Program.StepCount />

      <h3>Sections</h3>
      <Program.SectionCount asChild>
        {({ sectionCount }: { sectionCount: number }) => (
          <div>{sectionCount} Sections</div>
        )}
      </Program.SectionCount>


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
