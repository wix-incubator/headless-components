import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';
import { type WixDataItem } from './cms-collection-service.js';

/**
 * Service definition for the CMS Item service.
 */
export const CmsItemServiceDefinition = defineService<{
  /** Reactive signal containing the individual item */
  itemSignal: Signal<WixDataItem>;
  /** Reactive signal indicating if the item is currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
}>('CmsItem');

/**
 * Shared function to load a single item from Wix Data
 */
const loadItem = async (
  collectionId: string,
  itemId: string,
): Promise<WixDataItem> => {
  if (!collectionId) {
    throw new Error('No collection ID provided');
  }

  if (!itemId) {
    throw new Error('No item ID provided');
  }

  const result = await items.get(collectionId, itemId);

  if (!result) {
    throw new Error('Item not found');
  }

  return result;
};

/**
 * Configuration interface required to initialize the CmsItemService.
 */
export interface CmsItemServiceConfig {
  /** The collection ID to load the item from */
  collectionId: string;
  /** The item ID to load */
  itemId: string;
  /** Optional pre-loaded item to initialize the service with */
  item?: WixDataItem;
}

/**
 * Implementation of the CMS Item service that manages reactive item data.
 */
export const CmsItemServiceImplementation =
  implementService.withConfig<CmsItemServiceConfig>()(
    CmsItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      // Initialize with pre-loaded item if provided, otherwise with empty object
      const itemSignal: Signal<WixDataItem> = signalsService.signal<WixDataItem>(
        config.item || ({ _id: '' } as WixDataItem),
      );
      const loadingSignal: Signal<boolean> = signalsService.signal<boolean>(false);
      const errorSignal: Signal<string | null> = signalsService.signal<string | null>(null);

      const loadItemData = async () => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const item = await loadItem(
            config.collectionId,
            config.itemId,
          );
          itemSignal.set(item);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : 'Failed to load item';
          errorSignal.set(errorMessage);
          console.error(
            `Failed to load item "${config.itemId}" from collection "${config.collectionId}":`,
            err,
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      // Auto-load item on service initialization only if not pre-loaded
      if (!config.item) {
        loadItemData();
      }

      return {
        loadItem: loadItemData,
        itemSignal,
        loadingSignal,
        errorSignal,
      };
    },
  );

/**
 * Result type for loading CMS item service configuration.
 */
export type CmsItemServiceConfigResult = {
  [CmsItemServiceDefinition]: CmsItemServiceConfig;
};

/**
 * Loads initial data for the CMS Item service.
 */
export const loadCmsItemServiceInitialData = async (
  collectionId: string,
  itemId: string,
): Promise<CmsItemServiceConfigResult> => {
  try {
    if (!collectionId) {
      throw new Error('No collection ID provided');
    }

    if (!itemId) {
      throw new Error('No item ID provided');
    }

    // Load item on the server using shared function
    const item = await loadItem(collectionId, itemId);

    return {
      [CmsItemServiceDefinition]: {
        collectionId,
        itemId,
        item,
      },
    };
  } catch (error) {
    console.error(
      `Failed to load item config for "${itemId}" from collection "${collectionId}":`,
      error,
    );
    throw error; // Re-throw to let caller handle 404 logic
  }
};

/**
 * Service binding helper that bundles everything together for the service manager.
 */
export const cmsItemServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadCmsItemServiceInitialData>
    >[typeof CmsItemServiceDefinition];
  },
>(
  servicesConfigs: T,
) => {
  return [
    CmsItemServiceDefinition,
    CmsItemServiceImplementation,
    servicesConfigs[CmsItemServiceDefinition],
  ] as const;
};
