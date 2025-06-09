import {
  defineService,
  implementService,
  ServiceFactoryConfig,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const PayNowServiceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loadingSignal: Signal<boolean>;
  errorSignal: Signal<string | null>;
}>("PayNow");

export const PayNowServiceImplementation = implementService.withConfig<{
  productName: string;
  price: string;
  payNowServiceActions: {
    customLineItemCheckout: (input: { productName: string, price: string }) => Promise<{ data: string, error: unknown }>
  }
}>()(PayNowServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {

        const result = await config.payNowServiceActions.customLineItemCheckout({ productName: config.productName, price: config.price });
        console.log('from server action', result);
        window.location.href = result.data;
      } catch (error) {
        errorSignal.set(error as string);
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
    productName: config.productName,
    price: config.price,
  };
});

export const loadPayNowServiceInitialData = async (
  productName: string,
  price: string
) => {
  return {
    [PayNowServiceDefinition]: {
      productName,
      price,
    },
  };
};

export const payNowServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadPayNowServiceInitialData>
    >[typeof PayNowServiceDefinition];
  }
>(
  servicesConfigs: T
) => {
  return [
    PayNowServiceDefinition,
    PayNowServiceImplementation,
    servicesConfigs[PayNowServiceDefinition] as ServiceFactoryConfig<
      typeof PayNowServiceImplementation
    >,
  ] as const;
};
