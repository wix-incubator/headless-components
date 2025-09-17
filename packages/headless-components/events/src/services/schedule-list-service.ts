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
  items: ReadOnlySignal<ScheduleItem[]>;
  /** Reactive signal containing grouped schedule items by date */
  groupedItems: ReadOnlySignal<ScheduleItemGroup[]>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Reactive signal for stage name filter */
  stageFilter: Signal<string | null>;
  /** Reactive signal for tag filters (array of tag values) */
  tagFilters: Signal<string[]>;
  /** Reactive signal containing available stages for filtering */
  stageNames: ReadOnlySignal<string[]>;
  /** Reactive signal containing available tags for filtering */
  tags: ReadOnlySignal<string[]>;
  /** Filter function that applies current filters to any items array */
  filterItems: (items: ScheduleItem[]) => ScheduleItem[];
  /** Method to set stage filter */
  setStageFilter: (stageName: string | null) => void;
  /** Method to set tag filters */
  setTagFilters: (tagValues: string[]) => void;
  /** Method to add a tag filter */
  addTagFilter: (tagValue: string) => void;
  /** Method to remove a tag filter */
  removeTagFilter: (tagValue: string) => void;
  /** Method to clear all filters */
  clearFilters: () => void;
}

export interface ScheduleListServiceConfig {
  /** Event ID to load schedule items for */
  eventId: string;
  /** Maximum number of items to load */
  limit: number;
  /** Schedule items */
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

      // Create grouped items signal that reactively updates when items or filters change
      const groupedItems = signalsService.computed(() => {
        const currentItems = items.get();
        const currentStageFilter = stageFilter.get();
        const currentTagFilters = tagFilters.get();

        // Apply filters first, then group by date
        const filteredItems = filterScheduleItems(
          currentItems,
          currentStageFilter,
          currentTagFilters,
        );
        return groupScheduleItemsByDate(filteredItems);
      });

      // Create computed signals for available filter options
      const stageNames = signalsService.computed(() => {
        const currentItems = items.get();
        return getAvailableStages(currentItems);
      });

      const tags = signalsService.computed(() => {
        const currentItems = items.get();
        return getAvailableTags(currentItems);
      });

      // Filter management methods
      const setStageFilter = (stageName: string | null) => {
        stageFilter.set(stageName);
      };

      const setTagFilters = (tagValues: string[]) => {
        tagFilters.set(tagValues);
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

      const clearFilters = () => {
        stageFilter.set(null);
        tagFilters.set([]);
      };

      // Filter function that uses current filter state
      const filterItems = (items: ScheduleItem[]): ScheduleItem[] => {
        const currentStageFilter = stageFilter.get();
        const currentTagFilters = tagFilters.get();
        return filterScheduleItems(
          items,
          currentStageFilter,
          currentTagFilters,
        );
      };

      return {
        items,
        groupedItems,
        error,
        stageFilter,
        tagFilters,
        stageNames,
        tags,
        filterItems,
        setStageFilter,
        setTagFilters,
        addTagFilter,
        removeTagFilter,
        clearFilters,
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

/**
 * Filters schedule items by stage name and tags
 */
function filterScheduleItems(
  items: ScheduleItem[],
  stageFilter: string | null,
  tagFilters: string[],
): ScheduleItem[] {
  return items.filter((item) => {
    // Filter by stage name if specified
    if (stageFilter && item.stageName !== stageFilter) {
      return false;
    }

    // Filter by tags if specified
    if (tagFilters.length > 0) {
      const itemTags = item.tags || [];
      // Check if item has all the required tags
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

/**
 * Extract unique stage names from schedule items
 */
export function getAvailableStages(items: ScheduleItem[]): string[] {
  const stages = new Set<string>();
  items.forEach((item) => {
    if (item.stageName) {
      stages.add(item.stageName);
    }
  });
  return Array.from(stages).sort();
}

/**
 * Extract unique tags from schedule items
 */
export function getAvailableTags(items: ScheduleItem[]): string[] {
  const tags = new Set<string>();
  items.forEach((item) => {
    if (item.tags) {
      item.tags.forEach((tag) => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}
