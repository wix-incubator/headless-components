import * as CoreOrder from './core/Order.js';
import { type OrderServiceConfig } from '../services/order-service.js';
import React from 'react';
import { AsChildSlot } from '@wix/headless-utils/react';

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
}

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
}

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
