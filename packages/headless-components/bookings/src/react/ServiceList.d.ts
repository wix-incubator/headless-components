import React from 'react';
import { Service } from './types';
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
export declare const List: React.ForwardRefExoticComponent<any>;
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
export declare const Options: React.ForwardRefExoticComponent<
  Omit<ServiceOptionsProps, 'ref'> & React.RefAttributes<HTMLElement>
>;
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
export declare const ServiceRepeater: React.ForwardRefExoticComponent<
  Omit<ServiceRepeaterProps, 'ref'> & React.RefAttributes<HTMLElement>
>;
/**
 * Raw component that provides direct access to service list data.
 * Similar to Service.Raw, this should only be used when you need custom access to list data.
 *
 * @component
 * @example
 * ```tsx
 * <Services.Raw>
 *   {({ totalServices, displayedServices, isFiltered }) => (
 *     <div className="text-content-muted">
 *       Showing {displayedServices} of {totalServices} services
 *       {isFiltered && <span className="ml-2 text-brand-primary">(Filtered)</span>}
 *     </div>
 *   )}
 * </Services.Raw>
 * ```
 */
export interface RawProps {
  children:
    | ((props: {
        totalServices: number;
        displayedServices: number;
        isFiltered: boolean;
      }) => React.ReactNode)
    | React.ReactNode;
}
export declare const Raw: React.ForwardRefExoticComponent<
  RawProps & React.RefAttributes<HTMLElement>
>;
/**
 * Error component that displays service list errors.
 * Provides error data to custom render functions.
 * Only renders when there's an error.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Services.Error className="error-message" />
 *
 * // Custom rendering with forwardRef
 * <Services.Error asChild>
 *   {React.forwardRef(({error, ...props}, ref) => (
 *     <div
 *       ref={ref}
 *       {...props}
 *       className="custom-error-container"
 *     >
 *       Error: {error}
 *     </div>
 *   ))}
 * </Services.Error>
 * ```
 */
export interface ErrorProps {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare const Error: React.ForwardRefExoticComponent<
  ErrorProps & React.RefAttributes<HTMLElement>
>;
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
export declare const Service: {
  Root: React.ForwardRefExoticComponent<
    {
      service: Service;
      children: React.ReactNode;
    } & React.RefAttributes<HTMLElement>
  >;
  Name: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>;
  Description: React.ForwardRefExoticComponent<
    React.RefAttributes<HTMLElement>
  >;
  Price: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>;
  Duration: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>;
  Image: React.ForwardRefExoticComponent<React.RefAttributes<HTMLImageElement>>;
  Category: React.ForwardRefExoticComponent<React.RefAttributes<HTMLElement>>;
};
