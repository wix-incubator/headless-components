import { defineService, implementService } from '@wix/services-definitions';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import * as operationsSDK from '@wix/auto_sdk_restaurants_operations';
import * as fulfillemtMethodsSDK from '@wix/auto_sdk_restaurants_fulfillment-methods';
import { processFulfillmentTimeSlotByOperationList } from '../utils/fulfillments-utils.js';
import {
  FulfillmentsServiceAPI,
  FulfillmentsServiceConfig,
  TimeSlot,
} from '../types/fulfillments-types.js';

export const FulfillmentsServiceDefinition =
  defineService<FulfillmentsServiceAPI>('fulfillments');

export const FulfillmentsService =
  implementService.withConfig<FulfillmentsServiceConfig>()(
    FulfillmentsServiceDefinition,
    ({ getService, config }) => {
      console.log('config', config);
      if (!config.operation) {
        throw new Error('Operation ID is required');
      }

      const signalsService = getService(SignalsServiceDefinition);
      const fulfillmentsMap = new Map(
        config.fulfillments?.map(processFulfillmentTimeSlotByOperationList) ??
          [],
      );

      const fulfillments = signalsService.signal<TimeSlot[]>(
        // @ts-expect-error - operation is not typed
        fulfillmentsMap.get(config.operation?.id ?? '') ?? [],
      );
      const isLoading = signalsService.signal<boolean>(false);
      const error = signalsService.signal<string | null>(null);

      const initialSelected = fulfillments.get()?.[0] ?? null;
      const selectedFulfillment = signalsService.signal<TimeSlot | null>(
        initialSelected,
      );

      selectedFulfillment.set(initialSelected);

      const setSelectedFulfillment = (fulfillment: TimeSlot) => {
        selectedFulfillment.set(fulfillment);
      };

      if (!config.fulfillments && config.operation) {
        loadFulfillmentsServiceConfig(config.operation).then((config) => {
          const fulfillmentsMap = new Map(
            config.fulfillments?.map(
              processFulfillmentTimeSlotByOperationList,
            ) ?? [],
          );
          fulfillments.set(
            // @ts-expect-error - operation is not typed
            fulfillmentsMap.get(config.operation?.id ?? '') ?? [],
          );
          const initialSelected = fulfillments.get()?.[0] ?? null;
          selectedFulfillment.set(initialSelected);
        });
      }

      return {
        fulfillments,
        selectedFulfillment,
        isLoading,
        error,
        setSelectedFulfillment,
      };
    },
  );

export const loadFulfillmentsServiceConfig = async (
  operation?: operationsSDK.Operation,
): Promise<FulfillmentsServiceConfig> => {
  const [timeSlots, fulfillments] = await Promise.all([
    operationsSDK.calculateFirstAvailableTimeSlotsPerOperation([
      // @ts-expect-error - operation is not typed
      operation.id,
    ]),
    fulfillemtMethodsSDK
      .queryFulfillmentMethods()
      .in('_id', operation?.fulfillmentIds)
      .find(),
  ]);
  // const fulfillments = await operationsSDK.calculateFirstAvailableTimeSlotsPerOperation([
  //   operationId,
  // ]);
  console.log('fulfillments', fulfillments.items);
  // const fulfillmentsMap = new Map(fulfillments.timeSlotsPerOperation?.map(processFulfillmentTimeSlotByOperationList));
  return {
    fulfillments: timeSlots.timeSlotsPerOperation, //fulfillmentsMap.get(operationId) ?? [],
    operation: operation,
  };
};
