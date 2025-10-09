import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
  loadEventServiceConfig,
  loadScheduleListServiceConfig,
} from '@wix/events/services';
import React from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Schedule } from './Schedule';
import { ScheduleSkeleton } from './ScheduleSkeleton';

interface SchedulePageLoaderParams {
  params: {
    slug?: string;
  };
}

interface SchedulePageLoaderData {
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

interface SchedulePageProps {
  eventDetailsPagePath: string;
}

export function schedulePageLoader({
  params: { slug },
}: SchedulePageLoaderParams): {
  slug: string;
  data: Promise<SchedulePageLoaderData>;
} {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const data = new Promise<SchedulePageLoaderData>(async resolve => {
    const eventServiceConfigResult = await loadEventServiceConfig(slug);

    if (eventServiceConfigResult.type === 'notFound') {
      throw new Response('Not Found', { status: 404 });
    }

    const scheduleListServiceConfig = await loadScheduleListServiceConfig(
      eventServiceConfigResult.config.event._id!
    );

    resolve({
      eventServiceConfig: eventServiceConfigResult.config,
      scheduleListServiceConfig,
    });
  });

  return {
    slug,
    data,
  };
}

export function SchedulePage({ eventDetailsPagePath }: SchedulePageProps) {
  const { slug, data } = useLoaderData<typeof schedulePageLoader>();

  return (
    <React.Suspense key={slug} fallback={<ScheduleSkeleton />}>
      <Await resolve={data}>
        {({ eventServiceConfig, scheduleListServiceConfig }) => (
          <div className="wix-verticals-container">
            <Schedule
              eventServiceConfig={eventServiceConfig}
              scheduleListServiceConfig={scheduleListServiceConfig}
              eventDetailsPagePath={eventDetailsPagePath}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
