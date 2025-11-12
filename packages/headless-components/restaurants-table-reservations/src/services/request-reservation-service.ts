import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import {
  LocationServiceDefinition,
  type ReservationLocation,
} from './location-service.js';

/**
 * API interface for the RequestReservation service, providing reactive reservation request data management.
 * This service handles managing party size and date selections for reservations.
 * It reacts to the selected location from LocationService to provide relevant options.
 *
 * @interface RequestReservationServiceAPI
 */
export interface RequestReservationServiceAPI {
  /** Reactive signal containing the selected party size */
  partySizeSignal: Signal<number>;
  /** Reactive signal containing available party size options */
  partySizeOptionsSignal: Signal<number[]>;
  /** Function to handle party size changes */
  onPartySizeChange: (partySize: number) => void;
  /** Reactive signal containing the selected date */
  dateSignal: Signal<Date>;
  /** Function to handle date changes */
  onDateChange: (date: Date) => void;
  /** Function to validate if a date is valid for reservations */
  isValidDate: (date: Date) => boolean;
}

/**
 * Service definition for the RequestReservation service.
 * This defines the contract that the RequestReservationService must implement.
 *
 * @constant
 */
export const RequestReservationServiceDefinition =
  defineService<RequestReservationServiceAPI>('request-reservation');

/**
 * Configuration interface required to initialize the RequestReservationService.
 * Contains the initial reservation data that will be loaded into the service.
 *
 * @interface RequestReservationServiceConfig
 */
export interface RequestReservationServiceConfig {
  /** The initial party size */
  partySize?: number;
  /** The initial date */
  date?: Date;
}

/**
 * Implementation of the RequestReservation service that manages reactive reservation request data.
 * This service provides signals for party size and date data, along with methods to update them.
 * It reacts to the LocationService to get the selected location and provide relevant options.
 *
 * @example
 * ```tsx
 * import { RequestReservationService, RequestReservationServiceDefinition } from './request-reservation-service';
 * import { useService } from '@wix/services-manager-react';
 *
 * function RequestReservationComponent({ requestReservationConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [RequestReservationServiceDefinition, RequestReservationService.withConfig(requestReservationConfig)]
 *     ])}>
 *       <RequestReservationForm />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function RequestReservationForm() {
 *   const requestReservationService = useService(RequestReservationServiceDefinition);
 *   const partySize = requestReservationService.partySizeSignal.get();
 *   const partySizeOptions = requestReservationService.partySizeOptionsSignal.get();
 *   const date = requestReservationService.dateSignal.get();
 *
 *   return (
 *     <div>
 *       <select
 *         value={partySize}
 *         onChange={(e) => requestReservationService.onPartySizeChange(parseInt(e.target.value))}
 *       >
 *         {partySizeOptions.map(size => (
 *           <option key={size} value={size}>{size} people</option>
 *         ))}
 *       </select>
 *       <input
 *         type="date"
 *         value={date.toISOString().split('T')[0]}
 *         onChange={(e) => {
 *           const newDate = new Date(e.target.value);
 *           if (requestReservationService.isValidDate(newDate)) {
 *             requestReservationService.onDateChange(newDate);
 *           }
 *         }}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const RequestReservationService =
  implementService.withConfig<RequestReservationServiceConfig>()(
    RequestReservationServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);
      const locationService = getService(LocationServiceDefinition);

      // Get the selected location from LocationService
      const selectedLocationSignal = locationService.selectedLocationSignal;

      // Initialize party size with config value or minimum from location
      const getDefaultPartySize = (): number => {
        if (config.partySize) {
          return config.partySize;
        }

        const selectedLocation = selectedLocationSignal.get();
        if (
          selectedLocation?.configuration?.onlineReservations?.partySize?.min
        ) {
          return selectedLocation.configuration.onlineReservations.partySize
            .min;
        }

        // Fallback to 1 if no configuration is available
        return 1;
      };

      const defaultPartySize = getDefaultPartySize();
      const partySizeSignal = signalsService.signal<number>(defaultPartySize);

      // Initialize party size options based on selected location
      const getPartySizeOptions = (
        location: ReservationLocation | null,
      ): number[] => {
        if (!location?.configuration?.onlineReservations?.partySize) {
          // Fallback to default range if no configuration is available
          return [];
        }

        const { min, max } =
          location.configuration.onlineReservations.partySize;

        // Ensure we have valid min and max values
        const minSize = min || 1;
        const maxSize = max || 10;

        const options: number[] = [];
        for (let i = minSize; i <= maxSize; i++) {
          options.push(i);
        }
        return options;
      };

      const partySizeOptionsSignal = signalsService.signal<number[]>(
        getPartySizeOptions(selectedLocationSignal.get()),
      );

      // Initialize date with today or config value
      const defaultDate = config.date || new Date();
      const dateSignal = signalsService.signal<Date>(defaultDate);

      // Event handlers
      const onPartySizeChange = (partySize: number) => {
        partySizeSignal.set(partySize);
      };

      const onDateChange = (date: Date) => {
        dateSignal.set(date);
      };

      const isValidDate = (date: Date): boolean => {
        if (date < new Date()) {
          return false;
        }
        return true;
      };

      // React to location changes to update party size options
      // Note: In a real implementation, you would use a proper subscription mechanism
      // For now, we'll update the options when the service is initialized
      const updatePartySizeOptions = () => {
        const location = selectedLocationSignal.get();
        const newOptions = getPartySizeOptions(location);
        partySizeOptionsSignal.set(newOptions);

        // Reset party size if current selection is not valid for new location
        const currentPartySize = partySizeSignal.get();
        if (!newOptions.includes(currentPartySize)) {
          partySizeSignal.set(newOptions[0] || 1);
        }
      };

      // Update options initially
      //   updatePartySizeOptions();

      signalsService.effect(() => {
        updatePartySizeOptions();
      });

      return {
        partySizeSignal,
        partySizeOptionsSignal,
        onPartySizeChange,
        dateSignal,
        onDateChange,
        isValidDate,
      };
    },
  );
