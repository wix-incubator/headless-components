import type { V3Product } from '@wix/auto_sdk_stores_products-v-3';
import React from 'react';
import { renderAsChild, type AsChildProps } from '../utils/index.js';
import * as CoreProductList from './core/ProductList.js';
import * as CoreProductListSort from './core/ProductListSort.js';
import * as CoreProductListPagination from './core/ProductListPagination.js';
import * as CoreProduct from './core/Product.js';
import type { ProductsListServiceConfig } from '../services/products-list-service.js';
import type { ProductsListSearchServiceConfig } from '../services/products-list-search-service.js';

/**
 * Context for sharing product list state between components
 */
interface ProductListContextValue {
  hasProducts: boolean;
  products: V3Product[];
  totalProducts: number;
  displayedProducts: number;
  isFiltered: boolean;
}

const ProductListContext = React.createContext<ProductListContextValue | null>(
  null,
);

/**
 * Hook to access product list context
 */
export function useProductListContext(): ProductListContextValue {
  const context = React.useContext(ProductListContext);
  if (!context) {
    throw new Error(
      'useProductListContext must be used within a ProductList.Root component',
    );
  }
  return context;
}

enum TestIds {
  productListRoot = 'product-list-root',
  productListSorting = 'product-list-sorting', // Match interface spec
  productListSortOption = 'product-list-sort-option',
  productListFilters = 'product-list-filters',
  productListProducts = 'product-list-products',
  productListItem = 'product-list-item',
  productListLoadMore = 'product-list-load-more',
  productListTotals = 'product-list-totals', // Match interface spec
  productListInfo = 'product-list-info',
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
 * Root component that provides all necessary service contexts for a complete product list experience.
 * This composite component combines ProductList, ProductListSearch, ProductListSort, ProductListFilters,
 * and ProductListPagination functionality following the documented API patterns.
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
 *       <ProductList.Sort />
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
      asChild,
      children,
      products,
      productsListConfig,
      productsListSearchConfig,
      className,
    } = props;

    // If products are provided directly, use them; otherwise rely on service configuration
    const config = productsListConfig || {
      products: products || [],
      searchOptions: {},
      pagingMetadata: { count: products?.length || 0, hasNext: false },
      aggregations: {},
    };

    const searchConfig = productsListSearchConfig || {
      customizations: [],
      initialSearchState: {},
    };

    return (
      <CoreProductList.Root
        productsListConfig={config}
        productsListSearchConfig={searchConfig}
      >
        <CoreProductList.Items>
          {({ products: serviceProducts }) => {
            const productList = products || serviceProducts;
            const hasProducts = productList.length > 0;
            const totalProducts = productList.length;
            const displayedProducts = productList.length;
            const isFiltered = false; // TODO: Get from search service

            const contextValue: ProductListContextValue = {
              hasProducts,
              products: productList,
              totalProducts,
              displayedProducts,
              isFiltered,
            };

            const attributes = {
              'data-testid': TestIds.productListRoot,
              'data-filtered': isFiltered,
              'data-total': totalProducts,
              'data-displayed': displayedProducts,
            };

            const content = (
              <ProductListContext.Provider value={contextValue}>
                {children}
              </ProductListContext.Provider>
            );

            if (asChild) {
              const rendered = renderAsChild({
                children: () => content, // Wrap content in function for asChild
                props: { totalProducts, displayedProducts, isFiltered },
                ref,
                content,
                attributes,
              });
              if (rendered) return rendered;
            }

            return (
              <div
                className={className}
                {...attributes}
                ref={ref as React.Ref<HTMLDivElement>}
              >
                {content}
              </div>
            );
          }}
        </CoreProductList.Items>
      </CoreProductList.Root>
    );
  },
);

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
  const { totalProducts, displayedProducts, isFiltered } =
    useProductListContext();

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
 * Props for ProductList Sorting component (matches interface spec)
 */
export interface SortingProps
  extends AsChildProps<{
    sortingOptions: Array<{
      fieldName: 'name' | 'price' | 'date';
      label: string;
      order: 'asc' | 'desc';
    }>;
    onChange: (value: {
      fieldName: 'name' | 'price' | 'date';
      order: 'asc' | 'desc';
    }) => void;
    value: { fieldName: 'name' | 'price' | 'date'; order: 'asc' | 'desc' };
  }> {
  valueFormatter?: (value: { sortBy: string; sortDirection: string }) => string;
  as?: 'select' | 'list';
}

/**
 * Sorting component for product list with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ProductList.Sorting as="select" valueFormatter={({sortBy, sortDirection}) => `${sortBy} ${sortDirection}`} />
 *
 * // asChild with custom component
 * <ProductList.Sorting asChild>
 *   {React.forwardRef(({value, onChange, sortingOptions, ...props}, ref) => (
 *     <select ref={ref} {...props} onChange={(e) => onChange(JSON.parse(e.target.value))}>
 *       {sortingOptions.map(option => (
 *         <option key={`${option.fieldName}_${option.order}`} value={JSON.stringify(option)}>
 *           {option.label}
 *         </option>
 *       ))}
 *     </select>
 *   ))}
 * </ProductList.Sorting>
 * ```
 */
export const Sorting = React.forwardRef<HTMLElement, SortingProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      valueFormatter,
      as = 'select',
    } = props;

    return (
      <CoreProductListSort.Options>
        {({ selectedSortOption, updateSortOption, sortOptions }) => {
          // Transform core sort options to documented API format
          const sortingOptions = sortOptions.map((option) => ({
            fieldName: (option.toLowerCase().includes('price')
              ? 'price'
              : option.toLowerCase().includes('name')
                ? 'name'
                : 'date') as 'name' | 'price' | 'date',
            label: option,
            order: option.toLowerCase().includes('desc')
              ? ('desc' as const)
              : ('asc' as const),
          }));

          const currentValue = {
            fieldName: selectedSortOption.toLowerCase().includes('price')
              ? ('price' as const)
              : selectedSortOption.toLowerCase().includes('name')
                ? ('name' as const)
                : ('date' as const),
            order: selectedSortOption.toLowerCase().includes('desc')
              ? ('desc' as const)
              : ('asc' as const),
          };

          const handleChange = (value: {
            fieldName: 'name' | 'price' | 'date';
            order: 'asc' | 'desc';
          }) => {
            // Transform back to core format
            const coreValue = `${value.fieldName}_${value.order}`;
            updateSortOption(coreValue);
          };

          const attributes = {
            'data-testid': TestIds.productListSorting,
            'data-sorted-by': currentValue.fieldName,
            'data-sort-direction': currentValue.order,
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: {
                sortingOptions,
                onChange: handleChange,
                value: currentValue,
              },
              ref,
              content: null,
              attributes,
            });
            if (rendered) return rendered;
          }

          // Default rendering as select
          if (as === 'select') {
            return (
              <select
                className={className}
                {...attributes}
                ref={ref as React.Ref<HTMLSelectElement>}
                value={`${currentValue.fieldName}_${currentValue.order}`}
                onChange={(e) => {
                  const [fieldName, order] = e.target.value.split('_');
                  handleChange({
                    fieldName: fieldName as 'name' | 'price' | 'date',
                    order: order as 'asc' | 'desc',
                  });
                }}
              >
                {sortingOptions.map((option) => (
                  <option
                    key={`${option.fieldName}_${option.order}`}
                    value={`${option.fieldName}_${option.order}`}
                  >
                    {valueFormatter
                      ? valueFormatter({
                          sortBy: option.fieldName,
                          sortDirection: option.order,
                        })
                      : option.label}
                  </option>
                ))}
              </select>
            );
          }

          // List rendering - render options directly since SortingOption has issues with context
          return (
            <div
              className={className}
              {...attributes}
              ref={ref as React.Ref<HTMLDivElement>}
            >
              {sortingOptions.map((option) => (
                <button
                  key={`${option.fieldName}_${option.order}`}
                  className="sort-option"
                  data-testid={TestIds.productListSortOption}
                  data-selected={
                    currentValue.fieldName === option.fieldName &&
                    currentValue.order === option.order
                  }
                  onClick={() => handleChange(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          );
        }}
      </CoreProductListSort.Options>
    );
  },
);

/**
 * Props for ProductList SortingOption component (matches interface spec)
 */
export interface SortingOptionProps
  extends AsChildProps<{
    fieldName: 'name' | 'price' | 'date';
    order: 'asc' | 'desc';
    label: string;
    isSelected: boolean;
  }> {
  fieldName?: 'name' | 'price' | 'date';
  order?: 'asc' | 'desc';
  label?: string;
}

/**
 * Individual sorting option component.
 *
 * @component
 */
export const SortingOption = React.forwardRef<HTMLElement, SortingOptionProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const fieldName = props.fieldName || 'name';
    const order = props.order || 'asc';
    const label = props.label || '';

    return (
      <CoreProductListSort.Options>
        {({ selectedSortOption, updateSortOption }) => {
          const optionValue = `${fieldName}_${order}`;
          const isSelected = selectedSortOption === optionValue;

          const handleClick = () => {
            updateSortOption(optionValue);
          };

          const attributes = {
            'data-testid': TestIds.productListSortOption,
            'data-selected': isSelected,
            onClick: handleClick,
          };

          if (asChild) {
            const rendered = renderAsChild({
              children,
              props: { fieldName, order, label, isSelected },
              ref,
              content: label,
              attributes,
            });
            if (rendered) return rendered;
          }

          return (
            <button
              className={className}
              {...attributes}
              ref={ref as React.Ref<HTMLButtonElement>}
            >
              {label}
            </button>
          );
        }}
      </CoreProductListSort.Options>
    );
  },
);

/**
 * Props for ProductList Filters component
 */
export interface FiltersProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

/**
 * Container for product list filters and controls.
 * This component provides a Filter.Root context for child filter components.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.Filters className="flex gap-4">
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.SingleFilter />
 *       <Filter.MultiFilter />
 *       <Filter.RangeFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </ProductList.Filters>
 * ```
 */
export const Filters = React.forwardRef<HTMLElement, FiltersProps>(
  (props, ref) => {
    const { children, asChild, className } = props;

    const attributes = {
      'data-testid': TestIds.productListFilters,
    };

    if (asChild) {
      const rendered = renderAsChild({
        children: () => children,
        props: {},
        ref,
        content: children,
        attributes,
      });
      if (rendered) return rendered;
    }

    return (
      <div
        className={className}
        {...attributes}
        ref={ref as React.Ref<HTMLDivElement>}
      >
        {children}
      </div>
    );
  },
);

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
    const { hasProducts } = useProductListContext();

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
  const { hasProducts, products } = useProductListContext();

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

/**
 * Props for ProductList LoadMoreTrigger component
 */
export interface LoadMoreTriggerProps
  extends AsChildProps<{
    loadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
  }> {
  infiniteScroll?: boolean;
}

/**
 * Load more trigger component for pagination.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.LoadMoreTrigger asChild>
 *   <button>Load More Products</button>
 * </ProductList.LoadMoreTrigger>
 * ```
 */
export const LoadMoreTrigger = React.forwardRef<
  HTMLElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const { asChild, children, className, infiniteScroll = true } = props;

  return (
    <CoreProductListPagination.NextPageTrigger>
      {({ nextPage, hasNextPage }) => {
        const isLoading = false; // TODO: Get loading state from service
        if (!infiniteScroll || !hasNextPage) return null;

        const attributes = {
          'data-testid': TestIds.productListLoadMore,
          'data-has-more': hasNextPage,
          'data-loading': isLoading,
          onClick: nextPage,
          disabled: isLoading,
        };

        if (asChild) {
          const rendered = renderAsChild({
            children,
            props: { loadMore: nextPage, hasMore: hasNextPage, isLoading },
            ref,
            content: 'Load More',
            attributes,
          });
          if (rendered) return rendered;
        }

        return (
          <button
            className={className}
            {...attributes}
            ref={ref as React.Ref<HTMLButtonElement>}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        );
      }}
    </CoreProductListPagination.NextPageTrigger>
  );
});

/**
 * Totals namespace for count and displayed components
 */
export const Totals = {
  /**
   * Props for ProductList Totals Count component
   */
  Count: React.forwardRef<HTMLElement, AsChildProps<{ total: number }>>(
    (props, ref) => {
      const { asChild, children, className } = props;
      const { totalProducts } = useProductListContext();

      const attributes = {
        'data-testid': TestIds.productListTotals,
        'data-total': totalProducts,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: { total: totalProducts },
          ref,
          content: totalProducts.toString(),
          attributes,
        });
        if (rendered) return rendered;
      }

      return (
        <span
          className={className}
          {...attributes}
          ref={ref as React.Ref<HTMLSpanElement>}
        >
          {totalProducts}
        </span>
      );
    },
  ),

  /**
   * Props for ProductList Totals Displayed component
   */
  Displayed: React.forwardRef<HTMLElement, AsChildProps<{ displayed: number }>>(
    (props, ref) => {
      const { asChild, children, className } = props;
      const { displayedProducts } = useProductListContext();

      const attributes = {
        'data-testid': TestIds.productListTotals,
        'data-displayed': displayedProducts,
      };

      if (asChild) {
        const rendered = renderAsChild({
          children,
          props: { displayed: displayedProducts },
          ref,
          content: displayedProducts.toString(),
          attributes,
        });
        if (rendered) return rendered;
      }

      return (
        <span
          className={className}
          {...attributes}
          ref={ref as React.Ref<HTMLSpanElement>}
        >
          {displayedProducts}
        </span>
      );
    },
  ),

  /**
   * Total count component (alias for Count for API compatibility)
   */
  Total: React.forwardRef<HTMLElement, AsChildProps<{ total: number }>>(
    (props, ref) => {
      return <Totals.Count {...props} ref={ref} />;
    },
  ),
};

// Aliases for backward compatibility and API flexibility
export const Sort = Sorting;
export const SortOption = SortingOption;

/**
 * Props for ProductList Info component
 */
export interface InfoProps
  extends AsChildProps<{
    totalProducts: number;
    displayedProducts: number;
    isFiltered: boolean;
  }> {}

/**
 * Info component that displays product list information.
 *
 * @component
 * @example
 * ```tsx
 * <ProductList.Info asChild>
 *   {({ totalProducts, displayedProducts, isFiltered }) => (
 *     <div>
 *       Showing {displayedProducts} of {totalProducts} products
 *       {isFiltered && ' (filtered)'}
 *     </div>
 *   )}
 * </ProductList.Info>
 * ```
 */
export const Info = React.forwardRef<HTMLElement, InfoProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { totalProducts, displayedProducts, isFiltered } =
    useProductListContext();

  const attributes = {
    'data-testid': TestIds.productListInfo,
    'data-total': totalProducts,
    'data-displayed': displayedProducts,
    'data-filtered': isFiltered,
  };

  const defaultContent = `Showing ${displayedProducts} of ${totalProducts} products${isFiltered ? ' (filtered)' : ''}`;

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { totalProducts, displayedProducts, isFiltered },
      ref,
      content: defaultContent,
      attributes,
    });
    if (rendered) return rendered;
  }

  return (
    <div
      className={className}
      {...attributes}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      {defaultContent}
    </div>
  );
});
