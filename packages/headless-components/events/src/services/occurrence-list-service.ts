import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type ReadOnlySignal,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import { wixEventsV2 } from '@wix/events';
import { getErrorMessage } from '../utils/errors.js';
import { type Event } from './event-service.js';
import { queryEvents } from './event-list-service.js';

export interface OccurrenceListServiceAPI {
  /** Reactive signal containing the list of occurrences */
  occurrences: Signal<Event[]>;
  /** Reactive signal indicating if more occurrences are currently being loaded */
  isLoadingMore: Signal<boolean>;
  /** Reactive signal containing any error message, or null if no error */
  error: Signal<string | null>;
  /** Reactive signal containing the number of occurrences per page */
  pageSize: Signal<number>;
  /** Reactive signal containing the current page index (zero-based) */
  currentPage: Signal<number>;
  /** Reactive signal containing the total number of pages */
  totalPages: Signal<number>;
  /** Reactive signal indicating if there are more occurrences to load */
  hasMoreOccurrences: ReadOnlySignal<boolean>;
  /** Function to load more occurrences */
  loadMoreOccurrences: () => Promise<void>;
}

export interface OccurrenceListServiceConfig {
  recurringCategoryId: string | undefined;
  occurrences: Event[];
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export const OccurrenceListServiceDefinition = defineService<
  OccurrenceListServiceAPI,
  OccurrenceListServiceConfig
>('occurrenceList');

export const OccurrenceListService =
  implementService.withConfig<OccurrenceListServiceConfig>()(
    OccurrenceListServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const occurrences = signalsService.signal<Event[]>(config.occurrences);
      const isLoadingMore = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);
      const pageSize = signalsService.signal<number>(config.pageSize);
      const currentPage = signalsService.signal<number>(config.currentPage);
      const totalPages = signalsService.signal<number>(config.totalPages);
      const hasMoreOccurrences = signalsService.computed<boolean>(
        () => currentPage.get() + 1 < totalPages.get(),
      );

      const loadMoreOccurrences = async () => {
        if (!config.recurringCategoryId) {
          return;
        }

        isLoadingMore.set(true);
        error.set(null);

        try {
          const offset = pageSize.get() * (currentPage.get() + 1);
          const response = await queryOccurrences(
            config.recurringCategoryId,
            offset,
          );

          occurrences.set([...occurrences.get(), ...response.items]);
          pageSize.set(response.pageSize);
          currentPage.set(response.currentPage);
          totalPages.set(response.totalPages);
        } catch (err) {
          error.set(getErrorMessage(err));
        } finally {
          isLoadingMore.set(false);
        }
      };

      return {
        occurrences,
        isLoadingMore,
        error,
        pageSize,
        currentPage,
        totalPages,
        hasMoreOccurrences,
        loadMoreOccurrences,
      };
    },
  );

export async function loadOccurrenceListServiceConfig(
  recurringCategoryId: string | undefined,
): Promise<OccurrenceListServiceConfig> {
  if (recurringCategoryId) {
    const response = await queryOccurrences(recurringCategoryId);

    return {
      recurringCategoryId,
      occurrences: response.items,
      pageSize: response.pageSize,
      currentPage: response.currentPage,
      totalPages: response.totalPages,
    };
  }

  return {
    recurringCategoryId,
    occurrences: [],
    pageSize: 0,
    currentPage: 0,
    totalPages: 0,
  };
}

async function queryOccurrences(recurringCategoryId: string, offset = 0) {
  return queryEvents({
    offset,
    categoryId: recurringCategoryId,
    status: [wixEventsV2.Status.UPCOMING, wixEventsV2.Status.STARTED],
  });
}
