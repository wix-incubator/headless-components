import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketListServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketListServiceConfig: TicketListServiceConfig;
}

export default function EventDetailsPage({
  eventServiceConfig,
  eventListServiceConfig,
  ticketListServiceConfig,
}: EventDetailsPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <EventDetails
          eventServiceConfig={eventServiceConfig}
          eventListServiceConfig={eventListServiceConfig}
          ticketListServiceConfig={ticketListServiceConfig}
        />
      </div>
    </KitchensinkLayout>
  );
}
