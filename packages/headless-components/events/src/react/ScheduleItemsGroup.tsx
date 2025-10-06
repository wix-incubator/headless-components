import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as CoreScheduleItemsGroup from './core/ScheduleItemsGroup.js';
import * as ScheduleItem from './ScheduleItem.js';
import { type ScheduleItem as ScheduleItemType } from '../services/schedule-item-service.js';
import { type ScheduleItemsGroup } from '../services/schedule-items-group-service.js';

enum TestIds {
  scheduleItemsGroupRoot = 'schedule-items-group-root',
  scheduleItemsGroupDateLabel = 'schedule-items-group-date-label',
  scheduleItemsGroupItems = 'schedule-items-group-items',
}

/**
 * Props for the ScheduleItemsGroup Root component.
 */
export interface RootProps {
  /** Schedule items group data */
  itemsGroup: ScheduleItemsGroup;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the schedule items group */
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
 *       <ScheduleItemsGroup.DateLabel />
 *       <ScheduleItemsGroup.Items emptyState={<div>No schedule items available</div>}>
 *         <ScheduleItemsGroup.ItemRepeater>
 *           <ScheduleItem.Name />
 *           <ScheduleItem.TimeSlot />
 *         </ScheduleItemsGroup.ItemRepeater>
 *       </ScheduleItemsGroup.Items>
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
 * Props for the ScheduleItemsGroup DateLabel component.
 */
export interface DateLabelProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ formattedDate: string; date: Date }>;
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
 * <ScheduleItemsGroup.DateLabel className="text-lg font-semibold" />
 *
 * // asChild with primitive
 * <ScheduleItemsGroup.DateLabel asChild>
 *   <h3 className="text-lg font-semibold" />
 * </ScheduleItemsGroup.DateLabel>
 *
 * // asChild with react component
 * <ScheduleItemsGroup.DateLabel asChild>
 *   {React.forwardRef(({ formattedDate, date, ...props }, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-semibold">
 *       {formattedDate}
 *     </h3>
 *   ))}
 * </ScheduleItemsGroup.DateLabel>
 * ```
 */
export const DateLabel = React.forwardRef<HTMLElement, DateLabelProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleItemsGroup.DateLabel>
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
      </CoreScheduleItemsGroup.DateLabel>
    );
  },
);

/**
 * Props for the ScheduleItemsGroup Items component.
 */
export interface ItemsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children: React.ReactNode | AsChildChildren<{ items: ScheduleItemType[] }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule items in the group with support for empty state.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItemsGroup.Items emptyState={<div>No schedule items available</div>}>
 *   <ScheduleItemsGroup.ItemRepeater>
 *     <ScheduleItem.Name />
 *     <ScheduleItem.TimeSlot />
 *   </ScheduleItemsGroup.ItemRepeater>
 * </ScheduleItemsGroup.Items>
 * ```
 */
export const Items = React.forwardRef<HTMLElement, ItemsProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItemsGroup.Items>
      {({ items }) => (
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
      )}
    </CoreScheduleItemsGroup.Items>
  );
});

/**
 * Props for the ScheduleItemsGroup ItemRepeater component.
 */
export interface ItemRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the schedule item element */
  className?: string;
}

/**
 * Repeater component that renders ScheduleItem.Root for each schedule item in the group.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItemsGroup.ItemRepeater>
 *   <ScheduleItem.Name />
 *   <ScheduleItem.TimeSlot />
 *   <ScheduleItem.Duration />
 * </ScheduleItemsGroup.ItemRepeater>
 * ```
 */
export const ItemRepeater = (props: ItemRepeaterProps): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleItemsGroup.Items>
      {({ items }) =>
        items.map((item) => (
          <ScheduleItem.Root key={item._id} item={item} className={className}>
            {children}
          </ScheduleItem.Root>
        ))
      }
    </CoreScheduleItemsGroup.Items>
  );
};
