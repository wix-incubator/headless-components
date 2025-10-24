import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { reservationLocations } from '@wix/table-reservations';

export type ReservationLocation = reservationLocations.ReservationLocation;

/**
 * API interface for the Location service, providing reactive location data management.
 * This service handles loading and managing reservation locations data, loading state, and errors.
 *
 * @interface LocationServiceAPI
 */
export interface LocationServiceAPI {
  /** Reactive signal containing the list of reservation locations */
  locationsSignal: Signal<ReservationLocation[]>;
  /** Reactive signal containing the currently selected location */
  selectedLocationSignal: Signal<ReservationLocation | null>;
  /** Reactive signal indicating if locations are currently being loaded */
  loadingSignal: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  errorSignal: Signal<string | null>;
  /** Function to load reservation locations */
  getLocations: () => Promise<void>;
}

/**
 * Service definition for the Location service.
 * This defines the contract that the LocationService must implement.
 *
 * @constant
 */
export const LocationServiceDefinition =
  defineService<LocationServiceAPI>('location');

/**
 * Configuration interface required to initialize the LocationService.
 * Contains the initial location data that will be loaded into the service.
 *
 * @interface LocationServiceConfig
 */
export interface LocationServiceConfig {
  /** The initial locations data to configure the service with */
  locations?: ReservationLocation[];
  /** The initially selected location */
  selectedLocation?: ReservationLocation | null;
}

/**
 * Implementation of the Location service that manages reactive location data.
 * This service provides signals for location data, loading state, and error handling,
 * along with methods to dynamically load locations.
 *
 * @example
 * ```tsx
 * import { LocationService, LocationServiceDefinition } from './location-service';
 * import { useService } from '@wix/services-manager-react';
 *
 * function LocationComponent({ locationConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [LocationServiceDefinition, LocationService.withConfig(locationConfig)]
 *     ])}>
 *       <LocationDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function LocationDisplay() {
 *   const locationService = useService(LocationServiceDefinition);
 *   const locations = locationService.locationsSignal.get();
 *   const isLoading = locationService.loadingSignal.get();
 *   const error = locationService.errorSignal.get();
 *
 *   if (isLoading) return <div>Loading locations...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <ul>
 *       {locations.map(location => (
 *         <li key={location._id}>{location.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export const LocationService =
  implementService.withConfig<LocationServiceConfig>()(
    LocationServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const locationsSignal = signalsService.signal<ReservationLocation[]>(
        config.locations || [],
      );
      const selectedLocationSignal =
        signalsService.signal<ReservationLocation | null>(
          config.selectedLocation || null,
        );
      const loadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null) as Signal<
        string | null
      >;

      const getLocations = async () => {
        loadingSignal.set(true);
        errorSignal.set(null);

        try {
          const { reservationLocations: locations } =
            await reservationLocations.listReservationLocations();
          locationsSignal.set(locations || []);

          // Auto-select default location if no location is currently selected
          const currentSelectedLocation = selectedLocationSignal.get();
          if (!currentSelectedLocation && locations && locations.length > 0) {
            // Find location with default flag, or fallback to first location
            const defaultLocation =
              locations.find((location) => location.default) || locations[0];
            selectedLocationSignal.set(defaultLocation!);
          }
        } catch (error) {
          errorSignal.set(
            error instanceof Error ? error.message : 'Failed to load locations',
          );
        } finally {
          loadingSignal.set(false);
        }
      };

      // Load locations on initialization if not provided
      if (!config.locations || config.locations.length === 0) {
        getLocations();
      }

      return {
        locationsSignal,
        selectedLocationSignal,
        loadingSignal,
        errorSignal,
        getLocations,
      };
    },
  );

/**
 * Success result interface for location service configuration loading.
 * Returned when locations are successfully found and loaded.
 *
 * @interface SuccessLocationServiceConfigResult
 */
export interface SuccessLocationServiceConfigResult {
  /** Type "success" means that the locations were found and the config is valid */
  type: 'success';
  /** The location config containing the loaded locations data */
  config: LocationServiceConfig;
}

/**
 * Not found result interface for location service configuration loading.
 * Returned when locations cannot be found.
 *
 * @interface NotFoundLocationServiceConfigResult
 */
export interface NotFoundLocationServiceConfigResult {
  /** Type "notFound" means that the locations were not found */
  type: 'notFound';
}

/**
 * Loads location service configuration from the Wix Table Reservations API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * reservation locations that will be used to configure the LocationService.
 *
 * @returns Promise that resolves to LocationServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/reservations.astro
 * import { loadLocationServiceConfig } from './location-service';
 * import { LocationList } from './Location';
 *
 * // Load locations data during SSR
 * const locationResult = await loadLocationServiceConfig();
 *
 * // Handle not found case
 * if (locationResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <LocationList.Root locationConfig={locationResult.config}>
 *   <LocationList.ItemContent>
 *     {({ location }) => (
 *       <div>
 *         <h3>{location.name}</h3>
 *         <p>{location.address}</p>
 *       </div>
 *     )}
 *   </LocationList.ItemContent>
 * </LocationList.Root>
 * ```
 */
export async function loadLocationServiceConfig(): Promise<
  SuccessLocationServiceConfigResult | NotFoundLocationServiceConfigResult
> {
  try {
    const { reservationLocations: locations } =
      await reservationLocations.listReservationLocations();

    if (!locations || locations.length === 0) {
      return { type: 'notFound' };
    }

    // Find default location for SSR initialization
    const defaultLocation =
      locations.find((location) => location.default) || locations[0];

    return {
      type: 'success',
      config: {
        locations,
        selectedLocation: defaultLocation,
      },
    };
  } catch (error) {
    console.error('Failed to load reservation locations:', error);
    return { type: 'notFound' };
  }
}
