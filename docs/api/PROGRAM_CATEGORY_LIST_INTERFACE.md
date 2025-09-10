# ProgramList Interface Documentation

A comprehensive program category list display component system built with composable primitives, similar to Radix UI architecture, for displaying collections of program categories.

## Architecture

The ProgramCategoryList component follows a compound component pattern where each part can be composed together to create flexible program category collection displays. It supports both simplified and headless interfaces.

## Components

### ProgramCategoryList.Root

The root container that provides category list context to all child components.

**Props**

```tsx
interface ProgramCategoryListRootProps {
  categories?: ProgramCategory[];
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramCategoryList.Root categories={categories}>
  {/* All category list components */}
</ProgramCategoryList.Root>
```

---

### ProgramCategoryList.Categories

Main container for the category list display with support for empty states and custom layouts.

**Data Attributes**

- `data-testid="program-category-list-categories"` - Applied to categories container
- `data-empty` - Is list empty

**Props**

```tsx
interface ProgramCategoryListCategoriesProps {
  asChild?: boolean;
  emptyState?: React.ReactNode;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramCategoryList.Categories emptyState={<div>No categories found</div>}>
  <ProgramCategoryList.CategoryRepeater>
    {/* Category template */}
  </ProgramCategoryList.CategoryRepeater>
</ProgramCategoryList.Categories>
```

---

### ProgramCategoryList.CategoryRepeater

Repeats for each category in the list, providing individual category context.

**Props**

```tsx
interface ProgramCategoryListCategoryRepeaterProps {
  asChild?: boolean;
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          category: ProgramCategory;
        }
      >;
}
```

**Data Attributes**

- `data-testid="program-category-list-category"` - Applied to repeater container

**Example**

```tsx
<ProgramCategoryList.CategoryRepeater>
  <ProgramCategory.Label />
</ProgramCategoryList.CategoryRepeater>
```

## Usage Examples

### Program Category Tabs

```tsx
function ProgramCategoryTabs() {
  const categories = useCategories();

  return (
    <ProgramCategoryList.Root categories={categories}>
      <ProgramCategoryList.Categories>
        <Tabs.Root defaultValue={categories[0]._id}>
          <Tabs.List>
            <ProgramCategoryList.CategoryRepeater asChild>
              {React.forwardRef(({ category, ...rest }, ref) => (
                <Tabs.Trigger ref={ref} {...rest} value={category._id}>
                  <ProgramCategory.Label />
                </Tabs.Trigger>
              ))}
            </ProgramCategoryList.CategoryRepeater>
          </Tabs.List>

          <ProgramCategoryList.CategoryRepeater asChild>
            {React.forwardRef(({ category, ...rest }, ref) => (
              <Tabs.Content ref={ref} {...rest} value={category._id}>
                <ProgramCategory.Label />
              </Tabs.Content>
            ))}
          </ProgramCategoryList.CategoryRepeater>
        </Tabs.Root>
      </ProgramCategoryList.Categories>
    </ProgramCategoryList.Root>
  );
}
```
