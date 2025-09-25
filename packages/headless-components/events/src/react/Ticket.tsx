import React from 'react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { Ticket } from '../services/ticket-service.js';
import * as CoreTicket from './core/Ticket.js';

export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Ticket */
  ticket: Ticket;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Ticket Root core component that provides ticket service context.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { ticket, asChild, children, className, ...otherProps } = props;

  return (
    <CoreTicket.Root ticket={ticket}>
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
    </CoreTicket.Root>
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
    <CoreTicket.Name>
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
    </CoreTicket.Name>
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
    <CoreTicket.Price>
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
    </CoreTicket.Price>
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
      <CoreTicket.Quantity>
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
      </CoreTicket.Quantity>
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
    <CoreTicket.Total>
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
    </CoreTicket.Total>
  );
});
