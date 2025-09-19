import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import {
  type ScheduleItemGroup,
  type ScheduleItem,
} from '../services/schedule-list-service.js';
import * as CoreScheduleListGroup from './core/ScheduleListGroup.js';
import * as Schedule from './ScheduleItem.js';

enum TestIds {
  scheduleListGroupRoot = 'schedule-list-group-root',
  scheduleListGroup = 'schedule-list-group',
  scheduleListGroupDateLabel = 'schedule-list-group-date-label',
  scheduleListGroupItems = 'schedule-list-group-items',
  scheduleListGroupItem = 'schedule-list-group-item',
}

/**
 * Props for the ScheduleListGroup Root component.
 */
export interface RootProps {
  /** Schedule list group data */
  group: ScheduleItemGroup;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the schedule list group service */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides schedule list group service context to all child components.
 * Must be used as the top-level ScheduleListGroup component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleListGroup } from '@wix/events/components';
 *
 * function ScheduleListGroupComponent({ group }) {
 *   return (
 *     <ScheduleListGroup.Root group={group}>
 *       <ScheduleListGroup.GroupDateLabel />
 *       <ScheduleListGroup.GroupItems emptyState={<div>No schedule items available</div>}>
 *         <ScheduleListGroup.GroupItemRepeater>
 *           <Schedule.Name />
 *           <Schedule.TimeSlot />
 *         </ScheduleListGroup.GroupItemRepeater>
 *       </ScheduleListGroup.GroupItems>
 *     </ScheduleListGroup.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { group, asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleListGroup.Root group={group}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.scheduleListGroupRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreScheduleListGroup.Root>
  );
});

/**
 * Props for the ScheduleListGroup Group component.
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
 * Container that provides access to the group data.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleListGroup.Group>
 *   <div>Group content here</div>
 * </ScheduleListGroup.Group>
 * ```
 */
export const Group = React.forwardRef<HTMLElement, GroupProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleListGroup.Group>
      {({ group }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleListGroup}
          customElement={children}
          customElementProps={{ group }}
          {...otherProps}
        >
          <div>{children as React.ReactNode}</div>
        </AsChildSlot>
      )}
    </CoreScheduleListGroup.Group>
  );
});

/**
 * Props for the ScheduleListGroup GroupDateLabel component.
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
 * Must be used within a ScheduleListGroup.Root component.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleListGroup.GroupDateLabel className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <ScheduleListGroup.GroupDateLabel asChild>
 *   <h3 className="text-lg font-semibold" />
 * </ScheduleListGroup.GroupDateLabel>
 *
 * // asChild with react component
 * <ScheduleListGroup.GroupDateLabel asChild>
 *   {React.forwardRef(({ dateLabel, date, ...props }, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-semibold">
 *       {dateLabel}
 *     </h3>
 *   ))}
 * </ScheduleListGroup.GroupDateLabel>
 * ```
 */
export const GroupDateLabel = React.forwardRef<
  HTMLElement,
  GroupDateLabelProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleListGroup.GroupDateLabel>
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
    </CoreScheduleListGroup.GroupDateLabel>
  );
});

/**
 * Props for the ScheduleListGroup GroupItems component.
 */
export interface GroupItemsProps {
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
  /** Content to render when there are no items */
  emptyState?: React.ReactNode;
}

/**
 * Container for the schedule items in the group with support for empty state.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleListGroup.GroupItems emptyState={<div>No schedule items available</div>}>
 *   <ScheduleListGroup.GroupItemRepeater>
 *     <Schedule.Name />
 *     <Schedule.TimeSlot />
 *   </ScheduleListGroup.GroupItemRepeater>
 * </ScheduleListGroup.GroupItems>
 * ```
 */
export const GroupItems = React.forwardRef<HTMLElement, GroupItemsProps>(
  (props, ref) => {
    const { asChild, children, className, emptyState, ...otherProps } = props;

    return (
      <CoreScheduleListGroup.GroupItems>
        {({ items }) => {
          if (!items.length) {
            return emptyState || null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleListGroupItems}
              customElement={children}
              customElementProps={{ items }}
              {...otherProps}
            >
              <div>{children as React.ReactNode}</div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleListGroup.GroupItems>
    );
  },
);

/**
 * Props for the ScheduleListGroup GroupItemRepeater component.
 */
export interface GroupItemRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the schedule item element */
  className?: string;
}

/**
 * Repeater component that renders ScheduleItem.Root for each schedule item in the group.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleListGroup.GroupItemRepeater>
 *   <Schedule.Name />
 *   <Schedule.TimeSlot />
 *   <Schedule.Duration />
 * </ScheduleListGroup.GroupItemRepeater>
 * ```
 */
export const GroupItemRepeater = (
  props: GroupItemRepeaterProps,
): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleListGroup.GroupItems>
      {({ items }) => {
        return items.map((item) => (
          <Schedule.Root
            key={item._id}
            item={item}
            className={className}
            data-testid={TestIds.scheduleListGroupItem}
          >
            {children}
          </Schedule.Root>
        ));
      }}
    </CoreScheduleListGroup.GroupItems>
  );
};
