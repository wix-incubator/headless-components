# PricingOption Interface Documentation

A comprehensive pricing option component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The PricingOption component follows a compound component pattern where each part can be composed together to create flexible pricing option displays.

## Components

### PricingOption.Root

Root container that provides pricing option context to all child components.

**Props**

```tsx
interface RootProps {
  pricingOption: PricingOption;
  children: React.ReactNode;
}
```

**Example**

```tsx
<PricingOption.Root pricingOption={pricingOption}>
  {/* All pricing option components */}
</PricingOption.Root>
```

**Data Attributes**

- `data-testid="pricing-option-root"` - Applied to pricing option element

---

### PricingOption.Name

Displays the pricing option name.

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
<PricingOption.Name className="font-semibold" />

// asChild with primitive
<PricingOption.Name asChild>
  <h2 className="font-semibold">
</PricingOption.Name>

// asChild with react component
<PricingOption.Name asChild>
  {React.forwardRef(({ name, ...props }, ref) => (
    <h2 ref={ref} {...props} className="font-semibold">
      {name}
    </h2>
  ))}
</PricingOption.Name>
```

**Data Attributes**

- `data-testid="pricing-option-name"` - Applied to pricing option name element

---

### PricingOption.Pricing

Displays the pricing option price with customizable rendering.

**Props**

```tsx
interface PricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{
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
<PricingOption.Pricing className="text-lg font-semibold" />

// asChild with primitive
<PricingOption.Pricing asChild>
  <span className="text-lg font-semibold" />
</PricingOption.Pricing>

// asChild with react component
<PricingOption.Pricing asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <span ref={ref} {...props} className="text-lg font-semibold">
      {formattedValue}
    </span>
  ))}
</PricingOption.Pricing>
```

**Data Attributes**

- `data-testid="pricing-option-pricing"` - Applied to pricing option pricing element

---

### PricingOption.Tax

Displays the tax for the pricing option. Only renders when event has tax settings.

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
<PricingOption.Tax className="text-sm text-gray-500" />

// asChild with primitive
<PricingOption.Tax asChild>
  <span className="text-sm text-gray-500" />
</PricingOption.Tax>

// asChild with react component
<PricingOption.Tax asChild>
  {React.forwardRef(({ name, rate, included, taxableValue, taxValue, currency, formattedTaxValue, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      {included ? `${name} included` : `+${formattedTaxValue} ${name}`}
    </span>
  ))}
</PricingOption.Tax>
```

**Data Attributes**

- `data-testid="pricing-option-tax"` - Applied to tax element

---

### PricingOption.Fee

Displays the fee for the pricing option. Only renders when ticket definition has fee enabled.

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
<PricingOption.Fee className="text-sm text-gray-500" />

// asChild with primitive
<PricingOption.Fee asChild>
  <span className="text-sm text-gray-500" />
</PricingOption.Fee>

// asChild with react component
<PricingOption.Fee asChild>
  {React.forwardRef(({ rate, value, currency, formattedValue, ...props }, ref) => (
    <span ref={ref} {...props} className="text-sm text-gray-500">
      +{formattedValue} service fee
    </span>
  ))}
</PricingOption.Fee>
```

**Data Attributes**

- `data-testid="pricing-option-fee"` - Applied to fee element

---

### PricingOption.Quantity

Displays a quantity selector for the pricing option. Only renders when the sale has started and the ticket definition is not sold out.

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
<PricingOption.Quantity className="border rounded px-3 py-2" />

// asChild with primitive
<PricingOption.Quantity asChild>
  <select className="border rounded px-3 py-2" />
</PricingOption.Quantity>

// asChild with react component
<PricingOption.Quantity asChild>
  {React.forwardRef(({ options, quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
    <div ref={ref} {...props} className="flex items-center space-x-2">
      <button disabled={quantity === 0} onClick={decrement}>-</button>
      <span>{quantity}</span>
      <button disabled={quantity >= maxQuantity} onClick={increment}>+</button>
    </div>
  ))}
</PricingOption.Quantity>
```

**Data Attributes**

- `data-testid="pricing-option-quantity"` - Applied to pricing option quantity element

---

## Data Attributes Summary

| Attribute                               | Applied To             | Purpose                          |
| --------------------------------------- | ---------------------- | -------------------------------- |
| `data-testid="pricing-option-root"`     | PricingOption.Root     | Pricing option element           |
| `data-testid="pricing-option-name"`     | PricingOption.Name     | Pricing option name element      |
| `data-testid="pricing-option-pricing"`  | PricingOption.Pricing  | Pricing option pricing element   |
| `data-testid="pricing-option-tax"`      | PricingOption.Tax      | Pricing option tax element       |
| `data-testid="pricing-option-fee"`      | PricingOption.Fee      | Pricing option fee element       |
| `data-testid="pricing-option-quantity"` | PricingOption.Quantity | Pricing option quantity selector |
