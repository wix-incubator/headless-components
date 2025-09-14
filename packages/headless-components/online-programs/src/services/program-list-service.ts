import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { programs } from '@wix/online-programs';

/**
 * Configuration interface for the Program List service.
 * Contains the initial programs data that will be loaded into the service.
 *
 * @interface ProgramListServiceConfig
 */
export type ProgramListServiceConfig = {
  /** Array of program objects to initialize the service with */
  programs: programs.Program[];
};

/**
 * Service definition for the Categories List service.
 * This defines the reactive API contract for managing a list of programs.
 *
 * @constant
 */
export const ProgramListServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of programs */
    programs: Signal<programs.Program[]>;
    /** Reactive signal indicating if programs are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
  },
  ProgramListServiceConfig
>('program-list');

// TODO: Add example
export const ProgramListService =
  implementService.withConfig<ProgramListServiceConfig>()(
    ProgramListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const programsSignal = signalsService.signal<programs.Program[]>(
        config.programs,
      );
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      return {
        programs: programsSignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    },
  );

// TODO: Add example
export async function loadProgramListServiceConfig(): Promise<ProgramListServiceConfig> {
  // TODO: E data fetching approach
  const programsResponse = await programs.searchPrograms({});

  const fetchedPrograms = programsResponse.programs || [];

  return {
    programs: fetchedPrograms,
  };
}
