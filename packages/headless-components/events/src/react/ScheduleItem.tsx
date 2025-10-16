import { type AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleItem } from '../services/schedule-item-service.js';
import * as ScheduleItemTag from './ScheduleItemTag.js';
import * as CoreScheduleItem from './core/ScheduleItem.js';

enum TestIds {
  scheduleItemRoot = 'schedule-item-root',
  scheduleItemName = 'schedule-item-name',
  scheduleItemTimeSlot = 'schedule-item-time-slot',
  scheduleItemDuration = 'schedule-item-duration',
  scheduleItemDescription = 'schedule-item-description',
  scheduleItemStage = 'schedule-item-stage',
  scheduleItemTags = 'schedule-item-tags',
}

/**
 * Props for the ScheduleItem Root component.
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
 * Root container that provides schedule item service context to all child components.
 * Must be used as the top-level ScheduleItem component.
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
        data-testid={TestIds.scheduleItemRoot}
        data-has-description={!!item.description}
        customElement={children}
        customElementProps={{}}
        {...otherProps}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreScheduleItem.Root>
  );
});

/**
 * Props for the ScheduleItem Name component.
 */
export interface NameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Schedule item name */
    name: string;
  }>;
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
 * <ScheduleItem.Name asChild>
 *   <h2 className="font-bold text-lg" />
 * </ScheduleItem.Name>
 *
 * // asChild with react component
 * <ScheduleItem.Name asChild>
 *   {React.forwardRef(({ name, ...props }, ref) => (
 *     <h2 ref={ref} className="font-bold text-lg" {...props}>
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
          data-testid={TestIds.scheduleItemName}
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
 * Props for the ScheduleItem TimeSlot component.
 */
export interface TimeSlotProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Schedule item start time */
    startTime: Date;
    /** Schedule item end time */
    endTime: Date;
    /** Schedule item time zone ID */
    timeZoneId: string;
    /** Formatted time range string (e.g., "18:30 - 19:00") */
    formattedTimeRange: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Locale */
  locale?: Intl.LocalesArgument;
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
 * <ScheduleItem.TimeSlot asChild>
 *   <div className="text-gray-600" />
 * </ScheduleItem.TimeSlot>
 *
 * // asChild with react component
 * <ScheduleItem.TimeSlot asChild>
 *   {React.forwardRef(({ startTime, endTime, timeZoneId, formattedTimeRange, ...props }, ref) => (
 *     <time ref={ref} className="text-gray-600" {...props} dateTime={startTime.toISOString()}>
 *       {formattedTimeRange}
 *     </time>
 *   ))}
 * </ScheduleItem.TimeSlot>
 * ```
 */
export const TimeSlot = React.forwardRef<HTMLElement, TimeSlotProps>(
  (props, ref) => {
    const { asChild, children, className, locale, ...otherProps } = props;

    return (
      <CoreScheduleItem.TimeSlot locale={locale}>
        {({ startTime, endTime, timeZoneId, formattedTimeRange }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleItemTimeSlot}
            customElement={children}
            customElementProps={{
              startTime,
              endTime,
              timeZoneId,
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
    /** Duration in minutes */
    durationMinutes: number;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item duration.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItem.Duration className="text-sm text-gray-500" />
 *
 * // asChild with primitive
 * <ScheduleItem.Duration asChild>
 *   <div className="text-sm text-gray-500" />
 * </ScheduleItem.Duration>
 *
 * // asChild with react component
 * <ScheduleItem.Duration asChild>
 *   {React.forwardRef(({ durationMinutes, ...props }, ref) => (
 *     <span ref={ref} className="text-sm text-gray-500" {...props}>
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
            data-testid={TestIds.scheduleItemDuration}
            customElement={children}
            customElementProps={{ durationMinutes }}
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
 * Props for the ScheduleItem Description component.
 */
export interface DescriptionProps {
  /** Custom render function */
  children?: AsChildChildren<{
    /** Schedule item description */
    description: string;
  }>;
}

/**
 * Provides the schedule item description. RicosViewer should be used to render the description.
 *
 * @component
 * @example
 * ```tsx
 * // Usage with react component
 * // If using RicosViewer, use fromRichTextHtml from @wix/ricos to convert the description to RichContent
 * <ScheduleItem.Description>
 *   {React.forwardRef(({ description, ...props }, ref) => (
 *     <RicosViewer ref={ref} content={fromRichTextHtml(description)} />
 *   ))}
 * </ScheduleItem.Description>
 * ```
 */
export const Description = React.forwardRef<HTMLElement, DescriptionProps>(
  (props, ref) => {
    const { children, ...otherProps } = props;

    return (
      <CoreScheduleItem.Description>
        {({ description }) => (
          <AsChildSlot
            asChild
            ref={ref}
            data-testid={TestIds.scheduleItemDescription}
            customElement={children}
            customElementProps={{ description }}
            {...otherProps}
          />
        )}
      </CoreScheduleItem.Description>
    );
  },
);

/**
 * Props for the ScheduleItem Stage component.
 */
export interface StageProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    /** Schedule item stage name */
    stageName: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the schedule item stage.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleItem.Stage className="text-blue-600 font-medium" />
 *
 * // asChild with primitive
 * <ScheduleItem.Stage asChild>
 *   <span className="text-blue-600 font-medium" />
 * </ScheduleItem.Stage>
 *
 * // asChild with react component
 * <ScheduleItem.Stage asChild>
 *   {React.forwardRef(({ stageName, ...props }, ref) => (
 *     <span ref={ref} className="text-blue-600 font-medium" {...props}>
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
          data-testid={TestIds.scheduleItemStage}
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
 * Props for the ScheduleItem Tags component.
 */
export interface TagsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        /** Schedule item tags */
        tags: string[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule item tags.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleItem.Tags>
 *   <ScheduleItem.TagRepeater>
 *     <ScheduleItemTag.Label />
 *   </ScheduleItem.TagRepeater>
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
          data-testid={TestIds.scheduleItemTags}
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
 * Props for the ScheduleItem TagRepeater component.
 */
export interface TagRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the tag element */
  className?: string;
}

/**
 * Repeater component that renders ScheduleItemTag.Root for each tag.
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
  const { children, className } = props;

  return (
    <CoreScheduleItem.Tags>
      {({ tags }) =>
        tags.map((tag, index) => (
          <ScheduleItemTag.Root key={index} tag={tag} className={className}>
            {children}
          </ScheduleItemTag.Root>
        ))
      }
    </CoreScheduleItem.Tags>
  );
};
