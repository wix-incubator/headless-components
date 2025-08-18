import {
  EventList as EventListPrimitive,
  Event as EventPrimitive,
} from '@wix/headless-events/react';

interface EventListProps {}

export function EventList({}: EventListProps) {
  return (
    <EventListPrimitive.Root events={[]}>
      <EventListPrimitive.Events emptyState={<div>No events</div>}>
        <EventListPrimitive.EventRepeater>
          <EventPrimitive.Title />
        </EventListPrimitive.EventRepeater>
      </EventListPrimitive.Events>
    </EventListPrimitive.Root>
  );
}
