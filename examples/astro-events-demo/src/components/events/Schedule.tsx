import {
  ScheduleList as ScheduleListPrimitive,
  ScheduleItemsGroup as ScheduleItemsGroupPrimitive,
  ScheduleItem as ScheduleItemPrimitive,
  Event as EventPrimitive,
  ScheduleItemTag as ScheduleItemTagPrimitive,
} from '@wix/headless-events/react';
import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';

interface ScheduleProps {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventsPagePath: string;
}

export function Schedule({
  eventServiceConfig,
  scheduleListServiceConfig,
  eventsPagePath,
}: ScheduleProps) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="max-w-5xl mx-auto p-15">
        <h1 className="text-6xl font-bold text-content-primary mb-4">
          Schedule
        </h1>
        <EventPrimitive.Root event={eventServiceConfig.event}>
          <div className="flex justify-between">
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
            <div>
              <a
                href={`${eventsPagePath}/${eventServiceConfig.event.slug}`}
                className="border border-gray-300 font-light text-content-primary py-2 px-4 hover:underline"
              >
                Get tickets
              </a>
            </div>
          </div>
        </EventPrimitive.Root>
        <ScheduleListPrimitive.Root
          scheduleListServiceConfig={scheduleListServiceConfig}
          eventServiceConfig={eventServiceConfig}
        >
          <div className="flex mb-6 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-light text-content-primary">
                Filter by:
              </span>
              <ScheduleListPrimitive.StageFilter
                className="font-light text-content-primary"
                defaultOptionLabel="All stages"
              />
            </div>
            <ScheduleListPrimitive.TagFilters className="flex gap-2 flex-wrap">
              <ScheduleListPrimitive.TagFilterRepeater>
                <ScheduleItemTagPrimitive.Button className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-light text-content-primary leading-5 cursor-pointer transition-colors hover:bg-gray-50 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500" />
              </ScheduleListPrimitive.TagFilterRepeater>
            </ScheduleListPrimitive.TagFilters>
          </div>
          <ScheduleListPrimitive.Groups
            className="space-y-8 mb-6"
            emptyState={<div>No schedule items available</div>}
          >
            <ScheduleListPrimitive.GroupRepeater>
              <ScheduleItemsGroupPrimitive.DateLabel
                className="text-2xl font-bold text-content-primary"
                asChild
              >
                <h2 />
              </ScheduleItemsGroupPrimitive.DateLabel>
              <ScheduleItemsGroupPrimitive.Items className="mt-4 space-y-4">
                <ScheduleItemsGroupPrimitive.ItemRepeater className="group border border-gray-200 p-8">
                  <div className="flex gap-8">
                    <div className="min-w-[150px] flex flex-col">
                      <ScheduleItemPrimitive.TimeSlot className="font-light text-content-primary" />
                      <ScheduleItemPrimitive.Duration
                        asChild
                        className="text-content-secondary text-sm"
                      >
                        {({ durationMinutes }) => (
                          <span>{`${durationMinutes} minutes`}</span>
                        )}
                      </ScheduleItemPrimitive.Duration>
                    </div>
                    <div className="flex flex-col">
                      <ScheduleItemPrimitive.Name className="font-light text-content-primary" />
                      <ScheduleItemPrimitive.Stage
                        asChild
                        className="font-light text-content-primary text-sm"
                      >
                        {({ stageName }) => (
                          <div className="flex gap-1 font-light text-content-primary mb-3">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M12 3C15.86 3 19 6.14 19 9.999L18.992 10.499C18.855 13.26 16.864 16.637 13.072 20.544C12.786 20.838 12.405 21 12 21L11.8494 20.9925C11.5012 20.9574 11.1783 20.8012 10.928 20.544C7.136 16.637 5.146 13.26 5.008 10.499H5.002L5.001 10.333C5.001 10.286 5 10.241 5 10.194L5.001 10.139L5 9.999C5 6.14 8.14 3 12 3ZM12 4C8.813 4 6.199 6.497 6.011 9.637L6 10.194C6 11.945 6.98 15.041 11.646 19.847C11.742 19.946 11.867 20 12 20C12.133 20 12.259 19.946 12.355 19.847C17.021 15.04 18 11.945 18 10.194L17.989 9.637C17.801 6.497 15.187 4 12 4ZM11.4184 7.0558C12.4064 6.8698 13.4184 7.1758 14.1214 7.8788C14.8244 8.5828 15.1324 9.5928 14.9444 10.5828C14.7194 11.7698 13.7704 12.7188 12.5824 12.9448C12.3914 12.9808 12.1994 12.9988 12.0084 12.9988C11.2134 12.9988 10.4464 12.6888 9.8794 12.1218C9.1754 11.4188 8.8674 10.4088 9.0554 9.4178C9.2804 8.2288 10.2304 7.2798 11.4184 7.0558ZM12.0024 8.0008C11.8704 8.0008 11.7374 8.0128 11.6044 8.0388C10.8284 8.1848 10.1844 8.8288 10.0374 9.6038C9.9104 10.2788 10.1094 10.9388 10.5864 11.4148C11.0614 11.8898 11.7204 12.0888 12.3964 11.9618C13.1714 11.8148 13.8154 11.1708 13.9624 10.3968C14.0904 9.7218 13.8904 9.0628 13.4144 8.5858C13.0324 8.2048 12.5324 8.0008 12.0024 8.0008Z"
                              />
                            </svg>
                            <span>{stageName}</span>
                          </div>
                        )}
                      </ScheduleItemPrimitive.Stage>
                      <ScheduleItemPrimitive.Tags className="flex gap-2 flex-wrap">
                        <ScheduleItemPrimitive.TagRepeater>
                          <ScheduleItemTagPrimitive.Label className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-full text-sm font-light text-content-primary leading-5" />
                        </ScheduleItemPrimitive.TagRepeater>
                      </ScheduleItemPrimitive.Tags>
                    </div>
                  </div>
                </ScheduleItemsGroupPrimitive.ItemRepeater>
              </ScheduleItemsGroupPrimitive.Items>
            </ScheduleListPrimitive.GroupRepeater>
          </ScheduleListPrimitive.Groups>
          <ScheduleListPrimitive.LoadMoreTrigger
            className="btn-primary block font-light py-2 px-4 mt-8 mx-auto"
            label="Load More"
          />
        </ScheduleListPrimitive.Root>
      </div>
    </div>
  );
}
