import '../styles/theme-1.css';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { EventList } from '../components/events/EventList';

interface EventsPageProps {}

export default function EventsPage({}: EventsPageProps) {
  return (
    <KitchensinkLayout>
      <EventList />
    </KitchensinkLayout>
  );
}
