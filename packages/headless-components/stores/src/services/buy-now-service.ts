import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { getCheckoutUrlForProduct } from '../utils/index.js';
import { getProductBySlug } from '@wix/auto_sdk_stores_products-v-3';

/**
 * Service definition for the Buy Now service.
 * This defines the reactive API contract for managing buy now functionality.
 *
 * @constant
 */
export const BuyNowServiceDefinition = defineService<{
  /** Function to redirect to checkout with the current product */
  redirectToCheckout: () => Promise<void>;
  /** Reactive signal indicating if a checkout redirect is in progress */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Reactive signal indicating if the product is in stock */
  inStockSignal: Signal<boolean>;
  /** Reactive signal indicating if pre-order is available */
  preOrderAvailableSignal: Signal<boolean>;
  /** The name of the product */
  productName: string;
  /** The price of the product as a string */
  price: string;
  /** The currency code for the product price */
  currency: string;
}>('BuyNow');

/**
 * Configuration interface for the Buy Now service.
 * Contains all the product information needed to initialize the buy now functionality.
 *
 * @interface BuyNowServiceConfig
 */
export interface BuyNowServiceConfig {
  /** The unique product ID */
  productId: string;
  /** The optional variant ID if a specific variant is selected */
  variantId?: string;
  /** The display name of the product */
  productName: string;
  /** The price of the product as a string */
  price: string;
  /** The currency code for the product price */
  currency: string;
  /** Whether the product is currently in stock */
  inStock: boolean;
  /** Whether pre-order is available for this product */
  preOrderAvailable: boolean;
}

/**
 * Implementation of the Buy Now service that manages buy now functionality.
 * This service provides signals for loading state, stock status, and error handling,
 * along with a method to redirect directly to checkout.
 *
 * @example
 * ```tsx
 * import { BuyNowServiceImplementation, BuyNowServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function BuyNowComponent({ buyNowConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [BuyNowServiceDefinition, BuyNowServiceImplementation.withConfig(buyNowConfig)]
 *     ])}>
 *       <BuyNowButton />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function BuyNowButton() {
 *   const buyNowService = useService(BuyNowServiceDefinition);
 *   const isLoading = buyNowService.loadingSignal.get();
 *   const error = buyNowService.errorSignal.get();
 *   const inStock = buyNowService.inStockSignal.get();
 *
 *   const handleBuyNow = async () => {
 *     await buyNowService.redirectToCheckout();
 *   };
 *
 *   return (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button
 *         onClick={handleBuyNow}
 *         disabled={!inStock || isLoading}
 *         className={`buy-now-btn ${!inStock ? 'out-of-stock' : ''}`}
 *       >
 *         {isLoading ? 'Processing...' :
 *          !inStock ? 'Out of Stock' :
 *          `Buy Now - ${buyNowService.currency}${buyNowService.price}`}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
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
    config.inStock,
  ) as Signal<boolean>;
  const preOrderAvailableSignal = signalsService.signal(
    config.preOrderAvailable,
  ) as Signal<boolean>;

  return {
    redirectToCheckout: async () => {
      loadingSignal.set(true);
      try {
        const checkoutUrl = await getCheckoutUrlForProduct(
          config.productId,
          config.variantId,
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

/**
 * Loads buy now service initial data from the Wix Stores API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * product data required for the buy now functionality.
 *
 * @param {string} productSlug - The product slug to load data for
 * @param {string} [variantId] - Optional variant ID if a specific variant should be used
 * @returns {Promise} Promise that resolves to the buy now service configuration data
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/product/[slug].astro
 * import { loadBuyNowServiceInitialData } from '@wix/stores/services';
 * import { BuyNow } from '@wix/stores/components';
 *
 * const { slug } = Astro.params;
 * const variantId = Astro.url.searchParams.get('variant');
 *
 * // Load buy now data during SSR
 * const buyNowData = await loadBuyNowServiceInitialData(slug, variantId);
 * ---
 *
 * <BuyNow.BuyNow buyNowConfig={buyNowData.BuyNow}>
 *   {({ redirectToCheckout, isLoading, inStock, price, currency }) => (
 *     <button onClick={redirectToCheckout} disabled={!inStock || isLoading}>
 *       {isLoading ? 'Loading...' : `Buy Now ${currency}${price}`}
 *     </button>
 *   )}
 * </BuyNow.BuyNow>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example
 * import { GetServerSideProps } from 'next';
 * import { loadBuyNowServiceInitialData } from '@wix/stores/services';
 *
 * export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
 *   const slug = params?.slug as string;
 *   const variantId = query.variant as string | undefined;
 *
 *   const buyNowData = await loadBuyNowServiceInitialData(slug, variantId);
 *
 *   return {
 *     props: {
 *       buyNowData,
 *     },
 *   };
 * };
 * ```
 */
export const loadBuyNowServiceInitialData = async (
  productSlug: string,
  variantId?: string,
) => {
  const res = await getProductBySlug(productSlug, {
    fields: ['CURRENCY'],
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

/**
 * Helper function to create a buy now service binding with configuration.
 * This function simplifies the process of binding the buy now service with its configuration
 * and allows for additional configuration overrides.
 *
 * @template T - Type of the services configurations object
 * @param {T} servicesConfigs - Object containing service configurations
 * @param {Partial<BuyNowServiceConfig>} [additionalConfig={}] - Additional configuration to override defaults
 * @returns Tuple containing service definition, implementation, and merged configuration
 *
 * @example
 * ```tsx
 * import { buyNowServiceBinding, loadBuyNowServiceInitialData } from '@wix/stores/services';
 *
 * // Load initial data
 * const initialData = await loadBuyNowServiceInitialData('my-product-slug');
 *
 * // Create service binding with additional config
 * const buyNowBinding = buyNowServiceBinding(initialData, {
 *   inStock: false, // Override stock status
 * });
 *
 * // Use in service provider
 * const services = createServicesMap([buyNowBinding]);
 * ```
 */
export const buyNowServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadBuyNowServiceInitialData>
    >[typeof BuyNowServiceDefinition];
  },
>(
  servicesConfigs: T,
  additionalConfig: Partial<BuyNowServiceConfig> = {},
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
