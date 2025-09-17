import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import {
  CmsCollectionServiceDefinition,
  CmsCollectionServiceConfig,
  CmsCollectionServiceImplementation,
  type WixDataItem,
  type WixDataQueryResult,
} from '../../services/cms-collection-service.js';
import { createServicesMap } from '@wix/services-manager';

export interface RootProps {
  children: React.ReactNode;
  collectionServiceConfig: CmsCollectionServiceConfig;
}

/**
 * Core Root component that provides the CMS Collection service context to its children.
 * This component sets up the necessary services for rendering and managing collection data.
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
 * Core headless component for collection items display with loading and error states
 */
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

/**
 * Props for CmsCollection.NextAction headless component
 */
export interface NextActionProps {
  /** Render prop function that receives next page controls */
  children: (props: NextActionRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.NextAction component
 */
export interface NextActionRenderProps {
  /** Function to load the next page */
  loadNext: () => Promise<void>;
  /** Whether there is a next page available */
  hasNext: boolean;
  /** Whether a page is currently loading */
  isLoading: boolean;
  /** Current page number */
  currentPage: WixDataQueryResult["currentPage"];
  /** Total number of items */
  totalCount: WixDataQueryResult["totalCount"];
  /** Page size */
  pageSize: WixDataQueryResult["pageSize"];
  /** Total number of pages */
  totalPages: WixDataQueryResult["totalPages"];
}

/**
 * Core headless component for loading the next page of collection items
 */
export function NextAction(props: NextActionProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const isLoading = service.loadingSignal.get();
  const queryResult = service.queryResultSignal.get();
  const loadNext = service.loadNextPage;

  return props.children({
    loadNext,
    hasNext: queryResult?.hasNext() ?? false,
    isLoading,
    currentPage: queryResult?.currentPage,
    totalCount: queryResult?.totalCount,
    pageSize: queryResult?.pageSize,
    totalPages: queryResult?.totalPages,
  });
}

/**
 * Props for CmsCollection.PrevAction headless component
 */
export interface PrevActionProps {
  /** Render prop function that receives previous page controls */
  children: (props: PrevActionRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.PrevAction component
 */
export interface PrevActionRenderProps {
  /** Function to load the previous page */
  loadPrev: () => Promise<void>;
  /** Whether there is a previous page available */
  hasPrev: boolean;
  /** Whether a page is currently loading */
  isLoading: boolean;
  /** Current page number */
  currentPage: WixDataQueryResult["currentPage"];
  /** Total number of items */
  totalCount: WixDataQueryResult["totalCount"];
  /** Page size */
  pageSize: WixDataQueryResult["pageSize"];
  /** Total number of pages */
  totalPages: WixDataQueryResult["totalPages"];
}

/**
 * Core headless component for loading the previous page of collection items
 */
export function PrevAction(props: PrevActionProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const isLoading = service.loadingSignal.get();
  const queryResult = service.queryResultSignal.get();
  const loadPrev = service.loadPrevPage;

  return props.children({
    loadPrev,
    hasPrev: queryResult?.hasPrev() ?? false,
    isLoading,
    currentPage: queryResult?.currentPage,
    totalCount: queryResult?.totalCount,
    pageSize: queryResult?.pageSize,
    totalPages: queryResult?.totalPages,
  });
}
