import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2 } from '@wix/events';

export type Event = wixEventsV2.Event;
export type RichContent = wixEventsV2.RichContent;

export interface EventServiceAPI {
  event: Signal<Event>;
}

export interface EventServiceConfig {
  event: Event;
}

export type EventServiceConfigResult =
  | { type: 'success'; config: EventServiceConfig }
  | { type: 'notFound' };

export const EventServiceDefinition = defineService<
  EventServiceAPI,
  EventServiceConfig
>('event');

export const EventService = implementService.withConfig<EventServiceConfig>()(
  EventServiceDefinition,
  ({ getService, config }) => {
    const signalsService = getService(SignalsServiceDefinition);

    const event = signalsService.signal<Event>(config.event);

    return {
      event,
    };
  },
);

export async function loadEventServiceConfig(
  slug: string,
): Promise<EventServiceConfigResult> {
  try {
    const { event } = await wixEventsV2.getEventBySlug(slug, {
      fields: [
        wixEventsV2.RequestedFields.DETAILS,
        wixEventsV2.RequestedFields.REGISTRATION,
        wixEventsV2.RequestedFields.TEXTS,
        wixEventsV2.RequestedFields.FORM,
      ],
    });

    if (event) {
      return {
        type: 'success',
        config: {
          event,
        },
      };
    }
  } catch (error) {
    console.error(`Failed to load event with "${slug}" slug`, error);
  }

  return {
    type: 'notFound',
  };
}
