# CMS Collection Interface Documentation

A comprehensive CMS collection display component system built with composable primitives, similar to Radix UI architecture, for displaying and managing collections of CMS items.

## Table of Contents

### Components

- [CmsCollection.Root](#cmscollectionroot)
- [CmsCollection.Sort/CmsCollection.SortOption](#cmscollectionsortcmscollectionsortoption)
- [CmsCollection.Filters](#cmscollectionfilters)
- [CmsCollection.Items](#cmscollectionitems)
- [CmsCollection.ItemRepeater](#cmscollectionitemrepeater)
- [CmsCollection.ShowMoreAction](#cmscollectionshowmoreaction)
- [CmsCollection.NextAction / PrevAction](#cmscollectionnextaction--prevaction)
- [CmsCollection.Totals.Count/CmsCollection.Totals.Displayed](#cmscollectiontotalscountcmscollectiontotalsdisplayed)
- [CmsCollection.CreateItemAction](#cmscollectioncreateitemaction)
- [CmsCollection.BulkUpdateAction](#cmscollectionbulkupdateaction)

---

## Architecture

The CmsCollection component follows a compound component pattern where each part can be composed together to create flexible CMS collection displays. It supports both simplified and headless interfaces.


## Components

### CmsCollection.Root

The root container that provides CMS collection context to all child components.

**Props**
```tsx
interface CmsCollectionProps {
  collection: CollectionData;
  children: React.ReactNode;
}
```

**Example**
```tsx
<CMS.Root collection={collection}>
  {/* CMS collection component */}
</CMS.Root>

```
**Data Attributes**
- `data-testid="cms-collection"` - Applied to line cms container
- `data-collection-id`="collection-id"` - Collection id
---

### CmsCollection.Sort/CmsCollection.SortOption

Displays sorting controls for the collection items.
Plain wrappers for Sort.Root and Sort.Option.

**Props**
```tsx
interface CmsCollectionSortProps {
  children?: React.ForwardRefRenderFunction<HTMLElement, {
    sortingOptions: Array<SortOptionProps>;
    onChange: (value: Sort) => void;
    value: Sort;
  }>;
  asChild?: boolean;
  valueFormatter?: ({sortBy, sortDirection}) => string; // used to format the value for the select, i.e. to translate the values, mandatory when rendering as select
  as: 'select' | 'list'; // default is 'select'
}

interface CmsCollectionSortOptionProps = SortOptionProps & {
  fieldName?: 'title' | 'created' | 'modified' | 'slug'; // CMS-specific field names
}
```

**Important**
The implementation should generate a plain Sort object (we should go over cms implementation and update it).

See [Sort.Root](./PLATFORM_INTERFACE.md#sortroot) and [Sort.Option](./PLATFORM_INTERFACE.md#sortoption) for more details.

**Example**
```tsx
<CmsCollection.Sort as="select" valueFormatter={({sortBy, sortDirection}) => `Sort by ${sortBy} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`} />

<CmsCollection.Sort className="w-full">
  <CmsCollection.SortOption fieldName="title" label="Title" />
  <CmsCollection.SortOption fieldName="created" label="Date Created" />
  <CmsCollection.SortOption order="asc" asChild>
    <button>Ascending</button>
  </CmsCollection.SortOption>
  <CmsCollection.SortOption order="desc" asChild>
    <button>Descending</button>
  </CmsCollection.SortOption>
</CmsCollection.Sort>

<CmsCollection.Sort asChild>
  {React.forwardRef(({value, onChange, sortingOptions, ...props}, ref) => (
    <select defaultValue={`${value.fieldName}_${value.order}`} ref={ref} {...props} onChange={(e) => {
      const [by, direction] = e.target.value.split('_');
      onChange({fieldName: by, order: direction});
    }}>
      <option value="created_desc">Newest First</option>
      <option value="title_asc">Title (A-Z)</option>
      <option value="title_desc">Title (Z-A)</option>
      <option value="modified_desc">Recently Modified</option>
    </select>
  ))}
</CmsCollection.Sort>
```

**Data Attributes**
- `data-testid="cms-collection-sorting"` - Applied to sorting container
- `data-filtered` - Is collection currently filtered
- `data-sorted-by` - Current sorting field
- `data-sort-direction` - Current sort direction

---

### CmsCollection.Filters

Container for collection item filters and controls (we should go over cms implementation and update it).

**Props**
```tsx
interface CmsCollectionFiltersProps {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<CmsCollection.Filters className="flex gap-4"> // defines the <Filter.Root value={filter} onChange={setFilter}>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <Filter.SingleFilter/> // define how to render a single filter (i.e. radio button)
      <Filter.MultiFilter/> // define how to render a multi filter (i.e. checkbox)
      <Filter.RangeFilter/> // define how to render a range filter (i.e. slider)
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</CmsCollection.Filters>
```

Refer to [Filter.Root](./PLATFORM_INTERFACE.md#filterroot) for more details.

**Data Attributes**
- `data-testid="cms-collection-filters"` - Applied to filters container
- `data-has-active-filters` - Present when filters are active

---

### CmsCollection.Items

Main container for the collection items display with support for empty states and custom layouts.

**Props**
```tsx
interface CmsCollectionItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  infiniteScroll?: boolean;
  pageSize?: number;
  variant?: 'list' | 'grid' | 'table' | 'card'; // Layout variant (default: 'list')
  gridColumns?: number; // Number of columns for grid variant
  tableHeaders?: string[]; // Column headers for table variant
}
```
**Example**
```tsx
// Grid layout with 3 columns
<CmsCollection.Items
  variant="grid"
  gridColumns={3}
  emptyState={<div>No items found</div>}
  className="gap-6"
  pageSize={9}
>
  <CmsCollection.ItemRepeater>
    <CmsItem.ImageField fieldKey="image" className="aspect-square rounded-lg mb-4" />
    <CmsItem.TextField fieldKey="title" className="font-semibold mb-2" />
    <CmsItem.TextField fieldKey="description" className="text-sm text-muted" />
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

// Table layout with headers
<CmsCollection.Items
  variant="table"
  tableHeaders={['Title', 'Status', 'Created', 'Actions']}
  emptyState={<div>No data available</div>}
>
  <CmsCollection.ItemRepeater>
    <CmsItem.TextField fieldKey="title" />
    <CmsItem.TextField fieldKey="status" />
    <CmsItem.DateField fieldKey="created" />
    <CmsItem.Action.Edit label="Edit" />
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

// List layout (default)
<CmsCollection.Items
  variant="list"
  emptyState={<div>No items found</div>}
  infiniteScroll
>
  <CmsCollection.ItemRepeater>
    <div className="flex items-center gap-4 p-4 border-b">
      <CmsItem.ImageField fieldKey="thumbnail" className="w-16 h-16 rounded" />
      <div className="flex-1">
        <CmsItem.TextField fieldKey="title" className="font-medium mb-1" />
        <CmsItem.TextField fieldKey="description" className="text-sm text-muted" />
      </div>
      <CmsItem.DateField fieldKey="modified" className="text-xs" />
    </div>
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

// Card layout
<CmsCollection.Items
  variant="card"
  emptyState={<div>No items found</div>}
  className="gap-4"
>
  <CmsCollection.ItemRepeater>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <CmsItem.TextField fieldKey="title" className="text-xl font-bold mb-4" />
      <CmsItem.ImageField fieldKey="image" className="w-full aspect-video rounded mb-4" />
      <CmsItem.TextField fieldKey="description" className="mb-4" />
      <div className="flex gap-2">
        <CmsItem.Action.Edit label="Edit" className="btn-primary" />
        <CmsItem.Action.Delete label="Delete" className="btn-secondary" />
      </div>
    </div>
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>
```

**Data Attributes**
- `data-testid="cms-collection-items"` - Applied to items container
- `data-empty` - Is collection empty
- `data-variant` - Current layout variant (list/grid/table/card)
- `data-grid-columns` - Number of columns (grid variant only)
- `data-has-table-headers` - Present when table headers are provided

---

### CmsCollection.ItemRepeater

Repeats for each collection item in the list, providing individual item context.

**Props**
```tsx
interface CmsCollectionItemRepeaterProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<CmsCollection.ItemRepeater className="item-card">
    <CmsItem.TextField />
    <CmsItem.ImageField />
    <CmsItem.DateField />
    <CmsItem.CustomField />
</CmsCollection.ItemRepeater>
```

**Data Attributes**
- `data-testid="product-list-item"` - Applied to each product item
- `data-collection-item-id` - Item ID

---

### CmsCollection.ShowMoreAction

Displays a button to load more items. Not rendered if infiniteScroll is false or no items are left to load.

**Props**
```tsx
interface CmsCollectionShowMoreActionProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<CmsCollection.ShowMoreAction className="text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-primary">
  Load More Products
</CmsCollection.ShowMoreAction>

<CmsCollection.ShowMoreAction asChild>
  <button>Load More</button>
</CmsCollection.ShowMoreAction>

```

**Data Attributes**
- `data-testid="cms-collection-load-more"` - Applied to load more button

---

### CmsCollection.NextAction / PrevAction

Displays a button to load the next/prev page of items. Not rendered if infiniteScroll is true or no items are left to load.

**Props**
```tsx
interface CmsCollectionNextActionProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**
```tsx
<CmsCollection.NextAction className="text-content-primary font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-primary">
  Next Page
  <ChevronRight className="h-4 w-4" />
</CmsCollection.NextAction>

<CmsCollection.PrevAction asChild>
  <button>⬅️</button>
</CmsCollection.PrevAction>

```

**Data Attributes**
- `data-testid="cms-collection-next"` - Applied to next button / "cms-collection-prev"` - Applied to prev button

---

### CmsCollection.Totals.Count/CmsCollection.Totals.Displayed

Displays the total number of items and the number of items displayed.

**Props**
```tsx
interface CmsCollectionTotalsCountProps {
  children: React.ForwardRefRenderFunction<HTMLElement, {
    total: number;
  }>;
  asChild?: boolean;
  className?: string;
}

const CmsCollectionTotalsDisplayedProps = CmsCollectionTotalsCountProps;
```

**Example**
```tsx
<span>Showing <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count /> items</span>
```

**Data Attributes**
- `data-testid="cms-collection-itmes-totals"` - Applied to totals container
- `data-total` - Total number of items
- `data-displayed` - Number of items displayed
---

### CmsCollection.CreateItemAction

Displays a button to create a new item in the collection. Integrates with the collection service to handle item creation with loading states.

**Props**
```tsx
interface CmsCollectionCreateItemActionProps {
  asChild?: boolean;
  label: string;
  children?: React.ReactNode;
  className?: string;
  loadingState?: string | React.ReactNode;
}
```

**Example**
```tsx
<CmsCollection.CreateItemAction label="Add Item" className="btn-primary" loadingState="Creating..."/>

<CmsCollection.CreateItemAction asChild label="Add Item">
  <Button>Add New Item</Button>
</CmsCollection.CreateItemAction>

<CmsCollection.CreateItemAction asChild label="Add Item">
  {({ disabled, isLoading, onClick }) => (
    <Button
      disabled={disabled}
      onClick={onClick}
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <Plus className="h-4 w-4" />
      Add Item
    </Button>
  )}
</CmsCollection.CreateItemAction>
```

**Data Attributes**
- `data-testid="cms-collection-create-item"` - Applied to create button
- `data-loading` - Present when create operation is in progress

---

### CmsCollection.BulkUpdateAction

Displays a button to update multiple modified items in the collection.

**Props**
```tsx
interface CmsCollectionBulkUpdateActionProps {
  asChild?: boolean;
  label: string;
  children?: AsChildChildren<{
    disabled: boolean;
    isLoading: boolean;
    selectedCount: number;
    onClick: () => Promise<void>;
  }>;
  className?: string;
  loadingState?: string | React.ReactNode;
}
```

**Example**
```tsx
// Default usage
<CmsCollection.BulkUpdateAction
  label="Update Selected"
  className="btn-secondary"
  loadingState="Updating..."
/>

// With asChild pattern
<CmsCollection.BulkUpdateAction asChild label="Update Selected">
  <Button variant="outline">Update Selected Items</Button>
</CmsCollection.BulkUpdateAction>

// With custom behavior and selection count
<CmsCollection.BulkUpdateAction asChild label="Update Selected">
  {({ disabled, isLoading, selectedCount, onClick }) => (
    <Button
      disabled={disabled || selectedCount === 0}
      onClick={onClick}
      variant="outline"
      className="gap-2"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <Edit className="h-4 w-4" />
      Update {selectedCount > 0 ? `${selectedCount} ` : ''}Items
    </Button>
  )}
</CmsCollection.BulkUpdateAction>
```

**Data Attributes**
- `data-testid="cms-collection-bulk-update"`
- `data-loading` - Present when bulk update operation is in progress

---

## Data Attributes Summary

| Attribute | Applied To | Purpose |
|-----------|------------|---------|
| `data-testid="cms-collection"` | CmsCollection.Root | Collection root container |
| `data-collection-id="collection-id"` | CmsCollection.Root | Collection identifier |
| `data-testid="cms-collection-sorting"` | CmsCollection.Sort | Sorting container |
| `data-testid="cms-collection-filters"` | CmsCollection.Filters | Filters container |
| `data-testid="cms-collection-items"` | CmsCollection.Items | Items container |
| `data-testid="cms-collection-item"` | CmsCollection.ItemRepeater | Individual collection item |
| `data-testid="cms-collection-load-more"` | CmsCollection.ShowMoreAction | Load more button |
| `data-testid="cms-collection-next"` | CmsCollection.NextAction | Next page button |
| `data-testid="cms-collection-prev"` | CmsCollection.PrevAction | Previous page button |
| `data-testid="cms-collection-create-item"` | CmsCollection.CreateItemAction | Create item button |
| `data-testid="cms-collection-bulk-update"` | CmsCollection.BulkUpdateAction | Bulk update button |
| `data-testid="cms-collection-items-totals"` | CmsCollection.Totals.Count/Displayed | Totals container |
| `data-empty` | CmsCollection.Items | Empty collection status |
| `data-variant` | CmsCollection.Items | Current layout variant |
| `data-grid-columns` | CmsCollection.Items | Number of grid columns |
| `data-has-table-headers` | CmsCollection.Items | Table headers present |
| `data-filtered` | CmsCollection.Sort | Collection currently filtered status |
| `data-sorted-by` | CmsCollection.Sort | Current sorting field |
| `data-sort-direction` | CmsCollection.Sort | Current sort direction |
| `data-has-active-filters` | CmsCollection.Filters | Active filters present |
| `data-infinite-scroll` | CmsCollection.Items | Infinite scroll mode |
| `data-page-size` | CmsCollection.Items | Current page size setting |
| `data-total` | CmsCollection.Totals.Count | Total number of items |
| `data-displayed` | CmsCollection.Totals.Displayed | Number of items displayed |
| `data-selected-count` | CmsCollection.BulkUpdateAction | Number of selected items |
| `data-loading` | Action components | Operation in progress status |






## Usage Examples

### Basic CMS Collection with Sort and Filters
```tsx
function CmsCollectionDisplay() {
  const collection = useCmsCollection();

  return (
    <CmsCollection.Root collection={collection}>
      <div className="space-y-6">
        {/* Header with Sorting and Filters */}
        <div className="flex justify-between items-center bg-surface-card p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <span>Showing <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count /> items</span>
          </div>

          <div className="flex gap-4">
            <CmsCollection.Sort
              as="select"
              valueFormatter={({sortBy, sortDirection}) =>
                `${sortBy === 'title' ? 'Title' : sortBy === 'created' ? 'Date Created' : 'Modified'} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`
              }
            />

            <CmsCollection.Filters>
              <Filter.FilterOptions>
                <Filter.FilterOptionRepeater>
                  <Filter.SingleFilter />
                  <Filter.MultiFilter />
                  <Filter.RangeFilter />
                </Filter.FilterOptionRepeater>
              </Filter.FilterOptions>
            </CmsCollection.Filters>
          </div>
        </div>

        {/* Items Grid with Variant Support */}
        <CmsCollection.Items
          variant="grid"
          gridColumns={3}
          emptyState={<div className="text-center py-12">No items found</div>}
          className="gap-6"
        >
          <CmsCollection.ItemRepeater className="bg-surface-card p-4 rounded-lg border border-surface-subtle hover:shadow-lg transition-shadow">
            <CmsItem.ImageField fieldKey="image" className="aspect-video rounded-lg mb-4" />
            <CmsItem.TextField fieldKey="title" className="text-lg font-semibold text-content-primary mb-2" />
            <CmsItem.DateField fieldKey="created" className="text-sm text-content-muted mb-4" />

            <div className="mt-4 space-y-2">
              <CmsItem.Action.Edit label="Edit Item" className="w-full btn-primary" />
              <CmsItem.Action.Delete label="Delete Item" className="w-full btn-secondary" />
            </div>
          </CmsCollection.ItemRepeater>
        </CmsCollection.Items>

        {/* Load More */}
        <CmsCollection.ShowMoreAction className="w-full btn-outline">
          Load More Items
        </CmsCollection.ShowMoreAction>
      </div>
    </CmsCollection.Root>
  );
}
```

### Advanced Example with Custom Sort Options
```tsx
function AdvancedCmsCollection() {
  return (
    <CmsCollection.Root collection={collection}>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <Card className="bg-surface-card border-surface-subtle">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold text-content-primary">
                Collection Items (<CmsCollection.Totals.Displayed />)
              </h2>

              <div className="flex flex-wrap gap-3">
                <CmsCollection.Sort as="list" className="flex gap-2">
                  <CmsCollection.SortOption fieldName="title" order="asc">
                    Title (A-Z)
                  </CmsCollection.SortOption>
                  <CmsCollection.SortOption fieldName="created" order="desc">
                    Newest First
                  </CmsCollection.SortOption>
                  <CmsCollection.SortOption fieldName="modified" order="desc">
                    Recently Modified
                  </CmsCollection.SortOption>
                </CmsCollection.Sort>

                <CmsCollection.Filters>
                  <Filter.Filtered>
                    <div className="bg-surface-card border-surface-primary p-4 rounded">
                      <p className="text-content-secondary">Active filters:</p>
                      <Filter.Action.Clear label="Clear All" />
                    </div>
                  </Filter.Filtered>
                </CmsCollection.Filters>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items with Table Layout for Management */}
        <CmsCollection.Items
          variant="table"
          tableHeaders={['Title', 'Status', 'Modified', 'Actions']}
          emptyState={
            <Card className="text-center py-16">
              <CardContent>
                <h3 className="text-2xl font-bold text-content-primary mb-4">
                  No Items Available
                </h3>
                <p className="text-content-muted mb-6">
                  Create your first item to get started.
                </p>
                <CmsCollection.CreateItemAction label="Create Item" className="btn-primary" />
              </CardContent>
            </Card>
          }
        >
          <CmsCollection.ItemRepeater className="hover:bg-surface-hover transition-colors">
            <CmsItem.TextField fieldKey="title" className="font-medium text-content-primary" />
            <CmsItem.TextField fieldKey="status" className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-status-success-light text-status-success" />
            <CmsItem.DateField fieldKey="modified" className="text-content-muted text-sm" />
            <div className="flex gap-2">
              <CmsItem.Action.Edit label="Edit" className="btn-sm btn-secondary" />
              <CmsItem.Action.Delete label="Delete" className="btn-sm btn-outline text-status-error" />
            </div>
          </CmsCollection.ItemRepeater>
        </CmsCollection.Items>

        {/* Bulk Actions */}
        <div className="flex justify-between items-center">
          <CmsCollection.BulkUpdateAction
            label="Update Selected"
            className="btn-secondary"
            loadingState="Updating..."
          />

          <div className="flex gap-2">
            <CmsCollection.PrevAction className="btn-outline">Previous</CmsCollection.PrevAction>
            <CmsCollection.NextAction className="btn-outline">Next</CmsCollection.NextAction>
          </div>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
```

### Complete Variant Examples
```tsx
function CmsCollectionWithVariants() {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'list' | 'card'>('grid');
  const collection = useCmsCollection();

  return (
    <CmsCollection.Root collection={collection}>
      <div className="space-y-6">
        {/* View Mode Selector */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Collection Items</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline'}`}
            >
              Card
            </button>
          </div>
        </div>

        {/* Dynamic Variant Rendering */}
        {viewMode === 'grid' && (
          <CmsCollection.Items variant="grid" gridColumns={3} className="gap-6">
            <CmsCollection.ItemRepeater>
              <div className="bg-white rounded-lg border p-4 hover:shadow-lg transition-shadow">
                <CmsItem.ImageField fieldKey="image" className="w-full aspect-square rounded mb-3" />
                <CmsItem.TextField fieldKey="title" className="font-semibold mb-2" />
                <CmsItem.TextField fieldKey="description" className="text-sm text-gray-600 mb-3" />
                <div className="flex gap-2">
                  <CmsItem.Action.Edit label="Edit" className="btn-sm btn-primary" />
                  <CmsItem.Action.Delete label="Delete" className="btn-sm btn-outline" />
                </div>
              </div>
            </CmsCollection.ItemRepeater>
          </CmsCollection.Items>
        )}

        {viewMode === 'table' && (
          <CmsCollection.Items
            variant="table"
            tableHeaders={['Image', 'Title', 'Status', 'Created', 'Actions']}
            className="bg-white rounded-lg border"
          >
            <CmsCollection.ItemRepeater className="border-b hover:bg-gray-50 transition-colors">
              <CmsItem.ImageField fieldKey="image" className="w-12 h-12 rounded object-cover" />
              <CmsItem.TextField fieldKey="title" className="font-medium" />
              <CmsItem.TextField fieldKey="status" />
              <CmsItem.DateField fieldKey="created" className="text-sm text-gray-500" />
              <div className="flex gap-1">
                <CmsItem.Action.Edit label="Edit" className="btn-xs btn-secondary" />
                <CmsItem.Action.Delete label="Delete" className="btn-xs btn-outline" />
              </div>
            </CmsCollection.ItemRepeater>
          </CmsCollection.Items>
        )}

        {viewMode === 'list' && (
          <CmsCollection.Items variant="list" className="bg-white rounded-lg border divide-y">
            <CmsCollection.ItemRepeater className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <CmsItem.ImageField fieldKey="image" className="w-16 h-16 rounded object-cover" />
                <div className="flex-1">
                  <CmsItem.TextField fieldKey="title" className="font-semibold mb-1" />
                  <CmsItem.TextField fieldKey="description" className="text-sm text-gray-600" />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <CmsItem.DateField fieldKey="modified" className="text-xs text-gray-500" />
                  <div className="flex gap-1">
                    <CmsItem.Action.Edit label="Edit" className="btn-xs btn-primary" />
                    <CmsItem.Action.Delete label="Delete" className="btn-xs btn-outline" />
                  </div>
                </div>
              </div>
            </CmsCollection.ItemRepeater>
          </CmsCollection.Items>
        )}

        {viewMode === 'card' && (
          <CmsCollection.Items variant="card" className="gap-6">
            <CmsCollection.ItemRepeater>
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <CmsItem.TextField fieldKey="title" className="text-2xl font-bold mb-6" />
                <CmsItem.ImageField fieldKey="image" className="w-full aspect-video rounded-lg mb-6" />
                <CmsItem.TextField fieldKey="description" className="text-gray-700 leading-relaxed mb-6" />
                <div className="flex items-center justify-between">
                  <CmsItem.DateField fieldKey="created" className="text-sm text-gray-500" />
                  <div className="flex gap-3">
                    <CmsItem.Action.Edit label="Edit Item" className="btn btn-primary" />
                    <CmsItem.Action.Delete label="Delete" className="btn btn-outline" />
                  </div>
                </div>
              </div>
            </CmsCollection.ItemRepeater>
          </CmsCollection.Items>
        )}

        {/* Load More */}
        <CmsCollection.ShowMoreAction className="w-full btn-outline">
          Load More Items
        </CmsCollection.ShowMoreAction>
      </div>
    </CmsCollection.Root>
  );
}
```
