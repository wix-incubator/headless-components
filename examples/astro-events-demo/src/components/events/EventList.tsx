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
      <EventListPrimitive.Events
        className="grid justify-center grid-cols-[repeat(3,minmax(280px,360px))] gap-5"
        emptyState={
          <div className="text-center text-white py-12">
            <p className="text-xl">No events available</p>
            <p className="text-sm mt-2">
              Check back later for upcoming events!
            </p>
          </div>
        }
      >
        <EventListPrimitive.EventRepeater>
          <div className="bg-surface-card flex flex-col">
            <div className="relative w-full pt-[100%] bg-accent-medium">
              <EventPrimitive.Image
                width={560}
                height={560}
                className="absolute top-0 w-full h-full object-cover"
              />
            </div>

            <div className="p-8 flex flex-col flex-grow text-center">
              <EventPrimitive.Title className="text-2xl font-semibold text-content-primary mb-1 line-clamp-2" />

              <div className="text-sm text-content-secondary mb-4">
                <EventPrimitive.Date format="short" />
                <span className="mx-1">|</span>
                <EventPrimitive.Location format="short" />
              </div>

              <button className="underline font-light text-content-primary mb-8">
                More info
              </button>

              <EventPrimitive.RsvpButton
                asChild
                className="btn-primary self-center font-light py-2 px-10 mt-auto"
              >
                {({ event }) => (
                  <button
                    onClick={() => {
                      window.location.href = `/events/${event.slug}`;
                    }}
                  >
                    Buy Tickets
                  </button>
                )}
              </EventPrimitive.RsvpButton>
            </div>
          </div>
        </EventListPrimitive.EventRepeater>
      </EventListPrimitive.Events>

      <EventListPrimitive.LoadMoreTrigger
        className="btn-primary block font-light py-2 px-4 mt-8 mx-auto"
        label="Load More"
      />
    </EventListPrimitive.Root>
  );
}
