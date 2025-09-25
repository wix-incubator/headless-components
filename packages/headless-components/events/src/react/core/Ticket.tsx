import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  Ticket,
  TicketService,
  TicketServiceConfig,
  TicketServiceDefinition,
} from '../../services/ticket-service.js';

export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Ticket */
  ticket: Ticket;
}

/**
 * Ticket Root core component that provides ticket service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { ticket, children } = props;

  const ticketServiceConfig: TicketServiceConfig = {
    ticket,
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
}

export interface NameProps {
  /** Render prop function */
  children: (props: NameRenderProps) => React.ReactNode;
}

export interface NameRenderProps {
  /** Ticket name */
  name: string;
}

export function Name(props: NameProps): React.ReactNode {
  const ticketService = useService(TicketServiceDefinition);

  const ticket = ticketService.ticket.get();
  const name = ticket.name!;

  return props.children({ name });
}

export interface PriceProps {
  /** Render prop function */
  children: (props: PriceRenderProps) => React.ReactNode;
}

export interface PriceRenderProps {
  /** Ticket price value */
  value: string;
  /** Ticket price currency */
  currency: string;
}

export function Price(props: PriceProps): React.ReactNode {
  const ticketService = useService(TicketServiceDefinition);

  const ticket = ticketService.ticket.get();
  const price = ticket.price!;

  return props.children({ value: price.value!, currency: price.currency! });
}

export interface QuantityProps {
  /** Render prop function */
  children: (props: QuantityRenderProps) => React.ReactNode;
}

export interface QuantityRenderProps {
  /** Ticket quantity */
  quantity: number;
}

export function Quantity(props: QuantityProps): React.ReactNode {
  const ticketService = useService(TicketServiceDefinition);

  const ticket = ticketService.ticket.get();
  const quantity = ticket.quantity!;

  return props.children({ quantity });
}

export interface TotalProps {
  /** Render prop function */
  children: (props: TotalRenderProps) => React.ReactNode;
}

export interface TotalRenderProps {
  /** Ticket total value */
  value: string;
  /** Ticket total currency */
  currency: string;
}

export function Total(props: TotalProps): React.ReactNode {
  const ticketService = useService(TicketServiceDefinition);

  const ticket = ticketService.ticket.get();
  const total = ticket.total!;

  return props.children({ value: total.value!, currency: total.currency! });
}
