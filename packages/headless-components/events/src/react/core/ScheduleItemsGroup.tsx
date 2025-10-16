import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  ScheduleItemsGroupService,
  ScheduleItemsGroupServiceDefinition,
  type ScheduleItemsGroupServiceConfig,
} from '../../services/schedule-items-group-service.js';
import { type ScheduleItem } from '../../services/schedule-item-service.js';
import { type ScheduleItemsGroup } from '../../services/schedule-items-group-service.js';
import { formatShortDate } from '../../utils/date.js';

export interface RootProps {
  /** Child components that will have access to the schedule items group service */
  children: React.ReactNode;
  /** Schedule items group data */
  itemsGroup: ScheduleItemsGroup;
}

/**
 * ScheduleItemsGroup Root core component that provides schedule items group service data.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, itemsGroup } = props;

  const scheduleItemsGroupServiceConfig: ScheduleItemsGroupServiceConfig = {
    itemsGroup,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleItemsGroupServiceDefinition,
        ScheduleItemsGroupService,
        scheduleItemsGroupServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface DateLabelProps {
  /** Render prop function */
  children: (props: DateLabelRenderProps) => React.ReactNode;
  /** Locale */
  locale?: Intl.LocalesArgument;
}

export interface DateLabelRenderProps {
  /** Date object for the group */
  date: Date;
  /** Time zone ID */
  timeZoneId: string;
  /** Formatted date label (e.g., "Mon, 07 Jul") */
  formattedDate: string;
}

/**
 * ScheduleItemsGroup DateLabel core component that provides group date label information.
 *
 * @component
 */
export function DateLabel(props: DateLabelProps): React.ReactNode {
  const groupService = useService(ScheduleItemsGroupServiceDefinition);

  const itemsGroup = groupService.itemsGroup.get();
  const date = itemsGroup.date;
  const timeZoneId = itemsGroup.timeZoneId;
  const formattedDate = formatShortDate(date, timeZoneId, props.locale);

  return props.children({ date, timeZoneId, formattedDate });
}

export interface ItemsProps {
  /** Render prop function */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

export interface ItemsRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
}

/**
 * ScheduleItemsGroup Items core component that provides group items data.
 * Returns filtered items based on current stage and tag filters.
 *
 * @component
 */
export function Items(props: ItemsProps): React.ReactNode {
  const groupService = useService(ScheduleItemsGroupServiceDefinition);

  const itemsGroup = groupService.itemsGroup.get();
  const items = itemsGroup.items;

  return props.children({ items });
}
