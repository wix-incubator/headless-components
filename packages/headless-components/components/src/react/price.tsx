import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';

// ==========================================
// TestIds Enum
// ==========================================

enum TestIds {
  // Root container
  priceRoot = 'price-root',

  // Basic components
  priceRaw = 'price-raw',
  priceAmount = 'price-amount',
  priceCurrency = 'price-currency',
  priceSymbol = 'price-symbol',
  priceFormatted = 'price-formatted',

  // Sale components
  priceCompareAt = 'price-compare-at',
  priceDiscount = 'price-discount',
  priceDiscountPercentage = 'price-discount-percentage',

  // Range components
  priceMin = 'price-min',
  priceMax = 'price-max',
  priceRange = 'price-range',
}

// ==========================================
// Type Definitions
// ==========================================

interface Money {
  amount: number;
  currency: string;
  symbol: string;
  formatted?: string;
}

interface DiscountValue {
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
  discount?: DiscountValue;
  isOnSale?: boolean;
  locale?: string; // For formatting - defaults to 'en-US'
  precision?: number; // Decimal places - default 2
}

// ==========================================
// Context
// ==========================================

interface PriceContextValue {
  price: Price;
}

const PriceContext = React.createContext<PriceContextValue | null>(null);

function usePriceContext(): PriceContextValue {
  const context = React.useContext(PriceContext);
  if (!context) {
    throw new Error(
      'usePriceContext must be used within a Price.Root component',
    );
  }
  return context;
}

// ==========================================
// Range Context
// ==========================================

interface PriceRangeContextValue {
  minPrice: Money;
  maxPrice: Money;
  locale?: string;
  precision?: number;
}

const PriceRangeContext = React.createContext<PriceRangeContextValue | null>(
  null,
);

function usePriceRangeContext(): PriceRangeContextValue {
  const context = React.useContext(PriceRangeContext);
  if (!context) {
    throw new Error(
      'usePriceRangeContext must be used within a Price.Range component',
    );
  }
  return context;
}

// ==========================================
// Utility Functions
// ==========================================

function formatPrice(
  money: Money,
  locale: string = 'en-US',
  precision: number = 2,
): string {
  if (money.formatted) {
    return money.formatted;
  }

  const amount = money.amount / 100; // Assuming amount is in cents
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(amount);
}

function formatAmount(amount: number, precision: number = 2): string {
  const value = amount / 100; // Assuming amount is in cents
  return value.toFixed(precision);
}

// ==========================================
// Components
// ==========================================

// Price.Root Component Props
interface PriceRootProps {
  price: Price;
  children: React.ReactNode;
}

// Price.Root Component
export const Root = React.forwardRef<HTMLElement, PriceRootProps>(
  (props, ref) => {
    const { price, children } = props;

    const contextValue: PriceContextValue = {
      price,
    };

    const attributes = {
      'data-testid': TestIds.priceRoot,
      'data-on-sale': price.isOnSale ? 'true' : undefined,
      'data-currency': price.current.currency,
    };

    return (
      <PriceContext.Provider value={contextValue}>
        <AsChildSlot {...attributes} ref={ref}>
          {children}
        </AsChildSlot>
      </PriceContext.Provider>
    );
  },
);

Root.displayName = 'Price.Root';

// Price.Raw Component Props
interface PriceRawProps {
  children?: AsChildChildren<{
    price: Price;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Raw Component
export const Raw = React.forwardRef<HTMLElement, PriceRawProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ price }}
        data-testid={TestIds.priceRaw}
        className={className}
        content={null}
      >
        {price.current.formatted}
      </AsChildSlot>
    );
  },
);

Raw.displayName = 'Price.Raw';

// Price.Amount Component Props
interface PriceAmountProps {
  children?: AsChildChildren<{
    amount: number;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Amount Component
export const Amount = React.forwardRef<HTMLElement, PriceAmountProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();
    const precision = price.precision ?? 2;
    const formattedAmount = formatAmount(price.current.amount, precision);

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ amount: price.current.amount, precision }}
        data-testid={TestIds.priceAmount}
        className={className}
        content={formattedAmount}
      >
        <span>{formattedAmount}</span>
      </AsChildSlot>
    );
  },
);

Amount.displayName = 'Price.Amount';

// Price.Currency Component Props
interface PriceCurrencyProps {
  children?: AsChildChildren<{
    currency: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Currency Component
export const Currency = React.forwardRef<HTMLElement, PriceCurrencyProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ currency: price.current.currency }}
        data-testid={TestIds.priceCurrency}
        className={className}
        content={price.current.currency}
      >
        <span>{price.current.currency}</span>
      </AsChildSlot>
    );
  },
);

Currency.displayName = 'Price.Currency';

// Price.Symbol Component Props
interface PriceSymbolProps {
  children?: AsChildChildren<{
    symbol: string;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Symbol Component
export const Symbol = React.forwardRef<HTMLElement, PriceSymbolProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ symbol: price.current.symbol }}
        data-testid={TestIds.priceSymbol}
        className={className}
        content={price.current.symbol}
      >
        <span>{price.current.symbol}</span>
      </AsChildSlot>
    );
  },
);

Symbol.displayName = 'Price.Symbol';

// Price.Formatted Component Props
interface PriceFormattedProps {
  children?: AsChildChildren<{
    formattedPrice: string;
    price: Money;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Formatted Component
export const Formatted = React.forwardRef<HTMLElement, PriceFormattedProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();
    const locale = price.locale ?? 'en-US';
    const precision = price.precision ?? 2;
    const formattedPrice = formatPrice(price.current, locale, precision);

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{
          formattedPrice,
          price: price.current,
          locale,
          precision,
        }}
        data-testid={TestIds.priceFormatted}
        className={className}
        content={formattedPrice}
      >
        <span>{formattedPrice}</span>
      </AsChildSlot>
    );
  },
);

Formatted.displayName = 'Price.Formatted';

// Price.CompareAt Component Props
interface PriceCompareAtProps {
  children?: AsChildChildren<{
    compareAtPrice: Money;
    isOnSale?: boolean;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.CompareAt Component
export const CompareAt = React.forwardRef<HTMLElement, PriceCompareAtProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    const { price } = usePriceContext();

    // Only render if compareAt price exists
    if (!price.compareAt) return null;

    const contextValue: PriceContextValue = {
      price: { current: price.compareAt },
    };

    const locale = price.locale ?? 'en-US';
    const precision = price.precision ?? 2;
    const formattedCompareAt = formatPrice(price.compareAt, locale, precision);

    return (
      <PriceContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{
            compareAtPrice: price.compareAt,
            isOnSale: price.isOnSale,
            locale,
            precision,
          }}
          data-testid={TestIds.priceCompareAt}
          className={className}
          content={formattedCompareAt}
        >
          <span>{formattedCompareAt}</span>
        </AsChildSlot>
      </PriceContext.Provider>
    );
  },
);

CompareAt.displayName = 'Price.CompareAt';

// Price.Discount Component Props
interface PriceDiscountProps {
  children?: AsChildChildren<{
    discountAmount: Money;
    isOnSale?: boolean;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Discount Component
export const Discount = React.forwardRef<HTMLElement, PriceDiscountProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();

    // Only render if discount amount exists and item is on sale
    if (!price.discount?.amount || !price.isOnSale) return null;

    const locale = price.locale ?? 'en-US';
    const precision = price.precision ?? 2;
    const formattedDiscount = formatPrice(
      price.discount.amount,
      locale,
      precision,
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{
          discountAmount: price.discount.amount,
          isOnSale: price.isOnSale,
          locale,
          precision,
        }}
        data-testid={TestIds.priceDiscount}
        className={className}
        content={formattedDiscount}
      >
        <span>{formattedDiscount}</span>
      </AsChildSlot>
    );
  },
);

Discount.displayName = 'Price.Discount';

// Price.DiscountPercentage Component Props
interface PriceDiscountPercentageProps {
  children?: AsChildChildren<{
    discountPercentage: number;
    isOnSale?: boolean;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.DiscountPercentage Component
export const DiscountPercentage = React.forwardRef<
  HTMLElement,
  PriceDiscountPercentageProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { price } = usePriceContext();

  // Only render if discount percentage exists and item is on sale
  if (!price.discount?.percentage || !price.isOnSale) return null;

  const formattedPercentage = `${Math.round(price.discount.percentage)}%`;

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      customElement={children}
      customElementProps={{
        discountPercentage: price.discount.percentage,
        isOnSale: price.isOnSale,
      }}
      data-testid={TestIds.priceDiscountPercentage}
      className={className}
      content={formattedPercentage}
    >
      <span>{formattedPercentage}</span>
    </AsChildSlot>
  );
});

DiscountPercentage.displayName = 'Price.DiscountPercentage';

// Price.Min Component Props
interface PriceMinProps {
  children?: AsChildChildren<{
    minPrice: Money;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Min Component
export const Min = React.forwardRef<HTMLElement, PriceMinProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { minPrice, locale, precision } = usePriceRangeContext();

    // Only render if min price exists
    if (!minPrice) return null;

    const contextValue: PriceContextValue = {
      price: { current: minPrice },
    };

    const formattedMin = formatPrice(
      minPrice,
      locale ?? 'en-US',
      precision ?? 2,
    );

    return (
      <PriceContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{
            minPrice,
            locale,
            precision,
          }}
          data-testid={TestIds.priceMin}
          className={className}
          content={formattedMin}
        >
          <span>{formattedMin}</span>
        </AsChildSlot>
      </PriceContext.Provider>
    );
  },
);

Min.displayName = 'Price.Min';

// Price.Max Component Props
interface PriceMaxProps {
  children?: AsChildChildren<{
    maxPrice: Money;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Max Component
export const Max = React.forwardRef<HTMLElement, PriceMaxProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { maxPrice, locale, precision } = usePriceRangeContext();

    // Only render if max price exists
    if (!maxPrice) return null;

    const contextValue: PriceContextValue = {
      price: { current: maxPrice },
    };

    const formattedMax = formatPrice(
      maxPrice,
      locale ?? 'en-US',
      precision ?? 2,
    );

    return (
      <PriceContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{
            maxPrice,
            locale,
            precision,
          }}
          data-testid={TestIds.priceMax}
          className={className}
          content={formattedMax}
        >
          <span>{formattedMax}</span>
        </AsChildSlot>
      </PriceContext.Provider>
    );
  },
);

Max.displayName = 'Price.Max';

// Price.Range Component Props
interface PriceRangeProps {
  children?: AsChildChildren<{
    minPrice: Money;
    maxPrice: Money;
    locale?: string;
    precision?: number;
  }>;
  asChild?: boolean;
  className?: string;
}

// Price.Range Component
export const Range = React.forwardRef<HTMLElement, PriceRangeProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { price } = usePriceContext();

    // Only render if price range exists
    if (!price.range) return null;

    const locale = price.locale ?? 'en-US';
    const precision = price.precision ?? 2;
    const formattedMin = formatPrice(price.range.min, locale, precision);
    const formattedMax = formatPrice(price.range.max, locale, precision);
    const formattedRange = `${formattedMin} - ${formattedMax}`;

    const rangeContextValue: PriceRangeContextValue = {
      minPrice: price.range.min,
      maxPrice: price.range.max,
      locale,
      precision,
    };

    return (
      <PriceRangeContext.Provider value={rangeContextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          customElement={children}
          customElementProps={{
            minPrice: price.range.min,
            maxPrice: price.range.max,
            locale,
            precision,
          }}
          data-testid={TestIds.priceRange}
          className={className}
          content={null}
        >
          <span>{formattedRange}</span>
        </AsChildSlot>
      </PriceRangeContext.Provider>
    );
  },
);

Range.displayName = 'Price.Range';

// ==========================================
// Type Exports
// ==========================================

export type {
  Money,
  DiscountValue,
  PriceRange,
  Price,
  PriceContextValue,
  PriceRangeContextValue,
  PriceRootProps,
  PriceRawProps,
  PriceAmountProps,
  PriceCurrencyProps,
  PriceSymbolProps,
  PriceFormattedProps,
  PriceCompareAtProps,
  PriceDiscountProps,
  PriceDiscountPercentageProps,
  PriceMinProps,
  PriceMaxProps,
  PriceRangeProps,
};
