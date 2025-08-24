import { useService } from '@wix/services-manager-react';
import { ProductsListServiceDefinition } from '../../services/products-list-service.js';

/**
 * Props for LoadMoreTrigger headless component
 */
export interface LoadMoreTriggerProps {
  /** Content to display (can be a render function receiving load more controls or ReactNode) */
  children:
    | ((props: LoadMoreTriggerRenderProps) => React.ReactNode)
    | React.ReactNode;
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
 * import { ProductList, ProductListPagination } from '@wix/stores/components';
 *
 * function LoadMoreButton() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListPagination.LoadMoreTrigger>
 *         {({ loadMore, hasMoreProducts, isLoading }) => (
 *           <button
 *             onClick={() => loadMore(10)}
 *             disabled={!hasMoreProducts || isLoading}
 *             className="load-more-btn"
 *           >
 *             {isLoading ? 'Loading...' : hasMoreProducts ? 'Load More' : 'No More Products'}
 *           </button>
 *         )}
 *       </ProductListPagination.LoadMoreTrigger>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function LoadMoreTrigger(props: LoadMoreTriggerProps) {
  const productsListService = useService(ProductsListServiceDefinition);

  const loadMore = productsListService.loadMore;
  const hasMoreProducts = productsListService.hasMoreProducts.get();
  const isLoading = productsListService.isLoading.get();

  return typeof props.children === 'function'
    ? props.children({ loadMore, hasMoreProducts, isLoading })
    : props.children;
}
