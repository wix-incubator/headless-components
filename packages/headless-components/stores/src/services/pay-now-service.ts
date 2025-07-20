import {
  defineService,
  implementService,
} from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";

export const PayNowServiceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loadingSignal: Signal<boolean>;
  errorSignal: Signal<string | null>;
}>("PayNow");

export interface PayNowServiceConfig {
  customCheckoutAction?: () => Promise<{
    data: string | undefined;
    error: unknown;
  }>;
}

export const PayNowServiceImplementation = implementService.withConfig<PayNowServiceConfig>()(PayNowServiceDefinition, ({ getService, config }) => {
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
            throw new Error("Failed to create checkout" + result?.error);
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
});

export const loadPayNowServiceInitialData = async () => {
  return {
    [PayNowServiceDefinition]: {},
  };
};

export const payNowServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadPayNowServiceInitialData>
    >[typeof PayNowServiceDefinition];
  }
>(
  servicesConfigs: T,
  additionalConfig: Partial<PayNowServiceConfig> = {}
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
