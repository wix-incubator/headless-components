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
    </TicketsPickerPrimitive.Root>
  );
}
