import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { programs } from '@wix/online-programs';

/**
 * API interface for the Program service, providing reactive program data management.
 * This service handles loading and managing a single program's data, loading state, and errors.
 *
 * @interface ProgramServiceAPI
 */
export interface ProgramServiceAPI {
  /** Reactive signal containing the current program data */
  program: Signal<programs.Program>;
  /** Reactive signal indicating if a program is currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to load a program by its ID */
  loadProgram: (id: string) => Promise<void>;
}

/**
 * Service definition for the Program service.
 * This defines the contract that the ProgramService must implement.
 *
 * @constant
 */
export const ProgramServiceDefinition =
  defineService<ProgramServiceAPI>('program');

/**
 * Configuration interface required to initialize the ProgramService.
 * Contains the initial program data that will be loaded into the service.
 *
 * @interface ProgramServiceConfig
 */
export interface ProgramServiceConfig {
  /** The initial program data to configure the service with */
  program?: programs.Program;

  /** The ID of the program to load */
  programId?: string;
}

/**
 * Implementation of the Program service that manages reactive program data.
 * This service provides signals for program data, loading state, and error handling,
 * along with methods to dynamically load programs.
 *
 * @example
 * ```tsx
 * import { ProgramService, ProgramServiceDefinition } from '@wix/online-programs/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ProgramComponent({ programConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProgramServiceDefinition, ProgramService.withConfig(programConfig)]
 *     ])}>
 *       <ProgramDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ProgramDisplay() {
 *   const programService = useService(ProgramServiceDefinition);
 *
 *   const program = programService.program.get();
 *   const isLoading = programService.isLoading.get();
 *   const error = programService.error.get();
 *
 *   if (isLoading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error}</div>;
 *   }
 *
 *   return <h1>{program.name}</h1>;
 * }
 * ```
 */
export const ProgramService =
  implementService.withConfig<ProgramServiceConfig>()(
    ProgramServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const program: Signal<programs.Program> = signalsService.signal(
        config.program!,
      );
      const isLoading: Signal<boolean> = signalsService.signal(
        !!config.programId,
      );
      const error: Signal<string | null> = signalsService.signal(null as any);

      const loadProgram = async (id: string) => {
        isLoading.set(true);
        const programResponse = await getProgramById(id!);

        if (!programResponse) {
          error.set('Program not found');
        } else {
          program.set(programResponse);
          error.set(null);
        }

        isLoading.set(false);
      };

      if (config.programId) {
        loadProgram(config.programId);
      }

      return {
        program,
        isLoading,
        error,
        loadProgram,
      };
    },
  );

/**
 * Success result interface for program service configuration loading.
 * Returned when a program is successfully found and loaded.
 *
 * @interface SuccessProgramServiceConfigResult
 */
export interface SuccessProgramServiceConfigResult {
  /** Type "success" means that the program was found and the config is valid */
  type: 'success';
  /** The program config containing the loaded program data */
  config: ProgramServiceConfig;
}

/**
 * Not found result interface for program service configuration loading.
 * Returned when a program with the given ID cannot be found.
 *
 * @interface NotFoundProgramServiceConfigResult
 */
export interface NotFoundProgramServiceConfigResult {
  /** Type "notFound" means that the program was not found */
  type: 'notFound';
}

/**
 * Internal helper function to load a program by it's ID from the Wix Programs API.
 * Fetches comprehensive program data including title, description, etc.
 *
 * @private
 * @param {string} id - The program ID to load
 * @returns {Promise} Program response from the API
 */
const getProgramById = async (id: string) => {
  const programResponse = await programs.getProgram(id);

  return programResponse;
};

/**
 * Loads program service configuration from the Wix Programs API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific program by ID that will be used to configure the ProgramService.
 *
 * @param programId The program ID to load
 * @returns Promise that resolves to ProgramServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/program/[id].astro
 * import { loadProgramServiceConfig } from '@wix/online-programs/services';
 * import { Program } from '@wix/online-programs/components';
 *
 * // Get program ID from URL params
 * const { id } = Astro.params;
 *
 * // Load program data during SSR
 * const programServiceConfigResult = await loadProgramServiceConfig(id);
 *
 * // Handle not found case
 * if (programServiceConfigResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Program.Root program={programServiceConfigResult.config.program!}>
 *   <Program.Title asChild>
 *     {({ title }) => <h1>{title}</h1>}
 *   </Program.Title>
 * </Program.Root>
 * ```
 */
export async function loadProgramServiceConfig(
  programId: string,
): Promise<
  SuccessProgramServiceConfigResult | NotFoundProgramServiceConfigResult
> {
  try {
    const programResponse = await getProgramById(programId);

    if (!programResponse) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: {
        program: programResponse,
      },
    };
  } catch (error) {
    console.error(`Failed to load program for ID "${programId}":`, error);

    return { type: 'notFound' };
  }
}
