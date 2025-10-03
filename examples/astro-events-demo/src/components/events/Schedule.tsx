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
  ScheduleList,
  ScheduleListFilters,
  ScheduleListGroups,
  ScheduleListGroupRepeater,
  ScheduleItemsGroupDateLabel,
  ScheduleItemsGroupItems,
  ScheduleItemsGroupItemRepeater,
} from '@/components/ui/events';
import { ScheduleItem } from './ScheduleItem';

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
          <h1 className="text-6xl font-heading text-foreground mb-3">
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
                <ScheduleItemsGroupItemRepeater className="group/schedule-item border border-foreground/10 p-5 sm:py-8 sm:px-6 mt-4 sm:mt-6">
                  <ScheduleItem descriptionVisible />
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
