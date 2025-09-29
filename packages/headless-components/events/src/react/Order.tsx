import * as CoreOrder from './core/Order.js';
import { type OrderServiceConfig } from '../services/order-service.js';
import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { InvoiceItem as InvoiceItemType } from '../services/invoice-item-service.js';
import * as InvoiceItem from './InvoiceItem.js';

enum TestIds {
  orderRoot = 'order-root',
  orderNumber = 'order-number',
  orderCreatedDate = 'order-created-date',
  orderDownloadTicketsButton = 'order-download-tickets-button',
  orderInvoiceItems = 'order-invoice-items',
  orderSubtotal = 'order-subtotal',
  orderTax = 'order-tax',
  orderServiceFee = 'order-service-fee',
  orderTotal = 'order-total',
}

/**
 * Props for the Order Root component.
 */
export interface RootProps {
  /** Configuration for the order service */
  orderServiceConfig: OrderServiceConfig;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Order Root component that provides order service context to child components.
 * This is the top-level component that must wrap all other Order components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * <Order.Root orderServiceConfig={orderServiceConfig}>
 *   <Order.InvoiceItems className="px-6 border-b border-gray-300">
 *     <Order.InvoiceItemRepeater>
 *       <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *         <InvoiceItem.Name className="w-[35%]" />
 *         <InvoiceItem.Price className="w-[25%]" />
 *         <InvoiceItem.Quantity className="w-[15%]" />
 *         <InvoiceItem.Total className="w-[25%] text-right" />
 *       </div>
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
 *     <span>{`Order No. #${orderNumber}`}</span>
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
 * Props for the Order CreatedDate component.
 */
export interface CreatedDateProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ createdDate: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order creation date with readiness status and customizable rendering.
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
 *   {({ createdDate }) => (
 *     <span>{`Placed on: ${createdDate}`}</span>
 *   )}
 * </Order.CreatedDate>
 * ```
 */
export const CreatedDate = React.forwardRef<HTMLElement, CreatedDateProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.CreatedDate>
        {({ createdDate }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderCreatedDate}
            customElement={children}
            customElementProps={{ createdDate }}
            content={createdDate}
            {...otherProps}
          >
            <span>{createdDate}</span>
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
  /** The label to display inside the button */
  label?: string;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ ticketsPdfUrl: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Download tickets button that provides access to event tickets PDF.
 * Only shows when tickets are available for download.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage with custom label
 * <Order.DownloadTicketsButton
 *   label="Download My Tickets"
 *   className="bg-blue-500 text-white px-4 py-2 rounded"
 * />
 *
 * // asChild with primitive
 * <Order.DownloadTicketsButton asChild>
 *   <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" />
 * </Order.DownloadTicketsButton>
 *
 * // asChild with react component
 * <Order.DownloadTicketsButton asChild>
 *   {({ ticketsPdfUrl }) =>
 *       <button
 *         className="block font-light py-3 px-20 ml-auto bg-blue-500 text-white rounded"
 *         onClick={() => window.open(ticketsPdfUrl, '_blank')}
 *       >
 *         Download Tickets
 *       </button>
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
          content={ticketsPdfUrl}
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
    | AsChildChildren<{
        invoiceItems: InvoiceItemType[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for order invoice items with customizable rendering.
 * Provides access to the list of invoice items for further processing.
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
 *   <Order.InvoiceItemRepeater>
 *     <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *       <div className="w-[35%]"><InvoiceItem.Name /></div>
 *       <div className="w-[25%]"><InvoiceItem.Price /></div>
 *       <div className="w-[15%]"><InvoiceItem.Quantity /></div>
 *       <div className="w-[25%] text-right"><InvoiceItem.Total /></div>
 *     </div>
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
            content={invoiceItems}
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
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Repeater component that renders InvoiceItem.Root for each invoice item in the order.
 * Must be used within Order.InvoiceItems component.
 *
 * @component
 * @example
 * ```tsx
 * // Table-like layout
 * <Order.InvoiceItems>
 *   <Order.InvoiceItemRepeater>
 *     <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *       <InvoiceItem.Name className="w-[35%]" />
 *       <InvoiceItem.Price className="w-[25%]" />
 *       <InvoiceItem.Quantity className="w-[15%]" />
 *       <InvoiceItem.Total className="w-[25%] text-right" />
 *     </div>
 *   </Order.InvoiceItemRepeater>
 * </Order.InvoiceItems>
 *
 * // Simple card layout
 * <Order.InvoiceItems>
 *   <Order.InvoiceItemRepeater className="border-b border-gray-200 last:border-b-0">
 *     <div className="flex justify-between items-center p-4">
 *       <div>
 *         <InvoiceItem.Name className="font-medium text-gray-900" />
 *         <InvoiceItem.Quantity className="text-sm text-gray-500" />
 *       </div>
 *       <div className="text-right">
 *         <InvoiceItem.Price className="text-sm text-gray-600" />
 *         <InvoiceItem.Total className="font-semibold text-gray-900" />
 *       </div>
 *     </div>
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
  children?: AsChildChildren<{ value: string; currency: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order subtotal amount with currency and customizable rendering.
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
 *   {({ value, currency }) => (
 *     <div>
 *       <span>Subtotal:</span>
 *       <span>{`${value} ${currency}`}</span>
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
        {({ value, currency }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderSubtotal}
            customElement={children}
            customElementProps={{ value, currency }}
            content={value}
            {...otherProps}
          >
            <span>{value}</span>
          </AsChildSlot>
        )}
      </CoreOrder.Subtotal>
    );
  },
);

/**
 * Props for the Order Tax component.
 */
export interface TaxProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    taxRate: string;
    taxValue: string;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order tax information with rate, value, and currency with customizable rendering.
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
 *   {({ taxRate, taxValue, currency }) => (
 *     <div>
 *       <span>{`Tax (${taxRate}%)`}</span>
 *       <span>{`${taxValue} ${currency}`}</span>
 *     </div>
 *   )}
 * </Order.Tax>
 * ```
 */
export const Tax = React.forwardRef<HTMLElement, TaxProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.Tax>
      {({ taxRate, taxValue, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderTax}
          customElement={children}
          customElementProps={{ taxRate, taxValue, currency }}
          content={taxValue}
          {...otherProps}
        >
          <span>{taxValue}</span>
        </AsChildSlot>
      )}
    </CoreOrder.Tax>
  );
});

/**
 * Props for the Order ServiceFee component.
 */
export interface ServiceFeeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    value: string;
    currency: string;
    rate: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order service fee information with rate, value, and currency with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Order.ServiceFee className="text-gray-600 font-light" />
 *
 * // asChild with primitive
 * <Order.ServiceFee asChild>
 *   <p className="text-sm text-gray-600 font-light" />
 * </Order.ServiceFee>
 *
 * // asChild with react component
 * <Order.ServiceFee
 *   asChild
 *   className="font-light text-gray-700 justify-between flex"
 * >
 *   {({ value, currency, rate }) => (
 *     <div>
 *       <span>{`Service Fee (${rate}%)`}</span>
 *       <span>{`${value} ${currency}`}</span>
 *     </div>
 *   )}
 * </Order.ServiceFee>
 * ```
 */
export const ServiceFee = React.forwardRef<HTMLElement, ServiceFeeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreOrder.ServiceFee>
        {({ value, currency, rate }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.orderServiceFee}
            customElement={children}
            customElementProps={{ value, currency, rate }}
            content={value}
            {...otherProps}
          >
            <span>{value}</span>
          </AsChildSlot>
        )}
      </CoreOrder.ServiceFee>
    );
  },
);

/**
 * Props for the Order Total component.
 */
export interface TotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ value: string; currency: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the order total amount with currency and customizable rendering.
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
 *   {({ value, currency }) => (
 *     <div>
 *       <span>Total:</span>
 *       <span>{`${value} ${currency}`}</span>
 *     </div>
 *   )}
 * </Order.Total>
 * ```
 */
export const Total = React.forwardRef<HTMLElement, TotalProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreOrder.Total>
      {({ value, currency }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.orderTotal}
          customElement={children}
          customElementProps={{ value, currency }}
          content={value}
          {...otherProps}
        >
          <span>{value}</span>
        </AsChildSlot>
      )}
    </CoreOrder.Total>
  );
});
