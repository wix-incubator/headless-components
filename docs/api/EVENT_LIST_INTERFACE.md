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

## Usage Examples

### Basic Event Grid

```tsx
function EventGrid() {
  return (
    <EventList.Root eventListServiceConfig={eventListServiceConfig}>
      <EventList.Events
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        emptyState={
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Check back later for upcoming events.
            </p>
          </div>
        }
      >
        <EventList.EventRepeater>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Event.Image
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <Event.Title className="text-xl font-semibold mb-2" />
              <Event.Date className="text-gray-600 text-sm mb-2" />
              <Event.Location className="text-gray-600 text-sm mb-4" />
              <Event.RsvpButton className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                RSVP
              </Event.RsvpButton>
            </div>
          </div>
        </EventList.EventRepeater>
      </EventList.Events>

      <EventList.LoadMoreTrigger className="mt-8 mx-auto block bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg">
        Load More Events
      </EventList.LoadMoreTrigger>

      <EventList.Error className="text-red-600 text-center py-4">
        Failed to load events. Please try again.
      </EventList.Error>
    </EventList.Root>
  );
}
```

### Limited Event List (No Infinite Scroll)

```tsx
function FeaturedEvents() {
  return (
    <EventList.Root eventListServiceConfig={eventListServiceConfig}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Featured Events</h2>

        <EventList.Events
          className="space-y-4"
          infiniteScroll={false}
          pageSize={3}
          emptyState={
            <p className="text-gray-500 text-center py-8">
              No featured events at the moment.
            </p>
          }
        >
          <EventList.EventRepeater>
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <Event.Image
                width={80}
                height={80}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Event.Title className="font-medium text-lg mb-1 truncate" />
                <Event.Date
                  format="full"
                  className="text-sm text-gray-500 mb-1"
                />
                <Event.Location
                  format="short"
                  className="text-sm text-gray-500"
                />
              </div>

              <Event.RsvpButton className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex-shrink-0">
                Join
              </Event.RsvpButton>
            </div>
          </EventList.EventRepeater>
        </EventList.Events>

        <EventList.Error className="text-red-600 text-center py-4 bg-red-50 rounded-lg mt-4">
          Unable to load featured events.
        </EventList.Error>
      </div>
    </EventList.Root>
  );
}
```

### Event List with Custom Load More Button

```tsx
function EventListWithCustomButton() {
  return (
    <EventList.Root eventListServiceConfig={eventListServiceConfig}>
      <EventList.Events
        className="grid grid-cols-1 gap-4"
        emptyState={
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              No events scheduled
            </h3>
          </div>
        }
      >
        <EventList.EventRepeater>
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <Event.Title className="text-lg font-medium text-blue-900 mb-1" />
                <div className="flex items-center space-x-4 text-sm text-blue-700 mb-2">
                  <Event.Date format="full" />
                  <Event.Location format="short" />
                </div>
                <Event.Description className="text-blue-800 text-sm" />
              </div>
              <Event.RsvpButton className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                RSVP
              </Event.RsvpButton>
            </div>
          </div>
        </EventList.EventRepeater>
      </EventList.Events>

      <EventList.LoadMoreTrigger asChild>
        <button className="mt-6 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Load More Events
        </button>
      </EventList.LoadMoreTrigger>

      <EventList.Error asChild>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-800 text-sm font-medium">
              Failed to load events. Please refresh the page.
            </span>
          </div>
        </div>
      </EventList.Error>
    </EventList.Root>
  );
}
```

### Minimal Event List

```tsx
function MinimalEventList() {
  return (
    <EventList.Root eventListServiceConfig={eventListServiceConfig}>
      <EventList.Events
        className="divide-y divide-gray-200"
        infiniteScroll={false}
        pageSize={5}
        emptyState={<p className="text-gray-500 py-4">No events available.</p>}
      >
        <EventList.EventRepeater>
          <div className="py-3 flex justify-between items-center">
            <div>
              <Event.Title className="font-medium" />
              <Event.Date className="text-sm text-gray-500" />
            </div>
            <Event.RsvpButton className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Join →
            </Event.RsvpButton>
          </div>
        </EventList.EventRepeater>
      </EventList.Events>
    </EventList.Root>
  );
}
```
