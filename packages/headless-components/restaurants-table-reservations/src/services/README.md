# Table Reservations Services

This directory contains client-side services for managing table reservations functionality. All services use signals for reactive state management and follow the established pattern for headless architecture.

## Services Overview

### LocationService

Manages reservation locations data and selection state.

**Provides:**

- `locationsSignal` - List of available reservation locations
- `selectedLocationSignal` - Currently selected location
- `loadingSignal` - Loading state for location operations
- `errorSignal` - Error messages
- `getLocations()` - Load locations from API

### RequestReservationService

Manages reservation request data (party size, date).

**Provides:**

- `partySizeSignal` - Selected party size
- `partySizeOptionsSignal` - Available party size options
- `onPartySizeChange()` - Update party size
- `dateSignal` - Selected date
- `onDateChange()` - Update date
- `isValidDate()` - Validate if a date is valid for reservations

### TimeSlotService

Manages available time slots for reservations.

**Provides:**

- `selectedTimeSlotSignal` - Currently selected time slot
- `timeSlotsSignal` - Available time slots
- `loadingSignal` - Loading state for time slot operations
- `errorSignal` - Error messages
- `onTimeSlotClick()` - Select a time slot
- `loadTimeSlots()` - Load time slots based on current filters

### ReservationService

Handles reservation creation.

**Provides:**

- `loadingSignal` - Loading state for reservation creation
- `errorSignal` - Error messages
- `onReserve()` - Create a reservation

## Usage Example

```tsx
import {
  LocationService,
  LocationServiceDefinition,
  RequestReservationService,
  RequestReservationServiceDefinition,
  TimeSlotService,
  TimeSlotServiceDefinition,
  ReservationService,
  ReservationServiceDefinition,
  loadLocationServiceConfig,
} from './services';
import { useService } from '@wix/services-manager-react';
import {
  createServicesManager,
  createServicesMap,
} from '@wix/services-manager';

// Load location config on server (SSR)
const locationResult = await loadLocationServiceConfig();
if (locationResult.type === 'notFound') {
  return Astro.redirect('/404');
}

// Create services manager
const servicesManager = createServicesManager(
  createServicesMap()
    .addService(
      LocationServiceDefinition,
      LocationService,
      locationResult.config,
    )
    .addService(
      RequestReservationServiceDefinition,
      RequestReservationService,
      {},
    )
    .addService(TimeSlotServiceDefinition, TimeSlotService, {})
    .addService(ReservationServiceDefinition, ReservationService, {}),
);

// Use in React component
function ReservationsPage() {
  return (
    <ServicesManagerProvider servicesManager={servicesManager}>
      <LocationSelector />
      <ReservationForm />
      <TimeSlotSelector />
      <ReserveButton />
    </ServicesManagerProvider>
  );
}

function LocationSelector() {
  const locationService = useService(LocationServiceDefinition);
  const locations = locationService.locationsSignal.get();
  const selectedLocation = locationService.selectedLocationSignal.get();
  const isLoading = locationService.loadingSignal.get();

  return (
    <select
      value={selectedLocation?._id || ''}
      onChange={(e) => {
        const location = locations.find((l) => l._id === e.target.value);
        locationService.selectedLocationSignal.set(location || null);
      }}
    >
      {locations.map((location) => (
        <option key={location._id} value={location._id}>
          {location.name}
        </option>
      ))}
    </select>
  );
}

function ReservationForm() {
  const requestReservationService = useService(
    RequestReservationServiceDefinition,
  );
  const partySize = requestReservationService.partySizeSignal.get();
  const partySizeOptions =
    requestReservationService.partySizeOptionsSignal.get();
  const date = requestReservationService.dateSignal.get();

  return (
    <div>
      <select
        value={partySize}
        onChange={(e) =>
          requestReservationService.onPartySizeChange(parseInt(e.target.value))
        }
      >
        {partySizeOptions.map((size) => (
          <option key={size} value={size}>
            {size} people
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date.toISOString().split('T')[0]}
        onChange={(e) => {
          const newDate = new Date(e.target.value);
          if (requestReservationService.isValidDate(newDate)) {
            requestReservationService.onDateChange(newDate);
          }
        }}
      />
    </div>
  );
}

function TimeSlotSelector() {
  const timeSlotService = useService(TimeSlotServiceDefinition);
  const timeSlots = timeSlotService.timeSlotsSignal.get();
  const selectedTimeSlot = timeSlotService.selectedTimeSlotSignal.get();
  const isLoading = timeSlotService.loadingSignal.get();

  // Load time slots when component mounts or filters change
  useEffect(() => {
    timeSlotService.loadTimeSlots();
  }, []);

  return (
    <div>
      {timeSlots.map((slot) => (
        <button
          key={slot._id}
          onClick={() => timeSlotService.onTimeSlotClick(slot)}
          className={selectedTimeSlot?._id === slot._id ? 'selected' : ''}
        >
          {new Date(slot.startDate).toLocaleTimeString()}
        </button>
      ))}
    </div>
  );
}

function ReserveButton() {
  const reservationService = useService(ReservationServiceDefinition);
  const isLoading = reservationService.loadingSignal.get();
  const error = reservationService.errorSignal.get();

  return (
    <button onClick={() => reservationService.onReserve()} disabled={isLoading}>
      {isLoading ? 'Creating Reservation...' : 'Reserve'}
    </button>
  );
}
```

## Service Dependencies

- **RequestReservationService** depends on **LocationService**
- **TimeSlotService** depends on **RequestReservationService**
- **ReservationService** depends on **LocationService**, **RequestReservationService**, and **TimeSlotService**

All dependent services must be registered in the same `ServicesManager` to share state properly.

## Types

All services export TypeScript types for their APIs and configurations. The main types from `@wix/table-reservations` are re-exported for convenience:

- `ReservationLocation` - Location data structure
- `TimeSlot` - Time slot data structure

## Error Handling

All services provide error signals that contain user-friendly error messages. Services handle API errors gracefully and provide meaningful feedback to the UI layer.
