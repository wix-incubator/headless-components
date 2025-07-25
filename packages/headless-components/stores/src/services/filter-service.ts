import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import type {
  Signal,
  ReadOnlySignal,
} from "@wix/services-definitions/core-services/signals";
import { URLParamsUtils } from "../utils/url-params.js";
import {
  CatalogServiceDefinition,
  ProductChoice,
  type ProductOption,
} from "./catalog-service.js";

export interface PriceRange {
  min: number;
  max: number;
}

export interface AvailableOptions {
  productOptions: ProductOption[];
  priceRange: PriceRange;
}

/*
  Record of optionId to choiceIds
*/
export type FilterSelectedOptions = Record<string, string[]>;

export interface Filter {
  priceRange: PriceRange;
  selectedOptions: FilterSelectedOptions;
}

export interface FilterServiceAPI {
  currentFilters: Signal<Filter>;
  applyFilters: (filters: Filter) => Promise<void>;
  clearFilters: () => Promise<void>;
  availableOptions: ReadOnlySignal<AvailableOptions>;
  isFullyLoaded: ReadOnlySignal<boolean>;
}
export const FilterServiceDefinition = defineService<FilterServiceAPI>(
  "filtered-collection"
);

export const defaultFilter: Filter = {
  priceRange: { min: 0, max: 0 },
  selectedOptions: {},
};

export const FilterService = implementService.withConfig<{
  initialFilters?: Filter;
}>()(FilterServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);
  const catalogService = getService(CatalogServiceDefinition);

  const currentFilters: Signal<Filter> = signalsService.signal(
    (config?.initialFilters || defaultFilter) as any
  );

  // Use computed signal for availableOptions to automatically track dependencies
  const availableOptions = signalsService.computed(() => {
    const catalogPriceRange = catalogService.catalogPriceRange.get();
    const catalogOptions = catalogService.catalogOptions.get();

    const priceRange =
      catalogPriceRange &&
      catalogPriceRange.minPrice < catalogPriceRange.maxPrice
        ? { min: catalogPriceRange.minPrice, max: catalogPriceRange.maxPrice }
        : { min: 0, max: 0 };

    const productOptions =
      catalogOptions && catalogOptions.length > 0 ? catalogOptions : [];

    return {
      productOptions,
      priceRange,
    };
  });

  // Use computed signal for isFullyLoaded to automatically track dependencies
  const isFullyLoaded = signalsService.computed(() => {
    const catalogPriceRange = catalogService.catalogPriceRange.get();
    const catalogOptions = catalogService.catalogOptions.get();

    // Price range data is considered loaded whether it's null (no prices) or has valid data
    const hasPriceRangeData = catalogPriceRange !== undefined; // includes null case
    const hasOptionsData = !!(catalogOptions && catalogOptions.length >= 0); // Even 0 options is valid

    return hasPriceRangeData && hasOptionsData;
  });

  // Effect to update currentFilters when catalog data loads (only if filters are at defaults)
  signalsService.effect(() => {
    const catalogPriceRange = catalogService.catalogPriceRange.get();
    if (
      catalogPriceRange &&
      catalogPriceRange.minPrice < catalogPriceRange.maxPrice
    ) {
      const priceRange = {
        min: catalogPriceRange.minPrice,
        max: catalogPriceRange.maxPrice,
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

  // Apply filters by delegating to the collection service
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
            (opt) => opt.id === optionId
          );
          if (option && choiceIds.length > 0) {
            const selectedChoices = option.choices.filter(
              (choice: ProductChoice) => choiceIds.includes(choice.id)
            );
            if (selectedChoices.length > 0) {
              // Use 'availability' as URL param for inventory filter
              const paramName =
                optionId === "inventory-filter" ? "availability" : option.name;
              urlParams[paramName] = selectedChoices.map(
                (choice) => choice.name
              );
            }
          }
        }
      );
    }

    // Preserve existing sort parameter
    const currentParams = URLParamsUtils.getURLParams();
    if (currentParams["sort"]) {
      urlParams["sort"] = currentParams["sort"];
    }

    URLParamsUtils.updateURL(urlParams);
  };

  // Clear all filters by applying default filter state
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

  return {
    currentFilters,
    applyFilters,
    clearFilters,
    availableOptions,
    isFullyLoaded,
  };
});
