import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { reservations } from '@wix/table-reservations';
import { LocationServiceDefinition } from './location-service.js';
import { RequestReservationServiceDefinition } from './request-reservation-service.js';
import { TimeSlotServiceDefinition } from './time-slot-service.js';

/**
 * API interface for the Reservation service, providing reservation creation functionality.
 * This service handles creating reservations, loading state, and errors.
 * It consumes the LocationService, RequestReservationService, and TimeSlotService to get the necessary data for reservation creation.
 *
 * @interface ReservationServiceAPI
 */
export interface ReservationServiceAPI {
  /** Reactive signal indicating if a reservation is currently being created */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Function to create a reservation */
  onReserve: () => Promise<void>;
}

/**
 * Service definition for the Reservation service.
 * This defines the contract that the ReservationService must implement.
 *
 * @constant
 */
export const ReservationServiceDefinition =
  defineService<ReservationServiceAPI>('reservation');

/**
 * Configuration interface required to initialize the ReservationService.
 * This service doesn't require initial configuration as it works with data from other services.
 *
 * @interface ReservationServiceConfig
 */
export interface ReservationServiceConfig {
  // No initial configuration needed
}

/**
 * Implementation of the Reservation service that manages reservation creation.
 * This service provides signals for loading state and error handling,
 * along with methods to create reservations using data from LocationService, RequestReservationService, and TimeSlotService.
 *
 * @example
 * ```tsx
 * import { ReservationService, ReservationServiceDefinition } from './reservation-service';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ReservationComponent() {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ReservationServiceDefinition, ReservationService.withConfig({})]
 *     ])}>
 *       <ReservationButton />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ReservationButton() {
 *   const reservationService = useService(ReservationServiceDefinition);
 *   const isLoading = reservationService.loadingSignal.get();
 *   const error = reservationService.errorSignal.get();
 *
 *   const handleReserve = () => {
 *     reservationService.onReserve();
 *   };
 *
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <button onClick={handleReserve} disabled={isLoading}>
 *       {isLoading ? 'Creating Reservation...' : 'Reserve'}
 *     </button>
 *   );
 * }
 * ```
 */
export const ReservationService =
  implementService.withConfig<ReservationServiceConfig>()(
    ReservationServiceDefinition,
    ({ getService }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const locationService = getService(LocationServiceDefinition);
      const requestReservationService = getService(
        RequestReservationServiceDefinition,
      );
      const timeSlotService = getService(TimeSlotServiceDefinition);

      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      const onReserve = async () => {
        const selectedLocation = locationService.selectedLocationSignal.get();
        const partySize = requestReservationService.partySizeSignal.get();
        const selectedTimeSlot = timeSlotService.selectedTimeSlotSignal.get();

        // Validate that all required data is present
        if (!selectedTimeSlot) {
          errorSignal.set('Please select a time slot');
          return;
        }

        if (!selectedLocation || !partySize) {
          errorSignal.set('Please complete all required fields');
          return;
        }

        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const reservationData = {
            reservationDetails: {
              reservationLocationId: selectedLocation._id!,
              startDate: new Date(selectedTimeSlot.startDate!),
              partySize: partySize,
            },
          };

          const reservation = await reservations.createHeldReservation(
            reservationData.reservationDetails,
          );

          if (reservation) {
            // Clear the selected time slot after successful reservation
            timeSlotService.selectedTimeSlotSignal.set(null);

            // You can emit an event or call a callback here to handle navigation
            // For example: window.location.href = `/reservations/${reservation.reservation._id}`;
            console.log('Reservation created successfully:', reservation);
          }
        } catch (error) {
          errorSignal.set(
            error instanceof Error
              ? error.message
              : 'Failed to create reservation',
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      return {
        loadingSignal,
        errorSignal,
        onReserve,
      };
    },
  );
