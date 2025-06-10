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
  price: string;
  currency: string;
  customCheckoutAction?: () => Promise<{ data: string | undefined, error: unknown }>
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
        if (config.customCheckoutAction) {
          const result = await config.customCheckoutAction();
          if (result && result.data) {
            window.location.href = result.data;
          } else {
            throw new Error("Failed to create checkout" + result?.error);
          }
          return;
        }
        const checkoutUrl = await getCheckoutUrlForProduct(
          config.productId,
          config.variantId
        );
        window.location.href = checkoutUrl;
      } catch (error) {
        errorSignal.set((error as Error).toString());
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
    productName: config.productName,
    price: config.price,
    currency: config.currency,
  };
});

export const loadBuyNowServiceInitialData = async (
  productSlug: string,
  variantId?: string
) => {
  const res = await productsV3.getProductBySlug(productSlug, {
    fields: ["CURRENCY"],
  });
  const product = res.product!;

  const selectedVariantId =
    variantId ?? product.variantsInfo?.variants?.[0]?._id;

  const price =
    product.variantsInfo?.variants?.find((v) => v._id === selectedVariantId)
      ?.price?.actualPrice?.amount ??
    product.actualPriceRange?.minValue?.amount;

  return {
    [BuyNowServiceDefinition]: {
      productId: product._id!,
      productName: product.name!,
      price: price!,
      currency: product.currency!,
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
  servicesConfigs: T,
  additionalConfig: Partial<ServiceFactoryConfig<typeof BuyNowServiceImplementation>>
) => {
  return [
    BuyNowServiceDefinition,
    BuyNowServiceImplementation,
    {
      ...servicesConfigs[BuyNowServiceDefinition] as ServiceFactoryConfig<typeof BuyNowServiceImplementation>,
      ...additionalConfig,
    },
  ] as const;
};
