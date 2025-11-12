import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';
import type {
  SortValue,
  FilterValue as Filter,
} from '@wix/headless-components/react';

export type WixDataItem = items.WixDataItem;
export type WixDataQueryResult = items.WixDataResult;

/**
 * Parameters for linking an item to another item
 */
export interface LinkItemParams {
  referenceFieldId: string;
  itemId: string;
  referencedItemIds: string | string[];
}

/**
 * Utility function to extract error messages consistently
 */
function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

/**
 * Service definition for the CMS Collection service.
 */
export const CmsCollectionServiceDefinition = defineService<{
  /** Reactive signal indicating if items are currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Reactive signal containing the current query result with pagination data */
  queryResultSignal: Signal<WixDataQueryResult | null>;
  /** Reactive signal containing the current sort value */
  sortSignal: Signal<SortValue>;
  /** Reactive signal containing the current filter value */
  filterSignal: Signal<Filter | null>;
  /** Function to explicitly invalidate and reload items */
  invalidate: () => Promise<void>;
  /** Function to load items with optional query options */
  loadItems: (options?: CmsQueryOptions) => Promise<void>;
  /** Function to create a new item in the collection */
  createItem: (itemData: Partial<WixDataItem>) => Promise<WixDataItem>;
  /** Function to insert a reference between items */
  linkItem: (params: LinkItemParams) => Promise<void>;
  /** Function to update an existing item in the collection */
  updateItem: (
    itemId: string,
    itemData: Partial<WixDataItem>,
  ) => Promise<WixDataItem>;
  /** Function to delete an item from the collection */
  deleteItem: (itemId: string) => Promise<void>;
  /** Function to remove a reference between items */
  unlinkItem: (params: LinkItemParams) => Promise<void>;
  /** Function to update the sort value */
  setSort: (sort: SortValue) => void;
  /** Function to update the filter value */
  setFilter: (filter: Filter) => void;
  /** Function to reset all filters */
  resetFilter: () => void;
  /** Function to check if filters are applied */
  isFiltered: () => boolean;
  /** The collection ID */
  collectionId: string;
}>('cms-collection');

/**
 * Interface for initial query options
 */
export interface CmsQueryOptions {
  /** Number of items per page */
  limit?: number;
  /** Number of items to skip */
  skip?: number;
  /** Whether to return the total count of items */
  returnTotalCount?: boolean;
}

/**
 * Converts platform Filter object into a WixDataFilter by chaining Wix Data SDK filter methods.
 * All filter conditions are chained on a single filter object (implicit AND logic).
 *
 * @param filter - Filter object with field paths and values/operators
 * @returns WixDataFilter object with all conditions chained
 *
 * @example
 * // Simple equality filters (AND between fields)
 * {
 *   "status": "published",
 *   "category": "tech"
 * }
 * // Result: status="published" AND category="tech"
 *
 * @example
 * // Range filters with comparison operators
 * {
 *   "price": { "$gte": 10, "$lte": 100 },
 *   "stock": { "$gt": 0 }
 * }
 * // Result: price>=10 AND price<=100 AND stock>0
 *
 * @example
 * // Array operators (OR within a field)
 * {
 *   "tags": { "$hasSome": ["javascript", "react"] },
 *   "categories": { "$hasAll": ["frontend", "tutorial"] }
 * }
 * // Result: (tags contains "javascript" OR "react") AND (categories contains both "frontend" AND "tutorial")
 *
 * @example
 * // String operators
 * {
 *   "title": { "$contains": "headless" },
 *   "slug": { "$startsWith": "blog-" },
 *   "email": { "$endsWith": "@example.com" }
 * }
 * // Result: title contains "headless" AND slug starts with "blog-" AND email ends with "@example.com"
 *
 * @example
 * // Existence operators
 * {
 *   "description": { "$isNotEmpty": true },
 *   "deletedAt": { "$isEmpty": true }
 * }
 * // Result: description has a value AND deletedAt is empty
 *
 * @example
 * // Mixed operators (real-world example: blue or red shirts in stock, priced $20-50)
 * {
 *   "category": "shirts",
 *   "color": { "$hasSome": ["blue", "red"] },
 *   "price": { "$gte": 20, "$lte": 50 },
 *   "inStock": { "$gt": 0 }
 * }
 * // Result: category="shirts" AND (color="blue" OR color="red") AND price>=20 AND price<=50 AND inStock>0

 * @example
 * ```ts
 * const colorFilter = buildWixDataFilter({ color: { $hasSome: ['yellow', 'red'] } });
 * const modelFilter = buildWixDataFilter({ model: { $eq: 'Toyota' } });
 * const combinedFilter = colorFilter.and(modelFilter);
 * const query = items.query('Cars').filter(combinedFilter);
 * ```
 */
function buildWixDataFilter(filter: Filter): items.WixDataFilter {
  // Ensure filter is not null before processing
  if (!filter) {
    return items.filter();
  }

  // Start with a single filter object and chain all conditions
  let wixFilter: items.WixDataFilter = items.filter();

  for (const [fieldId, value] of Object.entries(filter)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle operators - chain all operators for the field
      for (const [operator, operandValue] of Object.entries(value)) {
        if (operandValue === null || operandValue === undefined) {
          continue;
        }

        switch (operator) {
          case '$eq':
            wixFilter = wixFilter.eq(fieldId, operandValue as any);
            break;
          case '$ne':
            wixFilter = wixFilter.ne(fieldId, operandValue as any);
            break;
          case '$gt':
            wixFilter = wixFilter.gt(fieldId, operandValue as any);
            break;
          case '$gte':
            wixFilter = wixFilter.ge(fieldId, operandValue as any);
            break;
          case '$lt':
            wixFilter = wixFilter.lt(fieldId, operandValue as any);
            break;
          case '$lte':
            wixFilter = wixFilter.le(fieldId, operandValue as any);
            break;
          case '$hasSome':
            if (Array.isArray(operandValue) && operandValue.length > 0) {
              wixFilter = wixFilter.hasSome(fieldId, operandValue as any);
            }
            break;
          case '$hasAll':
            if (Array.isArray(operandValue) && operandValue.length > 0) {
              wixFilter = wixFilter.hasAll(fieldId, operandValue as any);
            }
            break;
          case '$startsWith':
            wixFilter = wixFilter.startsWith(fieldId, operandValue as string);
            break;
          case '$endsWith':
            wixFilter = wixFilter.endsWith(fieldId, operandValue as string);
            break;
          case '$contains':
            wixFilter = wixFilter.contains(fieldId, operandValue as string);
            break;
          case '$isEmpty':
            wixFilter = wixFilter.isEmpty(fieldId);
            break;
          case '$isNotEmpty':
            wixFilter = wixFilter.isNotEmpty(fieldId);
            break;
          case '$between':
            if (
              Array.isArray(operandValue) &&
              operandValue.length === 2 &&
              operandValue[0] !== null &&
              operandValue[1] !== null
            ) {
              wixFilter = wixFilter.between(
                fieldId,
                operandValue[0] as any,
                operandValue[1] as any,
              );
            }
            break;
          // Skip unsupported operators
          default:
            break;
        }
      }
    } else {
      // Direct value means equality
      wixFilter = wixFilter.eq(fieldId, value);
    }
  }

  return wixFilter;
}

/**
 * Shared function to load collection items from Wix Data with pagination support.
 * Returns a WixDataQueryResult that contains items, pagination info, and navigation methods.
 * Uses Wix Data SDK's filter() and and() methods to combine default and user filters.
 */
const loadCollectionItems = async (
  collectionId: string,
  options: CmsQueryOptions = {},
  sort?: SortValue,
  userFilter?: Filter | null,
  defaultFilter?: Filter | null,
  singleRefFieldIds: string[] = [],
  multiRefFieldIds: string[] = [],
) => {
  if (!collectionId) {
    throw new Error('No collection ID provided');
  }

  const { limit, skip = 0, returnTotalCount = false } = options;

  let query = items.query(collectionId);

  // Build WixDataFilter objects and combine using Wix Data SDK's and() method
  const hasDefaultFilter =
    defaultFilter && Object.keys(defaultFilter).length > 0;
  const hasUserFilter = userFilter && Object.keys(userFilter).length > 0;

  if (hasDefaultFilter && hasUserFilter) {
    // Both filters present - combine with and() method
    const defaultWixFilter = buildWixDataFilter(defaultFilter);
    const userWixFilter = buildWixDataFilter(userFilter);
    // Use and() to combine the two filters
    query = query.and(defaultWixFilter).and(userWixFilter);
  } else if (hasDefaultFilter) {
    // Only default filter - apply directly
    query = query.and(buildWixDataFilter(defaultFilter));
  } else if (hasUserFilter) {
    // Only user filter - apply directly
    query = query.and(buildWixDataFilter(userFilter));
  }

  if (sort && sort.length > 0 && sort[0]) {
    const { fieldName, order } = sort[0];
    if (fieldName) {
      if (order === 'DESC') {
        query = query.descending(fieldName);
      } else {
        // Default to ascending if order not specified or is 'ASC'
        query = query.ascending(fieldName);
      }
    }
  }

  if (limit) {
    query = query.limit(limit);
  }

  query = query.skip(skip);

  // Include reference fields if specified
  const allRefFieldIds = [...singleRefFieldIds, ...multiRefFieldIds];
  if (allRefFieldIds.length > 0) {
    query = query.include(...allRefFieldIds);
  }

  return await query.find({ returnTotalCount });
};

/**
 * Configuration interface required to initialize the CmsCollectionService.
 */
export interface CmsCollectionServiceConfig {
  /** The collection ID to load items from */
  collectionId: string;
  /** Optional initial query result to initialize the service with.
   * If provided, items and pagination info will be extracted from this result.
   * If not provided, service will load initial data automatically. */
  queryResult?: WixDataQueryResult;
  queryOptions?: CmsQueryOptions;
  /** Optional initial sort value */
  initialSort?: SortValue;
  /** Optional initial filter value */
  initialFilter?: Filter | null;
  /** Default filters that are always applied (set by site owner).
   * These filters are combined with user-applied filters using AND logic. */
  defaultFilter?: Filter | null;
  /** List of field IDs for single reference fields to include */
  singleRefFieldIds?: string[];
  /** List of field IDs for multi reference fields to include */
  multiRefFieldIds?: string[];
}

/**
 * Implementation of the CMS Collection service that manages reactive collection data.
 */
export const CmsCollectionServiceImplementation =
  implementService.withConfig<CmsCollectionServiceConfig>()(
    CmsCollectionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      // Initialize query result signal
      const queryResultSignal =
        signalsService.signal<WixDataQueryResult | null>(
          config.queryResult || null,
        );

      // Initialize sort signal
      const sortSignal = signalsService.signal<SortValue>(
        config.initialSort || [],
      );

      // Initialize filter signal
      const filterSignal = signalsService.signal<Filter | null>(
        config.initialFilter || null,
      );

      const loadItems = async (options: CmsQueryOptions = {}) => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          // Merge passed options with config defaults
          const mergedOptions = { ...config.queryOptions, ...options };
          const result = await loadCollectionItems(
            config.collectionId,
            mergedOptions,
            sortSignal.get(),
            filterSignal.get(),
            config.defaultFilter,
            config.singleRefFieldIds,
            config.multiRefFieldIds,
          );

          queryResultSignal.set(result);
        } catch (err) {
          errorSignal.set(
            extractErrorMessage(err, 'Failed to load collection items'),
          );
          console.error(
            `Failed to load items from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      const invalidate = async () => {
        // Preserve current pagination state when invalidating
        const currentResult = queryResultSignal.get();
        const currentSkip =
          (currentResult?.currentPage || 0) * (currentResult?.pageSize || 10);
        const currentLimit = currentResult?.pageSize;

        await loadItems({
          skip: currentSkip,
          limit: currentLimit,
        });
      };

      const createItem = async (
        itemData: Partial<WixDataItem>,
      ): Promise<WixDataItem> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const createdItem = await items.insert(config.collectionId, itemData);

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();

          return createdItem;
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to create item'));
          console.error(
            `Failed to create item in collection "${config.collectionId}":`,
            err,
          );
          throw err; // Re-throw for component error handling
        } finally {
          loadingSignal.set(false);
        }
      };

      const linkItem = async (params: LinkItemParams): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          await items.insertReference(
            config.collectionId,
            params.referenceFieldId,
            params.itemId,
            params.referencedItemIds,
          );

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to link item'));
          console.error(
            `Failed to link item in collection "${config.collectionId}":`,
            err,
          );
          throw err; // Re-throw for component error handling
        } finally {
          loadingSignal.set(false);
        }
      };

      const updateItem = async (
        itemId: string,
        itemData: Partial<WixDataItem>,
      ): Promise<WixDataItem> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const updatedItem = await items.update(config.collectionId, {
            ...itemData,
            _id: itemId,
          });

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();

          return updatedItem;
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to update item'));
          console.error(
            `Failed to update item in collection "${config.collectionId}":`,
            err,
          );
          throw err; // Re-throw for component error handling
        } finally {
          loadingSignal.set(false);
        }
      };

      const deleteItem = async (itemId: string): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          await items.remove(config.collectionId, itemId);

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to delete item'));
          console.error(
            `Failed to delete item in collection "${config.collectionId}":`,
            err,
          );
          throw err; // Re-throw for component error handling
        } finally {
          loadingSignal.set(false);
        }
      };

      const unlinkItem = async (
        params: LinkItemParams,
      ): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          await items.removeReference(
            config.collectionId,
            params.referenceFieldId,
            params.itemId,
            params.referencedItemIds,
          );

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to unlink item'));
          console.error(
            `Failed to unlink item in collection "${config.collectionId}":`,
            err,
          );
          throw err; // Re-throw for component error handling
        } finally {
          loadingSignal.set(false);
        }
      };

      const setSort = (sort: SortValue) => {
        sortSignal.set(sort);
        // Reload items with new sort, preserving pagination
        loadItems();
      };

      const setFilter = (filter: Filter) => {
        filterSignal.set(filter);
        // Reload items with new filter, reset to first page
        loadItems({ skip: 0 });
      };

      const resetFilter = () => {
        filterSignal.set(null);
        // Reload items without filter, reset to first page
        loadItems({ skip: 0 });
      };

      const isFiltered = (): boolean => {
        const filter = filterSignal.get();
        return filter !== null && Object.keys(filter).length > 0;
      };

      // Auto-load items on service initialization only if not pre-loaded
      if (!config.queryResult) {
        loadItems();
      }

      return {
        loadingSignal,
        errorSignal,
        queryResultSignal,
        sortSignal,
        filterSignal,
        loadItems,
        invalidate,
        createItem,
        linkItem,
        updateItem,
        deleteItem,
        unlinkItem,
        setSort,
        setFilter,
        resetFilter,
        isFiltered,
        collectionId: config.collectionId,
      };
    },
  );

/**
 * Result type for loading CMS collection service configuration.
 */
export type CmsCollectionServiceConfigResult = {
  [CmsCollectionServiceDefinition]: CmsCollectionServiceConfig;
};

/**
 * Loads initial data for the CMS Collection service with pagination support.
 *
 * @param collectionId - The collection ID to load data from
 * @param options - Query options for pagination and filtering
 * @param sort - Optional sort value
 * @param filter - Optional filter value
 * @param defaultFilter - Optional default filter that's always applied
 * @param singleRefFieldIds - List of field IDs for single reference fields to include
 * @param multiRefFieldIds - List of field IDs for multi reference fields to include
 * @returns Promise resolving to service configuration with queryResult containing all data
 *
 * @example
 * ```tsx
 * // In Astro frontmatter or server action
 * const cmsConfig = await loadCmsCollectionServiceInitialData(
 *   'MyCollection',
 *   { limit: 10, skip: 0 },
 *   undefined,
 *   { status: { $eq: 'published' } },
 *   { color: { $hasSome: ['yellow', 'red'] } },
 *   ['author', 'category'],
 *   ['tags', 'relatedItems']
 * );
 *
 * // Pass to React component
 * <MyPage cmsConfig={cmsConfig} />
 * ```
 */
export const loadCmsCollectionServiceInitialData = async (
  collectionId: string,
  options: CmsQueryOptions = {},
  sort?: SortValue,
  filter?: Filter | null,
  defaultFilter?: Filter | null,
  singleRefFieldIds?: string[],
  multiRefFieldIds?: string[],
): Promise<CmsCollectionServiceConfigResult> => {
  try {
    if (!collectionId) {
      throw new Error('No collection ID provided');
    }

    // Load collection items on the server using shared function
    const result = await loadCollectionItems(
      collectionId,
      options,
      sort,
      filter,
      defaultFilter,
      singleRefFieldIds,
      multiRefFieldIds,
    );

    return {
      [CmsCollectionServiceDefinition]: {
        collectionId,
        queryResult: result,
        queryOptions: options,
        initialSort: sort,
        initialFilter: filter,
        defaultFilter,
        singleRefFieldIds,
        multiRefFieldIds,
      },
    };
  } catch (error) {
    console.error(
      `Failed to load collection config for "${collectionId}":`,
      error,
    );
    throw error; // Re-throw to let caller handle 404 logic
  }
};

/**
 * Service binding helper that bundles everything together for the service manager.
 */
export const cmsCollectionServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadCmsCollectionServiceInitialData>
    >[typeof CmsCollectionServiceDefinition];
  },
>(
  servicesConfigs: T,
) => {
  return [
    CmsCollectionServiceDefinition,
    CmsCollectionServiceImplementation,
    servicesConfigs[CmsCollectionServiceDefinition],
  ] as const;
};
