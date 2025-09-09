# Program Interface Documentation

A comprehensive program display component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

### Components

- [Program.Root](#programroot)
- [Program.Raw](#programraw)
- [Program.Image](#programimage)
- [Program.Title](#programtitle)
- [Program.Price](#programprice)

## Architecture

The Program component follows a compound component pattern where each part can be composed together to create flexible program displays.

## Components

### Program.Root

The root container that provides program context to all child components.

**Props**

```tsx
interface ProgramRootProps {
  program: Program;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Program.Root program={program}>{/* All program components */}</Program.Root>
```

---

### Program.Raw

**Props**

```tsx
interface ProgramRawProps {
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      program: Program;
    }
  >;
  asChild?: boolean;
}
```

**Example**

```tsx
<Program.Raw>
  {React.forwardRef(({ program, ...props }, ref) => (
    <div ref={ref} {...props}>
      Custom program implementation
    </div>
  ))}
</Program.Raw>
```

---

### Program.Image

Displays the program image using WixMediaImage component with customizable rendering.

**Props**

```tsx
interface ProgramImageProps {
  asChild?: boolean;
}
```

**Data Attributes**

- `data-testid="program-image"` - Applied to program image element

**Example**

```tsx
// Default usage
<Program.Image className="w-full h-48 object-cover rounded-lg" />

// Usage with primitive
<Program.Image asChild>
  <img className="w-full h-48 object-cover rounded-lg" />
</Program.Image>

// Usage with React component
<Program.Image asChild>
  {React.forwardRef(({ src, alt }, ref) => (
    <img ref={ref} src={src} alt={alt} className="w-full h-48 object-cover rounded-lg" />
  ))}
</Program.Image>
```

---

### Program.Title

Displays the program title with customizable rendering.

**Props**

```tsx
interface ProgramTitleProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      title: string;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-title"` - Applied to program element

**Example**

```tsx
// Default usage
<Program.Title className="text-4xl font-bold">

// Usage with primitive
<Program.Title asChild>
  <h1 className="text-4xl font-bold">
</Program.Title>

// Usage with React component
<Program.Title asChild>
  {React.forwardRef(({ title, ...props }, ref) => (
    <h1 ref={ref} { ...props } className="text-4xl font-bold">
      {title}
    </h1>
  ))}
</Program.Title>
```

---

### Program.Price

Displays the current program price with customizable rendering.

**Props**

```tsx
interface ProgramPriceProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      price: string;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-price"` - Applied to program price element

**Example**

```tsx
// Default usage
<Program.Price className="text-3xl font-bold text-content-primary data-[discounted]:bold" />

// Usage with primitive
<Program.Price>
  <span className="text-3xl font-bold text-content-primary">
</Program.Price>

// Usage with React component
<Program.Price asChild>
  {React.forwardRef(({ price, ...props }, ref) => (
    <span ref={ref} { ...props } className="text-3xl font-bold text-content-primary">
      {price}
    </span>
  ))}
</Program.Price>
```
