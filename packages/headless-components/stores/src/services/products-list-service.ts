import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { customizationsV3, productsV3, readOnlyVariantsV3 } from '@wix/stores';
import { loadCategoriesListServiceConfig } from './categories-list-service.js';
import { categories } from '@wix/categories';

type Category = categories.Category;

export const DEFAULT_QUERY_LIMIT = 100;

import { SortType } from './../enums/sort-enums.js';

export { SortType } from './../enums/sort-enums.js';

/**
 * Enumeration of inventory status types available for filtering.
 * Re-exports the Wix inventory availability status enum values.
 */
export const InventoryStatusType = productsV3.InventoryAvailabilityStatus;

/**
 * Type for inventory status values.
 * Re-exports the Wix inventory availability status enum type.
 */
export type InventoryStatusType = productsV3.InventoryAvailabilityStatus;

/**
 * Interface representing a product option (like Size, Color, etc.).
 */
export interface ProductOption {
  id: string;
  name: string;
  choices: ProductChoice[];
  optionRenderType?: string;
}

/**
 * Interface representing a choice within a product option.
 */
export interface ProductChoice {
  id: string;
  name: string;
  colorCode?: string;
}

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
  /** Customizations used to fetch the products */
  customizations: customizationsV3.Customization[];
};

/**
 * Loads products list service configuration from the Wix Stores API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a list of products based on search criteria or URL parameters.
 *
 * @param {string | { searchOptions: productsV3.V3ProductSearch; initialSearchState: InitialSearchState }} input - Either a URL to parse or parsed URL result from parseUrlToSearchOptions
 * @returns {Promise<ProductsListServiceConfig>} Promise that resolves to the products list configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/products.astro
 * import { loadProductsListServiceConfig, parseUrlToSearchOptions, loadCategoriesListServiceConfig } from '@wix/stores/services';
 * import { ProductList } from '@wix/stores/components';
 *
 * // Option 1: Load from URL (will parse filters, sort, pagination from URL params)
 * const productsConfig = await loadProductsListServiceConfig(Astro.url.href);
 *
 * // Option 2: Custom parsing with defaults
 * const categories = await loadCategoriesListServiceConfig();
 * const parsed = await parseUrlToSearchOptions(
 *   Astro.url.href,
 *   categories.categories,
 *   {
 *     cursorPaging: { limit: 12 },
 *     filter: {},
 *     sort: [{ fieldName: 'name' as const, order: 'ASC' as const }]
 *   }
 * );
 * const productsConfig = await loadProductsListServiceConfig(parsed);
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
 * import { loadProductsListServiceConfig, parseUrlToSearchOptions, loadCategoriesListServiceConfig } from '@wix/stores/services';
 * import { ProductsList } from '@wix/stores/components';
 *
 * interface ProductsPageProps {
 *   productsConfig: Awaited<ReturnType<typeof loadProductsListServiceConfig>>;
 * }
 *
 * export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async ({ req }) => {
 *   // Option 1: Parse from URL
 *   const productsConfig = await loadProductsListServiceConfig(`${req.url}`);
 *
 *   // Option 2: Custom parsing with filters
 *   const categories = await loadCategoriesListServiceConfig();
 *   const parsed = await parseUrlToSearchOptions(
 *     `${req.url}`,
 *     categories.categories,
 *     {
 *       cursorPaging: { limit: 12 },
 *       filter: {
 *         'allCategoriesInfo.categories': { $matchItems: [{ _id: { $in: [category._id] } }] }
 *       },
 *       sort: [{ fieldName: 'name' as const, order: 'ASC' as const }]
 *     }
 *   );
 *   const productsConfig = await loadProductsListServiceConfig(parsed);
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
 *
 * @example
 * ```tsx
 * // Advanced: Performance optimization when using both services
 * import { parseUrlToSearchOptions, loadProductsListServiceConfig, loadProductsListSearchServiceConfig, loadCategoriesListServiceConfig } from '@wix/stores/services';
 *
 * const categories = await loadCategoriesListServiceConfig();
 * const parsed = await parseUrlToSearchOptions(url, categories.categories);
 *
 * // Both services use the same parsed result (no duplicate URL parsing)
 * const [productsConfig, searchConfig] = await Promise.all([
 *   loadProductsListServiceConfig(parsed),
 *   loadProductsListSearchServiceConfig(parsed)
 * ]);
 * ```
 */
export async function loadProductsListServiceConfig(
  input: string | { searchOptions: productsV3.V3ProductSearch },
): Promise<ProductsListServiceConfig> {
  let searchOptions: productsV3.V3ProductSearch;

  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  if (typeof input === 'string') {
    // URL input - parse it
    const categoriesListConfig = await loadCategoriesListServiceConfig();
    const { searchOptions: parsedOptions } = await parseUrlToSearchOptions(
      input,
      categoriesListConfig.categories,
      customizations,
    );
    searchOptions = parsedOptions;
  } else {
    // Parsed URL result - use searchOptions directly
    searchOptions = input.searchOptions;
  }

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
    customizations,
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
      .in('productData.productId', productIds)
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
          choices: item.optionChoices as productsV3.Variant['choices'],
        });
      }
    });

    // Update products with their variants
    return products.map((product) => {
      const variants = variantsByProductId.get(product._id || '');
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
    console.error('Failed to fetch missing variants:', error);
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
    /** Reactive signal containing the minimum price of the products */
    minPrice: Signal<number>;
    /** Reactive signal containing the maximum price of the products */
    maxPrice: Signal<number>;
    /** Reactive signal containing the available inventory statuses */
    availableInventoryStatuses: Signal<InventoryStatusType[]>;
    /** Reactive signal containing the available product options */
    availableProductOptions: Signal<ProductOption[]>;
    /** Function to update search options and trigger a new search */
    setSearchOptions: (searchOptions: productsV3.V3ProductSearch) => void;
    /** Function to update only the sort part of search options */
    setSort: (sort: productsV3.V3ProductSearch['sort']) => void;
    /** Function to update only the filter part of search options */
    setFilter: (filter: productsV3.V3ProductSearch['filter']) => void;
    /** Function to reset the filter part of search options */
    resetFilter: () => void;
    /** Reactive signal indicating if any filters are currently applied */
    isFiltered: () => ReadOnlySignal<boolean>;
    /** Function to load more products */
    loadMore: (count: number) => void;
    /** Reactive signal indicating if there are more products to load */
    hasMoreProducts: ReadOnlySignal<boolean>;
  },
  ProductsListServiceConfig
>('products-list');

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

      const minPriceSignal = signalsService.signal<number>(
        getMinPrice(config.aggregations.results!),
      );
      const maxPriceSignal = signalsService.signal<number>(
        getMaxPrice(config.aggregations.results!),
      );
      const availableProductOptionsSignal = signalsService.signal(
        getAvailableProductOptions(
          config.aggregations.results!,
          config.customizations,
        ),
      );

      const availableInventoryStatusesSignal = signalsService.signal([
        InventoryStatusType.IN_STOCK,
        InventoryStatusType.OUT_OF_STOCK,
        InventoryStatusType.PARTIALLY_OUT_OF_STOCK,
      ] as InventoryStatusType[]);

      const aggregationsSignal =
        signalsService.signal<productsV3.AggregationData>(config.aggregations);

      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      if (typeof window !== 'undefined') {
        signalsService.effect(async () => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const searchOptions = searchOptionsSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          try {
            isLoadingSignal.set(true);

            const result = await fetchProducts(searchOptions);

            productsSignal.set(result.products ?? []);

            pagingMetadataSignal.set(result.pagingMetadata!);
          } catch (error) {
            errorSignal.set(
              error instanceof Error ? error.message : 'Unknown error',
            );
          } finally {
            isLoadingSignal.set(false);
          }
        });
      }

      firstRun = false;

      const loadMoreCursor = async (count: number) => {
        const affectiveSearchOptions: Parameters<
          typeof productsV3.searchProducts
        >[0] = {
          cursorPaging: {
            cursor: pagingMetadataSignal.get().cursors?.next,
            limit: DEFAULT_QUERY_LIMIT || count,
          },
        };

        try {
          isLoadingSignal.set(true);
          const result = await fetchProducts(affectiveSearchOptions);
          productsSignal.set([
            ...productsSignal.get(),
            ...(result.products ?? []),
          ]);

          pagingMetadataSignal.set(result.pagingMetadata!);
        } catch (error) {
          errorSignal.set(
            error instanceof Error ? error.message : 'Unknown error',
          );
        } finally {
          isLoadingSignal.set(false);
        }
      };

      return {
        products: productsSignal,
        searchOptions: searchOptionsSignal,
        pagingMetadata: pagingMetadataSignal,
        aggregations: aggregationsSignal,
        /* Metadata for products list */
        minPrice: minPriceSignal,
        maxPrice: maxPriceSignal,
        availableInventoryStatuses: availableInventoryStatusesSignal,
        availableProductOptions: availableProductOptionsSignal,
        /* End of Metadata for products list */
        setSearchOptions: (searchOptions: productsV3.V3ProductSearch) => {
          searchOptionsSignal.set(searchOptions);
        },
        setSort: (sort: productsV3.V3ProductSearch['sort']) => {
          const currentOptions = searchOptionsSignal.peek();
          searchOptionsSignal.set({
            ...currentOptions,
            sort,
          });
        },
        setFilter: (filter: productsV3.V3ProductSearch['filter']) => {
          const currentOptions = searchOptionsSignal.peek();
          searchOptionsSignal.set({
            ...currentOptions,
            filter,
          });
        },
        resetFilter: () => {
          const currentOptions = searchOptionsSignal.peek();
          searchOptionsSignal.set({
            ...currentOptions,
            filter: {},
          });
        },
        isFiltered: () => {
          return signalsService.computed(() => {
            const currentOptions = searchOptionsSignal.peek();
            if (!currentOptions.filter) return false;
            return (
              currentOptions.filter !== undefined &&
              Object.keys(currentOptions.filter).length > 0
            );
          });
        },
        isLoading: isLoadingSignal,
        error: errorSignal,
        loadMore: (count: number) => {
          loadMoreCursor(count);
        },
        hasMoreProducts: signalsService.computed(
          () => pagingMetadataSignal.get().hasNext ?? false,
        ),
      };
    },
  );

function getMinPrice(aggregationData: productsV3.AggregationResults[]): number {
  const minPriceAggregation = aggregationData.find(
    (data) => data.fieldPath === 'actualPriceRange.minValue.amount',
  );
  if (minPriceAggregation?.scalar?.value) {
    return Number(minPriceAggregation.scalar.value) || 0;
  }
  return 0;
}

function getMaxPrice(aggregationData: productsV3.AggregationResults[]): number {
  const maxPriceAggregation = aggregationData.find(
    (data) => data.fieldPath === 'actualPriceRange.maxValue.amount',
  );
  if (maxPriceAggregation?.scalar?.value) {
    return Number(maxPriceAggregation.scalar.value) || 0;
  }
  return 0;
}

function getAvailableProductOptions(
  aggregationData: productsV3.AggregationResults[] = [],
  customizations: customizationsV3.Customization[] = [],
): ProductOption[] {
  const matchesAggregationName = (
    name: string,
    aggregationNames: string[],
  ): boolean => {
    return aggregationNames.some(
      (aggName) => aggName.toLowerCase() === name.toLowerCase(),
    );
  };

  const sortChoicesIntelligently = (
    choices: ProductChoice[],
  ): ProductChoice[] => {
    return [...choices].sort((a, b) => {
      const aIsNumber = /^\d+$/.test(a.name);
      const bIsNumber = /^\d+$/.test(b.name);

      if (aIsNumber && bIsNumber) {
        return parseInt(a.name) - parseInt(b.name);
      }
      if (aIsNumber && !bIsNumber) return -1;
      if (!aIsNumber && bIsNumber) return 1;

      return a.name.localeCompare(b.name);
    });
  };

  const optionNames: string[] = [];
  const choiceNames: string[] = [];

  aggregationData.forEach((result) => {
    if (result.name === 'optionNames' && result.values?.results) {
      optionNames.push(
        ...result.values.results
          .map((item) => item.value)
          .filter((value): value is string => typeof value === 'string'),
      );
    }
    if (result.name === 'choiceNames' && result.values?.results) {
      choiceNames.push(
        ...result.values.results
          .map((item) => item.value)
          .filter((value): value is string => typeof value === 'string'),
      );
    }
  });

  const options: ProductOption[] = customizations
    .filter(
      (customization) =>
        customization.name &&
        customization._id &&
        customization.customizationType ===
          customizationsV3.CustomizationType.PRODUCT_OPTION &&
        (optionNames.length === 0 ||
          matchesAggregationName(customization.name, optionNames)),
    )
    .map((customization) => {
      const choices: ProductChoice[] = (
        customization.choicesSettings?.choices || []
      )
        .filter(
          (choice) =>
            choice._id &&
            choice.name &&
            (choiceNames.length === 0 ||
              matchesAggregationName(choice.name, choiceNames)),
        )
        .map((choice) => ({
          id: choice._id!,
          name: choice.name!,
          colorCode: choice.colorCode,
        }));

      return {
        id: customization._id!,
        name: customization.name!,
        choices: sortChoicesIntelligently(choices),
        optionRenderType: customization.customizationRenderType,
      };
    })
    .filter((option) => option.choices.length > 0);

  return options;
}

/**
 * Initial search state that can be loaded from URL parameters.
 */
export type InitialSearchState = {
  sort?: SortType;
  limit?: number;
  cursor?: string | null;
  priceRange?: { min?: number; max?: number };
  inventoryStatuses?: InventoryStatusType[];
  productOptions?: Record<string, string[]>;
  category?: Category;
  visible?: boolean;
  productType?: string;
};

/**
 * Parse URL and build complete search options with all filters, sort, and pagination.
 * This function extracts search parameters, filters, sorting, and pagination from a URL
 * and converts them into the format expected by the Wix Stores API.
 *
 * @param {string} url - The URL to parse search parameters from
 * @param {Category[]} categoriesList - List of available categories for category slug resolution
 * @param {productsV3.V3ProductSearch} [defaultSearchOptions] - Default search options to merge with parsed URL parameters
 * @returns {Promise<{searchOptions: productsV3.V3ProductSearch, initialSearchState: InitialSearchState}>}
 *   Object containing both API-ready search options and UI-ready initial state
 *
 * @example
 * ```tsx
 * // Parse URL with filters, sort, and pagination
 * const categories = await loadCategoriesListServiceConfig();
 * const { searchOptions, initialSearchState } = await parseUrlToSearchOptions(
 *   'https://example.com/products?sort=price:desc&Color=red,blue&minPrice=50',
 *   categories.categories
 * );
 *
 * // Use searchOptions for API calls
 * const products = await productsV3.searchProducts(searchOptions);
 *
 * // Use initialSearchState for UI initialization
 * const filterState = initialSearchState.productOptions; // { colorId: ['red-id', 'blue-id'] }
 * ```
 */
export async function parseUrlToSearchOptions(
  url: string,
  categoriesList: Category[],
  customizations: customizationsV3.Customization[],
  defaultSearchOptions?: productsV3.V3ProductSearch,
): Promise<{
  searchOptions: productsV3.V3ProductSearch;
  initialSearchState: InitialSearchState;
}> {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  // Build search options
  const searchOptions: productsV3.V3ProductSearch = {
    cursorPaging: {
      limit: DEFAULT_QUERY_LIMIT,
    },
    ...defaultSearchOptions,
  };

  // Initialize search state for service
  const initialSearchState: InitialSearchState = {};

  // Extract category slug from URL path
  // The category slug is always the last segment of the path
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  let category: Category | undefined = undefined;

  if (pathSegments.length > 0) {
    const lastSegment = pathSegments[pathSegments.length - 1];
    // Check if the last segment matches any category in the categories list
    category = categoriesList.find((cat) => cat.slug === lastSegment);
    if (category) {
      initialSearchState.category = category;
    }
  }

  // Handle text search (q parameter)
  const query = searchParams.get('q');
  if (query) {
    searchOptions.search = {
      expression: query,
    };
  }

  // Handle sorting
  const sort = searchParams.get('sort');
  if (sort) {
    const sortType = convertUrlSortToSortType(sort);
    if (sortType) {
      initialSearchState.sort = sortType;

      // Apply sort to search options
      switch (sortType) {
        case SortType.NAME_ASC:
          searchOptions.sort = [
            { fieldName: 'name', order: productsV3.SortDirection.ASC },
          ];
          break;
        case SortType.NAME_DESC:
          searchOptions.sort = [
            { fieldName: 'name', order: productsV3.SortDirection.DESC },
          ];
          break;
        case SortType.PRICE_ASC:
          searchOptions.sort = [
            {
              fieldName: 'actualPriceRange.minValue.amount',
              order: productsV3.SortDirection.ASC,
            },
          ];
          break;
        case SortType.PRICE_DESC:
          searchOptions.sort = [
            {
              fieldName: 'actualPriceRange.minValue.amount',
              order: productsV3.SortDirection.DESC,
            },
          ];
          break;
        case SortType.RECOMMENDED:
          searchOptions.sort = [
            {
              fieldName: 'name',
              order: productsV3.SortDirection.DESC,
            },
          ];
          break;
      }
    }
  }

  // Handle pagination
  const limit = searchParams.get('limit');
  const cursor = searchParams.get('cursor');
  if (limit || cursor) {
    searchOptions.cursorPaging = {};
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        searchOptions.cursorPaging.limit = limitNum;
        initialSearchState.limit = limitNum;
      }
    }
    if (cursor) {
      searchOptions.cursorPaging.cursor = cursor;
      initialSearchState.cursor = cursor;
    }
  }

  // Handle filtering for search options
  const filter: Record<string, any> = {};

  const visible = searchParams.get('visible');
  if (visible !== null) {
    filter['visible'] = visible === 'true';
    initialSearchState.visible = visible === 'true';
  }

  const productType = searchParams.get('productType');
  if (productType) {
    filter['productType'] = productType;
    initialSearchState.productType = productType;
  }

  // Add category filter if found
  if (category) {
    filter['allCategoriesInfo.categories'] = {
      $matchItems: [{ _id: { $in: [category._id] } }],
    };
  }

  // Price range filtering
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  if (minPrice || maxPrice) {
    initialSearchState.priceRange = {};

    if (minPrice) {
      const minPriceNum = parseFloat(minPrice);
      if (!isNaN(minPriceNum)) {
        filter['actualPriceRange.minValue.amount'] = { $gte: minPriceNum };
        initialSearchState.priceRange.min = minPriceNum;
      }
    }
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      if (!isNaN(maxPriceNum)) {
        filter['actualPriceRange.maxValue.amount'] = { $lte: maxPriceNum };
        initialSearchState.priceRange.max = maxPriceNum;
      }
    }
  }

  const inventoryStatus = searchParams.get('inventoryStatus');
  if (inventoryStatus) {
    filter['inventory.availabilityStatus'] = {
      $in: inventoryStatus.split(',') as InventoryStatusType[],
    };
  }

  // Parse product options from URL parameters
  const reservedParams = [
    'minPrice',
    'maxPrice',
    'inventory_status',
    'inventoryStatus',
    'visible',
    'productType',
    'q',
    'limit',
    'cursor',
    'sort',
  ];

  const productOptionsById: Record<string, string[]> = {};

  for (const [optionName, optionValues] of searchParams.entries()) {
    if (reservedParams.includes(optionName)) continue;

    // Find the option by name in customizations
    const option = customizations.find(
      (c) =>
        c.name === optionName &&
        c.customizationType ===
          customizationsV3.CustomizationType.PRODUCT_OPTION,
    );

    if (option && option._id) {
      const choiceValues = optionValues.split(',').filter(Boolean);
      const choiceIds: string[] = [];

      // Convert choice names to IDs
      for (const choiceName of choiceValues) {
        const choice = option.choicesSettings?.choices?.find(
          (c) => c.name === choiceName,
        );

        if (choice && choice._id) {
          choiceIds.push(choice._id);
        }
      }

      if (choiceIds.length > 0) {
        productOptionsById[option._id] = choiceIds;
      }
    }
  }

  if (Object.keys(productOptionsById).length > 0) {
    initialSearchState.productOptions = productOptionsById;

    // Add product option filter to search options
    filter[`options.choicesSettings.choices.choiceId`] = {
      $hasSome: Object.values(productOptionsById).flat(),
    };
  }

  // Add filter to search options if any filters were set
  if (Object.keys(filter).length > 0) {
    searchOptions.filter = filter;
  }

  // Add aggregations for getting filter options
  searchOptions.aggregations = [
    {
      name: 'minPrice',
      fieldPath: 'actualPriceRange.minValue.amount',
      type: 'SCALAR' as const,
      scalar: { type: 'MIN' as const },
    },
    {
      name: 'maxPrice',
      fieldPath: 'actualPriceRange.maxValue.amount',
      type: 'SCALAR' as const,
      scalar: { type: 'MAX' as const },
    },
    {
      name: 'optionNames',
      fieldPath: 'options.name',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 20,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: 'choiceNames',
      fieldPath: 'options.choicesSettings.choices.name',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 50,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: 'inventoryStatus',
      fieldPath: 'inventory.availabilityStatus',
      type: productsV3.SortType.VALUE,
      value: {
        limit: 10,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
  ];

  return { searchOptions, initialSearchState };
}

/**
 * Convert SortType enum to URL format
 */
function convertSortTypeToUrl(sortType: SortType): string {
  switch (sortType) {
    case SortType.NAME_ASC:
      return 'name';
    case SortType.NAME_DESC:
      return 'name:desc';
    case SortType.PRICE_ASC:
      return 'price';
    case SortType.PRICE_DESC:
      return 'price:desc';
    case SortType.NEWEST:
      return 'newest';
    case SortType.RECOMMENDED:
      return 'recommended';
    default:
      return 'name';
  }
}

/**
 * Convert URL sort format to SortType enum
 */
export function convertUrlSortToSortType(urlSort: string): SortType | null {
  const sortParts = urlSort.split(':');
  const field = sortParts[0]?.toLowerCase();
  const order = sortParts[1]?.toLowerCase() === 'desc' ? 'desc' : 'asc';

  switch (field) {
    case 'name':
      return order === 'desc' ? SortType.NAME_DESC : SortType.NAME_ASC;
    case 'price':
      return order === 'desc' ? SortType.PRICE_DESC : SortType.PRICE_ASC;
    case 'newest':
    case 'created':
      return SortType.NEWEST;
    case 'recommended':
      return SortType.RECOMMENDED;
    default:
      return null;
  }
}

/**
 * Update URL with current search state (sort, filters, pagination)
 */
//@ts-expect-error
function updateUrlWithSearchState(searchState: {
  sort: string;
  filters: InitialSearchState;
  customizations: customizationsV3.Customization[];
  catalogBounds: { minPrice: number; maxPrice: number };
  categorySlug?: string;
}): void {
  if (typeof window === 'undefined') return;

  const { sort, filters, customizations, catalogBounds, categorySlug } =
    searchState;

  // Convert filter IDs back to human-readable names for URL
  const humanReadableOptions: Record<string, string[]> = {};
  for (const [optionId, choiceIds] of Object.entries(
    filters?.productOptions ?? {},
  )) {
    const option = customizations.find((c) => c._id === optionId);
    if (option && option.name) {
      const choiceNames: string[] = [];
      for (const choiceId of choiceIds) {
        const choice = option.choicesSettings?.choices?.find(
          (c: customizationsV3.Choice) => c._id === choiceId,
        );
        if (choice && choice.name) {
          choiceNames.push(choice.name);
        }
      }
      if (choiceNames.length > 0) {
        humanReadableOptions[option.name] = choiceNames;
      }
    }
  }

  // Start with current URL parameters to preserve non-search parameters
  const params = new URLSearchParams(window.location.search);

  // Define search-related parameters that we manage
  const searchParams = [
    'sort',
    'limit',
    'cursor',
    'minPrice',
    'maxPrice',
    'inventoryStatus',
    'visible',
    'productType',
    // Product option names will be dynamically added below
    // Note: category is NOT included here as it's handled in the URL path
  ];

  // Remove existing search parameters first
  searchParams.forEach((param) => params.delete(param));

  // Remove existing product option parameters (they have dynamic names)
  for (const customization of customizations) {
    if (
      customization.customizationType ===
        customizationsV3.CustomizationType.PRODUCT_OPTION &&
      customization.name
    ) {
      params.delete(customization.name);
    }
  }

  // Add sort parameter (only if not default)
  const urlSort = convertSortTypeToUrl(sort as SortType);
  if (sort !== SortType.NAME_ASC) {
    params.set('sort', urlSort);
  }

  // Add price range parameters only if they differ from catalog bounds
  if (
    filters.priceRange?.min &&
    filters.priceRange.min > catalogBounds.minPrice
  ) {
    params.set('minPrice', filters.priceRange.min.toString());
  }
  if (
    filters.priceRange?.max &&
    filters.priceRange.max < catalogBounds.maxPrice
  ) {
    params.set('maxPrice', filters.priceRange.max.toString());
  }

  // Add inventory status parameters
  if (filters.inventoryStatuses && filters.inventoryStatuses.length > 0) {
    params.set('inventoryStatus', filters.inventoryStatuses.join(','));
  }

  // Add visibility filter (only if explicitly false, since true is default)
  if (filters.visible === false) {
    params.set('visible', 'false');
  }

  // Add product type filter
  if (filters.productType) {
    params.set('productType', filters.productType);
  }

  // Add product options as individual parameters (Color=Red,Blue&Size=Large)
  for (const [optionName, values] of Object.entries(humanReadableOptions)) {
    if (values.length > 0) {
      params.set(optionName, values.join(','));
    }
  }

  // Handle URL path construction with category
  let baseUrl = window.location.pathname;

  // If categorySlug is provided, replace the last path segment (which represents the category)
  if (categorySlug) {
    const pathSegments = baseUrl.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      // Replace the last segment with the new category slug
      pathSegments[pathSegments.length - 1] = categorySlug;
      baseUrl = '/' + pathSegments.join('/');
    } else {
      // If no segments, just use the category slug
      baseUrl = `/${categorySlug}`;
    }
  }

  // Build the new URL
  const newUrl = params.toString()
    ? `${baseUrl}?${params.toString()}`
    : baseUrl;

  // Only update if URL actually changed
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.pushState(null, '', newUrl);
  }
}
