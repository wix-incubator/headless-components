import { EventList as EventListPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for event list display and interaction.
 * Provides context for all event list related components.
 *
 * @component
 * @example
 * ```tsx
 * <EventList>
 *   <Events>
 *     <EventRepeater>
 *       // Event content here
 *     </EventRepeater>
 *   </Events>
 * </EventList>
 * ```
 */
export const EventList = EventListPrimitive.Root;

/**
 * Container for events in a list.
 * Handles layout and spacing for multiple events.
 *
 * @component
 */
export const Events = React.forwardRef<
  React.ElementRef<typeof EventListPrimitive.Events>,
  React.ComponentPropsWithoutRef<typeof EventListPrimitive.Events>
>(({ className, ...props }, ref) => {
  return (
    <EventListPrimitive.Events {...props} ref={ref} className={cn(className)}>
      {props.children}
    </EventListPrimitive.Events>
  );
});

Events.displayName = 'Events';

/**
 * Repeater component for individual events.
 * Handles the iteration over events in the list.
 *
 * @component
 */
export const EventRepeater = EventListPrimitive.EventRepeater;

/**
 * Load more trigger button for pagination.
 * Handles loading additional events in the list.
 *
 * @component
 */
export const EventListLoadMoreTrigger = React.forwardRef<
  React.ElementRef<typeof EventListPrimitive.LoadMoreTrigger>,
  React.ComponentPropsWithoutRef<typeof EventListPrimitive.LoadMoreTrigger>
>(({ className, label = 'Load More', ...props }, ref) => {
  return (
    <EventListPrimitive.LoadMoreTrigger
      {...props}
      ref={ref}
      className={cn(
        'block bg-primary text-primary-foreground font-paragraph py-2 px-4 hover:bg-primary/80',
        className
      )}
      label={label}
    />
  );
});

EventListLoadMoreTrigger.displayName = 'EventListLoadMoreTrigger';

/**
 * Error component for displaying event list error.
 * Shows error message when event list fails to load.
 *
 * @component
 */
export const EventListError = React.forwardRef<
  React.ElementRef<typeof EventListPrimitive.Error>,
  React.ComponentPropsWithoutRef<typeof EventListPrimitive.Error>
>(({ className, ...props }, ref) => {
  return (
    <EventListPrimitive.Error
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-destructive text-center',
        className
      )}
    />
  );
});

EventListError.displayName = 'EventListError';
