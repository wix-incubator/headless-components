import {
  TicketsPicker as TicketsPickerPrimitive,
  TicketDefinition as TicketDefinitionPrimitive,
} from '@wix/headless-events/react';
import { type TicketListServiceConfig } from '@wix/headless-events/services';

interface TicketsPickerProps {
  ticketsServiceConfig: TicketListServiceConfig;
}

export function TicketsPicker({ ticketsServiceConfig }: TicketsPickerProps) {
  return (
    <TicketsPickerPrimitive.Root ticketsServiceConfig={ticketsServiceConfig}>
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
            {/* Ticket Name */}
            <div className="p-4">
              <TicketDefinitionPrimitive.Name className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" />
              <TicketDefinitionPrimitive.Price className="text-sm text-gray-600 mb-4" />
            </div>

            {/* Select Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-auto">
              Select Ticket
            </button>
          </div>
        </TicketsPickerPrimitive.TicketDefinitionRepeater>
      </TicketsPickerPrimitive.TicketDefinitions>
    </TicketsPickerPrimitive.Root>
  );
}
