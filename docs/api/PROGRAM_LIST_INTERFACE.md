# ProgramList Interface Documentation

A comprehensive program list display component system built with composable primitives, similar to Radix UI architecture, for displaying collections of programs.

## Table of Contents

- [Architecture](#architecture)
- [Components](#components)
  - [ProgramList.Root](#programlistroot)
  - [ProgramList.Programs](#programlistprograms)
  - [ProgramList.ProgramRepeater](#programlistprogramrepeater)
- [Usage Examples](#usage-examples) _(soon...)_

## Architecture

The ProgramList component follows a compound component pattern where each part can be composed together to create flexible program collection displays.

## Components

### ProgramList.Root

The root container that provides program list context to all child components.

**Props**

```tsx
interface ProgramListRootProps {
  programListConfig?: ProgramListServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Root programListConfig={{ programs: myPrograms }}>
  {/* All program list components */}
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

**Example**

```tsx
<ProgramList.ProgramRepeater>
  <Program.Title />
  <Program.Description />
</ProgramList.ProgramRepeater>
```

## Usage Examples

_(soon...)_
