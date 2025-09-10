# Platform Interfaces

Components which are not specific to a single vertical, serves as utilities for the verticals.

### Sort.Root

Container for sort controls that provides sort context and manages sort state. Supports both declarative (sortOptions prop) and programmatic (children) APIs.

**Type Definitions**

```tsx
/** Wix SDK sort array format - the only sort format we support */
export type SortValue = Array<{
  fieldName?: string;
  order?: string; // Wix SDK format (typically 'ASC'/'DESC')
}>;

interface SortFieldOption {
  fieldName: string;
  label: string;
}

interface SortOrderOption {
  order: 'ASC' | 'DESC';
  label: string;
}

interface FullSortOption {
  fieldName: string;
  order: 'ASC' | 'DESC';
  label: string;
}

/** Sort option configuration */
export type SortOption = SortFieldOption | SortOrderOption | FullSortOption;
```

**Props**

```tsx
interface SortRootProps {
  /** Predefined sort options for declarative API */
  sortOptions?: Array<SortOption>;
  /** Current sort value - Wix SDK array format */
  value?: SortValue;
  /** Function called when sort changes - receives Wix SDK array format */
  onChange: (value: SortValue) => void;
  /** Render mode - 'select' uses native HTML select, 'list' provides custom controls (default: 'select') */
  as?: 'select' | 'list';
  /** Children components */
  children?: React.ReactNode;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}
```

**Data Attributes**

- `data-testid="sort-root"` - Applied to root container

**Example**

```tsx
// Declarative API with native select
<Sort.Root
  value={sort}
  onChange={setSort}
  sortOptions={[
    { fieldName: 'price', label: 'Price: Low to High', order: 'ASC' },
    { fieldName: 'price', label: 'Price: High to Low', order: 'DESC' },
    { fieldName: 'name', label: 'Name: A to Z', order: 'ASC' },
    { fieldName: 'name', label: 'Name: Z to A', order: 'DESC' },
  ]}
  as="select"
  className="w-full"
/>

// Custom component replacing the entire Sort root
<Sort.Root
  value={sort}
  onChange={setSort}
  sortOptions={sortOptions}
  asChild
>
  <CustomSortComponent />
</Sort.Root>

// List mode with custom buttons (programmatic API)
<Sort.Root value={sort} onChange={setSort} as="list">
  <Sort.Option fieldName="price" order="ASC" label="Price ↑" />
  <Sort.Option fieldName="price" order="DESC" label="Price ↓" />
  <Sort.Option fieldName="name" order="ASC" label="Name A-Z" />
</Sort.Root>

// Custom list container with asChild
<Sort.Root value={sort} onChange={setSort} as="list" asChild>
  <div className="custom-sort-container">
    <Sort.Option fieldName="price" order="ASC" label="Price ↑" />
    <Sort.Option fieldName="price" order="DESC" label="Price ↓" />
  </div>
</Sort.Root>
```

---

### Sort.Option

Single sort option component that represents a sort option. Can be used to set field name, order, or both. Only works within Sort.Root context.

**Props**

```tsx
interface SortOptionProps extends ButtonProps {
  /** Field name to sort by (required) */
  fieldName: string;
  /** Sort order (required) */
  order: 'ASC' | 'DESC';
  /** Display label */
  label: string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="sort-option"` - Applied to option element
- `data-selected` - Boolean indicating if this option is currently selected
- `data-field-name` - The field name of this option
- `data-order` - The sort order of this option

**Example**

```tsx
// Set both field and order
<Sort.Option fieldName="price" order="ASC" label="Price: Low to High" />

// Custom rendering with asChild
<Sort.Option fieldName="price" order="ASC" label="Price" asChild>
  <button className="sort-option-btn">
    📈 Price (Low to High)
  </button>
</Sort.Option>

// With children override
<Sort.Option fieldName="name" order="DESC" label="Name Z-A">
  <span className="sort-icon">🔤</span>
  Name: Z to A
</Sort.Option>
```

---

## Sort Architecture

The Sort components follow a streamlined architecture pattern that provides flexibility and platform compatibility:

### Component Hierarchy

```
Sort.Root (Provider & Renderer)
└── Sort.Option (Individual options)
```

### Key Design Principles

#### 1. **Dual API Pattern**

- **Declarative API**: Use `sortOptions` prop for quick setup with predefined options
- **Programmatic API**: Use child `Sort.Option` components for granular control
- **Automatic Selection**: Components choose the appropriate API based on props provided

#### 2. **Wix SDK Compatibility**

- Sort values use Wix SDK array format: `[{fieldName: 'price', order: 'ASC'}]`
- Direct compatibility with `query.sort` parameter
- Support for 'ASC'/'DESC' order values (uppercase as per Wix standards)

#### 3. **Flexible Rendering Modes**

- **Select Mode** (`as="select"`): Renders native HTML select dropdown (default)
- **List Mode** (`as="list"`): Renders as unordered list with button options
- **AsChild Pattern**: Complete control over DOM structure via Slot forwarding

#### 4. **Context-Driven Data Flow**

- SortContext provides current sort state and change handlers
- Automatic option selection state management
- Type-safe option handling with union types

#### 5. **Union Type Flexibility**

- **SortFieldOption**: Set only field name (keeps current order)
- **SortOrderOption**: Set only order (keeps current field)
- **FullSortOption**: Set both field name and order
- Enables granular control over sort behavior

### Integration Examples

#### With Stores Package

```tsx
import { ProductList } from '@wix/stores/react';
import { Sort } from '@wix/headless-components/react';

// Store-specific sort integration
<ProductList.Sort as="select" className="w-full" />

// Custom implementation using ProductList context
<ProductList.Sort asChild>
  {({ currentSort, sortOptions, setSort }) => (
    <Sort.Root
      value={currentSort}
      onChange={setSort}
      sortOptions={sortOptions}
      as="list"
    />
  )}
</ProductList.Sort>
```

#### Custom Implementation

```tsx
// Platform-agnostic usage
<Sort.Root
  value={currentSort}
  onChange={handleSortChange}
  sortOptions={[
    { fieldName: 'createdAt', order: 'DESC', label: 'Newest First' },
    { fieldName: 'createdAt', order: 'ASC', label: 'Oldest First' },
    { fieldName: 'title', order: 'ASC', label: 'Title A-Z' },
  ]}
  as="select"
/>
```

### Performance Considerations

- **Lightweight Context**: Minimal context overhead with only essential state
- **Native Elements**: Uses native HTML select for better performance and accessibility
- **Memoized Handlers**: Option selection handlers are automatically memoized

---

### Filter.Root

Container for filter controls that provides filter context and manages filter state.

**Type Definitions**

```tsx
/** Filter operators that match Wix query.filter format */
interface FilterOperators<T = any> {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
  $exists?: boolean;
  $regex?: string;
  $options?: string;
  // Array operators
  $size?: number;
  $elemMatch?: Record<string, any>;
  $all?: T[];
  // Wix-specific operators
  $hasSome?: T[];
  $hasAll?: T[];
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
  $urlized?: string;
  $isEmpty?: boolean;
  $matchItems?: Array<Record<string, any>>;
}

/** Valid filter value types */
type FilterValue<T = any> = T | FilterOperators<T> | Array<Record<string, any>>;

/** Platform filter object interface - matches query.filter format */
type Filter = {
  [fieldPath: string]: FilterValue;
} | null;
```

**Props**

```tsx
interface FilterOption {
  /** Display label for the filter */
  label: string;
  /** Filter key/field name - used as fallback if fieldName is not specified */
  key: string;
  /**
   * Target field name(s) in the filter object:
   * - For single/multi: string (e.g., 'inventory.status')
   * - For range: string[] with [minField, maxField] (e.g., ['price.min', 'price.max'])
   * - If not specified, uses key as fieldName
   */
  fieldName?: string | string[];
  /**
   * Field type determines which operators to use for multi-select filters:
   * - 'array': uses $hasSome operator (for array fields like choices)
   * - 'singular': uses $in operator (for single fields with multiple values)
   * - If not specified, defaults to 'singular'
   */
  fieldType?: 'array' | 'singular';
  /** Current filter value */
  value?: any; // number[] (for range) | string[] (for multi) | string (for single)
  /** Function to format values for display */
  valueFormatter?: (value: string | number) => string;
  /** Valid values for this filter (for validation and shared field logic) */
  validValues?: Array<string | number>;
  /** Filter input type */
  type: 'single' | 'multi' | 'range';
  /** Display type for styling/rendering */
  displayType: 'color' | 'text' | 'range';
  /** Function to format background color for color filters */
  valueBgColorFormatter?: (value: string | number) => string | null;
}

interface FilterRootProps {
  /** Current complete filter value */
  value: Filter;
  /** Function called when the complete filter changes */
  onChange: (value: Filter) => void;
  /**
   * Function called when a single filter option changes.
   * Should merge the single change into the complete filter and return the updated filter.
   * Optional - if not provided, components will handle conversions automatically using fieldName and fieldType.
   */
  onFilterChange?: ({
    value,
    key,
  }: {
    value: FilterValue;
    key: string;
  }) => Filter;
  /** Available filter options */
  filterOptions: FilterOption[];
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-root"` - Applied to root container
- `data-has-filters` - Boolean indicating if any filters are active

**Example**

```tsx
<Filter.Root
  value={filter}
  onChange={setFilter}
  filterOptions={[
    {
      key: 'category',
      label: 'Category',
      type: 'single',
      displayType: 'text',
      fieldName: 'category.id',
      validValues: ['electronics', 'clothing', 'books'],
    },
    {
      key: 'price',
      label: 'Price Range',
      type: 'range',
      displayType: 'range',
      fieldName: ['price.min', 'price.max'],
      validValues: [0, 1000],
      valueFormatter: (value) => `$${value}`,
    },
    {
      key: 'colors',
      label: 'Colors',
      type: 'multi',
      displayType: 'color',
      fieldName: 'options.choicesSettings.choices.choiceId',
      fieldType: 'array',
      validValues: ['red', 'blue', 'green'],
      valueBgColorFormatter: (value) => value.toLowerCase(),
    },
  ]}
  className="space-y-4"
>
  <Filter.Filtered>
    <Filter.Action.Clear label="Clear All" />
  </Filter.Filtered>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <div className="mb-4">
        <Filter.FilterOption.Label className="block font-medium mb-2" />
        <Filter.FilterOption.SingleFilter className="w-full" />
        <Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2" />
        <Filter.FilterOption.RangeFilter className="w-full" />
      </div>
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</Filter.Root>
```

---

### Filter.FilterOptions

Container for filter option components that provides structural organization for filter controls.

**Props**

```tsx
interface FilterOptionsProps {
  /** Child components, typically containing FilterOptionRepeater */
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-options"` - Applied to options container

**Example**

```tsx
<Filter.FilterOptions className="space-y-4">
  <Filter.FilterOptionRepeater>
    <div className="filter-group">
      <Filter.FilterOption.Label className="font-semibold mb-2" />
      <Filter.FilterOption.SingleFilter />
      <Filter.FilterOption.MultiFilter />
      <Filter.FilterOption.RangeFilter />
    </div>
  </Filter.FilterOptionRepeater>
</Filter.FilterOptions>
```

---

### Filter.FilterOptionRepeater

Repeater component that renders a template for each filter option. Maps over the filterOptions array and provides FilterOptionContext to each rendered template.

**Props**

```tsx
interface FilterOptionRepeaterProps {
  /** Template to repeat for each filter option defined in filterOptions */
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-option-repeater"` - Applied to repeater container
- `data-testid="filter-option"` - Applied to each option wrapper
- `data-filter-key` - The key of the current filter option

**Example**

```tsx
<Filter.FilterOptionRepeater>
  <div className="mb-6">
    <Filter.FilterOption.Label className="block text-sm font-medium mb-2" />
    {/* These components automatically show/hide based on option.type */}
    <Filter.FilterOption.SingleFilter className="w-full" />
    <Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2" />
    <Filter.FilterOption.RangeFilter className="space-y-2" />
  </div>
</Filter.FilterOptionRepeater>
```

---

### Filter.FilterOption.Label

Label component for filter options that displays the option.label from the FilterOptionContext.

**Props**

```tsx
interface FilterOptionLabelProps {
  /** When true, delegates rendering to child component using Slot pattern */
  asChild?: boolean;
  /** Custom content to render instead of the default option label */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-option-label"` - Applied to label element

**Example**

```tsx
// Default label rendering
<Filter.FilterOption.Label className="block text-sm font-medium text-gray-700 mb-1" />

// Custom label with asChild pattern
<Filter.FilterOption.Label asChild>
  <h3 className="text-lg font-semibold" />
</Filter.FilterOption.Label>

// Custom content overriding the label
<Filter.FilterOption.Label>
  <span className="text-blue-600">Custom Label Text</span>
</Filter.FilterOption.Label>
```

---

### Filter.FilterOption.SingleFilter

Single selection filter component that renders when option.type is 'single'. Uses Radix ToggleGroup by default for better UX and accessibility.

**Props**

```tsx
interface SingleFilterProps {
  /** When true, enables asChild pattern for custom styling */
  asChild?: boolean;
  /** Custom content for the filter component */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-option-single"` - Applied to filter element
- `data-filter-type="single"` - Filter type identifier
- `data-display-type` - The displayType from option configuration

**Example**

```tsx
// Default ToggleGroup rendering
<Filter.FilterOption.SingleFilter className="flex gap-2" />

// Custom select dropdown with asChild
<Filter.FilterOption.SingleFilter asChild>
  <select className="form-select" />
</Filter.FilterOption.SingleFilter>

// Custom styling with children
<Filter.FilterOption.SingleFilter>
  <option value="">All Categories</option>
</Filter.FilterOption.SingleFilter>
```

---

### Filter.FilterOption.MultiFilter

Multi-selection filter component that renders when option.type is 'multi'. Uses Radix ToggleGroup in multiple mode by default and supports color swatches.

**Props**

```tsx
interface MultiFilterProps {
  /** When true, enables asChild pattern for custom styling */
  asChild?: boolean;
  /** Custom content for the multi-filter component */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-option-multi"` - Applied to filter element
- `data-filter-type="multi"` - Filter type identifier
- `data-display-type` - The displayType from option configuration
- `data-color` - Color value when displayType is 'color'

**Example**

```tsx
// Default ToggleGroup rendering
<Filter.FilterOption.MultiFilter className="flex flex-wrap gap-2" />

// Color swatch display (when displayType='color')
<Filter.FilterOption.MultiFilter className="grid grid-cols-6 gap-2" />

// Custom checkbox list with asChild
<Filter.FilterOption.MultiFilter asChild>
  <div className="space-y-2" />
</Filter.FilterOption.MultiFilter>
```

---

### Filter.FilterOption.RangeFilter

Range filter component for numeric ranges that renders when option.type is 'range'. Uses Radix Slider with dual thumbs by default for smooth interaction.

**Props**

```tsx
interface RangeFilterProps {
  /** When true, enables asChild pattern for custom styling */
  asChild?: boolean;
  /** Custom content for the range filter component */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-option-range"` - Applied to filter element
- `data-filter-type="range"` - Filter type identifier
- `data-display-type` - The displayType from option configuration
- `data-range-value="min|max"` - Applied to min/max value displays

**Example**

```tsx
// Default Radix Slider rendering
<Filter.FilterOption.RangeFilter className="w-full px-4 py-2" />

// Custom dual number inputs with asChild
<Filter.FilterOption.RangeFilter asChild>
  <div className="flex items-center gap-2">
    <input type="number" placeholder="Min" className="form-input" />
    <span>to</span>
    <input type="number" placeholder="Max" className="form-input" />
  </div>
</Filter.FilterOption.RangeFilter>
```

---

### Filter.Filtered

Container that conditionally renders its children when filters are active.

**Props**

```tsx
interface FilterFilteredProps {
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-filtered"` - Applied to filtered container
- `data-has-filters` - Boolean indicating if any filters are active

**Example**

```tsx
// Default usage - only shows when filters are active
<Filter.Filtered>
  <div className="bg-surface-card border-surface-primary p-4 rounded">
    <p className="text-content-secondary">Active filters:</p>
    <Filter.Action.Clear label="Clear All" />
  </div>
</Filter.Filtered>
```

---

### Filter.Action.Clear

Button to clear all active filters. Automatically disables when no filters are active.

**Props**

```tsx
interface FilterActionClearProps extends ButtonProps {
  /** Label text for the clear button */
  label: string;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="filter-action-clear"` - Applied to clear button
- `disabled` - Boolean indicating if button is disabled (when no filters are active)

**Example**

```tsx
// Default usage
<Filter.Action.Clear
  label="Clear Filters"
  className="btn-secondary text-sm px-3 py-1"
/>

// Custom rendering with asChild
<Filter.Action.Clear label="Reset All" asChild>
  <button className="text-status-danger hover:text-status-danger-hover underline disabled:text-content-muted disabled:no-underline">
    ✕ Reset All Filters
  </button>
</Filter.Action.Clear>

// Override button content with children
<Filter.Action.Clear label="Clear All">
  Clear All Filters
</Filter.Action.Clear>
```

---

## Filter Architecture

The Filter components follow a structured architecture pattern that provides flexibility, type safety, and platform compatibility:

### Component Hierarchy

```
Filter.Root (Provider)
├── Filter.Filtered (Conditional container)
│   └── Filter.Action.Clear (Clear button)
└── Filter.FilterOptions (Options container)
    └── Filter.FilterOptionRepeater (Template repeater)
        ├── Filter.FilterOption.Label (Option label)
        ├── Filter.FilterOption.SingleFilter (Single selection)
        ├── Filter.FilterOption.MultiFilter (Multi selection)
        └── Filter.FilterOption.RangeFilter (Range selection)
```

### Key Design Principles

#### 1. **Platform Compatibility**

- Filter objects match Wix `query.filter` format exactly
- Support for all Wix filter operators (`$hasSome`, `$in`, `$gte`, `$lte`, etc.)
- Handles both singular and array field types appropriately

#### 2. **Headless/Unstyled Pattern**

- Components provide functionality without default styling
- Uses Radix UI primitives for accessibility and better UX
- Complete control over visual appearance via CSS classes

#### 3. **AsChild Pattern**

- All components support `asChild` for flexible DOM structure
- Uses Radix Slot for prop forwarding
- Enables custom elements while preserving functionality

#### 4. **Context-Driven Data Flow**

- FilterContext provides global filter state and options
- FilterOptionContext provides per-option data and update functions
- Automatic type detection and appropriate component rendering

#### 5. **Field Type Flexibility**

- **Single fields**: Direct field assignment (e.g., `{category: 'electronics'}`)
- **Dual fields**: Separate min/max fields (e.g., `{'price.min': {$gte: 10}, 'price.max': {$lte: 100}}`)
- **Array fields**: Uses `$hasSome` operator for array-based filtering
- **Singular fields**: Uses `$in` operator for multiple values in single fields

#### 6. **Enhanced UX Features**

- **Color swatches**: Automatic color display when `displayType: 'color'`
- **Value formatting**: Custom display formatting via `valueFormatter`
- **Smooth interactions**: Range sliders use local state during dragging
- **Accessibility**: Full keyboard navigation and ARIA attributes

### Integration Examples

#### With Stores Package

```tsx
import { ProductList } from '@wix/stores/react';
import { Filter } from '@wix/headless-components/react';

// Store-specific filter integration
<ProductList.Filter>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <Filter.FilterOption.Label />
      <Filter.FilterOption.MultiFilter />
      <Filter.FilterOption.RangeFilter />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</ProductList.Filter>;
```

#### Custom Implementation

```tsx
// Platform-agnostic usage
<Filter.Root
  value={filter}
  onChange={handleFilterChange}
  filterOptions={filterOptions}
>
  <Filter.Filtered>
    <Filter.Action.Clear label="Clear All" />
  </Filter.Filtered>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <CustomFilterTemplate />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</Filter.Root>
```

### Performance Considerations

- **Optimized Updates**: Components only re-render when their specific filter values change
- **Local State**: Range sliders use local state during interaction to prevent excessive API calls
- **Memoization**: Filter conversion functions are memoized to prevent unnecessary recalculations

---

### GenericList.Root

Container for list components that provides data context and manages list state. Renders items inside another model's context and supports multiple display variants, empty states, pagination, and totals.

**Type Definitions**

```tsx
/** List display variants */
export type ListVariant = 'list' | 'table' | 'grid';

/** List item interface - generic item with id */
export interface ListItem {
  id: string | number;
  [key: string]: any;
}

/** Pagination information */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  totalItems: number;
  currentPageItemCount: number;
  startIndex: number;
  endIndex: number;
}

/** Load more information */
export interface LoadMoreInfo {
  hasMore: boolean;
  isLoading: boolean;
  totalItems: number;
  currentItemCount: number;
}
```

**Props**

```tsx
interface GenericListRootProps<T extends ListItem = ListItem> {
  /** Array of items to display */
  items: T[];
  /** Function called to load more items (infinite scroll/load more pattern) */
  onLoadMore?: () => void;
  /** Function called for next page navigation */
  onNextPage?: () => void;
  /** Function called for previous page navigation */
  onPreviousPage?: () => void;
  /** Whether more items can be loaded */
  hasMore?: boolean;
  /** Whether items are currently loading */
  isLoading?: boolean;
  /** Display variant - affects layout structure (default: 'list') */
  variant?: ListVariant;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
  /** Pagination information (optional, for paginated lists) */
  pagination?: PaginationInfo;
  /** Load more information (optional, for infinite scroll lists) */
  loadMore?: LoadMoreInfo;
}
```

**Data Attributes**

- `data-testid="generic-list-root"` - Applied to root container
- `data-variant` - Current display variant ('list', 'table', 'grid')
- `data-has-items` - Boolean indicating if items are present
- `data-is-loading` - Boolean indicating loading state
- `data-has-more` - Boolean indicating if more items can be loaded

**Example**

```tsx
// Basic usage within ProductList context
export function ProductListRoot({ children }: { children: React.ReactNode }) {
  const productsListService = useService(ProductsListServiceDefinition);
  return (
    <GenericList.Root
      items={productsListService.products.get()}
      onLoadMore={productsListService.loadMore}
      onNextPage={productsListService.nextPage}
      onPreviousPage={productsListService.previousPage}
      hasMore={productsListService.hasMoreProducts.get()}
      isLoading={productsListService.isLoading.get()}
      variant="grid"
    >
      {children}
    </GenericList.Root>
  );
}

// Custom implementation with asChild
<GenericList.Root
  items={items}
  onLoadMore={handleLoadMore}
  hasMore={hasMore}
  isLoading={isLoading}
  variant="table"
  asChild
>
  <div className="custom-list-container">
    <GenericList.Items />
    <GenericList.LoadMore />
  </div>
</GenericList.Root>;
```

---

### GenericList.Items

Container for list items that handles empty state display and provides structure for item rendering. Does not render if list is empty unless emptyState is provided.

**Props**

```tsx
interface GenericListItemsProps {
  /** Content to display when no items are available */
  emptyState?: React.ReactNode;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components, typically containing ItemRepeater */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-items"` - Applied to items container
- `data-variant` - Inherited display variant from root context
- `data-empty` - Boolean indicating if list is empty

**Example**

```tsx
// Basic usage with empty state
<GenericList.Items
  emptyState={
    <div className="text-center py-8">
      <p className="text-content-secondary">No items found</p>
    </div>
  }
  className="space-y-4"
>
  <GenericList.ItemRepeater>
    <div className="border rounded p-4">
      {/* Item content */}
    </div>
  </GenericList.ItemRepeater>
</GenericList.Items>

// Custom container with asChild
<GenericList.Items emptyState={<EmptyState />} asChild>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <GenericList.ItemRepeater>
      <ProductCard />
    </GenericList.ItemRepeater>
  </div>
</GenericList.Items>
```

---

### GenericList.ItemRepeater

Repeater component that maps over items and renders the provided template for each item. Provides ItemContext to each rendered template with current item data.

**Props**

```tsx
interface GenericListItemRepeaterProps<T extends ListItem = ListItem> {
  /** Template to repeat for each item */
  children: React.ReactNode;
  /** Custom key extractor function (defaults to item.id) */
  keyExtractor?: (item: T, index: number) => string | number;
}
```

**Data Attributes**

- `data-testid="generic-list-item-repeater"` - Applied to repeater container
- `data-testid="generic-list-item"` - Applied to each item wrapper
- `data-item-id` - The ID of the current item
- `data-item-index` - The index of the current item

**Example**

```tsx
// Basic usage
<GenericList.ItemRepeater>
  <div className="list-item p-4 border-b">
    <h3 className="font-semibold">{/* Access item data via context */}</h3>
    <p className="text-sm text-content-secondary">{/* Item description */}</p>
  </div>
</GenericList.ItemRepeater>

// Custom key extractor
<GenericList.ItemRepeater keyExtractor={(item, index) => `${item.slug}-${index}`}>
  <ProductCard />
</GenericList.ItemRepeater>

// Delegating to entity Root component
<GenericList.ItemRepeater>
  <Product.Root>
    <Product.Name />
    <Product.Price />
    <Product.AddToCart />
  </Product.Root>
</GenericList.ItemRepeater>
```

---

### GenericList.LoadMore

Load more button component that appears when more items can be loaded. Automatically handles loading state and disables when no more items are available.

**Props**

```tsx
interface GenericListLoadMoreProps extends ButtonProps {
  /** Label text for the load more button */
  label?: string;
  /** Loading label text */
  loadingLabel?: string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-load-more"` - Applied to load more button
- `data-has-more` - Boolean indicating if more items can be loaded
- `data-is-loading` - Boolean indicating loading state
- `disabled` - Boolean indicating if button is disabled

**Example**

```tsx
// Default usage
<GenericList.LoadMore
  label="Load More Items"
  loadingLabel="Loading..."
  className="btn-primary w-full mt-4"
/>

// Custom rendering with asChild
<GenericList.LoadMore label="Load More" asChild>
  <button className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-primary-hover disabled:opacity-50">
    Load More Products
  </button>
</GenericList.LoadMore>

// Override button content with children
<GenericList.LoadMore label="Load More">
  <span className="flex items-center gap-2">
    <RefreshIcon className="h-4 w-4" />
    Load More Items
  </span>
</GenericList.LoadMore>
```

---

### GenericList.Pagination

Pagination controls container that provides navigation between pages when using paginated data.

**Props**

```tsx
interface GenericListPaginationProps {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-pagination"` - Applied to pagination container
- `data-current-page` - Current page number
- `data-total-pages` - Total number of pages
- `data-has-next` - Boolean indicating if next page is available
- `data-has-previous` - Boolean indicating if previous page is available

**Example**

```tsx
// Basic usage
<GenericList.Pagination className="flex items-center justify-between mt-6">
  <GenericList.Pagination.Previous />
  <GenericList.Pagination.Info />
  <GenericList.Pagination.Next />
</GenericList.Pagination>

// Custom layout with asChild
<GenericList.Pagination asChild>
  <nav className="flex items-center justify-center space-x-4 mt-8">
    <GenericList.Pagination.Previous />
    <GenericList.Pagination.Info />
    <GenericList.Pagination.Next />
  </nav>
</GenericList.Pagination>
```

---

### GenericList.Pagination.Previous

Previous page navigation button. Automatically disables when on first page.

**Props**

```tsx
interface GenericListPaginationPreviousProps extends ButtonProps {
  /** Label text for the previous button */
  label?: string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-pagination-previous"` - Applied to previous button
- `disabled` - Boolean indicating if button is disabled

**Example**

```tsx
// Default usage
<GenericList.Pagination.Previous
  label="Previous"
  className="btn-secondary px-4 py-2"
/>

// Custom rendering with icon
<GenericList.Pagination.Previous label="Previous" asChild>
  <button className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
    <ChevronLeftIcon className="h-4 w-4" />
    Previous
  </button>
</GenericList.Pagination.Previous>
```

---

### GenericList.Pagination.Next

Next page navigation button. Automatically disables when on last page.

**Props**

```tsx
interface GenericListPaginationNextProps extends ButtonProps {
  /** Label text for the next button */
  label?: string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-pagination-next"` - Applied to next button
- `disabled` - Boolean indicating if button is disabled

**Example**

```tsx
// Default usage
<GenericList.Pagination.Next
  label="Next"
  className="btn-secondary px-4 py-2"
/>

// Custom rendering with icon
<GenericList.Pagination.Next label="Next" asChild>
  <button className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 disabled:opacity-50">
    Next
    <ChevronRightIcon className="h-4 w-4" />
  </button>
</GenericList.Pagination.Next>
```

---

### GenericList.Pagination.Info

Displays pagination information including current page, total pages, and item counts.

**Props**

```tsx
interface GenericListPaginationInfoProps {
  /** Custom format function for pagination text */
  formatText?: (info: PaginationInfo) => string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-pagination-info"` - Applied to info container

**Example**

```tsx
// Default usage
<GenericList.Pagination.Info className="text-sm text-content-secondary" />

// Custom format
<GenericList.Pagination.Info
  formatText={(info) => `${info.startIndex}-${info.endIndex} of ${info.totalItems}`}
  className="text-center text-sm font-medium"
/>

// Custom rendering with asChild
<GenericList.Pagination.Info asChild>
  <div className="flex flex-col items-center text-xs text-gray-500">
    <span>Page {/* current page */} of {/* total pages */}</span>
    <span>{/* start */}-{/* end */} of {/* total */} items</span>
  </div>
</GenericList.Pagination.Info>
```

---

### GenericList.Totals

Displays total item count and current view information. Shows when there are items in the list.

**Props**

```tsx
interface GenericListTotalsProps {
  /** Custom format function for totals text */
  formatText?: (info: {
    totalItems: number;
    currentItemCount: number;
    isLoading: boolean;
    hasMore: boolean;
  }) => string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="generic-list-totals"` - Applied to totals container
- `data-total-items` - Total number of items
- `data-current-items` - Current number of loaded items

**Example**

```tsx
// Default usage
<GenericList.Totals className="text-sm text-content-secondary mb-4" />

// Custom format
<GenericList.Totals
  formatText={({ totalItems, currentItemCount, hasMore }) =>
    hasMore
      ? `Showing ${currentItemCount} of ${totalItems} items`
      : `${totalItems} items total`
  }
  className="font-medium"
/>

// Custom rendering with asChild
<GenericList.Totals asChild>
  <div className="flex items-center justify-between text-sm text-gray-600">
    <span>{/* total items text */}</span>
    <span className="text-xs">{/* additional info */}</span>
  </div>
</GenericList.Totals>
```

---

## GenericList Architecture

The GenericList components follow the established architecture pattern while providing maximum flexibility for different list implementations:

### Component Hierarchy

```
GenericList.Root (Provider & Data Manager)
├── GenericList.Totals (Item count display)
├── GenericList.Items (Container with empty state)
│   └── GenericList.ItemRepeater (Template repeater)
├── GenericList.LoadMore (Load more button)
└── GenericList.Pagination (Pagination container)
    ├── GenericList.Pagination.Previous (Previous page)
    ├── GenericList.Pagination.Info (Page info)
    └── GenericList.Pagination.Next (Next page)
```

### Key Design Principles

#### 1. **Platform Agnostic**

- Works with any data source or API
- No assumptions about data fetching or state management
- Compatible with various pagination strategies (offset, cursor, infinite scroll)

#### 2. **Variant-Based Layout**

- **List Variant**: Vertical stack layout (default)
- **Table Variant**: Structured table layout with headers
- **Grid Variant**: Grid-based layout for cards/tiles
- Variants affect styling hints, not functionality

#### 3. **Flexible Data Patterns**

- **Load More Pattern**: Infinite scroll or click-to-load more items
- **Pagination Pattern**: Traditional page-based navigation
- **Hybrid Pattern**: Support both patterns simultaneously

#### 4. **Context-Driven Data Flow**

- GenericListContext provides items array and pagination state
- ItemContext provides individual item data to templates
- Automatic loading state management and button disable/enable

#### 5. **AsChild Pattern Throughout**

- All components support `asChild` for custom DOM structure
- Enables complete visual customization while preserving functionality
- Uses Radix Slot for proper prop forwarding

#### 6. **Morning Approach Integration**

- Designed to render inside other model contexts (e.g., ProductList)
- Delegates item rendering to entity components (e.g., Product.Root)
- Provides data context without imposing specific rendering patterns

### Integration Examples

#### With Stores Package

```tsx
import { ProductList } from '@wix/stores/react';
import { GenericList } from '@wix/headless-components/react';

// Store-specific list integration
function ProductListRoot({ children }: { children: React.ReactNode }) {
  const productsListService = useService(ProductsListServiceDefinition);

  return (
    <GenericList.Root
      items={productsListService.products.get()}
      onLoadMore={productsListService.loadMore}
      hasMore={productsListService.hasMoreProducts.get()}
      isLoading={productsListService.isLoading.get()}
      variant="grid"
    >
      {children}
    </GenericList.Root>
  );
}

// Usage within ProductList context
<ProductList.Root>
  <GenericList.Totals />
  <GenericList.Items emptyState={<EmptyProductsState />}>
    <GenericList.ItemRepeater>
      <Product.Root>
        <Product.Name />
        <Product.Price />
        <Product.AddToCart />
      </Product.Root>
    </GenericList.ItemRepeater>
  </GenericList.Items>
  <GenericList.LoadMore label="Load More Products" />
</ProductList.Root>;
```

#### Platform-Agnostic Usage

```tsx
// Blog posts list
<GenericList.Root
  items={blogPosts}
  onNextPage={handleNextPage}
  onPreviousPage={handlePreviousPage}
  pagination={paginationInfo}
  variant="list"
>
  <GenericList.Totals />
  <GenericList.Items emptyState={<NoBlogPosts />}>
    <GenericList.ItemRepeater>
      <BlogPost.Root>
        <BlogPost.Title />
        <BlogPost.Excerpt />
        <BlogPost.ReadMore />
      </BlogPost.Root>
    </GenericList.ItemRepeater>
  </GenericList.Items>
  <GenericList.Pagination>
    <GenericList.Pagination.Previous />
    <GenericList.Pagination.Info />
    <GenericList.Pagination.Next />
  </GenericList.Pagination>
</GenericList.Root>
```

### Performance Considerations

- **Virtualization Ready**: Structure supports virtual scrolling implementations
- **Memoized Rendering**: Item templates are automatically memoized by key
- **Lazy Loading**: Supports progressive loading patterns
- **Context Optimization**: Minimal context re-renders with focused state updates

### TestIds Convention

Following the established pattern:

- **Container Level**: `generic-list-root`
- **Items Container**: `generic-list-items`
- **Repeater Level**: `generic-list-item-repeater`
- **Individual Items**: `generic-list-item`
- **Navigation**: `generic-list-load-more`, `generic-list-pagination-next`, etc.

---

### Quantity.Root

Container for quantity selection controls.

**Props**

```tsx
interface QuantityRootProps {
  children: React.ReactNode;
  steps?: number; // default - 1 - how much to increment/decrement
  onValueChange?: (value: number) => void;
}
```

**Example**

```tsx
// Default usage
<Quantity.Root
  steps={1}
  onValueChange={(value) => updateQuantity(value)}
  onReset={() => updateQuantity(1)}
>
  <Quantity.Decrement />
  <Quantity.Input />
  <Quantity.Increment />
  <Quantity.Reset />
</Quantity.Root>
```

---

### Quantity.Increment/Quantity.Decrement

Increment/Decrement quantity buttons.

**Props**

```tsx
interface QuantityIncrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
interface QuantityDecrementProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Data Attributes**

- `data-testid="quantity-increment"` - Applied to increment button
- `data-testid="quantity-decrement"` - Applied to decrement button
- `disabled` - Is button disabled

**Example**

```tsx
// Default usage
<Quantity.Increment className="px-3 py-2 border rounded hover:bg-surface-primary" />
<Quantity.Decrement className="px-3 py-2 border rounded hover:bg-surface-primary" />

// Custom rendering with forwardRef
<Quantity.Increment asChild>
  {React.forwardRef((props, ref) => (
    <button
      ref={ref}
      {...props}
      className="px-3 py-2 border rounded hover:bg-surface-primary transition-colors"
    >
      <Plus className="h-4 w-4" />
    </button>
  ))}
</Quantity.Increment>

<Quantity.Decrement asChild>
  {React.forwardRef((props, ref) => (
    <button
      ref={ref}
      {...props}
      className="px-3 py-2 border rounded hover:bg-surface-primary transition-colors"
    >
      <Minus className="h-4 w-4" />
    </button>
  ))}
</Quantity.Decrement>
```

---

### Quantity.Input

Displays and allows editing of the current quantity value.

**Props**

```tsx
interface QuantityInputProps {
  asChild?: boolean;
  disabled?: boolean; // default - false - if true, the input is always disabled, if false it is based on whether the quantity can be changed
  children?: React.ForwardRefRenderFunction<
    HTMLInputElement,
    {
      value: number;
      onChange: (value: number) => void;
    }
  >;
}
```

**Data Attributes**

- `data-testid="quantity-input"` - Applied to input element
- `disabled` - Is input disabled

**Example**

```tsx
// Default usage
<Quantity.Input className="px-4 py-2 border text-center min-w-16 focus:ring-2 focus:ring-brand-primary" />

// Custom rendering with forwardRef
<Quantity.Input asChild>
  {React.forwardRef(({value, onChange, ...props}, ref) => (
    <input
      ref={ref}
      {...props}
      type="number"
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
      className="px-4 py-2 border text-center min-w-16 focus:outline-none focus:ring-2 focus:ring-brand-primary"
      min="1"
    />
  ))}
</Quantity.Input>
```

---

### Quantity.Reset

Reset quantity to default value.

**Props**

```tsx
interface QuantityResetProps {
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {}>;
}
```

**Example**

```tsx
<Quantity.Reset className="px-3 py-2 border rounded hover:bg-surface-primary">
  <button>Reset</button>
</Quantity.Reset>
```

---
