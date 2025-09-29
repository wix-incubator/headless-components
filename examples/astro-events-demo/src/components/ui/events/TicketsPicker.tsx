import { TicketsPicker as TicketsPickerPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

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
 * Displays the total amount.
 *
 * @component
 */
export const TicketsPickerTotal = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.Total>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.Total>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.Total
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-xl', className)}
    />
  );
});

TicketsPickerTotal.displayName = 'TicketsPickerTotal';

/**
 * Displays the subtotal amount.
 *
 * @component
 */
export const TicketsPickerSubtotal = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.Subtotal>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.Subtotal>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.Subtotal
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

TicketsPickerSubtotal.displayName = 'TicketsPickerSubtotal';

/**
 * Displays the tax amount.
 *
 * @component
 */
export const TicketsPickerTax = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.Tax>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.Tax>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.Tax
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

TicketsPickerTax.displayName = 'TicketsPickerTax';

/**
 * Displays the fee amount.
 *
 * @component
 */
export const TicketsPickerFee = React.forwardRef<
  React.ElementRef<typeof TicketsPickerPrimitive.Fee>,
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.Fee>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.Fee
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

TicketsPickerFee.displayName = 'TicketsPickerFee';

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
  React.ComponentPropsWithoutRef<typeof TicketsPickerPrimitive.CheckoutTrigger>
>(({ className, ...props }, ref) => {
  return (
    <TicketsPickerPrimitive.CheckoutTrigger
      {...props}
      ref={ref}
      className={cn(
        'block bg-primary text-primary-foreground font-paragraph text-base py-2 sm:py-3 px-20 hover:bg-primary/80 w-full',
        className
      )}
    />
  );
});
