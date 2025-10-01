import { ScheduleItemsGroup as ScheduleItemsGroupPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for schedule items group display.
 * Provides context for all schedule items group related components.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItemsGroup itemsGroup={itemsGroup}>
 *   <ScheduleItemsGroupDateLabel />
 *   <ScheduleItemsGroupItems>
 *     <ScheduleItemsGroupItemRepeater>
 *       // Schedule item content here
 *     </ScheduleItemsGroupItemRepeater>
 *   </ScheduleItemsGroupItems>
 * </ScheduleItemsGroup>
 * ```
 */
export const ScheduleItemsGroup = ScheduleItemsGroupPrimitive.Root;

/**
 * Displays the date label for the schedule items group.
 *
 * @component
 */
export const ScheduleItemsGroupDateLabel = React.forwardRef<
  React.ElementRef<typeof ScheduleItemsGroupPrimitive.DateLabel>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemsGroupPrimitive.DateLabel>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemsGroupPrimitive.DateLabel
      {...props}
      ref={ref}
      className={cn(
        'block font-heading text-foreground text-2xl font-bold',
        className
      )}
    />
  );
});

ScheduleItemsGroupDateLabel.displayName = 'ScheduleItemsGroupDateLabel';

/**
 * Container for schedule items within a group.
 * Handles layout and spacing for multiple schedule items.
 *
 * @component
 */
export const ScheduleItemsGroupItems = React.forwardRef<
  React.ElementRef<typeof ScheduleItemsGroupPrimitive.Items>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemsGroupPrimitive.Items>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemsGroupPrimitive.Items
      {...props}
      ref={ref}
      className={cn(className)}
    >
      {props.children}
    </ScheduleItemsGroupPrimitive.Items>
  );
});

ScheduleItemsGroupItems.displayName = 'ScheduleItemsGroupItems';

/**
 * Repeater component for individual schedule items within a group.
 * Handles the iteration over schedule items in the group.
 *
 * @component
 */
export const ScheduleItemsGroupItemRepeater =
  ScheduleItemsGroupPrimitive.ItemRepeater;
