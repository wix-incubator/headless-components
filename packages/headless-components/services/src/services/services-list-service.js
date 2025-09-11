import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition, } from '@wix/services-definitions/core-services/signals';
import { services } from '@wix/bookings';
export const DEFAULT_QUERY_LIMIT = 100;
/**
 * Fetches services using the Wix Bookings API.
 * This function handles pagination and returns both services and metadata.
 *
 * @param searchOptions - The search options for querying services
 * @returns Promise that resolves to the search result
 */
const fetchServices = async (searchOptions = {}) => {
    try {
        const query = await services.queryServices();
        // Apply pagination
        if (searchOptions.cursorPaging?.limit) {
            query.limit(searchOptions.cursorPaging.limit);
        }
        // Apply sorting
        if (searchOptions.sort?.length) {
            const { order, fieldName } = searchOptions.sort[0];
            if (order === 'ASC') {
                query.ascending(fieldName);
            }
            else {
                query.descending(fieldName);
            }
        }
        // Apply filtering
        if (searchOptions.filter) {
            if (searchOptions.filter.category) {
                query.eq('category.name', searchOptions.filter.category);
            }
        }
        return query.find();
    }
    catch (error) {
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
export const ServicesListServiceDefinition = defineService('services-list');
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
export const ServicesListService = implementService.withConfig()(ServicesListServiceDefinition, ({ getService, config }) => {
    let firstRun = true;
    const signalsService = getService(SignalsServiceDefinition);
    const servicesSignal = signalsService.signal(config.services);
    const pagingMetadataSignal = signalsService.signal(config.pagingMetadata || { count: 0 });
    const isLoadingSignal = signalsService.signal(false);
    const errorSignal = signalsService.signal(null);
    const sortSignal = signalsService.signal([]);
    const filtersSignal = signalsService.signal({});
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
            }
            catch (error) {
                errorSignal.set(error instanceof Error ? error.message : 'Unknown error');
            }
            finally {
                isLoadingSignal.set(false);
            }
        });
    }
    firstRun = false;
    const loadMoreServices = async (count) => {
        try {
            isLoadingSignal.set(true);
            const result = await pagingMetadataSignal?.peek()?.cursors?.next?.();
            servicesSignal.set([...servicesSignal.peek(), ...(result?.items ?? [])]);
            pagingMetadataSignal.set({
                count: result?.totalCount || 0,
                cursors: {
                    next: result?.next,
                    prev: result?.prev
                },
                hasNext: result?.hasNext()
            });
        }
        catch (error) {
            errorSignal.set(error instanceof Error ? error.message : 'Unknown error');
        }
        finally {
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
        setSort: (sort) => {
            sortSignal.set(sort);
        },
        setFilter: (filter) => {
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
        hasMoreServices: signalsService.computed(() => pagingMetadataSignal.get()?.hasNext ?? false),
    };
});
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
export async function loadServicesListServiceConfig(searchOptions) {
    try {
        const query = services.queryServices();
        // Apply pagination
        query.limit(DEFAULT_QUERY_LIMIT);
        const result = await query.find();
        return {
            services: result.items ?? [],
            searchOptions: {
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
        };
    }
    catch (error) {
        console.error('Error loading services configuration:', error);
        throw error;
    }
}
