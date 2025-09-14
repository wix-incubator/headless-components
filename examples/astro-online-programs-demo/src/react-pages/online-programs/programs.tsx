import { Program, ProgramList } from '@wix/headless-online-programs/react';
import { type ProgramListServiceConfig } from '@wix/headless-online-programs/services';

interface ProgramsPageProps {
  programListServiceConfig: ProgramListServiceConfig;
}

function ProgramsPage(props: ProgramsPageProps) {
  const { programListServiceConfig } = props;

  return (
    <ProgramList.Root programListConfig={programListServiceConfig}>
      <ProgramList.Programs>
        <ProgramList.ProgramRepeater>
          <Program.Title />
          <Program.Description />
        </ProgramList.ProgramRepeater>
      </ProgramList.Programs>
    </ProgramList.Root>
  );
}

export default ProgramsPage;
