import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreRequestReservation from './core/RequestReservation.js';
import * as CoreLocation from './Location.js';
import * as CorePartySize from './PartySize.js';
import * as CoreTimeSlot from './TimeSlot.js';
import type {
  LocationServiceConfig,
  RequestReservationServiceConfig,
  TimeSlotServiceConfig,
  ReservationServiceConfig,
  ReservationLocation,
  TimeSlot,
} from '../services/index.js';

/**
 * Props for RequestReservation Root component
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
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
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
 *
 * // asChild usage
 * <RequestReservation.Root asChild locationServiceConfig={...} requestReservationServiceConfig={...} timeSlotServiceConfig={...} reservationServiceConfig={...}>
 *   <div className="reservation-container">
 *     <RequestReservation.Locations />
 *   </div>
 * </RequestReservation.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { asChild, className, children, ...otherProps } = props;

  return (
    <CoreRequestReservation.Root {...otherProps}>
      <AsChildSlot ref={ref} asChild={asChild} className={className}>
        {children}
      </AsChildSlot>
    </CoreRequestReservation.Root>
  );
});

/**
 * Props for RequestReservation Loader component
 */
export interface LoaderProps {
  /** Render prop function that receives loading state */
  children: (props: { isLoading: boolean }) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
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
 *
 * // asChild usage
 * <RequestReservation.Loader asChild>
 *   <div className="loading-overlay">
 *     <div>Loading...</div>
 *   </div>
 * </RequestReservation.Loader>
 * ```
 */
export const Loader = React.forwardRef<HTMLElement, LoaderProps>(
  (props, ref) => {
    const { asChild, className, children, ...otherProps } = props;

    return (
      <CoreRequestReservation.Loader {...otherProps}>
        {({ isLoading }) => {
          if (!isLoading) return null;

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              customElementProps={{ isLoading }}
            >
              <div className="loading-spinner">
                <div>Loading reservation data...</div>
              </div>
            </AsChildSlot>
          );
        }}
      </CoreRequestReservation.Loader>
    );
  },
);

/**
 * Props for RequestReservation Locations component
 */
export interface LocationsProps {
  /** Render prop function that receives locations data */
  children: (props: {
    locations: ReservationLocation[];
    selectedLocation: ReservationLocation | null;
    loading: boolean;
    error: string | null;
    selectLocation: (location: ReservationLocation) => void;
  }) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
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
 *
 * // asChild usage
 * <RequestReservation.Locations asChild>
 *   <div className="locations-container">
 *     <RequestReservation.Locations>
 *       {({ locations, selectedLocation, selectLocation }) => (
 *         locations.map(location => (
 *           <button key={location._id} onClick={() => selectLocation(location)}>
 *             {location.name}
 *           </button>
 *         ))
 *       )}
 *     </RequestReservation.Locations>
 *   </div>
 * </RequestReservation.Locations>
 * ```
 */
export const Locations = React.forwardRef<HTMLElement, LocationsProps>(
  (props, ref) => {
    const { asChild, className, children, ...otherProps } = props;

    return (
      <CoreRequestReservation.Locations {...otherProps}>
        {({ locations, selectedLocation, selectLocation, loading, error }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{
              locations,
              selectedLocation,
              selectLocation,
              loading,
              error,
            }}
          >
            {children}
          </AsChildSlot>
        )}
      </CoreRequestReservation.Locations>
    );
  },
);

/**
 * Props for RequestReservation PartySizes component
 */
export interface PartySizesProps {
  /** Render prop function that receives party size data */
  children: (props: {
    partySizeOptions: number[];
    selectedPartySize: number;
    selectPartySize: (partySize: number) => void;
  }) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
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
 *
 * // asChild usage
 * <RequestReservation.PartySizes asChild>
 *   <div className="party-size-container">
 *     <RequestReservation.PartySizes>
 *       {({ partySizeOptions, selectedPartySize, selectPartySize }) => (
 *         <select value={selectedPartySize} onChange={(e) => selectPartySize(Number(e.target.value))}>
 *           {partySizeOptions.map(size => (
 *             <option key={size} value={size}>{size} people</option>
 *           ))}
 *         </select>
 *       )}
 *     </RequestReservation.PartySizes>
 *   </div>
 * </RequestReservation.PartySizes>
 * ```
 */
export const PartySizes = React.forwardRef<HTMLElement, PartySizesProps>(
  (props, ref) => {
    const { asChild, className, children, ...otherProps } = props;

    return (
      <CoreRequestReservation.PartySizes {...otherProps}>
        {({ partySizeOptions, selectedPartySize, selectPartySize }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            customElement={children}
            customElementProps={{
              partySizeOptions,
              selectedPartySize,
              selectPartySize,
            }}
          >
            {children}
          </AsChildSlot>
        )}
      </CoreRequestReservation.PartySizes>
    );
  },
);

/**
 * Props for RequestReservation DateInput component
 */
export interface DateInputProps {
  /** Render prop function that receives date input data */
  children?: (props: {
    selectedDate: Date;
    selectDate: (date: Date) => void;
    isValidDate: (date: Date) => boolean;
  }) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
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
 *
 * // asChild usage
 * <RequestReservation.DateInput asChild>
 *   <div className="date-input-container">
 *     <RequestReservation.DateInput>
 *       {({ selectedDate, selectDate, isValidDate }) => (
 *         <input
 *           type="date"
 *           value={selectedDate.toISOString().split('T')[0]}
 *           onChange={(e) => {
 *             const newDate = new Date(e.target.value);
 *             if (isValidDate(newDate)) {
 *               selectDate(newDate);
 *             }
 *           }}
 *         />
 *       )}
 *     </RequestReservation.DateInput>
 *   </div>
 * </RequestReservation.DateInput>
 * ```
 */
export const DateInput = React.forwardRef<HTMLElement, DateInputProps>(
  (props, ref) => {
    const { asChild, className, children, ...otherProps } = props;

    return (
      <CoreRequestReservation.DateInput {...otherProps}>
        {({ selectedDate, selectDate, isValidDate }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-invalid={!isValidDate(selectedDate)}
            customElement={children}
            customElementProps={{
              selectedDate,
              selectDate,
              isValidDate,
            }}
          >
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                selectDate(newDate);
              }}
            />
          </AsChildSlot>
        )}
      </CoreRequestReservation.DateInput>
    );
  },
);

/**
 * Props for RequestReservation TimeSlots component
 */
export interface TimeSlotsProps {
  /** Render prop function that receives time slots data */
  children: (props: {
    timeSlots: TimeSlot[];
    selectedTimeSlot: TimeSlot | null;
    loading: boolean;
    error: string | null;
    selectTimeSlot: (timeSlot: TimeSlot) => void;
    loadTimeSlots: () => Promise<void>;
  }) => React.ReactNode;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Whether to show unavailable time slots */
  showUnavailableSlots?: boolean;
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
 *
 * // asChild usage
 * <RequestReservation.TimeSlots asChild>
 *   <div className="time-slots-container">
 *     <RequestReservation.TimeSlots>
 *       {({ timeSlots, selectedTimeSlot, selectTimeSlot, loading, error, loadTimeSlots }) => (
 *         <>
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
 *         </>
 *       )}
 *     </RequestReservation.TimeSlots>
 *   </div>
 * </RequestReservation.TimeSlots>
 * ```
 */
export const TimeSlots = React.forwardRef<HTMLElement, TimeSlotsProps>(
  (props, ref) => {
    const { asChild, className, children, ...otherProps } = props;

    return (
      <CoreRequestReservation.TimeSlots {...otherProps}>
        {({
          timeSlots,
          selectedTimeSlot,
          selectTimeSlot,
          loading,
          error,
          loadTimeSlots,
        }) => {
          if (timeSlots?.length === 0) {
            return null;
          }
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              customElementProps={{
                timeSlots,
                selectedTimeSlot,
                selectTimeSlot,
                loading,
                error,
                loadTimeSlots,
              }}
            >
              {children}
            </AsChildSlot>
          );
        }}
      </CoreRequestReservation.TimeSlots>
    );
  },
);

/**
 * Props for RequestReservation Action Reserve component
 */
export interface ActionReserveProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    onReserve: () => Promise<void>;
    loading: boolean;
    error: string | null;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Label for the reserve button */
  label?: string;
}

/**
 * Action component for creating a reservation with customizable rendering following the documented API.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <RequestReservation.Action.Reserve className="px-6 py-3 bg-primary text-primary-foreground rounded-lg disabled:opacity-50" />
 *
 * // asChild with primitive
 * <RequestReservation.Action.Reserve asChild>
 *   <button className="reserve-button" />
 * </RequestReservation.Action.Reserve>
 *
 * // asChild with react component
 * <RequestReservation.Action.Reserve asChild>
 *   {React.forwardRef(({onReserve, loading, error, ...props}, ref) => (
 *     <button
 *       ref={ref}
 *       {...props}
 *       onClick={onReserve}
 *       disabled={loading}
 *       className="reserve-button"
 *     >
 *       {loading ? 'Creating Reservation...' : 'Reserve Table'}
 *     </button>
 *   ))}
 * </RequestReservation.Action.Reserve>
 * ```
 */
export const ActionReserve = React.forwardRef<
  HTMLButtonElement,
  ActionReserveProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label = 'Reserve Table',
    ...otherProps
  } = props;

  return (
    <CoreRequestReservation.Action.Reserve>
      {({ onReserve, loading, error }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            disabled={loading}
            data-loading={loading}
            data-hasError={!!error}
            customElement={children}
            customElementProps={{
              onReserve,
              loading,
              error,
            }}
            content={label}
            {...otherProps}
          >
            <button onClick={onReserve} disabled={loading}>
              {loading ? 'Creating Reservation...' : label}
            </button>
          </AsChildSlot>
        );
      }}
    </CoreRequestReservation.Action.Reserve>
  );
});

/**
 * Props for RequestReservation PartySizeRepeater component
 */
export interface PartySizeRepeaterProps {
  /** Render prop function that receives party size data for each option */
  children: React.ReactNode;
}

/**
 * Repeater component that renders individual party size components for each option.
 * Maps over party size options and provides context for each individual party size.
 *
 * @component
 * @example
 * ```tsx
 * <RequestReservation.PartySizeRepeater>
 *   {({ partySize, isSelected, selectPartySize }) => (
 *     <CorePartySize.Root
 *       key={partySize}
 *       partySize={partySize}
 *       isSelected={isSelected}
 *       selectPartySize={selectPartySize}
 *     >
 *       <CorePartySize.Size />
 *       <CorePartySize.Action.Select />
 *     </CorePartySize.Root>
 *   )}
 * </RequestReservation.PartySizeRepeater>
 * ```
 */
export const PartySizeRepeater = (props: PartySizeRepeaterProps) => {
  const { children } = props;

  return (
    <CoreRequestReservation.PartySizes>
      {({ partySizeOptions, selectedPartySize, selectPartySize }) => (
        <>
          {partySizeOptions.map((partySize) => (
            <CorePartySize.Root
              key={partySize}
              partySize={partySize}
              isSelected={selectedPartySize === partySize}
              selectPartySize={() => selectPartySize(partySize)}
            >
              {children}
            </CorePartySize.Root>
          ))}
        </>
      )}
    </CoreRequestReservation.PartySizes>
  );
};

/**
 * Props for RequestReservation LocationRepeater component
 */
export interface LocationRepeaterProps {
  /** Render prop function that receives location data for each location */
  children?: React.ReactNode;
}

/**
 * Repeater component that renders individual location components for each location.
 * Maps over locations and provides context for each individual location.
 *
 * @component
 * @example
 * ```tsx
 * <RequestReservation.LocationRepeater>
 *   {({ location, isSelected, selectLocation }) => (
 *     <CoreLocation.Root
 *       key={location._id}
 *       location={location}
 *       isSelected={isSelected}
 *       selectLocation={selectLocation}
 *     >
 *       <CoreLocation.Name />
 *       <CoreLocation.Action.Select />
 *     </CoreLocation.Root>
 *   )}
 * </RequestReservation.LocationRepeater>
 * ```
 */
export const LocationRepeater = (props: LocationRepeaterProps) => {
  const { children } = props;

  return (
    <CoreRequestReservation.Locations>
      {({ locations, selectedLocation, selectLocation }) => (
        <>
          {locations.map((location) => (
            <CoreLocation.Root
              key={location._id}
              location={location}
              isSelected={selectedLocation?._id === location._id}
              selectLocation={() => selectLocation(location)}
            >
              {children}
            </CoreLocation.Root>
          ))}
        </>
      )}
    </CoreRequestReservation.Locations>
  );
};

/**
 * Props for RequestReservation TimeSlotRepeater component
 */
export interface TimeSlotRepeaterProps {
  /** Render prop function that receives time slot data for each time slot */
  children?: React.ReactNode;
  /** Maximum number of time slots to display around the selected slot */
  slotsLimit?: number;
  /** Whether to show unavailable time slots */
  showUnavailableSlots?: boolean;
}

/**
 * Repeater component that renders individual time slot components for each time slot.
 * Maps over time slots and provides context for each individual time slot.
 *
 * @component
 * @example
 * ```tsx
 * <RequestReservation.TimeSlotRepeater>
 *   {({ timeSlot, isSelected, selectTimeSlot }) => (
 *     <CoreTimeSlot.Root
 *       key={timeSlot._id}
 *       timeSlot={timeSlot}
 *       isSelected={isSelected}
 *       selectTimeSlot={selectTimeSlot}
 *     >
 *       <CoreTimeSlot.Time />
 *       <CoreTimeSlot.Action.Select />
 *     </CoreTimeSlot.Root>
 *   )}
 * </RequestReservation.TimeSlotRepeater>
 * ```
 */
export const TimeSlotRepeater = (props: TimeSlotRepeaterProps) => {
  const { children, slotsLimit, showUnavailableSlots } = props;

  return (
    <CoreRequestReservation.TimeSlots
      slotsLimit={slotsLimit}
      showUnavailableSlots={showUnavailableSlots}
    >
      {({ timeSlots, selectedTimeSlot, selectTimeSlot }) =>
        timeSlots.map((timeSlot) => (
          <CoreTimeSlot.Root
            key={timeSlot.startDate?.toString()}
            timeSlot={timeSlot}
            isSelected={
              selectedTimeSlot?.startDate?.toString() ===
              timeSlot.startDate?.toString()
            }
            selectTimeSlot={() =>
              timeSlot.status === 'AVAILABLE' && selectTimeSlot(timeSlot)
            }
          >
            {children}
          </CoreTimeSlot.Root>
        ))
      }
    </CoreRequestReservation.TimeSlots>
  );
};

/**
 * Action namespace containing reservation action components
 * following the compound component pattern: RequestReservation.Action.Reserve
 */
export const Action = {
  /** Reservation creation action component */
  Reserve: ActionReserve,
} as const;
