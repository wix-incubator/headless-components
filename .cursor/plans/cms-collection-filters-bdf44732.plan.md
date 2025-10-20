<!-- bdf44732-878c-47e7-9cbb-54440126c162 2b26ae3a-6f2c-4d57-ae5a-c205bb380d77 -->
# CMS Collection Filters Implementation

## 1. Service Layer - Add Filter Support

**File**: `packages/headless-components/cms/src/services/cms-collection-service.ts`

### Add filter state and methods:

- Add `filterSignal: Signal<Filter | null>` to service definition (line 22-45)
- Add `setFilter: (filter: Filter) => void` method
- Add `resetFilter: () => void` method
- Add `isFiltered: () => boolean` method
- Initialize `filterSignal` in implementation (around line 133-145)

### Create WixDataFilter conversion utility:

Create a new function `applyFilterToQuery(query, filter)` that converts the object-based Filter format to WixDataFilter builder calls:

- Handle operators: `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$exists`
- Handle string operators: `$startsWith`, `$endsWith`, `$contains`
- Handle array operators: `$hasSome`, `$hasAll`, `$isEmpty`, `$isNotEmpty`
- Handle logical operators: `$and`, `$or`, `$not` (when fields have these nested)
- Support compound filters with multiple fields

Example conversion:

```typescript
// From: { age: { $gt: 25 }, status: { $eq: "active" } }
// To: items.filter().gt("age", 25).eq("status", "active")
```

### Integrate filter into loadCollectionItems:

- Update `loadCollectionItems` function (line 63-103) to accept `filter` parameter
- Apply filter to query using the conversion utility before `.find()`
- Update all `loadItems`, `invalidate`, `loadNextPage`, `loadPrevPage` calls to include current filter
- Update `setFilter` to trigger `loadItems()` with new filter

### Update service config types:

- Add `initialFilter?: Filter` to `CmsCollectionServiceConfig` interface (line 108-122)
- Add `filter?: Filter` to `loadCmsCollectionServiceInitialData` parameters (line 338-376)

## 2. Core Headless Components

**File**: `packages/headless-components/cms/src/react/core/CmsCollectionFilters.tsx` (NEW)

Create headless filter components similar to `ProductListFilters.tsx`:

### CmsCollectionFilters component:

```typescript
export interface CmsCollectionFiltersProps {
  children: ((props: CmsCollectionFiltersRenderProps) => React.ReactNode) | React.ReactNode;
}

export interface CmsCollectionFiltersRenderProps {
  filterValue: Filter;
  filterOptions: FilterOption[];
  updateFilter: (newFilter: Filter) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

export function CmsCollectionFilters(props: CmsCollectionFiltersProps)
```

Access `CmsCollectionServiceDefinition` service to get current filter state and provide update methods.

### ResetTrigger component:

```typescript
export interface ResetTriggerProps {
  children: ((props: ResetTriggerRenderProps) => React.ReactNode) | React.ReactNode;
}

export interface ResetTriggerRenderProps {
  resetFilters: () => void;
  isFiltered: boolean;
}

export function ResetTrigger(props: ResetTriggerProps)
```

## 3. Public React Components

**File**: `packages/headless-components/cms/src/react/CmsCollection.tsx`

### Add to TestIds enum (line 19-29):

```typescript
cmsCollectionFilters = 'cms-collection-filters',
cmsCollectionFilterResetTrigger = 'cms-collection-filter-reset-trigger',
```

### Create Filters component (add after Sort, around line 993):

```typescript
export interface FiltersProps {
  filterOptions: FilterOption[];
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Filters = React.forwardRef<HTMLElement, FiltersProps>((props, ref) => {
  const { filterOptions, asChild, children, className, ...otherProps } = props;
  
  return (
    <CmsCollectionFiltersPrimitive filterOptions={filterOptions}>
      {({ filterValue, updateFilter }) => (
        <FilterPrimitive.Root
          value={filterValue}
          onChange={updateFilter}
          filterOptions={filterOptions}
        >
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.cmsCollectionFilters}
            customElement={children}
            {...otherProps}
          >
            <div>{children}</div>
          </AsChildSlot>
        </FilterPrimitive.Root>
      )}
    </CmsCollectionFiltersPrimitive>
  );
});
```

### Create FilterResetTrigger component:

```typescript
export interface FilterResetTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    resetFilters: () => void;
    isFiltered: boolean;
  }>;
  className?: string;
  label?: string;
}

export const FilterResetTrigger = React.forwardRef<HTMLButtonElement, FilterResetTriggerProps>((props, ref) => {
  const { asChild, children, className, label = 'Reset Filters', ...otherProps } = props;
  
  return (
    <CoreCmsCollectionFilters.ResetTrigger>
      {({ resetFilters, isFiltered }) => {
        if (!isFiltered) return null;
        
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onClick={resetFilters}
            disabled={!isFiltered}
            data-testid={TestIds.cmsCollectionFilterResetTrigger}
            data-filtered={isFiltered}
            customElement={children}
            customElementProps={{ resetFilters, isFiltered }}
            content={label}
            {...otherProps}
          >
            <button disabled={!isFiltered}>{label}</button>
          </AsChildSlot>
        );
      }}
    </CoreCmsCollectionFilters.ResetTrigger>
  );
});
```

### Add imports at top:

```typescript
import * as CoreCmsCollectionFilters from './core/CmsCollectionFilters.js';
import { Filter as FilterPrimitive, type FilterOption } from '@wix/headless-components/react';
```

## 4. Update Documentation

**File**: `docs/api/CMS_COLLECTION_INTERFACE.md`

Update the CmsCollection.Filters section (line 229-263) with:

- Correct implementation details matching our approach
- Code examples showing filterOptions prop
- Examples using generic Filter primitives (Filter.FilterOptions, Filter.FilterOptionRepeater, etc.)
- Example with FilterResetTrigger integration

Example:

```tsx
<CmsCollection.Filters
  filterOptions={[
    {
      key: 'category',
      label: 'Category',
      type: 'single',
      displayType: 'text',
      fieldName: 'category',
      validValues: ['tech', 'lifestyle', 'business'],
    },
    {
      key: 'dateRange',
      label: 'Date',
      type: 'range',
      displayType: 'range',
      fieldName: ['createdDate.min', 'createdDate.max'],
      validValues: [0, Date.now()],
    },
  ]}
>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <Filter.FilterOption.Label />
      <Filter.FilterOption.SingleFilter />
      <Filter.FilterOption.MultiFilter />
      <Filter.FilterOption.RangeFilter />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
  <CmsCollection.FilterResetTrigger label="Clear All" />
</CmsCollection.Filters>
```

## 5. Type Exports

**File**: `packages/headless-components/cms/src/react/CmsCollection.tsx`

Ensure FilterOption type is exported for users:

```typescript
export type { FilterOption } from '@wix/headless-components/react';
```

## Key Implementation Details

### WixDataFilter Conversion Logic

The conversion utility should build filters progressively:

```typescript
function applyFilterToQuery(query, filter: Filter) {
  if (!filter) return query;
  
  let wixFilter = items.filter();
  
  for (const [fieldPath, value] of Object.entries(filter)) {
    if (typeof value === 'object' && value !== null) {
      // Handle operators
      for (const [operator, operandValue] of Object.entries(value)) {
        switch (operator) {
          case '$eq': wixFilter = wixFilter.eq(fieldPath, operandValue); break;
          case '$ne': wixFilter = wixFilter.ne(fieldPath, operandValue); break;
          case '$gt': wixFilter = wixFilter.gt(fieldPath, operandValue); break;
          case '$gte': wixFilter = wixFilter.ge(fieldPath, operandValue); break;
          case '$lt': wixFilter = wixFilter.lt(fieldPath, operandValue); break;
          case '$lte': wixFilter = wixFilter.le(fieldPath, operandValue); break;
          case '$in': wixFilter = wixFilter.hasSome(fieldPath, operandValue); break;
          case '$hasSome': wixFilter = wixFilter.hasSome(fieldPath, operandValue); break;
          case '$hasAll': wixFilter = wixFilter.hasAll(fieldPath, operandValue); break;
          case '$startsWith': wixFilter = wixFilter.startsWith(fieldPath, operandValue); break;
          case '$endsWith': wixFilter = wixFilter.endsWith(fieldPath, operandValue); break;
          case '$contains': wixFilter = wixFilter.contains(fieldPath, operandValue); break;
          case '$isEmpty': wixFilter = wixFilter.isEmpty(fieldPath); break;
          case '$isNotEmpty': wixFilter = wixFilter.isNotEmpty(fieldPath); break;
        }
      }
    } else {
      // Direct value means equality
      wixFilter = wixFilter.eq(fieldPath, value);
    }
  }
  
  return query.filter(wixFilter);
}
```

### Filter State Management

- Filter changes trigger automatic re-query via `loadItems()`
- Preserve pagination state when filtering (reset to first page)
- `resetFilter()` clears filter and reloads items
- `isFiltered()` returns true if any filter fields are set

### To-dos

- [ ] Add filter signals, state management, and methods to CmsCollectionServiceDefinition and Implementation
- [ ] Create WixDataFilter conversion utility function that converts object Filter format to WixDataFilter builder calls
- [ ] Integrate filter conversion into loadCollectionItems and update all load methods to use current filter
- [ ] Create core/CmsCollectionFilters.tsx with headless CmsCollectionFilters and ResetTrigger components
- [ ] Add Filters and FilterResetTrigger public components to CmsCollection.tsx with TestIds and proper integration
- [ ] Update CMS_COLLECTION_INTERFACE.md with correct Filters implementation examples and usage patterns