import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { schedule } from '@wix/events';

export type ScheduleItem = schedule.ScheduleItem;

export interface ScheduleItemServiceAPI {
  item: Signal<ScheduleItem>;
}

export interface ScheduleItemServiceConfig {
  item: ScheduleItem;
}

export const ScheduleItemServiceDefinition = defineService<
  ScheduleItemServiceAPI,
  ScheduleItemServiceConfig
>('schedule-item');

export const ScheduleItemService =
  implementService.withConfig<ScheduleItemServiceConfig>()(
    ScheduleItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const item: Signal<ScheduleItem> = signalsService.signal(config.item);

      return { item };
    },
  );

export type ScheduleItemServiceConfigResult = ScheduleItemServiceConfig;
