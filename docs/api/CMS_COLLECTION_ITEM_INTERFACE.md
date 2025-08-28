# CMS Collection Item Interface Documentation

A comprehensive CMS collection item component system built with composable primitives, similar to Radix UI architecture, for displaying and managing individual CMS collection items and their fields.

## Table of Contents

### Components

- [CmsItem.Root](#cmsitemroot)
- [CmsItem.TextField](#cmsitemtextfield)
- [CmsItem.ImageField](#cmsitemimagefield)
- [CmsItem.DateField](#cmsitemdatefield)
- [CmsItem.CustomField](#cmsitemcustomfield)
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
interface CmsItemRootProps {
  item: ItemData;
  children: React.ReactNode;
  invalidateKey?: string // a key for invalidating the data
}
```

**Example**
```tsx
<CmsItem.Root item={item}>
  {/* All product components */}
</CmsItem.Root>

```

- `data-testid="collection-item"`
- `data-collection-item-id'="item-id"`

*Note: Do we need a loading state?*

---

### CmsItem.TextField

Displays an item textual field with customizable rendering.

**Props**
```tsx
interface TextFieldProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {name: string}>;
  fieldId: string; // in cms we can have inifinit fields, we need to have the collection fields data beforhand (we have it in vibe)
}
```

**Example**
```tsx
// plain
<CmsItem.TextField className="text-4xl font-bold">

// asChild with primitive
<CmsItem.TextField asChild>
  <h1 className="text-4xl font-bold">
</CmsItem.TextField>

// asChild use with react component (mind the ref)
<CmsItem.TextField asChild>
  {React.forwardRef(({text, ...props}, ref) => (
    <h1 ref={ref} {...props} className="text-4xl font-bold">
      {text}
    </h1>
  ))}
</CmsItem.TextField>
```

**Data Attributes**
- `data-testid="field-id"`
- `data-collection-item-field="field-id"`


Note - this approach relies on the fact that the system generating the headless is aware of the fields beforhand as cms can have infinite field (should we do it differently?)
---

### CmsItem.ImageField

Displays an item image field with customizable rendering.

**Props**
```tsx
interface ImageField {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {src: string, alt: string}>;
  fieldId: string; // in cms we can have inifinit fields, we need to have the collection fields data beforhand (we have it in vibe)
}
```

**Example**
```tsx
// plain
<CmsItem.ImageField className="text-4xl font-bold">

// asChild with primitive
<CmsItem.ImageField asChild>
  <img className="w-full h-auto rounded-lg" />
</CmsItem.ImageField>

// asChild use with react component (mind the ref)
<CmsItem.ImageField asChild>
  {React.forwardRef(({src, alt, ...props}, ref) => (
    <img ref={ref} {...props} src={src} alt={alt} className="w-full h-auto rounded-lg" />
  ))}
</CmsItem.ImageField>

```

**Data Attributes**
- `data-testid="field-id"`
- `data-collection-item-field="field-id"`

---

### CmsItem.DateField

Displays an item date field with customizable rendering. (could be text field as well)

**Props**
```tsx
interface DateField {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {date: string, formattedDate: string}>;
  fieldId: string; // in cms we can have inifinit fields, we need to have the collection fields data beforhand (we have it in vibe)
}
```

**Example**
```tsx
// plain
<CmsItem.DateField className="text-sm text-content-secondary">

// asChild with primitive
<CmsItem.DateField asChild>
  <time className="text-sm text-content-secondary" />
</CmsItem.DateField>

// asChild use with react component (mind the ref)
<CmsItem.DateField asChild>
  {React.forwardRef(({date, formattedDate, ...props}, ref) => (
    <time ref={ref} {...props} dateTime={date} className="text-sm text-content-secondary">
      {formattedDate}
    </time>
  ))}
</CmsItem.DateField>

```

**Data Attributes**
- `data-testid="field-id"`
- `data-collection-item-field="field-id"`

---

### CmsItem.CustomField

Displays any field type without restriction

**Props**
```tsx
interface CustomField {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, {fieldData: any}>;
  fieldId: string; // in cms we can have inifinit fields, we need to have the collection fields data beforhand (we have it in vibe)
}
```

**Example**
```tsx
// asChild use with react component (mind the ref), only this form should be used with custom fields

// Example 1: Simple rating field
<CmsItem.CustomField fieldId="rating" asChild>
  {React.forwardRef(({fieldData, ...props}, ref) => (
    <div ref={ref} {...props} className="flex items-center gap-1">
      <span className="text-sm text-content-secondary">
        ({fieldData?.rating}/5)
      </span>
    </div>
  ))}
</CmsItem.CustomField>

// Example 2: Price with currency
<CmsItem.CustomField fieldId="price" asChild>
  {React.forwardRef(({fieldData, ...props}, ref) => (
    <span ref={ref} {...props} className="text-lg font-bold text-brand-primary">
      {fieldData?.price}
    </span>
  ))}
</CmsItem.CustomField>
```

**Data Attributes**
- `data-testid="field-id"`
- `data-collection-item-field="field-id"`

---


### CmsItem.Action.Update

Update cms collection item

**Props**
```tsx
interface CmsItemActionUpdateProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
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
The implentation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

### CmsItem.Action.Delete

Delete cms collection item

**Props**
```tsx
interface CmsItemActionDeleteProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
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

Add to cart action button. (do we need it?) applied only if it's cms ecom.

**Props**
```tsx
interface CmsItemActionEcomProps {
  asChild?: boolean;
  label: string;
  children?: React.ForwardRefRenderFunction<HTMLButtonElement, {
    disabled: boolean;
    isLoading: boolean;
    onClick: () => Promise<void>;
  }>;
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
The implentation of these buttons should be done by rendering Cart.Actions.AddToCart and Cart.Actions.BuyNow which are ecommerce headless components.

- `disabled` - can't perform action. i.e. - add to cart (missing values, out of stock, etc)
- `data-in-progress` - the action is in progress. i.e. - add to cart (loading, etc)

---

## Data Attributes Summary

| Attribute | Applied To | Purpose |
|-----------|------------|---------|
| `data-testid="collection-item"` | CmsItem.Root | Collection item root container |
| `data-collection-item-id="item-id"` | CmsItem.Root | Item identifier |
| `data-testid="field-id"` | Field components | Field identifier for testing |
| `data-collection-item-field="field-id"` | Field components | Field identifier within item |
| `data-testid="cms-item-action-update"` | CmsItem.Action.Update | Update action button |
| `data-testid="cms-item-action-delete"` | CmsItem.Action.Delete | Delete action button |
| `data-testid="cms-item-action-add-to-cart"` | CmsItem.Action.AddToCart | Add to cart action button |
| `data-testid="cms-item-action-buy-now"` | CmsItem.Action.BuyNow | Buy now action button |
| `data-testid="cms-item-action-pre-order"` | CmsItem.Action.PreOrder | Pre-order action button |
| `data-loading` | Action components | Operation in progress status |
| `data-in-progress` | Action components | Action execution status |
| `disabled` | Action components | Action disabled state |
