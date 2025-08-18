import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

/**
 * Service definition for the Pay Now service.
 * This defines the reactive API contract for managing custom payment checkout functionality.
 *
 * @constant
 */
export const PayNowServiceDefinition = defineService<{
  /** Function to redirect to checkout using custom checkout action */
  redirectToCheckout: () => Promise<void>;
  /** Reactive signal indicating if a checkout redirect is in progress */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
}>('PayNow');

/**
 * Configuration interface for the Pay Now service.
 * Contains an optional custom checkout action function.
 *
 * @interface PayNowServiceConfig
 */
export interface PayNowServiceConfig {
  /** Optional custom checkout action that returns a checkout URL or error */
  customCheckoutAction?: () => Promise<{
    /** The checkout URL to redirect to */
    data: string | undefined;
    /** Any error that occurred during checkout creation */
    error: unknown;
  }>;
}

/**
 * Implementation of the Pay Now service that manages custom payment checkout functionality.
 * This service provides signals for loading state and error handling, along with a method
 * to redirect to checkout using a custom checkout action.
 *
 * @example
 * ```tsx
 * import { PayNowServiceImplementation, PayNowServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function PayNowComponent({ payNowConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [PayNowServiceDefinition, PayNowServiceImplementation.withConfig(payNowConfig)]
 *     ])}>
 *       <PayNowButton />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function PayNowButton() {
 *   const payNowService = useService(PayNowServiceDefinition);
 *   const isLoading = payNowService.loadingSignal.get();
 *   const error = payNowService.errorSignal.get();
 *
 *   const handlePayNow = async () => {
 *     await payNowService.redirectToCheckout();
 *   };
 *
 *   return (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button
 *         onClick={handlePayNow}
 *         disabled={isLoading}
 *         className="pay-now-btn"
 *       >
 *         {isLoading ? 'Processing...' : 'Pay Now'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const PayNowServiceImplementation =
  implementService.withConfig<PayNowServiceConfig>()(
    PayNowServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const loadingSignal = signalsService.signal(false) as Signal<boolean>;
      const errorSignal = signalsService.signal<string | null>(null) as Signal<
        string | null
      >;

      return {
        redirectToCheckout: async () => {
          loadingSignal.set(true);
          try {
            if (config.customCheckoutAction) {
              const result = await config.customCheckoutAction();
              if (result && result.data) {
                window.location.href = result.data;
              } else {
                throw new Error('Failed to create checkout' + result?.error);
              }
            }
          } catch (error) {
            errorSignal.set((error as Error).toString());
            loadingSignal.set(false);
          }
        },
        loadingSignal,
        errorSignal,
      };
    },
  );

/**
 * Loads pay now service initial data for SSR initialization.
 * This function returns an empty configuration as the Pay Now service
 * is typically configured with custom checkout actions at runtime.
 *
 * @returns {Promise} Promise that resolves to an empty pay now service configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example
 * import { loadPayNowServiceInitialData } from '@wix/stores/services';
 * import { PayNow } from '@wix/stores/components';
 *
 * // Load initial data (empty for PayNow)
 * const payNowData = await loadPayNowServiceInitialData();
 * ---
 *
 * <PayNow.PayNow payNowConfig={payNowData.PayNow}>
 *   {({ redirectToCheckout, isLoading, error }) => (
 *     <button onClick={redirectToCheckout} disabled={isLoading}>
 *       {isLoading ? 'Processing...' : 'Pay Now'}
 *     </button>
 *   )}
 * </PayNow.PayNow>
 * ```
 */
export const loadPayNowServiceInitialData = async () => {
  return {
    [PayNowServiceDefinition]: {},
  };
};

/**
 * Helper function to create a pay now service binding with configuration.
 * This function simplifies the process of binding the pay now service with its configuration
 * and allows for additional configuration overrides, particularly for custom checkout actions.
 *
 * @template T - Type of the services configurations object
 * @param {T} servicesConfigs - Object containing service configurations
 * @param {Partial<PayNowServiceConfig>} [additionalConfig={}] - Additional configuration to override defaults
 * @returns Tuple containing service definition, implementation, and merged configuration
 *
 * @example
 * ```tsx
 * import { payNowServiceBinding, loadPayNowServiceInitialData } from '@wix/stores/services';
 * import { actions } from 'astro:actions';
 *
 * // Load initial data
 * const initialData = await loadPayNowServiceInitialData();
 *
 * // Create service binding with custom checkout action
 * const payNowBinding = payNowServiceBinding(initialData, {
 *   customCheckoutAction: async () => {
 *     try {
 *       const result = await actions.customCheckout();
 *       return { data: result, error: null };
 *     } catch (error) {
 *       return { data: undefined, error };
 *     }
 *   }
 * });
 *
 * // Use in service provider
 * const services = createServicesMap([payNowBinding]);
 * ```
 */
export const payNowServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadPayNowServiceInitialData>
    >[typeof PayNowServiceDefinition];
  },
>(
  servicesConfigs: T,
  additionalConfig: Partial<PayNowServiceConfig> = {},
) => {
  return [
    PayNowServiceDefinition,
    PayNowServiceImplementation,
    {
      ...(servicesConfigs[PayNowServiceDefinition] as PayNowServiceConfig),
      ...additionalConfig,
    },
  ] as const;
};
