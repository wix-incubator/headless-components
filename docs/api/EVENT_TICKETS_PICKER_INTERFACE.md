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
  children: React.ReactNode;
  eventServiceConfig: EventServiceConfig;
  ticketDefinitionListServiceConfig: TicketDefinitionListServiceConfig;
  checkoutServiceConfig: CheckoutServiceConfig;
}
```

**Example**

```tsx
<TicketsPicker.Root
  eventServiceConfig={eventServiceConfig}
  ticketDefinitionListServiceConfig={ticketDefinitionListServiceConfig}
  checkoutServiceConfig={checkoutServiceConfig}
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

### TicketsPicker.Totals

Provides totals data for the tickets picker.

**Props**

```tsx
interface TotalsProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    total: number;
    subtotal: number;
    tax: number;
    fee: number;
    currency: string;
    formattedTotal: string;
    formattedSubtotal: string;
    formattedTax: string;
    formattedFee: string;
    taxName: string | null;
    taxRate: number | null;
    taxIncluded: boolean;
    feeRate: number;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<TicketsPicker.Totals className="text-gray-500" />

// asChild with primitive
<TicketsPicker.Totals asChild className="text-gray-500">
  <span />
</TicketsPicker.Totals>

// asChild with react component
<TicketsPicker.Totals asChild className="text-gray-500">
  {React.forwardRef(({
    total,
    subtotal,
    tax,
    fee,
    currency,
    formattedTotal,
    formattedSubtotal,
    formattedTax,
    formattedFee,
    taxName,
    taxRate,
    taxIncluded,
    feeRate,
    ...props
  }, ref) => (
    <span ref={ref} {...props}>
      Subtotal: {formattedSubtotal}
      Tax: {formattedTax}
      Fee: {formattedFee}
      Total: {formattedTotal}
    </span>
  ))}
</TicketsPicker.Totals>
```

**Data Attributes**

- `data-testid="tickets-picker-totals"` - Applied to totals element

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
    hasSelectedTicketDefinitions: boolean;
    checkout: () => Promise<void>;
  }>;
  className?: string;
  label?: React.ReactNode;
  loadingState?: React.ReactNode;
}
```

**Example**

```tsx
// Default usage
<TicketsPicker.CheckoutTrigger
  className="bg-blue-600 hover:bg-blue-700 text-white"
  label="Checkout"
  loadingState="Processing..."
/>

// asChild with primitive
<TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  <button>Checkout</button>
</TicketsPicker.CheckoutTrigger>

// asChild with react component
<TicketsPicker.CheckoutTrigger asChild className="bg-blue-600 hover:bg-blue-700 text-white">
  {React.forwardRef(({ isLoading, error, hasSelectedTicketDefinitions, checkout, ...props }, ref) => (
    <button ref={ref} {...props}>
      {isLoading ? 'Processing...' : 'Checkout'}
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
| `data-testid="tickets-picker-totals"`             | TicketsPicker.Totals            | Totals element          |
| `data-testid="tickets-picker-checkout-error"`     | TicketsPicker.CheckoutError     | Checkout error element  |
| `data-testid="tickets-picker-checkout-trigger"`   | TicketsPicker.CheckoutTrigger   | Checkout element        |
| `data-in-progress`                                | TicketsPicker.CheckoutTrigger   | Checkout status         |
