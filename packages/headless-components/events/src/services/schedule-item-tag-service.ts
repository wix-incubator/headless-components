import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';

export interface ScheduleItemTagServiceAPI {
  tag: Signal<string>;
}

export interface ScheduleItemTagServiceConfig {
  tag: string;
}

export const ScheduleItemTagServiceDefinition = defineService<
  ScheduleItemTagServiceAPI,
  ScheduleItemTagServiceConfig
>('scheduleItemTag');

export const ScheduleItemTagService =
  implementService.withConfig<ScheduleItemTagServiceConfig>()(
    ScheduleItemTagServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const tag = signalsService.signal<string>(config.tag);

      return { tag };
    },
  );
