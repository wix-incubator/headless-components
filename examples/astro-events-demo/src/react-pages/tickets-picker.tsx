import '../styles/theme-1.css';
import { type TicketListServiceConfig } from '@wix/headless-events/services';
import { KitchensinkLayout } from '../layouts/KitchensinkLayout';
import { TicketsPicker } from '../components/events/TicketsPicker';

interface TicketsPickerPageProps {
  ticketsServiceConfig: TicketListServiceConfig;
}

export default function TicketsPickerPage({
  ticketsServiceConfig,
}: TicketsPickerPageProps) {
  return (
    <KitchensinkLayout>
      <div className="max-w-7xl mx-auto">
        <TicketsPicker ticketsServiceConfig={ticketsServiceConfig} />
      </div>
    </KitchensinkLayout>
  );
}
