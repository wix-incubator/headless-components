import { DispatchType } from './fulfillments-types.js';

export type MinMaxRange = {
  min: number;
  max: number;
};

export type AsapScheduling = {
  maxInMinutes?: number;
  rangeInMinutes?: MinMaxRange;
};

export type PreorderScheduling = {
  timeWindowDuration: number;
  timeInAdvance: MinMaxRange;
};

export type OperationType = 'PRE_ORDER' | 'ASAP';

type BaseOperation = {
  id: string;
  name: string;
};

export interface StreetAddress {
  apt?: String;
  formattedAddressLine?: String;
  name?: String;
  number?: String;
}

export interface Address {
  addressLine?: String;
  addressLine2?: String;
  city?: String;
  country?: String;
  countryFullname?: String;
  formattedAddress?: String;
  hint?: String;
  postalCode?: String;
  streetAddress?: StreetAddress;
  subdivision?: String;
  subdivisionFullname?: String;
}

export type OSLocation = {
  name: string;
  address?: Address;
  default?: boolean;
  timeZone?: string;
};

export type Operation = BaseOperation & {
  enabled: boolean;
  fulfillmentIds: string[];
  asapOptions?: AsapScheduling;
  allowAsapFutureHandling?: boolean;
  businessDaysAheadHandlingOptions?: number;
  operationType: OperationType;
  preOrderOptions?: PreorderScheduling;
  defaultDispatchType?: DispatchType;
  operationGroupId: string;
  locationId: string;
  locationDetails?: OSLocation;
};
