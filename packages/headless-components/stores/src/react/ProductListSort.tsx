import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import {
  ProductsListSortService,
  ProductsListSortServiceConfig,
  ProductsListSortServiceDefinition,
  SortType,
} from "../services/products-list-sort-service.js";

export interface RootProps {
  children: React.ReactNode;
  productsListSortConfig: ProductsListSortServiceConfig;
}

/**
 * Root component that provides the ProductListSort service context to its children.
 * This component sets up the necessary services for managing products list sorting.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductListSort } from '@wix/stores/components';
 *
 * function SortSection() {
 *   return (
 *     <ProductListSort.Root>
 *       <ProductListSort.Options>
 *         {({ selectedSortOption, updateSortOption, sortOptions }) => (
 *           <select
 *             value={selectedSortOption}
 *             onChange={(e) => updateSortOption(e.target.value)}
 *           >
 *             {sortOptions.map(option => (
 *               <option key={option.value} value={option.value}>
 *                 {option.label}
 *               </option>
 *             ))}
 *           </select>
 *         )}
 *       </ProductListSort.Options>
 *     </ProductListSort.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListSortServiceDefinition,
        ProductsListSortService,
        props.productsListSortConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for Options headless component
 */
export interface OptionsProps {
  /** Content to display (can be a render function receiving sort controls or ReactNode) */
  children: ((props: OptionsRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Options component
 */
export interface OptionsRenderProps {
  /** Currently selected sort option value */
  selectedSortOption: string;
  /** Function to update the selected sort option */
  updateSortOption: (sort: string) => void;
  /** Available sort options */
  sortOptions: SortType[];
}

/**
 * Headless component for managing product list sorting options
 *
 * @component
 * @example
 * ```tsx
 * import { ProductListSort } from '@wix/stores/components';
 *
 * function ProductSortDropdown() {
 *   return (
 *     <ProductListSort.Options>
 *       {({ selectedSortOption, updateSortOption, sortOptions }) => (
 *         <div className="sort-container">
 *           <label htmlFor="sort-select">Sort by:</label>
 *           <select
 *             id="sort-select"
 *             value={selectedSortOption}
 *             onChange={(e) => updateSortOption(e.target.value)}
 *             className="sort-dropdown"
 *           >
 *             {sortOptions.map(option => (
 *               <option key={option.value} value={option.value}>
 *                 {option.label}
 *               </option>
 *             ))}
 *           </select>
 *         </div>
 *       )}
 *     </ProductListSort.Options>
 *   );
 * }
 * ```
 */
export function Options(props: OptionsProps) {
  const service = useService(ProductsListSortServiceDefinition);
  const selectedSortOption = service.selectedSortOption.get();
  const sortOptions = service.sortOptions;
  const updateSortOption = service.setSelectedSortOption;

  return typeof props.children === "function"
    ? props.children({
        selectedSortOption,
        updateSortOption,
        sortOptions,
      })
    : props.children;
}
