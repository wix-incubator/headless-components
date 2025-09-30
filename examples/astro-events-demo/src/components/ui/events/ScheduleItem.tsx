import { ScheduleItem as ScheduleItemPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for schedule item display.
 * Provides context for all schedule item related components like name, time, duration, etc.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItem item={scheduleItem}>
 *   <ScheduleItemName />
 *   <ScheduleItemTimeSlot />
 *   <ScheduleItemDuration />
 *   <ScheduleItemDescription />
 *   <ScheduleItemStage />
 *   <ScheduleItemTags>
 *     <ScheduleItemTagRepeater>
 *       // Tag content here
 *     </ScheduleItemTagRepeater>
 *   </ScheduleItemTags>
 * </ScheduleItem>
 * ```
 */
export const ScheduleItem = ScheduleItemPrimitive.Root;

/**
 * Displays name of the schedule item.
 *
 * @component
 */
export const ScheduleItemName = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.Name>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground font-medium text-lg',
        className
      )}
    />
  );
});

ScheduleItemName.displayName = 'ScheduleItemName';

/**
 * Displays time slot of the schedule item.
 *
 * @component
 */
export const ScheduleItemTimeSlot = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.TimeSlot>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.TimeSlot>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.TimeSlot
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base font-medium',
        className
      )}
    />
  );
});

ScheduleItemTimeSlot.displayName = 'ScheduleItemTimeSlot';

/**
 * Displays duration of the schedule item.
 *
 * @component
 */
export const ScheduleItemDuration = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.Duration>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.Duration>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.Duration
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

ScheduleItemDuration.displayName = 'ScheduleItemDuration';

/**
 * Displays description of the schedule item.
 *
 * @component
 */
export const ScheduleItemDescription = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.Description
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

ScheduleItemDescription.displayName = 'ScheduleItemDescription';

/**
 * Displays stage of the schedule item.
 *
 * @component
 */
export const ScheduleItemStage = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.Stage>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.Stage>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.Stage
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm font-medium',
        className
      )}
    />
  );
});

ScheduleItemStage.displayName = 'ScheduleItemStage';

/**
 * Container for schedule item tags.
 * Handles layout and spacing for multiple tags.
 *
 * @component
 */
export const ScheduleItemTags = React.forwardRef<
  React.ElementRef<typeof ScheduleItemPrimitive.Tags>,
  React.ComponentPropsWithoutRef<typeof ScheduleItemPrimitive.Tags>
>(({ className, ...props }, ref) => {
  return (
    <ScheduleItemPrimitive.Tags {...props} ref={ref} className={cn(className)}>
      {props.children}
    </ScheduleItemPrimitive.Tags>
  );
});

ScheduleItemTags.displayName = 'ScheduleItemTags';

/**
 * Repeater component for schedule item tags.
 * Handles the iteration over tags associated with the schedule item.
 *
 * @component
 */
export const ScheduleItemTagRepeater = ScheduleItemPrimitive.TagRepeater;
