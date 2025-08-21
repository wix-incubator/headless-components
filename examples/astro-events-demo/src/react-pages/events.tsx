import '../styles/theme-1.css';
import { type EventListServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventList } from '../components/events/EventList';

interface EventsPageProps {
  eventListServiceConfig: EventListServiceConfig;
}

export default function EventsPage({
  eventListServiceConfig,
}: EventsPageProps) {
  return (
    <KitchensinkLayout>
      <EventList eventListServiceConfig={eventListServiceConfig} />
    </KitchensinkLayout>
  );
}
