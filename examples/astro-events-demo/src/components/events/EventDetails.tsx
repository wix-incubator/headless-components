import {
  Event as EventPrimitive,
  TicketsPicker as TicketsPickerPrimitive,
  TicketDefinition as TicketDefinitionPrimitive,
  PricingOption as PricingOptionPrimitive,
} from '@wix/headless-events/react';
import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
} from '@wix/headless-events/services';
import { EventList } from './EventList';

interface EventDetailsProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
}

export function EventDetails({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
}: EventDetailsProps) {
  const currentEventId = eventServiceConfig.event._id;
  const otherUpcomingEvents = eventListServiceConfig.events
    .filter(
      event => event._id !== currentEventId && event.status === 'UPCOMING'
    )
    .slice(0, 3);

  return (
    <EventPrimitive.Root event={eventServiceConfig.event}>
      <div className="min-h-screen bg-surface-primary">
        <div className="max-w-5xl mx-auto p-15">
          <EventPrimitive.Title
            asChild
            className="text-6xl font-bold text-content-primary mb-4"
          >
            <h1 />
          </EventPrimitive.Title>

          <div className="flex gap-1 font-light text-content-primary mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18.5 19H5.5C5.224 19 5 18.775 5 18.5V10H19V18.5C19 18.775 18.776 19 18.5 19ZM5.5 6H7V7H8V6H16V7H17V6H18.5C18.776 6 19 6.225 19 6.5V9H5V6.5C5 6.225 5.224 6 5.5 6ZM18.5 5H17V4H16V5H8V4H7V5H5.5C4.673 5 4 5.673 4 6.5V18.5C4 19.327 4.673 20 5.5 20H18.5C19.327 20 20 19.327 20 18.5V6.5C20 5.673 19.327 5 18.5 5Z"
              />
            </svg>
            <EventPrimitive.Date format="short" />
          </div>

          <div className="flex gap-1 font-light text-content-primary">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C15.86 3 19 6.14 19 9.999L18.992 10.499C18.855 13.26 16.864 16.637 13.072 20.544C12.786 20.838 12.405 21 12 21L11.8494 20.9925C11.5012 20.9574 11.1783 20.8012 10.928 20.544C7.136 16.637 5.146 13.26 5.008 10.499H5.002L5.001 10.333C5.001 10.286 5 10.241 5 10.194L5.001 10.139L5 9.999C5 6.14 8.14 3 12 3ZM12 4C8.813 4 6.199 6.497 6.011 9.637L6 10.194C6 11.945 6.98 15.041 11.646 19.847C11.742 19.946 11.867 20 12 20C12.133 20 12.259 19.946 12.355 19.847C17.021 15.04 18 11.945 18 10.194L17.989 9.637C17.801 6.497 15.187 4 12 4ZM11.4184 7.0558C12.4064 6.8698 13.4184 7.1758 14.1214 7.8788C14.8244 8.5828 15.1324 9.5928 14.9444 10.5828C14.7194 11.7698 13.7704 12.7188 12.5824 12.9448C12.3914 12.9808 12.1994 12.9988 12.0084 12.9988C11.2134 12.9988 10.4464 12.6888 9.8794 12.1218C9.1754 11.4188 8.8674 10.4088 9.0554 9.4178C9.2804 8.2288 10.2304 7.2798 11.4184 7.0558ZM12.0024 8.0008C11.8704 8.0008 11.7374 8.0128 11.6044 8.0388C10.8284 8.1848 10.1844 8.8288 10.0374 9.6038C9.9104 10.2788 10.1094 10.9388 10.5864 11.4148C11.0614 11.8898 11.7204 12.0888 12.3964 11.9618C13.1714 11.8148 13.8154 11.1708 13.9624 10.3968C14.0904 9.7218 13.8904 9.0628 13.4144 8.5858C13.0324 8.2048 12.5324 8.0008 12.0024 8.0008Z"
              />
            </svg>
            <EventPrimitive.Location format="short" />
          </div>

          <EventPrimitive.ShortDescription className="block max-w-2xl mt-6 font-light text-content-primary" />

          <EventPrimitive.RsvpButton
            asChild
            className="inline-block btn-primary font-light py-3 px-8 mt-10"
          >
            {({ event }) => (
              <a
                href={
                  event.registration?.type === 'TICKETING'
                    ? '#tickets'
                    : `/events/${event.slug}/form`
                }
              >
                {event.registration?.type === 'TICKETING'
                  ? 'Buy Tickets'
                  : 'RSVP'}
              </a>
            )}
          </EventPrimitive.RsvpButton>
        </div>

        <EventPrimitive.Image className="aspect-16/9 object-cover" />

        <div className="max-w-5xl mx-auto p-15">
          <div className="mb-15">
            <h2 className="text-3xl font-light text-content-primary mb-4">
              Time & Location
            </h2>
            <EventPrimitive.Date
              className="block font-light text-content-primary"
              format="full"
            />
            <EventPrimitive.Location
              className="block font-light text-content-primary"
              format="full"
            />
          </div>

          <div className="mb-15">
            <h2 className="text-3xl font-light text-content-primary mb-4">
              About the Event
            </h2>
            <EventPrimitive.Description
              customStyles={{
                p: {
                  color: 'var(--theme-text-content)',
                },
              }}
            />
          </div>

          <TicketsPickerPrimitive.Root
            ticketDefinitionListServiceConfig={
              ticketDefinitionListServiceConfig
            }
            eventServiceConfig={eventServiceConfig}
          >
            <TicketsPickerPrimitive.TicketDefinitions className="space-y-6 mb-6">
              <h2
                id="tickets"
                className="text-3xl font-light text-content-primary mb-6"
              >
                Tickets
              </h2>
              <TicketsPickerPrimitive.TicketDefinitionRepeater>
                <div className="border border-gray-200 p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="border-r border-gray-200">
                      <div className="text-sm font-light text-content-primary">
                        Ticket type
                      </div>
                      <TicketDefinitionPrimitive.Name className="font-light text-content-primary" />
                      <TicketDefinitionPrimitive.SaleStartDate
                        asChild
                        className="block font-light text-content-primary"
                      >
                        {({ startDateFormatted }) => (
                          <span>Sale starts on: {startDateFormatted}</span>
                        )}
                      </TicketDefinitionPrimitive.SaleStartDate>
                      <TicketDefinitionPrimitive.SaleEndDate
                        asChild
                        className="block font-light text-content-primary"
                      >
                        {({ endDateFormatted, saleEnded }) => (
                          <span>
                            {saleEnded ? 'Sale ended on' : 'Sale ends on'}:{' '}
                            {endDateFormatted}
                          </span>
                        )}
                      </TicketDefinitionPrimitive.SaleEndDate>
                    </div>
                    <div className="flex items-center gap-2 mb-5 w-full justify-between">
                      <div>
                        <TicketDefinitionPrimitive.FixedPricing className="font-medium text-content-primary" />
                        <TicketDefinitionPrimitive.GuestPricing className="border border-gray-200 font-medium text-content-primary py-2 px-2" />
                      </div>
                      <TicketDefinitionPrimitive.Quantity className="block min-w-24 border border-gray-300 text-content-secondary p-2" />
                      <TicketDefinitionPrimitive.PricingOptions className="flex flex-col w-full">
                        <TicketDefinitionPrimitive.PricingOptionRepeater>
                          <div className="flex items-center gap-2 mb-5 w-full justify-between">
                            <div>
                              <PricingOptionPrimitive.Name className="text-content-primary" />{' '}
                              <PricingOptionPrimitive.Pricing className="text-content-primary" />
                            </div>
                            <PricingOptionPrimitive.Quantity className="block min-w-24 border border-gray-300 text-content-secondary p-2" />
                          </div>
                        </TicketDefinitionPrimitive.PricingOptionRepeater>
                      </TicketDefinitionPrimitive.PricingOptions>
                    </div>
                  </div>
                </div>
              </TicketsPickerPrimitive.TicketDefinitionRepeater>
            </TicketsPickerPrimitive.TicketDefinitions>
            <TicketsPickerPrimitive.CheckoutError asChild>
              {({ error }) => (
                <div className="mb-6 p-4 bg-status-danger-medium border border-status-danger text-center">
                  <p className="font-light text-status-error">{error}</p>
                </div>
              )}
            </TicketsPickerPrimitive.CheckoutError>
            <TicketsPickerPrimitive.CheckoutTrigger asChild>
              {({ isLoading, hasSelectedTicketDefinitions, checkout }) => (
                <button
                  className={`block font-light py-3 px-20 ml-auto ${
                    isLoading || !hasSelectedTicketDefinitions
                      ? 'bg-gray-300 text-content-faded'
                      : 'btn-primary'
                  }`}
                  disabled={isLoading || !hasSelectedTicketDefinitions}
                  onClick={checkout}
                >
                  {isLoading ? 'Processing...' : 'Checkout'}
                </button>
              )}
            </TicketsPickerPrimitive.CheckoutTrigger>
          </TicketsPickerPrimitive.Root>
        </div>

        <div className="bg-surface-interactive-hover">
          <div className="max-w-5xl mx-auto p-15">
            <h2 className="text-3xl font-light text-content-primary mb-8">
              You might also like
            </h2>
            <EventList
              eventListServiceConfig={{
                events: otherUpcomingEvents,
                pageSize: 3,
                currentPage: 0,
                totalPages: 1,
              }}
            />
          </div>
        </div>
      </div>
    </EventPrimitive.Root>
  );
}
