import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import {
  Sort as SortPrimitive,
  GenericListTotalsRenderProps,
  GenericListLoadMoreRenderProps,
  GenericList,
  ListVariant,
} from '@wix/headless-components/react';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import type { ProductsListServiceConfig } from '../services/products-list-service.js';
import { ProductsListServiceDefinition } from '../services/products-list-service.js';
import { productsV3 } from '@wix/stores';

import * as CoreProductList from './core/ProductList.js';
import { ProductListSort as ProductListSortPrimitive } from './core/ProductListSort.js';
import * as CoreProductListFilters from './core/ProductListFilters.js';
import * as Product from './Product.js';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { DataComponentTags } from '../data-component-tags.js';

enum TestIds {
  productListRoot = 'product-list-root',
  productListProducts = 'product-list-products',
  productListItem = 'product-list-item',
  productListLoadMore = 'product-list-load-more',
  productListTotalsDisplayed = 'product-list-totals-displayed',
  productListSort = 'product-list-sort',
  productListFilter = 'product-list-filter',
  productListFilterResetTrigger = 'product-list-filter-reset-trigger',
  productListError = 'product-list-error',
}

/**
 * Props for the ProductList root component following the documented API
 */
export interface ProductListRootProps {
  children: React.ReactNode;
  products?: V3Product[];
  productsListConfig?: ProductsListServiceConfig;
  className?: string;
  variant?: ListVariant;
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
    const { children, products, productsListConfig, className, variant } =
      props;

    const serviceConfig = productsListConfig || {
      products: products || [],
      searchOptions: {
        cursorPaging: { limit: 10 },
      },
      pagingMetadata: {
        count: products?.length || 0,
      },
      aggregations: {
        results: [],
      }, // Empty aggregation data
      customizations: [],
    };

    return (
      <CoreProductList.Root productsListConfig={serviceConfig}>
        <RootContent
          children={children as any}
          className={className}
          ref={ref}
          variant={variant}
        />
      </CoreProductList.Root>
    );
  },
);

Root.displayName = 'ProductList.Root';

/**
 * Internal component to handle the Root content with service access
 */
const RootContent = React.forwardRef<
  HTMLElement,
  {
    children?: any;
    className?: string;
    variant?: ListVariant;
  }
>((props, ref) => {
  const { children, className, variant } = props;
  const productsListService = useService(ProductsListServiceDefinition);

  const items = productsListService.products.get().map((product) => ({
    ...product,
    id: product._id!,
  }));

  return (
    <GenericList.Root
      items={items}
      loadMore={() => productsListService.loadMore(10)}
      hasMore={productsListService.hasMoreProducts.get()}
      isLoading={productsListService.isLoading.get()}
      className={className}
      ref={ref}
      data-component-tag={DataComponentTags.productListRoot}
      data-testid={TestIds.productListRoot}
      variant={variant}
    >
      {children}
    </GenericList.Root>
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
    const { children, ...otherProps } = props;

    return (
      <GenericList.Items
        ref={ref}
        data-testid={TestIds.productListProducts}
        {...otherProps}
      >
        {children as React.ReactNode}
      </GenericList.Items>
    );
  },
);

/**
 * Render props for ProductRepeater asChild pattern
 */
export interface ProductRepeaterRenderProps {
  items: (V3Product & { id: string })[];
  variant?: ListVariant;
  itemRenderer: (
    item: V3Product & { id: string },
    index: number,
  ) => React.ReactNode;
}

/**
 * Props for ProductList ProductRepeater component
 */
export interface ProductRepeaterProps {
  children:
    | React.ReactNode
    | ((
        props: ProductRepeaterRenderProps,
        ref: React.Ref<HTMLElement>,
      ) => React.ReactNode);
  /** Whether to render as child component (asChild pattern) */
  asChild?: boolean;
}

/**
 * Repeater component that renders Product.Root for each product.
 * Follows Repeater Level pattern and uses GenericList.Repeater for consistency.
 * Supports asChild pattern for advanced layout components like GalleryWrapper.
 *
 * @component
 * @example
 * ```tsx
 * // Standard usage
 * <ProductList.ProductRepeater>
 *   <Product.Name />
 *   <Product.Price />
 * </ProductList.ProductRepeater>
 *
 * // AsChild usage with GalleryWrapper
 * <ProductList.ProductRepeater asChild>
 *   {({ items, variant, itemRenderer }) => (
 *     <GalleryWrapper
 *       items={items}
 *       variant={variant}
 *       itemRenderer={itemRenderer}
 *     />
 *   )}
 * </ProductList.ProductRepeater>
 * ```
 */
export const ProductRepeater = React.forwardRef<
  HTMLElement,
  ProductRepeaterProps
>((props, ref) => {
  const { children, asChild = false } = props;

  return (
    <GenericList.Repeater
      ref={ref}
      asChild={asChild}
      renderItem={(
        product: V3Product & { id: string },
        children: React.ReactNode,
      ) => (
        <Product.Root
          key={product._id}
          product={product}
          data-testid={TestIds.productListItem}
          data-product-id={product._id}
          data-product-available={true}
          data-item-id={product._id}
        >
          {children}
        </Product.Root>
      )}
    >
      {children as any}
    </GenericList.Repeater>
  );
});

/**
 * Props for ProductList LoadMoreTrigger component
 */
export interface LoadMoreTriggerProps {
  /** Custom render function when using asChild */
  children?:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLButtonElement,
        GenericListLoadMoreRenderProps
      >;
  /**
   * Whether to render as a child component.
   * @default false
   */
  asChild?: boolean;
  /**
   * The CSS classes to apply to the button.
   */
  className?: string;

  /**
   * The label to display inside the button.
   */
  label?: string;

  /**
   * The loading state to display inside the button.
   */
  loadingState?: React.ReactNode;
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
  HTMLButtonElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const { children = <button />, ...otherProps } = props;

  return (
    <GenericList.Actions.LoadMore
      ref={ref}
      data-testid={TestIds.productListLoadMore}
      {...otherProps}
    >
      {children as React.ReactNode}
    </GenericList.Actions.LoadMore>
  );
});

/**
 * Props for ProductList Totals Displayed component
 */
export interface TotalsDisplayedProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<GenericListTotalsRenderProps>;
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
 *   {({ displayedItems }, ref) => <strong ref={ref}>{displayedItems}</strong>}
 * </ProductList.TotalsDisplayed>
 * ```
 */
export const TotalsDisplayed = React.forwardRef<
  HTMLElement,
  TotalsDisplayedProps
>((props, ref) => {
  const { children = <span />, ...otherProps } = props;

  return (
    <GenericList.Totals
      ref={ref}
      data-testid={TestIds.productListTotalsDisplayed}
      {...otherProps}
    >
      {children as React.ReactNode}
    </GenericList.Totals>
  );
});

/**
 * Props for the ProductList Sort component
 */
export interface SortProps {
  /**
   * Render function that provides sort state and controls when using asChild pattern.
   * Only called when asChild is true and children is provided.
   *
   * @param props.currentSort - Current sort configuration from Wix Stores API
   * @param props.sortOptions - Available sort options with field names, order, and labels
   * @param props.setSort - Function to update the sort configuration
   *
   * @example
   * ```tsx
   * <ProductList.Sort asChild>
   *   {({ currentSort, sortOptions, setSort }) => (
   *     <CustomSortSelect
   *       value={currentSort}
   *       options={sortOptions}
   *       onChange={setSort}
   *     />
   *   )}
   * </ProductList.Sort>
   * ```
   */
  children?: (props: {
    currentSort: productsV3.V3ProductSearch['sort'];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: productsV3.V3ProductSearch['sort']) => void;
  }) => React.ReactNode;

  /**
   * CSS classes to apply to the sort component.
   * Only used when asChild is false (default rendering).
   */
  className?: string;

  /**
   * Render mode for the default sort component.
   * - 'select': Renders as HTML select dropdown
   * - 'list': Renders as clickable list of options
   *
   * @default 'select'
   */
  as?: 'select' | 'list';

  /**
   * When true, the component uses the asChild pattern and delegates
   * rendering to the children render function. When false (default),
   * renders the built-in Sort.Root component.
   *
   * @default false
   */
  asChild?: boolean;
}

/**
 * Sort component for product lists that provides sorting functionality.
 *
 * This component integrates with the ProductList service to provide predefined sort options
 * including name (A-Z, Z-A) and price (low to high, high to low). It supports both
 * controlled rendering via the asChild pattern and default UI rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <ProductList.Sort />
 *
 * // As list of clickable options
 * <ProductList.Sort as="list" />
 *
 * // With custom styling
 * <ProductList.Sort
 *   as="select"
 *   className="custom-sort-select"
 * />
 *
 * // Custom implementation using asChild pattern
 * <ProductList.Sort asChild>
 *   {({ currentSort, sortOptions, setSort }) => (
 *     <div className="custom-sort-container">
 *       {sortOptions.map((option) => (
 *         <button
 *           key={`${option.fieldName}-${option.order}`}
 *           onClick={() => setSort([{ fieldName: option.fieldName, order: option.order }])}
 *           className={isCurrentSort(option) ? 'active' : ''}
 *         >
 *           {option.label}
 *         </button>
 *       ))}
 *     </div>
 *   )}
 * </ProductList.Sort>
 * ```
 *
 * @see {@link ProductListSortPrimitive} for the underlying sort logic
 * @see {@link SortPrimitive.Root} for the primitive sort component
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>(
  ({ children, className, as, asChild }, ref) => {
    return (
      <ProductListSortPrimitive>
        {({ currentSort, sortOptions, setSort }) => {
          if (asChild && children) {
            return children({ currentSort, sortOptions, setSort });
          }

          return (
            <SortPrimitive.Root
              ref={ref}
              value={currentSort}
              onChange={(value) => {
                setSort(value as productsV3.V3ProductSearch['sort']);
              }}
              sortOptions={sortOptions}
              as={as}
              className={className}
              data-testid={TestIds.productListSort}
            ></SortPrimitive.Root>
          );
        }}
      </ProductListSortPrimitive>
    );
  },
);

/**
 * Props for ProductList Filter component
 */
export interface FilterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to filter functionality */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Filter component that provides comprehensive filtering functionality for product lists.
 * This component acts as a provider that integrates with the ProductList service.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ProductList.Filter.Root className="filter-container">
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.MultiFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </ProductList.Filter.Root>
 *
 * // With custom container using asChild
 * <ProductList.Filter.Root asChild>
 *   <aside className="filter-sidebar">
 *     <Filter.FilterOptions>
 *       <Filter.FilterOptionRepeater>
 *         <Filter.FilterOption.Label />
 *         <Filter.FilterOption.MultiFilter />
 *       </Filter.FilterOptionRepeater>
 *     </Filter.FilterOptions>
 *   </aside>
 * </ProductList.Filter.Root>
 * ```
 */
const FilterRoot = React.forwardRef<HTMLElement, FilterProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreProductListFilters.FilterRoot asChild={asChild} className={className}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.productListFilter}
        customElement={children}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreProductListFilters.FilterRoot>
  );
});

FilterRoot.displayName = 'ProductList.Filter';

export const Filter = {
  Root: FilterRoot,
};

/**
 * Props for ProductList FilterResetTrigger component
 */
export interface FilterResetTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    resetFilters: () => void;
    isFiltered: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the button */
  label?: string;
}

/**
 * Reset trigger component for clearing all applied filters.
 * Provides reset functionality and filter state to custom render functions.
 * Only renders when filters are applied.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ProductList.FilterResetTrigger className="reset-filters-btn" />
 *
 * // With custom label
 * <ProductList.FilterResetTrigger label="Clear Filters" />
 *
 * // Custom rendering with forwardRef
 * <ProductList.FilterResetTrigger asChild>
 *   {React.forwardRef(({resetFilters, isFiltered, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={resetFilters}
 *       disabled={!isFiltered}
 *       className="custom-reset-button disabled:opacity-50"
 *     >
 *       Reset All Filters
 *     </button>
 *   ))}
 * </ProductList.FilterResetTrigger>
 * ```
 */
export const FilterResetTrigger = React.forwardRef<
  HTMLButtonElement,
  FilterResetTriggerProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const label = props.label || 'Reset All Filters';

  return (
    <CoreProductListFilters.ResetTrigger>
      {({ resetFilters, isFiltered }) => {
        if (!isFiltered) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onClick={resetFilters}
            disabled={!isFiltered}
            data-testid={TestIds.productListFilterResetTrigger}
            data-filtered={isFiltered ? 'true' : 'false'}
            customElement={children}
            customElementProps={{
              resetFilters,
              isFiltered,
            }}
            content={label}
            {...otherProps}
          >
            <button disabled={!isFiltered}>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreProductListFilters.ResetTrigger>
  );
});

FilterResetTrigger.displayName = 'ProductList.FilterResetTrigger';

/**
 * Props for ProductList Error component
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    error: string | null;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Error component that displays product list errors.
 * Provides error data to custom render functions.
 * Only renders when there's an error.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ProductList.Error className="error-message" />
 *
 * // Custom rendering with forwardRef
 * <ProductList.Error asChild>
 *   {React.forwardRef(({error, ...props}, ref) => (
 *     <div
 *       ref={ref}
 *       {...props}
 *       className="custom-error-container"
 *     >
 *       Error: {error}
 *     </div>
 *   ))}
 * </ProductList.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreProductList.Error>
      {({ error }) => {
        if (!error) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.productListError}
            data-error={error}
            customElement={children}
            customElementProps={{
              error,
            }}
            content={error}
            {...otherProps}
          >
            <div className="text-status-error text-sm sm:text-base">
              {error}
            </div>
          </AsChildSlot>
        );
      }}
    </CoreProductList.Error>
  );
});

Error.displayName = 'ProductList.Error';
