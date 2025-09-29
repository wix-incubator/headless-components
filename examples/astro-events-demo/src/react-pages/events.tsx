import { type EventListServiceConfig } from '@wix/headless-events/services';
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
    <div className="bg-background">
      <EventList
        eventListServiceConfig={eventListServiceConfig}
        eventDetailsPagePath={eventDetailsPagePath}
      />
    </div>
  );
}
