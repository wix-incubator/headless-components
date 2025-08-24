import { useService } from '@wix/services-manager-react';
import type { ReactNode } from 'react';
import {
  ProductsListServiceDefinition,
  type ProductOption,
  type ProductChoice,
  InventoryStatusType,
  CategoriesListServiceDefinition,
} from '../../services/index.js';
import { Category } from '@wix/auto_sdk_categories_categories';
import { useMemo } from 'react';
import {
  Filter as FilterPrimitive,
  type FilterOption,
} from '@wix/headless-components/react';
import type { productsV3 } from '@wix/stores';
import { Slot } from '@radix-ui/react-slot';
import React from 'react';

// Conversion utilities for platform compatibility
function getInventoryStatusLabel(status: InventoryStatusType): string {
  switch (status) {
    case InventoryStatusType.IN_STOCK:
      return 'In Stock';
    case InventoryStatusType.OUT_OF_STOCK:
      return 'Out of Stock';
    case InventoryStatusType.PARTIALLY_OUT_OF_STOCK:
      return 'Limited Stock';
    default:
      return String(status);
  }
}

function buildSearchFilterData(
  availableOptions: ProductOption[],
  availableInventoryStatuses: InventoryStatusType[],
  availableMinPrice: number,
  availableMaxPrice: number,
): { filterOptions: FilterOption[] } {
  // Build consolidated filter options using search field names
  const filterOptions: FilterOption[] = [
    // Price range - use a logical key that maps to both min/max fields
    {
      key: 'priceRange',
      label: 'Price Range',
      type: 'range',
      displayType: 'range',
      validValues: [availableMinPrice, availableMaxPrice],
      valueFormatter: (value: string | number) => `$${value}`,
      fieldName: [
        'actualPriceRange.minValue.amount',
        'actualPriceRange.maxValue.amount',
      ],
    },

    // Product options (colors, sizes, etc.) - individual filters for each option type
    ...availableOptions.map((option) => ({
      key: option.id,
      label: String(option.name),
      type: 'multi' as const,
      displayType:
        option.optionRenderType === 'SWATCH_CHOICES'
          ? ('color' as const)
          : ('text' as const),
      fieldName: 'options.choicesSettings.choices.choiceId',
      fieldType: 'array' as const,
      validValues: option.choices.map((choice: ProductChoice) => choice.id),
      valueFormatter: (value: string | number) => {
        const choice = option.choices.find(
          (c: ProductChoice) => c.id === value,
        );
        const name = choice?.name || String(value);
        return option.optionRenderType === 'SWATCH_CHOICES'
          ? name.toLowerCase()
          : name;
      },
    })),

    // Inventory status - use actual search field name
    {
      key: 'inventory.availabilityStatus',
      label: 'Availability',
      type: 'multi',
      displayType: 'text',
      fieldName: 'inventory.availabilityStatus',
      fieldType: 'singular' as const,
      validValues: availableInventoryStatuses,
      valueFormatter: (value: string | number) =>
        getInventoryStatusLabel(value as InventoryStatusType),
    },
  ];

  return { filterOptions };
}

/**
 * Props for ResetTrigger headless component
 */
export interface ResetTriggerProps {
  /** Content to display (can be a render function receiving reset controls or ReactNode) */
  children: ((props: ResetTriggerRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for ResetTrigger component
 */
export interface ResetTriggerRenderProps {
  /** Function to reset all filters */
  resetFilters: () => void;
  /** Whether any filters are currently applied */
  isFiltered: boolean;
}

/**
 * Headless component for resetting all filters
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList, ProductListFilters } from '@wix/stores/components';
 *
 * function ResetFiltersButton() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListFilters.ResetTrigger>
 *         {({ resetFilters, isFiltered }) => (
 *           <button
 *             onClick={resetFilters}
 *             disabled={!isFiltered}
 *             className={isFiltered ? 'active' : 'disabled'}
 *           >
 *             {isFiltered ? 'Clear Filters' : 'No Filters Applied'}
 *           </button>
 *         )}
 *       </ProductListFilters.ResetTrigger>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function ResetTrigger(props: ResetTriggerProps) {
  const service = useService(ProductsListServiceDefinition);
  const resetFilters = service.resetFilter;
  const isFiltered = service.isFiltered().get();

  return typeof props.children === 'function'
    ? props.children({ resetFilters, isFiltered })
    : props.children;
}

export interface CategoryFilterRenderProps {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export interface CategoryFilterProps {
  /** Content to display (can be a render function receiving category data or ReactNode) */
  children: ((props: CategoryFilterRenderProps) => ReactNode) | ReactNode;
}

export function CategoryFilter(props: CategoryFilterProps) {
  const categoriesService = useService(CategoriesListServiceDefinition);
  const categories = categoriesService.categories.get();
  const productListService = useService(ProductsListServiceDefinition);

  const setSelectedCategory = (category: Category | null) => {
    const currentFilter = productListService.searchOptions.get().filter || {};
    if (!category) {
      delete (currentFilter as any)['allCategoriesInfo.categories'];
      productListService.setFilter(currentFilter);
      return;
    }

    productListService.setFilter({
      ...currentFilter,
      'allCategoriesInfo.categories': {
        $matchItems: [{ id: { $in: [category._id!] } }],
      },
    });
  };

  const selectedCategoryId = (
    productListService.searchOptions.get().filter as any
  )['allCategoriesInfo.categories']?.$matchItems?.[0]?.id
    ?.$in?.[0] as Category | null;
  const selectedCategory =
    categories?.find((c) => c._id === selectedCategoryId) || null;

  return typeof props.children === 'function'
    ? props.children({ selectedCategory, setSelectedCategory })
    : props.children;
}

/**
 * Props for AllFilters consolidated headless component
 */
interface AllFiltersProps {
  /** Content to display (can be a render function receiving all filter data or ReactNode) */
  children: ((props: AllFiltersRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for AllFilters component - provides platform-compatible filter data
 */
interface AllFiltersRenderProps {
  searchFilter: {
    /** Current filter values in search format */
    filterValue: productsV3.V3ProductSearch['filter'];
    /** Filter options configuration for filter components */
    filterOptions: FilterOption[];
    /** Update filters using search format */
    updateFilter: (newFilter: productsV3.V3ProductSearch['filter']) => void;
    /** Clear all filters */
    clearFilters: () => void;
    /** Whether any filters are currently applied */
    hasFilters: boolean;
  };
}

/**
 * Internal component that provides filter data for the Filter component.
 * Consolidates data from both search and list services.
 */
function AllFilters(props: AllFiltersProps) {
  const listService = useService(ProductsListServiceDefinition);

  // Get current filter state
  const currentSearchOptions = listService.searchOptions.get();
  const currentFilter = currentSearchOptions.filter;

  // Get available filter data
  const availableOptions = listService.availableProductOptions.get();
  const availableInventoryStatuses =
    listService.availableInventoryStatuses.get();
  const availableMinPrice = listService.minPrice.get();
  const availableMaxPrice = listService.maxPrice.get();

  // Get filter state
  const resetFilters = listService.resetFilter;
  const isFiltered = listService.isFiltered().get();

  // Build filter options and handlers
  const searchFilterData = useMemo(() => {
    const { filterOptions } = buildSearchFilterData(
      availableOptions,
      availableInventoryStatuses,
      availableMinPrice,
      availableMaxPrice,
    );

    const updateFilter = (newFilter: productsV3.V3ProductSearch['filter']) => {
      listService.setFilter(newFilter);
    };

    return {
      filterValue: currentFilter,
      filterOptions,
      updateFilter,
      clearFilters: resetFilters,
      hasFilters: isFiltered,
    };
  }, [
    availableOptions,
    availableInventoryStatuses,
    availableMinPrice,
    availableMaxPrice,
    currentFilter,
    resetFilters,
    isFiltered,
    listService,
  ]);

  return typeof props.children === 'function'
    ? props.children({ searchFilter: searchFilterData })
    : props.children;
}

interface FilterProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export const Filter = React.forwardRef<HTMLDivElement, FilterProps>(
  ({ children, className, asChild }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <AllFilters>
        {({ searchFilter }) => {
          return (
            <FilterPrimitive.Root
              value={searchFilter.filterValue!}
              onChange={searchFilter.updateFilter}
              filterOptions={searchFilter.filterOptions}
            >
              <Comp className={className} ref={ref}>
                {children}
              </Comp>
            </FilterPrimitive.Root>
          );
        }}
      </AllFilters>
    );
  },
);
