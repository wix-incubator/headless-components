import * as operationsSDK from '@wix/auto_sdk_restaurants_operations';
import { Signal } from '@wix/services-definitions/core-services/signals';

export enum DispatchType {
  /** Pickup fulfillment */
  PICKUP = 'PICKUP',
  /** Delivery fulfillment */
  DELIVERY = 'DELIVERY',
}

export type TimeSlot = {
  id: string;
  startTime: Date;
  endTime: Date;
  dispatchType: DispatchType;
  startsNow?: boolean;
  fulfillmentDetails: operationsSDK.FulfillmentDetails;
};

export interface Fulfillment {
  id: string;
  name: string;
  type: string;
  isAvailable: boolean;
}

export interface FulfillmentsServiceAPI {
  fulfillments: Signal<TimeSlot[]>;
  selectedFulfillment: Signal<TimeSlot | null>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  setSelectedFulfillment: (fulfillment: TimeSlot) => void;
}

export interface FulfillmentsServiceConfig {
  fulfillments?: operationsSDK.TimeSlotForOperation[];
  operation?: operationsSDK.Operation;
}
