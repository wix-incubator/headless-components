import { defineService, implementService } from "@wix/services-definitions";
import {SignalsServiceDefinition, type Signal} from "@wix/services-definitions/core-services/signals";
import * as items from '@wix/wix-data-items-sdk';

export type WixDataItem = items.WixDataItem;

/**
 * Pagination state interface for the CMS service.
 * Contains information about the current pagination state.
 *
 * @interface PaginationState
 */
export interface PaginationState {
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a previous page */
  hasPrevPage: boolean;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Number of items loaded so far (for load more functionality) */
  setPage?: (page: number) => Promise<void>;
  /** Number of items currently loaded (for load more functionality) */
  loadedItems: number;
  /** Whether there are more items to load */
  hasMoreItems: boolean;
}

/**
 * Sort order type for the CMS service.
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Sort interface for the CMS service.
 * Represents a single sort criterion.
 *
 * @interface SortItem
 */
export interface SortItem {
  /** Field name to sort by */
  fieldName: string;
  /** Sort order (ascending or descending) */
  order: SortOrder;
}

/**
 * Filter operator type for the CMS service.
 */
export type FilterOperator =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$hasSome'
  | '$contains'
  | '$startsWith'
  | '$endsWith';

/**
 * Filter condition type for the CMS service.
 * Represents a filter condition using an operator and a value.
 */
export type FilterCondition = {
  [key in FilterOperator]?: any;
};

/**
 * Filter map type for the CMS service.
 * Maps field names to filter conditions.
 */
export type FilterMap = {
  [fieldName: string]: FilterCondition;
};

/**
 * Configuration interface for the CMS service.
 * Contains the collection ID needed to initialize the CMS functionality.
 *
 * @interface CMSServiceConfig
 */
export interface CMSServiceConfig {
  /** The collection ID to perform operations on */
  collectionId: string;
  /** Default page size for pagination (optional) */
  defaultPageSize?: number;
}


/**
 * Service definition for the CMS service.
 * This defines the reactive API contract for managing CMS data with operations.
 *
 * @constant
 */
export const CMSServiceDefinition = defineService<{
  /**
   * Creates a new item in the collection
   * @param collectionId - The collection ID to perform the operation on
   * @param itemData - Data for the new item
   * @returns Promise<void> - Updates itemsSignal with the result
   */
  create: <T extends WixDataItem>(collectionId: string, itemData: T) => Promise<void>;

  /**
   * Retrieves all items from the collection
   * @param collectionId - The collection ID to perform the operation on
   * @returns Promise<void> - Updates itemsSignal with the result
   */
  getAll: (collectionId: string) => Promise<void>;

  /**
   * Retrieves a single item by ID
   * @param collectionId - The collection ID to perform the operation on
   * @param itemId - ID of the item to retrieve
   * @returns Promise<void> - Updates itemSignal with the result
   */
  getById: (collectionId: string, itemId: string) => Promise<void>;

  /**
   * Updates an existing item
   * @param collectionId - The collection ID to perform the operation on
   * @param itemData - Updated item data (must include _id)
   * @returns Promise<void> - Updates itemsSignal and itemSignal with the result
   */
  update: <T extends WixDataItem>(collectionId: string, itemData: T & { _id: string }) => Promise<void>;

  /**
   * Deletes an item by ID
   * @param collectionId - The collection ID to perform the operation on
   * @param itemId - ID of the item to delete
   * @returns Promise<void> - Updates itemsSignal and itemSignal with the result
   */
  delete: (collectionId: string, itemId: string) => Promise<void>;

  /** Sets the default collection ID for subsequent operations */
  setCollection: (collectionId: string) => void;

  /**
   * Sets the current page for pagination
   * @param page - The page number to set
   * @returns Promise<void> - Updates itemsSignal and paginationSignal with the result
   */
  setPage: (page: number) => Promise<void>;

  /**
   * Navigates to the next page
   * @returns Promise<void> - Updates itemsSignal and paginationSignal with the result
   */
  nextPage: () => Promise<void>;

  /**
   * Navigates to the previous page
   * @returns Promise<void> - Updates itemsSignal and paginationSignal with the result
   */
  prevPage: () => Promise<void>;

  /**
   * Loads more items and appends them to the current list
   * @returns Promise<void> - Appends new items to itemsSignal and updates paginationSignal
   */
  loadMore: () => Promise<void>;

  /**
   * Sets the sort criteria for the query
   * @param sortItems - Array of sort items (field name and sort order)
   * @returns Promise<void> - Updates itemsSignal with the sorted result
   */
  setSort: (sortItems: SortItem[]) => Promise<void>;

  /**
   * Adds a filter condition for a specific field
   * @param fieldName - The field name to filter on
   * @param condition - The filter condition
   * @returns Promise<void> - Updates itemsSignal with the filtered result
   */
  addFilter: (fieldName: string, condition: FilterCondition) => Promise<void>;

  /**
   * Removes a filter condition for a specific field
   * @param fieldName - The field name to remove the filter for
   * @returns Promise<void> - Updates itemsSignal with the filtered result
   */
  removeFilter: (fieldName: string) => Promise<void>;

  /**
   * Clears all filter conditions
   * @returns Promise<void> - Updates itemsSignal with the unfiltered result
   */
  clearFilters: () => Promise<void>;

  /** Reactive signal indicating if an operation is in progress */
  loadingSignal: Signal<boolean>;

  /** Reactive signal indicating if a **load more** operation is in progress */
  loadingMoreSignal: Signal<boolean>;

  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;

  /** Reactive signal containing the list of items */
  itemsSignal: Signal<WixDataItem[]>;

  /** Reactive signal containing a single item or null if not found */
  itemSignal: Signal<WixDataItem | null>;

  /** Reactive signal containing the current collection ID */
  currentCollectionSignal: Signal<string>;

  /** Reactive signal containing the current pagination state */
  paginationSignal: Signal<PaginationState>;

  /** Reactive signal containing the current sort criteria */
  sortSignal: Signal<SortItem[]>;

  /** Reactive signal containing the current filter conditions */
  filterSignal: Signal<FilterMap>;

}>("CMSService");

/**
 * Implementation of the CMS service that manages operations for Wix Data collections.
 * This service provides signals for loading state, error handling, and data management,
 * along with methods to perform operations on a specified collection.
 *
 * @example
 * ```tsx
 * import { CMSServiceImplementation, CMSServiceDefinition } from '@wix/cms/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CmsComponent({ cmsConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CMSServiceDefinition, CMSServiceImplementation.withConfig(cmsConfig)]
 *     ])}>
 *       <CmsDataManager />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CmsDataManager() {
 *   const cmsService = useService(CMSServiceDefinition);
 *   const isLoading = cmsService.loadingSignal.get();
 *   const error = cmsService.errorSignal.get();
 *   const items = cmsService.itemsSignal.get();
 *
 *   const handleCreate = async () => {
 *     const newItem = { title: "New Item", description: "Description" };
 *     await cmsService.create(newItem);
 *   };
 *
 *   return (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button onClick={handleCreate} disabled={isLoading}>
 *         {isLoading ? 'Creating...' : 'Create Item'}
 *       </button>
 *       <ul>
 *         {items.map(item => (
 *           <li key={item._id}>{item.title}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export const CMSServiceImplementation = implementService.withConfig<CMSServiceConfig>()(
  CMSServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const defaultPageSize = config.defaultPageSize || 10;

    const loadingSignal = signalsService.signal(false) as Signal<boolean>;
    const loadingMoreSignal = signalsService.signal(false) as Signal<boolean>;
    const errorSignal = signalsService.signal<string | null>(null) as Signal<string | null>;
    const itemsSignal = signalsService.signal<WixDataItem[]>([]) as Signal<WixDataItem[]>;
    const itemSignal = signalsService.signal<WixDataItem | null>(null) as Signal<WixDataItem | null>;
    const currentCollectionSignal = signalsService.signal<string>(config.collectionId) as Signal<string>;

    // Initialize pagination signal with default values
    const paginationSignal = signalsService.signal<PaginationState>({
      currentPage: 1,
      pageSize: defaultPageSize,
      totalItems: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
      loadedItems: 0,
      hasMoreItems: false,
    }) as Signal<PaginationState>;

    // Initialize sort signal with empty array
    const sortSignal = signalsService.signal<SortItem[]>([]) as Signal<SortItem[]>;

    // Initialize filter signal with empty object
    const filterSignal = signalsService.signal<FilterMap>({}) as Signal<FilterMap>;

    const withErrorHandling = async <T>(
      CMSOperation: () => Promise<T>,
      errorMessage: string,
    ): Promise<T | void> => {
      loadingSignal.set(true);
      errorSignal.set(null);

      try {
        return await CMSOperation();
      } catch (error) {
        errorSignal.set(error instanceof Error ? error.message : errorMessage);
      } finally {
        loadingSignal.set(false);
      }
    };

    const createItem = async <T extends WixDataItem>(collectionId: string, itemData: T): Promise<void> => {
      await withErrorHandling(async () => {
        const result = await items.insert(collectionId, itemData);

        const currentItems = itemsSignal.get();
        itemsSignal.set([...currentItems, result]);

        itemSignal.set(result);
      }, `Failed to create ${collectionId}`);
    };

    /**
     * Builds a query with optional pagination, sorting, and filtering applied
     * This function combines the functionality of the previous buildQuery and buildBaseQuery functions
     * to reduce code duplication and improve maintainability.
     *
     * @param collectionId - The collection ID to query
     * @param options - Query options
     * @param options.includePagination - Whether to include pagination (default: true)
     * @returns A query object with the requested options applied
     */
    const buildQuery = (collectionId: string, options: { includePagination?: boolean } = { includePagination: true }) => {
      let query = items.query(collectionId);

      // Apply pagination if requested
      if (options.includePagination) {
        const pagination = paginationSignal.get();
        const skip = (pagination.currentPage - 1) * pagination.pageSize;
        query = query.limit(pagination.pageSize).skip(skip);
      }

      // Apply sorting
      const sortItems = sortSignal.get();
      if (sortItems.length > 0) {
        sortItems.forEach(sortItem => {
          query = sortItem.order === 'ASC'
            ? query.ascending(sortItem.fieldName)
            : query.descending(sortItem.fieldName);
        });
      }

      // Apply filtering
      const filters = filterSignal.get();
      // condition e.g { fieldName: { $eq: 'value' } }
      Object.entries(filters).forEach(([fieldName, condition]) => {
        const entries = Object.entries(condition);
        if (entries.length === 0) return;

        const entry = entries[0];
        if (!entry) return;
        const operator = entry[0];
        const value = entry[1];

        switch (operator) {
          case '$eq':
            query = query.eq(fieldName, value);
            break;
          case '$ne':
            query = query.ne(fieldName, value);
            break;
          case '$gt':
            query = query.gt(fieldName, value);
            break;
          case '$gte':
            query = query.ge(fieldName, value);
            break;
          case '$lt':
            query = query.lt(fieldName, value);
            break;
          case '$lte':
            query = query.le(fieldName, value);
            break;
          case '$hasSome':
            query = query.hasSome(fieldName, value);
            break;
          case '$contains':
            query = query.contains(fieldName, value);
            break;
          case '$startsWith':
            query = query.startsWith(fieldName, value);
            break;
          case '$endsWith':
            query = query.endsWith(fieldName, value);
            break;
        }
      });

      return query;
    };

    /**
     * Updates the pagination state based on the query result
     * @param result - The query result
     * @param isLoadMore - Whether this is a load more operation (append mode)
     */
    const updatePaginationState = (result: items.WixDataResult<WixDataItem>, isLoadMore = false) => {
      const pagination = paginationSignal.get();
      const totalItems = result.totalCount ?? 0;
      const totalPages = totalItems ? Math.ceil(totalItems / pagination.pageSize) : 1;
      const currentLoadedItems = isLoadMore ? pagination.loadedItems + result.items.length : result.items.length;

      paginationSignal.set({
        ...pagination,
        totalItems,
        totalPages,
        hasPrevPage: pagination.currentPage > 1,
        hasNextPage: pagination.currentPage < totalPages,
        loadedItems: currentLoadedItems,
        hasMoreItems: currentLoadedItems < totalItems,
      });
    };

    const getAllItems = async <T extends WixDataItem>(collectionId: string): Promise<void> => {
      await withErrorHandling(async () => {
        const query = buildQuery(collectionId);

        // Get total count with same filters/sorting (no pagination)
        const baseQuery = buildQuery(collectionId, { includePagination: false });
        const totalCountPromise = baseQuery.count();

        // Get the paginated results
        const [result, totalCountResult] = await Promise.all([
          query.find(),
          totalCountPromise
        ]);

        itemsSignal.set(result.items as T[]);

        // Create a modified result with the correct total count
        const resultWithTotalCount = {
          ...result,
          totalCount: totalCountResult
        };

        updatePaginationState(resultWithTotalCount, false);
      }, `Failed to fetch ${collectionId}s`);
    };

    const getItemById = async <T extends WixDataItem>(collectionId: string, itemId: string): Promise<void> => {
      await withErrorHandling(async () => {
        const result = await items.query(collectionId).eq("_id", itemId).find();

        if (result.items.length > 0) {
          itemSignal.set(result.items[0] as T);
        } else {
          itemSignal.set(null);
        }
      }, `Failed to fetch ${collectionId} by ID`);
    };

    const updateItem = async <T extends WixDataItem>(
      collectionId: string,
      itemData: T & { _id: string }
    ): Promise<void> => {
      await withErrorHandling(async () => {
        if (!itemData._id) {
          throw new Error(`${collectionId} ID is required for update`);
        }

        const result = await items.update(collectionId, itemData);

        const currentItems = itemsSignal.get();
        const updatedItems = currentItems.map(i => i._id === itemData._id ? result : i);
        itemsSignal.set(updatedItems);

        const currentItem = itemSignal.get();
        if (currentItem && currentItem._id === itemData._id) {
          itemSignal.set(result);
        }
      }, `Failed to update ${collectionId}`);
    };

    const deleteItem = async (collectionId: string, itemId: string): Promise<void> => {
      await withErrorHandling(async () => {
        if (!itemId) {
          throw new Error(`${collectionId} ID is required for deletion`);
        }

        await items.remove(collectionId, itemId);

        const currentItems = itemsSignal.get();
        const updatedItems = currentItems.filter(item => item._id !== itemId);
        itemsSignal.set(updatedItems);

        const currentItem = itemSignal.get();
        if (currentItem && currentItem._id === itemId) {
          itemSignal.set(null);
        }
      }, `Failed to delete ${collectionId}`);
    };

    const setCollectionId = (collectionId: string): void => {
      if (!collectionId) {
        throw new Error('Collection ID is required');
      }
      currentCollectionSignal.set(collectionId);
    };

    /**
     * Sets the current page for pagination and refreshes the data
     * @param page - The page number to set (1-based)
     */
    const setPage = async (page: number): Promise<void> => {
      if (page < 1) {
        throw new Error('Page number must be at least 1');
      }

      const pagination = paginationSignal.get();
      paginationSignal.set({
        ...pagination,
        currentPage: page,
      });

      await getAllItems(currentCollectionSignal.get());
    };

    /**
     * Navigates to the next page if available
     */
    const nextPage = async (): Promise<void> => {
      const pagination = paginationSignal.get();
      if (pagination.hasNextPage) {
        await setPage(pagination.currentPage + 1);
      }
    };

    /**
     * Navigates to the previous page if available
     */
    const prevPage = async (): Promise<void> => {
      const pagination = paginationSignal.get();
      if (pagination.hasPrevPage) {
        await setPage(pagination.currentPage - 1);
      }
    };

    /**
     * Sets the sort criteria for the query and refreshes the data
     * @param sortItems - Array of sort items (field name and sort order)
     */
    const setSort = async (sortItems: SortItem[]): Promise<void> => {
      sortSignal.set(sortItems);
      await getAllItems(currentCollectionSignal.get());
    };

    /**
     * Adds a filter condition for a specific field and refreshes the data
     * @param fieldName - The field name to filter on
     * @param condition - The filter condition
     */

    const addFilter = async (fieldName: string, condition: FilterCondition): Promise<void> => {
      const filters = filterSignal.get();
      filterSignal.set({
        ...filters,
        [fieldName]: condition,
      });

      // Reset to first page when adding a filter
      const pagination = paginationSignal.get();
      paginationSignal.set({
        ...pagination,
        currentPage: 1,
      });

      await getAllItems(currentCollectionSignal.get());
    };

    /**
     * Removes a filter condition for a specific field and refreshes the data
     * @param fieldName - The field name to remove the filter for
     */
    const removeFilter = async (fieldName: string): Promise<void> => {
      const filters = filterSignal.get();
      const { [fieldName]: _, ...remainingFilters } = filters;
      filterSignal.set(remainingFilters);

      // Reset to first page when removing a filter
      const pagination = paginationSignal.get();
      paginationSignal.set({
        ...pagination,
        currentPage: 1,
      });

      await getAllItems(currentCollectionSignal.get());
    };

    /**
     * Clears all filter conditions and refreshes the data
     */
    const clearFilters = async (): Promise<void> => {
      filterSignal.set({});

      // Reset to first page when clearing filters
      const pagination = paginationSignal.get();
      paginationSignal.set({
        ...pagination,
        currentPage: 1,
      });

      await getAllItems(currentCollectionSignal.get());
    };

    /**
     * Loads more items and appends them to the current list
     */
    const loadMore = async (): Promise<void> => {
      const pagination = paginationSignal.get();
      if (!pagination.hasMoreItems) {
        return;
      }

      loadingMoreSignal.set(true);
      errorSignal.set(null);

      try {
        const nextPage = pagination.currentPage + 1;
        const collectionId = currentCollectionSignal.get();

        // Temporarily update pagination to next page for query
        const tempPagination = { ...pagination, currentPage: nextPage };
        paginationSignal.set(tempPagination);

        const query = buildQuery(collectionId);

        // Get total count with same filters/sorting (but no pagination)
        const baseQuery = buildQuery(collectionId, { includePagination: false });
        const totalCountPromise = baseQuery.count();

        // Get the paginated results
        const [result, totalCountResult] = await Promise.all([
          query.find(),
          totalCountPromise
        ]);

        // Append new items to existing ones
        const currentItems = itemsSignal.get();
        const allItems = [...currentItems, ...result.items];
        itemsSignal.set(allItems);

        // Create a modified result with the correct total count
        const resultWithTotalCount = {
          ...result,
          totalCount: totalCountResult
        };

        updatePaginationState(resultWithTotalCount, true);
      } catch (error) {
        errorSignal.set(error instanceof Error ? error.message : `Failed to load more items from ${currentCollectionSignal.get()}`);
      } finally {
        loadingMoreSignal.set(false);
      }
    };

    return {
      create: createItem,
      getAll: getAllItems,
      getById: getItemById,
      update: updateItem,
      delete: deleteItem,
      setCollection: setCollectionId,
      setPage,
      nextPage,
      prevPage,
      loadMore,
      setSort,
      addFilter,
      removeFilter,
      clearFilters,
      loadingSignal,
      loadingMoreSignal,
      errorSignal,
      itemsSignal,
      itemSignal,
      currentCollectionSignal,
      paginationSignal,
      sortSignal,
      filterSignal,
    };
  }
);

/**
 * Loads CMS service initial data for Server-Side Rendering (SSR) initialization.
 * This function is designed to be used during SSR to preload
 * the collection ID required for the CMS functionality.
 *
 * @param {string} collectionId - The collection ID to perform operations on
 * @returns {Promise<Object>} Promise that resolves to the CMS service configuration data
 *
 * @example
 * ```astro
 * ---
 * // Astro page example
 * import { loadCMSServiceInitialData } from '@wix/cms/services';
 * import { CMS } from '@wix/cms/components';
 *
 * // Load CMS data during SSR
 * const cmsData = await loadCMSServiceInitialData('MyCollection');
 * ---
 *
 * <CMS.Root cmsCrudServiceConfig={cmsData[CMSServiceDefinition]}>
 *   <CMS>
 *   {({ create, getAll, items, isLoading, error }) => (
 *     <div>
 *       {error && <div className="error">{error}</div>}
 *       <button onClick={() => getAll()} disabled={isLoading}>
 *         {isLoading ? 'Loading...' : 'Refresh Items'}
 *       </button>
 *       <ul>
 *         {items.map(item => (
 *           <li key={item._id}>{item.title}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   )}
 *   </CMS>
 * </CMS.Root>
 * ```
 */
export const loadCMSServiceInitialData = async (collectionId: string) => {
  return {
    [CMSServiceDefinition]: {
      collectionId,
    },
  };
};

/**
 * Helper function to create a CMS service binding with configuration.
 * This function simplifies the process of binding the CMS service with its configuration.
 *
 * @template T - Type of the services configurations object
 * @param {T} servicesConfigs - Object containing service configurations
 * @returns Tuple containing service definition, implementation, and configuration
 *
 * @example
 * ```tsx
 * import { cmsCrudServiceBinding, loadCMSServiceInitialData } from '@wix/cms/services';
 *
 * // Load initial data
 * const initialData = await loadCMSServiceInitialData('MyCollection');
 *
 * // Create service binding
 * const cmsBinding = cmsCrudServiceBinding(initialData);
 *
 * // Use in service provider
 * const services = createServicesMap([cmsBinding]);
 * ```
 */
export const CMSServiceBinding = <T extends {
    [key: string]: Awaited<ReturnType<typeof loadCMSServiceInitialData>>[typeof CMSServiceDefinition];
  }, >(servicesConfigs: T) => {
  return [
    CMSServiceDefinition,
    CMSServiceImplementation,
    servicesConfigs[CMSServiceDefinition] as CMSServiceConfig,
  ] as const;
};

