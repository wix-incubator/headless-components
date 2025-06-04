import {
  defineService,
  implementService,
  ServiceFactoryConfig,
  Signal,
} from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import { getCheckoutUrlForProduct } from "../utils";

export const BuyNowServiceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loadingSignal: Signal<boolean>;
  errorSignal: Signal<string | null>;
}>("BuyNow");

export const BuyNowServiceImplementation = implementService.withConfig<{
  productId: string;
  variantId?: string;
  productName: string;
}>()(BuyNowServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        const checkoutUrl = await getCheckoutUrlForProduct(
          config.productId,
          config.variantId
        );
        window.location.href = checkoutUrl;
      } catch (error) {
        errorSignal.set(error as string);
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
    productName: config.productName,
  };
});

(globalThis as any).ServicesRepository ||= {};
(globalThis as any).ServicesRepository[BuyNowServiceDefinition] =
  BuyNowServiceImplementation;

export const loadBuyNowServiceInitialData = async (
  productSlug: string,
  variantId?: string
) => {
  const res = await productsV3.getProductBySlug(productSlug);
  const product = res.product!;

  const selectedVariantId =
    variantId ?? product.variantsInfo?.variants?.[0]?._id;

  return {
    [BuyNowServiceDefinition]: {
      productId: product._id!,
      productName: product.name!,
      ...(typeof selectedVariantId !== "undefined"
        ? {
            variantId: selectedVariantId!,
          }
        : {}),
    },
  };
};

export const buyNowServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadBuyNowServiceInitialData>
    >[typeof BuyNowServiceDefinition];
  }
>(
  servicesConfigs: T
) => {
  return [
    BuyNowServiceDefinition,
    BuyNowServiceImplementation,
    servicesConfigs[BuyNowServiceDefinition] as ServiceFactoryConfig<
      typeof BuyNowServiceImplementation
    >,
  ] as const;
};
