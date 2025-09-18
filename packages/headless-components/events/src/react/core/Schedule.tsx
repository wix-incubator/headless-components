import React from 'react';
import { type ScheduleItem } from '../../services/schedule-list-service.js';

const ScheduleContext = React.createContext<ScheduleItem | null>(null);

function useScheduleContext(): ScheduleItem {
  const context = React.useContext(ScheduleContext);
  if (!context) {
    throw new Error(
      'useScheduleContext must be used within a Schedule.Root component',
    );
  }
  return context;
}

export interface RootProps {
  /** Child components that will have access to the schedule item */
  children: React.ReactNode;
  /** Schedule item data */
  item: ScheduleItem;
}

/**
 * Schedule Root core component that provides schedule item context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <ScheduleContext.Provider value={props.item}>
      {props.children}
    </ScheduleContext.Provider>
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
  const item = useScheduleContext();
  const name = item.name!;

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
  /** Duration in minutes */
  durationMinutes: number;
  /** Formatted duration string (e.g., "30 minutes") */
  duration: string;
}

/**
 * Schedule TimeSlot core component that provides schedule item time information.
 *
 * @component
 */
export function TimeSlot(props: TimeSlotProps): React.ReactNode {
  const item = useScheduleContext();
  const startTime = new Date(item.timeSlot!.start!);
  const endTime = new Date(item.timeSlot!.end!);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const timeRange =
    startTime && endTime
      ? `${formatTime(startTime)} - ${formatTime(endTime)}`
      : startTime
        ? formatTime(startTime)
        : '';

  const durationMinutes =
    startTime && endTime
      ? Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
      : 0;

  const duration = durationMinutes > 0 ? `${durationMinutes} minutes` : '';

  return props.children({
    startTime,
    endTime,
    timeRange,
    durationMinutes,
    duration,
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
  const item = useScheduleContext();
  const description = item.description || '';

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
  const item = useScheduleContext();
  const stageName = item.stageName || '';

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
  const item = useScheduleContext();
  const tags = item.tags || [];
  const hasTags = tags.length > 0;

  return props.children({ tags, hasTags });
}
