import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
  type CheckoutServiceConfig,
  type ScheduleListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  eventsPagePath: string;
  formPagePath: string;
}

export default function EventDetailsPage({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
  checkoutServiceConfig,
  scheduleListServiceConfig,
  eventsPagePath,
  formPagePath,
}: EventDetailsPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <EventDetails
          eventServiceConfig={eventServiceConfig}
          eventListServiceConfig={eventListServiceConfig}
          ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
          checkoutServiceConfig={checkoutServiceConfig}
          scheduleListServiceConfig={scheduleListServiceConfig}
          eventsPagePath={eventsPagePath}
          formPagePath={formPagePath}
        />
      </div>
    </KitchensinkLayout>
  );
}
