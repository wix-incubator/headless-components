# ScheduleItemTag Interface Documentation

A comprehensive schedule item tag component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The ScheduleItemTag component follows a compound component pattern where each part can be composed together to create flexible schedule item tag displays.

## Components

### ScheduleItemTag.Root

Root container that provides schedule item tag context to all child components.

**Props**

```tsx
interface RootProps {
  tag: string;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItemTag.Root tag={tag}>
  {/* All schedule item tag components */}
</ScheduleItemTag.Root>
```

**Data Attributes**

- `data-testid="schedule-item-tag-root"` - Applied to schedule item tag root element

---

### ScheduleItemTag.Label

Displays the schedule item tag label.

**Props**

```tsx
interface LabelProps {
  asChild?: boolean;
  children?: AsChildChildren<{ label: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<ScheduleItemTag.Label className="px-2 py-1 bg-gray-100 rounded" />

// asChild with primitive
<ScheduleItemTag.Label asChild>
  <span className="px-2 py-1 bg-gray-100 rounded" />
</ScheduleItemTag.Label>

// asChild with react component
<ScheduleItemTag.Label asChild>
  {React.forwardRef(({ label, ...props }, ref) => (
    <span ref={ref} {...props} className="px-2 py-1 bg-gray-100 rounded">
      {label}
    </span>
  ))}
</ScheduleItemTag.Label>
```

**Data Attributes**

- `data-testid="schedule-item-tag-label"` - Applied to label element

---

## Data Attributes Summary

| Attribute                               | Applied To            | Purpose          |
| --------------------------------------- | --------------------- | ---------------- |
| `data-testid="schedule-item-tag-root"`  | ScheduleItemTag.Root  | Tag root element |
| `data-testid="schedule-item-tag-label"` | ScheduleItemTag.Label | Label element    |
