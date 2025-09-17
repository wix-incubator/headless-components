import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CmsCollectionServiceDefinition,
  CmsCollectionServiceConfig,
  CmsCollectionServiceImplementation,
  type WixDataItem,
} from '../../services/cms-collection-service.js';
import {
  CmsCollectionFiltersServiceDefinition,
  CmsCollectionFiltersServiceImplementation,
  type CmsCollectionFiltersServiceConfig,
} from '../../services/cms-collection-filters-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
  collectionServiceConfig: CmsCollectionServiceConfig;
  filtersServiceConfig?: CmsCollectionFiltersServiceConfig;
}

/**
 * Core Root component that provides the CMS Collection service context to its children.
 * This component sets up the necessary services for rendering and managing collection data.
 */
export function Root(props: RootProps): React.ReactNode {
  let servicesMap = createServicesMap().addService(
    CmsCollectionServiceDefinition,
    CmsCollectionServiceImplementation,
    props.collectionServiceConfig,
  );

  // Conditionally add filters service if configuration is provided
  if (props.filtersServiceConfig) {
    servicesMap = servicesMap.addService(
      CmsCollectionFiltersServiceDefinition,
      CmsCollectionFiltersServiceImplementation,
      props.filtersServiceConfig,
    );
  }

  return (
    <WixServices servicesMap={servicesMap}>
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
 * Core headless component for collection items display with loading and error states
 */
export function Items(props: ItemsProps) {
  const collectionService = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  // Try to get filters service if available
  let filtersService: ServiceAPI<typeof CmsCollectionFiltersServiceDefinition> | null = null;
    filtersService = useService(CmsCollectionFiltersServiceDefinition) as ServiceAPI<
      typeof CmsCollectionFiltersServiceDefinition
    >;

  // Use filtered items if filters service is available, otherwise use collection items
  const collectionItems = collectionService.itemsSignal.get();

  let items = collectionItems;
  if (filtersService) {
    const filteredItems = filtersService.filteredItemsSignal.get();
    const hasActiveFilters = filtersService.hasFiltersSignal.get();

    // If no filters are active and filtered items is empty, sync with collection items
    if (!hasActiveFilters && filteredItems.length === 0 && collectionItems.length > 0) {
      filtersService.filteredItemsSignal.set(collectionItems);
      items = collectionItems;
    } else {
      items = filteredItems;
    }
  }

  const isLoading = collectionService.loadingSignal.get() ||
    (filtersService ? filtersService.filteringSignal.get() : false);

  const error = collectionService.errorSignal.get();

  return props.children({
    items,
    isLoading,
    error,
  });
}
