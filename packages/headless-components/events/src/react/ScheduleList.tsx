import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import React from 'react';
import { type ScheduleListServiceConfig } from '../services/schedule-list-service.js';
import * as CoreScheduleList from './core/ScheduleList.js';
import * as CoreSchedule from './core/Schedule.js';
import { type ScheduleItem } from '../services/schedule-list-service.js';

enum TestIds {
  scheduleListItems = 'schedule-list-items',
  scheduleListItemRepeater = 'schedule-list-item-repeater',
  scheduleListDateGroup = 'schedule-list-date-group',
  scheduleListDateHeader = 'schedule-list-date-header',
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
        groupedItems: Array<{
          date: string;
          dateFormatted: string;
          items: ScheduleItem[];
        }>;
      }>;
  /** Empty state to display when no schedule items are available */
  emptyState?: React.ReactNode;
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
 * <ScheduleList.Items emptyState={<div>No schedule items found</div>}>
 *   <ScheduleList.ItemRepeater />
 * </ScheduleList.Items>
 * ```
 */
export const Items = React.forwardRef<HTMLElement, ItemsProps>((props, ref) => {
  const { asChild, children, emptyState, className, ...otherProps } = props;

  return (
    <CoreScheduleList.Items>
      {({ items, groupedItems, hasItems }) => {
        if (!hasItems) {
          return emptyState || null;
        }

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.scheduleListItems}
            customElement={children}
            customElementProps={{ items, groupedItems }}
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
 * <ScheduleList.ItemRepeater />
 * ```
 */
export const ItemRepeater = (props: ItemRepeaterProps): React.ReactNode => {
  const { className } = props;

  return (
    <CoreScheduleList.ItemRepeater>
      {({ groupedItems }) => {
        return groupedItems.map((group) => (
          <div key={group.date} data-testid={TestIds.scheduleListDateGroup}>
            <DateHeader date={group.date} dateFormatted={group.dateFormatted} />
            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}
                  data-testid={TestIds.scheduleListItemRepeater}
                >
                  <ScheduleItem item={item}>{props.children}</ScheduleItem>
                </div>
              ))}
            </div>
          </div>
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

interface DateHeaderProps {
  date: string;
  dateFormatted: string;
}

const DateHeader = ({ dateFormatted }: DateHeaderProps) => (
  <h3
    className="text-lg font-semibold text-gray-900 mb-4 mt-6 first:mt-0"
    data-testid={TestIds.scheduleListDateHeader}
  >
    {dateFormatted}
  </h3>
);

interface ScheduleItemProps {
  item: ScheduleItem;
  children: React.ReactNode;
}

const ScheduleItem = ({ item, children }: ScheduleItemProps) => {
  return (
    <CoreSchedule.Root item={item}>
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-24">
          <CoreSchedule.TimeSlot>
            {({ timeRange, duration }) => (
              <div className="text-sm">
                <div className="font-medium text-gray-900">{timeRange}</div>
                {duration && <div className="text-gray-500">{duration}</div>}
              </div>
            )}
          </CoreSchedule.TimeSlot>
        </div>
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            <CoreSchedule.Name>
              {({ name }) => (
                <h4 className="font-medium text-gray-900">{name}</h4>
              )}
            </CoreSchedule.Name>

            <CoreSchedule.Stage>
              {({ stageName }) =>
                stageName && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span>📍</span>
                    <span>{stageName}</span>
                  </div>
                )
              }
            </CoreSchedule.Stage>

            <CoreSchedule.Tags>
              {({ tags, hasTags }) =>
                hasTags && (
                  <div className="flex gap-2 flex-wrap">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )
              }
            </CoreSchedule.Tags>
          </div>
          {children}
        </div>
      </div>
    </CoreSchedule.Root>
  );
};
