import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  type FilterOption,
  Filter as FilterPrimitive,
} from '@wix/headless-components/react';
import {
  EventListService,
  EventListServiceDefinition,
  type EventListServiceConfig,
  type Category,
} from '../../services/event-list-service.js';
import { type Event } from '../../services/event-service.js';
import {
  ALL_CATEGORIES,
  CATEGORIES_FILTER_KEY,
  ALL_EVENTS,
  STATUS_FILTER_KEY,
  UPCOMING_EVENTS,
  PAST_EVENTS,
} from '../../constants.js';

export interface RootProps {
  /** Child components that will have access to the event list service */
  children: React.ReactNode;
  /** Configuration for the event list service */
  eventListServiceConfig: EventListServiceConfig;
}

/**
 * EventList Root core component that provides event list service context.
 *
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, eventListServiceConfig } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventListServiceDefinition,
        EventListService,
        eventListServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface EventsProps {
  /** Render prop function */
  children: (props: EventsRenderProps) => React.ReactNode;
}

export interface EventsRenderProps {
  /** List of events */
  events: Event[];
  /** Indicates whether there are any events in the list */
  hasEvents: boolean;
  /** Indicates whether events are currently being loaded */
  isLoading: boolean;
}

/**
 * EventList Events core component that provides event list data.
 *
 * @component
 */
export function Events(props: EventsProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const isLoading = eventListService.isLoading.get();
  const events = eventListService.events.get();
  const hasEvents = !!events.length;

  return props.children({ events, hasEvents, isLoading });
}

export interface EventRepeaterProps {
  /** Render prop function */
  children: (props: EventRepeaterRenderProps) => React.ReactNode;
}

export interface EventRepeaterRenderProps {
  /** List of events */
  events: Event[];
}

/**
 * EventList EventRepeater core component that provides event list. Not rendered if there are no events.
 *
 * @component
 */
export function EventRepeater(props: EventRepeaterProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const events = eventListService.events.get();
  const hasEvents = !!events.length;

  if (!hasEvents) {
    return null;
  }

  return props.children({ events });
}

export interface LoadMoreTriggerProps {
  /** Render prop function */
  children: (props: LoadMoreTriggerRenderProps) => React.ReactNode;
}

export interface LoadMoreTriggerRenderProps {
  /** Indicates whether more events are being loaded */
  isLoading: boolean;
  /** Function to load more events */
  loadMoreEvents: () => void;
}

/**
 * EventList LoadMoreTrigger core component that provides load more trigger data.
 *
 * @component
 */
export function LoadMoreTrigger(props: LoadMoreTriggerProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const isLoading = eventListService.isLoadingMore.get();
  const hasMoreEvents = eventListService.hasMoreEvents.get();

  if (!hasMoreEvents) {
    return null;
  }

  return props.children({
    isLoading,
    loadMoreEvents: eventListService.loadMoreEvents,
  });
}

export interface ErrorProps {
  /** Render prop function */
  children: (props: ErrorRenderProps) => React.ReactNode;
}

export interface ErrorRenderProps {
  /** Event list error message */
  error: string;
}

/**
 * EventList Error core component that provides event list error. Not rendered if there is no error.
 *
 * @component
 */
export function Error(props: ErrorProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const error = eventListService.error.get();

  if (!error) {
    return null;
  }

  return props.children({ error });
}

export interface CategoryFilterProps {
  /** Render prop function */
  children: (props: CategoryFilterRenderProps) => React.ReactNode;
  /** All categories label*/
  allCategoriesLabel: string;
}

export interface CategoryFilterRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  value: FilterPrimitive.Filter;
  /** Function to handle category change */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

/**
 * CategoryFilter core component that provides event list filters data.
 *
 * @component
 */
export function CategoryFilter(props: CategoryFilterProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const categories = eventListService.categories.get();
  const selectedCategoryId =
    eventListService.selectedCategoryId.get() || ALL_CATEGORIES;

  if (!categories.length) {
    return null;
  }

  const onChange = async (value: FilterPrimitive.Filter) => {
    const categoryId = value!['categoryId'];

    await eventListService.loadEvents({
      categoryId: categoryId === ALL_CATEGORIES ? null : categoryId,
    });
  };

  const { filterOptions, value } = buildCategoryFilterProps(
    categories,
    props.allCategoriesLabel,
    selectedCategoryId,
  );

  return props.children({
    filterOptions,
    value,
    onChange,
  });
}

export interface StatusFilterProps {
  /** Render prop function */
  children: (props: StatusFilterRenderProps) => React.ReactNode;
  /** All events label */
  allEventsLabel: string;
  /** Upcoming events label */
  upcomingEventsLabel: string;
  /** Past events label */
  pastEventsLabel: string;
}

export interface StatusFilterRenderProps {
  /** Filter options */
  filterOptions: FilterOption[];
  /** Filter value */
  value: FilterPrimitive.Filter;
  /** Function to handle status change */
  onChange: (value: FilterPrimitive.Filter) => Promise<void>;
}

/**
 * StatusFilter core component that provides event list status filters data.
 *
 * @component
 */
export function StatusFilter(props: StatusFilterProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);

  const selectedStatusId = eventListService.selectedStatusId.get();

  const onChange = async (value: FilterPrimitive.Filter) => {
    const statusId = value!['statusId'];

    await eventListService.loadEvents({ statusId });
  };

  const { filterOptions, value } = buildStatusFilterProps(
    props.allEventsLabel,
    props.upcomingEventsLabel,
    props.pastEventsLabel,
    selectedStatusId,
  );

  return props.children({
    filterOptions,
    value,
    onChange,
  });
}

const buildCategoryFilterProps = (
  categories: Category[],
  allCategoriesLabel: string,
  selectedCategoryId: string,
) => {
  const FILTER_BASE = {
    key: CATEGORIES_FILTER_KEY,
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'categoryId',
  };

  const filterOptions = [
    {
      ...FILTER_BASE,
      validValues: [
        ALL_CATEGORIES,
        ...categories.map((category) => category._id!),
      ],
      valueFormatter: (value: string | number) =>
        value === ALL_CATEGORIES
          ? allCategoriesLabel
          : categories.find((category) => category._id === value)!.name!,
    },
  ];

  const value = {
    ...FILTER_BASE,
    categoryId: selectedCategoryId,
  };

  return { filterOptions, value };
};

const buildStatusFilterProps = (
  allEventsLabel: string,
  upcomingEventsLabel: string,
  pastEventsLabel: string,
  selectedStatusId: string,
) => {
  const FILTER_BASE = {
    key: STATUS_FILTER_KEY,
    label: '',
    type: 'single' as const,
    displayType: 'text' as const,
    fieldName: 'statusId',
  };

  const filterOptions = [
    {
      ...FILTER_BASE,
      validValues: [ALL_EVENTS, UPCOMING_EVENTS, PAST_EVENTS],
      valueFormatter: (value: string | number) => {
        switch (value) {
          case ALL_EVENTS:
            return allEventsLabel;
          case UPCOMING_EVENTS:
            return upcomingEventsLabel;
          case PAST_EVENTS:
            return pastEventsLabel;
          default:
            return upcomingEventsLabel;
        }
      },
    },
  ];

  const value = {
    ...FILTER_BASE,
    statusId: selectedStatusId,
  };

  return { filterOptions, value };
};
