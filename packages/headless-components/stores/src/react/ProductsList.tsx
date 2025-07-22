import { useService, WixServices } from "@wix/services-manager-react";
import { createServicesMap } from "@wix/services-manager";
import {
  ProductListService,
  ProductsListServiceDefinition,
  type ProductsListServiceConfig,
} from "../services/products-list-service.js";
import { productsV3 } from "@wix/stores";
import {
  ProductService,
  ProductServiceDefinition,
} from "@wix/headless-stores/services";


export interface RootProps {
  /** Child components that will have access to the ProductsList service */
  children: React.ReactNode;
  /** Configuration for the ProductsList service */
  productsListConfig: ProductsListServiceConfig;
}
/**
 * Root component that provides the ProductsList service context to its children.
 * This component sets up the necessary services for managing products list state.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsList } from '@wix/stores/components';
 *
 * function ProductsListPage() {
 *   return (
 *     <ProductsList.Root
 *       productsListConfig={{
 *         collectionId: 'my-collection-id',
 *         filters: { price: { min: 10, max: 100 } }
 *       }}
 *     >
 *       <ProductsList.Grid>
 *         {({ products, isLoading, error }) => (
 *           <div>
 *             {isLoading && <div>Loading products...</div>}
 *             {error && <div>Error: {error}</div>}
 *             {products.map(product => (
 *               <div key={product.id}>{product.name}</div>
 *             ))}
 *           </div>
 *         )}
 *       </ProductsList.Grid>
 *     </ProductsList.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListServiceDefinition,
        ProductListService,
        props.productsListConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

export interface EmptyStateProps {
  /** Content to display when products list is empty (can be a render function or ReactNode) */
  children: (props: EmptyStateRenderProps) => React.ReactNode;
}

export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the products list is empty.
 * Only displays its children when there are no products, no loading state, and no errors.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsList } from '@wix/stores/components';
 *
 * function EmptyProductsMessage() {
 *   return (
 *     <ProductsList.EmptyState>
 *       {() => (
 *         <div className="empty-state">
 *           <h3>No products found</h3>
 *           <p>Try adjusting your search or filter criteria</p>
 *           <button>Clear Filters</button>
 *         </div>
 *       )}
 *     </ProductsList.EmptyState>
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
    return typeof props.children === "function"
      ? props.children({})
      : props.children;
  }

  return null;
}

export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: (props: LoadingRenderProps) => React.ReactNode;
}

export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the products list is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsList } from '@wix/stores/components';
 *
 * function ProductsLoading() {
 *   return (
 *     <ProductsList.Loading>
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading products...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </ProductsList.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps): React.ReactNode {
  const { isLoading } = useService(ProductsListServiceDefinition);
  const isLoadingValue = isLoading.get();

  if (isLoadingValue) {
    return typeof props.children === "function"
      ? props.children({})
      : props.children;
  }

  return null;
}

export interface ErrorRenderProps { error: string | null };

export interface ErrorProps {
  /** Content to display during error state (can be a render function or ReactNode) */
  children: (props: ErrorRenderProps) => React.ReactNode;
}


/**
 * Component that renders content when there's an error loading products.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsList } from '@wix/stores/components';
 *
 * function ProductsError() {
 *   return (
 *     <ProductsList.Error>
 *       {({ error }) => (
 *         <div className="error-state">
 *           <h3>Error loading products</h3>
 *           <p>{error}</p>
 *           <button onClick={() => window.location.reload()}>
 *             Try Again
 *           </button>
 *         </div>
 *       )}
 *     </ProductsList.Error>
 *   );
 * }
 * ```
 */
export function Error(props: ErrorProps): React.ReactNode {
  const { error } = useService(ProductsListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === "function"
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

export interface ItemContentRenderProps {
  product: productsV3.V3Product;
}

export interface ItemContentProps {
  /** Content to display for each product (can be a render function receiving product data or ReactNode) */
  children: (props: ItemContentRenderProps) => React.ReactNode;
}

/**
 * Component that renders content for each product in the list.
 * Maps over all products and provides each product through a service context.
 * Only renders when products are successfully loaded (not loading, no error, and has products).
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsList } from '@wix/stores/components';
 *
 * function ProductsGrid() {
 *   return (
 *     <ProductsList.ItemContent>
 *       {({ product }) => (
 *         <div className="product-card">
 *           <img src={product.media?.main?.image} alt={product.name} />
 *           <h3>{product.name}</h3>
 *           <p>{product.actualPriceRange?.minValue?.formattedAmount}</p>
 *           <button>View Details</button>
 *         </div>
 *       )}
 *     </ProductsList.ItemContent>
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
      {typeof props.children === "function"
        ? props.children({ product })
        : props.children}
    </WixServices>
  ));
}
