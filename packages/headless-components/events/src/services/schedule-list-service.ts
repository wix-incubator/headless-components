import { schedule } from '@wix/events';
import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';

export type ScheduleItem = schedule.ScheduleItem;

export interface ScheduleListServiceAPI {
  /** Reactive signal containing the list of schedule items */
  items: Signal<ScheduleItem[]>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
}

export interface ScheduleListServiceConfig {
  /** Event ID to load schedule items for */
  eventId: string;
  items: ScheduleItem[];
}

export const ScheduleListServiceDefinition = defineService<
  ScheduleListServiceAPI,
  ScheduleListServiceConfig
>('scheduleList');

export const ScheduleListService =
  implementService.withConfig<ScheduleListServiceConfig>()(
    ScheduleListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const items = signalsService.signal<ScheduleItem[]>(config.items);
      const error = signalsService.signal<string | null>(null);

      return {
        items,
        error,
      };
    },
  );

export async function loadScheduleListServiceConfig(
  eventId: string,
): Promise<ScheduleListServiceConfig> {
  const queryScheduleResult = await queryScheduleItems(eventId);

  return {
    eventId,
    items: queryScheduleResult.items ?? [],
  };
}

const queryScheduleItems = async (eventId: string) => {
  const queryScheduleResult = await schedule.listScheduleItems({
    eventId: [eventId],
    state: ['PUBLISHED', 'VISIBLE'],
    limit: 2,
  });

  return queryScheduleResult;
};
