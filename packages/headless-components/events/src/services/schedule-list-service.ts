import { schedule } from '@wix/events';
import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';

export type ScheduleItem = schedule.ScheduleItem;

export interface ScheduleItemGroup {
  /** Date label for the group (e.g., "Mon, 07 Jul") */
  dateLabel: string;
  /** Date object for the group */
  date: Date;
  /** Schedule items for this date */
  items: ScheduleItem[];
}
enum StateFilter {
  PUBLISHED = schedule.StateFilter.PUBLISHED,
  VISIBLE = schedule.StateFilter.VISIBLE,
}

export interface ScheduleListServiceAPI {
  /** Reactive signal containing the list of schedule items */
  items: Signal<ScheduleItem[]>;
  /** Reactive signal containing grouped schedule items by date */
  groupedItems: ReadOnlySignal<ScheduleItemGroup[]>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
}

export interface ScheduleListServiceConfig {
  /** Event ID to load schedule items for */
  eventId: string;
  /** Maximum number of items to load */
  limit: number;
  items: ScheduleItem[];
}

export const ScheduleListServiceDefinition = defineService<
  ScheduleListServiceAPI,
  ScheduleListServiceConfig
>('scheduleList');

export const ScheduleListService =
  implementService.withConfig<ScheduleListServiceConfig>()(
    ScheduleListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const items = signalsService.signal<ScheduleItem[]>(config.items);
      const error = signalsService.signal<string | null>(null);

      // Create grouped items signal that reactively updates when items change
      const groupedItems = signalsService.computed(() => {
        const currentItems = items.get();
        return groupScheduleItemsByDate(currentItems);
      });

      return {
        items,
        groupedItems,
        error,
      };
    },
  );

export async function loadScheduleListServiceConfig(
  eventId: string,
  limit: number = 2,
): Promise<ScheduleListServiceConfig> {
  const queryScheduleResult = await queryScheduleItems(eventId, limit);

  return {
    eventId,
    limit,
    items: queryScheduleResult.items ?? [],
  };
}

const queryScheduleItems = async (eventId: string, limit: number) => {
  const queryScheduleResult = await schedule.listScheduleItems({
    eventId: [eventId],
    state: [StateFilter.PUBLISHED, StateFilter.VISIBLE],
    limit,
  });

  return queryScheduleResult;
};

export function groupScheduleItemsByDate(
  items: ScheduleItem[],
): ScheduleItemGroup[] {
  const grouped = new Map<string, ScheduleItemGroup>();

  items.forEach((item) => {
    if (!item.timeSlot?.start) {
      return; // Skip items without start time
    }

    const startDate = new Date(item.timeSlot.start);
    const dateKey = startDate.toDateString(); // Use date string as key for grouping

    // Format date label as shown in screenshot: "Mon, 07 Jul"
    const dateLabel = startDate.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, {
        dateLabel,
        date: startDate,
        items: [],
      });
    }

    grouped.get(dateKey)!.items.push(item);
  });

  // Convert map to array and sort by date
  const groupsArray = Array.from(grouped.values());
  return groupsArray.sort((a, b) => a.date.getTime() - b.date.getTime());
}
