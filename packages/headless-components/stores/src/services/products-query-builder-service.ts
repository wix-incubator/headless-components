import {
  defineService,
  implementService,
  type ServiceFactoryConfig,
} from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from "@wix/services-definitions/core-services/signals";
import * as productsV3 from "@wix/auto_sdk_stores_products-v-3";
import * as customizationsV3 from "@wix/auto_sdk_stores_customizations-v-3";
import { readOnlyVariantsV3 } from "@wix/stores";
import { URLParamsUtils } from "../utils/url-params.js";
import { SortType, DEFAULT_SORT_TYPE } from "../enums/sort-enums.js";

const { SortDirection, SortType: SDKSortType } = productsV3;

export interface ProductOption {
  id: string;
  name: string;
  choices: ProductChoice[];
  optionRenderType?: string;
}

export interface ProductChoice {
  id: string;
  name: string;
  colorCode?: string;
}

export interface CatalogPriceRange {
  minPrice: number;
  maxPrice: number;
}

// Filter service interfaces
export interface PriceRange {
  min: number;
  max: number;
}

export interface AvailableOptions {
  productOptions: ProductOption[];
  priceRange: PriceRange;
}

export interface Filter {
  priceRange: { min: number; max: number };
  selectedOptions: { [optionId: string]: string[] };
}

// Sort service interfaces
export type SortBy = SortType;

export interface ProductsQueryBuilderServiceAPI {
  // Catalog functionality
  catalogOptions: Signal<ProductOption[] | null>;
  catalogPriceRange: Signal<CatalogPriceRange | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  loadCatalogData: (categoryId?: string) => Promise<void>;

  // Filter functionality
  currentFilters: Signal<Filter>;
  applyFilters: (filters: Filter) => Promise<void>;
  clearFilters: () => Promise<void>;
  availableOptions: ReadOnlySignal<{
    productOptions: ProductOption[];
    priceRange: { min: number; max: number };
  }>;
  isFullyLoaded: ReadOnlySignal<boolean>;

  // Sort functionality
  currentSort: Signal<SortBy>;
  setSortBy: (sortBy: SortBy) => Promise<void>;

  // Query building functionality
  buildSearchOptions: (
    filters?: Filter,
    selectedCategory?: string | null,
    sortBy?: SortBy,
    paging?: any,
  ) => any;
  buildAggregationRequest: (categoryId?: string) => any;
  searchProducts: (searchOptions: any) => Promise<any>;
}

// Default values
export const defaultFilter: Filter = {
  priceRange: { min: 0, max: 0 },
  selectedOptions: {},
};

export const defaultSort: SortBy = DEFAULT_SORT_TYPE;

// Helper functions
const extractAggregationValues = (
  aggregationResponse: any,
  name: string,
): string[] => {
  const aggregation =
    aggregationResponse.aggregations?.[name] ||
    aggregationResponse.aggregationData?.results?.find(
      (r: any) => r.name === name,
    );
  return aggregation?.values?.results?.map((item: any) => item.value) || [];
};

const extractScalarAggregationValue = (
  aggregationResponse: any,
  name: string,
): number | null => {
  const aggregation =
    aggregationResponse.aggregations?.[name] ||
    aggregationResponse.aggregationData?.results?.find(
      (r: any) => r.name === name,
    );
  const value = aggregation?.scalar?.value;
  return value !== undefined && value !== null ? parseFloat(value) : null;
};

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
      return parseInt(b.name) - parseInt(a.name);
    }
    if (aIsNumber && !bIsNumber) return -1;
    if (!aIsNumber && bIsNumber) return 1;

    return a.name.localeCompare(b.name);
  });
};

const buildCategoryFilter = (categoryId?: string) => {
  if (!categoryId) {
    return { visible: true };
  }

  return {
    visible: true,
    "allCategoriesInfo.categories": {
      $matchItems: [{ _id: { $in: [categoryId] } }],
    },
  };
};

// Helper function to fetch missing variants for all products in one request
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
      .limit(100)
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

export const ProductsQueryBuilderServiceDefinition =
  defineService<ProductsQueryBuilderServiceAPI>("productsQueryBuilder");

export const ProductsQueryBuilderService = implementService.withConfig<{
  initialFilters?: Filter;
  initialSort?: SortBy;
}>()(ProductsQueryBuilderServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  // Catalog signals
  const catalogOptions: Signal<ProductOption[] | null> = signalsService.signal(
    null as any,
  );
  const catalogPriceRange: Signal<CatalogPriceRange | null> =
    signalsService.signal(null as any);
  const isLoading: Signal<boolean> = signalsService.signal(false as any);
  const error: Signal<string | null> = signalsService.signal(null as any);

  // Filter signals
  const currentFilters: Signal<Filter> = signalsService.signal(
    (config?.initialFilters || defaultFilter) as any,
  );

  // Sort signals
  const currentSort: Signal<SortBy> = signalsService.signal(
    (config?.initialSort || defaultSort) as any,
  );

  // Computed signals for filter functionality
  const availableOptions = signalsService.computed(() => {
    const catalogPriceRangeValue = catalogPriceRange.get();
    const catalogOptionsValue = catalogOptions.get();

    const priceRange =
      catalogPriceRangeValue &&
      catalogPriceRangeValue.minPrice < catalogPriceRangeValue.maxPrice
        ? {
            min: catalogPriceRangeValue.minPrice,
            max: catalogPriceRangeValue.maxPrice,
          }
        : { min: 0, max: 0 };

    const productOptions =
      catalogOptionsValue && catalogOptionsValue.length > 0
        ? catalogOptionsValue
        : [];

    return {
      productOptions,
      priceRange,
    };
  });

  const isFullyLoaded = signalsService.computed(() => {
    const catalogPriceRangeValue = catalogPriceRange.get();
    const catalogOptionsValue = catalogOptions.get();

    // Price range data is considered loaded whether it's null (no prices) or has valid data
    const hasPriceRangeData = catalogPriceRangeValue !== undefined; // includes null case
    const hasOptionsData = !!(
      catalogOptionsValue && catalogOptionsValue.length >= 0
    ); // Even 0 options is valid

    return hasPriceRangeData && hasOptionsData;
  });

  // Effect to update currentFilters when catalog data loads (only if filters are at defaults)
  signalsService.effect(() => {
    const catalogPriceRangeValue = catalogPriceRange.get();
    if (
      catalogPriceRangeValue &&
      catalogPriceRangeValue.minPrice < catalogPriceRangeValue.maxPrice
    ) {
      const priceRange = {
        min: catalogPriceRangeValue.minPrice,
        max: catalogPriceRangeValue.maxPrice,
      };

      // Update current filters to use catalog price range
      const currentFiltersValue = currentFilters.get();
      // Only update if current filter range is at defaults (either 0-0 or 0-1000)
      const isDefaultRange =
        (currentFiltersValue.priceRange.min === 0 &&
          currentFiltersValue.priceRange.max === 0) ||
        (currentFiltersValue.priceRange.min === 0 &&
          currentFiltersValue.priceRange.max === 1000);

      if (isDefaultRange) {
        currentFilters.set({
          ...currentFiltersValue,
          priceRange,
        });
      }
    }
  });

  // Query building methods
  const buildSearchOptions = (
    filters?: Filter,
    selectedCategory?: string | null,
    sortBy?: SortBy,
    paging?: any,
  ) => {
    const searchOptions: any = {
      search: {},
      fields: [
        "DESCRIPTION" as any,
        "DIRECT_CATEGORIES_INFO" as any,
        "BREADCRUMBS_INFO" as any,
        "INFO_SECTION" as any,
        "MEDIA_ITEMS_INFO" as any,
        "PLAIN_DESCRIPTION" as any,
        "THUMBNAIL" as any,
        "URL" as any,
        "VARIANT_OPTION_CHOICE_NAMES" as any,
        "WEIGHT_MEASUREMENT_UNIT_INFO" as any,
      ],
    };

    // Build filter conditions array
    const filterConditions: any[] = [];

    // Add category filter if selected
    if (selectedCategory) {
      filterConditions.push({
        "allCategoriesInfo.categories": {
          $matchItems: [
            {
              id: {
                $in: [selectedCategory],
              },
            },
          ],
        },
      });
    }

    // Add price range filter if provided
    if (filters?.priceRange) {
      const { min, max } = filters.priceRange;
      if (min > 0) {
        filterConditions.push({
          "actualPriceRange.minValue.amount": { $gte: min.toString() },
        });
      }
      if (max > 0 && max < 999999) {
        filterConditions.push({
          "actualPriceRange.maxValue.amount": { $lte: max.toString() },
        });
      }
    }

    // Add product options filter if provided
    if (
      filters?.selectedOptions &&
      Object.keys(filters.selectedOptions).length > 0
    ) {
      for (const [optionId, choiceIds] of Object.entries(
        filters.selectedOptions,
      )) {
        if (choiceIds && choiceIds.length > 0) {
          // Handle inventory filter separately
          if (optionId === "inventory-filter") {
            filterConditions.push({
              "inventory.availabilityStatus": {
                $in: choiceIds,
              },
            });
          } else {
            // Regular product options filter
            filterConditions.push({
              "options.choicesSettings.choices.choiceId": {
                $hasSome: choiceIds,
              },
            });
          }
        }
      }
    }

    // Apply filters
    if (filterConditions.length > 0) {
      if (filterConditions.length === 1) {
        // Single condition - no need for $and wrapper
        searchOptions.search.filter = filterConditions[0];
      } else {
        // Multiple conditions - use $and
        searchOptions.search.filter = {
          $and: filterConditions,
        };
      }
    }

    // Add sort if provided
    if (sortBy) {
      switch (sortBy) {
        case SortType.NAME_ASC:
          searchOptions.search.sort = [
            { fieldName: "name", order: SortDirection.ASC },
          ];
          break;
        case SortType.NAME_DESC:
          searchOptions.search.sort = [
            { fieldName: "name", order: SortDirection.DESC },
          ];
          break;
        case SortType.PRICE_ASC:
          searchOptions.search.sort = [
            {
              fieldName: "actualPriceRange.minValue.amount",
              order: SortDirection.ASC,
            },
          ];
          break;
        case SortType.PRICE_DESC:
          searchOptions.search.sort = [
            {
              fieldName: "actualPriceRange.minValue.amount",
              order: SortDirection.DESC,
            },
          ];
          break;
        case SortType.RECOMMENDED:
          searchOptions.search.sort = [
            {
              fieldName: "allCategoriesInfo.categories.index",
              selectItemsBy: [
                {
                  "allCategoriesInfo.categories.id": selectedCategory,
                },
              ],
            },
          ];
          break;
      }
    }

    // Add paging if provided
    if (paging) {
      searchOptions.paging = paging;
    }

    return searchOptions;
  };

  const buildAggregationRequest = (categoryId?: string) => {
    return {
      aggregations: [
        // Price range aggregations
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
        // Options aggregations
        {
          name: "optionNames",
          fieldPath: "options.name",
          type: SDKSortType.VALUE,
          value: {
            limit: 20,
            sortType: SDKSortType.VALUE,
            sortDirection: SortDirection.ASC,
          },
        },
        {
          name: "choiceNames",
          fieldPath: "options.choicesSettings.choices.name",
          type: SDKSortType.VALUE,
          value: {
            limit: 50,
            sortType: SDKSortType.VALUE,
            sortDirection: SortDirection.ASC,
          },
        },
        {
          name: "inventoryStatus",
          fieldPath: "inventory.availabilityStatus",
          type: SDKSortType.VALUE,
          value: {
            limit: 10,
            sortType: SDKSortType.VALUE,
            sortDirection: SortDirection.ASC,
          },
        },
      ],
      filter: buildCategoryFilter(categoryId),
      includeProducts: false,
      cursorPaging: { limit: 0 },
    };
  };

  const searchProducts = async (searchOptions: any) => {
    const searchParams = {
      filter: searchOptions.search?.filter,
      sort: searchOptions.search?.sort,
      ...(searchOptions.paging && { cursorPaging: searchOptions.paging }),
    };

    const options = {
      fields: searchOptions.fields || [],
    };

    const result = await productsV3.searchProducts(searchParams, options);

    // Fetch missing variants for all products in one batch request
    if (result.products) {
      result.products = await fetchMissingVariants(result.products);
    }

    return result;
  };

  const loadCatalogData = async (categoryId?: string): Promise<void> => {
    isLoading.set(true);
    error.set(null);

    try {
      // Single aggregation request to get ALL catalog data at once
      const aggregationRequest = buildAggregationRequest(categoryId);

      // Make the single aggregation request
      const [aggregationResponse, customizationsResponse] = await Promise.all([
        productsV3.searchProducts(aggregationRequest as any),
        customizationsV3.queryCustomizations().find(),
      ]);

      // Process price range data
      const minPrice = extractScalarAggregationValue(
        aggregationResponse,
        "minPrice",
      );
      const maxPrice = extractScalarAggregationValue(
        aggregationResponse,
        "maxPrice",
      );

      if (
        minPrice !== null &&
        maxPrice !== null &&
        (minPrice > 0 || maxPrice > 0)
      ) {
        catalogPriceRange.set({
          minPrice,
          maxPrice,
        });
      } else {
        catalogPriceRange.set(null);
      }

      // Process options data
      const optionNames = extractAggregationValues(
        aggregationResponse,
        "optionNames",
      );
      const choiceNames = extractAggregationValues(
        aggregationResponse,
        "choiceNames",
      );
      const inventoryStatuses = extractAggregationValues(
        aggregationResponse,
        "inventoryStatus",
      );

      const customizations = customizationsResponse.items || [];

      // Build options by matching customizations with aggregation data
      const options: ProductOption[] = customizations
        .filter(
          (customization) =>
            customization.name &&
            customization._id &&
            customization.customizationType ===
              customizationsV3.CustomizationType.PRODUCT_OPTION &&
            matchesAggregationName(customization.name, optionNames),
        )
        .map((customization) => {
          const choices: ProductChoice[] = (
            customization.choicesSettings?.choices || []
          )
            .filter(
              (choice) =>
                choice._id &&
                choice.name &&
                matchesAggregationName(choice.name, choiceNames),
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

      // Add inventory filter if there are multiple inventory statuses
      if (inventoryStatuses.length > 1) {
        const inventoryChoices: ProductChoice[] = inventoryStatuses.map(
          (status) => ({
            id: status.toUpperCase(),
            name: status.toUpperCase(),
          }),
        );

        options.push({
          id: "inventory-filter",
          name: "Availability",
          choices: inventoryChoices,
          optionRenderType: productsV3.ModifierRenderType.TEXT_CHOICES,
        });
      }

      catalogOptions.set(options);
    } catch (err) {
      console.error("Failed to load catalog data:", err);
      error.set(
        err instanceof Error ? err.message : "Failed to load catalog data",
      );
      catalogOptions.set([]);
      catalogPriceRange.set(null);
    } finally {
      isLoading.set(false);
    }
  };

  // Filter functionality
  const applyFilters = async (filters: Filter) => {
    currentFilters.set(filters);

    // Update URL with filter parameters
    const urlParams: Record<string, string | string[]> = {};
    const availableOpts = availableOptions.get();

    // Add price filters if different from defaults
    if (availableOpts?.priceRange) {
      if (filters.priceRange.min > availableOpts.priceRange.min) {
        urlParams["minPrice"] = filters.priceRange.min.toString();
      }
      if (filters.priceRange.max < availableOpts.priceRange.max) {
        urlParams["maxPrice"] = filters.priceRange.max.toString();
      }
    }

    // Add option filters using option names as keys
    if (availableOpts?.productOptions) {
      Object.entries(filters.selectedOptions).forEach(
        ([optionId, choiceIds]) => {
          const option = availableOpts.productOptions.find(
            (opt) => opt.id === optionId,
          );
          if (option && choiceIds.length > 0) {
            const selectedChoices = option.choices.filter(
              (choice: ProductChoice) => choiceIds.includes(choice.id),
            );
            if (selectedChoices.length > 0) {
              // Use 'availability' as URL param for inventory filter
              const paramName =
                optionId === "inventory-filter" ? "availability" : option.name;
              urlParams[paramName] = selectedChoices.map(
                (choice) => choice.name,
              );
            }
          }
        },
      );
    }

    // Preserve existing sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    if (currentParams["sort"]) {
      urlParams["sort"] = currentParams["sort"];
    }

    URLParamsUtils.updateURL(urlParams);
  };

  const clearFilters = async () => {
    const availablePriceRange = availableOptions.get()?.priceRange;
    currentFilters.set({
      ...defaultFilter,
      priceRange: availablePriceRange || { min: 0, max: 0 },
    });

    // Clear filter parameters from URL, keeping only sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    const urlParams: Record<string, string | string[]> = {};
    if (currentParams["sort"]) {
      urlParams["sort"] = currentParams["sort"];
    }
    URLParamsUtils.updateURL(urlParams);
  };

  // Sort functionality
  const setSortBy = async (sortBy: SortBy) => {
    currentSort.set(sortBy);

    // Update URL with sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    const urlParams = { ...currentParams };

    if (sortBy !== SortType.NEWEST) {
      urlParams["sort"] = sortBy;
    } else {
      delete urlParams["sort"];
    }

    URLParamsUtils.updateURL(urlParams);
  };

  return {
    // Catalog functionality
    catalogOptions,
    catalogPriceRange,
    isLoading,
    error,
    loadCatalogData,

    // Filter functionality
    currentFilters,
    applyFilters,
    clearFilters,
    availableOptions,
    isFullyLoaded,

    // Sort functionality
    currentSort,
    setSortBy,

    // Query building functionality
    buildSearchOptions,
    buildAggregationRequest,
    searchProducts,
  };
});

export async function loadProductsQueryBuilderServiceConfig(
  initialFilters?: Filter,
  initialSort?: SortBy,
): Promise<ServiceFactoryConfig<typeof ProductsQueryBuilderService>> {
  return {
    initialFilters,
    initialSort,
  };
}

// Legacy exports for backward compatibility
export const FilterServiceDefinition = ProductsQueryBuilderServiceDefinition;
export const FilterService = ProductsQueryBuilderService;
export const SortServiceDefinition = ProductsQueryBuilderServiceDefinition;
export const SortService = ProductsQueryBuilderService;
export const CatalogServiceDefinition = ProductsQueryBuilderServiceDefinition;
export const CatalogService = ProductsQueryBuilderService;
