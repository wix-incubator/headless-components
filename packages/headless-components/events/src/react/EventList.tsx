import { AsChildSlot } from '@wix/headless-utils/react';
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
 *           <Event.RsvpButton>RSVP</Event.RsvpButton>
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
  /** Whether to enable infinite scroll */
  infiniteScroll?: boolean; // Default: true
  /** Number of events to display in a page */
  pageSize?: number; // 0 means no limit, max is 100
}

/**
 * Container for the event list with support for empty state and custom layout.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <EventList.Events emptyState={<div>No events found</div>} infiniteScroll={false} pageSize={3}>
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
    // TODO: Implement infiniteScroll and pageSize logic

    const service = useService(EventListServiceDefinition);
    const events = service.events.get();
    const hasEvents = !!events.length;

    if (!hasEvents) {
      return emptyState || null;
    }

    const attributes = {
      className,
      'data-testid': TestIds.eventListEvents,
      'data-empty': !hasEvents,
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

  const service = useService(EventListServiceDefinition);
  const events = service.events.get();
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
  /** Content to display inside the load more button */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays a button to load more events. Not rendered if infiniteScroll is false or no events are left to load.
 *
 * @component
 * @example
 * ```tsx
 * <EventList.LoadMoreTrigger>
 *   Load More
 * </EventList.LoadMoreTrigger>
 * ```
 */
export const LoadMoreTrigger = React.forwardRef<
  HTMLElement,
  LoadMoreTriggerProps
>((props, ref) => {
  const { asChild, children, className } = props;

  // TODO: Implement service integration
  const hasMoreEvents = true;
  const infiniteScroll = true;

  if (!infiniteScroll || !hasMoreEvents) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventListLoadMore}
      customElement={children}
      onClick={() => {}}
    >
      <button>{children}</button>
    </AsChildSlot>
  );
});

/**
 * Props for the EventList Error component.
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Content to display inside the error message */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an error message when the event list fails to load.
 *
 * @component
 * @example
 * ```tsx
 * <EventList.Error>
 *   Unable to load events.
 * </EventList.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className } = props;

  // TODO: Implement service integration
  const hasError = false;

  if (!hasError) {
    return null;
  }

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.eventListError}
      customElement={children}
    >
      <div>{children}</div>
    </AsChildSlot>
  );
});
