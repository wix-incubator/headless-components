# Order Interface Documentation

A comprehensive order display component system built with composable primitives, similar to Radix UI architecture.

## Architecture

The Order component follows a compound component pattern where each part can be composed together to create flexible order displays.

## Components

### Order.Root

Root container that provides order service context to all child components.

**Props**

```tsx
interface RootProps {
  orderServiceConfig?: OrderServiceConfig;
  children: React.ReactNode;
}
```

**Example**

```tsx
<Order.Root orderServiceConfig={orderServiceConfig}>
  {/* All order components */}
</Order.Root>
```

---

### Order.OrderNumber

Displays the order number.

**Props**

```tsx
interface OrderNumberProps {
  asChild?: boolean;
  children?: AsChildChildren<{ orderNumber: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Order.OrderNumber className="font-light text-lg text-gray-700" />

// asChild with primitive
<Order.OrderNumber asChild>
  <h2 className="text-xl font-bold text-gray-900" />
</Order.OrderNumber>

// asChild with react component
<Order.OrderNumber asChild>
  {React.forwardRef(({ orderNumber, ...props }, ref) => (
    <span ref={ref} {...props}>
      Order No. #{orderNumber}
    </span>
  ))}
</Order.OrderNumber>
```

**Data Attributes**

- `data-testid="order-number"` - Applied to order number element

---

### Order.GuestEmail

Displays the guest email.

**Props**

```tsx
interface GuestEmailProps {
  asChild?: boolean;
  children?: AsChildChildren<{ guestEmail: string }>;
  className?: string;
}
```

**Example**

```tsx
// Default usage
<Order.GuestEmail className="text-gray-600 font-light" />

// asChild with primitive
<Order.GuestEmail asChild>
  <p className="text-sm text-gray-500 font-light" />
</Order.GuestEmail>

// asChild with react component
<Order.GuestEmail asChild>
  {React.forwardRef(({ guestEmail, ...props }, ref) => (
    <span ref={ref} {...props}>
      Email: {guestEmail}
    </span>
  ))}
</Order.GuestEmail>
```

**Data Attributes**

- `data-testid="order-guest-email"` - Applied to guest email element

---

### Order.CreatedDate

Displays the order creation date.

**Props**

```tsx
interface CreatedDateProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    createdDate: Date;
    formattedDate: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<Order.CreatedDate className="text-gray-600 font-light" />

// asChild with primitive
<Order.CreatedDate asChild>
  <p className="text-sm text-gray-500 font-light" />
</Order.CreatedDate>

// asChild with react component
<Order.CreatedDate asChild>
  {React.forwardRef(({ createdDate, formattedDate, ...props }, ref) => (
    <span ref={ref} {...props}>
      Placed on: {formattedDate}
    </span>
  ))}
</Order.CreatedDate>
```

**Data Attributes**

- `data-testid="order-created-date"` - Applied to created date element

---

### Order.DownloadTicketsButton

Download tickets button that provides access to event tickets PDF. Only shows when tickets are available for download.

**Props**

```tsx
interface DownloadTicketsButtonProps {
  asChild?: boolean;
  children?: AsChildChildren<{ ticketsPdfUrl: string }>;
  className?: string;
  label?: React.ReactNode;
}
```

**Example**

```tsx
// Default usage
<Order.DownloadTicketsButton
  label="Download Tickets"
  className="bg-blue-500 text-white px-4 py-2 rounded"
/>

// asChild with primitive
<Order.DownloadTicketsButton asChild>
  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
    Download Tickets
  </button>
</Order.DownloadTicketsButton>

// asChild with react component
<Order.DownloadTicketsButton asChild>
  {React.forwardRef(({ ticketsPdfUrl, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      onClick={() => window.open(ticketsPdfUrl, '_blank')}
    >
      Download Tickets
    </button>
  ))}
</Order.DownloadTicketsButton>
```

**Data Attributes**

- `data-testid="order-download-tickets-button"` - Applied to download tickets button element

---

### Order.InvoiceItems

Container for order invoice items.

**Props**

```tsx
interface InvoiceItemsProps {
  asChild?: boolean;
  children: React.ReactNode | AsChildChildren<{ invoiceItems: InvoiceItem[] }>;
  className?: string;
}
```

**Example**

```tsx
<Order.InvoiceItems className="px-6 border-b border-gray-300">
  <Order.InvoiceItemRepeater className="flex border-b border-gray-200 py-4">
    <InvoiceItem.Name className="w-[35%]" />
    <InvoiceItem.Price className="w-[25%]" />
    <InvoiceItem.Quantity className="w-[15%]" />
    <InvoiceItem.Total className="w-[25%] text-right" />
  </Order.InvoiceItemRepeater>
</Order.InvoiceItems>
```

**Data Attributes**

- `data-testid="order-invoice-items"` - Applied to invoice items container

---

### Order.InvoiceItemRepeater

Repeater component that renders [InvoiceItem.Root](./EVENT_INVOICE_ITEM_INTERFACE.md#invoiceitemroot) for each invoice item in the order.

**Props**

```tsx
interface InvoiceItemRepeaterProps {
  children: React.ReactNode;
  className?: string;
}
```

**Example**

```tsx
<Order.InvoiceItemRepeater>
  <InvoiceItem.Name />
  <InvoiceItem.Price />
  <InvoiceItem.Quantity />
  <InvoiceItem.Total />
</Order.InvoiceItemRepeater>
```

---

### Order.Subtotal

Displays the order subtotal amount.

**Props**

```tsx
interface SubtotalProps {
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
<Order.Subtotal className="text-lg font-light text-gray-700" />

// asChild with primitive
<Order.Subtotal asChild>
  <p className="text-lg font-light text-gray-700" />
</Order.Subtotal>

// asChild with react component
<Order.Subtotal asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Subtotal:</span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.Subtotal>
```

**Data Attributes**

- `data-testid="order-subtotal"` - Applied to subtotal element

---

### Order.PaidPlanDiscount

Displays the order paid plan discount. Only renders when there is a paid plan discount.

**Props**

```tsx
interface PaidPlanDiscountProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
    rate: number;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<Order.PaidPlanDiscount className="text-gray-600 font-light" />

// asChild with primitive
<Order.PaidPlanDiscount asChild>
  <p className="text-sm text-gray-600 font-light" />
</Order.PaidPlanDiscount>

// asChild with react component
<Order.PaidPlanDiscount asChild>
  {React.forwardRef(({ value, currency, formattedValue, rate, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Paid Plan Discount ({rate}%)</span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.PaidPlanDiscount>
```

**Data Attributes**

- `data-testid="order-paid-plan-discount"` - Applied to paid plan discount element

---

### Order.CouponDiscount

Displays the order coupon discount. Only renders when there is a coupon discount.

**Props**

```tsx
interface CouponDiscountProps {
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
<Order.CouponDiscount className="text-gray-600 font-light" />

// asChild with primitive
<Order.CouponDiscount asChild>
  <p className="text-sm text-gray-600 font-light" />
</Order.CouponDiscount>

// asChild with react component
<Order.CouponDiscount asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Coupon Discount</span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.CouponDiscount>
```

**Data Attributes**

- `data-testid="order-coupon-discount"` - Applied to coupon discount element

---

### Order.Tax

Displays the order tax. Only renders when there is tax.

**Props**

```tsx
interface TaxProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
    rate: number;
    name: string;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<Order.Tax className="text-gray-600 font-light" />

// asChild with primitive
<Order.Tax asChild>
  <p className="text-sm text-gray-600 font-light" />
</Order.Tax>

// asChild with react component
<Order.Tax asChild>
  {React.forwardRef(({ value, currency, formattedValue, rate, name, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>
        {name} ({rate}%)
      </span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.Tax>
```

**Data Attributes**

- `data-testid="order-tax"` - Applied to tax element

---

### Order.Fee

Displays the order fee. Only renders when there is a fee.

**Props**

```tsx
interface FeeProps {
  asChild?: boolean;
  children?: AsChildChildren<{
    value: number;
    currency: string;
    formattedValue: string;
    rate: number;
  }>;
  className?: string;
  locale?: Intl.LocalesArgument;
}
```

**Example**

```tsx
// Default usage
<Order.Fee className="text-gray-600 font-light" />

// asChild with primitive
<Order.Fee asChild>
  <p className="text-sm text-gray-600 font-light" />
</Order.Fee>

// asChild with react component
<Order.Fee asChild>
  {React.forwardRef(({ value, currency, formattedValue, rate, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Service Fee ({rate}%)</span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.Fee>
```

**Data Attributes**

- `data-testid="order-fee"` - Applied to fee element

---

### Order.Total

Displays the order total amount. This represents the final amount to be paid including all fees and taxes.

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
<Order.Total className="text-xl font-light text-gray-700" />

// asChild with primitive
<Order.Total asChild>
  <p className="text-2xl font-bold text-gray-900" />
</Order.Total>

// asChild with react component
<Order.Total asChild>
  {React.forwardRef(({ value, currency, formattedValue, ...props }, ref) => (
    <div ref={ref} {...props}>
      <span>Total:</span>
      <span>{formattedValue}</span>
    </div>
  ))}
</Order.Total>
```

**Data Attributes**

- `data-testid="order-total"` - Applied to total element

---

## Data Attributes Summary

| Attribute                                     | Applied To                  | Purpose                    |
| --------------------------------------------- | --------------------------- | -------------------------- |
| `data-testid="order-number"`                  | Order.OrderNumber           | Order number element       |
| `data-testid="order-guest-email"`             | Order.GuestEmail            | Guest email element        |
| `data-testid="order-created-date"`            | Order.CreatedDate           | Created date element       |
| `data-testid="order-download-tickets-button"` | Order.DownloadTicketsButton | Download tickets button    |
| `data-testid="order-invoice-items"`           | Order.InvoiceItems          | Invoice items container    |
| `data-testid="order-subtotal"`                | Order.Subtotal              | Subtotal element           |
| `data-testid="order-paid-plan-discount"`      | Order.PaidPlanDiscount      | Paid plan discount element |
| `data-testid="order-coupon-discount"`         | Order.CouponDiscount        | Coupon discount element    |
| `data-testid="order-tax"`                     | Order.Tax                   | Tax element                |
| `data-testid="order-fee"`                     | Order.Fee                   | Fee element                |
| `data-testid="order-total"`                   | Order.Total                 | Total element              |
