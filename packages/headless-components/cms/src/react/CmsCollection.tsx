import React from 'react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import {
  WixDataQueryResult,
  type CmsCollectionServiceConfig,
  type CmsQueryOptions,
} from '../services/cms-collection-service.js';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import {
  Sort as SortPrimitive,
  type SortValue,
  type SortOption,
  Filter as FilterPrimitive,
  type FilterOption,
  type FilterValue,
} from '@wix/headless-components/react';
import { CmsCollectionSort as CmsCollectionSortPrimitive } from './core/CmsCollectionSort.js';
import * as CoreCmsCollectionFilters from './core/CmsCollectionFilters.js';

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionSort = 'cms-collection-sort',
  cmsCollectionFilters = 'cms-collection-filters',
  cmsCollectionFilterResetTrigger = 'cms-collection-filter-reset-trigger',
}

/**
 * Props for CmsCollection.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
    queryResult?: WixDataQueryResult;
    queryOptions?: CmsQueryOptions;
    initialSort?: SortValue;
    /** Default filters that are always applied (set by site owner).
     * These filters are combined with user-applied filters using AND logic.
     * @example
     * ```tsx
     * // Only show yellow or red cars
     * defaultFilter={{ color: { $hasSome: ['yellow', 'red'] } }}
     *
     * // When user filters by model: Toyota
     * // Result: Toyota cars that are yellow or red
     * ```
     */
    defaultFilter?: FilterValue;
    /** List of field IDs for single reference fields to include */
    singleRefFieldIds?: string[];
    /** List of field IDs for multi reference fields to include */
    multiRefFieldIds?: string[];
  };
  asChild?: boolean;
  className?: string;
}

/**
 * Root component that provides the CMS Collection service context to its children.
 * This component exposes all collection service properties via render props pattern.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionPage() {
 *   return (
 *     <CmsCollection.Root collection={{ id: 'MyCollection' }}>
 *       <CmsCollection.Sort
 *         as="select"
 *         sortOptions={[
 *           { fieldName: 'title', order: 'ASC', label: 'Title (A-Z)' },
 *           { fieldName: 'created', order: 'DESC', label: 'Newest First' },
 *         ]}
 *       />
 *       <CmsCollection.Filters
 *         filterOptions={[
 *           {
 *             key: 'category',
 *             label: 'Category',
 *             type: 'single',
 *             displayType: 'text',
 *             fieldName: 'category',
 *             validValues: ['tech', 'lifestyle', 'business'],
 *           },
 *         ]}
 *       />
 *     </CmsCollection.Root>
 *   );
 * }
 *
 * // With reference fields included
 * function CollectionWithReferences() {
 *   return (
 *     <CmsCollection.Root
 *       collection={{
 *         id: 'MyCollection',
 *         singleRefFieldIds: ['author', 'category'],
 *         multiRefFieldIds: ['tags', 'relatedItems']
 *       }}
 *     >
 *       // Custom rendering logic here
 *     </CmsCollection.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { asChild, className, children, collection } = props;

    const collectionServiceConfig: CmsCollectionServiceConfig = {
      collectionId: collection.id,
      queryResult: collection?.queryResult,
      queryOptions: collection?.queryOptions,
      initialSort: collection?.initialSort,
      defaultFilter: collection?.defaultFilter,
      singleRefFieldIds: collection?.singleRefFieldIds,
      multiRefFieldIds: collection?.multiRefFieldIds,
    };

    const attributes = {
      'data-testid': TestIds.cmsCollectionRoot,
      'data-collection-id': collection.id,
    };

    return (
      <CoreCmsCollection.Root collectionServiceConfig={collectionServiceConfig}>
        {(props) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            {...attributes}
            customElementProps={props}
          >
            <div>{children}</div>
          </AsChildSlot>
        )}
      </CoreCmsCollection.Root>
    );
  },
);

/**
 * Props for CmsCollection.Sort component
 */
export interface SortProps {
  /** Predefined sort options for declarative API */
  sortOptions?: Array<SortOption>;
  /** Render mode - 'select' uses native select, 'list' provides list (default: 'select') */
  as?: 'select' | 'list';
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components or render function */
  children?: React.ReactNode;
  /** CSS classes to apply */
  className?: string;
}

/**
 * Sort component that provides sorting controls for the collection items.
 * Wraps the Sort primitive with CMS collection state management.
 *
 * @component
 * @example
 * ```tsx
 * // Native select with predefined options
 * <CmsCollection.Sort
 *   as="select"
 *   sortOptions={[
 *     { fieldName: 'title', order: 'ASC', label: 'Title (A-Z)' },
 *     { fieldName: 'created', order: 'DESC', label: 'Newest First' },
 *   ]}
 *   className="w-full"
 * />
 *
 * // List with custom options
 * <CmsCollection.Sort as="list" className="flex gap-2">
 *   <CmsCollection.SortOption fieldName="title" order="ASC" label="Title (A-Z)" />
 *   <CmsCollection.SortOption fieldName="created" order="DESC" label="Newest" />
 * </CmsCollection.Sort>
 *
 * // Custom implementation with asChild
 * <CmsCollection.Sort asChild sortOptions={sortOptions}>
 *   <MyCustomSortComponent />
 * </CmsCollection.Sort>
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>((props, ref) => {
  const {
    sortOptions,
    as = 'select',
    asChild,
    children,
    className,
    ...otherProps
  } = props;

  return (
    <CmsCollectionSortPrimitive>
      {({ currentSort, setSort }) => {
        const currentSortItem = currentSort?.[0];

        return (
          <SortPrimitive.Root
            ref={ref}
            value={currentSort}
            onChange={setSort}
            sortOptions={sortOptions}
            as={as}
            asChild={asChild}
            className={className}
            data-testid={TestIds.cmsCollectionSort}
            data-sorted-by={currentSortItem?.fieldName}
            data-sort-direction={currentSortItem?.order}
            {...otherProps}
          >
            {children}
          </SortPrimitive.Root>
        );
      }}
    </CmsCollectionSortPrimitive>
  );
});

/**
 * SortOption component for individual sort options.
 * Direct export of the Sort primitive's Option component - no CMS-specific customization needed
 * since CMS collections have dynamic schemas.
 *
 * @component
 * @example
 * ```tsx
 * // Set both field and order
 * <CmsCollection.SortOption
 *   fieldName="title"
 *   order="ASC"
 *   label="Title (A-Z)"
 * />
 *
 * // Any custom field name from your collection
 * <CmsCollection.SortOption
 *   fieldName="customField"
 *   order="DESC"
 *   label="Custom Field"
 * />
 *
 * // With asChild pattern
 * <CmsCollection.SortOption
 *   fieldName="created"
 *   order="DESC"
 *   label="Newest"
 *   asChild
 * >
 *   <button className="sort-btn">Newest First</button>
 * </CmsCollection.SortOption>
 * ```
 */
const SortOptionComponent = SortPrimitive.Option;

// Set display names
Sort.displayName = 'CmsCollection.Sort';
SortOptionComponent.displayName = 'CmsCollection.SortOption';

// Export as named export
export { SortOptionComponent as SortOption };

/**
 * Props for CmsCollection.Filters component
 */
export interface FiltersProps {
  /** Filter options configuration */
  filterOptions: FilterOption[];
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to filter functionality */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Filter component that provides comprehensive filtering functionality for CMS collections.
 * This component integrates with the CmsCollection service and wraps the generic Filter primitive.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with generic Filter primitives
 * <CmsCollection.Filters
 *   filterOptions={[
 *     {
 *       key: 'category',
 *       label: 'Category',
 *       type: 'single',
 *       displayType: 'text',
 *       fieldName: 'category',
 *       validValues: ['tech', 'lifestyle', 'business'],
 *     },
 *     {
 *       key: 'dateRange',
 *       label: 'Date',
 *       type: 'range',
 *       displayType: 'range',
 *       fieldName: ['createdDate.min', 'createdDate.max'],
 *       validValues: [0, Date.now()],
 *     },
 *   ]}
 * >
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.SingleFilter />
 *       <Filter.FilterOption.MultiFilter />
 *       <Filter.FilterOption.RangeFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </CmsCollection.Filters>
 *
 * // With custom container using asChild
 * <CmsCollection.Filters
 *   asChild
 *   filterOptions={filterOptions}
 * >
 *   <aside className="filter-sidebar">
 *     <Filter.FilterOptions>
 *       <Filter.FilterOptionRepeater>
 *         <Filter.FilterOption.Label />
 *         <Filter.FilterOption.MultiFilter />
 *       </Filter.FilterOptionRepeater>
 *     </Filter.FilterOptions>
 *   </aside>
 * </CmsCollection.Filters>
 * ```
 */
export const Filters = React.forwardRef<HTMLElement, FiltersProps>(
  (props, ref) => {
    const { filterOptions, asChild, children, className, ...otherProps } =
      props;

    return (
      <CoreCmsCollectionFilters.CmsCollectionFilters
        filterOptions={filterOptions}
      >
        {({ filterValue, updateFilter }) => (
          <FilterPrimitive.Root
            value={filterValue}
            onChange={updateFilter}
            filterOptions={filterOptions}
          >
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.cmsCollectionFilters}
              customElement={children}
              {...otherProps}
            >
              {children}
            </AsChildSlot>
          </FilterPrimitive.Root>
        )}
      </CoreCmsCollectionFilters.CmsCollectionFilters>
    );
  },
);

Filters.displayName = 'CmsCollection.Filters';

/**
 * Props for CmsCollection.FilterResetTrigger component
 */
export interface FilterResetTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    resetFilters: () => void;
    isFiltered: boolean;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the button */
  label?: string;
}

/**
 * Reset trigger component for clearing all applied filters.
 * Provides reset functionality and filter state to custom render functions.
 * Only renders when filters are applied.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <CmsCollection.FilterResetTrigger
 *   label="Clear All Filters"
 *   className="reset-btn"
 * />
 *
 * // Custom rendering with asChild
 * <CmsCollection.FilterResetTrigger asChild>
 *   {({ resetFilters, isFiltered }, ref) => (
 *     <button
 *       ref={ref}
 *       onClick={resetFilters}
 *       disabled={!isFiltered}
 *       className="custom-reset-button"
 *     >
 *       Reset All Filters
 *     </button>
 *   )}
 * </CmsCollection.FilterResetTrigger>
 * ```
 */
export const FilterResetTrigger = React.forwardRef<
  HTMLButtonElement,
  FilterResetTriggerProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label = 'Reset Filters',
    ...otherProps
  } = props;

  return (
    <CoreCmsCollectionFilters.ResetTrigger>
      {({ resetFilters, isFiltered }) => {
        if (!isFiltered) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onClick={resetFilters}
            disabled={!isFiltered}
            data-testid={TestIds.cmsCollectionFilterResetTrigger}
            data-filtered={isFiltered}
            customElement={children}
            customElementProps={{ resetFilters, isFiltered }}
            content={label}
            {...otherProps}
          >
            <button disabled={!isFiltered}>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreCmsCollectionFilters.ResetTrigger>
  );
});

FilterResetTrigger.displayName = 'CmsCollection.FilterResetTrigger';

export type { FilterOption };
