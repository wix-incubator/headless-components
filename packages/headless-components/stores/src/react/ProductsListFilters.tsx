import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  ProductsListFiltersService,
  ProductsListFiltersServiceDefinition,
  InventoryStatusType,
  type ProductOption,
} from "../services/products-list-filters-service.js";

/**
 * Root component that provides the ProductsListFilters service context to its children.
 * This component sets up the necessary services for managing products list filters.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function FiltersSection() {
 *   return (
 *     <ProductsListFilters.Root>
 *       <ProductsListFilters.MinPrice>
 *         {({ minPrice, setMinPrice }) => (
 *           <input
 *             type="number"
 *             value={minPrice}
 *             onChange={(e) => setMinPrice(Number(e.target.value))}
 *             placeholder="Min price"
 *           />
 *         )}
 *       </ProductsListFilters.MinPrice>
 *     </ProductsListFilters.Root>
 *   );
 * }
 * ```
 */
export function Root(props: PropsWithChildren) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListFiltersServiceDefinition,
        ProductsListFiltersService,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for MinPrice headless component
 */
export interface MinPriceProps {
  /** Content to display (can be a render function receiving min price controls or ReactNode) */
  children: ((props: MinPriceRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for MinPrice component
 */
export interface MinPriceRenderProps {
  /** Current minimum price filter value */
  minPrice: number;
  /** Function to update the minimum price filter */
  setMinPrice: (minPrice: number) => void;
}

/**
 * Headless component for managing minimum price filter
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function MinPriceFilter() {
 *   return (
 *     <ProductsListFilters.MinPrice>
 *       {({ minPrice, setMinPrice }) => (
 *         <div>
 *           <label>Minimum Price:</label>
 *           <input
 *             type="number"
 *             value={minPrice}
 *             onChange={(e) => setMinPrice(Number(e.target.value))}
 *             placeholder="0"
 *           />
 *         </div>
 *       )}
 *     </ProductsListFilters.MinPrice>
 *   );
 * }
 * ```
 */
export const MinPrice = (props: MinPriceProps) => {
  const service = useService(ProductsListFiltersServiceDefinition);
  const minPrice = service.minPrice.get();
  const setMinPrice = service.setMinPrice;

  return typeof props.children === "function"
    ? props.children({ minPrice, setMinPrice })
    : props.children;
};

/**
 * Props for MaxPrice headless component
 */
export interface MaxPriceProps {
  /** Content to display (can be a render function receiving max price controls or ReactNode) */
  children: ((props: MaxPriceRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for MaxPrice component
 */
export interface MaxPriceRenderProps {
  /** Current maximum price filter value */
  maxPrice: number;
  /** Function to update the maximum price filter */
  setMaxPrice: (maxPrice: number) => void;
}

/**
 * Headless component for managing maximum price filter
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function MaxPriceFilter() {
 *   return (
 *     <ProductsListFilters.MaxPrice>
 *       {({ maxPrice, setMaxPrice }) => (
 *         <div>
 *           <label>Maximum Price:</label>
 *           <input
 *             type="number"
 *             value={maxPrice}
 *             onChange={(e) => setMaxPrice(Number(e.target.value))}
 *             placeholder="1000"
 *           />
 *         </div>
 *       )}
 *     </ProductsListFilters.MaxPrice>
 *   );
 * }
 * ```
 */
export const MaxPrice = (props: MaxPriceProps) => {
  const service = useService(ProductsListFiltersServiceDefinition);
  const maxPrice = service.maxPrice.get();
  const setMaxPrice = service.setMaxPrice;

  return typeof props.children === "function"
    ? props.children({ maxPrice, setMaxPrice })
    : props.children;
};

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
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function InventoryStatusFilter() {
 *   return (
 *     <ProductsListFilters.InventoryStatus>
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
 *     </ProductsListFilters.InventoryStatus>
 *   );
 * }
 * ```
 */
export const InventoryStatus = (props: InventoryStatusProps) => {
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
};

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
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function ResetFiltersButton() {
 *   return (
 *     <ProductsListFilters.ResetTrigger>
 *       {({ resetFilters, isFiltered }) => (
 *         <button
 *           onClick={resetFilters}
 *           disabled={!isFiltered}
 *           className={isFiltered ? 'active' : 'disabled'}
 *         >
 *           {isFiltered ? 'Clear Filters' : 'No Filters Applied'}
 *         </button>
 *       )}
 *     </ProductsListFilters.ResetTrigger>
 *   );
 * }
 * ```
 */
export const ResetTrigger = (props: ResetTriggerProps) => {
  const service = useService(ProductsListFiltersServiceDefinition);
  const resetFilters = service.reset;
  const isFiltered = service.isFiltered.get();

  return typeof props.children === "function"
    ? props.children({ resetFilters, isFiltered })
    : props.children;
};

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
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function PriceRangeFilter() {
 *   return (
 *     <ProductsListFilters.PriceRange>
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
 *     </ProductsListFilters.PriceRange>
 *   );
 * }
 * ```
 */
export const PriceRange = (props: PriceRangeProps) => {
  const service = useService(ProductsListFiltersServiceDefinition);
  const minPrice = service.minPrice.get();
  const maxPrice = service.maxPrice.get();
  const setMinPrice = service.setMinPrice;
  const setMaxPrice = service.setMaxPrice;

  return typeof props.children === "function"
    ? props.children({ minPrice, maxPrice, setMinPrice, setMaxPrice })
    : props.children;
};

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
 * This follows the same collection pattern as ProductsList.ItemContent and CategoriesList.ItemContent.
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsListFilters } from '@wix/stores/components';
 *
 * function ProductOptionsFilter() {
 *   return (
 *     <ProductsListFilters.ProductOptions>
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
 *     </ProductsListFilters.ProductOptions>
 *   );
 * }
 * ```
 */
export const ProductOptions = (props: ProductOptionsProps) => {
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
};
