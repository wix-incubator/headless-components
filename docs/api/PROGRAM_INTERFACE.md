# Program Interface — Headless Components Documentation ✨

A comprehensive, composable, and headless API for rendering Online Program entities. This spec follows the established documentation style for headless components in this repository, inspired by Radix UI compound patterns and the conventions outlined in the API docs.

## Open questions
- public sdk doesn't support alt text for image
- do we need `label` prop for [<Program.StepsCounter/>](#programstepscounter)
- [<Program.Description/>](#programdescription) only in plain text

## Table of Contents

- [Components](#components)
  - [Program.Root](#programroot)
  - [Program.Raw](#programraw)
  - [Program.Title](#programtitle)
  - [Program.Image](#programimage)
  - [Program.StepsCounter](#programstepscounter)
  - [Program.Description](#programdescription)
  - [Program.Duration](#programduration)

  - [Program.Participants](#programparticipants)
  - [Program.Price](#programprice)
- [Usage Examples](#usage-examples) _(soon...)_

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

### Program.Title

Displays the program title with customizable rendering. Data source: program.description.title.

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

**Notes**
- The React wrapper provides default `<h1>` fallback and test id.

---

### Program.Image

Displays the program image using `WixMediaImage` component with customizable rendering. Data source: program.description.image

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
  className?: string;
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

**Notes**
- Uses `WixMediaImage` for optimized image rendering
- Supports asChild pattern with `src` and `alt` props
- Image source comes from `program.description.image`
- Alt text defaults to program title
---

### Program.StepsCounter

Displays the number of steps in the program. Data source: program.contentSummary.stepCount

**Props**

```tsx
interface ProgramStepsCounterProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      steps: number;
    }
  >;
  label?: string; // e.g. "Steps", "Lessons", "Modules" ????
}
```

**Data Attributes**

- `data-testid="program-steps-counter"` - Applied to program steps element

**Example**

```tsx
// Default usage
<Program.Steps className="text-content-secondary" />

// asChild with primitive
<Program.Steps asChild>
  <p className="text-content-secondary">
</Program.Steps>

// Custom rendering
<Program.Steps asChild>
  {React.forwardRef(({ steps, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {steps}
    </p>
  ))}
</Program.Steps>
```

---

### Program.Description

Displays the program description text. Data source: program.description.details

**Props**

```tsx
interface ProgramDescriptionProps {
  as?: 'plain' | 'ricos' //    ????
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
// Default usage N or null
<Program.Description className="text-content-secondary" />

// asChild with primitive
<Program.Description asChild>
  <p className="text-content-secondary">
</Program.Description>

// Custom render
<Program.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {description}
    </p>
  ))}
</Program.Description>
```

---

### Program.Duration

Displays the program duration in days with customizable rendering. Data source: program.timeline field. If the program is self-placed, duration has no limit.

**Props**

```tsx
interface ProgramDurationProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      durationInDays: number | null;  // null represents "no limit"
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-duration"` - Applied to program duration element
- `data-type="self-paced"` - Applied when program is self-paced
- `data-type="time-limited"` - Applied when program has specific duration

**Example**

```tsx
// Default usage N or null
<Program.Duration className="text-content-secondary" />

// asChild with primitive
<Program.Duration asChild>
  <p className="text-content-secondary">
</Program.Duration>

// Custom rendering with format
<Program.Duration asChild format="long">
  {React.forwardRef(({ durationInDays, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {durationInDays ? `${durationInDays} days ` : 'No Time Limit' }
    </p>
  ))}
</Program.Duration>
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
