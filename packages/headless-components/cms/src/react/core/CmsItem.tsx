import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import {
  CmsItemServiceDefinition,
  CmsItemServiceConfig,
  CmsItemServiceImplementation,
  type WixDataItem,
  type ItemReferenceParams,
} from '../../services/cms-item-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
  itemServiceConfig: CmsItemServiceConfig;
}

/**
 * Render props exposed by CmsItem.Root
 */
export interface RootRenderProps {
  /** Reactive signal containing the current item data */
  itemSignal: Signal<WixDataItem>;
  /** Reactive signal indicating if the item is currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Function to update the current item */
  updateItem: (itemData: Partial<WixDataItem>) => Promise<WixDataItem>;
  /** Function to delete the current item */
  deleteItem: () => Promise<void>;
  /** Function to insert a reference between the current item and other items */
  linkItem: (params: ItemReferenceParams) => Promise<void>;
  /** Function to remove a reference between the current item and other items */
  unlinkItem: (params: ItemReferenceParams) => Promise<void>;
}

/**
 * Core Root component that provides CMS Item functionality via render props.
 * This component sets up the necessary services and exposes all item operations
 * and state through a render prop function.
 *
 * @example
 * ```tsx
 * <CmsItem.Root itemServiceConfig={{ collectionId: 'MyCollection', itemId: 'item-123' }}>
 *   {({ itemSignal, loadingSignal, updateItem, deleteItem }) => (
 *     <div>
 *       {loadingSignal.get() ? (
 *         <div>Loading...</div>
 *       ) : (
 *         <>
 *           <h1>{itemSignal.get()?.title}</h1>
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
    itemSignal: service.itemSignal,
    loadingSignal: service.loadingSignal,
    errorSignal: service.errorSignal,
    updateItem: service.updateItem,
    deleteItem: service.deleteItem,
    linkItem: service.linkItem,
    unlinkItem: service.unlinkItem,
  });
}
