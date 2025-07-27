import { defineService } from "@wix/services-definitions";
import { implementService } from "@wix/services-definitions";
import {
  type Signal,
  SignalsServiceDefinition,
} from "@wix/services-definitions/core-services/signals";
import { productsV3 } from "@wix/stores";
import { ProductsListServiceDefinition } from "./products-list-service.js";

/**
 * Service definition for the Products List Pagination service.
 * This defines the reactive API contract for managing product list pagination state and navigation.
 *
 * @constant
 */
export const ProductsListPaginationServiceDefinition = defineService<{
  /** Reactive signal containing the current page size limit */
  currentLimit: Signal<number>;
  /** Reactive signal containing the current cursor for pagination */
  currentCursor: Signal<string | null>;
  /** Computed signal indicating if there's a next page available */
  hasNextPage: { get: () => boolean };
  /** Computed signal indicating if there's a previous page available */
  hasPrevPage: { get: () => boolean };
  /** Function to set the page size limit */
  setLimit: (limit: number) => void;
  /** Function to navigate to the next page */
  nextPage: () => void;
  /** Function to navigate to the previous page */
  prevPage: () => void;
  /** Function to navigate to the first page */
  goToFirstPage: () => void;
  /** Function to load more items (increase the limit) */
  loadMore: (count: number) => void;
}>("products-list-pagination");

/**
 * Configuration interface for the Products List Pagination service.
 * Currently empty as this service doesn't require initial configuration.
 *
 * @interface ProductsListPaginationServiceConfig
 */
export type ProductsListPaginationServiceConfig = {};

/**
 * Implementation of the Products List Pagination service that manages reactive pagination state.
 * This service provides signals for pagination state and automatically updates the products list
 * search options when pagination settings change. It supports both cursor-based pagination
 * and load-more functionality.
 *
 * @example
 * ```tsx
 * import { ProductsListPaginationService, ProductsListPaginationServiceDefinition } from '@wix/stores/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function PaginationComponent() {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ProductsListPaginationServiceDefinition, ProductsListPaginationService.withConfig({})]
 *     ])}>
 *       <PaginationControls />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function PaginationControls() {
 *   const paginationService = useService(ProductsListPaginationServiceDefinition);
 *   const currentLimit = paginationService.currentLimit.get();
 *   const hasNextPage = paginationService.hasNextPage.get();
 *   const hasPrevPage = paginationService.hasPrevPage.get();
 *
 *   return (
 *     <div>
 *       <div>
 *         Items per page:
 *         <select
 *           value={currentLimit}
 *           onChange={(e) => paginationService.setLimit(parseInt(e.target.value))}
 *         >
 *           <option value={12}>12</option>
 *           <option value={24}>24</option>
 *           <option value={48}>48</option>
 *         </select>
 *       </div>
 *
 *       <div>
 *         <button
 *           onClick={() => paginationService.goToFirstPage()}
 *           disabled={!hasPrevPage}
 *         >
 *           First
 *         </button>
 *         <button
 *           onClick={() => paginationService.prevPage()}
 *           disabled={!hasPrevPage}
 *         >
 *           Previous
 *         </button>
 *         <button
 *           onClick={() => paginationService.nextPage()}
 *           disabled={!hasNextPage}
 *         >
 *           Next
 *         </button>
 *       </div>
 *
 *       <button onClick={() => paginationService.loadMore(12)}>
 *         Load More
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export const ProductsListPaginationService =
  implementService.withConfig<ProductsListPaginationServiceConfig>()(
    ProductsListPaginationServiceDefinition,
    ({ getService }) => {
      let firstRun = true;
      const signalsService = getService(SignalsServiceDefinition);
      const productsListService = getService(ProductsListServiceDefinition);

      const currentLimitSignal = signalsService.signal(
        getCurrentLimit(productsListService.searchOptions.get()),
      );

      const currentCursorSignal = signalsService.signal<string | null>(
        getCurrentCursor(productsListService.searchOptions.get()),
      );

      // Computed signals derived from paging metadata
      const hasNextPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return pagingMetadata?.hasNext || false;
      });

      const hasPrevPageSignal = signalsService.computed(() => {
        const pagingMetadata = productsListService.pagingMetadata.get();
        return typeof pagingMetadata.cursors?.prev !== "undefined";
      });

      if (typeof window !== "undefined") {
        // Watch for changes in pagination settings and update search options
        signalsService.effect(() => {
          // CRITICAL: Read the signals FIRST to establish dependencies, even on first run
          const limit = currentLimitSignal.get();
          const cursor = currentCursorSignal.get();

          if (firstRun) {
            firstRun = false;
            return;
          }

          // Build new search options with updated pagination
          const newSearchOptions: Parameters<
            typeof productsV3.searchProducts
          >[0] = {
            ...productsListService.searchOptions.peek(),
          };

          // Update cursor paging
          if (limit > 0) {
            newSearchOptions.cursorPaging = {
              limit,
              ...(cursor && { cursor }),
            };
          } else {
            delete newSearchOptions.cursorPaging;
          }

          // Use callback to update search options
          productsListService.setSearchOptions(newSearchOptions);
        });
      }

      return {
        currentLimit: currentLimitSignal,
        currentCursor: currentCursorSignal,
        hasNextPage: hasNextPageSignal,
        hasPrevPage: hasPrevPageSignal,

        setLimit: (limit: number) => {
          currentLimitSignal.set(limit);
          // Reset pagination when changing page size
          currentCursorSignal.set(null);
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

        goToFirstPage: () => {
          currentCursorSignal.set(null);
        },
      };
    },
  );

/**
 * Helper function to extract the current limit from search options.
 * Returns the pagination limit or a default value of 100 if not specified.
 *
 * @private
 * @param {Parameters<typeof productsV3.searchProducts>[0]} searchOptions - The search options object
 * @returns {number} The current limit value
 */
function getCurrentLimit(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): number {
  return searchOptions.cursorPaging?.limit || 100;
}

/**
 * Helper function to extract the current cursor from search options.
 * Returns the cursor string or null if not specified.
 *
 * @private
 * @param {Parameters<typeof productsV3.searchProducts>[0]} searchOptions - The search options object
 * @returns {string | null} The current cursor value or null
 */
function getCurrentCursor(
  searchOptions: Parameters<typeof productsV3.searchProducts>[0],
): string | null {
  return searchOptions.cursorPaging?.cursor || null;
}
