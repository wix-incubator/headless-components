import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
}

export default function EventDetailsPage({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
}: EventDetailsPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <EventDetails
          eventServiceConfig={eventServiceConfig}
          eventListServiceConfig={eventListServiceConfig}
          ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
        />
      </div>
    </KitchensinkLayout>
  );
}
