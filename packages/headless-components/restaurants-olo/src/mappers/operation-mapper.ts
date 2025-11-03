import * as operationsSDK from '@wix/auto_sdk_restaurants_operations';
import { DispatchType } from '../types/fulfillments-types.js';
import {
  AsapScheduling,
  Operation,
  OSLocation,
  PreorderScheduling,
} from '../types/operation.js';

const TIME_UNIT_MULTIPLIER: Record<operationsSDK.TimeUnit, number> = {
  MINUTES: 1,
  UNKNOWN_TIME_UNIT: 0,
  DAYS: 24 * 60,
  HOURS: 60,
};

const getAsapOptionsFromOperation = (
  operation: operationsSDK.Operation,
): AsapScheduling | undefined => {
  if (!operation.orderScheduling?.asapOptions) {
    return;
  }
  const { timeRangeOptions, maxTimeOptions } =
    operation.orderScheduling.asapOptions.preparationTime || {};
  if (
    maxTimeOptions &&
    maxTimeOptions.duration !== null &&
    maxTimeOptions.duration !== undefined &&
    maxTimeOptions.timeUnit
  ) {
    return {
      maxInMinutes:
        maxTimeOptions.duration * TIME_UNIT_MULTIPLIER[maxTimeOptions.timeUnit],
    };
  }
  if (
    timeRangeOptions &&
    timeRangeOptions.timeUnit &&
    timeRangeOptions.maxDuration !== undefined &&
    timeRangeOptions.maxDuration !== null &&
    timeRangeOptions.minDuration !== undefined &&
    timeRangeOptions.minDuration !== null
  ) {
    return {
      rangeInMinutes: {
        min:
          timeRangeOptions.minDuration *
          TIME_UNIT_MULTIPLIER[timeRangeOptions.timeUnit],
        max:
          timeRangeOptions.maxDuration *
          TIME_UNIT_MULTIPLIER[timeRangeOptions.timeUnit],
      },
    };
  }
};

function getPreOrderOptions(
  operation: operationsSDK.Operation,
): PreorderScheduling | undefined {
  if (!operation.orderScheduling?.preorderOptions) {
    return;
  }
  const timeBoundedOptions =
    operation.orderScheduling?.preorderOptions?.method?.timeBoundedOptions;

  if (!timeBoundedOptions) {
    return;
  }
  const { maxTimeInAdvance, minTimeInAdvance } = timeBoundedOptions;
  const max =
    TIME_UNIT_MULTIPLIER[maxTimeInAdvance?.timeUnit!] *
    maxTimeInAdvance?.duration!;
  const min =
    TIME_UNIT_MULTIPLIER[minTimeInAdvance?.timeUnit!] *
    minTimeInAdvance?.duration!;
  const timeWindowsOptions =
    operation.orderScheduling?.preorderOptions?.fulfillmentTimesDisplay
      ?.timeWindowsOptions;
  const timeWindowDuration =
    TIME_UNIT_MULTIPLIER[timeWindowsOptions!.timeUnit!] *
    timeWindowsOptions!.duration!;
  return {
    timeInAdvance: { min, max },
    timeWindowDuration,
  };
}

function getOperationType(operation: operationsSDK.Operation) {
  switch (operation.orderScheduling?.type) {
    case operationsSDK.SchedulingType.PREORDER:
      return 'PRE_ORDER';
    case operationsSDK.SchedulingType.ASAP:
    default:
      return 'ASAP';
  }
}

export const OperationMapper = (
  operation: operationsSDK.Operation,
): Operation => {
  const { asapFutureHandlingType, businessDaysAheadHandlingOptions } =
    operation.orderScheduling?.asapOptions || {};
  const { daysCount } = businessDaysAheadHandlingOptions || {};
  const allowAsapFutureHandling =
    asapFutureHandlingType ===
      operationsSDK.AsapFutureHandlingType.BUSINESS_DAYS_AHEAD_HANDLING &&
    Number(daysCount) >= 0;

  return {
    id: operation._id || '',
    name: operation.name || '',
    // @ts-expect-error - operation is not typed
    enabled: !!operation.enabled,
    fulfillmentIds: operation.fulfillmentIds || [],
    asapOptions: getAsapOptionsFromOperation(operation),
    preOrderOptions: getPreOrderOptions(operation),
    operationType: getOperationType(operation),
    allowAsapFutureHandling,
    businessDaysAheadHandlingOptions: daysCount ?? undefined,
    defaultDispatchType:
      operation.defaultFulfillmentType ===
      operationsSDK.FulfillmentType.DELIVERY
        ? DispatchType.DELIVERY
        : DispatchType.PICKUP,
    operationGroupId: operation.operationGroupId || '',
    locationId: operation.businessLocationId || '',
    // @ts-expect-error - operation is not typed
    locationDetails: operation.businessLocationDetails as OSLocation | undefined,
  };
};
