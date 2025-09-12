import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ServicesListService,
  ServicesListServiceDefinition,
  type ServicesListServiceConfig,
} from '../../services/services-list-service.js';
import { services } from '@wix/bookings';

/**
 * Props for Root headless component
 */
export interface RootProps {
  /** Child components that will have access to the ServiceList service */
  children: React.ReactNode;
  /** Configuration for the ServiceList service */
  servicesListConfig: ServicesListServiceConfig;
}

/**
 * Root component that provides ServiceList service context to its children.
 * This component sets up the necessary services for managing services list state,
 * including filtering, sorting, and pagination functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function ServiceListPage() {
 *   return (
 *     <Services.Root
 *       servicesListConfig={{
 *         services: myServices,
 *         searchOptions: {
 *           cursorPaging: { limit: 10 },
 *           sort: [{ fieldName: 'name', order: 'ASC' }]
 *         },
 *         pagingMetadata: { count: 10, hasNext: true }
 *       }}
 *     >
 *       <Services.Options>
 *         <Services.ServiceRepeater>
 *           <Service.Name />
 *           <Service.Price />
 *           <Service.Duration />
 *         </Services.ServiceRepeater>
 *       </Services.Options>
 *     </Services.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ServicesListServiceDefinition,
        ServicesListService,
        props.servicesListConfig,
      )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for EmptyState headless component
 */
export interface EmptyStateProps {
  /** Content to display when services list is empty (can be a render function or ReactNode) */
  children:
    | ((props: EmptyStateRenderProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Render props for EmptyState component
 */
export interface EmptyStateRenderProps {}

/**
 * Component that renders content when the services list is empty.
 * Only displays its children when there are no services, no loading state, and no errors.
 *
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function EmptyServicesMessage() {
 *   return (
 *     <Services.EmptyState>
 *       {() => (
 *         <div className="empty-state">
 *           <h3>No services found</h3>
 *           <p>Try adjusting your search or filter criteria</p>
 *           <button>Clear Filters</button>
 *         </div>
 *       )}
 *     </Services.EmptyState>
 *   );
 * }
 * ```
 */
export function EmptyState(props: EmptyStateProps): React.ReactNode {
  const {
    isLoading,
    error,
    services: servicesList,
  } = useService(ServicesListServiceDefinition);
  const isLoadingValue = isLoading.get();
  const errorValue = error.get();
  const servicesValue = servicesList.get();

  if (!isLoadingValue && !errorValue && servicesValue.length === 0) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
}

/**
 * Props for Loading headless component
 */
export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Loading component
 */
export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the services list is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function ServicesLoading() {
 *   return (
 *     <Services.Loading>
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading services...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </Services.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps): React.ReactNode {
  const { isLoading } = useService(ServicesListServiceDefinition);
  const isLoadingValue = isLoading.get();

  if (isLoadingValue) {
    return typeof props.children === 'function'
      ? props.children({})
      : props.children;
  }

  return null;
}

/**
 * Props for Error headless component
 */
export interface ErrorProps {
  /** Content to display during error state (can be a render function or ReactNode) */
  children: ((props: ErrorRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Error component
 */
export interface ErrorRenderProps {
  /** Error message */
  error: string | null;
}

/**
 * Component that renders content when there's an error loading services.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function ServicesError() {
 *   return (
 *     <Services.Error>
 *       {({ error }) => (
 *         <div className="error-state">
 *           <h3>Error loading services</h3>
 *           <p>{error}</p>
 *           <button onClick={() => window.location.reload()}>
 *             Try Again
 *           </button>
 *         </div>
 *       )}
 *     </Services.Error>
 *   );
 * }
 * ```
 */
export function Error(props: ErrorProps): React.ReactNode {
  const { error } = useService(ServicesListServiceDefinition);
  const errorValue = error.get();

  if (errorValue) {
    return typeof props.children === 'function'
      ? props.children({ error: errorValue })
      : props.children;
  }

  return null;
}

/**
 * Props for ItemContent headless component
 */
export interface ItemContentProps {
  /** Content to display for each service (can be a render function receiving service data or ReactNode) */
  children:
    | ((props: ItemContentRenderProps) => React.ReactNode)
    | React.ReactNode;
}

/**
 * Render props for ItemContent component
 */
export interface ItemContentRenderProps {
  /** Service data */
  service: services.Service;
}

/**
 * Component that renders content for each service in the list.
 * Maps over all services and provides each service through a service context.
 * Only renders when services are successfully loaded (not loading, no error, and has services).
 *
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function ServicesGrid() {
 *   return (
 *     <Services.ItemContent>
 *       {({ service }) => (
 *         <div className="service-card">
 *           <img src={service.info.media?.mainMedia?.image?.url} alt={service.info.name} />
 *           <h3>{service.info.name}</h3>
 *           <p>{service.payment?.price} {service.payment?.currency}</p>
 *           <button>Book Now</button>
 *         </div>
 *       )}
 *     </Services.ItemContent>
 *   );
 * }
 * ```
 */
export function ItemContent(props: ItemContentProps): React.ReactNode {
  const {
    services: servicesList,
    isLoading,
    error,
  } = useService(ServicesListServiceDefinition);
  const servicesValue = servicesList.get();

  if (isLoading.get() || error.get() || servicesValue.length === 0) {
    return null;
  }

  return servicesValue.map((service: services.Service) => (
    <WixServices key={service._id} servicesMap={createServicesMap()}>
      {typeof props.children === 'function'
        ? props.children({ service })
        : props.children}
    </WixServices>
  ));
}

export type ItemsProps = {
  children: ((props: ItemsRenderProps) => React.ReactNode) | React.ReactNode;
};

export type ItemsRenderProps = {
  services: services.Service[];
};

export function Items(props: ItemsProps) {
  const { services: servicesList } = useService(ServicesListServiceDefinition);
  const servicesValue = servicesList.get();

  return typeof props.children === 'function'
    ? props.children({ services: servicesValue })
    : props.children;
}
