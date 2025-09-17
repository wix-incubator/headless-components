import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { timeSlots } from '@wix/table-reservations';
import { RequestReservationServiceDefinition } from './request-reservation-service.js';
import { LocationServiceDefinition } from './location-service.js';

export type TimeSlot = timeSlots.TimeSlot;

/**
 * API interface for the TimeSlot service, providing reactive time slot data management.
 * This service handles loading and managing available time slots, loading state, and errors.
 * It consumes the RequestReservationService to get reservation criteria for loading time slots.
 *
 * @interface TimeSlotServiceAPI
 */
export interface TimeSlotServiceAPI {
  /** Reactive signal containing the currently selected time slot */
  selectedTimeSlotSignal: Signal<TimeSlot | null>;
  /** Reactive signal containing the list of available time slots */
  timeSlotsSignal: Signal<TimeSlot[]>;
  /** Reactive signal indicating if time slots are currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Function to handle time slot selection */
  onTimeSlotClick: (timeSlot: TimeSlot) => void;
  /** Function to load time slots based on current filters */
  loadTimeSlots: () => Promise<void>;
  /** Function to get filtered time slots based on current filters */
  getFilteredTimeSlots: (props: {
    showUnavailableSlots: boolean;
    slotsLimit: number;
  }) => TimeSlot[];
}

/**
 * Service definition for the TimeSlot service.
 * This defines the contract that the TimeSlotService must implement.
 *
 * @constant
 */
export const TimeSlotServiceDefinition =
  defineService<TimeSlotServiceAPI>('time-slot');

/**
 * Configuration interface required to initialize the TimeSlotService.
 * Contains the initial time slot data that will be loaded into the service.
 *
 * @interface TimeSlotServiceConfig
 */
export interface TimeSlotServiceConfig {
  /** The initial time slots data to configure the service with */
  timeSlots?: TimeSlot[];
  /** The initially selected time slot */
  selectedTimeSlot?: TimeSlot | null;
}

/**
 * Implementation of the TimeSlot service that manages reactive time slot data.
 * This service provides signals for time slot data, loading state, and error handling,
 * along with methods to dynamically load time slots and handle selection.
 * It consumes the RequestReservationService to get reservation criteria for loading time slots.
 *
 * @example
 * ```tsx
 * import { TimeSlotService, TimeSlotServiceDefinition } from './time-slot-service';
 * import { useService } from '@wix/services-manager-react';
 *
 * function TimeSlotComponent({ timeSlotConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [TimeSlotServiceDefinition, TimeSlotService.withConfig(timeSlotConfig)]
 *     ])}>
 *       <TimeSlotDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function TimeSlotDisplay() {
 *   const timeSlotService = useService(TimeSlotServiceDefinition);
 *   const timeSlots = timeSlotService.timeSlotsSignal.get();
 *   const selectedTimeSlot = timeSlotService.selectedTimeSlotSignal.get();
 *   const isLoading = timeSlotService.loadingSignal.get();
 *   const error = timeSlotService.errorSignal.get();
 *
 *   if (isLoading) return <div>Loading time slots...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {timeSlots.map(slot => (
 *         <button
 *           key={slot._id}
 *           onClick={() => timeSlotService.onTimeSlotClick(slot)}
 *           className={selectedTimeSlot?._id === slot._id ? 'selected' : ''}
 *         >
 *           {new Date(slot.startDate).toLocaleTimeString()}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const TimeSlotService =
  implementService.withConfig<TimeSlotServiceConfig>()(
    TimeSlotServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const requestReservationService = getService(
        RequestReservationServiceDefinition,
      );
      const locationService = getService(LocationServiceDefinition);

      const selectedTimeSlotSignal = signalsService.signal<TimeSlot | null>(
        config.selectedTimeSlot || null,
      );
      const timeSlotsSignal = signalsService.signal<TimeSlot[]>(
        config.timeSlots || [],
      );
      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      const onTimeSlotClick = (timeSlot: TimeSlot) => {
        selectedTimeSlotSignal.set(timeSlot);
      };

      const loadTimeSlots = async () => {
        const selectedLocation = locationService.selectedLocationSignal.get();
        const partySize = requestReservationService.partySizeSignal.get();
        const date = requestReservationService.dateSignal.get();

        // Check if all required data is present
        if (!selectedLocation || !partySize || !date) {
          errorSignal.set(
            'All reservation details must be selected to load time slots',
          );
          return;
        }

        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          // Calculate time range for the selected date
          const timeRange = {
            startDate: new Date(`${date.toISOString().split('T')[0]}T00:00:00`),
            endDate: new Date(`${date.toISOString().split('T')[0]}T23:59:00`),
          };

          const response = await timeSlots.getScheduledTimeSlots(
            selectedLocation._id!,
            partySize,
            { timeRange },
          );

          const availableTimeSlots = response.timeSlots || [];
          timeSlotsSignal.set(availableTimeSlots);
        } catch (error) {
          errorSignal.set(
            error instanceof Error
              ? error.message
              : 'Failed to load time slots',
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      signalsService.effect(() => {
        loadTimeSlots();
      });

      const getFilteredTimeSlots = ({
        showUnavailableSlots,
        slotsLimit,
      }: {
        showUnavailableSlots: boolean;
        slotsLimit: number;
      }) => {
        const filteredByAvailability =
          showUnavailableSlots === false
            ? timeSlotsSignal
                .get()
                .filter((slot) => slot.status === 'AVAILABLE')
            : timeSlotsSignal.get();

        // Apply slotsLimit logic if specified
        let filteredTimeSlots = filteredByAvailability;
        if (slotsLimit && selectedTimeSlotSignal.get()) {
          const selectedIndex = filteredByAvailability.findIndex(
            (slot) =>
              slot.startDate === selectedTimeSlotSignal.get()?.startDate,
          );

          if (selectedIndex !== -1) {
            const totalSlots = slotsLimit;
            const slotsBefore = Math.floor(totalSlots / 2);
            const slotsAfter = totalSlots - slotsBefore - 1; // -1 for the selected slot

            // Calculate how many slots we can actually get before and after
            const availableBefore = selectedIndex;
            const availableAfter =
              filteredByAvailability.length - selectedIndex - 1;

            // Determine actual start and end positions
            let start, end;

            if (
              availableBefore >= slotsBefore &&
              availableAfter >= slotsAfter
            ) {
              // Ideal case: we can get the desired distribution
              start = selectedIndex - slotsBefore;
              end = selectedIndex + slotsAfter + 1;
            } else if (availableBefore < slotsBefore) {
              // Not enough slots before, take all available before and fill with after
              start = 0;
              const remainingSlots = totalSlots - availableBefore - 1; // -1 for selected
              end = Math.min(
                selectedIndex + remainingSlots + 1,
                filteredByAvailability.length,
              );
            } else {
              // Not enough slots after, take all available after and fill with before
              end = filteredByAvailability.length;
              const remainingSlots = totalSlots - availableAfter - 1; // -1 for selected
              start = Math.max(selectedIndex - remainingSlots, 0);
            }

            filteredTimeSlots = filteredByAvailability.slice(start, end);
          }
        } else if (slotsLimit) {
          // If no selected time slot, just take the first N slots
          filteredTimeSlots = filteredByAvailability.slice(0, slotsLimit);
        }

        return filteredTimeSlots;
      };

      return {
        selectedTimeSlotSignal,
        timeSlotsSignal,
        loadingSignal,
        errorSignal,
        onTimeSlotClick,
        loadTimeSlots,
        getFilteredTimeSlots,
      };
    },
  );
