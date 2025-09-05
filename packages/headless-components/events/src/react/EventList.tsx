import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  EventListService,
  EventListServiceDefinition,
  type EventListServiceConfig,
} from '../services/event-list-service.js';
import * as Event from './Event.js';

enum TestIds {
  eventListEvents = 'event-list-events',
  eventListLoadMore = 'event-list-load-more',
  eventListError = 'event-list-error',
}

/**
 * Props for the EventList Root component.
 */
export interface RootProps {
  /** Configuration for the event list service */
  eventListServiceConfig: EventListServiceConfig;
  children: React.ReactNode;
}

/**
 * Root container that provides event list context to all child components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { EventList } from '@wix/headless-events/react';
 *
 * function EventListPage({ eventListServiceConfig }) {
 *   return (
 *     <EventList.Root eventListServiceConfig={eventListServiceConfig}>
 *       <EventList.Events>
 *         <EventList.EventRepeater>
 *           <Event.Image />
 *           <Event.Title />
 *           <Event.Date />
 *           <Event.Location />
 *           <Event.Description />
 *           <Event.RsvpButton label="RSVP" />
 *         </EventList.EventRepeater>
 *       </EventList.Events>
 *     </EventList.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps): React.ReactNode => {
  const { eventListServiceConfig, children } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventListServiceDefinition,
        EventListService,
        eventListServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
};

/**
 * Props for the EventList Events component.
 */
export interface EventsProps {
  children: React.ReactNode;
  /** Empty state to display when no events are available */
  emptyState?: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the event list with support for empty state.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <EventList.Events emptyState={<div>No events found</div>}>
 *   <EventList.EventRepeater>
 *     <Event.Image />
 *     <Event.Title />
 *   </EventList.EventRepeater>
 * </EventList.Events>
 * ```
 */
export const Events = React.forwardRef<HTMLElement, EventsProps>(
  (props, ref) => {
    const { children, emptyState, className } = props;

    const eventListService = useService(EventListServiceDefinition);
    const events = eventListService.events.get();
    const hasEvents = !!events.length;

    if (!hasEvents) {
      return emptyState || null;
    }

    const attributes = {
      className,
      'data-testid': TestIds.eventListEvents,
    };

    return (
      <div {...attributes} ref={ref as React.Ref<HTMLDivElement>}>
        {children}
      </div>
    );
  },
);

/**
 * Props for the EventList EventRepeater component.
 */
export interface EventRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders Event.Root for each event.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <EventList.EventRepeater>
 *   <Event.Image />
 *   <Event.Title />
 * </EventList.EventRepeater>
 * ```
 */
export const EventRepeater = (props: EventRepeaterProps): React.ReactNode => {
  const { children } = props;

  const eventListService = useService(EventListServiceDefinition);
  const events = eventListService.events.get();
  const hasEvents = !!events.length;

  if (!hasEvents) {
    return null;
  }

  return (
    <>
      {events.map((event) => (
        <Event.Root key={event._id} event={event}>
          {children}
        </Event.Root>
      ))}
    </>
  );
};

/**
 * Props for the EventList LoadMoreTrigger component.
 */
export interface LoadMoreTriggerProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    isLoading: boolean;
    loadMoreEvents: () => void;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** The label to display inside the button */
  label?: string;
}

/**
 * Displays a button to load more events. Not rendered if no events are left to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <EventList.LoadMoreTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Load More" />
 *
 * // asChild with primitive
 * <EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   <button>Load More</button>
 * </EventList.LoadMoreTrigger>
 *
 * // asChild with react component
 * <EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
 *   {React.forwardRef(({ isLoading, loadMoreEvents, ...props }, ref) => (
 *     <button ref={ref} {...props}>
 *       {isLoading ? 'Loading...' : 'Load More'}
 *     </button>
 *   ))}
 * </EventList.LoadMoreTrigger>
 * ```
 */
export const LoadMoreTrigger = React.forwardRef<
  HTMLElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const { asChild, children, className, label } = props;

  const eventListService = useService(EventListServiceDefinition);
  const isLoading = eventListService.isLoading.get();
  const hasMoreEvents = eventListService.hasMoreEvents.get();

  const loadMoreEvents = () => {
    eventListService.loadMoreEvents();
  };

  if (!hasMoreEvents) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventListLoadMore}
      customElement={children}
      customElementProps={{ isLoading, loadMoreEvents }}
      disabled={isLoading}
      onClick={loadMoreEvents}
    >
      <button>{label}</button>
    </AsChildSlot>
  );
});

/**
 * Props for the EventList Error component.
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ error: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an error message when the event list fails to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <EventList.Error className="text-red-500" />
 *
 * // asChild with primitive
 * <EventList.Error asChild className="text-red-500">
 *   <span />
 * </EventList.Error>
 *
 * // asChild with react component
 * <EventList.Error asChild className="text-red-500">
 *   {React.forwardRef(({ error, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {error}
 *     </span>
 *   ))}
 * </EventList.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className } = props;

  const eventListService = useService(EventListServiceDefinition);
  const error = eventListService.error.get();

  if (!error) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventListError}
      customElement={children}
      customElementProps={{ error }}
      content={error}
    >
      <span>{error}</span>
    </AsChildSlot>
  );
});
