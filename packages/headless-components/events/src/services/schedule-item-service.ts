import { defineService, implementService } from '@wix/services-definitions';
import {
  Signal,
  ReadOnlySignal,
  SignalsServiceDefinition,
} from '@wix/services-definitions/core-services/signals';
import { type ScheduleItem } from './schedule-list-service.js';

/**
 * API interface for the Schedule Item service, providing reactive schedule item data management.
 * This service handles a single schedule item's data and provides computed values for common display needs.
 *
 * @interface ScheduleItemServiceAPI
 */
export interface ScheduleItemServiceAPI {
  /** Reactive signal containing the current schedule item data */
  item: Signal<ScheduleItem>;
  /** Schedule item name */
  name: ReadOnlySignal<string>;
  /** Schedule item description */
  description: ReadOnlySignal<string>;
  /** Schedule item stage name */
  stageName: ReadOnlySignal<string>;
  /** Schedule item tags */
  tags: ReadOnlySignal<string[]>;
  /** Whether the item has tags */
  hasTags: ReadOnlySignal<boolean>;
  /** Schedule item start time */
  startTime: ReadOnlySignal<Date | null>;
  /** Schedule item end time */
  endTime: ReadOnlySignal<Date | null>;
  /** Formatted time range string (e.g., "18:30 - 19:00") */
  timeRange: ReadOnlySignal<string>;
  /** Duration in minutes */
  durationMinutes: ReadOnlySignal<number>;
}

/**
 * Configuration interface for the Schedule Item service.
 * Requires a schedule item to be provided.
 *
 * @interface ScheduleItemServiceConfig
 */
export interface ScheduleItemServiceConfig {
  /** The schedule item data */
  item: ScheduleItem;
}

/**
 * Service definition for the Schedule Item service.
 * This defines the contract that the ScheduleItemService must implement.
 *
 * @constant
 */
export const ScheduleItemServiceDefinition = defineService<
  ScheduleItemServiceAPI,
  ScheduleItemServiceConfig
>('schedule-item');

/**
 * Implementation of the Schedule Item service that manages reactive schedule item data.
 * This service provides computed signals for common schedule item display needs like
 * time formatting, duration calculations, and data access.
 *
 * @example
 * ```tsx
 * import { ScheduleItemService, ScheduleItemServiceDefinition } from '@wix/services/schedule-item';
 * import { useService } from '@wix/services-manager-react';
 *
 * function ScheduleItemComponent({ scheduleItemConfig }) {
 *   return (
 *     <ServiceProvider services={createServicesMap([
 *       [ScheduleItemServiceDefinition, ScheduleItemService.withConfig(scheduleItemConfig)]
 *     ])}>
 *       <ScheduleItemDisplay />
 *     </ServiceProvider>
 *   );
 * }
 *
 * function ScheduleItemDisplay() {
 *   const scheduleItemService = useService(ScheduleItemServiceDefinition);
 *   const name = scheduleItemService.name.get();
 *   const timeRange = scheduleItemService.timeRange.get();
 *   const durationMinutes = scheduleItemService.durationMinutes.get();
 *
 *   return (
 *     <div>
 *       <h1>{name}</h1>
 *       <p>{timeRange}</p>
 *       <p>{durationMinutes > 0 ? `${durationMinutes} minutes` : ''}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const ScheduleItemService =
  implementService.withConfig<ScheduleItemServiceConfig>()(
    ScheduleItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const item: Signal<ScheduleItem> = signalsService.signal(config.item);

      const name = signalsService.computed(() => item.get().name!);

      const description = signalsService.computed(
        () => item.get().description || '',
      );

      const stageName = signalsService.computed(
        () => item.get().stageName || '',
      );

      const tags = signalsService.computed(() => item.get().tags || []);

      const hasTags = signalsService.computed(() => !!tags.get().length);

      const startTime = signalsService.computed(
        () => new Date(item.get().timeSlot!.start!),
      );

      const endTime = signalsService.computed(
        () => new Date(item.get().timeSlot!.end!),
      );

      const formatTime = (date: Date): string =>
        date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });

      const timeRange = signalsService.computed(() => {
        const start = startTime.get();
        const end = endTime.get();

        if (start && end) {
          return `${formatTime(start)} - ${formatTime(end)}`;
        } else if (start) {
          return formatTime(start);
        }

        return '';
      });

      const durationMinutes = signalsService.computed(() => {
        const start = startTime.get();
        const end = endTime.get();

        if (start && end) {
          return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
        }

        return 0;
      });

      return {
        item,
        name,
        description,
        stageName,
        tags,
        hasTags,
        startTime,
        endTime,
        timeRange,
        durationMinutes,
      };
    },
  );

export type ScheduleItemServiceConfigResult = ScheduleItemServiceConfig;
