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
  EventListStatusFilter,
  FilterOptions,
  FilterOptionRepeater,
  FilterOptionSingle,
  ScrollableTabs,
} from '@/components/ui/events';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useNavigation } from '@/components/NavigationContext';
import { EventListSkeleton } from './EventListSkeleton';

interface EventListProps {
  eventListServiceConfig: EventListServiceConfig;
  eventDetailsPagePath: string;
  isFiltersVisible?: boolean;
}

export function EventList({
  eventListServiceConfig,
  eventDetailsPagePath,
  isFiltersVisible = true,
}: EventListProps) {
  const Navigation = useNavigation();

  return (
    <EventListPrimitive eventListServiceConfig={eventListServiceConfig}>
      {isFiltersVisible && (
        <div className="flex flex-row items-center gap-6 mb-6">
          <EventListCategoryFilter
            allCategoriesLabel="All"
            className="flex-1 border-b border-foreground/10"
          >
            <FilterOptions>
              <ScrollableTabs>
                <FilterOptionRepeater>
                  <FilterOptionSingle variant="tabs" />
                </FilterOptionRepeater>
              </ScrollableTabs>
            </FilterOptions>
          </EventListCategoryFilter>
          <EventListStatusFilter
            allEventsLabel="Upcoming & Past"
            upcomingEventsLabel="Upcoming"
            pastEventsLabel="Past"
          >
            <FilterOptions>
              <FilterOptionRepeater>
                <FilterOptionSingle asChild>
                  {({ value, onChange, validValues, valueFormatter }) => (
                    <div className="flex gap-2 items-center">
                      <span className="flex-shrink-0">Event status:</span>
                      <Select
                        data-filter-type="single"
                        value={value}
                        onValueChange={onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {validValues?.map(value => (
                            <SelectItem key={value} value={String(value)}>
                              {valueFormatter ? valueFormatter(value) : value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </FilterOptionSingle>
              </FilterOptionRepeater>
            </FilterOptions>
          </EventListStatusFilter>
        </div>
      )}
      <Events
        asChild
        emptyState={
          <div className="font-paragraph text-foreground text-base">
            No events available
          </div>
        }
      >
        {({ isLoading }) =>
          isLoading ? (
            <EventListSkeleton />
          ) : (
            <div className="grid justify-center grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
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
                  <EventRsvpButton asChild size="lg" className="mt-auto">
                    {({ slug }) => (
                      <Navigation
                        route={eventDetailsPagePath.replace(':slug', slug)}
                      >
                        RSVP
                      </Navigation>
                    )}
                  </EventRsvpButton>
                </div>
              </EventRepeater>
            </div>
          )
        }
      </Events>
      <EventListLoadMoreTrigger
        className="block mx-auto mt-5"
        label="Load More"
        loadingState="Loading..."
      />
      <EventListError className="mt-4" />
    </EventListPrimitive>
  );
}
