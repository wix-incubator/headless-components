import {
  type EventServiceConfig,
  type EventListServiceConfig,
  type TicketDefinitionListServiceConfig,
  type CheckoutServiceConfig,
  type ScheduleListServiceConfig,
  type OccurrenceListServiceConfig,
} from '@wix/events/services';
import { useState } from 'react';

import {
  Event,
  EventSlug,
  EventDate,
  EventDescription,
  EventImage,
  EventLocation,
  EventRsvpButton,
  EventShortDescription,
  EventTitle,
  EventOtherEvents,
  TicketsPicker,
  TicketsPickerTotals,
  TicketDefinitions,
  TicketDefinitionRepeater,
  TicketDefinitionName,
  TicketDefinitionFixedPricing,
  TicketDefinitionGuestPricing,
  TicketDefinitionTax,
  TicketDefinitionFee,
  TicketDefinitionPricingRange,
  TicketDefinitionPricingOptions,
  TicketDefinitionPricingOptionRepeater,
  TicketDefinitionSaleStartDate,
  TicketDefinitionSaleEndDate,
  TicketDefinitionQuantity,
  TicketDefinitionBadge,
  PricingOptionName,
  PricingOptionPricing,
  PricingOptionTax,
  PricingOptionFee,
  PricingOptionQuantity,
  CheckoutError,
  CheckoutTrigger,
  ScheduleList,
  ScheduleListItems,
  ScheduleListItemRepeater,
} from '@/components/ui/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNavigation } from '@/components/NavigationContext';
import { EventList } from '../EventList';
import { EventSocialShare } from '../EventSocialShare';
import { ScheduleItem } from '../Schedule';
import { OccurrencesModal } from './OccurrencesModal';

interface EventDetailsProps {
  eventServiceConfig: EventServiceConfig;
  eventListServiceConfig: EventListServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
  scheduleListServiceConfig: ScheduleListServiceConfig;
  occurrenceListServiceConfig: OccurrenceListServiceConfig;
  eventDetailsPagePath: string;
  formPagePath: string;
  schedulePagePath: string;
}

export function EventDetails({
  eventServiceConfig,
  eventListServiceConfig,
  ticketDefinitionListServiceConfig,
  checkoutServiceConfig,
  scheduleListServiceConfig,
  occurrenceListServiceConfig,
  eventDetailsPagePath,
  formPagePath,
  schedulePagePath,
}: EventDetailsProps) {
  const Navigation = useNavigation();

  const [isOccurrencesModalOpen, setIsOccurrencesModalOpen] = useState(false);

  const openOccurrencesModal = () => {
    setIsOccurrencesModalOpen(true);
  };

  const closeOccurrencesModal = () => {
    setIsOccurrencesModalOpen(false);
  };

  const navigateToEventDetails = (slug: string) => {
    window.location.href = eventDetailsPagePath.replace(':slug', slug);
  };

  return (
    <Event
      event={eventServiceConfig.event}
      eventListServiceConfig={eventListServiceConfig}
      occurrenceListServiceConfig={occurrenceListServiceConfig}
      className="group/event"
    >
      {/* Mobile Image Section */}
      <div className="relative w-full pt-[56.25%] group-data-[has-image=false]/event:hidden block sm:hidden">
        <EventImage className="absolute top-0 w-full h-full" />
      </div>

      {/* Header Section */}
      <div className="max-w-5xl mx-auto px-5 py-6 sm:p-16">
        <EventTitle asChild variant="xl" className="mb-2">
          <h1 />
        </EventTitle>
        <div className="flex items-center gap-1 mb-1">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              className="text-foreground"
              fill="currentColor"
              d="M18.5 19H5.5C5.224 19 5 18.775 5 18.5V10H19V18.5C19 18.775 18.776 19 18.5 19ZM5.5 6H7V7H8V6H16V7H17V6H18.5C18.776 6 19 6.225 19 6.5V9H5V6.5C5 6.225 5.224 6 5.5 6ZM18.5 5H17V4H16V5H8V4H7V5H5.5C4.673 5 4 5.673 4 6.5V18.5C4 19.327 4.673 20 5.5 20H18.5C19.327 20 20 19.327 20 18.5V6.5C20 5.673 19.327 5 18.5 5Z"
            />
          </svg>
          <EventDate />
        </div>
        <div className="flex items-center gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              className="text-foreground"
              fill="currentColor"
              d="M12 3C15.86 3 19 6.14 19 9.999L18.992 10.499C18.855 13.26 16.864 16.637 13.072 20.544C12.786 20.838 12.405 21 12 21L11.8494 20.9925C11.5012 20.9574 11.1783 20.8012 10.928 20.544C7.136 16.637 5.146 13.26 5.008 10.499H5.002L5.001 10.333C5.001 10.286 5 10.241 5 10.194L5.001 10.139L5 9.999C5 6.14 8.14 3 12 3ZM12 4C8.813 4 6.199 6.497 6.011 9.637L6 10.194C6 11.945 6.98 15.041 11.646 19.847C11.742 19.946 11.867 20 12 20C12.133 20 12.259 19.946 12.355 19.847C17.021 15.04 18 11.945 18 10.194L17.989 9.637C17.801 6.497 15.187 4 12 4ZM11.4184 7.0558C12.4064 6.8698 13.4184 7.1758 14.1214 7.8788C14.8244 8.5828 15.1324 9.5928 14.9444 10.5828C14.7194 11.7698 13.7704 12.7188 12.5824 12.9448C12.3914 12.9808 12.1994 12.9988 12.0084 12.9988C11.2134 12.9988 10.4464 12.6888 9.8794 12.1218C9.1754 11.4188 8.8674 10.4088 9.0554 9.4178C9.2804 8.2288 10.2304 7.2798 11.4184 7.0558ZM12.0024 8.0008C11.8704 8.0008 11.7374 8.0128 11.6044 8.0388C10.8284 8.1848 10.1844 8.8288 10.0374 9.6038C9.9104 10.2788 10.1094 10.9388 10.5864 11.4148C11.0614 11.8898 11.7204 12.0888 12.3964 11.9618C13.1714 11.8148 13.8154 11.1708 13.9624 10.3968C14.0904 9.7218 13.8904 9.0628 13.4144 8.5858C13.0324 8.2048 12.5324 8.0008 12.0024 8.0008Z"
            />
          </svg>
          <EventLocation />
        </div>
        <EventShortDescription className="max-w-2xl mt-5 sm:mt-6" />
        <EventRsvpButton
          asChild
          size="lg"
          className="mt-6 sm:mt-10 w-full sm:w-auto"
        >
          {({ ticketed, slug }) => (
            <Navigation
              route={
                ticketed ? '#tickets' : formPagePath.replace(':slug', slug)
              }
            >
              {ticketed ? 'Buy Tickets' : 'RSVP'}
            </Navigation>
          )}
        </EventRsvpButton>
      </div>

      {/* Desktop Image Section */}
      <div className="relative w-full pt-[56.25%] group-data-[has-image=false]/event:hidden hidden sm:block">
        <EventImage className="absolute top-0 w-full h-full" />
      </div>

      <div className="max-w-6xl mx-auto py-6 sm:py-16 group-data-[has-image=false]/event:sm:pt-0">
        <div className="max-w-5xl mx-auto px-5 sm:px-16">
          {/* Time & Location Section */}
          <div>
            <h2 className="text-xl sm:text-3xl font-heading text-foreground mb-3 sm:mb-4">
              Time & Location
            </h2>
            <div className="flex gap-4 flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <EventDate format="full" />
                <EventLocation format="full" />
              </div>
              <Button
                variant="outline"
                className="group-data-[has-occurrences=false]/event:hidden"
                onClick={openOccurrencesModal}
              >
                Select Different Date
              </Button>
            </div>
          </div>

          {/* About the Event Section */}
          <div className="mt-6 sm:mt-16 group-data-[has-description=false]/event:hidden">
            <h2 className="text-xl sm:text-3xl font-heading text-foreground mb-3 sm:mb-4">
              About the Event
            </h2>
            <EventDescription />
          </div>

          {/* Schedule Section */}
          <ScheduleList scheduleListServiceConfig={scheduleListServiceConfig}>
            <ScheduleListItems className="mt-6 sm:mt-16">
              <h2 className="text-xl sm:text-3xl font-heading text-foreground mb-4">
                Schedule
              </h2>
              <ScheduleListItemRepeater className="border border-foreground/10 p-5 sm:py-8 sm:px-6 mb-4">
                <ScheduleItem />
              </ScheduleListItemRepeater>
              <div className="flex sm:justify-end">
                <EventSlug>
                  {({ slug }) => (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Navigation
                        route={schedulePagePath.replace(':slug', slug)}
                      >
                        See All
                      </Navigation>
                    </Button>
                  )}
                </EventSlug>
              </div>
            </ScheduleListItems>
          </ScheduleList>

          {/* Tickets Section */}
          <TicketsPicker
            eventServiceConfig={eventServiceConfig}
            ticketDefinitionListServiceConfig={
              ticketDefinitionListServiceConfig
            }
            checkoutServiceConfig={checkoutServiceConfig}
          >
            <TicketDefinitions className="mt-6 sm:mt-16">
              <h2
                id="tickets"
                className="text-xl sm:text-3xl font-heading text-foreground mb-4 sm:mb-8"
              >
                Tickets
              </h2>
              <TicketDefinitionRepeater className="group/ticket-definition border border-foreground/10 p-5 sm:p-8 mt-5 sm:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                  <div className="md:border-r border-foreground/10">
                    <div className="text-sm font-paragraph text-foreground">
                      Ticket type
                    </div>
                    <TicketDefinitionName />
                    <TicketDefinitionSaleStartDate asChild className="mt-3">
                      {({ startDateFormatted }) => (
                        <div>
                          <div>Goes on sale</div>
                          <div>{startDateFormatted}</div>
                        </div>
                      )}
                    </TicketDefinitionSaleStartDate>
                    <TicketDefinitionSaleEndDate
                      asChild
                      className="mt-3 group-data-[sale-ended=true]/ticket-definition:hidden"
                    >
                      {({ endDateFormatted }) => (
                        <div>
                          <div>Sale ends</div>
                          <div>{endDateFormatted}</div>
                        </div>
                      )}
                    </TicketDefinitionSaleEndDate>
                  </div>
                  <div className="flex flex-col gap-3 sm:gap-8 sm:flex-row sm:justify-between">
                    <div className="flex-grow">
                      <div className="text-sm font-paragraph text-foreground group-data-[guest-pricing=true]/ticket-definition:hidden">
                        Price
                      </div>
                      <div className="text-sm font-paragraph text-foreground mb-2 group-data-[guest-pricing=false]/ticket-definition:hidden">
                        Write a price
                      </div>
                      <TicketDefinitionFixedPricing />
                      <TicketDefinitionGuestPricing asChild>
                        <Input />
                      </TicketDefinitionGuestPricing>
                      <TicketDefinitionPricingRange asChild>
                        {({ formattedMinPrice, formattedMaxPrice }) => (
                          <span>
                            {formattedMinPrice === formattedMaxPrice
                              ? formattedMinPrice
                              : `From ${formattedMinPrice} to ${formattedMaxPrice}`}
                          </span>
                        )}
                      </TicketDefinitionPricingRange>
                      <TicketDefinitionTax asChild>
                        {({
                          name,
                          rate,
                          included,
                          taxAmount,
                          formattedTaxAmount,
                        }) => (
                          <span>
                            {included
                              ? `${name} included`
                              : taxAmount === 0
                                ? `+${rate}% ${name}`
                                : `+${formattedTaxAmount} ${name}`}
                          </span>
                        )}
                      </TicketDefinitionTax>
                      <TicketDefinitionFee asChild>
                        {({ amount, formattedAmount }) => (
                          <span>
                            {amount === 0
                              ? `+Ticket service fee`
                              : `+${formattedAmount} ticket service fee`}
                          </span>
                        )}
                      </TicketDefinitionFee>
                      <TicketDefinitionPricingOptions>
                        <TicketDefinitionPricingOptionRepeater>
                          <Separator className="my-4 sm:my-6" />
                          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                            <div>
                              <PricingOptionName />
                              <PricingOptionPricing />
                              <PricingOptionTax asChild>
                                {({ name, included, formattedTaxAmount }) => (
                                  <span>
                                    {included
                                      ? `${name} included`
                                      : `+${formattedTaxAmount} ${name}`}
                                  </span>
                                )}
                              </PricingOptionTax>
                              <PricingOptionFee asChild>
                                {({ formattedAmount }) => (
                                  <span>
                                    {`+${formattedAmount} ticket service fee`}
                                  </span>
                                )}
                              </PricingOptionFee>
                            </div>
                            <div className="group-data-[available=false]/ticket-definition:hidden">
                              <div className="text-sm font-paragraph text-foreground mb-2">
                                Quantity
                              </div>
                              <PricingOptionQuantity asChild>
                                {({ options, quantity, setQuantity }) => (
                                  <Select
                                    value={String(quantity)}
                                    onValueChange={value =>
                                      setQuantity(Number(value))
                                    }
                                  >
                                    <SelectTrigger className="min-w-24 w-full sm:w-auto">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {options.map(option => (
                                        <SelectItem
                                          key={option}
                                          value={String(option)}
                                        >
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              </PricingOptionQuantity>
                            </div>
                          </div>
                        </TicketDefinitionPricingOptionRepeater>
                      </TicketDefinitionPricingOptions>
                    </div>
                    <div className="group-data-[available=false]/ticket-definition:hidden group-data-[pricing-options=true]/ticket-definition:hidden">
                      <div className="text-sm font-paragraph text-foreground mb-2">
                        Quantity
                      </div>
                      <TicketDefinitionQuantity asChild>
                        {({ options, quantity, setQuantity }) => (
                          <Select
                            value={String(quantity)}
                            onValueChange={value => setQuantity(Number(value))}
                          >
                            <SelectTrigger className="min-w-24 w-full sm:w-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map(option => (
                                <SelectItem key={option} value={String(option)}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TicketDefinitionQuantity>
                    </div>
                    <TicketDefinitionBadge
                      label="Sold Out"
                      className="group-data-[sold-out=false]/ticket-definition:hidden"
                    />
                    <TicketDefinitionBadge
                      label="Sale ended"
                      className="group-data-[sale-ended=false]/ticket-definition:hidden"
                    />
                  </div>
                </div>
              </TicketDefinitionRepeater>
            </TicketDefinitions>
            <CheckoutError asChild>
              {({ error }) => (
                <div className="bg-status-danger-medium border border-status-danger text-center mt-5 sm:mt-6 p-2 sm:p-4">
                  {error}
                </div>
              )}
            </CheckoutError>
            <div className="w-full sm:w-2/5 ml-auto mt-3">
              <TicketsPickerTotals asChild>
                {({
                  total,
                  subtotal,
                  tax,
                  fee,
                  formattedTotal,
                  formattedSubtotal,
                  formattedTax,
                  formattedFee,
                  taxName,
                  taxRate,
                }) => (
                  <div>
                    {subtotal !== total && (
                      <div className="flex justify-between text-base">
                        <span>Subtotal</span>
                        <span>{formattedSubtotal}</span>
                      </div>
                    )}
                    {tax !== 0 && (
                      <div className="flex justify-between text-base mt-1">
                        <span>
                          {taxName} ({taxRate}%)
                        </span>
                        <span>{formattedTax}</span>
                      </div>
                    )}
                    {fee !== 0 && (
                      <div className="flex justify-between text-base mt-1">
                        <span>Ticket service fee</span>
                        <span>{formattedFee}</span>
                      </div>
                    )}
                    {subtotal !== total && <Separator className="mt-3 mb-2" />}
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>{formattedTotal}</span>
                    </div>
                  </div>
                )}
              </TicketsPickerTotals>
              <CheckoutTrigger
                size="lg"
                className="mt-3 w-full"
                label="Checkout"
                loadingState="Processing..."
              />
            </div>
          </TicketsPicker>
        </div>

        {/* Map Section */}
        <EventLocation asChild>
          {({ latitude, longitude }) =>
            latitude && longitude ? (
              <div className="mt-6 sm:mt-16 sm:px-16">
                <div className="relative w-full pt-[56.25%] sm:pt-[32%]">
                  <iframe
                    allowFullScreen
                    className="absolute top-0 w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`}
                  />
                </div>
              </div>
            ) : null
          }
        </EventLocation>

        {/* Social Share Section */}
        <div className="max-w-5xl mx-auto mt-6 sm:mt-16 px-5 sm:px-16">
          <h2 className="text-xl sm:text-3xl font-heading text-foreground mb-3 sm:mb-4">
            Share this event
          </h2>
          <EventSocialShare />
        </div>
      </div>

      {/* Other Events Section */}
      <EventOtherEvents>
        {({ events }) => (
          <div className="bg-secondary">
            <div className="max-w-6xl mx-auto px-5 py-6 sm:p-16">
              <h2 className="text-xl sm:text-3xl font-heading text-secondary-foreground mb-4 sm:mb-8">
                You might also like
              </h2>
              <EventList
                eventListServiceConfig={{
                  events,
                  categories: [],
                  pageSize: events.length,
                  currentPage: 0,
                  totalPages: 1,
                }}
                eventDetailsPagePath={eventDetailsPagePath}
                isFiltersVisible={false}
              />
            </div>
          </div>
        )}
      </EventOtherEvents>

      {isOccurrencesModalOpen ? (
        <EventSlug>
          {({ slug }) => (
            <OccurrencesModal
              currentOccurrenceSlug={slug}
              occurrenceListServiceConfig={occurrenceListServiceConfig}
              onDone={navigateToEventDetails}
              onClose={closeOccurrencesModal}
            />
          )}
        </EventSlug>
      ) : null}
    </Event>
  );
}
