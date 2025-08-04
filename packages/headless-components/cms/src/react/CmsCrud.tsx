import React from 'react';
import { useService } from '@wix/services-manager-react';
import {CmsCrudServiceDefinition, WixDataItem} from '../services/cms-crud-service';

/**
 * Props passed to the render function of the CmsCrud component
 */
export type CmsCrudRenderProps = {
  /** Whether any CMS operation is currently loading */
  isLoading: boolean;

  /** The error message if a CMS operation fails, or null if no error */
  error: string | null;

  /** The list of items from the collection */
  items: WixDataItem[];

  /** The currently selected item, or null if none selected */
  item: WixDataItem | null;

  /** The current active collection ID */
  currentCollection: string;

  /**
   * Function to create a new item in the collection
   * @param collectionId - The collection ID to perform the operation on
   * @param itemData - Data for the new item
   */
  create: <T extends WixDataItem>(collectionId: string, itemData: T) => Promise<void>;

  /**
   * Function to retrieve all items from the collection
   * @param collectionId - The collection ID to perform the operation on
   */
  getAll: (collectionId: string) => Promise<void>;

  /**
   * Function to retrieve a single item by ID
   * @param collectionId - The collection ID to perform the operation on
   * @param itemId - ID of the item to retrieve
   */
  getById: (collectionId: string, itemId: string) => Promise<void>;

  /**
   * Function to update an existing item
   * @param collectionId - The collection ID to perform the operation on
   * @param itemData - Updated item data (must include _id)
   */
  update: <T extends WixDataItem>(collectionId: string, itemData: T & { _id: string }) => Promise<void>;

  /**
   * Function to delete an item by ID
   * @param collectionId - The collection ID to perform the operation on
   * @param itemId - ID of the item to delete
   */
  delete: (collectionId: string, itemId: string) => Promise<void>;

  /** Function to set the default collection ID for subsequent operations */
  setCollection: (collectionId: string) => void;
};

/**
 * Props for the CmsCrud component
 */
export type CmsCrudProps = {
  /** Render function that receives CMS CRUD state and actions */
  children: (props: CmsCrudRenderProps) => React.ReactNode;
};

/**
 * A headless component that provides CMS CRUD functionality using the render props pattern.
 *
 * This component manages the state and actions for CRUD operations on a Wix Data collection,
 * allowing consumers to render their own UI while accessing the underlying CMS functionality.
 *
 * @param props - The component props
 * @returns The rendered children with CMS CRUD state and actions
 *
 * @example
 * ```tsx
 * <CmsCrud>
 *   {({
 *     isLoading,
 *     error,
 *     items,
 *     item,
 *     currentCollection,
 *     create,
 *     getAll,
 *     getById,
 *     update,
 *     delete: deleteItem,
 *     setCollection
 *   }) => (
 *     <div className="cms-manager">
 *       <h2>CMS Items</h2>
 *       <p>Current Collection: {currentCollection}</p>
 *
 *       {error && <div className="error" role="alert">{error}</div>}
 *
 *       <div className="collection-selector">
 *         <button onClick={() => setCollection('BlogPosts')}>
 *           Switch to Blog Posts
 *         </button>
 *         <button onClick={() => setCollection('Comments')}>
 *           Switch to Comments
 *         </button>
 *       </div>
 *
 *       <div className="actions">
 *         <button
 *           onClick={() => getAll(currentCollection)}
 *           disabled={isLoading}
 *         >
 *           {isLoading ? 'Loading...' : `Refresh Items`}
 *         </button>
 *
 *         <button
 *           onClick={() => create(currentCollection, {
 *             title: 'New Item',
 *             description: `Created in ${currentCollection}`
 *           })}
 *           disabled={isLoading}
 *         >
 *           {isLoading ? 'Creating...' : 'Create New Item'}
 *         </button>
 *       </div>
 *
 *       <div className="items-list">
 *         {items.length === 0 ? (
 *           <p>No items found in {currentCollection}. Create one to get started.</p>
 *         ) : (
 *           <ul>
 *             {items.map(item => (
 *               <li key={item._id} className="item">
 *                 <div className="item-content">
 *                   <h3>{item.title}</h3>
 *                   <p>{item.description}</p>
 *                 </div>
 *                 <div className="item-actions">
 *                   <button onClick={() => getById(currentCollection, item._id)}>
 *                     View
 *                   </button>
 *                   <button onClick={() => update(currentCollection, {
 *                     ...item,
 *                     title: `${item.title} (Updated)`
 *                   })}>
 *                     Update
 *                   </button>
 *                   <button onClick={() => deleteItem(currentCollection, item._id)}>
 *                     Delete
 *                   </button>
 *                 </div>
 *               </li>
 *             ))}
 *           </ul>
 *         )}
 *       </div>
 *
 *       {item && (
 *         <div className="selected-item">
 *           <h3>Selected Item</h3>
 *           <pre>{JSON.stringify(item, null, 2)}</pre>
 *         </div>
 *       )}
 *     </div>
 *   )}
 * </CmsCrud>
 * ```
 */
export function CmsCrud(props: CmsCrudProps) {
  const {
    loadingSignal,
    errorSignal,
    itemsSignal,
    itemSignal,
    currentCollectionSignal,
    create,
    getAll,
    getById,
    update,
    delete: deleteItem,
    setCollection,
  } = useService(CmsCrudServiceDefinition);

  return props.children({
    isLoading: loadingSignal.get(),
    error: errorSignal.get(),
    items: itemsSignal.get(),
    item: itemSignal.get(),
    currentCollection: currentCollectionSignal.get(),
    create,
    getAll,
    getById,
    update,
    delete: deleteItem,
    setCollection,
  });
}
