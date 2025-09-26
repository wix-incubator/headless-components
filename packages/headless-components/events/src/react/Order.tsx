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
