import { ScheduleItemTag as ScheduleItemTagPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for schedule item tag display.
 * Provides context for all schedule item tag related components.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItemTag tag={tag}>
 *   <ScheduleItemTagLabel />
 * </ScheduleItemTag>
 * ```
 */
export const ScheduleItemTag = ScheduleItemTagPrimitive.Root;

/**
 * Displays the label of the schedule item tag.
 *
 * @component
 */
export const ScheduleItemTagLabel = React.forwardRef<
  React.ElementRef<typeof ScheduleItemTagPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemTagPrimitive.Label>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemTagPrimitive.Label
      {...props}
      ref={ref}
      className={cn(
        'text-sm font-paragraph text-foreground px-3 py-1.5 border border-foreground/10 rounded-full bg-background',
        className
      )}
    />
  );
});

ScheduleItemTagLabel.displayName = 'ScheduleItemTagLabel';
