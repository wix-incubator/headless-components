import * as Tabs from '@radix-ui/react-tabs';
import {
  Program,
  ProgramList,
  CategoryList,
  Category,
} from '@wix/headless-online-programs/react';
import {
  type CategoryListServiceConfig,
  type ProgramListServiceConfig,
} from '@wix/headless-online-programs/services';

interface ProgramsPageProps {
  programListServiceConfig: ProgramListServiceConfig;
  categoryListServiceConfig: CategoryListServiceConfig;
}

function ProgramsPage(props: ProgramsPageProps) {
  const { programListServiceConfig, categoryListServiceConfig } = props;

  return (
    <Tabs.Root defaultValue="all">
      <Tabs.List>
        <Tabs.Trigger value="all">All programs</Tabs.Trigger>

        <CategoryList.Root categoryListConfig={categoryListServiceConfig}>
          <CategoryList.CategoryRepeater>
            <Category.Id asChild>
              {({ id }) => (
                <Tabs.Trigger value={id}>
                  <Category.Label />
                </Tabs.Trigger>
              )}
            </Category.Id>
          </CategoryList.CategoryRepeater>
        </CategoryList.Root>
      </Tabs.List>

      <Tabs.Content value="all">
        <ProgramList.Root programListConfig={programListServiceConfig}>
          <ProgramList.Programs>
            <ProgramList.ProgramRepeater>
              <Program.Title />
              <Program.Description />
            </ProgramList.ProgramRepeater>
          </ProgramList.Programs>
        </ProgramList.Root>
      </Tabs.Content>

      <CategoryList.Root categoryListConfig={categoryListServiceConfig}>
        <CategoryList.Categories>
          <CategoryList.CategoryRepeater>
            <Category.Id asChild>
              {({ id }) => (
                <Tabs.Content value={id}>
                  <ProgramList.Root
                    programListConfig={{
                      programs: programListServiceConfig.programs.filter(
                        (program) => program.categoryIds?.includes(id),
                      ),
                    }}
                  >
                    <ProgramList.Programs>
                      <ProgramList.ProgramRepeater>
                        <Program.Title />
                        <Program.Description />
                      </ProgramList.ProgramRepeater>
                    </ProgramList.Programs>
                  </ProgramList.Root>
                </Tabs.Content>
              )}
            </Category.Id>
          </CategoryList.CategoryRepeater>
        </CategoryList.Categories>
      </CategoryList.Root>
    </Tabs.Root>
  );
}

export default ProgramsPage;
