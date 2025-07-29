import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  ProductsListPaginationService,
  ProductsListPaginationServiceDefinition,
} from "../services/products-list-pagination-service.js";
import { ProductsListServiceDefinition } from "../services/products-list-service.js";

export interface RootProps {
  children: React.ReactNode;
}

/**
 * Root component that provides the ProductListPagination service context to its children.
 * This component sets up the necessary services for managing products list pagination.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function PaginationSection() {
 *   return (
 *     <ProductListPagination.Root>
 *       <ProductListPagination.NextPageTrigger>
 *         {({ nextPage, hasNextPage }) => (
 *           <button
 *             onClick={nextPage}
 *             disabled={!hasNextPage}
 *           >
 *             Next Page
 *           </button>
 *         )}
 *       </ProductListPagination.NextPageTrigger>
 *     </ProductListPagination.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListPaginationServiceDefinition,
        ProductsListPaginationService,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for PageSize headless component
 */
export interface PageSizeProps {
  /** Content to display (can be a render function receiving page size controls or ReactNode) */
  children: ((props: PageSizeRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for PageSize component
 */
export interface PageSizeRenderProps {
  /** Current page size (items per page) */
  currentLimit: number;
  /** Function to update the page size */
  setLimit: (limit: number) => void;
}

/**
 * Headless component for managing page size (items per page)
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function PageSizeSelector() {
 *   return (
 *     <ProductListPagination.PageSize>
 *       {({ currentLimit, setLimit }) => (
 *         <div>
 *           <label>Items per page:</label>
 *           <select
 *             value={currentLimit}
 *             onChange={(e) => setLimit(Number(e.target.value))}
 *           >
 *             <option value={10}>10</option>
 *             <option value={20}>20</option>
 *             <option value={50}>50</option>
 *           </select>
 *         </div>
 *       )}
 *     </ProductListPagination.PageSize>
 *   );
 * }
 * ```
 */
export function PageSize(props: PageSizeProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const currentLimit = service.currentLimit.get();
  const setLimit = service.setLimit;

  return typeof props.children === "function"
    ? props.children({ currentLimit, setLimit })
    : props.children;
}

/**
 * Props for NextPageTrigger headless component
 */
export interface NextPageTriggerProps {
  /** Content to display (can be a render function receiving next page controls or ReactNode) */
  children: ((props: NextPageTriggerRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for NextPageTrigger component
 */
export interface NextPageTriggerRenderProps {
  /** Function to navigate to the next page */
  nextPage: () => void;
  /** Whether there is a next page available */
  hasNextPage: boolean;
}

/**
 * Headless component for navigating to the next page
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function NextPageButton() {
 *   return (
 *     <ProductListPagination.NextPageTrigger>
 *       {({ nextPage, hasNextPage }) => (
 *         <button
 *           onClick={nextPage}
 *           disabled={!hasNextPage}
 *           className={hasNextPage ? 'enabled' : 'disabled'}
 *         >
 *           Next →
 *         </button>
 *       )}
 *     </ProductListPagination.NextPageTrigger>
 *   );
 * }
 * ```
 */
export function NextPageTrigger(props: NextPageTriggerProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const nextPage = service.nextPage;
  const hasNextPage = service.hasNextPage.get();
  return typeof props.children === "function"
    ? props.children({ nextPage, hasNextPage })
    : props.children;
}

/**
 * Props for PreviousPageTrigger headless component
 */
export interface PreviousPageTriggerProps {
  /** Content to display (can be a render function receiving previous page controls or ReactNode) */
  children: ((props: PreviousPageTriggerRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for PreviousPageTrigger component
 */
export interface PreviousPageTriggerRenderProps {
  /** Function to navigate to the previous page */
  prevPage: () => void;
  /** Whether there is a previous page available */
  hasPrevPage: boolean;
}

/**
 * Headless component for navigating to the previous page
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function PrevPageButton() {
 *   return (
 *     <ProductListPagination.PreviousPageTrigger>
 *       {({ prevPage, hasPrevPage }) => (
 *         <button
 *           onClick={prevPage}
 *           disabled={!hasPrevPage}
 *           className={hasPrevPage ? 'enabled' : 'disabled'}
 *         >
 *           ← Previous
 *         </button>
 *       )}
 *     </ProductListPagination.PreviousPageTrigger>
 *   );
 * }
 * ```
 */
export function PreviousPageTrigger(props: PreviousPageTriggerProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const prevPage = service.prevPage;
  const hasPrevPage = service.hasPrevPage.get();
  return typeof props.children === "function"
    ? props.children({ prevPage, hasPrevPage })
    : props.children;
}

/**
 * Props for FirstPageTrigger headless component
 */
export interface FirstPageTriggerProps {
  /** Content to display (can be a render function receiving first page controls or ReactNode) */
  children: ((props: FirstPageTriggerRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for FirstPageTrigger component
 */
export interface FirstPageTriggerRenderProps {
  /** Function to navigate to the first page */
  navigateToFirstPage: () => void;
  /** Whether there is a previous page (indicating not on first page) */
  hasPrevPage: boolean;
}

/**
 * Headless component for navigating to the first page
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function FirstPageButton() {
 *   return (
 *     <ProductListPagination.FirstPageTrigger>
 *       {({ navigateToFirstPage, hasPrevPage }) => (
 *         <button
 *           onClick={navigateToFirstPage}
 *           disabled={!hasPrevPage}
 *           title="Go to first page"
 *         >
 *           ⏮ First
 *         </button>
 *       )}
 *     </ProductListPagination.FirstPageTrigger>
 *   );
 * }
 * ```
 */
export function FirstPageTrigger(props: FirstPageTriggerProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const navigateToFirstPage = service.navigateToFirstPage;
  const hasPrevPage = service.hasPrevPage.get();

  return typeof props.children === "function"
    ? props.children({ navigateToFirstPage, hasPrevPage })
    : props.children;
}

/**
 * Props for LoadMoreTrigger headless component
 */
export interface LoadMoreTriggerProps {
  /** Content to display (can be a render function receiving load more controls or ReactNode) */
  children: ((props: LoadMoreTriggerRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for LoadMoreTrigger component
 */
export interface LoadMoreTriggerRenderProps {
  /** Function to load more products */
  loadMore: (count: number) => void;
  /** Whether there are more products to load */
  hasMoreProducts: boolean;
  /** Whether products are currently loading */
  isLoading: boolean;
}

/**
 * Headless component for loading more products (infinite scroll pattern)
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListPagination } from '@wix/stores/components';
 *
 * function LoadMoreButton() {
 *   return (
 *     <ProductListPagination.LoadMoreTrigger>
 *       {({ loadMore, hasMoreProducts, isLoading }) => (
 *         <button
 *           onClick={() => loadMore(10)}
 *           disabled={!hasMoreProducts || isLoading}
 *           className="load-more-btn"
 *         >
 *           {isLoading ? 'Loading...' : hasMoreProducts ? 'Load More' : 'No More Products'}
 *         </button>
 *       )}
 *     </ProductListPagination.LoadMoreTrigger>
 *   );
 * }
 * ```
 */
export function LoadMoreTrigger(props: LoadMoreTriggerProps) {
  const service = useService(ProductsListPaginationServiceDefinition);
  const productsListService = useService(ProductsListServiceDefinition);

  const loadMore = service.loadMore;
  const hasMoreProducts = service.hasNextPage.get();
  const isLoading = productsListService.isLoading.get();

  return typeof props.children === "function"
    ? props.children({ loadMore, hasMoreProducts, isLoading })
    : props.children;
}
