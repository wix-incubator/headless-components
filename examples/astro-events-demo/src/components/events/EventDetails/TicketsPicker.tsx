import {
  TicketsPicker as TicketsPickerPrimitive,
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
  TicketDefinitionDescription,
} from '@/components/ui/events';
import {
  type EventServiceConfig,
  type TicketDefinitionListServiceConfig,
  type CheckoutServiceConfig,
} from '@wix/events/services';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TicketsPickerProps {
  eventServiceConfig: EventServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
}

export function TicketsPicker({
  eventServiceConfig,
  ticketDefinitionListServiceConfig,
  checkoutServiceConfig,
}: TicketsPickerProps) {
  return (
    <TicketsPickerPrimitive
      eventServiceConfig={eventServiceConfig}
      ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
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
          <TicketDefinition />
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
    </TicketsPickerPrimitive>
  );
}

function TicketDefinition() {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  return (
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
        <div className="group-data-[has-description=false]/ticket-definition:hidden mt-3">
          <Button
            data-open={isDescriptionOpen}
            variant="link"
            className="p-0 h-auto gap-1 [&_svg]:size-6 data-[open=true]:mb-2"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          >
            <span>More info</span>
            {isDescriptionOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8.14644661,14.858836 C7.95118446,14.6635739 7.95118446,14.3469914 8.14644661,14.1517292 L12.4989857,9.79289322 L16.8573469,14.1517292 C17.052609,14.3469914 17.052609,14.6635739 16.8573469,14.858836 C16.6620847,15.0540981 16.3455022,15.0540981 16.1502401,14.858836 L12.4989857,11.2071068 L8.85355339,14.858836 C8.65829124,15.0540981 8.34170876,15.0540981 8.14644661,14.858836 Z"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M8.14644661,10.1464466 C8.34170876,9.95118446 8.65829124,9.95118446 8.85355339,10.1464466 L12.4989857,13.7981758 L16.1502401,10.1464466 C16.3455022,9.95118446 16.6620847,9.95118446 16.8573469,10.1464466 C17.052609,10.3417088 17.052609,10.6582912 16.8573469,10.8535534 L12.4989857,15.2123894 L8.14644661,10.8535534 C7.95118446,10.6582912 7.95118446,10.3417088 8.14644661,10.1464466 Z"
                />
              </svg>
            )}
          </Button>
          {isDescriptionOpen && <TicketDefinitionDescription />}
        </div>
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
            {({ name, rate, included, taxValue, formattedTaxValue }) => (
              <span>
                {included
                  ? `${name} included`
                  : taxValue === 0
                    ? `+${rate}% ${name}`
                    : `+${formattedTaxValue} ${name}`}
              </span>
            )}
          </TicketDefinitionTax>
          <TicketDefinitionFee asChild>
            {({ value, formattedValue }) => (
              <span>
                {value === 0
                  ? `+Ticket service fee`
                  : `+${formattedValue} ticket service fee`}
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
                    {({ name, included, formattedTaxValue }) => (
                      <span>
                        {included
                          ? `${name} included`
                          : `+${formattedTaxValue} ${name}`}
                      </span>
                    )}
                  </PricingOptionTax>
                  <PricingOptionFee asChild>
                    {({ formattedValue }) => (
                      <span>{`+${formattedValue} ticket service fee`}</span>
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
                        onValueChange={value => setQuantity(Number(value))}
                      >
                        <SelectTrigger className="min-w-24 w-full sm:w-auto">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map(String).map(option => (
                            <SelectItem key={option} value={option}>
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
                  {options.map(String).map(option => (
                    <SelectItem key={option} value={option}>
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
  );
}
