import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CmsItemServiceDefinition,
  CmsItemServiceConfig,
  CmsItemServiceImplementation,
  type WixDataItem,
} from '../../services/cms-item-service.js';
import { createServicesMap } from '@wix/services-manager';
import { LinkItemParams } from '../../services/cms-collection-service.js';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
  itemServiceConfig: CmsItemServiceConfig;
}

/**
 * Render props exposed by CmsItem.Root
 */
export interface RootRenderProps {
  /** Current item data */
  item: WixDataItem;
  /** Boolean indicating if the item is currently being loaded */
  loading: boolean;
  /** Error message, or null if no error */
  error: string | null;
  /** Function to update the current item */
  updateItem: (itemData: Partial<WixDataItem>) => Promise<WixDataItem>;
  /** Function to delete the current item */
  deleteItem: () => Promise<void>;
  /** Function to insert a reference between the current item and other items */
  linkItem: (params: LinkItemParams) => Promise<void>;
  /** Function to remove a reference between the current item and other items */
  unlinkItem: (params: LinkItemParams) => Promise<void>;
}

/**
 * Core Root component that provides CMS Item functionality via render props.
 * This component sets up the necessary services and exposes all item operations
 * and state through a render prop function.
 *
 * @example
 * ```tsx
 * <CmsItem.Root itemServiceConfig={{ collectionId: 'MyCollection', itemId: 'item-123' }}>
 *   {({ item, loading, updateItem, deleteItem }) => (
 *     <div>
 *       {loading ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <>
 *           <h1>{item?.title}</h1>
 *           <button onClick={() => updateItem({ title: 'Updated Title' })}>
 *             Update Title
 *           </button>
 *           <button onClick={() => deleteItem()}>
 *             Delete Item
 *           </button>
 *         </>
 *       )}
 *     </div>
 *   )}
 * </CmsItem.Root>
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        CmsItemServiceDefinition,
        CmsItemServiceImplementation,
        props.itemServiceConfig,
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
  const service = useService(CmsItemServiceDefinition) as ServiceAPI<
    typeof CmsItemServiceDefinition
  >;

  return props.children({
    item: service.itemSignal.get(),
    loading: service.loadingSignal.get(),
    error: service.errorSignal.get(),
    updateItem: service.updateItem,
    deleteItem: service.deleteItem,
    linkItem: service.linkItem,
    unlinkItem: service.unlinkItem,
  });
}
