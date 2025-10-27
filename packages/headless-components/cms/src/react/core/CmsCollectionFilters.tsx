import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import { CmsCollectionServiceDefinition } from '../../services/cms-collection-service.js';
import type {
  FilterValue as Filter,
  FilterOption,
} from '@wix/headless-components/react';

/**
 * Props for CmsCollectionFilters headless component
 */
export interface CmsCollectionFiltersProps {
  /** Filter options configuration for the collection */
  filterOptions: FilterOption[];
  /** Render prop function that receives filter controls */
  children:
    | ((props: CmsCollectionFiltersRenderProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Render props for CmsCollectionFilters component
 */
export interface CmsCollectionFiltersRenderProps {
  /** Current filter value */
  filterValue: Filter;
  /** Filter options configuration */
  filterOptions: FilterOption[];
  /** Function to update the filter */
  updateFilter: (newFilter: Filter) => void;
  /** Function to clear all filters */
  clearFilters: () => void;
  /** Whether any filters are currently applied */
  hasFilters: boolean;
}

/**
 * Core headless component for CMS collection filtering.
 * Provides filter state and update functions to child components.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollectionFilters } from './core/CmsCollectionFilters';
 *
 * function FilterControls() {
 *   return (
 *     <CmsCollectionFilters filterOptions={filterOptions}>
 *       {({ filterValue, updateFilter, hasFilters }) => (
 *         <div>
 *           <div>Active: {hasFilters ? 'Yes' : 'No'}</div>
 *           {/ * Filter UI * /}
 *         </div>
 *       )}
 *     </CmsCollectionFilters>
 *   );
 * }
 * ```
 */
export function CmsCollectionFilters(props: CmsCollectionFiltersProps) {
  const { filterOptions, children } = props;
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const filterValue = service.filterSignal.get() || {};
  const updateFilter = service.setFilter;
  const clearFilters = service.resetFilter;
  const hasFilters = service.isFiltered();

  return typeof children === 'function'
    ? children({
        filterValue,
        filterOptions,
        updateFilter,
        clearFilters,
        hasFilters,
      })
    : children;
}

/**
 * Props for ResetTrigger headless component
 */
export interface ResetTriggerProps {
  /** Content to display (can be a render function receiving reset controls or ReactNode) */
  children:
    | ((props: ResetTriggerRenderProps) => React.ReactNode)
    | React.ReactNode;
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
 * Headless component for resetting all filters.
 * Provides reset functionality and filter state to child components.
 *
 * @component
 * @example
 * ```tsx
 * import { ResetTrigger } from './core/CmsCollectionFilters';
 *
 * function ResetFiltersButton() {
 *   return (
 *     <ResetTrigger>
 *       {({ resetFilters, isFiltered }) => (
 *         <button
 *           onClick={resetFilters}
 *           disabled={!isFiltered}
 *           className={isFiltered ? 'active' : 'disabled'}
 *         >
 *           {isFiltered ? 'Clear Filters' : 'No Filters Applied'}
 *         </button>
 *       )}
 *     </ResetTrigger>
 *   );
 * }
 * ```
 */
export function ResetTrigger(props: ResetTriggerProps) {
  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const resetFilters = service.resetFilter;
  const isFiltered = service.isFiltered();

  return typeof props.children === 'function'
    ? props.children({ resetFilters, isFiltered })
    : props.children;
}
