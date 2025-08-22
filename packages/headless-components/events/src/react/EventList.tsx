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
}

/**
 * Props for the EventList Root component.
 */
export interface RootProps {
  eventListServiceConfig: EventListServiceConfig;
  children: React.ReactNode;
}

/**
 * Root component that provides the EventList service context for rendering event lists.
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
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * Container for the event list with empty state support.
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
export const Events = React.forwardRef<HTMLDivElement, EventsProps>(
  (props, ref) => {
    const { children, emptyState, className } = props;

    const service = useService(EventListServiceDefinition);
    const events = service.events.get();
    const hasEvents = !!events.length;

    if (!hasEvents) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.eventListEvents,
      'data-empty': !hasEvents,
      className,
    };

    return (
      <div {...attributes} ref={ref}>
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
