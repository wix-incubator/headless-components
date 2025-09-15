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
 * Service definition for the Program List service.
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

/**
 * Implementation of the Program List service that manages reactive programs data.
 * This service provides signals for programs data, loading state, and error handling.
 *
 * @example
 * ```tsx
 * import { ProgramListService, ProgramListServiceDefinition } from '@wix/online-programs/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ProgramsComponent({ programListConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProgramListServiceDefinition, ProgramListService.withConfig(programListConfig)]
 *     ])}>
 *       <ProgramsDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ProgramsDisplay() {
 *   const programListService = useService(ProgramListServiceDefinition);
 *
 *   const programs = programListService.programs.get();
 *   const isLoading = programListService.isLoading.get();
 *   const error = programListService.error.get();
 *
 *   if (isLoading) {
 *     return <div>Loading programs...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error}</div>;
 *   }
 *
 *   return (
 *     <div>
 *       {programs.map(program => (
 *         <div key={program._id}>
 *           <h3>{program.description?.title || 'No title'}</h3>
 *           <p>{program.description?.details || 'No details'}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
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

/**
 * Loads program list service configuration from the Wix Programs API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * all visible programs.
 *
 * @returns {Promise<ProgramListServiceConfig>} Promise that resolves to the program list configuration
 *
 * @example
 * ```astro
 * ---
 * import { loadProgramListServiceConfig } from '@wix/stores/services';
 * import { ProgramList } from '@wix/stores/components/react';
 *
 * // Load categories data during SSR
 * const programListConfig = await loadProgramListServiceConfig();
 * ---
 *
 * <ProgramList.Root programListConfig={programListConfig}>
 *   <ProgramList.Programs>
 *     <ProgramList.ProgramRepeater>
 *       <Program.Title />
 *       <Program.Description />
 *     </ProgramList.ProgramRepeater>
 *   </ProgramList.Programs>
 * </ProgramList.Root>
 * ```
 */
export async function loadProgramListServiceConfig(): Promise<ProgramListServiceConfig> {
  try {
    // TODO: Improve data fetching approach
    const programsResponse = await programs.searchPrograms({});

    const fetchedPrograms = programsResponse.programs || [];

    return {
      programs: fetchedPrograms,
    };
  } catch (_) {
    return {
      programs: [],
    };
  }
}
