import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';

export type TicketDefinition = ticketDefinitionsV2.TicketDefinition;

export interface TicketDefinitionServiceAPI {
  ticketDefinition: Signal<TicketDefinition>;
}

export interface TicketDefinitionServiceConfig {
  ticketDefinition: TicketDefinition;
}

export const TicketDefinitionServiceDefinition = defineService<
  TicketDefinitionServiceAPI,
  TicketDefinitionServiceConfig
>('ticketDefinition');

export const TicketDefinitionService =
  implementService.withConfig<TicketDefinitionServiceConfig>()(
    TicketDefinitionServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const ticketDefinition = signalsService.signal<TicketDefinition>(
        config.ticketDefinition,
      );

      return {
        ticketDefinition,
      };
    },
  );
