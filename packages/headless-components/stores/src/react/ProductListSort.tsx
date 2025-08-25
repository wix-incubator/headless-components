import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { productsV3 } from '@wix/stores';
import { ProductListSort as ProductListSortPrimitive } from './core/ProductListSort.js';
import React from 'react';

export interface ProductListSortProps {
  children?: (props: {
    currentSort: productsV3.V3ProductSearch['sort'];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: productsV3.V3ProductSearch['sort']) => void;
  }) => React.ReactNode;
  className?: string;
  as?: 'select' | 'list';
  asChild?: boolean;
}

export const ProductListSort = React.forwardRef<
  HTMLElement,
  ProductListSortProps
>(({ children, className, as, asChild }, ref) => {
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
          ></SortPrimitive.Root>
        );
      }}
    </ProductListSortPrimitive>
  );
});
