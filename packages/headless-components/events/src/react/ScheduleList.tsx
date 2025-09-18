import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleListServiceConfig } from '../services/schedule-list-service.js';
import * as CoreScheduleList from './core/ScheduleList.js';
import {
  type ScheduleItem,
  type ScheduleItemGroup,
} from '../services/schedule-list-service.js';
import * as Schedule from './ScheduleItem.js';

enum TestIds {
  scheduleListItems = 'schedule-list-items',
  scheduleListError = 'schedule-list-error',
  scheduleListNavigationTrigger = 'schedule-list-navigation-trigger',
  scheduleListGroups = 'schedule-list-groups',
  scheduleListGroup = 'schedule-list-group',
  scheduleListGroupDateLabel = 'schedule-list-group-date-label',
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
      {({ items, hasItems }) => {
        if (!hasItems) {
          return null;
        }

        return (
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
        );
      }}
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
 * Props for the ScheduleList NavigationTrigger component.
 */
export interface NavigationTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    items: ScheduleItem[];
    hasItems: boolean;
    eventSlug: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the element */
  label?: string;
}

/**
 * Displays a navigation element for schedule page functionality.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleList.NavigationTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="View Schedule" />
 *
 * // asChild with primitive
 * <ScheduleList.NavigationTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   <a href="/schedule">View Schedule</a>
 * </ScheduleList.NavigationTrigger>
 *
 * // asChild with react component
 * <ScheduleList.NavigationTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   {React.forwardRef(({ items, hasItems, eventSlug, ...props }, ref) => (
 *     <a ref={ref} {...props} href={`/events/${eventSlug}/schedule`}>
 *       View Schedule
 *     </a>
 *   ))}
 * </ScheduleList.NavigationTrigger>
 * ```
 */
export const NavigationTrigger = React.forwardRef<
  HTMLElement,
  NavigationTriggerProps
>((props, ref) => {
  const { asChild, children, className, label, ...otherProps } = props;

  return (
    <CoreScheduleList.NavigationTrigger>
      {({ items, hasItems, eventSlug }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleListNavigationTrigger}
            customElement={children}
            customElementProps={{
              items,
              hasItems,
              eventSlug,
            }}
            {...otherProps}
          >
            <button>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreScheduleList.NavigationTrigger>
  );
});

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
}

/**
 * Container for the grouped schedule items.
 * Follows Container Level pattern - provides context and conditional rendering.
 *
 * @component
 */
export const Groups = React.forwardRef<HTMLElement, GroupsProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleList.Groups>
        {({ groups, hasGroups }) => {
          if (!hasGroups) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListGroups}
              customElement={children}
              customElementProps={{ groups, hasGroups }}
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
 * Repeater component that renders Group components for each date group.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 */
export const GroupRepeater = (props: GroupRepeaterProps): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleList.GroupRepeater>
      {({ group, index }) => (
        <CoreScheduleList.Group
          key={group.dateLabel + '-' + index}
          group={group}
        >
          {children}
        </CoreScheduleList.Group>
      )}
    </CoreScheduleList.GroupRepeater>
  );
};

/**
 * Props for the ScheduleList Group component.
 */
export interface GroupProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        group: ScheduleItemGroup;
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for an individual date group that provides group context.
 * Must be used within GroupRepeater.
 *
 * @component
 */
export const Group = React.forwardRef<HTMLElement, GroupProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.scheduleListGroup}
      customElement={children}
      customElementProps={{}}
      {...otherProps}
    >
      <div>{children as React.ReactNode}</div>
    </AsChildSlot>
  );
});

/**
 * Props for the ScheduleList GroupDateLabel component.
 */
export interface GroupDateLabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    dateLabel: string;
    date: Date;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the date label for a schedule group (e.g., "Mon, 07 Jul").
 * Must be used within a Group component.
 *
 * @component
 */
export const GroupDateLabel = React.forwardRef<
  HTMLElement,
  GroupDateLabelProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleList.GroupDateLabel>
      {({ dateLabel, date }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleListGroupDateLabel}
          customElement={children}
          customElementProps={{ dateLabel, date }}
          content={dateLabel}
          {...otherProps}
        >
          <span>{dateLabel}</span>
        </AsChildSlot>
      )}
    </CoreScheduleList.GroupDateLabel>
  );
});
