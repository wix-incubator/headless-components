import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition, type Signal } from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-service';

export interface TicketListServiceAPI {
  ticketDefinitions: Signal<TicketDefinition[]>;
}

export interface TicketListServiceConfig {
  ticketDefinitions: TicketDefinition[];
}

export const TicketListServiceDefinition = defineService<TicketListServiceAPI, TicketListServiceConfig>('ticketList');

export const TicketListService = implementService.withConfig<TicketListServiceConfig>()(
  TicketListServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const ticketDefinitions: Signal<TicketDefinition[]> = signalsService.signal(config.ticketDefinitions);

    return { ticketDefinitions };
  },
);

export async function loadTicketListServiceConfig(eventId: string): Promise<TicketListServiceConfig> {
  const response = await ticketDefinitionsV2.queryAvailableTicketDefinitions({ filter: { eventId } });
  const ticketDefinitions = response.ticketDefinitions ?? [];

  return { ticketDefinitions };
}
