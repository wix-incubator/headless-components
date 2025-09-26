import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { type InvoiceItem } from '../services/invoice-item-service.js';
import * as CoreInvoiceItem from './core/InvoiceItem.js';

export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Invoice item */
  invoiceItem: InvoiceItem;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * InvoiceItem Root core component that provides invoice item service context.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { invoiceItem, asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Root invoiceItem={invoiceItem}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreInvoiceItem.Root>
  );
});

export interface NameProps {
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Name>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          customElement={children}
          customElementProps={{ name }}
          content={name}
          {...otherProps}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CoreInvoiceItem.Name>
  );
});

export interface PriceProps {
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ value: string; currency: string }>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Price>
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
          <span>
            {value} {currency}
          </span>
        </AsChildSlot>
      )}
    </CoreInvoiceItem.Price>
  );
});

export interface QuantityProps {
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ quantity: number }>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInvoiceItem.Quantity>
        {({ quantity }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{ quantity }}
            content={quantity}
            {...otherProps}
          >
            <span>{quantity}</span>
          </AsChildSlot>
        )}
      </CoreInvoiceItem.Quantity>
    );
  },
);

export interface TotalProps {
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ value: string; currency: string }>;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

export const Total = React.forwardRef<HTMLElement, TotalProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Total>
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
          <span>
            {value} {currency}
          </span>
        </AsChildSlot>
      )}
    </CoreInvoiceItem.Total>
  );
});
