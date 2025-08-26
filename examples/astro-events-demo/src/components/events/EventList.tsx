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
        className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-6"
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Event Image */}
            <div className="relative overflow-hidden w-full pt-[100%] bg-blue-600">
              <EventPrimitive.Image
                width={560}
                height={560}
                className="absolute top-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Event Content */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Event Title */}
              <EventPrimitive.Title className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" />

              {/* Event Date */}
              <EventPrimitive.Date
                format="short"
                className="text-sm text-gray-600"
              />

              {/* Event Location */}
              <EventPrimitive.Location
                format="short"
                className="text-sm text-gray-600 mb-4"
              />

              {/* Event Description */}
              <EventPrimitive.ShortDescription className="text-sm text-gray-700 mb-4 line-clamp-3" />

              {/* RSVP Button */}
              <EventPrimitive.RsvpButton className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-auto">
                RSVP
              </EventPrimitive.RsvpButton>
            </div>
          </div>
        </EventListPrimitive.EventRepeater>
      </EventListPrimitive.Events>
      <div className="flex justify-center">
        <EventListPrimitive.LoadMoreTrigger className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 mb-12 rounded-md transition-colors duration-200">
          Load More
        </EventListPrimitive.LoadMoreTrigger>
      </div>
    </EventListPrimitive.Root>
  );
}
