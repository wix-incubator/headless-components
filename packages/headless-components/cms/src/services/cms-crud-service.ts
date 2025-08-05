import { defineService, implementService } from "@wix/services-definitions";
import {SignalsServiceDefinition, type Signal} from "@wix/services-definitions/core-services/signals";
import * as items from '@wix/wix-data-items-sdk';

export type WixDataItem = items.WixDataItem;

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

    const loadingSignal = signalsService.signal(false) as Signal<boolean>;
    const errorSignal = signalsService.signal<string | null>(null) as Signal<string | null>;
    const itemsSignal = signalsService.signal<WixDataItem[]>([]) as Signal<WixDataItem[]>;
    const itemSignal = signalsService.signal<WixDataItem | null>(null) as Signal<WixDataItem | null>;
    const currentCollectionSignal = signalsService.signal<string>(config.collectionId) as Signal<string>;

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

    const getAllItems = async <T extends WixDataItem>(collectionId: string): Promise<void> => {
      await withErrorHandling(async () => {
        const result = await items.query(collectionId).find();
        itemsSignal.set(result.items as T[]);
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

    return {
      create: createItem,
      getAll: getAllItems,
      getById: getItemById,
      update: updateItem,
      delete: deleteItem,
      setCollection: setCollectionId,
      loadingSignal,
      errorSignal,
      itemsSignal,
      itemSignal,
      currentCollectionSignal,
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
