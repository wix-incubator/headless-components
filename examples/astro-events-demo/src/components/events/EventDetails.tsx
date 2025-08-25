import { Event as EventPrimitive } from '@wix/headless-events/react';
import { type TicketListServiceConfig, type EventServiceConfig, EventServiceDefinition } from '@wix/headless-events/services';
import { useService } from '@wix/services-manager-react';
import { TicketsPicker } from './TicketsPicker';

interface EventDetailsProps {
  eventServiceConfig: EventServiceConfig;
  ticketsServiceConfig: TicketListServiceConfig;
}

export function EventDetails({ eventServiceConfig, ticketsServiceConfig }: EventDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <EventPrimitive.Root event={eventServiceConfig.event}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="order-2 md:order-1">
            <EventPrimitive.Title className="text-3xl font-bold text-gray-900 mb-4" />
            <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                <EventPrimitive.Date />
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <EventPrimitive.Location />
              </div>
            </div>
            <RegistrationStatus />
            <EventPrimitive.Description className="mt-6 text-gray-700" />
          </div>
          <div className="order-1 md:order-2">
            <EventPrimitive.Image className="w-full h-96 object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </EventPrimitive.Root>
      <TicketsPicker
        ticketsServiceConfig={ticketsServiceConfig}
        eventServiceConfig={eventServiceConfig}
      />
    </div>
  );
}

function RegistrationStatus() {
  const service = useService(EventServiceDefinition);
  const event = service.event.get();
  const status = event.registration?.status ?? 'Unknown';

  let displayStatus = status.toLowerCase();
  let statusColor = 'text-gray-500';
  if (status === 'OPEN') {
    statusColor = 'text-green-600';
    displayStatus = 'Open';
  } else if (status === 'CLOSED') {
    statusColor = 'text-red-600';
    displayStatus = 'Closed';
  }

  return (
    <div className={`text-sm font-medium ${statusColor}`}>
      Registration: {displayStatus}
    </div>
  );
}
