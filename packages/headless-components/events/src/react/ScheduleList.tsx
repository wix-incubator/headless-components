import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleListServiceConfig } from '../services/schedule-list-service.js';
import * as CoreScheduleList from './core/ScheduleList.js';
import { type ScheduleItem } from '../services/schedule-list-service.js';
import * as Schedule from './Schedule.js';

enum TestIds {
  scheduleListItems = 'schedule-list-items',
  scheduleListError = 'schedule-list-error',
}

/**
 * Props for the ScheduleList Root component.
 */
export interface RootProps {
  /** Child components */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

/**
 * Root container that provides schedule list service context to all child components.
 * Must be used as the top-level component for schedule list functionality.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { ScheduleList } from '@wix/events/components';
 *
 * function ScheduleListPage({ scheduleListServiceConfig }) {
 *   return (
 *     <ScheduleList.Root scheduleListServiceConfig={scheduleListServiceConfig}>
 *       <ScheduleList.Items emptyState={<div>No schedule items available</div>}>
 *         <ScheduleList.ItemRepeater />
 *       </ScheduleList.Items>
 *       <ScheduleList.Error />
 *     </ScheduleList.Root>
 *   );
 * }
 * ```
 */
export const Root = (props: RootProps): React.ReactNode => {
  const { children, scheduleListServiceConfig } = props;

  return (
    <CoreScheduleList.Root
      scheduleListServiceConfig={scheduleListServiceConfig}
    >
      {children}
    </CoreScheduleList.Root>
  );
};

/**
 * Props for the ScheduleList Items component.
 */
export interface ItemsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Child components or custom render function when using asChild */
  children:
    | React.ReactNode
    | AsChildChildren<{
        items: ScheduleItem[];
      }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Container for the schedule list with support for empty state.
 * Follows List Container Level pattern.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.Items>
 *   <ScheduleList.ItemRepeater />
 * </ScheduleList.Items>
 * ```
 */
export const Items = React.forwardRef<HTMLElement, ItemsProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleList.Items>
      {({ items, hasItems }) => {
        if (!hasItems) {
          return null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleListItems}
            customElement={children}
            customElementProps={{ items }}
            {...otherProps}
          >
            <div>{children as React.ReactNode}</div>
          </AsChildSlot>
        );
      }}
    </CoreScheduleList.Items>
  );
});

/**
 * Props for the ScheduleList ItemRepeater component.
 */
export interface ItemRepeaterProps {
  /** Child components */
  children: React.ReactNode;
  /** CSS classes to apply to the schedule item element */
  className?: string;
}

/**
 * Repeater component that renders Schedule.Root for each schedule item.
 * Follows Repeater Level pattern.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <ScheduleList.ItemRepeater>
 *   <Schedule.Name />
 *   <Schedule.TimeSlot />
 * </ScheduleList.ItemRepeater>
 * ```
 */
export const ItemRepeater = (props: ItemRepeaterProps): React.ReactNode => {
  const { children, className } = props;

  return (
    <CoreScheduleList.ItemRepeater>
      {({ items }) => {
        return items.map((item) => (
          <Schedule.Root key={item._id} item={item} className={className}>
            {children}
          </Schedule.Root>
        ));
      }}
    </CoreScheduleList.ItemRepeater>
  );
};

// LoadMoreTrigger removed - no pagination needed

/**
 * Props for the ScheduleList Error component.
 */
export interface ErrorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ error: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays an error message when the schedule list fails to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <ScheduleList.Error className="text-red-500" />
 *
 * // asChild with primitive
 * <ScheduleList.Error asChild className="text-red-500">
 *   <span />
 * </ScheduleList.Error>
 *
 * // asChild with react component
 * <ScheduleList.Error asChild className="text-red-500">
 *   {React.forwardRef(({ error, ...props }, ref) => (
 *     <span ref={ref} {...props}>
 *       {error}
 *     </span>
 *   ))}
 * </ScheduleList.Error>
 * ```
 */
export const Error = React.forwardRef<HTMLElement, ErrorProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreScheduleList.Error>
      {({ error }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleListError}
            customElement={children}
            customElementProps={{ error }}
            content={error}
            {...otherProps}
          >
            <span>{error}</span>
          </AsChildSlot>
        );
      }}
    </CoreScheduleList.Error>
  );
});
