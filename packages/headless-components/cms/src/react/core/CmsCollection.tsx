import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CmsCollectionServiceDefinition,
  CmsCollectionServiceConfig,
  CmsCollectionServiceImplementation,
  type WixDataItem,
} from '../../services/cms-collection-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
  collectionServiceConfig: CmsCollectionServiceConfig;
}

/**
 * Root component that provides the CMS Collection service context to its children.
 * This component sets up the necessary services for rendering and managing collection data.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionPage() {
 *   return (
 *     <CmsCollection.Root collectionServiceConfig={{ collectionId: 'MyCollection' }}>
 *       <CmsCollection.Items>
 *         {({ items, isLoading, error }) => (
 *           <div>
 *             {error && <div>Error: {error}</div>}
 *             {isLoading && <div>Loading...</div>}
 *             {items.map(item => <div key={item._id}>{item.title}</div>)}
 *           </div>
 *         )}
 *       </CmsCollection.Items>
 *     </CmsCollection.Root>
 *   );
 * }
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
      {props.children}
    </WixServices>
  );
}

/**
 * Props for CmsCollection.Items headless component
 */
export interface ItemsProps {
  /** Render prop function that receives collection items data */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.Items component
 */
export interface ItemsRenderProps {
  /** Array of collection items */
  items: WixDataItem[];
  /** Whether the collection is currently loading */
  isLoading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
}

/**
 * Headless component for collection items display with loading and error states
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionItemsView() {
 *   return (
 *     <CmsCollection.Items>
 *       {({ items, isLoading, error }) => (
 *         <div>
 *           {error && <div>Error: {error}</div>}
 *           {isLoading && <div>Loading...</div>}
 *           {!isLoading && !error && items.length === 0 && <div>No items found</div>}
 *           {items.map(item => (
 *             <div key={item._id}>{item.title}</div>
 *           ))}
 *         </div>
 *       )}
 *     </CmsCollection.Items>
 *   );
 * }
 * ```
 */
// TODO: this is just for POC, need to update to follow real design
export function Items(props: ItemsProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const items = service.itemsSignal.get();
  const isLoading = service.loadingSignal.get();
  const error = service.errorSignal.get();

  return props.children({
    items,
    isLoading,
    error,
  });
}
