# Form Interface Documentation

A comprehensive form component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Form component follows a compound component pattern where each part can be composed together to create flexible form displays.

## Components

### Form.Root

Root container that provides form context to all child components.

**Props**

```tsx
interface RootProps {
  eventServiceConfig: EventServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Form.Root eventServiceConfig={eventServiceConfig}>
  {/* All form components */}
</Form.Root>
```

---

### Form.Controls

Form container that wraps all form controls with submit handling.

**Props**

```tsx
interface ControlsProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<Form.Controls className="space-y-4">
  <Form.ControlRepeater>
    <Control.Label />
    <Control.FirstName />
    <Control.LastName />
    <Control.Email />
    <Control.Input />
    <Control.Textarea />
    <Control.Dropdown />
    <Control.Radio />
    <Control.Checkbox />
    <Control.ShortAddress />
    <Control.FullAddress />
    <Control.Date />
    <Control.AdditionalGuests />
  </Form.ControlRepeater>
</Form.Controls>
```

**Data Attributes**

- `data-testid="form-controls"` - Applied to controls container

---

### Form.ControlRepeater

Repeater component that renders Control.Root for each form control.

**Props**

```tsx
interface ControlRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<Form.ControlRepeater>
  <Control.Label />
  <Control.FirstName />
  <Control.LastName />
  <Control.Email />
  <Control.Input />
  <Control.Textarea />
  <Control.Dropdown />
  <Control.Radio />
  <Control.Checkbox />
  <Control.ShortAddress />
  <Control.FullAddress />
  <Control.Date />
  <Control.AdditionalGuests />
</Form.ControlRepeater>
```

---

### Form.SubmitTrigger

Displays a submit button for the form with customizable rendering.

**Props**

```tsx
interface SubmitTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{ isSubmitting: boolean }>;
  className?: string;
  label?: string;
}
```

**Example**

```tsx
// Default usage
<Form.SubmitTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Register" />

// asChild with primitive
<Form.SubmitTrigger asChild>
  <button className="bg-blue-600 hover:bg-blue-700 text-white">Register</button>
</Form.SubmitTrigger>

// asChild with react component
<Form.SubmitTrigger asChild>
  {React.forwardRef(({ isSubmitting, ...props }, ref) => (
    <button ref={ref} {...props} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Register'}
    </button>
  ))}
</Form.SubmitTrigger>
```

**Data Attributes**

- `data-testid="form-submit"` - Applied to submit element
- `data-submitting` - Is form being submitted

---

### Form.Error

Displays an error message when the form submission fails.

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
<Form.Error className="text-red-500" />

// asChild with primitive
<Form.Error asChild>
  <span className="text-red-500" />
</Form.Error>

// asChild with react component
<Form.Error asChild>
  {React.forwardRef(({ error, ...props }, ref) => (
    <div ref={ref} {...props} className="text-red-500 bg-red-50 p-3 rounded">
      {error}
    </div>
  ))}
</Form.Error>
```

**Data Attributes**

- `data-testid="form-error"` - Applied to error element

---

## Data Attributes Summary

| Attribute                     | Applied To         | Purpose           |
| ----------------------------- | ------------------ | ----------------- |
| `data-testid="form-controls"` | Form.Controls      | Form element      |
| `data-testid="form-submit"`   | Form.SubmitTrigger | Submit element    |
| `data-testid="form-error"`    | Form.Error         | Error element     |
| `data-submitting`             | Form.SubmitTrigger | Submission status |
