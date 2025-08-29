import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import {orders} from '@wix/events';
import { redirects } from '@wix/redirects';
import { TicketReservationQuantity } from './ticket-list-service.js';

/**
 * API interface for the Checkout service
 */
export interface CheckoutServiceAPI {
  isLoading: Signal<boolean>;
  error: Signal<string | null>;

  createCheckout: (
    eventId: string,
    eventSlug: string,
    ticketQuantities: TicketReservationQuantity[],
  ) => Promise<void>;
}

export const CheckoutServiceDefinition =
  defineService<CheckoutServiceAPI>('checkout');

/**
 * Configuration options for the Checkout service
 */
export interface CheckoutServiceConfig {
  postFlowUrl?: string;
}

export const CheckoutService =
  implementService.withConfig<CheckoutServiceConfig>()(
    CheckoutServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const isLoading: Signal<boolean> = signalsService.signal(false);
      const error: Signal<string | null> = signalsService.signal(null as any);

      const createCheckout = async (
        eventId: string,
        eventSlug: string,
        ticketQuantities: TicketReservationQuantity[],
      ) => {
        try {
          isLoading.set(true);
          error.set(null);
          const reservationResult = await orders.createReservation(eventId, {
            ticketQuantities: ticketQuantities.map(({quantity,ticketDefinitionId, priceOverride}) => {
              if (Number(quantity) > 0) {
                return {ticketDefinitionId, quantity, ticketDetails: priceOverride ? new Array(quantity).fill({priceOverride}): null}
              }
              return null
            }).filter(Boolean) as orders.TicketReservationQuantity[]
          });

          if (!reservationResult._id) {
            throw new Error('Failed to create reservation');
          }

          const { redirectSession } = await redirects.createRedirectSession({
            eventsCheckout: {
              reservationId: reservationResult._id,
              eventSlug,
            },
            callbacks: {
              postFlowUrl:
                config.postFlowUrl ||
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
          isLoading.set(false)
          error.set(
            err instanceof Error ? err.message : 'Failed to create checkout',
          );
        }
      };

      return {
        isLoading,
        error,
        createCheckout,
      };
    },
  );

export type CheckoutServiceConfigResult = {
  [CheckoutServiceDefinition]: CheckoutServiceConfig;
};

/**
 * Load initial configuration for the Checkout service.
 * This function prepares the configuration for checkout creation.
 *
 * @param postFlowUrl - Optional URL to redirect after checkout completion
 * @returns Promise resolving to service configuration
 */
export const loadCheckoutServiceInitialData = async (
  postFlowUrl?: string,
): Promise<CheckoutServiceConfigResult> => {
  return {
    [CheckoutServiceDefinition]: {
      ...(postFlowUrl && { postFlowUrl }),
    },
  };
};

/**
 * Creates a service binding for the Checkout service with the provided configuration.
 * This utility function helps integrate the checkout service into the services manager.
 *
 * @param servicesConfigs - Configuration object containing checkout service settings
 * @returns Tuple containing service definition, implementation, and configuration
 */
export const checkoutServiceBinding = <
  T extends {
    [key: string]: Awaited<
      ReturnType<typeof loadCheckoutServiceInitialData>
    >[typeof CheckoutServiceDefinition];
  },
>(
  servicesConfigs: T,
) => {
  return [
    CheckoutServiceDefinition,
    CheckoutService,
    servicesConfigs[CheckoutServiceDefinition] as any,
  ] as const;
};
