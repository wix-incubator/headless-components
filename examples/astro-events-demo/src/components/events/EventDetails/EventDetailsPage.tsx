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
import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import { EventDetails } from './EventDetails';

interface EventDetailsPageLoaderData {
  slug: string;
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

export async function eventDetailsPageLoader({
  params: { slug },
}: LoaderFunctionArgs): Promise<EventDetailsPageLoaderData> {
  if (!slug) {
    throw new Error('Event slug is required');
  }

  const [eventServiceConfigResult, eventListServiceConfig] = await Promise.all([
    loadEventServiceConfig(slug),
    loadEventListServiceConfig(),
  ]);

  if (eventServiceConfigResult.type === 'notFound') {
    throw new Response('Not Found', { status: 404 });
  }

  const eventId = eventServiceConfigResult.config.event._id!;
  const recurringCategoryId = eventServiceConfigResult.config.event
    .dateAndTimeSettings?.recurringEvents?.categoryId as string | undefined;

  const [
    ticketDefinitionListServiceConfig,
    scheduleListServiceConfig,
    occurrenceListServiceConfig,
  ] = await Promise.all([
    loadTicketDefinitionListServiceConfig(eventId),
    loadScheduleListServiceConfig(eventId, 2),
    loadOccurrenceListServiceConfig(recurringCategoryId),
  ]);

  return {
    slug,
    eventServiceConfig: eventServiceConfigResult.config,
    eventListServiceConfig,
    ticketDefinitionListServiceConfig,
    scheduleListServiceConfig,
    occurrenceListServiceConfig,
  };
}

export function EventDetailsPage({
  eventDetailsPagePath,
  formPagePath,
  schedulePagePath,
  thankYouPagePath,
}: EventDetailsPageProps) {
  const {
    slug,
    eventServiceConfig,
    eventListServiceConfig,
    ticketDefinitionListServiceConfig,
    scheduleListServiceConfig,
    occurrenceListServiceConfig,
  } = useLoaderData<typeof eventDetailsPageLoader>();

  return (
    <EventDetails
      key={slug}
      eventServiceConfig={eventServiceConfig}
      eventListServiceConfig={eventListServiceConfig}
      ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
      checkoutServiceConfig={{
        thankYouPageUrl:
          typeof window !== 'undefined'
            ? `${window.location.origin}${thankYouPagePath.replace(':slug', slug)}`
            : '',
        noTicketDefinitionsSelectedError: 'Select a ticket',
      }}
      scheduleListServiceConfig={scheduleListServiceConfig}
      occurrenceListServiceConfig={occurrenceListServiceConfig}
      eventDetailsPagePath={eventDetailsPagePath}
      formPagePath={formPagePath}
      schedulePagePath={schedulePagePath}
    />
  );
}
