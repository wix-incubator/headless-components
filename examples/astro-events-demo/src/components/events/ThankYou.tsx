import {
  Event as EventPrimitive,
  Order as OrderPrimitive,
  InvoiceItem as InvoiceItemPrimitive,
} from '@wix/headless-events/react';
import {
  type EventServiceConfig,
  type OrderServiceConfig,
} from '@wix/headless-events/services';

interface ThankYouProps {
  eventServiceConfig: EventServiceConfig;
  orderServiceConfig: OrderServiceConfig;
  eventPageUrl: string;
}

export function ThankYou({
  eventServiceConfig,
  orderServiceConfig,
  eventPageUrl,
}: ThankYouProps) {
  return (
    <div className="min-h-screen bg-surface-primary">
      <div className="max-w-5xl mx-auto p-15">
        <a
          href="/"
          className="flex items-center gap-1 underline font-light text-content-primary mb-10"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15.0712 4.99995L15.7783 5.70706L9.41365 12.0703L15.7783 18.435L15.0712 19.1421L8.00015 12.071L15.0712 4.99995Z"
            />
          </svg>
          Back to site
        </a>
        <div className="mb-10">
          <h1 className="text-3xl font-light text-content-primary mb-1">
            Thank you!
          </h1>
          <p className="font-light text-content-primary">
            An email with the event's details was sent to you.
          </p>
        </div>
        <EventPrimitive.Root event={eventServiceConfig.event}>
          <div className="border border-gray-300">
            <div className="flex gap-6 p-6 border-b border-gray-300">
              <EventPrimitive.Image
                width={140}
                height={80}
                className="object-cover"
              />
              <div>
                <EventPrimitive.Title className="block text-xl font-light text-content-primary mb-3" />
                <div className="flex gap-1 font-light text-sm text-content-primary mb-1">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M14.5 16H5.5C5.224 16 5 15.776 5 15.5V9H15V15.5C15 15.776 14.776 16 14.5 16ZM5.5 6H14.5C14.776 6 15 6.224 15 6.5V8H5V6.5C5 6.224 5.224 6 5.5 6ZM14.5 5H14.001V4H13.001V5H7.001V4H6.001V5H5.5C4.673 5 4 5.673 4 6.5V15.5C4 16.327 4.673 17 5.5 17H14.5C15.327 17 16 16.327 16 15.5V6.5C16 5.673 15.327 5 14.5 5Z"
                    />
                  </svg>
                  <EventPrimitive.Date format="short" />
                </div>
                <div className="flex gap-1 font-light text-sm text-content-primary">
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M10.5 3C13.532 3 16 5.468 16 8.5V8.65C16 10.808 14.512 13.455 11.578 16.516C11.292 16.815 10.909 16.979 10.5 16.979C10.09 16.979 9.707 16.815 9.421 16.516C6.487 13.455 5 10.808 5 8.65L5.002 8.5C5 5.468 7.467 3 10.5 3ZM10.5 4C8.018 4 6 6.019 6 8.5V8.601C6 10.515 7.433 12.996 10.143 15.824C10.335 16.024 10.665 16.024 10.856 15.824C13.566 12.996 15 10.515 15 8.65L14.998 8.515C14.999 7.298 14.531 6.168 13.681 5.318C12.832 4.469 11.702 4 10.5 4ZM10.0153 6.0463C10.8453 5.8893 11.6843 6.1473 12.2713 6.7343C12.8543 7.3183 13.1093 8.1573 12.9533 8.9773C12.7653 9.9643 11.9743 10.7533 10.9843 10.9403C10.8253 10.9713 10.6653 10.9853 10.5073 10.9853C9.8423 10.9853 9.2013 10.7273 8.7283 10.2523C8.1443 9.6683 7.8893 8.8303 8.0453 8.0103C8.2333 7.0223 9.0253 6.2333 10.0153 6.0463ZM10.5003 7.0003C10.4013 7.0003 10.3013 7.0093 10.2003 7.0283C9.6203 7.1383 9.1383 7.6193 9.0283 8.1963C8.9323 8.6993 9.0813 9.1903 9.4353 9.5463C9.7933 9.9043 10.2913 10.0543 10.7983 9.9583C11.3793 9.8483 11.8613 9.3683 11.9713 8.7903C12.0673 8.2883 11.9183 7.7963 11.5633 7.4413C11.2773 7.1543 10.9003 7.0003 10.5003 7.0003Z"
                    />
                  </svg>
                  <EventPrimitive.Location format="short" />
                </div>
              </div>
            </div>
            <EventPrimitive.Type asChild>
              {({ ticketed, rsvp, external }) => {
                if (rsvp) {
                  return (
                    <div className="flex justify-between p-6">
                      <div className="flex items-center gap-3 font-light text-content-primary">
                        <span>Add to</span>
                        <EventPrimitive.AddToGoogleCalendar
                          asChild
                          className="underline"
                        >
                          <a>Google Calendar</a>
                        </EventPrimitive.AddToGoogleCalendar>
                        <EventPrimitive.AddToIcsCalendar
                          asChild
                          className="underline"
                        >
                          <a>iCal</a>
                        </EventPrimitive.AddToIcsCalendar>
                        <EventPrimitive.AddToIcsCalendar
                          asChild
                          className="underline"
                        >
                          <a>Outlook</a>
                        </EventPrimitive.AddToIcsCalendar>
                      </div>
                      <div className="flex items-center gap-3 font-light text-content-primary">
                        <span>Share on</span>
                        <EventPrimitive.FacebookShare
                          asChild
                          eventPageUrl={eventPageUrl}
                        >
                          <a>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M12 3C16.9706 3 21 7.02943 21 12C21 16.4922 17.7088 20.2155 13.4062 20.8907V14.6016H15.5033L15.9023 12H13.4062V10.3117C13.4062 9.60001 13.7549 8.90625 14.8729 8.90625H16.0078V6.69141C16.0078 6.69141 14.9779 6.51562 13.9932 6.51562C11.9374 6.51562 10.5938 7.76156 10.5938 10.0172V12H8.30859V14.6016H10.5938V20.8907C6.29117 20.2155 3 16.4922 3 12C3 7.02943 7.02943 3 12 3Z"
                              />
                            </svg>
                          </a>
                        </EventPrimitive.FacebookShare>
                        <EventPrimitive.LinkedInShare
                          asChild
                          eventPageUrl={eventPageUrl}
                        >
                          <a>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M18 4C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H18ZM8 10H6V17H8V10ZM12 10H10V17H12V13.5L12.0069 13.3555C12.0796 12.5949 12.7203 12 13.5 12C14.2797 12 14.9204 12.5949 14.9931 13.3555L15 13.5V17H17V13L16.9949 12.8237C16.9037 11.2489 15.5977 10 14 10C13.3085 10 12.6717 10.2339 12.1643 10.627L12.0001 10.7638L12 10ZM7 7C6.44772 7 6 7.44772 6 8C6 8.55228 6.44772 9 7 9C7.55228 9 8 8.55228 8 8C8 7.44772 7.55228 7 7 7Z"
                              />
                            </svg>
                          </a>
                        </EventPrimitive.LinkedInShare>
                        <EventPrimitive.XShare
                          asChild
                          eventPageUrl={eventPageUrl}
                        >
                          <a>
                            <svg width="24" height="24" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M4.53657 5L10.3279 12.7218L4.5 19H5.81163L10.9139 13.5034L15.0365 19H19.5L13.3828 10.8438L18.8074 5H17.4958L12.7968 10.0623L9.00009 5H4.53657ZM6.46542 5.96344H8.51597L17.5709 18.0364H15.5203L6.46542 5.96344Z"
                              />
                            </svg>
                          </a>
                        </EventPrimitive.XShare>
                      </div>
                    </div>
                  );
                } else if (ticketed) {
                  return (
                    <OrderPrimitive.Root
                      orderServiceConfig={orderServiceConfig}
                    >
                      <div className="flex justify-between p-6 font-light text-content-primary border-b border-gray-300 items-center">
                        <EventPrimitive.AddToGoogleCalendar
                          asChild
                          className="underline"
                        >
                          <a>Add to Calendar</a>
                        </EventPrimitive.AddToGoogleCalendar>
                        <OrderPrimitive.DownloadTicketsButton asChild>
                          {({ ticketsPdfUrl, isVisible }) =>
                            isVisible && (
                              <button
                                className="block font-light py-3 px-20 ml-auto btn-primary"
                                onClick={() =>
                                  window.open(ticketsPdfUrl, '_blank')
                                }
                              >
                                Download Tickets
                              </button>
                            )
                          }
                        </OrderPrimitive.DownloadTicketsButton>
                      </div>
                      <OrderPrimitive.InvoiceItems className="px-6 border-b border-gray-300">
                        <div className="flex border-b border-gray-200 py-4 font-light text-content-primary">
                          <div className="w-[35%]">Ticket type</div>
                          <div className="w-[25%]">Price</div>
                          <div className="w-[15%]">Quantity</div>
                          <div className="w-[25%] text-right">Total</div>
                        </div>
                        <OrderPrimitive.InvoiceItemRepeater>
                          <div className="flex border-b border-gray-200 py-4 font-light text-content-primary">
                            <div className="w-[35%]">
                              <InvoiceItemPrimitive.Name />
                            </div>
                            <div className="w-[25%]">
                              <InvoiceItemPrimitive.Price />
                            </div>
                            <div className="w-[15%]">
                              <InvoiceItemPrimitive.Quantity />
                            </div>
                            <div className="w-[25%] text-right">
                              <InvoiceItemPrimitive.Total />
                            </div>
                          </div>
                        </OrderPrimitive.InvoiceItemRepeater>
                        <div className="flex flex-row justify-end">
                          <div className="w-[40%]">
                            <div className="flex flex-col py-5 border-b border-gray-300">
                              <OrderPrimitive.Subtotal
                                asChild
                                className="font-light text-content-primary justify-between flex"
                              >
                                {({ value, currency }) => (
                                  <div>
                                    <span>Subtotal:</span>
                                    <span>{`${value} ${currency}`}</span>
                                  </div>
                                )}
                              </OrderPrimitive.Subtotal>
                              <OrderPrimitive.Tax
                                asChild
                                className="font-light text-content-primary justify-between flex"
                              >
                                {({ taxRate, taxValue, currency }) => (
                                  <div>
                                    <span>{`Tax (${taxRate}%)`}</span>
                                    <span>{`${taxValue} ${currency}`}</span>
                                  </div>
                                )}
                              </OrderPrimitive.Tax>
                              <OrderPrimitive.ServiceFee
                                asChild
                                className="font-light text-content-primary justify-between flex"
                              >
                                {({ value, currency, rate }) => (
                                  <div>
                                    <span>{`Service Fee (${rate}%)`}</span>
                                    <span>{`${value} ${currency}`}</span>
                                  </div>
                                )}
                              </OrderPrimitive.ServiceFee>
                            </div>
                            <OrderPrimitive.Total
                              asChild
                              className="font-light text-content-primary justify-between flex py-5"
                            >
                              {({ value, currency }) => (
                                <div>
                                  <span>Total:</span>
                                  <span>{`${value} ${currency}`}</span>
                                </div>
                              )}
                            </OrderPrimitive.Total>
                          </div>
                        </div>
                      </OrderPrimitive.InvoiceItems>
                      <div className="px-6 py-3 gap-1 flex flex-row items-center">
                        <OrderPrimitive.OrderNumber
                          asChild
                          className="font-light text-sm text-content-primary"
                        >
                          {({ orderNumber }) => (
                            <span>{`Order No. #${orderNumber}`}</span>
                          )}
                        </OrderPrimitive.OrderNumber>
                        <OrderPrimitive.CreatedDate
                          asChild
                          className="font-light text-sm text-content-primary"
                        >
                          {({ createdDate }) => (
                            <span>{`Placed on: ${createdDate}`}</span>
                          )}
                        </OrderPrimitive.CreatedDate>
                      </div>
                    </OrderPrimitive.Root>
                  );
                } else if (external) {
                  return null;
                }
              }}
            </EventPrimitive.Type>
          </div>
        </EventPrimitive.Root>
      </div>
    </div>
  );
}
