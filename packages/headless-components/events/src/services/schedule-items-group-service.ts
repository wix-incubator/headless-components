import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { type ScheduleItem } from './schedule-item-service.js';

export interface ScheduleItemsGroup {
  id: string;
  date: Date;
  timeZoneId: string;
  items: ScheduleItem[];
}

export interface ScheduleItemsGroupServiceAPI {
  itemsGroup: ReadOnlySignal<ScheduleItemsGroup>;
}

export interface ScheduleItemsGroupServiceConfig {
  itemsGroup: ScheduleItemsGroup;
}

export const ScheduleItemsGroupServiceDefinition = defineService<
  ScheduleItemsGroupServiceAPI,
  ScheduleItemsGroupServiceConfig
>('scheduleItemsGroup');

export const ScheduleItemsGroupService =
  implementService.withConfig<ScheduleItemsGroupServiceConfig>()(
    ScheduleItemsGroupServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const itemsGroup = signalsService.signal<ScheduleItemsGroup>(
        config.itemsGroup,
      );

      return { itemsGroup };
    },
  );
