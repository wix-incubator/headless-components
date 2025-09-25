import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-definition-service.js';
import { CheckoutServiceDefinition } from './checkout-service.js';

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
  getCurrentQuantity: (
    ticketDefinitionId: string,
    pricingOptionId?: string,
  ) => number;
  getCurrentPriceOverride: (ticketDefinitionId: string) => string | undefined;
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
      const checkoutService = getService(CheckoutServiceDefinition);

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
      ) =>
        selectedQuantities
          .get()
          .find(
            (selectedQuantity) =>
              selectedQuantity.ticketDefinitionId === ticketDefinitionId &&
              (!pricingOptionId ||
                selectedQuantity.pricingOptionId === pricingOptionId),
          );

      const getMaxQuantity = (ticketDefinitionId: string) => {
        const ticketDefinition = findTicketDefinition(ticketDefinitionId);

        return ticketDefinition?.limitPerCheckout || 0;
      };

      const getCurrentQuantity = (
        ticketDefinitionId: string,
        pricingOptionId?: string,
      ) => {
        const selectedQuantity = findTicketReservation(
          ticketDefinitionId,
          pricingOptionId,
        );

        return selectedQuantity?.quantity || 0;
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
        quantity = getCurrentQuantity(ticketDefinitionId, pricingOptionId),
      }: TicketReservationQuantity) => {
        const maxQuantity = getMaxQuantity(ticketDefinitionId);
        const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));
        const newSelectedQuantity: TicketReservationQuantity = {
          ticketDefinitionId,
          pricingOptionId,
          quantity: newQuantity,
          priceOverride: priceOverride ? priceOverride : undefined,
        };

        const newSelectedQuantities = selectedQuantities
          .get()
          .filter(
            (selectedQuantity) =>
              selectedQuantity.ticketDefinitionId !== ticketDefinitionId ||
              selectedQuantity.pricingOptionId !== pricingOptionId,
          )
          .concat(newSelectedQuantity)
          .filter((selectedQuantity) => !!selectedQuantity.quantity);

        checkoutService.error.set(null);
        selectedQuantities.set(newSelectedQuantities);
      };

      return {
        ticketDefinitions,
        selectedQuantities,
        setQuantity,
        getMaxQuantity,
        getCurrentQuantity,
        getCurrentPriceOverride,
        isSoldOut,
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
