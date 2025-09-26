import * as CoreOrder from './core/Order.js';
import { type OrderServiceConfig } from '../services/order-service.js';
import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { InvoiceItem as InvoiceItemType } from '../services/invoice-item-service.js';
import * as InvoiceItem from './InvoiceItem.js';

export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Configuration for the order service */
  orderServiceConfig: OrderServiceConfig;
}

/**
 * Order Root component that provides order service context to child components.
 * This is the top-level component that must wrap all other Order components.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage from ThankYou page - ticketed event
 * <Order.Root orderServiceConfig={orderServiceConfig}>
 *   <Order.InvoiceItems className="px-6 border-b border-gray-300">
 *     <Order.InvoiceItemRepeater>
 *       <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *         <div className="w-[35%]"><InvoiceItem.Name /></div>
 *         <div className="w-[25%]"><InvoiceItem.Price /></div>
 *         <div className="w-[15%]"><InvoiceItem.Quantity /></div>
 *         <div className="w-[25%] text-right"><InvoiceItem.Total /></div>
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

export interface OrderNumberProps {
  /** Render prop function */
  children: (props: OrderNumberRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface OrderNumberRenderProps {
  /** Order number */
  orderNumber: string;
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
 * // Real usage from ThankYou page
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

export interface CreatedDateProps {
  /** Render prop function */
  children: (props: CreatedDateRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface CreatedDateRenderProps {
  /** Created date */
  createdDate: string;
  /** Whether the order is ready */
  isReady: boolean;
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
 *   <time className="text-sm text-gray-500 font-light" />
 * </Order.CreatedDate>
 *
 * // Real usage from ThankYou page
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
        {({ createdDate, isReady }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ createdDate, isReady }}
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

export interface DownloadTicketsButtonProps {
  /** Render prop function */
  children: (props: DownloadTicketsButtonRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
}

export interface DownloadTicketsButtonRenderProps {
  /** Tickets PDF URL */
  ticketsPdfUrl: string;
  /** Whether the button is visible */
  isVisible: boolean;
}

/**
 * Download tickets button that provides access to event tickets PDF with visibility control.
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
 * // Real usage from ThankYou page
 * <Order.DownloadTicketsButton asChild>
 *   {({ ticketsPdfUrl, isVisible }) =>
 *     isVisible && (
 *       <button
 *         className="block font-light py-3 px-20 ml-auto bg-blue-500 text-white rounded"
 *         onClick={() => window.open(ticketsPdfUrl, '_blank')}
 *       >
 *         Download Tickets
 *       </button>
 *     )
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
      {({ ticketsPdfUrl, isVisible }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          customElement={children}
          customElementProps={{ ticketsPdfUrl, isVisible }}
          content={ticketsPdfUrl}
          {...otherProps}
        >
          <button>{label}</button>
        </AsChildSlot>
      )}
    </CoreOrder.DownloadTicketsButton>
  );
});

export interface InvoiceItemsProps {
  /** Render prop function */
  children:
    | React.ReactNode
    | AsChildChildren<{
        invoiceItems: InvoiceItemType[];
      }>;
  /** Whether to render as a child component */
  asChild?: boolean;
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
 * // Real usage from ThankYou page
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
 *
 * // asChild with primitive
 * <Order.InvoiceItems asChild>
 *   <div className="bg-white rounded-lg shadow p-4" />
 * </Order.InvoiceItems>
 *
 * // Custom render function with item count
 * <Order.InvoiceItems>
 *   {({ invoiceItems }) => (
 *     <div className="p-4">
 *       <h3 className="text-lg font-semibold mb-4">Items ({invoiceItems.length})</h3>
 *       <Order.InvoiceItemRepeater>
 *         <div className="flex justify-between py-2">
 *           <InvoiceItem.Name />
 *           <InvoiceItem.Total />
 *         </div>
 *       </Order.InvoiceItemRepeater>
 *     </div>
 *   )}
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
 * // Real usage from ThankYou page - table-like layout
 * <Order.InvoiceItems>
 *   <Order.InvoiceItemRepeater>
 *     <div className="flex border-b border-gray-200 py-4 font-light text-gray-700">
 *       <div className="w-[35%]">
 *         <InvoiceItem.Name />
 *       </div>
 *       <div className="w-[25%]">
 *         <InvoiceItem.Price />
 *       </div>
 *       <div className="w-[15%]">
 *         <InvoiceItem.Quantity />
 *       </div>
 *       <div className="w-[25%] text-right">
 *         <InvoiceItem.Total />
 *       </div>
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
 *         <div className="text-sm text-gray-500">
 *           Qty: <InvoiceItem.Quantity />
 *         </div>
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

export interface SubtotalProps {
  /** Render prop function */
  children: (props: SubtotalRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface SubtotalRenderProps {
  /** Subtotal */
  value: string;
  /** Currency */
  currency: string;
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
 * // Real usage from ThankYou page
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

export interface TaxProps {
  /** Render prop function */
  children: (props: TaxRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface TaxRenderProps {
  /** Tax rate */
  taxRate: string;
  /** Tax value */
  taxValue: string;
  /** Currency */
  currency: string;
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
 * // Real usage from ThankYou page
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

export interface ServiceFeeProps {
  /** Render prop function */
  children: (props: ServiceFeeRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface ServiceFeeRenderProps {
  /** Service fee value */
  value: string;
  /** Currency */
  currency: string;
  /** Service fee rate */
  rate: string;
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
 * // Real usage from ThankYou page
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

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export interface TotalRenderProps {
  /** Total value */
  value: string;
  /** Currency */
  currency: string;
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
 * // Real usage from ThankYou page
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
