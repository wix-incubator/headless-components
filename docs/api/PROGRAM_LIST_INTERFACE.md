# ProgramList Interface Documentation

A comprehensive program list display component system built with composable primitives, similar to Radix UI architecture, for displaying collections of programs.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [ProgramList.Root](#programlistroot)
  - [ProgramList.Raw](#programlistraw)
  - [ProgramList.Programs](#programlistprograms)
  - [ProgramList.ProgramRepeater](#programlistprogramrepeater)
- [Usage Examples](#usage-examples)
  - [Default usage](#default-usage)
  - [Advanced usage](#advanced-usage)

## Architecture

The ProgramList component follows a compound component pattern where each part can be composed together to create flexible program collection displays.

## Components

### ProgramList.Root

The root container that provides program list data to all child components.

**Props**

```tsx
interface ProgramListRootProps {
  children: React.ReactNode;
  programListConfig?: ProgramListServiceConfig;
}
```

**Example**

```tsx
<ProgramList.Root programListConfig={{ programs: myPrograms }}>
  <ProgramList.Programs>
    <ProgramList.ProgramRepeater>
      <Program.Title />
      <Program.Description />
    </ProgramList.ProgramRepeater>
  </ProgramList.Programs>
</ProgramList.Root>
```

### ProgramList.Raw

Provides direct access to program list data. Should be used only when need custom access to list data.

**Example**

```tsx
<ProgramList.Root programListConfig={{ programs: myPrograms }}>
  <ProgramList.Raw>
    {({ programs }) => (
      <div>
        {programs.map((program) => (
          <div key={program._id}>
            {program.description?.title || 'No title'}
          </div>
        ))}
      </div>
    )}
  </ProgramList.Raw>
</ProgramList.Root>
```

---

### ProgramList.Programs

Main container for the program list display with support for empty states and custom layouts.

**Data Attributes**

- `data-testid="program-list-items"` - Applied to programs container

**Props**

```tsx
interface ProgramListProgramsProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Programs emptyState={<div>No programs found</div>}>
  <ProgramList.ProgramRepeater>
    <Program.Title />
    <Program.Description />
  </ProgramList.ProgramRepeater>
</ProgramList.Programs>
```

---

### ProgramList.ProgramRepeater

Repeats for each program in the list, providing individual program data.

**Props**

```tsx
interface ProgramListProgramRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.ProgramRepeater>
  <Program.Title />
  <Program.Description />
</ProgramList.ProgramRepeater>
```

## Usage Examples

### Default usage

```tsx
function DefaultProgramCards(props) {
  const { programs } = props;

  return (
    <ProgramList.Root programListConfig={{ programs }}>
      <ProgramList.Programs>
        <ProgramList.ProgramRepeater>
          <Program.Title />
          <Program.Description />
        </ProgramList.ProgramRepeater>
      </ProgramList.Programs>
    </ProgramList.Root>
  );
}
```

### Advanced usage

```tsx
function AdvancedProgramCards(props) {
  const { programs } = props;

  return (
    <ProgramList.Root programListConfig={{ programs }}>
      <ProgramList.Raw>
        {({ programs }) => (
          <div>
            {programs.map((program) => (
              <div key={program._id}>
                <Program.Root program={program}>
                  <Program.Title />
                  <Program.Description />
                </Program.Root>
              </div>
            ))}
          </div>
        )}
      </ProgramList.Raw>
    </ProgramList.Root>
  );
}
```
