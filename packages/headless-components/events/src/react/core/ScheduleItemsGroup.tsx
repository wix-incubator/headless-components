import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  ScheduleItemsGroupService,
  ScheduleItemsGroupServiceConfig,
  ScheduleItemsGroupServiceDefinition,
} from '../../services/schedule-items-group-service.js';
import { type ScheduleItem } from '../../services/schedule-item-service.js';
import { type ScheduleItemsGroup } from '../../services/schedule-items-group-service.js';

export interface RootProps {
  /** Child components that will have access to the schedule items group service */
  children: React.ReactNode;
  /** Schedule items group data */
  itemsGroup: ScheduleItemsGroup;
}

/**
 * ScheduleItemsGroup Root core component that provides schedule items group service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { itemsGroup, children } = props;

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

export interface GroupDateLabelProps {
  /** Render prop function */
  children: (props: GroupDateLabelRenderProps) => React.ReactNode;
}

export interface GroupDateLabelRenderProps {
  /** Formatted date label (e.g., "Mon, 07 Jul") */
  formattedDate: string;
  /** Date object for the group */
  date: Date;
}

/**
 * ScheduleItemsGroup GroupDateLabel core component that provides group date label information.
 *
 * @component
 */
export function GroupDateLabel(props: GroupDateLabelProps): React.ReactNode {
  const groupService = useService(ScheduleItemsGroupServiceDefinition);
  const { formattedDate, date } = groupService.itemsGroup.get();

  return props.children({ formattedDate, date });
}

export interface GroupItemsProps {
  /** Render prop function */
  children: (props: GroupItemsRenderProps) => React.ReactNode;
}

export interface GroupItemsRenderProps {
  /** List of schedule items */
  items: ScheduleItem[];
}

/**
 * ScheduleItemsGroup GroupItems core component that provides group items information.
 * Returns filtered items based on current stage and tag filters.
 *
 * @component
 */
export function GroupItems(props: GroupItemsProps): React.ReactNode {
  const groupService = useService(ScheduleItemsGroupServiceDefinition);
  const { items } = groupService.itemsGroup.get();

  return props.children({ items });
}
