import React from 'react';
import { useService } from '@wix/services-manager-react';
import { Service } from './types';
import { TestIds } from './test-ids';
import { AsChildSlot } from '@wix/headless-utils/react';
import * as CoreServiceList from './core/ServiceList';
import { ServicesListServiceDefinition } from '../services/services-list-service';
/**
 * Root component that provides the ServiceList context for rendering service lists.
 * This component manages the service data and provides it to child components through context.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Services } from '@wix/services/components';
 *
 * function ServiceListPage({ services }) {
 *   return (
 *     <Services.List services={services}>
 *       <Services.Options>
 *         <Services.ServiceRepeater>
 *           <Service.Name />
 *           <Service.Price />
 *           <Service.Duration />
 *         </Services.ServiceRepeater>
 *       </Services.Options>
 *     </Services.List>
 *   );
 * }
 * ```
 */
export const List = React.forwardRef((props, ref) => {
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
  return React.createElement(
    CoreServiceList.Root,
    { servicesListConfig: serviceConfig },
    React.createElement(ListContent, {
      children: children,
      className: className,
      ref: ref,
    }),
  );
});
List.displayName = 'Services.List';
const ListContent = React.forwardRef((props, ref) => {
  const { children, className } = props;
  const servicesListService = useService(ServicesListServiceDefinition);
  const services = servicesListService.services.get();
  const pagingMetadata = servicesListService.pagingMetadata.get();
  const displayedServices = services.length;
  const totalServices = pagingMetadata.count || services.length;
  const isFiltered = Object.keys(servicesListService.filters.get()).length > 0;
  const attributes = {
    'data-testid': TestIds.servicesList,
    'data-total-services': totalServices,
    'data-displayed-services': displayedServices,
    'data-filtered': isFiltered,
    className,
  };
  return React.createElement('div', { ...attributes, ref: ref }, children);
});
/**
 * Container for the service list with empty state support.
 * Follows List Container Level pattern and provides support for infinite scroll and pagination.
 *
 * @component
 * @example
 * ```tsx
 * <Services.Options
 *   emptyState={<div>No services found</div>}
 *   infiniteScroll={true}
 *   pageSize={10}
 * >
 *   <Services.ServiceRepeater>
 *     <Service.Name />
 *     <Service.Price />
 *     <Service.Duration />
 *   </Services.ServiceRepeater>
 * </Services.Options>
 * ```
 */
export const Options = React.forwardRef((props, ref) => {
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
  return React.createElement('div', { ...attributes, ref: ref }, children);
});
Options.displayName = 'Services.Options';
/**
 * Repeater component that renders Service.Root for each service.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Services.ServiceRepeater>
 *   <Service.Name />
 *   <Service.Price />
 *   <Service.Duration />
 *   <Service.Description />
 *   <Service.Image />
 * </Services.ServiceRepeater>
 * ```
 */
export const ServiceRepeater = React.forwardRef((props, ref) => {
  const { children } = props;
  const servicesListService = useService(ServicesListServiceDefinition);
  const services = servicesListService.services.get();
  const hasServices = services.length > 0;
  if (!hasServices) return null;
  return React.createElement(
    React.Fragment,
    null,
    services.map((service) =>
      React.createElement(
        Service.Root,
        {
          key: service._id,
          service: service,
          'data-testid': TestIds.serviceRepeater,
          'data-service-id': service._id,
        },
        children,
      ),
    ),
  );
});
ServiceRepeater.displayName = 'Services.ServiceRepeater';
export const Raw = React.forwardRef((props, _ref) => {
  const { children } = props;
  const servicesListService = useService(ServicesListServiceDefinition);
  const services = servicesListService.services.get();
  const pagingMetadata = servicesListService.pagingMetadata.get();
  const displayedServices = services.length;
  const totalServices = pagingMetadata.count || services.length;
  const isFiltered = Object.keys(servicesListService.filters.get()).length > 0;
  return typeof children === 'function'
    ? children({ totalServices, displayedServices, isFiltered })
    : children;
});
Raw.displayName = 'Services.Raw';
export const Error = React.forwardRef((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  return React.createElement(CoreServiceList.Error, null, ({ error }) => {
    if (!error) {
      return null;
    }
    return React.createElement(
      AsChildSlot,
      {
        ref: ref,
        asChild: asChild,
        className: className,
        'data-testid': TestIds.serviceError,
        'data-error': error,
        customElement: children,
        customElementProps: {
          error,
        },
        content: error,
        ...otherProps,
      },
      React.createElement(
        'div',
        { className: 'text-status-error text-sm sm:text-base' },
        error,
      ),
    );
  });
});
Error.displayName = 'Services.Error';
/**
 * Service components namespace containing all service-specific components.
 * Each component handles a specific aspect of service display.
 *
 * @namespace
 * @example
 * ```tsx
 * <Service.Root service={service}>
 *   <Service.Name />
 *   <Service.Description />
 *   <Service.Price />
 *   <Service.Duration />
 *   <Service.Image />
 *   <Service.Category />
 * </Service.Root>
 * ```
 */
export const Service = {
  Root: React.forwardRef((props, ref) => {
    const { service, children, ...rest } = props;
    return React.createElement(
      ServiceContext.Provider,
      { value: { service } },
      React.createElement(
        'div',
        { 'data-testid': TestIds.serviceRoot, ref: ref, ...rest },
        children,
      ),
    );
  }),
  Name: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    return React.createElement(
      'div',
      { 'data-testid': TestIds.serviceName, ref: ref },
      service.name,
    );
  }),
  Description: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    if (!service.description) return null;
    return React.createElement(
      'div',
      { 'data-testid': TestIds.serviceDescription, ref: ref },
      service.description,
    );
  }),
  Price: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    if (!service.payment?.fixed?.price) return null;
    return React.createElement(
      'div',
      { 'data-testid': TestIds.servicePrice, ref: ref },
      service.payment?.fixed?.price.value,
      ' ',
      service.payment?.fixed?.price.currency,
    );
  }),
  Duration: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    if (!service.schedule?.availabilityConstraints?.durations) return null;
    return React.createElement(
      'div',
      { 'data-testid': TestIds.serviceDuration, ref: ref },
      service.schedule?.availabilityConstraints?.durations[0].durationInMinutes,
      ' minutes',
    );
  }),
  Image: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    if (!service.imageUrl) return null;
    return React.createElement('img', {
      src: service.imageUrl,
      alt: service.name,
      'data-testid': TestIds.serviceImage,
      ref: ref,
    });
  }),
  Category: React.forwardRef((props, ref) => {
    const { service } = React.useContext(ServiceContext);
    if (!service.category) return null;
    return React.createElement(
      'div',
      { 'data-testid': TestIds.serviceCategory, ref: ref },
      service.category,
    );
  }),
};
// Create a Service Context for individual service components
const ServiceContext = React.createContext(null);
