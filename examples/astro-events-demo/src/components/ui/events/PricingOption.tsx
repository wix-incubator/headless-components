import { PricingOption as PricingOptionPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for pricing option display.
 * Provides context for all pricing option related components like name, pricing, quantity, etc.
 *
 * @component
 * @example
 * ```tsx
 * <PricingOption pricingOption={pricingOption}>
 *   <PricingOptionName />
 *   <PricingOptionPricing />
 *   <PricingOptionQuantity />
 * </PricingOption>
 * ```
 */
export const PricingOption = PricingOptionPrimitive.Root;

/**
 * Displays name of the pricing option.
 *
 * @component
 */
export const PricingOptionName = React.forwardRef<
  React.ElementRef<typeof PricingOptionPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof PricingOptionPrimitive.Name>
>(({ className, ...props }, ref) => {
  return (
    <PricingOptionPrimitive.Name
      {...props}
      ref={ref}
      className={cn('block font-paragraph text-foreground text-sm', className)}
    />
  );
});

PricingOptionName.displayName = 'PricingOptionName';

/**
 * Displays pricing of the pricing option.
 *
 * @component
 */
export const PricingOptionPricing = React.forwardRef<
  React.ElementRef<typeof PricingOptionPrimitive.Pricing>,
  React.ComponentPropsWithoutRef<typeof PricingOptionPrimitive.Pricing>
>(({ className, ...props }, ref) => {
  return (
    <PricingOptionPrimitive.Pricing
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-xl sm:text-base',
        className
      )}
    />
  );
});

PricingOptionPricing.displayName = 'PricingOptionPricing';

/**
 * Displays tax of the pricing option.
 * Only renders when the pricing option has tax.
 *
 * @component
 */
export const PricingOptionTax = React.forwardRef<
  React.ElementRef<typeof PricingOptionPrimitive.Tax>,
  React.ComponentPropsWithoutRef<typeof PricingOptionPrimitive.Tax>
>(({ className, ...props }, ref) => {
  return (
    <PricingOptionPrimitive.Tax
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

PricingOptionTax.displayName = 'PricingOptionTax';

/**
 * Displays fee of the pricing option.
 * Only renders when the pricing option has fee.
 *
 * @component
 */
export const PricingOptionFee = React.forwardRef<
  React.ElementRef<typeof PricingOptionPrimitive.Fee>,
  React.ComponentPropsWithoutRef<typeof PricingOptionPrimitive.Fee>
>(({ className, ...props }, ref) => {
  return (
    <PricingOptionPrimitive.Fee
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

PricingOptionFee.displayName = 'PricingOptionFee';

/**
 * Displays quantity controls for the pricing option.
 * Only renders when the sale has started and the ticket definition is not sold out.
 *
 * @component
 */
export const PricingOptionQuantity = React.forwardRef<
  React.ElementRef<typeof PricingOptionPrimitive.Quantity>,
  React.ComponentPropsWithoutRef<typeof PricingOptionPrimitive.Quantity>
>(({ className, ...props }, ref) => {
  return (
    <PricingOptionPrimitive.Quantity
      {...props}
      ref={ref}
      className={cn(
        'bg-background border border-foreground/60 py-2 px-3 font-paragraph text-foreground text-base min-w-24 w-full sm:w-auto',
        className
      )}
    />
  );
});

PricingOptionQuantity.displayName = 'PricingOptionQuantity';
