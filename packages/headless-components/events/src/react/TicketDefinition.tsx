import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketService,
  TicketServiceDefinition,
  type TicketDefinition,
} from '../services/ticket-service.js';
import { type AsChildProps, renderAsChild } from '../utils/renderAsChild.js';
import { TicketListServiceDefinition } from '../services/ticket-list-service.js';

enum TestIds {
  ticketName = 'ticket-name',
  ticketDescription = 'ticket-description',
  ticketPrice = 'ticket-price',
  ticketRemaining = 'ticket-remaining',
  ticketSoldOut = 'ticket-sold-out',
  ticketQuantity = 'ticket-quantity',
}

export interface RootProps {
  ticketDefinition: TicketDefinition;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { ticketDefinition, children } = props;

  const config = { ticketDefinition };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TicketServiceDefinition,
        TicketService,
        config,
      )}
    >
      {children}
    </WixServices>
  );
};

export interface NameProps extends AsChildProps<{ name: string }> {}

export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children } = props;

  const service = useService(TicketServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();
  const name = ticketDefinition.name ?? '';

  const attributes = { 'data-testid': TestIds.ticketName };

  const content = <span {...attributes}>{name}</span>;

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { name },
      ref,
      content,
      attributes,
    });
    if (rendered) return rendered;
  }

  return content;
});

export interface PriceProps extends AsChildProps<{ price: string }> {}

export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children } = props;

  const service = useService(TicketServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();

  let price = '';
  if (ticketDefinition.pricingMethod?.free) {
    price = 'Free';
  } else if (ticketDefinition.pricingMethod?.fixedPrice) {
    price = `${ticketDefinition.pricingMethod.fixedPrice.value} ${ticketDefinition.pricingMethod.fixedPrice.currency}`;
  } // Add other types if needed

  const attributes = { 'data-testid': TestIds.ticketPrice };

  const content = <span {...attributes}>{price}</span>;

  if (asChild) {
    const rendered = renderAsChild({
      children,
      props: { price },
      ref,
      content,
      attributes,
    });
    if (rendered) return rendered;
  }

  return content;
});

export interface DescriptionProps
  extends AsChildProps<{ description: string }> {}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const description = ticketDefinition.description ?? '';

    const attributes = { 'data-testid': TestIds.ticketDescription };

    const content = <p {...attributes}>{description}</p>;

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { description },
        ref,
        content,
        attributes,
      });
      if (rendered) return rendered;
    }

    return content;
  },
);

export interface RemainingProps extends AsChildProps<{ remaining: number }> {}

export const Remaining = React.forwardRef<HTMLElement, RemainingProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const limitPerCheckout = ticketDefinition.limitPerCheckout || 0;

    const attributes = { 'data-testid': TestIds.ticketRemaining };

    const content = <span {...attributes}>{limitPerCheckout.toString()}</span>;

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { remaining: limitPerCheckout },
        ref,
        content,
        attributes,
      });
      if (rendered) return rendered;
    }

    return content;
  },
);

export interface SoldOutProps extends AsChildProps<{ soldOut: boolean }> {}

export const SoldOut = React.forwardRef<HTMLElement, SoldOutProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const listService = useService(TicketListServiceDefinition);
    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const soldOut = listService.isSoldOut(ticketDefinition._id ?? '');

    const attributes = { 'data-testid': TestIds.ticketSoldOut };

    const content = soldOut ? <span {...attributes}>Sold Out</span> : null;

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { soldOut },
        ref,
        content,
        attributes,
      });
      if (rendered) return rendered;
    }

    return content;
  },
);

export interface QuantityProps
  extends AsChildProps<{
    quantity: number;
    maxQuantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (n: number) => void;
  }> {}

export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const listService = useService(TicketListServiceDefinition);
    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const id = ticketDefinition._id ?? '';
    const quantities = listService.selectedQuantities.get();
    const quantity = quantities[id] ?? 0;
    const maxQuantity = listService.getMaxQuantity(id);

    const increment = () => listService.incrementQuantity(id);
    const decrement = () => listService.decrementQuantity(id);
    const setQuantity = (n: number) => listService.setQuantity(id, n);

    const attributes = { 'data-testid': TestIds.ticketQuantity };

    const content = (
      <div {...attributes}>
        <button onClick={decrement}>-</button>
        <span>{quantity}</span>
        <button onClick={increment}>+</button>
      </div>
    );

    if (asChild) {
      const rendered = renderAsChild({
        children,
        props: { quantity, maxQuantity, increment, decrement, setQuantity },
        ref,
        content,
        attributes,
      });
      if (rendered) return rendered;
    }

    return content;
  },
);
