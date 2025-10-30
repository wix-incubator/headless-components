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

export type AvailabilityStatusMap = Partial<
  Record<
    Exclude<
      AvailabilityStatus,
      | AvailabilityStatus.NEXT_AVAILABILITY_PICKUP
      | AvailabilityStatus.NEXT_AVAILABILITY_DELIVERY
    >,
    { text?: string }
  >
> &
  Partial<
    Record<
      | AvailabilityStatus.NEXT_AVAILABILITY_PICKUP
      | AvailabilityStatus.NEXT_AVAILABILITY_DELIVERY,
      { text?: string; buttonText?: string }
    >
  >;
