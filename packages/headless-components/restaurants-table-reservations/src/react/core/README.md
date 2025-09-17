# Core Headless Components

This directory contains the core headless components for the restaurants table reservations functionality. These components follow the headless component pattern where they expose data and actions via render props, allowing complete control over UI implementation.

## Components

### RequestReservation

The main component that initializes all services and provides context for the entire reservation flow.

**Sub-components:**

- `Root` - Initializes all services and provides context
- `Loader` - Provides loading state
- `Locations` - Provides locations data and selection
- `LocationRepeater` - Maps locations and creates Location.Root
- `PartySizes` - Provides party size options and selection
- `PartySizeRepeater` - Maps party sizes and creates PartySize.Root
- `DateInput` - Provides date selection functionality
- `TimeSlots` - Provides time slots data and selection
- `TimeSlotsRepeater` - Maps time slots and creates TimeSlot.Root
- `Action.Reserve` - Provides reservation creation functionality

### Location

Individual location component for displaying and selecting a single location.

**Sub-components:**

- `Root` - Accepts location data and creates context
- `Name` - Provides location name
- `Action.Select` - Provides selection functionality

### PartySize

Individual party size component for displaying and selecting a single party size.

**Sub-components:**

- `Root` - Accepts party size data and creates context
- `Size` - Provides party size value
- `Action.Select` - Provides selection functionality

### TimeSlot

Individual time slot component for displaying and selecting a single time slot.

**Sub-components:**

- `Root` - Accepts time slot data and creates context
- `Time` - Provides formatted time string
- `Action.Select` - Provides selection functionality

## Usage Example

```tsx
import { RequestReservation, Location, PartySize, TimeSlot } from "./core";

// Example usage in a React component
function ReservationForm() {
  return (
    <RequestReservation.Root>
      <RequestReservation.Locations>
        {({ locations, selectedLocation, selectLocation }) => (
          <div>
            <h3>Select Location</h3>
            <RequestReservation.LocationRepeater>
              {({ locations }) => (
                <div>
                  {locations.map((location) => (
                    <Location.Root
                      key={location._id}
                      location={location}
                      isSelected={selectedLocation?._id === location._id}
                      selectLocation={() => selectLocation(location)}
                    >
                      <Location.Action.Select>
                        {({ onClick, isSelected }) => (
                          <button
                            onClick={onClick}
                            className={isSelected ? "selected" : ""}
                          >
                            <Location.Name>
                              {({ name }) => <span>{name}</span>}
                            </Location.Name>
                          </button>
                        )}
                      </Location.Action.Select>
                    </Location.Root>
                  ))}
                </div>
              )}
            </RequestReservation.LocationRepeater>
          </div>
        )}
      </RequestReservation.Locations>

      <RequestReservation.PartySizes>
        {({ partySizeOptions, selectedPartySize, selectPartySize }) => (
          <div>
            <h3>Party Size</h3>
            <RequestReservation.PartySizeRepeater>
              {({ partySizeOptions }) => (
                <div>
                  {partySizeOptions.map((size) => (
                    <PartySize.Root
                      key={size}
                      partySize={size}
                      isSelected={selectedPartySize === size}
                      selectPartySize={() => selectPartySize(size)}
                    >
                      <PartySize.Action.Select>
                        {({ onClick, isSelected }) => (
                          <button
                            onClick={onClick}
                            className={isSelected ? "selected" : ""}
                          >
                            <PartySize.Size>
                              {({ size }) => <span>{size} people</span>}
                            </PartySize.Size>
                          </button>
                        )}
                      </PartySize.Action.Select>
                    </PartySize.Root>
                  ))}
                </div>
              )}
            </RequestReservation.PartySizeRepeater>
          </div>
        )}
      </RequestReservation.PartySizes>

      <RequestReservation.TimeSlots>
        {({ timeSlots, selectedTimeSlot, selectTimeSlot }) => (
          <div>
            <h3>Select Time</h3>
            <RequestReservation.TimeSlotsRepeater>
              {({ timeSlots }) => (
                <div>
                  {timeSlots.map((timeSlot) => (
                    <TimeSlot.Root
                      key={timeSlot._id}
                      timeSlot={timeSlot}
                      isSelected={selectedTimeSlot?._id === timeSlot._id}
                      selectTimeSlot={() => selectTimeSlot(timeSlot)}
                    >
                      <TimeSlot.Action.Select>
                        {({ onClick, isSelected }) => (
                          <button
                            onClick={onClick}
                            className={isSelected ? "selected" : ""}
                          >
                            <TimeSlot.Time>
                              {({ time }) => <span>{time}</span>}
                            </TimeSlot.Time>
                          </button>
                        )}
                      </TimeSlot.Action.Select>
                    </TimeSlot.Root>
                  ))}
                </div>
              )}
            </RequestReservation.TimeSlotsRepeater>
          </div>
        )}
      </RequestReservation.TimeSlots>

      <RequestReservation.Action.Reserve>
        {({ onReserve, loading, error }) => (
          <div>
            {error && <div className="error">{error}</div>}
            <button onClick={onReserve} disabled={loading}>
              {loading ? "Creating Reservation..." : "Reserve Table"}
            </button>
          </div>
        )}
      </RequestReservation.Action.Reserve>
    </RequestReservation.Root>
  );
}
```

## Service Dependencies

These components require the following services to be registered in a ServicesManager:

- `LocationServiceDefinition`
- `RequestReservationServiceDefinition`
- `TimeSlotServiceDefinition`
- `ReservationServiceDefinition`

Make sure to wrap your components with a `ServicesManagerProvider` that includes these services.
