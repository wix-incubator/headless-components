import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import * as CoreScheduleList from './core/ScheduleList.js';
import * as ScheduleItem from './ScheduleItem.js';
import * as ScheduleItemsGroup from './ScheduleItemsGroup.js';
import { type ScheduleListServiceConfig } from '../services/schedule-list-service.js';
import { type ScheduleItem as ScheduleItemType } from '../services/schedule-item-service.js';
import { type ScheduleItemsGroup as ScheduleItemsGroupType } from '../services/schedule-items-group-service.js';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';

enum TestIds {
  scheduleListItems = 'schedule-list-items',
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
 *       <ScheduleList.Items>
 *         <ScheduleList.ItemRepeater>
 *           <ScheduleItem.Name />
 *           <ScheduleItem.TimeSlot />
 *           <ScheduleItem.Duration />
 *           <ScheduleItem.Description />
 *           <ScheduleItem.Stage />
 *           <ScheduleItem.Tags>
 *             <ScheduleItem.TagRepeater>
 *              <ScheduleItemTag.Label />
 *             </ScheduleItem.TagRepeater>
 *           </ScheduleItem.Tags>
 *         </ScheduleList.ItemRepeater>
 *       </ScheduleList.Items>
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
        items: ScheduleItemType[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule list items.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.Items>
 *   <ScheduleList.ItemRepeater>
 *     <ScheduleItem.Name />
 *     <ScheduleItem.TimeSlot />
 *     <ScheduleItem.Duration />
 *     <ScheduleItem.Description />
 *     <ScheduleItem.Stage />
 *     <ScheduleItem.Tags>
 *       <ScheduleItem.TagRepeater>
 *         <ScheduleItemTag.Label />
 *       </ScheduleItem.TagRepeater>
 *     </ScheduleItem.Tags>
 *   </ScheduleList.ItemRepeater>
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
 * Repeater component that renders ScheduleItem.Root for each schedule item.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.ItemRepeater>
 *   <ScheduleItem.Name />
 *   <ScheduleItem.TimeSlot />
 *   <ScheduleItem.Duration />
 *   <ScheduleItem.Description />
 *   <ScheduleItem.Stage />
 *   <ScheduleItem.Tags>
 *     <ScheduleItem.TagRepeater>
 *       <ScheduleItemTag.Label />
 *     </ScheduleItem.TagRepeater>
 *   </ScheduleItem.Tags>
 * </ScheduleList.ItemRepeater>
 * ```
 */
export const ItemRepeater = (props: ItemRepeaterProps): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleList.ItemRepeater>
      {({ items }) =>
        items.map((item) => (
          <ScheduleItem.Root key={item._id} item={item} className={className}>
            {children}
          </ScheduleItem.Root>
        ))
      }
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
        itemsGroups: ScheduleItemsGroupType[];
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
 * <ScheduleList.Groups emptyState={<div>No schedule items available</div>}>
 *   <ScheduleList.GroupRepeater>
 *     <ScheduleItemsGroup.GroupDateLabel />
 *     <ScheduleItemsGroup.GroupItems>
 *       <ScheduleItemsGroup.GroupItemRepeater>
 *         <ScheduleItem.Name />
 *         <ScheduleItem.TimeSlot />
 *       </ScheduleItemsGroup.GroupItemRepeater>
 *     </ScheduleItemsGroup.GroupItems>
 *   </ScheduleList.GroupRepeater>
 * </ScheduleList.Groups>
 * ```
 */
export const Groups = React.forwardRef<HTMLElement, GroupsProps>(
  (props, ref) => {
    const { asChild, children, className, emptyState, ...otherProps } = props;

    return (
      <CoreScheduleList.Groups>
        {({ itemsGroups }) => {
          if (!itemsGroups.length) {
            return emptyState || null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListGroups}
              customElement={children}
              customElementProps={{ itemsGroups }}
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
 * Repeater component that renders ScheduleItemsGroup.Root for each schedule items group.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.GroupRepeater>
 *   <ScheduleItemsGroup.GroupDateLabel />
 *   <ScheduleItemsGroup.GroupItems>
 *     <ScheduleItemsGroup.GroupItemRepeater>
 *       <ScheduleItem.Name />
 *       <ScheduleItem.TimeSlot />
 *       <ScheduleItem.Duration />
 *       <ScheduleItem.Description />
 *       <ScheduleItem.Stage />
 *       <ScheduleItem.Tags>
 *         <ScheduleItem.TagRepeater>
 *           <ScheduleItemTag.Label />
 *         </ScheduleItem.TagRepeater>
 *       </ScheduleItem.Tags>
 *     </ScheduleItemsGroup.GroupItemRepeater>
 *   </ScheduleItemsGroup.GroupItems>
 * </ScheduleList.GroupRepeater>
 * ```
 */
export const GroupRepeater = (props: GroupRepeaterProps): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleList.GroupRepeater>
      {({ itemsGroups }) =>
        itemsGroups.map((itemsGroup) => (
          <ScheduleItemsGroup.Root key={itemsGroup.id} itemsGroup={itemsGroup}>
            {children}
          </ScheduleItemsGroup.Root>
        ))
      }
    </CoreScheduleList.GroupRepeater>
  );
};

export interface FiltersProps {
  /** Render prop function */
  children: React.ReactNode;
  /** All stages label */
  allStagesLabel: string;
}

export interface FiltersRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  value: FilterPrimitive.Filter;
  /** Function to handle tag filter change */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

export const Filters = (props: FiltersProps): React.ReactNode => {
  return (
    <CoreScheduleList.Filters allStagesLabel={props.allStagesLabel}>
      {({ filterOptions, value, onChange }) => (
        <FilterPrimitive.Root
          value={value}
          onChange={onChange}
          filterOptions={filterOptions}
        >
          {props.children}
        </FilterPrimitive.Root>
      )}
    </CoreScheduleList.Filters>
  );
};
