import React from 'react';
import { useService } from '@wix/services-manager-react';
import { ServiceAPI } from '@wix/services-manager/types';
import { OLOSettingsServiceDefinition } from '../../services/olo-settings-service.js';
import { FulfillmentsServiceDefinition } from '../../services/fulfillments-service.js';
import * as operationsSDK from '@wix/auto_sdk_restaurants_operations';
import { TimeSlot } from '../../types/fulfillments-types.js';

// ========================================
// SETTINGS PRIMITIVE COMPONENTS
// ========================================
// Headless components that integrate with OLOSettingsService
// Following the headless component pattern for composable UI building

// ========================================
// TYPES AND INTERFACES
// ========================================

interface CurrentTime {
  timeSlot: string;
}

interface CurrentFulfillment {
  current?: operationsSDK.TimeSlot;
}

interface CurrentLocation {
  name: string;
}

interface ExtraData {
  acceptingOrders: boolean;
  deliveryFee?: number;
  minOrderAmount?: number;
  freeDeliveryThreshold?: number;
  taxRate?: number;
  serviceCharge?: number;
  isOnline?: boolean;
  orderingDisabledReason?: string;
}

interface SettingsData {
  currentTime: CurrentTime;
  currentFulfillment: CurrentFulfillment;
  currentLocation: CurrentLocation;
  selectedFulfillment: any;
  extraData: ExtraData;
  isLoading: boolean;
  error?: string | null;
}

// ========================================
// ROOT COMPONENT
// ========================================

interface SettingsRootProps {
  children: (props: SettingsData) => React.ReactNode;
}

/**
 * Core Settings component that provides access to OLO settings data
 * Integrates with OLOSettingsService to expose operation and operation group data
 *
 * @example
 * ```tsx
 * <CoreSettings.Root>
 *   {({ currentDetails, currentFulfillment, currentLocation, extraData, isLoading, error }) => (
 *     isLoading ? (
 *       <div>Loading settings...</div>
 *     ) : error ? (
 *       <div>Error: {error}</div>
 *     ) : (
 *       <div>
 *         <h2>{currentDetails.name}</h2>
 *         <p>Accepting Orders: {extraData.acceptingOrders ? 'Yes' : 'No'}</p>
 *         <p>Delivery Fee: ${extraData.deliveryFee}</p>
 *       </div>
 *     )
 *   )}
 * </CoreSettings.Root>
 * ```
 */
export const Root: React.FC<SettingsRootProps> = ({ children }) => {
  const service = useService(OLOSettingsServiceDefinition) as ServiceAPI<
    typeof OLOSettingsServiceDefinition
  >;

  const fulfillmentsService = useService(
    FulfillmentsServiceDefinition,
  ) as ServiceAPI<typeof FulfillmentsServiceDefinition>;

  const operation = service.operation?.get();
  const selectedFulfillment = fulfillmentsService.selectedFulfillment?.get();
  console.log('selectedFulfillment', selectedFulfillment);

  const isLoading = service.isLoading?.get() ?? false;
  const error = service.error?.get();

  // Extract current details from operation group
  // Note: Using safe property access since the exact API structure may vary
  const currentTime: CurrentTime = {
    timeSlot: 'TODO', // service.currentTimeSlot?.get(),
  };

  // Extract fulfillment options from operation
  // Note: Using safe property access since the exact API structure may vary
  const currentFulfillment: CurrentFulfillment = {
    current: fulfillmentsService.selectedFulfillment?.get() ?? undefined,
  };

  // Extract location data from operation group
  // Note: Using safe property access since the exact API structure may vary
  const currentLocation: CurrentLocation = {
    name: (operation as unknown as any).locationDetails?.name,
  };

  // Extract extra data from operation
  // Note: Using safe property access since the exact API structure may vary
  const extraData: ExtraData = {
    acceptingOrders:
      (operation as any)?.status === 'ACTIVE' && !(operation as any)?.paused,
    deliveryFee:
      (operation as any)?.fulfillment?.delivery?.fee?.amount ||
      (operation as any)?.deliveryFee,
    minOrderAmount:
      (operation as any)?.orderingRules?.minimumOrderValue?.amount ||
      (operation as any)?.minOrderAmount,
    freeDeliveryThreshold:
      (operation as any)?.fulfillment?.delivery?.freeDeliveryThreshold
        ?.amount || (operation as any)?.freeDeliveryThreshold,
    taxRate:
      (operation as any)?.pricing?.taxRate || (operation as any)?.taxRate,
    serviceCharge:
      (operation as any)?.pricing?.serviceCharge?.amount ||
      (operation as any)?.serviceCharge,
    isOnline: (operation as any)?.status === 'ACTIVE',
    orderingDisabledReason: (operation as any)?.paused
      ? (operation as any)?.pauseReason
      : undefined,
  };

  return children({
    currentTime,
    currentFulfillment,
    selectedFulfillment,
    currentLocation,
    extraData,
    isLoading,
    error,
  });
};

// ========================================
// CURRENT DETAILS COMPONENT
// ========================================

interface CurrentTimeSlotProps {
  children: (props: {
    timeSlot: TimeSlot;
    hasDetails: boolean;
  }) => React.ReactNode;
}

/**
 * Component that provides access to current store details
 *
 * @example
 * ```tsx
 * <CoreSettings.CurrentTimeSlot>
 *   {({ details, hasDetails }) => (
 *     hasDetails ? (
 *       <div>
 *         <h3>{details.timeSlot}</h3>
 *       </div>
 *     ) : (
 *       <div>No store details available</div>
 *     )
 *   )}
 * </CoreSettings.CurrentTimeSlot>
 * ```
 */
export const CurrentTimeSlot: React.FC<CurrentTimeSlotProps> = ({
  children,
}) => {
  return (
    <Root>
      {({ selectedFulfillment }) => {
        const hasDetails = Boolean(selectedFulfillment);
        console.log('selectedFulfillment', selectedFulfillment);
        console.log(
          'timeSlot',
          selectedFulfillment?.startTime.toLocaleString(),
        );
        return children({
          timeSlot: selectedFulfillment,
          hasDetails,
        });
      }}
    </Root>
  );
};

// ========================================
// CURRENT FULFILLMENT COMPONENT
// ========================================

interface CurrentFulfillmentProps {
  children: (props: {
    fulfillment: CurrentFulfillment;
    hasFulfillment: boolean;
    availableOptions: string[];
  }) => React.ReactNode;
}

/**
 * Component that provides access to current fulfillment options
 *
 * @example
 * ```tsx
 * <CoreSettings.CurrentFulfillment>
 *   {({ fulfillment, availableOptions }) => (
 *     <div>
 *       <h3>Available Options:</h3>
 *       {availableOptions.map(option => (
 *         <div key={option}>{option}: Available</div>
 *       ))}
 *     </div>
 *   )}
 * </CoreSettings.CurrentFulfillment>
 * ```
 */
export const CurrentFulfillment: React.FC<CurrentFulfillmentProps> = ({
  children,
}) => {
  return (
    <Root>
      {({ currentFulfillment }) => {
        const availableOptions: string[] = [];

        // if (currentFulfillment.pickup?.enabled) availableOptions.push('pickup');
        // if (currentFulfillment.delivery?.enabled) availableOptions.push('delivery');

        const hasFulfillment = availableOptions.length > 0;

        return children({
          fulfillment: currentFulfillment,
          hasFulfillment,
          availableOptions,
        });
      }}
    </Root>
  );
};

// ========================================
// CURRENT LOCATION COMPONENT
// ========================================

interface CurrentLocationProps {
  children: (props: {
    location: CurrentLocation;
    hasLocation: boolean;
  }) => React.ReactNode;
}

/**
 * Component that provides access to current location data
 *
 * @example
 * ```tsx
 * <CoreSettings.CurrentLocation>
 *   {({ location, hasCoordinates }) => (
 *     <div>
 *       <p>{location.address}</p>
 *       {hasCoordinates && (
 *         <p>Coordinates: {location.latitude}, {location.longitude}</p>
 *       )}
 *     </div>
 *   )}
 * </CoreSettings.CurrentLocation>
 * ```
 */
export const CurrentLocation: React.FC<CurrentLocationProps> = ({
  children,
}) => {
  return (
    <Root>
      {({ currentLocation }) => {
        console.log('currentLocation', currentLocation);
        const hasLocation = Boolean(currentLocation.name);

        return children({
          location: currentLocation,
          hasLocation,
        });
      }}
    </Root>
  );
};

// ========================================
// EXTRA DATA COMPONENT
// ========================================

interface ExtraDataProps {
  children: (props: {
    extraData: ExtraData;
    hasExtraData: boolean;
  }) => React.ReactNode;
}

/**
 * Component that provides access to extra settings data
 *
 * @example
 * ```tsx
 * <CoreSettings.ExtraData>
 *   {({ extraData }) => (
 *     <div>
 *       <p>Accepting Orders: {extraData.acceptingOrders ? 'Yes' : 'No'}</p>
 *       <p>Delivery Fee: ${extraData.deliveryFee}</p>
 *       <p>Min Order: ${extraData.minOrderAmount}</p>
 *       <p>Free Delivery: ${extraData.freeDeliveryThreshold}</p>
 *     </div>
 *   )}
 * </CoreSettings.ExtraData>
 * ```
 */
export const ExtraData: React.FC<ExtraDataProps> = ({ children }) => {
  return (
    <Root>
      {({ extraData }) => {
        const hasExtraData = Boolean(
          extraData.deliveryFee !== undefined ||
            extraData.minOrderAmount !== undefined ||
            extraData.freeDeliveryThreshold !== undefined,
        );

        return children({
          extraData,
          hasExtraData,
        });
      }}
    </Root>
  );
};
