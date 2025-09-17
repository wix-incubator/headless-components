import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleItem } from '../services/schedule-list-service.js';
import * as CoreSchedule from './core/Schedule.js';
import * as Tag from './Tag.js';

enum TestIds {
  scheduleRoot = 'schedule-root',
  scheduleName = 'schedule-name',
  scheduleTimeSlot = 'schedule-time-slot',
  scheduleDescription = 'schedule-description',
  scheduleStage = 'schedule-stage',
  scheduleTags = 'schedule-tags',
  scheduleTag = 'schedule-tag',
}

export { ScheduleItem };

/**
 * Props for the Schedule Root component.
 */
export interface RootProps {
  /** Schedule item data */
  item: ScheduleItem;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components that will have access to the schedule item */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root container that provides schedule item context to all child components.
 * Must be used as the top-level Schedule component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Schedule } from '@wix/events/components';
 *
 * function ScheduleItemPage({ item }) {
 *   return (
 *     <Schedule.Root item={item}>
 *       <Schedule.Name />
 *       <Schedule.Time />
 *       <Schedule.Description />
 *       <Schedule.Stage />
 *     </Schedule.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, children, item, className, ...otherProps } = props;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      data-testid={TestIds.scheduleRoot}
      {...otherProps}
    >
      <div>
        <CoreSchedule.Root item={item}>{children}</CoreSchedule.Root>
      </div>
    </AsChildSlot>
  );
});

/**
 * Props for the Schedule Name component.
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ name: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item name.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Schedule.Name className="font-bold text-lg" />
 *
 * // asChild with primitive
 * <Schedule.Name asChild className="font-bold text-lg">
 *   <h2 />
 * </Schedule.Name>
 *
 * // asChild with react component
 * <Schedule.Name asChild className="font-bold text-lg">
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h2 ref={ref} {...props}>
 *       {name}
 *     </h2>
 *   ))}
 * </Schedule.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreSchedule.Name>
      {({ name }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleName}
          customElement={children}
          customElementProps={{ name }}
          content={name}
          {...otherProps}
        >
          <span>{name}</span>
        </AsChildSlot>
      )}
    </CoreSchedule.Name>
  );
});

/**
 * Props for the Schedule TimeSlot component.
 */
export interface TimeSlotProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    startTime: Date | null;
    endTime: Date | null;
    timeRange: string;
    durationMinutes: number;
    duration: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item time slot information with duration.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Schedule.TimeSlot className="text-gray-600" />
 *
 * // asChild with primitive
 * <Schedule.TimeSlot asChild className="text-gray-600">
 *   <div />
 * </Schedule.TimeSlot>
 *
 * // asChild with react component
 * <Schedule.TimeSlot asChild className="text-gray-600">
 *   {React.forwardRef(({ timeRange, duration, startTime, ...props }, ref) => (
 *     <div ref={ref} {...props}>
 *       <time dateTime={startTime?.toISOString()}>{timeRange}</time>
 *       <span className="text-sm text-gray-500">{duration}</span>
 *     </div>
 *   ))}
 * </Schedule.TimeSlot>
 * ```
 */
export const TimeSlot = React.forwardRef<HTMLElement, TimeSlotProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreSchedule.TimeSlot>
        {({ startTime, endTime, timeRange, durationMinutes, duration }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleTimeSlot}
            customElement={children}
            customElementProps={{
              startTime,
              endTime,
              timeRange,
              durationMinutes,
              duration,
            }}
            {...otherProps}
          >
            <div className={className}>
              <div className="font-medium">{timeRange}</div>
              {duration && (
                <div className="text-sm text-gray-500">{duration}</div>
              )}
            </div>
          </AsChildSlot>
        )}
      </CoreSchedule.TimeSlot>
    );
  },
);

/**
 * Props for the Schedule Description component.
 */
export interface DescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item description.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Schedule.Description className="text-gray-800 mt-2" />
 *
 * // asChild with primitive
 * <Schedule.Description asChild className="text-gray-800 mt-2">
 *   <p />
 * </Schedule.Description>
 *
 * // asChild with react component
 * <Schedule.Description asChild className="text-gray-800 mt-2">
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props}>
 *       {description}
 *     </p>
 *   ))}
 * </Schedule.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreSchedule.Description>
        {({ description }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleDescription}
            customElement={children}
            customElementProps={{ description }}
            content={description}
            {...otherProps}
          >
            <span>{description}</span>
          </AsChildSlot>
        )}
      </CoreSchedule.Description>
    );
  },
);

/**
 * Props for the Schedule Stage component.
 */
export interface StageProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ stageName: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item stage information.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Schedule.Stage className="text-blue-600 font-medium" />
 *
 * // asChild with primitive
 * <Schedule.Stage asChild className="text-blue-600 font-medium">
 *   <span />
 * </Schedule.Stage>
 *
 * // asChild with react component
 * <Schedule.Stage asChild className="text-blue-600 font-medium">
 *   {React.forwardRef(({ stageName, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {stageName}
 *     </span>
 *   ))}
 * </Schedule.Stage>
 * ```
 */
export const Stage = React.forwardRef<HTMLElement, StageProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreSchedule.Stage>
      {({ stageName }) => {
        if (!stageName) return null;

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleStage}
            customElement={children}
            customElementProps={{ stageName }}
            content={stageName}
            {...otherProps}
          >
            <span>{stageName}</span>
          </AsChildSlot>
        );
      }}
    </CoreSchedule.Stage>
  );
});

/**
 * Props for the Schedule Tags component.
 */
export interface TagsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{ tags: string[]; hasTags: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule item tags with empty state support.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <Schedule.Tags>
 *   <Schedule.TagRepeater>
 *     <Tag.Text />
 *   </Schedule.TagRepeater>
 * </Schedule.Tags>
 * ```
 */
export const Tags = React.forwardRef<HTMLElement, TagsProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreSchedule.Tags>
      {({ tags, hasTags }) => {
        if (!hasTags) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleTags}
            customElement={children}
            customElementProps={{ tags, hasTags }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        );
      }}
    </CoreSchedule.Tags>
  );
});

/**
 * Props for the Schedule TagRepeater component.
 */
export interface TagRepeaterProps {
  /** Child components */
  children: React.ReactNode;
}

/**
 * Repeater component that renders Tag.Root for each tag.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Schedule.TagRepeater>
 *   <Tag.Text />
 * </Schedule.TagRepeater>
 * ```
 */
export const TagRepeater = (props: TagRepeaterProps): React.ReactNode => {
  const { children } = props;

  return (
    <CoreSchedule.Tags>
      {({ tags, hasTags }) => {
        if (!hasTags) {
          return null;
        }

        return tags.map((tagValue, index) => (
          <Tag.Root key={index} tag={{ value: tagValue, index }}>
            {children}
          </Tag.Root>
        ));
      }}
    </CoreSchedule.Tags>
  );
};
