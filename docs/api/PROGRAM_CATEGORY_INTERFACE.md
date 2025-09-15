# ProgramCategory Interface Documentation

A comprehensive program category display component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [Category.Root](#categoryroot)
  - [Category.Id](#categoryid)
  - [Category.Label](#categorylabel)
- [Usage Examples](#usage-examples) _(soon...)_

## Architecture

The Category component follows a compound component pattern where each part can be composed together to create flexible category displays.

## Components

### Category.Root

The root container that provides category context to all child components.

**Props**

```tsx
interface CategoryRootProps {
  children: React.ReactNode;
  category: Category;
}
```

**Example**

```tsx
<Category.Root category={category}>
  <Category.Id />
  <Category.Label />
</Category.Root>
```

---

### Category.Id

Displays the category ID with customizable rendering.

**Props**

```tsx
interface CategoryIdProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<HTMLElement, { id: string }>;
}
```

**Data Attributes**

- `data-testid="program-category-id"` - Applied to category element

**Example**

```tsx
<Category.Id />
```

---

### Category.Label

Displays the category label with customizable rendering.

**Props**

```tsx
interface ProgramCategoryLabelProps {
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

- `data-testid="program-category-label"` - Applied to category element

**Example**

```tsx
// Default usage
<Category.Label />

// asChild with primitive
<Category.Label asChild>
  <span />
</Category.Label>

// asChild with React component
<Category.Label asChild>
  {React.forwardRef(({ label, ...props }, ref) => (
    <span ref={ref} { ...props }>
      {label}
    </span>
  ))}
</Category.Label>
```

## Usage Examples

_(soon...)_
