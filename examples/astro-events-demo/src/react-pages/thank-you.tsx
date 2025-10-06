import {
  type EventServiceConfig,
  type OrderServiceConfig,
} from '@wix/events/services';
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
    <div className="bg-background min-h-screen">
      <ThankYou
        eventServiceConfig={eventServiceConfig}
        orderServiceConfig={orderServiceConfig}
        eventPageUrl={eventPageUrl}
      />
    </div>
  );
}
