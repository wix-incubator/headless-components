# ProgramCategory Interface Documentation

A comprehensive program category display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The ProgramCategory component follows a compound component pattern where each part can be composed together to create flexible program category displays.

## Components

### ProgramCategory.Root

The root container that provides category context to all child components.

**Props**

```tsx
interface ProgramCategoryRootProps {
  category: ProgramCategory;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramCategory.Root category={category}>
  {/* All category components */}
</ProgramCategory.Root>
```

---

### ProgramCategory.Raw

Provides direct access to category context data. Should be used only in rare cases and never by Wix implementations.

**Props**

```tsx
interface ProgramCategoryRawProps {
  asChild?: boolean;
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      category: ProgramCategory;
    }
  >;
}
```

**Example**

```tsx
<ProgramCategory.Raw>
  {React.forwardRef(({ category, ...rest }, ref) => (
    <div ref={ref} {...rest}>
      Custom category implementation.
    </div>
  ))}
</ProgramCategory.Raw>
```

---

### ProgramCategory.Label

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
<ProgramCategory.Label />

// asChild with primitive
<ProgramCategory.Label asChild>
  <span />
</ProgramCategory.Label>

// asChild with react component
<ProgramCategory.Label asChild>
  {React.forwardRef(({ label, ...props }, ref) => (
    <span ref={ref} { ...props }>
      {label}
    </span>
  ))}
</ProgramCategory.Label>
```

---
