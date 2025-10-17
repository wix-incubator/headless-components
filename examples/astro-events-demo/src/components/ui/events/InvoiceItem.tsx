import { InvoiceItem as InvoiceItemPrimitive } from '@wix/events/components';
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Root component for invoice item display.
 * Provides context for all invoice item related components like name, price, quantity, total, etc.
 *
 * @component
 * @example
 * ```tsx
 * <InvoiceItem invoiceItem={invoiceItem}>
 *   <InvoiceItemName />
 *   <InvoiceItemPrice />
 *   <InvoiceItemQuantity />
 *   <InvoiceItemTotal />
 * </InvoiceItem>
 * ```
 */
export const InvoiceItem = InvoiceItemPrimitive.Root;

/**
 * Displays the invoice item name.
 *
 * @component
 */
export const InvoiceItemName = React.forwardRef<
  React.ElementRef<typeof InvoiceItemPrimitive.Name>,
  React.ComponentPropsWithoutRef<typeof InvoiceItemPrimitive.Name>
>(({ className, ...props }, ref) => {
  return (
    <InvoiceItemPrimitive.Name
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

InvoiceItemName.displayName = 'InvoiceItemName';

/**
 * Displays the invoice item price.
 *
 * @component
 */
export const InvoiceItemPrice = React.forwardRef<
  React.ElementRef<typeof InvoiceItemPrimitive.Price>,
  React.ComponentPropsWithoutRef<typeof InvoiceItemPrimitive.Price>
>(({ className, ...props }, ref) => {
  return (
    <InvoiceItemPrimitive.Price
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

InvoiceItemPrice.displayName = 'InvoiceItemPrice';

/**
 * Displays the invoice item quantity.
 *
 * @component
 */
export const InvoiceItemQuantity = React.forwardRef<
  React.ElementRef<typeof InvoiceItemPrimitive.Quantity>,
  React.ComponentPropsWithoutRef<typeof InvoiceItemPrimitive.Quantity>
>(({ className, ...props }, ref) => {
  return (
    <InvoiceItemPrimitive.Quantity
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

InvoiceItemQuantity.displayName = 'InvoiceItemQuantity';

/**
 * Displays the invoice item total.
 *
 * @component
 */
export const InvoiceItemTotal = React.forwardRef<
  React.ElementRef<typeof InvoiceItemPrimitive.Total>,
  React.ComponentPropsWithoutRef<typeof InvoiceItemPrimitive.Total>
>(({ className, ...props }, ref) => {
  return (
    <InvoiceItemPrimitive.Total
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

InvoiceItemTotal.displayName = 'InvoiceItemTotal';
