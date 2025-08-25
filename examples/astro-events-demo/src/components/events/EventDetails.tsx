import { Event as EventPrimitive, TicketsPicker as TicketsPickerPrimitive, TicketDefinition as TicketDefinitionPrimitive } from '@wix/headless-events/react';
import { type TicketListServiceConfig, type EventServiceConfig } from '@wix/headless-events/services';

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
            <EventPrimitive.Description className="mt-6 text-gray-700" />
          </div>
          <div className="order-1 md:order-2">
            <EventPrimitive.Image className="w-full h-96 object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </EventPrimitive.Root>
      <TicketsPickerPrimitive.Root ticketsServiceConfig={ticketsServiceConfig} eventServiceConfig={eventServiceConfig}>
        <TicketsPickerPrimitive.TicketDefinitions
          className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-6"
          emptyState={
            <div className="text-center text-white py-12">
              <p className="text-xl">No tickets available</p>
              <p className="text-sm mt-2">
                Check back later for available tickets!
              </p>
            </div>
          }
        >
          <TicketsPickerPrimitive.TicketDefinitionRepeater>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <div className="p-4 flex-grow">
                <TicketDefinitionPrimitive.Name className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" />
                <TicketDefinitionPrimitive.Description className="text-sm text-gray-500 mb-3 line-clamp-3" />
                <TicketDefinitionPrimitive.Price className="text-base font-medium text-gray-900 mb-2" />
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>Remaining: <TicketDefinitionPrimitive.Remaining /></span>
                  <TicketDefinitionPrimitive.SoldOut className="text-red-600 font-medium" />
                </div>
              </div>
              <div className="p-4 border-t mt-auto">
                <TicketDefinitionPrimitive.Quantity />
              </div>
            </div>
          </TicketsPickerPrimitive.TicketDefinitionRepeater>
        </TicketsPickerPrimitive.TicketDefinitions>
        <TicketsPickerPrimitive.Checkout noTicketsErrorMessage="Please select at least one ticket">
          {({ isLoading, error, checkout }) => (
            <div className="p-6 flex justify-center">
              {error && <p className="text-red-600 mb-4">{error}</p>}
              <button
                onClick={checkout}
                disabled={isLoading}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          )}
        </TicketsPickerPrimitive.Checkout>
      </TicketsPickerPrimitive.Root>
    </div>
  );
}
