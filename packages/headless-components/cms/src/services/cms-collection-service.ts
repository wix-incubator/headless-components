import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';
import type { SortValue } from '@wix/headless-components/react';

export type WixDataItem = items.WixDataItem;
export type WixDataQueryResult = items.WixDataResult;

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
  /** Function to load the next page of items */
  loadNextPage: () => Promise<void>;
  /** Function to load the previous page of items */
  loadPrevPage: () => Promise<void>;
  /** Function to explicitly invalidate and reload items */
  invalidate: () => Promise<void>;
  /** Function to load items with optional query options */
  loadItems: (options?: CmsQueryOptions) => Promise<void>;
  /** Function to create a new item in the collection */
  createItem: (itemData: Partial<WixDataItem>) => Promise<void>;
  /** Function to update the sort value */
  setSort: (sort: SortValue) => void;
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
  /** List of field IDs for single reference fields to include */
  singleRefFieldIds?: string[];
  /** List of field IDs for multi reference fields to include */
  multiRefFieldIds?: string[];
}

/**
 * Shared function to load collection items from Wix Data with pagination support.
 * Returns a WixDataQueryResult that contains items, pagination info, and navigation methods.
 */
const loadCollectionItems = async (
  collectionId: string,
  options: CmsQueryOptions = {},
  sort?: SortValue,
) => {
  if (!collectionId) {
    throw new Error('No collection ID provided');
  }

  const {
    limit,
    skip = 0,
    returnTotalCount = false,
    singleRefFieldIds = [],
    multiRefFieldIds = [],
  } = options;

  let query = items.query(collectionId);

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

      // Track current query result for cursor-based pagination
      let currentQueryResult: WixDataQueryResult | null =
        queryResultSignal.get();

      // Use effect to maintain currentQueryResult consistency with queryResultSignal
      signalsService.effect(() => {
        currentQueryResult = queryResultSignal.get();
      });

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

      const loadNextPage = async () => {
        if (!currentQueryResult) {
          return;
        }

        const hasNext = currentQueryResult.hasNext();

        if (!hasNext) {
          return;
        }

        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          // Use the SDK's next() function
          const nextResult = await currentQueryResult.next();
          queryResultSignal.set(nextResult);
        } catch (err) {
          errorSignal.set(extractErrorMessage(err, 'Failed to load next page'));
          console.error(
            `Failed to load next page from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      const loadPrevPage = async () => {
        if (!currentQueryResult) {
          return;
        }

        const hasPrev = currentQueryResult.hasPrev();

        if (!hasPrev) {
          return;
        }

        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          // Use the SDK's prev() function
          const prevResult = await currentQueryResult.prev();
          queryResultSignal.set(prevResult);
        } catch (err) {
          errorSignal.set(
            extractErrorMessage(err, 'Failed to load previous page'),
          );
          console.error(
            `Failed to load previous page from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      const createItem = async (itemData: Partial<WixDataItem>) => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          await items.insert(config.collectionId, itemData);

          // Invalidate + refetch to maintain consistency with backend query logic
          await invalidate();
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

      const setSort = (sort: SortValue) => {
        sortSignal.set(sort);
        // Reload items with new sort, preserving pagination
        loadItems();
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
        loadItems,
        invalidate,
        loadNextPage,
        loadPrevPage,
        createItem,
        setSort,
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
 * @returns Promise resolving to service configuration with queryResult containing all data
 *
 * @example
 * ```tsx
 * // In Astro frontmatter or server action
 * const cmsConfig = await loadCmsCollectionServiceInitialData('MyCollection', {
 *   limit: 10,
 *   skip: 0
 * });
 *
 * // Pass to React component
 * <MyPage cmsConfig={cmsConfig} />
 * ```
 */
export const loadCmsCollectionServiceInitialData = async (
  collectionId: string,
  options: CmsQueryOptions = {},
  sort?: SortValue,
): Promise<CmsCollectionServiceConfigResult> => {
  try {
    if (!collectionId) {
      throw new Error('No collection ID provided');
    }

    // Load collection items on the server using shared function
    const result = await loadCollectionItems(collectionId, options, sort);

    return {
      [CmsCollectionServiceDefinition]: {
        collectionId,
        queryResult: result,
        queryOptions: options,
        initialSort: sort,
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
