import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ScheduleListService,
  ScheduleListServiceConfig,
  ScheduleListServiceDefinition,
} from '../../services/schedule-list-service.js';
import { type ScheduleItem } from '../../services/schedule-list-service.js';
import { EventServiceDefinition } from '../../services/event-service.js';

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
  const hasItems = !!items.length;

  return props.children({ items, hasItems });
}

export interface ItemRepeaterProps {
  /** Render prop function */
  children: (props: ItemRepeaterRenderProps) => React.ReactNode;
}

export interface ItemRepeaterRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
}

/**
 * ScheduleList ItemRepeater core component that provides schedule item list. Not rendered if there are no items.
 *
 * @component
 */
export function ItemRepeater(props: ItemRepeaterProps): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const items = scheduleListService.items.get();
  const hasItems = !!items.length;

  if (!hasItems) {
    return null;
  }

  return props.children({ items });
}

export interface NavigationTriggerProps {
  /** Render prop function */
  children: (props: NavigationTriggerRenderProps) => React.ReactNode;
}

export interface NavigationTriggerRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
  /** Indicates whether there are any schedule items in the list */
  hasItems: boolean;
  /** Event slug for URL construction */
  eventSlug: string;
}

/**
 * ScheduleList NavigationTrigger core component that provides navigation functionality.
 *
 * @component
 */
export function NavigationTrigger(
  props: NavigationTriggerProps,
): React.ReactNode {
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const eventService = useService(EventServiceDefinition);
  const items = scheduleListService.items.get();
  const event = eventService.event.get();
  const hasItems = !!items.length;
  const eventSlug = event.slug!;

  return props.children({ items, hasItems, eventSlug });
}
