import { defineService, implementService } from "@wix/services-definitions";
import {SignalsServiceDefinition, type Signal} from "@wix/services-definitions/core-services/signals";
import * as items from '@wix/wix-data-items-sdk';

export type WixDataItem = items.WixDataItem;

/**
 * Pagination state interface for the CMS CRUD service.
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
}

/**
 * Sort order type for the CMS CRUD service.
 * Represents the direction of sorting.
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Sort item interface for the CMS CRUD service.
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
 * Filter operator type for the CMS CRUD service.
 * Represents the available filter operators.
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
 * Filter condition type for the CMS CRUD service.
 * Represents a filter condition using an operator and a value.
 */
export type FilterCondition = {
  [key in FilterOperator]?: any;
};

/**
 * Filter map type for the CMS CRUD service.
 * Maps field names to filter conditions.
 */
export type FilterMap = {
  [fieldName: string]: FilterCondition;
};

/**
 * Configuration interface for the CMS CRUD service.
 * Contains the collection ID needed to initialize the CMS CRUD functionality.
 *
 * @interface CmsCrudServiceConfig
 */
export interface CmsCrudServiceConfig {
  /** The collection ID to perform CRUD operations on */
  collectionId: string;
  /** Default page size for pagination (optional) */
  defaultPageSize?: number;
}


/**
 * Service definition for the CMS CRUD service.
 * This defines the reactive API contract for managing CMS data with CRUD operations.
 *
 * @constant
 */
export const CmsCrudServiceDefinition = defineService<{
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
   * @param page - The page number to set (1-based)
   * @returns Promise<void> - Updates itemsSignal and paginationSignal with the result
   */
  setPage: (page: number) => Promise<void>;

  /**
   * Sets the page size for pagination
   * @param pageSize - The number of items per page
   * @returns Promise<void> - Updates itemsSignal and paginationSignal with the result
   */
  setPageSize: (pageSize: number) => Promise<void>;

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

}>("CmsCrud");

/**
 * Implementation of the CMS CRUD service that manages CRUD operations for Wix Data collections.
 * This service provides signals for loading state, error handling, and data management,
 * along with methods to perform CRUD operations on a specified collection.
 *
 * @example
 * ```tsx
 * import { CmsCrudServiceImplementation, CmsCrudServiceDefinition } from '@wix/cms/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function CmsComponent({ cmsConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [CmsCrudServiceDefinition, CmsCrudServiceImplementation.withConfig(cmsConfig)]
 *     ])}>
 *       <CmsDataManager />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function CmsDataManager() {
 *   const cmsService = useService(CmsCrudServiceDefinition);
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
export const CmsCrudServiceImplementation = implementService.withConfig<CmsCrudServiceConfig>()(
  CmsCrudServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);
    const defaultPageSize = config.defaultPageSize || 10;

    const loadingSignal = signalsService.signal(false) as Signal<boolean>;
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
    }) as Signal<PaginationState>;

    // Initialize sort signal with empty array
    const sortSignal = signalsService.signal<SortItem[]>([]) as Signal<SortItem[]>;

    // Initialize filter signal with empty object
    const filterSignal = signalsService.signal<FilterMap>({}) as Signal<FilterMap>;

    const withErrorHandling = async <T>(
      crudOperation: () => Promise<T>,
      errorMessage: string,
    ): Promise<T | void> => {
      loadingSignal.set(true);
      errorSignal.set(null);

      try {
        return await crudOperation();
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
     * Builds a query with pagination, sorting, and filtering applied
     * @param collectionId - The collection ID to query
     * @returns A query object with pagination, sorting, and filtering applied
     */
    const buildQuery = (collectionId: string) => {
      let query = items.query(collectionId);

      // Apply pagination
      const pagination = paginationSignal.get();
      const skip = (pagination.currentPage - 1) * pagination.pageSize;
      query = query.limit(pagination.pageSize).skip(skip);

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
          default:
            break;
        }
      });

      return query;
    };

    /**
     * Updates the pagination state based on the query result
     * @param result - The query result
     */
    const updatePaginationState = (result: items.WixDataResult) => {
      const pagination = paginationSignal.get();
      const totalItems = result.totalCount;
      const totalPages = totalItems ? Math.ceil(totalItems / pagination.pageSize): 1;

      paginationSignal.set({
        ...pagination,
        totalItems: totalItems ?? 0,
        totalPages,
        hasPrevPage: pagination.currentPage > 1,
        hasNextPage: pagination.currentPage < totalPages,
      });
    };

    const getAllItems = async <T extends WixDataItem>(collectionId: string): Promise<void> => {
      await withErrorHandling(async () => {
        const query = buildQuery(collectionId);
        const result = await query.find();

        itemsSignal.set(result.items as T[]);
        updatePaginationState(result);
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
     * Sets the page size for pagination and refreshes the data
     * @param pageSize - The number of items per page
     */
    const setPageSize = async (pageSize: number): Promise<void> => {
      if (pageSize < 1) {
        throw new Error('Page size must be at least 1');
      }

      const pagination = paginationSignal.get();
      paginationSignal.set({
        ...pagination,
        pageSize,
        currentPage: 1, // Reset to first page when changing page size
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

    return {
      create: createItem,
      getAll: getAllItems,
      getById: getItemById,
      update: updateItem,
      delete: deleteItem,
      setCollection: setCollectionId,
      setPage,
      setPageSize,
      nextPage,
      prevPage,
      setSort,
      addFilter,
      removeFilter,
      clearFilters,
      loadingSignal,
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
 * Loads CMS CRUD service initial data for Server-Side Rendering (SSR) initialization.
 * This function is designed to be used during SSR to preload
 * the collection ID required for the CMS CRUD functionality.
 *
 * @param {string} collectionId - The collection ID to perform CRUD operations on
 * @returns {Promise<Object>} Promise that resolves to the CMS CRUD service configuration data
 *
 * @example
 * ```astro
 * ---
 * // Astro page example
 * import { loadCmsCrudServiceInitialData } from '@wix/cms/services';
 * import { CmsCrud } from '@wix/cms/components';
 *
 * // Load CMS data during SSR
 * const cmsData = await loadCmsCrudServiceInitialData('MyCollection');
 * ---
 *
 * <CmsCrud.Root cmsCrudServiceConfig={cmsData[CmsCrudServiceDefinition]}>
 *   <CmsCrud>
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
 *   </CmsCrud>
 * </CmsCrud.Root>
 * ```
 */
export const loadCmsCrudServiceInitialData = async (collectionId: string) => {
  return {
    [CmsCrudServiceDefinition]: {
      collectionId,
    },
  };
};

/**
 * Helper function to create a CMS CRUD service binding with configuration.
 * This function simplifies the process of binding the CMS CRUD service with its configuration.
 *
 * @template T - Type of the services configurations object
 * @param {T} servicesConfigs - Object containing service configurations
 * @returns Tuple containing service definition, implementation, and configuration
 *
 * @example
 * ```tsx
 * import { cmsCrudServiceBinding, loadCmsCrudServiceInitialData } from '@wix/cms/services';
 *
 * // Load initial data
 * const initialData = await loadCmsCrudServiceInitialData('MyCollection');
 *
 * // Create service binding
 * const cmsBinding = cmsCrudServiceBinding(initialData);
 *
 * // Use in service provider
 * const services = createServicesMap([cmsBinding]);
 * ```
 */
export const cmsCrudServiceBinding = <T extends {
    [key: string]: Awaited<ReturnType<typeof loadCmsCrudServiceInitialData>>[typeof CmsCrudServiceDefinition];
  }, >(servicesConfigs: T) => {
  return [
    CmsCrudServiceDefinition,
    CmsCrudServiceImplementation,
    servicesConfigs[CmsCrudServiceDefinition] as CmsCrudServiceConfig,
  ] as const;
};
