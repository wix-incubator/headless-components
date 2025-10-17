# ScheduleList Interface Documentation

A comprehensive schedule list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The ScheduleList component follows a compound component pattern where each part can be composed together to create flexible schedule list displays.

## Components

### ScheduleList.Root

Root container that provides schedule list service context to all child components.

**Props**

```tsx
interface RootProps {
  children: React.ReactNode;
  scheduleListServiceConfig: ScheduleListServiceConfig;
}
```

**Example**

```tsx
<ScheduleList.Root scheduleListServiceConfig={scheduleListServiceConfig}>
  {/* All schedule list components */}
</ScheduleList.Root>
```

---

### ScheduleList.Items

Container for the schedule list items.

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
<ScheduleList.Items>
  <ScheduleList.ItemRepeater>
    <ScheduleItem.Name />
    <ScheduleItem.TimeSlot />
    <ScheduleItem.Duration />
    <ScheduleItem.Description />
    <ScheduleItem.Stage />
    <ScheduleItem.Tags>
      <ScheduleItem.TagRepeater>
        <ScheduleItemTag.Label />
      </ScheduleItem.TagRepeater>
    </ScheduleItem.Tags>
  </ScheduleList.ItemRepeater>
</ScheduleList.Items>
```

**Data Attributes**

- `data-testid="schedule-list-items"` - Applied to items container

---

### ScheduleList.ItemRepeater

Repeater component that renders [ScheduleItem.Root](./EVENT_SCHEDULE_ITEM_INTERFACE.md#scheduleitemroot) for each schedule item.

**Props**

```tsx
interface ItemRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleList.ItemRepeater>
  <ScheduleItem.Name />
  <ScheduleItem.TimeSlot />
  <ScheduleItem.Duration />
  <ScheduleItem.Description />
  <ScheduleItem.Stage />
  <ScheduleItem.Tags>
    <ScheduleItem.TagRepeater>
      <ScheduleItemTag.Label />
    </ScheduleItem.TagRepeater>
  </ScheduleItem.Tags>
</ScheduleList.ItemRepeater>
```

---

### ScheduleList.Groups

Container for the grouped schedule items. Supports empty state rendering.

**Props**

```tsx
interface GroupsProps {
  asChild?: boolean;
  children:
    | React.ReactNode
    | AsChildChildren<{ itemsGroups: ScheduleItemsGroup[] }>;
  className?: string;
  emptyState?: React.ReactNode;
}
```

**Example**

```tsx
<ScheduleList.Groups emptyState={<div>No schedule items available</div>}>
  <ScheduleList.GroupRepeater>
    <ScheduleItemsGroup.DateLabel />
    <ScheduleItemsGroup.Items>
      <ScheduleItemsGroup.ItemRepeater>
        <ScheduleItem.Name />
        <ScheduleItem.TimeSlot />
      </ScheduleItemsGroup.ItemRepeater>
    </ScheduleItemsGroup.Items>
  </ScheduleList.GroupRepeater>
</ScheduleList.Groups>
```

**Data Attributes**

- `data-testid="schedule-list-groups"` - Applied to groups container

---

### ScheduleList.GroupRepeater

Repeater component that renders [ScheduleItemsGroup.Root](./EVENT_SCHEDULE_ITEMS_GROUP_INTERFACE.md#scheduleitemsgrouproot) for each schedule items group.

**Props**

```tsx
interface GroupRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleList.GroupRepeater>
  <ScheduleItemsGroup.DateLabel />
  <ScheduleItemsGroup.Items>
    <ScheduleItemsGroup.ItemRepeater>
      <ScheduleItem.Name />
      <ScheduleItem.TimeSlot />
      <ScheduleItem.Duration />
      <ScheduleItem.Description />
      <ScheduleItem.Stage />
      <ScheduleItem.Tags>
        <ScheduleItem.TagRepeater>
          <ScheduleItemTag.Label />
        </ScheduleItem.TagRepeater>
      </ScheduleItem.Tags>
    </ScheduleItemsGroup.ItemRepeater>
  </ScheduleItemsGroup.Items>
</ScheduleList.GroupRepeater>
```

---

### ScheduleList.Filters

Container for the schedule list filters. Not rendered if there are no stages.

**Props**

```tsx
interface FiltersProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  allStagesLabel: string;
}
```

**Example**

```tsx
<ScheduleList.Filters allStagesLabel="All">
  <Filter.FilterOptions className="border-b border-gray-500 mb-6">
    <Filter.FilterOptionRepeater>
      <Filter.FilterOption.SingleFilter className="flex gap-2" />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</ScheduleList.Filters>
```

---

## Data Attributes Summary

| Attribute                            | Applied To          | Purpose          |
| ------------------------------------ | ------------------- | ---------------- |
| `data-testid="schedule-list-items"`  | ScheduleList.Items  | Items container  |
| `data-testid="schedule-list-groups"` | ScheduleList.Groups | Groups container |
