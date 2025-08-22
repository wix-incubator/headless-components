import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition, type Signal } from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-service.js';

export interface TicketListServiceAPI {
  ticketDefinitions: Signal<TicketDefinition[]>;
  selectedQuantities: Signal<Record<string, number>>;
  setQuantity: (ticketId: string, quantity: number) => void;
  incrementQuantity: (ticketId: string) => void;
  decrementQuantity: (ticketId: string) => void;
  getMaxQuantity: (ticketId: string) => number;
  isSoldOut: (ticketId: string) => boolean;
}

export interface TicketListServiceConfig {
  ticketDefinitions: TicketDefinition[];
  initialSelectedQuantities?: Record<string, number>;
}

export const TicketListServiceDefinition = defineService<TicketListServiceAPI, TicketListServiceConfig>('ticketList');

export const TicketListService = implementService.withConfig<TicketListServiceConfig>()(
  TicketListServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const ticketDefinitions: Signal<TicketDefinition[]> = signalsService.signal(config.ticketDefinitions);
    const selectedQuantities: Signal<Record<string, number>> = signalsService.signal(config.initialSelectedQuantities ?? {});

    const findDef = (ticketId: string) => ticketDefinitions.get().find(d => d._id === ticketId);

    const getMaxQuantity = (ticketId: string) => {
      const def = findDef(ticketId);

      return def?.limitPerCheckout || 0;
    };

    const isSoldOut = (ticketId: string) => {
      const def = findDef(ticketId);
      if (!def) return true;

      return def.limitPerCheckout === 0
    };

    const setQuantity = (ticketId: string, quantity: number) => {
      const current = selectedQuantities.get();
      const max = getMaxQuantity(ticketId);
      const newQty = Math.max(0, Math.min(quantity, max));
      selectedQuantities.set({ ...current, [ticketId]: newQty });
    };

    const incrementQuantity = (ticketId: string) => {
      const current = selectedQuantities.get();
      const qty = current[ticketId] ?? 0;
      setQuantity(ticketId, qty + 1);
    };

    const decrementQuantity = (ticketId: string) => {
      const current = selectedQuantities.get();
      const qty = current[ticketId] ?? 0;
      setQuantity(ticketId, qty - 1);
    };

    return { ticketDefinitions, selectedQuantities, setQuantity, incrementQuantity, decrementQuantity, getMaxQuantity, isSoldOut };
  },
);

export async function loadTicketListServiceConfig(eventId: string): Promise<TicketListServiceConfig> {
  const query = { filter: { eventId } };
  const response = await ticketDefinitionsV2.queryAvailableTicketDefinitions(query);
  const ticketDefinitions = response.ticketDefinitions ?? [];
  return { ticketDefinitions };
}
