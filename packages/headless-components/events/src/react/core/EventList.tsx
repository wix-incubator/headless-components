import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  EventListService,
  EventListServiceConfig,
  EventListServiceDefinition,
} from '../../services/event-list-service.js';
import { type Event } from '../../services/event-service.js';

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
  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        EventListServiceDefinition,
        EventListService,
        props.eventListServiceConfig,
      )}
    >
      {props.children}
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
}

/**
 * EventList Events core component that provides event list data.
 *
 * @component
 */
export function Events(props: EventsProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);
  const events = eventListService.events.get();
  const hasEvents = !!events.length;

  return props.children({ events, hasEvents });
}

export interface EventRepeaterProps {
  /** Render prop function */
  children: (props: EventRepeaterRenderProps) => React.ReactNode;
}

export interface EventRepeaterRenderProps {
  /** List of events */
  events: Event[];
  /** Indicates whether there are any events in the list */
  hasEvents: boolean;
}

/**
 * EventList EventRepeater core component that provides event list data.
 *
 * @component
 */
export function EventRepeater(props: EventRepeaterProps): React.ReactNode {
  const eventListService = useService(EventListServiceDefinition);
  const events = eventListService.events.get();
  const hasEvents = !!events.length;

  return props.children({ events, hasEvents });
}

export interface LoadMoreTriggerProps {
  /** Render prop function */
  children: (props: LoadMoreTriggerRenderProps) => React.ReactNode;
}

export interface LoadMoreTriggerRenderProps {
  /** Indicates whether more events are being loaded */
  isLoading: boolean;
  /** Indicates whether there are more events to load */
  hasMoreEvents: boolean;
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
  const isLoading = eventListService.isLoading.get();
  const hasMoreEvents = eventListService.hasMoreEvents.get();

  return props.children({
    isLoading,
    hasMoreEvents,
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
