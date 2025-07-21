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
  children: React.ReactNode;
  productsListConfig: ProductsListServiceConfig;
}
/**
 * Root component that provides the ProductsList service context to its children.
 * This component sets up the necessary services for managing products list state.
 *
 * @component
 * @param props - Component props
 * @param props.children - Child components that will have access to the ProductsList service
 * @param props.productsListConfig - Configuration for the ProductsList service
 * @returns JSX element wrapping children with ProductsList service context
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
  children: (props: EmptyStateRenderProps) => React.ReactNode;
}

export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the products list is empty.
 * Only displays its children when there are no products, no loading state, and no errors.
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to display when products list is empty (can be a render function or ReactNode)
 * @returns JSX element or null based on products list state
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
  children: (props: LoadingRenderProps) => React.ReactNode;
}

export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the products list is currently loading.
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to display during loading (can be a render function or ReactNode)
 * @returns JSX element or null based on loading state
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
  children: (props: ErrorRenderProps) => React.ReactNode;
}


/**
 * Component that renders content when there's an error loading products.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to display during error state (can be a render function or ReactNode)
 * @returns JSX element or null based on error state
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
  children: (props: ItemContentRenderProps) => React.ReactNode;
}

/**
 * Component that renders content for each product in the list.
 * Maps over all products and provides each product through a service context.
 * Only renders when products are successfully loaded (not loading, no error, and has products).
 *
 * @component
 * @param props - Component props
 * @param props.children - Content to display for each product (can be a render function receiving product data or ReactNode)
 * @returns Array of JSX elements for each product or null if no products to display
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
