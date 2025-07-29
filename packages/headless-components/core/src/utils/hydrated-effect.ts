/**
 * A utility function that wraps a signals effect to handle hydration properly.
 * This prevents unnecessary client-side requests when data has already been
 * loaded server-side during SSR (Server-Side Rendering).
 *
 * The function handles ALL the boilerplate:
 * 1. Only runs on the client-side (checks for window object)
 * 2. Manages firstRun state automatically
 * 3. Establishes signal dependencies on first run without executing side effects
 * 4. Executes the effect normally on subsequent reactive updates
 *
 * @param signalsService - The signals service instance for creating effects
 * @param effectFn - Clean effect function that receives isFirstRun parameter
 * @param getFirstRun - Function that returns the current firstRun state
 * @param setFirstRun - Function to update the firstRun state
 *
 * @example
 * ```typescript
 * import { hydratedEffect } from '@wix/headless-core/utils';
 *
 * // In your service implementation - minimal boilerplate!
 * let firstRun = true;
 *
 * hydratedEffect(signalsService, async (isFirstRun) => {
 *   // Read signals to establish dependencies
 *   const searchOptions = searchOptionsSignal.get();
 *
 *   // Utility handles all the complexity - just skip side effects on first run
 *   if (isFirstRun) return;
 *
 *   // Clean effect logic
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
export function hydratedEffect(
  signalsService: { effect: (fn: () => void | Promise<void>) => void },
  effectFn: (isFirstRun: boolean) => void | Promise<void>,
  getFirstRun: () => boolean,
  setFirstRun: (value: boolean) => void,
): void {
  if (typeof window !== "undefined") {
    signalsService.effect(async () => {
      const isFirstRun = getFirstRun();

      if (isFirstRun) {
        setFirstRun(false);
      }

      // Always call effectFn with isFirstRun flag
      // This ensures signal dependencies are established on first run
      // while allowing services to skip side effects cleanly
      await effectFn(isFirstRun);
    });
  }

  // Set firstRun to false immediately to prevent any race conditions
  setFirstRun(false);
}
