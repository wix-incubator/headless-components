import { useService } from "@wix/services-manager-react";
import type { ReactNode } from "react";
import {
  ProductsListSearchServiceDefinition,
  type ProductOption,
  InventoryStatusType,
} from "../services/products-list-search-service.js";
import { Category } from "@wix/auto_sdk_categories_categories";

/**
 * Props for InventoryStatus headless component
 */
export interface InventoryStatusProps {
  /** Content to display (can be a render function receiving inventory status controls or ReactNode) */
  children: ((props: InventoryStatusRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for InventoryStatus component
 */
export interface InventoryStatusRenderProps {
  /** Available inventory status options */
  availableInventoryStatuses: InventoryStatusType[];
  /** Currently selected inventory statuses */
  selectedInventoryStatuses: InventoryStatusType[];
  /** Function to toggle an inventory status filter */
  toggleInventoryStatus: (status: InventoryStatusType) => void;
}

/**
 * Headless component for managing inventory status filters
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList, ProductListFilters } from '@wix/stores/components';
 *
 * function InventoryStatusFilter() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListFilters.InventoryStatus>
 *         {({ availableInventoryStatuses, selectedInventoryStatuses, toggleInventoryStatus }) => (
 *           <div>
 *             <h4>Inventory Status:</h4>
 *             {availableInventoryStatuses.map(status => (
 *               <label key={status}>
 *                 <input
 *                   type="checkbox"
 *                   checked={selectedInventoryStatuses.includes(status)}
 *                   onChange={() => toggleInventoryStatus(status)}
 *                 />
 *                 {status}
 *               </label>
 *             ))}
 *           </div>
 *         )}
 *       </ProductListFilters.InventoryStatus>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function InventoryStatus(props: InventoryStatusProps) {
  const service = useService(ProductsListSearchServiceDefinition);
  const availableInventoryStatuses = service.availableInventoryStatuses.get();
  const selectedInventoryStatuses = service.selectedInventoryStatuses.get();
  const toggleInventoryStatus = service.toggleInventoryStatus;

  return typeof props.children === "function"
    ? props.children({
        availableInventoryStatuses,
        selectedInventoryStatuses,
        toggleInventoryStatus,
      })
    : props.children;
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
  const service = useService(ProductsListSearchServiceDefinition);
  const resetFilters = service.reset;
  const isFiltered = service.isFiltered.get();

  return typeof props.children === "function"
    ? props.children({ resetFilters, isFiltered })
    : props.children;
}

/**
 * Props for PriceRange headless component
 */
export interface PriceRangeProps {
  /** Content to display (can be a render function receiving price range controls or ReactNode) */
  children: ((props: PriceRangeRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for PriceRange component
 */
export interface PriceRangeRenderProps {
  /** Current minimum price filter value */
  selectedMinPrice: number;
  /** Current maximum price filter value */
  selectedMaxPrice: number;
  /** Catalog minimum price */
  availableMinPrice: number;
  /** Catalog maximum price */
  availableMaxPrice: number;
  /** Function to update the minimum price filter */
  setSelectedMinPrice: (minPrice: number) => void;
  /** Function to update the maximum price filter */
  setSelectedMaxPrice: (maxPrice: number) => void;
}

/**
 * Headless component for managing price range filters (combined min/max)
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList, ProductListFilters } from '@wix/stores/components';
 *
 * function PriceRangeFilter() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListFilters.PriceRange>
 *         {({ minPrice, maxPrice, setSelectedMinPrice, setSelectedMaxPrice }) => (
 *           <div className="price-range">
 *             <h4>Price Range:</h4>
 *             <div className="price-inputs">
 *               <input
 *                 type="number"
 *                 value={minPrice}
 *                 onChange={(e) => setSelectedMinPrice(Number(e.target.value))}
 *                 placeholder="Min"
 *               />
 *               <span>to</span>
 *               <input
 *                 type="number"
 *                 value={maxPrice}
 *                 onChange={(e) => setSelectedMaxPrice(Number(e.target.value))}
 *                 placeholder="Max"
 *               />
 *             </div>
 *           </div>
 *         )}
 *       </ProductListFilters.PriceRange>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function PriceRange(props: PriceRangeProps) {
  const service = useService(ProductsListSearchServiceDefinition);

  const selectedMinPrice = service.selectedMinPrice.get();
  const selectedMaxPrice = service.selectedMaxPrice.get();

  const availableMinPrice = service.availableMinPrice.get();
  const availableMaxPrice = service.availableMaxPrice.get();

  const setSelectedMinPrice = service.setSelectedMinPrice;
  const setSelectedMaxPrice = service.setSelectedMaxPrice;

  return typeof props.children === "function"
    ? props.children({
        availableMinPrice,
        selectedMinPrice,
        selectedMaxPrice,
        availableMaxPrice,
        setSelectedMinPrice,
        setSelectedMaxPrice,
      })
    : props.children;
}

export interface CategoryFilterRenderProps {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category) => void;
}

export interface CategoryFilterProps {
  /** Content to display (can be a render function receiving category data or ReactNode) */
  children: ((props: CategoryFilterRenderProps) => ReactNode) | ReactNode;
}

export function CategoryFilter(props: CategoryFilterProps) {
  const service = useService(ProductsListSearchServiceDefinition);
  const selectedCategory = service.selectedCategory.get();
  const setSelectedCategory = service.setSelectedCategory;

  return typeof props.children === "function"
    ? props.children({ selectedCategory, setSelectedCategory })
    : props.children;
}

/**
 * Props for ProductOptions headless component
 */
export interface ProductOptionsProps {
  /** Content to display (can be a render function receiving product option data or ReactNode) */
  children: ((props: ProductOptionRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for ProductOption component
 */
export interface ProductOptionRenderProps {
  /** Product option data */
  option: ProductOption;
  /** Currently selected choice IDs for this option */
  selectedChoices: string[];
  /** Function to toggle a choice selection */
  toggleChoice: (choiceId: string) => void;
}

/**
 * Headless component that renders content for each product option in the list.
 * Maps over all available product options and provides each option through a render prop.
 * Only renders when options are available (not loading, no error, and has options).
 * This follows the same collection pattern as ProductList.ItemContent and CategoryList.ItemContent.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductList, ProductListFilters } from '@wix/stores/components';
 *
 * function ProductOptionsFilter() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListFilters.ProductOptions>
 *         {({ option, selectedChoices, toggleChoice }) => (
 *           <div key={option.id}>
 *             <h4>{option.name}</h4>
 *             {option.choices.map(choice => (
 *               <label key={choice.id}>
 *                 <input
 *                   type="checkbox"
 *                   checked={selectedChoices.includes(choice.id)}
 *                   onChange={() => toggleChoice(choice.id)}
 *                 />
 *                 {choice.name}
 *               </label>
 *             ))}
 *           </div>
 *         )}
 *       </ProductListFilters.ProductOptions>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function ProductOptions(props: ProductOptionsProps) {
  const service = useService(ProductsListSearchServiceDefinition);
  const availableOptions = service.availableProductOptions.get();
  const selectedProductOptions = service.selectedProductOptions.get();

  // Don't render if no options are available
  if (availableOptions.length === 0) {
    return null;
  }

  // Map over options and create render prop for each
  return (
    <>
      {availableOptions.map((option) => {
        const selectedChoices = selectedProductOptions[option.id] || [];
        const toggleChoice = (choiceId: string) => {
          service.toggleProductOption(option.id, choiceId);
        };

        return typeof props.children === "function"
          ? props.children({ option, selectedChoices, toggleChoice })
          : props.children;
      })}
    </>
  );
}
