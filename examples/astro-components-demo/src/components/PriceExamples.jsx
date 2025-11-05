import React from 'react';
import { Price } from '@wix/headless-components';

// Sample data for different price scenarios
const samplePrices = {
  regular: {
    money: {
      amount: 29.99,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
  },

  discounted: {
    money: {
      amount: 19.99,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
  },

  originalPrice: {
    money: {
      amount: 29.99,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
  },

  lowPrice: {
    money: {
      amount: 15.0,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
  },

  highPrice: {
    money: {
      amount: 45.0,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
  },

  euroPrice: {
    money: {
      amount: 25.5,
      currency: 'EUR',
    },
    locale: 'de-DE',
    precision: 2,
  },

  yen: {
    money: {
      amount: 2999,
      currency: 'JPY',
    },
    locale: 'ja-JP',
    precision: 0,
  },

  accounting: {
    money: {
      amount: -50.0,
      currency: 'USD',
    },
    locale: 'en-US',
    precision: 2,
    currencySign: 'accounting',
  },
};

function CodeBlock({ children }) {
  return (
    <pre className="bg-secondary text-secondary-foreground p-4 rounded-lg text-sm overflow-x-auto font-paragraph">
      <code>{children}</code>
    </pre>
  );
}

function ExampleSection({ title, description, price, children, code }) {
  return (
    <div className="mb-12 border-b border-foreground pb-8 last:border-b-0">
      <div className="mb-6">
        <h3 className="text-2xl font-heading text-foreground mb-2">{title}</h3>
        <p className="text-secondary-foreground font-paragraph">
          {description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Result:</h4>
          <div className="bg-background border border-foreground rounded-lg p-6">
            <Price.Root price={price}>{children}</Price.Root>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-heading text-foreground mb-4">Code:</h4>
          <CodeBlock>{code}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

function PriceExamples() {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading text-foreground mb-4">
            Price Component Examples
          </h2>
          <p className="text-lg text-secondary-foreground font-paragraph">
            Explore different ways to use the Price component for various
            scenarios
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic Price Display */}
          <ExampleSection
            title="Basic Price Display"
            description="Simple price display using the formatted price"
            price={samplePrices.regular}
            code={`const regularPrice = {
  money: {
    amount: 29.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={regularPrice}>
  <Price.Formatted className="text-2xl font-heading text-foreground" />
</Price.Root>`}
          >
            <Price.Formatted className="text-2xl font-heading text-foreground" />
          </ExampleSection>

          {/* Detailed Price Breakdown */}
          <ExampleSection
            title="Detailed Price Breakdown"
            description="Display individual price components separately"
            price={samplePrices.regular}
            code={`const regularPrice = {
  money: {
    amount: 29.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

<Price.Root price={regularPrice}>
  <div className="flex items-center gap-2">
    <span className="flex items-center">
      <Price.Currency className="text-xl font-paragraph" />
      <Price.Amount className="text-xl font-heading text-foreground" />
    </span>
    <span className="text-sm text-secondary-foreground font-paragraph">USD</span>
  </div>
</Price.Root>`}
          >
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <Price.Currency className="text-xl font-paragraph" />
                <Price.Amount className="text-xl font-heading text-foreground" />
              </span>
              <span className="text-sm text-secondary-foreground font-paragraph">
                USD
              </span>
            </div>
          </ExampleSection>

          {/* Sale Price Comparison */}
          <ExampleSection
            title="Sale Price Comparison"
            description="Compare sale price with original price using multiple Price components"
            price={samplePrices.discounted}
            code={`const salePrice = {
  money: {
    amount: 19.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

const originalPrice = {
  money: {
    amount: 29.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

<div className="flex items-center gap-3">
  <Price.Root price={salePrice}>
    <Price.Formatted className="text-2xl font-heading text-green-500" />
  </Price.Root>
  <Price.Root price={originalPrice}>
    <Price.Formatted className="text-lg line-through text-secondary-foreground font-paragraph" />
  </Price.Root>
  <div className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph">
    33% OFF
  </div>
</div>`}
          >
            <div className="flex items-center gap-3">
              <Price.Root price={samplePrices.discounted}>
                <Price.Formatted className="text-2xl font-heading text-green-500" />
              </Price.Root>
              <Price.Root price={samplePrices.originalPrice}>
                <Price.Formatted className="text-lg line-through text-secondary-foreground font-paragraph" />
              </Price.Root>
              <div className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph">
                33% OFF
              </div>
            </div>
          </ExampleSection>

          {/* Price Range Display */}
          <ExampleSection
            title="Price Range Display"
            description="Show price ranges with minimum and maximum values using multiple Price components"
            price={samplePrices.lowPrice}
            code={`const lowPrice = {
  money: {
    amount: 15.00,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

const highPrice = {
  money: {
    amount: 45.00,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

<div className="flex items-center gap-2">
  <Price.Root price={lowPrice}>
    <Price.Formatted className="font-heading text-foreground" />
  </Price.Root>
  <span className="text-foreground font-paragraph">-</span>
  <Price.Root price={highPrice}>
    <Price.Formatted className="font-heading text-foreground" />
  </Price.Root>
</div>`}
          >
            <div className="flex items-center gap-2">
              <Price.Root price={samplePrices.lowPrice}>
                <Price.Formatted className="font-heading text-foreground" />
              </Price.Root>
              <span className="text-foreground font-paragraph">-</span>
              <Price.Root price={samplePrices.highPrice}>
                <Price.Formatted className="font-heading text-foreground" />
              </Price.Root>
            </div>
          </ExampleSection>

          {/* International Currency */}
          <ExampleSection
            title="International Currency"
            description="Price display with European formatting and currency"
            price={samplePrices.euroPrice}
            code={`const euroPrice = {
  money: {
    amount: 25.50,
    currency: 'EUR',
  },
  locale: 'de-DE',
  precision: 2,
};

<Price.Root price={euroPrice}>
  <div className="text-center">
    <Price.Formatted className="text-3xl font-heading text-foreground" />
    <div className="mt-1 text-sm text-secondary-foreground font-paragraph">
      Formatted for German locale (de-DE)
    </div>
  </div>
</Price.Root>`}
          >
            <div className="text-center">
              <Price.Formatted className="text-3xl font-heading text-foreground" />
              <div className="mt-1 text-sm text-secondary-foreground font-paragraph">
                Formatted for German locale (de-DE)
              </div>
            </div>
          </ExampleSection>

          {/* Product Card Example */}
          <ExampleSection
            title="Product Card Example"
            description="Complete product card with price on sale"
            price={samplePrices.discounted}
            code={`const salePrice = {
  money: {
    amount: 19.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

const originalPrice = {
  money: {
    amount: 29.99,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
};

<div className="border border-foreground rounded-lg p-4 max-w-sm bg-background">
  <div className="h-32 bg-secondary rounded mb-4"></div>
  <h3 className="font-heading text-lg text-foreground mb-2">Sample Product</h3>
  <div className="flex justify-between items-end">
    <div>
      <Price.Root price={salePrice}>
        <Price.Formatted className="text-2xl font-heading text-green-500" />
      </Price.Root>
      <Price.Root price={originalPrice}>
        <Price.Formatted className="text-sm line-through text-secondary-foreground block font-paragraph" />
      </Price.Root>
    </div>
    <span className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph">
      33% OFF
    </span>
  </div>
</div>`}
          >
            <div className="border border-foreground rounded-lg p-4 max-w-sm bg-background">
              <div className="h-32 bg-secondary rounded mb-4"></div>
              <h3 className="font-heading text-lg text-foreground mb-2">
                Sample Product
              </h3>
              <div className="flex justify-between items-end">
                <div>
                  <Price.Root price={samplePrices.discounted}>
                    <Price.Formatted className="text-2xl font-heading text-green-500" />
                  </Price.Root>
                  <Price.Root price={samplePrices.originalPrice}>
                    <Price.Formatted className="text-sm line-through text-secondary-foreground block font-paragraph" />
                  </Price.Root>
                </div>
                <span className="bg-destructive text-primary-foreground px-2 py-1 rounded text-sm font-paragraph">
                  33% OFF
                </span>
              </div>
            </div>
          </ExampleSection>
        </div>

        {/* Add more examples with new features */}
        <div className="space-y-12">
          {/* Japanese Yen Example */}
          <ExampleSection
            title="Japanese Yen (No Decimals)"
            description="Currency with zero precision formatting"
            price={samplePrices.yen}
            code={`const yenPrice = {
  money: {
    amount: 2999,
    currency: 'JPY',
  },
  locale: 'ja-JP',
  precision: 0, // No decimal places for Yen
};

<Price.Root price={yenPrice}>
  <div className="text-center">
    <Price.Formatted className="text-3xl font-heading text-foreground" />
    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-secondary-foreground font-paragraph">Amount: </span>
        <Price.Amount className="font-heading" />
      </div>
      <div>
        <span className="text-secondary-foreground font-paragraph">Symbol: </span>
        <Price.Currency className="font-heading" />
      </div>
    </div>
  </div>
</Price.Root>`}
          >
            <div className="text-center">
              <Price.Formatted className="text-3xl font-heading text-foreground" />
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-secondary-foreground font-paragraph">
                    Amount:{' '}
                  </span>
                  <Price.Amount className="font-heading" />
                </div>
                <div>
                  <span className="text-secondary-foreground font-paragraph">
                    Symbol:{' '}
                  </span>
                  <Price.Currency className="font-heading" />
                </div>
              </div>
            </div>
          </ExampleSection>

          {/* Accounting Format Example */}
          <ExampleSection
            title="Accounting Format (Negative)"
            description="Negative prices with accounting format (parentheses instead of minus)"
            price={samplePrices.accounting}
            code={`const accountingPrice = {
  money: {
    amount: -50.00,
    currency: 'USD',
  },
  locale: 'en-US',
  precision: 2,
  currencySign: 'accounting', // Use parentheses for negative values
};

<Price.Root price={accountingPrice}>
  <div className="text-center">
    <Price.Formatted className="text-2xl font-heading text-destructive" />
    <div className="mt-1 text-sm text-secondary-foreground font-paragraph">
      Accounting format uses parentheses for negative values
    </div>
  </div>
</Price.Root>`}
          >
            <div className="text-center">
              <Price.Formatted className="text-2xl font-heading text-destructive" />
              <div className="mt-1 text-sm text-secondary-foreground font-paragraph">
                Accounting format uses parentheses for negative values
              </div>
            </div>
          </ExampleSection>
        </div>

        {/* API Reference */}
        <div className="mt-16 p-8 bg-secondary rounded-lg">
          <h3 className="text-2xl font-heading text-foreground mb-4">
            Available Components
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading text-foreground mb-2">
                Core Components:
              </h4>
              <ul className="space-y-1 text-secondary-foreground font-paragraph text-sm">
                <li>
                  • <code>Price.Root</code> - Context provider, takes price
                  object
                </li>
                <li>
                  • <code>Price.Formatted</code> - Complete formatted price
                  string
                </li>
                <li>
                  • <code>Price.Amount</code> - Numeric amount only (no
                  currency)
                </li>
                <li>
                  • <code>Price.Currency</code> - Currency symbol or code
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-foreground mb-2">
                Price Object Structure:
              </h4>
              <div className="bg-background p-3 rounded text-xs font-paragraph">
                <pre>{`interface Price {
  money: {
    amount: number;
    currency?: string;
  };
  locale?: string;
  precision?: number;
  currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';
  currencySign?: 'standard' | 'accounting';
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceExamples;
