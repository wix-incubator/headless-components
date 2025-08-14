import { defineService, implementService } from "@wix/services-definitions";
import {
  SignalsServiceDefinition,
  type Signal,
} from "@wix/services-definitions/core-services/signals";
import { wixEventsV2 } from "@wix/events";

export interface EventListServiceAPI {
  events: Signal<wixEventsV2.Event[]>;
}

export interface EventListServiceConfig {
  events: wixEventsV2.Event[];
}

export const EventListServiceDefinition = defineService<
  EventListServiceAPI,
  EventListServiceConfig
>("eventList");

export const EventListService = implementService.withConfig<EventListServiceConfig>()(
  EventListServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const events: Signal<wixEventsV2.Event[]> = signalsService.signal(
      config.events,
    );

    return {
      events,
    };
  },
);
