import '../styles/theme-1.css';
import { type EventServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { ThankYou } from '../components/events/ThankYou';

interface ThankYouPageProps {
  eventServiceConfig: EventServiceConfig;
}

export default function ThankYouPage({
  eventServiceConfig,
}: ThankYouPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <ThankYou eventServiceConfig={eventServiceConfig} />
      </div>
    </KitchensinkLayout>
  );
}
