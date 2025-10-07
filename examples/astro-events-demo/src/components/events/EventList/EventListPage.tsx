import {
  type EventListServiceConfig,
  loadEventListServiceConfig,
} from '@wix/events/services';
import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { EventList } from './EventList';
import { EventListSkeleton } from './EventListSkeleton';

interface EventListPageLoaderData {
  eventListServiceConfig: EventListServiceConfig;
}

interface EventListPageProps {
  eventDetailsPagePath: string;
}

export function eventListPageLoader(): {
  data: Promise<EventListPageLoaderData>;
} {
  const data = new Promise<EventListPageLoaderData>(async resolve => {
    const eventListServiceConfig = await loadEventListServiceConfig();

    resolve({
      eventListServiceConfig,
    });
  });

  return {
    data,
  };
}

export function EventListPage({ eventDetailsPagePath }: EventListPageProps) {
  const { data } = useLoaderData<typeof eventListPageLoader>();

  return (
    <React.Suspense fallback={<EventListSkeleton />}>
      <Await resolve={data}>
        {({ eventListServiceConfig }) => (
          <div className="wix-verticals-container">
            <EventList
              eventListServiceConfig={eventListServiceConfig}
              eventDetailsPagePath={eventDetailsPagePath}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
