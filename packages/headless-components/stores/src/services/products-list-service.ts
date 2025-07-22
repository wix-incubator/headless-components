import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";

export interface ProductsListServiceConfig{
  products: productsV3.V3Product[];
  searchOptions: Parameters<typeof productsV3.searchProducts>[0];
  pagingMetadata: productsV3.CommonCursorPagingMetadata;
  aggregations: productsV3.AggregationData;
};

/**
 * Loads products list service configuration from the Wix Products API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * products based on search criteria that will be used to configure the ProductsListService.
 *
 * @param searchOptions Search options for filtering and querying products
 * @returns Promise that resolves to ProductsListServiceConfig with products, metadata, and aggregations
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/search.astro
 * import { loadProductsListServiceConfig } from '@wix/stores/services';
 * import { ProductsList } from '@wix/stores/components';
 *
 * // Get search query from URL params
 * const searchQuery = Astro.url.searchParams.get('q') || '';
 * const category = Astro.url.searchParams.get('category');
 *
 * // Build search options
 * const searchOptions = {
 *   query: { search: searchQuery },
 *   filter: category ? { categories: [category] } : undefined,
 *   paging: { limit: 12 }
 * };
 *
 * // Load products during SSR
 * const productsListConfig = await loadProductsListServiceConfig(searchOptions);
 * ---
 *
 * <ProductsList.Root productsListConfig={productsListConfig}>
 *   <ProductsList.ItemContent>
 *     {({ product }) => (
 *       <div class="product-item">
 *         <h3>{product.name}</h3>
 *       </div>
 *     )}
 *   </ProductsList.ItemContent>
 * </ProductsList.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/search.tsx
 * import { GetServerSideProps } from 'next';
 * import { loadProductsListServiceConfig } from '@wix/stores/services';
 * import { ProductsList } from '@wix/stores/components';
 *
 * interface SearchPageProps {
 *   productsListConfig: Awaited<ReturnType<typeof loadProductsListServiceConfig>>;
 *   searchQuery: string;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<SearchPageProps> = async ({ query }) => {
 *   const searchQuery = (query.q as string) || '';
 *   const category = query.category as string;
 *
 *   // Build search options
 *   const searchOptions = {
 *     query: { search: searchQuery },
 *     filter: category ? { categories: [category] } : undefined,
 *     paging: { limit: 12 }
 *   };
 *
 *   // Load products during SSR
 *   const productsListConfig = await loadProductsListServiceConfig(searchOptions);
 *
 *   return {
 *     props: {
 *       productsListConfig,
 *       searchQuery,
 *     },
 *   };
 * };
 *
 * export default function SearchPage({ productsListConfig, searchQuery }: SearchPageProps) {
 *   return (
 *     <div>
 *       <h1>Search Results for "{searchQuery}"</h1>
 *       <ProductsList.Root productsListConfig={productsListConfig}>
 *         <ProductsList.ItemContent>
 *           {({ product }) => (
 *             <div className="product-item">
 *               <h3>{product.name}</h3>
 *             </div>
 *           )}
 *         </ProductsList.ItemContent>
 *       </ProductsList.Root>
 *     </div>
 *   );
 * }
 * ```
 */
export async function loadProductsListServiceConfig(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): Promise<ProductsListServiceConfig> {
  const result = await productsV3.searchProducts(searchOptions);
  return {
    products: result.products ?? [],
    searchOptions,
    pagingMetadata: result.pagingMetadata!,
    aggregations: result.aggregationData!,
  };
}

export const ProductsListServiceDefinition = defineService<
  {
    products: Signal<productsV3.V3Product[]>;
    aggregations: Signal<productsV3.AggregationData>;
    pagingMetadata: Signal<productsV3.CommonCursorPagingMetadata>;
    searchOptions: Signal<Parameters<typeof productsV3.searchProducts>[0]>;
    isLoading: Signal<boolean>;
    error: Signal<string | null>;
    setSearchOptions: (
      searchOptions: Parameters<typeof productsV3.searchProducts>[0],
    ) => void;
  },
  ProductsListServiceConfig
>("products-list");

export const ProductListService =
  implementService.withConfig<ProductsListServiceConfig>()(
    ProductsListServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);

      const productsSignal = signalsService.signal<productsV3.V3Product[]>(
        config.products,
      );
      const searchOptionsSignal = signalsService.signal<
        Parameters<typeof productsV3.searchProducts>[0]
      >(config.searchOptions);
      const pagingMetadataSignal =
        signalsService.signal<productsV3.CommonCursorPagingMetadata>(
          config.pagingMetadata,
        );

      const aggregationsSignal =
        signalsService.signal<productsV3.AggregationData>(config.aggregations);

      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      if (typeof window !== "undefined") {
        signalsService.effect(async () => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const searchOptions = searchOptionsSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          try {
            isLoadingSignal.set(true);

            const affectiveSearchOptions: Parameters<
              typeof productsV3.searchProducts
            >[0] = searchOptions.cursorPaging?.cursor
              ? {
                  cursorPaging: {
                    cursor: searchOptions.cursorPaging.cursor,
                    limit: searchOptions.cursorPaging.limit,
                  },
                }
              : searchOptions;

            const result = await productsV3.searchProducts(
              affectiveSearchOptions,
            );

            productsSignal.set(result.products ?? []);
            pagingMetadataSignal.set(result.pagingMetadata!);
          } catch (error) {
            errorSignal.set(
              error instanceof Error ? error.message : "Unknown error",
            );
          } finally {
            isLoadingSignal.set(false);
          }
        });
      }

      firstRun = false;

      return {
        products: productsSignal,
        searchOptions: searchOptionsSignal,
        pagingMetadata: pagingMetadataSignal,
        aggregations: aggregationsSignal,
        setSearchOptions: (
          searchOptions: Parameters<typeof productsV3.searchProducts>[0],
        ) => searchOptionsSignal.set(searchOptions),
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    },
  );
