import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';

/**
 * Wix Data item interface with base properties and dynamic fields
 */
export interface WixDataItem {
  /** The item ID */
  _id: string;
  /** The item owner */
  _owner?: string;
  /** Creation date */
  _createdDate?: Date;
  /** Last updated date */
  _updatedDate?: Date;
  /** Additional item fields */
  [key: string]: any;
}

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
}>('CmsCollection');

/**
 * Shared function to load collection items from Wix Data
 */
const loadCollectionItems = async (
  collectionId: string,
): Promise<WixDataItem[]> => {
  if (!collectionId) {
    throw new Error('No collection ID provided');
  }

  const result = await items.query(collectionId).find();
  return result.items;
};

/**
 * Configuration interface required to initialize the CmsCollectionService.
 */
export interface CmsCollectionServiceConfig {
  /** The collection ID to load items from */
  collectionId: string;
  /** Optional pre-loaded collection items to initialize the service with */
  collection?: WixDataItem[];
}

/**
 * Implementation of the CMS Collection service that manages reactive collection data.
 */
export const CmsCollectionServiceImplementation =
  implementService.withConfig<CmsCollectionServiceConfig>()(
    CmsCollectionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      // Initialize with pre-loaded collection if provided
      const itemsSignal = signalsService.signal<WixDataItem[]>(
        config.collection || [],
      );
      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      const loadItems = async () => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const collectionItems = await loadCollectionItems(
            config.collectionId,
          );
          itemsSignal.set(collectionItems);
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

      // Auto-load items on service initialization only if not pre-loaded
      if (!config.collection) {
        loadItems();
      }

      return {
        loadItems,
        itemsSignal,
        loadingSignal,
        errorSignal,
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
 * Loads initial data for the CMS Collection service.
 */
export const loadCmsCollectionServiceInitialData = async (
  collectionId: string,
): Promise<CmsCollectionServiceConfigResult> => {
  try {
    if (!collectionId) {
      throw new Error('No collection ID provided');
    }

    // Load collection items on the server using shared function
    const collection = await loadCollectionItems(collectionId);

    return {
      [CmsCollectionServiceDefinition]: {
        collectionId,
        collection,
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
