import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ScheduleListService,
  ScheduleListServiceConfig,
  ScheduleListServiceDefinition,
} from '../../services/schedule-list-service.js';
import {
  type ScheduleItem,
  type ScheduleItemGroup,
} from '../../services/schedule-list-service.js';
import React from 'react';

export interface RootProps {
  /** Child components that will have access to the schedule list service */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

/**
 * ScheduleList Root core component that provides schedule list service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleListServiceDefinition,
        ScheduleListService,
        props.scheduleListServiceConfig,
      )}
    >
      {props.children}
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
  /** Indicates whether there are any schedule items in the list */
  hasItems: boolean;
}

/**
 * ScheduleList Items core component that provides schedule list data.
 * Context-aware: provides group items when inside a Group, otherwise provides all items.
 *
 * @component
 */
export function Items(props: ItemsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const allItems = scheduleListService.items.get();

  // Check if we're inside a group context
  const groupContext = React.useContext(GroupContext);
  const items = groupContext ? groupContext.items : allItems;
  const hasItems = !!items.length;

  if (!hasItems) {
    return null;
  }

  return (
    <ItemsContext.Provider value={items}>
      {props.children({ items, hasItems })}
    </ItemsContext.Provider>
  );
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
 * ScheduleList ItemRepeater core component that provides schedule item list. Not rendered if there are no items.
 * Uses items from Items context (which are context-aware).
 *
 * @component
 */
export function ItemRepeater(props: ItemRepeaterProps): React.ReactNode {
  const items = useItemsContext();
  const hasItems = !!items.length;

  if (!hasItems) {
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
  groups: ScheduleItemGroup[];
}

/**
 * ScheduleList Groups core component that provides grouped schedule items context.
 * Container Level component following List, Options, and Repeater Pattern.
 *
 * @component
 */
export function Groups(props: GroupsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const groups = scheduleListService.groupedItems.get();
  const hasGroups = !!groups.length;

  if (!hasGroups) {
    return null;
  }

  return props.children({ groups });
}

export interface GroupRepeaterProps {
  /** Render prop function */
  children: (props: GroupRepeaterRenderProps) => React.ReactNode;
}

export interface GroupRepeaterRenderProps {
  /** List of grouped schedule items */
  groups: ScheduleItemGroup[];
}

/**
 * ScheduleList GroupRepeater core component that provides grouped schedule items data.
 * Repeater Level component following List, Options, and Repeater Pattern.
 * Not rendered if there are no groups.
 *
 * @component
 */
export function GroupRepeater(props: GroupRepeaterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const groups = scheduleListService.groupedItems.get();
  const hasGroups = !!groups.length;

  if (!hasGroups) {
    return null;
  }

  return props.children({ groups });
}

// Context for individual group
const GroupContext = React.createContext<ScheduleItemGroup | null>(null);

function useGroupContext(): ScheduleItemGroup {
  const context = React.useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within a Group component');
  }
  return context;
}

// Context for current items (either all items or group items)
const ItemsContext = React.createContext<ScheduleItem[] | null>(null);

function useItemsContext(): ScheduleItem[] {
  const context = React.useContext(ItemsContext);
  if (!context) {
    throw new Error('useItemsContext must be used within an Items component');
  }
  return context;
}
export interface GroupProps {
  /** Group data */
  group: ScheduleItemGroup;
  /** Child components that will have access to the group context */
  children: React.ReactNode;
}

/**
 * ScheduleList Group core component that provides individual group context.
 *
 * @component
 */
export function Group(props: GroupProps): React.ReactNode {
  const { group, children } = props;

  return (
    <GroupContext.Provider value={group}>{children}</GroupContext.Provider>
  );
}

export interface GroupDateLabelProps {
  /** Render prop function */
  children: (props: GroupDateLabelRenderProps) => React.ReactNode;
}

export interface GroupDateLabelRenderProps {
  /** Formatted date label (e.g., "Mon, 07 Jul") */
  dateLabel: string;
  /** Date object for the group */
  date: Date;
}

/**
 * ScheduleList GroupDateLabel core component that provides group date label information.
 *
 * @component
 */
export function GroupDateLabel(props: GroupDateLabelProps): React.ReactNode {
  const group = useGroupContext();

  return props.children({
    dateLabel: group.dateLabel,
    date: group.date,
  });
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
  /** Whether there are available stages */
  hasStages: boolean;
  /** Function to set stage filter */
  setStageFilter: (stageName: string | null) => void;
  /** Function to clear stage filter */
  clearStageFilter: () => void;
}

/**
 * ScheduleList StageFilter core component that provides stage filtering functionality.
 *
 * @component
 */
export function StageFilter(props: StageFilterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const stageNames = scheduleListService.stageNames.get();
  const currentStageFilter = scheduleListService.stageFilter.get();

  const hasStages = stageNames.length > 0;

  const setStageFilter = (stageName: string | null) => {
    scheduleListService.setStageFilter(stageName);
  };

  const clearStageFilter = () => {
    scheduleListService.setStageFilter(null);
  };

  return props.children({
    stageNames,
    currentStageFilter,
    hasStages,
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
  /** Whether there are available tags */
  hasTags: boolean;
  /** Whether any tag filters are active */
  hasActiveTagFilters: boolean;
}

/**
 * ScheduleList TagFilters core component that provides tag filtering context.
 * Container Level component following List, Options, and Repeater Pattern.
 *
 * @component
 */
export function TagFilters(props: TagFiltersProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const tags = scheduleListService.tags.get();
  const currentTagFilters = scheduleListService.tagFilters.get();

  const hasTags = tags.length > 0;
  const hasActiveTagFilters = currentTagFilters.length > 0;

  if (!hasTags) {
    return null;
  }

  return props.children({
    tags,
    currentTagFilters,
    hasTags,
    hasActiveTagFilters,
  });
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
  /** Whether there are available tags */
  hasTags: boolean;
  /** Function to toggle a tag filter */
  toggleTagFilter: (tag: string) => void;
}

/**
 * ScheduleList TagFilterRepeater core component that provides tag filtering data.
 * Repeater Level component following List, Options, and Repeater Pattern.
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

  const hasTags = tags.length > 0;

  if (!hasTags) {
    return null;
  }

  const toggleTagFilter = (tag: string) => {
    const active = currentTagFilters.includes(tag);
    if (active) {
      scheduleListService.removeTagFilter(tag);
    } else {
      scheduleListService.addTagFilter(tag);
    }
  };

  return props.children({
    tags,
    currentTagFilters,
    hasTags,
    toggleTagFilter,
  });
}
