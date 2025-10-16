import {
  type EventServiceConfig,
  type ScheduleListServiceConfig,
  loadEventServiceConfig,
  loadScheduleListServiceConfig,
} from '@wix/events/services';
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { Schedule } from './Schedule';

interface SchedulePageLoaderData {
  slug: string;
  eventServiceConfig: EventServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}

interface SchedulePageProps {
  eventDetailsPagePath: string;
}

export async function schedulePageLoader({
  params: { slug },
}: LoaderFunctionArgs): Promise<SchedulePageLoaderData> {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const eventServiceConfigResult = await loadEventServiceConfig({ slug });

  if (eventServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  const scheduleListServiceConfig = await loadScheduleListServiceConfig({
    eventId: eventServiceConfigResult.config.event._id!,
  });

  return {
    slug,
    eventServiceConfig: eventServiceConfigResult.config,
    scheduleListServiceConfig,
  };
}

export function SchedulePage({ eventDetailsPagePath }: SchedulePageProps) {
  const { slug, eventServiceConfig, scheduleListServiceConfig } =
    useLoaderData<typeof schedulePageLoader>();

  return (
    <Schedule
      key={slug}
      eventServiceConfig={eventServiceConfig}
      scheduleListServiceConfig={scheduleListServiceConfig}
      eventDetailsPagePath={eventDetailsPagePath}
    />
  );
}
