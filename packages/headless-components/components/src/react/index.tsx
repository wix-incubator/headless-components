/**
 * @fileoverview Platform Components - Non-vertical specific utility components
 *
 * This module exports components that serve as utilities for verticals,
 * providing platform-agnostic functionality like sorting and filtering.
 */

// Sort Components
export * as Sort from './sort.js';
export type {
  SortValue,
  SortOption,
  SortRootProps,
  SortOptionProps,
  ButtonProps,
} from './sort.js';

// Filter Components
export * as Filter from './filter.js';
export type {
  Filter as FilterValue,
  FilterOption,
  FilterRootProps,
  FilterFilteredProps,
  FilterOptionsProps,
  FilterOptionRepeaterProps,
  FilterActionClearProps,
  FilterOptionLabelProps,
  SingleFilterProps,
  MultiFilterProps,
  RangeFilterProps,
} from './filter.js';

// Quantity Components
export * as Quantity from './quantity.js';
export type {
  QuantityRootProps,
  QuantityIncrementProps,
  QuantityDecrementProps,
  QuantityInputProps,
  QuantityResetProps,
} from './quantity.js';

// GenericList Components
export * as GenericList from './generic-list.js';
export type {
  ListItem,
  GenericListRootProps,
  GenericListItemsProps,
  GenericListLoadMoreProps,
  GenericListLoadMoreRenderProps,
  GenericListTotalsProps,
  GenericListTotalsRenderProps,
} from './generic-list.js';

// Price Components
export * as Price from './price.js';
export type {
  Money,
  DiscountValue,
  PriceRange,
  Price as PriceData,
  PriceContextValue,
  PriceRangeContextValue,
  PriceRootProps,
  PriceRawProps,
  PriceAmountProps,
  PriceCurrencyProps,
  PriceSymbolProps,
  PriceFormattedProps,
  PriceCompareAtProps,
  PriceDiscountProps,
  PriceDiscountPercentageProps,
  PriceMinProps,
  PriceMaxProps,
  PriceRangeProps,
} from './price.js';

// Address Components
export * as Address from './address.js';
export { getDefaultCountryList } from './address.js';
export type {
  Address as AddressValue,
  AddressData,
  CountryOption,
  StateOption,
  AddressContextValue,
  AddressFormContextValue,
  AddressRootProps,
  AddressLine1Props,
  AddressLine2Props,
  AddressCityProps,
  AddressStateProps,
  AddressPostalCodeProps,
  AddressCountryProps,
  AddressCountryCodeProps,
  AddressFormattedProps,
  AddressLabelProps,
  AddressFormProps,
  AddressFormLine1InputProps,
  AddressFormLine2InputProps,
  AddressFormCityInputProps,
  AddressFormStateInputProps,
  AddressFormPostalCodeInputProps,
  AddressFormCountrySelectProps,
} from './address.js';
