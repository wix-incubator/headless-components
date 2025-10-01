import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/events/services';
import {
  Event,
  EventTitle,
  EventDate,
  EventLocation,
  EventRsvpButton,
  FilterOptions,
  FilterOptionRepeater,
  FilterOptionSingle,
  FilterOptionMulti,
  ScheduleItemName,
  ScheduleItemTimeSlot,
  ScheduleItemDuration,
  ScheduleItemStage,
  ScheduleItemTags,
  ScheduleItemTagRepeater,
  ScheduleList,
  ScheduleListFilters,
  ScheduleListGroups,
  ScheduleListGroupRepeater,
  ScheduleItemsGroupDateLabel,
  ScheduleItemsGroupItems,
  ScheduleItemsGroupItemRepeater,
  ScheduleItemTagLabel,
} from '@/components/ui/events';

interface ScheduleProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventDetailsPagePath: string;
}

export function Schedule({
  eventServiceConfig,
  scheduleListServiceConfig,
  eventDetailsPagePath,
}: ScheduleProps) {
  return (
    <Event event={eventServiceConfig.event}>
      <ScheduleList scheduleListServiceConfig={scheduleListServiceConfig}>
        <div className="max-w-5xl mx-auto px-5 py-6 sm:p-16">
          <h1 className="text-6xl font-heading font-bold text-foreground mb-3">
            Schedule
          </h1>
          <div className="flex justify-between">
            <div className="flex flex-col mb-10">
              <EventTitle variant="sm" />
              <EventDate format="full" />
              <EventLocation format="full" />
            </div>
            <EventRsvpButton
              asChild
              size="sm"
              variant="outline"
              className="hidden sm:block h-fit"
            >
              {({ slug, ticketed }) => (
                <a href={eventDetailsPagePath.replace(':slug', slug)}>
                  {ticketed ? 'Get Tickets' : 'RSVP'}
                </a>
              )}
            </EventRsvpButton>
          </div>
          <ScheduleListFilters allStagesLabel="All stages">
            <FilterOptions>
              <FilterOptionRepeater className="flex flex-row justify-between mb-10 items-center">
                <FilterOptionSingle asChild>
                  {({ value, onChange, validValues, valueFormatter }) => (
                    <div>
                      <span>Filter by:</span>
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
                <FilterOptionMulti className="flex gap-2" />
              </FilterOptionRepeater>
            </FilterOptions>
          </ScheduleListFilters>
          <ScheduleListGroups
            className="space-y-10"
            emptyState={
              <div className="font-paragraph text-foreground">
                No schedule items available
              </div>
            }
          >
            <ScheduleListGroupRepeater>
              <ScheduleItemsGroupDateLabel asChild>
                <h2 />
              </ScheduleItemsGroupDateLabel>
              <ScheduleItemsGroupItems>
                <ScheduleItemsGroupItemRepeater className="border border-foreground/10 p-5 sm:py-8 sm:px-6 mt-4 sm:mt-6">
                  <div className="flex gap-2 sm:gap-6 flex-col sm:flex-row">
                    <div className="min-w-[150px]">
                      <ScheduleItemTimeSlot />
                      <ScheduleItemDuration asChild>
                        {({ durationMinutes }) => (
                          <span>{durationMinutes} minutes</span>
                        )}
                      </ScheduleItemDuration>
                    </div>
                    <div>
                      <ScheduleItemName />
                      <ScheduleItemStage
                        asChild
                        className="flex gap-1 items-center"
                      >
                        {({ stageName }) => (
                          <div>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                className="text-foreground"
                                d="M12 3C15.86 3 19 6.14 19 9.999L18.992 10.499C18.855 13.26 16.864 16.637 13.072 20.544C12.786 20.838 12.405 21 12 21L11.8494 20.9925C11.5012 20.9574 11.1783 20.8012 10.928 20.544C7.136 16.637 5.146 13.26 5.008 10.499H5.002L5.001 10.333C5.001 10.286 5 10.241 5 10.194L5.001 10.139L5 9.999C5 6.14 8.14 3 12 3ZM12 4C8.813 4 6.199 6.497 6.011 9.637L6 10.194C6 11.945 6.98 15.041 11.646 19.847C11.742 19.946 11.867 20 12 20C12.133 20 12.259 19.946 12.355 19.847C17.021 15.04 18 11.945 18 10.194L17.989 9.637C17.801 6.497 15.187 4 12 4ZM11.4184 7.0558C12.4064 6.8698 13.4184 7.1758 14.1214 7.8788C14.8244 8.5828 15.1324 9.5928 14.9444 10.5828C14.7194 11.7698 13.7704 12.7188 12.5824 12.9448C12.3914 12.9808 12.1994 12.9988 12.0084 12.9988C11.2134 12.9988 10.4464 12.6888 9.8794 12.1218C9.1754 11.4188 8.8674 10.4088 9.0554 9.4178C9.2804 8.2288 10.2304 7.2798 11.4184 7.0558ZM12.0024 8.0008C11.8704 8.0008 11.7374 8.0128 11.6044 8.0388C10.8284 8.1848 10.1844 8.8288 10.0374 9.6038C9.9104 10.2788 10.1094 10.9388 10.5864 11.4148C11.0614 11.8898 11.7204 12.0888 12.3964 11.9618C13.1714 11.8148 13.8154 11.1708 13.9624 10.3968C14.0904 9.7218 13.8904 9.0628 13.4144 8.5858C13.0324 8.2048 12.5324 8.0008 12.0024 8.0008Z"
                              />
                            </svg>
                            <span>{stageName}</span>
                          </div>
                        )}
                      </ScheduleItemStage>
                      <ScheduleItemTags className="flex gap-2 flex-wrap mt-3">
                        <ScheduleItemTagRepeater>
                          <ScheduleItemTagLabel />
                        </ScheduleItemTagRepeater>
                      </ScheduleItemTags>
                    </div>
                  </div>
                </ScheduleItemsGroupItemRepeater>
              </ScheduleItemsGroupItems>
            </ScheduleListGroupRepeater>
            <EventRsvpButton
              asChild
              size="sm"
              variant="outline"
              className="block sm:hidden"
            >
              {({ slug, ticketed }) => (
                <a href={eventDetailsPagePath.replace(':slug', slug)}>
                  {ticketed ? 'Get Tickets' : 'RSVP'}
                </a>
              )}
            </EventRsvpButton>
          </ScheduleListGroups>
        </div>
      </ScheduleList>
    </Event>
  );
}
