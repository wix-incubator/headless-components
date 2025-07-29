/**
 * A utility function that wraps a signals effect to handle hydration properly.
 * This prevents unnecessary client-side requests when data has already been
 * loaded server-side during SSR (Server-Side Rendering).
 *
 * The function:
 * 1. Only runs on the client-side (checks for window object)
 * 2. Skips the first run to prevent duplicate requests
 * 3. Reads signals first to establish dependencies
 * 4. Executes the effect only on subsequent runs
 *
 * @param signalsService - The signals service instance for creating effects
 * @param effectFn - The effect function to run after hydration is complete
 *
 * @example
 * ```typescript
 * import { hydratedEffect } from '@wix/headless-core/utils';
 *
 * // In your service implementation
 * let firstRun = true;
 *
 * hydratedEffect(signalsService, async () => {
 *   // Read signals first to establish dependencies
 *   const searchOptions = searchOptionsSignal.get();
 *
 *   // Your effect logic here - this won't run on first load
 *   // when data is already available from SSR
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
  effectFn: () => void | Promise<void>,
  getFirstRun: () => boolean,
  setFirstRun: (value: boolean) => void,
): void {
  if (typeof window !== "undefined") {
    signalsService.effect(async () => {
      if (getFirstRun()) {
        setFirstRun(false);
        return;
      }

      await effectFn();
    });
  }

  // Set firstRun to false immediately to prevent any race conditions
  setFirstRun(false);
}
