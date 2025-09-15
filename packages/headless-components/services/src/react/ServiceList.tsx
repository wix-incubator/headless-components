import React from 'react';
import { useService } from '@wix/services-manager-react';
import { TestIds } from './test-ids.js';
import { AsChildSlot } from '@wix/headless-utils/react';
import {
  Root as CoreServiceListRoot,
  Error as CoreServiceListError,
} from './core/ServiceList.js';
import { Root as CoreServiceRoot } from './core/Service.js';

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
export const List = React.forwardRef<HTMLDivElement, ServiceListRootProps>(
  (props: ServiceListRootProps, ref: React.Ref<HTMLDivElement>) => {
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

const ListContent = React.forwardRef<HTMLDivElement, ListContentProps>(
  (props: ListContentProps, ref: React.Ref<HTMLDivElement>) => {
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

export const Options = React.forwardRef<HTMLDivElement, ServiceOptionsProps>(
  (props: ServiceOptionsProps, ref: React.Ref<HTMLDivElement>) => {
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
  className?: string;
}

export const ServiceRepeater = React.forwardRef<
  HTMLDivElement,
  ServiceRepeaterProps
>((props: ServiceRepeaterProps, _ref: React.Ref<HTMLDivElement>) => {
  const { children, className } = props;
  const servicesListService = useService(ServicesListServiceDefinition);
  const services = servicesListService.services.get();
  const hasServices = services.length > 0;

  if (!hasServices) return null;

  return (
    <>
      {services.map((service) => (
        <CoreServiceRoot
          key={service._id}
          serviceConfig={{ service }}
          data-testid={TestIds.serviceRepeater}
          data-service-id={service._id}
          className={className}
        >
          {typeof children === 'function' ? children({ service }) : children}
        </CoreServiceRoot>
      ))}
    </>
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

export const Raw = React.forwardRef<HTMLDivElement, RawProps>(
  (props: RawProps, ref: React.Ref<HTMLDivElement>) => {
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

export const Error = React.forwardRef<HTMLDivElement, ErrorProps>(
  (props: ErrorProps, ref: React.Ref<HTMLDivElement>) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreServiceListError>
        {({ error }: { error: string | null }) => {
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
