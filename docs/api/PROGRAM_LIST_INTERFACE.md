# ProgramList Interface Documentation

A comprehensive program list display component system built with composable primitives, similar to Radix UI architecture, for displaying collections of programs.

## Architecture

The ProgramList component follows a compound component pattern where each part can be composed together to create flexible program collection displays. It supports both simplified and headless interfaces.

## Components

### ProgramList.Root

The root container that provides program list context to all child components.

**Props**

```tsx
interface ProgramListRootProps {
  programs?: Program[];
  children: React.ReactNode;
}
```

**Example**

```tsx
<ProgramList.Root programs={programs}>
  {/* All program list components */}
</ProgramList.Root>
```

---

### ProgramList.Programs

Main container for the program list display with support for empty states and custom layouts.

**Data Attributes**

- `data-testid="program-list-programs"` - Applied to programs container
- `data-empty` - Is list empty

**Props**

```tsx
interface ProgramListProgramsProps {
  asChild?: boolean;
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

**Data Attributes**

- `data-testid="program-list-program"` - Applied to repeater container

**Example**

```tsx
<ProgramList.ProgramRepeater>
  <Program.Image />
  <Program.Title />
  <Program.Price />
</ProgramList.ProgramRepeater>
```

## Usage Examples

### Program List with Category Tabs

```tsx
function ProgramListWithCategoryTabs() {
  const programs = usePrograms();
  const categories = useCategories();

  return (
    <ProgramCategoryList.Root categories={categories}>
      <ProgramCategoryList.Categories>
        <Tabs.Root defaultValue="all">
          <Tabs.List>
            <Tabs.Trigger value="all">All</Tabs.Trigger>

            <ProgramCategoryList.CategoryRepeater asChild>
              {React.forwardRef(({ category, ...rest }, ref) => (
                <Tabs.Trigger ref={ref} {...rest} value={category._id}>
                  <ProgramCategory.Label />
                </Tabs.Trigger>
              ))}
            </ProgramCategoryList.CategoryRepeater>
          </Tabs.List>

          <Tabs.Content value="all">
            <ProgramList.Root programs={programs}>
              <ProgramList.Programs>
                <ProgramList.ProgramRepeater>
                  <Program.Image />
                  <Program.Title />
                  <Program.Price />
                </ProgramList.ProgramRepeater>
              </ProgramList.Programs>
            </ProgramList.Root>
          </Tabs.Content>

          <ProgramCategoryList.CategoryRepeater asChild>
            {React.forwardRef(({ category, ...rest }, ref) => (
              <Tabs.Content ref={ref} {...rest} value={category._id}>
                <ProgramList.Root
                  programs={programs.filter((program) =>
                    program.categoryIds.includes(category._id),
                  )}
                >
                  <ProgramList.Programs>
                    <ProgramList.ProgramRepeater>
                      <Program.Image />
                      <Program.Title />
                      <Program.Price />
                    </ProgramList.ProgramRepeater>
                  </ProgramList.Programs>
                </ProgramList.Root>
              </Tabs.Content>
            ))}
          </ProgramCategoryList.CategoryRepeater>
        </Tabs.Root>
      </ProgramCategoryList.Categories>
    </ProgramCategoryList.Root>
  );
}
```
