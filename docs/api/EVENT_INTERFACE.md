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
  eventListServiceConfig?: EventListServiceConfig;
  occurrenceListServiceConfig?: OccurrenceListServiceConfig;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<Event.Root event={event}>{/* All event components */}</Event.Root>
```

**Data Attributes**

- `data-testid="event-root"` - Applied to event root element
- `data-upcoming` - Event is upcoming
- `data-started` - Event has started
- `data-ended` - Event has ended
- `data-sold-out` - Event is sold out
- `data-registration-closed` - Registration is closed
- `data-has-image` - Event has image
- `data-has-description` - Event has description
- `data-has-occurrences` - Event has occurrences

---

### Event.Slug

Displays the event slug.

**Props**

```tsx
interface SlugProps {
  asChild?: boolean;
  children?: AsChildChildren<{ slug: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.Slug className="text-sm font-medium" />

// asChild with primitive
<Event.Slug asChild>
  <span className="text-sm font-medium" />
</Event.Slug>

// asChild with react component
<Event.Slug asChild>
  {React.forwardRef(({ slug, ...props }, ref) => (
    <a ref={ref} {...props} href={`/events/${slug}`}>
      Event Details
    </a>
  ))}
</Event.Slug>
```

**Data Attributes**

- `data-testid="event-slug"` - Applied to slug element

---

### Event.Type

Provides event type information.

**Props**

```tsx
interface TypeProps {
  children: AsChildChildren<{
    ticketed: boolean;
    rsvp: boolean;
    external: boolean;
  }>;
}
```

**Example**

```tsx
// asChild with react component
<Event.Type>
  {React.forwardRef(({ ticketed, rsvp, external, ...props }, ref) => (
    <span ref={ref} {...props}>
      {ticketed ? 'Ticketed' : rsvp ? 'RSVP' : external ? 'External' : ''}
    </span>
  ))}
</Event.Type>
```

---

### Event.Image

Displays the event image using WixMediaImage component.

**Props**

```tsx
interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'children'> {
  asChild?: boolean;
  children?: AsChildChildren<{
    src: string;
    width?: number;
    height?: number;
    alt: string;
  }>;
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

// asChild with react component
<Event.Image asChild>
  {React.forwardRef(({ src, alt, width, height, ...props }, ref) => (
    <img ref={ref} src={src} alt={alt} width={width} height={height} {...props} />
  ))}
</Event.Image>
```

**Data Attributes**

- `data-testid="event-image"` - Applied to image element

---

### Event.Title

Displays the event title.

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

Displays the event date.

**Props**

```tsx
interface DateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    startDate: Date | null;
    endDate: Date | null;
    timeZoneId: string | null;
    dateAndTimeTbd: boolean;
    dateAndTimeTbdMessage: string | null;
    hideEndDate: boolean;
    showTimeZone: boolean;
    formattedDate: string;
  }>;
  className?: string;
  format?: 'short' | 'full'; // Default: 'short'
  locale?: Intl.LocalesArgument;
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
  {React.forwardRef(({ startDate, endDate, timeZoneId, dateAndTimeTbd, dateAndTimeTbdMessage, hideEndDate, showTimeZone, formattedDate, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {formattedDate}
    </span>
  ))}
</Event.Date>
```

**Data Attributes**

- `data-testid="event-date"` - Applied to date element

---

### Event.Location

Displays the event location.

**Props**

```tsx
interface LocationProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    formattedLocation: string;
    latitude: number | null;
    longitude: number | null;
  }>;
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
  {React.forwardRef(({ formattedLocation, latitude, longitude, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm font-medium">
      {formattedLocation}
    </span>
  ))}
</Event.Location>
```

**Data Attributes**

- `data-testid="event-location"` - Applied to location element

---

### Event.ShortDescription

Displays the event short description.

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

Provides the event description. RicosViewer should be used to render the description.

**Props**

```tsx
interface DescriptionProps {
  children?: AsChildChildren<{ description: RichContent }>;
}
```

**Example**

```tsx
<Event.Description>
  {React.forwardRef(({ description, ...props }, ref) => (
    <RicosViewer ref={ref} content={description} />
  ))}
</Event.Description>
```

**Data Attributes**

- `data-testid="event-description"` - Applied to description element

---

### Event.RsvpButton

Displays the event RSVP button.

**Props**

```tsx
interface RsvpButtonProps {
  asChild?: boolean;
  children?: AsChildChildren<{ slug: string; ticketed: boolean }>;
  className?: string;
  label?: React.ReactNode;
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
  {React.forwardRef(({ slug, ticketed, ...props }, ref) => (
    <button ref={ref} {...props}>
      {ticketed ? 'Buy Tickets' : 'RSVP'}
    </button>
  ))}
</Event.RsvpButton>
```

**Data Attributes**

- `data-testid="event-rsvp-button"` - Applied to RSVP button element
- `data-ticketed` - Event is ticketed

---

### Event.FacebookShare

Displays Facebook share element.

**Props**

```tsx
interface FacebookShareProps {
  eventPageUrl: string;
  asChild?: boolean;
  children?: AsChildChildren<{ shareUrl: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.FacebookShare eventPageUrl={eventPageUrl} />

// asChild with primitive
<Event.FacebookShare asChild eventPageUrl={eventPageUrl}>
  <a />
</Event.FacebookShare>

// asChild with react component
<Event.FacebookShare asChild eventPageUrl={eventPageUrl}>
  {React.forwardRef(({ shareUrl, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
  ))}
</Event.FacebookShare>
```

**Data Attributes**

- `data-testid="event-facebook-share"` - Applied to Facebook share element

---

### Event.LinkedInShare

Displays LinkedIn share element.

**Props**

```tsx
interface LinkedInShareProps {
  eventPageUrl: string;
  asChild?: boolean;
  children?: AsChildChildren<{ shareUrl: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.LinkedInShare eventPageUrl={eventPageUrl} />

// asChild with primitive
<Event.LinkedInShare asChild eventPageUrl={eventPageUrl}>
  <a />
</Event.LinkedInShare>

// asChild with react component
<Event.LinkedInShare asChild>
  {React.forwardRef(({ shareUrl, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
  ))}
</Event.LinkedInShare>
```

**Data Attributes**

- `data-testid="event-linked-in-share"` - Applied to LinkedIn share element

---

### Event.XShare

Displays X share element.

**Props**

```tsx
interface XShareProps {
  eventPageUrl: string;
  asChild?: boolean;
  children?: AsChildChildren<{ shareUrl: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Event.XShare eventPageUrl={eventPageUrl} />

// asChild with primitive
<Event.XShare asChild eventPageUrl={eventPageUrl}>
  <a />
</Event.XShare>

// asChild with react component
<Event.XShare asChild>
  {React.forwardRef(({ shareUrl, ...props }, ref) => (
    <button ref={ref} onClick={() => window.open(shareUrl, '_blank')} />
  ))}
</Event.XShare>
```

**Data Attributes**

- `data-testid="event-x-share"` - Applied to X share element

---

### Event.AddToGoogleCalendar

Displays link to add the event to Google calendar.

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

Displays link to add the event to ICS calendar.

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

### Event.OtherEvents

Container for other events.

**Props**

```tsx
interface OtherEventsProps {
  count?: number; // Default: 3
  asChild?: boolean;
  children: React.ReactNode | AsChildChildren<{ events: Event[] }>;
  className?: string;
}
```

**Example**

```tsx
<Event.OtherEvents count={5}>
  <Event.OtherEventRepeater>
    <Event.Image />
    <Event.Title />
  </Event.OtherEventRepeater>
</Event.OtherEvents>
```

**Data Attributes**

- `data-testid="event-other-events"` - Applied to other events container

---

### Event.OtherEventRepeater

Repeater component that renders Event.Root for each event.

**Props**

```tsx
interface OtherEventRepeaterProps {
  count?: number; // Default: 3
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<Event.OtherEventRepeater>
  <Event.Image />
  <Event.Title />
</Event.OtherEventRepeater>
```

---

### Event.Form

Displays the event form.

**Props**

```tsx
interface FormProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
  thankYouPageUrl?: string;
}
```

**Example**

```tsx
import { Form } from '@wix/headless-forms/react';

<Event.Form>
  <Form.Loading />
  <Form.LoadingError />
  <Form.Fields fieldMap={FIELD_MAP} />
</Event.Form>;
```

**Data Attributes**

- `data-testid="event-form"` - Applied to form element

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
| `data-testid="event-slug"`                   | Event.Slug                | Event slug element                   |
| `data-testid="event-other-events"`           | Event.OtherEvents         | Event other events container         |
| `data-testid="event-form"`                   | Event.Form                | Event form element                   |
| `data-upcoming`                              | Event.Root                | Event is upcoming                    |
| `data-started`                               | Event.Root                | Event has started                    |
| `data-ended`                                 | Event.Root                | Event has ended                      |
| `data-sold-out`                              | Event.Root                | Event is sold out                    |
| `data-registration-closed`                   | Event.Root                | Registration is closed               |
| `data-has-image`                             | Event.Root                | Event has image                      |
| `data-has-description`                       | Event.Root                | Event has description                |
| `data-has-occurrences`                       | Event.Root                | Event has occurrences                |
| `data-ticketed`                              | Event.RsvpButton          | Event is ticketed                    |
