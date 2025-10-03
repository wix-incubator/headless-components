import { OccurrenceList as OccurrenceListPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for occurrence list display and interaction.
 * Provides context for all occurrence list related components.
 *
 * @component
 * @example
 * ```tsx
 * <OccurrenceList>
 *   <Occurrences>
 *     <OccurrenceRepeater>
 *       // Event content here
 *     </OccurrenceRepeater>
 *   </Occurrences>
 * </OccurrenceList>
 * ```
 */
export const OccurrenceList = OccurrenceListPrimitive.Root;

/**
 * Container for occurrences in a list.
 * Handles layout and spacing for multiple occurrences.
 *
 * @component
 */
export const Occurrences = React.forwardRef<
  React.ElementRef<typeof OccurrenceListPrimitive.Occurrences>,
  React.ComponentPropsWithoutRef<typeof OccurrenceListPrimitive.Occurrences>
>(({ className, ...props }, ref) => {
  return (
    <OccurrenceListPrimitive.Occurrences
      {...props}
      ref={ref}
      className={cn(className)}
    >
      {props.children}
    </OccurrenceListPrimitive.Occurrences>
  );
});

Occurrences.displayName = 'Occurrences';

/**
 * Repeater component for individual occurrences.
 * Handles the iteration over occurrences in the list.
 *
 * @component
 */
export const OccurrenceRepeater = OccurrenceListPrimitive.OccurrenceRepeater;

/**
 * Load more trigger button for pagination.
 * Handles loading additional occurrences in the list.
 *
 * @component
 */
export const OccurrenceListLoadMoreTrigger = React.forwardRef<
  React.ElementRef<typeof OccurrenceListPrimitive.LoadMoreTrigger>,
  React.ComponentPropsWithoutRef<typeof OccurrenceListPrimitive.LoadMoreTrigger>
>(({ className, ...props }, ref) => {
  return (
    <OccurrenceListPrimitive.LoadMoreTrigger
      {...props}
      ref={ref}
      className={cn(
        'block bg-primary text-primary-foreground font-paragraph text-base py-2 px-4 hover:underline',
        className
      )}
    />
  );
});

OccurrenceListLoadMoreTrigger.displayName = 'OccurrenceListLoadMoreTrigger';

/**
 * Error component for displaying occurrence list error.
 * Shows error message when occurrence list fails to load.
 *
 * @component
 */
export const OccurrenceListError = React.forwardRef<
  React.ElementRef<typeof OccurrenceListPrimitive.Error>,
  React.ComponentPropsWithoutRef<typeof OccurrenceListPrimitive.Error>
>(({ className, ...props }, ref) => {
  return (
    <OccurrenceListPrimitive.Error
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-status-danger text-base text-center',
        className
      )}
    />
  );
});

OccurrenceListError.displayName = 'OccurrenceListError';
