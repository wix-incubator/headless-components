# TicketsPicker Interface Documentation

A comprehensive tickets picker display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The TicketsPicker component follows a compound component pattern where each part can be composed together to create flexible tickets picker displays.

## Components

### TicketsPicker.Root

Root container that provides tickets picker context to all child components.

**Props**

```tsx
interface RootProps {
  ticketListServiceConfig: TicketListServiceConfig;
  eventServiceConfig: EventServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<TicketsPicker.Root
  ticketListServiceConfig={ticketListServiceConfig}
  eventServiceConfig={eventServiceConfig}
>
  {/* All tickets picker components */}
</TicketsPicker.Root>
```

---

### TicketsPicker.TicketDefinitions

Container for the ticket definition list with support for empty state.

**Props**

```tsx
interface TicketDefinitionsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<TicketsPicker.TicketDefinitions
  emptyState={<div>No tickets available yet</div>}
>
  <TicketsPicker.TicketDefinitionRepeater>
    {/* Ticket definition template */}
  </TicketsPicker.TicketDefinitionRepeater>
</TicketsPicker.TicketDefinitions>
```

**Data Attributes**

- `data-testid="tickets-picker-ticket-definitions"` - Applied to ticket definitions container

---

### TicketsPicker.TicketDefinitionRepeater

Repeater component that renders [TicketDefinition.Root](./TICKET_DEFINITION_INTERFACE.md#ticketdefinitionroot) for each ticket definition.

**Props**

```tsx
interface TicketDefinitionRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<TicketsPicker.TicketDefinitionRepeater>
  <TicketDefinition.Name />
  <TicketDefinition.Description />
</TicketsPicker.TicketDefinitionRepeater>
```

---

### TicketsPicker.CheckoutError

Displays an error message when the checkout fails.

**Props**

```tsx
interface CheckoutErrorProps {
  asChild?: boolean;
  children?: AsChildChildren<{ error: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketsPicker.CheckoutError className="text-red-500" />

// asChild with primitive
<TicketsPicker.CheckoutError asChild className="text-red-500">
  <span />
</TicketsPicker.CheckoutError>

// asChild with react component
<TicketsPicker.CheckoutError asChild className="text-red-500">
  {React.forwardRef(({ error, ...props }) => (
    <span ref={ref} {...props}>
      {error}
    </span>
  ))}
</TicketsPicker.CheckoutError>
```

**Data Attributes**

- `data-testid="tickets-picker-checkout-error"` - Applied to error element

---

### TicketsPicker.CheckoutTrigger

Displays a button for checkout functionality.

**Props**

```tsx
interface CheckoutTriggerProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    isLoading: boolean;
    error: string | null;
    hasSelectedTickets: boolean;
    checkout: () => Promise<void>;
  }>;
  className?: string;
  label?: string;
}
```

**Example**

```tsx
// Default usage
<TicketsPicker.CheckoutTrigger className="bg-blue-600 hover:bg-blue-700 text-white" label="Reserve" />

// asChild with primitive
<TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  <button>Reserve</button>
</TicketsPicker.CheckoutTrigger>

// asChild with react component
<TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  {React.forwardRef(({ isLoading, error, hasSelectedTickets, checkout, ...props }) => (
    <button ref={ref} {...props} onClick={checkout}>
      {isLoading ? 'Reserving...' : 'Reserve'}
    </button>
  ))}
</TicketsPicker.CheckoutTrigger>
```

**Data Attributes**

- `data-testid="tickets-picker-checkout-trigger"` - Applied to checkout element
- `data-in-progress` - Is checkout in progress

---

## Data Attributes Summary

| Attribute                                         | Applied To                      | Purpose                 |
| ------------------------------------------------- | ------------------------------- | ----------------------- |
| `data-testid="tickets-picker-ticket-definitions"` | TicketsPicker.TicketDefinitions | Ticket definitions list |
| `data-testid="tickets-picker-checkout-error"`     | TicketsPicker.CheckoutError     | Checkout error element  |
| `data-testid="tickets-picker-checkout-trigger"`   | TicketsPicker.CheckoutTrigger   | Checkout element        |
| `data-in-progress`                                | TicketsPicker.CheckoutTrigger   | Checkout status         |
