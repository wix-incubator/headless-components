import {
  Event as EventPrimitive,
  TicketsPicker as TicketsPickerPrimitive,
  TicketDefinition as TicketDefinitionPrimitive,
} from '@wix/headless-events/react';
import {
  TicketListServiceDefinition,
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketListServiceConfig,
} from '@wix/headless-events/services';
import { useService } from '@wix/services-manager-react';

interface EventDetailsProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketListServiceConfig: TicketListServiceConfig;
}

export function EventDetails({
  eventServiceConfig,
  // eventListServiceConfig,
  ticketListServiceConfig,
}: EventDetailsProps) {
  const EventInfo = () => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Event Info</h3>
        <table className="w-full text-left">
          <tbody>
            <tr>
              <th className="pr-4 py-2 font-medium text-gray-900">Date:</th>
              <td className="py-2">
                <EventPrimitive.Date />
              </td>
            </tr>
            <tr>
              <th className="pr-4 py-2 font-medium text-gray-900">Location:</th>
              <td className="py-2">
                <EventPrimitive.Location format="full" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // const currentEventId = eventServiceConfig.event._id;
  // const otherEvents = eventListServiceConfig.events.filter(
  //   e => e._id !== currentEventId
  // );
  // const otherEventListConfig = { events: otherEvents };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <EventPrimitive.Root event={eventServiceConfig.event}>
        <div className="mb-4">
          <EventPrimitive.Image className="w-full h-96 object-cover rounded-lg shadow-md" />
        </div>
        <EventPrimitive.Title className="text-3xl font-bold text-gray-900 mb-4" />
        <EventPrimitive.ShortDescription className="text-gray-700 mb-8" />
        <EventInfo />
      </EventPrimitive.Root>
      <TicketsPickerPrimitive.Root
        ticketListServiceConfig={ticketListServiceConfig}
        eventServiceConfig={eventServiceConfig}
      >
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
                  <span>
                    Remaining: <TicketDefinitionPrimitive.Remaining />
                  </span>
                  <TicketDefinitionPrimitive.SoldOut className="text-red-600 font-medium" />
                </div>
              </div>
              <div className="p-4 border-t mt-auto">
                <TicketDefinitionPrimitive.Quantity asChild>
                  {({ quantity, maxQuantity, increment, decrement }) => (
                    <div className="flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                      <button
                        onClick={decrement}
                        disabled={quantity === 0}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        disabled={quantity >= maxQuantity || maxQuantity === 0}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </TicketDefinitionPrimitive.Quantity>
              </div>
            </div>
          </TicketsPickerPrimitive.TicketDefinitionRepeater>
        </TicketsPickerPrimitive.TicketDefinitions>
        <TicketsPickerPrimitive.Checkout noTicketsErrorMessage="Please select at least one ticket">
          {({ isLoading, error, checkout, hasSelectedTickets }) => {
            const service = useService(TicketListServiceDefinition);
            const selectedQuantities = service.selectedQuantities.get();
            const ticketDefinitions = service.ticketDefinitions.get();

            let total = 0;
            let currency = 'USD';
            if (ticketDefinitions.length > 0) {
              currency =
                ticketDefinitions[0].pricingMethod?.fixedPrice?.currency ??
                'USD';
              for (const [id, qty] of Object.entries(selectedQuantities)) {
                if (qty > 0) {
                  const td = ticketDefinitions.find(t => t._id === id);
                  if (td && td.pricingMethod?.fixedPrice) {
                    total +=
                      parseFloat(td.pricingMethod.fixedPrice.value ?? '0') *
                      qty;
                  }
                }
              }
            }

            return (
              <div className="p-6 flex flex-col items-center">
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <p className="text-lg font-bold mb-4">
                  Total: {total.toFixed(2)} {currency}
                </p>
                <button
                  onClick={checkout}
                  disabled={isLoading || !hasSelectedTickets}
                  className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${isLoading || !hasSelectedTickets ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            );
          }}
        </TicketsPickerPrimitive.Checkout>
      </TicketsPickerPrimitive.Root>
      {/* <div className="my-8">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Other Events</h3>
        <EventList.Root eventListServiceConfig={otherEventListConfig}>
          <EventList.Events
            emptyState={
              <p className="text-center text-gray-600 py-8">
                No other events available
              </p>
            }
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <EventList.EventRepeater>
              <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                <EventPrimitive.Image className="h-48 w-full object-cover" />
                <div className="p-4">
                  <EventPrimitive.Title className="font-bold text-lg text-gray-900 mb-1" />
                  <EventPrimitive.Date className="text-sm text-gray-600 mb-1" />
                  <EventPrimitive.Location
                    className="text-sm text-gray-600"
                    format="full"
                  />
                </div>
              </div>
            </EventList.EventRepeater>
          </EventList.Events>
        </EventList.Root>
      </div> */}
    </div>
  );
}
