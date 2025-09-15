# ProgramList Interface Documentation

A comprehensive program category list display component system built with composable primitives, similar to Radix UI architecture, for displaying collections of program categories.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [CategoryList.Root](#categorylistroot)
  - [CategoryList.Raw](#categorylistraw)
  - [CategoryList.Categories](#categorylistcategories)
  - [CategoryList.CategoryRepeater](#categorylistcategoryrepeater)
- [Usage Examples](#usage-examples) _(soon...)_

## Architecture

The CategoryList component follows a compound component pattern where each part can be composed together to create flexible category collection displays.

## Components

### CategoryList.Root

The root container that provides category list data to all child components.

**Props**

```tsx
interface CategoryListRootProps {
  children: React.ReactNode;
  categoryListConfig?: CategoryListServiceConfig;
}
```

**Example**

```tsx
<CategoryList.Root categoryListConfig={{ programs: myCategories }}>
  <CategoryList.Categories>
    <CategoryList.CategoryRepeater>
      <Category.Id />
      <Category.Label />
    </CategoryList.CategoryRepeater>
  </CategoryList.Categories>
</CategoryList.Root>
```

### CategoryList.Raw

Provides direct access to category list data. Should be used only when need custom access to list data.

**Example**

```tsx
<CategoryList.Root categoryListConfig={{ programs: myCategories }}>
  <CategoryList.Raw>
    {({ categories }) => (
      <div>
        {categories.map((category) => (
          <div key={category._id}>{category.label}</div>
        ))}
      </div>
    )}
  </CategoryList.Raw>
</CategoryList.Root>
```

---

### CategoryList.Categories

Main container for the category list display with support for empty states and custom layouts.

**Data Attributes**

- `data-testid="program-category-list-items"` - Applied to categories container

**Props**

```tsx
interface CategoryListCategoriesProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}
```

**Example**

```tsx
<CategoryList.Categories emptyState={<div>No categories found</div>}>
  <CategoryList.CategoryRepeater>
    <Category.Id />
    <Category.Label />
  </CategoryList.CategoryRepeater>
</CategoryList.Categories>
```

---

### CategoryList.CategoryRepeater

Repeats for each category in the list, providing individual category context.

**Props**

```tsx
interface CategoryListCategoryRepeaterProps {
  children: React.ReactNode;
```

**Example**

```tsx
<CategoryList.CategoryRepeater>
  <Category.Id />
  <Category.Label />
</CategoryList.CategoryRepeater>
```

## Usage Examples

_(soon...)_
