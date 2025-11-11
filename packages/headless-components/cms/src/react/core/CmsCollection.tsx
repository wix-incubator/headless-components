import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import {
  CmsCollectionServiceDefinition,
  CmsCollectionServiceConfig,
  CmsCollectionServiceImplementation,
  type WixDataItem,
  type WixDataQueryResult,
  type InsertReferenceParams,
} from '../../services/cms-collection-service.js';
import { createServicesMap } from '@wix/services-manager';
import type {
  SortValue,
  FilterValue as Filter,
} from '@wix/headless-components/react';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
  collectionServiceConfig: CmsCollectionServiceConfig;
}

/**
 * Render props exposed by CmsCollection.Root
 */
export interface RootRenderProps {
  /** Boolean indicating if items are currently being loaded */
  loading: boolean;
  /** Error message, or null if no error */
  error: string | null;
  /** Current query result with pagination data */
  queryResult: WixDataQueryResult | null;
  /** Current sort value */
  sort: SortValue;
  /** Current filter value */
  filter: Filter | null;
  /** Function to explicitly invalidate and reload items */
  invalidate: () => Promise<void>;
  /** Function to load items with optional query options */
  loadItems: (options?: {
    limit?: number;
    skip?: number;
    returnTotalCount?: boolean;
  }) => Promise<void>;
  /** Function to create a new item in the collection */
  createItem: (itemData: Partial<WixDataItem>) => Promise<WixDataItem>;
  /** Function to insert a reference between items */
  linkItem: (params: InsertReferenceParams) => Promise<void>;
  /** Function to update an existing item in the collection */
  updateItem: (
    itemId: string,
    itemData: Partial<WixDataItem>,
  ) => Promise<WixDataItem>;
  /** Function to delete an item from the collection */
  deleteItem: (itemId: string) => Promise<void>;
  /** Function to remove a reference between items */
  unlinkItem: (params: InsertReferenceParams) => Promise<void>;
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
}

/**
 * Core Root component that provides CMS Collection functionality via render props.
 * This component sets up the necessary services and exposes all collection operations
 * and state through a render prop function.
 *
 * @example
 * ```tsx
 * <CmsCollection.Root collectionServiceConfig={{ collectionId: 'MyCollection' }}>
 *   {({ queryResult, loading, createItem, updateItem }) => (
 *     <div>
 *       {loading ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <>
 *           {queryResult?.items.map(item => (
 *             <div key={item._id}>{item.title}</div>
 *           ))}
 *           <button onClick={() => createItem({ title: 'New Item' })}>
 *             Create Item
 *           </button>
 *         </>
 *       )}
 *     </div>
 *   )}
 * </CmsCollection.Root>
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CmsCollectionServiceDefinition,
        CmsCollectionServiceImplementation,
        props.collectionServiceConfig,
      )}
    >
      <RootContent>{props.children}</RootContent>
    </WixServices>
  );
}

/**
 * Internal component that accesses the service and passes render props
 */
function RootContent(props: {
  children: (props: RootRenderProps) => React.ReactNode;
}): React.ReactNode {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  return props.children({
    loading: service.loadingSignal.get(),
    error: service.errorSignal.get(),
    queryResult: service.queryResultSignal.get(),
    sort: service.sortSignal.get(),
    filter: service.filterSignal.get(),
    invalidate: service.invalidate,
    loadItems: service.loadItems,
    createItem: service.createItem,
    linkItem: service.linkItem,
    updateItem: service.updateItem,
    deleteItem: service.deleteItem,
    unlinkItem: service.unlinkItem,
    setSort: service.setSort,
    setFilter: service.setFilter,
    resetFilter: service.resetFilter,
    isFiltered: service.isFiltered,
    collectionId: service.collectionId,
  });
}
