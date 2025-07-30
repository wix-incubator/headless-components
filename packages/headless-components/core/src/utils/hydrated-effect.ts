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
 * let firstRun = true;
 *
 * signalsService.hydratedEffect(async () => {
 *   // Read signals to establish dependencies
 *   const searchOptions = searchOptionsSignal.get();
 *
 *   // Clean effect logic - hydratedEffect handles the firstRun logic internally
 *   try {
 *     isLoadingSignal.set(true);
 *     const result = await fetchData(searchOptions);
 *     dataSignal.set(result);
 *   } finally {
 *     isLoadingSignal.set(false);
 *   }
 * }, () => firstRun, (value) => firstRun = value);
 * ```
 */

export interface SignalsServiceWithHydratedEffect {
  effect: (fn: () => void | Promise<void>) => void;
  signal: <T>(initialValue: T) => any;
  computed: <T>(computeFn: () => T) => any;
  hydratedEffect: any;
}

/**
 * Extends a signals service with the hydratedEffect method.
 *
 * @param signalsService - The signals service instance to extend
 * @returns Extended signals service with hydratedEffect method
 */
export function extendSignalsServiceWithHydratedEffect<
  T extends { effect: (fn: () => void) => void },
>(signalsService: T): T & SignalsServiceWithHydratedEffect {
  const extendedService = signalsService as T &
    SignalsServiceWithHydratedEffect;

  // extendedService.hydratedEffect = (
  //   effectFn: () => void | Promise<void>,
  //   getFirstRun: () => boolean,
  //   setFirstRun: (value: boolean) => void,
  // ): void => {
  //   if (typeof window !== "undefined") {
  //     signalsService.effect(async () => {
  //       const isFirstRun = getFirstRun();

  //       if (isFirstRun) {
  //         setFirstRun(false);
  //         // Skip execution on first run (data already loaded from SSR)
  //         return;
  //       }

  //       // Call effectFn only on subsequent reactive updates
  //       await effectFn();
  //     });
  //   }

  //   // Set firstRun to false immediately to prevent any race conditions
  //   setFirstRun(false);
  // };

  extendedService.hydratedEffect = (dependenciesFn: any, effectFn: any) => {
    if (typeof window === "undefined") {
      return;
    }

    let firstRun = true;

    console.log("before");

    extendedService.effect(() => {
      const dependencies = dependenciesFn();

      console.log({ firstRun });

      if (firstRun) {
        firstRun = false;
        return;
      }

      return effectFn(dependencies);
    });
  };

  return extendedService;
}
