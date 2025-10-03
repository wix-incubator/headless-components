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

- `data-testid="pricing-option"` - Applied to pricing option element

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

Displays the pricing option price.

**Props**

```tsx
interface PricingProps {
  asChild?: boolean;
  children?: AsChildChildren<{ value: string; currency: string }>;
  className?: string;
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
  {React.forwardRef(({ value, currency, ...props }, ref) => (
    <span ref={ref} {...props} className="text-lg font-semibold">
      {value} {currency}
    </span>
  ))}
</PricingOption.Pricing>
```

**Data Attributes**

- `data-testid="pricing-option-pricing"` - Applied to pricing option pricing element

---

### PricingOption.Quantity

Displays a quantity selector for the pricing option.

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
<PricingOption.Quantity className="border rounded px-3 py-2" />

// asChild with primitive
<PricingOption.Quantity asChild>
  <select className="border rounded px-3 py-2" />
</PricingOption.Quantity>

// asChild with react component
<PricingOption.Quantity asChild>
  {React.forwardRef(({ quantity, maxQuantity, increment, decrement, setQuantity, ...props }, ref) => (
    <div ref={ref} {...props} className="flex items-center space-x-2">
      <button onClick={decrement} disabled={quantity === 0}>-</button>
      <span>{quantity}</span>
      <button onClick={increment} disabled={quantity >= maxQuantity}>+</button>
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
| `data-testid="pricing-option"`          | PricingOption.Root     | Pricing option element           |
| `data-testid="pricing-option-name"`     | PricingOption.Name     | Pricing option name element      |
| `data-testid="pricing-option-pricing"`  | PricingOption.Pricing  | Pricing option pricing element   |
| `data-testid="pricing-option-quantity"` | PricingOption.Quantity | Pricing option quantity selector |
