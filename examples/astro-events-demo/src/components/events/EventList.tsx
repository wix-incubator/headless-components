import {
  EventList as EventListPrimitive,
  Event as EventPrimitive,
} from '@wix/headless-events/react';
import { type EventListServiceConfig } from '@wix/headless-events/services';

interface EventListProps {
  eventListServiceConfig: EventListServiceConfig;
}

export function EventList({ eventListServiceConfig }: EventListProps) {
  return (
    <EventListPrimitive.Root eventListServiceConfig={eventListServiceConfig}>
      <EventListPrimitive.Events emptyState={<div>No events</div>}>
        <EventListPrimitive.EventRepeater>
          <EventPrimitive.Title />
        </EventListPrimitive.EventRepeater>
      </EventListPrimitive.Events>
    </EventListPrimitive.Root>
  );
}
