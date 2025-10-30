# Price Interface Documentation

A comprehensive generic price display component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

### Components

- [Price.Root](#priceroot)
- [Price.Amount](#priceamount)
- [Price.Currency](#pricecurrency)
- [Price.Formatted](#priceformatted)

---

## Architecture

The Price component follows a compound component pattern where each part can be composed together to create flexible price displays for various contexts including products, services, subscriptions, and more.

## Components

### Price.Root

The root container that provides price context to all child components.

**Props**

```tsx
type CurrencyDisplay = 'code' | 'symbol' | 'narrowSymbol' | 'name';
type CurrencySign = 'standard' | 'accounting';

interface Money {
  amount: number;
  currency?: string;
}

interface Price {
  money: Money;
  locale?: string; // For formatting - defaults to 'en-US'
  precision?: number; // Decimal places - default 2
  currencyDisplay?: CurrencyDisplay; // How to display the currency in currency formatting
  currencySign?: CurrencySign; // accounting format means to wrap the number with parentheses instead of appending a minus sign
}

interface PriceRootProps {
  price: Price;
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="price-root"` - Applied to root container
- `data-currency` - Currency code (e.g., "USD", "EUR")

**Example**

```tsx
<Price.Root
  price={{
    money: { amount: 2999, currency: 'USD' },
  }}
>
  <Price.Formatted />
</Price.Root>
```

---

### Price.Amount

Displays the raw price amount without currency formatting.

**Props**

```tsx
interface PriceAmountProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          amount: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-amount"` - Applied to amount element

**Example**

```tsx
// Default usage
<Price.Amount className="text-2xl font-bold" />

// Custom rendering with forwardRef
<Price.Amount asChild>
  {React.forwardRef(({amount, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold">
      {amount.toLocaleString()}
    </span>
  ))}
</Price.Amount>
```

---

### Price.Currency

Displays the currency.

**Props**

```tsx
interface PriceCurrencyProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          currency: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-currency"` - Applied to currency element

**Example**

```tsx
// Default usage
<Price.Currency className="text-sm text-content-muted ml-1" />

// Custom rendering with forwardRef
<Price.Currency asChild>
  {React.forwardRef(({currency, ...props}, ref) => (
    <span ref={ref} {...props} title={getCurrencyName(currency)} className="text-sm text-content-muted">
      {currency}
    </span>
  ))}
</Price.Currency>
```

---

### Price.Formatted

Displays the fully formatted price with currency symbol and proper localization.

**Props**

```tsx
interface PriceFormattedProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          formattedPrice: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-formatted"` - Applied to formatted price element

**Example**

```tsx
// Default usage
<Price.Formatted className="text-2xl font-bold text-foreground" />

// Compare at price
<Price.Formatted className="text-lg line-through text-secondary-foreground" />

// Custom rendering with forwardRef
<Price.Formatted asChild>
  {React.forwardRef(({formattedPrice, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold text-foreground">
      {formattedPrice}
    </span>
  ))}
</Price.Formatted>
```

---

## Usage Examples

### Basic Price Display

```tsx
function BasicPrice() {
  const price = {
    money: { amount: 2999, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  return (
    <Price.Root price={price}>
      <div className="flex items-center gap-2">
        <Price.Formatted className="text-2xl font-bold text-foreground" />
      </div>
    </Price.Root>
  );
}
```

### Price with Separate Amount and Currency

```tsx
function SeparateAmountCurrency() {
  const price = {
    money: { amount: 1999, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  return (
    <Price.Root price={price}>
      <div className="flex items-center gap-2">
        <Price.Amount className="text-2xl font-bold text-foreground" />
        <Price.Currency className="text-lg text-secondary-foreground" />
      </div>
    </Price.Root>
  );
}
```

### Subscription Pricing

```tsx
function SubscriptionPrice() {
  const monthlyPrice = {
    money: { amount: 999, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  const yearlyPrice = {
    money: { amount: 9990, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Monthly Plan */}
      <div className="border border-background rounded-lg p-6">
        <Price.Root price={monthlyPrice}>
          <h4 className="text-sm font-medium text-secondary-foreground mb-2">
            Monthly Plan
          </h4>
          <div className="flex items-baseline gap-1">
            <Price.Formatted className="text-3xl font-bold text-foreground" />
            <span className="text-sm text-secondary-foreground">/month</span>
          </div>
        </Price.Root>
      </div>

      {/* Yearly Plan */}
      <div className="border-2 border-primary rounded-lg p-6 relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
            MOST POPULAR
          </span>
        </div>

        <Price.Root price={yearlyPrice}>
          <h4 className="text-sm font-medium text-secondary-foreground mb-2">
            Yearly Plan
          </h4>
          <div className="flex items-baseline gap-1">
            <Price.Formatted className="text-3xl font-bold text-foreground" />
            <span className="text-sm text-secondary-foreground">/year</span>
          </div>
        </Price.Root>

        <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```

### Multi-Currency Product Grid

```tsx
function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="border border-background rounded-lg p-4"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

          <Price.Root price={product.price}>
            <Price.Formatted className="text-xl font-bold text-foreground" />
          </Price.Root>

          <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Custom Price Components with Advanced Formatting

```tsx
function CustomPriceDisplay() {
  const price = {
    money: { amount: 123456, currency: 'EUR' },
    locale: 'de-DE',
    precision: 2,
    currencyDisplay: 'name',
  };

  return (
    <Price.Root price={price}>
      {/* Custom formatted display */}
      <Price.Formatted asChild>
        {React.forwardRef(({ formattedPrice, ...props }, ref) => (
          <div
            ref={ref}
            {...props}
            className="bg-background border border-background rounded-lg p-4"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {formattedPrice}
              </div>
              <Price.Currency asChild>
                {React.forwardRef(({ currency, ...props }, ref) => (
                  <div
                    ref={ref}
                    {...props}
                    className="text-sm text-secondary-foreground"
                  >
                    Prices in {currency}
                  </div>
                ))}
              </Price.Currency>
            </div>
          </div>
        ))}
      </Price.Formatted>
    </Price.Root>
  );
}
```

### Different Currency Display Options

```tsx
function CurrencyDisplayOptions() {
  const price = {
    money: { amount: 2999, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  return (
    <div className="space-y-4">
      {/* Symbol (default) */}
      <Price.Root price={{ ...price, currencyDisplay: 'symbol' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-foreground">Symbol:</span>
          <Price.Formatted className="font-semibold" />
        </div>
      </Price.Root>

      {/* Code */}
      <Price.Root price={{ ...price, currencyDisplay: 'code' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-foreground">Code:</span>
          <Price.Formatted className="font-semibold" />
        </div>
      </Price.Root>

      {/* Name */}
      <Price.Root price={{ ...price, currencyDisplay: 'name' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-foreground">Name:</span>
          <Price.Formatted className="font-semibold" />
        </div>
      </Price.Root>

      {/* Narrow Symbol */}
      <Price.Root price={{ ...price, currencyDisplay: 'narrowSymbol' }}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-secondary-foreground">Narrow:</span>
          <Price.Formatted className="font-semibold" />
        </div>
      </Price.Root>
    </div>
  );
}
```

### Product Card with Custom Amount Formatting

```tsx
function ProductCard({ product }) {
  const price = {
    money: { amount: 2499, currency: 'USD' },
    locale: 'en-US',
    precision: 2,
  };

  return (
    <div className="border border-background rounded-lg p-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {product.name}
        </h3>

        <Price.Root price={price}>
          <div className="space-y-2">
            {/* Formatted price */}
            <Price.Formatted className="text-3xl font-bold text-foreground" />

            {/* Individual components */}
            <div className="grid grid-cols-2 gap-2 text-sm text-secondary-foreground">
              <div>
                <p>Currency:</p>
                <Price.Currency className="font-mono" />
              </div>
              <div>
                <p>Amount:</p>
                <Price.Amount className="font-mono" />
              </div>
            </div>
          </div>
        </Price.Root>

        <button className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
```
