import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-service.js';

export interface TicketListServiceAPI {
  ticketDefinitions: Signal<TicketDefinition[]>;
  selectedQuantities: Signal<TicketReservationQuantity[]>;
  setQuantity: (params: {
    ticketDefinitionId: string;
    quantity?: number;
    priceOverride?: string;
    pricingOptionId?: string;
  }) => void;
  getMaxQuantity: (ticketDefinitionId: string) => number;
  getCurrentSelectedQuantity: (ticketDefinitionId: string, pricingOptionId?: string) => number;
  isSoldOut: (ticketDefinitionId: string) => boolean;
}

export interface TicketReservationQuantity {
  ticketDefinitionId?: string;
  quantity?: number;
  priceOverride?: string;
  pricingOptionId?: string;
}

export interface TicketListServiceConfig {
  ticketDefinitions: TicketDefinition[];
  initialSelectedQuantities?: TicketReservationQuantity[];
}

export const TicketDefinitionListServiceDefinition = defineService<
  TicketListServiceAPI,
  TicketListServiceConfig
>('ticketList');

export const TicketListService =
  implementService.withConfig<TicketListServiceConfig>()(
    TicketDefinitionListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const ticketDefinitions: Signal<TicketDefinition[]> =
        signalsService.signal(config.ticketDefinitions);
      const selectedQuantities: Signal<TicketReservationQuantity[]> =
        signalsService.signal(config.initialSelectedQuantities ?? []);

      const findTicketDefinition = (ticketDefinitionId: string) =>
        ticketDefinitions.get().find((d) => d._id === ticketDefinitionId);

      const findTicketReservation = (ticketDefinitionId: string, pricingOptionId?: string) => {
        if (pricingOptionId) {
  return selectedQuantities
          .get()
          .filter((d) => d.ticketDefinitionId === ticketDefinitionId)
          .find((d) => d.pricingOptionId === pricingOptionId);

        }
        return selectedQuantities
          .get()
          .find((d) => d.ticketDefinitionId === ticketDefinitionId);
      }

      const getMaxQuantity = (ticketDefinitionId: string) => {
        const ticketDefinition = findTicketDefinition(ticketDefinitionId);

        return ticketDefinition?.limitPerCheckout || 0;
      };

      const getCurrentSelectedQuantity = (ticketDefinitionId: string, pricingOptionId?: string) => {
        const selectedQuantity = findTicketReservation(ticketDefinitionId, pricingOptionId);
        return selectedQuantity?.quantity ?? 0;
      };

      const getCurrentPriceOverride = (ticketDefinitionId: string): string => {
        const selectedQuantity = findTicketReservation(ticketDefinitionId);

        return selectedQuantity?.priceOverride ?? '';
      };

      const isSoldOut = (ticketDefinitionId: string) =>
        getMaxQuantity(ticketDefinitionId) === 0;

      const setQuantity = ({
        ticketDefinitionId,
        priceOverride = getCurrentPriceOverride(ticketDefinitionId),
        pricingOptionId,
        quantity = getCurrentSelectedQuantity(ticketDefinitionId, pricingOptionId),
      }: {
        ticketDefinitionId: string;
        quantity?: number;
        priceOverride?: string;
        pricingOptionId?: string;
      }) => {
        const max = getMaxQuantity(ticketDefinitionId);

        const newQuantity = Math.max(0, Math.min(quantity, max));
        const newSelectedQuantity: TicketReservationQuantity = {
          ticketDefinitionId,
          quantity: newQuantity,
          priceOverride: priceOverride ? priceOverride : undefined,
          pricingOptionId
        };

        const newSelectedQuantities = [
          ...selectedQuantities
            .get()
            .filter(
              (selected) => {
                if (pricingOptionId) {
                  return !(selected.ticketDefinitionId === ticketDefinitionId && selected.pricingOptionId === pricingOptionId)
                }
                return selected.ticketDefinitionId !== ticketDefinitionId
              },
            ),
          newSelectedQuantity,
        ];

        selectedQuantities.set(newSelectedQuantities);
      };

      return {
        ticketDefinitions,
        selectedQuantities,
        setQuantity,
        getMaxQuantity,
        isSoldOut,
        getCurrentSelectedQuantity,
      };
    },
  );

export async function loadTicketListServiceConfig(
  eventId: string,
): Promise<TicketListServiceConfig> {
  const query = { filter: { eventId } };
  const response =
    await ticketDefinitionsV2.queryAvailableTicketDefinitions(query);
  const ticketDefinitions = response.ticketDefinitions ?? [];

  return { ticketDefinitions };
}
