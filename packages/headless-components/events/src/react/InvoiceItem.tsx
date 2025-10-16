import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type InvoiceItem } from '../services/invoice-item-service.js';
import * as CoreInvoiceItem from './core/InvoiceItem.js';

enum TestIds {
  invoiceItemRoot = 'invoice-item-root',
  invoiceItemName = 'invoice-item-name',
  invoiceItemPrice = 'invoice-item-price',
  invoiceItemQuantity = 'invoice-item-quantity',
  invoiceItemTotal = 'invoice-item-total',
}

/**
 * Props for the InvoiceItem Root component.
 */
export interface RootProps {
  /** Invoice item */
  invoiceItem: InvoiceItem;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * InvoiceItem Root core component that provides invoice item service context.
 * Must be used as the top-level component for invoice item functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * <InvoiceItem.Root invoiceItem={invoiceItem}>
 *   <InvoiceItem.Name />
 *   <InvoiceItem.Price />
 *   <InvoiceItem.Quantity />
 *   <InvoiceItem.Total />
 * </InvoiceItem.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { invoiceItem, asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Root invoiceItem={invoiceItem}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.invoiceItemRoot}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreInvoiceItem.Root>
  );
});

/**
 * Props for the InvoiceItem Name component.
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the invoice item name with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InvoiceItem.Name className="font-medium" />
 *
 * // asChild with primitive
 * <InvoiceItem.Name asChild>
 *   <h3 className="text-lg font-bold" />
 * </InvoiceItem.Name>
 *
 * // asChild with React component
 * <InvoiceItem.Name asChild>
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h3 ref={ref} {...props} className="text-lg font-bold">
 *       {name}
 *     </h3>
 *   ))}
 * </InvoiceItem.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Name>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.invoiceItemName}
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

/**
 * Props for the InvoiceItem Price component.
 */
export interface PriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Locale */
  locale: Intl.LocalesArgument;
}

/**
 * Displays the invoice item price with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InvoiceItem.Price className="text-green-600 font-semibold" />
 *
 * // asChild with primitive
 * <InvoiceItem.Price asChild>
 *   <p className="text-lg text-green-600" />
 * </InvoiceItem.Price>
 *
 * // asChild with React component
 * <InvoiceItem.Price asChild>
 *   {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
 *     <p ref={ref} {...props} className="text-lg text-green-600">
 *       Price: {formattedValue}
 *     </p>
 *   ))}
 * </InvoiceItem.Price>
 * ```
 */
export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, className, locale, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Price locale={locale}>
      {({ value, currency, formattedValue }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.invoiceItemPrice}
          customElement={children}
          customElementProps={{ value, currency, formattedValue }}
          content={formattedValue}
          {...otherProps}
        >
          <span>{formattedValue}</span>
        </AsChildSlot>
      )}
    </CoreInvoiceItem.Price>
  );
});

/**
 * Props for the InvoiceItem Quantity component.
 */
export interface QuantityProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ quantity: number }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the invoice item quantity with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InvoiceItem.Quantity className="text-gray-600" />
 *
 * // asChild with primitive
 * <InvoiceItem.Quantity asChild>
 *   <span className="badge" />
 * </InvoiceItem.Quantity>
 *
 * // asChild with React component
 * <InvoiceItem.Quantity asChild>
 *   {React.forwardRef(({ quantity, ...props }, ref) => (
 *     <span ref={ref} {...props} className="badge">
 *       Qty: {quantity}
 *     </span>
 *   ))}
 * </InvoiceItem.Quantity>
 * ```
 */
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
            data-testid={TestIds.invoiceItemQuantity}
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

/**
 * Props for the InvoiceItem Total component.
 */
export interface TotalProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Locale */
  locale: Intl.LocalesArgument;
}

/**
 * Displays the invoice item total amount with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InvoiceItem.Total className="font-bold text-xl" />
 *
 * // asChild with primitive
 * <InvoiceItem.Total asChild>
 *   <p className="font-bold text-xl text-green-600" />
 * </InvoiceItem.Total>
 *
 * // asChild with React component
 * <InvoiceItem.Total asChild>
 *   {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
 *     <p ref={ref} {...props} className="font-bold text-xl text-green-600">
 *       Total: {formattedValue}
 *     </p>
 *   ))}
 * </InvoiceItem.Total>
 * ```
 */
export const Total = React.forwardRef<HTMLElement, TotalProps>((props, ref) => {
  const { asChild, children, className, locale, ...otherProps } = props;

  return (
    <CoreInvoiceItem.Total locale={locale}>
      {({ value, currency, formattedValue }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.invoiceItemTotal}
          customElement={children}
          customElementProps={{ value, currency, formattedValue }}
          content={formattedValue}
          {...otherProps}
        >
          <span>{formattedValue}</span>
        </AsChildSlot>
      )}
    </CoreInvoiceItem.Total>
  );
});
