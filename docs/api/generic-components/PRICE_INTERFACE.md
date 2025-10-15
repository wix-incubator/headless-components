# Price Interface Documentation

A comprehensive generic price display component system built with composable primitives, similar to Radix UI architecture.

## Table of Contents

### Components

- [Price.Root](#priceroot)
- [Price.Raw](#priceraw)
- [Price.Amount](#priceamount)
- [Price.Currency](#pricecurrency)
- [Price.Symbol](#pricesymbol)
- [Price.Formatted](#priceformatted)
- [Price.CompareAt](#pricecompareat)
- [Price.Discount](#pricediscount)
- [Price.DiscountPercentage](#pricediscountpercentage)
- [Price.Min](#pricemin)
- [Price.Max](#pricemax)
- [Price.Range](#pricerange)

---

## Architecture

The Price component follows a compound component pattern where each part can be composed together to create flexible price displays for various contexts including products, services, subscriptions, and more.

## Components

### Price.Root

The root container that provides price context to all child components.

**Props**

```tsx
interface Money {
  amount: number;
  currency: string;
  symbol: string;
  formatted?: string;
}

interface Discount {
  amount?: Money;
  percentage?: number;
}

interface PriceRange {
  min: Money;
  max: Money;
}

interface Price {
  current: Money;
  compareAt?: Money;
  range?: PriceRange;
  discount?: Discount;
  isOnSale?: boolean;
  locale?: string; // For formatting - defaults to 'en-US'
  precision?: number; // Decimal places - default 2
}

interface PriceRootProps {
  price: Price;
  children: React.ReactNode;
}
```

**Data Attributes**

- `data-testid="price-root"` - Applied to root container
- `data-on-sale` - Is price discounted
- `data-currency` - Currency code (e.g., "USD", "EUR")

**Example**

```tsx
<Price.Root
  price={{
    current: { amount: 2999, currency: 'USD', symbol: '$' },
  }}
>
  <Price.Formatted />
</Price.Root>
```

---

### Price.Raw

Provides direct access to the price context data.

**Props**

```tsx
interface PriceRawProps {
  children: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      price: Price;
    }
  >;
  asChild?: boolean;
  className?: string;
}
```

**Example**

```tsx
<Price.Raw asChild>
  {React.forwardRef(({ price, ...props }, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold">
      {price.current.formatted}
    </span>
  ))}
</Price.Raw>
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
          precision?: number;
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

Displays the currency code.

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

### Price.Symbol

Displays the currency symbol.

**Props**

```tsx
interface PriceSymbolProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          symbol: string;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-symbol"` - Applied to symbol element

**Example**

```tsx
// Default usage
<Price.Symbol className="text-xl font-bold" />

// Custom rendering with forwardRef
<Price.Symbol asChild>
  {React.forwardRef(({symbol, ...props}, ref) => (
    <span ref={ref} {...props} className="text-xl font-bold text-primary">
      {symbol}
    </span>
  ))}
</Price.Symbol>
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
          price: Money;
          locale?: string;
          precision?: number;
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

### Price.CompareAt

Displays the original price when item is on sale. Only renders when compareAtPrice is provided.

**Props**

```tsx
interface PriceCompareAtProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          compareAtPrice: Money;
          isOnSale?: boolean;
          locale?: string;
          precision?: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-compare-at"` - Applied to compare price element

**Example**

```tsx
// Default usage
<Price.CompareAt className="text-lg line-through text-secondary-foreground" />

// Custom usage
<Price.CompareAt asChild>
  <div className="flex items-center gap-2">
    <Price.Amount />
    <Price.Symbol />
  </div>
</Price.CompareAt>

// Custom rendering with forwardRef
<Price.CompareAt asChild>
  {React.forwardRef(({compareAtPrice, ...props}, ref) => (
    <span ref={ref} {...props} className="text-2xl font-bold text-foreground">
      {compareAtPrice.formatted}
    </span>
  ))}
</Price.CompareAt>
```

---

### Price.Discount

Displays the discount amount. Only renders when item is on sale.

**Props**

```tsx
interface PriceDiscountProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          discountAmount: Money;
          isOnSale?: boolean;
          locale?: string;
          precision?: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-discount"` - Applied to discount element

**Example**

```tsx
// Default usage
<Price.Discount className="text-sm text-green-500" />

// Custom rendering with forwardRef
<Price.Discount asChild>
  {React.forwardRef(({discountAmount, ...props}, ref) => (
    <span ref={ref} {...props} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
      Save {discountAmount.formatted}
    </span>
  ))}
</Price.Discount>
```

---

### Price.DiscountPercentage

Displays the discount as a percentage. Only renders when item is on sale.

**Props**

```tsx
interface PriceDiscountPercentageProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          discountPercentage: number;
          isOnSale?: boolean;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-discount-percentage"` - Applied to discount percentage element

**Example**

```tsx
// Default usage
<Price.DiscountPercentage className="text-sm text-green-500" />

// Custom rendering with forwardRef
<Price.DiscountPercentage asChild>
  {React.forwardRef(({discountPercentage, ...props}, ref) => (
    <div ref={ref} {...props} className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-sm font-bold">
      -{Math.round(discountPercentage)}%
    </div>
  ))}
</Price.DiscountPercentage>
```

---

### Price.Min

Displays the min price.

**Props**

```tsx
interface MinPriceProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          minPrice: Money;
          locale?: string;
          precision?: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-min"` - Applied to min price element

**Example**

```tsx
// Default usage
<Price.Min className="text-sm text-green-500" />

// Custom usage
<Price.Min asChild>
  <div className="flex items-center gap-2">
      <Price.Amount />
      <Price.Symbol />
  </div>
</Price.Min>

// Custom rendering with forwardRef
<Price.Min asChild>
  {React.forwardRef(({minPrice, ...props}, ref) => (
    <div ref={ref} {...props} className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-sm font-bold">
      {minPrice.formatted}
    </div>
  ))}
</Price.Min>
```

---

### Price.Max

Displays the max price.

**Props**

```tsx
interface MaxPriceProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          maxPrice: Money;
          locale?: string;
          precision?: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-max"` - Applied to max price element

**Example**

```tsx
// Default usage
<Price.Max className="text-sm text-green-500" />

// Custom usage
<Price.Max asChild>
  <div className="flex items-center gap-2">
    <Price.Amount />
    <Price.Symbol />
  </div>
</Price.Max>

// Custom rendering with forwardRef
<Price.Max asChild>
  {React.forwardRef(({maxPrice, ...props}, ref) => (
    <div ref={ref} {...props} className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-sm font-bold">
      {maxPrice.formatted}
    </div>
  ))}
</Price.Max>
```

---

### Price.Range

Displays the price range.

**Props**

```tsx
interface PriceRangeProps {
  children:
    | React.ReactNode
    | React.ForwardRefRenderFunction<
        HTMLElement,
        {
          minPrice: Money;
          maxPrice: Money;
          locale?: string;
          precision?: number;
        }
      >;
  asChild?: boolean;
  className?: string;
}
```

**Data Attributes**

- `data-testid="price-range"` - Applied to price range element

**Example**

```tsx
// Default usage
<Price.Range className="text-lg font-semibold text-foreground" />

// Custom usage
<Price.Range asChild>
  <div className="flex items-center gap-2">
    <Price.Min /> to <Price.Max />
  </div>
</Price.Range>

// Custom rendering with forwardRef
<Price.Range asChild>
  {React.forwardRef(({minPrice, maxPrice, ...props}, ref) => (
    <div ref={ref} {...props} className="bg-destructive text-destructive-foreground px-2 py-1 rounded-lg text-sm font-bold">
      {minPrice.formatted} to {maxPrice.formatted}
    </div>
  ))}
</Price.Range>
```

---

## Usage Examples

### Basic Price Display

```tsx
function BasicPrice() {
  const price = {
    current: { amount: 2999, currency: 'USD', symbol: '$' },
    isOnSale: false,
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

### Sale Price with Comparison

```tsx
function SalePrice() {
  const price = {
    current: { amount: 1999, currency: 'USD', symbol: '$' },
    compareAt: { amount: 2999, currency: 'USD', symbol: '$' },
    discount: {
      amount: { amount: 1000, currency: 'USD', symbol: '$' },
      percentage: 33.3,
    },
    isOnSale: true,
    locale: 'en-US',
    precision: 2,
  };

  return (
    <Price.Root price={price}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Price.Formatted className="text-2xl font-bold text-foreground" />
          <Price.CompareAt className="text-lg line-through text-secondary-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Price.Discount className="text-sm text-green-600" />
          <Price.DiscountPercentage className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold" />
        </div>
      </div>
    </Price.Root>
  );
}
```

### Subscription Pricing

```tsx
function SubscriptionPrice() {
  const monthlyPrice = { amount: 999, currency: 'USD' };
  const yearlyPrice = { amount: 9990, currency: 'USD' };
  const yearlyMonthlyEquivalent = { amount: 832, currency: 'USD' };

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

        <Price.Root price={yearlyMonthlyEquivalent}>
          <h4 className="text-sm font-medium text-secondary-foreground mb-2">
            Yearly Plan
          </h4>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <Price.Formatted className="text-3xl font-bold text-foreground" />
              <Price.CompareAt className="text-lg line-through text-secondary-foreground" />
              <span className="text-sm text-secondary-foreground">/month</span>
            </div>
            <Price.DiscountPercentage className="text-sm text-green-600" />
            <p className="text-xs text-secondary-foreground">
              Billed annually at{' '}
              <Price.Root price={yearlyPrice}>
                <Price.Formatted className="font-semibold" />
              </Price.Root>
            </p>
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
function ProductGrid({ products, userCurrency = 'USD' }) {
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
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Price.Formatted className="text-xl font-bold text-foreground" />
                <Price.CompareAt className="text-sm line-through text-secondary-foreground" />
              </div>
              <Price.DiscountPercentage className="text-sm text-green-600" />
            </div>
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
  const price = { amount: 123456, currency: 'EUR' };

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

### Price Range Component

```tsx
function PriceRange({ productWithRange }) {
  const price = {
    current: { amount: 0, currency: 'USD', symbol: '$' }, // Not used for range
    range: {
      min: { amount: 1999, currency: 'USD', symbol: '$' },
      max: { amount: 4999, currency: 'USD', symbol: '$' },
    },
  };

  const isSamePrice = price.range.min.amount === price.range.max.amount;

  if (isSamePrice) {
    return (
      <Price.Root price={price}>
        <Price.Min className="text-lg font-semibold text-foreground" />
      </Price.Root>
    );
  }

  return (
    <Price.Root price={price}>
      <div className="flex items-center gap-2">
        <Price.Min className="text-lg font-semibold text-foreground" />
        <span className="text-secondary-foreground">–</span>
        <Price.Max className="text-lg font-semibold text-foreground" />
      </div>
    </Price.Root>
  );
}
```

### Complete Product Card with All Price Types

```tsx
function ProductCard({ product }) {
  const price = {
    current: { amount: 2499, currency: 'USD', symbol: '$' },
    compareAt: { amount: 3499, currency: 'USD', symbol: '$' },
    range: {
      min: { amount: 1999, currency: 'USD', symbol: '$' },
      max: { amount: 4999, currency: 'USD', symbol: '$' },
    },
    discount: {
      amount: { amount: 1000, currency: 'USD', symbol: '$' },
      percentage: 28.6,
    },
    isOnSale: true,
    locale: 'en-US',
    precision: 2,
  };

  return (
    <div className="border border-background rounded-lg p-6">
      <Price.Root price={price}>
        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {product.name}
            </h3>
            <p className="text-sm text-secondary-foreground">Starting at</p>
          </div>

          {/* Current Price with Sale Comparison */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Price.Formatted className="text-3xl font-bold text-foreground" />
              <Price.CompareAt className="text-xl line-through text-secondary-foreground" />
            </div>

            <div className="flex items-center gap-2">
              <Price.Discount className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full" />
              <Price.DiscountPercentage className="text-sm text-destructive-foreground bg-destructive px-2 py-1 rounded-full font-bold" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <p className="text-sm text-secondary-foreground mb-1">
              Full range:
            </p>
            <Price.Range className="text-lg text-foreground" />
          </div>

          {/* Individual Components */}
          <div className="grid grid-cols-3 gap-2 text-sm text-secondary-foreground">
            <div>
              <p>Currency:</p>
              <Price.Currency className="font-mono" />
            </div>
            <div>
              <p>Symbol:</p>
              <Price.Symbol className="font-bold" />
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
  );
}
```

### Raw Price Data Access

```tsx
function CustomPriceDisplay() {
  const price = {
    current: { amount: 1299, currency: 'USD', symbol: '$' },
    compareAt: { amount: 1599, currency: 'USD', symbol: '$' },
    discount: {
      amount: { amount: 300, currency: 'USD', symbol: '$' },
      percentage: 18.75,
    },
    isOnSale: true,
  };

  return (
    <Price.Root price={price}>
      <Price.Raw asChild>
        {React.forwardRef(({ price }, ref) => (
          <div ref={ref} className="bg-background border rounded-lg p-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Price Analysis</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-foreground">Current:</p>
                  <p className="font-mono">
                    {price.current.formatted ||
                      `${price.current.symbol}${(price.current.amount / 100).toFixed(2)}`}
                  </p>
                </div>

                <div>
                  <p className="text-secondary-foreground">Original:</p>
                  <p className="font-mono">
                    {price.compareAt?.formatted ||
                      `${price.compareAt?.symbol}${(price.compareAt?.amount / 100).toFixed(2)}`}
                  </p>
                </div>

                <div>
                  <p className="text-secondary-foreground">You Save:</p>
                  <p className="font-mono text-green-600">
                    {price.discount?.amount.formatted ||
                      `${price.discount?.amount.symbol}${(price.discount?.amount.amount / 100).toFixed(2)}`}
                  </p>
                </div>

                <div>
                  <p className="text-secondary-foreground">Discount:</p>
                  <p className="font-mono text-green-600">
                    {price.discount?.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-secondary-foreground">
                  Currency: {price.current.currency} | On Sale:{' '}
                  {price.isOnSale ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </Price.Raw>
    </Price.Root>
  );
}
```
