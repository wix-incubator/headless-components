import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ScheduleListService,
  ScheduleListServiceConfig,
  ScheduleListServiceDefinition,
} from '../../services/schedule-list-service.js';
import { type ScheduleItem } from '../../services/schedule-list-service.js';

interface GroupedScheduleItems {
  date: string;
  dateFormatted: string;
  items: ScheduleItem[];
}

function groupItemsByDate(items: ScheduleItem[]): GroupedScheduleItems[] {
  const groups = new Map<string, ScheduleItem[]>();

  items.forEach((item) => {
    if (item.timeSlot?.start) {
      const date = new Date(item.timeSlot.start);
      const dateKey = date.toISOString().split('T')[0] || ''; // YYYY-MM-DD

      if (dateKey && !groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      if (dateKey) {
        groups.get(dateKey)!.push(item);
      }
    }
  });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, groupItems]) => {
      const date = new Date(dateKey + 'T00:00:00'); // Ensure valid date
      const dateFormatted = date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      });

      return {
        date: dateKey,
        dateFormatted,
        items: groupItems.sort((a, b) => {
          const aTime = a.timeSlot?.start
            ? new Date(a.timeSlot.start).getTime()
            : 0;
          const bTime = b.timeSlot?.start
            ? new Date(b.timeSlot.start).getTime()
            : 0;
          return aTime - bTime;
        }),
      };
    });
}

export interface RootProps {
  /** Child components that will have access to the schedule list service */
  children: React.ReactNode;
  /** Configuration for the schedule list service */
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

/**
 * ScheduleList Root core component that provides schedule list service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleListServiceDefinition,
        ScheduleListService,
        props.scheduleListServiceConfig,
      )}
    >
      {props.children}
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
  /** Schedule items grouped by date */
  groupedItems: GroupedScheduleItems[];
  /** Indicates whether there are any schedule items in the list */
  hasItems: boolean;
}

/**
 * ScheduleList Items core component that provides schedule list data.
 *
 * @component
 */
export function Items(props: ItemsProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const items = scheduleListService.items.get();
  const groupedItems = groupItemsByDate(items);
  const hasItems = !!items.length;

  return props.children({ items, groupedItems, hasItems });
}

export interface ItemRepeaterProps {
  /** Render prop function */
  children: (props: ItemRepeaterRenderProps) => React.ReactNode;
}

export interface ItemRepeaterRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
  /** Schedule items grouped by date */
  groupedItems: GroupedScheduleItems[];
}

/**
 * ScheduleList ItemRepeater core component that provides schedule item list. Not rendered if there are no items.
 *
 * @component
 */
export function ItemRepeater(props: ItemRepeaterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const items = scheduleListService.items.get();
  const groupedItems = groupItemsByDate(items);
  const hasItems = !!items.length;

  if (!hasItems) {
    return null;
  }

  return props.children({ items, groupedItems });
}

// LoadMoreTrigger removed - no pagination needed

export interface ErrorProps {
  /** Render prop function */
  children: (props: ErrorRenderProps) => React.ReactNode;
}

export interface ErrorRenderProps {
  /** Schedule list error message */
  error: string;
}

/**
 * ScheduleList Error core component that provides schedule list error. Not rendered if there is no error.
 *
 * @component
 */
export function Error(props: ErrorProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const error = scheduleListService.error.get();

  if (!error) {
    return null;
  }

  return props.children({ error });
}
