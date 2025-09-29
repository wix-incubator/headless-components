import { type EventListServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventList } from '../components/events/EventList';

interface EventsPageProps {
  eventListServiceConfig: EventListServiceConfig;
  eventsPagePath: string;
}

export default function EventsPage({
  eventListServiceConfig,
  eventsPagePath,
}: EventsPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto p-10">
        <EventList
          eventListServiceConfig={eventListServiceConfig}
          eventsPagePath={eventsPagePath}
        />
      </div>
    </KitchensinkLayout>
  );
}
