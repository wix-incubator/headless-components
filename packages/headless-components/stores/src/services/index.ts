import { defineService, implementService, Signal } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { getCheckoutUrlForProduct } from "../utils";

export const BuyNowServiceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>,
  loadingSignal: Signal<boolean>,
  errorSignal: Signal<string | null>,
}>("BuyNow")

export const BuyNowServiceImplementation = implementService.withConfig<{
  productId: string,
  variantId: string,
}>()(BuyNowServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<string | null>;

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        const checkoutUrl = await getCheckoutUrlForProduct(config.productId, config.variantId);
        window.location.href = checkoutUrl;
      } catch (error) {
        errorSignal.set(error as string);
      } finally {
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
  }
});

(globalThis as any).ServicesRepository ||= {};
(globalThis as any).ServicesRepository[BuyNowServiceDefinition] = BuyNowServiceImplementation;
