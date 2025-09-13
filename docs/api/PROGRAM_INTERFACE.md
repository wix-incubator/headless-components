# Program Interface — Headless Components Documentation ✨

A comprehensive, composable, and headless API for rendering Online Program entities. This spec follows the established documentation style for headless components in this repository, inspired by Radix UI compound patterns and the conventions outlined in the API docs.

## Open questions
- public sdk doesn't support alt text for image
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
  - [Program.DurationInDays](#programdurationindays)
  - [Program.Instructors](#programinstructors)
  - [Program.InstructorRepeater](#programinstructorrepeater)
  - [Instructor](#instructor)
    - [Instructor.Name](#instructorinstructorname)
    - [Instructor.Description](#instructordescription)
    - [Instructor.Image](#instructorimage)

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
  [key: string]: any;
}
```

**Example**

```tsx
// Basic usage
<Program.Root program={program}>
  <Program.Title />
  <Program.Description />
</Program.Root>

// With additional attributes
<Program.Root program={program} className="program-container" data-testid="program-root">
  <Program.Title />
  <Program.Description />
</Program.Root>
```

---

### Program.Raw

**Status: Not Implemented**

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
  [key: string]: any;
}
```

**Data Attributes**

- `data-testid="program-title"` - Applied to program element

**Example**

```tsx
// Default usage
<Program.Title className="text-4xl font-bold" />

// asChild with primitive
<Program.Title asChild>
  <h1 className="text-4xl font-bold" />
</Program.Title>

// asChild with react component
<Program.Title asChild>
  {React.forwardRef(({ title, ...props }, ref) => (
    <h1 ref={ref} {...props} className="text-4xl font-bold">
      {title}
    </h1>
  ))}
</Program.Title>
```

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
      stepsCount: number;
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
  {React.forwardRef(({ stepsCount, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {stepsCount} Steps
    </p>
  ))}
</Program.StepsCount>
```

---

### Program.Description

Displays the program description text with customizable rendering. Data source: program.description.details

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
  [key: string]: any;
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
  <p className="text-content-secondary" />
</Program.Description>

// Custom rendering with truncation
<Program.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {description.length > 100 ? `${description.substring(0, 100)}...` : description}
    </p>
  ))}
</Program.Description>

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

**Example**

```tsx
// Default usage - shows raw durationInDays value
<Program.DurationInDays className="text-content-secondary" />

// asChild with primitive
<Program.DurationInDays asChild>
  <p className="text-content-secondary" />
</Program.DurationInDays>

// Custom rendering with proper formatting
<Program.DurationInDays asChild>
  {React.forwardRef(({ durationInDays, isSelfPaced, ...props }, ref) => (
    <p ref={ref} {...props} className="text-content-secondary">
      {isSelfPaced ? 'No Time Limit' : `${durationInDays} days`}
    </p>
  ))}
</Program.DurationInDays>
```
---

### Program.Instructors

Container for program instructors that provides context and conditional rendering. Renders emptyState when there are no instructors, otherwise renders children.

**Props**

```tsx
interface ProgramInstructorsProps {
  /** Optional instructors data to use instead of fetching */
  instructors?: instructors.Instructor[];
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ instructors: instructors.Instructor[]; hasInstructors: boolean }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Empty state to display when there are no instructors */
  emptyState?: React.ReactNode;
  /** Additional HTML attributes */
  [key: string]: any;
}
```

**Data Attributes**
- `data-testid="program-instructors"` - Applied to instructors container

**Example**

```tsx
// Default usage
<Program.Instructors instructors={instructors} />

// With empty state
<Program.Instructors
  instructors={instructors}
  emptyState={<div>No instructors available for this program</div>}
/>

// With styled empty state
<Program.Instructors
  instructors={instructors}
  emptyState={
    <div className="text-center py-8 text-gray-500">
      <h3>No Instructors</h3>
      <p>This program doesn't have any instructors assigned yet.</p>
    </div>
  }
/>

// asChild with primitive
<Program.Instructors asChild>
  <div className="instructors-grid" />
</Program.Instructors>

// Custom rendering with render props
<Program.Instructors asChild>
  {React.forwardRef(({ instructors, hasInstructors, ...props }, ref) => (
    <div ref={ref} {...props} className="instructors-container">
      {hasInstructors ? (
        instructors.map(instructor => (
          <div key={instructor._id}>{instructor.name}</div>
        ))
      ) : (
        <div>No instructors</div>
      )}
    </div>
  ))}
</Program.Instructors>
```

---

### Program.InstructorRepeater

Repeater component that renders children for each instructor. Supports both React elements and render functions.

**Props**

```tsx
interface ProgramInstructorRepeaterProps {
  /** Children to render for each instructor - can be React elements or a render function */
  children: ((props: {
    instructor: instructors.Instructor;
  }) => React.ReactNode) | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Additional HTML attributes */
  [key: string]: any;
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

// With render function
<Program.InstructorRepeater>
  {({ instructor }) => (
    <div key={instructor.userId}>
      <h3>{instructor.name}</h3>
    </div>
  )}
</Program.InstructorRepeater>

// With custom styling
<Program.InstructorRepeater className="grid grid-cols-3 gap-4">
  <Instructor.Name className="font-semibold" />
</Program.InstructorRepeater>
```
---

### Instructor

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
- `data-instructor-id` - Instructor ID

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

Displays the instructor's name with customizable rendering. Data source: instructor.name.

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
  /** Additional HTML attributes */
  [key: string]: any;
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
<PInstructor.Description asChild>
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

Displays the instructor's profile photo with customizable rendering. Data source: instructor.photo and instructor.photoAltText.

**Props**

```tsx
interface InstructorImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
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

## Drafts

### Program.ParticipantsCount
No public API yet 😭
