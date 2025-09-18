import {
  ScheduleList as ScheduleListPrimitive,
  ScheduleListFilters as ScheduleListFiltersPrimitive,
  Schedule as SchedulePrimitive,
  Event as EventPrimitive,
  Tag as TagPrimitive,
} from '@wix/headless-events/react';
import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';

interface ScheduleProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

export function Schedule({
  eventServiceConfig,
  scheduleListServiceConfig,
}: ScheduleProps) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="max-w-5xl mx-auto p-15">
        <h1 className="text-6xl font-bold text-content-primary mb-4">
          Schedule
        </h1>
        <EventPrimitive.Root event={eventServiceConfig.event}>
          <div className="flex flex-col mb-10">
            <EventPrimitive.Title className="font-light text-content-primary" />
            <EventPrimitive.Date
              format="full"
              className="font-light text-content-primary"
            />
            <EventPrimitive.Location
              format="full"
              className="font-light text-content-primary"
            />
          </div>
        </EventPrimitive.Root>
        <ScheduleListPrimitive.Root
          scheduleListServiceConfig={scheduleListServiceConfig}
        >
          <ScheduleListFiltersPrimitive.Filters className="flex mb-6 justify-between">
            <ScheduleListFiltersPrimitive.StageFilter
              labelClassName="font-light text-content-primary"
              dropdownClassName="font-light text-content-primary"
            />
            <ScheduleListFiltersPrimitive.TagFilters className="flex gap-2">
              <ScheduleListFiltersPrimitive.TagFilterItems className="flex gap-2 flex-wrap">
                <ScheduleListFiltersPrimitive.TagFilterRepeater>
                  <TagPrimitive.Label className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-light text-content-primary leading-5 cursor-pointer transition-colors hover:bg-gray-50 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500" />
                </ScheduleListFiltersPrimitive.TagFilterRepeater>
              </ScheduleListFiltersPrimitive.TagFilterItems>
            </ScheduleListFiltersPrimitive.TagFilters>
          </ScheduleListFiltersPrimitive.Filters>
          <ScheduleListPrimitive.Groups className="space-y-8 mb-6">
            <ScheduleListPrimitive.GroupRepeater>
              <ScheduleListPrimitive.Group className="space-y-4">
                <ScheduleListPrimitive.GroupDateLabel className="text-2xl font-bold text-content-primary mb-4" />
                <ScheduleListPrimitive.Items className="space-y-4">
                  <ScheduleListPrimitive.ItemRepeater className="group border border-gray-200 p-8">
                    <div className="flex gap-8">
                      <SchedulePrimitive.TimeSlot className="font-light text-content-primary min-w-[150px]">
                        {({ timeRange, duration }) => (
                          <>
                            <span className="font-medium">{timeRange}</span>
                            {duration && (
                              <span className="text-content-secondary">
                                {duration}
                              </span>
                            )}
                          </>
                        )}
                      </SchedulePrimitive.TimeSlot>
                      <div className="flex flex-col">
                        <SchedulePrimitive.Name className="font-light text-content-primary" />
                        <SchedulePrimitive.Stage className="font-light text-content-primary text-sm flex items-center gap-1 mb-3" />
                        <SchedulePrimitive.Tags className="flex gap-2 flex-wrap">
                          <SchedulePrimitive.TagRepeater>
                            <TagPrimitive.Label className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-light text-content-primary leading-5" />
                          </SchedulePrimitive.TagRepeater>
                        </SchedulePrimitive.Tags>
                      </div>
                    </div>
                  </ScheduleListPrimitive.ItemRepeater>
                </ScheduleListPrimitive.Items>
              </ScheduleListPrimitive.Group>
            </ScheduleListPrimitive.GroupRepeater>
          </ScheduleListPrimitive.Groups>
        </ScheduleListPrimitive.Root>
      </div>
    </div>
  );
}
