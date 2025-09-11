import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-definition-service.js';

export interface TicketDefinitionListServiceAPI {
  ticketDefinitions: Signal<TicketDefinition[]>;
  selectedQuantities: Signal<TicketReservationQuantity[]>;
  setQuantity: (params: {
    ticketDefinitionId: string;
    quantity?: number;
    priceOverride?: string;
    pricingOptionId?: string;
  }) => void;
  getMaxQuantity: (ticketDefinitionId: string) => number;
  getCurrentSelectedQuantity: (
    ticketDefinitionId: string,
    pricingOptionId?: string,
  ) => number;
  isSoldOut: (ticketDefinitionId: string) => boolean;
}

export interface TicketReservationQuantity {
  ticketDefinitionId: string;
  quantity?: number;
  priceOverride?: string;
  pricingOptionId?: string;
}

export interface TicketDefinitionListServiceConfig {
  ticketDefinitions: TicketDefinition[];
}

export const TicketDefinitionListServiceDefinition = defineService<
  TicketDefinitionListServiceAPI,
  TicketDefinitionListServiceConfig
>('ticketDefinitionList');

export const TicketDefinitionListService =
  implementService.withConfig<TicketDefinitionListServiceConfig>()(
    TicketDefinitionListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const ticketDefinitions = signalsService.signal<TicketDefinition[]>(
        config.ticketDefinitions,
      );
      const selectedQuantities = signalsService.signal<
        TicketReservationQuantity[]
      >([]);

      const findTicketDefinition = (ticketDefinitionId: string) =>
        ticketDefinitions
          .get()
          .find(
            (ticketDefinition) => ticketDefinition._id === ticketDefinitionId,
          );

      const findTicketReservation = (
        ticketDefinitionId: string,
        pricingOptionId?: string,
      ) => {
        if (pricingOptionId) {
          return selectedQuantities
            .get()
            .filter(
              (selectedQuantity) =>
                selectedQuantity.ticketDefinitionId === ticketDefinitionId,
            )
            .find(
              (selectedQuantity) =>
                selectedQuantity.pricingOptionId === pricingOptionId,
            );
        }

        return selectedQuantities
          .get()
          .find(
            (selectedQuantity) =>
              selectedQuantity.ticketDefinitionId === ticketDefinitionId,
          );
      };

      const getMaxQuantity = (ticketDefinitionId: string) => {
        const ticketDefinition = findTicketDefinition(ticketDefinitionId);

        return ticketDefinition?.limitPerCheckout || 0;
      };

      const getCurrentSelectedQuantity = (
        ticketDefinitionId: string,
        pricingOptionId?: string,
      ) => {
        const selectedQuantity = findTicketReservation(
          ticketDefinitionId,
          pricingOptionId,
        );

        return selectedQuantity?.quantity ?? 0;
      };

      const getCurrentPriceOverride = (ticketDefinitionId: string) => {
        const selectedQuantity = findTicketReservation(ticketDefinitionId);

        return selectedQuantity?.priceOverride;
      };

      const isSoldOut = (ticketDefinitionId: string) =>
        getMaxQuantity(ticketDefinitionId) === 0;

      const setQuantity = ({
        ticketDefinitionId,
        pricingOptionId,
        priceOverride = getCurrentPriceOverride(ticketDefinitionId),
        quantity = getCurrentSelectedQuantity(
          ticketDefinitionId,
          pricingOptionId,
        ),
      }: TicketReservationQuantity) => {
        const max = getMaxQuantity(ticketDefinitionId);
        const newQuantity = Math.max(0, Math.min(quantity, max));
        const newSelectedQuantity: TicketReservationQuantity = {
          ticketDefinitionId,
          quantity: newQuantity,
          priceOverride: priceOverride ? priceOverride : undefined,
          pricingOptionId,
        };

        const newSelectedQuantities = [
          ...selectedQuantities.get().filter((selectedQuantity) => {
            if (pricingOptionId) {
              return !(
                selectedQuantity.ticketDefinitionId === ticketDefinitionId &&
                selectedQuantity.pricingOptionId === pricingOptionId
              );
            }

            return selectedQuantity.ticketDefinitionId !== ticketDefinitionId;
          }),
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

export async function loadTicketDefinitionListServiceConfig(
  eventId: string,
): Promise<TicketDefinitionListServiceConfig> {
  const query = { filter: { eventId } };
  const response =
    await ticketDefinitionsV2.queryAvailableTicketDefinitions(query);
  const ticketDefinitions = response.ticketDefinitions ?? [];

  return { ticketDefinitions };
}
