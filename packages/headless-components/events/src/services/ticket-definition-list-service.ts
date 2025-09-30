import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { ticketDefinitionsV2 } from '@wix/events';
import { type TicketDefinition } from './ticket-definition-service.js';
import { CheckoutServiceDefinition } from './checkout-service.js';
import { type Event, EventServiceDefinition } from './event-service.js';
import {
  getTicketDefinitionTax,
  getTicketDefinitionFee,
  getTicketDefinitionCurrency,
} from '../utils/ticket-definition.js';
import { formatPrice, roundPrice } from '../utils/price.js';

export interface TicketDefinitionListServiceAPI {
  ticketDefinitions: Signal<TicketDefinition[]>;
  selectedQuantities: Signal<TicketReservationQuantity[]>;
  totals: ReadOnlySignal<TicketReservationTotals>;
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

export interface TicketReservationTotals {
  currency: string;
  subtotal: number;
  tax: number;
  fee: number;
  total: number;
  formattedSubtotal: string;
  formattedTax: string;
  formattedFee: string;
  formattedTotal: string;
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
      const eventService = getService(EventServiceDefinition);

      const ticketDefinitions = signalsService.signal<TicketDefinition[]>(
        config.ticketDefinitions,
      );
      const selectedQuantities = signalsService.signal<
        TicketReservationQuantity[]
      >([]);

      const totals = signalsService.computed<TicketReservationTotals>(() =>
        getTicketReservationTotals(
          eventService.event.get(),
          ticketDefinitions.get(),
          selectedQuantities.get(),
        ),
      );

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
        totals,
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

function getTicketReservationTotals(
  event: Event,
  ticketDefinitions: TicketDefinition[],
  selectedQuantities: TicketReservationQuantity[],
): TicketReservationTotals {
  const taxSettings = event.registration?.tickets?.taxSettings;
  const currency = ticketDefinitions[0]
    ? getTicketDefinitionCurrency(ticketDefinitions[0])
    : 'USD';

  if (!ticketDefinitions.length || !selectedQuantities.length) {
    return {
      currency,
      subtotal: 0,
      tax: 0,
      fee: 0,
      total: 0,
      formattedSubtotal: formatPrice(0, currency),
      formattedTax: formatPrice(0, currency),
      formattedFee: formatPrice(0, currency),
      formattedTotal: formatPrice(0, currency),
    };
  }

  let subtotal = 0;
  let tax = 0;
  let fee = 0;
  let total = 0;

  selectedQuantities.forEach(
    ({ ticketDefinitionId, quantity, priceOverride, pricingOptionId }) => {
      const ticketDefinition = ticketDefinitions.find(
        (ticketDefinition) => ticketDefinition._id === ticketDefinitionId,
      )!;

      const { fixedPrice, guestPrice, pricingOptions, free } =
        ticketDefinition.pricingMethod!;
      const guestPricing = !!guestPrice;
      const price = guestPrice
        ? Number(priceOverride || '0')
        : pricingOptionId
          ? Number(
              pricingOptions!.optionDetails!.find(
                (option) => option.optionId === pricingOptionId,
              )!.price!.value!,
            )
          : Number(fixedPrice!.value);

      subtotal = roundPrice(subtotal + price * quantity!, currency);
      total = roundPrice(total + price * quantity!, currency);

      if (
        taxSettings &&
        !free &&
        (!guestPricing || taxSettings.appliedToDonations)
      ) {
        const { taxAmount } = getTicketDefinitionTax(
          taxSettings,
          price,
          currency,
        );

        tax = roundPrice(tax + taxAmount * quantity!, currency);
      }

      if (ticketDefinition.feeType === 'FEE_ADDED_AT_CHECKOUT' && !free) {
        const { amount } = getTicketDefinitionFee(
          taxSettings,
          price,
          currency,
          guestPricing,
        );

        fee = roundPrice(fee + amount * quantity!, currency);
      }
    },
  );

  if (taxSettings?.type === 'ADDED_AT_CHECKOUT') {
    total = roundPrice(total + tax, currency);
  } else if (taxSettings?.type === 'INCLUDED_IN_PRICE') {
    subtotal = roundPrice(subtotal - tax, currency);
  }

  total = roundPrice(total + fee, currency);

  return {
    currency,
    subtotal,
    tax,
    fee,
    total,
    formattedSubtotal: formatPrice(subtotal, currency),
    formattedTax: formatPrice(tax, currency),
    formattedFee: formatPrice(fee, currency),
    formattedTotal: formatPrice(total, currency),
  };
}
