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

## Working with Reference Fields

CMS items support reference fields that link to items in other collections. When fetching an individual item, you can include the full referenced item data instead of just the reference IDs.

### Reference Field Types

- **Single Reference Fields**: Fields that reference one item from another collection (e.g., `author`, `category`)
- **Multi Reference Fields**: Fields that reference multiple items from other collections (e.g., `tags`, `relatedItems`)

### Including References When Fetching Items

Use the `singleRefFieldIds` and `multiRefFieldIds` properties in `CmsItem.Root` to specify which reference fields should be included:

```tsx
<CmsItem.Root
  item={{
    collectionId: 'BlogPosts',
    id: 'post-123',
    singleRefFieldIds: ['author', 'category'],
    multiRefFieldIds: ['tags', 'relatedPosts'],
  }}
>
  {/* Access main item fields */}
  <CmsItem.Field fieldId="title" asChild>
    {({ fieldValue, ...props }, ref) => (
      <h1 ref={ref} {...props}>
        {fieldValue}
      </h1>
    )}
  </CmsItem.Field>

  {/* Access single reference field - returns full item */}
  <CmsItem.Field fieldId="author" asChild>
    {({ fieldValue, ...props }, ref) => (
      <div ref={ref} {...props}>
        <span>{fieldValue?.name}</span>
        <span>{fieldValue?.email}</span>
      </div>
    )}
  </CmsItem.Field>

  {/* Access multi reference field - returns array of items */}
  <CmsItem.Field fieldId="tags" asChild>
    {({ fieldValue, ...props }, ref) => (
      <div ref={ref} {...props}>
        {fieldValue?.map((tag) => (
          <span key={tag._id}>{tag.name}</span>
        ))}
      </div>
    )}
  </CmsItem.Field>
</CmsItem.Root>
```

**Important Notes:**

- Without including references, reference fields will only contain the referenced item IDs
- Including references requires using `query()` instead of `get()` in the underlying implementation
- Only include the reference fields you actually need to display
- Invalid field IDs are silently ignored by the Wix Data API

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
    /** List of field IDs for single reference fields to include */
    singleRefFieldIds?: string[];
    /** List of field IDs for multi reference fields to include */
    multiRefFieldIds?: string[];
  };
}
```

**Example**

```tsx
// Basic usage
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

// With reference fields included
<CmsItem.Root
  item={{
    collectionId: 'BlogPosts',
    id: 'post-123',
    singleRefFieldIds: ['author', 'category'],
    multiRefFieldIds: ['tags', 'relatedPosts']
  }}
>
  <CmsItem.Field fieldId="title" asChild>
    {({ fieldValue, ...props }, ref) => (
      <h1 ref={ref} {...props}>{fieldValue}</h1>
    )}
  </CmsItem.Field>

  {/* Access referenced author data */}
  <CmsItem.Field fieldId="author" asChild>
    {({ fieldValue, ...props }, ref) => (
      <span ref={ref} {...props}>{fieldValue?.name}</span>
    )}
  </CmsItem.Field>

  {/* Access referenced tags array */}
  <CmsItem.Field fieldId="tags" asChild>
    {({ fieldValue, ...props }, ref) => (
      <div ref={ref} {...props}>
        {fieldValue?.map((tag) => (
          <span key={tag._id}>{tag.name}</span>
        ))}
      </div>
    )}
  </CmsItem.Field>
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

## Usage Examples

### Basic Item Display

```tsx
function BlogPostPage({ postId }: { postId: string }) {
  return (
    <CmsItem.Root item={{ collectionId: 'BlogPosts', id: postId }}>
      <article className="bg-background p-6 rounded-lg">
        <CmsItem.Field fieldId="title" asChild>
          {({ fieldValue, ...props }, ref) => (
            <h1
              ref={ref}
              {...props}
              className="font-heading text-4xl font-bold text-foreground mb-4"
            >
              {fieldValue}
            </h1>
          )}
        </CmsItem.Field>

        <CmsItem.Field fieldId="publishDate" asChild>
          {({ fieldValue, ...props }, ref) => (
            <time
              ref={ref}
              {...props}
              className="font-paragraph text-sm text-secondary-foreground"
            >
              {new Date(fieldValue).toLocaleDateString()}
            </time>
          )}
        </CmsItem.Field>

        <CmsItem.Field fieldId="content" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              className="font-paragraph text-foreground mt-6"
              dangerouslySetInnerHTML={{ __html: fieldValue }}
            />
          )}
        </CmsItem.Field>
      </article>
    </CmsItem.Root>
  );
}
```

### Item with Reference Fields

```tsx
function ProductPage({ productId }: { productId: string }) {
  return (
    <CmsItem.Root
      item={{
        collectionId: 'Products',
        id: productId,
        singleRefFieldIds: ['category', 'brand', 'manufacturer'],
        multiRefFieldIds: ['relatedProducts', 'reviews', 'tags'],
      }}
    >
      <div className="bg-background p-6 rounded-lg">
        {/* Product Name */}
        <CmsItem.Field fieldId="name" asChild>
          {({ fieldValue, ...props }, ref) => (
            <h1
              ref={ref}
              {...props}
              className="font-heading text-3xl font-bold text-foreground mb-4"
            >
              {fieldValue}
            </h1>
          )}
        </CmsItem.Field>

        {/* Category (Single Reference) */}
        <CmsItem.Field fieldId="category" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div ref={ref} {...props} className="mb-4">
              <span className="font-paragraph text-sm text-secondary-foreground">
                Category:
              </span>
              <span className="font-paragraph font-semibold text-foreground ml-2">
                {fieldValue?.name}
              </span>
            </div>
          )}
        </CmsItem.Field>

        {/* Brand (Single Reference) */}
        <CmsItem.Field fieldId="brand" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div ref={ref} {...props} className="flex items-center gap-2 mb-4">
              <img
                src={fieldValue?.logo}
                alt={fieldValue?.name}
                className="w-8 h-8"
              />
              <span className="font-paragraph text-foreground">
                {fieldValue?.name}
              </span>
            </div>
          )}
        </CmsItem.Field>

        {/* Product Image */}
        <CmsItem.Field fieldId="image" asChild>
          {({ fieldValue, ...props }, ref) => (
            <img
              ref={ref}
              {...props}
              src={fieldValue?.url}
              alt={fieldValue?.alt}
              className="w-full h-auto rounded-lg mb-6"
            />
          )}
        </CmsItem.Field>

        {/* Product Description */}
        <CmsItem.Field fieldId="description" asChild>
          {({ fieldValue, ...props }, ref) => (
            <p
              ref={ref}
              {...props}
              className="font-paragraph text-secondary-foreground mb-6"
            >
              {fieldValue}
            </p>
          )}
        </CmsItem.Field>

        {/* Tags (Multi Reference) */}
        <CmsItem.Field fieldId="tags" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div ref={ref} {...props} className="flex flex-wrap gap-2 mb-6">
              {fieldValue?.map((tag: any) => (
                <span
                  key={tag._id}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-paragraph"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </CmsItem.Field>

        {/* Related Products (Multi Reference) */}
        <CmsItem.Field fieldId="relatedProducts" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              className="mt-8 pt-8 border-t border-foreground/10"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Related Products
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {fieldValue?.map((product: any) => (
                  <a
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="block"
                  >
                    <img
                      src={product.image?.url}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="font-paragraph text-sm text-foreground">
                      {product.name}
                    </p>
                    <p className="font-paragraph text-sm font-bold text-primary">
                      ${product.price}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CmsItem.Field>

        {/* Reviews (Multi Reference) */}
        <CmsItem.Field fieldId="reviews" asChild>
          {({ fieldValue, ...props }, ref) => (
            <div
              ref={ref}
              {...props}
              className="mt-8 pt-8 border-t border-foreground/10"
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-4">
                Customer Reviews
              </h3>
              <div className="space-y-4">
                {fieldValue?.map((review: any) => (
                  <div
                    key={review._id}
                    className="bg-background border border-foreground/10 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-paragraph font-semibold text-foreground">
                        {review.author?.name}
                      </span>
                      <span className="font-paragraph text-sm text-secondary-foreground">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-paragraph text-secondary-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CmsItem.Field>
      </div>
    </CmsItem.Root>
  );
}
```

### Server-Side Data Loading

```tsx
// In Astro frontmatter or server action
import { loadCmsItemServiceInitialData } from '@wix/headless-cms/services';

const cmsItemConfig = await loadCmsItemServiceInitialData(
  'BlogPosts',
  'post-123',
  ['author', 'category'], // single reference fields
  ['tags', 'relatedPosts'], // multi-reference fields
);

// Pass to React component
<MyItemPage cmsItemConfig={cmsItemConfig} />;
```

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
