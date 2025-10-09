import { ScheduleList as ScheduleListPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for schedule list display and interaction.
 * Provides context for all schedule list related components.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList scheduleListServiceConfig={config}>
 *   <ScheduleListFilters allStagesLabel="All stages">
 *     // Filter components here
 *   </ScheduleListFilters>
 *   <ScheduleListGroups>
 *     <ScheduleListGroupRepeater>
 *       // Schedule group content here
 *     </ScheduleListGroupRepeater>
 *   </ScheduleListGroups>
 * </ScheduleList>
 * ```
 */
export const ScheduleList = ScheduleListPrimitive.Root;

/**
 * Container for schedule items in a list.
 * Handles layout and spacing for multiple schedule items.
 *
 * @component
 */
export const ScheduleListItems = React.forwardRef<
  React.ElementRef<typeof ScheduleListPrimitive.Items>,
  React.ComponentPropsWithoutRef<typeof ScheduleListPrimitive.Items>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleListPrimitive.Items {...props} ref={ref} className={cn(className)}>
      {props.children}
    </ScheduleListPrimitive.Items>
  );
});

ScheduleListItems.displayName = 'ScheduleListItems';

/**
 * Repeater component for individual schedule items.
 * Handles the iteration over schedule items in the list.
 *
 * @component
 */
export const ScheduleListItemRepeater = ScheduleListPrimitive.ItemRepeater;

/**
 * Container for grouped schedule items.
 * Supports empty state rendering when no groups exist.
 *
 * @component
 */
export const ScheduleListGroups = React.forwardRef<
  React.ElementRef<typeof ScheduleListPrimitive.Groups>,
  React.ComponentPropsWithoutRef<typeof ScheduleListPrimitive.Groups>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleListPrimitive.Groups
      {...props}
      ref={ref}
      className={cn(className)}
    >
      {props.children}
    </ScheduleListPrimitive.Groups>
  );
});

ScheduleListGroups.displayName = 'ScheduleListGroups';

/**
 * Repeater component for schedule item groups.
 * Handles the iteration over groups of schedule items.
 *
 * @component
 */
export const ScheduleListGroupRepeater = ScheduleListPrimitive.GroupRepeater;

/**
 * Container for schedule list filters.
 * Handles filtering by stages and tags.
 *
 * @component
 */
export const ScheduleListFilters = ScheduleListPrimitive.Filters;
