import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ticketReservations } from '@wix/events';
import { redirects } from '@wix/redirects';
import { getErrorMessage } from '../utils/errors.js';
import { TicketReservationQuantity } from './ticket-definition-list-service.js';

/**
 * API interface for the Checkout service
 */
export interface CheckoutServiceAPI {
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  checkout: (
    eventId: string,
    eventSlug: string,
    ticketReservationQuantities: TicketReservationQuantity[],
  ) => Promise<void>;
}

/**
 * Configuration options for the Checkout service
 */
export interface CheckoutServiceConfig {
  thankYouPageUrl?: string;
  noTicketDefinitionsSelectedError?: string;
}

export const CheckoutServiceDefinition = defineService<
  CheckoutServiceAPI,
  CheckoutServiceConfig
>('checkout');

export const CheckoutService =
  implementService.withConfig<CheckoutServiceConfig>()(
    CheckoutServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const isLoading = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);

      const checkout = async (
        eventId: string,
        eventSlug: string,
        ticketReservationQuantities: TicketReservationQuantity[],
      ) => {
        if (!ticketReservationQuantities.length) {
          error.set(
            config.noTicketDefinitionsSelectedError || 'Select a ticket',
          );
          return;
        }

        try {
          isLoading.set(true);
          error.set(null);

          const { _id: reservationId } =
            await ticketReservations.createTicketReservation({
              tickets: ticketReservationQuantities
                .map(
                  ({
                    quantity,
                    ticketDefinitionId,
                    priceOverride,
                    pricingOptionId,
                  }) => {
                    if (quantity) {
                      return {
                        eventId,
                        quantity,
                        ticketDefinitionId,
                        ticketInfo:
                          priceOverride || pricingOptionId
                            ? {
                                pricingOptionId,
                                guestPrice: priceOverride,
                              }
                            : undefined,
                      };
                    }

                    return null;
                  },
                )
                .filter(Boolean) as ticketReservations.TicketLineItem[],
            });

          if (!reservationId) {
            throw new Error('Failed to create reservation');
          }

          const { redirectSession } = await redirects.createRedirectSession({
            eventsCheckout: {
              reservationId,
              eventSlug,
            },
            callbacks: {
              thankYouPageUrl:
                config.thankYouPageUrl ||
                (typeof window !== 'undefined' ? window.location.href : ''),
            },
          });

          if (redirectSession?.fullUrl) {
            if (typeof window !== 'undefined') {
              window.location.href = redirectSession.fullUrl;
            }
          } else {
            throw new Error('Failed to create redirect session');
          }
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoading.set(false);
        }
      };

      return {
        isLoading,
        error,
        checkout,
      };
    },
  );
