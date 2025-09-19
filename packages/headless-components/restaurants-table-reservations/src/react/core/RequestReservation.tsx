import React from 'react';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  LocationServiceDefinition,
  LocationService,
  RequestReservationServiceDefinition,
  RequestReservationService,
  TimeSlotServiceDefinition,
  TimeSlotService,
  ReservationServiceDefinition,
  ReservationService,
  type LocationServiceConfig,
  type RequestReservationServiceConfig,
  type TimeSlotServiceConfig,
  type ReservationServiceConfig,
  type ReservationLocation,
  type TimeSlot,
} from '../../services/index.js';

/**
 * Props for Root headless component
 */
export interface RootProps {
  /** Child components that will have access to the reservation services */
  children: React.ReactNode;
  /** Configuration for the Location service */
  locationServiceConfig?: LocationServiceConfig;
  /** Configuration for the RequestReservation service */
  requestReservationServiceConfig?: RequestReservationServiceConfig;
  /** Configuration for the TimeSlot service */
  timeSlotServiceConfig?: TimeSlotServiceConfig;
  /** Configuration for the Reservation service */
  reservationServiceConfig?: ReservationServiceConfig;
}

/**
 * Root component that provides all reservation service contexts to its children.
 * This component sets up the necessary services for managing table reservations.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function ReservationPage() {
 *   return (
 *     <RequestReservation.Root
 *       locationServiceConfig={{ locations: myLocations }}
 *       requestReservationServiceConfig={{ partySize: 2, date: new Date() }}
 *       timeSlotServiceConfig={{ timeSlots: [] }}
 *       reservationServiceConfig={{}}
 *     >
 *       <RequestReservation.Locations>
 *         {({ locations, selectedLocation, selectLocation }) => (
 *           <div>
 *             {locations.map(location => (
 *               <button key={location._id} onClick={() => selectLocation(location)}>
 *                 {location.name}
 *               </button>
 *             ))}
 *           </div>
 *         )}
 *       </RequestReservation.Locations>
 *     </RequestReservation.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  return (
    <WixServices
      servicesMap={createServicesMap()
        .addService(
          LocationServiceDefinition,
          LocationService,
          props.locationServiceConfig,
        )
        .addService(
          RequestReservationServiceDefinition,
          RequestReservationService,
          props.requestReservationServiceConfig,
        )
        .addService(
          TimeSlotServiceDefinition,
          TimeSlotService,
          props.timeSlotServiceConfig,
        )
        .addService(
          ReservationServiceDefinition,
          ReservationService,
          props.reservationServiceConfig,
        )}
    >
      {props.children}
    </WixServices>
  );
}

/**
 * Props for Loader headless component
 */
export interface LoaderProps {
  /** Render prop function that receives loading state */
  children: (props: LoaderRenderProps) => React.ReactNode;
}

/**
 * Render props for Loader component
 */
export interface LoaderRenderProps {
  /** Whether any service is currently loading */
  isLoading: boolean;
}

/**
 * Component that renders content during loading state.
 * Only displays its children when any of the services are currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function ReservationLoading() {
 *   return (
 *     <RequestReservation.Loader>
 *       {({ isLoading }) => (
 *         isLoading ? (
 *           <div className="loading-spinner">
 *             <div>Loading reservation data...</div>
 *           </div>
 *         ) : null
 *       )}
 *     </RequestReservation.Loader>
 *   );
 * }
 * ```
 */
export function Loader(props: LoaderProps): React.ReactNode {
  const locationService = useService(LocationServiceDefinition) as ServiceAPI<
    typeof LocationServiceDefinition
  >;
  const timeSlotService = useService(TimeSlotServiceDefinition) as ServiceAPI<
    typeof TimeSlotServiceDefinition
  >;
  const reservationService = useService(
    ReservationServiceDefinition,
  ) as ServiceAPI<typeof ReservationServiceDefinition>;

  const locationsLoading = locationService.loadingSignal.get();
  const timeSlotsLoading = timeSlotService.loadingSignal.get();
  const reservationLoading = reservationService.loadingSignal.get();

  const isLoading = locationsLoading || timeSlotsLoading || reservationLoading;

  if (isLoading) {
    return props.children({ isLoading });
  }

  return null;
}

/**
 * Props for Locations headless component
 */
export interface LocationsProps {
  /** Render prop function that receives locations data */
  children: (props: LocationsRenderProps) => React.ReactNode;
}

/**
 * Render props for Locations component
 */
export interface LocationsRenderProps {
  /** List of available locations */
  locations: ReservationLocation[];
  /** Currently selected location */
  selectedLocation: ReservationLocation | null;
  /** Whether locations are currently loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to select a location */
  selectLocation: (location: ReservationLocation) => void;
}

/**
 * Component that renders content for locations management.
 * Provides locations data, selection state, and selection actions.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function LocationSelector() {
 *   return (
 *     <RequestReservation.Locations>
 *       {({ locations, selectedLocation, selectLocation, loading, error }) => (
 *         <div>
 *           {loading && <div>Loading locations...</div>}
 *           {error && <div>Error: {error}</div>}
 *           {locations.map(location => (
 *             <button
 *               key={location._id}
 *               onClick={() => selectLocation(location)}
 *               className={selectedLocation?._id === location._id ? 'selected' : ''}
 *             >
 *               {location.name}
 *             </button>
 *           ))}
 *         </div>
 *       )}
 *     </RequestReservation.Locations>
 *   );
 * }
 * ```
 */
export function Locations(props: LocationsProps): React.ReactNode {
  const locationService = useService(LocationServiceDefinition) as ServiceAPI<
    typeof LocationServiceDefinition
  >;

  const locations = locationService.locationsSignal.get();
  const selectedLocation = locationService.selectedLocationSignal.get();
  const locationsLoading = locationService.loadingSignal.get();
  const locationsError = locationService.errorSignal.get();

  const selectLocation = (location: ReservationLocation) => {
    locationService.selectedLocationSignal.set(location);
  };

  return props.children({
    locations,
    selectedLocation,
    loading: locationsLoading,
    error: locationsError,
    selectLocation,
  });
}

/**
 * Props for PartySizes headless component
 */
export interface PartySizesProps {
  /** Render prop function that receives party size data */
  children: (props: PartySizesRenderProps) => React.ReactNode;
}

/**
 * Render props for PartySizes component
 */
export interface PartySizesRenderProps {
  /** Available party size options */
  partySizeOptions: number[];
  /** Currently selected party size */
  selectedPartySize: number;
  /** Function to select a party size */
  selectPartySize: (partySize: number) => void;
}

/**
 * Component that renders content for party size management.
 * Provides party size options, selection state, and selection actions.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function PartySizeSelector() {
 *   return (
 *     <RequestReservation.PartySizes>
 *       {({ partySizeOptions, selectedPartySize, selectPartySize }) => (
 *         <div>
 *           <label>Party Size:</label>
 *           <select value={selectedPartySize} onChange={(e) => selectPartySize(Number(e.target.value))}>
 *             {partySizeOptions.map(size => (
 *               <option key={size} value={size}>{size} people</option>
 *             ))}
 *           </select>
 *         </div>
 *       )}
 *     </RequestReservation.PartySizes>
 *   );
 * }
 * ```
 */
export function PartySizes(props: PartySizesProps): React.ReactNode {
  const requestReservationService = useService(
    RequestReservationServiceDefinition,
  ) as ServiceAPI<typeof RequestReservationServiceDefinition>;

  const partySizeOptions =
    requestReservationService.partySizeOptionsSignal.get();
  const selectedPartySize = requestReservationService.partySizeSignal.get();

  const selectPartySize = (partySize: number) => {
    requestReservationService.onPartySizeChange(partySize);
  };

  return props.children({
    partySizeOptions,
    selectedPartySize,
    selectPartySize,
  });
}

/**
 * Props for DateInput headless component
 */
export interface DateInputProps {
  /** Render prop function that receives date input data */
  children: (props: DateInputRenderProps) => React.ReactNode;
}

/**
 * Render props for DateInput component
 */
export interface DateInputRenderProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Function to select a date */
  selectDate: (date: Date) => void;
  /** Function to validate if a date is valid */
  isValidDate: (date: Date) => boolean;
}

/**
 * Component that renders content for date selection.
 * Provides date selection state and validation.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function DateSelector() {
 *   return (
 *     <RequestReservation.DateInput>
 *       {({ selectedDate, selectDate, isValidDate }) => (
 *         <div>
 *           <label>Select Date:</label>
 *           <input
 *             type="date"
 *             value={selectedDate.toISOString().split('T')[0]}
 *             onChange={(e) => {
 *               const newDate = new Date(e.target.value);
 *               if (isValidDate(newDate)) {
 *                 selectDate(newDate);
 *               }
 *             }}
 *           />
 *         </div>
 *       )}
 *     </RequestReservation.DateInput>
 *   );
 * }
 * ```
 */
export function DateInput(props: DateInputProps): React.ReactNode {
  const requestReservationService = useService(
    RequestReservationServiceDefinition,
  ) as ServiceAPI<typeof RequestReservationServiceDefinition>;

  const selectedDate = requestReservationService.dateSignal.get();

  const selectDate = (date: Date) => {
    requestReservationService.onDateChange(date);
  };

  const isValidDate = (date: Date) => {
    return requestReservationService.isValidDate(date);
  };

  return props.children({ selectedDate, selectDate, isValidDate });
}

/**
 * Props for TimeSlots headless component
 */
export interface TimeSlotsProps {
  /** Render prop function that receives time slots data */
  children: (props: TimeSlotsRenderProps) => React.ReactNode;
  slotsLimit?: number;
  showUnavailableSlots?: boolean;
}

/**
 * Render props for TimeSlots component
 */
export interface TimeSlotsRenderProps {
  /** List of available time slots */
  timeSlots: TimeSlot[];
  /** Currently selected time slot */
  selectedTimeSlot: TimeSlot | null;
  /** Whether time slots are currently loading */
  loading: boolean;
  /** Error message if any */
  error: string | null;
  /** Function to select a time slot */
  selectTimeSlot: (timeSlot: TimeSlot) => void;
  /** Function to load time slots */
  loadTimeSlots: () => Promise<void>;
}

/**
 * Component that renders content for time slots management.
 * Provides time slots data, selection state, and selection actions.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function TimeSlotSelector() {
 *   return (
 *     <RequestReservation.TimeSlots>
 *       {({ timeSlots, selectedTimeSlot, selectTimeSlot, loading, error, loadTimeSlots }) => (
 *         <div>
 *           {loading && <div>Loading time slots...</div>}
 *           {error && <div>Error: {error}</div>}
 *           <button onClick={loadTimeSlots}>Load Time Slots</button>
 *           {timeSlots.map(timeSlot => (
 *             <button
 *               key={timeSlot._id}
 *               onClick={() => selectTimeSlot(timeSlot)}
 *               className={selectedTimeSlot?._id === timeSlot._id ? 'selected' : ''}
 *             >
 *               {new Date(timeSlot.startDate).toLocaleTimeString()}
 *             </button>
 *           ))}
 *         </div>
 *       )}
 *     </RequestReservation.TimeSlots>
 *   );
 * }
 * ```
 */
export function TimeSlots(props: TimeSlotsProps): React.ReactNode {
  const timeSlotService = useService(TimeSlotServiceDefinition) as ServiceAPI<
    typeof TimeSlotServiceDefinition
  >;

  const timeSlots = timeSlotService.getFilteredTimeSlots({
    showUnavailableSlots: props.showUnavailableSlots || false,
    slotsLimit: props.slotsLimit || 100,
  });
  const selectedTimeSlot = timeSlotService.selectedTimeSlotSignal.get();
  const timeSlotsLoading = timeSlotService.loadingSignal.get();
  const timeSlotsError = timeSlotService.errorSignal.get();

  const selectTimeSlot = (timeSlot: TimeSlot) => {
    timeSlotService.onTimeSlotClick(timeSlot);
  };

  const loadTimeSlots = () => {
    return timeSlotService.loadTimeSlots();
  };

  return props.children({
    timeSlots,
    selectedTimeSlot,
    loading: timeSlotsLoading,
    error: timeSlotsError,
    selectTimeSlot,
    loadTimeSlots,
  });
}

/**
 * Props for Reserve action headless component
 */
export interface ReserveProps {
  /** Render prop function that receives reservation action data */
  children: (props: ReserveRenderProps) => React.ReactNode;
}

/**
 * Render props for Reserve component
 */
export interface ReserveRenderProps {
  /** Function to create a reservation */
  onReserve: () => Promise<void>;
  /** Whether reservation is currently being created */
  loading: boolean;
  /** Error message if any */
  error: string | null;
}

/**
 * Component that renders content for reservation creation.
 * Provides reservation creation functionality and state.
 *
 * @component
 * @example
 * ```tsx
 * import { RequestReservation } from './core';
 *
 * function ReservationButton() {
 *   return (
 *     <RequestReservation.Action.Reserve>
 *       {({ onReserve, loading, error }) => (
 *         <div>
 *           {error && <div>Error: {error}</div>}
 *           <button onClick={onReserve} disabled={loading}>
 *             {loading ? 'Creating Reservation...' : 'Reserve Table'}
 *           </button>
 *         </div>
 *       )}
 *     </RequestReservation.Action.Reserve>
 *   );
 * }
 * ```
 */
export function Reserve(props: ReserveProps): React.ReactNode {
  const reservationService = useService(
    ReservationServiceDefinition,
  ) as ServiceAPI<typeof ReservationServiceDefinition>;

  const reservationLoading = reservationService.loadingSignal.get();
  const reservationError = reservationService.errorSignal.get();

  const onReserve = () => {
    return reservationService.onReserve();
  };

  return props.children({
    onReserve,
    loading: reservationLoading,
    error: reservationError,
  });
}

/**
 * Action components for reservation operations
 */
export const Action = {
  Reserve,
};
