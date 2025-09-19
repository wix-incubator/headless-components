import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { type ScheduleItem } from './schedule-item-service.js';
import { ScheduleListServiceDefinition } from './schedule-list-service.js';

export interface ScheduleItemsGroup {
  formattedDate: string;
  date: Date;
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
      const scheduleListService = getService(ScheduleListServiceDefinition);

      const itemsGroup = signalsService.computed<ScheduleItemsGroup>(() => {
        const currentGroup = config.itemsGroup;
        const filteredItems = scheduleListService.filterItems(
          currentGroup.items,
        );

        return {
          ...currentGroup,
          items: filteredItems,
        };
      });

      return { itemsGroup };
    },
  );
