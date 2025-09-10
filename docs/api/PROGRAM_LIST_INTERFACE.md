# ProgramList Interface Documentation

A comprehensive program list display component system built with composable primitives, similar to Radix UI architecture, for displaying and filtering collections of programs.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [ProgramList.Root](#programlistroot)
  - [ProgramList.Programs](#programlistprograms)
  - [ProgramList.ProgramRepeater](#programlistprogramrepeater)
  - [ProgramList.CategoryList.Root](#programlistcategorylistroot)
  - [ProgramList.CategoryList.Categories](#programlistcategorylistcategories)
  - [ProgramList.CategoryList.CategoryRepeater](#programlistcategorylistcategoryrepeater)
  - [ProgramList.Category.Root](#programlistcategoryroot)
  - [ProgramList.Category.Label](#programlistcategorylabel)

## Architecture

The ProgramList component follows a compound component pattern where each part can be composed together to create flexible program collection displays. It supports both simplified and headless interfaces.

## Components

### ProgramList.Root

The root container that provides program list context to all child components.

**Props**

```tsx
interface ProgramListRootProps {
  programs?: Program[];
  programListConfig?: ProgramListServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Root programs={programs}>
  {/* All program list components */}
</ProgramList.Root>
```

---

### ProgramList.Programs

Main container for the program list display with support for empty states and custom layouts.

**Data Attributes**

- `data-testid="program-list-programs"` - Applied to programs container
- `data-empty` - Is list empty

**Props**

```tsx
interface ProgramListProgramsProps {
  asChild?: boolean;
  emptyState?: React.ReactNode;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Programs emptyState={<div>No programs found</div>}>
  <ProgramList.ProgramRepeater>
    {/* Program template */}
  </ProgramList.ProgramRepeater>
</ProgramList.Programs>
```

---

### ProgramList.ProgramRepeater

Repeats for each program in the list, providing individual program context.

**Props**

```tsx
interface ProgramListProgramRepeaterProps {
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="program-list-program"` - Applied to repeater container

**Example**

```tsx
<ProgramList.ProgramRepeater>
  <Program.Image />
  <Program.Title />
  <Program.Price />
</ProgramList.ProgramRepeater>
```

---

### ProgramList.CategoryList.Root

The root container that provides category list context to all child components.

**Props**

```tsx
interface ProgramListCategoryListRootProps {
  asChild?: boolean;
  categories?: Category[];
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.CategoryList.Root categories={categories}>
  {/* All category list components */}
</ProgramList.CategoryList.Root>
```

---

### ProgramList.CategoryList.Categories

Displays a list of categories with support for empty states and custom layouts.

**Props**

```tsx
interface ProgramListCategoryListProps {
  asChild?: boolean;
  emptyState?: React.ReactNode;
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="program-list-categories"` - Applied to categories container
- `data-empty` - Is list empty

**Example**

```tsx
<ProgramList.CategoryList emptyState={<div>No categories found</div>}>
  <ProgramList.CategoryListRepeater>
    <ProgramList.Category.Label />
  </ProgramList.CategoryListRepeater>
</ProgramList.CategoryList>
```

---

### ProgramList.CategoryList.CategoryRepeater

Repeats for each category in the list, providing individual category context.

**Props**

```tsx
interface ProgramListCategoryListRepeaterProps {
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="program-list-category"` - Applied to repeater container

**Example**

```tsx
<ProgramList.CategoryList.CategoryRepeater>
  {/* ProgramList.Category template */}
</ProgramList.CategoryList.CategoryRepeater>
```

---

### ProgramList.Category.Root

Displays a single category with support for custom layouts.

**Props**

```tsx
interface ProgramListCategoryRootProps {
  asChild?: boolean;
  category: Category;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Category.Root>
  {/* ProgramList.Category template */}
</ProgramList.Category.Root>
```

---

### ProgramList.Category.Label

Displays the category label.

**Props**

```tsx
interface ProgramListCategoryLabelProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      label: string;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-list-category-label"` - Applied to label element

**Example**

```tsx
// Default usage
<ProgramList.Category.Label />

// asChild with primitive
<ProgramList.Category.Label asChild>
  <span className="text-lg font-bold">{label}</span>
</ProgramList.Category.Label>

// asChild with react component
<ProgramList.Category.Label asChild>
  {React.forwardRef(({label, ...props}, ref) => (
    <span ref={ref} {...props} className="text-lg font-bold">{label}</span>
  ))}
</ProgramList.Category.Label>
```
