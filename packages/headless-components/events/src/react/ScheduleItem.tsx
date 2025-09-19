import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import * as CoreScheduleItem from './core/ScheduleItem.js';
import * as Tag from './ScheduleItemTag.js';
import { type ScheduleItem } from '../services/schedule-item-service.js';

enum TestIds {
  scheduleRoot = 'schedule-root',
  scheduleName = 'schedule-name',
  scheduleTimeSlot = 'schedule-time-slot',
  scheduleDuration = 'schedule-duration',
  scheduleDescription = 'schedule-description',
  scheduleStage = 'schedule-stage',
  scheduleTags = 'schedule-tags',
  scheduleTagItems = 'schedule-tag-items',
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
 * Root container that provides schedule item service data to all child components.
 * Must be used as the top-level Schedule component.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleItem } from '@wix/events/components';
 *
 * function ScheduleItemPage({ item }) {
 *   return (
 *     <ScheduleItem.Root item={item}>
 *       <ScheduleItem.Name />
 *       <ScheduleItem.TimeSlot />
 *       <ScheduleItem.Duration />
 *       <ScheduleItem.Description />
 *       <ScheduleItem.Stage />
 *     </ScheduleItem.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, children, item, className, ...otherProps } = props;

  return (
    <CoreScheduleItem.Root item={item}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.scheduleRoot}
        {...otherProps}
      >
        {children}
      </AsChildSlot>
    </CoreScheduleItem.Root>
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
 * <ScheduleItem.Name className="font-bold text-lg" />
 *
 * // asChild with primitive
 * <ScheduleItem.Name asChild className="font-bold text-lg">
 *   <h2 />
 * </ScheduleItem.Name>
 *
 * // asChild with react component
 * <ScheduleItem.Name asChild className="font-bold text-lg">
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h2 ref={ref} {...props}>
 *       {name}
 *     </h2>
 *   ))}
 * </ScheduleItem.Name>
 * ```
 */
export const Name = React.forwardRef<HTMLElement, NameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItem.Name>
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
    </CoreScheduleItem.Name>
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
    formattedTimeRange: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item time slot information.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItem.TimeSlot className="text-gray-600 font-medium" />
 *
 * // asChild with primitive
 * <ScheduleItem.TimeSlot asChild className="text-gray-600">
 *   <div />
 * </ScheduleItem.TimeSlot>
 *
 * // asChild with react component
 * <ScheduleItem.TimeSlot asChild className="text-gray-600">
 *   {React.forwardRef(({ formattedTimeRange, startTime, ...props }, ref) => (
 *     <time ref={ref} {...props} dateTime={startTime?.toISOString()}>
 *       {formattedTimeRange}
 *     </time>
 *   ))}
 * </ScheduleItem.TimeSlot>
 * ```
 */
export const TimeSlot = React.forwardRef<HTMLElement, TimeSlotProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleItem.TimeSlot>
        {({ startTime, endTime, formattedTimeRange }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleTimeSlot}
            customElement={children}
            customElementProps={{
              startTime,
              endTime,
              formattedTimeRange,
            }}
            content={formattedTimeRange}
            {...otherProps}
          >
            <span>{formattedTimeRange}</span>
          </AsChildSlot>
        )}
      </CoreScheduleItem.TimeSlot>
    );
  },
);

/**
 * Props for the Schedule Duration component.
 */
export interface DurationProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    durationMinutes: number;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item duration information.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItem.Duration className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <ScheduleItem.Duration asChild className="text-sm text-gray-500">
 *   <div />
 * </ScheduleItem.Duration>
 *
 * // asChild with react component
 * <ScheduleItem.Duration asChild className="text-sm text-gray-500">
 *   {React.forwardRef(({ durationMinutes, ...props }, ref) => (
 *     <span ref={ref} {...props} title={`${durationMinutes} minutes`}>
 *       {durationMinutes > 0 ? `${durationMinutes} minutes` : ''}
 *     </span>
 *   ))}
 * </ScheduleItem.Duration>
 * ```
 */
export const Duration = React.forwardRef<HTMLElement, DurationProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleItem.Duration>
        {({ durationMinutes }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleDuration}
            customElement={children}
            customElementProps={{
              durationMinutes,
            }}
            content={durationMinutes}
            {...otherProps}
          >
            <span>{durationMinutes}</span>
          </AsChildSlot>
        )}
      </CoreScheduleItem.Duration>
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
 * <ScheduleItem.Description className="text-gray-800 mt-2" />
 *
 * // asChild with primitive
 * <ScheduleItem.Description asChild className="text-gray-800 mt-2">
 *   <p />
 * </ScheduleItem.Description>
 *
 * // asChild with react component
 * <ScheduleItem.Description asChild className="text-gray-800 mt-2">
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <p ref={ref} {...props}>
 *       {description}
 *     </p>
 *   ))}
 * </ScheduleItem.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreScheduleItem.Description>
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
      </CoreScheduleItem.Description>
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
 * <ScheduleItem.Stage className="text-blue-600 font-medium" />
 *
 * // asChild with primitive
 * <ScheduleItem.Stage asChild className="text-blue-600 font-medium">
 *   <span />
 * </ScheduleItem.Stage>
 *
 * // asChild with react component
 * <ScheduleItem.Stage asChild className="text-blue-600 font-medium">
 *   {React.forwardRef(({ stageName, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {stageName}
 *     </span>
 *   ))}
 * </ScheduleItem.Stage>
 * ```
 */
export const Stage = React.forwardRef<HTMLElement, StageProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItem.Stage>
      {({ stageName }) => (
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
      )}
    </CoreScheduleItem.Stage>
  );
});

/**
 * Props for the Schedule Tags component.
 */
export interface TagsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children: React.ReactNode | AsChildChildren<{ tags: string[] }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule item tags with conditional rendering.
 * Follows Container Level pattern - provides context and conditional rendering.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItem.Tags>
 *     <ScheduleItem.TagRepeater>
 *       <ScheduleItemTag.Label />
 *     </ScheduleItem.TagRepeater>
 * </ScheduleItem.Tags>
 * ```
 */
export const Tags = React.forwardRef<HTMLElement, TagsProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleItem.Tags>
      {({ tags }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.scheduleTags}
          customElement={children}
          customElementProps={{ tags }}
          {...otherProps}
        >
          <div>{children as React.ReactNode}</div>
        </AsChildSlot>
      )}
    </CoreScheduleItem.Tags>
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
 * <ScheduleItem.TagRepeater>
 *   <ScheduleItemTag.Label />
 * </ScheduleItem.TagRepeater>
 * ```
 */
export const TagRepeater = (props: TagRepeaterProps): React.ReactNode => {
  const { children } = props;

  return (
    <CoreScheduleItem.Tags>
      {({ tags }) =>
        tags.map((tagValue, index) => (
          <Tag.Root key={index} tag={tagValue}>
            {children}
          </Tag.Root>
        ))
      }
    </CoreScheduleItem.Tags>
  );
};
