import { useService } from '@wix/services-manager-react';
import { ProductsListServiceDefinition } from '../../services/products-list-service.js';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { productsV3 } from '@wix/stores';

export interface ProductListSortProps {
  children: (props: {
    currentSort: productsV3.V3ProductSearch['sort'];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: productsV3.V3ProductSearch['sort']) => void;
  }) => React.ReactNode;
}

export const ProductListSort = (props: ProductListSortProps) => {
  const productListService = useService(ProductsListServiceDefinition);
  const currentSort = productListService.searchOptions.get().sort;

  // Define sort options - primitive handles all conversion logic
  const sortOptions = [
    { fieldName: 'name', order: 'ASC' as const, label: 'Name (A-Z)' },
    { fieldName: 'name', order: 'DESC' as const, label: 'Name (Z-A)' },
    {
      fieldName: 'actualPriceRange.minValue.amount',
      order: 'ASC' as const,
      label: 'Price: Low to High',
    },
    {
      fieldName: 'actualPriceRange.minValue.amount',
      order: 'DESC' as const,
      label: 'Price: High to Low',
    },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: (sort: productsV3.V3ProductSearch['sort']) => {
      productListService.setSort(sort);
    },
  });
};

export interface ProductListSeperateSortProps {
  children: (props: {
    currentSort: productsV3.V3ProductSearch['sort'];
    sortFieldOptions: SortPrimitive.SortOption[];
    sortOrderOptions: SortPrimitive.SortOption[];
    setSort: (sort: productsV3.V3ProductSearch['sort']) => void;
  }) => React.ReactNode;
}
export function ProductListSeperateSort(props: ProductListSeperateSortProps) {
  const productListService = useService(ProductsListServiceDefinition);
  const currentSort = productListService.searchOptions.get().sort;

  // Define sort options - primitive handles all conversion logic
  const sortFieldOptions = [
    { fieldName: 'name', label: 'Name' },
    {
      fieldName: 'actualPriceRange.minValue.amount',
      label: 'Price',
    },
  ];

  const sortOrderOptions = [
    { order: 'ASC' as const, label: 'Ascending' },
    { order: 'DESC' as const, label: 'Descending' },
  ];

  return props.children({
    currentSort,
    sortFieldOptions,
    sortOrderOptions,
    setSort: (sort: productsV3.V3ProductSearch['sort']) => {
      productListService.setSort(sort);
    },
  });
}
