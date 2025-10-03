import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
  type CheckoutServiceConfig,
  type ScheduleListServiceConfig,
  type OccurrenceListServiceConfig,
} from '@wix/events/services';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  occurrenceListServiceConfig?: OccurrenceListServiceConfig;
  eventDetailsPagePath: string;
  formPagePath: string;
  schedulePagePath: string;
}

export default function EventDetailsPage({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
  checkoutServiceConfig,
  scheduleListServiceConfig,
  occurrenceListServiceConfig,
  eventDetailsPagePath,
  formPagePath,
  schedulePagePath,
}: EventDetailsPageProps) {
  return (
    <div className="bg-background">
      <EventDetails
        eventServiceConfig={eventServiceConfig}
        eventListServiceConfig={eventListServiceConfig}
        ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
        checkoutServiceConfig={checkoutServiceConfig}
        scheduleListServiceConfig={scheduleListServiceConfig}
        occurrenceListServiceConfig={occurrenceListServiceConfig}
        eventDetailsPagePath={eventDetailsPagePath}
        formPagePath={formPagePath}
        schedulePagePath={schedulePagePath}
      />
    </div>
  );
}
