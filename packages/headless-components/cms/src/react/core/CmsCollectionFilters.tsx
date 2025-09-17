import { useService } from '@wix/services-manager-react';
import type { ReactNode } from 'react';
import React, { useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';
import {
  Filter as FilterPrimitive,
  type FilterOption,
} from '@wix/headless-components/react';
import {
  CmsCollectionFiltersServiceDefinition,
  type CmsFilterValue,
} from '../../services/cms-collection-filters-service.js';
import type { ServiceAPI } from '@wix/services-definitions';

/**
 * TestIds enum for CmsCollection.Filters components
 */
enum TestIds {
  cmsCollectionFilters = 'cms-collection-filters',
  cmsCollectionFiltersClear = 'cms-collection-filters-clear',
}

/**
 * Props for CmsCollection.Filters component
 */
export interface FiltersProps {
  /**
   * Child components that will have access to filter functionality.
   * Typically contains Filter primitive components like FilterOptions,
   * FilterOptionRepeater, etc.
   */
  children: ReactNode;

  /**
   * When true, the component will not render its own div wrapper but will
   * delegate rendering to its child component. Useful for custom containers.
   *
   * @default false
   */
  asChild?: boolean;

  /**
   * CSS classes to apply to the filter container.
   * Only used when asChild is false (default).
   */
  className?: string;
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
  cmsFilter: {
    /** Current filter values */
    filterValue: CmsFilterValue;
    /** Filter options configuration for filter components */
    filterOptions: FilterOption[];
    /** Update filters */
    updateFilter: (newFilter: CmsFilterValue) => void;
    /** Clear all filters */
    clearFilters: () => void;
    /** Whether any filters are currently applied */
    hasFilters: boolean;
    /** Whether filtering is in progress */
    isFiltering: boolean;
  };
}

/**
 * Headless component for resetting all filters
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function ResetFiltersButton() {
 *   return (
 *     <CmsCollection.Root collectionServiceConfig={config}>
 *       <CmsCollection.Filters>
 *         <CmsCollection.Filters.ResetTrigger>
 *           {({ resetFilters, isFiltered }) => (
 *             <button
 *               onClick={resetFilters}
 *               disabled={!isFiltered}
 *               className={isFiltered ? 'active' : 'disabled'}
 *             >
 *               {isFiltered ? 'Clear Filters' : 'No Filters Applied'}
 *             </button>
 *           )}
 *         </CmsCollection.Filters.ResetTrigger>
 *       </CmsCollection.Filters>
 *     </CmsCollection.Root>
 *   );
 * }
 * ```
 */
export function ResetTrigger(props: ResetTriggerProps) {
  const service = useService(CmsCollectionFiltersServiceDefinition) as ServiceAPI<
    typeof CmsCollectionFiltersServiceDefinition
  >;

  const resetFilters = service.clearFilters;
  const isFiltered = service.hasFiltersSignal.get();

  return typeof props.children === 'function'
    ? props.children({ resetFilters, isFiltered })
    : props.children;
}

/**
 * Internal component that provides filter data for the Filter component.
 * Consolidates data from the CMS collection filters service.
 */
function AllFilters(props: AllFiltersProps) {
  const service = useService(CmsCollectionFiltersServiceDefinition) as ServiceAPI<
    typeof CmsCollectionFiltersServiceDefinition
  >;

  // Get current filter state
  const currentFilter = service.filterSignal.get();
  const filterOptions = service.filterOptionsSignal.get();
  const hasFilters = service.hasFiltersSignal.get();
  const isFiltering = service.filteringSignal.get();

  // Build filter data and handlers
  const cmsFilterData = useMemo(() => {
    const updateFilter = (newFilter: any) => {
      service.setFilter(newFilter);
    };

    const clearFilters = () => {
      service.clearFilters();
    };

    return {
      filterValue: currentFilter,
      filterOptions,
      updateFilter,
      clearFilters,
      hasFilters,
      isFiltering,
    };
  }, [
    currentFilter,
    filterOptions,
    hasFilters,
    isFiltering,
    service,
  ]);

  return typeof props.children === 'function'
    ? props.children({ cmsFilter: cmsFilterData })
    : props.children;
}

/**
 * Filter component that provides comprehensive filtering functionality for CMS collections.
 *
 * This component acts as a provider that integrates with the CmsCollectionFilters service to offer
 * predefined filter options based on the collection's filterable fields configuration.
 *
 * The component automatically extracts available filter options from the service configuration
 * and provides them to child Filter primitive components for rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with styled filter components
 * <CmsCollection.Filters>
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.MultiFilter />
 *       <Filter.FilterOption.RangeFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </CmsCollection.Filters>
 *
 * // With custom container using asChild
 * <CmsCollection.Filters asChild>
 *   <aside className="filter-sidebar">
 *     <Filter.FilterOptions>
 *       <Filter.FilterOptionRepeater>
 *         <Filter.FilterOption.Label />
 *         <Filter.FilterOption.MultiFilter />
 *       </Filter.FilterOptionRepeater>
 *     </Filter.FilterOptions>
 *   </aside>
 * </CmsCollection.Filters>
 *
 * // With reset functionality
 * <CmsCollection.Filters className="filters-container">
 *   <Filter.Action.Clear label="Clear All" />
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.MultiFilter />
 *       <Filter.FilterOption.RangeFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </CmsCollection.Filters>
 *
 * // With filtered state indicator
 * <CmsCollection.Filters>
 *   <Filter.Filtered>
 *     <div className="bg-blue-50 border-blue-200 p-4 rounded">
 *       <p className="text-blue-700">Active filters:</p>
 *       <Filter.Action.Clear label="Clear All" />
 *     </div>
 *   </Filter.Filtered>
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.SingleFilter />
 *       <Filter.FilterOption.MultiFilter />
 *       <Filter.FilterOption.RangeFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </CmsCollection.Filters>
 * ```
 *
 * @see {@link AllFilters} for the underlying filter data logic
 * @see {@link FilterPrimitive.Root} for the primitive filter component
 * @see {@link ResetTrigger} for filter reset functionality
 */
export const Filters = React.forwardRef<HTMLDivElement, FiltersProps>(
  ({ children, className, asChild }, ref) => {
    const Comp = asChild ? Slot : 'div';

    return (
      <AllFilters>
        {({ cmsFilter }) => {
          return (
            <FilterPrimitive.Root
              value={cmsFilter.filterValue}
              onChange={cmsFilter.updateFilter}
              filterOptions={cmsFilter.filterOptions}
            >
              <Comp
                className={className}
                ref={ref}
                data-testid={TestIds.cmsCollectionFilters}
                data-has-active-filters={cmsFilter.hasFilters}
                data-filtering={cmsFilter.isFiltering}
              >
                {children}
              </Comp>
            </FilterPrimitive.Root>
          );
        }}
      </AllFilters>
    );
  },
);

Filters.displayName = 'CmsCollection.Filters';

/**
 * Attach ResetTrigger as a static property for compound component pattern
 */
(Filters as any).ResetTrigger = ResetTrigger;

/**
 * Type for the compound Filters component with static properties
 */
export type FiltersComponent = typeof Filters & {
  ResetTrigger: typeof ResetTrigger;
};
