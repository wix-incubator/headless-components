import '../styles/theme-1.css';
import { type TicketListServiceConfig, type EventServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { TicketsPicker } from '../components/events/TicketsPicker';

interface TicketsPickerPageProps {
  ticketsServiceConfig: TicketListServiceConfig;
  eventServiceConfig: EventServiceConfig;
}

export default function TicketsPickerPage({
  ticketsServiceConfig,
  eventServiceConfig,
}: TicketsPickerPageProps) {
  console.log(eventServiceConfig);
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <TicketsPicker ticketsServiceConfig={ticketsServiceConfig} eventServiceConfig={eventServiceConfig} />
      </div>
    </KitchensinkLayout>
  );
}
