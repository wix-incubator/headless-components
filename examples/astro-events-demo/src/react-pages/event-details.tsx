import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
  type CheckoutServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/events/services';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventDetailsPagePath: string;
  formPagePath: string;
}

export default function EventDetailsPage({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
  checkoutServiceConfig,
  // scheduleListServiceConfig,
  eventDetailsPagePath,
  formPagePath,
}: EventDetailsPageProps) {
  return (
    <div className="bg-background">
      <EventDetails
        eventServiceConfig={eventServiceConfig}
        eventListServiceConfig={eventListServiceConfig}
        ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
        checkoutServiceConfig={checkoutServiceConfig}
        // scheduleListServiceConfig={scheduleListServiceConfig}
        eventDetailsPagePath={eventDetailsPagePath}
        formPagePath={formPagePath}
      />
    </div>
  );
}
