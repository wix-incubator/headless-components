# EventList Interface Documentation

A comprehensive event list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The EventList component follows a compound component pattern where each part can be composed together to create flexible event list displays.

## Components

### EventList.Root

Root container that provides event list context to all child components.

**Props**

```tsx
interface RootProps {
  eventListServiceConfig: EventListServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<EventList.Root eventListServiceConfig={eventListServiceConfig}>
  {/* All event list components */}
</EventList.Root>
```

---

### EventList.Events

Container for the event list with support for empty state.

**Props**

```tsx
interface EventsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<EventList.Events
  emptyState={<div>No events found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
>
  <EventList.EventRepeater>{/* Event template */}</EventList.EventRepeater>
</EventList.Events>
```

**Data Attributes**

- `data-testid="event-list-events"` - Applied to events container
- `data-filtered` - Is list filtered

---

### EventList.EventRepeater

Repeater component that renders [Event.Root](./EVENT_INTERFACE.md#eventroot) for each event.

**Props**

```tsx
interface EventRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<EventList.EventRepeater>
  <Event.Image />
  <Event.Title />
  <Event.Date />
  <Event.Location />
  <Event.Description />
  <Event.RsvpButton label="RSVP" />
</EventList.EventRepeater>
```

---

### EventList.LoadMoreTrigger

Displays a button to load more events. Not rendered if no events are left to load.

**Props**

```tsx
interface LoadMoreTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    isLoading: boolean;
    loadMoreEvents: () => void;
  }>;
  className?: string;
  label?: string;
}
```

**Example**

```tsx
// Default usage
<EventList.LoadMoreTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Load More" />

// asChild with primitive
<EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  <button>Load More</button>
</EventList.LoadMoreTrigger>

// asChild with react component
<EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  {React.forwardRef(({ isLoading, loadMoreEvents, ...props }) => (
    <button ref={ref} {...props}>
      {isLoading ? 'Loading' : 'Load More'}
    </button>
  ))}
</EventList.LoadMoreTrigger>
```

**Data Attributes**

- `data-testid="event-list-load-more"` - Applied to load more element

---

### EventList.Error

Displays an error message when the event list fails to load.

**Props**

```tsx
interface ErrorProps {
  asChild?: boolean;
  children?: AsChildChildren<{ error: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<EventList.Error className="text-red-500" />

// asChild with primitive
<EventList.Error asChild className="text-red-500">
  <span />
</EventList.Error>

// asChild with react component
<EventList.Error asChild className="text-red-500">
  {React.forwardRef(({ error, ...props }) => (
    <span ref={ref} {...props}>
      {error}
    </span>
  ))}
</EventList.Error>
```

**Data Attributes**

- `data-testid="event-list-error"` - Applied to error element

---

### EventList.CategoryFilters

Container for the event list category filters. Not rendered if there are no categories.

**Props**

```tsx
interface CategoryFilters {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<EventList.CategoryFilters>
  <EventList.CategoryFilterRepeater>
    <CategoryFilter.Name />
  </EventList.CategoryFilterRepeater>
</EventList.CategoryFilters>
```

**Data Attributes**

- `data-testid="event-list-category-filters"` - Applied to category filters container

---

### EventList.CategoryFilterRepeater

Repeater component that renders CategoryFilter.Root for each category.

**Props**

```tsx
interface CategoryFilterRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<EventList.CategoryFilterRepeater>
  <CategoryFilter.Name />
</EventList.CategoryFilterRepeater>
```

---

### EventList.StatusFilters

Container for the event list status filters.

**Props**

```tsx
interface StatusFilters {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<EventList.StatusFilters>
  <EventList.StatusFilterRepeater>
    <StatusFilter.Name />
  </EventList.StatusFilterRepeater>
</EventList.StatusFilters>
```

**Data Attributes**

- `data-testid="event-list-status-filters"` - Applied to status filters container

---

### EventList.StatusFilterRepeater

Repeater component that renders StatusFilter.Root for each category.

**Props**

```tsx
interface StatusFilterRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<EventList.StatusFilterRepeater>
  <StatusFilter.Name />
</EventList.StatusFilterRepeater>
```

---

## Data Attributes Summary

| Attribute                                   | Applied To                | Purpose                    |
| ------------------------------------------- | ------------------------- | -------------------------- |
| `data-testid="event-list-events"`           | EventList.Events          | Events container           |
| `data-testid="event-list-load-more"`        | EventList.LoadMoreTrigger | Load more element          |
| `data-testid="event-list-error"`            | EventList.Error           | Error element              |
| `data-testid="event-list-category-filters"` | EventList.CategoryFilters | Category filters container |
| `data-testid="event-list-status-filters"`   | EventList.StatusFilters   | Status filters container   |
| `data-filtered`                             | EventList.Events          | Filtering status           |
