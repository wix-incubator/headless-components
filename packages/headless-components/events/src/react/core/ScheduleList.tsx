import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  EventService,
  type EventServiceConfig,
  EventServiceDefinition,
} from '../../services/event-service.js';
import {
  ScheduleListService,
  type ScheduleListServiceConfig,
  ScheduleListServiceDefinition,
} from '../../services/schedule-list-service.js';
import { type ScheduleItem } from '../../services/schedule-item-service.js';
import { type ScheduleItemsGroup } from '../../services/schedule-items-group-service.js';

export interface RootProps {
  /** Child components that will have access to the schedule list service */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
  /** Configuration for the event service */
  eventServiceConfig: EventServiceConfig;
}

/**
 * ScheduleList Root core component that provides schedule list service data.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, scheduleListServiceConfig, eventServiceConfig } = props;

  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(
          ScheduleListServiceDefinition,
          ScheduleListService,
          scheduleListServiceConfig,
        )
        .addService(EventServiceDefinition, EventService, eventServiceConfig)}
    >
      {children}
    </WixServices>
  );
}

export interface ItemsProps {
  /** Render prop function */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

export interface ItemsRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
}

/**
 * ScheduleList Items core component that provides schedule list data.
 *
 * @component
 */
export function Items(props: ItemsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const items = scheduleListService.items.get();

  if (!items.length) {
    return null;
  }

  return props.children({ items });
}

export interface ItemRepeaterProps {
  /** Render prop function */
  children: (props: ItemRepeaterRenderProps) => React.ReactNode;
}

export interface ItemRepeaterRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
}

/**
 * ScheduleList ItemRepeater core component that provides schedule item list data. Not rendered if there are no items.
 *
 * @component
 */
export function ItemRepeater(props: ItemRepeaterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const items = scheduleListService.items.get();

  if (!items.length) {
    return null;
  }

  return props.children({ items });
}

export interface GroupsProps {
  /** Render prop function */
  children: (props: GroupsRenderProps) => React.ReactNode;
}

export interface GroupsRenderProps {
  /** List of grouped schedule items */
  itemsGroups: ScheduleItemsGroup[];
  /** Indicates whether schedule items are currently being loaded */
  isLoading: boolean;
}

/**
 * ScheduleList Groups core component that provides grouped schedule items data.
 *
 * @component
 */
export function Groups(props: GroupsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const itemsGroups = scheduleListService.itemsGroups.get();
  const isLoading = scheduleListService.isLoading.get();

  return props.children({ itemsGroups, isLoading });
}

export interface GroupRepeaterProps {
  /** Render prop function */
  children: (props: GroupRepeaterRenderProps) => React.ReactNode;
}

export interface GroupRepeaterRenderProps {
  /** List of grouped schedule items */
  itemsGroups: ScheduleItemsGroup[];
}

/**
 * ScheduleList GroupRepeater core component that provides grouped schedule items data.
 * Not rendered if there are no groups.
 *
 * @component
 */
export function GroupRepeater(props: GroupRepeaterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const itemsGroups = scheduleListService.itemsGroups.get();

  if (!itemsGroups.length) {
    return null;
  }

  return props.children({ itemsGroups });
}

export interface StageFilterProps {
  /** Render prop function */
  children: (props: StageFilterRenderProps) => React.ReactNode;
}

export interface StageFilterRenderProps {
  /** Available stage names */
  stageNames: string[];
  /** Current stage filter value */
  currentStageFilter: string | null;
  /** Function to set stage filter */
  setStageFilter: (stageName: string | null) => void;
  /** Function to clear stage filter */
  clearStageFilter: () => void;
}

/**
 * ScheduleList StageFilter core component that provides stage filtering data.
 *
 * @component
 */
export function StageFilter(props: StageFilterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const stageNames = scheduleListService.stageNames.get();
  const currentStageFilter = scheduleListService.stageFilter.get();

  const setStageFilter = (stageName: string | null) => {
    scheduleListService.loadItems({ stageName });
  };

  const clearStageFilter = () => {
    scheduleListService.loadItems({ stageName: null });
  };

  if (!stageNames.length) {
    return null;
  }

  return props.children({
    stageNames,
    currentStageFilter,
    setStageFilter,
    clearStageFilter,
  });
}

export interface TagFiltersProps {
  /** Render prop function */
  children: (props: TagFiltersRenderProps) => React.ReactNode;
}

export interface TagFiltersRenderProps {
  /** Available tags */
  tags: string[];
  /** Current tag filters */
  currentTagFilters: string[];
}

/**
 * ScheduleList TagFilters core component that provides tag filtering data.
 *
 * @component
 */
export function TagFilters(props: TagFiltersProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const tags = scheduleListService.tags.get();
  const currentTagFilters = scheduleListService.tagFilters.get();

  if (!tags.length) {
    return null;
  }

  return props.children({ tags, currentTagFilters });
}

export interface TagFilterRepeaterProps {
  /** Render prop function */
  children: (props: TagFilterRepeaterRenderProps) => React.ReactNode;
}

export interface TagFilterRepeaterRenderProps {
  /** Available tags */
  tags: string[];
  /** Current tag filters */
  currentTagFilters: string[];
}

/**
 * ScheduleList TagFilterRepeater core component that provides tag filtering data.
 * Not rendered if there are no tags.
 *
 * @component
 */
export function TagFilterRepeater(
  props: TagFilterRepeaterProps,
): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const tags = scheduleListService.tags.get();
  const currentTagFilters = scheduleListService.tagFilters.get();

  if (!tags.length) {
    return null;
  }

  return props.children({ tags, currentTagFilters });
}

export interface LoadMoreTriggerProps {
  /** Render prop function */
  children: (props: LoadMoreTriggerRenderProps) => React.ReactNode;
}

export interface LoadMoreTriggerRenderProps {
  /** Indicates whether more schedule items are being loaded */
  isLoading: boolean;
  /** Indicates whether there are more schedule items to load */
  hasMoreItems: boolean;
  /** Function to load more schedule items */
  loadMoreItems: () => void;
}

/**
 * ScheduleList LoadMoreTrigger core component that provides load more trigger data.
 *
 * @component
 */
export function LoadMoreTrigger(props: LoadMoreTriggerProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const isLoading = scheduleListService.isLoadingMore.get();
  const hasMoreItems = scheduleListService.hasMoreItems.get();

  return props.children({
    isLoading,
    hasMoreItems,
    loadMoreItems: scheduleListService.loadMoreItems,
  });
}
