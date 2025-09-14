import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2 } from '@wix/events';
import { getErrorMessage } from '../utils/errors.js';
import { type Event } from './event-service.js';

export interface EventListServiceAPI {
  /** Reactive signal containing the list of events */
  events: Signal<Event[]>;
  /** Reactive signal indicating if more events are currently being loaded */
  isLoadingMore: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Reactive signal containing the number of events per page */
  pageSize: Signal<number>;
  /** Reactive signal containing the current page index (zero-based) */
  currentPage: Signal<number>;
  /** Reactive signal containing the total number of pages */
  totalPages: Signal<number>;
  /** Reactive signal indicating if there are more events to load */
  hasMoreEvents: ReadOnlySignal<boolean>;
  /** Function to load more events */
  loadMoreEvents: () => Promise<void>;
}

export interface EventListServiceConfig {
  events: Event[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
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

      const events = signalsService.signal<Event[]>(config.events);
      const isLoadingMore = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);
      const pageSize = signalsService.signal<number>(config.pageSize);
      const currentPage = signalsService.signal<number>(config.currentPage);
      const totalPages = signalsService.signal<number>(config.totalPages);
      const hasMoreEvents = signalsService.computed<boolean>(
        () => currentPage.get() + 1 < totalPages.get(),
      );

      const loadMoreEvents = async () => {
        isLoadingMore.set(true);
        error.set(null);

        try {
          const offset = pageSize.get() * (currentPage.get() + 1);
          const queryEventsResult = await queryEvents(offset);

          events.set([...events.get(), ...queryEventsResult.items]);
          pageSize.set(queryEventsResult.pageSize);
          currentPage.set(queryEventsResult.currentPage ?? 0);
          totalPages.set(queryEventsResult.totalPages ?? 0);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoadingMore.set(false);
        }
      };

      return {
        events,
        isLoadingMore,
        error,
        pageSize,
        currentPage,
        totalPages,
        hasMoreEvents,
        loadMoreEvents,
      };
    },
  );

export async function loadEventListServiceConfig(): Promise<EventListServiceConfig> {
  const queryEventsResult = await queryEvents();

  return {
    events: queryEventsResult.items ?? [],
    pageSize: queryEventsResult.pageSize,
    currentPage: queryEventsResult.currentPage ?? 0,
    totalPages: queryEventsResult.totalPages ?? 0,
  };
}

const queryEvents = async (offset = 0) => {
  const queryEventsResult = await wixEventsV2
    .queryEvents({
      fields: [
        wixEventsV2.RequestedFields.DETAILS,
        wixEventsV2.RequestedFields.REGISTRATION,
      ],
    })
    .ascending('dateAndTimeSettings.startDate')
    .descending('_createdDate')
    .eq('status', wixEventsV2.Status.UPCOMING)
    .limit(3)
    .skip(offset)
    .find();

  return queryEventsResult;
};
