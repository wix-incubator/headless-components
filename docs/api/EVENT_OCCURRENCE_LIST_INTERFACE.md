# OccurrenceList Interface Documentation

A comprehensive occurrence list display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The OccurrenceList component follows a compound component pattern where each part can be composed together to create flexible occurrence list displays.

## Components

### OccurrenceList.Root

Root container that provides occurrence list service context to all child components.

**Props**

```tsx
interface RootProps {
  children: React.ReactNode;
  occurrenceListServiceConfig: OccurrenceListServiceConfig;
}
```

**Example**

```tsx
<OccurrenceList.Root occurrenceListServiceConfig={occurrenceListServiceConfig}>
  {/* All occurrence list components */}
</OccurrenceList.Root>
```

---

### OccurrenceList.Occurrences

Container for the occurrence list.

**Props**

```tsx
interface OccurrencesProps {
  asChild?: boolean;
  children:
    | React.ReactNode
    | AsChildChildren<{
        occurrences: Event[];
        hasOccurrences: boolean;
      }>;
  className?: string;
}
```

**Example**

```tsx
<OccurrenceList.Occurrences>
  <OccurrenceList.OccurrenceRepeater>
    <Event.Image />
    <Event.Title />
    <Event.Date />
    <Event.Location />
  </OccurrenceList.OccurrenceRepeater>
</OccurrenceList.Occurrences>
```

**Data Attributes**

- `data-testid="occurrence-list-occurrences"` - Applied to occurrences container

---

### OccurrenceList.OccurrenceRepeater

Repeater component that renders [Event.Root](./EVENT_INTERFACE.md#eventroot) for each occurrence.

**Props**

```tsx
interface OccurrenceRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<OccurrenceList.OccurrenceRepeater>
  <Event.Image />
  <Event.Title />
  <Event.Date />
  <Event.Location />
</OccurrenceList.OccurrenceRepeater>
```

---

### OccurrenceList.LoadMoreTrigger

Displays a button to load more occurrences. Not rendered if no occurrences are left to load.

**Props**

```tsx
interface LoadMoreTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    isLoading: boolean;
    loadMoreOccurrences: () => void;
  }>;
  className?: string;
  label?: React.ReactNode;
  loadingState?: React.ReactNode;
}
```

**Example**

```tsx
// Default usage
<OccurrenceList.LoadMoreTrigger
  className="bg-blue-600 hover:bg-blue-700 text-white"
  label="Load More"
  loadingState="Loading..."
/>

// asChild with primitive
<OccurrenceList.LoadMoreTrigger asChild>
  <button>Load More</button>
</OccurrenceList.LoadMoreTrigger>

// asChild with react component
<OccurrenceList.LoadMoreTrigger asChild>
  {React.forwardRef(({ isLoading, loadMoreOccurrences, ...props }, ref) => (
    <button ref={ref} {...props}>
      {isLoading ? 'Loading...' : 'Load More'}
    </button>
  ))}
</OccurrenceList.LoadMoreTrigger>
```

**Data Attributes**

- `data-testid="occurrence-list-load-more"` - Applied to load more element

---

### OccurrenceList.Error

Displays an error message when the occurrence list fails to load.

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
<OccurrenceList.Error className="text-red-500" />

// asChild with primitive
<OccurrenceList.Error asChild className="text-red-500">
  <span />
</OccurrenceList.Error>

// asChild with react component
<OccurrenceList.Error asChild className="text-red-500">
  {React.forwardRef(({ error, ...props }, ref) => (
    <span ref={ref} {...props}>
      {error}
    </span>
  ))}
</OccurrenceList.Error>
```

**Data Attributes**

- `data-testid="occurrence-list-error"` - Applied to error element

---

## Data Attributes Summary

| Attribute                                   | Applied To                     | Purpose               |
| ------------------------------------------- | ------------------------------ | --------------------- |
| `data-testid="occurrence-list-occurrences"` | OccurrenceList.Occurrences     | Occurrences container |
| `data-testid="occurrence-list-load-more"`   | OccurrenceList.LoadMoreTrigger | Load more element     |
| `data-testid="occurrence-list-error"`       | OccurrenceList.Error           | Error element         |
