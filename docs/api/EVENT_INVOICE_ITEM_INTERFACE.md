# InvoiceItem Interface Documentation

A comprehensive invoice item component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The InvoiceItem component follows a compound component pattern where each part can be composed together to create flexible invoice item displays.

## Components

### InvoiceItem.Root

Root container that provides invoice item context to all child components.

**Props**

```tsx
interface RootProps {
  invoiceItem: InvoiceItem;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<InvoiceItem.Root invoiceItem={invoiceItem}>
  {/* All invoice item components */}
</InvoiceItem.Root>
```

**Data Attributes**

- `data-testid="invoice-item-root"` - Applied to invoice item root element

---

### InvoiceItem.Name

Displays the invoice item name.

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
<InvoiceItem.Name className="font-medium" />

// asChild with primitive
<InvoiceItem.Name asChild>
  <h3 className="text-lg font-bold" />
</InvoiceItem.Name>

// asChild with react component
<InvoiceItem.Name asChild>
  {React.forwardRef(({ name, ...props }, ref) => (
    <h3 ref={ref} {...props} className="text-lg font-bold">
      {name}
    </h3>
  ))}
</InvoiceItem.Name>
```

**Data Attributes**

- `data-testid="invoice-item-name"` - Applied to name element

---

### InvoiceItem.Price

Displays the invoice item price.

**Props**

```tsx
interface PriceProps {
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
<InvoiceItem.Price className="text-green-600 font-semibold" />

// asChild with primitive
<InvoiceItem.Price asChild>
  <p className="text-lg text-green-600" />
</InvoiceItem.Price>

// asChild with react component
<InvoiceItem.Price asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <p ref={ref} {...props} className="text-lg text-green-600">
      Price: {formattedValue}
    </p>
  ))}
</InvoiceItem.Price>
```

**Data Attributes**

- `data-testid="invoice-item-price"` - Applied to price element

---

### InvoiceItem.Quantity

Displays the invoice item quantity.

**Props**

```tsx
interface QuantityProps {
  asChild?: boolean;
  children?: AsChildChildren<{ quantity: number }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<InvoiceItem.Quantity className="text-gray-600" />

// asChild with primitive
<InvoiceItem.Quantity asChild>
  <span className="badge" />
</InvoiceItem.Quantity>

// asChild with react component
<InvoiceItem.Quantity asChild>
  {React.forwardRef(({ quantity, ...props }, ref) => (
    <span ref={ref} {...props} className="badge">
      Qty: {quantity}
    </span>
  ))}
</InvoiceItem.Quantity>
```

**Data Attributes**

- `data-testid="invoice-item-quantity"` - Applied to quantity element

---

### InvoiceItem.Total

Displays the invoice item total amount.

**Props**

```tsx
interface TotalProps {
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
<InvoiceItem.Total className="font-bold text-xl" />

// asChild with primitive
<InvoiceItem.Total asChild>
  <p className="font-bold text-xl text-green-600" />
</InvoiceItem.Total>

// asChild with react component
<InvoiceItem.Total asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <p ref={ref} {...props} className="font-bold text-xl text-green-600">
      Total: {formattedValue}
    </p>
  ))}
</InvoiceItem.Total>
```

**Data Attributes**

- `data-testid="invoice-item-total"` - Applied to total element

---

## Data Attributes Summary

| Attribute                             | Applied To           | Purpose              |
| ------------------------------------- | -------------------- | -------------------- |
| `data-testid="invoice-item-root"`     | InvoiceItem.Root     | Invoice item element |
| `data-testid="invoice-item-name"`     | InvoiceItem.Name     | Name element         |
| `data-testid="invoice-item-price"`    | InvoiceItem.Price    | Price element        |
| `data-testid="invoice-item-quantity"` | InvoiceItem.Quantity | Quantity element     |
| `data-testid="invoice-item-total"`    | InvoiceItem.Total    | Total element        |
