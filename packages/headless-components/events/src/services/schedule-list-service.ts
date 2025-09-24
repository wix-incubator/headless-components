import { schedule } from '@wix/events';
import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { type ScheduleItem } from './schedule-item-service.js';
import { type ScheduleItemsGroup } from './schedule-items-group-service.js';
import { formatDate } from '../utils/date.js';
import { EventServiceDefinition } from './event-service.js';
import { getErrorMessage } from '../utils/errors.js';

enum StateFilter {
  PUBLISHED = schedule.StateFilter.PUBLISHED,
  VISIBLE = schedule.StateFilter.VISIBLE,
}

export interface ScheduleListServiceAPI {
  items: ReadOnlySignal<ScheduleItem[]>;
  itemsGroups: ReadOnlySignal<ScheduleItemsGroup[]>;
  totalItems: Signal<number>;
  hasMoreItems: ReadOnlySignal<boolean>;
  isLoading: Signal<boolean>;
  isLoadingMore: Signal<boolean>;
  error: Signal<string | null>;
  stageFilter: Signal<string | null>;
  tagFilters: Signal<string[]>;
  stageNames: ReadOnlySignal<string[]>;
  tags: ReadOnlySignal<string[]>;
  loadItems: (options: {
    stageName: string | null;
    tags?: string[];
  }) => Promise<void>;
  loadMoreItems: () => Promise<void>;
  setStageFilter: (stageName: string | null) => void;
  setTagFilters: (tags: string[]) => void;
  addTagFilter: (tagValue: string) => void;
  removeTagFilter: (tagValue: string) => void;
}

export interface ScheduleListServiceConfig {
  limit: number;
  items: ScheduleItem[];
  totalItems: number;
}

export const ScheduleListServiceDefinition = defineService<
  ScheduleListServiceAPI,
  ScheduleListServiceConfig
>('scheduleList');

export const ScheduleListService =
  implementService.withConfig<ScheduleListServiceConfig>()(
    ScheduleListServiceDefinition,
    ({ getService, config }) => {
      const eventService = getService(EventServiceDefinition);
      const signalsService = getService(SignalsServiceDefinition);

      const eventId = eventService.event.get()._id!;

      const items = signalsService.signal<ScheduleItem[]>(config.items);
      const error = signalsService.signal<string | null>(null);
      const stageFilter = signalsService.signal<string | null>(null);
      const tagFilters = signalsService.signal<string[]>([]);
      const isLoading = signalsService.signal<boolean>(false);
      const isLoadingMore = signalsService.signal<boolean>(false);
      const totalItems = signalsService.signal<number>(config.totalItems);
      const hasMoreItems = signalsService.computed<boolean>(
        () => items.get().length < totalItems.get(),
      );

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

      const loadMoreItems = async () => {
        isLoadingMore.set(true);
        error.set(null);

        const stageName = stageFilter.get() ? [stageFilter.get()!] : undefined;
        const tag = tagFilters.get().length > 0 ? tagFilters.get() : undefined;

        try {
          const offset =
            items.get().length < totalItems.get() ? items.get().length : 0;

          const listScheduleResult = await listScheduleItems({
            eventId,
            limit: config.limit,
            offset,
            stageName,
            tag,
          });

          items.set([...items.get(), ...(listScheduleResult.items ?? [])]);
          totalItems.set(listScheduleResult.pagingMetadata?.total ?? 0);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoadingMore.set(false);
        }
      };

      const loadItems = async ({
        stageName,
        tags,
      }: {
        stageName: string | null;
        tags?: string[];
      }) => {
        isLoading.set(true);
        error.set(null);

        stageFilter.set(stageName);
        tagFilters.set(tags || []);

        try {
          const listScheduleResult = await listScheduleItems({
            eventId,
            limit: config.limit,
            stageName: stageName ? [stageName!] : undefined,
            tag: tags ? tags : undefined,
          });

          items.set(listScheduleResult.items ?? []);
          totalItems.set(listScheduleResult.pagingMetadata?.total ?? 0);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoading.set(false);
        }
      };

      return {
        items,
        itemsGroups,
        error,
        totalItems,
        hasMoreItems,
        isLoading,
        isLoadingMore,
        stageFilter,
        tagFilters,
        stageNames,
        tags,
        setStageFilter,
        setTagFilters,
        addTagFilter,
        removeTagFilter,
        loadItems,
        loadMoreItems,
      };
    },
  );

export async function loadScheduleListServiceConfig(
  eventId: string,
  limit: number = 2,
): Promise<ScheduleListServiceConfig> {
  const listScheduleResult = await listScheduleItems({ eventId, limit });

  return {
    limit,
    items: listScheduleResult.items ?? [],
    totalItems: listScheduleResult.pagingMetadata?.total || 0,
  };
}

const listScheduleItems = async ({
  eventId,
  limit,
  offset = 0,
  stageName,
  tag,
}: {
  eventId: string;
  limit: number;
  offset?: number;
  stageName?: string[];
  tag?: string[];
}) => {
  const listScheduleResult = await schedule.listScheduleItems({
    eventId: [eventId],
    state: [StateFilter.PUBLISHED, StateFilter.VISIBLE],
    stageName,
    tag,
    paging: {
      limit,
      offset,
    },
  });

  return listScheduleResult;
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

function groupScheduleItemsByDate(items: ScheduleItem[]): ScheduleItemsGroup[] {
  const grouped = new Map<string, ScheduleItemsGroup>();

  items.forEach((item) => {
    const startDate = new Date(item.timeSlot!.start!);
    const dateKey = startDate.toDateString();
    const formattedDate = formatDate(startDate);

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
