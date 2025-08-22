# EventList Interface Documentation

A comprehensive event list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The EventList component follows a compound component pattern where each part can be composed together to create flexible event list displays.

## Components

### EventList.Root

The root container that provides EventList service context to all child components.

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

Main container for the event list display with support for empty state and custom layout.
See [EventList.Root](./EVENT_LIST_INTERFACE.md#eventlistroot) for more details.

**Props**

```tsx
interface EventsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  infiniteScroll?: boolean; // default is true
  pageSize?: number; // 0 means no limit, max is 100
}
```

**Example**

```tsx
// show just 3 events
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

// show all events with infinite scroll
<EventList.Events
  infiniteScroll
  emptyState={<div>No events found</div>}
  className="grid grid-cols-1 md:grid-cols-3 gap-4"
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

Repeats for each event in the list, providing individual event context.

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
<EventList.LoadMoreTrigger>Load More</EventList.LoadMoreTrigger>
```

**Data Attributes**

- `data-testid="event-list-load-more"` - Applied to load more button

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
<EventList.Error>Ooops something went wrong</EventList.Error>
```

**Data Attributes**

- `data-testid="event-list-error"` - Applied to error container

---

## Data Attributes Summary

| Attribute                            | Applied To                | Purpose           |
| ------------------------------------ | ------------------------- | ----------------- |
| `data-testid="event-list-events"`    | EventList.Events          | Events container  |
| `data-testid="event-list-load-more"` | EventList.LoadMoreTrigger | Load more button  |
| `data-testid="event-list-error"`     | EventList.Error           | Error container   |
| `data-empty`                         | EventList.Events          | Empty list status |

## Usage Examples

```tsx
function EventsPage() {
  return (
    <EventList.Root eventListServiceConfig={eventListServiceConfig}>
      <EventList.Events
        className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 p-6"
        emptyState={
          <div className="text-center text-white py-12">
            <p className="text-xl">No events available</p>
            <p className="text-sm mt-2">
              Check back later for upcoming events!
            </p>
          </div>
        }
      >
        <EventList.EventRepeater>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            {/* Event Image */}
            <div className="relative overflow-hidden w-full pt-[100%] bg-blue-600">
              <Event.Image
                width={560}
                height={560}
                className="absolute top-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Event Content */}
            <div className="p-4 flex flex-col flex-grow">
              {/* Event Title */}
              <Event.Title className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" />

              {/* Event Date */}
              <Event.Date format="short" className="text-sm text-gray-600" />

              {/* Event Location */}
              <Event.Location
                format="short"
                className="text-sm text-gray-600 mb-4"
              />

              {/* Event Description */}
              <Event.Description className="text-sm text-gray-700 mb-4 line-clamp-3" />

              {/* RSVP Button */}
              <Event.RsvpButton className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-auto">RSVP<Event.RsvpButton>
            </div>
          </div>
        </EventList.EventRepeater>
      </EventList.Events>
    </EventList.Root>
  );
}
```
