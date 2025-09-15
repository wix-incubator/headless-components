import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { instructors } from '@wix/online-programs';

/**
 * API interface for the Instructors service, providing reactive instructors data management.
 * This service handles loading and managing instructors data for specific programs.
 *
 * @interface InstructorsServiceAPI
 */
export interface InstructorsServiceAPI {
  /** Reactive signal containing the current instructors data */
  instructors: Signal<instructors.Instructor[]>;
  /** Reactive signal indicating if instructors are currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to load instructors by program IDs */
  loadInstructorsByProgramIds: (programIds: string[]) => Promise<void>;
}

/**
 * Service definition for the Instructors service.
 * This defines the contract that the InstructorsService must implement.
 *
 * @constant
 */
export const InstructorsServiceDefinition =
  defineService<InstructorsServiceAPI>('instructors');

/**
 * Configuration interface required to initialize the InstructorsService.
 * Contains the initial instructors data that will be loaded into the service.
 *
 * @interface InstructorsServiceConfig
 */
export interface InstructorsServiceConfig {
  /** The initial instructors data to configure the service with */
  instructors?: instructors.Instructor[];
  /** The program IDs to load instructors for */
  programIds?: string[];
}

/**
 * Implementation of the Instructors service that manages reactive instructors data.
 * This service provides signals for instructors data, loading state, and error handling,
 * along with methods to dynamically load instructors by program IDs.
 *
 * @example
 * ```tsx
 * import { InstructorsService, InstructorsServiceDefinition } from '@wix/online-programs/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function InstructorsComponent({ instructorsConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [InstructorsServiceDefinition, InstructorsService.withConfig(instructorsConfig)]
 *     ])}>
 *       <InstructorsDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function InstructorsDisplay() {
 *   const instructorsService = useService(InstructorsServiceDefinition);
 *   const instructors = instructorsService.instructors.get();
 *   const isLoading = instructorsService.isLoading.get();
 *   const error = instructorsService.error.get();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {instructors.map(instructor => (
 *         <div key={instructor._id}>{instructor.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const InstructorsService =
  implementService.withConfig<InstructorsServiceConfig>()(
    InstructorsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const instructors: Signal<instructors.Instructor[]> =
        signalsService.signal(config.instructors!);
      const isLoading: Signal<boolean> = signalsService.signal(
        !!config.programIds,
      );
      const error: Signal<string | null> = signalsService.signal(null as any);

      const loadInstructorsByProgramIds = async (programIds: string[]) => {
        isLoading.set(true);
        const instructorsResponse =
          await listInstructorsByProgramIds(programIds);

        if (!instructorsResponse) {
          instructors.set([]);
          error.set('Failed to load instructors');
        } else {
          instructors.set(instructorsResponse);
          error.set(null);
        }

        isLoading.set(false);
      };

      // Load instructors on initialization if programIds are provided
      if (config.programIds && config.programIds.length > 0) {
        loadInstructorsByProgramIds(config.programIds);
      }

      return {
        instructors,
        isLoading,
        error,
        loadInstructorsByProgramIds,
      };
    },
  );

/**
 * Success result interface for instructors service configuration loading.
 * Returned when instructors are successfully found and loaded.
 *
 * @interface SuccessInstructorsServiceConfigResult
 */
export interface SuccessInstructorsServiceConfigResult {
  /** Type "success" means that the instructors were found and the config is valid */
  type: 'success';
  /** The instructors config containing the loaded instructors data */
  config: InstructorsServiceConfig;
}

/**
 * Not found result interface for instructors service configuration loading.
 * Returned when instructors with the given program IDs cannot be found.
 *
 * @interface NotFoundInstructorsServiceConfigResult
 */
export interface NotFoundInstructorsServiceConfigResult {
  /** Type "notFound" means that the instructors were not found */
  type: 'notFound';
}

/**
 * Internal helper function to load instructors by program IDs from the Wix Instructors API.
 * Fetches instructors data for specific programs.
 *
 * @private
 * @param {string[]} programIds - The program IDs to load instructors for
 * @returns {Promise<Instructor[]>} Instructors response from the API
 */
const listInstructorsByProgramIds = async (programIds: string[]) => {
  const instructorsResponse = await instructors.listInstructors({
    programIdsFilter: programIds,
  });

  return instructorsResponse.instructors;
};

/**
 * Loads instructors service configuration from the Wix Instructors API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * instructors by program IDs that will be used to configure the InstructorsService.
 *
 * @param programIds The program IDs to load instructors for
 * @returns Promise that resolves to InstructorsServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/program/[id].astro
 * import { loadInstructorsServiceConfig } from '@wix/online-programs/services';
 * import { Program } from '@wix/online-programs/components';
 *
 * // Get program ID from URL params
 * const { id } = Astro.params;
 *
 * // Load instructors data during SSR
 * const instructorsServiceConfigResult = await loadInstructorsServiceConfig([id]);
 *
 * // Handle not found case
 * if (instructorsServiceConfigResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Program.Root program={programServiceConfigResult.config.program!}>
 *   <Program.Instructors instructors={instructorsServiceConfigResult.config.instructors!}>
 *     <Program.Instructor.Name />
 *   </Program.Instructors>
 * </Program.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/program/[id].tsx
 * import { GetServerSideProps } from 'next';
 * import { loadInstructorsServiceConfig } from '@wix/online-programs/services';
 * import { Program } from '@wix/online-programs/components';
 *
 * interface ProgramPageProps {
 *   instructorsServiceConfig: InstructorsServiceConfig;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ProgramPageProps> = async ({ params }) => {
 *   const id = params?.id as string;
 *
 *   // Load instructors data during SSR
 *   const instructorsServiceConfigResult = await loadInstructorsServiceConfig([id]);
 *
 *   // Handle not found case
 *   if (instructorsServiceConfigResult.type === 'notFound') {
 *     return {
 *       notFound: true,
 *     };
 *   }
 *
 *   return {
 *     props: {
 *       instructorsServiceConfig: instructorsServiceConfigResult.config,
 *     },
 *   };
 * };
 *
 * export default function ProgramPage({ instructorsServiceConfig }: ProgramPageProps) {
 *   return (
 *     <Program.Root program={programServiceConfig.program!}>
 *       <Program.Instructors instructors={instructorsServiceConfig.instructors!}>
 *         <Program.Instructor.Name />
 *       </Program.Instructors>
 *     </Program.Root>
 *   );
 * }
 * ```
 */
export async function loadInstructorsServiceConfig(
  programIds: string[],
): Promise<
  SuccessInstructorsServiceConfigResult | NotFoundInstructorsServiceConfigResult
> {
  try {
    const instructorsResponse = await listInstructorsByProgramIds(programIds);

    if (!instructorsResponse || instructorsResponse.length === 0) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: {
        instructors: instructorsResponse,
        programIds,
      },
    };
  } catch (error) {
    console.error(
      `Failed to load instructors for program IDs "${programIds.join(', ')}":`,
      error,
    );
    return { type: 'notFound' };
  }
}
