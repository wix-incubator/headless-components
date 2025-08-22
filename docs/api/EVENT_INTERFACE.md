# Event Interface Documentation

A comprehensive event display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Event component follows a compound component pattern where each part can be composed together to create flexible event displays.

## Components

### Event.Root

Root component that provides event context to all child components.

**Props**

```tsx
interface RootProps {
  event: Event;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Event.Root event={event}>{/* All event components */}</Event.Root>
```

---

### Event.Image

Displays the event image using WixMediaImage component with customizable rendering.

**Props**

```tsx
interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asChild?: boolean;
}
```

**Example**

```tsx
// Default usage
<Event.Image className="w-full h-full object-cover" />

// asChild with primitive
<Event.Image asChild>
  <img className="w-full h-full object-cover" />
</Event.Image>
```

**Data Attributes**

- `data-testid="event-image"` - Applied to image element

---

### Event.Title

Displays the event title with customizable rendering.

**Props**

```tsx
interface TitleProps extends AsChildProps<{ title: string }> {}
```

**Example**

```tsx
// Default usage
<Event.Title className="text-4xl font-bold" />

// asChild with primitive
<Event.Title asChild>
  <h1 className="text-4xl font-bold">
</Event.Title>

// asChild with react component
<Event.Title asChild>
  {React.forwardRef(({title, ...props}, ref) => (
    <h1 ref={ref} {...props} className="text-4xl font-bold">
      {title}
    </h1>
  ))}
</Event.Title>
```

**Data Attributes**

- `data-testid="event-title"` - Applied to title element

---

### Event.Date

Displays the event date with customizable rendering and format options.

**Props**

```tsx
interface DateProps extends AsChildProps<{ date: string }> {
  /** Format of the event date */
  format?: 'short' | 'full'; // Default: 'short'
}
```

**Example**

```tsx
// Default usage
<Event.Date className="text-sm font-medium" format="full" />

// asChild with primitive
<Event.Date asChild format="full">
  <span className="text-sm font-medium" />
</Event.Date>

// asChild with react component
<Event.Date asChild>
  {React.forwardRef(({date, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {date}
    </span>
  ))}
</Event.Date>
```

**Data Attributes**

- `data-testid="event-date"` - Applied to date element

---

### Event.Location

Displays the event location with customizable rendering and format options.

**Props**

```tsx
interface LocationProps extends AsChildProps<{ location: string }> {
  /** Format of the event location */
  format?: 'short' | 'full'; // Default: 'short'
}
```

**Example**

```tsx
// Default usage
<Event.Location className="text-sm font-medium" format="full" />

// asChild with primitive
<Event.Location asChild format="full">
  <span className="text-sm font-medium" />
</Event.Location>

// asChild with react component
<Event.Location asChild>
  {React.forwardRef(({location, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {location}
    </span>
  ))}
</Event.Location>
```

**Data Attributes**

- `data-testid="event-location"` - Applied to location element

---

### Event.Description

Displays the event description with customizable rendering.

**Props**

```tsx
interface DescriptionProps extends AsChildProps<{ description: string }> {}
```

**Example**

```tsx
// Default usage
<Event.Description className="text-sm font-medium" />

// asChild with primitive
<Event.Description asChild>
  <span className="text-sm font-medium" />
</Event.Description>

// asChild with react component
<Event.Description asChild>
  {React.forwardRef(({description, ...props}, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {description}
    </span>
  ))}
</Event.Description>
```

**Data Attributes**

- `data-testid="event-description"` - Applied to description element

---

### Event.RsvpButton

Displays button for RSVP functionality with customizable rendering.

**Props**

```tsx
interface RsvpButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.RsvpButton className="w-full">
  RSVP
</Event.RsvpButton>

// asChild with primitive
<Event.RsvpButton asChild>
  <button className="w-full">RSVP</button>
</Event.RsvpButton>
```

**Data Attributes**

- `data-testid="event-rsvp-button"` - Applied to RSVP button element

---

## Data Attributes Summary

| Attribute                         | Applied To        | Purpose                   |
| --------------------------------- | ----------------- | ------------------------- |
| `data-testid="event-image"`       | Event.Image       | Event image element       |
| `data-testid="event-title"`       | Event.Title       | Event title element       |
| `data-testid="event-date"`        | Event.Date        | Event date element        |
| `data-testid="event-location"`    | Event.Location    | Event location element    |
| `data-testid="event-description"` | Event.Description | Event description element |
| `data-testid="event-rsvp-button"` | Event.RsvpButton  | Event RSVP button element |

## Usage Examples

### Basic Event Card

```tsx
function EventCard() {
  return (
    <Event.Root
      event={event}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Event.Image
        width={400}
        height={200}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <Event.Title className="text-xl font-semibold mb-2" />

        <Event.Date className="text-gray-600 text-sm mb-2" />

        <Event.Location className="text-gray-600 text-sm mb-4" />

        <Event.Description className="text-gray-700 mb-4" />

        <Event.RsvpButton className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
          RSVP
        </Event.RsvpButton>
      </div>
    </Event.Root>
  );
}
```

### Minimal Event Display

```tsx
function MinimalEvent() {
  return (
    <Event.Root
      event={event}
      className="flex items-center space-x-4 p-4 border-b"
    >
      <Event.Image
        width={80}
        height={80}
        className="w-20 h-20 rounded-lg object-cover"
      />

      <div className="flex-1">
        <Event.Title className="font-medium" />
        <Event.Date format="full" className="text-sm text-gray-500" />
      </div>

      <Event.RsvpButton>Join</Event.RsvpButton>
    </Event.Root>
  );
}
```

### Featured Event Hero

```tsx
function FeaturedEvent() {
  return (
    <Event.Root event={event} className="relative">
      <div className="relative h-96 overflow-hidden rounded-lg">
        <Event.Image
          width={800}
          height={400}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Event.Title asChild className="text-3xl font-bold mb-2">
            <h1 />
          </Event.Title>

          <div className="flex items-center space-x-4 mb-4">
            <Event.Date format="full" className="text-lg" />
            <Event.Location format="short" className="text-lg" />
          </div>

          <Event.Description className="text-gray-200 mb-6" />

          <Event.RsvpButton className="bg-white text-black hover:bg-gray-100">
            Reserve Your Spot
          </Event.RsvpButton>
        </div>
      </div>
    </Event.Root>
  );
}
```
