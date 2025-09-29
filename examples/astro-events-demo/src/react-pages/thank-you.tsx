import { type EventServiceConfig } from '@wix/events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { ThankYou } from '../components/events/ThankYou';

interface ThankYouPageProps {
  eventServiceConfig: EventServiceConfig;
  eventPageUrl: string;
}

export default function ThankYouPage({
  eventServiceConfig,
  eventPageUrl,
}: ThankYouPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <ThankYou
          eventServiceConfig={eventServiceConfig}
          eventPageUrl={eventPageUrl}
        />
      </div>
    </KitchensinkLayout>
  );
}
