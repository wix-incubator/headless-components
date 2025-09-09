import React from 'react';
import { useService } from '@wix/services-manager-react';
import { CMSServiceDefinition, type PaginationState } from '../services/cms-crud-service.js';

/**
 * Props passed to the render function of the CmsCrudPagination.Root component
 */
export type CMSPaginationRootRenderProps = {
  /** The current pagination state */
  pagination: PaginationState;

  /** Function to set the current page */
  setPage: (page: number) => Promise<void>;

  /** Function to navigate to the next page */
  nextPage: () => Promise<void>;

  /** Function to navigate to the previous page */
  prevPage: () => Promise<void>;

  /** Function to load more items */
  loadMore: () => Promise<void>;

  /** Whether a load more operation is in progress */
  isLoadingMore: boolean;
};

/**
 * Props for the CmsCrudPagination.Root component
 */
export interface CmsCrudPaginationRootProps {
  /** Render function that receives pagination state and actions */
  children: (props: CMSPaginationRootRenderProps) => React.ReactNode;
}

/**
 * Root component for CMS pagination that provides pagination state and actions.
 * This component uses the render props pattern to expose pagination functionality.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCrudPagination } from '@wix/cms/components';
 *
 * function PaginationExample() {
 *   return (
 *     <CmsCrudPagination.Root>
 *       {({
 *         pagination,
 *         setPage,
 *         nextPage,
 *         prevPage
 *       }) => (
 *         <div className="pagination-controls">
 *           // Your pagination UI here
 *         </div>
 *       )}
 *     </CmsCrudPagination.Root>
 *   );
 * }
 * ```
 */
export function Root(props: CmsCrudPaginationRootProps) {
  const {
    paginationSignal,
    setPage,
    nextPage,
    prevPage,
    loadMore,
    loadingMoreSignal,
  } = useService(CMSServiceDefinition);

  return props.children({
    pagination: paginationSignal.get(),
    setPage,
    nextPage,
    prevPage,
    loadMore,
    isLoadingMore: loadingMoreSignal.get(),
  });
}

/**
 * Props for the CmsCrudPagination.NextPage component
 */
export interface NextPageProps {
  /** Render function that receives next page action and state */
  children: (props: {
    /** Function to navigate to the next page */
    nextPage: () => Promise<void>;
    /** Whether there is a next page available */
    hasNextPage: boolean;
  }) => React.ReactNode;
}

/**
 * Component for navigating to the next page.
 * This component provides the next page action and whether there is a next page available.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudPagination.NextPage>
 *   {({ nextPage, hasNextPage }) => (
 *     <button onClick={nextPage} disabled={!hasNextPage}>
 *       Next
 *     </button>
 *   )}
 * </CmsCrudPagination.NextPage>
 * ```
 */
export function NextPage(props: NextPageProps) {
  const {
    paginationSignal,
    nextPage,
  } = useService(CMSServiceDefinition);

  const pagination = paginationSignal.get();

  return props.children({
    nextPage,
    hasNextPage: pagination.hasNextPage,
  });
}

/**
 * Props for the CmsCrudPagination.PreviousPage component
 */
export interface PreviousPageProps {
  /** Render function that receives previous page action and state */
  children: (props: {
    /** Function to navigate to the previous page */
    prevPage: () => Promise<void>;
    /** Whether there is a previous page available */
    hasPrevPage: boolean;
  }) => React.ReactNode;
}

/**
 * Component for navigating to the previous page.
 * This component provides the previous page action and whether there is a previous page available.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudPagination.PreviousPage>
 *   {({ prevPage, hasPrevPage }) => (
 *     <button onClick={prevPage} disabled={!hasPrevPage}>
 *       Previous
 *     </button>
 *   )}
 * </CmsCrudPagination.PreviousPage>
 * ```
 */
export function PreviousPage(props: PreviousPageProps) {
  const {
    paginationSignal,
    prevPage,
  } = useService(CMSServiceDefinition);

  const pagination = paginationSignal.get();

  return props.children({
    prevPage,
    hasPrevPage: pagination.hasPrevPage,
  });
}


/**
 * Props for the CmsCrudPagination.PageInfo component
 */
export interface PageInfoProps {
  /** Render function that receives pagination information */
  children: (props: {
    /** The current page number */
    currentPage: number;
    /** The total number of pages */
    totalPages: number;
    /** The total number of items */
    totalItems: number;
    /** Function to set the current page */
    setPage: (page: number) => Promise<void>;
  }) => React.ReactNode;
}

/**
 * Component for displaying pagination information.
 * This component provides pagination information such as current page, total pages, and total items.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudPagination.PageInfo>
 *   {({ currentPage, totalPages, totalItems }) => (
 *     <span>
 *       Page {currentPage} of {totalPages} ({totalItems} items)
 *     </span>
 *   )}
 * </CmsCrudPagination.PageInfo>
 * ```
 */
export function PageInfo(props: PageInfoProps) {
  const {
    paginationSignal,
    setPage,
  } = useService(CMSServiceDefinition);

  const pagination = paginationSignal.get();

  return props.children({
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalItems: pagination.totalItems,
    setPage,
  });
}

/**
 * Props for the CmsCrudPagination.LoadMore component
 */
export interface LoadMoreProps {
  /** Render function that receives load more action and state */
  children: (props: {
    /** Function to load more items */
    loadMore: () => Promise<void>;
    /** Whether there are more items to load */
    hasMoreItems: boolean;
    /** Number of items currently loaded */
    loadedItems: number;
    /** Total number of items */
    totalItems: number;
    /** Whether a load more operation is in progress */
    isLoadingMore: boolean;
  }) => React.ReactNode;
}

/**
 * Component for loading more items.
 * This component provides the load more action and state information.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudPagination.LoadMore>
 *   {({ loadMore, hasMoreItems, loadedItems, totalItems, isLoadingMore }) => (
 *     <button onClick={loadMore} disabled={!hasMoreItems || isLoadingMore}>
 *       {isLoadingMore ? 'Loading...' : hasMoreItems ? `Load More (${loadedItems}/${totalItems})` : 'All items loaded'}
 *     </button>
 *   )}
 * </CmsCrudPagination.LoadMore>
 * ```
 */
export function LoadMore(props: LoadMoreProps) {
  const {
    paginationSignal,
    loadMore,
    loadingMoreSignal,
  } = useService(CMSServiceDefinition);

  const pagination = paginationSignal.get();

  return props.children({
    loadMore,
    hasMoreItems: pagination.hasMoreItems,
    loadedItems: pagination.loadedItems,
    totalItems: pagination.totalItems,
    isLoadingMore: loadingMoreSignal.get(),
  });
}
