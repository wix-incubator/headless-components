import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import React from 'react';
import {
  ScheduleListGroupService,
  ScheduleListGroupServiceConfig,
  ScheduleListGroupServiceDefinition,
} from '../../services/schedule-list-group-service.js';
import {
  type ScheduleItem,
  type ScheduleItemGroup,
  ScheduleListServiceDefinition,
} from '../../services/schedule-list-service.js';

export interface RootProps {
  /** Child components that will have access to the schedule list group service */
  children: React.ReactNode;
  /** Schedule list group data */
  group: ScheduleItemGroup;
}

/**
 * ScheduleListGroup Root core component that provides schedule list group service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { group, children } = props;

  const scheduleListGroupServiceConfig: ScheduleListGroupServiceConfig = {
    group,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        ScheduleListGroupServiceDefinition,
        ScheduleListGroupService,
        scheduleListGroupServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface GroupProps {
  /** Render prop function */
  children: (props: GroupRenderProps) => React.ReactNode;
}

export interface GroupRenderProps {
  /** Group value/text */
  group: ScheduleItemGroup;
}

/**
 * Group core component that provides group data.
 *
 * @component
 */
export function Group(props: GroupProps): React.ReactNode {
  const groupService = useService(ScheduleListGroupServiceDefinition);
  const group = groupService.group.get();

  return props.children({
    group,
  });
}

export interface GroupDateLabelProps {
  /** Render prop function */
  children: (props: GroupDateLabelRenderProps) => React.ReactNode;
}

export interface GroupDateLabelRenderProps {
  /** Formatted date label (e.g., "Mon, 07 Jul") */
  dateLabel: string;
  /** Date object for the group */
  date: Date;
}

/**
 * ScheduleList GroupDateLabel core component that provides group date label information.
 *
 * @component
 */
export function GroupDateLabel(props: GroupDateLabelProps): React.ReactNode {
  const groupService = useService(ScheduleListGroupServiceDefinition);
  const group = groupService.group.get();

  return props.children({
    dateLabel: group.dateLabel,
    date: group.date,
  });
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
 * ScheduleList GroupItems core component that provides group items information.
 * Applies current filters to the group items to ensure only matching items are displayed.
 *
 * @component
 */
export function GroupItems(props: GroupItemsProps): React.ReactNode {
  const groupService = useService(ScheduleListGroupServiceDefinition);
  const scheduleListService = useService(ScheduleListServiceDefinition);
  const group = groupService.group.get();

  const filteredItems = scheduleListService.filterItems(group.items);

  return props.children({
    items: filteredItems,
  });
}
