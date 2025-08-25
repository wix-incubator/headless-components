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

export async function loadEventServiceConfig(eventId: string): Promise<EventServiceConfig> {
  const eventResponse = await wixEventsV2.getEvent(eventId, { fields: [wixEventsV2.RequestedFields.DETAILS] }) as any;
  return { event: eventResponse };
}
