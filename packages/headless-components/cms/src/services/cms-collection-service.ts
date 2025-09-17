import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';

export type WixDataItem = items.WixDataItem;
export type WixDataQueryResult = items.WixDataResult;

/**
 * Service definition for the CMS Collection service.
 */
export const CmsCollectionServiceDefinition = defineService<{
  /** Reactive signal containing the collection items */
  itemsSignal: Signal<WixDataItem[]>;
  /** Reactive signal indicating if items are currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Reactive signal containing the current query result with pagination data */
  queryResultSignal: Signal<WixDataQueryResult | null>;
  /** Function to load the next page of items */
  loadNextPage: () => Promise<void>;
  /** Function to load the previous page of items */
  loadPrevPage: () => Promise<void>;
}>('cms-collection');

/**
 * Interface for initial query options
 */
export interface CmsQueryOptions {
  /** Number of items per page */
  limit?: number;
  /** Number of items to skip */
  skip?: number;
}

/**
 * Shared function to load collection items from Wix Data with pagination support.
 * Returns a WixDataQueryResult that contains items, pagination info, and navigation methods.
 */
const loadCollectionItems = async (
  collectionId: string,
  options: CmsQueryOptions = {},
) => {
  if (!collectionId) {
    throw new Error('No collection ID provided');
  }

  const { limit = 2, skip = 0 } = options;

  let query = items.query(collectionId);

  if (limit) {
  query = query.limit(limit);
  }

  query = query.skip(skip);

  return await query.find();
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
}

/**
 * Implementation of the CMS Collection service that manages reactive collection data.
 */
export const CmsCollectionServiceImplementation =
  implementService.withConfig<CmsCollectionServiceConfig>()(
    CmsCollectionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      // Initialize with pre-loaded query result if provided
      const itemsSignal = signalsService.signal<WixDataItem[]>(
        config.queryResult?.items || [],
      );
      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      // Initialize query result signal
      const queryResultSignal = signalsService.signal<WixDataQueryResult | null>(
        config.queryResult || null,
      );

      // Track current query result for cursor-based pagination
      let currentQueryResult: WixDataQueryResult | null = config.queryResult || null;

      const loadInitialItems = async (options: CmsQueryOptions = {}) => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const result = await loadCollectionItems(
            config.collectionId,
            options,
          );

          currentQueryResult = result;
          queryResultSignal.set(result);
          itemsSignal.set(result.items);

        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to load collection items';
          errorSignal.set(errorMessage);
          console.error(
            `Failed to load items from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
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
          currentQueryResult = nextResult;
          queryResultSignal.set(nextResult);
          itemsSignal.set(nextResult.items);

        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to load next page';
          errorSignal.set(errorMessage);
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
          currentQueryResult = prevResult;
          queryResultSignal.set(prevResult);
          itemsSignal.set(prevResult.items);

        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to load previous page';
          errorSignal.set(errorMessage);
          console.error(
            `Failed to load previous page from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      // Auto-load items on service initialization only if not pre-loaded
      if (!config.queryResult) {
        loadInitialItems();
      }

      return {
        loadItems: loadInitialItems,
        itemsSignal,
        loadingSignal,
        errorSignal,
        queryResultSignal,
        loadNextPage,
        loadPrevPage,
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
): Promise<CmsCollectionServiceConfigResult> => {
  try {
    if (!collectionId) {
      throw new Error('No collection ID provided');
    }

    // Load collection items on the server using shared function
    const result = await loadCollectionItems(collectionId, options);

    return {
      [CmsCollectionServiceDefinition]: {
        collectionId,
        queryResult: result,
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
