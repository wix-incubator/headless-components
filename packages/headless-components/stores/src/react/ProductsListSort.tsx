import { createServicesMap } from "@wix/services-manager";
import { useService, WixServices } from "@wix/services-manager-react";
import type { PropsWithChildren, ReactNode } from "react";
import {
  ProductsListSortService,
  ProductsListSortServiceDefinition,
  SortType,
} from "../services/products-list-sort-service.js";

/**
 * Root component that provides the ProductsListSort service context to its children.
 * This component sets up the necessary services for managing products list sorting.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ProductsListSort } from '@wix/stores/components';
 *
 * function SortSection() {
 *   return (
 *     <ProductsListSort.Root>
 *       <ProductsListSort.Options>
 *         {({ selectedSortOption, setSelectedSortOption, sortOptions }) => (
 *           <select
 *             value={selectedSortOption}
 *             onChange={(e) => setSelectedSortOption(e.target.value)}
 *           >
 *             {sortOptions.map(option => (
 *               <option key={option.value} value={option.value}>
 *                 {option.label}
 *               </option>
 *             ))}
 *           </select>
 *         )}
 *       </ProductsListSort.Options>
 *     </ProductsListSort.Root>
 *   );
 * }
 * ```
 */
export function Root(props: PropsWithChildren) {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ProductsListSortServiceDefinition,
        ProductsListSortService,
        {},
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
  children: ((props: OptionsRenderProps) => ReactNode) | ReactNode;
}

/**
 * Render props for Options component
 */
export interface OptionsRenderProps {
  /** Currently selected sort option value */
  selectedSortOption: string;
  /** Function to update the selected sort option */
  setSelectedSortOption: (sort: string) => void;
  /** Available sort options */
  sortOptions: SortType[];
}

/**
 * Headless component for managing product list sorting options
 *
 * @component
 * @example
 * ```tsx
 * import { ProductsListSort } from '@wix/stores/components';
 *
 * function ProductSortDropdown() {
 *   return (
 *     <ProductsListSort.Options>
 *       {({ selectedSortOption, setSelectedSortOption, sortOptions }) => (
 *         <div className="sort-container">
 *           <label htmlFor="sort-select">Sort by:</label>
 *           <select
 *             id="sort-select"
 *             value={selectedSortOption}
 *             onChange={(e) => setSelectedSortOption(e.target.value)}
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
 *     </ProductsListSort.Options>
 *   );
 * }
 * ```
 */
export const Options = (props: OptionsProps) => {
  const service = useService(ProductsListSortServiceDefinition);
  const selectedSortOption = service.selectedSortOption.get();
  const sortOptions = service.sortOptions;
  const setSelectedSortOption = service.setSelectedSortOption;

  return typeof props.children === "function"
    ? props.children({
        selectedSortOption,
        setSelectedSortOption,
        sortOptions,
      })
    : props.children;
};
