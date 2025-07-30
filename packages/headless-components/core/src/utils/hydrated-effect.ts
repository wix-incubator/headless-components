/**
 * A utility that extends the signals service with a hydratedEffect method
 * for handling hydration properly in SSR environments.
 *
 * This prevents unnecessary client-side requests when data has already been
 * loaded server-side during SSR (Server-Side Rendering).
 *
 * The hydratedEffect method handles ALL the boilerplate:
 * 1. Only runs on the client-side (checks for window object)
 * 2. Manages firstRun state automatically
 * 3. Establishes signal dependencies on first run without executing side effects
 * 4. Executes the effect normally on subsequent reactive updates
 *
 * @example
 * ```typescript
 * import { extendSignalsServiceWithHydratedEffect } from '@wix/headless-core/utils';
 *
 * // In your service implementation - minimal boilerplate!
 * const signalsService = extendSignalsServiceWithHydratedEffect(
 *   getService(SignalsServiceDefinition)
 * );
 *
 * signalsService.hydratedEffect(
 *   () => {
 *     // Read signals to establish dependencies
 *     return { searchOptions: searchOptionsSignal.get() };
 *   },
 *   async (dependencies) => {
 *     // Clean effect logic - hydratedEffect handles the firstRun logic internally
 *     try {
 *       isLoadingSignal.set(true);
 *       const result = await fetchData(dependencies.searchOptions);
 *       dataSignal.set(result);
 *     } finally {
 *       isLoadingSignal.set(false);
 *     }
 *   }
 * );
 * ```
 */

import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

// Infer the SignalsService type from the service definition
export type SignalsService = typeof SignalsServiceDefinition.__api;

export interface SignalsServiceWithHydratedEffect extends SignalsService {
  /**
   * A special effect that handles SSR hydration properly.
   *
   * @param dependenciesFn - Function that reads signals and returns dependencies object
   * @param effectFn - Function that executes with the dependencies, called only after first run
   */
  hydratedEffect: <T>(
    dependenciesFn: () => T,
    effectFn: (dependencies: T) => void | Promise<void>,
  ) => void;
}

/**
 * Extends a signals service with the hydratedEffect method.
 *
 * @param signalsService - The signals service instance to extend
 * @returns Extended signals service with hydratedEffect method
 */
export function extendSignalsServiceWithHydratedEffect<
  T extends SignalsService,
>(signalsService: T): T & SignalsServiceWithHydratedEffect {
  const extendedService = signalsService as T &
    SignalsServiceWithHydratedEffect;

  extendedService.hydratedEffect = <TDependencies>(
    dependenciesFn: () => TDependencies,
    effectFn: (dependencies: TDependencies) => void | Promise<void>,
  ) => {
    if (typeof window === "undefined") {
      return;
    }

    let firstRun = true;

    extendedService.effect(() => {
      const dependencies = dependenciesFn();

      if (firstRun) {
        firstRun = false;
        return;
      }

      return effectFn(dependencies);
    });
  };

  return extendedService;
}
