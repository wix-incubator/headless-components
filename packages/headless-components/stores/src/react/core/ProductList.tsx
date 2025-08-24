import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ProductListService,
  ProductsListServiceDefinition,
  type ProductsListServiceConfig,
} from '../../services/products-list-service.js';
import { productsV3 } from '@wix/stores';
import {
  ProductService,
  ProductServiceDefinition,
} from '../../services/product-service.js';
import {
  ProductsListSearchService,
  ProductsListSearchServiceConfig,
  ProductsListSearchServiceDefinition,
} from '../../services/products-list-search-service.js';
import {
  CategoriesListService,
  CategoriesListServiceConfig,
  CategoriesListServiceDefinition,
} from '../../services/categories-list-service.js';

/**
 * Props for Root headless component
 */
export interface RootProps {
  /** Child components that will have access to the ProductList service */
  children: React.ReactNode;
  /** Configuration for the ProductList service */
  productsListConfig: ProductsListServiceConfig;
  /** Configuration for the ProductListSearch service */
  productsListSearchConfig?: ProductsListSearchServiceConfig;
  /** Configuration for the CategoriesList service */
  categoriesListConfig?: CategoriesListServiceConfig;
}

/**
 * Root component that provides both ProductList and ProductListSearch service contexts to its children.
 * This component sets up the necessary services for managing products list state, including search,
 * filtering, sorting, and pagination functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductList, ProductListFilters, ProductListSort, ProductListPagination } from '@wix/stores/components';
 *
 * function ProductListPage() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{
 *         products: myProducts,
 *         searchOptions: { query: { search: 'searchTerm' } },
 *         pagingMetadata: { count: 10, hasNext: true },
 *         aggregations: {}
 *       }}
 *       productsListSearchConfig={{
 *         customizations: [],
 *         initialSearchState: { sort: 'name_asc', limit: 20 }
 *       }}
 *     >
 *       <ProductListSort.Options>
 *         {({ selectedSortOption, updateSortOption, sortOptions }) => (
 *           <select value={selectedSortOption} onChange={(e) => updateSortOption(e.target.value)}>
 *             {sortOptions.map(option => <option key={option} value={option}>{option}</option>)}
 *           </select>
 *         )}
 *       </ProductListSort.Options>
 *
 *       <ProductListFilters.PriceRange>
 *         {({ selectedMinPrice, setSelectedMinPrice }) => (
 *           <input value={selectedMinPrice} onChange={(e) => setSelectedMinPrice(Number(e.target.value))} />
 *         )}
 *       </ProductListFilters.PriceRange>
 *
 *       <ProductList.ItemContent>
 *         {({ product }) => (
 *           <div key={product._id}>
 *             <h3>{product.name}</h3>
 *             <p>{product.actualPriceRange?.minValue?.formattedAmount}</p>
 *           </div>
 *         )}
 *       </ProductList.ItemContent>
 *
 *       <ProductListPagination.NextPageTrigger>
 *         {({ nextPage, hasNextPage }) => (
 *           <button onClick={nextPage} disabled={!hasNextPage}>Next</button>
 *         )}
 *       </ProductListPagination.NextPageTrigger>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(
          CategoriesListServiceDefinition,
          CategoriesListService,
          props.categoriesListConfig,
        )
        .addService(
          ProductsListServiceDefinition,
          ProductListService,
          props.productsListConfig,
        )
        .addService(
          ProductsListSearchServiceDefinition,
          ProductsListSearchService,
          props.productsListSearchConfig,
        )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for EmptyState headless component
 */
export interface EmptyStateProps {
  /** Content to display when products list is empty (can be a render function or ReactNode) */
  children:
    | ((props: EmptyStateRenderProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Render props for EmptyState component
 */
export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the products list is empty.
 * Only displays its children when there are no products, no loading state, and no errors.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList } from '@wix/stores/components';
 *
 * function EmptyProductsMessage() {
 *   return (
 *     <ProductList.EmptyState>
 *       {() => (
 *         <div className="empty-state">
 *           <h3>No products found</h3>
 *           <p>Try adjusting your search or filter criteria</p>
 *           <button>Clear Filters</button>
 *         </div>
 *       )}
 *     </ProductList.EmptyState>
 *   );
 * }
 * ```
 */
export function EmptyState(props: EmptyStateProps): React.ReactNode {
  const { isLoading, error, products } = useService(
    ProductsListServiceDefinition,
  );
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const productsValue = products.get();

  if (!isLoadingValue && !errorValue && productsValue.length === 0) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
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
 * Only displays its children when the products list is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList } from '@wix/stores/components';
 *
 * function ProductsLoading() {
 *   return (
 *     <ProductList.Loading>
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading products...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </ProductList.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps): React.ReactNode {
  const { isLoading } = useService(ProductsListServiceDefinition);
  const isLoadingValue = isLoading.get();

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
 * Component that renders content when there's an error loading products.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList } from '@wix/stores/components';
 *
 * function ProductsError() {
 *   return (
 *     <ProductList.Error>
 *       {({ error }) => (
 *         <div className="error-state">
 *           <h3>Error loading products</h3>
 *           <p>{error}</p>
 *           <button onClick={() => window.location.reload()}>
 *             Try Again
 *           </button>
 *         </div>
 *       )}
 *     </ProductList.Error>
 *   );
 * }
 * ```
 */
export function Error(props: ErrorProps): React.ReactNode {
  const { error } = useService(ProductsListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === 'function'
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

/**
 * Props for ItemContent headless component
 */
export interface ItemContentProps {
  /** Content to display for each product (can be a render function receiving product data or ReactNode) */
  children:
    | ((props: ItemContentRenderProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Render props for ItemContent component
 */
export interface ItemContentRenderProps {
  /** Product data */
  product: productsV3.V3Product;
}

/**
 * Component that renders content for each product in the list.
 * Maps over all products and provides each product through a service context.
 * Only renders when products are successfully loaded (not loading, no error, and has products).
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList } from '@wix/stores/components';
 *
 * function ProductsGrid() {
 *   return (
 *     <ProductList.ItemContent>
 *       {({ product }) => (
 *         <div className="product-card">
 *           <img src={product.media?.main?.image} alt={product.name} />
 *           <h3>{product.name}</h3>
 *           <p>{product.actualPriceRange?.minValue?.formattedAmount}</p>
 *           <button>View Details</button>
 *         </div>
 *       )}
 *     </ProductList.ItemContent>
 *   );
 * }
 * ```
 */
export function ItemContent(props: ItemContentProps): React.ReactNode {
  const { products, isLoading, error } = useService(
    ProductsListServiceDefinition,
  );
  const productsValue = products.get();

  if (isLoading.get() || error.get() || productsValue.length === 0) {
    return null;
  }

  return productsValue.map((product: productsV3.V3Product) => (
    <WixServices
      key={product._id}
      servicesMap={createServicesMap().addService(
        ProductServiceDefinition,
        ProductService,
        { product },
      )}
    >
      {typeof props.children === 'function'
        ? props.children({ product })
        : props.children}
    </WixServices>
  ));
}

export type ItemsProps = {
  children: ((props: ItemsRenderProps) => React.ReactNode) | React.ReactNode;
};

export type ItemsRenderProps = {
  products: productsV3.V3Product[];
};

export function Items(props: ItemsProps) {
  const { products } = useService(ProductsListServiceDefinition);
  const productsValue = products.get();

  return typeof props.children === 'function'
    ? props.children({ products: productsValue })
    : props.children;
}
