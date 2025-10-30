/**
 * Services for restaurants table reservations functionality.
 *
 * This module exports all the client-side services that manage state and logic
 * for table reservations, including location management, time slot selection,
 * reservation requests, and reservation creation.
 *
 * All services use signals for reactive state management and follow the
 * established pattern for client-side services in the headless architecture.
 */

// Location Service
export {
  LocationService,
  LocationServiceDefinition,
  type LocationServiceAPI,
  type LocationServiceConfig,
  type SuccessLocationServiceConfigResult,
  type NotFoundLocationServiceConfigResult,
  loadLocationServiceConfig,
  type ReservationLocation,
} from './location-service.js';

// Time Slot Service
export {
  TimeSlotService,
  TimeSlotServiceDefinition,
  type TimeSlotServiceAPI,
  type TimeSlotServiceConfig,
  type TimeSlot,
} from './time-slot-service.js';

// Request Reservation Service
export {
  RequestReservationService,
  RequestReservationServiceDefinition,
  type RequestReservationServiceAPI,
  type RequestReservationServiceConfig,
} from './request-reservation-service.js';

// Reservation Service
export {
  ReservationService,
  ReservationServiceDefinition,
  type ReservationServiceAPI,
  type ReservationServiceConfig,
} from './reservation-service.js';
