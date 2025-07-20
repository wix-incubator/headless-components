import {
  defineService,
  implementService,
} from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { getCheckoutUrlForProduct } from "../utils/index.js";
import { getProductBySlug } from "@wix/auto_sdk_stores_products-v-3";

export const BuyNowServiceDefinition = defineService<{
  redirectToCheckout: () => Promise<void>;
  loadingSignal: Signal<boolean>;
  errorSignal: Signal<string | null>;
  inStockSignal: Signal<boolean>;
  preOrderAvailableSignal: Signal<boolean>;
  productName: string;
  price: string;
  currency: string;
}>("BuyNow");

export interface BuyNowServiceConfig {
  productId: string;
  variantId?: string;
  productName: string;
  price: string;
  currency: string;
  inStock: boolean;
  preOrderAvailable: boolean;
}
export const BuyNowServiceImplementation = implementService.withConfig<{
  productId: string;
  variantId?: string;
  productName: string;
  price: string;
  currency: string;
  inStock: boolean;
  preOrderAvailable: boolean;
}>()(BuyNowServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const loadingSignal = signalsService.signal(false) as Signal<boolean>;
  const errorSignal = signalsService.signal<string | null>(null) as Signal<
    string | null
  >;
  const inStockSignal = signalsService.signal(
    config.inStock
  ) as Signal<boolean>;
  const preOrderAvailableSignal = signalsService.signal(
    config.preOrderAvailable
  ) as Signal<boolean>;

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
        errorSignal.set((error as Error).toString());
        loadingSignal.set(false);
      }
    },
    loadingSignal,
    errorSignal,
    inStockSignal,
    preOrderAvailableSignal,
    productName: config.productName,
    price: config.price,
    currency: config.currency,
  };
});

export const loadBuyNowServiceInitialData = async (
  productSlug: string,
  variantId?: string
) => {
  const res = await getProductBySlug(productSlug, {
    fields: ["CURRENCY"],
  });
  const product = res.product!;

  const selectedVariant = variantId
    ? product.variantsInfo?.variants?.find((v) => v._id === variantId)
    : product.variantsInfo?.variants?.[0];

  const price =
    selectedVariant?.price?.actualPrice?.amount ??
    product.actualPriceRange?.minValue?.amount;
  const inStock = selectedVariant?.inventoryStatus?.inStock;
  const preOrderAvailable = selectedVariant?.inventoryStatus?.preorderEnabled;

  return {
    [BuyNowServiceDefinition]: {
      productId: product._id!,
      productName: product.name!,
      price: price!,
      currency: product.currency!,
      variantId: selectedVariant?._id,
      inStock,
      preOrderAvailable,
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
  additionalConfig: Partial<BuyNowServiceConfig> = {}
) => {
  return [
    BuyNowServiceDefinition,
    BuyNowServiceImplementation,
    {
      ...(servicesConfigs[BuyNowServiceDefinition] as BuyNowServiceConfig),
      ...additionalConfig,
    },
  ] as const;
};
