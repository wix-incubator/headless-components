import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  type ScheduleItem,
  ScheduleItemServiceDefinition,
  ScheduleItemService,
  type ScheduleItemServiceConfig,
} from '../../services/index.js';

export interface RootProps {
  /** Child components that will have access to the schedule item service */
  children: React.ReactNode;
  /** Schedule item data */
  item: ScheduleItem;
}

/**
 * Schedule Root core component that provides schedule item service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { item, children } = props;

  const scheduleItemServiceConfig: ScheduleItemServiceConfig = {
    item,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleItemServiceDefinition,
        ScheduleItemService,
        scheduleItemServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface NameProps {
  /** Render prop function */
  children: (props: NameRenderProps) => React.ReactNode;
}

export interface NameRenderProps {
  /** Schedule item name */
  name: string;
}

/**
 * Schedule Name core component that provides schedule item name.
 *
 * @component
 */
export function Name(props: NameProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const name = scheduleService.name.get();

  return props.children({ name });
}

export interface TimeSlotProps {
  /** Render prop function */
  children: (props: TimeSlotRenderProps) => React.ReactNode;
}

export interface TimeSlotRenderProps {
  /** Schedule item start time */
  startTime: Date | null;
  /** Schedule item end time */
  endTime: Date | null;
  /** Formatted time range string (e.g., "18:30 - 19:00") */
  timeRange: string;
}

/**
 * Schedule TimeSlot core component that provides schedule item time information.
 *
 * @component
 */
export function TimeSlot(props: TimeSlotProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const startTime = scheduleService.startTime.get();
  const endTime = scheduleService.endTime.get();
  const timeRange = scheduleService.timeRange.get();

  return props.children({
    startTime,
    endTime,
    timeRange,
  });
}

export interface DurationProps {
  /** Render prop function */
  children: (props: DurationRenderProps) => React.ReactNode;
}

export interface DurationRenderProps {
  /** Duration in minutes */
  durationMinutes: number;
}

/**
 * Schedule Duration core component that provides schedule item duration information.
 *
 * @component
 */
export function Duration(props: DurationProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const durationMinutes = scheduleService.durationMinutes.get();

  return props.children({
    durationMinutes,
  });
}

export interface DescriptionProps {
  /** Render prop function */
  children: (props: DescriptionRenderProps) => React.ReactNode;
}

export interface DescriptionRenderProps {
  /** Schedule item description */
  description: string;
}

/**
 * Schedule Description core component that provides schedule item description.
 *
 * @component
 */
export function Description(props: DescriptionProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const description = scheduleService.description.get();

  if (!description) {
    return null;
  }

  return props.children({ description });
}

export interface StageProps {
  /** Render prop function */
  children: (props: StageRenderProps) => React.ReactNode;
}

export interface StageRenderProps {
  /** Schedule item stage name */
  stageName: string;
}

/**
 * Schedule Stage core component that provides schedule item stage information.
 *
 * @component
 */
export function Stage(props: StageProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const stageName = scheduleService.stageName.get();

  if (!stageName) {
    return null;
  }

  return props.children({ stageName });
}

export interface TagsProps {
  /** Render prop function */
  children: (props: TagsRenderProps) => React.ReactNode;
}

export interface TagsRenderProps {
  /** Schedule item tags */
  tags: string[];
  /** Whether the item has tags */
  hasTags: boolean;
}

/**
 * Schedule Tags core component that provides schedule item tags.
 *
 * @component
 */
export function Tags(props: TagsProps): React.ReactNode {
  const scheduleService = useService(ScheduleItemServiceDefinition);
  const tags = scheduleService.tags.get();
  const hasTags = scheduleService.hasTags.get();

  if (!hasTags) {
    return null;
  }

  return props.children({ tags, hasTags });
}

export interface TagLabelProps {
  children: (props: TagLabelRenderProps) => React.ReactNode;
}

export interface TagLabelRenderProps {
  /** Schedule item tag */
  tag: string;
}
