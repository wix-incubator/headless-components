import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { services } from '@wix/bookings';

export const DEFAULT_QUERY_LIMIT = 100;

/**
 * Configuration interface for the Services List service.
 * Contains the initial services data, search options, and metadata.
 *
 * @interface ServicesListServiceConfig
 */
export interface ServicesListServiceConfig {
  /** Array of service objects to initialize the service with */
  services: services.Service[];
  /** Search options used to fetch the services */
  searchOptions?: {
    cursorPaging?: {
      limit: number;
    };
    filter?: Record<string, any>;
    sort?: Array<{ fieldName: string; order: 'ASC' | 'DESC' }>;
  };
  /** Pagination metadata from the search response */
  pagingMetadata?: {
    count: number;
    cursors?: {
      next?: () => Promise<services.ServicesQueryResult>;
      prev?: () => Promise<services.ServicesQueryResult>;
    };
    hasNext?: boolean;
  };
}

/**
 * Fetches services using the Wix Bookings API.
 * This function handles pagination and returns both services and metadata.
 *
 * @param searchOptions - The search options for querying services
 * @returns Promise that resolves to the search result
 */
const fetchServices = async (searchOptions: ServicesListServiceConfig['searchOptions'] = {}) => {
  try {
    const query = await services.queryServices();

    // Apply pagination
    if (searchOptions.cursorPaging?.limit) {
      query.limit(searchOptions.cursorPaging.limit);
    }

    // Apply sorting
    if (searchOptions.sort?.length) {
      const { order, fieldName } = searchOptions.sort[0]!;
      if (order === 'ASC') {
        query.ascending(fieldName as any);
      } else {
        query.descending(fieldName as any);
      }
    }

    // Apply filtering
    if (searchOptions.filter) {
      if (searchOptions.filter['category']) {
        query.eq('category.name', searchOptions.filter['category']);
      }
    }

    return query.find();
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

/**
 * Service definition for the Services List service.
 * This defines the reactive API contract for managing a list of services with search, pagination, and filtering capabilities.
 *
 * @constant
 */
export const ServicesListServiceDefinition = defineService<
  {
    /** Reactive signal containing the list of services */
    services: Signal<services.Service[]>;
    /** Reactive signal containing pagination metadata */
    pagingMetadata: Signal<ServicesListServiceConfig['pagingMetadata']>;
    /** Reactive signal indicating if services are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error*/
    error: Signal<string | null>;
    /** Reactive signal containing the current sort configuration */
    sort: Signal<{ fieldName: string; order: 'ASC' | 'DESC' }[]>;
    /** Reactive signal containing the current filter configuration */
    filters: Signal<Record<string, any>>;
    /** Function to update sort configuration */
    setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => void;
    /** Function to update filter configuration */
    setFilter: (filter: Record<string, any>) => void;
    /** Function to reset filter configuration */
    resetFilter: () => void;
    /** Reactive signal indicating if any filters are currently applied */
    isFiltered: () => ReadOnlySignal<boolean>;
    /** Function to load more services */
    loadMore: (count: number) => void;
    /** Reactive signal indicating if there are more services to load */
    hasMoreServices: ReadOnlySignal<boolean>;
  },
  ServicesListServiceConfig
>('services-list');

/**
 * Implementation of the Services List service that manages reactive services data.
 * This service provides signals for services data, search options, pagination,
 * loading state, and error handling.
 *
 * @example
 * ```tsx
 * import { ServicesListService, ServicesListServiceDefinition } from '@wix/services/services';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ServicesComponent({ servicesConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ServicesListServiceDefinition, ServicesListService.withConfig(servicesConfig)]
 *     ])}>
 *       <ServicesDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ServicesDisplay() {
 *   const servicesService = useService(ServicesListServiceDefinition);
 *   const services = servicesService.services.get();
 *   const isLoading = servicesService.isLoading.get();
 *   const error = servicesService.error.get();
 *
 *   if (isLoading) return <div>Loading services...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       {services.map(service => (
 *         <div key={service._id}>
 *           <h3>{service.name}</h3>
 *           <p>{service.description}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const ServicesListService = implementService.withConfig<ServicesListServiceConfig>()(
  ServicesListServiceDefinition,
  ({ getService, config }) => {
    let firstRun = true;
    const signalsService = getService(SignalsServiceDefinition);

    const servicesSignal = signalsService.signal<services.Service[]>(
      config.services
    );

    const pagingMetadataSignal = signalsService.signal<ServicesListServiceConfig['pagingMetadata']>(
      config.pagingMetadata || { count: 0 }
    );

    const isLoadingSignal = signalsService.signal<boolean>(false);
    const errorSignal = signalsService.signal<string | null>(null);
    const sortSignal = signalsService.signal<{ fieldName: string; order: 'ASC' | 'DESC' }[]>([]);
    const filtersSignal = signalsService.signal<Record<string, any>>({});

    if (typeof window !== 'undefined') {
      signalsService.effect(async () => {
        // Read signals to establish dependencies
        const sort = sortSignal.get();
        const filters = filtersSignal.get();

        if (firstRun) {
          firstRun = false;
          return;
        }

        try {
          isLoadingSignal.set(true);

          const result = await fetchServices({
            cursorPaging: { limit: DEFAULT_QUERY_LIMIT },
            sort,
            filter: filters
          });

          servicesSignal.set(result.items);
          pagingMetadataSignal.set({
            count: result.totalCount || 0,
            cursors: {
              next: result.next,
              prev: result.prev
            },
            hasNext: result.hasNext()
          });
        } catch (error) {
          errorSignal.set(
            error instanceof Error ? error.message : 'Unknown error'
          );
        } finally {
          isLoadingSignal.set(false);
        }
      });
    }

    firstRun = false;

    const loadMoreServices = async () => {
      try {
        isLoadingSignal.set(true);

        const result = await pagingMetadataSignal?.peek()?.cursors?.next?.()

        servicesSignal.set([...servicesSignal.peek(), ...(result?.items ?? [])]);
        pagingMetadataSignal.set({
          count: result?.totalCount || 0,
          cursors: {
            next: result?.next,
            prev: result?.prev
          },
          hasNext: result?.hasNext()
        });
      } catch (error) {
        errorSignal.set(
          error instanceof Error ? error.message : 'Unknown error'
        );
      } finally {
        isLoadingSignal.set(false);
      }
    };

    return {
      services: servicesSignal,
      pagingMetadata: pagingMetadataSignal,
      isLoading: isLoadingSignal,
      error: errorSignal,
      sort: sortSignal,
      filters: filtersSignal,
      setSort: (sort: { fieldName: string; order: 'ASC' | 'DESC' }[]) => {
        sortSignal.set(sort);
      },
      setFilter: (filter: Record<string, any>) => {
        filtersSignal.set(filter);
      },
      resetFilter: () => {
        filtersSignal.set({});
      },
      isFiltered: () => {
        return signalsService.computed(() => {
          const filters = filtersSignal.peek();
          return Object.keys(filters).length > 0;
        });
      },
      loadMore: loadMoreServices,
      hasMoreServices: signalsService.computed(
        () => pagingMetadataSignal.get()?.hasNext ?? false
      ),
    };
  }
);

/**
 * Loads services list service configuration from the Wix Bookings API for SSR initialization.
 * This function is designed to be used during Server-Side Rendering (SSR) to preload
 * a list of services based on search criteria.
 *
 * @param {ServicesListServiceConfig['searchOptions']} [searchOptions] - Optional search options to filter and sort services
 * @returns {Promise<ServicesListServiceConfig>} Promise that resolves to the services list configuration
 *
 * @example
 * ```astro
 * ---
 * // Astro page example - pages/services.astro
 * import { loadServicesListServiceConfig } from '@wix/services/services';
 * import { Services } from '@wix/services/components';
 *
 * const servicesConfig = await loadServicesListServiceConfig({
 *   cursorPaging: { limit: 12 },
 *   sort: [{ fieldName: 'name', order: 'ASC' }]
 * });
 * ---
 *
 * <Services.List servicesConfig={servicesConfig}>
 *   <Services.Options>
 *     <Services.ServiceRepeater>
 *       <Service.Name />
 *       <Service.Description />
 *     </Services.ServiceRepeater>
 *   </Services.Options>
 * </Services.List>
 * ```
 */
export async function loadServicesListServiceConfig(
  searchOptions?: ServicesListServiceConfig['searchOptions']
): Promise<ServicesListServiceConfig> {
  try {
    const result = await services.queryServices().find();

    return {
      services: result.items ?? [],
      searchOptions : {
        ...searchOptions,
        cursorPaging: {
          limit: DEFAULT_QUERY_LIMIT
        }
      },
      pagingMetadata: {
        count: result.totalCount ?? 0,
        cursors: {
          next: result.next,
          prev: result.prev
        },
        hasNext: result.hasNext()
      }
    }
  } catch (error) {
    console.error('Error loading services configuration:', error);
    throw error;
  }
}
