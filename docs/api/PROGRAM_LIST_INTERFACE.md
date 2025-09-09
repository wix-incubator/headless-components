# ProgramList Interface Documentation

A comprehensive program list display component system built with composable primitives, similar to Radix UI architecture, for displaying and filtering collections of programs.

## Architecture

The ProgramList component follows a compound component pattern where each part can be composed together to create flexible program collection displays. It supports both simplified and headless interfaces.

## Components

### ProgramList.Root

The root container that provides program list context to all child components.

**Props**

```tsx
interface ProgramListRootProps {
  programs?: Program[];
  programListConfig?: ProgramListServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Root programListConfig={programListConfig}>
  {/* All program list components */}
</ProgramList.Root>
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
  <Program.Image />
  <Program.Title />
  <Program.Price />
</ProgramList.ProgramRepeater>
```

**Data Attributes**

- `data-testid="program-list-item"` - Applied to repeater container
