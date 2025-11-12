# ScheduleItemsGroup Interface Documentation

A comprehensive schedule items group component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The ScheduleItemsGroup component follows a compound component pattern where each part can be composed together to create flexible schedule items group displays.

## Components

### ScheduleItemsGroup.Root

Root container that provides schedule items group context to all child components.

**Props**

```tsx
interface RootProps {
  itemsGroup: ScheduleItemsGroup;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItemsGroup.Root itemsGroup={itemsGroup}>
  {/* All schedule items group components */}
</ScheduleItemsGroup.Root>
```

**Data Attributes**

- `data-testid="schedule-items-group-root"` - Applied to schedule items group root element

---

### ScheduleItemsGroup.DateLabel

Displays the date label for a schedule group (e.g., "Mon, 07 Jul").

**Props**

```tsx
interface DateLabelProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    date: Date;
    timeZoneId: string;
    formattedDate: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<ScheduleItemsGroup.DateLabel className="text-lg font-semibold" />

// asChild with primitive
<ScheduleItemsGroup.DateLabel asChild>
  <h3 className="text-lg font-semibold" />
</ScheduleItemsGroup.DateLabel>

// asChild with react component
<ScheduleItemsGroup.DateLabel asChild>
  {React.forwardRef(({ date, timeZoneId, formattedDate, ...props }, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-semibold">
      {formattedDate}
    </h3>
  ))}
</ScheduleItemsGroup.DateLabel>
```

**Data Attributes**

- `data-testid="schedule-items-group-date-label"` - Applied to date label element

---

### ScheduleItemsGroup.Items

Container for the schedule items in the group.

**Props**

```tsx
interface ItemsProps {
  asChild?: boolean;
  children: React.ReactNode | AsChildChildren<{ items: ScheduleItem[] }>;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItemsGroup.Items>
  <ScheduleItemsGroup.ItemRepeater>
    <ScheduleItem.Name />
    <ScheduleItem.TimeSlot />
  </ScheduleItemsGroup.ItemRepeater>
</ScheduleItemsGroup.Items>
```

**Data Attributes**

- `data-testid="schedule-items-group-items"` - Applied to items container

---

### ScheduleItemsGroup.ItemRepeater

Repeater component that renders [ScheduleItem.Root](./EVENT_SCHEDULE_ITEM_INTERFACE.md#scheduleitemroot) for each schedule item in the group.

**Props**

```tsx
interface ItemRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItemsGroup.ItemRepeater>
  <ScheduleItem.Name />
  <ScheduleItem.TimeSlot />
  <ScheduleItem.Duration />
</ScheduleItemsGroup.ItemRepeater>
```

---

## Data Attributes Summary

| Attribute                                       | Applied To                   | Purpose            |
| ----------------------------------------------- | ---------------------------- | ------------------ |
| `data-testid="schedule-items-group-root"`       | ScheduleItemsGroup.Root      | Group root element |
| `data-testid="schedule-items-group-date-label"` | ScheduleItemsGroup.DateLabel | Date label element |
| `data-testid="schedule-items-group-items"`      | ScheduleItemsGroup.Items     | Items container    |
