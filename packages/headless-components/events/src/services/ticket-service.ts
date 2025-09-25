import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { orders } from '@wix/events';

export type Ticket = orders.Item;

export interface TicketServiceAPI {
  ticket: Signal<Ticket>;
}

export interface TicketServiceConfig {
  ticket: Ticket;
}

export const TicketServiceDefinition = defineService<
  TicketServiceAPI,
  TicketServiceConfig
>('ticket');

export const TicketService = implementService.withConfig<TicketServiceConfig>()(
  TicketServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const ticket: Signal<Ticket> = signalsService.signal(config.ticket);

    return { ticket };
  },
);
