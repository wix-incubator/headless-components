import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { ScheduleItemGroup } from './schedule-list-service.js';

export interface ScheduleListGroupServiceAPI {
  group: Signal<ScheduleItemGroup>;
}

export interface ScheduleListGroupServiceConfig {
  group: ScheduleItemGroup;
}

export const ScheduleListGroupServiceDefinition = defineService<
  ScheduleListGroupServiceAPI,
  ScheduleListGroupServiceConfig
>('group');

export const ScheduleListGroupService =
  implementService.withConfig<ScheduleListGroupServiceConfig>()(
    ScheduleListGroupServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const group = signalsService.signal<ScheduleItemGroup>(config.group);

      return {
        group,
      };
    },
  );
