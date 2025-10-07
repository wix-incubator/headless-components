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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useNavigation } from '@/components/NavigationContext';
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
  const Navigation = useNavigation();

  return (
    <Event event={eventServiceConfig.event}>
      <ScheduleList scheduleListServiceConfig={scheduleListServiceConfig}>
        <div className="max-w-5xl mx-auto px-5 py-6 sm:p-16">
          <div className="flex justify-between">
            <div className="flex flex-col mb-10">
              <EventTitle variant="sm" />
              <EventDate format="full" />
              <EventLocation format="full" />
            </div>
            <EventRsvpButton
              asChild
              variant="outline"
              className="hidden sm:block"
            >
              {({ slug, ticketed }) => (
                <Navigation route={eventDetailsPagePath.replace(':slug', slug)}>
                  {ticketed ? 'Get Tickets' : 'RSVP'}
                </Navigation>
              )}
            </EventRsvpButton>
          </div>
          <ScheduleListFilters allStagesLabel="All stages">
            <FilterOptions>
              <FilterOptionRepeater className="flex justify-between items-center mb-10">
                <FilterOptionSingle asChild>
                  {({ validValues, value, valueFormatter, onChange }) => (
                    <div className="flex gap-2 items-center">
                      <span className="flex-shrink-0">Filter by:</span>
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
          </ScheduleListGroups>
          <EventRsvpButton
            asChild
            variant="outline"
            className="w-full mt-4 sm:hidden"
          >
            {({ slug, ticketed }) => (
              <Navigation route={eventDetailsPagePath.replace(':slug', slug)}>
                {ticketed ? 'Get Tickets' : 'RSVP'}
              </Navigation>
            )}
          </EventRsvpButton>
        </div>
      </ScheduleList>
    </Event>
  );
}
