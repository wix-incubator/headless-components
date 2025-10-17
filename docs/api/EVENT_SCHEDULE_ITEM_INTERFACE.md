# ScheduleItem Interface Documentation

A comprehensive schedule item component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The ScheduleItem component follows a compound component pattern where each part can be composed together to create flexible schedule item displays.

## Components

### ScheduleItem.Root

Root container that provides schedule item context to all child components.

**Props**

```tsx
interface RootProps {
  item: ScheduleItem;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItem.Root item={item}>
  {/* All schedule item components */}
</ScheduleItem.Root>
```

**Data Attributes**

- `data-testid="schedule-item-root"` - Applied to schedule item root element
- `data-has-description` - Schedule item has description

---

### ScheduleItem.Name

Displays the schedule item name.

**Props**

```tsx
interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<ScheduleItem.Name className="font-bold text-lg" />

// asChild with primitive
<ScheduleItem.Name asChild>
  <h2 className="font-bold text-lg" />
</ScheduleItem.Name>

// asChild with react component
<ScheduleItem.Name asChild>
  {React.forwardRef(({ name, ...props }, ref) => (
    <h2 ref={ref} className="font-bold text-lg" {...props}>
      {name}
    </h2>
  ))}
</ScheduleItem.Name>
```

**Data Attributes**

- `data-testid="schedule-item-name"` - Applied to name element

---

### ScheduleItem.TimeSlot

Displays the schedule item time slot information.

**Props**

```tsx
interface TimeSlotProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    startTime: Date;
    endTime: Date;
    timeZoneId: string;
    formattedTimeRange: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<ScheduleItem.TimeSlot className="text-gray-600 font-medium" />

// asChild with primitive
<ScheduleItem.TimeSlot asChild>
  <div className="text-gray-600" />
</ScheduleItem.TimeSlot>

// asChild with react component
<ScheduleItem.TimeSlot asChild>
  {React.forwardRef(({ startTime, endTime, timeZoneId, formattedTimeRange, ...props }, ref) => (
    <time ref={ref} className="text-gray-600" {...props} dateTime={startTime.toISOString()}>
      {formattedTimeRange}
    </time>
  ))}
</ScheduleItem.TimeSlot>
```

**Data Attributes**

- `data-testid="schedule-item-time-slot"` - Applied to time slot element

---

### ScheduleItem.Duration

Displays the schedule item duration.

**Props**

```tsx
interface DurationProps {
  asChild?: boolean;
  children?: AsChildChildren<{ durationMinutes: number }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<ScheduleItem.Duration className="text-sm text-gray-500" />

// asChild with primitive
<ScheduleItem.Duration asChild>
  <div className="text-sm text-gray-500" />
</ScheduleItem.Duration>

// asChild with react component
<ScheduleItem.Duration asChild>
  {React.forwardRef(({ durationMinutes, ...props }, ref) => (
    <span ref={ref} className="text-sm text-gray-500" {...props}>
      {durationMinutes > 0 ? `${durationMinutes} minutes` : ''}
    </span>
  ))}
</ScheduleItem.Duration>
```

**Data Attributes**

- `data-testid="schedule-item-duration"` - Applied to duration element

---

### ScheduleItem.Description

Provides the schedule item description. RicosViewer should be used to render the description.

**Props**

```tsx
interface DescriptionProps {
  children?: AsChildChildren<{ description: string }>;
}
```

**Example**

```tsx
// Usage with react component
// If using RicosViewer, use fromRichTextHtml from @wix/ricos to convert the description to RichContent
<ScheduleItem.Description>
  {React.forwardRef(({ description, ...props }, ref) => (
    <RicosViewer ref={ref} content={fromRichTextHtml(description)} />
  ))}
</ScheduleItem.Description>
```

**Data Attributes**

- `data-testid="schedule-item-description"` - Applied to description element

---

### ScheduleItem.Stage

Displays the schedule item stage.

**Props**

```tsx
interface StageProps {
  asChild?: boolean;
  children?: AsChildChildren<{ stageName: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<ScheduleItem.Stage className="text-blue-600 font-medium" />

// asChild with primitive
<ScheduleItem.Stage asChild>
  <span className="text-blue-600 font-medium" />
</ScheduleItem.Stage>

// asChild with react component
<ScheduleItem.Stage asChild>
  {React.forwardRef(({ stageName, ...props }, ref) => (
    <span ref={ref} className="text-blue-600 font-medium" {...props}>
      {stageName}
    </span>
  ))}
</ScheduleItem.Stage>
```

**Data Attributes**

- `data-testid="schedule-item-stage"` - Applied to stage element

---

### ScheduleItem.Tags

Container for the schedule item tags.

**Props**

```tsx
interface TagsProps {
  asChild?: boolean;
  children: React.ReactNode | AsChildChildren<{ tags: string[] }>;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItem.Tags>
  <ScheduleItem.TagRepeater>
    <ScheduleItemTag.Label />
  </ScheduleItem.TagRepeater>
</ScheduleItem.Tags>
```

**Data Attributes**

- `data-testid="schedule-item-tags"` - Applied to tags container

---

### ScheduleItem.TagRepeater

Repeater component that renders [ScheduleItemTag.Root](./EVENT_SCHEDULE_ITEM_TAG_INTERFACE.md#scheduleitemtagroot) for each tag.

**Props**

```tsx
interface TagRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<ScheduleItem.TagRepeater>
  <ScheduleItemTag.Label />
</ScheduleItem.TagRepeater>
```

---

## Data Attributes Summary

| Attribute                                 | Applied To               | Purpose                       |
| ----------------------------------------- | ------------------------ | ----------------------------- |
| `data-testid="schedule-item-root"`        | ScheduleItem.Root        | Schedule item root element    |
| `data-testid="schedule-item-name"`        | ScheduleItem.Name        | Name element                  |
| `data-testid="schedule-item-time-slot"`   | ScheduleItem.TimeSlot    | Time slot element             |
| `data-testid="schedule-item-duration"`    | ScheduleItem.Duration    | Duration element              |
| `data-testid="schedule-item-description"` | ScheduleItem.Description | Description element           |
| `data-testid="schedule-item-stage"`       | ScheduleItem.Stage       | Stage element                 |
| `data-testid="schedule-item-tags"`        | ScheduleItem.Tags        | Tags container                |
| `data-has-description`                    | ScheduleItem.Root        | Schedule item has description |
