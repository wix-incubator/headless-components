// BuyNowService
// 🧠 Purpose: Handles the buy now/checkout redirect logic for a single product/variant.
import {
  defineService,
  implementService,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";

export const buynowserviceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
}>("buynow");

export const buynowService = implementService.withConfig<{
  productId: string;
  variantId: string;
}>()(buynowserviceDefinition, ({ getService }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;

  // Mock checkout and redirect logic

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        // Mock checkout creation
        const checkoutResult = { _id: "test-checkout-id" };
        if (!checkoutResult._id) {
          throw new Error("Failed to create checkout");
        }
        // Mock redirect session creation
        const redirectSession = { fullUrl: "http://mocked-redirect-url.com" };
        window.location.href = redirectSession.fullUrl;
      } catch (error: any) {
        errorSignal.set(error?.message || String(error));
        throw error;
      } finally {
        loadingSignal.set(false);
      }
    },
    loading: loadingSignal,
    error: errorSignal,
  };
});
