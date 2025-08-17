import { useService } from '@wix/services-manager-react';
import { ProductsListSearchServiceDefinition } from '../../services/products-list-search-service.js';
import { SortType } from '../../enums/sort-enums.js';

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
 * import { ProductList, ProductListSort } from '@wix/stores/components';
 *
 * function ProductSortDropdown() {
 *   return (
 *     <ProductList.Root
 *       productsListConfig={{ products: [], searchOptions: {}, pagingMetadata: {}, aggregations: {} }}
 *       productsListSearchConfig={{ customizations: [] }}
 *     >
 *       <ProductListSort.Options>
 *         {({ selectedSortOption, updateSortOption, sortOptions }) => (
 *           <div className="sort-container">
 *             <label htmlFor="sort-select">Sort by:</label>
 *             <select
 *               id="sort-select"
 *               value={selectedSortOption}
 *               onChange={(e) => updateSortOption(e.target.value)}
 *               className="sort-dropdown"
 *             >
 *               {sortOptions.map(option => (
 *                 <option key={option} value={option}>
 *                   {option}
 *                 </option>
 *               ))}
 *             </select>
 *           </div>
 *         )}
 *       </ProductListSort.Options>
 *     </ProductList.Root>
 *   );
 * }
 * ```
 */
export function Options(props: OptionsProps) {
  const service = useService(ProductsListSearchServiceDefinition);
  const selectedSortOption = service.selectedSortOption.get();
  const sortOptions = service.sortOptions;
  const updateSortOption = service.setSelectedSortOption;

  return typeof props.children === 'function'
    ? props.children({
        selectedSortOption,
        updateSortOption,
        sortOptions,
      })
    : props.children;
}
