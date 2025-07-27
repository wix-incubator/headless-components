import { defineService } from "@wix/services-definitions";
import { implementService } from "@wix/services-definitions";
import {
  type Signal,
  SignalsServiceDefinition,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import { ProductsListServiceDefinition } from "./products-list-service.js";
import { customizationsV3 } from "@wix/stores";

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

/**
 * Configuration interface for the Products List Filters service.
 * Contains customizations data used to build filter options.
 *
 * @interface ProductsListFiltersServiceConfig
 */
export type ProductsListFiltersServiceConfig = {
  /** Array of product customizations for building filter options */
  customizations: customizationsV3.Customization[];
};

/**
 * Loads products list filters service configuration from the Wix Stores API for SSR initialization.
 * This function fetches customization data that will be used to build product filter options.
 *
 * @returns {Promise<ProductsListFiltersServiceConfig>} Promise that resolves to the filters configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/products.astro
 * import { loadProductsListFiltersServiceConfig } from '@wix/stores/services';
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * // Load filters configuration during SSR
 * const filtersConfig = await loadProductsListFiltersServiceConfig();
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
 * import { loadProductsListFiltersServiceConfig } from '@wix/stores/services';
 *
 * export const getServerSideProps: GetServerSideProps = async () => {
 *   const filtersConfig = await loadProductsListFiltersServiceConfig();
 *
 *   return {
 *     props: {
 *       filtersConfig,
 *     },
 *   };
 * };
 * ```
 */
export async function loadProductsListFiltersServiceConfig(): Promise<ProductsListFiltersServiceConfig> {
  const { items: customizations = [] } = await customizationsV3
    .queryCustomizations()
    .find();

  return {
    customizations,
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
  /** Reactive signal containing the minimum price filter value */
  minPrice: Signal<number>;
  /** Reactive signal containing the maximum price filter value */
  maxPrice: Signal<number>;
  /** Reactive signal containing available inventory status options */
  availableInventoryStatuses: Signal<InventoryStatusType[]>;
  /** Reactive signal containing selected inventory status filters */
  selectedInventoryStatuses: Signal<InventoryStatusType[]>;
  /** Reactive signal containing available product options for filtering */
  availableProductOptions: Signal<ProductOption[]>;
  /** Reactive signal containing selected product option filters */
  selectedProductOptions: Signal<Record<string, string[]>>;
  /** Function to set the minimum price filter */
  setMinPrice: (minPrice: number) => void;
  /** Function to set the maximum price filter */
  setMaxPrice: (maxPrice: number) => void;
  /** Function to toggle an inventory status filter */
  toggleInventoryStatus: (status: InventoryStatusType) => void;
  /** Function to toggle a product option choice filter */
  toggleProductOption: (optionId: string, choiceId: string) => void;
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
 * ```
 */
export const ProductsListFiltersService =
  implementService.withConfig<ProductsListFiltersServiceConfig>()(
    ProductsListFiltersServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);
      const { customizations } = config;

      const aggregationData = productsListService.aggregations.get()?.results;
      // TODO: use the aggregations to get the available inventory statuses
      // and the available price ranges
      // and the available product options
      // and the available product choices

      const minPriceSignal = signalsService.signal(
        getMinPrice(productsListService.searchOptions.get()),
      );
      const maxPriceSignal = signalsService.signal(
        getMaxPrice(productsListService.searchOptions.get()),
      );
      const availableInventoryStatusesSignal = signalsService.signal([
        InventoryStatusType.IN_STOCK,
        InventoryStatusType.OUT_OF_STOCK,
        InventoryStatusType.PARTIALLY_OUT_OF_STOCK,
      ] as InventoryStatusType[]);
      const selectedInventoryStatusesSignal = signalsService.signal(
        getSelectedInventoryStatuses(productsListService.searchOptions.get()),
      );

      // TODO: Get product options from aggregations data
      const availableProductOptionsSignal = signalsService.signal(
        getAvailableProductOptions(aggregationData, customizations),
      );
      const selectedProductOptionsSignal = signalsService.signal(
        getSelectedProductOptions(productsListService.searchOptions.get()),
      );

      const isFilteredSignal = signalsService.signal(false);

      if (typeof window !== "undefined") {
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const minPrice = minPriceSignal.get();
          const maxPrice = maxPriceSignal.get();
          const selectedInventoryStatuses =
            selectedInventoryStatusesSignal.get();
          const selectedProductOptions = selectedProductOptionsSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

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
            ] = { $gte: minPrice };
          }
          if (maxPrice > 0) {
            (newSearchOptions.filter as any)[
              "actualPriceRange.maxValue.amount"
            ] = { $lte: maxPrice };
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

          // Use callback to update search options
          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        minPrice: minPriceSignal,
        maxPrice: maxPriceSignal,
        availableInventoryStatuses: availableInventoryStatusesSignal,
        selectedInventoryStatuses: selectedInventoryStatusesSignal,
        availableProductOptions: availableProductOptionsSignal,
        selectedProductOptions: selectedProductOptionsSignal,
        setMinPrice: (minPrice: number) => {
          minPriceSignal.set(minPrice);
        },
        setMaxPrice: (maxPrice: number) => {
          maxPriceSignal.set(maxPrice);
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
        isFiltered: isFilteredSignal,
        reset: () => {
          // TODO: reset the filters to the original values from the aggregation data
          minPriceSignal.set(0);
          maxPriceSignal.set(0);
          selectedInventoryStatusesSignal.set([]);
          selectedProductOptionsSignal.set({});
          isFilteredSignal.set(false);
        },
      };
    },
  );

function getMinPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): number {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const minPriceFilter = (filter as any)["actualPriceRange.minValue.amount"];
  if (
    typeof minPriceFilter === "object" &&
    minPriceFilter !== null &&
    "$gte" in minPriceFilter
  ) {
    return Number(minPriceFilter.$gte) || 0;
  }

  return 0;
}

function getMaxPrice(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): number {
  const filter = searchOptions.filter;
  if (!filter) return 0;

  const maxPriceFilter = (filter as any)["actualPriceRange.maxValue.amount"];
  if (
    typeof maxPriceFilter === "object" &&
    maxPriceFilter !== null &&
    "$lte" in maxPriceFilter
  ) {
    return Number(maxPriceFilter.$lte) || 0;
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
