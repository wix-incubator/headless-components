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
  ListVariant,
  GenericListRootProps,
  GenericListItemsProps,
  GenericListLoadMoreProps,
  GenericListLoadMoreRenderProps,
  GenericListTotalsProps,
  GenericListTotalsRenderProps,
  GenericListRepeaterProps,
  GenericListRepeaterRenderProps,
} from './generic-list.js';
