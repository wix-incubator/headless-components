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
  eventListEvent = 'event-list-event',
}

export interface RootProps {
  eventListServiceConfig: EventListServiceConfig;
  children: React.ReactNode;
}

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

export interface EventsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

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

export interface EventRepeaterProps {
  children: React.ReactNode;
}

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
        <Event.Root
          key={event._id}
          event={event}
          data-testid={TestIds.eventListEvent}
          data-event-id={event._id}
        >
          {children}
        </Event.Root>
      ))}
    </>
  );
};
