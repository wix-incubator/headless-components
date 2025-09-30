import {
  Event,
  EventType,
  EventImage,
  EventTitle,
  EventDate,
  EventLocation,
  EventAddToGoogleCalendar,
  EventAddToIcsCalendar,
  Order,
  OrderGuestEmail,
  OrderCreatedDate,
  OrderNumber,
  OrderDownloadTicketsButton,
  OrderInvoiceItems,
  OrderInvoiceItemRepeater,
  OrderSubtotal,
  OrderPaidPlanDiscount,
  OrderCouponDiscount,
  OrderTax,
  OrderFee,
  OrderTotal,
  InvoiceItemName,
  InvoiceItemPrice,
  InvoiceItemQuantity,
  InvoiceItemTotal,
} from '@/components/ui/events';
import {
  type EventServiceConfig,
  type OrderServiceConfig,
} from '@wix/events/services';
import { EventSocialShare } from './EventSocialShare';

interface ThankYouProps {
  eventServiceConfig: EventServiceConfig;
  orderServiceConfig?: OrderServiceConfig;
  eventPageUrl: string;
}

export function ThankYou({
  eventServiceConfig,
  orderServiceConfig,
  eventPageUrl,
}: ThankYouProps) {
  return (
    <div className="max-w-5xl mx-auto px-5 py-6">
      <a
        href="/"
        className="flex items-center gap-1 underline font-paragraph text-foreground mb-10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M15.0712 4.99995L15.7783 5.70706L9.41365 12.0703L15.7783 18.435L15.0712 19.1421L8.00015 12.071L15.0712 4.99995Z"
          />
        </svg>
        Back to site
      </a>
      <Event event={eventServiceConfig.event}>
        <Order orderServiceConfig={orderServiceConfig}>
          <div className="mb-10">
            <h1 className="text-xl sm:text-3xl font-heading text-foreground mb-1">
              Thank you!
            </h1>
            <EventType asChild>
              {({ ticketed, rsvp }) => {
                if (rsvp) {
                  return (
                    <p className="font-paragraph text-foreground">
                      An email with the event's details was sent to you.
                    </p>
                  );
                }

                if (ticketed) {
                  return (
                    <OrderGuestEmail asChild>
                      {({ guestEmail }) => (
                        <p>
                          {`The ticket is on the way to your email: ${guestEmail}`}
                        </p>
                      )}
                    </OrderGuestEmail>
                  );
                }
              }}
            </EventType>
          </div>
          <div className="border border-foreground/10">
            <div className="flex gap-6 p-6 border-b border-foreground/10">
              <EventImage className="w-40 h-24" />
              <div className="flex flex-row justify-between w-full">
                <div>
                  <EventTitle variant="lg" className="mb-3" />
                  <div className="flex gap-1 items-center mb-1">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        className="text-foreground"
                        fill="currentColor"
                        d="M14.5 16H5.5C5.224 16 5 15.776 5 15.5V9H15V15.5C15 15.776 14.776 16 14.5 16ZM5.5 6H14.5C14.776 6 15 6.224 15 6.5V8H5V6.5C5 6.224 5.224 6 5.5 6ZM14.5 5H14.001V4H13.001V5H7.001V4H6.001V5H5.5C4.673 5 4 5.673 4 6.5V15.5C4 16.327 4.673 17 5.5 17H14.5C15.327 17 16 16.327 16 15.5V6.5C16 5.673 15.327 5 14.5 5Z"
                      />
                    </svg>
                    <EventDate format="short" />
                  </div>
                  <div className="flex gap-1 items-center">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <path
                        className="text-foreground"
                        fill="currentColor"
                        d="M10.5 3C13.532 3 16 5.468 16 8.5V8.65C16 10.808 14.512 13.455 11.578 16.516C11.292 16.815 10.909 16.979 10.5 16.979C10.09 16.979 9.707 16.815 9.421 16.516C6.487 13.455 5 10.808 5 8.65L5.002 8.5C5 5.468 7.467 3 10.5 3ZM10.5 4C8.018 4 6 6.019 6 8.5V8.601C6 10.515 7.433 12.996 10.143 15.824C10.335 16.024 10.665 16.024 10.856 15.824C13.566 12.996 15 10.515 15 8.65L14.998 8.515C14.999 7.298 14.531 6.168 13.681 5.318C12.832 4.469 11.702 4 10.5 4ZM10.0153 6.0463C10.8453 5.8893 11.6843 6.1473 12.2713 6.7343C12.8543 7.3183 13.1093 8.1573 12.9533 8.9773C12.7653 9.9643 11.9743 10.7533 10.9843 10.9403C10.8253 10.9713 10.6653 10.9853 10.5073 10.9853C9.8423 10.9853 9.2013 10.7273 8.7283 10.2523C8.1443 9.6683 7.8893 8.8303 8.0453 8.0103C8.2333 7.0223 9.0253 6.2333 10.0153 6.0463ZM10.5003 7.0003C10.4013 7.0003 10.3013 7.0093 10.2003 7.0283C9.6203 7.1383 9.1383 7.6193 9.0283 8.1963C8.9323 8.6993 9.0813 9.1903 9.4353 9.5463C9.7933 9.9043 10.2913 10.0543 10.7983 9.9583C11.3793 9.8483 11.8613 9.3683 11.9713 8.7903C12.0673 8.2883 11.9183 7.7963 11.5633 7.4413C11.2773 7.1543 10.9003 7.0003 10.5003 7.0003Z"
                      />
                    </svg>
                    <EventLocation format="short" />
                  </div>
                </div>
                <EventType asChild>
                  {({ ticketed }) => {
                    if (ticketed) {
                      return (
                        <OrderDownloadTicketsButton className="h-fit" asChild>
                          {({ ticketsPdfUrl }) => (
                            <button
                              onClick={() =>
                                window.open(ticketsPdfUrl, '_blank')
                              }
                            >
                              Download Tickets
                            </button>
                          )}
                        </OrderDownloadTicketsButton>
                      );
                    }
                  }}
                </EventType>
              </div>
            </div>
            <div className="flex justify-between p-6">
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-foreground">Add to</span>
                <EventAddToGoogleCalendar
                  asChild
                  className="underline hover:no-underline"
                >
                  <a>Google Calendar</a>
                </EventAddToGoogleCalendar>
                <EventAddToIcsCalendar
                  asChild
                  className="underline hover:no-underline"
                >
                  <a>iCal</a>
                </EventAddToIcsCalendar>
                <EventAddToIcsCalendar
                  asChild
                  className="underline hover:no-underline"
                >
                  <a>Outlook</a>
                </EventAddToIcsCalendar>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-paragraph text-foreground">Share on</span>
                <EventSocialShare eventPageUrl={eventPageUrl} />
              </div>
            </div>
            <EventType asChild>
              {({ ticketed }) => {
                if (ticketed) {
                  return (
                    <>
                      <OrderInvoiceItems className="px-6 border-y border-foreground/10">
                        <div className="flex border-b border-foreground/10 py-4 font-paragraph text-foreground">
                          <div className="w-[35%]">Ticket type</div>
                          <div className="w-[25%]">Price</div>
                          <div className="w-[15%]">Quantity</div>
                          <div className="w-[25%] text-right">Total</div>
                        </div>
                        <OrderInvoiceItemRepeater>
                          <div className="flex border-b border-foreground/10 py-4">
                            <InvoiceItemName className="w-[35%]" />
                            <InvoiceItemPrice className="w-[25%]" />
                            <InvoiceItemQuantity className="w-[15%]" />
                            <InvoiceItemTotal className="w-[25%] text-right" />
                          </div>
                        </OrderInvoiceItemRepeater>
                        <div className="flex flex-row justify-end">
                          <div className="w-[40%]">
                            <div className="flex flex-col py-5 border-b border-foreground/10">
                              <OrderSubtotal
                                asChild
                                className="flex justify-between"
                              >
                                {({ formattedAmount }) => (
                                  <div>
                                    <span>Subtotal</span>
                                    <span>{formattedAmount}</span>
                                  </div>
                                )}
                              </OrderSubtotal>
                              <OrderPaidPlanDiscount
                                asChild
                                className="flex justify-between"
                              >
                                {({ formattedAmount, rate }) => (
                                  <div>
                                    <span>Paid Plan Discount ({rate}%)</span>
                                    <span>-{formattedAmount}</span>
                                  </div>
                                )}
                              </OrderPaidPlanDiscount>
                              <OrderCouponDiscount
                                asChild
                                className="flex justify-between"
                              >
                                {({ formattedAmount }) => (
                                  <div>
                                    <span>Coupon Discount</span>
                                    <span>-{formattedAmount}</span>
                                  </div>
                                )}
                              </OrderCouponDiscount>
                              <OrderTax
                                asChild
                                className="flex justify-between"
                              >
                                {({ rate, formattedAmount, name }) => (
                                  <div>
                                    <span>
                                      {name} ({rate}%)
                                    </span>
                                    <span>{formattedAmount}</span>
                                  </div>
                                )}
                              </OrderTax>
                              <OrderFee
                                asChild
                                className="flex justify-between"
                              >
                                {({ formattedAmount, rate }) => (
                                  <div>
                                    <span>Ticket Service Fee ({rate}%)</span>
                                    <span>{formattedAmount}</span>
                                  </div>
                                )}
                              </OrderFee>
                            </div>
                            <OrderTotal
                              asChild
                              className="flex justify-between py-5"
                            >
                              {({ formattedAmount }) => (
                                <div>
                                  <span>Total</span>
                                  <span>{formattedAmount}</span>
                                </div>
                              )}
                            </OrderTotal>
                          </div>
                        </div>
                      </OrderInvoiceItems>
                      <div className="flex flex-row items-center px-6 py-3 gap-1">
                        <OrderNumber asChild>
                          {({ orderNumber }) => (
                            <span>Order No. #{orderNumber}</span>
                          )}
                        </OrderNumber>
                        <OrderCreatedDate asChild>
                          {({ formattedDate }) => (
                            <span>Placed on: {formattedDate}</span>
                          )}
                        </OrderCreatedDate>
                      </div>
                    </>
                  );
                }
              }}
            </EventType>
          </div>
        </Order>
      </Event>
    </div>
  );
}
