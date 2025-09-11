import { type Signal, type ReadOnlySignal } from '@wix/services-definitions/core-services/signals';
import { services } from '@wix/bookings';
export declare const DEFAULT_QUERY_LIMIT = 100;
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
        sort?: Array<{
            fieldName: string;
            order: 'ASC' | 'DESC';
        }>;
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
 * Service definition for the Services List service.
 * This defines the reactive API contract for managing a list of services with search, pagination, and filtering capabilities.
 *
 * @constant
 */
export declare const ServicesListServiceDefinition: string & {
    __api: {
        /** Reactive signal containing the list of services */
        services: Signal<services.Service[]>;
        /** Reactive signal containing pagination metadata */
        pagingMetadata: Signal<ServicesListServiceConfig["pagingMetadata"]>;
        /** Reactive signal indicating if services are currently being loaded */
        isLoading: Signal<boolean>;
        /** Reactive signal containing any error message, or null if no error*/
        error: Signal<string | null>;
        /** Reactive signal containing the current sort configuration */
        sort: Signal<{
            fieldName: string;
            order: "ASC" | "DESC";
        }[]>;
        /** Reactive signal containing the current filter configuration */
        filters: Signal<Record<string, any>>;
        /** Function to update sort configuration */
        setSort: (sort: {
            fieldName: string;
            order: "ASC" | "DESC";
        }[]) => void;
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
    };
    __config: ServicesListServiceConfig;
    isServiceDefinition?: boolean;
} & {
    /** Reactive signal containing the list of services */
    services: Signal<services.Service[]>;
    /** Reactive signal containing pagination metadata */
    pagingMetadata: Signal<ServicesListServiceConfig["pagingMetadata"]>;
    /** Reactive signal indicating if services are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error*/
    error: Signal<string | null>;
    /** Reactive signal containing the current sort configuration */
    sort: Signal<{
        fieldName: string;
        order: "ASC" | "DESC";
    }[]>;
    /** Reactive signal containing the current filter configuration */
    filters: Signal<Record<string, any>>;
    /** Function to update sort configuration */
    setSort: (sort: {
        fieldName: string;
        order: "ASC" | "DESC";
    }[]) => void;
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
};
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
export declare const ServicesListService: import("@wix/services-definitions").ServiceFactory<string & {
    __api: {
        /** Reactive signal containing the list of services */
        services: Signal<services.Service[]>;
        /** Reactive signal containing pagination metadata */
        pagingMetadata: Signal<ServicesListServiceConfig["pagingMetadata"]>;
        /** Reactive signal indicating if services are currently being loaded */
        isLoading: Signal<boolean>;
        /** Reactive signal containing any error message, or null if no error*/
        error: Signal<string | null>;
        /** Reactive signal containing the current sort configuration */
        sort: Signal<{
            fieldName: string;
            order: "ASC" | "DESC";
        }[]>;
        /** Reactive signal containing the current filter configuration */
        filters: Signal<Record<string, any>>;
        /** Function to update sort configuration */
        setSort: (sort: {
            fieldName: string;
            order: "ASC" | "DESC";
        }[]) => void;
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
    };
    __config: ServicesListServiceConfig;
    isServiceDefinition?: boolean;
} & {
    /** Reactive signal containing the list of services */
    services: Signal<services.Service[]>;
    /** Reactive signal containing pagination metadata */
    pagingMetadata: Signal<ServicesListServiceConfig["pagingMetadata"]>;
    /** Reactive signal indicating if services are currently being loaded */
    isLoading: Signal<boolean>;
    /** Reactive signal containing any error message, or null if no error*/
    error: Signal<string | null>;
    /** Reactive signal containing the current sort configuration */
    sort: Signal<{
        fieldName: string;
        order: "ASC" | "DESC";
    }[]>;
    /** Reactive signal containing the current filter configuration */
    filters: Signal<Record<string, any>>;
    /** Function to update sort configuration */
    setSort: (sort: {
        fieldName: string;
        order: "ASC" | "DESC";
    }[]) => void;
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
}, ServicesListServiceConfig>;
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
export declare function loadServicesListServiceConfig(searchOptions?: ServicesListServiceConfig['searchOptions']): Promise<ServicesListServiceConfig>;
