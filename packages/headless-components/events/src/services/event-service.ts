import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2 } from '@wix/events';

export type Event = wixEventsV2.Event;

export interface EventServiceAPI {
  event: Signal<Event>;
}

export interface EventServiceConfig {
  event: Event;
}

export const EventServiceDefinition = defineService<
  EventServiceAPI,
  EventServiceConfig
>('event');

export const EventService = implementService.withConfig<EventServiceConfig>()(
  EventServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const event: Signal<Event> = signalsService.signal(config.event);

    return {
      event,
    };
  },
);

export async function loadEventServiceConfig(
  slug: string,
): Promise<EventServiceConfig> {
  const { event } = await wixEventsV2.getEventBySlug(slug, {
    fields: [
      wixEventsV2.RequestedFields.DETAILS,
      wixEventsV2.RequestedFields.TEXTS,
      wixEventsV2.RequestedFields.FORM,
    ],
  });

  return {
    event: event!,
  };
}
