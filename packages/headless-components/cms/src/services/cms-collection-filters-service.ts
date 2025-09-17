import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
  type ReadOnlySignal,
} from '@wix/services-definitions/core-services/signals';
import { items } from '@wix/data';
import type {
  FilterValue as Filter,
  FilterOption,
} from '@wix/headless-components/react';

export type WixDataItem = items.WixDataItem;

/**
 * CMS-specific filter operators that work with Wix Data API
 */
export enum CmsFilterOperator {
  EQ = '$eq',
  NE = '$ne',
  GT = '$gt',
  GTE = '$gte',
  LT = '$lt',
  LTE = '$lte',
  HAS_SOME = '$hasSome',
  HAS_ALL = '$hasAll',
  CONTAINS = '$contains',
  STARTS_WITH = '$startsWith',
  ENDS_WITH = '$endsWith',
  IS_EMPTY = '$isEmpty',
  IS_NOT_EMPTY = '$isNotEmpty',
}

/**
 * CMS filter condition - represents a single field's filter with operators and values
 */
export type CmsFilterCondition = {
  [CmsFilterOperator.EQ]?: string | number | boolean | Date;
  [CmsFilterOperator.NE]?: string | number | boolean | Date;
  [CmsFilterOperator.GT]?: string | number | boolean | Date;
  [CmsFilterOperator.GTE]?: string | number | boolean | Date;
  [CmsFilterOperator.LT]?: string | number | boolean | Date;
  [CmsFilterOperator.LTE]?: string | number | boolean | Date;
  [CmsFilterOperator.CONTAINS]?: string;
  [CmsFilterOperator.STARTS_WITH]?: string;
  [CmsFilterOperator.ENDS_WITH]?: string;
  [CmsFilterOperator.HAS_SOME]?: Array<string | number>;
  [CmsFilterOperator.HAS_ALL]?: Array<string | number>;
  [CmsFilterOperator.IS_EMPTY]?: boolean;
  [CmsFilterOperator.IS_NOT_EMPTY]?: boolean;
};

/**
 * CMS filter value - represents the complete filter object structure
 * Each field can have multiple operators applied to it
 *
 * Examples:
 * - { "price": { "$gte": 0, "$lte": 95 } }
 * - { "tags": { "$hasSome": ["test tag", "tag2"] } }
 * - { "text": { "$startsWith": "some value" } }
 * - { "status": { "$eq": "published" }, "category": { "$hasSome": ["tech", "news"] } }
 */
export type CmsFilterValue = {
  [fieldName: string]: CmsFilterCondition;
} | null;


/**
 * Service definition for CMS Collection Filters
 */
export const CmsCollectionFiltersServiceDefinition = defineService<{
  /** Reactive signal containing the current filter state */
  filterSignal: Signal<CmsFilterValue>;
  /** Reactive signal containing available filter options */
  filterOptionsSignal: Signal<FilterOption[]>;
  /** Reactive signal indicating if any filters are active */
  hasFiltersSignal: ReadOnlySignal<boolean>;
  /** Reactive signal containing filtered items */
  filteredItemsSignal: Signal<WixDataItem[]>;
  /** Reactive signal indicating if filtering is in progress */
  filteringSignal: Signal<boolean>;
  /** Update the filter state */
  setFilter: (filter: CmsFilterValue) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Check if filters are active */
  hasActiveFilters: () => boolean;
  /** Apply filters to the collection */
  applyFilters: () => Promise<void>;
}>('cms-collection-filters');

/**
 * Configuration for the CMS Collection Filters service
 */
export interface CmsCollectionFiltersServiceConfig {
  /** Collection ID to filter */
  collectionId: string;
  /** Available filter options */
  filterOptions: FilterOption[];
  /** Initial filter state */
  initialFilter?: CmsFilterValue;
  /** Initial collection items */
  initialItems?: WixDataItem[];
}


/**
 * Checks if any filters are currently active
 */
function hasActiveFilters(
  filter: CmsFilterValue,
  filterOptions: FilterOption[],
): boolean {
  if (!filter) return false;
  return filterOptions.some((option) => {
    const fieldValue = filter[option.fieldName as string];
    return fieldValue !== undefined && fieldValue !== null;
  });
}

/**
 * Converts CMS filter value to Wix Data query filter
 */
function convertToWixDataFilter(filter: CmsFilterValue): Record<string, any> {
  if (!filter) return {};

  const wixFilter: Record<string, any> = {};

  Object.entries(filter).forEach(([fieldName, condition]) => {
    if (condition !== undefined && condition !== null) {
      // CmsFilterCondition is already in the correct operator format
      // e.g., { $eq: 'value', $ne: 'other' } or { $hasSome: ['tag1', 'tag2'] }
      wixFilter[fieldName] = condition;
    }
  });

  return wixFilter;
}

/**
 * Implementation of the CMS Collection Filters service
 */
export const CmsCollectionFiltersServiceImplementation =
  implementService.withConfig<CmsCollectionFiltersServiceConfig>()(
    CmsCollectionFiltersServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      // Initialize signals
      const filterSignal = signalsService.signal<Filter>(
        config.initialFilter || null,
      );
      const filterOptionsSignal = signalsService.signal<FilterOption[]>(
        config.filterOptions,
      );
      const filteredItemsSignal = signalsService.signal<WixDataItem[]>(
        config.initialItems || [],
      );
      const filteringSignal = signalsService.signal<boolean>(false);

      // Computed signal for hasFilters
      const hasFiltersSignal = signalsService.computed(() => {
        const currentFilter = filterSignal.get();
        const filterOptions = filterOptionsSignal.get();
        return hasActiveFilters(currentFilter, filterOptions);
      });

      /**
       * Update the filter state
       */
      const setFilter = (filter: CmsFilterValue) => {
        filterSignal.set(filter);
        // Auto-apply filters when they change
        applyFilters();
      };

      /**
       * Clear all filters
       */
      const clearFilters = () => {
        filterSignal.set(null);
        // Reset to initial items
        filteredItemsSignal.set(config.initialItems || []);
      };

      /**
       * Check if filters are active
       */
      const hasActiveFiltersCheck = (): boolean => {
        const currentFilter = filterSignal.get();
        const filterOptions = filterOptionsSignal.get();
        return hasActiveFilters(currentFilter, filterOptions);
      };

      /**
       * Apply filters to the collection by querying Wix Data
       */
      const applyFilters = async (): Promise<void> => {
        const currentFilter = filterSignal.get();

        if (!currentFilter || !hasActiveFiltersCheck()) {
          // No filters, return initial items
          filteredItemsSignal.set(config.initialItems || []);
          return;
        }

        filteringSignal.set(true);

        try {
          // Convert platform filter to Wix Data filter format
          const wixFilter = convertToWixDataFilter(currentFilter);

          // Query with filters
          let query = items.query(config.collectionId);

          // Apply filter conditions
          Object.entries(wixFilter).forEach(([fieldName, condition]) => {
            if (typeof condition === 'object' && condition !== null) {
              Object.entries(condition).forEach(([operator, value]) => {
                switch (operator) {
                  case CmsFilterOperator.EQ:
                    query = query.eq(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.NE:
                    query = query.ne(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.GT:
                    query = query.gt(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.GTE:
                    query = query.ge(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.LT:
                    query = query.lt(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.LTE:
                    query = query.le(
                      fieldName,
                      value as string | number | Date,
                    );
                    break;
                  case CmsFilterOperator.HAS_SOME:
                    if (Array.isArray(value)) {
                      query = query.hasSome(fieldName, value);
                    }
                    break;
                  case CmsFilterOperator.HAS_ALL:
                    if (Array.isArray(value)) {
                      query = query.hasAll(fieldName, value);
                    }
                    break;
                  case CmsFilterOperator.CONTAINS:
                    query = query.contains(fieldName, value as string);
                    break;
                  case CmsFilterOperator.STARTS_WITH:
                    query = query.startsWith(fieldName, value as string);
                    break;
                  case CmsFilterOperator.ENDS_WITH:
                    query = query.endsWith(fieldName, value as string);
                    break;
                  case CmsFilterOperator.IS_EMPTY:
                    if (value) {
                      query = query.isEmpty(fieldName);
                    } else {
                      query = query.isNotEmpty(fieldName);
                    }
                    break;
                  case CmsFilterOperator.IS_NOT_EMPTY:
                    if (value) {
                      query = query.isNotEmpty(fieldName);
                    } else {
                      query = query.isEmpty(fieldName);
                    }
                    break;
                }
              });
            }
          });

          const result = await query.find();
          filteredItemsSignal.set(result.items);
        } catch (error) {
          console.error('Failed to apply filters:', error);
          // On error, keep current items
        } finally {
          filteringSignal.set(false);
        }
      };

      return {
        filterSignal,
        filterOptionsSignal,
        hasFiltersSignal,
        filteredItemsSignal,
        filteringSignal,
        setFilter,
        clearFilters,
        hasActiveFilters: hasActiveFiltersCheck,
        applyFilters,
      };
    },
  );

/**
 * Load initial configuration for CMS Collection Filters service
 */
export const loadCmsCollectionFiltersServiceConfig = async (
  collectionId: string,
  filterOptions: FilterOption[],
  initialFilter?: CmsFilterValue,
): Promise<CmsCollectionFiltersServiceConfig> => {
  try {
    // Load initial items
    const result = await items.query(collectionId).find();

    return {
      collectionId,
      filterOptions,
      initialFilter,
      initialItems: result.items,
    };
  } catch (error) {
    console.error(
      `Failed to load CMS collection filters config for "${collectionId}":`,
      error,
    );
    throw error;
  }
};
