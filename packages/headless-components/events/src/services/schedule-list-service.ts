import { schedule } from '@wix/events';
import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';

export type ScheduleItem = schedule.ScheduleItem;

export interface ScheduleItemGroup {
  dateLabel: string;
  date: Date;
  items: ScheduleItem[];
}

enum StateFilter {
  PUBLISHED = schedule.StateFilter.PUBLISHED,
  VISIBLE = schedule.StateFilter.VISIBLE,
}

export interface ScheduleListServiceAPI {
  items: ReadOnlySignal<ScheduleItem[]>;
  groupedItems: ReadOnlySignal<ScheduleItemGroup[]>;
  error: Signal<string | null>;
  stageFilter: Signal<string | null>;
  tagFilters: Signal<string[]>;
  stageNames: ReadOnlySignal<string[]>;
  tags: ReadOnlySignal<string[]>;
  setStageFilter: (stageName: string | null) => void;
  addTagFilter: (tagValue: string) => void;
  removeTagFilter: (tagValue: string) => void;
}

export interface ScheduleListServiceConfig {
  eventId: string;
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
      const stageFilter = signalsService.signal<string | null>(null);
      const tagFilters = signalsService.signal<string[]>([]);

      const groupedItems = signalsService.computed(() => {
        const currentItems = items.get();
        const currentStageFilter = stageFilter.get();
        const currentTagFilters = tagFilters.get();

        const filteredItems = filterScheduleItems(
          currentItems,
          currentStageFilter,
          currentTagFilters,
        );
        return groupScheduleItemsByDate(filteredItems);
      });

      const stageNames = signalsService.computed(() => {
        const currentItems = items.get();
        return getAvailableStages(currentItems);
      });

      const tags = signalsService.computed(() => {
        const currentItems = items.get();
        return getAvailableTags(currentItems);
      });

      const setStageFilter = (stageName: string | null) => {
        stageFilter.set(stageName);
      };

      const addTagFilter = (tagValue: string) => {
        const currentFilters = tagFilters.get();
        if (!currentFilters.includes(tagValue)) {
          tagFilters.set([...currentFilters, tagValue]);
        }
      };

      const removeTagFilter = (tagValue: string) => {
        const currentFilters = tagFilters.get();
        tagFilters.set(currentFilters.filter((tag) => tag !== tagValue));
      };

      return {
        items,
        groupedItems,
        error,
        stageFilter,
        tagFilters,
        stageNames,
        tags,
        setStageFilter,
        addTagFilter,
        removeTagFilter,
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

function filterScheduleItems(
  items: ScheduleItem[],
  stageFilter: string | null,
  tagFilters: string[],
): ScheduleItem[] {
  return items.filter((item) => {
    if (stageFilter && item.stageName !== stageFilter) {
      return false;
    }

    if (tagFilters.length > 0) {
      const itemTags = item.tags || [];
      const hasAllTags = tagFilters.every((filterTag) =>
        itemTags.includes(filterTag),
      );

      if (!hasAllTags) {
        return false;
      }
    }

    return true;
  });
}

export function groupScheduleItemsByDate(
  items: ScheduleItem[],
): ScheduleItemGroup[] {
  const grouped = new Map<string, ScheduleItemGroup>();

  items.forEach((item) => {
    if (!item.timeSlot?.start) {
      return;
    }

    const startDate = new Date(item.timeSlot.start);
    const dateKey = startDate.toDateString();

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

  const groupsArray = Array.from(grouped.values());

  return groupsArray.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export function getAvailableStages(items: ScheduleItem[]): string[] {
  const stages = new Set<string>();
  items.forEach((item) => {
    if (item.stageName) {
      stages.add(item.stageName);
    }
  });

  return Array.from(stages).sort();
}

export function getAvailableTags(items: ScheduleItem[]): string[] {
  const tags = new Set<string>();
  items.forEach((item) => {
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}
