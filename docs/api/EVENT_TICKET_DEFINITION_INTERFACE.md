# TicketDefinition Interface Documentation

A comprehensive ticket definition component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The TicketDefinition component follows a compound component pattern where each part can be composed together to create flexible ticket definition displays.

## Components

### TicketDefinition.Root

Root container that provides ticket definition context to all child components.

**Props**

```tsx
interface RootProps {
  ticketDefinition: TicketDefinition;
  children: React.ReactNode;
}
```

**Example**

```tsx
<TicketDefinition.Root ticketDefinition={ticketDefinition}>
  {/* All ticket definition components */}
</TicketDefinition.Root>
```

**Data Attributes**

- `data-sold-out` - Is ticket sold out

---

### TicketDefinition.Name

Displays the ticket definition name with customizable rendering.

**Props**

```tsx
interface NameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ name: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Name className="text-xl font-bold" />

// asChild with primitive
<TicketDefinition.Name asChild>
  <h2 className="text-xl font-bold" />
</TicketDefinition.Name>

// asChild with react component
<TicketDefinition.Name asChild>
  {React.forwardRef(({ name, ...props }, ref) => (
    <h2 ref={ref} {...props} className="text-xl font-bold">
      {name}
    </h2>
  ))}
</TicketDefinition.Name>
```

**Data Attributes**

- `data-testid="ticket-definition-name"` - Applied to name element

---

### TicketDefinition.Description

Displays the ticket definition description with customizable rendering.

**Props**

```tsx
interface DescriptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ description: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Description className="text-sm text-gray-600" />

// asChild with primitive
<TicketDefinition.Description asChild>
  <p className="text-sm text-gray-600" />
</TicketDefinition.Description>

// asChild with react component
<TicketDefinition.Description asChild>
  {React.forwardRef(({ description, ...props }, ref) => (
    <p ref={ref} {...props} className="text-sm text-gray-600">
      {description}
    </p>
  ))}
</TicketDefinition.Description>
```

**Data Attributes**

- `data-testid="ticket-definition-description"` - Applied to description element

---

### TicketDefinition.FixedPricing

Displays the fixed pricing for the ticket definition. Only renders when the ticket has a fixed price pricing method.

**Props**

```tsx
interface FixedPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ value: string; currency: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.FixedPricing className="text-lg font-semibold" />

// asChild with primitive
<TicketDefinition.FixedPricing asChild>
  <span className="text-lg font-semibold" />
</TicketDefinition.FixedPricing>

// asChild with react component
<TicketDefinition.FixedPricing asChild>
  {React.forwardRef(({ value, currency, ...props }, ref) => (
    <span ref={ref} {...props} className="text-lg font-semibold">
      {value} {currency}
    </span>
  ))}
</TicketDefinition.FixedPricing>
```

**Data Attributes**

- `data-testid="ticket-definition-fixed-pricing"` - Applied to fixed pricing element
- `data-free` - Is ticket definition free

---

### TicketDefinition.GuestPricing

Displays an input for guest pricing (pay-what-you-want). Only renders when the ticket has guest price pricing method.

**Props**

```tsx
interface GuestPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ min: string; currency: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.GuestPricing className="border rounded px-3 py-2" />

// asChild with primitive
<TicketDefinition.GuestPricing asChild>
  <input className="border rounded px-3 py-2" />
</TicketDefinition.GuestPricing>

// asChild with react component
<TicketDefinition.GuestPricing asChild>
  {React.forwardRef(({ min, currency, ...props }, ref) => (
    <input
      ref={ref}
      {...props}
      min={min}
      placeholder={`${min} ${currency}`}
      className="border rounded px-3 py-2"
    />
  ))}
</TicketDefinition.GuestPricing>
```

**Data Attributes**

- `data-testid="ticket-definition-guest-pricing"` - Applied to guest pricing input element

---

### TicketDefinition.Remaining

Displays the remaining ticket count.

**Props**

```tsx
interface RemainingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ remaining: number }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Remaining className="text-sm text-gray-500" />

// asChild with primitive
<TicketDefinition.Remaining asChild>
  <span className="text-sm text-gray-500" />
</TicketDefinition.Remaining>

// asChild with react component
<TicketDefinition.Remaining asChild>
  {React.forwardRef(({ remaining, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      {remaining} remaining
    </span>
  ))}
</TicketDefinition.Remaining>
```

**Data Attributes**

- `data-testid="ticket-definition-remaining"` - Applied to remaining element

---

### TicketDefinition.SaleStartDate

Displays the sale start date. Only renders when the ticket sale is scheduled to start in the future.

**Props**

```tsx
interface SaleStartDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    startDate: Date | null;
    startDateFormatted: string;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.SaleStartDate className="text-sm text-orange-600" />

// asChild with primitive
<TicketDefinition.SaleStartDate asChild>
  <span className="text-sm text-orange-600" />
</TicketDefinition.SaleStartDate>

// asChild with react component
<TicketDefinition.SaleStartDate asChild>
  {React.forwardRef(({ startDate, startDateFormatted, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-orange-600">
      Sale starts: {startDateFormatted}
    </span>
  ))}
</TicketDefinition.SaleStartDate>
```

**Data Attributes**

- `data-testid="ticket-definition-sale-start-date"` - Applied to sale start date element

---

### TicketDefinition.SaleEndDate

Displays the sale end date. Only renders when the ticket sale has started or ended.

**Props**

```tsx
interface SaleEndDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    endDate: Date | null;
    endDateFormatted: string;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.SaleEndDate className="text-sm text-red-600" />

// asChild with primitive
<TicketDefinition.SaleEndDate asChild>
  <span className="text-sm text-red-600" />
</TicketDefinition.SaleEndDate>

// asChild with react component
<TicketDefinition.SaleEndDate asChild>
  {React.forwardRef(({ endDate, endDateFormatted, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-red-600">
      Sale ends: {endDateFormatted}
    </span>
  ))}
</TicketDefinition.SaleEndDate>
```

**Data Attributes**

- `data-testid="ticket-definition-sale-end-date"` - Applied to sale end date element
- `data-sale-ended` - Has sale ended

---

### TicketDefinition.Quantity

Displays a quantity select for the ticket. Only renders for tickets without pricing options and when the sale has started.

**Props**

```tsx
interface QuantityProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    quantity: number;
    maxQuantity: number;
    increment: () => void;
    decrement: () => void;
    setQuantity: (quantity: number) => void;
  }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Quantity className="border rounded px-3 py-2" />

// asChild with primitive
<TicketDefinition.Quantity asChild>
  <select className="border rounded px-3 py-2" />
</TicketDefinition.Quantity>

// asChild with react component
<TicketDefinition.Quantity asChild>
  {React.forwardRef(({ quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
    <div ref={ref} {...props} className="flex items-center space-x-2">
      <button onClick={decrement} disabled={quantity === 0}>-</button>
      <span>{quantity}</span>
      <button onClick={increment} disabled={quantity >= maxQuantity}>+</button>
    </div>
  ))}
</TicketDefinition.Quantity>
```

**Data Attributes**

- `data-testid="ticket-definition-quantity"` - Applied to quantity element

---

### TicketDefinition.PricingOptions

Container for pricing options. Only renders when the ticket has pricing options available.

**Props**

```tsx
interface PricingOptionsProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<TicketDefinition.PricingOptions className="space-y-2">
  <TicketDefinition.PricingOptionRepeater>
    <PricingOption.Name />
    <PricingOption.Pricing />
    <PricingOption.Quantity />
  </TicketDefinition.PricingOptionRepeater>
</TicketDefinition.PricingOptions>
```

**Data Attributes**

- `data-testid="ticket-definition-pricing-options"` - Applied to pricing options container

---

### TicketDefinition.PricingOptionRepeater

Repeater component that renders [PricingOption.Root](./EVENT_PRICING_OPTION_INTERFACE.md#pricingoptionroot) for each pricing option.

**Props**

```tsx
interface PricingOptionRepeaterProps {
  children: React.ReactNode;
}
```

**Example**

```tsx
<TicketDefinition.PricingOptionRepeater>
  <PricingOption.Name />
  <PricingOption.Pricing />
  <PricingOption.Quantity />
</TicketDefinition.PricingOptionRepeater>
```

---

## Data Attributes Summary

| Attribute                                         | Applied To                      | Purpose                               |
| ------------------------------------------------- | ------------------------------- | ------------------------------------- |
| `data-testid="ticket-definition-name"`            | TicketDefinition.Name           | Ticket definition name element        |
| `data-testid="ticket-definition-description"`     | TicketDefinition.Description    | Ticket definition description element |
| `data-testid="ticket-definition-fixed-pricing"`   | TicketDefinition.FixedPricing   | Fixed pricing element                 |
| `data-testid="ticket-definition-guest-pricing"`   | TicketDefinition.GuestPricing   | Guest pricing input element           |
| `data-testid="ticket-definition-remaining"`       | TicketDefinition.Remaining      | Remaining tickets element             |
| `data-testid="ticket-definition-sale-start-date"` | TicketDefinition.SaleStartDate  | Sale start date element               |
| `data-testid="ticket-definition-sale-end-date"`   | TicketDefinition.SaleEndDate    | Sale end date element                 |
| `data-testid="ticket-definition-quantity"`        | TicketDefinition.Quantity       | Quantity element                      |
| `data-testid="ticket-definition-pricing-options"` | TicketDefinition.PricingOptions | Pricing options container             |
| `data-sold-out`                                   | TicketDefinition.Root           | Is ticket sold out                    |
| `data-free`                                       | TicketDefinition.FixedPricing   | Is ticket definition free             |
| `data-sale-ended`                                 | TicketDefinition.SaleEndDate    | Has sale ended                        |
