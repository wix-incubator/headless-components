/**
 * A utility function that wraps a signals effect to handle hydration properly.
 * This prevents unnecessary client-side requests when data has already been
 * loaded server-side during SSR (Server-Side Rendering).
 *
 * The function handles ALL the boilerplate:
 * 1. Only runs on the client-side (checks for window object)
 * 2. Establishes signal dependencies on first run without executing effect logic
 * 3. Skips effect execution on first run to prevent duplicate requests
 * 4. Executes the effect normally on subsequent reactive updates
 *
 * @param signalsService - The signals service instance for creating effects
 * @param effectFn - The effect function that receives isFirstRun flag (no window checking needed)
 * @param getFirstRun - Function that returns the current firstRun state
 * @param setFirstRun - Function to update the firstRun state
 *
 * @example
 * ```typescript
 * import { hydratedEffect } from '@wix/headless-core/utils';
 *
 * // In your service implementation
 * let firstRun = true;
 *
 * hydratedEffect(signalsService, async (isFirstRun) => {
 *   // CRITICAL: Read signals FIRST to establish dependencies, even on first run
 *   const searchOptions = searchOptionsSignal.get();
 *
 *   // Skip side effects on first run (data already loaded from SSR)
 *   if (isFirstRun) return;
 *
 *   // Effect logic runs on subsequent changes
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

      // Always call effectFn, but pass the isFirstRun flag
      // so it can read signals (establishing dependencies) but skip side effects on first run
      await effectFn(isFirstRun);
    });
  }

  // Set firstRun to false immediately to prevent any race conditions
  setFirstRun(false);
}
