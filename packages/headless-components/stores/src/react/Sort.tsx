import { useService } from "@wix/services-manager-react";
import React from "react";
import {
  SortServiceDefinition,
  type SortBy,
} from "../services/sort-service.js";

export type { SortBy };

export interface ControllerProps {
  children: (props: {
    currentSort: SortBy;
    setSortBy: (sortBy: SortBy) => void;
  }) => React.ReactNode;
}

/**
 * Headless component for sorting products
 *
 * @component
 * @example
 * ```tsx
 * import { Sort } from '@wix/stores/components';
 *
 * function ProductSortDropdown() {
 *   return (
 *     <Sort.Controller>
 *       {({ currentSort, setSortBy }) => (
 *         <select
 *           value={currentSort}
 *           onChange={(e) => setSortBy(e.target.value as Sort.SortBy)}
 *         >
 *           <option value="name_asc">Name (A-Z)</option>
 *           <option value="name_desc">Name (Z-A)</option>
 *           <option value="price_asc">Price (Low to High)</option>
 *           <option value="price_desc">Price (High to Low)</option>
 *         </select>
 *       )}
 *     </Sort.Controller>
 *   );
 * }
 * ```
 */
export function Controller({ children }: ControllerProps) {
  const sortService = useService(SortServiceDefinition);
  const currentSort = sortService.currentSort.get();
  const setSortBy = sortService.setSortBy;

  return <>{children({ currentSort, setSortBy })}</>;
}
