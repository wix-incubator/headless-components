import React from 'react';
import {
  RequestReservation as RequestReservationPrimitive,
  Location,
  PartySize,
  TimeSlot,
} from '@wix/headless-restaurants-table-reservations/react';
// } from "@/components/restaurants-table-reservations/headless/react";
const RequestReservation = () => {
  return (
    <div id="layout" className="max-w-4xl mx-auto p-6">
      <RequestReservationPrimitive.Root>
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading text-foreground mb-3">
            Make a reservation
          </h1>
          <p className="text-lg font-paragraph text-foreground">
            Select your details and we'll try to get the best seats for you.
          </p>
        </div>
        {/* -- initialize services */}
        <div id="filters" className="flex flex-wrap gap-4 items-end mb-8">
          <div id="location" className="flex-1 min-w-48">
            <label className="block text-sm font-heading text-foreground mb-2">
              Location
            </label>
            <RequestReservationPrimitive.LocationRepeater>
              <Location.Name className="w-full px-3 py-2 border border-foreground rounded-md bg-background text-foreground font-paragraph focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            </RequestReservationPrimitive.LocationRepeater>
          </div>
          <div id="party-size" className="flex-1 min-w-32">
            <label className="block text-sm font-heading text-foreground mb-2">
              Party Size
            </label>
            <RequestReservationPrimitive.PartySizes asChild>
              {React.forwardRef(
                (
                  { partySizeOptions, selectedPartySize, selectPartySize },
                  ref,
                ) => {
                  return (
                    <div
                      ref={ref as React.Ref<HTMLDivElement>}
                      className="w-full"
                    >
                      <select
                        value={selectedPartySize || ''}
                        onChange={(e) => {
                          selectPartySize(Number(e.target.value));
                        }}
                        className="w-full h-11 px-3 py-2 border border-foreground rounded-md bg-background text-foreground font-paragraph focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="" disabled>
                          Select party size
                        </option>
                        {partySizeOptions.map((size) => (
                          <option
                            key={size}
                            value={size}
                            className="bg-background text-foreground"
                          >
                            {size} {size === 1 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                },
              )}
            </RequestReservationPrimitive.PartySizes>
          </div>
          <div id="date" className="flex-1 min-w-48">
            <label className="block text-sm font-heading text-foreground mb-2">
              Date
            </label>
            <RequestReservationPrimitive.DateInput className="w-full px-3 py-2 border border-foreground rounded-md bg-background text-foreground font-paragraph focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>
          <div id="time" className="flex-1 min-w-48">
            <label className="block text-sm font-heading text-foreground mb-2">
              Time
            </label>
            <RequestReservationPrimitive.TimeSlots showUnavailableSlots>
              {React.forwardRef(
                ({ timeSlots, selectedTimeSlot, selectTimeSlot }, ref) => (
                  <select
                    ref={ref as React.Ref<HTMLSelectElement>}
                    value={selectedTimeSlot?.startDate!.toString() || ''}
                    onChange={(e) => {
                      const selectedTimeSlot = timeSlots.find(
                        (slot) => slot.startDate!.toString() === e.target.value,
                      );
                      if (selectedTimeSlot) {
                        selectTimeSlot(selectedTimeSlot);
                      }
                    }}
                    className="w-full h-11 px-3 py-2 border border-foreground rounded-md bg-background text-foreground font-paragraph focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="" disabled>
                      Select time
                    </option>
                    {timeSlots.map((timeSlot) => (
                      <option
                        key={timeSlot.startDate!.toString()}
                        value={timeSlot.startDate!.toString()}
                        className="bg-background text-foreground"
                      >
                        {new Date(timeSlot.startDate!).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          },
                        )}
                      </option>
                    ))}
                  </select>
                ),
              )}
            </RequestReservationPrimitive.TimeSlots>
          </div>
        </div>
        <div id="time-table" className="w-full mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-heading text-foreground">
              Choose an available time slot:
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <RequestReservationPrimitive.TimeSlotRepeater
              slotsLimit={15}
              showUnavailableSlots
            >
              <TimeSlot.Action.Select asChild>
                {React.forwardRef(({ onClick }, ref) => (
                  <button
                    ref={ref as React.Ref<HTMLButtonElement>}
                    onClick={onClick}
                    className="px-4 py-3 text-center font-paragraph border rounded-md transition-colors
                      bg-background text-foreground border-foreground
                      hover:bg-secondary hover:text-primary-foreground
                      data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=true]:border-primary
                      data-[status=UNAVAILABLE]:text-secondary-foreground data-[status=UNAVAILABLE]:bg-secondary data-[status=UNAVAILABLE]:border-secondary data-[status=UNAVAILABLE]:cursor-not-allowed data-[status=UNAVAILABLE]:opacity-50
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TimeSlot.Time />
                  </button>
                ))}
              </TimeSlot.Action.Select>
            </RequestReservationPrimitive.TimeSlotRepeater>
          </div>
        </div>
        <div id="reserve-button" className="flex justify-center mt-8">
          <RequestReservationPrimitive.Action.Reserve
            label="Reserve now"
            className="px-8 py-3 bg-primary text-primary-foreground font-heading text-lg rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed data-[haserror=true]:bg-destructive data-[haserror=true]:border-destructive data-[haserror=true]:ring-destructive"
          />
        </div>
        asdasd
      </RequestReservationPrimitive.Root>
    </div>
  );
};

export default RequestReservation;
