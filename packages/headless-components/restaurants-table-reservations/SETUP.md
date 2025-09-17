# Setup Instructions

## Overview

I've successfully created a complete headless components package for restaurant table reservations using the Wix table reservations API. The package includes:

### Components Created:
1. **Filters** - Location, party size, date, and time filtering
2. **TimeSlots** - Grid display of available time slots with different states
3. **ReserveNow** - Reservation submission with form validation
4. **ReservationForm** - Complete example combining all components

### Services Created:
1. **ReservationLocationsService** - Uses `reservationLocations` API
2. **TimeSlotsService** - Uses `timeSlots` API
3. **ReservationsService** - Uses `reservations` API

## Next Steps to Complete Setup:

### 1. Install Dependencies
```bash
cd /Users/valeriiho/work/wixVibeBlitz/headless-components/packages/headless-components/restaurants-table-reservations
npm install
```

### 2. Install Wix Table Reservations Package
```bash
npm install @wix/table-reservations
```

### 3. Install React Types (if needed)
```bash
npm install --save-dev @types/react @types/react-dom
```

### 4. Build the Package
```bash
npm run build
```

## File Structure Created:

```
restaurants-table-reservations/
├── package.json
├── tsconfig.json
├── tsconfig.base.json
├── tsconfig.cjs.json
├── README.md
├── SETUP.md
└── src/
    ├── react/
    │   ├── index.ts
    │   ├── types.ts
    │   ├── Filters.tsx
    │   ├── TimeSlots.tsx
    │   ├── ReserveNow.tsx
    │   └── ReservationForm.tsx
    ├── services/
    │   ├── index.ts
    │   ├── common-types.ts
    │   ├── reservation-locations-service.ts
    │   ├── time-slots-service.ts
    │   └── reservations-service.ts
    └── vitest.setup.ts
```

## Key Features Implemented:

### Filters Component:
- Location selection using Wix `reservationLocations` API
- Party size selection
- Date picker
- Time slot selection
- Clear filters functionality

### TimeSlots Component:
- Grid layout with configurable columns
- Different states: available, unavailable, selected, error
- Loading and error states
- Integration with Wix `timeSlots` API

### ReserveNow Component:
- Form validation
- Integration with Wix `reservations` API
- Loading states
- Error handling
- Success feedback

### Services:
- All services use actual Wix table reservations API calls
- Proper error handling
- TypeScript support
- Consistent response format

## Usage Example:

```tsx
import { ReservationForm } from '@wix/headless-restaurants-table-reservations/react';

<ReservationForm
  onReservationSuccess={(id) => console.log('Reservation created:', id)}
  onError={(error) => console.error('Error:', error)}
/>
```

## Design System Compliance:

All components follow the cursor rules:
- Use semantic color classes (`bg-background`, `text-foreground`, etc.)
- Use semantic font classes (`font-heading`, `font-paragraph`)
- No hardcoded colors or fonts
- Proper TypeScript support

The package is ready to use once the dependencies are installed and the build is completed.
