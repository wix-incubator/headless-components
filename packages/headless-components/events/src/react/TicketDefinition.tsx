import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import { TicketService, TicketServiceDefinition, type TicketDefinition } from '../services/ticket-service';
import { type AsChildProps, renderAsChild } from '../utils/renderAsChild';

enum TestIds {
  ticketName = 'ticket-name',
  ticketPrice = 'ticket-price',
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

export const Name = React.forwardRef<HTMLElement, NameProps>(
  (props, ref) => {
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
  },
);

export interface PriceProps extends AsChildProps<{ price: string }> {}

export const Price = React.forwardRef<HTMLElement, PriceProps>(
  (props, ref) => {
    const { asChild, children } = props;

    const service = useService(TicketServiceDefinition);
    const ticketDefinition = service.ticketDefinition.get();
    const price = ticketDefinition.price?.formattedAmount ?? '';

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
  },
);
