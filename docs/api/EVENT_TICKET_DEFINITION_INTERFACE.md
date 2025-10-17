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
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<TicketDefinition.Root ticketDefinition={ticketDefinition}>
  {/* All ticket definition components */}
</TicketDefinition.Root>
```

**Data Attributes**

- `data-testid="ticket-definition-root"` - Applied to ticket definition element
- `data-sold-out` - Ticket definition is sold out
- `data-sale-started` - Sale has started
- `data-sale-ended` - Sale has ended
- `data-free` - Ticket definition is free
- `data-fixed-pricing` - Ticket definition has fixed pricing method
- `data-guest-pricing` - Ticket definition has guest pricing method
- `data-pricing-options` - Ticket definition has pricing options
- `data-has-description` - Ticket definition has description
- `data-available` - Ticket definition is available

---

### TicketDefinition.Name

Displays the ticket definition name.

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

Displays the ticket definition description. Not rendered if there is no description.

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

Displays the fixed pricing for the ticket definition. Only renders when ticket definition has fixed price pricing method.

**Props**

```tsx
interface FixedPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
    free: boolean;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
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
  {React.forwardRef(({ value, currency, formattedValue, free, ...props }, ref) => (
    <span ref={ref} {...props} className="text-lg font-semibold">
      {free ? 'Free' : `${formattedValue}`}
    </span>
  ))}
</TicketDefinition.FixedPricing>
```

**Data Attributes**

- `data-testid="ticket-definition-fixed-pricing"` - Applied to fixed pricing element

---

### TicketDefinition.GuestPricing

Displays an input for guest pricing (pay-what-you-want). Only renders when ticket definition has guest price pricing method.

**Props**

```tsx
interface GuestPricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    price: string | undefined;
    minPrice: number;
    currency: string;
    formattedMinPrice: string;
    setPrice: (price: string) => void;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
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
  {React.forwardRef(({ price, minPrice, currency, formattedMinPrice, setPrice, ...props }, ref) => (
    <input ref={ref} {...props} className="border rounded px-3 py-2" />
  ))}
</TicketDefinition.GuestPricing>
```

**Data Attributes**

- `data-testid="ticket-definition-guest-pricing"` - Applied to guest pricing input element

---

### TicketDefinition.PricingRange

Displays the pricing range for the ticket definition. Only renders when ticket definition has pricing options.

**Props**

```tsx
interface PricingRangeProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    minPrice: number;
    maxPrice: number;
    currency: string;
    formattedMinPrice: string;
    formattedMaxPrice: string;
    formattedPriceRange: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.PricingRange className="text-sm text-gray-500" />

// asChild with primitive
<TicketDefinition.PricingRange asChild>
  <span className="text-sm text-gray-500" />
</TicketDefinition.PricingRange>

// asChild with react component
<TicketDefinition.PricingRange asChild>
  {React.forwardRef(({ minPrice, maxPrice, currency, formattedMinPrice, formattedMaxPrice, formattedPriceRange, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      From {formattedMinPrice} to {formattedMaxPrice}
    </span>
  ))}
</TicketDefinition.PricingRange>
```

**Data Attributes**

- `data-testid="ticket-definition-pricing-range"` - Applied to pricing range element

---

### TicketDefinition.Tax

Displays the tax for the ticket definition. Only renders when event has tax settings, ticket definition is not free and has no pricing options, or ticket definition has guest pricing and tax is applied to donations.

**Props**

```tsx
interface TaxProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    name: string;
    rate: number;
    included: boolean;
    taxableValue: number;
    taxValue: number;
    currency: string;
    formattedTaxValue: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Tax className="text-sm text-gray-500" />

// asChild with primitive
<TicketDefinition.Tax asChild>
  <span className="text-sm text-gray-500" />
</TicketDefinition.Tax>

// asChild with react component
<TicketDefinition.Tax asChild>
  {React.forwardRef(({ name, rate, included, taxableValue, taxValue, currency, formattedTaxValue, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      {included ? `${name} included` : `+${formattedTaxValue} ${name}`}
    </span>
  ))}
</TicketDefinition.Tax>
```

**Data Attributes**

- `data-testid="ticket-definition-tax"` - Applied to tax element

---

### TicketDefinition.Fee

Displays the fee for the ticket definition. Only renders when ticket definition has fee enabled, is not free and has no pricing options.

**Props**

```tsx
interface FeeProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    rate: number;
    value: number;
    currency: string;
    formattedValue: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.Fee className="text-sm text-gray-500" />

// asChild with primitive
<TicketDefinition.Fee asChild>
  <span className="text-sm text-gray-500" />
</TicketDefinition.Fee>

// asChild with react component
<TicketDefinition.Fee asChild>
  {React.forwardRef(({ rate, value, currency, formattedValue, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      +{formattedValue} service fee
    </span>
  ))}
</TicketDefinition.Fee>
```

**Data Attributes**

- `data-testid="ticket-definition-fee"` - Applied to fee element

---

### TicketDefinition.Remaining

Displays the remaining count.

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

Displays the sale start date. Only renders when the sale is scheduled to start in the future.

**Props**

```tsx
interface SaleStartDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    /** Sale start date */
    startDate: Date;
    /** Formatted sale start date */
    startDateFormatted: string;
  }>;
  className?: string;
  /** Locale */
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<TicketDefinition.SaleStartDate className="text-sm" />

// asChild with primitive
<TicketDefinition.SaleStartDate asChild>
  <span className="text-sm" />
</TicketDefinition.SaleStartDate>

// asChild with react component
<TicketDefinition.SaleStartDate asChild>
  {React.forwardRef(({ startDate, startDateFormatted, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm">
      Sale starts: {startDateFormatted}
    </span>
  ))}
</TicketDefinition.SaleStartDate>
```

**Data Attributes**

- `data-testid="ticket-definition-sale-start-date"` - Applied to sale start date element

---

### TicketDefinition.SaleEndDate

Displays the sale end date. Only renders when the sale has started or ended.

**Props**

```tsx
interface SaleEndDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    /** Sale end date */
    endDate: Date;
    /** Formatted sale end date */
    endDateFormatted: string;
    /** Whether sale has ended */
    saleEnded: boolean;
  }>;
  className?: string;
  /** Locale */
  locale?: Intl.LocalesArgument;
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
  {React.forwardRef(({ endDate, endDateFormatted, saleEnded, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-red-600">
      {saleEnded ? 'Sale ended' : 'Sale ends'}: {endDateFormatted}
    </span>
  ))}
</TicketDefinition.SaleEndDate>
```

**Data Attributes**

- `data-testid="ticket-definition-sale-end-date"` - Applied to sale end date element

---

### TicketDefinition.Quantity

Displays a quantity selector for the ticket definition. Only renders when there are no pricing options, the sale has started, and the ticket definition is not sold out.

**Props**

```tsx
interface QuantityProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    options: number[];
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
  {React.forwardRef(({ options, quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
    <div ref={ref} {...props} className="flex items-center space-x-2">
      <button disabled={quantity === 0} onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button disabled={quantity >= maxQuantity} onClick={increment}>+</button>
    </div>
  ))}
</TicketDefinition.Quantity>
```

**Data Attributes**

- `data-testid="ticket-definition-quantity"` - Applied to quantity element

---

### TicketDefinition.PricingOptions

Container for pricing options. Only renders when there are pricing options available.

**Props**

```tsx
interface PricingOptionsProps {
  asChild?: boolean;
  children:
    | React.ReactNode
    | AsChildChildren<{ pricingOptions: PricingOption[] }>;
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
Note: Repeater components do NOT support asChild as per architecture rules.

**Props**

```tsx
interface PricingOptionRepeaterProps {
  children: React.ReactNode;
  className?: string;
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

| Attribute                                         | Applied To                      | Purpose                                    |
| ------------------------------------------------- | ------------------------------- | ------------------------------------------ |
| `data-testid="ticket-definition-root"`            | TicketDefinition.Root           | Ticket definition element                  |
| `data-testid="ticket-definition-name"`            | TicketDefinition.Name           | Ticket definition name element             |
| `data-testid="ticket-definition-description"`     | TicketDefinition.Description    | Ticket definition description element      |
| `data-testid="ticket-definition-fixed-pricing"`   | TicketDefinition.FixedPricing   | Fixed pricing element                      |
| `data-testid="ticket-definition-guest-pricing"`   | TicketDefinition.GuestPricing   | Guest pricing input element                |
| `data-testid="ticket-definition-pricing-range"`   | TicketDefinition.PricingRange   | Pricing range element                      |
| `data-testid="ticket-definition-tax"`             | TicketDefinition.Tax            | Tax element                                |
| `data-testid="ticket-definition-fee"`             | TicketDefinition.Fee            | Fee element                                |
| `data-testid="ticket-definition-remaining"`       | TicketDefinition.Remaining      | Remaining tickets element                  |
| `data-testid="ticket-definition-sale-start-date"` | TicketDefinition.SaleStartDate  | Sale start date element                    |
| `data-testid="ticket-definition-sale-end-date"`   | TicketDefinition.SaleEndDate    | Sale end date element                      |
| `data-testid="ticket-definition-quantity"`        | TicketDefinition.Quantity       | Quantity element                           |
| `data-testid="ticket-definition-pricing-options"` | TicketDefinition.PricingOptions | Pricing options container                  |
| `data-sold-out`                                   | TicketDefinition.Root           | Ticket definition is sold out              |
| `data-sale-started`                               | TicketDefinition.Root           | Sale has started                           |
| `data-sale-ended`                                 | TicketDefinition.Root           | Sale has ended                             |
| `data-free`                                       | TicketDefinition.Root           | Ticket definition is free                  |
| `data-fixed-pricing`                              | TicketDefinition.Root           | Ticket definition has fixed pricing method |
| `data-guest-pricing`                              | TicketDefinition.Root           | Ticket definition has guest pricing method |
| `data-pricing-options`                            | TicketDefinition.Root           | Ticket definition has pricing options      |
| `data-has-description`                            | TicketDefinition.Root           | Ticket definition has description          |
| `data-available`                                  | TicketDefinition.Root           | Ticket definition is available             |
