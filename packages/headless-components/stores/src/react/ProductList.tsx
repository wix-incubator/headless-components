import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import type { ProductsListSearchServiceConfig } from '../services/products-list-search-service.js';
import type { ProductsListServiceConfig } from '../services/products-list-service.js';
import { ProductsListServiceDefinition } from '../services/products-list-service.js';

import * as CoreProductList from './core/ProductList.js';
import * as CoreProductListPagination from './core/ProductListPagination.js';
import * as Product from './Product.js';
import { AsChildSlot } from '@wix/headless-utils/react';

enum TestIds {
  productListRoot = 'product-list-root',
  productListProducts = 'product-list-products',
  productListItem = 'product-list-item',
  productListLoadMore = 'product-list-load-more',
  productListTotalsDisplayed = 'product-list-totals-displayed',
}

/**
 * Props for the ProductList root component following the documented API
 */
export interface ProductListRootProps {
  children: React.ReactNode;
  products?: V3Product[];
  productsListConfig?: ProductsListServiceConfig;
  productsListSearchConfig?: ProductsListSearchServiceConfig;
  className?: string;
}

/**
 * Root component that provides the ProductList service context for rendering product lists.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductList } from '@wix/stores/components';
 *
 * function ProductListPage({ products }) {
 *   return (
 *     <ProductList.Root products={products}>
 *       <ProductList.Products>
 *         <ProductList.ProductRepeater>
 *           <Product.Name />
 *           <Product.Price />
 *         </ProductList.ProductRepeater>
 *       </ProductList.Products>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, ProductListRootProps>(
  (props, ref) => {
    const {
      children,
      products,
      productsListConfig,
      productsListSearchConfig,
      className,
    } = props;

    const serviceConfig = productsListConfig || {
      products: products || [],
      searchOptions: {
        cursorPaging: { limit: 10 },
      },
      pagingMetadata: {
        count: products?.length || 0,
      },
      aggregations: {}, // Empty aggregation data
      customizations: [],
    };

    return (
      <CoreProductList.Root
        productsListConfig={serviceConfig}
        productsListSearchConfig={productsListSearchConfig}
      >
        <RootContent
          children={children as any}
          className={className}
          ref={ref}
        />
      </CoreProductList.Root>
    );
  },
);

/**
 * Internal component to handle the Root content with service access
 */
const RootContent = React.forwardRef<
  HTMLElement,
  {
    children?: any;
    className?: string;
  }
>((props, ref) => {
  const { children, className } = props;
  const productsListService = useService(ProductsListServiceDefinition);
  const contextProducts = productsListService.products.get();
  const pagingMetadata = productsListService.pagingMetadata.get();

  const displayedProducts = contextProducts.length;
  const totalProducts = pagingMetadata.count || contextProducts.length;
  const isFiltered = false; // TODO: Implement filtering detection

  const attributes = {
    'data-testid': TestIds.productListRoot,
    'data-total-products': totalProducts,
    'data-displayed-products': displayedProducts,
    'data-filtered': isFiltered,
    className,
  };

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
      {children}
    </div>
  );
});

/**
 * Props for ProductList Raw component
 */
export interface RawProps {
  children:
    | ((props: {
        totalProducts: number;
        displayedProducts: number;
        isFiltered: boolean;
      }) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Raw component that provides direct access to product list data.
 * Similar to Product.Raw, this should only be used when you need custom access to list data.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.Raw>
 *   {({ totalProducts, displayedProducts, isFiltered }) => (
 *     <div className="text-content-muted">
 *       Showing {displayedProducts} of {totalProducts} products
 *       {isFiltered && <span className="ml-2 text-brand-primary">(Filtered)</span>}
 *     </div>
 *   )}
 * </ProductList.Raw>
 * ```
 */
export const Raw = React.forwardRef<HTMLElement, RawProps>((props, _ref) => {
  const { children } = props;
  const productsListService = useService(ProductsListServiceDefinition);
  const products = productsListService.products.get();
  const pagingMetadata = productsListService.pagingMetadata.get();
  const displayedProducts = products.length;
  const totalProducts = pagingMetadata.count || products.length;
  const isFiltered = false; // TODO: Implement filtering detection

  return typeof children === 'function'
    ? children({ totalProducts, displayedProducts, isFiltered })
    : children;
});

/**
 * Props for ProductList Products component
 */
export interface ProductsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  infiniteScroll?: boolean;
  pageSize?: number;
  className?: string;
}

/**
 * Container for the product list with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.Products emptyState={<div>No products found</div>}>
 *   <ProductList.ProductRepeater>
 *     <Product.Name />
 *     <Product.Price />
 *   </ProductList.ProductRepeater>
 * </ProductList.Products>
 * ```
 */
export const Products = React.forwardRef<HTMLElement, ProductsProps>(
  (props, ref) => {
    const {
      children,
      emptyState,
      infiniteScroll = true,
      pageSize = 0,
      className,
    } = props;
    const productsListService = useService(ProductsListServiceDefinition);
    const products = productsListService.products.get();
    const hasProducts = products.length > 0;

    if (!hasProducts) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.productListProducts,
      'data-empty': !hasProducts,
      'data-infinite-scroll': infiniteScroll,
      'data-page-size': pageSize,
      className,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children as React.ReactNode}
      </div>
    );
  },
);

/**
 * Props for ProductList ProductRepeater component
 */
export interface ProductRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Product.Root for each product.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.ProductRepeater>
 *   <Product.Name />
 *   <Product.Price />
 *   <Product.MediaGallery>
 *     <MediaGallery.Viewport />
 *   </Product.MediaGallery>
 * </ProductList.ProductRepeater>
 * ```
 */
export const ProductRepeater = React.forwardRef<
  HTMLElement,
  ProductRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const productsListService = useService(ProductsListServiceDefinition);
  const products = productsListService.products.get();
  const hasProducts = products.length > 0;

  if (!hasProducts) return null;

  return (
    <>
      {products.map((product: V3Product) => (
        <Product.Root
          key={product._id}
          product={product}
          data-testid={TestIds.productListItem}
          data-product-id={product._id}
          data-product-available={true}
        >
          {children}
        </Product.Root>
      ))}
    </>
  );
});

/**
 * Props for ProductList LoadMoreTrigger component
 */
export interface LoadMoreTriggerProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

/**
 * Displays a button to load more products. Not rendered if infiniteScroll is false or no products are left to load.
 * Follows the architecture rules - does not support asChild as it's a simple trigger component.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.LoadMoreTrigger asChild>
 *   <button>Load More</button>
 * </ProductList.LoadMoreTrigger>
 * ```
 */
export const LoadMoreTrigger = React.forwardRef<
  HTMLElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const { asChild, children, className } = props;

  return (
    <CoreProductListPagination.LoadMoreTrigger>
      {({ loadMore, hasMoreProducts, isLoading }) => {
        // Don't render if no more products to load
        if (!hasMoreProducts) return null;

        const handleClick = () => loadMore(10);

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onClick={handleClick}
            disabled={isLoading}
            data-testid={TestIds.productListLoadMore}
            customElement={children}
          >
            <button>{children}</button>
          </AsChildSlot>
        );
      }}
    </CoreProductListPagination.LoadMoreTrigger>
  );
});

/**
 * Props for ProductList Totals Displayed component
 */
export interface TotalsDisplayedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          displayedProducts: number;
        }
      >
    | React.ForwardRefExoticComponent<any>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the number of products currently displayed.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.TotalsDisplayed />
 * // or with asChild
 * <ProductList.TotalsDisplayed asChild>
 *   <strong />
 * </ProductList.TotalsDisplayed>
 * // or with render function
 * <ProductList.TotalsDisplayed asChild>
 *   {({ displayedProducts }, ref) => <strong ref={ref}>{displayedProducts}</strong>}
 * </ProductList.TotalsDisplayed>
 * ```
 */
export const TotalsDisplayed = React.forwardRef<
  HTMLElement,
  TotalsDisplayedProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const productsListService = useService(ProductsListServiceDefinition);
  const products = productsListService.products.get();
  const displayedProducts = products.length;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.productListTotalsDisplayed}
      data-displayed={displayedProducts}
      customElement={children}
      customElementProps={{ displayedProducts }}
      content={displayedProducts}
    >
      <span>{displayedProducts}</span>
    </AsChildSlot>
  );
});
