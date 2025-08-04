import { defineService, implementService } from "@wix/services-definitions";
import {SignalsServiceDefinition, type Signal} from "@wix/services-definitions/core-services/signals";
import * as items from '@wix/wix-data-items-sdk';

export type WixDataItem = items.WixDataItem;

/**
 * Type definition for CMS query parameters
 */
export interface CmsQuery {
  /** Filter conditions for the query */
  filter?: Record<string, any>;
  /** Sort options for the query */
  sort?: Array<{ fieldName: string; direction: 'ASC' | 'DESC' }>;
  /** Pagination options */
  paging?: {
    /** Number of items to skip */
    offset?: number;
    /** Maximum number of items to return */
    limit?: number;
  };
}

/**
 * Configuration interface for the CMS CRUD service.
 * Contains the collection ID needed to initialize the CMS CRUD functionality.
 *
 * @interface CmsCrudServiceConfig
 */
export interface CmsCrudServiceConfig {
  /** The collection ID to perform CRUD operations on */
  collectionId: string;
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

    // Initialize signals
    const loadingSignal = signalsService.signal(false) as Signal<boolean>;
    const errorSignal = signalsService.signal<string | null>(null) as Signal<string | null>;
    const itemsSignal = signalsService.signal<WixDataItem[]>([]) as Signal<WixDataItem[]>;
    const itemSignal = signalsService.signal<WixDataItem | null>(null) as Signal<WixDataItem | null>;
    const currentCollectionSignal = signalsService.signal<string>(config.collectionId) as Signal<string>;


    return {
      create: async <T extends WixDataItem>(collectionId: string, itemData: T): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const result = await items.insert(collectionId, itemData);

          // Update the items list with the new item
          const currentItems = itemsSignal.get();
          itemsSignal.set([...currentItems, result]);

          // Set the current item to the newly created item
          itemSignal.set(result);
        } catch (error) {
          errorSignal.set(error instanceof Error ? error.message : `Failed to create ${collectionId}`);
        } finally {
          loadingSignal.set(false);
        }
      },

      getAll: async <T extends WixDataItem>(collectionId: string): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const result = await items.query(collectionId).find();
          itemsSignal.set(result.items as T[]);
        } catch (error) {
          errorSignal.set(error instanceof Error ? error.message : `Failed to fetch ${collectionId}s`);
        } finally {
          loadingSignal.set(false);
        }
      },

      getById: async <T extends WixDataItem>(collectionId: string, itemId: string): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const result = await items.query(collectionId)
            .eq("_id", itemId)
            .find();

          if (result.items.length > 0) {
            itemSignal.set(result.items[0] as T);
          } else {
            itemSignal.set(null);
          }
        } catch (error) {
          errorSignal.set(error instanceof Error ? error.message : `Failed to fetch ${collectionId} by ID`);
        } finally {
          loadingSignal.set(false);
        }
      },

      update: async <T extends WixDataItem>(collectionId: string, itemData: T & { _id: string }): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          if (!itemData._id) {
            throw new Error(`${collectionId} ID is required for update`);
          }

          const result = await items.update(collectionId, itemData);

          // Update the item in the items list
          const currentItems = itemsSignal.get();
          const updatedItems = currentItems.map(i => i._id === itemData._id ? result : i);
          itemsSignal.set(updatedItems);

          // Update the current item if it's the one being edited
          const currentItem = itemSignal.get();
          if (currentItem && currentItem._id === itemData._id) {
            itemSignal.set(result);
          }
        } catch (error) {
          errorSignal.set(error instanceof Error ? error.message : `Failed to update ${collectionId}`);
        } finally {
          loadingSignal.set(false);
        }
      },

      delete: async (collectionId: string, itemId: string): Promise<void> => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          if (!itemId) {
            throw new Error(`${collectionId} ID is required for deletion`);
          }

          await items.remove(collectionId, itemId);

          // Remove the item from the items list
          const currentItems = itemsSignal.get();
          const updatedItems = currentItems.filter(item => item._id !== itemId);
          itemsSignal.set(updatedItems);

          // Clear the current item if it's the one being deleted
          const currentItem = itemSignal.get();
          if (currentItem && currentItem._id === itemId) {
            itemSignal.set(null);
          }
        } catch (error) {
          errorSignal.set(error instanceof Error ? error.message : `Failed to delete ${collectionId}`);
        } finally {
          loadingSignal.set(false);
        }
      },

      setCollection: (collectionId: string): void => {
        if (!collectionId) {
          throw new Error('Collection ID is required');
        }
        currentCollectionSignal.set(collectionId);
      },

      loadingSignal,
      errorSignal,
      itemsSignal,
      itemSignal,
      currentCollectionSignal,
    };
  }
);

/**
 * Loads CMS CRUD service initial data for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
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
 * <CmsCrud.CmsCrud cmsConfig={cmsData.CmsCrud}>
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
 * </CmsCrud.CmsCrud>
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
  },
>(
  servicesConfigs: T,
) => {
  return [
    CmsCrudServiceDefinition,
    CmsCrudServiceImplementation,
    servicesConfigs[CmsCrudServiceDefinition] as CmsCrudServiceConfig,
  ] as const;
};
