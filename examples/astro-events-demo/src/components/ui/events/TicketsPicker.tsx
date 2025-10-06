import { TicketsPicker as TicketsPickerPrimitive } from '@wix/events/components';
import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * Root component for tickets picker display and interaction.
 * Provides context for all tickets picker related components.
 *
 * @component
 * @example
 * ```tsx
 * <TicketsPicker>
 *   <TicketDefinitions>
 *     <TicketDefinitionRepeater>
 *       // Ticket definition content here
 *     </TicketDefinitionRepeater>
 *   </TicketDefinitions>
 * </TicketsPicker>
 * ```
 */
export const TicketsPicker = TicketsPickerPrimitive.Root;

/**
 * Container for ticket definitions in a list.
 * Handles layout and spacing for multiple ticket definitions.
 *
 * @component
 */
export const TicketDefinitions = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.TicketDefinitions>,
  React.ComponentPropsWithoutRef<
    typeof TicketsPickerPrimitive.TicketDefinitions
  >
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.TicketDefinitions
      {...props}
      ref={ref}
      className={cn(className)}
    >
      {props.children}
    </TicketsPickerPrimitive.TicketDefinitions>
  );
});

TicketDefinitions.displayName = 'TicketDefinitions';

/**
 * Repeater component for individual ticket definitions.
 * Handles the iteration over ticket definitions in the list.
 *
 * @component
 */
export const TicketDefinitionRepeater =
  TicketsPickerPrimitive.TicketDefinitionRepeater;

/**
 * Provides totals data for the tickets picker.
 *
 * @component
 */
export const TicketsPickerTotals = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.Totals>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.Totals>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.Totals
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-xl', className)}
    />
  );
});

TicketsPickerTotals.displayName = 'TicketsPickerTotals';

/**
 * Error component for displaying checkout error.
 * Shows error message when checkout fails.
 *
 * @component
 */
export const CheckoutError = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.CheckoutError>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.CheckoutError>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.CheckoutError
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-status-danger text-base',
        className
      )}
    />
  );
});

CheckoutError.displayName = 'CheckoutError';

/**
 * Trigger component for initiating the checkout process.
 *
 * @component
 */
export const CheckoutTrigger = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.CheckoutTrigger>,
  React.ComponentPropsWithoutRef<
    typeof TicketsPickerPrimitive.CheckoutTrigger
  > &
    VariantProps<typeof buttonVariants>
>(({ variant, size, className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.CheckoutTrigger
      {...props}
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
});
