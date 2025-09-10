import { defineService, implementService, type ServiceFactoryConfig } from '@wix/services-definitions';
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
 * Configuration interface required to initialize the CmsCollectionService.
 */
export interface CmsCollectionServiceConfig {
  /** The collection ID to load items from */
  collectionId: string;
}

/**
 * Implementation of the CMS Collection service that manages reactive collection data.
 */
export const CmsCollectionServiceImplementation =
  implementService.withConfig<CmsCollectionServiceConfig>()(
    CmsCollectionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const itemsSignal = signalsService.signal<WixDataItem[]>([]);
      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      const loadItems = async () => {
        if (!config.collectionId) {
          errorSignal.set('No collection ID provided');
          return;
        }

        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const result = await items.query(config.collectionId).find();
          itemsSignal.set(result.items);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load collection items';
          errorSignal.set(errorMessage);
          console.error(`Failed to load items from collection "${config.collectionId}":`, err);
        } finally {
          loadingSignal.set(false);
        }
      };

      // Auto-load items on service initialization
      loadItems();

      return {
        itemsSignal,
        loadingSignal,
        errorSignal,
      };
    },
  );

/**
 * Result type for loading CMS collection service configuration.
 */
export type CmsCollectionServiceConfigResult =
  | { type: 'success'; config: CmsCollectionServiceConfig }
  | { type: 'notFound' };

/**
 * Loads initial data for the CMS Collection service.
 */
export const loadCmsCollectionServiceInitialData = async (
  collectionId: string,
): Promise<CmsCollectionServiceConfigResult> => {
  try {
    if (!collectionId) {
      return { type: 'notFound' };
    }

    // Return config object keyed by service definition (following README pattern)
    return {
      type: 'success',
      config: { collectionId },
    };
  } catch (error) {
    console.error(`Failed to load collection config for "${collectionId}":`, error);
    return { type: 'notFound' };
  }
};

/**
 * Service binding helper that bundles everything together for the service manager.
 * Function name follows pattern: [serviceName]ServiceBinding
 */
export const cmsCollectionServiceBinding = <
  T extends {
    [key: string]: CmsCollectionServiceConfig;
  }
>(
  servicesConfigs: T
) => {
  return [
    CmsCollectionServiceDefinition,
    CmsCollectionServiceImplementation,
    servicesConfigs[CmsCollectionServiceDefinition] as ServiceFactoryConfig<
      typeof CmsCollectionServiceImplementation
    >,
  ] as const;
};
