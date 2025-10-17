# CMS Collection Item Interface Documentation

A comprehensive CMS collection item component system built with composable primitives, similar to Radix UI architecture, for displaying and managing individual CMS collection items and their fields.

## Table of Contents

### Components

- [CmsItem.Root](#cmsitemroot)
- [CmsItem.Field](#cmsitemfield)
- [CmsItem.Action.Update](#cmsitemactionupdate)
- [CmsItem.Action.Delete](#cmsitemactiondelete)
- [CmsItem.Action.AddToCart/CmsItem.Action.BuyNow/CmsItem.Action.PreOrder](#cmsitemactionaddtocartcmsitemactionbuynowcmsitemactionpreorder)

---

## Architecture

The CmsItem component system follows a compound component pattern where individual field components and actions can be composed together to create flexible CMS item displays. Each field type (TextField, ImageField, DateField, CustomField) provides specialized handling for different data types, while action components handle CRUD operations and e-commerce integration.

## Components

### CmsItem.Root

The root container that provides the cms item context to all child components.

**Props**

```tsx
interface RootProps {
  children: React.ReactNode;
  item: {
    collectionId: string;
    id: string;
    item?: any;
  };
}
```

**Example**

```tsx
<CmsItem.Root item={{ collectionId: 'MyCollection', id: 'item-123' }}>
  {/* All item field components */}
</CmsItem.Root>

// With pre-loaded item data
<CmsItem.Root item={{
  collectionId: 'MyCollection',
  id: 'item-123',
  item: itemData
}}>
  {/* All item field components */}
</CmsItem.Root>
```

**Data Attributes**

- `data-testid="collection-item"` - Applied to item root container
- `data-collection-item-id="item-id"` - Item identifier

---

### CmsItem.Field

General-purpose field component that displays any CMS item field with customizable rendering.

**Props**

```tsx
interface FieldProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, FieldRenderProps>;
  fieldId: string;
  className?: string;
}

interface FieldRenderProps {
  fieldValue: any;
  'data-testid'?: string;
  'data-collection-item-field'?: string;
}
```

**Example**

```tsx
// Text field
<CmsItem.Field fieldId="title" asChild>
  {({ fieldValue, ...props }, ref) => (
    <h1 ref={ref} {...props} className="font-heading text-4xl font-bold text-foreground">
      {fieldValue}
    </h1>
  )}
</CmsItem.Field>

// Image field
<CmsItem.Field fieldId="heroImage" asChild>
  {({ fieldValue, ...props }, ref) => (
    <img
      ref={ref}
      {...props}
      src={fieldValue}
      alt={"hero image"}
      className="w-full h-auto rounded-lg"
    />
  )}
</CmsItem.Field>

// Date field
<CmsItem.Field fieldId="publishDate" asChild>
  {({ fieldValue, ...props }, ref) => (
    <time
      ref={ref}
      {...props}
      dateTime={fieldValue}
      className="font-paragraph text-sm text-secondary-foreground"
    >
      {new Date(fieldValue).toLocaleDateString()}
    </time>
  )}
</CmsItem.Field>

// Complex field with custom logic
<CmsItem.Field fieldId="rating" asChild>
  {({ fieldValue, ...props }, ref) => (
    <div ref={ref} {...props} className="flex items-center gap-1">
      <StarRating value={fieldValue?.rating} />
      <span className="font-paragraph text-sm text-secondary-foreground">
        ({fieldValue?.rating}/5)
      </span>
    </div>
  )}
</CmsItem.Field>

// Price field
<CmsItem.Field fieldId="price" asChild>
  {({ fieldValue, ...props }, ref) => (
    <span ref={ref} {...props} className="font-heading text-lg font-bold text-primary">
      ${fieldValue?.toFixed(2)}
    </span>
  )}
</CmsItem.Field>
```

**Data Attributes**

- `data-testid="field-id"` - Field identifier for testing
- `data-collection-item-field="field-id"` - Field identifier within item

**Note**: The `Field` component is the general-purpose implementation that handles all field types (text, image, date, and custom fields) with customizable rendering

---

### CmsItem.Action.Update

Planned action component for updating CMS collection items.

Update cms collection item

**Props**

```tsx
interface CmsItemActionUpdateProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    {
      disabled: boolean;
      isLoading: boolean;
      onClick: () => Promise<void>;
    }
  >;
}
```

**Example**

```tsx
// Default usage
<CmsItem.Action.Update label="save changes" className="w-full btn-primary" />

<CmsItem.Action.Update asChild label="Update item">
  <button/>
</CmsItem.Action.Update>
```

**Important**
The implementation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

### CmsItem.Action.Delete

Planned action component for deleting CMS collection items.

Delete cms collection item

**Props**

```tsx
interface CmsItemActionDeleteProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    {
      disabled: boolean;
      isLoading: boolean;
      onClick: () => Promise<void>;
    }
  >;
}
```

**Example**

```tsx
// Default usage
<CmsItem.Action.Delete label="delete" className="w-full btn-primary" />

// With trash icon
<CmsItem.Action.Delete asChild label="Delete item">
  <Button variant="destructive" size="icon">
    <TrashIcon className="h-4 w-4" />
  </Button>
</CmsItem.Action.Delete>
```

**Important**
The implentation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

### CmsItem.Action.AddToCart/CmsItem.Action.BuyNow/CmsItem.Action.PreOrder

Planned e-commerce action components for CMS items that are products.

Add to cart action button. Applied only if it's CMS e-commerce.

**Props**

```tsx
interface CmsItemActionEcomProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<
    HTMLButtonElement,
    {
      disabled: boolean;
      isLoading: boolean;
      onClick: () => Promise<void>;
    }
  >;
}
```

**Example**

```tsx
// Default usage
<CmsItem.Action.AddToCart label="add to cart" className="w-full btn-primary" />

<CmsItem.Action.PreOrder asChild label="Pre Order">
  <button/>
</CmsItem.Action.PreOrder>
```

**Important**
The implementation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

## Data Attributes Summary

| Attribute                                   | Applied To               | Purpose                                              |
| ------------------------------------------- | ------------------------ | ---------------------------------------------------- |
| `data-testid="collection-item"`             | CmsItem.Root             | Collection item root container                       |
| `data-collection-item-id`                   | CmsItem.Root             | Item identifier                                      |
| `data-testid="{fieldId}"`                   | CmsItem.Field            | Field identifier for testing (uses the fieldId prop) |
| `data-collection-item-field="{fieldId}"`    | CmsItem.Field            | Field identifier within item (uses the fieldId prop) |
| `data-testid="cms-item-action-update"`      | CmsItem.Action.Update    | Update action button                                 |
| `data-testid="cms-item-action-delete"`      | CmsItem.Action.Delete    | Delete action button                                 |
| `data-testid="cms-item-action-add-to-cart"` | CmsItem.Action.AddToCart | Add to cart action button                            |
| `data-testid="cms-item-action-buy-now"`     | CmsItem.Action.BuyNow    | Buy now action button                                |
| `data-testid="cms-item-action-pre-order"`   | CmsItem.Action.PreOrder  | Pre-order action button                              |
| `data-loading`                              | Action components        | Operation in progress status                         |
| `data-in-progress`                          | Action components        | Action execution status                              |
| `disabled`                                  | Action components        | Action disabled state                                |
