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
          <EventPrimitive.Image width={250} height={120} />
          <EventPrimitive.Title />
          <EventPrimitive.Date />
          <EventPrimitive.Location />
          <EventPrimitive.Description />
        </EventListPrimitive.EventRepeater>
      </EventListPrimitive.Events>
    </EventListPrimitive.Root>
  );
}
