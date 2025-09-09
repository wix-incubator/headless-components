# Program Interface Documentation

A comprehensive program display component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [Program.Root](#programroot)
  - [Program.Raw](#programraw)
  - [Program.Image](#programimage)
  - [Program.Title](#programtitle)
  - [Program.Description](#programdescription)
  - [Program.Days](#programdays)
  - [Program.Participants](#programparticipants)
  - [Program.Steps](#programsteps)
  - [Program.Price](#programprice)
- [Usage Examples](#usage-examples) _(soon...)_

## Architecture

The `Program` component follows a compound component pattern where each part can be composed together to create flexible program displays.

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

Provides direct access to program context data. Should be used only in rare cases and never by Wix implementations.

**Props**

```tsx
interface ProgramRawProps {
  asChild?: boolean;
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      program: Program;
    }
  >;
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

Displays the program image using `WixMediaImage` component with customizable rendering.

**Props**

```tsx
interface ProgramImageProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLImageElement,
    {
      src: string;
      alt: string;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-image"` - Applied to program image element

**Example**

```tsx
// Default usage
<Program.Image className="w-full h-48 object-cover rounded-lg" />

// asChild with primitive
<Program.Image asChild>
  <img className="w-full h-48 object-cover rounded-lg" />
</Program.Image>

// asChild with react component
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

// asChild with primitive
<Program.Title asChild>
  <h1 className="text-4xl font-bold">
</Program.Title>

// asChild with react component
<Program.Title asChild>
  {React.forwardRef(({ title, ...props }, ref) => (
    <h1 ref={ref} { ...props } className="text-4xl font-bold">
      {title}
    </h1>
  ))}
</Program.Title>
```

---

### Program.Description

Displays the program description with customizable rendering.

**Props**

```tsx
interface ProgramDescriptionProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      description: string;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-description"` - Applied to program description element

**Example**

```tsx
// Default usage
<Program.Description className="text-content-secondary" />

// asChild with primitive
<Program.Description asChild>
  <p className="text-content-secondary">
</Program.Description>

// asChild with react component
<Program.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {description}
    </p>
  ))}
</Program.Description>
```

---

### Program.Days

Displays the program days with customizable rendering.

**Props**

```tsx
interface ProgramDaysProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      days: number;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-days"` - Applied to program days element

**Example**

```tsx
// Default usage
<Program.Days className="text-content-secondary" />

// asChild with primitive
<Program.Days asChild>
  <p className="text-content-secondary">
</Program.Days>

// asChild with react component
<Program.Days asChild>
  {React.forwardRef(({ days, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {days}
    </p>
  ))}
</Program.Days>
```

---

### Program.Participants

Displays the program participants with customizable rendering.

**Props**

```tsx
interface ProgramParticipantsProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      participants: number;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-participants"` - Applied to program participants element

**Example**

```tsx
// Default usage
<Program.Participants className="text-content-secondary" />

// asChild with primitive
<Program.Participants asChild>
  <p className="text-content-secondary">
</Program.Participants>

// asChild with react component
<Program.Participants asChild>
  {React.forwardRef(({ participants, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {participants}
    </p>
  ))}
</Program.Participants>
```

---

### Program.Steps

Displays the program steps with customizable rendering.

**Props**

```tsx
interface ProgramStepsProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      steps: number;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-steps"` - Applied to program steps element

**Example**

```tsx
// Default usage
<Program.Steps className="text-content-secondary" />

// asChild with primitive
<Program.Steps asChild>
  <p className="text-content-secondary">
</Program.Steps>

// asChild with react component
<Program.Steps asChild>
  {React.forwardRef(({ steps, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {steps}
    </p>
  ))}
</Program.Steps>
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

// asChild with primitive
<Program.Price>
  <span className="text-3xl font-bold text-content-primary">
</Program.Price>

// asChild with react component
<Program.Price asChild>
  {React.forwardRef(({ price, ...props }, ref) => (
    <span ref={ref} { ...props } className="text-3xl font-bold text-content-primary">
      {price}
    </span>
  ))}
</Program.Price>
```
