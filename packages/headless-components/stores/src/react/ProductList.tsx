import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import React from 'react';
import { renderAsChild, type AsChildProps } from '../utils/index.js';
import * as CoreProductList from './core/ProductList.js';
import * as CoreProduct from './core/Product.js';
import type { ProductsListServiceConfig } from '../services/products-list-service.js';
import type { ProductsListSearchServiceConfig } from '../services/products-list-search-service.js';
import { useService } from '@wix/services-manager-react';
import { ProductsListServiceDefinition } from '../services/products-list-service.js';

enum TestIds {
  productListRoot = 'product-list-root',
  productListProducts = 'product-list-products',
  productListItem = 'product-list-item',
}

/**
 * Props for the ProductList root component following the documented API
 */
export interface ProductListRootProps {
  children?: React.ReactNode;
  products?: V3Product[];
  productsListConfig?: ProductsListServiceConfig;
  productsListSearchConfig?: ProductsListSearchServiceConfig;
  asChild?: boolean;
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
export function Root(props: ProductListRootProps): React.ReactNode {
  const { children, products, productsListConfig, productsListSearchConfig } =
    props;

  const serviceConfig = productsListConfig || {
    products: products || [],
    searchOptions: {
      cursorPaging: { limit: 10 },
    },
    pagingMetadata: {
      count: products?.length || 0,
    },
    aggregations: {}, // Empty aggregation data
  };

  return (
    <CoreProductList.Root
      productsListConfig={serviceConfig}
      productsListSearchConfig={productsListSearchConfig}
      data-testid={TestIds.productListRoot}
    >
      {children}
    </CoreProductList.Root>
  );
}

/**
 * Props for ProductList Raw component
 */
export interface RawProps
  extends AsChildProps<{
    totalProducts: number;
    displayedProducts: number;
    isFiltered: boolean;
  }> {}

/**
 * Raw component that provides direct access to product list data.
 * Similar to Product.Raw, this should only be used when you need custom access to list data.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.Raw asChild>
 *   {React.forwardRef(({totalProducts, displayedProducts, isFiltered, ...props}, ref) => (
 *     <div ref={ref} {...props} className="text-content-muted">
 *       Showing {displayedProducts} of {totalProducts} products
 *       {isFiltered && <span className="ml-2 text-brand-primary">(Filtered)</span>}
 *     </div>
 *   ))}
 * </ProductList.Raw>
 * ```
 */
export const Raw = React.forwardRef<HTMLElement, RawProps>((props, ref) => {
  const { asChild, children } = props;
  const productsListService = useService(ProductsListServiceDefinition);
  const products = productsListService.products.get();
  const pagingMetadata = productsListService.pagingMetadata.get();
  const displayedProducts = products.length;
  const totalProducts = pagingMetadata.count || products.length;
  const isFiltered = false; // TODO: Implement filtering detection

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { totalProducts, displayedProducts, isFiltered },
      ref,
      content: null,
      attributes: {},
    });
    if (rendered) return rendered;
  }

  // Raw component should not render anything by default when not using asChild
  return null;
});

/**
 * Props for ProductList Products component
 */
export interface ProductsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  infiniteScroll?: boolean;
  pageSize?: number;
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
    const { children, emptyState, infiniteScroll = true, pageSize = 0 } = props;
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
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
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
        <CoreProduct.Root
          key={product._id}
          productServiceConfig={{ product }}
          data-testid={TestIds.productListItem}
          data-product-id={product._id}
          data-product-available={true} // TODO: Add proper stock check when V3Product type includes stock info
        >
          {children}
        </CoreProduct.Root>
      ))}
    </>
  );
});
