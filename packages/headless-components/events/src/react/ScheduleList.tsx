import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleListServiceConfig } from '../services/schedule-list-service.js';
import * as CoreScheduleList from './core/ScheduleList.js';
import {
  type ScheduleItem,
  type ScheduleItemGroup,
} from '../services/schedule-list-service.js';
import * as Schedule from './ScheduleItem.js';
import * as ScheduleListGroup from './ScheduleListGroup.js';
import * as Tag from './Tag.js';

enum TestIds {
  scheduleListItems = 'schedule-list-items',
  scheduleListError = 'schedule-list-error',
  scheduleListGroups = 'schedule-list-groups',
  scheduleListStageFilter = 'schedule-list-stage-filter',
  scheduleListTagFilters = 'schedule-list-tag-filters',
}

/**
 * Props for the ScheduleList Root component.
 */
export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

/**
 * Root container that provides schedule list service context to all child components.
 * Must be used as the top-level component for schedule list functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleList } from '@wix/events/components';
 *
 * function ScheduleListPage({ scheduleListServiceConfig }) {
 *   return (
 *     <ScheduleList.Root scheduleListServiceConfig={scheduleListServiceConfig}>
 *       <ScheduleList.Items emptyState={<div>No schedule items available</div>}>
 *         <ScheduleList.ItemRepeater />
 *       </ScheduleList.Items>
 *       <ScheduleList.Error />
 *     </ScheduleList.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps): React.ReactNode => {
  const { children, scheduleListServiceConfig } = props;

  return (
    <CoreScheduleList.Root
      scheduleListServiceConfig={scheduleListServiceConfig}
    >
      {children}
    </CoreScheduleList.Root>
  );
};

/**
 * Props for the ScheduleList Items component.
 */
export interface ItemsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        items: ScheduleItem[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule list with support for empty state.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.Items>
 *   <ScheduleList.ItemRepeater />
 * </ScheduleList.Items>
 * ```
 */
export const Items = React.forwardRef<HTMLElement, ItemsProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleList.Items>
      {({ items }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleListItems}
          customElement={children}
          customElementProps={{ items }}
          {...otherProps}
        >
          <div>{children as React.ReactNode}</div>
        </AsChildSlot>
      )}
    </CoreScheduleList.Items>
  );
});

/**
 * Props for the ScheduleList ItemRepeater component.
 */
export interface ItemRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the schedule item element */
  className?: string;
}

/**
 * Repeater component that renders Schedule.Root for each schedule item.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.ItemRepeater>
 *   <Schedule.Name />
 *   <Schedule.TimeSlot />
 * </ScheduleList.ItemRepeater>
 * ```
 */

export const ItemRepeater = (props: ItemRepeaterProps): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleList.ItemRepeater>
      {({ items }) => {
        return items.map((item) => (
          <Schedule.Root key={item._id} item={item} className={className}>
            {children}
          </Schedule.Root>
        ));
      }}
    </CoreScheduleList.ItemRepeater>
  );
};

/**
 * Props for the ScheduleList Groups component.
 */
export interface GroupsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        groups: ScheduleItemGroup[];
        hasGroups: boolean;
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Content to render when there are no groups */
  emptyState?: React.ReactNode;
}

/**
 * Container for the grouped schedule items.
 * Follows List Container Level pattern - supports empty state rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.Groups emptyState={<div>No schedule groups available</div>}>
 *   <ScheduleList.GroupRepeater>
 *     <ScheduleListGroup.GroupDateLabel />
 *     <ScheduleListGroup.GroupItems>
 *       <ScheduleListGroup.GroupItemRepeater>
 *         <Schedule.Name />
 *         <Schedule.TimeSlot />
 *       </ScheduleListGroup.GroupItemRepeater>
 *     </ScheduleListGroup.GroupItems>
 *   </ScheduleList.GroupRepeater>
 * </ScheduleList.Groups>
 * ```
 */
export const Groups = React.forwardRef<HTMLElement, GroupsProps>(
  (props, ref) => {
    const { asChild, children, className, emptyState, ...otherProps } = props;

    return (
      <CoreScheduleList.Groups>
        {({ groups }) => {
          if (!groups.length) {
            return emptyState || null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListGroups}
              customElement={children}
              customElementProps={{ groups }}
              {...otherProps}
            >
              <div>{children as React.ReactNode}</div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleList.Groups>
    );
  },
);

/**
 * Props for the ScheduleList GroupRepeater component.
 */
export interface GroupRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Repeater component that renders ScheduleListGroup.Root for each date group.
 * Provides proper group service context for ScheduleListGroup components.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.GroupRepeater>
 *   <ScheduleListGroup.GroupDateLabel />
 *   <ScheduleListGroup.GroupItems>
 *     <ScheduleListGroup.GroupItemRepeater>
 *       <Schedule.Name />
 *       <Schedule.TimeSlot />
 *     </ScheduleListGroup.GroupItemRepeater>
 *   </ScheduleListGroup.GroupItems>
 * </ScheduleList.GroupRepeater>
 * ```
 */
export const GroupRepeater = (props: GroupRepeaterProps): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleList.GroupRepeater>
      {({ groups }) => (
        <>
          {groups.map((group, index) => (
            <ScheduleListGroup.Root
              key={group.dateLabel + '-' + index}
              group={group}
            >
              {children}
            </ScheduleListGroup.Root>
          ))}
        </>
      )}
    </CoreScheduleList.GroupRepeater>
  );
};

/**
 * Props for the ScheduleList StageFilter component.
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
 * <ScheduleList.StageFilter
 *   className="flex items-center gap-2"
 *   labelClassName="font-light text-content-primary"
 *   dropdownClassName="border border-gray-200 rounded-md px-3 py-2"
 * />
 *
 * // asChild with custom implementation
 * <ScheduleList.StageFilter asChild>
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
 * </ScheduleList.StageFilter>
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
      <CoreScheduleList.StageFilter>
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
      </CoreScheduleList.StageFilter>
    );
  },
);

/**
 * Props for the ScheduleList TagFilters component.
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
      <CoreScheduleList.TagFilters>
        {({ tags, currentTagFilters, hasTags, hasActiveTagFilters }) => (
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
        )}
      </CoreScheduleList.TagFilters>
    );
  },
);

/**
 * Props for the ScheduleList TagFilterRepeater component.
 */
export interface TagFilterRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Repeater component that renders Tag.Root for each available tag with filtering functionality.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.TagFilterRepeater>
 *   <Tag.Button />
 * </ScheduleList.TagFilterRepeater>
 * ```
 */
export const TagFilterRepeater = (
  props: TagFilterRepeaterProps,
): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleList.TagFilterRepeater>
      {({ tags, currentTagFilters, toggleTagFilter }) => (
        <>
          {tags.map((tag) => {
            const active = currentTagFilters.includes(tag);

            const handleToggle = () => {
              toggleTagFilter(tag);
            };

            return (
              <Tag.Root key={tag} tag={tag}>
                {React.cloneElement(children as React.ReactElement, {
                  onClick: handleToggle,
                  active,
                })}
              </Tag.Root>
            );
          })}
        </>
      )}
    </CoreScheduleList.TagFilterRepeater>
  );
};
