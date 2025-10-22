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
- [CmsCollection.Totals.Count](#cmscollectiontotalscount)
- [CmsCollection.Totals.Displayed](#cmscollectiontotalsdisplayed)
- [CmsCollection.CreateItemAction](#cmscollectioncreateitemaction)
- [CmsCollection.BulkUpdateAction](#cmscollectionbulkupdateaction)
- [CmsCollection.Loading](#cmscollectionloading)
- [CmsCollection.Error](#cmscollectionerror)

---

## Architecture

The CmsCollection component follows a compound component pattern where each part can be composed together to create flexible CMS collection displays. It supports both simplified and headless interfaces.

## Working with Reference Fields

CMS collections support reference fields that link to items in other collections. When querying collection items, you can include the full referenced item data instead of just the reference IDs.

### Reference Field Types

- **Single Reference Fields**: Fields that reference one item from another collection (e.g., `author`, `category`)
- **Multi Reference Fields**: Fields that reference multiple items from other collections (e.g., `tags`, `relatedItems`)

### Including References in Queries

Use the `singleRefFieldIds` and `multiRefFieldIds` properties to specify which reference fields should be included:

```tsx
<CmsCollection.Root
  collection={{
    id: 'BlogPosts',
    singleRefFieldIds: ['author', 'category'],
    multiRefFieldIds: ['tags', 'relatedPosts'],
  }}
>
  <CmsCollection.Items>
    <CmsCollection.ItemRepeater>
      {/* Access main item fields */}
      <CmsItem.Field fieldId="title" />

      {/* Access single reference field - returns full item */}
      <CmsItem.Field fieldId="author" asChild>
        {({ fieldValue, ...props }) => (
          <div className="author" {...props}>
            <span>{fieldValue?.name}</span>
            <span>{fieldValue?.email}</span>
          </div>
        )}
      </CmsItem.Field>

      {/* Access multi reference field - returns array of items */}
      <CmsItem.Field fieldId="tags" asChild>
        {({ fieldValue, ...props }) => (
          <div className="tags" {...props}>
            {fieldValue?.map((tag) => (
              <span key={tag._id}>{tag.name}</span>
            ))}
          </div>
        )}
      </CmsItem.Field>
    </CmsCollection.ItemRepeater>
  </CmsCollection.Items>
</CmsCollection.Root>
```

**Important Notes:**

- Without including references, reference fields will only contain the referenced item IDs
- Including references requires additional API calls and may impact performance
- Only include the reference fields you actually need to display

## Components

### CmsCollection.Root

The root container that provides CMS collection context to all child components.

**Props**

```tsx
interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
    queryResult?: WixDataQueryResult;
    queryOptions?: CmsQueryOptions;
    /** List of field IDs for single reference fields to include */
    singleRefFieldIds?: string[];
    /** List of field IDs for multi reference fields to include */
    multiRefFieldIds?: string[];
  };
}

interface CmsQueryOptions {
  /** Number of items per page */
  limit?: number;
  /** Number of items to skip */
  skip?: number;
  /** Whether to return the total count of items */
  returnTotalCount?: boolean;
}
```

**Example**

```tsx
<CmsCollection.Root collection={{ id: 'MyCollection' }}>
  {/* CMS collection component */}
</CmsCollection.Root>

// With pre-loaded data
<CmsCollection.Root collection={{
  id: 'MyCollection',
  queryResult: initialData,
  queryOptions: { limit: 10 }
}}>
  {/* CMS collection component */}
</CmsCollection.Root>

// With reference fields included
<CmsCollection.Root collection={{
  id: 'MyCollection',
  queryOptions: {
    limit: 10
  },
  singleRefFieldIds: ['author', 'category'],
  multiRefFieldIds: ['tags', 'relatedItems']
}}>
  <CmsCollection.Items>
    <CmsCollection.ItemRepeater>
      <CmsItem.Field fieldId="title" />
      <CmsItem.Field fieldId="author" />
      <CmsItem.Field fieldId="tags" />
    </CmsCollection.ItemRepeater>
  </CmsCollection.Items>
</CmsCollection.Root>
```

**Data Attributes**

- `data-testid="cms-collection-root"` - Applied to collection container
- `data-collection-id="collection-id"` - Collection id

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

Main container for the collection items display with support for empty states and infinite scroll.

**Props**

```tsx
interface ItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  infiniteScroll?: boolean;
}
```

**Example**

```tsx
// Basic usage with empty state
<CmsCollection.Items
  emptyState={<div>No items found</div>}
  className="space-y-4"
>
  <CmsCollection.ItemRepeater>
    <CmsItem.Field fieldId="title" asChild>
      {({ fieldValue, ...props }, ref) => (
        <h2 ref={ref} {...props} className="font-heading font-semibold mb-2 text-foreground">
          {fieldValue}
        </h2>
      )}
    </CmsItem.Field>
    <CmsItem.Field fieldId="description" asChild>
      {({ fieldValue, ...props }, ref) => (
        <p ref={ref} {...props} className="font-paragraph text-secondary-foreground">
          {fieldValue}
        </p>
      )}
    </CmsItem.Field>
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

// With infinite scroll enabled
<CmsCollection.Items
  infiniteScroll
  emptyState={<div>No data available</div>}
  className="space-y-4"
>
  <CmsCollection.ItemRepeater>
    <CmsItem.Field fieldId="title" asChild>
      {({ fieldValue, ...props }, ref) => (
        <h3 ref={ref} {...props} className="font-heading text-foreground">{fieldValue}</h3>
      )}
    </CmsItem.Field>
    <CmsItem.Action.Update label="Edit" />
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

// Using asChild pattern for custom container
<CmsCollection.Items asChild emptyState={<div>No data available</div>}>
  <section className="grid grid-cols-3 gap-4">
    <CmsCollection.ItemRepeater>
      <CmsItem.Field fieldId="title" asChild>
        {({ fieldValue, ...props }, ref) => (
          <h3 ref={ref} {...props} className="font-heading text-foreground">{fieldValue}</h3>
        )}
      </CmsItem.Field>
    </CmsCollection.ItemRepeater>
  </section>
</CmsCollection.Items>
```

**Data Attributes**

- `data-testid="cms-collection-items"` - Applied to items container
- `data-empty` - Is collection empty
- `data-infinite-scroll` - Whether infinite scroll is enabled

---

### CmsCollection.ItemRepeater

Repeats for each collection item in the list, providing individual item context.

**Props**

```tsx
interface ItemRepeaterProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Important Implementation Note**

`ItemRepeater` automatically wraps each item with `CmsItem.Root`, so you don't need to manually wrap your field components. The item context is automatically provided.

**Example**

```tsx
<CmsCollection.ItemRepeater className="item-card">
  <CmsItem.Field fieldId="title" asChild>
    {({ fieldValue, ...props }, ref) => (
      <h3 ref={ref} {...props} className="font-heading text-foreground">{fieldValue}</h3>
    )}
  </CmsItem.Field>
  <CmsItem.Field fieldId="image" asChild>
    {({ fieldValue, ...props }, ref) => (
      <img ref={ref} {...props} src={fieldValue?.url} alt={fieldValue?.alt} />
    )}
  </CmsItem.Field>
</CmsCollection.ItemRepeater>

// Using asChild pattern for custom wrapper
<CmsCollection.ItemRepeater asChild>
  <article className="flex gap-4 p-4 border-b border-foreground">
    <CmsItem.Field fieldId="title" asChild>
      {({ fieldValue, ...props }, ref) => (
        <h3 ref={ref} {...props} className="font-heading text-foreground">{fieldValue}</h3>
      )}
    </CmsItem.Field>
  </article>
</CmsCollection.ItemRepeater>
```

**Data Attributes**

- `data-testid="cms-collection-item"` - Applied to each collection item
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
<CmsCollection.ShowMoreAction className="bg-primary text-primary-foreground font-paragraph font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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

### CmsCollection.Totals.Count

Displays the total number of items in the collection.

**Props**

```tsx
interface TotalsCountProps {
  asChild?: boolean;
  children?:
    | AsChildChildren<{
        total: number;
      }>
    | React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<span>Total: <CmsCollection.Totals.Count /></span>

// Custom implementation using asChild pattern
<CmsCollection.Totals.Count asChild>
  {({ total }) => (
    <strong className="text-lg font-bold">
      {total} items total
    </strong>
  )}
</CmsCollection.Totals.Count>
```

**Data Attributes**

- `data-testid="cms-collection-items-totals"` - Applied to totals container
- `data-total` - Total number of items

---

### CmsCollection.Totals.Displayed

Displays various count metrics based on the displayType prop.

**Props**

```tsx
interface TotalsDisplayedProps {
  displayType?: DisplayType;
  asChild?: boolean;
  children?:
    | AsChildChildren<{
        displayed: number;
      }>
    | React.ReactNode;
  className?: string;
}

type DisplayType =
  | 'displayed' // Number of items displayed up to current page (default)
  | 'currentPageAmount' // Number of items on current page only
  | 'currentPageNum' // Current page number
  | 'totalPages'; // Total number of pages
```

**Example**

```tsx
// Default usage - displays total items shown up to current page
<span>Showing <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count /> items</span>

// Display current page number
<span>Page <CmsCollection.Totals.Displayed displayType="currentPageNum" /> of <CmsCollection.Totals.Displayed displayType="totalPages" /></span>

// Display items on current page only
<span>Items on this page: <CmsCollection.Totals.Displayed displayType="currentPageAmount" /></span>

// Custom implementation using asChild pattern
<CmsCollection.Totals.Displayed displayType="displayed" asChild>
  {({ displayed }) => (
    <div className="count-badge">
      <span className="count-number">{displayed}</span>
      <span className="count-label">items shown</span>
    </div>
  )}
</CmsCollection.Totals.Displayed>
```

**Data Attributes**

- `data-testid="cms-collection-items-displayed"` - Applied to displayed container
- `data-displayed` - Number based on displayType
- `data-display-type` - The displayType used

---

### CmsCollection.CreateItemAction

Button component for creating new items in a CMS collection or inserting references between items. Handles loading and errors states.

**Two Operation Modes:**

1. **Create New Item Mode** - Use when adding a new item to a collection. Pass `itemData` prop with the item's field values.

2. **Insert Reference Mode** - Use when linking existing items via reference fields. Pass `referenceFieldId`, `itemId`, and `referencedItemIds` (single ID or array of IDs).

**Props**

```tsx
interface CreateItemActionProps {
  asChild?: boolean;
  label?: string;
  children?:
    | AsChildChildren<{
        disabled: boolean;
        isLoading: boolean;
        insertItemOrReference: (params: InsertItemOrReferenceParams) => Promise<WixDataItem | void>;
      }>
    | React.ReactNode;
  className?: string;
  loadingState?: string | React.ReactNode;
  // For creating new items:
  itemData?: Partial<WixDataItem>;
  // For inserting references:
  referenceFieldId?: string;
  itemId?: string;
  referencedItemIds?: string | string[]; // Single ID or array of IDs
}

type InsertItemOrReferenceParams =
  | { itemData: Partial<WixDataItem> }
  | { referenceFieldId: string; itemId: string; referencedItemIds: string | string[] };
```

**Examples**

```tsx
// MODE 1: Create new item - Simple usage with direct props
<CmsCollection.CreateItemAction
  label="Add Article"
  loadingState="Creating..."
  itemData={{ title: "New Article", status: "draft" }}
/>

// MODE 1: Create new item - With dynamic data from state
function DynamicCreateButton() {
  const [formData, setFormData] = useState({ title: '', content: '' });

  return (
    <>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <CmsCollection.CreateItemAction
        label="Submit"
        itemData={formData}
      />
    </>
  );
}

// MODE 1: Create new item - Custom design with asChild
<CmsCollection.CreateItemAction asChild>
  {({ insertItemOrReference, disabled, isLoading }) => (
    <button
      disabled={disabled}
      onClick={() => insertItemOrReference({
        itemData: { title: "New Article", status: "draft" }
      })}
      className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Add Article
        </>
      )}
    </button>
  )}
</CmsCollection.CreateItemAction>

// MODE 2: Insert reference - Link existing items (single ID)
<CmsCollection.CreateItemAction
  label="Add Actor to Movie"
  referenceFieldId="actors"
  itemId="movie-123"
  referencedItemIds="actor-456"
/>

// MODE 2: Insert reference - Link multiple items at once
<CmsCollection.CreateItemAction
  label="Add Multiple Actors"
  referenceFieldId="actors"
  itemId="movie-123"
  referencedItemIds={["actor-456", "actor-789", "actor-321"]}
/>

// ADVANCED: Chaining - Create item then add references
<CmsCollection.CreateItemAction asChild>
  {({ insertItemOrReference, disabled, isLoading }) => {
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState(['tag-1', 'tag-2']);

    const handleSubmit = async () => {
      try {
        // Step 1: Create the post
        const newPost = await insertItemOrReference({
          itemData: { title, status: 'published' }
        });

        // Step 2: Add tags using the returned ID
        if (newPost?._id) {
          await insertItemOrReference({
            referenceFieldId: 'tags',
            itemId: newPost._id,
            referencedItemIds: tags  // Pass array of tag IDs
          });
        }

        alert('Post created with tags!');
      } catch (error) {
        console.error('Failed:', error);
      }
    };

    return (
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="btn-primary"
      >
        {isLoading ? 'Creating...' : 'Create Post with Tags'}
      </button>
    );
  }}
</CmsCollection.CreateItemAction>
```

**Key Features**

- **Dual functionality**: Create items OR insert references
- **Returns created item**: Enables chaining operations (create → reference)
- **Flexible reference insertion**: Accept single ID or array of IDs
- **Automatic loading states**: Handles loading/disabled states internally
- **Error handling**: Catches and reports errors automatically

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
  className="bg-secondary text-secondary-foreground"
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

### CmsCollection.Loading

Component that renders content during loading state. Only displays its children when the collection is currently loading.

**Props**

```tsx
interface LoadingProps {
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}

interface LoadingRenderProps {}
```

**Example**

```tsx
// Simple loading message
<CmsCollection.Loading>
  <div>Loading collection...</div>
</CmsCollection.Loading>

// With render function
<CmsCollection.Loading>
  {() => (
    <div className="loading-spinner">
      <div>Loading collection...</div>
      <div className="spinner"></div>
    </div>
  )}
</CmsCollection.Loading>
```

**Data Attributes**

- None (renders only during loading state)

---

### CmsCollection.Error

Component that renders content when there's an error loading collection. Only displays its children when an error has occurred.

**Props**

```tsx
interface ErrorProps {
  children: ((props: ErrorRenderProps) => React.ReactNode) | React.ReactNode;
}

interface ErrorRenderProps {
  error: string | null;
}
```

**Example**

```tsx
// Simple error message
<CmsCollection.Error>
  <div className="error-state">Failed to load collection</div>
</CmsCollection.Error>

// With error details
<CmsCollection.Error>
  {({ error }) => (
    <div className="error-state">
      <h3>Error loading collection</h3>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  )}
</CmsCollection.Error>
```

**Data Attributes**

- None (renders only during error state)

---

## Data Attributes Summary

| Attribute                                      | Applied To                     | Purpose                      |
| ---------------------------------------------- | ------------------------------ | ---------------------------- |
| `data-testid="cms-collection-root"`            | CmsCollection.Root             | Collection root container    |
| `data-collection-id`                           | CmsCollection.Root             | Collection identifier        |
| `data-testid="cms-collection-sorting"`         | CmsCollection.Sort             | Sorting container            |
| `data-testid="cms-collection-filters"`         | CmsCollection.Filters          | Filters container            |
| `data-testid="cms-collection-items"`           | CmsCollection.Items            | Items container              |
| `data-testid="cms-collection-item"`            | CmsCollection.ItemRepeater     | Individual collection item   |
| `data-collection-item-id`                      | CmsCollection.ItemRepeater     | Item identifier              |
| `data-testid="cms-collection-load-more"`       | CmsCollection.ShowMoreAction   | Load more button             |
| `data-testid="cms-collection-next"`            | CmsCollection.NextAction       | Next page button             |
| `data-testid="cms-collection-prev"`            | CmsCollection.PrevAction       | Previous page button         |
| `data-testid="cms-collection-create-item"`     | CmsCollection.CreateItemAction | Create item button           |
| `data-testid="cms-collection-bulk-update"`     | CmsCollection.BulkUpdateAction | Bulk update button           |
| `data-testid="cms-collection-items-totals"`    | CmsCollection.Totals.Count     | Totals container             |
| `data-testid="cms-collection-items-displayed"` | CmsCollection.Totals.Displayed | Displayed count container    |
| `data-empty`                                   | CmsCollection.Items            | Empty collection status      |
| `data-infinite-scroll`                         | CmsCollection.Items            | Infinite scroll mode         |
| `data-total`                                   | CmsCollection.Totals.Count     | Total number of items        |
| `data-displayed`                               | CmsCollection.Totals.Displayed | Number based on displayType  |
| `data-display-type`                            | CmsCollection.Totals.Displayed | The displayType used         |
| `data-loading`                                 | Action components              | Operation in progress status |

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
            <span>
              Showing <CmsCollection.Totals.Displayed /> of{' '}
              <CmsCollection.Totals.Count /> items
            </span>
          </div>

          <div className="flex gap-4">
            <CmsCollection.Sort
              as="select"
              valueFormatter={({ sortBy, sortDirection }) =>
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
            <CmsItem.ImageField
              fieldKey="image"
              className="aspect-video rounded-lg mb-4"
            />
            <CmsItem.TextField
              fieldKey="title"
              className="text-lg font-semibold text-content-primary mb-2"
            />
            <CmsItem.DateField
              fieldKey="created"
              className="text-sm text-content-muted mb-4"
            />

            <div className="mt-4 space-y-2">
              <CmsItem.Action.Edit
                label="Edit Item"
                className="w-full btn-primary"
              />
              <CmsItem.Action.Delete
                label="Delete Item"
                className="w-full btn-secondary"
              />
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

### Working with Reference Fields Example

```tsx
function BlogPostsWithReferences() {
  return (
    <CmsCollection.Root
      collection={{
        id: 'BlogPosts',
        queryOptions: {
          limit: 10,
          returnTotalCount: true,
        },
        // Include reference fields to get full item data
        singleRefFieldIds: ['author', 'category'],
        multiRefFieldIds: ['tags', 'relatedPosts'],
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Blog Posts
          </h1>
          <span className="font-paragraph text-secondary-foreground">
            <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count />{' '}
            posts
          </span>
        </div>

        {/* Blog Posts List */}
        <CmsCollection.Items
          emptyState={
            <div className="text-center py-12">
              <p className="font-paragraph text-secondary-foreground">
                No blog posts found
              </p>
            </div>
          }
          className="space-y-6"
        >
          <CmsCollection.ItemRepeater className="bg-background border border-foreground/10 rounded-lg p-6">
            {/* Post Title */}
            <CmsItem.Field fieldId="title" asChild>
              {({ fieldValue, ...props }, ref) => (
                <h2
                  ref={ref}
                  {...props}
                  className="font-heading text-2xl font-bold text-foreground mb-4"
                >
                  {fieldValue}
                </h2>
              )}
            </CmsItem.Field>

            {/* Author (Single Reference) */}
            <CmsItem.Field fieldId="author" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="flex items-center gap-3 mb-4"
                >
                  <img
                    src={fieldValue?.avatar}
                    alt={fieldValue?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-paragraph font-semibold text-foreground">
                      {fieldValue?.name}
                    </p>
                    <p className="font-paragraph text-sm text-secondary-foreground">
                      {fieldValue?.role}
                    </p>
                  </div>
                </div>
              )}
            </CmsItem.Field>

            {/* Category (Single Reference) */}
            <CmsItem.Field fieldId="category" asChild>
              {({ fieldValue, ...props }, ref) => (
                <span
                  ref={ref}
                  {...props}
                  className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph mb-4"
                >
                  {fieldValue?.name}
                </span>
              )}
            </CmsItem.Field>

            {/* Post Excerpt */}
            <CmsItem.Field fieldId="excerpt" asChild>
              {({ fieldValue, ...props }, ref) => (
                <p
                  ref={ref}
                  {...props}
                  className="font-paragraph text-secondary-foreground mb-4"
                >
                  {fieldValue}
                </p>
              )}
            </CmsItem.Field>

            {/* Tags (Multi Reference) */}
            <CmsItem.Field fieldId="tags" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div ref={ref} {...props} className="flex flex-wrap gap-2 mb-4">
                  {fieldValue?.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-paragraph"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </CmsItem.Field>

            {/* Related Posts (Multi Reference) */}
            <CmsItem.Field fieldId="relatedPosts" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="mt-6 pt-6 border-t border-foreground/10"
                >
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Related Posts
                  </h3>
                  <div className="space-y-2">
                    {fieldValue?.map((post) => (
                      <a
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block font-paragraph text-secondary-foreground hover:text-primary transition-colors"
                      >
                        → {post.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CmsItem.Field>
          </CmsCollection.ItemRepeater>
        </CmsCollection.Items>

        {/* Pagination */}
        <div className="flex gap-2 justify-center">
          <CmsCollection.PrevAction className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
            Previous
          </CmsCollection.PrevAction>
          <CmsCollection.NextAction className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Next
          </CmsCollection.NextAction>
        </div>
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
                <CmsCollection.CreateItemAction
                  label="Create Item"
                  className="btn-primary"
                />
              </CardContent>
            </Card>
          }
        >
          <CmsCollection.ItemRepeater className="hover:bg-surface-hover transition-colors">
            <CmsItem.TextField
              fieldKey="title"
              className="font-medium text-content-primary"
            />
            <CmsItem.TextField
              fieldKey="status"
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-status-success-light text-status-success"
            />
            <CmsItem.DateField
              fieldKey="modified"
              className="text-content-muted text-sm"
            />
            <div className="flex gap-2">
              <CmsItem.Action.Edit
                label="Edit"
                className="btn-sm btn-secondary"
              />
              <CmsItem.Action.Delete
                label="Delete"
                className="btn-sm btn-outline text-status-error"
              />
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
            <CmsCollection.PrevAction className="btn-outline">
              Previous
            </CmsCollection.PrevAction>
            <CmsCollection.NextAction className="btn-outline">
              Next
            </CmsCollection.NextAction>
          </div>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
```

### Working with Reference Fields Example

```tsx
function BlogPostsWithReferences() {
  return (
    <CmsCollection.Root
      collection={{
        id: 'BlogPosts',
        queryOptions: {
          limit: 10,
          returnTotalCount: true,
        },
        // Include reference fields to get full item data
        singleRefFieldIds: ['author', 'category'],
        multiRefFieldIds: ['tags', 'relatedPosts'],
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Blog Posts
          </h1>
          <span className="font-paragraph text-secondary-foreground">
            <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count />{' '}
            posts
          </span>
        </div>

        {/* Blog Posts List */}
        <CmsCollection.Items
          emptyState={
            <div className="text-center py-12">
              <p className="font-paragraph text-secondary-foreground">
                No blog posts found
              </p>
            </div>
          }
          className="space-y-6"
        >
          <CmsCollection.ItemRepeater className="bg-background border border-foreground/10 rounded-lg p-6">
            {/* Post Title */}
            <CmsItem.Field fieldId="title" asChild>
              {({ fieldValue, ...props }, ref) => (
                <h2
                  ref={ref}
                  {...props}
                  className="font-heading text-2xl font-bold text-foreground mb-4"
                >
                  {fieldValue}
                </h2>
              )}
            </CmsItem.Field>

            {/* Author (Single Reference) */}
            <CmsItem.Field fieldId="author" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="flex items-center gap-3 mb-4"
                >
                  <img
                    src={fieldValue?.avatar}
                    alt={fieldValue?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-paragraph font-semibold text-foreground">
                      {fieldValue?.name}
                    </p>
                    <p className="font-paragraph text-sm text-secondary-foreground">
                      {fieldValue?.role}
                    </p>
                  </div>
                </div>
              )}
            </CmsItem.Field>

            {/* Category (Single Reference) */}
            <CmsItem.Field fieldId="category" asChild>
              {({ fieldValue, ...props }, ref) => (
                <span
                  ref={ref}
                  {...props}
                  className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph mb-4"
                >
                  {fieldValue?.name}
                </span>
              )}
            </CmsItem.Field>

            {/* Post Excerpt */}
            <CmsItem.Field fieldId="excerpt" asChild>
              {({ fieldValue, ...props }, ref) => (
                <p
                  ref={ref}
                  {...props}
                  className="font-paragraph text-secondary-foreground mb-4"
                >
                  {fieldValue}
                </p>
              )}
            </CmsItem.Field>

            {/* Tags (Multi Reference) */}
            <CmsItem.Field fieldId="tags" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div ref={ref} {...props} className="flex flex-wrap gap-2 mb-4">
                  {fieldValue?.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-paragraph"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </CmsItem.Field>

            {/* Related Posts (Multi Reference) */}
            <CmsItem.Field fieldId="relatedPosts" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="mt-6 pt-6 border-t border-foreground/10"
                >
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Related Posts
                  </h3>
                  <div className="space-y-2">
                    {fieldValue?.map((post) => (
                      <a
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block font-paragraph text-secondary-foreground hover:text-primary transition-colors"
                      >
                        → {post.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CmsItem.Field>
          </CmsCollection.ItemRepeater>
        </CmsCollection.Items>

        {/* Pagination */}
        <div className="flex gap-2 justify-center">
          <CmsCollection.PrevAction className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
            Previous
          </CmsCollection.PrevAction>
          <CmsCollection.NextAction className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Next
          </CmsCollection.NextAction>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
```

### Complete Variant Examples

```tsx
function CmsCollectionWithVariants() {
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'list' | 'card'>(
    'grid',
  );
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
                <CmsItem.ImageField
                  fieldKey="image"
                  className="w-full aspect-square rounded mb-3"
                />
                <CmsItem.TextField
                  fieldKey="title"
                  className="font-semibold mb-2"
                />
                <CmsItem.TextField
                  fieldKey="description"
                  className="text-sm text-gray-600 mb-3"
                />
                <div className="flex gap-2">
                  <CmsItem.Action.Edit
                    label="Edit"
                    className="btn-sm btn-primary"
                  />
                  <CmsItem.Action.Delete
                    label="Delete"
                    className="btn-sm btn-outline"
                  />
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
              <CmsItem.ImageField
                fieldKey="image"
                className="w-12 h-12 rounded object-cover"
              />
              <CmsItem.TextField fieldKey="title" className="font-medium" />
              <CmsItem.TextField fieldKey="status" />
              <CmsItem.DateField
                fieldKey="created"
                className="text-sm text-gray-500"
              />
              <div className="flex gap-1">
                <CmsItem.Action.Edit
                  label="Edit"
                  className="btn-xs btn-secondary"
                />
                <CmsItem.Action.Delete
                  label="Delete"
                  className="btn-xs btn-outline"
                />
              </div>
            </CmsCollection.ItemRepeater>
          </CmsCollection.Items>
        )}

        {viewMode === 'list' && (
          <CmsCollection.Items
            variant="list"
            className="bg-white rounded-lg border divide-y"
          >
            <CmsCollection.ItemRepeater className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <CmsItem.ImageField
                  fieldKey="image"
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <CmsItem.TextField
                    fieldKey="title"
                    className="font-semibold mb-1"
                  />
                  <CmsItem.TextField
                    fieldKey="description"
                    className="text-sm text-gray-600"
                  />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <CmsItem.DateField
                    fieldKey="modified"
                    className="text-xs text-gray-500"
                  />
                  <div className="flex gap-1">
                    <CmsItem.Action.Edit
                      label="Edit"
                      className="btn-xs btn-primary"
                    />
                    <CmsItem.Action.Delete
                      label="Delete"
                      className="btn-xs btn-outline"
                    />
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
                <CmsItem.TextField
                  fieldKey="title"
                  className="text-2xl font-bold mb-6"
                />
                <CmsItem.ImageField
                  fieldKey="image"
                  className="w-full aspect-video rounded-lg mb-6"
                />
                <CmsItem.TextField
                  fieldKey="description"
                  className="text-gray-700 leading-relaxed mb-6"
                />
                <div className="flex items-center justify-between">
                  <CmsItem.DateField
                    fieldKey="created"
                    className="text-sm text-gray-500"
                  />
                  <div className="flex gap-3">
                    <CmsItem.Action.Edit
                      label="Edit Item"
                      className="btn btn-primary"
                    />
                    <CmsItem.Action.Delete
                      label="Delete"
                      className="btn btn-outline"
                    />
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

### Working with Reference Fields Example

```tsx
function BlogPostsWithReferences() {
  return (
    <CmsCollection.Root
      collection={{
        id: 'BlogPosts',
        queryOptions: {
          limit: 10,
          returnTotalCount: true,
        },
        // Include reference fields to get full item data
        singleRefFieldIds: ['author', 'category'],
        multiRefFieldIds: ['tags', 'relatedPosts'],
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Blog Posts
          </h1>
          <span className="font-paragraph text-secondary-foreground">
            <CmsCollection.Totals.Displayed /> of <CmsCollection.Totals.Count />{' '}
            posts
          </span>
        </div>

        {/* Blog Posts List */}
        <CmsCollection.Items
          emptyState={
            <div className="text-center py-12">
              <p className="font-paragraph text-secondary-foreground">
                No blog posts found
              </p>
            </div>
          }
          className="space-y-6"
        >
          <CmsCollection.ItemRepeater className="bg-background border border-foreground/10 rounded-lg p-6">
            {/* Post Title */}
            <CmsItem.Field fieldId="title" asChild>
              {({ fieldValue, ...props }, ref) => (
                <h2
                  ref={ref}
                  {...props}
                  className="font-heading text-2xl font-bold text-foreground mb-4"
                >
                  {fieldValue}
                </h2>
              )}
            </CmsItem.Field>

            {/* Author (Single Reference) */}
            <CmsItem.Field fieldId="author" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="flex items-center gap-3 mb-4"
                >
                  <img
                    src={fieldValue?.avatar}
                    alt={fieldValue?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-paragraph font-semibold text-foreground">
                      {fieldValue?.name}
                    </p>
                    <p className="font-paragraph text-sm text-secondary-foreground">
                      {fieldValue?.role}
                    </p>
                  </div>
                </div>
              )}
            </CmsItem.Field>

            {/* Category (Single Reference) */}
            <CmsItem.Field fieldId="category" asChild>
              {({ fieldValue, ...props }, ref) => (
                <span
                  ref={ref}
                  {...props}
                  className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-paragraph mb-4"
                >
                  {fieldValue?.name}
                </span>
              )}
            </CmsItem.Field>

            {/* Post Excerpt */}
            <CmsItem.Field fieldId="excerpt" asChild>
              {({ fieldValue, ...props }, ref) => (
                <p
                  ref={ref}
                  {...props}
                  className="font-paragraph text-secondary-foreground mb-4"
                >
                  {fieldValue}
                </p>
              )}
            </CmsItem.Field>

            {/* Tags (Multi Reference) */}
            <CmsItem.Field fieldId="tags" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div ref={ref} {...props} className="flex flex-wrap gap-2 mb-4">
                  {fieldValue?.map((tag) => (
                    <span
                      key={tag._id}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-paragraph"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}
            </CmsItem.Field>

            {/* Related Posts (Multi Reference) */}
            <CmsItem.Field fieldId="relatedPosts" asChild>
              {({ fieldValue, ...props }, ref) => (
                <div
                  ref={ref}
                  {...props}
                  className="mt-6 pt-6 border-t border-foreground/10"
                >
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Related Posts
                  </h3>
                  <div className="space-y-2">
                    {fieldValue?.map((post) => (
                      <a
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="block font-paragraph text-secondary-foreground hover:text-primary transition-colors"
                      >
                        → {post.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CmsItem.Field>
          </CmsCollection.ItemRepeater>
        </CmsCollection.Items>

        {/* Pagination */}
        <div className="flex gap-2 justify-center">
          <CmsCollection.PrevAction className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
            Previous
          </CmsCollection.PrevAction>
          <CmsCollection.NextAction className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Next
          </CmsCollection.NextAction>
        </div>
      </div>
    </CmsCollection.Root>
  );
}
```
