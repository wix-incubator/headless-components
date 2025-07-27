import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";

/**
 * Configuration interface for the Products List service.
 * Contains the initial products data, search options, and metadata.
 *
 * @interface ProductsListServiceConfig
 */
export type ProductsListServiceConfig = {
  /** Array of product objects to initialize the service with */
  products: productsV3.V3Product[];
  /** Search options used to fetch the products */
  searchOptions: Parameters<typeof productsV3.searchProducts>[0];
  /** Pagination metadata from the search response */
  pagingMetadata: productsV3.CommonCursorPagingMetadata;
  /** Aggregation data containing filters, facets, and counts */
  aggregations: productsV3.AggregationData;
};

/**
 * Loads products list service configuration from the Wix Stores API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a list of products based on search criteria.
 *
 * @param {Parameters<typeof productsV3.searchProducts>[0]} searchOptions - The search options for querying products
 * @returns {Promise<ProductsListServiceConfig>} Promise that resolves to the products list configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/products.astro
 * import { loadProductsListServiceConfig } from '@wix/stores/services';
 * import { ProductList } from '@wix/stores/components';
 *
 * // Define search options
 * const searchOptions = {
 *   cursorPaging: { limit: 12 },
 *   filter: {},
 *   sort: [{ fieldName: 'name', order: 'ASC' }]
 * };
 *
 * // Load products data during SSR
 * const productsConfig = await loadProductsListServiceConfig(searchOptions);
 * ---
 *
 * <ProductList.Root productsConfig={productsConfig}>
 *   <ProductList.ItemContent>
 *     {({ product }) => (
 *       <div>
 *         <h3>{product.name}</h3>
 *         <p>{product.description}</p>
 *       </div>
 *     )}
 *   </ProductList.ItemContent>
 * </ProductList.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example - pages/products.tsx
 * import { GetServerSideProps } from 'next';
 * import { loadProductsListServiceConfig } from '@wix/stores/services';
 * import { ProductsList } from '@wix/stores/components';
 *
 * interface ProductsPageProps {
 *   productsConfig: Awaited<ReturnType<typeof loadProductsListServiceConfig>>;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async () => {
 *   const searchOptions = {
 *     cursorPaging: { limit: 12 },
 *     filter: {},
 *     sort: [{ fieldName: 'name', order: 'ASC' }]
 *   };
 *
 *   const productsConfig = await loadProductsListServiceConfig(searchOptions);
 *
 *   return {
 *     props: {
 *       productsConfig,
 *     },
 *   };
 * };
 *
 * export default function ProductsPage({ productsConfig }: ProductsPageProps) {
 *   return (
 *     <ProductList.Root productsConfig={productsConfig}>
 *       <ProductList.ItemContent>
 *         {({ product }) => (
 *           <div>
 *             <h3>{product.name}</h3>
 *             <p>{product.description}</p>
 *           </div>
 *         )}
 *       </ProductList.ItemContent>
 *     </ProductList.Root>
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

/**
 * Service definition for the Products List service.
 * This defines the reactive API contract for managing a list of products with search, pagination, and filtering capabilities.
 *
 * @constant
 */
export const ProductsListServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of products */
    products: Signal<productsV3.V3Product[]>;
    /** Reactive signal containing aggregation data for filters and facets */
    aggregations: Signal<productsV3.AggregationData>;
    /** Reactive signal containing pagination metadata */
    pagingMetadata: Signal<productsV3.CommonCursorPagingMetadata>;
    /** Reactive signal containing current search options */
    searchOptions: Signal<Parameters<typeof productsV3.searchProducts>[0]>;
    /** Reactive signal indicating if products are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
    /** Function to update search options and trigger a new search */
    setSearchOptions: (
      searchOptions: Parameters<typeof productsV3.searchProducts>[0],
    ) => void;
  },
  ProductsListServiceConfig
>("products-list");

/**
 * Implementation of the Products List service that manages reactive products data.
 * This service provides signals for products data, search options, pagination, aggregations,
 * loading state, and error handling. It automatically re-fetches products when search options change.
 *
 * @example
 * ```tsx
 * import { ProductListService, ProductsListServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ProductsComponent({ productsConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProductsListServiceDefinition, ProductListService.withConfig(productsConfig)]
 *     ])}>
 *       <ProductsDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ProductsDisplay() {
 *   const productsService = useService(ProductsListServiceDefinition);
 *   const products = productsService.products.get();
 *   const isLoading = productsService.isLoading.get();
 *   const error = productsService.error.get();
 *
 *   // Update search options to filter by category
 *   const filterByCategory = (categoryId: string) => {
 *     const currentOptions = productsService.searchOptions.get();
 *     productsService.setSearchOptions({
 *       ...currentOptions,
 *       filter: {
 *         ...currentOptions.filter,
 *         categoryIds: [categoryId]
 *       }
 *     });
 *   };
 *
 *   if (isLoading) return <div>Loading products...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {products.map(product => (
 *         <div key={product._id}>
 *           <h3>{product.name}</h3>
 *           <p>{product.description}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
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
