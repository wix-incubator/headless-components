import { type EventListServiceConfig } from '@wix/events/services';
import {
  EventList as EventListPrimitive,
  Events,
  EventRepeater,
  EventListLoadMoreTrigger,
  EventListError,
  EventTitle,
  EventImage,
  EventLocation,
  EventDate,
  EventRsvpButton,
} from '@/components/ui/events';
import { Separator } from '@/components/ui/separator';

interface EventListProps {
  eventListServiceConfig: EventListServiceConfig;
  eventDetailsPagePath: string;
}

export const EventList = ({
  eventListServiceConfig,
  eventDetailsPagePath,
}: EventListProps) => {
  return (
    <EventListPrimitive eventListServiceConfig={eventListServiceConfig}>
      <Events className="grid justify-center grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        <EventRepeater className="flex flex-col bg-background border border-foreground/10">
          <div className="relative w-full pt-[100%] bg-primary/80">
            <EventImage className="absolute top-0 w-full h-full" />
          </div>
          <div className="p-5 sm:p-8 flex flex-col flex-grow sm:items-center sm:text-center">
            <EventTitle className="line-clamp-2" />
            <div className="mb-8 flex items-center gap-1">
              <EventDate className="line-clamp-1" />
              <Separator
                orientation="vertical"
                className="bg-foreground h-3 hidden sm:block"
              />
              <EventLocation className="hidden sm:line-clamp-1" />
            </div>
            <EventRsvpButton asChild className="mt-auto">
              {({ eventSlug }) => (
                <a href={eventDetailsPagePath.replace(':slug', eventSlug)}>
                  RSVP
                </a>
              )}
            </EventRsvpButton>
          </div>
        </EventRepeater>
      </Events>
      <EventListLoadMoreTrigger className="mx-auto" />
      <EventListError className="mt-4" />
    </EventListPrimitive>
  );
};
