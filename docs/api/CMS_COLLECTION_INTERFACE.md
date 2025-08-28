# CMS Collection Interface Documentation

A comprehensive CMS collection display component system built with composable primitives, similar to Radix UI architecture, for displaying and managing collections of CMS items.

## Table of Contents

### Components

- [CmsCollection.Root](#cmscollectionroot)
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
  invalidateKey?: string; // a key for invalidating the data
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
}
```
**Example**
```tsx
// show just 3 items
<CmsCollection.Items
  emptyState={<div>No items found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  infiniteScroll={false}
  pageSize={3}
>
  <CmsCollection.ItemRepeater>
    {/* Collection Item template */}
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>

<CmsCollection.Items
  emptyState={<div>No items found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  infiniteScroll
>
  <CmsCollection.ItemRepeater>
    {/* Collection Item template */}
  </CmsCollection.ItemRepeater>
</CmsCollection.Items>
```

**Data Attributes**
- `data-testid="cms-collecion-items"`
- `data-empty` - Is collection empty

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
| `data-testid="cms-collection-items"` | CmsCollection.Items | Items container |
| `data-testid="cms-collection-item"` | CmsCollection.ItemRepeater | Individual collection item |
| `data-testid="cms-collection-load-more"` | CmsCollection.ShowMoreAction | Load more button |
| `data-testid="cms-collection-next"` | CmsCollection.NextAction | Next page button |
| `data-testid="cms-collection-prev"` | CmsCollection.PrevAction | Previous page button |
| `data-testid="cms-collection-create-item"` | CmsCollection.CreateItemAction | Create item button |
| `data-testid="cms-collection-bulk-update"` | CmsCollection.BulkUpdateAction | Bulk update button |
| `data-testid="cms-collection-items-totals"` | CmsCollection.Totals.Count/Displayed | Totals container |
| `data-empty` | CmsCollection.Items | Empty collection status |
| `data-infinite-scroll` | CmsCollection.Items | Infinite scroll mode |
| `data-page-size` | CmsCollection.Items | Current page size setting |
| `data-total` | CmsCollection.Totals.Count | Total number of items |
| `data-displayed` | CmsCollection.Totals.Displayed | Number of items displayed |
| `data-selected-count` | CmsCollection.BulkUpdateAction | Number of selected items |
| `data-loading` | Action components | Operation in progress status |
