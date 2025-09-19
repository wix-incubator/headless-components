import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleItemsGroup } from '../services/schedule-items-group-service.js';
import { type ScheduleItem } from '../services/schedule-item-service.js';
import * as CoreScheduleItemsGroup from './core/ScheduleItemsGroup.js';
import * as Schedule from './ScheduleItem.js';

enum TestIds {
  scheduleItemsGroupRoot = 'schedule-items-group-root',
  scheduleItemsGroup = 'schedule-items-group',
  scheduleItemsGroupDateLabel = 'schedule-items-group-date-label',
  scheduleItemsGroupItems = 'schedule-items-group-items',
  scheduleItemsGroupItem = 'schedule-items-group-item',
}

/**
 * Props for the ScheduleItemsGroup Root component.
 */
export interface RootProps {
  /** Schedule items group data */
  itemsGroup: ScheduleItemsGroup;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the schedule items group service */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides schedule items group service context to all child components.
 * Must be used as the top-level ScheduleItemsGroup component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleItemsGroup } from '@wix/events/components';
 *
 * function ScheduleItemsGroupComponent({ itemsGroup }) {
 *   return (
 *     <ScheduleItemsGroup.Root itemsGroup={itemsGroup}>
 *       <ScheduleItemsGroup.GroupDateLabel />
 *       <ScheduleItemsGroup.GroupItems emptyState={<div>No schedule items available</div>}>
 *         <ScheduleItemsGroup.GroupItemRepeater>
 *           <Schedule.Name />
 *           <Schedule.TimeSlot />
 *         </ScheduleItemsGroup.GroupItemRepeater>
 *       </ScheduleItemsGroup.GroupItems>
 *     </ScheduleItemsGroup.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { itemsGroup, asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItemsGroup.Root itemsGroup={itemsGroup}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.scheduleItemsGroupRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreScheduleItemsGroup.Root>
  );
});

/**
 * Props for the ScheduleItemsGroup GroupDateLabel component.
 */
export interface GroupDateLabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedDate: string;
    date: Date;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the date label for a schedule group (e.g., "Mon, 07 Jul").
 * Must be used within a ScheduleItemsGroup.Root component.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItemsGroup.GroupDateLabel className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <ScheduleItemsGroup.GroupDateLabel asChild>
 *   <h3 className="text-lg font-semibold" />
 * </ScheduleItemsGroup.GroupDateLabel>
 *
 * // asChild with react component
 * <ScheduleItemsGroup.GroupDateLabel asChild>
 *   {React.forwardRef(({ formattedDate, date, ...props }, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-semibold">
 *       {formattedDate}
 *     </h3>
 *   ))}
 * </ScheduleItemsGroup.GroupDateLabel>
 * ```
 */
export const GroupDateLabel = React.forwardRef<
  HTMLElement,
  GroupDateLabelProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItemsGroup.GroupDateLabel>
      {({ formattedDate, date }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleItemsGroupDateLabel}
          customElement={children}
          customElementProps={{ formattedDate, date }}
          content={formattedDate}
          {...otherProps}
        >
          <span>{formattedDate}</span>
        </AsChildSlot>
      )}
    </CoreScheduleItemsGroup.GroupDateLabel>
  );
});

/**
 * Props for the ScheduleItemsGroup GroupItems component.
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
 * <ScheduleItemsGroup.GroupItems emptyState={<div>No schedule items available</div>}>
 *   <ScheduleItemsGroup.GroupItemRepeater>
 *     <Schedule.Name />
 *     <Schedule.TimeSlot />
 *   </ScheduleItemsGroup.GroupItemRepeater>
 * </ScheduleItemsGroup.GroupItems>
 * ```
 */
export const GroupItems = React.forwardRef<HTMLElement, GroupItemsProps>(
  (props, ref) => {
    const { asChild, children, className, emptyState, ...otherProps } = props;

    return (
      <CoreScheduleItemsGroup.GroupItems>
        {({ items }) => {
          if (!items.length) {
            return emptyState || null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.scheduleItemsGroupItems}
              customElement={children}
              customElementProps={{ items }}
              {...otherProps}
            >
              <div>{children as React.ReactNode}</div>
            </AsChildSlot>
          );
        }}
      </CoreScheduleItemsGroup.GroupItems>
    );
  },
);

/**
 * Props for the ScheduleItemsGroup GroupItemRepeater component.
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
 * <ScheduleItemsGroup.GroupItemRepeater>
 *   <Schedule.Name />
 *   <Schedule.TimeSlot />
 *   <Schedule.Duration />
 * </ScheduleItemsGroup.GroupItemRepeater>
 * ```
 */
export const GroupItemRepeater = (
  props: GroupItemRepeaterProps,
): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleItemsGroup.GroupItems>
      {({ items }) =>
        items.map((item) => (
          <Schedule.Root
            key={item._id}
            item={item}
            className={className}
            data-testid={TestIds.scheduleItemsGroupItem}
          >
            {children}
          </Schedule.Root>
        ))
      }
    </CoreScheduleItemsGroup.GroupItems>
  );
};
