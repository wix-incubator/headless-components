import { useService } from '@wix/services-manager-react';
import { ScheduleListServiceDefinition } from '../../services/schedule-list-service.js';
import * as Tag from '../Tag.js';
import React from 'react';

export interface FiltersProps {
  /** Render prop function */
  children: (props: FiltersRenderProps) => React.ReactNode;
}

export interface FiltersRenderProps {
  /** Available stage names for filtering */
  stageNames: string[];
  /** Available tags for filtering */
  tags: string[];
  /** Current stage filter value */
  currentStageFilter: string | null;
  /** Current tag filters array */
  currentTagFilters: string[];
  /** Whether any filters are active */
  hasActiveFilters: boolean;
  /** Whether there are available stages to filter by */
  hasStages: boolean;
  /** Whether there are available tags to filter by */
  hasTags: boolean;
}

/**
 * ScheduleListFilters core component that provides filter state and available options.
 * Container Level component following List, Options, and Repeater Pattern.
 *
 * @component
 */
export function Filters(props: FiltersProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const stageNames = scheduleListService.stageNames.get();
  const tags = scheduleListService.tags.get();
  const currentStageFilter = scheduleListService.stageFilter.get();
  const currentTagFilters = scheduleListService.tagFilters.get();

  const hasActiveFilters = !!currentStageFilter || currentTagFilters.length > 0;
  const hasStages = stageNames.length > 0;
  const hasTags = tags.length > 0;

  return (
    <FiltersContext.Provider
      value={{
        stageNames,
        tags,
        currentStageFilter,
        currentTagFilters,
        hasActiveFilters,
        hasStages,
        hasTags,
      }}
    >
      {props.children({
        stageNames,
        tags,
        currentStageFilter,
        currentTagFilters,
        hasActiveFilters,
        hasStages,
        hasTags,
      })}
    </FiltersContext.Provider>
  );
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
 * ScheduleListFilters StageFilter core component that provides stage filtering functionality.
 *
 * @component
 */
export function StageFilter(props: StageFilterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const filtersContext = useFiltersContext();

  const setStageFilter = (stageName: string | null) => {
    scheduleListService.setStageFilter(stageName);
  };

  const clearStageFilter = () => {
    scheduleListService.setStageFilter(null);
  };

  return props.children({
    stageNames: filtersContext.stageNames,
    currentStageFilter: filtersContext.currentStageFilter,
    hasStages: filtersContext.hasStages,
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
 * ScheduleListFilters TagFilters core component that provides tag filtering context.
 * Container Level component following List, Options, and Repeater Pattern.
 *
 * @component
 */
export function TagFilters(props: TagFiltersProps): React.ReactNode {
  const filtersContext = useFiltersContext();
  const hasActiveTagFilters = filtersContext.currentTagFilters.length > 0;

  return (
    <TagFiltersContext.Provider
      value={{
        tags: filtersContext.tags,
        currentTagFilters: filtersContext.currentTagFilters,
        hasTags: filtersContext.hasTags,
        hasActiveTagFilters,
      }}
    >
      {props.children({
        tags: filtersContext.tags,
        currentTagFilters: filtersContext.currentTagFilters,
        hasTags: filtersContext.hasTags,
        hasActiveTagFilters,
      })}
    </TagFiltersContext.Provider>
  );
}

export interface TagFilterRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * ScheduleListFilters TagFilterRepeater core component that repeats over available tags.
 * Repeater Level component following List, Options, and Repeater Pattern.
 * Not rendered if there are no tags.
 *
 * @component
 */
export function TagFilterRepeater(
  props: TagFilterRepeaterProps,
): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const tagFiltersContext = useTagFiltersContext();

  if (!tagFiltersContext.hasTags) {
    return null;
  }

  return (
    <>
      {tagFiltersContext.tags.map((tag, index) => {
        const isActive = tagFiltersContext.currentTagFilters.includes(tag);

        const toggleTag = () => {
          if (isActive) {
            scheduleListService.removeTagFilter(tag);
          } else {
            scheduleListService.addTagFilter(tag);
          }
        };

        return (
          <Tag.Root key={tag} tag={{ value: tag, index }}>
            {React.cloneElement(props.children as React.ReactElement, {
              onClick: toggleTag,
              active: isActive,
            })}
          </Tag.Root>
        );
      })}
    </>
  );
}
// Context for filters
const FiltersContext = React.createContext<FiltersRenderProps | null>(null);

function useFiltersContext(): FiltersRenderProps {
  const context = React.useContext(FiltersContext);
  if (!context) {
    throw new Error(
      'useFiltersContext must be used within a Filters component',
    );
  }
  return context;
}

// Context for tag filters
const TagFiltersContext = React.createContext<TagFiltersRenderProps | null>(
  null,
);

function useTagFiltersContext(): TagFiltersRenderProps {
  const context = React.useContext(TagFiltersContext);
  if (!context) {
    throw new Error(
      'useTagFiltersContext must be used within a TagFilters component',
    );
  }
  return context;
}
