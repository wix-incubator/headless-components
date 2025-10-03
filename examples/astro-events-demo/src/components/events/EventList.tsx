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
  EventListCategoryFilter,
  FilterOptions,
  FilterOptionRepeater,
  FilterOptionSingle,
  ScrollableTabs,
  EventListStatusFilter,
} from '@/components/ui/events';
import { Separator } from '@/components/ui/separator';

interface EventListProps {
  eventListServiceConfig: EventListServiceConfig;
  eventDetailsPagePath: string;
}

export function EventList({
  eventListServiceConfig,
  eventDetailsPagePath,
}: EventListProps) {
  return (
    <EventListPrimitive eventListServiceConfig={eventListServiceConfig}>
      <div className="flex flex-row gap-6">
        <EventListCategoryFilter
          allCategoriesLabel="All"
          className="flex-1 border-b border-foreground/10 mb-6"
        >
          <FilterOptions>
            <FilterOptionRepeater>
              <ScrollableTabs className="w-[200px]">
                <FilterOptionSingle variant="tabs" />
              </ScrollableTabs>
            </FilterOptionRepeater>
          </FilterOptions>
        </EventListCategoryFilter>
        <EventListStatusFilter
          allStatusesLabel="Upcoming & Past"
          upcomingLabel="Upcoming"
          pastLabel="Past"
        >
          <FilterOptions>
            <FilterOptionRepeater>
              <FilterOptionSingle asChild>
                {({ value, onChange, validValues, valueFormatter }) => (
                  <div>
                    <span>Event Status:</span>
                    <select
                      value={value}
                      className="bg-background"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        onChange(e.target.value)
                      }
                      data-filter-type="single"
                    >
                      {validValues?.map(value => (
                        <option key={value} value={value}>
                          {valueFormatter ? valueFormatter(value) : value}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </FilterOptionSingle>
            </FilterOptionRepeater>
          </FilterOptions>
        </EventListStatusFilter>
      </div>
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
              {({ slug }) => (
                <a href={eventDetailsPagePath.replace(':slug', slug)}>RSVP</a>
              )}
            </EventRsvpButton>
          </div>
        </EventRepeater>
      </Events>
      <EventListLoadMoreTrigger asChild className="mx-auto mt-5">
        {({ isLoading }) => (
          <button>{isLoading ? 'Loading...' : 'Load More'}</button>
        )}
      </EventListLoadMoreTrigger>
      <EventListError className="mt-4" />
    </EventListPrimitive>
  );
}
