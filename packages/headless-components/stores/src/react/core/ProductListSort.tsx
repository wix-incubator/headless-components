import { useService } from "@wix/services-manager-react";
import { ProductsListServiceDefinition } from "../../services/products-list-service.js";
import { Sort as SortPrimitive } from "@wix/headless-components/react";
import { productsV3 } from '@wix/stores';

export interface ProductListSortProps {
  children: (props: {
    currentSort: productsV3.V3ProductSearch["sort"];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: productsV3.V3ProductSearch["sort"]) => void;
  }) => React.ReactNode;
}
  
export const ProductListSort = (props: ProductListSortProps) => {
  const productListService = useService(ProductsListServiceDefinition);
  const currentSort = productListService.searchOptions.get().sort;

  // Define sort options - primitive handles all conversion logic
  const sortOptions = [
    { fieldName: "name", order: "ASC" as const, label: "Name (A-Z)" },
    { fieldName: "name", order: "DESC" as const, label: "Name (Z-A)" },
    {
      fieldName: "actualPriceRange.minValue.amount",
      order: "ASC" as const,
      label: "Price: Low to High"
    },
    {
      fieldName: "actualPriceRange.minValue.amount",
      order: "DESC" as const,
      label: "Price: High to Low"
    },
    {
      fieldName: "name",
      order: "DESC" as const,
      label: "Latest Arrivals"
    },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: (sort: productsV3.V3ProductSearch["sort"]) => {
      productListService.setSort(sort);
    }
  })
}

