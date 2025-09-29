import '../styles/theme-1.css';
import {
  type EventServiceConfig,
  type OrderServiceConfig,
} from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { ThankYou } from '../components/events/ThankYou';

interface ThankYouPageProps {
  eventServiceConfig: EventServiceConfig;
  orderServiceConfig?: OrderServiceConfig;
  eventPageUrl: string;
}

export default function ThankYouPage({
  eventServiceConfig,
  orderServiceConfig,
  eventPageUrl,
}: ThankYouPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <ThankYou
          eventServiceConfig={eventServiceConfig}
          orderServiceConfig={orderServiceConfig}
          eventPageUrl={eventPageUrl}
        />
      </div>
    </KitchensinkLayout>
  );
}
