import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { type Event } from './event-service.js';

export interface EventListServiceAPI {
  events: Signal<Event[]>;
}

export interface EventListServiceConfig {
  events: Event[];
}

export const EventListServiceDefinition = defineService<
  EventListServiceAPI,
  EventListServiceConfig
>('eventList');

export const EventListService =
  implementService.withConfig<EventListServiceConfig>()(
    EventListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const events: Signal<Event[]> = signalsService.signal(config.events);

      return {
        events,
      };
    },
  );
