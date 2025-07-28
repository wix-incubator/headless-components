import { defineService } from "@wix/services-definitions";
import { implementService } from "@wix/services-definitions";
import {
  type Signal,
  SignalsServiceDefinition,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import { ProductsListServiceDefinition } from "./products-list-service.js";
import { customizationsV3 } from "@wix/stores";

const PRICE_FILTER_DEBOUNCE_TIME = 300;

/**
 * Update URL with filter parameters (internal URL sync logic)
 * This is the core URL synchronization that converts internal service data to URL parameters
 */
function updateUrlWithFilterState(
  filters: InitialFilter,
  customizations: customizationsV3.Customization[],
  catalogBounds: { minPrice: number; maxPrice: number },
): void {
  if (typeof window === "undefined") return;

  // Convert IDs back to human-readable names for URL
  const humanReadableOptions: Record<string, string[]> = {};
  for (const [optionId, choiceIds] of Object.entries(
    filters?.productOptions ?? {},
  )) {
    const option = customizations.find((c) => c._id === optionId);
    if (option && option.name) {
      const choiceNames: string[] = [];
      for (const choiceId of choiceIds) {
        const choice = option.choicesSettings?.choices?.find(
          (c: any) => c._id === choiceId,
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

  // Start with current URL parameters to preserve non-filter parameters (like sort)
  const params = new URLSearchParams(window.location.search);

  // Define filter-related parameters that we manage
  const filterParams = [
    "minPrice",
    "maxPrice",
    "inventoryStatus",
    "category",
    "visible",
    "productType",
    // Product option names will be dynamically added below
  ];

  // Remove existing filter parameters first
  filterParams.forEach((param) => params.delete(param));

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

  // Add category filter
  if (filters.category) {
    params.set("category", filters.category);
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

  // Build the new URL
  const baseUrl = window.location.pathname;
  const newUrl = params.toString()
    ? `${baseUrl}?${params.toString()}`
    : baseUrl;

  // Only update if URL actually changed
  if (newUrl !== window.location.pathname + window.location.search) {
    window.history.pushState(null, "", newUrl);
  }
}

/**
 * Interface representing a product option (like Size, Color, etc.).
 * Contains the option metadata and available choices.
 *
 * @interface ProductOption
 */
export interface ProductOption {
  /** Unique identifier for the product option */
  id: string;
  /** Display name of the option (e.g., "Size", "Color") */
  name: string;
  /** Array of available choices for this option */
  choices: ProductChoice[];
  /** Optional render type for UI display purposes */
  optionRenderType?: string;
}

/**
 * Interface representing a choice within a product option.
 * For example, "Red" would be a choice within a "Color" option.
 *
 * @interface ProductChoice
 */
export interface ProductChoice {
  /** Unique identifier for the choice */
  id: string;
  /** Display name of the choice (e.g., "Red", "Large") */
  name: string;
  /** Optional color code for color-based choices */
  colorCode?: string;
}

/**
 * Enumeration of inventory status types available for filtering.
 * Maps to the Wix Stores API inventory availability statuses.
 *
 * @enum {string}
 */
export enum InventoryStatusType {
  /** Product is in stock and available for purchase */
  IN_STOCK = productsV3.InventoryAvailabilityStatus.IN_STOCK,
  /** Product is out of stock */
  OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus.OUT_OF_STOCK,
  /** Product is partially out of stock (some variants available) */
  PARTIALLY_OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus
    .PARTIALLY_OUT_OF_STOCK,
}

type InitialFilter = {
  priceRange?: { min?: number; max?: number };
  inventoryStatuses?: InventoryStatusType[];
  productOptions?: Record<string, string[]>;
  category?: string;
  visible?: boolean;
  productType?: string;
};

/**
 * Configuration interface for the Products List Filters service.
 * Contains customizations data used to build filter options and URL synchronization.
 *
 * @interface ProductsListFiltersServiceConfig
 */
export type ProductsListFiltersServiceConfig = {
  /** Array of product customizations for building filter options */
  customizations: customizationsV3.Customization[];
  /** Initial filter state from URL parameters (optional) */
  initialFiltersFromUrl?: InitialFilter;
};

/**
 * Loads products list filters service configuration from the Wix Stores API for SSR initialization.
 * This function fetches customization data and extracts initial filter state from search options.
 *
 * @param {Parameters<typeof productsV3.searchProducts>[0]} searchOptions - The search options to extract initial filters from
 * @returns {Promise<ProductsListFiltersServiceConfig>} Promise that resolves to the filters configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/products.astro
 * import { loadProductsListFiltersServiceConfig, parseUrlForProductsAndFilters } from '@wix/stores/services';
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * // Parse URL and load filters configuration during SSR
 * const { searchOptions } = await parseUrlForProductsAndFilters(Astro.url.href);
 * const filtersConfig = await loadProductsListFiltersServiceConfig(searchOptions);
 * ---
 *
 * <ProductsListFilters.Root filtersConfig={filtersConfig}>
 *   <ProductsListFilters.MinPrice>
 *     {({ minPrice, setMinPrice }) => (
 *       <input
 *         type="number"
 *         value={minPrice}
 *         onChange={(e) => setMinPrice(parseFloat(e.target.value))}
 *         placeholder="Min Price"
 *       />
 *     )}
 *   </ProductsListFilters.MinPrice>
 * </ProductsListFilters.Root>
 * ```
 *
 * @example
 * ```tsx
 * // Next.js page example
 * import { GetServerSideProps } from 'next';
 * import { loadProductsListFiltersServiceConfig, parseUrlForProductsAndFilters } from '@wix/stores/services';
 *
 * export const getServerSideProps: GetServerSideProps = async ({ req }) => {
 *   const { searchOptions } = await parseUrlForProductsAndFilters(req.url);
 *   const filtersConfig = await loadProductsListFiltersServiceConfig(searchOptions);
 *
 *   return {
 *     props: {
 *       filtersConfig,
 *     },
 *   };
 * };
 * ```
 */
/**
 * Comprehensive URL parsing that returns both search options and filter data
 * This replaces separate URL parsing in different parts of the application
 */
export async function parseUrlForProductsAndFilters(
  url: string,
  defaultSearchOptions?: Parameters<typeof productsV3.searchProducts>[0],
): Promise<Parameters<typeof productsV3.searchProducts>[0]> {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  // Get customizations for product option parsing
  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  // Build search options (from buildSearchOptionsFromUrl logic)
  const searchOptions: Parameters<typeof productsV3.searchProducts>[0] = {
    cursorPaging: {
      limit: 100,
    },
    ...defaultSearchOptions,
  };

  // Handle text search (q parameter)
  const query = searchParams.get("q");
  if (query) {
    searchOptions.search = {
      expression: query,
    };
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
      }
    }
    if (cursor) {
      searchOptions.cursorPaging.cursor = cursor;
    }
  }

  // Handle sorting
  const sort = searchParams.get("sort");
  if (sort) {
    const sortMapping: Record<string, string> = {
      name: "name",
      price: "actualPriceRange.minValue.amount",
      created: "_createdDate",
      updated: "_updatedDate",
    };

    const sortParts = sort.split(":");
    const fieldKey = sortParts[0]?.toLowerCase();
    const order = sortParts[1]?.toLowerCase() === "desc" ? "DESC" : "ASC";

    if (fieldKey) {
      const mappedField = sortMapping[fieldKey];
      if (mappedField) {
        searchOptions.sort = [
          {
            fieldName: mappedField as any,
            order,
          },
        ];
      }
    }
  }

  // Handle filtering for search options
  const filter: Record<string, any> = {};

  const visible = searchParams.get("visible");
  if (visible !== null) {
    filter["visible"] = visible === "true";
  }

  const productType = searchParams.get("productType");
  if (productType) {
    filter["productType"] = productType;
  }

  const category = searchParams.get("category");
  if (category) {
    filter["allCategoriesInfo.categories"] = {
      $matchItems: [{ _id: { $in: [category] } }],
    };
  }

  // Price range filtering - We dont want to read and apply price range for now
  // const minPrice = searchParams.get("minPrice");
  // const maxPrice = searchParams.get("maxPrice");
  // if (minPrice) {
  //   const minPriceNum = parseFloat(minPrice);
  //   if (!isNaN(minPriceNum)) {
  //     filter["actualPriceRange.minValue.amount"] = { $gte: minPriceNum };
  //   }
  // }
  // if (maxPrice) {
  //   const maxPriceNum = parseFloat(maxPrice);
  //   if (!isNaN(maxPriceNum)) {
  //     filter["actualPriceRange.maxValue.amount"] = { $lte: maxPriceNum };
  //   }
  // }

  // Parse product options from URL parameters (Color=Lime, Size=Large, etc.)
  const reservedParams = [
    "minPrice",
    "maxPrice",
    "inventory_status",
    "inventoryStatus", // Both formats
    "category",
    "visible",
    "productType",
    "q",
    "limit",
    "cursor",
    "sort",
  ];

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
        // Add product option filter to search options
        filter[`options.choicesSettings.choices.choiceId`] = {
          $hasSome: choiceIds,
        };
      }
    }
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

  return searchOptions;
}

export async function loadProductsListFiltersServiceConfig(
  searchOptions?: Parameters<typeof productsV3.searchProducts>[0],
): Promise<ProductsListFiltersServiceConfig> {
  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  // Parse initial filters from search options if provided
  let initialFiltersFromUrl: ProductsListFiltersServiceConfig["initialFiltersFromUrl"];

  if (searchOptions) {
    // Extract filters from search options
    const urlFilters: any = {};

    // Extract price range from search options filters
    const filter = searchOptions.filter as any;
    if (filter && typeof filter === "object") {
      // Extract min price
      const minPriceFilter = filter["actualPriceRange.minValue.amount"];
      if (
        minPriceFilter &&
        typeof minPriceFilter === "object" &&
        "$gte" in minPriceFilter
      ) {
        if (!urlFilters.priceRange) urlFilters.priceRange = {};
        urlFilters.priceRange.min = Number(minPriceFilter.$gte);
      }

      // Extract max price
      const maxPriceFilter = filter["actualPriceRange.maxValue.amount"];
      if (
        maxPriceFilter &&
        typeof maxPriceFilter === "object" &&
        "$lte" in maxPriceFilter
      ) {
        if (!urlFilters.priceRange) urlFilters.priceRange = {};
        urlFilters.priceRange.max = Number(maxPriceFilter.$lte);
      }

      // Extract inventory status
      const inventoryFilter = filter["inventory.availabilityStatus"];
      if (inventoryFilter) {
        if (typeof inventoryFilter === "string") {
          urlFilters.inventoryStatuses = [inventoryFilter];
        } else if (
          typeof inventoryFilter === "object" &&
          "$in" in inventoryFilter
        ) {
          urlFilters.inventoryStatuses = inventoryFilter.$in;
        }
      }

      // Extract category
      const categoryFilter = filter["allCategoriesInfo.categories"];
      if (
        categoryFilter &&
        typeof categoryFilter === "object" &&
        "$matchItems" in categoryFilter
      ) {
        const matchItems = categoryFilter.$matchItems;
        if (Array.isArray(matchItems) && matchItems[0]?._id?.$in?.[0]) {
          urlFilters.category = matchItems[0]._id.$in[0];
        }
      }

      // Extract visibility
      if (typeof filter["visible"] === "boolean") {
        urlFilters.visible = filter["visible"];
      }

      // Extract product type
      if (typeof filter["productType"] === "string") {
        urlFilters.productType = filter["productType"];
      }

      // Extract product options
      const productOptionsFilter =
        filter["options.choicesSettings.choices.choiceId"];
      if (
        productOptionsFilter &&
        typeof productOptionsFilter === "object" &&
        "$hasSome" in productOptionsFilter
      ) {
        const choiceIds = productOptionsFilter.$hasSome;
        if (Array.isArray(choiceIds) && choiceIds.length > 0) {
          // Group choice IDs by option ID using customizations
          const productOptionsById: Record<string, string[]> = {};

          for (const choiceId of choiceIds) {
            // Find which option this choice belongs to
            for (const customization of customizations) {
              if (
                customization.customizationType ===
                customizationsV3.CustomizationType.PRODUCT_OPTION
              ) {
                const choice = customization.choicesSettings?.choices?.find(
                  (c) => c._id === choiceId,
                );
                const optionId = customization._id;
                if (choice && optionId) {
                  if (!productOptionsById[optionId]) {
                    productOptionsById[optionId] = [];
                  }
                  productOptionsById[optionId].push(choiceId);
                  break; // Found the option for this choice, move to next choice
                }
              }
            }
          }

          if (Object.keys(productOptionsById).length > 0) {
            urlFilters.productOptions = productOptionsById;
          }
        }
      }
    }

    if (Object.keys(urlFilters).length > 0) {
      initialFiltersFromUrl = urlFilters;
    }
  }

  return {
    customizations,
    initialFiltersFromUrl,
  };
}

/**
 * Service definition for the Products List Filters service.
 * This defines the reactive API contract for managing product list filtering capabilities
 * including price, inventory status, and product option filters.
 *
 * @constant
 */
export const ProductsListFiltersServiceDefinition = defineService<{
  /** Reactive signal containing the user's selected minimum price filter value */
  selectedMinPrice: Signal<number>;
  /** Reactive signal containing the user's selected maximum price filter value */
  selectedMaxPrice: Signal<number>;
  /** Reactive signal containing the catalog minimum price (for UI bounds) */
  availableMinPrice: Signal<number>;
  /** Reactive signal containing the catalog maximum price (for UI bounds) */
  availableMaxPrice: Signal<number>;
  /** Reactive signal containing available inventory status options */
  availableInventoryStatuses: Signal<InventoryStatusType[]>;
  /** Reactive signal containing selected inventory status filters */
  selectedInventoryStatuses: Signal<InventoryStatusType[]>;
  /** Reactive signal containing available product options for filtering */
  availableProductOptions: Signal<ProductOption[]>;
  /** Reactive signal containing selected product option filters */
  selectedProductOptions: Signal<Record<string, string[]>>;
  /** Reactive signal containing selected category filter */
  selectedCategory: Signal<string | null>;
  /** Reactive signal containing visibility filter */
  selectedVisible: Signal<boolean | null>;
  /** Reactive signal containing product type filter */
  selectedProductType: Signal<string | null>;
  /** Function to set the minimum price filter */
  setSelectedMinPrice: (minPrice: number) => void;
  /** Function to set the maximum price filter */
  setSelectedMaxPrice: (maxPrice: number) => void;
  /** Function to toggle an inventory status filter */
  toggleInventoryStatus: (status: InventoryStatusType) => void;
  /** Function to toggle a product option choice filter */
  toggleProductOption: (optionId: string, choiceId: string) => void;
  /** Function to set the category filter */
  setSelectedCategory: (category: string | null) => void;
  /** Function to set the visibility filter */
  setSelectedVisible: (visible: boolean | null) => void;
  /** Function to set the product type filter */
  setSelectedProductType: (productType: string | null) => void;
  /** Reactive signal indicating if any filters are currently applied */
  isFiltered: Signal<boolean>;
  /** Function to reset all filters to their default state */
  reset: () => void;
}>("products-list-filters");

/**
 * Implementation of the Products List Filters service that manages reactive filtering state.
 * This service provides signals for all filter types (price, inventory, product options) and
 * automatically updates the products list search options when filters change.
 *
 * @example
 * ```tsx
 * import { ProductsListFiltersService, ProductsListFiltersServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function FiltersComponent({ filtersConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProductsListFiltersServiceDefinition, ProductsListFiltersService.withConfig(filtersConfig)]
 *     ])}>
 *       <FilterControls />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function FilterControls() {
 *   const filtersService = useService(ProductsListFiltersServiceDefinition);
 *   const minPrice = filtersService.minPrice.get();
 *   const maxPrice = filtersService.maxPrice.get();
 *   const selectedInventoryStatuses = filtersService.selectedInventoryStatuses.get();
 *   const availableProductOptions = filtersService.availableProductOptions.get();
 *   const isFiltered = filtersService.isFiltered.get();
 *
 *   return (
 *     <div>
 *       <div>
 *         <input
 *           type="number"
 *           value={minPrice}
 *           onChange={(e) => filtersService.setMinPrice(parseFloat(e.target.value))}
 *           placeholder="Min Price"
 *         />
 *         <input
 *           type="number"
 *           value={maxPrice}
 *           onChange={(e) => filtersService.setMaxPrice(parseFloat(e.target.value))}
 *           placeholder="Max Price"
 *         />
 *       </div>
 *
 *       {availableProductOptions.map(option => (
 *         <div key={option.id}>
 *           <h4>{option.name}</h4>
 *           {option.choices.map(choice => (
 *             <label key={choice.id}>
 *               <input
 *                 type="checkbox"
 *                 onChange={() => filtersService.toggleProductOption(option.id, choice.id)}
 *               />
 *               {choice.name}
 *             </label>
 *           ))}
 *         </div>
 *       ))}
 *
 *       {isFiltered && (
 *         <button onClick={() => filtersService.reset()}>
 *           Clear All Filters
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * }
 * ```
 */
export const ProductsListFiltersService =
  implementService.withConfig<ProductsListFiltersServiceConfig>()(
    ProductsListFiltersServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);
      const { customizations, initialFiltersFromUrl } = config;

      const aggregationData = productsListService.aggregations.get()?.results;
      const currentSearchOptions = productsListService.searchOptions.get();

      // Get the full catalog price range from initial aggregation data (before any filters)
      const catalogPriceRange = getCatalogPriceRange(aggregationData || []);

      // Initialize signals with URL filters, then current search options, then catalog defaults
      const userFilterMinPriceSignal = signalsService.signal(
        initialFiltersFromUrl?.priceRange?.min ??
          getSelectedMinPrice(currentSearchOptions) ??
          catalogPriceRange.minPrice,
      );
      const userFilterMaxPriceSignal = signalsService.signal(
        initialFiltersFromUrl?.priceRange?.max ??
          getSelectedMaxPrice(currentSearchOptions) ??
          catalogPriceRange.maxPrice,
      );

      // Separate signals for the available catalog range (for UI bounds)
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
        initialFiltersFromUrl?.inventoryStatuses ??
          getSelectedInventoryStatuses(currentSearchOptions),
      );

      // TODO: Get product options from aggregations data
      const availableProductOptionsSignal = signalsService.signal(
        getAvailableProductOptions(aggregationData, customizations),
      );
      const selectedProductOptionsSignal = signalsService.signal(
        initialFiltersFromUrl?.productOptions ??
          getSelectedProductOptions(currentSearchOptions),
      );

      // Additional filter signals
      const selectedCategorySignal = signalsService.signal(
        initialFiltersFromUrl?.category ??
          getSelectedCategory(currentSearchOptions),
      );
      const selectedVisibleSignal = signalsService.signal(
        initialFiltersFromUrl?.visible ??
          getSelectedVisible(currentSearchOptions),
      );
      const selectedProductTypeSignal = signalsService.signal(
        initialFiltersFromUrl?.productType ??
          getSelectedProductType(currentSearchOptions),
      );

      const isFilteredSignal = signalsService.signal(false);

      // Debounce timeout IDs for price filters
      let minPriceTimeoutId: NodeJS.Timeout | null = null;
      let maxPriceTimeoutId: NodeJS.Timeout | null = null;

      if (typeof window !== "undefined") {
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
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

          // Update search options for products list
          isFilteredSignal.set(true);

          // Build new search options with updated price filters
          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            ...productsListService.searchOptions.peek(),
          };

          delete newSearchOptions.cursorPaging?.cursor;

          // Initialize filter if it doesn't exist
          if (!newSearchOptions.filter) {
            newSearchOptions.filter = {};
          } else {
            // Copy existing filter to avoid mutation
            newSearchOptions.filter = { ...newSearchOptions.filter };
          }

          // Remove existing price filters
          delete (newSearchOptions.filter as any)[
            "actualPriceRange.minValue.amount"
          ];
          delete (newSearchOptions.filter as any)[
            "actualPriceRange.maxValue.amount"
          ];

          // Remove existing inventory filter
          delete (newSearchOptions.filter as any)[
            "inventory.availabilityStatus"
          ];

          // Remove existing basic filters
          delete (newSearchOptions.filter as any)[
            "allCategoriesInfo.categories"
          ];
          delete (newSearchOptions.filter as any)["visible"];
          delete (newSearchOptions.filter as any)["productType"];

          // Remove existing product option filters
          // First, find and remove any existing option filters
          Object.keys(newSearchOptions.filter).forEach((key) => {
            if (key.startsWith("options.")) {
              delete (newSearchOptions.filter as any)[key];
            }
          });

          // Add new price filters if they have valid values
          if (minPrice > 0) {
            (newSearchOptions.filter as any)[
              "actualPriceRange.minValue.amount"
            ] = {
              $gte: minPrice,
            };
          }
          if (maxPrice > 0) {
            (newSearchOptions.filter as any)[
              "actualPriceRange.maxValue.amount"
            ] = {
              $lte: maxPrice,
            };
          }

          // Add new inventory filter if there are selected statuses
          if (selectedInventoryStatuses.length > 0) {
            if (selectedInventoryStatuses.length === 1) {
              (newSearchOptions.filter as any)["inventory.availabilityStatus"] =
                selectedInventoryStatuses[0];
            } else {
              (newSearchOptions.filter as any)["inventory.availabilityStatus"] =
                {
                  $in: selectedInventoryStatuses,
                };
            }
          }

          // Add new product option filters if there are selected options
          if (
            selectedProductOptions &&
            Object.keys(selectedProductOptions).length > 0
          ) {
            for (const [optionId, choiceIds] of Object.entries(
              selectedProductOptions,
            )) {
              if (choiceIds && choiceIds.length > 0) {
                // Handle inventory filter separately
                if (optionId === "inventory-filter") {
                  (newSearchOptions.filter as any)[
                    "inventory.availabilityStatus"
                  ] = {
                    $in: choiceIds,
                  };
                } else {
                  // Regular product options filter
                  (newSearchOptions.filter as any)[
                    "options.choicesSettings.choices.choiceId"
                  ] = {
                    $hasSome: choiceIds,
                  };
                }
              }
            }
          }

          // Add new basic filters
          if (selectedCategory) {
            (newSearchOptions.filter as any)["allCategoriesInfo.categories"] = {
              $matchItems: [{ _id: { $in: [selectedCategory] } }],
            };
          }

          if (selectedVisible !== null) {
            (newSearchOptions.filter as any)["visible"] = selectedVisible;
          }

          if (selectedProductType) {
            (newSearchOptions.filter as any)["productType"] =
              selectedProductType;
          }

          productsListService.setFilter(newSearchOptions.filter);

          // Sync with URL (automatic or via callback)
          const catalogBounds = {
            minPrice: catalogMinPriceSignal.get(),
            maxPrice: catalogMaxPriceSignal.get(),
          };

          const currentFilters = {
            priceRange: { min: minPrice, max: maxPrice },
            inventoryStatuses: selectedInventoryStatuses,
            productOptions: selectedProductOptions,
            ...(selectedCategory && { category: selectedCategory }),
            ...(selectedVisible !== null && { visible: selectedVisible }),
            ...(selectedProductType && { productType: selectedProductType }),
          };

          // Automatic URL synchronization (safe in all environments)
          updateUrlWithFilterState(
            currentFilters,
            customizations,
            catalogBounds,
          );
        });
      }

      return {
        selectedMinPrice: userFilterMinPriceSignal,
        selectedMaxPrice: userFilterMaxPriceSignal,
        availableMinPrice: catalogMinPriceSignal,
        availableMaxPrice: catalogMaxPriceSignal,
        availableInventoryStatuses: availableInventoryStatusesSignal,
        selectedInventoryStatuses: selectedInventoryStatusesSignal,
        availableProductOptions: availableProductOptionsSignal,
        selectedProductOptions: selectedProductOptionsSignal,
        selectedCategory: selectedCategorySignal,
        selectedVisible: selectedVisibleSignal,
        selectedProductType: selectedProductTypeSignal,
        setSelectedMinPrice: (minPrice: number) => {
          // Clear any existing timeout
          if (minPriceTimeoutId) {
            clearTimeout(minPriceTimeoutId);
          }

          // Set new debounced timeout
          minPriceTimeoutId = setTimeout(() => {
            userFilterMinPriceSignal.set(minPrice);
            minPriceTimeoutId = null;
          }, PRICE_FILTER_DEBOUNCE_TIME);
        },
        setSelectedMaxPrice: (maxPrice: number) => {
          // Clear any existing timeout
          if (maxPriceTimeoutId) {
            clearTimeout(maxPriceTimeoutId);
          }

          // Set new debounced timeout
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
            // Remove the choice
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
            // Add the choice
            selectedProductOptionsSignal.set({
              ...current,
              [optionId]: [...currentChoices, choiceId],
            });
          }
        },
        setSelectedCategory: (category: string | null) => {
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
          // Reset user selections but keep catalog bounds intact
          userFilterMinPriceSignal.set(catalogMinPriceSignal.get());
          userFilterMaxPriceSignal.set(catalogMaxPriceSignal.get());
          selectedInventoryStatusesSignal.set([]);
          selectedProductOptionsSignal.set({});
          selectedCategorySignal.set(null);
          selectedVisibleSignal.set(null);
          selectedProductTypeSignal.set(null);
          isFilteredSignal.set(false);
        },
      };
    },
  );

/**
 * Gets the full catalog price range from aggregation data (before any filters applied)
 */
function getCatalogPriceRange(
  aggregationData: productsV3.AggregationResults[],
): { minPrice: number; maxPrice: number } {
  const minPrice = getMinPrice(aggregationData);
  const maxPrice = getMaxPrice(aggregationData);

  return { minPrice, maxPrice };
}

/**
 * Gets the user's currently selected minimum price filter from search options
 */
function getSelectedMinPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): number | undefined {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const minPriceFilter = (filter as any)["actualPriceRange.minValue.amount"];
  if (
    typeof minPriceFilter === "object" &&
    minPriceFilter !== null &&
    "$gte" in minPriceFilter
  ) {
    return Number(minPriceFilter.$gte);
  }
}

/**
 * Gets the user's currently selected maximum price filter from search options
 */
function getSelectedMaxPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): number | undefined {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const maxPriceFilter = (filter as any)["actualPriceRange.maxValue.amount"];
  if (
    typeof maxPriceFilter === "object" &&
    maxPriceFilter !== null &&
    "$lte" in maxPriceFilter
  ) {
    return Number(maxPriceFilter.$lte);
  }
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

function getSelectedInventoryStatuses(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): InventoryStatusType[] {
  const filter = searchOptions.filter;
  if (!filter) return [];

  const inventoryFilter = (filter as any)["inventory.availabilityStatus"];

  if (typeof inventoryFilter === "string" && inventoryFilter.length > 0) {
    return [inventoryFilter as InventoryStatusType];
  }

  if (
    typeof inventoryFilter === "object" &&
    inventoryFilter !== null &&
    "$in" in inventoryFilter
  ) {
    return Array.isArray(inventoryFilter.$in) ? inventoryFilter.$in : [];
  }

  return [];
}

function getSelectedProductOptions(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): Record<string, string[]> {
  const filter = searchOptions.filter;
  if (!filter) return {};

  const selectedOptions: Record<string, string[]> = {};

  // Look for options.{optionId}.choice filters
  Object.keys(filter).forEach((key) => {
    if (key.startsWith("options.") && key.endsWith(".choice")) {
      const optionId = key.slice(8, -7); // Remove "options." and ".choice"
      const optionFilter = (filter as any)[key];

      if (typeof optionFilter === "string" && optionFilter.length > 0) {
        selectedOptions[optionId] = [optionFilter];
      } else if (
        typeof optionFilter === "object" &&
        optionFilter !== null &&
        "$in" in optionFilter &&
        Array.isArray(optionFilter.$in)
      ) {
        selectedOptions[optionId] = optionFilter.$in;
      }
    }
  });

  return selectedOptions;
}

function getSelectedCategory(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): string | null {
  const filter = searchOptions.filter;
  if (!filter) return null;

  const categoryFilter = (filter as any)["allCategoriesInfo.categories"];
  if (
    typeof categoryFilter === "object" &&
    categoryFilter !== null &&
    "$matchItems" in categoryFilter &&
    Array.isArray(categoryFilter.$matchItems) &&
    categoryFilter.$matchItems.length > 0
  ) {
    const firstMatch = categoryFilter.$matchItems[0];
    if (
      firstMatch &&
      firstMatch._id &&
      "$in" in firstMatch._id &&
      Array.isArray(firstMatch._id.$in)
    ) {
      return firstMatch._id.$in[0] || null;
    }
  }

  return null;
}

function getSelectedVisible(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): boolean | null {
  const filter = searchOptions.filter;
  if (!filter) return null;

  const visibleFilter = (filter as any)["visible"];
  return typeof visibleFilter === "boolean" ? visibleFilter : null;
}

function getSelectedProductType(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): string | null {
  const filter = searchOptions.filter;
  if (!filter) return null;

  const productTypeFilter = (filter as any)["productType"];
  return typeof productTypeFilter === "string" ? productTypeFilter : null;
}

function getAvailableProductOptions(
  aggregationData: productsV3.AggregationResults[] = [],
  customizations: customizationsV3.Customization[] = [],
): ProductOption[] {
  // Helper function to match aggregation names case-insensitively
  const matchesAggregationName = (
    name: string,
    aggregationNames: string[],
  ): boolean => {
    return aggregationNames.some(
      (aggName) => aggName.toLowerCase() === name.toLowerCase(),
    );
  };

  // Helper function to sort choices intelligently (numbers first, then alphabetically)
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

  // Extract option names from aggregation data
  const optionNames: string[] = [];
  const choiceNames: string[] = [];

  // Process aggregation results to extract available option and choice names
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

  // Build options by matching customizations with aggregation data
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
