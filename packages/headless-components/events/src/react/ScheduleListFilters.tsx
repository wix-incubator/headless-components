import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import * as CoreScheduleListFilters from './core/ScheduleListFilters.js';

enum TestIds {
  scheduleListFilters = 'schedule-list-filters',
  scheduleListStageFilter = 'schedule-list-stage-filter',
  scheduleListTagFilters = 'schedule-list-tag-filters',
  scheduleListTagFilterItems = 'schedule-list-tag-filter-items',
}

/**
 * Props for the ScheduleList Filters component.
 */
export interface FiltersProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        stageNames: string[];
        tags: string[];
        currentStageFilter: string | null;
        currentTagFilters: string[];
        hasActiveFilters: boolean;
        hasStages: boolean;
        hasTags: boolean;
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for schedule list filters with conditional rendering.
 * Follows Container Level pattern - provides context and conditional rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleListFilters.Filters>
 *   <ScheduleListFilters.StageFilter />
 *   <ScheduleListFilters.TagFilters>
 *     <ScheduleListFilters.TagFilterItems>
 *       <ScheduleListFilters.TagFilterRepeater>
 *         <ScheduleListFilters.TagFilterItem />
 *       </ScheduleListFilters.TagFilterRepeater>
 *     </ScheduleListFilters.TagFilterItems>
 *   </ScheduleListFilters.TagFilters>
 * </ScheduleListFilters.Filters>
 * ```
 */
export const Filters = React.forwardRef<HTMLElement, FiltersProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleListFilters.Filters>
        {({
          stageNames,
          tags,
          currentStageFilter,
          currentTagFilters,
          hasActiveFilters,
          hasStages,
          hasTags,
        }) => {
          if (!hasStages && !hasTags) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListFilters}
              customElement={children}
              customElementProps={{
                stageNames,
                tags,
                currentStageFilter,
                currentTagFilters,
                hasActiveFilters,
                hasStages,
                hasTags,
              }}
              {...otherProps}
            >
              <div>{children as React.ReactNode}</div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleListFilters.Filters>
    );
  },
);

/**
 * Props for the ScheduleListFilters StageFilter component.
 */
export interface StageFilterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    stageNames: string[];
    currentStageFilter: string | null;
    hasStages: boolean;
    setStageFilter: (stageName: string | null) => void;
    clearStageFilter: () => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** CSS classes to apply to the filter label */
  labelClassName?: string;
  /** CSS classes to apply to the dropdown */
  dropdownClassName?: string;
}

/**
 * Stage filter component that provides stage filtering functionality.
 * Displays "Filter by:" as text followed by a dropdown for places.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleListFilters.StageFilter
 *   className="flex items-center gap-2"
 *   labelClassName="font-light text-content-primary"
 *   dropdownClassName="border border-gray-200 rounded-md px-3 py-2"
 * />
 *
 * // asChild with custom implementation
 * <ScheduleListFilters.StageFilter asChild>
 *   {React.forwardRef(({ stageNames, currentStageFilter, setStageFilter, ...props }, ref) => (
 *     <div ref={ref} {...props} className="flex items-center gap-2">
 *       <span>Filter by:</span>
 *       <select value={currentStageFilter || ''} onChange={(e) => setStageFilter(e.target.value || null)}>
 *         <option value="">All places</option>
 *         {stageNames.map(stage => (
 *           <option key={stage} value={stage}>{stage}</option>
 *         ))}
 *       </select>
 *     </div>
 *   ))}
 * </ScheduleListFilters.StageFilter>
 * ```
 */
export const StageFilter = React.forwardRef<HTMLElement, StageFilterProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      labelClassName,
      dropdownClassName,
      ...otherProps
    } = props;

    return (
      <CoreScheduleListFilters.StageFilter>
        {({
          stageNames,
          currentStageFilter,
          hasStages,
          setStageFilter,
          clearStageFilter,
        }) => {
          if (!hasStages) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListStageFilter}
              customElement={children}
              customElementProps={{
                stageNames,
                currentStageFilter,
                hasStages,
                setStageFilter,
                clearStageFilter,
              }}
              {...otherProps}
            >
              <div className="flex items-center gap-2">
                <span className={labelClassName}>Filter by:</span>
                <select
                  className={dropdownClassName}
                  value={currentStageFilter || ''}
                  onChange={(e) => setStageFilter(e.target.value || null)}
                >
                  <option value="">All places</option>
                  {stageNames.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleListFilters.StageFilter>
    );
  },
);

/**
 * Props for the ScheduleListFilters TagFilters component.
 */
export interface TagFiltersProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        tags: string[];
        currentTagFilters: string[];
        hasTags: boolean;
        hasActiveTagFilters: boolean;
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for tag filters with conditional rendering.
 * Follows Container Level pattern - provides context and conditional rendering.
 *
 * @component
 */
export const TagFilters = React.forwardRef<HTMLElement, TagFiltersProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleListFilters.TagFilters>
        {({ tags, currentTagFilters, hasTags, hasActiveTagFilters }) => {
          if (!hasTags) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListTagFilters}
              customElement={children}
              customElementProps={{
                tags,
                currentTagFilters,
                hasTags,
                hasActiveTagFilters,
              }}
              {...otherProps}
            >
              <div>{children as React.ReactNode}</div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleListFilters.TagFilters>
    );
  },
);

/**
 * Props for the ScheduleListFilters TagFilterItems component.
 */
export interface TagFilterItemsProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Empty state component to show when no tags are available */
  emptyState?: React.ReactNode;
}

/**
 * Container for tag filter items with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 */
export const TagFilterItems = React.forwardRef<
  HTMLElement,
  TagFilterItemsProps
>((props, ref) => {
  const { children, className, emptyState, ...otherProps } = props;

  return (
    <CoreScheduleListFilters.TagFilterItems>
      {({ hasTags }) => {
        if (!hasTags) {
          return emptyState || null;
        }

        return (
          <div
            ref={ref as React.LegacyRef<HTMLDivElement>}
            className={className}
            data-testid={TestIds.scheduleListTagFilterItems}
            {...otherProps}
          >
            {children}
          </div>
        );
      }}
    </CoreScheduleListFilters.TagFilterItems>
  );
});

/**
 * Props for the ScheduleListFilters TagFilterRepeater component.
 */
export interface TagFilterRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Repeater component that renders TagFilterItem for each available tag.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 */
export const TagFilterRepeater = (
  props: TagFilterRepeaterProps,
): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleListFilters.TagFilterRepeater>
      {children}
    </CoreScheduleListFilters.TagFilterRepeater>
  );
};
