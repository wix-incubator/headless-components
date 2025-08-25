import '../styles/theme-1.css';
import { type TicketListServiceConfig, type EventServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventDetails } from '../components/events/EventDetails';

interface EventDetailsPageProps {
  ticketsServiceConfig: TicketListServiceConfig;
  eventServiceConfig: EventServiceConfig;
}

export default function EventDetailsPage({
  ticketsServiceConfig,
  eventServiceConfig,
}: EventDetailsPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <EventDetails
          ticketsServiceConfig={ticketsServiceConfig}
          eventServiceConfig={eventServiceConfig}
        />
      </div>
    </KitchensinkLayout>
  );
}
