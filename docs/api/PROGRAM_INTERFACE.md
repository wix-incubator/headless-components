# Program Interface — Headless Components Documentation ✨

A comprehensive, composable, and headless API for rendering Online Program entities. This spec follows the established documentation style for headless components in this repository, inspired by Radix UI compound patterns and the conventions outlined in the API docs.

## Open questions
- public sdk doesn't support alt text for image
- do we need `label` prop for counters like steps [<Program.StepsCount/>](#programstepscount)
- the instructors list should be fetch together with the program, right? (Separate service form program)
- program instructor link to members area, how?

## Table of Contents

- [Components](#components)
  - [Program.Root](#programroot)
  - [Program.Raw](#programraw)
  - [Program.Title](#programtitle)
  - [Program.Image](#programimage)
  - [Program.StepsCount](#programstepscount)
  - [Program.Description](#programdescription)
  - [Program.Duration](#programduration)

  - [Program.Instructors](#programinstructors)
  - [Program.Instructor](#programinstructor)
    - [Program.Instructor.Name](#programinstructorname)
    - [Program.Instructor.Avatar](#programinstructoravatar)
    - [Program.Instructor.Description](#programinstructordescription)

- [Drafts](#drafts)
  - [Program.Participants.Stats.ParticipantsCount] ???
  - [Program.Action.View]
  - [Program.Action.Join]

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

### Program.StepsCount

Displays the number of steps in the program. Data source: program.contentSummary.stepCount

**Props**

```tsx
interface ProgramStepsCountProps {
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

- `data-testid="program-steps-count"` - Applied to program steps element

**Example**

```tsx
// Default usage
<Program.StepsCount className="text-content-secondary" />

// asChild with primitive
<Program.StepsCount asChild>
  <p className="text-content-secondary">
</Program.StepsCount>

// Custom rendering
<Program.StepsCount asChild>
  {React.forwardRef(({ steps, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {steps} Steps
    </p>
  ))}
</Program.StepsCount>
```

---

### Program.Description

Displays the program description text. Data source: program.description.details

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

Displays the program duration in days with customizable rendering. Data source: program.timeline field. If the program is self-paced, duration has no limit.

**Props**

```tsx
interface ProgramDurationProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      durationInDays: number | null;  // null represents "no limit"
      isSelfPaced: boolean;          // whether program is self-paced
    }
  >;
  className?: string;
  [key: string]: any;
}
```

**Data Attributes**

- `data-testid="program-duration"` - Applied to program duration element
- `data-type="self-paced"` - Applied when program is self-paced
- `data-type="time-limited"` - Applied when program has specific duration

**Implementation Notes**

- Default content: Shows raw `durationInDays` value (no automatic formatting)
- Custom rendering: Provides both `durationInDays` and `isSelfPaced` for flexible formatting

**Example**

```tsx
// Default usage - shows raw durationInDays value
<Program.Duration className="text-content-secondary" />

// asChild with primitive
<Program.Duration asChild>
  <p className="text-content-secondary" />
</Program.Duration>

// Custom rendering with proper formatting
<Program.Duration asChild>
  {React.forwardRef(({ durationInDays, isSelfPaced, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
    </p>
  ))}
</Program.Duration>
```
---

### Program.Instructors

Displays the list of program instructors with customizable rendering. Data source: program.instructors (fetched via instructors service).

**Props**

```tsx
interface ProgramInstructorsProps {
  instructors?: Instructors[];
  children?: React.ReactNode; // will wrap InstructorRepeater
  className?: string;
}
```

**Example**
```tsx
<Program.Instructors instructors={instructors}>
  {/* All instructor list components */}
</Program.Instructors>
```

**Data Attributes**
- `data-testid="program-instructors"` - Applied to instructors container
- `data-testid="program-instructor"` - Applied to each instructor item

**Example**

```tsx
// Default usage
<Program.Instructors />

// asChild with custom layout
<Program.Instructors asChild>
  <div className="grid grid-cols-3 gap-4">
    <Program.Instructors.InstructorRepeater>
      <Program.Instructor>
        <Program.Instructor.Avatar className="w-16 h-16 rounded-full" />
        <Program.Instructor.Name className="font-semibold" />
      </Program.Instructor>
    </Program.Instructors.InstructorRepeater>
  </div>
</Program.Instructors>
```

---

### Program.Instructors.InstructorRepeater

Repeats over the list of instructors and renders `Program.Instructor` for each one. This component follows the established repeater pattern used throughout the headless components.

**Props**

```tsx
interface ProgramInstructorsInstructorRepeaterProps {
  children: React.ReactNode; // will be passed to each Program.Instructor
}
```

**Data Attributes**
- `data-testid="program-instructors-repeater"` - Applied to repeater container

**Example**

```tsx
// Basic usage
<Program.Instructors.InstructorRepeater>
  <Program.Instructor>
    <Program.Instructor.Avatar />
    <Program.Instructor.Name />
  </Program.Instructor>
</Program.Instructors.InstructorRepeater>

// With custom layout
<Program.Instructors.InstructorRepeater>
  <div className="flex flex-wrap gap-4">
    <Program.Instructor>
      <Program.Instructor.Avatar className="w-12 h-12" />
      <Program.Instructor.Name className="text-sm" />
    </Program.Instructor>
  </div>
</Program.Instructors.InstructorRepeater>
```
---

### Program.Instructor

Individual instructor component that provides instructor context to child components.

**Props**

```tsx
interface ProgramInstructorProps {
  asChild?: boolean;
  children?: React.ReactNode;
  instructor: Instructor; // passed from InstructorRepeater
}
```

**Data Attributes**
- `data-testid="program-instructor"` - Applied to instructor element
- `data-instructor-id` - Instructor ID

**Example**

```tsx
<Program.Instructor instructor={instructor}>
  <Program.Instructor.Avatar />
  <Program.Instructor.Name />
  <Program.Instructor.Description />
</Program.Instructor>
```

---

### Program.Instructor.Name

Displays the instructor's name with customizable rendering. Data source: instructor.name.

**Props**

```tsx
interface ProgramInstructorNameProps {
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
<Program.Instructor.Name className="font-semibold text-lg" />

// asChild with link
<Program.Instructor.Name asChild>
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
</Program.Instructor.Name>
```

---

### Program.Instructor.Avatar

Displays the instructor's profile photo with customizable rendering. Data source: instructor.photo and instructor.photoAltText.

**Props**

```tsx
interface ProgramInstructorAvatarProps {
  asChild?: boolean;
  children?: React.ForwardRefRenderFunction<
    HTMLImageElement,
    {
      src: string;
      alt: string;
      width?: number; // ??
      height?: number; // ??
    }
  >;
  className?: string;
}
```

**Data Attributes**
- `data-testid="program-instructor-avatar"` - Applied to instructor avatar element

**Example**

```tsx
// Default usage
<Program.Instructor.Avatar className="rounded-full" />

// asChild with custom styling
<Program.Instructor.Avatar asChild size="lg">
  {React.forwardRef(({ src, alt, width, height, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      width={width}
      height={height}
      {...props}
      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
    />
  ))}
</Program.Instructor.Avatar>
```

---

### Program.Instructor.Description

Displays the instructor's bio/description with customizable rendering. Data source: instructor.description.

**Props**

```tsx
interface ProgramInstructorDescriptionProps {
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
- `data-testid="program-instructor-description"` - Applied to instructor description element

**Example**

```tsx
// Default usage
<Program.Instructor.Description className="text-gray-600" />

// asChild with custom truncation
<Program.Instructor.Description asChild >
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-gray-600 text-sm">
      {description.length > 100 ? `${description.substring(0, 100)}...` : description}
    </p>
  ))}
</Program.Instructor.Description>
```

**Notes**
- Avatar uses WixMediaImage for optimization when not using asChild
- Instructor data is fetched via instructor service based on program ID
- Empty state is not possible because program must have at least one instructor
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


## Drafts

### Program.ParticipantsCount
No public API yet 😭
