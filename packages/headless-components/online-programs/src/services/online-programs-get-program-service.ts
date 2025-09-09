import { programs } from '@wix/online-programs';

import {
  defineService,
  implementService,
  type ServiceAPI,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

export const OnlineProgramsGetProgramServiceDefinition = defineService<{
  program: Signal<programs.Program>;
}>('OnlineProgramsGetProgramService');

export type OnlineProgramsGetProgramServiceAPIServiceAPI = ServiceAPI<typeof OnlineProgramsGetProgramServiceDefinition>;

export const OnlineProgramsGetProgramService = implementService.withConfig<{
  program: programs.Program;
}>()(OnlineProgramsGetProgramServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const programSignal = signalsService.signal<programs.Program>(config.program);

  return {
    program: programSignal,
  };
});

export type OnlineProgramsGetProgramServiceConfig = ServiceFactoryConfig<
  typeof OnlineProgramsGetProgramService
>;

export type OnlineProgramsGetProgramServiceConfigResult =
  | {
      type: 'success';
      config: OnlineProgramsGetProgramServiceConfig;
    }
  | { type: 'notFound' };

type OnlineProgramsGetProgramServiceConfigParams = {
  programId: string;
};

export async function loadOnlineProgramsGetProgramServiceConfig(
  params: OnlineProgramsGetProgramServiceConfigParams,
): Promise<OnlineProgramsGetProgramServiceConfigResult> {
  const { programId } = params;

  if (!programId) {
    return { type: 'notFound' };
  }

  try {
    const program = await programs.getProgram(programId);

    if (!program) {
      return { type: 'notFound' };
    }

    // const [enhancedPost] = await enhancePosts([post]);

    // if (!enhancedPost) {
    //   return { type: 'notFound' };
    // }

    return {
      type: 'success',
      config: {
        program: program,
      },
    };
  } catch (error) {
    console.error('Failed to load initial program for slug', programId, error);
    return { type: 'notFound' };
  }
}
