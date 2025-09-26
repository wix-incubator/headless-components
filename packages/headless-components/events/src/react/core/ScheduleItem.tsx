import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  type ScheduleItem,
  ScheduleItemServiceDefinition,
  ScheduleItemService,
  type ScheduleItemServiceConfig,
} from '../../services/schedule-item-service.js';
import { formatTimeRange, getDurationInMinutes } from '../../utils/date.js';

export interface RootProps {
  /** Child components that will have access to the schedule item service */
  children: React.ReactNode;
  /** Schedule item data */
  item: ScheduleItem;
}

/**
 * ScheduleItem Root core component that provides schedule item service context.
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
 * ScheduleItem Name core component that provides schedule item name.
 *
 * @component
 */
export function Name(props: NameProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const name = scheduleItem.name!;

  return props.children({ name });
}

export interface TimeSlotProps {
  /** Render prop function */
  children: (props: TimeSlotRenderProps) => React.ReactNode;
}

export interface TimeSlotRenderProps {
  /** Schedule item start time */
  startTime: Date;
  /** Schedule item end time */
  endTime: Date;
  /** Formatted time range string (e.g., "18:30 - 19:00") */
  formattedTimeRange: string;
}

/**
 * ScheduleItem TimeSlot core component that provides schedule item time information.
 *
 * @component
 */
export function TimeSlot(props: TimeSlotProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const startTime = new Date(scheduleItem.timeSlot!.start!);
  const endTime = new Date(scheduleItem.timeSlot!.end!);
  const formattedTimeRange = formatTimeRange(startTime, endTime);

  return props.children({ startTime, endTime, formattedTimeRange });
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
 * ScheduleItem Duration core component that provides schedule item duration information.
 *
 * @component
 */
export function Duration(props: DurationProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const startTime = new Date(scheduleItem.timeSlot!.start!);
  const endTime = new Date(scheduleItem.timeSlot!.end!);
  const durationMinutes = getDurationInMinutes(startTime, endTime);

  return props.children({ durationMinutes });
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
 * ScheduleItem Description core component that provides schedule item description.
 *
 * @component
 */
export function Description(props: DescriptionProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const description = scheduleItem.description;

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
 * ScheduleItem Stage core component that provides schedule item stage information.
 *
 * @component
 */
export function Stage(props: StageProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const stageName = scheduleItem.stageName;

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
}

/**
 * ScheduleItem Tags core component that provides schedule item tags.
 *
 * @component
 */
export function Tags(props: TagsProps): React.ReactNode {
  const scheduleItemService = useService(ScheduleItemServiceDefinition);
  const scheduleItem = scheduleItemService.item.get();
  const tags = scheduleItem.tags!;

  if (!tags.length) {
    return null;
  }

  return props.children({ tags });
}
