import { schedule } from '@wix/events';
import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { type ScheduleItem } from './schedule-item-service.js';
import { type ScheduleItemsGroup } from './schedule-items-group-service.js';
import { formatShortDate } from '../utils/date.js';

enum StateFilter {
  PUBLISHED = schedule.StateFilter.PUBLISHED,
  VISIBLE = schedule.StateFilter.VISIBLE,
}

export interface ScheduleListServiceAPI {
  items: ReadOnlySignal<ScheduleItem[]>;
  itemsGroups: ReadOnlySignal<ScheduleItemsGroup[]>;
  error: Signal<string | null>;
  stageFilter: Signal<string | null>;
  tagFilters: Signal<string[]>;
  stageNames: ReadOnlySignal<string[]>;
  tags: ReadOnlySignal<string[]>;
  setStageFilter: (stageName: string | null) => void;
  setTagFilters: (tags: string[]) => void;
}

export interface ScheduleListServiceConfig {
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

      const itemsGroups = signalsService.computed(() => {
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

        return getAvailableStageNames(currentItems);
      });

      const tags = signalsService.computed(() => {
        const currentItems = items.get();

        return getAvailableTags(currentItems);
      });

      const setStageFilter = (stageName: string | null) => {
        stageFilter.set(stageName);
      };

      const setTagFilters = (tags: string[]) => {
        tagFilters.set(tags);
      };

      return {
        items,
        itemsGroups,
        error,
        stageFilter,
        tagFilters,
        stageNames,
        tags,
        setStageFilter,
        setTagFilters,
      };
    },
  );

export async function loadScheduleListServiceConfig(
  eventId: string,
  limit?: number,
): Promise<ScheduleListServiceConfig> {
  const loadAll = !limit;
  const pageSize = limit ?? 100;

  const response = await listScheduleItems(eventId, pageSize);
  const totalItems = response.pagingMetadata!.total!;
  const itemsCount = response.items!.length;
  const responses = [response];

  if (itemsCount < totalItems && loadAll) {
    const requestCount = Math.ceil(totalItems / pageSize) - 1;
    const moreResponses = await Promise.all(
      new Array(requestCount)
        .fill(null)
        .map((_, index) =>
          listScheduleItems(eventId, pageSize, (index + 1) * pageSize),
        ),
    );

    responses.push(...moreResponses);
  }

  const allItems = responses.flatMap((response) => response.items || []);

  return { items: allItems };
}

function listScheduleItems(eventId: string, limit: number, offset = 0) {
  return schedule.listScheduleItems({
    eventId: [eventId],
    state: [StateFilter.PUBLISHED, StateFilter.VISIBLE],
    paging: {
      limit,
      offset,
    },
  });
}

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

function groupScheduleItemsByDate(items: ScheduleItem[]): ScheduleItemsGroup[] {
  const grouped = new Map<string, ScheduleItemsGroup>();

  items.forEach((item) => {
    const startDate = new Date(item.timeSlot!.start!);
    const dateKey = startDate.toDateString();
    const formattedDate = formatShortDate(startDate);

    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, {
        id: Math.random().toString(36).substring(2, 11),
        formattedDate,
        date: startDate,
        items: [],
      });
    }

    grouped.get(dateKey)!.items.push(item);
  });

  const groupsArray = Array.from(grouped.values());

  return groupsArray.sort((a, b) => a.date.getTime() - b.date.getTime());
}

function getAvailableStageNames(items: ScheduleItem[]): string[] {
  const stageNames = new Set<string>();

  items.forEach((item) => {
    if (item.stageName) {
      stageNames.add(item.stageName);
    }
  });

  return Array.from(stageNames).sort();
}

function getAvailableTags(items: ScheduleItem[]): string[] {
  const tags = new Set<string>();

  items.forEach((item) => {
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}
