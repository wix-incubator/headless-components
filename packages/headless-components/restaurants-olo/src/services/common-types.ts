import * as currentCart from '@wix/auto_sdk_ecom_current-cart';

export type LineItem = currentCart.LineItem;
export type DescriptionLine = currentCart.DescriptionLine;

export enum AvailabilityStatus {
  AVAILABLE,
  NOT_AVAILABLE,
  OUT_OF_STOCK,
  NEXT_AVAILABILITY_PICKUP,
  NEXT_AVAILABILITY_DELIVERY,
}
export type NextAvailability =
  | AvailabilityStatus.NEXT_AVAILABILITY_PICKUP
  | AvailabilityStatus.NEXT_AVAILABILITY_DELIVERY;
export type AvailabilityStatusWithActionObject = {
  text?: string;
  buttonText?: string;
};
export type AvailabilityStatusObject = {
  text?: string;
};
export type AvailabilityStatusMap = Partial<
  Record<
    Exclude<AvailabilityStatus, NextAvailability>,
    AvailabilityStatusObject
  >
> &
  Record<NextAvailability, AvailabilityStatusWithActionObject>;
