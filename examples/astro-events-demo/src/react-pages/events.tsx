import { type EventListServiceConfig } from '@wix/events/services';
import { EventList } from '../components/events/EventList';

interface EventsPageProps {
  eventListServiceConfig: EventListServiceConfig;
  eventDetailsPagePath: string;
}

export default function EventsPage({
  eventListServiceConfig,
  eventDetailsPagePath,
}: EventsPageProps) {
  return (
    <div className="bg-background min-h-screen">
      <EventList
        eventListServiceConfig={eventListServiceConfig}
        eventDetailsPagePath={eventDetailsPagePath}
      />
    </div>
  );
}
