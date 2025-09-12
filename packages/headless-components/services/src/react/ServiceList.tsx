import React from 'react';
import { useService } from '@wix/services-manager-react';
import { TestIds } from './test-ids';
import { AsChildSlot } from '@wix/headless-utils/react';
import {
  Root as CoreServiceListRoot,
  Error as CoreServiceListError,
} from './core/ServiceList';
import {
  ServicesListServiceConfig,
  ServicesListServiceDefinition,
} from '../services/services-list-service.js';
import { services } from '@wix/bookings';

/**
 * Props for the ServiceList root component following the documented API
 */
export interface ServiceListRootProps {
  children:
    | ((props: { services: services.Service[] }) => React.ReactNode)
    | React.ReactNode;
  services?: services.Service[];
  servicesListConfig?: ServicesListServiceConfig;
  className?: string;
}

/**
 * Root component that provides the ServiceList context for rendering service lists.
 * This component manages the service data and provides it to child components through context.
 */
export const List = React.forwardRef<HTMLElement, ServiceListRootProps>(
  (props: ServiceListRootProps, ref: React.Ref<HTMLElement>) => {
    const { children, services = [], servicesListConfig, className } = props;

    const serviceConfig = servicesListConfig || {
      services: services,
      searchOptions: {
        cursorPaging: { limit: 10 },
      },
      pagingMetadata: {
        count: services?.length || 0,
      },
      aggregations: {
        results: [],
      },
      customizations: [],
    };

    return (
      <CoreServiceListRoot servicesListConfig={serviceConfig}>
        <ListContent children={children} className={className} ref={ref} />
      </CoreServiceListRoot>
    );
  },
);

List.displayName = 'Services.List';

interface ListContentProps {
  children:
    | ((props: { services: services.Service[] }) => React.ReactNode)
    | React.ReactNode;
  className?: string;
}

const ListContent = React.forwardRef<HTMLElement, ListContentProps>(
  (props: ListContentProps, ref: React.Ref<HTMLElement>) => {
    const { children, className } = props;
    const servicesListService = useService(ServicesListServiceDefinition);
    const services = servicesListService.services.get();
    const pagingMetadata = servicesListService.pagingMetadata.get();

    const displayedServices = services.length;
    const totalServices = pagingMetadata?.count || services.length;
    const isFiltered =
      Object.keys(servicesListService.filters.get()).length > 0;

    const attributes = {
      'data-testid': TestIds.servicesList,
      'data-total-services': totalServices,
      'data-displayed-services': displayedServices,
      'data-filtered': isFiltered,
      className,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {typeof children === 'function' ? children({ services }) : children}
      </div>
    );
  },
);

export interface ServiceOptionsProps {
  children:
    | ((props: { services: services.Service[] }) => React.ReactNode)
    | React.ReactNode;
  emptyState?: React.ReactNode;
  infiniteScroll?: boolean;
  pageSize?: number;
  className?: string;
}

export const Options = React.forwardRef<HTMLElement, ServiceOptionsProps>(
  (props: ServiceOptionsProps, ref: React.Ref<HTMLElement>) => {
    const {
      children,
      emptyState,
      infiniteScroll = true,
      pageSize = 0,
      className,
    } = props;
    const servicesListService = useService(ServicesListServiceDefinition);
    const services = servicesListService.services.get();
    const hasServices = services.length > 0;

    if (!hasServices) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.servicesOptions,
      'data-empty': !hasServices,
      'data-infinite-scroll': infiniteScroll,
      'data-page-size': pageSize,
      className,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {typeof children === 'function' ? children({ services }) : children}
      </div>
    );
  },
);

Options.displayName = 'Services.Options';

export interface ServiceRepeaterProps {
  children:
    | ((props: { service: services.Service }) => React.ReactNode)
    | React.ReactNode;
}

export const ServiceRepeater = React.forwardRef<
  HTMLElement,
  ServiceRepeaterProps
>((props: ServiceRepeaterProps, ref: React.Ref<HTMLElement>) => {
  const { children } = props;
  const servicesListService = useService(ServicesListServiceDefinition);
  const services = servicesListService.services.get();
  const hasServices = services.length > 0;

  if (!hasServices) return null;

  return (
    <div ref={ref}>
      {services.map((service) => (
        <Service.Root
          key={service._id}
          service={service}
          data-testid={TestIds.serviceRepeater}
          data-service-id={service._id}
        >
          {typeof children === 'function' ? children({ service }) : children}
        </Service.Root>
      ))}
    </div>
  );
});

ServiceRepeater.displayName = 'Services.ServiceRepeater';

export interface RawProps {
  children:
    | ((props: {
        totalServices: number;
        displayedServices: number;
        isFiltered: boolean;
      }) => React.ReactNode)
    | React.ReactNode;
}

export const Raw = React.forwardRef<HTMLElement, RawProps>(
  (props: RawProps, ref: React.Ref<HTMLElement>) => {
    const { children } = props;
    const servicesListService = useService(ServicesListServiceDefinition);
    const services = servicesListService.services.get();
    const pagingMetadata = servicesListService.pagingMetadata.get();
    const displayedServices = services.length;
    const totalServices = pagingMetadata?.count || services.length;
    const isFiltered =
      Object.keys(servicesListService.filters.get()).length > 0;

    return (
      <div ref={ref}>
        {typeof children === 'function'
          ? children({ totalServices, displayedServices, isFiltered })
          : children}
      </div>
    );
  },
);

Raw.displayName = 'Services.Raw';

export interface ErrorProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Error = React.forwardRef<HTMLElement, ErrorProps>(
  (props: ErrorProps, ref: React.Ref<HTMLElement>) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreServiceListError>
        {({ error }) => {
          if (!error) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.serviceError}
              data-error={error}
              customElement={children}
              customElementProps={{
                error,
              }}
              content={error}
              {...otherProps}
            >
              <div className="text-status-error text-sm sm:text-base">
                {error}
              </div>
            </AsChildSlot>
          );
        }}
      </CoreServiceListError>
    );
  },
);

Error.displayName = 'Services.Error';

export const Service = {
  Root: React.forwardRef<
    HTMLElement,
    {
      service: services.Service;
      children:
        | ((props: { service: services.Service }) => React.ReactNode)
        | React.ReactNode;
      [key: string]: any; // For additional props like data-testid
    }
  >(
    (
      props: {
        service: services.Service;
        children:
          | ((props: { service: services.Service }) => React.ReactNode)
          | React.ReactNode;
        [key: string]: any;
      },
      ref: React.Ref<HTMLElement>,
    ) => {
      const { service, children, ...rest } = props;

      return (
        <ServiceContext.Provider value={{ service }}>
          <div
            data-testid={TestIds.serviceRoot}
            ref={ref as React.Ref<HTMLDivElement>}
            {...rest}
          >
            {typeof children === 'function' ? children({ service }) : children}
          </div>
        </ServiceContext.Provider>
      );
    },
  ),

  Name: React.forwardRef<HTMLElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      return (
        <div
          data-testid={TestIds.serviceName}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {service.name}
        </div>
      );
    },
  ),

  Description: React.forwardRef<HTMLElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      if (!service.description) return null;

      return (
        <div
          data-testid={TestIds.serviceDescription}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {service.description}
        </div>
      );
    },
  ),

  Price: React.forwardRef<HTMLElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      if (!service.payment?.fixed?.price) return null;

      return (
        <div
          data-testid={TestIds.servicePrice}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {service.payment?.fixed?.price.value}{' '}
          {service.payment?.fixed?.price.currency}
        </div>
      );
    },
  ),

  Duration: React.forwardRef<HTMLElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      if (!service?.schedule?.availabilityConstraints?.durations?.[0])
        return null;

      return (
        <div
          data-testid={TestIds.serviceDuration}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {service?.schedule?.availabilityConstraints?.durations?.[0] + ''}
        </div>
      );
    },
  ),

  Image: React.forwardRef<HTMLImageElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLImageElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      //if (!service.media?.mainMedia?.image) return null;
      //const src = wixMedia.getScaledToFillImageUrl('11062b_c127c132f14e41a1a4a9182888bf05ba~mv2.jpg', 2048, 2048, {});

      return (
        <img
          src={
            'https://static.wixstatic.com/media/11062b_c127c132f14e41a1a4a9182888bf05ba~mv2.jpg'
          }
          alt={service.name || ''}
          data-testid={TestIds.serviceImage}
          ref={ref as React.Ref<HTMLImageElement>}
          className={className}
        />
      );
    },
  ),

  Category: React.forwardRef<HTMLElement, { className?: string }>(
    (props: { className?: string }, ref: React.Ref<HTMLElement>) => {
      const context = React.useContext(ServiceContext);
      if (!context) {
        throw new Error(
          'Service components must be used within a Service.Root component',
        );
      }
      const { service } = context;
      const { className } = props;

      if (!service.category) return null;

      return (
        <div
          data-testid={TestIds.serviceCategory}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {service.category?.name}
        </div>
      );
    },
  ),
};

// Create a Service Context for individual service components
interface ServiceContextValue {
  service: services.Service;
}

const ServiceContext = React.createContext<ServiceContextValue | undefined>(
  undefined,
);

Service.Root.displayName = 'Service.Root';
Service.Name.displayName = 'Service.Name';
Service.Description.displayName = 'Service.Description';
Service.Price.displayName = 'Service.Price';
Service.Duration.displayName = 'Service.Duration';
Service.Image.displayName = 'Service.Image';
Service.Category.displayName = 'Service.Category';

// Export individual components for better tree-shaking
export const ServiceRoot = Service.Root;
export const ServiceName = Service.Name;
export const ServiceDescription = Service.Description;
export const ServicePrice = Service.Price;
export const ServiceDuration = Service.Duration;
export const ServiceImage = Service.Image;
export const ServiceCategory = Service.Category;
