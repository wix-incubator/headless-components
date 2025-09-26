import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';
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

export interface FiltersRootProps {
  /** Render prop function */
  children: (props: FiltersRootRenderProps) => React.ReactNode;
  /** Default option label */
  defaultOptionLabel: string;
}

export interface FiltersRootRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  filterValue: FilterPrimitive.Filter;
  /** Function to load events by stage */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

export function FiltersRoot(props: FiltersRootProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const tags = scheduleListService.tags.get();
  const stageNames = scheduleListService.stageNames.get();
  const currentTagFilters = scheduleListService.tagFilters.get();
  const currentStageFilter = scheduleListService.stageFilter.get();
  const setTagFilters = scheduleListService.setTagFilters;
  const setStageFilter = scheduleListService.setStageFilter;

  const onChange = async (value: FilterPrimitive.Filter) => {
    const stageValue =
      value?.['stage'] && value?.['stage'] !== props.defaultOptionLabel
        ? value?.['stage']
        : null;

    setStageFilter(stageValue);
    setTagFilters(value?.['tag']?.$in || []);
  };

  const { filterOptions, filterValue } = buildTagFilterProps(
    tags,
    currentTagFilters,
    currentStageFilter,
    stageNames,
    props.defaultOptionLabel,
  );

  return props.children({
    filterOptions,
    filterValue,
    onChange,
  });
}

const buildTagFilterProps = (
  tags: string[],
  currentTagFilters: string[],
  currentStageFilter: string | null,
  stageNames: string[],
  defaultOptionLabel: string,
) => {
  const TAG_FILTER_BASE = {
    key: 'tag',
    label: '',
    type: 'multi' as const,
    displayType: 'text' as const,
  };

  const STAGE_FILTER_BASE = {
    key: 'stage',
    label: 'Filter by: ',
    type: 'single' as const,
    displayType: 'text' as const,
  };

  const filterOptions = [
    {
      ...STAGE_FILTER_BASE,
      fieldName: 'stage',
      validValues: [defaultOptionLabel, ...stageNames],
    },
    {
      ...TAG_FILTER_BASE,
      fieldName: 'tag',
      validValues: tags,
    },
  ];

  const filterValue = {
    tag: currentTagFilters,
    stage: currentStageFilter || defaultOptionLabel,
  };

  return {
    filterOptions,
    filterValue,
  };
};
