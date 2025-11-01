import React from 'react';
import { CoreSettings } from './core/index.js';
// import { OLOSettingsServiceConfig } from '../services/olo-settings-service.js';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';

// ========================================
// OLO SETTINGS HEADLESS COMPONENTS
// ========================================
// Headless components that wrap CoreSettings and provide convenient service management
// These components handle service initialization and provide render props for UI

// ========================================
// ROOT COMPONENT
// ========================================

// interface SettingsRootProps {
//   /** Pre-loaded OLO settings service config (optional) */
//   oloSettingsServiceConfig?: OLOSettingsServiceConfig;
//   /** Children render prop that receives the settings data */
//   children: (props: {
//     currentTime: {
//       timeSlot: string;
//     };
//     currentFulfillment: {
//       pickup?: { enabled: boolean; estimatedTime?: number; instructions?: string };
//       delivery?: { enabled: boolean; estimatedTime?: number; radius?: number; instructions?: string };
//       dineIn?: { enabled: boolean; instructions?: string };
//     };
//     currentLocation: {
//       latitude?: number;
//       longitude?: number;
//       address?: string;
//       city?: string;
//       state?: string;
//       zipCode?: string;
//       country?: string;
//     };
//     extraData: {
//       acceptingOrders: boolean;
//       deliveryFee?: number;
//       minOrderAmount?: number;
//       freeDeliveryThreshold?: number;
//       taxRate?: number;
//       serviceCharge?: number;
//       isOnline?: boolean;
//       orderingDisabledReason?: string;
//     };
//     isLoading: boolean;
//     error?: string | null;
//   }) => React.ReactNode;
// }

/**
 * Root headless component for OLO Settings
 * Provides access to current details, fulfillment options, location, and extra data
 *
 * @example
 * ```tsx
 * <Settings.Root>
 *   {({ currentDetails, currentFulfillment, currentLocation, extraData, isLoading, error }) => (
 *     isLoading ? (
 *       <div>Loading settings...</div>
 *     ) : error ? (
 *       <div>Error: {error}</div>
 *     ) : (
 *       <div>
 *         <h2>{currentDetails.name}</h2>
 *         <p>{currentDetails.address}</p>
 *         <p>Accepting Orders: {extraData.acceptingOrders ? 'Yes' : 'No'}</p>
 *         <p>Delivery Fee: ${extraData.deliveryFee}</p>
 *         <p>Min Order: ${extraData.minOrderAmount}</p>
 *         <p>Free Delivery: ${extraData.freeDeliveryThreshold}</p>
 *       </div>
 *     )
 *   )}
 * </Settings.Root>
 * ```
 */
// export const Root: React.FC<SettingsRootProps> = ({
//   oloSettingsServiceConfig: _oloSettingsServiceConfig,
//   children,
// }) => {
//   return (
//     <CoreSettings.Root>
//       {children}
//     </CoreSettings.Root>
//   );
// };

// ========================================
// CURRENT DETAILS COMPONENT
// ========================================

interface CurrentTimeSlotProps {
  /** Children render prop that receives the current details */
  children?: AsChildChildren<{ timeSlot: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Whether to render as a child component */
  asChild?: boolean;
}

/**
 * Headless component for current store details
 * Provides access to store name, address, contact info, and hours
 *
 * @example
 * ```tsx
 * <Settings.CurrentTimeSlot>
 *   {({ details, hasDetails }) => (
 *     hasDetails ? (
 *       <div>
 *         <h3>{details.name}</h3>
 *         <p>{details.address}</p>
 *         <p>{details.phone}</p>
 *         <p>{details.email}</p>
 *       </div>
 *     ) : (
 *       <div>No store details available</div>
 *     )
 *   )}
 * </Settings.CurrentTimeSlot>
 * ```
 */
// export const CurrentTimeSlot2: React.FC<CurrentTimeSlotProps> = ({ children }) => {
//   return <CoreSettings.CurrentTimeSlot>{children}</CoreSettings.CurrentTimeSlot>;
// };

export const CurrentTimeSlot = React.forwardRef<
  HTMLElement,
  CurrentTimeSlotProps
>(({ asChild, children, className, ...rest }, ref) => {
  return (
    <CoreSettings.CurrentTimeSlot>
      {({ timeSlot, hasDetails }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          // testId={TestIds.currentTimeSlot}
          className={className}
          customElement={children}
          customElementProps={{ timeSlot, hasDetails }}
          content={timeSlot}
          {...rest}
        >
          {timeSlot?.dispatchType}
          {timeSlot?.startTime.toLocaleString() +
            ' - ' +
            timeSlot?.endTime.toLocaleString()}
        </AsChildSlot>
      )}
    </CoreSettings.CurrentTimeSlot>
  );
});
CurrentTimeSlot.displayName = 'Settings.CurrentTimeSlot';

// ========================================
// CURRENT FULFILLMENT COMPONENT
// ========================================

// interface CurrentFulfillmentProps {
//   /** Children render prop that receives the fulfillment options */
//   children: (props: {
//     fulfillment: {
//       pickup?: { enabled: boolean; estimatedTime?: number; instructions?: string };
//       delivery?: { enabled: boolean; estimatedTime?: number; radius?: number; instructions?: string };
//       dineIn?: { enabled: boolean; instructions?: string };
//     };
//     hasFulfillment: boolean;
//     availableOptions: string[];
//   }) => React.ReactNode;
// }

/**
 * Headless component for current fulfillment options
 * Provides access to pickup, delivery, and dine-in options
 *
 * @example
 * ```tsx
 * <Settings.CurrentFulfillment>
 *   {({ fulfillment, availableOptions }) => (
 *     <div>
 *       <h3>Available Options:</h3>
 *       {availableOptions.map(option => (
 *         <div key={option}>
 *           {option}: {fulfillment[option]?.enabled ? 'Available' : 'Unavailable'}
 *           {fulfillment[option]?.estimatedTime && (
 *             <span> - {fulfillment[option].estimatedTime} mins</span>
 *           )}
 *         </div>
 *       ))}
 *     </div>
 *   )}
 * </Settings.CurrentFulfillment>
 * ```
 */
// export const CurrentFulfillment: React.FC<CurrentFulfillmentProps> = ({ children }) => {
//   return <CoreSettings.CurrentFulfillment>{children}</CoreSettings.CurrentFulfillment>;
// };

// ========================================
// CURRENT LOCATION COMPONENT
// ========================================

interface CurrentLocationProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Children render prop that receives the location data */
  children?: AsChildChildren<{
    currentLocation: {
      name: string;
    };
    hasLocation: boolean;
  }>;
}

/**
 * Headless component for current location data
 * Provides access to store location and coordinates
 *
 * @example
 * ```tsx
 * <Settings.CurrentLocation>
 *   {({ location, hasLocation }) => (
 *     <div>
 *       <p>{currentLocation.name}</p>
 *       {hasLocation && (
 *         <p>Coordinates: {location.latitude}, {location.longitude}</p>
 *       )}
 *     </div>
 *   )}
 * </Settings.CurrentLocation>
 * ```
 */
export const CurrentLocation: React.FC<CurrentLocationProps> = ({
  children,
  className,
  asChild,
}) => {
  return (
    <CoreSettings.CurrentLocation>
      {({ location, hasLocation }) => (
        <AsChildSlot
          // ref={ref}
          asChild={asChild}
          // testId={TestIds.currentLocation}
          className={className}
          customElement={children}
          customElementProps={{ location, hasLocation }}
          content={location.name}
          // {...rest}
        >
          {location.name}
        </AsChildSlot>
      )}
    </CoreSettings.CurrentLocation>
  );
};

// ========================================
// EXTRA DATA COMPONENT
// ========================================

interface ExtraDataProps {
  /** Children render prop that receives the extra settings data */
  children: (props: {
    extraData: {
      acceptingOrders: boolean;
      deliveryFee?: number;
      minOrderAmount?: number;
      freeDeliveryThreshold?: number;
      taxRate?: number;
      serviceCharge?: number;
      isOnline?: boolean;
      orderingDisabledReason?: string;
    };
    hasExtraData: boolean;
  }) => React.ReactNode;
}

/**
 * Headless component for extra settings data
 * Provides access to ordering status, fees, and thresholds
 *
 * @example
 * ```tsx
 * <Settings.ExtraData>
 *   {({ extraData, hasExtraData }) => (
 *     hasExtraData ? (
 *       <div>
 *         <p>Status: {extraData.acceptingOrders ? 'Open' : 'Closed'}</p>
 *         {extraData.orderingDisabledReason && (
 *           <p>Reason: {extraData.orderingDisabledReason}</p>
 *         )}
 *         <p>Delivery Fee: ${extraData.deliveryFee}</p>
 *         <p>Min Order: ${extraData.minOrderAmount}</p>
 *         <p>Free Delivery: ${extraData.freeDeliveryThreshold}</p>
 *         <p>Tax Rate: {extraData.taxRate}%</p>
 *       </div>
 *     ) : (
 *       <div>No additional settings available</div>
 *     )
 *   )}
 * </Settings.ExtraData>
 * ```
 */
export const ExtraData: React.FC<ExtraDataProps> = ({ children }) => {
  return <CoreSettings.ExtraData>{children}</CoreSettings.ExtraData>;
};
