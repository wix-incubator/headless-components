# Program Interface — Headless Components Documentation ✨

A comprehensive, composable, and headless API for rendering Online Program entities. This spec follows the established documentation style for headless components in this repository, inspired by Radix UI compound patterns and the conventions outlined in the API docs.

## Table of Contents

- [Components](#components)
  - [Program.Root](#programroot)
  - [Program.Raw](#programraw)
  - [Program.Title](#programtitle)
  - [Program.Description](#programdescription)
  - [Program.Image](#programimage)
  - [Program.StepCount](#programstepcount)
  - [Program.SectionCount](#programsectionscount)
  - [Program.DurationInDays](#programdurationindays)
  - [Program.Price](#programprice)
  - [Program.Instructors](#programinstructors)
  - [Program.InstructorRepeater](#programinstructorrepeater)
  - [Instructor.Root](#instructorroot)
    - [Instructor.Name](#instructorname)
    - [Instructor.Description](#instructordescription)
    - [Instructor.Image](#instructorimage)
  - [Usage Examples](#usage-examples)

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
// Basic usage
<Program.Root program={program}>
  <Program.Title />
  <Program.Description />
</Program.Root>
```

---

### Program.Raw

Provides direct access to program context data. Should be used only in rare cases and never by Wix implementations.

**Props**

```tsx
interface ProgramRawProps {
  asChild: boolean;
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
<Program.Root program={program}>
  <Program.Raw asChild>
    {React.forwardRef(({ program }, ref) => (
      <div ref={ref}>
        <p>Program ID: {program._id}</p>
        <p>Title: {program.description?.title || 'No title'}</p>
        <p>Price: {program.price?.value || 'No price'}</p>
      </div>
    ))}
  </Program.Raw>
</Program.Root>
```

---

### Program.Title

Displays the program title with customizable rendering.
Data source: program.description.title.

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
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-title"` - Applied to program element

**Example**

```tsx
// Default usage
<Program.Title />

// asChild with primitive
<Program.Title asChild>
  <h1  />
</Program.Title>

// asChild with React component
<Program.Title asChild>
  {React.forwardRef(({ title }, ref) => (
    <h1 ref={ref}>
      {title}
    </h1>
  ))}
</Program.Title>
```

---

### Program.Description

Displays the program description text with customizable rendering.
Data source: program.description.details

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
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-description"` - Applied to program description element

**Example**

```tsx
// Default usage
<Program.Description />

// asChild with primitive
<Program.Description asChild>
  <p  />
</Program.Description>

// asChild with React component
<Program.Description asChild>
  {React.forwardRef(({ description }, ref) => (
    <p ref={ref}>
      {description.length > 100 ? `${description.substring(0, 100)}...` : description}
    </p>
  ))}
</Program.Description>

```

---

### Program.Image

Displays the program image using `WixMediaImage` component with customizable rendering.
Data source: program.description.image

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
<Program.Image />

// asChild with primitive
<Program.Image asChild>
  <img  />
</Program.Image>

// asChild with react component
<Program.Image asChild>
  {React.forwardRef(({ src, alt }, ref) => (
    <img ref={ref} src={src} alt={alt} />
  ))}
</Program.Image>
```

---

### Program.StepCount

Displays the number of steps in the program.
Data source: program.contentSummary.stepCount

**Props**

```tsx
interface ProgramStepCountProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      stepCount: number;
    }
  >;
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-steps-count"` - Applied to program steps element

**Example**

```tsx
// Default usage
<Program.StepCount />

// asChild with primitive
<Program.StepCount asChild>
  <p />
</Program.StepCount>

// asChild with React component
<Program.StepCount asChild>
  {React.forwardRef(({ stepCount }, ref) => (
    <p ref={ref}>
      {stepCount} Steps
    </p>
  ))}
</Program.StepCount>
```

---

### Program.SectionCount

Displays the number of sections in the program.
Data source: program.contentSummary.sectionCount

**Props**

```tsx
interface ProgramSectionCountProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      sectionCount: number;
    }
  >;
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-section-count"` - Applied to program section count element

**Example**

```tsx
// Default usage
<Program.SectionCount className="text-content-secondary" />

// asChild with primitive
<Program.SectionCount asChild>
  <p className="text-content-secondary" />
</Program.SectionCount>

// Custom rendering
<Program.SectionCount asChild>
  {React.forwardRef(({ sectionCount, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {sectionCount} Sections
    </p>
  ))}
</Program.SectionCount>
```

---

### Program.DurationInDays

Displays the program duration in days with customizable rendering.
Data source: program.timeline field. If the program is self-paced, duration has no limit.
Default content: Shows raw `durationInDays` value (no automatic formatting)

**Props**

```tsx
interface ProgramDurationInDaysProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      durationInDays: number | null; // null represents "no limit"
      isSelfPaced: boolean; // whether program is self-paced
    }
  >;
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-duration"` - Applied to program duration element
- `data-type="self-paced"` - Applied when program is self-paced
- `data-type="time-limited"` - Applied when program has specific duration

**Example**

```tsx
// Default usage - shows raw durationInDays value
<Program.DurationInDays />

// asChild with primitive
<Program.DurationInDays asChild>
  <p />
</Program.DurationInDays>

// asChild with React component
<Program.DurationInDays asChild>
  {React.forwardRef(({ durationInDays, isSelfPaced }, ref) => (
    <p ref={ref}>
      {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
    </p>
  ))}
</Program.DurationInDays>
```

---

### Program.Price

Displays the program price with customizable rendering.
Data source: program.price with value and currency.

**Props**

```tsx
interface ProgramPriceProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    formattedPrice: string; // combine price and currency together
    price: string;
    currency: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-price"` - Applied to program price element

**Example**

```tsx
// Default usage
<Program.Price />

// asChild with primitive
<Program.Price asChild>
  <span className="text-3xl font-bold text-content-primary" />
</Program.Price>

// asChild with React component
<Program.Price asChild>
  {React.forwardRef(({ price, formattedPrice }, ref) => (
    <span ref={ref}>
      {price ? formattedPrice :  'Free'}
    </span>
  ))}
</Program.Price>
```

### Program.Instructors

Container component for program instructors that provides context and conditional rendering. Renders `emptyState` when there are no instructors, otherwise renders the children.

**Props**

```tsx
interface ProgramInstructorsProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    instructors: instructors.Instructor[];
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Optional instructors data to use instead of fetching */
  instructors?: instructors.Instructor[];
  /** Content to show when there are no instructors */
  emptyState?: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="program-instructors"` - Applied to instructors container

**Example**

```tsx
// Default usage
<Program.Instructors instructors={instructors} emptyState={<div>No instructors available</div>}>
  <Program.InstructorRepeater>
    <Instructor.Name />
    <Instructor.Description />
  </Program.InstructorRepeater>
</Program.Instructors>

// asChild with primitive
<Program.Instructors asChild>
  <div className="instructors-grid" />
</Program.Instructors>

// asChild with React component
<Program.Instructors asChild>
  {React.forwardRef(({ instructors }, ref) => (
    <div ref={ref}>
      {instructors.map(instructor => (
        <div key={instructor._id}>{instructor.name}</div>
      ))}
    </div>
  ))}
</Program.Instructors>
```

---

### Program.InstructorRepeater

Repeater component that renders children for each instructor. Maps over instructors from the service and renders `Instructor.Root` for each.

**Props**

```tsx
interface InstructorRepeaterProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Children to render for each instructor */
  children?: AsChildChildren<{}>;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Data Attributes**

- `data-testid="program-instructor-repeater"` - Applied to repeater container

**Example**

```tsx
// With React elements
<Program.InstructorRepeater>
  <Instructor.Name />
  <Instructor.Description />
</Program.InstructorRepeater>
```

---

### Instructor.Root

Individual instructor component that provides instructor context to child components. Used within `Program.InstructorRepeater` or directly with instructor data.

**Props**

```tsx
interface InstructorProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Children to render within the instructor context */
  children?: React.ReactNode;
  /** Instructor data - passed from InstructorRepeater or provided directly */
  instructor: instructors.Instructor;
}
```

**Data Attributes**

- `data-testid="program-instructor"` - Applied to instructor element

**Example**

```tsx
// Used within InstructorRepeater (automatic context)
<Program.InstructorRepeater>
  <Instructor.Name />
  <Instructor.Description />
</Program.InstructorRepeater>

// Direct usage with instructor data
<Instructor instructor={instructor}>
  <Instructor.Name />
  <Instructor.Description />
</Instructor>
```

---

### Instructor.Name

Displays the instructor's name with customizable rendering.
Data source: instructor.name.

**Props**

```tsx
interface NameProps {
  instructor: Instructor;
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      name: string;
      slug?: string | null;
    }
  >;
}
```

**Data Attributes**

- `data-testid="program-instructor-name"` - Applied to instructor name element

**Example**

```tsx
// Default usage
<Instructor.Name instructor={instructor} className="font-semibold text-lg" />

// asChild with link
<Instructor.Name instructor={instructor} asChild>
  {React.forwardRef(({ name, slug, ...props }, ref) => (
    <a
      ref={ref}
      href={slug ? `/instructors/${slug}` : '#'}
      {...props}
      className="font-semibold text-lg hover:underline"
    >
      {name}
    </a>
  ))}
</Instructor.Name>
```

---

### Instructor.Description

Displays the instructor's description with customizable rendering. Data source: instructor.description

**Props**

```tsx
interface InstructorDescriptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ description: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}
```

**Data Attributes**

- `data-testid="instructor-description"` - Applied to instructor description element

**Example**

```tsx
// Default usage
<Instructor.Description className="text-content-secondary" />

// asChild with primitive
<Instructor.Description asChild>
  <p className="text-content-secondary" />
</Instructor.Description>

// asChild with react component
<Instructor.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {description}
    </p>
  ))}
</Instructor.Description>

// With custom truncation
<Instructor.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary text-sm">
      {description.length > 100 ? `${description.substring(0, 100)}...` : description}
    </p>
  ))}
</Instructor.Description>
```

---

### Instructor.Image

Displays the instructor's profile photo with customizable rendering.
Data source: instructor.photo and instructor.photoAltText.

**Props**

```tsx
interface InstructorImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    src: string;
    altText: string;
  }>;
}
```

**Data Attributes**

- `data-testid="instructor-image"` - Applied to instructor image element

**Example**

```tsx
// Default usage
<Instructor.Image className="w-16 h-16 rounded-full object-cover" />

// asChild with primitive
<Instructor.Image asChild>
  <img className="w-16 h-16 rounded-full object-cover" />
</Instructor.Image>

// asChild with react component
<Instructor.Image asChild>
  {React.forwardRef(({ src, altText, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={altText}
      {...props}
      className="w-16 h-16 rounded-full object-cover"
    />
  ))}
</Instructor.Image>

// With custom sizing
<Instructor.Image asChild>
  {React.forwardRef(({ src, altText, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={altText}
      {...props}
      className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
    />
  ))}
</Instructor.Image>
```

## Usage Examples

### Default usage

```tsx
function DefaultProgramCard(props) {
  const { program } = props;

  return (
    <Program.Root program={program}>
      <Program.Title />
      <Program.Description />
    </Program.Root>
  );
}
```

### Advanced usage

```tsx
function AdvancedProgramCard(props) {
  const { category } = props;

  return (
    <Program.Root program={program}>
      <Program.Title asChild>{({ title }) => <h1>{title}</h1>}</Program.Title>
      <Program.Description asChild>
        {({ description }) => <p>{description}</p>}
      </Program.Description>
    </Program.Root>
  );
}
```
