import { defineService } from "@wix/services-definitions";
import { implementService } from "@wix/services-definitions";
import {
  type Signal,
  SignalsServiceDefinition,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import { ProductsListServiceDefinition } from "./products-list-service-new.js";

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

export enum InventoryStatusType {
  IN_STOCK = productsV3.InventoryAvailabilityStatus.IN_STOCK,
  OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus.OUT_OF_STOCK,
  PARTIALLY_OUT_OF_STOCK = productsV3.InventoryAvailabilityStatus
    .PARTIALLY_OUT_OF_STOCK,
}

export const ProductsListFiltersServiceDefinition = defineService<{
  minPrice: Signal<number>;
  maxPrice: Signal<number>;
  availableInventoryStatuses: Signal<InventoryStatusType[]>;
  selectedInventoryStatuses: Signal<InventoryStatusType[]>;
  availableProductOptions: Signal<ProductOption[]>;
  selectedProductOptions: Signal<Record<string, string[]>>;
  setMinPrice: (minPrice: number) => void;
  setMaxPrice: (maxPrice: number) => void;
  toggleInventoryStatus: (status: InventoryStatusType) => void;
  toggleProductOption: (optionId: string, choiceId: string) => void;
  isFiltered: Signal<boolean>;
  reset: () => void;
}>("products-list-filters");

export type ProductsListFiltersServiceConfig = {};

export const ProductsListFiltersService =
  implementService.withConfig<ProductsListFiltersServiceConfig>()(
    ProductsListFiltersServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      // const aggregationData = productsListService.aggregations.get();
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
        [] as ProductOption[],
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
          Object.entries(selectedProductOptions).forEach(
            ([optionId, choiceIds]) => {
              if (choiceIds.length > 0) {
                if (choiceIds.length === 1) {
                  (newSearchOptions.filter as any)[
                    `options.${optionId}.choice`
                  ] = choiceIds[0];
                } else {
                  (newSearchOptions.filter as any)[
                    `options.${optionId}.choice`
                  ] = {
                    $in: choiceIds,
                  };
                }
              }
            },
          );

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
