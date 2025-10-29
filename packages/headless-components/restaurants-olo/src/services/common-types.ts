import * as currentCart from '@wix/auto_sdk_ecom_current-cart';

export type LineItem = currentCart.LineItem;
export type DescriptionLine = currentCart.DescriptionLine;

export enum RuleType {
  NO_LIMIT,
  CHOOSE_ONE,
  CHOOSE_X,
  CHOOSE_AT_LEAST_ONE,
  CHOOSE_AT_LEAST_X,
  CHOOSE_UP_TO_X,
  CHOOSE_BETWEEN_X_AND_Y,
}
