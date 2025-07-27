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
 * Currently empty as this service doesn't require initial configuration.
 *
 * @interface ProductsListSortServiceConfig
 */
export type ProductsListSortServiceConfig = {};

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
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      const selectedSortOptionSignal = signalsService.signal<string>("name");

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

          productsListService.setSearchOptions(newSearchOptions);
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
