import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  TicketService,
  TicketServiceDefinition,
  type TicketDefinition,
  type TicketServiceConfig,
} from '../services/ticket-service.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { TicketListServiceDefinition } from '../services/ticket-list-service.js';

enum TestIds {
  ticketDefinitionName = 'ticket-definition-name',
  ticketDefinitionDescription = 'ticket-definition-description',
  ticketDefinitionPrice = 'ticket-definition-price',
  ticketDefinitionRemaining = 'ticket-definition-remaining',
  ticketDefinitionSoldOut = 'ticket-definition-sold-out',
  ticketDefinitionQuantity = 'ticket-definition-quantity',
}

export interface RootProps {
  ticketDefinition: TicketDefinition;
  children: React.ReactNode;
}

export const Root = (props: RootProps): React.ReactNode => {
  const { ticketDefinition, children } = props;

  const ticketServiceConfig: TicketServiceConfig = {
    ticketDefinition,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        TicketServiceDefinition,
        TicketService,
        ticketServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

export interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}

export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className } = props;

  const service = useService(TicketServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();
  const name = ticketDefinition.name ?? '';

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.ticketDefinitionName}
      customElement={children}
      customElementProps={{ name }}
      content={name}
    >
      <span>{name}</span>
    </AsChildSlot>
  );
});

export interface PriceProps {
  asChild?: boolean;
  children?: AsChildChildren<{ price: string }>;
  className?: string;
}

export const Price = React.forwardRef<HTMLElement, PriceProps>((props, ref) => {
  const { asChild, children, className } = props;

  const service = useService(TicketServiceDefinition);
  const ticketDefinition = service.ticketDefinition.get();

  let price = '';
  if (ticketDefinition.pricingMethod?.free) {
    price = '0';
  } else if (ticketDefinition.pricingMethod?.fixedPrice) {
    price = `${ticketDefinition.pricingMethod.fixedPrice.value} ${ticketDefinition.pricingMethod.fixedPrice.currency}`;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.ticketDefinitionPrice}
      customElement={children}
      customElementProps={{ price }}
      content={price}
    >
      <span>{price}</span>
    </AsChildSlot>
  );
});

export interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}

export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const description = ticketDefinition.description ?? '';

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionDescription}
        customElement={children}
        customElementProps={{ description }}
        content={description}
      >
        <span>{description}</span>
      </AsChildSlot>
    );
  },
);

export interface RemainingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ remaining: number }>;
  className?: string;
}

export const Remaining = React.forwardRef<HTMLElement, RemainingProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const limitPerCheckout = ticketDefinition.limitPerCheckout || 0;

    const remainingStr = limitPerCheckout.toString();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionRemaining}
        customElement={children}
        customElementProps={{ remaining: limitPerCheckout }}
        content={remainingStr}
      >
        <span>{remainingStr}</span>
      </AsChildSlot>
    );
  },
);

export interface SoldOutProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SoldOut = React.forwardRef<HTMLElement, SoldOutProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const listService = useService(TicketListServiceDefinition);
    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const soldOut = listService.isSoldOut(ticketDefinition._id ?? '');

    if (!soldOut) {
      return null;
    }

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionSoldOut}
        customElement={children}
      >
        <span>{children}</span>
      </AsChildSlot>
    );
  },
);

export interface QuantityProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    quantity: number;
    maxQuantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (n: number) => void;
  }>;
  className?: string;
}

export const Quantity = React.forwardRef<HTMLElement, QuantityProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

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

    const defaultUI = (
      <div>
        <button onClick={decrement}>-</button>
        <span>{quantity}</span>
        <button onClick={increment}>+</button>
      </div>
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.ticketDefinitionQuantity}
        customElement={children}
        customElementProps={{
          quantity,
          maxQuantity,
          increment,
          decrement,
          setQuantity,
        }}
        content={defaultUI}
      >
        {defaultUI}
      </AsChildSlot>
    );
  },
);
