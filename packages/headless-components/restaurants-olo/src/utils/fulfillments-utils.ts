import * as operationsSDK from '@wix/auto_sdk_restaurants_operations';
import { DispatchType, TimeSlot } from '../types/fulfillments-types.js';

export const createTimeSlotId = (
  startTime: Date,
  endTime: Date,
  maxTimeOptions = 0,
) =>
  // maxTimeOptions is used to avoid collisions when order pacing is enabled
  `${startTime?.toUTCString()}-${endTime?.toUTCString()}-${maxTimeOptions}`;

export function hasSameByField<T>(field: keyof T, arr: T[]): boolean {
  const [first, ...rest] = arr;
  return rest.every((item) => item[field] === first?.[field]);
}

export function getMinValueObjects<T>(key: keyof T, arr: T[]): T[] {
  return arr.slice(1).reduce(
    (min, item) => {
      if (Number(item[key]) < Number(min[0]?.[key])) {
        return [item];
      } else if (Number(item[key]) === Number(min[0]?.[key])) {
        return [...min, item];
      }
      return min;
    },
    (arr[0] ? [arr[0]] : []) as T[],
  );
}

export function getMinTime(info: operationsSDK.FulfillmentInfo): number {
  return info.durationRange
    ? Number(info.durationRange.minDuration)
    : Number(info.maxTime);
}

export function getFastestTimeOptionsByFulfillmentInfo(
  arr: operationsSDK.FulfillmentInfo[],
): operationsSDK.FulfillmentInfo[] {
  const [first, ...rest] = arr;
  if (!first) {
    return [];
  }

  return rest.reduce(
    (fastestOptions, current) => {
      const currentTime = getMinTime(current!);
      const fastestTime = getMinTime(fastestOptions[0]!);

      if (currentTime < fastestTime) {
        return [current];
      } else if (currentTime === fastestTime) {
        return [...fastestOptions, current];
      }
      return fastestOptions;
    },
    [first] as operationsSDK.FulfillmentInfo[],
  );
}

export function getSlowestTimeOptionByFulfillmentInfo(
  arr: operationsSDK.FulfillmentInfo[],
): operationsSDK.FulfillmentInfo {
  return arr.reduce((max, item) => {
    const { durationRange, maxTime: maxTimeOptions } = item;
    let maxTime;
    if (max.durationRange) {
      maxTime = Number(max.durationRange?.maxDuration || 0);
    } else {
      maxTime = Number(max.maxTime || 0);
    }
    if (durationRange) {
      return Number(durationRange.maxDuration) > maxTime ? item : max;
    } else {
      return Number(maxTimeOptions) > maxTime ? item : max;
    }
  }, {} as operationsSDK.FulfillmentInfo);
}

export const createTimeRangeByFulfillmentInfo = (
  arr: operationsSDK.FulfillmentInfo[],
) => {
  const fastestOption = getFastestTimeOptionsByFulfillmentInfo(arr)[0];
  const slowestOption = getSlowestTimeOptionByFulfillmentInfo(arr);
  const minDuration =
    fastestOption?.durationRange?.minDuration ?? fastestOption?.maxTime;
  const maxDuration =
    slowestOption.durationRange?.maxDuration ?? slowestOption.maxTime;
  if (minDuration === maxDuration) {
    return { maxTimeOptions: minDuration };
  } else {
    return { durationRangeOptions: { minDuration, maxDuration } };
  }
};

export function hasSameTime(arr: operationsSDK.FulfillmentDetails[]): boolean {
  return (
    hasSameByField('fulfillmentTimeType', arr) &&
    (arr[0]?.fulfillmentTimeType === operationsSDK.FulfillmentTimeType.MAX_TIME
      ? hasSameByField('maxTimeOptions', arr)
      : arr.every((details) => {
          const { durationRangeOptions } = details;
          return (
            durationRangeOptions?.maxDuration ===
              arr[0]?.durationRangeOptions?.maxDuration &&
            durationRangeOptions?.minDuration ===
              arr[0]?.durationRangeOptions?.minDuration
          );
        }))
  );
}

export const resolveDifferentMinOrderPriceOptionByFulfillmentInfo = (
  fulfillmentInfo: operationsSDK.FulfillmentInfo[],
) => {
  const hasSameFee = hasSameByField('fee', fulfillmentInfo);

  if (hasSameFee && hasSameTime(fulfillmentInfo)) {
    // if fee and time are the same, return the object with the min order price with the min free delivery price threshold
    return getMinValueObjects(
      'freeFulfillmentPriceThreshold',
      getMinValueObjects('minOrderPrice', fulfillmentInfo),
    )[0];
  } else {
    // if the fee is the same and time is different, return the fee
    const fee = hasSameFee ? fulfillmentInfo[0]?.fee : undefined;
    // if free delivery price threshold is the same, return free delivery price threshold
    const freeFulfillmentPriceThreshold = hasSameByField(
      'freeFulfillmentPriceThreshold',
      fulfillmentInfo,
    )
      ? fulfillmentInfo[0]?.freeFulfillmentPriceThreshold
      : undefined;
    // create a time range object from all the fulfillments
    return {
      fee,
      ...createTimeRangeByFulfillmentInfo(fulfillmentInfo),
      freeFulfillmentPriceThreshold,
    };
  }
};

export const resolveSameMinOrderPriceOptionByFulfillmentInfo = (
  fulfillmentInfo: operationsSDK.FulfillmentInfo[],
) => {
  // filtering fulfillment details by order of precedent: fee, time, free delivery price threshold
  const cheapestFulfillmentInfo = getMinValueObjects('fee', fulfillmentInfo);
  const fastestFulfillmentInfo = getFastestTimeOptionsByFulfillmentInfo(
    cheapestFulfillmentInfo,
  );
  return getMinValueObjects(
    'freeFulfillmentPriceThreshold',
    fastestFulfillmentInfo,
  )[0]!;
};

export const resolveFulfillmentInfo = (
  fulfillmentInfo: operationsSDK.FulfillmentInfo[],
): operationsSDK.FulfillmentInfo | undefined => {
  if (hasSameByField('minOrderPrice', fulfillmentInfo)) {
    return resolveSameMinOrderPriceOptionByFulfillmentInfo(fulfillmentInfo);
  } else {
    return resolveDifferentMinOrderPriceOptionByFulfillmentInfo(
      fulfillmentInfo,
    );
  }
};

export const processFulfillmentTimeSlotByOperationList = (
  operationTimeSlot: operationsSDK.TimeSlotForOperation,
): [string, TimeSlot[] | undefined] => {
  return [
    operationTimeSlot.operationId ?? '',
    operationTimeSlot.timeslotsPerFulfillmentType?.map(
      (fulfillmentTimeSlot) => {
        const { timeSlot, fulfilmentType, fulfillmentInfo } =
          fulfillmentTimeSlot;
        const { startTime, endTime, orderSchedulingType } = timeSlot ?? {};
        const selectedFulfillmentInfo = resolveFulfillmentInfo(
          fulfillmentInfo!,
        );
        const fulfillmentDetails: operationsSDK.FulfillmentDetails = {
          maxTimeOptions: selectedFulfillmentInfo?.maxTime,
          durationRangeOptions: selectedFulfillmentInfo?.durationRange,
          ...selectedFulfillmentInfo,
        };

        return {
          id: createTimeSlotId(startTime!, endTime!),
          startTime: startTime!,
          endTime: endTime!,
          dispatchType:
            fulfilmentType === 'DELIVERY'
              ? DispatchType.DELIVERY
              : DispatchType.PICKUP,
          startsNow:
            orderSchedulingType === operationsSDK.OrderSchedulingType.ASAP,
          fulfillmentDetails,
        };
      },
    ),
  ];
};

// export const resolveSelectedDispatchType = ({
//   isPickupConfigured,
//   isDeliveryConfigured,
//   isPersistedDelivery,
//   isPersistedPickup,
//   operation,
//   dispatchesInfo,
// }: {
//   isPickupConfigured: boolean;
//   isDeliveryConfigured: boolean;
//   isPersistedDelivery: boolean;
//   isPersistedPickup: boolean;
//   operation: Operation;
//   dispatchesInfo: DispatchesInfo;
// }) => {
//   const isPickupAvailable =
//     isPickupConfigured && dispatchesInfo[DispatchType.PICKUP]?.selectedTimeSlot;

//   const isDeliveryAvailable =
//     isDeliveryConfigured && dispatchesInfo[DispatchType.DELIVERY]?.selectedTimeSlot;

//   const noDispatchesAvailable = !isPickupAvailable && !isDeliveryAvailable;

//   const hasOnlyDeliveryConfigured = isDeliveryConfigured && !isPickupConfigured;

//   const isPickupByDefault =
//     (isPickupAvailable || (noDispatchesAvailable && isPickupConfigured)) &&
//     (operation.defaultDispatchType === DispatchType.PICKUP || isPersistedPickup);

//   const shouldHaveDeliverySelected =
//     ((!isPickupByDefault || isPersistedDelivery) && isDeliveryAvailable) ||
//     hasOnlyDeliveryConfigured;

//   return shouldHaveDeliverySelected ? DispatchType.DELIVERY : DispatchType.PICKUP;
// };
