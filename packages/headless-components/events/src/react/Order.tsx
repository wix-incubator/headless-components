import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type OrderServiceConfig } from '../services/order-service.js';
import { InvoiceItem as InvoiceItemType } from '../services/invoice-item-service.js';
import * as InvoiceItem from './InvoiceItem.js';
import * as CoreOrder from './core/Order.js';

enum TestIds {
  orderNumber = 'order-number',
  orderGuestEmail = 'order-guest-email',
  orderCreatedDate = 'order-created-date',
  orderDownloadTicketsButton = 'order-download-tickets-button',
  orderInvoiceItems = 'order-invoice-items',
  orderSubtotal = 'order-subtotal',
  orderTax = 'order-tax',
  orderFee = 'order-fee',
  orderTotal = 'order-total',
  orderPaidPlanDiscount = 'order-paid-plan-discount',
  orderCouponDiscount = 'order-coupon-discount',
}

/**
 * Props for the Order Root component.
 */
export interface RootProps {
  /** Configuration for the order service */
  orderServiceConfig?: OrderServiceConfig;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Order Root component that provides order service context to child components.
 * Must be used as the top-level component for order functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * <Order.Root orderServiceConfig={orderServiceConfig}>
 *   <Order.InvoiceItems className="px-6 border-b border-gray-300">
 *     <Order.InvoiceItemRepeater className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *       <InvoiceItem.Name className="w-[35%]" />
 *       <InvoiceItem.Price className="w-[25%]" />
 *       <InvoiceItem.Quantity className="w-[15%]" />
 *       <InvoiceItem.Total className="w-[25%] text-right" />
 *     </Order.InvoiceItemRepeater>
 *   </Order.InvoiceItems>
 * </Order.Root>
 * ```
 */
export const Root = (props: RootProps): React.ReactNode => {
  const { children, orderServiceConfig } = props;

  return (
    <CoreOrder.Root orderServiceConfig={orderServiceConfig}>
      {children}
    </CoreOrder.Root>
  );
};

/**
 * Props for the Order OrderNumber component.
 */
export interface OrderNumberProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ orderNumber: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order number with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.OrderNumber className="font-light text-lg text-gray-700" />
 *
 * // asChild with primitive
 * <Order.OrderNumber asChild>
 *   <h2 className="text-xl font-bold text-gray-900" />
 * </Order.OrderNumber>
 *
 * // asChild with react component
 * <Order.OrderNumber
 *   asChild
 *   className="font-light text-sm text-gray-700"
 * >
 *   {({ orderNumber }) => (
 *     <span>Order No. #{orderNumber}</span>
 *   )}
 * </Order.OrderNumber>
 * ```
 */
export const OrderNumber = React.forwardRef<HTMLElement, OrderNumberProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.OrderNumber>
        {({ orderNumber }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderNumber}
            customElement={children}
            customElementProps={{ orderNumber }}
            content={orderNumber}
            {...otherProps}
          >
            <span>{orderNumber}</span>
          </AsChildSlot>
        )}
      </CoreOrder.OrderNumber>
    );
  },
);

/**
 * Props for the Order GuestEmail component.
 */
export interface GuestEmailProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ guestEmail: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the guest email with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.GuestEmail className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.GuestEmail asChild>
 *   <p className="text-sm text-gray-500 font-light" />
 * </Order.GuestEmail>
 *
 * // asChild with react component
 * <Order.GuestEmail asChild>
 *   {({ guestEmail }) => (
 *     <span>Email: {guestEmail}</span>
 *   )}
 * </Order.GuestEmail>
 * ```
 */
export const GuestEmail = React.forwardRef<HTMLElement, GuestEmailProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.GuestEmail>
        {({ guestEmail }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderGuestEmail}
            customElement={children}
            customElementProps={{ guestEmail }}
            content={guestEmail}
            {...otherProps}
          >
            <span>{guestEmail}</span>
          </AsChildSlot>
        )}
      </CoreOrder.GuestEmail>
    );
  },
);

/**
 * Props for the Order CreatedDate component.
 */
export interface CreatedDateProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    createdDate: Date;
    formattedDate: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order creation date with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.CreatedDate className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.CreatedDate asChild>
 *   <p className="text-sm text-gray-500 font-light" />
 * </Order.CreatedDate>
 *
 * // asChild with react component
 * <Order.CreatedDate
 *   asChild
 *   className="font-light text-sm text-gray-700"
 * >
 *   {({ createdDate, formattedDate }) => (
 *     <span>Placed on: {formattedDate}</span>
 *   )}
 * </Order.CreatedDate>
 * ```
 */
export const CreatedDate = React.forwardRef<HTMLElement, CreatedDateProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.CreatedDate>
        {({ createdDate, formattedDate }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderCreatedDate}
            customElement={children}
            customElementProps={{ createdDate, formattedDate }}
            content={formattedDate}
            {...otherProps}
          >
            <span>{formattedDate}</span>
          </AsChildSlot>
        )}
      </CoreOrder.CreatedDate>
    );
  },
);

/**
 * Props for the Order DownloadTicketsButton component.
 */
export interface DownloadTicketsButtonProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ ticketsPdfUrl: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: React.ReactNode;
}

/**
 * Download tickets button that provides access to event tickets PDF.
 * Only shows when tickets are available for download.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.DownloadTicketsButton
 *   label="Download Tickets"
 *   className="bg-blue-500 text-white px-4 py-2 rounded"
 * />
 *
 * // asChild with primitive
 * <Order.DownloadTicketsButton asChild>
 *   <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
 *     Download Tickets
 *   </button>
 * </Order.DownloadTicketsButton>
 *
 * // asChild with react component
 * <Order.DownloadTicketsButton asChild>
 *   {({ ticketsPdfUrl }) =>
 *     <button
 *       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
 *       onClick={() => window.open(ticketsPdfUrl, '_blank')}
 *     >
 *       Download Tickets
 *     </button>
 *   }
 * </Order.DownloadTicketsButton>
 * ```
 */
export const DownloadTicketsButton = React.forwardRef<
  HTMLElement,
  DownloadTicketsButtonProps
>((props, ref) => {
  const { asChild, children, className, label, ...otherProps } = props;

  return (
    <CoreOrder.DownloadTicketsButton>
      {({ ticketsPdfUrl }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderDownloadTicketsButton}
          customElement={children}
          customElementProps={{ ticketsPdfUrl }}
          onClick={() => window.open(ticketsPdfUrl, '_blank')}
          {...otherProps}
        >
          <button>{label}</button>
        </AsChildSlot>
      )}
    </CoreOrder.DownloadTicketsButton>
  );
});

/**
 * Props for the Order InvoiceItems component.
 */
export interface InvoiceItemsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{ invoiceItems: InvoiceItemType[] }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for order invoice items with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * <Order.InvoiceItems className="px-6 border-b border-gray-300">
 *   <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *     <div className="w-[35%]">Ticket type</div>
 *     <div className="w-[25%]">Price</div>
 *     <div className="w-[15%]">Quantity</div>
 *     <div className="w-[25%] text-right">Total</div>
 *   </div>
 *   <Order.InvoiceItemRepeater className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *     <InvoiceItem.Name className="w-[35%]" />
 *     <InvoiceItem.Price className="w-[25%]" />
 *     <InvoiceItem.Quantity className="w-[15%]" />
 *     <InvoiceItem.Total className="w-[25%] text-right" />
 *   </Order.InvoiceItemRepeater>
 * </Order.InvoiceItems>
 * ```
 */
export const InvoiceItems = React.forwardRef<HTMLElement, InvoiceItemsProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.InvoiceItems>
        {({ invoiceItems }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderInvoiceItems}
            customElement={children}
            customElementProps={{ invoiceItems }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        )}
      </CoreOrder.InvoiceItems>
    );
  },
);

/**
 * Props for the Order InvoiceItemRepeater component.
 */
export interface InvoiceItemRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the invoice item element */
  className?: string;
}

/**
 * Repeater component that renders InvoiceItem.Root for each invoice item in the order.
 * Must be used within Order.InvoiceItems component.
 *
 * @component
 * @example
 * ```tsx
 * <Order.InvoiceItems>
 *   <Order.InvoiceItemRepeater className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *     <InvoiceItem.Name className="w-[35%]" />
 *     <InvoiceItem.Price className="w-[25%]" />
 *     <InvoiceItem.Quantity className="w-[15%]" />
 *     <InvoiceItem.Total className="w-[25%] text-right" />
 *   </Order.InvoiceItemRepeater>
 * </Order.InvoiceItems>
 * ```
 */
export const InvoiceItemRepeater = (props: InvoiceItemRepeaterProps) => {
  const { children, className } = props;

  return (
    <CoreOrder.InvoiceItemRepeater>
      {({ invoiceItems }) =>
        invoiceItems.map((invoiceItem) => (
          <InvoiceItem.Root
            key={invoiceItem._id}
            invoiceItem={invoiceItem}
            className={className}
          >
            {children}
          </InvoiceItem.Root>
        ))
      }
    </CoreOrder.InvoiceItemRepeater>
  );
};

/**
 * Props for the Order Subtotal component.
 */
export interface SubtotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedAmount: string;
    amount: number;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order subtotal amount with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.Subtotal className="text-lg font-light text-gray-700" />
 *
 * // asChild with primitive
 * <Order.Subtotal asChild>
 *   <p className="text-lg font-light text-gray-700" />
 * </Order.Subtotal>
 *
 * // asChild with react component
 * <Order.Subtotal
 *   asChild
 *   className="font-light text-gray-700 justify-between flex"
 * >
 *   {({ formattedAmount, amount, currency }) => (
 *     <div>
 *       <span>Subtotal:</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.Subtotal>
 * ```
 */
export const Subtotal = React.forwardRef<HTMLElement, SubtotalProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.Subtotal>
        {({ formattedAmount, amount, currency }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderSubtotal}
            customElement={children}
            customElementProps={{ formattedAmount, amount, currency }}
            content={formattedAmount}
            {...otherProps}
          >
            <span>{formattedAmount}</span>
          </AsChildSlot>
        )}
      </CoreOrder.Subtotal>
    );
  },
);

/**
 * Props for the Order PaidPlanDiscount component.
 */
export interface PaidPlanDiscountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedAmount: string;
    rate: number;
    amount: number;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order paid plan discount with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.PaidPlanDiscount className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.PaidPlanDiscount asChild>
 *   <p className="text-sm text-gray-600 font-light" />
 * </Order.PaidPlanDiscount>
 *
 * // asChild with react component
 * <Order.PaidPlanDiscount asChild>
 *   {({ formattedAmount, rate, amount, currency }) => (
 *     <div>
 *       <span>Paid Plan Discount ({rate}%)</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.PaidPlanDiscount>
 * ```
 */
export const PaidPlanDiscount = React.forwardRef<
  HTMLElement,
  PaidPlanDiscountProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.PaidPlanDiscount>
      {({ formattedAmount, rate, amount, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderPaidPlanDiscount}
          customElement={children}
          customElementProps={{ formattedAmount, rate, amount, currency }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CoreOrder.PaidPlanDiscount>
  );
});

/**
 * Props for the Order CouponDiscount component.
 */
export interface CouponDiscountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedAmount: string;
    amount: number;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order coupon discount with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.CouponDiscount className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.CouponDiscount asChild>
 *   <p className="text-sm text-gray-600 font-light" />
 * </Order.CouponDiscount>
 *
 * // asChild with react component
 * <Order.CouponDiscount asChild>
 *   {({ formattedAmount, amount, currency }) => (
 *     <div>
 *       <span>Coupon Discount</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.CouponDiscount>
 * ```
 */
export const CouponDiscount = React.forwardRef<
  HTMLElement,
  CouponDiscountProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.CouponDiscount>
      {({ formattedAmount, amount, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderCouponDiscount}
          customElement={children}
          customElementProps={{ formattedAmount, amount, currency }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CoreOrder.CouponDiscount>
  );
});

/**
 * Props for the Order Tax component.
 */
export interface TaxProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    rate: number;
    amount: number;
    currency: string;
    formattedAmount: string;
    name: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order tax with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.Tax className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.Tax asChild>
 *   <p className="text-sm text-gray-600 font-light" />
 * </Order.Tax>
 *
 * // asChild with react component
 * <Order.Tax
 *   asChild
 *   className="font-light text-gray-700 justify-between flex"
 * >
 *   {({ rate, amount, currency, formattedAmount, name }) => (
 *     <div>
 *       <span>{name} ({rate}%)</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.Tax>
 * ```
 */
export const Tax = React.forwardRef<HTMLElement, TaxProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.Tax>
      {({ rate, amount, currency, formattedAmount, name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderTax}
          customElement={children}
          customElementProps={{ rate, amount, currency, formattedAmount, name }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CoreOrder.Tax>
  );
});

/**
 * Props for the Order Fee component.
 */
export interface FeeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedAmount: string;
    rate: number;
    amount: number;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order fee with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.Fee className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.Fee asChild>
 *   <p className="text-sm text-gray-600 font-light" />
 * </Order.Fee>
 *
 * // asChild with react component
 * <Order.Fee
 *   asChild
 *   className="font-light text-gray-700 justify-between flex"
 * >
 *   {({ formattedAmount, rate, amount, currency }) => (
 *     <div>
 *       <span>Service Fee ({rate}%)</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.Fee>
 * ```
 */
export const Fee = React.forwardRef<HTMLElement, FeeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.Fee>
      {({ formattedAmount, rate, amount, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderFee}
          customElement={children}
          customElementProps={{ formattedAmount, rate, amount, currency }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CoreOrder.Fee>
  );
});

/**
 * Props for the Order Total component.
 */
export interface TotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedAmount: string;
    amount: number;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order total amount with customizable rendering.
 * This represents the final amount to be paid including all fees and taxes.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.Total className="text-xl font-light text-gray-700" />
 *
 * // asChild with primitive
 * <Order.Total asChild>
 *   <p className="text-2xl font-bold text-gray-900" />
 * </Order.Total>
 *
 * // asChild with react component
 * <Order.Total
 *   asChild
 *   className="font-light text-gray-700 justify-between flex py-5"
 * >
 *   {({ formattedAmount, amount, currency }) => (
 *     <div>
 *       <span>Total:</span>
 *       <span>{formattedAmount}</span>
 *     </div>
 *   )}
 * </Order.Total>
 * ```
 */
export const Total = React.forwardRef<HTMLElement, TotalProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.Total>
      {({ formattedAmount, amount, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderTotal}
          customElement={children}
          customElementProps={{ formattedAmount, amount, currency }}
          content={formattedAmount}
          {...otherProps}
        >
          <span>{formattedAmount}</span>
        </AsChildSlot>
      )}
    </CoreOrder.Total>
  );
});
