import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';

export type TicketDefinition = ticketDefinitionsV2.TicketDefinition;

export interface TicketServiceAPI {
  ticketDefinition: Signal<TicketDefinition>;
}

export interface TicketServiceConfig {
  ticketDefinition: TicketDefinition;
}

export const TicketServiceDefinition = defineService<
  TicketServiceAPI,
  TicketServiceConfig
>('ticket');

export const TicketService = implementService.withConfig<TicketServiceConfig>()(
  TicketServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const ticketDefinition: Signal<TicketDefinition> = signalsService.signal(
      config.ticketDefinition,
    );

    return { ticketDefinition };
  },
);
