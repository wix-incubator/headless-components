import { Order as OrderPrimitive } from '@wix/events/components';
import React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

/**
 * Root component for order display.
 * Provides context for all order related components like order number, email, dates, invoice items, etc.
 *
 * @component
 * @example
 * ```tsx
 * <Order orderServiceConfig={orderServiceConfig}>
 *   <OrderNumber />
 *   <OrderGuestEmail />
 *   <OrderCreatedDate />
 *   <OrderInvoiceItems>
 *     <OrderInvoiceItemRepeater>
 *       // InvoiceItem components here
 *     </OrderInvoiceItemRepeater>
 *   </OrderInvoiceItems>
 *   <OrderTotal />
 * </Order>
 * ```
 */
export const Order = OrderPrimitive.Root;

/**
 * Displays the order number.
 *
 * @component
 */
export const OrderNumber = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.OrderNumber>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.OrderNumber>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.OrderNumber
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

OrderNumber.displayName = 'OrderNumber';

/**
 * Displays the guest email.
 *
 * @component
 */
export const OrderGuestEmail = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.GuestEmail>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.GuestEmail>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.GuestEmail
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderGuestEmail.displayName = 'OrderGuestEmail';

/**
 * Displays the order creation date.
 *
 * @component
 */
export const OrderCreatedDate = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.CreatedDate>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.CreatedDate>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.CreatedDate
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-sm sm:text-base',
        className
      )}
    />
  );
});

OrderCreatedDate.displayName = 'OrderCreatedDate';

/**
 * Displays the download tickets button.
 *
 * @component
 */
export const OrderDownloadTicketsButton = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.DownloadTicketsButton>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.DownloadTicketsButton> &
    VariantProps<typeof buttonVariants>
>(({ variant, size, className, ...props }, ref) => {
  return (
    <OrderPrimitive.DownloadTicketsButton
      {...props}
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
});

OrderDownloadTicketsButton.displayName = 'OrderDownloadTicketsButton';

/**
 * Container for order invoice items.
 * Handles layout and spacing for invoice items.
 *
 * @component
 */
export const OrderInvoiceItems = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.InvoiceItems>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.InvoiceItems>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.InvoiceItems
      {...props}
      ref={ref}
      className={cn(className)}
    />
  );
});

OrderInvoiceItems.displayName = 'OrderInvoiceItems';

/**
 * Repeater component for individual invoice items.
 * Handles the iteration over invoice items.
 *
 * @component
 */
export const OrderInvoiceItemRepeater = OrderPrimitive.InvoiceItemRepeater;

/**
 * Displays the order subtotal.
 *
 * @component
 */
export const OrderSubtotal = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.Subtotal>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.Subtotal>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.Subtotal
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderSubtotal.displayName = 'OrderSubtotal';

/**
 * Displays the order tax.
 *
 * @component
 */
export const OrderTax = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.Tax>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.Tax>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.Tax
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderTax.displayName = 'OrderTax';

/**
 * Displays the order fee.
 *
 * @component
 */
export const OrderFee = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.Fee>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.Fee>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.Fee
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderFee.displayName = 'OrderFee';

/**
 * Displays the order paid plan discount.
 *
 * @component
 */
export const OrderPaidPlanDiscount = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.PaidPlanDiscount>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.PaidPlanDiscount>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.PaidPlanDiscount
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderPaidPlanDiscount.displayName = 'OrderPaidPlanDiscount';

/**
 * Displays the order coupon discount.
 *
 * @component
 */
export const OrderCouponDiscount = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.CouponDiscount>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.CouponDiscount>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.CouponDiscount
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderCouponDiscount.displayName = 'OrderCouponDiscount';

/**
 * Displays the order total.
 *
 * @component
 */
export const OrderTotal = React.forwardRef<
  React.ElementRef<typeof OrderPrimitive.Total>,
  React.ComponentPropsWithoutRef<typeof OrderPrimitive.Total>
>(({ className, ...props }, ref) => {
  return (
    <OrderPrimitive.Total
      {...props}
      ref={ref}
      className={cn(
        'block font-paragraph text-foreground text-base',
        className
      )}
    />
  );
});

OrderTotal.displayName = 'OrderTotal';
