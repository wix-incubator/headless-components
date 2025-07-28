import type { Signal } from "@wix/services-definitions/core-services/signals";
import { defineService, implementService } from "@wix/services-definitions";
import { SignalsServiceDefinition } from "@wix/services-definitions/core-services/signals";
import { ProductsListServiceDefinition } from "./products-list-service.js";
import { productsV3 } from "@wix/stores";

/**
 * Service definition for the Products List Sort service.
 * This defines the reactive API contract for managing product list sorting options.
 *
 * @constant
 */
export const ProductsListSortServiceDefinition = defineService<{
  /** Reactive signal containing the currently selected sort option */
  selectedSortOption: Signal<string>;
  /** Function to update the selected sort option */
  setSelectedSortOption: (sort: string) => void;
  /** Array of available sort types */
  sortOptions: SortType[];
}>("products-list-sort");

/**
 * Configuration interface for the Products List Sort service.
 * Allows setting initial sort option from URL parameters.
 *
 * @interface ProductsListSortServiceConfig
 */
export type ProductsListSortServiceConfig = {
  /** Initial sort option from URL parameters */
  initialSort?: SortType;
};

/**
 * Enumeration of available product sort types.
 * These values correspond to how products can be sorted in the product list.
 *
 * @enum {string}
 */
export enum SortType {
  /** Sort by newest products first */
  NEWEST = "newest",
  /** Sort by product name in ascending order (A-Z) */
  NAME_ASC = "name_asc",
  /** Sort by product name in descending order (Z-A) */
  NAME_DESC = "name_desc",
  /** Sort by price in ascending order (lowest first) */
  PRICE_ASC = "price_asc",
  /** Sort by price in descending order (highest first) */
  PRICE_DESC = "price_desc",
  /** Sort by recommended products (algorithm-based) */
  RECOMMENDED = "recommended",
}

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
      return "name"; // Default fallback
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
 * Update URL with sort parameter
 */
function updateUrlWithSort(sortType: string): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const urlSort = convertSortTypeToUrl(sortType as SortType);

  // Only add sort parameter if it's not the default (name ascending)
  if (sortType === SortType.NAME_ASC) {
    url.searchParams.delete("sort");
  } else {
    url.searchParams.set("sort", urlSort);
  }

  // Update URL without page reload
  window.history.pushState({}, "", url.toString());
}

/**
 * Load sort service configuration from URL parameters
 */
export function loadProductsListSortServiceConfig(
  url: string,
): ProductsListSortServiceConfig {
  const urlObj = new URL(url);
  const sortParam = urlObj.searchParams.get("sort");

  if (sortParam) {
    const sortType = convertUrlSortToSortType(sortParam);
    if (sortType) {
      return { initialSort: sortType };
    }
  }

  return {}; // Default configuration
}

/**
 * Implementation of the Products List Sort service that manages reactive sorting state.
 * This service provides signals for the current sort option and automatically updates
 * the products list search options when the sort selection changes.
 *
 * @example
 * ```tsx
 * import { ProductsListSortService, ProductsListSortServiceDefinition, SortType } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function SortComponent() {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProductsListSortServiceDefinition, ProductsListSortService.withConfig({})]
 *     ])}>
 *       <SortSelector />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function SortSelector() {
 *   const sortService = useService(ProductsListSortServiceDefinition);
 *   const selectedSort = sortService.selectedSortOption.get();
 *   const sortOptions = sortService.sortOptions;
 *
 *   return (
 *     <select
 *       value={selectedSort}
 *       onChange={(e) => sortService.setSelectedSortOption(e.target.value)}
 *     >
 *       {sortOptions.map(option => (
 *         <option key={option} value={option}>
 *           {option === SortType.NAME_ASC ? 'Name A-Z' :
 *            option === SortType.NAME_DESC ? 'Name Z-A' :
 *            option === SortType.PRICE_ASC ? 'Price Low to High' :
 *            option === SortType.PRICE_DESC ? 'Price High to Low' :
 *            option === SortType.NEWEST ? 'Newest First' :
 *            'Recommended'}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export const ProductsListSortService =
  implementService.withConfig<ProductsListSortServiceConfig>()(
    ProductsListSortServiceDefinition,
    ({ getService, config }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      // Initialize with URL sort if provided, otherwise default to name ascending
      const initialSort = config.initialSort || SortType.NAME_ASC;
      const selectedSortOptionSignal =
        signalsService.signal<string>(initialSort);

      if (typeof window !== "undefined") {
        signalsService.effect(() => {
          const sort = selectedSortOptionSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            ...productsListService.searchOptions.peek(),
          };

          if (!newSearchOptions.sort) {
            newSearchOptions.sort = [];
          } else {
            // Copy existing filter to avoid mutation
            newSearchOptions.sort = [...newSearchOptions.sort];
          }

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

          productsListService.setSort(newSearchOptions.sort);
        });

        // URL synchronization effect
        signalsService.effect(() => {
          const sort = selectedSortOptionSignal.get();

          if (firstRun) {
            return;
          }

          // Update URL with current sort
          updateUrlWithSort(sort);
        });
      }

      return {
        selectedSortOption: selectedSortOptionSignal,
        sortOptions: Object.values(SortType),
        setSelectedSortOption: (sort: string) =>
          selectedSortOptionSignal.set(sort),
      };
    },
  );
