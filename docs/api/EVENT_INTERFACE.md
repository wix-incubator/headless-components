# Event Interface Documentation

A comprehensive event display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Event component follows a compound component pattern where each part can be composed together to create flexible event displays.

## Components

### Event.Root

Root container that provides event context to all child components.

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

**Data Attributes**

- `data-testid="event-root"` - Applied to event root element
- `data-upcoming` - Is event upcoming
- `data-started` - Is event started
- `data-ended` - Is event ended
- `data-sold-out` - Is event sold out
- `data-registration-closed` - Is registration closed

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
interface TitleProps {
  asChild?: boolean;
  children?: AsChildChildren<{ title: string }>;
  className?: string;
}
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
  {React.forwardRef(({ title, ...props }, ref) => (
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
interface DateProps {
  asChild?: boolean;
  children?: AsChildChildren<{ date: string }>;
  className?: string;
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
  {React.forwardRef(({ date, ...props }, ref) => (
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
interface LocationProps {
  asChild?: boolean;
  children?: AsChildChildren<{ location: string }>;
  className?: string;
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
  {React.forwardRef(({ location, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {location}
    </span>
  ))}
</Event.Location>
```

**Data Attributes**

- `data-testid="event-location"` - Applied to location element

---

### Event.ShortDescription

Displays the event short description with customizable rendering.

**Props**

```tsx
interface ShortDescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ shortDescription: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.ShortDescription className="text-sm font-medium" />

// asChild with primitive
<Event.ShortDescription asChild>
  <span className="text-sm font-medium" />
</Event.ShortDescription>

// asChild with react component
<Event.ShortDescription asChild>
  {React.forwardRef(({ shortDescription, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {shortDescription}
    </span>
  ))}
</Event.ShortDescription>
```

**Data Attributes**

- `data-testid="event-short-description"` - Applied to short description element

---

### Event.Description

Displays the event description with customizable rendering.

**Props**

```tsx
interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: RichContent }>;
  className?: string;
  customStyles?: RicosCustomStyles;
}
```

**Example**

```tsx
// Default usage with built-in Ricos viewer
<Event.Description
  className="max-w-5xl"
  customStyles={{
    p: {
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--color-content-primary)',
    }
  }}
/>

// asChild with react component
<Event.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <div>
      <RicosViewer ref={ref} content={description} plugins={customPlugins} />
    </div>
  ))}
</Event.Description>
```

**Data Attributes**

- `data-testid="event-description"` - Applied to description container element

---

### Event.RsvpButton

Displays the event RSVP button with customizable rendering.

**Props**

```tsx
interface RsvpButtonProps {
  asChild?: boolean;
  children?: AsChildChildren<{ event: Event }>;
  className?: string;
  label?: string;
}
```

**Example**

```tsx
// Default usage
<Event.RsvpButton className="w-full" label="RSVP" />

// asChild with primitive
<Event.RsvpButton asChild>
  <button className="w-full">RSVP</button>
</Event.RsvpButton>

// asChild with react component
<Event.RsvpButton asChild>
  {React.forwardRef(({ event, ...props }, ref) => (
    <button ref={ref} {...props}>
      {event.registration?.type === 'TICKETING' ? 'Buy Tickets' : 'RSVP'}
    </button>
  ))}
</Event.RsvpButton>
```

**Data Attributes**

- `data-testid="event-rsvp-button"` - Applied to RSVP button element

---

### Event.FacebookShare

Displays the event Facebook share link with customizable rendering.

**Props**

```tsx
interface FacebookShareProps {
  asChild?: boolean;
  children?: AsChildChildren<{ url: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.FacebookShare />

// asChild with primitive
<Event.FacebookShare asChild>
  <a />
</Event.FacebookShare>

// asChild with react component
<Event.FacebookShare asChild>
  {React.forwardRef(({ url, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(url, '_blank')} />
  ))}
</Event.FacebookShare>
```

**Data Attributes**

- `data-testid="event-facebook-share"` - Applied to Facebook share element

---

### Event.LinkedInShare

Displays the event LinkedIn share link with customizable rendering.

**Props**

```tsx
interface LinkedInShareProps {
  asChild?: boolean;
  children?: AsChildChildren<{ url: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.LinkedInShare />

// asChild with primitive
<Event.LinkedInShare asChild>
  <a />
</Event.LinkedInShare>

// asChild with react component
<Event.LinkedInShare asChild>
  {React.forwardRef(({ url, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(url, '_blank')} />
  ))}
</Event.LinkedInShare>
```

**Data Attributes**

- `data-testid="event-linked-in-share"` - Applied to LinkedIn share element

---

### Event.XShare

Displays the event X share link with customizable rendering.

**Props**

```tsx
interface XShareProps {
  asChild?: boolean;
  children?: AsChildChildren<{ url: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.XShare />

// asChild with primitive
<Event.XShare asChild>
  <a />
</Event.XShare>

// asChild with react component
<Event.XShare asChild>
  {React.forwardRef(({ url, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(url, '_blank')} />
  ))}
</Event.XShare>
```

**Data Attributes**

- `data-testid="event-x-share"` - Applied to X share element

---

### Event.AddToGoogleCalendar

Displays the event add to Google calendar link with customizable rendering.

**Props**

```tsx
interface AddToGoogleCalendarProps {
  asChild?: boolean;
  children?: AsChildChildren<{ url: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.AddToGoogleCalendar />

// asChild with primitive
<Event.AddToGoogleCalendar asChild>
  <a />
</Event.AddToGoogleCalendar>

// asChild with react component
<Event.AddToGoogleCalendar asChild>
  {React.forwardRef(({ url, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(url, '_blank')} />
  ))}
</Event.AddToGoogleCalendar>
```

**Data Attributes**

- `data-testid="event-add-to-google-calendar"` - Applied to add to Google calendar element

---

### Event.AddToIcsCalendar

Displays the event add to ICS calendar link with customizable rendering.

**Props**

```tsx
interface AddToIcsCalendarProps {
  asChild?: boolean;
  children?: AsChildChildren<{ url: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.AddToIcsCalendar />

// asChild with primitive
<Event.AddToIcsCalendar asChild>
  <a />
</Event.AddToIcsCalendar>

// asChild with react component
<Event.AddToIcsCalendar asChild>
  {React.forwardRef(({ url, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(url, '_blank')} />
  ))}
</Event.AddToIcsCalendar>
```

**Data Attributes**

- `data-testid="event-add-to-ics-calendar"` - Applied to add to ICS calendar element

---

## Data Attributes Summary

| Attribute                                    | Applied To                | Purpose                              |
| -------------------------------------------- | ------------------------- | ------------------------------------ |
| `data-testid="event-root"`                   | Event.Root                | Event root element                   |
| `data-testid="event-image"`                  | Event.Image               | Event image element                  |
| `data-testid="event-title"`                  | Event.Title               | Event title element                  |
| `data-testid="event-date"`                   | Event.Date                | Event date element                   |
| `data-testid="event-location"`               | Event.Location            | Event location element               |
| `data-testid="event-short-description"`      | Event.ShortDescription    | Event short description element      |
| `data-testid="event-description"`            | Event.Description         | Event description container element  |
| `data-testid="event-rsvp-button"`            | Event.RsvpButton          | Event RSVP button element            |
| `data-testid="event-facebook-share"`         | Event.FacebookShare       | Event Facebook share element         |
| `data-testid="event-linked-in-share"`        | Event.LinkedInShare       | Event LinkedIn share element         |
| `data-testid="event-x-share"`                | Event.XShare              | Event X share element                |
| `data-testid="event-add-to-google-calendar"` | Event.AddToGoogleCalendar | Event add to Google calendar element |
| `data-testid="event-add-to-ics-calendar"`    | Event.AddToIcsCalendar    | Event add to ICS calendar element    |
| `data-upcoming`                              | Event.Root                | Event status                         |
| `data-started`                               | Event.Root                | Event status                         |
| `data-ended`                                 | Event.Root                | Event status                         |
| `data-sold-out`                              | Event.Root                | Event ticketing status               |
| `data-registration-closed`                   | Event.Root                | Event registration status            |
