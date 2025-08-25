import {
  TicketsPicker as TicketsPickerPrimitive,
  TicketDefinition as TicketDefinitionPrimitive,
} from '@wix/headless-events/react';
import { type TicketListServiceConfig, type EventServiceConfig } from '@wix/headless-events/services';
import { useService } from '@wix/services-manager-react';
import { TicketListServiceDefinition } from '@wix/headless-events/services';

interface TicketsPickerProps {
  ticketsServiceConfig: TicketListServiceConfig;
  eventServiceConfig: EventServiceConfig;
}

export function TicketsPicker({ ticketsServiceConfig, eventServiceConfig }: TicketsPickerProps) {
  return (
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
        {({ isLoading, error, checkout, hasSelectedTickets }: { isLoading: any, error: any, checkout: any, hasSelectedTickets: any }) => {
          const service = useService(TicketListServiceDefinition);
          const selectedQuantities = service.selectedQuantities.get();
          const ticketDefinitions = service.ticketDefinitions.get();

          let total = 0;
          let currency = 'USD';
          if (ticketDefinitions.length > 0) {
            currency = ticketDefinitions[0].pricingMethod?.fixedPrice?.currency ?? 'USD';
            for (const [id, qty] of Object.entries(selectedQuantities)) {
              if (qty > 0) {
                const td = ticketDefinitions.find(t => t._id === id);
                if (td && td.pricingMethod?.fixedPrice) {
                  total += parseFloat(td.pricingMethod.fixedPrice.value ?? '0') * qty;
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
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors
                  ${isLoading || !hasSelectedTickets ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          );
        }}
      </TicketsPickerPrimitive.Checkout>
    </TicketsPickerPrimitive.Root>
  );
}
