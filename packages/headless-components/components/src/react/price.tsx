import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import {
  CurrencyService,
  CurrencyServiceDefinition,
} from '../services/currency-service.js';

// ==========================================
// TestIds Enum
// ==========================================

enum TestIds {
  // Root container
  priceRoot = 'price-root',

  // Basic components
  priceAmount = 'price-amount',
  priceCurrency = 'price-currency',
  priceFormatted = 'price-formatted',
}

// ==========================================
// Type Definitions
// ==========================================

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
// Utility Functions
// ==========================================

function createPriceFormatter(
  currency: string = 'USD',
  locale: string = 'en-US',
  precision?: number,
  currencyDisplay?: CurrencyDisplay,
  currencySign?: CurrencySign,
): ReturnType<typeof Intl.NumberFormat> {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    currencyDisplay,
    currencySign,
  });
}

function formatPrice(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  precision: number,
  currencyDisplay: CurrencyDisplay,
  currencySign: CurrencySign,
): string {
  return createPriceFormatter(
    currency,
    locale,
    precision,
    currencyDisplay,
    currencySign,
  ).format(amount);
}

function formatAmount(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
  precision?: number,
): string {
  const formatter = createPriceFormatter(currency, locale, precision);

  const parts = formatter
    ?.formatToParts(amount)
    ?.reduce((parts, { type, value }) => {
      parts[type] = value;

      return parts;
    }, {} as any);

  return `${parts['integer'] ?? ''}${parts['decimal'] ?? ''}${parts['fraction'] ?? ''}`;
}

function formatCurrency(
  currency: string = 'USD',
  locale: string = 'en-US',
  currencyDisplay: CurrencyDisplay,
  currencySign: CurrencySign,
): string {
  const formatter = createPriceFormatter(
    currency,
    locale,
    undefined,
    currencyDisplay,
    currencySign,
  );

  const parts = formatter
    ?.formatToParts(0)
    ?.reduce((parts, { type, value }) => {
      parts[type] = value;

      return parts;
    }, {} as any);

  return `${parts['currency'] ?? ''}`;
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
      'data-currency': price.money.currency,
    };

    const currencyServiceConfig = {
      defaultCurrency: 'USD',
      defaultLocale: 'en-US',
    };

    return (
      <WixServices
        servicesMap={createServicesMap().addService(
          CurrencyServiceDefinition,
          CurrencyService,
          currencyServiceConfig,
        )}
      >
        <PriceContext.Provider value={contextValue}>
          <AsChildSlot {...attributes} ref={ref}>
            {children}
          </AsChildSlot>
        </PriceContext.Provider>
      </WixServices>
    );
  },
);

Root.displayName = 'Price.Root';

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
    const precision = price.precision;
    const { currency, locale } = useService(CurrencyServiceDefinition);

    const formattedAmount = formatAmount(
      price.money.amount,
      price.money.currency ?? currency.get(),
      price.locale ?? locale.get(),
      precision,
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ amount: formattedAmount }}
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
    const { currency, locale } = useService(CurrencyServiceDefinition);

    const formattedCurrency = formatCurrency(
      price.money.currency ?? currency.get(),
      price.locale ?? locale.get(),
      price.currencyDisplay ?? 'symbol',
      price.currencySign ?? 'standard',
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{ currency: formattedCurrency }}
        data-testid={TestIds.priceCurrency}
        className={className}
        content={formattedCurrency}
      >
        <span>{formattedCurrency}</span>
      </AsChildSlot>
    );
  },
);

Currency.displayName = 'Price.Currency';

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
    const { currency, locale } = useService(CurrencyServiceDefinition);

    const formattedPrice = formatPrice(
      price.money.amount,
      price.money.currency ?? currency.get(),
      price.locale ?? locale.get(),
      price.precision ?? 2,
      price.currencyDisplay ?? 'symbol',
      price.currencySign ?? 'standard',
    );

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={{
          formattedPrice,
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

// ==========================================
// Type Exports
// ==========================================

export type {
  CurrencyDisplay,
  CurrencySign,
  Money,
  Price,
  PriceContextValue,
  PriceRootProps,
  PriceAmountProps,
  PriceCurrencyProps,
  PriceFormattedProps,
};
