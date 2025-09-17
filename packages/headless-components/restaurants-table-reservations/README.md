# @wix/headless-restaurants-table-reservations

Headless components for restaurant table reservations using the Wix table reservations API.

## Installation

```bash
npm install @wix/headless-restaurants-table-reservations @wix/table-reservations
```

**Note:** This package requires the `@wix/table-reservations` package to be installed as it provides the underlying API functionality.

## Components

### Filters

The `Filters` component provides filtering functionality for location, party size, date, and time selection.

```tsx
import { Filters } from '@wix/headless-restaurants-table-reservations/react';

<Filters.Root
  initialFilters={{ partySize: 2 }}
  filterOptions={{
    locations: [
      { _id: '1', name: 'Downtown Restaurant', address: '123 Main St' },
      { _id: '2', name: 'Uptown Bistro', address: '456 Oak Ave' },
    ],
    partySizes: [
      { key: '1', label: '1 Person', value: 1 },
      { key: '2', label: '2 People', value: 2 },
    ],
    availableDates: [{ key: '1', label: 'Today', value: new Date() }],
    availableTimes: [],
  }}
  onFiltersChange={(filters) => console.log(filters)}
>
  <Filters.Location />
  <Filters.PartySize />
  <Filters.Date />
  <Filters.Clear />
</Filters.Root>;
```

### TimeSlots

The `TimeSlots` component displays available time slots in a grid format with different states.

```tsx
import { TimeSlots } from '@wix/headless-restaurants-table-reservations/react';

<TimeSlots.Root
  timeSlots={[
    { _id: '1', startTime: '19:00', endTime: '20:00', available: true },
    { _id: '2', startTime: '19:30', endTime: '20:30', available: false },
  ]}
  selectedTimeSlotId="1"
  onTimeSlotSelect={(id) => console.log('Selected:', id)}
>
  <TimeSlots.Label>Available Times</TimeSlots.Label>
  <TimeSlots.Grid columns={4} />
</TimeSlots.Root>;
```

### ReserveNow

The `ReserveNow` component handles reservation submission with form validation and error handling.

```tsx
import { ReserveNow } from '@wix/headless-restaurants-table-reservations/react';

<ReserveNow.Root
  onReservationSuccess={(id) => console.log('Reservation created:', id)}
  onReservationError={(error) => console.error('Error:', error)}
  createReservation={async (params) => {
    // Call Wix table reservations API
    const reservation = await reservations.createReservation(params);
    return reservation._id;
  }}
>
  <ReserveNow.Form>
    <input name="firstName" placeholder="First Name" required />
    <input name="lastName" placeholder="Last Name" required />
    <input name="email" type="email" placeholder="Email" required />
    <input name="phone" type="tel" placeholder="Phone" />
    <textarea name="specialRequests" placeholder="Special Requests" />
    <ReserveNow.Button>Reserve Now</ReserveNow.Button>
  </ReserveNow.Form>
</ReserveNow.Root>;
```

### Complete Example

For a complete working example, use the `ReservationForm` component:

```tsx
import { ReservationForm } from '@wix/headless-restaurants-table-reservations/react';

<ReservationForm
  onReservationSuccess={(id) => console.log('Reservation created:', id)}
  onError={(error) => console.error('Error:', error)}
  className="max-w-2xl mx-auto p-6"
/>;
```

## Services

The package includes service classes for interacting with the Wix table reservations API:

```tsx
import {
  reservationLocationsService,
  timeSlotsService,
  reservationsService,
} from '@wix/headless-restaurants-table-reservations/services';

// Get available locations
const locations = await reservationLocationsService.getLocations();

// Get time slots for a specific query
const timeSlots = await timeSlotsService.getTimeSlots({
  locationId: 'location-id',
  partySize: 2,
  date: new Date(),
});

// Create a reservation
const reservation = await reservationsService.createReservation({
  locationId: 'location-id',
  partySize: 2,
  date: new Date(),
  timeSlotId: 'time-slot-id',
  customerInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
});
```

## Styling

All components use semantic CSS classes that follow the design system:

- `bg-background` - Background colors
- `text-foreground` - Text colors
- `bg-primary` - Primary button colors
- `text-primary-foreground` - Primary button text
- `bg-secondary` - Secondary colors
- `text-secondary-foreground` - Secondary text
- `text-destructive` - Error colors
- `font-heading` - Heading fonts
- `font-paragraph` - Paragraph fonts

## API Integration

The components are designed to work with the `@wix/table-reservations` package. The service classes automatically use the Wix table reservations API:

- **ReservationLocationsService**: Uses `reservationLocations.queryReservationLocations()` and `reservationLocations.getReservationLocation()`
- **TimeSlotsService**: Uses `timeSlots.getTimeSlots()` and `timeSlots.checkAvailability()`
- **ReservationsService**: Uses `reservations.createReservation()`, `reservations.getReservation()`, `reservations.updateReservation()`, and `reservations.cancelReservation()`

Make sure to:

1. Install the Wix table reservations package
2. Configure your Wix app with the table reservations module
3. Set up authentication and permissions as required by your Wix app
4. The service classes handle all API calls automatically

## TypeScript Support

The package includes full TypeScript support with exported types:

```tsx
import type {
  ReservationFilters,
  TimeSlot,
  Location,
  ReservationFormData,
} from '@wix/headless-restaurants-table-reservations/react';
```
