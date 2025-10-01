import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2, categories } from '@wix/events';
import { getErrorMessage } from '../utils/errors.js';
import { type Event } from './event-service.js';
import { ALL_EVENTS, PAST_EVENTS, UPCOMING_EVENTS } from '../constants.js';

export type Category = categories.Category;

export interface EventListServiceAPI {
  /** Reactive signal containing the list of events */
  events: Signal<Event[]>;
  /** Reactive signal containing the list of categories */
  categories: Signal<Category[]>;
  /** Reactive signal containing the selected category id */
  selectedCategoryId: Signal<string | null>;
  /** Reactive signal containing the selected status id */
  selectedStatusId: Signal<string>;
  /** Reactive signal indicating if events are currently being loaded */
  isLoading: Signal<boolean>;
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
  /** Function to load events */
  loadEvents: (categoryId?: string, statusId?: string) => Promise<void>;
  /** Function to load more events */
  loadMoreEvents: () => Promise<void>;
}

export interface EventListServiceConfig {
  events: Event[];
  categories: Category[];
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
      const categories = signalsService.signal<Category[]>(config.categories);
      const selectedCategoryId = signalsService.signal<string | null>(null);
      const selectedStatusId = signalsService.signal<string>(UPCOMING_EVENTS);
      const isLoadingMore = signalsService.signal<boolean>(false);
      const isLoading = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);
      const pageSize = signalsService.signal<number>(config.pageSize);
      const currentPage = signalsService.signal<number>(config.currentPage);
      const totalPages = signalsService.signal<number>(config.totalPages);
      const hasMoreEvents = signalsService.computed<boolean>(
        () => currentPage.get() + 1 < totalPages.get(),
      );

      const loadEvents = async (categoryId?: string, statusId?: string) => {
        selectedCategoryId.set(categoryId ?? null);
        const statuses = getStatusesFromId(statusId || selectedStatusId.get());

        if (statusId) {
          selectedStatusId.set(statusId);
        }

        isLoading.set(true);
        error.set(null);

        try {
          const queryEventsResponse = await queryEvents(
            0,
            categoryId,
            statuses,
          );

          events.set(queryEventsResponse.items);
          pageSize.set(queryEventsResponse.pageSize);
          currentPage.set(queryEventsResponse.currentPage ?? 0);
          totalPages.set(queryEventsResponse.totalPages ?? 0);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoading.set(false);
        }
      };

      const loadMoreEvents = async () => {
        isLoadingMore.set(true);
        error.set(null);

        try {
          const offset = pageSize.get() * (currentPage.get() + 1);
          const statuses = getStatusesFromId(selectedStatusId.get());
          const queryEventsResponse = await queryEvents(
            offset,
            selectedCategoryId.get(),
            statuses,
          );

          events.set([...events.get(), ...queryEventsResponse.items]);
          pageSize.set(queryEventsResponse.pageSize);
          currentPage.set(queryEventsResponse.currentPage ?? 0);
          totalPages.set(queryEventsResponse.totalPages ?? 0);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoadingMore.set(false);
        }
      };

      return {
        events,
        categories,
        selectedCategoryId,
        selectedStatusId,
        isLoading,
        isLoadingMore,
        error,
        pageSize,
        currentPage,
        totalPages,
        hasMoreEvents,
        loadEvents,
        loadMoreEvents,
      };
    },
  );

export async function loadEventListServiceConfig(): Promise<EventListServiceConfig> {
  const [queryEventsResponse, queryCategoriesResponse] = await Promise.all([
    queryEvents(),
    queryCategories(),
  ]);

  return {
    events: queryEventsResponse.items ?? [],
    categories: queryCategoriesResponse.items ?? [],
    pageSize: queryEventsResponse.pageSize,
    currentPage: queryEventsResponse.currentPage ?? 0,
    totalPages: queryEventsResponse.totalPages ?? 0,
  };
}

function queryEvents(
  offset = 0,
  categoryId?: string | null,
  eventStatuses = [wixEventsV2.Status.UPCOMING],
) {
  let eventsQuery = wixEventsV2
    .queryEvents({
      fields: [
        wixEventsV2.RequestedFields.DETAILS,
        wixEventsV2.RequestedFields.REGISTRATION,
      ],
    })
    .ascending('dateAndTimeSettings.startDate')
    .descending('_createdDate')
    .in('status', eventStatuses)
    .limit(10)
    .skip(offset);

  if (categoryId) {
    // @ts-expect-error
    eventsQuery = eventsQuery.in('categories._id', [categoryId]);
  }

  return eventsQuery.find();
}

function queryCategories() {
  return categories
    .queryCategories()
    .hasSome('states', [categories.State.MANUAL])
    .limit(100)
    .find();
}

function getStatusesFromId(statusId: string): wixEventsV2.Status[] {
  switch (statusId) {
    case UPCOMING_EVENTS:
      return [wixEventsV2.Status.UPCOMING];
    case PAST_EVENTS:
      return [wixEventsV2.Status.ENDED];
    case ALL_EVENTS:
      return [wixEventsV2.Status.UPCOMING, wixEventsV2.Status.ENDED];
    default:
      return [wixEventsV2.Status.UPCOMING];
  }
}
