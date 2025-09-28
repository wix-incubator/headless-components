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
  /** Function to load the next page */
  loadNext: () => Promise<void>;
  /** Whether there is a next page available */
  hasNext: boolean;
}

/**
 * Core headless component for collection items display with loading and error states
 */
export function Items(props: ItemsProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const items = service.queryResultSignal.get()?.items || [];
  const isLoading = service.loadingSignal.get();
  const error = service.errorSignal.get();
  const queryResult = service.queryResultSignal.get();
  const loadNext = service.loadNextPage;

  return props.children({
    items,
    isLoading,
    error,
    loadNext,
    hasNext: queryResult?.hasNext() ?? false,
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

/**
 * Props for CmsCollection.Totals.Count headless component
 */
export interface TotalsCountProps {
  /** Render prop function that receives total count data */
  children: (props: TotalsCountRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.Totals.Count component
 */
export interface TotalsCountRenderProps {
  /** Total number of items in the collection */
  total: number;
}

/**
 * Core headless component for displaying the total number of items in the collection
 */
export function TotalsCount(props: TotalsCountProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const queryResult = service.queryResultSignal.get();

  return props.children({
    total: queryResult?.totalCount ?? 0,
  });
}

/**
 * Type of display count to show
 */
export type DisplayType =
  | 'displayed' // Number of items displayed up to current page (default)
  | 'currentPageAmount' // Number of items on current page only
  | 'currentPageNum' // Current page number
  | 'totalPages'; // Total number of pages

/**
 * Props for CmsCollection.Totals.Displayed headless component
 */
export interface TotalsDisplayedProps {
  /** Type of display count to show */
  displayType?: DisplayType;
  /** Render prop function that receives displayed count data */
  children: (props: TotalsDisplayedRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.Totals.Displayed component
 */
export interface TotalsDisplayedRenderProps {
  /** Number based on the specified displayType */
  displayed: number;
}

/**
 * Core headless component for displaying various count metrics
 */
export function TotalsDisplayed(props: TotalsDisplayedProps) {
  const { displayType = 'displayed' } = props;
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const queryResult = service.queryResultSignal.get();

  // Extract data from queryResult
  const currentPage = queryResult?.currentPage ?? 0; // 0-based index
  const pageSize = queryResult?.pageSize ?? 0;
  const currentPageItems = queryResult?.items.length ?? 0;
  const totalPages = queryResult?.totalPages ?? 0;

  // Calculate the displayed value based on displayType
  let displayed: number;

  switch (displayType) {
    case 'currentPageAmount':
      displayed = currentPageItems;
      break;
    case 'currentPageNum':
      displayed = currentPage + 1; // Convert from 0-based to 1-based for display
      break;
    case 'totalPages':
      displayed = totalPages;
      break;
    case 'displayed':
    default:
      // Calculate total displayed count: all items from previous pages + current page items
      displayed =
        pageSize > 0
          ? currentPage * pageSize + currentPageItems
        : currentPageItems;
      break;
  }

  return props.children({
    displayed,
  });
}

/**
 * Props for CmsCollection.CreateItemAction headless component
 */
export interface CreateItemActionProps {
  /** Render prop function that receives create item controls */
  children: (props: CreateItemActionRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.CreateItemAction component
 */
export interface CreateItemActionRenderProps {
  /** Function to create a new item */
  createItem: (itemData: Partial<WixDataItem>) => Promise<void>;
  /** Whether creation is currently in progress */
  isLoading: boolean;
  /** Error message if creation failed, null otherwise */
  error: string | null;
}

/**
 * Props for CmsCollection.ItemRepeater headless component
 */
export interface ItemRepeaterProps {
  /** Render prop function that receives collection items data for repeating */
  children: (props: ItemRepeaterRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.ItemRepeater component
 */
export interface ItemRepeaterRenderProps {
  /** Array of collection items */
  items: WixDataItem[];
  /** The collection ID */
  collectionId: string;
  /** Whether the collection is currently loading */
  isLoading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
}

/**
 * Core headless component for creating new items in the collection
 */
export function CreateItemAction(props: CreateItemActionProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const isLoading = service.loadingSignal.get();
  const error = service.errorSignal.get();
  const createItem = service.createItem;

  return props.children({
    createItem,
    isLoading,
    error,
  });
}

/**
 * Core headless component for collection item repeating with data access
 */
export function ItemRepeater(props: ItemRepeaterProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const items = service.queryResultSignal.get()?.items || [];
  const isLoading = service.loadingSignal.get();
  const error = service.errorSignal.get();
  const collectionId = service.collectionId;

  return props.children({
    items,
    collectionId,
    isLoading,
    error,
  });
}

/**
 * Props for Loading headless component
 */
export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Loading component
 */
export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the collection is currently loading.
 */
export function Loading(props: LoadingProps): React.ReactNode {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;
  const isLoadingValue = service.loadingSignal.get();

  if (isLoadingValue) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
}

/**
 * Props for Error headless component
 */
export interface ErrorProps {
  /** Content to display during error state (can be a render function or ReactNode) */
  children: ((props: ErrorRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Error component
 */
export interface ErrorRenderProps {
  /** Error message */
  error: string | null;
}

/**
 * Component that renders content when there's an error loading collection.
 * Only displays its children when an error has occurred.
 */
export function Error(props: ErrorProps): React.ReactNode {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;
  const errorValue = service.errorSignal.get();

  if (errorValue) {
    return typeof props.children === 'function'
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}
