import {
  EventList as EventListPrimitive,
  Event as EventPrimitive,
} from '@wix/headless-events/react';
import { type EventListServiceConfig } from '@wix/headless-events/services';
import { Filter as FilterPrimitive } from '@wix/headless-components/react';

interface EventListProps {
  eventListServiceConfig: EventListServiceConfig;
  eventsPagePath: string;
}

export function EventList({
  eventListServiceConfig,
  eventsPagePath,
}: EventListProps) {
  return (
    <EventListPrimitive.Root eventListServiceConfig={eventListServiceConfig}>
      <EventListPrimitive.FiltersRoot allCategoriesLabel="All">
        <FilterPrimitive.FilterOptions className="border-b border-gray-500 mb-6">
          <FilterPrimitive.FilterOptionRepeater>
            <FilterPrimitive.FilterOption.SingleFilter className="flex gap-2 font-light text-content-primary [&_button]:border-b-4 [&_button]:border-transparent [&_button[data-state=on]]:border-black [&_button]:-mb-px [&_button[data-state=on]]:relative" />
          </FilterPrimitive.FilterOptionRepeater>
        </FilterPrimitive.FilterOptions>
      </EventListPrimitive.FiltersRoot>
      <EventListPrimitive.Events
        className="grid justify-center grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
        emptyState={
          <div className="text-center text-white py-12">
            <p className="text-xl">No events available</p>
            <p className="text-sm mt-2">
              Check back later for upcoming events!
            </p>
          </div>
        }
      >
        <EventListPrimitive.EventRepeater className="bg-surface-card flex flex-col">
          <div className="relative w-full pt-[100%] bg-accent-medium">
            <EventPrimitive.Image
              width={600}
              height={600}
              className="absolute top-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-8 flex flex-col flex-grow text-center">
            <EventPrimitive.Title className="text-2xl font-semibold text-content-primary mb-1 line-clamp-2" />
            <div className="font-light text-sm text-content-secondary mb-8">
              <EventPrimitive.Date format="short" />
              <span className="mx-1">|</span>
              <EventPrimitive.Location format="short" />
            </div>
            <EventPrimitive.RsvpButton
              asChild
              className="btn-primary self-center font-light py-2 px-10 mt-auto"
            >
              {({ eventSlug }) => (
                <a href={`${eventsPagePath}/${eventSlug}`}>RSVP</a>
              )}
            </EventPrimitive.RsvpButton>
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
