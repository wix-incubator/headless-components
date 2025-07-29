import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { hydratedEffect } from "@wix/headless-core/utils";
import { productsV3, readOnlyVariantsV3 } from "@wix/stores";

export const DEFAULT_QUERY_LIMIT = 100;

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
  searchOptions: productsV3.V3ProductSearch;
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
 * @param {productsV3.V3ProductSearch} searchOptions - The search options for querying products
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
 *     filter: {
 *       'allCategoriesInfo.categories': { $matchItems: [{ _id: { $in: [category._id] } }] }
 *     },
 *     sort: [{ fieldName: 'name' as const, order: 'ASC' as const }]
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
  searchOptions: productsV3.V3ProductSearch,
): Promise<ProductsListServiceConfig> {
  const searchWithoutFilter = { ...searchOptions, filter: {} };

  const [resultWithoutFilter, resultWithFilter] = await Promise.all([
    fetchProducts(searchWithoutFilter),
    fetchProducts(searchOptions),
  ]);

  const products =
    resultWithFilter?.products ?? resultWithoutFilter?.products ?? [];

  return {
    products,
    searchOptions,
    pagingMetadata: resultWithFilter.pagingMetadata!,
    aggregations: resultWithoutFilter.aggregationData ?? {},
  };
}

/**
 * Fetches products and their missing variants in one optimized request.
 * This function wraps the standard searchProducts call and automatically
 * fetches missing variant data for all products that need it.
 *
 * @param searchOptions - The search options for querying products
 * @returns Promise that resolves to the search result with complete variant data
 */
const fetchProducts = async (searchOptions: productsV3.V3ProductSearch) => {
  const result = await productsV3.searchProducts(searchOptions);

  // Fetch missing variants for all products in one batch request
  if (result.products) {
    result.products = await fetchMissingVariants(result.products);
  }

  return result;
};

/**
 * Fetches missing variants for all products in one batch request.
 * This function identifies products that need variant data and fetches
 * all variants efficiently using the readOnlyVariantsV3 API.
 *
 * @param products - Array of products that may need variant data
 * @returns Promise that resolves to products with complete variant information
 */
const fetchMissingVariants = async (
  products: productsV3.V3Product[],
): Promise<productsV3.V3Product[]> => {
  // Find products that need variants (both single and multi-variant products)
  const productsNeedingVariants = products.filter(
    (product) =>
      !product.variantsInfo?.variants &&
      product.variantSummary?.variantCount &&
      product.variantSummary.variantCount > 0,
  );

  if (productsNeedingVariants.length === 0) {
    return products;
  }

  try {
    const productIds = productsNeedingVariants
      .map((p) => p._id)
      .filter(Boolean) as string[];

    if (productIds.length === 0) {
      return products;
    }

    const items = [];

    const res = await readOnlyVariantsV3
      .queryVariants({})
      .in("productData.productId", productIds)
      .limit(DEFAULT_QUERY_LIMIT)
      .find();

    items.push(...res.items);

    let nextRes = res;
    while (nextRes.hasNext()) {
      nextRes = await nextRes.next();
      items.push(...nextRes.items);
    }

    const variantsByProductId = new Map<string, productsV3.Variant[]>();

    items.forEach((item) => {
      const productId = item.productData?.productId;
      if (productId) {
        if (!variantsByProductId.has(productId)) {
          variantsByProductId.set(productId, []);
        }
        variantsByProductId.get(productId)!.push({
          ...item,
          choices: item.optionChoices as productsV3.Variant["choices"],
        });
      }
    });

    // Update products with their variants
    return products.map((product) => {
      const variants = variantsByProductId.get(product._id || "");
      if (variants && variants.length > 0) {
        return {
          ...product,
          variantsInfo: {
            ...product.variantsInfo,
            variants,
          },
        };
      }
      return product;
    });
  } catch (error) {
    console.error("Failed to fetch missing variants:", error);
    return products;
  }
};

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
    searchOptions: Signal<productsV3.V3ProductSearch>;
    /** Reactive signal indicating if products are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error */
    error: Signal<string | null>;
    /** Function to update search options and trigger a new search */
    setSearchOptions: (searchOptions: productsV3.V3ProductSearch) => void;
    /** Function to update only the sort part of search options */
    setSort: (sort: productsV3.V3ProductSearch["sort"]) => void;
    /** Function to update only the filter part of search options */
    setFilter: (filter: productsV3.V3ProductSearch["filter"]) => void;
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
      const searchOptionsSignal =
        signalsService.signal<productsV3.V3ProductSearch>(config.searchOptions);
      const pagingMetadataSignal =
        signalsService.signal<productsV3.CommonCursorPagingMetadata>(
          config.pagingMetadata,
        );

      const aggregationsSignal =
        signalsService.signal<productsV3.AggregationData>(config.aggregations);

      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      hydratedEffect(
        signalsService,
        async () => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const searchOptions = searchOptionsSignal.get();

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

            const result = await fetchProducts(affectiveSearchOptions);

            productsSignal.set(result.products ?? []);
            pagingMetadataSignal.set(result.pagingMetadata!);
          } catch (error) {
            errorSignal.set(
              error instanceof Error ? error.message : "Unknown error",
            );
          } finally {
            isLoadingSignal.set(false);
          }
        },
        () => firstRun,
        (value: boolean) => (firstRun = value),
      );

      return {
        products: productsSignal,
        searchOptions: searchOptionsSignal,
        pagingMetadata: pagingMetadataSignal,
        aggregations: aggregationsSignal,
        setSearchOptions: (searchOptions: productsV3.V3ProductSearch) =>
          searchOptionsSignal.set(searchOptions),
        setSort: (sort: productsV3.V3ProductSearch["sort"]) => {
          const currentOptions = searchOptionsSignal.peek();
          searchOptionsSignal.set({
            ...currentOptions,
            sort,
          });
        },
        setFilter: (filter: productsV3.V3ProductSearch["filter"]) => {
          const currentOptions = searchOptionsSignal.peek();
          searchOptionsSignal.set({
            ...currentOptions,
            filter,
          });
        },
        isLoading: isLoadingSignal,
        error: errorSignal,
      };
    },
  );
