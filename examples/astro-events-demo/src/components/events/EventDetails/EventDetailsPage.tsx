import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
  type ScheduleListServiceConfig,
  type OccurrenceListServiceConfig,
  loadEventServiceConfig,
  loadEventListServiceConfig,
  loadTicketDefinitionListServiceConfig,
  loadScheduleListServiceConfig,
  loadOccurrenceListServiceConfig,
} from '@wix/events/services';
import React from 'react';
import {
  Await,
  useLoaderData,
  type LoaderFunctionArgs,
} from 'react-router-dom';
import { EventDetails } from './EventDetails';
import { EventDetailsSkeleton } from './EventDetailsSkeleton';

interface EventDetailsPageLoaderData {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  occurrenceListServiceConfig: OccurrenceListServiceConfig;
}

interface EventDetailsPageProps {
  eventDetailsPagePath: string;
  formPagePath: string;
  schedulePagePath: string;
  thankYouPagePath: string;
}

export function eventDetailsPageLoader({
  params: { slug },
}: LoaderFunctionArgs): {
  slug: string;
  data: Promise<EventDetailsPageLoaderData>;
} {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const data = new Promise<EventDetailsPageLoaderData>(async resolve => {
    const [eventServiceConfigResult, eventListServiceConfig] =
      await Promise.all([
        loadEventServiceConfig(slug),
        loadEventListServiceConfig(),
      ]);

    if (eventServiceConfigResult.type === 'notFound') {
      throw new Response('Not Found', { status: 404 });
    }

    const eventId = eventServiceConfigResult.config.event._id!;
    const recurringCategoryId =
      eventServiceConfigResult.config.event.dateAndTimeSettings?.recurringEvents
        ?.categoryId ?? undefined;

    const [
      ticketDefinitionListServiceConfig,
      scheduleListServiceConfig,
      occurrenceListServiceConfig,
    ] = await Promise.all([
      loadTicketDefinitionListServiceConfig(eventId),
      loadScheduleListServiceConfig(eventId, 2),
      loadOccurrenceListServiceConfig(recurringCategoryId),
    ]);

    resolve({
      eventServiceConfig: eventServiceConfigResult.config,
      eventListServiceConfig,
      ticketDefinitionListServiceConfig,
      scheduleListServiceConfig,
      occurrenceListServiceConfig,
    });
  });

  return {
    slug,
    data,
  };
}

export function EventDetailsPage({
  eventDetailsPagePath,
  formPagePath,
  schedulePagePath,
  thankYouPagePath,
}: EventDetailsPageProps) {
  const { slug, data } = useLoaderData<typeof eventDetailsPageLoader>();

  return (
    <React.Suspense key={slug} fallback={<EventDetailsSkeleton />}>
      <Await resolve={data}>
        {({
          eventServiceConfig,
          eventListServiceConfig,
          ticketDefinitionListServiceConfig,
          scheduleListServiceConfig,
          occurrenceListServiceConfig,
        }) => (
          <div className="wix-verticals-container">
            <EventDetails
              eventServiceConfig={eventServiceConfig}
              eventListServiceConfig={eventListServiceConfig}
              ticketDefinitionListServiceConfig={
                ticketDefinitionListServiceConfig
              }
              checkoutServiceConfig={{
                thankYouPageUrl: `${window.location.origin}${thankYouPagePath.replace(':slug', slug)}`,
                noTicketDefinitionsSelectedError: 'Select a ticket',
              }}
              scheduleListServiceConfig={scheduleListServiceConfig}
              occurrenceListServiceConfig={occurrenceListServiceConfig}
              eventDetailsPagePath={eventDetailsPagePath}
              formPagePath={formPagePath}
              schedulePagePath={schedulePagePath}
            />
          </div>
        )}
      </Await>
    </React.Suspense>
  );
}
