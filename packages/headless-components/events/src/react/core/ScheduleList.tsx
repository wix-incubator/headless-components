import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';
import {
  ScheduleListService,
  ScheduleListServiceDefinition,
  type ScheduleListServiceConfig,
} from '../../services/schedule-list-service.js';
import { type ScheduleItem } from '../../services/schedule-item-service.js';
import { type ScheduleItemsGroup } from '../../services/schedule-items-group-service.js';
import { STAGES_FILTER_KEY, TAGS_FILTER_KEY } from '../../constants.js';

export interface RootProps {
  /** Child components that will have access to the schedule list service */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

/**
 * ScheduleList Root core component that provides schedule list service data.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, scheduleListServiceConfig } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleListServiceDefinition,
        ScheduleListService,
        scheduleListServiceConfig,
      )}
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
}

/**
 * ScheduleList Groups core component that provides grouped schedule items data.
 *
 * @component
 */
export function Groups(props: GroupsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);

  const itemsGroups = scheduleListService.itemsGroups.get();

  return props.children({ itemsGroups });
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

export interface FiltersProps {
  /** Render prop function */
  children: (props: FiltersRenderProps) => React.ReactNode;
  /** All stages label */
  allStagesLabel: string;
}

export interface FiltersRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  value: FilterPrimitive.Filter;
  /** Function to handle filter change */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

/**
 * ScheduleList Filters core component that provides schedule list filter data.
 *
 * @component
 */
export function Filters(props: FiltersProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);

  const tags = scheduleListService.tags.get();
  const stageNames = scheduleListService.stageNames.get();
  const currentTagFilters = scheduleListService.tagFilters.get();
  const currentStageFilter = scheduleListService.stageFilter.get();

  const onChange = async (value: FilterPrimitive.Filter) => {
    const stageFilter =
      value!['stage'] !== props.allStagesLabel ? value!['stage'] : null;
    const tagFilters = value!['tag']?.$in || [];

    scheduleListService.setStageFilter(stageFilter);
    scheduleListService.setTagFilters(tagFilters);
  };

  const { filterOptions, value } = buildFilterProps(
    tags,
    currentTagFilters,
    currentStageFilter,
    stageNames,
    props.allStagesLabel,
  );

  if (!stageNames.length && !tags.length) {
    return null;
  }

  return props.children({
    filterOptions,
    value,
    onChange,
  });
}

const buildFilterProps = (
  tags: string[],
  currentTagFilters: string[],
  currentStageFilter: string | null,
  stageNames: string[],
  allStagesLabel: string,
) => {
  const FILTER_BASE = {
    label: '',
    displayType: 'text' as const,
  };

  const filterOptions = [
    {
      ...FILTER_BASE,
      key: STAGES_FILTER_KEY,
      type: 'single' as const,
      fieldName: 'stage',
      validValues: [allStagesLabel, ...stageNames],
    },
    {
      ...FILTER_BASE,
      key: TAGS_FILTER_KEY,
      type: 'multi' as const,
      fieldName: 'tag',
      validValues: tags,
    },
  ];

  const value = {
    tag: currentTagFilters,
    stage: currentStageFilter || allStagesLabel,
  };

  return {
    filterOptions,
    value,
  };
};
