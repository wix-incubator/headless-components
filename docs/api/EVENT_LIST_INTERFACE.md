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
  asChild?: boolean;
  children:
    | React.ReactNode
    | AsChildChildren<{ events: Event[]; isLoading: boolean }>;
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
- `data-loading` - Is list loading

---

### EventList.EventRepeater

Repeater component that renders [Event.Root](./EVENT_INTERFACE.md#eventroot) for each event.
Note: Repeater components do NOT support asChild as per architecture rules.

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
  label?: React.ReactNode;
  loadingState?: React.ReactNode;
}
```

**Example**

```tsx
// Default usage
<EventList.LoadMoreTrigger
  className="bg-blue-600 hover:bg-blue-700 text-white"
  label="Load More"
  loadingState="Loading..."
/>

// asChild with primitive
<EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  <button>Load More</button>
</EventList.LoadMoreTrigger>

// asChild with react component
<EventList.LoadMoreTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  {React.forwardRef(({ isLoading, loadMoreEvents, ...props }, ref) => (
    <button ref={ref} {...props}>
      {isLoading ? 'Loading...' : 'Load More'}
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

### EventList.CategoryFilter

Container for the event list category filters. Not rendered if there are no categories.
Uses the Filter component from `@wix/headless-components/react`.

**Props**

```tsx
interface CategoryFilterProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  allCategoriesLabel: string;
}
```

**Example**

```tsx
<EventList.CategoryFilter allCategoriesLabel="All">
  <Filter.FilterOptions className="border-b border-gray-500 mb-6">
    <Filter.FilterOptionRepeater>
      <Filter.FilterOption.SingleFilter className="flex gap-2" />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</EventList.CategoryFilter>
```

---

### EventList.StatusFilter

Container for the event list status filters.
Uses the Filter component from `@wix/headless-components/react`.

**Props**

```tsx
interface StatusFilterProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  allEventsLabel: string;
  upcomingEventsLabel: string;
  pastEventsLabel: string;
}
```

**Example**

```tsx
<EventList.StatusFilter
  allEventsLabel="All Events"
  upcomingEventsLabel="Upcoming"
  pastEventsLabel="Past"
>
  <Filter.FilterOptions>
    <Filter.FilterOptionRepeater>
      <Filter.FilterOption.SingleFilter />
    </Filter.FilterOptionRepeater>
  </Filter.FilterOptions>
</EventList.StatusFilter>
```

---

## Data Attributes Summary

| Attribute                            | Applied To                | Purpose           |
| ------------------------------------ | ------------------------- | ----------------- |
| `data-testid="event-list-events"`    | EventList.Events          | Events container  |
| `data-testid="event-list-load-more"` | EventList.LoadMoreTrigger | Load more element |
| `data-testid="event-list-error"`     | EventList.Error           | Error element     |
| `data-loading`                       | EventList.Events          | Loading status    |
