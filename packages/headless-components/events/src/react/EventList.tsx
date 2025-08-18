import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { type AsChildProps, useAsChild } from '../utils/asChild.js';
import {
  EventListService,
  EventListServiceDefinition,
  type EventListServiceConfig,
} from '../services/event-list-service.js';
import { type Event } from '../services/event-service.js';

enum TestIds {
  eventListEvents = 'event-list-events',
}

export interface EventListRootProps {
  events?: Event[];
  children: React.ReactNode;
}

export function Root(props: EventListRootProps): React.ReactNode {
  const { events = [], children } = props;

  const eventListServiceConfig: EventListServiceConfig = {
    events,
  };

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
}

export interface EventListEventsProps extends AsChildProps {
  emptyState?: React.ReactNode;
}

export function Events(props: EventListEventsProps): React.ReactNode {
  const { asChild, children, emptyState, ...otherProps } = props;
  const Comp = useAsChild(asChild, 'div');

  const service = useService(EventListServiceDefinition);
  const events = service.events.get();

  if (!events.length) {
    return emptyState || null;
  }

  return (
    <Comp data-testid={TestIds.eventListEvents} {...otherProps}>
      {children}
    </Comp>
  );
}

export interface EventListEventRepeaterProps extends AsChildProps {}

export function EventRepeater(
  props: EventListEventRepeaterProps,
): React.ReactNode {
  const { asChild, children, ...otherProps } = props;
  const Comp = useAsChild(asChild, 'div');

  // const service = useService(EventListServiceDefinition);
  // const events = service.events.get();

  return (
    <Comp {...otherProps}>
      {/* {events.map((event, index) => (
        <Event.Root key={event._id || index} event={event}>
          {children}
        </Event.Root>
      ))} */}
    </Comp>
  );
}
