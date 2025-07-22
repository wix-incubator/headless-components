import {
  defineService,
  implementService,
} from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import * as productsV3 from "@wix/auto_sdk_stores_products-v-3";

export interface RelatedProductsServiceAPI {
  relatedProducts: Signal<productsV3.V3Product[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  hasRelatedProducts: Signal<boolean>;

  loadRelatedProducts: (productId: string, limit?: number) => Promise<void>;
  refreshRelatedProducts: () => Promise<void>;
}

export const RelatedProductsServiceDefinition =
  defineService<RelatedProductsServiceAPI>("relatedProducts");

export interface RelatedProductsServiceConfig {
  productId: string;
  limit?: number;
}

export const RelatedProductsService =
  implementService.withConfig<RelatedProductsServiceConfig>()(
    RelatedProductsServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const relatedProducts: Signal<productsV3.V3Product[]> =
        signalsService.signal([] as any);
      const isLoading: Signal<boolean> = signalsService.signal(false as any);
      const error: Signal<string | null> = signalsService.signal(null as any);
      const hasRelatedProducts: Signal<boolean> = signalsService.signal(
        false as any,
      );

      const loadRelatedProducts = async (
        productId: string,
        limit: number = 4,
      ) => {
        isLoading.set(true);
        error.set(null);

        try {
          let relatedQuery = productsV3.queryProducts().ne("_id", productId);

          const relatedResult = await relatedQuery.limit(limit).find();

          relatedProducts.set(relatedResult.items || []);
          hasRelatedProducts.set((relatedResult.items || []).length > 0);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Failed to load related products";
          error.set(errorMessage);
          relatedProducts.set([]);
          hasRelatedProducts.set(false);
        } finally {
          isLoading.set(false);
        }
      };

      const refreshRelatedProducts = async () => {
        await loadRelatedProducts(config.productId, config.limit);
      };

      if (config.productId) {
        loadRelatedProducts(config.productId, config.limit);
      }

      return {
        relatedProducts,
        isLoading,
        error,
        hasRelatedProducts,

        loadRelatedProducts,
        refreshRelatedProducts,
      };
    },
  );

/**
 * Loads related products service configuration for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to create
 * configuration that tells the RelatedProductsService which product to load related products for.
 * Unlike other loaders, this creates configuration rather than fetching data during SSR.
 *
 * @param productId The ID of the product to find related products for
 * @param limit Optional number of related products to load (default: 4)
 * @returns Promise that resolves to RelatedProductsServiceConfig
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/product/[slug].astro
 * import { loadRelatedProductsServiceConfig } from '@wix/stores/services';
 * import { RelatedProducts } from '@wix/stores/components';
 *
 * // Create related products config for a specific product
 * const relatedProductsConfig = await loadRelatedProductsServiceConfig(
 *   'product-id-123',
 *   6
 * );
 * ---
 *
 * <RelatedProducts.Root relatedProductsConfig={relatedProductsConfig}>
 *   <RelatedProducts.List>
 *     {({ products, isLoading }) => (
 *       <div>
 *         {isLoading ? 'Loading...' : `${products.length} related products`}
 *       </div>
 *     )}
 *   </RelatedProducts.List>
 * </RelatedProducts.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/product/[slug].tsx
 * import { GetServerSideProps } from 'next';
 * import { loadRelatedProductsServiceConfig } from '@wix/stores/services';
 * import { RelatedProducts } from '@wix/stores/components';
 *
 * interface ProductPageProps {
 *   relatedProductsConfig: Awaited<ReturnType<typeof loadRelatedProductsServiceConfig>>;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ProductPageProps> = async () => {
 *   // Create related products config for a specific product
 *   const relatedProductsConfig = await loadRelatedProductsServiceConfig(
 *     'product-id-123',
 *     6
 *   );
 *
 *   return {
 *     props: {
 *       relatedProductsConfig,
 *     },
 *   };
 * };
 *
 * export default function ProductPage({ relatedProductsConfig }: ProductPageProps) {
 *   return (
 *     <RelatedProducts.Root relatedProductsConfig={relatedProductsConfig}>
 *       <RelatedProducts.List>
 *         {({ products, isLoading }) => (
 *           <div>
 *             {isLoading ? 'Loading...' : `${products.length} related products`}
 *           </div>
 *         )}
 *       </RelatedProducts.List>
 *     </RelatedProducts.Root>
 *   );
 * }
 * ```
 */
export async function loadRelatedProductsServiceConfig(
  productId: string,
  limit: number = 4,
): Promise<RelatedProductsServiceConfig> {
  return {
    productId,
    limit,
  };
}
