import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import type { ReactNode } from "react";
import {
  ProductsListFiltersService,
  ProductsListFiltersServiceDefinition,
  InventoryStatusType,
  type ProductOption,
  ProductsListFiltersServiceConfig,
} from "../services/products-list-filters-service.js";

export interface RootProps {
  /** Child components that will have access to the ProductListFilters service */
  children: React.ReactNode;
  /** Configuration for the ProductListFilters service */
  productsListFiltersConfig: ProductsListFiltersServiceConfig;
}

/**
 * Root component that provides the ProductListFilters service context to its children.
 * This component sets up the necessary services for managing products list filters.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductListFilters } from '@wix/stores/components';
 *
 * function FiltersSection() {
 *   return (
 *     <ProductListFilters.Root
 *       productsListFiltersConfig={{
 *         minPrice: 0,
 *         maxPrice: 1000
 *       }}
 *     >
 *       <ProductListFilters.MinPrice>
 *         {({ minPrice, setMinPrice }) => (
 *           <input
 *             type="number"
 *             value={minPrice}
 *             onChange={(e) => setMinPrice(Number(e.target.value))}
 *             placeholder="Min price"
 *           />
 *         )}
 *       </ProductListFilters.MinPrice>
 *     </ProductListFilters.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListFiltersServiceDefinition,
        ProductsListFiltersService,
        props.productsListFiltersConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

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
 * import { ProductListFilters } from '@wix/stores/components';
 *
 * function InventoryStatusFilter() {
 *   return (
 *     <ProductListFilters.InventoryStatus>
 *       {({ availableInventoryStatuses, selectedInventoryStatuses, toggleInventoryStatus }) => (
 *         <div>
 *           <h4>Inventory Status:</h4>
 *           {availableInventoryStatuses.map(status => (
 *             <label key={status}>
 *               <input
 *                 type="checkbox"
 *                 checked={selectedInventoryStatuses.includes(status)}
 *                 onChange={() => toggleInventoryStatus(status)}
 *               />
 *               {status}
 *             </label>
 *           ))}
 *         </div>
 *       )}
 *     </ProductListFilters.InventoryStatus>
 *   );
 * }
 * ```
 */
export function InventoryStatus(props: InventoryStatusProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
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
 * import { ProductListFilters } from '@wix/stores/components';
 *
 * function ResetFiltersButton() {
 *   return (
 *     <ProductListFilters.ResetTrigger>
 *       {({ resetFilters, isFiltered }) => (
 *         <button
 *           onClick={resetFilters}
 *           disabled={!isFiltered}
 *           className={isFiltered ? 'active' : 'disabled'}
 *         >
 *           {isFiltered ? 'Clear Filters' : 'No Filters Applied'}
 *         </button>
 *       )}
 *     </ProductListFilters.ResetTrigger>
 *   );
 * }
 * ```
 */
export function ResetTrigger(props: ResetTriggerProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
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
  minPrice: number;
  /** Current maximum price filter value */
  maxPrice: number;
  /** Function to update the minimum price filter */
  setMinPrice: (minPrice: number) => void;
  /** Function to update the maximum price filter */
  setMaxPrice: (maxPrice: number) => void;
}

/**
 * Headless component for managing price range filters (combined min/max)
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListFilters } from '@wix/stores/components';
 *
 * function PriceRangeFilter() {
 *   return (
 *     <ProductListFilters.PriceRange>
 *       {({ minPrice, maxPrice, setMinPrice, setMaxPrice }) => (
 *         <div className="price-range">
 *           <h4>Price Range:</h4>
 *           <div className="price-inputs">
 *             <input
 *               type="number"
 *               value={minPrice}
 *               onChange={(e) => setMinPrice(Number(e.target.value))}
 *               placeholder="Min"
 *             />
 *             <span>to</span>
 *             <input
 *               type="number"
 *               value={maxPrice}
 *               onChange={(e) => setMaxPrice(Number(e.target.value))}
 *               placeholder="Max"
 *             />
 *           </div>
 *         </div>
 *       )}
 *     </ProductListFilters.PriceRange>
 *   );
 * }
 * ```
 */
export function PriceRange(props: PriceRangeProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
  const minPrice = service.minPrice.get();
  const maxPrice = service.maxPrice.get();
  const setMinPrice = service.setMinPrice;
  const setMaxPrice = service.setMaxPrice;

  return typeof props.children === "function"
    ? props.children({ minPrice, maxPrice, setMinPrice, setMaxPrice })
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
 * import { ProductListFilters } from '@wix/stores/components';
 *
 * function ProductOptionsFilter() {
 *   return (
 *     <ProductListFilters.ProductOptions>
 *       {({ option, selectedChoices, toggleChoice }) => (
 *         <div key={option.id}>
 *           <h4>{option.name}</h4>
 *           {option.choices.map(choice => (
 *             <label key={choice.id}>
 *               <input
 *                 type="checkbox"
 *                 checked={selectedChoices.includes(choice.id)}
 *                 onChange={() => toggleChoice(choice.id)}
 *               />
 *               {choice.name}
 *             </label>
 *           ))}
 *         </div>
 *       )}
 *     </ProductListFilters.ProductOptions>
 *   );
 * }
 * ```
 */
export function ProductOptions(props: ProductOptionsProps) {
  const service = useService(ProductsListFiltersServiceDefinition);
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
