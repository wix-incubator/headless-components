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

Container for the event list with support for empty state and custom layout.

**Props**

```tsx
interface EventsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  infiniteScroll?: boolean; // Default: true
  pageSize?: number; // 0 means no limit, max is 100
}
```

**Example**

```tsx
// Show 3 events
<EventList.Events
  emptyState={<div>No events found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  infiniteScroll={false}
  pageSize={3}
>
  <EventList.EventRepeater>
    {/* Event template */}
  </EventList.EventRepeater>
</EventList.Events>

// Show all events with infinite scroll
<EventList.Events
  emptyState={<div>No events found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
  infiniteScroll
>
  <EventList.EventRepeater>
    {/* Event template */}
  </EventList.EventRepeater>
</EventList.Events>
```

**Data Attributes**

- `data-testid="event-list-events"` - Applied to events container
- `data-empty` - Is list empty

---

### EventList.EventRepeater

Repeater component that renders [Event.Root](./EVENT_INTERFACE.md#eventroot) for each event.

**Props**

```tsx
interface EventRepeaterProps {
  children: React.ReactNode;
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
  <Event.RsvpButton />
</EventList.EventRepeater>
```

---

### EventList.LoadMoreTrigger

Displays a button to load more events. Not rendered if infiniteScroll is false or no events are left to load.

**Props**

```tsx
interface LoadMoreTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<EventList.LoadMoreTrigger>Load More</EventList.LoadMoreTrigger>

// asChild with primitive
<EventList.LoadMoreTrigger asChild>
  <button>Load More</button>
</EventList.LoadMoreTrigger>
```

**Data Attributes**

- `data-testid="event-list-load-more"` - Applied to load more button element

---

### EventList.Error

Displays an error message when the event list fails to load.

**Props**

```tsx
interface ErrorProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<EventList.Error>Ooops something went wrong</EventList.Error>

// asChild with primitive
<EventList.Error asChild>
  <span>Ooops something went wrong</span>
</EventList.Error>
```

**Data Attributes**

- `data-testid="event-list-error"` - Applied to error element

---

## Data Attributes Summary

| Attribute                            | Applied To                | Purpose                  |
| ------------------------------------ | ------------------------- | ------------------------ |
| `data-testid="event-list-events"`    | EventList.Events          | Events container         |
| `data-testid="event-list-load-more"` | EventList.LoadMoreTrigger | Load more button element |
| `data-testid="event-list-error"`     | EventList.Error           | Error element            |
| `data-empty`                         | EventList.Events          | Empty list status        |
