import {
  type EventListServiceConfig,
  loadEventListServiceConfig,
} from '@wix/events/services';
import { useLoaderData } from 'react-router-dom';
import { EventList } from './EventList';

interface EventListPageLoaderData {
  eventListServiceConfig: EventListServiceConfig;
}

interface EventListPageProps {
  eventDetailsPagePath: string;
}

export async function eventListPageLoader(): Promise<EventListPageLoaderData> {
  const eventListServiceConfig = await loadEventListServiceConfig();

  return {
    eventListServiceConfig,
  };
}

export function EventListPage({ eventDetailsPagePath }: EventListPageProps) {
  const { eventListServiceConfig } =
    useLoaderData<typeof eventListPageLoader>();

  return (
    <EventList
      eventListServiceConfig={eventListServiceConfig}
      eventDetailsPagePath={eventDetailsPagePath}
    />
  );
}
