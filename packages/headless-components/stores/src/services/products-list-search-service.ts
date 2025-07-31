import type { Signal } from "@wix/services-definitions/core-services/signals";
import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import {
  DEFAULT_QUERY_LIMIT,
  ProductsListServiceDefinition,
} from "./products-list-service.js";
import { productsV3, customizationsV3 } from "@wix/stores";
import { type Category } from "./category-service.js";
import { loadCategoriesListServiceConfig } from "./categories-list-service.js";

const PRICE_FILTER_DEBOUNCE_TIME = 300;

import { SortType } from "./../enums/sort-enums.js";

export { SortType } from "./../enums/sort-enums.js";

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
 * Configuration interface for the Products List Search service.
 */
export type ProductsListSearchServiceConfig = {
  customizations: customizationsV3.Customization[];
  initialSearchState?: InitialSearchState;
};

/**
 * Service definition for the Products List Search service.
 * This consolidates sort, pagination, and filtering functionality.
 */
export const ProductsListSearchServiceDefinition = defineService<{
  // Sort functionality
  selectedSortOption: Signal<string>;
  sortOptions: SortType[];
  setSelectedSortOption: (sort: string) => void;

  // Pagination functionality
  currentLimit: Signal<number>;
  currentCursor: Signal<string | null>;
  hasNextPage: { get: () => boolean };
  hasPrevPage: { get: () => boolean };
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  navigateToFirstPage: () => void;
  loadMore: (count: number) => void;

  // Filter functionality
  selectedMinPrice: Signal<number>;
  selectedMaxPrice: Signal<number>;
  availableMinPrice: Signal<number>;
  availableMaxPrice: Signal<number>;
  availableInventoryStatuses: Signal<InventoryStatusType[]>;
  selectedInventoryStatuses: Signal<InventoryStatusType[]>;
  availableProductOptions: Signal<ProductOption[]>;
  selectedProductOptions: Signal<Record<string, string[]>>;
  selectedCategory: Signal<Category | null>;

  setSelectedMinPrice: (minPrice: number) => void;
  setSelectedMaxPrice: (maxPrice: number) => void;
  toggleInventoryStatus: (status: InventoryStatusType) => void;
  toggleProductOption: (optionId: string, choiceId: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  isFiltered: { get: () => boolean };
  reset: () => void;
}>("products-list-search");

/**
 * Convert SortType enum to URL format
 */
function convertSortTypeToUrl(sortType: SortType): string {
  switch (sortType) {
    case SortType.NAME_ASC:
      return "name";
    case SortType.NAME_DESC:
      return "name:desc";
    case SortType.PRICE_ASC:
      return "price";
    case SortType.PRICE_DESC:
      return "price:desc";
    case SortType.NEWEST:
      return "newest";
    case SortType.RECOMMENDED:
      return "recommended";
    default:
      return "name";
  }
}

/**
 * Convert URL sort format to SortType enum
 */
export function convertUrlSortToSortType(urlSort: string): SortType | null {
  const sortParts = urlSort.split(":");
  const field = sortParts[0]?.toLowerCase();
  const order = sortParts[1]?.toLowerCase() === "desc" ? "desc" : "asc";

  switch (field) {
    case "name":
      return order === "desc" ? SortType.NAME_DESC : SortType.NAME_ASC;
    case "price":
      return order === "desc" ? SortType.PRICE_DESC : SortType.PRICE_ASC;
    case "newest":
    case "created":
      return SortType.NEWEST;
    case "recommended":
      return SortType.RECOMMENDED;
    default:
      return null;
  }
}

/**
 * Update URL with current search state (sort, filters, pagination)
 */
function updateUrlWithSearchState(searchState: {
  sort: string;
  filters: InitialSearchState;
  customizations: customizationsV3.Customization[];
  catalogBounds: { minPrice: number; maxPrice: number };
  categorySlug?: string;
}): void {
  if (typeof window === "undefined") return;

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
    "sort",
    "limit",
    "cursor",
    "minPrice",
    "maxPrice",
    "inventoryStatus",
    "visible",
    "productType",
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
    params.set("sort", urlSort);
  }

  // Add price range parameters only if they differ from catalog bounds
  if (
    filters.priceRange?.min &&
    filters.priceRange.min > catalogBounds.minPrice
  ) {
    params.set("minPrice", filters.priceRange.min.toString());
  }
  if (
    filters.priceRange?.max &&
    filters.priceRange.max < catalogBounds.maxPrice
  ) {
    params.set("maxPrice", filters.priceRange.max.toString());
  }

  // Add inventory status parameters
  if (filters.inventoryStatuses && filters.inventoryStatuses.length > 0) {
    params.set("inventoryStatus", filters.inventoryStatuses.join(","));
  }

  // Add visibility filter (only if explicitly false, since true is default)
  if (filters.visible === false) {
    params.set("visible", "false");
  }

  // Add product type filter
  if (filters.productType) {
    params.set("productType", filters.productType);
  }

  // Add product options as individual parameters (Color=Red,Blue&Size=Large)
  for (const [optionName, values] of Object.entries(humanReadableOptions)) {
    if (values.length > 0) {
      params.set(optionName, values.join(","));
    }
  }

  // Handle URL path construction with category
  let baseUrl = window.location.pathname;

  // If categorySlug is provided, replace the last path segment (which represents the category)
  if (categorySlug) {
    const pathSegments = baseUrl.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      // Replace the last segment with the new category slug
      pathSegments[pathSegments.length - 1] = categorySlug;
      baseUrl = "/" + pathSegments.join("/");
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
    window.history.pushState(null, "", newUrl);
  }
}

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
  defaultSearchOptions?: productsV3.V3ProductSearch,
): Promise<{
  searchOptions: productsV3.V3ProductSearch;
  initialSearchState: InitialSearchState;
}> {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  // Get customizations for product option parsing
  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

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
  const pathSegments = urlObj.pathname.split("/").filter(Boolean);
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
  const query = searchParams.get("q");
  if (query) {
    searchOptions.search = {
      expression: query,
    };
  }

  // Handle sorting
  const sort = searchParams.get("sort");
  if (sort) {
    const sortType = convertUrlSortToSortType(sort);
    if (sortType) {
      initialSearchState.sort = sortType;

      // Apply sort to search options
      switch (sortType) {
        case SortType.NAME_ASC:
          searchOptions.sort = [
            { fieldName: "name", order: productsV3.SortDirection.ASC },
          ];
          break;
        case SortType.NAME_DESC:
          searchOptions.sort = [
            { fieldName: "name", order: productsV3.SortDirection.DESC },
          ];
          break;
        case SortType.PRICE_ASC:
          searchOptions.sort = [
            {
              fieldName: "actualPriceRange.minValue.amount",
              order: productsV3.SortDirection.ASC,
            },
          ];
          break;
        case SortType.PRICE_DESC:
          searchOptions.sort = [
            {
              fieldName: "actualPriceRange.minValue.amount",
              order: productsV3.SortDirection.DESC,
            },
          ];
          break;
        case SortType.RECOMMENDED:
          searchOptions.sort = [
            {
              fieldName: "name",
              order: productsV3.SortDirection.DESC,
            },
          ];
          break;
      }
    }
  }

  // Handle pagination
  const limit = searchParams.get("limit");
  const cursor = searchParams.get("cursor");
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

  const visible = searchParams.get("visible");
  if (visible !== null) {
    filter["visible"] = visible === "true";
    initialSearchState.visible = visible === "true";
  }

  const productType = searchParams.get("productType");
  if (productType) {
    filter["productType"] = productType;
    initialSearchState.productType = productType;
  }

  // Add category filter if found
  if (category) {
    filter["allCategoriesInfo.categories"] = {
      $matchItems: [{ _id: { $in: [category._id] } }],
    };
  }

  // Price range filtering
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    initialSearchState.priceRange = {};

    if (minPrice) {
      const minPriceNum = parseFloat(minPrice);
      if (!isNaN(minPriceNum)) {
        filter["actualPriceRange.minValue.amount"] = { $gte: minPriceNum };
        initialSearchState.priceRange.min = minPriceNum;
      }
    }
    if (maxPrice) {
      const maxPriceNum = parseFloat(maxPrice);
      if (!isNaN(maxPriceNum)) {
        filter["actualPriceRange.maxValue.amount"] = { $lte: maxPriceNum };
        initialSearchState.priceRange.max = maxPriceNum;
      }
    }
  }

  // Parse product options from URL parameters
  const reservedParams = [
    "minPrice",
    "maxPrice",
    "inventory_status",
    "inventoryStatus",
    "visible",
    "productType",
    "q",
    "limit",
    "cursor",
    "sort",
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
      const choiceValues = optionValues.split(",").filter(Boolean);
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

        // Add product option filter to search options
        filter[`options.choicesSettings.choices.choiceId`] = {
          $hasSome: choiceIds,
        };
      }
    }
  }

  if (Object.keys(productOptionsById).length > 0) {
    initialSearchState.productOptions = productOptionsById;
  }

  // Add filter to search options if any filters were set
  if (Object.keys(filter).length > 0) {
    searchOptions.filter = filter;
  }

  // Add aggregations for getting filter options
  searchOptions.aggregations = [
    {
      name: "minPrice",
      fieldPath: "actualPriceRange.minValue.amount",
      type: "SCALAR" as const,
      scalar: { type: "MIN" as const },
    },
    {
      name: "maxPrice",
      fieldPath: "actualPriceRange.maxValue.amount",
      type: "SCALAR" as const,
      scalar: { type: "MAX" as const },
    },
    {
      name: "optionNames",
      fieldPath: "options.name",
      type: productsV3.SortType.VALUE,
      value: {
        limit: 20,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: "choiceNames",
      fieldPath: "options.choicesSettings.choices.name",
      type: productsV3.SortType.VALUE,
      value: {
        limit: 50,
        sortType: productsV3.SortType.VALUE,
        sortDirection: productsV3.SortDirection.ASC,
      },
    },
    {
      name: "inventoryStatus",
      fieldPath: "inventory.availabilityStatus",
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
 * Load search service configuration from URL or parsed URL result.
 * This function provides the configuration for the Products List Search service,
 * including customizations and initial search state.
 *
 * @param {string | { searchOptions: productsV3.V3ProductSearch; initialSearchState: InitialSearchState }} input - Either a URL to parse or parsed URL result from parseUrlToSearchOptions
 * @returns {Promise<ProductsListSearchServiceConfig>} Promise that resolves to the search service configuration
 *
 * @example
 * ```tsx
 * // Option 1: Load from URL (will parse filters, sort, pagination from URL params)
 * const searchConfig = await loadProductsListSearchServiceConfig(window.location.href);
 *
 * // Option 2: Custom parsing with defaults
 * const categories = await loadCategoriesListServiceConfig();
 * const parsed = await parseUrlToSearchOptions(
 *   window.location.href,
 *   categories.categories,
 *   {
 *     cursorPaging: { limit: 12 },
 *     filter: { 'categoryIds': ['123'] },
 *     sort: [{ fieldName: 'name' as const, order: 'ASC' as const }]
 *   }
 * );
 * const searchConfig = await loadProductsListSearchServiceConfig(parsed);
 *
 * // Option 3: Performance optimization - use parsed result for both services (no duplicate parsing)
 * const categories = await loadCategoriesListServiceConfig();
 * const parsed = await parseUrlToSearchOptions(url, categories.categories);
 * const [productsConfig, searchConfig] = await Promise.all([
 *   loadProductsListServiceConfig(parsed),
 *   loadProductsListSearchServiceConfig(parsed),
 * ]);
 * ```
 */
export async function loadProductsListSearchServiceConfig(
  input:
    | string
    | {
        searchOptions: productsV3.V3ProductSearch;
        initialSearchState: InitialSearchState;
      },
): Promise<ProductsListSearchServiceConfig> {
  let initialSearchState: InitialSearchState;

  if (typeof input === "string") {
    // URL input - parse it
    const categoriesListConfig = await loadCategoriesListServiceConfig();
    const { initialSearchState: parsedState } = await parseUrlToSearchOptions(
      input,
      categoriesListConfig.categories,
    );
    initialSearchState = parsedState;
  } else {
    // Parsed URL result - use initialSearchState directly (no duplicate work)
    initialSearchState = input.initialSearchState;
  }

  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  return {
    customizations,
    initialSearchState,
  };
}

/**
 * Implementation of the Products List Search service
 */
export const ProductsListSearchService =
  implementService.withConfig<ProductsListSearchServiceConfig>()(
    ProductsListSearchServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);
      const { customizations, initialSearchState } = config;

      const aggregationData = productsListService.aggregations.get()?.results;
      const currentSearchOptions = productsListService.searchOptions.get();

      // Sort signals
      const selectedSortOptionSignal = signalsService.signal<string>(
        initialSearchState?.sort || SortType.NAME_ASC,
      );

      // Pagination signals
      const currentLimitSignal = signalsService.signal(
        initialSearchState?.limit || getCurrentLimit(currentSearchOptions),
      );
      const currentCursorSignal = signalsService.signal<string | null>(
        initialSearchState?.cursor || getCurrentCursor(currentSearchOptions),
      );

      // Filter signals
      const catalogPriceRange = getCatalogPriceRange(aggregationData || []);

      const userFilterMinPriceSignal = signalsService.signal(
        initialSearchState?.priceRange?.min ?? catalogPriceRange.minPrice,
      );
      const userFilterMaxPriceSignal = signalsService.signal(
        initialSearchState?.priceRange?.max ?? catalogPriceRange.maxPrice,
      );

      const catalogMinPriceSignal = signalsService.signal(
        catalogPriceRange.minPrice,
      );
      const catalogMaxPriceSignal = signalsService.signal(
        catalogPriceRange.maxPrice,
      );

      const availableInventoryStatusesSignal = signalsService.signal([
        InventoryStatusType.IN_STOCK,
        InventoryStatusType.OUT_OF_STOCK,
        InventoryStatusType.PARTIALLY_OUT_OF_STOCK,
      ] as InventoryStatusType[]);

      const selectedInventoryStatusesSignal = signalsService.signal(
        initialSearchState?.inventoryStatuses || [],
      );

      const availableProductOptionsSignal = signalsService.signal(
        getAvailableProductOptions(aggregationData, customizations),
      );

      const selectedProductOptionsSignal = signalsService.signal(
        initialSearchState?.productOptions || {},
      );

      const selectedCategorySignal = signalsService.signal(
        initialSearchState?.category || null,
      );
      const selectedVisibleSignal = signalsService.signal(
        initialSearchState?.visible ?? null,
      );
      const selectedProductTypeSignal = signalsService.signal(
        initialSearchState?.productType || null,
      );

      // Computed signal to check if any filters are applied
      const isFilteredSignal = signalsService.computed(() => {
        const catalogPriceRange = getCatalogPriceRange(
          productsListService.aggregations.get()?.results || [],
        );
        const minPrice = userFilterMinPriceSignal.get();
        const maxPrice = userFilterMaxPriceSignal.get();
        const selectedInventoryStatuses = selectedInventoryStatusesSignal.get();
        const selectedProductOptions = selectedProductOptionsSignal.get();
        const selectedCategory = selectedCategorySignal.get();
        const selectedVisible = selectedVisibleSignal.get();
        const selectedProductType = selectedProductTypeSignal.get();

        // Check if any filters are different from default values
        const hasPriceFilter =
          minPrice > catalogPriceRange.minPrice ||
          maxPrice < catalogPriceRange.maxPrice;
        const hasInventoryFilter = selectedInventoryStatuses.length > 0;
        const hasProductOptionsFilter =
          Object.keys(selectedProductOptions).length > 0;
        const hasCategoryFilter = selectedCategory !== null;
        const hasVisibilityFilter = selectedVisible !== null;
        const hasProductTypeFilter = selectedProductType !== null;

        return (
          hasPriceFilter ||
          hasInventoryFilter ||
          hasProductOptionsFilter ||
          hasCategoryFilter ||
          hasVisibilityFilter ||
          hasProductTypeFilter
        );
      });

      // Computed signals for pagination
      const hasNextPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return pagingMetadata?.hasNext || false;
      });

      const hasPrevPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return typeof pagingMetadata.cursors?.prev !== "undefined";
      });

      // Debounce timeout IDs for price filters
      let minPriceTimeoutId: NodeJS.Timeout | null = null;
      let maxPriceTimeoutId: NodeJS.Timeout | null = null;

      if (typeof window !== "undefined") {
        // Watch for changes in any search parameters and update search options
        signalsService.effect(() => {
          // Read all signals to establish dependencies
          const sort = selectedSortOptionSignal.get();
          const limit = currentLimitSignal.get();
          const cursor = currentCursorSignal.get();
          const minPrice = userFilterMinPriceSignal.get();
          const maxPrice = userFilterMaxPriceSignal.get();
          const selectedInventoryStatuses =
            selectedInventoryStatusesSignal.get();
          const selectedProductOptions = selectedProductOptionsSignal.get();
          const selectedCategory = selectedCategorySignal.get();
          const selectedVisible = selectedVisibleSignal.get();
          const selectedProductType = selectedProductTypeSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          // Build complete new search options
          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            ...productsListService.searchOptions.peek(),
          };

          // Update pagination
          if (limit > 0) {
            newSearchOptions.cursorPaging = {
              limit,
              ...(cursor && { cursor }),
            };
          } else {
            delete newSearchOptions.cursorPaging;
          }

          // Update sort
          switch (sort) {
            case SortType.NAME_ASC:
              newSearchOptions.sort = [
                { fieldName: "name", order: productsV3.SortDirection.ASC },
              ];
              break;
            case SortType.NAME_DESC:
              newSearchOptions.sort = [
                { fieldName: "name", order: productsV3.SortDirection.DESC },
              ];
              break;
            case SortType.PRICE_ASC:
              newSearchOptions.sort = [
                {
                  fieldName: "actualPriceRange.minValue.amount",
                  order: productsV3.SortDirection.ASC,
                },
              ];
              break;
            case SortType.PRICE_DESC:
              newSearchOptions.sort = [
                {
                  fieldName: "actualPriceRange.minValue.amount",
                  order: productsV3.SortDirection.DESC,
                },
              ];
              break;
            case SortType.RECOMMENDED:
              newSearchOptions.sort = [
                {
                  fieldName: "name",
                  order: productsV3.SortDirection.DESC,
                },
              ];
              break;
          }

          // Update filters
          if (!newSearchOptions.filter) {
            newSearchOptions.filter = {};
          } else {
            newSearchOptions.filter = { ...newSearchOptions.filter };
          }

          // Remove existing filters
          delete (newSearchOptions.filter as any)[
            "actualPriceRange.minValue.amount"
          ];
          delete (newSearchOptions.filter as any)[
            "actualPriceRange.maxValue.amount"
          ];
          delete (newSearchOptions.filter as any)[
            "inventory.availabilityStatus"
          ];
          delete (newSearchOptions.filter as any)[
            "allCategoriesInfo.categories"
          ];
          delete (newSearchOptions.filter as any)["visible"];
          delete (newSearchOptions.filter as any)["productType"];

          // Remove existing product option filters
          Object.keys(newSearchOptions.filter).forEach((key) => {
            if (key.startsWith("options.")) {
              delete (newSearchOptions.filter as any)[key];
            }
          });

          // Add new filters
          if (minPrice > 0) {
            (newSearchOptions.filter as any)[
              "actualPriceRange.minValue.amount"
            ] = { $gte: minPrice };
          }
          if (maxPrice > 0) {
            (newSearchOptions.filter as any)[
              "actualPriceRange.maxValue.amount"
            ] = { $lte: maxPrice };
          }
          if (selectedInventoryStatuses.length > 0) {
            if (selectedInventoryStatuses.length === 1) {
              (newSearchOptions.filter as any)["inventory.availabilityStatus"] =
                selectedInventoryStatuses[0];
            } else {
              (newSearchOptions.filter as any)["inventory.availabilityStatus"] =
                { $in: selectedInventoryStatuses };
            }
          }
          if (
            selectedProductOptions &&
            Object.keys(selectedProductOptions).length > 0
          ) {
            const allChoiceIds: string[] = [];
            for (const choiceIds of Object.values(selectedProductOptions)) {
              allChoiceIds.push(...choiceIds);
            }
            if (allChoiceIds.length > 0) {
              (newSearchOptions.filter as any)[
                "options.choicesSettings.choices.choiceId"
              ] = { $hasSome: allChoiceIds };
            }
          }
          if (selectedCategory) {
            (newSearchOptions.filter as any)["allCategoriesInfo.categories"] = {
              $matchItems: [{ _id: { $in: [selectedCategory._id] } }],
            };
          }
          if (selectedVisible !== null) {
            (newSearchOptions.filter as any)["visible"] = selectedVisible;
          }
          if (selectedProductType) {
            (newSearchOptions.filter as any)["productType"] =
              selectedProductType;
          }

          // Update the products list service
          productsListService.setSearchOptions(newSearchOptions);

          // Update URL with current search state
          const catalogBounds = {
            minPrice: catalogMinPriceSignal.get(),
            maxPrice: catalogMaxPriceSignal.get(),
          };

          const currentFilters = {
            priceRange: { min: minPrice, max: maxPrice },
            inventoryStatuses: selectedInventoryStatuses,
            productOptions: selectedProductOptions,
            ...(selectedVisible !== null && { visible: selectedVisible }),
            ...(selectedProductType && { productType: selectedProductType }),
          };

          updateUrlWithSearchState({
            sort,
            filters: currentFilters,
            customizations,
            catalogBounds,
            categorySlug: selectedCategory?.slug || undefined,
          });
        });
      }

      return {
        // Sort functionality
        selectedSortOption: selectedSortOptionSignal,
        sortOptions: Object.values(SortType),
        setSelectedSortOption: (sort: string) =>
          selectedSortOptionSignal.set(sort),

        // Pagination functionality
        currentLimit: currentLimitSignal,
        currentCursor: currentCursorSignal,
        hasNextPage: hasNextPageSignal,
        hasPrevPage: hasPrevPageSignal,
        setLimit: (limit: number) => {
          currentLimitSignal.set(limit);
          currentCursorSignal.set(null); // Reset pagination when changing page size
        },
        loadMore: (count: number) => {
          const limit = currentLimitSignal.get();
          currentLimitSignal.set(limit + count);
        },
        nextPage: () => {
          const pagingMetadata = productsListService.pagingMetadata.get();
          const nextCursor = pagingMetadata?.cursors?.next;
          if (nextCursor) {
            currentCursorSignal.set(nextCursor);
          }
        },
        prevPage: () => {
          const pagingMetadata = productsListService.pagingMetadata.get();
          const previousCursor = pagingMetadata?.cursors?.prev;
          if (previousCursor) {
            currentCursorSignal.set(previousCursor);
          }
        },
        navigateToFirstPage: () => {
          currentCursorSignal.set(null);
        },

        // Filter functionality
        selectedMinPrice: userFilterMinPriceSignal,
        selectedMaxPrice: userFilterMaxPriceSignal,
        availableMinPrice: catalogMinPriceSignal,
        availableMaxPrice: catalogMaxPriceSignal,
        availableInventoryStatuses: availableInventoryStatusesSignal,
        selectedInventoryStatuses: selectedInventoryStatusesSignal,
        availableProductOptions: availableProductOptionsSignal,
        selectedProductOptions: selectedProductOptionsSignal,
        selectedCategory: selectedCategorySignal,
        setSelectedMinPrice: (minPrice: number) => {
          if (minPriceTimeoutId) {
            clearTimeout(minPriceTimeoutId);
          }
          minPriceTimeoutId = setTimeout(() => {
            userFilterMinPriceSignal.set(minPrice);
            minPriceTimeoutId = null;
          }, PRICE_FILTER_DEBOUNCE_TIME);
        },
        setSelectedMaxPrice: (maxPrice: number) => {
          if (maxPriceTimeoutId) {
            clearTimeout(maxPriceTimeoutId);
          }
          maxPriceTimeoutId = setTimeout(() => {
            userFilterMaxPriceSignal.set(maxPrice);
            maxPriceTimeoutId = null;
          }, PRICE_FILTER_DEBOUNCE_TIME);
        },
        toggleInventoryStatus: (status: InventoryStatusType) => {
          const current = selectedInventoryStatusesSignal.get();
          const isSelected = current.includes(status);
          if (isSelected) {
            selectedInventoryStatusesSignal.set(
              current.filter((s: InventoryStatusType) => s !== status),
            );
          } else {
            selectedInventoryStatusesSignal.set([...current, status]);
          }
        },
        toggleProductOption: (optionId: string, choiceId: string) => {
          const current = selectedProductOptionsSignal.get();
          const currentChoices = current[optionId] || [];
          const isSelected = currentChoices.includes(choiceId);

          if (isSelected) {
            const newChoices = currentChoices.filter((id) => id !== choiceId);
            if (newChoices.length === 0) {
              const newOptions = { ...current };
              delete newOptions[optionId];
              selectedProductOptionsSignal.set(newOptions);
            } else {
              selectedProductOptionsSignal.set({
                ...current,
                [optionId]: newChoices,
              });
            }
          } else {
            selectedProductOptionsSignal.set({
              ...current,
              [optionId]: [...currentChoices, choiceId],
            });
          }
        },
        setSelectedCategory: (category: Category | null) => {
          selectedCategorySignal.set(category);
        },
        setSelectedVisible: (visible: boolean | null) => {
          selectedVisibleSignal.set(visible);
        },
        setSelectedProductType: (productType: string | null) => {
          selectedProductTypeSignal.set(productType);
        },
        isFiltered: isFilteredSignal,
        reset: () => {
          selectedSortOptionSignal.set(SortType.NAME_ASC);
          currentLimitSignal.set(DEFAULT_QUERY_LIMIT);
          currentCursorSignal.set(null);
          userFilterMinPriceSignal.set(catalogMinPriceSignal.get());
          userFilterMaxPriceSignal.set(catalogMaxPriceSignal.get());
          selectedInventoryStatusesSignal.set([]);
          selectedProductOptionsSignal.set({});
          selectedCategorySignal.set(null);
          selectedVisibleSignal.set(null);
          selectedProductTypeSignal.set(null);
        },
      };
    },
  );

// Helper functions (copied from the original services)

function getCurrentLimit(searchOptions: productsV3.V3ProductSearch): number {
  return searchOptions.cursorPaging?.limit || DEFAULT_QUERY_LIMIT;
}

function getCurrentCursor(
  searchOptions: productsV3.V3ProductSearch,
): string | null {
  return searchOptions.cursorPaging?.cursor || null;
}

function getCatalogPriceRange(
  aggregationData: productsV3.AggregationResults[],
): { minPrice: number; maxPrice: number } {
  const minPrice = getMinPrice(aggregationData);
  const maxPrice = getMaxPrice(aggregationData);
  return { minPrice, maxPrice };
}

function getMinPrice(aggregationData: productsV3.AggregationResults[]): number {
  const minPriceAggregation = aggregationData.find(
    (data) => data.fieldPath === "actualPriceRange.minValue.amount",
  );
  if (minPriceAggregation?.scalar?.value) {
    return Number(minPriceAggregation.scalar.value) || 0;
  }
  return 0;
}

function getMaxPrice(aggregationData: productsV3.AggregationResults[]): number {
  const maxPriceAggregation = aggregationData.find(
    (data) => data.fieldPath === "actualPriceRange.maxValue.amount",
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
    if (result.name === "optionNames" && result.values?.results) {
      optionNames.push(
        ...result.values.results
          .map((item) => item.value)
          .filter((value): value is string => typeof value === "string"),
      );
    }
    if (result.name === "choiceNames" && result.values?.results) {
      choiceNames.push(
        ...result.values.results
          .map((item) => item.value)
          .filter((value): value is string => typeof value === "string"),
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
