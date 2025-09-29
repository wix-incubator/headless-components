import { TicketDefinition as TicketDefinitionPrimitive } from '@wix/headless-events/react';
import React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Root component for ticket definition display.
 * Provides context for all ticket definition related components like name, description, pricing, etc.
 *
 * @component
 * @example
 * ```tsx
 * <TicketDefinition ticketDefinition={ticketDefinition}>
 *   <TicketDefinitionName />
 *   <TicketDefinitionDescription />
 *   <TicketDefinitionFixedPricing />
 *   <TicketDefinitionGuestPricing />
 *   <TicketDefinitionRemaining />
 *   <TicketDefinitionSaleStartDate />
 *   <TicketDefinitionSaleEndDate />
 *   <TicketDefinitionQuantity />
 *   <TicketDefinitionPricingOptions>
 *     <TicketDefinitionPricingOptionRepeater>
 *       // PricingOption components go here
 *     </TicketDefinitionPricingOptionRepeater>
 *   </TicketDefinitionPricingOptions>
 * </TicketDefinition>
 * ```
 */
export const TicketDefinition = TicketDefinitionPrimitive.Root;

/**
 * Displays name of the ticket definition.
 *
 * @component
 */
export const TicketDefinitionName = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Name>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-xl sm:text-base',
        className
      )}
    />
  );
});

TicketDefinitionName.displayName = 'TicketDefinitionName';

/**
 * Displays description of the ticket definition.
 * Only renders when there is a description available.
 *
 * @component
 */
export const TicketDefinitionDescription = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Description
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

TicketDefinitionDescription.displayName = 'TicketDefinitionDescription';

/**
 * Displays fixed pricing of the ticket definition.
 * Only renders when the ticket definition has fixed price pricing method.
 *
 * @component
 */
export const TicketDefinitionFixedPricing = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.FixedPricing>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.FixedPricing>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.FixedPricing
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-xl sm:text-base',
        className
      )}
    />
  );
});

TicketDefinitionFixedPricing.displayName = 'TicketDefinitionFixedPricing';

/**
 * Displays guest pricing input for pay-what-you-want tickets.
 * Only renders when the ticket definition has guest price pricing method.
 *
 * @component
 */
export const TicketDefinitionGuestPricing = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.GuestPricing>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.GuestPricing>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.GuestPricing
      {...props}
      ref={ref}
      className={cn(
        'bg-background border border-foreground/60 py-2 px-3 font-paragraph text-foreground text-base placeholder:text-foreground/50 w-full sm:w-auto',
        className
      )}
    />
  );
});

TicketDefinitionGuestPricing.displayName = 'TicketDefinitionGuestPricing';

/**
 * Displays pricing range of the ticket definition.
 * Only renders when the ticket definition has pricing options.
 *
 * @component
 */
export const TicketDefinitionPricingRange = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.PricingRange>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.PricingRange>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.PricingRange
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-xl sm:text-base',
        className
      )}
    />
  );
});

TicketDefinitionPricingRange.displayName = 'TicketDefinitionPricingRange';

/**
 * Displays tax of the ticket definition.
 * Only renders when the ticket definition has tax.
 *
 * @component
 */
export const TicketDefinitionTax = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Tax>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Tax>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Tax
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

TicketDefinitionTax.displayName = 'TicketDefinitionTax';

/**
 * Displays fee of the ticket definition.
 * Only renders when the ticket definition has fee.
 *
 * @component
 */
export const TicketDefinitionFee = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Fee>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Fee>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Fee
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

TicketDefinitionFee.displayName = 'TicketDefinitionFee';

/**
 * Container for pricing options.
 * Only renders when there are pricing options available.
 *
 * @component
 */
export const TicketDefinitionPricingOptions = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.PricingOptions>,
  React.ComponentPropsWithoutRef<
    typeof TicketDefinitionPrimitive.PricingOptions
  >
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.PricingOptions
      {...props}
      ref={ref}
      className={cn(className)}
    />
  );
});

TicketDefinitionPricingOptions.displayName = 'TicketDefinitionPricingOptions';

/**
 * Repeater component for individual pricing options.
 * Handles the iteration over pricing options.
 *
 * @component
 */
export const TicketDefinitionPricingOptionRepeater =
  TicketDefinitionPrimitive.PricingOptionRepeater;

/**
 * Displays the remaining count.
 *
 * @component
 */
export const TicketDefinitionRemaining = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Remaining>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Remaining>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Remaining
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

TicketDefinitionRemaining.displayName = 'TicketDefinitionRemaining';

/**
 * Displays sale start date.
 * Only renders when the sale is scheduled to start in the future.
 *
 * @component
 */
export const TicketDefinitionSaleStartDate = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.SaleStartDate>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.SaleStartDate>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.SaleStartDate
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

TicketDefinitionSaleStartDate.displayName = 'TicketDefinitionSaleStartDate';

/**
 * Displays sale end date.
 * Only renders when the sale has started or ended.
 *
 * @component
 */
export const TicketDefinitionSaleEndDate = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.SaleEndDate>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.SaleEndDate>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.SaleEndDate
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

TicketDefinitionSaleEndDate.displayName = 'TicketDefinitionSaleEndDate';

/**
 * Displays quantity controls of the ticket definition.
 *
 * @component
 */
export const TicketDefinitionQuantity = React.forwardRef<
  React.ElementRef<typeof TicketDefinitionPrimitive.Quantity>,
  React.ComponentPropsWithoutRef<typeof TicketDefinitionPrimitive.Quantity>
>(({ className, ...props }, ref) => {
  return (
    <TicketDefinitionPrimitive.Quantity
      {...props}
      ref={ref}
      className={cn(
        'bg-background border border-foreground/60 py-2 px-3 font-paragraph text-foreground text-base min-w-24 w-full sm:w-auto',
        className
      )}
    />
  );
});

TicketDefinitionQuantity.displayName = 'TicketDefinitionQuantity';

interface TicketDefinitionBadgeProps {
  label: string;
  className?: string;
}

/**
 * Displays a badge for the ticket definition.
 *
 * @component
 */
export const TicketDefinitionBadge = React.forwardRef<
  HTMLDivElement,
  TicketDefinitionBadgeProps
>(({ label, className, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        'self-start bg-foreground/10 rounded-xl px-3 py-1 text-xs font-paragraph text-foreground/80',
        className
      )}
    >
      {label}
    </div>
  );
});

TicketDefinitionBadge.displayName = 'TicketDefinitionBadge';
