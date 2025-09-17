import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import * as services from '@wix/auto_sdk_bookings_services';

/**
 * API interface for the Service service, providing reactive service data management.
 * This service handles loading and managing a single service's data, loading state, and errors.
 *
 * @interface ServiceServiceAPI
 */
export interface ServiceServiceAPI {
  /** Reactive signal containing the current service data */
  service: Signal<services.Service>;
  /** Reactive signal indicating if a service is currently being loaded */
  isLoading: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Function to load a service by its id */
  loadService: (id: string) => Promise<void>;
}

/**
 * Service definition for the Service service.
 * This defines the contract that the ServiceService must implement.
 *
 * @constant
 */
export const ServiceServiceDefinition =
  defineService<ServiceServiceAPI>('service');

/**
 * Configuration interface required to initialize the ServiceService.
 * Contains the initial service data that will be loaded into the service.
 *
 * @interface ServiceServiceConfig
 */
export interface ServiceServiceConfig {
  /** The initial service data to configure the service with */
  service?: services.Service;
  /** The service ID to load if no initial service is provided */
  serviceId?: string;
}

/**
 * Implementation of the Service service that manages reactive service data.
 * This service provides signals for service data, loading state, and error handling,
 * along with methods to dynamically load services.
 *
 * @example
 * ```tsx
 * import { ServiceService, ServiceServiceDefinition } from '@wix/services/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ServiceComponent({ serviceConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ServiceServiceDefinition, ServiceService.withConfig(serviceConfig)]
 *     ])}>
 *       <ServiceDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ServiceDisplay() {
 *   const serviceService = useService(ServiceServiceDefinition);
 *   const service = serviceService.service.get();
 *   const isLoading = serviceService.isLoading.get();
 *   const error = serviceService.error.get();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return <h1>{service.name}</h1>;
 * }
 * ```
 */
export const ServiceService =
  implementService.withConfig<ServiceServiceConfig>()(
    ServiceServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const service: Signal<services.Service> = signalsService.signal(
        config.service as any,
      );
      const isLoading: Signal<boolean> = signalsService.signal(
        !!config.serviceId as any,
      );
      const error: Signal<string | null> = signalsService.signal(null as any);

      const loadService = async (id: string) => {
        isLoading.set(true);
        const serviceResponse = await loadServiceById(id);

        if (!serviceResponse.service) {
          error.set('Service not found');
        } else {
          service.set(serviceResponse.service);
          error.set(null);
        }

        isLoading.set(false);
      };

      if (config.serviceId) {
        loadService(config.serviceId);
      }

      return {
        service,
        isLoading,
        error,
        loadService,
      };
    },
  );

/**
 * Success result interface for service service configuration loading.
 * Returned when a service is successfully found and loaded.
 *
 * @interface SuccessServiceServiceConfigResult
 */
export interface SuccessServiceServiceConfigResult {
  /** Type "success" means that the service was found and the config is valid */
  type: 'success';
  /** The service config containing the loaded service data */
  config: ServiceServiceConfig;
}

/**
 * Not found result interface for service service configuration loading.
 * Returned when a service with the given id cannot be found.
 *
 * @interface NotFoundServiceServiceConfigResult
 */
export interface NotFoundServiceServiceConfigResult {
  /** Type "notFound" means that the service was not found */
  type: 'notFound';
}

/**
 * Internal helper function to load a service by its ID from the Wix Services API.
 * Fetches comprehensive service data including description, categories, media, etc.
 *
 * @private
 * @param {string} id - The service ID to load
 * @returns {Promise} Service response from the API
 */
const loadServiceById = async (id: string) => {
  try {
    const service = await services.getService(id);
    return { service };
  } catch (error) {
    console.error(`Failed to load service for id "${id}":`, error);
    return { service: null };
  }
};

/**
 * Loads service service configuration from the Wix Services API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a specific service by id that will be used to configure the ServiceService.
 *
 * @param serviceId The service id to load
 * @returns Promise that resolves to ServiceServiceConfigResult (success with config or notFound)
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/service/[id].astro
 * import { loadServiceServiceConfig } from '@wix/services/services';
 * import { Service } from '@wix/services/components';
 *
 * // Get service id from URL params
 * const { id } = Astro.params;
 *
 * // Load service data during SSR
 * const serviceResult = await loadServiceServiceConfig(id);
 *
 * // Handle not found case
 * if (serviceResult.type === 'notFound') {
 *   return Astro.redirect('/404');
 * }
 * ---
 *
 * <Service.Root serviceConfig={serviceResult.config}>
 *   <Service.Name>
 *     {({ name }) => <h1>{name}</h1>}
 *   </Service.Name>
 * </Service.Root>
 * ```
 */
export async function loadServiceServiceConfig(
  serviceId: string,
): Promise<
  SuccessServiceServiceConfigResult | NotFoundServiceServiceConfigResult
> {
  try {
    const serviceResponse = await loadServiceById(serviceId);

    if (!serviceResponse.service) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: {
        service: serviceResponse.service,
      },
    };
  } catch (error) {
    console.error(`Failed to load service for id "${serviceId}":`, error);
    return { type: 'notFound' };
  }
}
